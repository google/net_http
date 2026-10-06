# Lens benchmark reports

The experiment follows the [Lens Latency Mimic & Shutter Benchmark Mode specification](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode). The [local design document](../../objc/demo/WebChanneliOSDemo/DESIGN.md) describes the demo implementation.

Run both Omnient and Camera Viewfinder on a physical device, with 10 OFF/ON pairs per scenario unless the run specifies another count. Record the device model and OS, Wi-Fi and Cellular settings when known, endpoint, host and Xcode versions, procedure, and parameter values such as `detectionDelayMs`. Preserve all raw measurements even when a pair is omitted from a report table. The default report filter uses completed pairs whose full-precision handshake durations differ by at most 10 ms; use `--handshake-threshold-ms N` when a run explicitly requests another threshold. Run-specific outlier omissions must be stated in the procedure.

For a cold-connection run, build the demo XCTest bundle once, run one cold-trial test method per `xcodebuild test-without-building` invocation, and export each result bundle's attachments. See the [demo README](../../objc/demo/WebChanneliOSDemo/README.md#automated-lens-benchmark) for build and runner commands. Then generate the report files with `python3 webchannel/benchmark/lens/summarize-cold-benchmark.py OUTPUT_DIR PAIRS 'NETWORK_SWITCHES'` from the repository root. The network-switch argument is optional; omit it when the states were not recorded. Add `--handshake-threshold-ms N` for a requested threshold other than 10 ms. The generator saves host, source, test-period, network, and threshold metadata in `run-metadata.json` so later regenerations preserve the original run settings. Such runs additionally require verified fresh HTTP/2 transport in both trials of a reported pair. The earlier [single-invocation run](2026-10-07_00-37-42_JST/report.md) did not record transport-level connection freshness, so do not apply the cold-connection requirement to it.

Set `LENS_BINARY_ENCODING=1` when invoking `run-cold-benchmark.sh` to run the dedicated binary-encoding cold trials. Leave it unset for the original text-encoding trials. The exported JSON records the setting, and the summarizer includes it in the report parameters.

For new runs, the runner stores each trial's Xcode log and attachment-export log under `OUTPUT_DIR/logs/`, result bundles under `OUTPUT_DIR/xcresults/`, and exported attachments under `OUTPUT_DIR/attachments/`. The 2026-10-08 13:40 JST rerun uses this layout after migration. Earlier runs retain their original layout; the summarizer reads both layouts.

Each run directory has `report.md` and `artifacts.md`. Cold runs with recorded transport evidence also have `audit.md`:

| File | Contents |
|---|---|
| `report.md` | Specification link, environment, procedure and parameters, and filtered raw measurement tables. No aggregate statistics, comparison, interpretation, excluded-pair list, or artifact links. |
| `audit.md` | When transport evidence is available: every trial's handshake transport record, initial early POST HTTP status, and transport-specific observations and limits. |
| `artifacts.md` | Descriptions and direct links to raw CSV, JSON, logs, and available `.xcresult` bundles. |

The raw attachments and, where applicable, the audit retain every trial. HTTP 400 on an early POST confirms rejection; client logs alone cannot assign the rejection to soft stickiness, request arrival order, or another server-side condition. A new HTTP/2 TCP/TLS connection to the reached edge does not imply cold DNS, radio, or backend state. Retaining a full `.xcresult` bundle is useful for later Xcode inspection but is not required for the report once its raw attachments and test evidence have been exported.

Instructions for agents editing the runner, summarizer, or reports are in [AGENTS.md](AGENTS.md).

Recorded runs: [single-invocation run at 00:37 JST](2026-10-07_00-37-42_JST/report.md), [text-encoding cold-connection run at 15:21 JST](2026-10-07_15-21-10_JST/report.md), [binary-encoding cold-connection run at 17:27 JST](2026-10-07_17-27-44_binary-cold_JST/report.md), [binary-encoding rerun on 2026-10-08](2026-10-08_13-08_binary-cold-rerun_JST/report.md), [binary-encoding run with a 20 ms handshake threshold](2026-10-08_13-21_binary-cold-20ms_JST/report.md), and [its separate rerun at 13:40 JST](2026-10-08_13-39_binary-cold-20ms-rerun_JST/report.md).
