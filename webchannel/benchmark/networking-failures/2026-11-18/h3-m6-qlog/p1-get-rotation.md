# P1: first HTTP/3 back-channel GET rotation

Analysis date: 2026-11-24. Existing M6 recordings from 2026-11-18; no new run.
Requested by [PR #138](https://github.com/google/net_http/pull/138).

**All three M6 qlogs show a peer RESET_STREAM, not a response FIN, on the
first back-channel GET.** The peer sends both STOP_SENDING and RESET_STREAM
with error **257 (0x101, H3_GENERAL_PROTOCOL_ERROR)**; RESET_STREAM's final_size
is **63**. RFC 9114 defines this as a general HTTP/3 protocol error, not
H3_NO_ERROR (0x100). The code does not identify the peer's specific reason.
[RFC 9114 §8.1](https://www.rfc-editor.org/rfc/rfc9114.html#section-8.1).

| M6 run | First peer reset, qlog seconds | Unique response stream bytes | Response FIN | Error → next GET creation | Reset → next GET stream on wire |
| --- | --- | --- | --- | --- | --- |
| 1 | 60.256553 | 63 | None | 2.899 ms | 16.810 ms |
| 2 | 60.315516 | 63 | None | 2.409 ms | 16.754 ms |
| 3 | 60.222292 | 63 | None | 2.964 ms | 16.812 ms |

## Stream and byte evidence

The client request-stream order is 0 (handshake POST), 4 (first GET), then 8
(next GET). This mapping uses request order/timing and the app's serialized
handshake/GET timeline; the qlog does not decode HTTP request headers or URLs.
Stream 4's inbound ranges are [0,49) and [49,63), with no gap. Runs 1 and 2
record the latter range twice; adding frame lengths would incorrectly give
77 bytes. Deduplicated data covers 63 bytes, matching the peer's final_size.
Repeated reset frames (2/3/1 per run) describe the same stream termination.

These **63 bytes are QUIC response-stream data**, including HTTP/3 framing and
compressed headers, not an HTTP body-length measurement. The app logs two
decoded noops before rotation. Those log strings are not the complete HTTP body
or an on-wire byte count. No response FIN appears anywhere on stream 4 in any
of the three complete qlogs. The client's earlier request-side FIN is a
different direction and is not counted as response completion.

## SDK continuation

In all three app logs, -1017 is followed by readyState=3 (Complete), HTTP 200,
and `Request Complete.` The next GET keeps the same SID, advances AID=0 → 2,
and uses both logged attempt 1 and URL t=1. It is created 2.409–2.964 ms after
the error; the next request's stream 8 is sent 16.754–16.812 ms after the first
peer reset. **This is the next normal GET, with no observed SDK retry/backoff.**
It does not imply the absence of QUIC packet retransmissions.

This matches the unchanged SDK code: `WCDefaultHTTPRequest` maps -1017 to
Exception and completes the request; `WCChannelRequest.handleReadyStateChange`
sets success from HTTP status 200 and can dispatch normal completion;
`WCWebChannelClientInternal.handleCompleteRequest` starts the next back channel
on its success branch, without entering `attemptRetryForFailedRequest`.

## Reproduction and limits

[Machine-readable evidence](p1-get-rotation.json) contains all stream-4 frames,
request-stream start times, and the app rotation excerpts. Each original qlog
was recovered from the app's existing Documents directory over USB and matched
the SHA-256 already published in its run's `qlog-evidence.json`. No app launch,
network setting change, SDK change or new measurement was required.

```sh
python3 analyze-p1-get-rotation.py --qlogs /path/to/original-qlogs \
  --output /tmp/p1-get-rotation.json
```

Qlog times are relative to its first event; app times are relative to channel
open. The table subtracts timestamps only within the same clock. These are
M6 findings; no frame-level claim is made for the separate T15 runs. The
requested P1 termination/byte/continuation evidence is supplied. Why the peer
chose error 0x101, and why the corresponding HTTP/2 path differs, remain
unestablished by this client-side evidence.
