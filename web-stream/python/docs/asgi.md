# FastAPI and ASGI integration

This guide describes the FastAPI helper and experimental ASGI WebSocket adapter,
including their supported behavior and transport compatibility limits. See the
[README](../README.md) for installation, the [asyncio API](asyncio-api.md) for
Runtime, TLS, flow-control, and shutdown options, and the
[development guide](development.md) for build and test commands.

- [FastAPI integration](#fastapi-integration)
- [Experimental ASGI WebSocket adapter](#experimental-asgi-websocket-adapter)

Run installation and test commands from `web-stream/python`.

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
close. Sends await the existing transport flow control. A concurrent
`websocket.close` starts transport shutdown even while a send is blocked by
backpressure; the connection's `close_timeout` bounds graceful flushing before
transport release. Queued and later sends fail with `OSError`, and a transport
close timeout remains observable to the caller. App return, exceptions,
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
