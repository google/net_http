import Foundation
import Network

/// Opt-in T13 setup validation. These HTTP/1.1 connectivity probes are not WebChannel traffic.
final class InterfaceConnectivityProbe: @unchecked Sendable {
  private final class Attempt {
    let connection: NWConnection
    let batch: String
    let label: String
    let started = ProcessInfo.processInfo.systemUptime
    var response = Data()
    var timeout: DispatchWorkItem?

    init(connection: NWConnection, batch: String, label: String) {
      self.connection = connection
      self.batch = batch
      self.label = label
    }
  }

  private let queue = DispatchQueue(label: "nettest.interface-connectivity")
  private var attempts: [String: Attempt] = [:]
  private let host = "webchannel.sandbox.google.com"

  private func pathFields(_ path: NWPath?) -> [String: Any] {
    guard let path else { return ["pathAvailable": false] }
    return [
      "pathAvailable": true, "status": String(describing: path.status),
      "wifi": path.usesInterfaceType(.wifi), "cellular": path.usesInterfaceType(.cellular),
      "wired": path.usesInterfaceType(.wiredEthernet), "expensive": path.isExpensive,
      "interfaces": path.availableInterfaces.map {
        ["name": $0.name, "type": String(describing: $0.type)]
      },
    ]
  }

  func run() {
    queue.async {
      guard self.attempts.isEmpty else {
        NetworkFailureLog.emit("interface_probe_busy")
        return
      }
      let batch = UUID().uuidString
      NetworkFailureLog.emit("interface_batch_start", ["batch": batch, "timeoutSeconds": 8])
      self.start(batch: batch, label: "wifi", type: .wifi)
      self.start(batch: batch, label: "cellular", type: .cellular)
    }
  }

  private func start(batch: String, label: String, type: NWInterface.InterfaceType) {
    let parameters = NWParameters.tls
    parameters.requiredInterfaceType = type
    let connection = NWConnection(host: NWEndpoint.Host(host), port: 443, using: parameters)
    let key = batch + ":" + label
    let attempt = Attempt(connection: connection, batch: batch, label: label)
    attempts[key] = attempt
    NetworkFailureLog.emit("interface_probe_start", ["batch": batch, "requiredInterface": label])
    connection.pathUpdateHandler = { [weak self] path in
      guard let self, self.attempts[key] != nil else { return }
      NetworkFailureLog.emit(
        "interface_probe_path",
        ["batch": batch, "requiredInterface": label, "path": self.pathFields(path)])
    }
    connection.stateUpdateHandler = { [weak self] state in
      guard let self, self.attempts[key] != nil else { return }
      NetworkFailureLog.emit(
        "interface_probe_state",
        ["batch": batch, "requiredInterface": label, "state": String(describing: state)])
      switch state {
      case .ready:
        let request =
          "HEAD /staging/channel/generator HTTP/1.1\r\nHost: \(self.host)\r\nConnection: close\r\nCache-Control: no-cache\r\n\r\n"
        connection.send(
          content: Data(request.utf8),
          completion: .contentProcessed { [weak self] error in
            guard let self else { return }
            if let error {
              self.finish(key, outcome: "send-error", details: ["error": String(describing: error)])
            } else {
              self.receive(key)
            }
          })
      case .failed(let error):
        self.finish(
          key, outcome: "connection-failed", details: ["error": String(describing: error)])
      default: break
      }
    }
    let timeout = DispatchWorkItem { [weak self] in self?.finish(key, outcome: "timeout") }
    attempt.timeout = timeout
    connection.start(queue: queue)
    queue.asyncAfter(deadline: .now() + 8, execute: timeout)
  }

  private func receive(_ key: String) {
    guard let attempt = attempts[key] else { return }
    attempt.connection.receive(minimumIncompleteLength: 1, maximumLength: 16384) {
      [weak self] data, _, complete, error in
      guard let self, let attempt = self.attempts[key] else { return }
      if let data { attempt.response.append(data) }
      if let text = String(data: attempt.response, encoding: .utf8), text.contains("\r\n\r\n") {
        let firstLine = String(text.split(separator: "\n", maxSplits: 1).first ?? "")
          .trimmingCharacters(in: .whitespacesAndNewlines)
        let parts = firstLine.split(separator: " ")
        if parts.count >= 2, parts[0].hasPrefix("HTTP/1."), let status = Int(parts[1]) {
          self.finish(
            key, outcome: "http-response", details: ["statusCode": status, "statusLine": firstLine])
        } else {
          self.finish(key, outcome: "malformed-response")
        }
      } else if let error {
        self.finish(key, outcome: "receive-error", details: ["error": String(describing: error)])
      } else if complete || attempt.response.count > 65536 {
        self.finish(key, outcome: "incomplete-response")
      } else {
        self.receive(key)
      }
    }
  }

  private func finish(_ key: String, outcome: String, details: [String: Any] = [:]) {
    guard let attempt = attempts.removeValue(forKey: key) else { return }
    var record = details
    record["batch"] = attempt.batch
    record["requiredInterface"] = attempt.label
    record["outcome"] = outcome
    record["elapsedSeconds"] = ProcessInfo.processInfo.systemUptime - attempt.started
    record["path"] = pathFields(attempt.connection.currentPath)
    NetworkFailureLog.emit("interface_probe_result", record)
    attempt.timeout?.cancel()
    attempt.connection.stateUpdateHandler = nil
    attempt.connection.pathUpdateHandler = nil
    attempt.connection.cancel()
    if attempts.isEmpty {
      NetworkFailureLog.emit("interface_batch_complete", ["batch": attempt.batch])
    }
  }

  func cancel() {
    queue.async {
      for key in Array(self.attempts.keys) { self.finish(key, outcome: "controller-cancelled") }
    }
  }
}
