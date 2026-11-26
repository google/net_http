const {test} = require('node:test');
const assert = require('node:assert/strict');
const {harness, flush, chunk, json, transcript} = require('./harness.cjs');
const {ChunkDecoder, QueuedMap, WireV8} = require('../lib/wire.js');

async function opened(options) {
  const h = harness(); const c = h.channel(options);
  c.channel.open(); await flush(); h.handshake(); await flush();
  return {...h, ...c};
}

test('XHR does not probe response headers absent from the exposed header list', async () => {
  const h = harness();
  const {channel, events} = h.channel();
  channel.open(); await flush();
  const probed = [];
  h.requests[0].getResponseHeader = name => { probed.push(name); return null; };
  h.handshake(); await flush();
  assert.deepEqual(probed, []);
  assert.deepEqual(events, [{type: 'OPEN'}]);
  channel.close();
});

test('injected XHR without getAllResponseHeaders retains single-header support', async () => {
  const h = harness();
  const {channel, events} = h.channel({httpSessionIdParam: 'gsessionid'});
  channel.open(); await flush();
  h.requests[0].getAllResponseHeaders = undefined;
  h.handshake(h.requests[0], {'X-HTTP-Session-Id': 'sticky'}); await flush();
  assert.deepEqual(events, [{type: 'OPEN'}]);
  assert.equal(new URL(h.requests[1].url).searchParams.get('gsessionid'), 'sticky');
  channel.close();
});

test('chunk decoder accepts every possible split of a Unicode response', () => {
  const values = ['雪😀', '[1,2]', ''];
  const input = values.map(chunk).join('');
  for (let i = 0; i <= input.length; i++) {
    const decoder = new ChunkDecoder(), received = [];
    decoder.push(input.slice(0, i), c => received.push(c));
    decoder.push(input.slice(i), c => received.push(c));
    assert.deepEqual(received, values);
    assert.equal(decoder.finish(), 'ok');
  }
});
for (const length of ['-1', '1.5', 'NaN', 'Infinity', '9007199254740992', '', '0x10']) {
  test('invalid chunk length is rejected: ' + JSON.stringify(length), () => {
    const decoder = new ChunkDecoder();
    assert.throws(() => decoder.push(length + '\nabc', () => {}));
  });
}

test('wire codec preserves reordered map IDs and marks unserializable maps', () => {
  const codec = new WireV8();
  const queue = [new QueuedMap(300, {a: 'x'}), new QueuedMap(2, {b: 'y'})];
  const encoded = new URLSearchParams(codec.encodeMessageQueue(queue, 2));
  const offset = Number(encoded.get('ofs'));
  assert.equal(encoded.get('req' + (300 - offset) + '_a'), 'x');
  assert.equal(encoded.get('req' + (2 - offset) + '_b'), 'y');
  const circular = {}; circular.self = circular;
  const bad = []; const body = codec.encodeMessageQueue([new QueuedMap(0, {circular})], 1, map => bad.push(map));
  assert.match(body, /req0_type=_badmap/); assert.equal(bad.length, 1);
  assert.throws(() => codec.decodeMessage('{}'));
});

test('close before the opening microtask cancels all work and is idempotent', async () => {
  const h = harness(); const {channel, events} = h.channel();
  channel.open(); channel.send({queued: true}); channel.close(); channel.close(); await flush();
  assert.equal(h.requests.length, 0); assert.equal(h.clock.timers.size, 0);
  assert.deepEqual(events, [{type: 'CLOSE'}]);
  assert.deepEqual(json(channel.getRuntimeProperties().getNonAckedMessages()), [{queued: true}]);
  assert.throws(() => channel.send('late'));
  assert.throws(() => channel.open());
});

test('close from OPEN prevents a backchannel or later chunks in the same response', async () => {
  const h = harness(); const {channel, events} = h.channel();
  channel.listen(h.lib.WebChannel.EventType.OPEN, () => channel.close());
  channel.open(); await flush();
  h.requests[0].respond(chunk([[0, ['c', 'SID', '', 8]], [1, ['should not arrive']]]));
  await flush();
  assert.deepEqual(events, [{type: 'OPEN'}, {type: 'CLOSE'}]);
  assert.equal(h.requests.filter(r => new URL(r.url).searchParams.get('RID') === 'rpc').length, 0);
  assert.equal(h.clock.timers.size, 0);
});

test('dispose from MESSAGE suppresses following messages and releases requests', async () => {
  const h = await opened();
  h.channel.listen(h.lib.WebChannel.EventType.MESSAGE, () => h.channel.dispose());
  h.requests[1].respond(chunk([[1, ['one']], [2, ['two']]]));
  await flush();
  assert.deepEqual(h.events.map(e => e.type), ['OPEN', 'MESSAGE']);
  assert.equal(h.clock.timers.size, 0);
});

