# Preflight artifacts

- [Successful build log](logs/build-generic-ios.log): physical-iOS compilation and test bundle signing.
- [Initial build log](logs/build.log): unavailable device destination, before compilation.
- [Pods regeneration log](logs/pod-install.log): new source membership; no dependency version changes.
- [Device availability](logs/device-availability.log).
- [Preflight settings](preflight-settings.json), [source and binary hashes](source-inputs.json), and [proposed full benchmark](benchmark-plan.json).
- [Smoke execution settings](smoke/execution-settings.json): one pair per delay only; no full measurement authorization implied.

- [Smoke measurement completion checks](smoke/completion.json), [individual-observation report](smoke/report.md), [transport evidence](smoke/connection-reuse-audit.md), and [all original smoke artifacts](smoke/artifacts.md).
- [Initial rejected launch](smoke/delay-0ms/logs/batch-0001.log) and [reviewed zero-entry outcome](smoke/delay-0ms/logs/batch-0001-outcome.json).
- [Original smoke workflow](logs/smoke-workflow.log), [resumed smoke workflow](logs/smoke-workflow-resume.log), [successful finalization](logs/smoke-finalization.log), [unpaired report generation](logs/smoke-unpaired-report.log).
- [Postprocessing environment](postprocessing-environment.json), [package installation](logs/plot-environment-install.log), and [frozen package versions](logs/plot-environment-freeze.txt).
