from pathlib import Path
import json,hashlib,re,shutil
repo=Path('/Users/TEST_USER/net_http');raw=Path('/private/tmp/net-http-m6-qlog-20261118');out=repo/'webchannel/benchmark/networking-failures/2026-11-18/h3-m6-qlog'
d=json.loads(Path('/private/tmp/net-http-device-20261116.json').read_text())['result']
rep={d['identifier']:'TEST_COREDEVICE_ID',d['hardwareProperties']['udid']:'TEST_DEVICE_UDID',d['hardwareProperties']['serialNumber']:'TEST_DEVICE_SERIAL',d['deviceProperties']['name']:'TEST_DEVICE_NAME','/Users/TEST_USER':'/Users/TEST_USER'}
for h in d['connectionProperties'].get('localHostnames',[]):rep[h]='TEST_DEVICE_HOSTNAME'
def clean(s):
 for a,b in sorted(rep.items(),key=lambda x:len(x[0]),reverse=True):
  if a:s=re.sub(re.escape(a),lambda _:b,s,flags=re.I)
 s=s.replace(str(d['hardwareProperties']['ecid']),'TEST_DEVICE_ECID')
 s=re.sub(r'/var/mobile/Containers/Data/Application/[0-9A-Fa-f-]+','/var/mobile/Containers/Data/Application/TEST_APP_CONTAINER',s)
 return s
summary=[]
for folder in sorted(raw.glob('M6-r*')):
 if not (folder/'result.json').exists():continue
 dest=out/folder.name;dest.mkdir(parents=True,exist_ok=True)
 for name in ('result.json','events.jsonl','environment.json','qlogfinish.log','copy-qlog.log','terminate.log'):
  p=folder/name
  if p.exists():(dest/name).write_text(clean(p.read_text()))
 analyses=json.loads((folder/'qlog-analysis.json').read_text())
 evidence=[]
 for i,p in enumerate(sorted((folder/'qlog').rglob('*.qlog'))):
  document=json.loads(p.read_text())
  for trace in document['traces']:
   origin=trace['events'][0][0];selected=[]
   for event in trace['events']:
    name=event[2].lower();data=event[3]
    if name=='parameters_set':
     selected.append({'seconds':(event[0]-origin)/1e6,'event':name,'data':{k:data[k]for k in ('owner','max_idle_timeout')if k in data}})
    elif name=='packet_lost':
     selected.append({'seconds':(event[0]-origin)/1e6,'event':name,'data':data})
    elif name in ('packet_sent','packet_received')and any(f.get('frame_type')=='ping'for f in data.get('frames',[])):
     selected.append({'seconds':(event[0]-origin)/1e6,'event':name,'data':{'packet_type':data.get('packet_type'),'header':data.get('header'),'frames':data.get('frames')}})
   evidence.append({'sourceSHA256':hashlib.sha256(p.read_bytes()).hexdigest(),'eventFields':trace['event_fields'],'flow':trace['vantage_point'],'selectedEvents':selected})
 for a in analyses:a['file']='connection.qlog'
 (dest/'qlog-analysis.json').write_text(json.dumps(analyses,indent=2)+'\n');(dest/'qlog-evidence.json').write_text(json.dumps(evidence,indent=2)+'\n')
 result=json.loads((folder/'result.json').read_text());events=[json.loads(x)for x in (folder/'events.jsonl').read_text().splitlines()];finish=next(x['deviceUptimeSeconds']for x in events if x.get('kind')=='control'and x.get('action','').endswith('.qlogfinish'));idle=[p['seconds']for a in analyses for p in a['sentPingPackets']if p['seconds']>1]
 summary.append({'run':result['run'],'openToFinishSeconds':result['openToFinishSeconds'],'openToStopControlSeconds':finish-next(x['deviceUptimeSeconds']for x in events if x.get('kind')=='open'),'protocolEvidence':result['protocolEvidence'],'qlogCount':len(evidence),'localTimeoutsMs':[p['maxIdleTimeoutMs']for a in analyses for p in a['transportParameters']if p['owner']=='local'],'remoteTimeoutsMs':[p['maxIdleTimeoutMs']for a in analyses for p in a['transportParameters']if p['owner']=='remote'],'postSetupPingSeconds':idle,'postSetupPingIntervalsSeconds':[b-a for a,b in zip(idle,idle[1:])],'sdkErrorCount':len(result['sdkErrors']),'appSendCount':len(result['appSends']),'preFinishTransportErrors':[{'domain':x.get('domain'),'code':x.get('code')}for x in result['transportErrors']if x['deviceUptimeSeconds']<finish],'shutdownTransportErrors':[{'domain':x.get('domain'),'code':x.get('code')}for x in result['transportErrors']if x['deviceUptimeSeconds']>=finish]})
(out/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
