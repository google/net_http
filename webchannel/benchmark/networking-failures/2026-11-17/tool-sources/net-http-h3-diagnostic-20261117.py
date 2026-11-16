import importlib.util
import json
from pathlib import Path
import subprocess
import time

spec = importlib.util.spec_from_file_location('support', '/Users/TEST_USER/net_http/webchannel/benchmark/networking-failures/tools/run-network-failures.py')
support = importlib.util.module_from_spec(spec)
spec.loader.exec_module(support)
folder = Path('/private/tmp/net-http-h3-diagnostic-20261117-01')
folder.mkdir(exist_ok=False)
device = 'TEST_DEVICE_UDID'
env = {'NETTEST_AUTORUN': '1', 'NETTEST_INTERFACE_ONLY': '1', 'NETTEST_RUN': 'h3-diagnostic-20261117-01'}
app = support.Capture(['xcrun','devicectl','device','process','launch','--device',device,
    '--terminate-existing','--console','--environment-variables',json.dumps(env),
    'com.pmodular.webchannel.demo'], folder/'console.log')
start = None
def notify(action):
    with (folder/(action+'.log')).open('w') as log:
        subprocess.run(['xcrun','devicectl','device','notification','post','--device',device,
            '--name','com.pmodular.webchannel.nettest.'+action],stdout=log,stderr=subprocess.STDOUT,check=True,timeout=30)
try:
    start = app.wait_for(lambda r:r.get('kind')=='autorun_start',30)
    app.wait_for(lambda r:r.get('kind')=='interface_only_start',10)
    notify('http3diagnostic')
    app.wait_for(lambda r:r.get('kind')=='http3_diagnostic_complete',45)
finally:
    if app.process.poll() is None:
        notify('close')
        time.sleep(1)
        if start:
            with (folder/'terminate.log').open('w') as log:
                subprocess.run(['xcrun','devicectl','device','process','terminate','--device',device,
                    '--pid',str(start['pid'])],stdout=log,stderr=subprocess.STDOUT,timeout=30)
    app.thread.join(timeout=3)
    events = app.snapshot()
    tx = [t for r in events if r.get('kind')=='http3_diagnostic_metrics' for t in r['transactions']]
    result = {'faultInjected':False,'SDKChannelOpened':any(r.get('kind')=='open' for r in events),
        'complete':any(r.get('kind')=='http3_diagnostic_complete' for r in events),
        'transactions':tx,'responses':[r for r in events if r.get('kind')=='http3_diagnostic_response'],
        'note':'Independent HEAD diagnostics, not WebChannel h3 test coverage'}
    (folder/'events.jsonl').write_text(''.join(json.dumps(r)+'\n' for r in events))
    (folder/'result.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2),flush=True)
