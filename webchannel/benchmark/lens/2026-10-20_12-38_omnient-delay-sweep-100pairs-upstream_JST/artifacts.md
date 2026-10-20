# Omnient individual-observation artifacts

[Report](report.md) · [Transport audit](connection-reuse-audit.md)

[All observations JSON](plots/all-trials.json) · [CSV](plots/all-trials.csv) retain every trial, original metric values, missing values, status, and links to original exports and logs. [Plot data](plots/plot-data.json) retains every plotted ordinal, sorted ECDF value, cumulative fraction, and shared axis limits.

[Input hashes](plots/input-manifest.json) · [Generation settings](report-generation-settings.json) · [Verification](plots/verification.json). These describe report generation separately from the unchanged [measurement settings](execution-settings.json) and [measurement completion checks](completion.json).

| M1 delay (ms) | Original evidence | Transport audit | Plot files |
|---:|---|---|---|
| 0 | [Per-trial index](delay-0ms/artifacts.md) | [Audit](delay-0ms/connection-reuse-audit.md) | [PNG/SVG](plots/delay-0ms/) |
| 50 | [Per-trial index](delay-50ms/artifacts.md) | [Audit](delay-50ms/connection-reuse-audit.md) | [PNG/SVG](plots/delay-50ms/) |
| 100 | [Per-trial index](delay-100ms/artifacts.md) | [Audit](delay-100ms/connection-reuse-audit.md) | [PNG/SVG](plots/delay-100ms/) |
| 150 | [Per-trial index](delay-150ms/artifacts.md) | [Audit](delay-150ms/connection-reuse-audit.md) | [PNG/SVG](plots/delay-150ms/) |
| 200 | [Per-trial index](delay-200ms/artifacts.md) | [Audit](delay-200ms/connection-reuse-audit.md) | [PNG/SVG](plots/delay-200ms/) |

The per-delay evidence indexes also retain the earlier paired histograms as historical analysis. They do not define selection for this report. [Previous main report](legacy-paired-report/report.md) preserves the superseded analysis. Plot proposals remain separate.

## Benchmark elapsed time by delay

[Original timing](timing.json) includes launch, measurement, export and any recovery gaps; excludes build and report generation.

| M1 delay (ms) | Elapsed seconds |
|---:|---:|
| 0 | 234.712 |
| 50 | 251.432 |
| 100 | 245.735 |
| 150 | 256.863 |
| 200 | 264.040 |

Per-trial JSON/CSV exports and WebChannel/HTTP logs are published byte-for-byte. Batch exports, shared stdout, xcresults, archives and source snapshots remain local and are not uploaded. The original batch mapping and shared export manifests preserve provenance. See [publication policy](publication-settings.json).
