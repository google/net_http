# Supplementary AP latency comparison (2026-11-24)

Across three trials per AP in the current placement, the Buffalo path had
lower ICMP RTT medians and tails and no missing echo replies. The NEC path
had 18 missing replies out of 360 requests (5.0%). This is a descriptive LAN
comparison, not a measured effect on the older WebChannel results.

## Per-trial results

Order was B1 → A1 → A2 → B2 → B3 → A3. Each measured trial sends 120 echo
requests at 1 s intervals after 10 excluded warmup requests. Each later trial
also has a 30 s settling interval. The operator confirmed the AP and illuminated
screen throughout, and unchanged phone position/orientation for the AP changes.

| Order | Trial / AP | Received | Median RTT | 95th percentile | Maximum | Ping loss |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | B1 / NEC | 115/120 | 74.676 ms | 215.846 ms | 296.747 ms | 4.2% |
| 2 | A1 / Buffalo | 120/120 | 60.020 ms | 114.060 ms | 134.335 ms | 0.0% |
| 3 | A2 / Buffalo | 120/120 | 64.332 ms | 113.956 ms | 136.669 ms | 0.0% |
| 4 | B2 / NEC | 114/120 | 72.298 ms | 202.856 ms | 318.665 ms | 5.0% |
| 5 | B3 / NEC | 113/120 | 88.489 ms | 265.149 ms | 492.710 ms | 5.8% |
| 6 | A3 / Buffalo | 120/120 | 63.180 ms | 115.250 ms | 176.308 ms | 0.0% |

Across the three trials, NEC medians were 72.298–88.489 ms and 95th percentiles
202.856–265.149 ms; Buffalo medians were 60.021–64.333 ms and 95th percentiles
113.956–115.250 ms. The median of the three per-trial medians is 74.676 ms for
NEC versus 63.180 ms for Buffalo. Buffalo received all 360/360 measured replies.
The smallest observed RTTs were 3.228 ms for NEC and 2.796 ms for Buffalo; the
larger medians must not be interpreted as fixed switch-forwarding delay.

## Conditions and interpretation

Mac was wired to the central LSW5-GT-8EP/WH. Ping was bound to en6 with source
192.168.10.17; route checks before/after each trial also showed en6. The phone
used the nearby Buffalo WSR-3200AX4S-BK (192.168.10.3) or adjacent-room NEC
Aterm WX3000HP2 (192.168.10.21), as confirmed by the operator. Cellular data and
NLC were OFF. The ICMP payload was 56 bytes. Mac Wi-Fi was inactive at preflight.

The AP model, current placement, radio conditions and wired-switch path are
compared together. SSID/BSSID, frequency/channel, RSSI and household traffic
were not automatically recorded; AP/screen state relies on operator confirmation.
ICMP RTT includes phone response scheduling/power behavior. Missing ICMP replies
do not locate loss or prove the same loss rate for HTTP/3 application traffic.

In these observations, the deployed NEC path was less consistent than the
deployed Buffalo path. It is therefore unsafe to assume identical LAN behavior
solely because the NEC wired path has one fewer switch. This does not isolate
AP hardware, placement or switch count as the cause. Nor does it identify the
AP used in older runs, quantify the effect on WebChannel timers/recovery, or
explain the peer RESET_STREAM error. No statistical significance claim is made
from treating individual echo requests as independent trials.

## Evidence and exclusions

[Method](method.md), [comparison data](comparison.json),
[operator confirmations](operator-confirmations.json),
[verification tool](../analyze-ap-latency.py). Each trial directory contains the
native ping log, commands, route checks, individual RTT samples and source.
Medians and nearest-rank p95 use unique received replies; missing replies are
not replaced with invented latency values. Native RTT summaries are cross-checked.

Address/reachability checks and one failed warmup to a stale reported address
are excluded. B2 was restarted only after the operator reconfirmed the NEC
address; its [excluded warmup](excluded-B2-address-warmup/exclusion.json) is retained.
No measured high-RTT sample was discarded. All six measured trials sent 120
requests. The measurement processes have ended; no network setting was changed
by the scripts.
