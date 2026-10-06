# Omnient delay-sweep connection reuse audit

[Report](report.md) · [Artifacts](artifacts.md)

Per-delay audits retain every trial's HTTP/2 connection evidence, initial early POST status, and M1/M3 dispatch. HTTP 400 confirms rejection; client evidence does not identify the server-side cause.

- [0 ms connection reuse audit](delay-0ms/connection-reuse-audit.md)
- [50 ms connection reuse audit](delay-50ms/connection-reuse-audit.md)
- [100 ms connection reuse audit](delay-100ms/connection-reuse-audit.md)
- [200 ms connection reuse audit](delay-200ms/connection-reuse-audit.md)

## Infrastructure interruptions

Install/launch failures produced no paired benchmark measurement. Their files are retained separately; completed measurement pairs excluded by the histogram rules were not repeated. The interrupted pair was restarted as adjacent OFF/ON trials after reconnecting.

- [delay-100ms-pair-51-locked](infrastructure-attempts/delay-100ms-pair-51-locked/README.md)
- [delay-200ms-pair-76-locked](infrastructure-attempts/delay-200ms-pair-76-locked/README.md)
- [delay-50ms-pair-26-locked](infrastructure-attempts/delay-50ms-pair-26-locked/README.md)
