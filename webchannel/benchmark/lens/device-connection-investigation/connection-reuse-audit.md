# Xcode/CoreDevice connection investigation

## Established observations

The long sweep completed blocks of 125 pairs (250 separate test invocations) before startup failures at pairs 126, 251, 376, 501, and 626. The user reported an unlocked iPhone, direct USB connection, disabled Mac screen saver, and disabled display auto-sleep.

Failure snapshots retained the iPhone in the USB registry and showed CoreDevice connected, Developer Mode enabled, and DDI services available. Lock-state queries reported passcodeRequired=false and unlockedSinceBoot=true. Xcode nevertheless reported a destination-availability timeout because observing system notifications failed. These observations do not establish a physical USB disconnection or device lock.

The new 10-pair-per-delay sweep completed all 100 trials without startup errors. This is below the recurring 250-invocation failure boundary and is not a long-run stability validation.

## Unified host logs

A host-log export covers 2026-10-14 08:17–08:23 JST around the pair-626 failures. It includes CoreDeviceService, usbmuxd, and xcodebuild messages matching notification, error, or connection. Nine distinct DarwinNotificationObserveActionImplementation invocations started in this window; 254 distinct replies appeared. Of those replies, 250 occurred together at 08:22:38–08:22:39 JST, and 245 corresponded to invocations whose starts were outside this six-minute window. CoreDeviceService then logged: “Shutting down DarwinNotificationManager: Releasing all observations.”

## Working hypothesis and limits

Accumulated notification observations or retained sessions in the development stack are a candidate explanation for the 250-invocation boundary. The clustered replies are evidence of outstanding observation lifetimes, not proof of a leak, a hard limit, or causation. The export is filtered, some fields are private, and the exact underlying error remains unidentified. DDI queries sometimes restored launch capability, but repeated DDI re-enabling did not consistently recover it; this is a workaround, not a verified fix.

The next experiment should track observation creation/completion and service/resource state before and after each test launch, reproduce beyond 250 launches, and test targeted service cleanup while verifying unchanged USB recognition. No OS-wide settings, device reboot, or service termination were performed during this initial investigation.

## Follow-up experiments

The [no-network reproducer](2026-10-14_10-09_startup-reproduction/connection-reuse-audit.md) reproduced the notification failure at invocation 251 after 250 passes. CoreDeviceService numeric descriptor counts grew from 9 to 262. Its USB collector had a documented name-parsing defect; empty USB arrays from that run cannot establish disconnection. Periodic waiting reduced descriptors but failed stability validation at iteration 401 with a socket-identifier read error.

The [application-relaunch validation](2026-10-14_application-relaunch/connection-reuse-audit.md) passed 1000 iterations in one Xcode process, with 1000 distinct application PIDs. Descriptor counts stayed 13–16, one USB registry ID remained across 78 samples, and no recovery action was required. Only one notification observation started for each of the two Xcode batches (20 and 1000 iterations).

The [Lens follow-up](2026-10-14_cold-relaunch-smoke/connection-reuse-audit.md) independently confirmed fresh h2 TCP/TLS for two OFF and two ON binary Omnient trials using app relaunch. These experiments establish an observed startup workaround and cold-transport compatibility for the smoke trials. They do not establish the exact vendor root cause or validate an alternating OFF/ON batch runner, which remains to be implemented.
