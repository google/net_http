import Foundation

public final class WireV8Binary {
    private let support: SupportProtocol

    public init(support: SupportProtocol) {
        self.support = support
    }

    public func encodeMessageQueue(_ messageQueue: [QueuedMap], count: Int) -> Data {
        var offset: Int64 = -1
        while true {
            var buffer = Data()
            appendString("count=\(count)&", to: &buffer)
            if offset == -1 {
                if count > 0 {
                    offset = Int64(messageQueue[0].mapID)
                    appendString("ofs=\(offset)", to: &buffer)
                } else {
                    offset = 0
                }
            } else {
                appendString("ofs=\(offset)", to: &buffer)
            }
            appendString("\r\n", to: &buffer)

            var done = true
            for i in 0..<count {
                var mapID = Int64(messageQueue[i].mapID)
                mapID -= offset
                if mapID < 0 {
                    offset = Int64(max(0, messageQueue[i].mapID - 100))
                    done = false
                    continue
                }
                encodeMessage(messageQueue[i], relativeMapID: mapID, to: &buffer)
            }

            if done {
                return buffer
            }
        }
    }

    private func encodeMessage(_ message: QueuedMap, relativeMapID: Int64, to buffer: inout Data) {
        appendString("id=\(relativeMapID)&size=\(message.rawDataSize)\r\n", to: &buffer)
        if let dataStr = message.map[rawDataKey] as? String {
            appendString(dataStr, to: &buffer)
        } else if let dataData = message.map[rawDataKey] as? Data {
            buffer.append(dataData)
        }
    }

    private func appendString(_ string: String, to data: inout Data) {
        if let strData = string.data(using: .utf8) {
            data.append(strData)
        }
    }
}
