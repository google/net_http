import asyncio
import threading
from urllib.parse import urlparse

from . import web_stream_ext

# WebStream Opcodes
WEB_STREAM_OPCODE_TEXT = 1
WEB_STREAM_OPCODE_BINARY = 2
WEB_STREAM_OPCODE_METADATA = 3

class WebStreamConnection:
    def __init__(self, host, port, tls, ca_file="", cert_file="", key_file="", path="/"):
        self._host = host
        self._port = port
        self.path = path or "/"

        if tls:
            self._client = web_stream_ext.TlsClient(ca_file, cert_file, key_file, host, port, self.path)
        else:
            self._client = web_stream_ext.PlainClient(host, port, self.path)

        self._client.init()  # raises RuntimeError on failure

        self._loop = asyncio.get_running_loop()

        self._recv_queue = asyncio.Queue()
        self._open_future = self._loop.create_future()
        self._thread = None
        self._handler = None
        self._closed = False
        self._recv_error = None

        def safe_call(func, *args):
            if not self._loop.is_closed():
                try:
                    self._loop.call_soon_threadsafe(func, *args)
                except RuntimeError:
                    pass

        def on_open(handler):
            def set_handler():
                if self._closed or self._open_future.done():
                    return
                self._handler = handler
                self._open_future.set_result(True)
            safe_call(set_handler)

        def enqueue_message(opcode, msg):
            if not self._closed:
                self._recv_queue.put_nowait((opcode, msg))

        def on_message(opcode, msg):
            safe_call(enqueue_message, opcode, msg)

        def on_error():
            def set_error():
                error = ConnectionError(
                    "Connection lost" if self._open_future.done()
                    else "Connection failed or lost")
                self._terminate(error)
                if not self._open_future.done():
                    self._open_future.set_exception(error)
            safe_call(set_error)

        def on_close():
            def set_close():
                error = ConnectionAbortedError(
                    "Connection closed" if self._open_future.done()
                    else "Connection closed before open")
                self._terminate(error)
                if not self._open_future.done():
                    self._open_future.set_exception(error)
            safe_call(set_close)

        self._client.set_on_open(on_open)
        self._client.set_on_message(on_message)
        self._client.set_on_error(on_error)
        self._client.set_on_close(on_close)

    def _terminate(self, error):
        if self._closed:
            return
        self._closed = True
        # Keep the first failure without retaining exception tracebacks. None is
        # a terminal marker placed after all previously received messages.
        self._recv_error = (type(error), error.args)
        self._recv_queue.put_nowait(None)

    async def connect(self):
        try:
            # Run the C++ event loop in a background daemon thread.
            self._thread = threading.Thread(target=self._client.run, daemon=True)
            self._thread.start()
            # Wait until the on_open callback fires.
            await self._open_future
        except BaseException:
            # CancelledError is a BaseException. __aexit__ will not run if
            # __aenter__ fails, so finish cleanup before propagating the failure.
            # A second cancel must not interrupt stop/join or leave it orphaned.
            cleanup = self._loop.create_task(self.close())
            while not cleanup.done():
                try:
                    await asyncio.shield(cleanup)
                except asyncio.CancelledError:
                    continue
            cleanup.result()
            raise
        return self

    async def close(self):
        """Sends EoF (Close) over the WebStream connection."""
        if self._handler:
            try:
                self._handler.close()
            except Exception:
                pass
            self._handler = None
        self._terminate(ConnectionAbortedError("Connection closed"))
        if self._client:
            self._client.stop()
        if self._thread and self._thread.is_alive():
            await asyncio.to_thread(self._thread.join)
        self._thread = None
        self._client = None

    async def send(self, data):
        """Sends data over the WebStream connection. If data is bytes, sends as binary, else text."""
        if not self._handler:
            raise RuntimeError("Connection is not open")

        if isinstance(data, bytes):
            self._handler.send_binary(data)
        else:
            self._handler.send_text(str(data))

    async def recv(self, decode=None):
        """Receive buffered messages, then keep raising the first terminal error."""
        res = await self._recv_queue.get()

        if res is None:
            # Pass the marker to concurrent and future receivers, too.
            self._recv_queue.put_nowait(None)
            error_type, args = self._recv_error
            raise error_type(*args)

        opcode, msg = res
        
        # Determine if we should return str or bytes
        # Default behavior:
        # - WEB_STREAM_OPCODE_TEXT -> str
        # - WEB_STREAM_OPCODE_BINARY -> bytes
        # - WEB_STREAM_OPCODE_METADATA -> bytes
        # Note: UTF-8 decoding for metadata is undefined in the specification.
        # We treat it similarly to binary messages for now (i.e. no UTF-8 decoding by default).
        should_decode = decode
        if should_decode is None:
            should_decode = (opcode == WEB_STREAM_OPCODE_TEXT)

        if should_decode:
            return msg.decode("utf-8")
        else:
            return msg

    async def __aiter__(self):
        """Iterate on incoming messages."""
        try:
            while True:
                yield await self.recv()
        except (ConnectionAbortedError, RuntimeError):
            pass


class _ConnectContextManager:
    def __init__(self, uri, ca_file="", cert_file="", key_file=""):
        parsed = urlparse(uri)

        self.tls = parsed.scheme in ("webstreams", "https")

        self.host = parsed.hostname
        self.port = parsed.port or (443 if self.tls else 80)
        self.path = parsed.path or "/"

        self.ca_file = ca_file
        self.cert_file = cert_file
        self.key_file = key_file

        self.conn = None

    async def __aenter__(self):
        self.conn = WebStreamConnection(self.host,
                                        self.port,
                                        self.tls,
                                        self.ca_file,
                                        self.cert_file,
                                        self.key_file,
                                        path=self.path)
        await self.conn.connect()
        return self.conn

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.conn.close()

def connect(uri, ca_file="", cert_file="", key_file=""):
    return _ConnectContextManager(uri, ca_file, cert_file, key_file)
