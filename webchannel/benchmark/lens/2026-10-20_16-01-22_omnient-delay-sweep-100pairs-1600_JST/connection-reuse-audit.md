# Omnient delay-sweep connection reuse audit

[Report](report.md) · [Artifacts](artifacts.md)

Per-delay audits retain every trial's HTTP/2 connection evidence, initial early POST status, and M1/M3 dispatch. HTTP 400 confirms rejection; client evidence does not identify the server-side cause.

- [0 ms connection reuse audit](delay-0ms/connection-reuse-audit.md)
- [50 ms connection reuse audit](delay-50ms/connection-reuse-audit.md)
- [100 ms connection reuse audit](delay-100ms/connection-reuse-audit.md)
- [150 ms connection reuse audit](delay-150ms/connection-reuse-audit.md)
- [200 ms connection reuse audit](delay-200ms/connection-reuse-audit.md)

## Recorded trial outcomes

All 1,000 entered trials completed; every trial used a distinct application process and verified fresh HTTP/2 TCP/TLS transport. No failed measurement was retried. No device-startup interruption occurred. All TTFA and TTFD observations are included independently; HTTP 400 does not exclude a value. Client logs alone do not identify the server-side cause of a rejection.
