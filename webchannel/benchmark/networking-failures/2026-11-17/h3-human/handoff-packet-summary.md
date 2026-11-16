# RVI packet interfaces during working-cellular handoffs

Final capture: 1500 packets; operator-reported kernel drops: 0. Raw capture stays local.

| Trial | Captured app packets | en0 | pdp_ip0 | All task metrics non-cellular |
| --- | ---: | ---: | ---: | --- |
| T12-T14-idle-r1 | 0 | 0 | 0 | True |
| T12-T14-idle-r2-retry2 | 177 | 66 | 111 | True |
| T12-T14-idle-r3 | 142 | 142 | 0 | True |
| T12-T14-stream-r1 | 259 | 259 | 0 | True |
| T12-T14-stream-r2 | 337 | 248 | 89 | True |
| T12-T14-stream-r3 | 379 | 267 | 112 | True |

The first idle trial has no capture because recording began afterward. Three of the five
captured qualified trials contain pdp_ip0 packets; two contain only en0 packets for the app PID.
Do not claim packet-confirmed cellular use for those two from default-path callbacks alone.
Where present, pdp_ip0 records establish actual cellular packet use even when task metrics retain
isCellular=false and the initial Wi-Fi local endpoint. Keep those observations separate.
The trace is consistent with h3 connection reuse across route changes, but encrypted
QUIC path-validation/PING frames are not decoded. See JSON for source endpoints and limits.
