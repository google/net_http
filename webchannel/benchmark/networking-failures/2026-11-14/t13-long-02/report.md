# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 150 s from the observed fault path.
Observed broken-cellular interval: 158.3376719999942 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 254472.8154027917 | 2026-11-14T01:44:09.010Z |
| baselineEcho | 254474.57031641668 | 2026-11-14T01:44:10.764Z |
| cellularFaultPath | 254479.81729704168 | 2026-11-14T01:44:16.013Z |
| holdComplete | 254630.81570612502 | 2026-11-14T01:46:47.009Z |
| restoredPath | 254638.15496904167 | 2026-11-14T01:46:54.349Z |
| channelTerminal | 254639.089775375 | 2026-11-14T01:46:55.284Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
