# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 50 s from the observed fault path.
Observed broken-cellular interval: 66.3735617499915 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 253398.549272625 | 2026-11-14T01:26:14.751Z |
| baselineEcho | 253400.34711270835 | 2026-11-14T01:26:16.550Z |
| cellularFaultPath | 253405.52748045835 | 2026-11-14T01:26:21.731Z |
| holdComplete | 253455.54950766667 | 2026-11-14T01:27:11.751Z |
| restoredPath | 253471.90104220834 | 2026-11-14T01:27:28.103Z |
| restoredEcho | 253473.15368850002 | 2026-11-14T01:27:29.354Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
