# Google Lens WebChannel benchmark results

## Automated Xcode run on iPhone SE (3rd generation), 2026-10-05

The `WebChanneliOSDemoTests` XCTest target ran on a paired iPhone SE (3rd generation), iOS 26.3.1, against `https://webchannel.sandbox.google.com/staging/channel/lens`. Cellular data was OFF and Wi-Fi was ON during this device run, as reported by the tester. Each scenario used five alternating OFF/ON pairs, for 20 completed runs out of 20. The test used a 150 KB image-size metadata parameter, a 50 ms simulated detection delay, and text/JSON mode. Values below are milliseconds reported by the app. TTFA and TTFD start at the M3 send call; M4 RTT starts at the M4 send call. The 150 KB parameter did not transmit 150 KB of image bytes.

### Omnient: individual runs

|Pair|fastHandshake2|Handshake|TTFA|TTFD|M4 RTT|
|---:|---|---:|---:|---:|---:|
|1|OFF|374.8|529.8|529.9|149.4|
|1|ON|202.7|207.2|257.0|151.2|
|2|OFF|191.2|342.4|342.5|170.1|
|2|ON|186.7|199.3|249.7|164.9|
|3|OFF|190.6|340.2|340.3|155.2|
|3|ON|190.3|202.2|276.4|156.6|
|4|OFF|211.6|362.7|362.8|132.0|
|4|ON|238.8|388.7|437.5|141.1|
|5|OFF|199.5|365.7|365.8|154.6|
|5|ON|223.7|257.7|304.7|194.4|

### Omnient: summary

|Metric|OFF median|ON median|OFF mean|ON mean|
|---|---:|---:|---:|---:|
|Handshake|199.5|202.7|233.6|208.4|
|TTFA|362.7|207.2|388.2|251.0|
|TTFD|362.8|276.4|388.2|305.1|
|M4 RTT|154.6|156.6|152.3|161.6|

Median TTFA was 155.5 ms (42.9%) shorter with `fastHandshake2` ON; median TTFD was 86.4 ms (23.8%) shorter. Handshake and M4 medians were close across settings. These five pairs show an improvement for this device and network session, but they are not a general latency guarantee.

### Camera Viewfinder: individual runs

|Pair|fastHandshake2|Handshake|TTFA|TTFD|M4 RTT|
|---:|---|---:|---:|---:|---:|
|1|OFF|181.3|145.4|203.1|153.7|
|1|ON|209.1|145.4|194.7|147.0|
|2|OFF|211.4|161.1|219.5|157.3|
|2|ON|210.5|182.4|213.3|146.9|
|3|OFF|177.8|143.5|203.9|155.7|
|3|ON|205.6|146.5|197.3|149.9|
|4|OFF|268.7|181.3|230.4|144.2|
|4|ON|189.5|148.8|199.1|128.9|
|5|OFF|179.8|161.1|219.0|146.7|
|5|ON|180.9|141.9|192.1|144.1|

### Camera Viewfinder: summary

|Metric|OFF median|ON median|OFF mean|ON mean|
|---|---:|---:|---:|---:|
|Handshake|181.3|205.6|203.8|199.1|
|TTFA|161.1|146.5|158.5|153.0|
|TTFD|219.0|197.3|215.2|199.3|
|M4 RTT|153.7|146.9|151.5|143.4|

Median TTFA was 14.6 ms (9.1%) shorter with `fastHandshake2` ON, and median TTFD was 21.7 ms (9.9%) shorter. The prefetch is scheduled 500 ms after connection start, so all completed runs opened the channel before M3. The Viewfinder result differs from the 2026-10-02 manual set below, where ON had a higher TTFA median. Network conditions and the iOS version of the earlier manual runs were not recorded; the two sets should not be pooled.

### Simulator validation

The same test suite completed all 20 runs on an iPhone 17 Pro Simulator with iOS 26.5. Its median results are recorded for test verification; Simulator timings are not interchangeable with physical-device latency.

|Scenario|Metric|OFF median|ON median|
|---|---|---:|---:|
|Omnient|Handshake|260.8|229.0|
|Omnient|TTFA|413.7|331.1|
|Omnient|TTFD|413.8|382.4|
|Omnient|M4 RTT|161.2|139.6|
|Viewfinder|Handshake|282.8|273.3|
|Viewfinder|TTFA|146.0|147.7|
|Viewfinder|TTFD|193.0|225.3|
|Viewfinder|M4 RTT|147.7|141.5|

### Source and repeatability

The raw device `.xcresult` bundle and its exported JSON/CSV attachments were saved locally under `lens-automation` in this task's Codex artifacts. The JSON stores status, metrics, options, device OS, and complete app logs for each run. `xcrun xcresulttool export attachments --path <bundle.xcresult> --output-path <directory>` extracts the data from a new test run. See the [demo README](objc/demo/WebChanneliOSDemo/README.md#automated-lens-benchmark) for the exact Xcode command. Runs depend on the live staging service and current network path; repeat measurements should record those conditions.

---

## Manual device runs shared through Notes (2026-10-02)

The Omnient set contains 10 logs shared through Notes. All runs used Omnient mode, an image size parameter of 150 KB, a simulated inference delay of 50 ms, and `binary=false`. Five runs with `fastHandshake2` OFF were followed by five runs with it ON. Every run completed successfully through M4. All latency values below are measured by the app, in milliseconds.

