# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 46.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 61.000 | 49.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 36.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 44.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 48.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 38.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 61.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 47.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 40.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 86.000 | 64.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 54.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 55.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 51.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 51.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 75.000 | 55.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 89.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 40.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 47.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 47.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 35.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 40.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 89.000 | 75.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 48.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 54.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 44.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 95.000 | 82.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 41.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 42.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 48.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 80.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 31.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 33.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 32.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 28.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 45.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 38.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 43.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 43.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | not sent | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 60.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 26.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 42.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 19.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 303.000 | 292.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 38.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 31.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 20.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 37.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 57.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 40.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 55.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 33.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 36.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 321.000 | 280.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 63.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 40.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 40.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 39.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 69.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 64.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 57.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 63.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 37.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 40.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 82.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 69.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 39.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 33.000 | 15.000 | 192.178.226.81 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 54.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 81.000 | 62.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 37.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 76.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 65.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 38.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 19.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 400 | handshake | h2 | false | 151.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 39.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 96.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 33.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 47.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 37.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 98.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | 400 | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 33.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 55.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 34.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 37.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 56.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 57.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 69.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 56.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | 400 | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 55.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 46.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 95.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 73.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 38.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 36.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 69.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 47.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 104.000 | 69.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 44.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 44.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 34.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 61.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 62.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 84.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 51.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 40.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 63.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 40.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 36.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 77.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | 400 | handshake | h2 | false | 49.000 | 32.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 150.595 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 156.317 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 155.822 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 154.947 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 152.030 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 156.107 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 156.536 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 154.404 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 156.579 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 150.980 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 153.650 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 156.683 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 155.153 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 151.599 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 156.708 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 156.282 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 152.405 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 156.275 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 156.397 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 156.238 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 153.779 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 151.082 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 153.915 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 156.973 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 153.410 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 153.391 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 150.999 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 156.265 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 152.831 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 152.058 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 152.403 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 152.661 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 156.313 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 154.952 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 155.371 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 153.474 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 156.182 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 151.303 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 155.796 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 151.666 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 150.539 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 157.280 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 150.949 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 156.587 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 154.051 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 151.612 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 154.441 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 153.040 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 154.241 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 155.129 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 156.069 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 154.553 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 150.765 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 151.858 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 150.501 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 154.181 | count=0 | post-open POST | post-open POST |
| omnient | 29 | OFF | 157.398 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 151.197 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 154.808 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 155.298 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 156.054 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 157.438 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 150.441 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 153.059 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 157.219 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 154.694 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 157.058 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 157.903 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 154.449 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 156.307 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 154.315 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 150.729 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 156.332 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 152.014 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 155.918 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 157.137 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 153.132 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 157.888 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 155.089 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 153.656 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 155.714 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 152.053 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 153.045 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 156.285 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 155.732 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 151.054 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 157.475 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 150.760 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 157.624 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 155.780 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 157.623 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 154.950 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 151.417 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 155.374 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 156.438 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 152.206 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 152.188 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 156.059 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 156.292 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 157.554 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 151.755 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 155.268 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 156.726 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 150.533 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 156.108 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 157.856 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 155.749 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 155.244 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 156.585 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 156.496 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 155.229 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 153.712 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 155.454 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 156.873 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 156.801 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 152.003 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 154.558 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 156.204 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 153.377 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 151.684 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 151.922 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 156.139 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 156.356 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 155.606 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 156.451 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 155.343 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 156.876 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 154.156 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 156.167 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 152.961 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 156.368 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 155.865 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 152.434 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 153.793 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 156.152 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 150.670 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 156.447 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 152.424 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 156.056 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 154.441 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 154.163 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 152.237 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 153.008 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 155.266 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 154.082 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 155.273 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 155.025 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 153.620 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 156.281 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 155.863 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 150.838 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 155.975 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 155.715 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 155.922 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 151.203 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 153.697 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 156.907 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 153.586 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 154.059 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 153.388 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 154.672 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 150.404 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 156.283 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 156.097 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 153.309 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 153.054 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 152.628 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 154.145 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 150.663 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 155.059 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 156.262 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 154.566 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 152.791 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 154.731 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 151.153 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 156.570 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 156.321 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 156.675 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 156.161 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 154.782 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 156.932 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 154.433 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 154.126 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 153.669 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 152.632 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 151.293 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 150.848 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 156.645 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 152.604 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 155.832 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 153.113 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 152.339 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 151.351 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 150.381 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 156.677 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 156.195 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 153.856 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 155.589 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 155.951 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 153.058 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 150 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 4/100 ON trials. Of those trials, 4 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 35, 75, 79, 88, 100. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 1883 | 9DD4138C-0BCF-4E40-8BA6-C8DEE8996254 |
| 1 | ON | 2 | 1885 | 9D65718E-9292-40D9-8314-5EED9031480A |
| 2 | OFF | 3 | 1886 | AD13C685-4265-4103-9C4F-69C68ACA71C2 |
| 2 | ON | 4 | 1887 | 2283CDC2-B571-4F86-9ECE-B2C693055BE9 |
| 3 | OFF | 5 | 1888 | 50953D44-B2E9-48F9-B270-CEEFB01442B7 |
| 3 | ON | 6 | 1889 | 1B6A89A4-0FDA-49E6-9675-7C40992A5E1E |
| 4 | OFF | 7 | 1890 | AA4CA713-7878-412E-B0F5-E89DD6D06D6F |
| 4 | ON | 8 | 1891 | 2E5A7988-E93A-4B98-AB10-1306CC3E4B31 |
| 5 | OFF | 9 | 1892 | D83D8726-FF6B-430D-9300-78792E0D4071 |
| 5 | ON | 10 | 1894 | 9C3421E5-8095-44A4-9642-1DB1D5456F75 |
| 6 | OFF | 11 | 1895 | AA15227C-47B4-407C-93C0-1BFCFDBB2956 |
| 6 | ON | 12 | 1896 | CF1FACBB-1B6A-46FB-8993-91C4A17A038C |
| 7 | OFF | 13 | 1897 | 61E95D6F-949A-4250-B9BE-C788C072D639 |
| 7 | ON | 14 | 1898 | 5DDA686D-57E1-44B2-BA00-80B5381D5716 |
| 8 | OFF | 15 | 1899 | 090075B7-D6B8-4A47-90F0-1D9EA4FF21CA |
| 8 | ON | 16 | 1900 | F2A11AB8-E6D0-4997-8BE4-E081B21358A5 |
| 9 | OFF | 17 | 1901 | 821FD83C-5AAE-4C6F-B65B-427A62916E6A |
| 9 | ON | 18 | 1903 | 6FB45F7A-0D93-4D9E-97EA-351128CA42CB |
| 10 | OFF | 19 | 1904 | 555A2379-ED1E-4064-934D-82FC788790CD |
| 10 | ON | 20 | 1905 | B2E7E73E-8093-4D3B-AED2-CDF7F525D524 |
| 11 | OFF | 21 | 1906 | 41391B1C-A352-4D38-93E7-F36D14D1446E |
| 11 | ON | 22 | 1907 | CF61A11A-DC7D-4AD3-81F3-2F098025B0DB |
| 12 | OFF | 23 | 1908 | 4A98057C-2F92-410D-BBC3-FD6DD084B602 |
| 12 | ON | 24 | 1909 | D0BF4C90-4DD2-4216-B72C-9684905A873B |
| 13 | OFF | 25 | 1910 | 6301E4A5-B9AC-4CBF-B18F-2B53DA161AE9 |
| 13 | ON | 26 | 1912 | 7F5912C2-6D72-4A04-804D-2ABD5285DE14 |
| 14 | OFF | 27 | 1913 | 2D190AE7-7E8A-4729-9FD1-D43014ED241C |
| 14 | ON | 28 | 1914 | 9F831A88-2FFF-4ED6-8EA8-4C840CBF2838 |
| 15 | OFF | 29 | 1915 | 88557D09-4C56-4116-92C4-325FA8FDC6D5 |
| 15 | ON | 30 | 1916 | 5C47CA59-A29F-4E62-A8EA-2978D5206EC6 |
| 16 | OFF | 31 | 1917 | AE5C8FCA-612C-4F54-A0FD-F1592D3A7789 |
| 16 | ON | 32 | 1918 | F4516910-38C4-4F61-AEC7-E57488069E30 |
| 17 | OFF | 33 | 1919 | 1E594AFA-9065-4BF9-9E10-24B7FE0BB4F0 |
| 17 | ON | 34 | 1920 | E460F484-EB46-4C37-9D74-0DECBC9A949B |
| 18 | OFF | 35 | 1922 | 60523D96-72D1-47BD-BAAF-CE7DF0A01B25 |
| 18 | ON | 36 | 1923 | 40774BB3-D5A2-42DF-A39C-A2F4753C784C |
| 19 | OFF | 37 | 1924 | CFC9F090-2906-484E-9E82-882DA44DCA45 |
| 19 | ON | 38 | 1925 | 96BBC142-8A85-4CAD-A39D-6F1F8481B105 |
| 20 | OFF | 39 | 1926 | B2F1EF83-2831-4A61-A998-4D949470167A |
| 20 | ON | 40 | 1927 | 34D435C6-9CA9-4984-806A-6C6724C2A251 |
| 21 | OFF | 41 | 1928 | B9EAECAE-1B07-4CC3-82D2-36948B02CD02 |
| 21 | ON | 42 | 1929 | F71C0AFA-D847-4610-9200-1AEA517219DF |
| 22 | OFF | 43 | 1931 | 12C5C865-DEF3-40F0-8213-3E8714BBD329 |
| 22 | ON | 44 | 1932 | F78F7DD7-DC23-4AF4-B080-E4D5A3E16C7C |
| 23 | OFF | 45 | 1933 | 5294A836-8E87-4945-97CD-871268E7758B |
| 23 | ON | 46 | 1934 | 197F04B8-980D-4A3E-B434-9F61F7F542ED |
| 24 | OFF | 47 | 1935 | 378214A3-FE4C-418D-99DB-58A2D3CF4230 |
| 24 | ON | 48 | 1936 | 501239AC-452E-4FF6-A952-B82F001FD329 |
| 25 | OFF | 49 | 1937 | C56A95E8-9FAF-496B-975C-E4CC09A87614 |
| 25 | ON | 50 | 1938 | 4E1D8599-0047-4D86-B176-472EF14ECC91 |
| 26 | OFF | 51 | 1940 | 2CE31ED3-CF26-4D65-A54D-3D597936289A |
| 26 | ON | 52 | 1941 | 0403B228-1BE4-450B-B04A-927A647305D6 |
| 27 | OFF | 53 | 1942 | 624AAFBB-4EC4-4D0E-BFC8-41D286552035 |
| 27 | ON | 54 | 1943 | 97F79101-7141-48D5-AA57-06A31F7254FE |
| 28 | OFF | 55 | 1944 | 27B5D250-BDA4-4676-8F34-F009477993AB |
| 28 | ON | 56 | 1945 | 19EE14AA-1219-4C97-B6CA-72E8903019D8 |
| 29 | OFF | 57 | 1946 | 1ED933BC-A0EB-458D-A3FA-17675EBA091B |
| 29 | ON | 58 | 1947 | 0914A647-4BC7-476E-80B0-0E1B4DDB4783 |
| 30 | OFF | 59 | 1949 | 77829A3C-B494-4FFF-B825-31DA6D10AA01 |
| 30 | ON | 60 | 1950 | F3A81448-744A-4398-909F-0119560F2AB2 |
| 31 | OFF | 61 | 1951 | B877578F-5A63-4AC3-AE65-2F32D3C983A3 |
| 31 | ON | 62 | 1952 | 4AAD4857-5D08-4065-9E3C-19F8E6488F5D |
| 32 | OFF | 63 | 1953 | F0D92399-668D-453D-866F-EC0B26251008 |
| 32 | ON | 64 | 1954 | EB2C6BD4-C2D6-4E41-9FDE-C47531B2331E |
| 33 | OFF | 65 | 1955 | 2E2322E9-97FD-4463-A750-3E44FB0F4172 |
| 33 | ON | 66 | 1956 | B7895726-69FC-49DE-8585-8E06E12E7D41 |
| 34 | OFF | 67 | 1957 | 74268822-434A-4303-AA25-2900C9813324 |
| 34 | ON | 68 | 1959 | 1024DD2E-B49C-4BEE-9973-2BE0EA7C4481 |
| 35 | OFF | 69 | 1960 | 091041A3-F1BB-4834-AD86-4BC896720223 |
| 35 | ON | 70 | 1961 | E32A5B3D-D84E-4F0A-A04C-6CE5D760AB14 |
| 36 | OFF | 71 | 1962 | DD269185-A7ED-43CA-A8C0-8D918E9A6DB3 |
| 36 | ON | 72 | 1963 | 71AA7B4F-D3E1-4DD6-9E1B-6BD224853AD0 |
| 37 | OFF | 73 | 1964 | 8B1D4CA6-C91B-45B8-B0E1-5A5DFD69AA0E |
| 37 | ON | 74 | 1965 | E503BF9D-8938-48E2-8FC2-CA56CED47A2A |
| 38 | OFF | 75 | 1966 | 7953CB75-0748-4BB6-8FBD-4A584901327A |
| 38 | ON | 76 | 1968 | FF2E4BDE-FE4D-4D80-848C-4AFD900F4CF7 |
| 39 | OFF | 77 | 1969 | 0653BF7D-5461-49F3-8A09-051117A6D110 |
| 39 | ON | 78 | 1970 | 7F3E64FF-1E9C-4855-8106-9C76ECC3D1D7 |
| 40 | OFF | 79 | 1971 | 85D41058-B183-47EA-A2A2-83C293840211 |
| 40 | ON | 80 | 1972 | A7F2AC32-3D49-4FE4-96CD-B61714369154 |
| 41 | OFF | 81 | 1973 | 684DDB3E-352C-4F3F-A884-581C1D6FBED6 |
| 41 | ON | 82 | 1974 | 10EA691F-0479-4F7C-92DF-E7FB054E99CB |
| 42 | OFF | 83 | 1975 | C92F7AB0-E4C6-486B-AFD1-2CE383AD87F5 |
| 42 | ON | 84 | 1977 | 77721D14-64E6-4003-BC1F-7241CBDD99D0 |
| 43 | OFF | 85 | 1978 | 0BB6166F-8913-40A3-A41E-397B47ABCA82 |
| 43 | ON | 86 | 1979 | FB6E5518-B5C4-4E36-924A-42158D1A95D6 |
| 44 | OFF | 87 | 1980 | 53A26B61-A32F-4403-A022-55636BA58781 |
| 44 | ON | 88 | 1981 | 4439DD27-8293-4F11-A2BD-07DD26708DCC |
| 45 | OFF | 89 | 1982 | 56A5CDC3-4D70-4DBE-9CA0-3CCF2874F692 |
| 45 | ON | 90 | 1983 | EE273609-E1BD-4246-8D36-5EB6F626741E |
| 46 | OFF | 91 | 1984 | 7ED4762D-B731-4104-927F-7FDFC60D20A4 |
| 46 | ON | 92 | 1986 | 73EA9B6E-6928-4546-85A9-AB1A8395088F |
| 47 | OFF | 93 | 1987 | DABED0CE-72A1-43E4-BCA3-4C8B9AAB6983 |
| 47 | ON | 94 | 1988 | F5E7B8E0-36E6-4607-96B9-10F503C98226 |
| 48 | OFF | 95 | 1989 | 1551D5C6-7540-4335-A74E-B4AC963606BA |
| 48 | ON | 96 | 1990 | D1D3D06A-FFA6-4AA4-83C9-36B6324DD530 |
| 49 | OFF | 97 | 1991 | 6C474BBE-5980-4CAF-9418-2BA1C1762ED7 |
| 49 | ON | 98 | 1992 | 9B9727E7-AA77-45C3-BF22-4CF536FC9127 |
| 50 | OFF | 99 | 1993 | 7B554CBB-3272-4A7E-8CD9-55FE3603EAF6 |
| 50 | ON | 100 | 1994 | 9EC98B61-6E07-4D4A-B0EA-901AFA4D5081 |
| 51 | OFF | 101 | 1996 | 975268DC-3853-4DAE-A305-18FD23007D5F |
| 51 | ON | 102 | 1997 | 0113EE0C-D3BB-474C-B371-4D15B75C3987 |
| 52 | OFF | 103 | 1998 | DEA7778E-7984-459C-9CED-31C9DC022C5E |
| 52 | ON | 104 | 1999 | 76255168-9B3F-4359-B5CE-7A15FCC751DB |
| 53 | OFF | 105 | 2000 | 1312A982-2D67-4199-8FCD-8B4567C64248 |
| 53 | ON | 106 | 2001 | 3BE5842F-673E-4C89-AC6D-AAFB9BFF4180 |
| 54 | OFF | 107 | 2002 | 60D5869B-377C-4D4B-8B51-DA3D21E1189E |
| 54 | ON | 108 | 2003 | AF349B6B-5E88-4C9E-A243-B176B03C416D |
| 55 | OFF | 109 | 2005 | 1BE3652B-7508-45F8-A7A6-E8399D9763E9 |
| 55 | ON | 110 | 2006 | 22C23939-3D07-4A91-AA83-32A8E9B31DAA |
| 56 | OFF | 111 | 2007 | E62E118E-9C56-489E-A503-1E981AF8111A |
| 56 | ON | 112 | 2008 | 962CECED-C78D-437A-9DB6-B8DF2E5758A9 |
| 57 | OFF | 113 | 2009 | 6664621F-1F57-4E2B-9A0B-0461410A87D3 |
| 57 | ON | 114 | 2010 | A250A45A-F229-499B-B2E0-4CFF622E2160 |
| 58 | OFF | 115 | 2011 | 25854677-8A9C-46D7-9B22-822CE58F13A9 |
| 58 | ON | 116 | 2012 | 6767C483-E4C4-4562-BD3D-22F6BBFCF621 |
| 59 | OFF | 117 | 2014 | F2639717-032F-41F6-865F-F56363A6E820 |
| 59 | ON | 118 | 2016 | 1A257BAE-B388-4118-9A3D-F9D1282C9A7F |
| 60 | OFF | 119 | 2017 | 328BE427-F4F9-4AB3-BEA0-129D5FE35785 |
| 60 | ON | 120 | 2018 | B884E037-0769-4769-A450-F753B2B23D2A |
| 61 | OFF | 121 | 2019 | 36D6314B-C42F-42F8-A53D-9198817450D7 |
| 61 | ON | 122 | 2020 | A9928C71-B4BF-4CBF-A304-BE3BAA45F5AB |
| 62 | OFF | 123 | 2021 | FDCC551C-F1AE-4A83-B1E1-47E6523403E8 |
| 62 | ON | 124 | 2022 | FE7C4277-6855-463C-8A39-EC4F5AAAA0E5 |
| 63 | OFF | 125 | 2024 | 45367070-FFD3-427F-813C-309CB204285B |
| 63 | ON | 126 | 2025 | B6EFE969-2D03-4B8B-BE95-95BAEF666897 |
| 64 | OFF | 127 | 2026 | 76D210DC-2671-43D2-B89B-DEB3830071C8 |
| 64 | ON | 128 | 2027 | BFBCDD41-F584-44D1-8808-D65CEFE71BDC |
| 65 | OFF | 129 | 2028 | 7EF1A71B-F377-4F4D-A510-F217873C1796 |
| 65 | ON | 130 | 2029 | 1DCDBB7A-9849-41AC-88B6-A914D6015EF1 |
| 66 | OFF | 131 | 2030 | F2716442-E116-4B28-8B2B-F1E724957262 |
| 66 | ON | 132 | 2031 | 749618D5-B33C-48FD-B970-1F20640DD2D8 |
| 67 | OFF | 133 | 2033 | 8D3CFD0B-A556-4104-929A-7627E28C17AF |
| 67 | ON | 134 | 2034 | BA15DCFB-E432-4909-979D-23CE579312B9 |
| 68 | OFF | 135 | 2035 | 6D93115C-CCC4-4BD0-8F44-ABBF14B4196A |
| 68 | ON | 136 | 2036 | DDA6A679-F52E-4E52-88A1-4ABD8C21BF0F |
| 69 | OFF | 137 | 2037 | A4E71528-394A-4766-B979-07EDF16FE0F3 |
| 69 | ON | 138 | 2038 | 67D86563-47A5-417D-9715-9B83D7CE3DA6 |
| 70 | OFF | 139 | 2039 | 02ABFEA4-B168-4979-A080-F3CC1A63DBC8 |
| 70 | ON | 140 | 2040 | 5955A413-EB74-426D-94C1-D28AE37D20B2 |
| 71 | OFF | 141 | 2042 | F735ACFA-6819-4A88-9785-FB72D718708D |
| 71 | ON | 142 | 2043 | 0DCF53C2-773E-4DEF-B12D-B1D3D629A45D |
| 72 | OFF | 143 | 2044 | E1A03665-850F-43B2-8AB9-87CD7CF67BF0 |
| 72 | ON | 144 | 2045 | 93062E06-EB64-40D1-84BE-7A49AC8AC9BF |
| 73 | OFF | 145 | 2046 | A9665CDA-1275-415E-AB85-3C6EF892213E |
| 73 | ON | 146 | 2047 | 83278227-69B2-41C9-9DD3-108724603708 |
| 74 | OFF | 147 | 2048 | 7641E447-95B9-4B50-8E39-E8F51981E025 |
| 74 | ON | 148 | 2049 | DD7458D5-3895-4BED-91BF-3ABAE4EA6611 |
| 75 | OFF | 149 | 2051 | 72085CE6-9205-4CFC-94F8-DC257F554437 |
| 75 | ON | 150 | 2052 | 9FA15AD8-46AF-413B-A9E8-376A4BAD0566 |
| 76 | OFF | 151 | 2053 | 6C2878BC-E893-4632-BAE3-EA72B884BA71 |
| 76 | ON | 152 | 2054 | 3898E90A-0166-495C-B128-AB4DEEB75349 |
| 77 | OFF | 153 | 2055 | 1820CBBF-A02B-4E2A-A319-4FF2FBFB45F3 |
| 77 | ON | 154 | 2056 | AF711E95-5D26-4B7C-A68E-115CB2614681 |
| 78 | OFF | 155 | 2057 | D9BBCDA7-2CC8-4B0C-AF6D-4AD4DEAB7136 |
| 78 | ON | 156 | 2058 | A7E15323-1EC6-4B1A-BAEF-5173909BD9FA |
| 79 | OFF | 157 | 2060 | 12CF7B85-258F-46D0-B1D4-3DB2721DCE72 |
| 79 | ON | 158 | 2061 | BDE7A55E-BAE6-4123-BAF2-2910F3D2B5D8 |
| 80 | OFF | 159 | 2062 | 5DE969FE-1E10-4A35-A170-2D7E7D915D7F |
| 80 | ON | 160 | 2063 | 948D6B2F-0B9D-4CDD-910C-289415C3FDA1 |
| 81 | OFF | 161 | 2064 | 15FF8C8E-9586-4ADC-9852-1CDE3BB9D15F |
| 81 | ON | 162 | 2065 | 3ABA6607-0DAE-4FA3-A4C6-75454D424D34 |
| 82 | OFF | 163 | 2066 | 02CD503B-FB1E-4A10-BF93-A9DD139117AF |
| 82 | ON | 164 | 2067 | 72F8F077-2FB2-48FB-9E8A-CCDFDB9EA84C |
| 83 | OFF | 165 | 2069 | 9DFB21D7-53E3-40C2-BA95-DD04A800AC0C |
| 83 | ON | 166 | 2070 | CE3915AB-AD76-461B-8CB8-04CA31E27737 |
| 84 | OFF | 167 | 2071 | 15746605-6613-417A-A8F1-BB18D27E55BD |
| 84 | ON | 168 | 2072 | 853A95B9-93B8-4129-9D93-636BDF64ED03 |
| 85 | OFF | 169 | 2073 | 13791393-83F0-425B-9182-FF0E2D57544D |
| 85 | ON | 170 | 2074 | A19DE59A-85A2-4E53-B964-1EB3827A6741 |
| 86 | OFF | 171 | 2075 | E8BBAC8E-764B-4331-9364-D6255952FB28 |
| 86 | ON | 172 | 2076 | 33739652-29F0-42CD-935A-13308CF93C94 |
| 87 | OFF | 173 | 2078 | E41CAAE1-D4FB-4157-B1DD-5A1389D9C1E6 |
| 87 | ON | 174 | 2079 | E11D4ED3-EA9B-408F-A71D-D70D00DE9CFD |
| 88 | OFF | 175 | 2080 | F1ACAD66-3F91-47D7-B358-617F0C854E71 |
| 88 | ON | 176 | 2081 | 7C58F3E8-218A-44E8-98A3-37570D14FEB4 |
| 89 | OFF | 177 | 2082 | D58FDE3F-F9B3-4849-A0FC-5F7A0981C7E6 |
| 89 | ON | 178 | 2083 | D3A0BC2E-1B35-4B31-8166-3CBEDA99DEF0 |
| 90 | OFF | 179 | 2084 | BE44826A-7098-4C7F-80B6-B42C31D5A4E3 |
| 90 | ON | 180 | 2086 | CDF389D4-E551-42D0-94C0-116B6430416E |
| 91 | OFF | 181 | 2087 | EAF55BBA-4D41-4E1B-91F2-E04B41F28CD5 |
| 91 | ON | 182 | 2088 | DE2774AA-9A62-4DD5-BB99-3737B04AD37E |
| 92 | OFF | 183 | 2089 | 68AC9183-87BE-4EF6-9F55-28463AE2F51E |
| 92 | ON | 184 | 2090 | 48B32D13-39A9-4DB4-BB46-75EB57F40693 |
| 93 | OFF | 185 | 2091 | 2F7CF136-FED0-4B67-9993-72292DC07EB3 |
| 93 | ON | 186 | 2092 | 727F93A1-E25E-4629-97B3-04315FFEBD18 |
| 94 | OFF | 187 | 2093 | BD277AC3-929C-4056-895D-CA018324AD50 |
| 94 | ON | 188 | 2095 | 89BC15AF-D192-4F67-ACB6-8C37C187DCE5 |
| 95 | OFF | 189 | 2096 | 624E9DA9-3C07-4B67-9FAF-3015ACE178E3 |
| 95 | ON | 190 | 2097 | 7EC88761-4447-4962-B0FE-30E8178722CF |
| 96 | OFF | 191 | 2098 | D7970CA1-659D-46D7-90F3-93D49DC468D6 |
| 96 | ON | 192 | 2099 | 51954CEC-DEC4-4EA4-B6EE-58273C25E172 |
| 97 | OFF | 193 | 2100 | 52F44D02-FF4A-4A6A-B507-4790D673FE92 |
| 97 | ON | 194 | 2101 | 2514F193-458E-441E-BFD3-2C78C3BC4C47 |
| 98 | OFF | 195 | 2102 | 9290BA03-1FA8-46FD-BB6B-BBD54EF78B02 |
| 98 | ON | 196 | 2104 | 19486C54-1183-4BAD-A5C0-50B6B3A9E357 |
| 99 | OFF | 197 | 2106 | 991CB4EC-0DB3-43AD-84C5-E82EA62B58F4 |
| 99 | ON | 198 | 2107 | 30D6DD33-E354-495D-8C63-7657CBA9E806 |
| 100 | OFF | 199 | 2108 | 883955D4-3AFD-4D01-9604-011105B287EB |
| 100 | ON | 200 | 2109 | 1009AC6B-2378-4E94-9213-47ADEEA05F12 |
