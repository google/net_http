#!/usr/bin/env python3
"""Human-operated Wi-Fi/cellular handoff; stdlib-only, USB logging, local cues."""
import argparse
import importlib.util
import json
import math
from pathlib import Path
import signal
import subprocess
import sys
import time
import uuid

_spec = importlib.util.spec_from_file_location(
    "network_failures", Path(__file__).with_name("run-network-failures.py"))
_support = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_support)
Capture, utc = _support.Capture, _support.utc


class WaitTimeout(RuntimeError):
    pass


def matches_path(record, interface):
    if interface == "offline":
        return record.get("kind") == "path" and record.get("status") == "unsatisfied"
    other = "cellular" if interface == "wifi" else "wifi"
    return (record.get("kind") == "path" and record.get("status") == "satisfied"
            and record.get(interface) is True and record.get(other) is False
            and record.get("wired") is False)


def device_interval(start, end):
    elapsed = end["deviceUptimeSeconds"] - start["deviceUptimeSeconds"]
    if not math.isfinite(elapsed) or elapsed < 0:
        raise RuntimeError("Device clock regressed or is invalid")
    return elapsed


class Observer:
    """Only current state can satisfy a wait; old successful paths cannot."""
    def __init__(self, capture, run, stream):
        self.capture, self.run, self.stream = capture, run, stream
        self.records = []
        self.cursor = 0

    def poll(self):
        snapshot = self.capture.snapshot()
        for record in snapshot[self.cursor:]:
            if record.get("run") == self.run:
                self.records.append(record)
                self.stream.write(json.dumps(record) + "\n")
        self.cursor = len(snapshot)
        if self.capture.process.poll() is not None:
            raise RuntimeError("Device console disconnected or app exited")

    def latest(self, kind):
        return next((r for r in reversed(self.records) if r.get("kind") == kind), None)

    def active(self, now):
        heartbeat = self.latest("heartbeat")
        lifecycle = self.latest("lifecycle")
        if lifecycle and lifecycle.get("notification") != "UIApplicationDidBecomeActiveNotification":
            return False
        return bool(heartbeat and heartbeat.get("applicationState") == 0
                    and now - heartbeat["hostReceivedMonotonic"] <= 6)

    def on_path(self, interface, after):
        path = self.latest("path")
        return path if (path and path["hostReceivedMonotonic"] >= after
                        and matches_path(path, interface)) else None

    def healthy(self, now, interface, since=None, allow_channel_failure=False):
        if not self.active(now):
            raise RuntimeError("App is inactive/backgrounded or heartbeat is stale during hold")
        if not matches_path(self.latest("path") or {}, interface):
            raise RuntimeError("Unexpected path during hold; trial interrupted")
        if not allow_channel_failure and (self.latest("error") or self.latest("closed")):
            raise RuntimeError("Channel failed/closed; trial interrupted")
        if since is not None:
            for record in self.records[since:]:
                if record.get("kind") == "path" and not matches_path(record, interface):
                    raise RuntimeError("Path flapped during hold; trial interrupted")
                if ((record.get("kind") == "heartbeat" and record.get("applicationState") != 0)
                        or (record.get("kind") == "lifecycle" and record.get("notification") !=
                            "UIApplicationDidBecomeActiveNotification")):
                    raise RuntimeError("App became inactive during hold; trial interrupted")
            previous = next((r for r in reversed(self.records[:since])
                             if r.get("kind") == "heartbeat"), None)
            for record in self.records[since:]:
                if record.get("kind") == "heartbeat":
                    if previous and device_interval(previous, record) > 6:
                        raise RuntimeError("Heartbeat gap during hold; timing is uncertain")
                    previous = record

    def probe_reply(self, after):
        sent = next((r for r in reversed(self.records)
                     if r.get("kind") == "echo_sent" and r.get("message") == "NETTEST_PROBE"
                     and r["hostReceivedMonotonic"] >= after), None)
        if sent:
            return next((r for r in reversed(self.records)
                         if r.get("kind") == "echo_reply" and r.get("token") == sent["token"]
                         and r["hostReceivedMonotonic"] >= sent["hostReceivedMonotonic"]), None)
        return None


