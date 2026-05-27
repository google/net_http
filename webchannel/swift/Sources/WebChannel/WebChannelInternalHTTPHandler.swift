import Foundation

public protocol WebChannelInternalHTTPHandler: AnyObject {
    func didReceiveInput(_ input: String, withRequest request: ChannelRequest)
    func handleCompleteRequest(_ request: ChannelRequest)
    func didReceivedFirstByteOfRequest(_ request: ChannelRequest, responseText: String)
}
