"""FastAPI/Starlette interoperability through the ASGI WebSocket adapter."""

import asyncio
import unittest

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from web_stream import ASGIWebSocketAdapter, ConnectionClosed, connect


class TestFastAPIIntegration(unittest.IsolatedAsyncioTestCase):
    async def test_fastapi_routing_dependencies_middleware_and_lifespan(self):
        from contextlib import asynccontextmanager
        from fastapi import Depends
        from starlette.middleware import Middleware
        from starlette.middleware.authentication import AuthenticationMiddleware
        from starlette.authentication import AuthenticationBackend, AuthCredentials, SimpleUser

        class Authentication(AuthenticationBackend):
            async def authenticate(self, conn):
                return AuthCredentials(["authenticated"]), SimpleUser("tester")

        @asynccontextmanager
        async def lifespan(app):
            app.state.started = True
            yield {"token": "ready"}
            app.state.started = False

        app = FastAPI(lifespan=lifespan, middleware=[Middleware(AuthenticationMiddleware, backend=Authentication())])
        seen = []

        async def dependency(ws: WebSocket):
            self.assertTrue(app.state.started)
            self.assertEqual(ws.state.token, "ready")
            self.assertEqual(ws.user.display_name, "tester")
            return ws.query_params["prefix"]

        @app.websocket("/echo/{room}")
        async def echo(ws: WebSocket, room: str, prefix=Depends(dependency)):
            await ws.accept()
            try:
                text = await ws.receive_text()
                await ws.send_text(f"{room}:{prefix}:{text}")
                data = await ws.receive_bytes()
                await ws.send_bytes(data)
                await ws.receive_text()
            except WebSocketDisconnect as error:
                seen.append(error.code)

        async with app.router.lifespan_context(app) as state:
            async with ASGIWebSocketAdapter(app, state=state).create_server(0, host="127.0.0.1") as server:
                async with connect(f"webstream://127.0.0.1:{server.port}/echo/one?prefix=two") as client:
                    await client.send_text("three")
                    self.assertEqual(await asyncio.wait_for(client.recv(), 2), "one:two:three")
                    await client.send_binary(b"\x00\xff")
                    self.assertEqual(await asyncio.wait_for(client.recv(), 2), b"\x00\xff")
                # Stop wakes receivers and joins application cleanup before lifespan shutdown.
            self.assertEqual(seen, [1005])
        self.assertFalse(app.state.started)

    async def test_fastapi_app_close_and_unknown_route(self):
        app = FastAPI()

        @app.websocket("/close")
        async def close(ws: WebSocket):
            await ws.accept()
            await ws.send_text("bye")
            await ws.close(code=1000)

        async with ASGIWebSocketAdapter(app).create_server(0, host="127.0.0.1") as server:
            for path in ("/close", "/missing"):
                async with connect(f"webstream://127.0.0.1:{server.port}{path}") as client:
                    if path == "/close":
                        self.assertEqual(await asyncio.wait_for(client.recv(), 2), "bye")
                    with self.assertRaises(ConnectionClosed):
                        await asyncio.wait_for(client.recv(), 2)



if __name__ == "__main__":
    unittest.main()
