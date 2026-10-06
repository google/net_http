# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 87 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 52.087 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 52.901 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 51.606 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 52.864 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 52.526 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 52.844 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 51.897 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 52.045 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 52.917 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 51.220 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 52.278 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 50.809 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 50.542 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 52.404 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 52.904 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 51.847 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 50.725 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 51.516 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 52.836 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 51.144 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 51.753 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 50.782 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 52.859 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 51.196 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 51.655 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 50.872 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 52.759 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 52.940 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 51.920 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 51.203 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 51.166 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 50.776 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 50.449 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 51.290 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 52.187 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 51.244 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 52.424 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 51.987 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 50.992 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 50.525 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 50.762 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 52.163 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 52.068 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 52.828 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 51.293 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 51.688 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 52.884 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 52.145 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 52.880 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 52.055 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 53.242 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 51.318 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 50.839 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 51.071 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 50.413 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 53.043 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 52.254 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 51.791 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 52.810 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 51.008 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 50.898 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 50.321 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 51.215 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 52.569 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 50.624 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 50.425 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 50.569 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 53.032 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 51.693 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 50.462 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 51.572 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 52.850 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 51.707 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 50.750 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 50.424 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 53.060 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 50.994 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 50.787 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 50.767 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 52.868 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 51.688 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 52.862 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 50.982 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 51.905 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 52.863 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 51.070 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 51.088 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 50.263 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 50.490 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 50.807 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 53.043 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 50.885 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 51.842 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 51.913 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 52.908 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 50.849 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 50.954 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 52.040 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 52.193 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 52.885 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 52.607 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 52.132 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 51.918 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 52.804 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 52.927 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 52.906 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 52.495 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 52.863 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 52.866 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 50.554 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 52.088 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 52.848 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 51.858 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 51.604 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 52.874 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 51.025 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 50.516 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 51.940 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 52.895 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 52.896 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 52.873 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 50.999 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 52.091 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 51.191 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 51.432 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 52.083 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 52.780 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 51.603 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 53.044 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 51.574 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 51.672 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 51.647 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 52.664 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 51.675 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 50.866 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 51.114 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 51.115 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 51.099 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 52.099 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 50.996 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 51.661 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 53.049 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 52.626 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 52.267 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 50.855 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 51.595 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 52.262 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 52.871 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 52.874 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 50.375 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 51.897 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 50.858 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 51.043 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 51.685 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 53.046 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 52.845 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 52.872 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 51.205 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 52.211 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 52.857 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 50.824 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 52.077 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 52.142 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 51.666 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 50.955 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 50.811 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 52.349 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 51.476 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 52.585 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 51.841 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 50.856 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 50.474 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 51.594 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 52.246 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 51.424 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 50.308 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 52.395 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 51.216 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 52.109 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 52.885 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 51.514 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 50.838 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 52.178 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 52.860 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 52.090 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 50.978 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 52.441 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 52.199 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 52.390 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 51.548 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 52.281 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 52.869 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 52.555 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 52.482 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 51.757 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 52.904 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 50.789 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 52.155 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 50.766 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 52.871 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 50 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 1/100 ON trials. Of those trials, 1 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 87. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

