# Startup investigation evidence and limits

Filtered notification stream: 653 distinct observation starts, 652 distinct replies, and 1 starts without a reply in this capture. These counts alone do not prove a leak or causation.

Per-invocation snapshots retain USB registry identity, CoreDevice JSON, current-user CoreDeviceService PID/RSS/open numeric file descriptors, and usbmuxd PID/RSS. CoreDeviceService termination uses SIGTERM only and is restricted to the current user's exact service executable name. The iPhone is not rebooted, Developer Mode is not disabled, and USB is not physically reconnected.

The test body makes no network request; the host app still loads its ordinary UI and linked frameworks. Passing this test does not prove the absence of unrelated system networking. Partial or failed validation must not be described as a solved connection problem.

## Collector correction and resource observations

The USB collector in this run did not recognize the name-only `iPhone` node in the IOUSB plist. All usbIPhones arrays are empty; they must not be interpreted as USB disconnection, and this run cannot independently establish USB registry continuity. The corrected collector uses IOUSBHostDevice properties and refuses to proceed without a matching iPhone. The original runner source is retained under source-snapshots/ and matches the frozen runner SHA-256.

CoreDeviceService PID 2877 remained unchanged. Before baseline invocations 1/50/100/150/200/250/251, open numeric file descriptors were 9/61/111/161/211/261/262. This is evidence of per-invocation resource retention. Before validation 1/101/201/301/401, after 60-second waits, the count was 9. Validation 401 still failed before test entry with an incomplete socket-identifier read (0 of 16 bytes), so periodic waiting did not establish stable operation. The notification failure reproduced without WebChannel networking; root-cause ownership remains unproven.
