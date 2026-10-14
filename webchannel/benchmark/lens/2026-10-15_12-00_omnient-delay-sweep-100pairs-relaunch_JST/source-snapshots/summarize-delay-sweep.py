#!/usr/bin/env python3
"""Generate an Omnient delay-sweep report from retained cold-trial evidence."""

import argparse
import csv
import hashlib
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path


def generate_including_400(root, args, summary):
    """Add a report variant while preserving the original report and evidence."""
    destination = root / "including-early-post-400"
    original_metadata = json.loads((root / "run-metadata.json").read_text())
    if original_metadata["pairsPerDelay"] != args.pairs or original_metadata["handshakeThresholdMs"] != args.handshake_threshold_ms:
        raise ValueError("Inclusive report must use the original pair count and handshake threshold")
    datasets = {}
    for delay in original_metadata.get("delaysMs", (0, 50, 100, 200)):
        run = root / f"delay-{delay}ms"
        data = {"initialMessageDelayMs": delay, "pairCount": args.pairs,
                "handshakeThresholdMs": args.handshake_threshold_ms, "includeEarlyPost400": True,
                "difference": "ON minus OFF", "binWidthMs": 10, "pairs": [], "histograms": {}}
        for pair in range(1, args.pairs + 1):
            off = summary.load_trial(run, "omnient", pair, "off")
            on = summary.load_trial(run, "omnient", pair, "on")
            for setting, row in (("off", off), ("on", on)):
                if row is None:
                    raise ValueError(f"Missing source trial: {delay} ms, pair {pair}, {setting}")
                if row.get("initialMessageDelayMs") != delay or row.get("fastHandshake2") != (setting == "on"):
                    raise ValueError("Source trial settings do not match the sweep")
            status = summary.early_post_status(run, "omnient", pair, "on")
            reasons = summary.histogram_pair_reasons(off, on, args.handshake_threshold_ms, status, include_early_post_400=True)
            record = {"pair": pair, "accepted": not reasons, "exclusionReasons": reasons,
                      "earlyPostHTTP": status, "ttfaDifferenceMs": None, "ttfdDifferenceMs": None}
            for key, metric in (("ttfaDifferenceMs", "ttfaMs"), ("ttfdDifferenceMs", "ttfdMs")):
                if off.get(metric) is not None and on.get(metric) is not None:
                    record[key] = on[metric] - off[metric]
            data["pairs"].append(record)
        data["acceptedPairs"] = sum(record["accepted"] for record in data["pairs"])
        data["includedEarlyPost400Pairs"] = sum(record["accepted"] and summary.has_early_post_400(record["earlyPostHTTP"]) for record in data["pairs"])
        data["earlyPost400Pairs"] = sum(summary.has_early_post_400(record["earlyPostHTTP"]) for record in data["pairs"])
        datasets[delay] = data

    for metric, key in (("TTFA", "ttfaDifferenceMs"), ("TTFD", "ttfdDifferenceMs")):
        pooled = [record[key] for data in datasets.values() for record in data["pairs"] if record["accepted"]]
        bounds = (min(pooled + [0]), max(pooled + [0]))
        for delay, data in datasets.items():
            values = [record[key] for record in data["pairs"] if record["accepted"]]
            path = destination / f"delay-{delay}ms/histograms/{metric.lower()}-on-minus-off.png"
            data["histograms"][metric] = summary.plot_histogram(values, path, metric, delay, bounds=bounds)

    import matplotlib
    artifacts = ["# Inclusive histogram artifacts", "", "[Report](report.md) · [Original measurement artifacts](../artifacts.md) · [Connection reuse audit](../connection-reuse-audit.md)", "",
                 "This report reuses the original measurements and HTTP logs. Only the early POST HTTP 400 exclusion is disabled. The original report and its plots are preserved.", "",
                 "| M1 delay (ms) | Raw evidence | Selection decisions and bins | Paired differences |", "|---:|---|---|---|"]
    for delay, data in datasets.items():
        folder = destination / f"delay-{delay}ms/histograms"
        data.update(sharedHistogramAxes=True, matplotlibVersion=matplotlib.__version__,
                    generatorSHA256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                    selectionGeneratorSHA256=hashlib.sha256(Path(summary.__file__).read_bytes()).hexdigest())
        (folder / "histogram-data.json").write_text(json.dumps(data, indent=2) + "\n")
        with (folder / "pair-differences.csv").open("w", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=list(data["pairs"][0]))
            writer.writeheader()
            writer.writerows(data["pairs"])
        manifest_path = root / f"delay-{delay}ms/histograms/input-manifest.json"
        manifest = json.loads(manifest_path.read_text())
        for item in manifest:
            source = root / f"delay-{delay}ms" / item["path"]
            if hashlib.sha256(source.read_bytes()).hexdigest() != item["sha256"]:
                raise ValueError(f"Source evidence changed: {source}")
        artifacts.append(f"| {delay} | [Artifacts](../delay-{delay}ms/artifacts.md) · [Input hashes](../delay-{delay}ms/histograms/input-manifest.json) | [JSON](delay-{delay}ms/histograms/histogram-data.json) | [CSV](delay-{delay}ms/histograms/pair-differences.csv) |")
    report = (root / "report.md").read_text()
    report = report.replace("# Lens benchmark — Omnient initial-message delay sweep", "# Lens benchmark — Omnient delay sweep including early POST HTTP 400 pairs", 1)
    report = re.sub(r"^7\. .*", f"7. Include pairs whose ON initial early POST returned HTTP 400, including trials completed after retry. The completion, fresh-transport, and {args.handshake_threshold_ms:g} ms handshake-difference conditions still apply. An unresolved early POST status remains excluded; a verified absence of an early POST is eligible. No additional measurements were run.", report, count=1, flags=re.M)
    for delay, data in datasets.items():
        report = re.sub(rf"^(\| {delay} \| .*\| )\d+( \|)$", rf"\g<1>{data['acceptedPairs']}\g<2>", report, count=1, flags=re.M)
    marker = "\n## M1 delay: 0 ms"
    inclusion = ["", "| M1 delay (ms) | HTTP 400 pairs included in histograms |", "|---:|---:|"]
    inclusion.extend(f"| {delay} | {data['includedEarlyPost400Pairs']} |" for delay, data in datasets.items())
    report = report.replace(marker, "\n".join(inclusion) + "\n" + marker, 1)
    (destination / "report.md").write_text(report)
    (destination / "artifacts.md").write_text("\n".join(artifacts) + "\n")
    metadata = {"sourceMeasurementDirectory": "..", "includeEarlyPost400": True, "originalMeasurementMetadata": original_metadata,
                "generatorSHA256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
    (destination / "run-metadata.json").write_text(json.dumps(metadata, indent=2) + "\n")
    for delay, data in datasets.items():
        print(f"{delay} ms: histogram n={data['acceptedPairs']}, including {data['includedEarlyPost400Pairs']} HTTP 400 pairs")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--pairs", type=int)
    parser.add_argument("--delays-ms", type=int, nargs="+", help="Ordered delay settings; defaults to saved metadata or 0 50 100 150 200")
    parser.add_argument("--handshake-threshold-ms", type=float)
    parser.add_argument("--network-switches")
    parser.add_argument("--include-early-post-400", action="store_true", help="Add an inclusive report under including-early-post-400/ without regenerating the original")
    parser.add_argument("--early-post-400-policy", choices=("include", "exclude"), help="Policy for the main report; new sweeps default to include")
    args = parser.parse_args()
    root = args.output_dir
    previous_metadata_path = root / "run-metadata.json"
    previous_metadata = json.loads(previous_metadata_path.read_text()) if previous_metadata_path.exists() else {}
    args.pairs = args.pairs if args.pairs is not None else previous_metadata.get("pairsPerDelay", 1000)
    args.handshake_threshold_ms = (args.handshake_threshold_ms if args.handshake_threshold_ms is not None
                                   else previous_metadata.get("handshakeThresholdMs", 20))
    policy = args.early_post_400_policy or ("include" if previous_metadata.get("includeEarlyPost400", not previous_metadata) else "exclude")
    delays = tuple(args.delays_ms or previous_metadata.get("delaysMs", (0, 50, 100, 150, 200)))
    if args.pairs <= 0 or any(delay < 0 for delay in delays) or len(set(delays)) != len(delays) or 0 not in delays:
        parser.error("Use positive pairs and distinct nonnegative delays including 0")
    delay_text = ", ".join(map(str, delays))
    total_trials = 2 * len(delays) * args.pairs
    summarizer_path = Path(__file__).with_name("summarize-cold-benchmark.py")
    spec = importlib.util.spec_from_file_location("cold_summary", summarizer_path)
    summary = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(summary)
    if args.include_early_post_400:
        if previous_metadata.get("includeEarlyPost400") is True:
            parser.error("The main report already includes HTTP 400 pairs; use report.md")
        generate_including_400(root, args, summary)
        return
    datasets = {}
    metadata = {}
    for delay in delays:
        run = root / f"delay-{delay}ms"
        # Refuse to present a partial sweep as a completed measurement.
        for pair in range(1, args.pairs + 1):
            for setting in ("off", "on"):
                if not summary.trial_log(run, "omnient", pair, setting).exists():
                    parser.error(f"Missing attempted trial: delay {delay}, pair {pair}, {setting}")
        command = [sys.executable, "-B", str(summarizer_path), str(run), str(args.pairs),
                   "--scenarios", "omnient", "--report-format", "histogram",
                   "--handshake-threshold-ms", str(args.handshake_threshold_ms),
                   "--early-post-400-policy", policy]
        if args.network_switches is not None:
            command.insert(5, args.network_switches)
        subprocess.run(command, check=True)
        datasets[delay] = json.loads((run / "histograms/histogram-data.json").read_text())
        metadata[delay] = json.loads((run / "run-metadata.json").read_text())
        if datasets[delay]["initialMessageDelayMs"] != delay:
            parser.error(f"Measured delay setting does not match directory: {run}")

    # All charts for a metric have exactly the same bin edges and range.
    for metric, key in (("TTFA", "ttfaDifferenceMs"), ("TTFD", "ttfdDifferenceMs")):
        pooled = [record[key] for data in datasets.values() for record in data["pairs"] if record["accepted"]]
        bounds = (min(pooled + [0]), max(pooled + [0]))
        for delay, data in datasets.items():
            values = [record[key] for record in data["pairs"] if record["accepted"]]
            path = root / f"delay-{delay}ms/histograms/{metric.lower()}-on-minus-off.png"
            data["histograms"][metric] = summary.plot_histogram(values, path, metric, delay, bounds=bounds)
            data["sharedHistogramAxes"] = True
            (path.parent / "histogram-data.json").write_text(json.dumps(data, indent=2) + "\n")

    first_report = (root / "delay-0ms/report.md").read_text()
    prefix = first_report.split("## Omnient: paired difference histograms")[0]
    prefix = re.sub(r"^# .*", "# Lens benchmark — Omnient initial-message delay sweep", prefix, count=1)
    prefix = prefix.replace(f"{args.pairs} alternating OFF/ON pairs per scenario", f"{args.pairs} alternating OFF/ON pairs per delay; {delay_text} ms in that order")
    total_completed = total_fresh = 0
    for delay in delays:
        for pair in range(1, args.pairs + 1):
            for setting in ("off", "on"):
                row = summary.load_trial(root / f"delay-{delay}ms", "omnient", pair, setting)
                total_completed += bool(row and row.get("status") == "completed")
                total_fresh += bool(row and row.get("coldConnection") is True)
    prefix = re.sub(r"\| Test result \| .*? \|", f"| Test result | {total_completed}/{total_trials} completed trials; {total_fresh}/{total_trials} passed fresh-transport verification |", prefix)
    period = "; ".join(f"{delay} ms: {metadata[delay]['testPeriod']}" for delay in delays)
    prefix = re.sub(r"\| Test period \| .*? \|", f"| Test period | {period} |", prefix)
    timing_path = root / "timing.json"
    timing = json.loads(timing_path.read_text()) if timing_path.exists() else None
    if timing and "elapsedSeconds" in timing:
        duration = timing["elapsedSeconds"]
        prefix = prefix.replace("| Transport requirement |", f"| Benchmark elapsed time | {duration:.3f} seconds ({duration / 60:.3f} minutes); {timing['startedUTC']} to {timing['finishedUTC']}; includes process launch, measurement, attachment export, and any recovery gaps; excludes build and report generation |\n| Transport requirement |", 1)
    prefix = prefix.replace("`initialMessageDelayMs=0`", f"`initialMessageDelayMs={delay_text}` (separate settings)")
    prefix = prefix.replace("Schedule M1 Sticky Cluster Info 0 ms after", "Schedule M1 Sticky Cluster Info at the configured delay after")
    prefix = prefix.replace("Histograms use 10 ms bins", "All delay settings use the same horizontal range and bin edges for each metric. Histograms use 10 ms bins")
    lines = [prefix.rstrip(), "", "## Pair inclusion and early POST rejection", "",
             "The HTTP 400 rate uses all 50 attempted pairs at each delay as the denominator, including pairs that fail other histogram inclusion conditions.".replace("all 50", f"all {args.pairs}"), "",
             "| M1 delay (ms) | Measured pairs | ON early POST HTTP 400 | 400 pair rate | No early POST | Unresolved status | Histogram pairs | Included HTTP 400 pairs |",
             "|---:|---:|---:|---:|---:|---:|---:|---:|"]
    for delay, data in datasets.items():
        lines.append(f"| {delay} | {args.pairs} | {data['earlyPost400Pairs']} | {data['earlyPost400Rate'] * 100:.1f}% | {data['noEarlyPostPairs']} | {data['unknownEarlyPostPairs']} | {data['acceptedPairs']} | {data['includedEarlyPost400Pairs']} |")
    for delay in delays:
        lines.extend(["", f"## M1 delay: {delay} ms", ""])
        for metric in ("TTFA", "TTFD"):
            lines.extend([f"### {metric}: ON minus OFF", "",
                          f"![{metric} paired difference histogram, delay {delay} ms](delay-{delay}ms/histograms/{metric.lower()}-on-minus-off.png)", ""])
    (root / "report.md").write_text("\n".join(lines))
    artifacts = ["# Omnient delay-sweep artifacts", "", "[Report](report.md) · [Connection reuse audit](connection-reuse-audit.md)", "",
                 "Each delay retains every attempted OFF/ON trial. Raw CSV/JSON, logs, result bundles, histogram bins, paired differences, and selection decisions are linked below.", "",
                 "| M1 delay (ms) | Artifacts | Transport audit | Histogram input and bins | Paired differences |", "|---:|---|---|---|---|"]
    audit = ["# Omnient delay-sweep connection reuse audit", "", "[Report](report.md) · [Artifacts](artifacts.md)", "",
             "Per-delay audits retain every trial's HTTP/2 connection evidence, initial early POST status, and M1/M3 dispatch. HTTP 400 confirms rejection; client evidence does not identify the server-side cause.", ""]
    for delay in delays:
        directory = f"delay-{delay}ms"
        artifacts.append(f"| {delay} | [Artifacts]({directory}/artifacts.md) | [Audit]({directory}/connection-reuse-audit.md) | [JSON]({directory}/histograms/histogram-data.json) | [CSV]({directory}/histograms/pair-differences.csv) |")
        audit.append(f"- [{delay} ms connection reuse audit]({directory}/connection-reuse-audit.md)")
    infrastructure = sorted((root / "infrastructure-attempts").glob("*/README.md"))
    if infrastructure:
        audit.extend(["", "## Infrastructure interruptions", "",
                      "Install/launch failures produced no paired benchmark measurement. Their files are retained separately; completed measurement pairs excluded by the histogram rules were not repeated. Trials without a benchmark result were resumed after restoring device availability; recorded measurement trials were retained.", ""])
        artifacts.extend(["", "## Infrastructure interruptions", ""])
        for path in infrastructure:
            link = f"- [{path.parent.name}]({path.relative_to(root).as_posix()})"
            audit.append(link)
            artifacts.append(link)
    artifacts.extend(["", "Histogram PNG and SVG files are generated with matplotlib. Each metric shares 10 ms bin edges across all delay settings. Exact bin counts, renderer version, generator SHA-256, and input SHA-256 manifests are saved with each delay's evidence.", ""])
    setup_logs = [("build.log", "Build log"), ("trust-preflight.log", "Successful trust preflight")]
    links = [f"[{label}](logs/{name})" for name, label in setup_logs if (root / "logs" / name).exists()]
    if links:
        artifacts.extend([" · ".join(links) + ". Setup and preflight trials are not included in the measurement pairs.", ""])
    if (root / "execution-settings.json").exists():
        artifacts.extend(["[Execution settings](execution-settings.json) record the requested parameters, user-reported connection conditions, and frozen script hashes.", ""])
    if timing is not None:
        artifacts.extend(["[Benchmark timing](timing.json) retains full-precision wall-clock timestamps and elapsed intervals; excludes build and report generation.", ""])
    if timing and "elapsedSeconds" in timing:
        artifacts.extend(["", "## Benchmark elapsed time by delay", "",
                      "Each interval runs from the start of that delay's runner to completion of its last attachment export. Recovery gaps, if any, are included.", "",
                      "| M1 delay (ms) | Elapsed seconds |", "|---:|---:|"])
        for delay in delays:
            artifacts.append(f"| {delay} | {timing['delays'][str(delay)]['elapsedSeconds']:.3f} |")
        artifacts.append("")
    if (root / "logs/device-baseline").exists():
        artifacts.extend(["[Device baseline](logs/device-baseline/) records USB recognition, CoreDevice availability, and Mac power assertions before measurement. Failure snapshots are retained under each delay’s logs/device-diagnostics/ directory.", ""])
    if (root / "report-render-settings.json").exists():
        artifacts.extend(["[Report rendering settings](report-render-settings.json) record the rendering fix and generator hashes separately from frozen measurement settings. [Rendering verification](report-render-verification.json) confirms unchanged data, selection and bins, raw preservation, and deterministic plot regeneration.", ""])
    (root / "artifacts.md").write_text("\n".join(artifacts))
    (root / "connection-reuse-audit.md").write_text("\n".join(audit) + "\n")
    sweep_metadata = {"delaysMs": list(delays), "pairsPerDelay": args.pairs,
                      "includeEarlyPost400": policy == "include",
                      "handshakeThresholdMs": args.handshake_threshold_ms, "difference": "ON minus OFF",
                      "binWidthMs": 10, "generatorSHA256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                      "infrastructureAttempts": [path.relative_to(root).as_posix() for path in infrastructure],
                      "runs": {str(delay): item for delay, item in metadata.items()}}
    if timing is not None:
        sweep_metadata["timing"] = timing
    (root / "run-metadata.json").write_text(json.dumps(sweep_metadata, indent=2) + "\n")


if __name__ == "__main__":
    main()
