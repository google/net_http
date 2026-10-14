# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 153.180 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 156.364 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 151.323 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 153.579 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 153.534 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 154.631 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 152.119 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 152.216 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 156.577 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 151.345 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 156.188 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 151.694 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 155.875 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 154.273 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 156.586 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 153.501 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 156.214 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 156.429 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 155.066 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 156.025 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 155.938 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 150.814 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 156.054 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 156.070 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 156.046 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 155.976 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 157.660 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 152.449 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 151.342 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 152.925 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 157.324 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 151.204 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 155.912 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 153.233 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 152.152 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 155.403 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 155.709 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 155.378 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 150.553 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 156.841 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 156.204 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 150.880 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 156.673 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 156.485 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 155.828 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 155.396 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 155.631 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 156.264 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 156.472 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 156.805 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 154.145 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 157.919 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 156.761 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 156.772 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 156.244 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 152.124 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 156.554 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 153.043 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 153.919 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 155.913 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 154.914 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 152.591 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 154.111 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 155.879 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 154.561 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 156.729 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 152.491 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 156.296 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 152.568 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 151.093 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 155.293 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 157.788 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 153.561 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 155.463 | count=0 | early POST | post-open POST |
| omnient | 38 | OFF | 153.115 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 152.447 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 155.353 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 154.658 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 156.190 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 150.530 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 155.201 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 156.264 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 156.834 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 152.571 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 155.593 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 154.071 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 155.614 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 156.689 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 157.619 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 150.809 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 154.893 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 150.480 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 156.966 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 150.994 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 156.390 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 157.858 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 156.505 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 155.498 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 155.807 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 152.278 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 155.624 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 157.912 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 156.468 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 156.695 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 151.516 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 156.564 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 150.991 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 155.418 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 155.401 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 155.155 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 156.333 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 154.284 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 155.829 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 155.466 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 151.736 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 152.474 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 154.731 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 156.412 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 151.383 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 157.518 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 151.484 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 155.882 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 155.892 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 152.272 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 154.330 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 155.911 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 154.417 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 153.605 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 155.756 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 156.179 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 150.827 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 156.961 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 153.300 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 155.994 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 155.119 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 151.747 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 151.368 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 151.733 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 153.363 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 153.239 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 155.648 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 153.464 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 153.324 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 153.161 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 154.396 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 156.594 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 155.970 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 156.521 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 152.597 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 153.013 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 154.591 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 157.126 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 156.466 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 150.832 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 155.839 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 156.335 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 155.686 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 154.546 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 150.732 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 153.079 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 156.435 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 155.100 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 156.495 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 151.601 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 155.771 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 153.181 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 156.593 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 157.904 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 151.252 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 154.530 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 157.620 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 156.379 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 154.991 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 151.733 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 156.314 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 155.265 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 157.889 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 154.337 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 152.468 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 153.095 | count=0 | early POST | post-open POST |
| omnient | 91 | OFF | 154.895 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 156.143 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 151.261 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 150.467 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 155.891 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 153.310 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 155.699 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 155.894 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 151.646 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 153.034 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 156.046 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 156.204 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 156.705 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 157.411 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 150.745 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 156.156 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 153.983 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 150.880 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 155.180 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 156.310 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 150 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/100 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 35704 | FCE46DD5-C1B1-4B8B-AA73-ADE11444082A |
| 1 | ON | 2 | 35705 | E58F64B4-A955-494A-AE4D-B2244814ECF5 |
| 2 | OFF | 3 | 35706 | 06D4F726-2BDD-4419-87A6-20984F0B9792 |
| 2 | ON | 4 | 35707 | 56A66EA6-C98D-47F9-83D6-827B8E0F8D37 |
| 3 | OFF | 5 | 35709 | 817295DF-C5D4-4ED6-9AA6-01D78CDED132 |
| 3 | ON | 6 | 35710 | 29061D63-F9BE-43AA-9006-6804ED4CBF37 |
| 4 | OFF | 7 | 35711 | 8B99D006-437C-4F46-A835-CC1FEBC3A0D8 |
| 4 | ON | 8 | 35712 | DBB754D8-1D54-4EC1-8F68-4CB325957925 |
| 5 | OFF | 9 | 35713 | 6B196B7A-5DF0-44FC-A60B-83199E66D292 |
| 5 | ON | 10 | 35714 | 461CB423-FD27-4925-851A-D04A6B7296E6 |
| 6 | OFF | 11 | 35715 | ED63C012-E636-4ABA-83F7-6FD348D0FF76 |
| 6 | ON | 12 | 35716 | 0196CF29-239D-49E2-9B96-C73149D0401C |
| 7 | OFF | 13 | 35718 | A996BB16-ECC7-437A-9671-DC956C689B44 |
| 7 | ON | 14 | 35719 | 9ED91623-2122-4BEC-9B15-E500523B8A32 |
| 8 | OFF | 15 | 35720 | 05748CAE-1E45-4FF8-B0EE-CCEE7B5EFF6B |
| 8 | ON | 16 | 35721 | 602D3E34-A0BF-447A-85A7-0F9A74468A57 |
| 9 | OFF | 17 | 35722 | 4DB2029E-6127-44CD-8EA8-699095898156 |
| 9 | ON | 18 | 35723 | 5E1FB7F8-29FA-40B6-A882-3615352A586E |
| 10 | OFF | 19 | 35724 | 52A7EE07-CE04-43E1-895C-D028569D466B |
| 10 | ON | 20 | 35725 | B063081F-74C4-4955-8D22-BBAB3DE29A10 |
| 11 | OFF | 21 | 35727 | 2C71A8A4-8EBD-4513-88EC-F2A9F16C50DC |
| 11 | ON | 22 | 35728 | C2330937-A66A-475E-B024-39472A361849 |
| 12 | OFF | 23 | 35729 | 83395383-19E4-4872-85AE-FE0D278B0029 |
| 12 | ON | 24 | 35730 | EDD42CB0-DE0B-4CDA-83BC-9793A91AA501 |
| 13 | OFF | 25 | 35731 | 3A50BA0C-5D7E-4131-8AF4-ED96F374C199 |
| 13 | ON | 26 | 35732 | E2FD7FAF-D0C2-442F-8730-E0D6A619B62E |
| 14 | OFF | 27 | 35733 | 5BA9CF44-21E1-4210-A03F-C1A802C5837A |
| 14 | ON | 28 | 35734 | 028CC3E8-58B5-436A-9125-8AC60DDC1FFE |
| 15 | OFF | 29 | 35735 | 4704A94A-6081-480E-A70E-A9AC12A41C96 |
| 15 | ON | 30 | 35737 | 2ADE8776-F7FD-43AF-98DF-CC41F9B83255 |
| 16 | OFF | 31 | 35738 | DE2D4E8C-880C-4DA2-9263-89C7C0D6D79E |
| 16 | ON | 32 | 35739 | D899E17D-8B43-475F-8487-33C6D4249D7A |
| 17 | OFF | 33 | 35740 | 579AC333-88AD-4FCD-A8BC-238691718E70 |
| 17 | ON | 34 | 35742 | BFAEFED6-894C-4AD8-B57E-A563679828F0 |
| 18 | OFF | 35 | 35743 | 770B028C-F1DB-4D03-9B53-FC67DA8EE3E6 |
| 18 | ON | 36 | 35744 | AEC36A4C-E39E-4006-9685-7C391D10D388 |
| 19 | OFF | 37 | 35745 | 4EEECEA5-77A9-4E5C-A897-26766142C700 |
| 19 | ON | 38 | 35747 | 67E16568-B41B-4CD8-A6AD-026DBF6FF329 |
| 20 | OFF | 39 | 35748 | 95173D84-1D9C-4357-8832-E40790F5224C |
| 20 | ON | 40 | 35749 | B627D675-156F-4797-9924-EE120D61017C |
| 21 | OFF | 41 | 35750 | 7A52C037-00EA-4C56-A0B0-E419F81FA8AA |
| 21 | ON | 42 | 35751 | F9AD9682-8199-4B34-9C19-61152BDB67FF |
| 22 | OFF | 43 | 35752 | 346C1D2C-5ABB-45F1-AA2A-DF872E76E32F |
| 22 | ON | 44 | 35753 | 2C7E14C5-D1C7-4DF8-9C89-55D0B74F5258 |
| 23 | OFF | 45 | 35754 | 4E3DDA4E-BA22-4D98-AA3B-18A483569A9F |
| 23 | ON | 46 | 35756 | 62667B7A-4DE3-4380-BD0A-9188A1487BDA |
| 24 | OFF | 47 | 35757 | 22E07620-EB5E-4435-84E9-40B318E97E40 |
| 24 | ON | 48 | 35758 | 80EE1FFC-9B12-43DA-A63C-9D6B926A23A1 |
| 25 | OFF | 49 | 35759 | EF87F46F-A31C-4CA6-9F86-50943172A055 |
| 25 | ON | 50 | 35760 | EF02C3F0-2641-4925-9156-4E44C8FD0820 |
| 26 | OFF | 51 | 35761 | 48D740A8-0A7F-4C6D-8098-6630A3045E35 |
| 26 | ON | 52 | 35763 | 256B4581-4D5C-4FE4-BFBF-41C7783E8E2D |
| 27 | OFF | 53 | 35764 | AAC17DA4-5196-4ED3-AD4F-4F7EFC4CD21D |
| 27 | ON | 54 | 35765 | 7DEBFBE6-04C7-4774-87CD-40D48C859671 |
| 28 | OFF | 55 | 35766 | 6E554DE8-4138-43E6-BB27-C7235ED38E80 |
| 28 | ON | 56 | 35767 | D6E47320-8CA7-47A3-A6D6-3122DE725D22 |
| 29 | OFF | 57 | 35768 | 07F1F90D-0821-4A2E-B1D7-32FF9EF69013 |
| 29 | ON | 58 | 35769 | 370AA804-987C-48BF-B01F-8C88043B181F |
| 30 | OFF | 59 | 35770 | 64C080C1-FDDD-46C0-AC6A-77A19C1A35BC |
| 30 | ON | 60 | 35771 | 5144D3D7-9E37-45F5-976A-6048B44D6834 |
| 31 | OFF | 61 | 35773 | C869C0A3-9F91-455B-8394-D78B49B3E071 |
| 31 | ON | 62 | 35774 | 3E6851CA-B40E-48D0-89C4-7ADE6FFA7305 |
| 32 | OFF | 63 | 35775 | B08F83CB-084C-4CD1-9381-020ACAA41C85 |
| 32 | ON | 64 | 35776 | FC69B28A-37CD-4C7B-9ACA-45D934A79E21 |
| 33 | OFF | 65 | 35777 | 1C34A2FF-3406-4FDC-89BE-DC92BBEC35F2 |
| 33 | ON | 66 | 35778 | 5B40C645-AEEF-4582-BCA6-4BDF7E4D4C6F |
| 34 | OFF | 67 | 35779 | 736938E0-C70E-47CA-A43D-2EE695C1F0C0 |
| 34 | ON | 68 | 35780 | AAFE1EC9-DCA0-45A7-AF65-0EA4F6189A18 |
| 35 | OFF | 69 | 35782 | FF82168F-6328-4F1C-8CD2-5B8E8BF6C391 |
| 35 | ON | 70 | 35783 | D84B60C9-220C-4B42-8027-8C19D7B68EAE |
| 36 | OFF | 71 | 35784 | 68BFAA86-CBE5-4C5C-82A3-531B602FD67F |
| 36 | ON | 72 | 35785 | 6AAE4207-1E76-4693-8E9D-26B8E6D0E478 |
| 37 | OFF | 73 | 35786 | 8E261C25-8860-4295-8EFC-65039702CC9D |
| 37 | ON | 74 | 35787 | B2CEF948-C359-4696-A520-1503A4D56E2C |
| 38 | OFF | 75 | 35788 | 92CA91AA-664A-43EA-8111-90EF6D92436D |
| 38 | ON | 76 | 35789 | 13515201-6C70-4B22-B116-B56A1DF04E91 |
| 39 | OFF | 77 | 35790 | 3947088B-B2E1-41E6-B3D2-843995822C1C |
| 39 | ON | 78 | 35792 | 4F73331A-B85E-4AB2-AE60-A7579E8A4CD8 |
| 40 | OFF | 79 | 35793 | CCCF24BD-D782-42FB-AD58-DF1FBB5E0141 |
| 40 | ON | 80 | 35794 | 5183DC8E-E98D-4B51-83B9-F2B647D5A6F5 |
| 41 | OFF | 81 | 35795 | 3ECCBCEB-EEC0-4BC4-A542-ADF23FE036A6 |
| 41 | ON | 82 | 35796 | 24991112-9F34-48C7-8BEA-8B88CE9D024F |
| 42 | OFF | 83 | 35797 | E88FFA65-4664-466C-83FA-8DA578F36552 |
| 42 | ON | 84 | 35798 | 6E109943-C48A-4194-8A1F-16C0E4080B10 |
| 43 | OFF | 85 | 35799 | EE06E055-9921-41AA-A026-C17310690B88 |
| 43 | ON | 86 | 35801 | C1239B27-3DDF-4C6C-B4E2-A0390CC64318 |
| 44 | OFF | 87 | 35802 | 1F75F23B-5120-4DCA-A259-95C785D70903 |
| 44 | ON | 88 | 35803 | 4A382B14-8DB2-417B-AD02-40DD12C337B8 |
| 45 | OFF | 89 | 35804 | 60563D69-77F7-454B-8B8E-4AC20FC09F52 |
| 45 | ON | 90 | 35805 | F47DCA31-0D2B-4280-AA91-14B93636C083 |
| 46 | OFF | 91 | 35806 | E56C014A-EA3B-4E59-80BF-9B7CF4869382 |
| 46 | ON | 92 | 35807 | 6F995D97-2901-4F7A-9FB3-21A6CB105BF6 |
| 47 | OFF | 93 | 35808 | 702DDE16-9CAE-4BD4-9141-37723777678D |
| 47 | ON | 94 | 35810 | AEDB8E68-D955-41FA-AEB3-46D318F02FA8 |
| 48 | OFF | 95 | 35811 | D2F37EDC-92C7-4CD2-BFE0-4CBC753375A6 |
| 48 | ON | 96 | 35812 | 54A7A62B-1E34-4EDC-9D22-F3FF2A6A5092 |
| 49 | OFF | 97 | 35813 | 983ED4A4-BA22-49E7-823F-908E2E55862F |
| 49 | ON | 98 | 35814 | C314B8D3-8AB1-4DF1-BAE1-5208FA50519B |
| 50 | OFF | 99 | 35815 | 102D0DA0-A69F-43A2-8587-79CB71D70240 |
| 50 | ON | 100 | 35816 | 1EC113C0-01E4-432C-B8FC-6366D66ADC16 |
| 51 | OFF | 101 | 35817 | C90CF08B-87F8-43E0-9C7B-81E5DB329A85 |
| 51 | ON | 102 | 35819 | 86966759-1ECB-46EF-900F-01D2D3A168BE |
| 52 | OFF | 103 | 35820 | 58DD9780-9226-4E5A-B2BA-4493DB06DF49 |
| 52 | ON | 104 | 35821 | F66A3B4C-6B47-4CBB-A6AA-6E5F40AAEB08 |
| 53 | OFF | 105 | 35822 | 94A11AC1-DDED-4014-AD4B-D909EB04CBFA |
| 53 | ON | 106 | 35823 | A5B56B9E-3098-483B-ADDB-03538D7EF336 |
| 54 | OFF | 107 | 35824 | 6507D92F-AC86-4BB7-9D5B-7E3671BDCCA4 |
| 54 | ON | 108 | 35825 | 32C613AD-7693-4B11-A507-3ABA8881F5B7 |
| 55 | OFF | 109 | 35826 | BDF72877-3ECD-431A-B076-09C5F1CDF4B0 |
| 55 | ON | 110 | 35828 | 9A195386-C21D-4863-99B3-829013BFCBD4 |
| 56 | OFF | 111 | 35829 | 9EBAC3F2-2142-4723-B352-5370E97A23F4 |
| 56 | ON | 112 | 35830 | 3EDCD601-7CEA-4FEE-8402-5C3EB6346B0D |
| 57 | OFF | 113 | 35831 | E0FD1691-86B9-46BA-8441-E3FA14D4A5B1 |
| 57 | ON | 114 | 35832 | 0624A2AE-08DF-44F9-9A7D-1E3FC84A64AA |
| 58 | OFF | 115 | 35833 | DDF9CA1A-EB69-41A7-88D2-E6954CCFB846 |
| 58 | ON | 116 | 35834 | A10CDE8F-0357-493A-A323-33CE54CC504A |
| 59 | OFF | 117 | 35835 | C0C8360E-2527-4048-BD3E-77768A657B1B |
| 59 | ON | 118 | 35836 | 5EDD54C9-2BB0-456C-8893-37A4E326D1CC |
| 60 | OFF | 119 | 35838 | 52EC971F-35CC-40D3-85BB-B57B40FE0D38 |
| 60 | ON | 120 | 35839 | D6D0C32C-4A44-4EB4-AA4E-3A4B253BD054 |
| 61 | OFF | 121 | 35840 | CBB317DC-99FF-4530-8FB4-324C51ED2BC7 |
| 61 | ON | 122 | 35841 | 36E739E4-F0D3-46ED-A2CB-D3DCECDD0289 |
| 62 | OFF | 123 | 35842 | 3A29422C-3D7C-4457-8DEC-F29688B60F03 |
| 62 | ON | 124 | 35843 | 0C218567-B25C-4FC6-BE4C-7649CBE9B0F2 |
| 63 | OFF | 125 | 35844 | 906A057A-E7CD-4756-80F5-3EA13B337A31 |
| 63 | ON | 126 | 35846 | 813F3B2D-F809-43C5-BB23-55CAEA15D13C |
| 64 | OFF | 127 | 35847 | 8638F536-6B4E-4790-B26C-070A4CD60F3A |
| 64 | ON | 128 | 35848 | B0748CDF-B7B8-4437-8B4D-5A748B163D1F |
| 65 | OFF | 129 | 35849 | B427CE40-3A9F-4E3F-8343-80E072643897 |
| 65 | ON | 130 | 35850 | 9C213788-0A3A-4626-AC75-A961E163C41B |
| 66 | OFF | 131 | 35851 | AC41DD48-72FC-4D35-AB20-2B03D019FBD8 |
| 66 | ON | 132 | 35853 | 12BEB4B6-71E4-47E4-8FB6-FEE3AE10ED1A |
| 67 | OFF | 133 | 35854 | 1A299E01-1959-4104-A32D-562D3DD83F31 |
| 67 | ON | 134 | 35855 | 2DEF96C6-F61F-4EB9-9E10-CE1D0E66043D |
| 68 | OFF | 135 | 35857 | 60B93F58-EB16-4948-99BA-E02A6DA02568 |
| 68 | ON | 136 | 35858 | 34EB1A56-128A-414F-AFBA-A53ECE8C9624 |
| 69 | OFF | 137 | 35859 | C2FE11BA-A30C-480E-9BD3-ED40A7B54C47 |
| 69 | ON | 138 | 35860 | 4D32F525-E3B3-4B19-B92C-099CA42972EF |
| 70 | OFF | 139 | 35861 | 8E565E24-6E92-48BC-81B7-5EC6DFF2FFF1 |
| 70 | ON | 140 | 35862 | F1F75EBB-C2EA-4967-8CC1-5178937C8A40 |
| 71 | OFF | 141 | 35863 | 4F1E601A-DEEB-4064-909D-65D8F60D9D17 |
| 71 | ON | 142 | 35864 | 5170EC68-4975-411C-AB1E-1048F473A216 |
| 72 | OFF | 143 | 35866 | 002639C3-97B4-4923-BE33-F788BBDFAC79 |
| 72 | ON | 144 | 35867 | 0CCF149F-9AC7-45F2-8102-BE3B66CD6E86 |
| 73 | OFF | 145 | 35868 | D6A9644D-CA15-4E5C-A2DF-AD49F3AF4D5D |
| 73 | ON | 146 | 35869 | 0FFF4EAF-A323-4F9E-9966-82A2AE44E523 |
| 74 | OFF | 147 | 35870 | C5FCF8E7-BF19-44D7-A948-F4F00B697E2A |
| 74 | ON | 148 | 35871 | 8CCAAA1F-C30D-4076-956E-813A903018E3 |
| 75 | OFF | 149 | 35872 | 3F44BBF6-22F3-43CC-8B87-F5E58C08B643 |
| 75 | ON | 150 | 35873 | 2E33A81D-37DC-43EE-9631-6EC9A33C9F18 |
| 76 | OFF | 151 | 35875 | A9E67729-D9F2-4C28-90DB-F7A5CEC5DC44 |
| 76 | ON | 152 | 35876 | E8981A8E-91D2-4369-8EDB-DCA5127CF2FA |
| 77 | OFF | 153 | 35877 | EF4DECBB-6957-4A52-A0EF-29CCF0B4BBC9 |
| 77 | ON | 154 | 35878 | A6A8A62D-EF82-48D5-A372-BF93D6662375 |
| 78 | OFF | 155 | 35879 | 9DB8AF97-7010-40C6-91E5-826D6F4597F1 |
| 78 | ON | 156 | 35880 | 81060C51-093D-4C0F-B41F-FFE5E74B72B2 |
| 79 | OFF | 157 | 35881 | 46E6444F-D0FA-4734-91DF-8AAA3EC908BF |
| 79 | ON | 158 | 35882 | E4573A93-024F-48DE-8A02-F818C5112135 |
| 80 | OFF | 159 | 35884 | 9C7028AD-8164-450D-B271-BD3D19E9B91D |
| 80 | ON | 160 | 35885 | 4E500A16-022D-45D7-88A6-7C7382ED3472 |
| 81 | OFF | 161 | 35886 | D236D70A-4F5F-4531-B083-AB3D00B3D015 |
| 81 | ON | 162 | 35887 | 3A5E51B8-2A3E-4C34-B4C9-9A42BC0E8E88 |
| 82 | OFF | 163 | 35888 | 2AC61BB2-C9FD-4288-9E21-024BCF3BF6EB |
| 82 | ON | 164 | 35889 | E7639C1D-9D17-445F-97F4-4E01C710ED1D |
| 83 | OFF | 165 | 35890 | 90699B68-619E-4079-BC57-1F0027DC24BE |
| 83 | ON | 166 | 35891 | 53156905-9E78-4481-8A85-C2C14CE093F0 |
| 84 | OFF | 167 | 35892 | 5AA5530D-2D5A-469D-BA53-12E3CB021E0C |
| 84 | ON | 168 | 35894 | 8E823368-A780-43FB-9462-6CAE39582A6E |
| 85 | OFF | 169 | 35895 | 7CF18091-7EE7-4497-ABB1-FE7EC88A3A02 |
| 85 | ON | 170 | 35896 | 3B791A2F-7C0C-4A2F-84A7-A0302EB83C45 |
| 86 | OFF | 171 | 35897 | 0FA4965E-67BF-4FE3-97EE-4B581E9588EC |
| 86 | ON | 172 | 35898 | 27D3DC96-1B69-4286-A25B-BDC790238AEE |
| 87 | OFF | 173 | 35899 | 17F63AB6-7992-4212-ACB7-4D86F52DC442 |
| 87 | ON | 174 | 35900 | 7D402CC8-5D28-45B3-A1F3-8AFA6DBFFCC9 |
| 88 | OFF | 175 | 35901 | 40020C68-E520-4365-BD98-81B04F942234 |
| 88 | ON | 176 | 35903 | 72CC0619-27E7-41AF-83A8-FBE8F0415780 |
| 89 | OFF | 177 | 35904 | 397903DB-ABD2-4B1F-952D-886431093340 |
| 89 | ON | 178 | 35905 | B30B6C73-9651-4CDF-9316-90E9637C8366 |
| 90 | OFF | 179 | 35906 | 6DF35C0E-D974-47C4-8B0B-B91314FC1034 |
| 90 | ON | 180 | 35907 | 25B7AF8B-F3F3-4547-B420-02FD23ADB998 |
| 91 | OFF | 181 | 35908 | 855AE949-FD92-41EE-9D05-4A5F23B12CFC |
| 91 | ON | 182 | 35909 | 40431920-C1F1-4426-938E-A8D343BCB445 |
| 92 | OFF | 183 | 35910 | 62BB46C6-E37F-4C94-ADA3-CD2CF6EBA79E |
| 92 | ON | 184 | 35912 | F144F932-1ED7-4849-9D97-6FF59A2C4FFF |
| 93 | OFF | 185 | 35913 | C2620FF8-BBC5-4E6B-B659-56945810D7E1 |
| 93 | ON | 186 | 35914 | 712BDC69-3C86-45B9-8BD2-7DA091BCA544 |
| 94 | OFF | 187 | 35915 | 059393BD-8219-4D31-B3A1-6311999D4F6D |
| 94 | ON | 188 | 35916 | 67BFA7B1-3303-4B94-984D-7F9E175DFB21 |
| 95 | OFF | 189 | 35917 | 3A73FB7D-0BA6-459B-8946-7066942FCCB4 |
| 95 | ON | 190 | 35918 | 0E2AF758-DA1A-49BF-AE8F-E680B746FEF6 |
| 96 | OFF | 191 | 35919 | E38912DC-CC87-4E9D-9705-7756EB3FAD4D |
| 96 | ON | 192 | 35920 | 80E54758-2AB6-4623-90D5-B483ECA1BA4C |
| 97 | OFF | 193 | 35922 | F5514A1C-FC2C-44BB-9B62-60D34E1BB29B |
| 97 | ON | 194 | 35923 | 86333118-6FCA-446D-A130-5AEF29B5D6A6 |
| 98 | OFF | 195 | 35924 | EA933910-2244-487C-880E-A88833BE2BE3 |
| 98 | ON | 196 | 35925 | 798DADF9-3E4B-4292-A2D8-C9E1874CDF39 |
| 99 | OFF | 197 | 35926 | D94EFAFC-08B4-4BEA-8873-89DFE0BC0067 |
| 99 | ON | 198 | 35927 | 02820526-62C3-4E86-931E-3AFC83DE16FF |
| 100 | OFF | 199 | 35928 | 2DA79B6D-ED3D-454B-A3A8-13951D1E2380 |
| 100 | ON | 200 | 35929 | EDC68C90-F368-4CC4-8AAD-FCF50F1F4618 |
