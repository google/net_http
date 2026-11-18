# M6: first h3 idle observation and packet instrumentation

Subsequent work successfully collected iPhone qlog and completed three 180 s
observations; see the [session-invalidation follow-up](../../2026-11-18/h3-m6-qlog/report.md).
The partial results below describe the earlier investigation.

The first 180 s idle observation completed with one open session, no SDK error,
no app sends during the idle interval, and six h3 task transactions (zero unknown
or known fallback protocols). This is one valid idle observation, not three
completed M6 repetitions.

`QUIC_LOG_DIRECTORY` was passed to the app's prepared Documents/NetworkFailureQlog
directory. Copying/listing that directory after the run succeeded but found no
files. The reason is not established. Mac-only URLSession and Network.framework
qlog smoke tests generated files; those are not evidence of iPhone PING behavior.
A later diagnostic build adds runtime environment/directory writability evidence;
it was not the build used for this first observation.

The operator enabled Apple RVI and started a filtered tcpdump capture in their
Terminal. The local original is retained outside the repository. Its first
24 bytes are a classic-pcap header followed by a pcapng section; analysis uses a
copy starting at that observed pcapng section. The original remains unchanged.

The trial's task metrics identify local UDP port 58792 and remote
172.217.118.4:443. RVI metadata identifies the Initial packets as owned by the
same app PID 46113 ([excerpt](packet-owner-excerpt.log)). Two authenticated QUIC
v1 client Initials, packet numbers 0 and 1, supply CRYPTO offsets 0/999 and lengths
999/499, reassembling a complete 1498-byte TLS ClientHello. Later Initials with
a changed DCID fail authentication under the decoder's per-packet public-secret
assumption and are not used; Handshake packets are also not treated as Initials.

[Extracted authenticated fragments](net-http-m6-client-initial-reproduced.jsonl),
[parsed transport parameters](net-http-m6-client-parameters-reproduced.json).
The client transport-parameter extension omits `max_idle_timeout` (ID 1).
RFC 9000 specifies a default of zero when omitted, meaning this client value
alone does not impose a timeout. This does **not** establish the server's value,
the effective negotiated timeout, or absence of keepalive.
[Transport-parameter definition](https://www.rfc-editor.org/rfc/rfc9000.html#section-18.2).

The decoder uses Apple CryptoKit/CommonCrypto, with no third-party library. It
was verified against RFC 9001 Appendix A.2: 1200-byte protected packet, successful
AEAD authentication, packet number 2 and expected CRYPTO prefix.
[Vector validation](net-http-quic-vector-validation.json).
The standard-library Python parser rejects unauthenticated input, missing or
conflicting CRYPTO fragments, mixed connections and malformed parameters.

**M6 remains incomplete:** encrypted 1-RTT packet sizes/timing cannot identify
PING frames. iPhone qlog (or other decrypted frame evidence) and the remaining
repetitions are still needed. No PING interval or server timeout is claimed.

## Runtime path diagnostic

After all nine suspension trials completed, diagnostic build E ran a separate
30 s h3 idle observation. Its own runtime log confirms `QUIC_LOG_DIRECTORY`, an
existing directory, and successful test-file write/delete. Copying the directory
still found zero qlog files. This rules out an absent environment variable or a
non-writable app directory in that diagnostic; it does not establish why the
network stack omitted qlog.

Two subsequent debugger setup attempts remained stopped before app startup and
were excluded, not counted as idle measurements. LLDB attachment is asynchronous;
neither an immediately queued continue nor attach's continue option advanced the
initial stopped target in this setup. The controller now waits for the actual
stopped-target transcript before sending continue. A separate 30 s diagnostic
using that readiness wait completed with the target attached and resumed, but
again produced zero qlog files. The debugger transcript and actual h3 metrics
are retained. These setup attempts never injected
network faults or altered the completed OS-suspension suite.
