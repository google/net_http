import Foundation
import SwiftUI
import WebChannel

/// Model representing a single timestamped log entry.
struct LogEntry: Identifiable, Equatable {
  let id = UUID()
  let date: Date
  let text: String

  var formattedTimestamp: String {
    let formatter = DateFormatter()
    formatter.dateFormat = "HH:mm:ss.SSS"
    return formatter.string(from: date)
  }
}

/// Core metrics captured during a Lens simulation run.
struct LensBenchmarkMetrics: Equatable {
  var handshakeDurationMs: Double? = nil
  var m3RttToAckMs: Double? = nil  // Time to First ACK (TTFA)
  var m3TimeToFirstDetectionMs: Double? = nil  // Time to First Detection (TTFD)
  var m4RttMs: Double? = nil  // M4 Final Capture RTT
  var isRunning: Bool = false
  var isCompleted: Bool = false
}

/// Service managing the WebChannel connection lifecycle, options, and message streaming.
@Observable
final class WebChannelService: NSObject, @unchecked Sendable {

  enum ConnectionState: Equatable {
    case disconnected
    case connecting
    case connected
    case error(String)

    var statusText: String {
      switch self {
      case .disconnected: return "Disconnected"
      case .connecting: return "Connecting (Opening)..."
      case .connected: return "Connected (Opened)"
      case .error(let msg): return "Error: \(msg)"
      }
    }

    var statusColor: Color {
      switch self {
      case .disconnected: return .secondary
      case .connecting: return .orange
      case .connected: return .green
      case .error: return .red
      }
    }
  }

  // MARK: - Observable State

  var state: ConnectionState = .disconnected
  var logs: [LogEntry] = []
  var lastLatencyMs: Double? = nil
  var isBackChannelBinaryEncodingEnabled: Bool = false
  var lensMetrics = LensBenchmarkMetrics()

  // Channel Options
  var enableBinaryEncoding: Bool = false
  var sendRawJson: Bool = true
  var detectBufferingProxy: Bool = false
  var forceLongPolling: Bool = false
  var fastHandshake: Bool = false
  var fastHandshake2: Bool = false
  var nonBlockingSend: Bool = false
  var blockingHandshake: Bool = false
  var earlySendDelayMs: Int = 50

  var channelModeBadgeText: String {
    guard enableBinaryEncoding else { return "Text/JSON Channel" }
    return isBackChannelBinaryEncodingEnabled
      ? "Binary Channel (v8 Binary Stream)"
      : "Binary Channel (v8 Forward Only)"
  }

  // MARK: - Private State

  private static let maxHexPreviewBytes = 32

  private var client: WCWebChannelClient?
  private var lastSendTime: CFAbsoluteTime = 0
  private var connectTime: CFAbsoluteTime = 0
  private var pendingEchoToken: String? = nil
  private var lensM1SendTimeMs: Int64 = 0
  private var lensM3SendTimeMs: Int64 = 0
  private var lensM4SendTimeMs: Int64 = 0
  private var lensM3SendAbsoluteTime: CFAbsoluteTime = 0
  private var lensM4SendAbsoluteTime: CFAbsoluteTime = 0

  // MARK: - Public Actions

  func log(_ text: String) {
    DispatchQueue.main.async {
      self.logs.append(LogEntry(date: Date(), text: text))
    }
  }

  func clearLogs() {
    logs.removeAll()
  }

  var combinedLogsText: String {
    logs.map { "[\($0.formattedTimestamp)] \($0.text)" }.joined(separator: "\n")
  }

