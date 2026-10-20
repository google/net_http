# XCTest application-relaunch validation

Related benchmark: [Lens experiment specification](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

Status: **complete**. Started: 2026-10-14T06:18:10.889612+00:00. Finished: 2026-10-14T06:31:05.584439+00:00.

One xcodebuild process executes each batch with `-test-iterations N -test-repetition-relaunch-enabled YES -run-tests-until-failure`. Only DeviceStartupProbeTests/testNoNetworking is selected. It requests no WebChannel or HTTP networking; the existing demo remains the host. A passed batch requires all requested stdout markers, distinct application PIDs, networkRequested=false, and xcodebuild exit code 0. No failed test is retried.

## Recorded batches

| Batch | Requested | Recorded markers | Distinct application PIDs | Passed |
|---|---:|---:|---:|---|
| smoke | 20 | 20 | 20 | True |
| validation | 1000 | 1000 | 1000 | True |

For a known pre-test startup failure only, DDI re-enabling and then termination of only the current user's CoreDeviceService may precede another smoke batch. These operations are recorded separately and are not applied periodically during validation. USB is not unplugged and the iPhone is not rebooted.

This experiment validates application process relaunch and startup stability. It does not itself verify fresh HTTP/2 transport in a Lens run.
