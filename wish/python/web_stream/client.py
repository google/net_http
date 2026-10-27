import asyncio
from urllib.parse import urlparse
from typing import Optional

from .connection import (
    Connection, WEB_STREAM_OPCODE_TEXT, WEB_STREAM_OPCODE_BINARY,
    WEB_STREAM_OPCODE_METADATA,
)
from .runtime import Limits, Runtime, acquire_runtime, finish_cleanup


class WebStreamConnection(Connection):
    def __init__(self, host, port, tls, ca_file="", cert_file="", key_file="",
                 path="/", *, runtime=None, limits=None, close_timeout=5.0):
        self._initialize(path=path, limits=limits, close_timeout=close_timeout)
        self._requested_runtime = runtime
        self._options = (host, port, tls, ca_file, cert_file, key_file, self.path)
        self._connect_started = False

    async def connect(self) -> "WebStreamConnection":
        self._check_loop()
        if self._connect_started or self._closing or self._released:
            raise RuntimeError("Connection can only be opened once")
        self._connect_started = True
        try:
            self._runtime, self._owned_runtime = await acquire_runtime(self._requested_runtime)
            self._identifier = next(self._runtime._ids)
            self._runtime._objects[self._identifier] = self
            await self._runtime._request(
                "connect", self._identifier, *self._options, self.limits._native())
        except BaseException:
            await finish_cleanup(self._loop.create_task(self.abort()), propagate_cancel=False)
            raise
        return self


class _ConnectContextManager:
    def __init__(self, uri, ca_file="", cert_file="", key_file="", **options):
        parsed = urlparse(uri)
        if parsed.scheme not in ("webstream", "webstreams", "http", "https"):
            raise ValueError("Unsupported web-stream URI scheme")
        if not parsed.hostname or parsed.username is not None or parsed.fragment:
            raise ValueError("URI must have a host, without userinfo or fragment")
        tls = parsed.scheme in ("webstreams", "https")
        path = parsed.path or "/"
        if parsed.query:
            path += "?" + parsed.query
        self._options = (parsed.hostname, parsed.port or (443 if tls else 80),
                         tls, ca_file, cert_file, key_file, path)
        self._keywords = options
        self.conn = None

    async def __aenter__(self):
        self.conn = WebStreamConnection(*self._options, **self._keywords)
        return await self.conn.connect()

    async def __aexit__(self, *_):
        await self.conn.close()


def connect(uri: str, ca_file: str = "", cert_file: str = "", key_file: str = "", *,
            runtime: Optional[Runtime] = None, limits: Optional[Limits] = None,
            close_timeout: float = 5.0) -> _ConnectContextManager:
    return _ConnectContextManager(
        uri, ca_file, cert_file, key_file, runtime=runtime,
        limits=limits, close_timeout=close_timeout)
