"""Native commands must never touch a stream from the asyncio thread."""

import asyncio
from pathlib import Path
import threading
import unittest
from unittest.mock import patch

from web_stream import (
    ConnectionClosedError, ConnectionClosedOK, Message, Runtime, WebStreamServer,
    connect, web_stream_ext,
)


CERTS = Path(__file__).resolve().parents[3] / "cpp" / "certs"


class TestNativeThreading(unittest.IsolatedAsyncioTestCase):
    async def test_commands_wait_for_receive_callback_to_return(self):
        # Hold the worker inside wslay's receive callback. A command submitted
        # here must wait in the queue, including EOF and native destruction.
        for method, argument, expected in (
            ("send_text", "text\x00日本語", Message(1, "text\x00日本語".encode())),
            ("send_binary", b"binary\x00", Message(2, b"binary\x00")),
            ("send_metadata", b"metadata\x00", Message(3, b"metadata\x00")),
            ("write_eof", None, None),
            ("abort", None, None),
        ):
            with self.subTest(method=method):
                entered = threading.Event()
                release = threading.Event()
                callback_threads = set()
                expired = []
                native_type = web_stream_ext._Runtime

                def native_factory(callback):
                    def deliver(kind, identifier, number, payload):
                        callback_threads.add(threading.get_ident())
                        callback(kind, identifier, number, payload)
                        if kind == "message" and payload == b"gate":
                            entered.set()
                            if not release.wait(5):
                                expired.append(True)
                    return native_type(deliver)

                # The peer has its own worker so its progress doesn't depend
                # on the worker deliberately paused by this test.
                async with Runtime() as peer_runtime:
                    with patch("web_stream.runtime.web_stream_ext._Runtime",
                               side_effect=native_factory):
                        runtime = await Runtime().start()
                    async with runtime:
                        accepted = asyncio.get_running_loop().create_future()
                        handler_done = asyncio.Event()

                        async def handler(conn):
                            accepted.set_result(conn)
                            await handler_done.wait()

                        server = WebStreamServer(0, host="127.0.0.1", runtime=peer_runtime)
                        server.set_stream_handler(handler)
                        async with server:
                            async with connect(f"webstream://127.0.0.1:{server.port}",
                                               runtime=runtime) as client:
                                peer = await asyncio.wait_for(accepted, 2)
                                command = None
                                try:
                                    try:
                                        await peer.send_binary(b"gate")
                                        self.assertTrue(await asyncio.to_thread(entered.wait, 2))
                                        operation = getattr(client, method)
                                        command = asyncio.create_task(
                                            operation() if argument is None else operation(argument))

                                        async def wait_for_submission():
                                            while not runtime._futures and not command.done():
                                                await asyncio.sleep(0)

                                        await asyncio.wait_for(wait_for_submission(), 2)
                                        self.assertTrue(runtime._futures)
                                        self.assertFalse(command.done())
                                        self.assertEqual(callback_threads, {runtime._thread.ident})
                                    finally:
                                        release.set()
                                        if command is not None:
                                            await asyncio.wait_for(command, 2)

                                    # Buffered messages remain available on abort.
                                    self.assertEqual(await asyncio.wait_for(client.recv(), 2), b"gate")
                                    if expected is not None:
                                        self.assertEqual(
                                            await asyncio.wait_for(peer.recv_message(), 2), expected)
                                    else:
                                        error = (ConnectionClosedOK if method == "write_eof"
                                                 else ConnectionClosedError)
                                        with self.assertRaises(error):
                                            await asyncio.wait_for(peer.recv(), 2)
                                finally:
                                    handler_done.set()
                    self.assertFalse(expired, "Native callback gate timed out")
                    self.assertEqual(callback_threads, {runtime._thread.ident})

    async def test_bidirectional_traffic_on_separate_workers(self):
        for tls in (False, True):
            with self.subTest(tls=tls):
                options = dict(ca_file=str(CERTS / "ca.crt"),
                               cert_file=str(CERTS / "server.crt"),
                               key_file=str(CERTS / "server.key")) if tls else {}
                client_options = dict(ca_file=str(CERTS / "ca.crt"),
                                      cert_file=str(CERTS / "client.crt"),
                                      key_file=str(CERTS / "client.key")) if tls else {}
                async with Runtime() as server_runtime, Runtime() as client_runtime:
                    finished = asyncio.get_running_loop().create_future()
                    messages = [Message(index % 3 + 1,
                                        str(index).encode().ljust(16384, b"\x00"))
                                for index in range(256)]

                    async def exchange(conn):
                        async def send():
                            for message in messages:
                                await {1: conn.send_text, 2: conn.send_binary,
                                       3: conn.send_metadata}[message.opcode](
                                    message.data.decode() if message.opcode == 1
                                    else message.data)
                            await conn.write_eof()

                        async def receive():
                            for message in messages:
                                self.assertEqual(await conn.recv_message(), message)
                            with self.assertRaises(ConnectionClosedOK):
                                await conn.recv()

                        await asyncio.gather(send(), receive())

                    async def handler(conn):
                        try:
                            await exchange(conn)
                        except Exception as error:
                            finished.set_exception(error)
                        else:
                            finished.set_result(None)

                    server = WebStreamServer(0, tls=tls, host="127.0.0.1",
                                             runtime=server_runtime,
                                             max_queue=4, write_limit=32768, **options)
                    server.set_stream_handler(handler)
                    async with server:
                        scheme = "webstreams" if tls else "webstream"
                        async with connect(f"{scheme}://127.0.0.1:{server.port}",
                                           runtime=client_runtime, max_queue=4,
                                           write_limit=32768, **client_options) as client:
                            await asyncio.wait_for(exchange(client), 10)
                            await asyncio.wait_for(finished, 2)
