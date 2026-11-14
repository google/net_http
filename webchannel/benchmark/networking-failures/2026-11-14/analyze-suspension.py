"""Reproduce suspension analyses from retained app/UI evidence; no device operations."""
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent

def analyze(folder):
 r=json.loads((folder/'result.json').read_text());ui=r['uiEvents'];e=[json.loads(s) for s in (folder/'device-events.jsonl').read_text().splitlines()]
 event=lambda name:next((x for x in ui if x['event']==name),None)
 start=event('suspension_hold_started');end=event('suspension_hold_complete');fore=event('foreground_after_resume');home=event('home_returned')
 samples=[x for x in ui if x['event'].startswith('suspension_hold_')]
 gaps=[b['deviceUptimeSeconds']-a['deviceUptimeSeconds'] for a,b in zip(samples,samples[1:])]
 states=sorted({x['applicationState'] for x in samples})
 reply=r['milestones'].get('resumedEcho')
 terminal=next((x for x in e if x.get('kind')=='error'),None)
 observation=r.get('channelObservation') or ('echo-resumed' if reply and not r['errorCodes'] else 'unclassified')
 a={'condition':folder.name.rsplit('-',1)[0].replace('t15-',''),'run':int(folder.name[-2:]),'folder':folder.name,
    'requestedSuspendedSeconds':r['requestedSuspendSeconds'],'controllerOutcome':r['outcome'],'channelObservation':observation,
    'observedSuspendedSeconds':end['deviceUptimeSeconds']-start['deviceUptimeSeconds'] if start and end else None,
    'homeReturnToSuspendObservationSeconds':start['deviceUptimeSeconds']-home['deviceUptimeSeconds'] if start and home else None,
    'foregroundObservationToEchoSeconds':reply['deviceUptimeSeconds']-fore['deviceUptimeSeconds'] if reply and fore else None,
    'terminalRelativeForegroundSeconds':terminal['deviceUptimeSeconds']-fore['deviceUptimeSeconds'] if terminal and fore else None,
    'samePIDAfterResume':r.get('samePIDAfterResume'),'autorunStartCount':r.get('autorunStartCount'),'openCount':r['openCount'],'errorCodes':r['errorCodes'],
    'HTTPFailureStatuses':sorted({x['status'] for x in e if x.get('kind')=='http_state' and x.get('status') not in (0,200)}),
    'uniqueSIDCount':len({s for x in e for s in re.findall(r'[?&]SID=([^&\s]+)',x.get('text',''))}),
    'OSHoldSamples':len(samples),'OSHoldStateValues':states,'maxOSSampleGapSeconds':max(gaps) if gaps else None,
    'uiTestExitCode':r.get('uiTestExitCode'),'cleanupError':r.get('cleanupError'),
    'controllerSHA256':hashlib.sha256((folder/'tool-sources/run-suspension.py').read_bytes()).hexdigest(),
    'observerSHA256':hashlib.sha256((folder/'tool-sources/SuspensionProbeTests.swift').read_bytes()).hexdigest()}
 valid=(r['outcome']=='suspension-observed' and r.get('uiTestExitCode')==0 and a['samePIDAfterResume'] and states==[2] and a['observedSuspendedSeconds']>=a['requestedSuspendedSeconds'] and max(gaps)<=3 and min(gaps)>=0)
 a['validOSHold']=bool(valid)
 (folder/'analysis.json').write_text(json.dumps(a,indent=2)+'\n')
 return a

