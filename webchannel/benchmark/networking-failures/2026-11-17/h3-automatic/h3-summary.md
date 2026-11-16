# h3-started automatic fault observations

Completed sequences: 15. Every sequence had a confirmed h3 baseline POST before loss.
Mixed recovery is an observed outcome, not pure h3 coverage. Unknown transactions are not counted as h3.

| Case | Run | Hold | SDK errors | Outcome | h3 / h2 / unknown transactions | Coverage |
| --- | ---: | ---: | --- | --- | --- | --- |
| T2 | [1](T2-r1/device-events.jsonl) | 50.005 s | [] | receive-resumed | 3 / 2 / 2 | mixed-after-h3-baseline |
| T2 | [2](T2-r2/device-events.jsonl) | 50.006 s | [] | receive-resumed | 3 / 2 / 0 | mixed-after-h3-baseline |
| T2 | [3](T2-r3/device-events.jsonl) | 50.013 s | [] | receive-resumed | 3 / 2 / 0 | mixed-after-h3-baseline |
| T3 | [1](T3-r1/device-events.jsonl) | 90.008 s | [] | receive-resumed | 3 / 2 / 1 | mixed-after-h3-baseline |
| T3 | [2](T3-r2/device-events.jsonl) | 90.005 s | [] | receive-resumed | 3 / 2 / 1 | mixed-after-h3-baseline |
| T3 | [3](T3-r3/device-events.jsonl) | 90.004 s | [1] | channel-error | 3 / 0 / 4 | h3-observed-no-known-fallback |
| T4 | [1](T4-r1/device-events.jsonl) | 150.015 s | [4] | channel-error | 3 / 1 / 2 | mixed-after-h3-baseline |
| T4 | [2](T4-r2/device-events.jsonl) | 150.010 s | [4] | channel-error | 3 / 1 / 2 | mixed-after-h3-baseline |
| T4 | [3](T4-r3/device-events.jsonl) | 150.008 s | [4] | channel-error | 4 / 1 / 1 | mixed-after-h3-baseline |
| T5 | [1](T5-r1/device-events.jsonl) | 250.002 s | [1] | channel-error | 3 / 0 / 4 | h3-observed-no-known-fallback |
| T5 | [2](T5-r2/device-events.jsonl) | 250.006 s | [1] | channel-error | 3 / 0 / 4 | h3-observed-no-known-fallback |
| T5 | [3](T5-r3/device-events.jsonl) | 250.003 s | [1] | channel-error | 6 / 0 / 0 | h3-observed-no-known-fallback |
| T7 | [1](T7-r1/device-events.jsonl) | 90.014 s | [1] | channel-error | 3 / 0 / 4 | h3-observed-no-known-fallback |
| T7 | [2](T7-r2/device-events.jsonl) | 90.011 s | [1] | channel-error | 3 / 0 / 4 | h3-observed-no-known-fallback |
| T7 | [3](T7-r3/device-events.jsonl) | 90.006 s | [1] | channel-error | 3 / 0 / 5 | h3-observed-no-known-fallback |

All retained holds have active app heartbeats, one request SID, and native active/inactive readbacks.
Cross-process fault-relative times use host wall-clock observations; native acknowledgements are not packet timestamps.
The new Google APIs hostname is specified by PR #133. Earlier h2 measurements used the sandbox hostname; this is not a same-origin forced-protocol A/B comparison.
The first T2 sequence used the strict fallback-stop controller; its raw mixed recovery is retained and was not rerun. Subsequent trials record mixed recovery without treating it as infrastructure failure.
Startup failures remain excluded under interrupted-attempts. Measured controller/source revisions are identified separately.
