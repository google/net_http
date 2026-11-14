# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 150 s from the observed fault path.
Observed broken-cellular interval: 162.84555374999763 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 254744.4667760417 | 2026-11-14T01:48:40.616Z |
| baselineEcho | 254746.133451125 | 2026-11-14T01:48:42.283Z |
| cellularFaultPath | 254752.31722258334 | 2026-11-14T01:48:48.466Z |
| holdComplete | 254902.46682220834 | 2026-11-14T01:51:18.613Z |
| restoredPath | 254915.16277633334 | 2026-11-14T01:51:31.308Z |
| channelTerminal | 254916.15102945836 | 2026-11-14T01:51:32.296Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
