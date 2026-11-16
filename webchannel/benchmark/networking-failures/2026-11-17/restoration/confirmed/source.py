from pathlib import Path
import importlib.util,json,subprocess,time,shutil,sys
repo=Path('/Users/TEST_USER/net_http');out=Path('/private/tmp/net-http-h3-restoration-check-20261117-retry');out.mkdir(exist_ok=False);shutil.copy2(__file__,out/'source.py')
spec=importlib.util.spec_from_file_location('support',repo/'webchannel/benchmark/networking-failures/tools/run-network-failures.py');s=importlib.util.module_from_spec(spec);spec.loader.exec_module(s)
device='TEST_DEVICE_UDID'
def command(args,name):
 with (out/(name+'.log')).open('w') as f:subprocess.run(['xcrun','devicectl',*args],stdout=f,stderr=subprocess.STDOUT,check=True,timeout=30)
command(['device','info','details','--device',device,'--json-output',str(out/'device-before.json')],'device-before');connection=json.loads((out/'device-before.json').read_text())['result']['connectionProperties'];assert connection['transportType']=='wired'
env={'NETTEST_AUTORUN':'1','NETTEST_INTERFACE_ONLY':'1','NETTEST_ENDPOINT':s.HTTP3_ENDPOINT,'NETTEST_RUN':'h3-post-test-restoration-check-retry'}
cap=s.Capture(['xcrun','devicectl','device','process','launch','--device',device,'--terminate-existing','--console','--environment-variables',json.dumps(env),'com.pmodular.webchannel.demo'],out/'device-console.log');start=None;error=None
try:
 start=cap.wait_for(lambda e:e.get('kind')=='autorun_start',30)
 command(['device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.interfaces'],'probe-start')
 cap.wait_for(lambda e:e.get('kind')=='interface_batch_complete',20)
except BaseException as e:error=repr(e)
finally:
 if start:
  command(['device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.close'],'close');time.sleep(1)
  command(['device','process','terminate','--device',device,'--pid',str(start['pid'])],'terminate')
 cap.thread.join(timeout=3);events=cap.snapshot();(out/'device-events.jsonl').write_text(''.join(json.dumps(e)+'\n' for e in events))
probes=[e for e in events if e.get('kind')=='interface_probe_result'];result={'scenario':'post-test-restoration-check','diagnosticOnly':True,'endpoint':s.HTTP3_ENDPOINT,'operatorReportedMobile100PercentLossDisabled':True,'SDKChannelOpened':any(e.get('kind')=='open' for e in events),'probes':probes,'error':error}
try:
 assert error is None and result['SDKChannelOpened'] is False
 assert len(probes)==2 and {p['requiredInterface'] for p in probes}=={'wifi','cellular'}
 assert all(p['outcome']=='http-response' and p['path']['status']=='satisfied' and p['path'][p['requiredInterface']] is True for p in probes)
 assert next(e for e in events if e.get('kind')=='interface_batch_start')['endpoint']==s.HTTP3_ENDPOINT
 result['outcome']='wifi-and-cellular-responsive'
except BaseException as e:result['outcome']='restoration-not-confirmed';result['validationError']=repr(e)
(out/'result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
if result['outcome']!='wifi-and-cellular-responsive':sys.exit(1)
