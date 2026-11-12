# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 10 s from the observed unsatisfied path.
Observed offline interval: 15.103620624984615 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 172736.57898358334 | 2026-11-13T03:01:53.918Z |
| baselineEcho | 172738.26483391668 | 2026-11-13T03:01:55.605Z |
| offlinePath | 172744.21201629168 | 2026-11-13T03:02:01.554Z |
| holdComplete | 172754.57952358335 | 2026-11-13T03:02:11.918Z |
| restoredPath | 172759.31563691667 | 2026-11-13T03:02:16.654Z |
| restoredEcho | 172776.91523575 | 2026-11-13T03:02:34.254Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
