# Streaming handoff observations, 2026-11-13

3 valid trials of this variant; three repetitions are required.

Same requested settings: 1 s server messages, 15 s cellular hold, 30 s extra
post-restoration observation with probes roughly every 5 s while the observed
path remains Wi-Fi-only. No manual Cellular-button action is requested.

| Run | Stream frames / delivered | Largest logged interval (s) | Array-ID gaps / duplicates | Channel errors | Cellular / post-restore probes | First mixed path after ready Wi-Fi (s) |
| --- | --- | ---: | --- | --- | --- | ---: |
| [1](stream-handoff-01/summary.md) | 62 / 62 | 1.505 | [] / 0 | [] | 2 / 2 | 9.901 |
| [2](stream-handoff-02/summary.md) | 68 / 68 | 1.539 | [] / 0 | [] | 0 / 5 | 24.962 |
| [3](stream-handoff-03/summary.md) | 69 / 69 | 1.087 | [] / 0 | [] | 1 / 3 | 14.798 |

Receipt intervals are observed stream delivery, not exact physical outage
times. Per-request task metrics and default-path callbacks remain separate.
Mixed path means both uses-interface flags are true, not proof of a failed
Wi-Fi operation. After such updates, the strict probe predicate suppresses
further probes; passive observation continues. Probe counts can differ even
with identical requested settings. Raw logs, source snapshots and operator
reports are retained in each run directory. See handoff-operator-note.md for
the earlier operator confirmation. No operator-error cause is established.

## Three-trial comparison

Measured runner source snapshots are byte-identical in all three trials.
All trials received the parsed stream frames without observed wire-array-ID
gaps or duplicate IDs, and app-delivery counts matched (62, 68 and 69). There
were no SDK channel error callbacks. Largest logged stream intervals were
1.505, 1.539 and 1.087 s; these are delivery observations, not exact outages.

- Trial 1: both captured post-restoration probe transactions were cellular-marked.
- Trial 2: all five captured post-restoration probes were non-cellular-marked.
- Trial 3: the probe POST at ready-Wi-Fi +1.037 s was cellular-marked; POSTs at
  +7.279 and +13.044 s were non-cellular-marked. This bounds the observations
  but does not identify the exact physical interface-transition instant.

Later mixed default-path updates caused the strict Wi-Fi-only probe predicate
to suppress subsequent probes. Counts are therefore conditional on observed
path flags, not exhaustive sampling of all 30 s. Passive streaming continued.
The observations show that Wi-Fi default-path restoration need not coincide
with immediate non-cellular use by the next request; later forward requests
can use Wi-Fi. The root cause of the differing per-trial selection is not
isolated. No operator-error cause or blanket specification pass is inferred.
