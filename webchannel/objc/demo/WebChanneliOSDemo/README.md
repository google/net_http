# WebChannel iOS Demo App

A modern, full-featured iOS demo and benchmarking application for Google WebChannel built with **Swift** and **SwiftUI** (iOS 17.0+).

It directly integrates with the Objective-C WebChannel client (`WCWebChannelClient`) via CocoaPods to demonstrate interactive messaging, high-precision latency measurement, binary wire encoding, concurrent non-blocking handshakes, and a simulated Google Lens camera benchmark.

For detailed architecture, protocol flow, and iOS-specific design choices, see [DESIGN.md](DESIGN.md).

---

## 📱 Key Features

### 1. Dual-Tab Interface
- **Tab 1: WebChannel Generator & Latency**:
  - **Direct Client Integration**: Exercises `WCWebChannelClient` and `WCOptions` directly with clean Swift interop.
  - **Parallel Connection Modes**:
    - `Connect` (Green): Standard connection establishment.
    - `Connect & Send` (Purple): Schedules an early forward send while Handshake Request 1 is in-flight, demonstrating concurrent non-blocking dispatch.
  - **Round-Trip Echo & Latency Testing**: Measures end-to-end RTT with millisecond precision using timestamped echo tokens.
  - **Streaming Message Generator**: Configurable server push streaming (`num_messages`, `message_interval`).
  - **Binary Wire Encoding & Streaming**: Validates V8 binary wire protocol (`WCWireV8Binary`, `sendData:`), automated Binary JSON Echo / Streaming, and live backchannel binary decoding status indicators.
  - **Categorized Transport Options (`WCOptions`)**:
    - *Wire Format & Encoding*: `enableBinaryEncoding`, `sendRawJson`
    - *Handshake & Concurrency*: `fastHandshake2` (0-RTT GET + concurrent forward POST), `fastHandshake` (1-RTT), `nonBlockingSend`, `blockingHandshake`, early send delay stepper
    - *Transport & Resilience*: `forceLongPolling`, `detectBufferingProxy`
- **Tab 2: Lens Latency Benchmark**:
  - **Camera Lifecycle Simulation**: Simulates the full multi-stage Google Lens camera sequence:
    1. **M1 Sticky Cluster**: Routing affinity metadata (~50 B JSON).
    2. **M2 Heartbeat**: Periodic keepalive during viewfinder mode (~30 B JSON).
    3. **M3 Prefetch**: Simulated query image payload (configurable 50–500 KB, default 150 KB) with immediate stream ACK (TTFA) and preliminary detections (TTFD).
    4. **M4 Final Capture**: Shutter tap completion.
  - **fastHandshake2 Comparison**: Toggle `fastHandshake2` on or off to evaluate the latency reduction delivered by 0-RTT GET handshake + concurrent forward POSTs vs legacy 1-RTT handshakes.
  - **Focused 4-Row Performance Scorecard**:
    - **Handshake Duration**
    - **Time to First ACK (TTFA)**
    - **Time to First Detection (TTFD)**
    - **M4 Final Capture Latency**
  - **Embedded Activity Logs**: Live monospace log feed directly below the benchmark controls with Copy and Clear buttons.

---

## 🚀 Getting Started

### Prerequisites
- macOS with Xcode 15.0+ (iOS 17.0+ SDK)
- CocoaPods (`gem install cocoapods`)

### 1. Install CocoaPods Dependencies
From the demo directory:

```bash
cd webchannel/objc/demo/WebChanneliOSDemo
pod install
```

### 2. Open the Xcode Workspace
Always open **`WebChanneliOSDemo.xcworkspace`** in Xcode (not the `.xcodeproj` file):

```bash
open WebChanneliOSDemo.xcworkspace
```

### 3. Run in iOS Simulator
1. In Xcode's toolbar scheme selector, choose **WebChanneliOSDemo** and select an iOS 17+ or iOS 18+ simulator (e.g. **iPhone 15 Pro**).
2. Press `Cmd + R` to build and run.

### 4. Run on a Physical Device (iPhone / iPad)
1. Connect your iOS device via USB.
2. In Xcode, select the top-level **WebChanneliOSDemo** project > **Signing & Capabilities** tab.
3. Check **Automatically manage signing** and choose your Apple Team.
4. Select your connected device and press `Cmd + R`.

---

## 🌐 Testing Endpoints

### 1. Hosted Sandbox Staging Endpoints (Default)
- **Generator Endpoint**: `https://webchannel.sandbox.google.com/staging/channel/generator`
- **Lens Mimic Endpoint**: `https://webchannel.sandbox.google.com/staging/channel/lens`

### 2. Local WebChannel Development Server
To run against a local WebChannel server on `http://localhost:8080`:
- Generator tab: tap **Localhost (8080)** to set `http://localhost:8080/staging/channel/generator`
- Lens tab: tap **Localhost (8080)** to set `http://localhost:8080/staging/channel/lens`
*(App Transport Security in `Info.plist` is pre-configured with `NSAllowsArbitraryLoads` to permit local HTTP traffic).*

---

## 🏗️ Architecture & File Structure

```
WebChanneliOSDemo/
├── Podfile                        # CocoaPods configuration (iOS 17.0+, local :path => '../../')
├── Podfile.lock                   # Pinned dependency versions
├── README.md                      # Overview and setup guide
├── DESIGN.md                      # Architecture and protocol design specification
├── WebChanneliOSDemo.xcworkspace  # Workspace combining the App and Pods projects
├── WebChanneliOSDemo.xcodeproj    # Xcode project file
└── WebChanneliOSDemo/
    ├── WebChanneliOSDemoApp.swift # @main SwiftUI application entry point
    ├── ContentView.swift          # Main UI (GeneratorTabView, LensBenchmarkTabView, Scorecard, Logs)
    ├── WebChannelService.swift    # WCWebChannelClient manager, options, and delegate callbacks
    ├── TestAppSupport.swift       # Custom WCSupport & WCLogger implementation
    ├── Info.plist                 # App bundle metadata and ATS configuration
    └── Assets.xcassets/           # App icons and color catalog
```
