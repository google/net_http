# Repeated human-operated handoff, 2026-11-13

A fresh physical-iPhone Wi-Fi → cellular → Wi-Fi observation with advance
instructions, silent countdown and local spoken action cues. Same runner and
15 s requested hold as human-handoff-02. No intermediate AI action instruction.

- Outcome: `handoff-observed`.
- Observed hold at restore cue: 15.490 s.
- Observed cellular path to restored Wi-Fi: 25.447 s,
  including operator response and network association.
- Matched echo RTTs on device uptime (baseline / cellular stage / restored):
  251.11 / 181.84 / 698.65 ms. These are not handoff recovery latencies.
- Channel opens: 1; unique SIDs in request logs: 1;
  SDK error callbacks: [].
- Recorded transactions: 7, including 4
  marked cellular; protocols: h2.
- Wired devicectl transport verified before arming and after recovery.
- Normal cleanup closed the channel and terminated the demo.

Raw structured/console app logs, cue journal, lifecycle/task metrics and measured
runner sources accompany this report. Device intervals use device uptime;
host/device UTC clocks are not subtracted. Path callbacks do not identify
physical switch times or the interface of every individual request. This is
not a blanket T9–T15 pass or a confirmed suspension/packet-capture test.

Original identifying snapshots and logs remain locally in
`/private/tmp/net-http-handoff-20261113-03`. This copy omits device snapshots and
their command logs, replaces identifying names/IDs with TEST_DEVICE placeholders,
and retains network addresses, session IDs, payloads and measurements.
