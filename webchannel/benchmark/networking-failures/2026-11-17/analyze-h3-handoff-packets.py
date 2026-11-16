"""Offline RVI interface evidence; raw capture stays local, no QUIC decryption."""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('capture', type=Path)
    args = parser.parse_args()
    raw = args.capture.read_bytes()
    provenance = json.loads((ROOT / 'h3-human/handoff-capture-provenance.json').read_text())
    assert hashlib.sha256(raw).hexdigest() == provenance['rawSHA256']
    prefix = 24 if raw[:4] == bytes.fromhex('d4c3b2a1') and raw[24:28] == bytes.fromhex('0a0d0d0a') else 0
    rows = []
    with tempfile.TemporaryDirectory(prefix='net-http-rvi-analysis-') as directory:
        view = Path(directory) / 'view.pcapng'
        view.write_bytes(raw[prefix:])
        for folder in sorted((ROOT / 'h3-human').glob('T12-T14-*')):
            result = json.loads((folder / 'result.json').read_text())
            events = [json.loads(x) for x in (folder / 'device-events.jsonl').read_text().splitlines()]
            pid = next(e['pid'] for e in events if e.get('kind') == 'autorun_start')
            output = subprocess.run(['/usr/sbin/tcpdump', '-r', str(view), '-nn', '-tt', '-k', 'INPD',
                                     '-Q', f'pid={pid}'], text=True, capture_output=True, check=True).stdout
            counts, quic, initials, sources = Counter(), Counter(), Counter(), defaultdict(set)
            for line in output.splitlines():
                match = re.match(r'\S+ \(([^,]+), proc [^:]+:(\d+), (in|out)\) IP6? (\S+) > (\S+): (.*)', line)
                if not match:
                    raise ValueError('unexpected packet metadata: ' + line)
                interface, owner, direction, source, destination, payload = match.groups()
                assert int(owner) == pid
                counts[interface] += 1
                if 'quic,' in payload:
                    quic[interface] += 1
                    if direction == 'out' and 'quic, initial' in payload:
                        initials[interface] += 1
                if direction == 'out':
                    sources[interface].add(source)
            metrics = [t for e in events if e.get('kind') == 'task_metrics' for t in e['transactions']]
            row = {'trial': folder.name, 'appPID': pid, 'capturedPackets': sum(counts.values()),
                   'packetsPerInterface': dict(counts), 'quicPacketsPerInterface': dict(quic),
                   'outgoingInitialPacketsPerInterface': dict(initials),
                   'outgoingSourceEndpointsPerInterface': {k: sorted(v) for k, v in sources.items()},
                   'allTaskMetricsReportNonCellular': bool(metrics) and all(t.get('isCellular') is False for t in metrics),
                   'taskMetricLocalEndpoints': sorted({f"{t.get('localAddress')}.{t.get('localPort')}" for t in metrics}),
                   'protocolEvidence': result['protocolEvidence']}
            rows.append(row)
            if output:
                (folder / 'rvi-packet-interfaces.log').write_text(output)
    destination = ROOT / 'h3-human/handoff-packet-analysis.json'
    destination.write_text(json.dumps({'rows': rows, 'limits': [
        'Only the host addresses resolved by the capture filter at startup are included.',
        'PID metadata joins packet records to each app launch. The first idle trial preceded this capture.',
        'RVI interface names establish observed packet interfaces; URLSession task fields can retain initial connection properties.',
        'No encrypted PATH/PING frames are decoded and no exact physical switch time is claimed.',
        'No client Initial seen on an interface is an observation in this filtered capture, not a universal absence claim.',
    ]}, indent=2) + '\n')
    lines = ['# RVI packet interfaces during working-cellular handoffs', '',
             'Final capture: 1500 packets; operator-reported kernel drops: 0. Raw capture stays local.', '',
             '| Trial | Captured app packets | en0 | pdp_ip0 | All task metrics non-cellular |',
             '| --- | ---: | ---: | ---: | --- |']
    for row in rows:
        counts = row['packetsPerInterface']
        lines.append(f"| {row['trial']} | {row['capturedPackets']} | {counts.get('en0', 0)} | {counts.get('pdp_ip0', 0)} | {row['allTaskMetricsReportNonCellular']} |")
    lines += ['', 'The first idle trial has no capture because recording began afterward. Three of the five',
              'captured qualified trials contain pdp_ip0 packets; two contain only en0 packets for the app PID.',
              'Do not claim packet-confirmed cellular use for those two from default-path callbacks alone.',
              'Where present, pdp_ip0 records establish actual cellular packet use even when task metrics retain',
              'isCellular=false and the initial Wi-Fi local endpoint. Keep those observations separate.',
              'The trace is consistent with h3 connection reuse across route changes, but encrypted',
              'QUIC path-validation/PING frames are not decoded. See JSON for source endpoints and limits.', '']
    (ROOT / 'h3-human/handoff-packet-summary.md').write_text('\n'.join(lines))
    print(f'Analyzed {sum(bool(r["capturedPackets"]) for r in rows)} captured qualified handoffs; raw capture unchanged.')


if __name__ == '__main__':
    main()
