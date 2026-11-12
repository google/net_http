# M1: idle keep-alive and back-channel observation

Outcome: `idle-observed` (observation, not a test-case pass).

Requested idle observation: 180 s; no application sends or fault injection.
Observed idle duration: 180.00000450000516 s.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| idleStart | 179811.25369408334 | 2026-11-13T04:59:48.728Z |
| idleEnd | 179991.25369858334 | 2026-11-13T05:02:48.728Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
