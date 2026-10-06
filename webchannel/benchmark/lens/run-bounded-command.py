#!/usr/bin/env python3
"""Bound a trial's install/launch time and forward cancellation to its process group."""

import os
import signal
import subprocess
import sys


def main():
    timeout = int(sys.argv[1])
    if timeout <= 0:
        raise ValueError("trial timeout must be positive")
    child = subprocess.Popen(sys.argv[2:], start_new_session=True)

    def terminate():
        if child.poll() is None:
            os.killpg(child.pid, signal.SIGTERM)
            try:
                child.wait(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(child.pid, signal.SIGKILL)
                child.wait()

    def cancelled(signum, _frame):
        terminate()
        raise SystemExit(128 + signum)

    signal.signal(signal.SIGINT, cancelled)
    signal.signal(signal.SIGTERM, cancelled)
    try:
        result = child.wait(timeout=timeout)
        return result if result >= 0 else 128 - result
    except subprocess.TimeoutExpired:
        print(f"Trial command exceeded {timeout} seconds; terminating install/launch/test.", file=sys.stderr)
        terminate()
        return 124


if __name__ == "__main__":
    raise SystemExit(main())
