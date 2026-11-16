#!/usr/bin/env python3
"""Run opted-in demo experiments using only stdlib, devicectl and Apple's native helper."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import signal
import subprocess
import sys
import threading
import time

CASES = [
    ("T1", 10, "idle", False), ("T2", 50, "idle", False),
    ("T3", 90, "idle", False), ("T4", 150, "idle", False),
    ("T5", 250, "idle", False),
    ("T6-short", 50, "streaming", False), ("T6-long", 150, "streaming", False),
    ("T6-exhaust", 250, "streaming", False),
    ("T7", 90, "pending", False), ("T8", 60, "idle", True),
    ("M5-periodic", 250, "periodic", False), ("T16", 30, "pending", False),
]


def utc():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


class Capture:
    def __init__(self, command, path, structured=False):
        self.path = path
        self.records = []
        self.lock = threading.Lock()
        self.process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                        text=True, bufsize=1)
        self.structured = structured
        self.thread = threading.Thread(target=self.read, daemon=True)
        self.thread.start()

    def read(self):
        with self.path.open("w", buffering=1) as stream:
            for line in self.process.stdout:
                stream.write(utc() + " " + line if not self.structured else line)
                try:
                    raw = line.split("[NETTEST] ", 1)[1] if "[NETTEST] " in line else line
                    record = json.loads(raw)
                except (ValueError, IndexError):
                    continue
                if not isinstance(record, dict):
                    continue
                record["hostReceivedMonotonic"] = time.monotonic()
                record["hostReceivedUTC"] = utc()
                with self.lock:
                    self.records.append(record)

    def snapshot(self):
        with self.lock:
            return list(self.records)

    def wait_for(self, predicate, timeout):
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            records = self.snapshot()
            for record in records:
                if predicate(record):
                    return record
            if self.process.poll() is not None:
                break
            time.sleep(.05)
        raise RuntimeError(f"Missing expected event in {self.path.name}")

    def finish_helper(self):
        if self.process.poll() is None:
            self.process.send_signal(signal.SIGTERM)
        self.process.wait(timeout=25)
        self.thread.join(timeout=3)
        if not any(r.get("event") == "inactive_verified" for r in self.snapshot()):
            raise RuntimeError("No inactive verification from condition helper")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--device", required=True, help="Hardware UDID")
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--helper", default="/private/tmp/net-http-device-condition")
    parser.add_argument("--cases", default="all")
    parser.add_argument("--repetitions", type=int, default=3)
    parser.add_argument("--resume", action="store_true", help="Skip completed trials and preserve interrupted-attempt directories")
    args = parser.parse_args()
    if not 1 <= args.repetitions <= 10:
        parser.error("repetitions must be 1..10")
    chosen = set(args.cases.split(","))
    cases = CASES if args.cases == "all" else [c for c in CASES if c[0] in chosen]
    if not cases or (args.cases != "all" and chosen - {c[0] for c in CASES}):
        parser.error("Unknown case")
    args.output.mkdir(parents=True, exist_ok=args.resume)
    results_path = args.output / "results.json"
    results = json.loads(results_path.read_text()) if args.resume and results_path.exists() else []
    completed_keys = {(r["case"], r["run"]) for r in results if not r["observation"].startswith("infrastructure-error")}
    current_folder = args.output
    latest_status = {}
    active_helper = None
    app = None

    def status(**fields):
        latest_status.update(fields)
        data = {"updatedUTC": utc(), "completed": len(completed_keys),
                "total": len(cases) * args.repetitions, **latest_status}
        temp = args.output / "status.tmp"
        temp.write_text(json.dumps(data, indent=2))
        temp.replace(args.output / "status.json")

    def command(parts, log, timeout=30):
        with log.open("w") as stream:
            subprocess.run(parts, stdout=stream, stderr=subprocess.STDOUT, check=True, timeout=timeout)

    def notify(action, folder):
        command(["xcrun", "devicectl", "device", "notification", "post", "--device", args.device,
                 "--name", "com.pmodular.webchannel.nettest." + action], folder / (action + ".log"))

    def stop_app(folder):
        nonlocal app
        if app is None:
            return
        if app.process.poll() is None:
            notify("close", folder)
            time.sleep(2)
            start = next((r for r in app.snapshot() if r.get("kind") == "autorun_start"), {})
            pid = start.get("pid")
            if pid:
                command(["xcrun", "devicectl", "device", "process", "terminate", "--device", args.device,
                         "--pid", str(pid)], folder / "terminate.log")
            # If no PID is available, the next --terminate-existing ends this console.
        app.thread.join(timeout=3)
        (folder / "device-events.jsonl").write_text("".join(json.dumps(r) + "\n" for r in app.snapshot()))
        app = None

    def write_report():
        (args.output / "results.json").write_text(json.dumps(results, indent=2))
        lines = ["# Automatic network-failure experiments", "", f"Updated: {utc()}", "",
                 "Native Apple-framework fault injection; fresh demo process/session per trial.",
                 "Host command timestamps bound operations, not exact packet-drop onset.",
                 "The demo is instrumented and autorun-enabled; SDK/client implementation is unchanged.", "",
                 "| Case | Run | Hold (s) | Timeout count | Error codes | Same-session receive after release | Observation |",
                 "| --- | --- | --- | --- | --- | --- | --- |"]
        for r in results:
            lines.append(f"| {r['case']} | {r['run']} | {r.get('holdSeconds', '')} | {r.get('timeouts', '')} | "
                         f"{r.get('errorCodes', '')} | {r.get('receiveAfterRelease', '')} | {r['observation']} |")
        lines += ["", "## Coverage and limits", "",
                  "T9–T14 need real network-off/flapping/interface changes and are not simulated by packet loss here.",
                  "T15 needs confirmed real iOS suspension; process termination or debugger pause is not substituted.",
                  "M2/M3 interface-handoff measurements and M6 QUIC packet capture remain pending.",
                  "Raw logs include SDK attempts/payloads, app messages, lifecycle, NWPathMonitor and task metrics.",
                  "Underlying NSError details are not exposed by the current SDK callbacks; HTTP status and SDK errors are retained.",
                  "Application-message gaps/duplicates and complete M1/M4/M5 conclusions require analysis of the raw records.",
                  "T6 includes separate 50/150/250 s streaming variants, each repeated independently.",
                  "Unexpected outcomes are observations, not automatically relabeled as passing.", ""]
        (args.output / "report.md").write_text("\n".join(lines))

    def stop_signal(signum, frame):
        raise KeyboardInterrupt(f"signal {signum}")
    signal.signal(signal.SIGTERM, stop_signal)
    try:
        for case, duration, traffic, handshake in cases:
            for number in range(1, args.repetitions + 1):
                if (case, number) in completed_keys:
                    continue
                label = f"{case}-r{number}"
                folder = args.output / label
                if folder.exists():
                    archive = args.output / "interrupted-attempts"
                    archive.mkdir(exist_ok=True)
                    folder.rename(archive / (label + "-" + utc().replace(":", "")))
                folder.mkdir()
                current_folder = folder
                status(current=label, phase="preparing")
                print(f"{utc()} START {label}", flush=True)
                try:
                    def start_fault():
                        return Capture([args.helper, "run", args.device, str(duration)], folder / "condition.jsonl", True)

                    if handshake:
                        active_helper = start_fault()
                        active_helper.wait_for(lambda r: r.get("event") == "active_verified", 25)
                    env = {"NETTEST_AUTORUN": "1", "NETTEST_RUN": label,
                           "NETTEST_TRAFFIC": traffic, "NETTEST_FAILFAST": "1" if case == "T16" else "0"}
                    app = Capture(["xcrun", "devicectl", "device", "process", "launch", "--device", args.device,
                                   "--terminate-existing", "--console", "--environment-variables", json.dumps(env),
                                   "com.pmodular.webchannel.demo"], folder / "device-console.log")
                    app.wait_for(lambda r: r.get("kind") == "autorun_start", 25)
                    app.wait_for(lambda r: r.get("kind") == "heartbeat" and r.get("applicationState") == 0, 10)
                    if not handshake:
                        app.wait_for(lambda r: r.get("kind") == "open", 50)
                        if traffic == "streaming":
                            app.wait_for(lambda r: r.get("kind") == "app_log" and "didReceiveMessage" in r.get("text", ""), 20)
                        time.sleep(2)
                        active_helper = start_fault()
                        active_helper.wait_for(lambda r: r.get("event") == "active_verified", 25)
                        if traffic in ("pending", "periodic"):
                            notify("send", folder)
                            app.wait_for(lambda r: r.get("kind") == "control" and r.get("action", "").endswith(".send"), 10)
                    status(current=label, phase="loss-active", duration=duration)
                    heartbeat = 0
                    while active_helper.process.poll() is None:
                        heartbeats = [r for r in app.snapshot() if r.get("kind") == "heartbeat"]
                        if not heartbeats or time.monotonic() - heartbeats[-1]["hostReceivedMonotonic"] > 6:
                            raise RuntimeError("App main-loop heartbeat missing for over 6 seconds")
                        if heartbeats[-1].get("applicationState") == 2:
                            raise RuntimeError("App entered background during fault")
                        if time.monotonic() - heartbeat > 5:
                            status(current=label, phase="loss-active", duration=duration)
                            heartbeat = time.monotonic()
                        time.sleep(.25)
                    active_helper.thread.join(timeout=3)
                    fault_events = active_helper.snapshot()
                    (folder / "condition-events.jsonl").write_text("".join(json.dumps(r) + "\n" for r in fault_events))
                    if active_helper.process.returncode != 0:
                        raise RuntimeError(f"Condition helper exit {active_helper.process.returncode}")
                    end = next(r for r in reversed(fault_events) if r.get("event") == "inactive_verified")
                    release = next(r for r in fault_events if r.get("event") == "disable_request")
                    enabled = next(r for r in fault_events if r.get("event") == "enable_ack")
                    status(current=label, phase="observing-after-release")
                    deadline = time.monotonic() + 65
                    while time.monotonic() < deadline:
                        records = app.snapshot()
                        fatal = any(r.get("kind") == "error" for r in records)
                        received = any(r.get("kind") == "http_log" and "[HTTP Resp Body]" in r.get("text", "")
                                       and r["hostReceivedMonotonic"] > end["hostReceivedMonotonic"] for r in records)
                        if time.monotonic() > end["hostReceivedMonotonic"] + 3 and (fatal or received):
                            break
                        status(current=label, phase="observing-after-release")
                        time.sleep(.5)
                    records = app.snapshot()
                    errors = sorted({r["code"] for r in records if r.get("kind") == "error"})
                    receive_after = any(r.get("kind") == "http_log" and "[HTTP Resp Body]" in r.get("text", "")
                                        and r["hostReceivedMonotonic"] > release["hostReceivedMonotonic"] for r in records)
                    result = {"case": case, "run": number, "holdSeconds": round(release["monotonic_seconds"] - enabled["monotonic_seconds"], 3),
                              "timeouts": sum(r.get("kind") == "sdk_info" and "TIMEOUT:" in r.get("text", "") for r in records),
                              "errorCodes": errors, "receiveAfterRelease": receive_after,
                              "openCount": sum(r.get("kind") == "open" for r in records),
                              "observation": "channel-error" if errors else "receive-resumed" if receive_after else "no-terminal-result",
                              "folder": label}
                    (folder / "device-events.jsonl").write_text("".join(json.dumps(r) + "\n" for r in records))
                    results = [r for r in results if (r["case"], r["run"]) != (case, number)]
                    results.append(result)
                    completed_keys.add((case, number))
                    write_report()
                    print(f"{utc()} DONE {label} {result['observation']} errors={errors}", flush=True)
                    stop_app(folder)
                    active_helper = None
                except Exception as error:
                    results.append({"case": case, "run": number, "observation": "infrastructure-error: " + str(error)})
                    write_report()
                    raise
        status(phase="complete")
        print(f"{utc()} COMPLETE {len(results)} trials", flush=True)
    except BaseException as error:
        status(phase="stopped", error=repr(error))
        raise
    finally:
        if active_helper is not None:
            active_helper.finish_helper()
        if app is not None:
            try:
                stop_app(current_folder)
            except Exception as error:
                print(f"App cleanup: {error}", file=sys.stderr)
        write_report()


if __name__ == "__main__":
    main()
