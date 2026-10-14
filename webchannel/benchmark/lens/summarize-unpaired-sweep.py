#!/usr/bin/env python3
"""Render independent Lens observations and verify original evidence and reproducibility."""
import csv
import hashlib
import importlib.util
import json
import math
import re
import sys
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def available(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2, allow_nan=False) + "\n")


def load(root):
    settings = json.loads((root / "execution-settings.json").read_text())
    spec = importlib.util.spec_from_file_location("cold_summary", Path(__file__).with_name("summarize-cold-benchmark.py"))
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    records, identities = [], set()
    for delay in settings["delaysMs"]:
        phase = root / f"delay-{delay}ms"
        mapping = json.loads((phase / "batch-trial-map.json").read_text())
        assert sorted(x["ordinal"] for x in mapping.values()) == list(range(1, 2 * settings["pairsPerDelay"] + 1))
        for stem, item in sorted(mapping.items(), key=lambda entry: entry[1]["ordinal"]):
            source = phase / item["originalJSON"]
            row = json.loads(source.read_text())[0]
            setting = "on" if row["fastHandshake2"] else "off"
            assert digest(source) == item["jsonSHA256"]
            assert digest(phase / item["originalCSV"]) == item["csvSHA256"]
            assert row["batchTrialOrdinal"] == item["ordinal"] and row["processInstanceId"] == item["processInstanceId"]
            assert row["batchId"] == item["batchId"] and row["processId"] == item["processId"]
            assert row["batchSetting"] == setting and row["initialMessageDelayMs"] == delay
            assert row["processInstanceId"] not in identities
            identities.add(row["processInstanceId"])
            canonical = phase / "attachments" / f"{stem}-attachments"
            assert digest(canonical / source.name) == item["jsonSHA256"]
            csv_source = phase / item["originalCSV"]
            assert digest(canonical / csv_source.name) == item["csvSHA256"]
            begin, end = item["stdoutByteRange"]
            chunk = (phase / item["batchLog"]).read_bytes()[begin:end]
            assert hashlib.sha256(chunk).hexdigest() == item["trialLogSHA256"]
            assert (phase / "logs" / f"{stem}.log").read_bytes() == chunk
            record = {"delayMs": delay, "trialOrdinal": item["ordinal"], "setting": setting,
                      "startedEpochSeconds": row["trialStartedEpochSeconds"], "status": row["status"],
                      "coldConnection": row.get("coldConnection"),
                      "handshakeMs": row.get("handshakeMs"), "ttfaMs": row.get("ttfaMs"), "ttfdMs": row.get("ttfdMs"),
                      "initialEarlyPostHTTP": helper.early_post_status(phase, "omnient", row["batchPair"], setting),
                      "originalJSON": source.relative_to(root).as_posix(),
                      "originalCSV": csv_source.relative_to(root).as_posix(),
                      "log": (phase / "logs" / f"{stem}.log").relative_to(root).as_posix()}
            records.append(record)
        first = min(r["startedEpochSeconds"] for r in records if r["delayMs"] == delay)
        for record in records:
            if record["delayMs"] == delay:
                record["elapsedSeconds"] = record["startedEpochSeconds"] - first
    return settings, records


