# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 10 s from the observed fault path.
Observed offline interval: 16.466363375016954 s.
Channel observation: echo-resumed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 343876.5155992917 | 2026-11-17T06:21:19.950Z |
| baselineEcho | 343877.8475075417 | 2026-11-17T06:21:21.282Z |
| offlinePath | 343884.8278415417 | 2026-11-17T06:21:28.262Z |
| holdComplete | 343895.51610058337 | 2026-11-17T06:21:38.950Z |
| restoredPath | 343901.2942049167 | 2026-11-17T06:21:44.729Z |
| restoredEcho | 343917.6331730417 | 2026-11-17T06:22:01.068Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
