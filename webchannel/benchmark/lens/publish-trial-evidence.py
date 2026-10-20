#!/usr/bin/env python3
"""Prepare a verified sweep for Git publication without duplicate batch evidence."""
import hashlib
import json
import re
import shutil
import sys
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def prepare(root):
    assert json.loads((root / 'completion.json').read_text())['status'] == 'complete'
    assert json.loads((root / 'plots/verification.json').read_text())['status'] == 'complete'
    settings = json.loads((root / 'execution-settings.json').read_text())
    backup = root / 'local-provenance'
    if not backup.exists():
        backup.mkdir()
        for name in ('plots/input-manifest.json', 'plots/verification.json', 'report-generation-settings.json'):
            target = backup / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(root / name, target)
    raw = {}
    for delay in settings['delaysMs']:
        phase = root / f'delay-{delay}ms'
        mapping = json.loads((phase / 'batch-trial-map.json').read_text())
        lines = ['# Per-trial benchmark evidence', '', '[Main report](../report.md) · [Connection audit](connection-reuse-audit.md) · [Original batch identity and hashes](batch-trial-map.json)', '',
                 'Every trial retains its original JSON/CSV bytes and exact WebChannel/HTTP stdout segment. The JSON includes application events and URLSession transport metrics. Failed measurements are retained. Shared batch exports/stdout, result bundles, archives and source snapshots remain local; no links below require them.', '',
                 '| Run # | Setting | JSON | CSV | WebChannel / HTTP log |', '|---:|---|---|---|---|']
        for stem, item in sorted(mapping.items(), key=lambda pair: pair[1]['ordinal']):
            folder = phase / 'attachments' / f'{stem}-attachments'
            for field, hashkey in (('originalJSON', 'jsonSHA256'), ('originalCSV', 'csvSHA256')):
                original = phase / item[field]
                published = folder / original.name
                assert digest(published) == item[hashkey]
                if original.exists():
                    assert published.read_bytes() == original.read_bytes()
                raw[published.relative_to(root).as_posix()] = digest(published)
            log = phase / 'logs' / f'{stem}.log'
            assert digest(log) == item['trialLogSHA256']
            batchlog = phase / item['batchLog']
            if batchlog.exists():
                begin, end = item['stdoutByteRange']
                assert log.read_bytes() == batchlog.read_bytes()[begin:end]
            raw[log.relative_to(root).as_posix()] = digest(log)
            row = json.loads((folder / Path(item['originalJSON']).name).read_text())[0]
            assert row['batchTrialOrdinal'] == item['ordinal']
            assert row['processInstanceId'] == item['processInstanceId']
            assert row['batchId'] == item['batchId']
            jp = (folder / Path(item['originalJSON']).name).relative_to(phase)
            cp = (folder / Path(item['originalCSV']).name).relative_to(phase)
            lines.append(f"| {row['batchPair']} | {row['batchSetting'].upper()} | [JSON]({jp}) | [CSV]({cp}) | [Log](logs/{stem}.log) |")
        shared = phase / 'export-manifests'
        shared.mkdir(exist_ok=True)
        for original in sorted((phase / 'attachments').glob('batch-*-export/manifest.json')):
            target = shared / (original.parent.name.removesuffix('-export') + '.json')
            if target.exists():
                assert target.read_bytes() == original.read_bytes()
            else:
                shutil.copy2(original, target)
        lines += ['', '## Shared export manifests', '', 'Each original batch manifest is retained once. It records XCTest attachment/repetition identity; exported filenames resolve within the per-trial directories above. Batch map paths retain their original local layout as historical provenance.']
        for path in sorted(shared.glob('*.json')):
            raw[path.relative_to(root).as_posix()] = digest(path)
            lines.append(f'- [{path.name}]({path.relative_to(phase)})')
        (phase / 'artifacts.md').write_text('\n'.join(lines) + '\n')
    policy = dict(evidenceLayout='per-trial', measurementEvidenceUnmodified=True,
                  publishedEvidenceSHA256=raw,
                  localOnly=['batch exports', 'shared batch stdout', 'xcresults and aliases',
                             'duplicate per-trial batch manifests', 'archives', 'source-snapshots',
                             'pre-publication rendering provenance'],
                  verificationScope='Published original per-trial JSON/CSV and exact stdout hashes and identities; full original batch comparison was verified locally before publication.',
                  regenerate='python3 -B webchannel/benchmark/lens/summarize-delay-sweep.py RUN_DIR --report-format unpaired')
    previous = root / 'publication-settings.json'
    if previous.exists():
        assert json.loads(previous.read_text()) == policy
    previous.write_text(json.dumps(policy, indent=2) + '\n')
    (root / '.gitignore').write_text('''# Publish per-trial evidence; retain duplicate/full evidence only locally.
/source-snapshots/
/local-provenance/
/delay-*/xcresults/
/delay-*/attachments/batch-*-export/
/delay-*/attachments/omnient-*-attachments/manifest.json
/delay-*/logs/batch-*.log
*.tar
*.tar.gz
*.tgz
*.zip
''')
    outcomes = root / 'measurement-outcomes.json'
    if outcomes.exists():
        document = json.loads(outcomes.read_text())
        rows = document['trials'] if isinstance(document, dict) else document
        for row in rows:
            original = Path(row['originalJSON'])
            pair = row.get('pair') or (row['trialOrdinal'] + 1) // 2
            stem = f"omnient-{pair}-{row['setting']}"
            row['originalJSON'] = f"delay-{row['delayMs']}ms/attachments/{stem}-attachments/{original.name}"
        outcomes.write_text(json.dumps(document, indent=2) + '\n')
    print(f'Prepared {len(raw)} original evidence files; no source evidence deleted or modified.')


if __name__ == '__main__':
    prepare(Path(sys.argv[1]).resolve())
