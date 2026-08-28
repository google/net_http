import Foundation

public final class WebChannelClientInternal: WebChannelClientProtocol, WebChannelInternalHTTPHandler, RuntimePropertiesChannelDelegate {
    public weak var ownerClient: WebChannelClientProtocol?
    public weak var delegate: WebChannelClientHandlerDelegate?
    public private(set) var state: WebChannelClientState = .initStateType

    public var messageURLParams: [String: String]? {
        didSet {
            if let params = messageURLParams {
                params.forEach { extraParams[$0] = $1 }
            }
        }
    }
    public private(set) var runtimeProperties: RuntimeProperties?
    public var httpSessionIDParam: String?
    public var httpSessionID: String?
    public private(set) var sessionID: String = ""

    public var extraHeaders: [String: String] = [:]
    public var initialHeaders: [String: String] = [:]
    public var extraParams: [String: String] = [:]
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

    private var forwardChannelURL: URL?
    private var backChannelURL: URL?

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

    public init(url baseURL: String, options: WebChannelOptions, delegate: WebChannelClientHandlerDelegate?, support: SupportProtocol, clientVersion: Int = 23, ownerClient: WebChannelClientProtocol? = nil) {
        self.baseURL = baseURL
        self.options = options
        self.delegate = delegate
        self.support = support
        self.clientVersion = clientVersion > 0 ? clientVersion : 23
        self.dispatchQueue = support.dispatchQueue
        self.ownerClient = ownerClient

        self.wireCodec = WireV8(support: support)
        self.wireCodecBinary = WireV8Binary(support: support)
        self.forwardChannelRequestPool = ForwardChannelRequestPool(maxSize: options.concurrentRequestLimit)

        if options.isFastHandshake && options.enableBinaryEncoding {
            support.logger.warning("Ignore fastHandshake because binary encoding is set.")
            self.fastHandshake = false
        } else {
            self.fastHandshake = options.isFastHandshake
        }
        self.enableBinaryEncoding = options.enableBinaryEncoding
        self.isStreamingEnabled = !options.isLongPollingForced
        self.channelVersion = 8

        self.state = .initStateType
        self.runtimeProperties = RuntimeProperties(delegate: self)

        configureByOptions(options)
    }

    private func configureByOptions(_ options: WebChannelOptions) {
        var localParams = extraParams
        if let msgParams = options.messageURLParams {
            msgParams.forEach { localParams[$0] = $1 }
        }
        var headers: [String: String] = [:]
        if options.clientProtocolHeaderRequired {
            headers["X-Client-Protocol"] = "webchannel"
        }
        if let msgHeaders = options.messageHeaders {
            msgHeaders.forEach { headers[$0] = $1 }
        }
        self.extraHeaders = headers

        var initHeaders = options.initialMessageHeaders ?? [:]
        if let contentType = options.messageContentType {
            initHeaders["X-WebChannel-Content-Type"] = contentType
        }
        if let profile = options.clientProfile {
            initHeaders["X-WebChannel-Client-Profile"] = profile
        }
        self.initialHeaders = initHeaders
        self.sendRawJSON = options.isSendingRawJSON

        if let param = options.httpSessionIDParam?.trimmingCharacters(in: .whitespaces), !param.isEmpty {
            self.httpSessionIDParam = param
            localParams.removeValue(forKey: param)
        }

        self.blockingHandshake = options.isBlockingHandshake
        self.extraParams = localParams
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
        if state == .closed {
            support.logger.warning("Invalid operation: sending map when state is closed.")
        }
        let queuedMap = QueuedMap(mapID: nextMapID, map: map, context: context)
        nextMapID += 1
        outgoingMaps.append(queuedMap)
        nonAckedMaps.append(queuedMap)

        if state == .opened {
            checkForwardChannelAvailabilityThenStart()
        }
    }

    private func connectWithSessionID(_ sid: String?, responseID: String?) {
        support.notifyStatEvent(.connectAttempt)
        if sid != nil && responseID != nil {
            extraParams["OSID"] = sid
            extraParams["OAID"] = responseID
        }
        if state == .initStateType || state == .closed {
            forwardChannelURL = createDataURL(baseURL)
            checkForwardChannelAvailabilityThenStart()
        }
    }

