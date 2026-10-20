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
| Source | Git HEAD `d39abd07cf2e727c2bad7bccf2e0eddcb0738a39` plus uncommitted benchmark instrumentation |
| Test period | 2026-10-08 13:10–13:14 local time, from artifact timestamps |
| Test execution | 10 alternating OFF/ON pairs per scenario; a separate `xcodebuild test-without-building` invocation for each trial |
| Test result | 38 completed trials; 40 passed fresh-transport verification |
| Transport requirement | First transport: `h2`, a new TCP/TLS connection on the handshake GET/POST or early POST; if the GET reused the early POST connection, matching address and local port |

## Procedure and parameters

1. Build the XCTest bundle once, then launch exactly one cold-trial test method per `xcodebuild test-without-building` invocation. Keep parallel testing disabled and retain each `.xcresult` bundle.
2. Run Omnient first, then Camera Viewfinder. Each pair runs `fastHandshake2=false` (OFF), then `fastHandshake2=true` (ON). The XCTest creates a new `WebChannelService` and WebChannel client per trial.
3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `enableBinaryEncoding=true`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is metadata; no 150 KB image is uploaded.
4. Omnient sends M1 Sticky Cluster Info and M3 Prefetch during connection establishment. Camera Viewfinder sends M1 at connection start, schedules M2 Heartbeat at +200 ms, and schedules M3 Prefetch at +500 ms. M4 Final Capture follows preliminary detections. Each trial has a 60-second completion deadline.
5. Record Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).
6. Include a pair in the raw measurement tables only if both runs completed, both trials meet the transport requirement, and the absolute ON/OFF handshake-duration difference is ≤10 ms. Calculate that difference from full-precision values. Keep every trial in the raw attachments and audit.

## Omnient: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 8 | OFF | 174.386 | 319.356 | 365.137 | 155.132 |
| 8 | ON | 178.784 | 181.173 | 233.486 | 140.253 |

## Camera Viewfinder: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 1 | OFF | 182.199 | 143.597 | 190.587 | 145.272 |
| 1 | ON | 176.428 | 273.568 | 331.084 | 143.886 |
| 6 | OFF | 176.132 | 141.999 | 191.169 | 136.116 |
| 6 | ON | 185.396 | 139.406 | 186.024 | 134.882 |
