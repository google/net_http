# T10: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 30 s from the observed fault path.
Observed offline interval: 34.70564449997619 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 369859.35568225 | 2026-11-17T13:34:22.371Z |
| baselineEcho | 369860.67180887505 | 2026-11-17T13:34:23.685Z |
| offlinePath | 369866.5064664167 | 2026-11-17T13:34:29.520Z |
| pendingWrite | 369868.6116674584 | 2026-11-17T13:34:31.625Z |
| holdComplete | 369897.35611650004 | 2026-11-17T13:35:00.370Z |
| restoredPath | 369901.2121109167 | 2026-11-17T13:35:04.226Z |
| channelTerminal | 369880.0851515417 | 2026-11-17T13:34:43.099Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