def draw(rows, metric, folder, limits, elapsed_max):
    import matplotlib
    matplotlib.use("Agg")
    matplotlib.rcParams["svg.hashsalt"] = "lens-unpaired-v1"
    import matplotlib.pyplot as plt
    from matplotlib.ticker import PercentFormatter, MaxNLocator
    key = metric.lower() + "Ms"
    zoom = limits[1] - limits[0] > 600
    result = {}
    for kind in ("scatter", "ecdf"):
        if zoom:
            fig, axes = plt.subplots(2, 1, figsize=(9, 7.5), layout="constrained")
        else:
            fig, ax = plt.subplots(figsize=(9, 4.8), layout="constrained")
            axes = [ax]
        groups = {}
        for setting, color, marker, line in (("off", "#0072B2", "o", "-"), ("on", "#D55E00", "^", "--")):
            group = [r for r in rows if r["setting"] == setting]
            plotted = [r for r in group if available(r[key])]
            values = sorted(r[key] for r in plotted)
            groups[setting] = {"recorded": len(group), "observed": len(values), "missing": len(group) - len(values),
                               "trialOrdinals": [r["trialOrdinal"] for r in plotted], "sortedValuesMs": values,
                               "cdfFractions": [(i + 1) / len(values) for i in range(len(values))]}
            label = f"{setting.upper()}: n={len(values)}, missing={len(group)-len(values)}"
            for ax in axes:
                if kind == "scatter":
                    ax.scatter([r["elapsedSeconds"] for r in plotted], [r[key] for r in plotted],
                               color=color, marker=marker, s=22, alpha=.65, linewidths=0, label=label)
                elif values:
                    ax.step([limits[0], *values, limits[1]], [0, *groups[setting]["cdfFractions"], 1],
                            where="post", color=color, linestyle=line, label=label)
                else:
                    ax.plot([], [], color=color, linestyle=line, label=label)
        for index, ax in enumerate(axes):
            ax.grid(alpha=.2)
            ax.set_axisbelow(True)
            ax.legend(fontsize=9)
            title = f"Omnient: {metric} | M1 delay {rows[0]['delayMs']} ms"
            if kind == "scatter":
                ax.set(xlabel="Elapsed time within delay (s)", ylabel=f"{metric} (ms)",
                       xlim=(0, elapsed_max), ylim=limits if index == 0 else (0, 600))
            else:
                ax.set(xlabel=f"{metric} (ms)", ylabel="Fraction of observed values", ylim=(0, 1.02),
                       xlim=limits if index == 0 else (0, 600))
                ax.yaxis.set_major_formatter(PercentFormatter(1))
            if index:
                visible = sum(available(r[key]) and 0 <= r[key] <= 600 for r in rows)
                title = f"Zoom: 0 to 600 ms ({visible} observed values in range)"
            ax.set_title(title)
        for extension in ("png", "svg"):
            kwargs = {"dpi": 160} if extension == "png" else {"metadata": {"Date": None}}
            fig.savefig(folder / f"{metric.lower()}-{kind}.{extension}", **kwargs)
        plt.close(fig)
        result[kind] = {"latencyLimitsMs": list(limits), "zoomLimitsMs": [0, 600] if zoom else None,
                        "elapsedLimitsSeconds": [0, elapsed_max] if kind == "scatter" else None, "groups": groups}
    return result


