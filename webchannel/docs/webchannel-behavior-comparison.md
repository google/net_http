# WebChannel Comparison: Historical Configuration Summary

Review baseline: October 2, 2026. This is a configuration and feature summary
of that review, followed by the [current comparison](webchannel-behavior-comparison-2026-11-27.md).
Historical values describe that source snapshot and must not be treated as
current defaults. This document does not change any client implementation.

## Protocol and configuration

All four implementations reviewed at that time used WebChannel v8.
JavaScript and Java generally expressed configuration durations in milliseconds;
Objective-C and Swift used seconds.

| Setting | JS reference | Java | Objective-C | Swift |
|---|---|---|---|---|
| Public transport CVER | 22 | 22 | 25 | 23 |
| Fast handshake enabled by default | no | no | no | yes |
| Blocking handshake enabled by default | no | no | no | no |
| Initial handshake watchdog, seconds | 45 | 45 | 45 | 20 |
| Configured forward timeout, seconds | 20 | 20 | 20 | 20 internally |
| Maximum messages in a regular POST | 1000, configurable downward | 1000 | 1000 | 1000 |
| Fast-handshake payload sizing | UTF-16 units | UTF-16 units | UTF-8 bytes | UTF-8 bytes |

The fast-handshake payload threshold was 4096 in the units shown above;
it was not a bound on the fully encoded URL length.

## Feature boundaries

The Objective-C client provided binary transport, nonBlockingSend and
fastHandshake2 extensions. Those extensions were distinct from the JS
useFetchStreams transport option. The iOS SwiftUI demo under objc used the
Objective-C client; it was not a test of the independent Swift client.

A configured forward concurrency limit was not necessarily the effective
pool size: the JS reference selected a conservative pool until multiplexing
was detected, while native implementations used their configured pool.
Applications should distinguish request retry from new-session reconnection.

## Historical validation limits

The historical review used source inspection and local mock checks. It did
not execute the Java Maven suite, Objective-C XCTest, the Closure browser unit
suite, or a real-server soak comparison. This summary makes no claim of
cross-language conformance. Java and Swift require a separate current review.
