import Foundation

public final class InternalChannelParams {
    public var forwardChannelMaxBatch: Int = 0
    public var forwardChannelRequestTimeout: TimeInterval = 0.0
    public var backChannelRequestTimeout: TimeInterval = 0.0

    public init() {}
}

public final class WebChannelOptions {
    public var messageHeaders: [String: String]?
    public var initialMessageHeaders: [String: String]?
    public var messageContentType: String?
    public var messageURLParams: [String: String]?
    public var clientProtocolHeaderRequired: Bool = false
    public var concurrentRequestLimit: Int = 1
    public var isSendingRawJSON: Bool = false
    public var httpSessionIDParam: String?
    public var isLongPollingForced: Bool = false
    public var shouldDetectBufferingProxy: Bool = false
    public var isFastHandshake: Bool = true
    public var isBlockingHandshake: Bool = false
    public var enableBinaryEncoding: Bool = false
    public var isRedactDisabled: Bool = false
    public var clientProfile: String?
    public var internalChannelParams: InternalChannelParams?

    public init() {}
}
