"""Deterministic T15 outcome classification; no phone, UI, or network operations."""
import importlib.util
import os
from pathlib import Path
import unittest

path = Path(os.environ.get('SUSPENSION_CONTROLLER', Path(__file__).with_name('run-suspension.py')))
spec = importlib.util.spec_from_file_location('suspension', path)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ResumeTests(unittest.TestCase):
    def test_expected_terminal_error_needs_no_probe(self):
        error = {'kind': 'error', 'code': 4}
        result = module.resume_observation([error, {'kind': 'closed'}], 100)
        self.assertEqual(result['observation'], 'channel-failed')
        self.assertEqual(result['terminal'], error)

    def test_only_fresh_matching_echo_satisfies_recovery(self):
        records = [
            {'kind': 'echo_sent', 'message': 'NETTEST_PROBE', 'token': 'old', 'hostReceivedMonotonic': 90},
            {'kind': 'echo_reply', 'token': 'old', 'hostReceivedMonotonic': 91},
            {'kind': 'echo_sent', 'message': 'NETTEST_PROBE', 'token': 'new', 'hostReceivedMonotonic': 101},
            {'kind': 'echo_reply', 'token': 'other', 'hostReceivedMonotonic': 102},
        ]
        self.assertIsNone(module.resume_observation(records, 100))
        records.append({'kind': 'echo_reply', 'token': 'new', 'hostReceivedMonotonic': 103})
        self.assertEqual(module.resume_observation(records, 100)['observation'], 'echo-resumed')
        records.append({'kind': 'error', 'code': 1})
        self.assertEqual(module.resume_observation(records, 100)['observation'], 'channel-failed')


class StateEvidenceTests(unittest.TestCase):
    def records(self):
        return [{'event': 'suspension_hold_started', 'applicationState': 2, 'deviceUptimeSeconds': 100},
                {'event': 'suspension_hold_observed', 'applicationState': 2, 'deviceUptimeSeconds': 101},
                {'event': 'suspension_hold_complete', 'applicationState': 2, 'deviceUptimeSeconds': 102}]

    def test_os_sampled_hold(self):
        self.assertEqual(module.validate_suspension(self.records(), 2)[2:], (2, 1))

    def test_missing_suspension_wakeup_and_short_hold_rejected(self):
        for mode in ('missing', 'background', 'short', 'duplicate'):
            records = self.records()
            if mode == 'missing': records = records[1:]
            if mode == 'background': records[1]['applicationState'] = 3
            if mode == 'short': records[-1]['deviceUptimeSeconds'] = 101.5
            if mode == 'duplicate': records += self.records()
            with self.subTest(mode=mode), self.assertRaises(RuntimeError):
                module.validate_suspension(records, 2)

    def test_sample_gap_and_clock_regression_rejected(self):
        for uptime in (99, 105):
            records = self.records()
            records[1]['deviceUptimeSeconds'] = uptime
            with self.subTest(uptime=uptime), self.assertRaises(RuntimeError):
                module.validate_suspension(records, 2)


if __name__ == '__main__':
    unittest.main()
