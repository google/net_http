# Experimental native device-condition helper

Uses Foundation and private frameworks already bundled with Xcode. No Python
packages, third-party libraries, downloaded executables, or GUI automation are
required. Tested with Xcode 26.6 and the connected iPhone SE (3rd generation),
iOS 27.2.1. This is a version-specific experiment, not a supported Apple CLI API.

Build from the repository root:

```sh
bash webchannel/benchmark/networking-failures/tools/build-device-condition.sh
```

Set `XCODE_APP` at build and execution time if Xcode is installed outside
`/Applications/Xcode.app`. The default binary is outside the repository, at
`/private/tmp/net-http-device-condition`.

Replace `TEST_DEVICE_UDID` below with the hardware UDID from `xcrun devicectl list devices` / Xcode:

```sh
/private/tmp/net-http-device-condition list TEST_DEVICE_UDID
/private/tmp/net-http-device-condition run TEST_DEVICE_UDID 3
```

`list` is read-only. `run` discovers the advertised `SlowNetworkCondition` /
`SlowNetwork100PctLoss` profile, refuses to replace an already active condition,
enables it, verifies its active state, waits locally using a monotonic clock,
disables it, and reads back the inactive state. The timer starts at the enable
reply, so the verification round trip is included in the requested duration.
The device remains connected throughout the hold. Keep it connected by USB and
keep the test app in the foreground. Turn off the manually operated iPhone
conditioner before testing; avoid simultaneous Xcode Start/Stop operations.

All event records are JSONL on stdout; Apple diagnostic messages may appear on
stderr. Redirect stdout to preserve request/reply timestamps, monotonic timing,
and state snapshots. Physical packet-drop onset is not measured by an API reply;
correlate the resulting WebChannel traffic or a packet capture for that purpose.

Ctrl+C (SIGINT) and SIGTERM trigger cleanup and inactive-state verification.
SIGKILL and a process/OS crash cannot execute cleanup. If a run is interrupted
unexpectedly, check state with `list`, stop the condition in Xcode, or explicitly
clear the currently active induced condition:

```sh
/private/tmp/net-http-device-condition clear TEST_DEVICE_UDID
```

`clear` affects the active induced condition, including one set by another tool.

## Implementation

Device discovery uses `DVTDeviceManager` and `DVTCoreDeviceCore`. The selected
device's `createDTXChannelWithIdentifier:completion:` opens the Apple DTX channel
`com.apple.instruments.server.services.ConditionInducer`. `DTXMessage` and
`sendControlAsync:replyHandler:` perform the three service operations. DTX byte
framing, service discovery, and pairing remain in Apple's implementation.

The `DTXMessage` object-argument constructor is variadic and nil-terminated;
passing an NSArray as its argument list is incorrect. The explicit private
selector declarations in the source were checked against the installed runtime.
`disableActiveCondition` is sent without a reply handler, followed by profile
enumeration to verify that no induced condition remains active.

## Validation on 2026-11-12

- Built with `-Wall -Wextra` without compiler warnings.
- Read-only enumeration returned network, thermal and GPU profiles.
- 3 s run: active 100% loss profile verified; disable requested approximately
  3.011 s after enable acknowledgement; inactive readback approximately 40 ms
  later; exit 0.
- SIGTERM after active-state verification: cleanup completed, inactive state
  verified, exit 143.
- An early prototype crashed while constructing activation arguments. A separate
  readback confirmed no active condition remained; the variadic call was fixed
  before the successful run.

Raw records are in `../2026-11-12/native-*.jsonl`. These helper smoke tests are not
additional PR test-case repetitions, and do not independently verify data-plane
packet loss. Existing manually controlled results remain labeled separately.

## Autonomous demo suite

`run-network-failures.py` uses the native helper and `devicectl` to launch a fresh
instrumented demo process for every trial. It sends only opt-in test-control
Darwin notifications; the WebChannel SDK implementation is unchanged.

