import Foundation

public let rawDataKey = "__data__"

public final class QueuedMap {
    public let mapID: Int
    public let map: [String: Any]
    public let context: Any?
    public let rawDataSize: Int

    public init(mapID: Int, map: [String: Any], context: Any? = nil) {
        self.mapID = mapID
        self.map = map
        self.context = context
        if let dataStr = map[rawDataKey] as? String {
            self.rawDataSize = dataStr.utf8.count
        } else if let dataData = map[rawDataKey] as? Data {
            self.rawDataSize = dataData.count
        } else {
            self.rawDataSize = 0
        }
    }
}
