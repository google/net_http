# iOS WebChannel networking failure tests (current client behavior)

This spec defines tests and measurements for the current Objective-C WebChannel
client on iOS (`webchannel/objc`) under network failures. It covers client-side
behavior only. It needs no client or server changes: run it against the code on
`main` and the hosted staging endpoint.

The results confirm (or correct) the expected behavior below. They are an input
to planned client changes that follow the principles in
[networking-failures.md](networking-failures.md).

## 1. Setup

- **Device:** a physical iPhone (iOS 17+). Simulator results don't count, because
  the simulator uses the Mac's network stack. Record the iOS version, device model,
  Wi-Fi network and cellular carrier.
- **App:** the demo app in
  [`webchannel/objc/demo/WebChanneliOSDemo`](../objc/demo/WebChanneliOSDemo/README.md),
  built from `main`.
- **Endpoint:** the hosted staging generator endpoint, the app's default:
  `https://webchannel.sandbox.google.com/staging/channel/generator`.
- **Options:** the defaults (all `WCOptions` toggles off), unless a test says
  otherwise. In particular, `failFast` is off.
- **Repetitions:** at least 3 runs per test. Report each run, not only the average.

## 2. Fault injection

| Fault | How |
| --- | --- |
| Blackhole (silent loss; the interface stays up) | Network Link Conditioner on the device (Settings > Developer), with a custom profile of 100% loss in both directions. Alternatively, drop all traffic for the device on the Wi-Fi router or access point. Record the start time and duration of each fault. |
| L3 down (no network) | Airplane mode, or Wi-Fi off with cellular data disabled for the app |
| L3 up | Undo the above. Record the time. |
| Wi-Fi → cellular | Turn Wi-Fi off, or walk out of range, with cellular data on |
| Cellular → Wi-Fi | Turn Wi-Fi on, or come into range, while on cellular |
| Wi-Fi → cellular with broken cellular | Cellular shows as available but carries no traffic, e.g. with a Network Link Conditioner profile on cellular |
| App suspension | Send the app to the background and wait until iOS suspends it, then bring it back after X seconds. Don't use the Xcode debugger's pause; it doesn't suspend the app the way iOS does. |

Start each fault after the channel is open, unless the test says "during the
handshake".

## 3. Traffic patterns

| Pattern | How (demo app, Generator tab) |
| --- | --- |
| Idle stream | Connect and send nothing. The server sends only keep-alive noops. |
| Server streaming | Start the streaming generator with many messages and a short interval (e.g. `num_messages` 1000, `message_interval` 1000 ms) |
| Client pending writes | Send a message right after the fault starts. Variant for M5: send one message every 5 s for the whole test. |

## 4. What to record

For every run, record:

- **Request timeline:** for every WebChannel request (handshake, forward POST,
  back-channel GET), the start time, first byte, completion, timeout, and retry
  attempt.
  - The demo app's `TestAppLogger` (a `WCLogger`) already logs each request with its
    attempt number and the response status. Add timestamps.
  - Back-channel GETs carry `RID=rpc`. Forward POSTs carry a numeric `RID`.
- **Channel events:** open, close and error times. Record the error code
  (`WCWebChannelClientError`), the last HTTP status, and the underlying `NSError`
  domain and code where available (e.g. `-1009`, `-1005`).
- **Message delivery:** non-acked messages reported at close (count). Check that
  server messages delivered after a recovery have no gaps or duplicates.
- **Transport metrics:** `URLSessionTaskMetrics` per transaction:
  - `networkProtocolName`;
  - `isReusedConnection`;
  - `isCellular`;
  - local and remote address.

  They are available through `WCDefaultSupport.taskMetricsHandler`.
- **Path changes:** an `NWPathMonitor` trace in the app: status, interface type and
  the time of each update.
- **WebChannel events:** `kWCEventNotificationName` notifications (handshake RTT).
- **Optional:** a packet capture (`rvictl` + Wireshark) for M4 and M6.

## 5. Current client parameters (expected values)

| Parameter | Value |
| --- | --- |
| Server keep-alive `K` (noop interval) | 30 s. Sent in the handshake response (first array, index 5). Measure it in M1. |
| Back-channel GET timeout | 1.5 × `K` = 45 s. Restarts on every received chunk. |
| Forward POST timeout | Random, 10–20 s |
| Handshake timeout | 45 s, never retried |
| Back-channel retries | 3, with delays 0, 5–15 and 10–30 s |
| Forward retries | 2, with delays 0 and 5–15 s. A new send resets the forward count (see M5). |
| Classification | Any HTTP status other than 200 is fatal (no retry). No response (status 0), a timeout or bad data is retried. The client doesn't use the `NSError` to classify. |
| Server session lifetime (for reference) | The server keeps a session about 60–120 s after the client goes silent (at least 60 s). A later resume gets HTTP 404 or 400 ("Unknown SID"), which the client treats as fatal. |

In the tables below, times are measured from the start of the fault.

