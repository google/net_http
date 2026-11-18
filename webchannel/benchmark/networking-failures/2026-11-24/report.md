# PR #138 follow-ups: P1–P3

The required P1 analysis and both optional observations requested by
[PR #138](https://github.com/google/net_http/pull/138) are now recorded.
No SDK recovery logic or endpoint was changed.

## Environment correction: AP selection was not controlled

While operating Wi-Fi in Settings for these follow-ups, the operator found
the iPhone connected to the NEC Aterm WX3000HP2 in the adjacent room, rather
than the intended nearby Buffalo WSR-3200AX4S-BK. The NEC network had not been
forgotten as the operator had believed. Per-trial SSID/BSSID was not recorded,
so the AP used by each prior run or each handoff phase cannot be reconstructed.

The intended Buffalo path is WSR-3200AX4S-BK → LSW6-GT-8NS → central
LSW5-GT-8EP/WH; the NEC path is WX3000HP2 → central LSW5-GT-8EP/WH. Both
continue through YAMAHA RTX-830 → GE-ONU → docomo Hikari via IPoE.
The operator reconfirmed that the Linux box was bypassed. “Direct AP” in
earlier reports must not be read as proof of a fixed AP or wired-switch count.

The NEC path has fewer wired switches, but also a different AP and placement.
The operator initially expected little latency impact; that expectation was not measured.
The recorded frame/packet observations remain, while AP-controlled timing and
causal comparisons are limited. See the [full topology correction](../network-topology-note.md#ap-selection-correction-operator-report-2026-11-24).

The subsequent [six-trial LAN ICMP comparison](ap-latency/report.md) records
larger per-trial medians/tails and 5.0% missing echo replies on the deployed
NEC path versus 0% on Buffalo. This does not identify past AP associations or
measure the effect on the original WebChannel results; phone response behavior
and radio/placement differences remain part of that comparison.

The subsequent [Buffalo-fixed priority repeats](buffalo-fixed/report.md) record
six M6 observations (cellular OFF/ON, three each) and six streaming handoffs
(h2/h3, three each), after the operator forgot NEC and selected Buffalo 5 GHz.
No sustained approximately 1 s PING sequence was reproduced; all six handoffs
used cellular packets, retained their SID and had no SDK error. In all three
new h3 handoffs, the observed app/server packets returned to en0 after the
Wi-Fi-restored callback. These new conditions do not reconstruct past AP use
or isolate AP choice as the cause of changed observations.

## Follow-up results

| Item | Evidence | Result |
| --- | --- | --- |
| P1, required | [Existing three M6 qlogs](../2026-11-18/h3-m6-qlog/p1-get-rotation.md); no new run | Peer RESET_STREAM/STOP_SENDING with 0x101, not response FIN; 63 unique stream bytes; next normal GET attempt 1 starts 2.4–3.0 ms after -1017, with no observed SDK backoff. |
| P2, optional | [One 180 s M6 run with cellular data OFF](p2-cellular-off/report.md) | 6/6 transactions h3; Wi-Fi-only path flags; no sustained approximately 1 s PING sequence. One additional PING follows a PTO-expired event. The -1017 rotation/reset remains. |
| P3, optional | [One T12 run using Settings → Wi-Fi OFF/ON](p3-settings-handoff/report.md) | 12/12 transactions h3; no SDK error; app-owned RVI records include 61 en0 and 105 pdp_ip0 packets. Task metrics still report isCellular=false. |
| P4 | Existing HTTP/3-started reporting | No new test requested. |

P2 is one comparison, not proof that cellular availability causes PING bursts;
one earlier both-ON run also lacked them, and constant AP association across
the comparison was not verified. P3 confirms actual cellular packet
use for this trial, without assigning a cause to the two older en0-only captures.
P1 identifies the stream error and SDK continuation; the peer's reason for error
0x101 remains unknown. These are the requested observations, not a blanket
specification pass or a diagnosis of all underlying platform behavior.

The first P2 launch failed a signing/provisioning security check before startup
and is excluded. The demo was rebuilt/re-signed from the same measured Swift
sources; Xcode 27.2 and iOS 27.2.1 are unchanged. Raw qlogs/pcap remain local;
reports, source hashes and focused evidence are included in the dated folders.
The app and capture are stopped, RVI is removed, and the operator confirmed
Wi-Fi and cellular data both ON with NLC disabled.
