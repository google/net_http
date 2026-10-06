# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 37.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 28.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 55.000 | 45.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 156.459 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 154.283 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 155.937 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 151.259 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 156.304 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 155.246 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 156.431 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 152.685 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 155.959 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 156.218 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 155.924 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 155.809 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 156.098 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 151.864 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 155.929 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 151.671 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 157.284 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 151.760 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 156.593 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 154.133 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 154.413 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 153.335 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 156.263 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 156.640 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 156.083 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 156.510 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 152.199 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 156.679 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 155.445 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 152.070 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 156.003 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 157.849 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 155.890 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 156.265 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 151.652 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 155.112 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 156.621 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 153.985 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 155.583 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 151.941 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 156.311 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 157.754 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 156.103 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 156.160 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 156.116 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 154.799 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 150.666 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 151.348 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 153.817 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 155.242 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 156.110 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 156.679 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 156.332 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 150.501 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 156.019 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 156.880 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 154.696 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 157.888 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 154.783 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 150.481 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 156.211 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 151.366 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 153.411 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 154.671 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 154.787 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 155.519 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 156.035 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 150.785 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 155.604 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 156.643 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 157.282 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 152.495 | count=0 | early POST | post-open POST |
| omnient | 37 | OFF | 154.816 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 156.595 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 154.653 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 156.447 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 152.022 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 156.766 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 152.196 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 155.603 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 156.064 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 151.658 | count=0 | early POST | post-open POST |
| omnient | 42 | OFF | 152.094 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 157.878 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 155.918 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 153.961 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 154.794 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 156.797 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 152.138 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 152.620 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 154.259 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 156.300 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 155.004 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 151.273 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 154.939 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 156.450 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 156.627 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 154.741 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 156.210 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 154.809 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 150 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 0/50 ON trials. Of those trials, 0 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs none. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 24898 | B8B7D190-0974-41AD-B61B-7B75042C663A |
| 1 | ON | 2 | 24899 | C222917D-703F-41AB-9307-AA686EEB7D68 |
| 2 | OFF | 3 | 24900 | FA4FA470-9884-490A-8E4B-753F44604ED1 |
| 2 | ON | 4 | 24901 | 5049FCA7-81B8-4B9A-8831-1A581A7C020F |
| 3 | OFF | 5 | 24902 | EF1B1C14-7D29-4178-B5DF-B169B11D4DE9 |
| 3 | ON | 6 | 24903 | 7A2E4479-50AC-47DC-9B49-8ECE8DC770D5 |
| 4 | OFF | 7 | 24904 | 12DF8703-3A16-4F07-A9D4-45A322F4736F |
| 4 | ON | 8 | 24906 | D2668FA0-F035-4535-A908-580B2B89F991 |
| 5 | OFF | 9 | 24907 | A504CAE6-C268-4322-B0CC-E5A0184680BE |
| 5 | ON | 10 | 24908 | EBA3967B-6248-49AF-B6F0-92CB51094E21 |
| 6 | OFF | 11 | 24909 | 18DF68F1-3128-4A41-BD6A-64EF306DB1B7 |
| 6 | ON | 12 | 24910 | DC637037-05EF-4EA8-8FEE-F1E46DB3FD4A |
| 7 | OFF | 13 | 24911 | FEB371A4-A55F-4F65-98B3-D7E81556F63F |
| 7 | ON | 14 | 24912 | 06E8902D-C24F-468A-900F-7CCA1BEEFFD7 |
| 8 | OFF | 15 | 24913 | F231C7B5-8887-467A-A34C-9436F3FAD863 |
| 8 | ON | 16 | 24914 | 1D7E3A39-0FB4-48C7-A208-D7DCA4B174F0 |
| 9 | OFF | 17 | 24916 | 017949A7-51C7-4285-922E-CC13D4C689B7 |
| 9 | ON | 18 | 24917 | 1F8EE61F-CA16-47FD-9526-F6CB0A672320 |
| 10 | OFF | 19 | 24918 | 7611FA8B-3405-447E-AA2E-87F9FF0F52B2 |
| 10 | ON | 20 | 24919 | 96379251-02F8-4EAE-953C-BD118A887871 |
| 11 | OFF | 21 | 24920 | BA87A4C8-22BF-4FA6-B9C2-67CB46A5CBF0 |
| 11 | ON | 22 | 24921 | DF8B684D-8556-46AE-B6BC-4A4926D082A9 |
| 12 | OFF | 23 | 24922 | 24DD8A33-B732-4DB3-8522-119B7770B901 |
| 12 | ON | 24 | 24923 | A3C3ADC2-2D6D-4D0F-A46F-49D1E1E193B5 |
| 13 | OFF | 25 | 24925 | 1967BB5D-C28C-46C2-9B53-16111C361944 |
| 13 | ON | 26 | 24926 | C137EFF0-06E1-426C-8DCC-9D29EBC4B3DD |
| 14 | OFF | 27 | 24927 | A6FAC819-DD18-4178-BBB1-A5C0CB9753B9 |
| 14 | ON | 28 | 24928 | 602F03E9-29DC-4FB7-9398-E0738CF7694F |
| 15 | OFF | 29 | 24929 | E1DDE1B0-601D-404C-AF94-438B85358318 |
| 15 | ON | 30 | 24930 | F1D5CC13-0178-4382-943A-8196139D617D |
| 16 | OFF | 31 | 24931 | 48E43EE0-A5C0-4A0A-A544-9945C83F11D2 |
| 16 | ON | 32 | 24932 | 8531CFC7-320A-4D27-A15D-48A8A1D20E36 |
| 17 | OFF | 33 | 24934 | 8C74562B-39B2-4A6F-8924-4090C840B0C9 |
| 17 | ON | 34 | 24935 | C69CADF8-1C26-4801-BC7E-166F1CF8A473 |
| 18 | OFF | 35 | 24936 | 03878E9A-3D5C-401B-8C53-CD756FF7F319 |
| 18 | ON | 36 | 24937 | 7EDDDED5-9D5E-41FE-BFBE-524D0691D766 |
| 19 | OFF | 37 | 24938 | 1E67FCB6-E4EC-4B82-AE96-7A895B269437 |
| 19 | ON | 38 | 24939 | 2CEF6504-9B67-40A7-8D77-FADA7F44590E |
| 20 | OFF | 39 | 24940 | 8C68D303-743F-4572-A7AC-8EC34EAD7497 |
| 20 | ON | 40 | 24941 | F9B8705E-4AAD-42FD-964E-A6224D4AAE45 |
| 21 | OFF | 41 | 24942 | 3061F106-AEC8-4769-8D0D-97A60722292A |
| 21 | ON | 42 | 24944 | 3795666F-1E76-4AC8-A2D6-CCFBFD885D97 |
| 22 | OFF | 43 | 24945 | E3D23325-51EC-4E90-BFAB-E40FD6B1E85D |
| 22 | ON | 44 | 24946 | 028D06A1-6C3E-4626-A354-D599E4E90F86 |
| 23 | OFF | 45 | 24947 | 4B5C4443-5379-440D-9FC2-D7CDA5179F31 |
| 23 | ON | 46 | 24948 | 775A5A0D-C162-4AFC-9DC5-6286349670DE |
| 24 | OFF | 47 | 24949 | FD11FC53-C200-4F34-ABF1-9F42C53F5A82 |
| 24 | ON | 48 | 24950 | 92E2C8EE-E998-42A6-AD16-D0CCBB93BA92 |
| 25 | OFF | 49 | 24951 | 316E6408-7F28-4D6A-BB67-5B8A7C58061F |
| 25 | ON | 50 | 24953 | 950E0452-EE26-418C-877A-73BF132F41C5 |
| 26 | OFF | 51 | 24954 | C7083C52-EC89-4220-84ED-E82476A35565 |
| 26 | ON | 52 | 24955 | 5E6558FF-A9E4-4438-A94A-009901900C84 |
| 27 | OFF | 53 | 24956 | 8B2FB641-239E-4BC9-BFC4-C12AA2B365E3 |
| 27 | ON | 54 | 24957 | 78DB114C-3739-4339-869A-E38F8DB4689D |
| 28 | OFF | 55 | 24958 | 01927558-A767-461C-B365-96CED0D63D83 |
| 28 | ON | 56 | 24959 | EFA36266-C544-4E8B-AC3C-BDD1D4A0C32A |
| 29 | OFF | 57 | 24961 | 693DE0C2-85C0-4BD3-B443-472ADE15154A |
| 29 | ON | 58 | 24963 | B0E348A4-6572-4C2F-88CA-BB11F8CF4617 |
| 30 | OFF | 59 | 24964 | 64844E1F-573E-4ED3-BE7F-061A4D7F2BD9 |
| 30 | ON | 60 | 24965 | 2D607B96-8818-4216-A704-7150D61263A2 |
| 31 | OFF | 61 | 24966 | D9042F49-D373-4FFF-B6EF-65D8E236695A |
| 31 | ON | 62 | 24967 | 93436109-3FD8-4753-A230-321B4362FFF5 |
| 32 | OFF | 63 | 24968 | 7C9CAAFE-9DCA-4224-B1F1-31838A20D22F |
| 32 | ON | 64 | 24969 | B0969B31-DB59-4477-B96A-9C2A345BC71A |
| 33 | OFF | 65 | 24970 | 7B485D67-15ED-4131-8A60-06EB70E2CB6D |
| 33 | ON | 66 | 24972 | 213B0A93-480C-43C0-9F65-FDDFC3761EBD |
| 34 | OFF | 67 | 24973 | 38360559-6666-4500-AB79-1E3125FD1943 |
| 34 | ON | 68 | 24974 | 7866AADC-8CC6-4DB1-AABB-E6F47C377DBC |
| 35 | OFF | 69 | 24975 | 30A6EF3D-CC23-4C1C-A3B2-A35E4C5D73A5 |
| 35 | ON | 70 | 24976 | 36593E66-5930-40F0-9053-D30FF25B5A3D |
| 36 | OFF | 71 | 24977 | 722EA945-7DDD-4529-B169-B9A3743E0A7F |
| 36 | ON | 72 | 24978 | A36926BB-AAA9-40DF-BCBC-23B58733E7F4 |
| 37 | OFF | 73 | 24979 | AA99E315-19F1-44AF-A505-4BC636C81D8C |
| 37 | ON | 74 | 24981 | 89EC033E-76B4-4D00-8AF0-8307D324C6E7 |
| 38 | OFF | 75 | 24982 | 976DBACB-DF48-4323-90F1-CD91C6C72254 |
| 38 | ON | 76 | 24983 | 3EABA27E-F6A1-421A-9FB6-DE746E29E9BF |
| 39 | OFF | 77 | 24984 | A8BAD766-7A53-4AB6-8105-AA7AF66830FE |
| 39 | ON | 78 | 24985 | D5C76F88-A5B3-436B-8476-D869CEAE05E3 |
| 40 | OFF | 79 | 24986 | 77734EE4-E640-4932-8E2D-52C83408C9A8 |
| 40 | ON | 80 | 24987 | 842E3165-71F3-489E-B757-DB60A332C4A6 |
| 41 | OFF | 81 | 24988 | 845F7676-8E30-47F6-A991-40875E830845 |
| 41 | ON | 82 | 24989 | E85C6284-D5B2-4D1D-B385-9E53E091085B |
| 42 | OFF | 83 | 24991 | 1B32BA96-C30B-422C-9039-645FED3337B3 |
| 42 | ON | 84 | 24992 | 1D772850-F279-4F98-A334-71C13CB3C533 |
| 43 | OFF | 85 | 24993 | 5019806D-E36F-48A0-8A80-B99E67DA7C34 |
| 43 | ON | 86 | 24994 | 2CB85443-4947-4D9E-8432-5CC740B3B246 |
| 44 | OFF | 87 | 24995 | 3E6B7B3B-7F8A-4B64-A8B1-2A1056CBDFDD |
| 44 | ON | 88 | 24996 | 53285D57-EFEA-4312-ADD5-5813F2695FB8 |
| 45 | OFF | 89 | 24997 | 09D9D7A5-9BED-4164-AB9D-3AE8B6CE1143 |
| 45 | ON | 90 | 24998 | 4CA1CCCB-259D-434C-A00C-A09C114D3C5F |
| 46 | OFF | 91 | 25000 | E2756383-0027-49AC-BF0B-1BAD2C533F49 |
| 46 | ON | 92 | 25001 | A9A49BCF-4F8E-416A-841D-66FF65EB2645 |
| 47 | OFF | 93 | 25002 | 95AE665A-0AE1-448E-A0E7-30417660C61B |
| 47 | ON | 94 | 25003 | 055A5285-1898-40DC-9149-3F9DAE75EBF6 |
| 48 | OFF | 95 | 25004 | C10E7A72-B40B-4D16-BD32-DAF716E976D7 |
| 48 | ON | 96 | 25005 | 297EE528-068C-4EBA-A80E-A1816290B0CE |
| 49 | OFF | 97 | 25006 | 77FB3EC6-54AC-443F-BF5F-6F1126E71E06 |
| 49 | ON | 98 | 25007 | DBF178FF-F97E-4A82-A143-D122EBB83546 |
| 50 | OFF | 99 | 25009 | 88650C14-026D-4FFA-8D32-64195B77DA01 |
| 50 | ON | 100 | 25010 | B7649287-BDB5-4186-9428-298FB06A02FC |
