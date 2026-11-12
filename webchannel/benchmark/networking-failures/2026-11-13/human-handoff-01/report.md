# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 41.94226558331866 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 171176.1735655 | 2026-11-13T02:35:53.589Z |
| baselineEcho | 171177.03829854168 | 2026-11-13T02:35:54.454Z |
| cellularPath | 171185.31728133335 | 2026-11-13T02:36:02.731Z |
| cellularEcho | 171186.95873329169 | 2026-11-13T02:36:04.374Z |
| holdComplete | 171201.296173125 | 2026-11-13T02:36:18.711Z |
| restoredPath | 171227.25954691667 | 2026-11-13T02:36:44.672Z |
| restoredEcho | 171228.504236 | 2026-11-13T02:36:45.919Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
