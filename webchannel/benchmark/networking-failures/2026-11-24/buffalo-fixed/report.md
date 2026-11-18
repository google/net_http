# Buffalo-fixed priority repeats

The selected priority repeats are complete: six 180 s M6 observations and six
streaming Wi-Fi/cellular handoffs. Measurements started November 24 JST;
final operator confirmation and reporting continued November 25. No SDK
networking/recovery implementation was changed.

The operator selected Buffalo WSR-3200AX4S-BK **5 GHz**, forgot the NEC network,
disabled other potential auto-join networks, and kept NLC OFF. The Linux box
remained bypassed. The Buffalo path includes LSW6-GT-8NS and central
LSW5-GT-8EP/WH, then RTX-830 / GE-ONU / docomo Hikari IPoE. AP, band and forget
state are operator-confirmed; SSID/BSSID was not recorded automatically.
See the [historical topology correction](../../network-topology-note.md#ap-selection-correction-operator-report-2026-11-24).

## M6

[Six qualified M6 runs](m6-report.md), three cellular-data OFF and three ON,
completed with 36/36 task transactions h3, no SDK errors, no application sends,
and 48 positive wired/connected checks. Seven complete native qlogs were
verified: six primary traces and one separate short auxiliary trace.

Neither condition reproduced sustained approximately 1 s PINGs. Primary traces
mostly show roughly 30 s post-setup spacing; irregular/extra PINGs remain in
the evidence. Local max_idle_timeout=0 and remote=240000 ms in every primary
trace. The first GET's peer RESET_STREAM/STOP_SENDING 0x101 with 63 unique
response bytes still occurred in all six. Its cause remains unknown.

The initial batch without USB is excluded in full, including its completed
first observation. Replacement runs verify wired transport before launch,
every 30 s and before collection. See [validation](m6-validation.json).

## Streaming handoffs, three h2 and three h3

The operator used **Settings → Wi-Fi OFF/ON**, with cellular data ON throughout.
The controller requested 15 s from the observed cellular path before the
restore cue, then 30 s observation after Wi-Fi returned. Each trial required a
positive measured POST baseline matching its intended protocol before any cue.
Order: h2-r1, h3-r1, h3-r2, h2-r2, h2-r3, h3-r3.

| Trial | Completed task transactions | Logged stream messages | Maximum logged interval, s | Maximum entirely-active interval, s | App/server packets en0 / pdp_ip0 |
| --- | ---: | ---: | ---: | ---: | ---: |
| h2-r1 | 14 h2 | 65 | 1.750 | 1.055 | 215 / 157 |
| h2-r2 | 14 h2 | 63 | 1.697 | 1.097 | 212 / 153 |
| h2-r3 | 14 h2 | 60 | 3.548 | 1.089 | 198 / 161 |
| h3-r1 | 13 h3 | 62 | 1.205 | 1.083 | 248 / 75 |
| h3-r2 | 13 h3 | 64 | 1.191 | 1.126 | 260 / 74 |
| h3-r3 | 13 h3 | 61 | 1.112 | 1.112 | 234 / 70 |

All six retained one channel open and one observed SID, no SDK error, and five
successful post-restore echo probes. All 81 completed task transactions matched
the intended protocol; no unknown or fallback protocol was recorded. All 375
parsed stream messages reached the app. Within each parsed array-ID range,
there were no missing or duplicate IDs and no unparsed response bodies.
The scheduled stream is intentionally stopped at trial end; its unobserved
tail is not classified as loss.

Full logged intervals include Settings-induced backgrounding, app scheduling
and server timing. The 3.548 s h2-r3 interval crosses a non-active period;
its largest interval classified entirely active is 1.089 s. These are callback
intervals, not exact network outage durations or a statistically isolated
h2/h3 performance comparison. Path-to-echo timings and lifecycle events are
retained in [the complete analysis](handoff-analysis.json).

### Packet/interface evidence

One RVI capture spans all six trials. Filtering by each trial app PID and
task-metric remote addresses confirms traffic on both en0 and pdp_ip0 in every
trial. The h3 captures contain outgoing QUIC Initial packets on en0 at startup
and none on pdp_ip0. This is consistent with reuse/migration of the QUIC
connection onto cellular, but encrypted PATH_CHALLENGE/PATH_RESPONSE frames
were not decoded and connection-ID continuity was not established here.

In the three h3 trials, packets at or after the Wi-Fi-restored path callback
are exclusively en0 (167, 174, 152 packets). This differs from the earlier P3
trial's continued pdp_ip0 traffic. All 39 h3 task metrics still report
isCellular=false, despite observed pdp_ip0 packets. Thus these metrics alone
do not identify the actual interface used during a migrated connection.

The h2 trials show TCP SYNs on both interfaces and subsequent traffic on both;
after the restored-path callback there are respectively en0/pdp_ip0 counts of
132/65, 131/67 and 119/79. This establishes interface use, without attributing
each encrypted packet to a particular HTTP request or inferring QUIC-style
migration for TCP. Each h2 trial has two task metrics reporting cellular=true.

The operator's terminal footer reports 3413 captured / 6730 received by filter /
0 kernel drops; 3413 matches the validated packet records. These counters do
not measure end-to-end network loss. Apple RVI's unsupported-promiscuous-mode
warning did not prevent PKTAP capture. The original file remains local, with
SHA-256 e8dd8a9ede30e144e6fc4dcac58b94cb989aa3aa08ddd1792eb10e1cba948706.
Only app/server-filtered packet text and metadata are published in
[per-trial evidence](handoffs/); encrypted payloads and the full capture remain local.

## Interpretation and limits

These fixed-AP repeats support the recorded protocol, interface, stream
continuity and PING observations under the stated conditions. They do not
identify which AP earlier trials used, prove that the earlier AP caused any
behavior, or invalidate all earlier measurements. The OFF/ON M6 groups were
consecutive, and human operation of Settings changes app lifecycle state.

The h2 endpoint is webchannel.sandbox.google.com; h3 uses
webchannel.googleapis.com, both with /staging/channel/generator. The hosts
differ, so host/backend and time/order effects remain possible. This series
selects the streaming handoff variant; it does not repeat every idle variant,
flapping condition, blackhole duration or expiry threshold.

All 18 handoff preflight/armed/final transport checks were wired/connected.
Source snapshots and raw-artifact hashes accompany the
[validation](handoff-validation.json). The five previously recorded M6 source
hashes still match. The run-handoff.py hash is a post-series snapshot rather
than a contemporaneous per-run record.

All measured handoff app PIDs are absent after cleanup. Capture was stopped,
RVI was removed successfully, and the operator confirmed all six Settings
operations, Buffalo 5 GHz restoration, NEC forgotten, Wi-Fi/cellular ON and
NLC OFF. See [final confirmation](operator-final-confirmation.json).
