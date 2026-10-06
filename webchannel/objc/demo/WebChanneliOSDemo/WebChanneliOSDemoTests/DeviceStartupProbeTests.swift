import Foundation
import UIKit
import XCTest

/// Reproduces the real-device XCTest startup path without requesting networking.
/// The existing demo remains the host app; no WebChannel is opened by this test.
final class DeviceStartupProbeTests: XCTestCase {
  func testNoNetworking() throws {
    let result: [String: Any] = [
      "status": "passed",
      "processId": ProcessInfo.processInfo.processIdentifier,
      "systemVersion": UIDevice.current.systemVersion,
      "networkRequested": false,
    ]
    let data = try JSONSerialization.data(withJSONObject: result, options: [.sortedKeys])
    print("DEVICE_STARTUP_PROBE_RESULT " + String(decoding: data, as: UTF8.self))
  }
}
