# T11: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 5 s from the observed fault path.
Observed per-cycle intervals are recorded in result.json under cycles.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 370989.4155729167 | 2026-11-17T13:53:12.407Z |
| baselineEcho | 370990.736214125 | 2026-11-17T13:53:13.727Z |
| offlinePath1 | 370995.9636362084 | 2026-11-17T13:53:18.967Z |
| holdComplete1 | 371001.41515970835 | 2026-11-17T13:53:24.406Z |
| restoredPath1 | 371005.2230715417 | 2026-11-17T13:53:28.213Z |
| offlinePath2 | 371012.451493375 | 2026-11-17T13:53:35.442Z |
| holdComplete2 | 371018.4151741667 | 2026-11-17T13:53:41.406Z |
| restoredPath2 | 371021.20221625 | 2026-11-17T13:53:44.192Z |
| offlinePath3 | 371030.539393 | 2026-11-17T13:53:53.530Z |
| holdComplete3 | 371036.415126 | 2026-11-17T13:53:59.405Z |
| restoredPath3 | 371039.8254810417 | 2026-11-17T13:54:02.815Z |
| restoredEcho | 371043.942585 | 2026-11-17T13:54:06.933Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
