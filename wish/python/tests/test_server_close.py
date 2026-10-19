"""Server close sends a clean protocol EOF and reports cleanup failures."""

import asyncio
from pathlib import Path
import socket
import unittest
from unittest.mock import Mock

from web_stream import connect, WebStreamRouter, WebStreamServer
from web_stream.server import WebStreamServerConnection


CERTS_DIR = Path(__file__).resolve().parents[2] / "cpp" / "certs"


class TestServerClose(unittest.IsolatedAsyncioTestCase):
    async def check_peer_close(self, tls, scenario):
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        options = dict(
            port=port, tls=tls, ca_file=str(CERTS_DIR / "ca.crt"),
            cert_file=str(CERTS_DIR / "server.crt"),
            key_file=str(CERTS_DIR / "server.key"),
        )
        handler_done = asyncio.Event()

        async def handler(conn):
            if scenario == "explicit":
                await conn.send_text("last text")
                await conn.send_binary(b"last binary\x00")
                await conn.close()
                await conn.close()
                handler_done.set()
            # Returning without an explicit close must also send EOF.

        if scenario == "missing_route":
            router = WebStreamRouter()
            router.web_stream("/present")(handler)
            server = router.create_server(**options)
        else:
            server = WebStreamServer(**options)
            server.set_stream_handler(handler)

        await server.start()
        try:
            scheme = "webstreams" if tls else "webstream"
            async with connect(
                f"{scheme}://127.0.0.1:{port}/missing",
                ca_file=str(CERTS_DIR / "ca.crt"),
                cert_file=str(CERTS_DIR / "client.crt"),
                key_file=str(CERTS_DIR / "client.key"),
            ) as client:
                if scenario == "explicit":
                    self.assertEqual(await asyncio.wait_for(client.recv(), 3), "last text")
                    self.assertEqual(await asyncio.wait_for(client.recv(), 3), b"last binary\x00")
                    await asyncio.wait_for(handler_done.wait(), 3)
                # Premature TCP EOF is ConnectionError; only a terminal chunk
                # produces ConnectionAbortedError on the native client.
                with self.assertRaises(ConnectionAbortedError):
                    await asyncio.wait_for(client.recv(), 3)
        finally:
            await server.stop()

    async def test_plain_peer_observes_server_close(self):
        for scenario in ("explicit", "handler_return", "missing_route"):
            with self.subTest(scenario=scenario):
                await self.check_peer_close(False, scenario)

    async def test_tls_peer_observes_server_close(self):
        for scenario in ("explicit", "handler_return", "missing_route"):
            with self.subTest(scenario=scenario):
                await self.check_peer_close(True, scenario)

    async def test_callback_cleanup_failure_still_closes_transport(self):
        ref = Mock()
        ref.path.return_value = "/"
        conn = WebStreamServerConnection(ref, asyncio.get_running_loop())
        ref.set_on_message.side_effect = TypeError("callback cleanup failed")

        with self.assertRaisesRegex(TypeError, "callback cleanup failed"):
            await conn.close()

        ref.close.assert_called_once_with()
        await conn.close()
        ref.close.assert_called_once_with()
        with self.assertRaisesRegex(RuntimeError, "closed"):
            await conn.send_text("after close")

    async def test_transport_close_failure_is_reported(self):
        ref = Mock()
        ref.path.return_value = "/"
        conn = WebStreamServerConnection(ref, asyncio.get_running_loop())
        ref.close.side_effect = RuntimeError("transport close failed")

        with self.assertRaisesRegex(RuntimeError, "transport close failed"):
            await conn.close()
