# Runnable asyncio recipes

Install the package as described in the [README](../README.md). With that
virtual environment active, run the commands below from `web-stream/python`.
Each script starts its own IPv4 loopback server on an available port and exits
after the exchange. No external peer, FastAPI, or TLS certificates are needed.

| Task | Command | Expected standard output (one line per item) |
| --- | --- | --- |
| Text and binary exchange | `python examples/echo.py` | `hello`, then `b'binary'` |
| Metadata with a shared explicit Runtime and byte limits | `python examples/metadata.py` | `3 b'metadata'` |
| Request EOF followed by a final response | `python examples/half_close.py` | `received 11 bytes` |
| Two sessions, reconnecting after clean EOF | `python examples/reconnect.py` | `session 1`, then `session 2` |
| Receive again after cancelling a waiting receive | `python examples/receive_timeout.py` | `receive timed out`, then `still usable` |

Each client and listener uses an async context manager. In the metadata recipe,
the explicit Runtime encloses both so its worker is joined last. In the
reconnect recipe, `finally` explicitly closes the retry async generator on early
exit, which awaits cleanup of its current connection. All scripts support the
package's Python 3.9 minimum.

## Adapting a recipe

- **Message types:** `echo.py` handles text and binary. Use `metadata.py` when
  opcode identity matters: `recv()` would return metadata as bytes, losing its
  distinction from binary.
- **Half-close:** `half_close.py` sends two separate binary messages, then
  `write_eof()` to finish the request. Receiving continues until the server
  replies and closes. Replacing EOF with `close()` would release the connection
  before collecting that final response.
- **Retries:** `reconnect.py` demonstrates session replacement without replaying
  requests. The connector retries opening failures; the loop body decides what
  to do with an established connection's failure. Application session recovery
  and duplicate prevention belong to your protocol.
- **Timeouts:** `receive_timeout.py` gates the server reply until the first
  receive has timed out. This checks that another receive can follow without
  losing a message. Send cancellation has different consequences: native
  submission may already have happened.
- **TLS:** replace the URI with `webstreams://...` and configure both peers as
  described in [TLS setup](../docs/asyncio-api.md#tls-identity-verification).
  The native TLS server requires a trusted client certificate. The files in
  `../cpp/certs` are test fixtures, not deployment credentials.
- **Framework routes:** use the separate
  [FastAPI/ASGI guide](../docs/asgi.md); metadata and half-close are unavailable
  through the WebSocket compatibility interface.

The [asyncio reference](../docs/asyncio-api.md) defines defaults, errors,
limits, and cancellation behavior. These examples illustrate that contract.
See [development](../docs/development.md#checking-documentation-examples) for
verification commands.
