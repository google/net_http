#!/usr/bin/env python3
"""Manually mark a network fault; alarm and measure using a monotonic clock."""

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import subprocess
import threading
import time


def utc_now():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("seconds", type=float, nargs="?", default=50)
    parser.add_argument("--label", default="unlabeled")
    args = parser.parse_args()
    if not 0 < args.seconds <= 3600:
        parser.error("seconds must be between 0 and 3600")

    output = Path(__file__).with_name("fault-markers.jsonl")

    def record(event, **fields):
        data = {"label": args.label, "event": event, "mac_utc": utc_now(), **fields}
        with output.open("a") as stream:
            stream.write(json.dumps(data, ensure_ascii=False) + "\n")
        return data

    print(f"{args.label}: {args.seconds:g}秒後に解除アラーム。Ctrl+Cで中止。", flush=True)
    print("iPhoneで100% Lossを有効にした直後、Enterを押してください。", flush=True)
    input()
    start = time.monotonic()
    record("operator_start_marker", target_seconds=args.seconds)
    print("計測開始。デモへ戻ってください。アラーム後に解除し、Enterを押してください。", flush=True)
    done = threading.Event()

    def alarm():
        if done.wait(max(0, start + args.seconds - time.monotonic())):
            return
        record("alarm", elapsed_seconds=round(time.monotonic() - start, 3))
        print("\n\a【解除時刻です】100% Lossをオフにして、Enterを押してください。", flush=True)
        sound = Path("/System/Library/Sounds/Glass.aiff")
        if sound.exists():
            subprocess.run(["/usr/bin/afplay", str(sound)], check=False)

    worker = threading.Thread(target=alarm, daemon=True)
    worker.start()
    try:
        input()
    except (KeyboardInterrupt, EOFError):
        done.set()
        record("aborted", elapsed_seconds=round(time.monotonic() - start, 3))
        print("\n中止しました。iPhoneの100% Lossをオフにしてください。", flush=True)
        return
    elapsed = time.monotonic() - start
    done.set()
    result = record("operator_stop_marker", elapsed_seconds=round(elapsed, 3))
    print(f"実測: {elapsed:.3f}秒 / Mac UTC: {result['mac_utc']}", flush=True)
    print(f"保存先: {output}", flush=True)
    print("時刻はEnterの操作時刻です。端末のスイッチ操作との差は含まれます。", flush=True)


if __name__ == "__main__":
    main()
