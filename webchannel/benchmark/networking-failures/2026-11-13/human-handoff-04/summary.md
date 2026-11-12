# Third repeat with spoken cues, 2026-11-13

Outcome: `handoff-observed`; all three matched echo probes received replies.
One channel open, one unique SID, no SDK error callbacks or cleanup errors.

- Requested hold: 15 s.
- Restore cue threshold on device heartbeat: 15.619 s.
- Observed cellular-to-Wi-Fi path interval: 28.556 s.
- Probe RTTs (baseline / cellular / restored): 201.15 / 217.31 / 872.82 ms.
- Transactions: 7; cellular-marked: 4; protocols: h2.

The path interval includes operator response and Wi-Fi association; probe RTTs
are not handoff recovery latencies. Device uptime determines device intervals.
The measured runner snapshots match trials 02 and 03 exactly.

See [three-trial summary](../summary.md) for the inclusion decision, limits and
comparison. Raw logs, lifecycle/task metrics, cue journal and runner snapshots
are retained here. Identifying device snapshots/logs are omitted, and identifying
names/IDs in retained files are replaced with TEST_DEVICE placeholders.
Original output: `/private/tmp/net-http-handoff-20261113-04`.
