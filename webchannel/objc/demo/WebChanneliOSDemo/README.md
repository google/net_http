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

### Automated Lens Benchmark

The `WebChanneliOSDemoTests` target runs the existing Lens lifecycle against the
configured endpoint. `testOmnient` and `testViewfinder` each run ten OFF/ON pairs
in alternating order by default (40 Lens runs total). Each run waits up to 60 seconds
for M4 completion; incomplete runs fail the test but remain in the exported data.
`testHTTPSBaseline` separately sends 10 pairs of HEAD requests to the Lens URL
without WebChannel. It records TCP, TLS, connection setup, and time to the first
HTTP response byte. The second request in each pair checks connection reuse.

In Xcode, select an iOS Simulator or a signed physical device and press `Cmd + U`.
The tests use the real network. Simulator numbers are useful for a smoke test;
use the physical device for latency comparisons.

To run from a terminal, use the workspace and a specific device ID:

```bash
xcodebuild -workspace WebChanneliOSDemo.xcworkspace \
  -scheme WebChanneliOSDemo -configuration Debug \
  -destination 'platform=iOS,id=YOUR_DEVICE_ID' \
  -parallel-testing-enabled NO \
  -resultBundlePath ./LensBenchmark.xcresult test
```

Use `platform=iOS Simulator,id=YOUR_SIMULATOR_ID` for a simulator. The result
bundle contains XCTest status plus retained attachments for each test:
`lens-omnient-results.json` / `.csv` and `lens-viewfinder-results.json` / `.csv`.
The Lens JSON includes each run's options, status, four metrics, and full app log.
The HTTPS test adds `https-baseline-results.json` / `.csv`. Its TCP connect
interval approximates one RTT to the reached server or edge. HTTP time to first
byte also includes server processing and is not a pure network RTT.
To run only the HTTPS probe from `xcodebuild`, add
`-only-testing:WebChanneliOSDemoTests/HTTPSBaselineTests/testHTTPSBaseline`
to the command above.
Export the attachments with:

```bash
xcrun xcresulttool export attachments \
  --path ./LensBenchmark.xcresult --output-path ./LensBenchmarkAttachments
```

The export also writes `manifest.json`, which maps the attachments to their
tests. In Xcode, the same attachments are available from the Test Report. A
result bundle path must be new for each invocation. The Test action's scheme
environment variables may set `LENS_BENCHMARK_REPETITIONS` (default `10`, maximum
`50`) and `LENS_BENCHMARK_ENDPOINT` (default staging Lens URL). The image size
parameter is metadata; this does not transmit 150 KB of image bytes.

For transport-cold measurements, build for testing once with the demo workspace,
scheme, physical-device destination, and a dedicated derived-data path. From the
repository root, run:

```bash
cd webchannel/objc/demo/WebChanneliOSDemo
xcodebuild build-for-testing -workspace WebChanneliOSDemo.xcworkspace \
  -scheme WebChanneliOSDemo -configuration Debug \
  -destination 'id=DEVICE_ID' -derivedDataPath /path/to/derived-data \
  -allowProvisioningUpdates
cd ../../../..
LENS_DERIVED_DATA=/path/to/derived-data bash \
  webchannel/benchmark/lens/run-cold-benchmark.sh DEVICE_ID OUTPUT_DIR 10
python3 webchannel/benchmark/lens/summarize-cold-benchmark.py OUTPUT_DIR 10
```

The runner starts one cold-trial test method per invocation of
`xcodebuild test-without-building`. It alternates OFF/ON trials for Omnient and
Viewfinder, retains each `.xcresult` under `OUTPUT_DIR/xcresults/` and exported
JSON/CSV under `OUTPUT_DIR/attachments/`, and writes `report.md`, `audit.md`,
and `artifacts.md` in the output directory. The
[Lens benchmark report guide](../../../benchmark/lens/README.md) describes
the document layout. Per-trial Xcode and attachment-export logs are placed in
`OUTPUT_DIR/logs/`. The JSON records `URLSessionTaskMetrics` for the actual WebChannel
requests. A trial is accepted as transport-cold only if its first handshake
GET/POST or concurrent early POST established a new HTTP/2 TCP/TLS connection.
When the early POST connects first, the handshake GET must reuse that same
address and local port. App-process restart alone is not used as evidence of a
fresh connection; DNS, radio, and server state can remain warm.
Set `LENS_BINARY_ENCODING=1` for a run with `enableBinaryEncoding=true`;
the default remains `false`.

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
