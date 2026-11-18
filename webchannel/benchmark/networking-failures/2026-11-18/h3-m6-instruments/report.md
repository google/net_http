# M6: Instruments capability observations (2026-11-18)

Subsequent work successfully collected iPhone qlog and completed three 180 s
observations; see the [session-invalidation follow-up](../h3-m6-qlog/report.md).
The partial results below describe the earlier investigation.

Instruments can expose iPhone QUIC keepalive configuration, transmission and
acknowledgement through the `os_log` instrument. This is useful new evidence,
but it does not yet provide an explicitly decoded PING frame or complete M6.

The physical iPhone SE (3rd generation), iOS 27.2.1, ran diagnostic build E of
the existing demo against `webchannel.googleapis.com/staging/channel/generator`.
Xcode 27.2's `xctrace` launched the app directly with the Network template plus
`os_log`. The two 70 s captures also added `stdout/stderr`,
`CFNETWORK_DIAGNOSTICS=3` and the prepared `QUIC_LOG_DIRECTORY`.
`NETTEST_TRAFFIC=idle` requested no application sends. Server noops remained
present. No network fault or interface switch was introduced.

An initial attempt to attach Instruments to a devicectl-launched PID failed
before recording and is excluded. Direct Instruments launch succeeded.

## Observations

Times are relative to the start of each trace, in seconds. The extracted,
identifier-redacted records are in [observations.json](observations.json).

| Requested duration | Keepalive sends | Corresponding ACKs | Send-to-send interval |
| --- | --- | --- | --- |
| 30 s | 21.546 | 21.595 | Not measurable from one send |
| 70 s, extended | 21.322, 51.276 | 21.366, 51.312 | 29.954 s |
| 70 s, repeat | 21.179, 51.195 | 21.217, 51.234 | 30.015 s |

All three captures log `started keep-alive timer for application (20 seconds)`.
Actual transmission is logged by `quic_conn_keepalive_handler` as
`sending keep-alive frame (application)`, followed by
`quic_conn_keepalive_acked`. The configured 20 s timer must not be reported as a
20 s periodic send cadence. In the longer captures, server noops arrive at
approximately 1, 31 and 61 s; the sends near 21 and 51 s occur about 20 s after
the preceding noop. That timing is consistent with traffic-dependent keepalive
scheduling, but does not prove the timer's internal reset rules.

The completed POST and first GET in both longer captures have `h3` task metrics;
Instruments also labels them HTTP/3. The final in-flight GET has incomplete
protocol metadata at recording termination and is not counted as h3 evidence.
Each longer capture reports `NSURLErrorDomain -1017` around 61 s, followed by a
new GET and another noop. No cause is assigned to that error. These are
capability diagnostics, not three successful, error-free M6 repetitions.

Both longer captures confirm the qlog environment path exists and is writable,
but copying the directory yields zero qlog files. Adding Instruments and
CFNetwork diagnostics therefore did not solve iPhone qlog generation here.

## Interpretation and remaining work

RFC 9000 describes PING as one mechanism for deferring idle timeout, but the
observed Apple log wording does not itself name the frame type. This report
therefore claims observed **QUIC keepalive send/ACK events**, not decoded PINGs.
[QUIC idle timeout and PING](https://www.rfc-editor.org/rfc/rfc9000.html#section-10.1.2).

The prior authenticated ClientHello analysis still establishes that the client
omits `max_idle_timeout` (default zero). These Instruments records do not add
transport parameters or establish the effective timeout. M6 remains incomplete
until the required PING/frame evidence and valid repetitions are obtained.

Original `.trace` bundles and XML exports remain local under `/private/tmp`;
they are not added to the repository. The app was absent from the device process
list after the final capture. No RVI or packet capture was started for this
experiment. No third-party library was installed.
