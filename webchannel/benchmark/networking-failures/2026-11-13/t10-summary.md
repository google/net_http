# T10: network down with a pending write, 2026-11-13

**3 valid repetitions; 0 further repetitions required.**

Physical iPhone, USB logging, mobile data disabled, Wi-Fi initially on.
Fresh process/session and failFast off. Baseline echo before fault. After
an unsatisfied path and active heartbeat, the runner submits exactly one
pending write. No repeated sends; no application reconnect. Requested hold
is 30 s, followed by manual Wi-Fi restoration on the local spoken cue.

| Run | Offline → submission (s) | Offline → error (s) | Submission → error (s) | Error code | Non-acked objects |
| --- | ---: | ---: | ---: | --- | ---: |
| [1](t10-01/result.json) | 2.456 | 9.199 | 6.743 | [1] | 1 |
| [2](t10-02/result.json) | 2.497 | 16.178 | 13.681 | [1] | 1 |
| [3](t10-03/result.json) | 2.165 | 13.708 | 11.543 | [1] | 1 |

The PR #128 T10 expectation is failure about 5–15 s after network down.
The submission delay is exposed separately instead of treating the send
as simultaneous with the fault. Exact forward attempt numbers and their
RIDs are in each analysis.json; raw request/retry logs remain available.
Non-acked counts are parsed from WCQueuedMap descriptions in SDK close
logs, not from a separate acknowledgement API.

Intervals use device uptime, not host/device UTC subtraction. The offline
path callback and app submission event are not physical packet timestamps.
Normal completion of the fault sequence is not a specification pass.
No underlying NSError or packet trace was obtained. Operator reports
about any system dialog are recorded when provided.

Device snapshots and identifying command logs are omitted from these
copies; identifying names/IDs use TEST_DEVICE placeholders. Network/session
evidence and measured runner snapshots with hashes are retained. Originals
remain locally at `/private/tmp/net-http-t10-20261113-0N`.

[Machine-readable aggregate](t10-analysis.json).

## Timing comparison

Fault-to-error intervals were 9.199, 16.178 and 13.708 s. Run 2 slightly
exceeded the spec's nominal 15 s upper bound. Submission was observed 2.456,
2.497 and 2.165 s after the offline callback, respectively. Submission-to-error
intervals were 6.743, 13.681 and 11.543 s. Both timing origins are retained;
the fault origin is not moved to make a trial fit the prediction.

All three trials reported SDK error 1, one non-acked WCQueuedMap in the close
log, and initial plus two retry attempts on the pending forward POST (attempts
1/2/3). This request timeline is consistent with exhaustion of forward retries.
No cleanup error was recorded; source hashes and requested holds match.
