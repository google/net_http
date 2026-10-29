# web-stream Python Code Map

This map describes the Python API, its native runtime, and the compatibility
bindings. See [README.md](README.md) for usage, limits, and build/test commands;
see the [C++ code map](../cpp/CODE_MAP.md) for framing and transport internals.

## Architecture and Thread Boundaries

The asyncio API currently uses HTTP/1.1 plain/TLS transports. The C++ HTTP/2
implementations are not exposed by this Runtime.

```text
asyncio thread
  client.connect() / WebStreamServer.start()
    -> Runtime._request() -> native command queue
  Connection send/recv/EOF + WebStreamServer handler tasks

libevent worker (one per Runtime)
  NativeRuntime::Wake() -> client/listener setup or stream operations
    -> PlainClient/TlsClient, PlainServer/TlsServer
    -> BufferEventWebStream (framing, read/write notifications)
  NativeRuntime::Emit() -> acquire GIL -> Python delivery callback

asyncio thread
  loop.call_soon_threadsafe() -> Runtime._dispatch()
    -> resolve operation Future, deliver Message, or accept connection
```

Native networking state belongs to the libevent worker. Python connection state,
Futures, connection registries, and handler tasks belong to the owning asyncio
loop. The GIL is released during native `run()` and acquired for event delivery;
waiting for a send result suspends its coroutine rather than the asyncio thread.

## Files and Responsibilities

| File | Main symbols and responsibility |
| --- | --- |
| [web_stream/__init__.py](web_stream/__init__.py) | Public exports: connection/client/server APIs, `Runtime`, `Limits`, `Message`, errors, opcodes, and FastAPI helpers. |
| [web_stream/runtime.py](web_stream/runtime.py) | `Runtime` owns the worker and native runtime, allocates identifiers, tracks objects/Futures, and dispatches native events. `Limits` validates budgets; `WebStreamError` carries stage/detail; `finish_cleanup` protects cleanup against repeated cancellation. |
| [web_stream/exceptions.py](web_stream/exceptions.py) | Public normal/failure termination errors, native stage/detail errors, and receive concurrency errors. |
| [web_stream/connection.py](web_stream/connection.py) | Shared `Connection` behavior: send serialization, receive credit return, persistent terminal notifications, opcode-preserving `Message`, text/bytes convenience methods, EOF/drain/close/abort, and native release. |
| [web_stream/client.py](web_stream/client.py) | `WebStreamConnection` acquires a Runtime and opens a native client under an optional deadline. `connect()` supports awaiting, async context management, and retry iteration; failed/cancelled entry aborts and releases the client. |
| [web_stream/server.py](web_stream/server.py) | `WebStreamServer` manages the listener, accepted connections, handler tasks, exception reporting, and shutdown. `WebStreamServerConnection` uses the common connection behavior. Custom connection classes receive `(runtime, identifier, path, *, limits, close_timeout)`. |
| [web_stream/fastapi.py](web_stream/fastapi.py) | `mount_web_stream` exposes FastAPI WebSocket routes through `ASGIWebSocketAdapter`, composing the app's lifespan to share state and order listener startup/handler shutdown. `WebStreamRouter` and `WebStreamSession` remain legacy standalone helpers. |
| [web_stream/asgi.py](web_stream/asgi.py) | Experimental `ASGIWebSocketAdapter` invokes an ASGI 3 app with WebSocket scopes over established streams. Maps text/binary and termination, validates event ordering, closes on app exit, and leaves lifespan to the host. Transport compatibility limits are documented in the README. |
| [src/runtime.cc](src/runtime.cc) | `NativeRuntime`, exposed privately as `_Runtime` and `_Limits`. Owns the event base, command queue, native clients/listeners, stream state, flow-control accounting, operation progression, and event emission. `BindRuntime` registers it. |
| [src/web_stream_ext.cc](src/web_stream_ext.cc) | Module initialization and the original synchronous Plain/TLS bindings. Calls `BindRuntime`; independently implements legacy dispatch, borrowed-stream handles, invalidation, Python callback ownership, and GC slots. |

