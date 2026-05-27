import Foundation

public final class ForwardChannelRequestPool {
    private let maxSize: Int
    private var requestPool: Set<ObjectIdentifier> = []
    private var requests: [ChannelRequest] = []
    private var internalPendingMessages: [QueuedMap] = []

    public init(maxSize: Int = 10) {
        self.maxSize = maxSize > 0 ? maxSize : 10
    }

    public var isFull: Bool {
        requestPool.count >= maxSize
    }

    public var requestCount: Int {
        requestPool.count
    }

    public var pendingMessages: [QueuedMap] {
        var result = internalPendingMessages
        for req in requests {
            result.append(contentsOf: req.pendingMessages)
        }
        return result
    }

    public func addRequest(_ request: ChannelRequest) {
        let id = ObjectIdentifier(request)
        if !requestPool.contains(id) {
            requestPool.insert(id)
            requests.append(request)
        }
    }

    public func hasRequest(_ request: ChannelRequest) -> Bool {
        requestPool.contains(ObjectIdentifier(request))
    }

    @discardableResult
    public func removeRequest(_ request: ChannelRequest) -> Bool {
        let id = ObjectIdentifier(request)
        if requestPool.contains(id) {
            requestPool.remove(id)
            requests.removeAll { ObjectIdentifier($0) == id }
            return true
        }
        return false
    }

    public func addPendingMessages(_ messages: [QueuedMap]) {
        internalPendingMessages.append(contentsOf: messages)
    }

    public func clearPendingMessages() {
        internalPendingMessages.removeAll()
    }

    public func cancel() {
        for req in requests {
            req.cancel()
        }
        requestPool.removeAll()
        requests.removeAll()
    }
}
