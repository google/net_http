# iOS networking failure tests — 2026-11-12

## Automatic rerun

**Completed:** 36 native-controlled blackhole/periodic-send/fail-fast trials.
See the [final automated summary](automatic-native/summary.md) for outcomes,
deviations, verified cleanup, and the explicit list of unexecuted T9–T15 tests.

An autonomous fresh-process rerun started at **14:27 JST** using the native
Apple-framework fault controller and opt-in demo instrumentation. The SDK source
is unchanged. Complete per-trial artifacts and live progress are under
[`automatic-native/`](automatic-native/); see its `report.md`, `analysis.md`,
`results.json`, `status.json`, and `environment.json`. The demo instrumentation
patch is preserved there. Earlier manual trials below remain preliminary and
are not silently merged with the new runs.

Remote main at audit was `398cf95410bef8ab630d701e5d9a0f5b351718a4` (35 commits
ahead of the local checkout). GitHub comparison showed no changes under
`webchannel/objc/imported_src`; demo differences were UI/latency-display changes.
The precise local base and instrumentation are recorded, rather than claiming
the checkout was updated to latest main.

## Environment

- Client commit: `9c0b94f708dd1eb8ac89043fe0752c5edb45c715` (local origin/main at preparation).
- Device: iPhone SE (3rd generation), iOS 27.2.1 (Xcode device listing).
- Endpoint: hosted staging `/staging/channel/generator`.
- App: Debug demo, freshly launched; default Generator options, no messages sent.
- Fault: device Network Link Conditioner, preset 100% Loss, input/output loss both 100% (operator reported).
- Wi-Fi network, carrier, and confirmation that cellular data was disabled: not yet recorded.
- Raw console: `device-console.log`. Prefix timestamps are Mac receipt times in JST, not device event timestamps; buffering and clock offset may affect timing.

## T1 — run 1

- Fault duration: **11.40 s**, measured by operator stopwatch.
- Exact fault start/end wall-clock times: not captured.
- Observations through 13:02:29 JST: one successful opening handshake; all back-channel requests remain at attempt 1 with the same SID; no logged timeout, error, or second handshake. Noop array IDs 1–4 received consecutively. Normal back-channel rotation occurred at about 60 s.
- Outcome: **consistent with T1 expected behavior; provisional**. No precise fault-window correlation or independent confirmation of packet loss is available. Noop continuity is observed; application-message continuity was not exercised by this idle-stream test.
- Confound: operator switched to Settings to toggle the conditioner, putting the app in the background. Suspension/lifecycle transitions were not instrumented.
- Repetitions: 3 fault injections completed on the same continuous session.

## T1 — run 2

- Fault duration: **11.67 s**, measured by operator stopwatch.
- Exact fault start/end wall-clock times: not captured. Completion reported before log review at 13:04:10 JST.
- Observations through 13:03:59 JST: same SID as run 1, all back-channel requests at attempt 1, no logged timeout, error, or new handshake. Noop IDs continue consecutively through 9. GET completion and replacement at approximately 60 s are normal rotation, without a retry.
- Outcome: **consistent with T1 expected behavior; provisional**, with the same fault-window correlation and Settings/background limitations as run 1. These are repeated fault injections on one continuous session, not independent fresh-session trials.

## T1 — run 3

- Fault duration: **11.85 s**, measured by operator stopwatch.
- Exact fault start/end wall-clock times: not captured. Completion reported before review at 13:05:01 JST.
- Observations through 13:04:59 JST: same SID, back-channel attempts remain 1, no logged timeout, error, or new handshake. Consecutive noop IDs continue through 12, with normal GET rotation.
- Outcome: **consistent with T1 expected behavior; provisional**, subject to the limitations recorded above.

## T1 summary

| Run | Operator-measured loss duration | Observed behavior | Verdict |
| --- | --- | --- | --- |
| 1 | 11.40 s | Same session, no timeout/retry/new handshake logged | Consistent, provisional |
| 2 | 11.67 s | Same session, no timeout/retry/new handshake logged | Consistent, provisional |
| 3 | 11.85 s | Same session, no timeout/retry/new handshake logged | Consistent, provisional |

