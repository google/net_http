import Foundation
import UIKit
import XCTest
@testable import WebChanneliOSDemo

/// Live integration benchmarks. Run on a simulator for a smoke test and on an
/// iPhone for measurements; neither XCTest nor the app mocks the HTTP endpoint.
final class LensBenchmarkTests: XCTestCase {
  private let defaultEndpoint = "https://webchannel.sandbox.google.com/staging/channel/lens"

  func testOmnient() {
    runScenario(name: "omnient", isOmnient: true)
  }

  func testViewfinder() {
    runScenario(name: "viewfinder", isOmnient: false)
  }

  // Run exactly one of these methods per xcodebuild invocation so the app process
  // and its URL sessions are new for each transport-cold trial.
  func testColdOmnientOff() { runScenario(name: "omnient", isOmnient: true, coldSetting: false) }
  func testColdOmnientOn() { runScenario(name: "omnient", isOmnient: true, coldSetting: true) }
  func testColdViewfinderOff() { runScenario(name: "viewfinder", isOmnient: false, coldSetting: false) }
  func testColdViewfinderOn() { runScenario(name: "viewfinder", isOmnient: false, coldSetting: true) }
  func testColdBinaryOmnientOff() { runScenario(name: "omnient", isOmnient: true, coldSetting: false, binaryEncoding: true) }
  func testColdBinaryOmnientOn() { runScenario(name: "omnient", isOmnient: true, coldSetting: true, binaryEncoding: true) }
  func testColdBinaryViewfinderOff() { runScenario(name: "viewfinder", isOmnient: false, coldSetting: false, binaryEncoding: true) }
  func testColdBinaryViewfinderOn() { runScenario(name: "viewfinder", isOmnient: false, coldSetting: true, binaryEncoding: true) }

