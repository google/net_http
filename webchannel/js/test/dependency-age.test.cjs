const {test} = require('node:test');
const assert = require('node:assert/strict');

const now = Date.parse('2026-11-26T00:00:00Z');
const entry = {
  name: '@example/package', version: '1.0.0',
  resolved: 'https://registry.npmjs.org/@example/package/-/package-1.0.0.tgz',
  integrity: 'sha512-YWJj',
};
function metadata(age) {
  return {
    name: entry.name,
    time: {'1.0.0': new Date(now - age * 86_400_000).toISOString()},
    versions: {'1.0.0': {dist: {integrity: entry.integrity}}},
  };
}

test('a locked release is rejected until it reaches the configured age', async () => {
  const {releaseErrors} = await import('../scripts/check-dependency-age.mjs');
  assert.match(releaseErrors(entry, metadata(2), 14, now).join(), /requires 14 days/);
  assert.match(releaseErrors(entry, metadata(14 - 1 / 86_400_000), 14, now).join(), /requires 14 days/);
  assert.deepEqual(releaseErrors(entry, metadata(14), 14, now), []);
  assert.deepEqual(releaseErrors(entry, metadata(100), 14, now), []);
  assert.deepEqual(releaseErrors(entry, metadata(8), 7, now), []);
  assert.match(releaseErrors(entry, metadata(8), 14, now).join(), /requires 14 days/);
});

test('missing or future registry dates cannot bypass the release-age check', async () => {
  const {releaseErrors} = await import('../scripts/check-dependency-age.mjs');
  assert.match(releaseErrors(entry, {...metadata(100), time: {}}, 14, now).join(), /publication time/);
  assert.match(releaseErrors(entry, metadata(-1), 14, now).join(), /requires 14 days/);
});

test('lockfile integrity, registry location and identity must agree', async () => {
  const {releaseErrors} = await import('../scripts/check-dependency-age.mjs');
  assert.match(releaseErrors({...entry, resolved: 'https://example.test/package.tgz'}, metadata(100), 14, now).join(), /canonical npm registry/);
  assert.match(releaseErrors({...entry, integrity: undefined}, metadata(100), 14, now).join(), /SHA-512/);
  assert.match(releaseErrors({...entry, integrity: 'sha512-ZGVm'}, metadata(100), 14, now).join(), /differs from registry/);
  assert.match(releaseErrors(entry, {...metadata(100), name: 'another-package'}, 14, now).join(), /identity mismatch/);
  assert.match(releaseErrors(entry, {...metadata(100), versions: {}}, 14, now).join(), /identity mismatch/);
});