The demo has to be built/installed from this checkout first. Its autorun mode is
only enabled by `NETTEST_AUTORUN=1`; a normal launch stays interactive. Test mode
adds NWPathMonitor, lifecycle, task metrics and timestamped SDK/app events, and
disables the app's idle screen timer for the run. Environment variables specify
run ID, idle/streaming/pending/periodic traffic and optional failFast.

```sh
python3 -u webchannel/benchmark/networking-failures/tools/run-network-failures.py \
  --device TEST_DEVICE_UDID \
  --output /path/to/new-output-directory --repetitions 3
```

For a smaller run use `--cases T1,T2` (names are listed in the script). The default
suite takes roughly 80–100 minutes. It includes T1–T8, three T6 durations,
M5-periodic and optional T16, three fresh-process trials each. Keep the device on
USB, leave the demo in the foreground and do not operate Xcode conditions or the
phone conditioner concurrently. The helper refuses to overwrite an active
condition. Output includes per-trial console/structured logs, condition state
and timing, incremental `results.json`, `status.json` and `report.md`.

The `receiveAfterRelease` summary field is based on host receipt timestamps;
read the raw app events and transport metrics for precise analysis. The report
records observations without automatically treating all outcomes as a pass.

Real L3 down/up, Wi-Fi/cellular handoffs, and verified OS suspension (T9–T15)
are not replaced with packet loss or process termination. Those tests require
additional control of the real interfaces/suspension and remain explicitly
pending. M6 requires a QUIC capture if h3 is observed.

## Human-operated Wi-Fi / cellular handoff

`run-handoff.py` automates one Wi-Fi → cellular → Wi-Fi observation while a
person operates the phone. It does not depend on iPhone Mirroring, third-party
packages, the native condition helper, or an LLM response during timing. It
requires an interactive Mac terminal, USB, and the demo **rebuilt and installed
from this checkout** (control protocol version 2). It refuses a wireless
`devicectl` transport before launch/arming and verifies wired transport again
at completion. The observed transport field is a preflight check, not a promise
that the OS cannot change transport later; console loss/stale heartbeats stop
the trial.

```sh
python3 -u webchannel/benchmark/networking-failures/tools/run-handoff.py \
  --device TEST_DEVICE_UDID \
  --output /private/tmp/net-http-handoff-01 --hold 15
```

Choose a new output directory for every attempt; existing data is never
overwritten. `--transition-timeout` defaults to 90 s and `--probe-timeout` to
30 s. `--silent` disables all audio for a visually guided run. Audio uses macOS
`afplay` and system sounds, with short spoken Japanese instructions via `say`
at each action cue. `--no-speech` keeps sounds but disables speech. The first
sound (Tink) is only a readiness check. Confirm that you hear it before pressing
Enter. Sound volume/output and installed speech voices remain under macOS
control; playback invocation is logged but audibility cannot be verified.

Before arming, the runner prints the full action plan and sound mapping:

- First action cue (Glass), “Wi-Fi を切断してください”: disconnect Wi-Fi,
  keep mobile data on, and promptly return to the demo.
- Second action cue (Hero), “Wi-Fi を戻してください”: turn Wi-Fi back on
  and promptly return to the demo.
- Finish cue (Funk), “試験終了です”: no further switching.
- Interrupted cue (Basso), “試験を中断しました”: stop switching and restore
  settings manually.

When an assistant operates the runner, it should display this action plan in
chat **before** requesting readiness and sending Enter. The operator follows
local action cues directly; no additional AI message is needed during the
timed trial. There is no intermediate cellular-confirmation sound to confuse
with an action cue. Text countdown ticks are silent.

Before arming, turn Wi-Fi and mobile data on, attach USB, unlock the phone,
and disable Network Link Conditioner / Xcode induced conditions. The runner
does not inspect or alter those manually operated conditions. It terminates any
existing demo instance and starts a fresh session. Enter only acknowledges
readiness; it never marks the start of a networking failure.

The runner then:

1. Confirms the demo is active, the channel is open, the default path is Wi-Fi,
   and a uniquely matched echo probe receives a reply. It displays a local
   3–2–1 countdown, checking that the app/channel/path remain ready.
