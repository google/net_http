const {test} = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const {harness, flush, json} = require('./harness.cjs');

function browserSymbol(withDispose = false) {
  // Give each VM an isolated Symbol constructor without altering Node's global.
  const replacement = description => Symbol(description);
  const descriptors = Object.getOwnPropertyDescriptors(Symbol);
  delete descriptors.dispose;
  Object.defineProperties(replacement, descriptors);
  if (withDispose) Object.defineProperty(replacement, 'dispose', {value: Symbol('existing dispose')});
  return replacement;
}
function disposeSymbol(h) { return vm.runInContext('Symbol.dispose', h.context); }

for (const present of [false, true]) {
  test('disposal uses one shared symbol with ' + (present ? 'existing' : 'missing') + ' Symbol.dispose', () => {
    const symbols = browserSymbol(present);
    const previous = Object.getOwnPropertyDescriptor(symbols, 'dispose');
    const h = harness(false, {Symbol: symbols});
    const key = disposeSymbol(h);
    assert.equal(typeof key, 'symbol');
    assert.equal(Object.getOwnPropertyDescriptor(symbols, 'dispose').enumerable, false);
    if (present) assert.deepEqual(Object.getOwnPropertyDescriptor(symbols, 'dispose'), previous);
    assert.equal(Object.hasOwn(h.lib.EventTarget.prototype, 'undefined'), false);
    const other = harness(false, {Symbol: symbols});
    assert.equal(disposeSymbol(other), key);
    const {channel} = other.channel();
    assert.equal(typeof channel[key], 'function');
    channel[key]();
    assert.equal(channel.isDisposed(), true);
  });
}

test('Symbol.dispose preserves legacy disposal of an open channel and is idempotent', async () => {
  async function run(legacy) {
    const h = harness(legacy);
    const {channel, events} = h.channel(); channel.open(); await flush();
    h.handshake(); await flush();
    channel.send({pending: true}); await flush();
    const [back, post] = h.requests.slice(1);
    const key = disposeSymbol(h);
    assert.equal(typeof channel[key], 'function');
    channel[key]();
    const count = h.requests.length;
    channel[key](); channel.dispose(); await flush();
    assert.equal(h.requests.length, count);
    assert.ok(back.aborted && post.aborted);
    assert.deepEqual(events, [{type: 'OPEN'}]); // dispose suppresses CLOSE
    if (!legacy) {
      assert.equal(h.clock.timers.size, 0);
      assert.deepEqual(json(channel.getRuntimeProperties().getNonAckedMessages()), [{pending: true}]);
    }
    return events;
  }
  assert.deepEqual(await run(false), await run(true));
});

test('inherited Symbol.dispose dispatches to a subclass override', () => {
  const h = harness(); let calls = 0;
  class CustomTarget extends h.lib.EventTarget {
    dispose() { calls++; super.dispose(); }
  }
  const target = new CustomTarget();
  target[disposeSymbol(h)]();
  assert.equal(calls, 1); assert.equal(target.isDisposed(), true);
});

test('Symbol.dispose dispatches through the public dispose method in both bundles', () => {
  for (const legacy of [false, true]) {
    const h = harness(legacy);
    const {channel} = h.channel();
    const dispose = channel.dispose;
    let calls = 0;
    channel.dispose = function() { calls++; dispose.call(this); };
    channel[disposeSymbol(h)]();
    assert.equal(calls, 1);
    assert.equal(channel.isDisposed(), true);
  }
});

let usingOutput;
function compileUsing() {
  if (usingOutput) return usingOutput;
  const fixture = path.join(__dirname, 'fixtures/using.ts');
  const program = ts.createProgram([fixture], {
    strict: true, noEmitOnError: true, target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
    lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: file => file, getCurrentDirectory: () => __dirname, getNewLine: () => '\n',
  }));
  const result = program.emit(undefined, (file, text) => {
    if (file.endsWith('/using.js')) usingOutput = text;
  });
  assert.equal(result.emitSkipped, false);
  assert.ok(usingOutput);
  return usingOutput;
}
function loadUsing(h) {
  const module = {exports: {}};
  const execute = vm.runInContext('(function(require,module,exports){' + compileUsing() + '\n})', h.context);
  execute(name => {
    assert.equal(name, '../../lib/index.js');
    return h.lib;
  }, module, module.exports);
  return module.exports;
}

for (const present of [false, true]) {
  for (const fail of [false, true]) {
    test(`compiled using disposes on ${fail ? 'exception' : 'normal exit'} with ${present ? 'existing' : 'missing'} Symbol.dispose`, async () => {
      const h = harness(false, {Symbol: browserSymbol(present)});
      const using = loadUsing(h);
      const {channel, events} = h.channel();
      assert.equal(using.asDisposable(channel), channel);
      channel.open();
      if (fail) assert.throws(() => using.scoped(channel, true), /scope failed/);
      else using.scoped(channel);
      await flush();
      assert.equal(channel.isDisposed(), true);
      assert.equal(h.requests.length, 0); assert.equal(h.clock.timers.size, 0);
      assert.deepEqual(events, []);
      assert.deepEqual(json(channel.getRuntimeProperties().getNonAckedMessages()), [{message: 'scoped'}]);
    });
  }
}
