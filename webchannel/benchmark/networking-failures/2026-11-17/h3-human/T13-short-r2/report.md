# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 50 s from the observed fault path.
Observed broken-cellular interval: 56.304429458337836 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 374125.8793262084 | 2026-11-17T14:45:28.836Z |
| baselineEcho | 374127.17818470835 | 2026-11-17T14:45:30.136Z |
| cellularFaultPath | 374132.86509875004 | 2026-11-17T14:45:35.823Z |
| holdComplete | 374182.8796555417 | 2026-11-17T14:46:25.836Z |
| restoredPath | 374189.1695282084 | 2026-11-17T14:46:32.126Z |
| restoredEcho | 374190.1904199167 | 2026-11-17T14:46:33.146Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