2. Sounds/displays a request to disconnect Wi-Fi, leaving mobile data on.
   Operate the phone, preferably using Control Center, and promptly return to
   the demo. No additional Enter or chat message is needed.
3. Waits for a new satisfied, cellular-only path and a fresh active heartbeat,
   then confirms another echo without an additional sound. It does not
   reconnect the channel on failure.
4. Counts the requested hold from the **device uptime of the observed cellular
   path**, including time spent returning to the app and checking the echo.
   The restore cue fires when a fresh device heartbeat reaches that duration.
5. Sounds/displays a request to turn Wi-Fi back on and return to the demo.
   It confirms a new Wi-Fi-only path, a fresh active heartbeat and a matched
   echo response, then saves results and terminates the demo.

Timing uses the phone's monotonic uptime for device intervals, and Mac monotonic
time for local wait deadlines. Host/device UTC clocks are never subtracted.
The restore cue normally follows the requested duration by up to a heartbeat
interval plus transport/scheduling delay; it is not a hard real-time deadline.
The actual observed cellular-to-Wi-Fi interval includes the operator's response
time and is reported separately from the requested hold. Delayed callbacks
while the app is inactive can shift the observed onset; callback times do not
prove physical switch times. Lifecycle events and all raw console events are
retained to expose that limitation. Settings-induced suspension is **not**
counted as T15 evidence.

During transition windows, brief app inactivity is permitted. During the
cellular hold/probe, unexpected path changes (including a flap back and forth),
inactivity, stale heartbeats, channel failure/closure or console disconnection
interrupt the trial. Missing transition/probe evidence also times out and stops
rather than advancing. Interrupted attempts are preserved; rerun with a new
output directory. A channel failure is an observation, not evidence of a
runner bug or an automatic reason to reconnect.

Outputs: `device-console.log`, incrementally written `device-events.jsonl`,
`runner-events.jsonl` (cues/readiness/milestones), `status.json`, `result.json`,
and `report.md`, plus `devicectl` command logs and wired-device snapshots.
The result is labeled `handoff-observed` or `interrupted`, **not** a T9–T15 pass.
NWPathMonitor describes the observed default path; task metrics separately
report transport use for completed transactions. Probe success alone is not
per-request proof of cellular use. Review the raw evidence before assigning
specification test coverage. These outputs contain device identifiers and
network data; sanitize them before publication, as with the existing suite.

**On completion, Ctrl+C, timeout or error, restore Wi-Fi/mobile-data settings
manually. The runner does not change or automatically revert phone settings.**
A stuck console/app cleanup is recorded separately; cleanup cannot run after
SIGKILL or a host crash. No further trial is automatically started.

Deterministic tests do not operate a device or play audio:

```sh
python3 -m unittest discover \
  -s webchannel/benchmark/networking-failures/tools -p test_run_handoff.py -v
```

Implementation validation (2026-11-12): all 10 deterministic tests passed;
the physical-device Debug build succeeded; the updated demo was installed and
its protocol-2 probe/reply was verified on the USB-connected iPhone (about
186 ms device-side interval), then closed and terminated. No phone networking
settings were changed for this smoke check. The human-operated handoff itself
has not yet been run with this runner.

The subsequent human-operated trial is recorded in
`../2026-11-13/human-handoff-01/summary.md`. It predates the action-plan/countdown
and spoken-cue revision. That revision passed all 11 deterministic tests,
including plan/readiness ordering, the three-second countdown, and distinct
cut/restore/finish cues. A subsequent physical trial with advance instructions
and local spoken cues completed successfully; its observations and measured
runner sources are in `../2026-11-13/human-handoff-02/summary.md`.

## T9: idle network off / on

The same runner supports `--scenario l3-idle`. Keep mobile data **off** for the
whole trial; begin with Wi-Fi on. The cut cue means disconnect Wi-Fi and return
to the demo; the restore cue means reconnect Wi-Fi and return to the demo.

```sh
python3 -u webchannel/benchmark/networking-failures/tools/run-handoff.py \
  --scenario l3-idle --device TEST_DEVICE_UDID \
  --output /private/tmp/net-http-t9-01 --hold 10 --probe-timeout 35
```