  func connect(to urlString: String, clearLogHistory: Bool = true) {
    guard let url = URL(string: urlString.trimmingCharacters(in: .whitespacesAndNewlines)),
      !urlString.isEmpty
    else {
      log("!!! Invalid URL provided: \"\(urlString)\"")
      state = .error("Invalid URL")
      return
    }

    disconnect()
    if clearLogHistory {
      clearLogs()
    }
    lastLatencyMs = nil

    let options = WCOptions()
    options.enableBinaryEncoding = enableBinaryEncoding
    options.isSendingRawJSON = sendRawJson
    options.shouldDetectBufferingProxy = detectBufferingProxy
    options.isLongPollingForced = forceLongPolling
    options.isFastHandshake = fastHandshake
    options.isFastHandshake2 = fastHandshake2
    options.isNonBlockingSend = nonBlockingSend
    options.isBlockingHandshake = blockingHandshake
    options.httpSessionIDParam = "gsessionid"

    if blockingHandshake {
      options.initialMessageHeaders = [
        "BlockingHandshakeDeplayHeader": "2000"
      ]
    }

    log(
      ">>> [1. Handshake Request] Opening WebChannel connection to: "
        + "\(url.absoluteString)"
    )
    log(
      ">>> Options: enableBinaryEncoding=\(enableBinaryEncoding), "
        + "nonBlockingSend=\(nonBlockingSend), "
        + "blockingHandshake=\(blockingHandshake), "
        + "sendRawJson=\(sendRawJson), fastHandshake=\(fastHandshake), "
        + "fastHandshake2=\(fastHandshake2)"
    )

    connectTime = CFAbsoluteTimeGetCurrent()
    state = .connecting

    let support = TestAppSupport(service: self)
    guard
      let newClient = WCWebChannelClient(
        url: url, options: options, delegate: self, support: support)
    else {
      log("!!! Failed to instantiate WCWebChannelClient.")
      state = .error("Init failed")
      return
    }

    self.client = newClient
    newClient.open()
  }

  func disconnect() {
    if let client = client {
      log(">>> Closing active WebChannel connection...")
      client.close()
      self.client = nil
    }
    state = .disconnected
    pendingEchoToken = nil
    isBackChannelBinaryEncodingEnabled = false
  }

  /// Connects to the server, and dispatches a send() after a slight delay (default 50ms)
  /// so that Request 1 (Handshake) is already inflight with an empty body, allowing us
  /// to test whether Request 2 is dispatched concurrently (non-blocking) or queued.
  func connectAndSendImmediately(to urlString: String, message: String) {
    connect(to: urlString)

    let delaySeconds = Double(earlySendDelayMs) / 1000.0
    log(
      "⏱ [Timing] Scheduled early send in \(earlySendDelayMs)ms "
        + "(while Handshake Request 1 is inflight)..."
    )

    DispatchQueue.main.asyncAfter(deadline: .now() + delaySeconds) { [weak self] in
      guard let self = self, self.client != nil,
        self.state == .connecting || self.state == .connected
      else {
        return
      }
      let sendMethod = self.enableBinaryEncoding ? "Data" : ""
      let optionsSummary =
        "[State: \(self.state.statusText), nonBlockingSend: \(self.nonBlockingSend), "
        + "binary: \(self.enableBinaryEncoding)]"
      self.log(
        "⚡ [2. Early Send at T+\(self.earlySendDelayMs)ms] Invoking client.send\(sendMethod)() "
          + optionsSummary
      )
      if self.enableBinaryEncoding {
        self.sendBinaryEcho(message: message)
      } else {
        self.sendEcho(message: message)
      }
    }
  }

  func sendStreaming(message: String, numMessages: Int, intervalMs: Int) {
    guard client != nil, state == .connected || state == .connecting else {
      log("!!! Cannot send: WebChannel is disconnected.")
      return
    }

    let defaultMsg = "Hello from iOS Generator :)"
    var payload: [String: Any] = [
      "message": message.isEmpty ? defaultMsg : message,
      "num_messages": max(1, numMessages),
      "message_interval": max(0, intervalMs),
    ]
    if enableBinaryEncoding || sendRawJson {
      payload["server_send_raw"] = true
    }

    if enableBinaryEncoding {
      guard let jsonData = try? JSONSerialization.data(withJSONObject: payload, options: []) else {
        log("!!! Failed to serialize binary JSON streaming payload.")
        return
      }
      sendBinaryData(
        jsonData,
        description: "binary streaming request (count=\(numMessages), interval=\(intervalMs)ms)")
    } else {
      sendPayload(
        payload, description: "streaming request (count=\(numMessages), interval=\(intervalMs)ms)")
    }
  }

