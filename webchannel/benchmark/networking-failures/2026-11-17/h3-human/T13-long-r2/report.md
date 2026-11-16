# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 150 s from the observed fault path.
Observed broken-cellular interval: 157.50610658334335 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 381401.70682404167 | 2026-11-17T16:46:44.553Z |
| baselineEcho | 381402.564514375 | 2026-11-17T16:46:45.411Z |
| cellularFaultPath | 381408.0695212917 | 2026-11-17T16:46:50.922Z |
| holdComplete | 381558.1982247084 | 2026-11-17T16:49:21.041Z |
| restoredPath | 381565.57562787505 | 2026-11-17T16:49:28.419Z |
| channelTerminal | 381566.5713609167 | 2026-11-17T16:49:29.415Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
