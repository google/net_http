# Human-operated Wi-Fi → cellular → Wi-Fi, 2026-11-13

One fresh-session trial with the USB-connected physical iPhone, using the
interactive `tools/run-handoff.py` runner and protocol-2 demo instrumentation.
This is a handoff observation, not a blanket T9–T15 pass.

- Outcome: `handoff-observed`; all three matched echo probes received replies.
- Requested cellular hold: 15 s from the device's observed cellular path.
- Restore cue threshold observed on device heartbeat: 15.979 s after that path.
- Observed cellular path to restored Wi-Fi path: 41.942 s, including human
  response and Wi-Fi reassociation; not a 15 s physical disconnection claim.
- Echo RTTs measured on device uptime: baseline 306.66 ms, cellular-stage
  236.89 ms, restored-Wi-Fi stage 747.95 ms. These are per-probe RTTs, not
  interface-handoff recovery latencies.
- One channel open, one unique SID in request logs, no SDK error callbacks.
  No application reconnect was requested.
- Task metrics include both `isCellular=true` and `false`; all eight recorded
  transactions report h2. NWPathMonitor alone does not assign each request to
  an interface, and metrics on long-lived/reused connections need correlation.
- Lifecycle events show brief inactive periods around the manual operations;
  the cellular hold guard did not observe an inactive/background interval.
- Wired devicectl transport was verified before arming and after recovery.
- Normal cleanup closed the channel and terminated the demo.

`result.json` contains milestones, lifecycle and task metrics. The full
structured/console app evidence and runner cue journal accompany this report.
Device uptime determines device intervals; host/device UTC clocks are not
subtracted. Callback timing is not physical switch timing. No packet capture
or confirmed suspension was performed.

Original output, including identifying device snapshots, remains locally at
`/private/tmp/net-http-handoff-20261113-01`. This copy omits those snapshots and
their corresponding devicectl logs; device identifiers/names in included files
are replaced with TEST_DEVICE placeholders. Network addresses, session IDs,
payloads, timestamps and measurements remain as evidence.
