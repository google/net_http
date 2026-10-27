"""TLS peer identity checks using certificates signed by the trusted test CA."""

import asyncio
from pathlib import Path
import shutil
import socket
import ssl
import subprocess
import tempfile
import unittest

from web_stream import connect, WebStreamServer


CERTS_DIR = Path(__file__).resolve().parents[2] / "cpp" / "certs"


class TestTlsIdentity(unittest.IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls):
        if not shutil.which("openssl"):
            raise unittest.SkipTest("openssl is required to generate test certificates")
        cls.temp = tempfile.TemporaryDirectory()
        cls.addClassCleanup(cls.temp.cleanup)
        cls.certificates = {}
        # Deliberately vary CN independently of SAN to catch CN fallback and
        # treating a numeric dNSName as an iPAddress identity.
        variants = {
            "dns": ("wrong.example", "DNS:localhost"),
            "ip": ("wrong.example", "IP:127.0.0.1"),
            "wrong_dns": ("localhost", "DNS:other.example"),
            "wrong_ip": ("127.0.0.1", "IP:127.0.0.2,DNS:127.0.0.1"),
            "cn_dns": ("localhost", None),
            "cn_ip": ("127.0.0.1", None),
        }
        for serial, (name, (cn, san)) in enumerate(variants.items(), 1):
            base = Path(cls.temp.name) / name
            csr, cert, extensions = (base.with_suffix(s) for s in (".csr", ".crt", ".ext"))
            extensions.write_text(
                "basicConstraints=critical,CA:FALSE\n"
                "extendedKeyUsage=serverAuth\n"
                + (f"subjectAltName={san}\n" if san else "")
            )
            subprocess.run([
                "openssl", "req", "-new", "-key", str(CERTS_DIR / "server.key"),
                "-subj", f"/CN={cn}", "-out", str(csr),
            ], check=True, capture_output=True)
            subprocess.run([
                "openssl", "x509", "-req", "-in", str(csr),
                "-CA", str(CERTS_DIR / "ca.crt"),
                "-CAkey", str(CERTS_DIR / "ca.key"),
                "-set_serial", str(serial), "-days", "1", "-sha256",
                "-extfile", str(extensions), "-out", str(cert),
            ], check=True, capture_output=True)
            cls.certificates[name] = str(cert)

    async def check_identity(self, host, certificate, *, accepted, trusted=True):
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        server = WebStreamServer(
            port, tls=True, ca_file=str(CERTS_DIR / "ca.crt"),
            cert_file=self.certificates[certificate],
            key_file=str(CERTS_DIR / "server.key"),
        )
        opened = []

        async def echo(conn):
            opened.append(conn)
            async for message in conn:
                await conn.send(message)

        server.set_stream_handler(echo)
        await server.start()
        context = connect(
            f"webstreams://{host}:{port}",
            ca_file=str(CERTS_DIR / ("ca.crt" if trusted else "client.crt")),
            cert_file=str(CERTS_DIR / "client.crt"),
            key_file=str(CERTS_DIR / "client.key"),
        )
        async def exchange():
            async with context as client:
                if not accepted:
                    self.fail("TLS accepted a certificate for the wrong peer")
                await client.send("verified peer")
                self.assertEqual(await client.recv(), "verified peer")

        try:
            if accepted:
                await asyncio.wait_for(exchange(), 5)
                self.assertEqual(len(opened), 1)
            else:
                with self.assertRaises(ConnectionError):
                    await asyncio.wait_for(exchange(), 5)
                self.assertEqual(opened, [])
            self.assertTrue(context.conn._released)
            self.assertNotIn(context.conn._identifier, server._runtime._objects)
        finally:
            await server.stop()

    async def test_matching_dns_san(self):
        await self.check_identity("localhost", "dns", accepted=True)

    async def test_matching_ip_san(self):
        await self.check_identity("127.0.0.1", "ip", accepted=True)

    async def test_wrong_dns_san_rejected(self):
        await self.check_identity("localhost", "wrong_dns", accepted=False)

    async def test_wrong_ip_san_rejected_even_with_matching_dns_san(self):
        await self.check_identity("127.0.0.1", "wrong_ip", accepted=False)

    async def test_common_name_alone_rejected(self):
        for host, certificate in (("localhost", "cn_dns"), ("127.0.0.1", "cn_ip")):
            with self.subTest(host=host):
                await self.check_identity(host, certificate, accepted=False)

    async def test_untrusted_certificate_rejected(self):
        await self.check_identity("localhost", "dns", accepted=False, trusted=False)

    async def test_sni_for_dns_only(self):
        for host, expected in (("localhost", "localhost"), ("127.0.0.1", None)):
            with self.subTest(host=host):
                names = []
                tls = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
                tls.load_cert_chain(CERTS_DIR / "server.crt", CERTS_DIR / "server.key")
                tls.set_servername_callback(lambda sock, name, ctx: names.append(name))

                async def close_peer(reader, writer):
                    await reader.readuntil(b"\r\n\r\n")
                    writer.close()
                    await writer.wait_closed()

                async with await asyncio.start_server(
                    close_peer, "127.0.0.1", 0, ssl=tls,
                ) as server:
                    port = server.sockets[0].getsockname()[1]
                    # This peer only speaks TLS, so the WebStream handshake fails
                    # after TLS has recorded the ClientHello's SNI extension.
                    async def attempt():
                        async with connect(
                            f"webstreams://{host}:{port}",
                            ca_file=str(CERTS_DIR / "ca.crt"),
                        ):
                            self.fail("peer does not implement WebStream")

                    with self.assertRaises(ConnectionError):
                        await asyncio.wait_for(attempt(), 5)
                self.assertEqual(names, [expected])
