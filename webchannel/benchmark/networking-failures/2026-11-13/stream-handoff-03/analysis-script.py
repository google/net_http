import json,re,sys
from pathlib import Path
label=sys.argv[1]
root=Path(__file__).resolve().parent.parent;p=root/('stream-handoff-'+label)
r=json.loads((p/'result.json').read_text());e=[json.loads(s) for s in (p/'device-events.jsonl').read_text().splitlines()]
wire=[];stream=[];unparsed=0
for x in e:
 text=x.get('text','')
 if x.get('kind')!='http_log' or '[HTTP Resp Body] (rpc): ' not in text:continue
 try:items=json.loads(text.split('[HTTP Resp Body] (rpc): ',1)[1])
 except ValueError:unparsed+=1;continue
 for item in items:
  if isinstance(item,list) and len(item)==2 and isinstance(item[0],int):
   wire.append(item[0])
   if isinstance(item[1],dict) and item[1].get('message')=='network-failure stream':stream.append({'arrayId':item[0],'deviceUptimeSeconds':x['deviceUptimeSeconds']})
unique=sorted(set(wire));gaps=sorted(set(range(unique[0],unique[-1]+1))-set(unique)) if unique else []
intervals=[{'fromArrayId':a['arrayId'],'toArrayId':b['arrayId'],'fromUptime':a['deviceUptimeSeconds'],'toUptime':b['deviceUptimeSeconds'],'intervalSeconds':b['deviceUptimeSeconds']-a['deviceUptimeSeconds']} for a,b in zip(stream,stream[1:])]
metrics=[t for m in r['taskMetrics'] for t in m['transactions']];restored=r['milestones']['restoredPath']['deviceUptimeSeconds'];probes=[]
for sent in e:
 if sent.get('kind')!='echo_sent' or sent.get('message')!='NETTEST_PROBE':continue
 reply=next((x for x in e if x.get('kind')=='echo_reply' and x.get('token')==sent['token']),None)
 req=next((x for x in e if x.get('kind')=='http_log' and '[HTTP Req]' in x.get('text','') and '] POST ' in x['text'] and x['deviceUptimeSeconds']>=sent['deviceUptimeSeconds']),None)
 if not req:continue
 rid=re.search(r'\[HTTP Req\] \(([^)]+)\)',req['text'])[1];ts=[t for t in metrics if t['rid']==rid and t['method']=='POST'];assert len(ts)==1
 probes.append({'rid':rid,'secondsAfterReadyWifi':req['deviceUptimeSeconds']-restored,'isCellular':ts[0]['isCellular'],'reusedConnection':ts[0]['reusedConnection'],'protocol':ts[0]['protocol'],'echoRTTms':1000*(reply['deviceUptimeSeconds']-sent['deviceUptimeSeconds']) if reply else None})
paths=[{'secondsAfterReadyWifi':x['deviceUptimeSeconds']-restored,**{k:x.get(k) for k in ('status','wifi','cellular','expensive')}} for x in e if x.get('kind')=='path']
a={'trial':int(label),'traffic':'streaming','outcome':r['outcome'],'errorCodes':r['errorCodes'],'openCount':r['openCount'],
   'wireStreamFrames':len(stream),'appDeliveredStreamMessages':sum(x.get('kind')=='app_log' and 'didReceiveMessage' in x.get('text','') and 'network-failure stream' in x.get('text','') for x in e),
   'wireArrayIdGaps':gaps,'duplicateWireArrayIds':len(wire)-len(unique),'unparsedBackchannelBodyRecords':unparsed,
   'largestLoggedStreamIntervals':sorted(intervals,key=lambda x:x['intervalSeconds'],reverse=True)[:5],
   'probeTransactions':probes,'pathTimeline':paths,'observedPostRestoreHostSeconds':r['observedPostRestoreHostSeconds'],'extraProbeCount':r['postRestoreProbeCount'],'operatorNote':r.get('operatorNote')}
(p/'analysis.json').write_text(json.dumps(a,indent=2)+'\n');(p/'stream-intervals.json').write_text(json.dumps(intervals,indent=2)+'\n');(p/'transport-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n')
lines=[f'# Streaming handoff run {int(label)}, 2026-11-13','',
       f"Outcome {r['outcome']}; channel errors {r['errorCodes']}; opens {r['openCount']}.",
       f"Wire stream frames {len(stream)}; app deliveries {a['appDeliveredStreamMessages']}.",
       f"Wire-array-ID gaps {gaps}; duplicate IDs {a['duplicateWireArrayIds']}; unparsed body records {unparsed}.",
       f"Largest logged stream interval {max((x['intervalSeconds'] for x in intervals),default=0):.3f} s.",'',
       '| Probe RID | Request after ready Wi-Fi (s) | isCellular | reusedConnection | Protocol |',
       '| --- | ---: | --- | --- | --- |']
