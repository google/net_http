# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 32.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 57.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 63.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c015::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 86.000 | 75.000 | 2404:6800:400b:c015::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c015::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 30.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 40.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 89.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 29.000 | 21.000 | 2404:6800:400b:c015::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 64.000 | 55.000 | 2404:6800:400b:c015::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 37.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 75.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 64.000 | 52.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 216.000 | 206.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 104.914 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 104.991 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 105.415 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 103.433 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 104.413 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 105.076 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 104.025 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 105.209 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 103.406 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 102.466 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 103.587 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 103.989 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 103.673 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 102.616 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 104.408 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 103.042 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 102.323 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 105.412 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 104.275 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 104.374 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 103.420 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 101.947 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 103.352 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 102.298 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 103.677 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 101.642 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 102.123 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 104.201 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 104.071 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 104.663 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 105.384 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 103.165 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 104.421 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 100.589 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 103.110 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 100.727 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 104.989 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 103.655 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 103.124 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 101.231 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 105.404 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 102.199 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 102.648 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 104.145 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 103.422 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 103.498 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 101.470 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 103.616 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 104.101 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 104.210 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 100.932 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 102.569 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 100.424 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 101.249 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 100.431 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 100.608 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 105.416 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 102.545 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 101.318 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 104.884 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 105.365 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 103.486 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 102.522 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 103.039 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 103.480 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 104.134 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 103.807 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 103.522 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 100.710 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 102.129 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 105.125 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 104.553 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 103.029 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 102.544 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 104.355 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 105.316 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 101.961 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 104.111 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 103.602 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 103.677 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 101.448 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 104.581 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 105.441 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 103.232 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 104.077 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 103.517 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 104.018 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 100.782 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 105.417 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 102.229 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 103.165 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 103.464 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 103.481 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 103.441 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 102.730 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 103.604 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 102.555 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 102.419 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 104.778 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 105.048 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 100 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/50 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