class Runner:
    def __init__(self, args):
        self.args = args
        self.folder = args.output
        self.scenario = getattr(args, "scenario", "handoff")
        self.run_id = "handoff-" + uuid.uuid4().hex[:12]
        self.app = self.observer = None
        self.guard_cursor = None
        self.phase = "preparing"
        self.audio = []
        self.result = {"run": self.run_id, "scenario": "wifi-cellular-wifi",
                       "requestedHoldSeconds": args.hold, "outcome": "interrupted",
                       "milestones": {}, "timingNotes": [
                           "Device intervals use deviceUptimeSeconds; no host/device UTC subtraction.",
                           "Path callbacks describe observed routing, not physical switch timestamps.",
                           "Cue times are host times; human response is measured, not assumed instantaneous.",
                           "No SDK test-case pass/fail or real OS suspension is inferred."]}
        if self.scenario == "l3-idle":
            self.result["scenario"] = "T9-l3-idle"
        self.journal = (self.folder / "runner-events.jsonl").open("w", buffering=1)
        self.device_stream = (self.folder / "device-events.jsonl").open("w", buffering=1)

    def event(self, event, **fields):
        record = {"event": event, "hostUTC": utc(), "hostMonotonic": time.monotonic(),
                  "phase": self.phase, **fields}
        self.journal.write(json.dumps(record) + "\n")
        return record

    def status(self, phase):
        self.phase = phase
        self.event("phase")
        temp = self.folder / "status.tmp"
        temp.write_text(json.dumps({"phase": phase, "run": self.run_id, "updatedUTC": utc()}, indent=2))
        temp.replace(self.folder / "status.json")

    def cue(self, text, sound="Glass", speech=None):
        record = self.event("cue", text=text, sound=sound, speech=speech)
        print("\n" + text, flush=True)
        if not self.args.silent:
            self.audio = [p for p in self.audio if p.poll() is None]
            try:
                self.audio.append(subprocess.Popen(
                    ["/usr/bin/afplay", f"/System/Library/Sounds/{sound}.aiff"],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL))
                if speech and not self.args.no_speech:
                    self.audio.append(subprocess.Popen(
                        ["/usr/bin/say", speech],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL))
            except OSError as error:
                self.event("audio_error", error=str(error))
                print("音を再生できません。画面の案内に従ってください。", flush=True)
        return record["hostMonotonic"]

    def instructions(self):
        if self.scenario == "l3-idle":
            text = (
                "T9: Wi-Fi を ON、モバイルデータ通信を OFF にして準備してください。\n"
                "確認音ではまだ Wi-Fi を切断しないでください。\n"
                "1回目の操作音（Glass）＋『Wi-Fi を切断してください』:\n"
                "  Wi-Fi を切断し、すぐ試験アプリへ戻る。モバイルデータ通信は OFF のまま。\n"
                f"ネットワークなしの観測から約 {self.args.hold:g} 秒後、復旧音（Hero）\n"
                "＋『Wi-Fi を戻してください』: Wi-Fi を ON に戻し、すぐアプリへ戻る。\n"
                "終了音（Funk）で操作終了。中断音（Basso）なら設定を手動で復元。\n"
                "接続準備後、3・2・1 を表示して操作音を鳴らします。AI の追加案内は不要です。\n"
                "モバイルデータ通信 OFF のダイアログが出たら閉じ、すぐアプリへ戻ってください。")
            self.event("instructions", text=text)
            print("\n" + text, flush=True)
            return
        text = (
            "これからの操作（試験中は AI の追加案内を待たないでください）:\n"
            "  確認音: 聞こえることだけを確認。まだ設定を変えないでください。\n"
            "  1回目の操作音（Glass）＋『Wi-Fi を切断してください』:\n"
            "    Wi-Fi を切断し、すぐ試験アプリへ戻る。モバイルデータ通信は ON のまま。\n"
            f"  Cellular 経路の観測から約 {self.args.hold:g} 秒後、2回目の操作音（Hero）\n"
            "  ＋『Wi-Fi を戻してください』: Wi-Fi を ON に戻し、すぐ試験アプリへ戻る。\n"
            "  終了音（Funk）＋『試験終了です』: 操作終了。\n"
            "  中断音（Basso）＋『試験を中断しました』: 切り替えをやめ、設定を手動で復元。\n"
            "接続と応答の準備後、画面に 3・2・1 を表示してから1回目の操作音を鳴らします。\n"
            "途中の経路確認では音を鳴らしません。復旧音が鳴るまでそのまま待ってください。")
        self.event("instructions", text=text)
        print("\n" + text, flush=True)

    def countdown(self):
        self.status("countdown")
        for remaining in (3, 2, 1):
            self.observer.poll()
            self.observer.healthy(time.monotonic(), "wifi")
            self.event("countdown", remaining=remaining)
            print(f"切断の操作音まで {remaining}…", flush=True)
            time.sleep(1)
        self.observer.poll()
        self.observer.healthy(time.monotonic(), "wifi")

    def command(self, parts, name):
        with (self.folder / (name + ".log")).open("w") as log:
            subprocess.run(["xcrun", "devicectl", *parts], stdout=log,
                           stderr=subprocess.STDOUT, check=True, timeout=30)

    def wired(self, name):
        path = self.folder / (name + ".json")
        self.command(["device", "info", "details", "--device", self.args.device,
                      "--json-output", str(path)], name)
        properties = json.loads(path.read_text())["result"]["connectionProperties"]
        if properties.get("transportType") != "wired" or properties.get("tunnelState") != "connected":
            raise RuntimeError("A connected wired devicectl transport is required")
        self.event("wired_verified")

    def wait(self, predicate, seconds, description):
        deadline = time.monotonic() + seconds
        while time.monotonic() < deadline:
            self.observer.poll()
            result = predicate()
            if result:
                return result
            time.sleep(.1)
        raise WaitTimeout("Timed out: " + description)

    def milestone(self, name, record):
        self.result["milestones"][name] = record
        self.event("milestone", name=name, record=record)
        return record

    def path(self, interface, after):
        def current():
            path = self.observer.on_path(interface, after)
            heartbeat = self.observer.latest("heartbeat")
            return path if (path and self.observer.active(time.monotonic()) and heartbeat
                            and heartbeat["deviceUptimeSeconds"] >= path["deviceUptimeSeconds"]) else None
        return self.wait(current, self.args.transition_timeout, interface + " path + foreground heartbeat")

    def probe(self, interface):
        self.observer.poll()
        self.observer.healthy(time.monotonic(), interface, self.guard_cursor)
        after = time.monotonic()
        self.command(["device", "notification", "post", "--device", self.args.device,
                      "--name", "com.pmodular.webchannel.nettest.probe"], self.phase + "-probe")

        def reply():
            self.observer.healthy(time.monotonic(), interface, self.guard_cursor)
            return self.observer.probe_reply(after)
        return self.wait(reply, self.args.probe_timeout, "matching echo reply")

    def execute(self):
        self.wired("device-before")
        self.status("operator-ready")
        self.instructions()
        setup = ("Wi-Fi を ON、モバイルデータ通信を OFF にしてください。"
                 if self.scenario == "l3-idle" else "Wi-Fi とモバイルデータ通信を ON にしてください。")
        self.cue("音の確認です。iPhone を USB 接続し、" + setup, "Tink")
        print("Network Link Conditioner / Xcode の通信障害設定を解除してください。\n"
              "試験中は案内された切り替えだけを行い、その後すぐ試験アプリへ戻ってください。\n"
              "中断・終了時も通信設定は自動復元しません。最後に手動で復元してください。\n"
              "操作と音の対応を読み、確認音が聞こえ、準備できたら Enter: ", end="", flush=True)
        input()
        self.event("operator_ready")
        self.wired("device-armed")
        self.status("starting-app")
        env = {"NETTEST_AUTORUN": "1", "NETTEST_RUN": self.run_id,
               "NETTEST_TRAFFIC": "idle", "NETTEST_FAILFAST": "0"}
        self.app = Capture(["xcrun", "devicectl", "device", "process", "launch", "--device",
                            self.args.device, "--terminate-existing", "--console",
                            "--environment-variables", json.dumps(env), "com.pmodular.webchannel.demo"],
                           self.folder / "device-console.log")
        self.observer = Observer(self.app, self.run_id, self.device_stream)
        start = self.wait(lambda: self.observer.latest("autorun_start"), 30, "autorun_start")
        if start.get("controlProtocolVersion", 0) < 2:
            raise RuntimeError("Rebuild and install the demo from this checkout (control protocol 2 required)")
        self.wait(lambda: self.observer.latest("open"), 60, "channel open")
        self.milestone("baselinePath", self.path("wifi", 0))
        self.milestone("baselineEcho", self.probe("wifi"))
        if self.scenario == "l3-idle":
            return self.l3_idle()
        self.countdown()
        self.status("awaiting-cellular")
        after = self.cue("Wi-Fi を切断してください。モバイルデータ通信は ON のまま、すぐ試験アプリへ戻ってください。",
                         "Glass", speech="Wi-Fi を切断してください")
        cellular = self.milestone("cellularPath", self.path("cellular", after))
        self.guard_cursor = len(self.observer.records)
        self.result["cellularPathReceiptLagSeconds"] = max(
            0, self.observer.latest("heartbeat")["deviceUptimeSeconds"] - cellular["deviceUptimeSeconds"])
        self.status("holding-cellular")
        self.milestone("cellularEcho", self.probe("cellular"))
        self.event("cellular_confirmed")
        print(f"Cellular 経路と応答を確認しました。観測から {self.args.hold:g} 秒で復旧音を鳴らします。", flush=True)
        next_progress = 0

        def held():
            nonlocal next_progress
            self.observer.healthy(time.monotonic(), "cellular", self.guard_cursor)
            elapsed = device_interval(cellular, self.observer.latest("heartbeat"))
            if elapsed >= next_progress:
                print(f"Cellular 経路の観測から {elapsed:.1f} / {self.args.hold:g} 秒", flush=True)
                next_progress = elapsed + 5
            return self.observer.latest("heartbeat") if elapsed >= self.args.hold else None

        held_at = self.wait(held, self.args.hold + 10, "device hold duration")
        self.milestone("holdComplete", held_at)
        self.result["observedSecondsAtRestoreCue"] = device_interval(cellular, held_at)
        self.status("awaiting-wifi")
        self.guard_cursor = None
        after = self.cue("Wi-Fi を ON に戻してください。接続後、すぐ試験アプリへ戻ってください。",
                         "Hero", speech="Wi-Fi を戻してください")
        restored = self.milestone("restoredPath", self.path("wifi", after))
        self.result["observedCellularPathSeconds"] = device_interval(cellular, restored)
        self.status("checking-recovery")
        self.milestone("restoredEcho", self.probe("wifi"))
        self.wired("device-after")
        self.result["outcome"] = "handoff-observed"

    def l3_idle(self):
        self.countdown()
        self.status("awaiting-offline")
        after = self.cue("Wi-Fi を切断してください。モバイルデータ通信は OFF のまま、すぐ試験アプリへ戻ってください。",
                         "Glass", speech="Wi-Fi を切断してください")
        offline = self.milestone("offlinePath", self.path("offline", after))
        self.guard_cursor = len(self.observer.records)
        self.status("holding-offline")

        def held():
            self.observer.healthy(time.monotonic(), "offline", self.guard_cursor,
                                  allow_channel_failure=True)
            heartbeat = self.observer.latest("heartbeat")
            return heartbeat if device_interval(offline, heartbeat) >= self.args.hold else None

        held_at = self.wait(held, self.args.hold + 10, "offline device hold duration")
        self.milestone("holdComplete", held_at)
        self.result["observedSecondsAtRestoreCue"] = device_interval(offline, held_at)
        self.guard_cursor = None
        self.status("awaiting-wifi")
        after = self.cue("Wi-Fi を ON に戻してください。接続後、すぐ試験アプリへ戻ってください。",
                         "Hero", speech="Wi-Fi を戻してください")
        restored = self.milestone("restoredPath", self.path("wifi", after))
        self.result["observedOfflinePathSeconds"] = device_interval(offline, restored)
        self.status("checking-recovery")
        self.observer.poll()

        def terminal():
            return self.observer.latest("error") or self.observer.latest("closed")

        if terminal():
            self.result["channelObservation"] = "channel-failed"
        else:
            # Idle during the fault; send exactly one probe after restoration.
            # Channel errors are expected observations in T9, not runner failures.
            probe_after = time.monotonic()
            self.command(["device", "notification", "post", "--device", self.args.device,
                          "--name", "com.pmodular.webchannel.nettest.probe"], "recovery-probe")

            def recovered():
                self.observer.healthy(time.monotonic(), "wifi", allow_channel_failure=True)
                return terminal() or self.observer.probe_reply(probe_after)

            try:
                event = self.wait(recovered, self.args.probe_timeout, "post-restoration response or channel error")
                if event.get("kind") == "echo_reply":
                    self.milestone("restoredEcho", event)
                    self.result["channelObservation"] = "echo-resumed"
                    self.result["observedRestoreToEchoSeconds"] = device_interval(restored, event)
                else:
                    self.result["channelObservation"] = "channel-failed"
            except WaitTimeout:
                self.result["channelObservation"] = "no-recovery-observed"
        if terminal():
            self.milestone("channelTerminal", terminal())
            self.result["observedOfflineToTerminalSeconds"] = (
                terminal()["deviceUptimeSeconds"] - offline["deviceUptimeSeconds"])
        self.wired("device-after")
        self.result["outcome"] = "l3-observed"

    def finish(self):
        if self.observer:
            # Always drain already-received records, including on a disconnected console.
            try:
                self.observer.poll()
            except RuntimeError:
                pass
        if self.app and self.app.process.poll() is None:
            start = self.observer.latest("autorun_start")
            try:
                self.command(["device", "notification", "post", "--device", self.args.device,
                              "--name", "com.pmodular.webchannel.nettest.close"], "close")
                time.sleep(1)
                if start and start.get("pid"):
                    self.command(["device", "process", "terminate", "--device", self.args.device,
                                  "--pid", str(start["pid"])], "terminate")
                else:
                    raise RuntimeError("App PID was not received")
            except Exception as error:
                self.result["cleanupError"] = str(error)
            try:
                self.app.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                # devicectl forwards catchable signals to the app.
                self.app.process.terminate()
                try:
                    self.app.process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    self.app.process.kill()
                    self.app.process.wait(timeout=5)
        if self.app:
            self.app.thread.join(timeout=3)
            try:
                self.observer.poll()
            except RuntimeError:
                pass
        records = self.observer.records if self.observer else []
        self.result.update({"finishedUTC": utc(), "errorCodes": sorted(
            {r["code"] for r in records if r.get("kind") == "error"}),
            "openCount": sum(r.get("kind") == "open" for r in records),
            "lifecycleEvents": [r for r in records if r.get("kind") == "lifecycle"],
            "taskMetrics": [r for r in records if r.get("kind") == "task_metrics"]})
        (self.folder / "result.json").write_text(json.dumps(self.result, indent=2) + "\n")
        lines = ["# Human-operated Wi-Fi / cellular handoff", "",
                 f"Outcome: `{self.result['outcome']}` (observation, not a test-case pass).", "",
                 f"Requested hold: {self.args.hold:g} s from the observed cellular path.",
                 f"Observed interval to Wi-Fi restoration: {self.result.get('observedCellularPathSeconds', 'unavailable')} s.",
                 f"Error: {self.result.get('error', 'none')}", "",
                 "| Milestone | Device uptime (s) | Host receipt UTC |",
                 "| --- | --- | --- |"]
        for name, record in self.result["milestones"].items():
            lines.append(f"| {name} | {record.get('deviceUptimeSeconds', '')} | {record.get('hostReceivedUTC', '')} |")
        lines += ["", *["- " + note for note in self.result["timingNotes"]], "",
                  "See result.json for lifecycle, errors and task metrics; device-events.jsonl and",
                  "device-console.log retain app evidence; runner-events.jsonl records cues and operator readiness.",
                  "Interface use reported by NWPathMonitor is not per-request proof; correlate task metrics.",
                  "Human setting changes are never automatically reverted. Restore settings manually.", ""]
        (self.folder / "report.md").write_text("\n".join(lines))
        if self.scenario == "l3-idle":
            lines[0] = "# T9: human-operated network off / on"
            lines[4:6] = [f"Requested hold: {self.args.hold:g} s from the observed unsatisfied path.",
                          f"Observed offline interval: {self.result.get('observedOfflinePathSeconds', 'unavailable')} s.",
                          f"Channel observation: {self.result.get('channelObservation', 'unavailable')}."]
            (self.folder / "report.md").write_text("\n".join(lines))
        complete = self.result["outcome"] in ("handoff-observed", "l3-observed")
        self.status("complete" if complete else "interrupted")
        self.cue("試験を終了しました。Wi-Fi とモバイルデータ通信の設定を手動で確認・復元してください。",
                 "Funk" if complete else "Basso",
                 speech="試験終了です" if complete else "試験を中断しました")
        self.device_stream.close()
        self.journal.close()
        for process in self.audio:
            try:
                process.wait(timeout=3)
            except subprocess.TimeoutExpired:
                process.terminate()


