import Foundation

public final class WebChannelClientInternal: WebChannelClientProtocol, WebChannelInternalHTTPHandler, RuntimePropertiesChannelDelegate {
    public weak var delegate: WebChannelClientHandlerDelegate?
    public private(set) var state: WebChannelClientState = .initStateType

    public var messageURLParams: [String: String]?
    public private(set) var runtimeProperties: RuntimeProperties?
    public var httpSessionIDParam: String?
    public var httpSessionID: String?
    public private(set) var sessionID: String = ""

    public var extraHeaders: [String: String] = [:]
    public var initialHeaders: [String: String] = [:]
    public private(set) var isStreamingEnabled: Bool = true
    public var forwardChannelMaxRetries: Int = 2
    public var forwardChannelRequestTimeout: TimeInterval = 20.0
    public private(set) var backChannelMaxRetries: Int = 3
    public private(set) var lastStatusCode: Int = -1
    public private(set) var lastResponseCount: Int = -1
    public private(set) var lastPostResponseCount: Int = -1
    public var error: WebChannelClientError = .none
    public private(set) var channelVersion: Int = 8

    public private(set) var backChannelRequest: ChannelRequest?
    public private(set) var outgoingMaps: [QueuedMap] = []
    public private(set) var nonAckedMaps: [QueuedMap] = []
    public private(set) var backChannelRetryCount: Int = 0
    public var forwardChannelFlushedCallback: AckCommitCallbackBlock?

    private let baseURL: String
    private let options: WebChannelOptions
    private let clientVersion: Int
    private let support: SupportProtocol
    private let dispatchQueue: DispatchQueue

    public let forwardChannelRequestPool: ForwardChannelRequestPool
    public let wireCodec: WireV8
    public let wireCodecBinary: WireV8Binary

    private var forwardChannelDelayTimer: TimerToken?
    private var backChannelDelayTimer: TimerToken?
    private var deadBackChannelTimer: TimerToken?
    private var bufferProxyDetectionTimer: TimerToken?

    private var handshakeRTT: TimeInterval = 0
    private var baseRetryDelay: TimeInterval = 5.0
    private var retryDelaySeed: TimeInterval = 10.0
    private var backChannelRequestTimeout: TimeInterval = 0.0

    private var nextRequestID: Int = 0
    private var nextMapID: Int = 0
    private var forwardChannelRetryCount: Int = 0
    private var backChannelAttemptID: Int = 0

    private var failFast: Bool = false
    private var detectBufferingProxy: Bool = false
    private var fastHandshake: Bool = true
    private var blockingHandshake: Bool = false
    private var enableBinaryEncoding: Bool = false
    private var bufferProxyDetectionDone: Bool = false
    private var sendRawJSON: Bool = false
    private var forwardRetryPendingMessagesScheduled: Bool = false
    private var forwardChannelRequestInProgress: Bool = false
    private var backChannelRequestInProgress: Bool = false

    private var nonAckedMapsWithClosedChannel: [QueuedMap] = []
    private var serverVersion: Int = 0

    public var nonAckedMessages: [String] {
        nonAckedMaps.compactMap { $0.map[rawDataKey] as? String }
    }

    public init(url baseURL: String, options: WebChannelOptions, delegate: WebChannelClientHandlerDelegate?, support: SupportProtocol, clientVersion: Int = 23) {
        self.baseURL = baseURL
        self.options = options
        self.delegate = delegate
        self.support = support
        self.clientVersion = clientVersion
        self.dispatchQueue = support.dispatchQueue

        self.wireCodec = WireV8(support: support)
        self.wireCodecBinary = WireV8Binary(support: support)
        self.forwardChannelRequestPool = ForwardChannelRequestPool(maxSize: options.concurrentRequestLimit)

        if options.isFastHandshake && options.enableBinaryEncoding {
            self.fastHandshake = false
        } else {
            self.fastHandshake = options.isFastHandshake
        }
        self.enableBinaryEncoding = options.enableBinaryEncoding
        self.isStreamingEnabled = true
        self.channelVersion = 8

        self.state = .initStateType
        self.runtimeProperties = RuntimeProperties(delegate: self)
    }

    public func open() {
        dispatchQueue.async { [weak self] in
            self?.connectWithSessionID(nil, responseID: nil)
        }
    }

    public func close() {
        dispatchQueue.async { [weak self] in
            self?.disconnect()
        }
    }

