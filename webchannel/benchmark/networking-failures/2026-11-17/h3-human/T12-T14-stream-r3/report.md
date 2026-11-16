# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 31.04065450001508 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 373443.1245425 | 2026-11-17T14:34:06.092Z |
| baselineEcho | 373444.41803604166 | 2026-11-17T14:34:07.385Z |
| baselineStream | 373443.3680252917 | 2026-11-17T14:34:06.334Z |
| cellularPath | 373451.5792596667 | 2026-11-17T14:34:14.546Z |
| cellularEcho | 373452.4976300417 | 2026-11-17T14:34:15.465Z |
| holdComplete | 373467.12501429167 | 2026-11-17T14:34:30.092Z |
| restoredPath | 373482.6199141667 | 2026-11-17T14:34:45.587Z |
| restoredEcho | 373483.52504275 | 2026-11-17T14:34:46.492Z |
| postRestoreProbe1 | 373488.9115624167 | 2026-11-17T14:34:51.878Z |
| postRestoreProbe2 | 373494.3721619167 | 2026-11-17T14:34:57.339Z |
| postRestoreProbe3 | 373499.81209766667 | 2026-11-17T14:35:02.779Z |
| postRestoreProbe4 | 373505.1909475417 | 2026-11-17T14:35:08.158Z |
| postRestoreProbe5 | 373510.55053625 | 2026-11-17T14:35:13.515Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
