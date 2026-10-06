# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 84.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | ON | failed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 19.000 | 12.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 33.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 34.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 55.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 61.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | ON | timeout | 400 | handshake | h2 | false | 62.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 32.000 | 18.000 | 2404:6800:400b:c015::451 |
| viewfinder | 1 | OFF | failed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| viewfinder | 1 | ON | completed | 200 | handshake | h2 | false | 33.000 | 14.000 | 2404:6800:400b:c015::451 |
| viewfinder | 2 | OFF | completed | — | handshake | h2 | false | 24.000 | 12.000 | 2404:6800:400b:c015::451 |
| viewfinder | 2 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| viewfinder | 3 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c015::451 |
| viewfinder | 3 | ON | completed | 400 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| viewfinder | 4 | OFF | failed | — | handshake | h2 | false | 28.000 | 15.000 | 2404:6800:400b:c015::451 |
| viewfinder | 4 | ON | completed | 400 | handshake | h2 | false | 57.000 | 16.000 | 2404:6800:400b:c015::451 |
| viewfinder | 5 | OFF | completed | — | handshake | h2 | false | 22.000 | 16.000 | 2404:6800:400b:c015::451 |
| viewfinder | 5 | ON | completed | 200 | handshake | h2 | false | 40.000 | 15.000 | 2404:6800:400b:c015::451 |
| viewfinder | 6 | OFF | completed | — | handshake | h2 | false | 21.000 | 12.000 | 2404:6800:400b:c015::451 |
| viewfinder | 6 | ON | completed | 200 | handshake | h2 | false | 51.000 | 13.000 | 2404:6800:400b:c015::451 |
| viewfinder | 7 | OFF | completed | — | handshake | h2 | false | 31.000 | 13.000 | 2404:6800:400b:c015::451 |
| viewfinder | 7 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| viewfinder | 8 | OFF | completed | — | handshake | h2 | false | 55.000 | 17.000 | 2404:6800:400b:c015::451 |
| viewfinder | 8 | ON | failed | 400 | handshake | h2 | false | 303.000 | 293.000 | 2404:6800:400b:c015::451 |
| viewfinder | 9 | OFF | completed | — | handshake | h2 | false | 30.000 | 14.000 | 2404:6800:400b:c015::451 |
| viewfinder | 9 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| viewfinder | 10 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| viewfinder | 10 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 50.304 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 52.865 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 52.478 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 51.285 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 51.087 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 52.562 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 51.808 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 50.489 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 50.592 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 51.444 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 50.449 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 51.799 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 51.580 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 52.847 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 52.240 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 52.907 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 51.205 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 52.866 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 52.473 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 50.740 | count=0 | early POST | early POST |
| viewfinder | 1 | OFF | 52.201 | count=0 | post-open POST | post-open POST |
| viewfinder | 1 | ON | 50.372 | count=0 | early POST | post-open POST |
| viewfinder | 2 | OFF | 51.271 | count=0 | post-open POST | post-open POST |
| viewfinder | 2 | ON | 50.958 | count=0 | early POST | post-open POST |
| viewfinder | 3 | OFF | 50.601 | count=0 | post-open POST | post-open POST |
| viewfinder | 3 | ON | 51.225 | count=0 | early POST | post-open POST |
| viewfinder | 4 | OFF | 51.768 | count=0 | post-open POST | post-open POST |
| viewfinder | 4 | ON | 52.828 | count=0 | early POST | post-open POST |
| viewfinder | 5 | OFF | 52.048 | count=0 | post-open POST | post-open POST |
| viewfinder | 5 | ON | 51.827 | count=0 | early POST | post-open POST |
| viewfinder | 6 | OFF | 51.553 | count=0 | post-open POST | post-open POST |
| viewfinder | 6 | ON | 52.863 | count=0 | early POST | post-open POST |
| viewfinder | 7 | OFF | 51.563 | count=0 | post-open POST | post-open POST |
| viewfinder | 7 | ON | 51.818 | count=0 | early POST | post-open POST |
| viewfinder | 8 | OFF | 50.862 | count=0 | post-open POST | post-open POST |
| viewfinder | 8 | ON | 50.518 | count=0 | early POST | post-open POST |
| viewfinder | 9 | OFF | 52.851 | count=0 | post-open POST | post-open POST |
| viewfinder | 9 | ON | 52.908 | count=0 | early POST | post-open POST |
| viewfinder | 10 | OFF | 51.151 | count=0 | post-open POST | post-open POST |
| viewfinder | 10 | ON | 50.377 | count=0 | early POST | post-open POST |

## Observations and limits

Omnient sends M3 during connection establishment; Viewfinder schedules M3 about 500 ms later, after the channel opened in every completed Viewfinder trial. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 6/20 ON trials. Of those trials, 4 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for Omnient pairs 2, 8 and Viewfinder pairs 3, 4, 7, 8, 10. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 2 ON; omnient pair 8 ON; viewfinder pair 1 OFF (Xcode log includes network connection lost, -1005); viewfinder pair 4 OFF; viewfinder pair 8 ON (Xcode log includes network connection lost, -1005).

