# T11: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 5 s from the observed fault path.
Observed per-cycle intervals are recorded in result.json under cycles.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 369979.7012274167 | 2026-11-17T13:36:22.713Z |
| baselineEcho | 369980.9944190417 | 2026-11-17T13:36:24.006Z |
| offlinePath1 | 369986.2488379584 | 2026-11-17T13:36:29.263Z |
| holdComplete1 | 369991.70174058335 | 2026-11-17T13:36:34.713Z |
| restoredPath1 | 369995.61947670835 | 2026-11-17T13:36:38.631Z |
| offlinePath2 | 370003.759995875 | 2026-11-17T13:36:46.771Z |
| holdComplete2 | 370009.70174708334 | 2026-11-17T13:36:52.713Z |
| restoredPath2 | 370015.4622800417 | 2026-11-17T13:36:58.484Z |
| offlinePath3 | 370024.20114537503 | 2026-11-17T13:37:07.212Z |
| holdComplete3 | 370029.70175554167 | 2026-11-17T13:37:12.712Z |
| restoredPath3 | 370033.57903525 | 2026-11-17T13:37:16.594Z |
| restoredEcho | 370044.584384375 | 2026-11-17T13:37:27.596Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
