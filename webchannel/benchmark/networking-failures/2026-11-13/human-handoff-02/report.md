# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 26.946928416669834 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 171676.394550625 | 2026-11-13T02:44:13.788Z |
| baselineEcho | 171677.2052345 | 2026-11-13T02:44:14.598Z |
| cellularPath | 171685.58068225 | 2026-11-13T02:44:22.974Z |
| cellularEcho | 171687.31715945835 | 2026-11-13T02:44:24.709Z |
| holdComplete | 171701.58049033335 | 2026-11-13T02:44:38.971Z |
| restoredPath | 171712.52761066667 | 2026-11-13T02:44:49.917Z |
| restoredEcho | 171713.81197291668 | 2026-11-13T02:44:51.204Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
