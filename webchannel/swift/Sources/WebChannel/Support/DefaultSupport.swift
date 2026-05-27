import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif

public final class DefaultTimerToken: TimerToken {
    private var timerSource: DispatchSourceTimer?
    public var context: FailureRecoveryContext?

    public init(queue: DispatchQueue, timeout: TimeInterval, context: FailureRecoveryContext? = nil, block: @escaping () -> Void) {
        self.context = context
        let source = DispatchSource.makeTimerSource(queue: queue)
        source.schedule(deadline: .now() + timeout)
        source.setEventHandler { [weak self] in
            block()
            self?.cancel()
        }
        self.timerSource = source
        source.resume()
    }

    public func cancel() {
        timerSource?.cancel()
        timerSource = nil
    }

    deinit {
        cancel()
    }
}

public final class DefaultURLEncoder: URLEncoderProtocol {
    public init() {}
    public func encode(_ string: String) -> String {
        let allowed = CharacterSet.urlQueryAllowed
        return string.addingPercentEncoding(withAllowedCharacters: allowed) ?? string
    }
}

public final class DefaultLogger: LoggerProtocol {
    public init() {}
    public func debug(_ message: String) { print("[WebChannel DEBUG] \(message)") }
    public func info(_ message: String) { print("[WebChannel INFO] \(message)") }
    public func warning(_ message: String) { print("[WebChannel WARN] \(message)") }
    public func error(_ message: String) { print("[WebChannel ERROR] \(message)") }
}

public final class DefaultJSONDecoder: JSONDecoderProtocol {
    public init() {}
    public func decode(_ data: Data) throws -> Any {
        try JSONSerialization.jsonObject(with: data, options: [.fragmentsAllowed])
    }
}

public final class DefaultHTTPRequest: NSObject, HTTPRequest, URLSessionDataDelegate {
    public weak var requestReadyStateChangeHandler: RequestStateChangedHandler?
    public private(set) var requestReadyState: RequestReadyState = .uninitialized
    public private(set) var requestErrorCode: RequestErrorCode = .noError

    private let dispatchQueue: DispatchQueue
    private var session: URLSession?
    private var dataTask: URLSessionDataTask?
    private var httpResponse: HTTPURLResponse?

    public init(handler: RequestStateChangedHandler, dispatchQueue: DispatchQueue) {
        self.requestReadyStateChangeHandler = handler
        self.dispatchQueue = dispatchQueue
        super.init()
    }

    public func responseHeader(forName name: String) -> String? {
        httpResponse?.value(forHTTPHeaderField: name)
    }

    public func status() -> Int {
        httpResponse?.statusCode ?? 0
    }

    public func sendPOST(url: URL, data: Data?, headers: [String: String]?, timeout: TimeInterval) {
        var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: timeout)
        request.httpMethod = "POST"
        request.httpBody = data
        headers?.forEach { request.setValue($1, forHTTPHeaderField: $0) }
        beginFetch(request: request)
    }

    public func sendGET(url: URL, headers: [String: String]?, timeout: TimeInterval) {
        var request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: timeout)
        request.httpMethod = "GET"
        headers?.forEach { request.setValue($1, forHTTPHeaderField: $0) }
        beginFetch(request: request)
    }

    public func abort() {
        dataTask?.cancel()
        dataTask = nil
        session?.invalidateAndCancel()
        session = nil
    }

    private func beginFetch(request: URLRequest) {
        let config = URLSessionConfiguration.default
        let sessionQueue = OperationQueue()
        sessionQueue.underlyingQueue = dispatchQueue

        self.session = URLSession(configuration: config, delegate: self, delegateQueue: sessionQueue)
        self.dataTask = self.session?.dataTask(with: request)
        self.dataTask?.resume()
    }

    // MARK: - URLSessionDataDelegate

    public func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive response: URLResponse, completionHandler: @escaping (URLSession.ResponseDisposition) -> Void) {
        dispatchQueue.async { [weak self] in
            guard let self = self else {
                completionHandler(.cancel)
                return
            }
            self.httpResponse = response as? HTTPURLResponse
            self.requestReadyState = .loaded
            self.requestReadyStateChangeHandler?.stateChanged(for: self, responseData: nil)
            completionHandler(.allow)
        }
    }

    public func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        dispatchQueue.async { [weak self] in
            guard let self = self else { return }
            self.requestReadyState = .interactive
            self.requestReadyStateChangeHandler?.stateChanged(for: self, responseData: data)
        }
    }

    public func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        dispatchQueue.async { [weak self] in
            guard let self = self else { return }
            if let error = error {
                let nsError = error as NSError
                if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorTimedOut {
                    self.requestErrorCode = .timeout
                } else if nsError.domain == NSURLErrorDomain && nsError.code == NSURLErrorCancelled {
                    self.requestErrorCode = .abort
                } else {
                    self.requestErrorCode = .exception
                }
            } else if let status = self.httpResponse?.statusCode, status != 200 {
                self.requestErrorCode = .httpError
            }
            self.requestReadyState = .complete
            self.requestReadyStateChangeHandler?.stateChanged(for: self, responseData: nil)
        }
    }
}

public final class DefaultSupport: SupportProtocol {
    public let urlEncoder: URLEncoderProtocol
    public let logger: LoggerProtocol
    public let jsonDecoder: JSONDecoderProtocol
    public let dispatchQueue: DispatchQueue

    public init(dispatchQueue: DispatchQueue = DispatchQueue(label: "WebChannelClient", attributes: [])) {
        self.urlEncoder = DefaultURLEncoder()
        self.logger = DefaultLogger()
        self.jsonDecoder = DefaultJSONDecoder()
        self.dispatchQueue = dispatchQueue
    }

    public func createHTTPRequest(handler: RequestStateChangedHandler) -> HTTPRequest {
        DefaultHTTPRequest(handler: handler, dispatchQueue: dispatchQueue)
    }

    public func notifyStatEvent(_ event: RequestStat) {}
    public func notifyServerReachabilityEvent(_ event: ServerReachability) {}
    public func notifyTimingEvent(size: Int, rtt: TimeInterval, retries: Int) {}

    public func notifyHandshakeTimingEvent(rtt: TimeInterval) {
        NotificationCenter.default.post(
            name: WebChannelEventNotification.name,
            object: self,
            userInfo: [WebChannelEventNotification.handshakeRTTKey: rtt]
        )
    }

    public func setTimeout(_ timeout: TimeInterval, block: @escaping () -> Void) -> TimerToken {
        DefaultTimerToken(queue: dispatchQueue, timeout: timeout, block: block)
    }

    public func setTimeout(_ timeout: TimeInterval, block: @escaping () -> Void, context: FailureRecoveryContext) -> TimerToken {
        DefaultTimerToken(queue: dispatchQueue, timeout: timeout, context: context, block: block)
    }

    public func clearTimeout(_ timer: TimerToken) {
        timer.cancel()
    }
}
