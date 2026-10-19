"""Shared asyncio message, flow-control, and connection lifecycle contracts."""

import asyncio
from dataclasses import dataclass
from typing import AsyncIterator, Optional, Union

from .runtime import Limits, WebStreamError, finish_cleanup, release_runtime

WEB_STREAM_OPCODE_TEXT = 1
WEB_STREAM_OPCODE_BINARY = 2
WEB_STREAM_OPCODE_METADATA = 3


@dataclass(frozen=True)
class Message:
    opcode: int
    data: bytes


class Connection:
    def _initialize(self, runtime=None, identifier=None, path="/", limits=None,
                    close_timeout=5.0):
        if close_timeout <= 0:
            raise ValueError("close_timeout must be positive")
        self._loop = asyncio.get_running_loop()
        self._runtime = runtime
        self._identifier = identifier
        self._owned_runtime = False
        self.path = path or "/"
        self.limits = limits or Limits()
        self.close_timeout = close_timeout
        self._recv_queue = asyncio.Queue()
        self._closed = False
        self._transport_failed = False
        self._recv_error = None
        self._eof = False
        self._eof_task = None
        self._released = False
        self._closing = False
        self._close_task = None
        self._release_task = None
        self._native_closed = self._loop.create_future()
        self._write_lock = asyncio.Lock()
        self._writes = set()

    def _check_loop(self):
        if asyncio.get_running_loop() is not self._loop:
            raise RuntimeError("Connection must be used from its owning asyncio loop")

    def _feed_message(self, opcode, data):
        if not self._closed:
            self._recv_queue.put_nowait(Message(opcode, data))

    def _terminate(self, error):
        if not self._closed:
            self._closed = True
            self._recv_error = (type(error), error.args)
            self._recv_queue.put_nowait(None)

    def _runtime_stopped(self):
        self._transport_failed = True
        self._terminate(WebStreamError("runtime", "Runtime stopped"))
        if not self._native_closed.done():
            self._native_closed.set_result(None)

    def _ensure_open(self):
        self._check_loop()
        if self._transport_failed or self._closing or self._released or self._identifier is None:
            raise RuntimeError("Connection is closed or not open")
        if self._eof:
            raise RuntimeError("Outbound EOF already sent")

    def _write_task(self, coroutine):
        task = self._loop.create_task(coroutine)
        self._writes.add(task)

        def completed(task):
            self._writes.discard(task)
            if not task.cancelled():
                task.exception()  # Observe failures if its caller was cancelled.
        task.add_done_callback(completed)
        return task

    async def _send(self, opcode, data):
        self._ensure_open()
        if len(data) > self.limits.max_message_size:
            raise ValueError("Message exceeds max_message_size")
        # The lock remains held by the operation even if its waiter is cancelled.
        submitted = asyncio.Event()
        operation = self._write_task(self._send_locked(opcode, data, submitted))
        try:
            await asyncio.shield(operation)
        except asyncio.CancelledError:
            if not submitted.is_set():
                operation.cancel()
            raise

    async def _send_locked(self, opcode, data, submitted):
        async with self._write_lock:
            if self._transport_failed or self._released or self._eof:
                raise RuntimeError("Connection is closed for sending")
            submitted.set()
            await self._runtime._request("operation", self._identifier, opcode, data)

    async def send_text(self, text: str) -> None:
        if not isinstance(text, str):
            raise TypeError("send_text expects str")
        await self._send(WEB_STREAM_OPCODE_TEXT, text.encode("utf-8"))

    async def send_binary(self, data: Union[bytes, bytearray, memoryview]) -> None:
        if not isinstance(data, (bytes, bytearray, memoryview)):
            raise TypeError("send_binary expects bytes-like data")
        await self._send(WEB_STREAM_OPCODE_BINARY, bytes(data))

    async def send_metadata(self, data: Union[bytes, bytearray, memoryview]) -> None:
        if not isinstance(data, (bytes, bytearray, memoryview)):
            raise TypeError("send_metadata expects bytes-like data")
        await self._send(WEB_STREAM_OPCODE_METADATA, bytes(data))

    async def send(self, data: object) -> None:
        if isinstance(data, (bytes, bytearray, memoryview)):
            await self.send_binary(data)
        else:
            await self.send_text(str(data))

    async def recv_message(self) -> Message:
        """Receive opcode and bytes without losing metadata message identity."""
        self._check_loop()
        message = await self._recv_queue.get()
        if message is None:
            self._recv_queue.put_nowait(None)
            error_type, args = self._recv_error
            raise error_type(*args)
        if self._runtime is not None and not self._released:
            try:
                self._runtime._native.consume(self._identifier, len(message.data) + 64)
            except (RuntimeError, AttributeError):
                pass  # Buffered messages remain readable after native shutdown.
        return message

    async def recv(self, decode: Optional[bool] = None) -> Union[str, bytes]:
        message = await self.recv_message()
        if decode is None:
            decode = message.opcode == WEB_STREAM_OPCODE_TEXT
        return message.data.decode("utf-8") if decode else message.data

    async def _flush(self, eof):
        async with self._write_lock:
            if self._runtime is None or self._identifier is None:
                raise RuntimeError("Connection is not open")
            if self._transport_failed or self._released:
                if self._recv_error is not None:
                    error_type, args = self._recv_error
                    raise error_type(*args)
                raise RuntimeError("Connection is closed")
            if eof:
                if self._eof:
                    return
                self._eof = True
            await self._runtime._request("operation", self._identifier,
                                         -1 if eof else 0, b"")

    async def write_eof(self) -> None:
        """Flush outbound EOF while keeping the receive direction available."""
        self._check_loop()
        if self._eof_task is None:
            self._eof_task = self._write_task(self._flush(True))
        await asyncio.shield(self._eof_task)

    async def drain(self) -> None:
        """Wait until preceding sends have left the native output buffer."""
        self._check_loop()
        await asyncio.shield(self._write_task(self._flush(False)))

    async def wait_closed(self) -> None:
        self._check_loop()
        await asyncio.shield(self._native_closed)

    async def close(self) -> None:
        self._check_loop()
        if self._close_task is None:
            self._closing = True
            self._close_task = self._loop.create_task(self._close())
        await finish_cleanup(self._close_task)

    async def _close(self):
        failure = None
        try:
            if self._runtime is not None and self._identifier is not None and not self._transport_failed:
                try:
                    await asyncio.wait_for(self.write_eof(), self.close_timeout)
                except ConnectionAbortedError:
                    pass  # Peer EOF raced with a successfully flushed local EOF.
                except (ConnectionError, RuntimeError, asyncio.TimeoutError) as error:
                    if not isinstance(error, WebStreamError) or error.code != "closed":
                        failure = error
        finally:
            self._terminate(ConnectionAbortedError("Connection closed locally"))
            await self._release()
        if failure is not None:
            raise failure

    async def _release(self):
        if self._release_task is None:
            self._release_task = self._loop.create_task(self._release_impl())
        await asyncio.shield(self._release_task)

    async def _release_impl(self):
        self._released = True
        runtime = self._runtime
        if runtime is None:
            if not self._native_closed.done():
                self._native_closed.set_result(None)
            return
        try:
            if self._identifier is not None:
                try:
                    await runtime._request("release", self._identifier)
                except WebStreamError as error:
                    if error.code != "runtime":
                        raise
                finally:
                    runtime._objects.pop(self._identifier, None)
            if self._writes:
                await asyncio.gather(*list(self._writes), return_exceptions=True)
        finally:
            await release_runtime(runtime, self._owned_runtime)
            self._owned_runtime = False
            if not self._native_closed.done():
                self._native_closed.set_result(None)

    async def abort(self) -> None:
        """Release the transport immediately, without flushing pending data."""
        self._check_loop()
        self._closing = True
        self._terminate(ConnectionAbortedError("Connection aborted locally"))
        await finish_cleanup(self._loop.create_task(self._release()))

    async def _close_from_runtime(self, caller):
        await self.close()

    async def __aiter__(self) -> AsyncIterator[Union[str, bytes]]:
        try:
            while True:
                yield await self.recv()
        except ConnectionAbortedError:
            return
