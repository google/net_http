# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 10 s from the observed unsatisfied path.
Observed offline interval: 15.945283291657688 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 172409.63842025 | 2026-11-13T02:56:26.994Z |
| baselineEcho | 172411.30498533335 | 2026-11-13T02:56:28.662Z |
| offlinePath | 172416.69023895834 | 2026-11-13T02:56:34.048Z |
| holdComplete | 172427.6388835 | 2026-11-13T02:56:44.994Z |
| restoredPath | 172432.63552225 | 2026-11-13T02:56:49.991Z |
| restoredEcho | 172450.57079433335 | 2026-11-13T02:57:07.926Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
