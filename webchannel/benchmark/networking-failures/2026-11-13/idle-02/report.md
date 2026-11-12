# M1: idle keep-alive and back-channel observation

Outcome: `idle-observed` (observation, not a test-case pass).

Requested idle observation: 180 s; no application sends or fault injection.
Observed idle duration: 180.99994887501816 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| idleStart | 180219.68798491667 | 2026-11-13T05:06:37.164Z |
| idleEnd | 180400.6879337917 | 2026-11-13T05:09:38.164Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
