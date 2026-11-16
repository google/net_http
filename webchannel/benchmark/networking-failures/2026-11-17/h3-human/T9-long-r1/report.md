# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 60 s from the observed fault path.
Observed offline interval: 64.96282399998745 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 344661.2030442917 | 2026-11-17T06:34:24.626Z |
| baselineEcho | 344662.48948275 | 2026-11-17T06:34:25.913Z |
| offlinePath | 344667.8633411667 | 2026-11-17T06:34:31.287Z |
| holdComplete | 344728.2035379167 | 2026-11-17T06:35:31.626Z |
| restoredPath | 344732.8261651667 | 2026-11-17T06:35:36.249Z |
| channelTerminal | 344703.0697554167 | 2026-11-17T06:35:06.492Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
