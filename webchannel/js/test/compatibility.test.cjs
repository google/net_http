const {test} = require('node:test');
const assert = require('node:assert/strict');
const {harness, flush, chunk, json, transcript} = require('./harness.cjs');

async function scenario(legacy, options, send, receive = [[1, ['echo', '雪😀']]]) {
  const h = harness(legacy);
  const {channel, events} = h.channel(options);
  channel.open();
  for (const value of send) channel.send(value);
  await flush();
  h.clock.tick(25);
  h.handshake(h.requests[0], {'X-Client-Wire-Protocol': 'h2', 'X-HTTP-Session-Id': 'sticky'});
  await flush();
  assert.equal(events[0].type, 'OPEN');
  const back = h.requests.find(r => new URL(r.url).searchParams.get('RID') === 'rpc');
  assert.ok(back);
  back.headers();
  const text = chunk(receive);
  back.chunk(text.slice(0, 3)); back.chunk(text.slice(3, 12)); back.chunk(text.slice(12));
  channel.send({later: 'hello world'});
  await flush();
  const post = h.requests.find(r => r !== h.requests[0] && r.method === 'POST');
  assert.ok(post);
  post.respond(chunk([1, receive.at(-1)[0], 0]));
  await flush();
  channel.close();
  const result = {requests: transcript(h.requests), events};
  if (!legacy) assert.equal(h.clock.timers.size, 0);
  return result;
}

for (const [name, options, messages] of [
  ['object and Map messages', {}, [{a: 'a b', nested: {x: 1}, nil: null}, new Map([['m', '雪😀']])]],
  ['raw strings', {}, ['hello world', '雪😀']],
  ['raw JSON', {sendRawJson: true}, [{a: ['雪😀', 1, false]}]],
  ['headers and routing', {messageHeaders: {Authorization: 'test'}, initMessageHeaders: {Init: 'yes'},
    clientProtocolHeaderRequired: true, messageContentType: 'application/json', clientProfile: 'test',
    httpSessionIdParam: 'gsessionid', messageUrlParams: {database: 'my db'}}, [{x: 1}]],
  ['headers in query', {messageHeaders: {All: 'yes'}, initMessageHeaders: {Init: 'yes'}, httpHeadersOverwriteParam: '$headers'}, [{x: 1}]],
  ['headers in body', {messageHeaders: {All: 'yes'}, initMessageHeaders: {Init: 'yes'}, encodeInitMessageHeaders: true}, [{x: 1}]],
  ['blocking handshake', {blockingHandshake: true}, []],
  ['long polling', {forceLongPolling: true, longPollingTimeout: 5000}, []],
]) {
  test('legacy wire and events: ' + name, async () => {
    assert.deepEqual(await scenario(false, options, messages), await scenario(true, options, messages));
  });
}

test('legacy wire and events: duplicate IDs and metadata', async () => {
  const receive = [[1, {__headers__: {X: 'yes'}, __status__: 201, __sm__: {payload: {x: 1}}}],
    [1, ['duplicate']], [0, ['old']], [2, ['noop']], [4, ['after gap']]];
  const actual = await scenario(false, {}, [], receive);
  assert.deepEqual(actual, await scenario(true, {}, [], receive));
  assert.deepEqual(actual.events.filter(e => e.type === 'MESSAGE'), [
    {type: 'MESSAGE', data: {x: 1}, headers: {X: 'yes'}, statusCode: 201, metadataKey: 'payload'},
    {type: 'MESSAGE', data: ['after gap']},
  ]);
});

test('legacy wire and events: fast handshake promotes the GET to the backchannel', async () => {
  async function run(legacy) {
    const h = harness(legacy);
    const {channel, events} = h.channel({fastHandshake: true, sendRawJson: true, encodeInitMessageHeaders: true});
    channel.open(); channel.send({x: 'initial'});
    await flush();
    const initial = h.requests[0];
    assert.equal(initial.method, 'GET');
    assert.match(new URL(initial.url).searchParams.get('$req'), /req0___data__/);
    initial.headers(200, {'X-HTTP-Initial-Response': JSON.stringify([[0, ['c', 'SID', '', 8]]])});
    initial.chunk(chunk([[1, ['hello']]]));
    await flush();
    assert.equal(h.requests.length, 1);
    channel.send({next: 'yes'}); await flush();
    h.requests[1].respond(chunk([1, 1, 0])); await flush();
    initial.finish(); await flush();
    channel.close();
    return {requests: transcript(h.requests), events};
  }
  assert.deepEqual(await run(false), await run(true));
});