These short idle tests alone do not independently demonstrate that the conditioner blocked traffic: a fault may fall between keep-alives. A longer fault with observable timeout is needed to validate fault injection. All runs also include uninstrumented Settings transitions.

## T2 — run 1

- Fault duration: **51.91 s**, measured by operator stopwatch. Exact start/end times not captured; completion reported before review at 13:06:57 JST.
- Observations: no timeout or retry logged. Noops received at 13:05:29.100, 13:05:59.113, 13:05:59.263 and 13:06:29.206 JST, with the same SID and normal GET rotation. No interruption consistent with a 51.91 s bidirectional blackhole is visible in this interval.
- Verdict: **inconclusive — fault injection unverified**. Do not classify as a client pass/fail. Validate conditioner activation and the actual network path before further repetitions.
- T1 reassessment: all three earlier observations remain valid, but they cannot establish successful behavior under loss until fault injection is verified. Treat them as inconclusive for the blackhole requirement.

## Measurements

## T4 — trial 1 (fresh session)

- Raw log `device-console-T4-r1.log`, marker label `T4-r1`.
- Start 13:48:10.281 JST; stop 13:50:43.138 JST. Monotonic interval **152.881 s**, alarm at 150.002 s. Wall-clock interval is 152.857 s; use monotonic duration rather than assuming the Mac wall clock is constant.
- Last chunk 13:47:45.647; initial timeout 13:48:30.621: **44.974 s** after last chunk / **20.340 s** after start marker (wall-clock receipt differences).
- Immediate retry attempt 2 at 13:48:30.626, status 0 at 13:48:48.694. Attempt 3 at 13:49:01.616 (12.920 s after prior completion), timeout 13:49:46.610. Attempt 4 at 13:50:11.416 (24.804 s after prior completion).
- HTTP **400** at 13:50:46.622; fatal error **4** and close at 13:50:46.623: **3.485 s** after stop marker / **156.342 s** after start marker. No new handshake; pending/undelivered lists empty.
- Verdict: **consistent with T4's expected retry then fatal 400 outcome**. Manual-marker, background-transition and wall-clock timing limitations apply. Server-side session state not independently inspected. Trials 2–3 pending.

## T3 — trial 3 (fresh session)

- Raw log `device-console-T3-r3.log`, marker label `T3-r3`.
- Start 13:45:16.650 JST; stop 13:46:49.245 JST; monotonic interval **92.597 s**, alarm at 90.005 s.
- Last chunk 13:44:54.693; timeout 13:45:39.691: **44.998 s** after last chunk, **23.041 s** after start marker.
- Immediate retry attempt 2 at 13:45:39.696, status 0 at 13:45:57.771. Attempt 3 at 13:46:09.991 (12.220 s after completion), status 0 at 13:46:34.058. Attempt 4 at 13:47:01.995 (27.937 s after completion).
- HTTP **400** at 13:47:02.328; error **4** and close at 13:47:02.331: **13.086 s** after stop marker / **105.681 s** after start marker. Pending/undelivered lists empty. No new handshake.
- Verdict: **consistent with T3's allowed fatal 400 outcome**, with the previously documented timing and instrumentation limitations.

## T3 summary

| Trial | Monotonic marker interval | Timeout after last chunk | Result after restoration | Close after stop marker |
| --- | --- | --- | --- | --- |
| 1 | 93.415 s | 45.000 s | HTTP 400, error 4, closed | 19.019 s |
| 2 | 93.094 s | 44.998 s | HTTP 400, error 4, closed | 11.708 s |
| 3 | 92.597 s | 44.998 s | HTTP 400, error 4, closed | 13.086 s |

All three fresh-session trials ended in HTTP 400 after restoration, consistent with the specification's allowed T3 outcome. Server-side session expiry is a possible explanation, not independently verified by the available response metadata. These runs cover about 93 s, not the full 60–120 s range.

## T3 — trial 2 (fresh session)

