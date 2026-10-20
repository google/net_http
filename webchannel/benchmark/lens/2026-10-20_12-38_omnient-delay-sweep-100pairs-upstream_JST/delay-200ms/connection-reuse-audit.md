# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 105.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 139.000 | 76.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 59.000 | 41.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | failed | 400 | handshake | h2 | false | 250.000 | 34.000 | 192.178.226.81 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 41.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | not sent | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 62.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 52.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 37.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 42.000 | 33.000 | 192.178.226.81 |
| omnient | 7 | ON | completed | not sent | handshake | h2 | false | 48.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 75.000 | 47.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 26.000 | 18.000 | 192.178.226.81 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 157.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | not sent | handshake | h2 | false | 52.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 60.000 | 31.000 | 192.178.226.81 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 56.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 99.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | not sent | handshake | h2 | false | 33.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 33.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 55.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | not sent | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 54.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 43.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | not sent | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 78.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | not sent | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | not sent | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 61.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 53.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | not sent | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | not sent | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | not sent | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 55.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | not sent | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | not sent | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | 400 | handshake | h2 | false | 367.000 | 344.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 47.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | not sent | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 46.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | not sent | handshake | h2 | false | 38.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | not sent | handshake | h2 | false | 36.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 154.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 79.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | not sent | handshake | h2 | false | 39.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 28.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 62.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | not sent | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 91.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | not sent | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | not sent | handshake | h2 | false | 40.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 36.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | not sent | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | not sent | handshake | h2 | false | 54.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | not sent | handshake | h2 | false | 57.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | not sent | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 34.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | not sent | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | not sent | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | not sent | handshake | h2 | false | 57.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | not sent | handshake | h2 | false | 55.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | not sent | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | not sent | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 338.000 | 321.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 36.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | not sent | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 54.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | not sent | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | not sent | handshake | h2 | false | 18.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 28.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 55.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | not sent | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 31.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | not sent | handshake | h2 | false | 57.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 400 | handshake | h2 | false | 57.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 55.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | not sent | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 42.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 53.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | not sent | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 56.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | not sent | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 34.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | not sent | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 57.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 66.000 | 22.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 205.739 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 207.260 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 203.022 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 200.770 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 205.803 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 200.710 | count=0 | early POST | post-open POST |
| omnient | 4 | OFF | 205.321 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 205.573 | count=0 | post-open POST | post-open POST |
| omnient | 5 | OFF | 200.355 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 206.240 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 202.773 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 200.879 | count=0 | early POST | post-open POST |
| omnient | 7 | OFF | 202.300 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 205.524 | count=0 | post-open POST | post-open POST |
| omnient | 8 | OFF | 204.768 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 208.668 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 208.347 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 201.958 | count=0 | post-open POST | post-open POST |
| omnient | 10 | OFF | 205.255 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 206.649 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 207.919 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 207.771 | count=0 | post-open POST | post-open POST |
| omnient | 12 | OFF | 206.745 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 201.596 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 200.815 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 208.368 | count=0 | post-open POST | post-open POST |
| omnient | 14 | OFF | 207.764 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 207.772 | count=0 | post-open POST | post-open POST |
| omnient | 15 | OFF | 207.403 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 202.164 | count=0 | post-open POST | post-open POST |
| omnient | 16 | OFF | 204.689 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 200.550 | count=0 | post-open POST | post-open POST |
| omnient | 17 | OFF | 208.395 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 204.280 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 205.123 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 200.562 | count=0 | post-open POST | post-open POST |
| omnient | 19 | OFF | 202.049 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 203.267 | count=0 | post-open POST | post-open POST |
| omnient | 20 | OFF | 208.121 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 202.746 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 205.530 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 204.948 | count=0 | post-open POST | post-open POST |
| omnient | 22 | OFF | 206.001 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 206.577 | count=0 | post-open POST | post-open POST |
| omnient | 23 | OFF | 209.012 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 204.548 | count=0 | post-open POST | post-open POST |
| omnient | 24 | OFF | 206.388 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 207.566 | count=0 | post-open POST | post-open POST |
| omnient | 25 | OFF | 206.813 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 206.266 | count=0 | post-open POST | post-open POST |
| omnient | 26 | OFF | 206.166 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 203.607 | count=0 | post-open POST | post-open POST |
| omnient | 27 | OFF | 207.406 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 204.605 | count=0 | post-open POST | post-open POST |
| omnient | 28 | OFF | 203.518 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 201.533 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 206.372 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 200.968 | count=0 | post-open POST | post-open POST |
| omnient | 30 | OFF | 208.582 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 202.000 | count=0 | post-open POST | post-open POST |
| omnient | 31 | OFF | 201.759 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 206.388 | count=0 | post-open POST | post-open POST |
| omnient | 32 | OFF | 205.615 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 201.240 | count=0 | post-open POST | post-open POST |
| omnient | 33 | OFF | 207.680 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 202.879 | count=0 | post-open POST | post-open POST |
| omnient | 34 | OFF | 205.078 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 205.452 | count=0 | post-open POST | post-open POST |
| omnient | 35 | OFF | 206.479 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 207.021 | count=0 | post-open POST | post-open POST |
| omnient | 36 | OFF | 201.540 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 205.356 | count=0 | post-open POST | post-open POST |
| omnient | 37 | OFF | 207.421 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 204.355 | count=0 | post-open POST | post-open POST |
| omnient | 38 | OFF | 201.478 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 208.714 | count=0 | post-open POST | post-open POST |
| omnient | 39 | OFF | 203.778 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 207.651 | count=0 | post-open POST | post-open POST |
| omnient | 40 | OFF | 205.519 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 206.011 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 206.452 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 208.699 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 205.769 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 208.427 | count=0 | post-open POST | post-open POST |
| omnient | 43 | OFF | 206.277 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 205.691 | count=0 | post-open POST | post-open POST |
| omnient | 44 | OFF | 205.251 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 206.353 | count=0 | post-open POST | post-open POST |
| omnient | 45 | OFF | 203.118 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 208.557 | count=0 | post-open POST | post-open POST |
| omnient | 46 | OFF | 208.588 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 202.096 | count=0 | post-open POST | post-open POST |
| omnient | 47 | OFF | 206.651 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 206.276 | count=0 | post-open POST | post-open POST |
| omnient | 48 | OFF | 204.232 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 209.397 | count=0 | post-open POST | post-open POST |
| omnient | 49 | OFF | 206.160 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 205.422 | count=0 | post-open POST | post-open POST |
| omnient | 50 | OFF | 205.563 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 206.848 | count=0 | post-open POST | post-open POST |
| omnient | 51 | OFF | 202.258 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 205.939 | count=0 | post-open POST | post-open POST |
| omnient | 52 | OFF | 206.949 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 201.440 | count=0 | post-open POST | post-open POST |
| omnient | 53 | OFF | 205.486 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 201.734 | count=0 | post-open POST | post-open POST |
| omnient | 54 | OFF | 207.457 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 210.063 | count=0 | post-open POST | post-open POST |
| omnient | 55 | OFF | 205.575 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 204.073 | count=0 | post-open POST | post-open POST |
| omnient | 56 | OFF | 200.729 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 206.252 | count=0 | post-open POST | post-open POST |
| omnient | 57 | OFF | 206.097 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 204.011 | count=0 | post-open POST | post-open POST |
| omnient | 58 | OFF | 205.966 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 203.090 | count=0 | post-open POST | post-open POST |
| omnient | 59 | OFF | 205.606 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 202.004 | count=0 | post-open POST | post-open POST |
| omnient | 60 | OFF | 204.283 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 206.950 | count=0 | post-open POST | post-open POST |
| omnient | 61 | OFF | 203.577 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 207.437 | count=0 | post-open POST | post-open POST |
| omnient | 62 | OFF | 206.524 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 208.386 | count=0 | post-open POST | post-open POST |
| omnient | 63 | OFF | 203.410 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 206.193 | count=0 | post-open POST | post-open POST |
| omnient | 64 | OFF | 203.555 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 203.221 | count=0 | post-open POST | post-open POST |
| omnient | 65 | OFF | 201.604 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 205.183 | count=0 | post-open POST | post-open POST |
| omnient | 66 | OFF | 203.389 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 203.735 | count=0 | post-open POST | post-open POST |
| omnient | 67 | OFF | 209.339 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 208.564 | count=0 | post-open POST | post-open POST |
| omnient | 68 | OFF | 207.334 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 206.299 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 205.295 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 200.560 | count=0 | post-open POST | post-open POST |
| omnient | 70 | OFF | 205.949 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 201.060 | count=0 | post-open POST | post-open POST |
| omnient | 71 | OFF | 207.834 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 208.374 | count=0 | post-open POST | post-open POST |
| omnient | 72 | OFF | 206.583 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 206.336 | count=0 | post-open POST | post-open POST |
| omnient | 73 | OFF | 206.225 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 207.387 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 208.521 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 201.960 | count=0 | post-open POST | post-open POST |
| omnient | 75 | OFF | 200.703 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 208.810 | count=0 | post-open POST | post-open POST |
| omnient | 76 | OFF | 204.720 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 205.593 | count=0 | post-open POST | post-open POST |
| omnient | 77 | OFF | 202.271 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 204.939 | count=0 | post-open POST | post-open POST |
| omnient | 78 | OFF | 202.863 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 208.350 | count=0 | post-open POST | post-open POST |
| omnient | 79 | OFF | 205.943 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 206.854 | count=0 | post-open POST | post-open POST |
| omnient | 80 | OFF | 210.134 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 207.660 | count=0 | post-open POST | post-open POST |
| omnient | 81 | OFF | 208.650 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 205.429 | count=0 | post-open POST | post-open POST |
| omnient | 82 | OFF | 202.080 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 206.448 | count=0 | post-open POST | post-open POST |
| omnient | 83 | OFF | 208.610 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 206.945 | count=0 | post-open POST | post-open POST |
| omnient | 84 | OFF | 200.651 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 201.179 | count=0 | post-open POST | post-open POST |
| omnient | 85 | OFF | 206.123 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 201.769 | count=0 | post-open POST | post-open POST |
| omnient | 86 | OFF | 205.254 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 202.671 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 208.574 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 208.011 | count=0 | post-open POST | post-open POST |
| omnient | 88 | OFF | 206.604 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 204.771 | count=0 | post-open POST | post-open POST |
| omnient | 89 | OFF | 206.334 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 200.306 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 206.641 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 202.579 | count=0 | early POST | post-open POST |
| omnient | 91 | OFF | 204.195 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 205.044 | count=0 | post-open POST | post-open POST |
| omnient | 92 | OFF | 210.347 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 200.355 | count=0 | post-open POST | post-open POST |
| omnient | 93 | OFF | 200.420 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 206.523 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 208.108 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 201.441 | count=0 | post-open POST | post-open POST |
| omnient | 95 | OFF | 202.504 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 206.391 | count=0 | post-open POST | post-open POST |
| omnient | 96 | OFF | 202.348 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 204.790 | count=0 | post-open POST | post-open POST |
| omnient | 97 | OFF | 201.296 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 207.557 | count=0 | post-open POST | post-open POST |
| omnient | 98 | OFF | 208.725 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 203.891 | count=0 | post-open POST | post-open POST |
| omnient | 99 | OFF | 205.051 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 204.030 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 207.309 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 200.532 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 3/100 ON trials. Of those trials, 2 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 2, 28, 73, 86. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 2 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 2112 | 7CEF6156-EFA1-4628-B77D-A49ECF5E8DC4 |
| 1 | ON | 2 | 2113 | 9BA1C9FE-B86B-4C95-B7C7-B44B5585387B |
| 2 | OFF | 3 | 2114 | 9AFF150B-FFF4-4D74-A22C-579642602958 |
| 2 | ON | 4 | 2115 | AD3ED90C-4DB8-438F-B2E4-83424E4CD907 |
| 3 | OFF | 5 | 2117 | 11954E8E-5914-47F2-82A1-46B0EE7ACCB0 |
| 3 | ON | 6 | 2118 | 2F17C16C-83EC-4FCA-9725-E664C232576A |
| 4 | OFF | 7 | 2120 | 29A04E2E-FC76-492A-94F1-C9D55023B090 |
| 4 | ON | 8 | 2121 | 469279F7-6813-4FCA-B695-43B36C4AC2BF |
| 5 | OFF | 9 | 2122 | B358F231-763F-45E0-94A7-DF23897EC58B |
| 5 | ON | 10 | 2123 | 410EFDF7-8D93-410C-9C1B-CDCF541B1B95 |
| 6 | OFF | 11 | 2124 | 3A3DC9C2-BF79-40D6-B9FF-528A389DFDB3 |
| 6 | ON | 12 | 2125 | 4630F964-E052-4BAF-A795-F85A06A9E467 |
| 7 | OFF | 13 | 2127 | A473F7DA-2C32-4F38-A693-1F0EFC9AD445 |
| 7 | ON | 14 | 2128 | D92E6E5D-07D0-4776-BB4C-2326E0702EF6 |
| 8 | OFF | 15 | 2130 | 5B578D1C-222B-49E8-B039-3B2B198BADFC |
| 8 | ON | 16 | 2131 | 58D8C17E-A64D-4C6B-BD9A-4DCB78288943 |
| 9 | OFF | 17 | 2133 | 21F3D70F-63D4-4447-9BAF-22649A0EC318 |
| 9 | ON | 18 | 2134 | 364E8A93-48FB-4710-B8B2-637B5CFCB73C |
| 10 | OFF | 19 | 2135 | 4CE728BA-97A2-46CD-80A1-FF1A891E5572 |
| 10 | ON | 20 | 2136 | 291B6AFF-4295-4DB9-8D9E-DF09A758D9DF |
| 11 | OFF | 21 | 2138 | E8D3B2DD-4948-44C5-8775-5EC6E5EDE46B |
| 11 | ON | 22 | 2139 | 5ABFA8DE-2147-4244-B21C-12A4952B4B65 |
| 12 | OFF | 23 | 2140 | F3CFBE48-56B5-45CF-A913-FCEF337397F3 |
| 12 | ON | 24 | 2141 | 4802DFC5-0C65-4ADE-BA6A-B02A63DEC1C2 |
| 13 | OFF | 25 | 2143 | DE9DE68C-FF78-425B-B27E-09A7EAFB9FFA |
| 13 | ON | 26 | 2144 | A9D5F8DA-63CC-41EA-A09C-678D175E9B19 |
| 14 | OFF | 27 | 2145 | C50905FC-278A-47B1-819C-5630869B0AE5 |
| 14 | ON | 28 | 2146 | 3CB0C4FD-9C16-4C23-B661-13DBFDD8BDB6 |
| 15 | OFF | 29 | 2148 | E9B1F1AF-B198-45AA-AF70-865DAEAD8FC0 |
| 15 | ON | 30 | 2149 | 34C0A5C5-A4B8-4DA8-A5D1-E0950C068829 |
| 16 | OFF | 31 | 2150 | DBD2B0F7-C5EC-4FA9-94DD-0B4F5E71F056 |
| 16 | ON | 32 | 2151 | 863CA4CF-0D46-4193-A216-9DFE190589C8 |
| 17 | OFF | 33 | 2152 | 6D219ED1-6457-47B5-B22E-A15205353C2D |
| 17 | ON | 34 | 2153 | 35BDBD7A-6A36-4E12-B350-7E73CDF1CC2F |
| 18 | OFF | 35 | 2154 | 68BCE379-6A8D-40F4-A555-DBDA3182F7EB |
| 18 | ON | 36 | 2155 | F49FA66B-AD0B-405D-9D1B-22695D328B6B |
| 19 | OFF | 37 | 2157 | BBC94B37-2646-45A1-BF61-14F976A4358A |
| 19 | ON | 38 | 2158 | D2704A83-4351-4F72-AAC3-2C9959AD52BC |
| 20 | OFF | 39 | 2159 | F46D92AA-4F00-49D2-A0CA-549CDB936A02 |
| 20 | ON | 40 | 2160 | 10AF5C01-2AD5-4795-B071-A6F005DFEB03 |
| 21 | OFF | 41 | 2161 | 6C92E1C9-6E8C-45A9-9625-1F76DD1A45AE |
| 21 | ON | 42 | 2162 | E14A6A7E-FFA7-4A3D-BD96-D07916C40588 |
| 22 | OFF | 43 | 2163 | 5547B44E-B5CF-4DDF-89C8-0789FFDEECD0 |
| 22 | ON | 44 | 2165 | D7BB33A9-9A9E-4F4A-8739-790F3828E41B |
| 23 | OFF | 45 | 2167 | 25E4E5DC-49EC-4FEC-B3F1-7262814755B2 |
| 23 | ON | 46 | 2168 | 9AAF501E-4F61-4F9F-9F2C-96F7533BB0EC |
| 24 | OFF | 47 | 2169 | ED2D0F09-AD8E-408D-BC33-FD47797EA976 |
| 24 | ON | 48 | 2170 | 5B4C3703-B2C1-4DDE-86A1-C95E75431FAD |
| 25 | OFF | 49 | 2171 | BE3930C2-EA24-4751-A1DE-49DA1D97F753 |
| 25 | ON | 50 | 2172 | B915F8F3-EF16-408D-A6D3-ED12FB33A047 |
| 26 | OFF | 51 | 2173 | A2AD888C-9BE7-448F-BFA2-B329240E64F2 |
| 26 | ON | 52 | 2175 | 89F2A5A8-A445-4D97-8E1A-C0C117BEC75F |
| 27 | OFF | 53 | 2176 | DBF53565-88B2-42CD-A1C7-72951D07756F |
| 27 | ON | 54 | 2177 | 608DF819-D2A0-489E-984E-70DDA68C8C29 |
| 28 | OFF | 55 | 2178 | 495D3593-7848-4320-8311-E8157636ED91 |
| 28 | ON | 56 | 2179 | 944C446B-2362-452E-AD82-1E7E7FE74CD2 |
| 29 | OFF | 57 | 2180 | E87101C3-034E-4052-81EF-42F0F05A21D4 |
| 29 | ON | 58 | 2181 | 6686E032-140C-452A-9727-7A8441D3C23E |
| 30 | OFF | 59 | 2182 | 75874CEF-A0B3-480F-A36E-2BAC21FF41B9 |
| 30 | ON | 60 | 2184 | 5AA4888A-95FC-4862-AACF-5CBA5C99E162 |
| 31 | OFF | 61 | 2185 | 577CE2EF-6E63-4D6C-9235-5E72339FAB8D |
| 31 | ON | 62 | 2186 | 67DE3528-47E2-4371-946E-40D5F632E830 |
| 32 | OFF | 63 | 2187 | 75474136-6794-4CB7-A1D9-E9B4930D2ED6 |
| 32 | ON | 64 | 2188 | D98DED67-902E-4CAD-B0ED-9C5EFEECC3C2 |
| 33 | OFF | 65 | 2189 | 7A934984-9652-4AEB-B45F-59F9295A1B6E |
| 33 | ON | 66 | 2190 | 27CA5BDA-CCA5-42B2-B255-FAB00CE0CCCC |
| 34 | OFF | 67 | 2191 | 8211DEF4-D4BB-4AEF-8BE3-5E2ED3D68B0D |
| 34 | ON | 68 | 2193 | FCDA37FC-8CC7-4FB0-AFD8-796E8AFEFDA0 |
| 35 | OFF | 69 | 2194 | 80ED531C-534A-4148-83D0-82CDCF0F4C97 |
| 35 | ON | 70 | 2195 | 11E9F49F-139A-4BB1-B866-86D7DB39A365 |
| 36 | OFF | 71 | 2196 | 685D8F13-A25B-47FE-AC49-50C5EAD24871 |
| 36 | ON | 72 | 2197 | 5ADA1D5E-2599-4867-8A57-93C05F58D1BB |
| 37 | OFF | 73 | 2198 | 3A7643B1-ABCD-42A7-B1FE-292E2296B185 |
| 37 | ON | 74 | 2199 | 1A275F80-24DD-442F-A549-0F420E917830 |
| 38 | OFF | 75 | 2200 | C84E06EE-A71A-4CE2-8C63-3A766C19C3A9 |
| 38 | ON | 76 | 2202 | 0CEC6E76-CC32-46D5-A708-0E811A429326 |
| 39 | OFF | 77 | 2203 | 702404D3-4811-4FC8-B227-56A7EA3E2FE5 |
| 39 | ON | 78 | 2204 | B35E4E8E-DE27-4BD9-A29D-C1ECBCCA5E84 |
| 40 | OFF | 79 | 2205 | 613C0B10-3160-44B0-9C00-5CB75AB4F1FA |
| 40 | ON | 80 | 2206 | 2976ED1D-0A92-4E8F-901A-807BB8EC979E |
| 41 | OFF | 81 | 2207 | BA960C40-4B31-4EC4-8775-1F39552AF212 |
| 41 | ON | 82 | 2208 | 301C5A97-0572-4CF2-86BB-073268612C17 |
| 42 | OFF | 83 | 2210 | 962D207C-EB7C-45C1-B9B8-A7360FE69879 |
| 42 | ON | 84 | 2211 | AE4F2334-15EC-45E1-84D2-3B4CC4B3B4BC |
| 43 | OFF | 85 | 2212 | DF42170F-F8D7-443B-81C7-B872C043ED47 |
| 43 | ON | 86 | 2213 | CA919B68-B8F6-4B89-B006-761B46ACF37F |
| 44 | OFF | 87 | 2214 | 45CDBA84-9FD7-4CFB-A5D1-97B8A74B64FB |
| 44 | ON | 88 | 2215 | 3D463435-DC7F-46DF-82FD-BF85EDA95E4B |
| 45 | OFF | 89 | 2216 | C1A9BE3F-5408-4DA1-8DB4-BFFCADE56206 |
| 45 | ON | 90 | 2217 | A144C6F1-7D5F-4B98-93CB-ABD49D9156DC |
| 46 | OFF | 91 | 2219 | 7A181659-3A7F-4C90-A97A-B6285216BB4A |
| 46 | ON | 92 | 2220 | A070E987-8FB5-42A6-B623-9F47D17F8105 |
| 47 | OFF | 93 | 2221 | 4458AF4B-BAB7-484D-9CFE-EB0298100C33 |
| 47 | ON | 94 | 2222 | 792FE550-8BBC-4CE0-AA79-2FD7E72D89D6 |
| 48 | OFF | 95 | 2223 | 5D38B1FD-01B1-47DA-AD55-10F23537B38D |
| 48 | ON | 96 | 2224 | A6EA9DDD-F3CD-4673-BBBE-77F824B35CE7 |
| 49 | OFF | 97 | 2225 | 2CEBECED-1398-461D-9EFF-FFFC9546E5EE |
| 49 | ON | 98 | 2226 | 753CEE2D-BB24-4284-8616-F8B2B9571C76 |
| 50 | OFF | 99 | 2228 | 36D65A8A-0DAF-4F76-B642-B65876BCFEC2 |
| 50 | ON | 100 | 2229 | F2F1CA4C-5F89-4FB6-9E8F-505920CB85C1 |
| 51 | OFF | 101 | 2230 | B925A721-D0A5-4DC2-9A27-E39F4E5343CF |
| 51 | ON | 102 | 2231 | A121F257-E2D4-4477-AF86-F08BF3B6A2A0 |
| 52 | OFF | 103 | 2232 | D406DF13-28FC-41F3-AD24-19B91DEA7308 |
| 52 | ON | 104 | 2233 | 80E79620-0F09-4DA4-BD47-35A1FA4D79D2 |
| 53 | OFF | 105 | 2234 | 945E5703-EBFA-460F-A9D6-FAB03BB7A5C8 |
| 53 | ON | 106 | 2235 | 306DE39E-964F-48F9-842E-9D42A7677BE6 |
| 54 | OFF | 107 | 2237 | 5566943C-EAC7-462C-92B4-5BDFA1A9AFB1 |
| 54 | ON | 108 | 2238 | 166096C7-252A-4BC1-9402-F1AAF2B775F3 |
| 55 | OFF | 109 | 2239 | 4DAAB972-9ABA-4FA3-9B19-6A2AC65415EB |
| 55 | ON | 110 | 2240 | 3576FF01-4981-4923-92A0-0E29AC9A6B71 |
| 56 | OFF | 111 | 2241 | FEB4D856-10B9-4859-926C-CF6A0918994E |
| 56 | ON | 112 | 2242 | 8DF305F2-C334-4224-B164-8F89C30A554E |
| 57 | OFF | 113 | 2243 | 36253870-AFD8-472F-9654-97B5B4AF252D |
| 57 | ON | 114 | 2244 | 2A97A8A3-47E0-45B6-B40B-9FF4DEBEB1CE |
| 58 | OFF | 115 | 2246 | 9CEDEA00-2237-462F-9FBD-ACD3C82CF852 |
| 58 | ON | 116 | 2247 | 0413C49F-5D47-4F86-95A4-A9E7AF9C42EC |
| 59 | OFF | 117 | 2248 | E97C01BF-C1D2-45EE-B110-A060699C89E8 |
| 59 | ON | 118 | 2249 | 4A551CA4-6285-47AB-A4FA-CAE0F89709D9 |
| 60 | OFF | 119 | 2250 | DF9F3587-1127-47DF-9700-DF7991F1AC4B |
| 60 | ON | 120 | 2251 | 8B97E815-5EB8-4EC2-88D0-92119615D0A0 |
| 61 | OFF | 121 | 2252 | BEEF7FCD-E49F-41D0-99F9-6958060D33A1 |
| 61 | ON | 122 | 2253 | 22862F87-DE74-45C0-9C8E-549AD38AD118 |
| 62 | OFF | 123 | 2255 | 83A569BE-2382-4B35-98C8-79E9B668531C |
| 62 | ON | 124 | 2256 | 84F8F295-13FA-49F3-BD40-18CE51639CC1 |
| 63 | OFF | 125 | 2257 | A2A123F1-329C-411F-B1EB-4F240A46ADD6 |
| 63 | ON | 126 | 2258 | CA140E9D-39E2-483E-95BB-219BC90B903E |
| 64 | OFF | 127 | 2259 | E1D2EB0E-53D8-432A-8E9C-9C23122C5FC6 |
| 64 | ON | 128 | 2260 | 6D825DC9-77A8-49E3-A3DF-2E5898F60D6E |
| 65 | OFF | 129 | 2261 | A8A5C1D7-8C25-41F2-8B0A-C2457D9F2CBD |
| 65 | ON | 130 | 2262 | 98C11E3D-8EC8-4F33-9C8D-786E711F1550 |
| 66 | OFF | 131 | 2264 | DDC446E9-C891-43D9-B1D7-BE8ACB101764 |
| 66 | ON | 132 | 2265 | 3291F018-83F9-4CF6-971D-710661416836 |
| 67 | OFF | 133 | 2266 | 563EC818-24B0-4459-9FD8-CBEF82FD2DA7 |
| 67 | ON | 134 | 2267 | 0BB0EF4B-BCC2-4217-B1E0-A36577BCF438 |
| 68 | OFF | 135 | 2268 | 1D487BEC-CFED-45AE-8057-B7A737087F15 |
| 68 | ON | 136 | 2269 | 8FA49F7A-8C94-4B60-98C4-129547011D34 |
| 69 | OFF | 137 | 2270 | D3FC35BC-6CDC-4847-81F0-1BEA3BC4D333 |
| 69 | ON | 138 | 2271 | 99404F0B-4CDA-479C-894E-9ED85379C2B8 |
| 70 | OFF | 139 | 2273 | C5510651-C47E-4B27-8C67-F508DB4AABA7 |
| 70 | ON | 140 | 2274 | CE342566-D11F-4BD0-B37A-9B8053D4F74E |
| 71 | OFF | 141 | 2275 | D2440D2F-ADE6-4016-8E77-0A7BDCE39013 |
| 71 | ON | 142 | 2276 | 022DC384-DCC5-4925-9598-761E3ACBFAC6 |
| 72 | OFF | 143 | 2277 | 21562F34-7EE7-4E48-A275-24E9602B71C4 |
| 72 | ON | 144 | 2278 | 215C2E86-086A-443F-9829-D0AA21F717EE |
| 73 | OFF | 145 | 2279 | 61ACC410-5E03-4AAF-A399-271C026421D3 |
| 73 | ON | 146 | 2280 | 10359B36-71F8-4A8B-BB40-3E47C53CA9F1 |
| 74 | OFF | 147 | 2282 | 6EF34C50-3844-47B5-A591-C5A0F0D61131 |
| 74 | ON | 148 | 2283 | F08D8A95-A681-4425-AC05-BED290378D32 |
| 75 | OFF | 149 | 2284 | 62C01F51-7305-479B-B64A-149DDDF00F6E |
| 75 | ON | 150 | 2285 | BA897F6C-255E-40C4-A106-F205049B48EA |
| 76 | OFF | 151 | 2286 | 37BEE635-FBED-4959-9F8E-8C39F379F9A7 |
| 76 | ON | 152 | 2287 | EFDC5578-FB32-4DF1-810C-2AA4E593604D |
| 77 | OFF | 153 | 2288 | 210CA470-D24E-4F0C-89E7-672D10B9B521 |
| 77 | ON | 154 | 2289 | 0D33D49E-BFAE-4E47-867B-A3CF756958E6 |
| 78 | OFF | 155 | 2291 | 21A832ED-FF04-4E29-B292-6F8D158A537B |
| 78 | ON | 156 | 2292 | 1487AE3E-1EEC-47C0-8648-6FE684B78D94 |
| 79 | OFF | 157 | 2293 | A85A468C-42A6-4AA5-A42A-902012B74EBD |
| 79 | ON | 158 | 2294 | 60C1C6DF-0EED-419C-86F5-4E067796718F |
| 80 | OFF | 159 | 2295 | 53FF15C5-194B-4AD5-AA4A-E1C1A33C2D1E |
| 80 | ON | 160 | 2296 | 196D0FAA-3D90-411E-AD42-269CEBE0D01F |
| 81 | OFF | 161 | 2297 | F53FBF63-2F68-4DEA-84EA-122FAFD787CB |
| 81 | ON | 162 | 2298 | 87FB7824-F52F-4805-A194-37A054DAA1C5 |
| 82 | OFF | 163 | 2300 | FB043B48-0BE0-4783-9B36-66810F34BA2B |
| 82 | ON | 164 | 2301 | 272C233E-2B10-4EB2-8A5C-240625A65D7A |
| 83 | OFF | 165 | 2302 | 84E7640C-F805-470F-BA38-BAAA4151A6CB |
| 83 | ON | 166 | 2303 | AD8001F0-07B5-491C-85BD-62FFB05F3DB8 |
| 84 | OFF | 167 | 2304 | 1E15D9A7-BAFA-4C7D-8B29-FE617462CB97 |
| 84 | ON | 168 | 2305 | F992CF87-50BB-44C5-8CBE-CBEFDE1F048B |
| 85 | OFF | 169 | 2306 | BB972B84-522A-47DC-9C0D-9F5F83EBC4CD |
| 85 | ON | 170 | 2308 | 7ABD3B4C-DB6F-4C81-A8F7-3BD353404F31 |
| 86 | OFF | 171 | 2309 | 5525145B-D818-4EEF-A568-509A1A8B927E |
| 86 | ON | 172 | 2310 | 43648229-77D7-4AFA-BF4B-70B76735D56F |
| 87 | OFF | 173 | 2311 | 911F324D-B505-490F-8324-FDD28ED1E0AD |
| 87 | ON | 174 | 2312 | CA93AC4E-B483-42F6-8D0A-E6F32CAF693E |
| 88 | OFF | 175 | 2313 | D9E42D1B-7EA6-4027-B63F-68243856685C |
| 88 | ON | 176 | 2314 | EC054802-50A7-40D3-B0F5-7A04CE5BDB66 |
| 89 | OFF | 177 | 2315 | DA3633F9-D331-45F8-9FDE-E7E741684EAB |
| 89 | ON | 178 | 2317 | 1D9E8D79-5CDD-44AD-A0AF-2197B8257BC2 |
| 90 | OFF | 179 | 2318 | 5C210945-475A-44A4-A538-E1638231F5E4 |
| 90 | ON | 180 | 2319 | 246BF57D-D7FA-4411-B470-5B4BCEEF0075 |
| 91 | OFF | 181 | 2320 | 2DC5DB3B-E1CA-4E12-9063-712C3C98489E |
| 91 | ON | 182 | 2321 | 9D6A97A0-9098-40C7-B0F2-A7A9C78C38F6 |
| 92 | OFF | 183 | 2322 | E92198A6-1749-4566-B635-08A7365B4D82 |
| 92 | ON | 184 | 2323 | 350106DB-AC90-4ADA-A036-8D70867CA020 |
| 93 | OFF | 185 | 2324 | 211AD815-EA8F-4E01-9B47-742EFBA57EA3 |
| 93 | ON | 186 | 2326 | CC0F79BD-42F9-4552-8C74-81E1C9A99845 |
| 94 | OFF | 187 | 2327 | 32778698-1A4C-4CF1-BE7A-AB913B488C88 |
| 94 | ON | 188 | 2328 | 8B5153C3-0BBB-482A-AE3E-3DA00E81AC83 |
| 95 | OFF | 189 | 2329 | E6212A8A-4851-465C-B218-D8FF49D427C4 |
| 95 | ON | 190 | 2330 | 9E2D2C79-323A-4706-9A01-53089440BD6B |
| 96 | OFF | 191 | 2331 | C9393B2F-4E1E-4DE7-A5D0-A46CE301FB28 |
| 96 | ON | 192 | 2332 | 72E872B6-309B-4FFD-B0F0-4204D49F5E4D |
| 97 | OFF | 193 | 2333 | 37EB58D5-4E35-4C62-8039-FB562424E70F |
| 97 | ON | 194 | 2335 | D6F60783-C08B-4572-A8FB-4DAE8D3BC2AF |
| 98 | OFF | 195 | 2336 | B2EA30B4-A83D-4EB1-AFFA-6E84F28850F7 |
| 98 | ON | 196 | 2337 | 14DA695D-B490-4CFD-AA2B-79E53F84F2E2 |
| 99 | OFF | 197 | 2338 | BCFD7090-C8EC-4F86-8DCA-1FF5472FE803 |
| 99 | ON | 198 | 2339 | 5689416E-E2A3-484E-B407-CF779ED16A22 |
| 100 | OFF | 199 | 2340 | 929C303F-3926-4069-ACEE-0EF2B4A6145F |
| 100 | ON | 200 | 2341 | 4BDB1E67-6911-440A-B491-5A89E6844690 |
