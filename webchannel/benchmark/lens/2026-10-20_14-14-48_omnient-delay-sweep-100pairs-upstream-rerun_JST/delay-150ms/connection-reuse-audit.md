# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 25.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 38.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 34.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 309.000 | 298.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 32.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 58.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 63.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 57.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 35.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 33.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 34.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 45.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 32.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 55.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 20.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 56.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 42.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 302.000 | 292.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 308.000 | 298.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 52.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 60.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 36.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 62.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 28.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 35.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 41.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 37.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 56.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 58.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 58.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 43.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 35.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 33.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 157.006 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 154.524 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 156.679 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 157.423 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 154.990 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 157.717 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 156.304 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 151.205 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 155.735 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 151.134 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 157.320 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 150.630 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 157.850 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 156.391 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 156.426 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 153.115 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 151.752 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 155.858 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 155.357 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 152.466 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 156.829 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 153.474 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 150.803 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 151.681 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 155.921 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 151.550 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 156.473 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 151.239 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 156.645 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 155.668 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 154.797 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 156.178 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 157.140 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 153.900 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 155.876 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 154.047 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 152.231 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 157.314 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 150.903 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 153.958 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 155.712 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 152.751 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 153.609 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 155.452 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 150.773 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 151.927 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 157.556 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 155.958 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 155.085 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 155.268 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 151.889 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 152.330 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 156.173 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 153.307 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 152.243 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 156.460 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 151.022 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 156.904 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 153.705 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 154.575 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 155.102 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 153.068 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 154.965 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 152.459 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 156.717 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 156.518 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 155.933 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 152.363 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 154.778 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 155.598 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 151.657 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 153.607 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 153.670 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 151.846 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 151.488 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 152.144 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 151.882 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 156.383 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 156.035 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 155.603 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 156.940 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 153.285 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 155.480 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 151.639 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 156.685 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 152.153 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 157.659 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 152.330 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 156.504 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 157.692 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 151.571 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 155.876 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 150.831 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 155.898 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 156.114 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 151.341 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 155.519 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 156.495 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 153.427 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 152.933 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 155.388 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 153.648 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 158.020 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 154.485 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 151.094 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 151.791 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 156.106 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 154.218 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 155.864 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 156.579 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 156.261 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 157.558 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 156.205 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 155.555 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 157.514 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 154.800 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 157.790 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 155.556 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 155.945 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 152.538 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 152.317 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 156.250 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 157.467 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 157.345 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 156.856 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 156.580 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 155.720 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 155.569 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 151.785 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 150.682 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 153.862 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 156.171 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 155.866 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 153.492 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 156.203 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 152.632 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 156.603 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 153.586 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 157.378 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 151.443 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 155.144 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 154.411 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 156.417 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 157.150 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 151.989 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 156.518 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 156.436 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 151.308 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 154.489 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 152.455 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 154.396 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 155.128 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 157.982 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 156.548 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 154.228 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 156.457 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 156.636 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 155.828 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 156.661 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 156.353 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 153.185 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 156.493 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 154.959 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 157.771 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 155.828 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 154.618 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 155.550 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 152.606 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 156.381 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 152.866 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 151.746 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 157.740 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 151.013 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 152.207 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 156.084 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 155.162 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 150.642 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 150.968 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 151.224 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 156.618 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 156.547 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 154.323 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 156.247 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 154.760 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 156.166 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 153.246 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 156.685 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 156.540 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 155.343 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 157.586 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 150.910 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 156.098 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 156.139 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 156.455 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 154.073 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 155.860 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 154.245 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 154.217 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 154.296 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 155.968 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 150 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/100 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 3558 | 1BF2C394-3906-405E-B9F2-6F3A0BE3F07F |
| 1 | ON | 2 | 3559 | 9EC0314B-A7FE-436B-ADBC-AC4661813B6C |
| 2 | OFF | 3 | 3560 | BC4455B3-DFBB-47F5-9633-743F221129A9 |
| 2 | ON | 4 | 3561 | 4FECD374-D2A1-4097-87E4-B12B535E081E |
| 3 | OFF | 5 | 3562 | BA0D4BC2-ED21-4F0C-8765-2D49470C250D |
| 3 | ON | 6 | 3564 | 7F01065D-8AAE-43B0-B2F0-0FF69FAAC273 |
| 4 | OFF | 7 | 3565 | CD4CD394-2005-4967-A201-DCCDDD5116F5 |
| 4 | ON | 8 | 3566 | BB69CA59-9FD1-4957-8B73-D0EB3F54FCC6 |
| 5 | OFF | 9 | 3567 | F899DE3E-A39C-43A9-9694-58F2576CF255 |
| 5 | ON | 10 | 3568 | A0F5A742-0A66-4B16-B14D-13522D30894D |
| 6 | OFF | 11 | 3569 | C9FF1028-4B30-4C98-A39C-67D9F8FA683C |
| 6 | ON | 12 | 3570 | 51334D66-6D2C-4766-BB53-CA45E098C285 |
| 7 | OFF | 13 | 3571 | 9DF58EE0-3060-41B8-9421-0AFF29FF939C |
| 7 | ON | 14 | 3573 | 0CD61092-7246-4F07-8062-5FF8C7E4C784 |
| 8 | OFF | 15 | 3574 | 5AD23D8F-94E2-4FD0-80AF-9D4EC05808D2 |
| 8 | ON | 16 | 3575 | 90D4190D-6BB8-4530-8F6C-49510FCCC4B8 |
| 9 | OFF | 17 | 3576 | 059B343F-213A-4305-AD96-EB5CBB6B36F2 |
| 9 | ON | 18 | 3577 | 793DA985-E544-4BD5-98D1-AB4450ACF727 |
| 10 | OFF | 19 | 3578 | 06AE0195-BF1F-47C3-BCAF-D144561CD170 |
| 10 | ON | 20 | 3579 | 7D5C12BF-820E-4296-9107-4B18E1F33843 |
| 11 | OFF | 21 | 3580 | 646EB842-0CA1-45E8-B0F7-4C3084150617 |
| 11 | ON | 22 | 3582 | 0CB56284-C05B-4909-81C0-A33030727387 |
| 12 | OFF | 23 | 3583 | 4BD7BD95-1D83-4C3A-8A06-84B9ABF93E46 |
| 12 | ON | 24 | 3584 | 846BF9E4-81A7-4936-AB6C-D0C5F9D9BEEE |
| 13 | OFF | 25 | 3585 | 980A04E1-1CB6-49C9-8E0E-62C7BD66F84F |
| 13 | ON | 26 | 3586 | 3D495E45-4726-4905-B28E-8A38C5EBA348 |
| 14 | OFF | 27 | 3587 | 7CFCB7E4-B3EE-432C-A91A-84B02FC1383E |
| 14 | ON | 28 | 3588 | F280B29E-EDA8-4178-8D53-B2DC37A75227 |
| 15 | OFF | 29 | 3589 | 3FA6A9ED-AA97-49F9-97BD-2B0B6FBA5D6C |
| 15 | ON | 30 | 3591 | 84BD2F9D-4BEE-446E-AD06-60FB9DB751C5 |
| 16 | OFF | 31 | 3592 | 216C60E3-94F5-4DB2-9F2B-9BC294BB0F7E |
| 16 | ON | 32 | 3593 | 53938712-AE74-46C5-ACC1-D16B3FF7D001 |
| 17 | OFF | 33 | 3594 | 0AF95985-4375-4461-BB86-3837A60E6C15 |
| 17 | ON | 34 | 3595 | 123B44FC-1EF0-48BE-BA0C-7B19442B9AEC |
| 18 | OFF | 35 | 3596 | 2C11B0F4-059B-4BDA-BFAB-D983C2E8D103 |
| 18 | ON | 36 | 3597 | E1B707CF-4455-499B-902C-6E4C17957945 |
| 19 | OFF | 37 | 3598 | E0EA8F21-02D6-429D-ACC6-1177A353405A |
| 19 | ON | 38 | 3600 | 2977C7C7-D1FC-4FA0-A4C2-69D7127D78EB |
| 20 | OFF | 39 | 3601 | D681DAE9-6550-4304-B73E-9BDDC23886A0 |
| 20 | ON | 40 | 3602 | F877A0E4-9426-4D20-AA60-5B074C84D0B7 |
| 21 | OFF | 41 | 3603 | F0D644F6-241C-4340-9F4A-164972E1E913 |
| 21 | ON | 42 | 3604 | 4FAE0C8B-FDCC-49B5-B06E-E24F82333C0B |
| 22 | OFF | 43 | 3605 | 2E07893B-2DB2-4B93-9DCB-63DE6D0C28C1 |
| 22 | ON | 44 | 3606 | 152A8083-37E6-432C-8439-39653D2D9BDF |
| 23 | OFF | 45 | 3607 | 4FD1661A-9AD8-44D1-9541-E056C98688A9 |
| 23 | ON | 46 | 3609 | D21537D2-E1E3-4318-B414-DEE796733887 |
| 24 | OFF | 47 | 3610 | 5F40580E-EDED-47D5-A13E-9984D35E8026 |
| 24 | ON | 48 | 3611 | A5DA4D06-3B03-4D03-922E-CAF821BFFA60 |
| 25 | OFF | 49 | 3612 | 47979015-4484-4357-A029-507C26BD83D8 |
| 25 | ON | 50 | 3613 | 39353299-5BD2-4452-A905-C6CC31AE6BB2 |
| 26 | OFF | 51 | 3614 | 48A3C7BF-12B5-48E4-80B5-3A4529FDAB96 |
| 26 | ON | 52 | 3615 | 8C756139-9427-42FD-9FBA-576410786C3C |
| 27 | OFF | 53 | 3616 | 366840C1-2521-494D-9944-9350D11C83F8 |
| 27 | ON | 54 | 3617 | 0459B71E-8F1B-4B8A-98E9-87B79BE0730F |
| 28 | OFF | 55 | 3619 | 8D2D5B5A-B7E9-42F5-9B47-F1BF280FCA36 |
| 28 | ON | 56 | 3620 | EC0CCF38-12B2-4CD2-A5AD-6C6057B151C1 |
| 29 | OFF | 57 | 3621 | 6F40D387-3B56-43BA-B145-E41E35AAA3C4 |
| 29 | ON | 58 | 3622 | DB6D9EA3-C562-4D08-B295-C46AA8898C49 |
| 30 | OFF | 59 | 3623 | 3C3574C8-09CA-43D5-B602-0E2CF864FBAE |
| 30 | ON | 60 | 3624 | CDA63F9F-9971-4CF2-975A-225C2C0DE26F |
| 31 | OFF | 61 | 3625 | 7DCE2C8D-A6D7-4D49-827E-48B701E6AF64 |
| 31 | ON | 62 | 3626 | 0B60DA6F-A0D4-4822-BC8D-C177B1A22276 |
| 32 | OFF | 63 | 3628 | EE027001-850C-4C1E-9625-035772C65CAA |
| 32 | ON | 64 | 3629 | 91A7EAFE-48AF-4D65-8B76-8A009B2897EC |
| 33 | OFF | 65 | 3630 | 2DCA2727-500A-4790-B5A0-90299DA194D9 |
| 33 | ON | 66 | 3631 | 787A5C38-B4F6-43CD-9070-F5ABCC0000BA |
| 34 | OFF | 67 | 3632 | 62D4BF39-B5F6-4F45-9085-848E9E7C3590 |
| 34 | ON | 68 | 3633 | BCF3E18B-253C-4B9A-AD30-BC49E88A4B19 |
| 35 | OFF | 69 | 3634 | 082B522E-A877-4B2A-957E-B7DEAAEBD7A5 |
| 35 | ON | 70 | 3636 | A67C388C-7B01-4328-9AA3-883D04FA3012 |
| 36 | OFF | 71 | 3637 | AEA35E8C-E39E-4A2D-BDB5-25619179E86A |
| 36 | ON | 72 | 3638 | 443E0AA8-4634-4C90-A0F0-457F504AB73D |
| 37 | OFF | 73 | 3639 | 973CDD9E-9543-430C-B825-799EF1855A94 |
| 37 | ON | 74 | 3640 | 8CDBD39D-F114-43D0-8CDA-6F83698A9AB1 |
| 38 | OFF | 75 | 3641 | 2A8B705C-295C-46C7-B3A6-3656692D7A4B |
| 38 | ON | 76 | 3642 | B9C2A716-2482-471F-86C3-25127B9C4FB3 |
| 39 | OFF | 77 | 3643 | 8A79C367-EE3F-4003-801D-B8DD938B25F8 |
| 39 | ON | 78 | 3645 | E2BC4F0A-4E46-428A-A69F-736FBB6D2220 |
| 40 | OFF | 79 | 3646 | F3D15D54-04F4-4F1A-80C2-248102575C1E |
| 40 | ON | 80 | 3647 | AE779108-2522-470F-8E7D-90BD353A7FAA |
| 41 | OFF | 81 | 3648 | 360E4318-F2C9-4B8A-814C-1D20A1BB2042 |
| 41 | ON | 82 | 3649 | C6D447D7-BD7E-4225-AB75-4C2F932245E1 |
| 42 | OFF | 83 | 3650 | B88B7245-AD3C-4536-B6A6-A64698DD76A2 |
| 42 | ON | 84 | 3651 | DDE359A5-2BEE-4C65-84A3-1F9F90FD0981 |
| 43 | OFF | 85 | 3652 | F0D9A1D9-748D-4968-B31C-60DB224ED5E5 |
| 43 | ON | 86 | 3653 | 1B5D093A-71FC-4352-955C-0C86AC0BE95B |
| 44 | OFF | 87 | 3655 | 1759C064-3C66-4A95-B9E0-6834956A4FB7 |
| 44 | ON | 88 | 3656 | A1A816AA-1EAB-4891-A6F5-642D65151495 |
| 45 | OFF | 89 | 3657 | 71C64511-D1E4-4AB8-9408-3C16E507CE9B |
| 45 | ON | 90 | 3658 | 87E77B9F-8C05-45AF-BB03-2E03227620FA |
| 46 | OFF | 91 | 3659 | E853CD32-528F-4688-97B1-8F1A0E746D6C |
| 46 | ON | 92 | 3660 | C453BC90-674D-4B8B-BFF1-72BDD7591A31 |
| 47 | OFF | 93 | 3661 | 9392400F-8C95-446A-B33F-22EB1974A0F1 |
| 47 | ON | 94 | 3662 | 1A8128F8-4B33-447A-9FF5-D378C8B3D8A4 |
| 48 | OFF | 95 | 3664 | 0D1E14ED-3EB5-4826-82C8-33AD7337061E |
| 48 | ON | 96 | 3665 | 42AD891C-6E77-4364-8434-7B713D2D7DB1 |
| 49 | OFF | 97 | 3666 | 99A8969D-C819-4505-9600-601CADC33CE8 |
| 49 | ON | 98 | 3667 | F04CCFBA-4FDB-4D25-AA1C-5A4233C9A3FB |
| 50 | OFF | 99 | 3668 | EFCBE3AB-172B-40A7-B2D0-A0AE2B9D69DD |
| 50 | ON | 100 | 3669 | 51623198-16B3-45A6-A4BA-D10DD94FB4A0 |
| 51 | OFF | 101 | 3670 | 8C2D1C7D-94F6-4019-8A08-8240CB35F7DD |
| 51 | ON | 102 | 3671 | FBD3D3EA-8403-4BFE-995C-8FB4B266ED42 |
| 52 | OFF | 103 | 3673 | 537D941A-6886-4A01-895F-C941ACE859BA |
| 52 | ON | 104 | 3674 | 173EBE8C-BDFD-45C4-978F-B59F67372416 |
| 53 | OFF | 105 | 3675 | A5BF2693-AF9C-40C5-89A5-33A36A2E32CA |
| 53 | ON | 106 | 3676 | 02104F0D-7F61-41D8-AD44-BB3FB344661D |
| 54 | OFF | 107 | 3677 | 5C6A3171-ADD5-4B3B-A6CC-6FB779A21D7A |
| 54 | ON | 108 | 3678 | FFF135C9-973C-4EEA-BAAC-F46872745169 |
| 55 | OFF | 109 | 3679 | BFE1BC97-1704-4B09-9A08-7F1A6CCB6D91 |
| 55 | ON | 110 | 3680 | 6DAD69EC-E58E-484B-B4D3-31B9A3E9263F |
| 56 | OFF | 111 | 3682 | 4E3856DC-F9D0-43BA-85B4-A7B15C2989B9 |
| 56 | ON | 112 | 3683 | 57E0E3D6-A4CC-441E-9CCF-BD018C38F05F |
| 57 | OFF | 113 | 3684 | BDBFEFC2-6DA2-4696-B9C1-43686EEDC454 |
| 57 | ON | 114 | 3685 | 66315ADD-7425-4947-9882-43EF8821910D |
| 58 | OFF | 115 | 3686 | DEA09357-F920-4871-8DAE-B917678DE61C |
| 58 | ON | 116 | 3687 | C4E014A4-9F6C-4CCA-91D4-A4467F77F063 |
| 59 | OFF | 117 | 3688 | D0C76ABA-C61C-4B30-89C9-9DD7965EA9AD |
| 59 | ON | 118 | 3689 | 957AE1D0-F70A-458F-90C5-33FA5573CA11 |
| 60 | OFF | 119 | 3691 | 6C969003-440D-4130-81DF-740DDC02E675 |
| 60 | ON | 120 | 3692 | EF546473-896A-4883-855F-41D27D2FA530 |
| 61 | OFF | 121 | 3693 | 19F0C6FD-32EC-4739-87F1-FE72696E7869 |
| 61 | ON | 122 | 3694 | 2FFB7557-B565-472C-9B76-4EC6EC325FD2 |
| 62 | OFF | 123 | 3695 | 07358557-305A-4A32-A638-7386892E6124 |
| 62 | ON | 124 | 3696 | C803E5F0-086E-4A78-87E7-03712D479065 |
| 63 | OFF | 125 | 3697 | E8FE9283-D678-4EE8-B865-D12C9C60B0AF |
| 63 | ON | 126 | 3698 | 1A718A68-2F54-49EA-B23C-9B8A52661040 |
| 64 | OFF | 127 | 3700 | 8119F330-906D-4A1B-8A86-28EB1C3A56A1 |
| 64 | ON | 128 | 3701 | 317F0D2F-3150-4226-85E4-F3A6C981C9F6 |
| 65 | OFF | 129 | 3702 | B5B054CD-9ED9-461D-AA80-8AE0EF4B73C2 |
| 65 | ON | 130 | 3703 | 5B846531-93EB-4E7E-B44F-DD1E9150862C |
| 66 | OFF | 131 | 3704 | 7C57A552-4376-4C7E-9C66-A3B4DD5E7C15 |
| 66 | ON | 132 | 3705 | 7CF9A556-801F-4CAB-A118-0038D1161915 |
| 67 | OFF | 133 | 3706 | FEC001A4-1CB9-47E0-BF71-AC63A3B56A03 |
| 67 | ON | 134 | 3707 | 3BCB283B-657F-446A-90DA-1B69271641ED |
| 68 | OFF | 135 | 3708 | 53073EB6-6D44-4CFE-A893-FDE56A3B47EE |
| 68 | ON | 136 | 3710 | 3C38C032-491E-4893-8F3F-F5A0BA70E47A |
| 69 | OFF | 137 | 3711 | 15E1FB16-B945-47CA-A2CC-3F0A24868A51 |
| 69 | ON | 138 | 3712 | 7AE3C3C3-733C-4315-BD2F-B9B0AF7CAA67 |
| 70 | OFF | 139 | 3713 | EA2CDCDF-7F5C-4CAE-8922-C88BE0BF4AA6 |
| 70 | ON | 140 | 3714 | 818960CC-CD8A-4A8C-B51C-A689FF231D45 |
| 71 | OFF | 141 | 3715 | 3F88E029-269F-42D6-9FC8-BEB3944A4001 |
| 71 | ON | 142 | 3716 | 920603CB-E75E-4231-8C38-6ADAAA7F4CAB |
| 72 | OFF | 143 | 3717 | 7758CF2E-9BFB-4081-8546-73F0EAC53C99 |
| 72 | ON | 144 | 3719 | 4A086D16-2185-4FE2-B9B9-71A7376DDC27 |
| 73 | OFF | 145 | 3721 | F30A7EC8-6A36-498F-BA76-C0FB93D468F3 |
| 73 | ON | 146 | 3722 | 3436CCA6-A273-46BD-860E-89B7D8C210C9 |
| 74 | OFF | 147 | 3723 | B1949BA6-D9F5-4564-A3BC-1DDC4BBAD188 |
| 74 | ON | 148 | 3724 | 37078BCE-AD68-4A3B-AB89-C731FEB63E3B |
| 75 | OFF | 149 | 3725 | 0488E3C3-D457-4870-A2F7-671EB514C946 |
| 75 | ON | 150 | 3726 | 76AECD36-42D3-4665-9654-0A17508F55F1 |
| 76 | OFF | 151 | 3727 | BCBA4D25-9816-4E17-82CC-BBE170AC8FC3 |
| 76 | ON | 152 | 3729 | A50C5371-3C89-439B-941F-90C2B27E9696 |
| 77 | OFF | 153 | 3730 | DE0BA4AD-1809-47CF-A683-206414031B87 |
| 77 | ON | 154 | 3731 | 87557304-1960-4F0E-BD0D-FD3F585F0F3A |
| 78 | OFF | 155 | 3733 | 66FB33E4-43A1-4380-9B25-B69DA812AF14 |
| 78 | ON | 156 | 3734 | 962B85BB-E7FD-4BFC-9852-371D1C416B03 |
| 79 | OFF | 157 | 3735 | 176B51E7-B4A8-4A7A-BD3E-CBF816C6BDFB |
| 79 | ON | 158 | 3736 | D51C12A8-EC9B-4E51-AC09-8C0CBC462AC2 |
| 80 | OFF | 159 | 3737 | 864E68D4-7790-472A-B4F6-4673BBCB8591 |
| 80 | ON | 160 | 3739 | 70C34C74-FAFF-491D-9EC7-55583798FF26 |
| 81 | OFF | 161 | 3740 | 664E4683-1D0C-41EF-A280-BF4171DEC23B |
| 81 | ON | 162 | 3741 | 270227FA-92DD-4924-B663-3EDDEAA9994A |
| 82 | OFF | 163 | 3742 | 9D84F63A-1DE0-4D5A-99FC-55C9E850D6F9 |
| 82 | ON | 164 | 3743 | DD9582DC-2C2D-4B89-926F-B8A039080463 |
| 83 | OFF | 165 | 3744 | 11D88A24-5CB8-4689-9893-6117FC5C0FC9 |
| 83 | ON | 166 | 3745 | 0B91BF63-9215-414B-96B5-51C9F34E4F78 |
| 84 | OFF | 167 | 3746 | C75A3419-DF61-480E-BC96-9FBF18094943 |
| 84 | ON | 168 | 3748 | 878D8A5E-62A3-4ACC-8A37-E5ACAA1B0FAF |
| 85 | OFF | 169 | 3749 | 37C7EB00-C798-45CC-97E3-CE1FBE6A3B18 |
| 85 | ON | 170 | 3750 | DC8DF49E-1D0B-49B3-AD8A-975B50943581 |
| 86 | OFF | 171 | 3751 | CFD32751-7166-49A1-9D97-4939D9645DFA |
| 86 | ON | 172 | 3752 | 07701A82-F217-485B-A4D7-89975F8A8430 |
| 87 | OFF | 173 | 3753 | 57673B8D-9B67-4963-A261-C73CCEA33220 |
| 87 | ON | 174 | 3754 | BF86AB72-5E5E-45D1-9D08-9AB4526B02FB |
| 88 | OFF | 175 | 3755 | AD67DEF1-B141-4FCF-8ED8-F752590CA742 |
| 88 | ON | 176 | 3757 | CCF21CD8-09D6-4531-AB38-F77A102A75CF |
| 89 | OFF | 177 | 3758 | B39C74C6-19B2-45AB-A390-215CF9C5AA26 |
| 89 | ON | 178 | 3759 | B5956C2E-901F-4B96-A269-30A4D4891683 |
| 90 | OFF | 179 | 3760 | A3BCCE67-1226-4DF0-BD29-17EB75FC11BD |
| 90 | ON | 180 | 3761 | F7FC6001-A2BE-49B2-8309-A3EAF4FF3C0F |
| 91 | OFF | 181 | 3762 | 2A57AD39-8E1A-44B6-8846-10DFC118342C |
| 91 | ON | 182 | 3763 | B62156CB-741A-4039-B3F9-108A63FAA092 |
| 92 | OFF | 183 | 3764 | E2C1F050-719A-40AB-A837-E0C021B82088 |
| 92 | ON | 184 | 3766 | 8F57D3E3-1BE6-47EA-BDBC-9D6BBF556B38 |
| 93 | OFF | 185 | 3767 | B887C811-3129-4554-A71A-E1D65767B6BB |
| 93 | ON | 186 | 3768 | 08F0219F-CED3-4A78-9B05-9F75E77AC8FC |
| 94 | OFF | 187 | 3769 | D932A7C0-0F3A-426F-AB67-49D58E44D4BD |
| 94 | ON | 188 | 3770 | 5EE88D9C-FB21-42D7-B305-32EDCB469ECF |
| 95 | OFF | 189 | 3771 | 66CD96F0-3CF4-44AC-B797-1FD98B3DBF93 |
| 95 | ON | 190 | 3772 | 36694C35-2F7F-4910-947F-9117D020D2FC |
| 96 | OFF | 191 | 3773 | 30628EF2-2227-4462-9DEC-B450582B8DC4 |
| 96 | ON | 192 | 3774 | 4755D531-4AF3-4E1E-BC7B-FDE9155CDD76 |
| 97 | OFF | 193 | 3776 | 1F80DF90-D59B-4ECE-BFA7-29B66E21FF30 |
| 97 | ON | 194 | 3777 | B6FB9CDA-054B-4F22-8879-636FCF7E7A8F |
| 98 | OFF | 195 | 3778 | 1840ADFA-170E-40DE-82E7-7F98217FC827 |
| 98 | ON | 196 | 3779 | EB07DBA5-1B77-4C00-B3C1-FD2CE4920168 |
| 99 | OFF | 197 | 3780 | DA44672A-55A7-4582-855E-170535E83672 |
| 99 | ON | 198 | 3781 | 251735E0-BF71-4994-88FA-F758F3865852 |
| 100 | OFF | 199 | 3782 | CF777A11-875E-4845-BD00-A796A3B52618 |
| 100 | ON | 200 | 3783 | 96E7EA78-0607-443C-A3BB-6235DD2E541D |
