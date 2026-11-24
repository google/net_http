from pathlib import Path
import subprocess,json,time,re,statistics,math,datetime,shutil
root=Path('/private/tmp/net-http-ap-latency-20261124');root.mkdir(exist_ok=True);out=root/'NEC-B2-retry';out.mkdir(exist_ok=False);shutil.copy2(__file__,out/'measurement-source.py')
def utc():return datetime.datetime.now(datetime.timezone.utc).isoformat()
def status(phase,**extra):
 r={'phase':phase,'hostUTC':utc(),**extra};(out/'status.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r),flush=True)
def route(label):
 p=subprocess.run(['/sbin/route','-n','get','192.168.10.21'],capture_output=True,text=True,check=True);(out/(label+'.log')).write_text(p.stdout);assert re.search(r'interface:\s+en6\b',p.stdout),'Unexpected route'
route('route-before');(out/'environment.json').write_text(json.dumps({'trial':'B2','operatorReportedAP':'NEC Aterm WX3000HP2','operatorReportedMacWiring':'central Buffalo LSW5-GT-8EP/WH','operatorReportedIPhoneIPv4':'192.168.10.21','operatorReportedCellularData':'OFF','operatorReportedNLC':'OFF','iPhonePosition':'same experimental position; keep screen on','hostInterface':'en6','hostSourceIPv4':'192.168.10.17','hostWiFiObserved':'inactive','IPVersion':4,'ICMPPayloadBytes':56,'intervalSeconds':1,'warmupPackets':10,'measurementPackets':120},indent=2)+'\n')
def measure(label,count):
 args=['/sbin/ping','-n','-b','en6','-S','192.168.10.17','-c',str(count),'-i','1','192.168.10.21'];(out/(label+'-command.json')).write_text(json.dumps(args)+'\n');start=utc();t=time.monotonic();p=subprocess.run(args,capture_output=True,text=True,timeout=count+35);(out/(label+'.log')).write_text(p.stdout);(out/(label+'-stderr.log')).write_text(p.stderr);return p,start,time.monotonic()-t
try:
 status('warmup',packets=10);p,_,_=measure('warmup',10)
 if not re.search(r'icmp_seq=\d+.*time=',p.stdout):raise RuntimeError('No ping replies during warmup')
 status('measuring',packets=120,intervalSeconds=1);p,start,elapsed=measure('ping',120)
 if p.returncode not in (0,2):raise RuntimeError('ping exit '+str(p.returncode))
 samples=[];seen=set()
 for line in p.stdout.splitlines():
  m=re.search(r'icmp_seq=(\d+).*time=([0-9.]+)\s*ms',line)
  if m and int(m[1])not in seen:
   seen.add(int(m[1]));samples.append({'sequence':int(m[1]),'rttMs':float(m[2])})
 footer=re.search(r'(\d+) packets transmitted, (\d+) packets received, ([0-9.]+)% packet loss',p.stdout)
 if not footer or int(footer[1])!=120:raise RuntimeError('Missing/incomplete ping summary')
 values=sorted(x['rttMs']for x in samples);assert values
 result={'trial':'B2','ap':'NEC Aterm WX3000HP2 (operator reported)','measurementStartedUTC':start,'measurementFinishedUTC':utc(),'elapsedHostSeconds':elapsed,'transmitted':int(footer[1]),'received':int(footer[2]),'packetLossPercent':float(footer[3]),'uniqueReplySamples':len(values),'minMs':min(values),'meanMs':statistics.mean(values),'medianMs':statistics.median(values),'p95Ms':values[math.ceil(.95*len(values))-1],'maxMs':max(values),'stddevPopulationMs':statistics.pstdev(values),'p95Method':'nearest rank on unique received replies','samples':samples,'limits':['LAN ICMP RTT including iPhone response scheduling; not WebChannel latency.','AP reported by operator; SSID/BSSID and band are not automatically observed.','iPhone position, screen and traffic conditions require operator consistency.']};route('route-after');(out/'result.json').write_text(json.dumps(result,indent=2)+'\n');status('complete',**{k:v for k,v in result.items()if k in ['transmitted','received','packetLossPercent','medianMs','p95Ms','maxMs']})
except BaseException as e:status('stopped',error=repr(e));raise
