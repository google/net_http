import importlib.util
import json
from pathlib import Path
import subprocess
import time

spec = importlib.util.spec_from_file_location('support', '/Users/TEST_USER/net_http/webchannel/benchmark/networking-failures/tools/run-network-failures.py')
support = importlib.util.module_from_spec(spec)
spec.loader.exec_module(support)
folder = Path('/private/tmp/net-http-h3-preflight-20261116-01')
folder.mkdir(exist_ok=False)
device = 'TEST_DEVICE_UDID'
env = {'NETTEST_AUTORUN': '1', 'NETTEST_RUN': 'h3-preflight-01', 'NETTEST_TRAFFIC': 'idle', 'NETTEST_HTTP3': '1'}
app = support.Capture(['xcrun', 'devicectl', 'device', 'process', 'launch', '--device', device,
    '--terminate-existing', '--console', '--environment-variables', json.dumps(env), 'com.pmodular.webchannel.demo'], folder/'console.log')
result = {'faultInjected': False, 'requestedHTTP3': True}
start = None
def notify(action):
    with (folder/(action+'.log')).open('w') as log:
        subprocess.run(['xcrun', 'devicectl', 'device', 'notification', 'post', '--device', device,
            '--name', 'com.pmodular.webchannel.nettest.'+action], stdout=log, stderr=subprocess.STDOUT, check=True, timeout=30)
try:
    start = app.wait_for(lambda r:r.get('kind')=='autorun_start',30)
    app.wait_for(lambda r:r.get('kind')=='open',60)
    notify('probe')
    app.wait_for(lambda r:r.get('kind')=='echo_reply',30)
    time.sleep(3)
    result['opened'] = True
finally:
    if app.process.poll() is None:
        notify('close')
        time.sleep(2)
        if start:
            with (folder/'terminate.log').open('w') as log:
                subprocess.run(['xcrun','devicectl','device','process','terminate','--device',device,'--pid',str(start['pid'])],stdout=log,stderr=subprocess.STDOUT,timeout=30)
    app.thread.join(timeout=3)
    records = app.snapshot()
    (folder/'events.jsonl').write_text(''.join(json.dumps(r)+'\n' for r in records))
    tx = [t for r in records if r.get('kind')=='task_metrics' for t in r['transactions']]
    result.update(transactions=tx, protocols=sorted({t['protocol'] for t in tx}),
        http3RequestCount=sum(r.get('kind')=='http3_request' for r in records),
        headers=[r for r in records if r.get('kind')=='handshake_headers'],
        errors=[r for r in records if r.get('kind') in ('transport_error','error')])
    result['h3Observed'] = any(t['protocol']=='h3' for t in tx)
    (folder/'result.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:v for k,v in result.items() if k not in ('transactions','headers','errors')},indent=2),flush=True)
