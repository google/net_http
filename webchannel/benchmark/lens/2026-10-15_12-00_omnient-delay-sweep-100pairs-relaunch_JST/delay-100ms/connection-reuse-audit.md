# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 22.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 23.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 26.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 50.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 41.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 400 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 46.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 35.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 102.756 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 102.963 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 102.765 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 100.946 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 102.989 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 104.427 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 102.234 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 103.009 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 100.400 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 101.804 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 102.032 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 101.770 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 101.596 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 103.823 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 104.697 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 101.734 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 103.553 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 105.346 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 105.256 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 101.799 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 103.111 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 101.040 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 100.541 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 101.024 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 101.039 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 102.938 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 104.433 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 103.801 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 104.850 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 100.549 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 103.528 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 104.027 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 101.436 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 104.148 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 103.872 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 102.876 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 104.666 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 103.463 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 100.883 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 102.079 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 102.694 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 104.151 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 101.340 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 101.521 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 101.803 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 105.371 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 100.700 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 103.683 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 100.773 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 100.375 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 102.123 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 101.712 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 103.634 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 101.381 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 105.114 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 100.302 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 102.837 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 103.752 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 101.600 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 103.956 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 105.370 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 105.036 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 103.856 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 104.757 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 101.144 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 103.749 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 102.200 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 101.997 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 100.780 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 103.765 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 101.452 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 103.488 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 103.722 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 105.377 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 103.751 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 102.840 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 105.023 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 102.446 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 100.533 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 101.058 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 101.483 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 105.053 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 105.218 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 102.447 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 104.203 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 101.194 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 103.709 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 102.953 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 105.105 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 103.289 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 103.500 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 102.268 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 103.529 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 102.850 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 103.701 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 101.984 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 100.953 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 103.465 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 102.573 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 103.865 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 103.781 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 101.542 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 101.215 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 104.604 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 100.917 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 102.938 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 103.178 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 103.308 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 101.594 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 104.361 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 101.049 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 104.898 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 101.932 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 103.930 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 103.546 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 102.497 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 103.472 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 103.129 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 102.656 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 101.427 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 104.112 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 102.432 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 103.055 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 105.114 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 100.550 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 101.807 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 100.962 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 100.881 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 103.116 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 102.735 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 103.138 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 103.358 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 103.511 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 103.347 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 105.064 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 104.391 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 104.113 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 102.992 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 101.240 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 101.947 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 104.331 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 103.995 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 107.278 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 104.764 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 102.186 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 102.566 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 101.664 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 104.727 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 102.598 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 105.449 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 101.939 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 105.358 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 100.919 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 101.327 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 102.472 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 102.295 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 101.014 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 102.146 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 104.606 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 101.402 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 102.445 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 103.922 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 105.258 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 101.070 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 103.895 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 101.108 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 103.071 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 102.215 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 102.308 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 103.488 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 103.627 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 101.047 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 100.873 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 104.514 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 105.133 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 102.675 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 103.515 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 102.959 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 103.762 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 103.158 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 105.076 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 103.233 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 102.615 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 102.977 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 100.457 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 104.665 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 104.762 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 105.295 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 102.032 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 109.943 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 105.241 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 101.450 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 105.370 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 103.691 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 103.637 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 101.797 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 102.183 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 102.326 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 102.416 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 102.405 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 100 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 2/100 ON trials. Of those trials, 2 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 64, 67. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 35478 | 381FD12D-83C2-472B-BE13-8E2FEE443D04 |
| 1 | ON | 2 | 35479 | 11D4EDAD-B343-46A5-AD73-10DBEA62FB84 |
| 2 | OFF | 3 | 35481 | 9BBF0E3E-B039-41F0-9FDC-8C5A3113D57B |
| 2 | ON | 4 | 35482 | EF877AB0-59A9-4811-9D71-7CBF5FEFED45 |
| 3 | OFF | 5 | 35483 | 4683E2B6-6EA3-4244-BC57-13E949242F22 |
| 3 | ON | 6 | 35484 | 571F4330-C609-4D77-B879-E29887CD4BC4 |
| 4 | OFF | 7 | 35485 | 30D21452-49FE-40B3-8B4B-83623B043AE9 |
| 4 | ON | 8 | 35486 | F199F5D1-D83F-4AB8-BF40-17506D75702A |
| 5 | OFF | 9 | 35487 | 9B300A6F-1BD9-4A7A-ACFB-48C96CF96783 |
| 5 | ON | 10 | 35488 | AE974715-F4E0-4AE5-A2C1-8B1224670053 |
| 6 | OFF | 11 | 35490 | 7F5A84BE-CA67-4623-9808-9CF3FD965D26 |
| 6 | ON | 12 | 35491 | 4564BCA9-CA44-43B2-93EF-B0DBDF44B2ED |
| 7 | OFF | 13 | 35492 | F476E9EB-223E-42B6-8343-C5D68DED0EF5 |
| 7 | ON | 14 | 35493 | AB89C9D5-EB4C-4D9F-B80F-E5874C18EA12 |
| 8 | OFF | 15 | 35494 | 844C95E0-79AA-4B46-9639-8C69BBB9A79A |
| 8 | ON | 16 | 35495 | 4D644A1A-24DA-4AEE-90C9-4DF28DAEBF4F |
| 9 | OFF | 17 | 35496 | 2E6ED35B-517C-422F-8C7C-38D2593B7A31 |
| 9 | ON | 18 | 35497 | 4AACB2EE-6289-459A-ACF0-FF977DCB7208 |
| 10 | OFF | 19 | 35498 | EFD81532-5B04-4B6C-AAAF-34B8972432EE |
| 10 | ON | 20 | 35500 | 1FDA860B-E543-4C7B-B276-9E7AFBD4111E |
| 11 | OFF | 21 | 35501 | 21248B59-CB23-43BE-B355-4DC8401CBE47 |
| 11 | ON | 22 | 35502 | A39C8B02-1865-4E72-A181-956091FF7282 |
| 12 | OFF | 23 | 35503 | EA4F9737-58BC-4233-91FA-83F9EF7BA2C7 |
| 12 | ON | 24 | 35504 | AD120061-4A1D-4C8E-8A26-E7B81F598D49 |
| 13 | OFF | 25 | 35505 | BF6171E3-26AA-4E66-8AB2-E92A995B8C2C |
| 13 | ON | 26 | 35506 | 1784B302-839A-4812-BD43-BB59F950977C |
| 14 | OFF | 27 | 35507 | 5486C5D0-640E-4AB4-9DE1-A5EBA81E960A |
| 14 | ON | 28 | 35509 | 17EB25E5-55BB-4F5F-8EFB-E76FE4827928 |
| 15 | OFF | 29 | 35510 | 02A54537-24BA-422C-99A7-CF010EEA5679 |
| 15 | ON | 30 | 35511 | 31A80059-4461-49BF-A28D-F1FEBC32E4B5 |
| 16 | OFF | 31 | 35512 | 5FA68AD2-1D58-49BC-8929-3C9D5CEAA3B4 |
| 16 | ON | 32 | 35513 | 93F12C09-A759-4C2D-ADC0-A6C043249EF6 |
| 17 | OFF | 33 | 35514 | 20EC5009-1A42-46F4-AC6C-6CA78694E4A5 |
| 17 | ON | 34 | 35515 | 609ABE1D-1062-4DE5-9F72-EE38CC6AC00B |
| 18 | OFF | 35 | 35516 | 3972D81B-2D4F-4646-843A-88F65B84DC57 |
| 18 | ON | 36 | 35517 | 4043DB60-09FB-4F7D-9732-FE7A8FDC083A |
| 19 | OFF | 37 | 35519 | 77883615-EA72-4337-8223-C2A7A4C5F715 |
| 19 | ON | 38 | 35520 | 62EDEA34-CF7D-403C-B9E7-43F16F7B7DAC |
| 20 | OFF | 39 | 35521 | 78353399-BA1C-40BC-BAB4-3556B5376AC2 |
| 20 | ON | 40 | 35522 | 49D2DF62-B544-4DD0-8439-19B2F3D9D439 |
| 21 | OFF | 41 | 35523 | 3B3F1782-FA64-458D-A640-DD2F825DAB4A |
| 21 | ON | 42 | 35524 | 1559A867-A32B-4818-A4D4-C880164F8346 |
| 22 | OFF | 43 | 35525 | 934C4125-D6B6-410F-9E51-C37B069270E1 |
| 22 | ON | 44 | 35526 | 9F8EADE2-BF79-4C6B-8CF2-49B9ABB6BA43 |
| 23 | OFF | 45 | 35528 | 92B61F0C-9D41-4E9D-BFEE-087311512669 |
| 23 | ON | 46 | 35529 | CD10F727-8962-452F-BAB6-CF45AB1632F8 |
| 24 | OFF | 47 | 35530 | 6F0F5BAB-B1E5-46B2-BE7B-7586652DD9A7 |
| 24 | ON | 48 | 35531 | D6B3217F-77A4-4B77-8502-CBB2EC8465E0 |
| 25 | OFF | 49 | 35532 | 4FC41D6C-7A40-4D95-8AF2-FB9C2E3BDD52 |
| 25 | ON | 50 | 35533 | D33A4A68-07B7-4120-A082-7948E2110EDF |
| 26 | OFF | 51 | 35534 | 18AA19E4-D859-44CD-8C4E-78A5A980A442 |
| 26 | ON | 52 | 35535 | 0A160645-7360-497F-B46D-51B499A94BA3 |
| 27 | OFF | 53 | 35536 | AD5B1C91-3749-426D-B57B-C83C102CB902 |
| 27 | ON | 54 | 35538 | F8F12636-0B0F-4C89-83AC-1C1B20CE4965 |
| 28 | OFF | 55 | 35539 | 269EAFA1-625B-46D6-8971-93A303290146 |
| 28 | ON | 56 | 35540 | 0F571C2A-C380-4EFE-BD2E-D337EE98C102 |
| 29 | OFF | 57 | 35541 | 6540E802-7270-409E-8FB8-A428F4F2BBD0 |
| 29 | ON | 58 | 35542 | 76549579-EE03-4468-8F5F-738549AC3671 |
| 30 | OFF | 59 | 35543 | E66EBB18-8FA6-4D36-93A0-95645A3545B3 |
| 30 | ON | 60 | 35544 | 43C6EB6F-32DF-481B-9DBF-F4C5312557B6 |
| 31 | OFF | 61 | 35545 | A29DD08B-81D8-4DC8-B3A6-F8F8E459C1C8 |
| 31 | ON | 62 | 35547 | ACF69816-32C2-45D4-8AA8-EE1BD253F6DC |
| 32 | OFF | 63 | 35548 | 468C1048-FC3E-47A3-AD77-70D34E3F807A |
| 32 | ON | 64 | 35549 | AF049A79-5C22-42A4-818B-8A1CEE19467D |
| 33 | OFF | 65 | 35550 | 236AC77E-16B2-4924-8016-213054C28AEC |
| 33 | ON | 66 | 35551 | 9406C874-C074-4434-BE8C-272710B06D52 |
| 34 | OFF | 67 | 35552 | 55CBED75-5409-4B3B-B9DA-0F7DD4BF4558 |
| 34 | ON | 68 | 35553 | D1922961-AC3E-43B0-B3AE-19A1F440EDB2 |
| 35 | OFF | 69 | 35554 | 10890491-C325-43B7-8950-DBAAB97317F8 |
| 35 | ON | 70 | 35555 | 3B928AAB-18A3-4B8E-9AE8-6BD84EDAE439 |
| 36 | OFF | 71 | 35557 | CA2B5296-9BF1-4C91-946E-9962488144AB |
| 36 | ON | 72 | 35558 | 3F6A4545-B3C7-4DC1-B334-8394F4ABBEA5 |
| 37 | OFF | 73 | 35559 | C547E822-7B22-411E-AAAF-C2EB9960B101 |
| 37 | ON | 74 | 35560 | 627BBF53-9C52-4C80-BA99-68B8121FF3B5 |
| 38 | OFF | 75 | 35561 | 6174A93C-4E79-4504-A8B4-5F3DF3097E49 |
| 38 | ON | 76 | 35562 | 53B4954B-1C00-4EB7-84EC-9106B9F7392E |
| 39 | OFF | 77 | 35563 | C091707C-0579-48AD-A946-79A4B7D62C4F |
| 39 | ON | 78 | 35564 | C1450811-4D73-46B6-9AEE-B202B73C525B |
| 40 | OFF | 79 | 35566 | A8767579-57A8-4643-81E4-69E311DB724D |
| 40 | ON | 80 | 35567 | 650EE35A-442F-4090-B393-9AA05652C1E0 |
| 41 | OFF | 81 | 35568 | F8128052-B37A-4A69-9C7F-16AA539D0449 |
| 41 | ON | 82 | 35569 | 713B11B5-B83E-4284-A14E-01F5CB0C992A |
| 42 | OFF | 83 | 35570 | E073A5CB-5819-41E1-B90E-93037FFA4D8B |
| 42 | ON | 84 | 35571 | B92A9772-277E-4E6F-8627-4EEF4C5E6C35 |
| 43 | OFF | 85 | 35572 | 54433730-9876-4FA6-B79F-C38435B9BDFF |
| 43 | ON | 86 | 35573 | 67D8925C-E67E-471C-AD33-7FA315B808DD |
| 44 | OFF | 87 | 35574 | FEA927A9-D33D-4978-9901-EF0A91DB530E |
| 44 | ON | 88 | 35576 | 7A8CABE4-CB9F-4D9A-A414-9F0252A04C09 |
| 45 | OFF | 89 | 35577 | 877C4EA8-C58C-46F5-B54F-6011AF6FA2D0 |
| 45 | ON | 90 | 35578 | F32CBA84-39F9-4368-AB51-77B2BD851BC1 |
| 46 | OFF | 91 | 35579 | FDC97044-70FF-4E37-99D1-011F21972CF9 |
| 46 | ON | 92 | 35580 | D571A102-6D08-4BA2-B86D-BBB5E7F09E61 |
| 47 | OFF | 93 | 35581 | 99096162-E709-499E-8E6C-7BC318D7933D |
| 47 | ON | 94 | 35582 | B00E5872-F874-4AFA-B0C7-B00D5638A0A9 |
| 48 | OFF | 95 | 35583 | 0C35C043-434E-4FE2-9034-A82F834FA8E0 |
| 48 | ON | 96 | 35585 | 9300B747-1146-4758-9F96-D4CE1EAD9199 |
| 49 | OFF | 97 | 35586 | 49AF6F81-3A7F-4FED-A836-50735789B6B3 |
| 49 | ON | 98 | 35587 | 8725AC33-A8FA-4372-802E-FE2F5C469950 |
| 50 | OFF | 99 | 35588 | 72A3DEF0-44A4-4264-B365-4C34195AB4BF |
| 50 | ON | 100 | 35589 | ADD0ECEC-9865-479D-9D34-CACDB3599ECC |
| 51 | OFF | 101 | 35590 | AE3D22CF-B4AE-4A24-A538-1658DE312717 |
| 51 | ON | 102 | 35591 | DFA43440-4AFA-49B7-9387-6BAD33CFE944 |
| 52 | OFF | 103 | 35592 | EFFAD47F-6C4F-4F20-9210-C36E4F66E62E |
| 52 | ON | 104 | 35593 | 5E8C2CA5-9F56-435A-92D3-8DEC58E0045D |
| 53 | OFF | 105 | 35595 | FA128942-F34C-4ED4-8364-47C680382DCF |
| 53 | ON | 106 | 35596 | 6F1788C9-00EC-48B3-9C89-FCCCCD655AD9 |
| 54 | OFF | 107 | 35597 | D3E6DEC8-7E3B-48A1-AECE-0552BECCB1A9 |
| 54 | ON | 108 | 35598 | 938B467A-3201-4C1C-B66C-725B5236948D |
| 55 | OFF | 109 | 35599 | 79A24E21-FDDE-48CC-9C60-14EDFB93BC85 |
| 55 | ON | 110 | 35600 | 7D8B5347-0C61-4999-A0F6-91B02205E0EF |
| 56 | OFF | 111 | 35601 | 71C861A1-7658-4200-A9E6-B175018F8C4D |
| 56 | ON | 112 | 35602 | 0AACC084-0B85-4005-9086-30384CB0299E |
| 57 | OFF | 113 | 35604 | 0A2636E6-C452-43F0-BFDC-F603E0CBCD3F |
| 57 | ON | 114 | 35605 | 3C191813-AED4-4FE7-AB56-02708E2A054A |
| 58 | OFF | 115 | 35606 | 58E01CF3-8C81-4356-9CB2-D43C967D53A5 |
| 58 | ON | 116 | 35607 | B6ED2600-E60F-4D40-A7C1-CC1A58BE431A |
| 59 | OFF | 117 | 35608 | 1CC73A4E-FAAB-4AC4-99F1-DC73804D2C52 |
| 59 | ON | 118 | 35609 | 3C8A7EFF-55CC-4B74-A5E1-493841D15E57 |
| 60 | OFF | 119 | 35610 | 87D6E2DD-136F-43B6-9609-5C5F12092D7F |
| 60 | ON | 120 | 35611 | 939402EF-E386-437A-8396-1097B9C94621 |
| 61 | OFF | 121 | 35613 | A2599C84-7D81-4EED-9A3A-542FE1336234 |
| 61 | ON | 122 | 35614 | 14BB8DEB-E7C2-4096-A297-52EB7E36EEA4 |
| 62 | OFF | 123 | 35615 | 7D459461-6F0B-4C12-9DB1-C72D4CA1940F |
| 62 | ON | 124 | 35616 | 94B07FF6-6DAC-4B20-AFF3-0B35B19C04F5 |
| 63 | OFF | 125 | 35617 | FAF16ECE-558D-4615-87AC-0CE22E273A59 |
| 63 | ON | 126 | 35618 | 3C8CDB7F-3E6F-4DF7-A096-EEDB36DB9B00 |
| 64 | OFF | 127 | 35619 | 52839B7C-476C-4E39-86A0-CB8717FE9D5D |
| 64 | ON | 128 | 35620 | FEF94442-2266-446E-B251-A0755237A0A5 |
| 65 | OFF | 129 | 35622 | 35B95713-46C2-47FD-8FB5-540B9C6AA96B |
| 65 | ON | 130 | 35623 | 295C41AA-5BA2-44A6-A628-AC8AAE0C4CAF |
| 66 | OFF | 131 | 35624 | 92B82F0F-1B79-4849-BE88-0FC6C3AEA97E |
| 66 | ON | 132 | 35625 | ADF4A357-7D39-4661-AB81-72950D281B3F |
| 67 | OFF | 133 | 35626 | CB67CBED-0CBC-465D-8691-4ADFF3FF3DA5 |
| 67 | ON | 134 | 35627 | 2AF7A477-9B9D-4B05-BC78-524A2FDE4F8E |
| 68 | OFF | 135 | 35628 | 95DC8239-C407-492F-BE59-9079ECE3F7BE |
| 68 | ON | 136 | 35629 | 168C7E8F-CF8C-4386-942D-6AF0CEBDC625 |
| 69 | OFF | 137 | 35631 | 5CB9D7A7-23FC-43FB-A288-A42B20C808C0 |
| 69 | ON | 138 | 35632 | 4356EBC3-9E85-4B09-BB53-B63FEF62C731 |
| 70 | OFF | 139 | 35633 | 228C227E-6CE5-4A39-8C5E-E59E94B88946 |
| 70 | ON | 140 | 35634 | 12166894-444B-46F9-A762-878BCDD58F4E |
| 71 | OFF | 141 | 35635 | 6EDFC34B-0B33-488C-8BBD-FD6253836415 |
| 71 | ON | 142 | 35636 | F6CC9948-4922-496C-9E96-4241F6683A8C |
| 72 | OFF | 143 | 35637 | 84B4415B-9ED2-49D9-9CD2-9FB29D213CAD |
| 72 | ON | 144 | 35639 | F433626A-6ED0-4900-8A3C-094D9EBB5C0D |
| 73 | OFF | 145 | 35641 | A0674FC9-2988-4ABE-BE19-583E0E38A639 |
| 73 | ON | 146 | 35642 | 7AC3A3CE-F879-4CFF-B8EB-42BACB988D9F |
| 74 | OFF | 147 | 35643 | FCF31B1A-AAE2-4EB0-A225-CD4BB1E03D74 |
| 74 | ON | 148 | 35644 | 703311F0-DA0D-42F9-8BD2-769765E0DEF4 |
| 75 | OFF | 149 | 35645 | 10C792C3-D0AC-4AF1-87BB-FA0D288BDE59 |
| 75 | ON | 150 | 35646 | 55CF192E-8979-4F92-958B-D39E5F57078E |
| 76 | OFF | 151 | 35647 | 3C2E79D7-11B3-4370-8040-9B5B73864F2E |
| 76 | ON | 152 | 35648 | C2305A0E-DABA-4BA0-AABB-5E67879B56A1 |
| 77 | OFF | 153 | 35650 | 55C5E1E8-B29A-43A6-9130-3529BB0D5513 |
| 77 | ON | 154 | 35651 | 0D0CDE0A-ED97-44D2-AA45-F60EE7D79268 |
| 78 | OFF | 155 | 35652 | ADBB7FA3-4293-4605-BF1F-D3E006C5C8F0 |
| 78 | ON | 156 | 35653 | 6EFEC6A1-C45C-4005-BC68-F201A1E10AC4 |
| 79 | OFF | 157 | 35654 | A9663BB4-FB73-4EFC-8E75-18FE6BE0B44B |
| 79 | ON | 158 | 35655 | DB4E6B22-F68F-4CDE-B091-AA693553D75F |
| 80 | OFF | 159 | 35656 | BE1B001E-93DA-4DD6-A679-EBDD4A51292E |
| 80 | ON | 160 | 35658 | D6B60B21-63A2-4E9A-ACFE-3845E2072E17 |
| 81 | OFF | 161 | 35659 | A284C77E-F2C4-495F-A7B2-492FDF8E3021 |
| 81 | ON | 162 | 35660 | 93EAB86D-045B-406F-AA23-1E7D84D9DE62 |
| 82 | OFF | 163 | 35661 | 2450F1E0-4F0B-4F4B-9B41-04B9E18A02DD |
| 82 | ON | 164 | 35662 | 657FA228-67A0-4E90-B178-49C437B0FB91 |
| 83 | OFF | 165 | 35663 | 2575ACAA-B84F-4982-A8EC-81736FF6C8E7 |
| 83 | ON | 166 | 35664 | A7092AE4-0117-4932-AB2B-212716B575F5 |
| 84 | OFF | 167 | 35665 | 305AF697-648E-4C07-9C4C-C271E068C2D2 |
| 84 | ON | 168 | 35666 | 785D9C2B-39E2-4C56-81AD-88A58ED629A1 |
| 85 | OFF | 169 | 35668 | D2166CC5-DCF3-40E3-B4DB-A85B6103C6BC |
| 85 | ON | 170 | 35669 | 5E6FA0FD-80DB-4A74-A96F-4A3B450D79B1 |
| 86 | OFF | 171 | 35670 | 24B933E5-91B8-4E61-B50F-7232392BC3F6 |
| 86 | ON | 172 | 35671 | 03CBB9F8-12BD-471F-8D6D-52978E09DB3E |
| 87 | OFF | 173 | 35672 | EF9E572C-0064-4254-9C25-F137DEFF9A93 |
| 87 | ON | 174 | 35673 | AFDAB28C-753E-4F48-AD7C-4CF7CE90FD9D |
| 88 | OFF | 175 | 35674 | 3234E0CD-3E56-405D-9CBF-7BB9F18F9457 |
| 88 | ON | 176 | 35675 | B99592F0-64F5-4DC1-9B37-78428F96496B |
| 89 | OFF | 177 | 35677 | 9D57056B-650B-4CC4-8C14-680472CDC9EB |
| 89 | ON | 178 | 35678 | 8CC80404-888D-46B0-BF13-9B2EFE4C481F |
| 90 | OFF | 179 | 35679 | 638616A9-FF9D-4C8D-AF97-8528C99C717E |
| 90 | ON | 180 | 35680 | 6F30AF18-9437-4C90-884D-04FCED84BC6A |
| 91 | OFF | 181 | 35681 | D9FEBF3A-F447-4C40-9D89-466A950E0A3C |
| 91 | ON | 182 | 35682 | A3C2D04A-4E15-4223-9B98-09314E6A83E0 |
| 92 | OFF | 183 | 35683 | B66EC2E9-3F41-4CB5-8CEB-BDC0E9B5A131 |
| 92 | ON | 184 | 35684 | 1A4FCB98-6155-45CA-AE2D-6FFDA6BAC5B6 |
| 93 | OFF | 185 | 35685 | 6CDE48A2-AE43-4F11-8A68-0D821CD680D6 |
| 93 | ON | 186 | 35687 | 165F72F1-3770-4797-8C55-A60695FE2FC4 |
| 94 | OFF | 187 | 35688 | 327FE815-5B42-48F0-A1A6-C0E5B0289502 |
| 94 | ON | 188 | 35689 | 6DCF2F46-EC59-45BF-B1AA-BEF241C6D355 |
| 95 | OFF | 189 | 35690 | C1C200E4-D5C2-48C7-8FE3-A7A5595F9AAA |
| 95 | ON | 190 | 35691 | 22A7AAB5-6E97-4F6F-BD6C-8D84A1815BA2 |
| 96 | OFF | 191 | 35692 | 4113985C-8F22-415F-8065-F37A01136870 |
| 96 | ON | 192 | 35693 | A9E7F021-C872-4DB6-8DCB-700EC226B05F |
| 97 | OFF | 193 | 35694 | 7FCE1665-2BAF-4791-A5EB-B688CEF995E5 |
| 97 | ON | 194 | 35696 | A3D80928-9715-4406-96F0-793C07147B26 |
| 98 | OFF | 195 | 35697 | 481CC64F-9D90-4887-B5E7-E86E648EB0DE |
| 98 | ON | 196 | 35698 | 69EDB2FF-ABA5-4E0E-9313-F41B4A5666E3 |
| 99 | OFF | 197 | 35699 | EC0B4C62-4869-4671-896A-9D33E387A849 |
| 99 | ON | 198 | 35700 | 298F9B69-858D-4BC1-8A33-743F7CE63061 |
| 100 | OFF | 199 | 35701 | 849D3024-67AB-4D30-83AF-980D087992D6 |
| 100 | ON | 200 | 35702 | B03A6FD5-BE2C-4F30-BBE7-A0F7C469CBBD |
