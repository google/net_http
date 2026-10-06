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

  private func runScenario(name: String, isOmnient: Bool) {
    let environment = ProcessInfo.processInfo.environment
    let repetitions = min(max(Int(environment["LENS_BENCHMARK_REPETITIONS"] ?? "10") ?? 10, 1), 50)
    let endpoint = environment["LENS_BENCHMARK_ENDPOINT"] ?? defaultEndpoint
    var rows: [[String: Any]] = []
    var failures: [String] = []

    for repetition in 1...repetitions {
      for enabled in [false, true] {
        let service = WebChannelService()
        onMain {
          service.fastHandshake2 = enabled
          service.startLensBenchmark(
            endpointUrl: endpoint,
            isOmnient: isOmnient,
            imageSizeKb: 150,
            detectionDelayMs: 50
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

        let row: [String: Any] = onMain {
          let metrics = service.lensMetrics
          let complete = metrics.isCompleted && metrics.handshakeDurationMs != nil
            && metrics.m3RttToAckMs != nil && metrics.m3TimeToFirstDetectionMs != nil
            && metrics.m4RttMs != nil
          let status = complete ? "completed" : (Date() >= deadline ? "timeout" : "failed")
          var result: [String: Any] = [
            "scenario": name,
            "repetition": repetition,
            "fastHandshake2": enabled,
            "status": status,
            "endpoint": endpoint,
            "imageSizeKb": 150,
            "detectionDelayMs": 50,
            "deviceModel": UIDevice.current.model,
            "systemVersion": UIDevice.current.systemVersion,
            "log": service.combinedLogsText,
          ]
          if let value = metrics.handshakeDurationMs { result["handshakeMs"] = value }
          if let value = metrics.m3RttToAckMs { result["ttfaMs"] = value }
          if let value = metrics.m3TimeToFirstDetectionMs { result["ttfdMs"] = value }
          if let value = metrics.m4RttMs { result["m4RttMs"] = value }
          service.disconnect()
          return result
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

    let columns = ["scenario", "repetition", "fastHandshake2", "status", "handshakeMs", "ttfaMs", "ttfdMs", "m4RttMs"]
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
