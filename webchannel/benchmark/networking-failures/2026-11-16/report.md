# Additional iPhone network measurements — 2026-11-16

**Completed:** 12 additional measurements on the unchanged client: T5 on the
direct AP wiring (3), and OS-observed suspension at 45/60/75 s (3 each).
**Pending:** the required WebChannel h3 fault suite and M6; staging still
negotiates h2, while the same iPhone demonstrably uses h3 for the control host.

| Work | Result | Evidence |
| --- | --- | --- |
| T5, Linux box bypassed, 250 s holds ×3 | Error 1 at 93.470 / 191.526 / 180.762 s; one unsatisfied path, two without | [T5 report](t5-direct-summary.md) |
| Expiry follow-up, 45/60/75 s OS holds ×3 | Original session and PID resumed in all nine, no SDK errors | [Expiry report](expiry-summary.md) |
| h3 setup | Same-phone control: 3/3 h3; staging HEAD: 3/3 h2; actual WebChannel preflights: h2 twice | [h3 findings / blocker](h3-setup-summary.md) |

## Environment and comparison limits

Baseline main is `0ce5232ecbc3a8195040f9d159542b51c906ac37`. SDK recovery
sources are unchanged from the prior measured client. Physical iPhone SE
(3rd generation), iOS 27.2.1 (24B156), wired USB. The operator confirmed Wi-Fi
ON, cellular OFF, condition initially disabled, and the AP directly connected
to the switching hub, bypassing the Linux box.

The Mac was upgraded to macOS 27.2.1 (26B131), Xcode 27.2 (27B52). Earlier
measurements used Xcode 26.6. Build-only override
`IPHONEOS_DEPLOYMENT_TARGET=17.0` accommodates Xcode 27's supported range.
This is not a controlled isolation of the wiring change alone.

[Environment](environment.json), [source versions](source-versions.json),
[operator notes](operator-notes.md), [topology clarification](../network-topology-note.md).

The initial app/observer/controller sources were used for every T5 and expiry
trial and the first SDK h3 preflight. A later app revision adds independent
HEAD diagnostics; it was installed only after the fault/expiry trials ended.
The second SDK h3 preflight used that later revision. Neither changes SDK
retry/recovery behavior. No new third-party control library was added.

## Exclusions and cleanup

A T5 run-2 startup was inactive due to the cellular-data-off dialog. The
operator dismissed it; startup stopped before fault injection and is retained
under t5-direct/interrupted-attempts. Run 1 was not repeated. A first expiry
startup required Enable UI Automation after the host update and is excluded
under excluded-ui-automation-startup. The operator enabled it before valid
holds. Queued suites stop on infrastructure failure instead of overlapping.

All native conditions are verified inactive after completion. The demo and
UI observer processes were stopped by their controllers; the Mac's temporary
sleep-prevention process was stopped as well. [Final condition state](final-condition-state.json).

Raw identifying snapshots, full process lists, xcresults and build diagnostics
remain local. Selected logs normalize line endings/trailing whitespace and
replace device/user identities; source hashes identify published copies.
[Publication note](publication-note.md), [reproducible analysis](analyze-followup.py),
[machine-readable observations](followup-analysis.json).

These are observations, not a blanket SDK pass. Physical switch/drop times,
continuous packet-level fault onset, exact server expiry and baseline NSError
details remain unmeasured. HTTP/3 fault coverage is explicitly pending.