def generate(root, settings, records):
    plots = root / "plots"
    plots.mkdir(exist_ok=True)
    old = (root / "report.md").read_text()
    prefix = old.split("\n6. ", 1)[0].rstrip()
    prefix = re.sub(r"^# .*", "# Lens benchmark — Omnient individual observations", prefix, count=1)
    prefix = re.sub(r"\| Test execution \|.*", f"| Test execution | {settings['pairsPerDelay']} OFF trials and {settings['pairsPerDelay']} ON trials per delay, in alternating order; fresh application process per trial |", prefix)
    prefix = re.sub(r"^2\. .*", "2. Run Omnient with fastHandshake2 OFF and ON in alternating trial order. The XCTest creates a new WebChannelService and client per trial. Existing pair numbers are source-file identifiers only; analysis does not pair trials.", prefix, flags=re.M)
    # Keep the original environment, measurement definitions, timing, and parameters.
    lines = [prefix, "",
             "6. Treat each trial independently. For each metric, plot every finite observed value, including values from incomplete trials. Do not select by adjacent trial, handshake duration or difference, HTTP status, overall completion, or transport-freshness flag. Missing values are counted separately and never imputed as zero or the timeout duration.",
             "7. Scatter plots use elapsed time from the first trial start within each delay on the horizontal axis and the actual metric in milliseconds on the vertical axis. OFF is blue circles; ON is orange triangles. Points are not connected. Each metric shares latency limits across delays; all scatter plots share elapsed-time limits. Full-range plots retain every observation; separate lower panels show 0–600 ms when the full latency span exceeds 600 ms.",
             "8. ECDF plots use actual latency in milliseconds on the horizontal axis and the fraction of observed values at or below it on the vertical axis. OFF uses a blue solid line; ON uses an orange dashed line. Each setting is normalized by its own observed count, with missing counts shown separately. ECDFs describe observed values, not the probability of completion before the timeout.", "",
             "## Raw data", "",
             "[All individual observations — JSON](plots/all-trials.json) · [CSV](plots/all-trials.csv) · [Original evidence index](artifacts.md). The combined files copy original metric values without pairing or filtering; the original JSON/CSV exports, including logs and task metrics, are linked below.", "",
             "| M1 delay (ms) | Original JSON/CSV exports | Per-trial evidence index |",
             "|---:|---|---|"]
    for delay in settings["delaysMs"]:
        dirs = sorted({str(Path(r["originalJSON"]).parent) for r in records if r["delayMs"] == delay})
        links = " · ".join(f"[Batch {i+1}]({p}/)" for i, p in enumerate(dirs))
        lines.append(f"| {delay} | {links} | [All trials](delay-{delay}ms/artifacts.md) |")
    lines += ["", "## Observation counts and initial early POST rejection", "",
              "No handshake-difference filter is applied. HTTP 400 and unresolved HTTP status do not exclude observed values. The HTTP 400 rate uses all recorded ON trials as its denominator.", "",
              "| M1 delay (ms) | Setting | Recorded trials | TTFA observed | TTFA missing | TTFD observed | TTFD missing | ON early POST HTTP 400 |",
              "|---:|---|---:|---:|---:|---:|---:|---|"]
    for delay in settings["delaysMs"]:
        for setting in ("off", "on"):
            rows = [r for r in records if r["delayMs"] == delay and r["setting"] == setting]
            fa = sum(available(r["ttfaMs"]) for r in rows)
            fd = sum(available(r["ttfdMs"]) for r in rows)
            rejected = sum("400" in r["initialEarlyPostHTTP"].split(", ") for r in rows)
            rejection = f"{rejected}/{len(rows)} ({100*rejected/len(rows):.1f}%)" if setting == "on" else "—"
            lines.append(f"| {delay} | {setting.upper()} | {len(rows)} | {fa} | {len(rows)-fa} | {fd} | {len(rows)-fd} | {rejection} |")
    elapsed_max = max(r["elapsedSeconds"] for r in records) * 1.02 or 1
    datasets = {}
    for metric in ("TTFA", "TTFD"):
        values = [r[metric.lower()+"Ms"] for r in records if available(r[metric.lower()+"Ms"])]
        limits = (min([0, *values]), max([1, *values]) * 1.04)
        for delay in settings["delaysMs"]:
            rows = [r for r in records if r["delayMs"] == delay]
            folder = plots / f"delay-{delay}ms"
            folder.mkdir(exist_ok=True)
            datasets.setdefault(str(delay), {})[metric] = draw(rows, metric, folder, limits, elapsed_max)
    for delay in settings["delaysMs"]:
        lines += ["", f"## M1 delay: {delay} ms", ""]
        for metric in ("TTFA", "TTFD"):
            lines += [f"### {metric}", "",
                      f"![{metric} individual observations](plots/delay-{delay}ms/{metric.lower()}-scatter.png)", "",
                      f"![{metric} ECDF](plots/delay-{delay}ms/{metric.lower()}-ecdf.png)", ""]
    (root / "report.md").write_text("\n".join(lines))
    write_json(plots / "all-trials.json", records)
    with (plots / "all-trials.csv").open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(records[0]))
        writer.writeheader()
        writer.writerows(records)
    write_json(plots / "plot-data.json", datasets)
    previous = json.loads((root / "run-metadata.json").read_text())
    previous.update(reportFormat="unpaired", handshakeDifferenceFilterApplied=False, handshakeThresholdMs=None, difference=None, binWidthMs=None,
                    observationPolicy="All finite values per metric; no paired subtraction or status/transport selection")
    write_json(root / "run-metadata.json", previous)
    timing = json.loads((root / "timing.json").read_text())
    artifacts = ["# Omnient individual-observation artifacts", "", "[Report](report.md) · [Transport audit](connection-reuse-audit.md)", "",
                 "[All observations JSON](plots/all-trials.json) · [CSV](plots/all-trials.csv) retain every trial, original metric values, missing values, status, and links to original exports and logs. [Plot data](plots/plot-data.json) retains every plotted ordinal, sorted ECDF value, cumulative fraction, and shared axis limits.", "",
                 "[Input hashes](plots/input-manifest.json) · [Generation settings](report-generation-settings.json) · [Verification](plots/verification.json). These describe report generation separately from the unchanged [measurement settings](execution-settings.json) and [measurement completion checks](completion.json).", "",
                 "| M1 delay (ms) | Original evidence | Transport audit | Plot files |", "|---:|---|---|---|"]
    for delay in settings["delaysMs"]:
        artifacts.append(f"| {delay} | [Per-trial index](delay-{delay}ms/artifacts.md) | [Audit](delay-{delay}ms/connection-reuse-audit.md) | [PNG/SVG](plots/delay-{delay}ms/) |")
    artifacts += ["", "The per-delay evidence indexes also retain the earlier paired histograms as historical analysis. They do not define selection for this report. [Previous main report](legacy-paired-report/report.md) preserves the superseded analysis. Plot proposals remain separate.", "",
                  "## Benchmark elapsed time by delay", "", "[Original timing](timing.json) includes launch, measurement, export and any recovery gaps; excludes build and report generation.", "",
                  "| M1 delay (ms) | Elapsed seconds |", "|---:|---:|"]
    artifacts.extend(f"| {d} | {timing['delays'][str(d)]['elapsedSeconds']:.3f} |" for d in settings["delaysMs"])
    artifacts += ["", "Raw exports, log files, result bundles and the connection audit are unchanged. Trial file identifiers retain their original names; they are not analytical pairings."]
    (root / "artifacts.md").write_text("\n".join(artifacts) + "\n")


