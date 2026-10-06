#!/bin/bash
set -eu

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 DEVICE_ID OUTPUT_DIR [PAIRS]" >&2
  exit 2
fi
device_id=$1
output_dir=$2
pairs=${3:-50}
runner_dir=$(cd "$(dirname "$0")" && pwd)
runner_pid=
stop_sweep() {
  trap - INT TERM
  if [ -n "$runner_pid" ]; then
    kill -TERM "$runner_pid" 2>/dev/null || true
    wait "$runner_pid" 2>/dev/null || true
  fi
  exit 130
}
trap stop_sweep INT TERM

mkdir -p "$output_dir/logs"
for delay_ms in 0 50 100 200; do
  echo "Starting M1 delay ${delay_ms} ms: ${pairs} Omnient OFF/ON pairs"
  LENS_SCENARIOS=Omnient LENS_BINARY_ENCODING=1 LENS_INITIAL_MESSAGE_DELAY_MS=$delay_ms \
    bash "$runner_dir/run-cold-benchmark.sh" "$device_id" "$output_dir/delay-${delay_ms}ms" "$pairs" &
  runner_pid=$!
  wait "$runner_pid"
  runner_pid=
done
