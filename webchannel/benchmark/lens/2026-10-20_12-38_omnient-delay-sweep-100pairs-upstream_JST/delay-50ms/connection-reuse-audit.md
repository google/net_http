# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 40.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | failed | unknown | handshake | h2 | false | 66.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 30.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 87.000 | 72.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 64.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 74.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 60.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 69.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 400 | handshake | h2 | false | 49.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 51.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 400 | handshake | h2 | false | 53.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 53.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | failed | unknown | handshake | h2 | false | 42.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 52.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | failed | unknown | handshake | h2 | false | 57.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 47.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 48.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 64.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | failed | unknown | handshake | h2 | false | 56.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 45.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 400 | handshake | h2 | false | 47.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 45.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 400 | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 38.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | failed | unknown | handshake | h2 | false | 42.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 59.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | failed | 400 | handshake | h2 | false | 43.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 400 | handshake | h2 | false | 70.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 49.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | failed | 400 | handshake | h2 | false | 53.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 45.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 59.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 55.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | failed | unknown | handshake | h2 | false | 99.000 | 65.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 41.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | failed | unknown | handshake | h2 | false | 51.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 37.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 31.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 39.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 42.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 47.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 35.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 39.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 60.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | failed | 400 | handshake | h2 | false | 53.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 52.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 41.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 46.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 44.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | failed | 400 | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 47.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 400 | handshake | h2 | false | 48.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 400 | handshake | h2 | false | 35.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 49.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 43.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 97.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | failed | unknown | handshake | h2 | false | 140.000 | 108.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 149.000 | 73.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 97.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 135.000 | 101.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 128.000 | 96.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 115.000 | 75.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | failed | unknown | handshake | h2 | false | 104.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 98.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 148.000 | 84.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 225.000 | 129.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 92.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 146.000 | 112.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | failed | 400 | handshake | h2 | false | 336.000 | 284.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 96.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | failed | 400 | handshake | h2 | false | 188.000 | 112.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 84.000 | 73.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 1466.000 | 573.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 308.000 | 162.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 80.000 | 72.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 30.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 58.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 37.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 33.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 38.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 33.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 38.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 34.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 35.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 34.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 69.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | 400 | handshake | h2 | false | 73.000 | 57.000 | 172.217.221.81 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 84.000 | 56.000 | 172.217.221.81 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 49.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 59.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 63.000 | 55.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | failed | 400 | handshake | h2 | false | 50.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 53.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 35.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 55.000 | 47.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 51.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 50.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 46.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 52.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 32.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 49.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | failed | 400 | handshake | h2 | false | 45.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 43.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | failed | 400 | handshake | h2 | false | 45.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 64.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 38.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | failed | 400 | handshake | h2 | false | 51.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 42.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 33.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 56.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 46.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 50.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 107.000 | 45.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 47.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 49.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 62.000 | 53.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 400 | handshake | h2 | false | 50.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 125.000 | 89.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 41.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 39.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 35.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | failed | 400 | handshake | h2 | false | 52.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 39.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 39.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 50.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 38.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 33.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 400 | handshake | h2 | false | 47.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 40.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 45.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 400 | handshake | h2 | false | 44.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 36.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | failed | 400 | handshake | h2 | false | 52.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 34.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 34.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | failed | 400 | handshake | h2 | false | 39.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 44.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | failed | unknown | handshake | h2 | false | 58.000 | 45.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 38.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | failed | 400 | handshake | h2 | false | 53.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 40.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 43.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 400 | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 38.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 36.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 48.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 44.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 48.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 59.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 35.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 18.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 29.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 59.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 25.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 54.000 | 13.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 50.777 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 52.862 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 52.655 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 52.925 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 52.859 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 53.012 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 50.494 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 52.872 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 51.566 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 52.251 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 50.747 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 51.734 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 50.839 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 52.857 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 53.035 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 52.873 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 52.872 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 52.940 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 50.432 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 52.790 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 52.887 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 52.434 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 50.658 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 52.856 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 50.369 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 52.363 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 50.855 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 52.906 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 50.948 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 52.423 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 51.024 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 52.504 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 52.452 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 52.686 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 52.970 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 52.596 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 51.172 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 52.805 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 52.910 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 51.642 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 52.853 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 52.863 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 50.854 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 50.866 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 52.799 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 52.167 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 52.709 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 51.146 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 51.983 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 52.252 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 52.547 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 51.310 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 52.867 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 52.900 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 52.055 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 50.945 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 53.017 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 53.027 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 52.948 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 50.805 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 51.060 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 51.981 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 52.846 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 51.334 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 50.869 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 50.305 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 50.572 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 52.542 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 52.629 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 52.366 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 51.744 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 53.023 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 51.268 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 50.631 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 52.863 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 52.857 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 52.344 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 52.859 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 52.836 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 51.622 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 52.859 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 62.934 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 56.716 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 51.932 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 52.891 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 53.731 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 51.642 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 53.069 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 50.943 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 51.640 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 51.297 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 52.795 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 51.270 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 51.670 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 50.663 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 51.999 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 50.430 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 51.273 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 51.075 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 52.251 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 52.743 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 64.068 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 51.147 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 62.068 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 50.435 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 51.268 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 52.857 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 52.032 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 52.398 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 50.338 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 52.824 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 50.793 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 52.821 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 50.288 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 51.393 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 52.696 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 51.775 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 51.132 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 51.425 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 51.563 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 52.501 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 50.564 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 52.815 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 50.710 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 51.001 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 50.626 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 51.667 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 50.748 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 52.871 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 52.185 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 50.843 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 52.637 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 51.843 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 51.651 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 52.846 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 52.786 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 52.826 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 52.343 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 50.541 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 52.874 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 51.897 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 51.776 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 51.539 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 52.236 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 50.601 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 52.433 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 51.040 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 52.288 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 51.396 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 51.302 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 51.007 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 50.978 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 52.089 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 52.211 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 52.827 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 51.943 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 50.745 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 50.767 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 50.418 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 52.613 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 52.743 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 50.863 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 52.160 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 52.876 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 52.851 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 52.310 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 52.875 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 52.867 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 52.306 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 50.406 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 50.725 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 52.857 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 52.910 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 50.974 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 51.860 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 51.456 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 51.053 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 51.378 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 52.119 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 52.389 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 51.110 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 52.455 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 50.784 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 50.447 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 51.879 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 52.904 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 51.819 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 50.953 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 52.843 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 51.785 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 52.783 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 50.914 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 52.792 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 52.166 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 52.884 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 51.871 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 52.890 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 52.323 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 52.511 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 50.802 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 50 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 26/100 ON trials. Of those trials, 12 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 6, 7, 12, 13, 17, 28, 29, 32, 33, 41, 43, 51, 57, 62, 67, 73, 74, 75, 82. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 2 ON; omnient pair 8 ON; omnient pair 9 ON; omnient pair 11 ON; omnient pair 14 ON; omnient pair 16 ON; omnient pair 18 ON; omnient pair 20 ON; omnient pair 21 ON; omnient pair 28 ON; omnient pair 31 ON; omnient pair 35 ON; omnient pair 38 ON; omnient pair 41 ON; omnient pair 42 ON; omnient pair 54 ON; omnient pair 59 ON; omnient pair 60 ON; omnient pair 62 ON; omnient pair 70 ON; omnient pair 76 ON; omnient pair 78 ON; omnient pair 79 ON; omnient pair 80 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 1324 | 0A1B6F40-7709-4B43-872D-6BD60780630C |
| 1 | ON | 2 | 1325 | E1DC0187-18ED-4FDE-8B35-9DB858B55AC8 |
| 2 | OFF | 3 | 1326 | EC01A7FA-7AA6-443D-BA9B-6012FD74F09B |
| 2 | ON | 4 | 1327 | 55AF6089-0217-4CAF-B478-2DC9E4E6A79C |
| 3 | OFF | 5 | 1328 | F1A82BDF-0290-465C-B57A-12E551922E2F |
| 3 | ON | 6 | 1330 | D5A9FE35-A1E8-4264-98DE-A7C3A50B1DCA |
| 4 | OFF | 7 | 1331 | 25593596-4227-43BF-939F-82A6C83DDE24 |
| 4 | ON | 8 | 1332 | 4B61486F-1BDC-48F2-AEBC-48F4B6FBCD63 |
| 5 | OFF | 9 | 1333 | 6861FCC7-6B43-41AA-97A9-9806F218E646 |
| 5 | ON | 10 | 1334 | 1E0F12A8-31D0-4470-A9C2-53C348DE8E28 |
| 6 | OFF | 11 | 1335 | 2D580457-BA48-4274-9D8B-1807B3080FB1 |
| 6 | ON | 12 | 1336 | A34C535D-3322-456E-BB51-3715F3CD5BE8 |
| 7 | OFF | 13 | 1337 | 6E975F18-6451-4D69-9F23-22850C1728F5 |
| 7 | ON | 14 | 1339 | 970C6A8E-E2EE-4EA8-B80B-3E28AAEE20A0 |
| 8 | OFF | 15 | 1342 | 9F4D8D97-B33A-44C3-8353-7DF8C9D08E89 |
| 8 | ON | 16 | 1343 | 804C2C7F-338A-4736-88C7-6C40042AA39F |
| 9 | OFF | 17 | 1344 | DCCB3F47-4BBE-4716-BB4E-70BEB1C9EF98 |
| 9 | ON | 18 | 1345 | 4BBDE45B-E0AE-46AA-A059-63D059E067C7 |
| 10 | OFF | 19 | 1346 | 81F67C60-D76C-4087-80BD-9824C2CC1D53 |
| 10 | ON | 20 | 1347 | 879D69C9-918C-425B-9898-6005728313BD |
| 11 | OFF | 21 | 1348 | 77602420-5EE4-42BB-81D5-9392C2F5D594 |
| 11 | ON | 22 | 1349 | BEF997D6-BDFB-4EFA-8801-AB41047667DF |
| 12 | OFF | 23 | 1350 | 2D5EA923-49BC-435C-81D3-4E1C00A83393 |
| 12 | ON | 24 | 1352 | 5477438A-DE68-4505-92FD-EA9B6C38B49E |
| 13 | OFF | 25 | 1353 | FB4D7BE1-184B-4C47-8078-7A151323354F |
| 13 | ON | 26 | 1354 | ACF920FE-570B-4E4E-B71B-49BC8365B05E |
| 14 | OFF | 27 | 1355 | E47435B8-8D6A-4B40-AE28-70F697A53271 |
| 14 | ON | 28 | 1356 | 147413A7-7CD4-4141-AA26-812A2EF3BD14 |
| 15 | OFF | 29 | 1357 | 4FC4E3C8-B7C0-4D02-A11A-F88C515F739D |
| 15 | ON | 30 | 1358 | E1510E8F-C17D-496F-AF20-0FD067436FE9 |
| 16 | OFF | 31 | 1359 | FC882A32-13BB-4555-9850-201E5B7341E6 |
| 16 | ON | 32 | 1360 | F5965D5E-47BA-47C6-BCC3-C6A82AEC2521 |
| 17 | OFF | 33 | 1362 | 95528E14-F434-4D4C-89A1-AF2EA038CFDB |
| 17 | ON | 34 | 1363 | EAC9496E-312D-426B-B51B-3828887F5144 |
| 18 | OFF | 35 | 1364 | D44321FB-6145-4F50-ACA3-C5F029BBEB55 |
| 18 | ON | 36 | 1365 | 80AF66D0-F564-4057-9F34-B2E437B5F180 |
| 19 | OFF | 37 | 1366 | E72D331F-A44C-4FA3-81C5-5B7079379365 |
| 19 | ON | 38 | 1367 | B12409FC-F0D4-4460-B10C-E992CDC04259 |
| 20 | OFF | 39 | 1368 | 124A1D42-4CE8-49A3-9005-A5E6080F3B54 |
| 20 | ON | 40 | 1369 | 8129E58F-415C-479C-AF7F-82A5793DBE7B |
| 21 | OFF | 41 | 1370 | 6BFDC1F6-347E-4621-8C94-48A5DE225F1A |
| 21 | ON | 42 | 1372 | 0E6CCFD3-03D9-4FF6-9CC3-864A4B89DDCC |
| 22 | OFF | 43 | 1373 | 2D055EAB-4238-4556-8DF2-9F894C4D8485 |
| 22 | ON | 44 | 1374 | 6651CC02-5519-4008-9DBC-D7CACDB81274 |
| 23 | OFF | 45 | 1375 | 607E2000-BBA9-4353-8300-72591F7E1CF5 |
| 23 | ON | 46 | 1376 | 7E89EE63-8354-4EAB-865B-132296211A04 |
| 24 | OFF | 47 | 1377 | DBF21576-31C6-446F-A056-8F9FD2DDFA1B |
| 24 | ON | 48 | 1378 | 79C61623-641F-4AED-A49B-424228766D23 |
| 25 | OFF | 49 | 1379 | 9C317824-42A1-4684-BEA8-4B5AA7BE4DB3 |
| 25 | ON | 50 | 1380 | 059544E3-7EAF-4E85-8F81-74984BD6B02F |
| 26 | OFF | 51 | 1382 | FE288339-8A11-4E49-B8FE-B3EAA68D3581 |
| 26 | ON | 52 | 1383 | 2A0C57FB-65CC-4AF2-9D58-DDEDD2E9ED5E |
| 27 | OFF | 53 | 1384 | 3FCB75AA-2707-4C78-AC4B-58670BECA8EC |
| 27 | ON | 54 | 1385 | 3D43287F-795D-4CE5-9660-1796FAA3C160 |
| 28 | OFF | 55 | 1386 | A8DDF5F7-709A-4D3F-9A31-D1311461AF8D |
| 28 | ON | 56 | 1387 | 6EFA8A12-470F-49E8-B265-1B473558C136 |
| 29 | OFF | 57 | 1388 | A6ECDD0A-897F-440D-A056-B189B0459EFB |
| 29 | ON | 58 | 1389 | A542A7A7-9555-47F0-9432-038F754D0077 |
| 30 | OFF | 59 | 1390 | 39B72D07-F331-4A33-927D-83047026D121 |
| 30 | ON | 60 | 1392 | 9C68E076-917B-4B23-9F25-0CFB7860AE79 |
| 31 | OFF | 61 | 1393 | 4FCA3298-2490-4484-93D5-9912FAD3BB21 |
| 31 | ON | 62 | 1394 | C0FC4B74-0981-431D-A9C3-919B2179CAC6 |
| 32 | OFF | 63 | 1395 | B7443C3C-1FCF-49CD-A223-9DA6FE9CC202 |
| 32 | ON | 64 | 1396 | 76BC5A68-EA11-4536-8745-F08EA2197546 |
| 33 | OFF | 65 | 1397 | 020BA32B-A57F-472C-9A30-CEDEFECFABCD |
| 33 | ON | 66 | 1398 | 3F97DC67-CF02-4B22-86B5-8E5DC19D2997 |
| 34 | OFF | 67 | 1399 | 06498EEC-B155-467C-99E6-0F401CE8610C |
| 34 | ON | 68 | 1400 | 55B11349-31B1-4F16-986A-16EBAEE834BE |
| 35 | OFF | 69 | 1407 | B83CDED4-587B-44B4-98EE-7ED2286D9D46 |
| 35 | ON | 70 | 1408 | 97D1DA12-1861-4902-8378-AD1F3FA17B91 |
| 36 | OFF | 71 | 1410 | 36A7EC9C-B2CB-44D7-81EC-195D43C0D5C4 |
| 36 | ON | 72 | 1411 | 78F26A38-32C4-4EF7-BA89-17ADA053B3D6 |
| 37 | OFF | 73 | 1413 | 8C68A669-E1A0-4A2F-816F-9AE17CCFE15C |
| 37 | ON | 74 | 1414 | B340D180-9490-4771-A76A-F6CF3B9651ED |
| 38 | OFF | 75 | 1416 | 02D6EF76-3B0E-46A9-8575-E689EEF12829 |
| 38 | ON | 76 | 1417 | 3BAE53B7-4C0D-475E-8E55-9ABA08F6BA8F |
| 39 | OFF | 77 | 1419 | 939456AD-1C96-46B4-98E1-36B2C40467DD |
| 39 | ON | 78 | 1420 | 985B090B-A265-44C1-88E4-D329A48F2C79 |
| 40 | OFF | 79 | 1429 | 52CC7004-B6B8-49F1-A350-F2A0E6463C40 |
| 40 | ON | 80 | 1439 | 751FAD41-50B7-4000-A6D2-D5CE60CF914E |
| 41 | OFF | 81 | 1451 | 2C775EB3-3959-4ADA-9DF3-E4B6406EE4D2 |
| 41 | ON | 82 | 1452 | CF3336B1-46F6-40C3-B7D2-6A62D5DFDCA3 |
| 42 | OFF | 83 | 1458 | 0FECF405-1B22-4211-A652-F8EAD77FBAEA |
| 42 | ON | 84 | 1465 | 10BFD00F-1440-40F1-B9A7-F425A07DD620 |
| 43 | OFF | 85 | 1467 | AC98EFF9-3875-4BA1-8236-75D8901AEEE0 |
| 43 | ON | 86 | 1469 | A63AABCF-C826-407F-8E37-13E7F9501126 |
| 44 | OFF | 87 | 1478 | AA5615B6-053A-4E51-AC57-F1DD8AC43B02 |
| 44 | ON | 88 | 1479 | C8B82A64-A610-4728-BDAC-D6B9EB61D238 |
| 45 | OFF | 89 | 1482 | AB267924-663A-448D-B371-6BB31CC48B57 |
| 45 | ON | 90 | 1483 | E618B216-1D24-415C-B717-32C282D3F131 |
| 46 | OFF | 91 | 1484 | 165D7D25-0ABC-4BE9-8B17-BCD457BF6EF1 |
| 46 | ON | 92 | 1485 | 591F4315-36E5-469D-8B84-636B0C7B3DA2 |
| 47 | OFF | 93 | 1486 | DBCD08EB-3D2A-47CC-9B48-04C88F578DEF |
| 47 | ON | 94 | 1487 | 74DDA52B-3786-40C7-A36A-4B7B55A93743 |
| 48 | OFF | 95 | 1490 | 53395138-CF22-4A96-B0B4-0D3A1F67EB2D |
| 48 | ON | 96 | 1491 | 5CDBC66B-0944-4B88-AC66-8806A19D6EB3 |
| 49 | OFF | 97 | 1493 | B70A6A76-90D4-43C1-88FC-1B9BCABD5050 |
| 49 | ON | 98 | 1495 | 8A8DED55-55C7-4856-BBEA-54149C765E43 |
| 50 | OFF | 99 | 1497 | 495FB1C0-FB70-49E9-8E8E-F1FD11E255CA |
| 50 | ON | 100 | 1498 | 4E5A35E0-0C38-42F8-85B4-40047B155C88 |
| 51 | OFF | 101 | 1513 | B59849F2-EAF4-4EA6-A46B-2E5F3356D619 |
| 51 | ON | 102 | 1519 | D692968C-F053-4D34-B097-55851B51FD37 |
| 52 | OFF | 103 | 1521 | 32B537E2-F631-4AB1-909F-5D5F928AE8C2 |
| 52 | ON | 104 | 1525 | 28CAF15E-25A1-4365-883F-98F1C33FC51A |
| 53 | OFF | 105 | 1526 | 83BAF64F-9EE1-4129-8F4B-DB4406A6C1A2 |
| 53 | ON | 106 | 1529 | 3E7CE522-9335-40DD-B23B-7F9AF815F4EB |
| 54 | OFF | 107 | 1530 | D92622B1-85E9-49F7-92B2-570634B2EF90 |
| 54 | ON | 108 | 1531 | 8CFF9AA3-06D8-406B-9AE8-66DD2D8E4D1E |
| 55 | OFF | 109 | 1532 | B95F0300-661C-46DF-A03B-EC7620BBBF22 |
| 55 | ON | 110 | 1533 | CBD16557-605E-4758-9B31-2F913233016E |
| 56 | OFF | 111 | 1534 | C1941BCB-00B8-41BF-A135-655B46A28F7C |
| 56 | ON | 112 | 1536 | FA7270A1-7EFA-4E55-9CC5-D516577DBCC2 |
| 57 | OFF | 113 | 1537 | F9B5395F-A2A1-4CA8-AD7F-1F8F23072903 |
| 57 | ON | 114 | 1538 | 29A04B8E-D22C-4E6D-91B6-4A449566A93C |
| 58 | OFF | 115 | 1540 | 27505F88-377A-4010-B61A-3938347FE040 |
| 58 | ON | 116 | 1541 | 4D4B00CB-794D-4C05-B413-26DFBB7AA01B |
| 59 | OFF | 117 | 1542 | 232D63E4-C4DA-4A6B-8663-083B2F0D4336 |
| 59 | ON | 118 | 1543 | EC8731CE-F8B1-4217-8338-C9CBBA9453AE |
| 60 | OFF | 119 | 1544 | E4F8D5C8-2018-4C49-89C1-969B8645FC91 |
| 60 | ON | 120 | 1546 | 3E011484-7D12-4A0B-B93C-0813A53B140B |
| 61 | OFF | 121 | 1547 | 0EE8A378-5927-4C42-ABF6-5823ED68BC8D |
| 61 | ON | 122 | 1548 | 2A6C844A-76AD-4AF4-A384-588D74F3CA3A |
| 62 | OFF | 123 | 1549 | 55BFCE9F-6A3D-47F4-84BF-9263CF0036E9 |
| 62 | ON | 124 | 1551 | 8FAA3920-7012-4B5A-9224-30823C16D24D |
| 63 | OFF | 125 | 1552 | AAAFAE14-2B60-46A7-8678-614196C0FEFB |
| 63 | ON | 126 | 1553 | 2BD162CC-AE90-497D-9791-8F35A615181D |
| 64 | OFF | 127 | 1554 | 2159E9D2-B66E-411B-B7E1-79278E220AA4 |
| 64 | ON | 128 | 1556 | B90BB833-4768-4185-9C66-E750E5C81F06 |
| 65 | OFF | 129 | 1559 | E74A8BC2-3A3E-402D-8898-8DF38CE8E429 |
| 65 | ON | 130 | 1561 | E1830A68-C4EE-4351-8F87-188643383127 |
| 66 | OFF | 131 | 1562 | C0CC0C65-B11D-4E1A-8F46-E0BDE1FF65FA |
| 66 | ON | 132 | 1563 | DE330312-28C4-4193-B1AA-35813B2893B2 |
| 67 | OFF | 133 | 1565 | 72680436-5BED-4D4C-9B6E-58C3264C17F0 |
| 67 | ON | 134 | 1566 | 8FACE948-9707-4EFD-B431-B179D31455CC |
| 68 | OFF | 135 | 1567 | A2201EB6-376D-4870-9AC3-C5D84C3B3937 |
| 68 | ON | 136 | 1568 | D261D2A1-6F68-45B3-920F-9ADCCF0818A5 |
| 69 | OFF | 137 | 1569 | 0E8F9748-E76F-4A36-9743-C576ED2A2F63 |
| 69 | ON | 138 | 1570 | 4E70102B-516D-4BE1-A0DB-27A506CEC506 |
| 70 | OFF | 139 | 1571 | DD0614AA-9B6C-4DF3-A843-FD090FF71102 |
| 70 | ON | 140 | 1572 | 14ECB9AC-9294-4E75-BAA9-4700BB1862DB |
| 71 | OFF | 141 | 1573 | 45837E10-CA65-47CC-9130-E506B0B99C05 |
| 71 | ON | 142 | 1576 | 4BEB5C67-A722-462D-8D55-737A2F67BCB6 |
| 72 | OFF | 143 | 1577 | 47BC8089-E3DB-4C89-8A0F-D5518C8B9F97 |
| 72 | ON | 144 | 1578 | A3F8DA2A-4889-43F9-BCB5-C9CC854FB349 |
| 73 | OFF | 145 | 1579 | CD04D3DA-0697-4B6A-8BB4-1B5CEEC31109 |
| 73 | ON | 146 | 1580 | 0F3D05FE-2FC9-4EBA-8A50-035B322E458E |
| 74 | OFF | 147 | 1581 | 7A864163-C07F-479F-902C-43EDC8C95039 |
| 74 | ON | 148 | 1582 | 440FE8EF-442A-490E-A20B-D1A7CBC3AC55 |
| 75 | OFF | 149 | 1583 | A89E5C45-FFD4-47F5-9C91-61A58612B173 |
| 75 | ON | 150 | 1586 | 78581887-1693-446C-8711-01916AE58AF5 |
| 76 | OFF | 151 | 1587 | 3D29402F-B061-4FFF-9661-5B76EACE9C11 |
| 76 | ON | 152 | 1588 | 235A0595-9310-4194-A79D-73AD812DD2AE |
| 77 | OFF | 153 | 1589 | 101B0200-F52A-46F3-8A3C-790A9038D7BF |
| 77 | ON | 154 | 1590 | DD1539CE-89A1-4979-9B2F-DCAD7D22E80C |
| 78 | OFF | 155 | 1591 | FDB8907F-B0EA-4101-B968-D9A9AD278342 |
| 78 | ON | 156 | 1592 | 509A6001-610D-4E7B-A610-5636A06C1DAB |
| 79 | OFF | 157 | 1593 | 0EA00914-E91F-4F7E-B719-2DBE5134F464 |
| 79 | ON | 158 | 1595 | 67008039-9878-4C03-92DA-695EEDB007DE |
| 80 | OFF | 159 | 1596 | 53A5E4BD-818A-4429-9609-AA4AD81AA9D8 |
| 80 | ON | 160 | 1598 | E9CE8E4A-2DA3-4718-AFED-662B3CB98805 |
| 81 | OFF | 161 | 1599 | 44BA8086-9EDE-4DA6-96EC-621E2498646A |
| 81 | ON | 162 | 1600 | 70DD6022-BE34-4A93-9BCD-1AB2AE39EEB8 |
| 82 | OFF | 163 | 1601 | A624DC75-880C-4357-A35F-F3CE4175B9C6 |
| 82 | ON | 164 | 1602 | F9928EA0-474A-436B-A7A8-87D3B33EA6FE |
| 83 | OFF | 165 | 1603 | 8930D538-3A18-4575-AE33-72FB855E6B9C |
| 83 | ON | 166 | 1604 | 7621DA41-86C5-4B96-ABD2-05AE6E114A88 |
| 84 | OFF | 167 | 1605 | A56555BD-0FBE-4CBE-B306-85986D341F15 |
| 84 | ON | 168 | 1606 | B95197CB-5C28-4938-9100-9F9E4C81E7C4 |
| 85 | OFF | 169 | 1608 | A5045112-7119-4591-8131-A5F9C275C97E |
| 85 | ON | 170 | 1609 | 1AAACA92-7B3B-4B9C-99E0-64F8C1F6AA11 |
| 86 | OFF | 171 | 1610 | 34380108-0D00-41D9-8EC9-69319D4E46CA |
| 86 | ON | 172 | 1611 | F817D140-BB26-4B9B-BB8F-677C52B7F9E5 |
| 87 | OFF | 173 | 1613 | 8A243F57-C8EB-4B83-ABAE-0C8F56364421 |
| 87 | ON | 174 | 1614 | D86D1CD7-47EB-4F9A-848E-675ABF5165C7 |
| 88 | OFF | 175 | 1615 | DFB1EF9D-88A1-440E-B8E7-CF42BBCBD802 |
| 88 | ON | 176 | 1616 | 1B900178-85FD-4796-9F4E-93F8BFFFD6A1 |
| 89 | OFF | 177 | 1617 | 64B27AD3-CEC5-4678-B390-2321A6DFB352 |
| 89 | ON | 178 | 1619 | 051C1169-0D3B-4A2F-A94A-557372BE0291 |
| 90 | OFF | 179 | 1620 | A0D5F5AA-80D7-4774-921B-3321ACE61816 |
| 90 | ON | 180 | 1621 | 7F5EDF2F-E41A-49BF-A56E-E53900EE3579 |
| 91 | OFF | 181 | 1622 | 082C7F4D-792A-4A40-B621-A35BFDD742FA |
| 91 | ON | 182 | 1623 | A7069958-284C-4A0A-BFB4-C9C6D4179A38 |
| 92 | OFF | 183 | 1624 | 37E5A2C7-6763-4DC1-AB86-ABFEC20C7AE3 |
| 92 | ON | 184 | 1625 | 7354E35C-E689-46FF-8E51-6FC0DE8B314D |
| 93 | OFF | 185 | 1626 | 51DF20D5-AAD9-42C6-BEE6-8E89F8B392B0 |
| 93 | ON | 186 | 1627 | 12AC945C-22BC-437E-A8DF-0E39B89DABAF |
| 94 | OFF | 187 | 1629 | 1991D8E8-EEE7-4518-AB75-02EA7B8B4719 |
| 94 | ON | 188 | 1630 | 36A598C1-E256-421C-B408-DF69B2EC045A |
| 95 | OFF | 189 | 1631 | 902E89E9-EDDD-4CB9-8928-ACFF35111CA8 |
| 95 | ON | 190 | 1632 | 70D57721-B84E-49FE-9CDD-3C0B5F4A8C49 |
| 96 | OFF | 191 | 1633 | F7A3F098-37FB-4BF5-AB12-353295AFE622 |
| 96 | ON | 192 | 1635 | B61715F0-D104-4E8D-9E68-8C08A87EA375 |
| 97 | OFF | 193 | 1636 | 574D57E9-96E5-47B5-B27E-163C2C685E96 |
| 97 | ON | 194 | 1638 | CC9603AD-E8E6-4E63-9F07-0F85FD2BF32F |
| 98 | OFF | 195 | 1639 | A26FF636-0C21-4DB2-BA12-AD895D18B2A3 |
| 98 | ON | 196 | 1641 | C8D63C47-EB70-4569-8EB7-DC6E5ABA2B96 |
| 99 | OFF | 197 | 1642 | 6A2D30CC-39AF-4A45-88B8-6ECBBCBEF366 |
| 99 | ON | 198 | 1644 | 5A4DD5FF-AF34-4F2A-A13F-C55D424E24C1 |
| 100 | OFF | 199 | 1646 | 96BF091A-0131-4B59-8C2B-642E440534FD |
| 100 | ON | 200 | 1647 | 924415F4-B7FD-4FA6-91DD-C73121ED98FB |
