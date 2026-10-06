# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 31.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 39.000 | 29.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 38.000 | 28.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 32.000 | 21.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 29.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 22.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 27.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 102.627 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 103.658 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 105.301 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 101.904 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 101.305 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 105.003 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 105.250 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 104.741 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 104.759 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 103.532 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 103.242 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 103.770 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 103.281 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 102.972 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 104.738 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 101.020 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 103.862 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 100.680 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 102.047 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 101.300 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 103.349 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 104.275 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 101.321 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 103.939 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 102.745 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 105.697 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 102.722 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 103.853 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 103.494 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 104.811 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 103.226 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 100.924 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 100.753 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 102.784 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 101.428 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 105.394 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 102.518 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 103.081 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 103.740 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 103.853 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 102.919 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 103.766 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 102.172 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 104.849 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 103.858 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 103.836 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 101.497 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 103.459 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 102.716 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 103.810 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 105.230 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 101.897 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 104.847 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 104.059 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 101.075 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 100.621 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 103.755 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 105.404 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 102.547 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 105.016 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 103.577 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 104.174 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 102.188 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 104.595 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 100.675 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 100.607 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 103.311 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 101.145 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 100.955 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 100.777 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 105.361 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 104.119 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 105.375 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 104.016 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 103.944 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 103.326 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 103.690 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 103.670 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 103.711 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 104.448 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 101.233 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 105.355 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 103.020 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 101.630 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 102.247 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 101.554 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 103.462 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 100.670 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 102.188 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 103.110 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 105.064 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 101.480 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 103.002 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 105.147 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 103.685 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 103.297 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 105.385 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 101.833 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 100.472 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 103.483 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 100 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/50 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 24782 | D18C426D-09FA-4075-9D35-356A74D88735 |
| 1 | ON | 2 | 24783 | CB383009-D485-4E51-8362-762CDFDD01E4 |
| 2 | OFF | 3 | 24784 | E46CBB59-1524-40E0-AA16-5F9606412B34 |
| 2 | ON | 4 | 24785 | AFCEAE56-4615-4F6B-AB26-62AE99D189C0 |
| 3 | OFF | 5 | 24787 | CA69DB71-9790-46DD-9597-4C052BE1C1DD |
| 3 | ON | 6 | 24789 | C14B4A92-25D0-43EA-8720-5DFDD76F37AE |
| 4 | OFF | 7 | 24790 | 8661C21E-CF31-4CE9-BB0A-E60B434EF026 |
| 4 | ON | 8 | 24791 | 989D9FAD-3FC6-478A-97CB-5A40146A9B76 |
| 5 | OFF | 9 | 24792 | 23D87D26-0C23-477A-AC44-BC14E5175F2E |
| 5 | ON | 10 | 24793 | F1F6C7DB-8C90-49B2-AB77-34DF78DE3788 |
| 6 | OFF | 11 | 24794 | 75697473-28EE-49F4-A5F8-B27606078E3C |
| 6 | ON | 12 | 24795 | EE617CE6-6BB5-4509-9AB8-8167710F5DAB |
| 7 | OFF | 13 | 24796 | 821FA22E-BD1E-4939-9DBF-6DB7ABC73B25 |
| 7 | ON | 14 | 24798 | 3C41B68B-A6F8-4EAA-AB03-913BC367B621 |
| 8 | OFF | 15 | 24799 | 779329B8-E982-4990-B042-DEB1CF0873E5 |
| 8 | ON | 16 | 24800 | C2B475DB-DB85-489F-9B47-FDE166798DE2 |
| 9 | OFF | 17 | 24801 | D8B815A7-27B6-4B22-A525-F7AAC1737931 |
| 9 | ON | 18 | 24802 | D29E86D1-FB6C-4862-9B17-DCF3C95DAFC6 |
| 10 | OFF | 19 | 24803 | 193C0C63-8F59-48CD-B01A-94993D3461DA |
| 10 | ON | 20 | 24804 | E5F125DC-2DA1-4177-92AA-24891B7DBBAA |
| 11 | OFF | 21 | 24805 | AA066CC0-FEE1-42AA-9DA9-A3B108046160 |
| 11 | ON | 22 | 24807 | CDB72644-00D2-4235-ADF6-BAA9E855A99F |
| 12 | OFF | 23 | 24808 | 780E6FFF-F222-4898-88BD-61422E8F14AC |
| 12 | ON | 24 | 24809 | B2D6BB19-6628-4AD0-8E59-FD25BD9BC626 |
| 13 | OFF | 25 | 24810 | 91CBB184-3BE0-4A19-9895-F413DB979FBC |
| 13 | ON | 26 | 24811 | 4AF97DA3-9720-4D1F-A159-08A3F35216D6 |
| 14 | OFF | 27 | 24812 | 632199F4-31A5-4385-8552-C6ECE1D1818C |
| 14 | ON | 28 | 24813 | B3928C99-E5AF-486A-8044-92501C118B92 |
| 15 | OFF | 29 | 24814 | 630F165E-E20C-4CE6-B19B-1AEFA745F316 |
| 15 | ON | 30 | 24816 | A8BE325F-54DD-4D40-8C6B-CA22FB6C690C |
| 16 | OFF | 31 | 24817 | 57F66CD9-FAEA-4E5C-A121-AA4729740A31 |
| 16 | ON | 32 | 24818 | 4484813A-8EEA-48F5-B1DD-AE6B5139204C |
| 17 | OFF | 33 | 24819 | A2429358-A4D7-4424-B51A-4A7C90FB6785 |
| 17 | ON | 34 | 24820 | E0D8EEED-4C88-4560-8D2D-F4AEB0820D99 |
| 18 | OFF | 35 | 24821 | 71B6F0AB-AC7E-4BA0-8C0B-BC53E54CE35A |
| 18 | ON | 36 | 24822 | C17D84CF-647B-4E58-A77F-56BCF64CC5EC |
| 19 | OFF | 37 | 24823 | 5D41C792-1319-4F5C-B271-063250ACA9EF |
| 19 | ON | 38 | 24824 | A2659686-94A1-4DC2-97B3-3B3BF0FBA41E |
| 20 | OFF | 39 | 24826 | 7CDCB8EC-F2D6-4E7B-BEEC-85DB62D65FB1 |
| 20 | ON | 40 | 24827 | 26B3F907-DAE0-4CFE-8668-FE378CBDF583 |
| 21 | OFF | 41 | 24828 | 23BE709F-5021-4BE0-B671-CC6E5C3F1939 |
| 21 | ON | 42 | 24829 | 852348C6-C7B0-45B3-85EB-7E0B97F5305C |
| 22 | OFF | 43 | 24830 | 1F2E0821-504D-4A2B-AC0B-B40EE981AC92 |
| 22 | ON | 44 | 24831 | A5A9C4B5-0BA4-4FED-97DE-991A60F29EE1 |
| 23 | OFF | 45 | 24832 | 036584EE-066C-4B00-8469-9F50B42B315D |
| 23 | ON | 46 | 24833 | 2AC0B4AF-1341-4E89-947D-290614F27C7C |
| 24 | OFF | 47 | 24835 | 6D2B75C4-ABF7-49D2-9E14-AFD914519DCB |
| 24 | ON | 48 | 24836 | 1AF086D9-087B-4C15-B62C-18E75EB134E2 |
| 25 | OFF | 49 | 24837 | 2EBE74EB-5733-44D7-9023-1CFFA4C5B685 |
| 25 | ON | 50 | 24838 | 0BA75763-117E-4160-9B69-021ED9259308 |
| 26 | OFF | 51 | 24839 | 963E8C5E-3C01-4E04-A6BB-C99080D1E94E |
| 26 | ON | 52 | 24840 | 0CC72320-FCB7-4E4D-A539-EAA5D8394803 |
| 27 | OFF | 53 | 24841 | 2064AA57-7C34-4BF9-9202-5E49835741C9 |
| 27 | ON | 54 | 24842 | 15464C44-8C82-4D47-B531-3B311184F3D1 |
| 28 | OFF | 55 | 24844 | F837AD11-9803-4882-B056-3CA42ECEE7E1 |
| 28 | ON | 56 | 24845 | A2B3154F-671F-46FA-9F98-84C5FAC5C200 |
| 29 | OFF | 57 | 24846 | 78C4B6EC-91AF-4D7E-8441-B7348379762D |
| 29 | ON | 58 | 24847 | 0CFAC81C-9C45-4F1B-B9F0-2A9E19815D80 |
| 30 | OFF | 59 | 24848 | DCE83BEB-27A0-4BA9-B607-407F4B2F6DDD |
| 30 | ON | 60 | 24849 | BBAA169D-4E66-4858-BB6E-C16E9E939B59 |
| 31 | OFF | 61 | 24850 | 975C1D15-ABAC-419C-BC3E-49518F4E3D9C |
| 31 | ON | 62 | 24851 | DE306C6A-EED1-43D0-A064-98D57D783478 |
| 32 | OFF | 63 | 24852 | 0A4094F9-E09D-4775-8F16-8E3FFEC62FF5 |
| 32 | ON | 64 | 24854 | 9295DFD9-86EF-44DF-B162-41491AE51861 |
| 33 | OFF | 65 | 24855 | F45304F8-0150-4F9D-9458-557D3B680AD3 |
| 33 | ON | 66 | 24856 | D72E6630-73C2-4E1D-9C6C-84C1B765BC3B |
| 34 | OFF | 67 | 24857 | 3F98844D-3CD1-4FB3-81A0-F2A2EDA636AE |
| 34 | ON | 68 | 24858 | C7CD4B8C-3712-4D32-A1DC-2272BC7CE1B0 |
| 35 | OFF | 69 | 24859 | 7F068D19-F592-464F-97B4-A48E65F95B23 |
| 35 | ON | 70 | 24860 | B6B16552-E062-40FB-A4CF-57190461A86A |
| 36 | OFF | 71 | 24861 | 63F81327-73E2-459C-A6C4-0C2F9328A200 |
| 36 | ON | 72 | 24863 | 820F7FA0-95D2-47C8-BDE3-4B195FF9B084 |
| 37 | OFF | 73 | 24864 | 8558A175-9765-4D3D-9C74-1FD3636249A2 |
| 37 | ON | 74 | 24865 | A41AB73A-BA72-4932-BC6C-F9916CDA3DD7 |
| 38 | OFF | 75 | 24866 | 683F58BF-FDFD-4129-B9BC-3896661E3FFB |
| 38 | ON | 76 | 24867 | 3F1AA23A-91B6-4A52-B63E-08D8F9F8E1F3 |
| 39 | OFF | 77 | 24868 | 459BB9DC-4EF3-4B3A-943B-A7F48FD293D9 |
| 39 | ON | 78 | 24869 | C89CAAB1-A39D-49A8-87E0-7C485AC51216 |
| 40 | OFF | 79 | 24870 | E77B4067-2AA4-4439-BC13-F90437A1B57D |
| 40 | ON | 80 | 24871 | 3F406337-4096-471D-A09D-427CEE46B188 |
| 41 | OFF | 81 | 24873 | 752CE3E9-96BE-4074-B8A2-1B1BC1BB2670 |
| 41 | ON | 82 | 24874 | 5FADF91D-0D39-4E56-913C-73ECA29DC8AE |
| 42 | OFF | 83 | 24875 | 62B7F0BE-B9C9-4881-88DD-053183A611DC |
| 42 | ON | 84 | 24876 | C8A0DA60-F9DD-4405-B5AD-F3E3CCC7934D |
| 43 | OFF | 85 | 24877 | 24C21A14-8B33-45EA-A61D-B542C49EF9E4 |
| 43 | ON | 86 | 24878 | 5E19CE5C-35D6-4D3F-B47D-47BCC29AF56A |
| 44 | OFF | 87 | 24879 | 0C131CC9-8D3A-420E-B09E-6C26B023E62E |
| 44 | ON | 88 | 24880 | 5DA7B29C-22F8-4BE8-9262-FEB4BA1B08FB |
| 45 | OFF | 89 | 24882 | 28F95403-FECB-48F5-BD4D-E0C76135C0AA |
| 45 | ON | 90 | 24883 | 78EF81CF-15FE-414E-AB6D-75255D4F821D |
| 46 | OFF | 91 | 24884 | E335CAAF-567F-4CFC-B6FA-1FC16BFAC370 |
| 46 | ON | 92 | 24885 | 6669D166-F2DB-4226-83B9-E044C7B088E7 |
| 47 | OFF | 93 | 24887 | C734DA42-4F51-4229-9067-37DBE3828063 |
| 47 | ON | 94 | 24888 | D0580E74-C668-4532-8F6E-D161F18D5E66 |
| 48 | OFF | 95 | 24889 | EF529766-4D5D-429A-BE87-03F63EEF5555 |
| 48 | ON | 96 | 24890 | 8AF1717F-A5EF-47A9-9877-7E8DC469EE83 |
| 49 | OFF | 97 | 24892 | ADCABEBC-AEB3-48F4-B34B-C042D574D7F5 |
| 49 | ON | 98 | 24893 | 954B6F41-F98C-46F5-A19D-3C74DED24282 |
| 50 | OFF | 99 | 24895 | 7FF71CBB-ECD4-4B26-8C2E-D4AFAEB956D7 |
| 50 | ON | 100 | 24896 | D6C6AEB8-63CB-405D-AF00-8F246117EEBE |
