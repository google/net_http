# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 93.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | failed | unknown | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | failed | 400 | handshake | h2 | false | 54.000 | 41.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 56.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 37.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 40.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 28.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 63.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 29.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 56.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 46.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | failed | 400 | handshake | h2 | false | 91.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 104.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | failed | 400 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 57.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 37.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 400 | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 62.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 40.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 34.000 | 27.000 | 142.251.169.81 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 35.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 60.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 37.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 32.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 34.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 59.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 62.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 400 | handshake | h2 | false | 57.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 400 | handshake | h2 | false | 61.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 33.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | failed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | failed | 400 | handshake | h2 | false | 43.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 36.000 | 25.000 | 2404:6800:400b:c015::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 38.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 58 | ON | completed | 400 | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 61.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 18.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 33.000 | 24.000 | 2404:6800:400b:c015::451 |
| omnient | 64 | ON | completed | 400 | handshake | h2 | false | 41.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 68 | ON | failed | 400 | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c015::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 22.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 309.000 | 297.000 | 2404:6800:400b:c015::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 87 | ON | completed | 400 | handshake | h2 | false | 89.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 64.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 45.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 75.000 | 30.000 | 2404:6800:400b:c015::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 37.000 | 25.000 | 2404:6800:400b:c015::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 70.000 | 49.000 | 2404:6800:400b:c015::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 60.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 62.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 57.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c015::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 52.112 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 51.930 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 52.035 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 51.936 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 50.941 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 52.677 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 52.849 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 50.741 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 52.444 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 52.323 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 52.370 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 53.025 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 51.421 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 52.216 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 51.172 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 52.447 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 52.992 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 51.986 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 50.625 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 51.574 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 51.183 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 52.925 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 52.902 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 51.986 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 52.709 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 52.209 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 52.847 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 51.087 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 51.994 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 52.522 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 52.856 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 52.925 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 52.025 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 52.859 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 52.844 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 50.605 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 50.421 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 52.605 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 52.913 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 52.196 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 52.913 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 51.468 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 55.719 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 52.609 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 50.995 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 51.000 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 52.864 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 52.212 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 53.045 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 50.604 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 51.344 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 52.901 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 51.588 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 51.322 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 52.906 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 52.975 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 51.121 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 51.452 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 51.490 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 51.942 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 52.408 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 50.461 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 52.874 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 52.247 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 52.855 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 52.010 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 50.813 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 52.878 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 52.931 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 51.124 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 52.881 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 50.279 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 52.160 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 50.538 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 51.296 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 63.375 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 51.330 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 52.166 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 53.552 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 50.933 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 51.679 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 51.630 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 52.882 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 52.206 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 50.270 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 51.437 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 52.835 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 52.857 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 50.543 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 52.916 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 52.877 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 52.841 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 52.838 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 50.979 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 51.357 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 52.925 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 52.846 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 52.150 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 51.924 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 52.906 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 51.122 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 52.491 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 53.032 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 52.356 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 53.022 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 53.028 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 52.339 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 51.512 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 51.754 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 50.727 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 50.713 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 50.846 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 50.565 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 52.943 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 51.403 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 50.449 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 52.846 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 51.242 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 52.960 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 51.135 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 52.899 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 52.911 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 51.318 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 52.902 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 50.602 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 52.895 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 52.847 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 52.900 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 52.986 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 53.020 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 52.878 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 52.860 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 52.861 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 51.824 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 52.912 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 52.566 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 52.148 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 51.763 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 52.701 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 51.379 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 51.457 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 52.854 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 52.906 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 50.769 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 52.841 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 51.404 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 52.880 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 52.865 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 51.792 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 53.035 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 52.150 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 55.058 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 52.378 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 51.617 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 51.826 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 53.023 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 51.336 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 52.691 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 50.432 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 50.453 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 52.813 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 52.912 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 50.725 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 52.115 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 52.445 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 50.905 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 52.856 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 51.998 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 52.928 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 50.603 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 51.939 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 52.881 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 52.813 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 50.652 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 52.131 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 52.791 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 51.200 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 50.860 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 52.086 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 52.436 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 52.246 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 50.719 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 52.873 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 52.860 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 52.835 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 52.847 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 52.941 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 50.939 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 52.543 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 52.839 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 52.541 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 51.157 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 52.837 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 52.906 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 51.758 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 52.906 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 51.415 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 52.085 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 51.478 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 52.830 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 50 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 13/100 ON trials. Of those trials, 7 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 15, 20, 22, 34, 35, 49, 58, 64, 68, 87. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 3 ON; omnient pair 6 ON; omnient pair 15 ON; omnient pair 16 ON; omnient pair 37 ON; omnient pair 47 ON; omnient pair 68 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 3103 | 92E16031-8FE0-40AC-8077-CA62789C6AC7 |
| 1 | ON | 2 | 3105 | 9A1A8E2D-25B8-4EAF-BC78-3029BB1668AF |
| 2 | OFF | 3 | 3106 | 1DA44EDB-0ECF-43B4-BD69-748E03102175 |
| 2 | ON | 4 | 3107 | 26F0831A-B5E6-4CEC-A9AD-F255E7516EA7 |
| 3 | OFF | 5 | 3108 | 6CB8A2CC-FFB5-47E5-BA90-87418E53FE42 |
| 3 | ON | 6 | 3109 | D85D5B4D-5E83-455A-BD8E-174AA9F3BDD1 |
| 4 | OFF | 7 | 3110 | 4AED3455-B1E4-4860-8EA6-F8EFA6D9FDA2 |
| 4 | ON | 8 | 3111 | AA2A6640-FEB9-40C5-BE9C-1F0D219D4891 |
| 5 | OFF | 9 | 3112 | E4F9E117-7D5D-411F-9286-F0C2AB95F50F |
| 5 | ON | 10 | 3113 | 5B272A5A-2B62-4C4B-A367-79CE51F98813 |
| 6 | OFF | 11 | 3115 | B75E25C2-ABB7-4B18-A3F1-F50E2827662B |
| 6 | ON | 12 | 3116 | 25B100E7-E0DA-485E-8062-974D5DAF925A |
| 7 | OFF | 13 | 3117 | 6002DDF5-DDBC-4E24-9DDE-ED1F060C1EB0 |
| 7 | ON | 14 | 3118 | 2CFB6271-BE72-4413-B5C0-8C34BBCF5F2A |
| 8 | OFF | 15 | 3119 | 04CEDBCB-1943-4590-9A8F-7D46E111E05E |
| 8 | ON | 16 | 3120 | B07CE7F2-5D87-4752-9E4D-7E6B9F74A3A5 |
| 9 | OFF | 17 | 3121 | F9CEC15F-0178-49C9-92FA-2898686D994A |
| 9 | ON | 18 | 3122 | 4A8DD416-FFE8-44BF-9D53-BBD6452E691D |
| 10 | OFF | 19 | 3123 | CC6F8AF2-37CB-4250-8BC9-9CC4B017B74C |
| 10 | ON | 20 | 3125 | 7A40725D-0F7A-4762-B866-E1FB078D1CCC |
| 11 | OFF | 21 | 3126 | 83DD3D44-EDE2-4A77-9F82-BD29CBE31ECE |
| 11 | ON | 22 | 3127 | 57095369-43AB-4CCB-AE62-CC85CD67BF6A |
| 12 | OFF | 23 | 3128 | E53A8591-FF3E-482C-9FE9-8F685B64057A |
| 12 | ON | 24 | 3129 | B1915CA5-5061-4E09-B7C2-61A3A9BBBC1F |
| 13 | OFF | 25 | 3130 | C3AED1F9-F7EE-43E3-A2F0-48BA41A3147F |
| 13 | ON | 26 | 3131 | 6195FFBE-7E79-4F7B-BE40-B75F688691DA |
| 14 | OFF | 27 | 3132 | 1339FB12-86D9-4A55-87AB-B5F4655DB9FB |
| 14 | ON | 28 | 3134 | 6B290A7A-0932-4FEF-9D03-423827479866 |
| 15 | OFF | 29 | 3135 | 9047A1D9-2767-4303-9B02-81FDF7C2B2DB |
| 15 | ON | 30 | 3136 | 66AB8FDD-56A3-40E3-A564-51CC2C3B1615 |
| 16 | OFF | 31 | 3137 | 6C52549B-DF97-425E-A03E-57068498C0AA |
| 16 | ON | 32 | 3138 | B586E746-D3D8-4AEC-B8E8-C2E24B197F7B |
| 17 | OFF | 33 | 3139 | B0B64EAF-30BB-4621-AA86-3E81D73EF907 |
| 17 | ON | 34 | 3140 | 63A70424-25C8-4EF9-BA7F-3FA5195B00F5 |
| 18 | OFF | 35 | 3141 | 619B1D03-0FD1-460A-9ED8-B78A67C28B90 |
| 18 | ON | 36 | 3142 | C37F4712-AC75-4C56-82FD-334E4A8C9925 |
| 19 | OFF | 37 | 3144 | 40D31AB6-36A2-4B8A-B9BE-391B676913FA |
| 19 | ON | 38 | 3145 | 89F640B8-EEF3-45C3-B740-CA8B6C29A272 |
| 20 | OFF | 39 | 3147 | 4E2E1F99-B058-45E6-8300-14924515ED2D |
| 20 | ON | 40 | 3148 | 0858EF01-CB1F-4C58-ABA7-EBCCD7A79B85 |
| 21 | OFF | 41 | 3149 | 9695BE00-6F41-4D02-9C7E-E6AF8A705167 |
| 21 | ON | 42 | 3150 | EE6E51F6-3AE3-48E1-8F73-DBA64CE1DD6C |
| 22 | OFF | 43 | 3151 | 439F3424-1E14-4BE9-8EE8-2FD7763DFF3A |
| 22 | ON | 44 | 3152 | BF1C5EB0-8D75-4824-92FD-8DB57A3205D2 |
| 23 | OFF | 45 | 3154 | AFFD6CD0-2D2F-487B-9942-7EB4FE7A861E |
| 23 | ON | 46 | 3155 | D56029B1-B46B-4024-A94F-14F02A773E04 |
| 24 | OFF | 47 | 3156 | FFF0DFDD-80B2-4082-BA9F-6CCBEAFDAECC |
| 24 | ON | 48 | 3157 | 4157D443-55BB-4E70-AF04-8E3B222D5CDB |
| 25 | OFF | 49 | 3158 | 7F9347A5-A466-4B58-9CC7-66EBD527214B |
| 25 | ON | 50 | 3159 | 51C5330E-3779-47A7-B4E1-DED53A3ACCD3 |
| 26 | OFF | 51 | 3160 | 8BBA21A7-2ED8-4936-A54C-F42B11AFAD51 |
| 26 | ON | 52 | 3161 | 6AF77B05-67A6-461F-BE42-FFB82AF5FC20 |
| 27 | OFF | 53 | 3162 | A033DB14-BC73-400D-8188-92F656A656CF |
| 27 | ON | 54 | 3164 | 761DB67D-E8A8-4534-BAB4-6F215F8703C5 |
| 28 | OFF | 55 | 3165 | 01BBC05C-FC62-429E-A01B-FAC97883A468 |
| 28 | ON | 56 | 3166 | 3772D4CF-C025-4A2D-A984-C8621C106CDD |
| 29 | OFF | 57 | 3167 | CB7B5067-BD99-4525-8548-A486EDB87409 |
| 29 | ON | 58 | 3168 | C838809D-BB4D-4762-9C2F-0B289A33F7D7 |
| 30 | OFF | 59 | 3169 | 09E37986-4A06-45CD-BF88-2C2A867F8377 |
| 30 | ON | 60 | 3170 | 8821443F-CC85-4312-87CE-8F5CF4AFB656 |
| 31 | OFF | 61 | 3171 | 32FAA4A6-DCDB-4113-B3CA-0C316A22EAD5 |
| 31 | ON | 62 | 3173 | 9B8115A8-A3DC-4E42-B2CF-C13F774926EB |
| 32 | OFF | 63 | 3174 | C6BB65EC-A082-4748-A158-4878798DC063 |
| 32 | ON | 64 | 3175 | EDF21E8C-56B6-4F9C-9952-68BBA15CB001 |
| 33 | OFF | 65 | 3176 | 297CD944-D3C5-4878-944B-F6AB7A5DD196 |
| 33 | ON | 66 | 3177 | 3D417D74-CF3F-457F-9E2A-35B5487415F5 |
| 34 | OFF | 67 | 3178 | 34A6426F-F793-4C14-80AE-2ECB7D422786 |
| 34 | ON | 68 | 3179 | 233C575A-C749-4374-862E-4543D904BA7C |
| 35 | OFF | 69 | 3180 | 876DED78-7336-49DB-8096-C4AD17D1CB70 |
| 35 | ON | 70 | 3181 | A117EE31-2547-4C90-B6F2-A175CBC078FA |
| 36 | OFF | 71 | 3183 | 89828F89-C0ED-49F0-906A-C5CF2B943870 |
| 36 | ON | 72 | 3184 | 3D1027FD-9F8C-4492-968A-6ABE3D5B4CFD |
| 37 | OFF | 73 | 3185 | B326FCCE-EAF8-4D11-8815-69B6570069B2 |
| 37 | ON | 74 | 3186 | 37676735-872F-443F-A279-2F802CD92A7B |
| 38 | OFF | 75 | 3187 | 11367DE1-9E86-4855-91B6-64197A00FB38 |
| 38 | ON | 76 | 3188 | 829DC188-288C-46CE-8CD4-41E2A98F7E59 |
| 39 | OFF | 77 | 3189 | E8C1DC1E-8088-411A-9373-97AD3A4AC54E |
| 39 | ON | 78 | 3190 | C8CF6B6F-CC67-4DF0-AD6F-23EDAA6DC193 |
| 40 | OFF | 79 | 3191 | 5FA62148-AFD2-47B5-B1F3-20B8AE9D8557 |
| 40 | ON | 80 | 3193 | FCDB540F-63FB-4F77-8CB7-96431A9581B7 |
| 41 | OFF | 81 | 3194 | 4E685D94-7D1D-4F22-AE8C-2F86156E01C0 |
| 41 | ON | 82 | 3195 | 5B1FC03E-D563-48DF-9BFC-41ACFF66BB96 |
| 42 | OFF | 83 | 3196 | 04E249B1-857C-444F-A307-04661AE76BCF |
| 42 | ON | 84 | 3197 | 26D0CAEA-6087-406A-97A5-BD3A17F251DB |
| 43 | OFF | 85 | 3198 | E68A8E03-3BBD-4D64-8231-54876E0D1313 |
| 43 | ON | 86 | 3199 | 14F6E0B3-C62F-485B-BC72-3A7C430E4E69 |
| 44 | OFF | 87 | 3200 | 090AE210-4FC6-4D47-890B-11D41A210F9F |
| 44 | ON | 88 | 3201 | 5753E82E-A586-4D66-866B-F37A8E6BF140 |
| 45 | OFF | 89 | 3203 | 1D6844AC-1FA9-4123-BB53-99BE30389AE7 |
| 45 | ON | 90 | 3204 | 3A8615D0-32B6-4A9B-97A5-C4E7F85C654A |
| 46 | OFF | 91 | 3205 | 9AFB78AD-04C4-4607-8D6C-B3D51C16BDF8 |
| 46 | ON | 92 | 3206 | E51F4DDC-2845-43E9-B18D-90C3F915308F |
| 47 | OFF | 93 | 3207 | FE8212F6-8089-4BE9-94B1-94E5F14EFCD3 |
| 47 | ON | 94 | 3208 | 0FBDE2FC-8414-45D4-AA0B-52F4CE01163B |
| 48 | OFF | 95 | 3209 | A330279B-0C23-4F76-8C70-8E9A927D3E75 |
| 48 | ON | 96 | 3210 | 71DCB51D-96D8-4346-B646-812F19387BD8 |
| 49 | OFF | 97 | 3211 | AF0D78C7-65FB-4FBE-B4CB-4D2BDD06BEE4 |
| 49 | ON | 98 | 3213 | D6FFDFC5-15D0-44DB-884B-1EFA47EDE57E |
| 50 | OFF | 99 | 3214 | CC8D97DA-4659-4358-9318-4051A27D05EA |
| 50 | ON | 100 | 3215 | B0A5C7F0-A405-47A1-9A38-192332C7CC11 |
| 51 | OFF | 101 | 3216 | 33EC8C43-016A-4256-B762-FCB114C8AEE6 |
| 51 | ON | 102 | 3217 | 6E1669A8-61DA-438B-BBAB-B0B2C51F5CB5 |
| 52 | OFF | 103 | 3218 | C3209489-352F-447D-A264-3832342D80F2 |
| 52 | ON | 104 | 3219 | 373A1665-B02B-4BAC-9721-1DC4EFA1F663 |
| 53 | OFF | 105 | 3220 | B0952D45-6DCD-4860-8D97-FFB3B0198216 |
| 53 | ON | 106 | 3222 | 15C8C449-545F-4E8F-855C-1F1B3A6702B5 |
| 54 | OFF | 107 | 3223 | 6B21D332-4094-4E07-B347-D98870C19777 |
| 54 | ON | 108 | 3224 | 8E1F532B-493C-46E3-AD3D-ABA3B6D7F3A5 |
| 55 | OFF | 109 | 3225 | DA0E0198-A687-4042-9551-91467CCA17CF |
| 55 | ON | 110 | 3226 | D3FF53F9-46C5-4393-AF82-427A49D3B9D2 |
| 56 | OFF | 111 | 3227 | 8B2B52B1-7D82-45D5-8740-95C22B8E35A4 |
| 56 | ON | 112 | 3228 | 4F4FA277-8736-4308-A4A2-16386FFFD9FB |
| 57 | OFF | 113 | 3229 | B9BC7A9F-69EC-4D53-B3E6-E83832875A9F |
| 57 | ON | 114 | 3230 | 07F4A16F-61BC-4A53-B9C0-A1C960671065 |
| 58 | OFF | 115 | 3232 | 5A4FB52B-0836-4B8F-90BF-FAAC48BD8323 |
| 58 | ON | 116 | 3233 | ADF4DA0B-9D84-4F14-83CC-5B933FF6C733 |
| 59 | OFF | 117 | 3234 | 40FCC158-6B2B-4570-B7AC-5F71BE388DFE |
| 59 | ON | 118 | 3235 | C3AB18A0-87F9-45FD-9E06-57660F3B093E |
| 60 | OFF | 119 | 3236 | F12FB3BD-3EA8-4DA0-AD62-BDD4DD9B3F40 |
| 60 | ON | 120 | 3237 | F40CBF18-1253-4405-874F-B6709FA3CB6C |
| 61 | OFF | 121 | 3238 | 9765DB96-F0CB-46D8-B809-078B1A6DC1A6 |
| 61 | ON | 122 | 3239 | E1BF766B-BC3E-4A8F-863E-8C8A1B6E182D |
| 62 | OFF | 123 | 3240 | E966F8FF-5BAE-4CF6-BA95-B83C8A9C5DAD |
| 62 | ON | 124 | 3242 | 46A1DF70-5BB1-422A-B1D4-0B2CF593F8CD |
| 63 | OFF | 125 | 3243 | F6A3441C-2029-4305-9642-59E4FA43EBB7 |
| 63 | ON | 126 | 3244 | DA942DC7-7923-4A79-98CD-8349960A7159 |
| 64 | OFF | 127 | 3245 | 50B2BD8E-8B2C-4B38-98AE-83D2B24193F4 |
| 64 | ON | 128 | 3246 | 0EBD917D-1CC4-4553-ACCD-35940ADA4B93 |
| 65 | OFF | 129 | 3247 | 13C12F2F-3460-4D0B-AE4B-82688BFDE7E1 |
| 65 | ON | 130 | 3248 | 7F337177-61A5-4E1A-A7C4-2F97A5CEBBFF |
| 66 | OFF | 131 | 3249 | F26C901A-AF8D-44A3-B9D5-D3A94A62086C |
| 66 | ON | 132 | 3251 | 053FC8C6-5FC1-4CBB-8206-EEE0A5D11982 |
| 67 | OFF | 133 | 3252 | 60621DFF-03FC-49DF-AB3E-E3C82A8463D6 |
| 67 | ON | 134 | 3253 | 12DDEFCA-44F7-430D-B04B-7271661C50AD |
| 68 | OFF | 135 | 3254 | 14E45883-09D5-4DE4-A06C-2972C0FCF59A |
| 68 | ON | 136 | 3255 | C2207DE2-1959-4B42-80CE-3875BE10B9CD |
| 69 | OFF | 137 | 3256 | 4F0375F2-B2E9-4C16-8EB9-525EEC86BF84 |
| 69 | ON | 138 | 3257 | AA9B8712-CDEC-449C-B3B5-772ACA0FEFA6 |
| 70 | OFF | 139 | 3258 | 227B7E01-9562-4578-94ED-170D00FED00C |
| 70 | ON | 140 | 3259 | FF748C1F-4635-437A-B6DD-CBF22B653597 |
| 71 | OFF | 141 | 3261 | 168EB23C-F81C-434F-91B4-BCD345ACFFC2 |
| 71 | ON | 142 | 3262 | 9F1B58A0-5EFA-47EE-BED6-1DAC17747B71 |
| 72 | OFF | 143 | 3263 | 07CEE95B-D396-4003-814F-87C2FA890607 |
| 72 | ON | 144 | 3264 | 535101BF-B91C-4061-9AEB-651A1CB4AB87 |
| 73 | OFF | 145 | 3265 | 378FD3D3-6C8C-4140-A7DB-E455B24E837B |
| 73 | ON | 146 | 3266 | 84A10EA8-F632-4EB5-818F-AB9BF8A05EB5 |
| 74 | OFF | 147 | 3267 | 431CBD0D-9F08-4CD2-8381-B7E418082AB0 |
| 74 | ON | 148 | 3268 | 62012C31-516F-4BE0-B118-B4760BCF8A02 |
| 75 | OFF | 149 | 3269 | 86C5F749-BA96-4D20-AE95-E55732646AA5 |
| 75 | ON | 150 | 3271 | 0D432FD9-B172-424D-A299-E8D052A1A6E1 |
| 76 | OFF | 151 | 3272 | 5D0CC361-ABB4-4F50-AC69-5BD80BB76F82 |
| 76 | ON | 152 | 3273 | C0247145-9059-453F-9038-9EC5AF5B866F |
| 77 | OFF | 153 | 3274 | EB1DCD79-F8E4-4649-AEA1-264A2D6879EA |
| 77 | ON | 154 | 3275 | 7C17298E-8359-45E5-82D2-464122800136 |
| 78 | OFF | 155 | 3276 | 26347DE9-EF90-4DF4-9FC8-D68ABFA70725 |
| 78 | ON | 156 | 3277 | F76C5E7B-0254-4265-A564-53AEBECE2F3A |
| 79 | OFF | 157 | 3278 | CC424F47-FF30-4ABA-A001-2B048772CC47 |
| 79 | ON | 158 | 3279 | CD894A85-5A70-4DFC-B42F-FA75E0F74D81 |
| 80 | OFF | 159 | 3281 | DC6F6D71-D840-47FF-B065-E96C8016A121 |
| 80 | ON | 160 | 3282 | 3F21D821-6EFE-429B-8CA6-AD99F078CE9E |
| 81 | OFF | 161 | 3283 | 3B8608E4-2B2F-422D-AD07-076239A02835 |
| 81 | ON | 162 | 3284 | DE7CC828-C95A-49CB-9AD7-B37724DDC4A6 |
| 82 | OFF | 163 | 3285 | 236A311D-E2DB-486C-A045-96A3F6FA09B3 |
| 82 | ON | 164 | 3286 | 62634714-AE24-4189-820C-81824ABE1DFA |
| 83 | OFF | 165 | 3287 | 478741AE-A13C-47A3-9D23-4C1F9C87348E |
| 83 | ON | 166 | 3288 | 3E363DFF-2DFB-4CF9-9E29-23212F921E09 |
| 84 | OFF | 167 | 3290 | F6AC3EFE-45EC-48E9-ABF2-8C532CF74996 |
| 84 | ON | 168 | 3291 | FF457064-8CED-4520-A7B6-4569526EA7B9 |
| 85 | OFF | 169 | 3292 | 62FEEFF9-6772-4B7B-881B-28FA660503DE |
| 85 | ON | 170 | 3293 | C5E10738-353F-4224-A5BE-B66C15965434 |
| 86 | OFF | 171 | 3294 | 99404D02-C470-4670-AF99-14337AF02BEA |
| 86 | ON | 172 | 3295 | FF8B641E-E48A-42AC-801D-CFF6A982CF6C |
| 87 | OFF | 173 | 3296 | 897F1353-EE0F-409E-B1AC-AB36A00EAA43 |
| 87 | ON | 174 | 3297 | D1251809-A332-4747-8B5A-F0EECFFBEC5A |
| 88 | OFF | 175 | 3298 | E8FC574B-2CCB-4DAF-90FC-6AA3C35C2C6A |
| 88 | ON | 176 | 3300 | 8EEC0AF5-50B1-48BA-8E0A-8DD51AB82362 |
| 89 | OFF | 177 | 3301 | 78B69592-A9E5-437A-B420-EFCA67138DA6 |
| 89 | ON | 178 | 3302 | 1D1B46DE-336E-4B5F-96F6-4A2AEFE20667 |
| 90 | OFF | 179 | 3303 | 1048FF7C-5013-4A2D-ACCD-ACFA58E188FF |
| 90 | ON | 180 | 3304 | 8559D245-F9C4-4B8D-837C-C67917EDBFC2 |
| 91 | OFF | 181 | 3305 | 65F88BEA-C7DA-401B-BDF8-9ECD0D8EDDEF |
| 91 | ON | 182 | 3306 | 0B00905C-612A-4023-9E0E-6FE34DE0C984 |
| 92 | OFF | 183 | 3307 | F3CEB174-E03F-4FE8-90C2-476F66B91CC9 |
| 92 | ON | 184 | 3308 | 301BA8F8-6E64-4712-9080-54BE7B4997A0 |
| 93 | OFF | 185 | 3310 | CCA8A2FB-D685-4EE4-8DB3-FB76D0420DA7 |
| 93 | ON | 186 | 3311 | 181A5CE9-6966-4A28-9FE2-6612A76956A7 |
| 94 | OFF | 187 | 3312 | 8010204A-C590-40B8-A88E-D29AE93BB8C5 |
| 94 | ON | 188 | 3313 | BFB300FC-057B-45B1-8E50-03DFF0AA0ADE |
| 95 | OFF | 189 | 3314 | DBAA0793-E322-4E0E-9A73-28B0E3F7D521 |
| 95 | ON | 190 | 3315 | 3C5F16D4-CCAE-4FA6-B1F0-501704689EBD |
| 96 | OFF | 191 | 3316 | 8EE40482-DE23-472C-B3D9-B30E5B52B4D8 |
| 96 | ON | 192 | 3317 | D5E50DB7-7AEF-4637-BAF8-A25CBDB573BE |
| 97 | OFF | 193 | 3318 | A819F335-BE8B-42C1-AD93-4E7991642670 |
| 97 | ON | 194 | 3320 | 9E15EFCC-A43F-49B5-B560-ED72CA5B29C1 |
| 98 | OFF | 195 | 3321 | 3E70186F-F784-4ECE-8020-342817AFE49C |
| 98 | ON | 196 | 3322 | 862F6C2F-455C-471F-B9F9-24898DAF3FE6 |
| 99 | OFF | 197 | 3323 | C4F1AA3A-03EF-4644-92FE-29CC3228F021 |
| 99 | ON | 198 | 3324 | 22D51E3B-A54B-47C2-8E81-320CD809D7C7 |
| 100 | OFF | 199 | 3325 | 64A65C3B-7385-4450-A386-27213C42CF21 |
| 100 | ON | 200 | 3326 | F7E83068-B8F1-4124-B2DF-8F0DA6FCA7A6 |
