"""Missing build artifacts or selected-suite dependencies must fail tests."""

from pathlib import Path
import subprocess
import sys
import textwrap
import unittest

from web_stream import web_stream_ext


PYTHON_ROOT = Path(__file__).resolve().parents[2]


class TestPrerequisites(unittest.TestCase):
    def probe(self, body, *, load_extension=True):
        bootstrap = (
            "import importlib.util, os, sys, unittest\n"
            f"sys.path.insert(0, {str(PYTHON_ROOT)!r})\n"
        )
        if load_extension:
            bootstrap += (
                "spec = importlib.util.spec_from_file_location(\n"
                f"    'web_stream_ext', {str(web_stream_ext.__file__)!r})\n"
                "extension = importlib.util.module_from_spec(spec)\n"
                "spec.loader.exec_module(extension)\n"
                "sys.modules['web_stream.web_stream_ext'] = extension\n"
            )
        return subprocess.run(
            [sys.executable, "-c", bootstrap + textwrap.dedent(body)],
            capture_output=True, text=True, timeout=10,
        )

    def assert_failed_without_skip(self, result, error):
        self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn(error, result.stderr)
        self.assertNotIn("skipped=", result.stderr)

    def test_missing_plain_echo_fails_direct_discovery(self):
        for name in ("test_callback_exceptions", "test_dangling_pointer",
                     "test_e2e.TestWebStreamClientPlainE2E"):
            with self.subTest(test=name):
                result = self.probe(f"""
                    os.environ['WEB_STREAM_PLAIN_ECHO_SERVER'] = '/missing/plain_echo_server'
                    suite = unittest.defaultTestLoader.loadTestsFromName('tests.core.{name}')
                    result = unittest.TextTestRunner().run(suite)
                    sys.exit(not result.wasSuccessful())
                """)
                self.assert_failed_without_skip(result, "FileNotFoundError")

    def test_missing_tls_echo_fails_direct_discovery(self):
        result = self.probe("""
            os.environ['WEB_STREAM_TLS_ECHO_SERVER'] = '/missing/tls_echo_server'
            suite = unittest.defaultTestLoader.loadTestsFromName(
                'tests.core.test_e2e.TestWebStreamClientE2E')
            result = unittest.TextTestRunner().run(suite)
            sys.exit(not result.wasSuccessful())
        """)
        self.assert_failed_without_skip(result, "FileNotFoundError")

    def test_missing_native_extension_fails_import(self):
        result = self.probe("""
            class MissingNative:
                def find_spec(self, fullname, path=None, target=None):
                    if fullname in ('web_stream_ext', 'web_stream.web_stream_ext'):
                        raise ModuleNotFoundError('Injected missing native extension')
            sys.meta_path.insert(0, MissingNative())
            suite = unittest.defaultTestLoader.loadTestsFromNames([
                'tests.core.test_callback_exceptions', 'tests.core.test_dangling_pointer'])
            result = unittest.TextTestRunner().run(suite)
            sys.exit(not result.wasSuccessful())
        """, load_extension=False)
        self.assert_failed_without_skip(result, "Injected missing native extension")

    def test_missing_openssl_fails_identity_tests(self):
        result = self.probe("""
            from unittest.mock import patch
            suite = unittest.defaultTestLoader.loadTestsFromName('tests.core.test_tls_identity')
            with patch('tests.core.test_tls_identity.shutil.which', return_value=None):
                result = unittest.TextTestRunner().run(suite)
            sys.exit(not result.wasSuccessful())
        """)
        self.assert_failed_without_skip(result, "FileNotFoundError")

    def test_selected_fastapi_suite_requires_its_dependency(self):
        result = self.probe(f"""
            import runpy
            class MissingFastAPI:
                def find_spec(self, fullname, path=None, target=None):
                    if fullname == 'fastapi' or fullname.startswith('fastapi.'):
                        raise ModuleNotFoundError('Injected missing FastAPI dependency')
            sys.meta_path.insert(0, MissingFastAPI())
            sys.argv = ['run_tests.py', '--suite', 'fastapi', '--extension',
                        {str(web_stream_ext.__file__)!r}]
            runpy.run_path({str(PYTHON_ROOT / 'tests/run_tests.py')!r}, run_name='__main__')
        """, load_extension=False)
        self.assert_failed_without_skip(result, "Injected missing FastAPI dependency")
