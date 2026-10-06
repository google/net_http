# Omnient delay-sweep artifacts

[Report](report.md) · [Connection reuse audit](connection-reuse-audit.md)

Each delay retains every attempted OFF/ON trial. Raw CSV/JSON, logs, result bundles, histogram bins, paired differences, and selection decisions are linked below.

| M1 delay (ms) | Artifacts | Transport audit | Histogram input and bins | Paired differences |
|---:|---|---|---|---|
| 0 | [Artifacts](delay-0ms/artifacts.md) | [Audit](delay-0ms/connection-reuse-audit.md) | [JSON](delay-0ms/histograms/histogram-data.json) | [CSV](delay-0ms/histograms/pair-differences.csv) |
| 50 | [Artifacts](delay-50ms/artifacts.md) | [Audit](delay-50ms/connection-reuse-audit.md) | [JSON](delay-50ms/histograms/histogram-data.json) | [CSV](delay-50ms/histograms/pair-differences.csv) |
| 100 | [Artifacts](delay-100ms/artifacts.md) | [Audit](delay-100ms/connection-reuse-audit.md) | [JSON](delay-100ms/histograms/histogram-data.json) | [CSV](delay-100ms/histograms/pair-differences.csv) |
| 200 | [Artifacts](delay-200ms/artifacts.md) | [Audit](delay-200ms/connection-reuse-audit.md) | [JSON](delay-200ms/histograms/histogram-data.json) | [CSV](delay-200ms/histograms/pair-differences.csv) |

## Infrastructure interruptions

- [delay-100ms-pair-51-locked](infrastructure-attempts/delay-100ms-pair-51-locked/README.md)
- [delay-200ms-pair-76-locked](infrastructure-attempts/delay-200ms-pair-76-locked/README.md)
- [delay-50ms-pair-26-locked](infrastructure-attempts/delay-50ms-pair-26-locked/README.md)

Histogram PNG and SVG files are generated with matplotlib. Each metric shares 10 ms bin edges across all delay settings. Exact bin counts, renderer version, generator SHA-256, and input SHA-256 manifests are saved with each delay's evidence.

[Build log](logs/build.log) · [Successful trust preflight](logs/trust-preflight.log). Setup and preflight trials are not included in the measurement pairs.
