# Relaunch protocol evidence and limits

82 resource/USB snapshots were retained; USB snapshot coverage=True; distinct USB registry IDs=[4295038643]. Snapshots are taken around each batch and about every 10 seconds during execution. They do not establish continuous hardware connectivity between samples.

Raw notification logs and process snapshots allow observation lifetime and file descriptor behavior to be compared with the separate-xcodebuild reproducer. Marker JSON retains every observed application PID. A completed validation supports the batch/relaunch protocol in this environment; it does not prove a permanent OS fix or transfer the result to HTTP/2 cold-connection measurements without a separate transport check.

## Independent verification

Raw stdout contained exactly 20 smoke markers and 1000 validation markers, with distinct application PIDs within each batch. All markers requested no networking; neither known startup error appeared in the batch logs. All executed-source hashes still matched provenance. The 1000-iteration batch retained 78 USB/process snapshots with one unchanged iPhone USB registry ID. CoreDeviceService open numeric file descriptors remained between 13 and 16. The full host capture contained two DarwinNotificationObserveActionImplementation starts, one per Xcode batch, rather than one per application iteration; replies may occur after this filtered capture ends.

[Independent verification](independent-verification.json) · [Cold transport follow-up](../2026-10-14_cold-relaunch-smoke/connection-reuse-audit.md)
