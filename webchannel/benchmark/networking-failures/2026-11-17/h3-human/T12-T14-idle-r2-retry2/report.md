# Human-operated Wi-Fi / cellular handoff

Outcome: `handoff-observed` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 27.77370850002626 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 372212.6220715417 | 2026-11-17T14:13:35.596Z |
| baselineEcho | 372213.9890185 | 2026-11-17T14:13:36.963Z |
| cellularPath | 372220.00537183334 | 2026-11-17T14:13:42.990Z |
| cellularEcho | 372223.01353316667 | 2026-11-17T14:13:45.988Z |
| holdComplete | 372235.62249745836 | 2026-11-17T14:13:58.596Z |
| restoredPath | 372247.77908033336 | 2026-11-17T14:14:10.753Z |
| restoredEcho | 372249.1173963334 | 2026-11-17T14:14:12.092Z |
| postRestoreProbe1 | 372254.6423041667 | 2026-11-17T14:14:17.617Z |
| postRestoreProbe2 | 372260.41498845833 | 2026-11-17T14:14:23.389Z |
| postRestoreProbe3 | 372266.15390204167 | 2026-11-17T14:14:29.128Z |
| postRestoreProbe4 | 372271.81584341667 | 2026-11-17T14:14:34.790Z |
| postRestoreProbe5 | 372277.5446975 | 2026-11-17T14:14:40.517Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
