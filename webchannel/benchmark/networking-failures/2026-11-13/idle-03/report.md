# M1: idle keep-alive and back-channel observation

Outcome: `idle-observed` (observation, not a test-case pass).

Requested idle observation: 180 s; no application sends or fault injection.
Observed idle duration: 180.99994845833862 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| idleStart | 180408.29481091668 | 2026-11-13T05:09:45.772Z |
| idleEnd | 180589.294759375 | 2026-11-13T05:12:46.735Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