### Native Operation and Event Routing

In `src/runtime.cc`, `Post` queues commands under a mutex and wakes the base;
`Wake` executes them outside that mutex. `State` records a borrowed stream
pointer, client ownership where applicable, receive credit, EOF, and pending
operations. `Listener` owns a C++ server. Server streams remain owned by that
server, not by `State`.

`Attach` installs callbacks on `BufferEventWebStream`. `Progress` handles queued
send/drain/EOF operations and resumes from `SetOnWritable` notifications.
`Consume` returns receive credit. `Release`, `RemoveListener`, and `Shutdown`
invalidate/release state and complete or fail outstanding operations.

Events cross through `Emit` into `Runtime._dispatch`:

| Event | asyncio-side destination |
| --- | --- |
| `started`, `stopped` | Worker lifecycle Futures and failure of remaining requests/objects. |
| `result` | Operation Future, with errors converted to `WebStreamError`. |
| `open` | Existing client path update, or `WebStreamServer._accept` for an accepted stream. |
| `message` | `Connection._feed_message`, preserving opcode and bytes. |
| `terminal` | Persistent inbound EOF/error via `Connection._terminate`. Clean inbound EOF leaves outbound sending available. |
| `destroyed` | Native transport teardown notification used by `wait_closed`. |
| `listener_error` | Server error reporting and shutdown of the affected listener. |

## Ownership, Flow Control, and Shutdown

- An explicit `Runtime` can serve multiple clients/listeners and stays alive until
  closed. `acquire_runtime` / `release_runtime` share a default Runtime per asyncio
  loop and stop/join it when its last client/listener owner releases it.
  `thread_factory` controls worker construction. Runtime/connection operations
  must be called from their owning asyncio loop.
- Native receive credit is charged before Python event delivery, including a
  per-message cost for empty messages. `recv_message` returns credit when the
  application takes a message. Native reads pause/resume using
  `BufferEventWebStream::SetReadEnabled`; the parser's current batch may cross
  the watermark. Limits are buffer budgets, not exact process memory bounds.
- `Connection._write_lock` serializes sends. Cancellation while waiting for that
  lock drops the operation; after native submission the internal task continues
  holding the lock until completion or release. Native output watermarks control
  send completion; `drain` and outbound EOF wait for zero buffered output.
- `write_eof` closes the outbound direction; inbound EOF ends `recv` while still
  allowing a final outbound response. `close` flushes EOF with a timeout, then
  releases native state. `abort` skips flushing. Buffered messages remain readable
  before the first terminal error, including after native release.
- Server shutdown stops accepting, closes connections, waits for handlers, then
  cancels and joins remaining handlers after the grace period. Cancellation must
  be cooperative. A handler closing its own server/Runtime is excluded from that
  shutdown's task join to avoid waiting for itself.
- `Runtime.close` cleans up registered objects before stopping/joining its worker.
  A weak finalizer stops an unreferenced Runtime; `_shutdown_workers` is the
  interpreter-exit fallback and does not run application handler cleanup.

The C++ core still combines DNS/TCP/TLS/handshake failures into a connect failure,
and framing/transport failures into a stream failure. Error translation lives in
`runtime.py`; finer causes require changes to the C++ error callbacks.

## Legacy Binding Lifetime and GC

The synchronous `PlainClient`, `TlsClient`, `PlainServer`, `TlsServer`, and
`BufferEventWebStream` Python handle in `src/web_stream_ext.cc` remain a separate
execution path. Their `EventLoopDispatcher` blocks cross-thread callers until
execution; it is not the asyncio Runtime's command queue.

`WebStreamHandlerRef` holds a nullable borrowed `WebStream*`.
`ServerHandlerRegistry` invalidates retained handles at shutdown. `active_owner`
roots the Python handle while its native server stream is active, preventing GC
from clearing a live callback cycle. Terminal/shutdown paths clear callbacks and
that root; GC traverse/clear slots collect isolated cycles afterwards.
`ClearCallbacks` and callback setters release old Python references outside the
handle mutex because decref can run reentrant Python finalizers. The Runtime
binding has its own traverse/clear slots for its event-delivery callback.

