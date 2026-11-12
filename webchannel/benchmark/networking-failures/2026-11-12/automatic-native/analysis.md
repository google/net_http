# Analysis of automatic trials

Completed trials analyzed: 36

Observed protocols in completed task metrics: h2, unknown

| Trial | Hold (s) | First watchdog since last chunk, device clock (s) | Error | Coarse expected outcome |
| --- | --- | --- | --- | --- |
| T1-r1 | 10.01 |  | [] | True |
| T1-r2 | 10.016 |  | [] | True |
| T1-r3 | 10.013 |  | [] | True |
| T2-r1 | 50.003 | 45.001697 | [] | True |
| T2-r2 | 50.007 | 45.001757 | [] | True |
| T2-r3 | 50.003 | 45.001591 | [] | True |
| T3-r1 | 90.004 | 45.001404 | [4] | True |
| T3-r2 | 90.015 | 45.001343 | [] | True |
| T3-r3 | 90.016 | 45.001538 | [] | True |
| T4-r1 | 150.016 | 45.001782 | [4] | True |
| T4-r2 | 150.012 | 45.001393 | [4] | True |
| T4-r3 | 150.009 | 45.001737 | [4] | True |
| T5-r1 | 250.002 | 45.000798 | [1] | True |
| T5-r2 | 250.008 | 45.001277 | [1] | True |
| T5-r3 | 250.009 | 45.001375 | [1] | True |
| T6-short-r1 | 50.016 | 45.001667 | [] | True |
| T6-short-r2 | 50.015 | 45.001434 | [] | True |
| T6-short-r3 | 50.003 | 45.001641 | [] | True |
| T6-long-r1 | 150.013 | 45.001567 | [4] | True |
| T6-long-r2 | 150.01 | 45.000592 | [4] | True |
| T6-long-r3 | 150.007 | 45.001521 | [1] | False |
| T6-exhaust-r1 | 250.016 | 45.001695 | [1] | True |
| T6-exhaust-r2 | 250.008 | 45.00175 | [1] | True |
| T6-exhaust-r3 | 250.011 | 45.00143 | [1] | True |
| T7-r1 | 90.009 |  | [1] | True |
| T7-r2 | 90.012 |  | [1] | True |
| T7-r3 | 90.007 |  | [1] | True |
| T8-r1 | 60.003 |  | [1] | True |
| T8-r2 | 60.016 |  | [1] | True |
| T8-r3 | 60.009 |  | [1] | True |
| M5-periodic-r1 | 250.012 |  | [1] | True |
| M5-periodic-r2 | 250.011 | 66.850244 | [1] | True |
| M5-periodic-r3 | 250.004 |  | [1] | True |
| T16-r1 | 30.007 |  | [1] | True |
| T16-r2 | 30.012 |  | [1] | True |
| T16-r3 | 30.013 |  | [1] | True |

Outcome matching above checks error/recovery categories only, not every timing or delivery requirement.
Hold durations use the helper monotonic clock; watchdog deltas use device uptime. Cross-process timing uses Mac wall timestamps, which can be affected by clock corrections. Native acknowledgements are not packet timestamps.
Application-message continuity, retry timing ranges, and non-acked counts need case-specific review in the raw logs.

## Abort timing deviations

The spec estimates 165–225 s for a prolonged back-channel blackhole. Observed earlier/later aborts:

- T5-r1: error [1] after approximately 121.088 s from enable acknowledgement (Mac wall timestamps).
- T5-r2: error [1] after approximately 120.734 s from enable acknowledgement (Mac wall timestamps).
- M5-periodic-r1: error [1] after approximately 52.071 s from enable acknowledgement (Mac wall timestamps).
- M5-periodic-r2: error [1] after approximately 82.628 s from enable acknowledgement (Mac wall timestamps).
- M5-periodic-r3: error [1] after approximately 55.035 s from enable acknowledgement (Mac wall timestamps).

Inspect HTTP status-0 failures: a platform failure can end a request before the 45 s watchdog. This is a hypothesis for the shorter total, not an underlying NSError diagnosis.

## Handshake blackhole

| Trial | Handshake POST count | Open events | Error after POST start, device clock (s) |
| --- | --- | --- | --- |
| T8-r1 | 1 | 0 | 45.003189 |
| T8-r2 | 1 | 0 | 45.004662 |
| T8-r3 | 1 | 0 | 44.988009 |

A single handshake POST with no open event confirms no automatic handshake retry in that trial.

## Pending writes and periodic sends

| Trial | Send invocations | Error after first send, device clock (s) | Non-acked objects in close log | Expected abort timing |
| --- | --- | --- | --- | --- |
| T7-r1 | 1 | 40.559522 | 1 | True |
| T7-r2 | 1 | 47.136057 | 1 | True |
| T7-r3 | 1 | 54.747524 | 1 | True |
| M5-periodic-r1 | 11 | 51.44962 | 11 |  |
| M5-periodic-r2 | 17 | 82.179888 | 17 |  |
| M5-periodic-r3 | 11 | 54.477538 | 11 |  |
| T16-r1 | 1 | 18.086556 | 1 | True |
| T16-r2 | 1 | 17.339159 | 1 | True |
| T16-r3 | 1 | 12.687036 | 1 | True |

Non-acked object counts are parsed from WCQueuedMap descriptions in SDK close logs; the raw descriptions are retained. Send invocations include only accepted app sends, not rejected attempts after closure.

## Path changes during loss

NWPathMonitor reported an unavailable path during these loss intervals:

- T2-r2: first unsatisfied path about 22.495 s after enable acknowledgement.
- T5-r1: first unsatisfied path about 86.802 s after enable acknowledgement.
- T5-r2: first unsatisfied path about 101.335 s after enable acknowledgement.
- T6-long-r3: first unsatisfied path about 84.457 s after enable acknowledgement.
- M5-periodic-r3: first unsatisfied path about 228.126 s after enable acknowledgement.

This does not identify a physical interface switch, but it limits interpretation as a purely silent blackhole with an always-usable path. Status-0 request failures and the OS cellular-data-off dialog are recorded separately; underlying NSError is unavailable.
