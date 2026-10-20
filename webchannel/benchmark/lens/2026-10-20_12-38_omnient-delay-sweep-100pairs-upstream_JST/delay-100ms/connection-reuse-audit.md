# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 29.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 290.000 | 281.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 59.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 23.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 35.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 50.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 46.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 29.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 44.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 27.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 29.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 63.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 59.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 38.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 39.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 46.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 37.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 47.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 48.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 82.000 | 69.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 38.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 48.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 44.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 39.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 38.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 46.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 44.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 43.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 39.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 40.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 46.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 43.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 45.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 39.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 35.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 42.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 39.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 39.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 29.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 32.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 60.000 | 41.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 41.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 48.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 42.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 45.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 81.000 | 63.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 42.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 41.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 44.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 44.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 45.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 44.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 44.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 47.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 59.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 36.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 39.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 40.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 34.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 36.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 31.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 55.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 45.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 39.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 56.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 40.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 70.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 107.000 | 81.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 94.000 | 81.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 39.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 54.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 43.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 53.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 47.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 51.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 30.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 55.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 54.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 48.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 62.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 57.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 71.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 42.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 75.000 | 64.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 47.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 81.000 | 70.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 53.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 53.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 55.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 54.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 31.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 47.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 51.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 44.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 48.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 39.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 46.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 62.000 | 47.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 53.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 51.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 54.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 39.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 37.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 39.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 41.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 41.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 41.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 45.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 53.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 49.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 48.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 35.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 44.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 49.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 39.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 47.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 44.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 43.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 40.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 98.000 | 60.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 39.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 65.000 | 49.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 42.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 61.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 46.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 45.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 43.000 | 28.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 107.576 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 103.972 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 105.924 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 106.067 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 105.733 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 102.456 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 102.449 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 102.682 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 105.630 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 105.107 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 104.378 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 102.880 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 105.000 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 109.300 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 104.399 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 104.745 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 103.648 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 100.869 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 102.829 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 107.764 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 105.339 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 102.021 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 103.946 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 100.560 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 102.872 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 103.454 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 101.652 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 105.400 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 102.558 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 104.120 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 103.213 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 103.652 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 102.433 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 105.225 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 104.231 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 103.715 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 103.663 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 104.648 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 102.299 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 103.827 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 104.196 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 106.806 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 103.726 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 105.392 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 100.943 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 102.286 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 103.383 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 102.546 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 101.161 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 105.479 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 101.863 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 100.948 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 102.247 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 105.479 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 103.240 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 105.416 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 100.832 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 103.670 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 104.943 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 102.879 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 103.557 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 101.952 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 101.633 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 102.685 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 100.859 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 103.041 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 105.031 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 102.038 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 101.173 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 104.079 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 103.463 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 103.690 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 105.350 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 106.650 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 102.327 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 104.312 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 105.356 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 101.426 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 104.283 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 104.534 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 103.761 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 102.631 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 103.475 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 102.647 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 100.940 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 103.078 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 103.659 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 101.503 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 102.195 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 101.134 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 103.290 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 102.553 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 104.505 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 103.979 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 103.367 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 104.455 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 102.574 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 104.049 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 103.153 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 104.550 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 103.719 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 101.301 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 104.047 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 103.429 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 102.207 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 103.914 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 107.586 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 100.979 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 102.993 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 105.340 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 103.408 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 101.505 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 105.353 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 101.306 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 102.113 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 100.631 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 100.565 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 104.253 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 103.748 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 101.386 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 101.446 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 103.536 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 100.861 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 102.988 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 104.243 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 103.173 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 100.368 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 104.029 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 104.650 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 100.944 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 101.727 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 103.704 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 103.740 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 102.754 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 102.466 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 103.886 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 101.923 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 104.571 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 103.689 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 103.770 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 103.139 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 103.122 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 103.230 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 101.044 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 100.644 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 103.523 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 102.012 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 103.204 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 103.156 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 104.279 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 103.700 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 103.658 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 105.527 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 101.265 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 105.346 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 102.531 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 106.512 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 102.191 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 102.684 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 103.021 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 100.766 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 103.278 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 101.332 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 104.651 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 104.918 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 102.115 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 103.781 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 103.083 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 103.690 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 103.788 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 103.601 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 103.951 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 103.772 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 103.867 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 101.929 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 103.929 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 104.909 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 103.875 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 103.390 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 103.329 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 103.624 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 103.791 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 101.226 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 103.591 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 103.765 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 103.061 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 103.525 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 100.703 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 101.698 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 103.612 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 101.823 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 102.458 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 102.338 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 101.030 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 101.991 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 104.098 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 101.145 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 103.287 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 103.851 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 105.383 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 100 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/100 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 1651 | 87477886-B67E-4416-AC3B-F92A693F4C5E |
| 1 | ON | 2 | 1654 | EEC7EFC2-A535-444A-B6ED-DC8C4D982A99 |
| 2 | OFF | 3 | 1656 | 5D75D8B2-CD86-4CC6-8412-B5A83BEA6045 |
| 2 | ON | 4 | 1657 | 67F42759-D244-4B7B-A030-9730B23CBC98 |
| 3 | OFF | 5 | 1659 | E889AEC8-3B1C-4B8E-A71E-60C744A25040 |
| 3 | ON | 6 | 1660 | 47936E56-8D80-41D4-9C21-A636538B340B |
| 4 | OFF | 7 | 1661 | 9DD0B686-FA8E-4D92-98C0-3F4DD8CF6277 |
| 4 | ON | 8 | 1662 | 64DEDA21-D451-4CF7-9893-207F529893FF |
| 5 | OFF | 9 | 1664 | 492BA6CA-4B1B-4B86-AB6A-4389CB6B182D |
| 5 | ON | 10 | 1665 | 84395987-72AB-472A-AA7C-B7A89014BD85 |
| 6 | OFF | 11 | 1666 | BE1A81FA-58CA-4EAC-B4BD-2E0D6B1E8614 |
| 6 | ON | 12 | 1667 | D4F6AA55-75CD-43AC-8F69-A68DE9C12FBA |
| 7 | OFF | 13 | 1668 | 0C0A1A95-19A7-4141-91E5-27E861EB3E4C |
| 7 | ON | 14 | 1670 | 54B85A20-39D0-4EBE-8855-FB35DF2510D8 |
| 8 | OFF | 15 | 1671 | E42F1955-6217-4E56-A250-9CF0AD397016 |
| 8 | ON | 16 | 1672 | 964D8D92-77A6-4AAA-80C3-1ACD5AFD99E2 |
| 9 | OFF | 17 | 1674 | 421C1F9B-E1E0-4294-97DB-4269C7E98FC9 |
| 9 | ON | 18 | 1675 | 0467DB01-CCD1-4EFF-BC68-35C727F1C13C |
| 10 | OFF | 19 | 1676 | 1C88EFEE-15D5-49A4-AA9A-D9A19041954E |
| 10 | ON | 20 | 1677 | 2EB54911-83F5-4337-B244-6588FBD591A8 |
| 11 | OFF | 21 | 1678 | 18664950-4B3D-49F9-B1AF-343571D7A658 |
| 11 | ON | 22 | 1680 | 8CA97BC5-7E30-49FE-B015-48DEC3366532 |
| 12 | OFF | 23 | 1681 | 53C19D7D-62C5-4B67-BEA6-D51F503CD1F4 |
| 12 | ON | 24 | 1682 | 8463B6E1-39B7-4922-A58D-66BFD839F62F |
| 13 | OFF | 25 | 1683 | D56FA2C8-6442-4D6D-A579-33F4266F0755 |
| 13 | ON | 26 | 1684 | BD7C44AC-09FD-4186-A1F4-A8C97F0F9924 |
| 14 | OFF | 27 | 1685 | 5D535B0A-C0F8-422C-9E6E-CFBE827870B4 |
| 14 | ON | 28 | 1686 | 5F6650AE-3EB1-4F95-BF9C-272B955B8E29 |
| 15 | OFF | 29 | 1687 | E7B52E15-A849-4FFE-9193-148C33FE6042 |
| 15 | ON | 30 | 1688 | 1EBD2BF7-E02F-4B69-AEDB-97631D3630EB |
| 16 | OFF | 31 | 1691 | 7A8007E7-3CBD-45C5-9364-443508239616 |
| 16 | ON | 32 | 1692 | 9FC337FF-66A1-432F-9698-84EB30468710 |
| 17 | OFF | 33 | 1693 | AAAB48DA-902D-4E20-8B67-71AB881CCFDE |
| 17 | ON | 34 | 1694 | DC75B352-0475-49B7-BF0B-F7012B57EE4F |
| 18 | OFF | 35 | 1695 | 9F684B3D-B4E8-4D27-A8F5-9569296F5D53 |
| 18 | ON | 36 | 1696 | 93C36333-FB7B-4905-9A53-1B30F97272EE |
| 19 | OFF | 37 | 1697 | A29D700A-A13E-4830-9F81-3645B7896B18 |
| 19 | ON | 38 | 1698 | 8D54CB60-0F56-40E0-923C-0E5BDA4B24FC |
| 20 | OFF | 39 | 1699 | 05CF9D55-528D-4C02-B8FD-47E97C7F63A2 |
| 20 | ON | 40 | 1701 | 99763C52-03BB-425C-B6A6-2FF1CF2245AB |
| 21 | OFF | 41 | 1702 | 58F1065F-7B54-4843-9882-E2405D025860 |
| 21 | ON | 42 | 1703 | 747889C3-21FB-43B6-992A-D60E868A0362 |
| 22 | OFF | 43 | 1704 | 0F60954E-2721-4977-BC61-51F5AD5A098B |
| 22 | ON | 44 | 1705 | 05373ABE-F035-4662-B53B-942E2A7EA6ED |
| 23 | OFF | 45 | 1706 | A81EE442-5C81-413C-B60B-BF115233B8ED |
| 23 | ON | 46 | 1707 | 2A443E0C-4C5B-4FCF-9224-3A8BC2A914D8 |
| 24 | OFF | 47 | 1708 | EF08162A-B88B-44CB-B21E-44CF18DC9949 |
| 24 | ON | 48 | 1710 | 611CD49F-87BB-4681-9B83-9A1EF33AA2DA |
| 25 | OFF | 49 | 1712 | 2C5F8F55-D23C-4BA4-B023-1A44A95A340F |
| 25 | ON | 50 | 1713 | EDA5FD09-5DE8-4C68-8D15-C887EDA263D4 |
| 26 | OFF | 51 | 1714 | 15E133DE-5FFF-4692-AE26-F545D1E0CB73 |
| 26 | ON | 52 | 1715 | 208DEEE1-705C-43EA-9AAB-204F2A406402 |
| 27 | OFF | 53 | 1716 | F33F0051-6818-4E24-ABE7-C7951F6BC4C7 |
| 27 | ON | 54 | 1717 | 706100F0-1927-4EFE-B866-B1ACC2F27AF6 |
| 28 | OFF | 55 | 1718 | 9ED31FA0-B3AB-4981-85F1-43D67DE07269 |
| 28 | ON | 56 | 1719 | 972BB9DE-D602-4FF2-9584-D8181F407053 |
| 29 | OFF | 57 | 1721 | 56184458-DCDB-4BF4-B176-A554EADE4DA4 |
| 29 | ON | 58 | 1722 | D58AD786-EE4F-41BF-AAC2-EC187EEC9274 |
| 30 | OFF | 59 | 1723 | C1080A49-FB31-462C-9889-06AEDFEAFB1B |
| 30 | ON | 60 | 1725 | 342C6E67-9A5E-4CCA-B58B-F9AEFB5AF9B2 |
| 31 | OFF | 61 | 1726 | 07DDF22B-F02E-4177-80C8-07A9830AFEF6 |
| 31 | ON | 62 | 1727 | 1BAE7772-404A-4083-84F1-00FB4E10857C |
| 32 | OFF | 63 | 1728 | 3F30C568-BBD1-4B22-BC32-1DC3B10980B5 |
| 32 | ON | 64 | 1729 | 9CD69406-06DF-4ABF-ABA6-4509BF41C4F1 |
| 33 | OFF | 65 | 1731 | F2FC45B5-0B12-40BF-8060-6989994F8014 |
| 33 | ON | 66 | 1732 | 1F9E4464-9404-4907-B2FB-7C40F12A84FD |
| 34 | OFF | 67 | 1733 | 220B1B24-3A70-41EB-AEDE-351060ECD936 |
| 34 | ON | 68 | 1734 | FD7244A8-1DE0-4A7B-A7EA-4298D040E875 |
| 35 | OFF | 69 | 1735 | 156EBA23-15A6-4B6A-BB73-EA0788380F64 |
| 35 | ON | 70 | 1736 | 8F35D1E5-2E26-4EA3-9A5C-65FF39855665 |
| 36 | OFF | 71 | 1737 | 571BEBDA-2D53-4118-A887-2B71EC834E0E |
| 36 | ON | 72 | 1738 | E0AC93F2-C529-4AD8-8476-1DA2B4CF38F4 |
| 37 | OFF | 73 | 1739 | C364B19E-72B5-41ED-9792-BCF0962575D2 |
| 37 | ON | 74 | 1741 | DCCDACAB-D97B-4569-8019-9D3E80669747 |
| 38 | OFF | 75 | 1742 | FB35886F-2467-47FF-BFA3-4AFD69F9A43F |
| 38 | ON | 76 | 1743 | A4E7A95B-5C96-4241-A502-A4114BBC1B05 |
| 39 | OFF | 77 | 1744 | 4950E7B2-DCB3-4472-ACD2-233A6B05C253 |
| 39 | ON | 78 | 1745 | 2A7C1771-2F1A-42BA-91CA-C81CC04C6FD5 |
| 40 | OFF | 79 | 1746 | CE2A4BFD-9891-44FB-A5D2-7C5561DFD13E |
| 40 | ON | 80 | 1747 | AE09F86B-75A2-4C90-91EA-2D35B115C422 |
| 41 | OFF | 81 | 1748 | F01D606D-9EFE-4038-989C-559B4C26F13F |
| 41 | ON | 82 | 1749 | 129309F9-C983-4CFF-BC66-28D55A9062BC |
| 42 | OFF | 83 | 1751 | BABC47EF-7FC5-46F1-8529-472F9C6F1482 |
| 42 | ON | 84 | 1752 | D12A6637-01BA-4492-8C95-17DC32221933 |
| 43 | OFF | 85 | 1753 | EEC44D80-E9C4-4E03-8CDB-05E937D8221D |
| 43 | ON | 86 | 1754 | F0560AC6-1818-480E-8E2E-749C404E47A5 |
| 44 | OFF | 87 | 1755 | 3C7CB944-A3D6-451D-8BB2-BEE9A5D68A56 |
| 44 | ON | 88 | 1756 | 56A02E39-0D9E-4398-A809-ABFEFFFC455C |
| 45 | OFF | 89 | 1757 | AF3D051F-B8A4-421E-B7BC-010D768F0D05 |
| 45 | ON | 90 | 1758 | 975C6AB0-7F72-42DD-8737-D668FD91CAD0 |
| 46 | OFF | 91 | 1760 | 8624A876-BB97-4687-87EC-55154D158518 |
| 46 | ON | 92 | 1761 | D7579C6F-7ECD-4F9A-99AC-EBF357587BDA |
| 47 | OFF | 93 | 1762 | 346E4143-6DE2-4717-9515-0430EFFB0F8F |
| 47 | ON | 94 | 1763 | A1D85D85-32E3-45FF-B8BA-C909DD92F972 |
| 48 | OFF | 95 | 1764 | EBA212F5-D0AE-4B74-9EEE-250B6468C648 |
| 48 | ON | 96 | 1765 | 87A500F3-EEFC-4BD8-AD3A-58054DE54C64 |
| 49 | OFF | 97 | 1766 | E00E556B-ECA0-4DA6-BA73-4A550B4C43B6 |
| 49 | ON | 98 | 1767 | A74D7E91-4A7D-4A1F-A43D-8281DF529BBD |
| 50 | OFF | 99 | 1768 | 4F4A20B9-CE5D-4F19-AC55-A50151040745 |
| 50 | ON | 100 | 1770 | 8DBCB01F-235E-4ED2-B6F2-C967D87EF27F |
| 51 | OFF | 101 | 1771 | ECEC32F6-48B6-4DE3-911E-F95A727A2996 |
| 51 | ON | 102 | 1772 | F09F019F-E219-4F65-AE30-410441C74693 |
| 52 | OFF | 103 | 1773 | 8F472844-0D09-4F3A-9099-7AB2EBD512FF |
| 52 | ON | 104 | 1774 | 3C4F1399-70C2-4F8B-8A04-2365A2E469D0 |
| 53 | OFF | 105 | 1775 | C2D83E04-C795-4781-A823-A86A3C1120FE |
| 53 | ON | 106 | 1776 | 0083C8CE-9F7B-432D-A35F-E90E92885F6D |
| 54 | OFF | 107 | 1777 | CED0E60B-82DC-4132-9A8C-A77836F2488D |
| 54 | ON | 108 | 1779 | 0443E454-05BC-432F-9BB4-0A69060B3484 |
| 55 | OFF | 109 | 1780 | 50620C8B-7971-4F72-8247-E2432058B680 |
| 55 | ON | 110 | 1781 | A881C24D-AAFA-4F30-8742-4CA3730FB8CC |
| 56 | OFF | 111 | 1782 | E584D840-F9BF-45FE-9335-ACD11B28BCE5 |
| 56 | ON | 112 | 1783 | EC65B570-D76E-458E-8038-4EFB171EBC32 |
| 57 | OFF | 113 | 1784 | 4E3CFEF4-445F-4771-9E10-FABCAF1A1135 |
| 57 | ON | 114 | 1785 | 1CF08EC6-6CEA-444D-8F3D-F77B76702B81 |
| 58 | OFF | 115 | 1786 | 5EC31A15-A826-4033-B02E-7E4F1CFADB71 |
| 58 | ON | 116 | 1787 | B163868D-9444-4B93-AD95-D5713B827BFB |
| 59 | OFF | 117 | 1789 | D2400219-EF6F-4AA4-8008-A525A6B7CF21 |
| 59 | ON | 118 | 1790 | F295A0F9-9FD6-4F65-9027-2AFE7FC89019 |
| 60 | OFF | 119 | 1791 | 57BED6F0-03EE-4B2C-895D-543A921B9EFC |
| 60 | ON | 120 | 1792 | FF87A707-AA0A-4D7D-A203-8F087AD5E0B7 |
| 61 | OFF | 121 | 1793 | 8E70E3C8-C434-45B1-AC3C-742F745A7D1B |
| 61 | ON | 122 | 1794 | B71AE5F9-EC22-4880-9D20-79204D10825C |
| 62 | OFF | 123 | 1795 | B79C6D7D-8664-4A28-BF25-5A488FA971BD |
| 62 | ON | 124 | 1796 | 21315070-BE0A-4FFA-BCDA-318C6F671EDB |
| 63 | OFF | 125 | 1798 | E219237D-A870-48CA-B745-4255D2E7E0F9 |
| 63 | ON | 126 | 1799 | 255FF346-FDAF-4148-9EE3-94DFE4BED806 |
| 64 | OFF | 127 | 1800 | 5C3BD056-2EBE-4F4A-AE1A-B49FD168FEBE |
| 64 | ON | 128 | 1801 | C58E28D2-FEAF-4FD3-ACC0-0BD8759EF385 |
| 65 | OFF | 129 | 1802 | 1F4CE91E-D93D-43DE-8F75-C84972D092E5 |
| 65 | ON | 130 | 1803 | C5BEF070-9928-491A-B088-A58473C59E2D |
| 66 | OFF | 131 | 1804 | 7A0E18FC-DA9F-49C9-A5EB-5C01B4BBE6DC |
| 66 | ON | 132 | 1805 | 6F80730B-2470-43BB-98EE-0B8FC2FA2BC5 |
| 67 | OFF | 133 | 1806 | EF566B63-C99D-4F9C-B52F-AF689DFD4983 |
| 67 | ON | 134 | 1808 | 3F123658-4570-451F-B981-6B49D69CC3A5 |
| 68 | OFF | 135 | 1809 | 5F4671E7-05D3-4A26-9B55-0E06630C7E0C |
| 68 | ON | 136 | 1810 | 74661436-A7FA-4373-8A2D-996DA7E7C80C |
| 69 | OFF | 137 | 1811 | 5D2B4896-865F-4F13-97FA-6C6DE17CEFBF |
| 69 | ON | 138 | 1812 | B4CBA9FB-BDDC-4CDC-ADF7-B1FBFBAD6A5F |
| 70 | OFF | 139 | 1813 | A99B238D-24F3-4729-ABB1-EEA1C94BEF33 |
| 70 | ON | 140 | 1814 | FE9A90EE-C46E-4BF0-A1E0-19127DC6C6DB |
| 71 | OFF | 141 | 1815 | 09EC5F6D-EC4E-4203-8EFE-311B00775AB4 |
| 71 | ON | 142 | 1817 | 5EC5D7B5-498A-4E2D-B5FF-18CD62CD6E57 |
| 72 | OFF | 143 | 1818 | 215DDBA7-C662-4B1A-9765-235623AC932C |
| 72 | ON | 144 | 1819 | E782392C-618F-4A42-A99A-34BC2D8E0B94 |
| 73 | OFF | 145 | 1820 | 0B9592A0-2178-4FFB-834D-845B57CDDEE4 |
| 73 | ON | 146 | 1821 | 27AF3994-B51A-4337-B47B-55D79144141D |
| 74 | OFF | 147 | 1822 | 21DC8D0A-A478-4C6D-87DD-A326B1CD0983 |
| 74 | ON | 148 | 1823 | A2534A03-E7FB-4727-B65E-487D152446CD |
| 75 | OFF | 149 | 1824 | B9D8CCD2-94DF-4874-9D4E-500A776700BE |
| 75 | ON | 150 | 1826 | A6B5C8B6-0D75-4720-824A-002A414C714C |
| 76 | OFF | 151 | 1827 | 091F2C59-AA1C-480F-A930-E13299D72921 |
| 76 | ON | 152 | 1828 | 13BD3C40-E211-4E57-9669-C162CE053024 |
| 77 | OFF | 153 | 1829 | C010B80D-4FCA-4501-ABE3-7C6822537B2F |
| 77 | ON | 154 | 1830 | 2B87583E-9E5E-479A-94B2-5493DD6BA1B8 |
| 78 | OFF | 155 | 1831 | D4D3242C-BFE6-4DF1-85F7-8248E921CEB5 |
| 78 | ON | 156 | 1832 | 9D80F869-537B-48A2-9E68-768B169A86E6 |
| 79 | OFF | 157 | 1833 | D68A3ED8-1981-4B9E-81C5-3C6C1F573BB6 |
| 79 | ON | 158 | 1834 | DDD559F6-D4E9-47DE-A286-F018611554DC |
| 80 | OFF | 159 | 1836 | 6318BCA4-ED2F-4FF0-A65E-66E0554AEF3D |
| 80 | ON | 160 | 1837 | 64F8F021-C14B-40A2-9D89-D498F8D3965C |
| 81 | OFF | 161 | 1838 | C1F8D4FF-DFA5-438A-8257-34C028D73F24 |
| 81 | ON | 162 | 1839 | 2FFE44A8-4AEB-4E32-8B4F-8CABC5B62357 |
| 82 | OFF | 163 | 1840 | 444A291B-457F-492E-98FD-1D96CE0D8BF5 |
| 82 | ON | 164 | 1841 | 5D6B0D30-95E9-44E8-8F5F-C6188A5E1B2A |
| 83 | OFF | 165 | 1842 | A28E7677-C2DC-428C-93B7-4FB601B5ACC4 |
| 83 | ON | 166 | 1843 | 037CDDEC-8AE2-46C0-A49E-21B03C3A0A2C |
| 84 | OFF | 167 | 1845 | FC6B23F8-43D3-4215-98D0-19BF2E18FDF2 |
| 84 | ON | 168 | 1846 | 6BE364E1-B110-48B2-A3FA-223E9FC88C3A |
| 85 | OFF | 169 | 1847 | 343EF128-4FBC-4B5C-9DF7-AEBF29CA207A |
| 85 | ON | 170 | 1848 | FFEFC9E0-6D90-4052-B00F-BCCE5BE37F18 |
| 86 | OFF | 171 | 1849 | AFF9606E-ED74-4B42-A4D9-224CDBF84F7A |
| 86 | ON | 172 | 1850 | B1D6B2B0-D63F-4AD1-A017-733AA0ED012D |
| 87 | OFF | 173 | 1851 | 1164FC55-25F3-4479-BE29-AF7D9050511E |
| 87 | ON | 174 | 1852 | 19B4B1CC-252C-47DF-9260-FC1CE654BBDE |
| 88 | OFF | 175 | 1853 | A509B0F9-9E58-4F88-88C0-BBD38EA550D7 |
| 88 | ON | 176 | 1855 | 8A853758-B5A9-4F2C-AA2B-3F5DA9E4CA39 |
| 89 | OFF | 177 | 1856 | A3D2DAFF-CD7F-4C9F-B887-4B80198C276F |
| 89 | ON | 178 | 1857 | F56ED50C-F0BE-4259-BEEB-06B987176EBC |
| 90 | OFF | 179 | 1858 | CAB0634A-B385-4FB0-8123-EAE831085557 |
| 90 | ON | 180 | 1859 | 9FD4D3FC-B30D-400C-BA65-59E69F256A02 |
| 91 | OFF | 181 | 1860 | 4F1CC1AD-1000-45E8-AEB3-D0029A5458B0 |
| 91 | ON | 182 | 1861 | 87740F51-1C49-4C54-97E3-8614F4BAE8C0 |
| 92 | OFF | 183 | 1862 | A4D94C9E-1DDA-4547-B11D-D012540CB7B6 |
| 92 | ON | 184 | 1864 | A1AEC32A-31F5-4895-A766-2870C1BB7DA1 |
| 93 | OFF | 185 | 1865 | 435F972A-53F1-4359-939F-D3E05CBC9E78 |
| 93 | ON | 186 | 1866 | B83A3E50-8909-472C-84E8-A2958416D9BF |
| 94 | OFF | 187 | 1867 | 431DC2C9-AC3A-43AD-87A5-8EFBF00CFAAC |
| 94 | ON | 188 | 1868 | BAFAEB5A-177D-4847-84CF-F8BC85B6EC38 |
| 95 | OFF | 189 | 1869 | E8DBF4C9-5082-48DA-8313-9F8F5B18ED3C |
| 95 | ON | 190 | 1870 | 21251FBD-E4CF-49C6-BD3C-136D25AF1731 |
| 96 | OFF | 191 | 1871 | D9A77564-58EC-449C-B2CB-134879097A66 |
| 96 | ON | 192 | 1872 | 9C2BB54B-9419-4E0F-B76D-10BFACE38488 |
| 97 | OFF | 193 | 1874 | 58B557EB-EC23-4DF1-A83C-489179C019C7 |
| 97 | ON | 194 | 1875 | 3B9C4F48-7240-4257-9BF4-360561388973 |
| 98 | OFF | 195 | 1876 | A8B57A5F-2EB9-480C-BD28-FAEED0EA6181 |
| 98 | ON | 196 | 1877 | D1971792-783D-485C-9623-87D5A1D1C1FB |
| 99 | OFF | 197 | 1878 | B6A47F7F-E88E-4A89-9180-AFC160739347 |
| 99 | ON | 198 | 1879 | AD5C716E-8BCD-4EEF-AEF3-D5723AEA20C9 |
| 100 | OFF | 199 | 1880 | 951FA6F6-959D-4870-A8A5-4748E190D2DE |
| 100 | ON | 200 | 1881 | 841ED8D5-1B4F-4A0A-86BE-F97F87DC2F7F |
