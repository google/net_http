"""Terminal receive errors persist and wake all concurrent receivers."""

import asyncio
import unittest

from web_stream.client import WebStreamConnection
from web_stream.server import WebStreamServerConnection


class TestRecvTermination(unittest.IsolatedAsyncioTestCase):
    async def make_connection(self, side):
        if side == "client":
            conn = WebStreamConnection("127.0.0.1", 80, False)
        else:
            conn = WebStreamServerConnection(None, None)
        callbacks = {
            "message": conn._feed_message,
            "close": lambda: conn._terminate(ConnectionAbortedError("Connection closed")),
            "error": lambda: conn._terminate(ConnectionError("Connection lost")),
        }
        return conn, callbacks

    async def receive_error(self, conn, error_type):
        with self.assertRaises(error_type) as caught:
            await asyncio.wait_for(conn.recv(), 0.3)
        self.assertIs(type(caught.exception), error_type)
        return caught.exception.args

    async def test_buffered_messages_then_persistent_remote_error(self):
        for side in ("client", "server"):
            for event, error_type in (("close", ConnectionAbortedError),
                                      ("error", ConnectionError)):
                with self.subTest(side=side, event=event):
                    conn, callbacks = await self.make_connection(side)
                    try:
                        callbacks["message"](1, b"buffered text")
                        callbacks["message"](2, b"buffered binary\x00")
                        callbacks[event]()
                        callbacks["error" if event == "close" else "close"]()
                        # A notification already in flight must not resurrect
                        # message delivery after the terminal notification.
                        callbacks["message"](1, b"too late")
                        await asyncio.sleep(0)
                        self.assertEqual(await conn.recv(), "buffered text")
                        self.assertEqual(await conn.recv(), b"buffered binary\x00")
                        reason = await self.receive_error(conn, error_type)
                        for _ in range(3):
                            self.assertEqual(await self.receive_error(conn, error_type), reason)
                        # Explicit cleanup must preserve the remote failure.
                        await conn.close()
                        self.assertEqual(await self.receive_error(conn, error_type), reason)
                    finally:
                        await conn.close()

    async def test_remote_termination_wakes_all_waiting_receivers(self):
        for side in ("client", "server"):
            for event, error_type in (("close", ConnectionAbortedError),
                                      ("error", ConnectionError)):
                with self.subTest(side=side, event=event):
                    conn, callbacks = await self.make_connection(side)
                    receivers = [asyncio.create_task(conn.recv()) for _ in range(4)]
                    try:
                        await asyncio.sleep(0)
                        callbacks[event]()
                        results = await asyncio.wait_for(
                            asyncio.gather(*receivers, return_exceptions=True), 0.3)
                        self.assertTrue(all(type(result) is error_type for result in results), results)
                        self.assertTrue(all(result.args == results[0].args for result in results))
                        await self.receive_error(conn, error_type)
                    finally:
                        for receiver in receivers:
                            receiver.cancel()
                        await asyncio.gather(*receivers, return_exceptions=True)
                        await conn.close()

    async def test_cancelled_receiver_does_not_consume_terminal_notification(self):
        for side in ("client", "server"):
            with self.subTest(side=side):
                conn, callbacks = await self.make_connection(side)
                receivers = [asyncio.create_task(conn.recv()) for _ in range(3)]
                try:
                    await asyncio.sleep(0)
                    receivers[0].cancel()
                    with self.assertRaises(asyncio.CancelledError):
                        await receivers[0]
                    callbacks["close"]()
                    results = await asyncio.wait_for(
                        asyncio.gather(*receivers[1:], return_exceptions=True), 0.3)
                    self.assertTrue(all(type(result) is ConnectionAbortedError for result in results), results)
                finally:
                    for receiver in receivers:
                        receiver.cancel()
                    await asyncio.gather(*receivers, return_exceptions=True)
                    await conn.close()

    async def test_local_close_is_persistent_and_wakes_receivers(self):
        for side in ("client", "server"):
            with self.subTest(side=side):
                conn, _ = await self.make_connection(side)
                receivers = [asyncio.create_task(conn.recv()) for _ in range(3)]
                try:
                    await asyncio.sleep(0)
                    await conn.close()
                    results = await asyncio.wait_for(
                        asyncio.gather(*receivers, return_exceptions=True), 0.3)
                    self.assertTrue(all(type(result) is ConnectionAbortedError for result in results), results)
                    for _ in range(3):
                        await conn.close()
                        await self.receive_error(conn, ConnectionAbortedError)
                finally:
                    for receiver in receivers:
                        receiver.cancel()
                    await asyncio.gather(*receivers, return_exceptions=True)
                    await conn.close()
