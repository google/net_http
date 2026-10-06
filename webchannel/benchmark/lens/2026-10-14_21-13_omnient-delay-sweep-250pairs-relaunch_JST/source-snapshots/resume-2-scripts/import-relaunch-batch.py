#!/usr/bin/env python3
"""Bind repeated XCTest attachments and exact stdout ranges to Lens trial IDs."""
import csv
import hashlib
import json
import re
import shutil
from pathlib import Path


def import_batch(phase, batch_id, start, count, delay, log, export, bundle):
    raw = log.read_bytes()
    matches = list(re.finditer(rb"LENS_BATCH_TRIAL_STARTED (\{[^\r\n]+\})", raw))
    starts = [json.loads(m.group(1)) for m in matches]
    expected = list(range(start, start + count))
    if [r["batchTrialOrdinal"] for r in starts] != expected:
        raise ValueError("Entered iterations are missing, repeated, or out of order; no trial is retried")
    if len({r["processInstanceId"] for r in starts}) != count or any(a["processId"] == b["processId"] for a, b in zip(starts, starts[1:])):
        raise ValueError("Each entered trial must have a distinct application process instance")
    manifest = json.loads((export / "manifest.json").read_text())
    attachments = [a for item in manifest for a in item["attachments"]]
    by_ordinal = {}
    for attachment in attachments:
        if attachment["exportedFileName"].endswith(".json"):
            candidate = export / attachment["exportedFileName"]
            candidate_rows = json.loads(candidate.read_text())
            if len(candidate_rows) != 1:
                raise ValueError("One original JSON must record exactly one trial")
            ordinal = candidate_rows[0]["batchTrialOrdinal"]
            by_ordinal.setdefault(ordinal, []).append((attachment, candidate, candidate_rows[0]))
    prepared = []
    for index, marker in enumerate(starts):
        ordinal = expected[index]
        setting = "on" if ordinal % 2 == 0 else "off"
        pair = (ordinal + 1) // 2
        candidates = by_ordinal.get(ordinal, [])
        if len(candidates) != 1:
            raise ValueError(f"Iteration {ordinal}: expected exactly one original JSON by explicit ordinal")
        attachment, json_file, row = candidates[0]
        repetition = attachment["repetitionNumber"]
        files = [a for a in attachments if a.get("repetitionNumber") == repetition]
        json_files = [export / a["exportedFileName"] for a in files if a["exportedFileName"].endswith(".json")]
        csv_files = [export / a["exportedFileName"] for a in files if a["exportedFileName"].endswith(".csv")]
        if json_files != [json_file] or len(csv_files) != 1:
            raise ValueError(f"Iteration {ordinal}: ambiguous original JSON/CSV repetition")
        for key in ("batchId", "batchTrialOrdinal", "batchPair", "batchSetting", "processId", "processInstanceId"):
            if row.get(key) != marker[key]:
                raise ValueError(f"Attachment and stdout identity mismatch: {key}")
        if (row["batchId"] != batch_id or row["batchPair"] != pair or row["batchSetting"] != setting
                or row["scenario"] != "omnient" or row["initialMessageDelayMs"] != delay
                or row["enableBinaryEncoding"] is not True or row["fastHandshake2"] != (setting == "on")):
            raise ValueError("Attachment does not match the requested OFF/ON schedule")
        with csv_files[0].open() as stream:
            csv_rows = list(csv.DictReader(stream))
        if len(csv_rows) != 1 or int(csv_rows[0]["batchTrialOrdinal"]) != ordinal:
            raise ValueError("CSV and JSON identify different iterations")
        for key in ("handshakeMs", "ttfaMs", "ttfdMs", "m4RttMs"):
            if row.get(key) is not None and float(csv_rows[0][key]) != row[key]:
                raise ValueError(f"Original CSV and JSON disagree on {key}")
        begin = matches[index].start()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(raw)
        stem = f"omnient-{pair}-{setting}"
        destination = phase / "attachments" / f"{stem}-attachments"
        target_log = phase / "logs" / f"{stem}.log"
        if destination.exists() or target_log.exists():
            raise ValueError(f"Refusing to overwrite recorded trial {stem}")
        prepared.append((stem, destination, target_log, json_files[0], csv_files[0], begin, end, row, repetition))
    mapping = {}
    for stem, destination, target_log, json_file, csv_file, begin, end, row, repetition in prepared:
        destination.mkdir()
        shutil.copy2(json_file, destination / json_file.name)
        shutil.copy2(csv_file, destination / csv_file.name)
        shutil.copy2(export / "manifest.json", destination / "manifest.json")
        target_log.write_bytes(raw[begin:end])
        alias = phase / "xcresults" / f"{stem}.xcresult"
        alias.symlink_to(bundle.name, target_is_directory=True)
        mapping[stem] = {"batchId": batch_id, "ordinal": row["batchTrialOrdinal"],
            "processId": row["processId"], "processInstanceId": row["processInstanceId"],
            "repetitionNumber": repetition, "originalJSON": json_file.relative_to(phase).as_posix(),
            "jsonSHA256": hashlib.sha256(json_file.read_bytes()).hexdigest(),
            "originalCSV": csv_file.relative_to(phase).as_posix(),
            "csvSHA256": hashlib.sha256(csv_file.read_bytes()).hexdigest(),
            "batchLog": log.relative_to(phase).as_posix(), "stdoutByteRange": [begin, end],
            "trialLogSHA256": hashlib.sha256(raw[begin:end]).hexdigest(),
            "resultBundle": bundle.relative_to(phase).as_posix()}
    return mapping, [entry[7] for entry in prepared]
