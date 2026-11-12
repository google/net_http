# Streaming Wi-Fi / cellular handoff, run 1, 2026-11-13

New variant: 1 s nominal server stream, requested 15 s cellular hold, then
30 s extra observation after restored Wi-Fi readiness/echo. Fresh session;
Wi-Fi and mobile data enabled initially. Only Wi-Fi was requested to switch.
This trial is separate from the earlier three idle handoff observations.

Outcome: handoff-observed; SDK error callbacks []; opens 1.
Parsed stream frames: 62; app deliveries: 62.
Observed wire-array-ID gaps: []; duplicates: 0; unparsed back-channel body records: 0.
Largest interval between logged stream frames: 1.505 s (not physical outage duration).

| Probe POST RID | Request relative to ready Wi-Fi (s) | isCellular | reusedConnection | Protocol |
| --- | ---: | --- | --- | --- |
| 50842 | -27.853 | False | True | h2 |
| 50843 | -18.892 | True | True | h2 |
| 50844 | 1.191 | True | True | h2 |
| 50845 | 6.989 | True | True | h2 |

Negative times are baseline/cellular-stage probes; positive times are after
the restored-Wi-Fi milestone. RID joins to completed task metrics were unique.
Task metrics again report cellular use for the positive-time probes.

About 9.901 s after the ready-Wi-Fi milestone, the default path reports
wifi=true AND cellular=true, with expensive=true. This is a mixed interface
flag observation, not proof of Wi-Fi radio shutdown, a failed manual operation,
or the cause of cellular selection. Only one extra periodic probe was sent:
the runner only sends probes while its strict Wi-Fi-only path predicate holds,
so further probes were suppressed after that mixed update. Passive stream
observation continued for 30.069 host-monotonic seconds.
This limits conclusions about later forward-request behavior.

Receipt intervals use device uptime and raw HTTP body logger events. They
include server scheduling, device scheduling and delivery effects. Raw app
delivery/lifecycle and path evidence remain separate. No packet capture or
underlying NSError trace was obtained. No exact physical outage or automatic
T12 pass is claimed. Operator reports affirm correct earlier Wi-Fi operations
and no Cellular-button operation; no operator-error cause is established.

See analysis.json, stream-intervals.json, transport-metrics.json and raw logs.
Measured runner snapshots and SHA-256 hashes are retained. Identifying device
snapshots/command logs are omitted; names/IDs use TEST_DEVICE placeholders.
Original output: `/private/tmp/net-http-stream-handoff-20261113-01`.

One valid repetition of this new variant; two more needed for three repeats.

Subsequent operator report for this trial: Wi-Fi was reliably disconnected.
