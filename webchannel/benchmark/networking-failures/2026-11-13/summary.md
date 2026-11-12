# Wi-Fi / cellular handoff: three observations, 2026-11-13

Physical iPhone, fresh demo process/session each trial, USB console, idle
traffic plus one matched echo at baseline, cellular stage and restored Wi-Fi.
Mobile data remained enabled. Requested hold: 15 s from observed cellular path.
Advance chat instructions, local silent 3–2–1 countdown, distinct sounds and
short spoken cut/restore/finish instructions; no intermediate AI action cue.

**All three trials completed with three matched echo replies, one channel open,**
**one unique SID in request logs, no SDK error callbacks and no cleanup errors.**

| Trial | Restore cue threshold (s) | Cellular → Wi-Fi path (s) | Echo RTTs: baseline / cellular / restored (ms) |
| --- | ---: | ---: | --- |
| [02](human-handoff-02/summary.md) | 16.000 | 26.947 | 150.32 / 199.85 / 732.03 |
| [03](human-handoff-03/summary.md) | 15.490 | 25.447 | 251.11 / 181.84 / 698.65 |
| [04](human-handoff-04/summary.md) | 15.619 | 28.556 | 201.15 / 217.31 / 872.82 |

The cellular-to-Wi-Fi path interval includes human response, network association
and callback delivery. It is not network outage time or transport recovery
latency. Echo RTTs are individual probes, not handoff recovery latency.

The two runner source snapshots have identical SHA-256 hashes across all three
trials; all requested holds and cue sequences match. Wired transport was
verified before arming and after recovery for each trial. Completed metrics
include both cellular and non-cellular transactions; all recorded protocols
are h2. A default-path callback does not establish the interface of each probe.

## Inclusion and limits

Trials 02 and 03 originally validated the procedure. After reviewing them,
the operator agreed to include them as measurement repeats and add trial 04.
This is an exploratory three-trial set, not three prospectively selected
independent validation trials. Trial 01 used older guidance and is reference
only; it is excluded from this table. The set establishes observations for
this one handoff condition, not a blanket T9–T15 pass.

Device uptime is used for device intervals; host/device UTC is not subtracted.
Path observations are not physical switch timestamps. Brief lifecycle changes
during manual operations are retained in result.json and structured logs.
No packet capture, full-interface outage or confirmed suspension test occurred.

Each trial directory includes result.json, report.md, structured/console app
logs, the cue journal and measured runner snapshots. Identifying snapshots
and their command logs are omitted from these copies; device names/IDs are
replaced with TEST_DEVICE placeholders. Network/session evidence is retained.
Original output remains locally under /private/tmp/net-http-handoff-20261113-0N.

Machine-readable aggregate: [handoff-analysis.json](handoff-analysis.json).
