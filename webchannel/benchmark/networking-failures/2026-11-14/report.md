# iOS network failure experiments — 2026-11-14

**Network topology clarification:** T1–T8 traversed a Linux box. The operator
subsequently connected the AP directly to the switching hub, bypassing that box.
See the [operator-reported wiring change](../network-topology-note.md) before comparing phases.

[T13 handoff measurements and fault preflight](t13-summary.md): three 50 s
requested holds and three 90 s requested holds resumed the original sessions
after Wi-Fi returned. All three 150 s requested holds ended after restoration
with HTTP 400 / SDK error 4 (UnknownSessionID).

[Full T15 report and nine-trial comparison](suspension-summary.md).

The report includes the OS-state verification method, three preceding method
probes (two failed, one passed), and 30/90/150 s networking measurements at three
repetitions each. All nine holds were OS-observed and retained the original
process. Short holds resumed the session; medium/long holds returned HTTP 400 /
UnknownSessionID after resume. No app reconnect or network setting change was
used. Underlying NSError and exact physical transition timing remain limited.

[Machine-readable results](suspension-analysis.json),
[validation](validation.json), [measurement limits](pending-tests.md).

Each trial directory preserves raw app/UI events, selected process evidence and
measured source copies. Full identifying diagnostics remain local. Published console copies normalize
line endings and trim trailing whitespace; identifying source-script constants
are replaced with TEST placeholders, with hashes for the published copies. These follow-up artifacts are submitted separately from the merged PR #130.
