# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 35.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 62.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 33.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 400 | handshake | h2 | false | 35.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 38.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 25.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 62.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 400 | handshake | h2 | false | 35.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 34.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 63.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 38.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 400 | handshake | h2 | false | 36.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 400 | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 400 | handshake | h2 | false | 46.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 22.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 41.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 36.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 28.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 38.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 35.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 28.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 35.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 29.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 38.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 400 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 22.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 38.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 51.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 34.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | 400 | handshake | h2 | false | 58.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 55.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 400 | handshake | h2 | false | 89.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 67.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 400 | handshake | h2 | false | 45.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 33.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 32.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 400 | handshake | h2 | false | 43.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 37.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 57.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 60.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 34.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 58.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 50.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 86.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | 400 | handshake | h2 | false | 81.000 | 58.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 61.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 55.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 48.000 | 41.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 65.000 | 48.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 78.000 | 58.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 36.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 37.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 37.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 56.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 241.000 | 231.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 51.254 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 52.710 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 52.586 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 51.147 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 52.685 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 52.854 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 50.392 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 52.047 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 52.085 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 51.056 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 51.331 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 50.827 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 52.834 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 52.895 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 52.214 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 51.621 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 51.362 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 51.770 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 52.928 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 51.221 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 52.847 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 50.406 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 53.019 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 51.612 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 52.328 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 52.340 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 50.585 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 50.760 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 52.165 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 52.365 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 51.710 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 50.579 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 51.938 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 52.674 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 50.741 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 52.839 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 50.513 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 50.454 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 52.933 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 50.808 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 52.448 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 51.588 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 50.908 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 52.693 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 52.620 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 50.881 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 52.213 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 52.146 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 51.461 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 50.925 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 51.699 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 51.557 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 52.904 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 51.139 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 52.919 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 52.904 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 51.528 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 52.524 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 51.171 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 51.589 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 52.615 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 52.601 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 52.925 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 52.846 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 50.982 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 51.256 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 52.843 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 50.448 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 51.210 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 52.240 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 52.766 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 52.913 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 52.838 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 52.549 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 50.849 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 52.346 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 53.019 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 52.799 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 52.875 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 50.889 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 51.597 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 52.023 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 52.827 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 52.882 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 52.913 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 52.858 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 52.932 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 51.719 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 52.522 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 52.660 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 52.353 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 52.034 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 51.405 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 50.312 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 52.939 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 52.261 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 52.254 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 52.432 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 52.087 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 52.495 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 52.864 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 50.940 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 52.588 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 52.746 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 50.576 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 51.099 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 52.842 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 53.023 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 51.024 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 50.628 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 51.876 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 52.831 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 52.847 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 50.489 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 51.192 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 51.596 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 52.640 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 52.909 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 52.632 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 52.676 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 50.650 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 52.787 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 51.067 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 53.025 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 50.327 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 53.018 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 52.897 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 51.633 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 52.853 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 52.674 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 51.845 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 50.340 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 51.314 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 52.838 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 52.868 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 52.896 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 52.522 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 53.029 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 52.908 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 52.858 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 52.606 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 50.706 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 50.310 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 51.250 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 52.154 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 52.934 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 51.103 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 52.711 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 51.973 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 50.706 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 51.730 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 52.838 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 51.914 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 52.662 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 52.829 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 50.512 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 52.568 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 51.521 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 53.021 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 52.921 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 51.534 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 50.621 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 51.514 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 52.911 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 52.843 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 52.742 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 52.850 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 52.737 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 50.935 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 52.762 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 51.626 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 50.597 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 51.247 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 52.150 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 52.850 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 52.887 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 52.859 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 50.724 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 52.378 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 52.526 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 52.922 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 52.034 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 52.235 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 52.863 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 51.205 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 52.843 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 51.908 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 53.023 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 53.020 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 51.809 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 52.913 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 51.808 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 50.467 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 50.955 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 52.174 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 52.868 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 50.739 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 53.019 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 51.443 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 52.917 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 50 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 11/100 ON trials. Of those trials, 11 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 6, 13, 19, 26, 27, 45, 51, 58, 59, 65, 71, 75, 86. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 4808 | A20664E2-F43F-480D-B461-9C1E5BDC1571 |
| 1 | ON | 2 | 4809 | 65FD815F-306D-436E-86F5-F10220BE0F80 |
| 2 | OFF | 3 | 4810 | 614C74B3-EC67-4C77-A3A7-9885B403A172 |
| 2 | ON | 4 | 4811 | 924045DA-9708-44BA-A42A-3ABDDE93C66F |
| 3 | OFF | 5 | 4812 | C7B86218-FE0B-416F-8554-9793BB2081B0 |
| 3 | ON | 6 | 4813 | 0D4D739F-067D-4B35-AD79-788C464EB912 |
| 4 | OFF | 7 | 4815 | A997354D-E9C6-4AA8-B0C6-931AB134B6EE |
| 4 | ON | 8 | 4816 | 29F61C31-B772-47EA-AEBB-79658534EE99 |
| 5 | OFF | 9 | 4817 | 9206127B-8654-4DF0-9675-8737D46A8DCE |
| 5 | ON | 10 | 4818 | 066048B5-01D9-4403-8395-F415E1672366 |
| 6 | OFF | 11 | 4819 | 4443A059-EF40-4592-9401-12616C79672E |
| 6 | ON | 12 | 4820 | 784EA5C6-CE83-484E-BD1F-8F1375BE3969 |
| 7 | OFF | 13 | 4821 | F03A6CC4-07B1-4322-B87E-FCDC34E6A517 |
| 7 | ON | 14 | 4822 | 554B8367-6EA0-4587-8E5A-52269E7367F3 |
| 8 | OFF | 15 | 4825 | 6F6E102E-B3EF-4244-A288-298F9D2B1EE3 |
| 8 | ON | 16 | 4826 | 9608CE61-CC8B-4C43-B323-77AE036017F5 |
| 9 | OFF | 17 | 4827 | 758CB6F0-5092-4704-8FE9-8BEF63903C4E |
| 9 | ON | 18 | 4828 | CF119A76-C500-42DA-BB48-341F2409962B |
| 10 | OFF | 19 | 4829 | EF5C46BC-0E51-492C-A74D-A00A82B72405 |
| 10 | ON | 20 | 4830 | C6D8DD65-5D30-4C59-8345-105A00E68C8B |
| 11 | OFF | 21 | 4831 | 3577AD46-5B36-4788-B000-D29E5E8D2726 |
| 11 | ON | 22 | 4832 | DBF2DD3F-F3BB-474F-A6EC-3EDA098ECFAD |
| 12 | OFF | 23 | 4833 | 4CF5089A-AD6D-4434-9346-3E4EC8E1DD8F |
| 12 | ON | 24 | 4835 | E701D5EE-9E70-484E-8BCA-CBA3F99C14B9 |
| 13 | OFF | 25 | 4836 | 003145AC-68CF-46EC-8A02-432DEC1E08DD |
| 13 | ON | 26 | 4837 | 6C7EB371-74C6-4D35-947B-7BB36EAB1104 |
| 14 | OFF | 27 | 4838 | 1DCA2EEF-AE2E-47AA-9D48-C89391FFC1F1 |
| 14 | ON | 28 | 4839 | 9849EA48-7951-4294-BF28-9BCB9B41CB28 |
| 15 | OFF | 29 | 4840 | C3ED2796-D277-4749-9DA2-028EF753A8B2 |
| 15 | ON | 30 | 4841 | 77F0BE17-DE81-42AB-B8E4-73E7966DF9F8 |
| 16 | OFF | 31 | 4842 | 25ECA35F-D83B-4132-BDF4-3FDB2497F16C |
| 16 | ON | 32 | 4843 | E9476C5D-4549-42C3-957B-0C9138CD8F74 |
| 17 | OFF | 33 | 4845 | 16B0D3D6-6C05-4509-88C6-15FB4AF9CEF6 |
| 17 | ON | 34 | 4846 | F5DF2DD3-E406-4131-85FE-900D6BED58AD |
| 18 | OFF | 35 | 4847 | 24DA759F-21A8-4BF5-B387-831C76A7DC27 |
| 18 | ON | 36 | 4848 | 6D65E9B1-7D44-4729-AE55-D287B4881C90 |
| 19 | OFF | 37 | 4849 | 35D94903-C7F6-4075-AEF7-039808F2F410 |
| 19 | ON | 38 | 4850 | 82CEA086-B69C-410F-95DA-770CEA2E07F9 |
| 20 | OFF | 39 | 4851 | C4B4CD9C-3BF3-4DEC-9839-3EA01F185471 |
| 20 | ON | 40 | 4852 | BC2B7B3C-CD59-41A6-94EC-A5802FCC9A4E |
| 21 | OFF | 41 | 4854 | 9B6A326A-6F08-475A-9315-C3C9B4042F7F |
| 21 | ON | 42 | 4855 | E1DD4675-F5B8-46B6-A5E6-53DDC6346D5A |
| 22 | OFF | 43 | 4856 | DAF0D8F4-9FB9-40E0-853B-B0A457AC45A1 |
| 22 | ON | 44 | 4857 | B7CEF50D-C0CA-4730-8617-3F66D8589580 |
| 23 | OFF | 45 | 4858 | B25FA243-7886-4787-9D20-6C4F3DF47A5D |
| 23 | ON | 46 | 4859 | 57BF561D-FC24-413C-BC3B-2E854D314866 |
| 24 | OFF | 47 | 4860 | 4603C861-1CFE-444C-8CFB-5E6DA8D153A3 |
| 24 | ON | 48 | 4861 | 0D5ACD7D-8B0E-4057-95ED-E97A8C8E7400 |
| 25 | OFF | 49 | 4862 | D0D4C3A1-A6EA-4DC0-ACFE-7AFDD91BA156 |
| 25 | ON | 50 | 4864 | 8BCCEA91-35ED-4D52-B99A-27E921692DFF |
| 26 | OFF | 51 | 4865 | 67CC1594-FAF6-43A6-B322-9ED9A543F8AC |
| 26 | ON | 52 | 4866 | 11DAEE94-2187-42D4-B035-576DE766C4F4 |
| 27 | OFF | 53 | 4867 | DC49C065-722D-4253-86F3-503103FEEB0B |
| 27 | ON | 54 | 4868 | 3EE85B78-D439-41FF-B10D-A79235D6671F |
| 28 | OFF | 55 | 4869 | 408472DC-757A-4C36-87E3-1F174D3796A3 |
| 28 | ON | 56 | 4870 | 65BB0D07-9316-4899-B927-7A6B2C902120 |
| 29 | OFF | 57 | 4871 | 791EE71D-04BB-43F3-B394-D0F7C827AFBC |
| 29 | ON | 58 | 4872 | 2DAB8C60-7329-4CE9-AD89-776D0E64EF1D |
| 30 | OFF | 59 | 4874 | 25182BA6-6FE3-44EE-AEEC-EFAC408810F8 |
| 30 | ON | 60 | 4875 | 3E2F1933-F78E-425C-BA6E-675201EC79F4 |
| 31 | OFF | 61 | 4876 | DF409542-5213-42B3-AD11-F0A09025F16E |
| 31 | ON | 62 | 4877 | C31F6179-913E-4E6E-B535-9C73359A696B |
| 32 | OFF | 63 | 4878 | 52A28BBA-7BA7-4E21-A9CB-B2061409CB12 |
| 32 | ON | 64 | 4879 | 3D6DB767-0DA3-4569-BF27-ADF0E1478F65 |
| 33 | OFF | 65 | 4880 | 8100BC9A-6A11-4C62-9A54-2E20F2141192 |
| 33 | ON | 66 | 4881 | 3DBBC786-6995-439B-9521-A79024D05DEC |
| 34 | OFF | 67 | 4882 | 6D74AB8F-AB92-4137-AF70-9F66C7C4A517 |
| 34 | ON | 68 | 4884 | 82702AE3-5B36-44D7-8BF8-B241BFD39FD0 |
| 35 | OFF | 69 | 4885 | 74985B55-216C-405D-B6FE-FDA21DCF7C0D |
| 35 | ON | 70 | 4886 | 31CC6B64-8887-4A27-8283-8F0BA46C26CC |
| 36 | OFF | 71 | 4887 | 96980D3E-7BFC-461F-A19C-21829BBC0D37 |
| 36 | ON | 72 | 4888 | 73DE6501-D868-4120-A1C5-EFDB5CBC2FAC |
| 37 | OFF | 73 | 4889 | CF7BAF76-E0EA-48FD-8DED-6ABEC4B26903 |
| 37 | ON | 74 | 4890 | 7C51A70A-8C31-4C8D-8195-B293170C3B54 |
| 38 | OFF | 75 | 4891 | CD35E1C1-29C1-4E0F-9246-D438555EAD56 |
| 38 | ON | 76 | 4893 | 9A5FA9C4-19AA-4EEF-9AF6-60CDEC474EEF |
| 39 | OFF | 77 | 4894 | F6755404-C665-4D13-B073-543C8368372E |
| 39 | ON | 78 | 4895 | 5FB9768F-7A8E-4AB4-8959-9156F607801C |
| 40 | OFF | 79 | 4896 | 14B20DF1-9539-4996-A0EA-93DB55CD595F |
| 40 | ON | 80 | 4897 | 9D91BF0A-D454-4CDA-9F58-4861148A5CAB |
| 41 | OFF | 81 | 4898 | 13BB8B24-234C-4490-AFC7-EAD61D177F31 |
| 41 | ON | 82 | 4899 | BE2F7B65-FD07-4679-A0EA-C14E092A8B2E |
| 42 | OFF | 83 | 4900 | 76775B94-7FD3-424C-8F61-C399E9614413 |
| 42 | ON | 84 | 4901 | 0213EA1B-3425-40DF-9B2A-C44CA66083E9 |
| 43 | OFF | 85 | 4903 | 73CB8641-A9A7-4687-B75E-63D88F633D80 |
| 43 | ON | 86 | 4904 | 566A3DEF-6968-42D1-A618-3ED25F37852D |
| 44 | OFF | 87 | 4905 | 0BD12DB9-5A5A-406C-B8EB-5D290E67CDCB |
| 44 | ON | 88 | 4906 | C1338EC4-4B59-4C1C-830F-5122B6E174CB |
| 45 | OFF | 89 | 4907 | 7D435354-025D-43CA-8367-C696982EA75B |
| 45 | ON | 90 | 4908 | 3B6C2857-D093-450F-9D1F-18C261FA2B85 |
| 46 | OFF | 91 | 4909 | 34AFA049-282A-40FF-85A6-29606CA5C1E9 |
| 46 | ON | 92 | 4910 | 01E5258A-8B3A-44B1-987D-B35474D3B42F |
| 47 | OFF | 93 | 4912 | BC7194E1-5401-4DC5-B2DB-7B9EC91C252D |
| 47 | ON | 94 | 4913 | F6253BD2-1087-4132-AA33-B3DCE54614A9 |
| 48 | OFF | 95 | 4914 | FE6ED836-8671-4E0D-8DAC-3E31E05324CD |
| 48 | ON | 96 | 4915 | 2E352991-8D64-49BD-9C0F-EA6639E118DA |
| 49 | OFF | 97 | 4916 | 31F86F1C-BC9E-4E6F-817F-BF981248C555 |
| 49 | ON | 98 | 4917 | E77F084B-73F4-473B-B163-3E754677AA25 |
| 50 | OFF | 99 | 4918 | 89AE3A0B-4BF0-4810-A536-E452ECD76BC2 |
| 50 | ON | 100 | 4919 | 9E77CC66-99A3-4E02-BEE4-00E2F8E71406 |
| 51 | OFF | 101 | 4920 | C4043FA0-3B73-4C60-B118-4EB080BB40A7 |
| 51 | ON | 102 | 4922 | 8E766EB9-7976-43A0-9FF1-A1037CD176F1 |
| 52 | OFF | 103 | 4923 | 7BA081EF-4589-4AFB-A79A-F205F222087A |
| 52 | ON | 104 | 4924 | 70C0C008-FF8A-42D9-BD28-611E653FDC32 |
| 53 | OFF | 105 | 4925 | 5E866B13-9CA7-47DF-A9C8-FB081D34CC24 |
| 53 | ON | 106 | 4926 | 5A1C9A0D-FECB-4754-AD6C-937F174385A2 |
| 54 | OFF | 107 | 4927 | 8B2F3EAF-1793-4B33-8A10-8C8ABE2A9692 |
| 54 | ON | 108 | 4928 | 1BB3541C-A074-4830-BC51-714EA74E54E7 |
| 55 | OFF | 109 | 4929 | 2C274E9A-B517-4676-8726-B36F931D5081 |
| 55 | ON | 110 | 4930 | 7D6FC5FA-87EC-41DE-8978-834A4B61105F |
| 56 | OFF | 111 | 4932 | 6E993D57-7FE9-4C82-BC54-589E01E5E420 |
| 56 | ON | 112 | 4933 | C542F4D0-15D6-4D19-80A7-541C0A47FE56 |
| 57 | OFF | 113 | 4934 | 3EF5D7EB-BD10-42F4-9A55-C2877334C8D1 |
| 57 | ON | 114 | 4935 | 4A3643D1-DA90-4446-9F79-9AD476F28373 |
| 58 | OFF | 115 | 4936 | 52D2259C-000D-4184-BB6F-8C587EB6519A |
| 58 | ON | 116 | 4937 | 0CE7ACA8-CD99-405B-966D-931E131B523E |
| 59 | OFF | 117 | 4938 | 24706F45-0311-4C64-A180-2B2D8B7A0710 |
| 59 | ON | 118 | 4939 | 2C2DFEFC-F99A-41D6-B0D0-F1A6A25D97A8 |
| 60 | OFF | 119 | 4940 | 0869AE84-A981-45BE-BB5D-34D3374CDD52 |
| 60 | ON | 120 | 4942 | 233B7C50-DC6B-4FDA-84AC-BFC83796CED8 |
| 61 | OFF | 121 | 4943 | 84AA8509-ACDC-4E03-BFFC-5F19E9A82F2D |
| 61 | ON | 122 | 4944 | B6EBF6BA-42B3-4A47-9FED-9DFD40FBE136 |
| 62 | OFF | 123 | 4945 | 8A61F23B-9DB7-4CCF-890D-A97FB8E801B1 |
| 62 | ON | 124 | 4946 | 47B25B39-AD71-4589-AFF2-B2E60FD6551D |
| 63 | OFF | 125 | 4947 | F977E923-C241-418D-B270-511B990D00EB |
| 63 | ON | 126 | 4948 | BD475545-F110-40A1-BE2D-3EFD2B21A75C |
| 64 | OFF | 127 | 4949 | F93D794D-189F-4AEE-B0A7-E21AF2CC1DFA |
| 64 | ON | 128 | 4951 | D492B7B3-BFA5-4DF0-BDD2-9D135A08A863 |
| 65 | OFF | 129 | 4952 | 306E9CA8-6B1A-42DA-AE06-9BD9E203ADF8 |
| 65 | ON | 130 | 4953 | E937E270-EEE4-4664-869C-B8B932795E4C |
| 66 | OFF | 131 | 4954 | 126B8DFB-7AC8-415B-8E79-F951065463B5 |
| 66 | ON | 132 | 4955 | 4BC0FB9D-C06A-4B63-BCDA-7A046E02CF25 |
| 67 | OFF | 133 | 4956 | E0352077-6265-43AA-9CD3-17FED62DE35F |
| 67 | ON | 134 | 4957 | B95D329B-77FB-422B-92B0-3B41BC5C2F76 |
| 68 | OFF | 135 | 4958 | 9072DF57-7112-4223-AF05-6432A6969AB6 |
| 68 | ON | 136 | 4959 | 2F58312E-E916-4FDF-A691-57C0A315A532 |
| 69 | OFF | 137 | 4961 | C5C83C5D-D19B-4A3D-89EF-F9784842B247 |
| 69 | ON | 138 | 4962 | 33520BFF-1574-4DEC-82FA-A25AACC112FA |
| 70 | OFF | 139 | 4963 | 7B5E11F6-794E-4D18-B210-5205AD801B8B |
| 70 | ON | 140 | 4964 | A2D9953F-C4F2-41D6-A83D-4D455FE7DEC8 |
| 71 | OFF | 141 | 4965 | 7951D0B7-9E36-4EAE-B2B7-0D70997F00F8 |
| 71 | ON | 142 | 4966 | 699F3941-E558-4421-B741-89173E92E7E9 |
| 72 | OFF | 143 | 4967 | BF15A429-DFB4-4190-8B94-67D9A368993A |
| 72 | ON | 144 | 4968 | F2329482-14BC-4B47-9FF0-4FCF2D672E69 |
| 73 | OFF | 145 | 4970 | 3C2289AB-DBCA-4DE7-AD8E-80923123C820 |
| 73 | ON | 146 | 4971 | 1F909743-56AB-4CB9-B9E9-BEC05F9B1B9F |
| 74 | OFF | 147 | 4972 | F07F16F4-05AD-4029-83D0-566E17218C34 |
| 74 | ON | 148 | 4973 | 953CE895-A2D2-4D62-BCA8-A793BCCADD50 |
| 75 | OFF | 149 | 4974 | B4C01CA8-305C-42D5-B36F-9C3FCD65F927 |
| 75 | ON | 150 | 4975 | 8B7D1698-8404-48C4-A44F-4BB5E0BFD71E |
| 76 | OFF | 151 | 4976 | 6EA9C255-DA32-4F7B-870C-F7AE6F8A8CD2 |
| 76 | ON | 152 | 4977 | 84523ABA-F6FD-4555-A265-3C703874A2EB |
| 77 | OFF | 153 | 4978 | 7B96555A-77A1-4ABA-821F-2CDB679B8F93 |
| 77 | ON | 154 | 4980 | 31108938-612E-4BF0-88E8-3A522D4C0C40 |
| 78 | OFF | 155 | 4981 | 737C5B66-F2EF-4E10-AE64-1E002079D2BC |
| 78 | ON | 156 | 4982 | 98299B96-F6B2-4253-9DDA-041A36FBCC3D |
| 79 | OFF | 157 | 4983 | 1BCA6DC5-B503-4D3A-A118-271383DFCA12 |
| 79 | ON | 158 | 4984 | 82BD8E6A-ADD6-44D0-BA9D-FA4278029EAA |
| 80 | OFF | 159 | 4985 | D56C64BB-2035-4619-9E0A-023ACEE717EE |
| 80 | ON | 160 | 4986 | BA803FF0-9A3A-4F7C-A99C-9181EE9D86C3 |
| 81 | OFF | 161 | 4987 | 771C0088-724F-4B6A-A4CF-E8DCF5E13EAB |
| 81 | ON | 162 | 4989 | A1BA40B7-D219-4E98-B9FF-85DE6737B22E |
| 82 | OFF | 163 | 4990 | 20E4E22D-D637-4151-BEBE-8AE665A166A3 |
| 82 | ON | 164 | 4991 | A052E82B-C69F-4BB6-A63F-06B4932ED2D6 |
| 83 | OFF | 165 | 4992 | 59CF3470-DD23-4430-9A26-4FD1366CBD04 |
| 83 | ON | 166 | 4993 | B90C75E6-A68B-4BF1-AB6E-08728C9B5C94 |
| 84 | OFF | 167 | 4994 | DA42D9FB-95D3-44B6-BE3D-B9CDA8A44CA9 |
| 84 | ON | 168 | 4995 | 42E73537-40C8-433C-A4BA-63377D6B0EF4 |
| 85 | OFF | 169 | 4996 | EDB16A49-CA82-4A9F-B89C-9046CEC04018 |
| 85 | ON | 170 | 4997 | EE39C1F3-D72A-4F37-8993-4C9D419E8C68 |
| 86 | OFF | 171 | 4999 | 280CC416-0233-4043-84AD-CC18F8FE9995 |
| 86 | ON | 172 | 5000 | 37E93301-F6AA-49FD-AB4C-705CE4A790FF |
| 87 | OFF | 173 | 5001 | E6FD52B3-8A79-4875-A075-73419B8649BE |
| 87 | ON | 174 | 5002 | 4E10B8A2-ECFE-41B0-A187-216DBFCECFCB |
| 88 | OFF | 175 | 5003 | 7CC553BD-82D9-4BC0-B0AA-E21FA04251DE |
| 88 | ON | 176 | 5004 | 30A668A0-7756-411F-86E0-8888AD6F2514 |
| 89 | OFF | 177 | 5005 | 72FB8A4C-C2B8-413B-A299-766A01D103DB |
| 89 | ON | 178 | 5006 | EAE3E873-40B7-4E0E-9C4D-741CD82BDC5A |
| 90 | OFF | 179 | 5007 | E1900AD6-39D8-46BD-B85C-D01478D02733 |
| 90 | ON | 180 | 5009 | BDD1B5AF-E8FF-4DDC-BC64-9A08A99D461D |
| 91 | OFF | 181 | 5010 | AA0885F4-1E89-4B6C-A7DD-3C4232F6652F |
| 91 | ON | 182 | 5011 | BBA28225-90C1-466E-9EEE-CFE4271E9471 |
| 92 | OFF | 183 | 5012 | 750F6172-3ECA-49F1-BBEA-DAECE30B2E61 |
| 92 | ON | 184 | 5013 | 599A20FF-66F9-4F21-BCBF-AE02CC571C2C |
| 93 | OFF | 185 | 5014 | 38926C7A-208A-4839-8821-C93AA20F03D1 |
| 93 | ON | 186 | 5015 | 70DF494A-E254-435A-8845-065FAFDD85AD |
| 94 | OFF | 187 | 5016 | 7810E0E2-2FE8-47AB-BFB3-E07AE40906CB |
| 94 | ON | 188 | 5018 | 3E963B6B-D422-4965-A900-AD85D3AEBA67 |
| 95 | OFF | 189 | 5019 | 2BB2993B-3347-411E-9895-0F03AF75488B |
| 95 | ON | 190 | 5020 | 3D6DBE7F-7C7A-49B5-A6E0-7B9DFEF5A408 |
| 96 | OFF | 191 | 5021 | 49AC08AC-737B-45B8-9D9C-07FCD7B1CEA7 |
| 96 | ON | 192 | 5022 | 92C867EF-01ED-46EF-BB25-A33043355A29 |
| 97 | OFF | 193 | 5023 | 792DD744-1E2A-4CEF-8ABD-A5F2377747B9 |
| 97 | ON | 194 | 5024 | A8B5A01B-A075-4534-8E84-364B458F29AA |
| 98 | OFF | 195 | 5025 | 067E7207-1DEB-4D6C-9ECD-266FDCF19CF0 |
| 98 | ON | 196 | 5026 | C6939AB5-93F4-4211-8B9D-49D28F768E7B |
| 99 | OFF | 197 | 5028 | 8360133B-B75C-4EC5-8EA1-BB581B66AD8A |
| 99 | ON | 198 | 5029 | 800FB105-6180-4A8B-B6C4-2002D7567A0F |
| 100 | OFF | 199 | 5030 | 6EA16E06-4199-4C1F-AD99-DAB0264F1E73 |
| 100 | ON | 200 | 5031 | 00A93880-FA9A-46D2-BE84-7580D84E7A33 |
