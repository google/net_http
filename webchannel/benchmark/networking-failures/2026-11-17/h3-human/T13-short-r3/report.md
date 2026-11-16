# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 50 s from the observed fault path.
Observed broken-cellular interval: 63.67718754167436 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 374600.54423837503 | 2026-11-17T14:53:23.495Z |
| baselineEcho | 374601.82230912504 | 2026-11-17T14:53:24.774Z |
| cellularFaultPath | 374607.215084875 | 2026-11-17T14:53:30.167Z |
| holdComplete | 374657.54380029166 | 2026-11-17T14:54:20.494Z |
| restoredPath | 374670.8922724167 | 2026-11-17T14:54:33.843Z |
| restoredEcho | 374672.38334287505 | 2026-11-17T14:54:35.333Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
