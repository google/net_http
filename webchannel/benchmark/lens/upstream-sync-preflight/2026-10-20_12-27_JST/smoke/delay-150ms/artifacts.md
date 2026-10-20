# Lens benchmark artifacts — 2026-10-20 physical-device cold-connection run

[Report](report.md) · [Transport audit](connection-reuse-audit.md) · [Run metadata](run-metadata.json)

Each trial has an Xcode log and exported attachments. Current runs keep logs in `logs/`, result bundles in `xcresults/`, and exported attachments in `attachments/`; older runs may keep these at the run root. The exported JSON and CSV preserve every attempted trial, including pairs omitted from the report tables. CSV values retain their recorded precision.

| Scenario | Run # | Setting | Raw CSV | Raw JSON | Xcode log | Export log | Result bundle | Export manifest |
|---|---:|:---:|---|---|---|---|---|---|
| omnient | 1 | OFF | [CSV](attachments/omnient-1-off-attachments/1DE2625B-CAAE-484C-8D41-61AF2ACB03C3.csv) | [JSON](attachments/omnient-1-off-attachments/B46D91C8-CDC6-4CA0-80AE-7BAA5E341557.json) | [Log](logs/omnient-1-off.log) | — | [xcresult](xcresults/omnient-1-off.xcresult) | [Manifest](attachments/omnient-1-off-attachments/manifest.json) |
| omnient | 1 | ON | [CSV](attachments/omnient-1-on-attachments/3270DA92-431C-4592-B5B9-0F9BBF288904.csv) | [JSON](attachments/omnient-1-on-attachments/67AC3C76-E188-455C-8DB0-EE458471C898.json) | [Log](logs/omnient-1-on.log) | — | [xcresult](xcresults/omnient-1-on.xcresult) | [Manifest](attachments/omnient-1-on-attachments/manifest.json) |

## Histogram evidence

[Histogram data and selection decisions](histograms/histogram-data.json) · [Full-precision paired differences](histograms/pair-differences.csv). Each record retains its pair number and exclusion reasons; no raw measurement is changed.

[Input SHA-256 manifest](histograms/input-manifest.json) records the raw files used for aggregation. The histogram JSON records the renderer version and generator SHA-256.

| Metric | PNG | SVG |
|---|---|---|
| TTFA | [PNG](histograms/ttfa-on-minus-off.png) | [SVG](histograms/ttfa-on-minus-off.svg) |
| TTFD | [PNG](histograms/ttfd-on-minus-off.png) | [SVG](histograms/ttfd-on-minus-off.svg) |


JSON includes app logs and task-level `URLSessionTaskMetrics`. Xcode logs include HTTP response metadata used to classify early POST status. Manifests map exported attachments to XCTest tests.

## Batch provenance

The per-trial JSON and CSV are byte-identical copies of original exported attachments. Per-trial logs are exact byte ranges of the shared Xcode stdout; they are not separate Xcode invocations. The result-bundle aliases point to the same retained batch bundle. CSV repetition remains the test's local repetition (1); batchTrialOrdinal and batchPair identify the experiment trial.

[Trial-to-batch mapping](batch-trial-map.json) records original attachment paths, SHA-256 hashes, XCTest repetition numbers, process identities, and stdout byte ranges. [Batch settings](batch-settings.json) retain the actual command. [Batch outcome](batch-outcome.json) links retained exit codes, including recorded measurement and startup failures. [Original batch stdout](logs/batch-0001.log) · [Attachment export log](logs/batch-0001-export.log) · [Original exported attachments](attachments/batch-0001-export/) · [Shared result bundle](xcresults/batch-0001.xcresult)

- batch-0001: [stdout](logs/batch-0001.log), [export log](logs/batch-0001-export.log), [original exports](attachments/batch-0001-export/), [result bundle](xcresults/batch-0001.xcresult)
  - [settings](logs/batch-0001-settings.json)
  - [outcome](logs/batch-0001-outcome.json)