- Raw log `device-console-T3-r2.log`, marker label `T3-r2`.
- Start 13:40:59.821 JST; stop 13:42:32.913 JST; monotonic elapsed **93.094 s**, alarm at 90.005 s.
- Last chunk 13:40:56.869; first timeout 13:41:41.867 (**44.998 s** after last chunk, **42.046 s** after start marker).
- Immediate retry attempt 2 at 13:41:41.872; status 0 at 13:41:59.944. Attempt 3 at 13:42:09.395, about 9.45 s after prior completion.
- HTTP **400** at 13:42:44.619; error **4** and close at 13:42:44.621, **11.708 s** after stop marker / **104.800 s** after start marker. Pending/undelivered lists empty; no new handshake.
- Verdict: **consistent with T3's allowed fatal 400 outcome**, subject to the timing/instrumentation limitations above. Trial 3 pending.

## T3 — trial 1 (fresh session)

- Raw log `device-console-T3-r1.log`, markers label `T3-r1`.
- Start 13:37:30.537 JST; stop 13:39:03.949 JST; monotonic interval **93.415 s** (90 s alarm fired at 90.005 s).
- Last chunk 13:37:03.569. Initial timeout 13:37:48.569: **45.000 s** after last chunk, **18.032 s** after start marker.
- Retry attempt 2 at 13:37:48.573; status 0 at 13:38:09.520. Attempt 3 at 13:38:16.294 (6.774 s after failure), then timeout at 13:39:01.290.
- Attempt 4 at 13:39:22.770 (21.478 s after previous completion). HTTP **400** at 13:39:22.966; fatal error **4** and close at 13:39:22.968, **19.019 s** after stop marker / **112.431 s** after start marker.
- Pending and undelivered data lists empty. No new handshake. Exact HTTP response body / underlying NSError not available in console; do not infer server-side expiry mechanism solely from 400.
- Verdict: **consistent with T3's allowed fatal 400 outcome after a 60–120 s blackhole**. No same-session recovery in this trial. Manual-marker and Settings-transition limitations apply. Trials 2–3 pending.

## T2 — session 6, timed trial 3

- Label `T2-session6-r3`. Start marker 13:34:33.341 JST; stop 13:35:30.488 JST. Monotonic elapsed **57.149 s**, alarm at 50.005 s.
- Last chunk 13:34:16.588; timeout 13:35:01.588: **45.000 s** after last chunk and **28.247 s** after start marker.
- Immediate retry at 13:35:01.592 (attempt 3 of the existing GET, which was already attempt 2 from the preceding trial). Status 0 at 13:35:20.524; next retry attempt 4 at 13:35:25.918.
- Same-SID HTTP 200 and consecutive noop IDs 9–10 received at 13:35:30.128, **0.360 s before** the stop Enter marker. Thus Enter trails actual restoration; do not report a negative network recovery latency.
- Verdict: **PASS for observed T2 timeout/retry/same-session recovery**, with manual-marker and background-transition uncertainty. The three injections share one session and some in-flight requests; these are not independent fresh-session trials.

## T2 timed-trial summary

| Trial | Marker duration | Timeout after last chunk | Same-session recovery | Result |
| --- | --- | --- | --- | --- |
| 1 | 52.924 s | 44.999 s | Yes | Observed behavior passes |
| 2 | 53.905 s | 45.000 s | Yes | Observed behavior passes |
| 3 | 57.149 s | 45.000 s | Yes | Observed behavior passes |

All three timed injections recovered without a new handshake. This establishes the scoped T2 behavior on this session, not full-spec completion (transport/path metrics and application-message delivery remain unmeasured).

## T2 — session 6, timed trial 2

- Label `T2-session6-r2`; same continuous session as timed trial 1.
- Start marker 13:32:52.164 JST; stop marker 13:33:46.067 JST. Monotonic elapsed **53.905 s**; alarm at 50.002 s.
- Last chunk 13:32:45.576; timeout 13:33:30.576: **45.000 s** after last chunk, **38.412 s** after start marker.
- Retry GET attempt 2 at 13:33:30.580, **4 ms** after timeout. Same SID.
- HTTP 200 and noop IDs 6–7 received at 13:33:46.546: **0.479 s** after stop marker. No new handshake or fatal error.
- Verdict: **PASS for observed T2 timeout/retry/same-session recovery**, with manual-marker/Settings-transition uncertainty. Noop IDs remain consecutive; application-message continuity not exercised. Two timed T2 injections completed; third pending.

## T2 — session 6, timed trial 1

