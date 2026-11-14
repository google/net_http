# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 90 s from the observed fault path.
Observed broken-cellular interval: 107.99753195833182 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 254020.04491725002 | 2026-11-14T01:36:36.243Z |
| baselineEcho | 254021.72900495835 | 2026-11-14T01:36:37.928Z |
| cellularFaultPath | 254028.49040670836 | 2026-11-14T01:36:44.688Z |
| holdComplete | 254119.0452255417 | 2026-11-14T01:38:15.242Z |
| restoredPath | 254136.4879386667 | 2026-11-14T01:38:32.686Z |
| restoredEcho | 254137.6813336667 | 2026-11-14T01:38:33.879Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
