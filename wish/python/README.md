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

After installing the Python bindings, build the C++ echo servers used by the
integration and safety tests. Run these commands from `wish/python`:

```bash
cmake -S ../cpp -B ../cpp/build -DWISH_BUILD_EXAMPLES=ON \
  -DWISH_BUILD_TESTS=OFF -DWISH_BUILD_BENCHMARKS=OFF
cmake --build ../cpp/build --target plain_echo_server tls_echo_server --parallel 4
python -m unittest discover -s tests -v
```

The callback-exception and dangling-pointer tests use
`../cpp/build/examples/plain_echo_server`. They are skipped if the extension or
that executable is unavailable; the E2E tests also use `tls_echo_server`.

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
`close()` cleanup. Concurrent receivers are all notified. The first terminal event
determines the exception: `ConnectionAbortedError` for a local or clean remote
close, or `ConnectionError` for a transport failure. This applies to both client
and server connections.

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
  (bounded by `close_timeout`, default 5 seconds), then releases the transport;
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

The FastAPI router's `create_server()` and `mount_web_stream()` accept the same
`runtime`, `limits`, and shutdown options as `WebStreamServer`.

## Low-level compatibility

`web_stream_ext.PlainClient`, `TlsClient`, `PlainServer`, `TlsServer`, and their
synchronous callback/handle APIs remain available. Their callbacks run on the
native loop thread, and cross-thread send/close calls block until execution.
Configure/init those objects before running them; callback reconfiguration and
reinitialization during `run()` are unsupported. The high-level asyncio API uses
the separate Runtime implementation. Custom `connection_cls` constructors now
receive `(runtime, identifier, path, *, limits, close_timeout)` and must derive
from `WebStreamServerConnection` or implement the same lifecycle contract.
