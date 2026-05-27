import XCTest
@testable import WebChannel

final class MockHTTPInternalHandler: WebChannelInternalHTTPHandler {
    var receivedInputs: [String] = []
    var firstBytes: [String] = []
    var isCompleted: Bool = false

    func didReceiveInput(_ input: String, withRequest request: ChannelRequest) {
        receivedInputs.append(input)
    }

    func handleCompleteRequest(_ request: ChannelRequest) {
        isCompleted = true
    }

    func didReceivedFirstByteOfRequest(_ request: ChannelRequest, responseText: String) {
        firstBytes.append(responseText)
    }
}

final class ChannelRequestTests: XCTestCase {
    private var request: ChannelRequest!
    private var mockHandler: MockHTTPInternalHandler!
    private var support: DefaultSupport!

    override func setUp() {
        super.setUp()
        support = DefaultSupport()
        mockHandler = MockHTTPInternalHandler()
        request = ChannelRequest(sessionID: "sessionID", requestID: "requestID", support: support, delegate: mockHandler)
    }

    func testDecodePOSTResponseChunkSuccess() {
        let fakePOSTResponse = "7\n[0,0,7]"
        request.decodeNextChunks(responseText: fakePOSTResponse, readyState: .complete)

        XCTAssertEqual(mockHandler.receivedInputs.count, 1)
        XCTAssertEqual(mockHandler.receivedInputs.first, "[0,0,7]")
        XCTAssertEqual(mockHandler.firstBytes.count, 1)
        XCTAssertEqual(mockHandler.firstBytes.first, fakePOSTResponse)
    }

    func testDecodeGETResponseChunkSuccess() {
        let fakeGETResponse = "14\n[[1,[\"noop\"]]]14\n[[2,[\"noop\"]]]"
        request.decodeNextChunks(responseText: fakeGETResponse, readyState: .complete)

        XCTAssertEqual(mockHandler.receivedInputs.count, 2)
        XCTAssertEqual(mockHandler.receivedInputs[0], "[[1,[\"noop\"]]]")
        XCTAssertEqual(mockHandler.receivedInputs[1], "[[2,[\"noop\"]]]")
        XCTAssertEqual(mockHandler.firstBytes.count, 1)
    }

    func testDecodeInvalidChunks() {
        request.decodeNextChunks(responseText: "", readyState: .complete)
        XCTAssertFalse(request.isSuccessful)
    }

    func testDecodeNegativeChunkSize() {
        let negativeSizeResponse = "-5\n"
        request.decodeNextChunks(responseText: negativeSizeResponse, readyState: .interactive)
        XCTAssertFalse(request.isSuccessful)
    }
}
