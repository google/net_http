# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 234.000 | 226.000 | 2404:6800:400b:c015::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 2 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 3 | ON | completed | 400 | handshake | h2 | false | 426.000 | 25.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 5 | ON | completed | 400 | earlyPOST | h2 | true | 35.000 | 24.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 7 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 9 | ON | completed | 200 | earlyPOST | h2 | true | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 23.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 10 | ON | completed | 200 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 12 | ON | completed | 200 | earlyPOST | h2 | true | 26.000 | 17.000 | 192.178.226.81 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 13 | ON | completed | 400 | earlyPOST | h2 | true | 20.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 14 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 16 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 89.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 17 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 18 | ON | completed | 400 | earlyPOST | h2 | true | 28.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 19 | ON | completed | 400 | earlyPOST | h2 | true | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 178.000 | 24.000 | 2404:6800:400b:c015::451 |
| omnient | 20 | ON | completed | 400 | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 21 | ON | completed | 400 | handshake | h2 | false | 334.000 | 26.000 | 192.178.226.81 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 22 | ON | completed | 400 | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c015::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 23 | ON | completed | 200 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c015::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 24 | ON | completed | 400 | earlyPOST | h2 | true | 24.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 25 | ON | completed | 400 | earlyPOST | h2 | true | 23.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 26 | ON | completed | 400 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 144.000 | 134.000 | 2404:6800:400b:c015::451 |
| omnient | 27 | ON | completed | 400 | earlyPOST | h2 | true | 21.000 | 13.000 | 2404:6800:400b:c015::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c015::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 29 | ON | completed | 400 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c015::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c015::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 31 | ON | completed | 200 | earlyPOST | h2 | true | 20.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 32 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 33 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 24.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 34 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 35 | ON | completed | 400 | handshake | h2 | false | 29.000 | 19.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 37 | ON | completed | 400 | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 33.000 | 23.000 | 2404:6800:400b:c017::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 26.000 | 18.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 39 | ON | completed | 200 | earlyPOST | h2 | true | 43.000 | 32.000 | 2404:6800:400b:c017::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 172.217.221.81 |
| omnient | 40 | ON | completed | 400 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 41 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 42 | ON | completed | 400 | earlyPOST | h2 | true | 34.000 | 25.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c017::451 |
| omnient | 43 | ON | completed | 400 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 44 | ON | completed | 400 | earlyPOST | h2 | true | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 26.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 47 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 48 | ON | completed | 400 | earlyPOST | h2 | true | 27.000 | 15.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 49 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c017::451 |
| omnient | 50 | ON | completed | 200 | earlyPOST | h2 | true | 23.000 | 13.000 | 2404:6800:400b:c017::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 0.272 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 0.268 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 0.267 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 0.264 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 0.270 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 0.263 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 0.270 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 0.276 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 0.261 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 0.265 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 0.277 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 0.263 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 0.271 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 0.268 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 0.257 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 0.266 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 0.254 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 1.016 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 0.266 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 0.266 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 0.262 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 0.277 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 0.261 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 0.252 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 0.247 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 0.254 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 0.268 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 0.265 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 0.260 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 0.242 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 0.289 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 0.264 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 0.258 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 0.258 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 0.276 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 0.271 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 0.250 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 0.251 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 0.273 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 0.262 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 0.259 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 0.255 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 0.260 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 0.249 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 0.270 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 0.265 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 0.247 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 0.242 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 0.246 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 0.246 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 0.237 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 0.241 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 0.255 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 0.243 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 0.248 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 0.268 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 0.250 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 0.252 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 0.259 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 0.256 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 0.249 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 0.250 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 0 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 29/50 ON trials. Of those trials, 29 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 2, 3, 5, 13, 14, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 29, 32, 33, 34, 35, 37, 40, 41, 42, 43, 44, 47, 48. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.

