# T10: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 30 s from the observed unsatisfied path.
Observed offline interval: 35.762160041660536 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 176797.04033258333 | 2026-11-13T04:09:34.513Z |
| baselineEcho | 176798.72310691667 | 2026-11-13T04:09:36.196Z |
| offlinePath | 176804.11469408334 | 2026-11-13T04:09:41.588Z |
| pendingWrite | 176806.57102 | 2026-11-13T04:09:44.043Z |
| holdComplete | 176835.04091025 | 2026-11-13T04:10:12.514Z |
| restoredPath | 176839.876854125 | 2026-11-13T04:10:17.354Z |
| channelTerminal | 176813.31398604167 | 2026-11-13T04:09:50.786Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
