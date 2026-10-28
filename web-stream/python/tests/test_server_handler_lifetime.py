"""Retained native server handles must be safe after shutdown and destruction.

Run each case in a subprocess so a regression reports a crash or timeout rather
than crashing or hanging the entire test suite. No C++ example binary is needed.
"""

import gc
import importlib
from pathlib import Path
import socket
import subprocess
import sys
import threading
import unittest


CERTS_DIR = Path(__file__).resolve().parents[2] / "cpp" / "certs"


def probe(extension_dir, transport, lifecycle):
    # Use the same extension as the parent, including when testing a fresh build
    # without installing it over the development environment's existing wheel.
    sys.path.insert(0, extension_dir)
    ext = importlib.import_module("web_stream_ext")
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]

    if transport == "tls":
        server = ext.TlsServer(
            str(CERTS_DIR / "ca.crt"),
            str(CERTS_DIR / "server.crt"),
            str(CERTS_DIR / "server.key"),
            port,
        )
    else:
        server = ext.PlainServer(port)

    refs = []
    accepted = threading.Event()
    finalized = []

    class Marker:
        def __del__(self):
            finalized.append(True)

    def on_stream(ref):
        ref.set_on_message(lambda *args, handle=ref, marker=Marker(): None)
        refs.append(ref)
        if len(refs) == 2:
            accepted.set()

    if lifecycle == "gc":
        # Exercise the wrapper's tp_traverse / tp_clear / tp_finalize cycle.
        server.set_on_stream(lambda ref, owner=server: on_stream(ref))
    else:
        server.set_on_stream(on_stream)

    server.init()
    server_thread = threading.Thread(target=server.run, daemon=True)
    server_thread.start()
    clients = []
    client_threads = []
    try:
        for i in range(2):
            if transport == "tls":
                client = ext.TlsClient(
                    str(CERTS_DIR / "ca.crt"),
                    str(CERTS_DIR / "client.crt"),
                    str(CERTS_DIR / "client.key"),
                    "127.0.0.1", port, f"/retained/{i}",
                )
            else:
                client = ext.PlainClient("127.0.0.1", port, f"/retained/{i}")
            client.init()
            clients.append(client)
            thread = threading.Thread(target=client.run, daemon=True)
            client_threads.append(thread)
            thread.start()

        assert accepted.wait(3), "server did not accept both streams"
        assert {ref.path() for ref in refs} == {"/retained/0", "/retained/1"}
        gc.collect()
        assert not finalized, "GC cleared an active native callback"
        for ref in refs:
            assert ref.send_text("before shutdown") == 0

        server.stop()
        server_thread.join(3)
        assert not server_thread.is_alive(), "server event loop did not stop"
        assert len(finalized) == 2, "stop() retained callback closure objects"
        # stop() should also be idempotent with retained handles.
        server.stop()
        if lifecycle != "stop":
            del server
            gc.collect()

        for ref in refs:
            assert ref.path() == "", "stopped handle retained a native stream"
            for send, message in (
                (ref.send_text, "after shutdown"),
                (ref.send_binary, b"after shutdown"),
                (ref.send_metadata, b"after shutdown"),
            ):
                try:
                    send(message)
                except RuntimeError as exc:
                    assert "closed" in str(exc), str(exc)
                else:
                    raise AssertionError("send on stopped handle succeeded")
            assert ref.close() == 0
            assert ref.close() == 0
        # Isolated Python callback cycles on retained stopped handles are also
        # collectable, even when nobody calls a callback-detachment method.
        del send  # The previous loop's bound method retains its Python handle.
        for ref in refs:
            ref.set_on_message(lambda *args, handle=ref, marker=Marker(): None)
        del ref
        refs.clear()
        gc.collect()
        assert len(finalized) == 4, "handler callback cycle was not collected"
    finally:
        if "server" in locals():
            server.stop()
        server_thread.join(3)
        for client in clients:
            client.stop()
        for thread in client_threads:
            thread.join(3)
            assert not thread.is_alive(), "client event loop did not stop"


class TestServerHandlerLifetime(unittest.TestCase):
    def test_retained_handles(self):
        from web_stream import web_stream_ext

        extension_dir = str(Path(web_stream_ext.__file__).resolve().parent)
        for transport in ("plain", "tls"):
            for lifecycle in ("stop", "destroy", "gc"):
                with self.subTest(transport=transport, lifecycle=lifecycle):
                    result = subprocess.run(
                        [sys.executable, str(Path(__file__).resolve()),
                         "--probe", extension_dir, transport, lifecycle],
                        capture_output=True, text=True, timeout=15,
                    )
                    self.assertEqual(
                        result.returncode, 0,
                        f"child exited {result.returncode}\n"
                        f"{result.stdout}\n{result.stderr}",
                    )


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--probe":
        probe(*sys.argv[2:])
    else:
        unittest.main()
