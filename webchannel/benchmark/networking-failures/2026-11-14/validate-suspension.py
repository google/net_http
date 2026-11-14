"""Validate published T15 app/UI evidence; no device access."""
import ast
import hashlib
import json
from pathlib import Path
import re
import sys

root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parent
sensitive=re.compile(sys.argv[2]) if len(sys.argv)>2 else None
for file in root.rglob('*'):
 if not file.is_file() or file.name=='validation.json':continue
 text=file.read_text()
 if sensitive:assert not sensitive.search(text),file
 if file.suffix=='.json':json.loads(text)
 elif file.suffix=='.jsonl':
  for line in text.splitlines():json.loads(line)
 elif file.suffix=='.py':ast.parse(text)
checked=0
for sums in root.glob('t15-*/tool-sources/SHA256SUMS'):
 for line in sums.read_text().splitlines():
  digest,name=line.split('  ',1);assert hashlib.sha256((sums.parent/name).read_bytes()).hexdigest()==digest
  checked+=1
rows=json.loads((root/'suspension-analysis.json').read_text())['rows']
assert len(rows)==9
for condition,requested in (('short',30),('medium',90),('long',150)):
 group=[r for r in rows if r['condition']==condition]
 assert len(group)==3 and {r['run'] for r in group}=={1,2,3}
 assert len({r['controllerSHA256'] for r in group})==1
 for row in group:
  folder=root/row['folder'];result=json.loads((folder/'result.json').read_text())
  app=[json.loads(line) for line in (folder/'device-events.jsonl').read_text().splitlines()]
  ui=[json.loads(line) for line in (folder/'ui-events.jsonl').read_text().splitlines()]
  assert ui==result['uiEvents']
  assert all(r.get('run')==result['run'] for r in app)
  assert row['validOSHold'] and result['uiTestExitCode']==0
  assert row['observedSuspendedSeconds']>=requested and row['OSHoldStateValues']==[2]
  assert row['maxOSSampleGapSeconds']<=3 and row['samePIDAfterResume']
  assert row['autorunStartCount']==1 and row['openCount']==1 and row['cleanupError'] is None
  processes=json.loads((folder/'resumed-demo-process.json').read_text())['processes']
  assert len(processes)==1 and processes[0]['processIdentifier']==result['initialPID']
  for name,record in result['milestones'].items():
   assert record in (ui if name in ('suspensionStart','suspensionEnd') else app),(folder,name)
assert len({row['observerSHA256'] for row in rows})==1
(root/'validation.json').write_text(json.dumps({'validTrials':9,'conditions':{'30s':3,'90s':3,'150s':3},'measuredSourceFilesVerified':checked,'groupControllersIdentical':True,'observerIdenticalAcrossAllTrials':True,'stateEvidenceAndPIDVerified':True},indent=2)+'\n')
print('Verified nine OS-observed holds, source hashes, same-PID evidence and JSON/JSONL.')
