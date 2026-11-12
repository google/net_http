# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 27.12025208331761 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 179232.49198066667 | 2026-11-13T04:50:09.963Z |
| baselineEcho | 179234.26133691668 | 2026-11-13T04:50:11.734Z |
| baselineStream | 179232.86279833334 | 2026-11-13T04:50:10.336Z |
| cellularPath | 179241.28244683336 | 2026-11-13T04:50:18.754Z |
| cellularEcho | 179243.12320633334 | 2026-11-13T04:50:20.596Z |
| holdComplete | 179256.4923795 | 2026-11-13T04:50:33.965Z |
| restoredPath | 179268.40269891667 | 2026-11-13T04:50:45.875Z |
| restoredEcho | 179269.47806041667 | 2026-11-13T04:50:46.950Z |
| postRestoreProbe1 | 179275.136051625 | 2026-11-13T04:50:52.608Z |
| postRestoreProbe2 | 179280.93606058334 | 2026-11-13T04:50:58.408Z |
| postRestoreProbe3 | 179286.566255 | 2026-11-13T04:51:04.039Z |
| postRestoreProbe4 | 179292.22689395834 | 2026-11-13T04:51:09.700Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
