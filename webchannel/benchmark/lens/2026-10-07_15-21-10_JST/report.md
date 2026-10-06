# Lens benchmark — 2026-10-07 physical-device cold-connection run

## Experiment specification

[Google net_http: Lens Latency Mimic & Shutter Benchmark Mode](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

## Environment

| Field | Recorded value |
|---|---|
| Device | iPhone SE (3rd generation), hardware model `iPhone14,6` |
| iOS | 26.3.1, from XCTest |
| Network switches | Wi-Fi ON; Cellular OFF, confirmed by the device operator for this run |
| Endpoint | `https://webchannel.sandbox.google.com/staging/channel/lens` |
| Mac | macOS 26.5.1; Xcode 26.6; Build version 17F113 |
| Source | Git HEAD `d39abd07cf2e727c2bad7bccf2e0eddcb0738a39` plus uncommitted benchmark instrumentation |
| Test period | 2026-10-07 15:21–15:24 local time, from artifact timestamps |
| Test execution | 10 alternating OFF/ON pairs per scenario; a separate `xcodebuild test-without-building` invocation for each trial |
| Test result | All trials completed and passed fresh-transport verification |
| Transport requirement | First transport: `h2`, a new TCP/TLS connection on the handshake GET/POST or early POST; if the GET reused the early POST connection, matching address and local port |

## Procedure and parameters

1. Build the XCTest bundle once, then launch exactly one cold-trial test method per `xcodebuild test-without-building` invocation. Keep parallel testing disabled and retain each `.xcresult` bundle.
2. Run Omnient first, then Camera Viewfinder. Each pair runs `fastHandshake2=false` (OFF), then `fastHandshake2=true` (ON). The XCTest creates a new `WebChannelService` and WebChannel client per trial.
3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `enableBinaryEncoding=false`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is metadata; no 150 KB image is uploaded.
4. Omnient sends M1 Sticky Cluster Info and M3 Prefetch during connection establishment. Camera Viewfinder sends M1 at connection start, schedules M2 Heartbeat at +200 ms, and schedules M3 Prefetch at +500 ms. M4 Final Capture follows preliminary detections. Each trial has a 60-second completion deadline.
5. Record Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).
6. Include a pair in the raw measurement tables only if both runs completed, both trials meet the transport requirement, and the absolute ON/OFF handshake-duration difference is ≤10 ms. Calculate that difference from full-precision values. Keep every trial in the raw attachments and audit.

## Omnient: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 2 | OFF | 165.450 | 300.306 | 300.470 | 141.620 |
| 2 | ON | 172.794 | 310.919 | 358.410 | 131.107 |
| 4 | OFF | 167.954 | 304.295 | 304.340 | 139.121 |
| 4 | ON | 170.688 | 180.436 | 231.487 | 148.547 |
| 5 | OFF | 171.117 | 307.667 | 307.862 | 131.241 |
| 5 | ON | 167.381 | 311.132 | 359.067 | 144.417 |
| 7 | OFF | 175.915 | 336.069 | 336.301 | 129.162 |
| 7 | ON | 173.537 | 173.967 | 226.625 | 139.186 |

## Camera Viewfinder: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 1 | OFF | 169.568 | 131.447 | 179.911 | 134.246 |
| 1 | ON | 173.302 | 135.840 | 188.021 | 145.241 |
| 5 | OFF | 173.337 | 133.087 | 182.481 | 139.388 |
| 5 | ON | 170.008 | 143.363 | 189.014 | 142.976 |
| 6 | OFF | 175.533 | 132.437 | 184.200 | 138.616 |
| 6 | ON | 168.468 | 137.164 | 187.829 | 129.195 |
| 9 | OFF | 169.547 | 146.156 | 194.915 | 143.723 |
| 9 | ON | 171.886 | 138.728 | 188.918 | 138.557 |
