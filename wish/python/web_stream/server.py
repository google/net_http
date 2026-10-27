import asyncio

from .connection import Connection
from .runtime import Limits, WebStreamError, acquire_runtime, finish_cleanup, release_runtime


class WebStreamServerConnection(Connection):
    def __init__(self, runtime, identifier, path="/", *, limits=None, close_timeout=5.0):
        self._initialize(runtime, identifier, path, limits, close_timeout)


class WebStreamServer:
    def __init__(self, port, tls=False, ca_file="", cert_file="", key_file="",
                 connection_cls=WebStreamServerConnection, *, runtime=None,
                 limits=None, max_connections=10000, shutdown_timeout=5.0,
                 close_timeout=5.0):
        if shutdown_timeout < 0 or close_timeout <= 0 or max_connections < 0:
            raise ValueError("Invalid server limits or timeouts")
        self.port = port
        self.tls = tls
        self.limits = limits or Limits()
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
        await self._runtime._request(
            "listen", self._identifier, *self._options,
            self.limits._native(), self._max_connections)

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
        loop = asyncio.get_running_loop()
        if self._loop is None:
            self._loop = loop
        if loop is not self._loop:
            raise RuntimeError("Server must be used from its owning asyncio loop")
        if self._stop_task is None:
            self._stopping = True
            caller = asyncio.current_task()
            self._stop_task = loop.create_task(self._stop(caller))
        await finish_cleanup(self._stop_task)

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
            await asyncio.gather(*(conn.close() for conn in list(self._connections)),
                                 return_exceptions=True)
            tasks = self._tasks - {caller}
            if tasks:
                _, pending = await asyncio.wait(tasks, timeout=self.shutdown_timeout)
                for task in pending:
                    task.cancel()
                await asyncio.gather(*tasks, return_exceptions=True)
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

    async def _close_from_runtime(self, caller):
        if self._stop_task is None:
            self._stopping = True
            self._stop_task = self._loop.create_task(self._stop(caller))
        await finish_cleanup(self._stop_task)

    async def __aenter__(self):
        await self.start()
        return self

    async def __aexit__(self, *_):
        await self.stop()
