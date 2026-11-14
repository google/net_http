# OS-reported suspension observer (experimental)

This separate opt-in UI-test target uses Apple's
[`runningBackgroundSuspended`](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication/state-swift.enum/runningbackgroundsuspended)
state and [`state`](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication/state-swift.property).
The property updates asynchronously: the test pumps updates with XCTest waits.
A blocking Thread.sleep loop left stale foreground values in the first method
probe. Launching the AUT from the UI test also failed to produce a suspended
observation in the tested 45 s window. Normal external launch plus UI observation
worked. These differences are recorded as observations, not an isolated cause.

The UI observer **does not launch the app**. Start the demo normally with
`devicectl` first. It presses Home, waits for the OS-reported suspended state,
optionally holds it while checking the reported state about once per second,
then activates the existing app. It does not use SIGSTOP, debugger pause,
process termination, or an induced condition to create suspension. State samples
are asynchronously observed values, not exact kernel transition timestamps or
proof of no sub-sample wakeups. State reports, device uptime and state names are
printed as `SUSPENSION_PROBE` JSON and attached to the xcresult.

Build the separate `NetworkFailureSuspension` scheme for the physical phone:

```sh
xcodebuild \
  -workspace webchannel/objc/demo/WebChanneliOSDemo/WebChanneliOSDemo.xcworkspace \
  -scheme NetworkFailureSuspension -configuration Debug \
  -destination 'platform=iOS,id=TEST_DEVICE_UDID' \
  -derivedDataPath /private/tmp/net-http-suspension-build \
  -allowProvisioningUpdates build-for-testing
```

The Runner is a separate signed app; Xcode automatic signing may need a new
provisioning profile under the configured development team. No third-party
runtime library is introduced. The normal demo scheme's tests are unchanged.

For the no-network method probe, normally launch the demo with
`NETTEST_AUTORUN=0`, then use `test-without-building` on this scheme. The observer
terminates the app in cleanup by default. The experimental T15 controller
`benchmark/networking-failures/tools/run-suspension.py` instead normally launches
the demo with USB console + `NETTEST_AUTORUN=1`, waits for open, supplies
`SUSPENSION_HOLD_SECONDS` and `SUSPENSION_KEEP_APP=1` in a temporary .xctestrun,
and probes/verifies the original process after resume. It then closes/terminates
it. These variables configure the UI-test runner, not the app. The temporary
.xctestrun stays beside the template to preserve `__TESTROOT__` paths and is
removed after use.

Find the generated `.xctestrun` under the derived-data `Build/Products` directory
(the filename includes the SDK version). The first three requested-30 s trials used a short-recovery controller requiring
a matched resumed echo; all three completed. The current controller also treats
terminal channel errors and a bounded no-response window as measurement outcomes.
It validates exactly one OS-state hold, same PID, sufficient requested duration,
and state-sampling gaps no larger than 3 s. A channel failure is not substituted
for a failed UI observer or a missing suspension hold. Unit tests cover both
recovery/failure classification and invalid state evidence.

Validated on the physical iPhone in the 2026-11-14 method probes and first
30 s requested-suspension trial; see the dated suspension report for evidence.
