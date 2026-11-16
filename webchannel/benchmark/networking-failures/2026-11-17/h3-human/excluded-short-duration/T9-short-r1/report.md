# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 10 s from the observed fault path.
Observed offline interval: 39.49707191664493 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 343705.29240179167 | 2026-11-17T06:18:28.730Z |
| baselineEcho | 343706.5818699584 | 2026-11-17T06:18:30.018Z |
| offlinePath | 343713.45374075003 | 2026-11-17T06:18:36.891Z |
| holdComplete | 343748.2928495 | 2026-11-17T06:19:11.730Z |
| restoredPath | 343752.9508126667 | 2026-11-17T06:19:16.387Z |
| channelTerminal | 343740.6130082917 | 2026-11-17T06:19:04.049Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
