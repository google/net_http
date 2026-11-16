# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 21.520147833332885 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 371177.46707225003 | 2026-11-17T13:56:20.455Z |
| baselineEcho | 371178.76152450003 | 2026-11-17T13:56:21.748Z |
| cellularPath | 371184.880676125 | 2026-11-17T13:56:27.870Z |
| cellularEcho | 371187.8915517917 | 2026-11-17T13:56:30.879Z |
| holdComplete | 371200.4674440417 | 2026-11-17T13:56:43.455Z |
| restoredPath | 371206.40082395833 | 2026-11-17T13:56:49.387Z |
| restoredEcho | 371206.790964375 | 2026-11-17T13:56:49.778Z |
| postRestoreProbe1 | 371212.2288283334 | 2026-11-17T13:56:55.215Z |
| postRestoreProbe2 | 371217.67840825004 | 2026-11-17T13:57:00.665Z |
| postRestoreProbe3 | 371223.0245130417 | 2026-11-17T13:57:06.011Z |
| postRestoreProbe4 | 371228.3850855834 | 2026-11-17T13:57:11.371Z |
| postRestoreProbe5 | 371233.8393280834 | 2026-11-17T13:57:16.825Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
