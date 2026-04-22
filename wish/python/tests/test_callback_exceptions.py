"""Tests that Python exceptions raised inside wish_ext callbacks do not
propagate through the C libevent stack and crash the process.

Each callback lambda in wish_ext.cc wraps the Python call in
try/catch(nb::python_error) and routes the exception through
PyErr_WriteUnraisable, which invokes sys.unraisablehook.  These tests
install a temporary hook to capture that notification and assert on it.
"""

import os
import socket
import subprocess
import sys
import threading
import time
import unittest

TEST_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(TEST_DIR, "..", ".."))
SERVER_PLAIN_BIN = os.path.join(
    PROJECT_ROOT, "cpp", "build", "examples", "echo_server"
)


def get_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _import_wish_ext():
    try:
        from wish import wish_ext
        return wish_ext
    except ImportError:
        return None


wish_ext = _import_wish_ext()


@unittest.skipIf(wish_ext is None, "wish_ext extension module not available - run 'pip install .'")
@unittest.skipUnless(
    os.path.exists(SERVER_PLAIN_BIN),
    f"Plain echo server not found at {SERVER_PLAIN_BIN} - compile the C++ project first",
)
class TestCallbackExceptions(unittest.TestCase):
    """Verify that exceptions thrown from Python callbacks are swallowed at
    the C++ boundary and reported via sys.unraisablehook, not re-raised."""

    port: int
    server_proc: subprocess.Popen

    # ------------------------------------------------------------------
    # Test fixture – one echo server shared across test methods
    # ------------------------------------------------------------------

    @classmethod
    def setUpClass(cls) -> None:
        cls.port = get_free_port()
        cls.server_proc = subprocess.Popen(
            [SERVER_PLAIN_BIN, f"--port={cls.port}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        # Wait for the server to start accepting connections.
        time.sleep(0.5)

    @classmethod
    def tearDownClass(cls) -> None:
        if hasattr(cls, "server_proc"):
            cls.server_proc.terminate()
            try:
                cls.server_proc.wait(timeout=2)
            except subprocess.TimeoutExpired:
                cls.server_proc.kill()

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _capture_unraisable(self):
        """Return (captured_list, restore_fn).

        Install a sys.unraisablehook that appends UnraisableHookArgs to
        *captured_list*.  Call restore_fn() in a finally block.
        """
        captured = []
        original = sys.unraisablehook

        def hook(info):
            captured.append(info)

        sys.unraisablehook = hook
        return captured, lambda: setattr(sys, "unraisablehook", original)

    def _make_plain_client(self):
        client = wish_ext.PlainClient("127.0.0.1", self.port)
        self.assertTrue(client.init(), "PlainClient.init() returned False")
        return client

    def _run_and_stop(self, client, wait_event, timeout=5.0):
        """Run *client* in a daemon thread; stop it once *wait_event* is set."""
        t = threading.Thread(target=client.run, daemon=True)
        t.start()
        fired = wait_event.wait(timeout=timeout)
        client.stop()
        t.join(timeout=timeout)
        return fired

    # ------------------------------------------------------------------
    # Test: on_open raises
    # ------------------------------------------------------------------

    def test_on_open_exception_does_not_crash(self):
        """ValueError raised in set_on_open callback must not crash the process."""
        captured, restore = self._capture_unraisable()
        try:
            done = threading.Event()
            client = self._make_plain_client()

            def on_open(handler):
                done.set()
                raise ValueError("deliberate on_open exception")

            client.set_on_open(on_open)
            fired = self._run_and_stop(client, done)
        finally:
            restore()

        self.assertTrue(fired, "on_open callback never fired; check echo_server")
        # The process survived reaching this point ─ that is the primary assertion.
        self.assertEqual(len(captured), 1, "Expected exactly one unraisable exception")
        exc = captured[0].exc_value
        self.assertIsInstance(exc, ValueError)
        self.assertEqual(str(exc), "deliberate on_open exception")

    # ------------------------------------------------------------------
    # Test: on_message raises
    # ------------------------------------------------------------------

    def test_on_message_exception_does_not_crash(self):
        """ValueError raised in set_on_message callback must not crash the process."""
        captured, restore = self._capture_unraisable()
        try:
            done = threading.Event()
            client = self._make_plain_client()

            def on_open(handler):
                # Trigger an echo so that on_message fires.
                handler.send_text("ping")

            def on_message(opcode, msg):
                done.set()
                raise ValueError("deliberate on_message exception")

            client.set_on_open(on_open)
            client.set_on_message(on_message)
            fired = self._run_and_stop(client, done)
        finally:
            restore()

        self.assertTrue(fired, "on_message callback never fired; check echo_server")
        self.assertEqual(len(captured), 1, "Expected exactly one unraisable exception")
        exc = captured[0].exc_value
        self.assertIsInstance(exc, ValueError)
        self.assertEqual(str(exc), "deliberate on_message exception")

    # ------------------------------------------------------------------
    # Test: exception type is preserved
    # ------------------------------------------------------------------

    def test_on_open_exception_type_is_preserved(self):
        """The exact exception type (not just ValueError) is forwarded to the hook."""
        captured, restore = self._capture_unraisable()
        try:
            done = threading.Event()
            client = self._make_plain_client()

            class CustomError(RuntimeError):
                pass

            def on_open(handler):
                done.set()
                raise CustomError("custom type check")

            client.set_on_open(on_open)
            fired = self._run_and_stop(client, done)
        finally:
            restore()

        self.assertTrue(fired)
        self.assertEqual(len(captured), 1)
        self.assertIsInstance(captured[0].exc_value, CustomError)
        self.assertEqual(str(captured[0].exc_value), "custom type check")


if __name__ == "__main__":
    unittest.main()
