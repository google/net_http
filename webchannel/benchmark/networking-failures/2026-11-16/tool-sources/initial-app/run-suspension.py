#!/usr/bin/env python3
"""Experimental T15 controller: normal USB launch + external XCUI state observer."""
import argparse
import importlib.util
import json
from pathlib import Path
import plistlib
import subprocess
import sys
import threading
import time
import uuid

spec = importlib.util.spec_from_file_location('network_failures', Path(__file__).with_name('run-network-failures.py'))
support = importlib.util.module_from_spec(spec)
spec.loader.exec_module(support)


def channel_terminal(records):
    return next((r for r in records if r.get('kind') == 'error'), None) or next(
        (r for r in records if r.get('kind') == 'closed'), None)


def resume_observation(records, after):
    """A channel error is a measurement outcome, never a missing-probe failure."""
    terminal = channel_terminal(records)
    if terminal:
        return {'observation': 'channel-failed', 'terminal': terminal}
    sent = next((r for r in records if r.get('kind') == 'echo_sent'
                 and r.get('message') == 'NETTEST_PROBE'
                 and r.get('hostReceivedMonotonic', -1) >= after), None)
    if sent:
        reply = next((r for r in records if r.get('kind') == 'echo_reply'
                      and r.get('token') == sent['token']
                      and r.get('hostReceivedMonotonic', -1) >= sent['hostReceivedMonotonic']), None)
        if reply:
            return {'observation': 'echo-resumed', 'reply': reply}
    return None


