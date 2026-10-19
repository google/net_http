import asyncio
import random
from urllib.parse import urlparse
from typing import Optional

from .connection import (
    Connection, WEB_STREAM_OPCODE_TEXT, WEB_STREAM_OPCODE_BINARY,
    WEB_STREAM_OPCODE_METADATA,
)
from .runtime import (
    Limits, Runtime, WebStreamError, _UNSET, acquire_runtime, finish_cleanup,
    resolve_limits,
)


class WebStreamConnection(Connection):
    def __init__(self, host, port, tls, ca_file="", cert_file="", key_file="",
                 path="/", *, runtime=None, limits=None, close_timeout=5.0,
                 open_timeout=10.0, max_size=_UNSET, max_queue=_UNSET,
                 write_limit=_UNSET):
        if open_timeout is not None and open_timeout <= 0:
            raise ValueError("open_timeout must be positive or None")
        self.open_timeout = open_timeout
        self._initialize(path=path, limits=resolve_limits(
            limits, max_size=max_size, max_queue=max_queue, write_limit=write_limit),
            close_timeout=close_timeout)
        self._requested_runtime = runtime
        self._options = (host, port, tls, ca_file, cert_file, key_file, self.path)
        self._connect_started = False

    async def connect(self) -> "WebStreamConnection":
        self._check_loop()
        if self._connect_started or self._closing or self._released:
            raise RuntimeError("Connection can only be opened once")
        self._connect_started = True
        try:
            await asyncio.wait_for(self._open(), self.open_timeout)
        except BaseException:
            await finish_cleanup(self._loop.create_task(self.abort()), propagate_cancel=False)
            raise
        return self

    async def _open(self):
        self._runtime, self._owned_runtime = await acquire_runtime(self._requested_runtime)
        self._identifier = next(self._runtime._ids)
        self._runtime._objects[self._identifier] = self
        await self._runtime._request(
            "connect", self._identifier, *self._options, self.limits._native())


def process_exception(error):
    """Retry connection-stage failures; propagate application/configuration errors."""
    if isinstance(error, (OSError, asyncio.TimeoutError)):
        if not isinstance(error, WebStreamError) or error.code == "connect":
            return None
    return error


def backoff():
    """Yield retry delays with initial jitter and a sixty-second cap."""
    yield random.uniform(0, 5)
    delay = 3.0
    while True:
        yield delay
        delay = min(delay * 1.6, 60.0)


class _ConnectContextManager:
    def __init__(self, uri, ca_file="", cert_file="", key_file="", *,
                 process_exception=process_exception, reconnect_delays=backoff, **options):
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
        self.process_exception = process_exception
        self.reconnect_delays = reconnect_delays

    def __await__(self):
        return self._connect().__await__()

    async def _connect(self):
        if self.conn is not None and not self.conn._released:
            raise RuntimeError("This connector already has an active connection")
        self.conn = WebStreamConnection(*self._options, **self._keywords)
        return await self.conn.connect()

    async def __aenter__(self):
        return await self

    async def __aexit__(self, *_):
        await self.conn.close()

    async def __aiter__(self):
        delays = None
        while True:
            try:
                conn = await self
            except Exception as error:
                fatal = self.process_exception(error)
                if fatal is not None:
                    if fatal is error:
                        raise
                    raise fatal from error
                if delays is None:
                    delays = iter(self.reconnect_delays())
                await asyncio.sleep(next(delays))
                continue
            delays = None
            try:
                yield conn
            finally:
                await conn.close()


def connect(uri: str, ca_file: str = "", cert_file: str = "", key_file: str = "", *,
            runtime: Optional[Runtime] = None, limits: Optional[Limits] = None,
            close_timeout: Optional[float] = 5.0, open_timeout: Optional[float] = 10.0,
            max_size=_UNSET, max_queue=_UNSET, write_limit=_UNSET,
            process_exception=process_exception, reconnect_delays=backoff) -> _ConnectContextManager:
    resolved = resolve_limits(
        limits, max_size=max_size, max_queue=max_queue, write_limit=write_limit)
    return _ConnectContextManager(
        uri, ca_file, cert_file, key_file, runtime=runtime,
        limits=resolved, close_timeout=close_timeout, open_timeout=open_timeout,
        process_exception=process_exception, reconnect_delays=reconnect_delays)
