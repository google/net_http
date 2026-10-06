import Foundation
import UIKit
import XCTest

/// Measures HTTPS transport to the Lens host without constructing a WebChannel.
final class HTTPSBaselineTests: XCTestCase {
  private let endpoint = URL(string: "https://webchannel.sandbox.google.com/staging/channel/lens")!

  func testHTTPSBaseline() {
    var rows: [[String: Any]] = []
    var failures: [String] = []

    for pair in 1...10 {
      let delegate = ProbeDelegate()
      let configuration = URLSessionConfiguration.ephemeral
      configuration.allowsCellularAccess = false
      configuration.waitsForConnectivity = false
      configuration.requestCachePolicy = .reloadIgnoringLocalCacheData
      configuration.urlCache = nil
      configuration.httpCookieStorage = nil
      let session = URLSession(configuration: configuration, delegate: delegate, delegateQueue: nil)

      for phase in ["initial", "sameSession"] {
        let row = probe(session: session, delegate: delegate, pair: pair, phase: phase)
        rows.append(row)
        if row["status"] as? String != "completed" {
          failures.append("pair \(pair) \(phase)")
        }
        print("HTTPS_BASELINE_RESULT pair=\(pair) phase=\(phase) \(row)")
      }
      session.invalidateAndCancel()
    }

    let json = try! JSONSerialization.data(withJSONObject: rows, options: [.prettyPrinted, .sortedKeys])
    let attachment = XCTAttachment(data: json, uniformTypeIdentifier: "public.json")
    attachment.name = "https-baseline-results.json"
    attachment.lifetime = .keepAlways
    add(attachment)

    let columns = [
      "pair", "phase", "status", "httpStatus", "protocol", "reusedConnection", "cellular",
      "proxyConnection", "dnsMs", "tcpConnectMs", "tlsMs", "connectionSetupMs",
      "requestToFirstByteMs", "requestStartToFirstByteMs", "totalMs",
    ]
    let csv = ([columns.joined(separator: ",")] + rows.map { row in
      columns.map { String(describing: row[$0] ?? "") }.joined(separator: ",")
    }).joined(separator: "\n") + "\n"
    let csvAttachment = XCTAttachment(
      data: Data(csv.utf8), uniformTypeIdentifier: "public.comma-separated-values-text")
    csvAttachment.name = "https-baseline-results.csv"
    csvAttachment.lifetime = .keepAlways
    add(csvAttachment)

    XCTAssertTrue(failures.isEmpty, "Incomplete HTTPS probes: \(failures.joined(separator: ", "))")
  }

  private func probe(
    session: URLSession, delegate: ProbeDelegate, pair: Int, phase: String
  ) -> [String: Any] {
    let finished = expectation(description: "HTTPS pair \(pair) \(phase)")
    let observation = ProbeObservation(expectation: finished)
    var request = URLRequest(url: endpoint)
    request.httpMethod = "HEAD"
    request.timeoutInterval = 15
    request.cachePolicy = .reloadIgnoringLocalCacheData
    let task = session.dataTask(with: request) { _, response, error in
      observation.recordCompletion(response: response, error: error)
    }
    delegate.register(observation, for: task)
    task.resume()
    let waitResult = XCTWaiter.wait(for: [finished], timeout: 18)
    let snapshot = observation.snapshot()

    var row: [String: Any] = [
      "pair": pair,
      "phase": phase,
      "status": waitResult == .completed && snapshot.error == nil && snapshot.httpStatus != nil
        ? "completed" : "failed",
      "url": endpoint.absoluteString,
      "method": "HEAD",
      "deviceModel": UIDevice.current.model,
      "systemVersion": UIDevice.current.systemVersion,
    ]
    if let status = snapshot.httpStatus { row["httpStatus"] = status }
    if let error = snapshot.error { row["error"] = error }
    if let metrics = snapshot.metrics {
      row["transactionCount"] = metrics.transactionMetrics.count
      if let transaction = metrics.transactionMetrics.last {
        row["protocol"] = transaction.networkProtocolName ?? "unknown"
        row["reusedConnection"] = transaction.isReusedConnection
        row["cellular"] = transaction.isCellular
        row["proxyConnection"] = transaction.isProxyConnection
        if let remote = transaction.remoteAddress { row["remoteAddress"] = remote }
        if let local = transaction.localAddress { row["localAddress"] = local }
        putDuration(&row, "dnsMs", transaction.domainLookupStartDate, transaction.domainLookupEndDate)
        putDuration(&row, "tlsMs", transaction.secureConnectionStartDate, transaction.secureConnectionEndDate)
        putDuration(&row, "connectionSetupMs", transaction.connectStartDate, transaction.connectEndDate)
        putDuration(&row, "requestToFirstByteMs", transaction.requestEndDate, transaction.responseStartDate)
        putDuration(&row, "requestStartToFirstByteMs", transaction.requestStartDate, transaction.responseStartDate)
        putDuration(&row, "totalMs", transaction.fetchStartDate, transaction.responseEndDate)
        // This interval approximates the TCP handshake only for HTTP/1.1 or HTTP/2.
        if transaction.networkProtocolName == "h2" || transaction.networkProtocolName == "http/1.1" {
          putDuration(&row, "tcpConnectMs", transaction.connectStartDate, transaction.secureConnectionStartDate)
        }
      }
    }
    return row
  }

  private func putDuration(_ row: inout [String: Any], _ key: String, _ start: Date?, _ end: Date?) {
    if let start, let end { row[key] = end.timeIntervalSince(start) * 1000 }
  }
}

private final class ProbeObservation {
  private let lock = NSLock()
  private let expectation: XCTestExpectation
  private var metrics: URLSessionTaskMetrics?
  private var httpStatus: Int?
  private var error: String?
  private var completionReceived = false
  private var fulfilled = false

  init(expectation: XCTestExpectation) { self.expectation = expectation }

  func recordMetrics(_ metrics: URLSessionTaskMetrics) {
    lock.lock()
    self.metrics = metrics
    finishIfReady()
    lock.unlock()
  }

  func recordCompletion(response: URLResponse?, error: Error?) {
    lock.lock()
    httpStatus = (response as? HTTPURLResponse)?.statusCode
    self.error = error.map { String(describing: $0) }
    completionReceived = true
    finishIfReady()
    lock.unlock()
  }

  func snapshot() -> (metrics: URLSessionTaskMetrics?, httpStatus: Int?, error: String?) {
    lock.lock()
    defer { lock.unlock() }
    return (metrics, httpStatus, error)
  }

  private func finishIfReady() {
    if completionReceived && metrics != nil && !fulfilled {
      fulfilled = true
      expectation.fulfill()
    }
  }
}

private final class ProbeDelegate: NSObject, URLSessionTaskDelegate {
  private let lock = NSLock()
  private var observations: [Int: ProbeObservation] = [:]

  func register(_ observation: ProbeObservation, for task: URLSessionTask) {
    lock.lock()
    observations[task.taskIdentifier] = observation
    lock.unlock()
  }

  func urlSession(
    _ session: URLSession, task: URLSessionTask, didFinishCollecting metrics: URLSessionTaskMetrics
  ) {
    lock.lock()
    let observation = observations[task.taskIdentifier]
    lock.unlock()
    observation?.recordMetrics(metrics)
  }

  func urlSession(
    _ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse,
    newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void
  ) {
    completionHandler(nil)
  }
}
