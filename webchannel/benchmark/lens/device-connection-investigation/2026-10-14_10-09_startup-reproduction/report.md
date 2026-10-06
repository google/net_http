# Device XCTest startup investigation

Related benchmark: [Lens experiment specification](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

Status: **validation-failed**. Started: 2026-10-14T03:07:33.708247+00:00. Finished: 2026-10-14T04:08:03.653072+00:00.

## Environment and procedure

Physical iPhone SE (3rd generation), iPhone14,6. The existing WebChanneliOSDemo app remains the XCTest host, but the selected test does not create or connect a WebChannel or request HTTP networking. The inherited CoreDevice state was not reset before the baseline.

Run up to 300 baseline invocations in separate xcodebuild processes, stopping at the first failure. For a verified notification-observation startup failure, test 60 seconds of waiting, then DDI service re-enabling, then termination of only the current user's CoreDeviceService, stopping the recovery sequence at the first successful probe. USB is never unplugged by this script. Unknown failures stop the investigation.

Validation requests 1000 further invocations. If recovery worked, repeat that action proactively every 100 invocations. Every validation invocation must pass; the first failure stops validation. A successful validation establishes an observed mitigation for this environment, not a permanent OS fix or proven root cause.

## Recorded test invocations

| Phase | Passed | Startup failure | Other failure |
|---|---:|---:|---:|
| baseline | 250 | 1 | 0 |
| recovery-wait | 1 | 0 | 0 |
| validation | 400 | 0 | 1 |

Recovery strategy used for validation: `wait`. All attempted invocations and result bundles are preserved. No Lens latency data was measured.
