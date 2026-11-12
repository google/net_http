# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 60 s from the observed unsatisfied path.
Observed offline interval: 64.88746458335663 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 176554.40936870835 | 2026-11-13T04:05:31.879Z |
| baselineEcho | 176556.131189625 | 2026-11-13T04:05:33.602Z |
| offlinePath | 176561.81721783333 | 2026-11-13T04:05:39.288Z |
| holdComplete | 176622.409969125 | 2026-11-13T04:06:39.881Z |
| restoredPath | 176626.7046824167 | 2026-11-13T04:06:44.176Z |
| channelTerminal | 176602.49678379166 | 2026-11-13T04:06:19.967Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
