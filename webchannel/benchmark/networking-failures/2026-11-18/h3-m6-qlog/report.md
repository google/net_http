# M6: iPhone qlog with session invalidation (2026-11-18)

The startup-configuration plus session-invalidation method successfully produced
iPhone qlog. Three 180 s h3 idle observations now provide explicit PING frame
evidence and local/remote timeout values. This resolves the previous M6
frame-visibility blocker; it is not a blanket networking-suite pass.

## Diagnostic method

Apple DTS recommends configuring `QUIC_LOG_DIRECTORY` before networking and
waiting for URLSession invalidation before collecting qlog. The forum's author
reports that waiting for invalidation made logs appear reliably.
[Apple Developer Forums](https://developer.apple.com/forums/thread/802184).

The opt-in `NETTEST_QLOG_STARTUP=1` mode creates a fresh directory under the
app's Documents/NetworkFailureQlog and sets `QUIC_LOG_DIRECTORY` in App.init,
before the view/service constructs network objects. It records the setenv
result and runtime directory writability. Normal launches do not enable it.

After the idle interval, the host sends the new `qlogfinish` Darwin notification.
The demo closes WebChannel, then queues GTMSessionFetcherService.resetSession
on the WebChannel dispatch queue. The installed dependency's resetSession path
calls URLSession.finishTasksAndInvalidate. Its
`gtmSessionFetcherServiceSessionBecameInvalid` notification is posted from the
URLSession didBecomeInvalid delegate callback. The host waits for that notification,
waits another 5 s, copies the files, and only then terminates the app.
Copying the run subdirectory directly failed because the colon-containing
filename was interpreted incorrectly as `2.qlog`. Copying the parent
NetworkFailureQlog directory succeeded; the intended run was then selected by
its startup directory UUID. Run 1 was recovered this way without repeating
the measurement, and runs 2–3 use the parent-copy method.
No dependency or SDK recovery logic was changed.

Both startup configuration and session teardown changed together in this
experiment. Their individual contributions have not been isolated.

## Initial 30 s capability diagnostic

The new method produced one complete 23,809-byte qlog, with 152 parsed events.
All three completed URLSession transaction metrics were h3, with zero unknown
or known fallback protocols. The qlog records local max_idle_timeout=0 and
remote max_idle_timeout=240000 ms, and three sent 1-RTT packets containing PING.
Two appear during setup (0.042 and 0.086 s from the first qlog event), with
qlog header.packet_size=1216; a later PING appears at 20.243 s. Setup PINGs must not
be pooled with later idle PINGs to compute a keepalive cadence.
This diagnostic is separate from the three planned 180 s observations.

Raw qlog and original device logs remain local in /private/tmp. Published
excerpts will retain only needed transport/frame evidence and redact device
identifiers. No third-party library was installed.

## Three 180 s observations

[Environment](environment.json), [summary](summary.json),
[source snapshots](tool-sources/SHA256SUMS).
Each run opened one WebChannel session and used one complete client qlog.
The app remained active, sent no application messages, and did not undergo
any injected loss or operator-requested interface switch. Both Wi-Fi and
cellular data were ON, as the operator clarified after measurement. These are
not cellular-disabled, Wi-Fi-only baseline observations. All 18 completed transaction metrics
were h3 (6 per run), with zero unknown or fallback protocols. Each run observed
session invalidation before collection and then terminated the app.

| Run | Open to stop command | Local / remote max_idle_timeout | Sent PING packets, all / after first second | First four post-setup PING times |
| --- | --- | --- | --- | --- |
| 1 | 180.234 s | 0 / 240000 ms | 63 / 61 | 20.269, 50.257, 80.363, 110.380 s |
| 2 | 180.239 s | 0 / 240000 ms | 8 / 7 | 20.201, 50.223, 80.433, 110.222 s |
| 3 | 180.258 s | 0 / 240000 ms | 68 / 67 | 20.274, 50.222, 80.313, 110.226 s |

PING times are relative to the first qlog event, not the app's open callback.
“After first second” is an explicit reporting cutoff, not a classification of
all those PINGs as keepalive. Initialization PINGs are retained separately in
the full analysis. Intervals and packet/frame excerpts are available per run:
[run 1](M6-r1/qlog-evidence.json), [run 2](M6-r2/qlog-evidence.json),
[run 3](M6-r3/qlog-evidence.json).

The early post-setup sequence has approximately 30 s spacing, compatible with
the preceding Instruments observation of a 20 s keepalive timer alongside
30 s server noops. Later behavior differs: runs 1 and 3 develop long sequences
of roughly 1 s PING spacing after approximately 120–126 s, including some shorter
intervals. Run 2 instead records PINGs at 120.222, 140.348 and 170.333 s after the
first four. The qlog includes packet-loss/recovery events. No causal explanation
or single fixed PING cadence is inferred from these observations. Qlog directly
identifies PING frames, but does not label their application purpose.

Each run reports one NSURLErrorDomain -1017 during the observation; WebChannel
continues without an SDK error or a new open event. The shutdown also produces
GTMSessionFetcher error -7 after the stop command; this is kept separate from
measurement errors. Runs are not described as error-free. A normal pass/fail
range for M6 is unspecified, so the result is the measured values and variation.

Local qlog records max_idle_timeout=0, consistent with the earlier authenticated
ClientHello showing the parameter omitted (default zero). Remote qlog records
240000 ms in all three runs. With one nonzero advertisement, RFC 9000's timeout
rule uses that value, but these runs contain traffic and do not measure an
actual 240 s idle expiration.
[QUIC idle timeout](https://www.rfc-editor.org/rfc/rfc9000.html#section-10.1).

The specification requests packet capture for M6. These follow-ups instead use
endpoint-generated, per-packet qlog with explicit decoded frame types; no new
RVI capture was taken. Source SHA-256 hashes bind the excerpts to the local raw
files. Identifying connection parameters are excluded from the excerpts. This
method deviation and the within-run protocol/error evidence are retained.
The final process inventory confirms the experiment app has stopped.

## Operator clarification: both radios enabled

After completion, the operator reported that both Wi-Fi and cellular data had
remained ON from the preceding experiment. This is now an explicit environment
condition. The records remain observations under that condition; no rerun has
silently been substituted.

| Run | NWPathMonitor change after channel open | Task metrics |
| --- | --- | --- |
| 1 | At 124.804 s: Wi-Fi only → Wi-Fi + cellular, expensive=true | 6/6 isCellular=false; one recorded local address |
| 2 | No reported change from Wi-Fi only | 6/6 isCellular=false; one recorded local address |
| 3 | At 119.351 s: Wi-Fi only → Wi-Fi + cellular, expensive=true | 6/6 isCellular=false; one recorded local address |

The two runs with roughly 1 s PING sequences also report this path change;
run 2 reports neither. That is an association in these three observations,
not an established cause. Path times are relative to the app open callback,
while PING times are relative to the first qlog event; they have different
origins. NWPathMonitor's flags do not prove that a PING traversed cellular,
and request-level isCellular=false does not establish the path of every QUIC
packet or exclude probing on another path. No packet-level cellular attribution
is claimed. A cellular-disabled repeat would be the controlled comparison for
this variation, if needed.
