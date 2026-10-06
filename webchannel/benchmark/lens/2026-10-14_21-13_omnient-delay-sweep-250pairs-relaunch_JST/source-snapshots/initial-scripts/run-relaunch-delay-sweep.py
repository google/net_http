#!/usr/bin/env python3
"""Run alternating OFF/ON cold Lens trials with a fresh app per Xcode repetition."""
import argparse
import datetime
import importlib.util
import json
import os
import re
import signal
import subprocess
import sys
import time
import uuid
from pathlib import Path
from zoneinfo import ZoneInfo


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    root = args.output.resolve()
    if (root / "interruption.json").exists():
        parser.error("Refusing to resume a user-interrupted experiment")
    settings = json.loads((root / "execution-settings.json").read_text())
    scripts = Path(__file__).resolve().parent
    spec = importlib.util.spec_from_file_location("batch_import", scripts / "import-relaunch-batch.py")
    importer = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(importer)
    child = None
    def cancel(signum, _frame):
        if child is not None and child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            child.wait()
        raise SystemExit(128 + signum)
    signal.signal(signal.SIGINT, cancel)
    signal.signal(signal.SIGTERM, cancel)
    def timed(event, delay=None):
        command = ["python3", "-B", str(scripts / "record-sweep-timing.py"), str(root), event]
        if delay is not None:
            command.append(str(delay))
        subprocess.run(command, check=True)
    timed("start")
    for delay in settings["delaysMs"]:
        phase = root / f"delay-{delay}ms"
        for category in ("logs", "xcresults", "attachments"):
            (phase / category).mkdir(parents=True, exist_ok=True)
        map_path = phase / "batch-trial-map.json"
        mapping = json.loads(map_path.read_text()) if map_path.exists() else {}
        if len(mapping) == 2 * settings["pairsPerDelay"]:
            print(f"Keeping recorded delay {delay} ms", flush=True)
            continue
        if mapping:
            raise RuntimeError("Partial imports require review; recorded trials are never replaced")
        timed("delay-start", delay)
        batch_id = str(uuid.uuid4())
        total = 2 * settings["pairsPerDelay"]
        log = phase / "logs/batch-0001.log"
        bundle = phase / "xcresults/batch-0001.xcresult"
        export = phase / "attachments/batch-0001-export"
        if log.exists() or bundle.exists():
            raise RuntimeError("Preserve the previous attempt before resuming an incomplete batch")
        environment = dict(os.environ, TEST_RUNNER_LENS_BATCH_ID=batch_id,
                           TEST_RUNNER_LENS_BATCH_TRIAL_COUNT=str(total),
                           TEST_RUNNER_LENS_BATCH_START_ORDINAL="1",
                           TEST_RUNNER_LENS_INITIAL_MESSAGE_DELAY_MS=str(delay))
        environment.pop("TEST_RUNNER_LENS_BATCH_PROBE_FAIL_ORDINAL", None)
        command = ["xcodebuild", "test-without-building", "-workspace", settings["workspace"],
                   "-scheme", "WebChanneliOSDemo", "-configuration", "Debug", "-destination", f"id={settings['deviceID']}",
                   "-derivedDataPath", settings["derivedData"], "-parallel-testing-enabled", "NO",
                   "-only-testing:WebChanneliOSDemoTests/LensBenchmarkTests/testColdBinaryOmnientBatch",
                   "-test-iterations", str(total), "-test-repetition-relaunch-enabled", "YES",
                   "-resultBundlePath", str(bundle)]
        started = time.time()
        (phase / "batch-settings.json").write_text(json.dumps({"batchId": batch_id, "command": command,
            "delayMs": delay, "trialCount": total, "startedEpochSeconds": started}, indent=2) + "\n")
        print(f"Starting {delay} ms: {settings['pairsPerDelay']} OFF/ON pairs, batch {batch_id}", flush=True)
        with log.open("w") as stream:
            child = subprocess.Popen(command, stdout=stream, stderr=subprocess.STDOUT, env=environment, start_new_session=True)
            deadline = time.monotonic() + total * 80 + 180
            while child.poll() is None:
                if time.monotonic() > deadline:
                    os.killpg(child.pid, signal.SIGTERM)
                    child.wait(timeout=15)
                    raise RuntimeError("Batch deadline exceeded; attempted trials are retained")
                time.sleep(1)
                text = log.read_text(errors="replace")
                entered = len(re.findall(r"LENS_BATCH_TRIAL_STARTED \{", text))
                recorded = len(re.findall(r"LENS_BENCHMARK_RESULT ", text))
                (root / "progress.json").write_text(json.dumps({"status": "running", "delayMs": delay,
                    "enteredTrials": entered, "recordedMarkers": recorded, "requestedTrials": total}, indent=2) + "\n")
            exit_code = child.wait()
            child = None
        with (phase / "logs/batch-0001-export.log").open("w") as stream:
            subprocess.run(["xcrun", "xcresulttool", "export", "attachments", "--path", str(bundle),
                            "--output-path", str(export)], stdout=stream, stderr=subprocess.STDOUT, check=True)
        mapping, rows = importer.import_batch(phase, batch_id, 1, total, delay, log, export, bundle)
        map_path.write_text(json.dumps(mapping, indent=2) + "\n")
        if exit_code not in (0, 65) or (exit_code == 65 and all(r["status"] == "completed" and r["coldConnection"] is True for r in rows)):
            raise RuntimeError("Xcode failure is not explained by retained measurement failures")
        finished = time.time()
        local_start = datetime.datetime.fromtimestamp(started, ZoneInfo("Asia/Tokyo"))
        local_end = datetime.datetime.fromtimestamp(finished, ZoneInfo("Asia/Tokyo"))
        (phase / "run-metadata.json").write_text(json.dumps({"executionProtocol": "xcode-relaunch-batch",
            "testPeriod": f"{local_start:%Y-%m-%d %H:%M}–{local_end:%H:%M} JST, from runner timestamps",
            "pairCount": settings["pairsPerDelay"], "includeEarlyPost400": True}, indent=2) + "\n")
        (phase / "batch-outcome.json").write_text(json.dumps({"exitCode": exit_code, "recordedTrials": len(rows),
            "completedTrials": sum(r["status"] == "completed" for r in rows), "finishedEpochSeconds": finished}, indent=2) + "\n")
        timed("delay-end", delay)
        print(f"Recorded {delay} ms: {len(rows)} trials; {sum(r['status']=='completed' for r in rows)} completed", flush=True)
    timed("end")
    subprocess.run([settings["reportPython"], "-B", str(scripts / "finalize-delay-sweep.py"), str(root)], check=True)
    (root / "progress.json").write_text(json.dumps({"status": "complete", "recordedPairs": settings["pairsPerDelay"] * len(settings["delaysMs"])}, indent=2) + "\n")


if __name__ == "__main__":
    try:
        main()
    except (Exception, KeyboardInterrupt, SystemExit) as error:
        if len(sys.argv) > 1:
            root = Path(sys.argv[1])
            if (root / "execution-settings.json").exists():
                (root / "progress.json").write_text(json.dumps({"status": "interrupted" if isinstance(error, (KeyboardInterrupt, SystemExit)) else "needs-attention", "error": str(error)}, indent=2) + "\n")
        raise
