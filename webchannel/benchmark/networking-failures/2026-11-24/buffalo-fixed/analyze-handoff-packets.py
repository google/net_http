#!/usr/bin/env python3
"""Extract trial-owned RVI metadata for fixed-AP h2/h3 handoffs; no decryption."""
import argparse
from collections import Counter
import hashlib
import json
from pathlib import Path
import re
import struct
import subprocess
import tempfile


def pcapng_view(raw):
    prefix = 24 if raw[:4] == bytes.fromhex('d4c3b2a1') and raw[24:28] == bytes.fromhex('0a0d0d0a') else 0
    data = raw[prefix:]
    offset, packets, endian = 0, 0, None
    while offset < len(data):
        if data[offset:offset+4] == bytes.fromhex('0a0d0d0a'):
            magic = data[offset+8:offset+12]
            endian = {bytes.fromhex('4d3c2b1a'):'<', bytes.fromhex('1a2b3c4d'):'>'}[magic]
        if endian is None:
            raise ValueError('Expected pcapng section header')
        kind, size = struct.unpack_from(endian+'II', data, offset)
        if size < 12 or size % 4 or offset+size > len(data):
            raise ValueError('Invalid/truncated block')
        if struct.unpack_from(endian+'I',data,offset+size-4)[0] != size:
            raise ValueError('Block length mismatch')
        packets += kind in (2, 3, 6)
        offset += size
    return data, prefix, packets


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--capture',type=Path,required=True)
    parser.add_argument('--events',type=Path,required=True)
    parser.add_argument('--result',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    parser.add_argument('--packet-log',type=Path,required=True)
    args = parser.parse_args()
    events = [json.loads(line) for line in args.events.read_text().splitlines()]
    result = json.loads(args.result.read_text())
    pid = next(e['pid'] for e in events if e.get('kind')=='autorun_start')
    metrics = [t for e in events if e.get('kind')=='task_metrics' for t in e['transactions']]
    remote_addresses = {t['remoteAddress'] for t in metrics if t.get('remoteAddress')}
    raw = args.capture.read_bytes()
    data, prefix, total = pcapng_view(raw)
    with tempfile.TemporaryDirectory(prefix='net-http-p3-') as directory:
        view = Path(directory)/'capture.pcapng'
        view.write_bytes(data)
        decoded = subprocess.run(['/usr/sbin/tcpdump','-r',str(view),'-nn','-tt',
                                  '-k','INPD','-Q',f'pid={pid}','port 443'],
                                 text=True,capture_output=True,check=True).stdout
    packets, lines = [], []
    pattern = r'(\S+) \(([^,]+), proc [^:]+:(\d+), (in|out)\) IP6? (\S+) > (\S+): (.*)'
    for line in decoded.splitlines():
        match = re.fullmatch(pattern,line)
        if not match:
            raise ValueError('Unexpected metadata line')
        ts, interface, owner, direction, source, destination, payload = match.groups()
        if int(owner)!=pid:
            raise ValueError('PID filter mismatch')
        remote = destination if direction=='out' else source
        if remote.rsplit('.',1)[0] not in remote_addresses:
            continue
        packets.append({'unixSeconds':float(ts),'interface':interface,'direction':direction,
                        'source':source,'destination':destination,'quic': 'quic,' in payload,
                        'initial': 'quic, initial' in payload,
                        'tcpSyn':bool(re.search(r'Flags \[[^\]]*S',payload))})
        lines.append(line)
    counts = Counter(p['interface'] for p in packets)
    details = {}
    for interface in sorted(counts):
        selected = [p for p in packets if p['interface']==interface]
        details[interface] = {
            'packets':len(selected),'incoming':sum(p['direction']=='in' for p in selected),
            'outgoing':sum(p['direction']=='out' for p in selected),
            'quicPackets':sum(p['quic'] for p in selected),
            'outgoingInitialPackets':sum(p['initial'] and p['direction']=='out' for p in selected),
            'outgoingTCPSynPackets':sum(p['tcpSyn'] and p['direction']=='out' for p in selected),
            'firstPacketUnixSeconds':selected[0]['unixSeconds'],
            'lastPacketUnixSeconds':selected[-1]['unixSeconds'],
            'outgoingSourceEndpoints':sorted({p['source'] for p in selected if p['direction']=='out'})}
    restored = result.get('milestones',{}).get('restoredPath',{}).get('deviceUnixSeconds')
    summary = {
        'rawSHA256':hashlib.sha256(raw).hexdigest(),'rawBytes':len(raw),
        'analysisCopyOmittedPrefixBytes':prefix,'pcapngPacketRecords':total,
        'appPID':pid,'filteredAppServerPackets':len(packets),'packetsPerInterface':dict(counts),
        'interfaceDetails':details,
        'packetsAtOrAfterRestoredPathUnixSeconds':dict(Counter(p['interface'] for p in packets if restored is not None and p['unixSeconds']>=restored)),
        'protocolEvidence':result.get('protocolEvidence', {'expectedBaseline':result.get('baselineExpectedProtocol'),'observedProtocolCounts':result.get('observedProtocolCounts',{})}),
        'taskMetricCount':len(metrics),
        'allTaskMetricsReportNonCellular':all(t.get('isCellular') is False for t in metrics),
        'taskMetricLocalEndpoints':sorted({f"{t['localAddress']}.{t['localPort']}" for t in metrics if t.get("localAddress") is not None and t.get("localPort") is not None}),
        'limits':['Only PID-owned records to/from task-metric remote addresses on port 443 are exported.',
                  'Packet/interface metadata is observed; encrypted QUIC PATH/PING frames are not decoded.',
                  'No new Initial in this capture is not a universal absence claim.',
                  'Restored-path comparison uses Unix timestamps; callbacks are not exact physical switch times.']}
    args.output.write_text(json.dumps(summary,indent=2)+'\n')
    args.packet_log.write_text('\n'.join(lines)+'\n')
    print('Validated',total,'capture records;',len(packets),'trial packets;',dict(counts))


if __name__=='__main__':
    main()
