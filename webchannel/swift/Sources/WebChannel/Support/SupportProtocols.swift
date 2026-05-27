import Foundation

public enum ChannelType: Int, Sendable {
    case forwardChannel
    case backChannel
}

public enum ServerReachability: Int, Sendable {
    case requestMade
    case succeed
    case failed
    case backChannelActivity
}

public enum RequestReadyState: Int, Sendable {
    case uninitialized
    case loaded
    case interactive
    case complete
}

public enum RequestErrorCode: Int, Error, Sendable {
    case noError
    case accessDenied
    case fileNotFound
    case ffSilentError
    case customError
    case exception
    case httpError
    case abort
    case timeout
    case offline
}

public enum RequestStat: Int, Sendable {
    case connectAttempt
    case errorNetwork
    case errorOther
    case testStageOneStart
    case testStageTwoStart
    case testStageTwoDataOne
    case testStageTwoDataTwo
    case testStageTwoDataBoth
    case testStageOneFailed
    case testStageTwoFailed
    case proxy
    case noProxy
    case requestUnknownSessionId
    case requestBadStatus
    case requestIncompleteData
    case requestBadData
    case requestNoData
    case requestTimeout
    case backChannelMissing
    case backChannelDead
    case browserOffline
}

public final class FailureRecoveryContext {
    public init() {}
}

public protocol TimerToken: AnyObject {
    func cancel()
    var context: FailureRecoveryContext? { get }
}

public protocol RequestStateChangedHandler: AnyObject {
    func stateChanged(for request: HTTPRequest, responseData data: Data?)
}

public protocol HTTPRequest: AnyObject {
    var requestReadyStateChangeHandler: RequestStateChangedHandler? { get set }
    var requestReadyState: RequestReadyState { get }
    var requestErrorCode: RequestErrorCode { get }

    func responseHeader(forName name: String) -> String?
    func status() -> Int
    func sendPOST(url: URL, data: Data?, headers: [String: String]?, timeout: TimeInterval)
    func sendGET(url: URL, headers: [String: String]?, timeout: TimeInterval)
    func abort()
}

public protocol URLEncoderProtocol {
    func encode(_ string: String) -> String
}

public protocol LoggerProtocol {
    func debug(_ message: String)
    func info(_ message: String)
    func warning(_ message: String)
    func error(_ message: String)
}

public protocol JSONDecoderProtocol {
    func decode(_ data: Data) throws -> Any
}

public protocol SupportProtocol: AnyObject {
    var urlEncoder: URLEncoderProtocol { get }
    var logger: LoggerProtocol { get }
    var jsonDecoder: JSONDecoderProtocol { get }
    var dispatchQueue: DispatchQueue { get }

    func createHTTPRequest(handler: RequestStateChangedHandler) -> HTTPRequest
    func notifyStatEvent(_ event: RequestStat)
    func notifyServerReachabilityEvent(_ event: ServerReachability)
    func notifyTimingEvent(size: Int, rtt: TimeInterval, retries: Int)
    func notifyHandshakeTimingEvent(rtt: TimeInterval)

    func setTimeout(_ timeout: TimeInterval, block: @escaping () -> Void) -> TimerToken
    func setTimeout(_ timeout: TimeInterval, block: @escaping () -> Void, context: FailureRecoveryContext) -> TimerToken
    func clearTimeout(_ timer: TimerToken)
}
