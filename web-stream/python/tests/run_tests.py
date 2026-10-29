"""Run source-tree tests against the native artifacts selected by CMake."""

import argparse
import importlib.util
import os
from pathlib import Path
import sys
import unittest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--suite", choices=("all", "core", "asgi", "fastapi"), default="all")
    parser.add_argument("--extension", required=True, type=Path)
    parser.add_argument("--plain-echo-server", type=Path)
    parser.add_argument("--tls-echo-server", type=Path)
    args = parser.parse_args()
    groups = ("core", "asgi", "fastapi") if args.suite == "all" else (args.suite,)
    required = [args.extension]
    if "core" in groups:
        if args.plain_echo_server is None or args.tls_echo_server is None:
            parser.error("The core suite requires both echo server paths")
        required.extend((args.plain_echo_server, args.tls_echo_server))
        os.environ["WEB_STREAM_PLAIN_ECHO_SERVER"] = str(args.plain_echo_server.resolve())
        os.environ["WEB_STREAM_TLS_ECHO_SERVER"] = str(args.tls_echo_server.resolve())
    for path in required:
        if not path.is_file():
            parser.error(f"Required test artifact is missing: {path}")

    # Load the selected build without installing it over the user's environment.
    spec = importlib.util.spec_from_file_location("web_stream_ext", args.extension.resolve())
    extension = importlib.util.module_from_spec(spec)
    sys.modules["web_stream_ext"] = extension
    spec.loader.exec_module(extension)
    sys.modules["web_stream.web_stream_ext"] = extension
    test_dir = Path(__file__).resolve().parent
    # The script directory contains tests/fastapi, not the FastAPI dependency.
    # Keep it off sys.path and import test modules as tests.<suite>.<module>.
    sys.path[:] = [path for path in sys.path if Path(path).resolve() != test_dir]
    sys.path.insert(0, str(test_dir.parent))

    suite = unittest.TestSuite()
    for group in groups:
        suite.addTests(unittest.defaultTestLoader.discover(
            str(test_dir / group), top_level_dir=str(test_dir.parent)))
    if suite.countTestCases() == 0:
        parser.error("No tests were discovered for the selected suite")
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    sys.exit(main())
