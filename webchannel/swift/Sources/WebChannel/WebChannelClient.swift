import Foundation

public final class WebChannelClient: WebChannelClientProtocol, WebChannelClientReadWrite {
    public weak var delegate: WebChannelClientHandlerDelegate? {
        get { internalClient.delegate }
        set { internalClient.delegate = newValue }
    }

    public var messageURLParams: [String: String]? {
        get { internalClient.messageURLParams }
        set { internalClient.messageURLParams = newValue }
    }

    public var runtimeProperties: RuntimeProperties? {
        internalClient.runtimeProperties
    }

    private let internalClient: WebChannelClientInternal

    public init(url baseURL: URL, options: WebChannelOptions = WebChannelOptions(), delegate: WebChannelClientHandlerDelegate? = nil, support: SupportProtocol = DefaultSupport()) {
        let client = WebChannelClientInternal(
            url: baseURL.absoluteString,
            options: options,
            delegate: delegate,
            support: support
        )
        self.internalClient = client
        client.ownerClient = self
    }

    public func open() {
        internalClient.open()
    }

    public func close() {
        internalClient.close()
    }

    public func send(_ message: String) {
        internalClient.send(message)
    }

    public func send(data: Data) {
        internalClient.send(data: data)
    }
}
