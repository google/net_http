"""FastAPI integration through ASGI, including lifespan ownership and failures."""

import asyncio
from contextlib import asynccontextmanager
import socket
import unittest
from unittest.mock import AsyncMock

from web_stream import ConnectionClosed, connect, mount_web_stream

from fastapi import APIRouter, Depends, FastAPI, WebSocket, WebSocketDisconnect


class TestFastAPIMount(unittest.IsolatedAsyncioTestCase):
    @asynccontextmanager
    async def lifespan(self, app):
        """Drive the real ASGI lifespan entry point as a hosting server would."""
        incoming, outgoing = asyncio.Queue(), asyncio.Queue()
        state = {}
        task = asyncio.create_task(app(
            {"type": "lifespan", "asgi": {"version": "3.0"}, "state": state},
            incoming.get, outgoing.put))
        try:
            await incoming.put({"type": "lifespan.startup"})
            event = await asyncio.wait_for(outgoing.get(), 2)
            if event["type"] == "lifespan.startup.failed":
                await task  # Preserve the original startup error for assertions.
            self.assertEqual(event["type"], "lifespan.startup.complete")
            yield state
        finally:
            if not task.done():
                await incoming.put({"type": "lifespan.shutdown"})
                try:
                    event = await asyncio.wait_for(outgoing.get(), 2)
                    self.assertEqual(event["type"], "lifespan.shutdown.complete")
                    await asyncio.wait_for(task, 2)
                finally:
                    if not task.done():
                        task.cancel()
                        await asyncio.gather(task, return_exceptions=True)

    async def test_routes_dependencies_middleware_and_lifespan_state(self):
        events = []
        shared = object()

        @asynccontextmanager
        async def lifespan(app):
            events.append("startup")
            app.state.ready = True
            try:
                yield {"shared": shared}
            finally:
                self.assertFalse(server.is_serving())
                self.assertFalse(server.connections)
                events.append("shutdown")
                app.state.ready = False

        class Middleware:
            def __init__(self, app):
                self.app = app

            async def __call__(self, scope, receive, send):
                if scope["type"] == "websocket":
                    scope["state"]["middleware"] = True
                await self.app(scope, receive, send)

        app = FastAPI(lifespan=lifespan)
        app.add_middleware(Middleware)
        router = APIRouter(prefix="/v1")

        async def dependency(ws: WebSocket):
            self.assertTrue(app.state.ready)
            self.assertIs(ws.state.shared, shared)
            self.assertTrue(ws.state.middleware)
            events.append("dependency")
            try:
                yield ws.query_params["prefix"]
            finally:
                self.assertTrue(app.state.ready)
                events.append("dependency cleanup")

        @router.websocket("/echo/{room}")
        async def echo(ws: WebSocket, room: str, prefix=Depends(dependency)):
            await ws.accept()
            try:
                await ws.send_text(f"{room}:{prefix}:{await ws.receive_text()}")
                await ws.send_bytes(await ws.receive_bytes())
                await ws.receive_text()
            except WebSocketDisconnect:
                events.append("disconnect")

        @app.get("/health")
        async def health():
            return {"ready": app.state.ready}

        app.include_router(router)
        server = mount_web_stream(app, port=0, host="127.0.0.1")
        self.assertFalse(server.is_serving())
        async with self.lifespan(app) as state:
            self.assertIs(state["shared"], shared)
            self.assertTrue(server.is_serving())
            client = await connect(f"webstream://127.0.0.1:{server.port}/v1/echo/room?prefix=hi")
            try:
                await client.send_text("there")
                self.assertEqual(await asyncio.wait_for(client.recv(), 2), "room:hi:there")
                await client.send_binary(b"\x00\xff")
                self.assertEqual(await asyncio.wait_for(client.recv(), 2), b"\x00\xff")
                self.assertNotIn("middleware", state)
                # An ordinary HTTP scope reaches the same app and state.
                replies = []
                async def receive():
                    return {"type": "http.request", "body": b""}
                async def send(event):
                    replies.append(event)
                await app({"type": "http", "asgi": {"version": "3.0"},
                           "http_version": "1.1", "method": "GET", "scheme": "http",
                           "path": "/health", "query_string": b"", "headers": [],
                           "state": state.copy()}, receive, send)
                self.assertEqual(replies[0]["status"], 200)
                self.assertEqual(replies[1]["body"], b'{"ready":true}')
                with self.assertRaisesRegex(RuntimeError, "before the app starts"):
                    mount_web_stream(app, port=0)
            finally:
                # Leave the peer connected so host shutdown must join its handler.
                self.addAsyncCleanup(client.close)
        self.assertEqual(events, ["startup", "dependency", "disconnect",
                                  "dependency cleanup", "shutdown"])
        self.assertFalse(app.state.ready)
        with self.assertRaises(ConnectionClosed):
            await asyncio.wait_for(client.recv(), 2)

    async def test_default_lifespan_runs_existing_event_handlers(self):
        app = FastAPI()
        events = []

        async def startup():
            self.assertFalse(server.is_serving())
            events.append("startup")

        async def shutdown():
            self.assertFalse(server.is_serving())
            events.append("shutdown")

        app.router.add_event_handler("startup", startup)
        app.router.add_event_handler("shutdown", shutdown)
        server = mount_web_stream(app, port=0, host="127.0.0.1")
        async with self.lifespan(app) as state:
            self.assertEqual(state, {})
            self.assertTrue(server.is_serving())
        self.assertEqual(events, ["startup", "shutdown"])

    async def test_app_startup_failure_does_not_start_listener(self):
        @asynccontextmanager
        async def lifespan(app):
            raise ValueError("app startup failed")
            yield

        app = FastAPI(lifespan=lifespan)
        server = mount_web_stream(app, port=0)
        server.start = AsyncMock()
        with self.assertRaisesRegex(ValueError, "app startup failed"):
            async with self.lifespan(app):
                self.fail("startup should fail")
        server.start.assert_not_awaited()
        self.assertFalse(server.is_serving())

    async def test_listener_startup_failure_unwinds_app_lifespan(self):
        events = []

        @asynccontextmanager
        async def lifespan(app):
            events.append("startup")
            try:
                yield
            finally:
                events.append("shutdown")

        app = FastAPI(lifespan=lifespan)
        with socket.socket() as occupied:
            occupied.bind(("127.0.0.1", 0))
            occupied.listen()
            server = mount_web_stream(app, port=occupied.getsockname()[1], host="127.0.0.1")
            with self.assertRaises(ConnectionError):
                async with self.lifespan(app):
                    self.fail("listener startup should fail")
        self.assertEqual(events, ["startup", "shutdown"])
        self.assertFalse(server.is_serving())
        self.assertFalse(server._runtime.is_running)

    async def test_cancelled_startup_stops_listener_and_unwinds_lifespan(self):
        cleaned = asyncio.Event()
        starting = asyncio.Event()

        @asynccontextmanager
        async def lifespan(app):
            try:
                yield
            finally:
                cleaned.set()

        app = FastAPI(lifespan=lifespan)
        server = mount_web_stream(app, port=0)

        async def start():
            starting.set()
            await asyncio.Future()

        server.start = start
        server.stop = AsyncMock()

        async def run():
            async with app.router.lifespan_context(app):
                self.fail("cancelled startup must not complete")

        task = asyncio.create_task(run())
        await asyncio.wait_for(starting.wait(), 2)
        task.cancel()
        with self.assertRaises(asyncio.CancelledError):
            await task
        server.stop.assert_awaited_once()
        self.assertTrue(cleaned.is_set())

    async def test_multiple_listeners_share_one_lifespan(self):
        events = []

        @asynccontextmanager
        async def lifespan(app):
            events.append("startup")
            try:
                yield {"token": "ready"}
            finally:
                self.assertFalse(first.is_serving())
                self.assertFalse(second.is_serving())
                events.append("shutdown")

        app = FastAPI(lifespan=lifespan)

        @app.websocket("/hello")
        async def hello(ws: WebSocket):
            await ws.accept()
            await ws.send_text(ws.state.token)
            await ws.close()

        first = mount_web_stream(app, port=0, host="127.0.0.1")
        second = mount_web_stream(app, port=0, host="127.0.0.1")
        async with self.lifespan(app):
            self.assertNotEqual(first.port, second.port)
            for server in (first, second):
                async with connect(f"webstream://127.0.0.1:{server.port}/hello") as client:
                    self.assertEqual(await asyncio.wait_for(client.recv(), 2), "ready")
        self.assertEqual(events, ["startup", "shutdown"])


if __name__ == "__main__":
    unittest.main()
