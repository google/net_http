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
        self.traffic = getattr(args, "traffic", "idle")
        self.observe_after = getattr(args, "observe_after", 0)
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
        self.result.update(traffic=self.traffic, requestedPostRestoreObservationSeconds=self.observe_after)
        if self.scenario.startswith("l3-"):
            self.result["scenario"] = {"l3-idle": "T9-l3-idle", "l3-pending": "T10-l3-pending",
                                       "l3-flap": "T11-l3-flap"}[self.scenario]
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
        if self.scenario.startswith("l3-"):
            text = (
                f"{self.result['scenario'].split('-')[0]}: Wi-Fi を ON、モバイルデータ通信を OFF にして準備してください。\n"
                "確認音ではまだ Wi-Fi を切断しないでください。\n"
                "1回目の操作音（Glass）＋『Wi-Fi を切断してください』:\n"
                "  Wi-Fi を切断し、すぐ試験アプリへ戻る。モバイルデータ通信は OFF のまま。\n"
                f"ネットワークなしの観測から約 {self.args.hold:g} 秒後、復旧音（Hero）\n"
                "＋『Wi-Fi を戻してください』: Wi-Fi を ON に戻し、すぐアプリへ戻る。\n"
                "終了音（Funk）で操作終了。中断音（Basso）なら設定を手動で復元。\n"
                "接続準備後、3・2・1 を表示して操作音を鳴らします。AI の追加案内は不要です。\n"
                "モバイルデータ通信 OFF のダイアログが出たら閉じ、すぐアプリへ戻ってください。")
            if self.scenario == "l3-flap":
                text += ("\n今回は切断・復旧を3往復します。復旧後もアプリで待ち、次の切断音に従ってください。\n"
                         f"各切断は観測から約 {self.args.hold:g} 秒、各復旧後は準備確認から5秒待ちます。\n"
                         "終了音が鳴るまで、エラー表示になっても手動で再接続しないでください。")
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
        if self.traffic == "streaming":
            text += "\n今回は1秒間隔の連続受信を自動で開始します。送信ボタンは操作しないでください。"
        if self.observe_after:
            text += f"\nWi-Fi 復旧後も約 {self.observe_after:g} 秒、終了音までアプリで待ってください。追加操作は不要です。"
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

    def probe(self, interface, tag=None):
        self.observer.poll()
        self.observer.healthy(time.monotonic(), interface, self.guard_cursor)
        after = time.monotonic()
        self.command(["device", "notification", "post", "--device", self.args.device,
                      "--name", "com.pmodular.webchannel.nettest.probe"], (tag or self.phase) + "-probe")

        def reply():
            self.observer.healthy(time.monotonic(), interface, self.guard_cursor)
            return self.observer.probe_reply(after)
        return self.wait(reply, self.args.probe_timeout, "matching echo reply")

    def execute(self):
        self.wired("device-before")
        self.status("operator-ready")
        self.instructions()
        setup = ("Wi-Fi を ON、モバイルデータ通信を OFF にしてください。"
                 if self.scenario.startswith("l3-") else "Wi-Fi とモバイルデータ通信を ON にしてください。")
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
               "NETTEST_TRAFFIC": "pending" if self.scenario == "l3-pending" else self.traffic, "NETTEST_FAILFAST": "0"}
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
        if self.traffic == "streaming":
            self.milestone("baselineStream", self.wait(
                lambda: next((r for r in self.observer.records if r.get("kind") == "app_log"
                              and "didReceiveMessage" in r.get("text", "")
                              and "network-failure stream" in r.get("text", "")), None),
                20, "baseline streaming delivery"))
        if self.scenario == "l3-flap":
            return self.flapping()
        if self.scenario.startswith("l3-"):
            return self.l3()
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
        if self.observe_after:
            self.observe_restored()
        self.wired("device-after")
        self.result["outcome"] = "handoff-observed"

    def observe_restored(self):
        self.status("observing-restored-wifi")
        started = time.monotonic()
        next_probe = started + 5
        count = 0
        print(f"Wi-Fi 復帰後の観測を {self.observe_after:g} 秒続けます。終了音までアプリで待ってください。", flush=True)
        while time.monotonic() < started + self.observe_after:
            self.observer.poll()
            if not self.observer.active(time.monotonic()):
                raise RuntimeError("App inactive or heartbeat stale during post-restoration observation")
            if self.observer.latest("error") or self.observer.latest("closed"):
                self.result["postRestoreObservation"] = "channel-failed"
                break
            if time.monotonic() >= next_probe and self.observer.on_path("wifi", 0):
                count += 1
                self.milestone(f"postRestoreProbe{count}", self.probe("wifi", tag=f"postrestore-{count}"))
                next_probe = time.monotonic() + 5
            time.sleep(.1)
        self.result["observedPostRestoreHostSeconds"] = time.monotonic() - started
        self.result["postRestoreProbeCount"] = count
        self.event("post_restore_observation_end", probes=count)

    def flapping(self):
        self.result["cycles"] = []
        self.result["wifiHoldSeconds"] = 5
        self.countdown()

        def hold(interface, origin, seconds):
            cursor = len(self.observer.records)

            def elapsed():
                self.observer.healthy(time.monotonic(), interface, cursor,
                                      allow_channel_failure=True)
                heartbeat = self.observer.latest("heartbeat")
                return heartbeat if device_interval(origin, heartbeat) >= seconds else None

            return self.wait(elapsed, seconds + 10, interface + " hold")

        for cycle in range(1, 4):
            self.status("awaiting-offline")
            after = self.cue(f"{cycle}/3回目: Wi-Fi を切断し、すぐアプリへ戻ってください。",
                             "Glass", speech="Wi-Fi を切断してください")
            offline = self.milestone(f"offlinePath{cycle}", self.path("offline", after))
            self.status("holding-offline")
            end = hold("offline", offline, self.args.hold)
            self.milestone(f"holdComplete{cycle}", end)
            self.status("awaiting-wifi")
            after = self.cue(f"{cycle}/3回目: Wi-Fi を ON に戻し、すぐアプリへ戻ってください。",
                             "Hero", speech="Wi-Fi を戻してください")
            restored = self.milestone(f"restoredPath{cycle}", self.path("wifi", after))
            self.result["cycles"].append({"cycle": cycle,
                "observedSecondsAtRestoreCue": device_interval(offline, end),
                "observedOfflinePathSeconds": device_interval(offline, restored)})
            if cycle < 3:
                self.status("holding-wifi")
                # Start from current foreground readiness, not an older path callback.
                hold("wifi", self.observer.latest("heartbeat"), 5)
        self.status("checking-recovery")
        self.observer.poll()
        terminal = next((r for r in self.observer.records if r.get("kind") in ("error", "closed")), None)
        if terminal:
            self.milestone("channelTerminal", terminal)
            first = self.result["milestones"]["offlinePath1"]
            self.result["observedFirstOfflineToTerminalSeconds"] = (
                terminal["deviceUptimeSeconds"] - first["deviceUptimeSeconds"])
            self.result["channelObservation"] = "channel-failed"
        else:
            try:
                self.milestone("restoredEcho", self.probe("wifi"))
                self.result["channelObservation"] = "echo-resumed"
            except WaitTimeout:
                self.result["channelObservation"] = "no-recovery-observed"
            except RuntimeError:
                self.observer.poll()
                if not (self.observer.latest("error") or self.observer.latest("closed")):
                    raise
                self.result["channelObservation"] = "channel-failed"
        self.wired("device-after")
        self.result["outcome"] = "l3-observed"

    def l3(self):
        self.countdown()
        self.status("awaiting-offline")
        after = self.cue("Wi-Fi を切断してください。モバイルデータ通信は OFF のまま、すぐ試験アプリへ戻ってください。",
                         "Glass", speech="Wi-Fi を切断してください")
        offline = self.milestone("offlinePath", self.path("offline", after))
        self.guard_cursor = len(self.observer.records)
        self.status("holding-offline")
        if self.scenario == "l3-pending":
            if self.observer.latest("error") or self.observer.latest("closed"):
                raise RuntimeError("Channel terminated before the pending write; not a valid T10 trial")
            after_send = time.monotonic()
            self.command(["device", "notification", "post", "--device", self.args.device,
                          "--name", "com.pmodular.webchannel.nettest.send"], "pending-send")

            def submitted():
                self.observer.healthy(time.monotonic(), "offline", self.guard_cursor,
                                      allow_channel_failure=True)
                record = next((r for r in self.observer.records
                               if r.get("kind") == "echo_sent"
                               and r.get("message") == "network-failure pending write"
                               and r["hostReceivedMonotonic"] >= after_send), None)
                if record is None and (self.observer.latest("error") or self.observer.latest("closed")):
                    raise RuntimeError("Channel terminated before the pending write; not a valid T10 trial")
                return record

            pending = self.milestone("pendingWrite", self.wait(submitted, 10, "pending write submission"))
            self.result["observedOfflineToPendingWriteSeconds"] = device_interval(offline, pending)

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
            # Send exactly one probe after restoration if the channel is still open.
            # Channel errors are test observations, not runner failures.
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
            pending = self.result["milestones"].get("pendingWrite")
            if pending:
                self.result["observedPendingWriteToTerminalSeconds"] = (
                    terminal()["deviceUptimeSeconds"] - pending["deviceUptimeSeconds"])
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
        if self.scenario.startswith("l3-"):
            case = self.result["scenario"].split("-")[0]
            lines[0] = f"# {case}: human-operated network off / on"
            lines[4:6] = [f"Requested hold: {self.args.hold:g} s from the observed unsatisfied path.",
                          f"Observed offline interval: {self.result.get('observedOfflinePathSeconds', 'unavailable')} s.",
                          f"Channel observation: {self.result.get('channelObservation', 'unavailable')}."]
            if self.scenario == "l3-flap":
                lines[5] = "Observed per-cycle intervals are recorded in result.json under cycles."
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
    parser.add_argument("--scenario", choices=("handoff", "l3-idle", "l3-pending", "l3-flap"), default="handoff",
                        help="Wi-Fi/cellular handoff, T9 idle, T10 pending-write, or T11 three-cycle flapping")
    parser.add_argument("--output", required=True, type=Path, help="New output directory")
    parser.add_argument("--traffic", choices=("idle", "streaming"), default="idle",
                        help="Handoff traffic; streaming sends one server message per second")
    parser.add_argument("--observe-after", type=positive, default=0,
                        help="Extra seconds after restored echo; probe every 5 s (handoff only)")
    parser.add_argument("--hold", type=positive, default=15, help="Seconds from observed fault path (default: 15)")
    parser.add_argument("--transition-timeout", type=positive, default=90)
    parser.add_argument("--probe-timeout", type=positive, default=30)
    parser.add_argument("--silent", action="store_true", help="Visual cues only")
    parser.add_argument("--no-speech", action="store_true", help="Play sounds without spoken instructions")
    args = parser.parse_args()
    if args.scenario != "handoff" and (args.traffic != "idle" or args.observe_after):
        parser.error("--traffic streaming and --observe-after are supported only for handoff")
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
