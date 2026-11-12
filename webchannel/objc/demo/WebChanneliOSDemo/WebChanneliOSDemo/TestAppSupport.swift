import Foundation
import Network
import UIKit
import WebChannel

/// Custom logger that prints SDK events and forwards HTTP request/response payloads to WebChannelService.
final class TestAppLogger: NSObject, WCLogger, @unchecked Sendable {
  weak var service: WebChannelService?

  init(service: WebChannelService?) {
    self.service = service
    super.init()
  }

  func logInfo(_ message: String) {
    print("[SDK Info] \(message)")
    NetworkFailureLog.emit("sdk_info", ["text": message])
  }

  func logDebug(_ message: String) {
    print("[SDK Debug] \(message)")
    NetworkFailureLog.emit("sdk_debug", ["text": message])
  }

  func logWarning(_ message: String) {
    print("[SDK Warning] \(message)")
  }

  func dumpException(_ e: NSException, withMessage message: String) {
    print("[SDK Exception] \(e.name): \(message)")
  }

  func logError(_ message: String) {
    print("[SDK Error] \(message)")
    NetworkFailureLog.emit("sdk_error", ["text": message])
  }

  func logHTTPRequest(
    _ verb: String,
    url: URL,
    id: String,
    attempt: Int64,
    postData: String?
  ) {
    let postPreview = postData != nil ? " | PostData: \(postData!)" : ""
    let logMsg =
      "🌐 [HTTP Req] (\(id)) [attempt \(attempt)] \(verb) \(url.absoluteString)\(postPreview)"
    print(logMsg)
    NetworkFailureLog.emit("http_log", ["text": logMsg])
    DispatchQueue.main.async {
      self.service?.log(logMsg)
    }
  }

  func logHTTPChannelResponseMetaData(
    _ verb: String,
    url: URL,
    id: String,
    attempt: Int64,
    state: WCRequestReadyState,
    statusCode code: Int32
  ) {
    NetworkFailureLog.emit(
      "http_state",
      [
        "rid": id, "attempt": attempt, "url": url.absoluteString,
        "method": verb, "readyState": state.rawValue, "status": code,
      ])
    print(
      "🌐 [HTTP Resp Meta] (\(id)) [attempt \(attempt)] \(verb) \(url.absoluteString) status: \(code)"
    )
  }

  func logHTTPChannelResponseText(_ text: String, id: String, desc: String?) {
    let descPart = desc != nil ? " [\(desc!)]" : ""
    let logMsg = "🌐 [HTTP Resp Body] (\(id))\(descPart): \(text)"
    print(logMsg)
    NetworkFailureLog.emit("http_log", ["text": logMsg])
    DispatchQueue.main.async {
      self.service?.log(logMsg)
    }
  }
}

/// Custom WCSupport implementation providing the custom TestAppLogger and forwarding to WCDefaultSupport.
final class TestAppSupport: NSObject, WCSupport, @unchecked Sendable {
  private let defaultSupport = WCDefaultSupport()!
  private let metricsLock = NSLock()
  private var collectedTaskMetrics: [[String: Any]] = []
  let customLogger: TestAppLogger

  var taskMetricsSnapshot: [[String: Any]] {
    metricsLock.lock()
    defer { metricsLock.unlock() }
    return collectedTaskMetrics
  }

  init(service: WebChannelService?) {
    self.customLogger = TestAppLogger(service: service)
    super.init()
    defaultSupport.taskMetricsHandler = { [weak self] metrics in
      if let metrics { self?.recordTaskMetrics(metrics) }
    }
  }

