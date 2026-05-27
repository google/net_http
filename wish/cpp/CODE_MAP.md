# web-stream C++ Code Map

This document provides a detailed breakdown of the file structure and component architecture for the `web-stream` C++ implementation.

## Architecture Overview

`web-stream` is a lightweight streaming protocol layered on top of HTTP/1.1 (via `Transfer-Encoding: chunked`) and HTTP/2 (via DATA frames). This C++ implementation provides a transport-agnostic interface (`WebStream`) with full support for cleartext and TLS/mTLS connections.

```
+-------------------------------------------------------------+
|                      WebStream (Interface)                  |
+------------------------------+------------------------------+
                               |
       +-----------------------+-----------------------+
       |                                               |
+------v----------------------+             +----------v-------------------+
|    BufferEventWebStream     |             |       NGHTTP2WebStream       |
| (HTTP/1.1 + Libevent/Wslay) |             |   (HTTP/2 + nghttp2/Wslay)   |
+-----------------------------+             +------------------------------+
```

---

## Directory & File Structure

### 1. `src/` - Core Library Implementation

#### Core Abstractions & Protocol Standards
* [`src/web_stream.h`](src/web_stream.h): Base abstract class `WebStream` defining standard event callbacks (`SetOnMessage`, `SetOnClose`, `SetOnError`) and messaging primitives (`SendText`, `SendBinary`, `SendMetadata`, `Close`).
* [`src/wish_opcodes.h`](src/wish_opcodes.h): Framing opcode definitions (`WEB_STREAM_OPCODE_TEXT`, `WEB_STREAM_OPCODE_BINARY`, `WEB_STREAM_OPCODE_METADATA`).

#### Stream Framers
* [`src/buffer_event_web_stream.h`](src/buffer_event_web_stream.h), [`src/buffer_event_web_stream.cc`](src/buffer_event_web_stream.cc): `BufferEventWebStream` class implementation handling HTTP/1.1 chunked encoding and wslay framing over libevent `bufferevent`.
* [`src/nghttp2_web_stream.h`](src/nghttp2_web_stream.h), [`src/nghttp2_web_stream.cc`](src/nghttp2_web_stream.cc): `NGHTTP2WebStream` class implementation handling HTTP/2 DATA frame streaming using nghttp2 and wslay.
* [`src/buffer_event_web_stream_test.cc`](src/buffer_event_web_stream_test.cc): Unit tests for HTTP/1.1 framing and lifecycle management.
* [`src/nghttp2_web_stream_test.cc`](src/nghttp2_web_stream_test.cc): Unit tests for HTTP/2 streaming framing.

#### Handshake Engine
* [`src/handshake.h`](src/handshake.h), [`src/handshake.cc`](src/handshake.cc): `ClientHandshake` and `ServerHandshake` classes implementing HTTP/1.1 `web-stream` upgrade handshakes over libevent.
* [`src/handshake_test.cc`](src/handshake_test.cc): Handshake unit tests.

#### Security & TLS Utilities
* [`src/tls_context.h`](src/tls_context.h), [`src/tls_context.cc`](src/tls_context.cc): OpenSSL `SSL_CTX` configuration wrapper for TLS and mTLS setup.

#### Transport Servers & Clients
* **HTTP/1.1 Plain (Cleartext)**:
  * [`src/plain_server.h`](src/plain_server.h), [`src/plain_server.cc`](src/plain_server.cc): `PlainServer` for listening and accepting HTTP/1.1 `web-stream` connections over cleartext TCP.
  * [`src/plain_client.h`](src/plain_client.h), [`src/plain_client.cc`](src/plain_client.cc): `PlainClient` for establishing HTTP/1.1 `web-stream` connections over cleartext TCP.
* **HTTP/1.1 TLS**:
  * [`src/tls_server.h`](src/tls_server.h), [`src/tls_server.cc`](src/tls_server.cc): `TlsServer` for HTTP/1.1 `web-stream` over OpenSSL TLS/mTLS.
  * [`src/tls_client.h`](src/tls_client.h), [`src/tls_client.cc`](src/tls_client.cc): `TlsClient` for HTTP/1.1 `web-stream` client connections over TLS/mTLS.
