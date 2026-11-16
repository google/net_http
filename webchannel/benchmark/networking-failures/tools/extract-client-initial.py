#!/usr/bin/env python3
"""Extract one IPv4 UDP flow's client Initials using macOS tcpdump and Swift.

Keeps the original capture unchanged. RVI captures observed on this machine
have a 24-byte classic-pcap prefix before a pcapng section; only an analysis
copy has that prefix removed. IPv6/fragmented IPv4 are rejected explicitly.
"""
import argparse
import json
from pathlib import Path
import subprocess
import tempfile


def extract(text):
    title, chunks = '', []
    for line in text.splitlines() + ['END']:
        if line.startswith('\t0x'):
            chunks.append(''.join(line.split(':', 1)[1].split()))
            continue
        if chunks:
            packet = bytes.fromhex(''.join(chunks))
            if len(packet) < 28 or packet[0] >> 4 != 4:
                raise ValueError('only IPv4 packets are supported')
            ihl = (packet[0] & 15) * 4
            if ihl < 20 or packet[9] != 17 or int.from_bytes(packet[6:8], 'big') & 0x3fff:
                raise ValueError('expected unfragmented IPv4 UDP')
            udp = packet[ihl:]
            size = int.from_bytes(udp[4:6], 'big')
            if size < 8 or len(udp) < size:
                raise ValueError('truncated UDP')
            payload = udp[8:size]
            if payload and payload[0] & 0xc0 == 0xc0:
                yield {'packet': title, 'payloadHex': payload.hex()}
        title, chunks = line, []


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('capture', type=Path)
    parser.add_argument('--local-port', type=int, required=True)
    parser.add_argument('--decoder', type=Path, required=True)
    args = parser.parse_args()
    if not 1 <= args.local_port <= 65535:
        parser.error('invalid UDP port')
    data = args.capture.read_bytes()
    prefix = data[:4] == bytes.fromhex('d4c3b2a1') and data[24:28] == bytes.fromhex('0a0d0d0a')
    with tempfile.TemporaryDirectory(prefix='net-http-initial-') as directory:
        view = Path(directory) / 'analysis.pcapng'
        view.write_bytes(data[24:] if prefix else data)
        result = subprocess.run(['/usr/sbin/tcpdump', '-r', str(view), '-nn', '-tt', '-x',
                                 f'udp src port {args.local_port} and dst port 443'],
                                text=True, capture_output=True, check=True)
        records = list(extract(result.stdout))
        decoded = subprocess.run([str(args.decoder)], text=True, capture_output=True,
                                 input=''.join(json.dumps(r) + '\n' for r in records), check=True)
        print(decoded.stdout, end='')


if __name__ == '__main__':
    main()
