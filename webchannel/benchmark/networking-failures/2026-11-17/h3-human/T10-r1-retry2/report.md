# T10: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 30 s from the observed fault path.
Observed offline interval: 37.37861824996071 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 369654.849680125 | 2026-11-17T13:30:57.868Z |
| baselineEcho | 369656.180339 | 2026-11-17T13:30:59.198Z |
| offlinePath | 369662.32871195837 | 2026-11-17T13:31:05.349Z |
| pendingWrite | 369665.1644346667 | 2026-11-17T13:31:08.182Z |
| holdComplete | 369692.8500973334 | 2026-11-17T13:31:35.867Z |
| restoredPath | 369699.70733020833 | 2026-11-17T13:31:42.727Z |
| channelTerminal | 369677.114057375 | 2026-11-17T13:31:20.132Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
