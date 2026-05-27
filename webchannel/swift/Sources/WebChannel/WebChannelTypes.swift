import Foundation

public enum WebChannelClientState: Int, Sendable {
    case closed
    case initStateType
    case opening
    case opened
}

public enum WebChannelClientError: Int, Error, Sendable {
    case none
    case requestFailed
    case loggedOut
    case noData
    case unknownSessionID
    case stop
    case network
    case badData
    case badResponse
}

public protocol WebChannelClientProtocol: AnyObject {
    func open()
    func close()
    func send(_ message: String)
    func send(data: Data)
}

public protocol WebChannelClientReadWrite: WebChannelClientProtocol {
    var messageURLParams: [String: String]? { get set }
    var runtimeProperties: RuntimeProperties? { get }
}

public protocol WebChannelClientHandlerDelegate: AnyObject {
    func webChannelOpened(_ client: WebChannelClientProtocol)
    func webChannelClosed(_ client: WebChannelClientProtocol)
    func webChannel(_ client: WebChannelClientProtocol, didReceiveMessage message: Any)
    func webChannel(_ client: WebChannelClientProtocol, encounteredError error: WebChannelClientError)
    func webChannel(_ client: WebChannelClientProtocol, didReceiveHeaders headers: [String: String], statusCode: Int)
    func webChannel(_ client: WebChannelClientProtocol, didReceiveMetadata metadata: Any, key: String)
}

public extension WebChannelClientHandlerDelegate {
    func webChannelOpened(_ client: WebChannelClientProtocol) {}
    func webChannelClosed(_ client: WebChannelClientProtocol) {}
    func webChannel(_ client: WebChannelClientProtocol, didReceiveMessage message: Any) {}
    func webChannel(_ client: WebChannelClientProtocol, encounteredError error: WebChannelClientError) {}
    func webChannel(_ client: WebChannelClientProtocol, didReceiveHeaders headers: [String: String], statusCode: Int) {}
    func webChannel(_ client: WebChannelClientProtocol, didReceiveMetadata metadata: Any, key: String) {}
}

public enum WebChannelEventNotification {
    public static let name = Notification.Name("kWCEventNotificationName")
    public static let handshakeRTTKey = "kWCEventNotificationHandshakeRttKey"
}
