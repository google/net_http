"""Native callbacks may send/close; stopping cancels cross-thread operations.

Subprocess timeouts keep a dispatcher deadlock from hanging the test runner.
These tests use native Python servers rather than C++ example executables.
"""

import importlib
from pathlib import Path
import socket
import subprocess
import sys
import threading
import time
import unittest


CERTS_DIR = Path(__file__).resolve().parents[3] / "cpp" / "certs"


def probe(extension_dir, transport, scenario):
    sys.path.insert(0, extension_dir)
    ext = importlib.import_module("web_stream_ext")
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]

    if transport == "tls":
        server = ext.TlsServer(
            str(CERTS_DIR / "ca.crt"), str(CERTS_DIR / "server.crt"),
            str(CERTS_DIR / "server.key"), port,
        )
        client = ext.TlsClient(
            str(CERTS_DIR / "ca.crt"), str(CERTS_DIR / "client.crt"),
            str(CERTS_DIR / "client.key"), "127.0.0.1", port,
        )
    else:
        server = ext.PlainServer(port)
        client = ext.PlainClient("127.0.0.1", port)

    unraisable = []
    sys.unraisablehook = unraisable.append
    entered = threading.Event()
    release = threading.Event()
    done = threading.Event()
    handles = {}
    received = []
    operations = []
    outcomes = []

    def start_waiters(handle):
        # The owning callback stays paused while all four operations wait for
        # the loop. stop() must unblock them before that callback can return.
        started = [threading.Event() for _ in range(4)]

        def operate(index, method, args):
            started[index].set()
            try:
                method(*args)
            except RuntimeError as exc:
                outcomes.append(str(exc))
            else:
                outcomes.append("unexpected success")

        for i, (method, args) in enumerate((
            (handle.send_text, ("queued",)),
            (handle.send_binary, (b"queued",)),
            (handle.send_metadata, (b"queued",)),
            (handle.close, ()),
        )):
            thread = threading.Thread(target=operate, args=(i, method, args), daemon=True)
            operations.append(thread)
            thread.start()
        assert all(event.wait(1) for event in started)
        time.sleep(0.05)
        assert all(thread.is_alive() for thread in operations), "operation did not wait"

    def assert_cancelled():
        for thread in operations:
            thread.join(1)
            assert not thread.is_alive(), "stop() left an operation waiting"
        assert len(outcomes) == 4, outcomes
        assert all("stopped" in result for result in outcomes), outcomes

    def on_stream(handle):
        handles["server"] = handle
        if scenario == "stop_server":
            entered.set()
            assert release.wait(5), "test did not release server callback"
            return

        def echo(opcode, message):
            method = {1: handle.send_text, 2: handle.send_binary, 3: handle.send_metadata}[opcode]
            assert method(message.decode() if opcode in (1, 2) else message) == 0
            if opcode == 3:
                assert handle.close() == 0

        handle.set_on_message(echo)
        if scenario == "echo":
            assert handle.send_metadata("ready\x00metadata") == 0

    def on_open(handle):
        handles["client"] = handle
        if scenario == "echo":
            assert handle.send_text("open") == 0
        elif scenario == "stop_in_callback":
            start_waiters(handle)
            client.stop()
            assert_cancelled()
            done.set()
        elif scenario == "stop_client":
            entered.set()
            assert release.wait(5), "test did not release client callback"

    def on_message(opcode, message):
        received.append((opcode, message))
        handle = handles["client"]
        if (opcode, message) == (1, b"open"):
            assert handle.send_binary(b"binary\x00payload") == 0
        elif opcode == 2:
            assert handle.send_metadata(b"metadata") == 0
        elif (opcode, message) == (3, b"metadata"):
            assert handle.close() == 0
            done.set()

    server.set_on_stream(on_stream)
    client.set_on_open(on_open)
    client.set_on_message(on_message)
    server.init()
    client.init()
    threads = [threading.Thread(target=obj.run, daemon=True) for obj in (server, client)]
    try:
        for thread in threads:
            thread.start()
        if scenario.startswith("stop_") and scenario != "stop_in_callback":
            assert entered.wait(3), "owning callback did not run"
            side = scenario[len("stop_"):]
            start_waiters(handles[side])
            (server if side == "server" else client).stop()
            assert_cancelled()
            release.set()
        else:
            assert done.wait(3), f"callback operation did not finish: {unraisable}"
        if scenario == "echo":
            assert received == [(3, b"ready\x00metadata"), (1, b"open"),
                                (2, b"binary\x00payload"), (3, b"metadata")], received
        assert not unraisable, [info.exc_value for info in unraisable]
    finally:
        release.set()
        client.stop()
        server.stop()
        for thread in threads + operations:
            thread.join(3)
            assert not thread.is_alive(), "background thread did not exit"


class TestCallbackDispatch(unittest.TestCase):
    def test_callbacks_and_shutdown(self):
        from web_stream import web_stream_ext

        extension_dir = str(Path(web_stream_ext.__file__).resolve().parent)
        for transport in ("plain", "tls"):
            for scenario in ("echo", "stop_client", "stop_server", "stop_in_callback"):
                with self.subTest(transport=transport, scenario=scenario):
                    result = subprocess.run(
                        [sys.executable, str(Path(__file__).resolve()), "--probe",
                         extension_dir, transport, scenario],
                        capture_output=True, text=True, timeout=15,
                    )
                    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--probe":
        probe(*sys.argv[2:])
    else:
        unittest.main()
