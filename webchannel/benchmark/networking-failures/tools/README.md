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
