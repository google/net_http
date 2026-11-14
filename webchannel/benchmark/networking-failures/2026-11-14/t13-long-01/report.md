# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 150 s from the observed fault path.
Observed broken-cellular interval: 162.0667943333392 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 254216.24870425003 | 2026-11-14T01:39:52.444Z |
| baselineEcho | 254218.03475083335 | 2026-11-14T01:39:54.232Z |
| cellularFaultPath | 254224.09142625 | 2026-11-14T01:40:00.288Z |
| holdComplete | 254374.2492675 | 2026-11-14T01:42:30.457Z |
| restoredPath | 254386.15822058334 | 2026-11-14T01:42:42.354Z |
| channelTerminal | 254388.78664766668 | 2026-11-14T01:42:44.982Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
