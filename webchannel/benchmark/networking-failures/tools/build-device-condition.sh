#!/bin/bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
xcode_app="${XCODE_APP:-$(xcode-select -p)}"
xcode_app="${xcode_app%/Contents/Developer}"
output="${1:-/private/tmp/net-http-device-condition}"

xcrun --sdk macosx clang -fobjc-arc -Wall -Wextra -framework Foundation \
  "-Wl,-rpath,${xcode_app}/Contents/SharedFrameworks" \
  "$script_dir/device-condition.m" -o "$output"
printf '%s\n' "$output"
