#!/bin/bash
set -eu

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 DEVICE_ID OUTPUT_DIR [PAIRS]" >&2
  exit 2
fi
device_id=$1
output_dir=$2
pairs=${3:-1000}
delays=${LENS_DELAYS_MS:-"0 50 100 150 200"}
for delay_ms in $delays; do
  case "$delay_ms" in
    ''|*[!0-9]*) echo "LENS_DELAYS_MS must contain nonnegative integers" >&2; exit 2 ;;
  esac
done
if [ -z "$delays" ]; then
  echo "LENS_DELAYS_MS must not be empty" >&2
  exit 2
fi
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
python3 "$runner_dir/record-sweep-timing.py" "$output_dir" start
for delay_ms in $delays; do
  echo "Starting M1 delay ${delay_ms} ms: ${pairs} Omnient OFF/ON pairs"
  python3 "$runner_dir/record-sweep-timing.py" "$output_dir" delay-start "$delay_ms"
  LENS_SCENARIOS=Omnient LENS_BINARY_ENCODING=1 LENS_INITIAL_MESSAGE_DELAY_MS=$delay_ms \
    bash "$runner_dir/run-cold-benchmark.sh" "$device_id" "$output_dir/delay-${delay_ms}ms" "$pairs" &
  runner_pid=$!
  wait "$runner_pid"
  runner_pid=
  python3 "$runner_dir/record-sweep-timing.py" "$output_dir" delay-end "$delay_ms"
done
python3 "$runner_dir/record-sweep-timing.py" "$output_dir" end
