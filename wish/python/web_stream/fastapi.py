from typing import Callable, Dict, Optional
import asyncio
from .server import WebStreamServer, WebStreamServerConnection

class WebStreamSession(WebStreamServerConnection):
    """Represents an active web-stream session in a FastAPI endpoint handler."""
    pass


class WebStreamRouter:
    """FastAPI-style APIRouter for WebStream protocol endpoints."""

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
        key_file: str = ""
    ) -> WebStreamServer:
        server = WebStreamServer(
            port=port,
            tls=tls,
            ca_file=ca_file,
            cert_file=cert_file,
            key_file=key_file,
            connection_cls=WebStreamSession
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
    router: WebStreamRouter,
    port: int,
    tls: bool = False,
    ca_file: str = "",
    cert_file: str = "",
    key_file: str = ""
) -> WebStreamServer:
    """Attaches a WebStreamServer to a FastAPI application lifecycle.

    Example:
        app = FastAPI()
        ws_router = WebStreamRouter()

        @ws_router.web_stream("/stream")
        async def stream_handler(session: WebStreamSession):
            ...

        ws_server = mount_web_stream(app, ws_router, port=8080)
    """
    server = router.create_server(
        port=port,
        tls=tls,
        ca_file=ca_file,
        cert_file=cert_file,
        key_file=key_file
    )

    @app.on_event("startup")
    async def _on_startup():
        await server.start()

    @app.on_event("shutdown")
    async def _on_shutdown():
        await server.stop()

    return server
