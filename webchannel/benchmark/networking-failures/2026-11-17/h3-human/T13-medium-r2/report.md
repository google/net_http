# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 90 s from the observed fault path.
Observed broken-cellular interval: 102.49572266667383 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 375210.456606875 | 2026-11-17T15:03:33.399Z |
| baselineEcho | 375211.34041245835 | 2026-11-17T15:03:34.283Z |
| cellularFaultPath | 375217.86679629167 | 2026-11-17T15:03:40.809Z |
| holdComplete | 375308.05853570835 | 2026-11-17T15:05:10.999Z |
| restoredPath | 375320.36251895834 | 2026-11-17T15:05:23.303Z |
| restoredEcho | 375321.49396320834 | 2026-11-17T15:05:24.435Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
