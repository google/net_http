# Lens benchmark — 2026-10-07 physical-device cold-connection run (binary encoding)

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
| Test period | 2026-10-07 17:27–17:30 local time, from artifact timestamps |
| Test execution | 10 alternating OFF/ON pairs per scenario; a separate `xcodebuild test-without-building` invocation for each trial |
| Test result | All trials completed and passed fresh-transport verification |
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
| 2 | OFF | 176.827 | 319.913 | 359.450 | 141.266 |
| 2 | ON | 170.222 | 304.074 | 351.723 | 138.660 |
| 5 | OFF | 179.937 | 324.473 | 373.867 | 131.469 |
| 5 | ON | 171.674 | 309.314 | 356.936 | 153.420 |

## Camera Viewfinder: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 2 | OFF | 178.209 | 144.088 | 191.392 | 141.008 |
| 2 | ON | 181.328 | 138.444 | 183.431 | 163.751 |
| 3 | OFF | 168.453 | 236.880 | 237.396 | 138.122 |
| 3 | ON | 171.694 | 139.974 | 193.309 | 138.903 |
| 6 | OFF | 176.219 | 141.613 | 193.736 | 131.357 |
| 6 | ON | 176.231 | 142.866 | 198.437 | 144.374 |
| 10 | OFF | 172.651 | 135.707 | 183.108 | 131.965 |
| 10 | ON | 175.378 | 135.764 | 187.289 | 139.458 |
