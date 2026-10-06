# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 63.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 102.000 | 86.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 400 | earlyPOST | h2 | true | 67.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 97.000 | 79.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 400 | earlyPOST | h2 | true | 42.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 45.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | earlyPOST | h2 | true | 100.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 95.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 400 | handshake | h2 | false | 52.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 75.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 72.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 400 | earlyPOST | h2 | true | 93.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 74.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 139.000 | 105.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 400 | handshake | h2 | false | 70.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 60.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 119.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 400 | earlyPOST | h2 | true | 51.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 55.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 62.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 44.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 44.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 48.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 53.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 400 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 84.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 59.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 400 | earlyPOST | h2 | true | 40.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 47.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 400 | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 100.000 | 79.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 62.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 34.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 400 | handshake | h2 | false | 90.000 | 64.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 71.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 79.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 400 | earlyPOST | h2 | true | 51.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 49.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 400 | earlyPOST | h2 | true | 300.000 | 260.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 82.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 80.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 114.000 | 98.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | earlyPOST | h2 | true | 38.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 84.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 400 | handshake | h2 | false | 90.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 46.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 107.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 81.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 81.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 400 | handshake | h2 | false | 79.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 48.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 34.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 400 | handshake | h2 | false | 71.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 400 | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 70.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 400 | handshake | h2 | false | 63.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 59.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 53.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 43.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 400 | handshake | h2 | false | 89.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 104.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 400 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 50.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 400 | earlyPOST | h2 | true | 43.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 400 | handshake | h2 | false | 41.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 31.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 36.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 400 | handshake | h2 | false | 54.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 89.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 400 | handshake | h2 | false | 51.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 89.000 | 72.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 400 | earlyPOST | h2 | true | 60.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 49.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 400 | earlyPOST | h2 | true | 38.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 110.000 | 73.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 152.000 | 128.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 400 | handshake | h2 | false | 55.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 400 | handshake | h2 | false | 62.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 79.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 51.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 400 | earlyPOST | h2 | true | 64.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 23.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 71.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | timeout | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 59.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 65.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 44.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | earlyPOST | h2 | true | 40.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 62.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 131.000 | 91.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 400 | earlyPOST | h2 | true | 63.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 45.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 400 | handshake | h2 | false | 70.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 98.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 400 | earlyPOST | h2 | true | 61.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 52.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 59.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 87.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | earlyPOST | h2 | true | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 92.000 | 78.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 66.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 32.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 43.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 60.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | earlyPOST | h2 | true | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 97.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | earlyPOST | h2 | true | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 57.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 59.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 57.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | earlyPOST | h2 | true | 37.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | OFF | completed | — | handshake | h2 | false | 46.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | OFF | completed | — | handshake | h2 | false | 45.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | ON | completed | 400 | handshake | h2 | false | 33.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | OFF | completed | — | handshake | h2 | false | 76.000 | 64.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | OFF | completed | — | handshake | h2 | false | 275.000 | 262.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | ON | completed | 200 | earlyPOST | h2 | true | 79.000 | 65.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | ON | completed | 200 | earlyPOST | h2 | true | 48.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | OFF | completed | — | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | ON | completed | 400 | earlyPOST | h2 | true | 98.000 | 76.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | OFF | completed | — | handshake | h2 | false | 84.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | ON | completed | 400 | earlyPOST | h2 | true | 59.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | OFF | completed | — | handshake | h2 | false | 44.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | ON | completed | 200 | handshake | h2 | false | 82.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | OFF | completed | — | handshake | h2 | false | 40.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | ON | completed | 400 | earlyPOST | h2 | true | 264.000 | 122.000 | 2404:6800:400b:c017::451 |
| omnient | 111 | OFF | completed | — | handshake | h2 | false | 63.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 111 | ON | completed | 400 | earlyPOST | h2 | true | 33.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 112 | OFF | completed | — | handshake | h2 | false | 60.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 112 | ON | completed | 200 | handshake | h2 | false | 84.000 | 67.000 | 2404:6800:400b:c017::451 |
| omnient | 113 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 113 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 114 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 114 | ON | completed | 400 | earlyPOST | h2 | true | 172.000 | 152.000 | 2404:6800:400b:c017::451 |
| omnient | 115 | OFF | completed | — | handshake | h2 | false | 69.000 | 48.000 | 2404:6800:400b:c017::451 |
| omnient | 115 | ON | completed | 200 | handshake | h2 | false | 42.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 116 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 116 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 117 | OFF | completed | — | handshake | h2 | false | 51.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 117 | ON | completed | 400 | earlyPOST | h2 | true | 44.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 118 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 118 | ON | timeout | 200 | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 119 | OFF | completed | — | handshake | h2 | false | 64.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 119 | ON | completed | 200 | handshake | h2 | false | 52.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 120 | OFF | completed | — | handshake | h2 | false | 42.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 120 | ON | completed | 200 | earlyPOST | h2 | true | 30.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 121 | OFF | completed | — | handshake | h2 | false | 49.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 121 | ON | completed | 400 | earlyPOST | h2 | true | 51.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 122 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 122 | ON | completed | 400 | handshake | h2 | false | 58.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 123 | OFF | completed | — | handshake | h2 | false | 104.000 | 88.000 | 2404:6800:400b:c017::451 |
| omnient | 123 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 124 | OFF | completed | — | handshake | h2 | false | 72.000 | 59.000 | 2404:6800:400b:c017::451 |
| omnient | 124 | ON | completed | 400 | handshake | h2 | false | 54.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 125 | OFF | completed | — | handshake | h2 | false | 54.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 125 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 126 | OFF | completed | — | handshake | h2 | false | 45.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 126 | ON | completed | 400 | handshake | h2 | false | 40.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 127 | OFF | completed | — | handshake | h2 | false | 108.000 | 97.000 | 2404:6800:400b:c017::451 |
| omnient | 127 | ON | completed | 400 | earlyPOST | h2 | true | 59.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 128 | OFF | completed | — | handshake | h2 | false | 58.000 | 45.000 | 2404:6800:400b:c017::451 |
| omnient | 128 | ON | completed | 400 | handshake | h2 | false | 48.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 129 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 129 | ON | completed | 400 | earlyPOST | h2 | true | 67.000 | 52.000 | 2404:6800:400b:c017::451 |
| omnient | 130 | OFF | completed | — | handshake | h2 | false | 35.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 130 | ON | completed | 400 | earlyPOST | h2 | true | 47.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 131 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 131 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 132 | OFF | completed | — | handshake | h2 | false | 46.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 132 | ON | completed | 200 | handshake | h2 | false | 221.000 | 199.000 | 2404:6800:400b:c017::451 |
| omnient | 133 | OFF | completed | — | handshake | h2 | false | 78.000 | 60.000 | 2404:6800:400b:c017::451 |
| omnient | 133 | ON | completed | 400 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 134 | OFF | completed | — | handshake | h2 | false | 79.000 | 54.000 | 2404:6800:400b:c017::451 |
| omnient | 134 | ON | completed | 200 | earlyPOST | h2 | true | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 135 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 135 | ON | completed | 200 | handshake | h2 | false | 77.000 | 48.000 | 2404:6800:400b:c017::451 |
| omnient | 136 | OFF | completed | — | handshake | h2 | false | 76.000 | 56.000 | 2404:6800:400b:c017::451 |
| omnient | 136 | ON | completed | 200 | handshake | h2 | false | 82.000 | 53.000 | 2404:6800:400b:c017::451 |
| omnient | 137 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 137 | ON | completed | 200 | handshake | h2 | false | 35.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 138 | OFF | completed | — | handshake | h2 | false | 88.000 | 72.000 | 2404:6800:400b:c017::451 |
| omnient | 138 | ON | completed | 400 | earlyPOST | h2 | true | 80.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 139 | OFF | completed | — | handshake | h2 | false | 65.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 139 | ON | completed | 200 | earlyPOST | h2 | true | 367.000 | 350.000 | 2404:6800:400b:c017::451 |
| omnient | 140 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 140 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 141 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 141 | ON | completed | 400 | earlyPOST | h2 | true | 70.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 142 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 142 | ON | completed | 400 | earlyPOST | h2 | true | 88.000 | 56.000 | 2404:6800:400b:c017::451 |
| omnient | 143 | OFF | completed | — | handshake | h2 | false | 41.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 143 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 144 | OFF | completed | — | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 144 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 145 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 145 | ON | completed | 400 | handshake | h2 | false | 32.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 146 | OFF | completed | — | handshake | h2 | false | 39.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 146 | ON | completed | 400 | handshake | h2 | false | 49.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 147 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 147 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 148 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 148 | ON | completed | 400 | earlyPOST | h2 | true | 80.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 149 | OFF | completed | — | handshake | h2 | false | 68.000 | 49.000 | 2404:6800:400b:c017::451 |
| omnient | 149 | ON | completed | 400 | earlyPOST | h2 | true | 62.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 150 | OFF | completed | — | handshake | h2 | false | 32.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 150 | ON | completed | 400 | earlyPOST | h2 | true | 44.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 151 | OFF | completed | — | handshake | h2 | false | 26.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 151 | ON | completed | 400 | earlyPOST | h2 | true | 39.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 152 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 152 | ON | completed | 400 | handshake | h2 | false | 58.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 153 | OFF | completed | — | handshake | h2 | false | 58.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 153 | ON | completed | 200 | handshake | h2 | false | 62.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 154 | OFF | completed | — | handshake | h2 | false | 70.000 | 45.000 | 2404:6800:400b:c017::451 |
| omnient | 154 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 155 | OFF | completed | — | handshake | h2 | false | 83.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 155 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 156 | OFF | completed | — | handshake | h2 | false | 37.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 156 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 157 | OFF | completed | — | handshake | h2 | false | 47.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 157 | ON | completed | 400 | earlyPOST | h2 | true | 70.000 | 54.000 | 2404:6800:400b:c017::451 |
| omnient | 158 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 158 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 159 | OFF | completed | — | handshake | h2 | false | 50.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 159 | ON | completed | 400 | earlyPOST | h2 | true | 37.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 160 | OFF | completed | — | handshake | h2 | false | 135.000 | 85.000 | 2404:6800:400b:c017::451 |
| omnient | 160 | ON | completed | 200 | earlyPOST | h2 | true | 43.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 161 | OFF | completed | — | handshake | h2 | false | 52.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 161 | ON | completed | 200 | earlyPOST | h2 | true | 70.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 162 | OFF | completed | — | handshake | h2 | false | 261.000 | 250.000 | 2404:6800:400b:c017::451 |
| omnient | 162 | ON | completed | 200 | handshake | h2 | false | 62.000 | 47.000 | 2404:6800:400b:c017::451 |
| omnient | 163 | OFF | completed | — | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 163 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 164 | OFF | completed | — | handshake | h2 | false | 38.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 164 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 165 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 165 | ON | completed | 200 | handshake | h2 | false | 57.000 | 45.000 | 2404:6800:400b:c017::451 |
| omnient | 166 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 166 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 167 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 167 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 168 | OFF | completed | — | handshake | h2 | false | 86.000 | 68.000 | 2404:6800:400b:c017::451 |
| omnient | 168 | ON | completed | 200 | earlyPOST | h2 | true | 111.000 | 96.000 | 2404:6800:400b:c017::451 |
| omnient | 169 | OFF | completed | — | handshake | h2 | false | 44.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 169 | ON | completed | 400 | earlyPOST | h2 | true | 42.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 170 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 170 | ON | completed | 400 | earlyPOST | h2 | true | 49.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 171 | OFF | completed | — | handshake | h2 | false | 59.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 171 | ON | completed | 400 | earlyPOST | h2 | true | 60.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 172 | OFF | completed | — | handshake | h2 | false | 65.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 172 | ON | completed | 400 | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 173 | OFF | completed | — | handshake | h2 | false | 43.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 173 | ON | completed | 400 | earlyPOST | h2 | true | 40.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 174 | OFF | completed | — | handshake | h2 | false | 60.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 174 | ON | completed | 200 | handshake | h2 | false | 75.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 175 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 175 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 176 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 176 | ON | completed | 200 | handshake | h2 | false | 71.000 | 61.000 | 2404:6800:400b:c017::451 |
| omnient | 177 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 177 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 178 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 178 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 179 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 179 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 180 | OFF | completed | — | handshake | h2 | false | 54.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 180 | ON | completed | 400 | earlyPOST | h2 | true | 70.000 | 40.000 | 2404:6800:400b:c017::451 |
| omnient | 181 | OFF | completed | — | handshake | h2 | false | 66.000 | 45.000 | 2404:6800:400b:c017::451 |
| omnient | 181 | ON | completed | 200 | earlyPOST | h2 | true | 99.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 182 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 182 | ON | completed | 400 | earlyPOST | h2 | true | 46.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 183 | OFF | completed | — | handshake | h2 | false | 49.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 183 | ON | completed | 200 | earlyPOST | h2 | true | 41.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 184 | OFF | completed | — | handshake | h2 | false | 84.000 | 47.000 | 2404:6800:400b:c017::451 |
| omnient | 184 | ON | completed | 200 | handshake | h2 | false | 71.000 | 56.000 | 2404:6800:400b:c017::451 |
| omnient | 185 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 185 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 186 | OFF | completed | — | handshake | h2 | false | 100.000 | 80.000 | 2404:6800:400b:c017::451 |
| omnient | 186 | ON | completed | 400 | handshake | h2 | false | 74.000 | 55.000 | 2404:6800:400b:c017::451 |
| omnient | 187 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 187 | ON | completed | 200 | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 188 | OFF | completed | — | handshake | h2 | false | 75.000 | 63.000 | 2404:6800:400b:c017::451 |
| omnient | 188 | ON | completed | 400 | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 189 | OFF | completed | — | handshake | h2 | false | 64.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 189 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 190 | OFF | completed | — | handshake | h2 | false | 33.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 190 | ON | completed | 400 | earlyPOST | h2 | true | 30.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 191 | OFF | completed | — | handshake | h2 | false | 85.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 191 | ON | completed | 400 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 192 | OFF | completed | — | handshake | h2 | false | 111.000 | 69.000 | 2404:6800:400b:c017::451 |
| omnient | 192 | ON | completed | 400 | earlyPOST | h2 | true | 160.000 | 70.000 | 2404:6800:400b:c017::451 |
| omnient | 193 | OFF | completed | — | handshake | h2 | false | 40.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 193 | ON | completed | 400 | handshake | h2 | false | 53.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 194 | OFF | completed | — | handshake | h2 | false | 37.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 194 | ON | completed | 200 | handshake | h2 | false | 84.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 195 | OFF | completed | — | handshake | h2 | false | 27.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 195 | ON | completed | 400 | handshake | h2 | false | 77.000 | 62.000 | 2404:6800:400b:c017::451 |
| omnient | 196 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 196 | ON | completed | 400 | handshake | h2 | false | 50.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 197 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 197 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 198 | OFF | completed | — | handshake | h2 | false | 37.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 198 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 199 | OFF | completed | — | handshake | h2 | false | 86.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 199 | ON | completed | 400 | handshake | h2 | false | 67.000 | 35.000 | 2404:6800:400b:c017::451 |
| omnient | 200 | OFF | completed | — | handshake | h2 | false | 51.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 200 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 201 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 201 | ON | timeout | 200 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 202 | OFF | completed | — | handshake | h2 | false | 39.000 | 26.000 | 2404:6800:400b:c017::451 |
| omnient | 202 | ON | completed | 400 | earlyPOST | h2 | true | 67.000 | 49.000 | 2404:6800:400b:c017::451 |
| omnient | 203 | OFF | completed | — | handshake | h2 | false | 37.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 203 | ON | completed | 200 | handshake | h2 | false | 53.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 204 | OFF | completed | — | handshake | h2 | false | 52.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 204 | ON | completed | 400 | handshake | h2 | false | 54.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 205 | OFF | completed | — | handshake | h2 | false | 49.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 205 | ON | completed | 200 | earlyPOST | h2 | true | 48.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 206 | OFF | completed | — | handshake | h2 | false | 57.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 206 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 207 | OFF | completed | — | handshake | h2 | false | 53.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 207 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 208 | OFF | completed | — | handshake | h2 | false | 54.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 208 | ON | completed | 400 | earlyPOST | h2 | true | 90.000 | 65.000 | 2404:6800:400b:c017::451 |
| omnient | 209 | OFF | completed | — | handshake | h2 | false | 76.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 209 | ON | completed | 400 | earlyPOST | h2 | true | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 210 | OFF | completed | — | handshake | h2 | false | 38.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 210 | ON | completed | 200 | handshake | h2 | false | 55.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 211 | OFF | completed | — | handshake | h2 | false | 89.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 211 | ON | completed | 200 | handshake | h2 | false | 68.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 212 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 212 | ON | completed | 200 | earlyPOST | h2 | true | 52.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 213 | OFF | completed | — | handshake | h2 | false | 76.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 213 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 214 | OFF | completed | — | handshake | h2 | false | 61.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 214 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 215 | OFF | completed | — | handshake | h2 | false | 42.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 215 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 216 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 216 | ON | completed | 200 | handshake | h2 | false | 78.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 217 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 217 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 218 | OFF | completed | — | handshake | h2 | false | 47.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 218 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 219 | OFF | completed | — | handshake | h2 | false | 42.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 219 | ON | completed | 400 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 220 | OFF | completed | — | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 220 | ON | completed | 400 | earlyPOST | h2 | true | 44.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 221 | OFF | completed | — | handshake | h2 | false | 83.000 | 62.000 | 2404:6800:400b:c019::451 |
| omnient | 221 | ON | completed | 200 | earlyPOST | h2 | true | 55.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 222 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 222 | ON | completed | 400 | earlyPOST | h2 | true | 83.000 | 72.000 | 2404:6800:400b:c019::451 |
| omnient | 223 | OFF | completed | — | handshake | h2 | false | 84.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 223 | ON | completed | 200 | handshake | h2 | false | 38.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 224 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 224 | ON | completed | 200 | handshake | h2 | false | 63.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 225 | OFF | completed | — | handshake | h2 | false | 75.000 | 62.000 | 2404:6800:400b:c019::451 |
| omnient | 225 | ON | completed | 200 | earlyPOST | h2 | true | 116.000 | 78.000 | 2404:6800:400b:c019::451 |
| omnient | 226 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 226 | ON | completed | 400 | handshake | h2 | false | 71.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 227 | OFF | completed | — | handshake | h2 | false | 39.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 227 | ON | completed | 400 | handshake | h2 | false | 251.000 | 232.000 | 2404:6800:400b:c019::451 |
| omnient | 228 | OFF | completed | — | handshake | h2 | false | 119.000 | 89.000 | 2404:6800:400b:c019::451 |
| omnient | 228 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 229 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 229 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 230 | OFF | completed | — | handshake | h2 | false | 119.000 | 108.000 | 2404:6800:400b:c019::451 |
| omnient | 230 | ON | completed | 400 | earlyPOST | h2 | true | 58.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 231 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 231 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 232 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 232 | ON | completed | 200 | handshake | h2 | false | 85.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 233 | OFF | completed | — | handshake | h2 | false | 71.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 233 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 234 | OFF | completed | — | handshake | h2 | false | 59.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 234 | ON | completed | 400 | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 235 | OFF | completed | — | handshake | h2 | false | 99.000 | 70.000 | 2404:6800:400b:c019::451 |
| omnient | 235 | ON | completed | 400 | handshake | h2 | false | 61.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 236 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 236 | ON | completed | 400 | handshake | h2 | false | 55.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 237 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 237 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 238 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 238 | ON | completed | 400 | earlyPOST | h2 | true | 44.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 239 | OFF | completed | — | handshake | h2 | false | 69.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 239 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 240 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 240 | ON | completed | 400 | earlyPOST | h2 | true | 71.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 241 | OFF | completed | — | handshake | h2 | false | 55.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 241 | ON | completed | 200 | earlyPOST | h2 | true | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 242 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 242 | ON | completed | 400 | handshake | h2 | false | 39.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 243 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 243 | ON | completed | 200 | earlyPOST | h2 | true | 39.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 244 | OFF | completed | — | handshake | h2 | false | 206.000 | 176.000 | 2404:6800:400b:c019::451 |
| omnient | 244 | ON | completed | 400 | earlyPOST | h2 | true | 295.000 | 266.000 | 2404:6800:400b:c019::451 |
| omnient | 245 | OFF | completed | — | handshake | h2 | false | 48.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 245 | ON | completed | 400 | handshake | h2 | false | 46.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 246 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 246 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 247 | OFF | completed | — | handshake | h2 | false | 136.000 | 107.000 | 2404:6800:400b:c019::451 |
| omnient | 247 | ON | completed | 400 | earlyPOST | h2 | true | 56.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 248 | OFF | completed | — | handshake | h2 | false | 44.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 248 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 249 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 249 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 250 | OFF | completed | — | handshake | h2 | false | 49.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 250 | ON | completed | 400 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 0.285 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 0.294 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 0.293 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 0.276 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 0.259 | count=2 | handshake POST | handshake POST |
| omnient | 55 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 0.261 | count=1 | handshake POST | post-open POST |
| omnient | 76 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 0.277 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 0.273 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 101 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 101 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 102 | OFF | 0.254 | count=1 | handshake POST | post-open POST |
| omnient | 102 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 103 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 103 | ON | 0.265 | count=0 | early POST | early POST |
| omnient | 104 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 104 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 105 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 105 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 106 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 106 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 107 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 107 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 108 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 108 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 109 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 109 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 110 | OFF | 0.892 | count=0 | post-open POST | post-open POST |
| omnient | 110 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 111 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 111 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 112 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 112 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 113 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 113 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 114 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 114 | ON | 0.295 | count=0 | early POST | early POST |
| omnient | 115 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 115 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 116 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 116 | ON | 0.266 | count=0 | early POST | early POST |
| omnient | 117 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 117 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 118 | OFF | 0.266 | count=0 | post-open POST | post-open POST |
| omnient | 118 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 119 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 119 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 120 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 120 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 121 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 121 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 122 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 122 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 123 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 123 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 124 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 124 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 125 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 125 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 126 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 126 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 127 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 127 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 128 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 128 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 129 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 129 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 130 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 130 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 131 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 131 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 132 | OFF | 0.264 | count=0 | post-open POST | post-open POST |
| omnient | 132 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 133 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 133 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 134 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 134 | ON | 0.268 | count=0 | early POST | early POST |
| omnient | 135 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 135 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 136 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 136 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 137 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 137 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 138 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 138 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 139 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 139 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 140 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 140 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 141 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 141 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 142 | OFF | 0.273 | count=0 | post-open POST | post-open POST |
| omnient | 142 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 143 | OFF | 0.252 | count=1 | handshake POST | post-open POST |
| omnient | 143 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 144 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 144 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 145 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 145 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 146 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 146 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 147 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 147 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 148 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 148 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 149 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 149 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 150 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 150 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 151 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 151 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 152 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 152 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 153 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 153 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 154 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 154 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 155 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 155 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 156 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 156 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 157 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 157 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 158 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 158 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 159 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 159 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 160 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 160 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 161 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 161 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 162 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 162 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 163 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 163 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 164 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 164 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 165 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 165 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 166 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 166 | ON | 0.270 | count=0 | early POST | early POST |
| omnient | 167 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 167 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 168 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 168 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 169 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 169 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 170 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 170 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 171 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 171 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 172 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 172 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 173 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 173 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 174 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 174 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 175 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 175 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 176 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 176 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 177 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 177 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 178 | OFF | 0.272 | count=0 | post-open POST | post-open POST |
| omnient | 178 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 179 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 179 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 180 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 180 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 181 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 181 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 182 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 182 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 183 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 183 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 184 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 184 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 185 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 185 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 186 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 186 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 187 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 187 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 188 | OFF | 0.254 | count=1 | handshake POST | post-open POST |
| omnient | 188 | ON | 0.270 | count=0 | early POST | early POST |
| omnient | 189 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 189 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 190 | OFF | 0.279 | count=2 | handshake POST | handshake POST |
| omnient | 190 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 191 | OFF | 0.268 | count=0 | post-open POST | post-open POST |
| omnient | 191 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 192 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 192 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 193 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 193 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 194 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 194 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 195 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 195 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 196 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 196 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 197 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 197 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 198 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 198 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 199 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 199 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 200 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 200 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 201 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 201 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 202 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 202 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 203 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 203 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 204 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 204 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 205 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 205 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 206 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 206 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 207 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 207 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 208 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 208 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 209 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 209 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 210 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 210 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 211 | OFF | 0.272 | count=0 | post-open POST | post-open POST |
| omnient | 211 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 212 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 212 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 213 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 213 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 214 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 214 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 215 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 215 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 216 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 216 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 217 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 217 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 218 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 218 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 219 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 219 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 220 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 220 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 221 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 221 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 222 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 222 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 223 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 223 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 224 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 224 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 225 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 225 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 226 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 226 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 227 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 227 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 228 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 228 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 229 | OFF | 0.267 | count=0 | post-open POST | post-open POST |
| omnient | 229 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 230 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 230 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 231 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 231 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 232 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 232 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 233 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 233 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 234 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 234 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 235 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 235 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 236 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 236 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 237 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 237 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 238 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 238 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 239 | OFF | 0.249 | count=1 | handshake POST | post-open POST |
| omnient | 239 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 240 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 240 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 241 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 241 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 242 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 242 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 243 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 243 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 244 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 244 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 245 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 245 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 246 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 246 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 247 | OFF | 0.270 | count=0 | post-open POST | post-open POST |
| omnient | 247 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 248 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 248 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 249 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 249 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 250 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 250 | ON | 0.256 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 0 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 145/250 ON trials. Of those trials, 145 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 3, 4, 6, 8, 11, 13, 14, 16, 21, 23, 25, 26, 27, 29, 30, 33, 34, 37, 39, 40, 44, 46, 47, 48, 49, 50, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 64, 65, 67, 68, 71, 72, 74, 78, 79, 80, 81, 83, 88, 90, 91, 95, 97, 99, 101, 102, 103, 107, 108, 110, 111, 113, 114, 117, 121, 122, 124, 126, 127, 128, 129, 130, 131, 133, 138, 141, 142, 143, 144, 145, 146, 148, 149, 150, 151, 152, 155, 157, 158, 159, 163, 164, 166, 167, 169, 170, 171, 172, 173, 175, 177, 180, 182, 185, 186, 188, 189, 190, 191, 192, 193, 195, 196, 197, 198, 199, 200, 202, 204, 208, 209, 214, 215, 219, 220, 222, 226, 227, 229, 230, 233, 234, 235, 236, 238, 239, 240, 242, 244, 245, 246, 247, 248, 249, 250. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 70 ON; omnient pair 118 ON; omnient pair 201 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 26797 | F905A35D-4562-4C32-B653-CBA68729008E |
| 1 | ON | 2 | 26798 | 6FD1B26E-09C5-4D89-A789-BA9CDDB91F0B |
| 2 | OFF | 3 | 26799 | 704AC39E-09BC-49BC-8C94-0C9455AAD546 |
| 2 | ON | 4 | 26800 | E897EA57-B633-4354-A36A-5B94378D901B |
| 3 | OFF | 5 | 26801 | 74C38DFD-4DA8-447B-B2E2-4E8EC6EBAFFE |
| 3 | ON | 6 | 26802 | A85E40AC-9551-45A0-B7B9-9CFD423C7171 |
| 4 | OFF | 7 | 26803 | 1D932E6B-A841-4794-A06E-DF510DE51038 |
| 4 | ON | 8 | 26805 | 13E4EA05-E3BC-413B-B803-47580029DD61 |
| 5 | OFF | 9 | 26806 | 4EF9023D-A1B2-44C5-95CE-4B6A474FE0EB |
| 5 | ON | 10 | 26807 | DE17E3C3-698A-41F1-83B7-E675E8B6DC2D |
| 6 | OFF | 11 | 26808 | D69954D8-0ACA-4477-9994-5CEF2CDAFA0D |
| 6 | ON | 12 | 26809 | DA441A7B-BD57-43F8-A309-EA5F963A4992 |
| 7 | OFF | 13 | 26811 | F3664CD8-20B0-4CAB-BE4D-5C5A57B0D75D |
| 7 | ON | 14 | 26812 | 643B1599-33BA-4305-A601-7C7B5001BDA5 |
| 8 | OFF | 15 | 26813 | 2DF607A2-889E-4D92-8853-E50C84FC02F5 |
| 8 | ON | 16 | 26815 | E3028F24-8E30-4E78-9F4E-B71703645A4E |
| 9 | OFF | 17 | 26816 | E62242B6-785D-4676-9292-5652F0F416AA |
| 9 | ON | 18 | 26817 | AAFE2D67-EDD1-43D8-B30E-5D4245022DA2 |
| 10 | OFF | 19 | 26818 | DBD0BFE9-4B24-4165-AEBA-596900CC63C7 |
| 10 | ON | 20 | 26819 | 44956BBD-1DC3-4933-AA97-A85B4BC0EC3C |
| 11 | OFF | 21 | 26820 | 07720171-4EA2-4758-8E84-BBC957CAA9B8 |
| 11 | ON | 22 | 26821 | 08C509EB-EA6B-4A7B-BA9F-D11618637BBB |
| 12 | OFF | 23 | 26822 | DF0F9F2F-6D7F-4677-9CCD-6E36E3FB736E |
| 12 | ON | 24 | 26823 | F2E3065A-431B-4543-B64B-3D36CEE42DA7 |
| 13 | OFF | 25 | 26825 | 8CEF3A24-4755-42B0-8A22-4E3351B46E51 |
| 13 | ON | 26 | 26826 | 9DE777BE-EBB4-40B9-BD7E-38EF047876FA |
| 14 | OFF | 27 | 26827 | 12639B86-FF60-4F7B-9B6C-9AB3DE5D59BA |
| 14 | ON | 28 | 26828 | 458582BE-512F-4CBD-B30D-B8EBA591167D |
| 15 | OFF | 29 | 26829 | 807F1D96-DAFF-4EC8-BE9E-F2FFB4A0471F |
| 15 | ON | 30 | 26830 | EF912445-D121-45CC-9096-077ADFC633AF |
| 16 | OFF | 31 | 26832 | 95859913-4443-49A4-9B55-79EB2AE8661C |
| 16 | ON | 32 | 26833 | 36D0FC76-C0DD-431B-9871-10DA03C05107 |
| 17 | OFF | 33 | 26834 | A97D2E67-611C-49BB-98AE-D0A1F929718B |
| 17 | ON | 34 | 26835 | 6E30CD5D-6721-40E6-BED7-43F312FB0285 |
| 18 | OFF | 35 | 26836 | 8F28A452-F3CA-45C7-8DEC-405671AA9D98 |
| 18 | ON | 36 | 26837 | 816189E5-B7A9-430A-BCD8-3B8DCDEE53AB |
| 19 | OFF | 37 | 26838 | 3578F78E-EE4F-4BC2-91A9-BFD5830E60BE |
| 19 | ON | 38 | 26839 | 72B736BB-5462-4832-AA3A-7F277B808F83 |
| 20 | OFF | 39 | 26841 | 66B61DA4-C496-43F2-B998-935E0357D635 |
| 20 | ON | 40 | 26842 | 834EB1F4-0FFE-4EA1-B4A3-61E250188CBB |
| 21 | OFF | 41 | 26843 | 6319D1F8-352A-4595-A8F8-54ABA8155295 |
| 21 | ON | 42 | 26844 | B6DDCB61-FB55-4598-AF74-562FB4E67567 |
| 22 | OFF | 43 | 26845 | 81FF42AB-08E6-423E-951C-8CE40867F456 |
| 22 | ON | 44 | 26846 | FEA628D0-09C9-46B5-9B42-D0965FE83FB7 |
| 23 | OFF | 45 | 26847 | 38FE69F1-3C3E-4A81-8507-FBD20746A36E |
| 23 | ON | 46 | 26848 | 7334D000-53F6-4D47-82AC-2F5ECE807AC2 |
| 24 | OFF | 47 | 26850 | CC062A96-0C08-4621-8D8B-A664A160E904 |
| 24 | ON | 48 | 26851 | 244D5690-E2CA-4C1F-B478-1C14D68F2A96 |
| 25 | OFF | 49 | 26852 | B1AC2508-47AB-4C5B-B203-9A6486211381 |
| 25 | ON | 50 | 26853 | 42777DF1-4A3E-413B-9FE9-CBDDC50415CF |
| 26 | OFF | 51 | 26854 | 2D5D7BF0-CEDF-4D12-8D39-7C54DE60B9C3 |
| 26 | ON | 52 | 26855 | 8AAE36C7-191D-4F32-8E19-CC2D2F03D4D6 |
| 27 | OFF | 53 | 26856 | 21AE021F-EF2F-415C-B699-48561B9CE01C |
| 27 | ON | 54 | 26857 | 5D81ECBC-130F-4D87-9116-2DC6F5CBAE7A |
| 28 | OFF | 55 | 26858 | E778FC5D-C111-48DC-821C-1AFC469DD6FE |
| 28 | ON | 56 | 26860 | E8B7D125-E124-4CA6-8D22-2423BD58D369 |
| 29 | OFF | 57 | 26861 | 26942E25-2E28-496A-8889-7E3F51DF6CB5 |
| 29 | ON | 58 | 26863 | C2CEBB95-BD7A-4C2F-B20C-39B305742F3C |
| 30 | OFF | 59 | 26864 | 273EF5AD-CF38-45E8-940C-1C8B1F17333D |
| 30 | ON | 60 | 26865 | 4907B3D8-CB35-4665-9D67-0B596B0D207D |
| 31 | OFF | 61 | 26866 | B3C5367D-EFC7-4A9E-BA5F-5A95A1DA0D9E |
| 31 | ON | 62 | 26867 | DE673306-8BB1-4E01-B2CA-28FFB21F6C73 |
| 32 | OFF | 63 | 26868 | 214A134B-613D-4BA2-B1E1-940AA40EDEC3 |
| 32 | ON | 64 | 26870 | 3D88338A-8946-459E-9BD4-2C581BE3E241 |
| 33 | OFF | 65 | 26871 | 91E875FD-E138-4B20-9404-69E1A2F9EBF9 |
| 33 | ON | 66 | 26872 | 139C5A26-33D5-4E9D-AF5F-F6326795E63B |
| 34 | OFF | 67 | 26873 | 6EAA8CCD-A7EE-4366-A276-5FE3ADF810CD |
| 34 | ON | 68 | 26874 | 19F1781A-8A6E-4953-AC0E-E96705755C48 |
| 35 | OFF | 69 | 26875 | 93022439-54F2-46D1-A57E-803A0F0BAF54 |
| 35 | ON | 70 | 26876 | 54614859-83B7-488A-ACE4-6F3DA5B1B08E |
| 36 | OFF | 71 | 26877 | 018A4152-DE0C-4013-9495-13D267FAA4BD |
| 36 | ON | 72 | 26879 | D00E92FC-FE3C-4A48-BB91-AF4A24770CF3 |
| 37 | OFF | 73 | 26880 | A6C68019-5FF5-41A2-B2A2-AABA226607BE |
| 37 | ON | 74 | 26881 | 31894703-512D-4FCE-BF41-05636E408923 |
| 38 | OFF | 75 | 26882 | 78DAA91D-DFB0-4B87-83FB-288F072F6493 |
| 38 | ON | 76 | 26883 | 268B3418-9767-4BDF-A3BD-639B4A816722 |
| 39 | OFF | 77 | 26884 | 3133BD9E-B531-4C67-A0AC-12B75DE983B1 |
| 39 | ON | 78 | 26885 | 8BE17516-7BE1-4148-913A-9557021FAE20 |
| 40 | OFF | 79 | 26886 | 7255E28F-B462-4CC1-B67B-DF2B28CB83C2 |
| 40 | ON | 80 | 26888 | 42326F24-F71F-4BEF-BADA-5CFF480424FE |
| 41 | OFF | 81 | 26889 | 900E2617-792E-4618-BD57-E5831DFE5820 |
| 41 | ON | 82 | 26890 | BB439952-2AD5-45CD-BFB7-4A3C942CB8A4 |
| 42 | OFF | 83 | 26891 | 298E8E06-912B-4B0E-AC49-1053808EAE21 |
| 42 | ON | 84 | 26892 | CD400224-A002-4FFA-8C3A-B0833C26849D |
| 43 | OFF | 85 | 26893 | AD7CB924-6D20-4E58-9354-B87E5AE514E7 |
| 43 | ON | 86 | 26894 | EE25C193-04B9-493F-B11E-4A67AFB6BB3F |
| 44 | OFF | 87 | 26895 | 55B954F8-A046-42CB-ABD8-99424F2B3F4F |
| 44 | ON | 88 | 26896 | A95F53E1-27DF-459D-B647-B17DD3F6EF99 |
| 45 | OFF | 89 | 26898 | 6C75944D-B765-47DE-AF59-675793DCA6D1 |
| 45 | ON | 90 | 26899 | CA8DE9F9-8410-475C-925D-E53B426AF86B |
| 46 | OFF | 91 | 26900 | CDB2838F-2F57-496A-846C-01BF50825091 |
| 46 | ON | 92 | 26901 | C9DA9DB2-A71F-4F6D-9D4C-330AE72AD1CE |
| 47 | OFF | 93 | 26902 | 28782A61-4797-4CA8-9179-17B43F0B4C3B |
| 47 | ON | 94 | 26903 | 320F603F-C971-48F4-8283-F5B1D2D2F9A3 |
| 48 | OFF | 95 | 26904 | 89DA46DF-2659-4EED-A2C8-506B0F64F2E9 |
| 48 | ON | 96 | 26905 | 724261A1-8C42-4B4D-9592-181F611F6163 |
| 49 | OFF | 97 | 26907 | A86B0D7C-7091-441D-A46B-B5D8EF2C2C93 |
| 49 | ON | 98 | 26908 | 6FA9194A-FA69-4C8A-8171-8B1F69666C0E |
| 50 | OFF | 99 | 26909 | B2D6C2F8-D202-41BB-9215-11B9D5655DCE |
| 50 | ON | 100 | 26910 | D2BAE7E0-FE53-4B8D-A477-2EDD704F2766 |
| 51 | OFF | 101 | 26911 | E4B97976-A436-47C5-B82A-348C304958F3 |
| 51 | ON | 102 | 26912 | 3713B287-51AE-4EE7-9DF2-4050AC164ED5 |
| 52 | OFF | 103 | 26913 | 994309C4-355D-4C70-AF65-9B936E6D0CC2 |
| 52 | ON | 104 | 26914 | D78E8C22-38DC-44E6-93E7-CC081CA4E1A2 |
| 53 | OFF | 105 | 26916 | C12AC1A9-C24F-4432-9DDE-B708E16CB7C8 |
| 53 | ON | 106 | 26917 | 45DEB82C-07E5-409A-8923-0341AD983D24 |
| 54 | OFF | 107 | 26918 | 563DB955-EC02-43FF-9196-D7F9B4894FE5 |
| 54 | ON | 108 | 26919 | 0DC0CD6D-EA1E-4A11-AA4B-AB9329AF4515 |
| 55 | OFF | 109 | 26920 | 6F2130DC-527A-4E8F-BA99-DEB410643A62 |
| 55 | ON | 110 | 26921 | 83B72455-324C-49E8-B86A-4E623AE95E22 |
| 56 | OFF | 111 | 26922 | 4B316E93-8CA8-469A-B8D6-627FE91C6C91 |
| 56 | ON | 112 | 26923 | AB323390-3ECE-4E5F-989C-C6DDCB76DEC2 |
| 57 | OFF | 113 | 26924 | 995A4C70-ACD1-4435-AB71-6BB7E32A8E04 |
| 57 | ON | 114 | 26926 | 9CFA75AE-6B05-48E1-A84B-4B59B0E73CBA |
| 58 | OFF | 115 | 26927 | 6BD00A47-5B74-4BCE-AC27-446E8151A7AE |
| 58 | ON | 116 | 26928 | 00A9DBF3-BAC9-4D52-A14C-BDDDF1724235 |
| 59 | OFF | 117 | 26929 | C0F12752-98E6-493D-98FA-CC344AB04C57 |
| 59 | ON | 118 | 26930 | 4A1820E3-9C15-401C-AA11-AFC4B67CBAE7 |
| 60 | OFF | 119 | 26931 | A6B6C71B-EF81-4A12-AF91-656E035B22FC |
| 60 | ON | 120 | 26932 | F574E408-FA12-4F42-A1E5-FD41E0BCDC01 |
| 61 | OFF | 121 | 26933 | FDAB9765-30D0-40BA-A01F-8E4EC3A8C95E |
| 61 | ON | 122 | 26935 | BFFD64D5-746B-4E5F-BCE5-1F9440F11247 |
| 62 | OFF | 123 | 26936 | 496FB2EC-06DF-474D-9466-136616B78CEE |
| 62 | ON | 124 | 26937 | B6EC7B39-460A-41B6-9C2E-6AC1C4A57141 |
| 63 | OFF | 125 | 26938 | 21502B50-54CD-4B56-A450-EC375581F192 |
| 63 | ON | 126 | 26939 | 16450394-20E1-4DD6-B60F-225E88E2329D |
| 64 | OFF | 127 | 26940 | AF53BBDB-3D59-4902-BABC-EA71E33C6309 |
| 64 | ON | 128 | 26941 | 1130A431-621C-46D4-A204-F2CCFD0DA11B |
| 65 | OFF | 129 | 26942 | 7EF1BF3C-3646-4777-AA26-A56869B24264 |
| 65 | ON | 130 | 26944 | 3A6CAE8D-D021-40C6-A99B-D7C281792C2D |
| 66 | OFF | 131 | 26945 | 1CC8C997-5727-446B-A2B3-6678516CD348 |
| 66 | ON | 132 | 26946 | 6B5D607B-C6DA-4D29-B69C-326AF5F4877A |
| 67 | OFF | 133 | 26947 | A26588CE-D3BA-41C5-AB0B-0CA5828A79DB |
| 67 | ON | 134 | 26948 | AB61CEC8-B482-49C2-AE26-3B0D2D77C3ED |
| 68 | OFF | 135 | 26949 | C1609E9A-3EE6-461A-BAC1-B2AAF9325E95 |
| 68 | ON | 136 | 26950 | A2D0CD0A-A5CB-4A92-ADE7-39155B3D79C0 |
| 69 | OFF | 137 | 26951 | 35AC0B01-8E68-42FA-9B5A-519808729D4E |
| 69 | ON | 138 | 26953 | 132A1648-1545-475D-851E-DCAB8BDEDACD |
| 70 | OFF | 139 | 26954 | EBAB6CC3-82FE-46B2-89F2-A2B33B820536 |
| 70 | ON | 140 | 26955 | CA190A0D-7617-4FB8-92CA-59B5110E8633 |
| 71 | OFF | 141 | 26962 | 373DC6DA-7BE8-418A-9502-E945183632F3 |
| 71 | ON | 142 | 26963 | 92622417-6065-4835-86D0-4676B0746863 |
| 72 | OFF | 143 | 26964 | 275189D0-49A0-4868-96C2-751F9C2F501E |
| 72 | ON | 144 | 26965 | 85336F49-CEF2-4468-8982-2C8459BDBD33 |
| 73 | OFF | 145 | 26966 | 124C5B89-2325-4022-88A7-DF6BFB1DA3FC |
| 73 | ON | 146 | 26967 | 14DF967D-D2E9-4384-9AAA-47D3CF63C0A7 |
| 74 | OFF | 147 | 26969 | FC632FA3-C129-4D67-8940-036D6CEFAEAD |
| 74 | ON | 148 | 26970 | 834A591A-7FCC-4B0D-88B9-0F54DA7B00D5 |
| 75 | OFF | 149 | 26971 | 3786B941-5359-44A2-A068-CC75F1E3C9F6 |
| 75 | ON | 150 | 26972 | EBFAB132-AAFB-4058-9211-69334100765E |
| 76 | OFF | 151 | 26973 | 97702E10-2D34-4315-8325-02E9F02FBAA9 |
| 76 | ON | 152 | 26974 | 923D1864-0AEC-4DE2-916A-86DD9C333BCD |
| 77 | OFF | 153 | 26975 | A108023A-9D43-43B9-8767-D037C742D5A0 |
| 77 | ON | 154 | 26976 | 383EC6B9-268F-4FD5-89B2-541FE114EE13 |
| 78 | OFF | 155 | 26977 | 58F2B1E4-68A3-4669-9D0A-884CF0597964 |
| 78 | ON | 156 | 26979 | CD90DD79-458B-4A05-BE4E-5A5AF78B5E2A |
| 79 | OFF | 157 | 26980 | 34465138-7415-48C6-A6BA-3B4BB58D3EF4 |
| 79 | ON | 158 | 26981 | 05F470EC-0FAA-49D4-9F08-D1C25978A616 |
| 80 | OFF | 159 | 26982 | 70005CFC-2829-44A8-A8A6-7BEEF144DB19 |
| 80 | ON | 160 | 26983 | 2C91E750-471B-4B65-A0EE-DE5793E3B0F4 |
| 81 | OFF | 161 | 26984 | 153A22FD-CB2E-4B2F-9271-5C9DC144D8BF |
| 81 | ON | 162 | 26985 | 5655FF01-61B9-461C-B001-C914BAD42710 |
| 82 | OFF | 163 | 26986 | 0CDB2933-65D4-45F2-93EE-53D7376F5ECC |
| 82 | ON | 164 | 26988 | 8F4971C7-C7FF-44CF-B2DB-2BAD03DD9E25 |
| 83 | OFF | 165 | 26989 | 180CF526-1D8F-4821-B166-FFF2BCD588E4 |
| 83 | ON | 166 | 26990 | 4A6B362A-0DC6-47E1-A149-6D9AE1192FF7 |
| 84 | OFF | 167 | 26991 | 947650DC-0F43-4034-A0AC-7984DF87553B |
| 84 | ON | 168 | 26992 | 8EED96C8-021C-4F7F-AA17-205FB07544A4 |
| 85 | OFF | 169 | 26993 | A9682A98-EAB4-4A1B-9EAC-46CBEBFF67D8 |
| 85 | ON | 170 | 26994 | 72BA295B-D05B-4E7C-A30D-586ADF02E259 |
| 86 | OFF | 171 | 26995 | 5892777D-617E-43DB-B23F-4CD31A6B1B81 |
| 86 | ON | 172 | 26996 | 08F4B845-F672-4A05-B7B7-88FAE376D7ED |
| 87 | OFF | 173 | 26998 | 46A36A30-2785-455A-82DE-021561D15859 |
| 87 | ON | 174 | 26999 | 053BB2EA-B181-4D39-8D07-F42384B2F498 |
| 88 | OFF | 175 | 27000 | F90105B0-D7C3-4905-9F2D-C5071ED9D7FA |
| 88 | ON | 176 | 27001 | ACA4ED9F-E053-4BC5-BBBE-02014773BB1F |
| 89 | OFF | 177 | 27002 | 572AD69A-5804-4EED-BE26-775F668F8C27 |
| 89 | ON | 178 | 27003 | 96C0B531-2B51-4E97-B1C8-547EADBD4133 |
| 90 | OFF | 179 | 27004 | E31B2445-0A4B-4552-9DBB-BF94A3AC4EE8 |
| 90 | ON | 180 | 27005 | E70C5460-2D9B-4287-8DCC-378450AFE062 |
| 91 | OFF | 181 | 27007 | 77554021-6DB9-4852-93C6-704C6777B936 |
| 91 | ON | 182 | 27008 | 8ABC1571-4235-4ADA-BC28-644E80267C70 |
| 92 | OFF | 183 | 27009 | D86DB8D0-CF06-406F-836F-759AEBF5D084 |
| 92 | ON | 184 | 27010 | 10C65306-22F3-4D75-B91E-F6A155924DBF |
| 93 | OFF | 185 | 27011 | F6D122F7-6D50-4EF3-9215-066ECDFDE460 |
| 93 | ON | 186 | 27012 | CEF7C05B-B55B-499D-B9EC-AA4EC30071AB |
| 94 | OFF | 187 | 27013 | 1A2EFD4C-0BC1-4778-9B28-706A3041A667 |
| 94 | ON | 188 | 27014 | 00385C67-2AB8-47D1-B642-0C431AACC7AD |
| 95 | OFF | 189 | 27016 | 711B5008-D5C3-45F2-8A26-061F73EFB2C9 |
| 95 | ON | 190 | 27017 | 9DB62408-2CDB-4ABB-9024-1DFA8C9A37AA |
| 96 | OFF | 191 | 27018 | 2BA5152F-D9E0-4C43-BA4C-CC66421D0B1A |
| 96 | ON | 192 | 27019 | 08C5769B-2488-4C48-B568-1961730519D3 |
| 97 | OFF | 193 | 27020 | 656637A6-8ADB-48D8-B4BA-DE452A46D0AF |
| 97 | ON | 194 | 27021 | BD9E4916-08D1-49BB-94AC-229129EB1DF4 |
| 98 | OFF | 195 | 27022 | 98664EDE-11B1-43DD-AFD8-5AA76D73CBE9 |
| 98 | ON | 196 | 27023 | 507E3164-DEC5-4CEE-8FB8-AE96F3958F99 |
| 99 | OFF | 197 | 27024 | 3BA34278-0DA0-416C-91A1-C5758934C4DF |
| 99 | ON | 198 | 27026 | C84625DD-EE1F-440C-9D0F-7A2BDA301742 |
| 100 | OFF | 199 | 27027 | 724B6C46-9B1A-4F1A-93EA-94CF36B92DF5 |
| 100 | ON | 200 | 27028 | 1CCD8CC7-1FEB-46BF-90A3-A3ADD2876BE9 |
| 101 | OFF | 201 | 27029 | 856537F2-7BEF-4A3B-9453-2936541B2E66 |
| 101 | ON | 202 | 27030 | 0FCE9CFB-BC69-4F66-AC0D-6D9FEF986861 |
| 102 | OFF | 203 | 27031 | 3989FFC5-B735-46FA-AFEC-423755DF2839 |
| 102 | ON | 204 | 27032 | 70C5AFB9-116C-498A-8D65-EE0831C12FA5 |
| 103 | OFF | 205 | 27033 | 87AEEE86-2444-4696-8BDE-48F85F67642E |
| 103 | ON | 206 | 27035 | 74E974F3-55C3-41E2-9E50-590D40D194CC |
| 104 | OFF | 207 | 27036 | AE5B5FFE-0C5C-494F-A48C-5D1BB2B7D6C7 |
| 104 | ON | 208 | 27037 | 5D2F1479-8299-4CBA-AB61-4B99E94E6F8B |
| 105 | OFF | 209 | 27038 | B96378EC-9E0F-40F6-A50A-801DBEDCCFEE |
| 105 | ON | 210 | 27039 | 23A48A63-0C70-4913-9903-8963B3F64B77 |
| 106 | OFF | 211 | 27040 | 82AC279E-D0FE-47B0-B88D-B449D04CAEF4 |
| 106 | ON | 212 | 27041 | 79FDCDAD-160F-4D24-84CE-E888F128F0F0 |
| 107 | OFF | 213 | 27042 | 9A8256F7-58DA-4D14-A3F8-245B7085B8DE |
| 107 | ON | 214 | 27043 | 93E674D2-4DB4-44CE-B027-D26441B75881 |
| 108 | OFF | 215 | 27045 | BE4BD4E9-0F16-40BA-8637-752B0BD0BC75 |
| 108 | ON | 216 | 27046 | AC59A910-C995-467E-A94E-A0383F921EC3 |
| 109 | OFF | 217 | 27047 | BAF710C8-29B1-4984-8229-CD18DABAB715 |
| 109 | ON | 218 | 27048 | CA53B106-7277-441F-A1FD-73AC7FB7BBFC |
| 110 | OFF | 219 | 27093 | AC6A7F35-E31E-43DB-89F0-29FC9CBB25A2 |
| 110 | ON | 220 | 27095 | 9644F53A-27F6-4D98-8B5A-4632A35430D8 |
| 111 | OFF | 221 | 27096 | 1FEA49A6-D825-4A61-A319-62D5A4591D3A |
| 111 | ON | 222 | 27097 | CEBDD863-266D-4FDE-B3B7-BB3634EDDAE2 |
| 112 | OFF | 223 | 27098 | 8A2CFB70-BF49-4FB2-ACE6-4059D981BEC0 |
| 112 | ON | 224 | 27099 | 21714684-C84F-4C8A-868D-B2C5A34D0222 |
| 113 | OFF | 225 | 27100 | EF9791FB-5210-48B6-9F89-88334312FDD4 |
| 113 | ON | 226 | 27102 | 036EB035-84E4-4D61-BB6C-FADCC3552F4F |
| 114 | OFF | 227 | 27103 | C077E8C6-BBEB-4867-B635-2914BA389754 |
| 114 | ON | 228 | 27104 | F5E01F0E-E3C3-4963-A2EC-0EE51FC255ED |
| 115 | OFF | 229 | 27105 | 1EF4DFB5-BC57-4941-8C19-81B4D36FDC36 |
| 115 | ON | 230 | 27106 | D60BDDF8-4AA9-4A8A-8064-C36B7184A2C4 |
| 116 | OFF | 231 | 27107 | 27E6F0FF-7D37-4A65-8B6A-4057BF6099B0 |
| 116 | ON | 232 | 27108 | 5309389B-D5B1-4169-9966-724980645603 |
| 117 | OFF | 233 | 27109 | 1AFA181E-1B08-4DA9-A294-A48F58604C2C |
| 117 | ON | 234 | 27110 | B50EFEF2-E997-42DE-B525-227C906D5256 |
| 118 | OFF | 235 | 27112 | 16E56840-9BE3-4F36-BAF4-ABD1553B419A |
| 118 | ON | 236 | 27113 | AEEA34A8-067E-42B9-B3BD-BE7C51F882DB |
| 119 | OFF | 237 | 27120 | 2C6E1837-E652-4CBA-AFDD-E08E6D015CEC |
| 119 | ON | 238 | 27121 | EB04DFBA-24C2-4A7F-994F-FA3065549984 |
| 120 | OFF | 239 | 27122 | 0921DD3A-0837-44FA-AC9A-18369A128290 |
| 120 | ON | 240 | 27123 | C806185A-FD8C-4949-A863-A03337153736 |
| 121 | OFF | 241 | 27124 | 249C45C8-2816-4281-B5B4-116198B7EE35 |
| 121 | ON | 242 | 27125 | F5AAF161-9814-4A4E-8C1B-1B4C902891EF |
| 122 | OFF | 243 | 27127 | 542F6706-5639-42B8-8D13-E8AF79525E3B |
| 122 | ON | 244 | 27128 | 335E83CA-4503-436E-9C33-BED02BF835E6 |
| 123 | OFF | 245 | 27129 | A368FB93-73E7-43E2-8724-A3071EB53843 |
| 123 | ON | 246 | 27130 | 0A0CE8BF-2F7A-4A9B-A144-A7BF832406A0 |
| 124 | OFF | 247 | 27131 | 8DA4B5B0-CA03-4E1A-9238-EDA977048AE2 |
| 124 | ON | 248 | 27132 | 2768EAB6-3E0B-41D2-AEAC-0E7F25C83DD0 |
| 125 | OFF | 249 | 27133 | 63DABDB2-22DA-4724-9296-FDDE6690A367 |
| 125 | ON | 250 | 27134 | B2C2D342-EF3B-4FCA-94EB-5B205679FEBD |
| 126 | OFF | 251 | 27135 | CED5CA5F-FCF4-48EA-B05A-F4EA0C897741 |
| 126 | ON | 252 | 27137 | BE86B537-3249-465B-AF8A-D46CC8544A11 |
| 127 | OFF | 253 | 27138 | 0DD93720-30AB-4C05-B691-64BB0F808BFE |
| 127 | ON | 254 | 27139 | 481E3569-8BBE-4EAA-9B5B-5D963371DD28 |
| 128 | OFF | 255 | 27140 | FE4813F5-9AC5-4CA5-8FEA-5C215AFD65BF |
| 128 | ON | 256 | 27141 | 5B7569DE-9043-44D5-B0A3-DDE1EEE8A37D |
| 129 | OFF | 257 | 27142 | 3EDD1D8B-E205-482E-BA3E-431E8D5104B0 |
| 129 | ON | 258 | 27143 | 6D002C47-F420-4AD0-A452-77B580D9FC4A |
| 130 | OFF | 259 | 27144 | A33C3643-FC6B-4BA0-8D5B-CC18E1F7F98A |
| 130 | ON | 260 | 27146 | 14E13E21-0649-45AD-AD16-E9DCB06566BB |
| 131 | OFF | 261 | 27147 | 21D7C486-BF86-4684-999C-5076EA3EA141 |
| 131 | ON | 262 | 27148 | 2717F382-F2EC-4353-BF1B-1E760AA7DCB4 |
| 132 | OFF | 263 | 27149 | 0CDED62A-1218-4229-9C81-8F160237D423 |
| 132 | ON | 264 | 27150 | F202C7CE-51FC-4EA3-82D6-99C44CCE4634 |
| 133 | OFF | 265 | 27151 | 3C110996-658D-48D5-87D0-C07730F9F8D7 |
| 133 | ON | 266 | 27152 | A06FF8C5-15D6-43E6-828F-6D7726282084 |
| 134 | OFF | 267 | 27154 | 49D84A11-45AA-4F56-A06F-F22B1B420027 |
| 134 | ON | 268 | 27155 | EA77A97A-A2EA-4437-A457-8193883A96B6 |
| 135 | OFF | 269 | 27156 | F0185B90-FFFA-450A-B5A9-26CBCFE067CF |
| 135 | ON | 270 | 27157 | B087F815-3CB4-405E-821B-B64C06966FDC |
| 136 | OFF | 271 | 27158 | BFDE5B82-5212-4579-B574-B10AAAE10A85 |
| 136 | ON | 272 | 27159 | E2437194-C556-4D4E-AD55-597B42073D7E |
| 137 | OFF | 273 | 27160 | 01CEE413-534D-481B-9A1A-FC3A1DBE62AE |
| 137 | ON | 274 | 27161 | 4B9DC390-D2E1-441C-B585-4E512A14D051 |
| 138 | OFF | 275 | 27162 | 326F677A-B663-4265-A166-65B04155650A |
| 138 | ON | 276 | 27164 | 922E5E8D-9B5E-460F-8006-D1B7BE307D1C |
| 139 | OFF | 277 | 27165 | CFA34CCF-9961-4E38-BD25-591618F860EA |
| 139 | ON | 278 | 27166 | 15ED5618-6AC6-4AA6-A8A2-2AC545768B2D |
| 140 | OFF | 279 | 27167 | 2A660083-F02E-42AB-867A-B609BBF8C239 |
| 140 | ON | 280 | 27168 | A476B455-8B98-4E16-A84A-00D31917ABD6 |
| 141 | OFF | 281 | 27169 | A4639574-A2B6-430F-95F6-0F46B0C37229 |
| 141 | ON | 282 | 27170 | AE0E4EF7-FDE3-49C5-99FC-FA584CF79FAC |
| 142 | OFF | 283 | 27171 | 4727FB5F-194B-4229-BE9A-6C63E5CB286C |
| 142 | ON | 284 | 27173 | BCC999CC-919B-4044-B0AB-6DFFFEE19321 |
| 143 | OFF | 285 | 27174 | E39E15C3-63A1-4C6A-899F-155543126FAC |
| 143 | ON | 286 | 27175 | 2278F549-DBFF-4AA9-8689-979D5E0D4C43 |
| 144 | OFF | 287 | 27176 | 8C3F1756-3CB5-4198-A2A4-6C2A14940154 |
| 144 | ON | 288 | 27177 | 136240A9-3778-432E-B9E9-B4EAD76B536D |
| 145 | OFF | 289 | 27178 | 1F6E0979-F2C3-4119-894D-0CA10DF41363 |
| 145 | ON | 290 | 27179 | A30DE59E-2841-4614-88EC-9AC794775556 |
| 146 | OFF | 291 | 27180 | BCFDCF05-DAB8-41C6-80DF-2C5340593650 |
| 146 | ON | 292 | 27182 | ED22C01E-AF10-4CFF-A690-AD5ECCD3E668 |
| 147 | OFF | 293 | 27183 | 15B98559-85B3-4190-B5F3-81D266D5DF44 |
| 147 | ON | 294 | 27184 | A9E13014-3F9C-4B55-83F8-B2F0F76E4714 |
| 148 | OFF | 295 | 27185 | 0A145594-4F2C-4E6E-B286-EC242F4BAD81 |
| 148 | ON | 296 | 27186 | 3988BB73-CD24-4654-99B1-114EA05E4531 |
| 149 | OFF | 297 | 27187 | B05A9E8D-8285-46DF-97C1-5A8B26916221 |
| 149 | ON | 298 | 27188 | 6AF58F80-0B86-4C88-8B1F-54C3E3778BB8 |
| 150 | OFF | 299 | 27189 | 4B6D4EB2-DD6C-46C9-987B-FC7F529448FE |
| 150 | ON | 300 | 27191 | AB84CA11-1D06-45E2-A5DC-841B4E860E64 |
| 151 | OFF | 301 | 27192 | 60C3DCF6-96E9-42F4-9434-99F41038535B |
| 151 | ON | 302 | 27193 | EF6C5487-3ECB-457E-A23F-7FCE73EC2CE9 |
| 152 | OFF | 303 | 27194 | 11390A7D-1CF9-4C47-83E7-9003F39CE97D |
| 152 | ON | 304 | 27195 | A61117B8-0400-49EC-9322-CEC1989E0281 |
| 153 | OFF | 305 | 27196 | 9D31ADE8-04B9-4D73-8C19-CE1961DD5525 |
| 153 | ON | 306 | 27197 | BDA1E92E-0E7D-487D-B646-AB469F0320CE |
| 154 | OFF | 307 | 27198 | 29DC7B34-96BE-4FF2-A930-E6230B8CA7C6 |
| 154 | ON | 308 | 27199 | 23B4EEC0-4045-4084-992F-93B6464B2FBB |
| 155 | OFF | 309 | 27201 | CAD80C8D-D464-4D0A-99DC-DC10379F9509 |
| 155 | ON | 310 | 27202 | 7EBEC911-563A-4DEE-89E7-FBF69889D112 |
| 156 | OFF | 311 | 27203 | 4C523393-6E14-4B57-B5FE-E264569480EF |
| 156 | ON | 312 | 27204 | 5A79CCC3-CAF1-47CB-B1A2-5A60641813A6 |
| 157 | OFF | 313 | 27205 | EA6D9A66-92AD-4655-A05A-6063BBDD6657 |
| 157 | ON | 314 | 27206 | 8F4BC914-67B8-4ADA-A659-16041BFEF35D |
| 158 | OFF | 315 | 27207 | 4D5126CD-DB64-4A4A-BCAE-BC441F13720F |
| 158 | ON | 316 | 27208 | B3ACCDA7-91D7-4CE2-ADD4-3E6B0D4F84BE |
| 159 | OFF | 317 | 27210 | 75A4F147-9D37-4F0B-8AEA-B9AEC0198267 |
| 159 | ON | 318 | 27211 | 0F2F1AEF-2EA6-4B6A-BC4A-0C997CF6F8EF |
| 160 | OFF | 319 | 27212 | A16CD448-F60A-45F6-96C6-9F1878FB8885 |
| 160 | ON | 320 | 27213 | C1B3E095-053A-4CD4-95D9-A1FA3E0CA642 |
| 161 | OFF | 321 | 27214 | F7E63FDD-F72F-48F0-8CF0-FDF5E46E7429 |
| 161 | ON | 322 | 27215 | B719DE61-0464-40D1-93D3-4CA824869F95 |
| 162 | OFF | 323 | 27216 | 1E9E9341-9411-4FDF-9E80-4830006AC15D |
| 162 | ON | 324 | 27217 | 75F22B71-DC52-426C-AD9B-4BC8AD342D70 |
| 163 | OFF | 325 | 27219 | 35C1B8B6-ED85-41FE-B12F-C20E3DD25587 |
| 163 | ON | 326 | 27220 | 261AE1B0-069E-4727-B568-805F2E466492 |
| 164 | OFF | 327 | 27221 | 1D96DBD9-3181-4CB4-B9A6-AAB895D41EAC |
| 164 | ON | 328 | 27222 | EFEB7A34-4C02-461B-9297-ADFF945B8D2B |
| 165 | OFF | 329 | 27223 | FB37A60C-2A6A-45B7-B342-725C07C36696 |
| 165 | ON | 330 | 27224 | F1577FCA-EBFE-4C2E-B3A7-AFDFCAF9C38C |
| 166 | OFF | 331 | 27225 | 0F5FAB3C-3C07-47B6-A249-CA52E7E50FF3 |
| 166 | ON | 332 | 27226 | 2D72463B-A152-49B8-9B80-3FFF5454B100 |
| 167 | OFF | 333 | 27227 | 7DB4DD08-2DC6-43B3-A358-1F46C1E81BED |
| 167 | ON | 334 | 27229 | 7A40FF27-3129-46B6-AB73-2BCD8E1AC511 |
| 168 | OFF | 335 | 27230 | 014D844E-5BF7-4C1D-9981-EB12E9898A01 |
| 168 | ON | 336 | 27231 | 0947F3D8-6C47-48B0-8FBF-843729BC9028 |
| 169 | OFF | 337 | 27232 | 6195B115-369C-42AD-9C6C-DA7537893AAB |
| 169 | ON | 338 | 27233 | 427A21C9-6712-4F43-90CC-B71F726FA5D9 |
| 170 | OFF | 339 | 27234 | 37E72872-0A75-44CD-915B-AD2633D01EAC |
| 170 | ON | 340 | 27235 | ABC729C7-6940-48A5-8429-EB0F6FA9D0FA |
| 171 | OFF | 341 | 27236 | 37F057D0-A095-4F68-AA9C-D53879F3BC68 |
| 171 | ON | 342 | 27238 | 3D519A6B-63A7-4B03-8EF9-FBD8D0DABF2B |
| 172 | OFF | 343 | 27239 | 6229FF23-61F0-4B8B-AD20-6F2472C18938 |
| 172 | ON | 344 | 27240 | 7BCCBFCB-BCB2-4E34-BC23-62B1D22EE2F5 |
| 173 | OFF | 345 | 27241 | 9A1F887F-79A7-43CF-8676-99B7571E40E7 |
| 173 | ON | 346 | 27242 | AE91A68C-22AB-4960-9CB3-1EBD3380E692 |
| 174 | OFF | 347 | 27243 | F0588147-711A-4C23-8D40-FFEC1B829078 |
| 174 | ON | 348 | 27244 | 4922C522-19C6-49A1-9EDB-A1EF7DE6BFCE |
| 175 | OFF | 349 | 27245 | 978826CA-03D9-4A86-BF6C-4DCF5E226945 |
| 175 | ON | 350 | 27247 | 2EF0B91B-1292-4C7F-B441-1B372E04BF80 |
| 176 | OFF | 351 | 27248 | 975E0A8A-267F-4CB0-8D59-9FFBD67B3556 |
| 176 | ON | 352 | 27249 | F25CC58C-9AB1-4ABC-B12D-393E50BBAB1F |
| 177 | OFF | 353 | 27250 | 8038C6AB-157E-481D-99E2-334B54177AB3 |
| 177 | ON | 354 | 27251 | 901F1496-342A-411B-B027-A3784A846538 |
| 178 | OFF | 355 | 27252 | F6632B7F-B0CA-4FD1-B0D4-549854D58416 |
| 178 | ON | 356 | 27253 | 97359531-97BF-4562-A710-C36C3D2D0CC8 |
| 179 | OFF | 357 | 27254 | DE7A1E35-C7F9-437F-8CF4-5CAE6B93A080 |
| 179 | ON | 358 | 27255 | 63E3F271-C4C2-4555-9CAE-1B9C0612E0E3 |
| 180 | OFF | 359 | 27257 | FF2BC64B-5D75-4F77-818A-032AAB80671B |
| 180 | ON | 360 | 27258 | F97269A0-65C0-44EE-981D-153F80881817 |
| 181 | OFF | 361 | 27259 | 53DAD455-DFEF-40E6-ACF7-CA59B8F7BFFC |
| 181 | ON | 362 | 27260 | 2CC5ED60-97B0-4301-9047-1F373DB726C1 |
| 182 | OFF | 363 | 27262 | E9DEBD63-DF31-4B15-8A36-43BC482BF630 |
| 182 | ON | 364 | 27263 | F3C6376E-E6A2-4C1B-8D54-F72DE04B25AD |
| 183 | OFF | 365 | 27264 | 91A10CA2-68E4-4A83-972B-E98B18110B3E |
| 183 | ON | 366 | 27265 | AC664E94-54E3-4CAA-B98A-157DAFC8790E |
| 184 | OFF | 367 | 27267 | 343D0C4E-875F-4C79-8466-FCD8E1827C09 |
| 184 | ON | 368 | 27268 | 21804185-18AA-4798-B754-A9828EC44077 |
| 185 | OFF | 369 | 27269 | 7248F4B9-33E0-4E58-934E-622DFAFE4C51 |
| 185 | ON | 370 | 27270 | 2DB8E250-749A-4F6D-BC5B-0855E365222D |
| 186 | OFF | 371 | 27271 | 37AE5FA9-73F0-407E-A281-E5975B6E8975 |
| 186 | ON | 372 | 27272 | B1094BBD-7341-49AD-9A62-40324272C213 |
| 187 | OFF | 373 | 27273 | F29990C5-9FFC-4B2D-BE19-B230B2AD4FB1 |
| 187 | ON | 374 | 27274 | A120726D-A03C-4BC5-B9D6-531BA4A44E76 |
| 188 | OFF | 375 | 27276 | 0071EAB6-C976-4547-8810-B7605A257316 |
| 188 | ON | 376 | 27277 | 68E624BA-A234-43D4-BD70-A56215717598 |
| 189 | OFF | 377 | 27278 | 056E92F1-E400-4A47-A029-353341E4A867 |
| 189 | ON | 378 | 27279 | F4F05E71-606D-42C6-BB38-3B5064B2AB1B |
| 190 | OFF | 379 | 27280 | 74D035A0-C993-4E2E-9799-96C76EA02692 |
| 190 | ON | 380 | 27281 | 28021055-F89C-4DE8-8F80-FED9326E68C7 |
| 191 | OFF | 381 | 27282 | 6A1A06C8-512A-431D-976A-6B0BF6BD7161 |
| 191 | ON | 382 | 27283 | 22E927E0-CE15-4FD4-BE64-16191EEE3736 |
| 192 | OFF | 383 | 27284 | FCEFAEEC-44FD-4251-AEFB-CC11F0F89E3B |
| 192 | ON | 384 | 27286 | F161C8E2-0A1A-40F0-B942-38886487E62F |
| 193 | OFF | 385 | 27287 | 47DBA11D-3E05-49F8-B9A4-6B1CCC0A0DDC |
| 193 | ON | 386 | 27288 | 1EE0FA1F-F15C-41C7-A28A-0F2D69AE0ED9 |
| 194 | OFF | 387 | 27289 | 033E8B62-27B5-4BCF-B758-6B9442FE3FF4 |
| 194 | ON | 388 | 27290 | D0200D61-1CE7-4F5A-B99A-ADA55E014072 |
| 195 | OFF | 389 | 27291 | 516B1714-203D-4982-8BF9-2AA9C416D8B0 |
| 195 | ON | 390 | 27292 | 22C74AB0-BB1B-4BC1-8F07-531B419E336A |
| 196 | OFF | 391 | 27293 | AD1A2363-AD82-4C1C-B735-5652FFF188E6 |
| 196 | ON | 392 | 27295 | 876EE41C-17B1-46E0-9EA7-4B14016CB3E5 |
| 197 | OFF | 393 | 27296 | D40C3FEF-1195-4C06-8948-1CFCFE3EDC0B |
| 197 | ON | 394 | 27297 | EE832576-1C18-41CD-9DA8-6156FA361B5E |
| 198 | OFF | 395 | 27298 | 34BBF54B-8F71-4761-873D-A28D5B075542 |
| 198 | ON | 396 | 27299 | C2B3F38C-6C6B-4D83-821E-7E6F44354C53 |
| 199 | OFF | 397 | 27300 | 66B5AD1D-E667-4945-8CDC-A03467A61120 |
| 199 | ON | 398 | 27301 | 7520D28B-5800-487C-AEE6-62641F0ECD04 |
| 200 | OFF | 399 | 27302 | 0E8B01F5-C55A-4801-BA84-01AF0AF87C5B |
| 200 | ON | 400 | 27304 | 7A5E3BC9-4E13-491C-97A0-D8CD5F372675 |
| 201 | OFF | 401 | 27305 | 56700DB4-79F4-4F52-AE34-EA6191B77851 |
| 201 | ON | 402 | 27306 | 16D5D6C3-06A0-4FCD-9E00-10B5D3BF0212 |
| 202 | OFF | 403 | 27313 | BE279AB5-545A-48C4-A228-C8626C884860 |
| 202 | ON | 404 | 27314 | 6230B3FE-8AF6-4E23-B892-4CCC0FCE40BB |
| 203 | OFF | 405 | 27315 | 9A1791EF-AF19-4FAA-BCD3-F292EE783DCE |
| 203 | ON | 406 | 27316 | B93D0613-9149-485C-ADC3-C0AF892A97A4 |
| 204 | OFF | 407 | 27317 | E969D873-181F-485A-BA1A-811E9F47E883 |
| 204 | ON | 408 | 27318 | 332B4ED5-6228-410C-A765-349DDF116459 |
| 205 | OFF | 409 | 27320 | 013A39A8-9269-4087-B939-1628ED15E0AF |
| 205 | ON | 410 | 27321 | 41726C55-3E17-4285-AF86-22E278CBF730 |
| 206 | OFF | 411 | 27322 | 7E169CC2-C068-4D0F-853D-413059F60063 |
| 206 | ON | 412 | 27323 | 3ED1BEB0-A8F7-41AA-A07E-0E8059CC322B |
| 207 | OFF | 413 | 27324 | E52B9AE2-9CC4-4D00-8835-00CCD1AA4C04 |
| 207 | ON | 414 | 27325 | B7132E55-7394-459D-BDDA-7F078BE3C2B1 |
| 208 | OFF | 415 | 27326 | F83AD052-A905-4C17-8775-E4A1BD52A0B8 |
| 208 | ON | 416 | 27327 | 1B8428B1-2BBD-403D-9E6D-AAF425875308 |
| 209 | OFF | 417 | 27329 | F56E79BB-A79D-4AD1-95A4-AD9626908C20 |
| 209 | ON | 418 | 27330 | 0470D220-16A8-430B-A596-ED8250DF7B11 |
| 210 | OFF | 419 | 27331 | 86E79BE9-87EB-4C16-A262-13AEE476FD67 |
| 210 | ON | 420 | 27332 | 23B29924-E0BB-434D-B79F-4D042213C769 |
| 211 | OFF | 421 | 27333 | ED1DD523-5B5C-4170-BF08-9938B8DF672C |
| 211 | ON | 422 | 27334 | CE48026D-AD21-4E03-AF82-F525D13F8BDF |
| 212 | OFF | 423 | 27335 | AC253171-0C70-4F34-8383-38D233CF9CCF |
| 212 | ON | 424 | 27336 | D0B741CA-5837-4BD8-80F7-5B0AC3615B19 |
| 213 | OFF | 425 | 27338 | 9CF19646-47DD-4B68-BFF9-C1DEF87532DB |
| 213 | ON | 426 | 27339 | 5501DAED-D1CD-4BAE-B92B-8275BAB664B4 |
| 214 | OFF | 427 | 27340 | CA8C373E-2257-4D15-A3A7-E0190A44666D |
| 214 | ON | 428 | 27341 | 982FA75E-D1AD-482E-A503-99A875AF70CE |
| 215 | OFF | 429 | 27342 | B85BA802-FC51-4C4E-9E1F-549DCBD0B2EE |
| 215 | ON | 430 | 27343 | BBB0D982-29F8-452D-B9FA-A160F6FFD912 |
| 216 | OFF | 431 | 27344 | 1B6A7980-159D-47DF-AD35-E3F65D4EE91F |
| 216 | ON | 432 | 27345 | C84E249E-46A8-41F3-A0FB-473356E333F0 |
| 217 | OFF | 433 | 27347 | CB613516-A9EF-40E2-9CA6-BEFE088D7286 |
| 217 | ON | 434 | 27348 | 94962D2D-78A1-4A10-8E71-C7B1B2DF3B10 |
| 218 | OFF | 435 | 27349 | B8562AF2-9421-436E-9222-CCA892F9CED5 |
| 218 | ON | 436 | 27350 | 2FAD989C-FA5E-4107-A758-1DB46F640BC4 |
| 219 | OFF | 437 | 27351 | AB8F4982-4310-44EC-BABE-BCF8177F9BB3 |
| 219 | ON | 438 | 27352 | B2E37F7C-228C-414D-B153-3352707DC623 |
| 220 | OFF | 439 | 27353 | 0FD645E2-5D50-4931-A37D-D764DA576483 |
| 220 | ON | 440 | 27354 | EB0F1B50-F2F2-419A-BCC6-8056FC78FB96 |
| 221 | OFF | 441 | 27356 | 442A377B-2592-49A1-82A1-C0D1D2B9AF50 |
| 221 | ON | 442 | 27357 | F190DCF2-BB46-486D-81CD-30707A635877 |
| 222 | OFF | 443 | 27358 | DF906AF5-2921-43CE-9689-37DF61C84376 |
| 222 | ON | 444 | 27359 | EF45C627-A618-46D2-8119-FDE4137244B7 |
| 223 | OFF | 445 | 27360 | D801DDC1-3499-4A00-AD3A-79E116BCE927 |
| 223 | ON | 446 | 27361 | D8AF4513-50C4-439D-9B10-97E220B55516 |
| 224 | OFF | 447 | 27362 | B82BF205-FB70-48B5-9248-F1BA6AC4B1E4 |
| 224 | ON | 448 | 27363 | C5FCA65A-8FD4-4848-AF90-A3515C8A67E6 |
| 225 | OFF | 449 | 27365 | 9C787366-C469-410B-BFD7-5D14F3BBA2BD |
| 225 | ON | 450 | 27366 | C01FDB20-F32F-4936-8F01-D12B09149194 |
| 226 | OFF | 451 | 27367 | F0E70FEF-D0AA-430C-9FAF-F70B685E6507 |
| 226 | ON | 452 | 27368 | B385023C-ABB4-44CB-869D-EEF2B1BAC742 |
| 227 | OFF | 453 | 27369 | 4D7C1A5D-6B94-44CF-971C-929D65FB9433 |
| 227 | ON | 454 | 27370 | 0A9EBF72-F9E8-42E7-9F5B-C9AAE28E9892 |
| 228 | OFF | 455 | 27371 | F196BABD-005C-48D7-AE0F-209920A21259 |
| 228 | ON | 456 | 27372 | 47CBEE79-48D8-432B-8BD9-04E91F9EB9A4 |
| 229 | OFF | 457 | 27374 | EB205B59-B248-467D-B567-17FE4511D24A |
| 229 | ON | 458 | 27375 | 60CB00C9-8042-47AB-9FA1-9FCCCACF70F1 |
| 230 | OFF | 459 | 27376 | 246DF902-8D20-4B93-9D60-FBF8276E8E24 |
| 230 | ON | 460 | 27377 | C9BF86B3-92DE-4292-8A1B-181DB20B7FCF |
| 231 | OFF | 461 | 27378 | EE4BE9F1-4B5A-4CA7-97C5-70513EDDB1D8 |
| 231 | ON | 462 | 27379 | 183D075A-E75C-4EA0-B58F-9589A40304B4 |
| 232 | OFF | 463 | 27380 | 18E4A7CF-CD6C-4B96-B424-C110FA8B08E5 |
| 232 | ON | 464 | 27381 | 4F13C4CA-0FFF-4290-93E9-34D12678858A |
| 233 | OFF | 465 | 27383 | F1F7677A-ED7E-41CD-88F7-DB1E9FCA734F |
| 233 | ON | 466 | 27384 | 7EE47F7F-832A-4148-B961-32A686E2C4EB |
| 234 | OFF | 467 | 27385 | 98420FAD-3748-418B-8C07-A9182E4C4F3C |
| 234 | ON | 468 | 27386 | B03113D8-933B-4D19-A86D-15E4368680B3 |
| 235 | OFF | 469 | 27387 | 132CABB8-BBD0-4C62-8CBB-A1964E8D2BF8 |
| 235 | ON | 470 | 27388 | A776FA98-605F-40DE-BDD3-D92F9640F406 |
| 236 | OFF | 471 | 27389 | 774D0481-E7A5-4CB6-8FD9-385983DDD3A6 |
| 236 | ON | 472 | 27391 | ECD7ADD9-4B88-41A1-89E2-4112E5F8B104 |
| 237 | OFF | 473 | 27392 | 374D6F03-F436-4E46-B7CC-DF62D8D30C54 |
| 237 | ON | 474 | 27393 | F05FA8B5-8B61-4B63-B5B9-947B66088438 |
| 238 | OFF | 475 | 27394 | 8936346A-CD3A-47FA-BCE6-A95AEB96A177 |
| 238 | ON | 476 | 27395 | 9AB97E57-5A09-4AF4-8247-D1236E961EE3 |
| 239 | OFF | 477 | 27396 | EFFCAD5D-762B-427A-BA73-0CB4F6F10579 |
| 239 | ON | 478 | 27397 | A999D127-37FC-48A5-A545-3C52FCD5C8FB |
| 240 | OFF | 479 | 27399 | D4E05E3B-1256-4753-B372-F13E73A8BE2E |
| 240 | ON | 480 | 27400 | BB137A59-B219-4FB7-9196-2DE3A239C71D |
| 241 | OFF | 481 | 27401 | B187BB4F-D45A-46DC-9DB8-E7EB44F0C5C1 |
| 241 | ON | 482 | 27402 | 813BE15A-1EAE-42FB-B346-2555C3B41AFF |
| 242 | OFF | 483 | 27403 | C9646180-9686-4378-9703-B51C21172A14 |
| 242 | ON | 484 | 27404 | 9ED5FA8B-B094-4ED8-94D6-1CF953DBF27B |
| 243 | OFF | 485 | 27405 | 56B38DDE-1831-4426-95CC-5DC04A36B300 |
| 243 | ON | 486 | 27406 | EE56A13C-6F9B-4254-AE78-7C662D0A5560 |
| 244 | OFF | 487 | 27407 | F4DFC97C-C6F6-4C1F-9648-0771089E633B |
| 244 | ON | 488 | 27409 | 8A2F1521-4E40-4C01-882B-EB9C37FA173E |
| 245 | OFF | 489 | 27410 | A415ABA0-E455-40FC-8855-DB9B8BA5D501 |
| 245 | ON | 490 | 27411 | F19C63F7-FC50-4413-AEBD-C970A3B8A349 |
| 246 | OFF | 491 | 27412 | 7AEF5006-8213-4BF3-9457-0D4A37F87086 |
| 246 | ON | 492 | 27413 | 4071942E-B433-498F-9610-6EB18ED967A5 |
| 247 | OFF | 493 | 27414 | 87D8C952-5487-43DE-BAE6-C2CF65312152 |
| 247 | ON | 494 | 27415 | 021C8349-615A-4007-A2F9-3F1522768112 |
| 248 | OFF | 495 | 27416 | C316E99F-9FC5-44CD-97BA-9DB5876D3FB5 |
| 248 | ON | 496 | 27418 | BA8CEFAD-643F-458E-B77C-658108E6C09E |
| 249 | OFF | 497 | 27419 | C4324A00-AF2C-4348-9E06-6BB9F223B0A8 |
| 249 | ON | 498 | 27420 | D701F878-1730-4B32-AD80-C5E5995B4F85 |
| 250 | OFF | 499 | 27421 | 7BD70832-A2F6-4F66-8C3A-41636FC77960 |
| 250 | ON | 500 | 27520 | 2199DC16-2D32-4032-A7F3-36DB85268AA5 |
