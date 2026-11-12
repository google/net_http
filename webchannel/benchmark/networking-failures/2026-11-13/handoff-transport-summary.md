# T12 / T14 and M2 / M3 / M4: handoff log analysis

Analysis of existing human-handoff-02 / 03 / 04; no additional phone operation.
These are the same three observations already reported, not new repetitions.

## T14 / M3: Wi-Fi restoration does not imply immediate use by each request

Each restored-stage probe is matched by its echo token to the app send event,
then the next forward POST log, then that POST RID to exactly one completed
URLSession transaction. All nine probe/RID joins were unique.

| Trial | Baseline isCellular | Cellular-stage isCellular | Restored-stage isCellular | Restored POST RID | Request after first Wi-Fi callback (s) | Reused connection |
| --- | --- | --- | --- | --- | ---: | --- |
| 02 | False | True | True | 3050 | 0.766 | False |
| 03 | False | True | True | 12255 | 1.067 | False |
| 04 | False | True | True | 80845 | 0.587 | False |

In all three trials, restored-stage POST metrics report isCellular=true even
though the preceding default-path callback reports Wi-Fi=true/cellular=false.
Those restored-stage POSTs report reusedConnection=false. The observed data
therefore do not justify attributing this behavior solely to reuse of an
existing connection. Connection pools, socket binding or other causes have
not been isolated. The trace ends shortly afterward, so it does not establish
when later requests would move to Wi-Fi. The default-path and per-transaction
values are reported separately; neither is rewritten to force agreement.

## T12 / M2: Wi-Fi to cellular

| Trial | Unsatisfied callbacks before cellular | First cellular path → next logged back-channel body (s) | Status-0 state records | New GET attempt numbers |
| --- | ---: | ---: | ---: | --- |
| 02 | 0 | 0.575 | 0 | [1] |
| 03 | 0 | 2.413 | 0 | [1] |
| 04 | 0 | 0.636 | 0 | [1] |

No transient unsatisfied callback was logged in these three cut-to-cellular
windows. Absence from a callback trace is not proof of no physical gap.
The body intervals above are callback-to-next-logged-data observations, not
exact handoff recovery time. The probes were sent after foreground readiness,
and the idle stream has sparse traffic; neither probe RTT nor time since the
previous baseline message measures the connectivity interruption itself.
The new GET logs show attempt 1; underlying NSError -1005 is not exposed.
Do not claim that the spec-predicted -1005 / attempt-2 sequence was verified.

## M4 and limits

All nine joined probe transactions report h2. All three channels opened once
and had no error callbacks. Same-session continuation is established by the
existing SID analysis; exact packet outage and complete T12 recovery timing
remain unmeasured. M6 is not triggered by an observed h3 transaction here.
No new test-case pass is assigned solely by this reanalysis.

[Detailed JSON](handoff-transport-analysis.json), [probe transaction CSV](handoff-probe-transactions.csv),
[original three-trial summary](summary.md). Raw sources remain in the three
trial directories. This analysis script is preserved as handoff-transport-analysis.py.

[Subsequent operator report](handoff-operator-note.md): Wi-Fi operations were
confirmed and the Cellular button was not touched. No operator-error cause is
established by these logs.
