# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 1 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 2 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 35.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 3 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 4 | ON | completed | not sent | handshake | h2 | false | 22.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 5 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 6 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 7 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 8 | ON | completed | not sent | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 9 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 10 | ON | completed | not sent | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 11 | ON | completed | not sent | handshake | h2 | false | 21.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 12 | ON | completed | 400 | handshake | h2 | false | 345.000 | 35.000 | 192.178.226.81 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 13 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 14 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 15 | ON | completed | not sent | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 16 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 17 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 18 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 29.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 19 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 20 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 21 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 22 | ON | completed | not sent | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 34.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 114.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 25 | ON | completed | 400 | handshake | h2 | false | 272.000 | 245.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 26 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 27 | ON | completed | 400 | handshake | h2 | false | 281.000 | 270.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 30.000 | 20.000 | 2404:6800:400b:c017::451 |
| omnient | 28 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 29 | ON | completed | not sent | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 292.000 | 31.000 | 2404:6800:400b:c017::451 |
| omnient | 30 | ON | completed | not sent | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 31 | ON | completed | 400 | handshake | h2 | false | 282.000 | 272.000 | 2404:6800:400b:c01b::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 32 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 63.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 33 | ON | completed | not sent | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c01b::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 34 | ON | completed | not sent | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 35 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 36 | ON | completed | not sent | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 37 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 195.000 | 136.000 | 2404:6800:400b:c01b::451 |
| omnient | 38 | ON | completed | not sent | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 39 | ON | completed | not sent | handshake | h2 | false | 29.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 30.000 | 21.000 | 2404:6800:400b:c01b::451 |
| omnient | 40 | ON | completed | not sent | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c01b::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 41 | ON | completed | not sent | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 42 | ON | completed | not sent | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 43 | ON | completed | not sent | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 44 | ON | completed | not sent | handshake | h2 | false | 21.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 19.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 45 | ON | completed | not sent | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 30.000 | 23.000 | 192.178.226.81 |
| omnient | 46 | ON | completed | not sent | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 47 | ON | completed | not sent | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 48 | ON | completed | not sent | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 139.000 | 130.000 | 2404:6800:400b:c01b::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 50 | ON | completed | not sent | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 208.704 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 206.074 | count=0 | post-open POST | post-open POST |
| omnient | 2 | OFF | 208.885 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 204.751 | count=0 | post-open POST | post-open POST |
| omnient | 3 | OFF | 208.562 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 208.912 | count=0 | post-open POST | post-open POST |
| omnient | 4 | OFF | 203.679 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 209.156 | count=0 | post-open POST | post-open POST |
| omnient | 5 | OFF | 205.472 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 206.621 | count=0 | post-open POST | post-open POST |
| omnient | 6 | OFF | 207.314 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 210.058 | count=0 | post-open POST | post-open POST |
| omnient | 7 | OFF | 207.712 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 209.965 | count=0 | post-open POST | post-open POST |
| omnient | 8 | OFF | 208.678 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 206.265 | count=0 | post-open POST | post-open POST |
| omnient | 9 | OFF | 202.203 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 200.810 | count=0 | post-open POST | post-open POST |
| omnient | 10 | OFF | 204.279 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 207.260 | count=0 | post-open POST | post-open POST |
| omnient | 11 | OFF | 208.502 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 207.061 | count=0 | post-open POST | post-open POST |
| omnient | 12 | OFF | 207.828 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 210.223 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 201.206 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 208.047 | count=0 | post-open POST | post-open POST |
| omnient | 14 | OFF | 207.958 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 210.447 | count=0 | post-open POST | post-open POST |
| omnient | 15 | OFF | 209.448 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 204.467 | count=0 | post-open POST | post-open POST |
| omnient | 16 | OFF | 203.782 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 205.525 | count=0 | post-open POST | post-open POST |
| omnient | 17 | OFF | 208.322 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 204.665 | count=0 | post-open POST | post-open POST |
| omnient | 18 | OFF | 207.121 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 207.782 | count=0 | post-open POST | post-open POST |
| omnient | 19 | OFF | 208.827 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 207.318 | count=0 | post-open POST | post-open POST |
| omnient | 20 | OFF | 204.452 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 206.170 | count=0 | post-open POST | post-open POST |
| omnient | 21 | OFF | 204.707 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 208.787 | count=0 | post-open POST | post-open POST |
| omnient | 22 | OFF | 209.867 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 203.838 | count=0 | post-open POST | post-open POST |
| omnient | 23 | OFF | 206.056 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 201.604 | count=0 | early POST | post-open POST |
| omnient | 24 | OFF | 201.146 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 208.152 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 204.674 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 200.827 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 204.754 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 205.014 | count=0 | post-open POST | post-open POST |
| omnient | 27 | OFF | 203.894 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 208.231 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 209.768 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 204.167 | count=0 | post-open POST | post-open POST |
| omnient | 29 | OFF | 207.215 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 208.008 | count=0 | post-open POST | post-open POST |
| omnient | 30 | OFF | 208.933 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 209.109 | count=0 | post-open POST | post-open POST |
| omnient | 31 | OFF | 203.304 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 208.262 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 208.769 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 207.039 | count=0 | post-open POST | post-open POST |
| omnient | 33 | OFF | 205.095 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 208.312 | count=0 | post-open POST | post-open POST |
| omnient | 34 | OFF | 201.820 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 204.621 | count=0 | post-open POST | post-open POST |
| omnient | 35 | OFF | 206.577 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 201.232 | count=0 | post-open POST | post-open POST |
| omnient | 36 | OFF | 206.825 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 208.351 | count=0 | post-open POST | post-open POST |
| omnient | 37 | OFF | 203.430 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 205.552 | count=0 | post-open POST | post-open POST |
| omnient | 38 | OFF | 202.104 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 206.835 | count=0 | post-open POST | post-open POST |
| omnient | 39 | OFF | 206.874 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 209.653 | count=0 | post-open POST | post-open POST |
| omnient | 40 | OFF | 206.382 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 206.192 | count=0 | post-open POST | post-open POST |
| omnient | 41 | OFF | 204.557 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 203.896 | count=0 | post-open POST | post-open POST |
| omnient | 42 | OFF | 204.331 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 205.144 | count=0 | post-open POST | post-open POST |
| omnient | 43 | OFF | 208.312 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 203.606 | count=0 | post-open POST | post-open POST |
| omnient | 44 | OFF | 208.871 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 204.070 | count=0 | post-open POST | post-open POST |
| omnient | 45 | OFF | 202.283 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 203.980 | count=0 | post-open POST | post-open POST |
| omnient | 46 | OFF | 207.035 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 204.796 | count=0 | post-open POST | post-open POST |
| omnient | 47 | OFF | 206.589 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 204.528 | count=0 | post-open POST | post-open POST |
| omnient | 48 | OFF | 204.877 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 208.427 | count=0 | post-open POST | post-open POST |
| omnient | 49 | OFF | 210.512 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 208.796 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 205.173 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 206.982 | count=0 | post-open POST | post-open POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 200 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 4/50 ON trials. Of those trials, 4 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 12, 25, 27, 31. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

