# T11: human-operated network flapping, 2026-11-13

**3 valid trials; 0 further trials required. Three cycles per trial.**

Physical iPhone, mobile data disabled, Wi-Fi initially on, USB logging.
Fresh process/session, failFast off. Baseline echo followed by three
Wi-Fi cut/restore cycles. No app sends between cycles; one final matched
echo is attempted if the channel remains open. The runner never reconnects.
Offline hold requested: 5 s; Wi-Fi foreground-ready hold between cycles: 5 s.
Advance instructions and local spoken cues control the manual operations.

| Run | Cycle | Device elapsed at restore cue (s) | Offline to ready Wi-Fi (s) | Failed GET state records before next cut |
| --- | --- | ---: | ---: | ---: |
| [1](t11-01/result.json) | 1 | 5.593 | 9.975 | 2 |
| [1](t11-01/result.json) | 2 | 5.003 | 9.986 | 2 |
| [1](t11-01/result.json) | 3 | 5.320 | 9.928 | 2 |
| [2](t11-02/result.json) | 1 | 5.724 | 9.821 | 3 |
| [2](t11-02/result.json) | 2 | 5.893 | 9.349 | 1 |
| [2](t11-02/result.json) | 3 | 5.755 | 9.348 | 0 |
| [3](t11-03/result.json) | 1 | 5.428 | 10.048 | 2 |
| [3](t11-03/result.json) | 2 | 5.876 | 9.569 | 3 |
| [3](t11-03/result.json) | 3 | 5.838 | 10.596 | 1 |

## Channel observations

- Run 1: echo-resumed; error codes []; opens 1; unique request SIDs 1; first-offline-to-terminal None; cleanup error None.
- Run 2: channel-failed; error codes [1]; opens 1; unique request SIDs 1; first-offline-to-terminal 25.648296583327465; cleanup error None.
- Run 3: channel-failed; error codes [1]; opens 1; unique request SIDs 1; first-offline-to-terminal 36.81320254167076; cleanup error None.

This is not a fixed-period 5 s network square wave: operator response, Wi-Fi
association and foreground checks add to each interval. Use the observed
device intervals and raw request/retry timeline. A failed GET state-record
count is not the SDK retry-counter value; its window spans the cut and
following recovery until the next cut (or end of capture for cycle 3).
Path callbacks are not physical packet timestamps; device uptime is used
without host/device UTC subtraction. No packet or underlying NSError
trace was obtained. Dialog presence is unknown unless reported by operator.

Each trial preserves raw console/structured logs, lifecycle/task metrics,
cue journal and measured runner source snapshots with SHA-256 hashes.
Identifying device snapshots/command logs are omitted; names/IDs use
TEST_DEVICE placeholders. Network/session evidence remains. Originals:
`/private/tmp/net-http-t11-20261113-0N`.

[Machine-readable aggregate](t11-analysis.json).

## Three-trial comparison

- Run 1: three cycles completed and the final matched echo returned in the original session.
- Run 2: error 1 at 25.648 s from the first offline observation (6.817 s after cycle 2 offline-path observation).
- Run 3: error 1 at 36.813 s from the first offline observation (0.223 s after cycle 3 offline-path observation).

One trial resumed after all three cycles; two failed during the sequence.
Completion of the human-operation sequence does not imply channel recovery.
Identical runner sources were used, and no cleanup error was recorded. This
small, human-operated set demonstrates that failure can occur during flapping;
it does not estimate a population failure probability or establish fixed-period
flapping behavior. Raw timelines retain per-request attempt numbers for retry
analysis rather than inferring counters from failed-state-record counts.
