# WebStream Python Bindings

Python bindings for the web-stream protocol (C++).

These bindings provide an asyncio-compatible API and utilize `nanobind` for efficient C++-to-Python interoperability.
The `libevent` event loop runs in a background thread, integrated with the Python `asyncio` event loop.

For implementation structure, thread/ownership boundaries, and test locations,
see [CODE_MAP.md](CODE_MAP.md).

## Installation / Setup

This sub-project is intended to be used with a Python virtual environment (`venv`).

### Prerequisites
- Python 3.9+
- CMake 3.14+
- A working C++17 compiler
- Background libraries like BoringSSL and libevent

### Building within a Virtual Environment

1. Create a virtual environment and activate it:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Upgrade your build tools (optional but recommended):
   ```bash
   pip install --upgrade pip
   ```

3. Install the module (which will trigger the CMake build):
   ```bash
   pip install .
   ```

4. For development, you can install it in editable mode:
   ```bash
   pip install -e .
   ```

## Running Tests

With your virtual environment active and `nanobind` installed, run these commands
from `web-stream/python`:

```bash
cmake -S . -B build/tests -DPython_EXECUTABLE="$VIRTUAL_ENV/bin/python"
cmake --build build/tests --target check-python --parallel 4
```

`check-python` builds the native extension and the `plain_echo_server` and
`tls_echo_server` test prerequisites before running unittest discovery. Tests use
the current Python sources and the extension from this build without reinstalling
the package. CMake supplies the actual executable paths, including for custom
build directories and multi-configuration generators; missing required artifacts
are an error rather than a skipped test. FastAPI integration tests still require
the optional `fastapi` dependency (`pip install fastapi`).

Standalone CMake builds enable `WISH_PYTHON_BUILD_TESTS` by default. A regular
`cmake --build build/tests` also builds all test prerequisites; afterwards the
registered `python_tests` suite can be run with CTest. Wheel/editable package
builds disable this option by default, so ordinary installation does not build
test servers. It can be explicitly enabled with
`-DWISH_PYTHON_BUILD_TESTS=ON` when configuring a development build.

For an already installed package, `python -m unittest discover -s tests -v` is
still supported. That command looks for echo servers in `../cpp/build/examples`
unless `WEB_STREAM_PLAIN_ECHO_SERVER` and `WEB_STREAM_TLS_ECHO_SERVER` specify
their paths; without those executables the dependent tests are skipped. Use
`check-python` to build and run them together.

## Usage Example

TLS connections (`webstreams://` and `https://`) verify the certificate chain
against `ca_file` and the URI host against the certificate's Subject Alternative
Names (SAN). DNS hosts require a matching DNS SAN and are sent via SNI; IP
literals require a matching IP SAN. A Common Name (CN) alone is not accepted.

```python
import asyncio
from web_stream.client import connect

async def test_web_stream_client():
    uri = "webstreams://example.com:443"
    
    # Establish connection
    async with connect(
        uri, 
        ca_file="ca.pem", 
        cert_file="client.pem", 
        key_file="client.key"
    ) as conn:
        
        # Send a message
        await conn.send("Hello over web-stream!")
        
        # Receive a message
        msg = await conn.recv()
        print("Received:", msg)

if __name__ == "__main__":
    asyncio.run(test_web_stream_client())
```

Messages queued before termination remain available through `recv()`. After those
messages, every `recv()` raises the first terminal error, including calls after
`close()` cleanup. Only one receiver may wait on a connection: concurrent
`recv()` or `recv_message()` calls raise `ConcurrencyError`. Cancelling a receiver
releases that reservation without consuming a message or terminal notification.
The first terminal event determines the exception: `ConnectionClosedOK` for a
local or clean remote close, or `ConnectionClosedError` for a transport failure.
Both derive from `ConnectionClosed` and `ConnectionError`; the clean exception
also derives from `ConnectionAbortedError`, and the failure exception retains
`WebStreamError`'s `code` and `detail`. This applies to clients and servers.

## Asyncio entry points

