# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 191.000 | 108.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 54.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 61.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 103.000 | 75.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 59.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 400 | handshake | h2 | false | 46.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 93.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 77.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 400 | handshake | h2 | false | 56.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 400 | handshake | h2 | false | 56.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 64.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 400 | handshake | h2 | false | 56.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 41.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 82.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 59.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 171.000 | 100.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 95.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 400 | handshake | h2 | false | 78.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 155.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 47.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 38.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 212.000 | 154.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 400 | handshake | h2 | false | 33.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 83.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 46.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 54.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 72.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 63.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 400 | handshake | h2 | false | 483.000 | 438.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 74.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 87.000 | 62.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 400 | handshake | h2 | false | 59.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 50.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 54.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 64.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 400 | handshake | h2 | false | 53.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 103.000 | 90.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 400 | handshake | h2 | false | 150.000 | 125.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 98.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 106.000 | 77.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 64.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 400 | handshake | h2 | false | 51.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 97.000 | 80.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 56.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 99.000 | 90.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 400 | handshake | h2 | false | 47.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 88.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 63.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 400 | handshake | h2 | false | 53.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 62.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 400 | handshake | h2 | false | 53.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 100.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | unknown | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 80.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 33.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 61.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 111.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 400 | handshake | h2 | false | 51.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 60.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 400 | handshake | h2 | false | 81.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 61.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 400 | handshake | h2 | false | 52.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 78.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 400 | handshake | h2 | false | 77.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 52.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 118.000 | 88.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 132.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 400 | handshake | h2 | false | 56.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 70.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 58.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 49.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 122.000 | 64.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 400 | handshake | h2 | false | 133.000 | 112.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 40.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 53.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 400 | handshake | h2 | false | 49.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 46.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 400 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 63.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 55.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 86.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | unknown | handshake | h2 | false | 97.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 61.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 134.000 | 109.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 87.000 | 71.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 400 | handshake | h2 | false | 43.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 110.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 57.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 61.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 400 | handshake | h2 | false | 47.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 35.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 48.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 44.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 36.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 400 | handshake | h2 | false | 65.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 77.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 56.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 104.000 | 86.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 39.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 74.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 90.000 | 76.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 400 | handshake | h2 | false | 42.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 64.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 69.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 400 | handshake | h2 | false | 70.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 75.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 58.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 76.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 400 | handshake | h2 | false | 58.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 68.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 45.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 84.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 69.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 400 | handshake | h2 | false | 40.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 65.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 188.000 | 106.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 90.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 50.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 59.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 400 | handshake | h2 | false | 56.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 48.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 41.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 55.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 50.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 100.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 63.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 181.000 | 125.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | OFF | completed | — | handshake | h2 | false | 100.000 | 85.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | ON | completed | 400 | handshake | h2 | false | 69.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | OFF | completed | — | handshake | h2 | false | 258.000 | 199.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | OFF | completed | — | handshake | h2 | false | 48.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | ON | completed | 200 | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | ON | completed | 200 | handshake | h2 | false | 51.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | OFF | completed | — | handshake | h2 | false | 135.000 | 115.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | ON | completed | 200 | handshake | h2 | false | 84.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | OFF | completed | — | handshake | h2 | false | 108.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | ON | completed | 200 | handshake | h2 | false | 72.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | ON | completed | 200 | handshake | h2 | false | 85.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | ON | completed | 400 | handshake | h2 | false | 96.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | OFF | completed | — | handshake | h2 | false | 133.000 | 111.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | ON | completed | 200 | handshake | h2 | false | 53.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | OFF | completed | — | handshake | h2 | false | 111.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | ON | completed | 400 | handshake | h2 | false | 65.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | OFF | completed | — | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | ON | completed | 200 | handshake | h2 | false | 38.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | OFF | completed | — | handshake | h2 | false | 92.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | ON | completed | 400 | handshake | h2 | false | 72.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | OFF | completed | — | handshake | h2 | false | 59.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | ON | completed | 200 | handshake | h2 | false | 83.000 | 67.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | ON | completed | 400 | handshake | h2 | false | 78.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | OFF | completed | — | handshake | h2 | false | 151.000 | 131.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | OFF | completed | — | handshake | h2 | false | 52.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | ON | completed | 200 | handshake | h2 | false | 78.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | ON | completed | 200 | handshake | h2 | false | 51.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | OFF | completed | — | handshake | h2 | false | 52.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | ON | completed | 400 | handshake | h2 | false | 46.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | ON | completed | 400 | handshake | h2 | false | 78.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | OFF | completed | — | handshake | h2 | false | 57.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | ON | completed | 200 | handshake | h2 | false | 68.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | OFF | completed | — | handshake | h2 | false | 112.000 | 90.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | ON | completed | 400 | handshake | h2 | false | 70.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 127 | OFF | completed | — | handshake | h2 | false | 52.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 127 | ON | completed | 200 | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 128 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 128 | ON | completed | 400 | handshake | h2 | false | 235.000 | 205.000 | 2404:6800:400b:c019::451 |
| omnient | 129 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 129 | ON | completed | 200 | handshake | h2 | false | 39.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 130 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 130 | ON | completed | 200 | handshake | h2 | false | 57.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 131 | OFF | completed | — | handshake | h2 | false | 51.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 131 | ON | completed | 200 | handshake | h2 | false | 41.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 132 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 132 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 133 | OFF | completed | — | handshake | h2 | false | 59.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 133 | ON | completed | 200 | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 134 | OFF | completed | — | handshake | h2 | false | 43.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 134 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 135 | OFF | completed | — | handshake | h2 | false | 142.000 | 110.000 | 2404:6800:400b:c019::451 |
| omnient | 135 | ON | completed | 400 | handshake | h2 | false | 42.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 136 | OFF | completed | — | handshake | h2 | false | 72.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 136 | ON | completed | 200 | handshake | h2 | false | 57.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 137 | OFF | completed | — | handshake | h2 | false | 49.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 137 | ON | completed | 400 | handshake | h2 | false | 56.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 138 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 138 | ON | completed | 200 | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 139 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 139 | ON | completed | 400 | handshake | h2 | false | 59.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 140 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 140 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 141 | OFF | completed | — | handshake | h2 | false | 57.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 141 | ON | completed | 400 | handshake | h2 | false | 113.000 | 83.000 | 2404:6800:400b:c019::451 |
| omnient | 142 | OFF | completed | — | handshake | h2 | false | 370.000 | 315.000 | 2404:6800:400b:c019::451 |
| omnient | 142 | ON | completed | 200 | handshake | h2 | false | 96.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 143 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 143 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 144 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 144 | ON | completed | 200 | handshake | h2 | false | 65.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 145 | OFF | completed | — | handshake | h2 | false | 49.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 145 | ON | completed | 400 | handshake | h2 | false | 51.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 146 | OFF | completed | — | handshake | h2 | false | 89.000 | 65.000 | 2404:6800:400b:c019::451 |
| omnient | 146 | ON | completed | 200 | handshake | h2 | false | 54.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 147 | OFF | completed | — | handshake | h2 | false | 192.000 | 151.000 | 2404:6800:400b:c019::451 |
| omnient | 147 | ON | completed | 400 | handshake | h2 | false | 52.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 148 | OFF | completed | — | handshake | h2 | false | 64.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 148 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 149 | OFF | completed | — | handshake | h2 | false | 184.000 | 157.000 | 2404:6800:400b:c019::451 |
| omnient | 149 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 150 | OFF | completed | — | handshake | h2 | false | 36.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 150 | ON | completed | 200 | handshake | h2 | false | 37.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 151 | OFF | completed | — | handshake | h2 | false | 39.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 151 | ON | completed | 200 | handshake | h2 | false | 37.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 152 | OFF | completed | — | handshake | h2 | false | 43.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 152 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 153 | OFF | completed | — | handshake | h2 | false | 70.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 153 | ON | completed | 200 | handshake | h2 | false | 42.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 154 | OFF | completed | — | handshake | h2 | false | 40.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 154 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 155 | OFF | completed | — | handshake | h2 | false | 75.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 155 | ON | completed | 200 | handshake | h2 | false | 57.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 156 | OFF | completed | — | handshake | h2 | false | 61.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 156 | ON | completed | 200 | handshake | h2 | false | 64.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 157 | OFF | completed | — | handshake | h2 | false | 42.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 157 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 158 | OFF | completed | — | handshake | h2 | false | 90.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 158 | ON | completed | 400 | handshake | h2 | false | 146.000 | 130.000 | 2404:6800:400b:c019::451 |
| omnient | 159 | OFF | completed | — | handshake | h2 | false | 84.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 159 | ON | completed | 400 | handshake | h2 | false | 92.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 160 | OFF | completed | — | handshake | h2 | false | 61.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 160 | ON | completed | 200 | handshake | h2 | false | 48.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 161 | OFF | completed | — | handshake | h2 | false | 105.000 | 73.000 | 2404:6800:400b:c019::451 |
| omnient | 161 | ON | completed | 200 | handshake | h2 | false | 50.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 162 | OFF | completed | — | handshake | h2 | false | 67.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 162 | ON | completed | 400 | handshake | h2 | false | 75.000 | 63.000 | 2404:6800:400b:c019::451 |
| omnient | 163 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 163 | ON | completed | 200 | handshake | h2 | false | 75.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 164 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 164 | ON | completed | 400 | handshake | h2 | false | 55.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 165 | OFF | completed | — | handshake | h2 | false | 65.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 165 | ON | completed | 400 | handshake | h2 | false | 51.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 166 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 166 | ON | completed | 200 | handshake | h2 | false | 39.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 167 | OFF | completed | — | handshake | h2 | false | 101.000 | 77.000 | 2404:6800:400b:c019::451 |
| omnient | 167 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 168 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 168 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 169 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 169 | ON | completed | 400 | handshake | h2 | false | 54.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 170 | OFF | completed | — | handshake | h2 | false | 47.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 170 | ON | completed | 200 | handshake | h2 | false | 49.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 171 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 171 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 172 | OFF | completed | — | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 172 | ON | completed | 400 | handshake | h2 | false | 82.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 173 | OFF | completed | — | handshake | h2 | false | 190.000 | 171.000 | 2404:6800:400b:c019::451 |
| omnient | 173 | ON | completed | 400 | handshake | h2 | false | 66.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 174 | OFF | completed | — | handshake | h2 | false | 62.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 174 | ON | completed | 200 | handshake | h2 | false | 68.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 175 | OFF | completed | — | handshake | h2 | false | 55.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 175 | ON | completed | 200 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 176 | OFF | completed | — | handshake | h2 | false | 126.000 | 115.000 | 2404:6800:400b:c019::451 |
| omnient | 176 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 177 | OFF | completed | — | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 177 | ON | completed | 400 | handshake | h2 | false | 67.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 178 | OFF | completed | — | handshake | h2 | false | 40.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 178 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 179 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 179 | ON | completed | 200 | handshake | h2 | false | 75.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 180 | OFF | completed | — | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 180 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 181 | OFF | completed | — | handshake | h2 | false | 38.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 181 | ON | completed | 200 | handshake | h2 | false | 177.000 | 150.000 | 2404:6800:400b:c019::451 |
| omnient | 182 | OFF | completed | — | handshake | h2 | false | 35.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 182 | ON | completed | 200 | handshake | h2 | false | 35.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 183 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 183 | ON | completed | 200 | handshake | h2 | false | 49.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 184 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 184 | ON | completed | 200 | handshake | h2 | false | 68.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 185 | OFF | completed | — | handshake | h2 | false | 57.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 185 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 186 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 186 | ON | completed | 200 | handshake | h2 | false | 242.000 | 216.000 | 2404:6800:400b:c019::451 |
| omnient | 187 | OFF | completed | — | handshake | h2 | false | 86.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 187 | ON | completed | 200 | handshake | h2 | false | 45.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 188 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 188 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 189 | OFF | completed | — | handshake | h2 | false | 83.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 189 | ON | completed | 200 | handshake | h2 | false | 133.000 | 106.000 | 2404:6800:400b:c019::451 |
| omnient | 190 | OFF | completed | — | handshake | h2 | false | 60.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 190 | ON | completed | 400 | handshake | h2 | false | 74.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 191 | OFF | completed | — | handshake | h2 | false | 70.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 191 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 192 | OFF | completed | — | handshake | h2 | false | 62.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 192 | ON | completed | 200 | handshake | h2 | false | 46.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 193 | OFF | completed | — | handshake | h2 | false | 158.000 | 139.000 | 2404:6800:400b:c019::451 |
| omnient | 193 | ON | completed | 400 | handshake | h2 | false | 39.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 194 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 194 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 195 | OFF | completed | — | handshake | h2 | false | 72.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 195 | ON | completed | 200 | handshake | h2 | false | 35.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 196 | OFF | completed | — | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 196 | ON | completed | 200 | handshake | h2 | false | 97.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 197 | OFF | completed | — | handshake | h2 | false | 51.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 197 | ON | completed | 400 | handshake | h2 | false | 48.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 198 | OFF | completed | — | handshake | h2 | false | 67.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 198 | ON | completed | 400 | handshake | h2 | false | 80.000 | 65.000 | 2404:6800:400b:c019::451 |
| omnient | 199 | OFF | completed | — | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 199 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 200 | OFF | completed | — | handshake | h2 | false | 37.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 200 | ON | completed | 400 | handshake | h2 | false | 79.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 201 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 201 | ON | completed | 400 | handshake | h2 | false | 66.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 202 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 202 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 203 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 203 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 204 | OFF | completed | — | handshake | h2 | false | 60.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 204 | ON | completed | 200 | handshake | h2 | false | 36.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 205 | OFF | completed | — | handshake | h2 | false | 91.000 | 67.000 | 2404:6800:400b:c019::451 |
| omnient | 205 | ON | completed | 200 | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 206 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 206 | ON | completed | 400 | handshake | h2 | false | 83.000 | 67.000 | 2404:6800:400b:c019::451 |
| omnient | 207 | OFF | completed | — | handshake | h2 | false | 56.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 207 | ON | completed | 200 | handshake | h2 | false | 37.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 208 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 208 | ON | completed | 200 | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 209 | OFF | completed | — | handshake | h2 | false | 34.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 209 | ON | completed | 400 | handshake | h2 | false | 71.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 210 | OFF | completed | — | handshake | h2 | false | 47.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 210 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 211 | OFF | completed | — | handshake | h2 | false | 79.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 211 | ON | completed | 200 | handshake | h2 | false | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 212 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 212 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 213 | OFF | completed | — | handshake | h2 | false | 82.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 213 | ON | completed | 200 | handshake | h2 | false | 76.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 214 | OFF | completed | — | handshake | h2 | false | 76.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 214 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 215 | OFF | completed | — | handshake | h2 | false | 81.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 215 | ON | completed | 200 | handshake | h2 | false | 92.000 | 77.000 | 2404:6800:400b:c019::451 |
| omnient | 216 | OFF | completed | — | handshake | h2 | false | 61.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 216 | ON | completed | 200 | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 217 | OFF | completed | — | handshake | h2 | false | 114.000 | 99.000 | 2404:6800:400b:c019::451 |
| omnient | 217 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 218 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 218 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 219 | OFF | completed | — | handshake | h2 | false | 125.000 | 100.000 | 2404:6800:400b:c019::451 |
| omnient | 219 | ON | completed | 400 | handshake | h2 | false | 47.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 220 | OFF | completed | — | handshake | h2 | false | 71.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 220 | ON | completed | 400 | handshake | h2 | false | 106.000 | 78.000 | 2404:6800:400b:c019::451 |
| omnient | 221 | OFF | completed | — | handshake | h2 | false | 47.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 221 | ON | completed | 400 | handshake | h2 | false | 103.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 222 | OFF | completed | — | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 222 | ON | completed | 200 | handshake | h2 | false | 46.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 223 | OFF | completed | — | handshake | h2 | false | 79.000 | 65.000 | 2404:6800:400b:c019::451 |
| omnient | 223 | ON | completed | 200 | handshake | h2 | false | 63.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 224 | OFF | completed | — | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 224 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 225 | OFF | completed | — | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 225 | ON | completed | 200 | handshake | h2 | false | 97.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 226 | OFF | completed | — | handshake | h2 | false | 43.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 226 | ON | completed | 400 | handshake | h2 | false | 62.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 227 | OFF | completed | — | handshake | h2 | false | 52.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 227 | ON | completed | 400 | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 228 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 228 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 229 | OFF | completed | — | handshake | h2 | false | 56.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 229 | ON | completed | 200 | handshake | h2 | false | 52.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 230 | OFF | completed | — | handshake | h2 | false | 86.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 230 | ON | completed | 400 | handshake | h2 | false | 86.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 231 | OFF | completed | — | handshake | h2 | false | 61.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 231 | ON | completed | 200 | handshake | h2 | false | 92.000 | 79.000 | 2404:6800:400b:c019::451 |
| omnient | 232 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 232 | ON | completed | 200 | handshake | h2 | false | 35.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 233 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 233 | ON | completed | 200 | handshake | h2 | false | 39.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 234 | OFF | completed | — | handshake | h2 | false | 74.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 234 | ON | completed | 200 | handshake | h2 | false | 38.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 235 | OFF | completed | — | handshake | h2 | false | 93.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 235 | ON | completed | 200 | handshake | h2 | false | 80.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 236 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 236 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 237 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 237 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 238 | OFF | completed | — | handshake | h2 | false | 64.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 238 | ON | completed | 200 | handshake | h2 | false | 51.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 239 | OFF | completed | — | handshake | h2 | false | 35.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 239 | ON | completed | 400 | handshake | h2 | false | 53.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 240 | OFF | completed | — | handshake | h2 | false | 95.000 | 85.000 | 2404:6800:400b:c019::451 |
| omnient | 240 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 241 | OFF | completed | — | handshake | h2 | false | 122.000 | 79.000 | 2404:6800:400b:c019::451 |
| omnient | 241 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 242 | OFF | completed | — | handshake | h2 | false | 50.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 242 | ON | completed | 400 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 243 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 243 | ON | completed | 400 | handshake | h2 | false | 134.000 | 124.000 | 2404:6800:400b:c019::451 |
| omnient | 244 | OFF | completed | — | handshake | h2 | false | 32.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 244 | ON | completed | 200 | handshake | h2 | false | 60.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 245 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 245 | ON | completed | 200 | handshake | h2 | false | 37.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 246 | OFF | completed | — | handshake | h2 | false | 70.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 246 | ON | completed | 200 | handshake | h2 | false | 46.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 247 | OFF | completed | — | handshake | h2 | false | 51.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 247 | ON | completed | 200 | handshake | h2 | false | 76.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 248 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 248 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 249 | OFF | completed | — | handshake | h2 | false | 35.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 249 | ON | completed | 400 | handshake | h2 | false | 77.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 250 | OFF | completed | — | handshake | h2 | false | 35.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 250 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 51.812 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 53.035 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 53.030 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 52.965 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 50.495 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 52.334 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 52.913 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 52.862 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 52.217 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 50.791 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 52.102 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 52.211 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 52.062 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 51.812 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 51.596 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 50.996 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 52.141 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 52.092 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 52.904 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 51.718 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 52.862 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 50.796 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 52.900 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 52.863 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 53.071 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 53.056 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 52.908 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 52.530 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 53.053 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 52.846 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 52.192 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 53.052 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 51.603 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 52.871 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 52.854 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 53.039 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 51.597 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 52.846 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 50.958 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 52.392 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 51.236 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 53.034 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 52.880 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 52.867 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 53.044 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 50.886 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 52.858 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 53.057 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 52.091 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 52.666 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 52.461 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 52.861 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 52.764 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 50.764 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 52.557 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 53.038 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 53.045 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 52.889 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 52.084 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 52.768 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 52.900 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 53.034 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 50.783 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 53.029 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 52.399 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 51.144 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 52.292 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 53.033 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 52.498 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 52.795 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 52.872 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 53.030 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 53.033 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 52.132 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 52.850 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 52.841 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 53.033 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 50.669 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 52.760 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 52.790 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 50.656 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 53.035 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 52.512 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 52.879 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 52.420 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 51.774 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 52.186 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 52.152 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 52.136 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 50.806 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 51.002 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 50.484 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 52.857 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 52.159 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 52.867 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 52.855 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 52.885 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 52.211 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 53.008 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 50.681 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 51.480 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 52.913 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 52.628 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 52.819 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 51.463 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 51.904 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 52.910 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 52.926 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 52.845 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 52.122 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 53.043 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 52.801 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 51.617 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 50.990 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 51.961 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 52.877 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 52.909 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 52.812 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 52.423 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 51.602 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 52.865 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 52.855 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 51.658 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 52.136 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 52.064 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 52.910 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 52.864 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 51.554 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 52.184 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 51.209 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 51.336 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 53.035 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 52.256 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 52.914 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 51.380 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 52.748 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 52.942 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 53.042 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 51.426 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 50.923 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 50.623 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 50.567 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 52.854 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 52.933 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 50.688 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 51.897 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 51.854 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 50.511 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 52.849 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 50.852 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 52.033 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 51.946 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 52.975 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 52.917 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 52.644 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 50.609 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 53.024 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 51.725 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 52.871 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 52.886 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 50.737 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 51.850 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 53.037 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 52.292 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 52.900 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 53.048 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 52.475 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 53.068 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 52.910 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 52.735 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 52.922 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 52.887 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 52.867 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 53.044 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 51.584 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 52.651 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 51.176 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 51.635 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 51.904 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 52.039 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 53.019 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 51.750 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 52.306 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 52.976 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 52.757 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 52.919 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 52.890 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 53.048 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 52.422 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 50.719 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 51.077 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 50.543 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 52.769 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 52.921 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 52.247 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 51.946 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 52.874 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 52.844 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 52.072 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 52.956 | count=0 | early POST | early POST |
| omnient | 101 | OFF | 52.701 | count=0 | post-open POST | post-open POST |
| omnient | 101 | ON | 51.412 | count=0 | early POST | early POST |
| omnient | 102 | OFF | 53.049 | count=0 | post-open POST | post-open POST |
| omnient | 102 | ON | 52.624 | count=0 | early POST | early POST |
| omnient | 103 | OFF | 52.973 | count=0 | post-open POST | post-open POST |
| omnient | 103 | ON | 50.532 | count=0 | early POST | early POST |
| omnient | 104 | OFF | 52.531 | count=0 | post-open POST | post-open POST |
| omnient | 104 | ON | 52.600 | count=0 | early POST | early POST |
| omnient | 105 | OFF | 51.595 | count=0 | post-open POST | post-open POST |
| omnient | 105 | ON | 51.770 | count=0 | early POST | early POST |
| omnient | 106 | OFF | 52.270 | count=0 | post-open POST | post-open POST |
| omnient | 106 | ON | 53.046 | count=0 | early POST | early POST |
| omnient | 107 | OFF | 52.170 | count=0 | post-open POST | post-open POST |
| omnient | 107 | ON | 53.029 | count=0 | early POST | early POST |
| omnient | 108 | OFF | 53.055 | count=0 | post-open POST | post-open POST |
| omnient | 108 | ON | 52.865 | count=0 | early POST | early POST |
| omnient | 109 | OFF | 52.841 | count=0 | post-open POST | post-open POST |
| omnient | 109 | ON | 53.034 | count=0 | early POST | early POST |
| omnient | 110 | OFF | 52.930 | count=0 | post-open POST | post-open POST |
| omnient | 110 | ON | 52.912 | count=0 | early POST | early POST |
| omnient | 111 | OFF | 51.974 | count=0 | post-open POST | post-open POST |
| omnient | 111 | ON | 50.790 | count=0 | early POST | early POST |
| omnient | 112 | OFF | 52.444 | count=0 | post-open POST | post-open POST |
| omnient | 112 | ON | 52.370 | count=0 | early POST | early POST |
| omnient | 113 | OFF | 52.878 | count=0 | post-open POST | post-open POST |
| omnient | 113 | ON | 52.300 | count=0 | early POST | early POST |
| omnient | 114 | OFF | 52.405 | count=0 | post-open POST | post-open POST |
| omnient | 114 | ON | 53.042 | count=0 | early POST | early POST |
| omnient | 115 | OFF | 51.505 | count=0 | post-open POST | post-open POST |
| omnient | 115 | ON | 52.919 | count=0 | early POST | early POST |
| omnient | 116 | OFF | 51.648 | count=0 | post-open POST | post-open POST |
| omnient | 116 | ON | 50.702 | count=0 | early POST | early POST |
| omnient | 117 | OFF | 51.717 | count=0 | post-open POST | post-open POST |
| omnient | 117 | ON | 52.917 | count=0 | early POST | early POST |
| omnient | 118 | OFF | 52.885 | count=0 | post-open POST | post-open POST |
| omnient | 118 | ON | 51.860 | count=0 | early POST | early POST |
| omnient | 119 | OFF | 52.129 | count=0 | post-open POST | post-open POST |
| omnient | 119 | ON | 52.424 | count=0 | early POST | early POST |
| omnient | 120 | OFF | 50.972 | count=0 | post-open POST | post-open POST |
| omnient | 120 | ON | 51.385 | count=0 | early POST | early POST |
| omnient | 121 | OFF | 52.136 | count=0 | post-open POST | post-open POST |
| omnient | 121 | ON | 52.870 | count=0 | early POST | early POST |
| omnient | 122 | OFF | 51.928 | count=0 | post-open POST | post-open POST |
| omnient | 122 | ON | 52.921 | count=0 | early POST | early POST |
| omnient | 123 | OFF | 53.033 | count=0 | post-open POST | post-open POST |
| omnient | 123 | ON | 52.914 | count=0 | early POST | early POST |
| omnient | 124 | OFF | 51.174 | count=0 | post-open POST | post-open POST |
| omnient | 124 | ON | 52.750 | count=0 | early POST | early POST |
| omnient | 125 | OFF | 52.770 | count=0 | post-open POST | post-open POST |
| omnient | 125 | ON | 52.926 | count=0 | early POST | early POST |
| omnient | 126 | OFF | 52.902 | count=0 | post-open POST | post-open POST |
| omnient | 126 | ON | 52.497 | count=0 | early POST | early POST |
| omnient | 127 | OFF | 52.647 | count=0 | post-open POST | post-open POST |
| omnient | 127 | ON | 52.254 | count=0 | early POST | early POST |
| omnient | 128 | OFF | 52.840 | count=0 | post-open POST | post-open POST |
| omnient | 128 | ON | 51.559 | count=0 | early POST | early POST |
| omnient | 129 | OFF | 51.269 | count=0 | post-open POST | post-open POST |
| omnient | 129 | ON | 52.854 | count=0 | early POST | early POST |
| omnient | 130 | OFF | 51.351 | count=0 | post-open POST | post-open POST |
| omnient | 130 | ON | 51.801 | count=0 | early POST | early POST |
| omnient | 131 | OFF | 53.045 | count=0 | post-open POST | post-open POST |
| omnient | 131 | ON | 53.052 | count=0 | early POST | early POST |
| omnient | 132 | OFF | 53.043 | count=0 | post-open POST | post-open POST |
| omnient | 132 | ON | 52.904 | count=0 | early POST | early POST |
| omnient | 133 | OFF | 51.581 | count=0 | post-open POST | post-open POST |
| omnient | 133 | ON | 52.871 | count=0 | early POST | early POST |
| omnient | 134 | OFF | 50.737 | count=0 | post-open POST | post-open POST |
| omnient | 134 | ON | 50.515 | count=0 | early POST | early POST |
| omnient | 135 | OFF | 53.036 | count=0 | post-open POST | post-open POST |
| omnient | 135 | ON | 52.042 | count=0 | early POST | early POST |
| omnient | 136 | OFF | 52.865 | count=0 | post-open POST | post-open POST |
| omnient | 136 | ON | 52.832 | count=0 | early POST | early POST |
| omnient | 137 | OFF | 50.464 | count=0 | post-open POST | post-open POST |
| omnient | 137 | ON | 50.662 | count=0 | early POST | early POST |
| omnient | 138 | OFF | 51.599 | count=0 | post-open POST | post-open POST |
| omnient | 138 | ON | 52.851 | count=0 | early POST | early POST |
| omnient | 139 | OFF | 51.261 | count=0 | post-open POST | post-open POST |
| omnient | 139 | ON | 52.487 | count=0 | early POST | early POST |
| omnient | 140 | OFF | 52.880 | count=0 | post-open POST | post-open POST |
| omnient | 140 | ON | 51.838 | count=0 | early POST | early POST |
| omnient | 141 | OFF | 51.156 | count=0 | post-open POST | post-open POST |
| omnient | 141 | ON | 53.019 | count=0 | early POST | early POST |
| omnient | 142 | OFF | 52.444 | count=0 | post-open POST | post-open POST |
| omnient | 142 | ON | 53.051 | count=0 | early POST | early POST |
| omnient | 143 | OFF | 52.943 | count=0 | post-open POST | post-open POST |
| omnient | 143 | ON | 50.541 | count=0 | early POST | early POST |
| omnient | 144 | OFF | 53.035 | count=0 | post-open POST | post-open POST |
| omnient | 144 | ON | 51.282 | count=0 | early POST | early POST |
| omnient | 145 | OFF | 50.767 | count=0 | post-open POST | post-open POST |
| omnient | 145 | ON | 52.580 | count=0 | early POST | early POST |
| omnient | 146 | OFF | 51.153 | count=0 | post-open POST | post-open POST |
| omnient | 146 | ON | 53.031 | count=0 | early POST | early POST |
| omnient | 147 | OFF | 52.888 | count=0 | post-open POST | post-open POST |
| omnient | 147 | ON | 52.917 | count=0 | early POST | early POST |
| omnient | 148 | OFF | 52.407 | count=0 | post-open POST | post-open POST |
| omnient | 148 | ON | 52.883 | count=0 | early POST | early POST |
| omnient | 149 | OFF | 53.050 | count=0 | post-open POST | post-open POST |
| omnient | 149 | ON | 52.365 | count=0 | early POST | early POST |
| omnient | 150 | OFF | 52.856 | count=0 | post-open POST | post-open POST |
| omnient | 150 | ON | 53.038 | count=0 | early POST | early POST |
| omnient | 151 | OFF | 52.190 | count=0 | post-open POST | post-open POST |
| omnient | 151 | ON | 52.986 | count=0 | early POST | early POST |
| omnient | 152 | OFF | 50.471 | count=0 | post-open POST | post-open POST |
| omnient | 152 | ON | 52.919 | count=0 | early POST | early POST |
| omnient | 153 | OFF | 51.526 | count=0 | post-open POST | post-open POST |
| omnient | 153 | ON | 51.079 | count=0 | early POST | early POST |
| omnient | 154 | OFF | 51.005 | count=0 | post-open POST | post-open POST |
| omnient | 154 | ON | 51.948 | count=0 | early POST | early POST |
| omnient | 155 | OFF | 53.047 | count=0 | post-open POST | post-open POST |
| omnient | 155 | ON | 52.862 | count=0 | early POST | early POST |
| omnient | 156 | OFF | 52.911 | count=0 | post-open POST | post-open POST |
| omnient | 156 | ON | 52.521 | count=0 | early POST | early POST |
| omnient | 157 | OFF | 50.852 | count=0 | post-open POST | post-open POST |
| omnient | 157 | ON | 51.377 | count=0 | early POST | early POST |
| omnient | 158 | OFF | 52.508 | count=0 | post-open POST | post-open POST |
| omnient | 158 | ON | 52.935 | count=0 | early POST | early POST |
| omnient | 159 | OFF | 51.919 | count=0 | post-open POST | post-open POST |
| omnient | 159 | ON | 52.824 | count=0 | early POST | early POST |
| omnient | 160 | OFF | 53.037 | count=0 | post-open POST | post-open POST |
| omnient | 160 | ON | 51.060 | count=0 | early POST | early POST |
| omnient | 161 | OFF | 53.036 | count=0 | post-open POST | post-open POST |
| omnient | 161 | ON | 51.177 | count=0 | early POST | early POST |
| omnient | 162 | OFF | 51.046 | count=0 | post-open POST | post-open POST |
| omnient | 162 | ON | 52.491 | count=0 | early POST | early POST |
| omnient | 163 | OFF | 52.319 | count=0 | post-open POST | post-open POST |
| omnient | 163 | ON | 52.861 | count=0 | early POST | early POST |
| omnient | 164 | OFF | 51.352 | count=0 | post-open POST | post-open POST |
| omnient | 164 | ON | 52.855 | count=0 | early POST | early POST |
| omnient | 165 | OFF | 52.780 | count=0 | post-open POST | post-open POST |
| omnient | 165 | ON | 52.330 | count=0 | early POST | early POST |
| omnient | 166 | OFF | 50.904 | count=0 | post-open POST | post-open POST |
| omnient | 166 | ON | 52.851 | count=0 | early POST | early POST |
| omnient | 167 | OFF | 53.021 | count=0 | post-open POST | post-open POST |
| omnient | 167 | ON | 50.601 | count=0 | early POST | early POST |
| omnient | 168 | OFF | 53.038 | count=0 | post-open POST | post-open POST |
| omnient | 168 | ON | 52.851 | count=0 | early POST | early POST |
| omnient | 169 | OFF | 51.013 | count=0 | post-open POST | post-open POST |
| omnient | 169 | ON | 52.863 | count=0 | early POST | early POST |
| omnient | 170 | OFF | 52.463 | count=0 | post-open POST | post-open POST |
| omnient | 170 | ON | 52.009 | count=0 | early POST | early POST |
| omnient | 171 | OFF | 53.042 | count=0 | post-open POST | post-open POST |
| omnient | 171 | ON | 52.837 | count=0 | early POST | early POST |
| omnient | 172 | OFF | 50.496 | count=0 | post-open POST | post-open POST |
| omnient | 172 | ON | 52.847 | count=0 | early POST | early POST |
| omnient | 173 | OFF | 51.923 | count=0 | post-open POST | post-open POST |
| omnient | 173 | ON | 50.754 | count=0 | early POST | early POST |
| omnient | 174 | OFF | 51.978 | count=0 | post-open POST | post-open POST |
| omnient | 174 | ON | 52.904 | count=0 | early POST | early POST |
| omnient | 175 | OFF | 53.055 | count=0 | post-open POST | post-open POST |
| omnient | 175 | ON | 52.940 | count=0 | early POST | early POST |
| omnient | 176 | OFF | 52.569 | count=0 | post-open POST | post-open POST |
| omnient | 176 | ON | 52.295 | count=0 | early POST | early POST |
| omnient | 177 | OFF | 51.372 | count=0 | post-open POST | post-open POST |
| omnient | 177 | ON | 51.568 | count=0 | early POST | early POST |
| omnient | 178 | OFF | 52.874 | count=0 | post-open POST | post-open POST |
| omnient | 178 | ON | 52.849 | count=0 | early POST | early POST |
| omnient | 179 | OFF | 50.865 | count=0 | post-open POST | post-open POST |
| omnient | 179 | ON | 50.912 | count=0 | early POST | early POST |
| omnient | 180 | OFF | 50.722 | count=0 | post-open POST | post-open POST |
| omnient | 180 | ON | 51.631 | count=0 | early POST | early POST |
| omnient | 181 | OFF | 51.349 | count=0 | post-open POST | post-open POST |
| omnient | 181 | ON | 51.631 | count=0 | early POST | early POST |
| omnient | 182 | OFF | 51.413 | count=0 | post-open POST | post-open POST |
| omnient | 182 | ON | 52.955 | count=0 | early POST | early POST |
| omnient | 183 | OFF | 50.613 | count=0 | post-open POST | post-open POST |
| omnient | 183 | ON | 50.829 | count=0 | early POST | early POST |
| omnient | 184 | OFF | 53.056 | count=0 | post-open POST | post-open POST |
| omnient | 184 | ON | 52.856 | count=0 | early POST | early POST |
| omnient | 185 | OFF | 52.382 | count=0 | post-open POST | post-open POST |
| omnient | 185 | ON | 50.696 | count=0 | early POST | early POST |
| omnient | 186 | OFF | 50.780 | count=0 | post-open POST | post-open POST |
| omnient | 186 | ON | 51.425 | count=0 | early POST | early POST |
| omnient | 187 | OFF | 50.732 | count=0 | post-open POST | post-open POST |
| omnient | 187 | ON | 51.557 | count=0 | early POST | early POST |
| omnient | 188 | OFF | 50.987 | count=0 | post-open POST | post-open POST |
| omnient | 188 | ON | 50.858 | count=0 | early POST | early POST |
| omnient | 189 | OFF | 52.766 | count=0 | post-open POST | post-open POST |
| omnient | 189 | ON | 52.877 | count=0 | early POST | early POST |
| omnient | 190 | OFF | 51.685 | count=0 | post-open POST | post-open POST |
| omnient | 190 | ON | 52.212 | count=0 | early POST | early POST |
| omnient | 191 | OFF | 52.468 | count=0 | post-open POST | post-open POST |
| omnient | 191 | ON | 52.849 | count=0 | early POST | early POST |
| omnient | 192 | OFF | 52.282 | count=0 | post-open POST | post-open POST |
| omnient | 192 | ON | 51.037 | count=0 | early POST | early POST |
| omnient | 193 | OFF | 53.049 | count=0 | post-open POST | post-open POST |
| omnient | 193 | ON | 52.848 | count=0 | early POST | early POST |
| omnient | 194 | OFF | 51.621 | count=0 | post-open POST | post-open POST |
| omnient | 194 | ON | 52.906 | count=0 | early POST | early POST |
| omnient | 195 | OFF | 52.923 | count=0 | post-open POST | post-open POST |
| omnient | 195 | ON | 52.993 | count=0 | early POST | early POST |
| omnient | 196 | OFF | 53.012 | count=0 | post-open POST | post-open POST |
| omnient | 196 | ON | 53.043 | count=0 | early POST | early POST |
| omnient | 197 | OFF | 52.104 | count=0 | post-open POST | post-open POST |
| omnient | 197 | ON | 51.045 | count=0 | early POST | early POST |
| omnient | 198 | OFF | 51.664 | count=0 | post-open POST | post-open POST |
| omnient | 198 | ON | 53.042 | count=0 | early POST | early POST |
| omnient | 199 | OFF | 52.748 | count=0 | post-open POST | post-open POST |
| omnient | 199 | ON | 51.823 | count=0 | early POST | early POST |
| omnient | 200 | OFF | 51.910 | count=0 | post-open POST | post-open POST |
| omnient | 200 | ON | 51.658 | count=0 | early POST | early POST |
| omnient | 201 | OFF | 52.182 | count=0 | post-open POST | post-open POST |
| omnient | 201 | ON | 53.037 | count=0 | early POST | early POST |
| omnient | 202 | OFF | 52.621 | count=0 | post-open POST | post-open POST |
| omnient | 202 | ON | 51.152 | count=0 | early POST | early POST |
| omnient | 203 | OFF | 52.164 | count=0 | post-open POST | post-open POST |
| omnient | 203 | ON | 53.054 | count=0 | early POST | early POST |
| omnient | 204 | OFF | 53.049 | count=0 | post-open POST | post-open POST |
| omnient | 204 | ON | 50.642 | count=0 | early POST | early POST |
| omnient | 205 | OFF | 53.088 | count=0 | post-open POST | post-open POST |
| omnient | 205 | ON | 50.885 | count=0 | early POST | early POST |
| omnient | 206 | OFF | 50.574 | count=0 | post-open POST | post-open POST |
| omnient | 206 | ON | 52.650 | count=0 | early POST | early POST |
| omnient | 207 | OFF | 50.642 | count=0 | post-open POST | post-open POST |
| omnient | 207 | ON | 52.853 | count=0 | early POST | early POST |
| omnient | 208 | OFF | 51.452 | count=0 | post-open POST | post-open POST |
| omnient | 208 | ON | 52.364 | count=0 | early POST | early POST |
| omnient | 209 | OFF | 52.420 | count=0 | post-open POST | post-open POST |
| omnient | 209 | ON | 52.817 | count=0 | early POST | early POST |
| omnient | 210 | OFF | 52.816 | count=0 | post-open POST | post-open POST |
| omnient | 210 | ON | 53.036 | count=0 | early POST | early POST |
| omnient | 211 | OFF | 52.718 | count=0 | post-open POST | post-open POST |
| omnient | 211 | ON | 52.607 | count=0 | early POST | early POST |
| omnient | 212 | OFF | 52.854 | count=0 | post-open POST | post-open POST |
| omnient | 212 | ON | 52.919 | count=0 | early POST | early POST |
| omnient | 213 | OFF | 52.881 | count=0 | post-open POST | post-open POST |
| omnient | 213 | ON | 51.413 | count=0 | early POST | early POST |
| omnient | 214 | OFF | 52.863 | count=0 | post-open POST | post-open POST |
| omnient | 214 | ON | 51.332 | count=0 | early POST | early POST |
| omnient | 215 | OFF | 52.917 | count=0 | post-open POST | post-open POST |
| omnient | 215 | ON | 52.456 | count=0 | early POST | early POST |
| omnient | 216 | OFF | 52.907 | count=0 | post-open POST | post-open POST |
| omnient | 216 | ON | 51.668 | count=0 | early POST | early POST |
| omnient | 217 | OFF | 51.703 | count=0 | post-open POST | post-open POST |
| omnient | 217 | ON | 51.866 | count=0 | early POST | early POST |
| omnient | 218 | OFF | 52.881 | count=0 | post-open POST | post-open POST |
| omnient | 218 | ON | 51.233 | count=0 | early POST | early POST |
| omnient | 219 | OFF | 52.975 | count=0 | post-open POST | post-open POST |
| omnient | 219 | ON | 52.787 | count=0 | early POST | early POST |
| omnient | 220 | OFF | 53.039 | count=0 | post-open POST | post-open POST |
| omnient | 220 | ON | 52.369 | count=0 | early POST | early POST |
| omnient | 221 | OFF | 52.022 | count=0 | post-open POST | post-open POST |
| omnient | 221 | ON | 52.374 | count=0 | early POST | early POST |
| omnient | 222 | OFF | 51.529 | count=0 | post-open POST | post-open POST |
| omnient | 222 | ON | 51.117 | count=0 | early POST | early POST |
| omnient | 223 | OFF | 53.111 | count=0 | post-open POST | post-open POST |
| omnient | 223 | ON | 52.294 | count=0 | early POST | early POST |
| omnient | 224 | OFF | 52.879 | count=0 | post-open POST | post-open POST |
| omnient | 224 | ON | 51.968 | count=0 | early POST | early POST |
| omnient | 225 | OFF | 53.036 | count=0 | post-open POST | post-open POST |
| omnient | 225 | ON | 52.954 | count=0 | early POST | early POST |
| omnient | 226 | OFF | 50.681 | count=0 | post-open POST | post-open POST |
| omnient | 226 | ON | 52.865 | count=0 | early POST | early POST |
| omnient | 227 | OFF | 51.147 | count=0 | post-open POST | post-open POST |
| omnient | 227 | ON | 50.851 | count=0 | early POST | early POST |
| omnient | 228 | OFF | 53.031 | count=0 | post-open POST | post-open POST |
| omnient | 228 | ON | 52.442 | count=0 | early POST | early POST |
| omnient | 229 | OFF | 53.037 | count=0 | post-open POST | post-open POST |
| omnient | 229 | ON | 52.874 | count=0 | early POST | early POST |
| omnient | 230 | OFF | 52.895 | count=0 | post-open POST | post-open POST |
| omnient | 230 | ON | 52.284 | count=0 | early POST | early POST |
| omnient | 231 | OFF | 53.030 | count=0 | post-open POST | post-open POST |
| omnient | 231 | ON | 51.353 | count=0 | early POST | early POST |
| omnient | 232 | OFF | 53.036 | count=0 | post-open POST | post-open POST |
| omnient | 232 | ON | 52.917 | count=0 | early POST | early POST |
| omnient | 233 | OFF | 52.922 | count=0 | post-open POST | post-open POST |
| omnient | 233 | ON | 52.939 | count=0 | early POST | early POST |
| omnient | 234 | OFF | 52.867 | count=0 | post-open POST | post-open POST |
| omnient | 234 | ON | 53.047 | count=0 | early POST | early POST |
| omnient | 235 | OFF | 52.857 | count=0 | post-open POST | post-open POST |
| omnient | 235 | ON | 52.421 | count=0 | early POST | early POST |
| omnient | 236 | OFF | 52.912 | count=0 | post-open POST | post-open POST |
| omnient | 236 | ON | 52.863 | count=0 | early POST | early POST |
| omnient | 237 | OFF | 50.938 | count=0 | post-open POST | post-open POST |
| omnient | 237 | ON | 52.862 | count=0 | early POST | early POST |
| omnient | 238 | OFF | 53.068 | count=0 | post-open POST | post-open POST |
| omnient | 238 | ON | 52.811 | count=0 | early POST | early POST |
| omnient | 239 | OFF | 51.998 | count=0 | post-open POST | post-open POST |
| omnient | 239 | ON | 50.865 | count=0 | early POST | early POST |
| omnient | 240 | OFF | 52.648 | count=0 | post-open POST | post-open POST |
| omnient | 240 | ON | 51.927 | count=0 | early POST | early POST |
| omnient | 241 | OFF | 53.047 | count=0 | post-open POST | post-open POST |
| omnient | 241 | ON | 50.569 | count=0 | early POST | early POST |
| omnient | 242 | OFF | 52.840 | count=0 | post-open POST | post-open POST |
| omnient | 242 | ON | 52.002 | count=0 | early POST | early POST |
| omnient | 243 | OFF | 52.586 | count=0 | post-open POST | post-open POST |
| omnient | 243 | ON | 53.040 | count=0 | early POST | early POST |
| omnient | 244 | OFF | 50.518 | count=0 | post-open POST | post-open POST |
| omnient | 244 | ON | 51.340 | count=0 | early POST | early POST |
| omnient | 245 | OFF | 52.072 | count=0 | post-open POST | post-open POST |
| omnient | 245 | ON | 52.913 | count=0 | early POST | early POST |
| omnient | 246 | OFF | 52.865 | count=0 | post-open POST | post-open POST |
| omnient | 246 | ON | 52.008 | count=0 | early POST | early POST |
| omnient | 247 | OFF | 52.923 | count=0 | post-open POST | post-open POST |
| omnient | 247 | ON | 51.903 | count=0 | early POST | early POST |
| omnient | 248 | OFF | 52.449 | count=0 | post-open POST | post-open POST |
| omnient | 248 | ON | 50.295 | count=0 | early POST | early POST |
| omnient | 249 | OFF | 50.772 | count=0 | post-open POST | post-open POST |
| omnient | 249 | ON | 52.313 | count=0 | early POST | early POST |
| omnient | 250 | OFF | 50.647 | count=0 | post-open POST | post-open POST |
| omnient | 250 | ON | 52.791 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 50 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 75/250 ON trials. Of those trials, 75 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 4, 5, 9, 10, 11, 15, 19, 20, 22, 26, 28, 33, 34, 38, 40, 43, 44, 48, 49, 50, 52, 54, 57, 59, 61, 65, 66, 68, 73, 74, 78, 81, 87, 90, 91, 93, 95, 101, 109, 110, 111, 113, 115, 118, 119, 120, 121, 126, 128, 135, 137, 139, 141, 145, 147, 158, 159, 162, 164, 165, 169, 171, 172, 173, 174, 177, 179, 181, 186, 187, 190, 192, 193, 197, 198, 200, 201, 206, 207, 209, 213, 219, 220, 221, 222, 223, 226, 227, 230, 239, 242, 243, 244, 249. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 27528 | 7DF32F6A-902A-4CD6-BB4D-72404F1AEB89 |
| 1 | ON | 2 | 27530 | 668651E8-A7EE-49B4-8263-2F0D087406A0 |
| 2 | OFF | 3 | 27531 | 12C2FEB7-22FC-4F50-BC77-A5A1B3043B3D |
| 2 | ON | 4 | 27532 | B333B5D9-21D0-496D-A82E-EDAC46E70911 |
| 3 | OFF | 5 | 27533 | A91DA66F-EEB6-4047-9E75-16C35D111745 |
| 3 | ON | 6 | 27534 | 278EECDD-F0AE-4837-8026-A040DDD9A7EB |
| 4 | OFF | 7 | 27535 | 2211E2E5-ADB1-4824-B886-80E67F3FEC4F |
| 4 | ON | 8 | 27536 | 5160236F-91B5-4757-9F16-3208BBFD3479 |
| 5 | OFF | 9 | 27537 | EE778058-65FB-438A-9AD6-1FF10925A67A |
| 5 | ON | 10 | 27539 | 2CB9D525-990A-4419-8017-21B344EB9CE5 |
| 6 | OFF | 11 | 27540 | D4C623FC-638E-404D-BA18-4A8EF76A60D5 |
| 6 | ON | 12 | 27541 | 159261A4-0DDD-442D-BFEF-7C0B42D340C2 |
| 7 | OFF | 13 | 27542 | 00F796AC-C330-4047-A69F-3D9F9DA2BA71 |
| 7 | ON | 14 | 27543 | AF25104E-3A94-4620-9CC2-20A4818B1949 |
| 8 | OFF | 15 | 27544 | 4E4C7283-3CA2-4075-A49A-59B31840C9EE |
| 8 | ON | 16 | 27545 | 806E6B86-1C8E-41ED-A603-2CBC12E7803D |
| 9 | OFF | 17 | 27546 | 3CE3E963-F333-4268-9A84-4A4FCF16C6FA |
| 9 | ON | 18 | 27548 | 8D0BF11A-A598-4382-B7A3-39752EBD6458 |
| 10 | OFF | 19 | 27549 | B058BD6F-E181-45D3-9452-721651F9FB51 |
| 10 | ON | 20 | 27550 | B4A1232B-7DC0-4B7E-802B-458FB08908F6 |
| 11 | OFF | 21 | 27551 | 2EB9D411-0191-4D2F-97AD-1E0434A8FAA3 |
| 11 | ON | 22 | 27552 | 378C3BE6-BD3F-416D-BC98-CECA029596D1 |
| 12 | OFF | 23 | 27554 | 157A9929-B6E4-406A-8AAA-D2E677E31458 |
| 12 | ON | 24 | 27555 | 719B06CD-32BB-4E66-9353-526305921B0B |
| 13 | OFF | 25 | 27556 | 45998262-B949-40DF-8390-BA81498A64BA |
| 13 | ON | 26 | 27557 | D6D0F7DB-28E1-4568-A037-35BC085F9AFC |
| 14 | OFF | 27 | 27558 | B7E8DE2A-2E6B-4015-B3C5-A230EF3F5812 |
| 14 | ON | 28 | 27559 | CB88CD3C-C63A-4E7C-8BCB-6019CF9FE11C |
| 15 | OFF | 29 | 27560 | 6C57D551-E577-44BC-8F3B-2FABFEC37705 |
| 15 | ON | 30 | 27561 | 834E170C-0023-482E-AC15-FA6265BBC24E |
| 16 | OFF | 31 | 27562 | 82D275EE-CAD2-451F-A092-BF1EB3548EAF |
| 16 | ON | 32 | 27564 | E71A2A31-FF31-4632-B96C-91145018B112 |
| 17 | OFF | 33 | 27565 | 95DC4C89-771B-4D71-8E0C-A5DFEF49F2B4 |
| 17 | ON | 34 | 27566 | E327F6C1-4380-4C8C-AC12-920B8DCD7294 |
| 18 | OFF | 35 | 27567 | 1224AFF3-7BEB-4D10-99CB-E15B52DCC8C0 |
| 18 | ON | 36 | 27569 | 49E4A6C6-3062-4F75-8196-7B2545D88CBA |
| 19 | OFF | 37 | 27570 | A3A5DE6F-A75B-4282-92B5-A030E425097B |
| 19 | ON | 38 | 27571 | 2E50B294-B45B-4CE7-B70E-86A715868804 |
| 20 | OFF | 39 | 27572 | DA9EA12D-CC59-4890-B93E-8998AAF28005 |
| 20 | ON | 40 | 27574 | B80698AE-AD38-4DDE-8E30-B0A8DE236FB7 |
| 21 | OFF | 41 | 27575 | EFC65C45-0F41-482C-B201-934E78E05B44 |
| 21 | ON | 42 | 27576 | C677CDB0-1206-4F2A-B2CD-9DED1CD0FB7D |
| 22 | OFF | 43 | 27578 | 934EBDFC-5BCB-488A-9198-E11055559247 |
| 22 | ON | 44 | 27579 | C44269C2-5C7C-4BDA-A6CD-B2D8A01E2B1F |
| 23 | OFF | 45 | 27580 | DF654428-F01A-41C9-9608-3062751E1D01 |
| 23 | ON | 46 | 27581 | 17F94CC1-294F-4D97-B97A-B300D1E8CB23 |
| 24 | OFF | 47 | 27582 | 7BAEACFE-73F4-447D-A2A0-8766AB9D23DA |
| 24 | ON | 48 | 27584 | F5355076-754C-4428-8B02-10C990459707 |
| 25 | OFF | 49 | 27585 | 069CAC3A-1625-47E8-82AB-2E9A6FADBE3C |
| 25 | ON | 50 | 27586 | 66BCE9B6-D6FE-43D3-8184-AD4EA1072ECC |
| 26 | OFF | 51 | 27587 | E4A9B337-3222-4931-A3A1-49FF0F6EFB41 |
| 26 | ON | 52 | 27588 | C77A65CA-B0DC-4A1B-A379-93B523ACC392 |
| 27 | OFF | 53 | 27589 | CB50672B-E696-4CD1-B510-CDB28ADFEDA1 |
| 27 | ON | 54 | 27590 | BDF6A62E-4906-4454-BCE7-68118FD294F3 |
| 28 | OFF | 55 | 27591 | E394ABA1-6939-48A3-80F9-373216E97435 |
| 28 | ON | 56 | 27593 | 4C5CBB57-5BC3-4361-9849-A9DD717269A6 |
| 29 | OFF | 57 | 27594 | BD02ECF9-D7D8-47EA-9051-7CE51685A816 |
| 29 | ON | 58 | 27595 | 69CBF18D-20F1-4C83-84E7-77C7A41A729A |
| 30 | OFF | 59 | 27596 | E3367E3B-38AC-4A15-9A08-C8ED20BA0386 |
| 30 | ON | 60 | 27597 | 8BB972B6-0155-4742-BF7A-A788AEA566E2 |
| 31 | OFF | 61 | 27598 | 7BB42ABC-7093-4047-B1D2-60C617798600 |
| 31 | ON | 62 | 27599 | C0055CAB-E0F8-42C5-A8A3-E38ABB01BAA9 |
| 32 | OFF | 63 | 27600 | B8E54A9E-8373-41D8-94C4-1EEB72538A83 |
| 32 | ON | 64 | 27601 | 7ADA75C7-DAFF-48A0-8A8D-977314FE1824 |
| 33 | OFF | 65 | 27603 | ECAC2877-82C5-46BB-A383-08C5577DC8C3 |
| 33 | ON | 66 | 27604 | 839D5E00-6011-4DE1-95C2-292F8D8F2213 |
| 34 | OFF | 67 | 27605 | DF2CBC24-0ECA-40ED-B29D-FECBDD2E0409 |
| 34 | ON | 68 | 27606 | 015AB8A3-C14A-4AAF-B9AC-C4F08500E32B |
| 35 | OFF | 69 | 27607 | 3CD73728-D013-4EC8-A180-FDD145BAD99B |
| 35 | ON | 70 | 27608 | 23E14982-E188-412F-A2BD-DB1EC6F75DF0 |
| 36 | OFF | 71 | 27609 | 491C4753-FD2C-4308-8C41-0B1DB5A689A0 |
| 36 | ON | 72 | 27610 | 3B9D6B15-2B36-4155-BB70-D10119A9C3B7 |
| 37 | OFF | 73 | 27612 | 26B8A585-0081-46D3-818A-B5024BE9F10D |
| 37 | ON | 74 | 27613 | 1FFB5072-6103-41A6-9037-39E99FB08D91 |
| 38 | OFF | 75 | 27614 | FE938333-C1D9-41F2-BF1B-08F4DF9938FF |
| 38 | ON | 76 | 27615 | 03C6DD58-960B-4898-9B95-EFA7A12BBA00 |
| 39 | OFF | 77 | 27616 | B1D3F8EC-18B5-40A2-8AFF-07636B445A10 |
| 39 | ON | 78 | 27617 | 45AAB47F-8003-4B01-A42D-49BE723658D1 |
| 40 | OFF | 79 | 27618 | 17E783C0-B980-4877-A07B-33A2F872954B |
| 40 | ON | 80 | 27619 | DD400B8B-82CF-4E5A-A7EC-898BF29DC95A |
| 41 | OFF | 81 | 27621 | 5CF59ADA-370D-4129-B270-FC186FAAB8CB |
| 41 | ON | 82 | 27622 | 27EB026E-D1B8-4E9E-A286-6AFF94FBCA3D |
| 42 | OFF | 83 | 27623 | 114F08C5-0099-429E-A167-FA5781C39846 |
| 42 | ON | 84 | 27624 | 1866067B-552A-4899-B304-FD31E19F8036 |
| 43 | OFF | 85 | 27625 | CD78A4D0-FD50-48DA-893C-BB2A754E20CE |
| 43 | ON | 86 | 27626 | 3BC55C96-A060-499F-9CAC-BECAAD72AB46 |
| 44 | OFF | 87 | 27627 | C8D1DF5A-FEA7-4F84-BCBF-80E6E540B101 |
| 44 | ON | 88 | 27629 | F7FD5379-3B68-48E4-94EC-FAF06EEFE4B4 |
| 45 | OFF | 89 | 27630 | 33987EC9-9695-46D8-8D1A-DD0BBF967A81 |
| 45 | ON | 90 | 27631 | 1A45DB65-E85F-436D-8C9C-1B3762A47D55 |
| 46 | OFF | 91 | 27632 | C0DAF4B8-7A81-4A58-A008-BAF74F4ADEFC |
| 46 | ON | 92 | 27633 | 62983D83-0403-4978-8C7C-8FABB6FD1F81 |
| 47 | OFF | 93 | 27634 | 7B693C48-7875-4F2D-92FA-37D903E13B13 |
| 47 | ON | 94 | 27636 | BF795AFB-0D43-451C-8AB1-F25A6049851D |
| 48 | OFF | 95 | 27638 | 6661E494-3113-4F41-AD20-3DD873DCFECF |
| 48 | ON | 96 | 27639 | B84A1726-1673-4E53-8174-43E6DB4C6DDC |
| 49 | OFF | 97 | 27640 | B7F6B09E-A407-44A9-8229-0AC133AF9ACA |
| 49 | ON | 98 | 27641 | A091A386-BE71-462B-BCAC-976A5C9F98D4 |
| 50 | OFF | 99 | 27642 | 9291B66C-FFCC-430A-ABA6-6122E0743593 |
| 50 | ON | 100 | 27643 | 01457EC0-23D7-45BD-8A5D-F613B5EB7F14 |
| 51 | OFF | 101 | 27644 | 030913DF-FD8A-4F81-8A9F-CB4ED63C9D27 |
| 51 | ON | 102 | 27646 | 5E3216EE-5BE1-4383-A92D-FA3DBEAB857E |
| 52 | OFF | 103 | 27647 | A4ED4797-6BA0-47CC-94AA-EACCE0EFC749 |
| 52 | ON | 104 | 27649 | A490AEE5-ECFA-47A3-8811-32CB1656FD18 |
| 53 | OFF | 105 | 27650 | 3F4837A2-4B1A-4100-B4B7-9C8239A5BDC4 |
| 53 | ON | 106 | 27651 | E6F06A12-287F-416E-928D-D1BABCC0B12C |
| 54 | OFF | 107 | 27652 | 0CC1D59F-CFBA-4289-9E8C-1EBE5BA8B7A4 |
| 54 | ON | 108 | 27653 | 6D6A64AD-3CCB-4707-B990-64FDCB0BB05C |
| 55 | OFF | 109 | 27654 | 365E924A-6A57-4BC4-995B-C92FEAF96E60 |
| 55 | ON | 110 | 27656 | 473F9389-18A9-48D2-A1DD-D4A6E4D94D0C |
| 56 | OFF | 111 | 27657 | 23B25D15-6A57-4DBB-8285-81D3D7500FB8 |
| 56 | ON | 112 | 27658 | 500DFADB-E318-4EDF-8F87-2D5C299C63CB |
| 57 | OFF | 113 | 27659 | 9E9D7CE7-50B9-432D-9D3E-A8D19910C5D6 |
| 57 | ON | 114 | 27660 | F4A29783-31B8-4A91-AFF7-2D3EC856A718 |
| 58 | OFF | 115 | 27661 | 4AE62D09-4638-4983-A9A3-3D93984F60E3 |
| 58 | ON | 116 | 27662 | D0A6F2A2-B22B-49F1-8850-2A69964B8EFC |
| 59 | OFF | 117 | 27663 | C5665BD1-E959-43B3-9D1B-7E4DE68CCD1D |
| 59 | ON | 118 | 27665 | ACDD1D55-4624-4BC6-8727-C0A080151626 |
| 60 | OFF | 119 | 27666 | B484271A-E52E-437A-A558-A719B38C6C50 |
| 60 | ON | 120 | 27667 | E8774A19-ECEB-4D01-9166-0F6111C6C2F5 |
| 61 | OFF | 121 | 27668 | 9C715EEB-B7B6-4A25-8646-1D42DB77B4B4 |
| 61 | ON | 122 | 27669 | FCC1B15D-DC47-4B7E-8B6F-63149351A705 |
| 62 | OFF | 123 | 27670 | 2C0EBCFF-496B-4D0B-9B6D-88881169E4A9 |
| 62 | ON | 124 | 27671 | 5F7EA3F1-471F-46AC-8DDA-9F7B260D950B |
| 63 | OFF | 125 | 27672 | A3804E16-47C7-47D5-B670-B708C58B32FA |
| 63 | ON | 126 | 27674 | CD6C2FE1-2152-47D2-81FD-CAAEF965CC92 |
| 64 | OFF | 127 | 27675 | 47DA9470-A842-435E-9ECD-8C9D574981E3 |
| 64 | ON | 128 | 27676 | 76740F74-A58B-46D8-8553-746C04BB31D0 |
| 65 | OFF | 129 | 27677 | 59C686FB-7F93-4EA0-ADFD-255F0CCAE7CE |
| 65 | ON | 130 | 27679 | 4E492789-A982-448A-99B8-F84D5E6F6C75 |
| 66 | OFF | 131 | 27680 | 1D9230D4-D24A-46D3-A749-C3C0A046FC34 |
| 66 | ON | 132 | 27681 | 9EA57D16-4645-4DCB-AC34-DD6EE3E18520 |
| 67 | OFF | 133 | 27682 | 57ADAA46-69B4-43AA-A27A-51DA09157B6C |
| 67 | ON | 134 | 27683 | 1B0C377F-B7A3-46E9-B07D-5DF3D6A69295 |
| 68 | OFF | 135 | 27684 | 991C39DD-4495-4DB7-B2D3-B78A893981D6 |
| 68 | ON | 136 | 27685 | 763BB032-3388-4693-A0AA-8DBD6102C71B |
| 69 | OFF | 137 | 27687 | 7F145D08-D645-41ED-9D71-F8E7651FFC01 |
| 69 | ON | 138 | 27688 | 785A4134-4DE9-44E5-B9E9-04DAA12F5590 |
| 70 | OFF | 139 | 27689 | 38CA4CF7-8E76-4EA8-8ECC-680C703BACD5 |
| 70 | ON | 140 | 27690 | AB564414-B00D-4C8A-8802-11D47D312F52 |
| 71 | OFF | 141 | 27691 | EA35F802-086D-4133-B2EE-406B94DF1CC1 |
| 71 | ON | 142 | 27692 | E6313606-7E11-4324-8073-0AAF244FAE81 |
| 72 | OFF | 143 | 27693 | 0D26799B-BC75-4BED-ACA9-FFFC17F97441 |
| 72 | ON | 144 | 27695 | B26609AC-F84D-4509-8E3A-6C8876449DAE |
| 73 | OFF | 145 | 27696 | FCF419EE-CD41-417C-A7C4-13B70061CBF8 |
| 73 | ON | 146 | 27697 | 856F973B-3C49-4F1B-B85E-F0DCB9618162 |
| 74 | OFF | 147 | 27698 | 0DC496FC-89F7-48E8-A622-D5E029B5AB23 |
| 74 | ON | 148 | 27699 | D711972E-24DF-40B7-A989-CB0A4291D99A |
| 75 | OFF | 149 | 27700 | 4B97C630-E0E6-4654-81A3-B8CAD2E71ACC |
| 75 | ON | 150 | 27701 | FB8E2BED-349A-4046-AC60-DA8C456E8A7C |
| 76 | OFF | 151 | 27702 | ECF8BAD5-F300-4EAF-9F96-33CA5D9568BD |
| 76 | ON | 152 | 27704 | 25E19F12-0AC4-42A6-A4DD-D89E8B30C015 |
| 77 | OFF | 153 | 27705 | 7A9D5D6C-BF7A-4647-9544-AFD27EAF109D |
| 77 | ON | 154 | 27706 | E2FA4B75-4C17-4E8B-B361-516A0253EDA7 |
| 78 | OFF | 155 | 27707 | EC43BD28-7C51-480C-AACA-5732D954A5A6 |
| 78 | ON | 156 | 27708 | A4C07CD8-F0C1-4865-8399-3B1DBCEDD45F |
| 79 | OFF | 157 | 27709 | C6A180D5-A181-47DB-A99D-7781320873E3 |
| 79 | ON | 158 | 27710 | 657D1F3C-13BD-4945-B3D8-F8370C63642E |
| 80 | OFF | 159 | 27711 | A8E3D3B5-9068-4E58-B2AC-D00353B5B0F3 |
| 80 | ON | 160 | 27713 | 51AABB0F-11A2-4986-9F98-82233D7F4EDC |
| 81 | OFF | 161 | 27714 | BD9DF3A5-F0A2-412F-8769-094B7907F3FF |
| 81 | ON | 162 | 27715 | 61C73A24-2408-46B9-9B84-D3AC9DF19C58 |
| 82 | OFF | 163 | 27716 | 33EB2BB6-BD90-40B3-9C3E-9DF17535223B |
| 82 | ON | 164 | 27717 | 7B6D8BA6-132C-47A4-87BD-23778534335B |
| 83 | OFF | 165 | 27718 | C6DEBEDD-1DF4-4E80-8CD8-5850A857F567 |
| 83 | ON | 166 | 27719 | B4535A6F-CC9B-444B-9EDF-1CE788E4CCAA |
| 84 | OFF | 167 | 27720 | 6B022922-052C-4FCF-985D-EE643B113634 |
| 84 | ON | 168 | 27722 | C149D363-9092-40E9-BA53-C98C165BEC54 |
| 85 | OFF | 169 | 27723 | C17F4666-FC5D-4E86-9EC3-9CBEBE19773C |
| 85 | ON | 170 | 27724 | 5B6A3CA5-882B-4447-9368-5F268E4A64B0 |
| 86 | OFF | 171 | 27725 | 270F99CE-824E-47DB-9B7F-D2508A41C453 |
| 86 | ON | 172 | 27726 | 19AE74E8-19C6-4B5D-938B-88185A17DDF2 |
| 87 | OFF | 173 | 27727 | 4DAB3E92-6A66-48BE-9D10-CA050F6D0393 |
| 87 | ON | 174 | 27728 | 1C553471-5BA0-45BC-8FB2-B3CD64968CDC |
| 88 | OFF | 175 | 27729 | 8A35CBEA-B2B6-40CD-A609-93A6808DE456 |
| 88 | ON | 176 | 27731 | 65409358-EDD7-4AB6-93ED-486C624796EC |
| 89 | OFF | 177 | 27732 | 0F90B2EC-0A0F-409F-A33C-69A67D443C44 |
| 89 | ON | 178 | 27733 | 9F2F9FCB-8AA5-4B40-B8A9-D54BE50FAF1C |
| 90 | OFF | 179 | 27734 | 6FA3FA0C-6099-4322-84D3-7E388ACAF5E6 |
| 90 | ON | 180 | 27735 | 1F873EE6-4685-48F1-B981-EBBAC8268D1A |
| 91 | OFF | 181 | 27736 | C1B75D36-A102-499C-9F31-2D9ABE8A0B97 |
| 91 | ON | 182 | 27737 | F3954AB5-EE39-4CE5-B8A7-418A7193B39D |
| 92 | OFF | 183 | 27738 | 1DC858C7-40E9-4590-A131-253F7F5B2FC7 |
| 92 | ON | 184 | 27740 | FA0C708B-BEA7-4D24-AFB6-CC488E03AFC0 |
| 93 | OFF | 185 | 27741 | 1AE9EB48-8001-49AC-BFF9-214B2E404C30 |
| 93 | ON | 186 | 27742 | D03ABAB5-72E0-44EB-BBEA-18553AE93898 |
| 94 | OFF | 187 | 27743 | 73F06EA2-2DBF-4410-A2DA-83794A958F7A |
| 94 | ON | 188 | 27744 | D1DB1756-44F9-4971-9E5A-A960EF6AE0AA |
| 95 | OFF | 189 | 27745 | 1FACCAC9-B82E-425E-B00A-AD581FB2916C |
| 95 | ON | 190 | 27746 | 1222D44D-1492-4400-930B-D25FEF281215 |
| 96 | OFF | 191 | 27747 | 44A4E665-0C45-4ED6-8FAD-0678E6E183F7 |
| 96 | ON | 192 | 27749 | D588A444-161D-47E6-9121-71E5B001AE60 |
| 97 | OFF | 193 | 27750 | 8B7CE39C-2222-4467-BD87-F20DBF8B8FED |
| 97 | ON | 194 | 27751 | 4F71BE84-E275-4C5C-AE74-7FDCB4C5AAA7 |
| 98 | OFF | 195 | 27752 | 4C52CF83-5A52-4FF9-A803-42F4FF3E030A |
| 98 | ON | 196 | 27753 | 383FAE43-F014-4346-BB2F-B80D887C1835 |
| 99 | OFF | 197 | 27754 | 58FC6580-4029-4AD1-8DBB-005F9E4DB205 |
| 99 | ON | 198 | 27755 | DF69842E-01AC-4EEC-81C3-F26F082C2710 |
| 100 | OFF | 199 | 27756 | A94A433A-E3B5-4AD6-9F03-3199FB676A6C |
| 100 | ON | 200 | 27758 | 8A80D9BB-8641-4B9B-863D-6D2FD011B10A |
| 101 | OFF | 201 | 27759 | B1A307AD-4F23-4671-BF21-69181BA9CA20 |
| 101 | ON | 202 | 27760 | 80D7C7FB-CB08-40B4-B15D-DF9BFAFB67C5 |
| 102 | OFF | 203 | 27761 | 18AB83BC-A74D-4CD4-AF16-3884714FCBAA |
| 102 | ON | 204 | 27762 | 94EC97F4-C73C-4730-83FC-942F9E437C2E |
| 103 | OFF | 205 | 27763 | 3DA25FA6-451A-45B5-8C37-D20075C4171F |
| 103 | ON | 206 | 27764 | 5D9FCCE4-3146-465B-A3A3-A49E3B683651 |
| 104 | OFF | 207 | 27765 | A5B634C4-8603-4E3D-A120-89E5F45175A7 |
| 104 | ON | 208 | 27767 | C8B87524-1B25-4347-A496-611B7A8B66BE |
| 105 | OFF | 209 | 27768 | E5752ECD-65BC-4E06-B73B-6FA74C963866 |
| 105 | ON | 210 | 27769 | 9BC4D912-0736-40D3-A52D-3B7D9269FC53 |
| 106 | OFF | 211 | 27770 | 8636E9DF-4E67-46F7-B979-4A4966A8E36F |
| 106 | ON | 212 | 27771 | 4B589BC9-C1B8-4FF5-8E77-B4957767CB87 |
| 107 | OFF | 213 | 27772 | 351AAE2D-49DB-44E5-9A6F-E79065D156EA |
| 107 | ON | 214 | 27773 | D16809E7-7A6F-456F-8593-3546887BBCE6 |
| 108 | OFF | 215 | 27774 | C01C1E28-B3F7-491B-807D-F12BB4E4323B |
| 108 | ON | 216 | 27776 | D644D570-BDAE-4709-958E-12D3A1975C5C |
| 109 | OFF | 217 | 27777 | 6EF604E6-528B-4CE1-86CF-7F6D031ADDC6 |
| 109 | ON | 218 | 27778 | 8631B4FA-73FA-44DC-A7A2-9BCE8CC125F3 |
| 110 | OFF | 219 | 27779 | F48C9F76-0A1B-43DF-8A80-91E3DBD8796F |
| 110 | ON | 220 | 27780 | DF2B3A0A-B3E7-424A-AACB-315BBDB980DD |
| 111 | OFF | 221 | 27781 | FD3C9C86-F9A6-40FF-A9EA-3220B5B40234 |
| 111 | ON | 222 | 27782 | 2E8033C3-6CE1-4ECF-8868-ABA689353A9E |
| 112 | OFF | 223 | 27783 | 0F0CC322-9EB9-402C-8CAE-6F0671AC10A4 |
| 112 | ON | 224 | 27785 | 6727A3C6-D69F-4518-88D0-1C49612A96D9 |
| 113 | OFF | 225 | 27786 | 7412263A-2F49-4C53-A572-C126356332F0 |
| 113 | ON | 226 | 27787 | 44067F0F-9574-459A-9D63-70790992D28E |
| 114 | OFF | 227 | 27788 | 486ACA94-F500-4251-80FF-C072C6A1A6E6 |
| 114 | ON | 228 | 27789 | 02F3A11A-BE3E-4327-84E9-6379B7D34BAD |
| 115 | OFF | 229 | 27790 | 8A251625-D880-42EA-9921-4457C0737B43 |
| 115 | ON | 230 | 27791 | CFF35F8E-5E50-4BFF-8A13-F98731C1035E |
| 116 | OFF | 231 | 27792 | 358333F0-7D2A-4DEA-8081-92B7C4720CCE |
| 116 | ON | 232 | 27794 | 865415F1-B7A8-4BC6-B86C-30B2946FADDC |
| 117 | OFF | 233 | 27795 | C7A8A981-F6E2-433C-A44E-FDF62A703B02 |
| 117 | ON | 234 | 27796 | 64687BFF-9E76-4626-8FE9-E491CF562729 |
| 118 | OFF | 235 | 27797 | C4A15BCE-AB5B-48E5-8FB0-892D5597ACB6 |
| 118 | ON | 236 | 27798 | CEA873CE-B6D9-4CE4-AADE-27E4A4FCB75B |
| 119 | OFF | 237 | 27799 | 11E5F864-D86B-4C10-B8F3-DEC5FEF76B23 |
| 119 | ON | 238 | 27800 | 028DF9EA-C54D-411A-9EB6-35A3F7687006 |
| 120 | OFF | 239 | 27801 | 14FDE6F4-5DBE-4FE1-8B1C-57D56672439C |
| 120 | ON | 240 | 27803 | 6C06E230-DC54-4C42-A77B-2EA9269B5885 |
| 121 | OFF | 241 | 27804 | 6C9BFF22-54D5-455B-A960-1141CA81147D |
| 121 | ON | 242 | 27805 | A5AB5B4B-058C-4BAF-91AE-2D40A57877DC |
| 122 | OFF | 243 | 27806 | 27022116-5B16-438B-8774-0BEB0593F768 |
| 122 | ON | 244 | 27807 | CD8494E4-360E-4B71-913D-A85C76C3A2FB |
| 123 | OFF | 245 | 27808 | EE9DCC48-6FDD-4C3D-A92D-5A6BE1934EE5 |
| 123 | ON | 246 | 27809 | 8F35240C-CC26-4193-B7C7-176A5F71308D |
| 124 | OFF | 247 | 27810 | 24A271C9-F0D3-4B22-816F-813E94AFD201 |
| 124 | ON | 248 | 27812 | 00ED533B-57D3-4A22-BBB5-7B704B502011 |
| 125 | OFF | 249 | 27813 | 3178615B-F066-428D-A495-FC2A33FAEE17 |
| 125 | ON | 250 | 27814 | 9360F264-98D5-4E4F-AE6B-DD03A4BCFEE0 |
| 126 | OFF | 251 | 27815 | ACAA2B4E-5227-422D-A103-90D74422CF15 |
| 126 | ON | 252 | 27816 | 75FD01E8-C908-4159-9868-03E6DCC52C24 |
| 127 | OFF | 253 | 27817 | 9FD82C76-6914-4FB1-9E6F-21178EC79530 |
| 127 | ON | 254 | 27818 | A4054D8B-6570-429B-8EFB-5E96FF324AD3 |
| 128 | OFF | 255 | 27819 | 79020B2A-A535-470B-B95A-97B2FD1E7F5F |
| 128 | ON | 256 | 27820 | 83075242-D47A-4419-92A3-0507467B6098 |
| 129 | OFF | 257 | 27822 | 700377E6-BA3B-4AE9-B886-F9778F316610 |
| 129 | ON | 258 | 27823 | 2E92A1DE-6218-4E1F-A622-BDB5EE1B16C7 |
| 130 | OFF | 259 | 27824 | 8CA60E2F-B6A6-4603-AEAD-A979DF7A3E4C |
| 130 | ON | 260 | 27825 | AB0E93C2-7DDD-4DFA-A785-FCE6028EFEDF |
| 131 | OFF | 261 | 27826 | D478B27B-8FA4-4B5E-813A-31E8AE12F754 |
| 131 | ON | 262 | 27827 | 815C594B-C349-41A7-8C7D-EFE6FA996DE4 |
| 132 | OFF | 263 | 27828 | 4F021AFA-1C19-4324-996A-05AFF80BCE07 |
| 132 | ON | 264 | 27829 | 280F56B2-823D-46FD-946E-5FE459A72873 |
| 133 | OFF | 265 | 27831 | C98D8266-BC71-4B27-807D-263B85E36F7A |
| 133 | ON | 266 | 27832 | 810C5D66-6E2A-4806-9B03-AE15BF3B8993 |
| 134 | OFF | 267 | 27833 | B3ACA981-A9CC-4263-964D-CAD1E1DB2FA1 |
| 134 | ON | 268 | 27834 | BC4A354B-A13F-4842-AE12-840F9730C336 |
| 135 | OFF | 269 | 27835 | 8A176766-2E94-4319-A96E-036693683AD1 |
| 135 | ON | 270 | 27836 | 3E2890A2-88FC-4E48-A6A3-F495C79E290C |
| 136 | OFF | 271 | 27837 | 86EA1BCC-F79A-426D-99C7-810902E18527 |
| 136 | ON | 272 | 27838 | E25874CF-0FB6-4414-9370-0AA8D37D868C |
| 137 | OFF | 273 | 27840 | FAF8F852-A1D7-44AB-B9CB-8EC635F6C8A0 |
| 137 | ON | 274 | 27841 | 646FC161-C505-4BDA-BA91-9C4489A6ED59 |
| 138 | OFF | 275 | 27842 | 40249032-FBAD-4331-A011-E4A543B89717 |
| 138 | ON | 276 | 27843 | 480ED607-214E-45E0-8AFF-D272FBBE81DA |
| 139 | OFF | 277 | 27844 | E806F7C4-5E21-4724-9F63-D43949F73C47 |
| 139 | ON | 278 | 27845 | 33B73979-D8EB-4743-B6CB-3710856EC5A0 |
| 140 | OFF | 279 | 27846 | 4ABA5AD2-4124-4033-9476-C457A0B50787 |
| 140 | ON | 280 | 27847 | 4539FE50-51ED-4D54-B764-DF1D5559FB49 |
| 141 | OFF | 281 | 27849 | C32FF976-984C-460B-B9BC-A0C084E218F8 |
| 141 | ON | 282 | 27850 | 97DF3E3F-8EE7-4AC3-98ED-6CD1695C4FF8 |
| 142 | OFF | 283 | 27851 | 282AB156-4217-4F4A-AFF6-463B32867001 |
| 142 | ON | 284 | 27852 | FCBE7A22-780B-4477-9AB1-924FBF35F2A3 |
| 143 | OFF | 285 | 27853 | 98BE35BD-4FBD-43C8-9724-AB987D2A6C7A |
| 143 | ON | 286 | 27854 | FE581916-38AC-40F1-BCC7-F4F7ACFD8DF6 |
| 144 | OFF | 287 | 27855 | F8DD74BE-3E8C-4E02-B953-0B15D7C39F1B |
| 144 | ON | 288 | 27857 | 1ECE716B-9538-44C4-87E7-1FEFCF5A1D00 |
| 145 | OFF | 289 | 27858 | D7A5F44D-2162-4A16-A6AA-998917647F9A |
| 145 | ON | 290 | 27859 | DA65BD69-1438-4331-98FD-08486A71C4E3 |
| 146 | OFF | 291 | 27860 | 146F108F-14AC-4B38-BFAD-9B75AC48C7F1 |
| 146 | ON | 292 | 27861 | 2320C4F4-2E1A-4D33-B4ED-5E95166EBC30 |
| 147 | OFF | 293 | 27862 | 69A4DB77-CA20-4E74-869F-7080B79BE7EB |
| 147 | ON | 294 | 27863 | F937FB55-A4FB-4F20-86AE-11EA408C0175 |
| 148 | OFF | 295 | 27864 | D8491454-9C4D-4555-B613-3B99BDCA2A59 |
| 148 | ON | 296 | 27866 | C83BC335-A4C2-4BDB-9060-01AB6F8DE6AB |
| 149 | OFF | 297 | 27867 | 3C22A33A-A398-43AE-91DE-CAB507E8AE83 |
| 149 | ON | 298 | 27868 | D6708D47-6DA5-4E5E-9795-F3518CC0F6A4 |
| 150 | OFF | 299 | 27869 | 2940B504-7993-419B-96D3-972A9EBF47F5 |
| 150 | ON | 300 | 27870 | C007A7CA-0031-4EF8-BDFE-CAFA1B73DEE7 |
| 151 | OFF | 301 | 27871 | CF6E534A-278D-4718-AE40-936F4FDCD331 |
| 151 | ON | 302 | 27872 | F2667D72-7BF9-45DC-8A6D-B9401610D0B4 |
| 152 | OFF | 303 | 27873 | 7EC7D6D9-A865-47F2-84C9-F6D8D877EEEB |
| 152 | ON | 304 | 27875 | 35E32AC7-5C97-41B3-9459-E8ADE1D9D2AC |
| 153 | OFF | 305 | 27876 | 63DB9C8D-9003-4C40-9FF0-6DB57522E08A |
| 153 | ON | 306 | 27877 | 77E52360-EA23-447E-9E62-45B88B6CAEDA |
| 154 | OFF | 307 | 27878 | BE43461F-CD03-4B8E-9FD1-BB9B8C9489C6 |
| 154 | ON | 308 | 27879 | 781A4F34-63EB-4403-A2F7-E100D6245B36 |
| 155 | OFF | 309 | 27880 | 58EA5D13-F7C8-4E86-A65B-D8ECF5BD6140 |
| 155 | ON | 310 | 27881 | E75096CD-17BE-408C-966A-1C480736C35E |
| 156 | OFF | 311 | 27882 | 14699AFA-8D8D-4617-BCCE-CBF373886AB5 |
| 156 | ON | 312 | 27884 | 45A8A234-EAB1-4557-87A6-1E1AB0A3F3E1 |
| 157 | OFF | 313 | 27885 | 9A113E93-A43F-4B2D-965C-9CC0B7D4698D |
| 157 | ON | 314 | 27886 | C38A5AFF-A812-4FA9-B850-E7B5E4BC5BFC |
| 158 | OFF | 315 | 27887 | 86BDC0DB-0A9C-4349-B0B1-D699EAD8B60E |
| 158 | ON | 316 | 27888 | 5CF055E9-FC88-40AE-BAB6-71A568F183C8 |
| 159 | OFF | 317 | 27889 | AEAFAB18-3C8D-49E6-9F9E-83BA1A3A72B5 |
| 159 | ON | 318 | 27890 | 1D5F7B4C-4CF3-4353-ADED-B288C7165AAA |
| 160 | OFF | 319 | 27891 | DBDE03F0-C679-415C-9740-E7A1CAE89EE9 |
| 160 | ON | 320 | 27893 | 9651413E-834A-4971-BF76-CDC40CD6B9AA |
| 161 | OFF | 321 | 27894 | F4F2D799-9E6D-4D8B-ACCD-154897C1C34C |
| 161 | ON | 322 | 27895 | 029FE963-0120-4FB9-A01A-A5527C83E829 |
| 162 | OFF | 323 | 27896 | 677135C3-276C-486D-9E52-A635BB6B06E4 |
| 162 | ON | 324 | 27897 | 2B222FF8-D19B-4715-A489-A0AF80EA22DA |
| 163 | OFF | 325 | 27898 | 3D901811-DA15-4E67-9483-6FFA1AFD7D0C |
| 163 | ON | 326 | 27899 | C3F77A21-73C7-4FD0-A060-4152FE49DEE0 |
| 164 | OFF | 327 | 27900 | 46153566-DA90-46AD-A341-33A6672237A4 |
| 164 | ON | 328 | 27902 | 344AD804-2185-48CA-8929-D66574F1019C |
| 165 | OFF | 329 | 27903 | C80175B3-0080-45C0-9B34-F6A691BDC471 |
| 165 | ON | 330 | 27904 | D435BAC2-31CD-4802-AA85-FC2F174B43B8 |
| 166 | OFF | 331 | 27905 | C7C0DEDD-B5BA-461B-92D0-22FF0240C7BA |
| 166 | ON | 332 | 27906 | 0C995DC4-B87E-4A8A-95FB-64378DE7DB44 |
| 167 | OFF | 333 | 27907 | C2E216E0-6AB5-43EB-84F5-44E1C66BFE89 |
| 167 | ON | 334 | 27908 | 446DD734-C5DC-459B-9553-57A433E3371A |
| 168 | OFF | 335 | 27909 | DFD8F034-D108-4004-A741-97849EDC0FBF |
| 168 | ON | 336 | 27911 | 0C8B5404-03CB-40DA-8FB8-652F939B7D11 |
| 169 | OFF | 337 | 27912 | 0C1B1BFF-1CEE-43A6-91AC-EDE94BC01FD0 |
| 169 | ON | 338 | 27913 | 88AB84B6-361A-4251-B3B1-40334EB3396B |
| 170 | OFF | 339 | 27914 | 190191C2-1638-40E3-BA65-58E744684BDF |
| 170 | ON | 340 | 27915 | 95B4BEF4-4757-496D-82C5-EDEED9B29438 |
| 171 | OFF | 341 | 27916 | 2C7EB997-03C1-4623-968D-6A54E4FABA74 |
| 171 | ON | 342 | 27917 | 8DAE3853-4134-4F18-983E-D5A33FED56EE |
| 172 | OFF | 343 | 27918 | A033E603-CB24-43A2-9879-10EAE0842410 |
| 172 | ON | 344 | 27919 | 7ECAA68D-77CA-44FE-A424-D9D1ACF1AC51 |
| 173 | OFF | 345 | 27921 | E59293E1-3EED-4BFB-8023-48FEC8AE9D11 |
| 173 | ON | 346 | 27922 | 1C10130F-53FE-4F74-AC1E-67B83D373049 |
| 174 | OFF | 347 | 27923 | 9EA7CC38-8322-49A4-B744-6597114429B4 |
| 174 | ON | 348 | 27924 | 017F734B-81DB-4EA9-8B90-330541C48290 |
| 175 | OFF | 349 | 27925 | 74054D53-4624-4780-828D-0821AEF74CB7 |
| 175 | ON | 350 | 27926 | 005EED0A-753F-4880-9C7B-D32E3A36B0C7 |
| 176 | OFF | 351 | 27927 | E875E659-6D9C-4642-9BE0-5F61A2F221F8 |
| 176 | ON | 352 | 27928 | 094078FF-6970-4B86-9F79-705566225CEF |
| 177 | OFF | 353 | 27930 | 2A6841A3-FE6C-4675-B736-D7D58FC6ACF1 |
| 177 | ON | 354 | 27931 | FAA405AF-4288-4F2C-9465-0BF1A37B9030 |
| 178 | OFF | 355 | 27932 | AD9E2A0B-3912-463F-8782-A2318E55A6F0 |
| 178 | ON | 356 | 27933 | 90255088-D225-4250-9886-99F20E7B957F |
| 179 | OFF | 357 | 27934 | A8CCA3B5-B5E3-4913-8397-22D1315E1109 |
| 179 | ON | 358 | 27935 | 6CAFF194-8DEE-4FC3-8C9D-B1BAC63FF84A |
| 180 | OFF | 359 | 27936 | 21EF7987-16A1-4A56-8642-497B9EE3B43C |
| 180 | ON | 360 | 27937 | 857CEF75-D29A-4B24-857C-359BB179462C |
| 181 | OFF | 361 | 27939 | F7178F95-7689-4A87-92CB-0A09F596C175 |
| 181 | ON | 362 | 27940 | 65A7561B-AE1A-4DBF-8FBA-52E25797D824 |
| 182 | OFF | 363 | 27941 | 804C31CB-20A5-4DDB-94BB-6C420163BC99 |
| 182 | ON | 364 | 27942 | EB8DB575-9D6F-4258-94D4-EE66D0916ABC |
| 183 | OFF | 365 | 27943 | 4FAB2260-5112-43E3-9C9B-80612CBD5665 |
| 183 | ON | 366 | 27944 | 0CB8C59B-C492-448C-A203-BCA99435FBE7 |
| 184 | OFF | 367 | 27945 | 7DDFA8CF-0CB2-4271-9132-D64254FD7635 |
| 184 | ON | 368 | 27946 | 7ECCBB0A-5FFF-4569-8852-E3EEDA947E02 |
| 185 | OFF | 369 | 27948 | D1320415-28DD-46E9-9F53-9C4B3EDB86C8 |
| 185 | ON | 370 | 27949 | A122B170-6E02-409A-BFBD-D2A474D4C0A7 |
| 186 | OFF | 371 | 27950 | C9FA66E6-C74A-4614-AEBE-91432BF6A273 |
| 186 | ON | 372 | 27951 | 072E2F77-AFAA-4096-B2D7-C2520D9275BB |
| 187 | OFF | 373 | 27952 | 39618E6A-728B-4110-914C-E8F8D38BE092 |
| 187 | ON | 374 | 27953 | A29C2A9E-8401-4FB0-A363-7D9DA4709134 |
| 188 | OFF | 375 | 27954 | 1986C854-AD7F-4868-92C8-265A23426A04 |
| 188 | ON | 376 | 27955 | C8C80D53-0BDA-40A3-967E-6E1606C4F414 |
| 189 | OFF | 377 | 27957 | 17999E5D-CDCD-4110-97E6-0ABDACCCBA8E |
| 189 | ON | 378 | 27958 | AE34D1A9-0934-4867-B4FF-C842CD98E317 |
| 190 | OFF | 379 | 27959 | 33890AE0-FB85-4295-BB00-85D1FB4C7A9E |
| 190 | ON | 380 | 27960 | A3FAF3DB-8C40-4A29-893D-EA381A465A67 |
| 191 | OFF | 381 | 27961 | E5AE4047-645E-44E4-8FB8-1C0932A1BDCC |
| 191 | ON | 382 | 27962 | 054D49D0-5BE5-4754-B681-4BF4FF90E33A |
| 192 | OFF | 383 | 27963 | AB817DE7-96F1-4F62-A305-62329FF7DCAA |
| 192 | ON | 384 | 27964 | DDF1E94F-B507-4BF9-9B6A-61B37907B95C |
| 193 | OFF | 385 | 27966 | EC38ABA2-4996-4C92-A984-8EC4B08F7FF5 |
| 193 | ON | 386 | 27967 | 3C87F791-7361-42FE-BDFC-3C0596240F08 |
| 194 | OFF | 387 | 27968 | 174FF0B5-2A96-44C0-986C-5DBE179F2501 |
| 194 | ON | 388 | 27969 | 4FE5526F-FCCC-4FC9-8C87-ACFD2A81634B |
| 195 | OFF | 389 | 27970 | 70620AE4-F9BF-4F5B-AD7F-8A8CB1DF961B |
| 195 | ON | 390 | 27971 | DF547F22-3C94-42FD-A2E8-4852BA0ADDEE |
| 196 | OFF | 391 | 27972 | 1A434A96-3A71-4DA6-AB31-EFE97A4C3D17 |
| 196 | ON | 392 | 27973 | 973687D1-C577-4C51-BDFD-7395229CE4B3 |
| 197 | OFF | 393 | 27975 | 9917F2C8-0E69-4550-8B47-4B883B4415AD |
| 197 | ON | 394 | 27976 | 0768E360-0C60-45CF-BF16-E29FF3BED809 |
| 198 | OFF | 395 | 27977 | 10222457-5BBB-41BA-A5B3-A2DC78414322 |
| 198 | ON | 396 | 27978 | 46A7C69C-ACC9-46EB-B60B-69902F07FCB7 |
| 199 | OFF | 397 | 27979 | 976ACB7E-966E-4928-9542-28ED22D51CDF |
| 199 | ON | 398 | 27980 | 0143A87E-12C3-402D-B5FB-3624B1190540 |
| 200 | OFF | 399 | 27981 | A3021EB9-7B0B-4DDF-8516-2222AEDA84E4 |
| 200 | ON | 400 | 27982 | 6A86555D-3FAF-4991-A941-E5A8CC19E820 |
| 201 | OFF | 401 | 27984 | 6474E0F5-79CD-4025-A20E-D46D10492AB3 |
| 201 | ON | 402 | 27985 | B66DC445-5D93-42FF-948D-71C0AC9F3915 |
| 202 | OFF | 403 | 27986 | 54CD8686-970C-416C-8AE4-6F43AF455FA5 |
| 202 | ON | 404 | 27987 | D6A34877-CAB5-42E3-B831-2064D04A6611 |
| 203 | OFF | 405 | 27988 | B0F29EBA-C96E-4426-9E30-22CB492F5E11 |
| 203 | ON | 406 | 27989 | 3172F4AD-D29C-4E72-B6A0-C303EEE0D272 |
| 204 | OFF | 407 | 27990 | 0A88838A-F2E5-467E-BF12-9AD9A36CFCDC |
| 204 | ON | 408 | 27991 | 6B7B8342-8AB3-4A33-87CA-E59026BAA96E |
| 205 | OFF | 409 | 27992 | DFB553D0-998E-471E-807D-C512206D3252 |
| 205 | ON | 410 | 27994 | 6A31E6B1-0CD9-4850-9581-6CF77BD4843B |
| 206 | OFF | 411 | 27995 | EC478E3B-ABB1-47ED-B07D-E06607B03E6D |
| 206 | ON | 412 | 27996 | 45F0BD29-FA5C-40C5-BD12-E16095FAF82F |
| 207 | OFF | 413 | 27997 | B518FE31-B0C5-4F72-8AE4-47FFEC65B11E |
| 207 | ON | 414 | 27998 | 70405585-DE56-4B7E-9CBA-517A925758C3 |
| 208 | OFF | 415 | 27999 | 1411A675-9AEF-471A-A01B-71D983AA60D0 |
| 208 | ON | 416 | 28000 | 957C0C4C-6F45-405F-B010-8607BD5BB908 |
| 209 | OFF | 417 | 28001 | 69A8BA83-5A39-4F9F-AE48-56ACEA38A895 |
| 209 | ON | 418 | 28003 | A4621B35-21FC-4D9B-9A22-8199133401DF |
| 210 | OFF | 419 | 28004 | C40AAF76-6CB9-46EB-8669-95817BA4FC27 |
| 210 | ON | 420 | 28005 | 4536F9B9-700F-4FAA-83F2-D04CE99B3EA9 |
| 211 | OFF | 421 | 28006 | D723BC2F-9FCA-4CD4-8B0D-B33D9519674F |
| 211 | ON | 422 | 28007 | 9543402E-BCB1-43F4-BAD0-3C99E7A528C3 |
| 212 | OFF | 423 | 28008 | DB35E605-AF50-404E-918E-DDA767D8031A |
| 212 | ON | 424 | 28009 | 7D2DF368-6F44-46C2-822E-0FC32DC9ABFA |
| 213 | OFF | 425 | 28010 | C72CA9B3-8690-4EB5-9341-000CD0173FBC |
| 213 | ON | 426 | 28012 | 30789366-8F6F-4CCE-A5B8-41687FCDAFC0 |
| 214 | OFF | 427 | 28013 | CABA6F98-D4A1-475D-BAEF-29E176610AAE |
| 214 | ON | 428 | 28014 | 7ED11F2E-1277-4A5B-922C-08FB7C89F57C |
| 215 | OFF | 429 | 28015 | FAFA1D61-2CFA-43AD-B237-52812B8C2598 |
| 215 | ON | 430 | 28016 | 7A9CF127-3BE7-409C-A79C-E22D83251D1A |
| 216 | OFF | 431 | 28017 | 4A7A2309-21CD-4CB9-ADD8-5ADCCEA43C8F |
| 216 | ON | 432 | 28018 | 5898BF31-A24B-4CFB-83A4-7F5E4D9CEE9F |
| 217 | OFF | 433 | 28019 | CF38D3C7-8FE6-4E79-9203-D842671BD131 |
| 217 | ON | 434 | 28021 | 8D2FB177-0FCD-4827-8C8F-A91E7792D240 |
| 218 | OFF | 435 | 28022 | 4D0D3B8A-A822-4D5C-B71F-3CD6B4ACC93E |
| 218 | ON | 436 | 28023 | 31E7D6D9-B14D-4D49-978A-604C21E37350 |
| 219 | OFF | 437 | 28024 | 2CFCB1E7-E074-4A78-B600-11694FC60367 |
| 219 | ON | 438 | 28025 | 1EF2C872-B3E3-428B-B5B2-B528E1C47582 |
| 220 | OFF | 439 | 28026 | 44A51BE0-A9CE-495F-87A2-B46B1179A750 |
| 220 | ON | 440 | 28027 | 20D992F9-F300-4B35-AE28-91983CD1188B |
| 221 | OFF | 441 | 28029 | 6758A717-8185-43B4-BC3C-188A1BD72A01 |
| 221 | ON | 442 | 28030 | 4517FCC5-C3AF-49E0-83FE-9B21BDE2B5D5 |
| 222 | OFF | 443 | 28031 | E0AEADB0-C0B0-481A-AE12-E863A4470020 |
| 222 | ON | 444 | 28032 | 513C78B4-FEF0-4F56-A63F-3A7F9B913FF3 |
| 223 | OFF | 445 | 28033 | 33B6F14B-AF08-49BA-9231-4D7F6DD5E7DA |
| 223 | ON | 446 | 28034 | F547DBE2-F0B3-4BCD-BF52-7F68850F24E7 |
| 224 | OFF | 447 | 28035 | 039937A8-0FB3-4EE0-97FD-61F3ED8CB0B0 |
| 224 | ON | 448 | 28036 | 2EC901AA-4542-4783-B2E8-29FDD13A4E9F |
| 225 | OFF | 449 | 28037 | 1F91BB4F-2CC8-49CE-B3C6-103EBF5A3B1F |
| 225 | ON | 450 | 28039 | C11F1C43-EAC0-4133-B596-34FE99162E32 |
| 226 | OFF | 451 | 28040 | 8029D5FC-411B-455A-9AB4-03EBB92017C4 |
| 226 | ON | 452 | 28041 | CC96ACC5-BFAC-4E54-BE2C-A8FDB91F3A3A |
| 227 | OFF | 453 | 28042 | CC3E07BD-40E2-464B-BD27-63241F7D00D3 |
| 227 | ON | 454 | 28043 | BD6E1265-35C3-4C55-AA85-0ED5F8873893 |
| 228 | OFF | 455 | 28044 | B373FCEA-A7E3-48E4-BA1F-1935CDB3A49D |
| 228 | ON | 456 | 28045 | 0E5B5A43-C353-4500-BCC8-E382BD05B88E |
| 229 | OFF | 457 | 28046 | 452B9F98-9C09-43FE-8631-B9ACAB27B6B2 |
| 229 | ON | 458 | 28048 | C40F4BF0-8384-4F11-BAD5-669B16C88FAD |
| 230 | OFF | 459 | 28049 | 99E8FC8A-AD86-48F1-943B-FD117CB99BC7 |
| 230 | ON | 460 | 28050 | 55740BEC-DDDA-462B-830F-A0ADD67FF7A8 |
| 231 | OFF | 461 | 28051 | D6F8D65D-A9D0-4EB7-A0D2-381DD23A32E6 |
| 231 | ON | 462 | 28052 | 9F4B46A6-7772-4EFD-BB50-570D200FBAE0 |
| 232 | OFF | 463 | 28053 | 69693930-EE93-4BB1-80EC-1C523414FF65 |
| 232 | ON | 464 | 28054 | 57BEC868-10BE-431E-98CC-E874C1A9BE51 |
| 233 | OFF | 465 | 28055 | A842F359-0322-45D8-BC5F-300905283FC6 |
| 233 | ON | 466 | 28057 | 5BE788DE-0FD3-4CB6-A1E7-53FF941AED07 |
| 234 | OFF | 467 | 28058 | 72C5CAE9-06F5-48DD-8F69-68ED556A9A2B |
| 234 | ON | 468 | 28059 | DF309D7E-8950-4EEA-B9C0-B87D9F8B072A |
| 235 | OFF | 469 | 28060 | 53DDD69F-8D92-49AB-88DA-9E371BB8B702 |
| 235 | ON | 470 | 28061 | AADE89AD-33E2-44F0-8724-F13E67960D06 |
| 236 | OFF | 471 | 28062 | F20ED457-12C5-4E0D-B7AC-4E1858274A6D |
| 236 | ON | 472 | 28063 | 18BEBFCB-3080-49D0-BDC5-6D5F4C4468F4 |
| 237 | OFF | 473 | 28064 | F2E53D44-5110-4FA8-A1BF-1608D90077B4 |
| 237 | ON | 474 | 28066 | 2176FC88-3526-442C-A6D1-75CC25A8BA53 |
| 238 | OFF | 475 | 28067 | D474AF7F-6841-427A-931C-E1A75564EEC1 |
| 238 | ON | 476 | 28068 | 03703CB6-3E8D-4D11-B79B-537A564F72AF |
| 239 | OFF | 477 | 28069 | E7DFF8F0-FEDD-4094-AD46-35B9266286D9 |
| 239 | ON | 478 | 28070 | F33BF90B-0EB7-427D-A41C-48E2B125B5DF |
| 240 | OFF | 479 | 28071 | 9EEAA675-DA44-42B3-9A2F-64AF6B30ED80 |
| 240 | ON | 480 | 28072 | 79543B6F-F7E1-41E2-88FA-991A241474A9 |
| 241 | OFF | 481 | 28073 | A5F3FF8E-0E19-41D3-A97B-F39B56C51400 |
| 241 | ON | 482 | 28075 | A117CA47-F865-4E81-9471-E4858B655CEC |
| 242 | OFF | 483 | 28076 | CD67D110-F232-4A9B-9E89-9D4010C001A6 |
| 242 | ON | 484 | 28077 | 64CB4FB9-6DBF-4EA0-9908-AE9CD2A3D2EC |
| 243 | OFF | 485 | 28078 | 8D384B6B-8530-4981-B859-270B28BB6591 |
| 243 | ON | 486 | 28079 | C3FD4E97-2EC8-4991-9471-5FB6F9F99667 |
| 244 | OFF | 487 | 28080 | FC694C70-8BAE-42E5-AA92-5578B9DA82F6 |
| 244 | ON | 488 | 28081 | 414F055D-867D-45AB-9CDE-EA310E70B000 |
| 245 | OFF | 489 | 28082 | 292A6642-21EB-4BBD-9772-FD16CDE95FC0 |
| 245 | ON | 490 | 28083 | A95BED2F-5B13-4EE8-8A31-E0CD04CFED7A |
| 246 | OFF | 491 | 28085 | 6BBE1785-7647-43BD-BE13-A27A48299436 |
| 246 | ON | 492 | 28086 | 9BC12937-A65D-4B81-8BB2-1DEAEF5FCA40 |
| 247 | OFF | 493 | 28087 | 046FA752-1035-4A6D-B854-FF91899CA9A1 |
| 247 | ON | 494 | 28088 | 725246C1-B929-44FE-8A06-9060F0A7CF29 |
| 248 | OFF | 495 | 28089 | 794D5147-46E6-4DBF-86FB-D30C30A3695A |
| 248 | ON | 496 | 28090 | 7EBBC18D-87B9-4F53-846B-CB52DF1570B0 |
| 249 | OFF | 497 | 28091 | EC37EB1E-F19A-45AC-9626-1DE2D91EBCFC |
| 249 | ON | 498 | 28092 | 6249ADCC-7FA2-4679-82F7-9EFCB279398D |
| 250 | OFF | 499 | 28094 | EE302FF4-2D94-49C2-A4DA-A98D9BCB9964 |
| 250 | ON | 500 | 28095 | AA187E54-5C0F-45B0-BBBD-F91DA77C1876 |
