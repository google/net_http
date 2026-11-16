# T10: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 30 s from the observed fault path.
Observed offline interval: 34.83191745833028 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 369758.654648 | 2026-11-17T13:32:41.670Z |
| baselineEcho | 369759.9758561667 | 2026-11-17T13:32:42.991Z |
| offlinePath | 369765.33941091667 | 2026-11-17T13:32:48.357Z |
| pendingWrite | 369767.9286859167 | 2026-11-17T13:32:50.945Z |
| holdComplete | 369795.65492291667 | 2026-11-17T13:33:18.670Z |
| restoredPath | 369800.171328375 | 2026-11-17T13:33:23.187Z |
| channelTerminal | 369775.16878187505 | 2026-11-17T13:32:58.184Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
