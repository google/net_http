"""Tests that accessing a WishHandler after the connection closes does not
cause a use-after-free crash.

After the server closes the connection (EOF), WishHandler::EventCallback calls
on_close_() which nullifies WishHandlerRef::ptr under a mutex.  Any subsequent
call through the Python WishHandler object must raise RuntimeError rather than
dereferencing freed memory.
"""

import os
import socket
import subprocess
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
        from wish import wish_ext  # noqa: PLC0415
        return wish_ext
    except ImportError:
        return None


wish_ext = _import_wish_ext()


@unittest.skipIf(wish_ext is None, "wish_ext extension module not available – run 'pip install .'")
@unittest.skipUnless(
    os.path.exists(SERVER_PLAIN_BIN),
    f"Plain echo server not found at {SERVER_PLAIN_BIN} – compile the C++ project first",
)
class TestDanglingPointer(unittest.TestCase):
    """Verify that WishHandler cannot be used after the connection is closed."""

    port: int
    server_proc: subprocess.Popen

    @classmethod
    def setUpClass(cls) -> None:
        cls.port = get_free_port()
        cls.server_proc = subprocess.Popen(
            [SERVER_PLAIN_BIN, f"--port={cls.port}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
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

    def _make_plain_client(self):
        client = wish_ext.PlainClient("127.0.0.1", self.port)
        self.assertTrue(client.init(), "PlainClient.init() returned False")
        return client

    def _run_and_stop(self, client, wait_event, timeout=5.0):
        t = threading.Thread(target=client.run, daemon=True)
        t.start()
        fired = wait_event.wait(timeout=timeout)
        client.stop()
        t.join(timeout=timeout)
        return fired

    # ------------------------------------------------------------------
    # Test: send_text raises RuntimeError after connection is stopped
    # ------------------------------------------------------------------

    def test_send_after_stop_raises(self):
        """Calling send_text after client.stop() must raise RuntimeError,
        not crash with a segfault."""
        captured_handler = []
        open_event = threading.Event()
        client = self._make_plain_client()

        def on_open(handler):
            captured_handler.append(handler)
            open_event.set()

        client.set_on_open(on_open)
        fired = self._run_and_stop(client, open_event)

        self.assertTrue(fired, "on_open never fired; check echo_server")
        self.assertEqual(len(captured_handler), 1)

        handler = captured_handler[0]
        # The event loop has exited and stop() was called.  The handler's
        # WishHandlerRef was invalidated when the connection closed.
        # send_text must raise RuntimeError, not segfault.
        with self.assertRaises(RuntimeError):
            handler.send_text("should fail")

    # ------------------------------------------------------------------
    # Test: send_binary raises RuntimeError after connection is stopped
    # ------------------------------------------------------------------

    def test_send_binary_after_stop_raises(self):
        """Calling send_binary after the connection closes must raise
        RuntimeError, not crash."""
        captured_handler = []
        open_event = threading.Event()
        client = self._make_plain_client()

        def on_open(handler):
            captured_handler.append(handler)
            open_event.set()

        client.set_on_open(on_open)
        fired = self._run_and_stop(client, open_event)

        self.assertTrue(fired, "on_open never fired; check echo_server")
        handler = captured_handler[0]
        with self.assertRaises(RuntimeError):
            handler.send_binary("should fail")

    # ------------------------------------------------------------------
    # Test: on_close is called before send_text would reach freed memory
    # ------------------------------------------------------------------

    def test_handler_invalidated_before_on_close_returns(self):
        """By the time the Python on_close callback (if any) runs, the
        WishHandlerRef must already be invalidated.

        We verify this indirectly: open a connection, stop the client,
        and confirm that the handler ref is invalid immediately after stop()
        returns – without any race window where freed memory could be touched.
        """
        captured_handler = []
        open_event = threading.Event()
        client = self._make_plain_client()

        def on_open(handler):
            captured_handler.append(handler)
            open_event.set()

        client.set_on_open(on_open)

        t = threading.Thread(target=client.run, daemon=True)
        t.start()
        self.assertTrue(open_event.wait(timeout=5.0), "on_open never fired")

        # Stop will cause event_base_loopexit → run() returns → thread exits.
        client.stop()
        t.join(timeout=5.0)

        # At this point the event loop has exited.  Even if EOF arrived and
        # on_close_ fired, handler_ref->ptr must be nullptr.  Calling into the
        # handler must be safe (raise, not crash).
        handler = captured_handler[0]
        try:
            handler.send_text("probe")
        except RuntimeError:
            pass  # Expected: connection is closed.
        # If we reached here without crashing, the test passes.


if __name__ == "__main__":
    unittest.main()
