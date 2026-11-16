# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 50 s from the observed fault path.
Observed broken-cellular interval: 62.12000804167474 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 373957.4392539167 | 2026-11-17T14:42:40.399Z |
| baselineEcho | 373958.801821 | 2026-11-17T14:42:41.761Z |
| cellularFaultPath | 373964.23794458335 | 2026-11-17T14:42:47.198Z |
| holdComplete | 374014.43896608334 | 2026-11-17T14:43:37.398Z |
| restoredPath | 374026.357952625 | 2026-11-17T14:43:49.317Z |
| restoredEcho | 374026.8183319584 | 2026-11-17T14:43:49.777Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
