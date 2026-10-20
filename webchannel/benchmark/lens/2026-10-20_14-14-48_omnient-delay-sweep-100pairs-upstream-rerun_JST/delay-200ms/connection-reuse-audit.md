# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 20.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 303.000 | 292.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | not sent | handshake | h2 | false | 32.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | failed | 400 | handshake | h2 | false | 300.000 | 290.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | not sent | handshake | h2 | false | 62.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | not sent | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 322.000 | 311.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | not sent | handshake | h2 | false | 23.000 | 11.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | not sent | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 55.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | not sent | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | not sent | handshake | h2 | false | 51.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | not sent | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | not sent | handshake | h2 | false | 61.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | not sent | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | not sent | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | not sent | handshake | h2 | false | 18.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | not sent | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | not sent | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | not sent | handshake | h2 | false | 23.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | not sent | handshake | h2 | false | 38.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | not sent | handshake | h2 | false | 25.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | not sent | handshake | h2 | false | 38.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | not sent | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 59.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | not sent | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | not sent | handshake | h2 | false | 32.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | not sent | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | not sent | handshake | h2 | false | 57.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | not sent | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 30.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | not sent | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | not sent | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | not sent | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 56.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | not sent | handshake | h2 | false | 19.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | not sent | handshake | h2 | false | 24.000 | 11.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 32.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | not sent | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | not sent | handshake | h2 | false | 43.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | not sent | handshake | h2 | false | 29.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 386.000 | 362.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | completed | not sent | handshake | h2 | false | 34.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 300.000 | 290.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 35.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | not sent | handshake | h2 | false | 58.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 55.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | not sent | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 302.000 | 291.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | not sent | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | not sent | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 302.000 | 293.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | not sent | handshake | h2 | false | 49.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 89.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 41.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | not sent | handshake | h2 | false | 49.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | not sent | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | not sent | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 103.000 | 54.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | not sent | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | not sent | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 56.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 20.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | not sent | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 78.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | not sent | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 28.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 207.770 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 206.729 | count=0 | post-open POST | post-open POST |
| omnient | 2 | OFF | 202.087 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 203.442 | count=0 | post-open POST | post-open POST |
| omnient | 3 | OFF | 206.760 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 204.023 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 202.581 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 206.578 | count=0 | post-open POST | post-open POST |
| omnient | 5 | OFF | 201.870 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 200.888 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 204.917 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 208.256 | count=0 | post-open POST | post-open POST |
| omnient | 7 | OFF | 202.605 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 203.542 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 201.284 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 209.971 | count=0 | post-open POST | post-open POST |
| omnient | 9 | OFF | 209.013 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 208.844 | count=0 | post-open POST | post-open POST |
| omnient | 10 | OFF | 208.017 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 208.825 | count=0 | post-open POST | post-open POST |
| omnient | 11 | OFF | 201.036 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 203.165 | count=0 | post-open POST | post-open POST |
| omnient | 12 | OFF | 206.911 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 201.147 | count=0 | post-open POST | post-open POST |
| omnient | 13 | OFF | 201.819 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 200.840 | count=0 | post-open POST | post-open POST |
| omnient | 14 | OFF | 208.877 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 201.863 | count=0 | post-open POST | post-open POST |
| omnient | 15 | OFF | 208.558 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 209.556 | count=0 | post-open POST | post-open POST |
| omnient | 16 | OFF | 205.299 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 208.660 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 202.612 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 206.663 | count=0 | post-open POST | post-open POST |
| omnient | 18 | OFF | 206.413 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 201.284 | count=0 | early POST | post-open POST |
| omnient | 19 | OFF | 202.047 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 206.937 | count=0 | post-open POST | post-open POST |
| omnient | 20 | OFF | 201.335 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 205.181 | count=0 | post-open POST | post-open POST |
| omnient | 21 | OFF | 208.452 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 206.418 | count=0 | post-open POST | post-open POST |
| omnient | 22 | OFF | 208.635 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 205.226 | count=0 | post-open POST | post-open POST |
| omnient | 23 | OFF | 208.411 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 209.048 | count=0 | post-open POST | post-open POST |
| omnient | 24 | OFF | 208.553 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 210.307 | count=0 | post-open POST | post-open POST |
| omnient | 25 | OFF | 210.362 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 207.806 | count=0 | post-open POST | post-open POST |
| omnient | 26 | OFF | 203.646 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 205.768 | count=0 | post-open POST | post-open POST |
| omnient | 27 | OFF | 209.146 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 208.113 | count=0 | post-open POST | post-open POST |
| omnient | 28 | OFF | 204.398 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 208.298 | count=0 | post-open POST | post-open POST |
| omnient | 29 | OFF | 206.541 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 206.387 | count=0 | post-open POST | post-open POST |
| omnient | 30 | OFF | 207.234 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 202.879 | count=0 | post-open POST | post-open POST |
| omnient | 31 | OFF | 204.988 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 208.239 | count=0 | post-open POST | post-open POST |
| omnient | 32 | OFF | 204.515 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 209.514 | count=0 | post-open POST | post-open POST |
| omnient | 33 | OFF | 206.302 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 200.844 | count=0 | post-open POST | post-open POST |
| omnient | 34 | OFF | 206.037 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 204.451 | count=0 | post-open POST | post-open POST |
| omnient | 35 | OFF | 206.510 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 205.093 | count=0 | post-open POST | post-open POST |
| omnient | 36 | OFF | 205.487 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 202.397 | count=0 | post-open POST | post-open POST |
| omnient | 37 | OFF | 201.771 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 202.753 | count=0 | post-open POST | post-open POST |
| omnient | 38 | OFF | 206.066 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 205.573 | count=0 | post-open POST | post-open POST |
| omnient | 39 | OFF | 203.151 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 206.393 | count=0 | post-open POST | post-open POST |
| omnient | 40 | OFF | 208.439 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 204.898 | count=0 | post-open POST | post-open POST |
| omnient | 41 | OFF | 207.015 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 207.409 | count=0 | post-open POST | post-open POST |
| omnient | 42 | OFF | 202.197 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 201.089 | count=0 | post-open POST | post-open POST |
| omnient | 43 | OFF | 208.234 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 206.621 | count=0 | post-open POST | post-open POST |
| omnient | 44 | OFF | 205.987 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 204.705 | count=0 | post-open POST | post-open POST |
| omnient | 45 | OFF | 204.497 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 202.893 | count=0 | post-open POST | post-open POST |
| omnient | 46 | OFF | 200.298 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 205.279 | count=0 | post-open POST | post-open POST |
| omnient | 47 | OFF | 207.368 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 202.524 | count=0 | post-open POST | post-open POST |
| omnient | 48 | OFF | 201.602 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 206.964 | count=0 | post-open POST | post-open POST |
| omnient | 49 | OFF | 206.972 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 209.847 | count=0 | post-open POST | post-open POST |
| omnient | 50 | OFF | 206.263 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 202.001 | count=0 | post-open POST | post-open POST |
| omnient | 51 | OFF | 201.210 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 207.441 | count=0 | post-open POST | post-open POST |
| omnient | 52 | OFF | 206.633 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 204.530 | count=0 | post-open POST | post-open POST |
| omnient | 53 | OFF | 208.140 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 202.303 | count=0 | post-open POST | post-open POST |
| omnient | 54 | OFF | 207.480 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 204.426 | count=0 | post-open POST | post-open POST |
| omnient | 55 | OFF | 206.786 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 209.938 | count=0 | post-open POST | post-open POST |
| omnient | 56 | OFF | 201.283 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 206.958 | count=0 | post-open POST | post-open POST |
| omnient | 57 | OFF | 207.552 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 206.841 | count=0 | post-open POST | post-open POST |
| omnient | 58 | OFF | 200.335 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 201.421 | count=0 | post-open POST | post-open POST |
| omnient | 59 | OFF | 206.806 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 205.979 | count=0 | post-open POST | post-open POST |
| omnient | 60 | OFF | 208.633 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 202.375 | count=0 | post-open POST | post-open POST |
| omnient | 61 | OFF | 203.311 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 209.947 | count=0 | post-open POST | post-open POST |
| omnient | 62 | OFF | 209.393 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 204.565 | count=0 | post-open POST | post-open POST |
| omnient | 63 | OFF | 208.699 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 205.076 | count=0 | post-open POST | post-open POST |
| omnient | 64 | OFF | 203.531 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 202.990 | count=0 | post-open POST | post-open POST |
| omnient | 65 | OFF | 204.190 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 209.037 | count=0 | post-open POST | post-open POST |
| omnient | 66 | OFF | 203.748 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 202.842 | count=0 | post-open POST | post-open POST |
| omnient | 67 | OFF | 206.157 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 203.044 | count=0 | post-open POST | post-open POST |
| omnient | 68 | OFF | 208.080 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 208.842 | count=0 | post-open POST | post-open POST |
| omnient | 69 | OFF | 208.000 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 202.373 | count=0 | post-open POST | post-open POST |
| omnient | 70 | OFF | 203.568 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 205.165 | count=0 | post-open POST | post-open POST |
| omnient | 71 | OFF | 201.010 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 206.453 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 203.727 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 203.781 | count=0 | post-open POST | post-open POST |
| omnient | 73 | OFF | 209.076 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 202.801 | count=0 | post-open POST | post-open POST |
| omnient | 74 | OFF | 207.297 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 201.731 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 201.397 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 209.950 | count=0 | post-open POST | post-open POST |
| omnient | 76 | OFF | 205.252 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 206.436 | count=0 | post-open POST | post-open POST |
| omnient | 77 | OFF | 207.498 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 208.701 | count=0 | post-open POST | post-open POST |
| omnient | 78 | OFF | 204.307 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 201.139 | count=0 | post-open POST | post-open POST |
| omnient | 79 | OFF | 207.048 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 205.402 | count=0 | post-open POST | post-open POST |
| omnient | 80 | OFF | 210.306 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 207.864 | count=0 | post-open POST | post-open POST |
| omnient | 81 | OFF | 210.366 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 205.766 | count=0 | post-open POST | post-open POST |
| omnient | 82 | OFF | 205.982 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 202.092 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 208.526 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 201.707 | count=0 | post-open POST | post-open POST |
| omnient | 84 | OFF | 205.479 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 201.875 | count=0 | post-open POST | post-open POST |
| omnient | 85 | OFF | 206.567 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 202.781 | count=0 | post-open POST | post-open POST |
| omnient | 86 | OFF | 206.106 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 206.857 | count=0 | post-open POST | post-open POST |
| omnient | 87 | OFF | 202.692 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 205.355 | count=0 | post-open POST | post-open POST |
| omnient | 88 | OFF | 206.127 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 206.652 | count=0 | post-open POST | post-open POST |
| omnient | 89 | OFF | 205.914 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 200.898 | count=0 | post-open POST | post-open POST |
| omnient | 90 | OFF | 205.391 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 205.086 | count=0 | post-open POST | post-open POST |
| omnient | 91 | OFF | 207.801 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 208.701 | count=0 | post-open POST | post-open POST |
| omnient | 92 | OFF | 201.210 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 203.245 | count=0 | post-open POST | post-open POST |
| omnient | 93 | OFF | 206.513 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 202.253 | count=0 | post-open POST | post-open POST |
| omnient | 94 | OFF | 209.036 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 203.538 | count=0 | post-open POST | post-open POST |
| omnient | 95 | OFF | 208.421 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 207.923 | count=0 | post-open POST | post-open POST |
| omnient | 96 | OFF | 206.601 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 203.598 | count=0 | post-open POST | post-open POST |
| omnient | 97 | OFF | 207.129 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 201.192 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 206.795 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 202.222 | count=0 | post-open POST | post-open POST |
| omnient | 99 | OFF | 207.206 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 201.421 | count=0 | post-open POST | post-open POST |
| omnient | 100 | OFF | 206.790 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 208.167 | count=0 | post-open POST | post-open POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 1/100 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 7. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 7 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 3788 | A522D3EA-7230-4F76-A300-BAFACBCBACF7 |
| 1 | ON | 2 | 3790 | 01C761A4-198C-4394-BBFC-E63667B997E1 |
| 2 | OFF | 3 | 3791 | E54B008A-005A-432E-9251-B8985C6495BD |
| 2 | ON | 4 | 3792 | A5DE3BBD-6C8A-466B-953A-3BB08A663E61 |
| 3 | OFF | 5 | 3793 | B0FC2D7C-7FC1-4CAC-92C6-03FFDA2FE18B |
| 3 | ON | 6 | 3794 | 7FC98C79-C6C5-4109-B7B8-FFED3D78FBD2 |
| 4 | OFF | 7 | 3795 | 087C2807-65A7-4CEA-B62F-BD587A6BC6D3 |
| 4 | ON | 8 | 3796 | 9AE313F1-3370-40AE-88CE-CC87CCE4E6C9 |
| 5 | OFF | 9 | 3797 | F927A19B-231E-4809-BA1F-38AF5B77C015 |
| 5 | ON | 10 | 3799 | 7D72306D-305D-4CB1-989F-A1FEDB043114 |
| 6 | OFF | 11 | 3800 | D4B2CF5C-62A0-4899-A5B5-F33A1197286C |
| 6 | ON | 12 | 3801 | 7F3368A7-1FEF-489D-B484-1AAF3575D025 |
| 7 | OFF | 13 | 3802 | AF1C88F9-71B6-430D-9943-FE9AC493EB6C |
| 7 | ON | 14 | 3803 | 4A428C1B-8A4A-4A62-9899-51CC6465AA31 |
| 8 | OFF | 15 | 3804 | 75197FD3-CE7D-4E80-8A16-36479C451C77 |
| 8 | ON | 16 | 3805 | B230971B-1886-4D25-BF9B-75153B830E05 |
| 9 | OFF | 17 | 3806 | BA12ABAB-BFD2-4378-93E0-9B22B46CFAFF |
| 9 | ON | 18 | 3808 | 4A1CCAFF-281F-4BD3-B003-2A852909AD5D |
| 10 | OFF | 19 | 3809 | 07EB979C-284A-44AA-BAB3-01DC74BDCDA7 |
| 10 | ON | 20 | 3810 | E289122E-D911-492E-887C-3B032CFA4A8B |
| 11 | OFF | 21 | 3811 | 9EBFE966-4738-403F-8307-FBBD1673DC04 |
| 11 | ON | 22 | 3812 | AC0FFC7C-A31D-4B85-B973-DED93EA53BFC |
| 12 | OFF | 23 | 3813 | 6733637B-EF60-4627-B835-79A63CFB9774 |
| 12 | ON | 24 | 3814 | B01B6F80-8548-44F0-9437-453F72BA7E23 |
| 13 | OFF | 25 | 3815 | 8FC00C8D-4257-495F-B5D9-50439612C215 |
| 13 | ON | 26 | 3817 | 5CD03180-021A-4F20-B444-87B5F4A48541 |
| 14 | OFF | 27 | 3818 | 4A822F9A-5903-4892-A9EF-30244B0DEA5B |
| 14 | ON | 28 | 3819 | 50A10613-BDAC-4198-9E7A-F6A4AFDEB31F |
| 15 | OFF | 29 | 3820 | 7D50848C-933C-4446-B704-439B8BDA49B4 |
| 15 | ON | 30 | 3821 | B4E514A0-BF1B-44FA-B9D0-70EAAEAB89EB |
| 16 | OFF | 31 | 3822 | 7B033993-F65B-467E-B600-40B6CBFD5EFB |
| 16 | ON | 32 | 3823 | D9182433-74C4-42C1-B2EB-EC76F61B4F99 |
| 17 | OFF | 33 | 3824 | 15BF5080-8336-4CB0-ABD2-C0F94C475745 |
| 17 | ON | 34 | 3826 | 184492E4-4EDB-4657-B234-D142E10089B8 |
| 18 | OFF | 35 | 3827 | 8CF8B771-8001-4EB2-98B7-6CEEB584C763 |
| 18 | ON | 36 | 3828 | 3D7C5F94-A10B-4930-9897-DF3BD6F64850 |
| 19 | OFF | 37 | 3829 | D3294A70-907F-445F-9121-D19176105B44 |
| 19 | ON | 38 | 3830 | 41C4CB44-7B75-4EA9-BD5C-2E80E07821C4 |
| 20 | OFF | 39 | 3831 | C23A0480-B8D8-4B40-A5FF-B3DB8F7EEC2D |
| 20 | ON | 40 | 3832 | 3B2E8B9A-A966-4C98-896C-C7E09807E2D9 |
| 21 | OFF | 41 | 3833 | 08ECDFA5-79F4-41F0-B8AD-C3C2088B7296 |
| 21 | ON | 42 | 3835 | 0A6C45FE-B80D-4161-9B70-124495A015A9 |
| 22 | OFF | 43 | 3836 | 07CED884-D237-4B1D-BE3D-14031CE8CC78 |
| 22 | ON | 44 | 3837 | 72C454AA-C76E-4050-947F-5AA3C3BEBFE2 |
| 23 | OFF | 45 | 3838 | BC3ADCA7-34AE-48C5-8160-B6FDCC2D2904 |
| 23 | ON | 46 | 3839 | 936B0358-709B-4F6C-9707-64FDE5B57FF1 |
| 24 | OFF | 47 | 3840 | 0385B9B7-70E4-41E7-A191-81E5A120891B |
| 24 | ON | 48 | 3841 | 7B50C6C5-4116-4F7B-8B2F-CCAF7CD9063E |
| 25 | OFF | 49 | 3842 | 451E9F55-A2D3-46DE-992E-58F184B57AD1 |
| 25 | ON | 50 | 3844 | 60220EE9-6738-45F4-9F3C-F1769401F216 |
| 26 | OFF | 51 | 3845 | 20A5A78F-41DD-4C80-8768-5B0925741389 |
| 26 | ON | 52 | 3846 | 2ED0A292-BB6C-46CA-995C-B481598E709B |
| 27 | OFF | 53 | 3847 | 6DCD063A-CE67-4FB5-9B34-0213D0FD00D7 |
| 27 | ON | 54 | 3848 | 4C6271D1-155C-4345-BE6A-16D40B72853D |
| 28 | OFF | 55 | 3849 | 26274DCB-07BE-4E3B-8548-DC1F8D326B70 |
| 28 | ON | 56 | 3850 | 423C439C-2E65-413D-B95B-76B1962AB0A1 |
| 29 | OFF | 57 | 3851 | D8949472-1F0A-49C4-A875-55D071FE8B66 |
| 29 | ON | 58 | 3853 | A01AEB40-A25F-47BF-9EBE-F285693F4D6F |
| 30 | OFF | 59 | 3854 | D53604E9-42B0-4783-8658-AFDEAC34C3EB |
| 30 | ON | 60 | 3855 | 1A60F01A-151D-440D-BC75-402AA653CCBF |
| 31 | OFF | 61 | 3856 | B951C97C-89D6-462D-9422-8016A1E5FDBE |
| 31 | ON | 62 | 3857 | 61B6F4EC-1A43-401F-A8EB-A2D16B30570A |
| 32 | OFF | 63 | 3858 | F4FFE039-ABB8-421F-9202-01C11E420172 |
| 32 | ON | 64 | 3859 | 6C751E40-4101-45F7-8A28-A773924BBBA7 |
| 33 | OFF | 65 | 3860 | F25F364F-47DC-4515-98B7-016DC45D3B93 |
| 33 | ON | 66 | 3862 | 47064338-5E24-4D96-AB5D-1916E57F4AF6 |
| 34 | OFF | 67 | 3863 | AF60D66E-73F9-480F-91FD-B34DEC77F099 |
| 34 | ON | 68 | 3864 | AE3871D0-2027-4AAB-B54D-1F0548467E1F |
| 35 | OFF | 69 | 3865 | BE8220E6-1CA9-49DE-B5A5-9C9C4772C5BF |
| 35 | ON | 70 | 3866 | B0E3A147-9A34-4415-AEC2-0F1B722B60EF |
| 36 | OFF | 71 | 3867 | AD5D6A63-F120-4F3D-83BC-1C124583B79C |
| 36 | ON | 72 | 3868 | D841AF8A-6FFC-4697-B2D6-95037F293BBF |
| 37 | OFF | 73 | 3870 | D095A33B-AE6D-4EB5-84BD-914748614F0C |
| 37 | ON | 74 | 3871 | 47ADB0FD-9191-42D2-83E3-704215B465EC |
| 38 | OFF | 75 | 3872 | 60A0ECCC-891D-4C4D-8A0C-6386F14E4254 |
| 38 | ON | 76 | 3873 | 512E4969-C4F3-477F-90AB-AAD3DBF30B66 |
| 39 | OFF | 77 | 3875 | B4983CA6-7853-4B11-BBA7-5F7F5332B072 |
| 39 | ON | 78 | 3876 | E0140180-1611-4D5A-BA28-5B1A515E1E46 |
| 40 | OFF | 79 | 3877 | 82BFC243-666E-467A-842A-705CE44002DB |
| 40 | ON | 80 | 3878 | 97BC8F14-3459-4D5C-981A-08B3FFBB19C5 |
| 41 | OFF | 81 | 3880 | DFDC9ED3-D86D-41EE-84AC-AC073DE23AEB |
| 41 | ON | 82 | 3881 | D766A1C7-BC42-4659-B692-05097C6FF551 |
| 42 | OFF | 83 | 3882 | 10E7D7B0-B0E4-4087-A6DA-5B204E6DB600 |
| 42 | ON | 84 | 3883 | 2ABAE5A2-B365-46CA-8905-DD01518BFF1E |
| 43 | OFF | 85 | 3884 | F971E65C-3608-4886-BB6F-9D16AD825AC0 |
| 43 | ON | 86 | 3885 | 02C9CEF6-26F0-4F5A-835D-8CDFE8315712 |
| 44 | OFF | 87 | 3886 | 1C6B442E-84D3-4714-8414-8272DEF2881C |
| 44 | ON | 88 | 3887 | 095C7166-D4A7-4524-98BE-CB4FE368960F |
| 45 | OFF | 89 | 3889 | B82415D3-6778-46A8-91A1-D14F44337B70 |
| 45 | ON | 90 | 3890 | 6FA4CAC0-1105-4465-984A-528DA291A993 |
| 46 | OFF | 91 | 3891 | 4D986A6D-58B2-41E7-B779-F5D95AE68973 |
| 46 | ON | 92 | 3892 | E4F773F2-F274-4E0C-96FA-07397A7BEFA3 |
| 47 | OFF | 93 | 3893 | C930F60C-9967-487D-83AC-7E428389382E |
| 47 | ON | 94 | 3894 | 3CABA69A-0C02-4912-8ACB-6020CB7A9F05 |
| 48 | OFF | 95 | 3895 | 1C6D280E-3662-480A-AFE9-EA236D60C09D |
| 48 | ON | 96 | 3896 | 48A19E98-B5F9-4E6F-8DDC-656550D335F6 |
| 49 | OFF | 97 | 3898 | B98BECF4-D933-438E-8F32-9DA74C960A58 |
| 49 | ON | 98 | 3899 | E6B759F5-15BA-4E52-B503-4FCE7D8E9016 |
| 50 | OFF | 99 | 3900 | 2DC83627-34FA-4F38-90F1-8E2A74239DD8 |
| 50 | ON | 100 | 3901 | E50E86A5-EC9F-4FC9-BED5-31CD6C384E16 |
| 51 | OFF | 101 | 3902 | 20AA345E-431A-4CF4-A33E-FE4D064A3B05 |
| 51 | ON | 102 | 3903 | 75A93484-0116-4770-8717-1702959BCA46 |
| 52 | OFF | 103 | 3904 | 8388E406-1320-451B-8436-3861D32DA179 |
| 52 | ON | 104 | 3905 | 934121E0-3B42-4927-95C6-4148D831C402 |
| 53 | OFF | 105 | 3907 | 1710507E-1DE8-4A47-BCE1-63D817ED46D1 |
| 53 | ON | 106 | 3908 | 0BFFDD7A-0EA6-4C28-ABFA-0990D87979C4 |
| 54 | OFF | 107 | 3909 | DC532BAF-E7FA-4604-B6D5-DB50D33D5767 |
| 54 | ON | 108 | 3910 | DA0C0AF0-33EC-41F2-BC0B-E5EAADAF43FA |
| 55 | OFF | 109 | 3911 | 6913B27C-E0D7-4DCA-A7A9-70CFADF48BEB |
| 55 | ON | 110 | 3912 | 6637F264-9817-427D-81BC-67C8C424D775 |
| 56 | OFF | 111 | 3913 | 83BE3895-6B95-4AEC-A642-69DD6677171F |
| 56 | ON | 112 | 3914 | 85857B0A-B617-47CA-B109-946D30B49AA0 |
| 57 | OFF | 113 | 3916 | ACC24B9D-4663-4DE6-811E-CE155E62E7A8 |
| 57 | ON | 114 | 3917 | B9D343F9-E383-46EE-9EB5-38798E104D3A |
| 58 | OFF | 115 | 3918 | 48949BB9-145C-48E5-9A50-2EF57AA6F43C |
| 58 | ON | 116 | 3919 | CA0B9052-8C07-428A-9207-CACCC9B34FCD |
| 59 | OFF | 117 | 3920 | 96DB7500-B8B0-4295-8C01-5B5817C1C98A |
| 59 | ON | 118 | 3921 | CB2F7058-B7C5-42DF-8444-40FB3536937F |
| 60 | OFF | 119 | 3922 | 8571CF38-DC6F-42A2-A499-1753DCC0D37F |
| 60 | ON | 120 | 3923 | 5A5B5B4A-EBBD-4CB8-8A16-BBE85EA0C30F |
| 61 | OFF | 121 | 3925 | C4CF19EB-09D4-46EC-8007-98199B1B7707 |
| 61 | ON | 122 | 3926 | ADB451B5-2879-47FD-8EEF-33A692FAC45B |
| 62 | OFF | 123 | 3927 | 22504CC8-F778-4B29-8E66-5C5673E07221 |
| 62 | ON | 124 | 3928 | 6CB0AAF5-C862-4A51-B8BB-9255781A2108 |
| 63 | OFF | 125 | 3929 | 225A76FA-0C3F-48F3-AE29-6D9D7FDB7315 |
| 63 | ON | 126 | 3930 | 36066DD4-7B6B-4058-8B75-4A4AFFCF7E89 |
| 64 | OFF | 127 | 3931 | 97C0F615-AF21-4331-9CEF-DE50A933E180 |
| 64 | ON | 128 | 3933 | 4DC2E713-19C8-4EB8-B58B-705F057BBFA2 |
| 65 | OFF | 129 | 3934 | F249726B-95B0-42BD-8EA0-5A4CA9C052A9 |
| 65 | ON | 130 | 3935 | 05C8AEBC-E6A1-4069-B451-CEC496390F71 |
| 66 | OFF | 131 | 3936 | B1396DFA-2653-4989-A796-136F0F79A464 |
| 66 | ON | 132 | 3937 | B0F7356D-B2CC-46FA-AA21-72989806C566 |
| 67 | OFF | 133 | 3938 | E852A7D0-F5A3-4618-893D-4BD297A2D538 |
| 67 | ON | 134 | 3939 | 76048664-31BF-4116-B461-AC379F8550F4 |
| 68 | OFF | 135 | 3940 | 1E255D6F-405E-474B-A0F4-954020348E08 |
| 68 | ON | 136 | 3942 | 3C8E6841-5962-4DFC-9159-B1383EB6C245 |
| 69 | OFF | 137 | 3943 | F02F324D-8124-4E30-B6FB-CCEFAB68ED6C |
| 69 | ON | 138 | 3944 | 060C20EC-3C6F-4772-B3CD-DAC330E447FF |
| 70 | OFF | 139 | 3945 | 7F399385-A11F-46E8-A9CD-5F33B5D55A16 |
| 70 | ON | 140 | 3946 | 4B6F3762-26F4-4193-9B62-C17C975CDDA9 |
| 71 | OFF | 141 | 3947 | 9E40496E-43AA-45E9-98BD-626EC230EF61 |
| 71 | ON | 142 | 3948 | 081083B0-3097-4753-BAA7-5420FD67EA09 |
| 72 | OFF | 143 | 3949 | 97067D6E-103C-4FF1-86E9-2260DC4C06BE |
| 72 | ON | 144 | 3951 | D986C538-A76E-40E0-87EB-25FD92BFEA77 |
| 73 | OFF | 145 | 3952 | E86F65A3-4B75-41AA-9175-F0661195B3D4 |
| 73 | ON | 146 | 3953 | AFAA1C8B-B7EB-4C86-A79C-1FAC7482898E |
| 74 | OFF | 147 | 3954 | E5CDF255-BFC2-48FE-8E68-5719E4ADAC59 |
| 74 | ON | 148 | 3955 | 64065565-AD6D-4B6F-A7F9-254C52A50FB1 |
| 75 | OFF | 149 | 3956 | 7FB3BDCB-7B39-4282-8A4E-5F3CE6A34131 |
| 75 | ON | 150 | 3957 | 2C29719D-7ACB-449D-BC6B-D193CF8F19EA |
| 76 | OFF | 151 | 3958 | 0E701771-1B8B-4131-9EA9-30936AAA7F19 |
| 76 | ON | 152 | 3960 | 9CD1C325-4E9D-4790-B2A7-2E67D5D1FBA5 |
| 77 | OFF | 153 | 3961 | 45FAC216-93A6-42DA-994B-80CF1C008037 |
| 77 | ON | 154 | 3962 | CBFA2D00-720B-49F0-B4BB-F33CC47FBE56 |
| 78 | OFF | 155 | 3963 | 7B6FF064-024B-46C8-AF93-CD12EAB5168F |
| 78 | ON | 156 | 3964 | D9BFF524-F7D8-4C38-872C-42930CEEA328 |
| 79 | OFF | 157 | 3965 | A8DFD811-8DBB-493F-9F9D-152B59652E19 |
| 79 | ON | 158 | 3966 | D1D9421D-E32F-40A9-80D2-A5A65A7553D1 |
| 80 | OFF | 159 | 3968 | BF70A68A-C4D5-4DD4-AB51-408F21142935 |
| 80 | ON | 160 | 3970 | DB687FCD-47B6-4DAF-9662-5640B4DAB14D |
| 81 | OFF | 161 | 3971 | C9BFCE40-DEA2-441B-825D-B5439E162F10 |
| 81 | ON | 162 | 3972 | 031E69B5-AF88-49AA-A86B-2F1050CF745F |
| 82 | OFF | 163 | 3973 | 1F9DB0E2-FBDD-48FE-B863-D3B9B5048E02 |
| 82 | ON | 164 | 3974 | 258DDABC-0807-4D21-9564-6011995841D8 |
| 83 | OFF | 165 | 3975 | 3D5612DB-120A-4A93-BDFD-698F4CFEAB52 |
| 83 | ON | 166 | 3977 | 8BEA6E69-3304-47A1-A4CD-C3E698907BBC |
| 84 | OFF | 167 | 3978 | F5253839-52B3-4A8C-8546-54EB5C3B8476 |
| 84 | ON | 168 | 3979 | 67CE275C-1280-4FFB-BFCB-E3F2B68BF399 |
| 85 | OFF | 169 | 3980 | 23FF92FA-D5B0-4347-9F80-5C4AE60BFEF5 |
| 85 | ON | 170 | 3981 | 0347FD59-C6D2-4C8C-96C1-850AF3864F02 |
| 86 | OFF | 171 | 3982 | 9EE6A5F8-492B-4E17-9A7C-2DC50B021012 |
| 86 | ON | 172 | 3983 | A93FF6FD-73F9-43B6-9017-7A8DAF7FD140 |
| 87 | OFF | 173 | 3984 | 6305E754-6DB4-457C-AB9B-DE02DAE96B65 |
| 87 | ON | 174 | 3986 | CA6F190C-A299-4EEB-8DDE-7A77ED9319D7 |
| 88 | OFF | 175 | 3987 | 15700C16-88BD-40AF-9794-F4E54CA4EBB0 |
| 88 | ON | 176 | 3988 | B05785E8-3882-47F2-BF1C-96686B249CBB |
| 89 | OFF | 177 | 3989 | 524CA4EB-B538-4EAF-BB86-79AE645E87DD |
| 89 | ON | 178 | 3990 | 94099579-E88B-4BF4-BB7C-6900334B4A3F |
| 90 | OFF | 179 | 3991 | 4BE0894F-51D1-4E24-B16A-87039D350A4B |
| 90 | ON | 180 | 3992 | 1EAE9C13-C506-4D7B-BCA6-14E71E9D1DBC |
| 91 | OFF | 181 | 3993 | 498C5396-4A92-4E8D-8DA0-DC4D787917EA |
| 91 | ON | 182 | 3995 | 9EC57234-1DCF-41DF-84C2-66E79550A1E8 |
| 92 | OFF | 183 | 3996 | 850B9A8E-DCF9-4895-BCDA-C1384E41A76A |
| 92 | ON | 184 | 3997 | 613F2F76-616C-495B-9875-EFD125C9EBE5 |
| 93 | OFF | 185 | 3998 | 9EC7293E-F3C2-422F-B0FE-D10AACA06AA2 |
| 93 | ON | 186 | 3999 | AFB9DDB7-4442-4136-8051-F8F7CCE93DCA |
| 94 | OFF | 187 | 4000 | 3AD6CABA-0798-407F-8321-9221626E2944 |
| 94 | ON | 188 | 4001 | B87BF1F5-0F79-4614-91B7-91A965A0A064 |
| 95 | OFF | 189 | 4002 | 3CCEA872-4E51-429A-A246-1D645B7F03EE |
| 95 | ON | 190 | 4004 | 2C6D05D9-EDE6-426C-9645-C253C0E87921 |
| 96 | OFF | 191 | 4005 | ABDDAA1D-D738-4371-BF68-0421F65ED26A |
| 96 | ON | 192 | 4006 | F491E04F-EC3B-4625-9C1B-0AFE58E097DC |
| 97 | OFF | 193 | 4007 | A36B9B82-4489-4137-82F2-5BD52F3D3E4E |
| 97 | ON | 194 | 4008 | E2D0D242-1D1A-4A31-B926-506ECE4E36A0 |
| 98 | OFF | 195 | 4009 | 88EB0395-68FB-4B22-8E1C-FFCAB832D5D7 |
| 98 | ON | 196 | 4010 | B5138F7B-84C7-43EB-875E-A6DD5712B7EE |
| 99 | OFF | 197 | 4011 | 156A75C2-A9DF-4917-887A-E31F1CA3E556 |
| 99 | ON | 198 | 4013 | 20236DD0-14AE-4B87-A33E-BF95326602B0 |
| 100 | OFF | 199 | 4014 | 680B0312-B8D1-4510-B941-631C2DCA884C |
| 100 | ON | 200 | 4015 | 5B1864BD-0AB4-4B8F-A107-59E95E854EAA |
