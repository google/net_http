"""A libevent worker shared by connections on one asyncio event loop."""

import asyncio
import atexit
from dataclasses import dataclass
import itertools
import sys
import threading
import weakref
from typing import Callable, Optional

from . import web_stream_ext
from .exceptions import WebStreamError


_workers = set()


def _shutdown_workers():
    workers = list(_workers)
    for native, _ in workers:
        native.stop()
    for _, worker in workers:
        if worker is not threading.current_thread() and worker.is_alive():
            worker.join()


atexit.register(_shutdown_workers)


@dataclass(frozen=True)
class Limits:
    max_message_size: int = 1024 * 1024
    receive_buffer_limit: int = 4 * 1024 * 1024
    write_buffer_limit: int = 4 * 1024 * 1024

    def __post_init__(self):
        for value in (self.max_message_size, self.receive_buffer_limit, self.write_buffer_limit):
            if not isinstance(value, int) or isinstance(value, bool) or value <= 0:
                raise ValueError("Buffer and message limits must be positive integers")
        if self.write_buffer_limit < 1024 or self.max_message_size > self.write_buffer_limit // 2:
            raise ValueError("max_message_size must be <= write_buffer_limit / 2 (minimum write limit: 1024)")

    def _native(self):
        return web_stream_ext._Limits(
            self.max_message_size, self.receive_buffer_limit, self.write_buffer_limit)


_UNSET = object()


def _watermarks(value, name, *, allow_none=False):
    if isinstance(value, tuple):
        if len(value) != 2:
            raise ValueError(f"{name} requires a (high, low) pair")
        high, low = value
    else:
        high, low = value, None
    if high is None and allow_none:
        if low is not None:
            raise ValueError(f"{name} low watermark requires a high watermark")
        return None, None
    if not isinstance(high, int) or isinstance(high, bool) or high <= 0:
        raise ValueError(f"{name} must be a positive integer")
    low = high // 4 if low is None else low
    if not isinstance(low, int) or isinstance(low, bool) or not 0 <= low <= high:
        raise ValueError(f"{name} requires 0 <= low <= high")
    return high, low


@dataclass(frozen=True)
class _FlowLimits:
    max_message_size: Optional[int]
    receive_buffer_limit: Optional[int]
    write_buffer_limit: int
    max_queue: Optional[int]
    queue_low: Optional[int]
    write_low: int
    send_limit: Optional[int] = None

    def _native(self):
        native = web_stream_ext._Limits(
            self.max_message_size if self.max_message_size is not None else sys.maxsize * 2 + 1,
            self.receive_buffer_limit or 0, self.write_buffer_limit)
        native.flexible = True
        native.receive_messages = self.max_queue or 0
        native.messages_low = self.queue_low or 0
        native.write_low = self.write_low
        return native


def resolve_limits(limits=None, *, max_size=_UNSET, max_queue=_UNSET, write_limit=_UNSET):
    if max_size is _UNSET and max_queue is _UNSET and write_limit is _UNSET:
        return limits or Limits()
    if limits is not None:
        raise ValueError("Use either limits or max_size/max_queue/write_limit")
    max_size = 1024 * 1024 if max_size is _UNSET else max_size
    if max_size is not None and (
            not isinstance(max_size, int) or isinstance(max_size, bool) or max_size < 0):
        raise ValueError("max_size must be a non-negative integer or None")
    high, low = _watermarks(16 if max_queue is _UNSET else max_queue, "max_queue", allow_none=True)
    write, write_low = _watermarks(32768 if write_limit is _UNSET else write_limit, "write_limit")
    return _FlowLimits(max_size, None, write, high, low, write_low)


async def finish_cleanup(task, *, propagate_cancel=True):
    """Finish a shared cleanup task, including when its waiter is cancelled twice."""
    cancelled = None
    while not task.done():
        try:
            await asyncio.shield(task)
        except asyncio.CancelledError as error:
            cancelled = error
    result = task.result()
    if cancelled is not None and propagate_cancel:
        raise cancelled
    return result


def _error(payload):
    code, _, detail = payload.partition(": ")
    return WebStreamError(code, detail)


