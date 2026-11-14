# iOS networking-failure experiments

**Network topology clarification:** T1–T8 traversed a Linux box. The operator
subsequently connected the AP directly to the switching hub, bypassing that box.
See the [operator-reported wiring change](network-topology-note.md) before comparing phases.

The [2026-11-14 T13 report](2026-11-14/t13-summary.md) adds nine idle handoffs
to cellular with operator-configured cellular-only 100% packet loss. All three
50 s and all three 90 s requested holds resumed their original sessions; all
three 150 s requested holds ended after Wi-Fi restoration with HTTP 400 /
UnknownSessionID. Separate interface-bound preflight verified fault selectivity.

The [2026-11-14 suspension report](2026-11-14/suspension-summary.md) adds nine
T15 observations: 30 / 90 / 150 s OS-reported suspension holds, each repeated
three times. Short holds resumed the original session; medium/long holds ended
with HTTP 400 / UnknownSessionID after resume. The app is launched normally,
while a separate Apple UI-test target observes OS state and controls Home/resume.

The [2026-11-13 report](2026-11-13/report.md) adds 21 measurements in seven
three-repetition groups: T9 short/long network outages, T10 pending writes,
T11 flapping, idle and streaming Wi-Fi/cellular handoffs, and M1 idle baselines.
It links the per-trial logs, measured runner snapshots, timing deviations,
operator reports, and remaining work. One earlier handoff is reference-only;
one interrupted T9 attempt is excluded.

The [2026-11-12 automated summary](2026-11-12/automatic-native/summary.md)
records 36 physical-iPhone trials against the hosted staging generator, following
[PR #128](https://github.com/google/net_http/pull/128). It includes deviations
from the expected behavior, raw evidence, cleanup verification, and limitations.

That earlier suite covers T1–T8, three streaming-loss durations, periodic sends
(M5), and optional fail-fast (T16), each repeated three times. The later
human-operated runner covers real network outages and interface changes.
The later T13 handoff and T15 OS-observed suspension measurements are linked
above. Exact physical outage timing and underlying NSError details remain
limited; an observed control sequence is not an automatic test-case pass.
Earlier manual attempts remain separate in the [dated report](2026-11-12/report.md).

The [experimental tools](tools/README.md) use Foundation, Xcode's bundled private
DTX frameworks, Python's standard library, and `devicectl`. They need no new
third-party control library. An opt-in demo mode connects automatically and
records request, task-metric, path, lifecycle and main-loop events. The WebChannel
SDK implementation is unchanged.

The human-operated runner uses USB logging, advance instructions, a local
countdown, distinct sounds and optional Japanese speech. The operator switches
the phone settings; the runner observes device-clock path/lifecycle events,
checks matched echo responses, records results and cleans up the demo. An
additional idle mode needs no interface operations or app sends.

The controller verifies activation and deactivation, runs its hold timer locally,
and attempts cleanup on interruption. It is specific to the tested Xcode version;
host API acknowledgements are not measurements of exact packet-loss onset.
Published evidence masks device identifiers and normalizes console line endings;
see the [publication note](2026-11-12/automatic-native/publication-note.md).
