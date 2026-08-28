import Foundation
import WebChannel

final class DemoDelegate: WebChannelClientHandlerDelegate {
    let semaphore = DispatchSemaphore(value: 0)
    var opened = false
    var messagesReceived: [Any] = []
    var errorReceived: WebChannelClientError?

    func webChannelOpened(_ client: WebChannelClientProtocol) {
        print("✅ [Swift WebChannel] Connection Opened!")
        opened = true

        let payload = "{\"message\":\"Hello from Swift WebChannel!\",\"num_messages\":3,\"message_interval\":500}"
        print(">>> [Swift WebChannel] Sending payload: \(payload)")
        client.send(payload)
    }

    func webChannelClosed(_ client: WebChannelClientProtocol) {
        print("ℹ️ [Swift WebChannel] Connection Closed.")
        semaphore.signal()
    }

    func webChannel(_ client: WebChannelClientProtocol, didReceiveMessage message: Any) {
        print("<<< [Swift WebChannel] Received Message: \(message)")
        messagesReceived.append(message)
        if messagesReceived.count >= 3 {
            DispatchQueue.global().asyncAfter(deadline: .now() + 1.0) {
                client.close()
            }
        }
    }

    func webChannel(_ client: WebChannelClientProtocol, encounteredError error: WebChannelClientError) {
        print("❌ [Swift WebChannel] Encountered Error: \(error)")
        errorReceived = error
        semaphore.signal()
    }

    func webChannel(_ client: WebChannelClientProtocol, didReceiveHeaders headers: [String: String], statusCode: Int) {
        print("ℹ️ [Swift WebChannel] Received Headers (HTTP \(statusCode)): \(headers)")
    }
}

func runDemo() {
    print("==========================================================")
    print("  Testing WebChannel Swift Interoperability  ")
    print("  Endpoint: https://webchannel.sandbox.google.com/staging/channel/generator")
    print("==========================================================")

    guard let url = URL(string: "https://webchannel.sandbox.google.com/staging/channel/generator") else {
        fatalError("Invalid URL")
    }

    let options = WebChannelOptions()
    options.isFastHandshake = false
    options.httpSessionIDParam = "gsessionid"

    let delegate = DemoDelegate()
    let client = WebChannelClient(url: url, options: options, delegate: delegate)

    print(">>> Opening WebChannel connection...")
    client.open()

    // Wait up to 10 seconds for completion
    let result = delegate.semaphore.wait(timeout: .now() + 10.0)
    if result == .timedOut {
        print("⏱️ [Swift WebChannel] Demo timed out.")
        client.close()
    }

    print("==========================================================")
    print("  Interoperability Test Summary:")
    print("  - Connection Established: \(delegate.opened)")
    print("  - Messages Received Count: \(delegate.messagesReceived.count)")
    print("  - Errors: \(delegate.errorReceived != nil ? "\(delegate.errorReceived!)" : "None")")
    print("==========================================================")
}

runDemo()
