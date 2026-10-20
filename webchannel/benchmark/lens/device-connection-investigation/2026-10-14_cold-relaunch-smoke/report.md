# Cold HTTP/2 transport with application relaunch

Related benchmark: [Lens experiment specification](https://github.com/google/net_http/blob/main/webchannel/objc/demo/WebChanneliOSDemo/DESIGN.md#d-lens-latency-mimic--shutter-benchmark-mode).

Omnient, binary encoding, initial message delay 0 ms. Run OFF twice and ON twice, in separate xcodebuild batches using `-test-iterations 2 -test-repetition-relaunch-enabled YES -run-tests-until-failure`. This is a transport smoke test, not an alternating paired latency benchmark. The XCTest creates a new WebChannelService in each app process.

All four trials completed and passed verified fresh HTTP/2 TCP/TLS transport requirements. Verification reads actual URLSession metrics from exported XCTest JSON attachments; configuration flags alone are not treated as freshness evidence.
