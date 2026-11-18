# HTTP/3 networking-failure observations

The corrected Google APIs endpoint negotiates h3 for real WebChannel traffic.
Working-cellular handoffs completed without SDK errors; loss/recovery sequences
frequently fell back to h2. Results retain protocol mixtures and failed requests
with unknown protocols. They are observations, not a blanket specification pass.
Fifty-one qualified sequences began with measured h3; 18 later include h2.
M6's encrypted PING cadence remains unmeasured.

Subsequent [November 18 qlog observations](../2026-11-18/h3-m6-qlog/report.md)
resolve that M6 frame-visibility blocker and report three 180 s runs. The M6
limitations below describe this earlier series.

The series spans November 17–18, 2026 in JST. Raw event timestamps use UTC and
record device uptime separately. The directory names identify the series start.

## Endpoint and environment

[PR #133](https://github.com/google/net_http/pull/133) identifies
`https://webchannel.googleapis.com/staging/channel/generator` as the h3 endpoint.
The old sandbox hostname remains a separate h2-only endpoint. A fresh positive
preflight recorded h3 on all four WebChannel transactions. Earlier sandbox
retries are retained, not interpreted as failures of the corrected endpoint.
[Positive preflight](googleapis-preflight/result.json),
[legacy-host analysis](analysis.json).

The device is an iPhone SE (3rd generation), iOS 27.2.1; builds use Xcode 27.2 on
macOS 27.2.1. The AP is directly connected to the switching hub, bypassing the
Linux box. The historical T1–T8 series traversed that box; see
[the topology note](../network-topology-note.md). Earlier experiments also used a
different Xcode version. Endpoint/front-door and toolchain differences prevent a
clean forced-h2 versus forced-h3 A/B comparison.

Only opted-in demo instrumentation/controllers changed; SDK recovery code did
not. `assumesHTTP3Capable` enables h3 discovery/racing, not a forced-only mode.
Every qualified fault sequence requires a measured h3 baseline POST before the
fault. Subsequent h2 fallback is retained, not erased or counted as pure h3.
Unknown failed transaction protocols are never treated as h3 evidence.

## Automatic loss sequences

Fifteen fresh-session observations, three each at T2/T3/T4/T5/T7, verified native
condition enable/disable readbacks and active app heartbeats throughout holds.
Eight contain h2 after the h3 baseline; seven have no known non-h3 transaction,
with unknown failed transactions reported explicitly.

| Case | Observations |
| --- | --- |
| T2, 50 s | 3/3 original-session receive resumed; all mixed h3/h2 |
| T3, 90 s | Two resumed with h2 fallback; one SDK error 1 without known h2 |
| T4, 150 s | 3/3 HTTP 400 / UnknownSessionID; mixed h3/h2 |
| T5, 250 s | 3/3 SDK error 1 before release; no known h2 |
| T7, pending write | 3/3 SDK error 1; no known h2 |

[Per-trial analysis and timing limits](h3-automatic/h3-summary.md).

## OS-observed suspension

Nine T15 observations used a separate XCUI observer, not process termination,
debugger pause, or simulated suspension. Every hold has suspended OS-state
samples, the same app PID after activation, one session ID and baseline h3.
No known h2 fallback was recorded; unknown transactions remain explicit.

- 30 s: original-session echo resumed in 3/3.
- 90 s and 150 s: HTTP 400 / SDK error 4 after resume in 3/3 each.

[OS-state validation and GET ages](h3-suspension/summary.md).
GET ages bracket observations; they do not identify an exact server expiry.

## Human-operated network changes

The operator confirmed use of the **Control Center Wi-Fi button**. This is
reported as disconnect/reconnect, not proof of a Settings radio-off operation.
Apple documents that distinction; it is not assigned as the cause of a particular
packet/interface observation. [Operation method and source](wifi-operation-method.md).

| Case | Qualified observations |
| --- | --- |
| T9, requested 10 s | 3/3 original-session recovery; observed offline paths 14.123–16.466 s, restored-path-to-probe echoes 16.339–19.750 s |
| T9, requested 60 s | 3/3 SDK error 1 at 22.134–35.573 s after the offline callback |
| T10, pending write | 3/3 SDK error 1 at 9.829–14.785 s after the offline callback; initial POST plus two retries, no matching pending-write echo |
| T11, three cycles | Two original-session recoveries (one mixed h3/h2); one SDK error 1 at 22.416 s after the first offline callback |
| T12/T14, idle and streaming | Six same-session continuations, no SDK errors; 75/75 recorded transactions h3, zero unknowns |
| T13, cellular-only loss | 50/90 s: 3/3 same-session recovery each. 150 s: 3/3 HTTP 400 / SDK error 4 after restoration. All nine mixed h3/h2. |

[Human-operated analysis](h3-human/summary.md) preserves each actual interval,
SDK outcome, POST attempt and protocol classification. Requested holds time the
restoration cue; operator response and reconnection add to the observed interval.

Streaming trials delivered 65/68/71 parsed stream frames and the same app-message
counts. No parsed wire-array-ID gaps or duplicates appeared; no body records
were unparsed. Largest logged stream intervals were 1.241/1.186/1.141 s.
These include server/device scheduling and are not exact physical outages.

T13 uses the operator-maintained Mobile 100% Loss profile (cellular only,
100% both directions). Interface-bound probes before each duration group
verified responsive Wi-Fi and available-but-unresponsive cellular to the new
endpoint. These TCP/TLS HTTP/1.1 probes establish reachability setup, not h3
coverage or continuously measured packet loss. The host never replaces/clears
this manual profile with the native condition helper.

## Packet path versus URLSession metrics

The final handoff capture contains 1500 packets; the operator reported 10775
received by filter and **0 kernel drops**. Raw captures stay local; hash, size,
filter and counters are retained in [capture provenance](h3-human/handoff-capture-provenance.json).
The first qualified idle handoff preceded capture. Of five captured qualified
handoffs, three contain app-owned `pdp_ip0` packets and two contain only `en0`
packets despite cellular default-path callbacks. No operator-error cause is
inferred, and those two are not called packet-confirmed cellular transfers.

Where cellular packets are present, their local address/port differ from Wi-Fi,
yet task metrics retain the initial Wi-Fi endpoint and `isCellular=false`.
Keep operator action, default path, task metrics and packet interfaces distinct.
Connection reuse and packet changes are consistent with h3 migration, but no
encrypted QUIC PATH/PING frames are decoded and no exact physical switch time
is claimed. [PID-joined packet analysis](h3-human/handoff-packet-summary.md).

## M6: partial result, not completed coverage

One 180 s idle observation completed with one session, no SDK errors and six h3
transactions. Its authenticated client Initials reassemble a complete
ClientHello that **omits max_idle_timeout**. The client default is zero; this
alone does not establish the server value or disable a server-advertised timeout.

The iPhone generated no qlog files. Separate diagnostics verified the runtime
environment, directory existence and successful app write/delete. A successful
LLDB-attached/resumed diagnostic also produced no qlog. Mac-only qlog successes
are not iPhone evidence. Public Initial secrets cannot decode 1-RTT PING frames.
M6 cadence and the required repetitions remain incomplete; decrypted client or
server frame evidence is needed. [M6 evidence and limits](h3-m6/report.md).

## Direct path and expiry follow-ups

The [November 16 follow-up](../2026-11-16/report.md) separately adds three direct-AP
T5 observations and nine OS-suspended 45/60/75 s observations. All nine shorter
suspensions resumed the original session. Together with earlier 90 s failures,
GET-age observations provide a rough bracket, not an exact TTL. These h2 results
remain distinct from the corrected-endpoint h3 cohort.

## Exclusions, provenance and verification

Unexpected SDK failures and h2 fallback are retained as outcomes. Excluded
attempts are separately labeled: an overlong requested-short cut during a
notice, failed operation while chat was unavailable, offline startup, h2 baseline
before fault, and an overly strict Wi-Fi-return controller check. The latter
rejected a legitimate notification with both Wi-Fi/cellular flags; the corrected
observer accepts a satisfied non-wired path containing Wi-Fi, while retaining
cellular-only hold and strict L3-only guards. The partial trace remains available.
Independent HEAD/probe diagnostics are never counted as WebChannel repetitions.

Raw originals remain local. Exported logs redact hardware UDID/CoreDevice ID,
serial/ECID, device names/hostnames and user-home paths, while retaining
network/session measurements. Measured app/controller snapshots have SHA256SUMS;
source revisions are separated where the controller changed. Controller/parser
unit tests and the RFC 9001 authenticated Initial vector were checked. Trial
analyzers verify baseline protocol, session/PID/state evidence and protocol
mixtures. See [validation state](validation.json) and linked per-trial analyses.

## Restoration and cleanup

The initial restoration confirmation was retracted by the operator; its probe
still showed a cellular timeout and is retained as an unconfirmed diagnostic.
After the operator actually disabled Mobile 100% Loss, a fresh interface-bound
check received HTTP responses over both Wi-Fi (0.108 s) and cellular (0.531 s).
These HEAD requests open no SDK channel. The HTTP 400 responses indicate
reachability to the unparameterized endpoint, not an SDK session failure.
[Confirmed restoration](restoration/confirmed/result.json).

The test app was terminated, the native induced-condition readback shows all
condition groups inactive, the test RVI interface was removed successfully,
and the known test caffeinate process was terminated. Both tcpdump captures
were already stopped by the operator. No further phone operation is required.
[Cleanup evidence](restoration/cleanup/native-final-state.jsonl).

[Chronological progress notes](progress-notes.md) retain the development and
readiness history; completed outcomes and current limitations are summarized
above. Required M6 coverage remains incomplete and no blanket h3-suite pass is
claimed.
