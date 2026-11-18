#!/usr/bin/env python3
"""Summarize matched fixed-AP streaming handoffs; retain failures and UI effects."""
import argparse
from collections import Counter
import json
from pathlib import Path
from urllib.parse import parse_qs,urlsplit


def analyze(folder):
    result=json.loads((folder/'result.json').read_text())
    events=[json.loads(x)for x in(folder/'device-events.jsonl').read_text().splitlines()]
    expected=result.get('baselineExpectedProtocol')
    cell=result.get('milestones',{}).get('cellularPath')
    restored=result.get('milestones',{}).get('restoredPath')
    metrics=[t for e in events if e.get('kind')=='task_metrics'for t in e['transactions']]
    before=[t for e in events if e.get('kind')=='task_metrics'and (cell is None or e['deviceUptimeSeconds']<cell['deviceUptimeSeconds'])for t in e['transactions']]
    first_post=next((t for t in before if t.get('method')=='POST'and t.get('protocol')not in(None,'','unknown')),None)
    sids={sid for e in events if e.get('url')for sid in parse_qs(urlsplit(e['url']).query).get('SID',[])}
    stream,wire_ids,unparsed=[],[],0
    marker='[HTTP Resp Body] (rpc): '
    for event in events:
        if event.get('kind')!='http_log'or marker not in event.get('text',''):continue
        try:items=json.loads(event['text'].split(marker,1)[1])
        except ValueError:unparsed+=1;continue
        for item in items:
            if isinstance(item,list)and len(item)==2 and isinstance(item[0],int):
                wire_ids.append(item[0])
                if isinstance(item[1],dict)and item[1].get('message')=='network-failure stream':
                    stream.append({'arrayID':item[0],'deviceUptimeSeconds':event['deviceUptimeSeconds']})
    lifecycle=[e for e in events if e.get('kind')=='lifecycle']
    def active_at(t):
        notes=[e.get('notification')for e in lifecycle if e['deviceUptimeSeconds']<=t]
        return bool(notes)and notes[-1]=='UIApplicationDidBecomeActiveNotification'
    intervals=[]
    for a,b in zip(stream,stream[1:]):
        intervals.append({'fromArrayID':a['arrayID'],'toArrayID':b['arrayID'],
                          'fromUptime':a['deviceUptimeSeconds'],'toUptime':b['deviceUptimeSeconds'],
                          'seconds':b['deviceUptimeSeconds']-a['deviceUptimeSeconds'],
                          'entireIntervalReportedActive':active_at(a['deviceUptimeSeconds'])and not any(
                              a['deviceUptimeSeconds']<e['deviceUptimeSeconds']<=b['deviceUptimeSeconds']
                              and e.get('notification')!='UIApplicationDidBecomeActiveNotification'for e in lifecycle)})
    unique=sorted(set(wire_ids));active=[i['seconds']for i in intervals if i['entireIntervalReportedActive']]
    delta=lambda a,b:None if a is None or b is None else a['deviceUptimeSeconds']-b['deviceUptimeSeconds']
    return {'trial':folder.name,'expectedBaseline':expected,
            'finishedUTC':result.get('finishedUTC'),
            'positiveBaselinePOSTMatchesExpected':first_post is not None and first_post.get('protocol')==expected,
            'outcome':result['outcome'],'runnerError':result.get('error'),'SDKErrorCodes':result.get('errorCodes',[]),
            'openCount':result.get('openCount'),'uniqueSIDCount':len(sids),
            'endpoint':result.get('endpoint'),'traffic':result.get('traffic'),
            'protocolCounts':dict(Counter(t.get('protocol')or'unknown'for t in metrics)),
            'cellularMetricCounts':{str(value):sum(t.get('isCellular') is value for t in metrics)
                                    for value in (True,False,None)},
            'requestedHoldSeconds':result['requestedHoldSeconds'],
            'observedSecondsAtRestoreCue':result.get('observedSecondsAtRestoreCue'),
            'observedCellularPathSeconds':result.get('observedCellularPathSeconds'),
            'cellularPathToEchoSeconds':delta(result.get('milestones',{}).get('cellularEcho'),cell),
            'restoredPathToEchoSeconds':delta(result.get('milestones',{}).get('restoredEcho'),restored),
            'postRestoreProbeCount':result.get('postRestoreProbeCount'),
            'observedPostRestoreHostSeconds':result.get('observedPostRestoreHostSeconds'),
            'stream':{'parsedFrames':len(stream),'appDeliveredMessages':sum(e.get('kind')=='app_log'and'didReceiveMessage'in e.get('text','')and'network-failure stream'in e.get('text','')for e in events),
                      'maxLoggedIntervalSeconds':max((i['seconds']for i in intervals),default=None),
                      'maxEntirelyActiveIntervalSeconds':max(active,default=None),
                      'wireArrayIDMissingWithinParsedRange':[i for i in range(unique[0],unique[-1]+1)if i not in set(unique)]if unique else[],
                      'wireArrayIDDuplicates':len(wire_ids)-len(unique),'unparsedBodies':unparsed,
                      'frames':stream,'intervals':intervals},
            'lifecycleEvents':lifecycle,
            'packetAnalysis':json.loads((folder/'packet-analysis.json').read_text())if(folder/'packet-analysis.json').exists()else None}


def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('directory',type=Path);p.add_argument('--output',type=Path,required=True);args=p.parse_args()
    rows=[analyze(folder)for folder in sorted(args.directory.iterdir())if folder.is_dir()and(folder/'result.json').exists()and(folder/'device-events.jsonl').exists()]
    args.output.write_text(json.dumps({'rows':rows,'limits':[
        'Path-to-echo intervals include controller/probe timing and do not measure exact physical handoff time.',
        'Stream callback gaps include application backgrounding, scheduling and server behavior.',
        'Entirely active intervals are classified from lifecycle notifications; all intervals remain retained.',
        'Array-ID continuity covers only the parsed observation window; intentional termination truncates the scheduled stream.',
        'AP/band/operation are operator-reported; endpoints differ for h2 and h3.']},indent=2)+'\n')
    for r in rows:print(r['trial'],r['outcome'],r['protocolCounts'],'stream frames',r['stream']['parsedFrames'],'max logged gap',r['stream']['maxLoggedIntervalSeconds'])


if __name__=='__main__':main()
