"""Established Plain/TLS streams survive the default handshake timeout."""

import asyncio
from pathlib import Path
import socket
import unittest

from web_stream import connect, WebStreamServer


CERTS_DIR = Path(__file__).resolve().parents[2] / "cpp" / "certs"


class TestIdleConnection(unittest.IsolatedAsyncioTestCase):
    async def check_idle_connection(self, tls):
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        credentials = {"ca_file": str(CERTS_DIR / "ca.crt")}
        server = WebStreamServer(
            port, tls=tls, **credentials,
            cert_file=str(CERTS_DIR / "server.crt"),
            key_file=str(CERTS_DIR / "server.key"),
        )
        accepted = asyncio.get_running_loop().create_future()

        async def echo(conn):
            accepted.set_result(conn)
            async for message in conn:
                await conn.send(message)

        server.set_stream_handler(echo)
        await server.start()
        try:
            scheme = "webstreams" if tls else "webstream"
            async with connect(
                f"{scheme}://127.0.0.1:{port}", **credentials,
                cert_file=str(CERTS_DIR / "client.crt"),
                key_file=str(CERTS_DIR / "client.key"),
            ) as client:
                await client.send("before idle")
                self.assertEqual(await asyncio.wait_for(client.recv(), 3), "before idle")

                # Exercise the actual default (10 seconds), including the TLS
                # bufferevent, rather than mocking a timer or injecting messages.
                await asyncio.sleep(11)

                # Check each receive direction independently after the idle gap.
                await accepted.result().send("server after idle")
                self.assertEqual(await asyncio.wait_for(client.recv(), 3), "server after idle")
                await client.send(b"client after idle\x00")
                self.assertEqual(await asyncio.wait_for(client.recv(), 3), b"client after idle\x00")
        finally:
            await server.stop()

    async def test_plain_connection_survives_idle(self):
        await asyncio.wait_for(self.check_idle_connection(False), 20)

    async def test_tls_connection_survives_idle(self):
        await asyncio.wait_for(self.check_idle_connection(True), 20)
