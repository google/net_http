# T9: human-operated network off / on

Outcome: `interrupted` (observation, not a test-case pass).

Requested hold: 10 s from the observed unsatisfied path.
Observed offline interval: unavailable s.
Channel observation: unavailable.
Error: KeyboardInterrupt

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 172340.12326516668 | 2026-11-13T02:55:17.483Z |
| baselineEcho | 172341.76919508335 | 2026-11-13T02:55:19.128Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
