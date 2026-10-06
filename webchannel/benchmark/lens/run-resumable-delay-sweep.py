#!/usr/bin/env python3
"""Resume unstarted development-service failures without replacing measurements."""

import datetime
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import time
from pathlib import Path


def main():
    root = Path(sys.argv[1]).resolve()
    if (root / "interruption.json").exists():
        print("Refusing to resume a user-interrupted experiment.", flush=True)
        return 2
    settings = json.loads((root / "execution-settings.json").read_text())
    runner = Path(__file__).with_name("run-omnient-delay-sweep.sh")
    environment = dict(os.environ, LENS_RESUME="1",
                       LENS_DERIVED_DATA=settings["derivedData"],
                       LENS_DELAYS_MS=" ".join(map(str, settings["delaysMs"])))
    child = None
    waiting_pid = int(sys.argv[2]) if len(sys.argv) > 2 else None

    def cancel(signum, _frame):
        if child is not None and child.poll() is None:
            child.send_signal(signal.SIGTERM)
            child.wait()
        elif waiting_pid is not None:
            try:
                os.kill(waiting_pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
        raise SystemExit(128 + signum)

    signal.signal(signal.SIGINT, cancel)
    signal.signal(signal.SIGTERM, cancel)
    if waiting_pid is not None:
        print(f"Waiting for existing runner {waiting_pid} to exit; no overlapping trials.", flush=True)
        while True:
            try:
                os.kill(waiting_pid, 0)
            except ProcessLookupError:
                break
            time.sleep(5)
        waiting_pid = None
    logs = [p for p in root.glob("delay-*ms/logs/omnient-*.log")
            if re.fullmatch(r"omnient-\d+-(?:off|on)\.log", p.name)]
    latest = max(logs, key=lambda p: p.stat().st_mtime) if logs else None
    pending_failure = (latest if latest is not None
                       and "observing system notifications failed" in latest.read_text()
                       and "LENS_BENCHMARK_RESULT" not in latest.read_text() else None)
    failures = {}
    attempt = 0
    while True:
        attempt += 1
        stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        sweep_log = root / "logs" / f"sweep-{stamp}.log"
        print(f"Runner attempt {attempt}: {sweep_log}", flush=True)
        if pending_failure is not None:
            sweep_log.write_text(f"FAIL {pending_failure.stem} (see {pending_failure})\n")
            result = 1
            pending_failure = None
        else:
            with sweep_log.open("w") as stream:
                child = subprocess.Popen(["bash", str(runner), settings["deviceID"], str(root),
                                          str(settings["pairsPerDelay"])], env=environment,
                                         stdout=stream, stderr=subprocess.STDOUT)
                result = child.wait()
            child = None
        if result == 0:
            print("All requested measurement trials recorded.", flush=True)
            finalizer = Path(__file__).with_name("finalize-delay-sweep.py")
            subprocess.run([settings["reportPython"], "-B", str(finalizer), str(root)], check=True)
            return 0
        console = sweep_log.read_text()
        matches = re.findall(r"FAIL (omnient-\d+-(?:off|on)) \(see (.+)\)", console)
        if not matches:
            print("Stopping: no identifiable failed trial.", flush=True)
            return result
        trial, log_path = matches[-1]
        log = Path(log_path)
        phase = log.parent.parent
        text = log.read_text()
        folder = phase / "attachments" / f"{trial}-attachments"
        recorded_json = [p for p in folder.glob("*.json") if p.name != "manifest.json"]
        # This exact destination-availability error happens before XCTest starts.
        if ("LENS_BENCHMARK_RESULT" in text or recorded_json
                or "Test Case '-[" in text
                or "Timed out waiting for all destinations" not in text
                or "observing system notifications failed" not in text):
            print("Stopping: failure is not a verified unstarted development-service error.", flush=True)
            return result
        key = (phase.name, trial)
        failures[key] = failures.get(key, 0) + 1
        if failures[key] > 3:
            print("Stopping: three recovery attempts did not restore this trial.", flush=True)
            return result
        diagnostics = phase / "logs/device-diagnostics" / trial
        diagnostics.mkdir(parents=True, exist_ok=True)
        for name, subcommand in (("lock-state", "lockState"), ("ddi-services", "ddiServices")):
            with (diagnostics / f"{name}.log").open("w") as stream:
                try:
                    query = subprocess.run(
                        ["xcrun", "devicectl", "device", "info", subcommand,
                         "--device", settings["deviceID"], "--timeout", "15",
                         "--json-output", str(diagnostics / f"{name}.json")],
                        stdout=stream, stderr=subprocess.STDOUT, timeout=25)
                except subprocess.TimeoutExpired:
                    print(f"Stopping: {name} query timed out.", flush=True)
                    return result
            if query.returncode != 0:
                print(f"Stopping: {name} query failed; see {diagnostics}.", flush=True)
                return result
        destination = root / "infrastructure-attempts" / f"{phase.name}-{trial}-{stamp}"
        destination.mkdir(parents=True)
        for category in ("logs", "xcresults", "attachments"):
            for path in (phase / category).glob(f"{trial}.*" if category == "xcresults" else f"{trial}*"):
                target = destination / category
                target.mkdir(exist_ok=True)
                shutil.move(str(path), str(target / path.name))
        shutil.move(str(diagnostics), str(destination / "logs/device-diagnostics"))
        (destination / "README.md").write_text(
            "# Development-service startup failure\n\n"
            f"{phase.name}, {trial}: Xcode failed while observing system notifications, before XCTest started. "
            "No benchmark result or measurement JSON was produced. The message asking for an unlocked device "
            "does not establish an actual device lock or USB disconnection. Connection diagnostics were retained. "
            "The lock-state and DDI service queries succeeded; the DDI query enables developer disk image services. "
            "The unstarted trial was archived before resuming. All recorded measurement trials, including timeouts "
            "and pairs failing histogram inclusion, remain unchanged.\n\n"
            f"[Startup log](logs/{trial}.log) · [USB snapshot](logs/device-diagnostics/usb.log) · "
            "[CoreDevice state](logs/device-diagnostics/coredevice-details.log) · "
            "[Lock state](logs/device-diagnostics/lock-state.json) · "
            "[DDI services](logs/device-diagnostics/ddi-services.json)\n")
        print(f"Retained startup failure at {destination}; resuming recorded trials.", flush=True)


if __name__ == "__main__":
    raise SystemExit(main())
