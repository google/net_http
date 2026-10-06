#!/bin/bash
set -u

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 DEVICE_ID OUTPUT_DIR [PAIRS]" >&2
  exit 2
fi

device_id=$1
output_dir=$2
pairs=${3:-10}
demo_dir=$(cd "$(dirname "$0")/../../objc/demo/WebChanneliOSDemo" && pwd)
runner_dir=$(cd "$(dirname "$0")" && pwd)
derived_data=${LENS_DERIVED_DATA:-/tmp/net-http-cold-build}
binary_encoding=${LENS_BINARY_ENCODING:-0}
initial_message_delay_ms=${LENS_INITIAL_MESSAGE_DELAY_MS:-0}
scenarios=${LENS_SCENARIOS:-"Omnient Viewfinder"}
resume=${LENS_RESUME:-0}
trial_timeout_seconds=${LENS_TRIAL_TIMEOUT_SECONDS:-180}
case "$trial_timeout_seconds" in
  ''|*[!0-9]*|0) echo "LENS_TRIAL_TIMEOUT_SECONDS must be a positive integer" >&2; exit 2 ;;
esac
case "$resume" in
  0|1) ;;
  *) echo "LENS_RESUME must be 0 or 1" >&2; exit 2 ;;
esac
case "$pairs" in
  ''|*[!0-9]*|0) echo "PAIRS must be a positive integer" >&2; exit 2 ;;
esac
for scenario in $scenarios; do
  case "$scenario" in
    Omnient|Viewfinder) ;;
    *) echo "LENS_SCENARIOS must contain Omnient and/or Viewfinder" >&2; exit 2 ;;
  esac
done
if [ -z "$scenarios" ]; then
  echo "LENS_SCENARIOS must not be empty" >&2; exit 2
fi
case "$initial_message_delay_ms" in
  ''|*[!0-9]*) echo "LENS_INITIAL_MESSAGE_DELAY_MS must be a nonnegative integer" >&2; exit 2 ;;
esac
case "$binary_encoding" in
  0) test_prefix=testCold ;;
  1) test_prefix=testColdBinary ;;
  *) echo "LENS_BINARY_ENCODING must be 0 or 1" >&2; exit 2 ;;
esac
mkdir -p "$output_dir/logs" "$output_dir/xcresults" "$output_dir/attachments"
trial_pid=
stop_trial() {
  trap - INT TERM
  if [ -n "$trial_pid" ]; then
    kill -TERM "$trial_pid" 2>/dev/null || true
    wait "$trial_pid" 2>/dev/null || true
  fi
  exit 130
}
trap stop_trial INT TERM

for scenario in $scenarios; do
  case "$scenario" in
    Omnient) scenario_slug=omnient ;;
    Viewfinder) scenario_slug=viewfinder ;;
  esac
  for pair in $(seq 1 "$pairs"); do
    for setting in Off On; do
      case "$setting" in
        Off) setting_slug=off ;;
        On) setting_slug=on ;;
      esac
      trial="$scenario_slug-$pair-$setting_slug"
      result="$output_dir/xcresults/$trial.xcresult"
      log="$output_dir/logs/$trial.log"
      export_dir="$output_dir/attachments/$trial-attachments"
      if [ "$resume" = 1 ] && [ -f "$log" ] && [ -d "$export_dir" ] \
        && rg -q 'LENS_BENCHMARK_RESULT' "$log" \
        && find "$export_dir" -name '*.json' ! -name manifest.json | rg -q .; then
        echo "Keeping recorded trial $trial"
        continue
      fi
      if [ -e "$result" ] || [ -e "$log" ]; then
        echo "Refusing to overwrite existing trial $trial" >&2
        exit 2
      fi
      echo "Running $trial"
      TEST_RUNNER_LENS_INITIAL_MESSAGE_DELAY_MS="$initial_message_delay_ms" \
        python3 "$runner_dir/run-bounded-command.py" "$trial_timeout_seconds" xcodebuild test-without-building \
        -workspace "$demo_dir/WebChanneliOSDemo.xcworkspace" \
        -scheme WebChanneliOSDemo -configuration Debug \
        -destination "id=$device_id" -derivedDataPath "$derived_data" \
        -parallel-testing-enabled NO \
        -only-testing:"WebChanneliOSDemoTests/LensBenchmarkTests/${test_prefix}${scenario}${setting}" \
        -resultBundlePath "$result" > "$log" 2>&1 &
      trial_pid=$!
      if wait "$trial_pid"; then
        echo "PASS $trial"
      else
        echo "FAIL $trial (see $log)" >&2
      fi
      trial_pid=
      if rg -q 'Developer App Certificate is not trusted|Failed to install or launch the test runner' "$log"; then
        echo "Stopping: device could not launch the test runner (see $log)" >&2
        exit 1
      fi
      xcrun xcresulttool export attachments --path "$result" --output-path "$export_dir" \
        > "$output_dir/logs/$trial-export.log" 2>&1 || {
          echo "Stopping: attachment export failed for $trial" >&2
          exit 1
        }
      if ! rg -q 'LENS_BENCHMARK_RESULT' "$log"; then
        echo "Stopping: trial produced no benchmark result (see $log)" >&2
        exit 1
      fi
    done
  done
done
