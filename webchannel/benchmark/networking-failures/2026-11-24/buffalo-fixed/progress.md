# Buffalo-fixed repeats: progress and method

Series started 2026-11-24 (JST). The selected repeats are complete; see the
[completed report](report.md). Final operator confirmation was November 25 JST.
See [plan.json](plan.json) and [m6-summary.json](m6-summary.json).

The operator confirmed Buffalo WSR-3200AX4S-BK on 5 GHz, the NEC network
forgotten, other potential auto-join networks disabled, NLC OFF and USB connected.
AP/band/forget state are operator-reported rather than SSID/BSSID telemetry.
No SDK networking/recovery implementation was changed.

An initial OFF batch started without an observed USB preflight. The operator
noticed the cable was absent; CoreDevice recorded localNetwork, not wired.
The entire initial batch is excluded: one full idle observation and a second
partial observation. Wi-Fi logging could alter the tested Wi-Fi activity.
The controller was stopped, the operator connected USB, and the replacement
batch started from run 1 after a positive wired/connected observation.

The replacement M6 controller verifies wired transport before each launch,
every 30 s and before qlog collection (eight positive checks per completed run).
It also checks fresh foreground heartbeats and stops on SDK failure/closure.
It sends no application messages, observes 180 s, closes the channel, waits for
session invalidation and then copies the run's qlog. All original qlogs remain
local; excerpts retain source hashes.

All six qualified M6 observations (OFF 3, ON 3) are complete. See
[m6-report.md](m6-report.md): 36/36 completed task transactions h3, 48 positive
wired checks, no SDK errors, and no sustained approximately 1 s PING sequence
in either condition. One additional short ON trace is retained separately.

The handoff phase completed the streaming variant, three h2 and three h3 trials, Settings Wi-Fi
switch OFF/ON, 15 s requested cellular hold and 30 s post-restore observation.
Positive measured baseline POST protocol was required before every switch cue.
All 81 task transactions matched the intended protocol, with no SDK errors.
The established h2/h3 endpoints differ. The capture is stopped, RVI removed,
and the operator confirmed both radios ON and NLC OFF.
