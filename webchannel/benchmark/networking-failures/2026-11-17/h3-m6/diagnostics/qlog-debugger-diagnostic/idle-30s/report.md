# M1: idle keep-alive and back-channel observation

Outcome: `interrupted` (observation, not a test-case pass).

Requested idle observation: 30 s; no application sends or fault injection.
Observed idle duration: unavailable s.
Error: Timed out: autorun_start

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
