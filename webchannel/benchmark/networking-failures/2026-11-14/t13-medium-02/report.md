# T13: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 90 s from the observed fault path.
Observed broken-cellular interval: 104.12870670831762 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 253824.6945685 | 2026-11-14T01:33:20.893Z |
| baselineEcho | 253826.44504625 | 2026-11-14T01:33:22.645Z |
| cellularFaultPath | 253831.5861310417 | 2026-11-14T01:33:27.785Z |
| holdComplete | 253921.69495233335 | 2026-11-14T01:34:57.894Z |
| restoredPath | 253935.71483775 | 2026-11-14T01:35:11.914Z |
| restoredEcho | 253937.3827644167 | 2026-11-14T01:35:13.582Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