- Raw log: `device-console-session6.log`; timer records: `fault-markers.jsonl`. Operator retained label `T2-2`; correlate this specific record by start `2026-11-12T04:30:44.269Z`, not label alone.
- Start marker: 13:30:44.269 JST. Stop marker: 13:31:37.191 JST. Monotonic marker interval: **52.924 s**. Alarm fired at 50.005 s. Markers reflect Enter presses, not exact conditioner switch times.

| Event | Mac receipt/marker time (JST) | Observation |
| --- | --- | --- |
| Last received chunk before fault | 13:30:26.763 | Noop ID 1 |
| Operator start marker | 13:30:44.269 | 100% Loss activation reported |
| Back-channel timeout | 13:31:11.762 | 44.999 s after last chunk; 27.493 s after start marker |
| First retry | 13:31:11.766 | attempt 2, same SID; effectively immediate |
| First retry fails | 13:31:29.836 | HTTP status 0; underlying NSError unavailable |
| Operator stop marker | 13:31:37.191 | Loss deactivation reported |
| Second retry | 13:31:42.926 | attempt 3, same SID; about 13.09 s after prior failure |
| Receive resumes | 13:31:43.269 | HTTP 200, noop IDs 2 and 3; 6.078 s after stop marker |

- Verdict: **PASS for the observed T2 timeout/retry/same-session recovery behavior**, subject to manual-marker and Settings-transition timing uncertainty. Fault effect is now evident on the demo connection. No new handshake, no fatal channel error in this trial. Idle noop IDs remain consecutive; application-message gaps/duplicates are not tested.
- This does not retroactively validate the earlier T1 fault injections. Additional T2 repetitions and full requested instrumentation remain pending.

## Timer exercise / T2-2 markers

- File `fault-markers.jsonl` records a 50 s timer labeled T2-2: start 04:24:18.253Z, alarm after 50.005 s, stop 04:25:11.845Z, monotonic elapsed 53.594 s.
- Do not count these markers as a valid T2 trial: the captured session had already closed with HTTP 400 at Mac time 13:23:41 JST, and its app process terminated at 13:23:55 JST, before the marker start. No captured open channel spans these markers. Actual conditioner operations for this exercise are unconfirmed.

## Fault-injection diagnostic

- Clock audit around 13:15 JST: read-only `sntp` queries returned +2.084307 ±0.007975 s (time.google.com) and +2.085192 ±0.009837 s (time.apple.com): Mac clock is approximately 2.085 s behind these samples. `timed` is running; `/etc/ntp.conf` names time.apple.com. Some NTP exchanges timed out, and a recent timed log rejected an NTP sample. System automatic-time setting could not be read without administrator authentication. Clock was not changed. Do not apply this single measured offset retrospectively as a proven constant.
- Demo relaunched at Mac receipt time 13:15:02 JST; new console capture is `device-console-session2.log`. Capture writes only to the file, avoiding mirrored console-output backpressure. Fresh connection pending.

- Operator confirms Safari cannot communicate with 100% Loss enabled and cellular data is off. This confirms an effect on Safari; scope of the effect on the demo's existing connection is still unverified.
- Last console entry at review around 13:10:50 JST is 13:08:59 JST. Console capture is still running, but a stale console cannot establish current network behavior; foreground/resume and capture freshness must be checked before further verdicts.
- At 13:12:21 JST new console events arrived: back-channel TIMEOUT, immediate retry GET at attempt 2, HTTP 400, error code 4, then channel aborted/closed. Pending and undelivered data lists are empty. Operator reports the UI displays `UnknownSessionID`.
- This is evidence of timeout/retry/fatal response during the subsequent diagnostic period, not a result attributable specifically to the earlier 51.91 s T2 injection. Time without foreground execution and actual fault duration are not known; do not infer a 202 s network timeout from the gap between console lines.
- The old session is no longer usable. Preserve logs, disable conditioner and establish a fresh session before the next trial.

- M1 partial: opening response advertises 30000 ms keep-alive. First two observed noop intervals are about 30.1 s; initial GET rotated after about 60.4 s (Mac receipt times).
- Other measurements pending. No exported task metrics or NWPathMonitor trace collected for this run.