    private func createDataURL(_ path: String) -> URL? {
        guard var components = URLComponents(string: path) else { return nil }
        if let param = httpSessionIDParam, !param.isEmpty, let sid = httpSessionID, !sid.isEmpty {
            addQueryParameter(to: &components, name: param, value: sid)
        }
        addQueryParameter(to: &components, name: "VER", value: "\(channelVersion)")
        extraParams.forEach { addQueryParameter(to: &components, name: $0, value: $1) }
        return components.url
    }

    private func addQueryParameter(to components: inout URLComponents, name: String, value: String) {
        var items = components.queryItems ?? []
        items.append(URLQueryItem(name: name, value: value))
        components.queryItems = items
    }

    private func checkForwardChannelAvailabilityThenStart() {
        if forwardChannelRequestPool.isFull || forwardChannelRequestInProgress {
            return
        }
        forwardChannelRequestInProgress = true
        forwardChannelRetryCount = 0
        dispatchQueue.async { [weak self] in
            guard let self = self else { return }
            self.forwardChannelRequestInProgress = false
            self.startForwardChannelWithRetryRequest(nil)
        }
    }

    private func checkBackChannelAvailabilityThenStart() {
        if backChannelRequest != nil || backChannelRequestInProgress {
            return
        }
        backChannelRequestInProgress = true
        backChannelRetryCount = 0
        dispatchQueue.async { [weak self] in
            guard let self = self else { return }
            self.onStartBackChannelTimer()
        }
    }

    private func onStartBackChannelTimer() {
        clearBackChannelDelayTimer()
        backChannelRequestInProgress = false
        startBackChannel()
    }

    private func startForwardChannelWithRetryRequest(_ retryRequest: ChannelRequest?) {
        forwardChannelRequestInProgress = false
        guard shouldMakeRequest() else { return }

        if state == .initStateType {
            if retryRequest != nil { return }
            openForwardChannel()
        } else if state == .opened {
            if let retry = retryRequest {
                makeForwardChannelRequest(retry)
                return
            }
            if outgoingMaps.isEmpty || forwardChannelRequestPool.isFull { return }
            makeForwardChannelRequest(nil)
        }
    }

    private func openForwardChannel() {
        support.logger.debug("Opening Forward Channel.")
        nextRequestID = Int.random(in: 0..<100000)
        let requestID = "\(nextRequestID)"
        nextRequestID += 1

        let request = ChannelRequest(sessionID: "", requestID: requestID, support: support, delegate: self)
        request.timeout = forwardChannelRequestTimeout > 0 ? forwardChannelRequestTimeout : 20.0
        var headers = extraHeaders
        initialHeaders.forEach { headers[$0] = $1 }
        request.extraHeaders = headers

        guard let fwdURL = forwardChannelURL, var components = URLComponents(url: fwdURL, resolvingAgainstBaseURL: false) else { return }
        addQueryParameter(to: &components, name: "RID", value: requestID)
        if clientVersion > 0 {
            addQueryParameter(to: &components, name: "CVER", value: "\(clientVersion)")
        }
        if let param = httpSessionIDParam, !param.isEmpty {
            addQueryParameter(to: &components, name: "X-HTTP-Session-Id", value: param)
        }
        if blockingHandshake {
            addQueryParameter(to: &components, name: "TYPE", value: "init")
        }

        let maxNum = fastHandshake ? maxNumMessageForFastHandshake() : 1000
        if enableBinaryEncoding {
            var requestData = Data()
            request.pendingMessages = pendingMessagesWithMaxBinary(maxNum, requestData: &requestData)
            request.isBinaryMessage = true
            forwardChannelRequestPool.addRequest(request)
            request.sendPOST(urlComponents: components, postData: requestData, chunkDecoded: true)
        } else {
            var requestText = ""
            request.pendingMessages = pendingMessagesWithMax(maxNum, requestText: &requestText)
            forwardChannelRequestPool.addRequest(request)

            if fastHandshake {
                addQueryParameter(to: &components, name: "$req", value: requestText)
                addQueryParameter(to: &components, name: "sid", value: "null")
                request.isInitialResponseDecoded = true
                request.sendPOST(urlComponents: components, postData: "", chunkDecoded: true)
            } else {
                request.sendPOST(urlComponents: components, postData: requestText, chunkDecoded: true)
            }
        }
        state = .opening
    }