  func sendEcho(message: String) {
    guard client != nil, state == .connected || state == .connecting else {
      log("!!! Cannot send: WebChannel is disconnected.")
      return
    }

    let defaultMsg = "Hello from iOS Generator :)"
    let echoToken = "req_\(Int(Date().timeIntervalSince1970 * 1000))"
    var payload: [String: Any] = [
      "echo": echoToken,
      "message": message.isEmpty ? defaultMsg : message,
    ]
    if sendRawJson {
      payload["server_send_raw"] = true
    }

    lastSendTime = CFAbsoluteTimeGetCurrent()
    pendingEchoToken = echoToken
    lastLatencyMs = nil

    sendPayload(payload, description: "echo latency request [token: \(echoToken)]")
  }

  func sendBinaryEcho(message: String) {
    guard client != nil, state == .connected || state == .connecting else {
      log("!!! Cannot send: WebChannel is disconnected.")
      return
    }
    guard enableBinaryEncoding else {
      log("!!! Cannot send binary echo: enableBinaryEncoding is disabled.")
      return
    }

    let defaultMsg = "Hello from iOS Generator :)"
    let echoToken = "bin_req_\(Int(Date().timeIntervalSince1970 * 1000))"
    let payload: [String: Any] = [
      "echo": echoToken,
      "message": message.isEmpty ? defaultMsg : message,
      "server_send_raw": true,
    ]

    guard
      let jsonData = try? JSONSerialization.data(
        withJSONObject: payload, options: [])
    else {
      log("!!! Failed to serialize binary JSON echo payload.")
      return
    }

    lastSendTime = CFAbsoluteTimeGetCurrent()
    pendingEchoToken = echoToken
    lastLatencyMs = nil

    sendBinaryData(
      jsonData, description: "binary JSON echo [token: \(echoToken)]")
  }

  func sendBinaryData(_ data: Data, description: String = "binary data") {
    guard let client = client, state == .connected || state == .connecting else {
      log("!!! Cannot send: WebChannel is disconnected.")
      return
    }
    guard enableBinaryEncoding else {
      log("!!! Warning: enableBinaryEncoding is disabled.")
      return
    }

    let hexPreview = data.prefix(WebChannelService.maxHexPreviewBytes)
      .map { String(format: "%02x", $0) }
      .joined(separator: " ")
    let suffix = data.count > WebChannelService.maxHexPreviewBytes ? "..." : ""
    log(
      ">>> Sending \(description) (\(data.count) bytes): "
        + "[\(hexPreview)\(suffix)] [State: \(state.statusText)]"
    )
    client.send(data)
  }

  // MARK: - Lens Latency Benchmark
  //
  // Simulates the Lens camera request sequence (M1: StickyCluster, M2: Heartbeat,
  // M3: Prefetch, M4: FinalCapture). For the full protocol lifecycle and handler
  // specification, see:
  // WebChannel message generator backend reference

  func resetLensMetrics() {
    lensMetrics = LensBenchmarkMetrics()
  }

