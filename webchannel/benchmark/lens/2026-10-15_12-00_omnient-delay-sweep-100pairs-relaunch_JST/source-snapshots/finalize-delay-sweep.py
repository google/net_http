#!/usr/bin/env python3
"""Generate and independently verify a fully recorded sweep, then check reproducibility."""

import bisect
import hashlib
import json
import math
import os
import re
import subprocess
import sys
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    root = Path(sys.argv[1]).resolve()
    settings = json.loads((root / "execution-settings.json").read_text())
    delays, pairs = settings["delaysMs"], settings["pairsPerDelay"]
    threshold = settings["handshakeThresholdMs"]
    raw = {p: digest(p) for d in delays for category in ("logs", "attachments")
           for p in (root / f"delay-{d}ms" / category).rglob("*") if p.is_file()}
    scripts = Path(__file__).parent
    for name, expected in settings["scriptsSHA256"].items():
        assert digest(scripts / name) == expected, name
    for path, expected in settings.get("sourcesSHA256", {}).items():
        assert digest(Path(path)) == expected, path
    environment = dict(os.environ, MPLCONFIGDIR="/tmp/net-http-lens-matplotlib")
    command = [sys.executable, "-B", str(scripts / "summarize-delay-sweep.py"), str(root),
               "--pairs", str(pairs), "--delays-ms", *map(str, delays),
               "--handshake-threshold-ms", str(threshold), "--early-post-400-policy", "include"]
    subprocess.run(command, env=environment, check=True)
    assert not (root / "including-early-post-400").exists()
    edges_by_metric = {}
    completed = fresh = 0
    counts = {}
    process_instances = set()
    for delay in delays:
        run = root / f"delay-{delay}ms"
        data = json.loads((run / "histograms/histogram-data.json").read_text())
        assert data["pairCount"] == pairs and len(data["pairs"]) == pairs
        assert data["includeEarlyPost400"] is True
        for record in data["pairs"]:
            rows = []
            for setting in ("off", "on"):
                folder = run / "attachments" / f"omnient-{record['pair']}-{setting}-attachments"
                files = [p for p in folder.glob("*.json") if p.name != "manifest.json"]
                assert len(files) == 1
                row = json.loads(files[0].read_text())[0]
                rows.append(row)
                assert row["scenario"] == "omnient" and row["initialMessageDelayMs"] == delay
                assert row["enableBinaryEncoding"] is True and row["fastHandshake2"] == (setting == "on")
                if settings.get("executionProtocol") == "xcode-relaunch-batch":
                    ordinal = 2 * record["pair"] - (1 if setting == "off" else 0)
                    assert row["batchTrialOrdinal"] == ordinal and row["batchPair"] == record["pair"]
                    assert row["batchSetting"] == setting and row["processInstanceId"] not in process_instances
                    process_instances.add(row["processInstanceId"])
                completed += row.get("status") == "completed"
                fresh += row.get("coldConnection") is True
                if row.get("coldConnection") is True:
                    handshake = min((r for r in row["transportMetrics"]
                                     if r.get("method") == ("GET" if setting == "on" else "POST")
                                     and str(r.get("rid", "")).isdigit()), key=lambda r: int(r["rid"]))
                    assert handshake["protocol"] == "h2"
                    source = handshake
                    if row["coldConnectionSource"] == "earlyPOST":
                        assert setting == "on" and handshake["reusedConnection"] is True
                        source = next(r for r in row["transportMetrics"] if r.get("method") == "POST"
                                      and str(r.get("rid")) == str(int(handshake["rid"]) + 1))
                        assert source["remoteAddress"] == handshake["remoteAddress"]
                        assert source["localPort"] == handshake["localPort"]
                    else:
                        assert row["coldConnectionSource"] == "handshake"
                    assert source["protocol"] == "h2" and source["reusedConnection"] is False
                    assert source["tcpConnectMs"] is not None and source["tlsMs"] is not None
            off, on = rows
            required = ("handshakeMs", "ttfaMs", "ttfdMs", "m4RttMs")
            ordinary = all(row.get("status") == "completed" and row.get("coldConnection") is True
                           and all(isinstance(row.get(k), (int, float)) and math.isfinite(row[k])
                                   for k in required) for row in rows)
            expected = (ordinary and abs(on["handshakeMs"] - off["handshakeMs"]) <= threshold
                        and record["earlyPostHTTP"] != "unknown")
            assert record["accepted"] == expected
            assert "ON initial early POST HTTP 400" not in record["exclusionReasons"]
            for key, metric in (("ttfaDifferenceMs", "ttfaMs"), ("ttfdDifferenceMs", "ttfdMs")):
                difference = on[metric] - off[metric] if on.get(metric) is not None and off.get(metric) is not None else None
                assert record[key] == difference
        selected = [r for r in data["pairs"] if r["accepted"]]
        assert len(selected) == data["acceptedPairs"]
        is400 = lambda r: "400" in r["earlyPostHTTP"].split(", ")
        assert sum(map(is400, selected)) == data["includedEarlyPost400Pairs"]
        assert sum(map(is400, data["pairs"])) == data["earlyPost400Pairs"]
        assert data["earlyPost400Rate"] == data["earlyPost400Pairs"] / pairs
        for metric, key in (("TTFA", "ttfaDifferenceMs"), ("TTFD", "ttfdDifferenceMs")):
            histogram = data["histograms"][metric]
            edges = histogram["binEdgesMs"]
            assert all(b - a == 10 for a, b in zip(edges, edges[1:]))
            if metric in edges_by_metric:
                assert edges_by_metric[metric] == edges
            edges_by_metric[metric] = edges
            bins = [0] * (len(edges) - 1)
            for record in selected:
                index = bisect.bisect_right(edges, record[key]) - 1
                assert 0 <= index < len(bins)
                bins[index] += 1
            assert bins == histogram["pairCounts"] and sum(bins) == len(selected)
        for item in json.loads((run / "histograms/input-manifest.json").read_text()):
            assert digest(run / item["path"]) == item["sha256"]
        if settings.get("executionProtocol") == "xcode-relaunch-batch":
            mapping = json.loads((run / "batch-trial-map.json").read_text())
            previous_pid = None
            for ordinal in range(1, 2 * pairs + 1):
                setting = "on" if ordinal % 2 == 0 else "off"
                stem = f"omnient-{(ordinal + 1) // 2}-{setting}"
                item = mapping[stem]
                assert item["ordinal"] == ordinal
                original_manifest = json.loads((run / item["originalJSON"]).parent.joinpath("manifest.json").read_text())
                matching = [a for entry in original_manifest for a in entry["attachments"]
                            if a["exportedFileName"] in (Path(item["originalJSON"]).name, Path(item["originalCSV"]).name)]
                assert len(matching) == 2 and all(a.get("repetitionNumber", 1) == item["repetitionNumber"] for a in matching)
                assert item["processId"] != previous_pid
                previous_pid = item["processId"]
                source_json, source_csv = run / item["originalJSON"], run / item["originalCSV"]
                assert digest(source_json) == item["jsonSHA256"] and digest(source_csv) == item["csvSHA256"]
                export = run / "attachments" / f"{stem}-attachments"
                assert digest(export / source_json.name) == item["jsonSHA256"]
                assert digest(export / source_csv.name) == item["csvSHA256"]
                start, end = item["stdoutByteRange"]
                chunk = (run / item["batchLog"]).read_bytes()[start:end]
                assert (run / "logs" / f"{stem}.log").read_bytes() == chunk
                assert hashlib.sha256(chunk).hexdigest() == item["trialLogSHA256"]
        counts[str(delay)] = {k: data[k] for k in ("acceptedPairs", "earlyPost400Pairs", "includedEarlyPost400Pairs")}
        print(f"{delay} ms: {pairs} pairs, histogram {len(selected)}, HTTP 400 {data['earlyPost400Pairs']}", flush=True)
    for path in root.rglob("*.md"):
        for link in re.findall(r"!?\[[^\]]*\]\(([^)]+)\)", path.read_text()):
            if "://" not in link and not link.startswith("#"):
                assert (path.parent / link.split("#")[0]).exists(), (path, link)
    generated = {p: digest(p) for p in root.rglob("*") if p.is_file()
                 and (p.name in ("report.md", "connection-reuse-audit.md", "artifacts.md", "run-metadata.json")
                      or "histograms" in p.parts)}
    subprocess.run([sys.executable, "-B", str(scripts / "summarize-delay-sweep.py"), str(root)],
                   env=environment, check=True)
    assert all(digest(p) == value for p, value in raw.items()), "Raw evidence changed"
    assert all(digest(p) == value for p, value in generated.items()), "Regeneration changed artifacts"
    completion = {"status": "complete", "recordedPairs": len(delays) * pairs,
                  "completedTrials": completed, "freshTrials": fresh, "countsByDelay": counts,
                  "verification": "Signed differences, inclusion, transport evidence, bins, source hashes, links, raw preservation, and deterministic regeneration passed"}
    (root / "completion.json").write_text(json.dumps(completion, indent=2) + "\n")
    print(json.dumps(completion), flush=True)


if __name__ == "__main__":
    main()
