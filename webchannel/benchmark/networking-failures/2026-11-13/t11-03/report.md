# T11: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 5 s from the observed unsatisfied path.
Observed per-cycle intervals are recorded in result.json under cycles.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 178447.06739716668 | 2026-11-13T04:37:04.539Z |
| baselineEcho | 178448.76688341668 | 2026-11-13T04:37:06.239Z |
| offlinePath1 | 178454.64021475002 | 2026-11-13T04:37:12.112Z |
| holdComplete1 | 178460.067928 | 2026-11-13T04:37:17.538Z |
| restoredPath1 | 178464.68868320834 | 2026-11-13T04:37:22.159Z |
| offlinePath2 | 178472.19196362502 | 2026-11-13T04:37:29.662Z |
| holdComplete2 | 178478.06789154166 | 2026-11-13T04:37:35.538Z |
| restoredPath2 | 178481.76049858335 | 2026-11-13T04:37:39.238Z |
| offlinePath3 | 178491.23015675 | 2026-11-13T04:37:48.700Z |
| holdComplete3 | 178497.06788891667 | 2026-11-13T04:37:54.538Z |
| restoredPath3 | 178501.82657237502 | 2026-11-13T04:37:59.297Z |
| channelTerminal | 178491.4534172917 | 2026-11-13T04:37:48.923Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
