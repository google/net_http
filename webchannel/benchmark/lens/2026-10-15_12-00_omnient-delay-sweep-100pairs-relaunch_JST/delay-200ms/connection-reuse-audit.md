# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | not sent | handshake | h2 | false | 25.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | not sent | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | not sent | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 41.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | not sent | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | not sent | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | not sent | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | not sent | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | not sent | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | not sent | handshake | h2 | false | 23.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | not sent | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 28.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 400 | handshake | h2 | false | 59.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | not sent | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | not sent | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | not sent | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | not sent | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | not sent | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | not sent | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | not sent | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | not sent | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | not sent | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | not sent | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 201.561 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 204.758 | count=0 | post-open POST | post-open POST |
| omnient | 2 | OFF | 201.446 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 201.885 | count=0 | post-open POST | post-open POST |
| omnient | 3 | OFF | 209.862 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 208.280 | count=0 | post-open POST | post-open POST |
| omnient | 4 | OFF | 201.925 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 206.178 | count=0 | post-open POST | post-open POST |
| omnient | 5 | OFF | 207.113 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 206.118 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 203.581 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 203.211 | count=0 | post-open POST | post-open POST |
| omnient | 7 | OFF | 209.488 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 209.743 | count=0 | post-open POST | post-open POST |
| omnient | 8 | OFF | 203.950 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 203.491 | count=0 | post-open POST | post-open POST |
| omnient | 9 | OFF | 206.592 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 202.070 | count=0 | post-open POST | post-open POST |
| omnient | 10 | OFF | 206.895 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 205.449 | count=0 | post-open POST | post-open POST |
| omnient | 11 | OFF | 201.963 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 201.888 | count=0 | post-open POST | post-open POST |
| omnient | 12 | OFF | 206.860 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 201.986 | count=0 | early POST | post-open POST |
| omnient | 13 | OFF | 209.790 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 205.758 | count=0 | post-open POST | post-open POST |
| omnient | 14 | OFF | 209.211 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 202.311 | count=0 | post-open POST | post-open POST |
| omnient | 15 | OFF | 202.426 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 201.999 | count=0 | post-open POST | post-open POST |
| omnient | 16 | OFF | 204.971 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 207.901 | count=0 | post-open POST | post-open POST |
| omnient | 17 | OFF | 201.928 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 207.931 | count=0 | post-open POST | post-open POST |
| omnient | 18 | OFF | 208.250 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 204.312 | count=0 | post-open POST | post-open POST |
| omnient | 19 | OFF | 204.224 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 208.951 | count=0 | post-open POST | post-open POST |
| omnient | 20 | OFF | 205.610 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 208.005 | count=0 | post-open POST | post-open POST |
| omnient | 21 | OFF | 203.344 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 206.176 | count=0 | post-open POST | post-open POST |
| omnient | 22 | OFF | 208.890 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 208.866 | count=0 | post-open POST | post-open POST |
| omnient | 23 | OFF | 206.784 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 205.077 | count=0 | post-open POST | post-open POST |
| omnient | 24 | OFF | 210.198 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 205.518 | count=0 | post-open POST | post-open POST |
| omnient | 25 | OFF | 205.889 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 205.886 | count=0 | post-open POST | post-open POST |
| omnient | 26 | OFF | 204.449 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 201.828 | count=0 | post-open POST | post-open POST |
| omnient | 27 | OFF | 203.930 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 200.688 | count=0 | post-open POST | post-open POST |
| omnient | 28 | OFF | 204.263 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 201.203 | count=0 | post-open POST | post-open POST |
| omnient | 29 | OFF | 208.755 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 201.636 | count=0 | post-open POST | post-open POST |
| omnient | 30 | OFF | 207.535 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 209.112 | count=0 | post-open POST | post-open POST |
| omnient | 31 | OFF | 206.804 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 201.383 | count=0 | post-open POST | post-open POST |
| omnient | 32 | OFF | 201.752 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 205.918 | count=0 | post-open POST | post-open POST |
| omnient | 33 | OFF | 207.396 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 201.118 | count=0 | post-open POST | post-open POST |
| omnient | 34 | OFF | 208.366 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 207.940 | count=0 | post-open POST | post-open POST |
| omnient | 35 | OFF | 206.493 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 202.327 | count=0 | post-open POST | post-open POST |
| omnient | 36 | OFF | 200.477 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 209.880 | count=0 | post-open POST | post-open POST |
| omnient | 37 | OFF | 201.045 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 206.722 | count=0 | post-open POST | post-open POST |
| omnient | 38 | OFF | 210.544 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 201.290 | count=0 | post-open POST | post-open POST |
| omnient | 39 | OFF | 208.551 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 208.676 | count=0 | post-open POST | post-open POST |
| omnient | 40 | OFF | 208.490 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 201.057 | count=0 | post-open POST | post-open POST |
| omnient | 41 | OFF | 209.179 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 200.889 | count=0 | post-open POST | post-open POST |
| omnient | 42 | OFF | 208.237 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 200.798 | count=0 | post-open POST | post-open POST |
| omnient | 43 | OFF | 206.554 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 205.121 | count=0 | post-open POST | post-open POST |
| omnient | 44 | OFF | 206.479 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 204.780 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 206.082 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 205.770 | count=0 | post-open POST | post-open POST |
| omnient | 46 | OFF | 202.665 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 203.648 | count=0 | post-open POST | post-open POST |
| omnient | 47 | OFF | 206.158 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 206.654 | count=0 | post-open POST | post-open POST |
| omnient | 48 | OFF | 204.968 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 204.061 | count=0 | post-open POST | post-open POST |
| omnient | 49 | OFF | 206.514 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 204.801 | count=0 | post-open POST | post-open POST |
| omnient | 50 | OFF | 204.363 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 201.360 | count=0 | post-open POST | post-open POST |
| omnient | 51 | OFF | 201.009 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 202.709 | count=0 | post-open POST | post-open POST |
| omnient | 52 | OFF | 204.042 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 200.854 | count=0 | post-open POST | post-open POST |
| omnient | 53 | OFF | 205.834 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 200.694 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 205.962 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 206.650 | count=0 | post-open POST | post-open POST |
| omnient | 55 | OFF | 200.514 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 203.756 | count=0 | post-open POST | post-open POST |
| omnient | 56 | OFF | 201.329 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 208.024 | count=0 | post-open POST | post-open POST |
| omnient | 57 | OFF | 202.083 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 208.299 | count=0 | post-open POST | post-open POST |
| omnient | 58 | OFF | 205.675 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 203.476 | count=0 | post-open POST | post-open POST |
| omnient | 59 | OFF | 205.782 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 206.332 | count=0 | post-open POST | post-open POST |
| omnient | 60 | OFF | 208.424 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 206.191 | count=0 | post-open POST | post-open POST |
| omnient | 61 | OFF | 202.998 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 206.553 | count=0 | post-open POST | post-open POST |
| omnient | 62 | OFF | 206.111 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 204.857 | count=0 | post-open POST | post-open POST |
| omnient | 63 | OFF | 207.293 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 204.206 | count=0 | post-open POST | post-open POST |
| omnient | 64 | OFF | 203.961 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 206.470 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 201.822 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 206.286 | count=0 | post-open POST | post-open POST |
| omnient | 66 | OFF | 204.716 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 205.139 | count=0 | post-open POST | post-open POST |
| omnient | 67 | OFF | 205.132 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 206.950 | count=0 | post-open POST | post-open POST |
| omnient | 68 | OFF | 206.911 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 200.903 | count=0 | post-open POST | post-open POST |
| omnient | 69 | OFF | 209.991 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 204.603 | count=0 | post-open POST | post-open POST |
| omnient | 70 | OFF | 205.145 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 205.945 | count=0 | post-open POST | post-open POST |
| omnient | 71 | OFF | 201.316 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 206.979 | count=0 | post-open POST | post-open POST |
| omnient | 72 | OFF | 208.337 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 201.553 | count=0 | post-open POST | post-open POST |
| omnient | 73 | OFF | 210.033 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 210.542 | count=0 | post-open POST | post-open POST |
| omnient | 74 | OFF | 208.915 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 201.013 | count=0 | post-open POST | post-open POST |
| omnient | 75 | OFF | 208.837 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 203.039 | count=0 | post-open POST | post-open POST |
| omnient | 76 | OFF | 207.781 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 208.653 | count=0 | post-open POST | post-open POST |
| omnient | 77 | OFF | 206.576 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 200.838 | count=0 | post-open POST | post-open POST |
| omnient | 78 | OFF | 210.569 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 209.115 | count=0 | post-open POST | post-open POST |
| omnient | 79 | OFF | 206.444 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 207.003 | count=0 | post-open POST | post-open POST |
| omnient | 80 | OFF | 207.434 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 207.351 | count=0 | post-open POST | post-open POST |
| omnient | 81 | OFF | 206.563 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 208.491 | count=0 | post-open POST | post-open POST |
| omnient | 82 | OFF | 205.900 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 205.827 | count=0 | post-open POST | post-open POST |
| omnient | 83 | OFF | 203.985 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 208.466 | count=0 | post-open POST | post-open POST |
| omnient | 84 | OFF | 208.598 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 205.062 | count=0 | post-open POST | post-open POST |
| omnient | 85 | OFF | 206.469 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 208.553 | count=0 | post-open POST | post-open POST |
| omnient | 86 | OFF | 206.487 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 206.468 | count=0 | post-open POST | post-open POST |
| omnient | 87 | OFF | 208.875 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 201.806 | count=0 | early POST | post-open POST |
| omnient | 88 | OFF | 201.397 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 206.604 | count=0 | post-open POST | post-open POST |
| omnient | 89 | OFF | 208.887 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 206.479 | count=0 | post-open POST | post-open POST |
| omnient | 90 | OFF | 208.694 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 207.714 | count=0 | post-open POST | post-open POST |
| omnient | 91 | OFF | 207.656 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 204.026 | count=0 | post-open POST | post-open POST |
| omnient | 92 | OFF | 206.482 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 207.223 | count=0 | post-open POST | post-open POST |
| omnient | 93 | OFF | 206.229 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 207.187 | count=0 | post-open POST | post-open POST |
| omnient | 94 | OFF | 206.707 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 204.993 | count=0 | post-open POST | post-open POST |
| omnient | 95 | OFF | 208.420 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 208.267 | count=0 | post-open POST | post-open POST |
| omnient | 96 | OFF | 203.859 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 206.537 | count=0 | post-open POST | post-open POST |
| omnient | 97 | OFF | 208.743 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 208.055 | count=0 | post-open POST | post-open POST |
| omnient | 98 | OFF | 200.513 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 202.664 | count=0 | post-open POST | post-open POST |
| omnient | 99 | OFF | 201.455 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 202.979 | count=0 | post-open POST | post-open POST |
| omnient | 100 | OFF | 209.430 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 206.799 | count=0 | post-open POST | post-open POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 1/100 ON trials. Of those trials, 1 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 64. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 35931 | BE0615F3-DE6B-4BCD-B211-C0246D401CDF |
| 1 | ON | 2 | 35932 | 2DEF96D7-3DAF-4E54-AACE-B096F408FAD2 |
| 2 | OFF | 3 | 35934 | 5C4BC27B-AA82-4365-91BE-EBCCAD827BE9 |
| 2 | ON | 4 | 35935 | 914F9AAA-ADD3-4168-8EDB-819491467C9D |
| 3 | OFF | 5 | 35936 | 7D0EDE09-2DF4-4E69-B2F0-E2BCBD5A94A1 |
| 3 | ON | 6 | 35937 | 4013E64D-86F5-433D-BE79-6D9B3B93184E |
| 4 | OFF | 7 | 35938 | 8913D460-D76D-4AB2-A5CA-4185F8F598FA |
| 4 | ON | 8 | 35939 | A44A46E2-0946-4FB3-99DE-C1297D82E5D3 |
| 5 | OFF | 9 | 35940 | FB0FC21F-A6DB-4DE6-B10D-76E4B25B9A50 |
| 5 | ON | 10 | 35941 | 24FC298E-2430-4AA0-B17C-E26F571DB7E4 |
| 6 | OFF | 11 | 35943 | CC7BE6FC-D124-4CAB-AC0C-BF80ABB0D194 |
| 6 | ON | 12 | 35944 | 4CBE82E8-356B-49FB-A0D3-E6C2C8E4510D |
| 7 | OFF | 13 | 35945 | 344A6B79-1D7C-4D26-A238-EC15B29D0869 |
| 7 | ON | 14 | 35946 | CDB28069-E3DE-41DB-8628-547E9847CFB2 |
| 8 | OFF | 15 | 35947 | FD72EC0F-AC73-406F-9411-9997F45623D2 |
| 8 | ON | 16 | 35948 | D27C514F-CF74-4756-9E7C-1685721C7248 |
| 9 | OFF | 17 | 35949 | 24A20089-561B-466C-8A4A-A5FB0C0D4340 |
| 9 | ON | 18 | 35950 | 50EE1603-C8C4-4EDC-9A48-9A9B26B78B6D |
| 10 | OFF | 19 | 35952 | 8E67CC11-8127-4E27-AD27-1595BC6BF91E |
| 10 | ON | 20 | 35953 | 91727035-399D-41F3-8ADA-EAD9FC53B18F |
| 11 | OFF | 21 | 35954 | 40BE3E69-79CE-47A4-9743-7CEFE49723B9 |
| 11 | ON | 22 | 35955 | 71929F76-BB4A-42F2-A879-DB3EA2F213FA |
| 12 | OFF | 23 | 35956 | 9BC79B0E-38FD-4DB4-B381-EA42D48C8330 |
| 12 | ON | 24 | 35957 | BF17A6C4-E228-4CE7-AAEF-AF3A3E4E9F15 |
| 13 | OFF | 25 | 35958 | E0A62757-1C14-4C17-903E-0068B8EA4B74 |
| 13 | ON | 26 | 35959 | 9531B29E-741D-44BD-83D6-E10B76D4DB55 |
| 14 | OFF | 27 | 35961 | 7F3D06F2-2DEE-4D52-B5EE-31A2BF664E3B |
| 14 | ON | 28 | 35962 | 68160959-477E-4E48-B691-A057810D012D |
| 15 | OFF | 29 | 35963 | 47034436-A5FC-4070-80F0-1BCA7FC4F172 |
| 15 | ON | 30 | 35964 | 05FD9E5B-B73C-4151-A215-E58A5AC79597 |
| 16 | OFF | 31 | 35965 | DF3DE391-3B7B-4AC3-A81E-CD8D72B5D9D2 |
| 16 | ON | 32 | 35966 | 5A0C81C2-F588-4E3B-B26A-BB3FBC5C9F01 |
| 17 | OFF | 33 | 35967 | B51485CC-8498-4CAA-B8D4-817A6A34B1FD |
| 17 | ON | 34 | 35968 | D9978BC9-2D70-4FDC-AE6B-BDD61D3E9D7B |
| 18 | OFF | 35 | 35970 | 1BDD5B6F-E934-4E69-83C4-65ABC9778669 |
| 18 | ON | 36 | 35971 | 69C2CBDF-A1A7-4CF9-BB28-A432096A0A39 |
| 19 | OFF | 37 | 35973 | 16ECDE11-2013-48E2-ADBF-658CA3FD318E |
| 19 | ON | 38 | 35974 | F38DB6DE-C457-4E1A-B9DB-818A413B8D48 |
| 20 | OFF | 39 | 35975 | 6758CCB7-98D5-4AAA-A374-53AC0310EC82 |
| 20 | ON | 40 | 35976 | EB58A6A1-4B83-4DBD-BDE4-4BD8A5449C40 |
| 21 | OFF | 41 | 35977 | E1B5906C-CD8D-4E04-AF91-DDC0640FEF3B |
| 21 | ON | 42 | 35978 | 0B79A882-2739-4B09-B842-C38C245C949B |
| 22 | OFF | 43 | 35980 | FFEBBA23-4C92-44EF-8E50-71FBC918400B |
| 22 | ON | 44 | 35981 | E714FD27-4235-4A59-8181-097802EA4E20 |
| 23 | OFF | 45 | 35982 | 3EEA7692-E984-4798-AF8A-211B3068334C |
| 23 | ON | 46 | 35983 | 5212F81F-96FE-4CD9-8188-B74AF660719D |
| 24 | OFF | 47 | 35984 | 1637DC0D-8E52-4C91-8FCF-D25C1DFED85D |
| 24 | ON | 48 | 35985 | 413CCF92-219F-4FF7-8CBE-CEF4C2377BF2 |
| 25 | OFF | 49 | 35986 | 0B012322-A7DD-4FEA-BB3F-E995464AC895 |
| 25 | ON | 50 | 35987 | 389C4987-B560-4F6A-8089-EB9890AAF7F9 |
| 26 | OFF | 51 | 35989 | FDF1BFC4-7BF6-41CD-BB40-AC3E581B9BFD |
| 26 | ON | 52 | 35990 | A45F2364-98C5-4DE4-A817-95C2DF60C9C9 |
| 27 | OFF | 53 | 35991 | 6EC4C2B0-7DF0-471A-B72A-C8747E1384FC |
| 27 | ON | 54 | 35992 | DAB18A3D-7377-4C43-BBFC-6847846143A0 |
| 28 | OFF | 55 | 35993 | 3ACC6410-D757-4507-B2AA-FFF7423559C2 |
| 28 | ON | 56 | 35994 | DEE457B8-E7A8-430F-9B23-2B99E6D082F3 |
| 29 | OFF | 57 | 35995 | 0670E5CA-CB8A-421E-A617-F15C557D9425 |
| 29 | ON | 58 | 35996 | CE927D73-C200-46B4-80D6-C3E38E690A0A |
| 30 | OFF | 59 | 35998 | 4D108F86-BA37-448D-93CA-FF3F0D9AEFAD |
| 30 | ON | 60 | 35999 | 0F2A1C43-1F88-42AB-954C-930709F7D9C2 |
| 31 | OFF | 61 | 36000 | 24267084-5775-481F-92EE-55B650898574 |
| 31 | ON | 62 | 36001 | 583CBE15-AB9A-49AC-B654-1E4AD212ADB3 |
| 32 | OFF | 63 | 36002 | 2FDAD2F2-2A8D-40B8-8FDA-8CC5C482482A |
| 32 | ON | 64 | 36003 | FBE7B517-2A8A-47CB-948E-6A782476C662 |
| 33 | OFF | 65 | 36004 | EB119CB8-8F90-47B9-A88E-43BEFA1F1450 |
| 33 | ON | 66 | 36005 | 23483549-75FF-4BB1-9233-CA7DEDAB84D5 |
| 34 | OFF | 67 | 36007 | A0D46181-C096-4E08-AF15-4B7455E93628 |
| 34 | ON | 68 | 36008 | 74230DF5-E225-4848-9696-692C3F534671 |
| 35 | OFF | 69 | 36009 | F9FE4AE6-A136-44FE-94E5-C2DDFFD91D05 |
| 35 | ON | 70 | 36010 | 3CDEFE3F-C25A-43B9-B4B8-580B981156C0 |
| 36 | OFF | 71 | 36011 | EBEDD1DD-F666-4833-A6E9-2FF6623A477C |
| 36 | ON | 72 | 36012 | 4387694E-E6D6-4F19-B3D7-76A06CEDCA31 |
| 37 | OFF | 73 | 36013 | 00023E69-60E4-4239-917D-586D861B249A |
| 37 | ON | 74 | 36014 | AB51EDA1-D168-45BC-8DEC-95E9F7905C0C |
| 38 | OFF | 75 | 36016 | E9308488-727A-497A-9819-88300EB3E7E3 |
| 38 | ON | 76 | 36017 | AF435D12-5A31-4289-9145-FAFE72A9E2C5 |
| 39 | OFF | 77 | 36018 | 3EB3D454-B21F-4E2F-90E3-7CF2D7EC5979 |
| 39 | ON | 78 | 36019 | 24A6CAEE-009C-42F5-B4F5-B664A5BD2AB5 |
| 40 | OFF | 79 | 36020 | 1443999B-E532-4B3F-909D-94FD22DE0324 |
| 40 | ON | 80 | 36021 | 8C5413A8-7A87-4594-85A6-CA075CB7ABBB |
| 41 | OFF | 81 | 36022 | 75BF9799-DBB8-4B76-B592-F5C9DF1F9663 |
| 41 | ON | 82 | 36023 | 4E7F5AC3-2B2C-40AE-AFA0-F3CD58513833 |
| 42 | OFF | 83 | 36025 | DCA1EC2C-15D4-4740-BBF7-9B098DF26254 |
| 42 | ON | 84 | 36026 | 1793A225-357E-4E2A-93A6-9521827544A8 |
| 43 | OFF | 85 | 36027 | 3586010D-DF82-443D-BE8B-630DE2C7E133 |
| 43 | ON | 86 | 36028 | 233BBEB8-920D-4F0B-971A-04F74788600A |
| 44 | OFF | 87 | 36029 | 89DABBF0-08F3-43DD-9FF7-4505D60622EB |
| 44 | ON | 88 | 36030 | DBA0ED0C-4481-4488-A33F-0C901F288411 |
| 45 | OFF | 89 | 36031 | 5519C845-C645-4787-8B3C-3EB82602B40F |
| 45 | ON | 90 | 36032 | AF5C6D4D-DD11-4353-B6F5-1864B08F3DDD |
| 46 | OFF | 91 | 36034 | A2366504-A01A-45F7-A6B1-12924074785E |
| 46 | ON | 92 | 36035 | 633985A2-2320-4113-8366-24166D9F91A5 |
| 47 | OFF | 93 | 36036 | ADF00BBD-536D-45C8-BA24-4C0F93435154 |
| 47 | ON | 94 | 36037 | E1909650-5F14-41FD-A669-D257162AD6D8 |
| 48 | OFF | 95 | 36038 | 09F22809-90F1-4EBE-83F1-8CABDEA88749 |
| 48 | ON | 96 | 36039 | 826CD48F-46AD-49D3-90C3-5B7464334420 |
| 49 | OFF | 97 | 36040 | 6C1527B7-ACAE-4A65-B266-2FA44CA3D2CF |
| 49 | ON | 98 | 36041 | 2F937772-F481-4EE9-9021-61D1256E1274 |
| 50 | OFF | 99 | 36043 | CF104D65-1B8D-43DE-B2A6-D1A72E770386 |
| 50 | ON | 100 | 36044 | B0AD0462-7B1E-4FE5-8AF3-EC43D280A147 |
| 51 | OFF | 101 | 36045 | DB8A18CD-1DE2-4859-8EF3-1C9AF7D8B5A4 |
| 51 | ON | 102 | 36046 | D445E90D-F66B-4804-A466-22C28A8F2FB5 |
| 52 | OFF | 103 | 36047 | EF19BA43-4F71-48FC-9804-60E5B1CF2C30 |
| 52 | ON | 104 | 36048 | E6331379-CFA6-4B5A-95C9-DB70706FA5C3 |
| 53 | OFF | 105 | 36049 | CC0ABEDE-41D5-4A37-8A59-1D627F405148 |
| 53 | ON | 106 | 36050 | 5D80047C-FC8F-4C72-838E-1E2B961179B3 |
| 54 | OFF | 107 | 36052 | C4957767-2BAE-4CE3-B39D-F6246BCA8B92 |
| 54 | ON | 108 | 36053 | 47061B67-4EA7-4C75-A1DD-E00D1FAE6676 |
| 55 | OFF | 109 | 36054 | 624478F1-A00A-4684-996E-B9DE6206691C |
| 55 | ON | 110 | 36055 | 57CF8219-CD61-431D-8547-A1CD2FC63D19 |
| 56 | OFF | 111 | 36056 | 0AABAA84-48B4-4450-9BCB-8A0BA290B67A |
| 56 | ON | 112 | 36057 | 4DA2C95A-B848-421C-A31E-353D13C90781 |
| 57 | OFF | 113 | 36058 | C4786849-2FF8-4F6A-B049-C9EB9EE881AF |
| 57 | ON | 114 | 36059 | D106713E-BA59-45BF-ACC6-2DACE488D671 |
| 58 | OFF | 115 | 36061 | 3CCAF49B-C458-4E8F-B840-CF9058955BD8 |
| 58 | ON | 116 | 36062 | 778F881B-F86A-4206-851B-F791B564BBCF |
| 59 | OFF | 117 | 36063 | 2C2634E6-EB65-4755-A5FA-6D6559CF469F |
| 59 | ON | 118 | 36064 | 2D866378-787D-49E3-98BF-F9B5D557DBF3 |
| 60 | OFF | 119 | 36065 | FBBCC3D8-255D-4C1A-99C1-0725F8597991 |
| 60 | ON | 120 | 36066 | 4A7C081E-5D56-42C2-B548-234D141411DB |
| 61 | OFF | 121 | 36068 | 61635073-ACAC-4C1B-AA88-8618B3D705CA |
| 61 | ON | 122 | 36069 | 2F0FA173-FDA1-461A-BECB-9F064956A9B4 |
| 62 | OFF | 123 | 36071 | 3B34047B-E03F-46D7-8FFD-145229AE0E69 |
| 62 | ON | 124 | 36072 | 8C2D7235-F2C5-4105-BA46-AB1D490F71A4 |
| 63 | OFF | 125 | 36073 | 5DD13A34-2E96-4EA0-84D6-DCF86DEF1969 |
| 63 | ON | 126 | 36074 | CB25142B-665A-43F3-8466-AF19484FE128 |
| 64 | OFF | 127 | 36075 | FCFE3430-C1FB-4CCB-9C99-E88B91504055 |
| 64 | ON | 128 | 36076 | 295E6763-2610-486D-A08A-5A7EB64DF443 |
| 65 | OFF | 129 | 36077 | F2B7CDC9-E0D6-4A97-BD1E-BCC6A0675CC7 |
| 65 | ON | 130 | 36079 | D926528A-939E-4568-96C1-FE83D2040F54 |
| 66 | OFF | 131 | 36080 | 852B6120-99EF-49A7-9D17-C6D451B74BBE |
| 66 | ON | 132 | 36081 | 3477E877-C28A-4F89-90F4-80513556BB5F |
| 67 | OFF | 133 | 36082 | 695F54D9-C99D-42A7-BCAF-DDC4FEB8C6EA |
| 67 | ON | 134 | 36083 | 676E0B3C-427A-4C18-BF9E-B7DC11E43F8D |
| 68 | OFF | 135 | 36084 | 78EEC63E-7B77-43ED-A259-77B2DBFF1595 |
| 68 | ON | 136 | 36085 | 170FC053-2EEA-4DD1-96C8-89B35F4D8370 |
| 69 | OFF | 137 | 36086 | CACB2AFC-D282-42F4-AC2E-99C03F7B83D8 |
| 69 | ON | 138 | 36088 | 03BC7B4F-7B82-4F39-B126-1234898C1597 |
| 70 | OFF | 139 | 36089 | 1EB184B0-D203-4F29-B425-71702C332E99 |
| 70 | ON | 140 | 36090 | 29B8CF5C-08C4-4B48-BD22-921B95C5403C |
| 71 | OFF | 141 | 36091 | C4DB43DB-1ED5-4CC4-AC41-3FE90940D96B |
| 71 | ON | 142 | 36092 | 772780CA-C81D-4A7B-8C52-6544A0702152 |
| 72 | OFF | 143 | 36093 | 21E0927E-E9A6-4134-9A13-5228A55D7298 |
| 72 | ON | 144 | 36094 | 1FC59844-274D-4F47-9279-999A9117D621 |
| 73 | OFF | 145 | 36095 | 97FC8320-BF61-4291-A0AB-3BC58AB37AA4 |
| 73 | ON | 146 | 36097 | 18AA4B94-DCED-45F1-82BB-8A4B4879BE5F |
| 74 | OFF | 147 | 36098 | 7CDFE38F-E848-49BE-B648-9D9AB0063BA6 |
| 74 | ON | 148 | 36099 | E8DEDEAA-8235-475D-8B5B-A41E69165CA5 |
| 75 | OFF | 149 | 36100 | 1DF2A3DF-A0F5-4F78-91EB-FD57738EEF8D |
| 75 | ON | 150 | 36101 | 4C7988BF-AC57-4B8D-8706-D23055AD1D35 |
| 76 | OFF | 151 | 36102 | 9816AAF7-F583-4CE2-9150-ED719449AE93 |
| 76 | ON | 152 | 36103 | B691696E-F3E9-4B91-AE7D-5BBAC0CC350B |
| 77 | OFF | 153 | 36104 | 80D7F3AE-7483-4EA7-B0F0-7AFEB635C57D |
| 77 | ON | 154 | 36106 | D016BCD0-18C0-44C7-874F-7A7FCF90BE65 |
| 78 | OFF | 155 | 36107 | DB45A7FE-D64A-4A08-96E8-C862DB0C11B2 |
| 78 | ON | 156 | 36108 | 2BA310B3-CE33-4DEE-8F3E-CA82A9E784D8 |
| 79 | OFF | 157 | 36109 | 6C0FCC0E-8E57-442F-B5DA-57B578041C1C |
| 79 | ON | 158 | 36110 | 46D5E933-C18D-4062-B79E-4B746AE64029 |
| 80 | OFF | 159 | 36111 | 41DDC9D5-9E27-4D54-9BE5-7F131E85A98D |
| 80 | ON | 160 | 36112 | 19F37CDA-12F7-4FF3-9171-551234B2B718 |
| 81 | OFF | 161 | 36113 | EDFB7F6C-6337-4117-BE1D-2623AB7506F8 |
| 81 | ON | 162 | 36115 | 62437BE0-9F62-4A7D-8A13-DD75CBEF7029 |
| 82 | OFF | 163 | 36116 | 254C5013-B1F6-41C8-8C72-15F23A56DE3B |
| 82 | ON | 164 | 36117 | 08003AD3-CAFD-4E95-B6FF-6F6DDFF789CD |
| 83 | OFF | 165 | 36118 | 05A01D73-3410-416F-822E-EEA828A67394 |
| 83 | ON | 166 | 36119 | AF91C11D-21F6-46F0-AD1F-1C140FCACFCD |
| 84 | OFF | 167 | 36120 | 2092E94B-82CB-422E-866E-D69DFE6312F5 |
| 84 | ON | 168 | 36121 | 672852ED-0905-4F4D-B224-30F4CFEE3EE2 |
| 85 | OFF | 169 | 36122 | 0202318C-D404-4B58-A2D1-FC8D664CF31B |
| 85 | ON | 170 | 36124 | 4CAFEA08-D8CF-4BB8-80F2-BF75986EADA7 |
| 86 | OFF | 171 | 36125 | 93EB796D-316A-4D08-B938-7F20CEE3B968 |
| 86 | ON | 172 | 36126 | 5DD5BA50-DA98-41B3-A519-6BE6B495AC08 |
| 87 | OFF | 173 | 36127 | A768687F-2296-4A25-B6A4-B5AD85F95E7F |
| 87 | ON | 174 | 36128 | 60DAA3ED-FC10-482B-8E2A-1FEE5AC4D31C |
| 88 | OFF | 175 | 36129 | A9D88EDB-9A0C-480B-A452-3D17C9E5A68E |
| 88 | ON | 176 | 36130 | A481ABC3-5DA5-4C6A-8C7B-390FDA7E389C |
| 89 | OFF | 177 | 36131 | 57E6D6F9-A880-465F-8766-E4BA168EF001 |
| 89 | ON | 178 | 36133 | F501EF88-F27C-4723-84E8-A4BC32E4AB60 |
| 90 | OFF | 179 | 36139 | BED2BEA5-D478-4AC1-95E5-8C22A825E4D5 |
| 90 | ON | 180 | 36140 | BC400A42-2B04-4C61-B1DA-82AF6D08CCEB |
| 91 | OFF | 181 | 36142 | C459C43F-866B-4E81-BDA7-CFB4F162D5B8 |
| 91 | ON | 182 | 36143 | 9C0C30FC-7C71-41B4-A33E-2D1C1532570D |
| 92 | OFF | 183 | 36144 | BFDB4CA1-BF1D-4F83-B94A-567F8A4633A1 |
| 92 | ON | 184 | 36145 | 115F7064-A3E9-4ACB-A042-5D12210E0E22 |
| 93 | OFF | 185 | 36146 | 3AFA9C35-A918-4D9E-8DCD-814C82C6C7F7 |
| 93 | ON | 186 | 36148 | 79790BE0-F206-48C6-8249-D161C7B7EF4B |
| 94 | OFF | 187 | 36149 | AF723FCD-59AD-4B88-B6BB-01258207578C |
| 94 | ON | 188 | 36150 | 1E9C168B-4419-4DF2-B6E9-243E781C4A8C |
| 95 | OFF | 189 | 36151 | F1E8F7E2-BEC0-445B-B450-58CB2A9258B9 |
| 95 | ON | 190 | 36152 | C7408081-2959-4D0C-81E0-F12A4F53C95A |
| 96 | OFF | 191 | 36153 | D4608382-E52D-4FD2-A826-082981162B3B |
| 96 | ON | 192 | 36154 | 598D55BC-E1DA-4AEF-8A4B-52B3DB1487CC |
| 97 | OFF | 193 | 36155 | 9A132DDD-7913-4D58-B60C-0D7C5344EBA1 |
| 97 | ON | 194 | 36157 | E4BC3CE6-BEE5-47B4-A486-7DBD9AE993E7 |
| 98 | OFF | 195 | 36158 | 396709A4-A42C-4B0B-95AF-B2675417AF3B |
| 98 | ON | 196 | 36159 | F8C941CF-E4CD-450C-BA52-D13AD52D9BF0 |
| 99 | OFF | 197 | 36160 | 6C8411A0-9684-418B-8914-F9A3046F5C9C |
| 99 | ON | 198 | 36161 | 6A93994C-B63B-4EAD-A264-55F197829055 |
| 100 | OFF | 199 | 36162 | D11FC8BD-287C-4585-814C-99A9B000A99C |
| 100 | ON | 200 | 36163 | 54B22D68-CF31-4282-BA9C-1BE7473375D0 |
