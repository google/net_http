# Mac-controlled device conditions investigation

## Confirmed GUI

Apple documents Window → Devices and Simulators → Devices → selected iPhone → Device Conditions → Condition / Profile → Start / Stop.

- https://help.apple.com/xcode/mac/current/en.lproj/devdf21fe239.html
- https://developer.apple.com/videos/play/wwdc2019/422/

This can keep the test app in the foreground while changing network conditions from the Mac. Conditions stop if the device disconnects from Xcode. Profile availability must be checked on the actual connected device.

Local observation: Xcode 26.6 has the Device Conditions section for the connected iPhone SE. It currently says **No Conditions Available**, while copying shared cache symbols (observed at 4%, then 12%). This does not establish whether preparation completion will fix profile availability. No condition was activated from Xcode during this investigation.

Follow-up: after preparation, GUI now exposes **Network Link**, profile **100% packet loss**, with both downlink and uplink packet loss ratios shown as **100%**. Button reads **Start** (not active). Profile availability on this exact device is confirmed. The agent can operate Start/Stop through the available UI automation; activation and timed release have not yet been exercised.

## CLI

The installed devicectl public help has no network-condition operation under device/list/info. This is limited to inspected help, not a claim that no Apple-internal API exists.

The third-party pymobiledevice3 project implements a DVT ConditionInducer with list/set/clear and CLI `developer dvt condition list`, `set <profile_identifier>`, `clear`.

- https://github.com/doronz88/pymobiledevice3/blob/master/pymobiledevice3/cli/developer/dvt/__init__.py
- https://doronz88.github.io/pymobiledevice3/latest/api/dvt/

The set command keeps a connection open until Return. A Python controller could use the underlying API, a monotonic duration, and clear in finally; actual iOS compatibility and available profiles must be verified before use. Package is not installed in the checked default Python environment. No installation or device-condition mutation performed.

## Test status

## Native helper implemented and exercised

See `../tools/device-condition.m`, its build script and README. Uses Apple's
device discovery, native DTX channel, and native message encoding; no third-party
package installed or executed. The higher-level session path did not become
ready in the CLI; the device's asynchronous DTX-channel creation succeeded.

Successful 3 s smoke test: profile readback confirmed active, release request
occurred 3.011 s after enable-ack event, and inactive readback followed about
40 ms later. SIGTERM test also completed cleanup and verified inactive. A final
independent `list` process confirmed all advertised groups inactive. Raw outputs:
`native-smoke-3s-fixed.jsonl`, `native-sigterm.jsonl`, `native-final-state.jsonl`.
An earlier argument-construction crash is preserved in `native-smoke-3s.jsonl`;
`native-after-crash.jsonl` confirmed no active condition, and the variadic call
was corrected. No PR test repetition is claimed for these helper smoke tests.

## Protocol essence (source review, no third-party installation)

Reviewed upstream ConditionInducer service wrapper, DvtProvider, DtxServiceProvider, and DTXConnection sources. No third-party code was installed or executed.

- Device service channel: `com.apple.instruments.server.services.ConditionInducer`.
- Enumerate: `availableConditionInducers`, yielding groups with identifiers and profiles.
- Activate: `enableConditionWithIdentifier:profileIdentifier:` with the selected group identifier and profile identifier; discover these rather than guessing from the display name.
- Deactivate: `disableActiveCondition` (upstream sends without waiting for a reply).
- iOS 17+ provider uses RSD service `com.apple.instruments.dtservicehub`; underlying DTX setup includes capability negotiation, channel opening, message serialization/framing and replies. The three service operations alone are not a standalone socket client.

Additional source:

- https://raw.githubusercontent.com/doronz88/pymobiledevice3/master/pymobiledevice3/services/dvt/instruments/condition_inducer.py
- https://raw.githubusercontent.com/doronz88/pymobiledevice3/master/pymobiledevice3/services/dvt/instruments/dvt_provider.py
- https://raw.githubusercontent.com/doronz88/pymobiledevice3/master/pymobiledevice3/dtx_service_provider.py
- https://raw.githubusercontent.com/doronz88/pymobiledevice3/master/pymobiledevice3/dtx/connection.py

Local Apple binary inspection (strings, read-only): Xcode's `DVTInstrumentsFoundation.framework` contains `DTConditionInducerService` and selectors including `listAvailableConditionInducersWithReply:`, `enableConditionInducerWithIdentifier:profileIdentifier:reply:` and `disableActiveConditionInducerWithReply:`. This is evidence of a possible Apple-bundled implementation route, not a verified callable/public API. A small native helper might reuse the transport rather than reimplement it; initialization, device selection, compatibility, and cleanup still require investigation.

Timing design for any future helper: keep transport alive, record a monotonic bracket around activation, schedule deactivation locally, record the deactivation bracket, and confirm stopped state. API/UI command times bound host operations; actual onset of packet loss still needs correlation with received traffic or capture. No timing guarantee established by this review.

Operator reports forgetting the start Enter for the latest T4-r2 attempt. Treat that attempt as unmeasured, and do not count it among the three required repetitions. Preserve any console output as diagnostic data. T4 trial 1 is recorded; trials 2–3 remain pending.
