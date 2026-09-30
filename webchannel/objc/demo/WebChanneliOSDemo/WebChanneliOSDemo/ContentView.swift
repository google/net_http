import SwiftUI

/// Main container view with a bottom tab bar separating standard Generator testing
/// from Lens Latency Benchmarks.
struct ContentView: View {
  @State private var service = WebChannelService()

  var body: some View {
    TabView {
      GeneratorTabView(service: service)
        .tabItem {
          Label("Generator", systemImage: "paperplane.fill")
        }

      LensBenchmarkTabView(service: service)
        .tabItem {
          Label("Lens Benchmark", systemImage: "camera.viewfinder")
        }
    }
  }
}

// MARK: - Tab 1: GeneratorTabView

struct GeneratorTabView: View {
  @Bindable var service: WebChannelService

  @State private var endpointUrl: String =
    "https://webchannel.sandbox.google.com/staging/channel/generator"
  @State private var messageText: String = "Hello from iOS Generator :)"
  @State private var numMessages: Int = 5
  @State private var messageIntervalMs: Int = 1000
  @State private var selectedMode: SendMode = .echo

  enum SendMode: String, CaseIterable, Identifiable {
    case echo = "Echo"
    case streaming = "Streaming"

    var id: String { rawValue }
  }

  var body: some View {
    NavigationStack {
      ScrollView {
        VStack(spacing: 16) {
          endpointSection
          optionsSection
          connectionSection
          messagingSection
          LogsSectionView(service: service)
        }
        .padding()
      }
      .navigationTitle("WebChannel Generator")
      .navigationBarTitleDisplayMode(.inline)
    }
  }

  // MARK: Subviews

  private var endpointSection: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text("Endpoint URL")
        .font(.subheadline)
        .fontWeight(.semibold)

      TextField("Enter WebChannel endpoint URL...", text: $endpointUrl)
        .textFieldStyle(.roundedBorder)
        .textInputAutocapitalization(.never)
        .autocorrectionDisabled(true)
        .disabled(service.state == .connected || service.state == .connecting)

