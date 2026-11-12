# T9: longer idle network outage, 2026-11-13

**3 valid repetitions; 0 further repetitions required for the requested 60 s condition.**

Physical iPhone, wired devicectl transport verified before arming and after
restoration. Mobile data disabled; Wi-Fi initially on. Fresh demo process and
session, failFast off. Baseline echo completes before fault; no app sends
during outage. Advance instructions and local spoken cut/restore/finish cues.
Runner source hashes match across repetitions.

| Run | Error after unsatisfied path (s) | Restore cue (s) | First Wi-Fi callback (s) | Foreground-ready Wi-Fi (s) | SDK error |
| --- | ---: | ---: | ---: | ---: | --- |
| [1](t9-long-01/result.json) | 18.437 | 60.867 | 64.136 | 64.924 | [1] |
| [2](t9-long-02/result.json) | 36.639 | 60.642 | 64.859 | 66.542 | [1] |
| [3](t9-long-03/result.json) | 40.680 | 60.593 | 64.248 | 64.887 | [1] |

Current observations: channel-failed; no application reconnect or post-error
probe was requested. Each run has one channel open and one unique request
SID. No cleanup error was recorded. The observed error intervals are within
the PR #128 T9 prediction of about 15–45 s after L3 down. The requested-10 s
condition had three same-session recoveries; see [t9-summary.md](t9-summary.md).

All intervals in the table start at the device unsatisfied-path callback.
They use device uptime, not host/device UTC subtraction. Path callbacks are
not physical switch timestamps. Wi-Fi readiness includes an active heartbeat
and can select a later callback than the first satisfied Wi-Fi update.
No packet capture or underlying NSError trace was obtained.

## Operator reports

- Run 1: Operator reported after valid long-outage run 1 that the mobile-data-disabled dialog appeared. Dismissal timing was not explicitly reported.
- Run 2: Dialog presence/dismissal has not yet been reported.
- Run 3: Dialog presence/dismissal has not yet been reported.

Lifecycle/task metrics, full console/structured logs, cue journals and measured
runner snapshots accompany each run. Identifying device snapshots/command
logs are omitted; device names/IDs are replaced with TEST_DEVICE placeholders.
Network/session evidence remains. Original output is retained locally under
`/private/tmp/net-http-t9-long-20261113-0N`.

[Machine-readable aggregate](t9-long-analysis.json).
