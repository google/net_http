# Automatic network-failure experiments

Updated: 2026-11-17T05:43:00.307Z

Native Apple-framework fault injection; fresh demo process/session per trial.
Host command timestamps bound operations, not exact packet-drop onset.
The demo is instrumented and autorun-enabled; SDK/client implementation is unchanged.

| Case | Run | Hold (s) | Timeout count | Error codes | Same-session receive after release | Observation |
| --- | --- | --- | --- | --- | --- | --- |
| T2 | 1 | 50.005 | 1 | [] | True | receive-resumed |
| T2 | 2 | 50.006 | 1 | [] | True | receive-resumed |
| T2 | 3 | 50.013 | 1 | [] | True | receive-resumed |
| T3 | 1 | 90.008 | 2 | [] | True | receive-resumed |
| T3 | 2 | 90.005 | 2 | [] | True | receive-resumed |
| T3 | 3 | 90.004 | 1 | [1] | False | channel-error |
| T4 | 1 | 150.015 | 3 | [4] | False | channel-error |
| T4 | 2 | 150.01 | 3 | [4] | False | channel-error |
| T4 | 3 | 150.008 | 3 | [4] | False | channel-error |
| T5 | 1 | 250.002 | 4 | [1] | False | channel-error |
| T5 | 2 | 250.006 | 3 | [1] | False | channel-error |
| T5 | 3 | 250.003 | 4 | [1] | False | channel-error |
| T7 | 1 | 90.014 | 2 | [1] | False | channel-error |
| T7 | 2 | 90.011 | 2 | [1] | False | channel-error |
| T7 | 3 | 90.006 | 3 | [1] | False | channel-error |

## Coverage and limits

T9–T14 need real network-off/flapping/interface changes and are not simulated by packet loss here.
T15 needs confirmed real iOS suspension; process termination or debugger pause is not substituted.
M2/M3 interface-handoff measurements and M6 QUIC packet capture remain pending.
Raw logs include SDK attempts/payloads, app messages, lifecycle, NWPathMonitor and task metrics.
Underlying NSError details are not exposed by the current SDK callbacks; HTTP status and SDK errors are retained.
Application-message gaps/duplicates and complete M1/M4/M5 conclusions require analysis of the raw records.
T6 includes separate 50/150/250 s streaming variants, each repeated independently.
Unexpected outcomes are observations, not automatically relabeled as passing.
