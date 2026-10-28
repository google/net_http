import asyncio
import socket

from .connection import Connection
from .runtime import (
    WebStreamError, _UNSET, acquire_runtime, finish_cleanup, release_runtime,
    resolve_limits,
)


class WebStreamServerConnection(Connection):
    def __init__(self, runtime, identifier, path="/", *, limits=None, close_timeout=5.0):
        self._initialize(runtime, identifier, path, limits, close_timeout)


class WebStreamServer:
    def __init__(self, port, tls=False, ca_file="", cert_file="", key_file="",
                 connection_cls=WebStreamServerConnection, *, runtime=None,
                 limits=None, max_connections=10000, shutdown_timeout=5.0,
                 close_timeout=5.0, host=None, max_size=_UNSET,
                 max_queue=_UNSET, write_limit=_UNSET):
        if (shutdown_timeout < 0 or max_connections < 0 or
                (close_timeout is not None and close_timeout <= 0)):
            raise ValueError("Invalid server limits or timeouts")
        if not isinstance(port, int) or isinstance(port, bool) or not 0 <= port <= 65535:
            raise ValueError("port must be between 0 and 65535")
        self.port = port
        self.host = host
        self.tls = tls
        self.limits = resolve_limits(
            limits, max_size=max_size, max_queue=max_queue, write_limit=write_limit)
        self.shutdown_timeout = shutdown_timeout
        self.close_timeout = close_timeout
        self._options = (port, tls, ca_file, cert_file, key_file)
        self._max_connections = max_connections
        self._connection_cls = connection_cls
        self._requested_runtime = runtime
        self._runtime = None
        self._owned_runtime = False
        self._identifier = None
        self._loop = None
        self._stream_handler = None
        self._connections = set()
        self._tasks = set()
        self._start_task = None
        self._stop_task = None
        self._stopping = False
        self._close_connections = False
        self._close_requested = asyncio.Event()
        self._closed_event = asyncio.Event()
        self._shutdown_callers = set()

    @property
    def connections(self):
        return set(self._connections)

    def is_serving(self):
        return (self._start_task is not None and self._start_task.done() and
                not self._stopping and self._runtime is not None and
                self._runtime.is_running and self._identifier is not None)

    def set_stream_handler(self, handler):
        if handler is not None and not callable(handler):
            raise TypeError("handler must be callable")
        self._stream_handler = handler

    async def start(self):
        loop = asyncio.get_running_loop()
        if self._loop is not None and loop is not self._loop:
            raise RuntimeError("Server must be used from its owning asyncio loop")
        if self._stopping:
            raise RuntimeError("Server is stopped")
        self._loop = loop
        if self._start_task is None:
            self._start_task = loop.create_task(self._start())
        try:
            await asyncio.shield(self._start_task)
        except BaseException:
            await finish_cleanup(loop.create_task(self.stop()), propagate_cancel=False)
            raise

    async def _start(self):
        self._runtime, self._owned_runtime = await acquire_runtime(self._requested_runtime)
        self._identifier = next(self._runtime._ids)
        self._runtime._objects[self._identifier] = self
        host = ""
        if self.host is not None:
            addresses = await self._loop.getaddrinfo(
                self.host, self.port,
                family=socket.AF_INET6 if ":" in self.host else socket.AF_INET,
                type=socket.SOCK_STREAM, flags=socket.AI_PASSIVE)
            host = addresses[0][4][0]
        port = await self._runtime._request(
            "listen", self._identifier, *self._options,
            self.limits._native(), self._max_connections, host)
        self.port = int(port)

    def _accept(self, identifier, path):
        if self._stopping:
            self._runtime._discard(identifier)
            return
        try:
            conn = self._connection_cls(
                self._runtime, identifier, path, limits=self.limits,
                close_timeout=self.close_timeout)
        except Exception as error:
            self._runtime._discard(identifier)
            self._loop.call_exception_handler({
                "message": "Failed to construct web-stream connection",
                "exception": error, "server": self})
            return
        self._runtime._objects[identifier] = conn
        self._connections.add(conn)

        async def handle():
            try:
                if self._stream_handler is not None:
                    await self._stream_handler(conn)
            finally:
                try:
                    await conn.close()
                finally:
                    self._connections.discard(conn)

        task = self._loop.create_task(handle())
        self._tasks.add(task)

        def completed(task):
            self._tasks.discard(task)
            self._shutdown_callers.discard(task)
            if not task.cancelled():
                error = task.exception()
                if error is not None:
                    self._loop.call_exception_handler({
                        "message": "Unhandled web-stream handler exception",
                        "exception": error, "task": task, "server": self})
        task.add_done_callback(completed)

    def _runtime_stopped(self):
        for conn in list(self._connections):
            conn._runtime_stopped()
        for task in self._tasks:
            task.cancel()

    async def stop(self):
        """Stop accepting, close connections, and join handler tasks."""
        self.close()
        await finish_cleanup(self._stop_task)

    def close(self, close_connections=True):
        """Schedule shutdown; await wait_closed() to join it."""
        loop = asyncio.get_running_loop()
        if self._loop is None:
            self._loop = loop
        if loop is not self._loop:
            raise RuntimeError("Server must be used from its owning asyncio loop")
        caller = asyncio.current_task()
        if caller in self._tasks:
            self._shutdown_callers.add(caller)
        if close_connections:
            self._close_connections = True
            self._close_requested.set()
        if self._stop_task is None:
            self._stopping = True
            self._stop_task = loop.create_task(self._stop(caller))

    async def wait_closed(self):
        loop = asyncio.get_running_loop()
        if self._loop is not None and loop is not self._loop:
            raise RuntimeError("Server must be used from its owning asyncio loop")
        await self._closed_event.wait()
        if self._stop_task is not None:
            await asyncio.shield(self._stop_task)

    async def serve_forever(self):
        await self.start()
        try:
            await self.wait_closed()
        finally:
            await self.stop()

    def _listener_failed(self, error):
        self._loop.call_exception_handler({
            "message": "Web-stream listener failed", "exception": error, "server": self})
        task = self._loop.create_task(self.stop())
        task.add_done_callback(lambda task: None if task.cancelled() else task.exception())

    async def _stop(self, caller):
        try:
            if self._start_task is not None:
                await asyncio.gather(self._start_task, return_exceptions=True)
            if self._runtime is None:
                return
            try:
                await self._runtime._request("stop_accepting", self._identifier)
            except WebStreamError:
                pass
            tasks = self._tasks - self._shutdown_callers - {caller}
            if not self._close_connections and tasks:
                joined = asyncio.gather(*tasks, return_exceptions=True)
                requested = self._loop.create_task(self._close_requested.wait())
                try:
                    await asyncio.wait((joined, requested), return_when=asyncio.FIRST_COMPLETED)
                finally:
                    requested.cancel()
                    await asyncio.gather(requested, return_exceptions=True)
            if self._close_connections:
                await asyncio.gather(*(conn.close() for conn in list(self._connections)),
                                     return_exceptions=True)
            tasks = self._tasks - self._shutdown_callers - {caller}
            if tasks and self._close_connections:
                _, pending = await asyncio.wait(tasks, timeout=self.shutdown_timeout)
                for task in pending - self._shutdown_callers:
                    task.cancel()
                await asyncio.gather(*(tasks - self._shutdown_callers), return_exceptions=True)
            await asyncio.gather(*(conn.abort() for conn in list(self._connections)),
                                 return_exceptions=True)
        finally:
            runtime = self._runtime
            if runtime is not None:
                try:
                    if self._identifier is not None:
                        try:
                            await runtime._request("remove_listener", self._identifier)
                        except WebStreamError:
                            pass
                        runtime._objects.pop(self._identifier, None)
                finally:
                    await release_runtime(runtime, self._owned_runtime)
                    self._owned_runtime = False
            self._connections.clear()
            self._closed_event.set()

    async def _close_from_runtime(self, caller):
        if caller in self._tasks:
            self._shutdown_callers.add(caller)
        self._close_connections = True
        self._close_requested.set()
        if self._stop_task is None:
            self._stopping = True
            self._stop_task = self._loop.create_task(self._stop(caller))
        await finish_cleanup(self._stop_task)

    async def __aenter__(self):
        await self.start()
        return self

    async def __aexit__(self, *_):
        await self.stop()


class _Serve:
    def __init__(self, handler, host, port, **options):
        self.server = WebStreamServer(port, host=host, **options)
        self.server.set_stream_handler(handler)

    def __await__(self):
        return self._start().__await__()

    async def _start(self):
        await self.server.start()
        return self.server

    async def __aenter__(self):
        return await self

    async def __aexit__(self, *_):
        await self.server.stop()


def serve(handler, host=None, port=None, **options):
    """Create a server with a handler, as an awaitable or async context manager."""
    return _Serve(handler, host, 0 if port is None else port, **options)
