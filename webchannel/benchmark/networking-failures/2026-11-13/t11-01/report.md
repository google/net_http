# T11: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 5 s from the observed unsatisfied path.
Observed per-cycle intervals are recorded in result.json under cycles.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 178122.58240433334 | 2026-11-13T04:31:40.073Z |
| baselineEcho | 178124.23924808335 | 2026-11-13T04:31:41.730Z |
| offlinePath1 | 178129.98962254167 | 2026-11-13T04:31:47.483Z |
| holdComplete1 | 178135.58285183334 | 2026-11-13T04:31:53.074Z |
| restoredPath1 | 178139.96491095834 | 2026-11-13T04:31:57.456Z |
| offlinePath2 | 178150.57983683335 | 2026-11-13T04:32:08.072Z |
| holdComplete2 | 178155.582841875 | 2026-11-13T04:32:13.075Z |
| restoredPath2 | 178160.5658305417 | 2026-11-13T04:32:18.057Z |
| offlinePath3 | 178168.26271679168 | 2026-11-13T04:32:25.754Z |
| holdComplete3 | 178173.58284733334 | 2026-11-13T04:32:31.075Z |
| restoredPath3 | 178178.1905284167 | 2026-11-13T04:32:35.683Z |
| restoredEcho | 178180.04095820835 | 2026-11-13T04:32:37.534Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
