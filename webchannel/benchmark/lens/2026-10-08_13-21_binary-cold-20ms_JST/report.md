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
| Test period | 2026-10-08 13:22–13:25 local time, from artifact timestamps |
| Test execution | 10 alternating OFF/ON pairs per scenario; a separate `xcodebuild test-without-building` invocation for each trial |
| Test result | 37 completed trials; 40 passed fresh-transport verification |
| Transport requirement | First transport: `h2`, a new TCP/TLS connection on the handshake GET/POST or early POST; if the GET reused the early POST connection, matching address and local port |

## Procedure and parameters

1. Build the XCTest bundle once, then launch exactly one cold-trial test method per `xcodebuild test-without-building` invocation. Keep parallel testing disabled and retain each `.xcresult` bundle.
2. Run Omnient first, then Camera Viewfinder. Each pair runs `fastHandshake2=false` (OFF), then `fastHandshake2=true` (ON). The XCTest creates a new `WebChannelService` and WebChannel client per trial.
3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `enableBinaryEncoding=true`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is metadata; no 150 KB image is uploaded.
4. Omnient sends M1 Sticky Cluster Info and M3 Prefetch during connection establishment. Camera Viewfinder sends M1 at connection start, schedules M2 Heartbeat at +200 ms, and schedules M3 Prefetch at +500 ms. M4 Final Capture follows preliminary detections. Each trial has a 60-second completion deadline.
5. Record Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).
6. Include a pair in the raw measurement tables only if both runs completed, both trials meet the transport requirement, and the absolute ON/OFF handshake-duration difference is ≤20 ms. Calculate that difference from full-precision values. Keep every trial in the raw attachments and audit.

## Omnient: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 1 | OFF | 176.494 | 326.227 | 370.090 | 171.768 |
| 1 | ON | 169.271 | 175.557 | 227.190 | 146.981 |
| 3 | OFF | 181.074 | 341.328 | 382.877 | 140.261 |
| 3 | ON | 176.989 | 179.157 | 227.885 | 154.231 |
| 4 | OFF | 172.954 | 319.627 | 376.922 | 132.850 |
| 4 | ON | 182.150 | 322.452 | 371.363 | 136.391 |
| 6 | OFF | 182.279 | 335.233 | 378.175 | 161.119 |
| 6 | ON | 179.958 | 320.381 | 369.727 | 147.081 |
| 9 | OFF | 173.828 | 323.345 | 366.466 | 162.559 |
| 9 | ON | 187.221 | 188.413 | 241.839 | 143.309 |

## Camera Viewfinder: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 3 | OFF | 186.339 | 154.661 | 203.114 | 148.803 |
| 3 | ON | 169.460 | 143.045 | 189.962 | 135.414 |
| 5 | OFF | 173.961 | 150.580 | 194.502 | 160.294 |
| 5 | ON | 187.801 | 136.967 | 189.332 | 158.245 |
| 7 | OFF | 175.455 | 154.228 | 201.186 | 143.135 |
| 7 | ON | 186.992 | 153.278 | 204.443 | 156.923 |
