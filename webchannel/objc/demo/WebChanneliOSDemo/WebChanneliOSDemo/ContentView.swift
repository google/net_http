import SwiftUI

struct ContentView: View {
    @StateObject private var manager = WebChannelManager()
    @State private var isShowingSettings = false
    @State private var autoScroll = true
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Top Status Bar
                statusHeaderView
                
                Divider()
                
                // Controls & Payload Action
                controlsSection
                
                Divider()
                
                // Log Console
                consoleLogSection
            }
            .navigationTitle("WebChannel Demo")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        isShowingSettings.toggle()
                    } label: {
                        Image(systemName: "gearshape")
                    }
                }
            }
            .sheet(isPresented: $isShowingSettings) {
                settingsSheet
            }
        }
        .navigationViewStyle(.stack)
    }
    
    // MARK: - Status Header
    private var statusHeaderView: some View {
        HStack {
            Image(systemName: manager.state.iconName)
                .foregroundColor(manager.state.color)
                .font(.headline)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(manager.state.rawValue)
                    .font(.subheadline.bold())
                    .foregroundColor(.primary)
                
                Text(manager.endpointURL)
                    .font(.caption2)
                    .foregroundColor(.secondary)
                    .lineLimit(1)
                    .truncationMode(.middle)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 2) {
                Text("Recv: \(manager.messagesReceivedCount)")
                    .font(.caption.bold())
                    .foregroundColor(.blue)
                
                if let status = manager.lastStatusCode {
                    Text("HTTP \(status)")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(Color(UIColor.secondarySystemBackground))
    }
    
    // MARK: - Action Controls
    private var controlsSection: some View {
        VStack(spacing: 8) {
            HStack(spacing: 10) {
                Button(action: {
                    manager.connectAndRunDemo()
                }) {
                    HStack {
                        Image(systemName: "play.fill")
                        Text("Connect & Run")
                    }
                    .font(.subheadline.bold())
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(8)
                }
                .disabled(manager.state == .connecting)
                
                Button(action: {
                    manager.closeConnection()
                }) {
                    HStack {
                        Image(systemName: "stop.fill")
                        Text("Disconnect")
                    }
                    .font(.subheadline.bold())
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(manager.state == .connected ? Color.red : Color.gray.opacity(0.3))
                    .foregroundColor(.white)
                    .cornerRadius(8)
                }
                .disabled(manager.state == .disconnected)
            }
            
            // Custom Payload input and Send button
            HStack(spacing: 8) {
                TextField("Payload JSON", text: $manager.customPayload)
                    .font(.system(size: 12, design: .monospaced))
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                
                Button(action: {
                    manager.sendPayload(manager.customPayload)
                }) {
                    Text("Send")
                        .font(.caption.bold())
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(manager.state == .connected ? Color.green : Color.gray.opacity(0.3))
                        .foregroundColor(.white)
                        .cornerRadius(6)
                }
                .disabled(manager.state != .connected)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }
    
    // MARK: - Console Log Section
    private var consoleLogSection: some View {
        VStack(spacing: 0) {
            HStack {
                Text("Console Logs (\(manager.logs.count))")
                    .font(.caption.bold())
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Button {
                    autoScroll.toggle()
                } label: {
                    Image(systemName: autoScroll ? "arrow.down.to.line.compact" : "arrow.up.and.down.compact")
                        .font(.caption)
                        .foregroundColor(autoScroll ? .blue : .gray)
                }
                .padding(.trailing, 8)
                
                Button("Clear") {
                    manager.clearLogs()
                }
                .font(.caption)
                .foregroundColor(.red)
                
                Divider()
                    .frame(height: 12)
                    .padding(.horizontal, 4)
                
                if #available(iOS 16.0, *) {
                    ShareLink(item: formattedLogsText) {
                        Image(systemName: "square.and.arrow.up")
                            .font(.caption)
                    }
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Color(UIColor.tertiarySystemBackground))
            
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 4) {
                        ForEach(manager.logs) { log in
                            HStack(alignment: .top, spacing: 6) {
                                Text(log.type.icon)
                                    .font(.caption2)
                                
                                Text(log.formattedTime)
                                    .font(.system(size: 10, design: .monospaced))
                                    .foregroundColor(.secondary)
                                
                                Text(log.message)
                                    .font(.system(size: 11, design: .monospaced))
                                    .foregroundColor(logTextColor(for: log.type))
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                            .id(log.id)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                        }
                    }
                    .padding(.vertical, 6)
                }
                .background(Color(UIColor.systemBackground))
                .onChange(of: manager.logs.count) { _ in
                    if autoScroll, let last = manager.logs.last {
                        withAnimation {
                            proxy.scrollTo(last.id, anchor: .bottom)
                        }
                    }
                }
            }
        }
    }
    
    private var formattedLogsText: String {
        manager.logs.map { "[\($0.formattedTime)] \($0.type.icon) \($0.message)" }.joined(separator: "\n")
    }
    
    private func logTextColor(for type: LogType) -> Color {
        switch type {
        case .info: return .primary
        case .open: return .green
        case .send: return .blue
        case .receive: return .purple
        case .header: return .orange
        case .error: return .red
        case .close: return .secondary
        }
    }
    
    // MARK: - Settings Sheet
    private var settingsSheet: some View {
        NavigationView {
            Form {
                Section(header: Text("Connection Configuration")) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Base Endpoint URL").font(.caption).foregroundColor(.secondary)
                        TextField("Endpoint URL", text: $manager.endpointURL)
                            .font(.system(size: 12, design: .monospaced))
                            .autocapitalization(.none)
                            .disableAutocorrection(true)
                    }
                    
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Session ID Param").font(.caption).foregroundColor(.secondary)
                        TextField("Session ID Param", text: $manager.sessionIDParam)
                            .font(.system(size: 13, design: .monospaced))
                            .autocapitalization(.none)
                            .disableAutocorrection(true)
                    }
                    
                    Toggle("Fast Handshake", isOn: $manager.isFastHandshake)
                }
                
                Section(header: Text("Target Information")) {
                    Text("Tested against: webchannel.sandbox.google.com")
                        .font(.caption)
                    Text("Backend generator will send specified number of echoed messages with configured intervals.")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Options")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        isShowingSettings = false
                    }
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
