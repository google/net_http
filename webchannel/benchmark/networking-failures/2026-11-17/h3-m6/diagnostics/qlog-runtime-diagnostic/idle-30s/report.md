# M1: idle keep-alive and back-channel observation

Outcome: `idle-observed` (observation, not a test-case pass).

Requested idle observation: 30 s; no application sends or fault injection.
Observed idle duration: 30.99996387498686 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| idleStart | 343372.89577658335 | 2026-11-17T06:12:56.339Z |
| idleEnd | 343403.89574045833 | 2026-11-17T06:13:27.338Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
