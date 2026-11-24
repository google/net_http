from pathlib import Path
import importlib.util,json,subprocess,time,shutil,sys,hashlib
repo=Path('/Users/TEST_USER/net_http');out=Path('/private/tmp/net-http-buffalo-fixed-m6-on-wired-20261124');out.mkdir(exist_ok=False);shutil.copy2(__file__,out/'controller-source.py')
spec=importlib.util.spec_from_file_location('support',repo/'webchannel/benchmark/networking-failures/tools/run-network-failures.py');s=importlib.util.module_from_spec(spec);spec.loader.exec_module(s)
device='TEST_DEVICE_UDID'
source_paths=['webchannel/benchmark/networking-failures/tools/run-network-failures.py','webchannel/benchmark/networking-failures/tools/analyze-quic-qlog.py','webchannel/objc/demo/WebChanneliOSDemo/WebChanneliOSDemo/TestAppSupport.swift','webchannel/objc/demo/WebChanneliOSDemo/WebChanneliOSDemo/WebChannelService.swift','webchannel/objc/demo/WebChanneliOSDemo/WebChanneliOSDemo/WebChanneliOSDemoApp.swift']
(out/'source-hashes.json').write_text(json.dumps({p:hashlib.sha256((repo/p).read_bytes()).hexdigest()for p in source_paths},indent=2)+'\n')
condition={'operatorReportedAP':'Buffalo WSR-3200AX4S-BK','operatorReportedBand':'5 GHz','operatorReportedNECForgotten':True,'operatorReportedOtherWiFiAutoJoin':'OFF','operatorReportedCellularData':'ON','operatorReportedNLC':'OFF','operatorReportedUSB':'connected','operatorReportedAPWiring':'via LSW6-GT-8NS to central LSW5-GT-8EP/WH; no Linux box'}
(out/'operator-condition.json').write_text(json.dumps(condition,indent=2)+'\n')
def status(phase,**fields):
 r={'phase':phase,'hostUTC':s.utc(),**fields};(out/'status.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r),flush=True)
def command(args,log,timeout=60):
 with log.open('w')as f:subprocess.run(args,stdout=f,stderr=subprocess.STDOUT,check=True,timeout=timeout)
def verify_wired(folder,label):
 path=folder/(label+'-details.json')
 command(['xcrun','devicectl','device','info','details','--device',device,'--json-output',str(path)],folder/(label+'.log'))
 properties=json.loads(path.read_text())['result']['connectionProperties']
 summary={key:properties.get(key)for key in ('transportType','tunnelState','tunnelTransportProtocol')}
 (folder/(label+'-connection.json')).write_text(json.dumps(summary,indent=2)+'\n')
 if summary['transportType']!='wired' or summary['tunnelState']!='connected':raise RuntimeError('Connected wired transport required; observation excluded')
try:
 for n in range(1,4):
  folder=out/('M6-on-r'+str(n));folder.mkdir();app=None;start=None
  try:
   verify_wired(folder,'wired-before')
   env={'NETTEST_AUTORUN':'1','NETTEST_HTTP3':'1','NETTEST_ENDPOINT':s.HTTP3_ENDPOINT,'NETTEST_TRAFFIC':'idle','NETTEST_RUN':'Buffalo-fixed-M6-on-r'+str(n),'NETTEST_QLOG_STARTUP':'1'}
   (folder/'environment.json').write_text(json.dumps(env,indent=2)+'\n');status('launching',run=n)
   app=s.Capture(['xcrun','devicectl','device','process','launch','--device',device,'--terminate-existing','--console','--environment-variables',json.dumps(env),'com.pmodular.webchannel.demo'],folder/'console.log')
   config=app.wait_for(lambda r:r.get('kind')=='qlog_startup_configuration',40);start=app.wait_for(lambda r:r.get('kind')=='autorun_start',30)
   opened=app.wait_for(lambda r:r.get('kind')=='open',40);s.require_h3_baseline(app)
   baseline=time.monotonic();status('h3-idle',run=n,elapsed=0,target=180)
   for elapsed in range(30,181,30):
    time.sleep(max(0,baseline+elapsed-time.monotonic()));snapshot=app.snapshot()
    if any(x.get('kind')in ('error','closed')for x in snapshot):raise RuntimeError('Channel failed/closed during observation')
    beat=next((x for x in reversed(snapshot)if x.get('kind')=='heartbeat'),None)
    if not beat or time.monotonic()-beat['hostReceivedMonotonic']>8:raise RuntimeError('Stale app heartbeat')
    if beat.get('applicationState')!=0:raise RuntimeError('App not active during idle observation')
    verify_wired(folder,'wired-'+str(elapsed)+'s')
    status('h3-idle',run=n,elapsed=elapsed,target=180)
   command(['xcrun','devicectl','device','notification','post','--device',device,'--name','com.pmodular.webchannel.nettest.qlogfinish'],folder/'qlogfinish.log')
   finish=app.wait_for(lambda r:r.get('kind')=='qlog_session_finish_requested',15);invalid=app.wait_for(lambda r:r.get('kind')=='qlog_session_invalidated'and r['deviceUptimeSeconds']>=finish['deviceUptimeSeconds'],60)
   status('session-invalidated',run=n);time.sleep(5)
   verify_wired(folder,'wired-before-copy')
   command(['xcrun','devicectl','device','copy','from','--device',device,'--domain-type','appDataContainer','--domain-identifier','com.pmodular.webchannel.demo','--source','Documents/NetworkFailureQlog','--destination',str(folder/'qlog-parent')],folder/'copy-qlog.log')
   shutil.copytree(folder/'qlog-parent'/Path(config['path']).name,folder/'qlog')
   command([sys.executable,str(repo/'webchannel/benchmark/networking-failures/tools/analyze-quic-qlog.py'),str(folder/'qlog'),'--output',str(folder/'qlog-analysis.json')],folder/'analysis.log')
   events=app.snapshot();files=[{'name':x.name,'bytes':x.stat().st_size}for x in (folder/'qlog').rglob('*')if x.is_file()];stop=next(x for x in events if x.get('kind')=='control'and x.get('action','').endswith('.qlogfinish'))
   result={'run':n,'scenario':'Buffalo-fixed-M6','requestedIdleSeconds':180,**condition,'openToStopControlSeconds':stop['deviceUptimeSeconds']-opened['deviceUptimeSeconds'],'protocolEvidence':s.protocol_evidence(events),'files':files,'sessionInvalidationObserved':True,'transportErrors':[x for x in events if x.get('kind')=='transport_error'],'sdkErrors':[x for x in events if x.get('kind')in ('error','sdk_error')],'appSends':[x for x in events if x.get('kind')=='echo_sent'],'pathEvents':[x for x in events if x.get('kind')=='path'],'inactiveHeartbeatsBeforeStop':[x for x in events if x.get('kind')=='heartbeat'and x.get('applicationState')!=0 and x['deviceUptimeSeconds']<stop['deviceUptimeSeconds']]}
   (folder/'result.json').write_text(json.dumps(result,indent=2)+'\n');status('run-complete',run=n,files=len(files),h3Transactions=result['protocolEvidence']['h3Transactions'])
   if not files:raise RuntimeError('No qlog generated')
  finally:
   if start:command(['xcrun','devicectl','device','process','terminate','--device',device,'--pid',str(start['pid'])],folder/'terminate.log')
   if app:
    app.thread.join(timeout=3);(folder/'events.jsonl').write_text(''.join(json.dumps(x)+'\n'for x in app.snapshot()))
 status('complete',runs=3)
except BaseException as e:status('stopped',error=repr(e));raise
