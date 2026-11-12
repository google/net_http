# M1: undisturbed idle baseline, 2026-11-13

3 independent fresh-process/session observations, 180 s requested each.
Physical iPhone, USB logging, failFast off. No app probes, streaming, pending
writes or fault injection. Channels are closed and apps terminated normally
after each observation. Runner snapshots have identical SHA-256 hashes.

| Session | Device duration (s) | K (ms) | Within-GET noop intervals (s) | GET start intervals (s) | Cellular / transactions |
| --- | ---: | ---: | --- | --- | --- |
| [1](idle-01/result.json) | 180.000 | 30000 | 30.029, 29.798, 30.004, 29.860, 30.004 | 60.175, 60.001, 60.007 | 0 / 6 |
| [2](idle-02/result.json) | 181.000 | 30000 | 30.045, 29.799, 30.005, 29.862, 30.003 | 60.198, 60.001, 60.004 | 0 / 6 |
| [3](idle-03/result.json) | 181.000 | 30000 | 30.081, 29.697, 30.008, 29.860, 30.007 | 60.238, 60.000, 60.010 | 2 / 6 |

Every session's detailed analysis preserves channel errors, app-send count,
request attempt numbers, path updates, parsed array-ID continuity and task
metrics. See idle-analysis.json and each analysis.json for exact values.

A new GET can receive an immediate noop soon after the previous GET's last
noop. Global intervals therefore include short gaps and are not blindly
averaged as a keep-alive period. Within-GET intervals associate each noop
with the most recently logged GET start; raw event order is retained.

GET start intervals are logged rotations, not watchdog timeouts. Incoming
noops refresh the nominal 45 s watchdog, so roughly 60 s rotation intervals
do not independently measure or disprove that timeout. Exact intervals
slightly above the spec's approximate 45–60 s range are reported unchanged.
Device uptime determines intervals; no host/device UTC subtraction or
physical packet timing is claimed. Passive idle observations do not test
failure recovery or establish exact server-side timing.

Raw console/structured events, runner journal, task metrics and measured
runner snapshots are retained per session. Identifying device snapshots/
command logs are omitted; names/IDs use TEST_DEVICE placeholders.
Originals remain locally under `/private/tmp/net-http-idle-20261113-0N`.

[Machine-readable aggregate](idle-analysis.json). This analysis script is
preserved as analyze-idle.py in this directory.

All three sessions completed with one channel open, no SDK error or cleanup
error, no app sends, and no observed array-ID gaps/duplicates. Handshake K was
30000 ms in all three. Within-GET noop intervals range 29.697–30.081 s;
GET start intervals range 60.000–60.238 s. All recorded transactions
report h2. Cellular-marked transaction counts were 0, 0 and 2 respectively;
therefore the baseline must not be described as exclusively Wi-Fi in all
three sessions. Identical source snapshots were verified.
