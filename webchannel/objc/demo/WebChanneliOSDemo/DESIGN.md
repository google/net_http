# Design Document: WebChannel Generator iOS Test App

This document outlines the architecture, protocol interactions, and iOS-specific
implementation details of `generator_test_app`. For build instructions, testing
endpoints, and general user guide, refer to [README.md](README.md).

--------------------------------------------------------------------------------

## 1. Architecture & Component Hierarchy

The application follows standard modern Apple development practices using a
Swift-first, SwiftUI-first architecture:

```
┌─────────────────────────────────────────────────────────┐
│              WebChanneliOSDemoApp (@main)                   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                 ContentView (SwiftUI)                   │
│   - Declarative control panel & interactive toggles     │
│   - Monospaced real-time connection log viewer          │
└───────────────────────────┬─────────────────────────────┘
                            │ (@Observable bindings)
┌───────────────────────────▼─────────────────────────────┐
│             WebChannelService (Controller)              │
│   - Connection lifecycle & early-send scheduling        │
│   - High-precision timestamp & latency tracking         │
│   - Thread marshalling (DispatchQueue.main)             │
└───────────────────────────┬─────────────────────────────┘
                            │ (Obj-C Bridge & Delegate)
┌───────────────────────────▼─────────────────────────────┐
│     WCWebChannelClient (WebChannel Transport Lib)       │
│   - Forward Channel Request Pool (HTTP POST)            │
│   - Back Channel Long-Polling / Streaming (HTTP GET)    │
└─────────────────────────────────────────────────────────┘
```

-   **`WebChanneliOSDemoApp`**: Application entry point hosting the root
    `ContentView`.
-   **`ContentView`**: Declarative SwiftUI interface divided into functional
    sections (Endpoint, Options, Connection, Messaging, Logs).
-   **`WebChannelService`**: State controller managing `WCWebChannelClient`,
    options configuration, echo latency tracking, and thread-safe logging.
-   **`WCWebChannelClient`**: Underlying Objective-C transport client
    (`WebChannel` CocoaPods framework (`../../imported_src`)).

--------------------------------------------------------------------------------

## 2. Protocol & Communication Modes

The app communicates directly with the WebChannel message generator
(WebChannel message generator backend):

### A. Echo & Latency Mode (Default)

Used to measure round-trip latency and validate non-blocking message delivery:

1.  **Request Payload**:

    ```json
    {
      "echo": "req_<timestamp_ms>",
      "message": "<string>"
    }
    ```

2.  **Server Response**: The server echoes the exact payload back over the Back
    Channel:

    ```json
    {
      "echo": "req_<timestamp_ms>",
      "message": "<string>"
    }
    ```

3.  **Latency Calculation**: The client calculates:

    -   **Echo Round-Trip Time**: \(T_{\text{received}} - T_{\text{send}}\)
    -   **Total Connection Elapsed Time**: \(T_{\text{received}} -
        T_{\text{connect}}\)

### B. Streaming Generator Mode

Used to validate server-to-client streaming throughput and chunked transfer:

1.  **Request Payload**:

    ```json
    {
      "message": "<string>",
      "num_messages": 5,
      "message_interval": 1000
    }
    ```

2.  **Server Streaming Response**: The server pushes `<num_messages>` sequential
    messages spaced by `<message_interval>` ms over the long-lived Back Channel
    stream.

### C. Binary Encoding & Raw Data Mode

Used to validate WebChannel V8 binary wire protocol
(`id=<id>&size=<length>\r\n<raw_bytes>`) and client-to-server data
transmission (`sendData:`):

1.  **Channel-Level Binary Protocol Configuration**: Binary encoding is a
    connection-level mode configured via `WCOptions.enableBinaryEncoding`. When
    enabled, Handshake Request 1 is sent as `application/octet-stream`,
    establishing binary framing for all forward requests.
2.  **Backchannel Binary Encoding Status**: The client monitors
    `client.runtimeProperties.isBackChannelBinaryEncodingEnabled` and displays
    live indicators in the UI.