    private func startBackChannel() {
        guard shouldMakeRequest() else { return }
        let request = ChannelRequest(sessionID: sessionID, requestID: "rpc", support: support, delegate: self, retryID: backChannelAttemptID)
        request.timeout = backChannelRequestTimeout > 0 ? backChannelRequestTimeout : 30.0
        request.extraHeaders = extraHeaders

        guard let fwdURL = forwardChannelURL, var components = URLComponents(url: fwdURL, resolvingAgainstBaseURL: false) else { return }
        addQueryParameter(to: &components, name: "RID", value: "rpc")
        addQueryParameter(to: &components, name: "SID", value: sessionID)
        addQueryParameter(to: &components, name: "CI", value: isStreamingEnabled ? "0" : "1")
        addQueryParameter(to: &components, name: "AID", value: "\(lastResponseCount)")
        addQueryParameter(to: &components, name: "TYPE", value: "xmlhttp")

        self.backChannelRequest = request
        request.sendGET(urlComponents: components, chunkDecoded: true)
    }

    private func makeForwardChannelRequest(_ retryRequest: ChannelRequest?) {
        let requestID: String
        if let retry = retryRequest {
            requestID = retry.requestID
        } else {
            requestID = "\(nextRequestID)"
            nextRequestID += 1
        }

        guard let fwdURL = forwardChannelURL, var components = URLComponents(url: fwdURL, resolvingAgainstBaseURL: false) else { return }
        addQueryParameter(to: &components, name: "SID", value: sessionID)
        addQueryParameter(to: &components, name: "RID", value: requestID)
        addQueryParameter(to: &components, name: "AID", value: "\(lastResponseCount)")

        let request = ChannelRequest(sessionID: sessionID, requestID: requestID, support: support, delegate: self)
        request.timeout = forwardChannelRequestTimeout > 0 ? forwardChannelRequestTimeout : 20.0
        request.extraHeaders = extraHeaders

        if let retry = retryRequest {
            requeuePendingMaps(retry)
        }

        if enableBinaryEncoding {
            var requestData = Data()
            request.pendingMessages = pendingMessagesWithMaxBinary(1000, requestData: &requestData)
            request.isBinaryMessage = true
            forwardChannelRequestPool.addRequest(request)
            request.sendPOST(urlComponents: components, postData: requestData, chunkDecoded: true)
        } else {
            var requestText = ""
            request.pendingMessages = pendingMessagesWithMax(1000, requestText: &requestText)
            forwardChannelRequestPool.addRequest(request)
            request.sendPOST(urlComponents: components, postData: requestText, chunkDecoded: true)
        }
    }

    private func maxNumMessageForFastHandshake() -> Int {
        var total = 0
        for (i, map) in outgoingMaps.enumerated() {
            let size = map.rawDataSize
            if size <= 0 { break }
            total += size
            if total > 4096 { return i }
            if total == 4096 || i == outgoingMaps.count - 1 { return i + 1 }
        }
        return 1000
    }

    private func pendingMessagesWithMax(_ maxNum: Int, requestText: inout String) -> [QueuedMap] {
        let count = min(outgoingMaps.count, maxNum)
        let pending = Array(outgoingMaps.prefix(count))
        requestText += wireCodec.encodeMessageQueue(pending, count: count)
        outgoingMaps.removeFirst(count)
        return pending
    }

    private func pendingMessagesWithMaxBinary(_ maxNum: Int, requestData: inout Data) -> [QueuedMap] {
        let count = min(outgoingMaps.count, maxNum)
        let pending = Array(outgoingMaps.prefix(count))
        requestData.append(wireCodecBinary.encodeMessageQueue(pending, count: count))
        outgoingMaps.removeFirst(count)
        return pending
    }

    private func requeuePendingMaps(_ retryRequest: ChannelRequest) {
        outgoingMaps.insert(contentsOf: retryRequest.pendingMessages, at: 0)
    }

    private func shouldMakeRequest() -> Bool {
        if error != .none {
            signalError(error)
            return false
        }
        return true
    }

    private func signalError(_ err: WebChannelClientError) {
        support.logger.error("Error code: \(err)")
        error = err
        state = .closed
        triggerEncounteredError(err)
        onClose()
        cancelRequests()
    }

    private func triggerOpened() {
        let client = ownerClient ?? self
        delegate?.webChannelOpened(client)
    }

    private func triggerClosedWithPendingData(_ pending: [QueuedMap], undelivered: [QueuedMap]) {
        let client = ownerClient ?? self
        delegate?.webChannelClosed(client)
    }

