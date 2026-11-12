"""Validate retained measurements without operating a device. Run from any directory."""
import ast
import hashlib
import json
from pathlib import Path
import re
import sys


def validate(root):
    parsed_json = parsed_jsonl_records = parsed_python = 0
    # Exact identifiers are supplied by the local invocation, never stored in this script.
    sensitive = re.compile(sys.argv[2]) if len(sys.argv) > 2 else None
    for path in root.rglob('*'):
        if not path.is_file():
            continue
        if path.name == 'validation.json':
            continue
        text = path.read_text()
        if sensitive:
            assert not sensitive.search(text), f'Unredacted identifier in {path}'
        if path.suffix == '.json':
            json.loads(text)
            parsed_json += 1
        elif path.suffix == '.jsonl':
            for line in text.splitlines():
                if line.strip():
                    json.loads(line)
                    parsed_jsonl_records += 1
        elif path.suffix == '.py':
            ast.parse(text, filename=str(path))
            parsed_python += 1
    snapshot_files = 0
    for sums in root.glob('*/tool-sources/SHA256SUMS'):
        for line in sums.read_text().splitlines():
            digest, name = line.split('  ', 1)
            assert hashlib.sha256((sums.parent / name).read_bytes()).hexdigest() == digest, sums
            snapshot_files += 1
    trials = []
    for result_path in sorted(root.glob('*/result.json')):
        result = json.loads(result_path.read_text())
        folder = result_path.parent
        events = [json.loads(line) for line in (folder / 'device-events.jsonl').read_text().splitlines() if line.strip()]
        assert events and all(e.get('run') == result['run'] for e in events), folder
        assert result['openCount'] == sum(e.get('kind') == 'open' for e in events), folder
        assert result['errorCodes'] == sorted({e['code'] for e in events if e.get('kind') == 'error'}), folder
        for name, record in result['milestones'].items():
            assert record in events, (folder, name)
        excluded = result.get('excludeFromMeasurement', False)
        reference = folder.name == 'human-handoff-01'
        assert excluded or result['outcome'] != 'interrupted', folder
        trials.append({'folder': folder.name, 'run': result['run'], 'outcome': result['outcome'],
                       'excluded': excluded, 'referenceOnly': reference, 'eventCount': len(events),
                       'cleanupError': result.get('cleanupError'),
                       'consoleBytes': (folder / 'device-console.log').stat().st_size})
    groups = {
        'idle_handoff': [f'human-handoff-{n:02d}' for n in (2, 3, 4)],
        't9_short': [f't9-attempt-{n:02d}' for n in (2, 3, 4)],
        't9_long': [f't9-long-{n:02d}' for n in (1, 2, 3)],
        't10': [f't10-{n:02d}' for n in (1, 2, 3)],
        't11': [f't11-{n:02d}' for n in (1, 2, 3)],
        'streaming_handoff': [f'stream-handoff-{n:02d}' for n in (1, 2, 3)],
        'idle_baseline': [f'idle-{n:02d}' for n in (1, 2, 3)],
    }
    for name, folders in groups.items():
        for source in ('run-handoff.py', 'run-network-failures.py'):
            hashes = {hashlib.sha256((root / folder / 'tool-sources' / source).read_bytes()).hexdigest() for folder in folders}
            assert len(hashes) == 1, (name, source)
    measured = [trial for trial in trials if not trial['excluded'] and not trial['referenceOnly']]
    assert len(trials) == 23 and len(measured) == 21
    assert all(trial['cleanupError'] is None for trial in measured)
    output = {'measuredTrials': len(measured), 'referenceTrials': 1, 'excludedTrials': 1,
              'groups': groups, 'groupSnapshotsIdentical': True, 'snapshotFilesVerified': snapshot_files,
              'parsedJSONFiles': parsed_json, 'parsedJSONLRecords': parsed_jsonl_records,
              'parsedPythonFiles': parsed_python, 'trials': trials}
    (root / 'validation.json').write_text(json.dumps(output, indent=2) + '\n')
    print(json.dumps({k: output[k] for k in ('measuredTrials', 'referenceTrials', 'excludedTrials', 'snapshotFilesVerified', 'parsedJSONLRecords')}))


if __name__ == '__main__':
    validate(Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent)
