# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 25.446546791645233 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 171811.48625100002 | 2026-11-13T02:46:28.871Z |
| baselineEcho | 171813.26293358335 | 2026-11-13T02:46:30.650Z |
| cellularPath | 171819.99709400002 | 2026-11-13T02:46:37.382Z |
| cellularEcho | 171821.15518341667 | 2026-11-13T02:46:38.541Z |
| holdComplete | 171835.4867539167 | 2026-11-13T02:46:52.872Z |
| restoredPath | 171845.44364079167 | 2026-11-13T02:47:02.827Z |
| restoredEcho | 171846.6898175 | 2026-11-13T02:47:04.073Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
