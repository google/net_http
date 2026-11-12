#!/usr/bin/env python3
"""Analyze recorded events without changing the device or fault state."""
import argparse
import csv
from datetime import datetime
import json
from pathlib import Path


def read_jsonl(path):
    if not path.exists():
        return []
    records = []
    for line in path.read_text().splitlines():
        try:
            records.append(json.loads(line))
        except ValueError:
            pass
    return records


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    args = parser.parse_args()
    root = args.directory
    results = json.loads((root / "results.json").read_text())
    summary = []
    metrics = []
    for result in results:
        label = result.get("folder", f"{result['case']}-r{result['run']}")
        folder = root / label
        app = read_jsonl(folder / "device-events.jsonl")
        condition = read_jsonl(folder / "condition.jsonl")
        if not condition or not app:
            continue
        enabled = next((r for r in condition if r.get("event") == "enable_ack"), None)
        release = next((r for r in condition if r.get("event") == "disable_request"), None)
        if not enabled or not release:
            continue
        opens = [r for r in app if r.get("kind") == "open"]
        errors = [r for r in app if r.get("kind") == "error"]
        # Compare device-local uptime stamps for the watchdog interval, not wall clocks.
        timeouts = []
        last_body = None
        first_timeout = None
        for record in app:
            if record.get("kind") == "http_log" and "[HTTP Resp Body] (rpc)" in record.get("text", ""):
                last_body = record
            if record.get("kind") == "sdk_info" and "TIMEOUT:" in record.get("text", ""):
                if first_timeout is None:
                    first_timeout = record
                if "RID=rpc" in record["text"] and last_body:
                    timeouts.append(round(record["deviceUptimeSeconds"] - last_body["deviceUptimeSeconds"], 6))
            if record.get("kind") == "task_metrics":
                for transaction in record.get("transactions", []):
                    metrics.append({"trial": label, **transaction})
        error_codes = sorted({r["code"] for r in errors})
        receive = result.get("receiveAfterRelease", False)
        case = result["case"]
        if case == "T1":
            matches = not error_codes and result.get("timeouts") == 0 and len(opens) == 1 and receive
        elif case in ("T2", "T6-short"):
            matches = not error_codes and result.get("timeouts", 0) > 0 and len(opens) == 1 and receive
        elif case == "T3":
            matches = result.get("timeouts", 0) > 0 and (error_codes == [4] or (not error_codes and receive))
        elif case in ("T4", "T6-long"):
            matches = error_codes == [4]
        elif case in ("T5", "T6-exhaust", "M5-periodic", "T7", "T16", "T8"):
            matches = error_codes == [1] and (case != "T8" or not opens)
        else:
            matches = None
        def wall(value):
            return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
        # C CLOCK_MONOTONIC and Python monotonic have different epochs on this Mac.
        # Cross-process events therefore use recorded Mac UTC, with clock-correction limits.
        activity = [r for r in app if r.get("kind") == "lifecycle"
                    and r.get("notification") in ("UIApplicationDidEnterBackgroundNotification", "UIApplicationWillResignActiveNotification")
                    and wall(enabled["mac_utc"]) <= wall(r["hostReceivedUTC"]) <= wall(release["mac_utc"])]
        row = {
            "trial": label, "holdSeconds": result.get("holdSeconds"), "openCount": len(opens),
            "errorCodes": json.dumps(error_codes), "receiveAfterRelease": receive,
            "firstWatchdogAfterLastChunkDeviceSeconds": timeouts[0] if timeouts else "",
            "firstTimeoutAfterEnableAckMacWallSeconds": round(wall(first_timeout["hostReceivedUTC"]) - wall(enabled["mac_utc"]), 6) if first_timeout else "",
            "firstErrorAfterEnableAckMacWallSeconds": round(wall(errors[0]["hostReceivedUTC"]) - wall(enabled["mac_utc"]), 6) if errors else "",
            "firstErrorAfterReleaseMacWallSeconds": round(wall(errors[0]["hostReceivedUTC"]) - wall(release["mac_utc"]), 6) if errors else "",
            "backgroundTransitionsDuringFault": len(activity),
            "coarseOutcomeMatchesSpec": matches,
        }
        abort_seconds = row["firstErrorAfterEnableAckMacWallSeconds"]
        expected_abort = (165, 225) if case in ("T5", "T6-exhaust", "M5-periodic") else None
        row["abortTimingMatchesExpectedRange"] = (expected_abort[0] <= abort_seconds <= expected_abort[1]) if expected_abort and abort_seconds != "" else ""
        wire_ids = []
        stream_frames = 0
        delivered_stream = 0
        for record in app:
            text = record.get("text", "")
            if record.get("kind") == "app_log" and "didReceiveMessage" in text and "network-failure stream" in text:
                delivered_stream += 1
            if record.get("kind") != "http_log" or "[HTTP Resp Body] (rpc): " not in text:
                continue
            try:
                arrays = json.loads(text.split("[HTTP Resp Body] (rpc): ", 1)[1])
            except ValueError:
                continue
            for item in arrays:
                if isinstance(item, list) and len(item) == 2 and isinstance(item[0], int):
                    wire_ids.append(item[0])
                    if isinstance(item[1], dict) and item[1].get("message") == "network-failure stream":
                        stream_frames += 1
        unique_ids = sorted(set(wire_ids))
        gaps = sorted(set(range(unique_ids[0], unique_ids[-1]+1)) - set(unique_ids)) if unique_ids else []
        row["wireArrayIdGaps"] = json.dumps(gaps)
        row["duplicateWireArrayIds"] = len(wire_ids) - len(unique_ids)
        row["streamFrames"] = stream_frames
        row["deliveredStreamMessages"] = delivered_stream
        heartbeats = [r for r in app if r.get("kind") == "heartbeat"]
        row["heartbeatCount"] = len(heartbeats)
        row["heartbeatApplicationStates"] = json.dumps(sorted({r["applicationState"] for r in heartbeats}))
        unavailable = [r for r in app if r.get("kind") == "path" and r.get("status") == "unsatisfied"
                       and wall(enabled["mac_utc"]) <= wall(r["hostReceivedUTC"]) <= wall(release["mac_utc"])]
        row["unavailablePathUpdatesDuringFault"] = len(unavailable)
        row["firstUnavailablePathAfterEnableAckMacWallSeconds"] = round(wall(unavailable[0]["hostReceivedUTC"]) - wall(enabled["mac_utc"]), 6) if unavailable else ""
        close_info = [r.get("text", "") for r in app if r.get("kind") == "sdk_info" and "with pending data:" in r.get("text", "")]
        row["nonAckedObjectsInCloseLog"] = close_info[0].count("<WCQueuedMap:") if close_info else ""
        send_controls = [r for r in app if r.get("kind") == "control" and r.get("action", "").endswith(".send")]
        send_error_delta = errors[0]["deviceUptimeSeconds"] - send_controls[0]["deviceUptimeSeconds"] if errors and send_controls else None
        row["firstErrorAfterSendDeviceSeconds"] = round(send_error_delta, 6) if send_error_delta is not None else ""
        send_abort_range = (35, 75) if case == "T7" else (10, 20) if case == "T16" else None
        row["sendAbortTimingMatchesExpectedRange"] = (send_abort_range[0] <= send_error_delta <= send_abort_range[1]) if send_abort_range and send_error_delta is not None else ""
        row["postSendCount"] = sum(r.get("kind") == "app_log" and ">>> Sending echo latency request" in r.get("text", "") for r in app)
        handshake_posts = [r for r in app if r.get("kind") == "http_log" and "[HTTP Req]" in r.get("text", "") and "] POST " in r.get("text", "") and "&SID=" not in r.get("text", "")]
        row["handshakePOSTCount"] = len(handshake_posts)
        row["firstErrorAfterHandshakePOSTDeviceSeconds"] = round(errors[0]["deviceUptimeSeconds"] - handshake_posts[0]["deviceUptimeSeconds"], 6) if errors and handshake_posts else ""
        send_events = [r for r in app if r.get("kind") == "app_log" and ">>> Sending echo latency request" in r.get("text", "")]
        intervals = [b["deviceUptimeSeconds"] - a["deviceUptimeSeconds"] for a, b in zip(send_events, send_events[1:])]
        row["minimumSendIntervalDeviceSeconds"] = round(min(intervals), 6) if intervals else ""
        row["maximumSendIntervalDeviceSeconds"] = round(max(intervals), 6) if intervals else ""
        row["forwardRetryLogCount"] = sum(r.get("kind") == "sdk_debug" and r.get("text") == "Going to retry POST." for r in app)
        summary.append(row)
    (root / "analysis.json").write_text(json.dumps(summary, indent=2))
    (root / "transport-metrics.json").write_text(json.dumps(metrics, indent=2))
    if summary:
        with (root / "analysis.csv").open("w", newline="") as stream:
            writer = csv.DictWriter(stream, fieldnames=list(summary[0]))
            writer.writeheader()
            writer.writerows(summary)
    protocols = sorted({t.get("protocol", "unknown") for t in metrics})
    report = ["# Analysis of automatic trials", "", f"Completed trials analyzed: {len(summary)}", "",
              f"Observed protocols in completed task metrics: {', '.join(protocols) or 'none yet'}", "",
              "| Trial | Hold (s) | First watchdog since last chunk, device clock (s) | Error | Coarse expected outcome |",
              "| --- | --- | --- | --- | --- |"]
    for row in summary:
        report.append(f"| {row['trial']} | {row['holdSeconds']} | {row['firstWatchdogAfterLastChunkDeviceSeconds']} | "
                      f"{row['errorCodes']} | {row['coarseOutcomeMatchesSpec']} |")
    report += ["", "Outcome matching above checks error/recovery categories only, not every timing or delivery requirement.",
               "Hold durations use the helper monotonic clock; watchdog deltas use device uptime. Cross-process timing uses Mac wall timestamps, which can be affected by clock corrections. Native acknowledgements are not packet timestamps.",
               "Application-message continuity, retry timing ranges, and non-acked counts need case-specific review in the raw logs.", ""]
    deviations = [r for r in summary if r["abortTimingMatchesExpectedRange"] is False]
    if deviations:
        report += ["## Abort timing deviations", "", "The spec estimates 165–225 s for a prolonged back-channel blackhole. Observed earlier/later aborts:", ""]
        for r in deviations:
            report.append(f"- {r['trial']}: error {r['errorCodes']} after approximately {r['firstErrorAfterEnableAckMacWallSeconds']} s from enable acknowledgement (Mac wall timestamps).")
        report += ["", "Inspect HTTP status-0 failures: a platform failure can end a request before the 45 s watchdog. This is a hypothesis for the shorter total, not an underlying NSError diagnosis.", ""]
    handshake_trials = [r for r in summary if r["trial"].startswith("T8-")]
    if handshake_trials:
        report += ["## Handshake blackhole", "", "| Trial | Handshake POST count | Open events | Error after POST start, device clock (s) |", "| --- | --- | --- | --- |"]
        for r in handshake_trials:
            report.append(f"| {r['trial']} | {r['handshakePOSTCount']} | {r['openCount']} | {r['firstErrorAfterHandshakePOSTDeviceSeconds']} |")
        report += ["", "A single handshake POST with no open event confirms no automatic handshake retry in that trial.", ""]
    send_trials = [r for r in summary if r["firstErrorAfterSendDeviceSeconds"] != ""]
    if send_trials:
        report += ["## Pending writes and periodic sends", "", "| Trial | Send invocations | Error after first send, device clock (s) | Non-acked objects in close log | Expected abort timing |", "| --- | --- | --- | --- | --- |"]
        for r in send_trials:
            report.append(f"| {r['trial']} | {r['postSendCount']} | {r['firstErrorAfterSendDeviceSeconds']} | {r['nonAckedObjectsInCloseLog']} | {r['sendAbortTimingMatchesExpectedRange']} |")
        report += ["", "Non-acked object counts are parsed from WCQueuedMap descriptions in SDK close logs; the raw descriptions are retained. Send invocations include only accepted app sends, not rejected attempts after closure.", ""]
    affected = [r for r in summary if r["unavailablePathUpdatesDuringFault"]]
    if affected:
        report += ["## Path changes during loss", "", "NWPathMonitor reported an unavailable path during these loss intervals:", ""]
        for r in affected:
            report.append(f"- {r['trial']}: first unsatisfied path about {r['firstUnavailablePathAfterEnableAckMacWallSeconds']} s after enable acknowledgement.")
        report += ["", "This does not identify a physical interface switch, but it limits interpretation as a purely silent blackhole with an always-usable path. Status-0 request failures and the OS cellular-data-off dialog are recorded separately; underlying NSError is unavailable.", ""]
    (root / "analysis.md").write_text("\n".join(report))
    print(json.dumps({"analyzed": len(summary), "metricTransactions": len(metrics), "protocols": protocols}))


if __name__ == "__main__":
    main()
