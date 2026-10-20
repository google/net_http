# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 37.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 103.504 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 103.707 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 103.655 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 102.225 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 101.493 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 102.485 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 101.457 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 103.127 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 104.447 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 103.982 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 104.024 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 102.888 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 105.024 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 102.090 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 104.931 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 100.456 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 103.684 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 101.875 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 103.641 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 103.626 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 102.258 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 102.097 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 101.014 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 104.572 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 100.712 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 104.471 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 102.241 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 102.173 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 105.411 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 104.884 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 105.059 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 100.784 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 105.040 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 100.496 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 102.637 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 100.878 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 103.486 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 105.305 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 100.832 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 105.428 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 102.170 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 103.427 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 103.257 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 103.946 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 104.098 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 103.810 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 105.404 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 101.002 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 103.847 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 103.899 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 102.702 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 103.524 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 101.997 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 104.133 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 103.608 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 104.426 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 101.706 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 104.173 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 101.734 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 102.207 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 100.675 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 105.407 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 104.185 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 101.361 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 100.604 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 100.797 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 105.399 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 102.114 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 103.170 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 100.725 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 105.399 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 103.318 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 105.485 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 101.843 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 103.530 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 101.167 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 102.047 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 102.584 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 100.946 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 103.882 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 100.680 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 104.619 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 104.248 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 102.587 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 105.018 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 103.122 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 103.913 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 100.954 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 105.400 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 103.885 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 101.179 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 102.872 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 102.164 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 103.756 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 100.608 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 103.464 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 104.396 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 103.690 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 104.746 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 103.631 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 105.398 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 102.893 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 102.134 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 102.135 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 104.888 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 101.501 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 103.986 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 103.539 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 104.507 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 103.392 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 101.966 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 105.400 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 103.036 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 103.966 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 103.039 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 102.097 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 103.463 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 101.254 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 101.640 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 104.109 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 105.317 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 102.111 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 104.259 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 104.787 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 101.019 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 104.535 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 103.089 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 101.228 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 101.067 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 104.496 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 102.675 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 100.887 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 103.105 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 104.689 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 103.729 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 103.680 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 103.314 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 105.202 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 102.581 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 102.157 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 102.271 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 104.317 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 101.818 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 103.944 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 104.895 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 103.867 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 103.277 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 103.047 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 104.805 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 102.032 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 103.717 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 102.488 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 100.623 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 104.565 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 103.238 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 102.524 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 103.832 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 103.273 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 102.985 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 100.644 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 105.413 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 105.435 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 100.742 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 103.171 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 104.246 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 102.160 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 104.358 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 101.683 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 103.551 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 100.694 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 102.036 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 103.765 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 102.113 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 103.857 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 104.341 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 102.194 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 103.309 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 104.432 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 104.897 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 104.380 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 105.426 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 100.992 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 101.455 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 103.654 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 104.117 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 105.327 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 105.413 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 102.812 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 103.518 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 103.819 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 101.566 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 104.427 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 105.004 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 103.107 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 105.212 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 103.623 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 102.918 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 103.673 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 103.882 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 103.797 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 100 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/100 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