3.  **Binary Chunk Reception**: Binary chunks delivered as `NSData` to
    `webChannel:didReceiveMessage:` are inspected for byte count, hex previews,
    and UTF-8 string decodability.
4.  **Binary Echo & Latency Measurement**: Automatically packs an
    `{"echo": "...", "message": "..."}` JSON payload as binary UTF-8 data to
    test end-to-end binary round trip with latency measurement against generator
    endpoints.
5.  **Binary Streaming Generator**: Packs
    `{"num_messages": N, "message_interval": M, "message": "..."}` as binary
    UTF-8 data to test continuous server-to-client streaming push over binary
    channels.

### D. Lens Latency Mimic & Shutter Benchmark Mode

Used to simulate the real-world Google Lens camera lifecycle (evaluating cold-start and warm-stream latency characteristics) and quantify latency improvements delivered by `fastHandshake2`:

#### Designed Request Sequence & Protocol Mapping

| Step | Request Name | Simulator `type` | Direction | Typical Payload | Purpose / Server Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M1** | Sticky Cluster Info | `"sticky_cluster_info"` | Client → Server | ~50 B JSON | Cluster & routing affinity metadata. Server returns `"sticky_cluster_info_response"` with routing token and forward latency. |
| **M2** | Heartbeat | `"heartbeat"` | Client → Server | ~30 B JSON | Keepalive during viewfinder mode to keep the forward and back channels warm. Server returns `"heartbeat_ack"`. |
| **M3** | Prefetch Request | `"prefetch"` | Client → Server | 70–200 KB image | Cold-start query (Omnient at $T=0$) or viewfinder prefetch ($T=500\text{ms}$). Server returns:<br>1. Immediate stream ACK (`"ack_response"` measuring TTFA)<br>2. Preliminary detections (`"preliminary_detections"` after simulated ML inference delay measuring TTFD) |
| **M4** | Final Capture | `"final_request"` | Client → Server | ~1 KB JSON | User interaction / shutter tap completion. Server returns `"interaction_response"`. |

```
Client                                                  Server (Sandbox / Staging)
  │                                                               │
  │─── M1: "sticky_cluster_info" (T=0) ──────────────────────────>│
  │<── "sticky_cluster_info_response" (Routing token, latency) ──│
  │                                                               │
  │─── M2: "heartbeat" (Periodic in Viewfinder) ─────────────────>│
  │<── "heartbeat_ack" ───────────────────────────────────────────│
  │                                                               │
  │─── M3: "prefetch" (70-200KB Image, T=0 or T=500ms) ──────────>│
  │<── "ack_response" (Immediate Stream ACK / TTFA) ─────────────│
  │<── "preliminary_detections" (Simulated ML Delay / TTFD) ─────│
  │                                                               │
  │─── M4: "final_request" (Shutter Tap / Interaction) ──────────>│
  │<── "interaction_response" ("status": "SUCCESS") ─────────────│
  │                                                               │
```

1.  **Lifecycle Simulation Modes**:
    -   **Omnient (0-RTT Cold Start)**: Dispatches M1 and M3 concurrently at $T=0$ during connection establishment, measuring the benefit of `fastHandshake2` 0-RTT GET + concurrent forward POST.
    -   **Camera Viewfinder (Warm Stream)**: Dispatches M1 at $T=0$, warms the channel with M2 Heartbeat keepalive at $T+200\text{ms}$, then dispatches M3 prefetch at $T+500\text{ms}$ upon simulated user framing.
2.  **Evaluated Metrics**:
    -   Handshake Duration (\(T_{\text{open}} - T_{\text{connect}}\))
    -   M1 StickyCluster Forward & BackChannel Latencies
    -   M3 Prefetch Forward Latency & Round-Trip Time to ACK (RTT)
    -   M3 Stream ACK & Detection BackChannel Latencies
    -   Time-to-First-ACK (TTFA)
    -   Time-to-First-Detection (TTFD)
    -   M4 Final Capture Forward & BackChannel Latencies
