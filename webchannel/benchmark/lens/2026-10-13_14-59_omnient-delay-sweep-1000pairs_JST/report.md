# Lens benchmark — interrupted 1000-pair Omnient delay sweep

## Experiment specification

[Google net_http: Lens Latency Mimic & Shutter Benchmark Mode](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

## Status

**Interrupted at the user’s request; this experiment will not resume.** The workflow had already stopped at 0 ms pair 626 OFF before any measurement started, after three unsuccessful development-service recovery attempts. Cancellation was recorded at 2026-10-14T00:29:24.633480+00:00. No benchmark processes remained running.

## Environment and parameters

iPhone SE (3rd generation), iPhone14,6; iOS 26.3.1. Endpoint: `https://webchannel.sandbox.google.com/staging/channel/lens`. Mac: macOS 26.5.1, Xcode 26.6 (17F113). Wi-Fi and Cellular switches were not independently recorded.

The user reported that the iPhone was unlocked during earlier failures, Mac screen saver and automatic display sleep were disabled, and the USB cable was directly connected. Failure snapshots retained USB recognition and CoreDevice connectivity; the generic Xcode unlock message does not establish a device lock or physical USB disconnection.

Requested: 1000 OFF/ON pairs at each of 0, 50, 100, 150, and 200 ms after `connect()` returns. Omnient only, `enableBinaryEncoding=true`, `fastHandshake=false`, `nonBlockingSend=false`, `detectionDelayMs=50`, image-size metadata 150 KB, a new process per trial, and verified fresh HTTP/2 transport. Histogram policy included eligible early POST HTTP 400 pairs, with both trials completed and handshake-duration difference ≤20 ms.

## Retained measurements

| M1 delay (ms) | Requested pairs | Recorded pairs | Recorded trials |
|---:|---:|---:|---:|
| 0 | 1000 | 625 | 1250 |
| 50 | 1000 | 0 | 0 |
| 100 | 1000 | 0 | 0 |
| 150 | 1000 | 0 | 0 |
| 200 | 1000 | 0 | 0 |

1242/1250 recorded trials completed; 8 measurement trials failed or timed out. All original measurements are retained, including failures and rejected early POSTs. Completed trials were never replaced for failing histogram inclusion.

No complete five-delay report is produced from this interrupted sweep. The 0 ms artifacts describe only the first 625 retained pairs; the other delays were not started. A separate new experiment will run 10 pairs per delay and record elapsed benchmark time.