It verifies the baseline echo, observes a new `unsatisfied` default path and an
active heartbeat, and counts the requested duration on device uptime. There
are no app sends while offline. SDK error/close callbacks during the outage
are retained as expected test observations; they do not stop the restore cue.
App inactivity, missing heartbeats or an unexpected path change during the
hold still interrupt the attempt. Dismiss any mobile-data-disabled system
alert promptly and return to the demo; lifecycle effects remain in the logs.

After restoration, if the channel is still open, the runner sends one matched
echo probe and observes a reply/error for up to `--probe-timeout` seconds. It
never reconnects a failed channel. `outcome=l3-observed` means that the intended
path sequence was observed, not that recovery succeeded. `channelObservation`
is `echo-resumed`, `channel-failed`, or `no-recovery-observed`. Actual observed
offline duration includes manual Wi-Fi restoration latency and can exceed
`--hold`; use `observedOfflinePathSeconds`, not the requested hold, for comparison
with retry/abort windows. Recovery-probe RTT and path-to-echo interval do not
measure the exact transport recovery instant.

This is an idle-stream variant: the baseline probe completes before the fault,
and the next probe is sent only after restoration. Additional T9 durations,
T10 pending writes, T11 flapping and suspension require separate trials.

## T10: network down with a pending write

Use `--scenario l3-pending --hold 30` with the same physical operations as T9:
mobile data stays off; disconnect Wi-Fi on the cut cue and restore it on the
restore cue. After the offline-path and foreground checks, the runner posts
exactly one `.send` notification and requires a matching `echo_sent` submission
record. No further sends are made during the hold. A channel that terminates
before submission does not constitute a valid T10 trial. As with T9, terminal
channel errors remain observations and do not suppress the restore cue.

`pendingWrite` and `observedOfflineToPendingWriteSeconds` expose the delay
between the observed fault and submission. Abort timing is retained relative
to both the offline-path callback and pending-write submission. Check raw HTTP
request/retry logs and the non-acked-message report alongside these values;
submission logging by itself is not proof of a packet on the wire. No SDK or
new app changes are required beyond the previously installed protocol-2 demo.

## T11: repeated network down / up

`--scenario l3-flap --hold 5` runs three down/up cycles in one fresh session.
Mobile data remains off. On each spoken cut cue, disconnect Wi-Fi and return to
the demo; on each restore cue, reconnect Wi-Fi and return. After foreground Wi-Fi
readiness the runner waits 5 s before the next cut cue. Continue until the finish
cue even if the channel errors; never manually reconnect the channel. The initial
baseline echo and final echo (only if the channel remains open) are the only app
sends. Full actual cycle intervals are in `cycles` and per-cycle path/hold
milestones in result.json. All three cycles must complete for `l3-observed`.

This is human-operated flapping: operator response, association and foreground
readiness add to nominal intervals. It is not a fixed-period 5 s square wave.
Use per-cycle observed device times and raw request/retry logs when comparing
outcomes. Channel failures do not suppress subsequent cut/restore cues. Logging
loss, inactivity during a hold, or an unexpected path change still interrupts.

## Streaming handoff and extended post-restoration observation

For the handoff scenario, `--traffic streaming --observe-after 30` enables the
existing protocol-2 server stream (1000 messages, nominal 1000 ms interval),
requires baseline stream delivery, and observes for another 30 host-monotonic
seconds after the restored-Wi-Fi echo. Additional matched echo probes are sent
roughly every 5 s during that observation to obtain completed forward-request
metrics. The phone stays in the demo until the finish cue. No additional manual
switching is required. This differs from the earlier idle handoff variant and
must be reported separately.

Use raw HTTP body receipt events and wire array IDs to examine stream delivery
intervals and continuity, alongside app delivery/lifecycle events. Such receipt
gaps include server scheduling and device/console effects; they are not exact
physical outage durations. Default-path callbacks and per-request task metrics
remain separate evidence. A post-restoration path change is logged; probes are
only sent while the observed path is Wi-Fi. Channel failure is recorded, and
logging/foreground failures interrupt the trial. Extra-probe delays can extend
the actual observation slightly; its measured host duration is retained.

