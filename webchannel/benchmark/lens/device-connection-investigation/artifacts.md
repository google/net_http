# Investigation artifacts

[Unified host log export](logs/failure-626-host.json) · [Export diagnostic log](logs/failure-626-host.log)

The JSON is the original filtered `/usr/bin/log show --style json` output for 2026-10-14 08:17–08:23 JST. Source processes: CoreDeviceService, usbmuxd, and xcodebuild. It retains 2451 events. Notification-observation counts were calculated deterministically from invocation UUIDs and timestamps.

[Long-sweep startup and device evidence](../2026-10-13_14-59_omnient-delay-sweep-1000pairs_JST/connection-reuse-audit.md) retains USB, CoreDevice, lock-state, DDI, and per-trial transport evidence.

[Separate-Xcode reproducer artifacts](2026-10-14_10-09_startup-reproduction/artifacts.md) · [Application-relaunch artifacts](2026-10-14_application-relaunch/artifacts.md) · [Lens cold-transport artifacts](2026-10-14_cold-relaunch-smoke/artifacts.md)
