# Streaming handoff run 2, 2026-11-13

Outcome handoff-observed; channel errors []; opens 1.
Wire stream frames 68; app deliveries 68.
Wire-array-ID gaps []; duplicate IDs 0; unparsed body records 0.
Largest logged stream interval 1.539 s.

| Probe RID | Request after ready Wi-Fi (s) | isCellular | reusedConnection | Protocol |
| --- | ---: | --- | --- | --- |
| 69330 | -34.358 | False | True | h2 |
| 69331 | -25.457 | True | True | h2 |
| 69332 | 0.567 | False | False | h2 |
| 69333 | 6.567 | False | True | h2 |
| 69334 | 12.360 | False | True | h2 |
| 69335 | 18.002 | False | True | h2 |
| 69336 | 23.680 | False | True | h2 |

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

Original output: `/private/tmp/net-http-stream-handoff-20261113-02`.
