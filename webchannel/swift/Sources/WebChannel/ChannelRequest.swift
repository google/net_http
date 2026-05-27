import Foundation

public enum ChannelRequestError: Int, Error, Sendable {
    case unknown
    case status
    case noData
    case timeout
    case unknownSessionId
    case badData
    case handlerException
    case browserOffline
}

public enum ChannelRequestType: Int, Sendable {
    case initialHandshake
    case channelSession
    case closeRequest
}

public enum ChannelRequestDecodeResult: Int, Sendable {
    case success
    case incomplete
    case invalid
}

public final class ChannelRequest: RequestStateChangedHandler {
    public let sessionID: String
    public let requestID: String
    public let retryID: Int
    public weak var delegate: WebChannelInternalHTTPHandler?
    public let support: SupportProtocol

    public var extraHeaders: [String: String] = [:]
    public var pendingMessages: [QueuedMap] = []
    public var timeout: TimeInterval = 0
    public private(set) var lastStatusCode: Int = 0
    public private(set) var isSuccessful: Bool = false
    public private(set) var firstByteReceived: Bool = false
    public private(set) var isCancelled: Bool = false
    public private(set) var isPOST: Bool = false
    public private(set) var postData: Data?
    public private(set) var requestStartTime: Date?
    public private(set) var responseData: Data = Data()
    public private(set) var lastError: ChannelRequestError = .unknown

    public var isInitialResponseDecoded: Bool = false
    public var isBinaryMessage: Bool = false

    public private(set) var httpRequest: HTTPRequest?
    private var readyStateTimer: TimerToken?
    private var cleanedUp: Bool = false
    private var chunkStart: Int = 0
    private var baseURLComponents: URLComponents?
    private var type: ChannelRequestType = .channelSession
    private var chunkDecoded: Bool = false
    private var decodeInitialResponse: Bool = false

    public var isLastErrorFatal: Bool {
        switch lastError {
        case .unknownSessionId, .status, .badData:
            return true
        default:
            return false
        }
    }

    public init(sessionID: String, requestID: String, support: SupportProtocol, delegate: WebChannelInternalHTTPHandler?, retryID: Int = 0) {
        self.sessionID = sessionID
        self.requestID = requestID
        self.support = support
        self.delegate = delegate
        self.retryID = retryID
    }

    public func sendPOST(urlComponents: URLComponents, postData: String, chunkDecoded: Bool) {
        self.isPOST = true
        self.postData = postData.data(using: .utf8)
        self.baseURLComponents = urlComponents
        self.chunkDecoded = chunkDecoded
        send()
    }

    public func sendPOST(urlComponents: URLComponents, postData: Data, chunkDecoded: Bool) {
        self.isPOST = true
        self.postData = postData
        self.baseURLComponents = urlComponents
        self.chunkDecoded = chunkDecoded
        send()
    }

    public func sendGET(urlComponents: URLComponents, chunkDecoded: Bool) {
        self.isPOST = false
        self.postData = nil
        self.baseURLComponents = urlComponents
        self.chunkDecoded = chunkDecoded
        send()
    }

    public func close(urlComponents: URLComponents) {
        self.type = .closeRequest
        self.isPOST = false
        self.baseURLComponents = urlComponents
        self.chunkDecoded = false
        send()
    }

    public func cancel() {
        if isCancelled { return }
        isCancelled = true
        cleanup()
    }

    private func send() {
        requestStartTime = Date()
        startReadyStateTimer()

        guard var components = baseURLComponents else { return }
        var items = components.queryItems ?? []
        items.append(URLQueryItem(name: "t", value: "\(retryID)"))
        components.queryItems = items
        self.baseURLComponents = components

        chunkStart = 0
        let req = support.createHTTPRequest(handler: self)
        self.httpRequest = req

        var headers = extraHeaders
        if isPOST {
            headers["Content-Type"] = isBinaryMessage ? "application/x-protobuf" : "application/x-www-form-urlencoded;charset=utf-8"
            if let url = components.url {
                req.sendPOST(url: url, data: postData, headers: headers, timeout: timeout)
            }
        } else {
            if let url = components.url {
                req.sendGET(url: url, headers: headers, timeout: timeout)
            }
        }
        support.notifyServerReachabilityEvent(.requestMade)
    }

    public func stateChanged(for request: HTTPRequest, responseData data: Data?) {
        if cleanedUp { return }
        if let data = data {
            responseData.append(data)
        }
        handleReadyStateChange()
    }

    private func handleReadyStateChange() {
        guard let req = httpRequest else { return }
        let readyState = req.requestReadyState
        let errorCode = req.requestErrorCode
        let statusCode = req.status()

        if readyState == .uninitialized || readyState == .loaded && responseData.isEmpty {
            return
        }

        notifyServerReachability(readyState: readyState, errorCode: errorCode, statusCode: statusCode)
        cancelReadyStateTimer()

        lastStatusCode = statusCode
        isSuccessful = (statusCode == 200)

        guard let responseText = String(data: responseData, encoding: .utf8) else { return }

        if !isSuccessful {
            handleReadyStateChangedFailureStatusCode(statusCode: statusCode, responseText: responseText)
            return
        }

        if shouldCheckInitialResponse() && !checkInitialResponse() {
            return
        }

        if chunkDecoded {
            decodeNextChunks(responseText: responseText, readyState: readyState)
        } else {
            didReceiveRequestData(responseText)
        }

        if readyState == .complete {
            cleanup()
        }

        if isSuccessful && !isCancelled {
            if readyState == .complete {
                delegate?.handleCompleteRequest(self)
            } else {
                isSuccessful = false
                startReadyStateTimer()
            }
        }
    }

