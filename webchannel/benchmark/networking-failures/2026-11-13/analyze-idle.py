import hashlib,json,re,statistics
from pathlib import Path

def analyze(p):
 r=json.loads((p/'result.json').read_text())
 e=[json.loads(x) for x in (p/'device-events.jsonl').read_text().splitlines()]
 close=next((x['deviceUptimeSeconds'] for x in e if x.get('kind')=='control' and x.get('action','').endswith('.close')),float('inf'))
 starts=[];noops=[];handshakes=[];wire=[];unparsed=0
 for x in e:
  if x['deviceUptimeSeconds']>=close or x.get('kind')!='http_log':continue
  text=x.get('text','')
  if '[HTTP Req] (rpc)' in text:starts.append({'deviceUptimeSeconds':x['deviceUptimeSeconds'],'attempt':int(re.search(r'\[attempt (\d+)\]',text)[1])})
  if '[HTTP Resp Body]' not in text:continue
  try:arrays=json.loads(text.split(': ',1)[1])
  except (ValueError,IndexError):unparsed+=1;continue
  for item in arrays:
   if not isinstance(item,list) or len(item)!=2:continue
   if isinstance(item[1],list) and item[1] and item[1][0]=='c':handshakes.append(item[1])
   if '[HTTP Resp Body] (rpc)' in text and isinstance(item[0],int):wire.append(item[0])
   if item[1]==['noop']:noops.append({'arrayId':item[0],'getIndex':len(starts),'deviceUptimeSeconds':x['deviceUptimeSeconds']})
 assert len(handshakes)==1 and len(handshakes[0])>5
 within=[b['deviceUptimeSeconds']-a['deviceUptimeSeconds'] for a,b in zip(noops,noops[1:]) if a['getIndex']==b['getIndex']]
 rotations=[b['deviceUptimeSeconds']-a['deviceUptimeSeconds'] for a,b in zip(starts,starts[1:])]
 unique=sorted(set(wire));metrics=[t for m in r['taskMetrics'] for t in m['transactions']]
 a={'trial':int(p.name[-2:]),'observedIdleSeconds':r['observedIdleSeconds'],'handshakeKeepAliveMs':handshakes[0][5],
    'getStarts':starts,'getStartIntervalsSeconds':rotations,'noops':noops,
    'allNoopIntervalsSeconds':[b['deviceUptimeSeconds']-a['deviceUptimeSeconds'] for a,b in zip(noops,noops[1:])],
    'withinGetNoopIntervalsSeconds':within,'withinGetNoopMedianSeconds':statistics.median(within) if within else None,
    'errorCodes':r['errorCodes'],'openCount':r['openCount'],'applicationSendEvents':sum(x.get('kind')=='echo_sent' for x in e),
    'wireArrayIdGaps':sorted(set(range(unique[0],unique[-1]+1))-set(unique)) if unique else [],'duplicateWireArrayIds':len(wire)-len(unique),'unparsedBodyRecords':unparsed,
    'metricTransactionCount':len(metrics),'cellularTransactions':sum(t['isCellular'] for t in metrics),'protocols':sorted({t['protocol'] for t in metrics}),
    'pathUpdates':[{k:x.get(k) for k in ('deviceUptimeSeconds','status','wifi','cellular','expensive')} for x in e if x.get('kind')=='path'],
    'cleanupError':r.get('cleanupError'),'runnerSHA256':hashlib.sha256((p/'tool-sources/run-handoff.py').read_bytes()).hexdigest()}
 (p/'analysis.json').write_text(json.dumps(a,indent=2)+'\n');(p/'transport-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n')
 return a

def main(root):
 rows=[analyze(p) for p in sorted(root.glob('idle-[0-9][0-9]'))]
 assert all(r['runnerSHA256']==rows[0]['runnerSHA256'] for r in rows)
 (root/'idle-analysis.json').write_text(json.dumps({'independentSessions':len(rows),'rows':rows},indent=2)+'\n')
 lines=['# M1: undisturbed idle baseline, 2026-11-13','',f'{len(rows)} independent fresh-process/session observations, 180 s requested each.',
        'Physical iPhone, USB logging, failFast off. No app probes, streaming, pending',
        'writes or fault injection. Channels are closed and apps terminated normally',
        'after each observation. Runner snapshots have identical SHA-256 hashes.','',
        '| Session | Device duration (s) | K (ms) | Within-GET noop intervals (s) | GET start intervals (s) | Cellular / transactions |',
        '| --- | ---: | ---: | --- | --- | --- |']
 for a in rows:
  noop=', '.join(f'{x:.3f}' for x in a['withinGetNoopIntervalsSeconds']);rotation=', '.join(f'{x:.3f}' for x in a['getStartIntervalsSeconds'])
  lines.append(f"| [{a['trial']}](idle-{a['trial']:02d}/result.json) | {a['observedIdleSeconds']:.3f} | {a['handshakeKeepAliveMs']} | {noop} | {rotation} | {a['cellularTransactions']} / {a['metricTransactionCount']} |")
 lines+=['','Every session\'s detailed analysis preserves channel errors, app-send count,',
         'request attempt numbers, path updates, parsed array-ID continuity and task',
         'metrics. See idle-analysis.json and each analysis.json for exact values.','',
         'A new GET can receive an immediate noop soon after the previous GET\'s last',
         'noop. Global intervals therefore include short gaps and are not blindly',
         'averaged as a keep-alive period. Within-GET intervals associate each noop',
         'with the most recently logged GET start; raw event order is retained.','',
         'GET start intervals are logged rotations, not watchdog timeouts. Incoming',
         'noops refresh the nominal 45 s watchdog, so roughly 60 s rotation intervals',
         'do not independently measure or disprove that timeout. Exact intervals',
         'slightly above the spec\'s approximate 45–60 s range are reported unchanged.',
         'Device uptime determines intervals; no host/device UTC subtraction or',
         'physical packet timing is claimed. Passive idle observations do not test',
         'failure recovery or establish exact server-side timing.','',
         'Raw console/structured events, runner journal, task metrics and measured',
         'runner snapshots are retained per session. Identifying device snapshots/',
         'command logs are omitted; names/IDs use TEST_DEVICE placeholders.',
         'Originals remain locally under `/private/tmp/net-http-idle-20261113-0N`.','',
         '[Machine-readable aggregate](idle-analysis.json). This analysis script is',
         'preserved as analyze-idle.py in this directory.','']
 (root/'idle-summary.md').write_text('\n'.join(lines))
 print(json.dumps([{k:a[k] for k in ('trial','observedIdleSeconds','handshakeKeepAliveMs','withinGetNoopMedianSeconds','getStartIntervalsSeconds','errorCodes','applicationSendEvents','cellularTransactions')} for a in rows],indent=2))

if __name__=='__main__':
 import sys
 root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).parent
 main(root)
