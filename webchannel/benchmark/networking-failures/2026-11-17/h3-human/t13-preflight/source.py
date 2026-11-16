from pathlib import Path
import importlib.util,json,subprocess,time,shutil,sys
repo=Path('/Users/TEST_USER/net_http');out=Path('/private/tmp/net-http-h3-t13-preflight-20261117');out.mkdir(exist_ok=False);shutil.copy2(__file__,out/'source.py')
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
support=module('support',repo/'webchannel/benchmark/networking-failures/tools/run-network-failures.py');handoff=module('handoff',repo/'webchannel/benchmark/networking-failures/tools/run-handoff.py')
device='TEST_DEVICE_UDID'
def command(args,name):
 with (out/(name+'.log')).open('w') as f:subprocess.run(['xcrun','devicectl',*args],stdout=f,stderr=subprocess.STDOUT,check=True,timeout=30)
command(['device','info','details','--device',device,'--json-output',str(out/'device-before.json')],'device-before');connection=json.loads((out/'device-before.json').read_text())['result']['connectionProperties'];assert connection['transportType']=='wired' and connection['tunnelState']=='connected'
env={'NETTEST_AUTORUN':'1','NETTEST_INTERFACE_ONLY':'1','NETTEST_ENDPOINT':support.HTTP3_ENDPOINT,'NETTEST_RUN':'h3-t13-selective-loss-preflight'}
cap=support.Capture(['xcrun','devicectl','device','process','launch','--device',device,'--terminate-existing','--console','--environment-variables',json.dumps(env),'com.pmodular.webchannel.demo'],out/'device-console.log');start=None;error=None
try:
 start=cap.wait_for(lambda r:r.get('kind')=='autorun_start',30)
 command(['device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.interfaces'],'probe-start')
 cap.wait_for(lambda r:r.get('kind')=='interface_batch_complete',20)
except BaseException as e:error=repr(e)
finally:
 if start:
  command(['device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.close'],'close');time.sleep(1)
  command(['device','process','terminate','--device',device,'--pid',str(start['pid'])],'terminate')
 cap.thread.join(timeout=3);events=cap.snapshot();(out/'device-events.jsonl').write_text(''.join(json.dumps(e)+'\n' for e in events))
result={'scenario':'T13-selective-loss-preflight','endpoint':support.HTTP3_ENDPOINT,'diagnosticOnly':True,'SDKChannelOpened':any(e.get('kind')=='open' for e in events),'operatorCondition':{'profile':'Mobile 100% Loss','interface':'cellular','uplinkLossPercent':100,'downlinkLossPercent':100,'enabledReportedByOperator':True},'probes':[e for e in events if e.get('kind')=='interface_probe_result'],'error':error,'timingNote':'Interface-bound HTTP/1.1 reachability probes, not WebChannel h3 coverage; HTTP 400 on an unparameterized HEAD proves an HTTP response, not an SDK UnknownSessionID error.'}
try:
 assert error is None and result['SDKChannelOpened'] is False
 batch=next(e for e in events if e.get('kind')=='interface_batch_start');assert batch['endpoint']==support.HTTP3_ENDPOINT
 starts=[e for e in events if e.get('kind')=='interface_probe_start'];assert len(starts)==2 and all(e['host']=='webchannel.googleapis.com' for e in starts)
 result['validation']=handoff.validate_cellular_proof(result);result['outcome']='selective-cellular-loss-confirmed'
except BaseException as e:result['outcome']='preflight-not-confirmed';result['validationError']=repr(e)
(out/'result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
if result['outcome']!='selective-cellular-loss-confirmed':sys.exit(1)
