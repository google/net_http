# Lens benchmark — 2026-10-07 physical-device run

## Experiment specification

[Google net_http: Lens Latency Mimic & Shutter Benchmark Mode](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

## Environment

| Field | Recorded value |
|---|---|
| Device | iPhone SE (3rd generation), hardware model `iPhone14,6` |
| iOS | 26.3.1, reported by the XCTest host app |
| Network switches | Wi-Fi ON; Cellular OFF, confirmed by the device operator for this run |
| Endpoint | `https://webchannel.sandbox.google.com/staging/channel/lens` |
| Mac | macOS 26.5.1; Xcode 26.6 (build 17F113) |
| Source | Git HEAD `2e0596a2df0e8f4a37406d106833c6f1fcc4c153`; local test runner configured for 10 pairs |
| Test period | 2026-10-07 00:38:24.852–00:38:53.805 JST, from XCTest log |
| Test result | `TEST SUCCEEDED`; both Lens test cases passed |

## Procedure and parameters

1. Connect the paired iPhone SE to Xcode. Run only `WebChanneliOSDemoTests/LensBenchmarkTests` with parallel testing disabled and retain the `.xcresult` bundle.
2. Run Omnient first, then Camera Viewfinder. For each scenario, run 10 pairs. Each pair runs `fastHandshake2=false` (OFF), then `fastHandshake2=true` (ON), using a new `WebChannelService` instance for every run.
3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `enableBinaryEncoding=false`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is an image-size metadata parameter; the test does not upload 150 KB of image bytes.
4. Omnient sends M1 Sticky Cluster Info and M3 Prefetch during connection establishment. Viewfinder sends M1 at connection start, schedules M2 Heartbeat at +200 ms, and schedules M3 Prefetch at +500 ms. M4 Final Capture is sent after preliminary detections. A run is complete when the app has recorded all four latency metrics after the interaction response; the test allows up to 60 seconds per run.
5. For this report, include a pair in the tables below only if both runs completed and the **absolute ON/OFF handshake-duration difference is ≤10 ms**, calculated from full-precision `handshakeMs` values. Camera Viewfinder Run 1 is omitted as an outlier. The underlying measurements remain unchanged.

Recorded metrics are Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).

## Omnient: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 3 | OFF | 190.869 | 339.484 | 339.577 | 143.226 |
| 3 | ON | 183.598 | 203.581 | 255.818 | 145.189 |
| 4 | OFF | 190.748 | 332.181 | 332.276 | 144.853 |
| 4 | ON | 185.478 | 332.699 | 381.672 | 146.965 |
| 6 | OFF | 182.210 | 321.831 | 321.923 | 142.080 |
| 6 | ON | 181.198 | 182.196 | 229.658 | 140.659 |
| 10 | OFF | 194.076 | 339.002 | 339.208 | 140.392 |
| 10 | ON | 185.572 | 334.988 | 384.641 | 145.589 |

## Camera Viewfinder: valid pair raw measurements

Values shown in the table are rounded to three decimal places.

| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |
|---:|:---:|---:|---:|---:|---:|
| 2 | OFF | 168.436 | 141.618 | 189.029 | 137.706 |
| 2 | ON | 175.478 | 138.089 | 189.627 | 144.206 |
| 3 | OFF | 187.551 | 144.442 | 193.304 | 160.498 |
| 3 | ON | 185.194 | 147.908 | 198.796 | 148.754 |
| 4 | OFF | 186.981 | 153.526 | 203.115 | 139.267 |
| 4 | ON | 189.178 | 144.638 | 195.182 | 138.951 |
| 6 | OFF | 181.767 | 160.741 | 217.946 | 149.351 |
| 6 | ON | 191.598 | 146.563 | 195.655 | 142.785 |
| 7 | OFF | 180.969 | 137.579 | 187.623 | 137.712 |
| 7 | ON | 189.776 | 136.511 | 186.335 | 139.726 |
| 9 | OFF | 185.633 | 132.749 | 183.726 | 139.310 |
| 9 | ON | 182.334 | 142.339 | 191.473 | 529.097 |
| 10 | OFF | 186.080 | 151.999 | 202.227 | 152.838 |
| 10 | ON | 193.161 | 128.275 | 179.288 | 146.232 |
