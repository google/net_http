import asyncio
import threading
from urllib.parse import urlparse

from . import web_stream_ext

class WebStreamConnection:
    def __init__(self, host, port, tls, ca_file="", cert_file="", key_file=""):
        self._host = host
        self._port = port

        if tls:
            self._client = web_stream_ext.TlsClient(ca_file, cert_file, key_file, host, port)
        else:
            self._client = web_stream_ext.PlainClient(host, port)

        self._client.init()  # raises RuntimeError on failure

        self._loop = asyncio.get_running_loop()

        self._recv_queue = asyncio.Queue()
        self._open_future = self._loop.create_future()
        self._thread = None
        self._handler = None

        def on_open(handler):
            def set_handler():
                self._handler = handler
                self._open_future.set_result(True)
            self._loop.call_soon_threadsafe(set_handler)

        def on_message(opcode, msg):
            self._loop.call_soon_threadsafe(self._recv_queue.put_nowait, (opcode, msg))

        def on_error():
            def set_error():
                if not self._open_future.done():
                    self._open_future.set_exception(ConnectionError("Connection failed or lost"))
                else:
                    self._recv_queue.put_nowait(ConnectionError("Connection lost"))
            self._loop.call_soon_threadsafe(set_error)

        def on_close():
            def set_close():
                self._recv_queue.put_nowait(ConnectionAbortedError("Connection closed"))
            self._loop.call_soon_threadsafe(set_close)

        self._client.set_on_open(on_open)
        self._client.set_on_message(on_message)
        self._client.set_on_error(on_error)
        self._client.set_on_close(on_close)

    async def connect(self):
        # Run the C++ event loop in a background daemon thread.
        self._thread = threading.Thread(target=self._client.run, daemon=True)
        self._thread.start()
        # Wait until the on_open callback fires
        await self._open_future
        return self

    async def close(self):
        """Sends EoF (Close) over the WebStream connection."""
        if self._handler:
            self._handler.close()
        self._client = None

    async def send(self, data):
        """Sends data over the WebStream connection. If data is bytes, sends as binary, else text."""
        if not self._handler:
            raise RuntimeError("Connection is not open")

        if isinstance(data, bytes):
            self._handler.send_binary(data)
        else:
            self._handler.send_text(str(data))

    async def recv(self):
        """Receives a message from the WebStream connection."""
        if not self._client:
            raise RuntimeError("Connection is closed")

        res = await self._recv_queue.get()

        if isinstance(res, Exception):
            raise res

        opcode, msg = res
        # You can process opcode here if you want to distinguish text/binary
        # We'll just return the message
        # In actual implementation: 1=Text, 2=Binary
        if opcode == 2:
            return msg.encode("utf-8") if isinstance(msg, str) else msg
        else:
            return msg

class _ConnectContextManager:
    def __init__(self, uri, ca_file="", cert_file="", key_file=""):
        parsed = urlparse(uri)

        self.tls = parsed.scheme in ("webstreams", "https")

        self.host = parsed.hostname
        self.port = parsed.port or (443 if self.tls else 80)

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
                                        self.key_file)
        await self.conn.connect()
        return self.conn

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.conn.close()

def connect(uri, ca_file="", cert_file="", key_file=""):
    return _ConnectContextManager(uri, ca_file, cert_file, key_file)