test('close while a retry is pending retains messages and cancels timers', async () => {
  const h = await opened(); const props = h.channel.getRuntimeProperties();
  h.channel.send({a: 1}); await flush(); h.requests[2].networkError();
  assert.deepEqual(json(props.getNonAckedMessages()), [{a: 1}]);
  h.channel.close(); const count = h.requests.length;
  h.clock.tick(60_000); await flush();
  assert.equal(h.requests.length, count); assert.equal(h.clock.timers.size, 0);
  assert.deepEqual(json(props.getNonAckedMessages()), [{a: 1}]);
});

test('forward retry exhaustion closes once and retains the unacknowledged messages', async () => {
  const h = await opened({internalChannelParams: {baseRetryDelayMs: 10, retryDelaySeedMs: 0}});
  h.channel.send({a: 1}); await flush();
  h.requests[2].networkError(); h.clock.tick(0); await flush();
  h.requests[3].networkError(); h.clock.tick(10); await flush();
  h.requests[4].networkError(); await flush();
  assert.deepEqual(h.events.map(e => e.type), ['OPEN', 'ERROR', 'CLOSE']);
  assert.equal(h.events[1].errorCode, 2);
  assert.deepEqual(json(h.channel.getRuntimeProperties().getNonAckedMessages()), [{a: 1}]);
  assert.equal(h.clock.timers.size, 0);
});

for (const [name, body, code] of [
  ['invalid length', '-1\n[]', 10],
  ['invalid JSON', chunk('evil()'), 11],
  ['wrong acknowledgement shape', chunk([1, 2]), 11],
  ['wrong acknowledgement types', chunk(['yes', 1, 0]), 11],
  ['truncated chunk', '100\n[]', 10],
  ['empty response', '', 5],
]) {
  test('forward response fails cleanly: ' + name, async () => {
    const h = await opened({internalChannelParams: {failFast: true}});
    h.channel.send({a: 1}); await flush(); h.requests[2].respond(body);
    assert.deepEqual(h.events.map(e => e.type), ['OPEN', 'ERROR', 'CLOSE']);
    assert.equal(h.events[1].errorCode, code); assert.equal(h.clock.timers.size, 0);
  });
}

test('handshake timeout does not retry or leave a scheduled request behind', async () => {
  const h = harness(); const {channel, events} = h.channel(); channel.open(); await flush();
  h.clock.tick(45_000); await flush();
  assert.equal(h.requests.length, 1); assert.ok(h.requests[0].aborted);
  assert.deepEqual(events.map(e => e.type), ['ERROR', 'CLOSE']);
  assert.equal(h.clock.timers.size, 0);
});

test('forward timeout uses the configured deadline and fail-fast policy', async () => {
  const h = await opened({internalChannelParams: {forwardChannelRequestTimeoutMs: 100, failFast: true}});
  h.channel.send('deadline'); await flush();
  h.clock.tick(62); assert.equal(h.events.length, 1);
  h.clock.tick(1); await flush();
  assert.equal(h.events[1].errorCode, 2); assert.ok(h.requests[2].aborted);
  assert.equal(h.clock.timers.size, 0);
});

test('partial bytes reset the backchannel watchdog before a chunk is complete', async () => {
  const h = await opened(); const back = h.requests[1]; back.headers();
  h.clock.tick(40_000); back.chunk('100\n');
  h.clock.tick(40_000); assert.equal(h.requests.length, 2);
  h.channel.close(); assert.equal(h.clock.timers.size, 0);
});

test('received bytes cancel buffering detection and report NOPROXY once', async () => {
  const h = harness(); const stats = [];
  h.lib.getStatEventTarget().listen(h.lib.Event.STAT_EVENT, e => stats.push(e.stat));
  const {channel} = h.channel({detectBufferingProxy: true}); channel.open(); await flush();
  h.clock.tick(25); h.handshake(); await flush();
  h.requests[1].headers(); h.requests[1].chunk('100\n');
  h.clock.tick(1000); await flush();
  assert.equal(h.requests.length, 2);
  assert.deepEqual(stats.filter(s => s === h.lib.Stat.PROXY || s === h.lib.Stat.NOPROXY), [h.lib.Stat.NOPROXY]);
  channel.close();
});

test('missing fast handshake header fails without retry', async () => {
  const h = harness(); const {channel, events} = h.channel({fastHandshake: true});
  channel.open(); await flush(); h.requests[0].respond(chunk([[1, ['noop']]]));
  assert.equal(events[0].errorCode, 6);
  assert.deepEqual(events.map(e => e.type), ['ERROR', 'CLOSE']); assert.equal(h.clock.timers.size, 0);
});

test('fast handshake respects 4096-character limit and per-request message cap', async () => {
  const h = harness(); const {channel} = h.channel({fastHandshake: true, maxMessagesPerRequest: 1});
  channel.open(); channel.send('x'.repeat(4096)); channel.send('later'); await flush();
  const req = new URLSearchParams(new URL(h.requests[0].url).searchParams.get('$req'));
  assert.equal(req.get('count'), '1'); assert.equal(req.get('req0___data__').length, 4096);
  channel.close();
});

