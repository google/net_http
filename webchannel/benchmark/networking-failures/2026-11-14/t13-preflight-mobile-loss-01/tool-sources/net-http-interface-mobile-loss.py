import importlib.util,json,subprocess,time
from pathlib import Path
repo=Path('/Users/TEST_USER/net_http');file=repo/'webchannel/benchmark/networking-failures/tools/run-network-failures.py'
spec=importlib.util.spec_from_file_location('capture',file);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
folder=Path('/private/tmp/net-http-t13-interface-mobile-loss-20261114-01');folder.mkdir(exist_ok=False)
device='TEST_COREDEVICE_ID'
env={'NETTEST_AUTORUN':'1','NETTEST_INTERFACE_ONLY':'1','NETTEST_RUN':'T13-interface-mobile-loss-01'}
app=m.Capture(['xcrun','devicectl','device','process','launch','--device',device,'--terminate-existing','--console','--environment-variables',json.dumps(env),'com.pmodular.webchannel.demo'],folder/'device-console.log')
start=None;result={'phase':'operator-Mobile-100%-Loss','networkSettingsChanged':False,'operatorCondition':{'profile':'Mobile 100% Loss','interface':'cellular','uplinkLossPercent':100,'downlinkLossPercent':100,'enabledReportedByOperator':True}}
try:
 start=app.wait_for(lambda r:r.get('kind')=='autorun_start',30)
 app.wait_for(lambda r:r.get('kind')=='interface_only_start',10)
 subprocess.run(['xcrun','devicectl','device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.interfaces'],check=True,timeout=20,stdout=subprocess.DEVNULL)
 batch=app.wait_for(lambda r:r.get('kind')=='interface_batch_start',10)['batch']
 app.wait_for(lambda r:r.get('kind')=='interface_batch_complete' and r.get('batch')==batch,12)
 result['probes']=[r for r in app.snapshot() if r.get('kind')=='interface_probe_result' and r.get('batch')==batch]
 result['bothResponded']=len(result['probes'])==2 and all(r['outcome']=='http-response' for r in result['probes'])
 print(json.dumps(result,ensure_ascii=False,indent=2),flush=True)
except Exception as error:
 result['error']=str(error);print('Baseline error:',error,flush=True)
finally:
 try:
  if app.process.poll() is None:
   subprocess.run(['xcrun','devicectl','device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.close'],timeout=15,stdout=subprocess.DEVNULL)
   time.sleep(.3)
   if start:subprocess.run(['xcrun','devicectl','device','process','terminate','--device',device,'--pid',str(start['pid'])],timeout=15,stdout=subprocess.DEVNULL)
   app.process.wait(timeout=5)
 except Exception as error:
  result['cleanupError']=str(error)
  if app.process.poll() is None:app.process.terminate();app.process.wait(timeout=10)
 app.thread.join(timeout=3)
 records=app.snapshot();result['openCount']=sum(r.get('kind')=='open' for r in records)
 (folder/'device-events.jsonl').write_text(''.join(json.dumps(r)+'\n' for r in records))
 (folder/'result.json').write_text(json.dumps(result,indent=2)+'\n')
