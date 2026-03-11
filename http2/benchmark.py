import subprocess
import time
import os

def run_benchmark():
    print(f"Running HTTP/2 without TLS benchmark ...")

    server_process = subprocess.Popen(["./build/h2_echo_server"])
    time.sleep(1) # wait for server to start

    try:
        subprocess.run([
            "./build/h2_bench_client", 
            "--stderrthreshold=0",
            "--benchmark_counters_tabular=true",
        ], capture_output=False, text=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running HTTP/2 client:\n{e.output}")
    except Exception as e:
        print(f"Failed to start/run HTTP/2 client: {e}")
    finally:
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    if not os.path.isdir("build"):
        print("Error: 'build' directory not found. Please compile the project first.")
        exit(1)
    
    print("Starting benchmarks...")
    run_benchmark()
