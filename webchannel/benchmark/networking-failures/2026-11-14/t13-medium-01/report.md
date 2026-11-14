# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 90 s from the observed fault path.
Observed broken-cellular interval: 103.65967895832728 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 253621.93629795834 | 2026-11-14T01:29:58.137Z |
| baselineEcho | 253623.58761104167 | 2026-11-14T01:29:59.789Z |
| cellularFaultPath | 253629.65904987502 | 2026-11-14T01:30:05.860Z |
| holdComplete | 253719.9362709167 | 2026-11-14T01:31:36.137Z |
| restoredPath | 253733.31872883334 | 2026-11-14T01:31:49.518Z |
| restoredEcho | 253734.62704333334 | 2026-11-14T01:31:50.828Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
