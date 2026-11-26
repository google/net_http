# WebChannel Configuration and API Comparison

Review date: November 27, 2026 (JST).
Source baseline: main at 9fc0143c804a.
This follows the [historical configuration summary](webchannel-behavior-comparison.md).
The current comparison covers Objective-C, the maintained Closure JS reference,
and the independent TypeScript client. Java and Swift are outside this review.
No client implementation is changed.

## Implementations and build outputs

| Implementation | Sources | Output / integration |
|---|---|---|
| JS reference | [imported_src](../js/imported_src/webchannelbase.js) | Separate maintained Closure build into dist/ |
| TypeScript | [src](../js/src/webchannel.ts) | Active npm entry point lib/index.js and generated declarations |
| Objective-C | [native core](../objc/imported_src/WCWebChannelClientInternal.m) | Native client with GTMSessionFetcher adapter |

The original JS bundle is retained unchanged in the repository's test fixtures
as an independent regression baseline. It is not the active npm entry point.
See the [JS package guide](../js/README.md) and [code map](../js/CODE_MAP.md).

## Configuration

Durations in the table are seconds. JS/TS options use milliseconds; Obj-C
uses NSTimeInterval seconds. F means forward channel, B means backchannel.

| Setting | JS reference | TypeScript | Objective-C |
|---|---|---|---|
| Initial wire VER | 8 | 8 | 8 |
| Public wrapper CVER | 22 | 22 | 25 |
| Default fast / blocking handshake | false / false | false / false | false / false |
| Initial handshake watchdog | 45 | 45 | 45 |
| Configured regular F timeout | 20 | 20 | 20 |
| Effective regular F timeout | 50–100% of configured value, rounded in ms | same range, one final rounding | same range, continuous seconds |
| B timeout without advertised keepalive | 45 | 45 | 45 |
| B timeout with positive keepalive K | 1.5 × K | 1.5 × K | 1.5 × K, rounded to ms |
| F / B retry limits | 2 / 3 | 2 / 3 | 2 / 3 |
| Retry base / jitter range | 5 / 10 | 5 / 10 | 5 / 10 |
| Configured forward pool default | 10 | 10 | 10 |
| Effective initial forward pool | 1 unless multiplexing detected | 1 unless multiplexing detected | configured limit |
| Maximum messages per regular POST | 1000, configurable downward | 1000, configurable downward | 1000 |
| Fast-handshake payload threshold | 4096 UTF-16 units | 4096 UTF-16 units | 4096 UTF-8 bytes |
| Default buffering-proxy detection | off | off | off |
| Optional buffering-proxy deadline | handshake RTT × 4 | handshake RTT × 4 when RTT > 0 | handshake RTT × 4 |
| Forced long polling | CI=1, optional TO | CI=1, optional TO | CI=1 |

Sources: [JS state and parameters](../js/imported_src/webchannelbase.js),
[TS state](../js/src/webchannel.ts), [TS option declarations](../js/src/types.ts),
[Obj-C constants](../objc/imported_src/WCWebChannelClientInternal.h),
[Obj-C parameters](../objc/imported_src/WCInternalChannelParams.m).

The configured 20-second F timeout does not set the initial handshake deadline.
A 30-second keepalive produces a 45-second B watchdog in all three clients.
Retry delays use linear backoff with jitter, multiplied by the retry count;
the first retry is immediate. The normal F attempt query starts at t=1 and
increases on retry. failFast disables F retries.

Pool configuration must be distinguished from transport detection. The JS
reference recognizes its existing navigation and wire-protocol signals. TS
also recognizes h3 and case-insensitive protocol headers. Obj-C uses the
configured pool directly. These settings affect batching and concurrency.
See the [JS pool](../js/imported_src/forwardchannelrequestpool.js),
[TS pool](../js/src/pool.ts), and
[Obj-C pool](../objc/imported_src/WCForwardChannelRequestPool.m).

## Features and APIs

| Feature | JS reference | TypeScript | Objective-C |
|---|---|---|---|
| Regular handshake | POST, then backchannel GET | same tested normal sequence | same basic sequence |
| Fast handshake | GET with initial response header | same wire mechanism; can process headers before body arrival | same wire mechanism; processing follows request-ready-state rules |
| Binary wire codec | absent | absent | supported |
| nonBlockingSend / fastHandshake2 | absent | absent | supported |
| Public send input | strings, objects, Map | strings, objects, Map | NSString / NSData |
| Header-overwrite query / encoded init headers | supported | supported | native API has a different option surface |
| HTTP-session routing | supported | supported | supported |
| Runtime | Closure infrastructure | native XHR/Fetch and local event dispatcher | native dispatch queue and HTTP adapter |

Fetch stream reading and the Obj-C binary wire format are separate features.
Text framing counts UTF-16 code units; binary frame sizes count bytes.
The fast-handshake sizing threshold is separate from response framing and
from the total percent-encoded URL length.

The TypeScript package is an independent implementation rather than a syntax
conversion. It provides generated types and public named runtime properties.
The compiled reference's stable exports and imported source methods are not
identical surfaces. Closure event propagation and recovery namespaces require
an explicit migration check; callers should use the TS package's documented
root exports. See [TS exports](../js/src/index.ts) and
[Closure exports](../js/exports.js).

Native extensions need separate tests. Default JS text-mode transcript
comparisons do not establish conformance for binary mode or early sends.

## Validation and limits

Validation performed for this source baseline during the comparison:

| Command, from webchannel/js | Result |
|---|---|
| npm test | Passed: 75 tests; includes local HTTP Fetch streaming, long polling and fast-handshake echo modes |
| npm run typecheck | Passed: library and demo |
| npm run test:legacy | Passed: rebuilt current Closure reference and compared the existing compatibility, Fetch and disposal suites |

Environment: Linux, Node v26.4.0, npm 11.17.0.
These results were obtained during the full local comparison; this documentation
excerpt does not add or rerun tests. Local tests and mock transcripts do not
certify minimum browser versions, CORS, real H2/H3 transport behavior, or
Objective-C behavior on Apple platforms. Objective-C XCTest was not run in
this environment. No new browser or remote-server conformance run was performed.
