import Foundation
import XCTest

/// Method validation only: no WebChannel and no forced suspension/debugger pause.
final class SuspensionProbeTests: XCTestCase {
  private var records: [[String: Any]] = []

  private func allowStateUpdates(for seconds: TimeInterval) {
    let tick = XCTestExpectation(description: "Allow application-state updates")
    DispatchQueue.main.asyncAfter(deadline: .now() + seconds) { tick.fulfill() }
    XCTAssertEqual(XCTWaiter.wait(for: [tick], timeout: seconds + 3), .completed)
  }

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
    // Launch separately with devicectl and NETTEST_AUTORUN=0. The UI test
    // observes the existing process instead of launching it under test control.
    defer {
      record("cleanup", state: app.state)
      let data = try? JSONSerialization.data(
        withJSONObject: records, options: [.sortedKeys, .prettyPrinted])
      let attachment = XCTAttachment(data: data ?? Data(), uniformTypeIdentifier: "public.json")
      attachment.name = "os-suspension-state-observations"
      attachment.lifetime = .keepAlways
      add(attachment)
      if ProcessInfo.processInfo.environment["SUSPENSION_KEEP_APP"] != "1" {
        app.terminate()
      }
    }
    XCTAssertNotEqual(
      app.state, .notRunning, "Launch the demo normally with devicectl before this observer")
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
      allowStateUpdates(for: 1)
    }
    XCTAssertTrue(
      suspended,
      "OS did not report runningBackgroundSuspended; heartbeat silence is not substituted")
    record("suspended_confirmed", state: app.state)
    let hold = Double(ProcessInfo.processInfo.environment["SUSPENSION_HOLD_SECONDS"] ?? "0") ?? -1
    XCTAssertTrue(hold.isFinite && hold >= 0 && hold <= 300)
    let holdUntil = ProcessInfo.processInfo.systemUptime + hold
    record("suspension_hold_started", state: app.state)
    while ProcessInfo.processInfo.systemUptime < holdUntil {
      allowStateUpdates(for: 1)
      let state = app.state
      record("suspension_hold_observed", state: state)
      XCTAssertEqual(state, .runningBackgroundSuspended, "App did not remain OS-reported suspended")
    }
    record("suspension_hold_complete", state: app.state)
    app.activate()
    XCTAssertTrue(app.wait(for: .runningForeground, timeout: 15))
    record("foreground_after_resume", state: app.state)
    if ProcessInfo.processInfo.environment["SUSPENSION_KEEP_APP"] == "1" {
      // Give the USB controller time to probe the original session and verify PID.
      allowStateUpdates(for: 10)
    }
  }
}
