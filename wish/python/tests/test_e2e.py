import asyncio
import os
import subprocess
import socket
import tempfile
import sys
import unittest
import wish

# Project root based on known directory structure (wish/python/tests/test_client.py)
TEST_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(TEST_DIR, "..", ".."))

SERVER_BIN = os.path.join(PROJECT_ROOT, "cpp", "build", "examples", "tls_echo_server")
SERVER_PLAIN_BIN = os.path.join(PROJECT_ROOT, "cpp", "build", "examples", "echo_server")
CERTS_DIR = os.path.join(PROJECT_ROOT, "cpp", "certs")

def get_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('127.0.0.1', 0))
    port = s.getsockname()[1]
    s.close()
    return port

class TestWishClientE2E(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not os.path.exists(SERVER_BIN):
            raise unittest.SkipTest(f"Echo server not found at {SERVER_BIN}. Compile the C++ project first.")
            
        cls.port = get_free_port()
        
        cmd = [
            SERVER_BIN,
            f"--port={cls.port}",
            f"--ca_cert={os.path.join(CERTS_DIR, 'ca.crt')}",
            f"--server_cert={os.path.join(CERTS_DIR, 'server.crt')}",
            f"--server_key={os.path.join(CERTS_DIR, 'server.key')}",
        ]
        
        # Start server in background
        cls.server_proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, 'server_proc'):
            cls.server_proc.terminate()
            try:
                cls.server_proc.wait(timeout=2)
            except subprocess.TimeoutExpired:
                cls.server_proc.kill()

    def test_echo(self):
        async def run():
            # Allow the server more time to start up to avoid Connection reset
            await asyncio.sleep(1.0)
            
            uri = f"wishs://127.0.0.1:{self.port}"
            
            async with wish.connect(
                uri,
                ca_file=os.path.join(CERTS_DIR, "ca.crt"),
                cert_file=os.path.join(CERTS_DIR, "client.crt"),
                key_file=os.path.join(CERTS_DIR, "client.key"),
            ) as ws:
                test_msg = "Hello E2E from Python over TLS!"
                await ws.send(test_msg)
                
                # Wait for response
                msg = await asyncio.wait_for(ws.recv(), timeout=2.0)
                self.assertEqual(msg, test_msg)
                
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(run())


class TestWishClientPlainE2E(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not os.path.exists(SERVER_PLAIN_BIN):
            raise unittest.SkipTest(f"Plain echo server not found at {SERVER_PLAIN_BIN}. Compile the C++ project first.")
            
        cls.port = get_free_port()
        
        cmd = [
            SERVER_PLAIN_BIN,
            f"--port={cls.port}",
        ]
        
        # Start server in background
        cls.server_proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, 'server_proc'):
            cls.server_proc.terminate()
            try:
                cls.server_proc.wait(timeout=2)
            except subprocess.TimeoutExpired:
                cls.server_proc.kill()

    def test_echo_plain(self):
        async def run():
            # Allow the server more time to start up to avoid Connection reset
            await asyncio.sleep(1.0)
            
            uri = f"wish://127.0.0.1:{self.port}"
            
            async with wish.connect(uri) as ws:
                test_msg = "Hello E2E from Python over plain TCP!"
                await ws.send(test_msg)
                
                # Wait for response
                msg = await asyncio.wait_for(ws.recv(), timeout=2.0)
                self.assertEqual(msg, test_msg)
                
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(run())


if __name__ == "__main__":
    result = unittest.main(exit=False).result
    os._exit(0 if result.wasSuccessful() else 1)
