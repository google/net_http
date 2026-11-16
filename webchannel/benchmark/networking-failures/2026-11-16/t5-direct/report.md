# Automatic network-failure experiments

Updated: 2026-11-16T13:13:22.582Z

Native Apple-framework fault injection; fresh demo process/session per trial.
Host command timestamps bound operations, not exact packet-drop onset.
The demo is instrumented and autorun-enabled; SDK/client implementation is unchanged.

| Case | Run | Hold (s) | Timeout count | Error codes | Same-session receive after release | Observation |
| --- | --- | --- | --- | --- | --- | --- |
| T5 | 1 | 250.004 | 1 | [1] | False | channel-error |
| T5 | 2 | 250.006 | 3 | [1] | False | channel-error |
| T5 | 3 | 250.002 | 3 | [1] | False | channel-error |

## Coverage and limits

T9–T14 need real network-off/flapping/interface changes and are not simulated by packet loss here.
T15 needs confirmed real iOS suspension; process termination or debugger pause is not substituted.
M2/M3 interface-handoff measurements and M6 QUIC packet capture remain pending.
Raw logs include SDK attempts/payloads, app messages, lifecycle, NWPathMonitor and task metrics.
Underlying NSError details are not exposed by the current SDK callbacks; HTTP status and SDK errors are retained.
Application-message gaps/duplicates and complete M1/M4/M5 conclusions require analysis of the raw records.
T6 includes separate 50/150/250 s streaming variants, each repeated independently.
Unexpected outcomes are observations, not automatically relabeled as passing.
