import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('qlog_analysis', Path(__file__).with_name('analyze-quic-qlog.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class QlogTests(unittest.TestCase):
    def document(self):
        return {'traces': [{'configuration': {'time_units': 'us'},
            'event_fields': ['time','CATEGORY','EVENT_TYPE','DATA'],
            'vantage_point': {'flow':'client'}, 'events': [
                [1000000,'TRANSPORT','PARAMETERS_SET',{'owner':'local','max_idle_timeout':30000}],
                [2000000,'TRANSPORT','PACKET_SENT',{'frames':[{'frame_type':'ping'}],'packet_type':'1RTT'}],
                [3000000,'TRANSPORT','PACKET_RECEIVED',{'frames':[{'frame_type':'ping'}]}],
                [7000000,'TRANSPORT','PACKET_SENT',{'frames':[{'frame_type':'ping'},{'frame_type':'ack'}]}]]}]}

    def test_parameters_and_ping_direction_and_units(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'trace.qlog';p.write_text(json.dumps(self.document()))
            r=module.analyze(p)[0]
        self.assertEqual(r['transportParameters'][0]['maxIdleTimeoutMs'],30000)
        self.assertEqual(r['sentPingIntervalsSeconds'],[5])
        self.assertEqual(len(r['receivedPingPackets']),1)
        self.assertTrue(r['completeJSON'])

    def test_truncated_tail_does_not_create_a_ping(self):
        text=json.dumps(self.document());marker=text.rfind('7000000');text=text[:marker]+'700'
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'partial.qlog';p.write_text(text)
            r=module.analyze(p)[0]
        self.assertFalse(r['completeJSON'])
        self.assertEqual(len(r['sentPingPackets']),1)


if __name__ == '__main__':
    unittest.main()
