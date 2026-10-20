# Lens benchmark — Omnient initial-message delay sweep

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
| Source | Git HEAD `d5c265aa580fc1b815023f7f351d60c89b9a004b` plus uncommitted benchmark instrumentation |
| Test period | 0 ms: 2026-10-14 16:41–16:45 JST, from runner timestamps; 50 ms: 2026-10-14 16:45–16:47 JST, from runner timestamps; 100 ms: 2026-10-14 16:47–16:49 JST, from runner timestamps; 150 ms: 2026-10-14 16:49–16:51 JST, from runner timestamps; 200 ms: 2026-10-14 16:51–16:53 JST, from runner timestamps |
| Test execution | 50 alternating OFF/ON pairs per delay; 0, 50, 100, 150, 200 ms in that order; one selected test repeated within an xcodebuild batch, with the application relaunched for every trial |
| Test result | 499/500 completed trials; 500/500 passed fresh-transport verification |
| Benchmark elapsed time | 703.073 seconds (11.718 minutes); 2026-10-14T07:41:50.926842+00:00 to 2026-10-14T07:53:33.999449+00:00; includes process launch, measurement, attachment export, and any recovery gaps; excludes build and report generation |
| Transport requirement | First transport: `h2`, a new TCP/TLS connection on the handshake GET/POST or early POST; if the GET reused the early POST connection, matching address and local port |

## Procedure and parameters

1. Build the XCTest bundle once, then repeat one alternating cold-trial test with `-test-iterations` and `-test-repetition-relaunch-enabled YES`. Each repetition enters a fresh application process and runs only OFF or ON. A batch-specific atomic counter preserves OFF→ON ordering across application restarts. Keep parallel testing disabled; retain every test result, including failed measurement iterations, without retries or replacements.
2. Run Omnient. Each pair runs `fastHandshake2=false` (OFF), then `fastHandshake2=true` (ON). The XCTest creates a new `WebChannelService` and WebChannel client per trial.
3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `initialMessageDelayMs=0, 50, 100, 150, 200` (separate settings), `enableBinaryEncoding=true`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is metadata; no 150 KB image is uploaded.
4. Schedule M1 Sticky Cluster Info at the configured delay after `connect()` returns. Omnient sends M3 Prefetch immediately after M1. M4 Final Capture follows preliminary detections. Each trial has a 60-second completion deadline.
5. Record Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).
6. Include a pair in the histograms only if both runs completed, both trials meet the transport requirement, and the absolute ON/OFF handshake-duration difference is ≤20 ms. Calculate that difference from full-precision values. Keep every trial in the raw attachments and audit.

7. Include pairs whose ON initial early POST returned HTTP 400, including trials completed after retry. The ordinary completion, fresh-transport, and handshake-difference requirements still apply. An unresolved early POST status is excluded; a verified absence of an early POST is eligible. Do not replace excluded pairs with additional trials.
8. Plot paired differences as ON minus OFF, using full-precision measurements. Negative values mean ON was faster. All delay settings use the same horizontal range and bin edges for each metric. Histograms use 10 ms bins aligned to multiples of 10 ms, pair counts on the vertical axis, and all eligible values without clipping in the main plot. When the full range exceeds 600 ms, an inset magnifies -300 to 300 ms and labels the number of pairs in that range; no additional pairs are excluded. TTFA and TTFD are measured from M3 send, so the configured M1 delay is not added to either metric.

## Pair inclusion and early POST rejection

The HTTP 400 rate uses all 50 attempted pairs at each delay as the denominator, including pairs that fail other histogram inclusion conditions.

| M1 delay (ms) | Measured pairs | ON early POST HTTP 400 | 400 pair rate | No early POST | Unresolved status | Histogram pairs | Included HTTP 400 pairs |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 50 | 26 | 52.0% | 0 | 0 | 43 | 22 |
| 50 | 50 | 2 | 4.0% | 0 | 0 | 45 | 0 |
| 100 | 50 | 0 | 0.0% | 0 | 0 | 44 | 0 |
| 150 | 50 | 0 | 0.0% | 0 | 0 | 48 | 0 |
| 200 | 50 | 1 | 2.0% | 47 | 0 | 44 | 0 |

## M1 delay: 0 ms

### TTFA: ON minus OFF

![TTFA paired difference histogram, delay 0 ms](delay-0ms/histograms/ttfa-on-minus-off.png)

### TTFD: ON minus OFF

![TTFD paired difference histogram, delay 0 ms](delay-0ms/histograms/ttfd-on-minus-off.png)


## M1 delay: 50 ms

### TTFA: ON minus OFF

![TTFA paired difference histogram, delay 50 ms](delay-50ms/histograms/ttfa-on-minus-off.png)

### TTFD: ON minus OFF

![TTFD paired difference histogram, delay 50 ms](delay-50ms/histograms/ttfd-on-minus-off.png)


## M1 delay: 100 ms

### TTFA: ON minus OFF

![TTFA paired difference histogram, delay 100 ms](delay-100ms/histograms/ttfa-on-minus-off.png)

### TTFD: ON minus OFF

![TTFD paired difference histogram, delay 100 ms](delay-100ms/histograms/ttfd-on-minus-off.png)


## M1 delay: 150 ms

### TTFA: ON minus OFF

![TTFA paired difference histogram, delay 150 ms](delay-150ms/histograms/ttfa-on-minus-off.png)

### TTFD: ON minus OFF

![TTFD paired difference histogram, delay 150 ms](delay-150ms/histograms/ttfd-on-minus-off.png)


## M1 delay: 200 ms

### TTFA: ON minus OFF

![TTFA paired difference histogram, delay 200 ms](delay-200ms/histograms/ttfa-on-minus-off.png)

### TTFD: ON minus OFF

![TTFD paired difference histogram, delay 200 ms](delay-200ms/histograms/ttfd-on-minus-off.png)
