#!/usr/bin/env python3
"""Generate an Omnient delay-sweep report from retained cold-trial evidence."""

import argparse
import hashlib
import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--pairs", type=int, default=50)
    parser.add_argument("--handshake-threshold-ms", type=float, default=20)
    parser.add_argument("--network-switches")
    args = parser.parse_args()
    root = args.output_dir
    delays = (0, 50, 100, 200)
    summarizer_path = Path(__file__).with_name("summarize-cold-benchmark.py")
    spec = importlib.util.spec_from_file_location("cold_summary", summarizer_path)
    summary = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(summary)
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
                   "--handshake-threshold-ms", str(args.handshake_threshold_ms)]
        if args.network_switches is not None:
            command.insert(5, args.network_switches)
        subprocess.run(command, check=True)
        datasets[delay] = json.loads((run / "histograms/histogram-data.json").read_text())
        metadata[delay] = json.loads((run / "run-metadata.json").read_text())
        if datasets[delay]["initialMessageDelayMs"] != delay:
            parser.error(f"Measured delay setting does not match directory: {run}")

    # All four charts for a metric have exactly the same bin edges and range.
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
    prefix = prefix.replace(f"{args.pairs} alternating OFF/ON pairs per scenario", f"{args.pairs} alternating OFF/ON pairs per delay; 0, 50, 100, 200 ms in that order")
    total_completed = total_fresh = 0
    for delay in delays:
        for pair in range(1, args.pairs + 1):
            for setting in ("off", "on"):
                row = summary.load_trial(root / f"delay-{delay}ms", "omnient", pair, setting)
                total_completed += bool(row and row.get("status") == "completed")
                total_fresh += bool(row and row.get("coldConnection") is True)
    prefix = re.sub(r"\| Test result \| .*? \|", f"| Test result | {total_completed}/{8 * args.pairs} completed trials; {total_fresh}/{8 * args.pairs} passed fresh-transport verification |", prefix)
    period = "; ".join(f"{delay} ms: {metadata[delay]['testPeriod']}" for delay in delays)
    prefix = re.sub(r"\| Test period \| .*? \|", f"| Test period | {period} |", prefix)
    prefix = prefix.replace("`initialMessageDelayMs=0`", "`initialMessageDelayMs=0, 50, 100, 200` (separate settings)")
    prefix = prefix.replace("Schedule M1 Sticky Cluster Info 0 ms after", "Schedule M1 Sticky Cluster Info at the configured delay after")
    prefix = prefix.replace("Histograms use 10 ms bins", "All four delay settings use the same horizontal range and bin edges for each metric. Histograms use 10 ms bins")
    lines = [prefix.rstrip(), "", "## Pair inclusion and early POST rejection", "",
             "The HTTP 400 rate uses all 50 attempted pairs at each delay as the denominator, including pairs that fail other histogram inclusion conditions.".replace("all 50", f"all {args.pairs}"), "",
             "| M1 delay (ms) | Measured pairs | ON early POST HTTP 400 | 400 pair rate | No early POST | Unresolved status | Histogram pairs |",
             "|---:|---:|---:|---:|---:|---:|---:|"]
    for delay, data in datasets.items():
        lines.append(f"| {delay} | {args.pairs} | {data['earlyPost400Pairs']} | {data['earlyPost400Rate'] * 100:.1f}% | {data['noEarlyPostPairs']} | {data['unknownEarlyPostPairs']} | {data['acceptedPairs']} |")
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
                      "Install/launch failures produced no paired benchmark measurement. Their files are retained separately; completed measurement pairs excluded by the histogram rules were not repeated. The interrupted pair was restarted as adjacent OFF/ON trials after reconnecting.", ""])
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
    (root / "artifacts.md").write_text("\n".join(artifacts))
    (root / "connection-reuse-audit.md").write_text("\n".join(audit) + "\n")
    sweep_metadata = {"delaysMs": list(delays), "pairsPerDelay": args.pairs,
                      "handshakeThresholdMs": args.handshake_threshold_ms, "difference": "ON minus OFF",
                      "binWidthMs": 10, "generatorSHA256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                      "infrastructureAttempts": [path.relative_to(root).as_posix() for path in infrastructure],
                      "runs": {str(delay): item for delay, item in metadata.items()}}
    (root / "run-metadata.json").write_text(json.dumps(sweep_metadata, indent=2) + "\n")


if __name__ == "__main__":
    main()
