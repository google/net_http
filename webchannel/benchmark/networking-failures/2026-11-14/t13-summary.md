# T13: Wi-Fi handoff to available but blackholed cellular

Three valid short-hold measurements and three 90 s requested-hold measurements.
Three 150 s requested-hold measurements complete this nine-trial idle handoff series.

The operator created `Mobile 100% Loss` in the iPhone Network Link Conditioner,
selecting cellular and 100% input/output packet loss. Wi-Fi and mobile data
were both enabled initially. USB carried console/control traffic. The host
did not modify the condition profile or toggle network settings.

## Fault preflight

Apple Network.framework connections required each interface separately. The
probe sent a minimal HEAD request to the same HTTPS generator host. HTTP 400
proves connectivity here; it is not an SDK UnknownSessionID failure. Without
loss, both interfaces responded. With the profile enabled, Wi-Fi (en0)
responded while cellular (pdp_ip0) timed out after 8.463 s despite a satisfied
cellular-only path. No SDK channel was opened. This separate preflight is not
a packet capture or continuous measurement of cellular loss during the trial.

[Baseline](t13-preflight-baseline-01/result.json),
[selective-loss preflight](t13-preflight-mobile-loss-01/result.json).

## First handoff measurement

After a baseline echo, audio asked the operator to disable Wi-Fi only, return
to the app, wait for the restore cue, and restore Wi-Fi. Cellular and the loss
profile stayed enabled. No app messages were sent during the fault hold. One
matching echo probe was sent after foreground Wi-Fi readiness, with no app
reconnect.

| Measurement | Observed |
| --- | ---: |
| Requested hold | 50 s |
| Device elapsed at restore cue | 50.270 s |
| Cellular fault milestone → first satisfied Wi-Fi callback | 59.762 s |
| Cellular fault milestone → foreground-ready Wi-Fi milestone | 59.870 s |
| Ready Wi-Fi milestone → matched echo | 1.069 s |
| Channel opens / unique request SIDs | 1 / 1 |
| SDK channel error callbacks | 0 |

Result: `echo-resumed` in the original session. The fault milestone was
satisfied, cellular=true, wifi=false. Request retries remain in the logs;
absence of channel errors does not imply every request succeeded. Path
callbacks describe routing, not exact physical switch times. The echo
interval includes the probe and response. All intervals use device uptime,
without subtracting host and device wall clocks.

[Analysis](t13-short-01/analysis.json), [result](t13-short-01/result.json),
[app events](t13-short-01/device-events.jsonl),
[cue journal](t13-short-01/runner-events.jsonl).

An earlier attempt was stopped at readiness because generic instructions
incorrectly requested clearing the profile. It is
[excluded](t13-excluded-before-start-01/result.json); no app launch or fault
sequence took place. The instruction was corrected before the valid run.
The current runner passed all 27 deterministic runner tests.

Device identity snapshots are omitted and identifying device strings are
replaced in exported evidence. Originals remain local under
`/private/tmp/net-http-t13-*`. Source copies and SHA-256 manifests accompany
the exports; provenance notes distinguish measured from later reference
copies. This installed app uses opt-in interface probe protocol 3; previous
T15 measurements used protocol 2. SDK behavior is unchanged.

## Second handoff measurement

The same operator-maintained profile and 50 s requested hold were used.
No additional interface preflight was run between these two trials. The
channel again resumed with one open, one unique SID, and no SDK errors.

| Measurement | Observed |
| --- | ---: |
| Device elapsed at restore cue | 50.980 s |
| Cellular fault → first Wi-Fi callback | 63.327 s |
| Cellular fault → foreground-ready Wi-Fi milestone | 63.539 s |
| Ready Wi-Fi milestone → matched echo | 1.063 s |

[Second analysis](t13-short-02/analysis.json), [result](t13-short-02/result.json),
[app events](t13-short-02/device-events.jsonl), [cue journal](t13-short-02/runner-events.jsonl).

## Three-trial short-hold comparison

All three trials resumed the original session, with one open, one SID, and no
SDK channel errors each. The operator maintained the cellular-only profile
throughout; the separate interface preflight was not repeated between trials.

| Trial | Requested hold | At restore cue | Fault → ready Wi-Fi | Ready Wi-Fi → echo |
| --- | ---: | ---: | ---: | ---: |
| [1](t13-short-01/result.json) | 50 s | 50.270 s | 59.870 s | 1.069 s |
| [2](t13-short-02/result.json) | 50 s | 50.980 s | 63.539 s | 1.063 s |
| [3](t13-short-03/result.json) | 50 s | 50.022 s | 66.374 s | 1.253 s |

[Combined analysis](t13-short-analysis.json), [third app events](t13-short-03/device-events.jsonl),
[third cue journal](t13-short-03/runner-events.jsonl).

Observed path intervals include the operator action and Wi-Fi reassociation
after the restore cue; they are longer than the requested hold. Three
recoveries under this condition do not establish behavior for longer faults.

