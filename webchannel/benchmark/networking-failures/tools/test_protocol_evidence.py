"""Reject h2 fallback and missing metrics as HTTP/3 test evidence."""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('network_protocol', Path(__file__).with_name('run-network-failures.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ProtocolTests(unittest.TestCase):
    def evidence(self, *protocols):
        return module.protocol_evidence([{'kind': 'task_metrics', 'transactions': [
            {'protocol': p} for p in protocols]}])

    def test_h3_requires_positive_evidence_and_no_known_fallback(self):
        self.assertFalse(self.evidence()['h3ObservedWithoutKnownFallback'])
        self.assertFalse(self.evidence('unknown')['h3ObservedWithoutKnownFallback'])
        self.assertFalse(self.evidence('h2')['h3ObservedWithoutKnownFallback'])
        self.assertFalse(self.evidence('h3', 'h2')['h3ObservedWithoutKnownFallback'])
        evidence = self.evidence('h3', 'unknown')
        self.assertTrue(evidence['h3ObservedWithoutKnownFallback'])
        self.assertEqual(evidence['unknownTransactions'], 1)

    def test_default_environment_stays_unchanged(self):
        self.assertEqual(module.experiment_environment(), {})
        env = module.experiment_environment(True)
        self.assertEqual(env['NETTEST_ENDPOINT'], module.HTTP3_ENDPOINT)
        self.assertEqual(env['NETTEST_HTTP3'], '1')

    def test_baseline_h2_is_rejected_before_faults(self):
        class Capture:
            def wait_for(self, predicate, timeout):
                event = {'kind': 'task_metrics', 'transactions': [{'method': 'POST', 'protocol': 'h2'}]}
                assert predicate(event)
                return event
        with self.assertRaisesRegex(RuntimeError, 'no fault applied'):
            module.require_h3_baseline(Capture())


if __name__ == '__main__':
    unittest.main()
