#!/usr/bin/env python3
"""Validate Xcode test repetition with a new application process each iteration."""
import argparse
import datetime
import hashlib
import importlib.util
import json
import os
import re
import signal
import subprocess
import time
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    parser.add_argument("--device", required=True)
    parser.add_argument("--derived-data", type=Path, required=True)
    parser.add_argument("--workspace", type=Path, required=True)
    parser.add_argument("--smoke-iterations", type=int, default=20)
    parser.add_argument("--iterations", type=int, default=1000)
    args = parser.parse_args()
    if min(args.smoke_iterations, args.iterations) <= 0:
        parser.error("Iterations must be positive")
    args.workspace = args.workspace.resolve()
    args.derived_data = args.derived_data.resolve()
    helper = Path(__file__).with_name("run-startup-investigation.py")
    spec = importlib.util.spec_from_file_location("startup_probe", helper)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    job = module.Investigation(args)
    root = job.root
    settings = json.loads((root / "execution-settings.json").read_text())
    settings.update(protocol="One xcodebuild process per batch; a new test application process for every repetition",
                    controllerSHA256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                    helperSHA256=hashlib.sha256(helper.read_bytes()).hexdigest())
    (root / "execution-settings.json").write_text(json.dumps(settings, indent=2) + "\n")
    batches = []
    interrupted = False
    started = module.utc()
    status = "running"
    stream = None

    def cancel(_signum, _frame):
        nonlocal interrupted
        interrupted = True
        job.stop_child()
        raise KeyboardInterrupt
    signal.signal(signal.SIGTERM, cancel)
    signal.signal(signal.SIGINT, cancel)

    def markers(path):
        return [json.loads(m) for m in re.findall(r"DEVICE_STARTUP_PROBE_RESULT (\{[^\r\n]+\})", path.read_text())]

    def batch(label, count):
        path = root / "logs" / f"{label}.log"
        bundle = root / "xcresults" / f"{label}.xcresult"
        job.snapshot(label + "-before")
        command = ["xcodebuild", "test-without-building", "-workspace", str(args.workspace),
                   "-scheme", "WebChanneliOSDemo", "-configuration", "Debug", "-destination", f"id={args.device}",
                   "-derivedDataPath", str(args.derived_data), "-parallel-testing-enabled", "NO",
                   "-only-testing:WebChanneliOSDemoTests/DeviceStartupProbeTests/testNoNetworking",
                   "-test-iterations", str(count), "-test-repetition-relaunch-enabled", "YES",
                   "-run-tests-until-failure", "-resultBundlePath", str(bundle)]
        when, epoch = module.utc(), time.time()
        with path.open("w") as output:
            job.child = subprocess.Popen(command, stdout=output, stderr=subprocess.STDOUT, start_new_session=True)
            sample = 0
            deadline = time.monotonic() + count * 15 + 180
            while job.child.poll() is None:
                if time.monotonic() >= deadline:
                    job.stop_child()
                    raise RuntimeError("Repetition batch exceeded its bounded deadline")
                time.sleep(0.5)
                if time.time() - epoch >= sample * 10:
                    sample += 1
                    job.snapshot(f"{label}-sample-{sample:04d}")
                    records = markers(path)
                    (root / "progress.json").write_text(json.dumps({"status": "running", "phase": label,
                        "requestedIterations": count, "recordedMarkers": len(records), "updatedUTC": module.utc()}, indent=2) + "\n")
            code = job.child.wait()
            job.child = None
        after = job.snapshot(label + "-after")
        records = markers(path)
        pids = [r.get("processId") for r in records]
        passed = (code == 0 and len(records) == count and len(set(pids)) == count
                  and all(r.get("status") == "passed" and r.get("networkRequested") is False for r in records))
        text = path.read_text()
        startup_failure = (not records and "Test Case '-[" not in text and
                           ("observing system notifications failed" in text or
                            ("Device disconnected during socket operation" in text and "Incomplete read while receiving socket identifier" in text)))
        row = {"phase": label, "requestedIterations": count, "recordedMarkers": len(records),
               "distinctApplicationPIDs": len(set(pids)), "passed": passed, "knownStartupFailure": startup_failure,
               "exitCode": code, "startedUTC": when, "finishedUTC": module.utc(), "elapsedSeconds": time.time()-epoch,
               "usbAfter": after["usbIPhones"], "log": path.relative_to(root).as_posix(), "command": command}
        batches.append(row)
        (root / "attachments" / f"{label}-markers.json").write_text(json.dumps(records, indent=2) + "\n")
        (root / "batches.json").write_text(json.dumps(batches, indent=2) + "\n")
        print(f"{label}: {len(records)}/{count} markers; {len(set(pids))} distinct application PIDs; passed={passed}", flush=True)
        return row

    try:
        with (root / "logs/notification-stream.ndjson").open("w") as output:
            predicate = 'process == "CoreDeviceService" AND eventMessage CONTAINS[c] "DarwinNotification"'
            stream = subprocess.Popen(["/usr/bin/log", "stream", "--style", "ndjson", "--level", "debug", "--predicate", predicate], stdout=output, stderr=subprocess.STDOUT)
            time.sleep(1)
            if stream.poll() is not None:
                raise RuntimeError("Notification stream could not start")
            row = batch("smoke", args.smoke_iterations)
            if not row["passed"] and row["knownStartupFailure"]:
                code, _ = job.command("recovery-ddi", ["xcrun", "devicectl", "device", "info", "ddiServices", "--device", args.device, "--timeout", "15"])
                job.actions.append({"action": "ddi-reenable", "finishedUTC": module.utc(), "exitCode": code})
                if code == 0:
                    row = batch("smoke-after-ddi", args.smoke_iterations)
                if not row["passed"] and row["knownStartupFailure"]:
                    job.restart_coredevice("recovery-coredevice")
                    row = batch("smoke-after-coredevice", args.smoke_iterations)
            if not row["passed"]:
                status = "smoke-failed"
            else:
                row = batch("validation", args.iterations)
                status = "complete" if row["passed"] else "validation-failed"
    except KeyboardInterrupt:
        status = "interrupted"
    except Exception as error:
        job.stop_child()
        status = "needs-attention"
        (root / "error.json").write_text(json.dumps({"error": str(error), "capturedUTC": module.utc()}) + "\n")
        print(f"Investigation error: {error}", flush=True)
    finally:
        if stream is not None and stream.poll() is None:
            stream.terminate()
            stream.wait(timeout=10)
        snapshots = [json.loads(p.read_text()) for p in (root / "logs").glob("*-snapshot.json")]
        identities = {n["IORegistryEntryID"] for s in snapshots for n in s["usbIPhones"]}
        coverage = bool(snapshots) and all(s["usbIPhones"] and s["usbExitCode"] == 0 for s in snapshots)
        completion = {"status": status, "startedUTC": started, "finishedUTC": module.utc(),
                      "batches": batches, "recoveryActions": job.actions,
                      "usbSnapshotsCovered": coverage, "distinctUSBRegistryIDs": sorted(identities),
                      "limitation": "USB continuity is sampled, not continuous hardware tracing; demo is the host but the test requests no networking."}
        (root / "progress.json").write_text(json.dumps(completion, indent=2) + "\n")
        (root / "actions.json").write_text(json.dumps(job.actions, indent=2) + "\n")
        (root / "result.json").write_text(json.dumps(completion, indent=2) + "\n")
        lines = ["# XCTest application-relaunch validation", "", f"Status: **{status}**. Started: {started}. Finished: {module.utc()}.", "",
                 "One xcodebuild process executes each batch with `-test-iterations N -test-repetition-relaunch-enabled YES -run-tests-until-failure`. Only DeviceStartupProbeTests/testNoNetworking is selected. It requests no WebChannel or HTTP networking; the existing demo remains the host. A passed batch requires all requested stdout markers, distinct application PIDs, networkRequested=false, and xcodebuild exit code 0. No failed test is retried.", "",
                 "## Recorded batches", "", "| Batch | Requested | Recorded markers | Distinct application PIDs | Passed |", "|---|---:|---:|---:|---|"]
        for row in batches:
            lines.append(f"| {row['phase']} | {row['requestedIterations']} | {row['recordedMarkers']} | {row['distinctApplicationPIDs']} | {row['passed']} |")
        lines.extend(["", "For a known pre-test startup failure only, DDI re-enabling and then termination of only the current user's CoreDeviceService may precede another smoke batch. These operations are recorded separately and are not applied periodically during validation. USB is not unplugged and the iPhone is not rebooted.", "",
                      "This experiment validates application process relaunch and startup stability. It does not itself verify fresh HTTP/2 transport in a Lens run.", ""])
        (root / "report.md").write_text("\n".join(lines))
        (root / "connection-reuse-audit.md").write_text("# Relaunch protocol evidence and limits\n\n"
            f"{len(snapshots)} resource/USB snapshots were retained; USB snapshot coverage={coverage}; distinct USB registry IDs={sorted(identities)}. Snapshots are taken around each batch and about every 10 seconds during execution. They do not establish continuous hardware connectivity between samples.\n\n"
            "Raw notification logs and process snapshots allow observation lifetime and file descriptor behavior to be compared with the separate-xcodebuild reproducer. Marker JSON retains every observed application PID. A completed validation supports the batch/relaunch protocol in this environment; it does not prove a permanent OS fix or transfer the result to HTTP/2 cold-connection measurements without a separate transport check.\n")
        (root / "artifacts.md").write_text("# Relaunch validation artifacts\n\n"
            "[Report](report.md) · [Result](result.json) · [Execution settings](execution-settings.json) · [Batch commands and outcomes](batches.json) · [Recovery actions](actions.json)\n\n"
            "[Audit](connection-reuse-audit.md) · [Raw notification stream](logs/notification-stream.ndjson) · [Logs, process and USB snapshots](logs/) · [XCTest result bundles](xcresults/) · [Stdout marker records](attachments/)\n")
        print(f"Validation result: {status}; {root / 'report.md'}", flush=True)
    return 130 if interrupted else 0 if status == "complete" else 1


if __name__ == "__main__":
    raise SystemExit(main())
