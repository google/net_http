const {test} = require('node:test');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');

test('packed ESM supports import, synchronous require and consumer types', () => {
  const root = path.resolve(__dirname, '..');
  const consumer = fs.mkdtempSync(path.join(os.tmpdir(), 'webchannel-package-'));
  const cache = path.join(consumer, 'npm-cache');
  const npm = (args, cwd) => execFileSync('npm', [...args, '--cache', cache], {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    // npm test has built the package. Avoid recursively running prepack here.
    const [pack] = JSON.parse(npm([
      'pack', '--json', '--ignore-scripts', '--pack-destination', consumer,
    ], root));
    const files = pack.files.map(file => file.path);
    assert.ok(files.includes('lib/index.js') && files.includes('lib/index.d.ts'));
    assert.ok(files.includes('lib/index.d.ts.map') && files.includes('src/index.ts'));
    assert.ok(!files.some(file => file.endsWith('.cjs') || /^(test|dist|legacy)\//.test(file)));
    fs.writeFileSync(path.join(consumer, 'package.json'), '{"private":true,"type":"module"}');
    npm(['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund',
      path.join(consumer, pack.filename)], consumer);

    const probe = path.join(consumer, 'probe.mjs');
    fs.writeFileSync(probe, `
      import assert from 'node:assert/strict';
      import {createRequire} from 'node:module';
      const require = createRequire(import.meta.url);
      // Each order runs in a fresh process, exercising synchronous ESM loading.
      const cjsFirst = process.argv[2] === 'require-first';
      const requiredFirst = cjsFirst ? require('webchannel-js') : undefined;
      const imported = await import('webchannel-js');
      const required = requiredFirst ?? require('webchannel-js');
      assert.equal(required.createWebChannelTransport, imported.createWebChannelTransport);
      assert.equal(required.WebChannel, imported.WebChannel);
      assert.equal(required.EventTarget, imported.EventTarget);
      assert.equal(required.getStatEventTarget(), imported.getStatEventTarget());
      let observed;
      imported.getStatEventTarget().listenOnce(imported.Event.STAT_EVENT, e => { observed = e.stat; });
      required.getStatEventTarget().dispatchEvent(new required.StatEvent(required.Stat.CONNECT_ATTEMPT));
      assert.equal(observed, imported.Stat.CONNECT_ATTEMPT);
      const channel = required.createWebChannelTransport().createWebChannel('https://example.test/channel');
      assert.ok(channel instanceof imported.WebChannel);
      assert.ok(channel instanceof imported.EventTarget);
      channel[Symbol.dispose]();
      assert.equal(channel.isDisposed(), true);
    `);
    for (const order of ['require-first', 'import-first']) {
      execFileSync(process.execPath, [probe, order], {cwd: consumer, stdio: 'pipe'});
    }

    const usage = `
      import {createWebChannelTransport, WebChannel, getStatEventTarget, Event} from 'webchannel-js';
      export function example() {
        using channel = createWebChannelTransport().createWebChannel('https://example.test/channel');
        const disposable: Disposable = channel;
        channel.listen(WebChannel.EventType.MESSAGE, e => { const data: unknown = e.data; void data; });
        getStatEventTarget().listen(Event.STAT_EVENT, e => { const stat: number = e.stat; void stat; });
        return disposable;
      }
    `;
    const esm = path.join(consumer, 'consumer.mts');
    const cjs = path.join(consumer, 'consumer.cts');
    fs.writeFileSync(esm, usage);
    fs.writeFileSync(cjs, usage + `
      import client = require('webchannel-js');
      const channel: client.WebChannel = client.createWebChannelTransport().createWebChannel('/channel');
      channel.dispose();
    `);
    const options = {
      strict: true, noEmit: true, target: ts.ScriptTarget.ES2022,
      lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'], types: [],
    };
    for (const config of [
      {module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext},
      {module: ts.ModuleKind.Node20, moduleResolution: ts.ModuleResolutionKind.Node16},
      {module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler},
    ]) {
      const inputs = config.moduleResolution === ts.ModuleResolutionKind.Bundler ? [esm] : [esm, cjs];
      const program = ts.createProgram(inputs, {...options, ...config});
      const diagnostics = ts.getPreEmitDiagnostics(program);
      assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: file => file, getCurrentDirectory: () => consumer, getNewLine: () => '\n',
      }));
    }
  } finally {
    fs.rmSync(consumer, {recursive: true, force: true});
  }
});
