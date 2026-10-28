import asyncio
import socket
import unittest
from web_stream import (
    connect,
    WebStreamServer,
    WebStreamRouter,
    WebStreamSession,
)

def get_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('127.0.0.1', 0))
    port = s.getsockname()[1]
    s.close()
    return port

class TestPythonWebStreamServer(unittest.TestCase):
    def test_plain_server_echo(self):
        async def run():
            port = get_free_port()

            async def echo_handler(conn):
                async for msg in conn:
                    await conn.send_text(f"Server Echo: {msg}")

            server = WebStreamServer(port=port)
            server.set_stream_handler(echo_handler)
            await server.start()
            await asyncio.sleep(0.2)

            try:
                uri = f"webstream://127.0.0.1:{port}"
                async with connect(uri) as client:
                    await client.send("Hello from Python Client!")
                    res = await asyncio.wait_for(client.recv(), timeout=3.0)
                    self.assertEqual(res, "Server Echo: Hello from Python Client!")
            finally:
                await asyncio.sleep(0.05)
                await server.stop()

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(run())
        finally:
            loop.close()

    def test_fastapi_router_multi_path_dispatch(self):
        async def run():
            port = get_free_port()
            router = WebStreamRouter()

            @router.web_stream("/v1/chat/completions")
            async def handle_chat(session: WebStreamSession):
                self.assertEqual(session.path, "/v1/chat/completions")
                async for msg in session:
                    await session.send_text(f"Chat: {msg}")

            @router.web_stream("/v1/models")
            async def handle_models(session: WebStreamSession):
                self.assertEqual(session.path, "/v1/models")
                async for msg in session:
                    await session.send_text(f"Models: {msg}")

            server = router.create_server(port=port)
            await server.start()
            await asyncio.sleep(0.2)

            try:
                # 1. Connect to /v1/chat/completions
                chat_uri = f"webstream://127.0.0.1:{port}/v1/chat/completions"
                async with connect(chat_uri) as client:
                    await client.send("hello")
                    res = await asyncio.wait_for(client.recv(), timeout=3.0)
                    self.assertEqual(res, "Chat: hello")

                # 2. Connect to /v1/models
                models_uri = f"webstream://127.0.0.1:{port}/v1/models"
                async with connect(models_uri) as client:
                    await client.send("list")
                    res = await asyncio.wait_for(client.recv(), timeout=3.0)
                    self.assertEqual(res, "Models: list")

                # 3. Connect to unregistered path (should be closed by router)
                unknown_uri = f"webstream://127.0.0.1:{port}/unregistered"
                with self.assertRaises((ConnectionAbortedError, ConnectionError, RuntimeError)):
                    async with connect(unknown_uri) as client:
                        await asyncio.wait_for(client.recv(), timeout=3.0)
            finally:
                await server.stop()

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(run())
        finally:
            loop.close()

    def test_server_stop_unblocks_waiting_handler(self):
        async def run():
            port = get_free_port()
            handler_stopped = asyncio.Event()

            async def wait_for_message(conn):
                async for _ in conn:
                    pass
                handler_stopped.set()

            server = WebStreamServer(port=port)
            server.set_stream_handler(wait_for_message)
            await server.start()
            await asyncio.sleep(0.2)

            try:
                uri = f"webstream://127.0.0.1:{port}"
                async with connect(uri):
                    await server.stop()
                    await asyncio.wait_for(handler_stopped.wait(), timeout=1.0)
            finally:
                await server.stop()

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(run())
        finally:
            loop.close()

if __name__ == "__main__":
    unittest.main()
