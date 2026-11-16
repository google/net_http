# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 28.576800791721325 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 373300.4211662917 | 2026-11-17T14:31:43.391Z |
| baselineEcho | 373301.7034751667 | 2026-11-17T14:31:44.672Z |
| baselineStream | 373300.6185256667 | 2026-11-17T14:31:43.587Z |
| cellularPath | 373308.7698222083 | 2026-11-17T14:31:51.739Z |
| cellularEcho | 373309.8081876667 | 2026-11-17T14:31:52.777Z |
| holdComplete | 373324.4213937917 | 2026-11-17T14:32:07.390Z |
| restoredPath | 373337.34662300005 | 2026-11-17T14:32:20.315Z |
| restoredEcho | 373337.75279683335 | 2026-11-17T14:32:20.720Z |
| postRestoreProbe1 | 373343.0728515 | 2026-11-17T14:32:26.041Z |
| postRestoreProbe2 | 373348.46906566666 | 2026-11-17T14:32:31.441Z |
| postRestoreProbe3 | 373353.8158982917 | 2026-11-17T14:32:36.784Z |
| postRestoreProbe4 | 373359.25922708336 | 2026-11-17T14:32:42.228Z |
| postRestoreProbe5 | 373364.6241581667 | 2026-11-17T14:32:47.592Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
