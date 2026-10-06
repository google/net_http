#!/usr/bin/env python3
"""Summarize one-process-per-trial Lens results exported by xcresulttool."""

import argparse
import csv
import hashlib
import json
import math
import re
import subprocess
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path
from urllib.parse import parse_qs, urlsplit


def trial_attachments(root: Path, stem: str):
    nested = root / "attachments" / f"{stem}-attachments"
    return nested if nested.exists() else root / f"{stem}-attachments"


def trial_result(root: Path, stem: str):
    nested = root / "xcresults" / f"{stem}.xcresult"
    return nested if nested.exists() else root / f"{stem}.xcresult"


def load_trial(root: Path, scenario: str, pair: int, setting: str):
    export = trial_attachments(root, f"{scenario}-{pair}-{setting}")
    for path in sorted(export.glob("*.json")):
        if path.name != "manifest.json":
            rows = json.loads(path.read_text())
            if rows:
                return rows[0]
    return None


def handshake_transport(row):
    if not row:
        return None
    method = "GET" if row["fastHandshake2"] else "POST"
    records = [
        record for record in row.get("transportMetrics", [])
        if record.get("method") == method and record.get("rid", "").isdigit()
    ]
    return min(records, key=lambda record: int(record["rid"])) if records else None


def fmt(value):
    return f"{value:.3f}"


def trial_log(root: Path, scenario: str, pair: int, setting: str, suffix: str = ""):
    name = f"{scenario}-{pair}-{setting}{suffix}.log"
    nested = root / "logs" / name
    return nested if nested.exists() else root / name


def early_post_status(root: Path, scenario: str, pair: int, setting: str):
    if setting == "off":
        return "—"
    log = trial_log(root, scenario, pair, setting)
    if not log.exists():
        return "unknown"
    text = log.read_text(errors="replace")
    early_requests = [parse_qs(urlsplit(url).query) for url in re.findall(r"\[HTTP Req\].*? POST (\S+)", text)]
    early_rids = [int(query["RID"][0]) for query in early_requests
                  if query.get("AID") == ["-1"] and query.get("RID", [""])[0].isdigit()]
    statuses_by_rid = {}
    for line in text.splitlines():
        match = re.search(r"\[HTTP Resp Meta\].*?\] POST (\S+) status: (\d+)", line)
        if match:
            query = parse_qs(urlsplit(match.group(1)).query)
            rid = query.get("RID", [""])[0]
            if query.get("AID") == ["-1"] and rid.isdigit():
                statuses_by_rid.setdefault(int(rid), set()).add(match.group(2))
    if not statuses_by_rid:
        return "not sent" if not early_rids and "[SDK Info] WebChannel opened on " in text else "unknown"
    first_rid = min(early_rids) if early_rids else min(statuses_by_rid)
    return ", ".join(sorted(statuses_by_rid[first_rid])) if first_rid in statuses_by_rid else "unknown"


def has_early_post_400(status):
    return "400" in status.split(", ")


def pair_reasons(off, on, threshold_ms):
    reasons = []
    required = ("handshakeMs", "ttfaMs", "ttfdMs", "m4RttMs")
    for setting, row in (("OFF", off), ("ON", on)):
        if row is None:
            reasons.append(f"{setting} attachment missing")
        elif row.get("status") != "completed" or any(
            not isinstance(row.get(key), (int, float)) or not math.isfinite(row[key])
            for key in required
        ):
            reasons.append(f"{setting} incomplete")
        elif row.get("coldConnection") is not True:
            reasons.append(f"{setting} handshake connection unverified")
    if not reasons and abs(on["handshakeMs"] - off["handshakeMs"]) > threshold_ms:
        reasons.append(f"handshake difference >{threshold_ms:g} ms")
    return reasons


def histogram_pair_reasons(off, on, threshold_ms, post_status, include_early_post_400=False):
    reasons = pair_reasons(off, on, threshold_ms)
    if has_early_post_400(post_status) and not include_early_post_400:
        reasons.append("ON initial early POST HTTP 400")
    elif post_status == "unknown":
        reasons.append("ON initial early POST status unresolved")
    return reasons


