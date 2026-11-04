# web-stream development guidance

These instructions apply to all files under `web-stream/`, including native
code, Python bindings, tests, and documentation.

## Python API stability

Preserve the documented user-facing contracts of:

- The high-level asyncio message-streaming API: client connections, servers,
  message sending and receiving, asynchronous iteration, and asynchronous
  context management.
- The ASGI application interface.
- The FastAPI integration.

Compatibility includes observable behavior such as errors, timeouts,
cancellation, flow control, and connection shutdown and resource lifetimes,
not just function names and signatures.

Exposing a C++ class or function to Python through nanobind does not by itself
make it a supported public API or establish a stability guarantee. Bindings may
exist solely to connect internal implementation layers. Evaluate changes to
those bindings by their effect on the user-facing contracts above; do not
classify an internal symbol change or removal as a breaking public API change
solely because nanobind exposed it.

Consult `python/README.md` for supported behavior and limitations and
`python/CODE_MAP.md` for implementation boundaries. Keep the user-facing
contracts intact when simplifying or replacing internal bindings.
