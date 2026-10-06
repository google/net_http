# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 1 | ON | completed | 400 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 33.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | ON | completed | 200 | earlyPOST | h2 | true | 46.000 | 33.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 69.000 | 27.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | ON | completed | 400 | handshake | h2 | false | 32.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 40.000 | 27.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | ON | failed | 200 | earlyPOST | h2 | true | 32.000 | 22.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 58.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 31.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 41.000 | 30.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | ON | completed | 400 | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 36.000 | 28.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | ON | completed | 200 | earlyPOST | h2 | true | 55.000 | 18.000 | 2404:6800:400b:c015::451 |
| viewfinder | 1 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| viewfinder | 1 | ON | completed | 400 | handshake | h2 | false | 45.000 | 18.000 | 2404:6800:400b:c015::451 |
| viewfinder | 2 | OFF | completed | — | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c015::451 |
| viewfinder | 2 | ON | completed | 200 | earlyPOST | h2 | true | 39.000 | 28.000 | 2404:6800:400b:c015::451 |
| viewfinder | 3 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c015::451 |
| viewfinder | 3 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| viewfinder | 4 | OFF | completed | — | handshake | h2 | false | 27.000 | 20.000 | 2404:6800:400b:c015::451 |
| viewfinder | 4 | ON | completed | 400 | handshake | h2 | false | 60.000 | 13.000 | 2404:6800:400b:c015::451 |
| viewfinder | 5 | OFF | completed | — | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c015::451 |
| viewfinder | 5 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c015::451 |
| viewfinder | 6 | OFF | failed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| viewfinder | 6 | ON | completed | 400 | earlyPOST | h2 | true | 62.000 | 19.000 | 2404:6800:400b:c015::451 |
| viewfinder | 7 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| viewfinder | 7 | ON | completed | 400 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| viewfinder | 8 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| viewfinder | 8 | ON | completed | 400 | handshake | h2 | false | 60.000 | 17.000 | 2404:6800:400b:c015::451 |
| viewfinder | 9 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| viewfinder | 9 | ON | completed | 400 | handshake | h2 | false | 56.000 | 32.000 | 2404:6800:400b:c015::451 |
| viewfinder | 10 | OFF | completed | — | handshake | h2 | false | 83.000 | 22.000 | 2404:6800:400b:c015::451 |
| viewfinder | 10 | ON | failed | 200 | handshake | h2 | false | 62.000 | 13.000 | 2404:6800:400b:c015::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

| Scenario | Pair | Setting | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|:---:|---|---|
| omnient | 1 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | count=0 | early POST | early POST |
| omnient | 2 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | count=0 | early POST | early POST |
| omnient | 3 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | count=0 | early POST | early POST |
| omnient | 4 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | count=0 | early POST | early POST |
| omnient | 5 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | count=0 | early POST | early POST |
| omnient | 6 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | count=0 | early POST | early POST |
| omnient | 7 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | count=0 | early POST | early POST |
| omnient | 8 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | count=0 | early POST | early POST |
| omnient | 9 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | count=0 | early POST | early POST |
| omnient | 10 | OFF | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | count=0 | early POST | early POST |
| viewfinder | 1 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 1 | ON | count=0 | early POST | post-open POST |
| viewfinder | 2 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 2 | ON | count=0 | early POST | post-open POST |
| viewfinder | 3 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 3 | ON | count=0 | early POST | post-open POST |
| viewfinder | 4 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 4 | ON | count=0 | early POST | post-open POST |
| viewfinder | 5 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 5 | ON | count=0 | early POST | post-open POST |
| viewfinder | 6 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 6 | ON | count=0 | early POST | post-open POST |
| viewfinder | 7 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 7 | ON | count=0 | early POST | post-open POST |
| viewfinder | 8 | OFF | count=1 | handshake POST | post-open POST |
| viewfinder | 8 | ON | count=0 | early POST | post-open POST |
| viewfinder | 9 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 9 | ON | count=0 | early POST | post-open POST |
| viewfinder | 10 | OFF | count=0 | post-open POST | post-open POST |
| viewfinder | 10 | ON | count=0 | early POST | post-open POST |

## Observations and limits

Omnient sends M3 during connection establishment; Viewfinder schedules M3 about 500 ms later, after the channel opened in every completed Viewfinder trial. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 12/20 ON trials. Of those trials, 12 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for Omnient pairs 1, 3, 4, 7, 8, 9 and Viewfinder pairs 1, 3, 4, 6, 7, 8, 9, 10. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 4 ON (Xcode log includes network connection lost, -1005); viewfinder pair 6 OFF (Xcode log includes network connection lost, -1005); viewfinder pair 10 ON (Xcode log includes network connection lost, -1005).

