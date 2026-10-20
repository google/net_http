# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Fresh TCP (ms) | Fresh TLS (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 32.000 | 19.000 | 192.178.226.81 |
| omnient | 1 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 192.178.226.81 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 192.178.226.81 |
| omnient | 2 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 192.178.226.81 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 192.178.226.81 |
| omnient | 3 | ON | completed | 200 | earlyPOST | h2 | true | 28.000 | 16.000 | 192.178.226.81 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 192.178.226.81 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 30.000 | 18.000 | 192.178.226.81 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 192.178.226.81 |
| omnient | 5 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 192.178.226.81 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 192.178.226.81 |
| omnient | 6 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 16.000 | 192.178.226.81 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 192.178.226.81 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 29.000 | 17.000 | 192.178.226.81 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 192.178.226.81 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 192.178.226.81 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 192.178.226.81 |
| omnient | 9 | ON | completed | 200 | earlyPOST | h2 | true | 27.000 | 15.000 | 192.178.226.81 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 192.178.226.81 |
| omnient | 10 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 192.178.226.81 |
| viewfinder | 1 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 192.178.226.81 |
| viewfinder | 1 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 16.000 | 192.178.226.81 |
| viewfinder | 2 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 192.178.226.81 |
| viewfinder | 2 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 192.178.226.81 |
| viewfinder | 3 | OFF | completed | — | handshake | h2 | false | 29.000 | 17.000 | 192.178.226.81 |
| viewfinder | 3 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 192.178.226.81 |
| viewfinder | 4 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 192.178.226.81 |
| viewfinder | 4 | ON | completed | 400 | handshake | h2 | false | 27.000 | 16.000 | 192.178.226.81 |
| viewfinder | 5 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 192.178.226.81 |
| viewfinder | 5 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 192.178.226.81 |
| viewfinder | 6 | OFF | completed | — | handshake | h2 | false | 34.000 | 21.000 | 192.178.226.81 |
| viewfinder | 6 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 192.178.226.81 |
| viewfinder | 7 | OFF | completed | — | handshake | h2 | false | 31.000 | 17.000 | 192.178.226.81 |
| viewfinder | 7 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 192.178.226.81 |
| viewfinder | 8 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 192.178.226.81 |
| viewfinder | 8 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 192.178.226.81 |
| viewfinder | 9 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 192.178.226.81 |
| viewfinder | 9 | ON | completed | 200 | handshake | h2 | false | 28.000 | 15.000 | 192.178.226.81 |
| viewfinder | 10 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 192.178.226.81 |
| viewfinder | 10 | ON | completed | 400 | handshake | h2 | false | 29.000 | 16.000 | 192.178.226.81 |

## Observations and limits

Omnient sends M3 during connection establishment; Viewfinder schedules M3 about 500 ms later, after the channel opened in every completed Viewfinder trial. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 10/20 ON trials. These runs still completed after the client retried.

The Xcode logs contain retry diagnostics in ON trials for Omnient pairs 1, 2, 5, 6, 10 and Viewfinder pairs 1, 2, 4, 7, 10. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

