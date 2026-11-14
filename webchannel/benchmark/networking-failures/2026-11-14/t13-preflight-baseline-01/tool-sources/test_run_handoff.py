"""Deterministic tests: no device, network changes, audio, or wall-clock delays."""
import importlib.util
import io
import json
from pathlib import Path
from tempfile import TemporaryDirectory
from types import SimpleNamespace
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("handoff", Path(__file__).with_name("run-handoff.py"))
handoff = importlib.util.module_from_spec(spec)
spec.loader.exec_module(handoff)


class Clock:
    now = 100.0

    def sleep(self, seconds):
        self.now += seconds

    def record(self, kind, at=None, **fields):
        at = self.now if at is None else at
        return {"kind": kind, "run": "test", "hostReceivedMonotonic": at,
                "deviceUptimeSeconds": at + 10000, "deviceUnixSeconds": at - 300,
                **fields}


def path(clock, interface, at=None):
    return clock.record("path", at, status="unsatisfied" if interface == "offline" else "satisfied", wifi=interface == "wifi",
                        cellular=interface == "cellular", wired=False)


class FakeCapture:
    def __init__(self, clock):
        self.clock = clock
        self.records = []
        self.process = SimpleNamespace(poll=lambda: None)
        self.thread = SimpleNamespace(join=lambda timeout: None)

    def snapshot(self):
        return sorted([r for r in self.records if r["hostReceivedMonotonic"] <= self.clock.now],
                      key=lambda r: r["hostReceivedMonotonic"])


class ObservationTests(unittest.TestCase):
    def setUp(self):
        self.clock = Clock()
        self.capture = FakeCapture(self.clock)
        self.observer = handoff.Observer(self.capture, "test", io.StringIO())

    def test_latest_path_and_post_cue_required(self):
        self.capture.records = [path(self.clock, "cellular", 98), path(self.clock, "wifi", 99)]
        self.observer.poll()
        self.assertIsNone(self.observer.on_path("cellular", 97))
        self.assertIsNone(self.observer.on_path("wifi", 100))
        self.assertIsNotNone(self.observer.on_path("wifi", 99))

    def test_foreground_and_fresh_heartbeat_required(self):
        self.capture.records = [path(self.clock, "cellular", 98),
                                self.clock.record("heartbeat", 99, applicationState=0)]
        self.observer.poll()
        self.observer.healthy(100, "cellular")
        with self.assertRaisesRegex(RuntimeError, "stale"):
            self.observer.healthy(106, "cellular")
        self.capture.records.append(self.clock.record(
            "lifecycle", 100, notification="UIApplicationWillResignActiveNotification"))
        self.observer.poll()
        self.assertFalse(self.observer.active(100))

    def test_probe_requires_new_send_and_matching_reply(self):
        self.capture.records = [self.clock.record("echo_sent", 98, token="old", message="NETTEST_PROBE"),
                                self.clock.record("echo_reply", 99, token="old"),
                                self.clock.record("echo_sent", 100, token="new", message="NETTEST_PROBE"),
                                self.clock.record("echo_reply", 100, token="unrelated")]
        self.observer.poll()
        self.assertIsNone(self.observer.probe_reply(100))
        self.capture.records.append(self.clock.record("echo_reply", token="new"))
        self.observer.poll()
        self.assertEqual(self.observer.probe_reply(100)["token"], "new")

    def test_other_run_ignored_and_clock_regression_rejected(self):
        self.capture.records = [{**path(self.clock, "wifi"), "run": "old"}]
        self.observer.poll()
        self.assertEqual(self.observer.records, [])
        with self.assertRaises(RuntimeError):
            handoff.device_interval(self.clock.record("path", 100), self.clock.record("path", 99))

    def test_brief_flap_not_hidden_by_latest_good_path(self):
        self.capture.records = [path(self.clock, "cellular", 97),
                                self.clock.record("heartbeat", 97, applicationState=0)]
        self.observer.poll()
        since = len(self.observer.records)
        self.capture.records += [path(self.clock, "wifi", 98), path(self.clock, "cellular", 99),
                                 self.clock.record("heartbeat", 100, applicationState=0)]
        self.observer.poll()
        with self.assertRaisesRegex(RuntimeError, "flapped"):
            self.observer.healthy(100, "cellular", since)

    def test_delayed_log_burst_does_not_hide_heartbeat_gap(self):
        self.capture.records = [path(self.clock, "cellular", 90),
                                self.clock.record("heartbeat", 90, applicationState=0)]
        self.observer.poll()
        since = len(self.observer.records)
        self.capture.records.append(self.clock.record("heartbeat", 100, applicationState=0))
        self.observer.poll()
        with self.assertRaisesRegex(RuntimeError, "gap"):
            self.observer.healthy(100, "cellular", since)


