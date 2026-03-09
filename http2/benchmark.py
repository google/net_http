import subprocess
import time
import os

TOTAL_DATA_BYTES = 128 * 1024 * 1024

PAYLOAD_SIZES = {
    "1KiB": 1024,
    "128KiB": 131072,
    "1MiB": 1048576,
}

def run_benchmark():
    with open("results.txt", "w") as f:
        for name, size in PAYLOAD_SIZES.items():
            num_requests = TOTAL_DATA_BYTES // size
            f.write(f"=== Benchmark for {name} payload ({size} bytes), {num_requests} requests ===\n\n")

            f.write("--- Raw HTTP/2 ---\n")
            print(f"Running Raw HTTP/2 bench for {name}...")
            server_process = subprocess.Popen(["./build/h2_echo_server"])
            time.sleep(1) # wait for server to start
            try:
                client_output = subprocess.check_output([
                    "./build/h2_bench_client", 
                    f"--payload_size={size}",
                    f"--num_requests={num_requests}",
                    "--stderrthreshold=0",
                ], stderr=subprocess.STDOUT, text=True)
                f.write(client_output)
            except subprocess.CalledProcessError as e:
                f.write(f"Error running raw HTTP/2 client:\n{e.output}\n")
            except Exception as e:
                f.write(f"Failed to start/run HTTP/2 client: {e}\n")
            finally:
                server_process.terminate()
                server_process.wait()

            f.write("\n\n")

if __name__ == "__main__":
    if not os.path.isdir("build"):
        print("Error: 'build' directory not found. Please compile the project first.")
        exit(1)
    
    print("Starting benchmarks...")
    run_benchmark()
    print("Benchmark complete! Results saved to results.txt.")
