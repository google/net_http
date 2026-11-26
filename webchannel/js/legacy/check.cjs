// Compare the maintained Closure build with the archived original API,
// then reuse the wire/event scenarios with the maintained build.
const {spawnSync} = require('node:child_process');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const candidateFile = path.join(root, 'dist/webchannel_blob_es2022.js');
const reference = require(path.join(root, 'test/fixtures/webchannel_blob_original.js'));
const candidate = require(candidateFile);
assert.deepEqual(Object.keys(candidate).sort(), Object.keys(reference).sort());
for (const key of ['Event', 'Stat', 'EventType', 'ErrorCode']) {
  assert.deepEqual(JSON.parse(JSON.stringify(candidate[key])),
    JSON.parse(JSON.stringify(reference[key])));
}
assert.deepEqual(Object.keys(candidate.WebChannel).sort(), Object.keys(reference.WebChannel).sort());
for (const key of Object.keys(reference.WebChannel)) {
  assert.equal(typeof candidate.WebChannel[key], typeof reference.WebChannel[key]);
  if (typeof reference.WebChannel[key] !== 'function') {
    assert.deepEqual(candidate.WebChannel[key], reference.WebChannel[key]);
  }
}
for (const key of ['State', 'FailureCondition']) {
  assert.deepEqual(candidate.WebChannel.FailureRecovery[key], reference.WebChannel.FailureRecovery[key]);
}
console.log('Exported names and constant values match the archived original bundle.');
const result = spawnSync(process.execPath, [
  '--test', 'test/compatibility.test.cjs', 'test/fetch.test.cjs', 'test/disposal.test.cjs',
], {
  cwd: root, stdio: 'inherit',
  env: {...process.env, WEBCHANNEL_REFERENCE_BUNDLE: candidateFile},
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
