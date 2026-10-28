"""Runtime ownership, flow control, cancellation, and directional EOF contracts."""

import asyncio
import socket
import subprocess
import sys
import threading
import textwrap
from pathlib import Path
import unittest
from unittest.mock import patch

from web_stream import ConnectionClosedOK, Limits, Message, Runtime, WebStreamError, WebStreamServer, connect
from web_stream import web_stream_ext


def free_port():
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


class TestRuntime(unittest.IsolatedAsyncioTestCase):
    async def test_explicit_runtime_shares_worker_and_preserves_message_types(self):
        workers = []
        def factory(**options):
            thread = threading.Thread(**options)
            workers.append(thread)
            return thread
        async with Runtime(thread_factory=factory) as runtime:
            server = WebStreamServer(free_port(), runtime=runtime)
            async def echo(conn):
                try:
                    while True:
                        message = await conn.recv_message()
                        await {1: conn.send_text, 2: conn.send_binary,
                               3: conn.send_metadata}[message.opcode](
                            message.data.decode() if message.opcode == 1 else message.data)
                except ConnectionAbortedError:
                    pass
            server.set_stream_handler(echo)
            async with server:
                async def exchange():
                    async with connect(f"webstream://127.0.0.1:{server.port}", runtime=runtime) as conn:
                        await conn.send_text("text\x00日本語")
                        await conn.send_binary(b"same\x00")
                        await conn.send_metadata(b"same\x00")
                        self.assertEqual(await conn.recv_message(), Message(1, "text\x00日本語".encode()))
                        self.assertEqual(await conn.recv_message(), Message(2, b"same\x00"))
                        self.assertEqual(await conn.recv_message(), Message(3, b"same\x00"))
                await asyncio.gather(*(exchange() for _ in range(3)))
            self.assertTrue(runtime.is_running)
            self.assertEqual(len(workers), 1)
        self.assertFalse(workers[0].is_alive())
        self.assertFalse(runtime._futures)
        self.assertFalse(runtime._objects)

    async def test_default_runtime_is_shared_and_last_owner_joins_worker(self):
        server = WebStreamServer(free_port())
        async def handler(conn):
            async for _ in conn:
                pass
        server.set_stream_handler(handler)
        await server.start()
        worker = server._runtime._thread
        async with connect(f"webstream://127.0.0.1:{server.port}") as conn:
            self.assertIs(conn._runtime, server._runtime)
        self.assertTrue(worker.is_alive())
        await server.stop()
        self.assertFalse(worker.is_alive())

    async def test_send_wait_does_not_block_asyncio(self):
        entered = threading.Event()
        release = threading.Event()
        native_type = web_stream_ext._Runtime
        def native_factory(callback):
            def deliver(kind, identifier, number, payload):
                if kind == "message" and identifier > 0 and payload == b"ready":
                    entered.set()
                    if not release.wait(3):
                        raise AssertionError("Native callback was not released")
                callback(kind, identifier, number, payload)
            return native_type(deliver)
        with patch("web_stream.runtime.web_stream_ext._Runtime", side_effect=native_factory):
            async with Runtime() as runtime:
                server = WebStreamServer(free_port(), runtime=runtime)
                async def handler(conn):
                    await conn.send("ready")
                    await conn.recv()
                server.set_stream_handler(handler)
                async with server:
                    async with connect(f"webstream://127.0.0.1:{server.port}", runtime=runtime) as conn:
                        try:
                            self.assertTrue(await asyncio.to_thread(entered.wait, 2))
                            send = asyncio.create_task(conn.send("test"))
                            await asyncio.sleep(.03)
                            self.assertFalse(send.done())
                        finally:
                            release.set()
                        await asyncio.wait_for(send, 2)

    async def test_receive_credit_bounds_backlog_and_resumes_in_order(self):
        limits = Limits(max_message_size=2048, receive_buffer_limit=4096,
                        write_buffer_limit=8192)
        ready = asyncio.get_running_loop().create_future()
        consume = asyncio.Event()
        received = asyncio.get_running_loop().create_future()
        server = WebStreamServer(free_port(), limits=limits)
        async def handler(conn):
            ready.set_result(conn)
            await consume.wait()
            received.set_result([await conn.recv() for _ in range(100)])
            async for _ in conn:
                pass
        server.set_stream_handler(handler)
        async with server:
            async with connect(f"webstream://127.0.0.1:{server.port}", limits=limits) as client:
                peer = await ready
                data = [str(index).encode().ljust(1024, b"x") for index in range(100)]
                for payload in data:
                    await client.send_binary(payload)
                await asyncio.sleep(.03)
                self.assertGreater(peer._recv_queue.qsize(), 0)
                self.assertLess(peer._recv_queue.qsize(), 16)
                consume.set()
                self.assertEqual(await asyncio.wait_for(received, 3), data)

    async def test_stop_cancels_and_joins_handler_waiting_outside_recv(self):
        server = WebStreamServer(free_port(), shutdown_timeout=.01)
        entered = asyncio.Event()
        finished = asyncio.Event()
        async def handler(conn):
            entered.set()
            try:
                await asyncio.Event().wait()
            finally:
                finished.set()
        server.set_stream_handler(handler)
        async with server:
            async with connect(f"webstream://127.0.0.1:{server.port}"):
                await entered.wait()
                await asyncio.wait_for(server.stop(), 2)
                self.assertTrue(finished.is_set())
                self.assertFalse(server._tasks)

    async def test_handler_can_stop_own_server(self):
        server = WebStreamServer(free_port(), shutdown_timeout=.01)
        stopped = asyncio.Event()
        async def handler(conn):
            await server.stop()
            stopped.set()
        server.set_stream_handler(handler)
        async with server:
            async with connect(f"webstream://127.0.0.1:{server.port}"):
                await asyncio.wait_for(stopped.wait(), 2)

    async def test_half_close_allows_final_response_after_request_eof(self):
        server = WebStreamServer(free_port())
        async def handler(conn):
            self.assertEqual(await conn.recv(), "request")
            with self.assertRaises(ConnectionAbortedError):
                await conn.recv()
            # Inbound EOF must not destroy the outbound direction.
            await conn.send("final response")
        server.set_stream_handler(handler)
        async with server:
            async with connect(f"webstream://127.0.0.1:{server.port}") as client:
                await client.send("request")
                await client.write_eof()
                await client.write_eof()
                with self.assertRaises(ConnectionClosedOK):
                    await client.send("after EOF")
                self.assertEqual(await asyncio.wait_for(client.recv(), 2), "final response")
                with self.assertRaises(ConnectionAbortedError):
                    await client.recv()
                await asyncio.wait_for(client.wait_closed(), 2)

    async def test_handler_can_close_own_runtime(self):
        async with Runtime() as runtime:
            server = WebStreamServer(free_port(), runtime=runtime, shutdown_timeout=.01)
            stopped = asyncio.Event()
            async def handler(conn):
                await runtime.close()
                stopped.set()
            server.set_stream_handler(handler)
            await server.start()
            async with connect(f"webstream://127.0.0.1:{server.port}", runtime=runtime):
                await asyncio.wait_for(stopped.wait(), 2)
            self.assertFalse(runtime.is_running)

    async def test_oversized_incoming_message_is_rejected(self):
        small = Limits(max_message_size=512, receive_buffer_limit=1024,
                       write_buffer_limit=2048)
        failed = asyncio.get_running_loop().create_future()
        server = WebStreamServer(free_port(), limits=small)
        async def handler(conn):
            try:
                await conn.recv()
            except WebStreamError as error:
                failed.set_result(error)
        server.set_stream_handler(handler)
        async with server:
            async with connect(f"webstream://127.0.0.1:{server.port}") as client:
                await client.send_binary(b"x" * 2048)
                self.assertEqual((await asyncio.wait_for(failed, 2)).code, "transport")

    async def test_stalled_peer_backpressure_and_cancelled_send_do_not_hang_abort(self):
        limits = Limits(max_message_size=16384, receive_buffer_limit=1024,
                        write_buffer_limit=65536)
        server = WebStreamServer(free_port(), limits=limits, shutdown_timeout=.01)
        entered = asyncio.Event()
        async def handler(conn):
            entered.set()
            await asyncio.Event().wait()
        server.set_stream_handler(handler)
        async with server:
            client = await connect(f"webstream://127.0.0.1:{server.port}", limits=limits).__aenter__()
            async def flood():
                for _ in range(4096):
                    await client.send_binary(b"x" * 16384)
            sender = asyncio.create_task(flood())
            try:
                await entered.wait()
                await asyncio.sleep(.2)
                self.assertFalse(sender.done())
                sender.cancel()
                await asyncio.gather(sender, return_exceptions=True)
                await asyncio.wait_for(client.abort(), 2)
                self.assertFalse(client._writes)
            finally:
                sender.cancel()
                await asyncio.gather(sender, return_exceptions=True)
                await client.abort()

    async def test_explicit_runtime_close_releases_open_objects(self):
        runtime = await Runtime().start()
        server = WebStreamServer(free_port(), runtime=runtime, shutdown_timeout=.01)
        server.set_stream_handler(lambda conn: asyncio.Event().wait())
        await server.start()
        client = await connect(f"webstream://127.0.0.1:{server.port}", runtime=runtime).__aenter__()
        await asyncio.wait_for(runtime.close(), 2)
        self.assertTrue(client._released)
        self.assertFalse(runtime._thread.is_alive())
        self.assertFalse(server._tasks)
        await runtime.close()

    async def test_send_failure_and_handler_exception_are_observable(self):
        loop = asyncio.get_running_loop()
        errors = []
        previous = loop.get_exception_handler()
        loop.set_exception_handler(lambda loop, context: errors.append(context))
        try:
            server = WebStreamServer(free_port())
            async def handler(conn):
                raise ValueError("handler failed")
            server.set_stream_handler(handler)
            async with server:
                async with connect(f"webstream://127.0.0.1:{server.port}") as client:
                    with self.assertRaises(ConnectionAbortedError):
                        await client.recv()
                    await asyncio.sleep(.01)
                    with self.assertRaises(WebStreamError):
                        await client._runtime._request("operation", client._identifier, 99, b"")
            self.assertTrue(any(isinstance(item.get("exception"), ValueError) for item in errors))
        finally:
            loop.set_exception_handler(previous)

    async def test_runtime_rejects_cross_loop_and_restart(self):
        async with Runtime() as runtime:
            def other_loop():
                async def use():
                    with self.assertRaisesRegex(RuntimeError, "owning asyncio loop"):
                        await runtime.start()
                asyncio.run(use())
            await asyncio.to_thread(other_loop)
        with self.assertRaises(RuntimeError):
            await runtime.start()

    async def test_cancelling_send_waiting_for_lock_drops_operation(self):
        async with Runtime() as runtime:
            server = WebStreamServer(free_port(), runtime=runtime)
            async def handler(conn):
                async for message in conn:
                    await conn.send(message)
            server.set_stream_handler(handler)
            async with server:
                async with connect(f"webstream://127.0.0.1:{server.port}", runtime=runtime) as client:
                    await client._write_lock.acquire()
                    try:
                        sending = asyncio.create_task(client.send("cancelled"))
                        await asyncio.sleep(0)
                        await asyncio.sleep(0)
                        sending.cancel()
                        await asyncio.gather(sending, return_exceptions=True)
                    finally:
                        client._write_lock.release()
                    await client.send("retained")
                    self.assertEqual(await client.recv(), "retained")

    async def test_cancelled_runtime_start_releases_default_worker(self):
        gate = threading.Event()
        workers = []
        def factory(*, target, **options):
            def run():
                gate.wait(3)
                target()
            thread = threading.Thread(target=run, **options)
            workers.append(thread)
            return thread
        runtime_type = Runtime
        with patch("web_stream.runtime.Runtime", side_effect=lambda: runtime_type(thread_factory=factory)):
            context = connect("webstream://127.0.0.1:80")
            entering = asyncio.create_task(context.__aenter__())
            try:
                await asyncio.sleep(.01)
                entering.cancel()
                await asyncio.sleep(.01)
                self.assertFalse(entering.done())
                entering.cancel()
            finally:
                gate.set()
            with self.assertRaises(asyncio.CancelledError):
                await asyncio.wait_for(entering, 2)
            self.assertTrue(context.conn._released)
            self.assertTrue(workers)
            self.assertFalse(workers[0].is_alive())


