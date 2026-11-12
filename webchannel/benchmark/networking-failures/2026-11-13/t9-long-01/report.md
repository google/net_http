# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 60 s from the observed unsatisfied path.
Observed offline interval: 64.92390887497459 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 176186.5748467917 | 2026-11-13T03:59:23.973Z |
| baselineEcho | 176188.21686816667 | 2026-11-13T03:59:25.615Z |
| offlinePath | 176193.70769187502 | 2026-11-13T03:59:31.106Z |
| holdComplete | 176254.57507129168 | 2026-11-13T04:00:31.972Z |
| restoredPath | 176258.63160075 | 2026-11-13T04:00:36.029Z |
| channelTerminal | 176212.14501129166 | 2026-11-13T03:59:49.544Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
