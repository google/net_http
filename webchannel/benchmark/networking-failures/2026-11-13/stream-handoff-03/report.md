# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 27.933947083336534 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 179488.16331600002 | 2026-11-13T04:54:25.636Z |
| baselineEcho | 179489.87303795834 | 2026-11-13T04:54:27.346Z |
| baselineStream | 179488.7777735 | 2026-11-13T04:54:26.251Z |
| cellularPath | 179496.65975779167 | 2026-11-13T04:54:34.133Z |
| cellularEcho | 179498.86590675 | 2026-11-13T04:54:36.340Z |
| holdComplete | 179512.16355466668 | 2026-11-13T04:54:49.636Z |
| restoredPath | 179524.593704875 | 2026-11-13T04:55:02.067Z |
| restoredEcho | 179526.38383170834 | 2026-11-13T04:55:03.859Z |
| postRestoreProbe1 | 179532.07651204168 | 2026-11-13T04:55:09.549Z |
| postRestoreProbe2 | 179537.80880845836 | 2026-11-13T04:55:15.282Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
