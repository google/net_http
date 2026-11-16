# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 60 s from the observed fault path.
Observed offline interval: 64.71205166669097 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 345219.4589985 | 2026-11-17T06:43:42.874Z |
| baselineEcho | 345220.75306025 | 2026-11-17T06:43:44.168Z |
| offlinePath | 345227.2377034167 | 2026-11-17T06:43:50.654Z |
| holdComplete | 345287.459641375 | 2026-11-17T06:44:50.874Z |
| restoredPath | 345291.94975508336 | 2026-11-17T06:44:55.364Z |
| channelTerminal | 345249.37175833335 | 2026-11-17T06:44:12.786Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
