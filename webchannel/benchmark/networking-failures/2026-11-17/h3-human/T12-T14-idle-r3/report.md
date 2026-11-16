# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 28.56298604165204 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 372373.39958458336 | 2026-11-17T14:16:16.370Z |
| baselineEcho | 372374.7024108333 | 2026-11-17T14:16:17.673Z |
| cellularPath | 372381.5212695 | 2026-11-17T14:16:24.492Z |
| cellularEcho | 372382.7838716667 | 2026-11-17T14:16:25.756Z |
| holdComplete | 372397.40013125003 | 2026-11-17T14:16:40.370Z |
| restoredPath | 372410.0842555417 | 2026-11-17T14:16:53.055Z |
| restoredEcho | 372410.69636320835 | 2026-11-17T14:16:53.666Z |
| postRestoreProbe1 | 372416.1471001667 | 2026-11-17T14:16:59.117Z |
| postRestoreProbe2 | 372421.59650387504 | 2026-11-17T14:17:04.566Z |
| postRestoreProbe3 | 372427.06233595836 | 2026-11-17T14:17:10.032Z |
| postRestoreProbe4 | 372432.39099233336 | 2026-11-17T14:17:15.361Z |
| postRestoreProbe5 | 372437.74568958336 | 2026-11-17T14:17:20.716Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
