"""Reanalyze h3-started fault sequences; preserve mixed protocols explicitly."""
from datetime import datetime
import json
from pathlib import Path
import sys
from urllib.parse import parse_qs, urlsplit


def read(path):
    return [json.loads(line) for line in path.read_text().splitlines()]


def wall(text):
    return datetime.fromisoformat(text.replace('Z', '+00:00')).timestamp()


def analyze(root):
    results = json.loads((root/'results.json').read_text())
    rows = []
    for result in results:
        if result.get('observation', '').startswith('infrastructure-error'):
            continue
        folder = root/result['folder']
        events, conditions = read(folder/'device-events.jsonl'), read(folder/'condition.jsonl')
        enable = next(e for e in conditions if e.get('event') == 'enable_ack')
        release = next(e for e in conditions if e.get('event') == 'disable_request')
        assert any(e.get('event') == 'active_verified' for e in conditions)
        assert any(e.get('event') == 'inactive_verified' for e in conditions)
        transactions = [t for e in events if e.get('kind') == 'task_metrics' for t in e['transactions']]
        baseline = [t for e in events if e.get('kind') == 'task_metrics' and e['hostReceivedUTC'] < enable['mac_utc']
                    for t in e['transactions'] if t.get('method') == 'POST']
        assert baseline and baseline[0]['protocol'] == 'h3'
        assert all(urlsplit(t['url']).hostname == 'webchannel.googleapis.com' for t in transactions)
        protocols = [t.get('protocol') or 'unknown' for t in transactions]
        known_other = sorted(set(protocols) - {'h3', 'unknown'})
        errors = [e for e in events if e.get('kind') == 'error']
        unsatisfied = [e for e in events if e.get('kind') == 'path' and e.get('status') == 'unsatisfied'
                       and enable['mac_utc'] <= e['hostReceivedUTC'] <= release['mac_utc']]
        sids = {sid for t in transactions for sid in parse_qs(urlsplit(t['url']).query).get('SID', [])}
        active = [e for e in events if e.get('kind') == 'heartbeat'
                  and enable['mac_utc'] <= e['hostReceivedUTC'] <= release['mac_utc']]
        assert active and all(e['applicationState'] == 0 for e in active)
        assert len(sids) == 1
        retry = next((e for e in events if e.get('kind') == 'http_log'
                      and '[HTTP Req] (rpc) [attempt 2] GET ' in e.get('text', '')), None)
        retry_end = next((e for e in events if retry and e.get('kind') == 'http_state'
                          and e.get('rid') == 'rpc' and e.get('attempt') == 2
                          and e.get('readyState') == 3
                          and e['deviceUptimeSeconds'] >= retry['deviceUptimeSeconds']), None)
        retry_url = retry['text'].split(' GET ', 1)[1] if retry else None
        retry_protocols = [t.get('protocol', 'unknown') for t in transactions if t.get('url') == retry_url]
        rows.append({'case': result['case'], 'run': result['run'], 'folder': result['folder'],
            'baselinePOSTProtocol': 'h3', 'observation': result['observation'],
            'holdSeconds': release['monotonic_seconds'] - enable['monotonic_seconds'],
            'errorCodes': result['errorCodes'], 'openCount': result['openCount'], 'uniqueSIDCount': len(sids),
            'h3Transactions': protocols.count('h3'), 'h2Transactions': protocols.count('h2'),
            'unknownTransactions': protocols.count('unknown'), 'otherKnownProtocols': known_other,
            'firstBackChannelRetryRequestSeconds': retry_end['deviceUptimeSeconds'] - retry['deviceUptimeSeconds'] if retry_end else None,
            'firstBackChannelRetryCompletionHTTPStatus': retry_end.get('status') if retry_end else None,
            'firstBackChannelRetryTransactionProtocols': retry_protocols,
            'protocolCoverage': 'mixed-after-h3-baseline' if known_other else 'h3-observed-no-known-fallback',
            'firstErrorAfterEnableAckMacWallSeconds': wall(errors[0]['hostReceivedUTC']) - wall(enable['mac_utc']) if errors else None,
            'firstErrorAfterReleaseMacWallSeconds': wall(errors[0]['hostReceivedUTC']) - wall(release['mac_utc']) if errors else None,
            'firstUnsatisfiedAfterEnableAckMacWallSeconds': wall(unsatisfied[0]['hostReceivedUTC']) - wall(enable['mac_utc']) if unsatisfied else None,
            'receiveAfterRelease': result['receiveAfterRelease'], 'activeHoldHeartbeatsVerified': True})
    return rows


def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent/'h3-automatic'
    rows = analyze(root)
    (root/'h3-analysis.json').write_text(json.dumps({'rows': rows}, indent=2)+'\n')
    lines = ['# h3-started automatic fault observations', '',
        f'Completed sequences: {len(rows)}. Every sequence had a confirmed h3 baseline POST before loss.',
        'Mixed recovery is an observed outcome, not pure h3 coverage. Unknown transactions are not counted as h3.', '',
        '| Case | Run | Hold | SDK errors | Outcome | h3 / h2 / unknown transactions | Coverage |',
        '| --- | ---: | ---: | --- | --- | --- | --- |']
    for r in rows:
        lines.append(f"| {r['case']} | [{r['run']}]({r['folder']}/device-events.jsonl) | {r['holdSeconds']:.3f} s | "
                     f"{r['errorCodes']} | {r['observation']} | {r['h3Transactions']} / {r['h2Transactions']} / "
                     f"{r['unknownTransactions']} | {r['protocolCoverage']} |")
    lines += ['', 'All retained holds have active app heartbeats, one request SID, and native active/inactive readbacks.',
        'Cross-process fault-relative times use host wall-clock observations; native acknowledgements are not packet timestamps.',
        'The new Google APIs hostname is specified by PR #133. Earlier h2 measurements used the sandbox hostname; this is not a same-origin forced-protocol A/B comparison.',
        'The first T2 sequence used the strict fallback-stop controller; its raw mixed recovery is retained and was not rerun. Subsequent trials record mixed recovery without treating it as infrastructure failure.',
        'Startup failures remain excluded under interrupted-attempts. Measured controller/source revisions are identified separately.', '']
    (root/'h3-summary.md').write_text('\n'.join(lines))
    print(f'Validated {len(rows)} h3-started sequences; {sum(bool(r["otherKnownProtocols"]) for r in rows)} mixed-protocol observations.')


if __name__ == '__main__':
    main()
