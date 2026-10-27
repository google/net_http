# Post-open resend investigation — October 20, 2026

Scope: retained stdout for all 500 ON trials in the [October 20 sweep](../2026-10-20_12-38_omnient-delay-sweep-100pairs-upstream_JST/report.md). No new measurement or client change was made. The [deterministic audit script](audit-resends.py) records log hashes, batch/ordinal/process identity, SID, request line numbers, request IDs/attempts, message offsets, response statuses and close ordering in [resend-audit.json](resend-audit.json). Run with `python3 -B webchannel/benchmark/lens/resend-investigation-2026-10-20/audit-resends.py`.

## Findings

| M1 delay (ms) | ON sessions with any POST HTTP 400 | Sessions with post-open resend | No resend; SDK aborted before open |
|---:|---:|---:|---:|
| 0 | 66 | 38 | 28 |
| 50 | 40 | 16 | 24 |
| 100 | 0 | 0 | 0 |
| 150 | 5 | 5 | 0 |
| 200 | 4 | 3 | 1 |
| Total | 115 | 62 | 53 |

All 62 resend sessions completed. Every identified resend POST was logged after SDK open and received an HTTP 200 response before SDK close. Resend means repeated message offsets, including split one-message POSTs; 50 sessions have a literal `count=2&ofs=0` resend, while 12 resend only `count=1&ofs=0` or `count=1&ofs=1`. One of those 50 also has a split resend. The binary NSData hex prefix decodes to the queue count/offset header. An HTTP request log is evidence of client dispatch, while the corresponding HTTP 200 is additional evidence that the request received a server response; neither identifies a particular backend host.

All 53 sessions without resend log HTTP 400, `Not retrying due to error type.`, `Error: HTTP request failed.`, `Error code: 1`, SDK abort and SDK close, with no preceding SDK-open event. 49 close with two pending maps and no outgoing maps; four close with one pending and one outgoing map. These match the sweep's 53 failed ON trials. They did not successfully complete the benchmark. Their missing TTFA/TTFD values remain missing, and all evidence was preserved.

The main report's initial-early-POST count is 99. The 115 here includes a 400 on either of the concurrent M1/M3 POSTs; counting only the first POST misses 16 affected sessions.

## Examples and execution order

- [0 ms, pair 1 ON](../2026-10-20_12-38_omnient-delay-sweep-100pairs-upstream_JST/delay-0ms/logs/omnient-1-on.log): early RID 74252 returns 400 and is classified Unknown SessionId; GET RID 74251 opens; RID 74253 resends `count=2&ofs=0`; its 200 arrives before channel close.
- [150 ms, pair 100 ON](../2026-10-20_12-38_omnient-delay-sweep-100pairs-upstream_JST/delay-150ms/logs/omnient-100-on.log): M1 and M3 occupy separate POSTs. RID 5831 attempt 2 resends only `count=1&ofs=0` after open and receives 200 before close. Searching only for count=2 would miss this resend.
- [0 ms, pair 10 ON](../2026-10-20_12-38_omnient-delay-sweep-100pairs-upstream_JST/delay-0ms/logs/omnient-10-on.log): early RID 11775 returns 400, is fatal, and SDK aborts before GET RID 11774 can open. Two maps remain pending. No resend is sent.
- [50 ms, pair 11 ON](../2026-10-20_12-38_omnient-delay-sweep-100pairs-upstream_JST/delay-50ms/logs/omnient-11-on.log): RID 72619 (the second early POST) returns 400 and triggers the same pre-open SDK abort. Counting only RID 72618 would miss the rejection.

## Code reading

In upstream `236d7a20`, `WCChannelRequest.m:362–377` classifies a 400 as UnknownSessionId only if the accumulated response bytes contain the exact string `Unknown SID`; otherwise it becomes Status. `isLastErrorFatal` at lines 147–150 treats both as fatal, but `WCWebChannelClientInternal.m:950–963` relaxes fatal handling for a non-handshake forward request only for UnknownSessionId. A Status error follows the fatal branch and maps to RequestFailed. This explains the observed fatal/no-retry/RequestFailed path; the failed-response bodies themselves are not printed, so the bytes that caused the classification cannot be established from these logs.

`WCChannelRequest.m:296–325` processes non-200 status on an Interactive callback once any response bytes exist, rather than waiting for Complete; `WCDefaultHTTPRequest.m` supplies incoming chunks through accumulateDataBlock. If `Unknown SID` is absent from the first nonempty chunk but appears later, current code would classify and abort too early. This is a code-level possibility, not a proven explanation for the 53 failures. Different server error text is also unexcluded. The next diagnostic should record ready state, accumulated error-body bytes and the chosen error classification before cleanup, or obtain the exact server error bodies for the matching SIDs.

The benchmark polls `lensMetrics.isRunning` every 50 ms (`LensBenchmarkTests.swift:116–125`) and calls `service.disconnect()` after copying results (line 156). Application completion is marked after M4 interaction_response (`WebChannelService.swift:630–637`); encounteredError also clears isRunning and client (lines 652–664). In the 53 failing sessions the SDK abort precedes this harness cleanup, and encounteredError already clears the service client. A generic possibility of cleanup cancelling outstanding requests exists, but these logs do not support post-open cleanup as the explanation for the missing resends: every observed post-open resend has a 200 before close, and every non-resend rejection session aborted before open.

## Server reconciliation and limitations

The server report describes 114 claimed sessions and 64 resends. The main sweep's client evidence gives 115 sessions with any POST 400, 62 with resend and 53 pre-open failures. These populations must not be assumed identical. The separate preflight contains five ON trials, four with 400 and successful resends; it is excluded from this table. Match the server session list to the audit's SID/batch/ordinal fields to determine the exact differences. Server buffering/delivery is not independently established by the client records; preserve the server team's observation as server-side evidence. Without buffering, these 53 client attempts do not demonstrate successful delivery or recovery.
