# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 25.000 | 18.000 | 2404:6800:400b:c01b::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 2 | ON | completed | 400 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 3 | ON | completed | 400 | earlyPOST | h2 | true | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 4 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 18.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 5 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 6 | ON | completed | 400 | earlyPOST | h2 | true | 20.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 7 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 8 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 9 | ON | completed | 400 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 10 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 17.000 | 2404:6800:400b:c01b::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 12 | ON | completed | 200 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 13 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c01b::451 |
| omnient | 14 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 15 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 16 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 18 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 20 | ON | completed | 400 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 21 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 22 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c01b::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c01b::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 24 | ON | timeout | 200 | earlyPOST | h2 | true | 22.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c01b::451 |
| omnient | 25 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 31.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 400 | earlyPOST | h2 | true | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 400 | earlyPOST | h2 | true | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 400 | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 400 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 27.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 14.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 0.267 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 0.256 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 0.239 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 0.292 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 0.266 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 0.253 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 0.272 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 0.253 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 0.248 | count=2 | handshake POST | handshake POST |
| omnient | 32 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 0.244 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 0.238 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 0.236 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 0.240 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 0.271 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 0.240 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 0.238 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 0.241 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 0.264 | count=2 | handshake POST | handshake POST |
| omnient | 43 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 0.245 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 0.245 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 0.251 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 0.243 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 0.248 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 0.244 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 0.243 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 0 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 26/50 ON trials. Of those trials, 26 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 18, 20, 21, 22, 25, 31, 35, 36, 37, 42, 43, 46, 48, 49. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

