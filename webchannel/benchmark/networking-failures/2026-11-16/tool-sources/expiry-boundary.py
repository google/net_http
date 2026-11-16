"""If 60 s still recovers, add three 75 s observations to narrow the bracket."""
import json
from pathlib import Path
import subprocess
import sys
import time

root = Path('/private/tmp/net-http-expiry-20261116-03')
out = Path('/private/tmp/net-http-expiry-boundary-20261116')
out.mkdir(exist_ok=False)
def status(phase, **fields):
    record = {'phase': phase, **fields}
    (out/'status.json').write_text(json.dumps(record, indent=2)+'\n')
    print(json.dumps(record), flush=True)
status('waiting-for-45s-and-60s')
try:
    while True:
        state = json.loads((root/'status.json').read_text())
        if state['phase'] == 'stopped':
            raise RuntimeError('Initial expiry batch stopped')
        if state['phase'] == 'complete':
            break
        time.sleep(5)
    recovered = all(json.loads((root/f'T15-60s-r{i}/result.json').read_text())['channelObservation'] == 'echo-resumed'
                    for i in range(1,4))
    if not recovered:
        status('not-needed', reason='60 s group already includes a non-recovery observation')
    else:
        for run in range(1,4):
            label = f'T15-75s-r{run}'
            status('measuring', trial=label)
            with (out/(label+'.log')).open('w') as log:
                subprocess.run([sys.executable,'-B','-u',
                    '/Users/TEST_USER/net_http/webchannel/benchmark/networking-failures/tools/run-suspension.py',
                    '--device','TEST_DEVICE_UDID',
                    '--xctestrun','/private/tmp/net-http-h3-build-20261116/Build/Products/NetworkFailureSuspension_iphoneos27.2-arm64.xctestrun',
                    '--hold','75','--output',str(out/label)],stdout=log,stderr=subprocess.STDOUT,check=True)
            result = json.loads((out/label/'result.json').read_text())
            assert result['outcome'] == 'suspension-observed'
            status('trial-complete', trial=label, observation=result['channelObservation'])
        status('complete')
except BaseException as error:
    status('stopped', error=repr(error))
    raise
