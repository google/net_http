"""Read-only reconstruction of POST resends from retained per-trial stdout."""
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
RUN = BASE / '2026-10-20_12-38_omnient-delay-sweep-100pairs-upstream_JST'
OUT = Path(__file__).resolve().parent
rows = []
for path in sorted(RUN.glob('delay-*/logs/omnient-*-on.log')):
    text = path.read_text()
    started = re.search(r'LENS_BATCH_TRIAL_STARTED (\{[^\n]+\})', text)
    identity = json.loads(started[1])
    opened = text.find('WebChannel opened on')
    closed = text.find('WebChannel closed on')
    seen = set()
    posts = []
    resends = []
    for match in re.finditer(r'\[HTTP Req\] \((\d+)\) \[attempt (\d+)\] POST ([^\n]+)', text):
        head = re.search(r'bytes = 0x([0-9a-f ]+) \.\.\.', match[3])
        assert head, path
        payload = re.search(r'count=(\d+)&ofs=(\d+)', bytes.fromhex(head[1]).decode())
        assert payload, path
        count, offset = map(int, payload.groups())
        ids = set(range(offset, offset + count))
        responses = [(m.start(), int(m[1])) for m in re.finditer(
            r'\[HTTP Resp Meta\] \(' + match[1] + r'\) \[attempt ' + match[2]
            + r'\] POST [^\n]+status: (\d+)', text)]
        post = dict(rid=match[1], attempt=int(match[2]), count=count, offset=offset,
                    requestLine=text.count('\n', 0, match.start()) + 1,
                    afterOpen=opened >= 0 and match.start() > opened,
                    beforeClose=closed >= 0 and match.start() < closed,
                    statuses=sorted(set(status for _, status in responses)),
                    http200BeforeClose=any(match.end() < pos < closed and status == 200
                                           for pos, status in responses))
        if seen & ids:
            resends.append(post)
        posts.append(post)
        seen |= ids
    result = re.search(r'LENS_BENCHMARK_RESULT omnient #1 fastHandshake2=true: (\w+)', text)
    assert result and closed >= 0
    row = dict(delayMs=int(path.parent.parent.name.removeprefix('delay-').removesuffix('ms')),
               pair=identity['batchPair'], ordinal=identity['batchTrialOrdinal'],
               batchId=identity['batchId'], processInstanceId=identity['processInstanceId'],
               sid=re.search(r'[?&]SID=([^&\s]+)', text)[1],
               status=result[1], opened=opened >= 0,
               anyPost400=any(400 in p['statuses'] for p in posts),
               fatalNoRetry='Not retrying due to error type.' in text,
               pendingTwoAtClose='Number of undelivered maps pending: 2, outgoing: 0' in text,
               log=str(path.relative_to(BASE)), sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
               posts=posts, resends=resends)
    rows.append(row)
assert len(rows) == 500
raced = [r for r in rows if r['anyPost400']]
resent = [r for r in raced if r['resends']]
failed = [r for r in raced if not r['resends']]
assert len(raced) == 115 and len(resent) == 62 and len(failed) == 53
assert all(r['status'] == 'completed' and r['opened'] for r in resent)
assert all(p['afterOpen'] and p['beforeClose'] and p['http200BeforeClose']
           for r in resent for p in r['resends'])
assert all(r['status'] == 'failed' and not r['opened'] and r['fatalNoRetry']
           for r in failed)
summary = dict(onTrials=len(rows), anyPost400=len(raced), resendSessions=len(resent),
               noResendPreOpenAbort=len(failed),
               sessionsWithCount2Offset0Resend=sum(any(p['count'] == 2 and p['offset'] == 0
                                                     for p in r['resends']) for r in resent),
               byDelay={str(d): dict(anyPost400=sum(r['anyPost400'] for r in rows if r['delayMs'] == d),
                                    resendSessions=sum(bool(r['resends']) for r in rows if r['delayMs'] == d),
                                    noResendPreOpenAbort=sum(r['status'] == 'failed' for r in rows if r['delayMs'] == d))
                        for d in (0, 50, 100, 150, 200)})
(OUT / 'resend-audit.json').write_text(json.dumps(dict(summary=summary, trials=rows), indent=2) + '\n')
print(json.dumps(summary, indent=2))
