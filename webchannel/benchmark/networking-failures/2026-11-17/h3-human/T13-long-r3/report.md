# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 150 s from the observed fault path.
Observed broken-cellular interval: 162.06876958336215 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 381631.9037154167 | 2026-11-17T16:50:34.746Z |
| baselineEcho | 381633.18000825 | 2026-11-17T16:50:36.022Z |
| cellularFaultPath | 381638.75997308333 | 2026-11-17T16:50:41.605Z |
| holdComplete | 381788.9039145834 | 2026-11-17T16:53:11.743Z |
| restoredPath | 381800.8287426667 | 2026-11-17T16:53:23.667Z |
| channelTerminal | 381800.92966945836 | 2026-11-17T16:53:23.771Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
