# Python development

See the [README](../README.md) for prerequisites and installation, the
[asyncio API](asyncio-api.md) and [ASGI guide](asgi.md) for supported behavior,
and the [code map](../CODE_MAP.md) for implementation and test locations.

Run all commands below from `web-stream/python`, with your virtual environment
active.

## Running Tests

Tests are grouped by their dependency requirements:

| Directory | Coverage and prerequisites |
| --- | --- |
| `tests/core/` | Native bindings, Plain/TLS connections, Runtime, flow control, and safety. Requires the extension, both echo servers, and the `openssl` command. |
| `tests/asgi/` | Raw ASGI adapter contracts and transport integration. Requires the extension, without FastAPI. |
| `tests/fastapi/` | FastAPI/Starlette routing, middleware, dependencies, and mounting/lifespan. Requires the extension and the `fastapi` extra. |

With your virtual environment active and `nanobind` installed, run these commands
from `web-stream/python` to build prerequisites and run every suite:

```bash
python -m pip install 'fastapi>=0.115,<1'
cmake -S . -B build/tests -DPython_EXECUTABLE="$VIRTUAL_ENV/bin/python"
cmake --build build/tests --target check-python --parallel 4
```

`check-python` builds the native extension and the `plain_echo_server` and
`tls_echo_server` test prerequisites before running unittest discovery. Tests use
current Python sources and the extension from this build without reinstalling
the package. CMake supplies the actual artifact paths for custom build directories
and multi-configuration generators. Missing required artifacts, `openssl`, or
FastAPI dependencies are errors, not skipped tests. The IPv6 case can still skip
on hosts without an IPv6 loopback interface.

Select a suite explicitly when only its prerequisites are installed:

```bash
cmake --build build/tests --target check-python-core --parallel 4
cmake --build build/tests --target check-python-asgi --parallel 4
cmake --build build/tests --target check-python-fastapi --parallel 4
```

FastAPI is unnecessary for the core and raw ASGI suites. Selecting the FastAPI
suite without its dependency fails rather than silently omitting its tests.
`test-fastapi` is the test extra; `test-asgi` remains a compatibility alias.

Standalone CMake builds enable `WEB_STREAM_PYTHON_BUILD_TESTS` by default. A regular
`cmake --build build/tests` also builds all native test prerequisites. Afterwards,
CTest runs the three suites as `python_core_tests`, `python_asgi_tests`, and
`python_fastapi_tests`; labels `core`, `asgi`, and `fastapi` allow selection, e.g.
`ctest --test-dir build/tests -L core --output-on-failure`. Wheel/editable package
builds disable test prerequisites by default. Explicitly enable them with
`-DWEB_STREAM_PYTHON_BUILD_TESTS=ON` when configuring a development build.

Wheel builds compile the extension target and install only the `python` CMake
component. Third-party headers, tools, and static libraries are excluded from
the wheel.

For an installed package, direct unittest discovery is also supported with
`python -m unittest discover -s tests -t . -v`, or `-s tests/core` (similarly
`tests/asgi` and `tests/fastapi`) to select a suite. Keep `-t .` so the test package
`tests.fastapi` cannot shadow the FastAPI dependency. Direct discovery looks for
echo servers in `../cpp/build/examples` unless `WEB_STREAM_PLAIN_ECHO_SERVER` and
`WEB_STREAM_TLS_ECHO_SERVER` specify their paths. Missing binaries fail there too;
use `check-python` to build and run them together.

### ASGI and FastAPI test coverage

Run raw ASGI tests independently, without installing FastAPI:

```bash
cmake --build build/tests --target check-python-asgi --parallel 4
```

For the FastAPI/Starlette compatibility and mounting tests, install the test
extra and explicitly run their suite:

```bash
pip install '.[test-fastapi]'
cmake --build build/tests --target check-python-fastapi --parallel 4
```

`tests/asgi/` covers raw ASGI state transitions, real web-stream exchange, close,
and cleanup. `tests/fastapi/` covers FastAPI routing/query/path dependencies,
Starlette authentication middleware, externally managed lifespan/state, unknown
routes, and mounting through the ASGI lifespan protocol. Missing framework
dependencies fail the selected suite. Startup failures, cancellation, state
sharing, multiple listeners, and shutdown ordering are also exercised.
