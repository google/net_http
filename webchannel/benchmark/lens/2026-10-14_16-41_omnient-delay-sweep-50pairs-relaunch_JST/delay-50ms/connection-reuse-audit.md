# Handshake transport audit

[Report](report.md) · [Artifacts](artifacts.md)

The table lists the actual handshake task, identified by its request ID. In ON trials, either the handshake GET or the concurrent early POST may create the fresh connection; the other request can reuse it within that trial.

The early POST HTTP status comes from the saved Xcode response metadata for `AID=-1`. HTTP 400 confirms rejection of that POST, but does not identify whether soft stickiness failed, requests arrived out of order, or another server-side condition caused it. OFF has no early POST.

A fresh HTTP/2 connection was verified for each trial's first transport request, not inferred from creating a new service or process. In ON trials, the early POST could create the connection first and the handshake GET could reuse it. DNS, radio, and server state may remain warm. Repeated response-metadata callbacks for one request are counted once.

Connection setup is `connectEndDate - connectStartDate` and includes the TLS handshake. TLS handshake is `secureConnectionEndDate - secureConnectionStartDate`, a portion of connection setup; do not add the two values.

| Scenario | Pair | Setting | Test status | Early POST HTTP | Cold source | Handshake protocol | Handshake reused | Connection setup (incl. TLS, ms) | TLS handshake (ms) | Remote address |
|---|---:|:---:|---|:---:|---|---|:---:|---:|---:|---|
| omnient | 1 | OFF | completed | — | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 1 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 2 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 3 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 4 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | OFF | completed | — | handshake | h2 | false | 28.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 5 | ON | completed | 200 | handshake | h2 | false | 27.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 6 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 7 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 8 | ON | completed | 200 | handshake | h2 | false | 20.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 9 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 10 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | OFF | completed | — | handshake | h2 | false | 25.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 11 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | OFF | completed | — | handshake | h2 | false | 25.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 12 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 13 | ON | completed | 200 | handshake | h2 | false | 31.000 | 20.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 14 | ON | completed | 200 | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 15 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 16 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 17 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 18 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | OFF | completed | — | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 19 | ON | completed | 200 | handshake | h2 | false | 21.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 20 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 21 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 22 | ON | completed | 400 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 23 | ON | completed | 400 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | OFF | completed | — | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 24 | ON | completed | 200 | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 25 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 26 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | OFF | completed | — | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 27 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 28 | ON | completed | 200 | handshake | h2 | false | 28.000 | 18.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | OFF | completed | — | handshake | h2 | false | 26.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 29 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | OFF | completed | — | handshake | h2 | false | 20.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 30 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 31 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | OFF | completed | — | handshake | h2 | false | 26.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 32 | ON | completed | 200 | handshake | h2 | false | 34.000 | 24.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 33 | ON | completed | 200 | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | OFF | completed | — | handshake | h2 | false | 30.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 34 | ON | completed | 200 | handshake | h2 | false | 22.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | OFF | completed | — | handshake | h2 | false | 38.000 | 26.000 | 2404:6800:400b:c019::451 |
| omnient | 35 | ON | completed | 200 | handshake | h2 | false | 23.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 36 | ON | completed | 200 | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 37 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | OFF | completed | — | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 38 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | OFF | completed | — | handshake | h2 | false | 23.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 39 | ON | completed | 200 | handshake | h2 | false | 28.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | OFF | completed | — | handshake | h2 | false | 24.000 | 16.000 | 2404:6800:400b:c019::451 |
| omnient | 40 | ON | completed | 200 | handshake | h2 | false | 24.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | OFF | completed | — | handshake | h2 | false | 27.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 41 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | OFF | completed | — | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 42 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 43 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | OFF | completed | — | handshake | h2 | false | 26.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 44 | ON | completed | 200 | handshake | h2 | false | 26.000 | 19.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | OFF | completed | — | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 45 | ON | completed | 200 | handshake | h2 | false | 22.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | OFF | completed | — | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 46 | ON | completed | 200 | handshake | h2 | false | 27.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | OFF | completed | — | handshake | h2 | false | 24.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 47 | ON | completed | 200 | handshake | h2 | false | 24.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | OFF | completed | — | handshake | h2 | false | 23.000 | 14.000 | 2404:6800:400b:c019::451 |
| omnient | 48 | ON | completed | 200 | handshake | h2 | false | 22.000 | 13.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | OFF | completed | — | handshake | h2 | false | 24.000 | 17.000 | 2404:6800:400b:c019::451 |
| omnient | 49 | ON | completed | 200 | handshake | h2 | false | 25.000 | 15.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | OFF | completed | — | handshake | h2 | false | 31.000 | 22.000 | 2404:6800:400b:c019::451 |
| omnient | 50 | ON | completed | 200 | handshake | h2 | false | 25.000 | 14.000 | 2404:6800:400b:c019::451 |

