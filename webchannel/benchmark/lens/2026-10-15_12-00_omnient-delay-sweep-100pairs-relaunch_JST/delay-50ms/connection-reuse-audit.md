# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c01b::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c01b::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 16 | ON | completed | 400 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c01b::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c01b::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 28.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 34.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 25.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 53.033 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 52.213 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 52.848 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 53.034 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 53.041 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 52.340 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 51.624 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 52.878 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 53.065 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 51.640 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 53.043 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 52.870 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 52.873 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 53.049 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 52.883 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 51.411 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 53.041 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 53.036 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 52.913 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 53.043 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 52.403 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 52.846 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 52.862 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 50.439 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 51.942 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 52.849 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 52.458 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 52.870 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 52.383 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 52.171 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 52.874 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 52.936 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 52.415 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 52.454 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 51.325 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 51.069 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 52.063 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 53.052 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 51.034 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 51.568 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 52.894 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 52.882 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 52.421 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 52.268 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 52.880 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 52.991 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 50.868 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 52.520 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 53.036 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 52.878 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 52.254 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 52.869 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 52.903 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 53.053 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 52.855 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 52.896 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 51.649 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 52.270 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 52.143 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 51.867 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 50.771 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 50.758 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 50.834 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 52.899 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 53.033 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 52.456 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 52.431 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 52.848 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 51.479 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 53.044 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 50.721 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 52.319 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 50.552 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 52.298 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 50.755 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 52.982 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 52.219 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 52.412 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 52.275 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 51.691 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 50.687 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 52.845 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 51.194 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 52.889 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 51.622 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 52.611 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 52.386 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 50.379 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 51.498 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 53.046 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 52.881 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 52.343 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 51.771 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 52.373 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 52.882 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 51.537 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 52.678 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 52.944 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 51.886 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 52.510 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 52.919 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 51.078 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 51.516 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 53.048 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 51.146 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 52.046 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 50.551 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 52.246 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 52.912 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 52.620 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 50.604 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 52.169 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 52.927 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 52.376 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 52.846 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 53.047 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 51.361 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 51.295 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 53.036 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 50.583 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 50.768 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 51.080 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 51.489 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 50.665 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 52.411 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 52.508 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 52.541 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 52.356 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 52.201 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 52.871 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 52.631 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 52.724 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 51.322 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 52.678 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 52.809 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 51.457 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 51.034 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 51.182 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 52.737 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 52.247 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 51.817 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 52.300 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 53.041 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 51.419 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 52.864 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 51.332 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 52.896 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 52.505 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 52.686 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 52.875 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 52.919 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 52.186 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 51.959 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 53.045 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 52.682 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 52.686 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 52.356 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 52.252 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 52.926 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 51.249 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 52.858 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 50.359 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 51.327 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 51.085 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 51.929 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 50.953 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 52.915 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 52.092 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 51.194 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 53.031 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 51.222 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 52.447 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 53.066 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 52.260 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 52.536 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 52.803 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 51.921 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 52.930 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 52.880 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 50.965 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 52.848 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 52.428 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 50.673 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 53.029 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 52.586 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 52.932 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 52.862 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 51.492 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 52.868 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 51.322 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 51.164 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 52.853 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 52.351 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 53.029 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 51.780 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 52.881 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 53.036 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 53.030 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 52.897 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 52.864 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 50 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 2/100 ON trials. Of those trials, 2 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 16, 100. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 35254 | ABBA57BA-9638-45C0-9D9C-71C46B520F48 |
| 1 | ON | 2 | 35255 | 01E791C4-6F1E-4A3A-9CDA-19F1FBD85D2A |
| 2 | OFF | 3 | 35256 | 1BFC51CF-35D6-44B4-9A90-0DBC1AF49F92 |
| 2 | ON | 4 | 35257 | AC855FFD-02CF-4372-AACE-44317A9BF333 |
| 3 | OFF | 5 | 35258 | 8913F288-AC4A-499E-BF2E-A04B98805D61 |
| 3 | ON | 6 | 35259 | 9B8532E7-60FA-4AA5-BAB0-8CC4A97773B4 |
| 4 | OFF | 7 | 35260 | 75E99D5E-C18C-4FBF-8CC1-0132D2265655 |
| 4 | ON | 8 | 35261 | 0EE1E41F-EA0C-4DD4-AF3D-916862DFE352 |
| 5 | OFF | 9 | 35263 | 1B17EBAF-C7AF-4779-A6E6-031755381B89 |
| 5 | ON | 10 | 35264 | 1A043F64-F093-4235-AE18-24DBD69B5E61 |
| 6 | OFF | 11 | 35265 | 66C803E9-3F0D-4CFF-A1E6-F1696B2B4D7A |
| 6 | ON | 12 | 35266 | 3E9683DC-086F-4BAC-AD17-181EE96418A2 |
| 7 | OFF | 13 | 35267 | AA4B6DDC-489F-4A9E-9C5C-3CD4C4B1F90A |
| 7 | ON | 14 | 35268 | B28A387D-8ED2-4D6A-B5D5-926D1F495E0B |
| 8 | OFF | 15 | 35269 | 934CF7A8-A989-417B-8570-CD6E03386706 |
| 8 | ON | 16 | 35270 | 397F9348-CF33-466A-92D1-D491031CB1A2 |
| 9 | OFF | 17 | 35271 | 60C3ED3C-7FAF-4CEC-B1E1-FC7492516339 |
| 9 | ON | 18 | 35273 | FE193A39-8808-4154-A8EF-E443B2D291BF |
| 10 | OFF | 19 | 35274 | CA8BB0B3-E808-4888-BDC7-F900E8AA8BBC |
| 10 | ON | 20 | 35275 | 8617E227-8D17-4901-A526-C13907C89961 |
| 11 | OFF | 21 | 35276 | F70F7FD6-335A-4F36-99EA-9230599917C9 |
| 11 | ON | 22 | 35277 | D4B68FA5-2248-4DC2-BE31-154E5AEB1E37 |
| 12 | OFF | 23 | 35278 | 4C9265CF-6B93-497F-8530-D27509BAFBB8 |
| 12 | ON | 24 | 35279 | 233C4F6C-B397-4680-996F-86632B148A66 |
| 13 | OFF | 25 | 35280 | 70A9FDDA-7D13-40DB-9E07-125B1835DD71 |
| 13 | ON | 26 | 35281 | 9E748CCE-6D85-46A7-B4B9-06D331277399 |
| 14 | OFF | 27 | 35283 | 461A16C3-BE8C-4D34-95F0-AA29E63E937A |
| 14 | ON | 28 | 35284 | 97F37595-98A7-47D5-AC45-8CE453A4AA74 |
| 15 | OFF | 29 | 35285 | 6179323C-B6CB-4CFD-9D78-7110260D8EF9 |
| 15 | ON | 30 | 35286 | C60EBAA2-79DA-4260-A99E-AB0BAEFC5986 |
| 16 | OFF | 31 | 35287 | BC8818F0-F42D-4D86-BA3E-BE115048F394 |
| 16 | ON | 32 | 35288 | 2BCA896C-8741-4355-A980-763B50F813C4 |
| 17 | OFF | 33 | 35289 | 5946BF7C-69EE-4BD1-8AF3-EF3EDBB3EC03 |
| 17 | ON | 34 | 35290 | C5E1A790-2579-4C0B-AE57-5F5E4BF07252 |
| 18 | OFF | 35 | 35292 | A9AA6BA9-08DA-48C1-901B-175327D1D2C3 |
| 18 | ON | 36 | 35293 | 154431FB-53BC-4AEB-8ADD-24ACD9E1FDDC |
| 19 | OFF | 37 | 35294 | 8010CF9C-4158-47E0-9105-5E609BFAF986 |
| 19 | ON | 38 | 35295 | 3E6A3AC8-57A4-4F4A-9E6B-FA9D714B105F |
| 20 | OFF | 39 | 35296 | 81BF7909-4922-4D03-ACB8-B5AE758AABF9 |
| 20 | ON | 40 | 35297 | 2EDC191E-A73E-41E7-8735-2694005ECA08 |
| 21 | OFF | 41 | 35298 | 263E0BB8-F205-4446-9B08-5A9AF0804B86 |
| 21 | ON | 42 | 35299 | E17A2FD4-E344-4B0C-B3EC-3DFEE8FA2BC6 |
| 22 | OFF | 43 | 35300 | 9BFF26B8-4FDD-4408-861C-267EF617F76B |
| 22 | ON | 44 | 35302 | 5D8D9123-CDDC-439E-87C3-4913A4CE7425 |
| 23 | OFF | 45 | 35303 | D0035BF8-A375-4488-B4D7-3AA981B078F2 |
| 23 | ON | 46 | 35304 | D8DDB198-C97C-43EE-B366-D956B493B48A |
| 24 | OFF | 47 | 35305 | CB0D2383-4E41-4715-8835-5A45FBCD1B10 |
| 24 | ON | 48 | 35306 | 0B9C0B7F-B539-43D9-A034-468CA5D19856 |
| 25 | OFF | 49 | 35307 | 662CBAFE-8594-43AC-8766-F7BA503B188A |
| 25 | ON | 50 | 35308 | 190FC793-B0BD-418C-AC79-CEF526943B7F |
| 26 | OFF | 51 | 35309 | 46FA4255-A64D-4E7F-8C25-9B0DA8E71F1C |
| 26 | ON | 52 | 35310 | A6DBD5E3-E0F7-4D0F-93AA-6B3A6F6464D3 |
| 27 | OFF | 53 | 35312 | CE5964AF-34E8-4622-9202-CB54C64B7DB7 |
| 27 | ON | 54 | 35313 | 953BC09F-A5B0-4E13-BF4E-AC25DE4CD801 |
| 28 | OFF | 55 | 35314 | F872FA62-D337-44B3-B15E-60EEF5DB2F20 |
| 28 | ON | 56 | 35315 | 677B3B2B-9BA3-4195-82D8-B8F76D33F7E8 |
| 29 | OFF | 57 | 35316 | F08BAD70-87B1-49A2-AE87-D19AA1480EFE |
| 29 | ON | 58 | 35317 | 8D1169F9-D0AC-4640-9A9B-5ECDC68FBB3F |
| 30 | OFF | 59 | 35318 | 3549DB99-365B-4796-8E64-89601CEFD17D |
| 30 | ON | 60 | 35319 | 115E39AD-E1DF-4AE5-BF10-BC7CEEE4496F |
| 31 | OFF | 61 | 35320 | 07D29CA6-3AC1-4450-BE49-F89A7FFC5BC5 |
| 31 | ON | 62 | 35322 | 9AEA7076-D671-4F69-81C5-96FFDBCD8E1A |
| 32 | OFF | 63 | 35323 | 0A431E54-0AC8-42F4-B1E5-274AF5647C2B |
| 32 | ON | 64 | 35324 | 8364F030-CA0B-4CCB-988D-AC3A98F81E22 |
| 33 | OFF | 65 | 35325 | 6C216850-5FBC-4E0F-AE6B-7400F71D2CCA |
| 33 | ON | 66 | 35326 | C075FB1E-9DC9-4945-8923-A83E94A78392 |
| 34 | OFF | 67 | 35327 | 636D9B5B-942B-4500-873B-43FE12282471 |
| 34 | ON | 68 | 35328 | 869140FB-0C11-4CA3-9FA1-99899D573E7D |
| 35 | OFF | 69 | 35329 | 4EE04728-4399-4DA6-84E3-1671EEA7CD85 |
| 35 | ON | 70 | 35330 | D0CB9466-19E5-4B99-A88F-0ACBC7166560 |
| 36 | OFF | 71 | 35332 | D83E65D9-9644-48A0-9052-95E919E3F08A |
| 36 | ON | 72 | 35333 | 41B0F074-4FEF-461E-AD49-2EE2B7431397 |
| 37 | OFF | 73 | 35334 | DE92F35B-719F-459C-B6E5-F463E034E94C |
| 37 | ON | 74 | 35335 | EE196542-BDD2-4A5B-B508-DCD5D5FCE73E |
| 38 | OFF | 75 | 35336 | 113F8BB9-E131-4ACE-AED8-51904AB3DEA5 |
| 38 | ON | 76 | 35337 | 4FF2633E-9D62-4500-BEA1-CF0A6C91E4FD |
| 39 | OFF | 77 | 35338 | 2CA5C956-C8A9-4556-B86A-5B3E1D3FE1E2 |
| 39 | ON | 78 | 35339 | 056E4843-F23B-4C2B-9827-8CCEA4683FFE |
| 40 | OFF | 79 | 35341 | B9BAA357-673C-4353-9B07-8514DADD45F8 |
| 40 | ON | 80 | 35342 | 523569F4-E8D9-4F45-99E6-B4D87CA688B2 |
| 41 | OFF | 81 | 35343 | DE1043D3-A715-4EA2-89B1-286613C72843 |
| 41 | ON | 82 | 35344 | AC0038F8-F2B2-4601-A09D-91153173D4D8 |
| 42 | OFF | 83 | 35345 | 19B0E182-A8AD-4EBF-90F3-21F18272257A |
| 42 | ON | 84 | 35346 | E0932019-FAE7-4F1B-B152-A192A19D69CE |
| 43 | OFF | 85 | 35347 | E6AC1AAC-FFDB-4ACB-8495-93752372442B |
| 43 | ON | 86 | 35348 | FFD5AA48-4116-44A6-B308-B64920308B52 |
| 44 | OFF | 87 | 35349 | CC7BCC60-0EC4-491D-8BC7-C3267E134ADE |
| 44 | ON | 88 | 35351 | 5E3ED73A-E13D-496B-AC68-0E9E81CBFB75 |
| 45 | OFF | 89 | 35352 | 35257AA8-DCB0-47DE-B1A0-FB1ACA702BE0 |
| 45 | ON | 90 | 35353 | 413B6101-84A8-4D2E-81CB-5ED70B9173B8 |
| 46 | OFF | 91 | 35354 | 8BA25EAA-C319-4EFD-BEA1-58EA5F5C53B0 |
| 46 | ON | 92 | 35355 | 63ABBDF0-9BE6-4EB7-BFEF-A15BD805FAE0 |
| 47 | OFF | 93 | 35356 | 2ED3A3A2-DCC9-415F-95BD-C8B368BA7161 |
| 47 | ON | 94 | 35357 | 1620954C-D406-45DE-9BE7-77F88DE82BCC |
| 48 | OFF | 95 | 35358 | F9C09A80-F21D-4B7F-BA25-EA0D4A343D1E |
| 48 | ON | 96 | 35359 | 529FC752-7A23-4327-9BE9-238BEAEDC62C |
| 49 | OFF | 97 | 35361 | 5ABC00EA-DBE1-48BA-870C-20978263E038 |
| 49 | ON | 98 | 35362 | 4DEB17DE-B564-43DF-A41A-06D62C074C08 |
| 50 | OFF | 99 | 35363 | 79E136BA-074D-4228-A6CD-FA3DB52D3DB9 |
| 50 | ON | 100 | 35364 | 15E6BB5A-FB79-449B-94EB-AE5F18478E9C |
| 51 | OFF | 101 | 35365 | D767B7A0-AECC-4739-BF85-4B9422EC449E |
| 51 | ON | 102 | 35366 | E845F928-B5E9-46C7-A8FE-B4796B2F85FD |
| 52 | OFF | 103 | 35367 | 8CEFF8F4-CA88-4427-B636-23C524C84CA7 |
| 52 | ON | 104 | 35368 | FAEF7084-48FA-4C67-93A0-C898A2356E04 |
| 53 | OFF | 105 | 35369 | 1CC1AECD-6E9C-4518-8A47-15F117FDCD3D |
| 53 | ON | 106 | 35371 | 6B67BB08-3504-47CF-9649-F821E9201979 |
| 54 | OFF | 107 | 35372 | 290D70D0-066E-4A0C-AAA3-B196458754D7 |
| 54 | ON | 108 | 35373 | 96F5505A-86CC-4166-87E5-139F427A1135 |
| 55 | OFF | 109 | 35374 | BF898A63-0CB4-4A16-98E0-F5877BE69C5A |
| 55 | ON | 110 | 35375 | 0E62DDAA-ECDE-4E0A-B057-57326EE12F2F |
| 56 | OFF | 111 | 35376 | 2BE0E9D4-1E60-4004-AF27-276D7D55F249 |
| 56 | ON | 112 | 35377 | 3A01B38B-1203-4097-A1A3-C6CFF8D1EEE4 |
| 57 | OFF | 113 | 35378 | 120EB329-25A9-43CF-85C2-9298EFB6F90D |
| 57 | ON | 114 | 35380 | E1FEF7E1-1E15-418D-92E4-B91EB32A088F |
| 58 | OFF | 115 | 35381 | AA262CD1-E0BE-40EB-9754-9C461AE461A5 |
| 58 | ON | 116 | 35382 | C0DED3FD-9F89-4C7F-823F-17DF5AAFC088 |
| 59 | OFF | 117 | 35383 | 0367EC95-FCBB-49C8-948D-DCDA3EF60E9E |
| 59 | ON | 118 | 35384 | 0A9EB91B-A207-40B3-BC2D-23B7B87C04DC |
| 60 | OFF | 119 | 35385 | EE5EFDB5-1339-47D6-8568-E51EAC166566 |
| 60 | ON | 120 | 35386 | 7D312E2E-8B82-4D7E-9088-C7C26C50C830 |
| 61 | OFF | 121 | 35387 | FB56DB64-EDF2-4CC2-84CC-7B51274061D8 |
| 61 | ON | 122 | 35389 | 70CB9046-4580-4EA3-89C5-DE1B1FD2E51A |
| 62 | OFF | 123 | 35390 | 650911E5-A517-48DD-BA7F-3E06CAB9FB74 |
| 62 | ON | 124 | 35391 | FE911673-6365-4A84-8C77-DFAE94316E07 |
| 63 | OFF | 125 | 35392 | 8D26C20D-03BB-4EA8-A843-B348195E8DDA |
| 63 | ON | 126 | 35393 | 4189E815-2CCF-42D6-90B0-6A8D3C660F87 |
| 64 | OFF | 127 | 35394 | C648C5DD-FE2B-4160-AE3E-67CB5F08ED5B |
| 64 | ON | 128 | 35395 | 40D2C3D2-8F19-4959-8E24-C46FE82CCD63 |
| 65 | OFF | 129 | 35396 | 64946376-228F-4BC6-B5DD-EE3C1DA1101A |
| 65 | ON | 130 | 35397 | 79D1DE2A-08F9-4AA2-B4ED-37522630F636 |
| 66 | OFF | 131 | 35399 | C8F9587E-0C43-460C-BFA2-A95F91CCA273 |
| 66 | ON | 132 | 35400 | E74FF374-2FE6-4AD7-AACE-9AD2C0AD02F0 |
| 67 | OFF | 133 | 35401 | 0C49F579-E101-441F-9757-8B7D9ABFE60E |
| 67 | ON | 134 | 35402 | 99CAEBA8-D141-43F7-AD29-DFC4506F2090 |
| 68 | OFF | 135 | 35403 | 1AB90E36-AC83-45AE-BB2B-360FFEBBC1CF |
| 68 | ON | 136 | 35404 | 93233D92-9F73-497A-8CD8-A0900530B143 |
| 69 | OFF | 137 | 35405 | F86AE9CD-3DEC-41BD-8460-D9F3F9A6FE98 |
| 69 | ON | 138 | 35406 | CDE06F40-4EE0-4228-89D9-97D4CAA30B07 |
| 70 | OFF | 139 | 35407 | 0A4EA21F-5093-47C9-9FDE-BCF23FF153CF |
| 70 | ON | 140 | 35409 | 99440EFC-EE68-44ED-83B9-84C85B48FA75 |
| 71 | OFF | 141 | 35410 | 20F98EDF-0E93-49CE-BF96-0D3AEA701282 |
| 71 | ON | 142 | 35411 | A1C2E171-EA32-41FB-96D5-006C184111CD |
| 72 | OFF | 143 | 35412 | 146F8EB2-B06E-4E08-8C3D-1D734A4BED28 |
| 72 | ON | 144 | 35413 | 84B9F042-0BDD-4E06-923A-137FA2257C7F |
| 73 | OFF | 145 | 35414 | FF245911-A421-429D-81A4-86BAF14F0306 |
| 73 | ON | 146 | 35415 | 057C9DBB-2FFC-464B-880A-99A17539A715 |
| 74 | OFF | 147 | 35416 | 32D27D14-F2EE-488A-9ECF-1D03E8A5F250 |
| 74 | ON | 148 | 35417 | C8AD9257-F7D9-4396-834B-EBD2555D5404 |
| 75 | OFF | 149 | 35419 | 6C5EA365-AD36-4B64-AA69-9A99847CFEFC |
| 75 | ON | 150 | 35420 | 8595F4D4-CA79-4DEF-A4D7-B9D6CD66F324 |
| 76 | OFF | 151 | 35421 | C6381D83-FC2D-4BC9-BF0A-D2BD6B7086FB |
| 76 | ON | 152 | 35422 | A156FEBE-7864-4904-B1D6-F8C703E0C52F |
| 77 | OFF | 153 | 35423 | 4D9BFF31-559B-49F1-8618-CE0DFFDE51DD |
| 77 | ON | 154 | 35424 | BBB54BD1-8C53-4A5A-96F3-555CDB328F37 |
| 78 | OFF | 155 | 35425 | 87013AD7-A55B-4368-9147-A711756F8CFC |
| 78 | ON | 156 | 35426 | B15DD61D-9565-4C0E-8704-AB52E8B853BF |
| 79 | OFF | 157 | 35428 | 21DB3FC9-C5EF-4572-A67E-FC9EE90FD7CD |
| 79 | ON | 158 | 35429 | F7099567-C6BF-4D71-99D0-10940A062253 |
| 80 | OFF | 159 | 35430 | E7337DC6-7008-4692-A0D9-C0F80607358C |
| 80 | ON | 160 | 35431 | F56F5BDE-7CDB-4C54-AC70-4695C29E07D1 |
| 81 | OFF | 161 | 35432 | 0749A1E4-845B-4139-B6F2-0FEF3AE54A02 |
| 81 | ON | 162 | 35433 | 58CB48BB-BE59-49A5-9F66-AAB3720FD755 |
| 82 | OFF | 163 | 35434 | 633B8A25-9DC2-4969-8128-DFD6373893AB |
| 82 | ON | 164 | 35435 | F80B01B2-AE60-45FB-AF18-86308370D328 |
| 83 | OFF | 165 | 35437 | 1415AE48-B6AF-429E-B839-3D314258B241 |
| 83 | ON | 166 | 35438 | 2258DE16-9236-4C69-9BA8-98C3924A1833 |
| 84 | OFF | 167 | 35439 | 056C4C20-B7B6-481F-8407-741549D0939A |
| 84 | ON | 168 | 35440 | EFA8A2B5-7635-4569-B02F-27627DEEC0D9 |
| 85 | OFF | 169 | 35441 | 53D5A85F-82BC-4E99-BB43-C43842BE0C21 |
| 85 | ON | 170 | 35442 | 524C5374-972E-431E-97CF-820E045F31D5 |
| 86 | OFF | 171 | 35443 | 0E2B30B2-F4F4-402D-84A7-C1B590FCD8D8 |
| 86 | ON | 172 | 35444 | 0D10BFFE-E324-4143-B666-1DAEFFA2AF8D |
| 87 | OFF | 173 | 35445 | D37C968A-67D1-40B5-90BB-EB0A3A52A15D |
| 87 | ON | 174 | 35447 | E3B2DFAB-E341-41F4-B6D1-C3EC06B337DB |
| 88 | OFF | 175 | 35448 | DB4F1492-ECD5-4039-8D01-E8411A75EF13 |
| 88 | ON | 176 | 35449 | 3B34146C-88A6-4FB3-B85D-06DC3BEE8EC6 |
| 89 | OFF | 177 | 35450 | DD98080E-FB05-461A-8317-99CF1EA06F1F |
| 89 | ON | 178 | 35451 | C40B2B9D-644A-4221-A4E3-A75EC5855BBB |
| 90 | OFF | 179 | 35452 | B89B0649-A4F9-469E-83C2-4320DCB3B98D |
| 90 | ON | 180 | 35453 | 420E42B9-1CED-4226-A456-E43CB9C04B08 |
| 91 | OFF | 181 | 35454 | B308B95D-45A7-4EDD-85DA-8860BF11BAE1 |
| 91 | ON | 182 | 35455 | BF602A19-A676-4777-B0DC-87B7C4E63E31 |
| 92 | OFF | 183 | 35457 | 760DDB75-5BEF-41D6-AEEB-D9BD57CCE7D5 |
| 92 | ON | 184 | 35458 | B6A4ECFE-11FA-40DF-8641-013491A0F82B |
| 93 | OFF | 185 | 35459 | 1EFA6638-6EBB-4618-B896-043AA6CA1A44 |
| 93 | ON | 186 | 35460 | B4144FF3-7B7A-4C8F-ADAD-475AF0408ED4 |
| 94 | OFF | 187 | 35461 | A6A344BB-F544-4781-AD05-1F6F911A1FA3 |
| 94 | ON | 188 | 35462 | 7957C765-F86C-4E7D-9739-8A6F3F897917 |
| 95 | OFF | 189 | 35463 | 9E9D6701-A4B6-487A-9226-3CA42734D9C0 |
| 95 | ON | 190 | 35464 | A7480009-7815-4918-ACFB-943277DD686A |
| 96 | OFF | 191 | 35465 | BC203A0F-314A-49D5-829C-94F35B9B83FA |
| 96 | ON | 192 | 35467 | CE3DE5D8-CF67-42E3-9328-FCBDC02A8860 |
| 97 | OFF | 193 | 35468 | 8B064672-5F8D-4A96-8F1B-984558373F82 |
| 97 | ON | 194 | 35469 | E339464A-3313-4977-A012-99DB4756D2BB |
| 98 | OFF | 195 | 35470 | 83D2A6A8-CA88-4231-BD80-649A0EDFCAB4 |
| 98 | ON | 196 | 35471 | 54EB6CD7-2EDD-4FCD-9D62-FEBCABD78D0D |
| 99 | OFF | 197 | 35472 | D083E237-697C-4207-A6C2-4C98248F49EA |
| 99 | ON | 198 | 35473 | 069A1055-CD58-44A9-A5E5-A078BFFE2A83 |
| 100 | OFF | 199 | 35474 | FDE759D5-990F-4C73-A6F7-E9B35814755A |
| 100 | ON | 200 | 35476 | 2E919A77-8F71-4291-AF2E-03FAC5C08244 |