`connect()` can be awaited directly or used as an async context manager. Direct
callers must close the returned connection. `open_timeout` (default 10 seconds)
covers runtime acquisition, DNS, TCP, TLS, and the HTTP opening handshake;
`None` disables the deadline. Failed and cancelled attempts release native state
before propagating their exception.

```python
from web_stream import connect, serve

async def echo(conn):
    async for message in conn:
        await conn.send(message)

async def run():
    async with serve(echo, "127.0.0.1", 0) as server:
        conn = await connect(f"webstream://127.0.0.1:{server.port}")
        try:
            await conn.send(["hello", " world"])
            assert await conn.recv() == "hello world"
        finally:
            await conn.close()
```

`async for conn in connect(uri)` reconnects after each iteration and retries
connection-stage failures with exponential backoff. Every successful iteration
closes its connection before the next attempt. `process_exception(error)` returns
`None` to retry or an exception to propagate; `reconnect_delays()` supplies an
iterator of delays in seconds. By default, `OSError`, timeouts, and native
`connect`-stage errors are retried; other errors propagate. Native connect errors
currently combine DNS, TCP, TLS, and handshake failures, so applications that
need stricter retry decisions should supply `process_exception`. Cancellation
interrupts connection attempts and backoff waits.

`send()` accepts `str`, `bytes`, `bytearray`, and `memoryview`, or a synchronous or
asynchronous iterable containing consistently typed text or binary parts.
Iterable parts are collected and validated before submitting one complete
message. Unsupported types, mappings, and mixed text/binary parts raise
`TypeError` without sending a string representation. `text=True` sends valid
UTF-8 bytes as text; `text=False` sends encoded strings as binary. `recv(decode)`
retains its text/binary decoding override.

`serve(handler, host, port)` can be awaited or used as an async context manager.
Host names use IPv4; numeric IPv6 addresses are also supported. `host=None`
retains the IPv4 wildcard listener. Port 0 selects a port and exposes it as
`server.port`. The existing `WebStreamServer` constructor also accepts `host`.
`server.close()` schedules shutdown, and `await server.wait_closed()` joins it.
`server.close(close_connections=False)` stops accepting and waits for existing
handlers to finish; a later `close()` or `stop()` also closes those connections.
`serve_forever()` waits until shutdown and stops the server when cancelled.
`is_serving()` reports acceptance state and `connections` returns a snapshot of
the active connections. The existing `start()` and `stop()` remain available.

As an alternative to `Limits`, client and server entry points accept
`max_size`, `max_queue`, and `write_limit`. These options cannot be combined
with `limits`. Supplying any of them selects defaults of 1 MiB per incoming
message, 16 queued messages, and 32 KiB of output. `max_size=None` disables the
incoming message limit, and `max_queue=None` disables receive flow control.
`max_queue` and `write_limit` accept a positive high watermark or `(high, low)`;
the default low watermark is one quarter of the high watermark. Queue watermarks
count complete messages, including messages awaiting delivery to asyncio.
Write watermarks suspend sending when output exceeds the high watermark and
resume at the low watermark. One complete message and framing can cross the
write watermark; these options do not impose an outgoing message-size limit.
The original `Limits` API continues to provide byte budgets and an outgoing
size limit.

Ping/pong and their periodic keepalive and timeout options are pending.

## Runtime and threading

`Runtime` owns one libevent worker, independent of any connection. Connections
and listeners on a Runtime share that worker. Native networking state is accessed
only by its worker; Python receives events and operation results on its owning
asyncio loop. Sending awaits a Future instead of blocking the asyncio thread.