  private func recordTaskMetrics(_ metrics: URLSessionTaskMetrics) {
    let records: [[String: Any]] = metrics.transactionMetrics.map { transaction in
      let url = transaction.request.url
      let query = URLComponents(
        url: url ?? URL(fileURLWithPath: "/"), resolvingAgainstBaseURL: false)
      let rid = query?.queryItems?.first(where: { $0.name == "RID" })?.value ?? ""
      var record: [String: Any] = [
        "rid": rid,
        "method": transaction.request.httpMethod ?? "",
        "url": url?.absoluteString ?? "",
        "protocol": transaction.networkProtocolName ?? "unknown",
        "reusedConnection": transaction.isReusedConnection,
        "isCellular": transaction.isCellular,
      ]
      if let start = transaction.connectStartDate, let end = transaction.connectEndDate {
        record["tcpConnectMs"] = end.timeIntervalSince(start) * 1000
      }
      if let start = transaction.secureConnectionStartDate,
        let end = transaction.secureConnectionEndDate
      {
        record["tlsMs"] = end.timeIntervalSince(start) * 1000
      }
      for (key, date) in [
        ("fetchStart", transaction.fetchStartDate), ("requestStart", transaction.requestStartDate),
        ("requestEnd", transaction.requestEndDate),
        ("responseStart", transaction.responseStartDate),
        ("responseEnd", transaction.responseEndDate),
      ] {
        if let date { record[key] = date.timeIntervalSince1970 }
      }
      if let address = transaction.localAddress { record["localAddress"] = address }
      if let address = transaction.remoteAddress { record["remoteAddress"] = address }
      if let port = transaction.localPort { record["localPort"] = port }
      if let port = transaction.remotePort { record["remotePort"] = port }
      return record
    }
    metricsLock.lock()
    collectedTaskMetrics.append(contentsOf: records)
    NetworkFailureLog.emit("task_metrics", ["transactions": records])
    metricsLock.unlock()
  }

  var urlEncoder: any WCURLEncoder {
    return defaultSupport.urlEncoder
  }

  var logger: any WCLogger {
    return customLogger
  }

  var jsonDecoder: any WCJSONDecoder {
    return defaultSupport.jsonDecoder
  }

  var dispatchQueue: DispatchQueue {
    return defaultSupport.dispatchQueue
  }

  func httpRequest(_ handler: any WCRequestStateChangedHandler) -> any WCHTTPRequest {
    return defaultSupport.httpRequest(handler)
  }

  func notifyStatEvent(_ event: WCRequestStat) {
    defaultSupport.notifyStatEvent(event)
  }

  func notifyServerReachabilityEvent(_ event: WCServerReachability) {
    defaultSupport.notifyServerReachabilityEvent(event)
  }

  func notifyTimingEvent(
    withSize size: Int32,
    withRTT rtt: TimeInterval,
    withRetries retries: Int32
  ) {
    defaultSupport.notifyTimingEvent(
      withSize: size, withRTT: rtt, withRetries: retries)
  }

  func notifyHandshakeTimingEvent(withRtt rtt: TimeInterval) {
    NetworkFailureLog.emit("handshake_rtt", ["rtt": rtt])
    defaultSupport.notifyHandshakeTimingEvent(withRtt: rtt)
  }

  func notifyHandshakeResponseHeaders(_ headers: [String: String]) {
    defaultSupport.notifyHandshakeResponseHeaders(headers)
  }

  func setTimeout(_ timeout: TimeInterval, block: (() -> Void)!) -> (any WCTimer)! {
    return defaultSupport.setTimeout(timeout, block: block)
  }

  func setTimeout(
    _ timeout: TimeInterval,
    block: (() -> Void)!,
    context: WCFailureRecoveryContext
  ) -> (any WCTimer)! {
    return defaultSupport.setTimeout(timeout, block: block, context: context)
  }

  func clearTimeout(_ timer: (any WCTimer)!) {
    defaultSupport.clearTimeout(timer)
  }
}

// Opt-in networking experiment support. Normal launches do not enable this.

final class NetworkFailureLog: @unchecked Sendable {
  static let enabled = ProcessInfo.processInfo.environment["NETTEST_AUTORUN"] == "1"
  private static let lock = NSLock()
  static func emit(_ kind: String, _ fields: [String: Any] = [:]) {
    guard enabled else { return }
    var record = fields
    record["kind"] = kind
    record["deviceUnixSeconds"] = Date().timeIntervalSince1970
    record["deviceUptimeSeconds"] = ProcessInfo.processInfo.systemUptime
    record["run"] = ProcessInfo.processInfo.environment["NETTEST_RUN"] ?? ""
    guard let data = try? JSONSerialization.data(withJSONObject: record, options: [.sortedKeys]),
      let text = String(data: data, encoding: .utf8)
    else { return }
    lock.lock()
    print("[NETTEST] \(text)")
    fflush(stdout)
    lock.unlock()
  }
}

