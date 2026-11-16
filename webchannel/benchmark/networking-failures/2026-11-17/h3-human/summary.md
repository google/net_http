# H3-started human-operated observations

Completed qualified trials only; excluded duration attempts remain in a separate directory.
Requested hold controls the restoration cue, not the physical time Wi-Fi reconnects.

| Trial | Requested hold (s) | Observed offline path (s) | Restore to echo (s) | Observation | SDK errors | Protocol coverage |
| --- | ---: | ---: | ---: | --- | --- | --- |
| T10-r1-retry2 | 30.000 | 37.379 | — | channel-failed | [1] | h3-observed-no-known-fallback |
| T10-r2 | 30.000 | 34.832 | — | channel-failed | [1] | h3-observed-no-known-fallback |
| T10-r3 | 30.000 | 34.706 | — | channel-failed | [1] | h3-observed-no-known-fallback |
| T11-r1 | 5.000 | — | — | echo-resumed | [] | mixed-after-h3-baseline |
| T11-r2 | 5.000 | — | — | channel-failed | [1] | h3-observed-no-known-fallback |
| T11-r3 | 5.000 | — | — | echo-resumed | [] | h3-observed-no-known-fallback |
| T12-T14-idle-r1 | 15.000 | — | — | both-direction-probe-echoes | [] | h3-observed-no-known-fallback |
| T12-T14-idle-r2-retry2 | 15.000 | — | — | both-direction-probe-echoes | [] | h3-observed-no-known-fallback |
| T12-T14-idle-r3 | 15.000 | — | — | both-direction-probe-echoes | [] | h3-observed-no-known-fallback |
| T12-T14-stream-r1 | 15.000 | — | — | both-direction-probe-echoes | [] | h3-observed-no-known-fallback |
| T12-T14-stream-r2 | 15.000 | — | — | both-direction-probe-echoes | [] | h3-observed-no-known-fallback |
| T12-T14-stream-r3 | 15.000 | — | — | both-direction-probe-echoes | [] | h3-observed-no-known-fallback |
| T13-long-r1 | 150.000 | — | — | channel-failed | [4] | mixed-after-h3-baseline |
| T13-long-r2 | 150.000 | — | — | channel-failed | [4] | mixed-after-h3-baseline |
| T13-long-r3 | 150.000 | — | — | channel-failed | [4] | mixed-after-h3-baseline |
| T13-medium-r1 | 90.000 | — | 1.008 | echo-resumed | [] | mixed-after-h3-baseline |
| T13-medium-r2 | 90.000 | — | 1.131 | echo-resumed | [] | mixed-after-h3-baseline |
| T13-medium-r3 | 90.000 | — | 0.943 | echo-resumed | [] | mixed-after-h3-baseline |
| T13-short-r1 | 50.000 | — | 0.460 | echo-resumed | [] | mixed-after-h3-baseline |
| T13-short-r2 | 50.000 | — | 1.021 | echo-resumed | [] | mixed-after-h3-baseline |
| T13-short-r3 | 50.000 | — | 1.491 | echo-resumed | [] | mixed-after-h3-baseline |
| T9-long-r1 | 60.000 | 64.963 | — | channel-failed | [1] | h3-observed-no-known-fallback |
| T9-long-r2 | 60.000 | 64.665 | — | channel-failed | [1] | h3-observed-no-known-fallback |
| T9-long-r3 | 60.000 | 64.712 | — | channel-failed | [1] | h3-observed-no-known-fallback |
| T9-short-r1-retry | 10.000 | 16.466 | 16.339 | echo-resumed | [] | h3-observed-no-known-fallback |
| T9-short-r2 | 10.000 | 14.123 | 19.750 | echo-resumed | [] | h3-observed-no-known-fallback |
| T9-short-r3 | 10.000 | 14.371 | 17.059 | echo-resumed | [] | h3-observed-no-known-fallback |

Path callbacks are asynchronous observations. Unknown failed transactions are not h3 proof.

## T10 pending writes

| Trial | Offline to submission (s) | Submission to terminal (s) | POST attempts | Matching echo |
| --- | ---: | ---: | --- | --- |
| T10-r1-retry2 | 2.836 | 11.950 | [1, 2, 3] | False |
| T10-r2 | 2.589 | 7.240 | [1, 2, 3] | False |
| T10-r3 | 2.105 | 11.473 | [1, 2, 3] | False |

Echo absence is not a count of unacknowledged transport objects.

## T11 cycles

| Trial | Cycle | Offline to restore cue (s) | Observed offline path (s) |
| --- | ---: | ---: | ---: |
| T11-r1 | 1 | 5.453 | 9.371 |
| T11-r1 | 2 | 5.942 | 11.702 |
| T11-r1 | 3 | 5.501 | 9.378 |
| T11-r2 | 1 | 5.365 | 9.401 |
| T11-r2 | 2 | 5.491 | 9.501 |
| T11-r2 | 3 | 5.735 | 9.335 |
| T11-r3 | 1 | 5.452 | 9.259 |
| T11-r3 | 2 | 5.964 | 8.751 |
| T11-r3 | 3 | 5.876 | 9.286 |

A mixed protocol result is retained as such; it is not counted as pure h3 coverage.

## Continuous delivery during handoff

| Trial | Parsed stream frames / app deliveries | Largest logged interval (s) | Array-ID gaps / duplicates | Unparsed bodies |
| --- | --- | ---: | --- | ---: |
| T12-T14-stream-r1 | 65 / 65 | 1.241 | [] / 0 | 0 |
| T12-T14-stream-r2 | 68 / 68 | 1.186 | [] / 0 | 0 |
| T12-T14-stream-r3 | 71 / 71 | 1.141 | [] / 0 | 0 |

Delivery gaps are not exact packet outage times; ID continuity covers the parsed observation window only.

## T13 cellular-only loss

| Trial | Requested hold (s) | Observed broken-cellular path (s) | Observation | SDK errors | HTTP 400 | Protocol coverage |
| --- | ---: | ---: | --- | --- | --- | --- |
| T13-long-r1 | 150.000 | 162.822 | channel-failed | [4] | True | mixed-after-h3-baseline |
| T13-long-r2 | 150.000 | 157.506 | channel-failed | [4] | True | mixed-after-h3-baseline |
| T13-long-r3 | 150.000 | 162.069 | channel-failed | [4] | True | mixed-after-h3-baseline |
| T13-medium-r1 | 90.000 | 107.672 | echo-resumed | [] | False | mixed-after-h3-baseline |
| T13-medium-r2 | 90.000 | 102.496 | echo-resumed | [] | False | mixed-after-h3-baseline |
| T13-medium-r3 | 90.000 | 103.031 | echo-resumed | [] | False | mixed-after-h3-baseline |
| T13-short-r1 | 50.000 | 62.120 | echo-resumed | [] | False | mixed-after-h3-baseline |
| T13-short-r2 | 50.000 | 56.304 | echo-resumed | [] | False | mixed-after-h3-baseline |
| T13-short-r3 | 50.000 | 63.677 | echo-resumed | [] | False | mixed-after-h3-baseline |

The operator maintains the cellular-only conditioner profile; interface-bound preflight is reachability proof, not continuous packet-loss measurement.
