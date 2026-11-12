import csv,json,re
from pathlib import Path
root=Path(__file__).resolve().parent
rows=[];request_rows=[]
for label in ('02','03','04'):
 p=root/('human-handoff-'+label)
 r=json.loads((p/'result.json').read_text())
 events=[json.loads(s) for s in (p/'device-events.jsonl').read_text().splitlines()]
 journal=[json.loads(s) for s in (p/'runner-events.jsonl').read_text().splitlines()]
 cut=next(x for x in journal if x.get('event')=='cue' and x.get('phase')=='awaiting-cellular')
 restore=next(x for x in journal if x.get('event')=='cue' and x.get('phase')=='awaiting-wifi')
 cell=next(x for x in events if x.get('kind')=='path' and x.get('status')=='satisfied' and x.get('cellular') is True and x.get('wifi') is False and x['hostReceivedMonotonic']>=cut['hostMonotonic'])
 wifi=next(x for x in events if x.get('kind')=='path' and x.get('status')=='satisfied' and x.get('wifi') is True and x.get('cellular') is False and x['hostReceivedMonotonic']>=restore['hostMonotonic'])
 body=next(x for x in events if x.get('kind')=='http_log' and '[HTTP Resp Body] (rpc)' in x.get('text','') and x['deviceUptimeSeconds']>=cell['deviceUptimeSeconds'])
 metrics=[t for m in r['taskMetrics'] for t in m['transactions']]
 row={'trial':label,'firstCellPathUptime':cell['deviceUptimeSeconds'],'firstRestoredWifiPathUptime':wifi['deviceUptimeSeconds'],
      'unsatisfiedPathsBetweenCutCueAndCellular':sum(x.get('kind')=='path' and x.get('status')=='unsatisfied' and cut['hostMonotonic']<=x['hostReceivedMonotonic']<=cell['hostReceivedMonotonic'] for x in events),
      'firstCellularPathToNextLoggedBackchannelBodySeconds':body['deviceUptimeSeconds']-cell['deviceUptimeSeconds'],
      'channelErrors':r['errorCodes'],'openCount':r['openCount'],'probes':[]}
 for stage,name in (('baseline','baselineEcho'),('cellular','cellularEcho'),('restored-wifi','restoredEcho')):
  reply=r['milestones'][name]
  sent=next(x for x in events if x.get('kind')=='echo_sent' and x['token']==reply['token'])
  req=next(x for x in events if x.get('kind')=='http_log' and '[HTTP Req]' in x.get('text','') and '] POST ' in x['text'] and x['deviceUptimeSeconds']>=sent['deviceUptimeSeconds'])
  match=re.search(r'\[HTTP Req\] \(([^)]+)\) \[attempt (\d+)\]',req['text']);assert match
  rid=match[1]
  transactions=[t for t in metrics if t['rid']==rid and t['method']=='POST'];assert len(transactions)==1,(label,rid,transactions)
  t=transactions[0]
  probe={'trial':label,'stage':stage,'rid':rid,'attempt':int(match[2]),'protocol':t['protocol'],'isCellular':t['isCellular'],
         'reusedConnection':t['reusedConnection'],'localAddress':t.get('localAddress'),'localPort':t.get('localPort'),
         'remoteAddress':t.get('remoteAddress'),'remotePort':t.get('remotePort'),
         'echoRTTms':1000*(reply['deviceUptimeSeconds']-sent['deviceUptimeSeconds']),
         'requestStartUnix':t.get('requestStart'),
         'requestEventUptime':req['deviceUptimeSeconds'],
         'secondsAfterFirstRestoredWifiPath':req['deviceUptimeSeconds']-wifi['deviceUptimeSeconds'] if stage=='restored-wifi' else None}
  row['probes'].append(probe);request_rows.append(probe)
 # Only logs between the cut cue and completed cellular-stage echo, not all later traffic.
 cell_echo=r['milestones']['cellularEcho']['deviceUptimeSeconds']
 window=[x for x in events if x['hostReceivedMonotonic']>=cut['hostMonotonic'] and x['deviceUptimeSeconds']<=cell_echo]
 row['httpStatusZeroStateRecordsDuringWifiToCellular']=sum(x.get('kind')=='http_state' and x.get('status')==0 for x in window)
 row['getRequestAttemptsDuringWifiToCellular']=[int(m[1]) for x in window if x.get('kind')=='http_log' and (m:=re.search(r'\[HTTP Req\] \(rpc\) \[attempt (\d+)\] GET',x.get('text','')))]
 rows.append(row)
