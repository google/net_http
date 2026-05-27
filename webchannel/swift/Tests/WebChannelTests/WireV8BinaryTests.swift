import XCTest
@testable import WebChannel

final class WireV8BinaryTests: XCTestCase {
    private var wire: WireV8Binary!
    private var support: DefaultSupport!

    override func setUp() {
        super.setUp()
        support = DefaultSupport()
        wire = WireV8Binary(support: support)
    }

    func testEncodeEmptyMessageQueue() {
        let messages: [QueuedMap] = []
        let encoded = wire.encodeMessageQueue(messages, count: 0)
        let encodedString = String(data: encoded, encoding: .utf8)
        XCTAssertEqual(encodedString, "count=0&\r\n")
    }

    func testEncodeSingleMessage() {
        let map1: [String: Any] = [rawDataKey: "message1"]
        let qMap1 = QueuedMap(mapID: 101, map: map1)
        let messages = [qMap1]

        let encoded = wire.encodeMessageQueue(messages, count: 1)
        let encodedString = String(data: encoded, encoding: .utf8)

        let expected = "count=1&ofs=101\r\nid=0&size=8\r\nmessage1"
        XCTAssertEqual(encodedString, expected)
    }

    func testEncodeMultipleMessages() {
        let map1: [String: Any] = [rawDataKey: "message1"]
        let qMap1 = QueuedMap(mapID: 101, map: map1)

        let map2: [String: Any] = [rawDataKey: "msg2"]
        let qMap2 = QueuedMap(mapID: 102, map: map2)

        let messages = [qMap1, qMap2]

        let encoded = wire.encodeMessageQueue(messages, count: 2)
        let encodedString = String(data: encoded, encoding: .utf8)

        let expected = "count=2&ofs=101\r\nid=0&size=8\r\nmessage1id=1&size=4\r\nmsg2"
        XCTAssertEqual(encodedString, expected)
    }

    func testEncodeSingleBinaryMessage() {
        let bytes: [UInt8] = [0x00, 0x01, 0xFF, 0xFE]
        let binaryData = Data(bytes)
        let map1: [String: Any] = [rawDataKey: binaryData]
        let qMap1 = QueuedMap(mapID: 101, map: map1)
        let messages = [qMap1]

        let encoded = wire.encodeMessageQueue(messages, count: 1)

        var expected = Data("count=1&ofs=101\r\nid=0&size=4\r\n".utf8)
        expected.append(binaryData)

        XCTAssertEqual(encoded, expected)
    }
}
