# WebStream for Python

Exchange text, binary, and metadata messages over web-stream with asyncio
clients and servers. The API includes flow control, TLS, half-close, and
connection cleanup through async context managers. An experimental adapter can
also run FastAPI WebSocket routes over web-stream.

Message boundaries are preserved, and each direction can end independently.
Use it when both peers implement web-stream and need a sequence of typed
messages, including protocols that finish a request before receiving a reply.

## Choosing an interface

| Your application needs | Start with |
| --- | --- |
| An asyncio message client or server | `connect()` and `serve()` in the [asyncio API](docs/asyncio-api.md#asyncio-entry-points) |
| Metadata messages or a response after request EOF | `recv_message()` and `write_eof()` in the [connection API](docs/asyncio-api.md#connection-methods) |
| Existing FastAPI WebSocket routes | `mount_web_stream()` in the [ASGI guide](docs/asgi.md#fastapi-integration), after checking its compatibility table |

The peer must implement web-stream. This package does not connect to an ordinary
HTTP endpoint or RFC 6455 WebSocket server; browser `WebSocket` clients cannot
connect directly. The Python Runtime currently exposes HTTP/1.1 plain/TLS
transports. The C++ implementation's HTTP/2 transports are not exposed here.

The ASGI adapter is experimental: applications requiring request headers,
cookies, WebSocket handshake negotiation, or WebSocket close frames need to
check the [compatibility limits](docs/asgi.md#compatibility-at-a-glance).
Ping/pong keepalive is not yet available in the Python API.

## Installation

Build from this checkout with Python 3.9+, CMake 3.24+ (CMake 4 is supported),
and a C++17 toolchain. Keep the sibling `web-stream/cpp` source directory:
the Python build compiles the native implementation using nanobind. CMake
fetches native dependencies, including BoringSSL and libevent; a first build
needs network access and Git. See the
[dependency configuration](../cpp/cmake/Dependencies.cmake).

Run from `web-stream/python`:

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install .
```

For an editable development install, use `python -m pip install -e .`.
FastAPI integration additionally needs `python -m pip install '.[fastapi]'`;
an ASGI host such as Uvicorn is installed separately. Build/test commands are
in the [development guide](docs/development.md).

## Try a local exchange

With the package installed, save this as `quickstart.py` and run
`python quickstart.py`. It starts a loopback server on an available port,
prints `hello`, and closes the connections, listener, and default worker.
No external service or certificates are needed.

```python
import asyncio
from web_stream import connect, serve


async def echo(conn):
    async for message in conn:
        await conn.send(message)


async def main():
    async with serve(echo, "127.0.0.1", 0) as server:
        async with connect(f"webstream://127.0.0.1:{server.port}") as conn:
            await conn.send("hello")
            print(await conn.recv())


if __name__ == "__main__":
    asyncio.run(main())
```

For a remote TLS peer, use `webstreams://host:port/path` and configure trusted
certificates. The native TLS server requires client certificates. Read
[TLS setup and identity verification](docs/asyncio-api.md#tls-identity-verification)
before adapting this example.

## Documentation

Both application authors and coding agents can use the same references:

- [Asyncio API](docs/asyncio-api.md): public entry points, argument defaults,
  message types, errors, ownership, and threading.
- [Limit configuration](docs/asyncio-api.md#flow-control-and-shutdown): byte
  budgets versus message-count watermarks. Selecting one individual limit
  option changes the defaults for the other individual options too.
- [EOF, cleanup, and cancellation](docs/asyncio-api.md#eof-and-cleanup): choose
  `write_eof()`, `close()`, or `abort()`; understand what send completion means.
- [Runnable recipes](examples/README.md): text/binary exchange, metadata with a
  shared Runtime, half-close, reconnection, and receive timeouts.
- [FastAPI and ASGI](docs/asgi.md): integration, lifespan, and compatibility.
- [Development guide](docs/development.md): build and test commands.
- [Code map](CODE_MAP.md): implementation boundaries and relevant tests, when
  you need to inspect or modify the library.
