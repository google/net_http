"""ASGI boundary contracts and raw ASGI/web-stream interoperability."""

import asyncio
from pathlib import Path
import unittest

from web_stream import (
    ASGIWebSocketAdapter, ConnectionClosed, ConnectionClosedOK,
    ConnectionClosedError, Message, Runtime, connect,
)

class FakeConnection:
    path = "/caf%C3%A9?x=%2F&x=2"

    def __init__(self):
        self.messages = asyncio.Queue()
        self.sent = []
        self.closed = False

    async def recv_message(self):
        message = await self.messages.get()
        if isinstance(message, BaseException):
            raise message
        return message

    async def send_text(self, text):
        self.sent.append(text)

    async def send_binary(self, data):
        self.sent.append(data)

    async def close(self):
        if not self.closed:
            self.closed = True
            self.messages.put_nowait(ConnectionClosedOK("closed"))


class TestASGIAdapter(unittest.IsolatedAsyncioTestCase):
    async def test_scope_state_and_text_binary_empty_messages(self):
        connection = FakeConnection()
        state = {"shared": object()}
        for message in [Message(1, "日本語\x00".encode()), Message(2, b"\x00"),
                        Message(1, b""), Message(2, b"")]:
            connection.messages.put_nowait(message)

        async def app(scope, receive, send):
            self.assertEqual(scope["type"], "websocket")
            self.assertEqual(scope["scheme"], "wss")
            self.assertEqual(scope["path"], "/café")
            self.assertEqual(scope["raw_path"], b"/caf%C3%A9")
            self.assertEqual(scope["query_string"], b"x=%2F&x=2")
            self.assertEqual(scope["headers"], [])
            self.assertEqual(scope["extensions"], {})
            self.assertIsNot(scope["state"], state)
            self.assertIs(scope["state"]["shared"], state["shared"])
            scope["state"]["local"] = True
            self.assertEqual(await receive(), {"type": "websocket.connect"})
            await send({"type": "websocket.accept"})
            for _ in range(4):
                event = await receive()
                await send({**event, "type": "websocket.send"})
            await send({"type": "websocket.close", "code": 1000, "reason": "done"})
            self.assertEqual(await receive(), {"type": "websocket.disconnect",
                                              "code": 1000, "reason": "done"})
            with self.assertRaises(OSError):
                await send({"type": "websocket.send", "text": "late"})

        await ASGIWebSocketAdapter(app, scheme="wss", state=state)(connection)
        self.assertEqual(connection.sent, ["日本語\x00", b"\x00", "", b""])
        self.assertNotIn("local", state)
        self.assertTrue(connection.closed)

    async def test_receive_waits_for_accept_and_cancellation_preserves_message(self):
        connection = FakeConnection()
        connection.messages.put_nowait(Message(1, b"hello"))

        async def app(scope, receive, send):
            await receive()
            pending = asyncio.create_task(receive())
            await asyncio.sleep(0)
            self.assertFalse(pending.done())
            pending.cancel()
            with self.assertRaises(asyncio.CancelledError):
                await pending
            await send({"type": "websocket.accept"})
            self.assertEqual(await receive(), {"type": "websocket.receive", "text": "hello"})

        await ASGIWebSocketAdapter(app)(connection)

    async def test_peer_eof_failure_invalid_text_and_metadata(self):
        cases = [
            (ConnectionClosedOK("EOF"), 1005),
            (ConnectionClosedError("transport", "lost"), 1006),
            (Message(1, b"\xff"), 1007),
            (Message(3, b"metadata"), 1003),
        ]
        for incoming, code in cases:
            with self.subTest(code=code):
                connection = FakeConnection()
                connection.messages.put_nowait(incoming)

                async def app(scope, receive, send):
                    await receive()
                    await send({"type": "websocket.accept"})
                    event = await receive()
                    self.assertEqual(event["type"], "websocket.disconnect")
                    self.assertEqual(event["code"], code)
                    self.assertEqual(await receive(), event)
                    with self.assertRaises(OSError):
                        await send({"type": "websocket.send", "text": "late"})

                await ASGIWebSocketAdapter(app)(connection)
                self.assertTrue(connection.closed)

    async def test_close_wakes_pending_receive(self):
        async def app(scope, receive, send):
            await receive()
            await send({"type": "websocket.accept"})
            pending = asyncio.create_task(receive())
            await asyncio.sleep(0)
            await send({"type": "websocket.close", "code": 1001})
            self.assertEqual((await asyncio.wait_for(pending, 1))["code"], 1001)

        await ASGIWebSocketAdapter(app)(FakeConnection())

    async def test_cancelled_receive_after_accept_does_not_consume_next_message(self):
        connection = FakeConnection()

        async def app(scope, receive, send):
            await receive()
            await send({"type": "websocket.accept"})
            pending = asyncio.create_task(receive())
            await asyncio.sleep(0)
            pending.cancel()
            with self.assertRaises(asyncio.CancelledError):
                await pending
            connection.messages.put_nowait(Message(2, b"next"))
            self.assertEqual(await receive(), {"type": "websocket.receive", "bytes": b"next"})

        await ASGIWebSocketAdapter(app)(connection)

    async def test_rejection_and_retained_callbacks(self):
        callbacks = []

        async def app(scope, receive, send):
            callbacks.extend([receive, send])
            await receive()
            await send({"type": "websocket.close"})

        connection = FakeConnection()
        await ASGIWebSocketAdapter(app)(connection)
        self.assertTrue(connection.closed)
        with self.assertRaises(RuntimeError):
            await callbacks[0]()
        with self.assertRaises(OSError):
            await callbacks[1]({"type": "websocket.accept"})

    async def test_invalid_send_and_unsupported_negotiation(self):
        cases = [
            ({"type": "websocket.send", "text": "early"}, False, RuntimeError),
            ({"type": "websocket.accept", "subprotocol": "chat"}, False, ValueError),
            ({"type": "websocket.accept", "headers": [(b"x", b"y")]}, False, ValueError),
            ({"type": "websocket.accept"}, True, RuntimeError),
            ({"type": "http.response.start", "status": 403}, True, RuntimeError),
            ({"type": "websocket.send"}, True, ValueError),
            ({"type": "websocket.send", "text": "", "bytes": b""}, True, ValueError),
            ({"type": "websocket.send", "text": b"wrong"}, True, TypeError),
            ({"type": "websocket.send", "bytes": "wrong"}, True, TypeError),
        ]
        for event, accepted, error in cases:
            with self.subTest(event=event):
                async def app(scope, receive, send):
                    await receive()
                    if accepted:
                        await send({"type": "websocket.accept"})
                    with self.assertRaises(error):
                        await send(event)
                    await send({"type": "websocket.close"})

                await ASGIWebSocketAdapter(app)(FakeConnection())

    async def test_send_failure_becomes_oserror_and_disconnect(self):
        connection = FakeConnection()

        async def fail(text):
            raise ConnectionClosedError("transport", "lost")

        connection.send_text = fail

        async def app(scope, receive, send):
            await receive()
            await send({"type": "websocket.accept"})
            with self.assertRaises(OSError):
                await send({"type": "websocket.send", "text": "hello"})
            self.assertEqual((await receive())["code"], 1006)

        await ASGIWebSocketAdapter(app)(connection)

    async def test_app_return_exception_and_cancellation_close_transport(self):
        for mode in ("return", "raise", "cancel", "bad_return", "no_accept"):
            with self.subTest(mode=mode):
                connection = FakeConnection()

                async def app(scope, receive, send):
                    if mode == "no_accept":
                        return
                    await receive()
                    await send({"type": "websocket.accept"})
                    if mode == "raise":
                        raise ValueError("application failure")
                    if mode == "cancel":
                        raise asyncio.CancelledError()
                    if mode == "bad_return":
                        return "unexpected"

                adapter = ASGIWebSocketAdapter(app)
                error = {"raise": ValueError, "cancel": asyncio.CancelledError,
                         "bad_return": RuntimeError, "no_accept": RuntimeError}.get(mode)
                if error:
                    with self.assertRaises(error):
                        await adapter(connection)
                else:
                    await adapter(connection)
                self.assertTrue(connection.closed)


