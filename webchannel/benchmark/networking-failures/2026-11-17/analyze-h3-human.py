"""Validate retained h3-started human-operated trial evidence, offline only."""
import json
from pathlib import Path
import re
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parent


def analyze(folder):
    result = json.loads((folder / 'result.json').read_text())
    events = [json.loads(x) for x in (folder / 'device-events.jsonl').read_text().splitlines()]
    assert result['outcome'] in ('l3-observed', 'handoff-observed')
    assert result['requestedHTTP3'] is True
    assert result['endpoint'] == 'https://webchannel.googleapis.com/staging/channel/generator'
    assert result['openCount'] == 1 and not result.get('cleanupError')
    assert sum(e.get('kind') == 'autorun_start' for e in events) == 1
    first_fault = next(result['milestones'][k] for k in ('offlinePath', 'cellularFaultPath', 'cellularPath', 'offlinePath1')
                       if k in result['milestones'])
    baseline = [t for e in events if e.get('kind') == 'task_metrics'
                and e['deviceUptimeSeconds'] < first_fault['deviceUptimeSeconds']
                for t in e['transactions'] if t.get('method') == 'POST']
    assert baseline and baseline[0]['protocol'] == 'h3'
    sids = {sid for e in events if e.get('url') for sid in parse_qs(urlsplit(e['url']).query).get('SID', [])}
    assert len(sids) == 1
    row = {'trial': folder.name, **{k: result.get(k) for k in (
        'scenario', 'requestedHoldSeconds', 'observedSecondsAtRestoreCue',
        'observedOfflinePathSeconds', 'channelObservation', 'observedRestoreToEchoSeconds',
        'observedOfflineToTerminalSeconds', 'observedFirstOfflineToTerminalSeconds',
        'observedBrokenCellularPathSeconds',
        'errorCodes', 'protocolEvidence')},
        'baselineH3Verified': True, 'uniqueSIDCount': len(sids)}
    if result['scenario'] == 'T13-broken-cellular':
        proof = result['selectiveFaultPreflight']
        condition = proof['operatorCondition']
        assert condition['interface'] == 'cellular' and condition['enabledReportedByOperator'] is True
        assert condition['uplinkLossPercent'] == condition['downlinkLossPercent'] == 100
        assert proof['cellularOutcome'] == 'timeout' and proof['cellularPath']['status'] == 'satisfied'
        assert proof['cellularPath']['cellular'] is True and proof['cellularPath']['wifi'] is False
        assert proof['wifiHTTPStatus'] >= 100
        assert result['observedBrokenCellularPathSeconds'] >= result['observedSecondsAtRestoreCue'] >= result['requestedHoldSeconds']
        row['selectiveLossPreflightVerified'] = True
        row['http400Observed'] = any((e.get('kind') == 'http_state' and e.get('status') == 400)
            or (e.get('kind') == 'transport_error' and e.get('domain') == 'com.google.HTTPStatus' and e.get('code') == 400)
            for e in events)
    if result['scenario'] == 'T11-l3-flap':
        assert len(result['cycles']) == 3
        for number, cycle in enumerate(result['cycles'], 1):
            assert cycle['cycle'] == number
            offline = result['milestones'][f'offlinePath{number}']
            restored = result['milestones'][f'restoredPath{number}']
            assert offline['status'] == 'unsatisfied'
            assert restored['status'] == 'satisfied' and restored['wifi'] is True
            assert cycle['observedOfflinePathSeconds'] >= cycle['observedSecondsAtRestoreCue'] >= result['requestedHoldSeconds']
        row['cycles'] = result['cycles']
    if result['scenario'] == 'wifi-cellular-wifi':
        row['channelObservation'] = result.get('postRestoreObservation', 'both-direction-probe-echoes')
        cell = result['milestones']['cellularPath']
        restored = result['milestones']['restoredPath']
        assert cell['status'] == 'satisfied' and cell['cellular'] is True and cell['wifi'] is False
        assert restored['status'] == 'satisfied' and restored['wifi'] is True and restored['wired'] is False
        transactions = []
        for event in events:
            if event.get('kind') != 'task_metrics':
                continue
            phase = ('before-cellular-path' if event['deviceUptimeSeconds'] < cell['deviceUptimeSeconds']
                     else 'cellular-path-observed' if event['deviceUptimeSeconds'] < restored['deviceUptimeSeconds']
                     else 'wifi-restored')
            for transaction in event['transactions']:
                transactions.append({'metricsCallbackPhase': phase, **{k: transaction.get(k) for k in
                    ('method', 'protocol', 'isCellular', 'reusedConnection', 'localAddress', 'localPort', 'remoteAddress', 'remotePort')}})
        row['handoff'] = {
            'traffic': result['traffic'],
            'restoredPathAlsoReportsCellular': restored['cellular'],
            'observedCellularPathSeconds': result['observedCellularPathSeconds'],
            'cellularPathToProbeEchoSeconds': result['milestones']['cellularEcho']['deviceUptimeSeconds'] - cell['deviceUptimeSeconds'],
            'restoredPathToProbeEchoSeconds': result['milestones']['restoredEcho']['deviceUptimeSeconds'] - restored['deviceUptimeSeconds'],
            'observedPostRestoreHostSeconds': result['observedPostRestoreHostSeconds'],
            'postRestoreProbeCount': result['postRestoreProbeCount'],
            'transactions': transactions,
            'note': 'Metrics callback phase is not physical packet routing. Path-to-probe intervals include operator/controller/probe delays; they are not exact network recovery times or proof of QUIC migration.',
        }
        if result['traffic'] == 'streaming':
            wire_ids, stream, unparsed = [], [], 0
            marker = '[HTTP Resp Body] (rpc): '
            for event in events:
                text = event.get('text', '')
                if event.get('kind') != 'http_log' or marker not in text:
                    continue
                try:
                    items = json.loads(text.split(marker, 1)[1])
                except ValueError:
                    unparsed += 1
                    continue
                for item in items:
                    if isinstance(item, list) and len(item) == 2 and isinstance(item[0], int):
                        wire_ids.append(item[0])
                        if isinstance(item[1], dict) and item[1].get('message') == 'network-failure stream':
                            stream.append({'arrayID': item[0], 'deviceUptimeSeconds': event['deviceUptimeSeconds']})
            unique = sorted(set(wire_ids))
            intervals = [b['deviceUptimeSeconds'] - a['deviceUptimeSeconds'] for a, b in zip(stream, stream[1:])]
            row['stream'] = {
                'parsedStreamFrames': len(stream),
                'appDeliveredStreamMessages': sum(e.get('kind') == 'app_log' and 'didReceiveMessage' in e.get('text', '')
                                                 and 'network-failure stream' in e.get('text', '') for e in events),
                'wireArrayIDGaps': sorted(set(range(unique[0], unique[-1] + 1)) - set(unique)) if unique else [],
                'duplicateWireArrayIDs': len(wire_ids) - len(unique),
                'unparsedBackchannelBodyRecords': unparsed,
                'maximumLoggedStreamIntervalSeconds': max(intervals, default=None),
                'frames': stream,
                'note': 'Observed delivery intervals include server/device scheduling and backgrounding; they are not exact physical outages. ID continuity is limited to successfully parsed records.',
            }
    if result['scenario'] == 'T10-l3-pending':
        pending = result['milestones']['pendingWrite']
        assert pending['message'] == 'network-failure pending write'
        assert pending['deviceUptimeSeconds'] >= first_fault['deviceUptimeSeconds']
        terminal = next((e for e in events if e.get('kind') in ('error', 'closed')
                         and e['deviceUptimeSeconds'] >= pending['deviceUptimeSeconds']), None)
        posts = []
        for event in events:
            if event.get('kind') != 'http_log' or event['deviceUptimeSeconds'] < pending['deviceUptimeSeconds']:
                continue
            match = re.search(r'\[HTTP Req\] \(([^)]+)\) \[attempt (\d+)\] POST (\S+)', event.get('text', ''))
            if match:
                posts.append({'rid': match[1], 'attempt': int(match[2])})
        assert posts and len({p['rid'] for p in posts}) == 1
        row['pendingWrite'] = {
            'offlineToSubmissionSeconds': pending['deviceUptimeSeconds'] - first_fault['deviceUptimeSeconds'],
            'submissionToTerminalSeconds': terminal['deviceUptimeSeconds'] - pending['deviceUptimeSeconds'] if terminal else None,
            'postAttempts': [p['attempt'] for p in posts],
            'matchingEchoReceived': any(e.get('kind') == 'echo_reply' and e.get('token') == pending['token'] for e in events),
            'note': 'Matching app echo is observed separately; no transport-level acknowledgement count is inferred.',
        }
    return row