class WorkflowTests(unittest.TestCase):
    def workflow(self, folder, failure=None, scenario="handoff", traffic="idle", observe_after=0):
        clock = Clock()
        args = SimpleNamespace(output=Path(folder), device="fake", hold=2,
                               transition_timeout=5, probe_timeout=2, silent=True, scenario=scenario,
                               traffic=traffic, observe_after=observe_after)
        if scenario == "broken-cellular":
            args.cellular_proof = Path(folder) / "preflight-input.json"
            args.cellular_proof.write_text(json.dumps({
                "operatorCondition": {"interface": "cellular", "uplinkLossPercent": 100,
                                      "downlinkLossPercent": 100, "enabledReportedByOperator": True},
                "probes": [
                    {"requiredInterface": "wifi", "outcome": "http-response", "statusCode": 400,
                     "path": {"wifi": True, "cellular": False}},
                    {"requiredInterface": "cellular", "outcome": "timeout", "elapsedSeconds": 8,
                     "path": {"status": "satisfied", "wifi": False, "cellular": True}},
                ]}))
        runner = handoff.Runner(args)
        runner.run_id = "test"
        capture = FakeCapture(clock)
        capture.records = [clock.record("autorun_start", pid=123, controlProtocolVersion=2), path(clock, "wifi"),
                           clock.record("open")]
        capture.records += [clock.record("heartbeat", 100 + i / 10, applicationState=0)
                            for i in range(800)]
        if traffic == "streaming":
            capture.records.append(clock.record("app_log", 100.1,
                text="didReceiveMessage network-failure stream"))
        runner.wired = lambda name: None
        original_cue = runner.cue
        token = 0

        def command(parts, name):
            nonlocal token
            if "notification" in parts:
                token += 1
                if parts[-1].endswith(".send"):
                    if failure != "missing-write":
                        capture.records.append(clock.record("echo_sent", clock.now + .1,
                            token=str(token), message="network-failure pending write"))
                    return
                capture.records.append(clock.record("echo_sent", clock.now + .1,
                                                     token=str(token), message="NETTEST_PROBE"))
                if failure != "probe-timeout" and not (failure == "recovery-timeout" and runner.phase == "checking-recovery"):
                    capture.records.append(clock.record("echo_reply", clock.now + .2, token=str(token)))

        def cue(text, sound="Glass", speech=None):
            after = original_cue(text, sound, speech=speech)
            if runner.phase in ("awaiting-cellular", "awaiting-wifi", "awaiting-offline"):
                interface = {"awaiting-cellular": "cellular", "awaiting-offline": "offline",
                             "awaiting-wifi": "wifi"}[runner.phase]
                if failure != "no-path":
                    capture.records.append(path(clock, interface, clock.now + 1))
                if failure == "flap" and interface == "cellular":
                    capture.records.append(path(clock, "wifi", clock.now + 1.5))
                if failure == "background" and interface == "cellular":
                    capture.records.append(clock.record("lifecycle", clock.now + 1.5,
                        notification="UIApplicationDidEnterBackgroundNotification"))
                if failure == "channel-error" and (interface == "offline" or scenario == "broken-cellular"):
                    capture.records.append(clock.record("error", clock.now + 2, code=1))
            return after

        runner.command, runner.cue = command, cue
        with patch.object(handoff, "Capture", return_value=capture), \
                patch.object(handoff.time, "monotonic", side_effect=lambda: clock.now), \
                patch.object(handoff.time, "sleep", side_effect=clock.sleep), \
                patch("builtins.input", return_value=""), patch("sys.stdout", new=io.StringIO()):
            try:
                runner.execute()
            except RuntimeError as error:
                runner.result["error"] = str(error)
            finally:
                # Test report persistence too; do not signal a process.
                capture.process = SimpleNamespace(poll=lambda: 0)
                runner.finish()
        return json.loads((Path(folder) / "result.json").read_text())

    def test_complete_workflow_times_from_device_path_and_preserves_evidence(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder)
            self.assertEqual(result["outcome"], "handoff-observed")
            self.assertGreaterEqual(result["observedSecondsAtRestoreCue"], 2)
            self.assertLess(result["observedSecondsAtRestoreCue"], 2.2)
            self.assertGreater(result["observedCellularPathSeconds"], 3)
            self.assertEqual(result["openCount"], 1)
            self.assertIn("restoredEcho", result["milestones"])
            self.assertGreater(len((Path(folder) / "device-events.jsonl").read_text().splitlines()), 10)

    def test_plan_precedes_readiness_and_countdown_precedes_distinct_action_cues(self):
        with TemporaryDirectory() as folder:
            self.workflow(folder)
            events = [json.loads(line) for line in
                      (Path(folder) / "runner-events.jsonl").read_text().splitlines()]
            names = [e["event"] for e in events]
            self.assertLess(names.index("instructions"), names.index("operator_ready"))
            countdown = [e for e in events if e["event"] == "countdown"]
            self.assertEqual([e["remaining"] for e in countdown], [3, 2, 1])
            cues = [e for e in events if e["event"] == "cue"]
            self.assertEqual([e["sound"] for e in cues], ["Tink", "Glass", "Hero", "Funk"])
            cut = cues[1]
            self.assertGreaterEqual(cut["hostMonotonic"] - countdown[0]["hostMonotonic"], 3)
            self.assertEqual(cut["speech"], "Wi-Fi を切断してください")
            self.assertEqual(cues[2]["speech"], "Wi-Fi を戻してください")

    def test_missing_path_and_probe_never_advance(self):
        for failure in ("no-path", "probe-timeout"):
            with self.subTest(failure=failure), TemporaryDirectory() as folder:
                result = self.workflow(folder, failure)
                self.assertEqual(result["outcome"], "interrupted")
                self.assertIn("Timed out", result["error"])
                self.assertNotIn("restoredPath", result["milestones"])

    def test_flapping_or_background_during_hold_interrupts(self):
        for failure in ("flap", "background"):
            with self.subTest(failure=failure), TemporaryDirectory() as folder:
                result = self.workflow(folder, failure)
                self.assertEqual(result["outcome"], "interrupted")
                self.assertNotIn("restoredPath", result["milestones"])

    def test_wireless_transport_refused(self):
        with TemporaryDirectory() as folder:
            args = SimpleNamespace(output=Path(folder), silent=True, hold=2, device="fake")
            runner = handoff.Runner(args)
            runner.command = lambda parts, name: (Path(folder) / (name + ".json")).write_text(
                json.dumps({"result": {"connectionProperties": {
                    "transportType": "localNetwork", "tunnelState": "connected"}}}))
            try:
                with self.assertRaisesRegex(RuntimeError, "wired"):
                    runner.wired("device-before")
            finally:
                runner.device_stream.close()
                runner.journal.close()

    def test_l3_idle_no_sends_during_outage_and_resumes_after_restore(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, scenario="l3-idle")
            self.assertEqual(result["outcome"], "l3-observed")
            self.assertEqual(result["channelObservation"], "echo-resumed")
            self.assertGreaterEqual(result["observedSecondsAtRestoreCue"], 2)
            self.assertGreater(result["observedOfflinePathSeconds"], 3)
            records = [json.loads(line) for line in (Path(folder) / "device-events.jsonl").read_text().splitlines()]
            probes = [r for r in records if r.get("kind") == "echo_sent"]
            self.assertEqual(len(probes), 2)
            self.assertGreater(probes[-1]["deviceUptimeSeconds"], result["milestones"]["restoredPath"]["deviceUptimeSeconds"])

    def test_l3_channel_failure_is_an_observation_not_infrastructure_failure(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, failure="channel-error", scenario="l3-idle")
            self.assertEqual(result["outcome"], "l3-observed")
            self.assertEqual(result["channelObservation"], "channel-failed")
            self.assertEqual(result["errorCodes"], [1])
            self.assertNotIn("restoredEcho", result["milestones"])
            self.assertIn("restoredPath", result["milestones"])

    def test_l3_unanswered_recovery_probe_is_preserved(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, failure="recovery-timeout", scenario="l3-idle")
            self.assertEqual(result["outcome"], "l3-observed")
            self.assertEqual(result["channelObservation"], "no-recovery-observed")

    def test_t10_submits_once_after_offline_and_records_abort_from_both_origins(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, failure="channel-error", scenario="l3-pending")
            self.assertEqual(result["scenario"], "T10-l3-pending")
            self.assertEqual(result["outcome"], "l3-observed")
            self.assertEqual(result["channelObservation"], "channel-failed")
            self.assertGreater(result["observedOfflineToPendingWriteSeconds"], 0)
            self.assertGreater(result["observedPendingWriteToTerminalSeconds"], 0)
            records = [json.loads(line) for line in (Path(folder) / "device-events.jsonl").read_text().splitlines()]
            self.assertEqual(sum(x.get("message") == "network-failure pending write" for x in records), 1)

    def test_t10_missing_submission_does_not_count_as_a_valid_trial(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, failure="missing-write", scenario="l3-pending")
            self.assertEqual(result["outcome"], "interrupted")
            self.assertNotIn("pendingWrite", result["milestones"])

    def test_t11_runs_three_cycles_and_sends_no_probes_between_flaps(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, scenario="l3-flap")
            self.assertEqual(result["outcome"], "l3-observed")
            self.assertEqual(result["channelObservation"], "echo-resumed")
            self.assertEqual(len(result["cycles"]), 3)
            records = [json.loads(line) for line in (Path(folder) / "device-events.jsonl").read_text().splitlines()]
            self.assertEqual(sum(x.get("kind") == "echo_sent" for x in records), 2)

    def test_t11_keeps_cueing_after_channel_failure(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, scenario="l3-flap", failure="channel-error")
            self.assertEqual(result["channelObservation"], "channel-failed")
            self.assertEqual(result["outcome"], "l3-observed")
            self.assertEqual(len(result["cycles"]), 3)
            self.assertIn("restoredPath3", result["milestones"])

    def test_streaming_handoff_waits_for_delivery_and_observes_restored_requests(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, traffic="streaming", observe_after=12)
            self.assertEqual(result["outcome"], "handoff-observed")
            self.assertIn("baselineStream", result["milestones"])
            self.assertEqual(result["traffic"], "streaming")
            self.assertEqual(result["postRestoreProbeCount"], 2)
            self.assertGreaterEqual(result["observedPostRestoreHostSeconds"], 12)

    def test_idle_baseline_observes_without_app_sends_or_fault_cues(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, scenario="idle")
            self.assertEqual(result["scenario"], "M1-idle")
            self.assertEqual(result["outcome"], "idle-observed")
            self.assertGreaterEqual(result["observedIdleSeconds"], 2)
            events = [json.loads(line) for line in (Path(folder) / "device-events.jsonl").read_text().splitlines()]
            self.assertFalse(any(e.get("kind") == "echo_sent" for e in events))
            journal = [json.loads(line) for line in (Path(folder) / "runner-events.jsonl").read_text().splitlines()]
            self.assertEqual([e["sound"] for e in journal if e["event"] == "cue"], ["Funk"])

    def test_t13_accepts_available_cellular_loss_and_records_channel_failure(self):
        with TemporaryDirectory() as folder:
            result = self.workflow(folder, scenario="broken-cellular", failure="channel-error")
            self.assertEqual(result["scenario"], "T13-broken-cellular")
            self.assertEqual(result["outcome"], "l3-observed")
            self.assertEqual(result["channelObservation"], "channel-failed")
            self.assertEqual(result["milestones"]["cellularFaultPath"]["status"], "satisfied")
            self.assertIn("observedBrokenCellularPathSeconds", result)
            self.assertNotIn("observedOfflinePathSeconds", result)

    def test_t13_rejects_a_cellular_path_that_is_down_in_preflight(self):
        with self.assertRaises(ValueError):
            handoff.validate_cellular_proof({"probes": [
                {"requiredInterface": "wifi", "outcome": "http-response", "path": {"wifi": True}},
                {"requiredInterface": "cellular", "outcome": "timeout", "path": {"status": "unsatisfied"}},
            ]})


if __name__ == "__main__":
    unittest.main()
