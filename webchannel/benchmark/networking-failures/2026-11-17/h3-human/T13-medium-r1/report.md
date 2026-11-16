# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 90 s from the observed fault path.
Observed broken-cellular interval: 107.67184108332731 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 374808.39636425005 | 2026-11-17T14:56:51.344Z |
| baselineEcho | 374809.6856079167 | 2026-11-17T14:56:52.634Z |
| cellularFaultPath | 374815.0790445417 | 2026-11-17T14:56:58.036Z |
| holdComplete | 374905.396752875 | 2026-11-17T14:58:28.343Z |
| restoredPath | 374922.750885625 | 2026-11-17T14:58:45.698Z |
| restoredEcho | 374923.758814 | 2026-11-17T14:58:46.704Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
