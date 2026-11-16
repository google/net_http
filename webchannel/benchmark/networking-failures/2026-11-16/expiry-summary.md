# Suspension expiry follow-up

**Nine valid additional holds completed:** three each at 45 / 60 / 75 s. Every trial resumed the original session with the original PID, one channel open, no SDK errors, and a matching echo. The 75 s group was added because all 60 s trials recovered.

| Trial | OS hold | Home → suspend observation | Last pre-suspend GET age at foreground observation | Channel |
| --- | ---: | ---: | ---: | --- |
| [T15-45s-r1](expiry/T15-45s-r1/result.json) | 45.849 s | 32.698 s | 83.586 s | echo-resumed |
| [T15-45s-r2](expiry/T15-45s-r2/result.json) | 45.839 s | 32.627 s | 82.952 s | echo-resumed |
| [T15-45s-r3](expiry/T15-45s-r3/result.json) | 45.833 s | 32.677 s | 83.189 s | echo-resumed |
| [T15-60s-r1](expiry/T15-60s-r1/result.json) | 60.326 s | 32.637 s | 97.691 s | echo-resumed |
| [T15-60s-r2](expiry/T15-60s-r2/result.json) | 60.187 s | 32.653 s | 97.519 s | echo-resumed |
| [T15-60s-r3](expiry/T15-60s-r3/result.json) | 60.257 s | 32.742 s | 97.657 s | echo-resumed |
| [T15-75s-r1](expiry/T15-75s-r1/result.json) | 75.481 s | 32.646 s | 112.633 s | echo-resumed |
| [T15-75s-r2](expiry/T15-75s-r2/result.json) | 75.568 s | 32.643 s | 112.835 s | echo-resumed |
| [T15-75s-r3](expiry/T15-75s-r3/result.json) | 75.575 s | 32.616 s | 112.871 s | echo-resumed |

## Comparison with the earlier 90 s group

The earlier three 90 s holds returned HTTP 400 / SDK error 4 after resume. Reanalyzing those retained events gives 128.290–128.381 s from the last pre-suspension GET start to the foreground observation. The new 75 s group recovered at ages 112.633–112.871 s. These samples put observed recovery and UnknownSessionID on opposite sides of a roughly 113–128 s interval, consistent with an approximately 120 s hypothesis. They do not determine an exact or universal session lifetime, or independently prove that expiry caused the 400 responses.

The 90 s group is a comparison-only reanalysis of 2026-11-14 measurements, not three new trials. It used Xcode 26.6 versus 27.2 here; the iPhone OS version and SDK recovery implementation are unchanged.

[Prior 90 s GET-age reanalysis](prior-90s-get-age-comparison.json), [original report](../2026-11-14/suspension-summary.md).

## Method and limits

These are real OS-observed suspended holds, not background-only waits or debugger pauses. The original UI observer samples `runningBackgroundSuspended` about once per second; every retained sample is suspended, with gaps no greater than 3 s. Sampling cannot rule out brief wakeups between observations. The observer never launches or reconnects the demo; the controller launches it normally and checks PID after resume.

GET ages refer to the last back-channel GET logged before the observed hold. They are not session creation time or an independently verified server-expiry clock. UI state updates are asynchronous; foreground observation can lag actual activation. Ages at hold end and at foreground observation are both retained. Background-entry waiting and OS hold are reported separately.

The first observer startup was blocked by Enable UI Automation after the host update and is excluded. The operator enabled automation before the nine valid runs. Full identifying xcresults stay local; selected app/UI events and the resumed demo process are published.

[Machine-readable analysis](followup-analysis.json), [measured app and controllers](tool-sources/initial-app/), [publication/provenance note](publication-note.md).
