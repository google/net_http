"""Public connection lifecycle and concurrency exceptions."""


class WebStreamError(ConnectionError):
    """Native failure with a stable operation/stage code and diagnostic detail."""

    def __init__(self, code, detail):
        self.code = code
        self.detail = detail
        super().__init__(code, detail)

    def __str__(self):
        return f"{self.code}: {self.detail}"


class ConnectionClosed(ConnectionError):
    """The stream has terminated in the requested direction."""


class ConnectionClosedOK(ConnectionClosed, ConnectionAbortedError):
    """The stream reached a clean EOF or was closed locally."""


class ConnectionClosedError(ConnectionClosed, WebStreamError):
    """The stream ended because of a transport or protocol failure."""


class ConcurrencyError(RuntimeError):
    """Another coroutine is already receiving from this connection."""
