# Lens benchmark reports

The experiment follows the [Lens Latency Mimic & Shutter Benchmark Mode specification](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode). The [local design document](../../objc/demo/WebChanneliOSDemo/DESIGN.md) describes the demo implementation.

Run both Omnient and Camera Viewfinder on a physical device, with 10 OFF/ON pairs per scenario unless the run specifies another count. Record the device model and OS, Wi-Fi and Cellular settings when known, endpoint, host and Xcode versions, procedure, and parameter values such as `detectionDelayMs`. Preserve all raw measurements even when a pair is omitted from a report table. The default report filter uses completed pairs whose full-precision handshake durations differ by at most 10 ms; use `--handshake-threshold-ms N` when a run explicitly requests another threshold. Run-specific outlier omissions must be stated in the procedure.

For a cold-connection run, build the demo XCTest bundle once, run one cold-trial test method per `xcodebuild test-without-building` invocation, and export each result bundle's attachments. See the [demo README](../../objc/demo/WebChanneliOSDemo/README.md#automated-lens-benchmark) for build and runner commands. Then generate the report files with `python3 webchannel/benchmark/lens/summarize-cold-benchmark.py OUTPUT_DIR PAIRS 'NETWORK_SWITCHES'` from the repository root. The network-switch argument is optional; omit it when the states were not recorded. Add `--handshake-threshold-ms N` for a requested threshold other than 10 ms. The generator saves host, source, test-period, network, and threshold metadata in `run-metadata.json` so later regenerations preserve the original run settings. Such runs additionally require verified fresh HTTP/2 transport in both trials of a reported pair. The earlier [single-invocation run](2026-10-07_00-37-42_JST/report.md) did not record transport-level connection freshness, so do not apply the cold-connection requirement to it.

Set `LENS_BINARY_ENCODING=1` when invoking `run-cold-benchmark.sh` to run the dedicated binary-encoding cold trials. Leave it unset for the original text-encoding trials. The exported JSON records the setting, and the summarizer includes it in the report parameters.

Set `LENS_INITIAL_MESSAGE_DELAY_MS=N` to schedule Lens M1 `N` milliseconds after `connect()` returns, following the Generator benchmark's early-send timing. Omnient sends M3 immediately after M1; Viewfinder retains M2 at +200 ms and M3 at +500 ms after `connect()` returns. The runner passes this setting to the XCTest process through `TEST_RUNNER_`, and the JSON records both the requested delay and the observed time from the connect timestamp to M1 `send()`. The default is 0 ms.

For new runs, the runner stores each trial's Xcode log and attachment-export log under `OUTPUT_DIR/logs/`, result bundles under `OUTPUT_DIR/xcresults/`, and exported attachments under `OUTPUT_DIR/attachments/`. The 2026-10-08 13:40 JST rerun uses this layout after migration. Earlier runs retain their original layout; the summarizer reads both layouts.

Each run directory has `report.md` and `artifacts.md`. New cold runs and the two most recent runs with recorded transport evidence have `connection-reuse-audit.md`; older runs retain `audit.md`:

| File | Contents |
|---|---|
| `report.md` | Specification link, environment, procedure and parameters, and filtered raw measurement tables. No aggregate statistics, comparison, interpretation, excluded-pair list, or artifact links. |
| `connection-reuse-audit.md` | When transport evidence is available: every trial's handshake transport record, initial early POST HTTP status, and transport-specific observations and limits. |
| `artifacts.md` | Descriptions and direct links to raw CSV, JSON, logs, and available `.xcresult` bundles. |

The raw attachments and, where applicable, the audit retain every trial. HTTP 400 on an early POST confirms rejection; client logs alone cannot assign the rejection to soft stickiness, request arrival order, or another server-side condition. A new HTTP/2 TCP/TLS connection to the reached edge does not imply cold DNS, radio, or backend state. Retaining a full `.xcresult` bundle is useful for later Xcode inspection but is not required for the report once its raw attachments and test evidence have been exported.

