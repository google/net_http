# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | not sent | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | not sent | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | not sent | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 43.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | not sent | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | not sent | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | not sent | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | not sent | handshake | h2 | false | 44.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 47.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 74.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | not sent | handshake | h2 | false | 36.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 41.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 101.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 32.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | not sent | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 55.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | not sent | handshake | h2 | false | 44.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 64.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | not sent | handshake | h2 | false | 53.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 36.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | not sent | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 38.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | not sent | handshake | h2 | false | 34.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 37.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 54.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | not sent | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | not sent | handshake | h2 | false | 37.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 311.000 | 300.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | not sent | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 55.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | not sent | handshake | h2 | false | 45.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | not sent | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 47.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 36.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | not sent | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | not sent | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | not sent | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | not sent | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | not sent | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 52.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 39.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | not sent | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | not sent | handshake | h2 | false | 55.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | not sent | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | not sent | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 301.000 | 290.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | not sent | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | not sent | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | not sent | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 57.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | not sent | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | not sent | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | not sent | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | not sent | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 34.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | not sent | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 44.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | not sent | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 35.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | not sent | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | not sent | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 400 | handshake | h2 | false | 335.000 | 319.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | not sent | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | not sent | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | not sent | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | not sent | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | not sent | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | not sent | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | not sent | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 64.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 36.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | not sent | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | not sent | handshake | h2 | false | 22.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | not sent | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | not sent | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 207.217 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 206.534 | count=0 | post-open POST | post-open POST |
| omnient | 2 | OFF | 204.003 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 208.938 | count=0 | post-open POST | post-open POST |
| omnient | 3 | OFF | 208.589 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 203.861 | count=0 | post-open POST | post-open POST |
| omnient | 4 | OFF | 208.749 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 200.825 | count=0 | post-open POST | post-open POST |
| omnient | 5 | OFF | 206.679 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 209.783 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 208.621 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 205.620 | count=0 | post-open POST | post-open POST |
| omnient | 7 | OFF | 205.922 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 208.599 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 204.325 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 208.776 | count=0 | post-open POST | post-open POST |
| omnient | 9 | OFF | 201.273 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 204.640 | count=0 | post-open POST | post-open POST |
| omnient | 10 | OFF | 200.510 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 201.192 | count=0 | post-open POST | post-open POST |
| omnient | 11 | OFF | 201.197 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 201.348 | count=0 | post-open POST | post-open POST |
| omnient | 12 | OFF | 202.617 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 208.731 | count=0 | post-open POST | post-open POST |
| omnient | 13 | OFF | 206.137 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 204.162 | count=0 | post-open POST | post-open POST |
| omnient | 14 | OFF | 200.310 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 206.382 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 205.114 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 201.077 | count=0 | post-open POST | post-open POST |
| omnient | 16 | OFF | 208.309 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 207.572 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 202.431 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 209.473 | count=0 | post-open POST | post-open POST |
| omnient | 18 | OFF | 200.778 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 204.333 | count=0 | post-open POST | post-open POST |
| omnient | 19 | OFF | 200.268 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 206.282 | count=0 | post-open POST | post-open POST |
| omnient | 20 | OFF | 204.862 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 205.700 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 208.759 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 206.242 | count=0 | post-open POST | post-open POST |
| omnient | 22 | OFF | 206.495 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 206.717 | count=0 | post-open POST | post-open POST |
| omnient | 23 | OFF | 205.282 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 210.035 | count=0 | post-open POST | post-open POST |
| omnient | 24 | OFF | 203.165 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 208.768 | count=0 | post-open POST | post-open POST |
| omnient | 25 | OFF | 203.959 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 208.836 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 202.654 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 208.654 | count=0 | post-open POST | post-open POST |
| omnient | 27 | OFF | 207.299 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 210.351 | count=0 | post-open POST | post-open POST |
| omnient | 28 | OFF | 205.487 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 207.321 | count=0 | post-open POST | post-open POST |
| omnient | 29 | OFF | 203.661 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 204.348 | count=0 | post-open POST | post-open POST |
| omnient | 30 | OFF | 202.454 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 206.783 | count=0 | post-open POST | post-open POST |
| omnient | 31 | OFF | 201.493 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 202.415 | count=0 | post-open POST | post-open POST |
| omnient | 32 | OFF | 204.147 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 202.361 | count=0 | post-open POST | post-open POST |
| omnient | 33 | OFF | 200.443 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 206.540 | count=0 | post-open POST | post-open POST |
| omnient | 34 | OFF | 204.603 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 206.683 | count=0 | post-open POST | post-open POST |
| omnient | 35 | OFF | 206.489 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 206.419 | count=0 | post-open POST | post-open POST |
| omnient | 36 | OFF | 208.697 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 207.265 | count=0 | post-open POST | post-open POST |
| omnient | 37 | OFF | 205.825 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 205.786 | count=0 | post-open POST | post-open POST |
| omnient | 38 | OFF | 203.282 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 201.406 | count=0 | post-open POST | post-open POST |
| omnient | 39 | OFF | 210.281 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 206.827 | count=0 | post-open POST | post-open POST |
| omnient | 40 | OFF | 204.091 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 205.151 | count=0 | post-open POST | post-open POST |
| omnient | 41 | OFF | 201.154 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 201.246 | count=0 | post-open POST | post-open POST |
| omnient | 42 | OFF | 206.577 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 210.315 | count=0 | post-open POST | post-open POST |
| omnient | 43 | OFF | 206.428 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 204.720 | count=0 | post-open POST | post-open POST |
| omnient | 44 | OFF | 210.008 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 205.509 | count=0 | post-open POST | post-open POST |
| omnient | 45 | OFF | 203.903 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 205.782 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 200.547 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 205.499 | count=0 | post-open POST | post-open POST |
| omnient | 47 | OFF | 207.135 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 206.305 | count=0 | post-open POST | post-open POST |
| omnient | 48 | OFF | 205.158 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 205.683 | count=0 | post-open POST | post-open POST |
| omnient | 49 | OFF | 201.453 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 205.719 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 210.013 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 206.637 | count=0 | post-open POST | post-open POST |
| omnient | 51 | OFF | 208.546 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 201.991 | count=0 | post-open POST | post-open POST |
| omnient | 52 | OFF | 206.543 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 208.559 | count=0 | post-open POST | post-open POST |
| omnient | 53 | OFF | 206.380 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 206.523 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 206.425 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 202.191 | count=0 | post-open POST | post-open POST |
| omnient | 55 | OFF | 206.630 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 201.957 | count=0 | post-open POST | post-open POST |
| omnient | 56 | OFF | 200.556 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 200.656 | count=0 | post-open POST | post-open POST |
| omnient | 57 | OFF | 205.342 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 204.466 | count=0 | post-open POST | post-open POST |
| omnient | 58 | OFF | 202.378 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 200.597 | count=0 | post-open POST | post-open POST |
| omnient | 59 | OFF | 201.715 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 206.627 | count=0 | post-open POST | post-open POST |
| omnient | 60 | OFF | 208.911 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 201.220 | count=0 | early POST | post-open POST |
| omnient | 61 | OFF | 205.773 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 203.630 | count=0 | post-open POST | post-open POST |
| omnient | 62 | OFF | 200.291 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 200.728 | count=0 | post-open POST | post-open POST |
| omnient | 63 | OFF | 207.526 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 200.774 | count=0 | post-open POST | post-open POST |
| omnient | 64 | OFF | 203.038 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 206.801 | count=0 | post-open POST | post-open POST |
| omnient | 65 | OFF | 202.379 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 201.943 | count=0 | early POST | post-open POST |
| omnient | 66 | OFF | 201.371 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 208.421 | count=0 | post-open POST | post-open POST |
| omnient | 67 | OFF | 203.097 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 208.004 | count=0 | post-open POST | post-open POST |
| omnient | 68 | OFF | 207.889 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 201.925 | count=0 | post-open POST | post-open POST |
| omnient | 69 | OFF | 202.666 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 207.433 | count=0 | post-open POST | post-open POST |
| omnient | 70 | OFF | 203.422 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 209.489 | count=0 | post-open POST | post-open POST |
| omnient | 71 | OFF | 206.634 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 209.983 | count=0 | post-open POST | post-open POST |
| omnient | 72 | OFF | 206.485 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 207.129 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 207.541 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 205.414 | count=0 | post-open POST | post-open POST |
| omnient | 74 | OFF | 204.479 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 207.685 | count=0 | post-open POST | post-open POST |
| omnient | 75 | OFF | 206.405 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 200.719 | count=0 | post-open POST | post-open POST |
| omnient | 76 | OFF | 201.614 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 209.535 | count=0 | post-open POST | post-open POST |
| omnient | 77 | OFF | 200.547 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 202.057 | count=0 | post-open POST | post-open POST |
| omnient | 78 | OFF | 208.624 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 200.593 | count=0 | post-open POST | post-open POST |
| omnient | 79 | OFF | 203.841 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 203.951 | count=0 | post-open POST | post-open POST |
| omnient | 80 | OFF | 205.477 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 206.438 | count=0 | post-open POST | post-open POST |
| omnient | 81 | OFF | 206.745 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 206.262 | count=0 | post-open POST | post-open POST |
| omnient | 82 | OFF | 205.147 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 202.886 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 206.394 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 201.937 | count=0 | post-open POST | post-open POST |
| omnient | 84 | OFF | 203.565 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 206.787 | count=0 | post-open POST | post-open POST |
| omnient | 85 | OFF | 204.252 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 208.875 | count=0 | post-open POST | post-open POST |
| omnient | 86 | OFF | 209.896 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 202.733 | count=0 | post-open POST | post-open POST |
| omnient | 87 | OFF | 207.815 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 201.681 | count=0 | post-open POST | post-open POST |
| omnient | 88 | OFF | 209.023 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 203.190 | count=0 | post-open POST | post-open POST |
| omnient | 89 | OFF | 205.889 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 205.448 | count=0 | post-open POST | post-open POST |
| omnient | 90 | OFF | 206.721 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 203.214 | count=0 | post-open POST | post-open POST |
| omnient | 91 | OFF | 208.426 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 205.635 | count=0 | post-open POST | post-open POST |
| omnient | 92 | OFF | 204.742 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 207.646 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 206.695 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 201.506 | count=0 | post-open POST | post-open POST |
| omnient | 94 | OFF | 205.651 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 203.412 | count=0 | post-open POST | post-open POST |
| omnient | 95 | OFF | 204.002 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 209.832 | count=0 | post-open POST | post-open POST |
| omnient | 96 | OFF | 201.889 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 209.112 | count=0 | post-open POST | post-open POST |
| omnient | 97 | OFF | 200.504 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 204.101 | count=0 | post-open POST | post-open POST |
| omnient | 98 | OFF | 208.982 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 202.298 | count=0 | post-open POST | post-open POST |
| omnient | 99 | OFF | 202.675 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 200.332 | count=0 | post-open POST | post-open POST |
| omnient | 100 | OFF | 200.483 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 206.689 | count=0 | post-open POST | post-open POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 1/100 ON trials. Of those trials, 1 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 82. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 5487 | 4B775B4A-3301-435E-AF2D-76E75EFC575B |
| 1 | ON | 2 | 5488 | 02B294FE-67D0-472E-8DD7-540A0F7B5DD5 |
| 2 | OFF | 3 | 5489 | 1E3DB95B-9C60-4489-A588-21A8A815449F |
| 2 | ON | 4 | 5490 | 82486FBA-761F-41CD-B2D5-56CDA9523C5B |
| 3 | OFF | 5 | 5491 | 52558573-7207-426C-9AD7-1BCC8AB28033 |
| 3 | ON | 6 | 5493 | D0A32186-CD49-4D38-8942-884D0548A2F4 |
| 4 | OFF | 7 | 5494 | 0C3C3525-DBAE-431B-BB00-D45B8095F70D |
| 4 | ON | 8 | 5495 | BCC86A87-1706-4556-BAA1-FFE4BE1C08BE |
| 5 | OFF | 9 | 5496 | 74ADF32C-6B6A-4AB1-9C0A-37EEDC475E5D |
| 5 | ON | 10 | 5497 | 8BB2E67F-3346-44DF-B733-3BB65E30092D |
| 6 | OFF | 11 | 5498 | 3FB5FF78-6EB7-4505-98CA-19F5C733E4A0 |
| 6 | ON | 12 | 5499 | 6DCE1D06-8B55-4D4D-B688-68C9CABF081C |
| 7 | OFF | 13 | 5501 | DC229CDF-3BB7-474F-B9CA-04D4EBFA32F1 |
| 7 | ON | 14 | 5502 | D2E77458-324E-4ECC-B88C-C98157317119 |
| 8 | OFF | 15 | 5503 | B1B2D3C4-8907-494C-9C43-C247756F195E |
| 8 | ON | 16 | 5504 | A8834A16-92EE-49C2-A2D9-E06F8BC59A29 |
| 9 | OFF | 17 | 5505 | A31B47F2-5A5A-41CD-BA27-4739F00E9D81 |
| 9 | ON | 18 | 5506 | F7F7BFF4-C93D-48B4-A07B-2A1FDC3A4916 |
| 10 | OFF | 19 | 5507 | 37A8F32E-0AC5-4B0C-8FBE-59D789088DF6 |
| 10 | ON | 20 | 5508 | 2C2ACC7E-37AC-4FC4-AC1B-FD5D77260E47 |
| 11 | OFF | 21 | 5510 | 8619704E-0DA3-4889-8C29-7B59407B8AFA |
| 11 | ON | 22 | 5511 | 5FA9C7FD-2EA6-4CFF-BD76-97428FABE447 |
| 12 | OFF | 23 | 5512 | 7E92C86B-4A2C-43AD-BC76-EFAA414DC80B |
| 12 | ON | 24 | 5513 | 6FD51126-0CC8-43DF-B8E2-6EEA9A86FAA3 |
| 13 | OFF | 25 | 5514 | D537D744-848F-4D81-BA99-B8D2149E7E5A |
| 13 | ON | 26 | 5515 | F4A8F618-8EE5-4627-8198-9D48BD85B452 |
| 14 | OFF | 27 | 5516 | 085CE4EA-42F5-431F-81A5-26D5F3F58062 |
| 14 | ON | 28 | 5517 | 3C9B468B-1FD5-4602-96DD-5D0DBBD4F770 |
| 15 | OFF | 29 | 5519 | 927AFB82-3DB8-482B-B84C-7303EE646885 |
| 15 | ON | 30 | 5520 | 398F66A9-BEF4-4483-9693-EDFEF7530984 |
| 16 | OFF | 31 | 5521 | 1C32FC54-8611-43E1-AB8B-663B4FE1AAB2 |
| 16 | ON | 32 | 5522 | E8D50C7C-C2AE-4D24-B058-4106FBE040CF |
| 17 | OFF | 33 | 5523 | D7747EC6-9ABD-45E5-8C1A-FF0983E33F6A |
| 17 | ON | 34 | 5524 | 2F3EFCE7-804A-4636-A214-7AC45EA0A8A7 |
| 18 | OFF | 35 | 5525 | 281AE1C7-5889-4928-8217-D8FDB7E10257 |
| 18 | ON | 36 | 5526 | 20061D08-246D-483E-88B1-2345CDB2DF79 |
| 19 | OFF | 37 | 5528 | 39C5659C-BBDB-4765-90CB-A1E9A41DFF59 |
| 19 | ON | 38 | 5529 | 8382D09C-C42B-41D6-939A-695BD5EB32DB |
| 20 | OFF | 39 | 5530 | 1C71EA13-4894-4789-AD7E-1A295FDC3EB9 |
| 20 | ON | 40 | 5531 | 0D226306-975A-4BD3-BEB1-A1C128147B61 |
| 21 | OFF | 41 | 5532 | 6E604BFC-E057-4C32-8674-700DE00BC5D5 |
| 21 | ON | 42 | 5533 | 176A2F89-2D52-475D-91B6-FE9E400E11FD |
| 22 | OFF | 43 | 5534 | 0B830439-7F8D-472B-92DC-FEBC56698A1D |
| 22 | ON | 44 | 5535 | 72A2665E-F6C4-4DEF-905F-E6C1E4D5714E |
| 23 | OFF | 45 | 5537 | DDDEDF70-6B4D-4719-B0B6-A0D7E5E62DDE |
| 23 | ON | 46 | 5538 | 251E6072-9C8D-4A97-A0ED-C7C193033674 |
| 24 | OFF | 47 | 5539 | 5EF6EF84-869D-42F9-AEA2-BDD90A1B2AA4 |
| 24 | ON | 48 | 5540 | AAF3D908-A924-420F-89B7-840E2821D07B |
| 25 | OFF | 49 | 5541 | 3518AC3C-4BC9-47C3-BE49-C7BA20ABFC13 |
| 25 | ON | 50 | 5542 | E553AB2C-F89A-47FF-BF89-90969D89DF0B |
| 26 | OFF | 51 | 5543 | 1DB5D135-A309-418B-BCF1-7EDD6EBFC252 |
| 26 | ON | 52 | 5544 | 6E2C43EE-94A6-4ADE-AE53-8E3B6BB58391 |
| 27 | OFF | 53 | 5546 | 3690593A-4579-4964-AA6A-34DC64A55AF8 |
| 27 | ON | 54 | 5547 | 925E31EC-B09D-4159-A967-36BED3FEC9F4 |
| 28 | OFF | 55 | 5548 | D2296603-B561-491D-AD9B-645773995CC6 |
| 28 | ON | 56 | 5549 | B769B075-0B45-4D1E-A210-12F21B08D55A |
| 29 | OFF | 57 | 5550 | 47866352-2F5C-4988-9908-2413AC295C60 |
| 29 | ON | 58 | 5551 | 7E7EEC07-C5F6-4416-B377-28B9C0282A5A |
| 30 | OFF | 59 | 5552 | 4A03C82A-DA58-424D-9B5E-3AEA8D940747 |
| 30 | ON | 60 | 5553 | E2D8AE45-6E5D-4C05-8816-51A5B42979DA |
| 31 | OFF | 61 | 5555 | C5DA0ED4-56F5-4C35-A883-066FE1C11AEC |
| 31 | ON | 62 | 5556 | 19408786-7C75-42CF-AF05-AE7E16D6C63B |
| 32 | OFF | 63 | 5557 | 9730E058-BD70-4501-BFA9-EF63A4921134 |
| 32 | ON | 64 | 5558 | DE9C994F-B3D5-4AE4-B19B-9681C5F0D4D4 |
| 33 | OFF | 65 | 5559 | 3367056E-5F1A-4B27-9995-19CB9AFC1DCF |
| 33 | ON | 66 | 5560 | CF114C32-B10C-4F30-A4E0-B206BB8FA56C |
| 34 | OFF | 67 | 5561 | 32E745E6-47C4-4CAE-B8C1-BE7C84EA5863 |
| 34 | ON | 68 | 5562 | 37186D00-A877-4DAD-A8A9-A8C23D635F0C |
| 35 | OFF | 69 | 5564 | E8C3360D-7B06-46A0-9372-AD23C6A4C6B1 |
| 35 | ON | 70 | 5565 | E9A09C47-BA1F-493C-B2EF-C39B3884FF5C |
| 36 | OFF | 71 | 5566 | 750DE1D9-26B7-42B1-BF05-9586D312E813 |
| 36 | ON | 72 | 5567 | 0057D6AF-FAF2-444A-914A-F4C3E9C8A408 |
| 37 | OFF | 73 | 5568 | 8B152EBB-18EC-46B9-9216-6D3AC04A6AD3 |
| 37 | ON | 74 | 5569 | EB5F4651-EEBA-48DF-97BD-4D3351DFDEC3 |
| 38 | OFF | 75 | 5570 | 6B5FEB84-7CCE-4FBA-8C54-8C1666B0A720 |
| 38 | ON | 76 | 5571 | C158CAF3-3F78-456A-9159-72A7D4E906C0 |
| 39 | OFF | 77 | 5573 | 9E6543F1-FBB4-4B9A-B5C1-58A5B2A1AE2D |
| 39 | ON | 78 | 5574 | 0A5A30D7-D3D1-4010-9F3F-8D7FAC940518 |
| 40 | OFF | 79 | 5575 | 9C9BFAFC-DA4B-4BA7-AD50-7276FE8F15BF |
| 40 | ON | 80 | 5576 | B5BEB065-20C0-4DE0-AA0E-80D075494B5E |
| 41 | OFF | 81 | 5577 | 49D46F22-85D3-412E-8B4A-BC4BEEF98F28 |
| 41 | ON | 82 | 5578 | B8E3FDE6-B89D-4BAF-AB36-182109B5E9D7 |
| 42 | OFF | 83 | 5579 | 80EF3187-DDE4-4227-9589-25698AFF13B6 |
| 42 | ON | 84 | 5580 | E0AD76BA-BA21-466A-A478-452DF38F74DE |
| 43 | OFF | 85 | 5582 | 97AF2599-1A33-41C7-BEE3-A75556A1F226 |
| 43 | ON | 86 | 5583 | C444FCCD-084B-43D7-AAAE-6563EF9A809F |
| 44 | OFF | 87 | 5584 | F9C538E6-CCB9-448B-B631-D9B5C46B3830 |
| 44 | ON | 88 | 5585 | 852DA73A-508E-46A8-BE1C-26B23E43015E |
| 45 | OFF | 89 | 5586 | 94932373-E7BB-45BB-B7E3-6881D5C842C1 |
| 45 | ON | 90 | 5587 | D49C656B-5C14-4015-B726-873CA113D6D9 |
| 46 | OFF | 91 | 5588 | 612B9EF8-258C-453E-AFF1-1D1DC126E703 |
| 46 | ON | 92 | 5589 | 7607122C-AE2A-4616-A8A2-7B756984B241 |
| 47 | OFF | 93 | 5591 | 9CBDE688-971E-4876-AC9E-07E671758AD3 |
| 47 | ON | 94 | 5592 | 3D56F5C2-E872-4F75-8D5A-841DFACB05FD |
| 48 | OFF | 95 | 5593 | E5E277DF-FDF9-4DFB-89C1-C14355F2E9CD |
| 48 | ON | 96 | 5594 | D008BB09-E9C3-4EB4-8FB2-57C4BEC06B2F |
| 49 | OFF | 97 | 5595 | FEA0958D-59D7-4E08-96FE-FE8937B70E77 |
| 49 | ON | 98 | 5596 | DCED3CFC-6AA6-40A6-9B9C-A5E060D17F6D |
| 50 | OFF | 99 | 5597 | 764DEBE0-99FE-48E3-9968-1AFE4A6666D1 |
| 50 | ON | 100 | 5598 | 1E1C5060-E230-4398-A4C2-A0678AE13499 |
| 51 | OFF | 101 | 5600 | 3E95FEA0-063A-42BD-ABE9-044658368441 |
| 51 | ON | 102 | 5601 | 3961E03D-8DEE-4F33-B5CF-7DFD4E19F719 |
| 52 | OFF | 103 | 5602 | 3DFA8482-7FA0-4189-9002-2951D9637B75 |
| 52 | ON | 104 | 5603 | 5D102752-7F16-4554-9F7D-64359C837995 |
| 53 | OFF | 105 | 5604 | 5FE075BB-5D1D-4F89-A55F-F6D45AFB35B4 |
| 53 | ON | 106 | 5605 | EECD9CB4-D1D9-4266-BA8A-A37D53A5688A |
| 54 | OFF | 107 | 5606 | B1B6D9D5-D4F2-498C-B603-563E00E7E3F7 |
| 54 | ON | 108 | 5607 | 10F07132-8555-48FA-AE7A-631B71A8ACF6 |
| 55 | OFF | 109 | 5609 | B00527F7-EDBF-4C28-B525-1BEC214E6F00 |
| 55 | ON | 110 | 5610 | 4FF11519-DF72-4166-84A7-78944B3BF3F3 |
| 56 | OFF | 111 | 5611 | 12E0C04D-C1DF-4AFB-92F5-7E270B67C945 |
| 56 | ON | 112 | 5612 | 45996538-016B-4D33-B0D9-FC51BDEDDF2F |
| 57 | OFF | 113 | 5613 | CDD9A3DF-8831-4983-8C2F-D8FBA29DEAD3 |
| 57 | ON | 114 | 5614 | 3BF8267F-7AC6-43DB-8CC6-1FDA83CB4374 |
| 58 | OFF | 115 | 5615 | 531331EF-49AB-4990-BDBC-E7244B9B750A |
| 58 | ON | 116 | 5616 | 15E6AE66-BE78-4C94-9813-8DDD6761DF91 |
| 59 | OFF | 117 | 5618 | 63AEE93D-8FE9-4D9A-BA25-31B77C64B26A |
| 59 | ON | 118 | 5619 | 84873906-3A15-4458-981D-0220804719D7 |
| 60 | OFF | 119 | 5620 | CE2DFA20-9FBA-46E3-B1DA-5D22E49D01D7 |
| 60 | ON | 120 | 5621 | 5EAE3CD8-DA65-4E79-B59A-E79ACB3DD32F |
| 61 | OFF | 121 | 5622 | 032678B9-F596-48F9-85A6-760B916D27A3 |
| 61 | ON | 122 | 5623 | 7156B145-2EEF-45FA-B8B1-A9E9A8565863 |
| 62 | OFF | 123 | 5624 | A7256F65-B25F-4537-95A9-1387931696BA |
| 62 | ON | 124 | 5625 | 5A688A63-EE5C-40D0-B524-80012EA5811A |
| 63 | OFF | 125 | 5627 | 25A72F19-CB24-4B06-9B4A-B2D55446F7DD |
| 63 | ON | 126 | 5628 | 5641270B-B27C-4A68-B9FD-A4AE0FD7BFB1 |
| 64 | OFF | 127 | 5629 | B409347F-CEC1-4FFD-AA64-B6A2167BE17B |
| 64 | ON | 128 | 5630 | 0A778930-7D1A-4E07-97DB-0B2B9DB47748 |
| 65 | OFF | 129 | 5631 | 984BFD80-2413-4B1A-829F-86C5FB26A8DF |
| 65 | ON | 130 | 5632 | 60E11DCC-1B7A-462A-9D23-A5C074C1A40E |
| 66 | OFF | 131 | 5633 | A18F8C2F-850C-44BD-85AC-CEE1C2BA740D |
| 66 | ON | 132 | 5634 | 6B911B68-23BD-44F2-B13B-A80077BF5AE2 |
| 67 | OFF | 133 | 5636 | BBEB69A1-A814-4E29-86AD-61DE2067C182 |
| 67 | ON | 134 | 5637 | 1EC67C77-D80B-40DE-B7F9-BE368BC0CBA4 |
| 68 | OFF | 135 | 5638 | 6997FBA4-BC42-46D5-B025-225A116BB608 |
| 68 | ON | 136 | 5639 | 38868D29-F247-4B2D-90E6-56803CA50AF8 |
| 69 | OFF | 137 | 5640 | FEFE6477-5BDD-42AD-B7A3-01600AB35CCF |
| 69 | ON | 138 | 5641 | B2EE9E02-B755-47B0-AA65-32D4034CA995 |
| 70 | OFF | 139 | 5642 | 835547AC-BD78-42B4-A597-1276A8120FAE |
| 70 | ON | 140 | 5643 | EE4021FE-0393-48B1-B426-B531853E4FAF |
| 71 | OFF | 141 | 5645 | E9E07E1D-A890-4887-AAE3-3B85514F5404 |
| 71 | ON | 142 | 5646 | 86D07A7E-05B8-4D6C-8217-182BD8E9ADCC |
| 72 | OFF | 143 | 5647 | 65916697-2A10-4E83-8AC2-4B4C1E814E73 |
| 72 | ON | 144 | 5648 | 1DC2AA8E-2685-4234-A02D-F99D0B651143 |
| 73 | OFF | 145 | 5649 | 1A76F64B-901F-4275-8296-C2AC7D08CEC0 |
| 73 | ON | 146 | 5650 | 38E03193-2554-41D8-9F70-640E518E682B |
| 74 | OFF | 147 | 5651 | E2F00B24-F93A-4EF2-A72B-AFC4859927DB |
| 74 | ON | 148 | 5653 | 33F0EF9B-DA17-4122-8047-7B2D773763FA |
| 75 | OFF | 149 | 5654 | 11D0B6D6-08D7-4459-8F3B-E01006C90316 |
| 75 | ON | 150 | 5655 | E003AB3E-9636-403B-B64A-E1689D98DAFB |
| 76 | OFF | 151 | 5656 | C1BAE244-A0A2-4AE2-A1FC-6D05B52D472E |
| 76 | ON | 152 | 5657 | 85D02174-0332-4F31-9512-3B0FE01AA29F |
| 77 | OFF | 153 | 5658 | 5DB6EF70-2F05-42F1-841F-A51CA44778BD |
| 77 | ON | 154 | 5659 | CDD54218-B67B-449D-AF58-9FAFE19BA75A |
| 78 | OFF | 155 | 5660 | 3FAC6248-52F9-41B6-8288-A455E61FC546 |
| 78 | ON | 156 | 5661 | C7405D38-2177-4868-8F92-D3FAF8593B2A |
| 79 | OFF | 157 | 5663 | 3678AE39-15D4-4291-85EB-862BEE6F12EB |
| 79 | ON | 158 | 5664 | 47A23B33-0837-465A-9A6F-0B4440F9C378 |
| 80 | OFF | 159 | 5665 | 962119B8-D3B9-47E3-B309-C17CE3BADEBA |
| 80 | ON | 160 | 5666 | 1A445F5D-5CF8-45B4-93C5-60840357E01D |
| 81 | OFF | 161 | 5667 | E2179249-9E7B-4F9E-A052-2AE595E998DF |
| 81 | ON | 162 | 5668 | EBBE38D0-3B70-4265-A657-290C0854413F |
| 82 | OFF | 163 | 5669 | D6768255-2449-4219-A761-21317E89B2DA |
| 82 | ON | 164 | 5671 | DEF0A08D-378F-4F3E-BB5C-6CA4DDAC3646 |
| 83 | OFF | 165 | 5672 | 6734F685-6E59-4D86-BBEF-D968D0E0F9BC |
| 83 | ON | 166 | 5673 | 0E079D7C-782D-4C80-A105-21E4D560527E |
| 84 | OFF | 167 | 5674 | 3EA78D29-BC68-4AAB-AE1F-774C0D52BA93 |
| 84 | ON | 168 | 5675 | 15E68657-DBA9-442D-8B4D-0D831B87E533 |
| 85 | OFF | 169 | 5676 | F6406618-2BF5-4F91-BEF1-3EF4F9C1FFE2 |
| 85 | ON | 170 | 5677 | CCEBF803-6434-47EE-B154-2332EE6602C3 |
| 86 | OFF | 171 | 5678 | DBB763EB-CC35-427D-93C3-E00BCB6F4E9B |
| 86 | ON | 172 | 5680 | F89CEB04-6D56-4777-8D00-41FEE107345D |
| 87 | OFF | 173 | 5681 | 3C9F7E43-81B6-40CC-87B7-86C7BD1DB266 |
| 87 | ON | 174 | 5682 | 2BA13270-8700-440A-BDF2-880AB8257C57 |
| 88 | OFF | 175 | 5683 | 41A1D29B-23AC-4010-9365-72F87AC98D3F |
| 88 | ON | 176 | 5684 | 1AAC04FC-96B3-4DF4-BD3C-D54C9054B30E |
| 89 | OFF | 177 | 5685 | 7F9CF619-4979-4F14-9BFD-8052B5563B82 |
| 89 | ON | 178 | 5686 | 56CBE706-00C2-483F-9CD9-1271708E279A |
| 90 | OFF | 179 | 5687 | FCC2C5F6-A222-449D-8DDD-6EBF1916A5B8 |
| 90 | ON | 180 | 5689 | 70857D2B-0576-4919-A499-E32421BFFED1 |
| 91 | OFF | 181 | 5690 | 27916EB4-4A33-4D9A-8C60-667C0C46D28C |
| 91 | ON | 182 | 5691 | AF73453D-792A-44A7-B362-D89D541FB28F |
| 92 | OFF | 183 | 5692 | 97BFF252-8714-40D6-91A8-FBB8C0C24073 |
| 92 | ON | 184 | 5693 | ED74F783-B630-470A-96F9-D258467C8157 |
| 93 | OFF | 185 | 5694 | 401D7B67-ABC2-46B2-847F-3EA924E9FBD0 |
| 93 | ON | 186 | 5695 | 932E8EFE-CA45-486E-91EB-568B1F9699FF |
| 94 | OFF | 187 | 5696 | B33C46CF-7C63-40B0-90EC-581975E08652 |
| 94 | ON | 188 | 5698 | 1351DDB8-B231-4B92-9C97-9FCA09179D3D |
| 95 | OFF | 189 | 5699 | 376C6BF5-277D-4129-8CCC-C957872E9B20 |
| 95 | ON | 190 | 5700 | 37BC24AF-ABFF-4D15-BF81-9F216CD5A5B0 |
| 96 | OFF | 191 | 5701 | 37E16F7F-A081-4CD5-B19E-9E36B590883D |
| 96 | ON | 192 | 5702 | 0ABA16FE-984C-4215-8571-41283E20228E |
| 97 | OFF | 193 | 5703 | 61F21144-CD3C-488D-A831-DFB897F79183 |
| 97 | ON | 194 | 5704 | 2776A931-F39A-4267-A576-A3F02176B7E8 |
| 98 | OFF | 195 | 5705 | B4E70D0E-F8E4-47FC-9AA9-39246B1EC311 |
| 98 | ON | 196 | 5707 | 392817B3-2D5D-4EC3-BD21-F9717BE5BAC2 |
| 99 | OFF | 197 | 5708 | 8329218A-7B19-4A9C-84AE-6717FF3C9423 |
| 99 | ON | 198 | 5709 | 4F41EC1D-F7DA-457F-9CC0-68246AE1FC7E |
| 100 | OFF | 199 | 5710 | 01D16D0A-F8CA-44D3-9524-842CA0627947 |
| 100 | ON | 200 | 5711 | 987A007F-237E-4423-953E-0E64CC8D0EE3 |