## Tests and Build Entry Points

| Tests | Coverage |
| --- | --- |
| [test_asyncio_api.py](tests/core/test_asyncio_api.py) | Awaitable connections, retry and cancellation, strict message types and iterable parts, timeout cleanup, flow-control arguments, IPv6, ephemeral server ports, and scheduled/awaited shutdown. |
| [test_asgi.py](tests/asgi/test_asgi.py) | ASGI event/state/cleanup contracts and raw ASGI integration, without FastAPI dependencies. |
| [test_integration.py](tests/fastapi/test_integration.py) | FastAPI/Starlette routing, dependencies, middleware, and externally managed lifespan. |
| [test_fastapi_mount.py](tests/fastapi/test_fastapi_mount.py) | FastAPI mounting via the ASGI lifespan protocol, routing/dependencies/middleware, state, startup failure/cancellation, multiple listeners, and ordered shutdown. |
| [test_runtime.py](tests/core/test_runtime.py) | Shared/default Runtime ownership, custom worker factory, asyncio progress during native waits, receive/send backpressure, message types, half-close, size limits, cancellation, self-shutdown, GC, and interpreter exit. |
| [test_connect_cancellation.py](tests/core/test_connect_cancellation.py), [test_recv_termination.py](tests/core/test_recv_termination.py) | Failed/cancelled connect cleanup, repeated cancellation, late notifications, buffered messages, receive exclusion, and persistent termination errors. |
| [test_python_server.py](tests/core/test_python_server.py), [test_server_close.py](tests/core/test_server_close.py) | Server echo/routing, waiting-handler shutdown, clean protocol EOF, and cleanup failure reporting. |
| [test_callback_dispatch.py](tests/core/test_callback_dispatch.py), [test_callback_exceptions.py](tests/core/test_callback_exceptions.py) | Legacy callback-thread sends/close, pending-operation cancellation, embedded NUL preservation, and unraisable exception reporting. |
| [test_dangling_pointer.py](tests/core/test_dangling_pointer.py), [test_server_handler_lifetime.py](tests/core/test_server_handler_lifetime.py) | Retained-handle safety, invalidation, active callback rooting, and stopped-handle cycle collection. |
| [test_e2e.py](tests/core/test_e2e.py), [test_idle_connection.py](tests/core/test_idle_connection.py), [test_tls_identity.py](tests/core/test_tls_identity.py) | Plain/TLS integration, idle survival, certificate identity/chain verification, and SNI. |
| [test_prerequisites.py](tests/core/test_prerequisites.py) | Missing extensions, echo servers, OpenSSL, and selected FastAPI dependencies cause failure rather than skips. |

[test_client.py](tests/core/test_client.py) is a manually run client example, not a
unittest test case. Core EOF, read-resume, and oversized-frame tests live in
[`../cpp/src/buffer_event_web_stream_test.cc`](../cpp/src/buffer_event_web_stream_test.cc).

[`pyproject.toml`](pyproject.toml) declares Python 3.9+ and the scikit-build-core /
nanobind build. [`CMakeLists.txt`](CMakeLists.txt) compiles both binding sources into
`web_stream_ext`, links the sibling C++ library and libevent threading support,
and installs the extension into `web_stream`. Standalone builds enable
`WISH_PYTHON_BUILD_TESTS` and provide `check-python` for all suites plus
`check-python-core`, `check-python-asgi`, and `check-python-fastapi` for explicit
selection. The core/all targets build both HTTP/1 echo servers; ASGI/FastAPI only
need the extension. `tests/run_tests.py` loads the chosen extension alongside
current Python sources and passes executable paths to the core suite. CTest
registers the three suites separately with matching labels. Required artifacts
and selected dependencies are never skipped. Package builds disable test
prerequisites by default; unrelated C++ examples/tests remain disabled.