      HStack(spacing: 8) {
        Button("Staging") {
          endpointUrl = "https://webchannel.sandbox.google.com/staging/channel/generator"
        }
        .buttonStyle(.bordered)
        .controlSize(.small)
        .disabled(service.state == .connected || service.state == .connecting)

        Button("Localhost (8080)") {
          endpointUrl = "http://localhost:8080/staging/channel/generator"
        }
        .buttonStyle(.bordered)
        .controlSize(.small)
        .disabled(service.state == .connected || service.state == .connecting)
      }
    }
    .padding()
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 10))
  }

  private var optionsSection: some View {
    DisclosureGroup("Connection Options (WCOptions)") {
      VStack(alignment: .leading, spacing: 14) {
        // Category 1: Wire Format & Encoding
        VStack(alignment: .leading, spacing: 6) {
          Text("Wire Format & Encoding")
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundStyle(.secondary)
          Toggle("enableBinaryEncoding (V8 Binary Framing)", isOn: $service.enableBinaryEncoding)
          Toggle(
            service.enableBinaryEncoding
              ? "sendRawJson (Disabled in Binary Mode)" : "sendRawJson",
            isOn: $service.sendRawJson
          )
          .disabled(service.enableBinaryEncoding)
        }

        Divider()

        // Category 2: Handshake & Concurrency
        VStack(alignment: .leading, spacing: 6) {
          Text("Handshake & Concurrency")
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundStyle(.secondary)
          Toggle("fastHandshake2 (0-RTT + Non-Blocking)", isOn: $service.fastHandshake2)
          Toggle("fastHandshake (1-RTT)", isOn: $service.fastHandshake)
          Toggle("nonBlockingSend", isOn: $service.nonBlockingSend)
          Toggle("blockingHandshake (Server Delays Init)", isOn: $service.blockingHandshake)

          HStack {
            Text("Early Send Delay: \(service.earlySendDelayMs)ms")
              .font(.caption)
              .fontWeight(.medium)
            Spacer()
            Stepper("", value: $service.earlySendDelayMs, in: 0...500, step: 25)
              .labelsHidden()
          }
          .padding(.top, 2)
        }

        Divider()

        // Category 3: Transport & Resilience
        VStack(alignment: .leading, spacing: 6) {
          Text("Transport & Resilience")
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundStyle(.secondary)
          Toggle("forceLongPolling", isOn: $service.forceLongPolling)
          Toggle("detectBufferingProxy", isOn: $service.detectBufferingProxy)
        }
      }
      .padding(.top, 6)
      .padding(.trailing, 6)
      .disabled(service.state == .connected || service.state == .connecting)
    }
    .padding()
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 10))
  }

  private var connectionSection: some View {
    VStack(spacing: 12) {
      HStack {
        VStack(alignment: .leading, spacing: 4) {
          HStack(spacing: 6) {
            Circle()
              .fill(service.state.statusColor)
              .frame(width: 10, height: 10)
            Text(service.state.statusText)
              .font(.subheadline)
              .fontWeight(.medium)
          }

          if service.state == .connected {
            HStack(spacing: 6) {
              HStack(spacing: 4) {
                Circle()
                  .fill(service.enableBinaryEncoding ? Color.purple : Color.blue)
                  .frame(width: 7, height: 7)
                Text(service.channelModeBadgeText)
                  .font(.caption2)
                  .foregroundStyle(service.enableBinaryEncoding ? Color.purple : Color.blue)
              }
              .padding(.horizontal, 6)
              .padding(.vertical, 2)
              .background(
                service.enableBinaryEncoding
                  ? Color.purple.opacity(0.12) : Color.blue.opacity(0.1)
              )
              .clipShape(RoundedRectangle(cornerRadius: 4))

              if let handshake = service.handshakeLatencyMs {
                HStack(spacing: 4) {
                  Image(systemName: "bolt.fill")
                    .font(.system(size: 9))
                  Text(String(format: "Handshake: %.1f ms", handshake))
                    .font(.caption2)
                    .fontWeight(.semibold)
                }
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(Color.green.opacity(0.12))
                .foregroundStyle(.green)
                .clipShape(RoundedRectangle(cornerRadius: 4))
              }
            }
          }
        }

        Spacer()

        if service.state == .connected || service.state == .connecting {
          Button(role: .destructive) {
            service.disconnect()
          } label: {
            Text("Disconnect")
          }
          .buttonStyle(.borderedProminent)
        }
      }

      if service.state == .disconnected {
        HStack(spacing: 10) {
          Button {
            service.connect(to: endpointUrl)
          } label: {
            Text("Connect")
              .font(.subheadline)
              .fontWeight(.semibold)
              .frame(maxWidth: .infinity)
          }
          .buttonStyle(.borderedProminent)
          .tint(.green)

          Button {
            service.connectAndSendImmediately(to: endpointUrl, message: messageText)
          } label: {
            Text("Connect & Send")
              .font(.subheadline)
              .fontWeight(.semibold)
              .frame(maxWidth: .infinity)
          }
          .buttonStyle(.borderedProminent)
          .tint(.purple)
        }

        HStack {
          Label("Early Send Delay: \(service.earlySendDelayMs)ms", systemImage: "timer")
            .font(.caption)
            .fontWeight(.medium)
            .foregroundStyle(.secondary)
          Spacer()
          Stepper("", value: $service.earlySendDelayMs, in: 0...500, step: 25)
            .labelsHidden()
        }
        .padding(.horizontal, 4)
        .padding(.top, 4)
      }
    }
    .padding()
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 10))
  }

  private var messagingSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack {
        Text("Send Message")
          .font(.subheadline)
          .fontWeight(.semibold)

        Spacer()

        Text(
          service.enableBinaryEncoding
            ? "Channel Mode: Binary (Octet-Stream)"
            : "Channel Mode: Text/JSON"
        )
        .font(.caption2)
        .foregroundStyle(.secondary)
      }

      Picker("Mode", selection: $selectedMode) {
        ForEach(SendMode.allCases) { mode in
          Text(mode.rawValue).tag(mode)
        }
      }
      .pickerStyle(.segmented)

      TextField("Message content...", text: $messageText)
        .textFieldStyle(.roundedBorder)

      if selectedMode == .streaming {
        HStack(spacing: 12) {
          HStack(spacing: 6) {
            Text("Messages: \(numMessages)")
              .font(.caption)
              .fontWeight(.medium)
              .lineLimit(1)
            Spacer(minLength: 0)
            Stepper("", value: $numMessages, in: 1...50)
              .labelsHidden()
          }
          .frame(maxWidth: .infinity)

          HStack(spacing: 6) {
            Text("Interval: \(messageIntervalMs)ms")
              .font(.caption)
              .fontWeight(.medium)
              .lineLimit(1)
            Spacer(minLength: 0)
            Stepper("", value: $messageIntervalMs, in: 100...10000, step: 100)
              .labelsHidden()
          }
          .frame(maxWidth: .infinity)
        }
      }

      Button {
        switch selectedMode {
        case .streaming:
          service.sendStreaming(
            message: messageText,
            numMessages: numMessages,
            intervalMs: messageIntervalMs
          )
        case .echo:
          if service.enableBinaryEncoding {
            service.sendBinaryEcho(message: messageText)
          } else {
            service.sendEcho(message: messageText)
          }
        }
      } label: {
        Label(
          sendButtonTitle,
          systemImage: service.enableBinaryEncoding ? "arrow.up.doc.fill" : "paperplane.fill"
        )
        .frame(maxWidth: .infinity)
      }
      .buttonStyle(.borderedProminent)
      .disabled(service.state == .disconnected)

      if selectedMode == .echo,
        service.lastLatencyMs != nil || service.handshakeLatencyMs != nil
      {
        GeneratorLatencyScorecardView(service: service)
      }
    }
    .padding()
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 10))
  }

  private var sendButtonTitle: String {
    if service.enableBinaryEncoding {
      return selectedMode == .echo ? "Send Binary Echo" : "Send Binary Streaming"
    } else {
      return selectedMode == .echo ? "Send Echo" : "Send Streaming"
    }
  }
}

