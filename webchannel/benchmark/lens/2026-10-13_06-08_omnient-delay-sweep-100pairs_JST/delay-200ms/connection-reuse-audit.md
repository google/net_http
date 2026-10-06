# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | not sent | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | not sent | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 68.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | not sent | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | not sent | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | not sent | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | not sent | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | not sent | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | not sent | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | not sent | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | not sent | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 203.644 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 201.347 | count=0 | post-open POST | post-open POST |
| omnient | 2 | OFF | 206.507 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 207.894 | count=0 | post-open POST | post-open POST |
| omnient | 3 | OFF | 206.810 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 206.125 | count=0 | post-open POST | post-open POST |
| omnient | 4 | OFF | 200.784 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 200.733 | count=0 | post-open POST | post-open POST |
| omnient | 5 | OFF | 202.318 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 206.313 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 208.257 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 207.658 | count=0 | post-open POST | post-open POST |
| omnient | 7 | OFF | 207.440 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 206.861 | count=0 | post-open POST | post-open POST |
| omnient | 8 | OFF | 205.056 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 206.935 | count=0 | post-open POST | post-open POST |
| omnient | 9 | OFF | 206.079 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 209.236 | count=0 | post-open POST | post-open POST |
| omnient | 10 | OFF | 208.717 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 206.236 | count=0 | post-open POST | post-open POST |
| omnient | 11 | OFF | 207.414 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 207.058 | count=0 | post-open POST | post-open POST |
| omnient | 12 | OFF | 207.300 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 201.144 | count=0 | post-open POST | post-open POST |
| omnient | 13 | OFF | 207.570 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 203.543 | count=0 | post-open POST | post-open POST |
| omnient | 14 | OFF | 207.898 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 205.169 | count=0 | post-open POST | post-open POST |
| omnient | 15 | OFF | 202.209 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 207.612 | count=0 | post-open POST | post-open POST |
| omnient | 16 | OFF | 208.473 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 201.421 | count=0 | post-open POST | post-open POST |
| omnient | 17 | OFF | 205.999 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 203.256 | count=0 | post-open POST | post-open POST |
| omnient | 18 | OFF | 205.183 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 206.081 | count=0 | post-open POST | post-open POST |
| omnient | 19 | OFF | 208.886 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 207.252 | count=0 | post-open POST | post-open POST |
| omnient | 20 | OFF | 200.788 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 200.922 | count=0 | post-open POST | post-open POST |
| omnient | 21 | OFF | 205.341 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 208.856 | count=0 | post-open POST | post-open POST |
| omnient | 22 | OFF | 200.535 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 207.025 | count=0 | post-open POST | post-open POST |
| omnient | 23 | OFF | 206.072 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 207.490 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 201.917 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 203.736 | count=0 | post-open POST | post-open POST |
| omnient | 25 | OFF | 207.907 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 203.381 | count=0 | post-open POST | post-open POST |
| omnient | 26 | OFF | 202.284 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 208.878 | count=0 | post-open POST | post-open POST |
| omnient | 27 | OFF | 208.656 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 205.897 | count=0 | post-open POST | post-open POST |
| omnient | 28 | OFF | 206.894 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 208.976 | count=0 | post-open POST | post-open POST |
| omnient | 29 | OFF | 208.419 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 208.863 | count=0 | post-open POST | post-open POST |
| omnient | 30 | OFF | 202.761 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 200.549 | count=0 | post-open POST | post-open POST |
| omnient | 31 | OFF | 204.275 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 202.124 | count=0 | post-open POST | post-open POST |
| omnient | 32 | OFF | 207.769 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 205.005 | count=0 | post-open POST | post-open POST |
| omnient | 33 | OFF | 210.517 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 202.863 | count=0 | post-open POST | post-open POST |
| omnient | 34 | OFF | 202.672 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 208.458 | count=0 | post-open POST | post-open POST |
| omnient | 35 | OFF | 203.276 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 207.141 | count=0 | post-open POST | post-open POST |
| omnient | 36 | OFF | 206.742 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 206.761 | count=0 | post-open POST | post-open POST |
| omnient | 37 | OFF | 206.393 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 205.167 | count=0 | post-open POST | post-open POST |
| omnient | 38 | OFF | 206.719 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 209.378 | count=0 | post-open POST | post-open POST |
| omnient | 39 | OFF | 200.887 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 209.324 | count=0 | post-open POST | post-open POST |
| omnient | 40 | OFF | 208.782 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 208.580 | count=0 | post-open POST | post-open POST |
| omnient | 41 | OFF | 206.031 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 206.730 | count=0 | post-open POST | post-open POST |
| omnient | 42 | OFF | 205.875 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 206.528 | count=0 | post-open POST | post-open POST |
| omnient | 43 | OFF | 208.477 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 208.269 | count=0 | post-open POST | post-open POST |
| omnient | 44 | OFF | 204.873 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 208.416 | count=0 | post-open POST | post-open POST |
| omnient | 45 | OFF | 208.435 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 207.649 | count=0 | post-open POST | post-open POST |
| omnient | 46 | OFF | 204.855 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 203.454 | count=0 | post-open POST | post-open POST |
| omnient | 47 | OFF | 207.926 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 203.002 | count=0 | post-open POST | post-open POST |
| omnient | 48 | OFF | 205.804 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 208.666 | count=0 | post-open POST | post-open POST |
| omnient | 49 | OFF | 207.003 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 204.636 | count=0 | post-open POST | post-open POST |
| omnient | 50 | OFF | 205.845 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 206.918 | count=0 | post-open POST | post-open POST |
| omnient | 51 | OFF | 208.118 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 206.383 | count=0 | post-open POST | post-open POST |
| omnient | 52 | OFF | 204.468 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 208.277 | count=0 | post-open POST | post-open POST |
| omnient | 53 | OFF | 205.095 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 206.394 | count=0 | post-open POST | post-open POST |
| omnient | 54 | OFF | 201.931 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 203.008 | count=0 | post-open POST | post-open POST |
| omnient | 55 | OFF | 202.324 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 208.922 | count=0 | post-open POST | post-open POST |
| omnient | 56 | OFF | 202.272 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 207.501 | count=0 | post-open POST | post-open POST |
| omnient | 57 | OFF | 208.402 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 207.158 | count=0 | post-open POST | post-open POST |
| omnient | 58 | OFF | 206.002 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 201.934 | count=0 | post-open POST | post-open POST |
| omnient | 59 | OFF | 205.546 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 208.326 | count=0 | post-open POST | post-open POST |
| omnient | 60 | OFF | 209.018 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 207.178 | count=0 | post-open POST | post-open POST |
| omnient | 61 | OFF | 207.037 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 205.351 | count=0 | post-open POST | post-open POST |
| omnient | 62 | OFF | 204.486 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 202.302 | count=0 | post-open POST | post-open POST |
| omnient | 63 | OFF | 207.542 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 208.421 | count=0 | post-open POST | post-open POST |
| omnient | 64 | OFF | 206.892 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 205.145 | count=0 | post-open POST | post-open POST |
| omnient | 65 | OFF | 207.456 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 202.187 | count=0 | post-open POST | post-open POST |
| omnient | 66 | OFF | 203.878 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 206.986 | count=0 | post-open POST | post-open POST |
| omnient | 67 | OFF | 206.793 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 208.415 | count=0 | post-open POST | post-open POST |
| omnient | 68 | OFF | 207.228 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 202.683 | count=0 | post-open POST | post-open POST |
| omnient | 69 | OFF | 203.282 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 203.522 | count=0 | post-open POST | post-open POST |
| omnient | 70 | OFF | 206.314 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 207.350 | count=0 | post-open POST | post-open POST |
| omnient | 71 | OFF | 207.488 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 208.191 | count=0 | post-open POST | post-open POST |
| omnient | 72 | OFF | 206.659 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 206.924 | count=0 | post-open POST | post-open POST |
| omnient | 73 | OFF | 205.628 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 204.113 | count=0 | post-open POST | post-open POST |
| omnient | 74 | OFF | 205.800 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 205.355 | count=0 | post-open POST | post-open POST |
| omnient | 75 | OFF | 207.465 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 205.256 | count=0 | post-open POST | post-open POST |
| omnient | 76 | OFF | 202.618 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 202.069 | count=0 | post-open POST | post-open POST |
| omnient | 77 | OFF | 202.279 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 208.475 | count=0 | post-open POST | post-open POST |
| omnient | 78 | OFF | 207.451 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 208.621 | count=0 | post-open POST | post-open POST |
| omnient | 79 | OFF | 205.246 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 205.640 | count=0 | post-open POST | post-open POST |
| omnient | 80 | OFF | 206.550 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 206.669 | count=0 | post-open POST | post-open POST |
| omnient | 81 | OFF | 206.330 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 204.856 | count=0 | post-open POST | post-open POST |
| omnient | 82 | OFF | 202.211 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 206.493 | count=0 | post-open POST | post-open POST |
| omnient | 83 | OFF | 202.665 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 206.107 | count=0 | post-open POST | post-open POST |
| omnient | 84 | OFF | 200.975 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 209.407 | count=0 | post-open POST | post-open POST |
| omnient | 85 | OFF | 207.331 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 203.242 | count=0 | post-open POST | post-open POST |
| omnient | 86 | OFF | 207.644 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 202.084 | count=0 | post-open POST | post-open POST |
| omnient | 87 | OFF | 200.461 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 208.138 | count=0 | post-open POST | post-open POST |
| omnient | 88 | OFF | 207.066 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 202.398 | count=0 | post-open POST | post-open POST |
| omnient | 89 | OFF | 207.679 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 205.452 | count=0 | post-open POST | post-open POST |
| omnient | 90 | OFF | 206.166 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 203.572 | count=0 | post-open POST | post-open POST |
| omnient | 91 | OFF | 208.751 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 206.525 | count=0 | post-open POST | post-open POST |
| omnient | 92 | OFF | 203.178 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 203.007 | count=0 | post-open POST | post-open POST |
| omnient | 93 | OFF | 204.515 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 205.851 | count=0 | post-open POST | post-open POST |
| omnient | 94 | OFF | 201.835 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 204.772 | count=0 | post-open POST | post-open POST |
| omnient | 95 | OFF | 205.746 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 207.622 | count=0 | post-open POST | post-open POST |
| omnient | 96 | OFF | 202.494 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 207.157 | count=0 | post-open POST | post-open POST |
| omnient | 97 | OFF | 208.641 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 208.674 | count=0 | post-open POST | post-open POST |
| omnient | 98 | OFF | 205.714 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 208.878 | count=0 | post-open POST | post-open POST |
| omnient | 99 | OFF | 206.143 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 205.864 | count=0 | post-open POST | post-open POST |
| omnient | 100 | OFF | 207.710 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 208.681 | count=0 | post-open POST | post-open POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/100 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