Instructions for agents editing the runner, summarizer, or reports are in [AGENTS.md](AGENTS.md).

The [2026-10-12 Omnient delay-sweep report](2026-10-12_14-09_omnient-delay-sweep_JST/report.md) contains 50 pairs at each of 0, 50, 100, and 200 ms. Its [connection reuse audit](2026-10-12_14-09_omnient-delay-sweep_JST/connection-reuse-audit.md) and [artifacts](2026-10-12_14-09_omnient-delay-sweep_JST/artifacts.md) retain the measurement and infrastructure-interruption evidence.

## Omnient initial-message delay sweep

The Omnient sweep runs 50 OFF/ON pairs at each of 0, 50, 100, and 200 ms, in that order, with binary encoding enabled and a new process per trial. Build for testing once as above, then run:

```bash
LENS_DERIVED_DATA=/path/to/derived-data bash webchannel/benchmark/lens/run-omnient-delay-sweep.sh DEVICE_ID OUTPUT_DIR 50
MPLCONFIGDIR=/tmp/lens-matplotlib python3 -B webchannel/benchmark/lens/summarize-delay-sweep.py OUTPUT_DIR --pairs 50 --handshake-threshold-ms 20
```

The summarizer requires matplotlib. For a single-delay Omnient histogram report, use `summarize-cold-benchmark.py OUTPUT_DIR 50 --scenarios omnient --report-format histogram --handshake-threshold-ms 20`. The normal raw-table mode remains available. Set `LENS_SCENARIOS=Omnient` to select only Omnient in the cold-trial runner; its default runs both scenarios.

The sweep's `report.md` embeds TTFA and TTFD histograms of paired ON-minus-OFF differences, so negative values mean ON is faster. Both trials must complete, have verified fresh HTTP/2 transport, and differ in handshake duration by at most 20 ms. Pairs with an ON initial early POST HTTP 400 or an unresolved status are excluded. A verified absence of an early POST is eligible. Exclusions are not replaced. The report records the 400-pair fraction over all 50 attempted pairs at each delay, unresolved/unsent early POST counts, and histogram sample counts. Each metric uses common 10 ms bin edges across the four delays and retains every eligible value.

Each `delay-Nms/` subdirectory retains `logs/`, `xcresults/`, `attachments/`, `connection-reuse-audit.md`, and `artifacts.md`. `histograms/` contains PNG/SVG charts, full-precision paired differences, per-pair selection decisions, and exact bin counts. The top-level artifact and audit documents link the per-delay evidence. Trust/preflight checks and interrupted earlier attempts are excluded from the sweep data. The runner refuses to overwrite trial files and stops on test-launch or attachment-export failures.

After resolving an infrastructure interruption, archive the incomplete pair's files under `infrastructure-attempts/` before restarting that pair. Set `LENS_RESUME=1` when rerunning the sweep to preserve all already-recorded trials, including failed measurement trials that exported their benchmark result. Never retry a pair merely because it fails histogram inclusion. The runner bounds each install/launch/test command to 180 seconds by default (`LENS_TRIAL_TIMEOUT_SECONDS`); the Lens measurement's completion deadline remains 60 seconds. Cancellation is forwarded to the active Xcode process group.

Recorded runs: [single-invocation run at 00:37 JST](2026-10-07_00-37-42_JST/report.md), [text-encoding cold-connection run at 15:21 JST](2026-10-07_15-21-10_JST/report.md), [binary-encoding cold-connection run at 17:27 JST](2026-10-07_17-27-44_binary-cold_JST/report.md), [binary-encoding rerun on 2026-10-08](2026-10-08_13-08_binary-cold-rerun_JST/report.md), [binary-encoding run with a 20 ms handshake threshold](2026-10-08_13-21_binary-cold-20ms_JST/report.md), [its separate rerun at 13:40 JST](2026-10-08_13-39_binary-cold-20ms-rerun_JST/report.md), and [the 50 ms initial-message-delay run](2026-10-08_15-04_binary-cold-50ms_JST/report.md).