```python
from web_stream import Runtime, Limits, WebStreamServer, connect

async def run():
    limits = Limits(max_message_size=1024 * 1024,
                    receive_buffer_limit=4 * 1024 * 1024,
                    write_buffer_limit=4 * 1024 * 1024)
    async with Runtime() as runtime:
        server = WebStreamServer(8080, runtime=runtime, limits=limits)

        async def echo(conn):
            try:
                while True:
                    message = await conn.recv_message()
                    if message.opcode == 1:
                        await conn.send_text(message.data.decode("utf-8"))
                    elif message.opcode == 2:
                        await conn.send_binary(message.data)
                    else:
                        await conn.send_metadata(message.data)
            except ConnectionAbortedError:
                pass

        server.set_stream_handler(echo)
        async with server:
            async with connect("webstream://127.0.0.1:8080", runtime=runtime,
                               limits=limits) as conn:
                await conn.send_metadata(b"metadata")
                # recv_message() preserves the opcode; recv() returns str/bytes.
                message = await conn.recv_message()
                print(message.opcode, message.data)
```

Use `Runtime(thread_factory=...)` to supply a factory accepting the
`target`, `name`, and `daemon` keywords of `threading.Thread`. Use multiple
Runtimes to place groups of connections on separate workers. A Runtime and its
Python connections belong to one asyncio loop and cannot be restarted after
closure. From other threads, schedule work on that loop with
`asyncio.run_coroutine_threadsafe()`.

Without an explicit Runtime, clients and servers share a default Runtime per
asyncio loop. Its last client/listener release stops and joins the worker.
An explicit Runtime stays running until `close()` or context exit, which also
cleans up its remaining connections and listeners. Context managers are the
normal resource ownership API. Interpreter exit stops remaining native workers
as a fallback; it does not run application handler cleanup.

## Flow control and shutdown

- `Limits` bounds individual messages, received data awaiting consumption, and
  native output. Limits are positive; `max_message_size` must be at most half
  `write_buffer_limit`, whose minimum is 1024 bytes. Each received message also
  uses 64 bytes of credit, so empty messages cannot bypass the receive limit.
- Receive credit includes data queued for delivery to asyncio, not just data
  already in its Queue. Native reads pause at the receive watermark and resume
  below half of it. A complete message and the parser's current input batch can
  cross the watermark; raw libevent input is separately limited to 64 KiB.
  These are buffer budgets, not an exact bound on process RSS, TLS buffers, or
  data retained by the application.
- Sends are serialized per connection and complete when native output falls
  below a quarter of the write limit. A message uses at most half the limit,
  leaving space for framing. Completion does not acknowledge peer receipt.
  `drain()` waits for native output to reach zero. A slow peer suspends senders
  while other connections and asyncio tasks continue running.
- Cancelling a send waiting for the connection's send lock removes it. After
  native submission it may still send bytes; its internal operation keeps the
  send lock until completion or connection shutdown. Cancellation of `connect()`
  finishes native release before propagating, including repeated cancellation.
- `write_eof()` flushes the outbound EOF while allowing a final inbound response.
  Inbound EOF terminates `recv()` but leaves sending available until local EOF.
  `wait_closed()` waits for native transport teardown. `close()` flushes EOF
  (bounded by `close_timeout`, default 5 seconds; `None` disables it), then releases the transport;
  a timeout or send failure is reported after cleanup. `abort()` releases the
  transport without flushing. Close/abort cleanup completes even if cancelled.
- Server `stop()` first stops accepting and closes established connections,
  wakes receivers, then waits for handler tasks. After `shutdown_timeout`
  (default 5 seconds) it cancels remaining handlers and joins them. Handlers
  must cooperate with task cancellation. Handler exceptions are reported to
  the asyncio loop's exception handler. A handler can stop its own server;
  that caller is excluded from the server's task join.

Both client and server connections expose `send_text()`, `send_binary()`,
`send_metadata()`, and `recv_message() -> Message(opcode, data)`. `send()` and
`recv()` retain their convenient text/bytes behavior. Async iteration ends on
clean EOF and propagates transport failures.

`WebStreamError` subclasses `ConnectionError` and exposes `code` and `detail`.
Codes identify the stage (`connect`, `listen`, `transport`, `send`, `limit`,
`runtime`, or `closed`). The underlying C++ client still combines DNS, TCP, TLS,
and handshake failures into one connect error; framing and transport errors are
also combined. No finer diagnosis is inferred from an empty native callback.

## FastAPI integration