class Runtime:
    """Own one native event loop and worker; use with ``async with Runtime()``.

    A Runtime belongs to the asyncio loop that first starts it. thread_factory
    accepts the same target/name/daemon keywords as threading.Thread.
    """

    def __init__(self, *, thread_factory: Callable[..., threading.Thread] = threading.Thread):
        self._thread_factory = thread_factory
        self._loop = None
        self._native = None
        self._thread = None
        self._started = None
        self._stopped = None
        self._close_task = None
        self._finalizer = None
        self._ids = itertools.count(1)
        self._futures = {}
        self._objects = {}
        self._users = 0

    def _check_loop(self):
        if asyncio.get_running_loop() is not self._loop:
            raise RuntimeError("Runtime must be used from its owning asyncio loop")

    @property
    def is_running(self) -> bool:
        return self._thread is not None and self._thread.is_alive() and self._close_task is None

    async def start(self) -> "Runtime":
        if self._close_task is not None:
            raise RuntimeError("Runtime is closed")
        loop = asyncio.get_running_loop()
        if self._loop is not None:
            self._check_loop()
            await asyncio.shield(self._started)
            return self
        self._loop = loop
        self._started = loop.create_future()
        self._stopped = loop.create_future()
        owner = weakref.ref(self)

        def deliver(*event):
            runtime = owner()
            if runtime is None or loop.is_closed():
                return
            try:
                loop.call_soon_threadsafe(runtime._dispatch, *event)
            except RuntimeError:
                pass

        self._native = web_stream_ext._Runtime(deliver)
        native = self._native
        self._finalizer = weakref.finalize(self, native.stop)

        def run():
            try:
                native.run()
            finally:
                deliver("stopped", 0, 0, "Native worker exited")
                _workers.discard((native, threading.current_thread()))

        self._thread = self._thread_factory(
            target=run, name="web-stream", daemon=True)
        try:
            _workers.add((native, self._thread))
            self._thread.start()
        except BaseException:
            _workers.discard((native, self._thread))
            await finish_cleanup(loop.create_task(self.close()), propagate_cancel=False)
            raise
        await asyncio.shield(self._started)
        return self

    def _dispatch(self, kind, identifier, number, payload):
        if kind == "started":
            if not self._started.done():
                self._started.set_result(None)
        elif kind == "stopped":
            if not self._stopped.done():
                self._stopped.set_result(None)
                if not self._started.done():
                    self._started.set_exception(WebStreamError("runtime", payload))
                for future in self._futures.values():
                    if not future.done():
                        future.set_exception(WebStreamError("runtime", payload))
                self._futures.clear()
                for obj in list(self._objects.values()):
                    obj._runtime_stopped()
        elif kind == "result":
            future = self._futures.pop(identifier, None)
            if future is not None and not future.done():
                if number:
                    future.set_exception(_error(payload))
                else:
                    future.set_result(payload or None)
        elif kind == "open" and number:
            server = self._objects.get(number)
            if server is not None:
                server._accept(identifier, payload)
            else:
                self._discard(identifier)
        elif kind == "listener_error":
            server = self._objects.get(identifier)
            if server is not None:
                server._listener_failed(WebStreamError("listen", payload))
        else:
            connection = self._objects.get(identifier)
            if connection is None:
                return
            if kind == "open":
                connection.path = payload or "/"
            elif kind == "message":
                connection._feed_message(number, payload)
            elif kind == "terminal":
                error = _error(payload) if number else ConnectionAbortedError(payload)
                connection._terminate(error)
                if number:
                    connection._transport_failed = True
            elif kind == "destroyed":
                if not connection._native_closed.done():
                    connection._native_closed.set_result(None)

    def _discard(self, identifier):
        # Used only for an accepted stream whose listener has disappeared.
        if self._native is not None and not self._stopped.done():
            try:
                self._native.release(identifier, 0)
            except RuntimeError:
                pass

    async def _request(self, method, identifier, *args):
        self._check_loop()
        if self._native is None or self._stopped.done():
            raise WebStreamError("runtime", "Runtime is stopped")
        operation = next(self._ids)
        future = self._loop.create_future()
        self._futures[operation] = future
        try:
            getattr(self._native, method)(identifier, operation, *args)
        except RuntimeError as error:
            self._futures.pop(operation, None)
            raise WebStreamError("runtime", str(error)) from error
        except BaseException:
            self._futures.pop(operation, None)
            raise
        # Cancelling a waiter never frees native state. The result notification
        # still removes the operation; already submitted sends are not undone.
        return await future

    async def close(self) -> None:
        if self._loop is None:
            self._loop = asyncio.get_running_loop()
        self._check_loop()
        if self._close_task is None:
            self._close_task = self._loop.create_task(self._close(asyncio.current_task()))
        await finish_cleanup(self._close_task)

    async def _close(self, caller):
        try:
            objects = list(self._objects.values())
            await asyncio.gather(*(obj._close_from_runtime(caller) for obj in objects),
                                 return_exceptions=True)
        finally:
            if self._native is not None:
                self._native.stop()
                if self._thread is not None and self._thread.is_alive():
                    await self._stopped
                    await asyncio.to_thread(self._thread.join)
                self._native = None
                self._finalizer.detach()
            self._objects.clear()

    async def __aenter__(self):
        try:
            return await self.start()
        except BaseException:
            loop = asyncio.get_running_loop()
            await finish_cleanup(loop.create_task(self.close()), propagate_cancel=False)
            raise

    async def __aexit__(self, *_):
        await self.close()


_defaults = weakref.WeakKeyDictionary()


async def acquire_runtime(runtime):
    owned = runtime is None
    if owned:
        loop = asyncio.get_running_loop()
        runtime = _defaults.get(loop)
        if runtime is None or runtime._close_task is not None:
            runtime = Runtime()
            _defaults[loop] = runtime
        runtime._users += 1
    try:
        await runtime.start()
    except BaseException:
        if owned:
            runtime._users -= 1
            if runtime._users == 0:
                if _defaults.get(runtime._loop) is runtime:
                    del _defaults[runtime._loop]
                await finish_cleanup(asyncio.create_task(runtime.close()), propagate_cancel=False)
        raise
    return runtime, owned


async def release_runtime(runtime, owned):
    if owned:
        runtime._users -= 1
        if runtime._users == 0:
            if _defaults.get(runtime._loop) is runtime:
                del _defaults[runtime._loop]
            if runtime._close_task is None:
                await runtime.close()