(root/'handoff-transport-analysis.json').write_text(json.dumps({'rows':rows,'method':'Match echo token to send event, next forward POST log, then exact RID to task transaction metrics.'},indent=2)+'\n')
with (root/'handoff-probe-transactions.csv').open('w',newline='') as f:
 writer=csv.DictWriter(f,fieldnames=list(request_rows[0]));writer.writeheader();writer.writerows(request_rows)
lines=['# T12 / T14 and M2 / M3 / M4: handoff log analysis','',
       'Analysis of existing human-handoff-02 / 03 / 04; no additional phone operation.',
       'These are the same three observations already reported, not new repetitions.','',
       '## T14 / M3: Wi-Fi restoration does not imply immediate use by each request','',
       'Each restored-stage probe is matched by its echo token to the app send event,',
       'then the next forward POST log, then that POST RID to exactly one completed',
       'URLSession transaction. All nine probe/RID joins were unique.','',
       '| Trial | Baseline isCellular | Cellular-stage isCellular | Restored-stage isCellular | Restored POST RID | Request after first Wi-Fi callback (s) | Reused connection |',
       '| --- | --- | --- | --- | --- | ---: | --- |']
for x in rows:
 probes=x['probes'];p=probes[2]
 lines.append(f"| {x['trial']} | {probes[0]['isCellular']} | {probes[1]['isCellular']} | {p['isCellular']} | {p['rid']} | {p['secondsAfterFirstRestoredWifiPath']:.3f} | {p['reusedConnection']} |")
lines+=['','In all three trials, restored-stage POST metrics report isCellular=true even',
        'though the preceding default-path callback reports Wi-Fi=true/cellular=false.',
        'Those restored-stage POSTs report reusedConnection=false. The observed data',
        'therefore do not justify attributing this behavior solely to reuse of an',
        'existing connection. Connection pools, socket binding or other causes have',
        'not been isolated. The trace ends shortly afterward, so it does not establish',
        'when later requests would move to Wi-Fi. The default-path and per-transaction',
        'values are reported separately; neither is rewritten to force agreement.','',
        '## T12 / M2: Wi-Fi to cellular','',
        '| Trial | Unsatisfied callbacks before cellular | First cellular path → next logged back-channel body (s) | Status-0 state records | New GET attempt numbers |',
        '| --- | ---: | ---: | ---: | --- |']
for x in rows:
 lines.append(f"| {x['trial']} | {x['unsatisfiedPathsBetweenCutCueAndCellular']} | {x['firstCellularPathToNextLoggedBackchannelBodySeconds']:.3f} | {x['httpStatusZeroStateRecordsDuringWifiToCellular']} | {x['getRequestAttemptsDuringWifiToCellular']} |")
lines+=['','No transient unsatisfied callback was logged in these three cut-to-cellular',
        'windows. Absence from a callback trace is not proof of no physical gap.',
        'The body intervals above are callback-to-next-logged-data observations, not',
        'exact handoff recovery time. The probes were sent after foreground readiness,',
        'and the idle stream has sparse traffic; neither probe RTT nor time since the',
        'previous baseline message measures the connectivity interruption itself.',
        'The new GET logs show attempt 1; underlying NSError -1005 is not exposed.',
        'Do not claim that the spec-predicted -1005 / attempt-2 sequence was verified.','',
        '## M4 and limits','',
        'All nine joined probe transactions report h2. All three channels opened once',
        'and had no error callbacks. Same-session continuation is established by the',
        'existing SID analysis; exact packet outage and complete T12 recovery timing',
        'remain unmeasured. M6 is not triggered by an observed h3 transaction here.',
        'No new test-case pass is assigned solely by this reanalysis.','',
        '[Detailed JSON](handoff-transport-analysis.json), [probe transaction CSV](handoff-probe-transactions.csv),',
        '[original three-trial summary](summary.md). Raw sources remain in the three',
        'trial directories. This analysis script is preserved as handoff-transport-analysis.py.','']
(root/'handoff-transport-summary.md').write_text('\n'.join(lines))
(root/'handoff-transport-analysis.py').write_bytes(Path(__file__).read_bytes())
print(json.dumps([{k:v for k,v in x.items() if k!='probes'} for x in rows],indent=2))