Install the optional framework dependency with `pip install '.[fastapi]'`.
`mount_web_stream(app, port=...)` exposes the app's normal WebSocket routes over
web-stream through `ASGIWebSocketAdapter`. Requests pass through FastAPI routing,
dependencies, and ASGI middleware. Register routes with `@app.websocket()` or a
FastAPI `APIRouter.websocket()` as usual.

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from web_stream import mount_web_stream

@asynccontextmanager
async def lifespan(app):
    # Initialize shared resources here, before either listener handles requests.
    yield {"prefix": "Echo"}
    # Mounted stream handlers have finished before resource cleanup here.

app = FastAPI(lifespan=lifespan)

@app.websocket("/stream")
async def stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            text = await websocket.receive_text()
            await websocket.send_text(f"{websocket.state.prefix}: {text}")
    except WebSocketDisconnect:
        pass

stream_server = mount_web_stream(app, port=8081, host="127.0.0.1")
# Save as app.py and run: uvicorn app:app --port 8080
```

The host serves ordinary HTTP/WebSocket on its configured port; web-stream
clients connect to `webstream://127.0.0.1:8081/stream`. Both listeners invoke the
same application in the same worker's asyncio loop. The helper wraps the existing
lifespan rather than registering deprecated `on_event` hooks: custom lifespan
and default startup/shutdown handlers keep working. Startup initializes the app
before the stream listener starts. Shutdown stops that listener and joins its
handlers before releasing app resources. State yielded by the app's lifespan is
shallow-copied into each stream's scope. No duplicate ASGI lifespan is started.

Call `mount_web_stream` after configuring the app/routers/lifespan and before the
host runs the app. The host must enable lifespan. The returned server supports
one lifespan run; construct a fresh app/server for another run. Options such as
`tls`, `runtime`, `limits`, and `shutdown_timeout` pass to `WebStreamServer`.
With multiple host workers, each worker creates a listener: allocate distinct
ports or arrange external routing; a shared fixed web-stream port is not
automatically supported. No Uvicorn plugin or shared HTTP listener is installed.
The experimental adapter's compatibility limits below still apply, including
missing headers/cookies and unsupported handshake negotiation.

Migration from the previous FastAPI helper:

- Replace `mount_web_stream(app, router, port=...)` with
  `mount_web_stream(app, port=...)`.
- Replace `@router.web_stream(path)` with `@app.websocket(path)` (or use a normal
  FastAPI `APIRouter` and `app.include_router()`).
- Replace the `WebStreamSession` argument with a FastAPI `WebSocket`. Explicitly
  `await websocket.accept()` and use its send/receive methods and
  `WebSocketDisconnect` handling. Metadata and half-close have no representation
  in this interface.

`WebStreamRouter` and `WebStreamSession` remain available as legacy **standalone**
stream helpers. Their `create_server()` path remains independent of ASGI and
does not provide FastAPI middleware or dependencies. Use `mount_web_stream()`
for FastAPI integration.

## Experimental ASGI WebSocket adapter

`ASGIWebSocketAdapter` calls an ASGI 3 application with a `websocket` scope for
each established web-stream connection. Existing FastAPI/Starlette WebSocket
routes can handle text and binary messages, including their normal routing,
dependencies, and ASGI middleware. Clients still use web-stream, not RFC 6455
WebSocket. This is an application compatibility experiment, **not full ASGI
WebSocket protocol conformance**.

```python
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from web_stream import ASGIWebSocketAdapter

app = FastAPI()

@app.websocket("/echo/{room}")
async def echo(ws: WebSocket, room: str):
    await ws.accept()
    try:
        while True:
            await ws.send_text(f"{room}: {await ws.receive_text()}")
    except WebSocketDisconnect:
        pass

async def main():
    # For this standalone example, explicitly enter FastAPI's lifespan context.
    # An existing host must own lifespan instead when sharing its app instance.
    async with app.router.lifespan_context(app) as state:
        adapter = ASGIWebSocketAdapter(app, state=state)
        async with adapter.create_server(8080, host="127.0.0.1") as server:
            await server.serve_forever()

asyncio.run(main())
```