// MARK: - GeneratorLatencyScorecardView

struct GeneratorLatencyScorecardView: View {
  @Bindable var service: WebChannelService

  var body: some View {
    VStack(spacing: 8) {
      Divider()

      if let handshake = service.handshakeLatencyMs {
        GeneratorMetricRow(
          icon: "bolt.fill",
          title: "Handshake Latency",
          value: String(format: "%.1f ms", handshake),
          color: .primary
        )
      }

      if let connectAndSend = service.lastConnectAndSendLatencyMs {
        GeneratorMetricRow(
          icon: "timer",
          title: "Early Send Delay",
          value: "\(service.earlySendDelayMs) ms",
          color: .secondary
        )
      }

      if let sendRtt = service.lastLatencyMs {
        GeneratorMetricRow(
          icon: "stopwatch.fill",
          title: "Send Latency (RTT)",
          value: String(format: "%.1f ms", sendRtt),
          color: .blue
        )
      }

      if let connectAndSend = service.lastConnectAndSendLatencyMs {
        GeneratorMetricRow(
          icon: "arrow.forward.circle.fill",
          title: "Connect & Send Total",
          value: String(format: "%.1f ms", connectAndSend),
          color: .purple
        )

        if let handshake = service.handshakeLatencyMs {
          let delta = connectAndSend - handshake
          GeneratorMetricRow(
            icon: "plusminus",
            title: "Delta vs Handshake",
            value: WebChannelService.formatDeltaVsHandshake(delta: delta, handshake: handshake),
            color: delta <= 50 ? .green : .orange
          )
        }
      }
    }
    .padding(8)
    .background(Color(.systemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 6))
  }
}

private struct GeneratorMetricRow: View {
  let icon: String
  let title: String
  let value: String
  let color: Color

  var body: some View {
    HStack(alignment: .center, spacing: 8) {
      Image(systemName: icon)
        .font(.caption)
        .foregroundStyle(color == .primary ? Color.secondary : color)
        .frame(width: 16)

      Text(title)
        .font(.caption)
        .foregroundStyle(.secondary)

      Spacer()

      Text(value)
        .font(.system(.caption, design: .monospaced))
        .fontWeight(.bold)
        .foregroundStyle(color)
    }
  }
}

// MARK: - Reusable LogsSectionView

struct LogsSectionView: View {
  @Bindable var service: WebChannelService

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      HStack {
        Text("Activity & Connection Logs")
          .font(.subheadline)
          .fontWeight(.semibold)

        Spacer()

        Button("Copy") {
          UIPasteboard.general.string = service.combinedLogsText
        }
        .buttonStyle(.bordered)
        .controlSize(.small)
        .disabled(service.logs.isEmpty)

        Button("Clear") {
          service.clearLogs()
        }
        .buttonStyle(.bordered)
        .controlSize(.small)
        .disabled(service.logs.isEmpty)
      }

      ScrollViewReader { proxy in
        ScrollView {
          LazyVStack(alignment: .leading, spacing: 4) {
            if service.logs.isEmpty {
              Text("No logs yet. Connect to a server to see activity.")
                .font(.caption)
                .foregroundStyle(.secondary)
                .padding(.vertical, 12)
            } else {
              ForEach(service.logs) { entry in
                Text("[\(entry.formattedTimestamp)] \(entry.text)")
                  .font(.system(.caption, design: .monospaced))
                  .textSelection(.enabled)
                  .id(entry.id)
              }
            }
          }
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(8)
        }
        .frame(minHeight: 200, maxHeight: 350)
        .background(Color(.systemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
          RoundedRectangle(cornerRadius: 8)
            .stroke(Color.secondary.opacity(0.3), lineWidth: 1)
        )
        .onChange(of: service.logs.count) { _, _ in
          if let last = service.logs.last {
            proxy.scrollTo(last.id, anchor: .bottom)
          }
        }
      }
    }
    .padding()
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 10))
  }
}

