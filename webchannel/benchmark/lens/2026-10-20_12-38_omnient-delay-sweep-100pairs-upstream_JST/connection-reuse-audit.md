# Omnient delay-sweep connection reuse audit

[Report](report.md) · [Artifacts](artifacts.md)

Per-delay audits retain every trial's HTTP/2 connection evidence, initial early POST status, and M1/M3 dispatch. HTTP 400 confirms rejection; client evidence does not identify the server-side cause.

- [0 ms connection reuse audit](delay-0ms/connection-reuse-audit.md)
- [50 ms connection reuse audit](delay-50ms/connection-reuse-audit.md)
- [100 ms connection reuse audit](delay-100ms/connection-reuse-audit.md)
- [150 ms connection reuse audit](delay-150ms/connection-reuse-audit.md)
- [200 ms connection reuse audit](delay-200ms/connection-reuse-audit.md)

## Recorded trial outcomes

These are outcomes of the requested measurements, not startup failures or histogram selections. Every entered trial is retained; no failed measured trial was replaced. Missing values are counted independently for each metric. Client HTTP logs alone do not establish whether stickiness or request ordering caused a rejection.

| M1 delay (ms) | Setting | Recorded | Completed | Failed | Timeout | TTFA observed | TTFD observed |
|---:|---|---:|---:|---:|---:|---:|---:|
| 0 | OFF | 100 | 100 | 0 | 0 | 100 | 100 |
| 0 | ON | 100 | 72 | 28 | 0 | 72 | 72 |
| 50 | OFF | 100 | 100 | 0 | 0 | 100 | 100 |
| 50 | ON | 100 | 76 | 24 | 0 | 76 | 76 |
| 100 | OFF | 100 | 100 | 0 | 0 | 100 | 100 |
| 100 | ON | 100 | 100 | 0 | 0 | 100 | 100 |
| 150 | OFF | 100 | 100 | 0 | 0 | 100 | 100 |
| 150 | ON | 100 | 100 | 0 | 0 | 100 | 100 |
| 200 | OFF | 100 | 100 | 0 | 0 | 100 | 100 |
| 200 | ON | 100 | 99 | 1 | 0 | 99 | 99 |

Representative error evidence (all remaining trial logs are indexed in the per-delay artifacts):

- 0 ms, ON, original ordinal 20: [original JSON](delay-0ms/attachments/omnient-10-on-attachments/EAE507E5-A2F2-4A9B-98F1-4756A3C3F84D.json), [stdout](delay-0ms/logs/omnient-10-on.log). [12:39:14.686] ❌ <<< [Event: encounteredError] Error: RequestFailed (code 1)
- 50 ms, ON, original ordinal 4: [original JSON](delay-50ms/attachments/omnient-2-on-attachments/2FCCBA21-30CC-4058-A905-2EF14E4E8889.json), [stdout](delay-50ms/logs/omnient-2-on.log). [12:42:50.813] ❌ <<< [Event: encounteredError] Error: RequestFailed (code 1)
- 200 ms, ON, original ordinal 4: [original JSON](delay-200ms/attachments/omnient-2-on-attachments/D43DA489-AB78-4BBE-845E-78731A511EE7.json), [stdout](delay-200ms/logs/omnient-2-on.log). [12:55:25.963] ❌ <<< [Event: encounteredError] Error: RequestFailed (code 1)
