import asyncio
import socket
import unittest
import web_stream
from web_stream.fastapi import WebStreamRouter, WebStreamSession

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

            server = web_stream.WebStreamServer(port=port)
            server.set_stream_handler(echo_handler)
            await server.start()
            await asyncio.sleep(0.2)

            try:
                uri = f"webstream://127.0.0.1:{port}"
                async with web_stream.connect(uri) as client:
                    await client.send("Hello from Python Client!")
                    res = await asyncio.wait_for(client.recv(), timeout=3.0)
                    self.assertEqual(res, "Server Echo: Hello from Python Client!")
            finally:
                await server.stop()

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(run())
        finally:
            loop.close()

    def test_fastapi_router_integration(self):
        async def run():
            port = get_free_port()
            router = WebStreamRouter()

            @router.web_stream("/v1/chat/completions")
            async def handle_chat(session: WebStreamSession):
                async for msg in session:
                    await session.send_text(f"FastAPI Echo 1: {msg}")
                    await session.send_text(f"FastAPI Echo 2: {msg}")

            server = router.create_server(port=port)
            await server.start()
            await asyncio.sleep(0.2)

            try:
                uri = f"webstream://127.0.0.1:{port}"
                async with web_stream.connect(uri) as client:
                    await client.send("FastAPI Request")
                    res1 = await asyncio.wait_for(client.recv(), timeout=3.0)
                    res2 = await asyncio.wait_for(client.recv(), timeout=3.0)
                    self.assertEqual(res1, "FastAPI Echo 1: FastAPI Request")
                    self.assertEqual(res2, "FastAPI Echo 2: FastAPI Request")
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
