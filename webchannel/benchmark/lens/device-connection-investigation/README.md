# Device connection investigation

## Results

| Experiment | Observed result |
|---|---|
| [Separate Xcode startup reproduction](2026-10-14_10-09_startup-reproduction/report.md) | 250 no-network tests passed; invocation 251 reproduced the notification-observation startup failure. |
| Periodic 60-second waiting | Recovered once; validation passed 400 times then failed before test entry with an incomplete socket-identifier read. Not a stable solution. |
| [Xcode repetition with app relaunch](2026-10-14_application-relaunch/report.md) | 20 smoke iterations and 1000 validation iterations passed, with distinct application PIDs within each batch and no recovery actions. |
| [Lens cold-transport follow-up](2026-10-14_cold-relaunch-smoke/report.md) | Two binary Omnient OFF trials and two ON trials completed with actual fresh HTTP/2 TCP/TLS evidence. |

The validated startup workaround uses `-test-iterations N -test-repetition-relaunch-enabled YES -run-tests-until-failure`, keeping one Xcode invocation per batch while restarting the application process for every repetition. This avoids the observed per-Xcode-invocation descriptor growth without keeping the app or WebChannel session warm. The paired benchmark now uses `run-relaunch-delay-sweep.py`, with one alternating OFF/ON test per repetition and verified original attachment mappings. Production measurements omit `-run-tests-until-failure` so that a measured failure does not discard the remaining requested iterations. A migration must retain OFF/ON ordering, fresh app processes for every trial, transport verification, and deterministic per-iteration artifact association. Grouping OFF and ON in the same test repetition is not assumed to give separate app processes.

[Detailed evidence and limitations](connection-reuse-audit.md) · [Artifacts](artifacts.md)

The [completed 10-pair sweep](../2026-10-14_09-30_omnient-delay-sweep-10pairs_JST/report.md) and [interrupted 1000-pair sweep](../2026-10-13_14-59_omnient-delay-sweep-1000pairs_JST/report.md) remain separate from these investigations.