test('HTTP/1 serializes forward requests and HTTP/2 respects its configured limit', async () => {
  for (const protocol of ['', 'h2', 'h3']) {
    const h = harness(); const {channel} = h.channel({concurrentRequestLimit: 2});
    channel.open(); await flush(); h.handshake(h.requests[0], {'X-Client-Wire-Protocol': protocol}); await flush();
    for (let i = 0; i < 4; i++) { channel.send({i}); await flush(); }
    const props = channel.getRuntimeProperties();
    assert.equal(props.getPendingRequestCount(), protocol ? 2 : 1);
    assert.equal(props.getConcurrentRequestLimit(), protocol ? 2 : 1);
    assert.equal(props.getNonAckedMessages().length, 4);
    h.requests[2].respond(chunk([1, 0, 0])); await flush();
    assert.equal(props.getPendingRequestCount(), protocol ? 2 : 1);
    channel.close(); assert.equal(props.getNonAckedMessages().length, 3);
    assert.equal(h.clock.timers.size, 0);
  }
});

test('commit is delivered once after a forward acknowledgement and pending gap shrinks', async () => {
  const h = await opened(); const props = h.channel.getRuntimeProperties(); let commits = 0;
  h.channel.send('one'); await flush(); h.channel.send('two');
  assert.equal(props.getNonAckedMessageGap(), 2);
  props.commit(() => commits++);
  h.requests[2].respond(chunk([1, 0, 0])); await flush();
  assert.equal(commits, 1); assert.equal(props.getNonAckedMessageGap(), 1);
  h.requests[3].respond(chunk([1, 0, 0])); await flush();
  assert.equal(commits, 1); assert.equal(props.getNonAckedMessageGap(), 0);
  h.channel.close();
});

test('mutable headers and URL params take effect on subsequent requests', async () => {
  const headers = {Token: 'one'}, params = {tenant: 'a'};
  const h = await opened({messageHeaders: headers, messageUrlParams: params});
  headers.Token = 'two'; params.tenant = 'b';
  h.channel.send('next'); await flush();
  assert.equal(h.requests[2].requestHeaders.token, 'two');
  assert.equal(new URL(h.requests[2].url).searchParams.get('tenant'), 'b');
  h.channel.close();
});

test('session routing overrides duplicate params and preserves backend error details', async () => {
  const h = harness(); const {channel, events} = h.channel({httpSessionIdParam: 'session', messageUrlParams: {session: 'ignored'}});
  channel.open(); await flush(); assert.equal(new URL(h.requests[0].url).searchParams.has('session'), false);
  h.handshake(h.requests[0], {'X-HTTP-Session-Id': 'sticky'}); await flush();
  assert.equal(new URL(h.requests[1].url).searchParams.get('session'), 'sticky');
  h.requests[1].respond('unavailable', 503, {'Retry-After': '3'});
  const props = channel.getRuntimeProperties();
  assert.equal(props.getHttpSessionId(), 'sticky'); assert.equal(props.getLastStatusCode(), 503);
  assert.equal(props.getLastResponseHeaders()['retry-after'], '3'); assert.equal(events[1].errorCode, 2);
});

test('host prefix is applied only to credentialed backchannels', async () => {
  for (const enabled of [false, true]) {
    const h = harness(); const {channel} = h.channel({supportsCrossDomainXhr: enabled});
    channel.open(); await flush(); h.handshake(h.requests[0], {}, ['c', 'SID', 'shard', 8]); await flush();
    assert.equal(new URL(h.requests[1].url).hostname, enabled ? 'shard.example.test' : 'example.test');
    assert.equal(h.requests[1].withCredentials, enabled); channel.close();
  }
});

test('listener and telemetry exceptions do not prevent request cleanup', async () => {
  const h = await opened({internalChannelParams: {failFast: true}});
  h.lib.getStatEventTarget().listen(h.lib.Event.STAT_EVENT, () => { throw new Error('subscriber'); });
  h.channel.listen(h.lib.WebChannel.EventType.ERROR, () => { throw new Error('listener'); });
  h.channel.send('fail'); await flush(); h.requests[2].respond('failure', 503);
  assert.deepEqual(h.events.map(e => e.type), ['OPEN', 'ERROR', 'CLOSE']);
  assert.equal(h.clock.timers.size, 0);
});

test('invalid limits are rejected and the native package has no Closure dependencies', () => {
  const {lib} = harness();
  for (const value of [0, -1, Infinity, 1.5]) {
    assert.throws(() => lib.createWebChannelTransport().createWebChannel('https://example.test', {concurrentRequestLimit: value}));
  }
  assert.equal(require('../package.json').dependencies, undefined);
  assert.ok(!Object.keys(require('../package.json').devDependencies).some(name => name.startsWith('google-closure-')));
});

test('runtime queries preserve raw strings even when sendRawJson is enabled', () => {
  const h = harness(); const {channel} = h.channel({sendRawJson: true});
  channel.send('not JSON'); channel.send('');
  assert.deepEqual(json(channel.getRuntimeProperties().getNonAckedMessages()), ['not JSON', '']);
  channel.close();
});