def positive(value):
    number = float(value)
    if not math.isfinite(number) or number <= 0:
        raise argparse.ArgumentTypeError("Must be finite and greater than zero")
    return number


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--device", required=True, help="UDID or CoreDevice ID; wired transport required")
    parser.add_argument("--scenario", choices=("handoff", "l3-idle"), default="handoff",
                        help="Wi-Fi/cellular handoff or T9 idle network off/on")
    parser.add_argument("--output", required=True, type=Path, help="New output directory")
    parser.add_argument("--hold", type=positive, default=15, help="Seconds from observed fault path (default: 15)")
    parser.add_argument("--transition-timeout", type=positive, default=90)
    parser.add_argument("--probe-timeout", type=positive, default=30)
    parser.add_argument("--silent", action="store_true", help="Visual cues only")
    parser.add_argument("--no-speech", action="store_true", help="Play sounds without spoken instructions")
    args = parser.parse_args()
    if not sys.stdin.isatty():
        parser.error("Run in an interactive terminal for the readiness confirmation")
    args.output = args.output.resolve()
    args.output.mkdir(parents=True, exist_ok=False)
    runner = Runner(args)

    def interrupted(signum, frame):
        raise KeyboardInterrupt(f"signal {signum}")
    previous = signal.signal(signal.SIGTERM, interrupted)
    exit_code = 0
    try:
        runner.execute()
    except (Exception, KeyboardInterrupt) as error:
        runner.result["error"] = str(error) or type(error).__name__
        runner.event("interrupted", error=runner.result["error"])
        print("試験を中断: " + runner.result["error"], file=sys.stderr)
        exit_code = 1
    finally:
        signal.signal(signal.SIGTERM, signal.SIG_IGN)
        try:
            runner.finish()
        finally:
            signal.signal(signal.SIGTERM, previous)
    print("結果: " + str(args.output / "result.json"))
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