// MARK: - Tab 2: LensBenchmarkTabView

struct LensBenchmarkTabView: View {
  @Bindable var service: WebChannelService

  @State private var endpointUrl: String =
    "https://webchannel.sandbox.google.com/staging/channel/lens"
  @State private var isOmnientMode: Bool = true
  @State private var lensImageSizeKb: Int = 150
  @State private var lensDetectionDelayMs: Int = 50

  var body: some View {
    NavigationStack {
      ScrollView {
        VStack(spacing: 16) {
          endpointSection
          optionsSection
          fastHandshake2Card
          lensLifecycleSection
          LogsSectionView(service: service)
        }
        .padding()
      }
      .navigationTitle("Lens Latency Benchmark")
      .navigationBarTitleDisplayMode(.inline)
    }
  }

  // MARK: Subviews

  private var fastHandshake2Card: some View {
    VStack(alignment: .leading, spacing: 10) {
      HStack {
        Label("fastHandshake2", systemImage: "bolt.fill")
          .font(.subheadline)
          .fontWeight(.semibold)
          .foregroundStyle(service.fastHandshake2 ? Color.indigo : Color.primary)
        Spacer()
        Toggle("", isOn: $service.fastHandshake2)
          .labelsHidden()
      }

      Text(
        service.fastHandshake2
          ? "fastHandshake2 ENABLED: 0-RTT GET Handshake (omits $req) and dispatches forward "
            + "POSTs concurrently. Eliminates 1 RTT of handshake blocking latency."
          : "fastHandshake2 DISABLED (Legacy): 1-RTT Handshake. Client waits for handshake "
            + "response before dispatching forward requests."
      )
      .font(.caption)
      .foregroundStyle(.secondary)
    }
    .padding()
    .background(
      RoundedRectangle(cornerRadius: 10)
        .fill(
          service.fastHandshake2
            ? Color.indigo.opacity(0.08)
            : Color(.secondarySystemBackground))
    )
    .overlay(
      RoundedRectangle(cornerRadius: 10)
        .stroke(
          service.fastHandshake2 ? Color.indigo.opacity(0.3) : Color.clear,
          lineWidth: 1.5)
    )
  }

  private var endpointSection: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text("Endpoint URL")
        .font(.subheadline)
        .fontWeight(.semibold)

      TextField("Enter WebChannel endpoint URL...", text: $endpointUrl)
        .textFieldStyle(.roundedBorder)
        .textInputAutocapitalization(.never)
        .autocorrectionDisabled(true)
        .disabled(service.lensMetrics.isRunning)