## Medium hold: first measurement

With the same manually maintained cellular-only loss profile, the requested
hold was extended to 90 s. The original session again resumed: one open, one
unique SID, and no SDK channel error. The interface preflight was not repeated.

| Measurement | Observed |
| --- | ---: |
| Requested hold | 90.000 s |
| Device elapsed at restore cue | 90.277 s |
| Cellular fault → first Wi-Fi callback | 103.436 s |
| Cellular fault → foreground-ready Wi-Fi milestone | 103.660 s |
| Ready Wi-Fi milestone → matched echo | 1.308 s |

[Medium trial analysis](t13-medium-01/analysis.json), [result](t13-medium-01/result.json),
[app events](t13-medium-01/device-events.jsonl), [cue journal](t13-medium-01/runner-events.jsonl).

This first medium-hold observation is complemented by the second trial below.

## Medium hold: three-trial comparison

The same manually maintained profile was used. All three trials resumed the original
session, with one open, one SID, and no SDK channel errors each. No additional
interface preflight was run. The medium-hold repetitions are complete.

| Trial | Requested hold | At restore cue | Fault → ready Wi-Fi | Ready Wi-Fi → echo |
| --- | ---: | ---: | ---: | ---: |
| [1](t13-medium-01/result.json) | 90 s | 90.277 s | 103.660 s | 1.308 s |
| [2](t13-medium-02/result.json) | 90 s | 90.109 s | 104.129 s | 1.668 s |
| [3](t13-medium-03/result.json) | 90 s | 90.555 s | 107.998 s | 1.193 s |

[Combined medium-hold analysis](t13-medium-analysis.json),
[second app events](t13-medium-02/device-events.jsonl),
[second cue journal](t13-medium-02/runner-events.jsonl).

[Third medium-hold app events](t13-medium-03/device-events.jsonl),
[third cue journal](t13-medium-03/runner-events.jsonl).

## Long hold: first measurement

The same manually maintained cellular-only loss profile was used for a 150 s
requested hold. After Wi-Fi returned, GET attempt 4 received HTTP 400 and the
SDK emitted error 4 / UnknownSessionID. No app reconnect was performed.
Server session expiry is a possible explanation, not independently verified.
The interface preflight was not repeated before this trial.

| Measurement | Observed |
| --- | ---: |
| Requested hold | 150.000 s |
| Device elapsed at restore cue | 150.158 s |
| Cellular fault → first Wi-Fi callback | 162.067 s |
| Cellular fault → foreground-ready Wi-Fi milestone | 162.067 s |
| Ready Wi-Fi milestone → terminal error | 2.628 s |
| Cellular fault → terminal error | 164.695 s |

One channel open and one unique request SID were observed. No matching recovery
echo arrived. The runner completed the fault sequence; its `l3-observed` outcome
is an infrastructure observation, not an SDK pass. See the second trial below.

[Long trial analysis](t13-long-01/analysis.json), [result](t13-long-01/result.json),
[app events](t13-long-01/device-events.jsonl), [cue journal](t13-long-01/runner-events.jsonl).

## Long hold: three-trial comparison

All three 150 s trials ended after Wi-Fi restoration with HTTP 400 / SDK error 4
(UnknownSessionID). Each retained one open and one unique SID; no app reconnect
was attempted. The same operator-maintained profile was used without a new
interface preflight. All three long-hold repetitions are recorded.

| Trial | At restore cue | Fault → ready Wi-Fi | Ready Wi-Fi → error |
| --- | ---: | ---: | ---: |
| [1](t13-long-01/result.json) | 150.158 s | 162.067 s | 2.628 s |
| [2](t13-long-02/result.json) | 150.998 s | 158.338 s | 0.935 s |
| [3](t13-long-03/result.json) | 150.150 s | 162.846 s | 0.988 s |

[Combined long-hold analysis](t13-long-analysis.json),
[second app events](t13-long-02/device-events.jsonl),
[second cue journal](t13-long-02/runner-events.jsonl).

[Third long-hold app events](t13-long-03/device-events.jsonl),
[third cue journal](t13-long-03/runner-events.jsonl).

## Nine-trial result

| Requested hold | Trials | Observation |
| --- | ---: | --- |
| 50 s | 3 | Original session echo resumed in 3/3; no SDK channel errors |
| 90 s | 3 | Original session echo resumed in 3/3; no SDK channel errors |
| 150 s | 3 | HTTP 400 / UnknownSessionID after Wi-Fi restoration in 3/3 |

The fault path remained satisfied and cellular-only during the recorded holds.
These idle handoff measurements do not establish streaming/pending-write
behavior or an exact session-expiry threshold. Cellular loss was independently
probed before the series, not continuously measured throughout. The operator
is asked to disable the manually maintained profile after this series; the
host does not automatically restore phone settings.