    private func triggerDidReceiveMessage(_ message: Any) {
        let client = ownerClient ?? self
        guard let del = delegate else { return }

        if let dict = message as? [String: Any], let headers = dict["__headers__"] as? [String: String], let statusStr = dict["__status__"] as? String, let status = Int(statusStr) {
            del.webChannel(client, didReceiveHeaders: headers, statusCode: status)
            return
        }
        if let dict = message as? [String: Any], let metadataJSON = dict["__sm__"] {
            if let metaDict = metadataJSON as? [String: Any], let firstKey = metaDict.keys.first {
                del.webChannel(client, didReceiveMetadata: metaDict[firstKey] ?? "", key: firstKey)
            } else {
                del.webChannel(client, didReceiveMetadata: "", key: "")
            }
            return
        }
        del.webChannel(client, didReceiveMessage: message)
    }

    private func triggerEncounteredError(_ err: WebChannelClientError) {
        let client = ownerClient ?? self
        delegate?.webChannel(client, encounteredError: err)
    }

    // MARK: - WebChannelInternalHTTPHandler

    public func didReceiveInput(_ input: String, withRequest request: ChannelRequest) {
        guard state != .closed else { return }
        guard let data = input.data(using: .utf8) else { return }

        if !request.isInitialResponseDecoded && forwardChannelRequestPool.hasRequest(request) && state == .opened {
            if let responseArray = (try? wireCodec.decodeMessage(data, level: 1)) as? [Any], responseArray.count == 3 {
                handlePOSTResponse(responseArray, request: request)
                checkForwardChannelFlush()
            } else {
                signalError(.badResponse)
            }
        } else {
            if request.isInitialResponseDecoded || (backChannelRequest != nil && backChannelRequest === request) {
                clearDeadBackchannelTimer()
            }
            do {
                let decoded = try wireCodec.decodeMessage(data, level: 3)
                if let batched = decoded as? [[Any]] {
                    processInput(batched, request: request)
                } else if let singleBatch = decoded as? [Any] {
                    processInput([singleBatch], request: request)
                }
            } catch {
                signalError(.badData)
            }
        }
    }

    private func processInput(_ pendingBatchedResponses: [[Any]], request: ChannelRequest) {
        for nextBatch in pendingBatchedResponses {
            guard nextBatch.count >= 2 else { continue }
            if let countNum = nextBatch[0] as? Int {
                lastResponseCount = countNum
            } else if let countStr = nextBatch[0] as? String, let countNum = Int(countStr) {
                lastResponseCount = countNum
            }
            let nextResponseObject = nextBatch[1]
            if state == .opening {
                parseResponseObjectAtOpening(nextResponseObject, request: request)
            } else if state == .opened {
                parseResponseObjectAtOpened(nextResponseObject)
            }
        }
    }

    private func parseResponseObjectAtOpening(_ nextResponseObject: Any, request: ChannelRequest) {
        if let responsesAtOpening = nextResponseObject as? [Any], responsesAtOpening.count > 0, let type = responsesAtOpening[0] as? String, type == "c" {
            if responsesAtOpening.count >= 2, let sid = responsesAtOpening[1] as? String {
                self.sessionID = sid
            }
            if responsesAtOpening.count >= 4, let ver = responsesAtOpening[3] as? Int {
                self.channelVersion = ver
            }
            if responsesAtOpening.count >= 5, let sver = responsesAtOpening[4] as? Int {
                self.serverVersion = sver
            }
            if responsesAtOpening.count >= 6 {
                let serverKeepAliveMS: Double
                if let d = responsesAtOpening[5] as? Double {
                    serverKeepAliveMS = d
                } else if let i = responsesAtOpening[5] as? Int {
                    serverKeepAliveMS = Double(i)
                } else {
                    serverKeepAliveMS = 0
                }
                if serverKeepAliveMS > 0 {
                    self.backChannelRequestTimeout = round(2.1 * serverKeepAliveMS / 1000.0)
                }
            }

            applyControlHeaders(request)
            state = .opened
            triggerOpened()

            startBackChannelAfterHandshake(request)
            if !outgoingMaps.isEmpty {
                checkForwardChannelAvailabilityThenStart()
            }
        } else if let arr = nextResponseObject as? [String], let first = arr.first, first == "stop" || first == "close" {
            signalError(.stop)
        }
    }

    private func parseResponseObjectAtOpened(_ nextResponseObject: Any) {
        if let arr = nextResponseObject as? [Any], let first = arr.first as? String {
            if first == "stop" {
                signalError(.stop)
                return
            } else if first == "close" {
                disconnect()
                return
            } else if first == "noop" {
                return
            }
        }
        triggerDidReceiveMessage(nextResponseObject)
        backChannelRetryCount = 0
    }

