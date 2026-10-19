"""Cancellation of __aenter__ releases native clients before it propagates."""

import asyncio
from pathlib import Path
import ssl
import threading
import unittest
from unittest.mock import Mock, patch

from web_stream import connect
from web_stream.client import WebStreamConnection


CERTS_DIR = Path(__file__).resolve().parents[2] / "cpp" / "certs"


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
            thread = cm.conn._thread
            self.assertTrue(thread.is_alive())
            if timeout:
                with self.assertRaises(asyncio.TimeoutError):
                    await asyncio.wait_for(task, 0.02)
            else:
                task.cancel()
                with self.assertRaises(asyncio.CancelledError):
                    await task

            self.assertFalse(thread.is_alive(), "native thread survived cancellation")
            self.assertIsNone(cm.conn._thread)
            self.assertIsNone(cm.conn._client)
            self.assertIsNone(cm.conn._handler)
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

    async def test_late_open_callback_after_cancellation_is_ignored(self):
        stopped = threading.Event()
        native = Mock()
        native.run.side_effect = stopped.wait
        native.stop.side_effect = stopped.set
        errors = []
        loop = asyncio.get_running_loop()
        previous_handler = loop.get_exception_handler()
        loop.set_exception_handler(lambda _, context: errors.append(context))
        with patch("web_stream.client.web_stream_ext.PlainClient", return_value=native):
            conn = WebStreamConnection("127.0.0.1", 80, False)
            on_open = native.set_on_open.call_args[0][0]
            task = asyncio.create_task(conn.connect())
            try:
                await asyncio.sleep(0)
                task.cancel()
                # Queue open just after cancellation, before cleanup can start.
                on_open(Mock())
                with self.assertRaises(asyncio.CancelledError):
                    await task
                # A callback already handed to asyncio can also arrive later.
                on_open(Mock())
                await asyncio.sleep(0)
                self.assertEqual(errors, [])
                self.assertIsNone(conn._handler)
                self.assertIsNone(conn._client)
                native.stop.assert_called()
            finally:
                await conn.close()
                loop.set_exception_handler(previous_handler)

    async def test_repeated_cancellation_waits_for_cleanup(self):
        release_thread = threading.Event()
        stop_called = asyncio.Event()
        native = Mock()
        native.run.side_effect = release_thread.wait
        native.stop.side_effect = stop_called.set
        with patch("web_stream.client.web_stream_ext.PlainClient", return_value=native):
            conn = WebStreamConnection("127.0.0.1", 80, False)
            task = asyncio.create_task(conn.connect())
            try:
                await asyncio.sleep(0)
                thread = conn._thread
                task.cancel()
                await asyncio.wait_for(stop_called.wait(), 1)
                self.assertFalse(task.done())
                task.cancel()
                await asyncio.sleep(0)
                self.assertFalse(task.done(), "second cancellation interrupted cleanup")
                release_thread.set()
                with self.assertRaises(asyncio.CancelledError):
                    await task
                self.assertFalse(thread.is_alive())
                self.assertIsNone(conn._client)
                self.assertIsNone(conn._thread)
            finally:
                release_thread.set()
                await asyncio.gather(task, return_exceptions=True)
                await conn.close()

    async def test_connection_failure_still_cleans_up(self):
        native = Mock()
        native.run.side_effect = lambda: native.set_on_error.call_args[0][0]()
        with patch("web_stream.client.web_stream_ext.PlainClient", return_value=native):
            conn = WebStreamConnection("127.0.0.1", 80, False)
            with self.assertRaisesRegex(ConnectionError, "Connection failed or lost"):
                await conn.connect()
            self.assertIsNone(conn._client)
            self.assertIsNone(conn._thread)
            native.stop.assert_called()
