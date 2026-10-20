# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 60.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 39.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 32.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 61.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 35.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 38.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 58.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 42.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 58.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 58.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 317.000 | 307.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 400 | handshake | h2 | false | 309.000 | 297.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 94.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 42.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 76.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 70.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 33.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 20.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 50.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 29.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 65.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 400 | handshake | h2 | false | 305.000 | 293.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 324.000 | 310.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 47.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 30.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 57.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 49.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 28.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 331.000 | 316.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | 400 | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 34.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 46.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 41.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 38.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 26.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 32.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 37.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 48.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 90.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 36.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 28.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 34.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 53.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 31.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 42.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 42.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 38.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 43.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 50.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 25.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 45.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 35.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 32.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 44.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 56.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 26.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 35.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 33.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 64.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 39.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 43.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 36.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 33.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 33.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 35.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 101.830 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 103.230 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 103.706 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 103.490 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 101.237 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 104.357 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 102.026 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 102.367 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 101.585 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 107.725 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 101.732 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 108.975 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 105.261 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 105.119 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 102.964 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 105.746 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 104.800 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 104.813 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 107.265 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 103.185 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 107.959 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 104.535 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 100.462 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 106.469 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 104.644 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 103.559 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 102.582 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 102.223 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 105.047 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 102.352 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 107.595 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 105.368 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 105.303 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 103.540 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 102.282 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 101.696 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 106.459 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 100.695 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 103.223 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 105.167 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 102.797 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 101.980 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 101.342 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 103.256 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 102.387 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 104.979 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 105.422 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 103.979 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 108.360 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 106.724 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 104.437 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 104.366 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 102.546 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 101.993 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 103.465 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 101.654 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 103.373 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 100.539 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 102.895 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 101.594 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 110.215 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 101.484 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 103.216 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 101.994 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 104.309 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 100.830 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 104.745 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 102.491 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 107.091 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 102.920 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 104.685 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 101.919 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 103.493 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 102.464 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 104.540 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 110.077 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 101.166 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 105.172 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 101.656 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 103.216 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 100.605 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 102.745 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 103.665 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 101.996 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 100.876 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 105.200 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 100.466 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 104.473 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 101.795 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 101.357 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 105.377 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 102.263 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 102.062 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 102.420 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 101.422 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 103.632 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 103.423 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 102.112 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 105.253 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 105.352 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 100.544 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 102.071 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 105.436 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 105.144 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 102.645 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 100.835 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 103.853 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 103.272 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 102.573 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 105.352 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 107.140 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 104.686 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 104.202 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 102.725 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 101.772 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 103.736 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 103.492 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 102.340 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 100.898 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 101.749 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 103.962 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 100.965 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 102.548 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 106.522 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 101.603 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 102.429 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 103.348 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 101.412 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 104.304 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 104.423 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 102.296 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 103.069 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 101.111 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 104.102 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 104.834 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 101.764 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 101.503 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 101.743 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 104.178 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 100.741 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 105.226 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 109.307 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 104.791 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 104.149 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 101.771 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 102.370 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 106.215 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 105.188 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 104.913 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 101.774 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 105.133 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 101.829 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 103.615 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 103.095 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 107.353 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 102.769 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 102.405 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 103.497 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 102.674 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 102.568 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 103.682 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 106.413 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 102.289 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 105.757 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 105.313 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 103.984 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 101.122 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 101.958 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 105.209 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 103.892 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 103.911 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 107.081 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 103.848 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 102.434 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 101.275 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 102.454 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 102.681 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 103.102 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 103.004 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 106.773 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 105.111 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 103.265 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 104.797 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 102.462 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 107.388 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 102.153 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 104.519 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 102.812 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 103.495 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 102.655 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 102.007 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 103.112 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 102.523 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 100.791 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 103.962 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 104.186 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 102.216 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 104.539 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 103.525 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 101.455 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 100 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 3/100 ON trials. Of those trials, 3 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 26, 41, 51. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 5034 | C02306AC-780F-4101-BB1B-781B92D56F95 |
| 1 | ON | 2 | 5035 | 68601D28-677B-4603-B87F-C670C4C7BC91 |
| 2 | OFF | 3 | 5036 | 7FEA5B69-CE1F-474E-BE5A-86DE4175AD96 |
| 2 | ON | 4 | 5037 | B2A31397-AB73-4C70-98D1-2D5E917A2E6F |
| 3 | OFF | 5 | 5038 | B3A9A511-6D0C-4F61-ADA1-163695719DEA |
| 3 | ON | 6 | 5040 | 267F0DE7-CD85-44D2-BCAC-340DDFD831B9 |
| 4 | OFF | 7 | 5041 | 983814E2-5FF1-4015-99FF-0942724452E8 |
| 4 | ON | 8 | 5042 | D5C2569C-A772-4A02-86F4-254E8B4BEE1C |
| 5 | OFF | 9 | 5043 | 725D461F-3DD6-425E-B02B-D6D9B81FA307 |
| 5 | ON | 10 | 5044 | 574A9613-B89D-4685-8E82-091446090E9F |
| 6 | OFF | 11 | 5045 | EFFC2F05-B33B-45D9-A06D-6BBE078AE3C7 |
| 6 | ON | 12 | 5046 | D42D90D7-FC9A-4ADD-9377-9663CCFC7329 |
| 7 | OFF | 13 | 5047 | 38F11F4B-3AC3-437E-B26F-270DEB509958 |
| 7 | ON | 14 | 5049 | 3029BDA5-6027-4D5C-98D5-87058D82D677 |
| 8 | OFF | 15 | 5050 | 5B1E0CFC-AE68-4CC0-8321-EF09101922E3 |
| 8 | ON | 16 | 5051 | E0BFF82D-07ED-4222-82C9-E9A862419581 |
| 9 | OFF | 17 | 5052 | AC10F69E-8DB8-4870-88E3-1ABD65605877 |
| 9 | ON | 18 | 5053 | 4A3CF77F-35E9-47F5-8A89-FCEFEA04795A |
| 10 | OFF | 19 | 5054 | 9A3CD1F5-6179-48A9-851F-506DFD5FBB19 |
| 10 | ON | 20 | 5055 | 679D0DBD-B78C-4211-9603-FA5618DE4F73 |
| 11 | OFF | 21 | 5056 | 31F09D27-80BC-4364-A483-C852D4C64AEE |
| 11 | ON | 22 | 5057 | F465A634-0527-406F-B801-D88B68AE7177 |
| 12 | OFF | 23 | 5059 | 343CFD4B-6D4A-4224-9960-0FB4F9FBE8A6 |
| 12 | ON | 24 | 5060 | 9CD31A95-511D-4B5A-AED9-AC36AC8F906D |
| 13 | OFF | 25 | 5061 | A32E45FF-A5C4-4C68-95F0-86BFDC8AB1E7 |
| 13 | ON | 26 | 5062 | AA0429D8-E844-43DE-9DBE-7B764807106B |
| 14 | OFF | 27 | 5063 | C54579EA-7739-4B71-BB5F-D79C14D7FFB1 |
| 14 | ON | 28 | 5064 | DB9E6C08-907E-485D-8A5A-78908A83A7F2 |
| 15 | OFF | 29 | 5065 | 7823C0B8-3BCE-4707-B17C-8EE9BC22A441 |
| 15 | ON | 30 | 5066 | 32F40AA3-2B3A-42AF-A921-D5DE702F2CA7 |
| 16 | OFF | 31 | 5068 | DA32CECA-EAAE-415C-87E2-3C9AC00FB1A6 |
| 16 | ON | 32 | 5069 | 6E50E19C-30C9-4B77-AC3F-ECDDB6CE5335 |
| 17 | OFF | 33 | 5070 | BA5C87EE-EA5F-4201-960A-B700589EB5BD |
| 17 | ON | 34 | 5071 | AC63E343-FE0E-418D-93D1-786628BB351C |
| 18 | OFF | 35 | 5072 | 999169D7-EEB8-4A98-B187-256FAAF07A42 |
| 18 | ON | 36 | 5073 | BB53A7A8-70DA-4A55-8BB4-1E7EEA8652FB |
| 19 | OFF | 37 | 5074 | 28D99F43-2905-49B7-817D-151CB430007C |
| 19 | ON | 38 | 5075 | 292CDA9A-95D4-4164-A23B-2FD26D4B9208 |
| 20 | OFF | 39 | 5076 | 36BB5FB5-4885-41C9-8650-B29865ACB22E |
| 20 | ON | 40 | 5078 | B7E8A0A7-2F2D-4FC1-9415-047DB19D4BBA |
| 21 | OFF | 41 | 5079 | 5EAD763A-C709-4D62-8DAC-089C32147456 |
| 21 | ON | 42 | 5080 | F28C8EE0-E214-4DD3-BB4C-D1997B6F2624 |
| 22 | OFF | 43 | 5081 | 976AB69F-91D5-4F15-89B3-1FA6B6FC315A |
| 22 | ON | 44 | 5082 | 3E116CAC-20F1-4169-B0CE-C243D689BFA3 |
| 23 | OFF | 45 | 5083 | C7C8EE33-5411-4B4F-A735-7FCCFB39EA5A |
| 23 | ON | 46 | 5084 | E8BC8BC1-006B-4AD3-A057-3408814EB696 |
| 24 | OFF | 47 | 5085 | B258A66C-46B8-44AB-B81C-BC9CC28F4580 |
| 24 | ON | 48 | 5087 | A6227D80-300F-4266-BF58-469B1629C1F5 |
| 25 | OFF | 49 | 5088 | 646A36D8-8E48-4971-AA6F-83C464B74CA5 |
| 25 | ON | 50 | 5089 | AD31FAAC-0524-436F-814B-8F53252FEE92 |
| 26 | OFF | 51 | 5090 | E4908F81-F6FD-4A4A-AE56-397C4933F5F3 |
| 26 | ON | 52 | 5091 | C1F218C2-14C6-45F6-A07F-D8B260B0EBFA |
| 27 | OFF | 53 | 5092 | 96CACEFF-7E74-4C9F-87F4-CCB9CF4B51E7 |
| 27 | ON | 54 | 5093 | AF7FD59A-15D2-4F31-AFF9-3D658C6165B8 |
| 28 | OFF | 55 | 5094 | 3AA1F85C-3058-4FE6-8CD5-881DEBFD2D79 |
| 28 | ON | 56 | 5096 | 4CB0B4FF-BA7E-46A8-9786-CC267EFF2209 |
| 29 | OFF | 57 | 5097 | B3F58186-DA50-41CB-B9F4-409DBC5B295C |
| 29 | ON | 58 | 5098 | A8B4848B-CDB8-4B3F-8714-5F3CDD228C01 |
| 30 | OFF | 59 | 5099 | 4E1CB593-8043-4244-817B-978D1E151C48 |
| 30 | ON | 60 | 5100 | A4F31077-BB48-4C54-8855-63E537B597D0 |
| 31 | OFF | 61 | 5101 | E9EF5877-060E-4972-A06A-C52C6B5119A1 |
| 31 | ON | 62 | 5102 | 5ED46561-32AD-4B6E-AE78-BECF430720C1 |
| 32 | OFF | 63 | 5103 | CA54B67C-3154-490B-B879-2D1C0C3A1860 |
| 32 | ON | 64 | 5105 | D10C44D4-BC2D-4EE5-8144-E078B07C6849 |
| 33 | OFF | 65 | 5106 | 7D242C35-68E7-439E-A50B-6F4D7F01DA7F |
| 33 | ON | 66 | 5107 | 373AD161-8688-4B33-B496-26F00D266814 |
| 34 | OFF | 67 | 5108 | 00AA4203-4ADA-414D-83B3-0C67F17DD51D |
| 34 | ON | 68 | 5109 | 415A1FB7-661D-413D-B326-13FF0C2241E6 |
| 35 | OFF | 69 | 5110 | 19AFD566-B09E-49D2-B954-87EB8E151101 |
| 35 | ON | 70 | 5111 | C9141F0B-F12C-4961-9BA1-F26AC7D3BB17 |
| 36 | OFF | 71 | 5112 | 9AB5CB30-02D6-4B3D-A547-DE04DCFD2C13 |
| 36 | ON | 72 | 5113 | E450F1D1-D9CF-461F-81B0-CBC3D9ED9E33 |
| 37 | OFF | 73 | 5115 | 9BD5816D-E345-4740-9A76-B71AAC62A787 |
| 37 | ON | 74 | 5116 | D56AC3A4-E713-4C49-B17C-C0E89BEE1EE0 |
| 38 | OFF | 75 | 5117 | F4ED27C8-8267-4202-BC57-4743B39121EF |
| 38 | ON | 76 | 5118 | 57EC84BB-2EA9-4487-A210-26E74C836E95 |
| 39 | OFF | 77 | 5119 | 8B6444C9-8092-4BC0-89DA-4B386A38E3F4 |
| 39 | ON | 78 | 5120 | 385E4DBE-06C5-404F-B8BD-3A058B4B483A |
| 40 | OFF | 79 | 5121 | 8F2F2BAE-A421-4066-83E8-D6AEAC9D18CE |
| 40 | ON | 80 | 5122 | 2DC1FC00-E3C2-48B4-8AF7-1C454CCF1AE8 |
| 41 | OFF | 81 | 5123 | D7AA4D12-AEF0-402D-B08B-8390E9E613B2 |
| 41 | ON | 82 | 5125 | 5586EC9E-7673-4BF7-91F7-8BCE85FE93B5 |
| 42 | OFF | 83 | 5126 | AD8BCB55-57A9-424A-8F72-BC301371A2E9 |
| 42 | ON | 84 | 5127 | 3DD28ECB-D931-49BC-AD7D-32BA33C0E726 |
| 43 | OFF | 85 | 5128 | 142FEA3B-6864-45BC-99AA-D1E2E44043B9 |
| 43 | ON | 86 | 5129 | E44C31DF-6AC9-4969-BBEB-54FE4E04AFA5 |
| 44 | OFF | 87 | 5130 | B48036CD-935B-4F68-9F28-A44D8A67E7C5 |
| 44 | ON | 88 | 5131 | DD317416-096E-44A8-ACD8-17CA26963075 |
| 45 | OFF | 89 | 5133 | FE1293D9-9C51-4056-B68E-0D820EB8AF4A |
| 45 | ON | 90 | 5134 | E6A387E6-091D-4BE8-AFAA-44E7A8C9140C |
| 46 | OFF | 91 | 5135 | 25207151-DF5F-4807-861A-8DF105BA08BA |
| 46 | ON | 92 | 5136 | 7D920344-E630-4473-A382-AE1F12A6CFC4 |
| 47 | OFF | 93 | 5137 | 6CDC1948-41D5-4D92-8B64-8C5EEEDE0E13 |
| 47 | ON | 94 | 5138 | 71521D6A-AB3D-4978-B04D-B45330CA3D98 |
| 48 | OFF | 95 | 5139 | C0545A97-A737-485A-AF28-A9399E6271E9 |
| 48 | ON | 96 | 5140 | A8560289-EA87-4222-AED0-1035E0DB2F5A |
| 49 | OFF | 97 | 5141 | BC7D298D-3D07-44DF-B874-CF50BB97DB38 |
| 49 | ON | 98 | 5143 | E204E5CA-B7AD-4B6D-89F9-5C58805D5523 |
| 50 | OFF | 99 | 5144 | 92E9A5FA-5F8C-4E4B-8E07-C5A5223194A3 |
| 50 | ON | 100 | 5145 | BBC95441-6823-48EE-B1D1-995F4BFCAA0C |
| 51 | OFF | 101 | 5146 | B67704D2-28DA-4122-B23F-E07BF0FFACC5 |
| 51 | ON | 102 | 5147 | 2ADA6AA0-1414-4E52-B455-6740ADE55FC5 |
| 52 | OFF | 103 | 5148 | 643E9AF6-2C71-4ED3-A67F-E23F67BCFD54 |
| 52 | ON | 104 | 5149 | D05E9D9E-48B5-42FA-B91A-730911E58CBF |
| 53 | OFF | 105 | 5150 | AB1C79EC-0665-4EA4-9C09-F190A97932CE |
| 53 | ON | 106 | 5152 | DEE80433-6D09-47C2-BDE7-8B7F1541EF02 |
| 54 | OFF | 107 | 5153 | 8D257DA0-D38B-47B7-A2CE-C1B4822AC885 |
| 54 | ON | 108 | 5154 | CCAB45C2-9204-4993-8AE7-5FA2A3EAC116 |
| 55 | OFF | 109 | 5155 | 9A3AC5E1-00EF-42D4-AABB-031D80EFA2E0 |
| 55 | ON | 110 | 5156 | 0917FDE7-BA8A-4D2F-AB2F-FF0D25AEC497 |
| 56 | OFF | 111 | 5157 | 462121C1-5F4F-4A12-BE91-EB5ADA374ADF |
| 56 | ON | 112 | 5158 | 53ED8DA6-5288-40C4-8209-2A45C6F13626 |
| 57 | OFF | 113 | 5159 | 854B3964-6ADA-4651-B6D0-BA9A69811255 |
| 57 | ON | 114 | 5160 | 702C0996-5765-4765-8E6A-EECA717BA149 |
| 58 | OFF | 115 | 5162 | B8FECA87-F66A-4194-843B-BCCA53A1E044 |
| 58 | ON | 116 | 5163 | 4D0713DD-A9BD-4177-9647-AFDDC7A7FBF5 |
| 59 | OFF | 117 | 5164 | AB8008DB-AD66-4309-87C2-166E7B911AD0 |
| 59 | ON | 118 | 5165 | B7137CAC-7DB4-4976-B645-9B2CD3F74FD9 |
| 60 | OFF | 119 | 5166 | BED0BC8C-D462-47B0-AAA1-6BD44655F99D |
| 60 | ON | 120 | 5167 | F719C6B1-12F8-478A-808E-F174F163EEB6 |
| 61 | OFF | 121 | 5168 | EBFEA5B0-9311-4A2E-A5A7-775F799690EB |
| 61 | ON | 122 | 5169 | C9638FE9-EABD-4F49-BCB8-57D5AFBE34A6 |
| 62 | OFF | 123 | 5171 | CAD297E9-600D-41AF-BCBE-E7D0021B4637 |
| 62 | ON | 124 | 5172 | 32D1FF22-89EB-4C31-A505-5195C15D76A6 |
| 63 | OFF | 125 | 5173 | 93EE778D-2219-4D50-8B9F-1CF9445BF7E6 |
| 63 | ON | 126 | 5175 | EE2D86E7-D932-4DAA-A52E-F080982111BE |
| 64 | OFF | 127 | 5176 | 27D9D9EC-CDDF-4BBD-94BA-529E278BC04C |
| 64 | ON | 128 | 5177 | B39EC100-982E-4C57-A88C-B335A709B428 |
| 65 | OFF | 129 | 5178 | C064AA23-4B71-430A-B825-FCB4F592B8E9 |
| 65 | ON | 130 | 5179 | E53A92D3-EA54-40EB-92DD-4A8257AB0515 |
| 66 | OFF | 131 | 5181 | 5388E9F7-D35D-4814-A49F-3DDAC9662ECB |
| 66 | ON | 132 | 5182 | 58CE58D5-91F4-432C-A5D0-D45D4CD1A17A |
| 67 | OFF | 133 | 5183 | F767045A-9CD5-4F41-835F-9B47A60B2EA0 |
| 67 | ON | 134 | 5184 | 49A8FE1D-AE64-492E-A5E3-FFE2AE4777A8 |
| 68 | OFF | 135 | 5185 | 7B3E1B8D-E55B-491F-9244-4D22CD5DA245 |
| 68 | ON | 136 | 5186 | D804D30E-EEBE-42AF-83CB-A6ECB5A4A5FA |
| 69 | OFF | 137 | 5187 | C11C8D17-3358-42C5-B1E2-5004E108FD0A |
| 69 | ON | 138 | 5188 | 33EB85A0-5BDB-4012-9AA0-DBC1A57E6E9D |
| 70 | OFF | 139 | 5189 | 991FF91A-6503-4C91-9517-98358E18B9F4 |
| 70 | ON | 140 | 5191 | 6FF2152E-A89B-4132-A707-79B9EC652A26 |
| 71 | OFF | 141 | 5192 | D0D469F8-D6AD-4C08-BE32-D38274D01E8F |
| 71 | ON | 142 | 5193 | 51C223C3-5B95-4EB1-8114-0DBFBC436A62 |
| 72 | OFF | 143 | 5195 | C6140FC8-AD99-4D7D-AA04-280BF67734F6 |
| 72 | ON | 144 | 5196 | 3B521021-CF3A-4000-9A52-3652C1A9BFC9 |
| 73 | OFF | 145 | 5197 | EB0B1450-36D5-4B91-8F3E-219F67AB9E7E |
| 73 | ON | 146 | 5198 | DA552E14-4B8B-4F5B-8FDE-109F218B1D74 |
| 74 | OFF | 147 | 5199 | 3F1494DE-210C-43F5-A928-72661B086279 |
| 74 | ON | 148 | 5201 | 976C449E-6D62-4AF3-911D-DC8813111F14 |
| 75 | OFF | 149 | 5202 | A62E5C4C-F8E8-4C21-9BC0-E89C39D01651 |
| 75 | ON | 150 | 5203 | C5DD0667-088E-4280-B701-47DA6111E588 |
| 76 | OFF | 151 | 5204 | EE9E92F9-1708-4ABF-9F83-B2C4DE69FB19 |
| 76 | ON | 152 | 5205 | 63F010F6-AA7D-42A7-9117-12E6E8054006 |
| 77 | OFF | 153 | 5206 | 6A29CFD2-7AC3-4D3C-AB20-F1FD52A53F13 |
| 77 | ON | 154 | 5207 | 972F535E-5DBB-4485-B181-E2CB6E7ADD74 |
| 78 | OFF | 155 | 5208 | 81E65993-36CA-4DCE-9092-AC737E56692D |
| 78 | ON | 156 | 5210 | A817B612-FA99-4F21-9DBE-E3B14833A01C |
| 79 | OFF | 157 | 5211 | EE248846-185B-47F0-9F2D-22C1CFD0D837 |
| 79 | ON | 158 | 5212 | 546BD931-09B4-42E6-B17C-CCD110F71050 |
| 80 | OFF | 159 | 5213 | 26EF39DA-98DC-4C30-88E1-EC8861EE2393 |
| 80 | ON | 160 | 5214 | 0320BB47-CD62-4BAD-9A5A-F259B618A94D |
| 81 | OFF | 161 | 5215 | 189F303B-68B4-448B-B4B0-6B93ECB8D116 |
| 81 | ON | 162 | 5216 | 27DD2C78-82E5-40F3-803A-2E4B51C988DA |
| 82 | OFF | 163 | 5217 | 28FC4D14-271F-480D-B0EE-AD94E01597AB |
| 82 | ON | 164 | 5218 | 1636A973-AA28-45CE-BA1D-FE414705840D |
| 83 | OFF | 165 | 5220 | D9A7B9A8-5466-49ED-9EDF-1DE1D02F7E1A |
| 83 | ON | 166 | 5221 | 526767F5-2771-4C1D-957E-6EE84E265EA2 |
| 84 | OFF | 167 | 5222 | 590962CE-6667-4D92-8C61-B45FC4083556 |
| 84 | ON | 168 | 5223 | 57AE63BF-18E7-446F-A43D-F31FD7F758AB |
| 85 | OFF | 169 | 5224 | A7DFEE57-D18D-45BE-A515-87DFB6BCB538 |
| 85 | ON | 170 | 5225 | E3B9CFE3-D472-4E79-ADA6-915AD7AFC86B |
| 86 | OFF | 171 | 5226 | C3A14631-B80C-4CD7-B8D7-ADEE2952BD55 |
| 86 | ON | 172 | 5227 | C3CBD88F-510A-4EE5-9EC7-877FD5C9069E |
| 87 | OFF | 173 | 5229 | EB77116E-473F-4BE0-B395-3283BE8FBE16 |
| 87 | ON | 174 | 5230 | 99C35872-2DC2-4EF7-B533-655986832DD7 |
| 88 | OFF | 175 | 5231 | 397FAE8B-1B18-4586-B897-3255BA64E551 |
| 88 | ON | 176 | 5232 | 365A087F-111F-48AF-BF0A-FE8C1DF746A6 |
| 89 | OFF | 177 | 5234 | 5CB3D021-5B25-4468-BC4C-FEF780C810F2 |
| 89 | ON | 178 | 5235 | 7638A678-E0F4-44EE-B534-76FFD852B2C2 |
| 90 | OFF | 179 | 5236 | 7796CEC0-7029-4056-857C-C865C8862485 |
| 90 | ON | 180 | 5237 | ADBA73D4-4A98-4601-9982-4C4274A3B24C |
| 91 | OFF | 181 | 5238 | 50035692-792B-4B95-B50A-93370E0886E6 |
| 91 | ON | 182 | 5240 | D6118B0C-605D-40B2-9DE7-69655AECF570 |
| 92 | OFF | 183 | 5241 | 332D4080-8773-4373-AC72-F088CCE13D3F |
| 92 | ON | 184 | 5242 | 6CAAA853-E46D-44B8-8793-7BCE784C82E5 |
| 93 | OFF | 185 | 5243 | A91FA31B-C000-477C-8EBF-A204B6E5F165 |
| 93 | ON | 186 | 5244 | FD6C48DC-DB7D-4F94-AEEF-3AA19F7CB9D3 |
| 94 | OFF | 187 | 5245 | A38AD9DD-42A8-46DE-8A19-7DBDEF6976AF |
| 94 | ON | 188 | 5246 | AEFA81E9-FB53-4FA8-B614-9088956B46E5 |
| 95 | OFF | 189 | 5247 | F97C4844-DC4E-4061-8E36-CD610409DFB4 |
| 95 | ON | 190 | 5249 | E3017E1F-2B3B-4A73-913F-29D8CFDCD7ED |
| 96 | OFF | 191 | 5250 | 218AB96E-6AFF-499A-8D78-D7974E0ED795 |
| 96 | ON | 192 | 5251 | 631665EC-5B20-4AC7-B677-42CF206CF884 |
| 97 | OFF | 193 | 5252 | 8AD976A4-54D3-49FD-A8EB-3067ADFB4AE1 |
| 97 | ON | 194 | 5253 | 833D095F-650F-4D66-A664-7081D3E867DF |
| 98 | OFF | 195 | 5254 | 4B997478-C87D-4006-BF8F-5AC9C937FF1E |
| 98 | ON | 196 | 5255 | C497B0FA-06AD-4B6A-8341-13C177D0A407 |
| 99 | OFF | 197 | 5256 | 817D012C-3276-4275-ADD1-4BA5BF2E6891 |
| 99 | ON | 198 | 5257 | 2BD4FDD5-A7C7-48A1-B4AA-10EAEF2559F8 |
| 100 | OFF | 199 | 5259 | E64F29F9-7264-4400-8930-E27E4B53D760 |
| 100 | ON | 200 | 5260 | F7C7EC55-9CB4-404B-9985-F79239F2CA41 |
