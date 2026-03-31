import asyncio
import threading
from urllib.parse import urlparse

from . import wish_ext

class WishConnection:
    def __init__(self, host, port, ca_file, cert_file, key_file):
        self._host = host
        self._port = port
        self._client = wish_ext.TlsClient(ca_file, cert_file, key_file, host, port)
        if not self._client.init():
            raise RuntimeError(f"Failed to initialize TlsClient for {host}:{port}")
        
        self._loop = asyncio.get_running_loop()
        self._recv_queue = asyncio.Queue()
        self._open_future = self._loop.create_future()
        self._handler = None
        
        def on_open(handler):
            self._handler = handler
            self._loop.call_soon_threadsafe(self._open_future.set_result, True)
            
        def on_message(opcode, msg):
            self._loop.call_soon_threadsafe(self._recv_queue.put_nowait, (opcode, msg))
            
        self._client.set_on_open(on_open)
        self._client.set_on_message(on_message)

    async def connect(self):
        # Run the C++ event loop in a background thread.
        # Must use create_task() so it's actually scheduled and runs
        # concurrently while we await the open_future below.
        asyncio.create_task(asyncio.to_thread(self._client.run))
        # Wait until the on_open callback fires
        await self._open_future
        return self

    async def send(self, data):
        """Sends data over the WiSH connection. If data is bytes, sends as binary, else text."""
        if not self._handler:
            raise RuntimeError("Connection is not open")
            
        if isinstance(data, bytes):
            self._handler.send_binary(data)
        else:
            self._handler.send_text(str(data))
            
    async def recv(self):
        """Receives a message from the WiSH connection."""
        opcode, msg = await self._recv_queue.get()
        # You can process opcode here if you want to distinguish text/binary
        # We'll just return the message
        # In actual implementation: 1=Text, 2=Binary
        if opcode == 2:
            return msg.encode('utf-8') if isinstance(msg, str) else msg
        else:
            return msg

class _ConnectContextManager:
    def __init__(self, uri, ca_file="", cert_file="", key_file=""):
        parsed = urlparse(uri)
        self.host = parsed.hostname
        self.port = parsed.port or (443 if parsed.scheme in ["wishs", "wss", "https"] else 80)
        self.ca_file = ca_file
        self.cert_file = cert_file
        self.key_file = key_file
        self.conn = None

    async def __aenter__(self):
        self.conn = WishConnection(self.host, self.port, self.ca_file, self.cert_file, self.key_file)
        await self.conn.connect()
        return self.conn

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # We don't have explicit close method on TlsClient yet,
        # but the connection would drop if the process exits,
        # or we could add a shutdown mechanism.
        pass

def connect(uri, ca_file="", cert_file="", key_file=""):
    return _ConnectContextManager(uri, ca_file, cert_file, key_file)
