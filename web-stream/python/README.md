# WebStream Python Bindings

Python bindings for the web-stream protocol (C++).

These bindings provide an asyncio-compatible API and utilize `nanobind` for
efficient C++-to-Python interoperability. The `libevent` event loop runs in a
background thread, integrated with the Python `asyncio` event loop.

## Documentation

- [Asyncio API](docs/asyncio-api.md): connections and servers, TLS, Runtime,
  message types, limits, cancellation, EOF, and shutdown contracts.
- [FastAPI and ASGI integration](docs/asgi.md): usage, lifespan, migration, and
  experimental adapter compatibility limits.
- [Development guide](docs/development.md): build/test commands and prerequisites
  for the core, ASGI, and FastAPI suites.
- [Code map](CODE_MAP.md): implementation structure, thread/ownership boundaries,
  and test locations.

## Installation / Setup

This sub-project is intended to be used with a Python virtual environment (`venv`).

### Prerequisites

- Python 3.9+
- CMake 3.24+ (including CMake 4)
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

## Usage Example

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

## Important behavior and limitations

- The Python Runtime currently supports HTTP/1.1 plain/TLS transports; the C++
  HTTP/2 implementations are not exposed by this Runtime.
- TLS verifies the certificate chain and the URI host using Subject Alternative
  Names; a Common Name alone is not accepted. See
  [TLS identity verification](docs/asyncio-api.md#tls-identity-verification).
- Connections belong to one asyncio loop. Use async context managers to manage
  resources. Receive calls allow only one waiting receiver per connection;
  queued messages remain readable before the first terminal error. See
  [receiving and termination](docs/asyncio-api.md#receiving-and-termination) and
  [Runtime and threading](docs/asyncio-api.md#runtime-and-threading).
- Send completion does not acknowledge peer receipt. Cancelling a submitted send
  may still send bytes. Buffer limits are not an exact process memory bound.
  See [flow control and shutdown](docs/asyncio-api.md#flow-control-and-shutdown)
  for limits, cancellation, half-close, and cleanup guarantees.
- The ASGI adapter is experimental and does not provide full ASGI WebSocket
  protocol conformance. Header/cookie authentication, handshake negotiation,
  metadata, and half-close have compatibility limits. Read the
  [ASGI guide](docs/asgi.md#experimental-asgi-websocket-adapter) before integrating
  an application. Ping/pong keepalive is pending in the Python API.