def plot_histogram(values, path, metric, delay_ms, bin_width=10, bounds=None):
    import matplotlib
    matplotlib.use("Agg")
    matplotlib.rcParams["svg.hashsalt"] = "lens-histogram-v1"
    import matplotlib.pyplot as plt
    from matplotlib.ticker import MaxNLocator

    low, high = bounds or (min(values + [0]), max(values + [0]))
    lower = math.floor(low / bin_width) * bin_width
    upper = max(lower + bin_width, (math.floor(high / bin_width) + 1) * bin_width)
    bins = [lower + i * bin_width for i in range(round((upper - lower) / bin_width) + 1)]
    show_detail = bins[-1] - bins[0] > 600 and any(-300 <= value <= 300 for value in values)
    if show_detail:
        fig, (ax, detail) = plt.subplots(2, 1, figsize=(9, 7.5), layout="constrained")
    else:
        fig, ax = plt.subplots(figsize=(9, 4.8), layout="constrained")
    counts, edges, _ = ax.hist(values, bins=bins, color="#2c6eaa", edgecolor="none", linewidth=0)
    ax.axvline(0, color="#333333", linestyle="--", linewidth=1)
    ax.set(title=f"Omnient: {metric} ON - OFF | M1 delay {delay_ms} ms | n={len(values)}",
           xlabel=f"{metric} difference (ms): negative = ON faster", ylabel="Pair count")
    ax.yaxis.set_major_locator(MaxNLocator(integer=True))
    ax.grid(axis="y", alpha=0.2)
    ax.set_axisbelow(True)
    ax.set_xlim(bins[0], bins[-1])
    if show_detail:
        detail.hist(values, bins=bins, color="#2c6eaa", edgecolor="none", linewidth=0)
        detail.axvline(0, color="#333333", linestyle="--", linewidth=1)
        detail.set_xlim(-300, 300)
        detail.yaxis.set_major_locator(MaxNLocator(integer=True))
        detail.grid(axis="y", alpha=0.2)
        detail.set_axisbelow(True)
        visible = sum(-300 <= value <= 300 for value in values)
        detail.set_title(f"Zoom: -300 to 300 ms ({visible}/{len(values)} pairs)")
        detail.set_xlabel(f"{metric} difference (ms): negative = ON faster")
        detail.set_ylabel("Pair count")
    if not values:
        ax.text(0.5, 0.5, "No eligible pairs", transform=ax.transAxes, ha="center")
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(path, dpi=160)
    fig.savefig(path.with_suffix(".svg"), metadata={"Date": None})
    plt.close(fig)
    return {"binEdgesMs": edges.tolist(), "pairCounts": counts.astype(int).tolist()}


def message_dispatch(root: Path, scenario: str, pair: int, setting: str, handshake):
    """Locate M1/M3's first HTTP request from fixed message offsets and request logs."""
    log = trial_log(root, scenario, pair, setting)
    if not log.exists() or not handshake:
        return "unknown", "unknown", "unknown"
    handshake_rid = handshake.get("rid")
    opened = False
    handshake_count = None
    first_request = {}
    for line in log.read_text(errors="replace").splitlines():
        if "[SDK Info] WebChannel opened on " in line:
            opened = True
        match = re.search(r"\[HTTP Req\] \(([^)]+)\) \[attempt \d+\] (GET|POST) (\S+)", line)
        if not match:
            continue
        rid, method, url = match.groups()
        query = parse_qs(urlsplit(url).query)
        body = re.search(r"PostData: \{length = \d+, bytes = 0x([0-9a-fA-F ]+)", line)
        if body:
            prefix = bytes.fromhex(body.group(1).replace(" ", "")).decode("ascii", errors="replace")
        else:
            prefix = query.get("$req", [""])[0]
        count_match = re.search(r"count=(\d+)", prefix)
        offset_match = re.search(r"ofs=(\d+)", prefix)
        count = int(count_match.group(1)) if count_match else None
        offset = int(offset_match.group(1)) if offset_match else None
        if rid == handshake_rid and count is not None:
            handshake_count = count
        if method != "POST" or count is None or offset is None:
            continue
        for index in range(offset, offset + count):
            if index not in first_request:
                if rid == handshake_rid:
                    location = "handshake POST"
                elif query.get("AID") == ["-1"] and not opened:
                    location = "early POST"
                elif opened:
                    location = "post-open POST"
                else:
                    location = "pre-open POST"
                first_request[index] = location
    m3_offset = 1 if scenario == "omnient" else 2
    payload = f"count={handshake_count}" if handshake_count is not None else "unknown"
    return payload, first_request.get(0, "unknown"), first_request.get(m3_offset, "unknown")


