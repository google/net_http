# T11: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 5 s from the observed fault path.
Observed per-cycle intervals are recorded in result.json under cycles.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 370222.56664537505 | 2026-11-17T13:40:25.574Z |
| baselineEcho | 370223.8723330417 | 2026-11-17T13:40:26.880Z |
| offlinePath1 | 370229.2024325834 | 2026-11-17T13:40:32.210Z |
| holdComplete1 | 370234.5671472084 | 2026-11-17T13:40:37.574Z |
| restoredPath1 | 370238.60352812504 | 2026-11-17T13:40:41.610Z |
| offlinePath2 | 370248.0759912084 | 2026-11-17T13:40:51.083Z |
| holdComplete2 | 370253.56710575003 | 2026-11-17T13:40:56.575Z |
| restoredPath2 | 370257.57716829167 | 2026-11-17T13:41:00.583Z |
| offlinePath3 | 370265.8320084167 | 2026-11-17T13:41:08.838Z |
| holdComplete3 | 370271.56716104166 | 2026-11-17T13:41:14.573Z |
| restoredPath3 | 370275.1671735417 | 2026-11-17T13:41:18.173Z |
| channelTerminal | 370251.61850570835 | 2026-11-17T13:40:54.624Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
