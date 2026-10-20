# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 29.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 29.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 400 | handshake | h2 | false | 60.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 400 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 58.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 400 | earlyPOST | h2 | true | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 400 | earlyPOST | h2 | true | 62.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 58.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 81.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 400 | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 400 | earlyPOST | h2 | true | 32.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 53.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 400 | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | earlyPOST | h2 | true | 73.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 400 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 37.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 400 | earlyPOST | h2 | true | 38.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 55.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 400 | handshake | h2 | false | 93.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 400 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 400 | handshake | h2 | false | 57.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 400 | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 400 | earlyPOST | h2 | true | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 400 | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 400 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | earlyPOST | h2 | true | 29.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 40.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 400 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | earlyPOST | h2 | true | 39.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 41.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 400 | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 400 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 400 | earlyPOST | h2 | true | 48.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 37.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 40.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 400 | earlyPOST | h2 | true | 35.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | earlyPOST | h2 | true | 32.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 43.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 400 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 49.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 400 | earlyPOST | h2 | true | 62.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 400 | earlyPOST | h2 | true | 92.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 400 | handshake | h2 | false | 68.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 35.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 400 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 304.000 | 292.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 400 | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 28.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 400 | earlyPOST | h2 | true | 35.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 38.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 400 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 37.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 400 | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 65.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 200 | earlyPOST | h2 | true | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 37.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 40.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 400 | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 59.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | earlyPOST | h2 | true | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 55.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | earlyPOST | h2 | true | 34.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 400 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 400 | earlyPOST | h2 | true | 38.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | earlyPOST | h2 | true | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 64.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 53.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 400 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 400 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 400 | earlyPOST | h2 | true | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 400 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 0.287 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 0.266 | count=2 | handshake POST | handshake POST |
| omnient | 12 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 0.232 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 0.230 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 0.231 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 0.275 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 0.230 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 0.231 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 0.230 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 0.230 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 0.232 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 0.270 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 0.230 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 0.261 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 0 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 64/100 ON trials. Of those trials, 64 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 32, 33, 36, 37, 39, 41, 42, 43, 44, 46, 47, 48, 51, 53, 54, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 72, 73, 74, 76, 81, 85, 86, 89, 91, 93, 96, 97, 98, 100. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 4581 | 7991BD8B-63EC-40C4-8048-B0A9BEBC180E |
| 1 | ON | 2 | 4582 | 0F5036EB-5601-48A1-9CAC-DB4728EE15D0 |
| 2 | OFF | 3 | 4583 | 27F9713C-A32A-434E-BD95-9900AA67FB41 |
| 2 | ON | 4 | 4584 | C3AE98E2-65D2-41F2-AF37-7F45BB04131E |
| 3 | OFF | 5 | 4585 | 18D2CFEC-5844-4238-81C6-485F42AB2B0E |
| 3 | ON | 6 | 4586 | B2B058EA-9F8F-4422-A3EC-66A05137A35E |
| 4 | OFF | 7 | 4587 | 70B82A0B-201E-4445-B22E-F54979199764 |
| 4 | ON | 8 | 4589 | 91F31B7F-5B10-4936-B71D-B9095C9A3E30 |
| 5 | OFF | 9 | 4590 | E39EDB03-C3BD-457B-B3AF-EF3ACA5A6914 |
| 5 | ON | 10 | 4591 | B2C3789B-491E-44AB-9A15-7E7400A6DEED |
| 6 | OFF | 11 | 4594 | FAFD93D4-6467-4E6E-BA0A-475538E63046 |
| 6 | ON | 12 | 4595 | 048233FE-2C6E-48A8-A571-3827FE50D463 |
| 7 | OFF | 13 | 4596 | CCA1C9EE-6D2D-4309-9423-AB3C3369067D |
| 7 | ON | 14 | 4597 | 5F35371A-147B-434E-AC8B-8717761BED6A |
| 8 | OFF | 15 | 4598 | 92E4725F-A54D-421A-A246-97570A9021EE |
| 8 | ON | 16 | 4600 | 11051ED7-9621-4B5A-B874-F6AB27871E76 |
| 9 | OFF | 17 | 4601 | EB49F45C-E95F-4067-A464-6258FE33A190 |
| 9 | ON | 18 | 4602 | 16DA0820-E058-425F-A935-918292F0EF19 |
| 10 | OFF | 19 | 4603 | 18EC9D13-A060-4D77-8850-CEEA0A807B5D |
| 10 | ON | 20 | 4604 | 17AFB3A7-9D1F-40C3-9A5C-0EFF9B5EEA21 |
| 11 | OFF | 21 | 4605 | 9361D431-7725-4606-B430-3513873CE337 |
| 11 | ON | 22 | 4606 | 212E18C7-CDA2-4E5A-A588-E17435CDCA33 |
| 12 | OFF | 23 | 4607 | 7B8E416E-A1D6-46A8-8675-EA154ED6C7CB |
| 12 | ON | 24 | 4608 | 4973FF4E-99EB-468E-886B-F7008C0CF43A |
| 13 | OFF | 25 | 4610 | 68CE5C7A-D9B2-4ECA-AD4B-196E13F07070 |
| 13 | ON | 26 | 4611 | C7868545-EA93-4C16-B947-8CA56196055B |
| 14 | OFF | 27 | 4612 | CD4B999E-8D0A-45DC-A547-F440E2EB6CD9 |
| 14 | ON | 28 | 4613 | E75BF0E9-7AE6-4A81-A21F-2E78C4B5E704 |
| 15 | OFF | 29 | 4614 | 16490C0D-5224-4D2B-8CF9-C597625D99D8 |
| 15 | ON | 30 | 4615 | B0F85287-CE7F-40C1-ADEB-EA6B0013FE6E |
| 16 | OFF | 31 | 4616 | 44B98694-4D90-45BB-83D4-3C7E97EFE79C |
| 16 | ON | 32 | 4617 | 5B2CFFDB-3000-4789-8D4E-F16AD21C441F |
| 17 | OFF | 33 | 4619 | F15C1602-EF0D-48BA-BB26-5CCB5BCAA20C |
| 17 | ON | 34 | 4620 | 700FF078-B6A9-4C78-AF51-E10C152968AA |
| 18 | OFF | 35 | 4621 | DF0279DA-AF53-4350-9E3C-99A17C01C330 |
| 18 | ON | 36 | 4622 | D2C35158-F18A-419C-81C8-D9B1D29DA86A |
| 19 | OFF | 37 | 4623 | 89CFD293-A7B4-44D7-BF1C-5C660CA234BF |
| 19 | ON | 38 | 4625 | A68F1423-4D1D-4638-9986-661949978B29 |
| 20 | OFF | 39 | 4626 | BD3A832E-DB4D-4AAD-AB65-61303927F23B |
| 20 | ON | 40 | 4627 | F7BCBCD8-5A2A-4182-8085-BAD156C38B48 |
| 21 | OFF | 41 | 4628 | 0C4D5997-5F2F-490C-98A2-9AA142CF6F8D |
| 21 | ON | 42 | 4630 | 47CC3346-00C8-4F4C-9E27-59819B7D77DF |
| 22 | OFF | 43 | 4631 | 3D0F0873-ED22-4C2B-95F6-4F0352FBF008 |
| 22 | ON | 44 | 4632 | 012142E9-40E7-4B97-B136-A444FD705BAA |
| 23 | OFF | 45 | 4633 | DD70AFC1-74C8-4517-8AE5-809215C57CA5 |
| 23 | ON | 46 | 4634 | 4C9E8C32-4CC4-4C2B-9A6D-8AC651E4CE1F |
| 24 | OFF | 47 | 4635 | 17E92768-6819-40CA-ABEB-74E552D24234 |
| 24 | ON | 48 | 4636 | 14820922-D84F-46D2-AD13-E05B05EFA5AB |
| 25 | OFF | 49 | 4637 | 044D81FB-3703-4708-9E52-537DD59F71D4 |
| 25 | ON | 50 | 4638 | A8F75139-C5C6-4EFC-BE66-76E6F1DBBFD9 |
| 26 | OFF | 51 | 4640 | 54D39213-87A7-4237-8FD7-03E63013CD7F |
| 26 | ON | 52 | 4641 | EB258573-72A6-4FCE-8ED3-149D00F2CA1E |
| 27 | OFF | 53 | 4642 | 15DCC47E-E1E5-4DF6-B689-0FFB0D99B241 |
| 27 | ON | 54 | 4643 | 9A6F650A-48A2-4073-80B1-BCC8361F0751 |
| 28 | OFF | 55 | 4644 | E5F531BA-5691-4E1E-9450-C1563619313C |
| 28 | ON | 56 | 4645 | BA8AFC81-F6A7-4DAD-A815-E6E68EB644B3 |
| 29 | OFF | 57 | 4646 | 8D38C40A-7266-4CB2-B74D-6F2CE5740824 |
| 29 | ON | 58 | 4647 | 12024139-4931-42BC-B2CB-25395E9ED4BC |
| 30 | OFF | 59 | 4648 | B162D1B8-6446-42F1-B3B6-1A13C37123CF |
| 30 | ON | 60 | 4650 | DEB40D2E-9DE0-4B9B-BF8D-25E3E107A161 |
| 31 | OFF | 61 | 4651 | 9FD8DFD6-8923-47D0-8FB9-8C63AA5CB0C6 |
| 31 | ON | 62 | 4652 | 4B48CDEB-F4D3-4301-9658-77A6295EAA88 |
| 32 | OFF | 63 | 4653 | F7335DDC-C82A-4A46-B133-E562C4A510FD |
| 32 | ON | 64 | 4654 | 3697F6A2-C541-443E-8616-B40C5C42DA2E |
| 33 | OFF | 65 | 4655 | 9C328703-FF11-433C-83D8-F3E62BB97EB6 |
| 33 | ON | 66 | 4656 | E8506566-71DB-45F9-9182-2E9819607063 |
| 34 | OFF | 67 | 4657 | 43E64238-2E19-4024-B6D9-F13C3D115DC5 |
| 34 | ON | 68 | 4659 | 8C3B4DC0-7BF2-4B05-8214-5AD140F5F904 |
| 35 | OFF | 69 | 4660 | 8A357BAF-2406-402B-B141-FF964168F49D |
| 35 | ON | 70 | 4661 | FF650C9C-08B1-45A5-8C89-1213608B6F98 |
| 36 | OFF | 71 | 4662 | 50441B27-0314-4D5F-AAF1-0ABFDC4D3996 |
| 36 | ON | 72 | 4663 | EDD59D86-36E4-464E-BCF7-64AC4626B651 |
| 37 | OFF | 73 | 4664 | 57EB6832-DC46-4CD5-A911-A3B9DDBAC30B |
| 37 | ON | 74 | 4665 | 54483BEE-9810-4694-8D53-0D56069396C2 |
| 38 | OFF | 75 | 4666 | A5EA2E85-8645-4F0D-8986-DE99A3BECF89 |
| 38 | ON | 76 | 4667 | B990F451-9538-4107-BFD5-9778D0C72963 |
| 39 | OFF | 77 | 4669 | B6647033-90DF-4E17-AD99-0A4105447C81 |
| 39 | ON | 78 | 4670 | EA0DAB35-0572-4A6E-9721-EBA751B6BE48 |
| 40 | OFF | 79 | 4671 | 5DA43FE1-06F6-46C5-82BF-497F52183796 |
| 40 | ON | 80 | 4672 | 197B3257-AB1C-46E1-83A2-B257EC781B60 |
| 41 | OFF | 81 | 4673 | E7602234-9EE1-4646-A051-800A8FE9E928 |
| 41 | ON | 82 | 4674 | 1C138F2A-C1F0-43CC-A630-CAAC1ADD4A11 |
| 42 | OFF | 83 | 4675 | E5243460-2140-4057-8EF7-AAF8346D66FB |
| 42 | ON | 84 | 4676 | 4446F66F-CFE6-403A-920F-742F3BD10B96 |
| 43 | OFF | 85 | 4678 | 417389B6-AE0B-4248-8432-E4A7160EFA80 |
| 43 | ON | 86 | 4679 | F73C9970-B976-444E-9E8E-7E3FCC958E2F |
| 44 | OFF | 87 | 4680 | 064E7515-6032-4EB2-B023-B357FAA1065F |
| 44 | ON | 88 | 4681 | 5CCD4B92-8E6B-4DD4-B1B3-DC1A1A2A81B7 |
| 45 | OFF | 89 | 4682 | E5834818-2862-4C84-8387-E0006E493EBF |
| 45 | ON | 90 | 4683 | 80D55204-5372-4DC6-BFD4-B89677D9A4D4 |
| 46 | OFF | 91 | 4684 | ABDFDCD2-5E8E-493E-B9C1-C3B067415DF5 |
| 46 | ON | 92 | 4685 | 51FBA9E0-CD0E-46A4-9425-4FABD1784CAE |
| 47 | OFF | 93 | 4686 | FCFD8247-02CC-4190-A922-286164ECC387 |
| 47 | ON | 94 | 4688 | 67C2271F-7484-4A51-8E08-9EBE59CCACEB |
| 48 | OFF | 95 | 4689 | 3BA7DF7F-B9AC-4D96-928B-DC1E03D4ADF9 |
| 48 | ON | 96 | 4690 | AD798BC6-DFA6-4EF0-963B-434E520CEF77 |
| 49 | OFF | 97 | 4691 | 3DEDF272-C6E1-4CA7-902B-6BBCC4189F56 |
| 49 | ON | 98 | 4692 | 65630D37-0E95-434A-B4B0-3972804992D8 |
| 50 | OFF | 99 | 4693 | F7F14C29-649D-47F6-ACAD-06B421B13792 |
| 50 | ON | 100 | 4694 | CB69D2F6-4D9C-4EEB-A813-EF333B8074A6 |
| 51 | OFF | 101 | 4695 | 353113E8-94E8-4BED-80CF-15F28B1B51EE |
| 51 | ON | 102 | 4696 | 8AC3B4A5-B616-4370-A082-2B0807E6C00D |
| 52 | OFF | 103 | 4698 | 3E660AF8-B137-43ED-B331-B4BA4C25FA62 |
| 52 | ON | 104 | 4699 | 72D8E6B5-B3E3-4E69-8347-0E0205EA1C16 |
| 53 | OFF | 105 | 4700 | CDAB26D8-64F8-4E47-844D-AA1D208A69CC |
| 53 | ON | 106 | 4701 | 123666FE-91AF-40E7-9813-5DAA28D2FCA9 |
| 54 | OFF | 107 | 4702 | 73BDE629-3B52-4523-8125-58EC78343E0B |
| 54 | ON | 108 | 4703 | 4CA810EF-D3FB-4F0B-BA55-BB6D081AA34D |
| 55 | OFF | 109 | 4704 | DF3C5A56-C2B0-42BE-A854-026E91301719 |
| 55 | ON | 110 | 4705 | FE35B5AB-85B1-481E-996B-FCB2AD93F0FF |
| 56 | OFF | 111 | 4707 | 4F52F564-EB15-4143-BDB4-D8EDE1EADB7C |
| 56 | ON | 112 | 4708 | C7E59FF9-FE5C-4591-A66F-BB789F55EC79 |
| 57 | OFF | 113 | 4709 | E1B3BC9C-EBA0-4BC5-8793-5EB91EE8476E |
| 57 | ON | 114 | 4710 | 0C82259D-8586-4933-8E48-F7DF45C432EE |
| 58 | OFF | 115 | 4711 | B70D85BD-88CC-4E88-A458-78A6CBA62659 |
| 58 | ON | 116 | 4712 | E8E1BE8D-3549-491B-8AB9-0FF58CAEBCD9 |
| 59 | OFF | 117 | 4713 | 78844BD7-9EF0-4DC9-B414-6D00969D5E13 |
| 59 | ON | 118 | 4714 | 3657CF56-AE16-402D-8FEF-1F5AF975F367 |
| 60 | OFF | 119 | 4715 | 21CFE93A-5468-4111-B25C-7F2FA3EB2505 |
| 60 | ON | 120 | 4717 | 7DC8558B-A116-4CD8-ACDD-C4F99710310A |
| 61 | OFF | 121 | 4718 | 4C8D797D-628A-4ECC-A298-912D9CF3F5A2 |
| 61 | ON | 122 | 4719 | 3C1218A7-E4D0-4CC9-B3C8-3E4DF89A4AE2 |
| 62 | OFF | 123 | 4720 | BCC4E8CB-C798-442A-9BC5-12BD733987BC |
| 62 | ON | 124 | 4721 | B1A11EAF-95AC-4421-A62D-42E60D21493C |
| 63 | OFF | 125 | 4722 | F501FFE2-0196-4E2E-A32A-6015F64E56E4 |
| 63 | ON | 126 | 4723 | 0672B36C-CB5F-4B43-8D91-545F99010925 |
| 64 | OFF | 127 | 4724 | 67517F20-ABBB-4169-942A-86904773CE16 |
| 64 | ON | 128 | 4726 | B2AF86A0-0200-4DA7-8953-9C634B33978C |
| 65 | OFF | 129 | 4727 | 613E1B2D-62B4-4D6D-B46B-94CCFCC818AD |
| 65 | ON | 130 | 4728 | 6DA25DBB-778A-4D86-98D4-7FA4FD9D8586 |
| 66 | OFF | 131 | 4729 | 6C9E1F59-0B50-4870-B6B6-8053596F012F |
| 66 | ON | 132 | 4730 | 65838E0F-B1F7-4D38-A30F-1CD96CEE25CE |
| 67 | OFF | 133 | 4731 | F1D92DA8-E8FA-496D-BF7B-84D4FF7C1600 |
| 67 | ON | 134 | 4732 | 378D82FB-8E89-4AEC-93DD-BA4C289013DF |
| 68 | OFF | 135 | 4733 | 6F7CDD1C-DF0E-4DE5-8E7E-8A5DDFE8B3F5 |
| 68 | ON | 136 | 4734 | 23C2F146-0BC3-4FDB-9414-8C48ECD78061 |
| 69 | OFF | 137 | 4736 | 1723579F-16D7-4277-BDDC-897EED70E6D1 |
| 69 | ON | 138 | 4737 | 47855E01-EC06-4ABB-BB4D-7759F1F7F2B3 |
| 70 | OFF | 139 | 4738 | 553FE40D-9755-423B-9BA7-39707D9292ED |
| 70 | ON | 140 | 4739 | 313FE707-C891-4EA9-8A37-567A10A145A7 |
| 71 | OFF | 141 | 4740 | 1D0B1A9D-342E-42B0-95A4-B2BE549ED529 |
| 71 | ON | 142 | 4741 | B7BDAC82-5691-4174-B89D-059BA4BDF843 |
| 72 | OFF | 143 | 4742 | AD77260B-A116-437E-AFA6-FBAC2E2B61E4 |
| 72 | ON | 144 | 4743 | A8F5F0AC-8C12-4CF6-ABCC-3E613955C245 |
| 73 | OFF | 145 | 4745 | 09BCBEA7-B6CB-4483-BAF9-55B00968D665 |
| 73 | ON | 146 | 4746 | 8B1BA74F-4FCE-4E6F-B5B4-09513E4BC1C1 |
| 74 | OFF | 147 | 4747 | 5576845D-6B70-40A0-BB82-7C5C30D9E9F1 |
| 74 | ON | 148 | 4748 | 33B7DE41-013A-4A29-8CEE-AE6818ECE8AE |
| 75 | OFF | 149 | 4749 | 505F6F82-E6BD-4E22-AD68-CADFF5193231 |
| 75 | ON | 150 | 4750 | FD9CDFF2-14DC-4EB8-88B7-6E08D040D023 |
| 76 | OFF | 151 | 4751 | D233AD96-C0FE-4526-B658-419523BD837D |
| 76 | ON | 152 | 4752 | DE7889D8-3CDD-4A76-BC3F-5A625C0AD5E3 |
| 77 | OFF | 153 | 4753 | 533CB4C2-AE3F-4D30-BB68-B2EAAF02271A |
| 77 | ON | 154 | 4755 | 0291891C-501D-444E-8F46-A0E8508489D3 |
| 78 | OFF | 155 | 4756 | E409039F-66C4-4846-9053-09419317BD7E |
| 78 | ON | 156 | 4757 | A8C0BABE-C01E-40C8-91CE-D6FA93E6E6F9 |
| 79 | OFF | 157 | 4758 | FAFC2583-BA7C-405F-A1B7-819621E04A7F |
| 79 | ON | 158 | 4759 | 990CA7B7-37C3-464D-93F3-E7F54BE34178 |
| 80 | OFF | 159 | 4760 | 0FECDC16-81E1-4A78-BA6A-6DD62EC02059 |
| 80 | ON | 160 | 4761 | 068E4E0A-90ED-42D7-BC53-EE6D329C72C9 |
| 81 | OFF | 161 | 4762 | E726A99C-0705-42B8-97CD-9578AB223A3D |
| 81 | ON | 162 | 4763 | EF6F736C-A0FB-4F0C-B41B-BBD36A1B2FA1 |
| 82 | OFF | 163 | 4765 | 9677158E-EC1B-49BD-9C08-A2F2221F0253 |
| 82 | ON | 164 | 4766 | 13B7B878-FF4E-4F28-85F1-827BCA9B7AC7 |
| 83 | OFF | 165 | 4767 | A6E27229-A118-4F0F-8758-F8726091C647 |
| 83 | ON | 166 | 4768 | AF2C27BD-FB01-4EFE-8A1F-82E1F61B40B6 |
| 84 | OFF | 167 | 4769 | A4D60E39-8BB7-49B0-9F68-F594A905ACAC |
| 84 | ON | 168 | 4770 | 4AE10BFE-FFE9-416B-9AF3-A403B9148DCD |
| 85 | OFF | 169 | 4771 | A4AE6712-A832-495D-8CAC-052D7D396289 |
| 85 | ON | 170 | 4772 | 801F2626-E23D-4770-A2BE-2661E804AF99 |
| 86 | OFF | 171 | 4774 | 34DDE90E-86D4-4EB0-8E8C-C22662DB3F83 |
| 86 | ON | 172 | 4775 | 2FC55501-58AC-42D9-8B11-639EBEA4AABF |
| 87 | OFF | 173 | 4776 | 4A272B8C-06EE-4300-A19F-CC2BEBA1300C |
| 87 | ON | 174 | 4777 | 2B9667E4-BE8C-48DE-B9B7-05010A4ECFCE |
| 88 | OFF | 175 | 4778 | 11EA2359-5E02-49FF-A7BF-1CE8FA430FC9 |
| 88 | ON | 176 | 4779 | B569D600-A641-4541-9773-790199DB9C2D |
| 89 | OFF | 177 | 4780 | 594DF5DC-5875-4CEA-8607-AF598C36B98E |
| 89 | ON | 178 | 4781 | 8589BF24-826E-4562-A993-F114F9825DC3 |
| 90 | OFF | 179 | 4782 | 102737C2-ADA1-44DF-A29F-E99AF0E0FC89 |
| 90 | ON | 180 | 4784 | EB4A82BE-A87E-4F93-A43C-DA4DC3D8A536 |
| 91 | OFF | 181 | 4785 | F62D4102-AB84-4AC6-B3CF-96970B0096C5 |
| 91 | ON | 182 | 4786 | 17E727AD-1B52-4D60-BA91-9863E6ED2A10 |
| 92 | OFF | 183 | 4787 | C5019937-762D-4B82-B6D8-F5578080F2CA |
| 92 | ON | 184 | 4788 | F90E44A6-F19F-44CB-9D24-B0E4CD661208 |
| 93 | OFF | 185 | 4789 | 36B42029-6CA4-4B9E-9A8A-5A9D6432BD85 |
| 93 | ON | 186 | 4790 | 97087FA3-42F3-4046-A6F3-2ADF5912E33E |
| 94 | OFF | 187 | 4791 | 63F020B2-BC2E-4F3D-A5F1-BE01CE616C5A |
| 94 | ON | 188 | 4792 | 1B3FA6FC-1A72-4A23-BC66-B222B886C0F0 |
| 95 | OFF | 189 | 4794 | 13C525D0-7622-4EA8-B3FA-68FDDC2A2C92 |
| 95 | ON | 190 | 4795 | FCF7DCAB-13C2-406F-8A49-161E235C1149 |
| 96 | OFF | 191 | 4796 | E0506D44-65F2-457B-AF03-6BA39433234A |
| 96 | ON | 192 | 4797 | 1B02E270-5492-4AE8-825A-D451ED15B9F8 |
| 97 | OFF | 193 | 4798 | BA54371F-7EC9-4AF8-A3AF-B4000069CA81 |
| 97 | ON | 194 | 4799 | F4A74219-2E70-424A-A6CB-DE714F97A5DA |
| 98 | OFF | 195 | 4800 | F0B462A0-CD2B-4630-A553-618C1326D515 |
| 98 | ON | 196 | 4801 | 2ABF2376-D7DD-459A-AC6B-22D4272B02C1 |
| 99 | OFF | 197 | 4802 | 4C666B96-8FA5-4327-BFE8-5409910DB9EA |
| 99 | ON | 198 | 4804 | 7B57464D-781A-40A7-89BD-A05A47E99BCF |
| 100 | OFF | 199 | 4805 | 1C8F60D5-C976-4614-B377-4B39228802BC |
| 100 | ON | 200 | 4806 | 107FD5D7-50E3-46B7-8CEB-2F19F5294848 |
