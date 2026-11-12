# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 28.555813333339756 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 171965.90911645835 | 2026-11-13T02:49:03.287Z |
| baselineEcho | 171967.59759929168 | 2026-11-13T02:49:04.975Z |
| cellularPath | 171974.29093875 | 2026-11-13T02:49:11.669Z |
| cellularEcho | 171976.598448 | 2026-11-13T02:49:13.977Z |
| holdComplete | 171989.909485375 | 2026-11-13T02:49:27.286Z |
| restoredPath | 172002.84675208334 | 2026-11-13T02:49:40.223Z |
| restoredEcho | 172004.30372658334 | 2026-11-13T02:49:41.681Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
