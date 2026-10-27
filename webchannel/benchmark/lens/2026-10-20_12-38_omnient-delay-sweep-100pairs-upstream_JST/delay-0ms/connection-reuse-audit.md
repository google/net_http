# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 400 | handshake | h2 | false | 62.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 55.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 400 | handshake | h2 | false | 58.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 400 | handshake | h2 | false | 56.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 26.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | failed | 400 | handshake | h2 | false | 43.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | earlyPOST | h2 | true | 64.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 26.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | failed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 36.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 41.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | failed | 400 | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | failed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 56.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 400 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 35.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 54.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 400 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 400 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | failed | 400 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 42.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 400 | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | earlyPOST | h2 | true | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 400 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | earlyPOST | h2 | true | 56.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 62.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 400 | earlyPOST | h2 | true | 58.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 28.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 400 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 400 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 41.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 400 | earlyPOST | h2 | true | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | failed | 400 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | earlyPOST | h2 | true | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 400 | earlyPOST | h2 | true | 323.000 | 310.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 37.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 400 | handshake | h2 | false | 33.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 200 | earlyPOST | h2 | true | 35.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 200 | handshake | h2 | false | 101.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 70.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | failed | 400 | handshake | h2 | false | 70.000 | 49.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 34.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 200 | earlyPOST | h2 | true | 87.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 52.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | failed | 400 | handshake | h2 | false | 42.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | failed | 400 | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 48.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 400 | handshake | h2 | false | 42.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 37.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 200 | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 61.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | failed | 400 | earlyPOST | h2 | true | 47.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 400 | earlyPOST | h2 | true | 57.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 45.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | completed | 200 | earlyPOST | h2 | true | 46.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 40.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 62.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | failed | 400 | earlyPOST | h2 | true | 53.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 44.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 48.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 35.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 51.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | failed | 400 | handshake | h2 | false | 43.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 46.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 400 | handshake | h2 | false | 65.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 44.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | failed | 400 | earlyPOST | h2 | true | 75.000 | 64.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 44.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | failed | 400 | earlyPOST | h2 | true | 46.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 45.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 200 | earlyPOST | h2 | true | 48.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 82.000 | 47.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | failed | 400 | handshake | h2 | false | 52.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 49.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | failed | 400 | handshake | h2 | false | 47.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 41.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | earlyPOST | h2 | true | 43.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 164.000 | 73.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 400 | earlyPOST | h2 | true | 35.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 49.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 37.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | failed | 400 | earlyPOST | h2 | true | 38.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 41.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | failed | 400 | handshake | h2 | false | 48.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 44.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | failed | 400 | earlyPOST | h2 | true | 44.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 43.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 200 | earlyPOST | h2 | true | 43.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 42.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 200 | earlyPOST | h2 | true | 40.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 43.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 200 | earlyPOST | h2 | true | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 41.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | failed | 400 | earlyPOST | h2 | true | 49.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 39.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 200 | handshake | h2 | false | 48.000 | 36.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 41.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 400 | handshake | h2 | false | 40.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | earlyPOST | h2 | true | 102.000 | 80.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 51.000 | 34.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 400 | earlyPOST | h2 | true | 61.000 | 50.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 56.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 400 | handshake | h2 | false | 48.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 52.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | failed | 400 | earlyPOST | h2 | true | 88.000 | 54.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 51.000 | 41.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | failed | 400 | handshake | h2 | false | 51.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 56.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 400 | handshake | h2 | false | 48.000 | 35.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 46.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 400 | handshake | h2 | false | 70.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 44.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 67.000 | 53.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 100.000 | 81.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | earlyPOST | h2 | true | 64.000 | 52.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 32.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | failed | 400 | earlyPOST | h2 | true | 39.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 79.000 | 58.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 400 | earlyPOST | h2 | true | 35.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | failed | 400 | handshake | h2 | false | 41.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 33.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | failed | 400 | handshake | h2 | false | 41.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | failed | 400 | earlyPOST | h2 | true | 42.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 40.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | failed | 400 | handshake | h2 | false | 35.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 42.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | failed | 400 | earlyPOST | h2 | true | 37.000 | 29.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 0.265 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 0.260 | count=2 | handshake POST | handshake POST |
| omnient | 5 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 0.229 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 0.231 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 0.228 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 0.231 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 0.232 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 0.231 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 0.231 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 0.231 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 0.232 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 0.231 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 0.230 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 0.267 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 0.233 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 0.231 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 0.232 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 0.234 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 0.231 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 0.232 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 0.241 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 0 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 66/100 ON trials. Of those trials, 38 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 1, 2, 3, 5, 6, 8, 12, 15, 18, 23, 25, 26, 27, 29, 32, 33, 34, 37, 38, 40, 41, 42, 43, 47, 48, 49, 50, 57, 60, 62, 67, 74, 84, 86, 87, 90, 91, 95. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 10 ON; omnient pair 13 ON; omnient pair 16 ON; omnient pair 17 ON; omnient pair 28 ON; omnient pair 45 ON; omnient pair 53 ON; omnient pair 55 ON; omnient pair 56 ON; omnient pair 59 ON; omnient pair 63 ON; omnient pair 66 ON; omnient pair 68 ON; omnient pair 69 ON; omnient pair 71 ON; omnient pair 72 ON; omnient pair 76 ON; omnient pair 77 ON; omnient pair 78 ON; omnient pair 82 ON; omnient pair 88 ON; omnient pair 89 ON; omnient pair 94 ON; omnient pair 96 ON; omnient pair 97 ON; omnient pair 98 ON; omnient pair 99 ON; omnient pair 100 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 1100 | 59ECC895-7E2F-46FC-AF3D-6A8FBF68BF94 |
| 1 | ON | 2 | 1101 | B8127BBD-B341-4740-A325-0331D98D59DF |
| 2 | OFF | 3 | 1102 | D9CFA3A6-912F-496C-BD40-DF3688F9C11C |
| 2 | ON | 4 | 1103 | 1EA81970-B429-4095-A5FE-C29A066B117D |
| 3 | OFF | 5 | 1104 | 7D5CF6D5-2B86-4D24-BE64-92C3D445FA9D |
| 3 | ON | 6 | 1106 | 597681B1-BFDB-41F9-8A53-550D59587FAB |
| 4 | OFF | 7 | 1107 | 555870A3-BB2B-40E9-85D1-09AB28C27A27 |
| 4 | ON | 8 | 1108 | 16ADDBE7-2515-4C0A-8AA0-957EA693566D |
| 5 | OFF | 9 | 1110 | 13BED80B-2CE2-4D12-BCDE-C281883A70FC |
| 5 | ON | 10 | 1111 | 0D8B7D4C-D491-4C19-8321-52AB54A393EE |
| 6 | OFF | 11 | 1112 | C71E73B4-C7E6-4D0B-8E94-4FAAF5ABE0B5 |
| 6 | ON | 12 | 1113 | 5C3A2A21-F35A-4747-9E99-29FA278A4D93 |
| 7 | OFF | 13 | 1114 | 1C545950-4991-4C96-94EE-5DB103F18082 |
| 7 | ON | 14 | 1115 | 6B9F2FD6-FD3E-4FD0-8C15-88A67DAE0384 |
| 8 | OFF | 15 | 1116 | 79F14513-63D5-456C-8B26-2D9814F42799 |
| 8 | ON | 16 | 1117 | E043E6FB-735A-4F08-915F-9AFD290EB6A6 |
| 9 | OFF | 17 | 1118 | DA230950-1AA0-45D5-BBC1-24624FB97069 |
| 9 | ON | 18 | 1120 | E0CCB262-4518-4F2C-B4B1-E739E6604409 |
| 10 | OFF | 19 | 1121 | ABA6AF9E-34CB-462A-BEAA-8C06AF41965F |
| 10 | ON | 20 | 1122 | BB75B80E-B29A-4D25-8514-0200870A2A50 |
| 11 | OFF | 21 | 1123 | E8053440-9897-4459-B11F-85B5CAAEC9C1 |
| 11 | ON | 22 | 1124 | F8BE8BBF-28C3-4B0C-ABBF-11645478E664 |
| 12 | OFF | 23 | 1125 | FC193548-D349-4D38-BDEB-0A8A9E5ED0CA |
| 12 | ON | 24 | 1126 | 63E41F86-5E02-4220-A374-A1F944C7F77D |
| 13 | OFF | 25 | 1127 | 39DE92A2-4C1F-4890-B463-87E4512115AB |
| 13 | ON | 26 | 1129 | 771DAD12-5215-4D04-AA84-5E2D26CD726A |
| 14 | OFF | 27 | 1130 | 4FA41FB4-DA16-462D-B26F-90ED5350D59C |
| 14 | ON | 28 | 1131 | 525056EC-D85C-4576-BF08-D5C2B573F89B |
| 15 | OFF | 29 | 1132 | B99A5D4C-1B98-437B-98E0-9BD41DE08999 |
| 15 | ON | 30 | 1133 | 37F70125-0239-4E1D-A5F7-182758BF4318 |
| 16 | OFF | 31 | 1134 | E3C03684-B41C-43B1-8500-D1CC1FF53555 |
| 16 | ON | 32 | 1135 | 1BDDDCF8-637D-45CA-8445-0D25D2499B9A |
| 17 | OFF | 33 | 1136 | F9659EC0-763A-4A63-8185-3D29A66093B9 |
| 17 | ON | 34 | 1137 | AA60DFC5-9AE4-4BDC-835A-7C85175544EC |
| 18 | OFF | 35 | 1138 | BB987F94-A64A-4871-84F6-402928E021E0 |
| 18 | ON | 36 | 1140 | 163A3131-4992-4CA5-B59C-6EE7D88E7D27 |
| 19 | OFF | 37 | 1141 | E0F10EF6-3054-4159-96F4-D0DE77F5A365 |
| 19 | ON | 38 | 1142 | 914985BC-3199-4967-9920-E4217F59A64E |
| 20 | OFF | 39 | 1143 | 0D9BD42D-5683-4588-A5FA-FD09647CD691 |
| 20 | ON | 40 | 1144 | 7122C597-CB1C-4F28-A0D3-D11F63797659 |
| 21 | OFF | 41 | 1145 | 8D737B65-4B96-4891-A5E3-A4046C04A8E4 |
| 21 | ON | 42 | 1146 | 6F1B06A8-A3E2-47DC-9E93-BECB69875BAD |
| 22 | OFF | 43 | 1147 | 574B887F-3D3E-4182-804C-FCFFFB29C6EC |
| 22 | ON | 44 | 1149 | B8D0578E-3FC0-4BA9-AF62-6DB91F14B4A5 |
| 23 | OFF | 45 | 1150 | B9B8DC07-7788-4D2F-88AA-1612B556CBDD |
| 23 | ON | 46 | 1151 | A89E2727-059C-4D4C-8D65-C7AB6AAE210D |
| 24 | OFF | 47 | 1152 | D689CAE4-3321-4A10-B78C-91CC8ECC7C80 |
| 24 | ON | 48 | 1153 | 25062CF8-EBB1-4247-88D9-E1AD8748D3E7 |
| 25 | OFF | 49 | 1154 | 8F2F6D57-6DDC-4E8D-A9E9-33D72D8A1200 |
| 25 | ON | 50 | 1155 | B8503BC8-B545-4B65-84E7-430E45875C93 |
| 26 | OFF | 51 | 1156 | EBDEDA62-AEE1-42EB-9901-D8645ECCAE02 |
| 26 | ON | 52 | 1157 | 4475CB88-08DF-40F5-8D64-B447C0C71841 |
| 27 | OFF | 53 | 1159 | 6C142D00-7E34-472D-B40F-600616777324 |
| 27 | ON | 54 | 1160 | 0B6A67DE-AEB8-47BD-BD5A-B06EAAECE6D9 |
| 28 | OFF | 55 | 1161 | D0C8E615-1DB4-470D-A861-1897A1018D0B |
| 28 | ON | 56 | 1162 | 8BE25ACF-A6FA-4692-AE5E-5CDA03CB257C |
| 29 | OFF | 57 | 1163 | 87CDD16B-82F9-4000-B4EC-D1E0F0933414 |
| 29 | ON | 58 | 1164 | E9790CA2-E71F-4F24-9D3E-FF96D31FD2A8 |
| 30 | OFF | 59 | 1165 | 5A7B77C5-3F69-492D-86E7-E6AC274C84AE |
| 30 | ON | 60 | 1166 | 1A2C00F5-2344-45E6-9E99-553A89CC166B |
| 31 | OFF | 61 | 1167 | 749CE045-6490-446A-B8C5-DB521FDBB3C9 |
| 31 | ON | 62 | 1169 | F3572420-4816-48A0-884F-D14F3B9FC793 |
| 32 | OFF | 63 | 1170 | C5D79E22-76F4-4F93-8889-9666C65B2D02 |
| 32 | ON | 64 | 1171 | C69BA471-A8CB-48B2-9C50-0EF10B5E343C |
| 33 | OFF | 65 | 1172 | D6A1B462-6F0D-49B1-9428-001740DEEE3D |
| 33 | ON | 66 | 1173 | 6847A4DB-A536-4D75-B22E-B1FF19F0884D |
| 34 | OFF | 67 | 1174 | 85D07244-C389-4A3C-A110-ECF7FAEFE0E6 |
| 34 | ON | 68 | 1175 | 6E8FC661-1E4C-44B6-BC5C-9356C832124C |
| 35 | OFF | 69 | 1176 | 67E2873E-4549-47AF-9D09-376ADD15DEFC |
| 35 | ON | 70 | 1177 | AD6EA607-F4CA-427E-9F72-8290EEF4205C |
| 36 | OFF | 71 | 1179 | 793F9DC8-BA97-4520-9979-3AAA0431BCD6 |
| 36 | ON | 72 | 1180 | E158F62A-6509-4E42-9209-0D38BB5EE5A3 |
| 37 | OFF | 73 | 1181 | 0A9362A8-394C-4472-A312-E4CC75BDE384 |
| 37 | ON | 74 | 1182 | 6CEEA65E-EDDB-4C01-A4B7-73BC278DC401 |
| 38 | OFF | 75 | 1183 | 6037205F-0C68-4169-92D0-8F072DF96117 |
| 38 | ON | 76 | 1184 | 872D6A57-D954-4300-9B46-3D21F9D0611F |
| 39 | OFF | 77 | 1185 | 8077D3B9-00D5-4304-8D90-9C52E987EB96 |
| 39 | ON | 78 | 1186 | C1200793-10CD-4A47-8A5A-63E79B6A58AA |
| 40 | OFF | 79 | 1188 | 424C9B57-07BB-4AC0-B0B4-D2BD648A4016 |
| 40 | ON | 80 | 1189 | DC23AFDD-B8EA-4E6B-B2F2-0EBE79D3C2AC |
| 41 | OFF | 81 | 1190 | 79DC0445-B3EB-47AF-8A27-159C642BF5C0 |
| 41 | ON | 82 | 1191 | 6C285B62-B83A-43E7-A6A9-F1E66FEE1CDC |
| 42 | OFF | 83 | 1192 | DD2D6006-D327-4419-A1A4-658B9B57BA0E |
| 42 | ON | 84 | 1193 | 22F820FE-36DB-4251-BAB9-B2E1C6148756 |
| 43 | OFF | 85 | 1194 | 892FC0E4-4B53-458D-A729-7B942FCEF561 |
| 43 | ON | 86 | 1195 | A36B1C5B-0E43-45F4-8A42-DD213D981835 |
| 44 | OFF | 87 | 1196 | 8E7A0D82-8635-4708-B286-880980C78E12 |
| 44 | ON | 88 | 1198 | 690DF89C-E0E7-485D-B676-8937DCE1C211 |
| 45 | OFF | 89 | 1199 | 984A9DC0-5B32-4323-8960-905C9D655D27 |
| 45 | ON | 90 | 1200 | C6F954F3-18A7-48B6-81C4-BBC86BD66E99 |
| 46 | OFF | 91 | 1201 | 51871703-0ADD-475C-BC2C-75AE1F39DF48 |
| 46 | ON | 92 | 1202 | 416AD9FF-2644-45D0-8F2F-89B83BF8036D |
| 47 | OFF | 93 | 1203 | 200B7459-4266-4EC8-8246-318A9613D9ED |
| 47 | ON | 94 | 1204 | 8575F77F-D147-4661-AE34-B171F51052C8 |
| 48 | OFF | 95 | 1205 | 2F642BF9-C73E-4B5D-8461-9C5958ADBD7A |
| 48 | ON | 96 | 1206 | 3C8C9716-899D-4F58-86F6-67362D55308F |
| 49 | OFF | 97 | 1208 | 9A7DB36F-C71F-487B-85E3-1C4E5027571F |
| 49 | ON | 98 | 1209 | 011DCDDA-A45B-4779-8E29-320799076090 |
| 50 | OFF | 99 | 1210 | 2D696C90-4E07-4248-8699-5F0E40CD6B62 |
| 50 | ON | 100 | 1211 | EBA96BE7-D5D7-45AB-8136-FD968C99F490 |
| 51 | OFF | 101 | 1212 | F720E343-FF5B-4678-AB3F-4EAC4D8317E4 |
| 51 | ON | 102 | 1213 | E253FB9A-B8BB-4831-AA87-48B808109BA1 |
| 52 | OFF | 103 | 1214 | B4335446-4652-4190-837E-6AC56FF2E2A5 |
| 52 | ON | 104 | 1215 | 715AA3CC-D26A-448F-8045-0A425EF09F59 |
| 53 | OFF | 105 | 1217 | 32B8FCDC-4F91-495E-AEE6-3F5D0B1AF7DF |
| 53 | ON | 106 | 1218 | C5A0075F-DE8A-44F9-8682-01ED29708FBD |
| 54 | OFF | 107 | 1219 | 60BAF9D5-9C75-45D2-9BC6-0A5F63B7372F |
| 54 | ON | 108 | 1220 | 8E1BEA13-5E24-44F7-BF2A-8F40EE42E50F |
| 55 | OFF | 109 | 1221 | 0A41B36F-2828-402C-89E9-1AE45ED82A79 |
| 55 | ON | 110 | 1222 | 98898801-B9B1-41FA-8F2D-DAF612774F52 |
| 56 | OFF | 111 | 1223 | AECC7EB0-8734-4D41-B078-548E3F2A0C7A |
| 56 | ON | 112 | 1224 | F9D7CD0E-1091-4CBC-AF8A-1E109D4370EE |
| 57 | OFF | 113 | 1225 | 227789B8-7C5C-475D-B514-0991F9E1F60B |
| 57 | ON | 114 | 1226 | 88D67095-7FDE-4418-917D-7E8F557A48F8 |
| 58 | OFF | 115 | 1228 | 489C914B-E9ED-448F-91B3-9B7233507A2A |
| 58 | ON | 116 | 1229 | AEDAA48A-AED7-4D76-88A3-5A8313B436A2 |
| 59 | OFF | 117 | 1230 | E8CC315F-FE31-4EA7-BB39-6272AD6678DF |
| 59 | ON | 118 | 1231 | E3DDED6A-DD8D-49CC-9D9A-E22E7C97C896 |
| 60 | OFF | 119 | 1232 | 85939821-C6D1-4F36-9510-45A31834DAE1 |
| 60 | ON | 120 | 1233 | D6F558E2-4F58-4665-8781-774ADD3F371C |
| 61 | OFF | 121 | 1234 | 47314325-4094-452E-AFC2-6C36DEE19CC0 |
| 61 | ON | 122 | 1235 | 2D30739B-8328-4F9A-90CC-5FCF0BA879BB |
| 62 | OFF | 123 | 1236 | F394BC90-6DE4-4BBF-A9DD-B3D0E9BDA00E |
| 62 | ON | 124 | 1238 | 6855A11B-56CC-4A40-8E02-482ADFD50F5F |
| 63 | OFF | 125 | 1239 | A8DFE701-A9A3-4045-9309-34B19B4E937E |
| 63 | ON | 126 | 1240 | 90016CC9-40C9-4E17-AAB3-E2AA4858530F |
| 64 | OFF | 127 | 1241 | DDA45C41-654D-46D4-AE61-1CEBCF0C35C9 |
| 64 | ON | 128 | 1242 | 1F21B4B5-E8BD-4D9F-B957-FCC82803D02F |
| 65 | OFF | 129 | 1243 | B3605282-C901-4590-AE10-6A170E598B6C |
| 65 | ON | 130 | 1244 | 2FCD2F93-769B-4625-AA43-9DEEEE5ECFB7 |
| 66 | OFF | 131 | 1245 | 5AAE6556-0C94-49E6-A0AB-C7D45D6AEC28 |
| 66 | ON | 132 | 1247 | A7E7F757-1475-4C24-8165-A3F2227AD5C3 |
| 67 | OFF | 133 | 1248 | 25DB85E8-DD13-4CB7-B428-90DA6F0340A8 |
| 67 | ON | 134 | 1249 | 6FF07D87-D9FA-4056-B129-097DCC975852 |
| 68 | OFF | 135 | 1250 | D93C1221-56D2-443B-923D-490F9FE40FE6 |
| 68 | ON | 136 | 1251 | 1E3A4194-7B62-44E7-A13B-A2B1A7A5F734 |
| 69 | OFF | 137 | 1252 | 165537A6-1A57-4879-B7AC-FD304AB1C82C |
| 69 | ON | 138 | 1253 | 6F432289-A9F7-4D3B-8C08-1EC42F23C960 |
| 70 | OFF | 139 | 1254 | B459AF41-66DB-4DBB-AAC4-B16F20AC25EA |
| 70 | ON | 140 | 1255 | E0D7D138-01D2-4098-A66A-908D7F9A6ADC |
| 71 | OFF | 141 | 1256 | CFEC5CCB-4B8C-4F0F-8DE6-E6BF6E7B7844 |
| 71 | ON | 142 | 1258 | 4B08DFBF-374A-4A3D-843C-4BF3E1E7668A |
| 72 | OFF | 143 | 1259 | 948B3DBF-B62A-4731-92EE-B51D013654C9 |
| 72 | ON | 144 | 1260 | E138E28A-3008-4E35-99A3-B043F16DCC53 |
| 73 | OFF | 145 | 1261 | F46E75AB-634E-44CD-BE1D-3D5AFDCAB6BF |
| 73 | ON | 146 | 1262 | 3484EB8E-9E70-4ED1-A3E4-DC2E4F533C1F |
| 74 | OFF | 147 | 1263 | 2404B1EB-ACB0-4362-9C25-CB51DCD7B2EB |
| 74 | ON | 148 | 1264 | AFF3E8CE-F29B-4CD3-A222-05CEC72F8D0B |
| 75 | OFF | 149 | 1265 | B7E211A2-F648-4D65-8BEE-42633C1A6F79 |
| 75 | ON | 150 | 1266 | 38D17E2D-0C04-49DB-8A7D-639D6EC60B71 |
| 76 | OFF | 151 | 1268 | C74EDC67-C6DA-4BD4-A90D-AECCAE9FFBC2 |
| 76 | ON | 152 | 1269 | 90752554-930D-45E7-9810-60DAC546DFC9 |
| 77 | OFF | 153 | 1270 | 3C9D860D-4B64-48ED-8343-96B046CC218B |
| 77 | ON | 154 | 1271 | FCC4CF8A-F4BB-4597-88FE-C19ECE0BC32C |
| 78 | OFF | 155 | 1272 | 0C8D4AB9-183E-4ACE-B640-DD1081A69CD5 |
| 78 | ON | 156 | 1273 | 1E579CC1-79C8-49BA-AECD-39998B861921 |
| 79 | OFF | 157 | 1274 | C2D23867-6C02-41A8-BA5E-C7B7D2D143DF |
| 79 | ON | 158 | 1275 | A6B1DC91-B8D5-460E-8D62-0822A4EFE1AA |
| 80 | OFF | 159 | 1276 | 7DE80482-302D-49FF-B89A-CDF74BD50B4E |
| 80 | ON | 160 | 1278 | EB690B6E-0243-494D-9F81-D1C4D3EE8D47 |
| 81 | OFF | 161 | 1279 | 99FF1D72-62EF-4B2B-B0D5-B86540BB81F6 |
| 81 | ON | 162 | 1280 | A2491833-1292-4059-BAA7-BF220A466B0E |
| 82 | OFF | 163 | 1281 | 153D3A99-D349-4BD4-8269-D80D7002C9E4 |
| 82 | ON | 164 | 1282 | 4F5090A6-D55B-46AC-A7A8-AD6CD7349407 |
| 83 | OFF | 165 | 1283 | 16DA6423-06EA-4973-9EE8-AE78F92C69FF |
| 83 | ON | 166 | 1284 | 9072ADDB-9A59-480F-95EE-E7196D8022E9 |
| 84 | OFF | 167 | 1285 | 1FD9BE63-41BF-4B09-B891-AA4EDE223B4E |
| 84 | ON | 168 | 1286 | 012BA52A-C8DC-4CA6-AFC0-32DDE561E443 |
| 85 | OFF | 169 | 1288 | A8BCA5AE-96D1-422E-9AF1-ED2AF7F65C6F |
| 85 | ON | 170 | 1289 | 97B4EADD-98BC-475B-A172-B17A0F528C7D |
| 86 | OFF | 171 | 1290 | B1339ABD-FBDE-4350-B830-1BA1420BEBCD |
| 86 | ON | 172 | 1291 | 5AB4B0FB-8284-42E8-9030-5FC471635F11 |
| 87 | OFF | 173 | 1292 | B93B48D0-EAC5-4A09-97BD-9EC1AA7E3258 |
| 87 | ON | 174 | 1293 | 944D69BB-B21E-40FE-9A6C-0EEEBA116967 |
| 88 | OFF | 175 | 1294 | 3A053A0D-A5C5-4BA0-A006-4808A2E3B5BE |
| 88 | ON | 176 | 1295 | 70C0BD66-B26A-4626-968F-F038D86D5F02 |
| 89 | OFF | 177 | 1297 | 15790BF0-34DC-4053-B4A6-0CF3EB566449 |
| 89 | ON | 178 | 1298 | 446300B8-AE46-4476-A97F-26047174E853 |
| 90 | OFF | 179 | 1299 | 1BB44A6F-3243-421B-8F14-0C48DA582FD3 |
| 90 | ON | 180 | 1300 | 2FA249FB-7B07-43BE-8EF6-CB3B9957E2D8 |
| 91 | OFF | 181 | 1301 | CA102B24-0720-46A4-BBFC-2A395A994E4F |
| 91 | ON | 182 | 1302 | 3A8D05B8-641B-4162-AEC3-83C190B1E0A7 |
| 92 | OFF | 183 | 1303 | C68E06DA-1897-48A0-9923-8874DF65E9A8 |
| 92 | ON | 184 | 1304 | 1CC7C201-B572-4F69-81DB-35A9B353F4A4 |
| 93 | OFF | 185 | 1305 | 85BF6032-E18D-4D66-85CD-7353663C59E0 |
| 93 | ON | 186 | 1307 | EB01FFAD-ABFD-4C68-9FFD-ADC01DF4B8EE |
| 94 | OFF | 187 | 1308 | F3A592B9-A88B-4B7C-9993-538A950849F2 |
| 94 | ON | 188 | 1309 | A39863A1-F484-4BB3-B9D8-626BA2FC0368 |
| 95 | OFF | 189 | 1310 | 034297EB-45E4-4FBF-BA85-7E09F0581512 |
| 95 | ON | 190 | 1311 | E4B71E38-50A5-4F07-AD86-A017D27BC13D |
| 96 | OFF | 191 | 1312 | 3693BB40-173B-4113-B144-28DC852770C0 |
| 96 | ON | 192 | 1313 | 28CEF769-BC5E-43E5-BBB5-BCFF72F3D8E3 |
| 97 | OFF | 193 | 1314 | DDCB42BF-CDED-4E46-898D-1AC65F4F3064 |
| 97 | ON | 194 | 1315 | C2A0C1BE-85E9-4195-9BC7-BC60444DCC50 |
| 98 | OFF | 195 | 1317 | E7398B60-A9C8-445D-BF37-D8E7BE40E34F |
| 98 | ON | 196 | 1318 | F223F1F2-B43D-4BF7-839F-E918DB29B00D |
| 99 | OFF | 197 | 1319 | 54EEF059-F111-47E6-9CB2-4F5C313EB2DD |
| 99 | ON | 198 | 1320 | 8953BD9B-06D4-42A4-B74C-2B6FDA31FD9C |
| 100 | OFF | 199 | 1321 | 911E1299-6AFD-4F71-BA26-7483314FE381 |
| 100 | ON | 200 | 1322 | E4BA5681-A0C0-459B-9609-EF29446637BA |
