"""Validate completed h3-started suspension observations, without device access."""
import json
from pathlib import Path
import runpy

ROOT = Path(__file__).resolve().parent
expiry = runpy.run_path(str(ROOT.parent / '2026-11-16/analyze-followup.py'))['expiry']


def analyze(folder):
    row = expiry(folder)
    result = json.loads((folder / 'result.json').read_text())
    assert result['requestedHTTP3'] is True
    assert result['endpoint'] == 'https://webchannel.googleapis.com/staging/channel/generator'
    events = [json.loads(x) for x in (folder / 'device-events.jsonl').read_text().splitlines()]
    start = result['milestones']['suspensionStart']['deviceUptimeSeconds']
    baseline = [t for e in events if e.get('kind') == 'task_metrics' and e['deviceUptimeSeconds'] < start
                for t in e['transactions'] if t.get('method') == 'POST']
    assert baseline and baseline[0]['protocol'] == 'h3'
    assert all(t.get('protocol') in ('h3', 'unknown', None) for t in baseline)
    row['protocolEvidence'] = result['protocolEvidence']
    row['http400Observed'] = any(
        (e.get('kind') == 'transport_error' and e.get('domain') == 'com.google.HTTPStatus' and e.get('code') == 400)
        or (e.get('kind') == 'http_state' and e.get('status') == 400) for e in events)
    row['baselineH3Verified'] = True
    return row


if __name__ == '__main__':
    rows = [analyze(p) for p in sorted((ROOT / 'h3-suspension').glob('T15-*'))
            if (p / 'result.json').exists()]
    (ROOT / 'h3-suspension/analysis.json').write_text(json.dumps(rows, indent=2) + '\n')
    lines = ['# H3-started OS suspension observations', '',
             'Completed trials only. OS-state samples, same PID and one SID are verified.',
             'Known h2 fallback and unknown transaction protocols remain explicit.', '',
             '| Trial | OS suspended (s) | Last GET age at foreground (s) | Observation | SDK errors | HTTP 400 | Protocol coverage |',
             '| --- | ---: | ---: | --- | --- | --- | --- |']
    for row in rows:
        lines.append(f"| {row['trial']} | {row['observedSuspendedSeconds']:.3f} | "
                     f"{row['lastGETAgeAtForegroundObservationSeconds']:.3f} | {row['channelObservation']} | "
                     f"{row['errorCodes']} | {row['http400Observed']} | {row['protocolEvidence']['coverage']} |")
    lines += ['', 'GET ages and asynchronous OS state bracket observations; they do not establish an exact server expiry threshold.', '']
    (ROOT / 'h3-suspension/summary.md').write_text('\n'.join(lines))
    print(f'Validated {len(rows)} completed h3-started suspension trials.')