  /// Runs the Lens lifecycle latency benchmark.
  /// - Parameters:
  ///   - endpointUrl: The WebChannel endpoint URL (e.g. /staging/channel/lens).
  ///   - isOmnient: If true, dispatches M1 (Sticky Cluster) and M3 (Prefetch) at T=0
  ///     concurrently with handshake (0-RTT test).
  ///   - imageSizeKb: Size of the dummy image payload for Prefetch (default 150KB).
  ///   - detectionDelayMs: Backend detection inference delay to simulate (default 50ms).
  func startLensBenchmark(
    endpointUrl: String,
    isOmnient: Bool = true,
    imageSizeKb: Int = 150,
    detectionDelayMs: Int = 50
  ) {
    disconnect()
    clearLogs()
    resetLensMetrics()
    lensMetrics.isRunning = true

    log("==================================================================")
    let modeName = isOmnient ? "Omnient 0-RTT" : "Viewfinder 500ms Warm"
    log("🚀 [Lens Benchmark] Starting Lens Latency Run (\(modeName))")
    let optionsLog =
      "⚙️ Options: fastHandshake2=\(fastHandshake2), fastHandshake=\(fastHandshake), "
      + "nonBlockingSend=\(nonBlockingSend), binary=\(enableBinaryEncoding), "
      + "imageSize=\(imageSizeKb)KB"
    log(optionsLog)
    log("==================================================================")

    connect(to: endpointUrl, clearLogHistory: false)

    let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
    lensM1SendTimeMs = nowMs

    // Message 1: Sticky Cluster Info
    let m1Payload: [String: Any] = [
      "type": "sticky_cluster_info",
      "client_send_time_ms": nowMs,
      "client_version": "iOS_18_0",
      "server_send_raw": true,
    ]

    log("📸 [Message 1] Sending StickyClusterInfo (~50 B)...")
    if enableBinaryEncoding {
      if let data = try? JSONSerialization.data(withJSONObject: m1Payload, options: []) {
        sendBinaryData(data, description: "M1 StickyClusterInfo")
      }
    } else {
      sendPayload(m1Payload, description: "M1 StickyClusterInfo")
    }

    if isOmnient {
      // Omnient mode: Send Prefetch immediately at T=0
      sendLensPrefetch(imageSizeKb: imageSizeKb, detectionDelayMs: detectionDelayMs)
    } else {
      // Camera Viewfinder mode: Send M2 heartbeat during warmup, then Prefetch at 500ms
      log("⏱ [Viewfinder] Warming channel with M2 Heartbeat, prefetch in 500ms...")
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { [weak self] in
        guard let self = self, self.lensMetrics.isRunning else { return }
        self.sendLensHeartbeat()
      }
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
        guard let self = self, self.lensMetrics.isRunning else { return }
        self.sendLensPrefetch(imageSizeKb: imageSizeKb, detectionDelayMs: detectionDelayMs)
      }
    }
  }

  private func sendLensHeartbeat() {
    let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
    let m2Payload: [String: Any] = [
      "type": "heartbeat",
      "client_send_time_ms": nowMs,
      "server_send_raw": true,
    ]

    log("💓 [Message 2 - Heartbeat] Sending warmup keepalive (~30 B)...")
    if enableBinaryEncoding {
      if let data = try? JSONSerialization.data(withJSONObject: m2Payload, options: []) {
        sendBinaryData(data, description: "M2 Heartbeat")
      }
    } else {
      sendPayload(m2Payload, description: "M2 Heartbeat")
    }
  }

  // Note: Dummy image bytes are omitted here because WebChannel text mode (WCWireV8)
  // uses URL-encoded form POSTs, and the staging GFE sandbox limits request bodies
  // to ~4KB (returning HTTP 502). The server simulator benchmarks latency based on
  // metadata (image_size_kb) rather than payload bytes. Large payload streaming
  // should strictly be tested in Binary Mode (WCWireV8Binary).
  private func sendLensPrefetch(imageSizeKb: Int, detectionDelayMs: Int) {
    let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
    lensM3SendTimeMs = nowMs
    lensM3SendAbsoluteTime = CFAbsoluteTimeGetCurrent()

    let m3Payload: [String: Any] = [
      "type": "prefetch",
      "request_id": 1,
      "ack_requested": true,
      "image_size_kb": imageSizeKb,
      "detection_delay_ms": detectionDelayMs,
      "client_send_time_ms": nowMs,
      "server_send_raw": true,
    ]

    log(
      "📸 [Message 3 - Prefetch] Sending \(imageSizeKb) KB image payload "
        + "[State: \(state.statusText)]..."
    )
    if enableBinaryEncoding {
      if let data = try? JSONSerialization.data(withJSONObject: m3Payload, options: []) {
        sendBinaryData(data, description: "M3 Prefetch (\(imageSizeKb) KB)")
      }
    } else {
      sendPayload(m3Payload, description: "M3 Prefetch (\(imageSizeKb) KB)")
    }
  }

  private func sendLensFinalCapture() {
    let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
    lensM4SendTimeMs = nowMs
    lensM4SendAbsoluteTime = CFAbsoluteTimeGetCurrent()

    let m4Payload: [String: Any] = [
      "type": "final_request",
      "request_id": 2,
      "user_interaction": "USER_INTERACTION_CAMERA_CAPTURE",
      "client_send_time_ms": nowMs,
      "server_send_raw": true,
    ]

    log("📸 [Message 4 - Final Capture] Sending final interaction request (~1 KB)...")
    if enableBinaryEncoding {
      if let data = try? JSONSerialization.data(withJSONObject: m4Payload, options: []) {
        sendBinaryData(data, description: "M4 Final Capture")
      }
    } else {
      sendPayload(m4Payload, description: "M4 Final Capture")
    }
  }

  private func sendPayload(_ payload: [String: Any], description: String) {
    guard let client = client else { return }

    if sendRawJson || payload["message"] == nil {
      guard let jsonData = try? JSONSerialization.data(withJSONObject: payload, options: []),
        let jsonString = String(data: jsonData, encoding: .utf8)
      else {
        log("!!! Failed to serialize JSON payload.")
        return
      }
      let preview =
        jsonString.count > 256
        ? "\(jsonString.prefix(256))... (\(jsonString.count) chars)" : jsonString
      log(">>> Sending \(description): \(preview) [Current Channel State: \(state.statusText)]")
      client.send(jsonString)
    } else {
      let stringMessage = payload["message"] as? String ?? ""
      let preview =
        stringMessage.count > 256
        ? "\(stringMessage.prefix(256))... (\(stringMessage.count) chars)" : stringMessage
      log(
        ">>> Sending \(description) (map mode): \(preview) "
          + "[Current Channel State: \(state.statusText)]"
      )
      client.send(stringMessage)
    }
  }
}

