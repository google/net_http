# T5 with the AP connected directly to the switching hub

Three 250 s requested native-condition holds completed. Each had active and inactive readbacks, one channel open, and active (state 0) heartbeats throughout the fault. All ended with SDK error 1 before release.

| Trial | Helper hold | First retry (attempt 2) duration | Error since enable ack | First unsatisfied since ack |
| --- | ---: | ---: | ---: | ---: |
| [T5-r1](t5-direct/T5-r1/device-events.jsonl) | 250.004 s | 18.070 s | 93.470 s | 75.400 s |
| [T5-r2](t5-direct/T5-r2/device-events.jsonl) | 250.006 s | 26.601 s | 191.526 s | not observed |
| [T5-r3](t5-direct/T5-r3/device-events.jsonl) | 250.002 s | 18.070 s | 180.762 s | not observed |

Attempt 2 reused an HTTP/2 connection in all three trials and completed with status 0. In this sample its duration was 18.070 / 26.601 / 18.070 s, rather than a fixed 18–21 s range. Underlying NSError was not exposed in this baseline instrumentation.

The early error and unsatisfied path occurred even without a Linux box in the path. The Linux box is therefore not necessary for reproducing those observations in this setup. This does not isolate the cause of the earlier behavior, show the Linux box had no effect, or establish a stable failure distribution from three trials. The other two trials had no unsatisfied callbacks during the hold.

The operator confirmed the direct AP wiring. iPhone OS and SDK implementation were unchanged, but Xcode changed from 26.6 to 27.2; the measured app adds an inactive-by-default HTTP/3 experiment hook. Native acknowledgements do not measure exact packet-loss onset. Error/path times relative to helper events use host wall-clock observations; request durations use device uptime.

The first run-2 startup was inactive due to a cellular-data-off dialog, which the operator dismissed. It stopped before loss injection and is excluded under t5-direct/interrupted-attempts. Run 1 was not repeated. Final helper readback confirms every condition inactive.

[Machine-readable observations](followup-analysis.json), [native runner results](t5-direct/results.json), [native analysis](t5-direct/analysis.json).
