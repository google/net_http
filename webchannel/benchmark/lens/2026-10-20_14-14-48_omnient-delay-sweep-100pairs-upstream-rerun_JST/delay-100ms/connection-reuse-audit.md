# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 32.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 63.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 55.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 61.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 55.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | ON | completed | 400 | handshake | h2 | false | 303.000 | 294.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 18.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 34.000 | 16.000 | 192.178.226.81 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 63.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 38.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 39.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 57.000 | 42.000 | 2404:6800:400b:c015::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 60.000 | 29.000 | 2404:6800:400b:c015::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c015::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 51.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 28.000 | 22.000 | 2404:6800:400b:c015::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 41.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c015::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 44.000 | 31.000 | 2404:6800:400b:c015::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 49.000 | 36.000 | 2404:6800:400b:c015::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 41.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 51.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 300.000 | 287.000 | 2404:6800:400b:c015::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 22.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 42 | ON | completed | 400 | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c015::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 347.000 | 330.000 | 2404:6800:400b:c015::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 308.000 | 296.000 | 2404:6800:400b:c015::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 26.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 37.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 62.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 52.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 54.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 60.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 56 | ON | failed | 400 | handshake | h2 | false | 119.000 | 42.000 | 2404:6800:400b:c015::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 32.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 39.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 303.000 | 292.000 | 2404:6800:400b:c015::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 312.000 | 299.000 | 2404:6800:400b:c015::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 56.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 73.000 | 25.000 | 2404:6800:400b:c015::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 48.000 | 37.000 | 2404:6800:400b:c015::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 39.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 43.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 33.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 31.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 34.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 55.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 53.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 58.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 55.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 26.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 20.000 | 11.000 | 2404:6800:400b:c015::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 33.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 27.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 58.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c015::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 20.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 33.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 36.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 35.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 58.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 103.689 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 103.600 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 102.517 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 101.318 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 101.026 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 104.027 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 101.346 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 101.469 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 102.233 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 100.819 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 103.705 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 103.694 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 100.958 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 104.815 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 103.671 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 103.442 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 105.264 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 100.559 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 102.280 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 103.647 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 102.150 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 102.621 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 101.915 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 100.653 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 101.143 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 103.753 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 103.673 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 102.485 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 102.265 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 102.560 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 102.158 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 101.379 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 102.985 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 103.648 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 100.854 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 103.434 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 102.223 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 100.551 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 103.339 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 102.004 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 104.434 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 102.630 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 102.814 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 100.490 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 101.802 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 104.066 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 101.331 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 101.293 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 108.950 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 105.034 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 103.878 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 105.346 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 101.724 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 103.779 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 105.187 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 104.695 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 103.391 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 101.083 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 104.141 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 102.761 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 103.118 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 104.606 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 103.144 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 102.286 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 101.317 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 100.781 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 102.596 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 103.127 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 100.979 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 100.267 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 102.412 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 100.335 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 100.739 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 100.709 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 103.501 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 103.778 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 104.913 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 103.792 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 104.365 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 100.871 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 104.699 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 100.983 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 102.254 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 100.701 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 100.547 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 104.331 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 102.784 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 103.721 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 104.227 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 102.081 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 105.413 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 101.933 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 100.821 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 104.591 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 106.686 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 104.314 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 103.552 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 104.061 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 102.446 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 100.691 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 102.747 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 103.113 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 102.544 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 104.003 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 101.280 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 102.052 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 103.579 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 104.289 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 100.968 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 101.780 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 101.110 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 100.739 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 103.847 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 103.862 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 101.244 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 100.799 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 102.849 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 100.457 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 103.695 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 101.904 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 103.187 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 102.903 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 104.052 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 100.804 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 103.631 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 103.699 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 104.308 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 101.443 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 101.712 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 101.217 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 103.259 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 103.765 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 100.515 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 105.169 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 104.018 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 102.368 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 104.796 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 103.766 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 103.368 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 103.452 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 103.736 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 105.365 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 101.201 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 100.873 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 104.445 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 105.089 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 101.409 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 105.352 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 100.952 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 104.629 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 104.681 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 103.211 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 105.138 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 103.411 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 101.514 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 105.345 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 101.357 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 105.347 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 102.498 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 101.836 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 104.439 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 104.133 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 101.806 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 100.532 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 100.828 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 102.496 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 106.738 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 101.467 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 100.911 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 103.664 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 103.661 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 102.312 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 102.815 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 101.404 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 104.820 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 104.245 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 102.310 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 101.797 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 100.735 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 102.221 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 105.349 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 103.431 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 105.351 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 102.097 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 103.980 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 102.758 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 103.844 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 103.207 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 101.723 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 103.726 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 100.689 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 103.817 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 102.435 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 101.167 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 102.296 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 100.895 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 101.871 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 103.742 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 100.934 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 105.441 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 100 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 3/100 ON trials. Of those trials, 2 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 8, 38, 42. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 56 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 3330 | B7119993-145E-422C-8782-817EAE9A39C9 |
| 1 | ON | 2 | 3331 | 89AE5D08-FFD2-460C-9494-C518F69F57B5 |
| 2 | OFF | 3 | 3332 | 2975478A-5FB3-4B17-81C3-C49F8AF54608 |
| 2 | ON | 4 | 3333 | BE413C78-4A3E-421B-AFC6-836CB8E23A8B |
| 3 | OFF | 5 | 3334 | 24421CED-C9F6-4FD7-AF80-23816FDEBD0F |
| 3 | ON | 6 | 3336 | 011D9FD3-E11E-4A90-8A2A-8311F0D02692 |
| 4 | OFF | 7 | 3337 | 34B12629-76D9-436D-8507-295471FEEECF |
| 4 | ON | 8 | 3338 | C64304E5-C568-4C4C-93A6-59A8F3DA7EED |
| 5 | OFF | 9 | 3339 | 29A91EFF-276B-47CB-9C40-8A046E759500 |
| 5 | ON | 10 | 3340 | BE0B174D-99A9-462A-AFF2-1DA0D5AF02C9 |
| 6 | OFF | 11 | 3341 | 761BEE7C-2852-40F5-958C-767B006AAE4F |
| 6 | ON | 12 | 3342 | 0BC4BE4D-7F4E-4DCD-BD0F-7793ED0D1BC4 |
| 7 | OFF | 13 | 3343 | 53BF2BEC-A358-4630-995F-17A25C6750A8 |
| 7 | ON | 14 | 3344 | E265150F-50C9-40F4-81B3-E3937535DF0D |
| 8 | OFF | 15 | 3346 | B8C44B18-317F-41D0-B63F-110C64B4732E |
| 8 | ON | 16 | 3347 | E1AE187C-6672-4B5A-A44D-4506A4FE7B79 |
| 9 | OFF | 17 | 3348 | 615AB1C5-FE86-4839-86FB-EBFB90322E0E |
| 9 | ON | 18 | 3349 | 807E51F0-EB43-424D-B97A-E2AB963738C1 |
| 10 | OFF | 19 | 3350 | 5D534A46-041F-4A4F-B3D5-93A9277D0C08 |
| 10 | ON | 20 | 3351 | 9845602C-BCAB-4813-AFF5-10D76031D2BC |
| 11 | OFF | 21 | 3352 | 2B5215D6-9EFA-48CF-8368-01588067416D |
| 11 | ON | 22 | 3353 | 46B31F85-CDEE-4F0C-AA74-CBE14B6F4B6D |
| 12 | OFF | 23 | 3355 | 17B10AFD-3297-43F3-B496-8588A20DC508 |
| 12 | ON | 24 | 3356 | EA855410-E4AD-4952-94A5-2E2CAD667359 |
| 13 | OFF | 25 | 3357 | 5D12B44D-B8DA-425A-B3B8-CB024E939236 |
| 13 | ON | 26 | 3358 | BDE95B42-62C8-455F-ADFB-9B95D465EFFC |
| 14 | OFF | 27 | 3359 | A8EF0473-2B2C-43A3-8847-15C6210FC3C2 |
| 14 | ON | 28 | 3360 | 89839B15-12C4-4186-B4BC-2B15A72D1609 |
| 15 | OFF | 29 | 3361 | 5B3AC709-1CF4-4A37-95E0-0D4CD24E9E99 |
| 15 | ON | 30 | 3362 | A5EAE4F8-C116-485C-80CD-80C567ACC3E6 |
| 16 | OFF | 31 | 3364 | 65B306C2-F549-4E65-A89F-A25F61E3918D |
| 16 | ON | 32 | 3365 | 8DA28860-24EF-45C1-B42D-86867CE68926 |
| 17 | OFF | 33 | 3366 | CFF30F62-1BF8-41E2-8274-027A246B6A4A |
| 17 | ON | 34 | 3367 | 1CF0C594-0BEB-44C9-8143-850BDA13AB93 |
| 18 | OFF | 35 | 3368 | 37FC7233-1B98-4D6E-8791-9A8CD0A3608F |
| 18 | ON | 36 | 3369 | 50D9345D-E62F-4B2A-A5A1-A50B4D340A7C |
| 19 | OFF | 37 | 3370 | C1FE79B7-33FD-4B29-9F5A-02089BF02E74 |
| 19 | ON | 38 | 3371 | 2C132CDD-35BC-46A0-8C89-263CD6157E88 |
| 20 | OFF | 39 | 3372 | 854F2FE4-C0E6-4652-BE64-77DA54E6E5F0 |
| 20 | ON | 40 | 3374 | 5A68106E-3DB7-42F2-8978-5A623CEDDA2B |
| 21 | OFF | 41 | 3375 | 72681EF1-0062-4661-974B-0AA6D74F8D33 |
| 21 | ON | 42 | 3376 | 897940C6-AE43-45A0-8336-AA78E87E13D3 |
| 22 | OFF | 43 | 3377 | 01934852-DCF3-47B3-AB5E-CB37B812D89F |
| 22 | ON | 44 | 3378 | 653A7C50-B881-4646-807C-454F375ACE76 |
| 23 | OFF | 45 | 3379 | 6553C21C-D417-4673-8C98-AF58831AD5F3 |
| 23 | ON | 46 | 3380 | E3989C1A-9B7D-4CA2-BCFC-5D06405258CF |
| 24 | OFF | 47 | 3381 | FDE50A94-B871-42D1-8B80-0177F5F58394 |
| 24 | ON | 48 | 3383 | 5DAD4C64-3479-465B-915F-A9B67CFB09B0 |
| 25 | OFF | 49 | 3384 | 84DB1C7B-5A70-4D00-9F8F-CE3DC2E33928 |
| 25 | ON | 50 | 3385 | 6ABF21BA-3664-461F-94DF-414B30DF7B63 |
| 26 | OFF | 51 | 3386 | 9FA927BF-F329-4F59-AB0D-03B27716574E |
| 26 | ON | 52 | 3387 | 684DF705-7DD1-481E-AF7C-1AEAF62E279C |
| 27 | OFF | 53 | 3388 | FAC2C7B9-F109-4347-9E11-026116A0C364 |
| 27 | ON | 54 | 3389 | FCF81F42-B7D7-4945-BD26-BE7879207076 |
| 28 | OFF | 55 | 3390 | 5E594881-4CE9-423F-BCE9-41257C49B80B |
| 28 | ON | 56 | 3391 | E71E8B2D-92CD-4F7B-B384-0A1620422E9C |
| 29 | OFF | 57 | 3393 | FD4F755B-DDD2-4F44-B549-80811E1096B3 |
| 29 | ON | 58 | 3394 | 55D215C8-68EB-48BD-8DDC-CC1B0599AAA4 |
| 30 | OFF | 59 | 3395 | 30E937AE-3476-46C9-8B32-87810DB6E4BE |
| 30 | ON | 60 | 3396 | DC80C4B2-6BAA-44AA-821B-0A3186D3EB72 |
| 31 | OFF | 61 | 3397 | 8E8638CE-834F-4894-AB3F-74016D113E66 |
| 31 | ON | 62 | 3398 | FD303038-FE29-414F-A08E-8496EAA486CB |
| 32 | OFF | 63 | 3399 | BC3FF2DF-72C9-4C91-BE0C-267D1F39843F |
| 32 | ON | 64 | 3401 | 3C2FC01C-695B-4AD0-A018-D986448CD632 |
| 33 | OFF | 65 | 3402 | 8484A74C-B290-492D-BDD7-78C0BCFFE0C6 |
| 33 | ON | 66 | 3403 | 9F61D142-67B8-49EB-8E2A-B14114E906E5 |
| 34 | OFF | 67 | 3404 | 0F5C6A52-FDCE-4584-80B0-6B1E0AA2932A |
| 34 | ON | 68 | 3405 | F050EF26-6040-45B3-B969-A8413F87C430 |
| 35 | OFF | 69 | 3406 | 886D22FB-AEB3-4AE6-89F8-20A5EDE319C1 |
| 35 | ON | 70 | 3407 | F2BED96C-8E13-49FF-BD1D-12947778C10E |
| 36 | OFF | 71 | 3408 | B83E010C-CE7B-4F40-BF6A-FF4AC2CC6001 |
| 36 | ON | 72 | 3409 | A0B35B66-80D6-42B8-9FDB-31D8B68D30E1 |
| 37 | OFF | 73 | 3411 | 17B85CF8-4E49-4646-941B-A8B4347BEAA1 |
| 37 | ON | 74 | 3412 | E45DEAC1-B063-4194-9036-E43BD636AE38 |
| 38 | OFF | 75 | 3413 | C4EFDF5B-10F0-477E-A603-8FB7AD1F417E |
| 38 | ON | 76 | 3414 | 9EE7640F-B9DB-4A6A-8E3A-9111B193BD80 |
| 39 | OFF | 77 | 3415 | D539862E-70B6-4A32-AAC0-A36AD236FAFD |
| 39 | ON | 78 | 3416 | 2BD3BF36-763A-4692-81F5-8A5EC059B5E2 |
| 40 | OFF | 79 | 3417 | D369FB22-679A-47D9-9914-202512B2622E |
| 40 | ON | 80 | 3418 | F86FF248-CE21-4495-8302-A80223B88579 |
| 41 | OFF | 81 | 3420 | 511CFE9D-5864-44F2-8603-9E18A661D247 |
| 41 | ON | 82 | 3421 | 1C19C521-7E86-4834-9400-2657061B7662 |
| 42 | OFF | 83 | 3422 | 313A1BB5-40F6-49CF-991E-1E2884CB3110 |
| 42 | ON | 84 | 3423 | C4160B5E-C57A-423E-8B81-088C1557413D |
| 43 | OFF | 85 | 3424 | BB34158E-3EB7-487C-B564-440F07B06F0C |
| 43 | ON | 86 | 3425 | FABCC3E2-F58C-411E-BC37-F3FE23EE533D |
| 44 | OFF | 87 | 3426 | DB11CD8F-0738-411C-BFAA-7BBF0648EC64 |
| 44 | ON | 88 | 3427 | 50718827-5011-428B-8F48-64C823AB512F |
| 45 | OFF | 89 | 3429 | 1E1D8673-362B-4598-9894-8D602EEF274C |
| 45 | ON | 90 | 3430 | 01DA4D39-72B0-4C6F-81EB-FD4471F48D66 |
| 46 | OFF | 91 | 3431 | CCE98896-6E0F-40DB-B87C-284C2617F3EC |
| 46 | ON | 92 | 3432 | 2C0E2430-1B78-43AE-9946-653E4D3FBB88 |
| 47 | OFF | 93 | 3433 | FCEDF62A-8370-4C24-B42E-0CEBCA0B87CD |
| 47 | ON | 94 | 3434 | 461704F0-F42C-4C51-A699-C8754F4E1966 |
| 48 | OFF | 95 | 3435 | 9A6005EC-3424-43E9-95C9-C056B366CD45 |
| 48 | ON | 96 | 3436 | D45AE623-59BD-4D7B-872C-3A5A9F4C51D6 |
| 49 | OFF | 97 | 3438 | 5E646D7A-4B74-42B4-A541-B0AF4CA7E040 |
| 49 | ON | 98 | 3439 | 54593542-4A5D-4CFB-8451-44C869DB0EEE |
| 50 | OFF | 99 | 3440 | 54CDD8CE-48B5-467C-876C-1DFF79FE7D5A |
| 50 | ON | 100 | 3441 | 0A5FB402-3B03-4D4A-9FA2-464B2515296D |
| 51 | OFF | 101 | 3442 | D8C6A663-1DAA-4D10-B17F-036CF59CB850 |
| 51 | ON | 102 | 3443 | 6DB6B8B0-7B0E-483D-8716-62E958E6E324 |
| 52 | OFF | 103 | 3444 | 9CBFA686-F3AB-4A13-8D9A-D642A5292A3D |
| 52 | ON | 104 | 3445 | 2864C8F3-AE68-4135-A081-A7372645F8A3 |
| 53 | OFF | 105 | 3447 | 51E577CF-DE29-41BE-A12D-2D47D616BA5B |
| 53 | ON | 106 | 3448 | 5EF82C83-FF6C-4384-96B9-1219AD32F3EF |
| 54 | OFF | 107 | 3449 | FD4A8F99-FA0F-4180-963D-7F6DC907F239 |
| 54 | ON | 108 | 3450 | AEC0B919-70B4-4127-990F-C77F1879D2E1 |
| 55 | OFF | 109 | 3451 | 2A6DE6DC-FC76-4221-B4C3-3D0D9A247AC8 |
| 55 | ON | 110 | 3452 | FC9FE9A2-A2D2-4588-8839-5DB29C2787D9 |
| 56 | OFF | 111 | 3453 | 92A318FD-1F99-4A6F-B6CD-920CDCE47FC5 |
| 56 | ON | 112 | 3454 | 50157CF7-1506-43D6-8510-1B78A700C9B8 |
| 57 | OFF | 113 | 3455 | CDFB631D-37E1-421E-930A-29D29182AFED |
| 57 | ON | 114 | 3457 | 3023EACB-2C60-4359-9F56-EC217F6BDF42 |
| 58 | OFF | 115 | 3458 | AFDA0AD9-5B5E-4260-97F7-355A219252D4 |
| 58 | ON | 116 | 3459 | 0053237C-861D-4A3C-91D0-E14DA3AA7D2A |
| 59 | OFF | 117 | 3460 | 6154FD9D-4155-49AF-A0FA-7453C4CA558C |
| 59 | ON | 118 | 3461 | 3BC05A91-6289-48B1-BBB4-465BCDE13AEE |
| 60 | OFF | 119 | 3462 | F475A4AF-ACBE-4FF2-80AB-835B28DC3844 |
| 60 | ON | 120 | 3463 | E175DAF1-681C-4F6B-AFED-820BA3D9611E |
| 61 | OFF | 121 | 3464 | 48A28C9F-0457-4028-B28A-769A18858353 |
| 61 | ON | 122 | 3466 | 367AF1CD-2292-41EC-96E1-56B988BB386A |
| 62 | OFF | 123 | 3467 | 321815FC-4E7E-4129-BF19-E503207DC315 |
| 62 | ON | 124 | 3468 | B57D7A5E-036F-4609-9678-AB7F21C41F82 |
| 63 | OFF | 125 | 3469 | 8C01991E-93E8-4034-ADA5-75E93A897A42 |
| 63 | ON | 126 | 3470 | 1D035A08-5C9F-4AA7-8992-4B4143893443 |
| 64 | OFF | 127 | 3471 | C3CC9841-3992-4AB4-B2C9-7DBF60C3A3D4 |
| 64 | ON | 128 | 3472 | 3D8A9CBB-8BDA-4189-8B8B-F5ED65588524 |
| 65 | OFF | 129 | 3473 | 4832C965-9DEB-4A13-AE1D-DFCD238F0A43 |
| 65 | ON | 130 | 3475 | 05DEC66C-01B9-440C-8C2D-2608A76DA0B7 |
| 66 | OFF | 131 | 3476 | 23974D42-07F3-4D35-B4E7-982B33DBA97B |
| 66 | ON | 132 | 3477 | 2439E326-5A06-47F3-9511-F3A143E112F9 |
| 67 | OFF | 133 | 3478 | 242A41BA-763E-4952-A5D8-6C2EEF3BE66C |
| 67 | ON | 134 | 3479 | 3FDD671A-1D0C-4566-B3B1-FC5A69839480 |
| 68 | OFF | 135 | 3480 | 2FEBAE81-AF2A-4DAD-8799-744B0A68A801 |
| 68 | ON | 136 | 3481 | F87694B0-E170-49FA-B184-0C3DAB5C08D5 |
| 69 | OFF | 137 | 3482 | 80DA74EB-98F0-4DD5-9D88-E05C008B9F87 |
| 69 | ON | 138 | 3483 | 7A1E08F3-605E-4B68-8616-21FEED3A4222 |
| 70 | OFF | 139 | 3485 | BBC1D014-FA02-4B0E-966E-558162C910A1 |
| 70 | ON | 140 | 3486 | 1802F9AB-F3E7-4B11-AC82-08F45EEDD61C |
| 71 | OFF | 141 | 3487 | E117BF1F-BE08-4757-B0EA-84ABE134FE03 |
| 71 | ON | 142 | 3488 | 42127FF2-9AE5-4FBD-B716-AC0FE67B52EA |
| 72 | OFF | 143 | 3489 | 78C068E1-6ED1-41D8-AD8C-4F13CE8B3444 |
| 72 | ON | 144 | 3490 | 1515ABDE-CC21-4904-B344-9FC4CB7F844B |
| 73 | OFF | 145 | 3492 | 1024888B-993C-41C1-9AFB-8D667822DAB4 |
| 73 | ON | 146 | 3493 | A5DA1470-7B87-432E-8C73-AADF09FAACC9 |
| 74 | OFF | 147 | 3495 | 48E46049-0A7A-4336-ABAF-65F8C23D7FCB |
| 74 | ON | 148 | 3496 | 21D38A92-19FC-484B-A127-7576CEC1EE2E |
| 75 | OFF | 149 | 3497 | 01FD974F-B8D2-44E7-ABAA-38A9EB69A2C5 |
| 75 | ON | 150 | 3498 | 16614467-41C8-46F0-96E1-3CDD4CA04EA7 |
| 76 | OFF | 151 | 3499 | 993D5623-0C95-4194-9079-79A47BAEC151 |
| 76 | ON | 152 | 3500 | F5810641-63AE-4FC2-ABE9-AF52235560D2 |
| 77 | OFF | 153 | 3501 | 020C48A3-0ECE-4D18-9127-C34186FE4616 |
| 77 | ON | 154 | 3502 | EA76D00F-0081-4F46-9F5F-A2728CFDEE39 |
| 78 | OFF | 155 | 3504 | ED76ABE7-2B9A-465D-B3E3-75919FADB998 |
| 78 | ON | 156 | 3505 | 030CFB48-A2F8-4099-9AA2-1608A0419E95 |
| 79 | OFF | 157 | 3506 | FCFD2303-0369-47A8-B6F1-1FE20001E0C7 |
| 79 | ON | 158 | 3507 | 29216F48-A5A8-4230-9986-CBDD1CA8F188 |
| 80 | OFF | 159 | 3508 | 68343C7F-34CD-4F74-9357-F32D555D36C3 |
| 80 | ON | 160 | 3509 | A0FFD15C-D172-4F36-A8C2-A57AFF2A2D3D |
| 81 | OFF | 161 | 3510 | 9C0B490A-D493-4CC4-8D93-4993496A1CB4 |
| 81 | ON | 162 | 3511 | 7C6783BF-BAD4-4B6E-A968-942A7ED08EB0 |
| 82 | OFF | 163 | 3512 | 32D53189-A298-4DD2-9C02-0B2D7B0733ED |
| 82 | ON | 164 | 3514 | B13E835B-6236-4BEA-9D2D-E93AF424DE57 |
| 83 | OFF | 165 | 3515 | 1627146A-92CE-43FF-BEAD-78AFF23B1A23 |
| 83 | ON | 166 | 3516 | 381F839E-9493-480F-B00F-A1054EB26346 |
| 84 | OFF | 167 | 3517 | 619E9500-9E78-42A2-B631-CF2C2EA8752C |
| 84 | ON | 168 | 3518 | 70D5B2EC-ACF8-4832-94CB-293EC86089D7 |
| 85 | OFF | 169 | 3519 | 0E10B445-F568-45EB-873A-51441A31C6A4 |
| 85 | ON | 170 | 3520 | B538E02F-D456-49D3-9269-5544875A0C8E |
| 86 | OFF | 171 | 3521 | 9A07025F-B640-4200-ABF2-1E2992B00348 |
| 86 | ON | 172 | 3523 | 4D148A20-C114-4F7F-9ED9-98A4B8050B3E |
| 87 | OFF | 173 | 3524 | 5E67B197-EB1E-42BB-BB60-B15CE7941B28 |
| 87 | ON | 174 | 3525 | A3EBCBAC-654C-4193-9F5D-C113991EF079 |
| 88 | OFF | 175 | 3526 | 5EBBB404-9E45-4DD5-A8F2-BA39D71B6DC7 |
| 88 | ON | 176 | 3527 | 96417796-2928-4DB6-868D-9B749CDBC02E |
| 89 | OFF | 177 | 3528 | F188D680-1776-455B-9F5A-4F54853EF3ED |
| 89 | ON | 178 | 3529 | A63E9BD8-0347-4654-8315-56718E9680B4 |
| 90 | OFF | 179 | 3530 | 049BC39F-0941-4E53-BC51-B48FF20B025B |
| 90 | ON | 180 | 3531 | A4854089-8940-41FE-8D5D-23DC17A5B70F |
| 91 | OFF | 181 | 3533 | 87EC0339-5BF6-45EF-8162-27B5F659F551 |
| 91 | ON | 182 | 3534 | B40339B8-B684-4350-9473-F32528F7ABB7 |
| 92 | OFF | 183 | 3535 | 1BDE36AA-7150-46F7-A5CB-4427EE022C88 |
| 92 | ON | 184 | 3536 | 72F7FB48-B84B-4309-B97A-7B58310637CD |
| 93 | OFF | 185 | 3537 | 6E3E924C-67E1-4C12-96D5-7275894FBF0E |
| 93 | ON | 186 | 3538 | C5E72C70-949F-494D-A19B-5BCE410E03C1 |
| 94 | OFF | 187 | 3540 | 5895EF6E-9497-43AD-9CE5-423D1FBD87B8 |
| 94 | ON | 188 | 3541 | 19C65E9D-4B46-4A91-8972-F36897B12A9F |
| 95 | OFF | 189 | 3542 | E5813823-31FC-4DAB-8112-0CA2BE3C1483 |
| 95 | ON | 190 | 3543 | C3C4AFB7-842B-44ED-AA8C-03269CBCF07F |
| 96 | OFF | 191 | 3544 | 1EF43D37-A9A2-4F3E-A1EC-439378EA7311 |
| 96 | ON | 192 | 3545 | 036F8BF6-685C-4CE9-A6EB-420A189164E9 |
| 97 | OFF | 193 | 3546 | 61D75F72-1B35-434F-BBAC-F1972E11B978 |
| 97 | ON | 194 | 3547 | 3A184F94-DC20-464C-B13C-F4FC3516FD53 |
| 98 | OFF | 195 | 3549 | B029DCA8-53A6-478A-87E3-31D66FC2EAD2 |
| 98 | ON | 196 | 3550 | A0DABC1E-60D7-4E0C-B981-D639C60A04B9 |
| 99 | OFF | 197 | 3551 | 3295CBDC-F73E-407A-A9EA-11D46540ED04 |
| 99 | ON | 198 | 3552 | C1AFE29B-CB3D-4FFC-BB28-3044E122DB9B |
| 100 | OFF | 199 | 3553 | 89BC4F6A-4E32-467B-A163-27182A73CF90 |
| 100 | ON | 200 | 3554 | 7C3B8639-DCBD-4F74-84E6-6A5DC1146950 |