    public func send(_ message: String) {
        dispatchQueue.async { [weak self] in
            guard let self = self else { return }
            let map: [String: Any] = [rawDataKey: message]
            self.sendMap(map, context: nil)
        }
    }

    public func send(data: Data) {
        dispatchQueue.async { [weak self] in
            guard let self = self else { return }
            if !self.enableBinaryEncoding { return }
            let map: [String: Any] = [rawDataKey: data]
            self.sendMap(map, context: nil)
        }
    }

    private func sendMap(_ map: [String: Any], context: Any?) {
        let queuedMap = QueuedMap(mapID: nextMapID, map: map, context: context)
        nextMapID += 1
        outgoingMaps.append(queuedMap)
        nonAckedMaps.append(queuedMap)

        if state == .opened {
            checkForwardChannelAvailabilityThenStart()
        }
    }

    private func connectWithSessionID(_ sid: String?, responseID: String?) {
        state = .opening
        nextRequestID = Int.random(in: 0..<10000)

        guard var components = URLComponents(string: baseURL) else { return }
        var queryItems = components.queryItems ?? []
        queryItems.append(URLQueryItem(name: "VER", value: "\(channelVersion)"))
        queryItems.append(URLQueryItem(name: "RID", value: "\(nextRequestID)"))
        queryItems.append(URLQueryItem(name: "CVER", value: "\(clientVersion)"))
        components.queryItems = queryItems

        nextRequestID += 1

        let req = ChannelRequest(sessionID: sessionID, requestID: "\(nextRequestID)", support: support, delegate: self, retryID: 0)
        req.timeout = forwardChannelRequestTimeout
        req.extraHeaders = extraHeaders
        req.sendGET(urlComponents: components, chunkDecoded: true)
    }

    private func disconnect() {
        if state == .closed { return }
        state = .closed
        backChannelRequest?.cancel()
        backChannelRequest = nil
        forwardChannelRequestPool.cancel()
        delegate?.webChannelClosed(self)
    }

    // MARK: - WebChannelInternalHTTPHandler

    public func didReceiveInput(_ input: String, withRequest request: ChannelRequest) {
        guard state != .closed else { return }
        if state == .opening {
            state = .opened
            delegate?.webChannelOpened(self)
        }
        guard let data = input.data(using: .utf8) else { return }
        do {
            let decoded = try wireCodec.decodeMessage(data, level: 3)
            if let array = decoded as? [Any] {
                for item in array {
                    delegate?.webChannel(self, didReceiveMessage: item)
                }
            }
        } catch {
            delegate?.webChannel(self, encounteredError: .badData)
        }
    }

    public func handleCompleteRequest(_ request: ChannelRequest) {
        lastStatusCode = request.lastStatusCode
        if !request.isSuccessful {
            signalError(.requestFailed)
        }
    }

    public func didReceivedFirstByteOfRequest(_ request: ChannelRequest, responseText: String) {}

    private func signalError(_ err: WebChannelClientError) {
        error = err
        delegate?.webChannel(self, encounteredError: err)
    }

    private func checkForwardChannelAvailabilityThenStart() {
        if outgoingMaps.isEmpty || forwardChannelRequestPool.isFull { return }
        let mapsToSend = outgoingMaps
        outgoingMaps.removeAll()

        guard var components = URLComponents(string: baseURL) else { return }
        var queryItems = components.queryItems ?? []
        queryItems.append(URLQueryItem(name: "SID", value: sessionID))
        queryItems.append(URLQueryItem(name: "RID", value: "\(nextRequestID)"))
        queryItems.append(URLQueryItem(name: "AID", value: "\(lastPostResponseCount)"))
        components.queryItems = queryItems
        nextRequestID += 1

        let req = ChannelRequest(sessionID: sessionID, requestID: "\(nextRequestID)", support: support, delegate: self, retryID: forwardChannelRetryCount)
        req.pendingMessages = mapsToSend
        req.timeout = forwardChannelRequestTimeout
        req.extraHeaders = extraHeaders

        let encodedBody = wireCodec.encodeMessageQueue(mapsToSend, count: mapsToSend.count)
        req.sendPOST(urlComponents: components, postData: encodedBody, chunkDecoded: true)
        forwardChannelRequestPool.addRequest(req)
    }

    private func checkForwardChannelFlush() {
        if outgoingMaps.isEmpty && forwardChannelRequestPool.requestCount == 0 {
            forwardChannelFlushedCallback?()
            forwardChannelFlushedCallback = nil
        }
    }
}
