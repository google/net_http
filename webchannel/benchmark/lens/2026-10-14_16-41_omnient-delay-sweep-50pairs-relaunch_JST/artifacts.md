# Omnient delay-sweep artifacts

[Report](report.md) · [Connection reuse audit](connection-reuse-audit.md)

Each delay retains every attempted OFF/ON trial. Raw CSV/JSON, logs, result bundles, histogram bins, paired differences, and selection decisions are linked below.

| M1 delay (ms) | Artifacts | Transport audit | Histogram input and bins | Paired differences |
|---:|---|---|---|---|
| 0 | [Artifacts](delay-0ms/artifacts.md) | [Audit](delay-0ms/connection-reuse-audit.md) | [JSON](delay-0ms/histograms/histogram-data.json) | [CSV](delay-0ms/histograms/pair-differences.csv) |
| 50 | [Artifacts](delay-50ms/artifacts.md) | [Audit](delay-50ms/connection-reuse-audit.md) | [JSON](delay-50ms/histograms/histogram-data.json) | [CSV](delay-50ms/histograms/pair-differences.csv) |
| 100 | [Artifacts](delay-100ms/artifacts.md) | [Audit](delay-100ms/connection-reuse-audit.md) | [JSON](delay-100ms/histograms/histogram-data.json) | [CSV](delay-100ms/histograms/pair-differences.csv) |
| 150 | [Artifacts](delay-150ms/artifacts.md) | [Audit](delay-150ms/connection-reuse-audit.md) | [JSON](delay-150ms/histograms/histogram-data.json) | [CSV](delay-150ms/histograms/pair-differences.csv) |
| 200 | [Artifacts](delay-200ms/artifacts.md) | [Audit](delay-200ms/connection-reuse-audit.md) | [JSON](delay-200ms/histograms/histogram-data.json) | [CSV](delay-200ms/histograms/pair-differences.csv) |

Histogram PNG and SVG files are generated with matplotlib. Each metric shares 10 ms bin edges across all delay settings. Exact bin counts, renderer version, generator SHA-256, and input SHA-256 manifests are saved with each delay's evidence.

[Build log](logs/build.log). Setup and preflight trials are not included in the measurement pairs.

[Execution settings](execution-settings.json) record the requested parameters, user-reported connection conditions, and frozen script hashes.

[Benchmark timing](timing.json) retains full-precision wall-clock timestamps and elapsed intervals; excludes build and report generation.

## Benchmark elapsed time by delay

Each interval runs from the start of that delay's runner to completion of its last attachment export. Recovery gaps, if any, are included.

| M1 delay (ms) | Elapsed seconds |
|---:|---:|
| 0 | 189.730 |
| 50 | 124.139 |
| 100 | 127.648 |
| 150 | 127.642 |
| 200 | 133.710 |

