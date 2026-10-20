# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 89.000 | 50.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 75.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | not sent | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 83.000 | 67.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 55.000 | 37.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 84.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 137.000 | 77.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | not sent | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 115.000 | 56.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | not sent | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 78.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 77.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 58.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 51.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | not sent | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 82.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 121.000 | 65.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 86.000 | 61.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 59.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 43.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 71.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 38.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | not sent | handshake | h2 | false | 31.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 81.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 105.000 | 54.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 86.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 400 | handshake | h2 | false | 237.000 | 214.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 60.000 | 51.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 37.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | not sent | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 77.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 42.000 | 30.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | not sent | handshake | h2 | false | 55.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 59.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 55.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 71.000 | 34.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 84.000 | 44.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 83.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 59.000 | 36.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | not sent | handshake | h2 | false | 56.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 52.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 103.000 | 57.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 58.000 | 28.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 67.000 | 41.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 61.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 65.000 | 33.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 85.000 | 56.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 78.000 | 46.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | not sent | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 80.000 | 56.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 51.000 | 39.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 54.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 84.000 | 49.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 83.000 | 53.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 64.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 99.000 | 58.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 131.000 | 91.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 37.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 146.000 | 91.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 44.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 59.000 | 48.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 88.000 | 60.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | not sent | handshake | h2 | false | 43.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | not sent | handshake | h2 | false | 50.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 70.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 61.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 84.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 73.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 89.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | not sent | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 200 | handshake | h2 | false | 231.000 | 193.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 373.000 | 317.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | not sent | handshake | h2 | false | 48.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | not sent | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 181.000 | 109.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | not sent | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 215.000 | 157.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 79.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 73.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | not sent | handshake | h2 | false | 42.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 51.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | not sent | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 127.000 | 74.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 200 | handshake | h2 | false | 57.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 92.000 | 71.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 53.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 70.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 95.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 83.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 75.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 157.000 | 131.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 200 | handshake | h2 | false | 74.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 44.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | not sent | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 47.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 54.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 49.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 200 | handshake | h2 | false | 48.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 69.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 178.000 | 149.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 50.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | not sent | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | handshake | h2 | false | 65.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 103.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | not sent | handshake | h2 | false | 41.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | handshake | h2 | false | 106.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 42.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 71.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 88.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 111.000 | 75.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 200 | handshake | h2 | false | 73.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 75.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 52.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | not sent | handshake | h2 | false | 38.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 200 | handshake | h2 | false | 52.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 53.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 59.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | handshake | h2 | false | 104.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 48.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 200 | handshake | h2 | false | 80.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 75.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 200 | handshake | h2 | false | 68.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 91.000 | 80.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 91.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 38.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | not sent | handshake | h2 | false | 30.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 52.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 41.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 76.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | handshake | h2 | false | 120.000 | 63.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 37.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 63.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 44.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 200 | handshake | h2 | false | 82.000 | 55.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 30.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | not sent | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 70.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 200 | handshake | h2 | false | 105.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | OFF | completed | — | handshake | h2 | false | 233.000 | 221.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | ON | completed | 200 | handshake | h2 | false | 151.000 | 75.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | OFF | completed | — | handshake | h2 | false | 222.000 | 167.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | ON | completed | 200 | handshake | h2 | false | 79.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | OFF | completed | — | handshake | h2 | false | 91.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | ON | completed | not sent | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | OFF | completed | — | handshake | h2 | false | 73.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | OFF | completed | — | handshake | h2 | false | 291.000 | 234.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | ON | completed | not sent | handshake | h2 | false | 33.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | OFF | completed | — | handshake | h2 | false | 45.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | ON | completed | not sent | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 142.251.169.81 |
| omnient | 109 | ON | completed | 400 | handshake | h2 | false | 202.000 | 147.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | OFF | completed | — | handshake | h2 | false | 47.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | ON | completed | 200 | handshake | h2 | false | 154.000 | 59.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 142.251.169.81 |
| omnient | 111 | ON | completed | 200 | handshake | h2 | false | 56.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | OFF | completed | — | handshake | h2 | false | 38.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | ON | completed | not sent | handshake | h2 | false | 44.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | OFF | completed | — | handshake | h2 | false | 184.000 | 150.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | ON | completed | not sent | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | OFF | completed | — | handshake | h2 | false | 58.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | ON | completed | not sent | handshake | h2 | false | 42.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | OFF | completed | — | handshake | h2 | false | 56.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | ON | completed | not sent | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | ON | completed | not sent | handshake | h2 | false | 39.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | OFF | completed | — | handshake | h2 | false | 52.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | ON | completed | 200 | handshake | h2 | false | 104.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | ON | completed | 200 | handshake | h2 | false | 88.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | OFF | completed | — | handshake | h2 | false | 32.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | ON | completed | 400 | handshake | h2 | false | 218.000 | 187.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | OFF | completed | — | handshake | h2 | false | 227.000 | 170.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | ON | completed | not sent | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | OFF | completed | — | handshake | h2 | false | 36.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | ON | completed | 200 | handshake | h2 | false | 72.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | OFF | completed | — | handshake | h2 | false | 41.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | ON | completed | 200 | handshake | h2 | false | 69.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | OFF | completed | — | handshake | h2 | false | 250.000 | 208.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | ON | completed | 200 | handshake | h2 | false | 54.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | OFF | completed | — | handshake | h2 | false | 77.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | ON | completed | 200 | handshake | h2 | false | 129.000 | 83.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | OFF | completed | — | handshake | h2 | false | 67.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | ON | completed | not sent | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 127 | OFF | completed | — | handshake | h2 | false | 53.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 127 | ON | completed | 200 | handshake | h2 | false | 45.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 128 | OFF | completed | — | handshake | h2 | false | 78.000 | 43.000 | 2404:6800:400b:c019::451 |
| omnient | 128 | ON | completed | not sent | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 129 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 129 | ON | completed | not sent | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 130 | OFF | completed | — | handshake | h2 | false | 66.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 130 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 131 | OFF | completed | — | handshake | h2 | false | 71.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 131 | ON | completed | not sent | handshake | h2 | false | 33.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 132 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 132 | ON | completed | 200 | handshake | h2 | false | 92.000 | 81.000 | 2404:6800:400b:c019::451 |
| omnient | 133 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 133 | ON | completed | 200 | handshake | h2 | false | 72.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 134 | OFF | completed | — | handshake | h2 | false | 35.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 134 | ON | completed | 200 | handshake | h2 | false | 80.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 135 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 135 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 136 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 136 | ON | completed | not sent | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 137 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 137 | ON | completed | 200 | handshake | h2 | false | 86.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 138 | OFF | completed | — | handshake | h2 | false | 156.000 | 71.000 | 2404:6800:400b:c019::451 |
| omnient | 138 | ON | completed | 200 | handshake | h2 | false | 81.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 139 | OFF | completed | — | handshake | h2 | false | 112.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 139 | ON | completed | 400 | handshake | h2 | false | 437.000 | 380.000 | 2404:6800:400b:c019::451 |
| omnient | 140 | OFF | completed | — | handshake | h2 | false | 55.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 140 | ON | completed | not sent | handshake | h2 | false | 37.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 141 | OFF | completed | — | handshake | h2 | false | 94.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 141 | ON | completed | unknown | handshake | h2 | false | 123.000 | 67.000 | 2404:6800:400b:c019::451 |
| omnient | 142 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 142 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 143 | OFF | completed | — | handshake | h2 | false | 58.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 143 | ON | completed | 200 | handshake | h2 | false | 104.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 144 | OFF | completed | — | handshake | h2 | false | 88.000 | 67.000 | 2404:6800:400b:c019::451 |
| omnient | 144 | ON | completed | 200 | handshake | h2 | false | 86.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 145 | OFF | completed | — | handshake | h2 | false | 90.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 145 | ON | completed | not sent | handshake | h2 | false | 48.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 146 | OFF | completed | — | handshake | h2 | false | 48.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 146 | ON | completed | 200 | handshake | h2 | false | 100.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 147 | OFF | completed | — | handshake | h2 | false | 65.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 147 | ON | completed | not sent | handshake | h2 | false | 37.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 148 | OFF | completed | — | handshake | h2 | false | 34.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 148 | ON | completed | 200 | handshake | h2 | false | 84.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 149 | OFF | completed | — | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 149 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 150 | OFF | completed | — | handshake | h2 | false | 75.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 150 | ON | completed | 200 | handshake | h2 | false | 212.000 | 155.000 | 2404:6800:400b:c019::451 |
| omnient | 151 | OFF | completed | — | handshake | h2 | false | 42.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 151 | ON | completed | not sent | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 152 | OFF | completed | — | handshake | h2 | false | 72.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 152 | ON | completed | 200 | handshake | h2 | false | 54.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 153 | OFF | completed | — | handshake | h2 | false | 84.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 153 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 154 | OFF | completed | — | handshake | h2 | false | 71.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 154 | ON | completed | 200 | handshake | h2 | false | 44.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 155 | OFF | completed | — | handshake | h2 | false | 195.000 | 140.000 | 2404:6800:400b:c019::451 |
| omnient | 155 | ON | completed | 200 | handshake | h2 | false | 177.000 | 160.000 | 2404:6800:400b:c019::451 |
| omnient | 156 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 156 | ON | completed | 200 | handshake | h2 | false | 68.000 | 44.000 | 2404:6800:400b:c019::451 |
| omnient | 157 | OFF | completed | — | handshake | h2 | false | 75.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 157 | ON | completed | 200 | handshake | h2 | false | 73.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 158 | OFF | completed | — | handshake | h2 | false | 68.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 158 | ON | completed | 400 | handshake | h2 | false | 34.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 159 | OFF | completed | — | handshake | h2 | false | 71.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 159 | ON | completed | 200 | handshake | h2 | false | 104.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 160 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 160 | ON | completed | 200 | handshake | h2 | false | 109.000 | 69.000 | 2404:6800:400b:c019::451 |
| omnient | 161 | OFF | completed | — | handshake | h2 | false | 103.000 | 71.000 | 2404:6800:400b:c019::451 |
| omnient | 161 | ON | completed | 200 | handshake | h2 | false | 81.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 162 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 162 | ON | completed | 200 | handshake | h2 | false | 59.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 163 | OFF | completed | — | handshake | h2 | false | 59.000 | 48.000 | 2404:6800:400b:c019::451 |
| omnient | 163 | ON | completed | not sent | handshake | h2 | false | 40.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 164 | OFF | completed | — | handshake | h2 | false | 69.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 164 | ON | completed | not sent | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 165 | OFF | completed | — | handshake | h2 | false | 49.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 165 | ON | completed | 200 | handshake | h2 | false | 77.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 166 | OFF | completed | — | handshake | h2 | false | 33.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 166 | ON | completed | 200 | handshake | h2 | false | 188.000 | 92.000 | 2404:6800:400b:c019::451 |
| omnient | 167 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 167 | ON | completed | not sent | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 168 | OFF | completed | — | handshake | h2 | false | 58.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 168 | ON | completed | not sent | handshake | h2 | false | 52.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 169 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 169 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 170 | OFF | completed | — | handshake | h2 | false | 42.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 170 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 171 | OFF | completed | — | handshake | h2 | false | 70.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 171 | ON | completed | not sent | handshake | h2 | false | 48.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 172 | OFF | completed | — | handshake | h2 | false | 33.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 172 | ON | completed | not sent | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 173 | OFF | completed | — | handshake | h2 | false | 42.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 173 | ON | completed | 200 | handshake | h2 | false | 66.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 174 | OFF | completed | — | handshake | h2 | false | 112.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 174 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 175 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 175 | ON | completed | not sent | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 176 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 176 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 177 | OFF | completed | — | handshake | h2 | false | 85.000 | 73.000 | 2404:6800:400b:c019::451 |
| omnient | 177 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 178 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 178 | ON | completed | 200 | handshake | h2 | false | 63.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 179 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 179 | ON | completed | not sent | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 180 | OFF | completed | — | handshake | h2 | false | 34.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 180 | ON | completed | not sent | handshake | h2 | false | 48.000 | 26.000 | 2404:6800:400b:c015::451 |
| omnient | 181 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 181 | ON | completed | 200 | handshake | h2 | false | 107.000 | 93.000 | 2404:6800:400b:c015::451 |
| omnient | 182 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 182 | ON | completed | 200 | handshake | h2 | false | 110.000 | 58.000 | 2404:6800:400b:c015::451 |
| omnient | 183 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 183 | ON | completed | 200 | handshake | h2 | false | 123.000 | 66.000 | 2404:6800:400b:c015::451 |
| omnient | 184 | OFF | completed | — | handshake | h2 | false | 87.000 | 36.000 | 2404:6800:400b:c015::451 |
| omnient | 184 | ON | completed | not sent | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 185 | OFF | completed | — | handshake | h2 | false | 48.000 | 28.000 | 2404:6800:400b:c015::451 |
| omnient | 185 | ON | completed | 200 | handshake | h2 | false | 82.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 186 | OFF | completed | — | handshake | h2 | false | 86.000 | 40.000 | 2404:6800:400b:c015::451 |
| omnient | 186 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 187 | OFF | completed | — | handshake | h2 | false | 50.000 | 32.000 | 2404:6800:400b:c015::451 |
| omnient | 187 | ON | completed | not sent | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 188 | OFF | completed | — | handshake | h2 | false | 68.000 | 38.000 | 2404:6800:400b:c015::451 |
| omnient | 188 | ON | completed | not sent | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 189 | OFF | completed | — | handshake | h2 | false | 40.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 189 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 190 | OFF | completed | — | handshake | h2 | false | 40.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 190 | ON | completed | 200 | handshake | h2 | false | 317.000 | 291.000 | 2404:6800:400b:c015::451 |
| omnient | 191 | OFF | completed | — | handshake | h2 | false | 81.000 | 24.000 | 2404:6800:400b:c015::451 |
| omnient | 191 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 192 | OFF | completed | — | handshake | h2 | false | 151.000 | 137.000 | 2404:6800:400b:c015::451 |
| omnient | 192 | ON | completed | not sent | handshake | h2 | false | 35.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 193 | OFF | completed | — | handshake | h2 | false | 97.000 | 39.000 | 2404:6800:400b:c015::451 |
| omnient | 193 | ON | completed | 200 | handshake | h2 | false | 74.000 | 47.000 | 2404:6800:400b:c015::451 |
| omnient | 194 | OFF | completed | — | handshake | h2 | false | 50.000 | 43.000 | 2404:6800:400b:c015::451 |
| omnient | 194 | ON | completed | 200 | handshake | h2 | false | 74.000 | 41.000 | 2404:6800:400b:c015::451 |
| omnient | 195 | OFF | completed | — | handshake | h2 | false | 65.000 | 33.000 | 2404:6800:400b:c015::451 |
| omnient | 195 | ON | completed | 200 | handshake | h2 | false | 66.000 | 32.000 | 2404:6800:400b:c015::451 |
| omnient | 196 | OFF | completed | — | handshake | h2 | false | 89.000 | 51.000 | 2404:6800:400b:c015::451 |
| omnient | 196 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 197 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 197 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 198 | OFF | completed | — | handshake | h2 | false | 32.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 198 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 199 | OFF | completed | — | handshake | h2 | false | 56.000 | 31.000 | 2404:6800:400b:c015::451 |
| omnient | 199 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 200 | OFF | completed | — | handshake | h2 | false | 64.000 | 28.000 | 2404:6800:400b:c015::451 |
| omnient | 200 | ON | completed | not sent | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 201 | OFF | completed | — | handshake | h2 | false | 72.000 | 42.000 | 2404:6800:400b:c015::451 |
| omnient | 201 | ON | completed | 200 | handshake | h2 | false | 64.000 | 32.000 | 2404:6800:400b:c015::451 |
| omnient | 202 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 202 | ON | completed | not sent | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 203 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 203 | ON | completed | not sent | handshake | h2 | false | 60.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 204 | OFF | completed | — | handshake | h2 | false | 87.000 | 43.000 | 2404:6800:400b:c015::451 |
| omnient | 204 | ON | completed | 200 | handshake | h2 | false | 121.000 | 70.000 | 2404:6800:400b:c015::451 |
| omnient | 205 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 205 | ON | completed | 200 | handshake | h2 | false | 93.000 | 24.000 | 2404:6800:400b:c015::451 |
| omnient | 206 | OFF | completed | — | handshake | h2 | false | 53.000 | 31.000 | 2404:6800:400b:c015::451 |
| omnient | 206 | ON | completed | not sent | handshake | h2 | false | 32.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 207 | OFF | completed | — | handshake | h2 | false | 83.000 | 41.000 | 2404:6800:400b:c015::451 |
| omnient | 207 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 208 | OFF | completed | — | handshake | h2 | false | 50.000 | 39.000 | 2404:6800:400b:c015::451 |
| omnient | 208 | ON | completed | 200 | handshake | h2 | false | 125.000 | 65.000 | 2404:6800:400b:c015::451 |
| omnient | 209 | OFF | completed | — | handshake | h2 | false | 123.000 | 66.000 | 2404:6800:400b:c015::451 |
| omnient | 209 | ON | completed | 200 | handshake | h2 | false | 31.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 210 | OFF | completed | — | handshake | h2 | false | 80.000 | 50.000 | 2404:6800:400b:c015::451 |
| omnient | 210 | ON | completed | not sent | handshake | h2 | false | 44.000 | 35.000 | 2404:6800:400b:c015::451 |
| omnient | 211 | OFF | completed | — | handshake | h2 | false | 113.000 | 105.000 | 2404:6800:400b:c015::451 |
| omnient | 211 | ON | completed | 200 | handshake | h2 | false | 47.000 | 26.000 | 2404:6800:400b:c015::451 |
| omnient | 212 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 212 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 213 | OFF | completed | — | handshake | h2 | false | 71.000 | 34.000 | 2404:6800:400b:c015::451 |
| omnient | 213 | ON | completed | not sent | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 214 | OFF | completed | — | handshake | h2 | false | 25.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 214 | ON | completed | not sent | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 215 | OFF | completed | — | handshake | h2 | false | 212.000 | 121.000 | 2404:6800:400b:c015::451 |
| omnient | 215 | ON | completed | not sent | handshake | h2 | false | 33.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 216 | OFF | completed | — | handshake | h2 | false | 113.000 | 72.000 | 2404:6800:400b:c015::451 |
| omnient | 216 | ON | completed | 200 | handshake | h2 | false | 61.000 | 38.000 | 2404:6800:400b:c015::451 |
| omnient | 217 | OFF | completed | — | handshake | h2 | false | 301.000 | 258.000 | 2404:6800:400b:c015::451 |
| omnient | 217 | ON | completed | 200 | handshake | h2 | false | 64.000 | 42.000 | 2404:6800:400b:c015::451 |
| omnient | 218 | OFF | completed | — | handshake | h2 | false | 85.000 | 49.000 | 2404:6800:400b:c015::451 |
| omnient | 218 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 219 | OFF | completed | — | handshake | h2 | false | 58.000 | 32.000 | 2404:6800:400b:c015::451 |
| omnient | 219 | ON | completed | 200 | handshake | h2 | false | 71.000 | 36.000 | 2404:6800:400b:c015::451 |
| omnient | 220 | OFF | completed | — | handshake | h2 | false | 75.000 | 40.000 | 2404:6800:400b:c015::451 |
| omnient | 220 | ON | completed | not sent | handshake | h2 | false | 43.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 221 | OFF | completed | — | handshake | h2 | false | 83.000 | 45.000 | 2404:6800:400b:c015::451 |
| omnient | 221 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 222 | OFF | completed | — | handshake | h2 | false | 52.000 | 43.000 | 2404:6800:400b:c015::451 |
| omnient | 222 | ON | completed | not sent | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 223 | OFF | completed | — | handshake | h2 | false | 83.000 | 52.000 | 2404:6800:400b:c015::451 |
| omnient | 223 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 224 | OFF | completed | — | handshake | h2 | false | 41.000 | 25.000 | 2404:6800:400b:c015::451 |
| omnient | 224 | ON | completed | not sent | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 225 | OFF | completed | — | handshake | h2 | false | 45.000 | 25.000 | 2404:6800:400b:c015::451 |
| omnient | 225 | ON | completed | 200 | handshake | h2 | false | 85.000 | 60.000 | 2404:6800:400b:c015::451 |
| omnient | 226 | OFF | completed | — | handshake | h2 | false | 38.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 226 | ON | completed | not sent | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 227 | OFF | completed | — | handshake | h2 | false | 79.000 | 48.000 | 2404:6800:400b:c015::451 |
| omnient | 227 | ON | completed | not sent | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 228 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 228 | ON | completed | 200 | handshake | h2 | false | 40.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 229 | OFF | completed | — | handshake | h2 | false | 45.000 | 27.000 | 2404:6800:400b:c015::451 |
| omnient | 229 | ON | completed | 200 | handshake | h2 | false | 66.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 230 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 230 | ON | completed | 200 | handshake | h2 | false | 61.000 | 35.000 | 2404:6800:400b:c015::451 |
| omnient | 231 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 231 | ON | completed | 200 | handshake | h2 | false | 86.000 | 30.000 | 2404:6800:400b:c015::451 |
| omnient | 232 | OFF | completed | — | handshake | h2 | false | 57.000 | 41.000 | 2404:6800:400b:c015::451 |
| omnient | 232 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 233 | OFF | completed | — | handshake | h2 | false | 88.000 | 38.000 | 2404:6800:400b:c015::451 |
| omnient | 233 | ON | completed | not sent | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 234 | OFF | completed | — | handshake | h2 | false | 80.000 | 44.000 | 2404:6800:400b:c015::451 |
| omnient | 234 | ON | completed | not sent | handshake | h2 | false | 56.000 | 31.000 | 2404:6800:400b:c015::451 |
| omnient | 235 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 235 | ON | completed | 200 | handshake | h2 | false | 76.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 236 | OFF | completed | — | handshake | h2 | false | 41.000 | 22.000 | 2404:6800:400b:c015::451 |
| omnient | 236 | ON | completed | 200 | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 237 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 237 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 238 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 238 | ON | completed | 200 | handshake | h2 | false | 58.000 | 36.000 | 2404:6800:400b:c015::451 |
| omnient | 239 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 239 | ON | completed | not sent | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 240 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 240 | ON | completed | 200 | handshake | h2 | false | 46.000 | 29.000 | 2404:6800:400b:c015::451 |
| omnient | 241 | OFF | completed | — | handshake | h2 | false | 43.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 241 | ON | completed | 200 | handshake | h2 | false | 77.000 | 38.000 | 2404:6800:400b:c015::451 |
| omnient | 242 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 242 | ON | completed | not sent | handshake | h2 | false | 62.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 243 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 243 | ON | completed | 200 | handshake | h2 | false | 83.000 | 43.000 | 2404:6800:400b:c015::451 |
| omnient | 244 | OFF | completed | — | handshake | h2 | false | 70.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 244 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 245 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 245 | ON | completed | 200 | handshake | h2 | false | 76.000 | 51.000 | 2404:6800:400b:c015::451 |
| omnient | 246 | OFF | completed | — | handshake | h2 | false | 72.000 | 38.000 | 2404:6800:400b:c015::451 |
| omnient | 246 | ON | completed | not sent | handshake | h2 | false | 51.000 | 26.000 | 2404:6800:400b:c015::451 |
| omnient | 247 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 247 | ON | completed | 200 | handshake | h2 | false | 106.000 | 78.000 | 2404:6800:400b:c015::451 |
| omnient | 248 | OFF | completed | — | handshake | h2 | false | 94.000 | 54.000 | 2404:6800:400b:c015::451 |
| omnient | 248 | ON | completed | 200 | handshake | h2 | false | 49.000 | 33.000 | 2404:6800:400b:c015::451 |
| omnient | 249 | OFF | completed | — | handshake | h2 | false | 40.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 249 | ON | completed | 200 | handshake | h2 | false | 71.000 | 55.000 | 2404:6800:400b:c015::451 |
| omnient | 250 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 250 | ON | completed | not sent | handshake | h2 | false | 36.000 | 27.000 | 2404:6800:400b:c015::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 208.778 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 208.850 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 203.755 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 203.677 | count=0 | post-open POST | post-open POST |
| omnient | 3 | OFF | 200.595 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 206.853 | count=0 | post-open POST | post-open POST |
| omnient | 4 | OFF | 204.696 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 200.507 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 208.562 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 206.742 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 208.765 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 208.891 | count=0 | post-open POST | post-open POST |
| omnient | 7 | OFF | 208.834 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 207.078 | count=0 | post-open POST | post-open POST |
| omnient | 8 | OFF | 206.596 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 208.795 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 207.936 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 205.145 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 206.259 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 206.785 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 204.864 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 205.513 | count=0 | post-open POST | post-open POST |
| omnient | 12 | OFF | 203.547 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 203.773 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 204.263 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 207.894 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 204.811 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 205.304 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 209.482 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 206.631 | count=0 | post-open POST | post-open POST |
| omnient | 16 | OFF | 201.291 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 200.610 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 206.703 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 208.714 | count=0 | post-open POST | post-open POST |
| omnient | 18 | OFF | 206.740 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 206.410 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 208.704 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 207.857 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 207.782 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 208.888 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 203.382 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 208.543 | count=0 | post-open POST | post-open POST |
| omnient | 22 | OFF | 205.354 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 206.652 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 207.664 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 201.110 | count=0 | post-open POST | post-open POST |
| omnient | 24 | OFF | 207.813 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 203.204 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 204.483 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 201.583 | count=0 | early POST | post-open POST |
| omnient | 26 | OFF | 209.467 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 201.808 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 206.853 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 206.086 | count=0 | post-open POST | post-open POST |
| omnient | 28 | OFF | 204.818 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 208.796 | count=0 | post-open POST | post-open POST |
| omnient | 29 | OFF | 205.499 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 203.965 | count=0 | post-open POST | post-open POST |
| omnient | 30 | OFF | 208.757 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 206.666 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 203.855 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 206.483 | count=0 | post-open POST | post-open POST |
| omnient | 32 | OFF | 201.278 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 206.283 | count=0 | post-open POST | post-open POST |
| omnient | 33 | OFF | 201.980 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 206.687 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 204.566 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 204.670 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 209.726 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 208.740 | count=0 | post-open POST | post-open POST |
| omnient | 36 | OFF | 208.479 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 203.195 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 209.148 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 200.321 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 208.027 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 206.368 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 203.013 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 208.782 | count=0 | post-open POST | post-open POST |
| omnient | 40 | OFF | 208.224 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 205.287 | count=0 | post-open POST | post-open POST |
| omnient | 41 | OFF | 201.446 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 200.694 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 203.445 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 203.691 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 208.822 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 207.773 | count=0 | post-open POST | post-open POST |
| omnient | 44 | OFF | 210.436 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 201.742 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 202.800 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 205.024 | count=0 | post-open POST | post-open POST |
| omnient | 46 | OFF | 208.083 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 206.849 | count=0 | post-open POST | post-open POST |
| omnient | 47 | OFF | 208.683 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 208.901 | count=0 | post-open POST | post-open POST |
| omnient | 48 | OFF | 208.663 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 205.045 | count=0 | post-open POST | post-open POST |
| omnient | 49 | OFF | 201.056 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 208.601 | count=0 | post-open POST | post-open POST |
| omnient | 50 | OFF | 206.586 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 206.453 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 202.191 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 203.659 | count=0 | post-open POST | post-open POST |
| omnient | 52 | OFF | 204.483 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 207.567 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 203.834 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 204.625 | count=0 | post-open POST | post-open POST |
| omnient | 54 | OFF | 207.632 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 204.678 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 201.187 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 206.735 | count=0 | post-open POST | post-open POST |
| omnient | 56 | OFF | 201.839 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 207.669 | count=0 | post-open POST | post-open POST |
| omnient | 57 | OFF | 206.614 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 208.967 | count=0 | post-open POST | post-open POST |
| omnient | 58 | OFF | 206.559 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 206.753 | count=0 | post-open POST | post-open POST |
| omnient | 59 | OFF | 203.569 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 204.780 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 201.716 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 201.494 | count=0 | post-open POST | post-open POST |
| omnient | 61 | OFF | 210.548 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 208.395 | count=0 | post-open POST | post-open POST |
| omnient | 62 | OFF | 204.850 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 206.746 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 207.788 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 201.183 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 204.671 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 206.115 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 202.424 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 207.216 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 208.147 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 209.785 | count=0 | post-open POST | post-open POST |
| omnient | 67 | OFF | 201.825 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 207.551 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 208.365 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 204.627 | count=0 | post-open POST | post-open POST |
| omnient | 69 | OFF | 208.352 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 206.316 | count=0 | post-open POST | post-open POST |
| omnient | 70 | OFF | 200.814 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 208.940 | count=0 | post-open POST | post-open POST |
| omnient | 71 | OFF | 206.516 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 207.206 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 206.804 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 202.238 | count=0 | post-open POST | post-open POST |
| omnient | 73 | OFF | 204.775 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 202.910 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 202.864 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 204.760 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 206.396 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 203.661 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 206.176 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 203.292 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 200.864 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 205.923 | count=0 | post-open POST | post-open POST |
| omnient | 78 | OFF | 204.295 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 204.050 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 204.011 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 206.478 | count=0 | post-open POST | post-open POST |
| omnient | 80 | OFF | 201.913 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 206.344 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 206.401 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 203.750 | count=0 | post-open POST | post-open POST |
| omnient | 82 | OFF | 201.393 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 204.251 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 204.928 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 206.747 | count=0 | post-open POST | post-open POST |
| omnient | 84 | OFF | 208.167 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 200.490 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 204.630 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 206.292 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 202.017 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 200.305 | count=0 | post-open POST | post-open POST |
| omnient | 87 | OFF | 206.639 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 201.038 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 208.677 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 200.726 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 204.116 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 207.214 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 207.808 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 205.370 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 200.802 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 206.678 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 206.465 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 205.441 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 204.764 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 208.660 | count=0 | post-open POST | post-open POST |
| omnient | 94 | OFF | 209.369 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 207.198 | count=0 | post-open POST | post-open POST |
| omnient | 95 | OFF | 201.019 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 201.900 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 206.778 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 210.100 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 200.666 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 203.149 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 208.148 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 204.770 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 206.137 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 207.260 | count=0 | post-open POST | post-open POST |
| omnient | 100 | OFF | 200.995 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 205.295 | count=0 | early POST | early POST |
| omnient | 101 | OFF | 208.303 | count=0 | post-open POST | post-open POST |
| omnient | 101 | ON | 200.866 | count=0 | post-open POST | post-open POST |
| omnient | 102 | OFF | 202.599 | count=0 | post-open POST | post-open POST |
| omnient | 102 | ON | 209.038 | count=0 | early POST | early POST |
| omnient | 103 | OFF | 203.791 | count=0 | post-open POST | post-open POST |
| omnient | 103 | ON | 209.905 | count=0 | early POST | early POST |
| omnient | 104 | OFF | 204.943 | count=0 | post-open POST | post-open POST |
| omnient | 104 | ON | 200.690 | count=0 | post-open POST | post-open POST |
| omnient | 105 | OFF | 201.039 | count=0 | post-open POST | post-open POST |
| omnient | 105 | ON | 205.670 | count=0 | early POST | post-open POST |
| omnient | 106 | OFF | 208.648 | count=0 | post-open POST | post-open POST |
| omnient | 106 | ON | 207.568 | count=0 | post-open POST | post-open POST |
| omnient | 107 | OFF | 204.627 | count=0 | post-open POST | post-open POST |
| omnient | 107 | ON | 205.911 | count=0 | post-open POST | post-open POST |
| omnient | 108 | OFF | 206.563 | count=0 | post-open POST | post-open POST |
| omnient | 108 | ON | 203.564 | count=0 | post-open POST | post-open POST |
| omnient | 109 | OFF | 207.922 | count=0 | post-open POST | post-open POST |
| omnient | 109 | ON | 206.150 | count=0 | early POST | early POST |
| omnient | 110 | OFF | 206.851 | count=0 | post-open POST | post-open POST |
| omnient | 110 | ON | 204.739 | count=0 | early POST | early POST |
| omnient | 111 | OFF | 204.033 | count=0 | post-open POST | post-open POST |
| omnient | 111 | ON | 202.587 | count=0 | early POST | early POST |
| omnient | 112 | OFF | 202.265 | count=0 | post-open POST | post-open POST |
| omnient | 112 | ON | 205.921 | count=0 | post-open POST | post-open POST |
| omnient | 113 | OFF | 204.871 | count=0 | post-open POST | post-open POST |
| omnient | 113 | ON | 202.795 | count=0 | post-open POST | post-open POST |
| omnient | 114 | OFF | 209.777 | count=0 | post-open POST | post-open POST |
| omnient | 114 | ON | 203.388 | count=0 | post-open POST | post-open POST |
| omnient | 115 | OFF | 203.498 | count=0 | post-open POST | post-open POST |
| omnient | 115 | ON | 206.423 | count=0 | post-open POST | post-open POST |
| omnient | 116 | OFF | 205.498 | count=0 | post-open POST | post-open POST |
| omnient | 116 | ON | 200.283 | count=0 | post-open POST | post-open POST |
| omnient | 117 | OFF | 204.962 | count=0 | post-open POST | post-open POST |
| omnient | 117 | ON | 205.046 | count=0 | early POST | early POST |
| omnient | 118 | OFF | 210.533 | count=0 | post-open POST | post-open POST |
| omnient | 118 | ON | 208.730 | count=0 | early POST | early POST |
| omnient | 119 | OFF | 206.594 | count=0 | post-open POST | post-open POST |
| omnient | 119 | ON | 201.316 | count=0 | early POST | early POST |
| omnient | 120 | OFF | 200.802 | count=0 | post-open POST | post-open POST |
| omnient | 120 | ON | 209.449 | count=0 | post-open POST | post-open POST |
| omnient | 121 | OFF | 206.240 | count=0 | post-open POST | post-open POST |
| omnient | 121 | ON | 202.066 | count=0 | early POST | early POST |
| omnient | 122 | OFF | 208.257 | count=0 | post-open POST | post-open POST |
| omnient | 122 | ON | 209.869 | count=0 | early POST | early POST |
| omnient | 123 | OFF | 207.972 | count=0 | post-open POST | post-open POST |
| omnient | 123 | ON | 201.029 | count=0 | post-open POST | post-open POST |
| omnient | 124 | OFF | 207.248 | count=0 | post-open POST | post-open POST |
| omnient | 124 | ON | 208.385 | count=0 | early POST | early POST |
| omnient | 125 | OFF | 202.022 | count=0 | post-open POST | post-open POST |
| omnient | 125 | ON | 203.326 | count=0 | early POST | early POST |
| omnient | 126 | OFF | 202.121 | count=0 | post-open POST | post-open POST |
| omnient | 126 | ON | 204.674 | count=0 | post-open POST | post-open POST |
| omnient | 127 | OFF | 206.449 | count=0 | post-open POST | post-open POST |
| omnient | 127 | ON | 206.426 | count=0 | early POST | early POST |
| omnient | 128 | OFF | 201.166 | count=0 | post-open POST | post-open POST |
| omnient | 128 | ON | 201.796 | count=0 | post-open POST | post-open POST |
| omnient | 129 | OFF | 207.876 | count=0 | post-open POST | post-open POST |
| omnient | 129 | ON | 206.628 | count=0 | post-open POST | post-open POST |
| omnient | 130 | OFF | 200.790 | count=0 | post-open POST | post-open POST |
| omnient | 130 | ON | 209.110 | count=0 | post-open POST | post-open POST |
| omnient | 131 | OFF | 206.457 | count=0 | post-open POST | post-open POST |
| omnient | 131 | ON | 206.231 | count=0 | post-open POST | post-open POST |
| omnient | 132 | OFF | 202.436 | count=0 | post-open POST | post-open POST |
| omnient | 132 | ON | 201.918 | count=0 | early POST | early POST |
| omnient | 133 | OFF | 206.914 | count=0 | post-open POST | post-open POST |
| omnient | 133 | ON | 200.361 | count=0 | early POST | early POST |
| omnient | 134 | OFF | 201.856 | count=0 | post-open POST | post-open POST |
| omnient | 134 | ON | 203.865 | count=0 | early POST | early POST |
| omnient | 135 | OFF | 201.740 | count=0 | post-open POST | post-open POST |
| omnient | 135 | ON | 202.709 | count=0 | post-open POST | post-open POST |
| omnient | 136 | OFF | 206.438 | count=0 | post-open POST | post-open POST |
| omnient | 136 | ON | 204.980 | count=0 | post-open POST | post-open POST |
| omnient | 137 | OFF | 202.267 | count=0 | post-open POST | post-open POST |
| omnient | 137 | ON | 206.567 | count=0 | early POST | early POST |
| omnient | 138 | OFF | 206.571 | count=0 | post-open POST | post-open POST |
| omnient | 138 | ON | 207.438 | count=0 | early POST | early POST |
| omnient | 139 | OFF | 205.884 | count=0 | post-open POST | post-open POST |
| omnient | 139 | ON | 208.700 | count=0 | early POST | early POST |
| omnient | 140 | OFF | 204.841 | count=0 | post-open POST | post-open POST |
| omnient | 140 | ON | 201.689 | count=0 | post-open POST | post-open POST |
| omnient | 141 | OFF | 205.888 | count=0 | post-open POST | post-open POST |
| omnient | 141 | ON | 205.716 | count=0 | early POST | early POST |
| omnient | 142 | OFF | 209.597 | count=0 | post-open POST | post-open POST |
| omnient | 142 | ON | 202.552 | count=0 | post-open POST | post-open POST |
| omnient | 143 | OFF | 204.890 | count=0 | post-open POST | post-open POST |
| omnient | 143 | ON | 200.683 | count=0 | early POST | early POST |
| omnient | 144 | OFF | 209.173 | count=0 | post-open POST | post-open POST |
| omnient | 144 | ON | 207.047 | count=0 | early POST | early POST |
| omnient | 145 | OFF | 202.860 | count=0 | post-open POST | post-open POST |
| omnient | 145 | ON | 207.198 | count=0 | post-open POST | post-open POST |
| omnient | 146 | OFF | 209.841 | count=0 | post-open POST | post-open POST |
| omnient | 146 | ON | 202.951 | count=0 | early POST | early POST |
| omnient | 147 | OFF | 202.614 | count=0 | post-open POST | post-open POST |
| omnient | 147 | ON | 202.064 | count=0 | post-open POST | post-open POST |
| omnient | 148 | OFF | 207.248 | count=0 | post-open POST | post-open POST |
| omnient | 148 | ON | 206.703 | count=0 | early POST | early POST |
| omnient | 149 | OFF | 208.350 | count=0 | post-open POST | post-open POST |
| omnient | 149 | ON | 202.601 | count=0 | post-open POST | post-open POST |
| omnient | 150 | OFF | 209.805 | count=0 | post-open POST | post-open POST |
| omnient | 150 | ON | 201.042 | count=0 | early POST | early POST |
| omnient | 151 | OFF | 206.352 | count=0 | post-open POST | post-open POST |
| omnient | 151 | ON | 210.105 | count=0 | post-open POST | post-open POST |
| omnient | 152 | OFF | 209.142 | count=0 | post-open POST | post-open POST |
| omnient | 152 | ON | 204.745 | count=0 | early POST | early POST |
| omnient | 153 | OFF | 207.306 | count=0 | post-open POST | post-open POST |
| omnient | 153 | ON | 202.819 | count=0 | post-open POST | post-open POST |
| omnient | 154 | OFF | 202.182 | count=0 | post-open POST | post-open POST |
| omnient | 154 | ON | 205.834 | count=0 | early POST | post-open POST |
| omnient | 155 | OFF | 200.464 | count=0 | post-open POST | post-open POST |
| omnient | 155 | ON | 208.668 | count=0 | early POST | early POST |
| omnient | 156 | OFF | 206.794 | count=0 | post-open POST | post-open POST |
| omnient | 156 | ON | 208.949 | count=0 | early POST | early POST |
| omnient | 157 | OFF | 208.677 | count=0 | post-open POST | post-open POST |
| omnient | 157 | ON | 204.874 | count=0 | early POST | early POST |
| omnient | 158 | OFF | 206.902 | count=0 | post-open POST | post-open POST |
| omnient | 158 | ON | 204.756 | count=0 | early POST | early POST |
| omnient | 159 | OFF | 200.829 | count=0 | post-open POST | post-open POST |
| omnient | 159 | ON | 204.251 | count=0 | early POST | early POST |
| omnient | 160 | OFF | 206.390 | count=0 | post-open POST | post-open POST |
| omnient | 160 | ON | 206.430 | count=0 | early POST | early POST |
| omnient | 161 | OFF | 210.043 | count=0 | post-open POST | post-open POST |
| omnient | 161 | ON | 210.473 | count=0 | early POST | early POST |
| omnient | 162 | OFF | 204.786 | count=0 | post-open POST | post-open POST |
| omnient | 162 | ON | 206.021 | count=0 | early POST | post-open POST |
| omnient | 163 | OFF | 205.886 | count=0 | post-open POST | post-open POST |
| omnient | 163 | ON | 209.163 | count=0 | post-open POST | post-open POST |
| omnient | 164 | OFF | 201.708 | count=0 | post-open POST | post-open POST |
| omnient | 164 | ON | 208.555 | count=0 | post-open POST | post-open POST |
| omnient | 165 | OFF | 204.896 | count=0 | post-open POST | post-open POST |
| omnient | 165 | ON | 208.809 | count=0 | early POST | early POST |
| omnient | 166 | OFF | 206.039 | count=0 | post-open POST | post-open POST |
| omnient | 166 | ON | 201.141 | count=0 | early POST | early POST |
| omnient | 167 | OFF | 205.484 | count=0 | post-open POST | post-open POST |
| omnient | 167 | ON | 206.503 | count=0 | post-open POST | post-open POST |
| omnient | 168 | OFF | 200.746 | count=0 | post-open POST | post-open POST |
| omnient | 168 | ON | 207.747 | count=0 | post-open POST | post-open POST |
| omnient | 169 | OFF | 206.195 | count=0 | post-open POST | post-open POST |
| omnient | 169 | ON | 200.436 | count=0 | post-open POST | post-open POST |
| omnient | 170 | OFF | 204.869 | count=0 | post-open POST | post-open POST |
| omnient | 170 | ON | 200.675 | count=0 | post-open POST | post-open POST |
| omnient | 171 | OFF | 204.397 | count=0 | post-open POST | post-open POST |
| omnient | 171 | ON | 210.115 | count=0 | post-open POST | post-open POST |
| omnient | 172 | OFF | 201.404 | count=0 | post-open POST | post-open POST |
| omnient | 172 | ON | 202.264 | count=0 | post-open POST | post-open POST |
| omnient | 173 | OFF | 205.766 | count=0 | post-open POST | post-open POST |
| omnient | 173 | ON | 201.241 | count=0 | early POST | early POST |
| omnient | 174 | OFF | 204.233 | count=0 | post-open POST | post-open POST |
| omnient | 174 | ON | 208.614 | count=0 | post-open POST | post-open POST |
| omnient | 175 | OFF | 210.363 | count=0 | post-open POST | post-open POST |
| omnient | 175 | ON | 208.780 | count=0 | post-open POST | post-open POST |
| omnient | 176 | OFF | 204.204 | count=0 | post-open POST | post-open POST |
| omnient | 176 | ON | 202.528 | count=0 | post-open POST | post-open POST |
| omnient | 177 | OFF | 209.166 | count=0 | post-open POST | post-open POST |
| omnient | 177 | ON | 204.349 | count=0 | post-open POST | post-open POST |
| omnient | 178 | OFF | 201.814 | count=0 | post-open POST | post-open POST |
| omnient | 178 | ON | 206.814 | count=0 | early POST | early POST |
| omnient | 179 | OFF | 204.731 | count=0 | post-open POST | post-open POST |
| omnient | 179 | ON | 206.851 | count=0 | post-open POST | post-open POST |
| omnient | 180 | OFF | 210.097 | count=0 | post-open POST | post-open POST |
| omnient | 180 | ON | 202.581 | count=0 | post-open POST | post-open POST |
| omnient | 181 | OFF | 208.152 | count=0 | post-open POST | post-open POST |
| omnient | 181 | ON | 204.829 | count=0 | early POST | early POST |
| omnient | 182 | OFF | 210.050 | count=0 | post-open POST | post-open POST |
| omnient | 182 | ON | 205.223 | count=0 | early POST | early POST |
| omnient | 183 | OFF | 208.702 | count=0 | post-open POST | post-open POST |
| omnient | 183 | ON | 205.742 | count=0 | early POST | early POST |
| omnient | 184 | OFF | 203.577 | count=0 | post-open POST | post-open POST |
| omnient | 184 | ON | 201.653 | count=0 | post-open POST | post-open POST |
| omnient | 185 | OFF | 203.629 | count=0 | post-open POST | post-open POST |
| omnient | 185 | ON | 203.295 | count=0 | early POST | early POST |
| omnient | 186 | OFF | 204.776 | count=0 | post-open POST | post-open POST |
| omnient | 186 | ON | 207.242 | count=0 | post-open POST | post-open POST |
| omnient | 187 | OFF | 202.126 | count=0 | post-open POST | post-open POST |
| omnient | 187 | ON | 203.993 | count=0 | post-open POST | post-open POST |
| omnient | 188 | OFF | 205.069 | count=0 | post-open POST | post-open POST |
| omnient | 188 | ON | 206.332 | count=0 | post-open POST | post-open POST |
| omnient | 189 | OFF | 206.319 | count=0 | post-open POST | post-open POST |
| omnient | 189 | ON | 203.980 | count=0 | post-open POST | post-open POST |
| omnient | 190 | OFF | 201.353 | count=0 | post-open POST | post-open POST |
| omnient | 190 | ON | 202.051 | count=0 | early POST | early POST |
| omnient | 191 | OFF | 205.695 | count=0 | post-open POST | post-open POST |
| omnient | 191 | ON | 206.943 | count=0 | post-open POST | post-open POST |
| omnient | 192 | OFF | 202.799 | count=0 | post-open POST | post-open POST |
| omnient | 192 | ON | 204.048 | count=0 | post-open POST | post-open POST |
| omnient | 193 | OFF | 206.770 | count=0 | post-open POST | post-open POST |
| omnient | 193 | ON | 201.713 | count=0 | early POST | early POST |
| omnient | 194 | OFF | 208.513 | count=0 | post-open POST | post-open POST |
| omnient | 194 | ON | 204.042 | count=0 | early POST | early POST |
| omnient | 195 | OFF | 208.712 | count=0 | post-open POST | post-open POST |
| omnient | 195 | ON | 204.148 | count=0 | early POST | early POST |
| omnient | 196 | OFF | 206.843 | count=0 | post-open POST | post-open POST |
| omnient | 196 | ON | 203.926 | count=0 | early POST | post-open POST |
| omnient | 197 | OFF | 206.514 | count=0 | post-open POST | post-open POST |
| omnient | 197 | ON | 203.463 | count=0 | post-open POST | post-open POST |
| omnient | 198 | OFF | 205.503 | count=0 | post-open POST | post-open POST |
| omnient | 198 | ON | 205.587 | count=0 | post-open POST | post-open POST |
| omnient | 199 | OFF | 201.377 | count=0 | post-open POST | post-open POST |
| omnient | 199 | ON | 208.749 | count=0 | post-open POST | post-open POST |
| omnient | 200 | OFF | 206.462 | count=0 | post-open POST | post-open POST |
| omnient | 200 | ON | 208.687 | count=0 | post-open POST | post-open POST |
| omnient | 201 | OFF | 203.335 | count=0 | post-open POST | post-open POST |
| omnient | 201 | ON | 208.805 | count=0 | early POST | early POST |
| omnient | 202 | OFF | 206.671 | count=0 | post-open POST | post-open POST |
| omnient | 202 | ON | 208.782 | count=0 | post-open POST | post-open POST |
| omnient | 203 | OFF | 201.662 | count=0 | post-open POST | post-open POST |
| omnient | 203 | ON | 203.748 | count=0 | post-open POST | post-open POST |
| omnient | 204 | OFF | 205.490 | count=0 | post-open POST | post-open POST |
| omnient | 204 | ON | 208.646 | count=0 | early POST | early POST |
| omnient | 205 | OFF | 208.340 | count=0 | post-open POST | post-open POST |
| omnient | 205 | ON | 208.720 | count=0 | early POST | early POST |
| omnient | 206 | OFF | 202.239 | count=0 | post-open POST | post-open POST |
| omnient | 206 | ON | 209.296 | count=0 | post-open POST | post-open POST |
| omnient | 207 | OFF | 210.043 | count=0 | post-open POST | post-open POST |
| omnient | 207 | ON | 206.007 | count=0 | post-open POST | post-open POST |
| omnient | 208 | OFF | 202.176 | count=0 | post-open POST | post-open POST |
| omnient | 208 | ON | 202.153 | count=0 | early POST | early POST |
| omnient | 209 | OFF | 208.682 | count=0 | post-open POST | post-open POST |
| omnient | 209 | ON | 207.220 | count=0 | early POST | early POST |
| omnient | 210 | OFF | 208.755 | count=0 | post-open POST | post-open POST |
| omnient | 210 | ON | 206.393 | count=0 | post-open POST | post-open POST |
| omnient | 211 | OFF | 203.712 | count=0 | post-open POST | post-open POST |
| omnient | 211 | ON | 205.662 | count=0 | early POST | early POST |
| omnient | 212 | OFF | 204.981 | count=0 | post-open POST | post-open POST |
| omnient | 212 | ON | 200.638 | count=0 | post-open POST | post-open POST |
| omnient | 213 | OFF | 204.796 | count=0 | post-open POST | post-open POST |
| omnient | 213 | ON | 209.459 | count=0 | post-open POST | post-open POST |
| omnient | 214 | OFF | 204.387 | count=0 | post-open POST | post-open POST |
| omnient | 214 | ON | 208.607 | count=0 | post-open POST | post-open POST |
| omnient | 215 | OFF | 204.677 | count=0 | post-open POST | post-open POST |
| omnient | 215 | ON | 206.533 | count=0 | post-open POST | post-open POST |
| omnient | 216 | OFF | 208.550 | count=0 | post-open POST | post-open POST |
| omnient | 216 | ON | 207.861 | count=0 | early POST | early POST |
| omnient | 217 | OFF | 207.649 | count=0 | post-open POST | post-open POST |
| omnient | 217 | ON | 202.312 | count=0 | early POST | early POST |
| omnient | 218 | OFF | 202.002 | count=0 | post-open POST | post-open POST |
| omnient | 218 | ON | 208.692 | count=0 | post-open POST | post-open POST |
| omnient | 219 | OFF | 208.734 | count=0 | post-open POST | post-open POST |
| omnient | 219 | ON | 208.120 | count=0 | early POST | early POST |
| omnient | 220 | OFF | 203.237 | count=0 | post-open POST | post-open POST |
| omnient | 220 | ON | 208.679 | count=0 | post-open POST | post-open POST |
| omnient | 221 | OFF | 203.175 | count=0 | post-open POST | post-open POST |
| omnient | 221 | ON | 206.669 | count=0 | post-open POST | post-open POST |
| omnient | 222 | OFF | 203.679 | count=0 | post-open POST | post-open POST |
| omnient | 222 | ON | 208.702 | count=0 | post-open POST | post-open POST |
| omnient | 223 | OFF | 203.316 | count=0 | post-open POST | post-open POST |
| omnient | 223 | ON | 200.838 | count=0 | post-open POST | post-open POST |
| omnient | 224 | OFF | 202.655 | count=0 | post-open POST | post-open POST |
| omnient | 224 | ON | 200.937 | count=0 | post-open POST | post-open POST |
| omnient | 225 | OFF | 201.488 | count=0 | post-open POST | post-open POST |
| omnient | 225 | ON | 205.452 | count=0 | early POST | early POST |
| omnient | 226 | OFF | 204.450 | count=0 | post-open POST | post-open POST |
| omnient | 226 | ON | 205.162 | count=0 | post-open POST | post-open POST |
| omnient | 227 | OFF | 203.814 | count=0 | post-open POST | post-open POST |
| omnient | 227 | ON | 210.346 | count=0 | post-open POST | post-open POST |
| omnient | 228 | OFF | 203.115 | count=0 | post-open POST | post-open POST |
| omnient | 228 | ON | 203.177 | count=0 | early POST | post-open POST |
| omnient | 229 | OFF | 208.342 | count=0 | post-open POST | post-open POST |
| omnient | 229 | ON | 204.601 | count=0 | early POST | early POST |
| omnient | 230 | OFF | 208.654 | count=0 | post-open POST | post-open POST |
| omnient | 230 | ON | 205.123 | count=0 | early POST | early POST |
| omnient | 231 | OFF | 207.584 | count=0 | post-open POST | post-open POST |
| omnient | 231 | ON | 208.019 | count=0 | early POST | early POST |
| omnient | 232 | OFF | 204.979 | count=0 | post-open POST | post-open POST |
| omnient | 232 | ON | 207.224 | count=0 | post-open POST | post-open POST |
| omnient | 233 | OFF | 201.197 | count=0 | post-open POST | post-open POST |
| omnient | 233 | ON | 206.611 | count=0 | post-open POST | post-open POST |
| omnient | 234 | OFF | 206.652 | count=0 | post-open POST | post-open POST |
| omnient | 234 | ON | 200.533 | count=0 | post-open POST | post-open POST |
| omnient | 235 | OFF | 202.269 | count=0 | post-open POST | post-open POST |
| omnient | 235 | ON | 203.992 | count=0 | early POST | early POST |
| omnient | 236 | OFF | 204.613 | count=0 | post-open POST | post-open POST |
| omnient | 236 | ON | 202.757 | count=0 | early POST | early POST |
| omnient | 237 | OFF | 206.672 | count=0 | post-open POST | post-open POST |
| omnient | 237 | ON | 205.392 | count=0 | post-open POST | post-open POST |
| omnient | 238 | OFF | 207.768 | count=0 | post-open POST | post-open POST |
| omnient | 238 | ON | 204.368 | count=0 | early POST | early POST |
| omnient | 239 | OFF | 204.507 | count=0 | post-open POST | post-open POST |
| omnient | 239 | ON | 206.750 | count=0 | post-open POST | post-open POST |
| omnient | 240 | OFF | 202.906 | count=0 | post-open POST | post-open POST |
| omnient | 240 | ON | 205.378 | count=0 | early POST | early POST |
| omnient | 241 | OFF | 200.453 | count=0 | post-open POST | post-open POST |
| omnient | 241 | ON | 205.151 | count=0 | early POST | early POST |
| omnient | 242 | OFF | 206.712 | count=0 | post-open POST | post-open POST |
| omnient | 242 | ON | 210.356 | count=0 | post-open POST | post-open POST |
| omnient | 243 | OFF | 204.504 | count=0 | post-open POST | post-open POST |
| omnient | 243 | ON | 206.515 | count=0 | early POST | early POST |
| omnient | 244 | OFF | 207.913 | count=0 | post-open POST | post-open POST |
| omnient | 244 | ON | 205.143 | count=0 | early POST | early POST |
| omnient | 245 | OFF | 207.804 | count=0 | post-open POST | post-open POST |
| omnient | 245 | ON | 208.572 | count=0 | early POST | early POST |
| omnient | 246 | OFF | 206.267 | count=0 | post-open POST | post-open POST |
| omnient | 246 | ON | 201.055 | count=0 | post-open POST | post-open POST |
| omnient | 247 | OFF | 205.206 | count=0 | post-open POST | post-open POST |
| omnient | 247 | ON | 210.377 | count=0 | early POST | early POST |
| omnient | 248 | OFF | 201.090 | count=0 | post-open POST | post-open POST |
| omnient | 248 | ON | 208.014 | count=0 | early POST | early POST |
| omnient | 249 | OFF | 203.119 | count=0 | post-open POST | post-open POST |
| omnient | 249 | ON | 205.042 | count=0 | early POST | early POST |
| omnient | 250 | OFF | 202.163 | count=0 | post-open POST | post-open POST |
| omnient | 250 | ON | 206.625 | count=0 | post-open POST | post-open POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 6/250 ON trials. Of those trials, 6 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 19, 73, 109, 119, 139, 158. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 29294 | 5D730D9A-D0B1-4C54-B670-E5D2C10EAD16 |
| 1 | ON | 2 | 29295 | A2C59261-2DF4-4746-9876-9B58B844251B |
| 2 | OFF | 3 | 29296 | 5D174760-0E7A-4E84-8B8C-BEA5A066A66A |
| 2 | ON | 4 | 29297 | 392B4736-38E4-4CFD-AC33-8B4C413282C9 |
| 3 | OFF | 5 | 29298 | BB2CD605-6208-4FDC-8BFC-7F8F535912C6 |
| 3 | ON | 6 | 29300 | 3A552303-11D4-4149-8BFC-34154D37466C |
| 4 | OFF | 7 | 29301 | 2453D5A8-2920-436C-8856-1E6C37DC9414 |
| 4 | ON | 8 | 29302 | 42ABAB66-8917-4E6F-8F34-A8C966257CCD |
| 5 | OFF | 9 | 29303 | 8CEBD79E-57E3-4B3C-9820-C6552496FABA |
| 5 | ON | 10 | 29304 | 99E8129C-1130-4AEE-854D-BC33D64273B2 |
| 6 | OFF | 11 | 29305 | D7855C5A-9C28-42FC-8527-5B0067BB9935 |
| 6 | ON | 12 | 29306 | F7D56361-D15B-40A1-A2FE-45522E1049FB |
| 7 | OFF | 13 | 29307 | CCBC431C-162D-4A71-A09D-AC59432C09BC |
| 7 | ON | 14 | 29309 | 4A4AED49-D612-487A-A517-6609FF0EB476 |
| 8 | OFF | 15 | 29310 | 0470B95B-31D4-4640-9DFF-8A912E71D2FC |
| 8 | ON | 16 | 29311 | 261EA0D1-D08D-4859-8AAB-F7408BBA2252 |
| 9 | OFF | 17 | 29312 | 82968AB9-DC89-442F-878A-5FFDC742556B |
| 9 | ON | 18 | 29313 | 94B20F16-32A1-43FE-BA58-D24CBC4382E7 |
| 10 | OFF | 19 | 29314 | 961924FB-C4C1-4405-B166-797DF3DA2B6E |
| 10 | ON | 20 | 29315 | 7744040F-F822-4759-B6D0-185C7964AE80 |
| 11 | OFF | 21 | 29316 | 8B541551-82CE-4E8D-832E-B3AF76F8AEB8 |
| 11 | ON | 22 | 29318 | 60AF10B8-D575-4AB5-AE84-487466A7D01F |
| 12 | OFF | 23 | 29319 | 956F7003-7306-4C4E-A82E-8F0B793667E4 |
| 12 | ON | 24 | 29320 | 0F064012-0C3D-47E2-B474-EB86A10E02B9 |
| 13 | OFF | 25 | 29321 | 9AC6CEA3-334C-4A88-A8A3-BA9DE3FBC0BF |
| 13 | ON | 26 | 29322 | DD52F5C3-D637-47DF-AA12-489BE4D02F39 |
| 14 | OFF | 27 | 29323 | C8003ABA-671E-4A4B-9608-00EA6E5C81B8 |
| 14 | ON | 28 | 29324 | 9A68AAF8-5DBF-4A94-9236-EF8CDDA31957 |
| 15 | OFF | 29 | 29326 | 6B406321-F31F-4E6B-A74C-58B858DC5BD8 |
| 15 | ON | 30 | 29327 | 66916886-7404-4272-8626-8E3FCE884D54 |
| 16 | OFF | 31 | 29328 | 9868D765-5978-4ABB-9D29-16FE89D1B9DC |
| 16 | ON | 32 | 29329 | 18920B38-35C3-4C0E-8008-2F934580CD80 |
| 17 | OFF | 33 | 29330 | CA30ECC5-ED17-4828-B25C-F16B69DFA7A9 |
| 17 | ON | 34 | 29331 | 3CC267DA-08FC-4289-9A8E-46395CEED645 |
| 18 | OFF | 35 | 29332 | 8D9259F6-9668-41B1-9743-C2C022FF9672 |
| 18 | ON | 36 | 29333 | C1A2DDE0-44B7-47F9-A513-4E94FEC33D01 |
| 19 | OFF | 37 | 29335 | 98F3646B-DC41-4755-82F7-4D8008B091C6 |
| 19 | ON | 38 | 29336 | 8809D8FC-AC3B-4BD9-9B7E-49964D371E56 |
| 20 | OFF | 39 | 29337 | 6394B176-9FB0-4162-BD22-930B75644720 |
| 20 | ON | 40 | 29338 | 086060CA-23BD-414C-AAEB-595A1B5ECE5A |
| 21 | OFF | 41 | 29339 | 608662BD-7AB1-4A3A-807C-F0C93680931D |
| 21 | ON | 42 | 29340 | F5CA0BCE-0E5F-485E-AC9B-9F677C1AA28D |
| 22 | OFF | 43 | 29341 | 7049E8B0-1DE0-4E19-9149-1518FA82601D |
| 22 | ON | 44 | 29343 | 11583981-1B23-47DD-8EE3-D38C01EEA2D6 |
| 23 | OFF | 45 | 29344 | 8ED86868-76E0-41F8-8C06-2A2BFA7A7756 |
| 23 | ON | 46 | 29345 | 72DE7649-28E4-4B1B-8657-54AE734E8D6F |
| 24 | OFF | 47 | 29346 | C0269BD5-2BF4-4306-8CB8-9ECD1E8498DB |
| 24 | ON | 48 | 29347 | 29F81834-4C1E-4CE1-BDE1-B73FD6FA69F7 |
| 25 | OFF | 49 | 29348 | 1AA046EF-F998-4C9A-A5F1-16BA13E868E3 |
| 25 | ON | 50 | 29349 | 6B242D27-5224-4F44-BDC3-0CFFE2A1053F |
| 26 | OFF | 51 | 29350 | 2D319FCA-59C7-44CD-83BE-1F41CF46CF2E |
| 26 | ON | 52 | 29352 | E40D8A18-4AEC-4784-95A2-ADD4CBA9B869 |
| 27 | OFF | 53 | 29353 | CF4794A7-B6EE-4854-8B6D-8636229041E6 |
| 27 | ON | 54 | 29354 | 273CEBE1-0AD0-44E4-8254-4F9C9045AAC2 |
| 28 | OFF | 55 | 29355 | 45BF0AEB-A030-4422-9931-BFAF1AA04F2A |
| 28 | ON | 56 | 29356 | F516C8A8-9256-417E-A688-DD71115A01BD |
| 29 | OFF | 57 | 29357 | FE990CAE-92B6-4A56-9045-A13F7106865D |
| 29 | ON | 58 | 29358 | F580B24A-6066-494B-A458-2199BA5BE784 |
| 30 | OFF | 59 | 29360 | 5A149515-C1CE-4CFD-B181-05DB3A2D392D |
| 30 | ON | 60 | 29361 | 1E419C92-83E1-4710-A024-931A78BFC14A |
| 31 | OFF | 61 | 29362 | 65E16254-5F84-4816-9D19-B2BD29E8B999 |
| 31 | ON | 62 | 29363 | 526A9D40-F76A-46D8-B4B0-48A93FCC49AA |
| 32 | OFF | 63 | 29364 | 5FA44D32-71BC-4EE2-9F0A-3976E68BBDA7 |
| 32 | ON | 64 | 29365 | FA82DE79-613E-4E31-B741-0B4EF129C174 |
| 33 | OFF | 65 | 29366 | 8BEDE61B-81A8-49A1-B6F6-CE4873EE2ABC |
| 33 | ON | 66 | 29367 | 5A5BA13E-5ED0-4986-A188-D0CDABFAC8F0 |
| 34 | OFF | 67 | 29369 | 72467F3E-0A39-4DEF-AF58-BB925CF5B8FB |
| 34 | ON | 68 | 29370 | BBB57B73-70B3-4D68-848F-A7CC253A6FCC |
| 35 | OFF | 69 | 29371 | AE3112C1-A033-41CF-9FD4-E29E108C8702 |
| 35 | ON | 70 | 29372 | F7AD4A87-287E-4319-85CD-698BF522DE61 |
| 36 | OFF | 71 | 29373 | 81FC7B25-18C8-4BCC-B0BF-C93F62EDD475 |
| 36 | ON | 72 | 29374 | AC29EF5F-6364-47A8-8AC5-BAE0F1C218B2 |
| 37 | OFF | 73 | 29375 | 7F5370D1-AF84-4D7D-9EB5-31D4F346548D |
| 37 | ON | 74 | 29376 | D9F62C3F-D8EC-402F-926D-69E2DE169E6A |
| 38 | OFF | 75 | 29378 | 166EB1F6-EB5D-499F-A3D0-18BCB48F285B |
| 38 | ON | 76 | 29379 | 6F0A42A6-F5B8-4652-AE0E-75C86F25D4D7 |
| 39 | OFF | 77 | 29380 | 45933847-4C42-4B8D-9B53-869ECDAD2652 |
| 39 | ON | 78 | 29381 | C7579C22-FDB2-4A7B-B9DB-B5E54396EED0 |
| 40 | OFF | 79 | 29382 | BBC41373-2B1C-4FB4-ADD2-C471A58A0E2E |
| 40 | ON | 80 | 29383 | 47D18C62-E05A-411D-8DEA-0337E7F5E31C |
| 41 | OFF | 81 | 29384 | F1462A90-C405-4256-9D72-7BE961B8D641 |
| 41 | ON | 82 | 29385 | 13FFB8FC-E270-49E7-900A-9E6A3D5772A2 |
| 42 | OFF | 83 | 29387 | DACED12A-8FB5-41BA-B2EF-17B877AA2ADE |
| 42 | ON | 84 | 29388 | CC94A051-9BED-4CF9-8801-4CCAB3DADABC |
| 43 | OFF | 85 | 29389 | 81B74A17-6909-43EA-9748-F1442A2D73E4 |
| 43 | ON | 86 | 29390 | 640F5116-CB95-4D4F-8AC5-F0BF6E76C0FB |
| 44 | OFF | 87 | 29391 | 1F1F932C-B222-4501-B3E2-43B271CC8F18 |
| 44 | ON | 88 | 29393 | 52474BB6-18A4-48E9-AF09-202518830236 |
| 45 | OFF | 89 | 29394 | 1C0DD941-ADE6-475A-A1E3-F95B9B63D682 |
| 45 | ON | 90 | 29396 | ED7B2361-ABF5-41E4-965C-F79186A4D22F |
| 46 | OFF | 91 | 29397 | 2B1DCD77-3C93-423B-8318-B286C56FBAC9 |
| 46 | ON | 92 | 29398 | AC4E1BEA-352E-4856-A636-8E8863199568 |
| 47 | OFF | 93 | 29399 | 3E990A6F-1E6C-4426-B9A3-23098339305A |
| 47 | ON | 94 | 29400 | 58909BCC-C6EA-4AA7-BAEF-0A9E682AF4C3 |
| 48 | OFF | 95 | 29401 | B7FC6571-2C80-41AA-B7C8-083BB5FC07EB |
| 48 | ON | 96 | 29402 | 9DBB0F0E-DB93-45B8-8D51-0A87BAE0A23D |
| 49 | OFF | 97 | 29403 | 1A4A88E2-D326-4C44-943D-349FDE51EFDE |
| 49 | ON | 98 | 29405 | 2CC80D0B-4ADD-43C9-A25F-E4F679F93A64 |
| 50 | OFF | 99 | 29406 | BD65DC82-2E80-401A-962C-41639A54FD34 |
| 50 | ON | 100 | 29407 | 22D75632-C034-4FFB-A8C5-6729D9F5E8B5 |
| 51 | OFF | 101 | 29408 | BEACE008-178C-474F-AEA5-C98E752743B3 |
| 51 | ON | 102 | 29409 | 2A62A7EC-3B61-42FD-8F6B-46408F28371A |
| 52 | OFF | 103 | 29410 | 062A602E-E7E5-4660-A2D1-E02E98DD1DC3 |
| 52 | ON | 104 | 29411 | C814CE94-A657-4682-8E8D-5873F8B200EF |
| 53 | OFF | 105 | 29413 | 9DBE36E0-CC1D-4A54-908C-38400B10F7BB |
| 53 | ON | 106 | 29414 | EF840598-53D9-4CB4-BDEB-060DBC2133E3 |
| 54 | OFF | 107 | 29415 | 19331354-1FA7-439D-BABA-3A3395E7DFE9 |
| 54 | ON | 108 | 29416 | B2F4CB04-80B1-443D-8E0E-BCFBF8310F8E |
| 55 | OFF | 109 | 29417 | 52AB19CA-D41C-443D-BEA6-4FF1379DF1CF |
| 55 | ON | 110 | 29418 | 0B702264-A3BD-411E-857C-70032177A49B |
| 56 | OFF | 111 | 29419 | 32148CAB-1B4D-4C3B-9B81-3A6C863230C3 |
| 56 | ON | 112 | 29421 | 34451D33-4738-4171-9F22-96D855026E66 |
| 57 | OFF | 113 | 29422 | 6F001D15-3E33-4B54-88C4-4E8446132B6F |
| 57 | ON | 114 | 29423 | 1E3FB3B3-F7AF-412B-8597-66999FB3ED59 |
| 58 | OFF | 115 | 29424 | 0DF3C3A9-0FEF-48FF-A240-621F8EADBD68 |
| 58 | ON | 116 | 29425 | A3B7CAA1-12B6-4CEA-A833-4512B4F52197 |
| 59 | OFF | 117 | 29426 | EDA41C82-7545-467C-9582-5EBB55808719 |
| 59 | ON | 118 | 29427 | 3F624CC3-42A8-424B-BC90-FFD3327B6C9A |
| 60 | OFF | 119 | 29429 | DCA14076-E299-4C92-B6C8-A8EF6BAD8A68 |
| 60 | ON | 120 | 29430 | E783E440-1E54-4F52-9C55-D78F1A5F2A91 |
| 61 | OFF | 121 | 29431 | 1B058F2C-DF9E-4FE4-8133-297960DC008B |
| 61 | ON | 122 | 29432 | 48A76BB9-CA4B-4059-B58B-163B44CE1908 |
| 62 | OFF | 123 | 29433 | 8CD1CC41-E5B5-44BD-9453-29F0BF478ED4 |
| 62 | ON | 124 | 29434 | 138D94C3-B4BE-40DF-9C4E-1681F03D2833 |
| 63 | OFF | 125 | 29435 | AC7346D2-BB97-409D-AA9A-89CC86F8AEA5 |
| 63 | ON | 126 | 29436 | 1A453D1B-0A2B-4DF4-A89D-EE6F597F8BE0 |
| 64 | OFF | 127 | 29438 | BFF95383-16C3-4AE2-8B22-8C39B25DDEAF |
| 64 | ON | 128 | 29439 | ADAED50C-C0CB-437C-9A13-AA9F24300993 |
| 65 | OFF | 129 | 29440 | 8AE2DA11-EAC0-49F7-B0D4-D9CAC1DECB36 |
| 65 | ON | 130 | 29441 | 44020433-F350-4301-BFF6-01A603FF5A38 |
| 66 | OFF | 131 | 29442 | A5D5EEAD-9390-41C5-B265-6BC68B14C1D4 |
| 66 | ON | 132 | 29443 | F3816D43-8C31-4E06-B3AC-178F3B827F30 |
| 67 | OFF | 133 | 29444 | F5A4764A-2CD6-4BA4-9BC7-60D7011599C1 |
| 67 | ON | 134 | 29445 | 91D861C1-EE69-434C-B647-FB9238752276 |
| 68 | OFF | 135 | 29447 | 13B371D0-3756-4E80-B7B1-7726A1CEBF29 |
| 68 | ON | 136 | 29448 | 26F6F22C-5052-43FB-8012-C3D0BE44A182 |
| 69 | OFF | 137 | 29449 | 4253F7CF-9079-4D44-9BBE-25F34A9A7B9A |
| 69 | ON | 138 | 29450 | F93ED62F-B0BC-42D4-AEB6-ACC3EC846CA2 |
| 70 | OFF | 139 | 29451 | 1CB688A2-066A-400B-A86E-7D3AB4102256 |
| 70 | ON | 140 | 29452 | AEC42781-269B-4A3B-AA57-9DAA3C62BFC3 |
| 71 | OFF | 141 | 29453 | B0B73E41-4DAB-4965-BFF2-7B05C91F2457 |
| 71 | ON | 142 | 29455 | 1E61ED2D-3E5A-4923-9702-1525BFB1FF8D |
| 72 | OFF | 143 | 29456 | C2499ABA-5BDD-431D-9066-30CC0AA334E1 |
| 72 | ON | 144 | 29457 | 9A1C6C65-FBA5-44C8-9F7D-D06D8E62F3A5 |
| 73 | OFF | 145 | 29458 | 79165E5D-E760-48EC-92D5-A6993EBEB619 |
| 73 | ON | 146 | 29459 | 39349921-7448-46E0-B581-B0EC07C992CB |
| 74 | OFF | 147 | 29460 | B496256A-C8FA-41C7-BD0A-F44971307BB7 |
| 74 | ON | 148 | 29461 | 763F0814-D1BB-495C-AAA3-793A23F58398 |
| 75 | OFF | 149 | 29462 | 5FEA3AD3-220E-48FF-B0C8-EC8EB2F0235D |
| 75 | ON | 150 | 29464 | EEEC4619-6660-4FBC-85E2-4709903DC103 |
| 76 | OFF | 151 | 29465 | 3C6A910C-C499-4EC4-B6A7-9933B1D1E762 |
| 76 | ON | 152 | 29466 | 2F7A003C-A344-4995-8055-384AC2417C99 |
| 77 | OFF | 153 | 29467 | 91506986-4C8A-4797-8E81-D9E5B3D2409A |
| 77 | ON | 154 | 29468 | 659F6F98-43D1-416F-BC4A-67FE0681EAA1 |
| 78 | OFF | 155 | 29469 | 608F8150-0241-44FA-AFCA-D50A8C718401 |
| 78 | ON | 156 | 29471 | 0EA3E572-4802-4669-8CC6-823529B5AE3C |
| 79 | OFF | 157 | 29472 | BF54D3B5-62E3-4C5E-82AD-4CD9C62B485F |
| 79 | ON | 158 | 29473 | A8AEF650-0DA8-45FD-BD37-E2067C74A067 |
| 80 | OFF | 159 | 29474 | 85631D5A-0AAF-4ADB-BCBE-74E2BB8A4FDD |
| 80 | ON | 160 | 29475 | A3A59C6A-4666-4BA0-8594-D2AF28DE3DD8 |
| 81 | OFF | 161 | 29476 | 84FACA6D-5479-4B8E-8584-78D38EBA0318 |
| 81 | ON | 162 | 29477 | 3218C9FE-120E-47CA-B2A6-FBCD6DCBAA80 |
| 82 | OFF | 163 | 29479 | E703749E-FFC8-48A2-A55E-FAB837677AB9 |
| 82 | ON | 164 | 29480 | 8ADEF3EA-8119-467A-B3FC-316FC9252068 |
| 83 | OFF | 165 | 29481 | 1BE6BF18-0B2C-488F-BBF5-177D735E550B |
| 83 | ON | 166 | 29482 | 25322FC8-AB88-4008-A713-416623A2EB2B |
| 84 | OFF | 167 | 29483 | 03061824-7D62-4A3A-B061-4EC858C573B8 |
| 84 | ON | 168 | 29484 | ED6160FE-BCC9-4E36-9367-5AED64064A2B |
| 85 | OFF | 169 | 29485 | 65C01D1C-B691-489C-A07F-DDA341AE1598 |
| 85 | ON | 170 | 29487 | 19E0F7B0-1A0B-486D-9B1F-AB5D770E80D4 |
| 86 | OFF | 171 | 29488 | 5A527A84-081D-47B9-901D-3E2A13FABA2B |
| 86 | ON | 172 | 29489 | D4BC2677-C7D8-4707-92CC-80B760C42E0C |
| 87 | OFF | 173 | 29490 | 970856F3-EF42-49AE-97A4-A715937CB663 |
| 87 | ON | 174 | 29491 | 0A64666B-69DB-4137-B6CF-BA6846D208C0 |
| 88 | OFF | 175 | 29492 | 56E2550A-8A2D-42C8-93DD-030019A25ADE |
| 88 | ON | 176 | 29493 | 7B508A56-7F9A-4351-BD16-800BE1FE49F8 |
| 89 | OFF | 177 | 29494 | D899A4D8-4447-4623-96BF-79FFB99EE570 |
| 89 | ON | 178 | 29496 | 3FCEA807-8025-449F-BC78-26FEA1F500AC |
| 90 | OFF | 179 | 29497 | 2524837E-D6E0-498C-90B4-1A38ED2C99C7 |
| 90 | ON | 180 | 29498 | 766F22E1-8915-4020-BB93-12A7357890E5 |
| 91 | OFF | 181 | 29499 | F688773B-47BD-4548-9ED3-04EEB196D669 |
| 91 | ON | 182 | 29500 | B8C0CA08-33F2-47FA-A9C5-2A3BB0C47C02 |
| 92 | OFF | 183 | 29501 | C17A2C0A-9BDA-471A-8B3A-BB11D7541231 |
| 92 | ON | 184 | 29503 | D1240871-FE87-4003-B243-25083E264A00 |
| 93 | OFF | 185 | 29504 | 57D6846F-973B-4547-954B-551B9F71298B |
| 93 | ON | 186 | 29505 | E3A7DEAF-E056-49A3-9B63-BE321746F2E8 |
| 94 | OFF | 187 | 29506 | 76D67F0B-9B3E-45A2-A75F-3350B83B83EC |
| 94 | ON | 188 | 29507 | D9E3DD60-A3F5-4FEE-BA35-E4F948B81860 |
| 95 | OFF | 189 | 29508 | 02889707-F190-4318-9D52-201237316DEC |
| 95 | ON | 190 | 29510 | 347A66FA-E9EC-4C14-B451-D613D786C4E8 |
| 96 | OFF | 191 | 29511 | 08625FE7-12BD-47CC-9D98-CD7F9152ED9E |
| 96 | ON | 192 | 29512 | A7A42174-9DE9-45FC-BCE4-FA989CB35431 |
| 97 | OFF | 193 | 29513 | 6BC0234E-653F-4C3B-B59D-5132D03FB393 |
| 97 | ON | 194 | 29514 | D049F55C-7771-4A67-A1C3-173E96AE0F1D |
| 98 | OFF | 195 | 29515 | 41D9FA6D-A137-417A-A7E0-6EDCB4C000F3 |
| 98 | ON | 196 | 29516 | F2043F07-6A00-4951-A368-35157CD4663B |
| 99 | OFF | 197 | 29517 | B502B763-C235-4EBF-9A53-6B85394E07BE |
| 99 | ON | 198 | 29519 | BF32D94E-87EF-4BB5-A704-7E4AE0ED8CFB |
| 100 | OFF | 199 | 29520 | 826D72E1-0EFC-4FDF-B828-88AB5C4D63EB |
| 100 | ON | 200 | 29521 | BC4085D2-82F6-4E13-9B61-E163769797E9 |
| 101 | OFF | 201 | 29522 | 205B8E3C-01AA-4628-AF81-C107194CD022 |
| 101 | ON | 202 | 29523 | AB8569CF-E46E-4F96-9172-1EB440A4D6CD |
| 102 | OFF | 203 | 29524 | 34594C46-EC74-4928-B7F8-C91E9BE8B539 |
| 102 | ON | 204 | 29525 | C96707B4-B226-4D13-AF10-BB66CD992535 |
| 103 | OFF | 205 | 29526 | C959DA8F-96EF-4D1A-97D1-699947B175F1 |
| 103 | ON | 206 | 29528 | ABBF7DC1-B30A-4846-BE21-DACFD0DC7F6A |
| 104 | OFF | 207 | 29529 | 0AA59530-8C44-43A8-B691-480FD7B700E0 |
| 104 | ON | 208 | 29530 | BCCEA88D-3651-4943-8CD7-CFF215A0FA6F |
| 105 | OFF | 209 | 29531 | 8D62D67F-5668-45D7-AD17-B9B6B0E912ED |
| 105 | ON | 210 | 29532 | 5FC275D1-F4A7-4B81-A6A7-EE5CF1EC69DE |
| 106 | OFF | 211 | 29533 | 67459A33-4B35-42C5-9AF1-222BDD5AEC24 |
| 106 | ON | 212 | 29534 | 820225C3-EA2A-48DB-82C3-C691CA5CDF85 |
| 107 | OFF | 213 | 29536 | 18C29C35-8E12-4E92-9837-F2F14B9DBB37 |
| 107 | ON | 214 | 29537 | 07946C49-78AE-4C13-9F49-E1AB414BD678 |
| 108 | OFF | 215 | 29538 | 204B0C08-F64D-4912-8E2C-36E9664766C5 |
| 108 | ON | 216 | 29539 | 43984314-24A3-4211-A80A-C0E503E74097 |
| 109 | OFF | 217 | 29540 | B2806CCF-9B05-4745-B232-11A2060ADB63 |
| 109 | ON | 218 | 29541 | 7A8DC670-A626-4C5F-A912-A99F38004FB5 |
| 110 | OFF | 219 | 29544 | 78961907-AC30-4595-A68C-D16D998FAFD9 |
| 110 | ON | 220 | 29546 | 4E3FAFAB-E275-4925-B8C6-7AFC3F63F421 |
| 111 | OFF | 221 | 29547 | 17867EC5-D3AF-46B8-AEED-04F77D2DF120 |
| 111 | ON | 222 | 29548 | 327CB8F1-1025-4ADC-8C19-DD6F85499D4D |
| 112 | OFF | 223 | 29549 | 395100BC-E3C7-4478-9DB7-9C05FF23E5FD |
| 112 | ON | 224 | 29550 | 0591AFA6-EEB8-443D-81AB-2EF4BD3E3F77 |
| 113 | OFF | 225 | 29551 | E3552771-B041-4AF1-B4CC-534CFB6DF595 |
| 113 | ON | 226 | 29552 | C689A428-A769-4438-841C-051F8CEEB12E |
| 114 | OFF | 227 | 29553 | 7D0627E2-1FB8-4093-BC0D-00836B9AFB40 |
| 114 | ON | 228 | 29555 | 32082DA0-37F3-470E-A9AE-CBA9B3F86A4C |
| 115 | OFF | 229 | 29556 | 97CA509F-8F7B-433F-A8C1-05D877A214FC |
| 115 | ON | 230 | 29557 | F83ECC0F-992C-46B5-BC76-B227E7D95758 |
| 116 | OFF | 231 | 29558 | 2678C4B0-F656-4B3E-824E-4575C5EAF3C6 |
| 116 | ON | 232 | 29559 | 8F996B0F-20E1-4879-9A29-E6AF3C85FD7A |
| 117 | OFF | 233 | 29560 | E685B81D-D9CD-45F3-BC51-FE8A210D8403 |
| 117 | ON | 234 | 29561 | 91A67FDC-9F4F-4322-9C4D-C5152207054B |
| 118 | OFF | 235 | 29563 | 4C33BCDC-0EF3-4FAF-96B2-85B730D66F1E |
| 118 | ON | 236 | 29564 | 495BB5D5-F088-489F-932F-5B9C188F36C3 |
| 119 | OFF | 237 | 29565 | 688571E2-AF6C-4171-A5ED-58970F43CBA6 |
| 119 | ON | 238 | 29566 | 0345D078-0729-4749-A63A-8EDD5C35D478 |
| 120 | OFF | 239 | 29567 | BA4D7240-C2A4-4902-B0BA-A7D5AC7BC933 |
| 120 | ON | 240 | 29568 | 764D5165-51F8-4252-9F60-AA3B336BC30C |
| 121 | OFF | 241 | 29569 | 505A83DE-9965-490C-893B-78DCF4653CFB |
| 121 | ON | 242 | 29570 | 0DE5BD37-19B2-4088-8B58-23C9557CFD78 |
| 122 | OFF | 243 | 29572 | C44E07DD-2B6E-4B86-98A5-28EE11763744 |
| 122 | ON | 244 | 29573 | BFC3EB8C-66D0-4169-BBE8-305ACF4A3AAB |
| 123 | OFF | 245 | 29574 | F47CD4EE-AB60-4217-A2BB-04312C7A59A4 |
| 123 | ON | 246 | 29575 | BFD57CE8-E55E-48B7-BB30-5C339967DB79 |
| 124 | OFF | 247 | 29576 | 4E651049-4D19-4BD4-9B05-2C2EC26F2E26 |
| 124 | ON | 248 | 29577 | 2C854A2C-FB04-4EAF-8D44-DB3F5FF403A3 |
| 125 | OFF | 249 | 29578 | 0174282E-9F7E-45AA-BDB6-463E0504E692 |
| 125 | ON | 250 | 29579 | 2142F77C-4960-49C4-ACF0-91A43F0999FF |
| 126 | OFF | 251 | 29581 | 7B83028D-CE85-421F-9A57-687D658CB5C3 |
| 126 | ON | 252 | 29582 | C5CEBD01-B65C-44E0-902D-9812A92F0DA4 |
| 127 | OFF | 253 | 29583 | 02A363AD-C766-445A-BE87-BA0F00568D69 |
| 127 | ON | 254 | 29584 | F824444B-0FB8-4DC5-947E-6468CD8823BF |
| 128 | OFF | 255 | 29585 | 27100F68-F4C1-4D80-985F-02A74DA39D72 |
| 128 | ON | 256 | 29586 | 0A545A94-E022-4D4D-801D-52C27B4D37F3 |
| 129 | OFF | 257 | 29587 | 218672AA-EC55-4515-801F-754D07E78EEB |
| 129 | ON | 258 | 29589 | 27884595-D021-468E-8233-CFBD563E064E |
| 130 | OFF | 259 | 29590 | CD680291-A745-43DD-8EAA-3B7D2915C325 |
| 130 | ON | 260 | 29591 | 4519A281-5951-4079-8DBC-9C662391857D |
| 131 | OFF | 261 | 29592 | 35232A7E-27AB-4ECB-9454-718E8EC21484 |
| 131 | ON | 262 | 29593 | 1D9BA4F1-F09C-44F2-8505-C4F7909475AE |
| 132 | OFF | 263 | 29594 | 27A491AE-074A-457C-AD67-82B4AC37A389 |
| 132 | ON | 264 | 29596 | D0F1271F-49D0-44BA-B623-7693EFDB3C20 |
| 133 | OFF | 265 | 29597 | 47A3BF23-9F55-4679-A6E7-9EFFEFE83298 |
| 133 | ON | 266 | 29599 | 7A8842BE-3139-4456-A7D8-1B8E0BCF9FC9 |
| 134 | OFF | 267 | 29600 | B0139B14-523D-48F0-BDB5-E60DF31BC3D1 |
| 134 | ON | 268 | 29601 | DCE7C786-0CE9-42A7-9525-6E461A097350 |
| 135 | OFF | 269 | 29602 | 98FBBE6B-4909-42B5-A5F3-E14C7DBD0F26 |
| 135 | ON | 270 | 29603 | EADC6339-4CC0-40D7-90A6-AB4D70C7895D |
| 136 | OFF | 271 | 29604 | 040CEE3F-3E89-474A-9F1F-FE0C4D3E95DF |
| 136 | ON | 272 | 29605 | 7085C5A2-7C4C-4AC1-81D1-13FDDBC0869B |
| 137 | OFF | 273 | 29606 | 3EE036A1-164C-41F3-ABCE-BA7B8ED54434 |
| 137 | ON | 274 | 29608 | AE41F09A-16B4-416E-BDFE-C39BB15FF1CD |
| 138 | OFF | 275 | 29609 | A7A10130-1A26-4478-B517-B91004B7CA95 |
| 138 | ON | 276 | 29610 | 8155CA80-F298-40F2-AE4D-3B18BA049CDA |
| 139 | OFF | 277 | 29611 | A09A8974-5B60-4B11-A0FD-CED6876AA458 |
| 139 | ON | 278 | 29612 | 058ACE84-C933-46BF-B07E-CE662671B503 |
| 140 | OFF | 279 | 29613 | A01ABE73-A7A3-45D4-815E-073F98313773 |
| 140 | ON | 280 | 29614 | 392EBFB8-6EC6-40F3-8D38-AB5DFA881F9B |
| 141 | OFF | 281 | 29616 | 6C02F132-C341-44E1-AF55-100EE384039C |
| 141 | ON | 282 | 29617 | E992692C-2C0E-4033-8378-DAF5BB6FEC55 |
| 142 | OFF | 283 | 29618 | 824106DF-005A-4ABD-894F-92D3E0C6524A |
| 142 | ON | 284 | 29619 | 6B70151B-F6CA-48F3-8D1D-5D8A553B1DD7 |
| 143 | OFF | 285 | 29620 | A8388EE9-6FC1-470D-AF3F-BE2EAEB6AF39 |
| 143 | ON | 286 | 29621 | F4868719-61A5-4BFB-9478-82BE1250DB8B |
| 144 | OFF | 287 | 29622 | 17827A47-62AF-49CD-A0CA-E6651D7A98CC |
| 144 | ON | 288 | 29623 | 194EFCFA-C27E-43E8-87FD-A5C06C5A8DC2 |
| 145 | OFF | 289 | 29625 | 37F9318C-F2BF-4818-95D2-0C0ABF30EDD9 |
| 145 | ON | 290 | 29626 | 655CC8D0-71AD-4956-83B9-E71ACEAE13AD |
| 146 | OFF | 291 | 29627 | A925B080-3417-45E7-9A7B-A66993C37607 |
| 146 | ON | 292 | 29628 | 21AD92F2-477B-4CD4-8E33-0E4DC34DA378 |
| 147 | OFF | 293 | 29629 | 7F9410E2-5C10-407E-BA1A-61B18DCE1FD8 |
| 147 | ON | 294 | 29630 | 69B67917-A691-4DD1-83A9-CF635A2230A7 |
| 148 | OFF | 295 | 29631 | 12164238-0600-4A3A-B605-A1AC423EE3A5 |
| 148 | ON | 296 | 29633 | 9342D778-95EF-4316-93C5-3C7C8A809A75 |
| 149 | OFF | 297 | 29634 | B56D955C-3EC7-4D23-9D98-88E9CF83C691 |
| 149 | ON | 298 | 29635 | AB9DC0AD-B871-4230-9095-08AAC92DF0CE |
| 150 | OFF | 299 | 29636 | 19E2325D-3ADE-4787-8CF8-4ABA404D7807 |
| 150 | ON | 300 | 29637 | 6363D0D6-C8E0-4CBC-AE3F-3D271CFCC897 |
| 151 | OFF | 301 | 29638 | 1960D4E9-71E0-4E19-801D-83AFF349D779 |
| 151 | ON | 302 | 29639 | D9E98BB0-DDFF-4AFB-96D8-A0DE5F58A640 |
| 152 | OFF | 303 | 29640 | 10293B58-8719-4F10-9AFB-4D9E6C5C8788 |
| 152 | ON | 304 | 29642 | 55DDA99B-13D6-4307-9700-A37A408C3ED8 |
| 153 | OFF | 305 | 29643 | C61D1086-16A0-43DF-BA72-A24137F164CB |
| 153 | ON | 306 | 29644 | A0DD86D1-4494-4813-8E46-0C0DD27B11E2 |
| 154 | OFF | 307 | 29645 | BED19330-8C1F-4CE9-A352-09111294D7D4 |
| 154 | ON | 308 | 29646 | 8C73A191-902C-469F-B16D-B8C8DDF92882 |
| 155 | OFF | 309 | 29647 | 873A9F3C-5D33-4C6D-860E-1B58293724BD |
| 155 | ON | 310 | 29649 | B468FD3D-FDAD-4944-8A44-EA45C4EC767C |
| 156 | OFF | 311 | 29650 | E85B1C2A-9668-43FE-B724-0A633A775452 |
| 156 | ON | 312 | 29651 | C7F54A6A-7711-41DE-BF00-647EC0C9CE78 |
| 157 | OFF | 313 | 29652 | D5477348-1E38-4C2B-919D-7BC2B58CD5B7 |
| 157 | ON | 314 | 29653 | 0A5A3EB5-965E-4CB5-B94B-7F6337D0F450 |
| 158 | OFF | 315 | 29654 | 62ABD569-5949-48FF-ADD0-2991976E2836 |
| 158 | ON | 316 | 29655 | 3B4368A5-7AD7-483A-BF8A-C0EB7107CF41 |
| 159 | OFF | 317 | 29657 | 3A6D6B4E-22A4-4EB7-87AD-B205DEDC0B8F |
| 159 | ON | 318 | 29658 | E63A4300-59DE-4D04-9173-8C5DF3164A10 |
| 160 | OFF | 319 | 29659 | 49C9CB56-84B9-4EAF-A6E6-876313E701FE |
| 160 | ON | 320 | 29660 | 827CA502-F1FB-4D3F-9F8A-B782DF173597 |
| 161 | OFF | 321 | 29661 | 3E7758C7-BB97-44FB-89E7-8627FAF85044 |
| 161 | ON | 322 | 29662 | 4F647ACC-E548-40CF-8B1B-D7C80EB3E859 |
| 162 | OFF | 323 | 29663 | 576355A7-BE38-4506-846A-71F1579DF1F6 |
| 162 | ON | 324 | 29665 | A4440115-E8FA-49EE-8532-0B276F5093C4 |
| 163 | OFF | 325 | 29666 | 008681B8-8D74-48A3-8CAA-93E8E6624CEF |
| 163 | ON | 326 | 29667 | 248C324D-A5A1-4265-8CED-2AE67960141E |
| 164 | OFF | 327 | 29668 | C2452CB4-482D-46CF-8BCA-63010F189D86 |
| 164 | ON | 328 | 29669 | 0D6ED64F-1E8A-4D52-AB32-24E21B594AED |
| 165 | OFF | 329 | 29670 | 5EEE2784-F833-43FF-B092-DD685B3AB391 |
| 165 | ON | 330 | 29671 | 8002C55A-A34F-45A1-8E29-17107BC886CB |
| 166 | OFF | 331 | 29673 | 54B6A4D1-A715-4901-9E59-B2551D8A5CC9 |
| 166 | ON | 332 | 29674 | F975B4A6-279B-4C15-8BCE-EBFA9D52FA1D |
| 167 | OFF | 333 | 29675 | 7999096D-92D8-4AE4-AF61-4451994D6266 |
| 167 | ON | 334 | 29676 | 86E3B65D-7951-4DE0-B471-FA4453352CB0 |
| 168 | OFF | 335 | 29677 | A1EDD2C8-2DCD-48A2-9240-531B613EDB41 |
| 168 | ON | 336 | 29678 | 03D4B625-52DB-4037-815B-58366A53EF1F |
| 169 | OFF | 337 | 29679 | FAD8E049-E22A-45F1-8691-D88E853A28A8 |
| 169 | ON | 338 | 29681 | 09CBF522-9809-41EC-8CA3-283EC23845F1 |
| 170 | OFF | 339 | 29682 | 696A5959-C6C2-4C2D-AE27-C03C1725FF60 |
| 170 | ON | 340 | 29683 | 6A1888B2-02F3-4DA6-9822-6074F761D90F |
| 171 | OFF | 341 | 29684 | 7C58D7BD-6954-4670-AFD4-E5D184D5D8A9 |
| 171 | ON | 342 | 29685 | CA657E2A-7EA8-4DC6-B323-A085E6B6B1FF |
| 172 | OFF | 343 | 29686 | 8CF2D320-4BD2-4B9E-9A37-CAF9DD91333A |
| 172 | ON | 344 | 29687 | 5ED33CF3-3142-446F-819D-63595D92D67A |
| 173 | OFF | 345 | 29688 | 476F9267-B613-4983-AD14-C5382348F195 |
| 173 | ON | 346 | 29690 | CC943E21-FD3E-48E5-9010-EA8CD2A544D9 |
| 174 | OFF | 347 | 29691 | FA14A416-552B-4BBC-9522-B3C87505EF1C |
| 174 | ON | 348 | 29692 | 3484957A-E2F8-4C67-9715-0E441D286A0C |
| 175 | OFF | 349 | 29693 | 687D26D2-1D40-41C6-AD8E-EA917420850C |
| 175 | ON | 350 | 29694 | C20B0F92-218F-44D2-B490-EAB572740640 |
| 176 | OFF | 351 | 29695 | A224D09A-F12D-4B59-8DE5-F7F9C4A72B40 |
| 176 | ON | 352 | 29696 | DAF58AF3-31AF-4942-9419-754B4FE07D63 |
| 177 | OFF | 353 | 29697 | 144985D8-0382-4896-A018-63AEFD26842D |
| 177 | ON | 354 | 29701 | 1F51B0CC-6FE5-4015-964E-DB1A44E36E7A |
| 178 | OFF | 355 | 29702 | 61959588-DB8F-427B-873E-D7DD7D0AED9D |
| 178 | ON | 356 | 29703 | CEBC741E-4FE9-481A-A211-982B842A9CD6 |
| 179 | OFF | 357 | 29704 | 4ECC5559-DBB1-4865-BC26-54689472ABFE |
| 179 | ON | 358 | 29705 | 78D8D735-1093-4759-8D73-6A429CAC8F39 |
| 180 | OFF | 359 | 29706 | 3950230A-70F5-4E9E-9050-04B7E52B700B |
| 180 | ON | 360 | 29707 | 08D7D425-2B9D-40F4-AD40-E92EC7C8C4AF |
| 181 | OFF | 361 | 29709 | CA5393AC-273C-4535-B73D-596D36B3CBE0 |
| 181 | ON | 362 | 29710 | A9FD4F4D-06E9-4E37-A1E4-C99429A90319 |
| 182 | OFF | 363 | 29711 | 97CD7EEE-54F8-4A21-A762-85C4FB4B72A9 |
| 182 | ON | 364 | 29712 | 748891BA-0CF3-4699-AFCB-67D14CF2ADD3 |
| 183 | OFF | 365 | 29713 | 85A11D98-58DC-415F-B27A-626381F75BED |
| 183 | ON | 366 | 29714 | 6760BEBA-6E3F-4310-A401-0B27FFCF9BE1 |
| 184 | OFF | 367 | 29715 | 0D5CC5FE-A69C-44F8-8870-B1D6D8356CBE |
| 184 | ON | 368 | 29716 | F3EA3EF0-5AC5-4AD0-A068-614ACA130FA6 |
| 185 | OFF | 369 | 29718 | A3C20145-273E-4A5F-B20D-B73939E0D136 |
| 185 | ON | 370 | 29719 | 1955B106-C3A8-4020-8127-F4B5E80F6A8D |
| 186 | OFF | 371 | 29720 | 3C08F99C-1CEF-4103-95B7-C53046DB7220 |
| 186 | ON | 372 | 29721 | 6D662ABC-4785-44F2-AFDD-7DC9DED9D5EE |
| 187 | OFF | 373 | 29722 | D15D7C4D-F8FE-4694-9EAE-28DE147B0CBE |
| 187 | ON | 374 | 29723 | 388E4C90-FB00-4B00-882D-BCB148308318 |
| 188 | OFF | 375 | 29724 | 184C96E5-2982-4E9B-BAA7-8EC3C50289DD |
| 188 | ON | 376 | 29725 | 54FBB0F5-70C2-4DC5-8672-DC43FC9E400A |
| 189 | OFF | 377 | 29727 | 7F08507C-BE82-4AE8-9160-1B3D05D64535 |
| 189 | ON | 378 | 29728 | 0FB4DD32-3BF8-447B-9CB2-3FF02E38375C |
| 190 | OFF | 379 | 29729 | E40C8DA1-B06C-46DD-8076-AC0083DAB80E |
| 190 | ON | 380 | 29730 | 97A45893-01A2-4089-81DC-96E7793C69F3 |
| 191 | OFF | 381 | 29731 | 478ECCD5-E0FF-4F28-BA1F-E6DE0519C18E |
| 191 | ON | 382 | 29732 | FEFADCC8-F077-496E-8B22-E58CFC1C93ED |
| 192 | OFF | 383 | 29733 | 5F8FA346-8D77-4FE6-ACF5-FD4A556071BE |
| 192 | ON | 384 | 29735 | 3D43B642-BCE7-47F8-8B0A-9334219AA951 |
| 193 | OFF | 385 | 29736 | E94C7FFD-B3B3-4EB8-B42C-39534595C4BA |
| 193 | ON | 386 | 29737 | A14F2E3F-C262-4261-8856-99FBF5947EC7 |
| 194 | OFF | 387 | 29738 | 320A22D0-320C-44BC-8496-CE089ABACE7A |
| 194 | ON | 388 | 29739 | 072D074C-680D-45D3-AA53-6C9C7742CA4A |
| 195 | OFF | 389 | 29740 | 8AC997C1-447A-4E2D-8CFD-9E3D5FA08FB9 |
| 195 | ON | 390 | 29741 | 999C25C8-CEBC-431D-B147-E37FF200B5BD |
| 196 | OFF | 391 | 29742 | 544CBB55-4442-440F-954C-98B4919D5F62 |
| 196 | ON | 392 | 29744 | B03C2543-EF68-4DB6-A75F-678AC5CF7D7F |
| 197 | OFF | 393 | 29745 | 7B7523D8-082E-48EC-8383-BA52DD4CB3A0 |
| 197 | ON | 394 | 29746 | F10165F8-364E-42EB-A961-19BDEF8A006E |
| 198 | OFF | 395 | 29747 | 06A8F001-A4EE-4BF6-BA05-54673A5D3502 |
| 198 | ON | 396 | 29748 | AE018E38-68BB-44B0-9DEC-FE8B0F1F94D5 |
| 199 | OFF | 397 | 29749 | 6571CB94-5823-4ADD-B276-ADF40A944D42 |
| 199 | ON | 398 | 29750 | F7FF0533-52E9-40C2-A898-3BB9D934058E |
| 200 | OFF | 399 | 29751 | B068E3BF-AEE0-49D7-9524-115E1FF2B47C |
| 200 | ON | 400 | 29753 | 0BF5FAB1-1985-4B74-BD65-BA31D649DEB2 |
| 201 | OFF | 401 | 29754 | 523C3B73-7345-4FE3-A4CA-1497E5B45DFC |
| 201 | ON | 402 | 29755 | 27E02E13-045F-4794-A984-84D743856B69 |
| 202 | OFF | 403 | 29756 | 7FA99D71-D873-402E-870C-EB774798FCF9 |
| 202 | ON | 404 | 29757 | 3B7B0D0B-415C-44C6-913D-0BC5A6D92075 |
| 203 | OFF | 405 | 29758 | 9A591349-7576-41AB-B4C6-61EF51D0790E |
| 203 | ON | 406 | 29759 | 07532711-F79A-45DD-9208-05F4224AEF9C |
| 204 | OFF | 407 | 29761 | 08047750-81A2-4885-9074-C102A25B32FB |
| 204 | ON | 408 | 29762 | 31A09C33-27AE-4CFE-8EF8-63616246487B |
| 205 | OFF | 409 | 29763 | B61E3E6D-2239-4AE1-A7E7-96D639F53529 |
| 205 | ON | 410 | 29764 | 32ED8DD9-4E46-4857-8BDF-B31D82ADE800 |
| 206 | OFF | 411 | 29765 | 7309AAF1-D860-4AD2-BBA2-AFD6EC06C3BE |
| 206 | ON | 412 | 29766 | 2A22361A-17F6-4328-89B2-CA8E9DB92DCF |
| 207 | OFF | 413 | 29767 | C1B71513-F20D-4A00-AAFF-8B251C1C1F02 |
| 207 | ON | 414 | 29768 | C0EDE234-C4E8-4EE4-8ABA-B89DE7F1F209 |
| 208 | OFF | 415 | 29770 | 3935F594-9537-4FEC-978F-30068A89E680 |
| 208 | ON | 416 | 29771 | 5CD5A0D7-410F-4DCD-97C7-C083B754AA48 |
| 209 | OFF | 417 | 29772 | BD3BF0F2-6212-4499-990F-5FD8032FA25C |
| 209 | ON | 418 | 29773 | 68D2B486-537D-4AA2-AB26-BECDB3219922 |
| 210 | OFF | 419 | 29774 | F5FD1D51-9E2B-4C6A-8214-1B1A45230F26 |
| 210 | ON | 420 | 29775 | DE202F9B-5F82-4A73-8A76-77001D6FC705 |
| 211 | OFF | 421 | 29776 | F58CED77-487B-42E4-96D5-BB2696097451 |
| 211 | ON | 422 | 29778 | 1E2FEDBD-6989-407B-BAEF-BA623F9CA807 |
| 212 | OFF | 423 | 29779 | B432A40A-CCA0-4875-9815-3172814E4ACA |
| 212 | ON | 424 | 29780 | 2F0BD43E-85E0-4961-8F8B-36C309C3A2AC |
| 213 | OFF | 425 | 29781 | 01E07F8B-B24F-4476-9EC7-4AAD9E3F4E90 |
| 213 | ON | 426 | 29782 | 04DC1302-0FBD-4C8C-9D0B-53FC15651633 |
| 214 | OFF | 427 | 29783 | 23CF34D0-7C4F-454D-BBFE-210A4FB58AA6 |
| 214 | ON | 428 | 29784 | D2FD2F6C-C902-4809-A657-630C55B41535 |
| 215 | OFF | 429 | 29785 | 8F2F7EB9-A362-41B4-84F5-0CA5B11FBCF7 |
| 215 | ON | 430 | 29787 | D29C9D2C-0C3E-4BCF-846F-28426807DFFD |
| 216 | OFF | 431 | 29788 | 7C019237-79BD-4255-A16B-0B0A9F137823 |
| 216 | ON | 432 | 29789 | 61AFB0AD-766F-4E1C-A047-17B6E0A883AF |
| 217 | OFF | 433 | 29790 | C2CE19D6-CF71-4CCC-AF5E-B518DC15CA6A |
| 217 | ON | 434 | 29791 | 5EE50E8A-C442-4BFA-AC14-4B86B4CCB142 |
| 218 | OFF | 435 | 29792 | E21408CF-D49A-4B4D-AAC9-F5417067053B |
| 218 | ON | 436 | 29793 | 438BF8F1-5B63-4207-A032-FC1A8E7BD5AB |
| 219 | OFF | 437 | 29795 | 6C81C9C2-6582-48C2-82C4-47278FF5978D |
| 219 | ON | 438 | 29796 | 15041DFD-DA03-4FBE-B09D-38252FD13282 |
| 220 | OFF | 439 | 29797 | 89371DB0-C846-4478-B01D-B8BE1190E1FA |
| 220 | ON | 440 | 29798 | FEBFCA21-A4BD-4AC9-B3F8-C0D232EBFB46 |
| 221 | OFF | 441 | 29799 | 428EED0C-1573-4F35-BCAD-A42FDA8870D0 |
| 221 | ON | 442 | 29800 | 412CB9CD-C5B9-4D38-8864-77C77ACFE3A9 |
| 222 | OFF | 443 | 29801 | 9E6FA067-2A93-497F-BA98-88B74E3E24C0 |
| 222 | ON | 444 | 29803 | 3CACE1B8-35F2-40A3-AF93-31026B3F6095 |
| 223 | OFF | 445 | 29804 | E26DD4C0-5A70-4647-8F9B-21572C8151B6 |
| 223 | ON | 446 | 29805 | A2628A2A-DE5A-445E-BBB3-5ED2891F6570 |
| 224 | OFF | 447 | 29806 | DE4BDE7D-3D46-416A-AA44-97709D90D702 |
| 224 | ON | 448 | 29807 | C7B29A9E-E01B-4146-8DBD-846FD19B52B9 |
| 225 | OFF | 449 | 29808 | 895F5A74-6827-4540-BD5D-7CE56FF3AC5B |
| 225 | ON | 450 | 29809 | 82D96D3C-9BDE-4361-822F-2D047B0CB114 |
| 226 | OFF | 451 | 29810 | D702A504-93D9-4EE5-AED0-137C5B4ADDC8 |
| 226 | ON | 452 | 29812 | 28B7D37F-E61D-4EC6-B9AF-C412B7F4D844 |
| 227 | OFF | 453 | 29813 | 01E866C0-B0C9-47B7-82BA-B8FD5D3815AE |
| 227 | ON | 454 | 29814 | CDF37CA9-D6A7-47F8-B360-D8A150F1FFDA |
| 228 | OFF | 455 | 29815 | D691A5B2-CC7A-47FF-82AD-E37827A94D9F |
| 228 | ON | 456 | 29816 | 3E6A145C-DA92-4E55-952F-5A9D1ED1401D |
| 229 | OFF | 457 | 29817 | C8519862-4C5F-48CC-ABEE-250C8D1A99CC |
| 229 | ON | 458 | 29818 | 5C658C47-D29B-4ADC-B2ED-2D42A0569945 |
| 230 | OFF | 459 | 29819 | 2ED02FCD-8BBD-40F4-9818-142FF9714BE1 |
| 230 | ON | 460 | 29821 | F47D4A5B-CB5A-4648-BFC4-B310B753899C |
| 231 | OFF | 461 | 29822 | 0B6522BB-399A-4706-BD6F-7855627CB54A |
| 231 | ON | 462 | 29823 | 8AFA3962-46AD-4BFA-B48E-F898FE5C3DD6 |
| 232 | OFF | 463 | 29824 | 7ACEBCEF-6C64-41D9-9B6B-67D534BF52F5 |
| 232 | ON | 464 | 29825 | 42262B40-A05D-4750-9A5D-0974FCE3A19D |
| 233 | OFF | 465 | 29826 | 00F662EE-57F3-4CBA-A3E9-F45F8CB910F7 |
| 233 | ON | 466 | 29827 | A2C8BD86-D3E4-4BA1-BFC2-650AE721B553 |
| 234 | OFF | 467 | 29829 | B901805E-11FB-4FBD-AF65-62C99DE06C83 |
| 234 | ON | 468 | 29830 | 58AA1DC3-9692-4A86-917E-5B46BD3D62C6 |
| 235 | OFF | 469 | 29831 | 08AD9919-6FB8-40C1-BBD0-6D7060020502 |
| 235 | ON | 470 | 29832 | BE1C71F2-C946-4230-9946-64A1434663B9 |
| 236 | OFF | 471 | 29833 | 27F6C266-CF76-433B-9D35-C1109EB735F9 |
| 236 | ON | 472 | 29834 | 8F6A6B44-CDF8-4954-8880-FB8015EEB18E |
| 237 | OFF | 473 | 29835 | 5AEC85AE-1319-4116-96D9-16FB2E1026B9 |
| 237 | ON | 474 | 29836 | C6D3A9DE-AF66-4278-922C-11D882C8481F |
| 238 | OFF | 475 | 29838 | C19DBCB0-8F63-4EC3-BA4C-BF4A6DD3E58D |
| 238 | ON | 476 | 29839 | 0582C09B-8781-4CEB-9AA8-8DF7F1F34020 |
| 239 | OFF | 477 | 29840 | 7EF76D3A-5E37-4C01-9BC5-58915204DE78 |
| 239 | ON | 478 | 29841 | BC4B74ED-2180-4671-98BB-1BEC289879C2 |
| 240 | OFF | 479 | 29842 | A5F6019E-6E04-4C7F-B4C0-E126C859EC3F |
| 240 | ON | 480 | 29843 | 6591B81D-B854-4D16-A6C7-4818DB70144E |
| 241 | OFF | 481 | 29844 | FFCC3E70-7591-4628-AA26-395FE4D4384C |
| 241 | ON | 482 | 29845 | 01C541D0-EADC-4811-B266-D627172C8AA0 |
| 242 | OFF | 483 | 29847 | 564F89A4-E132-412B-BD3D-7B243106F07E |
| 242 | ON | 484 | 29848 | 24C36065-E025-41E0-90FB-7C64FFAC24EF |
| 243 | OFF | 485 | 29849 | 4B4749B1-3626-4404-A75B-5F83B8604E84 |
| 243 | ON | 486 | 29850 | 32341596-F2E2-4346-9E9A-851DCE384A52 |
| 244 | OFF | 487 | 29851 | D1BB9815-6BA5-41F7-8175-ED9D9ED0A568 |
| 244 | ON | 488 | 29852 | 6BDCEB4C-65E4-4CAA-B6FC-B9E0AF7CE0A9 |
| 245 | OFF | 489 | 29853 | BFEEDE98-9DF7-4F1E-857F-F599B341074C |
| 245 | ON | 490 | 29854 | 7C571D5A-1EE9-44B9-A209-46CEEEB02A54 |
| 246 | OFF | 491 | 29856 | 242E8C48-0849-44F8-B08D-D50AA5053C51 |
| 246 | ON | 492 | 29857 | 9CDC094B-FE0F-4245-AE09-1390FE1C484B |
| 247 | OFF | 493 | 29858 | 90AFD7EB-575C-40B3-8A0C-B9702F37984F |
| 247 | ON | 494 | 29859 | FE410EF7-9079-4ECD-AE36-AF0FF4C649EF |
| 248 | OFF | 495 | 29860 | B828B7BE-6DE2-4DC8-9EDD-0768AD4735D8 |
| 248 | ON | 496 | 29861 | 6CE064E9-9DC7-43B2-9915-72AC7AD87B27 |
| 249 | OFF | 497 | 29862 | 7D5F10BD-D227-4C2C-8DD8-BF47E9EFDD09 |
| 249 | ON | 498 | 29863 | C9C5E8C6-5749-44EB-9A8A-F632A73B03BD |
| 250 | OFF | 499 | 29865 | ECCCD491-DC45-4022-A467-E740CB1182C0 |
| 250 | ON | 500 | 29866 | 7775D723-369C-43EA-AD1E-982D82C61247 |
