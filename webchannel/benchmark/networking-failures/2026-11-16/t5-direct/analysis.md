# Analysis of automatic trials

Completed trials analyzed: 3

Observed protocols in completed task metrics: h2, unknown

| Trial | Hold (s) | First watchdog since last chunk, device clock (s) | Error | Coarse expected outcome |
| --- | --- | --- | --- | --- |
| T5-r1 | 250.004 | 45.001461 | [1] | True |
| T5-r2 | 250.006 | 45.001538 | [1] | True |
| T5-r3 | 250.002 | 45.00146 | [1] | True |

Outcome matching above checks error/recovery categories only, not every timing or delivery requirement.
Hold durations use the helper monotonic clock; watchdog deltas use device uptime. Cross-process timing uses Mac wall timestamps, which can be affected by clock corrections. Native acknowledgements are not packet timestamps.
Application-message continuity, retry timing ranges, and non-acked counts need case-specific review in the raw logs.

## Abort timing deviations

The spec estimates 165–225 s for a prolonged back-channel blackhole. Observed earlier/later aborts:

- T5-r1: error [1] after approximately 93.47 s from enable acknowledgement (Mac wall timestamps).

Inspect HTTP status-0 failures: a platform failure can end a request before the 45 s watchdog. This is a hypothesis for the shorter total, not an underlying NSError diagnosis.

## Path changes during loss

NWPathMonitor reported an unavailable path during these loss intervals:

- T5-r1: first unsatisfied path about 75.4 s after enable acknowledgement.

This does not identify a physical interface switch, but it limits interpretation as a purely silent blackhole with an always-usable path. Status-0 request failures and the OS cellular-data-off dialog are recorded separately; underlying NSError is unavailable.