* **HTTP/2 Plain (h2c)**:
  * [`src/h2_server.h`](src/h2_server.h), [`src/h2_server.cc`](src/h2_server.cc): `H2Server` for cleartext HTTP/2 server streams using nghttp2.
  * [`src/h2_client.h`](src/h2_client.h), [`src/h2_client.cc`](src/h2_client.cc): `H2Client` for cleartext HTTP/2 client streams using nghttp2.
  * [`src/h2_server_test.cc`](src/h2_server_test.cc): Integration unit tests for `H2Server`.
* **HTTP/2 TLS (mTLS)**:
  * [`src/h2_tls_server.h`](src/h2_tls_server.h), [`src/h2_tls_server.cc`](src/h2_tls_server.cc): `H2TlsServer` for HTTP/2 over OpenSSL TLS/mTLS.
  * [`src/h2_tls_client.h`](src/h2_tls_client.h), [`src/h2_tls_client.cc`](src/h2_tls_client.cc): `H2TlsClient` for HTTP/2 client connections over TLS/mTLS.

---

### 2. `examples/` - Sample Applications

Demonstrates standard usage patterns for client and server implementations across all transport modes:
* [`examples/plain_hello_client.cc`](examples/plain_hello_client.cc) & [`examples/plain_echo_server.cc`](examples/plain_echo_server.cc): HTTP/1.1 cleartext echo client and server.
* [`examples/tls_hello_client.cc`](examples/tls_hello_client.cc) & [`examples/tls_echo_server.cc`](examples/tls_echo_server.cc): HTTP/1.1 TLS/mTLS echo client and server.
* [`examples/h2_hello_client.cc`](examples/h2_hello_client.cc) & [`examples/h2_echo_server.cc`](examples/h2_echo_server.cc): HTTP/2 cleartext (h2c) echo client and server.
* [`examples/h2_tls_hello_client.cc`](examples/h2_tls_hello_client.cc) & [`examples/h2_tls_echo_server.cc`](examples/h2_tls_echo_server.cc): HTTP/2 TLS (mTLS) echo client and server.
* [`examples/CMakeLists.txt`](examples/CMakeLists.txt): CMake rules for building example binaries.

---

### 3. `benchmark/` - Performance & Stress Testing

Tools for benchmarking QPS and throughput:
* [`benchmark/high_qps_client.cc`](benchmark/high_qps_client.cc): Multi-stream high-throughput stress test client.
* [`benchmark/plain_client.cc`](benchmark/plain_client.cc), [`benchmark/tls_client.cc`](benchmark/tls_client.cc): Standalone benchmarking client binaries for HTTP/1.1 plain/TLS.
* [`benchmark/benchmark.py`](benchmark/benchmark.py): Automated python benchmark runner script.
* [`benchmark/CMakeLists.txt`](benchmark/CMakeLists.txt): CMake build rules for benchmark targets.

---

### 4. Supporting Directories & Build Infrastructure

* [`certs/`](certs/): Contains test certificates, private keys, and CA files (`ca.crt`, `server.crt`, `client.crt`, etc.) used for testing and mTLS examples.
* [`deployments/`](deployments/): Kubernetes manifests (`echo-server.yaml`, `benchmark.yaml`, `stress.yaml`, `tls-echo-server.yaml`) for containerized deployment.
* [`patches/`](patches/): Patch files applied during build (e.g. [`patches/wslay.patch`](patches/wslay.patch) for framing integration).
* [`scripts/`](scripts/): Container image build and push utilities ([`scripts/build-and-push.sh`](scripts/build-and-push.sh)).
* [`CMakeLists.txt`](CMakeLists.txt): Main project CMake configuration file.
* [`Makefile`](Makefile): Convenience Makefile targets for building, running tests, ASan/LSan, and Docker images.
* [`Dockerfile.echo_server`](Dockerfile.echo_server), [`Dockerfile.benchmark`](Dockerfile.benchmark): Docker container recipes for echo server and benchmarking tools.
