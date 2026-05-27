import Foundation

public typealias AckCommitCallbackBlock = () -> Void

public protocol RuntimePropertiesChannelDelegate: AnyObject {
    var lastStatusCode: Int { get }
    var nonAckedMessages: [String] { get }
    var forwardChannelFlushedCallback: AckCommitCallbackBlock? { get set }
}

public final class RuntimeProperties {
    private weak var delegate: RuntimePropertiesChannelDelegate?

    public init(delegate: RuntimePropertiesChannelDelegate?) {
        self.delegate = delegate
    }

    public var lastStatusCode: Int {
        delegate?.lastStatusCode ?? 0
    }

    public var nonAckedMessages: [String] {
        delegate?.nonAckedMessages ?? []
    }

    public func commit(_ callback: @escaping AckCommitCallbackBlock) {
        delegate?.forwardChannelFlushedCallback = callback
    }
}