## M1 and M3 dispatch

The handshake payload column is the request's encoded `count`. `count=0` means neither M1 nor M3 was in the handshake request itself. `early POST` means the first request containing that message was an `AID=-1` POST logged before WebChannel opened, concurrent with the handshake; it does not prove server arrival order or acceptance. `post-open POST` means its first request was logged after the channel opened.

M1 is message offset 0. The demo sends M3 at offset 1 in Omnient and offset 2 in Viewfinder (after M2 Heartbeat). Request body prefixes expose `count` and `ofs`, which identify the first HTTP request containing each queued message. A rejected early POST may be retried after opening; the table records the first dispatch.

The observed M1 delay is measured from the client connect timestamp to the M1 `send()` call; scheduling can vary slightly from the requested delay.

| Scenario | Pair | Setting | M1 after connect (ms) | Handshake payload | M1 first request | M3 first request |
|---|---:|:---:|---:|:---:|---|---|
| omnient | 1 | OFF | 52.833 | count=0 | post-open POST | post-open POST |
| omnient | 1 | ON | 51.572 | count=0 | early POST | early POST |
| omnient | 2 | OFF | 51.340 | count=0 | post-open POST | post-open POST |
| omnient | 2 | ON | 52.277 | count=0 | early POST | early POST |
| omnient | 3 | OFF | 51.589 | count=0 | post-open POST | post-open POST |
| omnient | 3 | ON | 52.309 | count=0 | early POST | early POST |
| omnient | 4 | OFF | 52.305 | count=0 | post-open POST | post-open POST |
| omnient | 4 | ON | 52.861 | count=0 | early POST | early POST |
| omnient | 5 | OFF | 51.662 | count=0 | post-open POST | post-open POST |
| omnient | 5 | ON | 52.787 | count=0 | early POST | early POST |
| omnient | 6 | OFF | 50.611 | count=0 | post-open POST | post-open POST |
| omnient | 6 | ON | 52.907 | count=0 | early POST | early POST |
| omnient | 7 | OFF | 51.250 | count=0 | post-open POST | post-open POST |
| omnient | 7 | ON | 50.713 | count=0 | early POST | early POST |
| omnient | 8 | OFF | 50.627 | count=0 | post-open POST | post-open POST |
| omnient | 8 | ON | 53.035 | count=0 | early POST | early POST |
| omnient | 9 | OFF | 55.051 | count=0 | post-open POST | post-open POST |
| omnient | 9 | ON | 53.028 | count=0 | early POST | early POST |
| omnient | 10 | OFF | 50.778 | count=0 | post-open POST | post-open POST |
| omnient | 10 | ON | 52.917 | count=0 | early POST | early POST |
| omnient | 11 | OFF | 52.863 | count=0 | post-open POST | post-open POST |
| omnient | 11 | ON | 51.204 | count=0 | early POST | early POST |
| omnient | 12 | OFF | 52.885 | count=0 | post-open POST | post-open POST |
| omnient | 12 | ON | 51.527 | count=0 | early POST | early POST |
| omnient | 13 | OFF | 52.181 | count=0 | post-open POST | post-open POST |
| omnient | 13 | ON | 52.866 | count=0 | early POST | early POST |
| omnient | 14 | OFF | 50.496 | count=0 | post-open POST | post-open POST |
| omnient | 14 | ON | 52.122 | count=0 | early POST | early POST |
| omnient | 15 | OFF | 52.849 | count=0 | post-open POST | post-open POST |
| omnient | 15 | ON | 52.846 | count=0 | early POST | early POST |
| omnient | 16 | OFF | 52.322 | count=0 | post-open POST | post-open POST |
| omnient | 16 | ON | 52.646 | count=0 | early POST | early POST |
| omnient | 17 | OFF | 50.469 | count=0 | post-open POST | post-open POST |
| omnient | 17 | ON | 51.577 | count=0 | early POST | early POST |
| omnient | 18 | OFF | 51.945 | count=0 | post-open POST | post-open POST |
| omnient | 18 | ON | 53.033 | count=0 | early POST | early POST |
| omnient | 19 | OFF | 50.900 | count=0 | post-open POST | post-open POST |
| omnient | 19 | ON | 51.364 | count=0 | early POST | early POST |
| omnient | 20 | OFF | 52.806 | count=0 | post-open POST | post-open POST |
| omnient | 20 | ON | 52.245 | count=0 | early POST | early POST |
| omnient | 21 | OFF | 52.072 | count=0 | post-open POST | post-open POST |
| omnient | 21 | ON | 53.044 | count=0 | early POST | early POST |
| omnient | 22 | OFF | 52.169 | count=0 | post-open POST | post-open POST |
| omnient | 22 | ON | 53.044 | count=0 | early POST | early POST |
| omnient | 23 | OFF | 51.543 | count=0 | post-open POST | post-open POST |
| omnient | 23 | ON | 51.181 | count=0 | early POST | early POST |
| omnient | 24 | OFF | 52.850 | count=0 | post-open POST | post-open POST |
| omnient | 24 | ON | 52.616 | count=0 | early POST | early POST |
| omnient | 25 | OFF | 51.381 | count=0 | post-open POST | post-open POST |
| omnient | 25 | ON | 51.740 | count=0 | early POST | early POST |
| omnient | 26 | OFF | 51.624 | count=0 | post-open POST | post-open POST |
| omnient | 26 | ON | 51.690 | count=0 | early POST | early POST |
| omnient | 27 | OFF | 52.081 | count=0 | post-open POST | post-open POST |
| omnient | 27 | ON | 52.835 | count=0 | early POST | early POST |
| omnient | 28 | OFF | 53.040 | count=0 | post-open POST | post-open POST |
| omnient | 28 | ON | 52.986 | count=0 | early POST | early POST |
| omnient | 29 | OFF | 52.159 | count=0 | post-open POST | post-open POST |
| omnient | 29 | ON | 50.912 | count=0 | early POST | early POST |
| omnient | 30 | OFF | 51.638 | count=0 | post-open POST | post-open POST |
| omnient | 30 | ON | 51.586 | count=0 | early POST | early POST |
| omnient | 31 | OFF | 51.591 | count=0 | post-open POST | post-open POST |
| omnient | 31 | ON | 52.202 | count=0 | early POST | early POST |
| omnient | 32 | OFF | 52.877 | count=0 | post-open POST | post-open POST |
| omnient | 32 | ON | 52.895 | count=0 | early POST | early POST |
| omnient | 33 | OFF | 52.838 | count=0 | post-open POST | post-open POST |
| omnient | 33 | ON | 52.714 | count=0 | early POST | early POST |
| omnient | 34 | OFF | 53.037 | count=0 | post-open POST | post-open POST |
| omnient | 34 | ON | 52.847 | count=0 | early POST | early POST |
| omnient | 35 | OFF | 52.228 | count=0 | post-open POST | post-open POST |
| omnient | 35 | ON | 50.741 | count=0 | early POST | early POST |
| omnient | 36 | OFF | 51.598 | count=0 | post-open POST | post-open POST |
| omnient | 36 | ON | 50.824 | count=0 | early POST | early POST |
| omnient | 37 | OFF | 52.800 | count=0 | post-open POST | post-open POST |
| omnient | 37 | ON | 52.927 | count=0 | early POST | early POST |
| omnient | 38 | OFF | 52.924 | count=0 | post-open POST | post-open POST |
| omnient | 38 | ON | 51.225 | count=0 | early POST | early POST |
| omnient | 39 | OFF | 51.516 | count=0 | post-open POST | post-open POST |
| omnient | 39 | ON | 50.750 | count=0 | early POST | early POST |
| omnient | 40 | OFF | 52.856 | count=0 | post-open POST | post-open POST |
| omnient | 40 | ON | 51.850 | count=0 | early POST | early POST |
| omnient | 41 | OFF | 50.795 | count=0 | post-open POST | post-open POST |
| omnient | 41 | ON | 50.815 | count=0 | early POST | early POST |
| omnient | 42 | OFF | 52.855 | count=0 | post-open POST | post-open POST |
| omnient | 42 | ON | 52.101 | count=0 | early POST | early POST |
| omnient | 43 | OFF | 51.412 | count=0 | post-open POST | post-open POST |
| omnient | 43 | ON | 50.515 | count=0 | early POST | early POST |
| omnient | 44 | OFF | 52.844 | count=0 | post-open POST | post-open POST |
| omnient | 44 | ON | 52.885 | count=0 | early POST | early POST |
| omnient | 45 | OFF | 50.664 | count=0 | post-open POST | post-open POST |
| omnient | 45 | ON | 51.233 | count=0 | early POST | early POST |
| omnient | 46 | OFF | 51.709 | count=0 | post-open POST | post-open POST |
| omnient | 46 | ON | 52.022 | count=0 | early POST | early POST |
| omnient | 47 | OFF | 52.319 | count=0 | post-open POST | post-open POST |
| omnient | 47 | ON | 50.329 | count=0 | early POST | early POST |
| omnient | 48 | OFF | 50.737 | count=0 | post-open POST | post-open POST |
| omnient | 48 | ON | 52.861 | count=0 | early POST | early POST |
| omnient | 49 | OFF | 52.675 | count=0 | post-open POST | post-open POST |
| omnient | 49 | ON | 50.837 | count=0 | early POST | early POST |
| omnient | 50 | OFF | 53.046 | count=0 | post-open POST | post-open POST |
| omnient | 50 | ON | 52.031 | count=0 | early POST | early POST |

