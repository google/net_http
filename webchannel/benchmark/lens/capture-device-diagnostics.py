#!/usr/bin/env python3
"""Capture bounded read-only connection diagnostics outside measured trials."""

import datetime
import json
import subprocess
import sys
from pathlib import Path


def main():
    device, output = sys.argv[1:]
    output = Path(output)
    output.mkdir(parents=True, exist_ok=False)
    commands = {
        "usb": ["ioreg", "-p", "IOUSB", "-l", "-w", "0"],
        "coredevice-list": ["xcrun", "devicectl", "list", "devices"],
        "coredevice-details": ["xcrun", "devicectl", "device", "info", "details", "--device", device],
        "power-assertions": ["pmset", "-g", "assertions"],
        "power-settings": ["pmset", "-g", "custom"],
    }
    records = []
    for name, command in commands.items():
        record = {"name": name, "command": command,
                  "startedUTC": datetime.datetime.now(datetime.timezone.utc).isoformat()}
        with (output / f"{name}.log").open("w") as stream:
            try:
                result = subprocess.run(command, stdout=stream, stderr=subprocess.STDOUT, timeout=15)
                record["exitCode"] = result.returncode
            except subprocess.TimeoutExpired:
                record["timeoutSeconds"] = 15
            except OSError as error:
                record["error"] = str(error)
        record["finishedUTC"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
        records.append(record)
    (output / "capture.json").write_text(json.dumps(records, indent=2) + "\n")


if __name__ == "__main__":
    main()