  private func runScenario(name: String, isOmnient: Bool, coldSetting: Bool? = nil, binaryEncoding: Bool = false) {
    let environment = ProcessInfo.processInfo.environment
    let repetitions = coldSetting == nil
      ? min(max(Int(environment["LENS_BENCHMARK_REPETITIONS"] ?? "10") ?? 10, 1), 50) : 1
    let settings = coldSetting.map { [$0] } ?? [false, true]
    let endpoint = environment["LENS_BENCHMARK_ENDPOINT"] ?? defaultEndpoint
    guard let initialMessageDelayMs = Int(environment["LENS_INITIAL_MESSAGE_DELAY_MS"] ?? "0"),
      initialMessageDelayMs >= 0
    else {
      XCTFail("LENS_INITIAL_MESSAGE_DELAY_MS must be a nonnegative integer")
      return
    }
    var rows: [[String: Any]] = []
    var failures: [String] = []

    for repetition in 1...repetitions {
      for enabled in settings {
        let service = WebChannelService()
        onMain {
          service.fastHandshake2 = enabled
          service.enableBinaryEncoding = binaryEncoding
          service.startLensBenchmark(
            endpointUrl: endpoint,
            isOmnient: isOmnient,
            imageSizeKb: 150,
            detectionDelayMs: 50,
            initialMessageDelayMs: initialMessageDelayMs
          )
        }

        let finished = expectation(description: "\(name) run \(repetition), fastHandshake2=\(enabled)")
        let deadline = Date().addingTimeInterval(60)
        func check() {
          if !service.lensMetrics.isRunning || Date() >= deadline {
            finished.fulfill()
          } else {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.05, execute: check)
          }
        }
        DispatchQueue.main.async(execute: check)
        wait(for: [finished], timeout: 65)

        var row: [String: Any] = onMain {
          let metrics = service.lensMetrics
          let complete = metrics.isCompleted && metrics.handshakeDurationMs != nil
            && metrics.m3RttToAckMs != nil && metrics.m3TimeToFirstDetectionMs != nil
            && metrics.m4RttMs != nil
          let status = complete ? "completed" : (Date() >= deadline ? "timeout" : "failed")
          var result: [String: Any] = [
            "scenario": name,
            "repetition": repetition,
            "fastHandshake2": enabled,
            "enableBinaryEncoding": binaryEncoding,
            "status": status,
            "endpoint": endpoint,
            "imageSizeKb": 150,
            "detectionDelayMs": 50,
            "initialMessageDelayMs": initialMessageDelayMs,
            "deviceModel": UIDevice.current.model,
            "systemVersion": UIDevice.current.systemVersion,
            "log": service.combinedLogsText,
          ]
          if let value = metrics.handshakeDurationMs { result["handshakeMs"] = value }
          if let value = metrics.m1DelayFromConnectMs { result["m1DelayFromConnectMs"] = value }
          if let value = metrics.m3RttToAckMs { result["ttfaMs"] = value }
          if let value = metrics.m3TimeToFirstDetectionMs { result["ttfdMs"] = value }
          if let value = metrics.m4RttMs { result["m4RttMs"] = value }
          service.disconnect()
          return result
        }
        if coldSetting != nil {
          let support = service.testSupport
          // The fast-handshake GET remains open as the backchannel until disconnect.
          // URLSession publishes task metrics only when that task ends.
          let metricsDeadline = Date().addingTimeInterval(5)
          var transport = support?.taskMetricsSnapshot ?? []
          while !transport.contains(where: { $0["rid"] as? String != "rpc" &&
            $0["method"] as? String == (enabled ? "GET" : "POST") })
            && Date() < metricsDeadline
          {
            Thread.sleep(forTimeInterval: 0.1)
            transport = support?.taskMetricsSnapshot ?? []
          }
          let handshake = transport
            .filter { $0["rid"] as? String != "rpc" &&
              $0["method"] as? String == (enabled ? "GET" : "POST") }
            .min { (Int($0["rid"] as? String ?? "") ?? Int.max) <
              (Int($1["rid"] as? String ?? "") ?? Int.max) }
          let earlyPOST = enabled ? transport
            .filter { $0["method"] as? String == "POST" &&
              (Int($0["rid"] as? String ?? "") ?? Int.max) ==
              (Int(handshake?["rid"] as? String ?? "") ?? -2) + 1 }
            .first : nil
          func fresh(_ record: [String: Any]?) -> Bool {
            record?["protocol"] as? String == "h2"
              && record?["reusedConnection"] as? Bool == false
              && record?["tcpConnectMs"] != nil && record?["tlsMs"] != nil
          }
          let sharedConnection = handshake?["localPort"] as? Int == earlyPOST?["localPort"] as? Int
            && handshake?["remoteAddress"] as? String == earlyPOST?["remoteAddress"] as? String
            && handshake?["localPort"] != nil
          let coldConnection = fresh(handshake) ||
            (enabled && fresh(earlyPOST) && sharedConnection &&
              handshake?["protocol"] as? String == "h2" &&
              handshake?["reusedConnection"] as? Bool == true)
          row["transportMetrics"] = transport
          row["coldConnection"] = coldConnection
          row["coldConnectionSource"] = fresh(handshake) ? "handshake" :
            (coldConnection ? "earlyPOST" : "unverified")
          if !coldConnection { failures.append("\(name) #\(repetition) cold connection unverified") }
        }
        rows.append(row)
        let identifier = "\(name) #\(repetition) fastHandshake2=\(enabled)"
        if row["status"] as? String != "completed" { failures.append(identifier) }
        print("LENS_BENCHMARK_RESULT \(identifier): \(row["status"] ?? "unknown")")
      }
    }

    let json = try! JSONSerialization.data(withJSONObject: rows, options: [.prettyPrinted, .sortedKeys])
    let jsonAttachment = XCTAttachment(data: json, uniformTypeIdentifier: "public.json")
    jsonAttachment.name = "lens-\(name)-results.json"
    jsonAttachment.lifetime = .keepAlways
    add(jsonAttachment)

    let columns = ["scenario", "repetition", "fastHandshake2", "initialMessageDelayMs", "m1DelayFromConnectMs", "status", "coldConnection", "handshakeMs", "ttfaMs", "ttfdMs", "m4RttMs"]
    let csv = ([columns.joined(separator: ",")] + rows.map { row in
      columns.map { key in String(describing: row[key] ?? "") }.joined(separator: ",")
    }).joined(separator: "\n") + "\n"
    let csvAttachment = XCTAttachment(data: Data(csv.utf8), uniformTypeIdentifier: "public.comma-separated-values-text")
    csvAttachment.name = "lens-\(name)-results.csv"
    csvAttachment.lifetime = .keepAlways
    add(csvAttachment)

    XCTAssertTrue(failures.isEmpty, "Incomplete benchmark runs: \(failures.joined(separator: ", "))")
  }

  private func onMain<T>(_ body: () -> T) -> T {
    if Thread.isMainThread { return body() }
    return DispatchQueue.main.sync(execute: body)
  }
}
