# P3: T12 handoff using the Settings Wi-Fi switch

One optional follow-up requested by [PR #138](https://github.com/google/net_http/pull/138).
The operator confirmed using **Settings → Wi-Fi OFF → ON**, not Control Center,
and restoring Wi-Fi and cellular data to ON afterward. NLC was disabled. The
same physical iPhone SE (3rd generation), iOS 27.2.1, and unchanged SDK were used.

During these Settings operations, the operator discovered association with
the NEC Aterm WX3000HP2 in the adjacent room, rather than the intended nearby
Buffalo WSR-3200AX4S-BK. Per-phase AP identity was not logged, so a fixed AP
before/after toggling is not established. The Linux box was confirmed bypassed.
See the [AP-selection and wiring correction](../../network-topology-note.md#ap-selection-correction-operator-report-2026-11-24).

## Result

The Wi-Fi → cellular → Wi-Fi default-path sequence completed with one WebChannel
open event, no SDK errors and **12/12 completed transactions h3** (no unknown or
fallback protocol). Cellular-path echo took 0.700 s after that path callback;
restored-Wi-Fi-path echo took 0.493 s. These are callback-to-echo intervals,
not physical switch-to-recovery times.

The restore cue was issued 15.178 s after the cellular callback (requested 15 s).
The observed cellular default-path interval lasted 28.102 s, including the
operator's response and reconnection time. After restored echo, another 30.099 s
of host observation completed with five successful probes. The only transport
error logged was the explicit shutdown's GTMSessionFetcher cancellation -7.

## RVI packet evidence

| Interface | App/server packets | Outgoing | Incoming | Outgoing QUIC Initial packets |
| --- | ---: | ---: | ---: | ---: |
| en0 (Wi-Fi) | 61 | 31 | 30 | 4 |
| pdp_ip0 (cellular) | 105 | 52 | 53 | 0 |

All 166 filtered records are QUIC packets owned by this trial's app PID and
addressed to/from the endpoint recorded by its task metrics. They establish
actual bidirectional cellular packet use in this Settings-switch trial.
The capture's 4029 packet records match the operator's captured count; reported
statistics were 4599 received by filter and **0 dropped by kernel**. Those
statistics do not prove that no packet was lost elsewhere.

All 12 task metrics nevertheless report isCellular=false and retain the initial
Wi-Fi local endpoint. RVI instead records a different source address/port on
pdp_ip0. Seventy-six pdp_ip0 packets are timestamped after the restored-Wi-Fi
path callback; no subsequent en0 app packets appear in this filtered capture.
Default-path changes therefore must be reported separately from the observed
interface of this established connection's packets.

The recorded h3 reuse, cellular traffic and absence of a new cellular Initial
are consistent with connection migration, but encrypted QUIC PATH frames were
not decoded and no exact physical switch time is claimed. This successful
Settings run does not establish why two earlier Control Center runs showed
only en0 packets, nor that Control Center was necessarily their cause.

## Provenance and cleanup

[Summary](summary.json), [packet analysis](packet-analysis.json),
[app-only packet log](rvi-packet-interfaces.log), [app events](device-events.jsonl),
[runner result](result.json), [tool provenance](tool-provenance.json).
The [offline analyzer](../analyze-p3-packets.py) checks pcapng block lengths and
counts, selects the app PID, and restricts the exported metadata to task-metric
server addresses. The original capture remains local; other apps' packets are
not exported. Its observed 24-byte classic-pcap prefix is omitted only in an
analysis copy; the original SHA-256 is retained.

The test app was terminated, the matching tcpdump received SIGINT and exited,
and the trial's RVI interface was removed successfully. The operator confirmed
that both radios are ON. No SDK recovery code or endpoint was changed.
