#!/usr/bin/env python3
"""Run alternating OFF/ON cold Lens trials with a fresh app per Xcode repetition."""
import argparse
import hashlib
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
            review = json.loads((phase / "resume-review.json").read_text())
            if (review["recordedTrialCount"] != len(mapping)
                    or review["mappingSHA256"] != hashlib.sha256(map_path.read_bytes()).hexdigest()
                    or sorted(item["ordinal"] for item in mapping.values()) != list(range(1, len(mapping) + 1))):
                raise RuntimeError("Partial imports require a matching explicit review; recorded trials are never replaced")
        timed("delay-start", delay)
        batch_id = str(uuid.uuid4())
        total = 2 * settings["pairsPerDelay"]
        start_ordinal = len(mapping) + 1
        iterations = total - len(mapping)
        batch_number = len(list((phase / "xcresults").glob("batch-*.xcresult"))) + 1
        batch_name = f"batch-{batch_number:04d}"
        log = phase / f"logs/{batch_name}.log"
        bundle = phase / f"xcresults/{batch_name}.xcresult"
        export = phase / f"attachments/{batch_name}-export"
        if log.exists() or bundle.exists():
            raise RuntimeError("Preserve the previous attempt before resuming an incomplete batch")
        environment = dict(os.environ, TEST_RUNNER_LENS_BATCH_ID=batch_id,
                           TEST_RUNNER_LENS_BATCH_TRIAL_COUNT=str(total),
                           TEST_RUNNER_LENS_BATCH_START_ORDINAL=str(start_ordinal),
                           TEST_RUNNER_LENS_INITIAL_MESSAGE_DELAY_MS=str(delay))
        environment.pop("TEST_RUNNER_LENS_BATCH_PROBE_FAIL_ORDINAL", None)
        command = ["xcodebuild", "test-without-building", "-workspace", settings["workspace"],
                   "-scheme", "WebChanneliOSDemo", "-configuration", "Debug", "-destination", f"id={settings['deviceID']}",
                   "-derivedDataPath", settings["derivedData"], "-parallel-testing-enabled", "NO",
                   "-only-testing:WebChanneliOSDemoTests/LensBenchmarkTests/testColdBinaryOmnientBatch",
                   "-test-iterations", str(iterations), "-test-repetition-relaunch-enabled", "YES",
                   "-resultBundlePath", str(bundle)]
        if iterations == 1:
            index = command.index("-test-iterations")
            del command[index:index + 4]
        started = time.time()
        batch_settings = {"batchId": batch_id, "command": command, "delayMs": delay,
                          "trialCount": iterations, "startOrdinal": start_ordinal, "startedEpochSeconds": started}
        (phase / f"logs/{batch_name}-settings.json").write_text(json.dumps(batch_settings, indent=2) + "\n")
        previous_settings = json.loads((phase / "batch-settings.json").read_text()) if (phase / "batch-settings.json").exists() else None
        batches = previous_settings.get("batches", [previous_settings]) if previous_settings else []
        batches.append(batch_settings)
        (phase / "batch-settings.json").write_text(json.dumps({"batches": batches}, indent=2) + "\n")
        print(f"Starting {delay} ms: {settings['pairsPerDelay']} OFF/ON pairs, batch {batch_id}", flush=True)
        with log.open("w") as stream:
            child = subprocess.Popen(command, stdout=stream, stderr=subprocess.STDOUT, env=environment, start_new_session=True)
            deadline = time.monotonic() + iterations * 80 + 180
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
                    "enteredTrials": len(mapping) + entered, "recordedMarkers": len(mapping) + recorded, "requestedTrials": total}, indent=2) + "\n")
            exit_code = child.wait()
            child = None
        with (phase / f"logs/{batch_name}-export.log").open("w") as stream:
            subprocess.run(["xcrun", "xcresulttool", "export", "attachments", "--path", str(bundle),
                            "--output-path", str(export)], stdout=stream, stderr=subprocess.STDOUT, check=True)
        new_mapping, rows = importer.import_batch(phase, batch_id, start_ordinal, iterations, delay, log, export, bundle)
        mapping.update(new_mapping)
        map_path.write_text(json.dumps(mapping, indent=2) + "\n")
        if exit_code not in (0, 65) or (exit_code == 65 and all(r["status"] == "completed" and r["coldConnection"] is True for r in rows)):
            raise RuntimeError("Xcode failure is not explained by retained measurement failures")
        finished = time.time()
        local_start = datetime.datetime.fromtimestamp(batches[0]["startedEpochSeconds"], ZoneInfo("Asia/Tokyo"))
        local_end = datetime.datetime.fromtimestamp(finished, ZoneInfo("Asia/Tokyo"))
        (phase / "run-metadata.json").write_text(json.dumps({"executionProtocol": "xcode-relaunch-batch",
            "testPeriod": f"{local_start:%Y-%m-%d %H:%M}–{local_end:%H:%M} JST, from runner timestamps",
            "pairCount": settings["pairsPerDelay"], "includeEarlyPost400": True}, indent=2) + "\n")
        (phase / f"logs/{batch_name}-outcome.json").write_text(json.dumps({"exitCode": exit_code,
            "recordedTrials": len(rows), "completedTrials": sum(r["status"] == "completed" for r in rows),
            "finishedEpochSeconds": finished}, indent=2) + "\n")
        all_rows = [json.loads((phase / item["originalJSON"]).read_text())[0] for item in mapping.values()]
        (phase / "batch-outcome.json").write_text(json.dumps({"recordedTrials": len(all_rows),
            "completedTrials": sum(r["status"] == "completed" for r in all_rows),
            "batchOutcomes": [p.relative_to(phase).as_posix() for p in sorted((phase / "logs").glob("batch-*-outcome.json"))],
            "finishedEpochSeconds": finished}, indent=2) + "\n")
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
