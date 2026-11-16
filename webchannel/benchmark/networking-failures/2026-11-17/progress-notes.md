# HTTP/3 recheck after reported endpoint change — 2026-11-17

**Update after reading PR #133:** the new Google APIs endpoint successfully
negotiated h3 for real WebChannel traffic. The legacy-host retries below remain
separate historical observations. Fifteen automatic h3-started fault sequences and nine OS-suspension observations are complete; M6 instrumentation is in progress.


## PR #133: endpoint correction and successful h3 preflight

[PR #133](https://github.com/google/net_http/pull/133), merged on 2026-11-17,
clarifies that h3 uses `https://webchannel.googleapis.com/staging/channel/generator`.
The old sandbox hostname remains h2-only. This resolves the endpoint-selection
blocker; the earlier failures do not diagnose the new endpoint.

The demo now accepts `NETTEST_ENDPOINT` only in opted-in autorun mode. With the
new endpoint and `NETTEST_HTTP3=1`, a fresh SDK session opened and echoed. All
four recorded transactions (handshake POST, echo POST, back-channel GET and
cleanup GET) reported h3 and non-cellular use. The handshake advertised Alt-Svc
and `x-client-wire-protocol: h3`. No fault was injected for this preflight.

[Positive preflight](googleapis-preflight/result.json),
[measured source copies](tool-sources/googleapis/SHA256SUMS).

The operator then confirmed USB, Wi-Fi ON, cellular OFF, condition disabled
and direct AP-to-switch wiring. T2–T5 and T7 (three each) have been measured.
Controllers require a baseline h3 POST before injecting a fault and retain
protocol counts afterward. Known h2 fallback is not counted as a pure h3 trial;
unknown failed transactions are reported separately, never treated as h3 proof.

## Legacy-host retries before the endpoint clarification

The operator reported that server-side h3 had not previously been enabled and had now been corrected. This report records what was observed after that report; it does not determine whether a server rollout, endpoint selection or network path explains the result.

| Fresh SDK session | First logged event (UTC) | h3-capable requests | Recorded protocols |
| --- | --- | ---: | --- |
| [sdk-preflight-01](sdk-preflight-01/result.json) | 2026-11-17T04:43:48.641Z | 4 | h2 only |
| [sdk-preflight-02](sdk-preflight-02/result.json) | 2026-11-17T04:45:14.721Z | 4 | h2 only |

Both sessions opened and received a matching echo. All retained SDK transaction metrics were non-cellular. The opt-in demo decorator sets `assumesHTTP3Capable=true`; it enables QUIC racing rather than forcing h3. No SDK retry/recovery code was changed. The installed diagnostic app and its source are the same revision used for the final 2026-11-16 diagnostic.

## Same-iPhone host comparison

| Host | Requests | Recorded protocol | Response |
| --- | ---: | --- | --- |
| www.google.com/generate_204 | 3 | h3 / h3 / h3 | 204, Alt-Svc advertises h3 on UDP 443 |
| webchannel.sandbox.google.com/staging/channel/generator | 3 | h2 / h2 / h2 | 400, no Alt-Svc |

These HEAD diagnostics opened no SDK channel. The staging HEAD lacks WebChannel parameters; its 400 is a connectivity response, not an UnknownSessionID SDK error. [Comparison evidence](host-comparison/result.json).

## Additional checks

Mac QUIC-handshake probes with ALPN h3 succeeded to www.google.com and timed out at about 12.6 s to staging. Explicit IPv4-only probes reproduced that contrast. These are Mac handshake checks, not iPhone h3 test coverage or proof that the staging service is unsupported.

[Automatic-family QUIC result](net-http-quic-probe-20261117.log), [IPv4-only result](net-http-quic-v4-probe-20261117.log), [HTTPS DNS lookup](net-http-h3-dns-20261117.txt).

The first launch attempt was denied because the iPhone was locked. The operator unlocked it; that startup is excluded and contains no request metrics or fault injection. The two SDK preflights and the independent host comparison then completed and cleaned up the demo.

## Earlier blocker (resolved by PR #133 above)

The required WebChannel h3 fault suite and M6 remain pending actual staging h3 adoption. The same iPhone can use h3 for the control host, while the configured staging hostname on UDP 443 still falls back to h2. Confirm the exact h3 endpoint/port and rollout or route for this hostname before counting any h3 variant.

Raw identifying originals remain local under `/private/tmp/net-http-*20261117*`. Published copies replace device IDs/names/hostnames/user-home paths, normalize log line endings/trailing whitespace, and retain network/session measurements. `tool-sources/SHA256SUMS` identifies published copies, including redacted script constants. [Analysis](analysis.json).

## Historical first sequence and readiness pause (subsequently resumed)

T2 run 1 started with a confirmed h3 handshake POST, then applied a 50.005 s
loss hold. It resumed reception in the original session with no SDK channel
error. The retained transaction timeline shows h3 on the initial GET and
first retry, unknown protocols on failed connection attempts, then h2 on
the successful recovery GET and cleanup. This is a mixed-protocol observation,
not a pure h3 trial. The initial strict controller stopped on this fallback;
the completed evidence is retained and not rerun or counted as pure h3.

The next startup had inactive heartbeats and stopped before applying loss.
A new UI helper recognizes only the known cellular-data-off notice and its OK
button, but its first standalone execution failed before test initialization
with a timeout enabling Automation mode. No automatic notice dismissal was
performed. The operator has been asked to check Automation permission and
close the known notice. Further fault trials await that readiness action.

The driver now requires h3 before every fault and records mixed protocol
recovery as an observed outcome rather than relabeling it as pure h3 or
discarding it. Thirty deterministic controller tests pass. Known fallback
remains explicit in per-trial protocol evidence. Native fault state is
verified inactive while waiting.

## Automatic h3-started fault suite: 15 completed sequences

[Per-trial analysis](h3-automatic/h3-summary.md) records three each at T2/T3/T4/T5/T7.
Every sequence verified h3 on the baseline POST before loss, a fresh session,
active hold heartbeats and native active/inactive readbacks. Eight sequences
include h2 recovery/cleanup after an h3 start; seven have no known non-h3
transaction, with unknown failed transactions reported separately. No blanket
pure-h3 coverage or test-case pass is inferred.

- T2: original-session reception resumed in 3/3; all mixed h3-to-h2.
- T3: two resumed with h2 fallback; one ended with SDK error 1 and no known h2.
- T4: all three ended with HTTP 400 / UnknownSessionID, with h2 after the h3 start.
- T5: all three ended with SDK error 1; no known h2 transactions.
- T7: all three ended with SDK error 1; no known h2 transactions.

## H3 suspension and M6 follow-ups

Completed OS-suspension trials are validated incrementally in
[the suspension summary](h3-suspension/summary.md). The 30 s holds recovered the
same session in 3/3; the 90 s holds returned HTTP 400 / SDK error 4 in 3/3.
The 150 s holds also returned HTTP 400 / SDK error 4 in 3/3. All nine trials have baseline h3,
OS-observed suspension throughout the hold, the same process after activation,
and one session ID. No known h2 fallback has appeared in these completed trials.

[The M6 instrumentation report](h3-m6/report.md) records one successful 180 s h3
idle observation and its limits. The iPhone produced no qlog files. Authenticated
client Initial packets expose a complete ClientHello which omits
`max_idle_timeout`; the server value and encrypted 1-RTT PING behavior remain
unknown. M6 is not complete. A separate 30 s diagnostic verified the environment path, directory existence
and successful app write/delete, but produced zero qlog files. A debugger-start
diagnostic also completed with no qlog files. Its actual attach/resume transcript
is retained; neither diagnostic is another M6 repetition.

All three qualified short T9 observations resumed their original sessions
without SDK errors or known h2 fallback. Requested holds were 10 s; observed
offline paths lasted 16.466 / 14.123 / 14.371 s, and restored-path-to-echo intervals were
16.339 / 19.750 / 17.059 s. The restoration cue occurred 10.688 / 10.236 / 10.281 s after the
observed offline path; human operation and reconnection account for the
remaining offline interval, without claiming exact physical switch timestamps.
[Incremental human-operated summary](h3-human/summary.md).

The first attempt is excluded from the requested 10 s group: the cellular-off
notice delayed foreground readiness, the restoration cue occurred at 34.839 s,
and the observed offline interval lasted 39.497 s. It ended with SDK error 1
at 27.159 s after the observed offline path; this longer-outage evidence is
retained under `h3-human/excluded-short-duration`. The operator reported and
closed the notice. The three qualified short trials are complete;
all three 60 s T9 observations ended with SDK error 1 at 35.206 / 35.573 /
22.134 s after the observed offline path. Restoration cues occurred at 60.340 /
60.814 / 60.222 s; observed offline paths lasted 64.963 / 64.665 / 64.712 s.
All six qualified T9 observations have h3 evidence and no known h2 fallback,
with unknown failed transactions explicitly retained. T10–T14 remain pending.

All observations retain actual protocol metrics; mixed h3/h2 recovery is not
relabeled as pure h3 coverage. No source SDK recovery logic was changed.


The operator stopped the RVI tcpdump capture after the short T9 group. The final
local-only raw capture contains 1812 decoded packets (852864 bytes); its hash
and analysis-copy format handling are retained in
[M6 capture provenance](h3-m6/capture-provenance.json).

The first T10 attempt was interrupted while the chat was unavailable under the
usage limit. The operator reported failed switching; the controller timed out
waiting for restored Wi-Fi plus foreground readiness and terminated the app.
The complete attempt is retained under `h3-human/excluded-interrupted-operation`
and does not count toward the three T10 repetitions. A fresh first repetition
is being prepared.

The next T10 startup had no available Wi-Fi/cellular path; the initial POST
returned NSURLErrorDomain -1009 before any fault cue or pending write. The
operator confirmed a setup mistake. It is excluded under
`h3-human/excluded-offline-startup` and does not count as a T10 repetition.

The first qualified T10 repetition completed: a pending write was submitted
2.836 s after the observed offline path; SDK error 1 occurred at 14.785 s
(11.950 s after submission). The restoration cue occurred at 30.521 s; the
observed offline path lasted 37.379 s. No known h2 fallback was recorded; failed
transactions with unknown protocols remain separate. Two more T10 repetitions
are pending.

T10 repetition 2 submitted the pending write 2.589 s after the offline path
and ended with SDK error 1 at 9.829 s (7.240 s after submission). The observed
offline path lasted 34.832 s. No known h2 fallback was recorded; one T10
repetition remains.

T10 repetition 3 submitted the pending write 2.105 s after the offline path
and ended with SDK error 1 at 13.579 s (11.473 s after submission). The observed
offline path lasted 34.706 s. All three qualified repetitions ended with SDK
error 1; each has baseline h3, one session ID and no known h2 fallback. Pending
POST attempts and matching-echo evidence are analyzed separately in the human
summary. T11–T14 remain pending.

The first T11 sequence completed all three cut/restore cycles and resumed the
original session without SDK error. Requested cut holds were 5 s; observed
offline paths lasted 9.371 / 11.702 / 9.378 s. Metrics record both h3 and h2
after the h3 baseline, so this is a mixed-protocol observation, not pure h3
coverage. Two further T11 sequences remain pending.

T11 sequence 2 recorded all three cut/restore cycles but ended with SDK error 1
22.416 s after the first offline path. Observed offline intervals were
9.401 / 9.501 / 9.335 s. No known h2 fallback was recorded; unknown failed
transactions remain explicit. One T11 sequence remains.

T11 sequence 3 completed all cycles and resumed the original session without
SDK error or known h2 fallback. Its observed offline paths lasted
9.259 / 8.751 / 9.286 s. Overall T11 has two original-session recoveries
(one mixed h3/h2) and one SDK error 1. The working-cellular T12/T14 handoff
series and broken-cellular T13 remain pending.

The first working-cellular idle handoff completed both directions and 30 s
of post-restoration observation, with one session, no SDK errors, and 12/12
recorded transactions h3 (no unknowns). OS path callbacks showed Wi-Fi→cellular
only→Wi-Fi, with successful matching probe echoes. However all transaction
metrics retained the initial Wi-Fi IPv6/local port and `isCellular=false`,
including callbacks during the cellular-only path. These cached-looking metric
values do not independently prove physical routing or QUIC migration. A new RVI
capture has been requested for the following handoffs to inspect actual packet
interface metadata.

The second idle handoff was interrupted by an overly strict controller check:
after Wi-Fi returned, NWPathMonitor reported both wifi=true and cellular=true,
which the controller rejected before the restored echo. There was no SDK error
and all six retained transactions were h3. This is retained as partial evidence
under `h3-human/excluded-controller-path-check`, not a completed repetition.
The controller now accepts a satisfied, non-wired path containing Wi-Fi on
return, while still requiring cellular-only path during the cellular hold and
keeping L3-only checks strict. A regression test covers the dual-interface
notification and loss of Wi-Fi; 38 controller/parser tests pass.

The app-PID-filtered RVI record for that partial attempt contains 49 packets on
en0 and 48 on pdp_ip0. Cellular packets use a different local IPv6 address/UDP
port, despite URLSession metrics retaining the initial Wi-Fi address and
`isCellular=false`. This confirms actual cellular packet use and the limitation
of those per-request metric fields; it does not by itself decode QUIC path
validation or identify encrypted PING frames. The live capture remains local.

The next working-cellular startup selected h2 on its initial WebChannel POST
(Alt-Svc still advertised h3); the baseline gate stopped before any countdown
or fault cue. That startup is retained under `h3-human/excluded-baseline-h2`,
not counted as a handoff repetition. A subsequent independent, no-channel
HEAD diagnostic observed target h3 in 3/3 requests and control-host h2 in 3/3.
This confirms current target h3 reachability but does not substitute for SDK
WebChannel h3 or establish the reason that the earlier startup chose h2.

The second qualified idle handoff completed with the updated Wi-Fi-present
check, one session, no SDK errors and 12/12 h3 transactions (zero unknowns).
The observed cellular-path interval was 27.774 s and post-restoration
observation lasted 30.053 s with five additional probes. No SDK implementation
change or app reinstall was involved; only the observer acceptance condition
changed. One idle repetition remains.

All three qualified idle working-cellular handoffs completed both directions
with one session and no SDK errors. Each recorded 12/12 h3 transactions with
zero unknowns/fallback. The third observed cellular-path interval was 28.563 s;
post-restoration observation lasted 30.090 s with five probes. Continuous
streaming handoffs are being prepared to observe delivery across the same
interface changes; T13 remains pending.

The first continuous-streaming handoff completed with the original session,
no SDK errors and 13/13 h3 transactions (zero unknowns). The cellular-path
interval was 25.587 s; post-restoration observation lasted 30.095 s with five
probes. Message delivery gaps/sequence continuity are analyzed from app events
separately; protocol success alone is not a zero-gap claim.

Continuous-streaming handoff 2 also completed with one session, no SDK errors
and 13/13 h3 transactions (zero unknowns). Its cellular-path interval was
28.577 s; post-restoration observation lasted 30.057 s with five probes. One
streaming handoff remains before the cellular-only-loss series.

All three continuous-streaming handoffs completed with the original session,
no SDK errors, and 13/13 h3 transactions each (zero unknowns). The third
cellular-path interval was 31.041 s; post-restoration observation lasted
30.086 s with five probes. Combined idle/streaming handoffs contain 75/75 h3
transactions across six qualified sequences. The operator has been asked to
stop the handoff capture and enable Mobile 100% Loss for the T13 preflight.

The operator stopped the handoff capture and reported 1500 packets captured,
10775 received by filter and 0 dropped by kernel. The finalized local capture
decodes 1500 packets; hash/size/filter and these reported counters are retained
in `h3-human/handoff-capture-provenance.json`. No equivalence between the two
packet counters or absence of loss outside the capture kernel is inferred.

The operator enabled the cellular-only Mobile 100% Loss profile. New
interface-bound probes to the Google APIs endpoint confirmed working Wi-Fi
(HTTP response) and a satisfied cellular-only path timing out at 8.525 s.
This is TCP/TLS HTTP/1.1 reachability setup proof, not h3 test coverage. The
profile is kept enabled by the operator; the native conditioner helper is not
used to replace or clear it. T13 begins with the 50 s requested-hold group.

The first T13 50 s requested hold resumed the original session with no SDK
error. The restoration cue occurred 50.201 s after the broken-cellular path;
that path lasted 62.120 s and the restored-path-to-probe-echo interval was
0.460 s. Metrics include h2 after baseline h3, so this is retained as mixed
protocol rather than pure h3 coverage. The manually selected cellular-only
loss profile remains enabled.

T13 50 s repetition 2 also resumed the original session without SDK error,
with h2 after baseline h3. Its restoration cue was at 50.015 s; the observed
broken-cellular path lasted 56.304 s and restored-path-to-probe-echo interval
was 1.021 s. One 50 s repetition remains.

All three T13 50 s holds resumed their original sessions without SDK errors;
all included h2 after baseline h3. Repetition 3 had its restoration cue at
50.329 s, broken-cellular path interval 63.677 s and restored-path-to-probe-echo
interval 1.491 s. Selective loss is being rechecked before the 90 s group.

The first T13 90 s hold resumed its original session without SDK error, with
h2 after baseline h3 and one unknown transaction. Its restoration cue was
at 90.318 s, observed broken-cellular interval 107.672 s, and restored-path-to-
probe-echo interval 1.008 s. The final handoff capture analysis identifies
pdp_ip0 packets in three of five captured qualified working-cellular trials;
two show only en0 packets for the app PID despite cellular default-path
callbacks. Those two are not described as packet-confirmed cellular transfers,
and no operator-error cause is assigned. The operator is being asked which
Wi-Fi control was used so the method can be reported accurately.

T13 90 s repetition 2 resumed the original session with no SDK error, again
with h2 after baseline h3 and one unknown transaction. Its restoration cue
occurred at 90.192 s; the broken-cellular interval was 102.496 s and restored-
path-to-probe-echo interval was 1.131 s. The operator confirmed use of the
Control Center Wi-Fi button. See `wifi-operation-method.md`: this is recorded
as network disconnect/reconnect, not a Settings radio-off observation. The
method is kept unchanged for the rest of this duration series.

All three 90 s T13 holds resumed their original sessions without SDK errors,
all with h2 after baseline h3 and one unknown transaction each. Repetition 3
had a broken-cellular interval of 103.031 s and restored-path-to-probe-echo
interval 0.943 s. The cellular-only loss is being rechecked before the final
150 s duration group, with the same Control Center operation method.

T13 150 s repetition 1 ended after Wi-Fi restoration with SDK error 4, with
h2 after baseline h3 and two unknown transactions. Its observed broken-
cellular interval was 162.822 s. This is retained as the SDK measurement
outcome, not an operator/infrastructure exclusion. Two 150 s repetitions
remain, with the same manually maintained loss profile and operation method.

T13 150 s repetition 2 also ended after Wi-Fi restoration with SDK error 4,
with h2 after baseline h3 and two unknown transactions. Its observed
broken-cellular interval lasted 157.506 s. Only the final repetition of
this planned series remains, followed by manual conditioner restoration.

All nine T13 observations are now recorded: 50/90 s requested holds resumed
the original sessions in 3/3 each; 150 s holds ended after Wi-Fi restoration
with HTTP 400 / SDK error 4 in 3/3. Repetition 3 had a broken-cellular interval
of 162.069 s. All nine include h2 after baseline h3. The operator has been
asked to disable Mobile 100% Loss and restore both interfaces for a final
reachability check. Required M6 PING/repetition coverage remains incomplete.
