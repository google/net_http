"""Analyze retained T5 and expiry-follow-up evidence; no device operations."""
import argparse
from datetime import datetime
import json
from pathlib import Path
import re
from urllib.parse import parse_qs, urlsplit


def records(path):
    return [json.loads(line) for line in path.read_text().splitlines()]


def rpc_starts(events):
    starts = []
    for event in events:
        if event.get('kind') != 'http_log':
            continue
        match = re.search(r'\[HTTP Req\] \(rpc\) \[attempt (\d+)\] GET (\S+)', event.get('text', ''))
        if match:
            starts.append({**event, 'attempt': int(match[1]), 'url': match[2]})
    return starts


def wall(text):
    return datetime.fromisoformat(text.replace('Z', '+00:00')).timestamp()


def t5(folder):
    events = records(folder/'device-events.jsonl')
    condition = records(folder/'condition.jsonl')
    assert any(x.get('event') == 'active_verified' for x in condition)
    assert any(x.get('event') == 'inactive_verified' for x in condition)
    enabled = next(x for x in condition if x.get('event') == 'enable_ack')
    release = next(x for x in condition if x.get('event') == 'disable_request')
    error = next(x for x in events if x.get('kind') == 'error')
    unsatisfied = next((x for x in events if x.get('kind') == 'path' and x['status'] == 'unsatisfied'
                        and enabled['mac_utc'] <= x['hostReceivedUTC'] <= release['mac_utc']), None)
    starts = rpc_starts(events)
    retry = next(x for x in starts if x['attempt'] == 2)
    end = next(x for x in events if x.get('kind') == 'http_state' and x.get('method') == 'GET'
               and x.get('rid') == 'rpc' and x.get('attempt') == 2 and x.get('readyState') == 3)
    transactions = [t for x in events if x.get('kind') == 'task_metrics' for t in x['transactions']]
    retry_transactions = [t for t in transactions if t.get('url') == retry['url']]
    heartbeats = [x for x in events if x.get('kind') == 'heartbeat'
                  and enabled['mac_utc'] <= x['hostReceivedUTC'] <= release['mac_utc']]
    assert heartbeats and all(x['applicationState'] == 0 for x in heartbeats)
    assert sum(x.get('kind') == 'open' for x in events) == 1
    return {'trial': folder.name, 'requestedHoldSeconds': 250,
            'observedHelperHoldSeconds': release['monotonic_seconds'] - enabled['monotonic_seconds'],
            'errorCode': error['code'],
            'errorAfterEnableAckMacWallSeconds': wall(error['hostReceivedUTC']) - wall(enabled['mac_utc']),
            'unsatisfiedAfterEnableAckMacWallSeconds': (wall(unsatisfied['hostReceivedUTC']) - wall(enabled['mac_utc'])) if unsatisfied else None,
            'firstRetryDeviceSeconds': end['deviceUptimeSeconds'] - retry['deviceUptimeSeconds'],
            'firstRetryStatus': end['status'],
            'firstRetryTransactions': [{k: t.get(k) for k in ('protocol', 'reusedConnection', 'isCellular')} for t in retry_transactions],
            'recordedProtocols': sorted({t.get('protocol', 'unknown') for t in transactions}),
            'activeHoldHeartbeatsVerified': True,
            'timingLimit': 'Cross-process fault-relative times use host wall clock; native acknowledgements are not packet timestamps.'}


def expiry(folder):
    result = json.loads((folder/'result.json').read_text())
    assert result['outcome'] == 'suspension-observed' and result['uiTestExitCode'] == 0
    assert result['samePIDAfterResume'] and result['openCount'] == 1 and not result.get('cleanupError')
    ui = result['uiEvents']
    event = lambda name: next(x for x in ui if x['event'] == name)
    home, start, end, fore = [event(x) for x in ('home_returned', 'suspension_hold_started', 'suspension_hold_complete', 'foreground_after_resume')]
    samples = [x for x in ui if x['event'].startswith('suspension_hold_')]
    gaps = [b['deviceUptimeSeconds'] - a['deviceUptimeSeconds'] for a, b in zip(samples, samples[1:])]
    assert samples and all(x['applicationState'] == 2 for x in samples)
    assert gaps and min(gaps) >= 0 and max(gaps) <= 3
    duration = end['deviceUptimeSeconds'] - start['deviceUptimeSeconds']
    assert duration >= result['requestedSuspendSeconds']
    events = records(folder/'device-events.jsonl')
    last_get = next(x for x in reversed(rpc_starts(events)) if x['deviceUptimeSeconds'] <= start['deviceUptimeSeconds'])
    sids = {sid for x in rpc_starts(events) for sid in parse_qs(urlsplit(x['url']).query).get('SID', [])}
    assert len(sids) == 1
    reply = result['milestones'].get('resumedEcho')
    return {'trial': folder.name, 'requestedHoldSeconds': result['requestedSuspendSeconds'],
            'observedSuspendedSeconds': duration,
            'homeToSuspendObservationSeconds': start['deviceUptimeSeconds'] - home['deviceUptimeSeconds'],
            'lastGETAgeAtHoldStartSeconds': start['deviceUptimeSeconds'] - last_get['deviceUptimeSeconds'],
            'lastGETAgeAtHoldEndSeconds': end['deviceUptimeSeconds'] - last_get['deviceUptimeSeconds'],
            'lastGETAgeAtForegroundObservationSeconds': fore['deviceUptimeSeconds'] - last_get['deviceUptimeSeconds'],
            'channelObservation': result['channelObservation'], 'errorCodes': result['errorCodes'],
            'foregroundToEchoSeconds': reply['deviceUptimeSeconds'] - fore['deviceUptimeSeconds'] if reply else None,
            'samePIDAfterResume': True, 'uniqueSIDCount': len(sids),
            'maximumOSSampleGapSeconds': max(gaps),
            'recordedProtocols': sorted({t.get('protocol', 'unknown') for x in events if x.get('kind') == 'task_metrics' for t in x['transactions']}),
            'timingLimit': 'UI state is asynchronous. GET ages bracket observations, not the exact server expiry or physical resume instant.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    args = parser.parse_args()
    rows = {'t5': [], 'expiry': []}
    for folder in sorted((args.root/'t5-direct').glob('T5-r[123]')):
        if (folder/'device-events.jsonl').exists():
            rows['t5'].append(t5(folder))
    for folder in sorted((args.root/'expiry').glob('T15-*-r[123]')):
        if (folder/'result.json').exists():
            rows['expiry'].append(expiry(folder))
    (args.root/'followup-analysis.json').write_text(json.dumps(rows, indent=2)+'\n')
    print(json.dumps(rows, indent=2))


if __name__ == '__main__':
    main()
