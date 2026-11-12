# Automatic network-failure experiments

Updated: 2026-11-12T06:58:59.046Z

Native Apple-framework fault injection; fresh demo process/session per trial.
Host command timestamps bound operations, not exact packet-drop onset.
The demo is instrumented and autorun-enabled; SDK/client implementation is unchanged.

| Case | Run | Hold (s) | Timeout count | Error codes | Same-session receive after release | Observation |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | 1 | 10.01 | 0 | [] | True | receive-resumed |
| T1 | 2 | 10.016 | 0 | [] | True | receive-resumed |
| T1 | 3 | 10.013 | 0 | [] | True | receive-resumed |
| T2 | 1 | 50.003 | 1 | [] | True | receive-resumed |
| T2 | 2 | 50.007 | 1 | [] | True | receive-resumed |
| T2 | 3 | 50.003 | 1 | [] | True | receive-resumed |
| T3 | 1 | 90.004 | 2 | [4] | False | channel-error |
| T3 | 2 | 90.015 | 1 | [] | True | receive-resumed |
| T3 | 3 | 90.016 | 1 | [] | True | receive-resumed |
| T4 | 1 | 150.016 | 2 | [4] | False | channel-error |
| T4 | 2 | 150.012 | 2 | [4] | False | channel-error |
| T4 | 3 | 150.009 | 2 | [4] | False | channel-error |
| T5 | 1 | 250.002 | 1 | [1] | False | channel-error |
| T5 | 2 | 250.008 | 1 | [1] | False | channel-error |
| T5 | 3 | 250.009 | 3 | [1] | False | channel-error |
| T6-short | 1 | 50.016 | 1 | [] | True | receive-resumed |
| T6-short | 2 | 50.015 | 1 | [] | True | receive-resumed |
| T6-short | 3 | 50.003 | 1 | [] | True | receive-resumed |
| T6-long | 1 | 150.013 | 2 | [4] | False | channel-error |
| T6-long | 2 | 150.01 | 2 | [4] | False | channel-error |
| T6-long | 3 | 150.007 | 1 | [1] | False | channel-error |
| T6-exhaust | 1 | 250.016 | 3 | [1] | False | channel-error |
| T6-exhaust | 2 | 250.008 | 3 | [1] | False | channel-error |
| T6-exhaust | 3 | 250.011 | 3 | [1] | False | channel-error |
| T7 | 1 | 90.009 | 2 | [1] | False | channel-error |
| T7 | 2 | 90.012 | 2 | [1] | False | channel-error |
| T7 | 3 | 90.007 | 3 | [1] | False | channel-error |
| T8 | 1 | 60.003 | 1 | [1] | False | channel-error |
| T8 | 2 | 60.016 | 1 | [1] | False | channel-error |
| T8 | 3 | 60.009 | 1 | [1] | False | channel-error |
| M5-periodic | 1 | 250.012 | 7 | [1] | False | channel-error |
| M5-periodic | 2 | 250.011 | 12 | [1] | False | channel-error |
| M5-periodic | 3 | 250.004 | 5 | [1] | False | channel-error |
| T16 | 1 | 30.007 | 0 | [1] | False | channel-error |
| T16 | 2 | 30.012 | 1 | [1] | False | channel-error |
| T16 | 3 | 30.013 | 1 | [1] | False | channel-error |

## Coverage and limits

T9–T14 need real network-off/flapping/interface changes and are not simulated by packet loss here.
T15 needs confirmed real iOS suspension; process termination or debugger pause is not substituted.
M2/M3 interface-handoff measurements and M6 QUIC packet capture remain pending.
Raw logs include SDK attempts/payloads, app messages, lifecycle, NWPathMonitor and task metrics.
Underlying NSError details are not exposed by the current SDK callbacks; HTTP status and SDK errors are retained.
Application-message gaps/duplicates and complete M1/M4/M5 conclusions require analysis of the raw records.
T6 includes separate 50/150/250 s streaming variants, each repeated independently.
Unexpected outcomes are observations, not automatically relabeled as passing.