for (const [name, response, status, code] of [
  ['stop', chunk([[1, ['stop']]]), 200, 7],
  ['unknown session', '<html>Unknown SID</html>', 400, 6],
  ['HTTP failure', 'unavailable', 503, 2],
]) {
  test('legacy error and close: ' + name, async () => {
    async function run(legacy) {
      const h = harness(legacy);
      const {channel, events} = h.channel(); channel.open(); await flush();
      h.handshake(); await flush();
      h.requests[1].respond(response, status);
      assert.deepEqual(events.map(e => e.type), ['OPEN', 'ERROR', 'CLOSE']);
      assert.equal(events[1].errorCode, code);
      channel.dispose?.();
      return events;
    }
    assert.deepEqual(await run(false), await run(true));
  });
}

test('legacy forward retry preserves RID, attempt and message IDs', async () => {
  async function run(legacy) {
    const h = harness(legacy);
    const {channel, events} = h.channel(); channel.open(); await flush();
    h.handshake(); await flush();
    channel.send({first: 'yes'}); await flush();
    const first = h.requests[2]; first.networkError();
    h.clock.tick(0); await flush();
    const retry = h.requests[3];
    assert.equal(new URL(retry.url).searchParams.get('RID'), new URL(first.url).searchParams.get('RID'));
    assert.equal(new URL(retry.url).searchParams.get('t'), '2');
    assert.equal(retry.body, first.body);
    retry.respond(chunk([1, 0, 0])); await flush();
    channel.close();
    return {requests: transcript(h.requests), events};
  }
  assert.deepEqual(await run(false), await run(true));
});

test('legacy backchannel retry uses the last delivered AID', async () => {
  async function run(legacy) {
    const h = harness(legacy);
    const {channel, events} = h.channel(); channel.open(); await flush();
    h.handshake(); await flush();
    const back = h.requests[1]; back.headers(); back.chunk(chunk([[1, ['value']]])); back.networkError();
    h.clock.tick(0); await flush();
    const retry = h.requests[2];
    assert.equal(new URL(retry.url).searchParams.get('AID'), '1');
    assert.equal(new URL(retry.url).searchParams.get('t'), '2');
    channel.close();
    return {requests: transcript(h.requests), events};
  }
  assert.deepEqual(await run(false), await run(true));
});

test('buffering proxy fallback matches legacy CI and telemetry', async () => {
  async function run(legacy) {
    const h = harness(legacy); const stats = [];
    h.lib.getStatEventTarget().listen(h.lib.Event.STAT_EVENT, e => stats.push(e.stat));
    const {channel} = h.channel({detectBufferingProxy: true}); channel.open(); await flush();
    h.clock.tick(25); h.handshake(); await flush();
    h.clock.tick(100); await flush();
    assert.ok(h.requests[1].aborted);
    assert.equal(new URL(h.requests[2].url).searchParams.get('CI'), '1');
    channel.close();
    return {requests: transcript(h.requests), stats};
  }
  assert.deepEqual(await run(false), await run(true));
});

test('public event constants and error codes retain their historical values', () => {
  const old = harness(true).lib, current = harness().lib;
  for (const key of ['Event', 'Stat', 'EventType']) assert.deepEqual(json(current[key]), json(old[key]));
  for (const [key, value] of Object.entries(current.ErrorCode)) {
    if (typeof value === 'number') assert.equal(value, old.ErrorCode[key]);
  }
  for (let i = -1; i <= 10; i++) assert.equal(current.ErrorCode.getDebugMessage(i), old.ErrorCode.getDebugMessage(i));
  assert.deepEqual(json(current.WebChannel.EventType), json(old.WebChannel.EventType));
});

test('captured echo response with a UTF-8 byte length is incomplete for both JS clients', async () => {
  const payload = JSON.stringify([[1, {message: 'typescript-port-smoke-雪😀'}]]);
  assert.equal(payload.length, 45);
  assert.equal(Buffer.byteLength(payload), 49);
  const captured = '49\n' + payload;
  async function run(legacy) {
    const h = harness(legacy);
    const {channel, events} = h.channel(); channel.open(); await flush();
    h.handshake(); await flush(); h.requests[1].respond(captured);
    h.clock.tick(0); await flush();
    assert.equal(new URL(h.requests[2].url).searchParams.get('t'), '2');
    assert.deepEqual(events.map(e => e.type), ['OPEN']);
    channel.close();
    return {requests: transcript(h.requests), events};
  }
  assert.deepEqual(await run(false), await run(true));
});