    private func startBackChannelAfterHandshake(_ request: ChannelRequest) {
        backChannelURL = createDataURL(baseURL)
        if request.isInitialResponseDecoded {
            forwardChannelRequestPool.removeRequest(request)
            request.timeout = backChannelRequestTimeout
            backChannelRequest = request
        } else {
            checkBackChannelAvailabilityThenStart()
        }
    }

    private func applyControlHeaders(_ request: ChannelRequest) {
        guard let req = request.httpRequest else { return }
        if let param = httpSessionIDParam, !param.isEmpty {
            if let sidHeader = req.responseHeader(forName: "X-HTTP-Session-Id"), !sidHeader.isEmpty {
                self.httpSessionID = sidHeader
                if let url = forwardChannelURL, var comp = URLComponents(url: url, resolvingAgainstBaseURL: true) {
                    addQueryParameter(to: &comp, name: param, value: sidHeader)
                    forwardChannelURL = comp.url
                }
            }
        }
    }

    private func handlePOSTResponse(_ responseArray: [Any], request: ChannelRequest) {
        if responseArray.count >= 2 {
            if let postCount = responseArray[1] as? Int {
                lastPostResponseCount = postCount
            } else if let postStr = responseArray[1] as? String, let postCount = Int(postStr) {
                lastPostResponseCount = postCount
            }
        }
    }

    public func handleCompleteRequest(_ request: ChannelRequest) {
        lastStatusCode = request.lastStatusCode
        if backChannelRequest === request {
            clearDeadBackchannelTimer()
            clearBufferProxyDetectionTimer()
            backChannelRequest = nil
            if state == .opened {
                checkBackChannelAvailabilityThenStart()
            }
        } else if forwardChannelRequestPool.hasRequest(request) {
            forwardChannelRequestPool.removeRequest(request)
            if state == .opened {
                checkForwardChannelAvailabilityThenStart()
            }
        }
    }

    public func didReceivedFirstByteOfRequest(_ request: ChannelRequest, responseText: String) {}

    private func cancelRequests() {
        cancelBackChannelRequest()
        clearBufferProxyDetectionTimer()
        clearDeadBackchannelTimer()
        forwardChannelRequestPool.cancel()
    }

    private func cancelBackChannelRequest() {
        if let req = backChannelRequest {
            clearBufferProxyDetectionTimer()
            req.cancel()
            backChannelRequest = nil
        }
    }

    private func disconnect() {
        cancelRequests()
        if state == .opened {
            let rid = nextRequestID
            nextRequestID += 1
            if let url = forwardChannelURL, var components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
                addQueryParameter(to: &components, name: "SID", value: sessionID)
                addQueryParameter(to: &components, name: "RID", value: "\(rid)")
                addQueryParameter(to: &components, name: "TYPE", value: "terminate")
                let req = ChannelRequest(sessionID: sessionID, requestID: "\(rid)", support: support, delegate: self)
                req.close(urlComponents: components)
            }
        }
        onClose()
    }

    private func onClose() {
        state = .closed
        nonAckedMapsWithClosedChannel = []
        let pending = forwardChannelRequestPool.pendingMessages
        let undelivered = outgoingMaps
        nonAckedMapsWithClosedChannel.append(contentsOf: pending)
        nonAckedMapsWithClosedChannel.append(contentsOf: undelivered)
        forwardChannelRequestPool.clearPendingMessages()
        outgoingMaps.removeAll()
        triggerClosedWithPendingData(pending, undelivered: undelivered)
    }

    private func checkForwardChannelFlush() {
        if forwardChannelRequestPool.requestCount <= 1 {
            forwardChannelFlushedCallback?()
            forwardChannelFlushedCallback = nil
        }
    }

    private func clearDeadBackchannelTimer() {
        if let t = deadBackChannelTimer {
            support.clearTimeout(t)
            deadBackChannelTimer = nil
        }
    }

    private func clearBufferProxyDetectionTimer() {
        if let t = bufferProxyDetectionTimer {
            support.clearTimeout(t)
            bufferProxyDetectionTimer = nil
        }
    }

    private func clearForwardChannelDelayTimer() {
        if let t = forwardChannelDelayTimer {
            support.clearTimeout(t)
            forwardChannelDelayTimer = nil
        }
    }

    private func clearBackChannelDelayTimer() {
        if let t = backChannelDelayTimer {
            support.clearTimeout(t)
            backChannelDelayTimer = nil
        }
    }
}
