# T10: human-operated network off / on

Outcome: `interrupted` (observation, not a test-case pass).

Requested hold: 30 s from the observed fault path.
Observed offline interval: unavailable s.
Channel observation: unavailable.
Error: Timed out: wifi path + foreground heartbeat

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 346315.9540257084 | 2026-11-17T07:01:59.356Z |
| baselineEcho | 346317.3378694167 | 2026-11-17T07:02:00.739Z |
| offlinePath | 346324.96750883333 | 2026-11-17T07:02:08.369Z |
| pendingWrite | 346330.21069120837 | 2026-11-17T07:02:13.612Z |
| holdComplete | 346355.95430733333 | 2026-11-17T07:02:39.356Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
