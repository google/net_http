# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 29.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 33.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 63.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 57.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 52.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 53.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 72.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 34.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 39.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 59.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 61.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 38.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 186.000 | 91.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 88.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 70.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 42.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 50.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 32.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 37.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 39.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 33.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 32.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 90.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 36.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 42.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 32.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 63.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 74.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 83.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 39.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 36.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 46.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 25.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 48.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 44.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 99.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 44.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 35.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 45.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 44.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 32.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 41.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 55.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 26.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 62.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 39.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 42.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 39.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 47.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 38.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 36.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 43.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 65.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 33.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 47.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 61.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 42.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 54.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 47.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 36.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 54.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 38.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 97.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 400 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 32.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 34.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 37.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 36.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 154.690 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 155.947 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 155.881 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 150.998 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 153.514 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 156.449 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 155.749 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 155.088 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 151.106 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 154.652 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 156.516 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 155.736 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 151.228 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 156.248 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 150.616 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 153.000 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 155.079 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 155.373 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 153.497 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 150.884 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 157.253 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 150.787 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 155.649 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 154.529 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 150.937 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 155.648 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 152.127 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 154.133 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 156.642 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 154.554 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 151.200 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 156.347 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 152.402 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 151.362 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 152.061 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 150.754 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 153.181 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 154.897 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 151.744 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 156.594 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 152.170 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 153.569 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 151.648 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 156.604 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 154.633 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 153.559 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 157.623 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 153.134 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 151.398 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 156.175 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 151.592 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 152.784 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 156.867 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 151.275 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 155.876 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 152.190 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 151.589 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 154.117 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 151.042 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 156.924 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 157.277 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 154.584 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 156.510 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 155.188 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 153.227 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 153.896 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 154.218 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 155.043 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 153.172 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 151.632 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 156.050 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 151.901 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 156.156 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 151.884 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 154.930 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 156.520 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 150.900 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 154.892 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 156.761 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 156.727 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 157.348 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 153.593 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 152.894 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 153.915 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 150.932 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 156.417 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 155.819 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 153.938 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 151.369 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 156.381 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 151.282 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 151.346 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 150.576 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 155.209 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 154.808 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 151.850 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 151.101 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 156.385 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 150.572 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 150.851 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 150.996 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 150.853 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 157.674 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 157.854 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 151.607 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 155.933 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 155.985 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 152.548 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 151.577 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 155.927 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 156.254 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 155.180 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 154.225 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 155.162 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 156.786 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 153.019 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 155.219 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 150.710 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 150.410 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 152.901 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 151.313 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 156.387 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 156.692 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 152.871 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 155.776 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 157.904 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 154.568 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 152.758 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 151.690 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 150.883 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 151.672 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 156.488 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 155.944 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 151.921 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 153.732 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 150.808 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 153.814 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 152.207 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 153.032 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 155.317 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 153.540 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 152.780 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 156.772 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 156.231 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 151.984 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 151.705 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 154.663 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 155.579 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 151.708 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 156.550 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 156.027 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 155.430 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 153.550 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 154.442 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 152.051 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 154.201 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 152.540 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 154.405 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 151.733 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 155.798 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 154.914 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 154.591 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 155.617 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 155.701 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 150.779 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 154.596 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 153.404 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 153.957 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 157.863 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 154.895 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 151.974 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 151.447 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 150.405 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 153.918 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 155.543 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 150.910 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 150.562 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 152.169 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 152.865 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 151.605 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 152.831 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 153.150 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 155.677 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 156.265 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 152.887 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 154.963 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 155.538 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 153.794 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 151.049 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 155.671 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 154.511 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 156.019 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 155.362 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 151.189 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 150.966 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 152.898 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 150.538 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 150.663 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 150.984 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 153.978 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 150 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 1/100 ON trials. Of those trials, 1 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 93. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 5262 | 2A6F84CB-FE6E-4AA6-949B-30B717E9C085 |
| 1 | ON | 2 | 5263 | 135BFAC6-5DC4-4C53-B157-C03874E610C7 |
| 2 | OFF | 3 | 5264 | FCB69079-89E8-4EE1-AC41-1B734F1DE41B |
| 2 | ON | 4 | 5265 | D0CCCE68-A269-4F78-8435-D999E3BFF5C8 |
| 3 | OFF | 5 | 5266 | 9CFC68F1-70F4-4654-9058-86FCDC9A8408 |
| 3 | ON | 6 | 5267 | 6FFEAA59-AC0A-488E-836E-31328D834796 |
| 4 | OFF | 7 | 5269 | A5668529-A5B1-41C1-9DBD-CA47F2D3C957 |
| 4 | ON | 8 | 5270 | C08E0069-967C-4874-9AA8-7B559DEEAD17 |
| 5 | OFF | 9 | 5271 | CE32E202-4992-4D96-A092-FF8677DF766B |
| 5 | ON | 10 | 5272 | FF71E07A-A913-4BEB-9F38-F6BA6B87CE70 |
| 6 | OFF | 11 | 5273 | 3EC6342F-249A-409A-9BDC-1D2C18A9BFE5 |
| 6 | ON | 12 | 5274 | CDF4BE92-9BCE-4B7D-BA4E-AC5BFED67E5A |
| 7 | OFF | 13 | 5275 | C4E3481B-645A-465C-8836-4FDFF04A73F0 |
| 7 | ON | 14 | 5276 | 24DD3950-8E85-48F5-ABB0-740D237BEB17 |
| 8 | OFF | 15 | 5278 | 75B4ADED-A431-45E5-912F-51250DD5539A |
| 8 | ON | 16 | 5279 | DF0A1E38-BD89-4B4A-8281-CEAC6CFD0732 |
| 9 | OFF | 17 | 5280 | 3F38A319-9E4A-494A-8A3B-5E2B2A517B75 |
| 9 | ON | 18 | 5281 | 77E4C1CD-FC60-4B58-A897-1E6A6705F567 |
| 10 | OFF | 19 | 5282 | 5FEDE797-50F2-4F66-9044-1721D2C6A7FE |
| 10 | ON | 20 | 5283 | ABCE0AAC-3BC7-4F59-AE27-672A582C51BC |
| 11 | OFF | 21 | 5284 | 00FA444B-1649-43B6-8E72-1CC854CECA10 |
| 11 | ON | 22 | 5285 | FBF65B0C-878F-4C19-A36A-85F79FDD15BB |
| 12 | OFF | 23 | 5287 | 193BC2CF-C668-452D-807F-9AAD53DC9FC2 |
| 12 | ON | 24 | 5288 | 0D842121-EAB9-4A57-99AF-BFF32222440D |
| 13 | OFF | 25 | 5289 | 8A9DD536-804F-4E95-9BF3-E6F79EEE84A9 |
| 13 | ON | 26 | 5290 | D4E3E7B0-52A3-46CA-AF67-8836E45A6AFF |
| 14 | OFF | 27 | 5291 | ACB675E9-7A9E-4994-8F3F-48576BA166FD |
| 14 | ON | 28 | 5292 | B163EAA3-F43A-435D-A017-28419292B615 |
| 15 | OFF | 29 | 5293 | F24F8021-0260-41FD-A5E8-BBE68F433F73 |
| 15 | ON | 30 | 5294 | 6E3D7BFF-3CD3-4EE9-9875-E03087576D79 |
| 16 | OFF | 31 | 5295 | BAB5A77B-DE07-42C6-A2B4-E43FDECBDF25 |
| 16 | ON | 32 | 5297 | 1BAF9B8C-4B0F-4648-8ACB-BC2CA4740FB5 |
| 17 | OFF | 33 | 5298 | 82D683D7-1370-4371-905E-F513C76A1F97 |
| 17 | ON | 34 | 5299 | BC2198F3-45FF-44DA-B24B-BCFE70016A34 |
| 18 | OFF | 35 | 5300 | C67872FB-0720-41D6-B28B-C3371C74FD8D |
| 18 | ON | 36 | 5301 | D10DF719-3011-42B6-A1B8-660DAD0A8F2B |
| 19 | OFF | 37 | 5302 | 6B0591B5-18A2-401D-9714-FD1E4A105158 |
| 19 | ON | 38 | 5303 | 337F956B-1DF0-481F-8F66-3646527608A3 |
| 20 | OFF | 39 | 5304 | 849155DE-2999-47C7-9B8F-F81B34EA0EB0 |
| 20 | ON | 40 | 5306 | 7CFDE64B-6A22-4D5C-AA64-4D2A315B002F |
| 21 | OFF | 41 | 5307 | 6CE5824F-1B6F-41F8-9764-46B4A90B5C07 |
| 21 | ON | 42 | 5308 | AB52F766-9730-4FB0-AF1B-302804EB03E6 |
| 22 | OFF | 43 | 5309 | 102FEA7F-278F-421C-BE84-90201079DCAC |
| 22 | ON | 44 | 5310 | 519823EC-9EF7-465B-A672-FC0DDA14A3B0 |
| 23 | OFF | 45 | 5311 | 6417235D-2C8A-4F5E-A47A-E7F3AFA4907E |
| 23 | ON | 46 | 5312 | 60875B6A-5999-45A2-AD0A-02E7AA1B8646 |
| 24 | OFF | 47 | 5313 | A066CCC7-9C40-49FD-B1A6-63074274FA70 |
| 24 | ON | 48 | 5315 | 4024D0DA-4D18-48C1-B10A-5EA78BA9503B |
| 25 | OFF | 49 | 5316 | 9D9193F7-F4EE-4316-8529-1058CEEAE60B |
| 25 | ON | 50 | 5317 | 5FD6198D-915C-4DD8-8556-043A6FEC481B |
| 26 | OFF | 51 | 5318 | 1BC13EB0-C7C8-418A-8A72-8529607FB090 |
| 26 | ON | 52 | 5319 | 0A43C371-61A3-43AC-84CA-7D6635E55C3C |
| 27 | OFF | 53 | 5320 | 22A3BC45-BDAB-4AF6-BEA2-6B66ADB7B222 |
| 27 | ON | 54 | 5321 | D2E8CA18-BCB0-47F3-ACF3-DCEA2B727161 |
| 28 | OFF | 55 | 5322 | 07C94D46-B21C-43B5-8884-DE6F2A935839 |
| 28 | ON | 56 | 5324 | A9629751-F09C-4B68-B051-D4B5E528CAD9 |
| 29 | OFF | 57 | 5325 | 98BB2134-F8F3-4605-BB3C-23049ED205D3 |
| 29 | ON | 58 | 5326 | 5BB0FB4E-F507-40DE-AD62-AA9080CEF1B1 |
| 30 | OFF | 59 | 5327 | 14F32377-B347-46F0-98F0-B0F620B95AE4 |
| 30 | ON | 60 | 5328 | 91754B20-B466-458A-AC5D-4139471FCCE9 |
| 31 | OFF | 61 | 5329 | 8455C5AD-EBB9-4FC1-8A8F-BA125594ED3E |
| 31 | ON | 62 | 5330 | 4B5E6CCF-ACD4-43A1-A0D0-FF40EC618516 |
| 32 | OFF | 63 | 5331 | 04FC94DF-C97E-4606-816E-47D928B13606 |
| 32 | ON | 64 | 5333 | AD30A401-C571-41B8-BFF0-F187E51E0524 |
| 33 | OFF | 65 | 5334 | 979F465D-826C-46FE-B409-8934EAEE166E |
| 33 | ON | 66 | 5335 | 45D8A9A1-7703-4A66-8BE2-8271B7B0D6FC |
| 34 | OFF | 67 | 5336 | 54D91914-8B5B-4A9D-A1B6-537D3109D6A4 |
| 34 | ON | 68 | 5337 | C63B3799-C1B4-4CCD-887F-7C6654AACA93 |
| 35 | OFF | 69 | 5338 | 9CD39F59-8700-40AB-BD0B-753E9C2A5A55 |
| 35 | ON | 70 | 5339 | DCDB49B9-79C2-4AF7-B236-341AFAE2AC60 |
| 36 | OFF | 71 | 5340 | 8877544E-0B1F-44FF-BA36-7903CD093C80 |
| 36 | ON | 72 | 5342 | 34DC13D9-9C95-4669-8D45-E73BD337003A |
| 37 | OFF | 73 | 5343 | 1C3E0DA7-B316-4127-92D1-3703968B65DD |
| 37 | ON | 74 | 5344 | 959C1AA0-21CF-45B9-A450-13D292AE396D |
| 38 | OFF | 75 | 5345 | 68D01D1E-6BF6-4857-B80D-738761225206 |
| 38 | ON | 76 | 5346 | C455865F-17FE-4381-996E-A60618BC3584 |
| 39 | OFF | 77 | 5347 | 2CFDABB1-B185-4512-B4FC-50EA7D08CCD2 |
| 39 | ON | 78 | 5348 | 991B000C-F2F3-4F96-9868-53F1480BAAF2 |
| 40 | OFF | 79 | 5349 | 0C128F0A-6F2E-4F5D-85FC-100F56023E94 |
| 40 | ON | 80 | 5350 | 70371324-65D0-4DC9-A1FF-4BB77D1B229E |
| 41 | OFF | 81 | 5352 | 13ADA7EC-F1FA-48ED-B7C1-0AAE8D6A1467 |
| 41 | ON | 82 | 5353 | 91143E33-6B7C-4D3B-861C-9CE792D7F4F0 |
| 42 | OFF | 83 | 5354 | 7C05DEB6-05F2-4AA0-A57A-D34EA66BBEBD |
| 42 | ON | 84 | 5355 | BCCCEEF3-F6A2-42E5-BA8D-EC1118D13A8B |
| 43 | OFF | 85 | 5356 | B30848E3-8B2A-4349-995A-3C78ECEF6543 |
| 43 | ON | 86 | 5357 | CAC08E0E-FF4A-46C5-AB74-03268925F92A |
| 44 | OFF | 87 | 5358 | 16F3020A-FA2A-4E64-AD36-340E21E4A118 |
| 44 | ON | 88 | 5359 | 094696C5-D708-4FE9-A247-42A66CC6747F |
| 45 | OFF | 89 | 5361 | 03DF1AD8-564A-426B-89A0-08A4EE013566 |
| 45 | ON | 90 | 5362 | 46B8326F-43A4-4DD2-AFB0-A3B5E9E87926 |
| 46 | OFF | 91 | 5363 | 484EA529-A5DF-4FD9-9E9F-32BB8DF07153 |
| 46 | ON | 92 | 5364 | 2260F88C-B124-48E8-9FFA-F06FBD8EFFAB |
| 47 | OFF | 93 | 5365 | 7A909E73-66E8-479B-ACA4-C8A55F26334F |
| 47 | ON | 94 | 5366 | B0E47046-D414-4369-91D4-A8767C73B965 |
| 48 | OFF | 95 | 5367 | B4410292-5982-4034-ACDB-D1294F8BF939 |
| 48 | ON | 96 | 5368 | F8C2FC41-1ED4-4537-891A-81C8A87F25CA |
| 49 | OFF | 97 | 5370 | 80D09F2E-52FD-4FD7-8152-5BB2D83A18E3 |
| 49 | ON | 98 | 5371 | 26D83E97-22BD-4F6D-A044-8FEA7D0416D6 |
| 50 | OFF | 99 | 5372 | 7DED098E-F23C-4DBB-8795-D5CE8529145F |
| 50 | ON | 100 | 5373 | 5DB5725F-FE62-46B5-80AE-BFEF66CAF491 |
| 51 | OFF | 101 | 5374 | 39D57D98-51A5-484F-9A9B-3D08BB5807B9 |
| 51 | ON | 102 | 5375 | 05AF689D-7964-4FFD-AFBD-6C3E3E5E07E4 |
| 52 | OFF | 103 | 5376 | 893B2016-BE43-4411-80F7-C6D561ABABE4 |
| 52 | ON | 104 | 5377 | F8458B12-49A0-4495-9A66-4C5013FCBBDC |
| 53 | OFF | 105 | 5378 | B17D6210-A961-4BAB-9481-E0950A735771 |
| 53 | ON | 106 | 5380 | E1A194DC-EDAA-4D43-B9DD-5A7A8A188CAD |
| 54 | OFF | 107 | 5381 | EF6DD797-1C2B-4894-B2DE-0D799A80DE4A |
| 54 | ON | 108 | 5382 | 017CA0DA-38FB-4F20-9246-5FC5D5FD43BA |
| 55 | OFF | 109 | 5383 | ECC217DF-40A8-4D23-AB67-93B057F141E9 |
| 55 | ON | 110 | 5384 | FAB6E5A2-C7ED-499D-B019-01B65B165766 |
| 56 | OFF | 111 | 5385 | C630DB0C-6ED2-4860-9D7A-01125D0EB5D6 |
| 56 | ON | 112 | 5386 | 007ACB72-C87C-481B-A7EE-F2E6EE3BB0E7 |
| 57 | OFF | 113 | 5387 | 24CC5C10-84CC-45BF-B250-ACDBCDAA576A |
| 57 | ON | 114 | 5389 | 9861E654-5A09-4B74-99FF-B5A554FB42CD |
| 58 | OFF | 115 | 5390 | B76EDBC5-C253-4659-A15E-3AC4C95E1AB6 |
| 58 | ON | 116 | 5391 | 4C2DD615-40E7-485E-A87C-342D4B25464F |
| 59 | OFF | 117 | 5392 | 42112127-F640-40A9-B3F1-8565803BF762 |
| 59 | ON | 118 | 5393 | 98EE40B9-0883-46BE-A3FB-6800607C4EF1 |
| 60 | OFF | 119 | 5394 | F2D0C349-3322-4EB4-AB9D-9674A90531D4 |
| 60 | ON | 120 | 5395 | 070A6691-36E6-43FA-969B-373D64E38D42 |
| 61 | OFF | 121 | 5396 | 6FF77390-5D9A-4588-9817-DB426A0B43AB |
| 61 | ON | 122 | 5398 | A72F4421-16C3-4039-A844-D74F6B0B5658 |
| 62 | OFF | 123 | 5399 | D94B3FF9-94A1-4B85-9B97-1AEA2446ED6B |
| 62 | ON | 124 | 5400 | D0BCFC85-5C50-490C-8097-3EAE77E8D851 |
| 63 | OFF | 125 | 5401 | 0328E0B6-ABA6-4756-B940-AAD33B7C0CE2 |
| 63 | ON | 126 | 5402 | 30F865F2-42B9-41D2-A58B-17921E7768B5 |
| 64 | OFF | 127 | 5403 | 6F4ADF5F-346A-4C51-8965-D9FBA80FA2F3 |
| 64 | ON | 128 | 5404 | FA630F36-3776-4D0B-9964-1EA2B1200597 |
| 65 | OFF | 129 | 5405 | DE13027A-5119-4F1D-BD59-DAB339B8698C |
| 65 | ON | 130 | 5406 | 4C75BF4C-3483-467D-8EF9-6C1DCA2156EF |
| 66 | OFF | 131 | 5408 | E5E5FA6A-EEF2-4CC6-ACE3-21D69F830372 |
| 66 | ON | 132 | 5409 | 324C8D65-48F4-47F9-982A-F4BAB6C2933F |
| 67 | OFF | 133 | 5410 | 118244BE-1AD9-453E-82C7-FB5F7D4FAA29 |
| 67 | ON | 134 | 5411 | 12FAB4E7-4A6F-443F-ACDD-F8D9EC321779 |
| 68 | OFF | 135 | 5412 | 60CBADA4-E6D5-4199-99D4-54CF49506585 |
| 68 | ON | 136 | 5413 | F75E0828-501A-4447-B2E2-FE041D956898 |
| 69 | OFF | 137 | 5414 | 84F34128-3494-4A67-B10B-C910EBDDEABD |
| 69 | ON | 138 | 5415 | 39B19E7B-1D34-4F1F-B56B-056B1AFCC13A |
| 70 | OFF | 139 | 5417 | B83577A3-CB69-44E6-8A5F-1E9C47F7FA97 |
| 70 | ON | 140 | 5418 | 79109F6D-865E-455C-9E66-243F9627A22C |
| 71 | OFF | 141 | 5419 | CC5CFF0D-02A5-46AA-9BBB-5D2738828ACF |
| 71 | ON | 142 | 5420 | 37443D86-F202-4B33-A34E-7FE4C8D76A5F |
| 72 | OFF | 143 | 5421 | 071B723C-6B2A-4379-A886-69E8AAF331B1 |
| 72 | ON | 144 | 5422 | 8D8E6D2B-2D22-49AF-A539-0357F1156D17 |
| 73 | OFF | 145 | 5423 | F01EE5CD-D6F3-46B0-92DF-16DCB0CF4CAB |
| 73 | ON | 146 | 5424 | 4C6E5D23-CBFD-4DE7-AE68-630B24CC8612 |
| 74 | OFF | 147 | 5426 | 4D23425C-B7ED-49F4-A960-E93CC80BDD35 |
| 74 | ON | 148 | 5427 | 15EDC408-6E7D-4ED1-AB97-7C93152BC918 |
| 75 | OFF | 149 | 5428 | 57BBEDC7-CFF6-4966-ADF4-8CA18A09943B |
| 75 | ON | 150 | 5429 | 2D0C574C-FE3B-4D4D-9BC8-C479344664F9 |
| 76 | OFF | 151 | 5430 | 8E2FF624-8191-4743-BCBD-EFC6BD3AFF58 |
| 76 | ON | 152 | 5431 | 5A58446A-0A4B-480C-B25D-42FB5AE833AF |
| 77 | OFF | 153 | 5432 | F1D07A10-BE2D-4975-8B93-2DC4F9AC91F7 |
| 77 | ON | 154 | 5433 | 522EDF81-E830-41D9-B1BD-5C95AAFAF622 |
| 78 | OFF | 155 | 5434 | F3E82885-281F-4C83-B744-DE17FD284708 |
| 78 | ON | 156 | 5436 | AB8F51FB-1131-4E04-BD79-2B47F40289B4 |
| 79 | OFF | 157 | 5437 | 5C7E9A03-C03E-4D52-8374-4FEED66AAA81 |
| 79 | ON | 158 | 5438 | 28E7D2D4-CFB9-4C99-8F5E-1F15F03007A4 |
| 80 | OFF | 159 | 5439 | CFA34D57-9051-4A81-9D9D-A6790F524EA5 |
| 80 | ON | 160 | 5440 | 93F8F318-C456-44A8-AD63-4D033FD1E508 |
| 81 | OFF | 161 | 5441 | 530D95C1-20AD-4EBE-8CF9-A73CF12A0965 |
| 81 | ON | 162 | 5442 | 041E899A-6A55-429C-BE49-526C430C1771 |
| 82 | OFF | 163 | 5443 | 9A4E172A-0E6D-48F4-BC0D-8C2312D08F57 |
| 82 | ON | 164 | 5445 | 3A450B4F-B5BD-454C-9AD2-56FD86D0866F |
| 83 | OFF | 165 | 5446 | 49876181-8AC9-471A-99F0-0337279C3716 |
| 83 | ON | 166 | 5447 | F29E1147-902D-4087-8CA7-E5BDA925A3C1 |
| 84 | OFF | 167 | 5448 | 58812FFC-3D3A-4D71-8EFC-EFBCB0202F94 |
| 84 | ON | 168 | 5449 | 6115784C-BF18-4675-8405-58335A0B7F00 |
| 85 | OFF | 169 | 5450 | F69618AD-119B-4440-A8C9-5BBAAF91FC99 |
| 85 | ON | 170 | 5451 | C91FB480-9708-4B95-9555-00D5B66063BA |
| 86 | OFF | 171 | 5452 | 0926CA38-CB8C-4638-BBA0-2566AB8C123E |
| 86 | ON | 172 | 5454 | B9D5BF2B-7D68-4456-B74A-87B3DAE30E77 |
| 87 | OFF | 173 | 5455 | E5C89403-FEF1-454A-B5DD-FDFC9FCCCCEF |
| 87 | ON | 174 | 5456 | 5686A1AC-4998-48B4-9660-B6990DD69B01 |
| 88 | OFF | 175 | 5457 | 51EEBDA5-57E3-43CB-91E7-FF31B2418325 |
| 88 | ON | 176 | 5458 | 3B72F56A-C3BC-45A4-9F45-C66376821E75 |
| 89 | OFF | 177 | 5459 | 3CAB2EDD-AC83-4879-9A3B-5C1760DFFCF7 |
| 89 | ON | 178 | 5460 | 169925BE-5CB8-4FCF-A68E-6387E7AE4759 |
| 90 | OFF | 179 | 5461 | C2580D12-C7C4-46C6-A796-4B90C4723DD6 |
| 90 | ON | 180 | 5463 | 74A97EF1-8F50-4AD0-83D2-60369CF43C24 |
| 91 | OFF | 181 | 5464 | 646C962E-F992-42B5-B629-96677D20C043 |
| 91 | ON | 182 | 5465 | 888B88C4-184D-4A8A-A104-8C44A8023457 |
| 92 | OFF | 183 | 5466 | EFCA7350-AA38-416B-B328-C659472EBB56 |
| 92 | ON | 184 | 5467 | A71D7FEF-7C8E-4C5B-9621-9798C81AE961 |
| 93 | OFF | 185 | 5468 | 1093FE2B-86F3-456B-A1B7-DBFC0CD79541 |
| 93 | ON | 186 | 5469 | F4DEB200-DA1E-4FB6-9BE2-F7CC6EAF721E |
| 94 | OFF | 187 | 5470 | D522B120-8FC2-4F89-842A-96614A2D13FB |
| 94 | ON | 188 | 5471 | 096D6E48-1C2B-453F-BAA7-329E394587D8 |
| 95 | OFF | 189 | 5473 | 4F8D3C34-0E8A-401F-84B9-CB959E4635B4 |
| 95 | ON | 190 | 5474 | 61EC6B49-CB64-4327-8E3D-2735FDF4FD4C |
| 96 | OFF | 191 | 5475 | 17065316-8E93-4B7D-9C72-FA50793A0C36 |
| 96 | ON | 192 | 5476 | D4DB0503-DA55-414F-8E68-A958DF2E1E82 |
| 97 | OFF | 193 | 5477 | A48729F9-E5F5-4DD1-9EC8-E492C7F946F7 |
| 97 | ON | 194 | 5478 | 04FEA699-E46D-4179-92C7-8138D9995A35 |
| 98 | OFF | 195 | 5479 | 51C2A20D-3B3D-4A0F-B3BA-2B95E6B062CC |
| 98 | ON | 196 | 5480 | 25ED9E99-F385-415A-9498-088C50BA5374 |
| 99 | OFF | 197 | 5482 | C5F1B2DF-FE30-4C8F-97B5-35728D0931C1 |
| 99 | ON | 198 | 5483 | A5F20CE7-6EB3-4CBF-917E-DC11228C2DCF |
| 100 | OFF | 199 | 5484 | BBA333B9-7D11-4F23-97C5-0FEEEFCE2FE6 |
| 100 | ON | 200 | 5485 | 7A34AE30-9700-4CA9-B079-A15AADA6FB00 |
