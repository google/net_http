# Current-placement AP latency comparison

The operator asked for a supplementary comparison after discovering that the
selected AP had not been controlled during the earlier WebChannel experiments.
This measures **LAN ICMP round-trip time**, including the iPhone's response
schedule. It is not a WebChannel/HTTP/3 response-time measurement.

## Conditions

- Same iPhone, experimental position and orientation; operator asked to keep
  the same screen displayed and illuminated throughout each trial.
- Cellular data OFF, Network Link Conditioner OFF (operator confirmed).
- Mac wired to the central Buffalo LSW5-GT-8EP/WH (operator confirmed).
  The active wired interface was en6, 1000baseT full duplex; Mac Wi-Fi was
  inactive at preflight.
- macOS ping bound to en6 and source 192.168.10.17. Per-trial route lookups
  before and after measurement must also show en6.
- 56-byte ICMP payload, numeric IPv4 destination, one echo request per second.
  Ten warmup requests precede each 120-request measurement and are excluded.
- Intended AP order: NEC B1 → Buffalo A1/A2 → NEC B2/B3 → Buffalo A3.
  Later trials have an explicit 30 s settling interval before warmup. B1 was
  already associated with NEC; its prior association duration was not timed.
- AP selection and screen/placement are operator-reported. Ping cannot identify
  the associated SSID/BSSID or frequency band; those were not automatically
  recorded. Destination IP alone does not identify an AP.

This compares the deployed paths as a whole: the nearby Buffalo WSR-3200AX4S-BK
via LSW6-GT-8NS and the central switch, versus the adjacent-room NEC Aterm
WX3000HP2 via the central switch. AP model, placement, radio conditions and
switching path are not separated. The targets are on the Mac's directly
connected LAN; the Internet/ISP path is not the subject of this test.

## Analysis

Keep each trial's native ping log, command, route checks, individual RTT samples
and result. Median and nearest-rank 95th percentile use unique received echo
sequences; native transmitted/received counts and loss are retained separately.
No timeout is imputed as a latency value. Native summary statistics and parsed
samples are checked independently by [the analyzer](../analyze-ap-latency.py).

Compare per-trial distributions and variation, rather than treating all echo
requests as independent replications. Three trials per AP are descriptive
repeat measurements, not a statistical proof of AP-model performance. The
phone's ICMP scheduling/power state and unmeasured household traffic can affect
RTT. A small measured difference would not identify the AP used in older runs,
and a large difference would not by itself explain the older SDK failures.

Reachability checks and the failed warmup to a stale reported address are not
included in the measured-trial counts or AP loss statistics. Raw measurements
are retained; no high-RTT samples are removed as outliers.
