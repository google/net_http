// Uses only Node built-ins so CI can check an incoming lockfile before npm ci.
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import path from 'node:path';

const registry = 'https://registry.npmjs.org';
const root = fileURLToPath(new URL('../', import.meta.url));
const projects = {library: root, demo: path.join(root, 'demo'), legacy: path.join(root, 'legacy')};
const day = 86_400_000;

export function releaseErrors(entry, metadata, minimumDays, now = Date.now()) {
  const {name, version, resolved, integrity} = entry;
  const errors = [];
  const expectedUrl = `${registry}/${name}/-/${name.split('/').at(-1)}-${version}.tgz`;
  if (resolved !== expectedUrl) errors.push('expected the canonical npm registry tarball URL');
  if (!/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(integrity ?? '')) errors.push('missing SHA-512 integrity');
  const published = Date.parse(metadata.time?.[version]);
  if (!Number.isFinite(published)) errors.push('missing or invalid registry publication time');
  else if (now - published < minimumDays * day) {
    errors.push(`published ${((now - published) / day).toFixed(2)} days ago; requires ${minimumDays} days`);
  }
  const manifest = metadata.versions?.[version];
  if (metadata.name !== name || !manifest) errors.push('registry package/version identity mismatch');
  else if (manifest.dist?.integrity !== integrity) errors.push('lockfile integrity differs from registry metadata');
  return errors;
}

async function main(scopes) {
  const requested = scopes.length ? [...new Set(scopes)] : Object.keys(projects);
  const packages = new Map();
  const counts = {};
  for (const scope of requested) {
    if (!Object.hasOwn(projects, scope)) throw new Error(`Unknown project: ${scope}; use library, demo or legacy`);
    const directory = projects[scope];
    const config = await readFile(path.join(directory, '.npmrc'), 'utf8');
    const minimumDays = Number(config.match(/^min-release-age\s*=\s*(\d+)\s*$/m)?.[1]);
    if (!Number.isSafeInteger(minimumDays) || minimumDays < 1) {
      throw new Error(`${scope}: .npmrc must specify a positive integer min-release-age`);
    }
    const lock = JSON.parse(await readFile(path.join(directory, 'package-lock.json'), 'utf8'));
    if (lock.lockfileVersion !== 3 || !lock.packages) throw new Error(`${scope}: expected a v3 lockfile`);
    counts[scope] = 0;
    for (const [location, entry] of Object.entries(lock.packages)) {
      if (!location) continue;
      const name = location.split('node_modules/').at(-1);
      // The lockfile may contain a self-reported name; use its dependency path.
      const item = {...entry, scope, name, minimumDays};
      const entries = packages.get(name) ?? [];
      entries.push(item);
      packages.set(name, entries);
      counts[scope]++;
    }
  }

  const queue = [...packages];
  const failures = [];
  let next = 0;
  const now = Date.now();
  await Promise.all(Array.from({length: Math.min(6, queue.length)}, async () => {
    while (next < queue.length) {
      const [name, entries] = queue[next++];
      let metadata;
      try {
        const response = await fetch(`${registry}/${encodeURIComponent(name)}`, {
          headers: {accept: 'application/json'}, signal: AbortSignal.timeout(15_000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        metadata = await response.json();
      } catch (error) {
        failures.push(`${name}: registry lookup failed (${error.message})`);
        continue;
      }
      for (const entry of entries) {
        for (const error of releaseErrors(entry, metadata, entry.minimumDays, now)) {
          failures.push(`${entry.scope}: ${name}@${entry.version}: ${error}`);
        }
      }
    }
  }));
  if (failures.length) throw new Error(failures.sort().join('\n'));
  for (const [scope, count] of Object.entries(counts)) {
    console.log(`${scope}: ${count} locked packages meet registry, SHA-512 and release-age policy`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main(process.argv.slice(2)).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
