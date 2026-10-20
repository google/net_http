# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 1 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 2 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 3 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 39.000 | 27.000 | 2404:6800:400b:c01b::451 |
| omnient | 4 | ON | completed | not sent | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 6 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 7 | ON | completed | not sent | handshake | h2 | false | 23.000 | 12.000 | 2404:6800:400b:c01b::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 8 | ON | completed | not sent | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 9 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 10 | ON | completed | not sent | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c01b::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 202.165 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 202.193 | count=0 | post-open POST | post-open POST |
| omnient | 2 | OFF | 208.671 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 203.907 | count=0 | post-open POST | post-open POST |
| omnient | 3 | OFF | 208.015 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 208.544 | count=0 | post-open POST | post-open POST |
| omnient | 4 | OFF | 207.505 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 205.322 | count=0 | post-open POST | post-open POST |
| omnient | 5 | OFF | 207.530 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 205.601 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 203.251 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 203.081 | count=0 | post-open POST | post-open POST |
| omnient | 7 | OFF | 207.147 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 207.753 | count=0 | post-open POST | post-open POST |
| omnient | 8 | OFF | 208.401 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 208.844 | count=0 | post-open POST | post-open POST |
| omnient | 9 | OFF | 208.631 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 205.118 | count=0 | post-open POST | post-open POST |
| omnient | 10 | OFF | 204.126 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 207.020 | count=0 | post-open POST | post-open POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/10 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

