# Network topology clarification (operator report, 2026-11-14)

The operator confirmed that **T1–T8 were performed with the Linux box still in
the network path**. The Linux box had initially been considered as the
blackhole injector, and the experiments proceeded with that wiring in place.
This wiring clarification does not mean the Linux box injected the recorded
faults; the fault mechanism remains the one documented for each trial.

Afterward, the operator connected the access point directly to the switching
hub, bypassing the Linux box. Subsequent experiments used that revised wiring,
including the T13 and T15 measurements in the 2026-11-14 report.

| Measurements | Relevant network wiring |
| --- | --- |
| T1–T8 | AP traffic traversed the Linux box |
| Subsequent experiments after rewiring | AP connected directly to the switching hub; Linux box bypassed |

This is a retrospective operator report, not a packet-capture verification of
the physical path. The exact rewiring time and its position relative to other
2026-11-12 measurements were not recorded. Do not infer that every measurement
on that date used identical wiring. Comparisons across the two phases must
account for this topology change; its effect on the measured behavior has not
been isolated by a controlled before/after experiment.
