#!/usr/bin/env python3
"""Record wall-clock benchmark spans, including launch and attachment export."""
import datetime
import json
import sys
import time
from pathlib import Path

root, event, *extra = sys.argv[1:]
path = Path(root) / "timing.json"
data = json.loads(path.read_text()) if path.exists() else {"scope": "Runner wall-clock time, including launch, measurement, attachment export and recovery gaps; excludes build and report generation", "spans": [], "delays": {}}
now = time.time()
stamp = datetime.datetime.fromtimestamp(now, datetime.timezone.utc).isoformat()
if event == "start":
    data.setdefault("startedUTC", stamp)
    data.setdefault("startedEpochSeconds", now)
    data["spans"].append({"startedUTC": stamp, "startedEpochSeconds": now})
elif event == "delay-start":
    item = data["delays"].setdefault(extra[0], {})
    item.setdefault("startedUTC", stamp)
    item.setdefault("startedEpochSeconds", now)
elif event == "delay-end":
    item = data["delays"][extra[0]]
    item.update(finishedUTC=stamp, elapsedSeconds=now-item["startedEpochSeconds"])
elif event == "end":
    data["spans"][-1].update(finishedUTC=stamp, elapsedSeconds=now-data["spans"][-1]["startedEpochSeconds"])
    data.update(finishedUTC=stamp, elapsedSeconds=now-data["startedEpochSeconds"])
else:
    raise ValueError(event)
path.write_text(json.dumps(data, indent=2) + "\n")
