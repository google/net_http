# Lens benchmark — Omnient individual observations

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
| Source | Git HEAD `236d7a20e92df95806471e7ac0fe2c840b855a79` plus uncommitted benchmark instrumentation |
| Test period | 0 ms: 2026-10-20 12:38–12:42 JST, from runner timestamps; 50 ms: 2026-10-20 12:42–12:46 JST, from runner timestamps; 100 ms: 2026-10-20 12:46–12:50 JST, from runner timestamps; 150 ms: 2026-10-20 12:50–12:55 JST, from runner timestamps; 200 ms: 2026-10-20 12:55–12:59 JST, from runner timestamps |
| Test execution | 100 OFF trials and 100 ON trials per delay, in alternating order; fresh application process per trial |
| Test result | 947/1000 completed trials; 1000/1000 passed fresh-transport verification |
| Benchmark elapsed time | 1252.976 seconds (20.883 minutes); 2026-10-20T03:38:45.897388+00:00 to 2026-10-20T03:59:38.873252+00:00; includes process launch, measurement, attachment export, and any recovery gaps; excludes build and report generation |
| Transport requirement | First transport: `h2`, a new TCP/TLS connection on the handshake GET/POST or early POST; if the GET reused the early POST connection, matching address and local port |

## Procedure and parameters

1. Build the XCTest bundle once, then repeat one alternating cold-trial test with `-test-iterations` and `-test-repetition-relaunch-enabled YES`. Each repetition enters a fresh application process and runs only OFF or ON. A batch-specific atomic counter preserves OFF→ON ordering across application restarts. Keep parallel testing disabled; retain every test result, including failed measurement iterations, without retries or replacements.
2. Run Omnient with fastHandshake2 OFF and ON in alternating trial order. The XCTest creates a new WebChannelService and client per trial. Existing pair numbers are source-file identifiers only; analysis does not pair trials.
3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `initialMessageDelayMs=0, 50, 100, 150, 200` (separate settings), `enableBinaryEncoding=true`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is metadata; no 150 KB image is uploaded.
4. Schedule M1 Sticky Cluster Info at the configured delay after `connect()` returns. Omnient sends M3 Prefetch immediately after M1. M4 Final Capture follows preliminary detections. Each trial has a 60-second completion deadline.
5. Record Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).

6. Treat each trial independently. For each metric, plot every finite observed value, including values from incomplete trials. Do not select by adjacent trial, handshake duration or difference, HTTP status, overall completion, or transport-freshness flag. Missing values are counted separately and never imputed as zero or the timeout duration.
7. Scatter plots use elapsed time from the first trial start within each delay on the horizontal axis and the actual metric in milliseconds on the vertical axis. OFF is blue circles; ON is orange triangles. Points are not connected. Each metric shares latency limits across delays; all scatter plots share elapsed-time limits. Full-range plots retain every observation; separate lower panels show 0–600 ms when the full latency span exceeds 600 ms.
8. ECDF plots use actual latency in milliseconds on the horizontal axis and the fraction of observed values at or below it on the vertical axis. OFF uses a blue solid line; ON uses an orange dashed line. Each setting is normalized by its own observed count, with missing counts shown separately. ECDFs describe observed values, not the probability of completion before the timeout.

## Raw data

[All individual observations — JSON](plots/all-trials.json) · [CSV](plots/all-trials.csv) · [Original evidence index](artifacts.md). The combined files copy original metric values without pairing or filtering; the original JSON/CSV exports, including logs and task metrics, are linked below.

| M1 delay (ms) | Original JSON/CSV exports | Per-trial evidence index |
|---:|---|---|
| 0 | [Per-trial JSON/CSV](delay-0ms/attachments/) | [All trials](delay-0ms/artifacts.md) |
| 50 | [Per-trial JSON/CSV](delay-50ms/attachments/) | [All trials](delay-50ms/artifacts.md) |
| 100 | [Per-trial JSON/CSV](delay-100ms/attachments/) | [All trials](delay-100ms/artifacts.md) |
| 150 | [Per-trial JSON/CSV](delay-150ms/attachments/) | [All trials](delay-150ms/artifacts.md) |
| 200 | [Per-trial JSON/CSV](delay-200ms/attachments/) | [All trials](delay-200ms/artifacts.md) |

## Observation counts and initial early POST rejection

No handshake-difference filter is applied. HTTP 400 and unresolved HTTP status do not exclude observed values. The HTTP 400 rate uses all recorded ON trials as its denominator.

| M1 delay (ms) | Setting | Recorded trials | TTFA observed | TTFA missing | TTFD observed | TTFD missing | ON early POST HTTP 400 |
|---:|---|---:|---:|---:|---:|---:|---|
| 0 | OFF | 100 | 100 | 0 | 100 | 0 | — |
| 0 | ON | 100 | 72 | 28 | 72 | 28 | 66/100 (66.0%) |
| 50 | OFF | 100 | 100 | 0 | 100 | 0 | — |
| 50 | ON | 100 | 76 | 24 | 76 | 24 | 26/100 (26.0%) |
| 100 | OFF | 100 | 100 | 0 | 100 | 0 | — |
| 100 | ON | 100 | 100 | 0 | 100 | 0 | 0/100 (0.0%) |
| 150 | OFF | 100 | 100 | 0 | 100 | 0 | — |
| 150 | ON | 100 | 100 | 0 | 100 | 0 | 4/100 (4.0%) |
| 200 | OFF | 100 | 100 | 0 | 100 | 0 | — |
| 200 | ON | 100 | 99 | 1 | 99 | 1 | 3/100 (3.0%) |

## M1 delay: 0 ms

### TTFA

![TTFA individual observations](plots/delay-0ms/ttfa-scatter.png)

![TTFA ECDF](plots/delay-0ms/ttfa-ecdf.png)

### TTFD

![TTFD individual observations](plots/delay-0ms/ttfd-scatter.png)

![TTFD ECDF](plots/delay-0ms/ttfd-ecdf.png)


## M1 delay: 50 ms

### TTFA

![TTFA individual observations](plots/delay-50ms/ttfa-scatter.png)

![TTFA ECDF](plots/delay-50ms/ttfa-ecdf.png)

### TTFD

![TTFD individual observations](plots/delay-50ms/ttfd-scatter.png)

![TTFD ECDF](plots/delay-50ms/ttfd-ecdf.png)


## M1 delay: 100 ms

### TTFA

![TTFA individual observations](plots/delay-100ms/ttfa-scatter.png)

![TTFA ECDF](plots/delay-100ms/ttfa-ecdf.png)

### TTFD

![TTFD individual observations](plots/delay-100ms/ttfd-scatter.png)

![TTFD ECDF](plots/delay-100ms/ttfd-ecdf.png)


## M1 delay: 150 ms

### TTFA

![TTFA individual observations](plots/delay-150ms/ttfa-scatter.png)

![TTFA ECDF](plots/delay-150ms/ttfa-ecdf.png)

### TTFD

![TTFD individual observations](plots/delay-150ms/ttfd-scatter.png)

![TTFD ECDF](plots/delay-150ms/ttfd-ecdf.png)


## M1 delay: 200 ms

### TTFA

![TTFA individual observations](plots/delay-200ms/ttfa-scatter.png)

![TTFA ECDF](plots/delay-200ms/ttfa-ecdf.png)

### TTFD

![TTFD individual observations](plots/delay-200ms/ttfd-scatter.png)

![TTFD ECDF](plots/delay-200ms/ttfd-ecdf.png)
