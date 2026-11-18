from pathlib import Path
import importlib.util,json,subprocess,time,shutil,sys
repo=Path('/Users/TEST_USER/net_http');out=Path('/private/tmp/net-http-p2-cellular-off-20261124-retry');out.mkdir(exist_ok=False);shutil.copy2(__file__,out/'source-continued.py')
spec=importlib.util.spec_from_file_location('support',repo/'webchannel/benchmark/networking-failures/tools/run-network-failures.py');s=importlib.util.module_from_spec(spec);spec.loader.exec_module(s)
device='TEST_DEVICE_UDID'
def status(phase,**fields):
 r={'phase':phase,'hostUTC':s.utc(),**fields};(out/'status.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r),flush=True)
def command(args,log,timeout=60):
 with log.open('w') as f:subprocess.run(args,stdout=f,stderr=subprocess.STDOUT,check=True,timeout=timeout)
try:
 for n in range(1,2):
  folder=out/('P2-M6-r'+str(n));folder.mkdir();app=None;start=None
  try:
   env={'NETTEST_AUTORUN':'1','NETTEST_HTTP3':'1','NETTEST_ENDPOINT':s.HTTP3_ENDPOINT,'NETTEST_TRAFFIC':'idle','NETTEST_RUN':'P2-cellular-off-r'+str(n),'NETTEST_QLOG_STARTUP':'1'}
   (folder/'environment.json').write_text(json.dumps(env,indent=2)+'\n')
   status('launching',run=n)
   app=s.Capture(['xcrun','devicectl','device','process','launch','--device',device,'--terminate-existing','--console','--environment-variables',json.dumps(env),'com.pmodular.webchannel.demo'],folder/'console.log')
   config=app.wait_for(lambda r:r.get('kind')=='qlog_startup_configuration',40);start=app.wait_for(lambda r:r.get('kind')=='autorun_start',30)
   opened=app.wait_for(lambda r:r.get('kind')=='open',40);s.require_h3_baseline(app)
   baseline=time.monotonic();status('h3-idle',run=n,elapsed=0,target=180)
   for elapsed in range(30,181,30):
    time.sleep(max(0,baseline+elapsed-time.monotonic()))
    failures=[x for x in app.snapshot()if x.get('kind')in ('error','closed')]
    if failures:raise RuntimeError('Channel failed/closed during idle observation')
    status('h3-idle',run=n,elapsed=elapsed,target=180)
   command(['xcrun','devicectl','device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.qlogfinish'],folder/'qlogfinish.log')
   finish=app.wait_for(lambda r:r.get('kind')=='qlog_session_finish_requested',15);invalid=app.wait_for(lambda r:r.get('kind')=='qlog_session_invalidated',60)
   status('session-invalidated',run=n);time.sleep(5)
   command(['xcrun','devicectl','device','copy','from','--device',device,'--domain-type','appDataContainer','--domain-identifier','com.pmodular.webchannel.demo','--source','Documents/NetworkFailureQlog','--destination',str(folder/'qlog-parent')],folder/'copy-qlog.log')
   shutil.copytree(folder/'qlog-parent'/Path(config['path']).name,folder/'qlog')
   command([sys.executable,str(repo/'webchannel/benchmark/networking-failures/tools/analyze-quic-qlog.py'),str(folder/'qlog'),'--output',str(folder/'qlog-analysis.json')],folder/'analysis.log')
   events=app.snapshot();files=[{'name':x.name,'bytes':x.stat().st_size}for x in (folder/'qlog').rglob('*')if x.is_file()]
   result={'run':n,'requestedIdleSeconds':180,'scenario':'P2','operatorReportedCellularData':'OFF','operatorReportedWiFi':'ON','operatorReportedNLC':'disabled','operatorReportedAP':'direct to switching hub','openToFinishSeconds':finish['deviceUptimeSeconds']-opened['deviceUptimeSeconds'],'protocolEvidence':s.protocol_evidence(events),'files':files,'sessionInvalidationObserved':True,'transportErrors':[x for x in events if x.get('kind')=='transport_error'],'sdkErrors':[x for x in events if x.get('kind')in ('error','sdk_error')],'appSends':[x for x in events if x.get('kind')=='echo_sent']}
   (folder/'result.json').write_text(json.dumps(result,indent=2)+'\n');status('run-complete',run=n,files=len(files))
   if not files:raise RuntimeError('No qlog generated')
  finally:
   if start:command(['xcrun','devicectl','device','process','terminate','--device',device,'--pid',str(start['pid'])],folder/'terminate.log')
   if app:
    app.thread.join(timeout=3);(folder/'events.jsonl').write_text(''.join(json.dumps(x)+'\n'for x in app.snapshot()))
 status('complete',runs=1)
except BaseException as e:
 status('stopped',error=repr(e));raise
