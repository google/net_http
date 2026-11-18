# P2: M6 with cellular data OFF

One optional follow-up requested by [PR #138](https://github.com/google/net_http/pull/138).
Physical iPhone SE (3rd generation), iOS 27.2.1 (24B156), Xcode 27.2 (27B52).
The operator confirmed Wi-Fi ON, cellular data OFF, Network Link Conditioner
disabled and the Linux box bypassed. The initial preflight described the AP
as directly connected to the switching hub, but the later
[AP-selection correction](../../network-topology-note.md#ap-selection-correction-operator-report-2026-11-24)
establishes that the intended AP was not enforced. A NEC AP in the adjacent
room was observed during these follow-ups; this run's AP identity was not
recorded. Radio settings are operator-reported; task/path flags are recorded
separately.

## Result

The 180 s observation completed (180.267 s from channel open to stop command).
All six completed transactions were h3, all reported isCellular=false, and
there were no SDK errors or application sends. All three NWPathMonitor updates
reported Wi-Fi=true, cellular=false, expensive=false.

The complete qlog contains eight sent PING packets: one during setup at
0.140514 s, then PINGs at the following seconds from its first event:

`20.303398, 50.332566, 50.525641, 80.448438, 110.337070, 140.540847, 170.346544`

No sustained approximately 1 s PING sequence appeared. The extra PING at
50.525641 s follows a `pto_expired` packet-loss event for the preceding PING's
packet, 0.193075 s after that PING. The later loss event also records
`reordering_threshold`; these are the stack's recovery observations, not
independent proof of physical loss. The remaining sequence is approximately
30 s apart. Local/remote max_idle_timeout remains 0 / 240000 ms.

| Condition | Runs | Late approximately 1 s PING sequence | Cellular flag appeared in path updates |
| --- | --- | --- | --- |
| Both radios ON, November 18 | 3 | 2 of 3 | Same 2 of 3 |
| Cellular OFF, this follow-up | 1 | 0 of 1 | 0 of 1 |

This cellular-OFF comparison is consistent with the earlier association, but
one OFF run cannot establish causality: one of the ON runs also lacked the
burst, and the AP association was not verified constant across runs.
PING-bearing packets are identified directly by qlog, not inferred from size.

The first approximately 60 s GET rotation again reports -1017. The P1 analyzer
also confirms a peer RESET_STREAM with error 257 and final_size=63, with no
response FIN. Cellular OFF therefore did not eliminate this observed rotation
error. The SDK continues normally; shutdown cancellation is recorded separately.

## Provenance and validation

[Summary](summary.json), [qlog analysis](qlog-analysis.json),
[frame excerpts and raw hash](qlog-evidence.json),
[GET-rotation analysis](rotation-analysis.json), [app events](events.jsonl).
Raw qlog is local under `/private/tmp/net-http-p2-cellular-off-20261124-retry/`.
The source snapshot is [measurement-source.py](measurement-source.py).

The first launch was rejected for a code-signing/provisioning security reason,
before app startup. It is excluded, not a measured trial. Rebuilding/re-signing
and installing the same sources resolved launch. The three Swift demo source
files match the November 18 measured snapshots; SDK recovery logic is unchanged.
Session invalidation was observed before qlog collection; the app was terminated
afterward. RVI was started only after P2 ended, for the subsequent P3 trial.