// MARK: - WCWebChannelClientHandlerDelegate

extension WebChannelService: WCWebChannelClientHandlerDelegate {

  func webChannelOpened(_ client: any WCWebChannelClientProtocol) {
    let now = CFAbsoluteTimeGetCurrent()
    let elapsed = (now - self.connectTime) * 1000.0
    let isBinary =
      (client as? (any WCWebChannelClientReadWrite))?.runtimeProperties
      .isBackChannelBinaryEncodingEnabled ?? false

    DispatchQueue.main.async {
      self.state = .connected
      self.isBackChannelBinaryEncodingEnabled = isBinary
      self.lensMetrics.handshakeDurationMs = elapsed
      let binaryStatus = self.isBackChannelBinaryEncodingEnabled ? "Active" : "Inactive"
      self.log(
        String(
          format:
            "✅ [Event: webChannelOpened] Handshake completed at T+%.1fms -> "
            + "State: Connected (Opened) [Binary Encoding: %@]",
          elapsed, binaryStatus))
    }
  }

  func webChannelClosed(_ client: any WCWebChannelClientProtocol) {
    DispatchQueue.main.async {
      self.state = .disconnected
      self.client = nil
      self.pendingEchoToken = nil
      self.isBackChannelBinaryEncodingEnabled = false
      self.lensMetrics.isRunning = false
      self.log("<<< [Event: webChannelClosed] WebChannel connection closed.")
    }
  }

