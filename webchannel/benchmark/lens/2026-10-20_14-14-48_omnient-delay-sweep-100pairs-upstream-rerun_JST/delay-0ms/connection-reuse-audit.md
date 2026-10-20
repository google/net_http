# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | failed | 400 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 87.000 | 69.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | 400 | earlyPOST | h2 | true | 19.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | 200 | earlyPOST | h2 | true | 48.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 45.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 89.000 | 68.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 79.000 | 49.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 37.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 36.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | 400 | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 27.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | earlyPOST | h2 | true | 422.000 | 392.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 50.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | failed | 400 | handshake | h2 | false | 37.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 400 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 36.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 46.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 400 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 400 | earlyPOST | h2 | true | 87.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | failed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 400 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 77.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 400 | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 37.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 56.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 400 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 38.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 55.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 48.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | failed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 304.000 | 292.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 200 | earlyPOST | h2 | true | 34.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 39.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | earlyPOST | h2 | true | 39.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 339.000 | 327.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 30.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 400 | earlyPOST | h2 | true | 32.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 62.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 51 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 57.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 52 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 53 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 54 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 33.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 43.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 56 | ON | completed | 200 | earlyPOST | h2 | true | 21.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 58 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 43.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 59 | ON | completed | 400 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 61 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 62 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 64 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 66 | ON | completed | 400 | handshake | h2 | false | 53.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 69 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 71 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 72 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 73 | ON | completed | 400 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 75 | ON | completed | 400 | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 43.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 76 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 77 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 78 | ON | completed | 400 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 52.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 79 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 80 | ON | completed | 400 | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 57.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 82 | ON | completed | 400 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 83 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 32.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 84 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 85 | ON | completed | 400 | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 86 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 87 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 88 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 90 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 34.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 91 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 92 | ON | failed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 27.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 94 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 95 | ON | completed | 200 | earlyPOST | h2 | true | 311.000 | 300.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 65.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 96 | ON | completed | 400 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 99 | ON | completed | 400 | handshake | h2 | false | 50.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 1.341 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 0.282 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 0.232 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 0.231 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 0.264 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 0.268 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 0.232 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 0.296 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 0.265 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 0.266 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 0.275 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 0.230 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 0.309 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 0.236 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 0 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 47/100 ON trials. Of those trials, 42 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 3, 7, 12, 14, 16, 17, 18, 19, 22, 23, 24, 31, 37, 43, 45, 46, 50, 51, 52, 53, 59, 64, 66, 69, 71, 72, 73, 75, 76, 77, 78, 80, 82, 83, 84, 85, 88, 90, 91, 94, 96, 99. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 1 ON; omnient pair 11 ON; omnient pair 20 ON; omnient pair 39 ON; omnient pair 92 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 2879 | EB3086E5-476B-43B6-A12C-6000D3874198 |
| 1 | ON | 2 | 2880 | 29A32E63-4EB6-421A-8796-B29A82CDABBD |
| 2 | OFF | 3 | 2882 | 32657B89-5D46-49AB-8042-B4660DF45540 |
| 2 | ON | 4 | 2883 | D406DC50-859C-4A7B-8CD4-4D9306455B80 |
| 3 | OFF | 5 | 2884 | 31BF5254-9CA3-431E-B5DC-E185386B5954 |
| 3 | ON | 6 | 2885 | 026145D8-987B-4D8A-BB7B-2D685C9A99CC |
| 4 | OFF | 7 | 2886 | FD62D620-221D-471F-A662-1353B36093F6 |
| 4 | ON | 8 | 2887 | E7A0A826-427C-482A-98BD-CE1B9C5054BF |
| 5 | OFF | 9 | 2888 | 5962166C-0361-43C3-A04E-309ED17E5E74 |
| 5 | ON | 10 | 2889 | 52977A84-744A-4714-9A88-279C0455958C |
| 6 | OFF | 11 | 2890 | 973C1DF8-B5A3-4A8F-9685-F420FA13122F |
| 6 | ON | 12 | 2892 | 55241144-7613-4F02-9CE6-893F6ED80748 |
| 7 | OFF | 13 | 2893 | 7886F442-DB9E-4B0A-90D7-515317491D2A |
| 7 | ON | 14 | 2894 | B4262971-1096-4264-9D33-8818D649547F |
| 8 | OFF | 15 | 2895 | 55037EEE-1E28-4E57-80AB-6207B1D064D3 |
| 8 | ON | 16 | 2896 | AC38838E-F4F1-495E-B018-D46056A3FB08 |
| 9 | OFF | 17 | 2897 | A266B451-59CF-4E28-AA19-C637F2E5EA04 |
| 9 | ON | 18 | 2898 | FBD95D1E-5B87-4C2D-B817-7B8341322DC0 |
| 10 | OFF | 19 | 2899 | BD0C2612-9283-41A1-99DA-87779238EF63 |
| 10 | ON | 20 | 2901 | F9F5F662-4C50-49E2-90DA-76729EA46DD6 |
| 11 | OFF | 21 | 2902 | 9267504F-1CEE-462F-B2DB-3963F7467738 |
| 11 | ON | 22 | 2903 | F04192D6-3B77-4F30-BC60-6E5C01CAB8BD |
| 12 | OFF | 23 | 2904 | 60B59EA3-5FDE-4F98-8AA6-B30F1D026D45 |
| 12 | ON | 24 | 2905 | 9AB0D8DB-7D31-4E0E-9830-FE664DF60A7F |
| 13 | OFF | 25 | 2906 | EE28B994-0E4B-4264-93B0-360304CBD243 |
| 13 | ON | 26 | 2907 | 5B5762E1-6C45-44FF-B750-020CB101897B |
| 14 | OFF | 27 | 2908 | 82BFD69C-2DEB-49B5-94EF-BB2B23855A46 |
| 14 | ON | 28 | 2909 | 7325B5AF-56E4-4454-B619-A1D95856E0AC |
| 15 | OFF | 29 | 2911 | FBA17933-B89F-43D6-BC58-704C47BF76FD |
| 15 | ON | 30 | 2912 | E9E2E3B0-E4EB-4987-A708-0588C0FBC1F9 |
| 16 | OFF | 31 | 2913 | 379A9012-79A5-43C2-BFA9-553BB8FA7C49 |
| 16 | ON | 32 | 2914 | D8DC466D-A00D-4813-8BB7-45DCB2FF3930 |
| 17 | OFF | 33 | 2915 | 3429A8B9-66ED-4636-839F-9005C57D6307 |
| 17 | ON | 34 | 2916 | FD61A3AF-36FD-41FF-9DEE-D45640C13B18 |
| 18 | OFF | 35 | 2917 | 63497E28-C792-4A64-AE80-83ED651C9E6C |
| 18 | ON | 36 | 2918 | D3C13D34-8016-46A6-9C14-34FC5AD62A19 |
| 19 | OFF | 37 | 2919 | 2A2067AF-40F1-44D2-B11B-237213F49C4B |
| 19 | ON | 38 | 2921 | 5CE3FE29-FB4F-4224-838A-96D9F7571F3C |
| 20 | OFF | 39 | 2922 | 32077BFE-4002-47BD-832F-D6B521818F7A |
| 20 | ON | 40 | 2923 | F02E8F23-6135-4348-A303-3356DE0EA5ED |
| 21 | OFF | 41 | 2924 | 2449DB75-77B2-4095-B25A-2C4D2FFCE738 |
| 21 | ON | 42 | 2925 | 52633522-7611-44DB-8B29-672A9D176930 |
| 22 | OFF | 43 | 2926 | 836F8D07-83D5-4361-AF0C-8E1CEE04C6AA |
| 22 | ON | 44 | 2927 | B4619832-3D9E-4963-8EDE-8C9FF1CA9B6C |
| 23 | OFF | 45 | 2928 | 9694EF32-E7F8-4433-86A8-286F55763DFD |
| 23 | ON | 46 | 2929 | 2B61540D-536F-4B6D-87FE-D1C9BC984CDF |
| 24 | OFF | 47 | 2931 | 4EAAE441-1F03-44E8-810D-DE58AF579DD4 |
| 24 | ON | 48 | 2932 | 914E8794-E7F8-4CEC-91FF-6085B489ABD3 |
| 25 | OFF | 49 | 2933 | 6CDE018E-D10E-49F0-9354-CFD174603174 |
| 25 | ON | 50 | 2934 | 73598FA7-2B7A-413E-93F2-4B275BEA3952 |
| 26 | OFF | 51 | 2935 | 5D3D86D8-F36F-4EEC-B31A-CF58FE94B527 |
| 26 | ON | 52 | 2936 | 55CD2AE1-2F3A-4254-87F6-031CDB14C13C |
| 27 | OFF | 53 | 2937 | 9D572B92-4DED-4AB2-8AD7-6BA227BB9064 |
| 27 | ON | 54 | 2938 | CB63D4DF-DAB4-41AF-9C57-9DBE550B284D |
| 28 | OFF | 55 | 2940 | A4283B9F-F408-4F82-A2FF-E45D04C6FF97 |
| 28 | ON | 56 | 2941 | B487959A-2246-4782-9ADB-0D34E963675A |
| 29 | OFF | 57 | 2942 | 97F08270-CF5F-421F-BA3F-7B5569B834B4 |
| 29 | ON | 58 | 2943 | 2C68AD52-388C-4045-BC32-9B2688B1D98F |
| 30 | OFF | 59 | 2944 | 94EBE2DA-EFA4-4EC6-9BEF-DA06BC98748A |
| 30 | ON | 60 | 2945 | 082F64C1-AEAB-4C9D-92DC-D7FD012A5BE4 |
| 31 | OFF | 61 | 2946 | 00228F81-1F1F-4C52-8F99-B66BDE4AAB34 |
| 31 | ON | 62 | 2947 | C18DDE97-8F29-4C96-8ECD-9DEEE4505696 |
| 32 | OFF | 63 | 2948 | 200EB28E-3E90-456C-A52A-F37CCEE9714E |
| 32 | ON | 64 | 2950 | F406F54D-C192-4921-8D15-DED122EE16B9 |
| 33 | OFF | 65 | 2951 | D0C5626B-71FE-462B-A18B-25200A594EA4 |
| 33 | ON | 66 | 2952 | 97B2C378-19C6-4E0C-B1C3-18440CF1E543 |
| 34 | OFF | 67 | 2953 | 1054D832-6592-48E6-B735-013E1D13C1BB |
| 34 | ON | 68 | 2954 | B98E94E2-343D-4851-9B82-043D94E00E7B |
| 35 | OFF | 69 | 2955 | DEAC39E3-8230-4EDF-8E96-188407A17B00 |
| 35 | ON | 70 | 2956 | C35A7274-94B1-4FF7-B845-4FD73967EF05 |
| 36 | OFF | 71 | 2957 | 061DD158-CD4D-4DD8-92CF-1018228B5269 |
| 36 | ON | 72 | 2958 | D0A6255A-7CFF-4837-9F54-F8D61B5D0E5A |
| 37 | OFF | 73 | 2960 | F28196CC-DC5F-44F3-8C8A-60CF2231F454 |
| 37 | ON | 74 | 2961 | 886395F2-6D40-4762-942B-D4DC42051429 |
| 38 | OFF | 75 | 2962 | C2395925-C677-42E1-B05F-A48EE5E04FC5 |
| 38 | ON | 76 | 2963 | 2C50FD87-4715-4BA8-9DEB-F90FC9BD7DF5 |
| 39 | OFF | 77 | 2964 | 7F590AA8-23BD-445E-8656-7A222D26A875 |
| 39 | ON | 78 | 2965 | A511DEC9-7861-4EC2-8A8D-37F8FC0E2779 |
| 40 | OFF | 79 | 2966 | 7B73E3CF-B651-4643-A3C9-A9280D24B1C4 |
| 40 | ON | 80 | 2967 | 42D083A4-8B96-4B9C-9B1B-0782DFDBC3AD |
| 41 | OFF | 81 | 2968 | 7319D8C2-5AB9-436E-BE43-CB7E1E80C1D6 |
| 41 | ON | 82 | 2970 | CBA5F569-0B45-4AC6-A7BB-A12B92C76843 |
| 42 | OFF | 83 | 2971 | 2512FD19-0A72-46A7-9D0D-11F7D03DA49D |
| 42 | ON | 84 | 2972 | 045A6C9A-E6DF-41A7-BC8A-F6CE206C8DA6 |
| 43 | OFF | 85 | 2973 | 6389B0CD-FE2B-4AF9-9584-54C7B5B1F6B8 |
| 43 | ON | 86 | 2974 | 205FC59B-7D15-4FD6-8E84-885149CD8A5A |
| 44 | OFF | 87 | 2975 | 353C65A8-E297-427A-AEEE-EBDE7A8ABA64 |
| 44 | ON | 88 | 2976 | F7058876-2C33-4DD4-985E-BD3390046273 |
| 45 | OFF | 89 | 2977 | B5E5CDF3-53C1-4300-992C-F1A9BA5B0965 |
| 45 | ON | 90 | 2979 | 0F2708A5-65BB-484D-9032-FE546CFA1A14 |
| 46 | OFF | 91 | 2980 | E61D81CD-F07D-465A-BB54-4186EEA2B6E7 |
| 46 | ON | 92 | 2981 | 319F6F83-469A-4BF1-AED7-F60954E02EA7 |
| 47 | OFF | 93 | 2982 | 8DD35A80-7561-45E3-93AF-4373E0CA3A92 |
| 47 | ON | 94 | 2983 | 14959059-2DBE-4B1E-95EF-903D80C79D3D |
| 48 | OFF | 95 | 2984 | 966134CA-715F-45CB-8625-F7378F363EC4 |
| 48 | ON | 96 | 2985 | 1E0D51F7-0367-46A9-BD1D-60FA6E49D0D2 |
| 49 | OFF | 97 | 2986 | FB2039FA-45BA-4F15-B696-3EE7C506901B |
| 49 | ON | 98 | 2987 | 677CFBBC-97A3-4E7C-985E-228E981E7FAC |
| 50 | OFF | 99 | 2989 | 07D0567F-F04A-4D43-8D33-C9194AA69E74 |
| 50 | ON | 100 | 2990 | 831F2BAD-1839-4DBB-918F-03B1D72B62A7 |
| 51 | OFF | 101 | 2991 | 6316B4CE-287E-4A2C-8486-C6C422CF4BD3 |
| 51 | ON | 102 | 2992 | DB7808AF-9E0A-4C7F-8F7F-DB7E4DA14A14 |
| 52 | OFF | 103 | 2993 | 016797C1-96A8-4AC8-8A29-31F2AC52F488 |
| 52 | ON | 104 | 2994 | 9B73556E-AEBC-4C2D-9FCB-9677E47E1CB2 |
| 53 | OFF | 105 | 2995 | 02C2A1E4-D2A7-44CD-81FA-28300C354FC7 |
| 53 | ON | 106 | 2996 | 4624F45E-AFE4-4F1A-B638-2B3232096285 |
| 54 | OFF | 107 | 2997 | 6A619EEE-A074-42CB-9709-E1D87DAF58E4 |
| 54 | ON | 108 | 2999 | CC80FE3E-2139-4F11-A395-A139302F89B9 |
| 55 | OFF | 109 | 3000 | ED68BBC9-2D6E-4365-AD36-D6F33AD8CF40 |
| 55 | ON | 110 | 3001 | 1957718E-8723-4FFC-958B-A8929E7A15B4 |
| 56 | OFF | 111 | 3002 | D860760C-7120-4FD4-B480-397B40797BAB |
| 56 | ON | 112 | 3003 | 6930770A-D09A-4E5F-B5BD-782ECA81E34A |
| 57 | OFF | 113 | 3004 | A8101FBC-3841-4A68-B3C0-E39AA14EAFB2 |
| 57 | ON | 114 | 3005 | E0550CE7-7CB6-4553-A149-297E32689347 |
| 58 | OFF | 115 | 3006 | D6CD0ABF-7A5C-49B2-AB47-5D66503C6D45 |
| 58 | ON | 116 | 3007 | CE78AA9F-3080-4DA3-ADD4-627E033429E2 |
| 59 | OFF | 117 | 3009 | F187FC61-4E3B-4DDB-A939-F1204A61E4DA |
| 59 | ON | 118 | 3010 | AFECF274-9BB4-46F8-8E3D-696D007F14CF |
| 60 | OFF | 119 | 3011 | 82D9D61C-DC07-47CD-9102-0C3319BDB497 |
| 60 | ON | 120 | 3012 | DDE8FDA0-8BA7-4789-A201-1299426E69C0 |
| 61 | OFF | 121 | 3013 | 7A4C4644-3962-4F6C-8384-A4574A3C4A25 |
| 61 | ON | 122 | 3014 | C8479814-6AF3-4CFF-A6BD-A902136CC89F |
| 62 | OFF | 123 | 3015 | 9E06EA7F-2446-48C5-8804-3030B70E34BC |
| 62 | ON | 124 | 3016 | 63E28023-C953-461E-AAAA-3B16C5577633 |
| 63 | OFF | 125 | 3017 | EC97DB7E-6F3B-4FC6-871B-E65E27AF92BD |
| 63 | ON | 126 | 3019 | C3567939-4E61-458F-8E1C-7E5AB6B6CB46 |
| 64 | OFF | 127 | 3020 | 2825C39F-B078-40EF-91F8-5D7AB48250F8 |
| 64 | ON | 128 | 3021 | 5A76A062-F3DB-4975-91D5-3D0CF0DAD85B |
| 65 | OFF | 129 | 3022 | 395E7A4E-8824-473C-A360-F8867D971FB1 |
| 65 | ON | 130 | 3023 | 517B5A1A-C51F-4CCF-BBE0-E8E785EBF189 |
| 66 | OFF | 131 | 3024 | 05DACCB5-3888-4F16-89E5-1B85BC8DD3DE |
| 66 | ON | 132 | 3025 | CD9E6CA7-D749-40DC-9718-11C6577EBB28 |
| 67 | OFF | 133 | 3026 | 1EEBF1BD-B277-406C-975C-C35B17E80E42 |
| 67 | ON | 134 | 3027 | 29084171-2FED-427A-BDFA-FB9B5C9FBDC4 |
| 68 | OFF | 135 | 3029 | 6BC4CA8F-7B6E-4ED5-B93B-C9E346D33D63 |
| 68 | ON | 136 | 3030 | 2E3069A1-8C3D-4FF7-8AB6-28EF2637E01A |
| 69 | OFF | 137 | 3031 | E4097864-BA6A-431F-8A41-C19FBEC58889 |
| 69 | ON | 138 | 3032 | E6180D71-6588-4C7E-B315-3456717137F7 |
| 70 | OFF | 139 | 3033 | E93404B8-C5AF-4BD0-BE69-420828FED677 |
| 70 | ON | 140 | 3034 | 0F28AD35-BC3E-41CD-94B1-36FEAE2625D9 |
| 71 | OFF | 141 | 3035 | 4B677105-A456-4B67-82D9-DE7BE6D262A5 |
| 71 | ON | 142 | 3036 | A3F650A6-C011-45AE-B898-B69DAD65374E |
| 72 | OFF | 143 | 3037 | 2E0FBC2D-4EDB-4D3D-94EB-B7D0BF555B14 |
| 72 | ON | 144 | 3039 | 562F5AAF-9B1C-4B9F-8F17-D12449594A69 |
| 73 | OFF | 145 | 3040 | 9BF48500-5A4A-4B28-8A12-333046F68939 |
| 73 | ON | 146 | 3041 | A064C51E-31D3-41FA-B7B1-088C5AAAC2DB |
| 74 | OFF | 147 | 3042 | D04CD3B1-0382-4657-A94A-8C7D72E5E529 |
| 74 | ON | 148 | 3043 | EE0E7A40-9C74-41F4-82E5-F67D5ABA8219 |
| 75 | OFF | 149 | 3044 | 831AE242-D372-461E-AA9B-B51430725272 |
| 75 | ON | 150 | 3045 | 3B9BF3BD-ECC4-4316-88C0-7F0021C87DAB |
| 76 | OFF | 151 | 3046 | 952707C2-0B57-4309-8B44-F069D0D74C4F |
| 76 | ON | 152 | 3048 | 9C87A156-536D-4913-8D91-DC538FB56514 |
| 77 | OFF | 153 | 3049 | EDF76493-4B5B-4FCB-B750-2F82C9878B3E |
| 77 | ON | 154 | 3050 | 4EEA9367-22CE-492B-B088-3621FBD04181 |
| 78 | OFF | 155 | 3051 | D4F6C857-3CD5-4BEB-94E2-A11BFA78A644 |
| 78 | ON | 156 | 3052 | 15714B27-2330-4AAB-BF18-8AB77FD7861C |
| 79 | OFF | 157 | 3053 | FBD4C5CC-64C9-49F3-ADDB-54B46CFBBCFD |
| 79 | ON | 158 | 3054 | CFCC63A8-865C-4B0E-92D9-3ED49E33AE65 |
| 80 | OFF | 159 | 3055 | 1E8BA1A0-56B6-4C34-8CC3-92CF000FA9BA |
| 80 | ON | 160 | 3056 | A041E3FE-5314-4CF9-BB63-F96EFB3BB3DC |
| 81 | OFF | 161 | 3058 | 81E1C8A5-127E-4AC1-9042-FBDA7536EA2F |
| 81 | ON | 162 | 3059 | BD1CB32C-B83F-4BA9-8C0F-0417FE58AA58 |
| 82 | OFF | 163 | 3060 | 1D5CEEBD-0279-44A3-ACA0-9BA3BB95248D |
| 82 | ON | 164 | 3061 | C2EF49EF-EFA1-43CA-A2DE-10844E6E5853 |
| 83 | OFF | 165 | 3062 | 8EF34EAA-C138-4737-9273-80F7FEFAE5C2 |
| 83 | ON | 166 | 3063 | 6108A079-6D11-464F-975B-589D177B3802 |
| 84 | OFF | 167 | 3064 | D086C57C-E4A9-407A-8896-EE7DFE490314 |
| 84 | ON | 168 | 3065 | 6B892C93-096A-4951-8004-70D331E38A5D |
| 85 | OFF | 169 | 3066 | 438F3432-D079-4501-BC64-530DC8E9512C |
| 85 | ON | 170 | 3068 | 6761FA2B-E962-4FB4-B4F7-25185EC54F35 |
| 86 | OFF | 171 | 3069 | C7B050BF-EDF9-4ADE-94C5-7E45D0E17027 |
| 86 | ON | 172 | 3070 | 04BC4460-8D3F-4155-8852-EB3B85E9F373 |
| 87 | OFF | 173 | 3071 | 659EB044-F650-4871-BAB8-4362CEEE753C |
| 87 | ON | 174 | 3072 | DCDFED2E-ACC9-4632-BCE1-FE1FB14FDA29 |
| 88 | OFF | 175 | 3073 | 11427BEF-8CBB-4FD5-8E38-768338DBAA3C |
| 88 | ON | 176 | 3074 | 045DE14B-7109-48BA-9C51-2FA811A40BC6 |
| 89 | OFF | 177 | 3075 | 58581174-9917-443E-B382-1ABBD4138985 |
| 89 | ON | 178 | 3077 | 21F6FB73-6DF6-47C8-9ADE-107B14F92451 |
| 90 | OFF | 179 | 3078 | E96804BC-4E9F-47E2-8310-23217EBD9BA5 |
| 90 | ON | 180 | 3079 | 7A8758D3-B9F1-4D0C-92D4-80F691FA4F33 |
| 91 | OFF | 181 | 3080 | 4E9649C9-625C-4A1D-A854-254DFA13B911 |
| 91 | ON | 182 | 3081 | C13DF172-ECD1-40AB-8CCB-25C9D3F9836D |
| 92 | OFF | 183 | 3082 | CF6C927D-566D-4011-A9C1-A83AACAD1CCA |
| 92 | ON | 184 | 3083 | 0D069253-EA65-4830-A750-7DD26EE6758D |
| 93 | OFF | 185 | 3084 | 149ED101-12DB-4814-BE11-76C6DF9947D0 |
| 93 | ON | 186 | 3085 | F86792FE-7D63-448D-BA90-1AC56C0E5381 |
| 94 | OFF | 187 | 3087 | B3639192-B6A4-468F-BECB-085A12AAB1D7 |
| 94 | ON | 188 | 3088 | CC45FE46-60FE-41F2-A6CF-32802DF7E9A4 |
| 95 | OFF | 189 | 3089 | A29BF3E1-557E-4FA9-8BEA-65CEC1FADB89 |
| 95 | ON | 190 | 3090 | EA73531A-08D4-4E81-80E9-F1F43B8991AD |
| 96 | OFF | 191 | 3091 | 22A8AA77-4308-4ED0-BE54-0F2D0C61B960 |
| 96 | ON | 192 | 3092 | 5CEEC928-A77E-42B5-A232-9D662EF7F909 |
| 97 | OFF | 193 | 3093 | A72B2C79-886E-40D4-AA66-003E1DB909AF |
| 97 | ON | 194 | 3094 | 52D33B60-B2AF-46F1-B979-79E26E9FE392 |
| 98 | OFF | 195 | 3095 | E95B3A7E-A6EC-4001-9426-155D65AFBA59 |
| 98 | ON | 196 | 3097 | C8313029-1466-4CB9-84DA-2CDED432EB68 |
| 99 | OFF | 197 | 3098 | 1F195CF5-0BCC-4B70-8E17-AE9EEB7589DB |
| 99 | ON | 198 | 3099 | 9A9BAACC-D74F-4D9E-90E0-D37224A23F38 |
| 100 | OFF | 199 | 3100 | B9A2676A-C365-4DDB-9C0C-5EBE7405E7DD |
| 100 | ON | 200 | 3101 | 7EF82C04-6011-4246-917A-EAB7F6E54495 |
