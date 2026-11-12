# T9: idle network down/up, 2026-11-13

**Three valid trials completed for the requested 10 s hold condition.** Attempt 01
was interrupted after an operator-reported procedure failure and is excluded.
Its cleanup warning (nonzero app terminate command after Ctrl+C) is retained.

Physical iPhone, USB logging, Wi-Fi initially on, mobile data disabled.
Fresh process/session; default failFast off. Baseline echo before fault;
no app sends during the outage; one matched probe after Wi-Fi readiness.
Requested hold: 10 s from observed unsatisfied path. Identical runner hash
for all three valid trials. Spoken cut/restore/finish cues follow advance guidance.

| Valid run (attempt) | Restore cue (s) | First Wi-Fi callback (s) | Ready Wi-Fi (s) | Ready Wi-Fi → echo (s) | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| 1 ([02](t9-attempt-02/result.json)) | 10.949 | 14.519 | 15.945 | 17.935 | echo-resumed |
| 2 ([03](t9-attempt-03/result.json)) | 10.456 | 14.278 | 14.747 | 25.280 | echo-resumed |
| 3 ([04](t9-attempt-04/result.json)) | 10.368 | 14.301 | 15.104 | 17.600 | echo-resumed |

The first three intervals start at the observed unsatisfied path. Wi-Fi
readiness includes a fresh foreground heartbeat, so it can select a later
Wi-Fi callback than the first observed satisfied callback. Offline intervals
include operator response and Wi-Fi association; physical switches were not
independently timed. Device uptime determines intervals, not host/device UTC.

All three valid trials have one channel open, one unique SID in request logs, no
SDK channel error callbacks and no cleanup errors. No application reconnect
was requested. Post-restoration echo responses arrived within the spec's
0–30 s retry-based recovery range, but these intervals include probe/queue/
retry time and do not measure exact transport recovery latency. No blanket
T9 pass is claimed; underlying NSError details are not exposed by SDK callbacks.

Operator report for valid run 1 (attempt 02): the mobile-data-disabled system
dialog appeared at Wi-Fi disconnection and was immediately dismissed with OK.
The report was received after that trial; exact dialog timing was not captured.
Operator report for valid run 2: no such dialog appeared. Run 3 dialog status has not yet been reported.

Full app/console logs, lifecycle/task metrics, cue journals and measured runner
snapshots accompany each attempt. Identifying device snapshots/command logs
are omitted; device names/IDs in retained files use TEST_DEVICE placeholders.
Network/session measurements are retained. Original outputs remain locally
in `/private/tmp/net-http-t9-20261113-0N`.

[Machine-readable aggregate](t9-analysis.json).
