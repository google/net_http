# T10: human-operated network off / on

Outcome: `l3-observed` (observation, not a test-case pass).

Requested hold: 30 s from the observed unsatisfied path.
Observed offline interval: 34.53889100000379 s.
Channel observation: channel-failed.
Error: none

| Milestone | Device uptime (s) | Host receipt UTC |
| --- | --- | --- |
| baselinePath | 176963.10102133334 | 2026-11-13T04:12:20.575Z |
| baselineEcho | 176964.8244995 | 2026-11-13T04:12:22.300Z |
| offlinePath | 176970.067495625 | 2026-11-13T04:12:27.542Z |
| pendingWrite | 176972.5646377917 | 2026-11-13T04:12:30.039Z |
| holdComplete | 177000.10174483334 | 2026-11-13T04:12:57.576Z |
| restoredPath | 177004.606386625 | 2026-11-13T04:13:02.080Z |
| channelTerminal | 176986.24521745834 | 2026-11-13T04:12:43.719Z |

- Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.
- Path callbacks describe observed routing, not physical switch timestamps.
- Cue times are host times; human response is measured, not assumed instantaneous.
- No SDK test-case pass/fail or real OS suspension is inferred.

See result.json for lifecycle, errors and task metrics; device-events.jsonl and
device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.
Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.
Human setting changes are never automatically reverted. Restore settings manually.