class TestASGIIntegration(unittest.IsolatedAsyncioTestCase):
    async def test_shutdown_cancels_busy_app_and_joins_cleanup(self):
        entered = asyncio.Event()
        cleaned = asyncio.Event()

        async def app(scope, receive, send):
            await receive()
            await send({"type": "websocket.accept"})
            entered.set()
            try:
                await asyncio.Future()
            finally:
                cleaned.set()

        server = ASGIWebSocketAdapter(app).create_server(
            0, host="127.0.0.1", shutdown_timeout=0.01)
        async with server:
            async with connect(f"webstream://127.0.0.1:{server.port}"):
                await asyncio.wait_for(entered.wait(), 2)
                await asyncio.wait_for(server.stop(), 2)
                self.assertTrue(cleaned.is_set())
                self.assertFalse(server.connections)

    async def test_app_failure_is_reported_and_other_connections_continue(self):
        contexts = []
        loop = asyncio.get_running_loop()
        old_handler = loop.get_exception_handler()
        loop.set_exception_handler(lambda loop, context: contexts.append(context))

        async def app(scope, receive, send):
            await receive()
            await send({"type": "websocket.accept"})
            if scope["path"] == "/fail":
                raise ValueError("application failure")
            await send({"type": "websocket.send", "text": scope["path"]})

        try:
            async with ASGIWebSocketAdapter(app).create_server(0, host="127.0.0.1") as server:
                async with connect(f"webstream://127.0.0.1:{server.port}/fail") as client:
                    with self.assertRaises(ConnectionClosed):
                        await asyncio.wait_for(client.recv(), 2)
                async def exchange(path):
                    async with connect(f"webstream://127.0.0.1:{server.port}{path}") as client:
                        self.assertEqual(await asyncio.wait_for(client.recv(), 2), path)
                await asyncio.gather(*(exchange(f"/ok/{i}") for i in range(3)))
            self.assertEqual(len(contexts), 1)
            self.assertIsInstance(contexts[0]["exception"], ValueError)
        finally:
            loop.set_exception_handler(old_handler)

    async def test_tls_scope(self):
        certs = Path(__file__).resolve().parents[3] / "cpp" / "certs"

        async def app(scope, receive, send):
            self.assertEqual(scope["scheme"], "wss")
            await receive()
            await send({"type": "websocket.accept"})
            await send({"type": "websocket.send", "text": "TLS"})

        options = dict(tls=True, ca_file=str(certs / "ca.crt"),
                       cert_file=str(certs / "server.crt"), key_file=str(certs / "server.key"))
        async with ASGIWebSocketAdapter(app).create_server(0, host="127.0.0.1", **options) as server:
            async with connect(f"webstreams://127.0.0.1:{server.port}",
                               ca_file=str(certs / "ca.crt"),
                               cert_file=str(certs / "client.crt"),
                               key_file=str(certs / "client.key")) as client:
                self.assertEqual(await asyncio.wait_for(client.recv(), 2), "TLS")

    async def test_raw_asgi_echo_peer_half_close_and_shutdown(self):
        disconnected = asyncio.Event()

        async def app(scope, receive, send):
            self.assertEqual(await receive(), {"type": "websocket.connect"})
            await send({"type": "websocket.accept"})
            while True:
                event = await receive()
                if event["type"] == "websocket.disconnect":
                    self.assertEqual(event["code"], 1005)
                    disconnected.set()
                    return
                await send({**event, "type": "websocket.send"})

        async with Runtime() as runtime:
            server = ASGIWebSocketAdapter(app).create_server(0, host="127.0.0.1", runtime=runtime)
            async with server:
                async with connect(f"webstream://127.0.0.1:{server.port}/echo", runtime=runtime) as client:
                    for message in ("hello", b"binary", "", b""):
                        await client.send(message)
                        self.assertEqual(await asyncio.wait_for(client.recv(), 2), message)
                    await client.write_eof()
                    await asyncio.wait_for(disconnected.wait(), 2)
            self.assertFalse(server.connections)
        self.assertFalse(runtime._objects)
        self.assertFalse(runtime._futures)



if __name__ == "__main__":
    unittest.main()