for x in probes:lines.append(f"| {x['rid']} | {x['secondsAfterReadyWifi']:.3f} | {x['isCellular']} | {x['reusedConnection']} | {x['protocol']} |")
lines+=['','Negative times are baseline/cellular-stage probes. Exact RID joins to task',
        'metrics were unique. A mixed Wi-Fi/cellular default path suppresses later',
        'periodic probes because the runner requires a Wi-Fi-only path for them.',
        'Passive streaming continues; this limits claims about later forward traffic.',
        'See analysis.json for the complete path timeline and retained transactions.','',
        'Device receipt intervals include server/device scheduling and are not',
        'physical outage durations. Default-path flags are not per-request interface',
        'assignments. No packet capture, underlying NSError trace or operator-error',
        'cause is established. Raw lifecycle/console/structured logs and measured',
        'runner snapshots remain available. Identifying device snapshots/command logs',
        'are omitted, and names/IDs use TEST_DEVICE placeholders. Network/session',
        'measurements remain. This analyzer is preserved as analysis-script.py.','',
        f'Original output: `/private/tmp/net-http-stream-handoff-20261113-{label}`.','']
(p/'summary.md').write_text('\n'.join(lines));(p/'analysis-script.py').write_bytes(Path(__file__).read_bytes())
rows=[]
for folder in sorted(root.glob('stream-handoff-[0-9][0-9]')):
 x=json.loads((folder/'analysis.json').read_text());post=[t for t in x['probeTransactions'] if t['secondsAfterReadyWifi']>0]
 mixed=next((t['secondsAfterReadyWifi'] for t in x['pathTimeline'] if t['secondsAfterReadyWifi']>=0 and t['wifi'] and t['cellular']),None)
 rows.append({'trial':x['trial'],'streamFrames':x['wireStreamFrames'],'delivered':x['appDeliveredStreamMessages'],'maxLoggedIntervalSeconds':max((v['intervalSeconds'] for v in x['largestLoggedStreamIntervals']),default=0),
              'gaps':x['wireArrayIdGaps'],'duplicates':x['duplicateWireArrayIds'],'errorCodes':x['errorCodes'],
              'postRestoreProbeCount':len(post),'cellularPostRestoreProbes':sum(t['isCellular'] for t in post),'firstMixedPathAfterReadySeconds':mixed})
(root/'stream-handoff-analysis.json').write_text(json.dumps({'validTrials':len(rows),'rows':rows},indent=2)+'\n')
s=['# Streaming handoff observations, 2026-11-13','',f'{len(rows)} valid trials of this variant; three repetitions are required.','',
   'Same requested settings: 1 s server messages, 15 s cellular hold, 30 s extra',
   'post-restoration observation with probes roughly every 5 s while the observed',
   'path remains Wi-Fi-only. No manual Cellular-button action is requested.','',
   '| Run | Stream frames / delivered | Largest logged interval (s) | Array-ID gaps / duplicates | Channel errors | Cellular / post-restore probes | First mixed path after ready Wi-Fi (s) |',
   '| --- | --- | ---: | --- | --- | --- | ---: |']
for x in rows:
 mixed=f"{x['firstMixedPathAfterReadySeconds']:.3f}" if x['firstMixedPathAfterReadySeconds'] is not None else 'none'
 s.append(f"| [{x['trial']}](stream-handoff-{x['trial']:02d}/summary.md) | {x['streamFrames']} / {x['delivered']} | {x['maxLoggedIntervalSeconds']:.3f} | {x['gaps']} / {x['duplicates']} | {x['errorCodes']} | {x['cellularPostRestoreProbes']} / {x['postRestoreProbeCount']} | {mixed} |")
s+=['','Receipt intervals are observed stream delivery, not exact physical outage',
    'times. Per-request task metrics and default-path callbacks remain separate.',
    'Mixed path means both uses-interface flags are true, not proof of a failed',
    'Wi-Fi operation. After such updates, the strict probe predicate suppresses',
    'further probes; passive observation continues. Probe counts can differ even',
    'with identical requested settings. Raw logs, source snapshots and operator',
    'reports are retained in each run directory. See handoff-operator-note.md for',
    'the earlier operator confirmation. No operator-error cause is established.','']
(root/'stream-handoff-summary.md').write_text('\n'.join(s))
print(json.dumps(rows[-1],indent=2));print('post probes',json.dumps(probes,indent=2))
