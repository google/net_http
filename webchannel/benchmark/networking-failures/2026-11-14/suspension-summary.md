# T15: OS-observed suspension measurements — 2026-11-14

9 valid OS-hold observations recorded so far; target is three each at 30 / 90 / 150 s.
Method-validation probes are separate from these networking measurements.

| Condition | Run | OS-observed hold (s) | Home → suspend observation (s) | Channel observation | SDK errors / HTTP failures | Same PID |
| --- | --- | ---: | ---: | --- | --- | --- |
| short | [1](t15-short-01/result.json) | 30.415 | 32.663 | echo-resumed | [] / [] | True |
| short | [2](t15-short-02/result.json) | 30.439 | 32.545 | echo-resumed | [] / [] | True |
| short | [3](t15-short-03/result.json) | 30.450 | 32.558 | echo-resumed | [] / [] | True |
| medium | [1](t15-medium-01/result.json) | 90.354 | 32.552 | channel-failed | [4] / [400] | True |
| medium | [2](t15-medium-02/result.json) | 90.237 | 32.574 | channel-failed | [4] / [400] | True |
| medium | [3](t15-medium-03/result.json) | 90.229 | 32.634 | channel-failed | [4] / [400] | True |
| long | [1](t15-long-01/result.json) | 150.244 | 32.601 | channel-failed | [4] / [400] | True |
| long | [2](t15-long-02/result.json) | 150.097 | 32.555 | channel-failed | [4] / [400] | True |
| long | [3](t15-long-03/result.json) | 150.267 | 32.558 | channel-failed | [4] / [400] | True |

## Method

Physical iPhone, SDK/app networking code from PR #130, default failFast off.
The app is normally launched with devicectl and USB console; the UI observer
does not launch it. After channel open, the observer presses Home and waits
for an explicit XCUIApplication.State.runningBackgroundSuspended report.
It holds from that observation while checking state about once per second,
then activates the existing app. The controller observes a matching echo,
terminal channel failure or a bounded no-response window and checks PID.
No network condition, forced suspension, debugger pause or app reconnect
is used. Each run uses a fresh process/session; normal cleanup closes and
terminates the app. Network settings are not changed.

OS observer and app both use device system uptime. The asynchronously
reported state is not an exact kernel timestamp. State sampling does not
prove no brief wakeups between samples. All retained valid holds have only
suspended-state samples and no sampling gap greater than 3 s. Home/background
waiting is reported separately from the requested suspension interval.
UIApplication heartbeat raw state 2 means background; it is not the
XCUIApplication suspended-state proof.

The first short controller required a resumed echo. All three attempted
short trials completed with that echo. The longer-case revision accepts
channel failure and no-recovery-observed as measurement outcomes, while
UI/state/PID failures remain interrupted attempts. This version difference
is explicit; measured controller/observer snapshots and hashes identify
each run. The observer Swift source is shared across duration groups.
A bounded no-response outcome is not proof that the channel can never recover.
Raw logs retain request attempts and status; underlying NSError -1005 is
not exposed by current SDK callbacks.

## Method-validation probes

- Probe 01: UI test launched the app; blocking Thread.sleep polling left
  reported foreground state stale. Failed; original source was not captured.
- Probe 02: XCTest waits allowed state updates; background was reported but
  no suspension within 45 s while UI-test launched. Failed; source retained.
- Probe 03: normal external no-network launch plus UI observer confirmed
  suspended state and foreground return. Passed; source retained.
These probes do not count as T15 networking repetitions or isolate all
causes of differences between launch modes. Their sanitized logs and state
records are under suspension-method-probe-01/02/03.

Apple definitions: [runningBackgroundSuspended](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication/state-swift.enum/runningbackgroundsuspended),
[asynchronous state updates](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication/state-swift.property).

## Evidence and remaining work

Each run retains result/analysis JSON, app and UI state logs, a filtered demo
process record, measured source snapshots and SHA-256 hashes. Full device
snapshots, process lists, xcresults and diagnostic archives remain local.
Identifiers/names/home paths are replaced with placeholders in published
copies; PID, session/network values and observed times remain as evidence.
Original outputs: `/private/tmp/net-http-t15-CASE-20261114-0N`.
UI Runner build uses Apple automatic signing under the configured team;
no third-party runtime is introduced. The normal demo scheme is unchanged.
At the time of these T15 measurements, T13 was still unexecuted. The later
[nine-trial T13 series](t13-summary.md) is recorded separately. No new results
have been pushed into PR #130 by this follow-up.

[Machine-readable aggregate](suspension-analysis.json).

## Completed comparison

All nine requested OS-observed holds completed without a UI-test or cleanup
error. Every trial retained the original PID, one autorun start and one channel
open. No application reconnect was requested.

| Requested hold | Repetitions | Observed hold range (s) | Outcome |
| --- | ---: | ---: | --- |
| 30 s | 3 | 30.415–30.450 | Same-session echo resumed in 3/3; no SDK errors |
| 90 s | 3 | 90.229–90.354 | HTTP 400 / SDK error 4 (UnknownSessionID) after resume in 3/3 |
| 150 s | 3 | 150.097–150.267 | HTTP 400 / SDK error 4 (UnknownSessionID) after resume in 3/3 |

These observations match the specified short-suspension continuation and
permitted medium/expected long Unknown SID outcomes. HTTP 400 plus client
classification does not independently determine the server's exact expiry
policy or lifetime. No NSError -1005 sequence or exact packet transition
is claimed. T13 was subsequently measured; see [its report](t13-summary.md) and
[current measurement limits](pending-tests.md).

Validation: 25 deterministic Python tests passed; the UI observer built for
the physical device, then each of the nine real UI-observer executions
passed. Published app/UI event correspondence, selected same-PID records,
state sample gaps and measured source hashes pass validate-suspension.py.
See [validation.json](validation.json). The app and Mac sleep-prevention
wrapper have finished; no network setting was changed by this suite.
