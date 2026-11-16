# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 25.58660754171433 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 372804.7320915 | 2026-11-17T14:23:27.695Z |
| baselineEcho | 372806.09991370834 | 2026-11-17T14:23:29.063Z |
| baselineStream | 372805.58270770835 | 2026-11-17T14:23:28.546Z |
| cellularPath | 372813.831017875 | 2026-11-17T14:23:36.795Z |
| cellularEcho | 372815.135277875 | 2026-11-17T14:23:38.099Z |
| holdComplete | 372829.73243720835 | 2026-11-17T14:23:52.696Z |
| restoredPath | 372839.4176254167 | 2026-11-17T14:24:02.381Z |
| restoredEcho | 372840.00474475004 | 2026-11-17T14:24:02.968Z |
| postRestoreProbe1 | 372845.48064741667 | 2026-11-17T14:24:08.444Z |
| postRestoreProbe2 | 372850.92147475004 | 2026-11-17T14:24:13.884Z |
| postRestoreProbe3 | 372856.23456783337 | 2026-11-17T14:24:19.198Z |
| postRestoreProbe4 | 372861.6118190417 | 2026-11-17T14:24:24.575Z |
| postRestoreProbe5 | 372866.96368745837 | 2026-11-17T14:24:29.926Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