## M1: undisturbed idle baseline

`--scenario idle --hold 180` starts a fresh demo session and observes for 180
seconds from an active device heartbeat after open. It requires no Enter/readiness
prompt and sends no probes, streaming commands, or induced faults. Leave the
phone unlocked in the demo with Wi-Fi on; do not change network settings. Active
heartbeats are required throughout. Channel failure or app/logging interruption
is preserved as an interrupted baseline. Normal completion closes and terminates
the demo, with the usual finish cue. Parse handshake K, noop receipt intervals
and GET request starts from the retained raw log; do not assume the spec's
expected rotation interval before measuring it. Record the actual path and
per-request interfaces, which may differ. `--traffic`/`--observe-after` are not
supported in this mode.

## Experimental T15 suspension controller

`run-suspension.py` uses the separate `NetworkFailureSuspension` UI-test scheme
as an OS-state observer. The app is launched normally through devicectl with USB
console; the UI test never launches it. Build the observer first as described in
`objc/demo/WebChanneliOSDemo/NetworkFailureUITests/README.md` (relative to
`webchannel/`). The UI-test Runner needs its own development signing profile.

```sh
python3 -u webchannel/benchmark/networking-failures/tools/run-suspension.py \
  --device TEST_DEVICE_UDID \
  --xctestrun /path/to/build/Products/NetworkFailureSuspension_iphoneosSDK-arm64.xctestrun \
  --output /private/tmp/net-http-t15-short-01 --hold 30
```

No phone operations are required. The UI observer presses Home, positively
observes `runningBackgroundSuspended`, holds from that observation for the
requested device-clock interval, then activates the existing app. The controller
sends one post-resume matched probe and verifies the original PID. It records
both the app and observer clocks (device uptime), state samples, raw logs and
an xcresult. No network settings are changed. Background-entry waiting time is
separate from the observed suspension hold.

The initial controller used for the first three 30 s trials required a resumed
echo. The current revision records `channelObservation` as `echo-resumed`,
`channel-failed`, `echo-resumed-then-channel-failed`, or `no-recovery-observed`;
these are measurements after a valid OS-state hold, not infrastructure failures.
`outcome=suspension-observed` requires a successful observer, exactly one hold,
suspended-state samples throughout the observed hold, sufficient duration, sample
gaps at most 3 s, and the original PID after resume. This does not prove no brief
wakeups between samples. UI errors/termination/missing state evidence remain
interrupted attempts. Schema versions differ between the short and longer
controller revisions; measured source copies identify each.

UI state changes are asynchronous; they do not identify exact kernel transition
times. Full xcresults, device snapshots and process lists can contain personal
device information; keep originals local and publish selected sanitized evidence
as in the dated report. The later T13 series is described below.

## Cellular-only loss handoff (T13)

The operator creates a Network Link Conditioner profile selecting cellular and
100% input/output packet loss. Keep both mobile data and Wi-Fi enabled initially,
and maintain this profile throughout the sequence. Do not use the native helper
to overwrite or clear this profile. First verify selective loss with opt-in
`NETTEST_INTERFACE_ONLY=1` and the `.interfaces` control notification: Wi-Fi-bound
HTTPS must respond, while cellular-bound traffic times out with a satisfied
cellular path. The preflight result must include operator condition metadata
and both probe results; it is validated by `--cellular-proof`.

```sh
python3 -u webchannel/benchmark/networking-failures/tools/run-handoff.py \
  --scenario broken-cellular --device TEST_COREDEVICE_ID \
  --cellular-proof /path/to/cellular-preflight/result.json \
  --output /private/tmp/net-http-t13-trial --hold 150
```

The local runner cues Wi-Fi-only OFF/ON, with no app sends during the hold.
It keeps observing after SDK errors and never reconnects the app. A matching
post-restoration echo or terminal error is recorded, not treated as an automatic
SDK pass. The operator must disable the condition profile when finished. See
[the nine-trial report](../2026-11-14/t13-summary.md) for provenance and limits.
