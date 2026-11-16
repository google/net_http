# Human-operated Wi-Fi / cellular handoff

Outcome: `interrupted` (observation, not a test-case pass).

Requested hold: 15 s from the observed cellular path.
Observed interval to Wi-Fi restoration: 20.518825791659765 s.
Error: Unexpected path during hold; trial interrupted

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 371505.5795071667 | 2026-11-17T14:01:48.560Z |
| baselineEcho | 371506.8985310417 | 2026-11-17T14:01:49.879Z |
| cellularPath | 371513.57933208335 | 2026-11-17T14:01:56.560Z |
| cellularEcho | 371514.9431525 | 2026-11-17T14:01:57.924Z |
| holdComplete | 371528.5795315 | 2026-11-17T14:02:11.560Z |
| restoredPath | 371534.098157875 | 2026-11-17T14:02:17.079Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
