import Foundation

public final class WireV8 {
    private let support: SupportProtocol

    public init(support: SupportProtocol) {
        self.support = support
    }

    public func encodeMessage(_ message: [String: String], buffer: inout [String], prefix: String?) {
        let prefixField = prefix ?? ""
        for (key, value) in message {
            let encodedVal = support.urlEncoder.encode(value)
            buffer.append("\(prefixField)\(key)=\(encodedVal)")
        }
    }

    public func encodeMessageQueue(_ messageQueue: [QueuedMap], count: Int) -> String {
        var offset: Int = -1
        while true {
            var buffer: [String] = []
            buffer.append("count=\(count)")
            if offset == -1 {
                if count > 0 {
                    offset = messageQueue[0].mapID
                    buffer.append("ofs=\(offset)")
                } else {
                    offset = 0
                }
            } else {
                buffer.append("ofs=\(offset)")
            }

            var done = true
            for i in 0..<count {
                let mapID = messageQueue[i].mapID - offset
                let map = messageQueue[i].map
                if mapID < 0 {
                    offset = max(0, messageQueue[i].mapID - 100)
                    done = false
                    continue
                }
                var strMap: [String: String] = [:]
                for (k, v) in map {
                    if let strV = v as? String {
                        strMap[k] = strV
                    }
                }
                encodeMessage(strMap, buffer: &buffer, prefix: "req\(mapID)_")
            }

            if done {
                return buffer.joined(separator: "&")
            }
        }
    }

    public func decodeMessage(_ message: Data, level: Int) throws -> Any {
        try support.jsonDecoder.decode(message)
    }
}
