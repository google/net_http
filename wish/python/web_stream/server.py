import asyncio
import threading
from . import web_stream_ext

WEB_STREAM_OPCODE_TEXT = 1
WEB_STREAM_OPCODE_BINARY = 2
WEB_STREAM_OPCODE_METADATA = 3

class WebStreamServerConnection:
    def __init__(self, handler_ref, loop):
        self._handler_ref = handler_ref
        self._loop = loop
        self._recv_queue = asyncio.Queue()
        self._closed = False

        def safe_call(func, *args):
            if not self._loop.is_closed():
                try:
                    self._loop.call_soon_threadsafe(func, *args)
                except RuntimeError:
                    pass

        def on_message(opcode, msg):
            safe_call(self._recv_queue.put_nowait, (opcode, msg))

        def on_error():
            def set_error():
                self._closed = True
                safe_call(self._recv_queue.put_nowait, ConnectionError("Connection lost or error occurred"))
            safe_call(set_error)

        def on_close():
            def set_close():
                self._closed = True
                safe_call(self._recv_queue.put_nowait, ConnectionAbortedError("Connection closed by client"))
            safe_call(set_close)

        self._handler_ref.set_on_message(on_message)
        self._handler_ref.set_on_error(on_error)
        self._handler_ref.set_on_close(on_close)

    async def send_text(self, text: str):
        if self._closed:
            raise RuntimeError("Connection is closed")
        self._handler_ref.send_text(text)

    async def send_binary(self, data):
        if self._closed:
            raise RuntimeError("Connection is closed")
        self._handler_ref.send_binary(data)

    async def send_metadata(self, data):
        if self._closed:
            raise RuntimeError("Connection is closed")
        self._handler_ref.send_metadata(data)

    async def send(self, data):
        """Sends data over the connection. If bytes, sends binary, else text."""
        if isinstance(data, bytes):
            await self.send_binary(data)
        else:
            await self.send_text(str(data))

    async def recv(self, decode=None):
        if self._closed and self._recv_queue.empty():
            raise RuntimeError("Connection is closed")

        res = await self._recv_queue.get()
        if isinstance(res, Exception):
            raise res

        opcode, msg = res
        should_decode = decode
        if should_decode is None:
            should_decode = (opcode == WEB_STREAM_OPCODE_TEXT)

        if should_decode:
            return msg.decode("utf-8")
        else:
            return msg

    async def close(self):
        if not self._closed:
            self._closed = True
            try:
                self._handler_ref.set_on_message(None)
                self._handler_ref.set_on_close(None)
                self._handler_ref.set_on_error(None)
            except Exception:
                pass
            self._handler_ref.close()

    async def __aiter__(self):
        try:
            while True:
                yield await self.recv()
        except (ConnectionAbortedError, ConnectionError, RuntimeError):
            pass


class WebStreamServer:
    def __init__(self, port, tls=False, ca_file="", cert_file="", key_file=""):
        self.port = port
        self.tls = tls
        if tls:
            self._server = web_stream_ext.TlsServer(ca_file, cert_file, key_file, port)
        else:
            self._server = web_stream_ext.PlainServer(port)

        self._loop = None
        self._thread = None
        self._stream_handler = None

    def set_stream_handler(self, handler):
        """handler is an async function: async def handler(conn: WebStreamServerConnection)"""
        self._stream_handler = handler

    async def start(self):
        self._loop = asyncio.get_running_loop()

        def on_stream(handler_ref):
            conn = WebStreamServerConnection(handler_ref, self._loop)
            if self._stream_handler:
                asyncio.run_coroutine_threadsafe(self._stream_handler(conn), self._loop)

        self._server.set_on_stream(on_stream)
        self._server.init()

        self._thread = threading.Thread(target=self._server.run, daemon=True)
        self._thread.start()

    async def stop(self):
        if self._server:
            self._server.stop()
            self._server = None
