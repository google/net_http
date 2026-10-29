"""FastAPI ASGI integration and legacy standalone stream routing helpers."""

from contextlib import asynccontextmanager
from typing import Callable, Dict

from .asgi import ASGIWebSocketAdapter
from .server import WebStreamServer, WebStreamServerConnection

class WebStreamSession(WebStreamServerConnection):
    """Legacy standalone stream session; FastAPI routes use WebSocket instead."""
    pass


class WebStreamRouter:
    """Legacy standalone path dispatcher, independent of FastAPI's routing.

    For FastAPI use @app.websocket() or APIRouter.websocket(), and
    mount_web_stream(app, port=...). This helper does not run ASGI middleware
    or dependency injection and remains available for standalone applications.
    """

    def __init__(self):
        self._routes: Dict[str, Callable] = {}

    def web_stream(self, path: str):
        """Decorator to register a web-stream route endpoint.

        Example:
            router = WebStreamRouter()

            @router.web_stream("/v1/chat/completions")
            async def handle_chat(session: WebStreamSession):
                async for msg in session:
                    await session.send_text(f"Echo: {msg}")
        """
        def decorator(func: Callable):
            norm_path = path.rstrip("/") if path != "/" else "/"
            self._routes[norm_path] = func
            return func
        return decorator

    def get_routes(self) -> Dict[str, Callable]:
        return self._routes

    def create_server(
        self,
        port: int,
        tls: bool = False,
        ca_file: str = "",
        cert_file: str = "",
        key_file: str = "",
        **server_options
    ) -> WebStreamServer:
        server = WebStreamServer(
            port=port,
            tls=tls,
            ca_file=ca_file,
            cert_file=cert_file,
            key_file=key_file,
            connection_cls=WebStreamSession,
            **server_options
        )

        async def on_connection(session: WebStreamSession):
            routes = self._routes
            if not routes:
                await session.close()
                return

            try:
                req_path = session.path.rstrip("/") if session.path != "/" else "/"
                handler = routes.get(req_path)
                if handler:
                    await handler(session)
                else:
                    await session.close()
            finally:
                await session.close()

        server.set_stream_handler(on_connection)
        return server


def mount_web_stream(
    app,
    port: int,
    tls: bool = False,
    ca_file: str = "",
    cert_file: str = "",
    key_file: str = "",
    **server_options
) -> WebStreamServer:
    """Serve a FastAPI app's WebSocket routes over web-stream using ASGI.

    Wraps the app's existing lifespan context. Startup finishes before listening;
    stream handlers finish before the app's shutdown resources are released.
    Lifespan state is shallow-copied into each connection by the ASGI adapter.
    Call once per listener before running the application's lifespan, after
    configuring routers and lifespan. Each returned server supports one run.

    This replaces mount_web_stream(app, legacy_router, port=...). Migrate legacy
    stream handlers to FastAPI WebSocket handlers (including accept()). The
    ASGI adapter's transport compatibility limitations apply.

    Example:
        app = FastAPI()
        @app.websocket("/stream")
        async def stream_handler(websocket: WebSocket):
            await websocket.accept()
            await websocket.send_text("Hello")
            await websocket.close()

        ws_server = mount_web_stream(app, port=8080)
    """
    if app.middleware_stack is not None:
        raise RuntimeError("mount_web_stream must be called before the app starts")
    adapter = ASGIWebSocketAdapter(app)
    server = adapter.create_server(
        port=port,
        tls=tls,
        ca_file=ca_file,
        cert_file=cert_file,
        key_file=key_file,
        **server_options
    )

    original_lifespan = app.router.lifespan_context

    @asynccontextmanager
    async def lifespan(application):
        async with original_lifespan(application) as state:
            adapter.state = state
            try:
                await server.start()
                yield state
            finally:
                await server.stop()

    app.router.lifespan_context = lifespan

    return server
