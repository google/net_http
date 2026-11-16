"""Queue six fresh-process T15 observations after the independent T5 suite."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import time
from datetime import datetime, timezone

parser = argparse.ArgumentParser()
parser.add_argument('--device', required=True)
parser.add_argument('--xctestrun', required=True)
parser.add_argument('--network-run', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
args.output.mkdir(exist_ok=False)
completed = []
def status(phase, **fields):
    record = {'phase': phase, 'completed': completed,
              'hostUTC': datetime.now(timezone.utc).isoformat(), **fields}
    (args.output/'status.json').write_text(json.dumps(record, indent=2)+'\n')
    print(json.dumps(record), flush=True)
status('waiting-for-t5')
while True:
    state = json.loads((args.network_run/'status.json').read_text())
    if state['phase'] == 'stopped':
        raise RuntimeError('T5 suite stopped; refusing to overlap or mask its failure')
    if state['phase'] == 'complete':
        assert len(json.loads((args.network_run/'results.json').read_text())) == 3
        break
    time.sleep(5)
controller = '/Users/TEST_USER/net_http/webchannel/benchmark/networking-failures/tools/run-suspension.py'
try:
    for hold in (45, 60):
        for run in range(1, 4):
            label = f'T15-{hold}s-r{run}'
            status('measuring', trial=label)
            with (args.output/(label+'.log')).open('w') as log:
                subprocess.run([sys.executable, '-B', '-u', controller, '--device', args.device,
                    '--xctestrun', args.xctestrun, '--hold', str(hold), '--output', str(args.output/label)],
                    stdout=log, stderr=subprocess.STDOUT, check=True)
            result = json.loads((args.output/label/'result.json').read_text())
            assert result['outcome'] == 'suspension-observed', result
            completed.append({'trial': label, 'holdSeconds': hold,
                              'channelObservation': result['channelObservation']})
            status('trial-complete', trial=label)
    status('complete')
except BaseException as error:
    status('stopped', error=repr(error))
    raise
