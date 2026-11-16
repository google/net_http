# Wi-Fi operation method and scope

The operator confirmed on 2026-11-18 (JST) that Wi-Fi switching in the current
series used the Control Center Wi-Fi button. It is recorded as a Control Center
disconnect/reconnect operation, not evidence that the Wi-Fi radio was fully
disabled in Settings. Earlier dated experiments are not retroactively assigned
a separately unconfirmed method.

Apple documents that the Control Center button disconnects from Wi-Fi networks
while keeping Wi-Fi available for some services. Completely disabling Wi-Fi
uses Settings > Wi-Fi > Off.
[Apple Support](https://support.apple.com/en-us/102412).

This documented distinction does not establish the cause of any particular
retained en0 packet. In the current RVI capture, three of five captured qualified
working-cellular handoffs show pdp_ip0 packets; two show only en0 packets for the
app PID despite cellular default-path callbacks. The first qualified idle run
preceded capture. Keep operator actions, default-path callbacks, per-request
metrics, and observed packet interfaces distinct. No operator mistake is
inferred from those differences.

The L3-down cases with mobile data disabled recorded an unsatisfied default
path. T13 additionally uses an operator-maintained cellular-only 100% loss
profile, checked by interface-bound Wi-Fi and cellular probes before groups.
These reachability observations do not certify the physical Wi-Fi radio state
or continuous packet loss on every interface.

No Settings-radio-off comparison has yet been measured in this series. If one
is added, it must be a separately labeled condition, with its own source and
packet/probe evidence; it cannot replace or relabel the existing observations.
