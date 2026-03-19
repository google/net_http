import argparse
import shlex
import subprocess
import time
import os
import signal

BUILD_DIR = "./build"
SERVER_BINARY_NAME = "examples/echo_server"
CLIENT_BINARY_NAME = "benchmark/benchmark_client"
SERVER_BINARY_PATH = os.path.join(BUILD_DIR, SERVER_BINARY_NAME)
CLIENT_BINARY_PATH = os.path.join(BUILD_DIR, CLIENT_BINARY_NAME)


def _client_host_from_remote_target(remote_host):
    if "@" in remote_host:
        return remote_host.split("@", 1)[1]
    return remote_host


def _start_server(remote_host):
    if not remote_host:
        return subprocess.Popen([SERVER_BINARY_PATH])

    remote_binary_path = f"/tmp/{SERVER_BINARY_NAME}"

    subprocess.run(
        ["ssh", remote_host, f"rm -f {shlex.quote(remote_binary_path)}"],
        check=True,
    )
    subprocess.run(
        ["scp", SERVER_BINARY_PATH, f"{remote_host}:{remote_binary_path}"],
        check=True,
    )

    remote_command = (
        f"chmod +x {shlex.quote(remote_binary_path)} && "
        f"{shlex.quote(remote_binary_path)}"
    )

    # Pass the `-t` option multiple times to ensure a pseudo-terminal is allocated, so that we can send a SIGTERM signal to the remote process, not the `ssh` process itself. This allows us to properly terminate the remote server when the benchmark is done.
    return subprocess.Popen(["ssh", "-tt", remote_host, remote_command], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)


def run_benchmark(remote_host=None):
    print("Running benchmark ...")

    client_host = "127.0.0.1"
    if remote_host:
        client_host = _client_host_from_remote_target(remote_host)
        print(f"Starting remote server via SSH on {remote_host} ...")
    else:
        print("Starting local server ...")

    server_process = _start_server(remote_host)
    time.sleep(2)  # wait for server to start

    if server_process.poll() is not None:
        raise RuntimeError(f"{SERVER_BINARY_NAME} failed to start")

    try:
        subprocess.run([
            CLIENT_BINARY_PATH,
            "--stderrthreshold=0",
            "--benchmark_counters_tabular=true",
            "--benchmark_min_time=5.0s",
            f"--host={client_host}",
        ], capture_output=False, text=True, check=True)
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
    args = parser.parse_args()

    if not os.path.isdir(BUILD_DIR):
        print("Error: 'build' directory not found. Please compile the project first.")
        exit(1)

    if not os.path.isfile(SERVER_BINARY_PATH):
        print(f"Error: '{SERVER_BINARY_PATH}' not found. Please compile the project first.")
        exit(1)

    if not os.path.isfile(CLIENT_BINARY_PATH):
        print(f"Error: '{CLIENT_BINARY_PATH}' not found. Please compile the project first.")
        exit(1)
    
    print("Starting benchmarks...")
    run_benchmark(remote_host=args.remote_host)
