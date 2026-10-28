"""Public asyncio entry points, message types, retries, and shutdown."""

import asyncio
import socket
import unittest
from unittest.mock import AsyncMock, patch

from web_stream import (
    ConnectionClosed, ConnectionClosedOK, ConnectionClosedError, Runtime,
    WebStreamError, WebStreamServer, connect, serve,
)
from web_stream.client import WebStreamConnection


async def echo(conn):
    async for message in conn:
        await conn.send(message)


class TestAsyncioAPI(unittest.IsolatedAsyncioTestCase):
    async def test_send_types_iterables_and_text_override(self):
        async def parts():
            yield "日"
            await asyncio.sleep(0)
            yield "本語"

        async with serve(echo, "127.0.0.1", 0) as server:
            async with connect(f"webstream://127.0.0.1:{server.port}") as conn:
                for data, expected in (("text", "text"), (b"bytes", b"bytes"),
                                       (bytearray(b"bytearray"), b"bytearray"),
                                       (memoryview(b"view"), b"view"),
                                       (["a", "b"], "ab"),
                                       ([b"a", bytearray(b"b")], b"ab"),
                                       (parts(), "日本語")):
                    with self.subTest(data=type(data)):
                        await conn.send(data)
                        self.assertEqual(await asyncio.wait_for(conn.recv(), 2), expected)
                await conn.send(b"encoded", text=True)
                self.assertEqual(await conn.recv(), "encoded")
                await conn.send("binary", text=False)
                self.assertEqual(await conn.recv(), b"binary")
                for data in (123, None, {"key": "value"}, ["a", b"b"]):
                    with self.subTest(invalid=data), self.assertRaises(TypeError):
                        await conn.send(data)
                await conn.send("still usable")
                self.assertEqual(await conn.recv(), "still usable")

    async def test_await_connect_and_server_close(self):
        server = await serve(echo, "127.0.0.1", 0)
        self.assertGreater(server.port, 0)
        self.assertTrue(server.is_serving())
        conn = await connect(f"webstream://127.0.0.1:{server.port}")
        try:
            await conn.send("hello")
            self.assertEqual(await conn.recv(), "hello")
            server.close()
            self.assertFalse(server.is_serving())
            await asyncio.wait_for(server.wait_closed(), 2)
            with self.assertRaises(ConnectionClosedOK):
                await conn.recv()
            self.assertFalse(server.connections)
        finally:
            await conn.close()
            await server.stop()

    async def test_cancel_serve_forever_closes_server(self):
        server = await serve(echo, "127.0.0.1", 0)
        task = asyncio.create_task(server.serve_forever())
        await asyncio.sleep(0)
        task.cancel()
        with self.assertRaises(asyncio.CancelledError):
            await task
        await asyncio.wait_for(server.wait_closed(), 2)
        self.assertFalse(server.is_serving())
        self.assertFalse(server._runtime._thread.is_alive())

    async def test_close_can_keep_connections_and_later_force_shutdown(self):
        server = await serve(echo, "127.0.0.1", 0)
        try:
            async with connect(f"webstream://127.0.0.1:{server.port}") as conn:
                server.close(close_connections=False)
                await asyncio.sleep(.02)
                waiting = asyncio.create_task(server.wait_closed())
                try:
                    await conn.send("still connected")
                    self.assertEqual(await conn.recv(), "still connected")
                    self.assertFalse(waiting.done())
                    server.close()
                    await asyncio.wait_for(waiting, 2)
                finally:
                    waiting.cancel()
                    await asyncio.gather(waiting, return_exceptions=True)
        finally:
            await server.stop()

    async def test_close_without_closing_connections_waits_for_handlers(self):
        server = await serve(echo, "127.0.0.1", 0)
        try:
            conn = await connect(f"webstream://127.0.0.1:{server.port}")
            server.close(close_connections=False)
            await conn.close()
            await asyncio.wait_for(server.wait_closed(), 2)
        finally:
            await server.stop()

    async def test_handler_can_upgrade_graceful_shutdown(self):
        proceed = asyncio.Event()
        stopped = asyncio.Event()

        async def handler(conn):
            await proceed.wait()
            await server.stop()
            stopped.set()

        server = await serve(handler, "127.0.0.1", 0)
        try:
            async with connect(f"webstream://127.0.0.1:{server.port}"):
                server.close(close_connections=False)
                await asyncio.sleep(.01)
                proceed.set()
                await asyncio.wait_for(stopped.wait(), 2)
                await server.wait_closed()
        finally:
            proceed.set()
            await server.stop()

    async def test_open_timeout_cleans_up_worker(self):
        finished = asyncio.Event()

        async def silent(reader, writer):
            try:
                await reader.read()
            finally:
                writer.close()
                await writer.wait_closed()
                finished.set()

        peer = await asyncio.start_server(silent, "127.0.0.1", 0)
        port = peer.sockets[0].getsockname()[1]
        connector = connect(f"webstream://127.0.0.1:{port}", open_timeout=.03)
        try:
            with self.assertRaises(asyncio.TimeoutError):
                await connector
            self.assertTrue(connector.conn._released)
            self.assertFalse(connector.conn._runtime._thread.is_alive())
            await asyncio.wait_for(finished.wait(), 2)
        finally:
            peer.close()
            await peer.wait_closed()

    async def test_reconnect_retries_and_cancellation_stops_backoff(self):
        attempts = []
        retrying = asyncio.Event()

        def classify(error):
            attempts.append(error)
            retrying.set()
            return None

        async with serve(echo, "127.0.0.1", 0) as server:
            connector = connect(f"webstream://127.0.0.1:{server.port}",
                                reconnect_delays=lambda: iter([0, 0]))
            real_connect = WebStreamConnection.connect
            count = 0

            async def sometimes(conn):
                nonlocal count
                count += 1
                if count == 1:
                    await conn.abort()
                    raise OSError("temporary connection failure")
                return await real_connect(conn)

            with patch.object(WebStreamConnection, "connect", sometimes):
                iterator = connector.__aiter__()
                for expected in (2, 3):
                    conn = await asyncio.wait_for(iterator.__anext__(), 2)
                    self.assertEqual(count, expected)
                    await conn.send("retry")
                    self.assertEqual(await conn.recv(), "retry")
                await iterator.aclose()
                self.assertTrue(conn._released)

        connector = connect("webstream://127.0.0.1:1", process_exception=classify,
                            reconnect_delays=lambda: iter([3600]))
        iterator = connector.__aiter__()
        with patch.object(WebStreamConnection, "connect", AsyncMock(side_effect=OSError("retry"))):
            pending = asyncio.create_task(iterator.__anext__())
            await retrying.wait()
            pending.cancel()
            with self.assertRaises(asyncio.CancelledError):
                await pending
        self.assertEqual(len(attempts), 1)

    async def test_reconnect_fatal_error_is_propagated(self):
        connector = connect("webstream://127.0.0.1:1")
        iterator = connector.__aiter__()
        with patch.object(WebStreamConnection, "connect", AsyncMock(side_effect=ValueError("bad configuration"))):
            with self.assertRaisesRegex(ValueError, "bad configuration"):
                await iterator.__anext__()

    async def test_closed_send_and_receive_have_public_exceptions(self):
        conn = WebStreamConnection("localhost", 80, False)
        await conn.close()
        for operation in (conn.send("after close"), conn.recv()):
            with self.assertRaises(ConnectionClosedOK) as caught:
                await operation
            self.assertIsInstance(caught.exception, ConnectionClosed)
            self.assertIsInstance(caught.exception, ConnectionAbortedError)
        conn = WebStreamConnection("localhost", 80, False)
        conn._transport_failed = True
        conn._terminate(WebStreamError("transport", "broken stream"))
        try:
            for operation in (conn.send("after failure"), conn.recv()):
                with self.assertRaises(ConnectionClosedError) as caught:
                    await operation
                self.assertIsInstance(caught.exception, WebStreamError)
                self.assertEqual(caught.exception.code, "transport")
        finally:
            await conn.abort()

    async def test_flow_arguments_allow_large_sends_and_limit_receive_size(self):
        async with serve(echo, "127.0.0.1", 0, max_size=None,
                         max_queue=(2, 0), write_limit=(1024, 0)) as server:
            async with connect(f"webstream://127.0.0.1:{server.port}",
                               max_size=None, max_queue=None, write_limit=1024) as conn:
                payload = b"x" * (1024 * 1024 + 1)
                await conn.send(payload)
                self.assertEqual(await asyncio.wait_for(conn.recv(), 3), payload)
        async def large(conn):
            await conn.send(b"x" * 64)
            try:
                await conn.recv()
            except ConnectionClosed:
                pass
        async with serve(large, "127.0.0.1", 0) as server:
            async with connect(f"webstream://127.0.0.1:{server.port}", max_size=16) as conn:
                with self.assertRaises(ConnectionClosedError):
                    await conn.recv()

    async def test_queue_watermarks_pause_and_resume(self):
        ready = asyncio.Event()
        accepted = asyncio.get_running_loop().create_future()
        async def handler(conn):
            accepted.set_result(conn)
            await ready.wait()
            messages = [await conn.recv() for _ in range(40)]
            await conn.send("|".join(messages))
        async with serve(handler, "127.0.0.1", 0, max_queue=(2, 0)) as server:
            async with connect(f"webstream://127.0.0.1:{server.port}") as conn:
                peer = await accepted
                for i in range(40):
                    await conn.send(str(i))
                await asyncio.sleep(.02)
                self.assertGreater(peer._recv_queue.qsize(), 0)
                self.assertLess(peer._recv_queue.qsize(), 40)
                ready.set()
                self.assertEqual(await asyncio.wait_for(conn.recv(), 2), "|".join(map(str, range(40))))

    async def test_limits_arguments_validate_before_opening(self):
        from web_stream import Limits
        for options in ({"max_size": -1}, {"max_queue": (2, 3)},
                        {"write_limit": 0}, {"max_queue": False},
                        {"limits": Limits(), "max_size": 1}):
            with self.subTest(options=options), self.assertRaises(ValueError):
                connect("webstream://127.0.0.1:1", **options)

    async def test_close_timeout_can_be_disabled(self):
        async with serve(echo, "127.0.0.1", 0, close_timeout=None) as server:
            async with connect(f"webstream://127.0.0.1:{server.port}", close_timeout=None):
                pass

    async def test_ipv6_host_binding(self):
        with socket.socket(socket.AF_INET6) as probe:
            try:
                probe.bind(("::1", 0))
            except OSError:
                self.skipTest("IPv6 loopback unavailable")
        async with serve(echo, "::1", 0) as server:
            async with connect(f"webstream://[::1]:{server.port}") as conn:
                await conn.send("IPv6")
                self.assertEqual(await conn.recv(), "IPv6")
