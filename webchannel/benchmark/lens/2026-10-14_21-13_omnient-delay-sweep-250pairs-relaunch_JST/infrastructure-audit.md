# Infrastructure and resumption audit

Two XCTest app-startup failures occurred during this sweep. Both were reported as “The test runner hung before establishing connection.” The failures preceded entry into the selected measurement test. They are not classified as USB disconnections from this message alone.

| Delay | Unstarted XCTest repetition | Retained measurement ordinals | Supplemental measurement |
|---:|---:|---|---|
| 0 ms | 219 | 1–499 | Ordinal 500 (pair 250 ON), new app invocation |
| 150 ms | 445 | 1–499 | Ordinal 500 (pair 250 ON), new app invocation |

The original batches continued after the startup failures. Since the app's persisted measurement ordinal advances only on test entry, original XCTest repetition numbers differ from measurement ordinals after the failed launch. Every JSON/CSV was associated by its explicit ordinal, batch UUID and process identity, and its original XCTest repetition number was retained. No entered measurement, including a measurement timeout, was retried or replaced. Pair 250 at each affected delay spans the resumption gap. The main report's ordinary eligibility rules still apply to these pairs; the raw data retain them irrespective of eligibility.

- 0 ms: [Original stdout](delay-0ms/logs/batch-0001.log), [original exports](delay-0ms/attachments/batch-0001-export/), [review](delay-0ms/resume-review.json), [trial mapping](delay-0ms/batch-trial-map.json).
- 150 ms: [Original stdout](delay-150ms/logs/batch-0001.log), [original exports](delay-150ms/attachments/batch-0001-export/), [review](delay-150ms/resume-review.json), [trial mapping](delay-150ms/batch-trial-map.json).
- [Device query during the 150 ms launch wait](logs/lock-state-during-150ms-launch-wait.log) succeeded at 22:24:35 JST and reported `passcodeRequired: false`. This establishes connectivity and the reported lock state at that observation, not throughout the entire wait. The corresponding 0 ms post-failure query succeeded at 21:41:25 JST; its result was returned in the agent tool transcript and is summarized in the retained review.

The initial importer deliberately rejected the incomplete requested count. After reviewing the original evidence, the importer was adjusted to associate explicit measurement ordinals with original XCTest repetition numbers even when a startup iteration has no measurement attachment. Resumption requires a matching reviewed-prefix mapping hash and only schedules unentered ordinals. A single remaining trial uses a separate Xcode invocation without repetition flags; Xcode rejects `-test-iterations 1`. The rejected command in [0 ms batch 0002](delay-0ms/logs/batch-0002.log) executed no measurement. Single-trial attachment manifests omit `repetitionNumber`; this is recorded as the single repetition (1).

[Original execution settings](initial-execution-settings.json), [first resumption settings](resume-1-execution-settings.json), [second resumption settings](resume-2-execution-settings.json), and [effective settings](execution-settings.json) retain the code hashes. Matching script versions are preserved under `source-snapshots/initial-scripts/`, `source-snapshots/resume-1-scripts/`, and `source-snapshots/resume-2-scripts/`. The Swift instrumentation and compiled XCTest binary were unchanged throughout this experiment.

[Timing](timing.json) includes the startup waits, review, resumption and intervening gaps. Build and report generation are excluded.
