# WiSH Python Bindings

Python bindings for the WiSH protocol (C++).

These bindings provide an asyncio-compatible API and utilize `nanobind` for efficient C++-to-Python interoperability.
The `libevent` event loop runs in a background thread, integrated with the Python `asyncio` event loop.

## Installation / Setup

This sub-project is intended to be used with a Python virtual environment (`venv`).

### Prerequisites
- Python 3.8+
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

## Usage Example

```python
import asyncio
from wish.client import connect

async def test_wish_client():
    uri = "wishs://example.com:443"
    
    # Establish connection
    async with connect(
        uri, 
        ca_file="ca.pem", 
        cert_file="client.pem", 
        key_file="client.key"
    ) as conn:
        
        # Send a message
        await conn.send("Hello over WiSH!")
        
        # Receive a message
        msg = await conn.recv()
        print("Received:", msg)

if __name__ == "__main__":
    asyncio.run(test_wish_client())
```

## Design Philosophy & Performance

To provide maximum throughput without blocking the Python event loop, these bindings rely on several specific architectural choices:

- **Background C++ Event Loop:** The core networking operations and TLS data streaming are handled natively by `libevent`. The `wish/client.py` module uses `loop.run_in_executor()` to spawn this C++ event loop in a background thread.
- **GIL Management:** The C++ extension releases the Python GIL while running its `libevent` dispatch loop and when performing heavy network I/O. The Python interpreter only re-acquires the GIL for split seconds to process incoming messages or to initiate send operations.
- **Micro-Bindings:** `nanobind` is deliberately chosen for its modern, zero-overhead approach to creating C++ bindings. It has a small binary footprint and fast execution speed when crossing the C++/Python boundary.
- **Thread-safe Asyncio Bridging:** When the C++ connection layer has an event (like a successful connection or a received message), it safely bridges back to the Python thread by triggering `loop.call_soon_threadsafe()`. Data is seamlessly funneled into an `asyncio.Queue` so that the Python user processes it using standard, non-blocking asynchronous loops.