Incomplete trials: omnient pair 24 ON.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 24550 | 14EE8025-00F7-4FD7-BC33-7ED75141EAA6 |
| 1 | ON | 2 | 24551 | D5853870-644A-4B3E-9F5D-536D5627E2C3 |
| 2 | OFF | 3 | 24552 | 2B753A66-FC43-4064-9377-46F8B2855BA3 |
| 2 | ON | 4 | 24553 | F4C08988-E43E-4380-96AD-28993B196257 |
| 3 | OFF | 5 | 24555 | E601F1B6-7D11-4620-A61F-921A08FA285E |
| 3 | ON | 6 | 24556 | AED8D6DA-1157-4954-A254-A466B7624976 |
| 4 | OFF | 7 | 24557 | 9256FD6C-B069-487E-92EE-2258320A426B |
| 4 | ON | 8 | 24558 | 8A28F6EA-9C3A-4B95-A6C4-EE98C4FBB9E8 |
| 5 | OFF | 9 | 24559 | 28CE22D6-6D00-443D-A0CE-FC82949233F6 |
| 5 | ON | 10 | 24560 | DC79192F-0BD4-491C-AA6B-00DA04116CAF |
| 6 | OFF | 11 | 24561 | 12BBF1E1-E7D9-42B2-ADB0-C3E12B13CED9 |
| 6 | ON | 12 | 24563 | A9697FA7-1EA5-4DF0-B3C1-B8DEEE90AC95 |
| 7 | OFF | 13 | 24564 | DB6E1EC7-BB0D-45CF-AE78-06FA322B79A4 |
| 7 | ON | 14 | 24565 | 34AB7CD1-E664-4063-967C-63ED3418161F |
| 8 | OFF | 15 | 24566 | 372B8708-4101-425A-978E-CBEB659C4D95 |
| 8 | ON | 16 | 24567 | D4833982-4CF1-4091-B9F5-D6C0E5EE1ED3 |
| 9 | OFF | 17 | 24568 | B6AE8517-23E9-4D32-9A2F-06D303F59EC3 |
| 9 | ON | 18 | 24569 | 41DB0156-D46B-4A2A-A4DB-01B45DB4CC2F |
| 10 | OFF | 19 | 24570 | 2AB6B8F5-9E27-4013-A8EF-1CEA67B5F251 |
| 10 | ON | 20 | 24572 | 3C1B8546-DDAD-4A7E-B4BD-12D2B9F611B1 |
| 11 | OFF | 21 | 24573 | 6417A06F-E4F9-4F94-A33A-9C37E2130EE4 |
| 11 | ON | 22 | 24574 | 39C0CCCD-2B4F-4218-BA9B-741416D17BC4 |
| 12 | OFF | 23 | 24575 | 2C5F68C2-AB9D-4E3C-B747-4844AB7CAE64 |
| 12 | ON | 24 | 24576 | 3A02DB72-0F08-4D7B-9FC5-651A3CE42B4D |
| 13 | OFF | 25 | 24577 | 3E447FF0-0B6A-44F8-A66F-AAAF798B2DC2 |
| 13 | ON | 26 | 24578 | 6B01427A-C372-46AC-95C4-53A63C04CBE7 |
| 14 | OFF | 27 | 24580 | 263DAA6F-A9FB-44B9-A98A-9AB815E88F6D |
| 14 | ON | 28 | 24581 | D8EB33F2-7078-4843-8CE9-302E61158584 |
| 15 | OFF | 29 | 24582 | 251E29E1-B8B9-4671-BC80-9F0E0720BBD9 |
| 15 | ON | 30 | 24583 | 9D37DABE-62F0-4FBE-BEF9-581506B02601 |
| 16 | OFF | 31 | 24584 | 5B9E8CA2-1B6F-4FED-89B0-A7D495B3B791 |
| 16 | ON | 32 | 24585 | 5A8C0051-922E-492D-92A4-3ACCAF0B0BF7 |
| 17 | OFF | 33 | 24586 | 9113C955-7931-4ED8-83AE-2DD4F30C5653 |
| 17 | ON | 34 | 24587 | 9AAC73F4-4F9F-4970-9845-1E9DCF1E1EF9 |
| 18 | OFF | 35 | 24588 | BB732327-E430-4FA4-945E-D1298AB0F842 |
| 18 | ON | 36 | 24590 | 1F109AB0-5CCC-4C86-A5D3-0A09B08FA136 |
| 19 | OFF | 37 | 24591 | B471A963-E4B8-4445-9692-983BA4A81F09 |
| 19 | ON | 38 | 24592 | 0447EFD6-042C-4BAC-BF83-299D5C6DF598 |
| 20 | OFF | 39 | 24593 | 49E0FF74-8618-4EB3-A4E4-87567F71ED03 |
| 20 | ON | 40 | 24594 | 451E2C64-D3A9-4C6C-B330-0300A00823AA |
| 21 | OFF | 41 | 24595 | 5F4C2E0A-3752-4AC8-B205-EBA050EF6E63 |
| 21 | ON | 42 | 24596 | 561F0407-9DE1-433D-859E-18BB4F4E2064 |
| 22 | OFF | 43 | 24597 | 7735F019-83A3-4188-A365-9256B5640313 |
| 22 | ON | 44 | 24598 | 015A43C3-1F2A-47F9-9DFD-D6E455F19111 |
| 23 | OFF | 45 | 24600 | 839B8B4C-044E-471D-BB2E-3461B1A4ADA9 |
| 23 | ON | 46 | 24601 | BB49AA50-54D8-49C8-B476-A39E7F31D184 |
| 24 | OFF | 47 | 24602 | 19D068F4-94E5-487F-9B8C-79731002A144 |
| 24 | ON | 48 | 24603 | 6A80A9DA-5037-4537-B507-A78B30BDC4A7 |
| 25 | OFF | 49 | 24610 | 434E8021-BE1F-4BC9-A0AD-A9AA6867B232 |
| 25 | ON | 50 | 24611 | 3BAD5873-4C7C-4628-B942-0788F04735C8 |
| 26 | OFF | 51 | 24612 | AC262C60-BC1A-48E6-9E2D-0D99C979DEB8 |
| 26 | ON | 52 | 24613 | 4E22748B-51D3-4B74-B379-D7D36B0D6E49 |
| 27 | OFF | 53 | 24615 | D4DB0540-A68B-4F98-B44F-63E749EDC954 |
| 27 | ON | 54 | 24616 | 30ADB2E3-DAB3-409C-AA3F-1353AEFE76B7 |
| 28 | OFF | 55 | 24617 | 493734A2-6B8A-4EAE-BC05-18B9A43C64EC |
| 28 | ON | 56 | 24618 | 9D6B454A-49EE-414E-AE7A-91944B12CC9E |
| 29 | OFF | 57 | 24619 | 03EECA20-A535-48DD-9AD8-75B732A47CA2 |
| 29 | ON | 58 | 24620 | 8C1DA6A6-E996-4AAD-95C1-5C0A2AFB6156 |
| 30 | OFF | 59 | 24621 | 96BE6E22-1CBB-4AC0-AECA-4AF005F00C5C |
| 30 | ON | 60 | 24622 | C4781331-C9D2-481A-933C-0107CF797C29 |
| 31 | OFF | 61 | 24623 | E65ABC6B-9E80-435F-AE29-F861EC2632E2 |
| 31 | ON | 62 | 24625 | 5E3C0812-7B15-4C37-9E23-7B2EDA77C1A3 |
| 32 | OFF | 63 | 24626 | 011042FB-78CE-48CF-A75E-A76357D60A00 |
| 32 | ON | 64 | 24627 | F25BDBE6-9DF0-4E08-9345-656598F500CA |
| 33 | OFF | 65 | 24628 | 26F2A153-2C16-4166-BE50-8E7A6F446722 |
| 33 | ON | 66 | 24629 | 60A804AD-A2F5-46AF-806D-66EE7E73A4DA |
| 34 | OFF | 67 | 24630 | 9F9EBFE2-5D65-439A-AE64-6801D9FA590E |
| 34 | ON | 68 | 24631 | 814D3FF2-1196-4C72-953A-C1364BC90D3E |
| 35 | OFF | 69 | 24632 | 58AE61BB-FB92-4E8C-A123-59D2C75B7791 |
| 35 | ON | 70 | 24633 | 7ED1D021-9023-4D2D-85AC-12E94F3E0903 |
| 36 | OFF | 71 | 24635 | FC7DA4BF-D8A5-4AB1-9739-25A27B94D775 |
| 36 | ON | 72 | 24636 | 4BA7D43B-45B3-4BB9-B512-637AE460C019 |
| 37 | OFF | 73 | 24637 | 26465916-7F42-4DE8-8457-D9658320A118 |
| 37 | ON | 74 | 24638 | 6A336376-CF8D-4004-9604-6B7313D92FA3 |
| 38 | OFF | 75 | 24639 | D861383C-FC12-499D-805B-DCC1A14887F1 |
| 38 | ON | 76 | 24640 | 1D40571D-7D2F-477B-8071-3DC9EEB2A1F6 |
| 39 | OFF | 77 | 24641 | E6A8AC4F-3AAC-4669-8A35-18DC1AC48F37 |
| 39 | ON | 78 | 24642 | CA9AC011-8D69-4E74-BC09-4B652BDC0C45 |
| 40 | OFF | 79 | 24644 | 671C7454-1DE4-4335-9458-3BA948CADCCE |
| 40 | ON | 80 | 24645 | 314BBAFB-DEBF-4629-84F1-18AFF586CEB3 |
| 41 | OFF | 81 | 24646 | 114E55D6-D9F0-49A3-9D30-400EFC1037AB |
| 41 | ON | 82 | 24647 | 202F6D8A-E008-4ABA-BBF5-1CAD476867B6 |
| 42 | OFF | 83 | 24648 | AAB4B61B-145C-4BE4-A40D-0D2C3B92CC7C |
| 42 | ON | 84 | 24649 | 9557D062-6DA9-4CA6-92F2-64A584139A94 |
| 43 | OFF | 85 | 24650 | 9D025691-A639-426C-9D75-C6AF6FEC411F |
| 43 | ON | 86 | 24651 | 986DF1CD-86C1-4B48-9935-D653393994FD |
| 44 | OFF | 87 | 24652 | 039D7AE9-05DB-4CD2-AB23-951A6AB50C7E |
| 44 | ON | 88 | 24654 | B1C3A3B7-FAB9-4992-98A1-A9B06F0F8739 |
| 45 | OFF | 89 | 24655 | 3184702D-3E8E-4D49-BE02-9DE20B1CBEE6 |
| 45 | ON | 90 | 24656 | 17984DDB-515A-4AE7-BD74-1926434FF916 |
| 46 | OFF | 91 | 24657 | 8E176FBC-4DC3-4718-90EB-A0E177AD576B |
| 46 | ON | 92 | 24658 | 966D244A-3791-4D23-944D-D7A3EB9A1A0C |
| 47 | OFF | 93 | 24659 | 7BB13899-F3EA-41C1-AEA4-763D2C5A5C2F |
| 47 | ON | 94 | 24660 | FFFBAB72-2BDE-48BD-A956-DC713E83BA2A |
| 48 | OFF | 95 | 24661 | 5A124844-1B90-418A-A854-33802758716A |
| 48 | ON | 96 | 24662 | 23F0B7AA-A082-4626-BCA6-A9F2BB0946C8 |
| 49 | OFF | 97 | 24664 | B024F0EA-A9DE-4E2C-9B70-1A09AEDBA96C |
| 49 | ON | 98 | 24665 | 912B53F1-31FD-439D-B419-8B7D4B09E596 |
| 50 | OFF | 99 | 24666 | E381631B-5541-4E63-B394-26464A2AD6FA |
| 50 | ON | 100 | 24667 | 1017E984-AA0B-4E20-BD70-3E44EAC19C6D |
