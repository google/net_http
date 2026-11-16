# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 60 s from the observed fault path.
Observed offline interval: 64.66528787498828 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 345097.89116525004 | 2026-11-17T06:41:41.308Z |
| baselineEcho | 345099.1702246667 | 2026-11-17T06:41:42.588Z |
| offlinePath | 345105.078153125 | 2026-11-17T06:41:48.496Z |
| holdComplete | 345165.89175508334 | 2026-11-17T06:42:49.308Z |
| restoredPath | 345169.743441 | 2026-11-17T06:42:53.160Z |
| channelTerminal | 345140.6513957917 | 2026-11-17T06:42:24.068Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
