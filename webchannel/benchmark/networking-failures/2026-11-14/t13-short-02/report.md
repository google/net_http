# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 50 s from the observed fault path.
Observed broken-cellular interval: 63.53911574999802 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 253184.96898325003 | 2026-11-14T01:22:41.172Z |
| baselineEcho | 253186.6336695 | 2026-11-14T01:22:42.838Z |
| cellularFaultPath | 253191.98930183335 | 2026-11-14T01:22:48.192Z |
| holdComplete | 253242.969496 | 2026-11-14T01:23:39.173Z |
| restoredPath | 253255.52841758335 | 2026-11-14T01:23:51.731Z |
| restoredEcho | 253256.59170429167 | 2026-11-14T01:23:52.795Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
