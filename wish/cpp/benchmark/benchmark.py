import argparse
import shlex
import subprocess
import time
import os
import signal

BUILD_DIR = "./build"
CERTS_DIR = "./certs"

TLS_SERVER_BINARY_NAME = "examples/tls_echo_server"
TLS_CLIENT_BINARY_NAME = "benchmark/tls_benchmark_client"

PLAIN_SERVER_BINARY_NAME = "examples/echo_server"
PLAIN_CLIENT_BINARY_NAME = "benchmark/benchmark_client"
HIGH_QPS_CLIENT_BINARY_NAME = "benchmark/high_qps_benchmark_client"


def _client_host_from_remote_target(remote_host):
    if "@" in remote_host:
        return remote_host.split("@", 1)[1]
    return remote_host


def _start_server(remote_host, server_binary_path, server_binary_name, certs_dir=None):
    if not remote_host:
        return subprocess.Popen([server_binary_path])

    remote_binary_path = f"/tmp/{os.path.basename(server_binary_name)}"

    subprocess.run(
        ["ssh", remote_host, f"rm -f {shlex.quote(remote_binary_path)}"],
        check=True,
    )
    subprocess.run(
        ["scp", server_binary_path, f"{remote_host}:{remote_binary_path}"],
        check=True,
    )

    if certs_dir:
        remote_certs_dir = "/tmp/certs"
        subprocess.run(
            ["ssh", remote_host, f"rm -rf {shlex.quote(remote_certs_dir)}"],
            check=True,
        )
        subprocess.run(
            ["scp", "-r", certs_dir, f"{remote_host}:{remote_certs_dir}"],
            check=True,
        )

    remote_command = (
        f"chmod +x {shlex.quote(remote_binary_path)} && "
        f"cd /tmp && {shlex.quote(remote_binary_path)}"
    )

    # Pass the `-t` option multiple times to ensure a pseudo-terminal is allocated, so that we can send a SIGTERM signal to the remote process, not the `ssh` process itself. This allows us to properly terminate the remote server when the benchmark is done.
    return subprocess.Popen(["ssh", "-tt", remote_host, remote_command], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)


def run_benchmark(remote_host=None, tls=True, high_qps=False):
    # The high-QPS client is plain only (no TLS variant).
    if high_qps:
        server_binary_name = PLAIN_SERVER_BINARY_NAME
        client_binary_name = HIGH_QPS_CLIENT_BINARY_NAME
    else:
        server_binary_name = TLS_SERVER_BINARY_NAME if tls else PLAIN_SERVER_BINARY_NAME
        client_binary_name = TLS_CLIENT_BINARY_NAME if tls else PLAIN_CLIENT_BINARY_NAME
    server_binary_path = os.path.join(BUILD_DIR, server_binary_name)
    client_binary_path = os.path.join(BUILD_DIR, client_binary_name)

    if high_qps:
        print("Running high-QPS benchmark (plain) ...")
    else:
        print(f"Running {'TLS' if tls else 'plain'} benchmark ...")

    client_host = "127.0.0.1"
    if remote_host:
        client_host = _client_host_from_remote_target(remote_host)
        print(f"Starting remote server via SSH on {remote_host} ...")
    else:
        print("Starting local server ...")

    server_process = _start_server(remote_host, server_binary_path, server_binary_name, certs_dir=CERTS_DIR if (tls and not high_qps) else None)
    time.sleep(2)  # wait for server to start

    if server_process.poll() is not None:
        raise RuntimeError(f"{server_binary_name} failed to start")

    # The high-QPS client uses Iterations() to control measurement time, so
    # --benchmark_min_time must be omitted to avoid conflicting with it.
    client_cmd = [
        client_binary_path,
        "--stderrthreshold=0",
        "--benchmark_counters_tabular=true",
        f"--host={client_host}",
    ]
    if not high_qps:
        client_cmd.append("--benchmark_min_time=5.0s")

    try:
        subprocess.run(client_cmd, capture_output=False, text=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running client: {e}")
    except Exception as e:
        print(f"Failed to start/run client: {e}")
    finally:
        if server_process.poll() is None:
            server_process.terminate()
            server_process.wait()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run benchmark")
    parser.add_argument(
        "--remote-host",
        help="SSH target for remote server, e.g. user@10.0.0.5",
    )
    parser.add_argument(
        "--tls",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Use TLS (default: enabled). Pass --no-tls for plain HTTP. Ignored when --high-qps is set.",
    )
    parser.add_argument(
        "--high-qps",
        action="store_true",
        default=False,
        help="Run the high-QPS (target-QPS) benchmark instead of the default latency sweep. Always uses the plain server.",
    )
    args = parser.parse_args()

    if args.high_qps:
        server_binary_name = PLAIN_SERVER_BINARY_NAME
        client_binary_name = HIGH_QPS_CLIENT_BINARY_NAME
    else:
        server_binary_name = TLS_SERVER_BINARY_NAME if args.tls else PLAIN_SERVER_BINARY_NAME
        client_binary_name = TLS_CLIENT_BINARY_NAME if args.tls else PLAIN_CLIENT_BINARY_NAME
    server_binary_path = os.path.join(BUILD_DIR, server_binary_name)
    client_binary_path = os.path.join(BUILD_DIR, client_binary_name)

    if not os.path.isdir(BUILD_DIR):
        print("Error: 'build' directory not found. Please compile the project first.")
        exit(1)

    if not os.path.isfile(server_binary_path):
        print(f"Error: '{server_binary_path}' not found. Please compile the project first.")
        exit(1)

    if not os.path.isfile(client_binary_path):
        print(f"Error: '{client_binary_path}' not found. Please compile the project first.")
        exit(1)

    print("Starting benchmarks...")
    run_benchmark(remote_host=args.remote_host, tls=args.tls, high_qps=args.high_qps)