Connect with `web_stream.connect("webstream://127.0.0.1:8080/echo/room")`.
`create_server(port, **server_options)` forwards Runtime, TLS, flow-control, and
shutdown options to `WebStreamServer`, and infers `ws`/`wss` for the scope from
TLS. Alternatively, install the adapter using
`server.set_stream_handler(ASGIWebSocketAdapter(app, scheme="wss"))` on an existing
TLS server (`scheme="ws"` is the default). No FastAPI dependency is needed for a
plain ASGI callable. The adapter itself is a stream handler, not an ASGI app.

The first receive returns `websocket.connect`; later receives wait for accept or
close. Sends await the existing transport flow control. App return, exceptions,
and cancellation close the connection, and retained callbacks cannot communicate
after app return. The host's existing server shutdown grace period applies.
The adapter never drives lifespan: run it only after host startup completes and
stop its server before host shutdown. A supplied `state` dict is shallow-copied
into each scope. The optional `root_path` is scope metadata; it does not rewrite
the request path. When sharing an app, use the same owning asyncio loop.

Compatibility boundaries:

- The native HTTP opening handshake has already completed before the app runs.
  `accept` permits application message delivery; it does not complete a deferred
  handshake. Closing before accept (including an unknown route) closes an
  established web-stream; it cannot return HTTP 403. HTTP denial-response
  extensions are not advertised or supported.
- Path decoding, raw path, and query bytes come from the request target. Request
  headers, peer/listener addresses, and offered subprotocols are not currently
  exposed by the native connection API. Scopes use empty `headers` and
  `subprotocols`, and `None` addresses. Header/cookie authentication, Origin/Host
  checks, and subprotocol-dependent apps therefore cannot be assumed compatible.
  Nonempty accept headers and any selected subprotocol raise `ValueError` rather
  than being silently discarded. The `ws`/`wss` scheme describes the compatibility
  interface, not the wire protocol. No extensions are advertised.
- Clean inbound EOF maps to disconnect code 1005 (no peer close code); transport
  failure maps to 1006. Inbound EOF ends the whole adapted connection: web-stream
  half-close semantics are unavailable through this interface. A local close's
  code/reason are retained for local disconnect notifications but are **not sent
  to the peer**. WebSocket close frames/codes are not available on this transport.
- Metadata messages are not converted to binary messages: they terminate the
  adapted connection with local disconnect code 1003. Invalid UTF-8 text uses
  local code 1007. Neither code is transmitted. Ping/pong keepalive remains a
  transport feature pending in the existing Python API.
- `asgi.version=3.0` and `spec_version=2.5` describe the application event format
  implemented by the adapter, including disconnect reasons. They do not remove
  the transport limitations above. ASGI 2 callables are not supported.

Install the optional compatibility-test dependency and run the tests:

```bash
pip install '.[test-asgi]'
python -m unittest discover -s tests -p test_asgi.py -v
```

The tests cover raw ASGI state transitions, real web-stream message exchange,
FastAPI routing/query/path dependencies, Starlette authentication middleware,
externally managed lifespan/state, peer/local close, unknown routes, and cleanup.
FastAPI integration cases are skipped if its optional dependency is unavailable.
`tests/test_fastapi_mount.py` additionally exercises the mounting helper through
the ASGI lifespan protocol, including startup failures, cancellation, state
sharing, multiple listeners, and shutdown ordering.

## Low-level compatibility

`web_stream_ext.PlainClient`, `TlsClient`, `PlainServer`, `TlsServer`, and their
synchronous callback/handle APIs remain available. Their callbacks run on the
native loop thread, and cross-thread send/close calls block until execution.
Configure/init those objects before running them; callback reconfiguration and
reinitialization during `run()` are unsupported. The high-level asyncio API uses
the separate Runtime implementation. Custom `connection_cls` constructors now
receive `(runtime, identifier, path, *, limits, close_timeout)` and must derive
from `WebStreamServerConnection` or implement the same lifecycle contract.
