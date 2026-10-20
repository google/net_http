# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 400 | earlyPOST | h2 | true | 30.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 26.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 20.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | 400 | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | 200 | earlyPOST | h2 | true | 32.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | 400 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 48.000 | 38.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 26.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | earlyPOST | h2 | true | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 21.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 200 | earlyPOST | h2 | true | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 32.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 400 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 30.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 51 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 52 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 53 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 54 | ON | completed | 200 | earlyPOST | h2 | true | 37.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 55 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 56 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 57 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 58 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 59 | ON | completed | 400 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 60 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 61 | ON | timeout | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 62 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 63 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 64 | ON | completed | 200 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 65 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 66 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 67 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 68 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 69 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 70 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 71 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 72 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 73 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 74 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 75 | ON | completed | 400 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 76 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 77 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 78 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 79 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 80 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 81 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 82 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 83 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 84 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 85 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 86 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 87 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 88 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 89 | ON | completed | 200 | earlyPOST | h2 | true | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 90 | ON | completed | 400 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 91 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 92 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 93 | ON | completed | 200 | handshake | h2 | false | 27.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 94 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 95 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 96 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 98 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 99 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 100 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 101 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 102 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 103 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 104 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 105 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 106 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 107 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 108 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 109 | ON | completed | 400 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 110 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 111 | ON | completed | 200 | handshake | h2 | false | 32.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 112 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 113 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 114 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 115 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 116 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 117 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 118 | ON | completed | 200 | earlyPOST | h2 | true | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 119 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 120 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 121 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 122 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 123 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 124 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 125 | ON | completed | 400 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 126 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 127 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 127 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 128 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 128 | ON | completed | 400 | earlyPOST | h2 | true | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 129 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 129 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 130 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 130 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 131 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 131 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 132 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 132 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 133 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 133 | ON | completed | 400 | earlyPOST | h2 | true | 33.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 134 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 134 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 135 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 135 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 136 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 136 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 137 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 137 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 138 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 138 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 139 | OFF | completed | — | handshake | h2 | false | 35.000 | 27.000 | 2404:6800:400b:c017::451 |
| omnient | 139 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 140 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 140 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 141 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 141 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 142 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 142 | ON | completed | 400 | handshake | h2 | false | 55.000 | 43.000 | 2404:6800:400b:c017::451 |
| omnient | 143 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 143 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 144 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 144 | ON | completed | 400 | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 145 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 145 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 146 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 146 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 147 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 147 | ON | completed | 200 | earlyPOST | h2 | true | 75.000 | 53.000 | 2404:6800:400b:c017::451 |
| omnient | 148 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 148 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 149 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 149 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 150 | OFF | completed | — | handshake | h2 | false | 66.000 | 42.000 | 2404:6800:400b:c017::451 |
| omnient | 150 | ON | completed | 400 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 151 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 151 | ON | completed | 400 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 152 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 152 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 153 | OFF | completed | — | handshake | h2 | false | 36.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 153 | ON | completed | 200 | handshake | h2 | false | 24.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 154 | OFF | completed | — | handshake | h2 | false | 37.000 | 29.000 | 2404:6800:400b:c017::451 |
| omnient | 154 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 155 | OFF | completed | — | handshake | h2 | false | 29.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 155 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 156 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 156 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 157 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 157 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 158 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 158 | ON | completed | 400 | earlyPOST | h2 | true | 31.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 159 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 159 | ON | completed | 400 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 160 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 160 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 161 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 161 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 162 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 162 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 163 | OFF | completed | — | handshake | h2 | false | 42.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 163 | ON | completed | 400 | handshake | h2 | false | 58.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 164 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 164 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 165 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 165 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 166 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 166 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 167 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 167 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 168 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 168 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 169 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 169 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 170 | OFF | completed | — | handshake | h2 | false | 56.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 170 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 171 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 171 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 172 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 172 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 173 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 173 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 174 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 174 | ON | completed | 200 | earlyPOST | h2 | true | 62.000 | 31.000 | 2404:6800:400b:c019::451 |
| omnient | 175 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 175 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 176 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 176 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 177 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 177 | ON | completed | 200 | earlyPOST | h2 | true | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 178 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 178 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 179 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 179 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 180 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 180 | ON | completed | 400 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 181 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 181 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 182 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 182 | ON | completed | 400 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 183 | OFF | completed | — | handshake | h2 | false | 63.000 | 37.000 | 2404:6800:400b:c019::451 |
| omnient | 183 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 184 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 184 | ON | completed | 200 | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 185 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 185 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 186 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 186 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 187 | OFF | completed | — | handshake | h2 | false | 84.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 187 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 188 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 188 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 189 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 189 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 190 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 190 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 191 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 191 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 192 | OFF | completed | — | handshake | h2 | false | 31.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 192 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 193 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 193 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 194 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 194 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 195 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 195 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 196 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 196 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 197 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 197 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 198 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 198 | ON | completed | 400 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 199 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 199 | ON | completed | 400 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 200 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 200 | ON | completed | 400 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 201 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 201 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 202 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 202 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 203 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 203 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 204 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 204 | ON | completed | 400 | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 205 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 205 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 206 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 206 | ON | completed | 400 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 207 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 207 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 208 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 208 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 209 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 209 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 210 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 210 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 211 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 211 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 212 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 212 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 213 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 213 | ON | completed | 400 | handshake | h2 | false | 53.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 214 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 214 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 215 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 215 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 216 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 216 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 217 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 217 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 218 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 218 | ON | completed | 400 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 219 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 219 | ON | completed | 400 | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 220 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 220 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 221 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 221 | ON | completed | 400 | handshake | h2 | false | 47.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 222 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 222 | ON | completed | 400 | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 223 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 223 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 224 | OFF | completed | — | handshake | h2 | false | 60.000 | 46.000 | 2404:6800:400b:c019::451 |
| omnient | 224 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 225 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 225 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 226 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 226 | ON | timeout | 200 | earlyPOST | h2 | true | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 227 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 227 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 228 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 228 | ON | completed | 400 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 229 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 229 | ON | completed | 400 | handshake | h2 | false | 32.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 230 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 230 | ON | completed | 200 | earlyPOST | h2 | true | 57.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 231 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 231 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 232 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 232 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 233 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 233 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 234 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 234 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 235 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 235 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 236 | OFF | completed | — | handshake | h2 | false | 37.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 236 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 237 | OFF | completed | — | handshake | h2 | false | 54.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 237 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 238 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 238 | ON | timeout | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 239 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 239 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 240 | OFF | completed | — | handshake | h2 | false | 68.000 | 41.000 | 2404:6800:400b:c01b::451 |
| omnient | 240 | ON | completed | 400 | handshake | h2 | false | 51.000 | 22.000 | 2404:6800:400b:c01b::451 |
| omnient | 241 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 241 | ON | completed | 400 | handshake | h2 | false | 41.000 | 23.000 | 2404:6800:400b:c01b::451 |
| omnient | 242 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 242 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 243 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 243 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 244 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 244 | ON | completed | 200 | earlyPOST | h2 | true | 29.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 245 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 245 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 246 | OFF | completed | — | handshake | h2 | false | 37.000 | 20.000 | 2404:6800:400b:c01b::451 |
| omnient | 246 | ON | completed | 400 | earlyPOST | h2 | true | 55.000 | 29.000 | 2404:6800:400b:c01b::451 |
| omnient | 247 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c01b::451 |
| omnient | 247 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 248 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 248 | ON | completed | 400 | earlyPOST | h2 | true | 49.000 | 25.000 | 2404:6800:400b:c01b::451 |
| omnient | 249 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 249 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 250 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 250 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 251 | OFF | completed | — | handshake | h2 | false | 42.000 | 33.000 | 2404:6800:400b:c01b::451 |
| omnient | 251 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 252 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 252 | ON | completed | 200 | earlyPOST | h2 | true | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 253 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 253 | ON | completed | 200 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 254 | OFF | completed | — | handshake | h2 | false | 61.000 | 39.000 | 2404:6800:400b:c019::451 |
| omnient | 254 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 255 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 255 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 256 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 256 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 257 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 257 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 258 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 258 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 259 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 259 | ON | completed | 400 | earlyPOST | h2 | true | 70.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 260 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 260 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 261 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 261 | ON | completed | 400 | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 262 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 262 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 263 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 263 | ON | completed | 400 | handshake | h2 | false | 30.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 264 | OFF | completed | — | handshake | h2 | false | 60.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 264 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 265 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 265 | ON | completed | 200 | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 266 | OFF | completed | — | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 266 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 267 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 267 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 268 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 268 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 269 | OFF | completed | — | handshake | h2 | false | 34.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 269 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 270 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 270 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 271 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 271 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 272 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 272 | ON | completed | 400 | earlyPOST | h2 | true | 44.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 273 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 273 | ON | completed | 200 | handshake | h2 | false | 39.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 274 | OFF | completed | — | handshake | h2 | false | 69.000 | 51.000 | 2404:6800:400b:c019::451 |
| omnient | 274 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 275 | OFF | completed | — | handshake | h2 | false | 207.000 | 184.000 | 2404:6800:400b:c019::451 |
| omnient | 275 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 276 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 276 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 277 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 277 | ON | completed | 200 | earlyPOST | h2 | true | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 278 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 278 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 279 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 279 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 280 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 280 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 281 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 281 | ON | completed | 200 | handshake | h2 | false | 44.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 282 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 282 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 283 | OFF | completed | — | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 283 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 284 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 284 | ON | completed | 400 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 285 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 285 | ON | completed | 200 | earlyPOST | h2 | true | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 286 | OFF | completed | — | handshake | h2 | false | 51.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 286 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 287 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 287 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 288 | OFF | completed | — | handshake | h2 | false | 44.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 288 | ON | completed | 400 | earlyPOST | h2 | true | 35.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 289 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 289 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 290 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 290 | ON | completed | 400 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 291 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 291 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 292 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 292 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 293 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 293 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 294 | OFF | completed | — | handshake | h2 | false | 27.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 294 | ON | completed | 200 | handshake | h2 | false | 50.000 | 35.000 | 2404:6800:400b:c01b::451 |
| omnient | 295 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 295 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 296 | OFF | completed | — | handshake | h2 | false | 49.000 | 39.000 | 2404:6800:400b:c01b::451 |
| omnient | 296 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 297 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 297 | ON | completed | 400 | earlyPOST | h2 | true | 41.000 | 28.000 | 2404:6800:400b:c01b::451 |
| omnient | 298 | OFF | completed | — | handshake | h2 | false | 41.000 | 31.000 | 2404:6800:400b:c01b::451 |
| omnient | 298 | ON | completed | 400 | earlyPOST | h2 | true | 38.000 | 26.000 | 2404:6800:400b:c01b::451 |
| omnient | 299 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 299 | ON | completed | 200 | handshake | h2 | false | 82.000 | 44.000 | 2404:6800:400b:c01b::451 |
| omnient | 300 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 300 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 301 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 301 | ON | completed | 400 | handshake | h2 | false | 35.000 | 19.000 | 2404:6800:400b:c01b::451 |
| omnient | 302 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 302 | ON | completed | 400 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 303 | OFF | completed | — | handshake | h2 | false | 64.000 | 46.000 | 2404:6800:400b:c01b::451 |
| omnient | 303 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 304 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 304 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 305 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 305 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 306 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c01b::451 |
| omnient | 306 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 307 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 307 | ON | completed | 400 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 308 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 308 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 309 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 309 | ON | completed | 400 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c01b::451 |
| omnient | 310 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 310 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 311 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 311 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 312 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 312 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 313 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 313 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 314 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 314 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 315 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c01b::451 |
| omnient | 315 | ON | completed | 400 | earlyPOST | h2 | true | 45.000 | 35.000 | 2404:6800:400b:c01b::451 |
| omnient | 316 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 316 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 317 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 317 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 318 | OFF | completed | — | handshake | h2 | false | 50.000 | 40.000 | 2404:6800:400b:c01b::451 |
| omnient | 318 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 319 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 319 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 320 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c01b::451 |
| omnient | 320 | ON | completed | 200 | earlyPOST | h2 | true | 20.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 321 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 321 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 322 | OFF | completed | — | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c01b::451 |
| omnient | 322 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 323 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 323 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 324 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 324 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 325 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 325 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 326 | OFF | completed | — | handshake | h2 | false | 56.000 | 23.000 | 2404:6800:400b:c01b::451 |
| omnient | 326 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 327 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 327 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 328 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c01b::451 |
| omnient | 328 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 329 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 329 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 330 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 330 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 331 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 331 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 332 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 332 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 333 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 333 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 334 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 334 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 335 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 335 | ON | completed | 400 | earlyPOST | h2 | true | 30.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 336 | OFF | completed | — | handshake | h2 | false | 89.000 | 56.000 | 2404:6800:400b:c019::451 |
| omnient | 336 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 337 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 337 | ON | completed | 400 | earlyPOST | h2 | true | 88.000 | 75.000 | 2404:6800:400b:c019::451 |
| omnient | 338 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 338 | ON | completed | 400 | earlyPOST | h2 | true | 78.000 | 60.000 | 2404:6800:400b:c019::451 |
| omnient | 339 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 339 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 340 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 340 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 341 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 341 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 342 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 342 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 343 | OFF | completed | — | handshake | h2 | false | 36.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 343 | ON | completed | 400 | handshake | h2 | false | 56.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 344 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 344 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 345 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 345 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 346 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 346 | ON | completed | 400 | earlyPOST | h2 | true | 30.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 347 | OFF | completed | — | handshake | h2 | false | 34.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 347 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 348 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 348 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 349 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 349 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 350 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 350 | ON | completed | 400 | handshake | h2 | false | 67.000 | 33.000 | 2404:6800:400b:c019::451 |
| omnient | 351 | OFF | completed | — | handshake | h2 | false | 25.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 351 | ON | completed | 400 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 352 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 352 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 353 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 353 | ON | completed | 400 | earlyPOST | h2 | true | 36.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 354 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 354 | ON | completed | 200 | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 355 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 355 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 356 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 356 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 357 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 357 | ON | completed | 400 | earlyPOST | h2 | true | 70.000 | 63.000 | 2404:6800:400b:c019::451 |
| omnient | 358 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 358 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 359 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 359 | ON | completed | 200 | handshake | h2 | false | 57.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 360 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 360 | ON | completed | 200 | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 361 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 361 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 362 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 362 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 363 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 363 | ON | completed | 400 | handshake | h2 | false | 46.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 364 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 364 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 365 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 365 | ON | completed | 200 | handshake | h2 | false | 42.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 366 | OFF | completed | — | handshake | h2 | false | 59.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 366 | ON | completed | 400 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 367 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 367 | ON | completed | 200 | earlyPOST | h2 | true | 35.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 368 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 368 | ON | completed | 400 | handshake | h2 | false | 53.000 | 40.000 | 2404:6800:400b:c019::451 |
| omnient | 369 | OFF | completed | — | handshake | h2 | false | 38.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 369 | ON | completed | 400 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 370 | OFF | completed | — | handshake | h2 | false | 36.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 370 | ON | completed | 400 | earlyPOST | h2 | true | 43.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 371 | OFF | completed | — | handshake | h2 | false | 56.000 | 32.000 | 2404:6800:400b:c019::451 |
| omnient | 371 | ON | completed | 200 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 372 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 372 | ON | completed | 400 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 373 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 373 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 374 | OFF | completed | — | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 374 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 375 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 375 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 376 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 376 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 377 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 377 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 378 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 378 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 379 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 379 | ON | timeout | 200 | earlyPOST | h2 | true | 33.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 380 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 380 | ON | completed | 200 | earlyPOST | h2 | true | 35.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 381 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 381 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 382 | OFF | completed | — | handshake | h2 | false | 46.000 | 30.000 | 2404:6800:400b:c019::451 |
| omnient | 382 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 383 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 383 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 384 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 384 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 385 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 385 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 386 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 386 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 387 | OFF | completed | — | handshake | h2 | false | 35.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 387 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 388 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 388 | ON | completed | 400 | handshake | h2 | false | 54.000 | 42.000 | 2404:6800:400b:c019::451 |
| omnient | 389 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 389 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 390 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 390 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 391 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 391 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 392 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 392 | ON | completed | 400 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 393 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 393 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 394 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 394 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 395 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 395 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 396 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 396 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 397 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 397 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 398 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 398 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 399 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 399 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 400 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 400 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 401 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 401 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 402 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 402 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 403 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 403 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 404 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 404 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 405 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 405 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 406 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 406 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 407 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 407 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 408 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 408 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 409 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 409 | ON | completed | 200 | earlyPOST | h2 | true | 30.000 | 22.000 | 2404:6800:400b:c015::451 |
| omnient | 410 | OFF | completed | — | handshake | h2 | false | 114.000 | 52.000 | 2404:6800:400b:c015::451 |
| omnient | 410 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 411 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 411 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 412 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 412 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 413 | OFF | completed | — | handshake | h2 | false | 56.000 | 24.000 | 2404:6800:400b:c015::451 |
| omnient | 413 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 414 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 414 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 415 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 415 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 416 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 416 | ON | completed | 400 | handshake | h2 | false | 37.000 | 24.000 | 2404:6800:400b:c015::451 |
| omnient | 417 | OFF | completed | — | handshake | h2 | false | 42.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 417 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 418 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 418 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 419 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 419 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 420 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 420 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 421 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 421 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 422 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 422 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 423 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 423 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 424 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 424 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 425 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 425 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 426 | OFF | completed | — | handshake | h2 | false | 56.000 | 31.000 | 2404:6800:400b:c015::451 |
| omnient | 426 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 427 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 427 | ON | completed | 400 | earlyPOST | h2 | true | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 428 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 428 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 429 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 429 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 430 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 430 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 431 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 431 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 432 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 432 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 433 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 433 | ON | completed | 400 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 434 | OFF | completed | — | handshake | h2 | false | 35.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 434 | ON | completed | 200 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 435 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 435 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 436 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 436 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 437 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 437 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 438 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 438 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 439 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 439 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 440 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 440 | ON | completed | 400 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 441 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 441 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 442 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 442 | ON | completed | 400 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 443 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 443 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 444 | OFF | completed | — | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 444 | ON | completed | 200 | handshake | h2 | false | 95.000 | 74.000 | 2404:6800:400b:c015::451 |
| omnient | 445 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 445 | ON | completed | 200 | earlyPOST | h2 | true | 50.000 | 34.000 | 2404:6800:400b:c015::451 |
| omnient | 446 | OFF | completed | — | handshake | h2 | false | 42.000 | 32.000 | 2404:6800:400b:c015::451 |
| omnient | 446 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 447 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 447 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 448 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 448 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 449 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 449 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 450 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 450 | ON | completed | 400 | handshake | h2 | false | 41.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 451 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 451 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 452 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 452 | ON | completed | 400 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 453 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 453 | ON | completed | 200 | handshake | h2 | false | 41.000 | 27.000 | 2404:6800:400b:c015::451 |
| omnient | 454 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 454 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 455 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 455 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 456 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 456 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 457 | OFF | completed | — | handshake | h2 | false | 62.000 | 37.000 | 2404:6800:400b:c015::451 |
| omnient | 457 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 458 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 458 | ON | completed | 400 | handshake | h2 | false | 30.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 459 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 459 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 460 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 460 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 461 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 461 | ON | completed | 200 | handshake | h2 | false | 29.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 462 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 462 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 463 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 463 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 464 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 464 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 465 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 465 | ON | completed | 400 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 466 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 466 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 467 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 467 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 468 | OFF | completed | — | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 468 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 469 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 469 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 470 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 470 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 471 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 471 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 472 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 472 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 473 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 473 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 474 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 474 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 475 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 475 | ON | completed | 400 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 476 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 476 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 477 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 477 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 478 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 478 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 479 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 479 | ON | timeout | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 480 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 480 | ON | completed | 400 | earlyPOST | h2 | true | 29.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 481 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 481 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 482 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 482 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 483 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 483 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 484 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c01b::451 |
| omnient | 484 | ON | completed | 400 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 485 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 485 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 486 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 486 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 487 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 487 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 488 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 488 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 489 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 489 | ON | timeout | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 490 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 490 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 491 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 491 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 492 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 492 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 493 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 493 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 494 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 494 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 495 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 495 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 496 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 496 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 497 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 497 | ON | timeout | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 498 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 498 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 499 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 499 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 500 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 500 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 501 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 501 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 502 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 502 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 503 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 503 | ON | completed | 400 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 504 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 504 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 505 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 505 | ON | completed | 200 | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 506 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 506 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 507 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 507 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 508 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 508 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 509 | OFF | completed | — | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 509 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 510 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 510 | ON | completed | 400 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 511 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 511 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 512 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 512 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 513 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 513 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 514 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 514 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 515 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 515 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 516 | OFF | completed | — | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 516 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 517 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 517 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 518 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 518 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 519 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 519 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 520 | OFF | completed | — | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 520 | ON | completed | 400 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 521 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 521 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 522 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 522 | ON | completed | 200 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c017::451 |
| omnient | 523 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 523 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 524 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 524 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 525 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 525 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 526 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 526 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 527 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 527 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 528 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 528 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 529 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 529 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 530 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 530 | ON | completed | 400 | earlyPOST | h2 | true | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 531 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 531 | ON | completed | 400 | earlyPOST | h2 | true | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 532 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 532 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 533 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 533 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 534 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 534 | ON | completed | 400 | earlyPOST | h2 | true | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 535 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 535 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 536 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 536 | ON | completed | 200 | earlyPOST | h2 | true | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 537 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 537 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 538 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 538 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 539 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 539 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 540 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 540 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 541 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 541 | ON | completed | 400 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 542 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 542 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 543 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 543 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 544 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 544 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 545 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 545 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 546 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 546 | ON | completed | 400 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 547 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 547 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 548 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 548 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 549 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 549 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 550 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 550 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 551 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 551 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 552 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 552 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 553 | OFF | completed | — | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c019::451 |
| omnient | 553 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 554 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 554 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 555 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 555 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 556 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 556 | ON | completed | 200 | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 557 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 557 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 558 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 558 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 559 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 559 | ON | completed | 200 | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 560 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 560 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 561 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 561 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 562 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 562 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 563 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 563 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 564 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 564 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 565 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 565 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 566 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 566 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 567 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 567 | ON | completed | 400 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 568 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 568 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 569 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 569 | ON | completed | 400 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 570 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 570 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 571 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 571 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 572 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 572 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 573 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 573 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 574 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 574 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 575 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 575 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 576 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 576 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 577 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 577 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 578 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 578 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 579 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 579 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 580 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 580 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 581 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 581 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 582 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 582 | ON | completed | 400 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 583 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 583 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 584 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 584 | ON | completed | 200 | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 585 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 585 | ON | completed | 400 | earlyPOST | h2 | true | 31.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 586 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 586 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 587 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 587 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 588 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 588 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 589 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 589 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 590 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 590 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 591 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 591 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 592 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 592 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 593 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 593 | ON | completed | 400 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 594 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 594 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 595 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 595 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 596 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 596 | ON | completed | 400 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 597 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 597 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 598 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 598 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 599 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 599 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 600 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 600 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 601 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 601 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 602 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 602 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 603 | OFF | completed | — | handshake | h2 | false | 20.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 603 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 604 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 604 | ON | completed | 200 | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 605 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 605 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 606 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 606 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 607 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 607 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 608 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 608 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 609 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 609 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 610 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 610 | ON | completed | 400 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 611 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 611 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 612 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 612 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 613 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 613 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 614 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 614 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 615 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 615 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 616 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 616 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 617 | OFF | completed | — | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 617 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 618 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 618 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 619 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 619 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 620 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 620 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 621 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 621 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 622 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 622 | ON | timeout | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 623 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 623 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 624 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 624 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 625 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 625 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 0.974 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 0.269 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 0.272 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 101 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 101 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 102 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 102 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 103 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 103 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 104 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 104 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 105 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 105 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 106 | OFF | 0.265 | count=0 | post-open POST | post-open POST |
| omnient | 106 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 107 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 107 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 108 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 108 | ON | 0.265 | count=0 | early POST | early POST |
| omnient | 109 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 109 | ON | 0.265 | count=0 | early POST | early POST |
| omnient | 110 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 110 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 111 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 111 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 112 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 112 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 113 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 113 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 114 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 114 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 115 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 115 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 116 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 116 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 117 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 117 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 118 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 118 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 119 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 119 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 120 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 120 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 121 | OFF | 0.264 | count=0 | post-open POST | post-open POST |
| omnient | 121 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 122 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 122 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 123 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 123 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 124 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 124 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 125 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 125 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 126 | OFF | 0.808 | count=0 | post-open POST | post-open POST |
| omnient | 126 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 127 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 127 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 128 | OFF | 0.236 | count=0 | post-open POST | post-open POST |
| omnient | 128 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 129 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 129 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 130 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 130 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 131 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 131 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 132 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 132 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 133 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 133 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 134 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 134 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 135 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 135 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 136 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 136 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 137 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 137 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 138 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 138 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 139 | OFF | 0.239 | count=2 | handshake POST | handshake POST |
| omnient | 139 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 140 | OFF | 0.266 | count=0 | post-open POST | post-open POST |
| omnient | 140 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 141 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 141 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 142 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 142 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 143 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 143 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 144 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 144 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 145 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 145 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 146 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 146 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 147 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 147 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 148 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 148 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 149 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 149 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 150 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 150 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 151 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 151 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 152 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 152 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 153 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 153 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 154 | OFF | 0.266 | count=0 | post-open POST | post-open POST |
| omnient | 154 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 155 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 155 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 156 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 156 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 157 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 157 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 158 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 158 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 159 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 159 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 160 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 160 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 161 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 161 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 162 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 162 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 163 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 163 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 164 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 164 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 165 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 165 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 166 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 166 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 167 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 167 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 168 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 168 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 169 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 169 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 170 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 170 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 171 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 171 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 172 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 172 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 173 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 173 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 174 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 174 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 175 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 175 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 176 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 176 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 177 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 177 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 178 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 178 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 179 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 179 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 180 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 180 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 181 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 181 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 182 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 182 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 183 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 183 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 184 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 184 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 185 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 185 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 186 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 186 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 187 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 187 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 188 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 188 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 189 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 189 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 190 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 190 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 191 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 191 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 192 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 192 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 193 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 193 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 194 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 194 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 195 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 195 | ON | 0.270 | count=0 | early POST | early POST |
| omnient | 196 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 196 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 197 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 197 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 198 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 198 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 199 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 199 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 200 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 200 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 201 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 201 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 202 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 202 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 203 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 203 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 204 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 204 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 205 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 205 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 206 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 206 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 207 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 207 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 208 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 208 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 209 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 209 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 210 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 210 | ON | 0.235 | count=0 | early POST | early POST |
| omnient | 211 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 211 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 212 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 212 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 213 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 213 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 214 | OFF | 0.265 | count=0 | post-open POST | post-open POST |
| omnient | 214 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 215 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 215 | ON | 0.277 | count=0 | early POST | early POST |
| omnient | 216 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 216 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 217 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 217 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 218 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 218 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 219 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 219 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 220 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 220 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 221 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 221 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 222 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 222 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 223 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 223 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 224 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 224 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 225 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 225 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 226 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 226 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 227 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 227 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 228 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 228 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 229 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 229 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 230 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 230 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 231 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 231 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 232 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 232 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 233 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 233 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 234 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 234 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 235 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 235 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 236 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 236 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 237 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 237 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 238 | OFF | 0.268 | count=0 | post-open POST | post-open POST |
| omnient | 238 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 239 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 239 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 240 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 240 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 241 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 241 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 242 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 242 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 243 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 243 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 244 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 244 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 245 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 245 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 246 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 246 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 247 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 247 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 248 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 248 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 249 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 249 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 250 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 250 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 251 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 251 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 252 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 252 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 253 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 253 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 254 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 254 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 255 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 255 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 256 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 256 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 257 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 257 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 258 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 258 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 259 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 259 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 260 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 260 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 261 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 261 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 262 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 262 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 263 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 263 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 264 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 264 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 265 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 265 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 266 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 266 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 267 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 267 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 268 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 268 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 269 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 269 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 270 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 270 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 271 | OFF | 0.234 | count=0 | post-open POST | post-open POST |
| omnient | 271 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 272 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 272 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 273 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 273 | ON | 0.233 | count=0 | early POST | early POST |
| omnient | 274 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 274 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 275 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 275 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 276 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 276 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 277 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 277 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 278 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 278 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 279 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 279 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 280 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 280 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 281 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 281 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 282 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 282 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 283 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 283 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 284 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 284 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 285 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 285 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 286 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 286 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 287 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 287 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 288 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 288 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 289 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 289 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 290 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 290 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 291 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 291 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 292 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 292 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 293 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 293 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 294 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 294 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 295 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 295 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 296 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 296 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 297 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 297 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 298 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 298 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 299 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 299 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 300 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 300 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 301 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 301 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 302 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 302 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 303 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 303 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 304 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 304 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 305 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 305 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 306 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 306 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 307 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 307 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 308 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 308 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 309 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 309 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 310 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 310 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 311 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 311 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 312 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 312 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 313 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 313 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 314 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 314 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 315 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 315 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 316 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 316 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 317 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 317 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 318 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 318 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 319 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 319 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 320 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 320 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 321 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 321 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 322 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 322 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 323 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 323 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 324 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 324 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 325 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 325 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 326 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 326 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 327 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 327 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 328 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 328 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 329 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 329 | ON | 0.268 | count=0 | early POST | early POST |
| omnient | 330 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 330 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 331 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 331 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 332 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 332 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 333 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 333 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 334 | OFF | 0.262 | count=1 | handshake POST | post-open POST |
| omnient | 334 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 335 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 335 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 336 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 336 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 337 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 337 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 338 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 338 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 339 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 339 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 340 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 340 | ON | 0.277 | count=0 | early POST | early POST |
| omnient | 341 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 341 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 342 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 342 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 343 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 343 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 344 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 344 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 345 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 345 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 346 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 346 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 347 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 347 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 348 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 348 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 349 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 349 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 350 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 350 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 351 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 351 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 352 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 352 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 353 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 353 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 354 | OFF | 0.273 | count=0 | post-open POST | post-open POST |
| omnient | 354 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 355 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 355 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 356 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 356 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 357 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 357 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 358 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 358 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 359 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 359 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 360 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 360 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 361 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 361 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 362 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 362 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 363 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 363 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 364 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 364 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 365 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 365 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 366 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 366 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 367 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 367 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 368 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 368 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 369 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 369 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 370 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 370 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 371 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 371 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 372 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 372 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 373 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 373 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 374 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 374 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 375 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 375 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 376 | OFF | 0.851 | count=0 | post-open POST | post-open POST |
| omnient | 376 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 377 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 377 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 378 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 378 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 379 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 379 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 380 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 380 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 381 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 381 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 382 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 382 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 383 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 383 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 384 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 384 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 385 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 385 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 386 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 386 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 387 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 387 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 388 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 388 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 389 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 389 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 390 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 390 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 391 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 391 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 392 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 392 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 393 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 393 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 394 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 394 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 395 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 395 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 396 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 396 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 397 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 397 | ON | 0.270 | count=0 | early POST | early POST |
| omnient | 398 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 398 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 399 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 399 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 400 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 400 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 401 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 401 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 402 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 402 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 403 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 403 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 404 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 404 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 405 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 405 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 406 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 406 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 407 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 407 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 408 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 408 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 409 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 409 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 410 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 410 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 411 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 411 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 412 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 412 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 413 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 413 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 414 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 414 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 415 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 415 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 416 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 416 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 417 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 417 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 418 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 418 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 419 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 419 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 420 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 420 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 421 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 421 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 422 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 422 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 423 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 423 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 424 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 424 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 425 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 425 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 426 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 426 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 427 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 427 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 428 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 428 | ON | 0.294 | count=0 | early POST | early POST |
| omnient | 429 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 429 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 430 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 430 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 431 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 431 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 432 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 432 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 433 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 433 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 434 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 434 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 435 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 435 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 436 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 436 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 437 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 437 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 438 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 438 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 439 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 439 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 440 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 440 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 441 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 441 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 442 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 442 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 443 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 443 | ON | 0.313 | count=0 | early POST | early POST |
| omnient | 444 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 444 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 445 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 445 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 446 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 446 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 447 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 447 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 448 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 448 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 449 | OFF | 0.237 | count=0 | post-open POST | post-open POST |
| omnient | 449 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 450 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 450 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 451 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 451 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 452 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 452 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 453 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 453 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 454 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 454 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 455 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 455 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 456 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 456 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 457 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 457 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 458 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 458 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 459 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 459 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 460 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 460 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 461 | OFF | 0.266 | count=0 | post-open POST | post-open POST |
| omnient | 461 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 462 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 462 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 463 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 463 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 464 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 464 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 465 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 465 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 466 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 466 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 467 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 467 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 468 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 468 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 469 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 469 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 470 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 470 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 471 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 471 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 472 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 472 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 473 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 473 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 474 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 474 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 475 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 475 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 476 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 476 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 477 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 477 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 478 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 478 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 479 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 479 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 480 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 480 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 481 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 481 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 482 | OFF | 0.267 | count=0 | post-open POST | post-open POST |
| omnient | 482 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 483 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 483 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 484 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 484 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 485 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 485 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 486 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 486 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 487 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 487 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 488 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 488 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 489 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 489 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 490 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 490 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 491 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 491 | ON | 0.266 | count=0 | early POST | early POST |
| omnient | 492 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 492 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 493 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 493 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 494 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 494 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 495 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 495 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 496 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 496 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 497 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 497 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 498 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 498 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 499 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 499 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 500 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 500 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 501 | OFF | 1.047 | count=0 | post-open POST | post-open POST |
| omnient | 501 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 502 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 502 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 503 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 503 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 504 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 504 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 505 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 505 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 506 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 506 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 507 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 507 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 508 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 508 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 509 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 509 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 510 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 510 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 511 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 511 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 512 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 512 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 513 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 513 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 514 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 514 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 515 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 515 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 516 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 516 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 517 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 517 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 518 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 518 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 519 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 519 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 520 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 520 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 521 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 521 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 522 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 522 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 523 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 523 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 524 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 524 | ON | 0.267 | count=0 | early POST | early POST |
| omnient | 525 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 525 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 526 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 526 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 527 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 527 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 528 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 528 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 529 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 529 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 530 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 530 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 531 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 531 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 532 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 532 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 533 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 533 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 534 | OFF | 0.276 | count=0 | post-open POST | post-open POST |
| omnient | 534 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 535 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 535 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 536 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 536 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 537 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 537 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 538 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 538 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 539 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 539 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 540 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 540 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 541 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 541 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 542 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 542 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 543 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 543 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 544 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 544 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 545 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 545 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 546 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 546 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 547 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 547 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 548 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 548 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 549 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 549 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 550 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 550 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 551 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 551 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 552 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 552 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 553 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 553 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 554 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 554 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 555 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 555 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 556 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 556 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 557 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 557 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 558 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 558 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 559 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 559 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 560 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 560 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 561 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 561 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 562 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 562 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 563 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 563 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 564 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 564 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 565 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 565 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 566 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 566 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 567 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 567 | ON | 0.269 | count=0 | early POST | early POST |
| omnient | 568 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 568 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 569 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 569 | ON | 0.276 | count=0 | early POST | early POST |
| omnient | 570 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 570 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 571 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 571 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 572 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 572 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 573 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 573 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 574 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 574 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 575 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 575 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 576 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 576 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 577 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 577 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 578 | OFF | 0.266 | count=0 | post-open POST | post-open POST |
| omnient | 578 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 579 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 579 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 580 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 580 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 581 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 581 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 582 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 582 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 583 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 583 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 584 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 584 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 585 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 585 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 586 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 586 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 587 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 587 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 588 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 588 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 589 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 589 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 590 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 590 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 591 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 591 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 592 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 592 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 593 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 593 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 594 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 594 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 595 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 595 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 596 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 596 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 597 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 597 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 598 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 598 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 599 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 599 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 600 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 600 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 601 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 601 | ON | 0.272 | count=0 | early POST | early POST |
| omnient | 602 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 602 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 603 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 603 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 604 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 604 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 605 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 605 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 606 | OFF | 0.269 | count=0 | post-open POST | post-open POST |
| omnient | 606 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 607 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 607 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 608 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 608 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 609 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 609 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 610 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 610 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 611 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 611 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 612 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 612 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 613 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 613 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 614 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 614 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 615 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 615 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 616 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 616 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 617 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 617 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 618 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 618 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 619 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 619 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 620 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 620 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 621 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 621 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 622 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 622 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 623 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 623 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 624 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 624 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 625 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 625 | ON | 0.240 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 0 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 339/625 ON trials. Of those trials, 339 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 1, 5, 7, 9, 11, 12, 15, 16, 18, 20, 21, 22, 24, 25, 26, 30, 34, 35, 36, 40, 43, 44, 46, 47, 48, 49, 51, 52, 55, 56, 58, 59, 62, 67, 68, 70, 71, 74, 75, 79, 80, 81, 83, 84, 86, 87, 90, 91, 98, 100, 103, 104, 106, 107, 109, 110, 112, 114, 115, 119, 120, 121, 122, 123, 125, 128, 133, 135, 137, 139, 140, 141, 142, 143, 144, 149, 150, 151, 154, 157, 158, 159, 161, 162, 163, 164, 165, 166, 168, 169, 171, 172, 173, 176, 178, 180, 182, 186, 187, 190, 192, 193, 194, 195, 198, 199, 200, 201, 203, 204, 205, 206, 207, 208, 209, 210, 211, 213, 214, 217, 218, 219, 220, 221, 222, 227, 228, 229, 231, 232, 234, 235, 240, 241, 246, 247, 248, 251, 254, 255, 256, 257, 258, 259, 260, 261, 263, 270, 272, 278, 282, 284, 287, 288, 289, 290, 291, 293, 295, 296, 297, 298, 301, 302, 303, 306, 307, 309, 311, 314, 315, 317, 321, 324, 326, 327, 328, 329, 333, 334, 335, 336, 337, 338, 343, 345, 346, 347, 348, 350, 351, 353, 355, 357, 358, 362, 363, 366, 368, 369, 370, 372, 374, 375, 377, 378, 386, 387, 388, 390, 391, 392, 393, 395, 396, 398, 401, 404, 405, 407, 408, 410, 411, 412, 414, 416, 418, 419, 422, 423, 425, 426, 427, 433, 437, 438, 439, 440, 442, 447, 450, 452, 455, 458, 459, 462, 463, 465, 466, 468, 469, 470, 472, 474, 475, 476, 477, 480, 481, 483, 484, 486, 490, 491, 492, 495, 498, 499, 500, 502, 503, 506, 507, 509, 510, 512, 513, 514, 515, 520, 525, 526, 527, 528, 529, 530, 531, 532, 534, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 551, 553, 555, 561, 562, 563, 564, 565, 567, 568, 569, 578, 580, 581, 582, 585, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 598, 599, 603, 606, 610, 611, 612, 614, 615, 616, 623. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 61 ON; omnient pair 226 ON; omnient pair 238 ON; omnient pair 379 ON; omnient pair 479 ON; omnient pair 489 ON; omnient pair 497 ON; omnient pair 622 ON.

