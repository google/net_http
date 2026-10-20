# Upstream synchronization preflight

[Specification](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

Upstream branch: `origin/wenbozhu/webchannel-objc-sync-2026-10`, commit `236d7a20e92df95806471e7ac0fe2c840b855a79`. The existing empty Jujutsu working commit was rebased onto that branch, preserving local benchmark instrumentation and historical measurement files. Local bookmark: `codex/webchannel-objc-sync-benchmark-2026-10-20`.

Generic physical-iOS build-for-testing passed. The first device-targeted invocation stopped before compilation because the previous iPhone destination was unavailable. The device subsequently became available (paired). CocoaPods regenerated the project to include WCNetUtils, WCURIBuilder and WCSimpleAtoi; dependency versions were unchanged (the lockfile records CocoaPods 1.17.0 instead of 1.16.2).

Physical-device smoke checks will run one OFF and one ON trial at each M1 delay 0, 50, 100, 150 and 200 ms (10 trials total), with a fresh app per trial and actual HTTP/2 TCP/TLS freshness verification. This smoke dataset is separate from the full measurement.

The full 100-pair-per-delay benchmark has not started and requires explicit user confirmation after functional checks.

Initial device smoke launch was rejected because the Developer App Certificate was not trusted. No trial entered the measurement code and no trial result was produced. Original logs and result bundle are retained. The user subsequently completed the trust operation; smoke checks will resume without repeating an entered measurement.

## Functional check results

The physical-device smoke finished all 10 trials: one OFF and one ON at each delay 0, 50, 100, 150 and 200 ms. All four measured latency fields were finite in every trial. All 10 trials used distinct app process instances and passed actual fresh HTTP/2 TCP/TLS verification. Original JSON/CSV and stdout identities/hashes were verified.

Initial early POST HTTP 400 was observed in ON trials at 0, 50, 100 and 150 ms; all of these trials completed. The 200 ms ON trial had no initial early POST HTTP 400. This small smoke sample is a functional check, not a benchmark estimate of rejection rates.

The old temporary plotting environment no longer had matplotlib available. A dedicated environment with the previous matplotlib version (3.10.9) was created, and report postprocessing was repeated without repeating any measured trial. Original execution settings and the failed postprocessing log are preserved.

The full measurement remains pending explicit user confirmation: 100 OFF/ON pairs per delay (500 pairs / 1,000 trials total), using individual observations without handshake-difference selection, with scatter/ECDF figures and links to raw data.