def summarize():
 rows=[analyze(p) for p in sorted(ROOT.glob('t15-*-0[123]')) if (p/'result.json').exists()]
 (ROOT/'suspension-analysis.json').write_text(json.dumps({'rows':rows},indent=2)+'\n')
 lines=['# T15: OS-observed suspension measurements — 2026-11-14','',
        f"{sum(x['validOSHold'] for x in rows)} valid OS-hold observations recorded so far; target is three each at 30 / 90 / 150 s.",
        'Method-validation probes are separate from these networking measurements.', '',
        '| Condition | Run | OS-observed hold (s) | Home → suspend observation (s) | Channel observation | SDK errors / HTTP failures | Same PID |',
        '| --- | --- | ---: | ---: | --- | --- | --- |']
 for x in sorted(rows,key=lambda r:(r['requestedSuspendedSeconds'],r['run'])):
  duration=f"{x['observedSuspendedSeconds']:.3f}" if x['observedSuspendedSeconds'] is not None else 'unverified'
  home=f"{x['homeReturnToSuspendObservationSeconds']:.3f}" if x['homeReturnToSuspendObservationSeconds'] is not None else 'unverified'
  lines.append(f"| {x['condition']} | [{x['run']}]({x['folder']}/result.json) | {duration} | {home} | {x['channelObservation']} | {x['errorCodes']} / {x['HTTPFailureStatuses']} | {x['samePIDAfterResume']} |")
 lines+=['','## Method','',
         'Physical iPhone, SDK/app networking code from PR #130, default failFast off.',
         'The app is normally launched with devicectl and USB console; the UI observer',
         'does not launch it. After channel open, the observer presses Home and waits',
         'for an explicit XCUIApplication.State.runningBackgroundSuspended report.',
         'It holds from that observation while checking state about once per second,',
         'then activates the existing app. The controller observes a matching echo,',
         'terminal channel failure or a bounded no-response window and checks PID.',
         'No network condition, forced suspension, debugger pause or app reconnect',
         'is used. Each run uses a fresh process/session; normal cleanup closes and',
         'terminates the app. Network settings are not changed.','',
         'OS observer and app both use device system uptime. The asynchronously',
         'reported state is not an exact kernel timestamp. State sampling does not',
         'prove no brief wakeups between samples. All retained valid holds have only',
         'suspended-state samples and no sampling gap greater than 3 s. Home/background',
         'waiting is reported separately from the requested suspension interval.',
         'UIApplication heartbeat raw state 2 means background; it is not the',
         'XCUIApplication suspended-state proof.','',
         'The first short controller required a resumed echo. All three attempted',
         'short trials completed with that echo. The longer-case revision accepts',
         'channel failure and no-recovery-observed as measurement outcomes, while',
         'UI/state/PID failures remain interrupted attempts. This version difference',
         'is explicit; measured controller/observer snapshots and hashes identify',
         'each run. The observer Swift source is shared across duration groups.',
         'A bounded no-response outcome is not proof that the channel can never recover.',
         'Raw logs retain request attempts and status; underlying NSError -1005 is',
         'not exposed by current SDK callbacks.','',
         '## Method-validation probes','',
         '- Probe 01: UI test launched the app; blocking Thread.sleep polling left',
         '  reported foreground state stale. Failed; original source was not captured.',
         '- Probe 02: XCTest waits allowed state updates; background was reported but',
         '  no suspension within 45 s while UI-test launched. Failed; source retained.',
         '- Probe 03: normal external no-network launch plus UI observer confirmed',
         '  suspended state and foreground return. Passed; source retained.',
         'These probes do not count as T15 networking repetitions or isolate all',
         'causes of differences between launch modes. Their sanitized logs and state',
         'records are under suspension-method-probe-01/02/03.','',
         'Apple definitions: [runningBackgroundSuspended](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication/state-swift.enum/runningbackgroundsuspended),',
         '[asynchronous state updates](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication/state-swift.property).','',
         '## Evidence and remaining work','',
         'Each run retains result/analysis JSON, app and UI state logs, a filtered demo',
         'process record, measured source snapshots and SHA-256 hashes. Full device',
         'snapshots, process lists, xcresults and diagnostic archives remain local.',
         'Identifiers/names/home paths are replaced with placeholders in published',
         'copies; PID, session/network values and observed times remain as evidence.',
         'Original outputs: `/private/tmp/net-http-t15-CASE-20261114-0N`.',
         'UI Runner build uses Apple automatic signing under the configured team;',
         'no third-party runtime is introduced. The normal demo scheme is unchanged.',
         'T13 (broken cellular during handoff) is still unexecuted. No new results',
         'have been pushed into PR #130 by this follow-up.','',
         '[Machine-readable aggregate](suspension-analysis.json).','']
 (ROOT/'suspension-summary.md').write_text('\n'.join(lines))
 print(json.dumps([{k:x[k] for k in ('condition','run','validOSHold','observedSuspendedSeconds','channelObservation','errorCodes','samePIDAfterResume')} for x in rows],indent=2))


if __name__ == '__main__':
    summarize()
