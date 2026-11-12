# Streaming handoff run 3, 2026-11-13

Outcome handoff-observed; channel errors []; opens 1.
Wire stream frames 69; app deliveries 69.
Wire-array-ID gaps []; duplicate IDs 0; unparsed body records 0.
Largest logged stream interval 1.087 s.

| Probe RID | Request after ready Wi-Fi (s) | isCellular | reusedConnection | Protocol |
| --- | ---: | --- | --- | --- |
| 43265 | -34.957 | False | True | h2 |
| 43266 | -25.926 | True | True | h2 |
| 43267 | 1.037 | True | False | h2 |
| 43268 | 7.279 | False | False | h2 |
| 43269 | 13.044 | False | True | h2 |

Negative times are baseline/cellular-stage probes. Exact RID joins to task
metrics were unique. A mixed Wi-Fi/cellular default path suppresses later
periodic probes because the runner requires a Wi-Fi-only path for them.
Passive streaming continues; this limits claims about later forward traffic.
See analysis.json for the complete path timeline and retained transactions.

Device receipt intervals include server/device scheduling and are not
physical outage durations. Default-path flags are not per-request interface
assignments. No packet capture, underlying NSError trace or operator-error
cause is established. Raw lifecycle/console/structured logs and measured
runner snapshots remain available. Identifying device snapshots/command logs
are omitted, and names/IDs use TEST_DEVICE placeholders. Network/session
measurements remain. This analyzer is preserved as analysis-script.py.

Original output: `/private/tmp/net-http-stream-handoff-20261113-03`.
