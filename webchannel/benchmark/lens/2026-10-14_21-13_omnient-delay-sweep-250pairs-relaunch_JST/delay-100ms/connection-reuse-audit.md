# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 109.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 241.000 | 221.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 243.000 | 211.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 35.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 41.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 96.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 63.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 400 | handshake | h2 | false | 135.000 | 92.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 111.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 70.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 69.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 42.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 72.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 187.000 | 146.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 400 | handshake | h2 | false | 185.000 | 131.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 86.000 | 63.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 400 | handshake | h2 | false | 114.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 226.000 | 199.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 32.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 65.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 118.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 72.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 80.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 74.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 49.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 46.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 74.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 49.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 40.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 65.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 90.000 | 68.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 400 | handshake | h2 | false | 71.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 40.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 39.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 49.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 51.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 122.000 | 99.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 58.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 84.000 | 64.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 56.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 36.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 85.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 45.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 98.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 91.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 63.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 39.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 37.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 51.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 32.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 33.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 42.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 84.000 | 72.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 97.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 43.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 56.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 56.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 68.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 182.000 | 153.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 36.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 78.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 52.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 54.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 76.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 46.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | handshake | h2 | false | 64.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 32.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 48.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 51.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 82.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 77.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 62.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 77.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 104.000 | 80.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 50.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 89.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 72.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 50.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 50.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 33.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 34.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 58.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 61.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 78.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 72.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 200 | handshake | h2 | false | 48.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 38.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 128.000 | 109.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 37.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 58.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 55.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 46.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 37.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 44.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 43.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | handshake | h2 | false | 37.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 79.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 75.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 64.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 37.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 67.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 46.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 80.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 46.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 33.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 53.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 53.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 45.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 400 | handshake | h2 | false | 98.000 | 79.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 68.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 50.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 126.000 | 101.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 47.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 40.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 37.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 81.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 72.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 47.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 45.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 400 | handshake | h2 | false | 163.000 | 105.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 83.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 50.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 99.000 | 77.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 52.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | OFF | completed | — | handshake | h2 | false | 48.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | OFF | completed | — | handshake | h2 | false | 67.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | ON | completed | 200 | handshake | h2 | false | 116.000 | 96.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | OFF | completed | — | handshake | h2 | false | 58.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | ON | completed | 200 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | ON | completed | 200 | handshake | h2 | false | 37.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | OFF | completed | — | handshake | h2 | false | 47.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | ON | completed | 200 | handshake | h2 | false | 55.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | OFF | completed | — | handshake | h2 | false | 41.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | ON | completed | 400 | handshake | h2 | false | 116.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | OFF | completed | — | handshake | h2 | false | 134.000 | 115.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | ON | completed | 200 | handshake | h2 | false | 37.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | ON | completed | 200 | handshake | h2 | false | 43.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | ON | completed | 200 | handshake | h2 | false | 44.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | OFF | completed | — | handshake | h2 | false | 135.000 | 78.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | ON | completed | 200 | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | OFF | completed | — | handshake | h2 | false | 51.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | ON | completed | 200 | handshake | h2 | false | 71.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | OFF | completed | — | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | ON | completed | 200 | handshake | h2 | false | 41.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | OFF | completed | — | handshake | h2 | false | 118.000 | 102.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | ON | completed | 200 | handshake | h2 | false | 42.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | OFF | completed | — | handshake | h2 | false | 63.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | ON | completed | 400 | handshake | h2 | false | 102.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | OFF | completed | — | handshake | h2 | false | 36.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | ON | completed | 200 | handshake | h2 | false | 77.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | ON | completed | 200 | handshake | h2 | false | 94.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | OFF | completed | — | handshake | h2 | false | 69.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | ON | completed | 200 | handshake | h2 | false | 51.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | ON | completed | 200 | handshake | h2 | false | 47.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | ON | completed | 400 | handshake | h2 | false | 69.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | ON | completed | 200 | handshake | h2 | false | 78.000 | 63.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | OFF | completed | — | handshake | h2 | false | 35.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | OFF | completed | — | handshake | h2 | false | 55.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | ON | completed | 200 | handshake | h2 | false | 34.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 127 | OFF | completed | — | handshake | h2 | false | 56.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 127 | ON | completed | 200 | handshake | h2 | false | 49.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 128 | OFF | completed | — | handshake | h2 | false | 41.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 128 | ON | completed | 200 | handshake | h2 | false | 56.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 129 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 129 | ON | completed | 200 | handshake | h2 | false | 41.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 130 | OFF | completed | — | handshake | h2 | false | 60.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 130 | ON | completed | 400 | handshake | h2 | false | 55.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 131 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 131 | ON | completed | 200 | handshake | h2 | false | 40.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 132 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 132 | ON | completed | 200 | handshake | h2 | false | 50.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 133 | OFF | completed | — | handshake | h2 | false | 86.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 133 | ON | completed | 200 | handshake | h2 | false | 42.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 134 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 134 | ON | completed | 200 | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 135 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 135 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 136 | OFF | completed | — | handshake | h2 | false | 46.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 136 | ON | completed | 200 | handshake | h2 | false | 92.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 137 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 137 | ON | completed | 200 | handshake | h2 | false | 65.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 138 | OFF | completed | — | handshake | h2 | false | 54.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 138 | ON | completed | 200 | handshake | h2 | false | 42.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 139 | OFF | completed | — | handshake | h2 | false | 33.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 139 | ON | completed | 200 | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 140 | OFF | completed | — | handshake | h2 | false | 80.000 | 71.000 | 2404:6800:400b:c019::451 |
| omnient | 140 | ON | completed | 400 | handshake | h2 | false | 72.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 141 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 141 | ON | completed | 200 | handshake | h2 | false | 45.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 142 | OFF | completed | — | handshake | h2 | false | 65.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 142 | ON | completed | unknown | handshake | h2 | false | 47.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 143 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 143 | ON | completed | 200 | handshake | h2 | false | 70.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 144 | OFF | completed | — | handshake | h2 | false | 46.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 144 | ON | completed | 200 | handshake | h2 | false | 50.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 145 | OFF | completed | — | handshake | h2 | false | 69.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 145 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 146 | OFF | completed | — | handshake | h2 | false | 72.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 146 | ON | completed | 200 | handshake | h2 | false | 73.000 | 63.000 | 2404:6800:400b:c019::451 |
| omnient | 147 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 147 | ON | completed | 200 | handshake | h2 | false | 43.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 148 | OFF | completed | — | handshake | h2 | false | 50.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 148 | ON | completed | 200 | handshake | h2 | false | 47.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 149 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 149 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 150 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 150 | ON | completed | 200 | handshake | h2 | false | 38.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 151 | OFF | completed | — | handshake | h2 | false | 60.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 151 | ON | completed | 200 | handshake | h2 | false | 35.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 152 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 152 | ON | completed | 400 | handshake | h2 | false | 536.000 | 497.000 | 2404:6800:400b:c019::451 |
| omnient | 153 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 153 | ON | completed | 200 | handshake | h2 | false | 85.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 154 | OFF | completed | — | handshake | h2 | false | 63.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 154 | ON | completed | 200 | handshake | h2 | false | 34.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 155 | OFF | completed | — | handshake | h2 | false | 181.000 | 125.000 | 2404:6800:400b:c019::451 |
| omnient | 155 | ON | completed | 200 | handshake | h2 | false | 40.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 156 | OFF | completed | — | handshake | h2 | false | 49.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 156 | ON | completed | 200 | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 157 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 157 | ON | completed | 200 | handshake | h2 | false | 59.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 158 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 158 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 159 | OFF | completed | — | handshake | h2 | false | 93.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 159 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 160 | OFF | completed | — | handshake | h2 | false | 60.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 160 | ON | completed | 200 | handshake | h2 | false | 94.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 161 | OFF | completed | — | handshake | h2 | false | 86.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 161 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 162 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 162 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 163 | OFF | completed | — | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 163 | ON | completed | 200 | handshake | h2 | false | 32.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 164 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 164 | ON | completed | 200 | handshake | h2 | false | 76.000 | 63.000 | 2404:6800:400b:c019::451 |
| omnient | 165 | OFF | completed | — | handshake | h2 | false | 102.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 165 | ON | completed | 200 | handshake | h2 | false | 54.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 166 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 166 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 167 | OFF | completed | — | handshake | h2 | false | 54.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 167 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 168 | OFF | completed | — | handshake | h2 | false | 84.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 168 | ON | completed | 400 | handshake | h2 | false | 424.000 | 410.000 | 2404:6800:400b:c019::451 |
| omnient | 169 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 169 | ON | completed | 200 | handshake | h2 | false | 80.000 | 57.000 | 2404:6800:400b:c019::451 |
| omnient | 170 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 170 | ON | completed | 200 | handshake | h2 | false | 66.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 171 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 171 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 172 | OFF | completed | — | handshake | h2 | false | 53.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 172 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 173 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 173 | ON | completed | 200 | handshake | h2 | false | 41.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 174 | OFF | completed | — | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 174 | ON | completed | 200 | handshake | h2 | false | 54.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 175 | OFF | completed | — | handshake | h2 | false | 74.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 175 | ON | completed | 400 | handshake | h2 | false | 114.000 | 80.000 | 2404:6800:400b:c019::451 |
| omnient | 176 | OFF | completed | — | handshake | h2 | false | 56.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 176 | ON | completed | 200 | handshake | h2 | false | 62.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 177 | OFF | completed | — | handshake | h2 | false | 54.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 177 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 178 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 178 | ON | completed | 400 | handshake | h2 | false | 77.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 179 | OFF | completed | — | handshake | h2 | false | 56.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 179 | ON | completed | 200 | handshake | h2 | false | 78.000 | 64.000 | 2404:6800:400b:c019::451 |
| omnient | 180 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 180 | ON | completed | 200 | handshake | h2 | false | 45.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 181 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 181 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 182 | OFF | completed | — | handshake | h2 | false | 76.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 182 | ON | completed | 200 | handshake | h2 | false | 56.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 183 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 183 | ON | completed | 200 | handshake | h2 | false | 56.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 184 | OFF | completed | — | handshake | h2 | false | 57.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 184 | ON | completed | 200 | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 185 | OFF | completed | — | handshake | h2 | false | 41.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 185 | ON | completed | 200 | handshake | h2 | false | 106.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 186 | OFF | completed | — | handshake | h2 | false | 154.000 | 121.000 | 2404:6800:400b:c019::451 |
| omnient | 186 | ON | completed | 200 | handshake | h2 | false | 76.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 187 | OFF | completed | — | handshake | h2 | false | 58.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 187 | ON | completed | 200 | handshake | h2 | false | 50.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 188 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 188 | ON | completed | 200 | handshake | h2 | false | 58.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 189 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 189 | ON | completed | 200 | handshake | h2 | false | 60.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 190 | OFF | completed | — | handshake | h2 | false | 49.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 190 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 191 | OFF | completed | — | handshake | h2 | false | 56.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 191 | ON | completed | 200 | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 192 | OFF | completed | — | handshake | h2 | false | 96.000 | 72.000 | 2404:6800:400b:c019::451 |
| omnient | 192 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 193 | OFF | completed | — | handshake | h2 | false | 84.000 | 66.000 | 2404:6800:400b:c019::451 |
| omnient | 193 | ON | completed | 200 | handshake | h2 | false | 46.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 194 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 194 | ON | completed | 200 | handshake | h2 | false | 130.000 | 108.000 | 2404:6800:400b:c019::451 |
| omnient | 195 | OFF | completed | — | handshake | h2 | false | 77.000 | 61.000 | 2404:6800:400b:c019::451 |
| omnient | 195 | ON | completed | 200 | handshake | h2 | false | 52.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 196 | OFF | completed | — | handshake | h2 | false | 63.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 196 | ON | completed | 200 | handshake | h2 | false | 58.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 197 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 197 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 198 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 198 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 199 | OFF | completed | — | handshake | h2 | false | 91.000 | 62.000 | 2404:6800:400b:c019::451 |
| omnient | 199 | ON | completed | 400 | handshake | h2 | false | 107.000 | 96.000 | 2404:6800:400b:c019::451 |
| omnient | 200 | OFF | completed | — | handshake | h2 | false | 57.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 200 | ON | completed | 200 | handshake | h2 | false | 40.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 201 | OFF | completed | — | handshake | h2 | false | 66.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 201 | ON | completed | 200 | handshake | h2 | false | 36.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 202 | OFF | completed | — | handshake | h2 | false | 61.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 202 | ON | completed | 200 | handshake | h2 | false | 76.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 203 | OFF | completed | — | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 203 | ON | completed | 200 | handshake | h2 | false | 71.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 204 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 204 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 205 | OFF | completed | — | handshake | h2 | false | 48.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 205 | ON | completed | 200 | handshake | h2 | false | 41.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 206 | OFF | completed | — | handshake | h2 | false | 67.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 206 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 207 | OFF | completed | — | handshake | h2 | false | 56.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 207 | ON | completed | 400 | handshake | h2 | false | 152.000 | 95.000 | 2404:6800:400b:c019::451 |
| omnient | 208 | OFF | completed | — | handshake | h2 | false | 62.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 208 | ON | completed | 200 | handshake | h2 | false | 88.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 209 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 209 | ON | completed | 200 | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 210 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 210 | ON | completed | 200 | handshake | h2 | false | 56.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 211 | OFF | completed | — | handshake | h2 | false | 91.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 211 | ON | completed | 200 | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 212 | OFF | completed | — | handshake | h2 | false | 79.000 | 65.000 | 2404:6800:400b:c019::451 |
| omnient | 212 | ON | completed | unknown | handshake | h2 | false | 84.000 | 72.000 | 2404:6800:400b:c019::451 |
| omnient | 213 | OFF | completed | — | handshake | h2 | false | 72.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 213 | ON | completed | 200 | handshake | h2 | false | 77.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 214 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 214 | ON | completed | 200 | handshake | h2 | false | 73.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 215 | OFF | completed | — | handshake | h2 | false | 38.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 215 | ON | completed | 200 | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 216 | OFF | completed | — | handshake | h2 | false | 48.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 216 | ON | completed | 200 | handshake | h2 | false | 72.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 217 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 217 | ON | completed | 400 | handshake | h2 | false | 105.000 | 64.000 | 2404:6800:400b:c019::451 |
| omnient | 218 | OFF | completed | — | handshake | h2 | false | 96.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 218 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 219 | OFF | completed | — | handshake | h2 | false | 44.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 219 | ON | completed | 200 | handshake | h2 | false | 70.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 220 | OFF | completed | — | handshake | h2 | false | 68.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 220 | ON | completed | 200 | handshake | h2 | false | 89.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 221 | OFF | completed | — | handshake | h2 | false | 57.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 221 | ON | completed | 200 | handshake | h2 | false | 55.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 222 | OFF | completed | — | handshake | h2 | false | 83.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 222 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 223 | OFF | completed | — | handshake | h2 | false | 31.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 223 | ON | completed | 200 | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 224 | OFF | completed | — | handshake | h2 | false | 61.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 224 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 225 | OFF | completed | — | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 225 | ON | completed | 200 | handshake | h2 | false | 73.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 226 | OFF | completed | — | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 226 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 227 | OFF | completed | — | handshake | h2 | false | 60.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 227 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 228 | OFF | completed | — | handshake | h2 | false | 79.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 228 | ON | completed | 200 | handshake | h2 | false | 101.000 | 91.000 | 2404:6800:400b:c019::451 |
| omnient | 229 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 229 | ON | completed | 200 | handshake | h2 | false | 43.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 230 | OFF | completed | — | handshake | h2 | false | 71.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 230 | ON | completed | 200 | handshake | h2 | false | 55.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 231 | OFF | completed | — | handshake | h2 | false | 42.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 231 | ON | completed | 200 | handshake | h2 | false | 36.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 232 | OFF | completed | — | handshake | h2 | false | 44.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 232 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 233 | OFF | completed | — | handshake | h2 | false | 68.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 233 | ON | completed | 200 | handshake | h2 | false | 76.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 234 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 234 | ON | completed | 200 | handshake | h2 | false | 146.000 | 131.000 | 2404:6800:400b:c019::451 |
| omnient | 235 | OFF | completed | — | handshake | h2 | false | 50.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 235 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 236 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 236 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 237 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 237 | ON | completed | 200 | handshake | h2 | false | 74.000 | 62.000 | 2404:6800:400b:c019::451 |
| omnient | 238 | OFF | completed | — | handshake | h2 | false | 90.000 | 73.000 | 2404:6800:400b:c019::451 |
| omnient | 238 | ON | completed | 200 | handshake | h2 | false | 42.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 239 | OFF | completed | — | handshake | h2 | false | 42.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 239 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 240 | OFF | completed | — | handshake | h2 | false | 47.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 240 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 241 | OFF | completed | — | handshake | h2 | false | 67.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 241 | ON | completed | 400 | handshake | h2 | false | 85.000 | 70.000 | 2404:6800:400b:c019::451 |
| omnient | 242 | OFF | completed | — | handshake | h2 | false | 82.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 242 | ON | completed | 200 | handshake | h2 | false | 68.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 243 | OFF | completed | — | handshake | h2 | false | 45.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 243 | ON | completed | 200 | handshake | h2 | false | 159.000 | 133.000 | 2404:6800:400b:c019::451 |
| omnient | 244 | OFF | completed | — | handshake | h2 | false | 98.000 | 85.000 | 2404:6800:400b:c019::451 |
| omnient | 244 | ON | completed | 200 | handshake | h2 | false | 42.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 245 | OFF | completed | — | handshake | h2 | false | 63.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 245 | ON | completed | 200 | handshake | h2 | false | 57.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 246 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 246 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 247 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 247 | ON | completed | 200 | handshake | h2 | false | 156.000 | 136.000 | 2404:6800:400b:c019::451 |
| omnient | 248 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 248 | ON | completed | 200 | handshake | h2 | false | 64.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 249 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 249 | ON | completed | 200 | handshake | h2 | false | 57.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 250 | OFF | completed | — | handshake | h2 | false | 47.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 250 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 102.820 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 101.681 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 100.829 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 106.145 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 101.087 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 101.037 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 105.520 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 101.010 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 105.188 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 104.743 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 102.780 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 103.093 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 103.530 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 105.370 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 102.262 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 100.367 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 103.349 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 101.218 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 103.779 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 104.575 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 105.043 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 102.173 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 100.825 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 102.532 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 105.440 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 101.073 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 105.352 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 102.253 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 101.584 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 102.112 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 104.424 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 102.387 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 101.923 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 103.715 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 102.289 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 101.730 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 101.831 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 103.404 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 102.750 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 105.364 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 103.752 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 101.734 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 104.073 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 101.610 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 104.423 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 101.066 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 103.067 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 103.821 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 105.354 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 100.317 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 102.415 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 101.242 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 104.110 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 100.856 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 104.950 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 102.749 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 102.901 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 103.592 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 101.051 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 102.227 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 103.578 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 103.565 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 103.712 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 103.879 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 102.364 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 105.376 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 102.949 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 101.824 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 104.534 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 101.366 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 105.163 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 101.186 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 101.472 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 104.905 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 102.611 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 103.223 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 100.528 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 101.235 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 102.027 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 103.822 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 102.057 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 103.317 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 104.848 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 102.636 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 100.992 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 104.566 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 102.517 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 104.996 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 105.455 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 101.894 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 102.515 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 105.373 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 100.563 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 102.693 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 104.066 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 103.559 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 102.109 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 102.549 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 101.281 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 103.649 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 103.797 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 102.917 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 102.300 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 102.819 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 102.612 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 101.388 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 103.848 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 102.940 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 104.122 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 105.409 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 102.804 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 101.427 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 103.815 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 103.971 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 104.486 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 103.173 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 104.454 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 104.500 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 106.155 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 101.430 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 101.361 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 105.507 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 103.720 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 103.490 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 102.573 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 105.475 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 103.862 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 103.809 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 101.951 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 104.148 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 100.929 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 100.672 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 101.088 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 102.141 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 104.418 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 105.399 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 100.738 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 100.913 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 100.417 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 104.579 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 104.890 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 100.472 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 104.240 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 105.426 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 104.973 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 101.519 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 100.626 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 101.853 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 103.985 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 102.252 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 105.339 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 101.040 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 105.423 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 100.505 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 104.697 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 105.415 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 103.244 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 103.753 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 103.609 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 100.710 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 102.392 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 102.768 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 102.466 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 105.448 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 103.699 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 103.666 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 104.118 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 100.853 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 103.457 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 104.299 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 103.682 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 103.738 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 103.765 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 105.069 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 103.926 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 102.547 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 103.853 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 103.252 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 100.447 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 100.910 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 100.682 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 105.114 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 102.180 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 105.435 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 100.716 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 103.871 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 101.475 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 102.858 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 100.783 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 102.299 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 104.525 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 103.546 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 103.838 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 103.789 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 103.611 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 101.952 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 103.617 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 102.432 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 103.637 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 103.736 | count=0 | early POST | early POST |
| omnient | 101 | OFF | 102.250 | count=0 | post-open POST | post-open POST |
| omnient | 101 | ON | 104.207 | count=0 | early POST | early POST |
| omnient | 102 | OFF | 103.648 | count=0 | post-open POST | post-open POST |
| omnient | 102 | ON | 101.923 | count=0 | early POST | early POST |
| omnient | 103 | OFF | 100.806 | count=0 | post-open POST | post-open POST |
| omnient | 103 | ON | 103.374 | count=0 | early POST | early POST |
| omnient | 104 | OFF | 104.131 | count=0 | post-open POST | post-open POST |
| omnient | 104 | ON | 101.370 | count=0 | early POST | early POST |
| omnient | 105 | OFF | 105.363 | count=0 | post-open POST | post-open POST |
| omnient | 105 | ON | 101.302 | count=0 | early POST | early POST |
| omnient | 106 | OFF | 103.943 | count=0 | post-open POST | post-open POST |
| omnient | 106 | ON | 103.653 | count=0 | early POST | early POST |
| omnient | 107 | OFF | 102.929 | count=0 | post-open POST | post-open POST |
| omnient | 107 | ON | 102.309 | count=0 | early POST | early POST |
| omnient | 108 | OFF | 101.261 | count=0 | post-open POST | post-open POST |
| omnient | 108 | ON | 100.882 | count=0 | early POST | early POST |
| omnient | 109 | OFF | 100.519 | count=0 | post-open POST | post-open POST |
| omnient | 109 | ON | 103.633 | count=0 | early POST | early POST |
| omnient | 110 | OFF | 105.362 | count=0 | post-open POST | post-open POST |
| omnient | 110 | ON | 103.945 | count=0 | early POST | early POST |
| omnient | 111 | OFF | 103.819 | count=0 | post-open POST | post-open POST |
| omnient | 111 | ON | 100.585 | count=0 | early POST | early POST |
| omnient | 112 | OFF | 104.196 | count=0 | post-open POST | post-open POST |
| omnient | 112 | ON | 104.856 | count=0 | early POST | early POST |
| omnient | 113 | OFF | 103.271 | count=0 | post-open POST | post-open POST |
| omnient | 113 | ON | 103.135 | count=0 | early POST | early POST |
| omnient | 114 | OFF | 104.688 | count=0 | post-open POST | post-open POST |
| omnient | 114 | ON | 101.545 | count=0 | early POST | early POST |
| omnient | 115 | OFF | 105.379 | count=0 | post-open POST | post-open POST |
| omnient | 115 | ON | 103.746 | count=0 | early POST | early POST |
| omnient | 116 | OFF | 103.677 | count=0 | post-open POST | post-open POST |
| omnient | 116 | ON | 100.608 | count=0 | early POST | early POST |
| omnient | 117 | OFF | 103.483 | count=0 | post-open POST | post-open POST |
| omnient | 117 | ON | 104.076 | count=0 | early POST | early POST |
| omnient | 118 | OFF | 100.446 | count=0 | post-open POST | post-open POST |
| omnient | 118 | ON | 100.868 | count=0 | early POST | early POST |
| omnient | 119 | OFF | 105.508 | count=0 | post-open POST | post-open POST |
| omnient | 119 | ON | 103.417 | count=0 | early POST | early POST |
| omnient | 120 | OFF | 102.486 | count=0 | post-open POST | post-open POST |
| omnient | 120 | ON | 102.258 | count=0 | early POST | early POST |
| omnient | 121 | OFF | 101.339 | count=0 | post-open POST | post-open POST |
| omnient | 121 | ON | 103.757 | count=0 | early POST | early POST |
| omnient | 122 | OFF | 104.920 | count=0 | post-open POST | post-open POST |
| omnient | 122 | ON | 102.257 | count=0 | early POST | early POST |
| omnient | 123 | OFF | 103.784 | count=0 | post-open POST | post-open POST |
| omnient | 123 | ON | 104.304 | count=0 | early POST | early POST |
| omnient | 124 | OFF | 101.767 | count=0 | post-open POST | post-open POST |
| omnient | 124 | ON | 103.730 | count=0 | early POST | early POST |
| omnient | 125 | OFF | 101.486 | count=0 | post-open POST | post-open POST |
| omnient | 125 | ON | 103.411 | count=0 | early POST | early POST |
| omnient | 126 | OFF | 105.346 | count=0 | post-open POST | post-open POST |
| omnient | 126 | ON | 103.758 | count=0 | early POST | early POST |
| omnient | 127 | OFF | 108.441 | count=0 | post-open POST | post-open POST |
| omnient | 127 | ON | 101.829 | count=0 | early POST | early POST |
| omnient | 128 | OFF | 105.370 | count=0 | post-open POST | post-open POST |
| omnient | 128 | ON | 105.112 | count=0 | early POST | early POST |
| omnient | 129 | OFF | 104.231 | count=0 | post-open POST | post-open POST |
| omnient | 129 | ON | 100.870 | count=0 | early POST | early POST |
| omnient | 130 | OFF | 104.170 | count=0 | post-open POST | post-open POST |
| omnient | 130 | ON | 101.133 | count=0 | early POST | early POST |
| omnient | 131 | OFF | 102.699 | count=0 | post-open POST | post-open POST |
| omnient | 131 | ON | 103.668 | count=0 | early POST | early POST |
| omnient | 132 | OFF | 103.306 | count=0 | post-open POST | post-open POST |
| omnient | 132 | ON | 101.509 | count=0 | early POST | early POST |
| omnient | 133 | OFF | 104.940 | count=0 | post-open POST | post-open POST |
| omnient | 133 | ON | 101.490 | count=0 | early POST | early POST |
| omnient | 134 | OFF | 102.454 | count=0 | post-open POST | post-open POST |
| omnient | 134 | ON | 103.727 | count=0 | early POST | early POST |
| omnient | 135 | OFF | 106.369 | count=0 | post-open POST | post-open POST |
| omnient | 135 | ON | 102.600 | count=0 | early POST | early POST |
| omnient | 136 | OFF | 101.874 | count=0 | post-open POST | post-open POST |
| omnient | 136 | ON | 101.381 | count=0 | early POST | early POST |
| omnient | 137 | OFF | 101.778 | count=0 | post-open POST | post-open POST |
| omnient | 137 | ON | 103.455 | count=0 | early POST | early POST |
| omnient | 138 | OFF | 103.812 | count=0 | post-open POST | post-open POST |
| omnient | 138 | ON | 101.197 | count=0 | early POST | early POST |
| omnient | 139 | OFF | 104.293 | count=0 | post-open POST | post-open POST |
| omnient | 139 | ON | 103.336 | count=0 | early POST | early POST |
| omnient | 140 | OFF | 105.389 | count=0 | post-open POST | post-open POST |
| omnient | 140 | ON | 103.377 | count=0 | early POST | early POST |
| omnient | 141 | OFF | 104.581 | count=0 | post-open POST | post-open POST |
| omnient | 141 | ON | 103.646 | count=0 | early POST | early POST |
| omnient | 142 | OFF | 100.310 | count=0 | post-open POST | post-open POST |
| omnient | 142 | ON | 104.938 | count=0 | early POST | early POST |
| omnient | 143 | OFF | 102.034 | count=0 | post-open POST | post-open POST |
| omnient | 143 | ON | 101.273 | count=0 | early POST | early POST |
| omnient | 144 | OFF | 104.314 | count=0 | post-open POST | post-open POST |
| omnient | 144 | ON | 103.317 | count=0 | early POST | early POST |
| omnient | 145 | OFF | 102.775 | count=0 | post-open POST | post-open POST |
| omnient | 145 | ON | 100.806 | count=0 | early POST | early POST |
| omnient | 146 | OFF | 101.742 | count=0 | post-open POST | post-open POST |
| omnient | 146 | ON | 101.711 | count=0 | early POST | early POST |
| omnient | 147 | OFF | 105.421 | count=0 | post-open POST | post-open POST |
| omnient | 147 | ON | 103.874 | count=0 | early POST | early POST |
| omnient | 148 | OFF | 104.176 | count=0 | post-open POST | post-open POST |
| omnient | 148 | ON | 101.577 | count=0 | early POST | early POST |
| omnient | 149 | OFF | 100.703 | count=0 | post-open POST | post-open POST |
| omnient | 149 | ON | 103.148 | count=0 | early POST | early POST |
| omnient | 150 | OFF | 102.922 | count=0 | post-open POST | post-open POST |
| omnient | 150 | ON | 101.321 | count=0 | early POST | early POST |
| omnient | 151 | OFF | 105.010 | count=0 | post-open POST | post-open POST |
| omnient | 151 | ON | 102.463 | count=0 | early POST | early POST |
| omnient | 152 | OFF | 102.271 | count=0 | post-open POST | post-open POST |
| omnient | 152 | ON | 104.944 | count=0 | early POST | early POST |
| omnient | 153 | OFF | 103.691 | count=0 | post-open POST | post-open POST |
| omnient | 153 | ON | 100.790 | count=0 | early POST | early POST |
| omnient | 154 | OFF | 100.683 | count=0 | post-open POST | post-open POST |
| omnient | 154 | ON | 104.323 | count=0 | early POST | early POST |
| omnient | 155 | OFF | 102.743 | count=0 | post-open POST | post-open POST |
| omnient | 155 | ON | 103.706 | count=0 | early POST | early POST |
| omnient | 156 | OFF | 105.282 | count=0 | post-open POST | post-open POST |
| omnient | 156 | ON | 102.043 | count=0 | early POST | early POST |
| omnient | 157 | OFF | 104.044 | count=0 | post-open POST | post-open POST |
| omnient | 157 | ON | 103.587 | count=0 | early POST | early POST |
| omnient | 158 | OFF | 101.374 | count=0 | post-open POST | post-open POST |
| omnient | 158 | ON | 100.828 | count=0 | early POST | early POST |
| omnient | 159 | OFF | 100.811 | count=0 | post-open POST | post-open POST |
| omnient | 159 | ON | 105.096 | count=0 | early POST | early POST |
| omnient | 160 | OFF | 100.714 | count=0 | post-open POST | post-open POST |
| omnient | 160 | ON | 105.358 | count=0 | early POST | early POST |
| omnient | 161 | OFF | 101.759 | count=0 | post-open POST | post-open POST |
| omnient | 161 | ON | 103.793 | count=0 | early POST | early POST |
| omnient | 162 | OFF | 105.355 | count=0 | post-open POST | post-open POST |
| omnient | 162 | ON | 103.783 | count=0 | early POST | early POST |
| omnient | 163 | OFF | 102.176 | count=0 | post-open POST | post-open POST |
| omnient | 163 | ON | 103.078 | count=0 | early POST | early POST |
| omnient | 164 | OFF | 105.123 | count=0 | post-open POST | post-open POST |
| omnient | 164 | ON | 105.083 | count=0 | early POST | early POST |
| omnient | 165 | OFF | 104.632 | count=0 | post-open POST | post-open POST |
| omnient | 165 | ON | 105.351 | count=0 | early POST | early POST |
| omnient | 166 | OFF | 103.289 | count=0 | post-open POST | post-open POST |
| omnient | 166 | ON | 101.528 | count=0 | early POST | early POST |
| omnient | 167 | OFF | 102.103 | count=0 | post-open POST | post-open POST |
| omnient | 167 | ON | 103.311 | count=0 | early POST | early POST |
| omnient | 168 | OFF | 103.668 | count=0 | post-open POST | post-open POST |
| omnient | 168 | ON | 105.358 | count=0 | early POST | early POST |
| omnient | 169 | OFF | 104.895 | count=0 | post-open POST | post-open POST |
| omnient | 169 | ON | 105.133 | count=0 | early POST | early POST |
| omnient | 170 | OFF | 104.629 | count=0 | post-open POST | post-open POST |
| omnient | 170 | ON | 102.149 | count=0 | early POST | early POST |
| omnient | 171 | OFF | 100.816 | count=0 | post-open POST | post-open POST |
| omnient | 171 | ON | 103.710 | count=0 | early POST | early POST |
| omnient | 172 | OFF | 103.849 | count=0 | post-open POST | post-open POST |
| omnient | 172 | ON | 104.015 | count=0 | early POST | early POST |
| omnient | 173 | OFF | 101.762 | count=0 | post-open POST | post-open POST |
| omnient | 173 | ON | 102.117 | count=0 | early POST | early POST |
| omnient | 174 | OFF | 103.711 | count=0 | post-open POST | post-open POST |
| omnient | 174 | ON | 104.740 | count=0 | early POST | early POST |
| omnient | 175 | OFF | 100.470 | count=0 | post-open POST | post-open POST |
| omnient | 175 | ON | 101.202 | count=0 | early POST | early POST |
| omnient | 176 | OFF | 103.830 | count=0 | post-open POST | post-open POST |
| omnient | 176 | ON | 104.789 | count=0 | early POST | early POST |
| omnient | 177 | OFF | 104.416 | count=0 | post-open POST | post-open POST |
| omnient | 177 | ON | 102.965 | count=0 | early POST | early POST |
| omnient | 178 | OFF | 103.716 | count=0 | post-open POST | post-open POST |
| omnient | 178 | ON | 103.528 | count=0 | early POST | early POST |
| omnient | 179 | OFF | 103.464 | count=0 | post-open POST | post-open POST |
| omnient | 179 | ON | 103.201 | count=0 | early POST | early POST |
| omnient | 180 | OFF | 101.290 | count=0 | post-open POST | post-open POST |
| omnient | 180 | ON | 102.272 | count=0 | early POST | early POST |
| omnient | 181 | OFF | 103.160 | count=0 | post-open POST | post-open POST |
| omnient | 181 | ON | 103.847 | count=0 | early POST | early POST |
| omnient | 182 | OFF | 100.543 | count=0 | post-open POST | post-open POST |
| omnient | 182 | ON | 105.373 | count=0 | early POST | early POST |
| omnient | 183 | OFF | 104.897 | count=0 | post-open POST | post-open POST |
| omnient | 183 | ON | 102.239 | count=0 | early POST | early POST |
| omnient | 184 | OFF | 103.965 | count=0 | post-open POST | post-open POST |
| omnient | 184 | ON | 105.219 | count=0 | early POST | early POST |
| omnient | 185 | OFF | 101.919 | count=0 | post-open POST | post-open POST |
| omnient | 185 | ON | 105.398 | count=0 | early POST | early POST |
| omnient | 186 | OFF | 102.297 | count=0 | post-open POST | post-open POST |
| omnient | 186 | ON | 102.155 | count=0 | early POST | early POST |
| omnient | 187 | OFF | 100.608 | count=0 | post-open POST | post-open POST |
| omnient | 187 | ON | 103.609 | count=0 | early POST | early POST |
| omnient | 188 | OFF | 105.239 | count=0 | post-open POST | post-open POST |
| omnient | 188 | ON | 103.755 | count=0 | early POST | early POST |
| omnient | 189 | OFF | 102.925 | count=0 | post-open POST | post-open POST |
| omnient | 189 | ON | 102.233 | count=0 | early POST | early POST |
| omnient | 190 | OFF | 104.836 | count=0 | post-open POST | post-open POST |
| omnient | 190 | ON | 105.448 | count=0 | early POST | early POST |
| omnient | 191 | OFF | 103.231 | count=0 | post-open POST | post-open POST |
| omnient | 191 | ON | 103.163 | count=0 | early POST | early POST |
| omnient | 192 | OFF | 101.958 | count=0 | post-open POST | post-open POST |
| omnient | 192 | ON | 103.343 | count=0 | early POST | early POST |
| omnient | 193 | OFF | 104.376 | count=0 | post-open POST | post-open POST |
| omnient | 193 | ON | 101.633 | count=0 | early POST | early POST |
| omnient | 194 | OFF | 103.772 | count=0 | post-open POST | post-open POST |
| omnient | 194 | ON | 105.353 | count=0 | early POST | early POST |
| omnient | 195 | OFF | 101.177 | count=0 | post-open POST | post-open POST |
| omnient | 195 | ON | 103.447 | count=0 | early POST | early POST |
| omnient | 196 | OFF | 102.473 | count=0 | post-open POST | post-open POST |
| omnient | 196 | ON | 100.941 | count=0 | early POST | early POST |
| omnient | 197 | OFF | 103.607 | count=0 | post-open POST | post-open POST |
| omnient | 197 | ON | 103.959 | count=0 | early POST | early POST |
| omnient | 198 | OFF | 105.371 | count=0 | post-open POST | post-open POST |
| omnient | 198 | ON | 103.270 | count=0 | early POST | early POST |
| omnient | 199 | OFF | 101.637 | count=0 | post-open POST | post-open POST |
| omnient | 199 | ON | 105.246 | count=0 | early POST | early POST |
| omnient | 200 | OFF | 103.981 | count=0 | post-open POST | post-open POST |
| omnient | 200 | ON | 100.688 | count=0 | early POST | early POST |
| omnient | 201 | OFF | 104.832 | count=0 | post-open POST | post-open POST |
| omnient | 201 | ON | 103.229 | count=0 | early POST | early POST |
| omnient | 202 | OFF | 101.567 | count=0 | post-open POST | post-open POST |
| omnient | 202 | ON | 103.682 | count=0 | early POST | early POST |
| omnient | 203 | OFF | 105.342 | count=0 | post-open POST | post-open POST |
| omnient | 203 | ON | 101.122 | count=0 | early POST | early POST |
| omnient | 204 | OFF | 104.165 | count=0 | post-open POST | post-open POST |
| omnient | 204 | ON | 103.248 | count=0 | early POST | early POST |
| omnient | 205 | OFF | 100.767 | count=0 | post-open POST | post-open POST |
| omnient | 205 | ON | 103.357 | count=0 | early POST | early POST |
| omnient | 206 | OFF | 105.145 | count=0 | post-open POST | post-open POST |
| omnient | 206 | ON | 103.498 | count=0 | early POST | early POST |
| omnient | 207 | OFF | 101.591 | count=0 | post-open POST | post-open POST |
| omnient | 207 | ON | 101.885 | count=0 | early POST | early POST |
| omnient | 208 | OFF | 103.296 | count=0 | post-open POST | post-open POST |
| omnient | 208 | ON | 101.986 | count=0 | early POST | early POST |
| omnient | 209 | OFF | 102.160 | count=0 | post-open POST | post-open POST |
| omnient | 209 | ON | 102.792 | count=0 | early POST | early POST |
| omnient | 210 | OFF | 104.864 | count=0 | post-open POST | post-open POST |
| omnient | 210 | ON | 103.943 | count=0 | early POST | early POST |
| omnient | 211 | OFF | 104.182 | count=0 | post-open POST | post-open POST |
| omnient | 211 | ON | 102.471 | count=0 | early POST | early POST |
| omnient | 212 | OFF | 105.385 | count=0 | post-open POST | post-open POST |
| omnient | 212 | ON | 105.432 | count=0 | early POST | early POST |
| omnient | 213 | OFF | 103.905 | count=0 | post-open POST | post-open POST |
| omnient | 213 | ON | 103.612 | count=0 | early POST | early POST |
| omnient | 214 | OFF | 104.279 | count=0 | post-open POST | post-open POST |
| omnient | 214 | ON | 104.756 | count=0 | early POST | early POST |
| omnient | 215 | OFF | 102.813 | count=0 | post-open POST | post-open POST |
| omnient | 215 | ON | 101.071 | count=0 | early POST | early POST |
| omnient | 216 | OFF | 101.489 | count=0 | post-open POST | post-open POST |
| omnient | 216 | ON | 100.607 | count=0 | early POST | early POST |
| omnient | 217 | OFF | 104.188 | count=0 | post-open POST | post-open POST |
| omnient | 217 | ON | 105.366 | count=0 | early POST | early POST |
| omnient | 218 | OFF | 102.005 | count=0 | post-open POST | post-open POST |
| omnient | 218 | ON | 104.163 | count=0 | early POST | early POST |
| omnient | 219 | OFF | 102.304 | count=0 | post-open POST | post-open POST |
| omnient | 219 | ON | 105.362 | count=0 | early POST | early POST |
| omnient | 220 | OFF | 106.689 | count=0 | post-open POST | post-open POST |
| omnient | 220 | ON | 104.367 | count=0 | early POST | early POST |
| omnient | 221 | OFF | 104.770 | count=0 | post-open POST | post-open POST |
| omnient | 221 | ON | 104.430 | count=0 | early POST | early POST |
| omnient | 222 | OFF | 103.049 | count=0 | post-open POST | post-open POST |
| omnient | 222 | ON | 104.587 | count=0 | early POST | early POST |
| omnient | 223 | OFF | 101.993 | count=0 | post-open POST | post-open POST |
| omnient | 223 | ON | 104.910 | count=0 | early POST | early POST |
| omnient | 224 | OFF | 103.353 | count=0 | post-open POST | post-open POST |
| omnient | 224 | ON | 103.497 | count=0 | early POST | early POST |
| omnient | 225 | OFF | 102.099 | count=0 | post-open POST | post-open POST |
| omnient | 225 | ON | 100.593 | count=0 | early POST | early POST |
| omnient | 226 | OFF | 102.468 | count=0 | post-open POST | post-open POST |
| omnient | 226 | ON | 103.838 | count=0 | early POST | early POST |
| omnient | 227 | OFF | 104.035 | count=0 | post-open POST | post-open POST |
| omnient | 227 | ON | 101.565 | count=0 | early POST | early POST |
| omnient | 228 | OFF | 100.547 | count=0 | post-open POST | post-open POST |
| omnient | 228 | ON | 103.320 | count=0 | early POST | early POST |
| omnient | 229 | OFF | 103.982 | count=0 | post-open POST | post-open POST |
| omnient | 229 | ON | 103.112 | count=0 | early POST | early POST |
| omnient | 230 | OFF | 102.520 | count=0 | post-open POST | post-open POST |
| omnient | 230 | ON | 105.450 | count=0 | early POST | early POST |
| omnient | 231 | OFF | 103.766 | count=0 | post-open POST | post-open POST |
| omnient | 231 | ON | 102.010 | count=0 | early POST | early POST |
| omnient | 232 | OFF | 101.823 | count=0 | post-open POST | post-open POST |
| omnient | 232 | ON | 105.363 | count=0 | early POST | early POST |
| omnient | 233 | OFF | 103.483 | count=0 | post-open POST | post-open POST |
| omnient | 233 | ON | 103.263 | count=0 | early POST | early POST |
| omnient | 234 | OFF | 103.685 | count=0 | post-open POST | post-open POST |
| omnient | 234 | ON | 103.621 | count=0 | early POST | early POST |
| omnient | 235 | OFF | 102.711 | count=0 | post-open POST | post-open POST |
| omnient | 235 | ON | 104.841 | count=0 | early POST | early POST |
| omnient | 236 | OFF | 103.215 | count=0 | post-open POST | post-open POST |
| omnient | 236 | ON | 105.465 | count=0 | early POST | early POST |
| omnient | 237 | OFF | 103.664 | count=0 | post-open POST | post-open POST |
| omnient | 237 | ON | 105.303 | count=0 | early POST | early POST |
| omnient | 238 | OFF | 105.337 | count=0 | post-open POST | post-open POST |
| omnient | 238 | ON | 100.694 | count=0 | early POST | early POST |
| omnient | 239 | OFF | 103.728 | count=0 | post-open POST | post-open POST |
| omnient | 239 | ON | 104.028 | count=0 | early POST | early POST |
| omnient | 240 | OFF | 101.449 | count=0 | post-open POST | post-open POST |
| omnient | 240 | ON | 101.701 | count=0 | early POST | early POST |
| omnient | 241 | OFF | 103.801 | count=0 | post-open POST | post-open POST |
| omnient | 241 | ON | 101.833 | count=0 | early POST | early POST |
| omnient | 242 | OFF | 105.416 | count=0 | post-open POST | post-open POST |
| omnient | 242 | ON | 103.009 | count=0 | early POST | early POST |
| omnient | 243 | OFF | 102.333 | count=0 | post-open POST | post-open POST |
| omnient | 243 | ON | 101.474 | count=0 | early POST | early POST |
| omnient | 244 | OFF | 100.862 | count=0 | post-open POST | post-open POST |
| omnient | 244 | ON | 101.076 | count=0 | early POST | early POST |
| omnient | 245 | OFF | 103.851 | count=0 | post-open POST | post-open POST |
| omnient | 245 | ON | 101.446 | count=0 | early POST | early POST |
| omnient | 246 | OFF | 105.387 | count=0 | post-open POST | post-open POST |
| omnient | 246 | ON | 100.803 | count=0 | early POST | early POST |
| omnient | 247 | OFF | 102.346 | count=0 | post-open POST | post-open POST |
| omnient | 247 | ON | 101.367 | count=0 | early POST | early POST |
| omnient | 248 | OFF | 102.062 | count=0 | post-open POST | post-open POST |
| omnient | 248 | ON | 102.060 | count=0 | early POST | early POST |
| omnient | 249 | OFF | 103.486 | count=0 | post-open POST | post-open POST |
| omnient | 249 | ON | 105.048 | count=0 | early POST | early POST |
| omnient | 250 | OFF | 103.866 | count=0 | post-open POST | post-open POST |
| omnient | 250 | ON | 102.504 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 100 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 20/250 ON trials. Of those trials, 20 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 3, 5, 9, 10, 11, 21, 72, 89, 98, 102, 106, 116, 122, 130, 140, 142, 152, 168, 175, 178, 185, 198, 199, 207, 217, 241, 243. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 28097 | CACF3C54-950F-49E4-933F-0FEBBCBFAFB0 |
| 1 | ON | 2 | 28098 | C3298B85-AC67-4B2C-9E2D-1370B7EECF96 |
| 2 | OFF | 3 | 28099 | 65071C88-0388-4665-9E41-7B4428EB131D |
| 2 | ON | 4 | 28100 | 6214D37A-F596-46BB-B3FF-2EBEAB6A24DB |
| 3 | OFF | 5 | 28102 | 695C3122-DE0D-4512-9C87-EEFCF1CD493A |
| 3 | ON | 6 | 28103 | 27C02CDB-E8CE-4EE1-95C3-0F20B64B7DC0 |
| 4 | OFF | 7 | 28104 | C9B063AB-8E9B-4EBF-AB71-2BEFEEAADD6F |
| 4 | ON | 8 | 28105 | 077870E7-7CE5-4A95-BE57-5D3BC8CEDD07 |
| 5 | OFF | 9 | 28107 | D2F38479-C16E-44D7-B2D0-6D7C436E9F72 |
| 5 | ON | 10 | 28108 | 4D8A6ACC-4A43-4B81-83EF-B00D2E6276EB |
| 6 | OFF | 11 | 28109 | D57B4044-9F92-4AF0-82AF-3698A9F9965D |
| 6 | ON | 12 | 28110 | 004CAC92-C1FA-41F6-8DE6-47803BAC1695 |
| 7 | OFF | 13 | 28112 | 94A6FB9A-C715-4FAA-A4ED-5812DBA11695 |
| 7 | ON | 14 | 28113 | 8549E7DC-E1E5-4AF9-B374-58B1AE60DA4A |
| 8 | OFF | 15 | 28114 | 50051C49-65D9-4D82-AC07-B5549B961D4A |
| 8 | ON | 16 | 28115 | FD13145A-1CA9-4D9F-9F4A-B71CDC13ECBB |
| 9 | OFF | 17 | 28116 | 256FEB17-F961-4391-9ADF-F81519CEC765 |
| 9 | ON | 18 | 28117 | B5CC58A8-479A-435E-AF55-02AF1234AFD0 |
| 10 | OFF | 19 | 28118 | DB6B5BBA-D2C0-41AA-AE55-9EBD09E61391 |
| 10 | ON | 20 | 28120 | B92CFC69-F099-4FC7-918E-357607B0D76B |
| 11 | OFF | 21 | 28121 | 615FFD8C-0268-4769-828E-736A54309A2E |
| 11 | ON | 22 | 28122 | DD45FD57-EC17-44D2-B01A-F1214C415E52 |
| 12 | OFF | 23 | 28123 | BB1D383A-4E1E-40DE-A677-CEC1D80F87C3 |
| 12 | ON | 24 | 28124 | D6EEA135-D1AD-4C1F-9744-BFD57F9877AF |
| 13 | OFF | 25 | 28125 | D5693867-9B0F-46C2-AB5A-943761F39B4E |
| 13 | ON | 26 | 28126 | 06CDEFD7-63C3-4F17-9DF8-D74C1E33AE66 |
| 14 | OFF | 27 | 28127 | 7C0182EC-C82F-4899-9073-04FE23FD9D04 |
| 14 | ON | 28 | 28129 | CE99E229-6A44-47EA-867D-47D9572A9A42 |
| 15 | OFF | 29 | 28130 | B5C15BD0-31A5-4FD7-9202-582E94875C46 |
| 15 | ON | 30 | 28131 | 00C34109-5CA7-4707-9B2E-1FBDCEC3D241 |
| 16 | OFF | 31 | 28132 | 2701EFD8-34B0-4379-94A6-0E14BE80F355 |
| 16 | ON | 32 | 28133 | 633D817D-70CA-4C39-AD07-9242D62B56B4 |
| 17 | OFF | 33 | 28134 | FEDD0FB5-3D44-45EB-BF84-35A1527E5706 |
| 17 | ON | 34 | 28135 | AE8D1EBD-B039-44D4-A262-599915E4104E |
| 18 | OFF | 35 | 28136 | 0D3466E8-7ED2-4CE2-BD30-FD7F0041F809 |
| 18 | ON | 36 | 28138 | C6C84B3F-5277-4079-8CC1-3DB7CA4ACB5C |
| 19 | OFF | 37 | 28139 | 38289C2B-D8A2-41E0-916B-EC92B71D03C7 |
| 19 | ON | 38 | 28140 | 2048AED1-8C89-40BB-81EA-B29510EEA9E1 |
| 20 | OFF | 39 | 28141 | 5FD90256-6304-4DF6-97B0-0D88AB1830CE |
| 20 | ON | 40 | 28142 | B4D38B42-862F-4A17-B5CA-5027CBC247D9 |
| 21 | OFF | 41 | 28144 | FDAFCFC1-E232-4BE3-917B-8CA6C5B2B553 |
| 21 | ON | 42 | 28145 | F9401501-53F0-4E59-B822-1E70C7F84ED3 |
| 22 | OFF | 43 | 28147 | E58AD73D-D468-4CD0-85FA-3DD75C043070 |
| 22 | ON | 44 | 28148 | 10F47461-B61F-44F5-9247-3BFC7B128DE2 |
| 23 | OFF | 45 | 28149 | 51507846-F75A-4D45-B212-9740B2E7271E |
| 23 | ON | 46 | 28150 | DF84267D-3537-4944-A420-E2D65619E85E |
| 24 | OFF | 47 | 28151 | 4A00C8D3-276F-4B37-BA19-29C290734E55 |
| 24 | ON | 48 | 28152 | 34B38C10-D38E-4EE5-B562-22D25DB343DC |
| 25 | OFF | 49 | 28153 | 4A4485F2-102B-4237-BF49-C1CDBC289A5F |
| 25 | ON | 50 | 28154 | 1AC0109C-843B-4F07-847D-6B71D2E5D30C |
| 26 | OFF | 51 | 28156 | 764FC199-7B52-4246-AF7E-A9B58CF197DF |
| 26 | ON | 52 | 28157 | 8341D6D6-8043-4E4F-B0C2-883E05C3C624 |
| 27 | OFF | 53 | 28158 | 2E1C5030-73C2-406E-9076-F7034D55461F |
| 27 | ON | 54 | 28159 | BEE3EF9B-04F0-47BB-94D4-A49FF2AE7E6F |
| 28 | OFF | 55 | 28161 | 0E29E447-0115-4800-AD53-4CDBCB8434B3 |
| 28 | ON | 56 | 28162 | A00A2154-8E9C-4E31-B2D2-76A1A5AE4CE6 |
| 29 | OFF | 57 | 28163 | 15459033-4736-45EF-A071-8EE41E9240C7 |
| 29 | ON | 58 | 28164 | 76E200F3-A59E-4391-8D3C-2165EDC50478 |
| 30 | OFF | 59 | 28166 | F88D7290-B61A-4F6F-8A98-0C3EE93A435F |
| 30 | ON | 60 | 28167 | 87A53B2D-F2C6-4923-8376-9438F5EE4B7E |
| 31 | OFF | 61 | 28168 | 2984C0A4-48E4-47C9-9F57-2D9F6457D883 |
| 31 | ON | 62 | 28169 | BE671165-33B4-41DE-82D6-A038558D333D |
| 32 | OFF | 63 | 28170 | A30FB806-94EF-4603-8FB0-4782DFBDBC40 |
| 32 | ON | 64 | 28171 | C8ECFA2B-EC6F-456E-B1A4-1126419A6693 |
| 33 | OFF | 65 | 28172 | B8F3BF18-EB4B-4683-8C91-7B33F36B734C |
| 33 | ON | 66 | 28173 | 2019ED06-2FAF-4A19-A6F0-80C5EBA63045 |
| 34 | OFF | 67 | 28175 | 71864419-8045-429F-B018-199AAAF34702 |
| 34 | ON | 68 | 28176 | F9548D00-BD1C-4698-ACEB-106E81DDF394 |
| 35 | OFF | 69 | 28177 | 7B378E64-62BE-4D63-BFA7-0E3366F53861 |
| 35 | ON | 70 | 28178 | AA7CC610-BC14-4F21-8E8C-E547233A0716 |
| 36 | OFF | 71 | 28179 | FE1F5579-FA90-4BAB-AFAF-69B95DDA00A3 |
| 36 | ON | 72 | 28180 | CB36D268-9A73-4ECB-92A9-8944017EDF81 |
| 37 | OFF | 73 | 28181 | A2AC6A8E-0BD0-4674-87A9-2D9E7B8E15B0 |
| 37 | ON | 74 | 28182 | 40DFB3FD-ED94-47C5-ABFA-7E5FB2E74E5E |
| 38 | OFF | 75 | 28184 | 100B3302-4974-45DA-8D11-E7CA1421719E |
| 38 | ON | 76 | 28185 | B3DE650A-BFBD-4BAF-B52D-791AAADD269C |
| 39 | OFF | 77 | 28186 | F7860AD7-690D-404D-88A9-8B95E50DAB0F |
| 39 | ON | 78 | 28187 | 35E7EA0A-9965-4C61-B4CB-E633BE027E4B |
| 40 | OFF | 79 | 28188 | DBEA1F30-916F-4FA1-9A83-7E6FA543A78C |
| 40 | ON | 80 | 28189 | 9678796E-A153-4938-B26F-B25FA0B39C7D |
| 41 | OFF | 81 | 28190 | DFB670C4-F184-4A53-9E39-CAFF39E7AC52 |
| 41 | ON | 82 | 28191 | 09EC35A5-7C87-41D0-BD65-B19E040C7050 |
| 42 | OFF | 83 | 28193 | 925D99F0-D17E-4C7A-9D9C-C8ADB5DBE2BA |
| 42 | ON | 84 | 28194 | 47A4799D-23DF-45F5-AAB1-66CBB57A54C4 |
| 43 | OFF | 85 | 28195 | 30C27385-B565-4D9C-93BB-F2CB139848C8 |
| 43 | ON | 86 | 28196 | 5C424927-2C70-4959-861E-89525E2E5DDB |
| 44 | OFF | 87 | 28197 | ACB54587-9B72-42BB-A334-5D7DB7D0A24D |
| 44 | ON | 88 | 28198 | 01973A93-2A67-4AEC-AF70-807C07617C63 |
| 45 | OFF | 89 | 28199 | 35871876-7762-432E-9E3B-13B1632E113F |
| 45 | ON | 90 | 28200 | F908336E-90DE-4F74-8EE6-A49201DBD6DB |
| 46 | OFF | 91 | 28202 | B21F257F-9A57-470D-B69E-8EDC9333571F |
| 46 | ON | 92 | 28203 | 552D4FF3-4D9F-48E0-9340-2F784F461F8C |
| 47 | OFF | 93 | 28204 | EB50F3A5-5D59-461E-8829-375482FDD740 |
| 47 | ON | 94 | 28205 | 677C0237-C048-47A3-8456-AC7F3010DB3B |
| 48 | OFF | 95 | 28206 | 36C94D79-3432-4825-AAAA-DB6B3B86916E |
| 48 | ON | 96 | 28207 | B84F9C07-304E-4CD9-8116-22A3AD282796 |
| 49 | OFF | 97 | 28208 | E3D46775-3B65-4727-8AF8-CECAEB046460 |
| 49 | ON | 98 | 28209 | 596DC0DC-2854-41C4-8BA4-7B89B7899095 |
| 50 | OFF | 99 | 28211 | D8B70F1D-29A0-451D-9ACD-A25B27C88219 |
| 50 | ON | 100 | 28212 | 4F4D84D9-5ABD-44E7-8AD7-96ABF802F0A3 |
| 51 | OFF | 101 | 28213 | 4AEF9BBE-C2A7-4BAC-8CC0-86BD9AD28C91 |
| 51 | ON | 102 | 28214 | BF106888-8DD7-4D4C-9587-17D9F685C63A |
| 52 | OFF | 103 | 28215 | 992BD336-BDD7-40F6-ADA3-1C530638BD2A |
| 52 | ON | 104 | 28216 | F0D5AA3F-2DA7-4A55-AB63-37BE0926D6A2 |
| 53 | OFF | 105 | 28217 | 5F694A40-590E-4FE7-9BDD-7C53038F2E7A |
| 53 | ON | 106 | 28219 | 2C4281B0-6A78-4238-932A-DB5970BED071 |
| 54 | OFF | 107 | 28220 | 35383AE2-64C9-4A5D-98B7-805BEFAB85C0 |
| 54 | ON | 108 | 28221 | 15033816-BF8A-404D-A11E-16BE41B3D649 |
| 55 | OFF | 109 | 28222 | B2CE1747-A18D-4FE4-8EA2-05C017D66547 |
| 55 | ON | 110 | 28223 | 44C7C1F7-4ED1-440C-8835-A97AEA7708A1 |
| 56 | OFF | 111 | 28224 | 145F69DD-A7B5-447B-87B7-C9F5C030DF83 |
| 56 | ON | 112 | 28225 | 2C1B0E99-8400-4501-9CA4-C77DC5302D73 |
| 57 | OFF | 113 | 28226 | 5635A181-3AF3-47C8-96E7-A45C96784F46 |
| 57 | ON | 114 | 28228 | 6E516F4F-5ADC-45AB-A14F-1885DC5AD194 |
| 58 | OFF | 115 | 28229 | D87805B2-62E9-4C6A-BA81-50850FBF3190 |
| 58 | ON | 116 | 28230 | 7F1B2BB8-CD3A-4F08-AD34-181BE5AECA0B |
| 59 | OFF | 117 | 28231 | C25E119D-A4B3-4D0C-93A8-9B0B715EF454 |
| 59 | ON | 118 | 28232 | 6E7BF715-ADCE-440D-8994-4793156B9737 |
| 60 | OFF | 119 | 28233 | 3FC345D4-DE37-4671-8C2F-B257181237E9 |
| 60 | ON | 120 | 28234 | E7EC850F-2A93-472F-BBE2-B21D7EC4276E |
| 61 | OFF | 121 | 28235 | 69BAD06E-A6A3-416E-9961-A902C9C7442D |
| 61 | ON | 122 | 28237 | C3815809-AA66-4D92-A907-724C3910DB7C |
| 62 | OFF | 123 | 28238 | 7285CDB7-86D4-4FE4-8803-346A6B4EB8B3 |
| 62 | ON | 124 | 28239 | 2839A361-01A2-4F0C-AE97-CE6830574F8B |
| 63 | OFF | 125 | 28240 | A29466A7-4E2E-4476-B875-8B132D45F6F0 |
| 63 | ON | 126 | 28241 | 4F421256-7581-4712-B8AD-00FC32B8852F |
| 64 | OFF | 127 | 28242 | F775AB2F-AACC-4844-883F-3AED417DFC02 |
| 64 | ON | 128 | 28243 | 72CDACF3-2E75-46DD-BF99-AC84F394F1A0 |
| 65 | OFF | 129 | 28244 | 055E3C9A-E9D8-4D43-A992-5CED914D74FB |
| 65 | ON | 130 | 28246 | 44970774-4E64-4BC8-90ED-4CD3157E6682 |
| 66 | OFF | 131 | 28247 | 36E79BD2-C703-4217-8667-2525FFE15F46 |
| 66 | ON | 132 | 28248 | ED86F2A0-BFC4-45E2-936A-9F3385860B31 |
| 67 | OFF | 133 | 28249 | 8D645A25-507A-4C60-A373-64AA2A86239D |
| 67 | ON | 134 | 28250 | 904CBB97-0185-4FFC-93A7-A868D9460ED6 |
| 68 | OFF | 135 | 28251 | F101C2C4-6FEC-4609-9E21-05F49FB1B872 |
| 68 | ON | 136 | 28252 | 07EDB9C1-3292-4A4F-8995-CE45A419A2C6 |
| 69 | OFF | 137 | 28254 | C883AF46-82B6-4A45-B83E-025124FDC137 |
| 69 | ON | 138 | 28255 | 30B6B081-1ADF-4C07-8C26-A27C226E30CD |
| 70 | OFF | 139 | 28256 | 99AAC0E0-C880-48E3-BE02-6ABEA14616EC |
| 70 | ON | 140 | 28257 | 29A4EDE7-9D5C-424B-B2C1-A62EBF49918B |
| 71 | OFF | 141 | 28258 | 2B13AEF4-8612-4761-8BEB-FA6EB8AFDEE5 |
| 71 | ON | 142 | 28259 | C986AC99-71F9-48E7-82E3-B1B77163030D |
| 72 | OFF | 143 | 28260 | BB968D3E-27BF-4379-8FD0-BA5451BAFC65 |
| 72 | ON | 144 | 28261 | 0943C37F-EC8C-493F-B833-18E3A42DA3CE |
| 73 | OFF | 145 | 28263 | E4CBB918-F42A-4109-9889-9AB559CB4437 |
| 73 | ON | 146 | 28264 | 5620BA36-22A3-464F-8D08-91A92671488A |
| 74 | OFF | 147 | 28265 | CA9B5FA9-DB2E-43ED-8440-B3CD0BE44CDD |
| 74 | ON | 148 | 28266 | EFC641F0-8C89-4CBE-A1CC-465E9B3FAC2C |
| 75 | OFF | 149 | 28267 | 145162C4-A2F9-497A-8733-3B89B9528DBB |
| 75 | ON | 150 | 28268 | C13F593A-409B-40B0-B37E-89233659A280 |
| 76 | OFF | 151 | 28269 | 60B44C06-4987-4997-BD92-F8B705EAD21D |
| 76 | ON | 152 | 28270 | E79DF73B-313C-4580-8534-31814E7869CB |
| 77 | OFF | 153 | 28272 | 383F4C7C-B86E-4BCF-B5BD-D5F5396C20E4 |
| 77 | ON | 154 | 28273 | 414EC281-84FB-4031-B491-6E724A10D7A0 |
| 78 | OFF | 155 | 28274 | B3E315D0-8534-4DFD-A4E3-E6C67CFA9805 |
| 78 | ON | 156 | 28275 | 7B4FBC31-138B-4747-8D74-AA77ED918BA8 |
| 79 | OFF | 157 | 28276 | 34E60A0C-9872-4415-A8A3-6A93052F71B1 |
| 79 | ON | 158 | 28277 | 05F6E085-24FB-4722-B4D2-F3C045658549 |
| 80 | OFF | 159 | 28278 | EFB540D1-2B0C-4300-BE2D-2D6F39FF2CDB |
| 80 | ON | 160 | 28279 | 4BD9333B-0ECA-4BCB-98F9-A2E8A8C43114 |
| 81 | OFF | 161 | 28281 | E434B382-7D90-4636-913A-BEB78997B4FB |
| 81 | ON | 162 | 28282 | A3B22496-5852-4CB3-B6E1-60B7939BA0B9 |
| 82 | OFF | 163 | 28284 | EB7D152E-3B75-4CDE-A7A8-AEDE930752C4 |
| 82 | ON | 164 | 28285 | D4337E20-97B1-4593-BFC4-2325600EDC07 |
| 83 | OFF | 165 | 28286 | 2F2237DC-E667-44D8-95AD-744E257C6AD6 |
| 83 | ON | 166 | 28287 | 50B46DF9-8B77-44B6-9148-81A7620F338A |
| 84 | OFF | 167 | 28289 | 227E2007-A351-4D30-833B-EC9820D32C34 |
| 84 | ON | 168 | 28290 | 75CBA21C-55C6-4128-9C79-A735898D0686 |
| 85 | OFF | 169 | 28291 | ADDFF2D5-1286-44B2-9862-52D804B950FF |
| 85 | ON | 170 | 28292 | 9ED67431-FA73-4888-8254-9F73853B78C5 |
| 86 | OFF | 171 | 28293 | 14850346-81A6-4A53-9DCB-FF107D4C462F |
| 86 | ON | 172 | 28294 | 93867666-04A8-4C9A-B2C5-55D6794FB022 |
| 87 | OFF | 173 | 28295 | 5C66C9CB-EF16-4BD1-A1CE-8F2D5955DB6D |
| 87 | ON | 174 | 28296 | 1AF4F5AC-D45D-4305-B98D-39B1BDD966F8 |
| 88 | OFF | 175 | 28298 | 28F3D303-8110-41DC-A05B-6E7C847A99CD |
| 88 | ON | 176 | 28299 | 88A93A78-3FB7-427D-811B-04C369DD61BB |
| 89 | OFF | 177 | 28300 | 78976135-1C5F-4FC6-9BDB-CC28AB377BDE |
| 89 | ON | 178 | 28301 | FFF5FE1E-1978-4A2C-802F-D4C5ADF02803 |
| 90 | OFF | 179 | 28302 | 0E7DCB67-44C4-4C04-B182-A86F7A59DB1C |
| 90 | ON | 180 | 28303 | EB52B9A4-4460-43B4-A126-F676188CC820 |
| 91 | OFF | 181 | 28304 | 73E42615-FB78-4D0E-85E0-F3742B9292C5 |
| 91 | ON | 182 | 28305 | CA34191B-F597-4E07-AA7C-712C51ADA51C |
| 92 | OFF | 183 | 28307 | 5A8B45A0-A84B-400A-8BBE-7A6299651C00 |
| 92 | ON | 184 | 28308 | B8F80890-A6B6-4601-BE51-22FFFE3D9648 |
| 93 | OFF | 185 | 28309 | 6B023EE5-7A61-4F3C-9DEC-7ECDC9B8052B |
| 93 | ON | 186 | 28310 | 332976E3-EA70-4A53-9CF0-C96C21C04D89 |
| 94 | OFF | 187 | 28311 | 6ABAD1D2-257E-4B44-B2D2-3BE4E7C94A12 |
| 94 | ON | 188 | 28312 | 37F24B2B-0DF9-473B-B551-B65CC73198E7 |
| 95 | OFF | 189 | 28313 | 500389C6-DA08-464C-99BA-831E095CEFB4 |
| 95 | ON | 190 | 28314 | CCAF4A5B-A9D8-45ED-A4EC-FC0F7D750B99 |
| 96 | OFF | 191 | 28316 | 80B9901F-1B7E-4485-AB4A-CDC3F4E40C1A |
| 96 | ON | 192 | 28317 | 2A280F2A-A059-46A1-94CF-DE112A32B1E8 |
| 97 | OFF | 193 | 28318 | F69955AE-7769-4BF0-A171-B115108B27DB |
| 97 | ON | 194 | 28319 | B7096A5B-F99A-4AB2-AB48-D000E0D176E5 |
| 98 | OFF | 195 | 28320 | 7590EC80-4168-46D8-B0F7-E003CE55A17E |
| 98 | ON | 196 | 28321 | CEF45935-5A05-4050-B529-826D75A9376F |
| 99 | OFF | 197 | 28322 | 8870B609-5621-4AF4-81BF-A946F968078F |
| 99 | ON | 198 | 28323 | 2B7BBA42-8002-4EAC-A90B-AF85A06ED8D4 |
| 100 | OFF | 199 | 28325 | 11B512AA-8BD0-4A71-9CE2-DBCAAF1F3458 |
| 100 | ON | 200 | 28326 | A8EA79BF-CE0D-424C-AA5E-F064DF355D3A |
| 101 | OFF | 201 | 28327 | B727B645-0DF7-45DC-96E9-E47EA41FF734 |
| 101 | ON | 202 | 28328 | A2D86F99-1D70-4756-BCC9-7F54CA06044A |
| 102 | OFF | 203 | 28329 | 65669A70-00B2-4F9C-A608-487A1E08E4C1 |
| 102 | ON | 204 | 28330 | 2DBAB5D8-6949-465C-B0C6-EC69556A35FE |
| 103 | OFF | 205 | 28331 | C5571C0B-2B79-4408-92A7-EAA91C49AA4C |
| 103 | ON | 206 | 28332 | 9A6839C3-CF00-4FF8-A44D-C7A4C657B2E2 |
| 104 | OFF | 207 | 28334 | A85820CA-1FE2-4DB5-AD65-1439E4EE7E64 |
| 104 | ON | 208 | 28335 | FCAA192D-A56C-4906-98C5-8D1A0232C170 |
| 105 | OFF | 209 | 28336 | 4049B9CA-F016-4220-83CF-4C7C10E384B5 |
| 105 | ON | 210 | 28337 | 30BCCD90-9AFB-4B0A-BFF9-598679688E33 |
| 106 | OFF | 211 | 28338 | BCB8B982-4FDF-4A2D-BC8C-CAEEBC50365D |
| 106 | ON | 212 | 28339 | BDDE573D-40D7-4CC3-9588-F6D9144C74AC |
| 107 | OFF | 213 | 28340 | 31869605-F1B6-4EFD-A694-557BA4C9CCF1 |
| 107 | ON | 214 | 28341 | CDEA63FE-F53E-4EBD-ACCE-B85ACCC32803 |
| 108 | OFF | 215 | 28343 | 8C3180BB-DF2E-41B8-B49F-BE43E1B27E39 |
| 108 | ON | 216 | 28344 | A24A48D8-B3AC-472B-B196-4516F3615D01 |
| 109 | OFF | 217 | 28345 | 31FA39C2-EC9C-4D0D-93B9-E4D51214BF8C |
| 109 | ON | 218 | 28346 | 30250686-E8D2-4E46-87CD-6BF897A4F733 |
| 110 | OFF | 219 | 28347 | 70F85C36-9EC4-48F5-AD6A-B3ED871BD88F |
| 110 | ON | 220 | 28348 | C66AAD90-8E3C-47E1-97BE-811AFD31129D |
| 111 | OFF | 221 | 28349 | 264CA443-B5AA-4E9C-BAFF-A27B03B9A2A6 |
| 111 | ON | 222 | 28350 | F9996337-00D5-4775-98E2-02D53F841E45 |
| 112 | OFF | 223 | 28352 | 07F509AD-0294-4EF4-A0A8-900DE6577360 |
| 112 | ON | 224 | 28353 | B2AC5C70-3DEA-41B7-A9DD-EB5647CE7323 |
| 113 | OFF | 225 | 28354 | 0F213BF6-91C6-4893-A114-1E60C96E41E2 |
| 113 | ON | 226 | 28355 | 75C45C38-79E4-48A5-A8CD-6BC85F3B1910 |
| 114 | OFF | 227 | 28356 | 91028B55-A665-470D-8325-63F2C8D85870 |
| 114 | ON | 228 | 28357 | 068A21CB-1674-4906-9BFC-078D536D2D5B |
| 115 | OFF | 229 | 28358 | 5F93CDE4-C7F4-4B07-BFC0-959070D0A9C3 |
| 115 | ON | 230 | 28359 | D5A28CE0-DE17-4274-877B-52031FA3B1E8 |
| 116 | OFF | 231 | 28361 | FA583343-EE2F-43BC-AA25-2E34BB1130F5 |
| 116 | ON | 232 | 28362 | F925D87F-0957-4C4B-8753-6C2C8F461F11 |
| 117 | OFF | 233 | 28363 | 49FFDB3B-CB13-4686-87A8-7C4FB576147D |
| 117 | ON | 234 | 28364 | 6BC1BDC1-0AD5-4145-89E4-BC4C3E7F617A |
| 118 | OFF | 235 | 28365 | 7876FB5E-52AC-4CD4-9665-1D7436D1CFBE |
| 118 | ON | 236 | 28366 | D1AC0292-A4D3-4653-A511-6C39D2A6AE88 |
| 119 | OFF | 237 | 28367 | 8038D9CD-CC1C-4D6B-A0CD-00E4C865C313 |
| 119 | ON | 238 | 28369 | 8E5F9896-8A8E-43DC-887A-BDFE226EB724 |
| 120 | OFF | 239 | 28370 | 7EB625D1-1022-4E1B-ADDE-7BD2501D2C8C |
| 120 | ON | 240 | 28371 | F0FD4377-423D-4B17-98A3-D7323F3E9EF6 |
| 121 | OFF | 241 | 28372 | 8DA0C12C-425B-408B-9F1D-9E5D574BE16B |
| 121 | ON | 242 | 28373 | E3EB37F2-6D9E-4994-AAF5-966ECC4800D7 |
| 122 | OFF | 243 | 28374 | 7E819D06-54D3-4C90-951F-DA880B03A654 |
| 122 | ON | 244 | 28375 | 5AF407D3-3947-4DFE-AB52-9297CBCC9ACA |
| 123 | OFF | 245 | 28377 | 8528666A-6B28-4F1B-A4F0-7471A57C3207 |
| 123 | ON | 246 | 28379 | CF51E9AF-0A2A-4FA9-B2E6-2816F4977BD8 |
| 124 | OFF | 247 | 28380 | 97AC33C0-2878-4937-80EA-892239EB69E3 |
| 124 | ON | 248 | 28381 | 5562B89E-67BF-49B8-ACD6-058ACCA531B9 |
| 125 | OFF | 249 | 28382 | 23F9A4D2-AEFF-417B-8F01-A0C061A0A0AF |
| 125 | ON | 250 | 28383 | 6D626DD0-B3F7-4B17-970D-7B4A8DA5DCEB |
| 126 | OFF | 251 | 28384 | 0C265787-106F-4095-95D2-AA36E3D3896C |
| 126 | ON | 252 | 28385 | 36E493C8-E27F-4654-96E0-D8D5BF628C85 |
| 127 | OFF | 253 | 28386 | 838CB943-B1C2-48E7-ACAC-D657A69FF4E5 |
| 127 | ON | 254 | 28388 | 84563E0B-AF27-4354-BD79-3CA35C80B099 |
| 128 | OFF | 255 | 28389 | 2EC76923-7CBE-4899-9D32-B02EF3FEC7F4 |
| 128 | ON | 256 | 28390 | 2C1FDB30-13F3-4370-8C12-4FC3F5907DEE |
| 129 | OFF | 257 | 28391 | D4383551-B849-4B30-978A-5D0AEFBB8F6C |
| 129 | ON | 258 | 28392 | D51D5E3B-1C43-4C02-A376-8FCE641B9848 |
| 130 | OFF | 259 | 28393 | 9B00B130-7970-4540-BAF1-CCC5E387E7A2 |
| 130 | ON | 260 | 28394 | 6E9FA071-3558-4C41-9368-9FABD35BCA1E |
| 131 | OFF | 261 | 28395 | 955BC5B0-C50E-4C91-9AF7-45801585B23A |
| 131 | ON | 262 | 28397 | 76DD6B4A-1B95-4996-B767-7D9A11A61559 |
| 132 | OFF | 263 | 28398 | 93A9E6E8-A314-46E6-B1B0-1615B2AE8AA0 |
| 132 | ON | 264 | 28399 | 02B61DD2-8B61-4C37-94B8-EF12676D7423 |
| 133 | OFF | 265 | 28400 | 77FE919E-68B9-410A-A5D7-8B8C1A58D0E0 |
| 133 | ON | 266 | 28401 | 798B6A0C-31A3-40D6-BA40-EECFD3FC7683 |
| 134 | OFF | 267 | 28402 | 1CA6BC4B-3A3F-4FAA-8F6B-54B4502EC678 |
| 134 | ON | 268 | 28403 | 65C5467D-96E4-4B00-A68E-0D80234EFFBC |
| 135 | OFF | 269 | 28405 | 88478D01-2A2F-4A68-9957-A726A3665697 |
| 135 | ON | 270 | 28406 | AA9A90E4-3CEC-4E6B-80DF-D14BA67A5244 |
| 136 | OFF | 271 | 28407 | 2162F51E-0790-4079-A057-037C9C7D6AA4 |
| 136 | ON | 272 | 28408 | 8AF3A3DE-66B2-489A-A584-37C14ECBF321 |
| 137 | OFF | 273 | 28409 | A9EF9BD1-B6CD-4BDD-A9A1-04189B772088 |
| 137 | ON | 274 | 28410 | C0C33AA1-D389-4075-91B1-754A6253F353 |
| 138 | OFF | 275 | 28411 | B3C1D47D-8FFB-40F9-9BEA-8A2BE497562B |
| 138 | ON | 276 | 28412 | 7F0800B4-F6D7-4F1E-A517-1E5A6FF252CC |
| 139 | OFF | 277 | 28414 | 70081868-198C-45BD-9D28-2FB7801E6FD7 |
| 139 | ON | 278 | 28415 | EF541613-3168-4799-94A3-E10C2ADF5EAC |
| 140 | OFF | 279 | 28416 | A5613005-69C2-4A07-868C-E7CB4422778A |
| 140 | ON | 280 | 28417 | F861F3AC-BFEF-47A6-8597-2A969AD9072A |
| 141 | OFF | 281 | 28418 | C06CF8CE-9F73-4627-8D15-7A231BA70C97 |
| 141 | ON | 282 | 28419 | 1021A26A-EFE2-4AB8-A1F3-36C5A5ABDA47 |
| 142 | OFF | 283 | 28420 | 10024E5F-B8D6-42E4-84AF-5C27CDC523AD |
| 142 | ON | 284 | 28421 | E78C6ABD-8D2B-4D4E-B160-C2FEAAE1FC25 |
| 143 | OFF | 285 | 28423 | 37F61F77-918D-4C1F-8E05-20BF65B12D1A |
| 143 | ON | 286 | 28424 | DE32453B-14F3-493B-BB51-F71805D4D0A1 |
| 144 | OFF | 287 | 28425 | 5471BAC0-0B14-463B-B74E-A72E91149833 |
| 144 | ON | 288 | 28426 | 4922A93F-8C27-4CF8-9AD6-B95FCE8B9A82 |
| 145 | OFF | 289 | 28428 | E9F73BF1-5A0E-41A9-AA35-1210E73AF65C |
| 145 | ON | 290 | 28429 | 4EBF4D30-6F72-4866-996F-595D615A7CAA |
| 146 | OFF | 291 | 28430 | C0B84BE1-FF57-488B-883F-EBF523A107FB |
| 146 | ON | 292 | 28431 | 29CDF230-5028-4385-AE4A-FC11A3ECD354 |
| 147 | OFF | 293 | 28432 | 64B582E2-4FD3-4C1A-9CBA-23F7EA635B9F |
| 147 | ON | 294 | 28433 | ACE3F0F0-9C3E-46C8-A06F-8A3B2B310520 |
| 148 | OFF | 295 | 28434 | DA65440A-641E-4566-B588-8ECBE14CD11D |
| 148 | ON | 296 | 28435 | 02342E68-AEFE-452E-923B-42A33DE9D1A6 |
| 149 | OFF | 297 | 28437 | 53425EF2-DF36-4A01-8E35-8519E6D67848 |
| 149 | ON | 298 | 28438 | 4DAA4EC0-905E-49E2-B037-761811091515 |
| 150 | OFF | 299 | 28439 | 2B75E4B8-D114-406D-8720-6E19B11508DA |
| 150 | ON | 300 | 28440 | AE57DA46-E4CE-4E67-B904-977ABBFA5DAE |
| 151 | OFF | 301 | 28441 | 83854C51-3F67-4F04-971B-C040BA464F2C |
| 151 | ON | 302 | 28442 | 085894B5-A2E3-479C-95E1-F4E5E925D8D5 |
| 152 | OFF | 303 | 28443 | 9AE6D902-665A-4E9A-8571-034739FADD5A |
| 152 | ON | 304 | 28444 | EC26AD3E-768E-4379-BFA5-ACE1F3032D2F |
| 153 | OFF | 305 | 28446 | 448FBFB8-10D9-4505-9155-06EE469F3812 |
| 153 | ON | 306 | 28447 | 685D5E79-AC4E-4E54-B382-D6DDB560434D |
| 154 | OFF | 307 | 28448 | AAA7A20E-FD2B-4022-8E45-66B24B7505CC |
| 154 | ON | 308 | 28449 | 74DDB3E8-B47E-4D28-8CA9-64AFA068C59A |
| 155 | OFF | 309 | 28450 | E72FEF5C-E8C0-4B58-9FE8-5BB3DCBF04D5 |
| 155 | ON | 310 | 28451 | A820725D-5ADD-4C61-8ED3-C0ABE77F693C |
| 156 | OFF | 311 | 28452 | 96E9F103-DD75-4A03-A602-1C7981813262 |
| 156 | ON | 312 | 28453 | 94CD6546-2878-4F87-BA70-8607AE6FAE72 |
| 157 | OFF | 313 | 28455 | D18FA3F8-26F1-4984-9166-2ADFB76B203D |
| 157 | ON | 314 | 28456 | 4937A39F-E1F8-47D0-8A63-4F803494EA8C |
| 158 | OFF | 315 | 28457 | A9B41697-1C08-41DD-8F50-F92F5046E82A |
| 158 | ON | 316 | 28458 | 6B8BE706-87A7-4DEC-A52A-26A66D4455FA |
| 159 | OFF | 317 | 28459 | F4C206BE-AF6E-4730-9396-194BA46C332D |
| 159 | ON | 318 | 28460 | D383ABD8-1CE4-4AFB-9AAB-81F7E1D0C7FC |
| 160 | OFF | 319 | 28461 | AAF89AA6-D28E-4A89-B901-81D5F3614F22 |
| 160 | ON | 320 | 28462 | FD888BF4-3D72-4526-984C-5CC9BC5193B2 |
| 161 | OFF | 321 | 28464 | E7237F92-E362-4EF4-B32C-46C284F8551D |
| 161 | ON | 322 | 28465 | 1829D006-7860-4916-8BC3-85BFC7357618 |
| 162 | OFF | 323 | 28466 | 1347AC51-10CE-41B7-A499-B95FF3DBA640 |
| 162 | ON | 324 | 28467 | 8D3ACD7B-0A3E-4453-9C83-01C18D19CED0 |
| 163 | OFF | 325 | 28468 | DBA1C9F8-1266-41E6-A8C4-9102526BD0C6 |
| 163 | ON | 326 | 28469 | 28B3BCB7-ADEC-4DC1-9C1E-69E6872C940C |
| 164 | OFF | 327 | 28470 | 271A09E9-C7EF-4AD6-9BBC-1F444C0BE18C |
| 164 | ON | 328 | 28471 | 35669CEC-4224-465D-A9F8-76E898355092 |
| 165 | OFF | 329 | 28473 | 0CC6148C-05F4-4603-A317-41634636F4D4 |
| 165 | ON | 330 | 28474 | A3E734A4-99F0-4043-9062-8C6D89368050 |
| 166 | OFF | 331 | 28475 | 017FA38B-E237-4094-BF2E-04B47A7965B2 |
| 166 | ON | 332 | 28476 | 57533241-7619-4E98-A903-069FB67B4F06 |
| 167 | OFF | 333 | 28477 | F0D77A2A-D262-4CDC-AD45-1946E93DA02C |
| 167 | ON | 334 | 28478 | 72B6996B-93CD-47D5-B60A-6B2DC876AE82 |
| 168 | OFF | 335 | 28479 | 221A2515-6099-4BC2-852D-38774BDEA792 |
| 168 | ON | 336 | 28480 | FB2D1B68-9293-4A3B-8790-5D9C7262FFB6 |
| 169 | OFF | 337 | 28482 | ACCE781D-BAF8-4EFF-B01A-C26DFDA42256 |
| 169 | ON | 338 | 28483 | 3C5A697C-F92C-4933-89D6-77E6A5B58079 |
| 170 | OFF | 339 | 28484 | 326AD5E2-63A7-49E5-A129-7C51B84C6C5A |
| 170 | ON | 340 | 28485 | BB7A15DE-ECB2-4DBB-8905-3B6D88740CD6 |
| 171 | OFF | 341 | 28486 | B42A935A-A951-4A25-8B90-E2E343E267D6 |
| 171 | ON | 342 | 28487 | 28F0A8D3-54E3-4DD2-BBFB-E990E482C144 |
| 172 | OFF | 343 | 28488 | A928CF75-5AB3-44D5-9BDE-24381A655604 |
| 172 | ON | 344 | 28489 | AF591D3D-C8FB-4ECA-B7DD-F497D7DBF5B6 |
| 173 | OFF | 345 | 28491 | 990F807E-3D8E-42E3-A27D-D139A827E88C |
| 173 | ON | 346 | 28492 | A3E7CC67-7062-4BA3-AA6A-70998016DE08 |
| 174 | OFF | 347 | 28493 | 5A1F26CB-C2EE-49C3-B469-2FBA32EFF461 |
| 174 | ON | 348 | 28494 | 96199F10-0F1B-4E9C-B6B7-EFACA551CBA1 |
| 175 | OFF | 349 | 28495 | 5D78725E-9685-40EE-AE29-6F79DB4A26BE |
| 175 | ON | 350 | 28496 | 256B2F6A-C4E6-4610-855D-15BF4D25269F |
| 176 | OFF | 351 | 28497 | 3A57A09E-228D-442B-B58A-ACBA8049D8B2 |
| 176 | ON | 352 | 28498 | 63AA3CCE-489C-4D8F-B7D1-89F7233F41EA |
| 177 | OFF | 353 | 28500 | 72DD8D8E-01AD-4F39-B83C-EB99EF475384 |
| 177 | ON | 354 | 28501 | 00876FFB-6573-4678-A1AE-73E9A117B7EA |
| 178 | OFF | 355 | 28502 | C9B8BEC5-F218-48A3-BA2E-796485DB95D3 |
| 178 | ON | 356 | 28503 | 75A1CD84-D8F3-4C0D-B139-A2A4285411E9 |
| 179 | OFF | 357 | 28504 | CF7ECD64-BFCB-4804-B32A-4101AD018E14 |
| 179 | ON | 358 | 28505 | 7F033B5D-9EF2-469E-A9AF-62AB59FE3C21 |
| 180 | OFF | 359 | 28506 | 2C0B9742-3EA9-47A1-951E-C943087E05CF |
| 180 | ON | 360 | 28507 | F5376CD6-F754-451B-80A9-21AC89E0070F |
| 181 | OFF | 361 | 28508 | 928B7DD5-6DEA-47FE-B662-ABA80B92002A |
| 181 | ON | 362 | 28510 | 3B860D94-2A55-449C-B5AF-08BA8AA1440A |
| 182 | OFF | 363 | 28511 | 76688F32-4EFC-48A8-8B69-67D26269E2DB |
| 182 | ON | 364 | 28512 | 7DE2FEC0-83D1-44FE-AD46-3ACEEE4316C5 |
| 183 | OFF | 365 | 28513 | 2456BA34-41ED-482C-A02A-24908067FD2E |
| 183 | ON | 366 | 28514 | D235D7FD-624F-4E7E-B530-DEF0B3BAE71A |
| 184 | OFF | 367 | 28515 | 05AE46D9-08B2-44E7-89EA-C8707D7BD8C5 |
| 184 | ON | 368 | 28516 | 9D18D0E6-865F-4D80-A8E8-C2F52641DFF1 |
| 185 | OFF | 369 | 28517 | 8DDBF35D-F6ED-4F99-9BF6-CEE9804F24F9 |
| 185 | ON | 370 | 28519 | 96217C3F-2DAF-4A13-8221-750E379F9F42 |
| 186 | OFF | 371 | 28520 | 22499F58-F232-4053-B8CA-B171EE4E7564 |
| 186 | ON | 372 | 28521 | F8E998CE-CC9D-410F-8794-AA0EBC14E0CD |
| 187 | OFF | 373 | 28522 | 854A40D7-0465-4964-9C75-5C05292F84AC |
| 187 | ON | 374 | 28523 | 61E3C497-00D4-4A0A-83B8-0AE02721FD06 |
| 188 | OFF | 375 | 28524 | 562F38E7-DBF7-4BD9-AF60-34EE027392EC |
| 188 | ON | 376 | 28525 | ACD447B1-1137-4B0C-BF64-0431CC590906 |
| 189 | OFF | 377 | 28526 | F4845B4D-AC74-4084-B5D8-8BC961EA1626 |
| 189 | ON | 378 | 28528 | 0F25752B-209F-4F8D-BA7D-6FF018476AD3 |
| 190 | OFF | 379 | 28529 | 39E26705-A0E8-417F-8B61-F799471DEEE2 |
| 190 | ON | 380 | 28530 | 6B326136-17C0-44D9-9107-254DCF9369AB |
| 191 | OFF | 381 | 28531 | 5347EAB5-C9FA-49E4-8015-8C72F39EAF6C |
| 191 | ON | 382 | 28532 | 7EA2CB64-7132-4436-AD8B-2FEE4A2E5326 |
| 192 | OFF | 383 | 28533 | E014300F-9465-4DDF-AD09-CCFC94CFE09E |
| 192 | ON | 384 | 28534 | 5497FC34-D029-488C-B593-C4A60D9801A9 |
| 193 | OFF | 385 | 28535 | 946935DE-51C1-493B-BF53-4D2D992DFF52 |
| 193 | ON | 386 | 28537 | 0AAE8F6D-5C02-4A2E-9266-F0E09C33BA14 |
| 194 | OFF | 387 | 28538 | 5BE25D13-6933-4A15-9608-782325C4AD6B |
| 194 | ON | 388 | 28539 | 3A195AB7-9D98-4048-82ED-6DF6E72D263B |
| 195 | OFF | 389 | 28540 | 2F6D9C92-6ECE-4C5C-BCB4-472654F1916B |
| 195 | ON | 390 | 28541 | D428EECF-2771-4FBF-B3D3-3186C868CEA9 |
| 196 | OFF | 391 | 28542 | F4F03727-B0D4-4AAB-B5A2-599079877D4F |
| 196 | ON | 392 | 28543 | 06BB432C-1EFB-43D0-A8D9-C815919DD082 |
| 197 | OFF | 393 | 28545 | F76EE745-7614-4E29-B865-B84F80E65DB7 |
| 197 | ON | 394 | 28546 | 16CD4E99-B056-4ACC-A186-B8AB3A97CE95 |
| 198 | OFF | 395 | 28547 | A66A9D2C-C874-4FCB-AC4E-BFFF31004BBC |
| 198 | ON | 396 | 28548 | 8E759F2E-D1B7-4C08-9F7D-CDD446870CD2 |
| 199 | OFF | 397 | 28549 | F506E9B8-D413-48D6-8816-4709D45EAA67 |
| 199 | ON | 398 | 28550 | A3B8357E-8B20-47F0-A24F-2AC0F4F9EADA |
| 200 | OFF | 399 | 28551 | 6595C20E-9945-4FC5-BC53-753DE4C67D13 |
| 200 | ON | 400 | 28553 | 39485630-6F45-4ADB-A5F3-D2F8CA9AE595 |
| 201 | OFF | 401 | 28554 | B53FBB3A-0065-4395-9584-0DCFEF39221E |
| 201 | ON | 402 | 28555 | B6E06CD3-9E46-412C-BBF6-9B737426B83F |
| 202 | OFF | 403 | 28556 | F4C98086-B211-4083-99B0-DEE2E839547A |
| 202 | ON | 404 | 28557 | D982621A-5814-4B33-8DD6-EAEEA4AD48CE |
| 203 | OFF | 405 | 28558 | 00BFD85E-E9CA-443C-8F5F-62C2D1528F38 |
| 203 | ON | 406 | 28559 | 59108B5F-6F1B-4792-8F70-0E865D0D9DF4 |
| 204 | OFF | 407 | 28560 | 2C11C0B7-FA6D-46B1-AEFB-649173D81394 |
| 204 | ON | 408 | 28562 | C66B90FD-0F0A-404A-AA6E-FE82E3371296 |
| 205 | OFF | 409 | 28563 | 60D0881F-7AD1-4595-841A-70B237B19C51 |
| 205 | ON | 410 | 28564 | 9DD60DA2-5927-4DF0-B734-8FADA4B2214F |
| 206 | OFF | 411 | 28565 | 1046C452-A63C-468B-96FA-765A11A47078 |
| 206 | ON | 412 | 28566 | 483BE33F-39EB-4073-B763-F03886352B8A |
| 207 | OFF | 413 | 28567 | 3C5C88FB-AE7B-4A63-9FDD-6B01753830E6 |
| 207 | ON | 414 | 28568 | BA1F3D3F-A66D-499F-B97D-8A362B5C45B5 |
| 208 | OFF | 415 | 28569 | 3DD09C11-3300-46BA-ACE0-1CB185CAB1AB |
| 208 | ON | 416 | 28571 | A081A3CB-6E2C-477E-8D87-1C767C7F4717 |
| 209 | OFF | 417 | 28572 | 40CCB4A0-D589-40EE-8ADA-682843AFF66E |
| 209 | ON | 418 | 28573 | 7B550EE8-5A4B-4084-9E34-4290AAF19D91 |
| 210 | OFF | 419 | 28574 | F58E7113-D5B6-4F0E-A9A2-CAA105CBBB93 |
| 210 | ON | 420 | 28575 | 48B5FA07-DE0E-433F-874E-092A39311E48 |
| 211 | OFF | 421 | 28576 | AE2A472A-616F-429C-8242-D0E32C86AA00 |
| 211 | ON | 422 | 28578 | FBC5292E-9445-4736-BC1A-88E919DBC8B7 |
| 212 | OFF | 423 | 28579 | 91A03AA0-4F3B-470D-AE03-D675F776574D |
| 212 | ON | 424 | 28580 | A77750BB-9384-44F1-BACB-47CD7BDBA125 |
| 213 | OFF | 425 | 28581 | 8139DED9-DA0B-463E-B2F3-4F707F289112 |
| 213 | ON | 426 | 28582 | 86439B50-0AA2-4747-AF8D-92A8244266AF |
| 214 | OFF | 427 | 28583 | C1480942-2D1B-4E85-BC7C-C10C32FF55F4 |
| 214 | ON | 428 | 28584 | 1910BAC1-7CD9-4045-9A52-96DC23D852F2 |
| 215 | OFF | 429 | 28586 | EC628AA4-E525-4812-AC2D-87764ACB4D68 |
| 215 | ON | 430 | 28587 | 82D05D1E-ACF8-4A70-B68F-7E620B34C029 |
| 216 | OFF | 431 | 28588 | 5284D2A9-AF6E-4C93-BD8E-4200C54B1A91 |
| 216 | ON | 432 | 28589 | 28F99720-57B5-4EB0-BE09-27DAB91E94B3 |
| 217 | OFF | 433 | 28590 | A5FA777B-F925-4126-B2AE-535F44EB3B28 |
| 217 | ON | 434 | 28591 | E6C8CF62-E1FD-4A27-AF7B-84AF48DAF07D |
| 218 | OFF | 435 | 28592 | 463F82DF-7E54-4CD4-B0AB-8647FB5CE223 |
| 218 | ON | 436 | 28593 | 8FEA53DA-24F5-4DBE-8DC8-89995838DC7D |
| 219 | OFF | 437 | 28595 | C1527E2A-E05D-4D90-BD75-20EE09F97537 |
| 219 | ON | 438 | 28596 | 16F1562D-7CA1-431C-AA94-5B620CC839D0 |
| 220 | OFF | 439 | 28597 | 88A8AF91-CA80-4ABD-A3AA-9210DCE48512 |
| 220 | ON | 440 | 28598 | 851B9991-DECE-4550-BB4A-7F3D009E8818 |
| 221 | OFF | 441 | 28599 | 81FB116E-7321-4CB1-8943-7AAEBFE801DC |
| 221 | ON | 442 | 28600 | 3058C619-E5F7-401B-AE92-F15C18E51C4C |
| 222 | OFF | 443 | 28601 | F6A5153F-FF42-4186-908E-56DB164A19A4 |
| 222 | ON | 444 | 28602 | 6F387C15-7725-4249-BB53-E7A336570ED0 |
| 223 | OFF | 445 | 28604 | 5A621387-9090-4DAC-8440-613ECF533E2D |
| 223 | ON | 446 | 28605 | ABBFA6BC-294B-4956-8DD6-799D56CD6BA3 |
| 224 | OFF | 447 | 28606 | 619D6F50-DEAD-4FE0-A9B8-BC458497B431 |
| 224 | ON | 448 | 28607 | 7694F1E9-529B-49EE-B062-2EBD0118800C |
| 225 | OFF | 449 | 28608 | 5ED2E0C0-F5AC-4608-8ABA-122EB8AD783C |
| 225 | ON | 450 | 28609 | 4782A02F-287A-4792-AACF-6DA57441E1D3 |
| 226 | OFF | 451 | 28610 | 8E5B81A3-D610-42C3-8046-633E56366E7A |
| 226 | ON | 452 | 28611 | 2E4024EF-DEAC-4C03-85F6-4F872D4433C2 |
| 227 | OFF | 453 | 28613 | 49808846-B221-4AA8-8B75-7D24F53D91D2 |
| 227 | ON | 454 | 28614 | C4494392-C2B8-4787-9BA5-275F181C7A2D |
| 228 | OFF | 455 | 28615 | DADD0422-8FA9-4AA9-A957-A3DF90642025 |
| 228 | ON | 456 | 28616 | C0226CAA-3065-4036-89B5-F5AAF973AFC3 |
| 229 | OFF | 457 | 28617 | CDA02A34-8629-43A4-9284-8D3804AA97A4 |
| 229 | ON | 458 | 28618 | 4403EC73-A6BE-4DB1-B8C1-FFB429D0E76F |
| 230 | OFF | 459 | 28619 | CB871A60-D178-4AC3-BE54-5BD264DFE5C1 |
| 230 | ON | 460 | 28620 | 9047CA04-5063-4652-A637-3C54A77B1B81 |
| 231 | OFF | 461 | 28622 | FA98E222-987A-4457-8C09-6D780D0E8906 |
| 231 | ON | 462 | 28623 | 87A3694F-1920-4AB0-AA60-992AB87D0F34 |
| 232 | OFF | 463 | 28624 | 2D1ECDC8-3AFE-4015-8F57-5B98A2089B5B |
| 232 | ON | 464 | 28625 | 7601643E-533E-4558-9B18-BEF7E7B7214B |
| 233 | OFF | 465 | 28626 | C159D0A1-5ACD-4040-A192-33F945F72A15 |
| 233 | ON | 466 | 28627 | A8D4D33B-7191-47D9-8A4E-8DAECDF958EF |
| 234 | OFF | 467 | 28628 | 8BA1B77F-599F-4B28-B8B2-1796E2E52418 |
| 234 | ON | 468 | 28629 | 1A9B5F80-73B3-4781-8CA2-BDA0D67E7010 |
| 235 | OFF | 469 | 28631 | EE71EF9C-A5DC-4F59-A0E2-C9015A6422FF |
| 235 | ON | 470 | 28632 | 0768602B-229C-4EC9-8C82-C2AA7F566EFC |
| 236 | OFF | 471 | 28633 | 7CFA1962-B14E-4FBF-952E-3E4774EA10A7 |
| 236 | ON | 472 | 28634 | 8EAA1F45-51EA-4F4C-A192-61573DE4CAA4 |
| 237 | OFF | 473 | 28635 | 64E4C4A9-F38D-4F1D-9B52-9F9BA8CE034D |
| 237 | ON | 474 | 28636 | 208A1346-9128-447B-B549-BC33A34F8CA4 |
| 238 | OFF | 475 | 28637 | BFEA72EC-72FD-493F-BF68-5642AD656CEB |
| 238 | ON | 476 | 28638 | 0BC55732-997B-4E27-9B81-7AFBABD27FE9 |
| 239 | OFF | 477 | 28640 | 3332B770-42D8-4572-8029-46E532C143ED |
| 239 | ON | 478 | 28641 | 7E1464C0-6BB8-46BE-B2FD-A9B7C0B3058B |
| 240 | OFF | 479 | 28642 | 6FC45FEB-7D80-477F-8D91-00D7D267E960 |
| 240 | ON | 480 | 28643 | 47D27735-8376-4EFA-8E39-F4C5981EE276 |
| 241 | OFF | 481 | 28644 | 8801F02A-E845-494A-BB99-4432888CC291 |
| 241 | ON | 482 | 28645 | C40DCB18-E090-4BB2-8660-3651B39E15E5 |
| 242 | OFF | 483 | 28646 | D3498203-5AD0-4272-87F7-DDC22443A7C7 |
| 242 | ON | 484 | 28647 | CAAFFB1E-CB9A-45C3-AFFD-E54DC02396D7 |
| 243 | OFF | 485 | 28648 | 35234F41-6D39-400F-9C1C-E3FDE783CF9C |
| 243 | ON | 486 | 28650 | 59D3497E-4F9B-4F4A-9646-374E04809F1A |
| 244 | OFF | 487 | 28651 | 21A6FD01-E99B-4418-8EFF-69C6E6D4975B |
| 244 | ON | 488 | 28652 | 0D1D3D8B-EC6C-4085-9156-35EA745F7E1E |
| 245 | OFF | 489 | 28653 | E1AF0723-B183-4583-B397-548AA7CEB138 |
| 245 | ON | 490 | 28654 | 35478697-01BD-497E-B69C-28B24A714DC8 |
| 246 | OFF | 491 | 28655 | E8F5E905-803E-4816-AEE6-B1044D7BBEFB |
| 246 | ON | 492 | 28656 | F4707E67-8F8F-4715-99CB-8E4CB0C2B56F |
| 247 | OFF | 493 | 28657 | F7A36C3A-C8EB-4064-9A8A-C1F3088E41DF |
| 247 | ON | 494 | 28659 | 2481E1F4-7322-4F95-85FF-5F842A6CB425 |
| 248 | OFF | 495 | 28660 | F5936BC9-65F3-4368-932C-99818AD67616 |
| 248 | ON | 496 | 28661 | D20B7562-D321-4BD4-A04C-8EF306F10203 |
| 249 | OFF | 497 | 28662 | 6FD866C2-A66E-4E64-91DB-E8170F5C2072 |
| 249 | ON | 498 | 28663 | 446D8F69-2B15-427A-98F0-E07DB2197967 |
| 250 | OFF | 499 | 28664 | 2FE52BF6-0E85-4385-9E20-82651F41EE3A |
| 250 | ON | 500 | 28665 | 7C554014-5D96-4E37-B23A-5C13D46EE9FB |