      HStack(spacing: 8) {
        Button("Staging") {
          endpointUrl = "https://webchannel.sandbox.google.com/staging/channel/lens"
        }
        .buttonStyle(.bordered)
        .controlSize(.small)
        .disabled(service.lensMetrics.isRunning)

        Button("Localhost (8080)") {
          endpointUrl = "http://localhost:8080/staging/channel/lens"
        }
        .buttonStyle(.bordered)
        .controlSize(.small)
        .disabled(service.lensMetrics.isRunning)
      }
    }
    .padding()
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 10))
  }

  private var optionsSection: some View {
    DisclosureGroup("Additional Connection Options") {
      VStack(alignment: .leading, spacing: 14) {
        // Wire Format & Encoding
        VStack(alignment: .leading, spacing: 6) {
          Text("Wire Format & Encoding")
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundStyle(.secondary)
          Toggle("enableBinaryEncoding (V8 Binary Framing)", isOn: $service.enableBinaryEncoding)
          Toggle(
            service.enableBinaryEncoding
              ? "sendRawJson (Disabled in Binary Mode)" : "sendRawJson",
            isOn: $service.sendRawJson
          )
          .disabled(service.enableBinaryEncoding)
        }

        Divider()

        // Transport & Resilience
        VStack(alignment: .leading, spacing: 6) {
          Text("Transport & Resilience")
            .font(.caption)
            .fontWeight(.semibold)
            .foregroundStyle(.secondary)
          Toggle("forceLongPolling", isOn: $service.forceLongPolling)
          Toggle("detectBufferingProxy", isOn: $service.detectBufferingProxy)
        }
      }
      .padding(.top, 6)
      .padding(.trailing, 6)
      .disabled(service.lensMetrics.isRunning)
    }
    .padding()
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 10))
  }

  private var lensLifecycleSection: some View {
    VStack(alignment: .leading, spacing: 12) {
      HStack {
        Label("Lens Lifecycle Scenario", systemImage: "camera.viewfinder")
          .font(.subheadline)
          .fontWeight(.semibold)

        Spacer()

        if service.lensMetrics.isRunning {
          ProgressView()
            .controlSize(.small)
        } else if service.lensMetrics.isCompleted {
          Text("Completed")
            .font(.caption2)
            .fontWeight(.bold)
            .foregroundStyle(.green)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(Color.green.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 4))
        }
      }

      Text(
        "Simulates Lens camera shutter / Omnient sequence: M1 StickyCluster + "
          + "M3 Prefetch (\(lensImageSizeKb)KB) + Preliminary ML Detections + M4 Final Capture."
      )
      .font(.caption)
      .foregroundStyle(.secondary)

      Picker("Lifecycle Mode", selection: $isOmnientMode) {
        Text("Omnient (0-RTT)").tag(true)
        Text("Viewfinder (Warm)").tag(false)
      }
      .pickerStyle(.segmented)

      HStack(spacing: 12) {
        HStack(spacing: 6) {
          Text("Image: \(lensImageSizeKb) KB")
            .font(.caption)
            .fontWeight(.medium)
          Spacer(minLength: 0)
          Stepper("", value: $lensImageSizeKb, in: 50...500, step: 25)
            .labelsHidden()
        }
        .frame(maxWidth: .infinity)

        HStack(spacing: 6) {
          Text("ML Delay: \(lensDetectionDelayMs)ms")
            .font(.caption)
            .fontWeight(.medium)
          Spacer(minLength: 0)
          Stepper("", value: $lensDetectionDelayMs, in: 0...500, step: 25)
            .labelsHidden()
        }
        .frame(maxWidth: .infinity)
      }

      Button {
        service.startLensBenchmark(
          endpointUrl: endpointUrl,
          isOmnient: isOmnientMode,
          imageSizeKb: lensImageSizeKb,
          detectionDelayMs: lensDetectionDelayMs
        )
      } label: {
        Label(
          service.fastHandshake2
            ? "Run Lens Benchmark (fastHandshake2 ON)"
            : "Run Lens Benchmark (fastHandshake2 OFF)",
          systemImage: "bolt.fill"
        )
        .font(.subheadline)
        .fontWeight(.semibold)
        .frame(maxWidth: .infinity)
      }
      .buttonStyle(.borderedProminent)
      .tint(.indigo)
      .disabled(service.lensMetrics.isRunning)

      // Metrics Table
      if service.lensMetrics.handshakeDurationMs != nil || service.lensMetrics.m3RttToAckMs != nil {
        metricsTable
      }
    }
    .padding()
    .background(Color(.secondarySystemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 10))
  }

  private var metricsTable: some View {
    VStack(spacing: 8) {
      Divider()

      metricRow(
        icon: "bolt.fill",
        title: "Handshake Duration",
        value: service.lensMetrics.handshakeDurationMs,
        color: .primary
      )

      metricRow(
        icon: "stopwatch.fill",
        title: "Time to First ACK (TTFA)",
        value: service.lensMetrics.m3RttToAckMs,
        color: .blue
      )

      metricRow(
        icon: "target",
        title: "Time to First Detection (TTFD)",
        value: service.lensMetrics.m3TimeToFirstDetectionMs,
        color: .green
      )

      metricRow(
        icon: "flag.checkered",
        title: "M4 Final Capture Latency",
        value: service.lensMetrics.m4RttMs,
        color: .primary
      )
    }
    .padding(8)
    .background(Color(.systemBackground))
    .clipShape(RoundedRectangle(cornerRadius: 6))
  }

  private func metricRow(
    icon: String,
    title: String,
    value: Double?,
    color: Color
  ) -> some View {
    HStack(alignment: .center, spacing: 8) {
      Image(systemName: icon)
        .font(.caption)
        .foregroundStyle(color == .primary ? Color.secondary : color)
        .frame(width: 16)

      Text(title)
        .font(.caption)
        .foregroundStyle(.secondary)

      Spacer()

      if let val = value {
        Text(String(format: "%.1f ms", val))
          .font(.system(.caption, design: .monospaced))
          .fontWeight(.bold)
          .foregroundStyle(color)
      } else {
        Text("...")
          .font(.caption)
          .foregroundStyle(.secondary)
      }
    }
  }
}
