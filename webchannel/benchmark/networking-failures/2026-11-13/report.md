# Human-operated iPhone networking measurements — 2026-11-13

**Network topology clarification:** T1–T8 traversed a Linux box. The operator
subsequently connected the AP directly to the switching hub, bypassing that box.
See the [operator-reported wiring change](../network-topology-note.md) before comparing phases.

**21 measurements in seven groups of three repetitions**, extending the
[36 blackhole trials](../2026-11-12/automatic-native/summary.md) from PR #129.
An earlier handoff is reference-only, and an interrupted T9 attempt is excluded.
These observations follow [PR #128](https://github.com/google/net_http/pull/128);
they do not complete the entire specification or assign an automatic pass to
every completed operation sequence.

## Results and evidence

| Condition | Repetitions | Main observation | Detailed report |
| --- | ---: | --- | --- |
| T9 idle, requested 10 s network outage | 3 | Same-session response resumed in all runs; no channel errors. Ready-Wi-Fi-to-echo intervals: 17.935 / 25.280 / 17.600 s, including probe/queue/retry time. | [T9 short](t9-summary.md) |
| T9 idle, requested 60 s network outage | 3 | Error 1 at 18.437 / 36.639 / 40.680 s from the unsatisfied-path callback. | [T9 long](t9-long-summary.md) |
| T10 network outage + one pending write | 3 | Error 1 at 9.199 / 16.178 / 13.708 s from the offline callback; one non-acked object each, initial POST plus two retries. Run 2 slightly exceeds the nominal 15 s upper bound. | [T10](t10-summary.md) |
| T11, three cut/restore cycles per trial | 3 | One same-session continuation; two channel failures at 25.648 / 36.813 s from the first offline callback, during cycles 2 / 3. | [T11](t11-summary.md) |
| Idle Wi-Fi → cellular → Wi-Fi | 3 | Same-session responses throughout. All three immediate post-restoration probe POSTs report cellular use, despite Wi-Fi default-path callbacks. | [Handoff](summary.md), [RID/metrics analysis](handoff-transport-summary.md) |
| Streaming handoff + 30 s extra observation | 3 | Received 62 / 68 / 69 stream messages without observed array-ID gaps/duplicates or channel errors. Post-restoration probes: all cellular in run 1, all non-cellular in run 2, cellular then non-cellular in run 3. | [Streaming](stream-handoff-summary.md) |
| M1 idle baseline, requested 180 s per fresh session | 3 | K=30000 ms in all sessions; within-GET noop medians 30.004 / 30.003 / 30.007 s. GET start intervals 60.000–60.238 s; no channel errors. Session 3 includes two cellular-marked transactions. | [Idle baseline](idle-summary.md) |

Error 1 is the SDK's RequestFailed. A request timing deviation is retained even
when the broader qualitative behavior matches a prediction. All observations
used the hosted staging generator and default failFast off. The SDK is unchanged;
only opt-in demo instrumentation adds matched-probe events/control protocol 2.
See [environment.json](environment.json) and [demo patch](demo-instrumentation.patch).

## Method and limitations

The person operates Wi-Fi/mobile-data settings. The stdlib-only runner uses
`devicectl` USB logging and control notifications, device uptime for device
intervals, fresh processes/sessions, local countdown/timers, system sounds and
optional `say` instructions. No AI response is required to time the cut/restore
operations. Wired transport is checked before arming and after each completed
sequence. Actual observed intervals include operator response and association;
requested holds are not substituted for observed outage durations.

Path changes, app foreground readiness, echoed-message completion and transaction
metrics are separate observations. The first matching path callback can precede
the foreground-ready path milestone. None proves exact packet-loss onset or the
precise transport recovery instant. Underlying NSError details and packet
captures were not obtained. Brief lifecycle effects around manual operations are
retained; inactivity during the guarded hold invalidates that attempt.

After Wi-Fi restoration, NWPathMonitor sometimes reports both Wi-Fi and cellular
interface-use flags. The runner's strict Wi-Fi-only predicate then suppresses
additional probes while passive streaming observation continues. Post-restoration
probe counts therefore differ (2 / 5 / 3, including the immediate restored echo)
and do not exhaustively sample the full 30 s. Different request-interface choices
are preserved; a root cause or operator-error explanation is not established.
The operator [confirmed the Wi-Fi operations and no Cellular-button operation](handoff-operator-note.md),
and later explicitly confirmed the streaming run 1 Wi-Fi disconnection.

## Inclusion and provenance

- `human-handoff-02` through `-04` form the idle handoff group. Runs 02/03 first
  validated the procedure; their inclusion as measurement repetitions was agreed
  before run 04. This is an exploratory set, not three prospectively selected
  independent validation trials. `human-handoff-01` uses earlier guidance and
  remains reference-only.
- `t9-attempt-01` was interrupted after an operator-reported procedure failure
  and is excluded. The nonzero terminate command after Ctrl+C remains recorded
  as a cleanup warning. Runs `t9-attempt-02` through `-04` are the valid short
  outage repetitions.
- System-dialog reports are recorded only where the operator supplied them:
  short T9 run 1: dialog appeared and was immediately dismissed with OK; short
  run 2: no dialog; long T9 run 1: dialog appeared, dismissal timing unspecified.
  No visibility is inferred for other runs.
- Each three-run group's measured runner snapshots are byte-identical. Groups
  span successive runner revisions; the snapshots, not today's source alone,
  identify the measured controller. The earlier reference handoff has no source
  snapshot. See [validation.json](validation.json) for counts and snapshot checks.
- Identifying device snapshots/command logs are omitted. Retained names/IDs use
  TEST_DEVICE placeholders; network addresses, session IDs and measurements
  remain. See [publication-note.md](publication-note.md).

## Remaining specification work

- **T13:** Wi-Fi → cellular when cellular is available but carries no traffic.
  A cellular-specific fault setup has not been verified.
- **T15:** verified OS suspension/resume for short, 60–120 s, and >120 s durations.
  No suspension proof was obtained; backgrounding, missing heartbeats, debugger
  pause or process termination are not substituted for this test.
- **T12/T14 and M2/M3:** real handoffs and per-request metrics are observed, but
  exact physical recovery gaps and the predicted NSError -1005 sequence remain
  unverified. More complete request-interface tracking would clarify the mixed
  default-path behavior and later routing choice.
- **M4:** recorded protocols are h2; **M6** remains conditional on observing h3.
  Earlier M5 periodic-send deviations remain in the 2026-11-12 report.

## Reproduction

See [tools/README.md](../tools/README.md) for the runner modes and operator
instructions. `test_run_handoff.py` exercises timing, stale/incorrect events,
flapping, channel failures and probe matching without touching the device.
`analyze-idle.py` regenerates the idle analysis; the handoff/stream directories
retain analysis scripts and raw evidence. Manually added interpretation and
operator notes in reports should be retained separately when regenerating.
