"""Terminal receive errors persist; concurrent receivers are rejected."""

import asyncio
import unittest

from web_stream import ConnectionClosedOK, ConnectionClosedError, ConcurrencyError
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
            "close": lambda: conn._terminate(ConnectionClosedOK("Connection closed")),
            "error": lambda: conn._terminate(ConnectionClosedError("transport", "Connection lost")),
        }
        return conn, callbacks

    async def receive_error(self, conn, error_type):
        with self.assertRaises(error_type) as caught:
            await asyncio.wait_for(conn.recv(), 0.3)
        self.assertIs(type(caught.exception), error_type)
        return caught.exception.args

    async def test_buffered_messages_then_persistent_remote_error(self):
        for side in ("client", "server"):
            for event, error_type in (("close", ConnectionClosedOK),
                                      ("error", ConnectionClosedError)):
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

    async def test_concurrent_receive_is_rejected_without_losing_message(self):
        for side in ("client", "server"):
            conn, callbacks = await self.make_connection(side)
            receiver = asyncio.create_task(conn.recv())
            try:
                await asyncio.sleep(0)
                with self.assertRaises(ConcurrencyError):
                    await conn.recv()
                with self.assertRaises(ConcurrencyError):
                    await conn.recv_message()
                callbacks["message"](1, b"first")
                self.assertEqual(await receiver, "first")
                callbacks["message"](1, b"next")
                self.assertEqual(await conn.recv(), "next")
            finally:
                receiver.cancel()
                await asyncio.gather(receiver, return_exceptions=True)
                await conn.close()

    async def test_cancelled_receiver_does_not_consume_terminal_notification(self):
        for side in ("client", "server"):
            conn, callbacks = await self.make_connection(side)
            receiver = asyncio.create_task(conn.recv())
            try:
                await asyncio.sleep(0)
                callbacks["close"]()
                receiver.cancel()
                with self.assertRaises(asyncio.CancelledError):
                    await receiver
                await self.receive_error(conn, ConnectionClosedOK)
                await self.receive_error(conn, ConnectionClosedOK)
            finally:
                await conn.close()

    async def test_local_close_wakes_receiver_and_is_persistent(self):
        for side in ("client", "server"):
            conn, _ = await self.make_connection(side)
            receiver = asyncio.create_task(conn.recv())
            try:
                await asyncio.sleep(0)
                await conn.close()
                with self.assertRaises(ConnectionClosedOK):
                    await receiver
                for _ in range(3):
                    await conn.close()
                    await self.receive_error(conn, ConnectionClosedOK)
            finally:
                receiver.cancel()
                await asyncio.gather(receiver, return_exceptions=True)
                await conn.close()