## Observations and limits

Omnient sends M3 immediately after M1, scheduled 50 ms after connect() returns. Fresh connection verification is to the reached edge, not a cold DNS lookup or cold backend application state.

The initial early POST returned HTTP 400 in 2/50 ON trials. Of those trials, 2 completed; inspect the logs to distinguish successful retries from incomplete runs.

The Xcode logs contain retry diagnostics in ON trials for omnient pairs 22, 23. Those retries can affect TTFA and TTFD; the raw logs should be consulted before attributing a timing difference solely to the handshake option.


## Application-process and batch identity

Each stdout marker and original XCTest JSON/CSV is associated using the explicit batch ordinal and XCTest export repetition number. A distinct process-instance UUID and changing adjacent application PIDs verify application relaunch. Separate applications still require actual fresh-transport metrics; relaunch flags alone are not used as transport evidence.

| Pair | Setting | Batch ordinal | Application PID | Process instance |
|---:|---|---:|---:|---|
| 1 | OFF | 1 | 24669 | 47595539-4CE7-4184-A75C-B40C18E2A690 |
| 1 | ON | 2 | 24670 | AF0368FA-C96F-448E-8F92-D6DB786DB22B |
| 2 | OFF | 3 | 24671 | 0102B57B-CCCC-4331-92CF-1AC147B95EC3 |
| 2 | ON | 4 | 24672 | 263F7013-29AC-436E-AD97-6B970699AFA7 |
| 3 | OFF | 5 | 24673 | FE2540CA-F11C-4AC8-8DE6-65AE582E8D88 |
| 3 | ON | 6 | 24674 | BCE101AB-1B8F-4EE1-8E80-8460E08DCA26 |
| 4 | OFF | 7 | 24675 | F6B23831-2225-47E9-8E4A-7611E4F26EA7 |
| 4 | ON | 8 | 24677 | 0D58C330-2E81-4812-B29D-7B3140B3B6DA |
| 5 | OFF | 9 | 24678 | 010007AD-9791-4579-8356-FDBB42506D4E |
| 5 | ON | 10 | 24679 | 7923FAE9-B1F2-46D5-9D8E-FF6426769243 |
| 6 | OFF | 11 | 24681 | 88EC25AC-848F-4168-A4FD-99D1AE578119 |
| 6 | ON | 12 | 24682 | 107B58F1-438B-4A76-99B4-D6EDE37D1B4B |
| 7 | OFF | 13 | 24683 | 3A1D1D08-3F0A-4E5D-8CDA-3BE0BEEAC1B0 |
| 7 | ON | 14 | 24684 | 0F353FC8-EB66-4086-93A1-518FC1A13DD3 |
| 8 | OFF | 15 | 24685 | AE9B9C9F-CA86-4E49-9F6A-F3E968BA6EB5 |
| 8 | ON | 16 | 24686 | 407B9269-AAE8-4580-96EB-A9F7C1F1AE39 |
| 9 | OFF | 17 | 24688 | 327BDF4F-40D2-404A-B4AD-D8B445DB67EC |
| 9 | ON | 18 | 24689 | 22115592-14E7-4F5A-A7CF-06528B9CEF89 |
| 10 | OFF | 19 | 24690 | F06CAE3D-4317-4442-BEFA-26A0A063021C |
| 10 | ON | 20 | 24691 | 070A1DB4-7605-4060-9246-20878B61042E |
| 11 | OFF | 21 | 24692 | 9D21185A-C1CB-405D-A5B3-D338C92258E7 |
| 11 | ON | 22 | 24693 | EEE1731D-0DD6-4CDC-9F5F-C299404ED5CE |
| 12 | OFF | 23 | 24694 | EE2FF5BE-BA04-4F42-BCAD-249C4A5722E9 |
| 12 | ON | 24 | 24695 | 5FC8417C-0AB8-4D23-A7F1-5D0CB822626E |
| 13 | OFF | 25 | 24697 | D7CD0B49-172C-4FB4-A484-60FED1D43932 |
| 13 | ON | 26 | 24698 | E6A6A2BD-FA36-4A3F-B3DA-D4DA0BE7F1D2 |
| 14 | OFF | 27 | 24699 | F69695FF-0853-4E49-BC58-C1BB80596F75 |
| 14 | ON | 28 | 24700 | 6D295768-D142-47E8-A121-6CABED61C951 |
| 15 | OFF | 29 | 24701 | B6F9A2F7-4217-4238-84A0-B85B65BBF13B |
| 15 | ON | 30 | 24702 | F9CE7176-EE59-45D3-8A2A-879383E72E72 |
| 16 | OFF | 31 | 24703 | EF881272-4E6C-4C5A-805A-87A07DEB2114 |
| 16 | ON | 32 | 24704 | 90B60C66-1CBC-4B4B-BBA7-7B266EB13BA8 |
| 17 | OFF | 33 | 24705 | A717FB4C-8F7A-4C7D-B299-F2690B1DF613 |
| 17 | ON | 34 | 24707 | B18F22F0-0CCC-42ED-B692-4363A66CF05E |
| 18 | OFF | 35 | 24708 | DF672448-F12B-43F0-942C-6E6934883C40 |
| 18 | ON | 36 | 24709 | 17C19B64-2FC2-4DC9-B64F-CE3FAC02AE26 |
| 19 | OFF | 37 | 24710 | 7C691AFF-CD6C-48A2-A1F4-32F7D737C9CE |
| 19 | ON | 38 | 24711 | 929368D9-0881-4F66-A5B6-03E4AD98B732 |
| 20 | OFF | 39 | 24712 | 0AF5F167-67CB-444E-BD25-E10CBD94E3EA |
| 20 | ON | 40 | 24713 | C22B7D81-02AE-4BDB-B340-990AD2EFBC76 |
| 21 | OFF | 41 | 24714 | E6E41C5B-3761-4865-81DA-46E7744D8015 |
| 21 | ON | 42 | 24715 | 4812D289-62CD-499F-BE70-104CE1CD825B |
| 22 | OFF | 43 | 24717 | 837F68D2-F54D-4DA5-8F04-A19242516823 |
| 22 | ON | 44 | 24718 | F07EC300-D052-4A81-ACF6-BF187E9B6DC6 |
| 23 | OFF | 45 | 24719 | 3D2E9168-BFA4-4161-87BB-6FFF9FF0426B |
| 23 | ON | 46 | 24720 | BF92A06A-B68D-4796-BFA3-761466CEDEA3 |
| 24 | OFF | 47 | 24721 | 102B58B1-F800-4C7A-A145-DF9FAEBD39AD |
| 24 | ON | 48 | 24722 | AD21F430-AC86-4C26-86AB-FB14D41BDEA9 |
| 25 | OFF | 49 | 24723 | 38F104BC-3E12-40A0-831A-15C95A53168A |
| 25 | ON | 50 | 24724 | 3CD2D47C-54DC-494C-BC0D-40E6425F878A |
| 26 | OFF | 51 | 24726 | C551D5A1-BC3E-4159-B9C0-3760758008B7 |
| 26 | ON | 52 | 24727 | 211DB31A-138B-4577-8018-A3EB84B81C3A |
| 27 | OFF | 53 | 24728 | 130CC93A-34D7-4A69-987F-EF6F6795DFAB |
| 27 | ON | 54 | 24729 | E07DAA6D-4B4E-4767-80DB-DD66AA3C127B |
| 28 | OFF | 55 | 24730 | 7A9CD67C-DF1D-4C73-951A-89DD551961D5 |
| 28 | ON | 56 | 24731 | 94D4BF4A-F3AC-43B7-8165-F864435EB7ED |
| 29 | OFF | 57 | 24732 | 04740F4E-33D8-479E-BF4F-AAEA7E8D6BC3 |
| 29 | ON | 58 | 24733 | 15D04084-FF3C-4C82-83FC-E429B1E1503D |
| 30 | OFF | 59 | 24735 | B0658F27-DBDF-4847-BBAD-D96D8E408E7C |
| 30 | ON | 60 | 24736 | FC6BC42E-643A-43F8-8168-4F4572CE77D1 |
| 31 | OFF | 61 | 24737 | 2D212FDE-E652-4CE2-AA8A-CED1F8166F5B |
| 31 | ON | 62 | 24738 | 2BA1B4BC-8ACA-4C97-B6F6-65CF54A9DE99 |
| 32 | OFF | 63 | 24739 | 6935F553-7E1B-47D1-90BD-8C0907F80BAE |
| 32 | ON | 64 | 24740 | 2CAC9C5A-A8DE-429B-BC70-614207FAA125 |
| 33 | OFF | 65 | 24741 | 20D59D1D-DDE4-406C-B26F-4F04CE2CB2AF |
| 33 | ON | 66 | 24742 | D605F62A-3D73-45C1-96DA-E633104F24C4 |
| 34 | OFF | 67 | 24743 | F706275D-A28A-4AFE-B649-ECEC76384B8E |
| 34 | ON | 68 | 24745 | 4A36AEF2-3A56-4D27-99BE-8954D6F94847 |
| 35 | OFF | 69 | 24746 | 2077F6D8-F782-47C0-97F7-CEF615E8746D |
| 35 | ON | 70 | 24747 | B490D001-B842-48EA-BFDD-74B41E15D817 |
| 36 | OFF | 71 | 24748 | C4D4527C-46BF-48D5-82EF-EC16A51C8FC2 |
| 36 | ON | 72 | 24749 | 2E785C4C-5243-4785-B816-B0EF26C90886 |
| 37 | OFF | 73 | 24750 | ACA015D5-0C48-4D48-8328-7CED8DC9C954 |
| 37 | ON | 74 | 24751 | 6EBAAFDA-730A-487D-A4AF-9A934A46CE45 |
| 38 | OFF | 75 | 24752 | 15FBC5E3-1746-463E-A8AA-4C6AE388C44F |
| 38 | ON | 76 | 24753 | C0E98880-9444-4CD2-AF11-D1038014995E |
| 39 | OFF | 77 | 24755 | D5A3745B-1B28-4B60-B421-6B42D9EBF7B0 |
| 39 | ON | 78 | 24756 | 86EFA847-6B2F-4A35-8C79-6ECBFBEA3178 |
| 40 | OFF | 79 | 24757 | 276E9D9D-BE12-4251-89FF-98D2BF028DDF |
| 40 | ON | 80 | 24758 | 47B907F7-AD11-4756-9CED-5884240E148D |
| 41 | OFF | 81 | 24759 | 0D7F736F-0A33-45A5-8710-D369432ADD25 |
| 41 | ON | 82 | 24760 | FD863CCE-0D5A-423A-AB00-D89FA7237298 |
| 42 | OFF | 83 | 24761 | B0B71DB8-87ED-431A-8AD4-AE0EF360EE4A |
| 42 | ON | 84 | 24762 | 7DC43FCB-EAFB-4A79-8617-CCE0DF5E613D |
| 43 | OFF | 85 | 24764 | E3750F3B-AD11-4021-8919-20F1A3DA39F7 |
| 43 | ON | 86 | 24765 | A16222DE-5EF2-4A02-8616-510DA8B7B472 |
| 44 | OFF | 87 | 24766 | E0A45731-EDC4-482C-9B46-03CB3DD19593 |
| 44 | ON | 88 | 24767 | 5D6C6486-15C5-41F8-BB8C-E1BBC51D4E3C |
| 45 | OFF | 89 | 24768 | 626B6018-4770-4619-B503-9E38EF6BA1AC |
| 45 | ON | 90 | 24769 | 5526491F-B90E-47F7-BC43-924669DA881B |
| 46 | OFF | 91 | 24770 | D452A8F7-AEE7-42E5-BBAE-99C2DAE54FC6 |
| 46 | ON | 92 | 24771 | CA6C1E34-F9D9-47FB-BD66-48AF2073AA9D |
| 47 | OFF | 93 | 24772 | FCE8E8AD-E34B-4E90-9476-378B7B84A28E |
| 47 | ON | 94 | 24774 | 93CC4FB1-FE31-45D6-9622-43866C9C8BBE |
| 48 | OFF | 95 | 24775 | 5E5C8101-393B-4747-88BE-B8CC5726F5C8 |
| 48 | ON | 96 | 24776 | B2B1CB5F-6B7E-4191-B9AB-C0E95A757A68 |
| 49 | OFF | 97 | 24777 | 1F2B7518-306F-44E1-9585-FD31F53B8543 |
| 49 | ON | 98 | 24778 | FC99E09A-654C-4625-A5FC-94DA94495B68 |
| 50 | OFF | 99 | 24779 | B442C80B-11C0-456C-A895-2F99F27FC5CA |
| 50 | ON | 100 | 24780 | 16C68151-5C7F-438E-A05D-91DD045DE23E |
