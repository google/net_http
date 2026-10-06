#!/usr/bin/env python3
"""Reproduce real-device XCTest startup failures and validate bounded recovery."""

import argparse
import collections
import datetime
import hashlib
import json
import os
import plistlib
import re
import signal
import subprocess
import time
from pathlib import Path


def utc():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


class Investigation:
    def __init__(self, args):
        self.args = args
        self.root = args.output.resolve()
        self.root.mkdir(parents=True, exist_ok=False)
        for folder in ("logs", "xcresults", "attachments"):
            (self.root / folder).mkdir()
        self.rows = []
        self.actions = []
        self.child = None
        self.stream = None
        self.started = utc()
        self.strategy = "none"
        self.status = "running"
        self.error = None
        self.settings = vars(args).copy()
        self.settings.update(output=str(self.root), derived_data=str(args.derived_data), workspace=str(args.workspace),
                             startedUTC=self.started, warmStart=True,
                             probe="DeviceStartupProbeTests/testNoNetworking",
                             hostApp="WebChanneliOSDemo; no networking requested by the test",
                             runnerSHA256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
        (self.root / "execution-settings.json").write_text(json.dumps(self.settings, indent=2) + "\n")

    def command(self, label, command, timeout=15):
        path = self.root / "logs" / f"{label}.log"
        with path.open("w") as stream:
            try:
                result = subprocess.run(command, stdout=stream, stderr=subprocess.STDOUT, timeout=timeout)
                return result.returncode, path.read_text()
            except subprocess.TimeoutExpired:
                return 124, path.read_text()

    def processes(self):
        result = subprocess.run(["ps", "-axo", "pid=,uid=,rss=,comm="], capture_output=True, text=True, timeout=10)
        if result.returncode:
            raise RuntimeError("Cannot collect process resources")
        processes = []
        for line in result.stdout.splitlines():
            parts = line.strip().split(None, 3)
            if len(parts) != 4:
                continue
            pid, uid, rss, command = parts
            if Path(command).name not in ("CoreDeviceService", "usbmuxd"):
                continue
            row = {"pid": int(pid), "uid": int(uid), "rssKiB": int(rss), "command": command}
            if int(uid) == os.getuid() and Path(command).name == "CoreDeviceService":
                try:
                    handles = subprocess.run(["/usr/sbin/lsof", "-nP", "-p", pid, "-Ff"],
                                             capture_output=True, text=True, timeout=10)
                    row["openNumericFileDescriptors"] = len({s[1:] for s in handles.stdout.splitlines()
                                                            if s.startswith("f") and s[1:].isdigit()})
                    row["lsofExitCode"] = handles.returncode
                except subprocess.TimeoutExpired:
                    row["lsofTimedOut"] = True
            processes.append(row)
        return processes

    def snapshot(self, label):
        data = {"capturedUTC": utc(), "processes": self.processes()}
        usb = subprocess.run(["ioreg", "-r", "-c", "IOUSBHostDevice", "-a"], capture_output=True, timeout=10)
        data["usbExitCode"] = usb.returncode
        devices = []
        def walk(node):
            if isinstance(node, dict):
                if node.get("USB Product Name") == "iPhone" or str(node.get("IORegistryEntryName", "")).split("@")[0] == "iPhone":
                    devices.append({key: node.get(key) for key in ("IORegistryEntryID", "IORegistryEntryName", "locationID", "idVendor", "idProduct")})
                for value in node.values():
                    if isinstance(value, (list, dict)):
                        walk(value)
            elif isinstance(node, list):
                for value in node:
                    walk(value)
        if usb.returncode == 0:
            walk(plistlib.loads(usb.stdout))
        data["usbIPhones"] = devices
        if usb.returncode or not devices:
            raise RuntimeError("Cannot track an iPhone USB registry entry; stopping before another test launch")
        json_path = self.root / "logs" / f"{label}-coredevice.json"
        code, _ = self.command(label + "-coredevice", ["xcrun", "devicectl", "list", "devices", "--timeout", "10",
                                                      "--json-output", str(json_path)])
        data["coreDeviceQueryExitCode"] = code
        (self.root / "logs" / f"{label}-snapshot.json").write_text(json.dumps(data, indent=2) + "\n")
        return data

    def progress(self):
        counts = collections.Counter((row["phase"], row["status"]) for row in self.rows)
        (self.root / "progress.json").write_text(json.dumps({"status": self.status, "updatedUTC": utc(),
            "strategy": self.strategy, "error": self.error, "counts": {f"{phase}:{status}": n for (phase, status), n in counts.items()},
            "lastTrial": self.rows[-1] if self.rows else None}, indent=2) + "\n")

    def probe(self, phase, index):
        label = f"{phase}-{index:04d}"
        before = self.snapshot(label + "-before")
        path = self.root / "logs" / f"{label}.log"
        bundle = self.root / "xcresults" / f"{label}.xcresult"
        command = ["xcodebuild", "test-without-building", "-workspace", str(self.args.workspace),
                   "-scheme", "WebChanneliOSDemo", "-configuration", "Debug", "-destination", f"id={self.args.device}",
                   "-derivedDataPath", str(self.args.derived_data), "-parallel-testing-enabled", "NO",
                   "-only-testing:WebChanneliOSDemoTests/DeviceStartupProbeTests/testNoNetworking",
                   "-resultBundlePath", str(bundle)]
        started, epoch = utc(), time.time()
        with path.open("w") as stream:
            self.child = subprocess.Popen(command, stdout=stream, stderr=subprocess.STDOUT, start_new_session=True)
            try:
                code = self.child.wait(timeout=180)
            except subprocess.TimeoutExpired:
                self.stop_child()
                code = 124
            finally:
                self.child = None
        text = path.read_text()
        marker = re.search(r"DEVICE_STARTUP_PROBE_RESULT (\{[^\r\n]+\})", text)
        payload = json.loads(marker.group(1)) if marker else None
        passed = code == 0 and payload is not None and payload.get("status") == "passed" and payload.get("networkRequested") is False
        known_startup = (payload is None and "Timed out waiting for all destinations" in text
                         and "observing system notifications failed" in text and "Test Case '-[" not in text)
        after = self.snapshot(label + "-after")
        row = {"phase": phase, "index": index, "startedUTC": started, "finishedUTC": utc(),
               "elapsedSeconds": time.time() - epoch, "exitCode": code,
               "status": "passed" if passed else "startup-failure" if known_startup else "other-failure",
               "probe": payload, "usbBefore": before["usbIPhones"], "usbAfter": after["usbIPhones"],
               "log": path.relative_to(self.root).as_posix(), "xcresult": bundle.relative_to(self.root).as_posix()}
        self.rows.append(row)
        (self.root / "attachments" / f"{label}.json").write_text(json.dumps(row, indent=2) + "\n")
        self.progress()
        print(f"{label}: {row['status']}", flush=True)
        return row

    def stop_child(self):
        if self.child is not None and self.child.poll() is None:
            os.killpg(self.child.pid, signal.SIGTERM)
            try:
                self.child.wait(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(self.child.pid, signal.SIGKILL)
                self.child.wait()

    def restart_coredevice(self, label):
        services = [p for p in self.processes() if p["uid"] == os.getuid() and Path(p["command"]).name == "CoreDeviceService"]
        if not services:
            raise RuntimeError("No current-user CoreDeviceService found; refusing broad termination")
        for service in services:
            os.kill(service["pid"], signal.SIGTERM)
        deadline = time.monotonic() + 20
        old_pids = {p["pid"] for p in services}
        while time.monotonic() < deadline:
            if not old_pids.intersection(p["pid"] for p in self.processes()):
                break
            time.sleep(0.5)
        else:
            raise RuntimeError("CoreDeviceService did not terminate cleanly")
        code, _ = self.command(label + "-rediscover", ["xcrun", "devicectl", "list", "devices", "--timeout", "15"])
        self.actions.append({"action": "restart-current-user-CoreDeviceService", "label": label,
                             "finishedUTC": utc(), "terminatedPIDs": sorted(old_pids), "rediscoveryExitCode": code})
        if code:
            raise RuntimeError("CoreDevice rediscovery failed")

    def run(self):
        predicate = '(process == "CoreDeviceService" AND eventMessage CONTAINS[c] "DarwinNotification") OR (process == "xcodebuild" AND eventMessage CONTAINS[c] "observing system")'
        with (self.root / "logs/notification-stream.ndjson").open("w") as stream:
            self.stream = subprocess.Popen(["/usr/bin/log", "stream", "--style", "ndjson", "--level", "debug", "--predicate", predicate],
                                           stdout=stream, stderr=subprocess.STDOUT)
            try:
                time.sleep(1)
                if self.stream.poll() is not None:
                    raise RuntimeError("Notification log stream could not start")
                failed = None
                for index in range(1, self.args.baseline_count + 1):
                    row = self.probe("baseline", index)
                    if row["status"] != "passed":
                        failed = row
                        break
                if failed:
                    if failed["status"] != "startup-failure":
                        self.status = "needs-attention"
                        return
                    self.actions.append({"action": "wait", "startedUTC": utc(), "seconds": 60})
                    time.sleep(60)
                    row = self.probe("recovery-wait", 1)
                    if row["status"] == "passed":
                        self.strategy = "wait"
                    else:
                        if row["status"] != "startup-failure":
                            self.status = "needs-attention"
                            return
                        code, _ = self.command("recovery-ddi", ["xcrun", "devicectl", "device", "info", "ddiServices", "--device", self.args.device, "--timeout", "15"])
                        self.actions.append({"action": "ddi-reenable", "finishedUTC": utc(), "exitCode": code})
                        if code:
                            self.status = "needs-attention"
                            return
                        row = self.probe("recovery-ddi", 1)
                        if row["status"] == "passed":
                            self.strategy = "ddi-reenable"
                        else:
                            if row["status"] != "startup-failure":
                                self.status = "needs-attention"
                                return
                            self.restart_coredevice("recovery-coredevice")
                            row = self.probe("recovery-coredevice", 1)
                            if row["status"] != "passed":
                                self.status = "needs-attention"
                                return
                            self.strategy = "restart-current-user-CoreDeviceService"
                for index in range(1, self.args.validation_count + 1):
                    if self.strategy != "none" and (index == 1 or (index-1) % self.args.cleanup_interval == 0):
                        label = f"validation-cleanup-{index:04d}"
                        if self.strategy == "wait":
                            self.actions.append({"action": "wait", "startedUTC": utc(), "label": label, "seconds": 60})
                            time.sleep(60)
                        elif self.strategy == "ddi-reenable":
                            code, _ = self.command(label, ["xcrun", "devicectl", "device", "info", "ddiServices", "--device", self.args.device, "--timeout", "15"])
                            self.actions.append({"action": self.strategy, "label": label, "finishedUTC": utc(), "exitCode": code})
                            if code:
                                self.status = "needs-attention"
                                return
                        else:
                            self.restart_coredevice(label)
                    row = self.probe("validation", index)
                    if row["status"] != "passed":
                        self.status = "validation-failed"
                        return
                self.status = "complete"
            except Exception as error:
                self.status = "needs-attention"
                self.error = str(error)
                print(f"Investigation error: {error}", flush=True)
            finally:
                if self.stream.poll() is None:
                    self.stream.terminate()
                    self.stream.wait(timeout=10)
                self.finish()

    def finish(self):
        self.progress()
        (self.root / "trials.json").write_text(json.dumps(self.rows, indent=2) + "\n")
        (self.root / "actions.json").write_text(json.dumps(self.actions, indent=2) + "\n")
        starts, replies = {}, {}
        dropped = []
        for line in (self.root / "logs/notification-stream.ndjson").read_text().splitlines():
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            message = event.get("eventMessage", "")
            if "drop" in message.lower():
                dropped.append(event)
            if "DarwinNotificationObserveActionImplementation" not in message:
                continue
            invocation = re.search(r"invocation=([0-9A-F-]+)", message)
            if invocation:
                target = starts if "Invoking action" in message else replies if "Received reply from action" in message else None
                if target is not None:
                    target[invocation.group(1)] = event.get("timestamp")
        observations = {"starts": starts, "replies": replies, "unmatchedStarts": sorted(set(starts)-set(replies)),
                        "repliesWithoutStartInCapture": sorted(set(replies)-set(starts)), "droppedMessages": dropped,
                        "limitation": "Counts cover the filtered host log stream only; missing events or private fields limit causal conclusions."}
        (self.root / "notification-observations.json").write_text(json.dumps(observations, indent=2) + "\n")
        counts = collections.Counter((r["phase"], r["status"]) for r in self.rows)
        lines = ["# Device XCTest startup investigation", "", f"Status: **{self.status}**. Started: {self.started}. Finished: {utc()}.", "",
                 "## Environment and procedure", "", "Physical iPhone SE (3rd generation), iPhone14,6. The existing WebChanneliOSDemo app remains the XCTest host, but the selected test does not create or connect a WebChannel or request HTTP networking. The inherited CoreDevice state was not reset before the baseline.", "",
                 f"Run up to {self.args.baseline_count} baseline invocations in separate xcodebuild processes, stopping at the first failure. For a verified notification-observation startup failure, test 60 seconds of waiting, then DDI service re-enabling, then termination of only the current user's CoreDeviceService, stopping the recovery sequence at the first successful probe. USB is never unplugged by this script. Unknown failures stop the investigation.", "",
                 f"Validation requests {self.args.validation_count} further invocations. If recovery worked, repeat that action proactively every {self.args.cleanup_interval} invocations. Every validation invocation must pass; the first failure stops validation. A successful validation establishes an observed mitigation for this environment, not a permanent OS fix or proven root cause.", "",
                 "## Recorded test invocations", "", "| Phase | Passed | Startup failure | Other failure |", "|---|---:|---:|---:|"]
        for phase in dict.fromkeys(r["phase"] for r in self.rows):
            lines.append(f"| {phase} | {counts[phase,'passed']} | {counts[phase,'startup-failure']} | {counts[phase,'other-failure']} |")
        lines.extend(["", f"Recovery strategy used for validation: `{self.strategy}`. All attempted invocations and result bundles are preserved. No Lens latency data was measured.", ""])
        (self.root / "report.md").write_text("\n".join(lines))
        (self.root / "connection-reuse-audit.md").write_text("# Startup investigation evidence and limits\n\n"
            f"Filtered notification stream: {len(starts)} distinct observation starts, {len(replies)} distinct replies, and {len(set(starts)-set(replies))} starts without a reply in this capture. These counts alone do not prove a leak or causation.\n\n"
            "Per-invocation snapshots retain USB registry identity, CoreDevice JSON, current-user CoreDeviceService PID/RSS/open numeric file descriptors, and usbmuxd PID/RSS. CoreDeviceService termination uses SIGTERM only and is restricted to the current user's exact service executable name. The iPhone is not rebooted, Developer Mode is not disabled, and USB is not physically reconnected.\n\n"
            "The test body makes no network request; the host app still loads its ordinary UI and linked frameworks. Passing this test does not prove the absence of unrelated system networking. Partial or failed validation must not be described as a solved connection problem.\n")
        (self.root / "artifacts.md").write_text("# Startup investigation artifacts\n\n"
            "[Report](report.md) · [Audit](connection-reuse-audit.md) · [Execution settings](execution-settings.json) · [Progress](progress.json)\n\n"
            "[All attempts](trials.json) · [Recovery actions](actions.json) · [Notification UUID analysis](notification-observations.json)\n\n"
            "[Raw notification stream](logs/notification-stream.ndjson) retains filtered host observations. [Logs and snapshots](logs/) retain per-invocation output, USB and process resource snapshots, and CoreDevice JSON. [Result bundles](xcresults/) retain every attempted XCTest invocation. [Parsed trial records](attachments/) are derived from stdout markers and capture metadata, not exported XCTest attachments.\n")
        print(f"Investigation finished: {self.status}; {self.root / 'report.md'}", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    parser.add_argument("--device", required=True)
    parser.add_argument("--derived-data", type=Path, required=True)
    parser.add_argument("--workspace", type=Path, required=True)
    parser.add_argument("--baseline-count", type=int, default=300)
    parser.add_argument("--validation-count", type=int, default=1000)
    parser.add_argument("--cleanup-interval", type=int, default=100)
    args = parser.parse_args()
    if min(args.baseline_count, args.validation_count, args.cleanup_interval) <= 0:
        parser.error("Counts and cleanup interval must be positive")
    args.workspace = args.workspace.resolve()
    args.derived_data = args.derived_data.resolve()
    investigation = Investigation(args)
    def cancel(_signal, _frame):
        investigation.status = "interrupted"
        investigation.stop_child()
        raise KeyboardInterrupt
    signal.signal(signal.SIGINT, cancel)
    signal.signal(signal.SIGTERM, cancel)
    try:
        investigation.run()
    except KeyboardInterrupt:
        return 130
    return 0 if investigation.status == "complete" else 1


if __name__ == "__main__":
    raise SystemExit(main())