    private func shouldCheckInitialResponse() -> Bool {
        decodeInitialResponse && !isInitialResponseDecoded
    }

    private func checkInitialResponse() -> Bool {
        guard let initialResponse = httpRequest?.responseHeader(forName: "X-HTTP-Initial-Response") else {
            isSuccessful = false
            lastError = .unknownSessionId
            support.notifyStatEvent(.requestUnknownSessionId)
            cleanup()
            dispatchFailure()
            return false
        }
        isInitialResponseDecoded = true
        didReceiveRequestData(initialResponse)
        return true
    }

    private func didReceiveRequestData(_ data: String) {
        delegate?.didReceiveInput(data, withRequest: self)
        support.notifyServerReachabilityEvent(.backChannelActivity)
    }

    public func decodeNextChunks(responseText: String, readyState: RequestReadyState) {
        var decodeNextChunksSuccessful = true
        while !isCancelled && chunkStart < responseText.utf16.count {
            var result: ChannelRequestDecodeResult = .invalid
            if let chunkText = nextChunk(from: responseText, result: &result) {
                didReceiveRequestData(chunkText)
            } else if result == .incomplete {
                if readyState == .complete {
                    lastError = .badData
                    support.notifyStatEvent(.requestIncompleteData)
                    decodeNextChunksSuccessful = false
                }
                break
            } else if result == .invalid {
                lastError = .badData
                support.notifyStatEvent(.requestBadData)
                decodeNextChunksSuccessful = false
                break
            }
        }

        if readyState == .complete && responseText.isEmpty {
            lastError = .noData
            support.notifyStatEvent(.requestNoData)
            decodeNextChunksSuccessful = false
        }

        isSuccessful = isSuccessful && decodeNextChunksSuccessful
        if !decodeNextChunksSuccessful {
            cleanup()
            dispatchFailure()
        } else if !responseText.isEmpty && !firstByteReceived {
            firstByteReceived = true
            delegate?.didReceivedFirstByteOfRequest(self, responseText: responseText)
        }
    }

    private func nextChunk(from responseText: String, result: inout ChannelRequestDecodeResult) -> String? {
        let utf16 = responseText.utf16
        let startIndex = utf16.index(utf16.startIndex, offsetBy: chunkStart)
        guard let newlineIndex = utf16[startIndex...].firstIndex(of: 10) else { // '\n' = 10
            result = .incomplete
            return nil
        }

        guard let sizeStr = String(utf16[startIndex..<newlineIndex]), let size = Int(sizeStr), size >= 0 else {
            result = .invalid
            return nil
        }

        let chunkStartIndex = utf16.index(after: newlineIndex)
        guard let chunkEndIndex = utf16.index(chunkStartIndex, offsetBy: size, limitedBy: utf16.endIndex) else {
            result = .incomplete
            return nil
        }

        let chunkText = String(utf16[chunkStartIndex..<chunkEndIndex])
        chunkStart = utf16.distance(from: utf16.startIndex, to: chunkEndIndex)
        result = .success
        return chunkText
    }

    private func handleReadyStateChangedFailureStatusCode(statusCode: Int, responseText: String) {
        if statusCode == 400 && responseText.contains("Unknown Session ID") {
            lastError = .unknownSessionId
            support.notifyStatEvent(.requestUnknownSessionId)
        } else {
            lastError = .status
            support.notifyStatEvent(.requestBadStatus)
        }
        cleanup()
        dispatchFailure()
    }

    private func notifyServerReachability(readyState: RequestReadyState, errorCode: RequestErrorCode, statusCode: Int) {
        if !isCancelled && readyState == .complete && errorCode != .abort {
            if errorCode == .timeout || statusCode <= 0 {
                support.notifyServerReachabilityEvent(.failed)
            } else {
                support.notifyServerReachabilityEvent(.succeed)
            }
        }
    }

    private func cleanup() {
        cancelReadyStateTimer()
        if let req = httpRequest {
            req.abort()
            httpRequest = nil
            cleanedUp = true
        }
    }

    private func startReadyStateTimer() {
        readyStateTimer = support.setTimeout(timeout) { [weak self] in
            self?.handleTimeout()
        }
    }

    private func cancelReadyStateTimer() {
        if let timer = readyStateTimer {
            support.clearTimeout(timer)
            readyStateTimer = nil
        }
    }

    private func handleTimeout() {
        if type != .closeRequest {
            support.notifyServerReachabilityEvent(.failed)
            support.notifyStatEvent(.requestTimeout)
        }
        cleanup()
        lastError = .timeout
        dispatchFailure()
    }

    private func dispatchFailure() {
        if !isCancelled {
            delegate?.handleCompleteRequest(self)
        }
    }
}
