# Lens benchmark instructions

When changing or generating files under this directory, follow [README.md](README.md) and the [Lens benchmark specification](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

- Write reports in English. Each run's `report.md` must link the specification and record the physical-device environment, network switch states when known, experiment procedure, parameter values, and separate Omnient and Camera Viewfinder raw measurement tables with `Run #` as the first column.
- Run 10 OFF/ON pairs per scenario unless the user changes the count. State the inclusion rule: both runs completed and their full-precision handshake durations differ by at most 10 ms by default, or the run-specific threshold explicitly requested by the user. For cold-connection runs, also require verified fresh HTTP/2 transport for both trials. Apply any explicitly requested run-specific outlier omission without changing the raw files.
- Do not put median or other summary statistics, comparisons, interpretation, an excluded-pair list, or artifact links in `report.md`. Keep the table values rounded to three decimals and preserve every original measurement in raw artifacts.
- Put per-trial transport evidence, early POST HTTP status, and available evidence of whether M1/M3 were in the handshake request, a concurrent early POST, or a later POST in `connection-reuse-audit.md`. Keep analysis of transport behavior and limitations there, separate from `report.md`.
- Put descriptions and direct links to raw CSV, JSON, logs, and available result bundles in `artifacts.md`. A result bundle need not be checked in if its exported evidence is retained.
- For new cold-connection runs, store per-trial Xcode and attachment-export logs in `logs/`, result bundles in `xcresults/`, and exported attachments in `attachments/`. Preserve earlier run layouts and keep the summarizer compatible with both.
- Describe an early POST HTTP 400 as a rejection. Client logs alone do not establish whether soft stickiness failed or requests arrived out of order.
- For cold-connection runs, update `summarize-cold-benchmark.py` when changing the generated layout, regenerate the documents, and verify them against the raw evidence. Do not use that generator on the earlier single-invocation run.
