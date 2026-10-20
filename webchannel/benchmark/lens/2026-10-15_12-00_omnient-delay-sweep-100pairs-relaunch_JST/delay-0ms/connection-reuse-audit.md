# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 1 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 2 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 3 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 5 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 6 | ON | completed | 400 | handshake | h2 | false | 22.000 | 12.000 | 2404:6800:400b:c01b::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 7 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 8 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 9 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 11 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 29.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 12 | ON | completed | 400 | earlyPOST | h2 | true | 33.000 | 23.000 | 2404:6800:400b:c01b::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 13 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 14 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 15 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 16 | ON | completed | 200 | earlyPOST | h2 | true | 29.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 17 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 18 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 19 | ON | completed | 400 | earlyPOST | h2 | true | 195.000 | 184.000 | 2404:6800:400b:c01b::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 20 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 21 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 22 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 23 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 24 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 36.000 | 26.000 | 2404:6800:400b:c01b::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c01b::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 26 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 27 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 24.000 | 2404:6800:400b:c01b::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 29 | ON | completed | 400 | handshake | h2 | false | 36.000 | 20.000 | 2404:6800:400b:c01b::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 30 | ON | completed | 400 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c01b::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 31 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 32 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 33 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 34 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c01b::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 41 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c01b::451 |
| omnient | 43 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 44 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 45 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c01b::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 47 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 48 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 49 | ON | completed | 400 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 51 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 51 | ON | completed | 200 | earlyPOST | h2 | true | 20.000 | 12.000 | 2404:6800:400b:c01b::451 |
| omnient | 52 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 52 | ON | completed | 400 | earlyPOST | h2 | true | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 53 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 53 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 54 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 54 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 55 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 55 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 56 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 56 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 57 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 57 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 58 | OFF | completed | — | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c01b::451 |
| omnient | 58 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 59 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 59 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 60 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 60 | ON | completed | 400 | handshake | h2 | false | 32.000 | 23.000 | 2404:6800:400b:c01b::451 |
| omnient | 61 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 61 | ON | completed | 200 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 62 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 62 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 63 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 63 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 64 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 64 | ON | completed | 200 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 65 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 65 | ON | completed | 400 | earlyPOST | h2 | true | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 66 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 66 | ON | completed | 400 | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c01b::451 |
| omnient | 67 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 67 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 68 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 68 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 69 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 69 | ON | timeout | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 70 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 70 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 71 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 71 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 72 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 72 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 73 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 73 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 74 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 74 | ON | completed | 400 | handshake | h2 | false | 25.000 | 18.000 | 2404:6800:400b:c01b::451 |
| omnient | 75 | OFF | completed | — | handshake | h2 | false | 39.000 | 29.000 | 2404:6800:400b:c01b::451 |
| omnient | 75 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 76 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 76 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 77 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 77 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 78 | OFF | completed | — | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 78 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 79 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 79 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 80 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 80 | ON | completed | 200 | earlyPOST | h2 | true | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 81 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 81 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 82 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 82 | ON | completed | 400 | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 83 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 83 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 84 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 84 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 85 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 85 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 86 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c01b::451 |
| omnient | 86 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 87 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 87 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 88 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 88 | ON | completed | 200 | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c01b::451 |
| omnient | 89 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 89 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 90 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 90 | ON | completed | 400 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 91 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 91 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 92 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 92 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 93 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 93 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 94 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 94 | ON | completed | 400 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 95 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 95 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 96 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 96 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 97 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 97 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 98 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 98 | ON | completed | 400 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 99 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 99 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 100 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 100 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 1.313 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 0.245 | count=2 | handshake POST | handshake POST |
| omnient | 16 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 0.270 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 0.266 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 0.270 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 0.278 | count=0 | early POST | early POST |
| omnient | 51 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 51 | ON | 0.268 | count=0 | early POST | early POST |
| omnient | 52 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 52 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 53 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 53 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 54 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 54 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 55 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 55 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 56 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 56 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 57 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 57 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 58 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 58 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 59 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 59 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 60 | OFF | 0.257 | count=0 | post-open POST | post-open POST |
| omnient | 60 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 61 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 61 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 62 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 62 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 63 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 63 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 64 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 64 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 65 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 65 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 66 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 66 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 67 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 67 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 68 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 68 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 69 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 69 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 70 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 70 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 71 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 71 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 72 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 72 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 73 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 73 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 74 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 74 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 75 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 75 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 76 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 76 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 77 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 77 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 78 | OFF | 0.235 | count=0 | post-open POST | post-open POST |
| omnient | 78 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 79 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 79 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 80 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 80 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 81 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 81 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 82 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 82 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 83 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 83 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 84 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 84 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 85 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 85 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 86 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 86 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 87 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 87 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 88 | OFF | 0.270 | count=0 | post-open POST | post-open POST |
| omnient | 88 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 89 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 89 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 90 | OFF | 0.239 | count=0 | post-open POST | post-open POST |
| omnient | 90 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 91 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 91 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 92 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 92 | ON | 0.271 | count=0 | early POST | early POST |
| omnient | 93 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 93 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 94 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 94 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 95 | OFF | 0.269 | count=0 | post-open POST | post-open POST |
| omnient | 95 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 96 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 96 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 97 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 97 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 98 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 98 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 99 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 99 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 100 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 100 | ON | 0.244 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 0 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 59/100 ON trials. Of those trials, 59 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 19, 21, 23, 26, 27, 29, 30, 31, 32, 33, 34, 41, 43, 44, 45, 47, 48, 49, 52, 53, 55, 57, 60, 62, 65, 66, 68, 70, 73, 74, 78, 79, 82, 83, 84, 85, 87, 90, 91, 92, 93, 94, 96, 98, 100. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 69 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 35021 | 69DDBEB0-3BB5-4793-BADF-51CC4FC4DCA4 |
| 1 | ON | 2 | 35022 | A0AE10A6-1C51-4A6B-921B-81051220D42E |
| 2 | OFF | 3 | 35023 | CF511531-0F41-4407-938B-1A32E53F62DC |
| 2 | ON | 4 | 35024 | 3302B659-7AB6-4AFD-80D1-16CB3A4D0620 |
| 3 | OFF | 5 | 35025 | D16B0CF2-2B0B-4274-9D8B-74C3F3855511 |
| 3 | ON | 6 | 35027 | 865AAB54-53B9-4F50-9C3C-D65A78C37172 |
| 4 | OFF | 7 | 35028 | 9276B553-8F85-42C2-998C-9C1351F6D508 |
| 4 | ON | 8 | 35029 | 0703648A-F424-4F8C-9DA9-996A03B3384E |
| 5 | OFF | 9 | 35030 | CB7394CB-C823-441D-BF62-C2603FA19E2E |
| 5 | ON | 10 | 35031 | DABACB4B-6669-4A02-A231-A71346D9B2DE |
| 6 | OFF | 11 | 35032 | CC0D9299-0692-4725-A56C-D6194824B9DC |
| 6 | ON | 12 | 35033 | B391ADE0-B6DB-476F-A765-BF53C86DB362 |
| 7 | OFF | 13 | 35034 | 3346AFB7-7CB0-469F-B0A7-73B68925152D |
| 7 | ON | 14 | 35035 | 3EE66D33-77B6-413B-8AB2-BB665AAF70E6 |
| 8 | OFF | 15 | 35037 | FB263B77-F432-4647-BE3B-B0D4F88E4D85 |
| 8 | ON | 16 | 35038 | FCCC27D3-E8B7-4DA0-8F52-1A673CD43A8A |
| 9 | OFF | 17 | 35039 | F3205D11-B442-4E08-A928-7DDE0C1F21A4 |
| 9 | ON | 18 | 35040 | 51952002-897F-4D25-B23F-4B7BB646234A |
| 10 | OFF | 19 | 35041 | B079D54D-6C93-481A-9F58-E7AEEE6700E0 |
| 10 | ON | 20 | 35042 | 3EB756EF-B3A4-4BD0-A191-55540829989F |
| 11 | OFF | 21 | 35044 | D878248A-908B-42FE-A31F-E54607A229D5 |
| 11 | ON | 22 | 35045 | 6006D7DD-2D9F-4EB7-A28E-641BE4C9F390 |
| 12 | OFF | 23 | 35046 | BF23834B-346D-4FAA-9F66-BDCCB4D039AD |
| 12 | ON | 24 | 35048 | 9892BCC1-C98D-43BA-BD8A-ECB99DB4342C |
| 13 | OFF | 25 | 35049 | E0822D2F-5439-4F68-A5AF-7BD345333328 |
| 13 | ON | 26 | 35050 | 139B0E58-66C6-4B76-B9C8-B728FDF891FE |
| 14 | OFF | 27 | 35051 | 5B1EE9F5-D314-4354-9977-5448D9CA905F |
| 14 | ON | 28 | 35052 | E67AD668-DB7F-4A21-828D-29AEF7CF5ADA |
| 15 | OFF | 29 | 35053 | 86F8AE8D-F6AD-49ED-A62C-94FA244EEC8C |
| 15 | ON | 30 | 35054 | 7706E7A4-653D-452F-81C5-5A63C74E5308 |
| 16 | OFF | 31 | 35055 | ED83FD80-B452-48B8-BA8D-C78E8D1A84BD |
| 16 | ON | 32 | 35057 | 0A1A1119-C67D-4739-B5B5-811221EA76CD |
| 17 | OFF | 33 | 35058 | 79485165-B230-449B-A982-E9AF49AA1F17 |
| 17 | ON | 34 | 35059 | D2047CA1-1D1C-4F29-B6E0-1B8C081A9974 |
| 18 | OFF | 35 | 35060 | B0DC4FC2-703D-4993-8B53-5579281510BB |
| 18 | ON | 36 | 35061 | 9A4E5385-2E5D-47DD-BDB7-D6B81817C8E2 |
| 19 | OFF | 37 | 35062 | CC606C92-82A0-45E9-9A71-535E0A209EB6 |
| 19 | ON | 38 | 35063 | 2F038245-1DFE-4E9A-9000-D408CD5F8A8B |
| 20 | OFF | 39 | 35064 | B81299E2-AF3D-44D3-87DD-7F5389774BB1 |
| 20 | ON | 40 | 35065 | 05F6DEE0-2796-4F57-968C-AC2C20A130A3 |
| 21 | OFF | 41 | 35067 | AEB56768-B2CD-4E11-BCDD-11BC7D2435E3 |
| 21 | ON | 42 | 35068 | 27D433A8-3B3F-4812-AAB0-D0BD58B80F6D |
| 22 | OFF | 43 | 35069 | 07E7F0BF-E8D5-45AE-818D-43F7AF43A3B3 |
| 22 | ON | 44 | 35070 | 754FC470-F2DF-4B10-AFCD-144D1191337F |
| 23 | OFF | 45 | 35071 | ED5350E3-626B-4E60-9EB9-A48095E808BD |
| 23 | ON | 46 | 35072 | 86A110AB-53F9-4495-9F77-E4CEB1EBF777 |
| 24 | OFF | 47 | 35073 | 2708863E-C87B-4C1F-A084-507A18438FB3 |
| 24 | ON | 48 | 35074 | E53159E6-91C3-4DE9-A913-B6DCB8E5727C |
| 25 | OFF | 49 | 35075 | 84AD377B-D0F9-49C3-82C9-8C538BF7CB5A |
| 25 | ON | 50 | 35077 | 6F913222-6926-43D2-A3C0-138DD5CD2323 |
| 26 | OFF | 51 | 35078 | 876B2ED8-283A-4A52-939E-CBE71D427DF1 |
| 26 | ON | 52 | 35079 | D82E5A65-8423-434B-A365-6CCE22FEB456 |
| 27 | OFF | 53 | 35080 | 8A2E746D-D33F-4AFB-98CB-3C5743E45F62 |
| 27 | ON | 54 | 35081 | 4DB65670-B7B9-452C-86A9-7405C1A91BE9 |
| 28 | OFF | 55 | 35082 | F5306D8C-E7D6-4D03-998D-0BDEB1654013 |
| 28 | ON | 56 | 35083 | 9839C917-C119-4D22-88EE-561CF3500D30 |
| 29 | OFF | 57 | 35084 | CBF7D5FF-3639-43DB-A129-E5036015A629 |
| 29 | ON | 58 | 35085 | 389D12EB-F32D-4786-914C-5BE4338B0C96 |
| 30 | OFF | 59 | 35087 | 16B63EC7-81C1-4EB8-8424-77593BD25F06 |
| 30 | ON | 60 | 35088 | D644CFF8-F548-416A-8181-19D43F6FF941 |
| 31 | OFF | 61 | 35089 | 2CADC8BB-3515-4BF0-9ABF-FCC0F237FAFE |
| 31 | ON | 62 | 35090 | 0F52644C-4140-42F9-9589-0E24A79BEE41 |
| 32 | OFF | 63 | 35091 | 7B06CB09-351D-4939-9C74-D07497085530 |
| 32 | ON | 64 | 35092 | F8B30357-1BCB-46D4-9F69-A96FAD501082 |
| 33 | OFF | 65 | 35093 | E28B1BA7-7C02-4AA8-999C-60E134259FF2 |
| 33 | ON | 66 | 35094 | 847E7C78-0D95-4C9F-B994-CEC9FC92BF6E |
| 34 | OFF | 67 | 35096 | B1ECA48E-52CF-4AF3-85DD-71E23354FC8D |
| 34 | ON | 68 | 35097 | E08ABC2A-EC3B-4835-88CD-2F71A4EBD55F |
| 35 | OFF | 69 | 35098 | 9269916E-D235-4A4B-8046-7D5BDA95D2A7 |
| 35 | ON | 70 | 35099 | E962A187-C85E-4E79-BBA4-7458EEA5E94D |
| 36 | OFF | 71 | 35100 | A65A20F2-0328-4F19-A503-FF1856AC90B3 |
| 36 | ON | 72 | 35101 | 409885C5-857A-4CD7-9C37-A85483A485A8 |
| 37 | OFF | 73 | 35102 | B1B603A8-68FF-46B4-A77C-B34F3EE8454A |
| 37 | ON | 74 | 35103 | 8E32AFC6-4443-4E7F-80E8-C224B4A4C1CC |
| 38 | OFF | 75 | 35104 | 79B3DE92-D37B-4786-BF09-B034D23BF843 |
| 38 | ON | 76 | 35106 | 0897C32F-CE69-4B3E-9419-C8979D108628 |
| 39 | OFF | 77 | 35107 | 72535556-1488-4813-AF5A-B19883EB7FD9 |
| 39 | ON | 78 | 35108 | 9FF36B0C-3293-453E-B46D-3D54806D4D63 |
| 40 | OFF | 79 | 35109 | 363CCD3C-82E4-446A-AE52-7A55D0873370 |
| 40 | ON | 80 | 35110 | 4C1E1FFB-7DCB-4232-AB64-DBB57A8C00CA |
| 41 | OFF | 81 | 35111 | 97DE0DE0-F5F3-4A3C-9351-D6A7999FF71F |
| 41 | ON | 82 | 35112 | 789F7CD2-3A8E-43E6-9170-41F16D429EB3 |
| 42 | OFF | 83 | 35113 | CF01A6DA-BE7C-4DB7-A736-E3F9726D8AEE |
| 42 | ON | 84 | 35114 | 5601632D-0F9F-4AB9-A04C-9CD939B0EF5E |
| 43 | OFF | 85 | 35116 | 1E3C23CE-FA79-48AF-8E86-4F908433F10E |
| 43 | ON | 86 | 35117 | D935B0B5-CE9D-4114-B370-27F5A2B12EEF |
| 44 | OFF | 87 | 35118 | 6653906F-E900-4017-9F21-5478D42E570F |
| 44 | ON | 88 | 35119 | C8FA6D45-073E-496F-B872-7BBBC9B3187A |
| 45 | OFF | 89 | 35120 | E2F0E3E6-DD81-4A6B-B0B8-6C861B85089A |
| 45 | ON | 90 | 35121 | E601E625-FE84-484F-B04E-07856BA507BF |
| 46 | OFF | 91 | 35122 | BD7304E1-0866-4F59-8824-E8A809E0AF2E |
| 46 | ON | 92 | 35123 | 16BDA980-79F9-4EF9-804E-1A4B74F70215 |
| 47 | OFF | 93 | 35124 | DCA74CF3-9201-4A6E-B179-B1487E94851A |
| 47 | ON | 94 | 35126 | A18A6862-773A-4C56-950C-FCA55D1DE37D |
| 48 | OFF | 95 | 35127 | C7691E9D-B80B-40D0-BCB7-931135BEF14F |
| 48 | ON | 96 | 35128 | 7E140710-90FA-4238-B19B-6907A9157D1B |
| 49 | OFF | 97 | 35129 | F2DBB076-B9BD-4408-A1F2-713A201CAD55 |
| 49 | ON | 98 | 35130 | 6E96D534-BB29-491D-8A8D-A95BE6E0EA87 |
| 50 | OFF | 99 | 35131 | CB0F6E85-C7C3-4335-80BE-1ABDDF7DD067 |
| 50 | ON | 100 | 35132 | F77EC75A-2A36-44AA-A531-B0A14FEE1D93 |
| 51 | OFF | 101 | 35133 | AE92C525-1DDB-40D7-9CE3-A54C185CFD94 |
| 51 | ON | 102 | 35134 | 1FCFCF24-1BA7-4452-A8AE-17B7B708D183 |
| 52 | OFF | 103 | 35136 | 70BDD3D9-847F-46D8-A3A9-A09F79C19E29 |
| 52 | ON | 104 | 35137 | ADDE9F82-B1BC-4CF0-9978-65D0144DB895 |
| 53 | OFF | 105 | 35138 | 7C57BFAC-3048-4C97-9324-FFE909E8FDC5 |
| 53 | ON | 106 | 35139 | 484E8FE5-01D0-4246-913F-85F7605AF621 |
| 54 | OFF | 107 | 35140 | B039EE9F-6981-44A4-B6A7-EE51752601BE |
| 54 | ON | 108 | 35141 | F4C2C94A-837D-46F5-891F-539A851A2F56 |
| 55 | OFF | 109 | 35142 | 690D9519-6224-4147-87FF-4F570529EDB5 |
| 55 | ON | 110 | 35143 | 1350DE8F-E137-4884-9C6D-B86C6BAC4CDE |
| 56 | OFF | 111 | 35144 | 5C46A085-D2E7-4D24-A15D-7345E7FC5BB5 |
| 56 | ON | 112 | 35146 | 405B201B-5B79-46A7-A49C-AFDCEDC717E1 |
| 57 | OFF | 113 | 35147 | F1434C81-47E7-405D-A428-1D2AEA64D45E |
| 57 | ON | 114 | 35148 | C3BE1633-82DB-4213-A93C-52BD019C1392 |
| 58 | OFF | 115 | 35149 | EB6048F8-77A9-4294-B373-49C2712C1A10 |
| 58 | ON | 116 | 35150 | DE42DA8E-FA6E-4D4A-988D-AF66BBCFEA08 |
| 59 | OFF | 117 | 35151 | 7584D739-187A-46DC-AB9B-2AAAC16C0C25 |
| 59 | ON | 118 | 35152 | 91808B1E-1451-45E7-A719-1D34451C2A13 |
| 60 | OFF | 119 | 35153 | D607DE54-3276-4946-A278-0007C0A15508 |
| 60 | ON | 120 | 35154 | C83E8733-FD84-48D3-8243-FDB1D25A5246 |
| 61 | OFF | 121 | 35156 | 3161F669-D1C5-4FE8-A67B-3A95C7BD1898 |
| 61 | ON | 122 | 35157 | 99348B0D-3277-4050-ABA4-B240C6DE45F4 |
| 62 | OFF | 123 | 35158 | 243F379A-8FFE-4C3B-856A-28204A89F0EE |
| 62 | ON | 124 | 35159 | 5902EA1F-AF82-431D-9440-24CD93412ADB |
| 63 | OFF | 125 | 35160 | 7BC2932D-2CC7-47B0-A2B0-EFE13FFA718E |
| 63 | ON | 126 | 35161 | FAB43E66-0DA5-4582-AD4E-A0DBF723FA24 |
| 64 | OFF | 127 | 35162 | 75BF6A4C-3875-4A80-A53F-5CDAA2C5226F |
| 64 | ON | 128 | 35163 | 870276FF-716F-4CDB-B206-DF5D7365CA41 |
| 65 | OFF | 129 | 35164 | 616CC465-5302-4009-B86F-E81B952A12E7 |
| 65 | ON | 130 | 35166 | 8742490A-9AA0-4116-93BC-F6A224402661 |
| 66 | OFF | 131 | 35167 | E28CACB0-881F-47A4-9B0D-FC61A229DD60 |
| 66 | ON | 132 | 35168 | F5229E93-6ACC-415A-9EC9-BC2E95ACA707 |
| 67 | OFF | 133 | 35169 | 005F5AA2-834D-4ECA-9100-A0A2280462A2 |
| 67 | ON | 134 | 35170 | 174ACD59-044E-48F5-9CD0-C5B2EB23C332 |
| 68 | OFF | 135 | 35171 | 1F48995E-E98A-4A41-B3F0-C05733FB6C61 |
| 68 | ON | 136 | 35172 | CB963A43-D4C8-4EC7-BA52-29E05F4BD7A5 |
| 69 | OFF | 137 | 35173 | 12B74858-CFEA-48BE-844D-D952E4F6607A |
| 69 | ON | 138 | 35175 | 85698E1A-E67C-4FD3-AFD7-2805C213D859 |
| 70 | OFF | 139 | 35184 | B6FD5FE7-7A79-40D7-807E-A415BEB76414 |
| 70 | ON | 140 | 35185 | 07686961-C11C-4A5A-B10C-0A613248BB1F |
| 71 | OFF | 141 | 35186 | BC2206AB-1A2E-4EEE-9B6C-6575982F6BFA |
| 71 | ON | 142 | 35187 | 4CCB1A62-20F7-4E37-9768-C3D6146F4EA2 |
| 72 | OFF | 143 | 35188 | 13A51389-24F4-45BA-BEFF-7B810F2365B2 |
| 72 | ON | 144 | 35189 | D929307D-BA9C-4ACC-90F0-543DA85E066A |
| 73 | OFF | 145 | 35190 | F727CA62-9539-4A9E-8C9D-56FA456B2BB1 |
| 73 | ON | 146 | 35191 | 2C6E7C57-043D-441F-B83F-0A5EB6B3F189 |
| 74 | OFF | 147 | 35192 | 85BD2210-5B06-47A7-BF6A-ECF1F2CF24E3 |
| 74 | ON | 148 | 35194 | AE62E5FC-F7DD-485D-8A24-B22C8B24675D |
| 75 | OFF | 149 | 35195 | FDFDF815-8C08-4225-AD99-39973FD28778 |
| 75 | ON | 150 | 35196 | 75DCA121-ABED-4782-98DC-E81A76ECD27E |
| 76 | OFF | 151 | 35197 | C3447A5E-5331-4361-A1C5-30DB35B6FA5F |
| 76 | ON | 152 | 35198 | C3A53EC7-3CFE-426B-A01E-030C5CBB1C52 |
| 77 | OFF | 153 | 35199 | B4BDFB2D-BBD8-43AD-AC6F-B13E77B22CAD |
| 77 | ON | 154 | 35200 | E22925D2-2A47-4FCA-B108-7886378A2B8F |
| 78 | OFF | 155 | 35202 | 1ADB0801-7B2B-44F1-9347-4C39AA75114C |
| 78 | ON | 156 | 35203 | 64E7F9C0-B190-45A9-9F12-BE0D66EE6D06 |
| 79 | OFF | 157 | 35204 | 1C829DFA-BD0B-40F6-800E-54BC6A722EB9 |
| 79 | ON | 158 | 35205 | 62121252-3AE9-4DAD-B4A1-59595006DE0E |
| 80 | OFF | 159 | 35206 | 090ACF43-9365-4777-899B-AC2F2F5DED50 |
| 80 | ON | 160 | 35207 | 15362CCC-FE6D-4AD7-B1C6-B28C58AE9063 |
| 81 | OFF | 161 | 35208 | 2D14ED33-5827-4344-9E83-D566B0940C77 |
| 81 | ON | 162 | 35209 | 75216B89-B6A7-4BFF-87D5-F3B696C43405 |
| 82 | OFF | 163 | 35210 | 98313D80-EDE2-46D3-A234-1167A361ECDC |
| 82 | ON | 164 | 35212 | 475B3A5D-0AEC-4145-B402-E2FCE80106CA |
| 83 | OFF | 165 | 35213 | 5C96FFA1-97A7-45A1-90C7-198A7394A83D |
| 83 | ON | 166 | 35214 | 936084E6-562F-40E0-9232-652BC55DE29C |
| 84 | OFF | 167 | 35215 | 73612DA0-AD99-4D63-873B-897FB7783488 |
| 84 | ON | 168 | 35216 | FFE4488F-4703-405E-8941-7052FD47A90C |
| 85 | OFF | 169 | 35217 | C812CA58-459C-4F25-A031-D49382586A34 |
| 85 | ON | 170 | 35218 | 493D82B5-4C1B-454A-AA26-A5E54EA04800 |
| 86 | OFF | 171 | 35219 | 795738A5-49EB-4CDD-BD79-8B5E4866A646 |
| 86 | ON | 172 | 35220 | 21B7B968-4252-4B17-AA2D-C481E35E38EA |
| 87 | OFF | 173 | 35222 | 79F2C635-4796-4109-8214-22DE170D1DCC |
| 87 | ON | 174 | 35223 | 77DC2A11-386A-4FDC-8707-EBA6D2FA0A13 |
| 88 | OFF | 175 | 35224 | FDD1DC38-2DE0-43CE-B500-B10FCC81910B |
| 88 | ON | 176 | 35225 | 0F740909-7512-49E5-A9D2-9E845C036E7F |
| 89 | OFF | 177 | 35226 | 1AF2E2AB-92D5-4155-8EC2-CD443C06434E |
| 89 | ON | 178 | 35227 | 073E3547-7402-459C-AA0F-470025091B64 |
| 90 | OFF | 179 | 35228 | 06AEB66B-FADE-46DA-B08F-476DFC28AE81 |
| 90 | ON | 180 | 35229 | 9D249ED5-C05D-4EF0-987F-8B71D36D7FA8 |
| 91 | OFF | 181 | 35231 | D5ECE6A7-0543-4095-975C-5D334375112F |
| 91 | ON | 182 | 35232 | 1BCA140C-2A47-4AC3-82DE-DC6CC90FBF80 |
| 92 | OFF | 183 | 35233 | C6C977DB-92D9-4658-B6FE-0445524E33B2 |
| 92 | ON | 184 | 35234 | 6F2E820A-6830-4586-8AE3-C7F391C3CB42 |
| 93 | OFF | 185 | 35235 | F29A5E41-233E-40A5-894E-8E681A5D5DC5 |
| 93 | ON | 186 | 35236 | 8F5EBFB6-DD5A-4A79-8E51-09CADDCC5A39 |
| 94 | OFF | 187 | 35237 | 6919F8F6-BAC4-42DA-9DCC-4AAE8FD875B0 |
| 94 | ON | 188 | 35238 | 5D99A4EE-0ECA-458D-B2F9-A5D55B30F01B |
| 95 | OFF | 189 | 35239 | 13BB517A-D637-46B2-8023-4F166B5ACC45 |
| 95 | ON | 190 | 35241 | 965C833E-1D8A-4861-B83D-B8472149D8EB |
| 96 | OFF | 191 | 35242 | CFC40378-58F7-4BA3-B4CE-3CECD1A853EA |
| 96 | ON | 192 | 35243 | 4DDB211B-1060-4554-91B9-11BD2CE40B2E |
| 97 | OFF | 193 | 35244 | B3396D5B-2DCD-428F-BB14-8D3AF9850E76 |
| 97 | ON | 194 | 35245 | 6622F093-D10F-4974-A934-729F95C10B97 |
| 98 | OFF | 195 | 35246 | 35FDB3B9-903F-4162-8775-86AFD5CF1814 |
| 98 | ON | 196 | 35247 | 3435C8F6-D5A4-4FFC-9AD1-9313F42BDEEA |
| 99 | OFF | 197 | 35248 | B0F4E9C5-C8F1-41D3-8B51-B4F3DE448431 |
| 99 | ON | 198 | 35250 | 35CED2A3-EDFD-4AED-9ACD-BC338500FA1D |
| 100 | OFF | 199 | 35251 | 79D8CA92-D49E-4D51-AC6E-2058225F8BC3 |
| 100 | ON | 200 | 35252 | 678C88B3-73ED-4A59-9AF3-280169AC26B8 |
