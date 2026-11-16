# HTTP/3 setup and current blocker

**No WebChannel HTTP/3 fault trial has been counted.** The configured staging
host still negotiates h2 in this setup, despite explicitly enabling QUIC racing.

## Same-iPhone comparison

After all T5 and expiry measurements ended, a separate diagnostic app revision
performed three HEAD requests each on the same iPhone and Wi-Fi, with
`assumesHTTP3Capable=true`:

| Host | Requests | Recorded protocol | Response |
| --- | ---: | --- | --- |
| www.google.com/generate_204 | 3 | h3 in all three | HTTP 204; Alt-Svc advertises h3 on UDP 443 |
| webchannel.sandbox.google.com/staging/channel/generator | 3 | h2 in all three | HTTP 400; no Alt-Svc |

The staging HEAD intentionally lacks WebChannel parameters. Its 400 is a
connectivity response, not an UnknownSessionID SDK failure. This diagnostic
opens no SDK channel and counts as no WebChannel test coverage.

[Diagnostic result](h3-diagnostic-02/result.json), [events](h3-diagnostic-02/events.jsonl).

## Actual WebChannel preflights

Two separate fresh-process SDK preflights enabled the opt-in request decorator.
Each applied the h3-capable property to four WebChannel requests, opened one
channel and received an echo. In both, every recorded transaction negotiated
h2. The handshake header also reported `x-client-wire-protocol: h2`; no Alt-Svc
was present. Cleanup-related transport cancellation events remain in the logs.

[Preflight 1](h3-preflight-01/result.json), [preflight 2](h3-preflight-02/result.json).

## Independent Mac diagnostics

The staging HTTPS DNS (TYPE65) query returned no record. Mac QUIC handshake
probes with ALPN h3 succeeded to www.google.com but timed out to the staging
host, both with automatic address-family selection and with IPv4-only binding.
These are Mac handshake checks, not iPhone HTTP/3 measurements or packet-level
proof that the staging service is unsupported.

[DNS](staging-https-dns.txt), [HEAD headers](staging-head.txt),
[QUIC probe sources and logs](h3-diagnostics/).

## What is needed to proceed

The iPhone and Wi-Fi can demonstrably use h3 for the control host. The
staging-specific endpoint or route remains to be established. This does not
isolate server configuration from network-path filtering or other causes.
Confirm the known-working WebChannel h3 hostname, UDP port and/or Alt-Svc
advertisement with the endpoint owner. The user has been asked for that
connection information; no external message was sent on their behalf.

Only actual WebChannel transactions reporting h3 count toward the required
T2–T5, T7, T9–T15 and M6 variant. Those fault cases and the M6 QUIC parameter /
PING measurement remain pending. A control-host h3 success or h2 fallback
cannot substitute for them.

The hook uses the already-present GTMSessionFetcher decorator and changes only
protocol discovery, not SDK retry/recovery logic. Apple documents
[assumesHTTP3Capable](https://developer.apple.com/documentation/foundation/urlrequest/assumeshttp3capable)
as enabling QUIC racing, not guaranteeing h3. The normal demo and baseline
T5/expiry runs do not enable the hook. No new third-party library was installed.
