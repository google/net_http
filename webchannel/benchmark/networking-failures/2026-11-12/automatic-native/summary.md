# Native-controlled iPhone network-failure test results

**36 automated trials completed on 2026-11-12 (14:27–15:59 JST).** This completes
the native-controlled blackhole suite below, not the entire PR #128 specification.
Every counted trial has an active-condition readback, an inactive-condition
readback, an app console log, and structured app events. A separate final
readback confirms all induced conditions inactive. The app is stopped and the
Mac sleep-prevention process has exited.

## Environment and method

- Physical iPhone SE (3rd generation), iOS 27.2.1; Xcode 26.6 (17F113).
- Hosted staging generator endpoint, Wi-Fi; mobile data disabled by operator.
- SDK base `9c0b94f708dd1eb8ac89043fe0752c5edb45c715`; no SDK source changes.
  Remote main at audit was 35 commits ahead, but had no changes under
  `webchannel/objc/imported_src`. See `environment.json` and the demo patches.
- Default demo options; failFast enabled only for optional T16. Opt-in demo
  instrumentation adds autorun, traffic controls, lifecycle/path/task metrics,
  and later a 1 Hz main-loop heartbeat. Every trial uses a fresh app process and
  channel session. No per-trial user Connect or Settings operation is needed.
- Fault control uses Apple's Xcode-bundled DTX implementation and
  `SlowNetwork100PctLoss`, with both directions at 100% loss. No third-party
  control library was installed or run.
- Hold time is measured locally from enable acknowledgement to disable request.
  Across these runs it exceeded the target by approximately 2–16 ms. These host
  command timestamps do not independently measure packet-drop onset or cessation.

## Results by case

| Case | Fault / traffic | Repetitions | Observed result |
| --- | --- | --- | --- |
| T1 | 10 s, idle | 3 | No timeout/error; same-session reception continues. |
| T2 | 50 s, idle | 3 | About 45 s since last chunk to timeout, then same-session recovery. One run includes an unsatisfied path update. |
| T3 | 90 s, idle | 3 | Two recover; one ends with HTTP 400 / error 4. Both outcomes are allowed by the spec. |
| T4 | 150 s, idle | 3 | All end with HTTP 400 / error 4 after restoration. |
| T5 | 250 s, idle | 3 | All end with error 1 before restoration. Abort after about 121.09, 120.73, 166.72 s from enable ack; the first two are earlier than the 165–225 s estimate and include unavailable-path updates. |
| T6-short | 50 s, server streaming every 1 s | 3 | All recover. Frame IDs have no gaps/duplicates; delivered stream counts match frame counts: 60, 63, 61. |
| T6-long | 150 s, server streaming | 3 | Two end with HTTP 400; one ends early with error 1 at about 90.42 s, with an unsatisfied path update. |
| T6-exhaust | 250 s, server streaming | 3 | Error 1 at about 176.79, 186.92, 175.24 s, within the long-blackhole estimate. |
| T7 | 90 s, one pending send | 3 | Abort after 40.56, 47.14, 54.75 s from send control; one non-acked object each. |
| T8 | 60 s loss enabled before handshake | 3 | One handshake POST per run, no open event, no handshake retry; error after 45.00, 45.00, 44.99 s from POST start. |
| M5-periodic | 250 s, one send every 5 s | 3 | Error 1 after 51.45, 82.18, 54.48 s from first send; 11, 17, 11 non-acked objects. Does not sustain the channel to the back-channel bound. |
| T16 | 30 s, pending send, failFast | 3 | Error after 18.09, 17.34, 12.69 s from send; no forward retry log in any run; one non-acked object each. |

The watchdog intervals use device uptime. Cross-process durations relative to
fault-control events use Mac wall-clock timestamps and are approximate; see the
raw monotonic hold timing for control duration. Error 1 is RequestFailed; error
4 is UnknownSessionID in the client. HTTP 400 alone does not independently prove
server-side session-expiry details.

## Important differences from expectations

1. **A nominal blackhole can acquire an unavailable default path.** NWPathMonitor
   reports `unsatisfied` in some runs, including the two early T5 aborts and the
   early T6-long abort. This is not proof that the physical Wi-Fi interface was
   switched off. It limits interpretation as an always-usable silent-loss path.
   Status-0 request failures can also complete before the 45 s watchdog; the
   underlying NSError is not exposed by this SDK's current callbacks.
2. **A periodic send does not guarantee a forward retry-count reset.** M5 aborted
   after 51–82 s despite accepted sends spaced about 5 s apart. The SDK resets
   its counter only after request-pool/scheduled-work guards. See
   [retry-reset-audit.md](retry-reset-audit.md) for the source-based explanation
   candidate and its limits; the private counter itself was not instrumented.
3. A cellular-data-off system dialog was noticed during an interrupted T5-r2
   attempt. That attempt was excluded and archived before rerunning. Its original
   appearance time is unknown; visibility was not automatically monitored for
   earlier runs. In the 23 resumed trials, the added heartbeat remains in active
   app state throughout. The monitor does not recognize/dismiss system dialogs.
   See [system-dialog-note.md](system-dialog-note.md).

## Measurement coverage

- **M1 partial:** handshake keep-alive value 30000 ms and the approximately 45 s
  watchdog are confirmed. Normal idle noop spacing/GET rotation also appear in
  the earlier, separately labeled manual logs; this suite did not include a
  dedicated long no-fault baseline for those two measurements.
- **M2/M3 pending:** no real Wi-Fi/cellular handoff was performed.
- **M4 observed:** 142 transactions report h2; 76 report unknown (no negotiated
  protocol recorded). No h3 was observed. All recorded transaction metrics have
  isCellular=false. Missing protocol values must not be counted as h2 evidence.
- **M5 measured:** comparison and non-acked counts are above; expected behavior
  was not reproduced by periodic sends.
- **M6 conditional:** no h3 was observed, so no QUIC parameter claim or capture is
  provided.

**T9–T15 remain unexecuted.** They require real L3 down/up/flapping, real interface
changes (including a broken cellular path), or verified iOS suspension. Packet
loss, process termination and debugger pause were not substituted for them.

## Artifacts and interpretation

- [Per-trial observations](report.md), [detailed analysis](analysis.md),
  [analysis.csv](analysis.csv), [analysis.json](analysis.json).
- [Raw results](results.json), [transport metrics](transport-metrics.json),
  [artifact validation](validation.json), [final state](final-device-state.jsonl).
- Each trial directory contains `condition.jsonl`, `device-console.log`, and
  `device-events.jsonl`; resumed trials also have `condition-events.jsonl`.
- Interrupted attempts are retained under `interrupted-attempts/`. Earlier manual
  runs are separate and not merged into these 36 repetitions.
- `tool-sources/` preserves the final helper/runner/analyzer source and SHA-256
  values. `demo-instrumentation.patch` and `demo-instrumentation-resume.patch`
  preserve the two demo instrumentation versions.

Outcome matching in analysis is deliberately coarse; timing deviations, path
changes, and delivery limits must be read with it. Stream payloads repeat the
same body, so wire-ID continuity plus matching callback counts is the available
evidence, not a unique application-level sequence-number audit. Network SSID and
carrier were not recorded. Nothing was posted to GitHub.

For device-identifier redaction and the PR rebase, see [publication-note.md](publication-note.md).
