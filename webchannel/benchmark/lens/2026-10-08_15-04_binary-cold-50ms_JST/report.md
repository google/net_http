# Lens benchmark — 2026-10-08 physical-device cold-connection run (binary encoding)

## Experiment specification

[Google net_http: Lens Latency Mimic & Shutter Benchmark Mode](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

## Environment

| Field | Recorded value |
|---|---|
| Device | iPhone SE (3rd generation), hardware model `iPhone14,6` |
| iOS | 26.3.1, from XCTest |
| Network switches | Not independently recorded for this run |
| Endpoint | `https://webchannel.sandbox.google.com/staging/channel/lens` |
| Mac | macOS 26.5.1; Xcode 26.6; Build version 17F113 |
| Source | Git HEAD `aa71e660c4d409919bec313fccc9d1376baa103c` plus uncommitted benchmark instrumentation |
| Test period | 2026-10-08 15:06–15:11 local time, from artifact timestamps |
| Test execution | 10 alternating OFF/ON pairs per scenario; a separate `xcodebuild test-without-building` invocation for each trial |
| Test result | 35 completed trials; 40 passed fresh-transport verification |
| Transport requirement | First transport: `h2`, a new TCP/TLS connection on the handshake GET/POST or early POST; if the GET reused the early POST connection, matching address and local port |

## Procedure and parameters

1. Build the XCTest bundle once, then launch exactly one cold-trial test method per `xcodebuild test-without-building` invocation. Keep parallel testing disabled and retain each `.xcresult` bundle.
2. Run Omnient first, then Camera Viewfinder. Each pair runs `fastHandshake2=false` (OFF), then `fastHandshake2=true` (ON). The XCTest creates a new `WebChannelService` and WebChannel client per trial.
3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `initialMessageDelayMs=50`, `enableBinaryEncoding=true`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is metadata; no 150 KB image is uploaded.
4. Schedule M1 Sticky Cluster Info 50 ms after `connect()` returns. Omnient sends M3 Prefetch immediately after M1; Camera Viewfinder schedules M2 Heartbeat at +200 ms and M3 Prefetch at +500 ms after `connect()` returns. M4 Final Capture follows preliminary detections. Each trial has a 60-second completion deadline.
5. Record Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).
6. Include a pair in the raw measurement tables only if both runs completed, both trials meet the transport requirement, and the absolute ON/OFF handshake-duration difference is ≤20 ms. Calculate that difference from full-precision values. Keep every trial in the raw attachments and audit.

## Omnient: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 3 | OFF | 183.940 | 274.629 | 321.384 | 135.920 |
| 3 | ON | 179.153 | 150.608 | 197.459 | 155.047 |
| 4 | OFF | 188.329 | 301.885 | 322.818 | 140.845 |
| 4 | ON | 193.633 | 517.116 | 540.622 | 145.079 |
| 6 | OFF | 166.148 | 267.794 | 317.084 | 149.240 |
| 6 | ON | 164.204 | 206.971 | 255.013 | 161.305 |

## Camera Viewfinder: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 2 | OFF | 173.476 | 155.322 | 209.601 | 169.366 |
| 2 | ON | 162.429 | 135.548 | 184.422 | 140.504 |
| 5 | OFF | 173.993 | 139.603 | 190.365 | 147.950 |
| 5 | ON | 191.875 | 145.243 | 195.553 | 139.722 |
| 9 | OFF | 165.460 | 137.316 | 187.138 | 143.419 |
| 9 | ON | 180.641 | 478.588 | 478.829 | 134.641 |