|Start time|fastHandshake2|Handshake|TTFA|TTFD|M4 RTT|
|---|---|---:|---:|---:|---:|
|12:48:19.271|OFF|290.1|460.5|460.5|145.7|
|12:48:39.020|OFF|303.6|459.4|502.4|165.1|
|12:48:55.354|OFF|186.3|365.5|378.4|136.2|
|12:49:09.455|OFF|231.7|428.8|476.4|1234.3|
|12:49:22.905|OFF|185.5|434.6|434.7|625.3|
|12:49:41.507|ON|215.7|375.3|424.7|192.5|
|12:49:54.124|ON|254.3|409.3|455.8|218.1|
|12:50:05.275|ON|209.4|362.1|410.3|147.9|
|12:50:19.591|ON|215.3|375.6|421.2|170.0|
|12:50:30.426|ON|824.8|1255.5|1287.1|159.4|

### Omnient Summary Statistics

|Metric|OFF median|ON median|OFF mean|ON mean|
|---|---:|---:|---:|---:|
|Handshake|231.7|215.7|239.4|343.9|
|TTFA|434.6|375.6|429.8|555.6|
|TTFD|460.5|424.7|450.5|599.8|
|M4 RTT|165.1|170.0|461.3|177.6|

### Omnient Interpretation and Limitations

- Median TTFA decreased by 59.0 ms (13.6%), and median TTFD decreased by 35.8 ms (7.8%). However, the final ON run recorded a TTFA of 1255.5 ms and a TTFD of 1287.1 ms, making the ON means higher for both metrics. Five runs per configuration, performed in a fixed order, are insufficient to establish a consistent performance improvement.
- The OFF runs also include high M4 RTT values of 1234.3 ms and 625.3 ms. The logs alone do not establish the cause.
- In all five ON runs, the GET and POST requests started at the same logged time. After the connection opened, another 464 B POST was logged with the same length and displayed bytes. This suggests a retransmission, but the initial POST's HTTP status and error were not recorded, so the cause remains unconfirmed. The client includes a path that requeues messages when a request fails during connection establishment. These results do not establish that the full benefit of 0-RTT was realized.
- The ON GET requests actually include `$req=count%3D0`. This differs from the design document's statement that `$req` is omitted.
- Although the UI setting is `nonBlockingSend=false`, `fastHandshake2` enables non-blocking sends internally. The concurrent POST in ON runs is therefore consistent with the implementation.
- The 150 KB value is a metadata parameter. The M1+M3 POST in these runs was 464 B; this was not a measurement of a 150 KB image upload.
- TTFA and TTFD are measured from the M3 send call. `Forward (est)` is affected by clock differences between the device and server and was not used for the primary comparison.
- None of these 10 logs covers Viewfinder mode. The device OS version, network type, and signal conditions cannot be established from the logs.

For further Omnient validation, alternate OFF and ON runs and record the initial concurrent POST's HTTP status, error, and retransmission reason.


### Camera Viewfinder (Warm) Results

The shared folder contains 15 notes: 10 distinct completed Viewfinder runs, two partial runs, two duplicate copies of a completed run, and one link-only note. The completed runs alternate `fastHandshake2` OFF and ON, five runs each. All used a 150 KB image size parameter, a 50 ms simulated inference delay, and `binary=false`. Every completed run recorded a heartbeat ACK and finished through M4. Values are in milliseconds.

|Start time|fastHandshake2|Handshake|TTFA|TTFD|M4 RTT|
|---|---|---:|---:|---:|---:|
|13:41:33.474|OFF|210.9|240.5|273.0|154.2|
|13:41:57.410|ON|531.8|294.0|294.1|150.2|
|13:42:15.112|OFF|206.2|170.0|204.9|216.3|
|13:42:39.795|ON|208.2|163.0|201.5|200.1|
|13:42:57.647|OFF|320.9|169.2|202.4|184.9|
|13:43:15.413|ON|215.2|219.9|220.1|1024.7|
|13:43:31.615|OFF|196.0|173.3|214.6|153.5|
|13:43:46.533|ON|186.6|221.7|221.8|211.9|
|14:08:38.349|OFF|263.8|171.3|209.2|162.8|
|14:09:01.701|ON|188.3|185.6|192.1|194.8|

|Metric|OFF median|ON median|OFF mean|ON mean|
|---|---:|---:|---:|---:|
|Handshake|210.9|208.2|239.6|266.0|
|TTFA|171.3|219.9|184.9|216.8|
|TTFD|209.2|220.1|220.8|225.9|
|M4 RTT|162.8|200.1|174.3|356.3|

Median TTFA was 48.6 ms (28.4%) higher with `fastHandshake2` ON, while median TTFD was 10.9 ms (5.2%) higher. The ON group includes a 531.8 ms handshake and a 1024.7 ms M4 RTT. Five runs per setting do not establish a stable effect. M3 is sent about 500 ms after connection start, and the connection was open before M3 in every completed run. This timing limits the direct benefit that an early concurrent send could provide to the measured M3 TTFA/TTFD.

The Viewfinder M3 POST carries metadata, not 150 KB of image bytes. Device OS version and network conditions are not established by these logs. Further comparison would benefit from more alternating runs under recorded network conditions and the raw request diagnostics.

### Additional Viewfinder Logs (Partial)

Two later notes contain new runs, but both end at the M3 prefetch POST. Neither contains a prefetch ACK, preliminary detections, or M4 completion, so they are excluded from the summary statistics above.

|Start time|fastHandshake2|Handshake (ms)|Heartbeat ACK in shared text|Last recorded stage|
|---|---|---:|---|---|
|13:55:23.108|OFF|195.2|No|M3 POST started|
|13:55:41.602|ON|227.8|Yes|M3 POST started|

The ON log shows M2 sent while the channel was still connecting, followed by a heartbeat ACK after it opened. The OFF log does not include a heartbeat ACK before the text ends. These are observations about the shared excerpts, not evidence that the requests ultimately failed. Full logs through `Lens Benchmark Complete` are needed to update the latency comparison.
