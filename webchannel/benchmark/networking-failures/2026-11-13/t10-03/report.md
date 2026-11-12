# T10: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 30 s from the observed unsatisfied path.
Observed offline interval: 35.74888875000761 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 177898.61787750002 | 2026-11-13T04:27:56.107Z |
| baselineEcho | 177900.26508070834 | 2026-11-13T04:27:57.754Z |
| offlinePath | 177906.87074533335 | 2026-11-13T04:28:04.376Z |
| pendingWrite | 177909.03566779167 | 2026-11-13T04:28:06.525Z |
| holdComplete | 177937.618449375 | 2026-11-13T04:28:35.107Z |
| restoredPath | 177942.61963408336 | 2026-11-13T04:28:40.110Z |
| channelTerminal | 177920.57848237501 | 2026-11-13T04:28:18.066Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