## 6. Test cases

### 6.1 Blackhole

| ID | Scenario | Expected client behavior | Measure |
| --- | --- | --- | --- |
| T1 | Idle stream, blackhole < 15 s | No timeout or retry; the stream continues. | No errors and no new handshake |
| T2 | Idle stream, 15–60 s | The back-channel GET times out at 15–45 s. A retry at 0 s succeeds once the blackhole ends, with the same session and no new handshake. | Detection time, recovery time after the blackhole ends, message gaps or duplicates |
| T3 | Idle stream, 60–120 s | As T2. A resume may get 404/400 and fail the channel. | Outcome vs. blackhole length |
| T4 | Idle stream, 120–225 s | Retries continue. The resume gets 404/400 and fails the channel. | Error code and time |
| T5 | Idle stream, > 225 s | The channel fails at about 165–225 s (request failed); non-acked messages are reported. | Abort time |
| T6 | Server streaming | Detection about 45 s after the last received chunk, then as T2–T5 | Detection time vs. the last chunk |
| T7 | Client pending writes | The forward POST times out at 10–20 s. With retries, the channel fails at about 35–75 s. | Abort time, non-acked count |
| T8 | Blackhole during the handshake | The channel fails at 45 s, with no retry. | Abort time |

### 6.2 Network off and on (L3)

| ID | Scenario | Expected client behavior | Measure |
| --- | --- | --- | --- |
| T9 | Idle stream; L3 down, then up after X | Requests fail immediately (e.g. `-1009`) and use up the back-channel retries. The channel fails at about 15–45 s, unless L3 comes back first; then it recovers at the next retry (0–30 s later). | Error codes, abort or recovery time vs. X |
| T10 | L3 down with pending writes | The forward retries are used up quickly; the channel fails at about 5–15 s. | Abort time |
| T11 | L3 flapping (down/up every few seconds) | Each failure uses a retry; observe whether the channel fails from flapping alone. | Retries per flap, abort time |

### 6.3 Interface changes

| ID | Scenario | Expected client behavior | Measure |
| --- | --- | --- | --- |
| T12 | Wi-Fi → cellular (cellular works) | In-flight requests on Wi-Fi fail with `-1005`. The retry at 0 s goes out over cellular. Recovery takes about 0.5–3 s, with the same session. | Recovery gap, `isCellular` on the retry |
| T13 | Wi-Fi → cellular, cellular broken | Behaves like a blackhole (T2–T5) | As T2–T5 |
| T14 | Cellular → Wi-Fi | No failure. Requests may keep using the cellular connection. | Interface per request over time (M3) |

### 6.4 Suspension

| ID | Scenario | Expected client behavior | Measure |
| --- | --- | --- | --- |
| T15 | App suspended for X, then resumed | On resume, the in-flight request fails (typically `-1005`) and is retried at once. X < 60 s: the same session resumes. X of 60–120 s: it may or may not. X > 120 s: 404/400, and the channel fails. | Outcome vs. X, error codes |

### 6.5 Fail-fast (optional)

| ID | Scenario | Expected client behavior | Measure |
| --- | --- | --- | --- |
| T16 | `WCInternalChannelParams.failFast = YES`, pending writes, blackhole | The forward POST times out at 10–20 s and the channel fails immediately (no forward retry). The back channel still retries as in T2–T5. | Abort time |

## 7. Measurements

| ID | Measurement | Expected |
| --- | --- | --- |
| M1 | Server keep-alive from the handshake (first array, index 5), the observed noop spacing on the back channel, and the GET rotation interval | 30000 ms, 30 s, 45–60 s |
| M2 | `NWPathMonitor` updates during Wi-Fi → cellular: does a transient "unsatisfied" path appear before cellular is "satisfied"? | To be measured |
| M3 | Interface and connection reuse per request after cellular → Wi-Fi (`isCellular`, `isReusedConnection`, local address). When do requests move to Wi-Fi? | To be measured |
| M4 | Protocol per request (`networkProtocolName`): h2, or h3 if URLSession learns Alt-Svc. If h3, any connection migration on interface changes. | h2 expected |
| M5 | Time to abort in a blackhole with no new sends, vs. one send every 5 s | Periodic sends reset the forward retry count, so the back channel bounds the abort (about 165–225 s) |
| M6 | Only if h3: the QUIC `max_idle_timeout` iOS advertises, and the PING cadence on an idle connection (packet capture) | To be measured |

## 8. Reporting

- **Location:** put results under `webchannel/benchmark/networking-failures/<date>/`,
  with a `report.md` and the raw logs or CSV files.
- **Each test:** report the ID, the run number, the observed times vs. the expected
  range, pass or fail, and notes.
- **Each measurement:** report the observed values.
- **Deviations:** explain any deviation from the expected behavior with the data that
  shows it, such as request timelines, error codes and metrics.
- **Environment:** record the iOS version, device, network, and the `main` commit used.
