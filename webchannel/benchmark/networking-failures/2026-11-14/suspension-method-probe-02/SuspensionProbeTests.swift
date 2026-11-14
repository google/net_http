import Foundation
import XCTest

/// Method validation only: no WebChannel and no forced suspension/debugger pause.
final class SuspensionProbeTests: XCTestCase {
  private var records: [[String: Any]] = []

  private func record(_ event: String, state: XCUIApplication.State) {
    let stateName: String
    switch state {
    case .unknown: stateName = "unknown"
    case .notRunning: stateName = "notRunning"
    case .runningBackgroundSuspended: stateName = "runningBackgroundSuspended"
    case .runningBackground: stateName = "runningBackground"
    case .runningForeground: stateName = "runningForeground"
    @unknown default: stateName = "futureState"
    }
    let row: [String: Any] = [
      "event": event,
      "applicationState": state.rawValue,
      "stateName": stateName,
      "isMainThread": Thread.isMainThread,
      "deviceUptimeSeconds": ProcessInfo.processInfo.systemUptime,
      "deviceUnixSeconds": Date().timeIntervalSince1970,
    ]
    records.append(row)
    if let data = try? JSONSerialization.data(withJSONObject: row, options: .sortedKeys) {
      print("SUSPENSION_PROBE " + String(decoding: data, as: UTF8.self))
    }
  }

  func testOSReportedSuspensionAndResume() throws {
    continueAfterFailure = false
    let app = XCUIApplication(bundleIdentifier: "com.pmodular.webchannel.demo")
    // Normal interactive launch: this method probe deliberately opens no channel.
    app.launchEnvironment["NETTEST_AUTORUN"] = "0"
    defer {
      record("cleanup", state: app.state)
      let data = try? JSONSerialization.data(
        withJSONObject: records, options: [.sortedKeys, .prettyPrinted])
      let attachment = XCTAttachment(data: data ?? Data(), uniformTypeIdentifier: "public.json")
      attachment.name = "os-suspension-state-observations"
      attachment.lifetime = .keepAlways
      add(attachment)
      app.terminate()
    }
    app.launch()
    XCTAssertTrue(app.wait(for: .runningForeground, timeout: 15))
    record("foreground", state: app.state)
    XCUIDevice.shared.press(.home)
    record("home_returned", state: app.state)
    let deadline = ProcessInfo.processInfo.systemUptime + 45
    var suspended = false
    while ProcessInfo.processInfo.systemUptime < deadline {
      let state = app.state
      record("state_observed", state: state)
      if state == .runningBackgroundSuspended {
        suspended = true
        break
      }
      XCTAssertNotEqual(state, .notRunning, "App terminated instead of suspending")
      // The state property is updated asynchronously. Keep dispatch/run-loop
      // processing alive instead of blocking the test thread with sleep.
      let tick = XCTestExpectation(description: "Allow application-state updates")
      DispatchQueue.main.asyncAfter(deadline: .now() + 1) { tick.fulfill() }
      XCTAssertEqual(XCTWaiter.wait(for: [tick], timeout: 3), .completed)
    }
    XCTAssertTrue(
      suspended,
      "OS did not report runningBackgroundSuspended; heartbeat silence is not substituted")
    record("suspended_confirmed", state: app.state)
    app.activate()
    XCTAssertTrue(app.wait(for: .runningForeground, timeout: 15))
    record("foreground_after_resume", state: app.state)
  }
}
