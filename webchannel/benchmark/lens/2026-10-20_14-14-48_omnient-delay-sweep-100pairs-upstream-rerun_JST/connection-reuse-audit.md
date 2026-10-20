# Omnient delay-sweep connection reuse audit

[Report](report.md) · [Artifacts](artifacts.md)

Per-delay audits retain every trial's HTTP/2 connection evidence, initial early POST status, and M1/M3 dispatch. HTTP 400 confirms rejection; client evidence does not identify the server-side cause.

- [0 ms connection reuse audit](delay-0ms/connection-reuse-audit.md)
- [50 ms connection reuse audit](delay-50ms/connection-reuse-audit.md)
- [100 ms connection reuse audit](delay-100ms/connection-reuse-audit.md)
- [150 ms connection reuse audit](delay-150ms/connection-reuse-audit.md)
- [200 ms connection reuse audit](delay-200ms/connection-reuse-audit.md)

## Recorded trial outcomes

All 1,000 entered trials are retained; no failed measurement was retried. All failures were ON trials with `RequestFailed (code 1)`. These are SDK measurement failures, not device-startup failures. Available metrics from failed trials are still included independently in the report. Client logs do not establish the server-side cause of a rejection.

| M1 delay (ms) | Setting | Recorded | Completed | Failed | TTFA observed | TTFD observed |
|---:|---|---:|---:|---:|---:|---:|
| 0 | OFF | 100 | 100 | 0 | 100 | 100 |
| 0 | ON | 100 | 95 | 5 | 96 | 95 |
| 50 | OFF | 100 | 100 | 0 | 100 | 100 |
| 50 | ON | 100 | 93 | 7 | 93 | 93 |
| 100 | OFF | 100 | 100 | 0 | 100 | 100 |
| 100 | ON | 100 | 99 | 1 | 99 | 99 |
| 150 | OFF | 100 | 100 | 0 | 100 | 100 |
| 150 | ON | 100 | 100 | 0 | 100 | 100 |
| 200 | OFF | 100 | 100 | 0 | 100 | 100 |
| 200 | ON | 100 | 99 | 1 | 99 | 99 |
