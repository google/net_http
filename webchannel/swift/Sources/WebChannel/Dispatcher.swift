import Foundation

public final class Dispatcher<Target> {
    private let target: Target
    private let queue: DispatchQueue

    public init(target: Target, queue: DispatchQueue) {
        self.target = target
        self.queue = queue
    }

    public func async(block: @escaping (Target) -> Void) {
        queue.async { [target] in
            block(target)
        }
    }
}
