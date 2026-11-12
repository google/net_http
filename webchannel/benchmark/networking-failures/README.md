# iOS networking-failure experiments

The [2026-11-12 automated summary](2026-11-12/automatic-native/summary.md)
records 36 physical-iPhone trials against the hosted staging generator, following
[PR #128](https://github.com/google/net_http/pull/128). It includes deviations
from the expected behavior, raw evidence, cleanup verification, and limitations.

The completed scope is T1–T8, three streaming-loss durations, periodic sends
(M5), and optional fail-fast (T16), each repeated three times. T9–T15 are not
executed: real interface changes and verified OS suspension are not replaced
with packet loss or process termination. Earlier manual attempts are retained
separately in the [dated report](2026-11-12/report.md).

The [experimental tools](tools/README.md) use Foundation, Xcode's bundled private
DTX frameworks, Python's standard library, and `devicectl`. They need no new
third-party control library. An opt-in demo mode connects automatically and
records request, task-metric, path, lifecycle and main-loop events. The WebChannel
SDK implementation is unchanged.

The controller verifies activation and deactivation, runs its hold timer locally,
and attempts cleanup on interruption. It is specific to the tested Xcode version;
host API acknowledgements are not measurements of exact packet-loss onset.
Published evidence masks device identifiers and normalizes console line endings;
see the [publication note](2026-11-12/automatic-native/publication-note.md).