def run_verified(root):
    root = Path(root).resolve()
    plots = root / "plots"
    plots.mkdir(exist_ok=True)
    raw = {p.relative_to(root).as_posix(): digest(p) for phase in root.glob("delay-*ms")
           for category in ("logs", "attachments") for p in (phase / category).rglob("*") if p.is_file()}
    for phase in root.glob("delay-*ms"):
        manifest = phase / "histograms/input-manifest.json"
        if manifest.exists():
            for item in json.loads(manifest.read_text()):
                assert digest(phase / item["path"]) == item["sha256"]
    settings, records = load(root)
    legacy = root / "legacy-paired-report"
    if not legacy.exists():
        legacy.mkdir()
        import shutil
        shutil.copy2(root / "report.md", legacy / "report.md")
        shutil.copy2(root / "run-metadata.json", legacy / "run-metadata.json")
        # Preserve functioning relative image links in the archived report.
        text = (legacy / "report.md").read_text()
        text = re.sub(r"\]\((?!https?://|#)([^)]+)\)", r"](../\1)", text)
        (legacy / "report.md").write_text(text)
    source_hashes = {p.name: digest(p) for p in (Path(__file__), Path(__file__).with_name("summarize-cold-benchmark.py"))}
    write_json(root / "report-generation-settings.json", {"reportFormat": "unpaired", "scriptsSHA256": source_hashes,
               "handshakeDifferenceFilterApplied": False, "sourceMeasurementSettings": "execution-settings.json"})
    write_json(plots / "input-manifest.json", [{"path": p, "sha256": h} for p, h in sorted(raw.items())])
    if not (plots / "verification.json").exists():
        write_json(plots / "verification.json", {"status": "pending"})
    generate(root, settings, records)
    # Independently derive plotted membership and ECDF from original observations.
    data = json.loads((plots / "plot-data.json").read_text())
    for delay in settings["delaysMs"]:
        for metric in ("TTFA", "TTFD"):
            for setting in ("off", "on"):
                rows = [r for r in records if r["delayMs"] == delay and r["setting"] == setting]
                finite = [r for r in rows if available(r[metric.lower()+"Ms"])]
                for kind in ("scatter", "ecdf"):
                    group = data[str(delay)][metric][kind]["groups"][setting]
                    assert group["trialOrdinals"] == [r["trialOrdinal"] for r in finite]
                    assert group["sortedValuesMs"] == sorted(r[metric.lower()+"Ms"] for r in finite)
                    assert group["missing"] == len(rows)-len(finite)
                    assert group["cdfFractions"] == [(i+1)/len(finite) for i in range(len(finite))]
    generated = {p: digest(p) for p in plots.rglob("*") if p.is_file()}
    for name in ("report.md", "artifacts.md", "run-metadata.json"):
        generated[root / name] = digest(root / name)
    generate(root, settings, records)
    assert all(digest(p) == h for p, h in generated.items()), "Regeneration changed generated files"
    assert all(digest(root / p) == h for p, h in raw.items()), "Raw evidence changed"
    # Every combined metric value equals the original source, including partial results.
    for record in json.loads((plots / "all-trials.json").read_text()):
        original = json.loads((root / record["originalJSON"]).read_text())[0]
        for metric in ("handshakeMs", "ttfaMs", "ttfdMs"):
            assert record[metric] == original.get(metric)
    for p in (root / "report.md", root / "artifacts.md"):
        for link in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", p.read_text()):
            if "://" not in link and not link.startswith("#"):
                assert (p.parent / link).exists(), (p, link)
    result = {"status": "complete", "trials": len(records), "rawFilesPreserved": len(raw),
              "metricObservationCounts": {m: {s: sum(r['setting']==s and available(r[m.lower()+'Ms']) for r in records)
                                             for s in ('off','on')} for m in ('TTFA','TTFD')},
              "verification": "Original export/log identity and hashes, all finite metric observations, missing counts, ECDF, links, shared limits and deterministic regeneration verified"}
    write_json(plots / "verification.json", result)
    print(json.dumps(result))


if __name__ == "__main__":
    run_verified(Path(sys.argv[1]))
