#!/usr/bin/env python3
"""Read Apple qlog events; never infer PING frames from encrypted packet sizes."""
import argparse
from collections import Counter
import json
from pathlib import Path
import re


def load_trace(path):
    text = path.read_text()
    try:
        return json.loads(text), True
    except json.JSONDecodeError:
        # A process exit can leave the closing JSON delimiters unwritten. Retain
        # only complete event arrays, without inventing or repairing an event.
        match = re.search(r'"events"\s*:\s*\[', text)
        if not match:
            raise ValueError('No qlog event array')
        prefix = text[:match.start()]
        units = re.search(r'"time_units"\s*:\s*"(\w+)"', prefix)
        fields = re.search(r'"event_fields"\s*:\s*(\[[^\]]*\])', prefix)
        decoder, events, offset = json.JSONDecoder(), [], match.end()
        while offset < len(text):
            while offset < len(text) and text[offset] in ' \r\n\t,':
                offset += 1
            try:
                event, end = decoder.raw_decode(text, offset)
            except json.JSONDecodeError:
                break
            if not isinstance(event, list):
                break
            events.append(event)
            offset = end
        if not events or not fields or not units:
            raise ValueError('Incomplete qlog lacks required metadata/events')
        return {'traces': [{'configuration': {'time_units': units[1]},
                            'event_fields': json.loads(fields[1]), 'events': events}]}, False


def analyze(path):
    document, complete = load_trace(path)
    results = []
    for index, trace in enumerate(document.get('traces', [])):
        units = trace.get('configuration', {}).get('time_units')
        scale = {'us': 1e6, 'ms': 1e3, 's': 1}.get(units)
        if scale is None:
            raise ValueError('Unrecognized qlog time units: ' + str(units))
        fields = [f.lower() for f in trace['event_fields']]
        decoded = [dict(zip(fields, event)) for event in trace['events']]
        if not decoded:
            continue
        origin = float(decoded[0]['time'])
        parameters, sent, received, packet_counts = [], [], [], Counter()
        frame_counts = Counter()
        for event in decoded:
            name = event.get('event_type', event.get('event', '')).lower()
            data = event.get('data', {})
            if name == 'parameters_set':
                parameters.append({'owner': data.get('owner'),
                                   'maxIdleTimeoutMs': data.get('max_idle_timeout'),
                                   'seconds': (float(event['time']) - origin) / scale})
            if name not in ('packet_sent', 'packet_received'):
                continue
            packet_counts[name] += 1
            frames = [str(f.get('frame_type', '')).lower() for f in data.get('frames', [])]
            if name == 'packet_sent':
                frame_counts.update(frames)
            if 'ping' in frames:
                record = {'seconds': (float(event['time']) - origin) / scale,
                          'packetType': data.get('packet_type')}
                (sent if name == 'packet_sent' else received).append(record)
        times = [r['seconds'] for r in sent]
        results.append({'file': path.name, 'traceIndex': index, 'completeJSON': complete,
                        'flow': trace.get('vantage_point', {}).get('flow', 'not-recorded'),
                        'timeUnits': units, 'parsedEvents': len(decoded),
                        'observedTraceSeconds': (float(decoded[-1]['time']) - origin) / scale,
                        'transportParameters': parameters,
                        'sentPingPackets': sent, 'receivedPingPackets': received,
                        'sentPingIntervalsSeconds': [b-a for a,b in zip(times,times[1:])],
                        'packetCounts': dict(packet_counts), 'sentFrameCounts': dict(frame_counts),
                        'limits': ['Times are relative within this qlog, not host/device UTC.',
                                   'Incomplete JSON yields only fully parsed events; absence is limited to retained events.',
                                   'Use app/task evidence to identify the measured connection and idle observation.']})
    return results


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    rows = [row for path in sorted(args.directory.rglob('*.qlog')) for row in analyze(path)]
    args.output.write_text(json.dumps(rows, indent=2)+'\n')
    print(f'Analyzed {len(rows)} qlog traces; frame types read directly from qlog.')


if __name__ == '__main__':
    main()
