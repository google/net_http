import Foundation
import SwiftUI
import WebChannel

enum ConnectionState: String {
    case disconnected = "Disconnected"
    case connecting = "Connecting..."
    case connected = "Connected"
    case closing = "Closing..."
    case error = "Error"
    
    var color: Color {
        switch self {
        case .disconnected: return .secondary
        case .connecting: return .orange
        case .connected: return .green
        case .closing: return .purple
        case .error: return .red
        }
    }
    
    var iconName: String {
        switch self {
        case .disconnected: return "circle"
        case .connecting: return "arrow.clockwise.circle"
        case .connected: return "checkmark.circle.fill"
        case .closing: return "slash.circle"
        case .error: return "exclamationmark.triangle.fill"
        }
    }
}

enum LogType {
    case info
    case open
    case send
    case receive
    case header
    case error
    case close
    
    var icon: String {
        switch self {
        case .info: return "ℹ️"
        case .open: return "✅"
        case .send: return "📤"
        case .receive: return "📥"
        case .header: return "📋"
        case .error: return "❌"
        case .close: return "⏹️"
        }
    }
}

struct LogItem: Identifiable, Equatable {
    let id = UUID()
    let timestamp: Date
    let type: LogType
    let message: String
    
    var formattedTime: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss.SSS"
        return formatter.string(from: timestamp)
    }
}

@MainActor
final class WebChannelManager: NSObject, ObservableObject, WCWebChannelClientHandlerDelegate {
    @Published var endpointURL: String = "https://webchannel.sandbox.google.com/staging/channel/generator"
    @Published var sessionIDParam: String = "gsessionid"
    @Published var isFastHandshake: Bool = false
    @Published var customPayload: String = "{\"message\":\"Hello from iOS WebChannel!\",\"num_messages\":3,\"message_interval\":500}"
    
    @Published var state: ConnectionState = .disconnected
    @Published var messagesReceivedCount: Int = 0
    @Published var lastStatusCode: Int? = nil
    @Published var logs: [LogItem] = []
    
    private var client: WCWebChannelClient?
    
    override init() {
        super.init()
        appendLog(.info, "Ready. Tap 'Connect & Test' to start.")
    }
    
    func connectAndRunDemo() {
        guard let url = URL(string: endpointURL) else {
            appendLog(.error, "Invalid Endpoint URL: \(endpointURL)")
            state = .error
            return
        }
        
        closeConnection()
        
        state = .connecting
        messagesReceivedCount = 0
        lastStatusCode = nil
        appendLog(.info, "Opening connection to: \(url.absoluteString)")
        
        let options = WCOptions()
        options.isFastHandshake = isFastHandshake
        options.httpSessionIDParam = sessionIDParam
        
        client = WCWebChannelClient(url: url, options: options, delegate: self)
        client?.open()
    }
    
    func sendPayload(_ payload: String) {
        guard let client = client, state == .connected else {
            appendLog(.error, "Cannot send message: Not connected.")
            return
        }
        
        appendLog(.send, payload)
        client.send(payload)
    }
    
    func closeConnection() {
        if let client = client {
            state = .closing
            appendLog(.info, "Closing WebChannel connection...")
            client.close()
            self.client = nil
        } else {
            state = .disconnected
        }
    }
    
    func clearLogs() {
        logs.removeAll()
    }
    
    private func appendLog(_ type: LogType, _ message: String) {
        let item = LogItem(timestamp: Date(), type: type, message: message)
        logs.append(item)
    }
    
    // MARK: - WCWebChannelClientHandlerDelegate
    
    nonisolated func webChannelOpened(_ client: any WCWebChannelClientProtocol) {
        Task { @MainActor in
            self.state = .connected
            self.appendLog(.open, "Connection Opened successfully!")
            
            // Automatically send the generator payload demo as in main.swift
            if !self.customPayload.isEmpty {
                self.appendLog(.send, "Auto-sending generator payload: \(self.customPayload)")
                client.send(self.customPayload)
            }
        }
    }
    
    nonisolated func webChannelClosed(_ client: any WCWebChannelClientProtocol) {
        Task { @MainActor in
            self.state = .disconnected
            self.appendLog(.close, "Connection Closed.")
        }
    }
    
    nonisolated func webChannel(_ client: any WCWebChannelClientProtocol, didReceiveMessage message: Any) {
        Task { @MainActor in
            self.messagesReceivedCount += 1
            let desc: String
            if let str = message as? String {
                desc = str
            } else if let dict = message as? [String: Any],
                      let data = try? JSONSerialization.data(withJSONObject: dict, options: [.prettyPrinted]),
                      let str = String(data: data, encoding: .utf8) {
                desc = str
            } else {
                desc = "\(message)"
            }
            self.appendLog(.receive, "Received [\(self.messagesReceivedCount)]: \(desc)")
        }
    }
    
    nonisolated func webChannel(_ client: any WCWebChannelClientProtocol, encounteredError error: WCWebChannelClientError) {
        Task { @MainActor in
            self.state = .error
            let errorMsg = self.describeError(error)
            self.appendLog(.error, "Encountered Error: \(errorMsg) (Code: \(error.rawValue))")
        }
    }
    
    nonisolated func webChannel(_ client: any WCWebChannelClientProtocol, didReceiveHeaders headers: [String: String], statusCode: Int32) {
        Task { @MainActor in
            self.lastStatusCode = Int(statusCode)
            self.appendLog(.header, "Headers (HTTP \(statusCode)): \(headers)")
        }
    }
    
    nonisolated func webChannel(_ client: any WCWebChannelClientProtocol, didReceiveMetadata metadata: Any, key: String) {
        Task { @MainActor in
            self.appendLog(.info, "Metadata [\(key)]: \(metadata)")
        }
    }
    
    private func describeError(_ error: WCWebChannelClientError) -> String {
        switch error {
        case .none: return "None"
        case .requestFailed: return "Request Failed (HTTP Error / Timeout)"
        case .loggedOut: return "Logged Out"
        case .noData: return "No Data"
        case .unknownSessionID: return "Unknown Session ID"
        case .stop: return "Stop"
        case .network: return "Network Error"
        case .badData: return "Bad Data"
        case .badResponse: return "Bad Response"
        @unknown default: return "Unknown Error (\(error.rawValue))"
        }
    }
}
