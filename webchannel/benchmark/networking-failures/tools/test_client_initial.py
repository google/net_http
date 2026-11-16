import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('client_initial', Path(__file__).with_name('analyze-client-initial.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def records(params):
    extension = b'\x00\x39' + len(params).to_bytes(2, 'big') + params
    body = b'\x03\x03' + bytes(32) + b'\x00\x00\x02\x13\x01\x01\x00' + len(extension).to_bytes(2, 'big') + extension
    hello = b'\x01' + len(body).to_bytes(3, 'big') + body
    return [{'dcid': 'abcd', 'verifiedAEAD': True, 'crypto': [
        {'offset': 20, 'hex': hello[20:].hex()},
        {'offset': 0, 'hex': hello[:25].hex()}]}]


class ClientInitialTests(unittest.TestCase):
    def test_fragment_overlap_and_idle_milliseconds(self):
        result = module.analyze(records(bytes.fromhex('010480007530')))
        self.assertEqual(result['clientMaxIdleTimeoutMilliseconds'], 30000)
        self.assertTrue(result['clientMaxIdleTimeoutPresent'])

    def test_absent_is_default_zero_not_measurement(self):
        result = module.analyze(records(bytes.fromhex('090108')))
        self.assertFalse(result['clientMaxIdleTimeoutPresent'])
        self.assertIsNone(result['clientMaxIdleTimeoutMilliseconds'])
        self.assertEqual(result['clientMaxIdleTimeoutDefaultMilliseconds'], 0)

    def test_reject_missing_or_conflicting_fragments(self):
        r = records(b'')
        r[0]['crypto'][1]['hex'] = 'ff'
        with self.assertRaises(ValueError):
            module.analyze(r)
        r = records(b'')
        r[0]['crypto'].append({'offset': 20, 'hex': 'ff'})
        with self.assertRaisesRegex(ValueError, 'conflicting'):
            module.analyze(r)

    def test_reject_mixed_connection_and_unauthenticated_data(self):
        r = records(b'')
        other = records(b'')[0]
        other['dcid'] = 'other'
        with self.assertRaises(ValueError):
            module.analyze(r + [other])
        r[0]['verifiedAEAD'] = False
        with self.assertRaises(ValueError):
            module.analyze(r)

    def test_reject_duplicate_and_truncated_parameter(self):
        for params in (bytes.fromhex('090108090108'), bytes.fromhex('01048000')):
            with self.assertRaises(ValueError):
                module.analyze(records(params))


if __name__ == '__main__':
    unittest.main()
