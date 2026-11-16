#!/usr/bin/env python3
"""Parse authenticated client CRYPTO fragments from decode-quic-initial.swift.

Input must contain one connection (one DCID). No TLS application secrets or
third-party libraries are used. This cannot identify encrypted 1-RTT PINGs.
"""
import argparse
import json
from pathlib import Path


def reassemble(records):
    accepted = [r for r in records if r.get('verifiedAEAD') is True]
    if not accepted or len({r['dcid'] for r in accepted}) != 1:
        raise ValueError('expected authenticated fragments for exactly one DCID')
    data = {}
    for record in accepted:
        for fragment in record.get('crypto', []):
            offset = fragment['offset']
            if not isinstance(offset, int) or offset < 0:
                raise ValueError('invalid CRYPTO offset')
            for index, value in enumerate(bytes.fromhex(fragment['hex']), offset):
                if index in data and data[index] != value:
                    raise ValueError('conflicting CRYPTO overlap')
                data[index] = value
    if not data or max(data) + 1 != len(data):
        raise ValueError('incomplete CRYPTO stream')
    return bytes(data[i] for i in range(len(data)))


class Reader:
    def __init__(self, data):
        self.data, self.pos = data, 0

    def take(self, count):
        if count < 0 or self.pos + count > len(self.data):
            raise ValueError('truncated input')
        value = self.data[self.pos:self.pos + count]
        self.pos += count
        return value

    def integer(self, count):
        return int.from_bytes(self.take(count), 'big')

    def varint(self):
        first = self.integer(1)
        count = 1 << (first >> 6)
        return ((first & 63) << (8 * (count - 1))) | self.integer(count - 1)

    def done(self):
        return self.pos == len(self.data)


def analyze(records):
    stream = reassemble(records)
    r = Reader(stream)
    if r.integer(1) != 1:
        raise ValueError('expected TLS ClientHello')
    hello = Reader(r.take(r.integer(3)))
    if not r.done():
        raise ValueError('unexpected trailing handshake bytes')
    hello.take(34)  # legacy_version and random
    hello.take(hello.integer(1))
    hello.take(hello.integer(2))
    hello.take(hello.integer(1))
    extensions = Reader(hello.take(hello.integer(2)))
    if not hello.done():
        raise ValueError('trailing ClientHello bytes')
    values = {}
    while not extensions.done():
        kind = extensions.integer(2)
        value = extensions.take(extensions.integer(2))
        if kind in values:
            raise ValueError('duplicate TLS extension')
        values[kind] = value
    if 57 not in values:
        raise ValueError('missing QUIC transport parameters')
    params, q = {}, Reader(values[57])
    while not q.done():
        kind = q.varint()
        value = q.take(q.varint())
        if str(kind) in params:
            raise ValueError('duplicate QUIC transport parameter')
        entry = {'hex': value.hex()}
        if kind in (1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14):
            v = Reader(value)
            entry['value'] = v.varint()
            if not v.done():
                raise ValueError('trailing integer parameter bytes')
        params[str(kind)] = entry
    idle = params.get('1')
    return {
        'dcid': next(r['dcid'] for r in records if r.get('verifiedAEAD') is True),
        'clientInitialAEADVerified': True,
        'clientHelloBytes': len(stream),
        'transportParameters': params,
        'clientMaxIdleTimeoutPresent': idle is not None,
        'clientMaxIdleTimeoutMilliseconds': idle['value'] if idle else None,
        'clientMaxIdleTimeoutDefaultMilliseconds': 0 if idle is None else None,
        'scope': 'Client parameters only; not the effective negotiated idle timeout or PING evidence.',
        'reference': 'https://www.rfc-editor.org/rfc/rfc9000.html#section-18.2',
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    args = parser.parse_args()
    print(json.dumps(analyze([json.loads(line) for line in args.input.read_text().splitlines()]), indent=2))