3.  **Payload Sizing Contract**:
    -   **Metadata Simulation**: M3 simulates prefetch latency via metadata parameters (`image_size_kb`, `detection_delay_ms`) rather than transmitting raw bytes, keeping handshake benchmarking lightweight.
    -   **Binary Mode for Raw Payloads**: Large image payload transmission is strictly scoped for Binary Mode (`WCWireV8Binary`), mirroring production Google Lens camera streaming.

--------------------------------------------------------------------------------

## 3. Non-Blocking Send Validation & Mechanics

A primary purpose of this test harness is to exercise and validate the
`nonBlockingSend` option during connection establishment:

### Early Send In-Flight Handshake Flow

-   When `Connect & Send` is triggered, `WebChannelService` initiates
    `client.open()` and schedules an early `client.send()` while Handshake
    Request 1 is actively in-flight on the wire.
-   **`nonBlockingSend = true`**: Generates a client-side Session ID (`c-...`),
    allowing Request 2 (Data POST) to be dispatched immediately in parallel with
    Request 1.
-   **`nonBlockingSend = false`**: Buffers Request 2 in the client's internal
    queue until Request 1 completes and the server assigns an authoritative SID.

### Non-Blocking Send Downstream Echo Latency Nuance

-   **Upstream Data Delivery**: `nonBlockingSend: true` delivers data upstream
    to the server ~1 RTT earlier by transmitting concurrently with the handshake
    request.
-   **Downstream Echo Delivery**: Because the downstream Back Channel
    (`RID=rpc`) requires the handshake response before opening, server echo
    responses remain buffered in server memory until the Back Channel connects.
    Consequently, client-measured Echo latency is identical (~700ms) across both
    modes, even though the server receives and processes the payload 1 RTT
    earlier.

### Key Transport Options (`WCOptions`)

-   `isNonBlockingSend`: Controls whether early sends are dispatched
    concurrently (client SID `c-...`) or buffered until handshake completion.
-   `isBlockingHandshake`: Instructs the server (via
    `BlockingHandshakeDeplayHeader: 2000`) to delay handshake completion,
    isolating concurrency behavior.
-   `isSendingRawJSON`: Serializes payloads as raw JSON strings rather than
    standard WebChannel key-value maps.
-   `isFastHandshake2`: Enables 0-RTT GET handshake and non-blocking send
    simultaneously, omitting `$req` from the GET query string and dispatching
    early messages via concurrent forward POSTs.
-   `isFastHandshake`: Bypasses the initial test request for accelerated
    connection setup (1-RTT GET handshake with `$req` query param).
-   `isLongPollingForced`: Disables HTTP chunked streaming to force pure
    long-polling mode.
-   `shouldDetectBufferingProxy`: Enables automatic fallback to long-polling
    when intermediary network buffering is detected.

--------------------------------------------------------------------------------

## 4. iOS-Specific Design Considerations

### Swift / Objective-C Interop

-   `WCWebChannelClient` is implemented in Objective-C. The test app
    demonstrates clean Swift 6 / SwiftUI interop with
    `WebChannel` without requiring custom
    bridging headers in modern Blaze builds.

### Thread Safety & UI Marshalling

-   `WCWebChannelClient` dispatches delegate events (`webChannelOpened`,
    `didReceiveMessage`, `encounteredError`) on background execution queues.
-   `WebChannelService` marshals all state mutations (`state`, `logs`,
    `lastLatencyMs`) onto `DispatchQueue.main`, preventing data races and
    guaranteeing smooth 120Hz SwiftUI updates.

### High-Precision Monotonic Timing

-   Uses `CFAbsoluteTimeGetCurrent()` / `Clock` for sub-millisecond precision
    timing, unaffected by wall-clock NTP adjustments during latency runs.

### Minimal Dependency Footprint

-   Standalone app free of Google-internal RPC frameworks (iRPC, SRL,
    IdentityKit), making it ideal for isolated transport benchmarking.
-   Configured with `NSAllowsLocalNetworking` in `Info.plist` to permit
    unencrypted HTTP connections to local whiteboard development servers
    (`http://localhost:8080`).
