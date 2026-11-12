# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 10 s from the observed unsatisfied path.
Observed offline interval: 14.747383333335165 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 172575.398471625 | 2026-11-13T02:59:12.746Z |
| baselineEcho | 172577.1863471667 | 2026-11-13T02:59:14.535Z |
| offlinePath | 172582.94240829168 | 2026-11-13T02:59:20.290Z |
| holdComplete | 172593.39796591667 | 2026-11-13T02:59:30.745Z |
| restoredPath | 172597.68979162502 | 2026-11-13T02:59:35.037Z |
| restoredEcho | 172622.96936904168 | 2026-11-13T03:00:00.316Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
