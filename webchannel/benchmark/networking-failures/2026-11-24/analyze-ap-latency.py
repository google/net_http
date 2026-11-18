#!/usr/bin/env python3
"""Verify native macOS ping logs and compare AP trials without pooling away runs."""
import argparse
import json
import math
from pathlib import Path
import re
import statistics


def analyze(folder):
    text = (folder/'ping.log').read_text()
    samples = {}
    for line in text.splitlines():
        match = re.search(r'icmp_seq=(\d+).*time=([0-9.]+)\s*ms',line)
        if match:
            samples.setdefault(int(match[1]),float(match[2]))
    summary = re.search(r'(\d+) packets transmitted, (\d+) packets received, ([0-9.]+)% packet loss',text)
    if not summary:
        raise ValueError('No complete native ping summary: '+str(folder))
    result = json.loads((folder/'result.json').read_text())
    environment = json.loads((folder/'environment.json').read_text())
    values = sorted(samples.values())
    if not values or len(values)!=int(summary[2]):
        raise ValueError('Reply count mismatch')
    for name in ['route-before.log','route-after.log']:
        if not re.search(r'interface:\s+en6\b',(folder/name).read_text()):
            raise ValueError('Unexpected measurement interface')
    computed = {'transmitted':int(summary[1]),'received':len(values),
                'packetLossPercent':float(summary[3]),'minMs':min(values),
                'meanMs':statistics.mean(values),'medianMs':statistics.median(values),
                'p95Ms':values[math.ceil(.95*len(values))-1],'maxMs':max(values)}
    for key,value in computed.items():
        if not math.isclose(value,result[key],rel_tol=1e-10,abs_tol=1e-8):
            raise ValueError('Statistic mismatch: '+key)
    if samples!={s['sequence']:s['rttMs'] for s in result['samples']}:
        raise ValueError('Sample mismatch')
    native = re.search(r'round-trip min/avg/max/stddev = ([0-9.]+)/([0-9.]+)/([0-9.]+)/([0-9.]+) ms',text)
    if not native:
        raise ValueError('No native RTT summary')
    checks = [min(values),statistics.mean(values),max(values),statistics.pstdev(values)]
    if any(abs(actual-float(expected))>.002 for actual,expected in zip(checks,native.groups())):
        raise ValueError('Parsed samples disagree with native rounded RTT summary')
    return {'folder':folder.name,'trial':result['trial'],'ap':environment['operatorReportedAP'],
            'startedUTC':result['measurementStartedUTC'],**computed,
            'missingSequences':sorted(set(range(int(summary[1])))-samples.keys())}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory',type=Path)
    parser.add_argument('--output',type=Path,required=True)
    args = parser.parse_args()
    rows = [analyze(folder) for folder in args.directory.iterdir()
            if folder.is_dir() and (folder/'result.json').exists()]
    rows.sort(key=lambda r:r['startedUTC'])
    groups = {}
    for row in rows:
        groups.setdefault(row['ap'],[]).append(row)
    grouped = []
    for ap,runs in groups.items():
        medians = [r['medianMs'] for r in runs]
        transmitted = sum(r['transmitted']for r in runs)
        received = sum(r['received']for r in runs)
        grouped.append({'ap':ap,'completedRuns':len(runs),
                        'medianOfRunMediansMs':statistics.median(medians),
                        'runMedianRangeMs':[min(medians),max(medians)],
                        'transmitted':transmitted,'received':received,
                        'packetLossPercentFromTotals':100*(transmitted-received)/transmitted})
    result = {'rows':rows,'groups':grouped,'p95Method':'nearest rank of unique received replies per trial',
              'limits':['LAN ICMP RTT includes the iPhone response schedule; this is not HTTP/WebChannel latency.',
                        'Current AP location, wiring and Wi-Fi conditions are compared together.',
                        'AP and screen state are operator-reported; SSID/BSSID are not captured by ping.',
                        'Run-to-run variation is retained; no significance claim from individual packet counts.']}
    args.output.write_text(json.dumps(result,indent=2)+'\n')
    for r in rows:
        print(r['trial'],r['ap'],'median',r['medianMs'],'p95',r['p95Ms'],'loss',r['packetLossPercent'])


if __name__=='__main__':
    main()
