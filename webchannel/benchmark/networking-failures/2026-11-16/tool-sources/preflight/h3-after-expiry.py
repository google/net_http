import json
from pathlib import Path
import subprocess
import sys
import time

out = Path('/private/tmp/net-http-h3-after-expiry-20261116')
out.mkdir(exist_ok=False)
def status(phase, **fields):
    data = {'phase': phase, **fields}
    (out/'status.json').write_text(json.dumps(data, indent=2)+'\n')
    print(json.dumps(data), flush=True)
status('waiting-for-expiry')
try:
    while True:
        state = json.loads(Path('/private/tmp/net-http-expiry-boundary-20261116/status.json').read_text())
        if state['phase'] == 'stopped':
            raise RuntimeError('Expiry batch stopped; refusing to replace app during a measurement')
        if state['phase'] in ('complete', 'not-needed'):
            break
        time.sleep(5)
    status('installing-diagnostic-app')
    with (out/'install.log').open('w') as log:
        subprocess.run(['xcrun','devicectl','device','install','app','--device','TEST_DEVICE_UDID',
            '/private/tmp/net-http-h3-diagnostic-build-20261116/Build/Products/Debug-iphoneos/WebChanneliOSDemo.app'],
            stdout=log,stderr=subprocess.STDOUT,check=True,timeout=120)
    for script in ('net-http-h3-diagnostic-20261116.py','net-http-h3-probe2-20261116.py'):
        status('probing', script=script)
        with (out/(script+'.log')).open('w') as log:
            subprocess.run([sys.executable,'-B','-u','/private/tmp/'+script],
                stdout=log,stderr=subprocess.STDOUT,check=True,timeout=120)
    status('complete')
except BaseException as error:
    status('stopped', error=repr(error))
    raise
