# Asyncio API

This is the reference for supported Python client, server, message, Runtime,
and flow-control behavior. Import the public API from `web_stream`. The
`web_stream_ext` module and names beginning with `_` are implementation details;
native exposure alone does not make a symbol a supported application API.

Start with the [README](../README.md) for installation and a local exchange.
Use [runnable recipes](../examples/README.md) for complete applications, the
[ASGI guide](asgi.md) for framework integration, and the [code map](../CODE_MAP.md)
to locate implementations and tests. `WebStreamRouter` and `WebStreamSession`
are legacy standalone helpers; use `mount_web_stream()` for FastAPI.

- [Asyncio entry points and options](#asyncio-entry-points)
- [TLS identity verification](#tls-identity-verification)
- [Connection methods and message types](#connection-methods)
- [Receiving and termination](#receiving-and-termination)
- [Runtime and threading](#runtime-and-threading)
- [Flow control and shutdown](#flow-control-and-shutdown)
- [Errors](#errors)

## Asyncio entry points

### Client: connect

`connect(uri, ca_file="", cert_file="", key_file="", *, runtime=None,
limits=None, close_timeout=5.0, open_timeout=10.0, max_size=...,
max_queue=..., write_limit=..., process_exception=..., reconnect_delays=...)`
returns a connector with three uses:

| Use | Result and cleanup owner |
| --- | --- |
| `async with connect(uri) as conn:` | Open a `WebStreamConnection`; context exit awaits `conn.close()`. Prefer this for one connection. |
| `conn = await connect(uri)` | Open a `WebStreamConnection`; the caller must close it in `finally`. |
| `async for conn in connect(uri):` | Repeated connections; the connector closes each connection when its iteration resumes or its async generator is closed. See [reconnection](#reconnection). |

| Argument | Accepted values and behavior |
| --- | --- |
| `uri` | String with host and optional port/path/query. `webstream://` and `http://` select plain transport, default port 80; `webstreams://` and `https://` select TLS, default port 443. These aliases still use the web-stream protocol. Path defaults to `/`; query is preserved. Userinfo and fragments are rejected. |
| `ca_file`, `cert_file`, `key_file` | PEM file paths, default empty strings; relevant to TLS. See [TLS setup](#tls-identity-verification). |
| `runtime` | An explicit `Runtime`, or `None` for the shared default Runtime of the current asyncio loop. |
| `limits` | A `Limits` instance, or `None`. Mutually exclusive with the individual limit options below. |
| `max_size`, `max_queue`, `write_limit` | Omitted by default. Supplying any selects the [individual-option configuration](#selecting-limits); omission is different from passing `None`. |
| `open_timeout` | Positive seconds, default `10.0`; `None` disables the deadline. Includes Runtime acquisition, DNS, TCP, TLS, and the HTTP opening handshake. |
| `close_timeout` | Positive seconds, default `5.0`; `None` disables the outbound EOF flush deadline during close. |
| `process_exception` | Synchronous function `(error) -> None` to retry an opening failure, or an exception to propagate. Used by retry iteration only. |
| `reconnect_delays` | Zero-argument callable returning a synchronous iterator of delays in seconds; used by retry iteration only. |

Failed and cancelled opening attempts release native state before propagating
the exception, including repeated cancellation. The opening deadline initiates
cleanup; it is not a strict upper bound on elapsed time including cleanup.

The lower-level `WebStreamConnection(host, port, tls, ca_file="", cert_file="",
key_file="", path="/", *, ...)` accepts the same Runtime, limits, and timeout
options. Construct it on a running asyncio loop and `await conn.connect()`
once; it returns the connection. Prefer URI-based `connect()` for application
code. A connection cannot be reopened after closing.

### Server: serve and WebStreamServer

`serve(handler, host=None, port=None, **options)` returns an awaitable/async
context manager. Awaiting it returns a started `WebStreamServer`; context exit
awaits `server.stop()`. A handler is an async callable receiving one
`WebStreamServerConnection` per accepted stream. The server closes that
connection when the handler returns, raises, or is cancelled. Set a handler
before starting a lower-level server with `server.set_stream_handler(handler)`.

| Server argument | Default and behavior |
| --- | --- |
| `host` | `None`: IPv4 wildcard listener. Use `"127.0.0.1"` for local-only examples. Host names use IPv4; numeric IPv6 addresses are also supported. |
| `port` | `None` in `serve()` means 0; 0 selects an available port, readable as `server.port` after startup. `WebStreamServer` requires a port argument (integer 0–65535). |
| `tls` | `False`; `True` selects the native TLS/mTLS server. |
| `ca_file`, `cert_file`, `key_file` | Empty strings; provide trusted client CA and server certificate/key files for TLS. |
| `runtime`, `limits`, individual limits, `close_timeout` | Same choices as the client; applied to accepted connections. |
| `max_connections` | `10000`; cap on native active handshakes plus established streams. 0 disables the cap; negative values are rejected. |
| `shutdown_timeout` | `5.0` seconds, non-negative; handler grace period after closing connections, followed by cancellation and joining. This is not a total shutdown deadline. |
| `connection_cls` | `WebStreamServerConnection`; see the extension contract below. |

The constructor is `WebStreamServer(port, tls=False, ca_file="", cert_file="",
key_file="", connection_cls=WebStreamServerConnection, *, runtime=None,
limits=None, max_connections=10000, shutdown_timeout=5.0, close_timeout=5.0,
host=None, max_size=..., max_queue=..., write_limit=...)`.

Custom `connection_cls` constructors receive
`(runtime, identifier, path, *, limits, close_timeout)` and must derive from
`WebStreamServerConnection` or implement the same lifecycle contract. The
identifier and Runtime registries are internal, not application handles.

### Reconnection

Retry iteration retries **opening failures**. Its default policy retries
`OSError`, timeouts, and native `connect`-stage errors; other errors propagate.
The initial delay is random between 0 and 5 seconds; subsequent delays start at
3 seconds, multiply by 1.6, and cap at 60 seconds. Successful opening resets the
backoff. Cancellation interrupts attempts and backoff waits.

Native connect errors combine DNS, TCP, TLS, and handshake failures. Supply
`process_exception` when your retry policy must distinguish retryable failures
from configuration errors; the current error detail may not permit finer
diagnosis. Exceptions from the **loop body** are application errors and propagate
unless the body catches them. The connector does not replay messages or restore
application sessions. A cancelled or failed send may have reached the peer;
blind resubmission can duplicate application work. Use application identifiers
and acknowledgements if you need to decide whether to replay it.

On an early `break`, explicitly close the retry async generator so its last
connection is released promptly; see the finite
[reconnect recipe](../examples/reconnect.py). One connector supports one active
connection at a time.

## TLS identity verification

TLS connections verify the certificate chain against `ca_file` and the URI host
against the certificate's Subject Alternative Names (SAN). DNS hosts require a
matching DNS SAN and are sent via SNI; IP literals require a matching IP SAN.
A Common Name alone is not accepted. The native TLS context does not load the
system CA store automatically: supply a CA file trusted for the peer.

For a client, pass `ca_file="ca.pem"` and, when the peer requires mutual TLS,
`cert_file="client.pem", key_file="client.key"`. The native server exposed by
`serve(..., tls=True)` requires client certificates; configure it with the
trusted client CA and its own server certificate/key. There is no Python option
to turn off its client-certificate requirement. Empty path defaults do not
constitute a working TLS configuration. Plain transport ignores TLS file options.

## Connection methods

These methods apply to both `WebStreamConnection` and
`WebStreamServerConnection`. Call them from the owning asyncio loop. The
connection's `path` is the opening request target, including the query string.
All methods in this table are async except the async iteration syntax.

| Method | Input and result |
| --- | --- |
| `send(data, *, text=None) -> None` | `str` sends text; `bytes`, `bytearray`, or `memoryview` sends binary. Also accepts sync/async iterables of consistently typed text or binary parts, collected into one complete message before submission. Empty iterables send nothing. |
| `send_text(text: str) -> None` | UTF-8 encode one text message. |
| `send_binary(data) -> None` | Send one bytes-like binary message. |
| `send_metadata(data) -> None` | Send one bytes-like metadata message, preserving its distinct opcode. |
| `recv(decode=None) -> str or bytes` | Default: decode text as UTF-8, return binary/metadata as bytes. `decode=True` decodes any opcode; `False` returns bytes for any opcode. |
| `recv_message() -> Message` | Return immutable `Message(opcode: int, data: bytes)` without decoding. Use this when binary and metadata must remain distinguishable. |
| `async for data in conn:` | Repeated `recv()` calls; ends on clean EOF/local close and propagates transport failures. |
| `drain() -> None` | Wait for preceding writes to leave the native output buffer. |
| `write_eof() -> None` | Flush outbound EOF, retaining the receive direction. |
| `close() -> None` | Flush EOF with `close_timeout`, then release native state; context exit uses this. |
| `abort() -> None` | Release native state without flushing pending output. |
| `wait_closed() -> None` | Wait for native teardown; does not initiate closing. |

Use `WEB_STREAM_OPCODE_TEXT` (1), `WEB_STREAM_OPCODE_BINARY` (2), and
`WEB_STREAM_OPCODE_METADATA` (3) when inspecting `Message.opcode`.
`recv()` and async iteration discard the opcode, so echoing their results with
`send()` converts metadata to binary. See the
[metadata recipe](../examples/metadata.py) for an opcode-preserving exchange.

`send(..., text=True)` sends valid UTF-8 bytes as text; `text=False` sends encoded
strings as binary. Unsupported inputs, mappings, and mixed text/binary iterable
parts raise `TypeError`. Text conversion can raise `UnicodeEncodeError` for
invalid strings or `UnicodeDecodeError` for invalid UTF-8 bytes; exceeding the
configured outgoing message limit raises `ValueError`. No string representation
of an unsupported object is sent.
Iterable input is fully buffered, not incremental network streaming. Incoming
text decoding errors consume that message; `recv_message()` lets the caller
choose its own validation policy.

Send completion follows the output watermark policy below, not peer receipt or
application processing. `drain()` and `write_eof()` wait for zero native output;
they still do not acknowledge peer receipt. Concurrent sends are serialized;
only one receive call may wait at a time. One sender and one receiver may run
concurrently.

## Receiving and termination

Messages queued before termination remain readable. After those messages,
every receive raises the **first** terminal error, including calls after
`close()` cleanup. A later failure or local close does not replace that reason.

| Receive outcome | Behavior |
| --- | --- |
| Clean remote EOF or local close | Raise `ConnectionClosedOK` once queued messages are consumed. Async iteration ends normally. Clean remote EOF leaves the outbound direction available. |
| Transport/protocol failure | Raise `ConnectionClosedError` after queued messages. Async iteration propagates it. |
| Another waiting `recv()` or `recv_message()` | Raise `ConcurrencyError`. Use one receiver task to distribute messages if needed. |
| Cancelled waiting receive | Release the receiver reservation without consuming a message or terminal notification. Another receive can follow. |

Use `ConnectionClosedOK` to catch clean termination, or `ConnectionClosed` to
catch both clean and failed termination. `ConnectionClosedOK` also derives from
`ConnectionAbortedError`. `ConnectionClosedError` also derives from
`WebStreamError`, retaining `code` and `detail`. All these termination errors
derive from `ConnectionError`. Catching only the clean case preserves visibility
of transport failures.

## Runtime and threading

`Runtime` owns one libevent worker shared by its clients and listeners. Native
networking stays on that worker; Python Futures, connections, and handlers run
on the owning asyncio loop. Network waits suspend coroutines, allowing other
asyncio tasks and connections to progress.

| Ownership choice | Start and release behavior |
| --- | --- |
| `runtime=None` | Share a default Runtime per asyncio loop. The last client/listener release stops and joins the worker. |
| `async with Runtime() as runtime:` | Explicit owner; pass `runtime=runtime` to clients/servers to share one worker. Context exit closes remaining objects, stops the worker, and joins it. |
| `runtime = await Runtime().start()` | Start explicitly; the caller must `await runtime.close()` in `finally`. `start()` returns the Runtime. |

An explicit Runtime passed to a client or server is started as needed and stays
running after they close; its owner must close it. `runtime.is_running` reports
whether its worker is alive and shutdown has not begun. A Runtime and its
connections belong to one asyncio loop and cannot be restarted after closure.
Servers also cannot be restarted after shutdown. From other threads, schedule
coroutines on the owner loop with `asyncio.run_coroutine_threadsafe()`.

`Runtime(thread_factory=...)` accepts a factory with the `target`, `name`, and
`daemon` keywords of `threading.Thread`. Use separate Runtimes to assign groups
of connections to separate workers. The [metadata recipe](../examples/metadata.py)
demonstrates an explicit Runtime with a client and server nested inside it.
Interpreter exit stops remaining native workers as a fallback; it does not run
application handler cleanup. Use context managers for application ownership.

## Flow control and shutdown

### Selecting limits

There are two mutually exclusive configuration styles on clients and servers.
Use `Limits` for byte budgets and an outgoing message-size cap; use individual
options for a message-count receive queue and configurable high/low watermarks.
The values below are **per connection**, not a Runtime-wide aggregate.

| Property | No options, or `limits=Limits(...)` | Any individual limit option supplied |
| --- | --- | --- |
| Incoming message limit | `Limits.max_message_size`, default 1 MiB | `max_size`, default 1 MiB; `None` disables it, 0 permits only empty payloads |
| Outgoing message limit | Same `max_message_size`, default 1 MiB | No outgoing message-size cap |
| Receive budget | `receive_buffer_limit`, default 4 MiB; payload bytes plus 64 bytes per message | `max_queue`, default 16 complete messages; `None` disables receive flow control |
| Receive resume point | Half the receive byte budget | Low queue watermark, default `high // 4` |
| Write configuration | `write_buffer_limit`, default 4 MiB; send completion at one quarter of that budget | `write_limit`, default 32 KiB high watermark; blocked send resumes at low watermark, default `high // 4` |

Supplying **any** of `max_size`, `max_queue`, or `write_limit` selects the
right-hand column for all three options. For example, `connect(uri,
max_size=1024)` also selects a 16-message queue, 32 KiB output watermark, and
no outgoing size cap. `connect(uri)` uses the left-hand column. Passing a
non-`None` `limits` together with any individual option raises `ValueError`.

`Limits(max_message_size=1048576, receive_buffer_limit=4194304,
write_buffer_limit=4194304)` is immutable. All values must be positive integers
(not booleans); the write budget must be at least 1024 bytes and
`max_message_size <= write_buffer_limit // 2`.

For individual options, `max_size` is a non-negative integer or `None`.
`max_queue` and `write_limit` accept a positive integer high watermark or a
`(high, low)` tuple with `0 <= low <= high`. Only `max_queue` permits `None`;
`write_limit=None` is invalid. Watermarks count messages for `max_queue` and
bytes for `write_limit`. Booleans are not accepted as integer limits.

### Buffer budgets and backpressure

Receive accounting includes data awaiting delivery to asyncio as well as queued
data; taking a message returns its credit. Empty messages count too. Native
reads pause/resume at the configured receive watermarks. One complete message
and the parser's current input batch can cross the watermark; raw libevent
input is separately limited to 64 KiB. These are buffer budgets, not exact
bounds on RSS, TLS buffers, iterable assembly, or application-retained data.

Sends are serialized and suspend at the native output thresholds while other
connections/tasks can continue. For `Limits`, one payload uses at most half
the write budget, leaving framing space. For individual options, one complete
message plus framing can cross the write high watermark; `write_limit` does
not limit payload size. `drain()` and EOF operations wait for zero output
regardless of configuration style.

### EOF and cleanup

Receive termination, outbound EOF, and native transport teardown are separate.

| Operation or event | Sending afterwards | Receiving afterwards | What it waits for |
| --- | --- | --- | --- |
| Clean inbound EOF | Available until local EOF/close | Queued messages, then `ConnectionClosedOK` | Nothing; does not itself complete `wait_closed()` |
| `await conn.write_eof()` | New sends fail after outbound EOF starts | Remains available | Earlier serialized writes and outbound EOF flush; no built-in timeout |
| `await conn.drain()` | Remains available | Remains available | Earlier serialized writes and zero native output; no built-in timeout |
| `await conn.close()` | New sends rejected | Queued messages, then first terminal error | EOF flush, bounded by `close_timeout`, then native release |
| `await conn.abort()` | New sends rejected | Queued messages, then first terminal error | Native release without flushing pending output |
| `await conn.wait_closed()` | Does not change state | Does not change state | Native teardown only; may wait indefinitely if neither side closes |

Use `write_eof()` when the peer needs request EOF before sending its final
response; keep receiving and then close the connection. See the
[half-close recipe](../examples/half_close.py). Use `close()` for normal cleanup
and `abort()` when flushing should be abandoned. EOF flush timeout or send
failure from `close()` is reported **after** cleanup. Repeated close/EOF calls
share their corresponding operation; they do not reopen the connection.

### Cancellation

| Cancelled operation | Consequence |
| --- | --- |
| Opening via `connect()` | Native release finishes before cancellation propagates. |
| Waiting `recv()` / `recv_message()` | Reservation released; no queued message or terminal notification consumed. |
| `send()` waiting for its send lock | The operation is removed without native submission. |
| `send()` after native submission | Bytes may still be sent; the internal operation retains the send lock until completion or shutdown. |
| `drain()` / `write_eof()` | Caller stops waiting; the shielded internal operation can continue. |
| Connection `close()` / `abort()`, server `stop()`, Runtime `close()` | Shared cleanup completes despite repeated caller cancellation, then cancellation is propagated if cleanup succeeds. Cleanup errors remain observable. |
| Connection/server `wait_closed()` | Stops waiting without cancelling the shared teardown/shutdown work. |

Use an application timeout for receiving, for example
`await asyncio.wait_for(conn.recv(), timeout=1.0)`. The
[receive-timeout recipe](../examples/receive_timeout.py) demonstrates receiving
again afterwards. A timeout on a submitted send cannot establish whether the
peer received it. If you abandon the connection, explicitly close or abort it.

### Server shutdown

| Server method | Result and ownership |
| --- | --- |
| `await server.start()` | Start listening; returns `None`. Repeated starts while running share startup. |
| `server.close(close_connections=True)` | Synchronously schedule shutdown; await `wait_closed()` to join it. |
| `server.close(close_connections=False)` | Stop accepting, then wait for existing handlers to finish. A later `close()` or `stop()` escalates to closing connections. |
| `await server.stop()` | Schedule closing connections and join shutdown. |
| `await server.wait_closed()` | Wait for scheduled shutdown; does not initiate it. |
| `await server.serve_forever()` | Start and wait for shutdown; cancellation runs `stop()` before leaving. |
| `server.is_serving()` | Return acceptance state. |
| `server.connections` | Return a snapshot set of active connections. |

Shutdown stops accepting, closes established connections and wakes receivers,
then waits for handler tasks. After `shutdown_timeout` it cancels remaining
handlers and joins them. Each connection has its own close flush deadline;
handlers must cooperate with cancellation. Consequently, `shutdown_timeout`
does not bound total shutdown time. Handler and listener failures are reported
through the asyncio loop's exception handler.

Handlers can stop their own server or close their shared Runtime, concurrently
and during shutdown. Such callers are excluded from that server's task join to
avoid waiting on themselves; unrelated handlers are still joined/cancelled as
needed. FastAPI lifespan resource ordering is described in the [ASGI guide](asgi.md).

## Errors

| Exception | Meaning and handling |
| --- | --- |
| `ConnectionClosedOK` | Clean directional EOF/local close. Catch to end a receive loop normally. |
| `ConnectionClosedError` | Failed termination; inspect `code` and log `detail`. |
| `ConnectionClosed` | Common base for clean and failed termination. |
| `ConcurrencyError` | Another receiver is waiting; arrange a single receiver task. |
| `WebStreamError` | Native operation failure; a `ConnectionError` with stage `code` and diagnostic `detail`. |
| `asyncio.TimeoutError` | Opening deadline, close flush deadline, or an application `wait_for()` deadline expired. |
| `TypeError` / `ValueError` | Invalid message input or configuration; correct it before retrying. |
| `RuntimeError` | Lifecycle/loop misuse, such as restarting a closed Runtime or using the wrong asyncio loop. |

`WebStreamError.code` identifies `connect`, `listen`, `transport`, `send`,
`limit`, `runtime`, or `closed`. Do not parse `detail` as a structured error
code. The C++ client combines DNS/TCP/TLS/handshake failures into `connect`;
framing and transport errors are also combined. No finer diagnosis is inferred
from an empty native callback. A `limit` error concerns size/resource limits;
local outgoing size validation can instead raise `ValueError`, and incoming
oversize failures can surface through transport termination.

For behavior verification, the [code map's test index](../CODE_MAP.md#tests-and-build-entry-points)
links to API, flow-control, cancellation, EOF, TLS, and shutdown regression tests.
See the [development guide](development.md) for commands to run them.