def command_output(*args):
    result = subprocess.run(args, capture_output=True, text=True, check=False)
    return result.stdout.strip() if result.returncode == 0 else "unavailable"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("pairs", nargs="?", type=int)
    parser.add_argument("network_switches", nargs="?")
    parser.add_argument("--handshake-threshold-ms", type=float)
    parser.add_argument("--scenarios", nargs="+", choices=("omnient", "viewfinder"))
    parser.add_argument("--report-format", choices=("raw", "histogram"))
    parser.add_argument("--early-post-400-policy", choices=("include", "exclude"))
    args = parser.parse_args()
    root = args.output_dir
    metadata_path = root / "run-metadata.json"
    metadata = json.loads(metadata_path.read_text()) if metadata_path.exists() else {}
    pair_count = args.pairs if args.pairs is not None else metadata.get("pairCount", 10)
    if pair_count < 1:
        parser.error("pairs must be positive")
    scenarios = tuple(args.scenarios or metadata.get("scenarios", ("omnient", "viewfinder")))
    report_format = args.report_format or metadata.get("reportFormat", "raw")
    include_early_post_400 = (args.early_post_400_policy == "include" if args.early_post_400_policy
                              else metadata.get("includeEarlyPost400", False))
    if report_format == "histogram" and scenarios != ("omnient",):
        parser.error("histogram reports currently require --scenarios omnient")
    trials = {}
    for scenario in scenarios:
        for pair in range(1, pair_count + 1):
            for setting in ("off", "on"):
                trials[scenario, pair, setting] = load_trial(root, scenario, pair, setting)

    first = next((row for row in trials.values() if row), {})
    protocol = metadata.get("executionProtocol", "xcode-relaunch-batch" if "batchTrialOrdinal" in first else "separate-xcodebuild")
    batched = protocol == "xcode-relaunch-batch"
    if batched:
        metadata["executionProtocol"] = protocol
    binary_encoding = first.get("enableBinaryEncoding", False)
    initial_message_delay_ms = first.get("initialMessageDelayMs", 0)
    if any(row is not None and row.get("enableBinaryEncoding", False) != binary_encoding
           for row in trials.values()):
        raise ValueError("Run contains mixed binary-encoding settings")
    if any(row is not None and row.get("initialMessageDelayMs", 0) != initial_message_delay_ms
           for row in trials.values()):
        raise ValueError("Run contains mixed initial-message delay settings")
    logs = [trial_log(root, *key) for key in trials]
    logs = [path for path in logs if path.exists()]
    if logs:
        start = datetime.fromtimestamp(min(path.stat().st_ctime for path in logs), ZoneInfo("Asia/Tokyo"))
        end = datetime.fromtimestamp(max(path.stat().st_mtime for path in logs), ZoneInfo("Asia/Tokyo"))
        detected_period = f"{start:%Y-%m-%d %H:%M}–{end:%H:%M} JST, from artifact timestamps"
    else:
        detected_period = "unavailable"
        start = datetime.now(ZoneInfo("Asia/Tokyo"))
    metadata["pairCount"] = pair_count
    metadata["scenarios"] = list(scenarios)
    metadata["reportFormat"] = report_format
    if report_format == "histogram":
        metadata["includeEarlyPost400"] = include_early_post_400
    metadata.setdefault("runDate", f"{start:%Y-%m-%d}")
    metadata.setdefault("testPeriod", detected_period)
    metadata.setdefault("macOS", command_output("sw_vers", "-productVersion"))
    metadata.setdefault("xcode", command_output("xcodebuild", "-version").replace("\n", "; "))
    metadata.setdefault("sourceGitHead", command_output("git", "rev-parse", "HEAD"))
    if args.network_switches is not None:
        metadata["networkSwitches"] = args.network_switches
    metadata.setdefault("networkSwitches", "Not independently recorded for this run")
    if args.handshake_threshold_ms is not None:
        metadata["handshakeThresholdMs"] = args.handshake_threshold_ms
    metadata.setdefault("handshakeThresholdMs", 10)
    metadata.setdefault("initialMessageDelayMs", initial_message_delay_ms)
    threshold_ms = float(metadata["handshakeThresholdMs"])
    if not math.isfinite(threshold_ms) or threshold_ms < 0:
        parser.error("handshake threshold must be a finite nonnegative number")
    metadata_path.write_text(json.dumps(metadata, indent=2, ensure_ascii=False) + "\n")
    succeeded = sum(row is not None and row.get("status") == "completed" for row in trials.values())
    cold = sum(row is not None and row.get("coldConnection") is True for row in trials.values())
    early_post_statuses = {
        key: early_post_status(root, *key) for key in trials
    }
    metrics = (
        ("Handshake", "handshakeMs"),
        ("TTFA", "ttfaMs"),
        ("TTFD", "ttfdMs"),
        ("M4 RTT", "m4RttMs"),
    )
    lines = [
        f"# Lens benchmark — {metadata['runDate']} physical-device cold-connection run"
        f"{' (binary encoding)' if binary_encoding else ''}",
        "",
        "## Experiment specification",
        "",
        "[Google net_http: Lens Latency Mimic & Shutter Benchmark Mode](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).",
        "",
        "## Environment",
        "",
        "| Field | Recorded value |",
        "|---|---|",
        "| Device | iPhone SE (3rd generation), hardware model `iPhone14,6` |",
        f"| iOS | {first.get('systemVersion', 'unavailable')}, from XCTest |",
        f"| Network switches | {metadata['networkSwitches']} |",
        f"| Endpoint | `{first.get('endpoint', 'unavailable')}` |",
        f"| Mac | macOS {metadata['macOS']}; {metadata['xcode']} |",
        f"| Source | Git HEAD `{metadata['sourceGitHead']}` plus uncommitted benchmark instrumentation |",
        f"| Test period | {metadata['testPeriod']} |",
        f"| Test execution | {pair_count} alternating OFF/ON pairs per scenario; " + ("one selected test repeated within retained xcodebuild batches, with the application relaunched for every trial |" if batched else "a separate `xcodebuild test-without-building` invocation for each trial |"),
        f"| Test result | {'All trials completed and passed fresh-transport verification' if succeeded == cold == 2 * len(scenarios) * pair_count else f'{succeeded} completed trials; {cold} passed fresh-transport verification'} |",
        "| Transport requirement | First transport: `h2`, a new TCP/TLS connection on the handshake GET/POST or early POST; if the GET reused the early POST connection, matching address and local port |",
        "",
        "## Procedure and parameters",
        "",
        ("1. Build the XCTest bundle once, then repeat one alternating cold-trial test with `-test-iterations` and `-test-repetition-relaunch-enabled YES`. Each repetition enters a fresh application process and runs only OFF or ON. A batch-specific atomic counter preserves OFF→ON ordering across application restarts. Keep parallel testing disabled; retain every test result, including failed measurement iterations, without retries or replacements." if batched else "1. Build the XCTest bundle once, then launch exactly one cold-trial test method per `xcodebuild test-without-building` invocation. Keep parallel testing disabled and retain each `.xcresult` bundle."),
        f"2. Run {', then '.join('Omnient' if scenario == 'omnient' else 'Camera Viewfinder' for scenario in scenarios)}. Each pair runs `fastHandshake2=false` (OFF), then `fastHandshake2=true` (ON). The XCTest creates a new `WebChannelService` and WebChannel client per trial.",
        f"3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `initialMessageDelayMs={initial_message_delay_ms}`, `enableBinaryEncoding={'true' if binary_encoding else 'false'}`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is metadata; no 150 KB image is uploaded.",
        f"4. Schedule M1 Sticky Cluster Info {initial_message_delay_ms} ms after `connect()` returns. "
        + ("Omnient sends M3 Prefetch immediately after M1. " if "omnient" in scenarios else "")
        + ("Camera Viewfinder schedules M2 Heartbeat at +200 ms and M3 Prefetch at +500 ms after `connect()` returns. " if "viewfinder" in scenarios else "")
        + "M4 Final Capture follows preliminary detections. Each trial has a 60-second completion deadline.",
        "5. Record Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).",
        f"6. Include a pair in the {'histograms' if report_format == 'histogram' else 'raw measurement tables'} only if both runs completed, both trials meet the transport requirement, and the absolute ON/OFF handshake-duration difference is ≤{threshold_ms:g} ms. Calculate that difference from full-precision values. Keep every trial in the raw attachments and audit.",
        "",
    ]

    if report_format == "histogram":
        lines.extend([
            ("7. Include pairs whose ON initial early POST returned HTTP 400, including trials completed after retry. The ordinary completion, fresh-transport, and handshake-difference requirements still apply. "
             if include_early_post_400 else "7. Exclude a pair if the ON trial's initial early POST returned HTTP 400, even if a retry completed the trial. ")
            + "An unresolved early POST status is excluded; a verified absence of an early POST is eligible. Do not replace excluded pairs with additional trials.",
            "8. Plot paired differences as ON minus OFF, using full-precision measurements. Negative values mean ON was faster. Histograms use 10 ms bins aligned to multiples of 10 ms, pair counts on the vertical axis, and all eligible values without clipping in the main plot. When the full range exceeds 600 ms, a separate lower panel magnifies -300 to 300 ms and labels the number of pairs in that range; no additional pairs are excluded. TTFA and TTFD are measured from M3 send, so the configured M1 delay is not added to either metric.",
            "",
        ])

    histogram_data = {"initialMessageDelayMs": initial_message_delay_ms, "pairCount": pair_count,
                      "includeEarlyPost400": include_early_post_400,
                      "handshakeThresholdMs": threshold_ms, "difference": "ON minus OFF", "binWidthMs": 10,
                      "pairs": [], "histograms": {}}
    for scenario in scenarios:
        heading = "Omnient" if scenario == "omnient" else "Camera Viewfinder"
        selected = []
        for pair in range(1, pair_count + 1):
            off = trials[scenario, pair, "off"]
            on = trials[scenario, pair, "on"]
            reasons = pair_reasons(off, on, threshold_ms)
            if report_format == "histogram":
                post_status = early_post_statuses[scenario, pair, "on"]
                reasons = histogram_pair_reasons(off, on, threshold_ms, post_status, include_early_post_400)
                record = {"pair": pair, "accepted": not reasons, "exclusionReasons": reasons,
                          "earlyPostHTTP": post_status, "ttfaDifferenceMs": None, "ttfdDifferenceMs": None}
                if off and on:
                    for key, metric in (("ttfaDifferenceMs", "ttfaMs"), ("ttfdDifferenceMs", "ttfdMs")):
                        if off.get(metric) is not None and on.get(metric) is not None:
                            record[key] = on[metric] - off[metric]
                histogram_data["pairs"].append(record)
            if not reasons:
                selected.extend(((pair, "OFF", off), (pair, "ON", on)))

        if report_format == "histogram":
            statuses = [early_post_statuses[scenario, pair, "on"] for pair in range(1, pair_count + 1)]
            rejected = sum(has_early_post_400(status) for status in statuses)
            histogram_data.update(earlyPost400Pairs=rejected, earlyPost400Rate=rejected / pair_count,
                                  unknownEarlyPostPairs=statuses.count("unknown"), noEarlyPostPairs=statuses.count("not sent"),
                                  acceptedPairs=len(selected) // 2)
            histogram_data["includedEarlyPost400Pairs"] = sum(
                record["accepted"] and has_early_post_400(record["earlyPostHTTP"])
                for record in histogram_data["pairs"])
            lines.extend([
                f"## {heading}: paired difference histograms",
                "",
                "| Item | Count / rate |",
                "|---|---:|",
                f"| Measured OFF/ON pairs | {pair_count} |",
                f"| ON initial early POST HTTP 400 pairs | {rejected}/{pair_count} ({100 * rejected / pair_count:.1f}%) |",
                f"| ON early POST not sent | {statuses.count('not sent')} |",
                f"| ON early POST status unresolved | {statuses.count('unknown')} |",
                f"| Pairs included in both histograms | {len(selected) // 2}/{pair_count} |",
                f"| HTTP 400 pairs included in histograms | {histogram_data['includedEarlyPost400Pairs']} |",
                "",
            ])
            for metric, key in (("TTFA", "ttfaDifferenceMs"), ("TTFD", "ttfdDifferenceMs")):
                values = [record[key] for record in histogram_data["pairs"] if record["accepted"]]
                path = root / "histograms" / f"{metric.lower()}-on-minus-off.png"
                histogram_data["histograms"][metric] = plot_histogram(values, path, metric, initial_message_delay_ms)
                lines.extend([f"### {metric}: ON minus OFF", "", f"![{metric} paired difference histogram]({path.relative_to(root).as_posix()})", ""])
            continue

        lines.extend([
            f"## {heading}: valid pair raw measurements",
            "",
            "Values shown in the table are rounded to three decimal places.",
            "",
            "| Run # | fastHandshake2 | Handshake (ms) | TTFA (ms) | TTFD (ms) | M4 RTT (ms) |",
            "|---:|:---:|---:|---:|---:|---:|",
        ])
        for pair, setting, row in selected:
            values = " | ".join(fmt(row[key]) for _, key in metrics)
            lines.append(f"| {pair} | {setting} | {values} |")
        if not selected:
            lines.append("| — | — | — | — | — | — |")
        lines.append("")

    audit_lines = ["# Handshake transport audit", "",
        "[Report](report.md) · [Artifacts](artifacts.md)", "",
        "The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.", "",
        "The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.", "",
        "A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.", "",
        "Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.", "",
        "| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |",
        "|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|",
    ]
    for (scenario, pair, setting), row in trials.items():
        transport = handshake_transport(row)
        fresh = None
        if row:
            fresh = next((record for record in row.get("transportMetrics", [])
                          if record.get("protocol") == "h2"
                          and record.get("reusedConnection") is False
                          and record.get("tcpConnectMs") is not None
                          and record.get("tlsMs") is not None), None)
        if transport:
            protocol = transport.get("protocol", "—")
            reused = str(transport.get("reusedConnection", "—")).lower()
        else:
            protocol = reused = "—"
        tcp = fmt(fresh["tcpConnectMs"]) if fresh else "—"
        tls = fmt(fresh["tlsMs"]) if fresh else "—"
        address = transport.get("remoteAddress", "—") if transport else "—"
        status = row.get("status", "attachment missing") if row else "attachment missing"
        source = row.get("coldConnectionSource", "—") if row else "—"
        post_status = early_post_statuses[scenario, pair, setting]
        audit_lines.append(f"| {scenario} | {pair} | {setting.upper()} | {status} | {post_status} | {source} | {protocol} | {reused} | {tcp} | {tls} | {address} |")
    audit_lines.extend(["", "## M1 and M3 dispatch", "",
        "The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.", "",
        "M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.", "",
        "The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.", "",
        "| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |",
        "|---|---:|:---:|---:|:---:|---|---|",
    ])
    for (scenario, pair, setting), row in trials.items():
        payload, m1, m3 = message_dispatch(root, scenario, pair, setting, handshake_transport(row))
        m1_delay = fmt(row["m1DelayFromConnectMs"]) if row and row.get("m1DelayFromConnectMs") is not None else "—"
        audit_lines.append(f"| {scenario} | {pair} | {setting.upper()} | {m1_delay} | {payload} | {m1} | {m3} |")
    viewfinder_open_before_prefetch = all(
        row is not None and row.get("handshakeMs", float("inf")) < 500
        for (scenario, _, _), row in trials.items() if scenario == "viewfinder"
    )
    viewfinder_timing = ("after the channel opened in every completed Viewfinder trial"
                         if viewfinder_open_before_prefetch else "near the channel opening")
    retries = {}
    for scenario in scenarios:
        retries[scenario] = [
            pair for pair in range(1, pair_count + 1)
            if trial_log(root, scenario, pair, "on").exists()
            and "Maybe retrying, last error" in
            trial_log(root, scenario, pair, "on").read_text(errors="replace")
        ]
    failed_trials = []
    for (scenario, pair, setting), row in trials.items():
        if row is None or row.get("status") == "completed":
            continue
        log_path = trial_log(root, scenario, pair, setting)
        log_text = log_path.read_text(errors="replace") if log_path.exists() else ""
        reason = " (Xcode log includes network connection lost, -1005)" if "Code=-1005" in log_text else ""
        failed_trials.append(f"{scenario} pair {pair} {setting.upper()}{reason}")
    audit_lines.extend(["", "## Observations and limits", "",
        f"Omnient sends M3 immediately after M1, scheduled {initial_message_delay_ms} ms after connect() returns. "
        + (f"Viewfinder schedules M3 about 500 ms later, {viewfinder_timing}. " if "viewfinder" in scenarios else "")
        + "Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.",
        "",
        f"The initial early POST returned HTTP 400 in {sum(has_early_post_400(status) for status in early_post_statuses.values())}/{len(scenarios) * pair_count} ON trials. "
        f"Of those trials, {sum(has_early_post_400(status) and trials[key] is not None and trials[key].get('status') == 'completed' for key, status in early_post_statuses.items())} completed; inspect the logs to distinguish successful retries from incomplete runs.",
        "",
        "The Xcode logs contain retry diagnostics in ON trials for " + "; ".join(
            f"{scenario} pairs {', '.join(map(str, retries[scenario])) or 'none'}" for scenario in scenarios
        ) + ". Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.",
        "",
    ])
    if failed_trials:
        audit_lines.extend([f"Incomplete trials: {'; '.join(failed_trials)}.", ""])
    if batched:
        audit_lines.extend(["", "## Application-process and batch identity", "",
            "Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.", "",
            "| Pair | Setting | Batch ordinal | Application PID | Process instance |", "|---:|---|---:|---:|---|"])
        for scenario, pair, setting in trials:
            row = trials[scenario, pair, setting]
            if row:
                audit_lines.append(f"| {pair} | {setting.upper()} | {row.get('batchTrialOrdinal', 'unknown')} | {row.get('processId', 'unknown')} | {row.get('processInstanceId', 'unknown')} |")
    (root / "report.md").write_text("\n".join(lines))
    (root / "connection-reuse-audit.md").write_text("\n".join(audit_lines) + "\n")
    artifact_lines = [
        f"# Lens benchmark artifacts — {metadata['runDate']} physical-device cold-connection run",
        "",
        "[Report](report.md) · [Transport audit](connection-reuse-audit.md) · [Run metadata](run-metadata.json)",
        "",
        "Each trial has an Xcode log and exported attachments. Current runs keep logs in `logs/`, result bundles in `xcresults/`, and exported attachments in `attachments/`; older runs may keep these at the run root. The exported JSON and CSV preserve every attempted trial, including pairs omitted from the report tables. CSV values retain their recorded precision.",
        "",
        "| Scenario | Run # | Setting | Raw CSV | Raw JSON | Xcode log | Export log | Result bundle | Export manifest |",
        "|---|---:|:---:|---|---|---|---|---|---|",
    ]
    def artifact_link(path, label):
        return f"[{label}]({path.relative_to(root).as_posix()})" if path.exists() else "—"

    for scenario in scenarios:
        for pair in range(1, pair_count + 1):
            for setting in ("off", "on"):
                stem = f"{scenario}-{pair}-{setting}"
                export = trial_attachments(root, stem)
                csv_path = next(iter(sorted(export.glob("*.csv"))), None)
                json_path = next((path for path in sorted(export.glob("*.json")) if path.name != "manifest.json"), None)
                csv_link = artifact_link(csv_path, "CSV") if csv_path else "—"
                json_link = artifact_link(json_path, "JSON") if json_path else "—"
                artifact_lines.append(
                    f"| {scenario} | {pair} | {setting.upper()} | {csv_link} | {json_link} | "
                    f"{artifact_link(trial_log(root, scenario, pair, setting), 'Log')} | "
                    f"{artifact_link(trial_log(root, scenario, pair, setting, '-export'), 'Export log')} | "
                    f"{artifact_link(trial_result(root, stem), 'xcresult')} | "
                    f"{artifact_link(export / 'manifest.json', 'Manifest')} |"
                )
    if report_format == "histogram":
        import matplotlib
        histogram_data["matplotlibVersion"] = matplotlib.__version__
        histogram_data["generatorSHA256"] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
        data_path = root / "histograms" / "histogram-data.json"
        data_path.write_text(json.dumps(histogram_data, indent=2, ensure_ascii=False) + "\n")
        csv_path = root / "histograms" / "pair-differences.csv"
        with csv_path.open("w", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=list(histogram_data["pairs"][0]))
            writer.writeheader()
            writer.writerows(histogram_data["pairs"])
        evidence = set(logs)
        for scenario, pair, setting in trials:
            export = trial_attachments(root, f"{scenario}-{pair}-{setting}")
            evidence.update(path for path in export.glob("*") if path.suffix in (".json", ".csv"))
        manifest = [{"path": path.relative_to(root).as_posix(), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
                    for path in sorted(evidence)]
        (root / "histograms" / "input-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
        artifact_lines.extend(["", "## Histogram evidence", "",
            "[Histogram data and selection decisions](histograms/histogram-data.json) · [Full-precision paired differences](histograms/pair-differences.csv). Each record retains its pair number and exclusion reasons; no raw measurement is changed.", "",
            "[Input SHA-256 manifest](histograms/input-manifest.json) records the raw files used for aggregation. The histogram JSON records the renderer version and generator SHA-256.", "",
            "| Metric | PNG | SVG |", "|---|---|---|",
            "| TTFA | [PNG](histograms/ttfa-on-minus-off.png) | [SVG](histograms/ttfa-on-minus-off.svg) |",
            "| TTFD | [PNG](histograms/ttfd-on-minus-off.png) | [SVG](histograms/ttfd-on-minus-off.svg) |", ""])
    artifact_lines.extend(["", "JSON includes app logs and task-level `URLSessionTaskMetrics`. Xcode logs include HTTP response metadata used to classify early POST status. Manifests map exported attachments to XCTest tests.", ""])
    if batched:
        artifact_lines.extend(["## Batch provenance", "",
            "The per-trial JSON and CSV are byte-identical copies of original exported attachments. Per-trial logs are exact byte ranges of the shared Xcode stdout; they are not separate Xcode invocations. The result-bundle aliases point to the same retained batch bundle. CSV repetition remains the test's local repetition (1); batchTrialOrdinal and batchPair identify the experiment trial.", "",
            "[Trial-to-batch mapping](batch-trial-map.json) records original attachment paths, SHA-256 hashes, XCTest repetition numbers, process identities, and stdout byte ranges. [Batch settings](batch-settings.json) retain the actual command. [Batch outcome](batch-outcome.json) links retained exit codes, including recorded measurement and startup failures. [Original batch stdout](logs/batch-0001.log) · [Attachment export log](logs/batch-0001-export.log) · [Original exported attachments](attachments/batch-0001-export/) · [Shared result bundle](xcresults/batch-0001.xcresult)", ""])
    if batched:
        for bundle in sorted((root / "xcresults").glob("batch-*.xcresult")):
            name = bundle.stem
            artifact_lines.append(f"- {name}: [stdout](logs/{name}.log), [export log](logs/{name}-export.log), [original exports](attachments/{name}-export/), [result bundle](xcresults/{name}.xcresult)")
            for kind in ("settings", "outcome"):
                if (root / f"logs/{name}-{kind}.json").exists():
                    artifact_lines.append(f"  - [{kind}](logs/{name}-{kind}.json)")
        if (root / "resume-review.json").exists():
            artifact_lines.extend(["", "[Resume review](resume-review.json) preserves the startup failure and validates the recorded prefix before resuming only unentered measurement ordinals. XCTest repetition numbers may differ from measurement ordinals after a startup failure; both original identities are retained."])
    (root / "artifacts.md").write_text("\n".join(artifact_lines))


if __name__ == "__main__":
    main()
