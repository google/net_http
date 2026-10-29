"""Cancellation of __aenter__ releases native clients before it propagates."""

import asyncio
from pathlib import Path
import ssl
import unittest
from unittest.mock import Mock, AsyncMock
import itertools

from web_stream import connect
from web_stream.client import WebStreamConnection


CERTS_DIR = Path(__file__).resolve().parents[3] / "cpp" / "certs"


class TestConnectCancellation(unittest.IsolatedAsyncioTestCase):
    async def check_cancelled_connect(self, tls, timeout):
        request_received = asyncio.Event()
        disconnected = asyncio.Event()
        peers = set()
        handlers = set()

        async def silent_peer(reader, writer):
            peers.add(writer)
            handlers.add(asyncio.current_task())
            try:
                await reader.readuntil(b"\r\n\r\n")
                request_received.set()
                # Accept TCP/TLS and the request, but never finish HTTP handshake.
                await reader.read()
            except (ConnectionError, ssl.SSLError):
                # Cancellation may abort TLS without a close_notify alert.
                pass
            finally:
                disconnected.set()
                writer.close()
                try:
                    await writer.wait_closed()
                except (ConnectionError, ssl.SSLError):
                    pass
                peers.discard(writer)
                handlers.discard(asyncio.current_task())

        context = None
        if tls:
            context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            context.load_cert_chain(CERTS_DIR / "server.crt", CERTS_DIR / "server.key")
            context.load_verify_locations(CERTS_DIR / "ca.crt")
            context.verify_mode = ssl.CERT_REQUIRED

        server = await asyncio.start_server(silent_peer, "127.0.0.1", 0, ssl=context)
        port = server.sockets[0].getsockname()[1]
        scheme = "webstreams" if tls else "webstream"
        cm = connect(
            f"{scheme}://127.0.0.1:{port}",
            ca_file=str(CERTS_DIR / "ca.crt"),
            cert_file=str(CERTS_DIR / "client.crt"),
            key_file=str(CERTS_DIR / "client.key"),
        )
        task = asyncio.create_task(cm.__aenter__())
        try:
            await asyncio.wait_for(request_received.wait(), 3)
            thread = cm.conn._runtime._thread
            self.assertTrue(thread.is_alive())
            if timeout:
                with self.assertRaises(asyncio.TimeoutError):
                    await asyncio.wait_for(task, 0.02)
            else:
                task.cancel()
                with self.assertRaises(asyncio.CancelledError):
                    await task

            self.assertFalse(thread.is_alive(), "native thread survived cancellation")
            self.assertTrue(cm.conn._released)
            self.assertIsNone(cm.conn._runtime._native)
            self.assertTrue(cm.conn._closed)
            await asyncio.wait_for(disconnected.wait(), 3)
            await cm.conn.close()  # Repeated cleanup remains safe.
        finally:
            if not task.done():
                task.cancel()
            await asyncio.gather(task, return_exceptions=True)
            if cm.conn:
                await cm.conn.close()
            server.close()
            await server.wait_closed()
            for writer in list(peers):
                writer.close()
            if handlers:
                await asyncio.wait_for(asyncio.gather(*handlers), 3)

    async def test_plain_connect_cancellation(self):
        for timeout in (False, True):
            with self.subTest(timeout=timeout):
                await self.check_cancelled_connect(False, timeout)

    async def test_tls_connect_cancellation(self):
        for timeout in (False, True):
            with self.subTest(timeout=timeout):
                await self.check_cancelled_connect(True, timeout)

    def fake_runtime(self):
        runtime = Mock()
        runtime.start = AsyncMock(return_value=runtime)
        runtime._ids = itertools.count(1)
        runtime._objects = {}
        return runtime

    async def test_late_open_callback_after_cancellation_is_ignored(self):
        from web_stream.runtime import Runtime
        runtime = self.fake_runtime()
        entered = asyncio.Event()
        async def request(method, identifier, *args):
            if method == "connect":
                entered.set()
                await asyncio.Future()
        runtime._request = AsyncMock(side_effect=request)
        conn = WebStreamConnection("127.0.0.1", 80, False, runtime=runtime)
        task = asyncio.create_task(conn.connect())
        await entered.wait()
        task.cancel()
        with self.assertRaises(asyncio.CancelledError):
            await task
        # Notifications already queued for a released identifier are harmless.
        Runtime._dispatch(runtime, "open", conn._identifier, 0, "/late")
        Runtime._dispatch(runtime, "message", conn._identifier, 1, b"late")
        self.assertTrue(conn._released)
        self.assertTrue(conn._recv_queue.qsize() == 1)

    async def test_repeated_cancellation_waits_for_cleanup(self):
        runtime = self.fake_runtime()
        entered = asyncio.Event()
        releasing = asyncio.Event()
        finish = asyncio.Event()
        async def request(method, identifier, *args):
            if method == "connect":
                entered.set()
                await asyncio.Future()
            elif method == "release":
                releasing.set()
                await finish.wait()
        runtime._request = AsyncMock(side_effect=request)
        conn = WebStreamConnection("127.0.0.1", 80, False, runtime=runtime)
        task = asyncio.create_task(conn.connect())
        try:
            await entered.wait()
            task.cancel()
            await releasing.wait()
            task.cancel()
            await asyncio.sleep(0)
            self.assertFalse(task.done())
            finish.set()
            with self.assertRaises(asyncio.CancelledError):
                await task
            self.assertTrue(conn._released)
            self.assertNotIn(conn._identifier, runtime._objects)
        finally:
            finish.set()
            await asyncio.gather(task, return_exceptions=True)

    async def test_connection_failure_still_cleans_up(self):
        from web_stream import WebStreamError
        runtime = self.fake_runtime()
        async def request(method, identifier, *args):
            if method == "connect":
                raise WebStreamError("connect", "Connection failed")
        runtime._request = AsyncMock(side_effect=request)
        conn = WebStreamConnection("127.0.0.1", 80, False, runtime=runtime)
        with self.assertRaisesRegex(ConnectionError, "Connection failed"):
            await conn.connect()
        self.assertTrue(conn._released)
        self.assertNotIn(conn._identifier, runtime._objects)
        self.assertIn((("release", conn._identifier), {}), runtime._request.call_args_list)
