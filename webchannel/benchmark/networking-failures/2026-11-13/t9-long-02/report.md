# T9: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 60 s from the observed unsatisfied path.
Observed offline interval: 66.54206183334463 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 176394.61444370836 | 2026-11-13T04:02:52.083Z |
| baselineEcho | 176396.28209004167 | 2026-11-13T04:02:53.752Z |
| offlinePath | 176402.97266570834 | 2026-11-13T04:03:00.442Z |
| holdComplete | 176463.61498358333 | 2026-11-13T04:04:01.085Z |
| restoredPath | 176469.51472754168 | 2026-11-13T04:04:06.984Z |
| channelTerminal | 176439.61182091667 | 2026-11-13T04:03:37.081Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