if __name__ == '__main__':
    rows = [analyze(p) for p in sorted((ROOT / 'h3-human').iterdir())
            if p.is_dir() and p.name.startswith('T') and (p / 'result.json').exists()]
    (ROOT / 'h3-human/analysis.json').write_text(json.dumps(rows, indent=2) + '\n')
    lines = ['# H3-started human-operated observations', '',
             'Completed qualified trials only; excluded duration attempts remain in a separate directory.',
             'Requested hold controls the restoration cue, not the physical time Wi-Fi reconnects.', '',
             '| Trial | Requested hold (s) | Observed offline path (s) | Restore to echo (s) | Observation | SDK errors | Protocol coverage |',
             '| --- | ---: | ---: | ---: | --- | --- | --- |']
    def number(value):
        return f'{value:.3f}' if value is not None else '—'
    for row in rows:
        lines.append(f"| {row['trial']} | {number(row['requestedHoldSeconds'])} | "
                     f"{number(row['observedOfflinePathSeconds'])} | {number(row['observedRestoreToEchoSeconds'])} | "
                     f"{row['channelObservation']} | {row['errorCodes']} | {row['protocolEvidence']['coverage']} |")
    lines += ['', 'Path callbacks are asynchronous observations. Unknown failed transactions are not h3 proof.', '']
    pending_rows = [r for r in rows if 'pendingWrite' in r]
    if pending_rows:
        lines += ['## T10 pending writes', '',
                  '| Trial | Offline to submission (s) | Submission to terminal (s) | POST attempts | Matching echo |',
                  '| --- | ---: | ---: | --- | --- |']
        for row in pending_rows:
            p = row['pendingWrite']
            lines.append(f"| {row['trial']} | {number(p['offlineToSubmissionSeconds'])} | "
                         f"{number(p['submissionToTerminalSeconds'])} | {p['postAttempts']} | {p['matchingEchoReceived']} |")
        lines += ['', 'Echo absence is not a count of unacknowledged transport objects.', '']
    flaps = [r for r in rows if 'cycles' in r]
    if flaps:
        lines += ['## T11 cycles', '',
                  '| Trial | Cycle | Offline to restore cue (s) | Observed offline path (s) |',
                  '| --- | ---: | ---: | ---: |']
        for row in flaps:
            for cycle in row['cycles']:
                lines.append(f"| {row['trial']} | {cycle['cycle']} | {number(cycle['observedSecondsAtRestoreCue'])} | "
                             f"{number(cycle['observedOfflinePathSeconds'])} |")
        lines += ['', 'A mixed protocol result is retained as such; it is not counted as pure h3 coverage.', '']
    streams = [r for r in rows if 'stream' in r]
    if streams:
        lines += ['## Continuous delivery during handoff', '',
                  '| Trial | Parsed stream frames / app deliveries | Largest logged interval (s) | Array-ID gaps / duplicates | Unparsed bodies |',
                  '| --- | --- | ---: | --- | ---: |']
        for row in streams:
            s = row['stream']
            lines.append(f"| {row['trial']} | {s['parsedStreamFrames']} / {s['appDeliveredStreamMessages']} | "
                         f"{number(s['maximumLoggedStreamIntervalSeconds'])} | {s['wireArrayIDGaps']} / {s['duplicateWireArrayIDs']} | "
                         f"{s['unparsedBackchannelBodyRecords']} |")
        lines += ['', 'Delivery gaps are not exact packet outage times; ID continuity covers the parsed observation window only.', '']
    broken = [r for r in rows if r.get('selectiveLossPreflightVerified')]
    if broken:
        lines += ['## T13 cellular-only loss', '',
                  '| Trial | Requested hold (s) | Observed broken-cellular path (s) | Observation | SDK errors | HTTP 400 | Protocol coverage |',
                  '| --- | ---: | ---: | --- | --- | --- | --- |']
        for row in broken:
            lines.append(f"| {row['trial']} | {number(row['requestedHoldSeconds'])} | {number(row['observedBrokenCellularPathSeconds'])} | "
                         f"{row['channelObservation']} | {row['errorCodes']} | {row['http400Observed']} | {row['protocolEvidence']['coverage']} |")
        lines += ['', 'The operator maintains the cellular-only conditioner profile; interface-bound preflight is reachability proof, not continuous packet-loss measurement.', '']
    (ROOT / 'h3-human/summary.md').write_text('\n'.join(lines))
    print(f'Validated {len(rows)} qualified human-operated observations.')