final class NetworkFailureControl: @unchecked Sendable {
  weak var service: WebChannelService?
  private let monitor = NWPathMonitor()
  private var observers: [NSObjectProtocol] = []
  private var timer: Timer?
  private var healthTimer: Timer?
  init(service: WebChannelService) {
    self.service = service
    UIApplication.shared.isIdleTimerDisabled = true
    healthTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
      NetworkFailureLog.emit(
        "heartbeat", ["applicationState": UIApplication.shared.applicationState.rawValue])
    }
    monitor.pathUpdateHandler = { path in
      NetworkFailureLog.emit(
        "path",
        [
          "status": String(describing: path.status),
          "wifi": path.usesInterfaceType(.wifi), "cellular": path.usesInterfaceType(.cellular),
          "wired": path.usesInterfaceType(.wiredEthernet), "expensive": path.isExpensive,
          "constrained": path.isConstrained,
        ])
    }
    monitor.start(queue: DispatchQueue(label: "nettest.path"))
    for name in [
      UIApplication.didEnterBackgroundNotification, UIApplication.willEnterForegroundNotification,
      UIApplication.didBecomeActiveNotification, UIApplication.willResignActiveNotification,
    ] {
      observers.append(
        NotificationCenter.default.addObserver(forName: name, object: nil, queue: nil) { note in
          NetworkFailureLog.emit("lifecycle", ["notification": note.name.rawValue])
        })
    }
    for name in [
      "com.pmodular.webchannel.nettest.send", "com.pmodular.webchannel.nettest.close",
      "com.pmodular.webchannel.nettest.probe",
    ] {
      CFNotificationCenterAddObserver(
        CFNotificationCenterGetDarwinNotifyCenter(),
        Unmanaged.passUnretained(self).toOpaque(),
        { _, pointer, name, _, _ in
          guard let pointer, let name else { return }
          let control = Unmanaged<NetworkFailureControl>.fromOpaque(pointer).takeUnretainedValue()
          let action = name.rawValue as String
          DispatchQueue.main.async { control.handle(action) }
        }, name as CFString, nil, .deliverImmediately)
    }
    NetworkFailureLog.emit(
      "autorun_start",
      [
        "traffic": ProcessInfo.processInfo.environment["NETTEST_TRAFFIC"] ?? "idle",
        "model": UIDevice.current.model, "os": UIDevice.current.systemVersion,
        "pid": ProcessInfo.processInfo.processIdentifier,
        "controlProtocolVersion": 2,
      ])
  }
  private func handle(_ name: String) {
    NetworkFailureLog.emit("control", ["action": name])
    if name.hasSuffix(".close") {
      timer?.invalidate()
      service?.disconnect()
      return
    }
    if name.hasSuffix(".probe") {
      service?.sendEcho(message: "NETTEST_PROBE")
      return
    }
    service?.sendEcho(message: "network-failure pending write")
    if ProcessInfo.processInfo.environment["NETTEST_TRAFFIC"] == "periodic" {
      timer?.invalidate()
      timer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { [weak self] _ in
        self?.service?.sendEcho(message: "network-failure periodic write")
      }
    }
  }
  func opened() {
    NetworkFailureLog.emit("open")
    if ProcessInfo.processInfo.environment["NETTEST_TRAFFIC"] == "streaming" {
      service?.sendStreaming(message: "network-failure stream", numMessages: 1000, intervalMs: 1000)
    }
  }
  deinit {
    monitor.cancel()
    timer?.invalidate()
    healthTimer?.invalidate()
    for observer in observers { NotificationCenter.default.removeObserver(observer) }
    CFNotificationCenterRemoveEveryObserver(
      CFNotificationCenterGetDarwinNotifyCenter(), Unmanaged.passUnretained(self).toOpaque())
  }
}