def validate_suspension(records, requested):
    starts = [r for r in records if r['event'] == 'suspension_hold_started']
    ends = [r for r in records if r['event'] == 'suspension_hold_complete']
    if len(starts) != 1 or len(ends) != 1:
        raise RuntimeError('Expected exactly one OS suspension hold')
    samples = [r for r in records if r['event'].startswith('suspension_hold_')]
    if len(samples) < 3 or any(r['applicationState'] != 2 for r in samples):
        raise RuntimeError('Hold lacks OS-reported suspended-state samples')
    duration = ends[0]['deviceUptimeSeconds'] - starts[0]['deviceUptimeSeconds']
    gaps = [b['deviceUptimeSeconds'] - a['deviceUptimeSeconds'] for a, b in zip(samples, samples[1:])]
    if duration < requested or any(gap < 0 or gap > 3 for gap in gaps):
        raise RuntimeError('Short hold, regressed clock or excessive observer sample gap')
    return starts[0], ends[0], duration, max(gaps)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--device', required=True, help='Hardware UDID (also used as xcodebuild destination)')
    parser.add_argument('--xctestrun', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--hold', type=float, default=30)
    args = parser.parse_args()
    if not 0 < args.hold <= 300:
        parser.error('--hold must be finite and in (0, 300]')
    folder = args.output.resolve()
    folder.mkdir(parents=True, exist_ok=False)
    run = 'T15-' + uuid.uuid4().hex[:12]
    result = {'run': run, 'scenario': 'T15-idle-suspension', 'requestedSuspendSeconds': args.hold,
              'outcome': 'interrupted', 'milestones': {}, 'notes': [
                  'UI observer reports OS state asynchronously; observed state brackets are not exact kernel timestamps.',
                  'Application and UI observer both record device system uptime; host/device UTC is not subtracted.',
                  'No force-suspend, debugger pause, network condition, or UI-test app launch is used.']}
    app = ui = thread = None
    ui_records = []
    start = None
    config_path = None

    def command(parts, name):
        with (folder / (name + '.log')).open('w') as log:
            subprocess.run(['xcrun', 'devicectl', *parts], check=True, timeout=30,
                           stdout=log, stderr=subprocess.STDOUT)

    def notify(action):
        command(['device', 'notification', 'post', '--device', args.device,
                 '--name', 'com.pmodular.webchannel.nettest.' + action], action)

    def wired(name):
        path = folder / (name + '.json')
        command(['device', 'info', 'details', '--device', args.device, '--json-output', str(path)], name)
        c = json.loads(path.read_text())['result']['connectionProperties']
        if c.get('transportType') != 'wired' or c.get('tunnelState') != 'connected':
            raise RuntimeError('Connected wired devicectl transport required')

    def read_ui():
        with (folder / 'ui-console.log').open('w', buffering=1) as raw, \
                (folder / 'ui-events.jsonl').open('w', buffering=1) as events:
            for line in ui.stdout:
                raw.write(line)
                if 'SUSPENSION_PROBE ' not in line:
                    continue
                try:
                    record = json.loads(line.split('SUSPENSION_PROBE ', 1)[1])
                except ValueError:
                    continue
                record['hostReceivedMonotonic'] = time.monotonic()
                record['hostReceivedUTC'] = support.utc()
                ui_records.append(record)
                events.write(json.dumps(record) + '\n')
                print('OS observer: ' + record['event'] + ' ' + record.get('stateName', str(record['applicationState'])), flush=True)

    try:
        wired('device-before')
        env = {'NETTEST_AUTORUN': '1', 'NETTEST_RUN': run, 'NETTEST_TRAFFIC': 'idle', 'NETTEST_FAILFAST': '0'}
        app = support.Capture(['xcrun', 'devicectl', 'device', 'process', 'launch', '--device', args.device,
                               '--terminate-existing', '--console', '--environment-variables', json.dumps(env),
                               'com.pmodular.webchannel.demo'], folder / 'device-console.log')
        start = app.wait_for(lambda r: r.get('kind') == 'autorun_start', 30)
        app.wait_for(lambda r: r.get('kind') == 'open', 60)
        app.wait_for(lambda r: r.get('kind') == 'heartbeat' and r.get('applicationState') == 0, 15)
        result['milestones']['initialOpen'] = next(r for r in app.snapshot() if r.get('kind') == 'open')
        result['initialPID'] = start['pid']
        template = args.xctestrun.resolve()
        config = plistlib.loads(template.read_bytes())
        target = config['NetworkFailureUITests']
        target.setdefault('EnvironmentVariables', {}).update(
            SUSPENSION_HOLD_SECONDS=str(args.hold), SUSPENSION_KEEP_APP='1')
        # Keep __TESTROOT__ expansion relative to the original build products.
        config_path = template.with_name('T15-' + run + '.xctestrun')
        config_path.write_bytes(plistlib.dumps(config))
        ui = subprocess.Popen(['xcodebuild', '-xctestrun', str(config_path), '-destination',
            'platform=iOS,id=' + args.device, '-destination-timeout', '20', '-parallel-testing-enabled', 'NO',
            '-resultBundlePath', str(folder / 'observer.xcresult'), '-only-testing:NetworkFailureUITests/SuspensionProbeTests/testOSReportedSuspensionAndResume',
            'test-without-building'], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
        thread = threading.Thread(target=read_ui, daemon=True)
        thread.start()
        probed = False
        deadline = time.monotonic() + args.hold + 150
        while ui.poll() is None and time.monotonic() < deadline:
            if not probed and any(r['event'] == 'foreground_after_resume' for r in ui_records):
                after = time.monotonic()
                observation = resume_observation(app.snapshot(), after)
                if observation is None:
                    notify('probe')
                    probe_deadline = time.monotonic() + 35
                    while time.monotonic() < probe_deadline:
                        observation = resume_observation(app.snapshot(), after)
                        if observation:
                            break
                        if app.process.poll() is not None:
                            raise RuntimeError('App console disconnected during resume observation')
                        time.sleep(.05)
                observation = observation or {'observation': 'no-recovery-observed'}
                result['channelObservation'] = observation['observation']
                if 'reply' in observation:
                    result['milestones']['resumedEcho'] = observation['reply']
                if 'terminal' in observation:
                    result['milestones']['channelTerminal'] = observation['terminal']
                pid_path = folder / 'resumed-processes.json'
                command(['device', 'info', 'processes', '--device', args.device, '--json-output', str(pid_path)], 'resumed-processes')
                result['samePIDAfterResume'] = any(p['processIdentifier'] == start['pid']
                    for p in json.loads(pid_path.read_text())['result']['runningProcesses'])
                probed = True
            time.sleep(.1)
        if ui.poll() is None:
            raise RuntimeError('UI observer timed out')
        thread.join(timeout=5)
        result['uiTestExitCode'] = ui.returncode
        if ui.returncode != 0:
            raise RuntimeError('UI observer failed; no verified T15 result')
        hold_start, hold_end, duration, max_gap = validate_suspension(ui_records, args.hold)
        result['observedSuspendedSeconds'] = duration
        result['maxOSObserverSampleGapSeconds'] = max_gap
        result['milestones']['suspensionStart'] = hold_start
        result['milestones']['suspensionEnd'] = hold_end
        if not probed or not result.get('samePIDAfterResume'):
            raise RuntimeError('Resume was not observed in the original process')
        final_terminal = channel_terminal(app.snapshot())
        if final_terminal:
            result['milestones']['channelTerminal'] = final_terminal
            if result['channelObservation'] == 'echo-resumed':
                result['channelObservation'] = 'echo-resumed-then-channel-failed'
            foreground = next(r for r in ui_records if r['event'] == 'foreground_after_resume')
            result['terminalRelativeForegroundSeconds'] = final_terminal['deviceUptimeSeconds'] - foreground['deviceUptimeSeconds']
            result['terminalRelativeSuspensionStartSeconds'] = final_terminal['deviceUptimeSeconds'] - hold_start['deviceUptimeSeconds']
        wired('device-after')
        result['outcome'] = 'suspension-observed'
    except (Exception, KeyboardInterrupt) as error:
        result['error'] = str(error) or type(error).__name__
        print('Interrupted: ' + result['error'], file=sys.stderr)
    finally:
        if ui is not None and ui.poll() is None:
            ui.terminate()
            try:
                ui.wait(timeout=15)
            except subprocess.TimeoutExpired:
                ui.kill()
                ui.wait(timeout=5)
        if thread:
            thread.join(timeout=5)
        if app:
            try:
                if app.process.poll() is None:
                    notify('close')
                    time.sleep(1)
                    if start:
                        command(['device', 'process', 'terminate', '--device', args.device,
                                 '--pid', str(start['pid'])], 'terminate')
                    app.process.wait(timeout=5)
            except Exception as error:
                result['cleanupError'] = str(error)
                if app.process.poll() is None:
                    app.process.terminate()
                    app.process.wait(timeout=10)
            app.thread.join(timeout=5)
            records = app.snapshot()
            (folder / 'device-events.jsonl').write_text(''.join(json.dumps(r) + '\n' for r in records))
            result['errorCodes'] = sorted({r['code'] for r in records if r.get('kind') == 'error'})
            result['openCount'] = sum(r.get('kind') == 'open' for r in records)
            result['autorunStartCount'] = sum(r.get('kind') == 'autorun_start' for r in records)
            result['taskMetrics'] = [r for r in records if r.get('kind') == 'task_metrics']
        result['uiEvents'] = ui_records
        result['finishedUTC'] = support.utc()
        (folder / 'result.json').write_text(json.dumps(result, indent=2) + '\n')
        if config_path:
            config_path.unlink(missing_ok=True)
    print('Result: ' + str(folder / 'result.json'), flush=True)
    return 0 if result['outcome'] == 'suspension-observed' else 1


if __name__ == '__main__':
    sys.exit(main())
