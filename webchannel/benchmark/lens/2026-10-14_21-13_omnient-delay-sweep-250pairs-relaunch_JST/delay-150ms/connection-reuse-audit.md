# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 110.000 | 79.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 33.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 53.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 56.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 96.000 | 71.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 60.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 48.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 39.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 100.000 | 70.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 65.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 86.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 234.000 | 217.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 48.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 71.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 46.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 71.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 44.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 61.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 42.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 80.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 72.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 92.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 54.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 46.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 43.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 58.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 36.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 68.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 66.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 72.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 61.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 58.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 40.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 78.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 400 | handshake | h2 | false | 428.000 | 405.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 90.000 | 71.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 82.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 45.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 70.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 89.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 62.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 78.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 71.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 41.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 37.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 38.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 55.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 70.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 49.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 62.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 170.000 | 156.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 68.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 240.000 | 184.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 58.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | failed | unknown | handshake | h2 | false | 158.000 | 143.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 51.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 116.000 | 95.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 41.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 50.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 71.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 91.000 | 68.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 41.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 400 | handshake | h2 | false | 203.000 | 189.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 252.000 | 196.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 134.000 | 117.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 41.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 67.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 48.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 44.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 72.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 63.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 43.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 42.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 55.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 112.000 | 88.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 42.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 85.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 50.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 46.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 78.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 97.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 474.000 | 457.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 45.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 400 | handshake | h2 | false | 179.000 | 138.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 40.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 62.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 78.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 51.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 47.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 44.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 64.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 52.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 72.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 81.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 65.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 77.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 77.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 38.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 62.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 56.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 64.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 60.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 117.000 | 91.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 121.000 | 65.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 90.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 32.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 68.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 58.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 90.000 | 71.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 33.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 71.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 48.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 35.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 64.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 54.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 78.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 80.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 63.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 107.000 | 95.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 65.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 71.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 74.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 42.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 67.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 55.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 80.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 54.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 69.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 102.000 | 85.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | OFF | completed | — | handshake | h2 | false | 59.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | ON | completed | 200 | handshake | h2 | false | 68.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | OFF | completed | — | handshake | h2 | false | 40.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | ON | completed | 200 | handshake | h2 | false | 43.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | ON | completed | 200 | handshake | h2 | false | 65.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | ON | completed | 200 | handshake | h2 | false | 48.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | OFF | completed | — | handshake | h2 | false | 47.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | ON | completed | 200 | handshake | h2 | false | 44.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | OFF | completed | — | handshake | h2 | false | 50.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | OFF | completed | — | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | ON | completed | 200 | handshake | h2 | false | 62.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | ON | completed | 200 | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | ON | completed | 200 | handshake | h2 | false | 65.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | ON | completed | 200 | handshake | h2 | false | 45.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | ON | completed | 200 | handshake | h2 | false | 79.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | OFF | completed | — | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | ON | completed | 200 | handshake | h2 | false | 92.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | OFF | completed | — | handshake | h2 | false | 61.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | ON | completed | 200 | handshake | h2 | false | 173.000 | 115.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | OFF | completed | — | handshake | h2 | false | 60.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | OFF | completed | — | handshake | h2 | false | 69.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | ON | completed | 200 | handshake | h2 | false | 49.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | OFF | completed | — | handshake | h2 | false | 62.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | ON | completed | 200 | handshake | h2 | false | 125.000 | 116.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | OFF | completed | — | handshake | h2 | false | 70.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | ON | completed | 200 | handshake | h2 | false | 94.000 | 67.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | OFF | completed | — | handshake | h2 | false | 57.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | ON | completed | 200 | handshake | h2 | false | 49.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | OFF | completed | — | handshake | h2 | false | 84.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | ON | completed | 400 | handshake | h2 | false | 182.000 | 166.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | OFF | completed | — | handshake | h2 | false | 70.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | ON | completed | 200 | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | OFF | completed | — | handshake | h2 | false | 90.000 | 77.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | ON | completed | 200 | handshake | h2 | false | 121.000 | 79.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | OFF | completed | — | handshake | h2 | false | 63.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | ON | completed | 200 | handshake | h2 | false | 75.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 127 | OFF | completed | — | handshake | h2 | false | 42.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 127 | ON | completed | 200 | handshake | h2 | false | 47.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 128 | OFF | completed | — | handshake | h2 | false | 66.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 128 | ON | completed | 200 | handshake | h2 | false | 141.000 | 101.000 | 2404:6800:400b:c019::451 |
| omnient | 129 | OFF | completed | — | handshake | h2 | false | 67.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 129 | ON | completed | 200 | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 130 | OFF | completed | — | handshake | h2 | false | 33.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 130 | ON | completed | 200 | handshake | h2 | false | 93.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 131 | OFF | completed | — | handshake | h2 | false | 50.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 131 | ON | completed | 200 | handshake | h2 | false | 63.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 132 | OFF | completed | — | handshake | h2 | false | 44.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 132 | ON | completed | 200 | handshake | h2 | false | 112.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 133 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 133 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 134 | OFF | completed | — | handshake | h2 | false | 85.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 134 | ON | completed | 200 | handshake | h2 | false | 96.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 135 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 135 | ON | completed | 200 | handshake | h2 | false | 55.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 136 | OFF | completed | — | handshake | h2 | false | 50.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 136 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 137 | OFF | completed | — | handshake | h2 | false | 68.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 137 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 138 | OFF | completed | — | handshake | h2 | false | 67.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 138 | ON | completed | 200 | handshake | h2 | false | 37.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 139 | OFF | completed | — | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 139 | ON | completed | 200 | handshake | h2 | false | 82.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 140 | OFF | completed | — | handshake | h2 | false | 45.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 140 | ON | completed | 200 | handshake | h2 | false | 63.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 141 | OFF | completed | — | handshake | h2 | false | 79.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 141 | ON | completed | unknown | handshake | h2 | false | 43.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 142 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 142 | ON | completed | 200 | handshake | h2 | false | 62.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 143 | OFF | completed | — | handshake | h2 | false | 62.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 143 | ON | completed | 200 | handshake | h2 | false | 91.000 | 68.000 | 2404:6800:400b:c019::451 |
| omnient | 144 | OFF | completed | — | handshake | h2 | false | 82.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 144 | ON | completed | 200 | handshake | h2 | false | 60.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 145 | OFF | completed | — | handshake | h2 | false | 45.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 145 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 146 | OFF | completed | — | handshake | h2 | false | 33.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 146 | ON | completed | 200 | handshake | h2 | false | 50.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 147 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 147 | ON | completed | 200 | handshake | h2 | false | 40.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 148 | OFF | completed | — | handshake | h2 | false | 87.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 148 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 149 | OFF | completed | — | handshake | h2 | false | 141.000 | 126.000 | 2404:6800:400b:c019::451 |
| omnient | 149 | ON | completed | 200 | handshake | h2 | false | 65.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 150 | OFF | completed | — | handshake | h2 | false | 46.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 150 | ON | completed | 200 | handshake | h2 | false | 81.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 151 | OFF | completed | — | handshake | h2 | false | 57.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 151 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 152 | OFF | completed | — | handshake | h2 | false | 78.000 | 65.000 | 2404:6800:400b:c019::451 |
| omnient | 152 | ON | completed | 200 | handshake | h2 | false | 97.000 | 83.000 | 2404:6800:400b:c019::451 |
| omnient | 153 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 153 | ON | completed | 200 | handshake | h2 | false | 88.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 154 | OFF | completed | — | handshake | h2 | false | 115.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 154 | ON | completed | 200 | handshake | h2 | false | 75.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 155 | OFF | completed | — | handshake | h2 | false | 38.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 155 | ON | completed | 200 | handshake | h2 | false | 36.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 156 | OFF | completed | — | handshake | h2 | false | 91.000 | 64.000 | 2404:6800:400b:c019::451 |
| omnient | 156 | ON | completed | 200 | handshake | h2 | false | 45.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 157 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 157 | ON | completed | 200 | handshake | h2 | false | 42.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 158 | OFF | completed | — | handshake | h2 | false | 70.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 158 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 159 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 159 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 160 | OFF | completed | — | handshake | h2 | false | 42.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 160 | ON | completed | 200 | handshake | h2 | false | 59.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 161 | OFF | completed | — | handshake | h2 | false | 78.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 161 | ON | completed | 200 | handshake | h2 | false | 54.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 162 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 162 | ON | completed | 200 | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 163 | OFF | completed | — | handshake | h2 | false | 42.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 163 | ON | completed | 200 | handshake | h2 | false | 38.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 164 | OFF | completed | — | handshake | h2 | false | 124.000 | 80.000 | 2404:6800:400b:c017::451 |
| omnient | 164 | ON | completed | 200 | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 165 | OFF | completed | — | handshake | h2 | false | 38.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 165 | ON | completed | 200 | handshake | h2 | false | 55.000 | 41.000 | 2404:6800:400b:c017::451 |
| omnient | 166 | OFF | completed | — | handshake | h2 | false | 65.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 166 | ON | completed | 200 | handshake | h2 | false | 38.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 167 | OFF | completed | — | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 167 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 168 | OFF | completed | — | handshake | h2 | false | 57.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 168 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 169 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 169 | ON | completed | 200 | handshake | h2 | false | 65.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 170 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 170 | ON | completed | 200 | handshake | h2 | false | 50.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 171 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 171 | ON | completed | 200 | handshake | h2 | false | 50.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 172 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 172 | ON | completed | 200 | handshake | h2 | false | 42.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 173 | OFF | completed | — | handshake | h2 | false | 46.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 173 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 174 | OFF | completed | — | handshake | h2 | false | 104.000 | 62.000 | 2404:6800:400b:c017::451 |
| omnient | 174 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 175 | OFF | completed | — | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 175 | ON | completed | 200 | handshake | h2 | false | 118.000 | 48.000 | 2404:6800:400b:c017::451 |
| omnient | 176 | OFF | completed | — | handshake | h2 | false | 64.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 176 | ON | completed | 200 | handshake | h2 | false | 50.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 177 | OFF | completed | — | handshake | h2 | false | 45.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 177 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 178 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 178 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 179 | OFF | completed | — | handshake | h2 | false | 64.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 179 | ON | completed | 200 | handshake | h2 | false | 52.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 180 | OFF | completed | — | handshake | h2 | false | 60.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 180 | ON | completed | 200 | handshake | h2 | false | 81.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 181 | OFF | completed | — | handshake | h2 | false | 48.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 181 | ON | completed | 400 | handshake | h2 | false | 146.000 | 113.000 | 2404:6800:400b:c017::451 |
| omnient | 182 | OFF | completed | — | handshake | h2 | false | 60.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 182 | ON | completed | 200 | handshake | h2 | false | 42.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 183 | OFF | completed | — | handshake | h2 | false | 35.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 183 | ON | completed | 400 | handshake | h2 | false | 106.000 | 94.000 | 2404:6800:400b:c017::451 |
| omnient | 184 | OFF | completed | — | handshake | h2 | false | 70.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 184 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 185 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 185 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 186 | OFF | completed | — | handshake | h2 | false | 62.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 186 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 187 | OFF | completed | — | handshake | h2 | false | 36.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 187 | ON | completed | 200 | handshake | h2 | false | 93.000 | 80.000 | 2404:6800:400b:c017::451 |
| omnient | 188 | OFF | completed | — | handshake | h2 | false | 61.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 188 | ON | completed | 200 | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 189 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 189 | ON | completed | 200 | handshake | h2 | false | 52.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 190 | OFF | completed | — | handshake | h2 | false | 92.000 | 72.000 | 2404:6800:400b:c017::451 |
| omnient | 190 | ON | completed | 200 | handshake | h2 | false | 45.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 191 | OFF | completed | — | handshake | h2 | false | 432.000 | 414.000 | 2404:6800:400b:c017::451 |
| omnient | 191 | ON | completed | 200 | handshake | h2 | false | 130.000 | 112.000 | 2404:6800:400b:c017::451 |
| omnient | 192 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 192 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 193 | OFF | completed | — | handshake | h2 | false | 85.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 193 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 194 | OFF | completed | — | handshake | h2 | false | 54.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 194 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 195 | OFF | completed | — | handshake | h2 | false | 99.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 195 | ON | completed | 200 | handshake | h2 | false | 49.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 196 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 196 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 197 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 197 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 198 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 198 | ON | completed | 200 | handshake | h2 | false | 22.000 | 11.000 | 2404:6800:400b:c017::451 |
| omnient | 199 | OFF | completed | — | handshake | h2 | false | 96.000 | 84.000 | 2404:6800:400b:c017::451 |
| omnient | 199 | ON | completed | 200 | handshake | h2 | false | 39.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 200 | OFF | completed | — | handshake | h2 | false | 205.000 | 170.000 | 2404:6800:400b:c017::451 |
| omnient | 200 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 201 | OFF | completed | — | handshake | h2 | false | 95.000 | 53.000 | 2404:6800:400b:c017::451 |
| omnient | 201 | ON | completed | 200 | handshake | h2 | false | 233.000 | 204.000 | 2404:6800:400b:c017::451 |
| omnient | 202 | OFF | completed | — | handshake | h2 | false | 62.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 202 | ON | completed | 200 | handshake | h2 | false | 64.000 | 53.000 | 2404:6800:400b:c017::451 |
| omnient | 203 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 203 | ON | completed | 200 | handshake | h2 | false | 49.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 204 | OFF | completed | — | handshake | h2 | false | 50.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 204 | ON | completed | 200 | handshake | h2 | false | 58.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 205 | OFF | completed | — | handshake | h2 | false | 215.000 | 188.000 | 2404:6800:400b:c017::451 |
| omnient | 205 | ON | completed | 200 | handshake | h2 | false | 86.000 | 53.000 | 2404:6800:400b:c017::451 |
| omnient | 206 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 206 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 207 | OFF | completed | — | handshake | h2 | false | 63.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 207 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 208 | OFF | completed | — | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 208 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 209 | OFF | completed | — | handshake | h2 | false | 53.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 209 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 210 | OFF | completed | — | handshake | h2 | false | 74.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 210 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 211 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 211 | ON | completed | 200 | handshake | h2 | false | 42.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 212 | OFF | completed | — | handshake | h2 | false | 45.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 212 | ON | completed | 200 | handshake | h2 | false | 22.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 213 | OFF | completed | — | handshake | h2 | false | 47.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 213 | ON | completed | 200 | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 214 | OFF | completed | — | handshake | h2 | false | 85.000 | 56.000 | 2404:6800:400b:c017::451 |
| omnient | 214 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 215 | OFF | completed | — | handshake | h2 | false | 239.000 | 221.000 | 2404:6800:400b:c017::451 |
| omnient | 215 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 216 | OFF | completed | — | handshake | h2 | false | 48.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 216 | ON | completed | 200 | handshake | h2 | false | 38.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 217 | OFF | completed | — | handshake | h2 | false | 197.000 | 176.000 | 2404:6800:400b:c017::451 |
| omnient | 217 | ON | completed | 200 | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 218 | OFF | completed | — | handshake | h2 | false | 155.000 | 139.000 | 2404:6800:400b:c017::451 |
| omnient | 218 | ON | completed | 200 | handshake | h2 | false | 80.000 | 69.000 | 2404:6800:400b:c017::451 |
| omnient | 219 | OFF | completed | — | handshake | h2 | false | 45.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 219 | ON | completed | 200 | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 220 | OFF | completed | — | handshake | h2 | false | 91.000 | 80.000 | 2404:6800:400b:c017::451 |
| omnient | 220 | ON | completed | 200 | handshake | h2 | false | 110.000 | 93.000 | 2404:6800:400b:c017::451 |
| omnient | 221 | OFF | completed | — | handshake | h2 | false | 55.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 221 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 222 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 222 | ON | completed | 200 | handshake | h2 | false | 39.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 223 | OFF | completed | — | handshake | h2 | false | 63.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 223 | ON | completed | 200 | handshake | h2 | false | 45.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 224 | OFF | completed | — | handshake | h2 | false | 41.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 224 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 225 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 225 | ON | completed | 200 | handshake | h2 | false | 83.000 | 49.000 | 2404:6800:400b:c017::451 |
| omnient | 226 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 226 | ON | completed | 200 | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 227 | OFF | completed | — | handshake | h2 | false | 43.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 227 | ON | completed | 200 | handshake | h2 | false | 50.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 228 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 228 | ON | completed | 200 | handshake | h2 | false | 46.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 229 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 229 | ON | completed | 200 | handshake | h2 | false | 68.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 230 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 230 | ON | completed | 200 | handshake | h2 | false | 65.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 231 | OFF | completed | — | handshake | h2 | false | 54.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 231 | ON | completed | 200 | handshake | h2 | false | 72.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 232 | OFF | completed | — | handshake | h2 | false | 48.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 232 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 233 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 233 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 234 | OFF | completed | — | handshake | h2 | false | 85.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 234 | ON | completed | 200 | handshake | h2 | false | 51.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 235 | OFF | completed | — | handshake | h2 | false | 154.000 | 96.000 | 2404:6800:400b:c017::451 |
| omnient | 235 | ON | completed | 200 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 236 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 236 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 237 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 237 | ON | completed | 200 | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 238 | OFF | completed | — | handshake | h2 | false | 85.000 | 52.000 | 2404:6800:400b:c017::451 |
| omnient | 238 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 239 | OFF | completed | — | handshake | h2 | false | 60.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 239 | ON | completed | 200 | handshake | h2 | false | 72.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 240 | OFF | completed | — | handshake | h2 | false | 51.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 240 | ON | completed | 200 | handshake | h2 | false | 93.000 | 52.000 | 2404:6800:400b:c017::451 |
| omnient | 241 | OFF | completed | — | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 241 | ON | completed | 200 | handshake | h2 | false | 58.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 242 | OFF | completed | — | handshake | h2 | false | 83.000 | 47.000 | 2404:6800:400b:c017::451 |
| omnient | 242 | ON | completed | 200 | handshake | h2 | false | 140.000 | 74.000 | 2404:6800:400b:c017::451 |
| omnient | 243 | OFF | completed | — | handshake | h2 | false | 56.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 243 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 244 | OFF | completed | — | handshake | h2 | false | 104.000 | 63.000 | 2404:6800:400b:c017::451 |
| omnient | 244 | ON | completed | 200 | handshake | h2 | false | 54.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 245 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 245 | ON | completed | 200 | handshake | h2 | false | 45.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 246 | OFF | completed | — | handshake | h2 | false | 82.000 | 53.000 | 2404:6800:400b:c017::451 |
| omnient | 246 | ON | completed | 200 | handshake | h2 | false | 103.000 | 52.000 | 2404:6800:400b:c017::451 |
| omnient | 247 | OFF | completed | — | handshake | h2 | false | 130.000 | 73.000 | 2404:6800:400b:c017::451 |
| omnient | 247 | ON | completed | 200 | handshake | h2 | false | 83.000 | 71.000 | 2404:6800:400b:c017::451 |
| omnient | 248 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 248 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 249 | OFF | completed | — | handshake | h2 | false | 133.000 | 63.000 | 2404:6800:400b:c017::451 |
| omnient | 249 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 250 | OFF | completed | — | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 250 | ON | completed | 200 | handshake | h2 | false | 72.000 | 62.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 152.843 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 154.071 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 151.374 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 156.212 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 156.476 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 154.386 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 154.253 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 152.991 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 154.348 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 150.748 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 156.295 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 157.218 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 154.363 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 151.407 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 156.442 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 151.352 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 151.339 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 151.845 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 153.106 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 155.942 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 152.492 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 155.862 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 156.807 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 151.146 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 155.836 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 155.308 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 155.407 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 151.052 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 150.611 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 155.963 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 151.014 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 155.108 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 155.690 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 153.974 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 156.182 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 151.150 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 156.596 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 155.739 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 156.085 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 150.343 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 155.396 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 154.149 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 157.357 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 157.401 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 157.298 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 155.549 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 155.390 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 157.362 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 156.172 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 155.843 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 150.588 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 157.844 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 150.747 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 155.826 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 153.615 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 156.034 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 154.236 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 153.072 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 156.112 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 156.411 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 157.502 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 150.817 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 156.327 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 157.771 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 153.968 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 155.985 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 156.861 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 156.821 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 156.574 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 151.668 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 155.193 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 155.578 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 156.682 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 156.477 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 154.722 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 155.636 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 152.547 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 154.870 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 155.901 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 156.447 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 154.215 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 154.343 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 151.520 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 151.124 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 154.963 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 155.882 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 157.516 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 156.612 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 155.772 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 155.966 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 154.967 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 150.307 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 156.288 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 154.088 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 157.530 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 156.022 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 157.233 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 155.940 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 156.040 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 156.348 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 155.025 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 153.896 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 156.287 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 155.760 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 157.859 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 151.277 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 156.117 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 156.482 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 156.641 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 154.933 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 156.067 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 156.102 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 156.360 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 155.831 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 156.783 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 157.310 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 156.332 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 151.548 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 154.023 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 157.781 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 157.331 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 155.829 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 151.735 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 155.775 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 156.643 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 155.962 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 155.497 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 156.673 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 156.702 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 155.405 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 151.125 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 156.613 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 156.709 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 154.789 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 152.992 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 156.754 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 156.328 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 155.724 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 153.293 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 155.320 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 156.314 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 156.021 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 154.938 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 155.951 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 153.890 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 156.087 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 151.489 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 154.996 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 155.415 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 155.991 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 155.010 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 156.320 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 154.810 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 156.456 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 155.692 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 156.299 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 157.206 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 156.187 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 156.506 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 154.751 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 155.707 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 150.815 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 151.525 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 155.330 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 155.405 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 156.623 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 157.847 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 156.649 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 156.585 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 150.568 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 156.894 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 156.496 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 151.513 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 156.476 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 156.077 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 155.608 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 156.428 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 156.956 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 151.241 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 157.989 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 155.598 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 156.568 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 157.780 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 154.605 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 151.539 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 156.310 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 150.369 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 155.952 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 154.923 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 156.609 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 156.668 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 155.567 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 154.551 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 156.225 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 151.881 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 152.141 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 156.047 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 150.318 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 153.488 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 155.795 | count=0 | early POST | early POST |
| omnient | 101 | OFF | 154.649 | count=0 | post-open POST | post-open POST |
| omnient | 101 | ON | 155.858 | count=0 | early POST | early POST |
| omnient | 102 | OFF | 157.487 | count=0 | post-open POST | post-open POST |
| omnient | 102 | ON | 156.241 | count=0 | early POST | early POST |
| omnient | 103 | OFF | 154.363 | count=0 | post-open POST | post-open POST |
| omnient | 103 | ON | 156.591 | count=0 | early POST | early POST |
| omnient | 104 | OFF | 150.889 | count=0 | post-open POST | post-open POST |
| omnient | 104 | ON | 150.388 | count=0 | early POST | early POST |
| omnient | 105 | OFF | 152.545 | count=0 | post-open POST | post-open POST |
| omnient | 105 | ON | 152.281 | count=0 | early POST | early POST |
| omnient | 106 | OFF | 154.942 | count=0 | post-open POST | post-open POST |
| omnient | 106 | ON | 156.524 | count=0 | early POST | early POST |
| omnient | 107 | OFF | 156.349 | count=0 | post-open POST | post-open POST |
| omnient | 107 | ON | 150.700 | count=0 | early POST | early POST |
| omnient | 108 | OFF | 156.457 | count=0 | post-open POST | post-open POST |
| omnient | 108 | ON | 150.520 | count=0 | early POST | early POST |
| omnient | 109 | OFF | 155.273 | count=0 | post-open POST | post-open POST |
| omnient | 109 | ON | 156.471 | count=0 | early POST | early POST |
| omnient | 110 | OFF | 156.312 | count=0 | post-open POST | post-open POST |
| omnient | 110 | ON | 156.207 | count=0 | early POST | early POST |
| omnient | 111 | OFF | 155.223 | count=0 | post-open POST | post-open POST |
| omnient | 111 | ON | 151.695 | count=0 | early POST | early POST |
| omnient | 112 | OFF | 152.449 | count=0 | post-open POST | post-open POST |
| omnient | 112 | ON | 157.856 | count=0 | early POST | early POST |
| omnient | 113 | OFF | 151.812 | count=0 | post-open POST | post-open POST |
| omnient | 113 | ON | 150.957 | count=0 | early POST | early POST |
| omnient | 114 | OFF | 156.997 | count=0 | post-open POST | post-open POST |
| omnient | 114 | ON | 156.067 | count=0 | early POST | early POST |
| omnient | 115 | OFF | 157.903 | count=0 | post-open POST | post-open POST |
| omnient | 115 | ON | 155.354 | count=0 | early POST | early POST |
| omnient | 116 | OFF | 156.298 | count=0 | post-open POST | post-open POST |
| omnient | 116 | ON | 151.488 | count=0 | early POST | early POST |
| omnient | 117 | OFF | 154.662 | count=0 | post-open POST | post-open POST |
| omnient | 117 | ON | 157.731 | count=0 | early POST | early POST |
| omnient | 118 | OFF | 154.330 | count=0 | post-open POST | post-open POST |
| omnient | 118 | ON | 152.819 | count=0 | early POST | early POST |
| omnient | 119 | OFF | 156.435 | count=0 | post-open POST | post-open POST |
| omnient | 119 | ON | 156.077 | count=0 | early POST | early POST |
| omnient | 120 | OFF | 153.878 | count=0 | post-open POST | post-open POST |
| omnient | 120 | ON | 154.141 | count=0 | early POST | early POST |
| omnient | 121 | OFF | 153.717 | count=0 | post-open POST | post-open POST |
| omnient | 121 | ON | 151.342 | count=0 | early POST | early POST |
| omnient | 122 | OFF | 155.646 | count=0 | post-open POST | post-open POST |
| omnient | 122 | ON | 156.102 | count=0 | early POST | early POST |
| omnient | 123 | OFF | 151.153 | count=0 | post-open POST | post-open POST |
| omnient | 123 | ON | 155.576 | count=0 | early POST | early POST |
| omnient | 124 | OFF | 155.799 | count=0 | post-open POST | post-open POST |
| omnient | 124 | ON | 155.763 | count=0 | early POST | early POST |
| omnient | 125 | OFF | 151.643 | count=0 | post-open POST | post-open POST |
| omnient | 125 | ON | 157.099 | count=0 | early POST | early POST |
| omnient | 126 | OFF | 154.568 | count=0 | post-open POST | post-open POST |
| omnient | 126 | ON | 151.016 | count=0 | early POST | early POST |
| omnient | 127 | OFF | 150.858 | count=0 | post-open POST | post-open POST |
| omnient | 127 | ON | 151.748 | count=0 | early POST | early POST |
| omnient | 128 | OFF | 156.493 | count=0 | post-open POST | post-open POST |
| omnient | 128 | ON | 153.590 | count=0 | early POST | early POST |
| omnient | 129 | OFF | 156.573 | count=0 | post-open POST | post-open POST |
| omnient | 129 | ON | 156.638 | count=0 | early POST | early POST |
| omnient | 130 | OFF | 153.450 | count=0 | post-open POST | post-open POST |
| omnient | 130 | ON | 151.179 | count=0 | early POST | early POST |
| omnient | 131 | OFF | 156.259 | count=0 | post-open POST | post-open POST |
| omnient | 131 | ON | 155.241 | count=0 | early POST | early POST |
| omnient | 132 | OFF | 155.413 | count=0 | post-open POST | post-open POST |
| omnient | 132 | ON | 150.573 | count=0 | early POST | early POST |
| omnient | 133 | OFF | 155.937 | count=0 | post-open POST | post-open POST |
| omnient | 133 | ON | 150.460 | count=0 | early POST | early POST |
| omnient | 134 | OFF | 156.924 | count=0 | post-open POST | post-open POST |
| omnient | 134 | ON | 156.498 | count=0 | early POST | early POST |
| omnient | 135 | OFF | 153.227 | count=0 | post-open POST | post-open POST |
| omnient | 135 | ON | 155.402 | count=0 | early POST | early POST |
| omnient | 136 | OFF | 156.615 | count=0 | post-open POST | post-open POST |
| omnient | 136 | ON | 156.069 | count=0 | early POST | early POST |
| omnient | 137 | OFF | 156.650 | count=0 | post-open POST | post-open POST |
| omnient | 137 | ON | 155.748 | count=0 | early POST | early POST |
| omnient | 138 | OFF | 156.220 | count=0 | post-open POST | post-open POST |
| omnient | 138 | ON | 156.394 | count=0 | early POST | early POST |
| omnient | 139 | OFF | 151.702 | count=0 | post-open POST | post-open POST |
| omnient | 139 | ON | 153.022 | count=0 | early POST | early POST |
| omnient | 140 | OFF | 156.590 | count=0 | post-open POST | post-open POST |
| omnient | 140 | ON | 153.824 | count=0 | early POST | early POST |
| omnient | 141 | OFF | 155.096 | count=0 | post-open POST | post-open POST |
| omnient | 141 | ON | 152.132 | count=0 | early POST | early POST |
| omnient | 142 | OFF | 155.828 | count=0 | post-open POST | post-open POST |
| omnient | 142 | ON | 157.842 | count=0 | early POST | early POST |
| omnient | 143 | OFF | 152.350 | count=0 | post-open POST | post-open POST |
| omnient | 143 | ON | 156.780 | count=0 | early POST | early POST |
| omnient | 144 | OFF | 151.554 | count=0 | post-open POST | post-open POST |
| omnient | 144 | ON | 153.720 | count=0 | early POST | early POST |
| omnient | 145 | OFF | 152.876 | count=0 | post-open POST | post-open POST |
| omnient | 145 | ON | 155.611 | count=0 | early POST | early POST |
| omnient | 146 | OFF | 150.429 | count=0 | post-open POST | post-open POST |
| omnient | 146 | ON | 152.905 | count=0 | early POST | early POST |
| omnient | 147 | OFF | 150.529 | count=0 | post-open POST | post-open POST |
| omnient | 147 | ON | 150.862 | count=0 | early POST | early POST |
| omnient | 148 | OFF | 155.207 | count=0 | post-open POST | post-open POST |
| omnient | 148 | ON | 155.545 | count=0 | early POST | early POST |
| omnient | 149 | OFF | 150.428 | count=0 | post-open POST | post-open POST |
| omnient | 149 | ON | 153.550 | count=0 | early POST | early POST |
| omnient | 150 | OFF | 155.777 | count=0 | post-open POST | post-open POST |
| omnient | 150 | ON | 150.412 | count=0 | early POST | early POST |
| omnient | 151 | OFF | 155.968 | count=0 | post-open POST | post-open POST |
| omnient | 151 | ON | 154.996 | count=0 | early POST | early POST |
| omnient | 152 | OFF | 156.586 | count=0 | post-open POST | post-open POST |
| omnient | 152 | ON | 155.785 | count=0 | early POST | early POST |
| omnient | 153 | OFF | 152.382 | count=0 | post-open POST | post-open POST |
| omnient | 153 | ON | 156.279 | count=0 | early POST | early POST |
| omnient | 154 | OFF | 150.570 | count=0 | post-open POST | post-open POST |
| omnient | 154 | ON | 156.562 | count=0 | early POST | early POST |
| omnient | 155 | OFF | 153.600 | count=0 | post-open POST | post-open POST |
| omnient | 155 | ON | 153.951 | count=0 | early POST | early POST |
| omnient | 156 | OFF | 155.663 | count=0 | post-open POST | post-open POST |
| omnient | 156 | ON | 151.154 | count=0 | early POST | early POST |
| omnient | 157 | OFF | 155.875 | count=0 | post-open POST | post-open POST |
| omnient | 157 | ON | 157.471 | count=0 | early POST | early POST |
| omnient | 158 | OFF | 155.605 | count=0 | post-open POST | post-open POST |
| omnient | 158 | ON | 156.799 | count=0 | early POST | early POST |
| omnient | 159 | OFF | 155.774 | count=0 | post-open POST | post-open POST |
| omnient | 159 | ON | 157.879 | count=0 | early POST | early POST |
| omnient | 160 | OFF | 157.333 | count=0 | post-open POST | post-open POST |
| omnient | 160 | ON | 152.188 | count=0 | early POST | early POST |
| omnient | 161 | OFF | 153.874 | count=0 | post-open POST | post-open POST |
| omnient | 161 | ON | 153.896 | count=0 | early POST | early POST |
| omnient | 162 | OFF | 155.781 | count=0 | post-open POST | post-open POST |
| omnient | 162 | ON | 156.478 | count=0 | early POST | early POST |
| omnient | 163 | OFF | 152.846 | count=0 | post-open POST | post-open POST |
| omnient | 163 | ON | 154.490 | count=0 | early POST | early POST |
| omnient | 164 | OFF | 151.516 | count=0 | post-open POST | post-open POST |
| omnient | 164 | ON | 155.097 | count=0 | early POST | early POST |
| omnient | 165 | OFF | 156.512 | count=0 | post-open POST | post-open POST |
| omnient | 165 | ON | 155.383 | count=0 | early POST | early POST |
| omnient | 166 | OFF | 156.496 | count=0 | post-open POST | post-open POST |
| omnient | 166 | ON | 157.890 | count=0 | early POST | early POST |
| omnient | 167 | OFF | 153.042 | count=0 | post-open POST | post-open POST |
| omnient | 167 | ON | 151.236 | count=0 | early POST | early POST |
| omnient | 168 | OFF | 155.725 | count=0 | post-open POST | post-open POST |
| omnient | 168 | ON | 155.783 | count=0 | early POST | early POST |
| omnient | 169 | OFF | 156.543 | count=0 | post-open POST | post-open POST |
| omnient | 169 | ON | 151.284 | count=0 | early POST | early POST |
| omnient | 170 | OFF | 150.997 | count=0 | post-open POST | post-open POST |
| omnient | 170 | ON | 155.460 | count=0 | early POST | early POST |
| omnient | 171 | OFF | 155.823 | count=0 | post-open POST | post-open POST |
| omnient | 171 | ON | 151.388 | count=0 | early POST | early POST |
| omnient | 172 | OFF | 156.641 | count=0 | post-open POST | post-open POST |
| omnient | 172 | ON | 155.090 | count=0 | early POST | early POST |
| omnient | 173 | OFF | 154.589 | count=0 | post-open POST | post-open POST |
| omnient | 173 | ON | 153.098 | count=0 | early POST | early POST |
| omnient | 174 | OFF | 155.922 | count=0 | post-open POST | post-open POST |
| omnient | 174 | ON | 155.889 | count=0 | early POST | early POST |
| omnient | 175 | OFF | 154.123 | count=0 | post-open POST | post-open POST |
| omnient | 175 | ON | 156.556 | count=0 | early POST | early POST |
| omnient | 176 | OFF | 152.974 | count=0 | post-open POST | post-open POST |
| omnient | 176 | ON | 156.100 | count=0 | early POST | early POST |
| omnient | 177 | OFF | 154.688 | count=0 | post-open POST | post-open POST |
| omnient | 177 | ON | 155.854 | count=0 | early POST | early POST |
| omnient | 178 | OFF | 153.991 | count=0 | post-open POST | post-open POST |
| omnient | 178 | ON | 156.692 | count=0 | early POST | early POST |
| omnient | 179 | OFF | 155.883 | count=0 | post-open POST | post-open POST |
| omnient | 179 | ON | 152.252 | count=0 | early POST | early POST |
| omnient | 180 | OFF | 156.643 | count=0 | post-open POST | post-open POST |
| omnient | 180 | ON | 156.332 | count=0 | early POST | early POST |
| omnient | 181 | OFF | 154.905 | count=0 | post-open POST | post-open POST |
| omnient | 181 | ON | 151.494 | count=0 | early POST | early POST |
| omnient | 182 | OFF | 154.946 | count=0 | post-open POST | post-open POST |
| omnient | 182 | ON | 157.893 | count=0 | early POST | early POST |
| omnient | 183 | OFF | 156.632 | count=0 | post-open POST | post-open POST |
| omnient | 183 | ON | 157.923 | count=0 | early POST | early POST |
| omnient | 184 | OFF | 153.496 | count=0 | post-open POST | post-open POST |
| omnient | 184 | ON | 154.091 | count=0 | early POST | early POST |
| omnient | 185 | OFF | 152.414 | count=0 | post-open POST | post-open POST |
| omnient | 185 | ON | 153.111 | count=0 | early POST | early POST |
| omnient | 186 | OFF | 150.852 | count=0 | post-open POST | post-open POST |
| omnient | 186 | ON | 156.422 | count=0 | early POST | early POST |
| omnient | 187 | OFF | 152.749 | count=0 | post-open POST | post-open POST |
| omnient | 187 | ON | 150.711 | count=0 | early POST | early POST |
| omnient | 188 | OFF | 155.141 | count=0 | post-open POST | post-open POST |
| omnient | 188 | ON | 155.836 | count=0 | early POST | early POST |
| omnient | 189 | OFF | 156.587 | count=0 | post-open POST | post-open POST |
| omnient | 189 | ON | 154.036 | count=0 | early POST | early POST |
| omnient | 190 | OFF | 150.737 | count=0 | post-open POST | post-open POST |
| omnient | 190 | ON | 150.892 | count=0 | early POST | early POST |
| omnient | 191 | OFF | 156.469 | count=0 | post-open POST | post-open POST |
| omnient | 191 | ON | 155.843 | count=0 | early POST | early POST |
| omnient | 192 | OFF | 156.174 | count=0 | post-open POST | post-open POST |
| omnient | 192 | ON | 150.583 | count=0 | early POST | early POST |
| omnient | 193 | OFF | 156.848 | count=0 | post-open POST | post-open POST |
| omnient | 193 | ON | 153.224 | count=0 | early POST | early POST |
| omnient | 194 | OFF | 154.155 | count=0 | post-open POST | post-open POST |
| omnient | 194 | ON | 153.599 | count=0 | early POST | early POST |
| omnient | 195 | OFF | 154.568 | count=0 | post-open POST | post-open POST |
| omnient | 195 | ON | 157.624 | count=0 | early POST | early POST |
| omnient | 196 | OFF | 156.591 | count=0 | post-open POST | post-open POST |
| omnient | 196 | ON | 151.183 | count=0 | early POST | early POST |
| omnient | 197 | OFF | 157.345 | count=0 | post-open POST | post-open POST |
| omnient | 197 | ON | 156.102 | count=0 | early POST | early POST |
| omnient | 198 | OFF | 153.695 | count=0 | post-open POST | post-open POST |
| omnient | 198 | ON | 154.383 | count=0 | early POST | early POST |
| omnient | 199 | OFF | 153.500 | count=0 | post-open POST | post-open POST |
| omnient | 199 | ON | 156.982 | count=0 | early POST | early POST |
| omnient | 200 | OFF | 150.800 | count=0 | post-open POST | post-open POST |
| omnient | 200 | ON | 152.493 | count=0 | early POST | early POST |
| omnient | 201 | OFF | 151.202 | count=0 | post-open POST | post-open POST |
| omnient | 201 | ON | 156.747 | count=0 | early POST | early POST |
| omnient | 202 | OFF | 155.393 | count=0 | post-open POST | post-open POST |
| omnient | 202 | ON | 154.377 | count=0 | early POST | early POST |
| omnient | 203 | OFF | 153.891 | count=0 | post-open POST | post-open POST |
| omnient | 203 | ON | 155.366 | count=0 | early POST | early POST |
| omnient | 204 | OFF | 155.924 | count=0 | post-open POST | post-open POST |
| omnient | 204 | ON | 158.044 | count=0 | early POST | early POST |
| omnient | 205 | OFF | 156.394 | count=0 | post-open POST | post-open POST |
| omnient | 205 | ON | 156.527 | count=0 | early POST | early POST |
| omnient | 206 | OFF | 152.571 | count=0 | post-open POST | post-open POST |
| omnient | 206 | ON | 156.061 | count=0 | early POST | early POST |
| omnient | 207 | OFF | 156.167 | count=0 | post-open POST | post-open POST |
| omnient | 207 | ON | 155.008 | count=0 | early POST | early POST |
| omnient | 208 | OFF | 150.877 | count=0 | post-open POST | post-open POST |
| omnient | 208 | ON | 156.341 | count=0 | early POST | early POST |
| omnient | 209 | OFF | 151.588 | count=0 | post-open POST | post-open POST |
| omnient | 209 | ON | 150.471 | count=0 | early POST | early POST |
| omnient | 210 | OFF | 153.551 | count=0 | post-open POST | post-open POST |
| omnient | 210 | ON | 156.426 | count=0 | early POST | early POST |
| omnient | 211 | OFF | 151.845 | count=0 | post-open POST | post-open POST |
| omnient | 211 | ON | 151.340 | count=0 | early POST | early POST |
| omnient | 212 | OFF | 155.936 | count=0 | post-open POST | post-open POST |
| omnient | 212 | ON | 152.213 | count=0 | early POST | early POST |
| omnient | 213 | OFF | 157.233 | count=0 | post-open POST | post-open POST |
| omnient | 213 | ON | 156.175 | count=0 | early POST | early POST |
| omnient | 214 | OFF | 152.972 | count=0 | post-open POST | post-open POST |
| omnient | 214 | ON | 156.070 | count=0 | early POST | early POST |
| omnient | 215 | OFF | 153.834 | count=0 | post-open POST | post-open POST |
| omnient | 215 | ON | 153.307 | count=0 | early POST | early POST |
| omnient | 216 | OFF | 156.443 | count=0 | post-open POST | post-open POST |
| omnient | 216 | ON | 150.812 | count=0 | early POST | early POST |
| omnient | 217 | OFF | 155.863 | count=0 | post-open POST | post-open POST |
| omnient | 217 | ON | 150.899 | count=0 | early POST | early POST |
| omnient | 218 | OFF | 155.855 | count=0 | post-open POST | post-open POST |
| omnient | 218 | ON | 151.854 | count=0 | early POST | early POST |
| omnient | 219 | OFF | 155.706 | count=0 | post-open POST | post-open POST |
| omnient | 219 | ON | 157.586 | count=0 | early POST | early POST |
| omnient | 220 | OFF | 156.511 | count=0 | post-open POST | post-open POST |
| omnient | 220 | ON | 155.556 | count=0 | early POST | early POST |
| omnient | 221 | OFF | 152.306 | count=0 | post-open POST | post-open POST |
| omnient | 221 | ON | 154.373 | count=0 | early POST | early POST |
| omnient | 222 | OFF | 155.608 | count=0 | post-open POST | post-open POST |
| omnient | 222 | ON | 151.404 | count=0 | early POST | early POST |
| omnient | 223 | OFF | 156.175 | count=0 | post-open POST | post-open POST |
| omnient | 223 | ON | 156.516 | count=0 | early POST | early POST |
| omnient | 224 | OFF | 155.695 | count=0 | post-open POST | post-open POST |
| omnient | 224 | ON | 155.046 | count=0 | early POST | early POST |
| omnient | 225 | OFF | 157.867 | count=0 | post-open POST | post-open POST |
| omnient | 225 | ON | 155.619 | count=0 | early POST | early POST |
| omnient | 226 | OFF | 151.167 | count=0 | post-open POST | post-open POST |
| omnient | 226 | ON | 156.821 | count=0 | early POST | early POST |
| omnient | 227 | OFF | 150.689 | count=0 | post-open POST | post-open POST |
| omnient | 227 | ON | 150.799 | count=0 | early POST | early POST |
| omnient | 228 | OFF | 150.775 | count=0 | post-open POST | post-open POST |
| omnient | 228 | ON | 156.465 | count=0 | early POST | early POST |
| omnient | 229 | OFF | 157.246 | count=0 | post-open POST | post-open POST |
| omnient | 229 | ON | 155.365 | count=0 | early POST | early POST |
| omnient | 230 | OFF | 157.845 | count=0 | post-open POST | post-open POST |
| omnient | 230 | ON | 156.328 | count=0 | early POST | early POST |
| omnient | 231 | OFF | 153.820 | count=0 | post-open POST | post-open POST |
| omnient | 231 | ON | 154.625 | count=0 | early POST | early POST |
| omnient | 232 | OFF | 155.128 | count=0 | post-open POST | post-open POST |
| omnient | 232 | ON | 156.280 | count=0 | early POST | early POST |
| omnient | 233 | OFF | 156.114 | count=0 | post-open POST | post-open POST |
| omnient | 233 | ON | 156.349 | count=0 | early POST | early POST |
| omnient | 234 | OFF | 154.783 | count=0 | post-open POST | post-open POST |
| omnient | 234 | ON | 151.058 | count=0 | early POST | early POST |
| omnient | 235 | OFF | 155.200 | count=0 | post-open POST | post-open POST |
| omnient | 235 | ON | 152.196 | count=0 | early POST | early POST |
| omnient | 236 | OFF | 151.145 | count=0 | post-open POST | post-open POST |
| omnient | 236 | ON | 155.796 | count=0 | early POST | early POST |
| omnient | 237 | OFF | 154.306 | count=0 | post-open POST | post-open POST |
| omnient | 237 | ON | 156.977 | count=0 | early POST | early POST |
| omnient | 238 | OFF | 155.141 | count=0 | post-open POST | post-open POST |
| omnient | 238 | ON | 156.112 | count=0 | early POST | early POST |
| omnient | 239 | OFF | 155.958 | count=0 | post-open POST | post-open POST |
| omnient | 239 | ON | 157.909 | count=0 | early POST | early POST |
| omnient | 240 | OFF | 156.181 | count=0 | post-open POST | post-open POST |
| omnient | 240 | ON | 151.970 | count=0 | early POST | early POST |
| omnient | 241 | OFF | 153.899 | count=0 | post-open POST | post-open POST |
| omnient | 241 | ON | 155.332 | count=0 | early POST | early POST |
| omnient | 242 | OFF | 155.198 | count=0 | post-open POST | post-open POST |
| omnient | 242 | ON | 155.887 | count=0 | early POST | early POST |
| omnient | 243 | OFF | 156.841 | count=0 | post-open POST | post-open POST |
| omnient | 243 | ON | 150.927 | count=0 | early POST | early POST |
| omnient | 244 | OFF | 152.966 | count=0 | post-open POST | post-open POST |
| omnient | 244 | ON | 153.905 | count=0 | early POST | early POST |
| omnient | 245 | OFF | 157.864 | count=0 | post-open POST | post-open POST |
| omnient | 245 | ON | 155.479 | count=0 | early POST | early POST |
| omnient | 246 | OFF | 157.500 | count=0 | post-open POST | post-open POST |
| omnient | 246 | ON | 150.701 | count=0 | early POST | early POST |
| omnient | 247 | OFF | 155.339 | count=0 | post-open POST | post-open POST |
| omnient | 247 | ON | 151.529 | count=0 | early POST | early POST |
| omnient | 248 | OFF | 151.338 | count=0 | post-open POST | post-open POST |
| omnient | 248 | ON | 156.659 | count=0 | early POST | early POST |
| omnient | 249 | OFF | 156.346 | count=0 | post-open POST | post-open POST |
| omnient | 249 | ON | 151.556 | count=0 | early POST | early POST |
| omnient | 250 | OFF | 156.043 | count=0 | post-open POST | post-open POST |
| omnient | 250 | ON | 156.935 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 150 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 6/250 ON trials. Of those trials, 6 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 25, 43, 63, 123, 181, 183, 201. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 37 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 28668 | 3D2D5822-E3BE-4405-92A2-93634F6478F7 |
| 1 | ON | 2 | 28669 | AD7E7C4B-8231-440F-9280-9FA79611F727 |
| 2 | OFF | 3 | 28670 | 3EA785A8-C3AF-4321-AE8F-5E96DA4EA2DE |
| 2 | ON | 4 | 28671 | F6C22D3D-6649-45FA-ACB0-894E52B6FD67 |
| 3 | OFF | 5 | 28672 | 2E5F2585-11D5-4F65-A7F9-EA68FF5F7A67 |
| 3 | ON | 6 | 28673 | E9BEB180-4737-4733-96AC-76A5C980F699 |
| 4 | OFF | 7 | 28675 | 97D54A8B-D4C4-4A46-9B2C-F6D1460D903F |
| 4 | ON | 8 | 28676 | 82165C5D-4D69-4E3C-9D76-C298C71C665D |
| 5 | OFF | 9 | 28677 | 52325304-AADD-4187-B80A-1B07086CB16C |
| 5 | ON | 10 | 28678 | AC290D49-C3A3-4967-9037-0BF47A5EDDF7 |
| 6 | OFF | 11 | 28679 | 1CEBFAEC-5DA8-4CEF-AA6F-DCAEA0A0AA7C |
| 6 | ON | 12 | 28680 | 6E8AA3D0-E7C0-42AE-82BE-D501C2C29E7E |
| 7 | OFF | 13 | 28681 | DD481715-EC95-4605-80CF-D0AD40C4DFBF |
| 7 | ON | 14 | 28682 | 983647C9-147A-4994-B6D5-9C2747F58E40 |
| 8 | OFF | 15 | 28684 | F1B07F07-9888-4DAD-A8DA-475EA2C43C5E |
| 8 | ON | 16 | 28685 | 0D1B8686-775C-48C5-BD08-38874FFC5B0D |
| 9 | OFF | 17 | 28686 | DF2EA1FC-B3C8-4D9D-966B-AB5D62EA11AD |
| 9 | ON | 18 | 28687 | 9C014DD1-65AC-42EC-B0D9-BC16C07DE4A1 |
| 10 | OFF | 19 | 28688 | CFD74531-C578-49C7-9913-A53259F7E491 |
| 10 | ON | 20 | 28689 | 83D4308B-2A11-4C68-9C9A-EB70EE5F590D |
| 11 | OFF | 21 | 28690 | 7B38BBA2-9574-4BF0-B4E6-CA6B2B01ACC9 |
| 11 | ON | 22 | 28692 | 0BC38E95-02EE-4BFA-8434-79E8EE042F80 |
| 12 | OFF | 23 | 28693 | 9A381B8B-84B6-43B6-A54B-F88DDCBABE20 |
| 12 | ON | 24 | 28694 | 2F3D9F3A-4DBD-4C23-AD11-5D8A875F179F |
| 13 | OFF | 25 | 28695 | 9FA8AF48-E7BE-4D4E-974E-5AC7871FD609 |
| 13 | ON | 26 | 28696 | 2CADB14D-9783-46CB-850D-CD91DDD8ACA5 |
| 14 | OFF | 27 | 28697 | 8E3C3E52-810C-4503-A2CA-30C73E42471E |
| 14 | ON | 28 | 28698 | 39C76E72-B5C5-40CE-B25B-DAF5B8F9E613 |
| 15 | OFF | 29 | 28699 | 77FBE201-3591-4D7E-A1A2-D5FC3E79023A |
| 15 | ON | 30 | 28701 | 97FCD344-3CD2-4682-8D9F-B75EE6EB158B |
| 16 | OFF | 31 | 28702 | 537C76D8-8B04-40CA-A99E-83D7EDA93A6D |
| 16 | ON | 32 | 28703 | FCEBF083-B189-425D-8949-D0EC27EDA27A |
| 17 | OFF | 33 | 28704 | 0F536FE9-C826-4B10-B5E8-8BE621B30DE8 |
| 17 | ON | 34 | 28705 | 81DDDF9D-547A-4249-A60F-BE184A910620 |
| 18 | OFF | 35 | 28706 | 7EABD35E-2ED0-4803-A409-299EF3114431 |
| 18 | ON | 36 | 28707 | 157A76C7-787F-440F-88D3-77EBC0BA31A8 |
| 19 | OFF | 37 | 28708 | 7EDE03C9-C547-4C2F-A98D-FF83664E4715 |
| 19 | ON | 38 | 28710 | 206D14DD-9B67-42AA-8FBB-8F7FC46E5664 |
| 20 | OFF | 39 | 28711 | DC57826C-F65D-4336-A635-1CEA86156B3E |
| 20 | ON | 40 | 28712 | 1D499B08-D781-4A8B-8BEF-11933BC4E60A |
| 21 | OFF | 41 | 28713 | 3C0FD8AF-358D-4CC4-85C6-146E92AEC6A0 |
| 21 | ON | 42 | 28714 | A07F2A46-17D3-41F7-AAE8-C987858A02F9 |
| 22 | OFF | 43 | 28715 | 688CC9E7-4525-4242-AB2C-EFFD98DA8002 |
| 22 | ON | 44 | 28716 | 9B19AACE-B556-4EED-8D0A-C87D94434E4A |
| 23 | OFF | 45 | 28717 | 0CB02CBF-3072-4AD3-84C8-0346A9650109 |
| 23 | ON | 46 | 28719 | B48A179F-F54B-4804-AC7B-BFE920FE87F6 |
| 24 | OFF | 47 | 28720 | 100BD5BF-E473-4C5A-BD7C-2EB506573BDE |
| 24 | ON | 48 | 28721 | 2AE4E9F3-CFDE-4844-B77C-A131DA4B924E |
| 25 | OFF | 49 | 28722 | DFC0E738-C5B1-40AB-AE5B-B96E8439106E |
| 25 | ON | 50 | 28723 | 04010312-73B1-41C7-970A-26DDDE449325 |
| 26 | OFF | 51 | 28724 | 9A09A85B-C51A-45C0-BBE8-5069D03DC132 |
| 26 | ON | 52 | 28726 | B8A32F8B-9189-4372-8C9E-B3CC97DAE45F |
| 27 | OFF | 53 | 28727 | 73B5B5A6-AAA7-4AC7-832C-26941CF57C15 |
| 27 | ON | 54 | 28728 | A583524E-8BE2-473F-AA92-84D14D7965E6 |
| 28 | OFF | 55 | 28729 | E3043397-0023-45FD-9FC9-47AAB9DCA28A |
| 28 | ON | 56 | 28730 | D345C5D4-29BD-4756-802D-DA343C79E833 |
| 29 | OFF | 57 | 28731 | 812124BF-2055-43D2-97D2-4D6D6ADC5C76 |
| 29 | ON | 58 | 28732 | 9B6292EE-91E6-4A2A-8277-E7A0C6323821 |
| 30 | OFF | 59 | 28733 | 87802E1B-810C-49B2-B584-536AA4B23CE5 |
| 30 | ON | 60 | 28735 | A299F30C-3FA0-448C-B733-352E4F8806CB |
| 31 | OFF | 61 | 28736 | 64526BF8-4684-434C-872D-766EE09FC81F |
| 31 | ON | 62 | 28737 | 7C423CD1-F8E8-4E86-97F5-635067A633D3 |
| 32 | OFF | 63 | 28738 | 61056994-B8C0-4C20-8959-61F30D285B9B |
| 32 | ON | 64 | 28739 | 0352B486-B2EB-40AB-B375-7711767D4F74 |
| 33 | OFF | 65 | 28740 | 743A166E-C4F2-442D-A9A6-E2B68A3D6B6A |
| 33 | ON | 66 | 28741 | 54A24FCE-2185-427D-ACCB-8088D7DA45E7 |
| 34 | OFF | 67 | 28742 | 2B053220-6A2B-428C-8012-99AE0862AA3D |
| 34 | ON | 68 | 28744 | 6649ABD2-B61C-4C73-B809-1DF9EF3A28D7 |
| 35 | OFF | 69 | 28745 | 660CABE3-E6E0-4DE5-B659-53ECED89CF37 |
| 35 | ON | 70 | 28746 | 14592702-E165-4F9E-A614-3AC58D365A15 |
| 36 | OFF | 71 | 28747 | 8C5B27F2-1814-486A-8EED-F35D16215A80 |
| 36 | ON | 72 | 28748 | F869ACB5-5D1C-4E98-B2C5-4F269E37931D |
| 37 | OFF | 73 | 28749 | 5616241D-30EF-4562-BC31-7734392AFA81 |
| 37 | ON | 74 | 28750 | F1C35C51-88D4-4CDC-B7D4-465374DDB9D7 |
| 38 | OFF | 75 | 28751 | 91DC0F42-B4FF-4047-A150-FF0E6E3B8BDB |
| 38 | ON | 76 | 28753 | 794ECFC7-89C6-4F27-B347-A4714105C2D8 |
| 39 | OFF | 77 | 28754 | 30A0347E-3A32-4B67-AFF1-52EFB0A75C51 |
| 39 | ON | 78 | 28755 | 2AD97DD2-DD31-4097-A394-24680A57B2EF |
| 40 | OFF | 79 | 28756 | 80A221FF-BB5C-47FB-AD67-F83E7DEEF073 |
| 40 | ON | 80 | 28757 | A2F2E51E-ADA4-4598-A7FF-88FEBAAE2DBB |
| 41 | OFF | 81 | 28758 | B53DCB41-00DF-4620-A009-C7EA3AABAE6C |
| 41 | ON | 82 | 28759 | F660DF55-0939-48DC-BDFA-C6047B71EA34 |
| 42 | OFF | 83 | 28761 | D6C7F583-4727-4B74-82DF-501D121C30F5 |
| 42 | ON | 84 | 28762 | ECE28E8E-8C42-4FE0-BCCD-E003CFAC63C6 |
| 43 | OFF | 85 | 28763 | C8556BB2-D4F1-423A-BCBB-CB342BE3D49C |
| 43 | ON | 86 | 28764 | 39782B83-872C-4B66-B1DE-056CC2DBFE6D |
| 44 | OFF | 87 | 28765 | 9F2DDE19-052F-42E9-A22E-E5A5CA1980F2 |
| 44 | ON | 88 | 28766 | 48DDE64C-935E-4CF2-AE86-3A5416799057 |
| 45 | OFF | 89 | 28767 | C25BAF02-C8C5-450F-94DC-5B1B4C5127A4 |
| 45 | ON | 90 | 28768 | FF524CB8-4F5A-4DBA-BA1F-90E2A550B584 |
| 46 | OFF | 91 | 28770 | DC131E73-CFA4-43CA-BD72-1D303F29A834 |
| 46 | ON | 92 | 28771 | 4D90200B-FC08-418D-8407-95449CD80709 |
| 47 | OFF | 93 | 28772 | 307DC971-8ADF-4C63-B102-E514D492F52D |
| 47 | ON | 94 | 28773 | DC0B2241-4514-47AE-801C-61E4FD527B6B |
| 48 | OFF | 95 | 28774 | 742B3CB7-64BA-4711-9B3A-BFD55384A0EA |
| 48 | ON | 96 | 28775 | C18DD23B-D40C-4408-8F35-F9B65A182E1F |
| 49 | OFF | 97 | 28776 | 9CEFA90B-B08E-43A4-9B0C-851AE7484C67 |
| 49 | ON | 98 | 28777 | 36D71285-ECE3-4508-8143-5C7A566F2DB1 |
| 50 | OFF | 99 | 28779 | 93BF8B0A-7F09-4D32-9D7C-80DBA123D746 |
| 50 | ON | 100 | 28780 | 5B0BAD84-3538-42F8-8CE6-8D6E5ACE5E80 |
| 51 | OFF | 101 | 28781 | 40CD5F01-F7F2-427E-A62B-C5E096E3AF91 |
| 51 | ON | 102 | 28782 | BA21785F-4DF0-481A-A5FC-EA0F1F811095 |
| 52 | OFF | 103 | 28783 | 253E3AE8-94BC-49EA-9415-55B1FF848177 |
| 52 | ON | 104 | 28784 | 524520F3-3361-466C-92EA-13AAF987EA51 |
| 53 | OFF | 105 | 28785 | DC58A278-D1E0-46CC-BAFD-D9CE0494AB1D |
| 53 | ON | 106 | 28787 | 3720BE34-B4AE-4332-AF1F-8AFE0B1F3DF6 |
| 54 | OFF | 107 | 28788 | 61D10577-E3A4-468E-9B9A-94B52D9C7FCC |
| 54 | ON | 108 | 28789 | 2A92E9E9-CE4C-4C00-963C-C657C9A3F5AF |
| 55 | OFF | 109 | 28790 | 857B5BC9-4DE5-4963-8E7E-8F7A8BBB7035 |
| 55 | ON | 110 | 28791 | 23440176-C182-4070-BA68-365865472282 |
| 56 | OFF | 111 | 28792 | B8B9AF72-54D1-42CC-9E25-84B0BA91D029 |
| 56 | ON | 112 | 28793 | FCCBF4F0-422B-4BCF-9B5A-B036FA9051DD |
| 57 | OFF | 113 | 28794 | 7E44DD4C-1803-465D-AACC-46632CB2F400 |
| 57 | ON | 114 | 28795 | 3FF049F7-66CC-4642-9533-030040F8B78B |
| 58 | OFF | 115 | 28797 | 4383D50A-9750-4856-8F49-790F0AC8CCBE |
| 58 | ON | 116 | 28798 | CB0DE964-2E30-49F0-94C2-FBD123D6349D |
| 59 | OFF | 117 | 28799 | 9E63D886-9800-4EF5-AAFD-B0533804DF29 |
| 59 | ON | 118 | 28800 | 31C353EF-FC3F-44BB-84E5-8A728252AFFF |
| 60 | OFF | 119 | 28801 | 2C289B31-5E1E-457C-9DCC-C1503B50A84F |
| 60 | ON | 120 | 28802 | 42E4F0C4-611A-460C-9B0A-196A89558CFB |
| 61 | OFF | 121 | 28803 | 681CCEB8-6071-48AA-9CC6-2B0B239F375F |
| 61 | ON | 122 | 28804 | ED70F300-0095-426E-BA4B-8AAC6631FFBC |
| 62 | OFF | 123 | 28806 | B30A0CE0-EDE5-46D0-B930-1E203B4F5757 |
| 62 | ON | 124 | 28807 | E2C9EEFC-A07F-4968-9E25-4686E588DC17 |
| 63 | OFF | 125 | 28808 | 623684F9-8111-442B-A7F3-64A589082FA3 |
| 63 | ON | 126 | 28809 | 05A8C2C2-AC73-46A9-A9E5-0802E0C88B86 |
| 64 | OFF | 127 | 28810 | 18DE8A24-76FD-451F-8089-C07775CFF55B |
| 64 | ON | 128 | 28811 | C1D202EA-1B33-4E3E-AA2B-494202634C3A |
| 65 | OFF | 129 | 28812 | 46FCA227-BE53-45D9-8E28-824BAC87F935 |
| 65 | ON | 130 | 28814 | 2DCDC1A1-84BE-401C-AF44-FA3FFA1506C9 |
| 66 | OFF | 131 | 28815 | DCCCEC82-87B5-4076-9FA5-B764E0F7F97F |
| 66 | ON | 132 | 28816 | 60118395-5464-48C9-898C-FF2E436DB0B8 |
| 67 | OFF | 133 | 28817 | D8681933-3122-4576-B159-FE05C65CC151 |
| 67 | ON | 134 | 28818 | BE35F6D1-671B-4AA4-9DC4-79DBC85B28A8 |
| 68 | OFF | 135 | 28819 | 285EA08C-6FD3-4E88-A075-8D705297AFBD |
| 68 | ON | 136 | 28820 | 5F553F48-99B3-4A3F-9E2C-A30D89920236 |
| 69 | OFF | 137 | 28821 | A0005BEE-9D9C-42D3-B0C7-D7A5683D169E |
| 69 | ON | 138 | 28823 | 3F4F02FB-8548-47BD-9B23-51892FBBB45F |
| 70 | OFF | 139 | 28824 | 585C738A-0F67-4263-A1E6-24A1F0A415DA |
| 70 | ON | 140 | 28825 | 25B7672C-BAEC-4969-ABDF-F5CC5B5E27AD |
| 71 | OFF | 141 | 28826 | D67CDE6E-22ED-41ED-A831-953D739A9647 |
| 71 | ON | 142 | 28827 | 2037B978-0AA1-45CD-9B96-F6332D07A81E |
| 72 | OFF | 143 | 28828 | 9BA32B26-4AB1-4D2D-97FB-752F1CA8ACC7 |
| 72 | ON | 144 | 28829 | 176109CF-8A18-4B4F-927D-62F51904E5BC |
| 73 | OFF | 145 | 28830 | 9D18CF59-CDB4-41A2-96F6-4606F6920035 |
| 73 | ON | 146 | 28832 | CD8B9EC0-9436-4950-9146-F1196E638F1B |
| 74 | OFF | 147 | 28833 | D4C9BBB0-7B7C-4832-AB48-5CC4346019E5 |
| 74 | ON | 148 | 28834 | A0026A59-1C0C-4405-98DB-97D372E68994 |
| 75 | OFF | 149 | 28835 | F43E9DD5-2614-4715-9B99-228158A33989 |
| 75 | ON | 150 | 28836 | D9E396A8-733D-475E-95A5-E11F1C2E9D6C |
| 76 | OFF | 151 | 28837 | FC37E892-E8E4-492D-86E7-B41F83B84C0C |
| 76 | ON | 152 | 28838 | C4295661-88AA-4F2E-95C1-79AA85104AD8 |
| 77 | OFF | 153 | 28839 | 236770A7-A3E8-4925-81DF-3057F68C359A |
| 77 | ON | 154 | 28840 | 41FBC1A8-0006-4B45-8F32-206078F710B0 |
| 78 | OFF | 155 | 28842 | 222D8018-CB8A-41AF-9526-8A771B791607 |
| 78 | ON | 156 | 28843 | D79EE25A-63EE-4B4F-88CD-500957A5FC57 |
| 79 | OFF | 157 | 28844 | 4D34EEBB-6B9A-4723-AA0B-3430B3516CF7 |
| 79 | ON | 158 | 28845 | 2F420691-10F0-43C9-9FA6-D20144643EB2 |
| 80 | OFF | 159 | 28846 | BECBE48F-099E-43DE-9E57-812EC5FCC222 |
| 80 | ON | 160 | 28847 | 6EAD4774-120A-4242-A374-CBE16F6807A0 |
| 81 | OFF | 161 | 28848 | 274D3939-075B-48B5-88BE-AF8536116BE7 |
| 81 | ON | 162 | 28849 | 8E416E7F-3518-4FCD-81DD-23B64D8A0DF2 |
| 82 | OFF | 163 | 28851 | 9FBCF9E1-063A-4E0B-92AB-A7A497F076AC |
| 82 | ON | 164 | 28852 | A7B81CB5-7745-4537-BCD7-35B5632C2FE1 |
| 83 | OFF | 165 | 28853 | 0A07CF55-5671-40BD-8CB4-CB07BE3E8A75 |
| 83 | ON | 166 | 28854 | 42B00E37-C54A-41E1-9856-3116A9A9175A |
| 84 | OFF | 167 | 28855 | 57EABF38-DD80-4E32-931A-78D777250917 |
| 84 | ON | 168 | 28856 | BAD4F8FE-E571-436F-9236-1203AAA81039 |
| 85 | OFF | 169 | 28857 | FE85F51D-0253-4652-B70D-0F6715C2CCDE |
| 85 | ON | 170 | 28859 | 2AAEC9A4-740A-46CA-B767-B96B3C46120D |
| 86 | OFF | 171 | 28860 | 2F889DA4-4D86-4FC0-A525-DB740E0804EE |
| 86 | ON | 172 | 28861 | 099A97CC-1CBA-490C-85E2-E86FD6686436 |
| 87 | OFF | 173 | 28862 | 4361A4D0-9DE7-420E-A15B-2EA1FE43013C |
| 87 | ON | 174 | 28863 | 0D8830CB-E10E-4DFA-97D9-28CFF1D0466C |
| 88 | OFF | 175 | 28864 | 46A04A38-31A2-46D2-B4B6-BEE7D22934C6 |
| 88 | ON | 176 | 28865 | 1242A149-D6B4-4315-9624-AA96D71CD41B |
| 89 | OFF | 177 | 28866 | EFD32BCD-4952-4F50-A8D9-FEFE38EBDCD6 |
| 89 | ON | 178 | 28868 | 8F508C19-E5A4-4E6F-B233-1EEA48FA9C93 |
| 90 | OFF | 179 | 28869 | 24A310FC-858B-4CD7-BE2D-176D744E8A86 |
| 90 | ON | 180 | 28870 | 4483F029-86F5-4B4D-962D-5F39FC21EE1C |
| 91 | OFF | 181 | 28871 | 61F7E089-9788-45F4-B84B-3980D6112A4A |
| 91 | ON | 182 | 28872 | A7A652E8-9BA9-4E5F-96AE-15BCDDC3AFF6 |
| 92 | OFF | 183 | 28873 | C7BDBAD5-628B-4C23-9AE9-EE52C036D5AE |
| 92 | ON | 184 | 28874 | 7E9AE737-1986-4210-8057-757BD765381C |
| 93 | OFF | 185 | 28875 | 30A4C579-5E29-4DEC-846F-AFE5CBA22F84 |
| 93 | ON | 186 | 28877 | BFBBB6EB-A892-4C9B-8FC0-F578D4C71302 |
| 94 | OFF | 187 | 28878 | 629DAB15-6249-4663-AD9D-9E04E8B3DED3 |
| 94 | ON | 188 | 28879 | DA6A6874-3481-4E02-BE04-C40A1806C890 |
| 95 | OFF | 189 | 28880 | 756FE191-1AFD-4BEC-86A3-391D05D8BDFA |
| 95 | ON | 190 | 28881 | 713265A2-69A2-4870-84F0-7D49832D93B6 |
| 96 | OFF | 191 | 28882 | 6F99BBB1-8AE3-4185-848B-3445D5EEE021 |
| 96 | ON | 192 | 28883 | 17612245-0780-4E8C-B9FA-1D3995AEA165 |
| 97 | OFF | 193 | 28884 | 93050970-114F-496C-960C-77D840DEBCBC |
| 97 | ON | 194 | 28886 | 760037C8-68C8-45C3-BCF7-3CB5116DE867 |
| 98 | OFF | 195 | 28887 | 9DF9948C-3154-4F09-B72F-3FBA270B0586 |
| 98 | ON | 196 | 28888 | 88D909CB-DC5B-4E7B-86E9-A215EEB5302D |
| 99 | OFF | 197 | 28889 | BBE91975-95E8-49D5-9C3C-A7B33B3E9842 |
| 99 | ON | 198 | 28890 | A5102872-B376-4E3A-85F0-012B977AF5BC |
| 100 | OFF | 199 | 28891 | 0C6FA17C-795E-42B8-BCB9-702658A8611E |
| 100 | ON | 200 | 28892 | 22BA8BFF-AEA7-46C0-B2A0-AA1225CB1B25 |
| 101 | OFF | 201 | 28893 | CF1D467D-4297-4353-856E-249285A410C1 |
| 101 | ON | 202 | 28895 | 99467C26-3CFE-4916-A0CC-E4B4570A0F08 |
| 102 | OFF | 203 | 28896 | 82B0FC5D-4133-47F7-918C-C639253139F8 |
| 102 | ON | 204 | 28897 | A807DD91-0397-4FC8-9677-C0331BC08FFD |
| 103 | OFF | 205 | 28898 | 5427F112-0436-449B-9644-D2586FF3EC6B |
| 103 | ON | 206 | 28900 | 7DDA351D-D29B-4483-908D-F4358C318847 |
| 104 | OFF | 207 | 28901 | 5A94B6BC-4A18-49F3-96A5-BBC5F655F838 |
| 104 | ON | 208 | 28902 | 42A082FF-56F3-4C5D-BCCA-90E65D368642 |
| 105 | OFF | 209 | 28903 | E7A3B6DE-E21A-4803-864C-8ABD4CAA39CB |
| 105 | ON | 210 | 28905 | 958CF93E-403D-41E3-92EC-24D9173F7FC0 |
| 106 | OFF | 211 | 28906 | FA300AF3-8F57-43AF-BCA6-DD2CE731586C |
| 106 | ON | 212 | 28907 | D3CC5F23-9ED5-4657-B1ED-18A3F07D3ED8 |
| 107 | OFF | 213 | 28908 | 4CC56C4A-CD96-4F2E-9C23-3C4BC9C3EDAB |
| 107 | ON | 214 | 28909 | 7648333E-19DC-4D9A-A782-FA828527B5DD |
| 108 | OFF | 215 | 28910 | 0ACCDBEB-B769-42F0-ADAA-01262AEE866E |
| 108 | ON | 216 | 28911 | 90CE4757-DEAF-48B0-858F-D202970E4C39 |
| 109 | OFF | 217 | 28912 | D4CA6338-1FA4-4037-9B8B-D4E1B4433941 |
| 109 | ON | 218 | 28913 | EF9FF0FA-BE1A-4300-8315-5EA26088CFCD |
| 110 | OFF | 219 | 28915 | 7FB96611-DFD1-4285-B19C-C83D9EDC7016 |
| 110 | ON | 220 | 28916 | 5A455FA0-4B5E-4F91-8790-24BA0B45B5BA |
| 111 | OFF | 221 | 28917 | 82A51CE6-45CD-4584-B77B-6E9DF913C6E6 |
| 111 | ON | 222 | 28918 | 05DADEFA-D3A3-4F4F-8F05-30E5B86DFC52 |
| 112 | OFF | 223 | 28919 | C0F07849-5620-46F3-AE42-D15F0BAA7E8E |
| 112 | ON | 224 | 28920 | ABB9A491-7A27-43DC-9190-B3CE05640017 |
| 113 | OFF | 225 | 28921 | 5B07659F-E46B-49A6-B02C-43E4F20B0ECD |
| 113 | ON | 226 | 28922 | FF66368E-6B9F-4F65-8A8C-42CAAF6EF739 |
| 114 | OFF | 227 | 28924 | 2E8C319F-93F2-4801-8831-763490DD94DC |
| 114 | ON | 228 | 28925 | 1D421D17-F383-454F-A4B5-6FB0E7DBF8F9 |
| 115 | OFF | 229 | 28926 | 4E6DCB29-54CE-4F16-BD0C-8CBB2A937DBA |
| 115 | ON | 230 | 28927 | 449DDC23-2ACF-4B43-B03E-282B3494E4B2 |
| 116 | OFF | 231 | 28928 | 6CBCB5F3-BD29-4864-A30D-46EA30DD291B |
| 116 | ON | 232 | 28929 | 83F28BE9-1696-4E13-8172-8DE0A2AB2FDB |
| 117 | OFF | 233 | 28930 | 5107D24B-93EF-474F-BEBD-FC6125A5D9ED |
| 117 | ON | 234 | 28932 | 35600AA9-BC33-4366-94C1-AA6F309D36E0 |
| 118 | OFF | 235 | 28933 | C771C78E-582A-475E-8273-4CDE259E884E |
| 118 | ON | 236 | 28934 | C815BFC3-C481-46F4-9855-E27301A3E04D |
| 119 | OFF | 237 | 28935 | 8602B769-0C7B-441B-81A5-D683BBB87EA5 |
| 119 | ON | 238 | 28936 | CBAD3D4D-738B-4636-98A2-FF8B24012BA9 |
| 120 | OFF | 239 | 28937 | 1E410ABE-F700-41A9-B682-0D6721205F3A |
| 120 | ON | 240 | 28938 | A4CCF9E2-EDC0-4D9B-B678-CA54D4F773D7 |
| 121 | OFF | 241 | 28939 | 72790E71-B6C0-480A-8340-793A314A2705 |
| 121 | ON | 242 | 28941 | 89B4AFC5-B4F4-4911-B5CB-311674159EF5 |
| 122 | OFF | 243 | 28942 | F672F1B7-930A-435A-A4CA-AD15535BCA5A |
| 122 | ON | 244 | 28943 | 0DE39576-4A0A-40A3-93A4-CBBA4A2BB9AF |
| 123 | OFF | 245 | 28944 | 4094B968-DE52-4528-84F9-1FB95FEA7EF5 |
| 123 | ON | 246 | 28945 | 14573A6B-7FB3-4E14-9A5C-BD50D66ED7E5 |
| 124 | OFF | 247 | 28946 | BBF78B08-BAC7-422B-B319-13403FA9C947 |
| 124 | ON | 248 | 28947 | A31893F5-A81D-4DFC-9415-B75631462FC1 |
| 125 | OFF | 249 | 28948 | 19F8B380-741E-4922-BF23-039FF3EE3E1C |
| 125 | ON | 250 | 28950 | B46C7ACB-1621-4B5A-B477-E67C3564B77C |
| 126 | OFF | 251 | 28951 | 2BB037D7-F42E-4BDB-A081-5EBB937FB508 |
| 126 | ON | 252 | 28952 | 9625AB2B-9541-4BAE-9C2A-B3A161E9C4E0 |
| 127 | OFF | 253 | 28953 | 9E73139F-45DA-4E3C-80D6-CF92AC4A00AE |
| 127 | ON | 254 | 28955 | D1A8C96F-F53B-4877-AF83-D0DC71F9D889 |
| 128 | OFF | 255 | 28956 | 1C9CA3E9-6A2F-4AFF-9FE0-FDCAC0F1C304 |
| 128 | ON | 256 | 28957 | BDC1759A-0A7D-49A0-BC30-BDE8E485D9A8 |
| 129 | OFF | 257 | 28958 | 42111831-6845-4921-B835-C1C729E39380 |
| 129 | ON | 258 | 28960 | BB748C16-7C1A-4BB2-AA32-3467506AA1E7 |
| 130 | OFF | 259 | 28961 | 57272C99-E568-4965-A40A-C14A2CCA2BB6 |
| 130 | ON | 260 | 28962 | BA314041-59FF-4893-A6D6-2ED4ABF3E966 |
| 131 | OFF | 261 | 28963 | 533E28B2-85DA-47FC-BF0A-753E99E6DCAF |
| 131 | ON | 262 | 28964 | A6E8574F-384A-4D32-8317-99ECC72C2CCB |
| 132 | OFF | 263 | 28965 | 2ED9548D-44C7-4FDC-88F9-1376C22A2926 |
| 132 | ON | 264 | 28966 | 2254DDEA-DB24-4ED2-BEBE-4CE8BC9BC2F1 |
| 133 | OFF | 265 | 28967 | 441BBA78-88EE-427E-8509-5964A2E464FA |
| 133 | ON | 266 | 28969 | 085D4E36-2F15-414A-B855-7FE72BDF5334 |
| 134 | OFF | 267 | 28970 | 66AC1889-C26E-4F30-928E-4DA0459BA9C1 |
| 134 | ON | 268 | 28971 | 69FBFFBE-8484-4E39-A4FE-36CFDBBC60D4 |
| 135 | OFF | 269 | 28972 | 5058E88F-111D-472B-8D00-B669F10BCEE4 |
| 135 | ON | 270 | 28973 | AFCF2AAF-7A57-4BC6-9B0F-E0D4F921ABAB |
| 136 | OFF | 271 | 28974 | FE775DE6-9617-42B8-A1B7-3D8D9A064283 |
| 136 | ON | 272 | 28975 | 491DE9B8-E53B-4D74-AFC3-DC4E0B58E96E |
| 137 | OFF | 273 | 28976 | C2ACBA01-4173-4925-B29B-832646D03D65 |
| 137 | ON | 274 | 28978 | F3AFE253-1D6E-40D2-836B-AA907CF2402B |
| 138 | OFF | 275 | 28979 | 41942867-112D-4556-AB4E-19FF6C562CA7 |
| 138 | ON | 276 | 28980 | AC8E0620-5DA2-49E8-8AEC-2023BA99F7CD |
| 139 | OFF | 277 | 28981 | 0D43FAE9-308C-4FDD-85C6-1650592CE0F3 |
| 139 | ON | 278 | 28982 | 721AD9F2-2E54-4866-A845-3A83CB844A6E |
| 140 | OFF | 279 | 28983 | C4C12E73-40C9-4701-BCF4-316F37F0C677 |
| 140 | ON | 280 | 28984 | 1E0B752D-08E9-448F-900A-5966B10007E2 |
| 141 | OFF | 281 | 28985 | F861D325-7633-4014-BC20-A39C5FBBAB9A |
| 141 | ON | 282 | 28987 | 49089BC2-82A7-4A88-A6DF-E6BE883DBFE9 |
| 142 | OFF | 283 | 28988 | CC5053D6-57ED-49C9-A20E-1224A6D8AA55 |
| 142 | ON | 284 | 28989 | 3C65BF80-27E8-49B7-B11B-EFBED5FD7E57 |
| 143 | OFF | 285 | 28990 | 19593161-622E-489C-AC7E-73545B33633D |
| 143 | ON | 286 | 28991 | D6482029-295F-4129-A4C8-B9BCC39B75F5 |
| 144 | OFF | 287 | 28992 | 0442F9F3-B009-43A6-9AF3-2C33255E6C60 |
| 144 | ON | 288 | 28994 | B6DF091D-5AA1-4DC1-B62A-475D319C7B48 |
| 145 | OFF | 289 | 28995 | 04A1A8ED-C505-40B4-861D-885ECBDFA7A1 |
| 145 | ON | 290 | 28996 | 4E1ADDA3-9646-42D8-9B8A-4E139E254DBF |
| 146 | OFF | 291 | 28997 | A2AEFDEC-D564-4796-A865-9E2BF15529E4 |
| 146 | ON | 292 | 28998 | 7CEAAF9A-9ED1-4F7B-98D7-02E70DE23A58 |
| 147 | OFF | 293 | 28999 | F8F57998-372A-4ECF-825C-E887C93E8465 |
| 147 | ON | 294 | 29000 | B260CB4E-0405-4199-80E7-57AC3BD11460 |
| 148 | OFF | 295 | 29001 | E5B45691-E8B9-48DF-B66C-A8D3A4F26CA7 |
| 148 | ON | 296 | 29003 | 31D64CC0-0070-4D4B-ACDF-53DE630B9D5C |
| 149 | OFF | 297 | 29004 | 078F0F4A-4CA6-4ABD-9A33-D5A12A9BCBA7 |
| 149 | ON | 298 | 29005 | DF9EFFFB-70F4-4BF7-8014-8B5EE2FF6D90 |
| 150 | OFF | 299 | 29006 | 08477F8C-6294-4DDE-8C52-094064ED04BB |
| 150 | ON | 300 | 29007 | B794D962-A9D7-4DF3-8CA8-D7BD78501F50 |
| 151 | OFF | 301 | 29008 | 7213A1F7-001A-4119-A5AE-6AAA2B770F36 |
| 151 | ON | 302 | 29009 | 3CD7D44E-62D0-42D4-A78C-301D8B6DC1DD |
| 152 | OFF | 303 | 29010 | 6CAA228D-279A-4C56-86DE-9E23928BD886 |
| 152 | ON | 304 | 29012 | 63FEE307-67AB-4C7C-9058-2C6D3B0E2348 |
| 153 | OFF | 305 | 29013 | 8ACD812A-5DF6-4579-B3DA-082477CC5542 |
| 153 | ON | 306 | 29014 | AA7220BC-19E8-4CBB-A488-C43561DB92CC |
| 154 | OFF | 307 | 29015 | B1172ECD-799A-4647-AD46-2D25FCD2BAFD |
| 154 | ON | 308 | 29016 | 75686800-B940-4BD1-8CFF-85C4CC44EC40 |
| 155 | OFF | 309 | 29017 | 1456AD83-BF0C-4559-94CC-C2094764C0E5 |
| 155 | ON | 310 | 29018 | 68E098CA-9B1C-490C-AF17-E5694AF51A1E |
| 156 | OFF | 311 | 29019 | 49B9B393-1928-4322-BAED-CADB7BEB64AF |
| 156 | ON | 312 | 29021 | ABDB9F47-DA6C-47AA-ACAB-11611C4140B8 |
| 157 | OFF | 313 | 29022 | 67F59C80-1420-4C5E-B3B1-225BFAAF248C |
| 157 | ON | 314 | 29023 | 21B8B794-C473-4484-A651-E9200945733E |
| 158 | OFF | 315 | 29024 | 14A1AAA4-39C5-4E28-8246-A2D8437D29D1 |
| 158 | ON | 316 | 29025 | 57703218-1968-402D-A0D9-A1311C09F6D4 |
| 159 | OFF | 317 | 29026 | BAD37540-3DAB-4F80-BB35-BABB1B4BE78D |
| 159 | ON | 318 | 29027 | 53BCA8B5-C8D8-4388-BF0D-8F24914C19B7 |
| 160 | OFF | 319 | 29028 | E015D0D5-A7CB-463F-97DE-B295115DCDF1 |
| 160 | ON | 320 | 29030 | 506031E8-9385-45EF-A0BA-4B1E57012DD5 |
| 161 | OFF | 321 | 29031 | 61BA82F8-1929-482C-A6AE-D8829291BFD5 |
| 161 | ON | 322 | 29032 | 908A24E3-3450-4AFD-84A8-5FF48FBA2483 |
| 162 | OFF | 323 | 29033 | E5C02C76-BE98-4560-B9A0-4113E6A09D0F |
| 162 | ON | 324 | 29034 | 67D25519-1F0E-4BA6-B4A3-BFA3C2E6FCB0 |
| 163 | OFF | 325 | 29035 | 90EB843D-569D-436C-99B0-A23AD76D3960 |
| 163 | ON | 326 | 29036 | 0F48E2DB-508E-435E-A043-1310AD4A90F7 |
| 164 | OFF | 327 | 29037 | 3C760D81-7D51-4F92-82D1-BEA9265EC33E |
| 164 | ON | 328 | 29039 | 105EA426-275A-423B-978B-9835887D72DD |
| 165 | OFF | 329 | 29040 | BEF29E3E-C6A7-46B0-BA8E-77BAA0EDC6B7 |
| 165 | ON | 330 | 29041 | B5DD640F-C081-43B8-9303-9C5FDAED88FA |
| 166 | OFF | 331 | 29042 | 0DCCBF67-DE98-4616-91C9-2FA933ACCF9C |
| 166 | ON | 332 | 29043 | 9BEF8999-9BE4-457D-963B-0E315F354DBC |
| 167 | OFF | 333 | 29044 | 35BDB7DE-A929-42E7-8191-CA1BA4B1D2B3 |
| 167 | ON | 334 | 29045 | D0F16A9E-FA6A-4A93-898E-2897FBC098A6 |
| 168 | OFF | 335 | 29046 | 95BE42F7-313D-4BFB-8CBF-B76A48C73234 |
| 168 | ON | 336 | 29048 | 090C6FF5-885A-4B92-ACAC-16CE4EAC9B23 |
| 169 | OFF | 337 | 29049 | 727259F2-E308-419D-85F3-6252217A1065 |
| 169 | ON | 338 | 29050 | 7AADB2BA-0432-4819-B03A-9687D9DEAA34 |
| 170 | OFF | 339 | 29051 | B81FE088-E554-48F8-A30B-FA7131457206 |
| 170 | ON | 340 | 29052 | F758E4C3-C363-44FC-8C03-4F73E88B8E29 |
| 171 | OFF | 341 | 29053 | 2B96699A-FD64-4792-8A1B-A6E8A575F979 |
| 171 | ON | 342 | 29054 | C54F4701-3C9B-4A56-A627-2F97EB7EBE59 |
| 172 | OFF | 343 | 29055 | CEA0EB16-75C4-468E-93C7-87B443BA916A |
| 172 | ON | 344 | 29057 | 07860B15-941B-4482-8A1F-F367F7A485A7 |
| 173 | OFF | 345 | 29058 | 1421BFEA-186C-4D7C-B79F-F335FE524DA0 |
| 173 | ON | 346 | 29059 | E1B72428-12F8-48CD-BBE7-D9946EAB9272 |
| 174 | OFF | 347 | 29060 | EF0F53CE-5B19-49B6-8274-44BE499CC888 |
| 174 | ON | 348 | 29061 | 373D60CE-A914-429B-877B-29E5AEC7DC76 |
| 175 | OFF | 349 | 29062 | 7B4E1919-11AB-4E8E-8221-6663A2703687 |
| 175 | ON | 350 | 29063 | 0D5D1519-257A-4B43-9AA4-10D5CEF463C6 |
| 176 | OFF | 351 | 29065 | 697B7339-51FE-4B9E-9464-813A135A5ECF |
| 176 | ON | 352 | 29066 | DDB7CAED-7DC2-4835-A5AA-EEDDC42A2338 |
| 177 | OFF | 353 | 29067 | 5ED2A625-15ED-44EB-9358-A6EB0127ED89 |
| 177 | ON | 354 | 29068 | C0608DB2-F124-4059-9398-6522231D2D0B |
| 178 | OFF | 355 | 29069 | E95B70AE-27A6-4AD4-AAA4-8D16AF540983 |
| 178 | ON | 356 | 29070 | 42194F10-ABE4-4C15-BBE4-72E7034ABABF |
| 179 | OFF | 357 | 29071 | 4632040A-651D-468A-B0B0-3C3E2C06C999 |
| 179 | ON | 358 | 29072 | 6AFD2BCB-75B8-412D-B470-5F1C6D3EDDF0 |
| 180 | OFF | 359 | 29074 | 88BD2359-DC2D-4C59-9221-2F3858DA314F |
| 180 | ON | 360 | 29075 | F608ABF8-739F-42F0-A090-DAADAE2F9F3F |
| 181 | OFF | 361 | 29076 | BA3984A8-97E4-466B-B469-83AB87F08959 |
| 181 | ON | 362 | 29077 | F4D28CA4-08BC-485F-8AEA-5DEF5DDF8E13 |
| 182 | OFF | 363 | 29078 | 1B43C8C9-5A30-4BD8-9267-A2A42AFF1497 |
| 182 | ON | 364 | 29079 | 116F2B14-C381-4022-80EB-9143816F493F |
| 183 | OFF | 365 | 29080 | 43624A75-BA5B-4831-9F3A-C7D99BCB1FF0 |
| 183 | ON | 366 | 29081 | 953E9B5C-DE99-42B0-83E8-BAE2E31D52AD |
| 184 | OFF | 367 | 29083 | 720F9AF6-45B9-4EF4-B1F4-F2ED25B27EFE |
| 184 | ON | 368 | 29084 | E46C14EA-1E1A-448A-BD03-8DF243E85C4C |
| 185 | OFF | 369 | 29085 | 8E979135-531A-47CE-AD20-7BD17A016C15 |
| 185 | ON | 370 | 29086 | 84F23DCF-F1C1-4B79-BECD-0F2FCC9147BD |
| 186 | OFF | 371 | 29087 | 3E11F3F9-890A-4A3D-BD0A-0B43C89E397A |
| 186 | ON | 372 | 29088 | BCB78723-006D-4E32-9C1E-EED436166780 |
| 187 | OFF | 373 | 29089 | 69A2358C-025D-4424-97C6-64CB8E5EB892 |
| 187 | ON | 374 | 29090 | 32427BCB-502D-47B0-924B-640CB09ABF50 |
| 188 | OFF | 375 | 29092 | FBCB528B-5C2D-4ABB-A382-EAAF8EDD1068 |
| 188 | ON | 376 | 29093 | E71D110C-A62B-42DB-ADBA-A4B80F0F6DEF |
| 189 | OFF | 377 | 29094 | 04F5B8EC-A7E0-403E-A3DB-EABC89413EED |
| 189 | ON | 378 | 29095 | AC74ACEF-BDD2-4F50-AABB-3CD09CB9BDAB |
| 190 | OFF | 379 | 29096 | C9E75DD0-E815-4BBA-85B0-64BDBF5BF41D |
| 190 | ON | 380 | 29097 | 51D05FE8-ABCA-40E5-995D-42513C99CD5E |
| 191 | OFF | 381 | 29098 | 7A5029D5-72AF-44AF-9712-94053BDA851B |
| 191 | ON | 382 | 29099 | 2EB84F27-7E2E-4E70-955E-DEC0E77FD8CA |
| 192 | OFF | 383 | 29101 | 5C7BE6B1-3E84-4B47-AB24-3CD8983CFAA5 |
| 192 | ON | 384 | 29102 | B0D9EA20-6FEE-4098-86A1-F28643A6BAF1 |
| 193 | OFF | 385 | 29103 | E86EA373-4A45-4D75-BBE3-FBE2C7CC988B |
| 193 | ON | 386 | 29104 | 3C8E988C-8917-4C1C-8FF0-2ADB3DC8201D |
| 194 | OFF | 387 | 29105 | 3308E568-693D-40F7-94D7-12515B8DC144 |
| 194 | ON | 388 | 29106 | F976D040-AE4F-423B-9846-F0CADBDCE06E |
| 195 | OFF | 389 | 29107 | EE7F9B72-7F6A-4651-8105-4C6B3512C7D4 |
| 195 | ON | 390 | 29108 | B4AC3DD4-1066-4383-AE9B-1D1EE55290FD |
| 196 | OFF | 391 | 29110 | D0AC9853-005E-4A7C-9979-EDA9203FAF10 |
| 196 | ON | 392 | 29111 | F41F80DA-65CF-4BA3-833A-0647E0AA1BB9 |
| 197 | OFF | 393 | 29112 | 7E3A7891-DC24-4247-BF5C-EE76D4FF9CA9 |
| 197 | ON | 394 | 29113 | 97296D40-D6C5-47A4-891F-C8F755264771 |
| 198 | OFF | 395 | 29114 | BD1551DF-C3F4-41DE-95BD-BFDAA56477C3 |
| 198 | ON | 396 | 29115 | FFF19A2F-15F1-446E-ADA9-C9EC7F814C06 |
| 199 | OFF | 397 | 29116 | 5D72C475-34D5-48AF-9B24-B340C172FB0F |
| 199 | ON | 398 | 29117 | E58C5C0B-637A-4E8A-A44E-3FE2E66AD177 |
| 200 | OFF | 399 | 29119 | 852A687C-1CAF-4CAB-B154-8E972DDD0F88 |
| 200 | ON | 400 | 29120 | 1F807419-BAFA-437E-B4B8-D5D3AADA5314 |
| 201 | OFF | 401 | 29121 | DC690ED7-1069-4CFD-916F-7A7FE9488EAA |
| 201 | ON | 402 | 29122 | 006B3F18-FC4F-493F-BAC3-2A25617D35C5 |
| 202 | OFF | 403 | 29123 | 752520AF-B729-47DC-B63C-9D2AE9F84B52 |
| 202 | ON | 404 | 29124 | 472D4196-AD4D-45CC-8979-6FA84BCC787C |
| 203 | OFF | 405 | 29125 | 1D487638-7D98-41D0-B651-676A8A806FBA |
| 203 | ON | 406 | 29126 | 419891C4-F903-4C1C-989A-BA26DC9FF9C8 |
| 204 | OFF | 407 | 29128 | 9E45C073-8802-473E-9364-5A50DBCB0145 |
| 204 | ON | 408 | 29129 | C252AD75-D6A9-42B9-B0BB-06A4C59E5054 |
| 205 | OFF | 409 | 29130 | 4F8247B8-AEC2-4398-BC11-B1F6104B6FC4 |
| 205 | ON | 410 | 29131 | 265D0764-F7CF-4498-B408-49A47DA69BA5 |
| 206 | OFF | 411 | 29132 | 468CF5EF-B66A-4C3F-BD00-5AA3258867B7 |
| 206 | ON | 412 | 29133 | 4A02D28F-AC08-4618-9FC0-48E73F490881 |
| 207 | OFF | 413 | 29134 | DF946B1F-C498-4485-8FE0-B4C8B744ECCD |
| 207 | ON | 414 | 29136 | 97DDBE35-46DA-4743-9572-F7EF1B44C1B9 |
| 208 | OFF | 415 | 29137 | 63FA5E8D-5DB8-4F45-A21F-5B47157A9975 |
| 208 | ON | 416 | 29138 | 7486CED3-07E4-4F2B-A528-79E73D5BE27D |
| 209 | OFF | 417 | 29139 | 78EEF225-F3E2-4E5B-B4E6-34117E563505 |
| 209 | ON | 418 | 29140 | FA0FA780-6DCF-4017-8CFD-437246B5229F |
| 210 | OFF | 419 | 29141 | 00246897-97B2-4993-AA24-BB9B076DA676 |
| 210 | ON | 420 | 29142 | 3B5B501A-6DE6-4DEE-A7D1-057C9A63BAD8 |
| 211 | OFF | 421 | 29143 | 7F11A7C1-84F1-45D8-AFA6-A21486EF14ED |
| 211 | ON | 422 | 29145 | 9F50E271-9A3E-43D1-92C6-B9ABB1DA641D |
| 212 | OFF | 423 | 29146 | E0BB35B7-010E-419B-9518-314DB3B055CD |
| 212 | ON | 424 | 29147 | E357CB18-C0A2-4F22-9FFF-EA9CAEF2AC1D |
| 213 | OFF | 425 | 29148 | 92A6505C-4325-4DE1-93AA-07ED6FBB6220 |
| 213 | ON | 426 | 29149 | 1382EA34-9023-4AC1-A6CE-7E5221193E8D |
| 214 | OFF | 427 | 29150 | 2E9F08B8-5BCA-4A76-84F5-2E61D11A801E |
| 214 | ON | 428 | 29151 | 8096F117-4FA1-495C-A26F-ED6128119BE8 |
| 215 | OFF | 429 | 29152 | FBCE5754-5345-458C-A88E-0786DE02EEA6 |
| 215 | ON | 430 | 29154 | 239D4998-47B5-4667-B9C5-63DBD2A209D6 |
| 216 | OFF | 431 | 29155 | 198A110D-FC47-429F-B255-F53D91D7C230 |
| 216 | ON | 432 | 29156 | B672AD45-FB79-4079-9132-DD772FA7FFB6 |
| 217 | OFF | 433 | 29157 | 0D3C0E9F-3D5D-4804-9348-E707C9AFF30F |
| 217 | ON | 434 | 29158 | 5402C1D7-FDDF-4BF9-B5F0-1965B1B4EC50 |
| 218 | OFF | 435 | 29159 | 61DBF320-F90F-4A73-B648-7726AD20940F |
| 218 | ON | 436 | 29160 | 4DB1C004-BECC-4FAB-B943-1B49AAF92BAD |
| 219 | OFF | 437 | 29161 | C5597AE7-36FE-46C1-8E14-846FEEA908D5 |
| 219 | ON | 438 | 29163 | 68C6E72F-01F0-414A-B321-7832BCBA5740 |
| 220 | OFF | 439 | 29164 | C7FB9FC2-9E20-481C-835E-F53D4F61F04F |
| 220 | ON | 440 | 29165 | 16B94D41-9F06-4704-BEAA-1872781BF971 |
| 221 | OFF | 441 | 29166 | 68220501-9137-4A1D-A77B-146CD8FDB60A |
| 221 | ON | 442 | 29167 | 7F63444B-BBBE-4031-B4C0-0C13A19D2691 |
| 222 | OFF | 443 | 29168 | D9DCCDEE-1548-4FD5-916F-B0BABD1AE897 |
| 222 | ON | 444 | 29169 | 8B3857B5-293F-41A1-B85E-2A53919A802F |
| 223 | OFF | 445 | 29212 | 4CC1D375-28E9-44AF-B31C-1D2D327E9893 |
| 223 | ON | 446 | 29213 | ECE54B48-A17D-4B9F-AAB9-5FBD48488E46 |
| 224 | OFF | 447 | 29215 | 8327C522-E145-482F-BCA0-822A0BA267B2 |
| 224 | ON | 448 | 29216 | 519E56FC-296F-4C42-B723-1A51819910F4 |
| 225 | OFF | 449 | 29217 | 9E66E518-B9ED-46C5-A26C-69AACE7C54DD |
| 225 | ON | 450 | 29218 | ABE9C49E-BEFF-4085-8650-B0B2684F5BA5 |
| 226 | OFF | 451 | 29219 | FA4F5089-C890-4AAE-876B-2F8033FD4E9D |
| 226 | ON | 452 | 29220 | 6164BA9F-1140-4DEB-BD84-9BC095319F70 |
| 227 | OFF | 453 | 29221 | 38FBF55B-0C6C-4672-8526-A6D9DF0639D7 |
| 227 | ON | 454 | 29222 | 4092880A-A900-4399-9ABD-D3AE3CCEB33F |
| 228 | OFF | 455 | 29224 | DB169730-6C6A-48F1-B168-0507DBBF9820 |
| 228 | ON | 456 | 29225 | DCCCB63F-FD68-481B-BC9E-9D59465E0139 |
| 229 | OFF | 457 | 29226 | F91BFA69-A68E-413E-AD3A-5F2C3BADFECC |
| 229 | ON | 458 | 29227 | CA97DD8E-BDA8-4705-8B29-C065038B1035 |
| 230 | OFF | 459 | 29228 | 8ABF3293-60D0-4663-BD91-3019AA90F127 |
| 230 | ON | 460 | 29229 | 06D13DC2-5074-434E-BB09-828311746CD7 |
| 231 | OFF | 461 | 29230 | F7F37569-5A5E-4F2E-B933-93013C61CB3E |
| 231 | ON | 462 | 29231 | 7973E738-1687-41A8-A7B1-3E4D0F2D4523 |
| 232 | OFF | 463 | 29233 | DC80ECBF-06A2-4728-96A4-54AAB1BD407A |
| 232 | ON | 464 | 29234 | 867481E5-22D8-4D98-87AD-985194CC6FBB |
| 233 | OFF | 465 | 29235 | 27590799-3D75-4DAC-BA4E-450507BEAC98 |
| 233 | ON | 466 | 29236 | 4A48A500-E5E3-442D-A1E0-DE7ADE43D31F |
| 234 | OFF | 467 | 29237 | F2E5765D-7FD0-4A8B-8FED-7054074B5EFD |
| 234 | ON | 468 | 29238 | 767985AE-1D4C-4939-9E71-6626226ED98B |
| 235 | OFF | 469 | 29239 | 5E08B01D-B40C-443D-BBD3-40C3A9AF7F96 |
| 235 | ON | 470 | 29240 | 779D9B68-08A7-44D1-8A73-4BAFCF6D3EEA |
| 236 | OFF | 471 | 29242 | C024122D-6602-4CD6-BD6E-48CC616FA6E5 |
| 236 | ON | 472 | 29243 | 8D045028-8963-4E1B-A9DC-7A8A660FCF5C |
| 237 | OFF | 473 | 29244 | 1DAC3FFF-F078-4184-AF12-CDA46827F6EC |
| 237 | ON | 474 | 29245 | EFBF4CAD-70D2-4D16-BBA2-8BA7656BA280 |
| 238 | OFF | 475 | 29246 | 690BE619-2F19-4928-8E88-E5E4B1251768 |
| 238 | ON | 476 | 29247 | 63943C62-8DB2-4721-BAEE-6D90F81EC4F5 |
| 239 | OFF | 477 | 29248 | EE2842DA-D1E4-442D-8F34-15D93ADC0F94 |
| 239 | ON | 478 | 29249 | 3E090031-D67A-41ED-816B-D43188AAC7AB |
| 240 | OFF | 479 | 29251 | 909516E3-EFB0-4FD6-A9AF-2DE1B866DBFB |
| 240 | ON | 480 | 29252 | 23BC653D-4DCA-4683-B9A8-BD12C4C3A13C |
| 241 | OFF | 481 | 29253 | D290F428-C0FD-4595-BFFE-C7E2932C289F |
| 241 | ON | 482 | 29254 | 6D78DBA3-C3D0-4EFF-AE83-D5AAF2866ABA |
| 242 | OFF | 483 | 29255 | 4595A401-A5CE-4C2F-BA9F-311F7E6E7FEA |
| 242 | ON | 484 | 29256 | 4DB8EC28-A8D7-48EF-AE88-49EEEEE0C4EA |
| 243 | OFF | 485 | 29257 | E9CFFA70-8EBE-444C-8E5C-7E0EF57700D8 |
| 243 | ON | 486 | 29258 | 6667ED93-B667-406E-986F-CAF611DE6D92 |
| 244 | OFF | 487 | 29260 | DDF8354D-C25E-4845-AB75-178B8AF5B7E5 |
| 244 | ON | 488 | 29261 | A9BB9866-44B2-458B-A21B-CCF70415BADD |
| 245 | OFF | 489 | 29262 | 210AB5F2-B853-4907-A2FD-392DAA979157 |
| 245 | ON | 490 | 29263 | EAAA1CC5-4AD3-4BE6-B6F3-936D5F8A22B8 |
| 246 | OFF | 491 | 29264 | 176EE00F-A689-414E-A4BF-F0C4D0DED792 |
| 246 | ON | 492 | 29265 | 3F1FC61F-65C5-4EB4-8530-3B56AD3DF750 |
| 247 | OFF | 493 | 29266 | CCA9EC78-897A-459E-9100-95842801E289 |
| 247 | ON | 494 | 29267 | 1EC84B55-8649-4305-AB06-617DD0C07AC8 |
| 248 | OFF | 495 | 29269 | 915AE53F-1153-4702-BB8F-99C22DD48121 |
| 248 | ON | 496 | 29270 | 508DB697-0EEB-4EB5-87DA-1B404C7EA731 |
| 249 | OFF | 497 | 29271 | 194CC83B-CD2B-4416-B322-0C1C89E77D62 |
| 249 | ON | 498 | 29272 | 9D396A1F-E106-40BC-932F-0171E3B28F47 |
| 250 | OFF | 499 | 29273 | 6D137D67-1070-4155-A4D1-31BE291EEE4D |
| 250 | ON | 500 | 29292 | D0BE8392-DFB1-48A6-BA5D-7EFDC4C6C726 |