  func webChannel(_ client: any WCWebChannelClientProtocol, didReceiveMessage message: Any) {
    let now = CFAbsoluteTimeGetCurrent()
    let isBinary =
      (client as? (any WCWebChannelClientReadWrite))?.runtimeProperties
      .isBackChannelBinaryEncodingEnabled
    let formattedMessage = self.formatReceivedMessage(message)
    let jsonDict = self.parseJsonDictionary(message)

    DispatchQueue.main.async {
      if let isBinary = isBinary {
        self.isBackChannelBinaryEncodingEnabled = isBinary
      }

      if let token = self.pendingEchoToken, formattedMessage.contains(token) {
        let latency = (now - self.lastSendTime) * 1000.0
        let totalFromConnect = (now - self.connectTime) * 1000.0
        self.lastLatencyMs = latency
        self.pendingEchoToken = nil
        self.log(
          String(
            format:
              "⚡ <<< [E2E Latency] Echo response received in %.1f ms from send "
              + "(Total T+%.1fms from connect) [State: %@]",
            latency, totalFromConnect, self.state.statusText))
      }

      // Handle Lens responses
      if let dict = jsonDict, let type = dict["type"] as? String {
        if type == "sticky_cluster_info_response" {
          let forwardLatency = self.extractLatencyMs(from: dict)
          let cluster = dict["cluster"] as? String ?? "unknown"
          self.log(
            String(
              format:
                "🎯 [Lens M1] StickyClusterInfo response received! "
                + "Cluster: %@ | Forward (est): %.1f ms",
              cluster, forwardLatency))
        } else if type == "heartbeat_ack" {
          let forwardLatency = self.extractLatencyMs(from: dict)
          self.log(
            String(
              format: "🎯 [Lens M2 Heartbeat] Heartbeat ACK received! Forward (est): %.1f ms",
              forwardLatency))
        } else if type == "ack_response" {
          let rtt = (CFAbsoluteTimeGetCurrent() - self.lensM3SendAbsoluteTime) * 1000.0
          let forwardLatency = self.extractLatencyMs(from: dict)
          self.lensMetrics.m3RttToAckMs = rtt
          self.log(
            String(
              format:
                "🎯 [Lens M3 Prefetch] Stream ACK received! "
                + "TTFA (RTT): %.1f ms | Forward (est): %.1f ms",
              rtt, forwardLatency))
        } else if type == "preliminary_detections" {
          let ttfd = (CFAbsoluteTimeGetCurrent() - self.lensM3SendAbsoluteTime) * 1000.0
          self.lensMetrics.m3TimeToFirstDetectionMs = ttfd
          self.log(
            String(
              format:
                "🎯 [Lens M3 Prefetch] Preliminary Detections received! "
                + "TTFD: %.1f ms",
              ttfd))
          self.sendLensFinalCapture()
        } else if type == "interaction_response" {
          let m4Rtt =
            self.lensM4SendAbsoluteTime > 0
            ? (CFAbsoluteTimeGetCurrent() - self.lensM4SendAbsoluteTime) * 1000.0 : nil
          self.lensMetrics.m4RttMs = m4Rtt
          self.lensMetrics.isRunning = false
          self.lensMetrics.isCompleted = true
          let forwardLatency = self.extractLatencyMs(from: dict)
          let rttStr = m4Rtt != nil ? String(format: "%.1f ms", m4Rtt!) : "n/a"
          self.log(
            String(
              format:
                "🎉 [Lens Benchmark Complete] All lifecycle stages finished! "
                + "M4 RTT: %@ | Forward (est): %.1f ms",
              rttStr, forwardLatency))
        }
      }

      self.log("<<< [Event: didReceiveMessage] Message: \(formattedMessage)")
    }
  }

  func webChannel(
    _ client: any WCWebChannelClientProtocol,
    encounteredError error: WCWebChannelClientError
  ) {
    let errorDesc = self.describeError(error)
    DispatchQueue.main.async {
      self.state = .error(errorDesc)
      self.client = nil
      self.pendingEchoToken = nil
      self.isBackChannelBinaryEncodingEnabled = false
      self.lensMetrics.isRunning = false
      self.log("❌ <<< [Event: encounteredError] Error: \(errorDesc) (code \(error.rawValue))")
    }
  }

