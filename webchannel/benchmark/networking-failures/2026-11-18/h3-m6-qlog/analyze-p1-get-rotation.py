#!/usr/bin/env python3
"""Analyze P1 using hash-matched original Apple qlogs and published app events."""
import argparse
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import parse_qs, urlsplit


def merged_ranges(ranges):
    result = []
    for start, end in sorted(ranges):
        if end < start:
            raise ValueError('Negative STREAM length')
        if result and start <= result[-1][1]:
            result[-1][1] = max(result[-1][1], end)
        else:
            result.append([start, end])
    return result


def query(event):
    return {k: values[0] for k, values in parse_qs(
        urlsplit(event.get('url', '')).query).items()}


def analyze(folder, original):
    document = json.loads(original.read_text())
    if len(document['traces']) != 1:
        raise ValueError('Expected one trace')
    trace = document['traces'][0]
    if trace['vantage_point'].get('flow') != 'client':
        raise ValueError('Expected a client trace')
    scale = {'us': 1e6, 'ms': 1e3, 's': 1}[trace['configuration']['time_units']]
    fields = [x.lower() for x in trace['event_fields']]
    events = [dict(zip(fields, row)) for row in trace['events']]
    origin = float(events[0]['time'])
    frames, request_starts = [], {}
    for index, event in enumerate(events):
        kind = event['event_type'].lower()
        if kind not in ('packet_received', 'packet_sent'):
            continue
        data = event['data']
        seconds = (float(event['time']) - origin) / scale
        for frame in data.get('frames', []):
            stream = int(frame.get('stream_id', -1))
            if kind == 'packet_sent' and frame['frame_type'] == 'stream' and stream % 4 == 0:
                request_starts.setdefault(stream, seconds)
            if stream == 4:
                frames.append({'sourceEventIndex': index, 'seconds': seconds,
                               'direction': kind, 'packetType': data.get('packet_type'),
                               'packetNumber': data.get('header', {}).get('packet_number'),
                               'frame': frame})
    inbound = [e for e in frames if e['direction'] == 'packet_received']
    stream_frames = [e for e in inbound if e['frame']['frame_type'] == 'stream']
    resets = [e for e in inbound if e['frame']['frame_type'] == 'reset_stream']
    stops = [e for e in inbound if e['frame']['frame_type'] == 'stop_sending']
    if not resets:
        raise ValueError('No peer RESET_STREAM on stream 4')
    ranges = merged_ranges([(int(e['frame']['offset']),
                             int(e['frame']['offset']) + int(e['frame']['length']))
                            for e in stream_frames])
    final_sizes = sorted({int(e['frame']['final_size']) for e in resets})
    app = [json.loads(line) for line in (folder/'events.jsonl').read_text().splitlines()]
    opened = next(e['deviceUptimeSeconds'] for e in app if e['kind'] == 'open')
    errors = [e for e in app if e['kind'] == 'transport_error'
              and e.get('domain') == 'NSURLErrorDomain' and e.get('code') == -1017]
    if len(errors) != 1:
        raise ValueError('Expected one -1017')
    error = errors[0]
    following = [e for e in app if e['deviceUptimeSeconds'] >= error['deviceUptimeSeconds']]
    completed = next(e for e in following if e['kind'] == 'http_state'
                     and e.get('readyState') == 3 and e.get('url') == error['url'])
    sdk_complete = next(e for e in following if e['kind'] == 'sdk_debug'
                        and e.get('text') == 'Request Complete.')
    next_get = next(e for e in following if e['kind'] == 'http3_request'
                    and e.get('method') == 'GET')
    next_log = next(e for e in following if e['kind'] == 'http_log'
                    and '[HTTP Req]' in e.get('text', '') and next_get['url'] in e['text'])
    attempt = int(re.search(r'\[attempt (\d+)\]', next_log['text'])[1])
    old_query, new_query = query(error), query(next_get)
    body_logs = [e['text'].split(': ', 1)[1] for e in app
                 if e['kind'] == 'http_log' and '[HTTP Resp Body] (rpc): ' in e.get('text', '')
                 and opened <= e['deviceUptimeSeconds'] < error['deviceUptimeSeconds']]
    relevant = []
    for e in app:
        seconds = e['deviceUptimeSeconds'] - opened
        if not error['deviceUptimeSeconds']-opened-.01 <= seconds <= next_log['deviceUptimeSeconds']-opened+.001:
            continue
        if e['kind'] in ('transport_error', 'http_state', 'http3_request'):
            item = {k:e[k] for k in ('kind','method','domain','code','readyState','status','attempt') if k in e}
            item['query'] = {k:v for k,v in query(e).items() if k in ('RID','AID','t')}
        elif e['kind'] == 'sdk_debug':
            item = {'kind':e['kind'], 'text':e['text']}
        elif e is next_log:
            item = {'kind':'http_request_log','attempt':attempt}
        else:
            continue
        relevant.append({'secondsAfterOpen':seconds, **item})
    first_reset = resets[0]['seconds']
    delta_ms = lambda a,b:(a['deviceUptimeSeconds']-b['deviceUptimeSeconds'])*1000
    return {
        'run':folder.name, 'sourceSHA256':hashlib.sha256(original.read_bytes()).hexdigest(),
        'qlogTimeOrigin':'first qlog event; separate from app open time',
        'streamMapping':'Request order and timing: stream 0 handshake POST; stream 4 first GET; stream 8 next GET. No decoded HTTP/3 headers in qlog.',
        'clientRequestStreamStarts':request_starts,
        'responseStream':4, 'peerStreamFrames':frames,
        'uniqueReceivedRanges':ranges,
        'uniqueReceivedStreamBytes':sum(b-a for a,b in ranges),
        'receivedStreamFrameLengthSumIncludingDuplicates':sum(int(e['frame']['length']) for e in stream_frames),
        'peerResponseFinCount':sum(str(e['frame'].get('fin','')).lower() == 'true' for e in stream_frames),
        'peerResetCountIncludingRepeatedFrames':len(resets),
        'peerResetErrorCodes':sorted({int(e['frame']['error_code']) for e in resets}),
        'peerStopSendingCountIncludingRepeatedFrames':len(stops),
        'peerStopSendingErrorCodes':sorted({int(e['frame']['error_code']) for e in stops}),
        'peerResetFinalSizes':final_sizes,
        'firstResetQlogSeconds':first_reset,
        'requestToResetSeconds':first_reset-request_starts[4],
        'resetToNextRequestStreamMs':(request_starts[8]-first_reset)*1000,
        'appErrorSecondsAfterOpen':error['deviceUptimeSeconds']-opened,
        'errorToNextRequestCreationMs':delta_ms(next_get,error),
        'errorToNextRequestLogMs':delta_ms(next_log,error),
        'sdkCompleteToNextRequestCreationMs':delta_ms(next_get,sdk_complete),
        'sdkCompleteBeforeNextRequest':sdk_complete['deviceUptimeSeconds']<next_get['deviceUptimeSeconds'],
        'completedReadyState':completed['readyState'],'completedHTTPStatus':completed['status'],
        'sameSID':old_query.get('SID')==new_query.get('SID'),
        'oldAID':old_query.get('AID'),'newAID':new_query.get('AID'),
        'oldAttemptQuery':old_query.get('t'),'newAttemptQuery':new_query.get('t'),
        'nextGETLoggedAttempt':attempt,
        'decodedNoopLogTexts':body_logs,
        'decodedNoopLogTextUTF8Bytes':sum(len(s.encode()) for s in body_logs),
        'appRotationExcerpt':relevant,
        'limits':['63 stream bytes include HTTP/3 framing/headers; not HTTP body length.',
                  'Logged JSON text length excludes WebChannel framing/compression and is not a URLSession body-byte metric.',
                  'No cross-clock subtraction between qlog time and app uptime.',
                  'Immediate next GET means no observed SDK retry/backoff, not absence of QUIC retransmissions.']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--qlogs',type=Path,required=True)
    parser.add_argument('--evidence-root',type=Path,default=Path(__file__).parent)
    parser.add_argument('--output',type=Path,required=True)
    args = parser.parse_args()
    originals = {hashlib.sha256(p.read_bytes()).hexdigest():p for p in args.qlogs.rglob('*.qlog')}
    results = []
    for folder in sorted(args.evidence_root.glob('M6-r*')):
        expected = json.loads((folder/'qlog-evidence.json').read_text())
        if len(expected)!=1:
            raise ValueError('Expected one source qlog per run')
        results.append(analyze(folder,originals[expected[0]['sourceSHA256']]))
    args.output.write_text(json.dumps({'analysisDate':'2026-11-24','newMeasurements':False,
                                     'runs':results},indent=2)+'\n')
    for r in results:
        print(r['run'],r['peerResetErrorCodes'],r['uniqueReceivedStreamBytes'],
              'bytes; next GET after',round(r['errorToNextRequestCreationMs'],3),'ms')


if __name__ == '__main__':
    main()
