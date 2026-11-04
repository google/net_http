# Asyncio API

This document describes the supported Python connection, server, Runtime, and
flow-control behavior. For installation and a quick start, see the
[README](../README.md). For internal implementation boundaries, see the
[code map](../CODE_MAP.md). For FastAPI and ASGI integration, see the
[ASGI guide](asgi.md).

- [TLS identity verification](#tls-identity-verification)
- [Receiving and termination](#receiving-and-termination)
- [Asyncio entry points](#asyncio-entry-points)
- [Runtime and threading](#runtime-and-threading)
- [Flow control and shutdown](#flow-control-and-shutdown)

## TLS identity verification

TLS connections (`webstreams://` and `https://`) verify the certificate chain
against `ca_file` and the URI host against the certificate's Subject Alternative
Names (SAN). DNS hosts require a matching DNS SAN and are sent via SNI; IP
literals require a matching IP SAN. A Common Name (CN) alone is not accepted.

## Receiving and termination

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

Custom `connection_cls` constructors receive
`(runtime, identifier, path, *, limits, close_timeout)` and must derive from
`WebStreamServerConnection` or implement the same lifecycle contract.

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
  the asyncio loop's exception handler. Handlers can stop their own server or
  close their shared Runtime, including concurrently and during shutdown.
  Those callers are excluded from the server's task join, so shutdown does not
  wait on handlers that are themselves waiting for it. Other handlers are still
  joined and, when necessary, cancelled after the grace period.

Both client and server connections expose `send_text()`, `send_binary()`,
`send_metadata()`, and `recv_message() -> Message(opcode, data)`. `send()` and
`recv()` retain their convenient text/bytes behavior. Async iteration ends on
clean EOF and propagates transport failures.

`WebStreamError` subclasses `ConnectionError` and exposes `code` and `detail`.
Codes identify the stage (`connect`, `listen`, `transport`, `send`, `limit`,
`runtime`, or `closed`). The underlying C++ client still combines DNS, TCP, TLS,
and handshake failures into one connect error; framing and transport errors are
also combined. No finer diagnosis is inferred from an empty native callback.
