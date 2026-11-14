# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 50 s from the observed fault path.
Observed broken-cellular interval: 59.86978270832333 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 252951.99272758336 | 2026-11-14T01:18:48.198Z |
| baselineEcho | 252953.77759150002 | 2026-11-14T01:18:49.983Z |
| cellularFaultPath | 252959.72281391668 | 2026-11-14T01:18:55.927Z |
| holdComplete | 253009.99312158333 | 2026-11-14T01:19:46.198Z |
| restoredPath | 253019.592596625 | 2026-11-14T01:19:55.797Z |
| restoredEcho | 253020.66178995834 | 2026-11-14T01:19:56.866Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
