# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 20.5984306250175 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 178915.93021795835 | 2026-11-13T04:44:53.402Z |
| baselineEcho | 178917.56635425 | 2026-11-13T04:44:55.038Z |
| baselineStream | 178916.3030036667 | 2026-11-13T04:44:53.774Z |
| cellularPath | 178924.65256391666 | 2026-11-13T04:45:02.124Z |
| cellularEcho | 178926.544093375 | 2026-11-13T04:45:04.015Z |
| holdComplete | 178939.93052408335 | 2026-11-13T04:45:17.402Z |
| restoredPath | 178945.25099454168 | 2026-11-13T04:45:22.722Z |
| restoredEcho | 178946.67983683335 | 2026-11-13T04:45:24.152Z |
| postRestoreProbe1 | 178952.44789079166 | 2026-11-13T04:45:29.920Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
