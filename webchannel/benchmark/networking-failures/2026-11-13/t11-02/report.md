# T11: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 5 s from the observed unsatisfied path.
Observed per-cycle intervals are recorded in result.json under cycles.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 178313.21983458335 | 2026-11-13T04:34:50.713Z |
| baselineEcho | 178314.92653833335 | 2026-11-13T04:34:52.422Z |
| offlinePath1 | 178320.49622425 | 2026-11-13T04:34:57.990Z |
| holdComplete1 | 178326.22032595833 | 2026-11-13T04:35:03.714Z |
| restoredPath1 | 178330.31717670834 | 2026-11-13T04:35:07.812Z |
| offlinePath2 | 178339.32719658336 | 2026-11-13T04:35:16.821Z |
| holdComplete2 | 178345.22037008335 | 2026-11-13T04:35:22.714Z |
| restoredPath2 | 178348.6764385 | 2026-11-13T04:35:26.172Z |
| offlinePath3 | 178356.46508387502 | 2026-11-13T04:35:33.959Z |
| holdComplete3 | 178362.22033258335 | 2026-11-13T04:35:39.714Z |
| restoredPath3 | 178365.81348129167 | 2026-11-13T04:35:43.308Z |
| channelTerminal | 178346.14452083333 | 2026-11-13T04:35:23.637Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