  func webChannel(
    _ client: any WCWebChannelClientProtocol,
    didReceiveHeaders headers: [String: String],
    statusCode: Int32
  ) {
    let now = CFAbsoluteTimeGetCurrent()
    let elapsed = (now - self.connectTime) * 1000.0
    let headersDesc = headers.description
    DispatchQueue.main.async {
      self.log(
        String(
          format: "<<< [HTTP Response at T+%.1fms] Status %d, Headers: %@", elapsed, statusCode,
          headersDesc))
    }
  }

  func webChannel(
    _ client: any WCWebChannelClientProtocol,
    didReceiveMetadata metadata: Any,
    key: String
  ) {
    let metaDesc = "\(metadata)"
    DispatchQueue.main.async {
      self.log("<<< [Metadata: \(key)]: \(metaDesc)")
    }
  }

  // MARK: - Formatting & Parsing Helpers

  private func extractLatencyMs(
    from dict: [String: Any], key: String = "forward_latency_ms"
  ) -> Double {
    return (dict[key] as? Double) ?? Double(dict[key] as? Int ?? 0)
  }

  private func extractInt64(
    from dict: [String: Any], key: String
  ) -> Int64? {
    if let val = dict[key] as? Int64 {
      return val
    }
    if let val = dict[key] as? Int {
      return Int64(val)
    }
    if let val = dict[key] as? Double {
      return Int64(val)
    }
    if let val = dict[key] as? NSNumber {
      return val.int64Value
    }
    return nil
  }

  private func parseJsonDictionary(_ message: Any) -> [String: Any]? {
    if let dict = message as? [String: Any] {
      return dict
    }
    if let arr = message as? [Any] {
      for item in arr {
        if let d = parseJsonDictionary(item) {
          return d
        }
      }
    }
    if let data = message as? Data {
      if let json = try? JSONSerialization.jsonObject(with: data, options: []) {
        return parseJsonDictionary(json)
      }
    }
    if let str = message as? String, let data = str.data(using: .utf8) {
      if let json = try? JSONSerialization.jsonObject(with: data, options: []) {
        return parseJsonDictionary(json)
      }
    }
    return nil
  }

  private func formatReceivedMessage(_ message: Any) -> String {
    if let data = message as? Data {
      let hexPreview = data.prefix(WebChannelService.maxHexPreviewBytes)
        .map { String(format: "%02x", $0) }
        .joined(separator: " ")
      let suffix = data.count > WebChannelService.maxHexPreviewBytes ? "..." : ""
      if let str = String(data: data, encoding: .utf8), !str.isEmpty {
        let strPreview =
          str.count > 500 ? "\(str.prefix(500))... (\(str.count) chars)" : str
        return "[Binary NSData: \(data.count) bytes] Hex: [\(hexPreview)\(suffix)] "
          + "| UTF-8: \(strPreview)"
      } else {
        return "[Binary NSData: \(data.count) bytes] Hex: [\(hexPreview)\(suffix)]"
      }
    }
    if let str = message as? String {
      return str.count > 500 ? "\(str.prefix(500))... (\(str.count) chars)" : str
    }
    if JSONSerialization.isValidJSONObject(message),
      let data = try? JSONSerialization.data(withJSONObject: message, options: [.prettyPrinted]),
      let str = String(data: data, encoding: .utf8)
    {
      return str.count > 500 ? "\(str.prefix(500))... (\(str.count) chars)" : str
    }
    let desc = String(describing: message)
    return desc.count > 500 ? "\(desc.prefix(500))... (\(desc.count) chars)" : desc
  }

  private func describeError(_ error: WCWebChannelClientError) -> String {
    switch error {
    case .none: return "None"
    case .requestFailed: return "RequestFailed"
    case .loggedOut: return "LoggedOut"
    case .noData: return "NoData"
    case .unknownSessionID: return "UnknownSessionID"
    case .stop: return "Stop"
    case .network: return "Network"
    case .badData: return "BadData"
    case .badResponse: return "BadResponse"
    @unknown default: return "UnknownError(\(error.rawValue))"
    }
  }
}
