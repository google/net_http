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
| Test period | 2026-10-08 13:40–13:45 local time, from artifact timestamps |
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
| 2 | OFF | 191.058 | 348.649 | 398.363 | 148.020 |
| 2 | ON | 197.846 | 207.063 | 257.442 | 155.151 |
| 3 | OFF | 239.052 | 419.357 | 459.911 | 164.235 |
| 3 | ON | 236.971 | 385.497 | 434.664 | 152.759 |
| 6 | OFF | 199.976 | 356.946 | 403.831 | 171.257 |
| 6 | ON | 192.866 | 204.998 | 256.052 | 143.929 |
| 8 | OFF | 165.858 | 320.833 | 371.151 | 136.732 |
| 8 | ON | 185.379 | 335.643 | 381.386 | 154.838 |
| 9 | OFF | 194.892 | 341.442 | 396.630 | 146.854 |
| 9 | ON | 196.728 | 368.223 | 421.643 | 151.290 |

## Camera Viewfinder: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 2 | OFF | 183.547 | 155.718 | 206.693 | 142.310 |
| 2 | ON | 181.204 | 144.698 | 195.119 | 145.529 |
| 3 | OFF | 176.504 | 138.329 | 196.563 | 144.389 |
| 3 | ON | 177.338 | 137.393 | 188.366 | 149.287 |
| 5 | OFF | 187.043 | 148.455 | 195.872 | 147.601 |
| 5 | ON | 178.654 | 152.575 | 202.853 | 153.534 |
