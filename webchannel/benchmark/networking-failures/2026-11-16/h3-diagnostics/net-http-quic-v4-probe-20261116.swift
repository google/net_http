import Foundation
import Network

let queue = DispatchQueue(label: "quic-preflight")
let group = DispatchGroup()
var connections: [NWConnection] = []
for host in ["webchannel.sandbox.google.com", "www.google.com"] {
  group.enter()
  let options = NWProtocolQUIC.Options(alpn: ["h3"])
  let parameters = NWParameters(quic: options)
  parameters.requiredLocalEndpoint = .hostPort(host: "0.0.0.0", port: .any)
  let connection = NWConnection(host: NWEndpoint.Host(host), port: 443, using: parameters)
  connections.append(connection)
  let began = ProcessInfo.processInfo.systemUptime
  var finished = false
  func finish(_ outcome: String) {
    guard !finished else { return }
    finished = true
    let record: [String: Any] = ["host": host, "outcome": outcome,
      "elapsedSeconds": ProcessInfo.processInfo.systemUptime - began,
      "note": "Mac IPv4-only QUIC handshake only, not an iPhone HTTP/3/WebChannel transaction"]
    if let data = try? JSONSerialization.data(withJSONObject: record, options: [.sortedKeys]) {
      print(String(decoding: data, as: UTF8.self))
    }
    connection.cancel()
    group.leave()
  }
  connection.stateUpdateHandler = { state in
    switch state {
    case .ready: finish("quic-ready")
    case .failed(let error): finish("failed: \(error)")
    default: break
    }
  }
  queue.asyncAfter(deadline: .now() + 12) { finish("timeout") }
  connection.start(queue: queue)
}
group.wait()
