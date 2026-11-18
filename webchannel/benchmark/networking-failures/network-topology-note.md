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

## AP selection correction (operator report, 2026-11-24)

During the Settings-based Wi-Fi operations for the PR #138 follow-ups, the
operator discovered that the iPhone was associated with the **NEC Aterm
WX3000HP2 in the adjacent room**, rather than the intended Buffalo AP a few
centimeters from the iPhone. The operator had thought the NEC network had been
forgotten during earlier experiments, but found that it had not been forgotten.
The AP association was therefore not controlled as intended.

The operator supplied the following physical wiring; it has not been
independently surveyed by the test tools:

| Wi-Fi AP | Location | Wired path to the router |
| --- | --- | --- |
| Buffalo WSR-3200AX4S-BK (intended) | A few centimeters from the iPhone | Buffalo LSW6-GT-8NS → central Buffalo LSW5-GT-8EP/WH → YAMAHA RTX-830 |
| NEC Aterm WX3000HP2 (observed during the follow-ups) | Adjacent room | Central Buffalo LSW5-GT-8EP/WH → YAMAHA RTX-830 |

The common upstream path is **YAMAHA RTX-830 → GE-ONU → docomo Hikari
(Hikari collaboration service), using IPoE**, as reported by the operator.
The operator explicitly reconfirmed that the Linux box had been removed from
the later experimental path. The two AP paths above both bypass it.

SSID/BSSID and associated AP identity were not recorded per trial. The time
at which the iPhone selected the NEC AP, the AP used in each earlier run, and
the AP association before/after each Wi-Fi toggle cannot be reconstructed from
the existing NWPathMonitor or RVI interface records. Do not assign every past
run, or both sides of a handoff, to either AP retrospectively. The confirmed
observation is the NEC association noticed during the PR #138 follow-ups.

Earlier descriptions such as “direct AP” or “AP directly connected to the
switching hub” identify the intended removal of the Linux box; they do **not**
establish a fixed AP, a single wired-switch count, or identical radio conditions.
The NEC path has one wired switching hub before the router, whereas the
intended Buffalo path has two. At discovery, the operator expected the latency
difference to be small; this was not based on a measured comparison. AP model,
placement/radio conditions and reassociation behavior also differ, so an effect
on timing or reconnection cannot be quantified or ruled out from these data.

This correction does not alter the recorded stream resets, PING frames,
protocol metrics or packet-interface counts. It limits AP-specific conclusions
and comparisons that assume only the requested test variable changed. In
particular, the cellular-OFF P2 comparison does not verify that AP association
was held constant relative to the earlier both-ON M6 runs. No measured values
or original event records have been rewritten to fit the intended topology.

### Subsequent LAN comparison on November 24

A later [six-trial ICMP comparison](2026-11-24/ap-latency/report.md), with
operator-confirmed AP selection, found different LAN behavior in the current
placement: NEC per-trial RTT medians were 72.298–88.489 ms with 18/360 echo
replies missing; Buffalo medians were 60.021–64.333 ms with 360/360 replies.
This includes phone response scheduling and the deployed radio/wiring conditions;
it is not a WebChannel latency measurement or an isolation of switch-count
effects. It neither reconstructs earlier AP associations nor quantifies their
effect on the earlier recovery tests. The original AP-selection limitation remains.
