# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 10 s from the observed fault path.
Observed offline interval: 14.123244833317585 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 344010.9854725417 | 2026-11-17T06:23:34.418Z |
| baselineEcho | 344012.26214320835 | 2026-11-17T06:23:35.694Z |
| offlinePath | 344018.7499531667 | 2026-11-17T06:23:42.188Z |
| holdComplete | 344028.9859691667 | 2026-11-17T06:23:52.418Z |
| restoredPath | 344032.873198 | 2026-11-17T06:23:56.305Z |
| restoredEcho | 344052.622704125 | 2026-11-17T06:24:16.055Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
