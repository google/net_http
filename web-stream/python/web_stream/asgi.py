"""Experimental ASGI WebSocket interface over an established web-stream.

This is an application compatibility adapter, not an RFC 6455 transport or a
complete ASGI server. See README.md for handshake and connection-info limits.
"""

import asyncio
from urllib.parse import unquote

from .exceptions import ConnectionClosed, ConnectionClosedOK
from .server import WebStreamServer


class ASGIWebSocketAdapter:
    """Call an ASGI 3 app for each connection, using a ``websocket`` scope.

    Install as a WebStreamServer stream handler, or use create_server(). The
    host owns application lifespan; this adapter never sends lifespan events.
    ``state``, when provided, is shallow-copied into each connection's scope.
    """

    def __init__(self, app, *, scheme="ws", root_path="", state=None):
        if not callable(app):
            raise TypeError("app must be an ASGI 3 callable")
        if scheme not in ("ws", "wss"):
            raise ValueError("scheme must be 'ws' or 'wss'")
        self.app = app
        self.scheme = scheme
        self.root_path = root_path
        self.state = state

    def create_server(self, port, **server_options):
        """Create a WebStreamServer; infer ws/wss from its TLS setting."""
        server = WebStreamServer(port, **server_options)

        async def handle(connection):
            await self._handle(connection, "wss" if server.tls else "ws")

        server.set_stream_handler(handle)
        return server

    async def __call__(self, connection):
        await self._handle(connection, self.scheme)

    async def _handle(self, connection, scheme):
        # The native handshake preserves the request target in connection.path.
        path, separator, query = connection.path.partition("?")
        scope = {
            "type": "websocket",
            "asgi": {"version": "3.0", "spec_version": "2.5"},
            "http_version": "1.1",
            "scheme": scheme,
            "path": unquote(path),
            "raw_path": path.encode("utf-8"),
            "query_string": query.encode("utf-8") if separator else b"",
            "root_path": self.root_path,
            "headers": [],
            "subprotocols": [],
            "client": None,
            "server": None,
            "extensions": {},
        }
        if self.state is not None:
            scope["state"] = self.state.copy()
        session = _Session(connection)
        try:
            result = await self.app(scope, session.receive, session.send)
            if result is not None:
                raise RuntimeError("ASGI application must return None")
            if not session.accepted and session.disconnect is None:
                raise RuntimeError("ASGI application returned without accept or close")
        finally:
            # Invalidate retained callbacks before yielding to transport cleanup.
            session.finished = True
            session.ready.set()
            await connection.close()


class _Session:
    def __init__(self, connection):
        self.connection = connection
        self.connected = False
        self.accepted = False
        self.finished = False
        self.disconnect = None
        self.ready = asyncio.Event()
        self.send_lock = asyncio.Lock()

    def _disconnected(self, code, reason=""):
        if self.disconnect is None:
            self.disconnect = {"type": "websocket.disconnect",
                               "code": code, "reason": reason}
        self.ready.set()
        return self.disconnect.copy()

    async def receive(self):
        if self.finished:
            raise RuntimeError("ASGI application has finished")
        if not self.connected:
            self.connected = True
            return {"type": "websocket.connect"}
        # A concurrent receive waits for accept/close rather than delivering data
        # before acceptance. Cancellation leaves the underlying message queued.
        await self.ready.wait()
        if self.finished:
            raise RuntimeError("ASGI application has finished")
        if self.disconnect is not None:
            return self.disconnect.copy()
        try:
            message = await self.connection.recv_message()
        except ConnectionClosed as error:
            event = self._disconnected(1005 if isinstance(error, ConnectionClosedOK) else 1006)
            # WebSocket has no half-close: peer EOF ends both directions here.
            await self.connection.close()
            return event
        # Local close can race with an already-buffered receive.
        if self.disconnect is not None:
            return self.disconnect.copy()
        if message.opcode == 1:
            try:
                return {"type": "websocket.receive", "text": message.data.decode("utf-8")}
            except UnicodeDecodeError:
                event = self._disconnected(1007, "Invalid UTF-8 text")
        elif message.opcode == 2:
            return {"type": "websocket.receive", "bytes": message.data}
        else:
            event = self._disconnected(1003, "web-stream metadata has no WebSocket representation")
        await self.connection.close()
        return event

    async def send(self, message):
        async with self.send_lock:
            if self.finished or self.disconnect is not None:
                raise OSError("ASGI WebSocket connection is closed")
            kind = message["type"]
            if kind == "websocket.close":
                code = message.get("code", 1000)
                reason = message.get("reason") or ""
                if not isinstance(code, int) or isinstance(code, bool):
                    raise TypeError("WebSocket close code must be int")
                if not isinstance(reason, str):
                    raise TypeError("WebSocket close reason must be str")
                self._disconnected(code, reason)
                await self.connection.close()
            elif kind == "websocket.accept" and not self.accepted:
                if message.get("subprotocol") is not None or list(message.get("headers", [])):
                    raise ValueError("web-stream cannot negotiate subprotocols or accept headers")
                self.accepted = True
                self.ready.set()
            elif kind == "websocket.send" and self.accepted:
                text, data = message.get("text"), message.get("bytes")
                if (text is None) == (data is None):
                    raise ValueError("Exactly one of text and bytes must be non-None")
                if text is not None and not isinstance(text, str):
                    raise TypeError("WebSocket text must be str")
                if data is not None and not isinstance(data, bytes):
                    raise TypeError("WebSocket bytes must be bytes")
                try:
                    if text is not None:
                        await self.connection.send_text(text)
                    else:
                        await self.connection.send_binary(data)
                except ConnectionClosed as error:
                    self._disconnected(1006)
                    raise OSError("ASGI WebSocket connection is closed") from error
            else:
                raise RuntimeError("Unexpected ASGI event: " + str(kind))
