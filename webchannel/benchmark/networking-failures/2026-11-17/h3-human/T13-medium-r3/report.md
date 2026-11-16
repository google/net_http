# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 90 s from the observed fault path.
Observed broken-cellular interval: 103.0305848333519 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 375966.53505712503 | 2026-11-17T15:16:09.467Z |
| baselineEcho | 375967.88725233334 | 2026-11-17T15:16:10.819Z |
| cellularFaultPath | 375973.95566770836 | 2026-11-17T15:16:16.889Z |
| holdComplete | 376064.53501316666 | 2026-11-17T15:17:47.466Z |
| restoredPath | 376076.9862525417 | 2026-11-17T15:17:59.917Z |
| restoredEcho | 376077.9293621667 | 2026-11-17T15:18:00.860Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
