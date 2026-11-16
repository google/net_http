from pathlib import Path
import importlib.util,json,subprocess,time,shutil
repo=Path('/Users/TEST_USER/net_http');out=Path('/private/tmp/net-http-h3-after-handoff-diagnostic-20261117');out.mkdir(exist_ok=False);shutil.copy2(__file__,out/'source.py')
spec=importlib.util.spec_from_file_location('support',repo/'webchannel/benchmark/networking-failures/tools/run-network-failures.py');s=importlib.util.module_from_spec(spec);spec.loader.exec_module(s)
device='TEST_DEVICE_UDID';env={'NETTEST_AUTORUN':'1','NETTEST_INTERFACE_ONLY':'1','NETTEST_HTTP3':'1','NETTEST_ENDPOINT':s.HTTP3_ENDPOINT,'NETTEST_RUN':'h3-after-handoff-diagnostic'}
def command(args,name):
 with (out/(name+'.log')).open('w') as f:subprocess.run(['xcrun','devicectl',*args],stdout=f,stderr=subprocess.STDOUT,check=True,timeout=30)
cap=s.Capture(['xcrun','devicectl','device','process','launch','--device',device,'--terminate-existing','--console','--environment-variables',json.dumps(env),'com.pmodular.webchannel.demo'],out/'device-console.log');start=None;error=None
try:
 start=cap.wait_for(lambda r:r.get('kind')=='autorun_start',30)
 command(['device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.http3diagnostic'],'diagnostic-start')
 cap.wait_for(lambda r:r.get('kind')=='http3_diagnostic_complete',25)
except BaseException as e:error=repr(e)
finally:
 if start:
  command(['device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.close'],'close');time.sleep(1)
  command(['device','process','terminate','--device',device,'--pid',str(start['pid'])],'terminate')
 cap.thread.join(timeout=3);events=cap.snapshot();(out/'device-events.jsonl').write_text(''.join(json.dumps(e)+'\n' for e in events))
 result={'diagnosticOnly':True,'noSDKChannelOpened':not any(e.get('kind')=='open' for e in events),'error':error,'responses':[e for e in events if e.get('kind')=='http3_diagnostic_response'],'metrics':[e for e in events if e.get('kind')=='http3_diagnostic_metrics']};(out/'result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
