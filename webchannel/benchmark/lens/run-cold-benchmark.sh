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
derived_data=${LENS_DERIVED_DATA:-/tmp/net-http-cold-build}
binary_encoding=${LENS_BINARY_ENCODING:-0}
initial_message_delay_ms=${LENS_INITIAL_MESSAGE_DELAY_MS:-0}
case "$initial_message_delay_ms" in
  ''|*[!0-9]*) echo "LENS_INITIAL_MESSAGE_DELAY_MS must be a nonnegative integer" >&2; exit 2 ;;
esac
case "$binary_encoding" in
  0) test_prefix=testCold ;;
  1) test_prefix=testColdBinary ;;
  *) echo "LENS_BINARY_ENCODING must be 0 or 1" >&2; exit 2 ;;
esac
mkdir -p "$output_dir/logs" "$output_dir/xcresults" "$output_dir/attachments"

for scenario in Omnient Viewfinder; do
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
      echo "Running $trial"
      if TEST_RUNNER_LENS_INITIAL_MESSAGE_DELAY_MS="$initial_message_delay_ms" xcodebuild test-without-building \
        -workspace "$demo_dir/WebChanneliOSDemo.xcworkspace" \
        -scheme WebChanneliOSDemo -configuration Debug \
        -destination "id=$device_id" -derivedDataPath "$derived_data" \
        -parallel-testing-enabled NO \
        -only-testing:"WebChanneliOSDemoTests/LensBenchmarkTests/${test_prefix}${scenario}${setting}" \
        -resultBundlePath "$result" > "$log" 2>&1; then
        echo "PASS $trial"
      else
        echo "FAIL $trial (see $log)" >&2
      fi
      xcrun xcresulttool export attachments --path "$result" --output-path "$export_dir" \
        > "$output_dir/logs/$trial-export.log" 2>&1 || true
    done
  done
done
