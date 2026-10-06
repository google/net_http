# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | not sent | handshake | h2 | false | 27.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | not sent | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | not sent | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | not sent | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | not sent | handshake | h2 | false | 47.000 | 38.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | not sent | handshake | h2 | false | 35.000 | 27.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 400 | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | not sent | handshake | h2 | false | 29.000 | 23.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | not sent | handshake | h2 | false | 33.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | not sent | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | not sent | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 36.000 | 25.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 77.000 | 67.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | not sent | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 208.868 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 205.675 | count=0 | post-open POST | post-open POST |
| omnient | 2 | OFF | 203.882 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 210.360 | count=0 | post-open POST | post-open POST |
| omnient | 3 | OFF | 202.040 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 205.992 | count=0 | post-open POST | post-open POST |
| omnient | 4 | OFF | 206.603 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 208.584 | count=0 | post-open POST | post-open POST |
| omnient | 5 | OFF | 207.703 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 201.594 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 206.596 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 202.186 | count=0 | post-open POST | post-open POST |
| omnient | 7 | OFF | 203.881 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 208.441 | count=0 | post-open POST | post-open POST |
| omnient | 8 | OFF | 208.954 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 200.843 | count=0 | post-open POST | post-open POST |
| omnient | 9 | OFF | 206.909 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 205.953 | count=0 | post-open POST | post-open POST |
| omnient | 10 | OFF | 209.426 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 202.605 | count=0 | post-open POST | post-open POST |
| omnient | 11 | OFF | 202.685 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 205.390 | count=0 | post-open POST | post-open POST |
| omnient | 12 | OFF | 206.297 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 206.140 | count=0 | post-open POST | post-open POST |
| omnient | 13 | OFF | 203.728 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 206.404 | count=0 | post-open POST | post-open POST |
| omnient | 14 | OFF | 206.431 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 206.510 | count=0 | post-open POST | post-open POST |
| omnient | 15 | OFF | 205.286 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 202.357 | count=0 | post-open POST | post-open POST |
| omnient | 16 | OFF | 204.032 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 206.609 | count=0 | post-open POST | post-open POST |
| omnient | 17 | OFF | 204.024 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 203.368 | count=0 | post-open POST | post-open POST |
| omnient | 18 | OFF | 200.604 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 201.939 | count=0 | post-open POST | post-open POST |
| omnient | 19 | OFF | 204.867 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 205.870 | count=0 | post-open POST | post-open POST |
| omnient | 20 | OFF | 208.455 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 209.116 | count=0 | post-open POST | post-open POST |
| omnient | 21 | OFF | 204.208 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 204.312 | count=0 | post-open POST | post-open POST |
| omnient | 22 | OFF | 205.476 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 204.011 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 202.421 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 209.328 | count=0 | post-open POST | post-open POST |
| omnient | 24 | OFF | 205.237 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 206.725 | count=0 | post-open POST | post-open POST |
| omnient | 25 | OFF | 205.964 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 203.495 | count=0 | post-open POST | post-open POST |
| omnient | 26 | OFF | 204.258 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 204.988 | count=0 | post-open POST | post-open POST |
| omnient | 27 | OFF | 202.439 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 208.138 | count=0 | post-open POST | post-open POST |
| omnient | 28 | OFF | 209.277 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 205.178 | count=0 | post-open POST | post-open POST |
| omnient | 29 | OFF | 202.582 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 205.710 | count=0 | post-open POST | post-open POST |
| omnient | 30 | OFF | 208.690 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 202.895 | count=0 | post-open POST | post-open POST |
| omnient | 31 | OFF | 204.193 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 207.398 | count=0 | post-open POST | post-open POST |
| omnient | 32 | OFF | 202.187 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 206.934 | count=0 | post-open POST | post-open POST |
| omnient | 33 | OFF | 206.536 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 207.978 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 209.255 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 201.015 | count=0 | post-open POST | post-open POST |
| omnient | 35 | OFF | 202.670 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 210.360 | count=0 | post-open POST | post-open POST |
| omnient | 36 | OFF | 201.971 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 201.534 | count=0 | post-open POST | post-open POST |
| omnient | 37 | OFF | 208.482 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 201.637 | count=0 | post-open POST | post-open POST |
| omnient | 38 | OFF | 206.471 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 203.053 | count=0 | post-open POST | post-open POST |
| omnient | 39 | OFF | 203.935 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 206.595 | count=0 | post-open POST | post-open POST |
| omnient | 40 | OFF | 204.986 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 201.818 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 209.462 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 205.559 | count=0 | post-open POST | post-open POST |
| omnient | 42 | OFF | 202.036 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 200.878 | count=0 | post-open POST | post-open POST |
| omnient | 43 | OFF | 209.994 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 201.470 | count=0 | post-open POST | post-open POST |
| omnient | 44 | OFF | 201.228 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 208.013 | count=0 | post-open POST | post-open POST |
| omnient | 45 | OFF | 203.119 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 200.433 | count=0 | post-open POST | post-open POST |
| omnient | 46 | OFF | 206.942 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 204.689 | count=0 | post-open POST | post-open POST |
| omnient | 47 | OFF | 206.607 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 200.421 | count=0 | post-open POST | post-open POST |
| omnient | 48 | OFF | 206.679 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 207.180 | count=0 | post-open POST | post-open POST |
| omnient | 49 | OFF | 204.501 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 201.195 | count=0 | post-open POST | post-open POST |
| omnient | 50 | OFF | 203.659 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 208.817 | count=0 | post-open POST | post-open POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 1/50 ON trials. Of those trials, 1 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 22. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 25011 | 1C1402A1-B898-4602-8C44-410167E6352C |
| 1 | ON | 2 | 25012 | AD9611B8-DCAA-49BD-BF4E-7116F90D2E42 |
| 2 | OFF | 3 | 25014 | 0F868874-8DC1-4710-AFCD-C36C404145F0 |
| 2 | ON | 4 | 25015 | 497BCF4F-6539-4E91-A7A7-3A0C60CDC3E1 |
| 3 | OFF | 5 | 25016 | 648D00DA-9B43-4611-AC86-A4C17DC63FDF |
| 3 | ON | 6 | 25017 | E3D6AF8F-EC22-4088-A28D-11AE665C3C99 |
| 4 | OFF | 7 | 25018 | F5457DD5-D222-4AAD-8CC3-D201EFAB94EC |
| 4 | ON | 8 | 25019 | E0B07009-1B7B-4921-BE2F-7527D57C88D3 |
| 5 | OFF | 9 | 25020 | D2AAB6D9-45A5-41FB-BEE2-D73A90BD46D4 |
| 5 | ON | 10 | 25021 | 12208B2A-BDF7-44E0-BECA-C97E5F5B98DF |
| 6 | OFF | 11 | 25023 | A32D60EA-114E-4C3C-A27F-D6A87545C720 |
| 6 | ON | 12 | 25024 | D3DCA8A1-34E7-4083-8116-DBCBB156BABE |
| 7 | OFF | 13 | 25025 | FB27F034-173D-485B-9919-EDB8AF8B1ADA |
| 7 | ON | 14 | 25026 | 6B377114-EB2C-4BE9-98A2-0B57DE3C92F6 |
| 8 | OFF | 15 | 25027 | 1172A3F6-8AFF-4CF5-89D8-42D9C2FB2647 |
| 8 | ON | 16 | 25028 | B4B93702-B32C-447A-977B-32F36C39CEE5 |
| 9 | OFF | 17 | 25029 | 7A6755C6-50D3-4CBE-8B51-D410CE0BAE6E |
| 9 | ON | 18 | 25030 | 50AE6DF4-F4AF-4ABC-9556-7CF752C63273 |
| 10 | OFF | 19 | 25032 | 9E9AAA2C-8EED-47C4-8EF9-8AA186211A00 |
| 10 | ON | 20 | 25033 | A8F7E276-F2A6-4449-BD23-B0F093FF8E8A |
| 11 | OFF | 21 | 25034 | 76AD7075-2FE1-459D-845A-0068A27B825A |
| 11 | ON | 22 | 25035 | 9271C9D3-AE99-454D-A8F6-DB6623F25E76 |
| 12 | OFF | 23 | 25036 | 86607512-1912-4961-9C32-9F209CAACAF8 |
| 12 | ON | 24 | 25037 | 4EEAB283-1E27-4EE0-A1A5-D89C6D480C99 |
| 13 | OFF | 25 | 25038 | DB3E28B6-43FF-4A51-A532-E5078C65D326 |
| 13 | ON | 26 | 25039 | 2AF8388F-48AF-4CA1-9413-9F2B56D6FC6B |
| 14 | OFF | 27 | 25041 | 6D806E3A-CAB4-442D-AE71-8C773CAEA380 |
| 14 | ON | 28 | 25042 | F3ADE17B-4AFD-4B6F-B539-982420A36BF2 |
| 15 | OFF | 29 | 25043 | B7EFD914-236C-47EF-95CB-5E336CB00182 |
| 15 | ON | 30 | 25044 | 2378F100-4222-45D8-B01D-7A3E11E5A8CF |
| 16 | OFF | 31 | 25045 | 9F584F3F-D77E-42E1-8E68-7FE5952BBB57 |
| 16 | ON | 32 | 25046 | 9C5E95B3-BE3B-40F4-9583-EA36C02D6DD7 |
| 17 | OFF | 33 | 25047 | 8B57A321-1C60-4346-84AF-5A6E6E049BB0 |
| 17 | ON | 34 | 25048 | 852353B7-B83F-4914-991D-7EF7BDC360D1 |
| 18 | OFF | 35 | 25050 | D51D3305-F711-41B7-99B8-3BA3AEA365EF |
| 18 | ON | 36 | 25051 | 674A47D8-54A0-4650-8A2C-3B1A391D83D2 |
| 19 | OFF | 37 | 25052 | CD369D91-0413-4D0A-84F3-870ADD4126C4 |
| 19 | ON | 38 | 25053 | 3AED45E8-CC19-43C4-993A-E47C4980E1B3 |
| 20 | OFF | 39 | 25054 | A06E8162-148B-42D2-AECF-CD72D9F457F7 |
| 20 | ON | 40 | 25055 | B9F4E353-596F-4738-A022-28CB791E3E64 |
| 21 | OFF | 41 | 25056 | 3E3DA7C3-9888-453F-9E27-C9CB6C0EFAEB |
| 21 | ON | 42 | 25057 | 7A37D814-042B-4143-8779-F87BBFAF7283 |
| 22 | OFF | 43 | 25059 | 1DB25345-CF3B-4E00-98F1-8A1410DF21F1 |
| 22 | ON | 44 | 25060 | 7A6D5CA2-1356-4F9F-B577-AFB29C9BECAA |
| 23 | OFF | 45 | 25061 | BF3125E0-9346-4EB0-B9BE-F52BEA3F2998 |
| 23 | ON | 46 | 25062 | 7B1107DA-5959-4E12-A792-AD92EA57BC0D |
| 24 | OFF | 47 | 25063 | 910D9308-98AB-4BF3-BD9D-92EAF1A7034F |
| 24 | ON | 48 | 25064 | 37D8D46E-D8E0-45C6-87C5-6F80CA0CB4D2 |
| 25 | OFF | 49 | 25065 | FAEE69B5-5EE5-4397-AC50-E63ACF5E6DB3 |
| 25 | ON | 50 | 25067 | 1C9BFA97-4472-4D60-BEDF-07E931173687 |
| 26 | OFF | 51 | 25068 | 7D1D1D6A-82AB-4219-840E-6923A98C2D99 |
| 26 | ON | 52 | 25069 | 7CE06728-51BC-4680-960C-6C3506243964 |
| 27 | OFF | 53 | 25070 | 77722467-C56A-431C-99CA-11D58EBA9295 |
| 27 | ON | 54 | 25071 | 91B582EA-F2FB-4CAD-A004-C8D6BDA02C41 |
| 28 | OFF | 55 | 25072 | 8A417625-2BF2-4CA0-8A8C-995993A39D12 |
| 28 | ON | 56 | 25073 | 868F53AC-76D9-452D-8731-C22C983504B8 |
| 29 | OFF | 57 | 25074 | 7C42E5CD-F71E-4609-93D9-02F6A2B1A2FB |
| 29 | ON | 58 | 25076 | A7DA8963-ABFC-4509-B268-893F39F02105 |
| 30 | OFF | 59 | 25077 | 5CF7F4C2-512C-453C-B290-9F62E3033C44 |
| 30 | ON | 60 | 25078 | 3BDC8FE8-CE0D-4ABC-913F-1251203F667E |
| 31 | OFF | 61 | 25079 | 8B421CA4-D441-4146-8A74-38EBD2FE64C0 |
| 31 | ON | 62 | 25080 | 87395702-B0B6-46C8-80CF-429851D24760 |
| 32 | OFF | 63 | 25081 | A490EDC2-2BBC-469D-9050-B9D447E9B285 |
| 32 | ON | 64 | 25082 | 18F501A2-EAD5-47DB-BB58-4F9AC700B85D |
| 33 | OFF | 65 | 25083 | F4E08052-5FAA-440B-9054-C590E218DFBE |
| 33 | ON | 66 | 25085 | 03722561-EC33-4727-9F81-5F664F0FDE37 |
| 34 | OFF | 67 | 25086 | 867504CD-F296-4E99-9042-FA5AC5206E2B |
| 34 | ON | 68 | 25087 | EACB4C1E-183D-4D60-AFF7-9E77FD0E9E55 |
| 35 | OFF | 69 | 25088 | B214DE56-88FB-4752-8CE1-3B8D27603442 |
| 35 | ON | 70 | 25089 | 7DAA4DD2-5BF5-43A0-AC53-54CF29A7B02D |
| 36 | OFF | 71 | 25090 | 10B5E008-D3FE-4CBA-A1DF-B87C0C9729B9 |
| 36 | ON | 72 | 25091 | 6F04F423-6AD1-4A22-B9BE-D21EA64677EB |
| 37 | OFF | 73 | 25092 | 0EA43FCA-88FA-4219-A18F-9C1C52902895 |
| 37 | ON | 74 | 25094 | 03F6A90A-3B38-42EB-8495-8F6955783398 |
| 38 | OFF | 75 | 25095 | 80F73F11-A975-4D32-A37E-D5C9B83ACFFC |
| 38 | ON | 76 | 25096 | B617D161-E80F-4916-83E8-3545A3038141 |
| 39 | OFF | 77 | 25097 | 04C0E5F5-D377-4D00-8DC9-30FF00AEF65F |
| 39 | ON | 78 | 25098 | 5F71954E-FCA7-4925-983B-31CA878874F4 |
| 40 | OFF | 79 | 25099 | E3F0E1BC-5D3A-43B8-B0FE-51CB12D45EF8 |
| 40 | ON | 80 | 25100 | 1C8BC40D-B237-47D2-9E49-923DC94680CE |
| 41 | OFF | 81 | 25101 | 1FB016B7-9BDB-4A7A-B4CC-3F78E2C3E53F |
| 41 | ON | 82 | 25103 | 329BED70-9358-4878-9158-E9B41D390F0F |
| 42 | OFF | 83 | 25104 | 4B5BFE4A-5469-4446-8CF4-AE64DFD90ABC |
| 42 | ON | 84 | 25105 | A839997D-3126-4A3A-8F20-8A6BF860BF17 |
| 43 | OFF | 85 | 25106 | D5E233ED-4D24-4D6D-9E05-1A2160547CD1 |
| 43 | ON | 86 | 25107 | 3CFA7717-0645-4762-8D97-1BB0FA1A71F0 |
| 44 | OFF | 87 | 25108 | CDC9E9FE-F9B9-4B97-80F0-2547CC86B624 |
| 44 | ON | 88 | 25109 | 10978B60-EF8F-4921-BAB7-CE5606157D46 |
| 45 | OFF | 89 | 25110 | 94A2FF9C-21BF-493F-82CA-F65F403A62B4 |
| 45 | ON | 90 | 25112 | 1FB0CC6E-21A6-47ED-9E66-2B30F21818ED |
| 46 | OFF | 91 | 25113 | EA7C3EF7-E6F9-461D-A72F-91E9323DC389 |
| 46 | ON | 92 | 25114 | 5ED8D190-A964-4F89-8BE8-167F080FC2B2 |
| 47 | OFF | 93 | 25115 | B5D1AF9A-08FA-4EEB-9B9B-911B23067B72 |
| 47 | ON | 94 | 25116 | B70A36A5-6226-4C83-B223-56F50A76CF05 |
| 48 | OFF | 95 | 25117 | 218D4B1B-9558-4E90-898C-47C46ABD517B |
| 48 | ON | 96 | 25118 | 3871A609-D987-43BB-BB28-F56C70D09033 |
| 49 | OFF | 97 | 25120 | 49DC966D-37AF-40C0-9ABC-242FFF1CB5EE |
| 49 | ON | 98 | 25121 | BC56A892-DCCE-4627-9FAC-D7B99A30F583 |
| 50 | OFF | 99 | 25122 | 5F4FD80E-A2F1-4527-870D-3E3977CEB1C8 |
| 50 | ON | 100 | 25123 | 49A943FB-0796-413E-BE90-596F0CB8A0C5 |