class TestRuntimeProcessLifecycle(unittest.TestCase):
    def probe(self, code):
        import web_stream
        bootstrap = (
            "import importlib, sys\n"
            f"sys.path.insert(0, {str(Path(web_stream_ext.__file__).parent)!r})\n"
            "sys.modules['web_stream.web_stream_ext'] = importlib.import_module('web_stream_ext')\n"
            f"sys.path.insert(0, {str(Path(web_stream.__file__).parent.parent)!r})\n")
        result = subprocess.run([sys.executable, "-c", bootstrap + textwrap.dedent(code)],
                                capture_output=True, text=True, timeout=5)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertNotIn("nanobind: leaked", result.stderr)

    def test_interpreter_exit_joins_live_runtime(self):
        self.probe('''
            import asyncio
            from web_stream import Runtime
            async def main():
                global runtime
                runtime = await Runtime().start()
            asyncio.run(main())
        ''')

    def test_unreferenced_runtime_gc_stops_worker(self):
        self.probe('''
            import asyncio, gc, weakref
            from web_stream import Runtime
            async def main():
                runtime = await Runtime().start()
                worker = runtime._thread
                owner = weakref.ref(runtime)
                del runtime
                gc.collect()
                await asyncio.to_thread(worker.join, 2)
                assert owner() is None
                assert not worker.is_alive()
            asyncio.run(main())
        ''')
