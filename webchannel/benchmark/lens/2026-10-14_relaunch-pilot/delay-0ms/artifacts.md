# Lens benchmark artifacts — 2026-10-14 physical-device cold-connection run

[Report](report.md) · [Transport audit](connection-reuse-audit.md) · [Run metadata](run-metadata.json)

Each trial has an Xcode log and exported attachments. Current runs keep logs in `logs/`, result bundles in `xcresults/`, and exported attachments in `attachments/`; older runs may keep these at the run root. The exported JSON and CSV preserve every attempted trial, including pairs omitted from the report tables. CSV values retain their recorded precision.

| Scenario | Run # | Setting | Raw CSV | Raw JSON | Xcode log | Export log | Result bundle | Export manifest |
|---|---:|:---:|---|---|---|---|---|---|
| omnient | 1 | OFF | [CSV](attachments/omnient-1-off-attachments/49D075EF-4025-4567-AA65-4E745E501D29.csv) | [JSON](attachments/omnient-1-off-attachments/BB82083B-4BFF-4810-88C1-24277731D0FE.json) | [Log](logs/omnient-1-off.log) | — | [xcresult](xcresults/omnient-1-off.xcresult) | [Manifest](attachments/omnient-1-off-attachments/manifest.json) |
| omnient | 1 | ON | [CSV](attachments/omnient-1-on-attachments/E99747AE-B5EF-44A1-9562-335054DC8711.csv) | [JSON](attachments/omnient-1-on-attachments/7E1589F7-6C5B-4B4C-BFA7-871957C60AEB.json) | [Log](logs/omnient-1-on.log) | — | [xcresult](xcresults/omnient-1-on.xcresult) | [Manifest](attachments/omnient-1-on-attachments/manifest.json) |
| omnient | 2 | OFF | [CSV](attachments/omnient-2-off-attachments/DBBCFE4B-658D-4CCB-B5BA-A535490BB5FD.csv) | [JSON](attachments/omnient-2-off-attachments/0CA5E6A3-E69B-44F0-AE58-5E6D5581CD51.json) | [Log](logs/omnient-2-off.log) | — | [xcresult](xcresults/omnient-2-off.xcresult) | [Manifest](attachments/omnient-2-off-attachments/manifest.json) |
| omnient | 2 | ON | [CSV](attachments/omnient-2-on-attachments/3D7EB523-E97B-4A7E-BACA-2BC3D178494F.csv) | [JSON](attachments/omnient-2-on-attachments/0C5544F8-0491-41C6-873F-732840684EAE.json) | [Log](logs/omnient-2-on.log) | — | [xcresult](xcresults/omnient-2-on.xcresult) | [Manifest](attachments/omnient-2-on-attachments/manifest.json) |

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

[Trial-to-batch mapping](batch-trial-map.json) records original attachment paths, SHA-256 hashes, XCTest repetition numbers, process identities, and stdout byte ranges. [Batch settings](batch-settings.json) retain the actual command. [Batch outcome](batch-outcome.json) retains its exit code, including recorded measurement failures. [Original batch stdout](logs/batch-0001.log) · [Attachment export log](logs/batch-0001-export.log) · [Original exported attachments](attachments/batch-0001-export/) · [Shared result bundle](xcresults/batch-0001.xcresult)
