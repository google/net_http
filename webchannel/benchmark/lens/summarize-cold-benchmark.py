#!/usr/bin/env python3
"""Summarize one-process-per-trial Lens results exported by xcresulttool."""

import argparse
import json
import math
import re
import subprocess
from datetime import datetime
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
    for path in export.glob("*.json"):
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
    statuses_by_rid = {}
    for line in log.read_text(errors="replace").splitlines():
        match = re.search(r"\[HTTP Resp Meta\].*?\] POST (\S+) status: (\d+)", line)
        if match:
            query = parse_qs(urlsplit(match.group(1)).query)
            rid = query.get("RID", [""])[0]
            if query.get("AID") == ["-1"] and rid.isdigit():
                statuses_by_rid.setdefault(int(rid), set()).add(match.group(2))
    if not statuses_by_rid:
        return "unknown"
    return ", ".join(sorted(statuses_by_rid[min(statuses_by_rid)]))


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
    parser.add_argument("pairs", nargs="?", type=int, default=10)
    parser.add_argument("network_switches", nargs="?")
    parser.add_argument("--handshake-threshold-ms", type=float)
    args = parser.parse_args()
    root = args.output_dir
    pair_count = args.pairs
    trials = {}
    for scenario in ("omnient", "viewfinder"):
        for pair in range(1, pair_count + 1):
            for setting in ("off", "on"):
                trials[scenario, pair, setting] = load_trial(root, scenario, pair, setting)

    first = next((row for row in trials.values() if row), {})
    binary_encoding = first.get("enableBinaryEncoding", False)
    if any(row is not None and row.get("enableBinaryEncoding", False) != binary_encoding
           for row in trials.values()):
        raise ValueError("Run contains mixed binary-encoding settings")
    logs = [trial_log(root, *key) for key in trials]
    logs = [path for path in logs if path.exists()]
    if logs:
        start = datetime.fromtimestamp(min(path.stat().st_ctime for path in logs))
        end = datetime.fromtimestamp(max(path.stat().st_mtime for path in logs))
        detected_period = f"{start:%Y-%m-%d %H:%M}–{end:%H:%M} local time, from artifact timestamps"
    else:
        detected_period = "unavailable"
        start = datetime.now()
    metadata_path = root / "run-metadata.json"
    metadata = json.loads(metadata_path.read_text()) if metadata_path.exists() else {}
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
    required = [key for _, key in metrics]
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
        f"| Test execution | {pair_count} alternating OFF/ON pairs per scenario; a separate `xcodebuild test-without-building` invocation for each trial |",
        f"| Test result | {'All trials completed and passed fresh-transport verification' if succeeded == cold == 4 * pair_count else f'{succeeded} completed trials; {cold} passed fresh-transport verification'} |",
        "| Transport requirement | First transport: `h2`, a new TCP/TLS connection on the handshake GET/POST or early POST; if the GET reused the early POST connection, matching address and local port |",
        "",
        "## Procedure and parameters",
        "",
        "1. Build the XCTest bundle once, then launch exactly one cold-trial test method per `xcodebuild test-without-building` invocation. Keep parallel testing disabled and retain each `.xcresult` bundle.",
        "2. Run Omnient first, then Camera Viewfinder. Each pair runs `fastHandshake2=false` (OFF), then `fastHandshake2=true` (ON). The XCTest creates a new `WebChannelService` and WebChannel client per trial.",
        f"3. Use `imageSizeKb=150`, `detectionDelayMs=50`, `enableBinaryEncoding={'true' if binary_encoding else 'false'}`, `sendRawJson=true`, `fastHandshake=false`, `nonBlockingSend=false`, `blockingHandshake=false`, `forceLongPolling=false`, and `detectBufferingProxy=false`. The 150 KB value is metadata; no 150 KB image is uploaded.",
        "4. Omnient sends M1 Sticky Cluster Info and M3 Prefetch during connection establishment. Camera Viewfinder sends M1 at connection start, schedules M2 Heartbeat at +200 ms, and schedules M3 Prefetch at +500 ms. M4 Final Capture follows preliminary detections. Each trial has a 60-second completion deadline.",
        "5. Record Handshake (`webChannelOpened` minus connect), TTFA (M3 send to stream ACK), TTFD (M3 send to preliminary detections), and M4 RTT (M4 send to interaction response).",
        f"6. Include a pair in the raw measurement tables only if both runs completed, both trials meet the transport requirement, and the absolute ON/OFF handshake-duration difference is ≤{threshold_ms:g} ms. Calculate that difference from full-precision values. Keep every trial in the raw attachments and audit.",
        "",
    ]

    for scenario, heading in (("omnient", "Omnient"), ("viewfinder", "Camera Viewfinder")):
        selected = []
        for pair in range(1, pair_count + 1):
            off = trials[scenario, pair, "off"]
            on = trials[scenario, pair, "on"]
            reasons = []
            for setting, row in (("OFF", off), ("ON", on)):
                if row is None:
                    reasons.append(f"{setting} attachment missing")
                elif row.get("status") != "completed" or any(row.get(key) is None for key in required):
                    reasons.append(f"{setting} incomplete")
                elif not row.get("coldConnection"):
                    reasons.append(f"{setting} handshake connection unverified")
            if not reasons and abs(on["handshakeMs"] - off["handshakeMs"]) > threshold_ms:
                reasons.append(f"handshake difference >{threshold_ms:g} ms")
            if not reasons:
                selected.extend(((pair, "OFF", off), (pair, "ON", on)))

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
        "| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Fresh TCP (ms) | Fresh TLS (ms) | Remote address |",
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
        "| Scenario | Pair | Setting | Handshake payload | M1 first request | M3 first request |",
        "|---|---:|:---:|:---:|---|---|",
    ])
    for (scenario, pair, setting), row in trials.items():
        payload, m1, m3 = message_dispatch(root, scenario, pair, setting, handshake_transport(row))
        audit_lines.append(f"| {scenario} | {pair} | {setting.upper()} | {payload} | {m1} | {m3} |")
    viewfinder_open_before_prefetch = all(
        row is not None and row.get("handshakeMs", float("inf")) < 500
        for (scenario, _, _), row in trials.items() if scenario == "viewfinder"
    )
    viewfinder_timing = ("after the channel opened in every completed Viewfinder trial"
                         if viewfinder_open_before_prefetch else "near the channel opening")
    retries = {}
    for scenario in ("omnient", "viewfinder"):
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
        f"Omnient sends M3 during connection establishment; Viewfinder schedules M3 about 500 ms later, {viewfinder_timing}. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.",
        "",
        f"The initial early POST returned HTTP 400 in {sum(status == '400' for status in early_post_statuses.values())}/{2 * pair_count} ON trials. "
        f"Of those trials, {sum(status == '400' and trials[key] is not None and trials[key].get('status') == 'completed' for key, status in early_post_statuses.items())} completed; inspect the logs to distinguish successful retries from incomplete runs.",
        "",
        f"The Xcode logs contain retry diagnostics in ON trials for Omnient pairs {', '.join(map(str, retries['omnient'])) or 'none'} and Viewfinder pairs {', '.join(map(str, retries['viewfinder'])) or 'none'}. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.",
        "",
    ])
    if failed_trials:
        audit_lines.extend([f"Incomplete trials: {'; '.join(failed_trials)}.", ""])
    (root / "report.md").write_text("\n".join(lines))
    (root / "audit.md").write_text("\n".join(audit_lines) + "\n")
    artifact_lines = [
        f"# Lens benchmark artifacts — {metadata['runDate']} physical-device cold-connection run",
        "",
        "[Report](report.md) · [Transport audit](audit.md) · [Run metadata](run-metadata.json)",
        "",
        "Each trial has an Xcode log and exported attachments. Current runs keep logs in `logs/`, result bundles in `xcresults/`, and exported attachments in `attachments/`; older runs may keep these at the run root. The exported JSON and CSV preserve every attempted trial, including pairs omitted from the report tables. CSV values retain their recorded precision.",
        "",
        "| Scenario | Run # | Setting | Raw CSV | Raw JSON | Xcode log | Export log | Result bundle | Export manifest |",
        "|---|---:|:---:|---|---|---|---|---|---|",
    ]
    def artifact_link(path, label):
        return f"[{label}]({path.relative_to(root).as_posix()})" if path.exists() else "—"

    for scenario in ("omnient", "viewfinder"):
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
    artifact_lines.extend(["", "JSON includes app logs and task-level `URLSessionTaskMetrics`. Xcode logs include HTTP response metadata used to classify early POST status. Manifests map exported attachments to XCTest tests.", ""])
    (root / "artifacts.md").write_text("\n".join(artifact_lines))


if __name__ == "__main__":
    main()
