# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 10 s from the observed fault path.
Observed offline interval: 14.371431750012562 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 344495.2528582084 | 2026-11-17T06:31:38.678Z |
| baselineEcho | 344496.58277383336 | 2026-11-17T06:31:40.008Z |
| offlinePath | 344501.9729831667 | 2026-11-17T06:31:45.400Z |
| holdComplete | 344512.2535044167 | 2026-11-17T06:31:55.679Z |
| restoredPath | 344516.3444149167 | 2026-11-17T06:31:59.770Z |
| restoredEcho | 344533.40326683334 | 2026-11-17T06:32:16.831Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
