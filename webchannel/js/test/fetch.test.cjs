const {test} = require('node:test');
const assert = require('node:assert/strict');
const {harness, flush, chunk, json} = require('./harness.cjs');

function fetchHarness(options = {}, legacy = false) {
  const calls = [];
  let backController, backCancelled = false;
  const fetch = async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init);
    const url = new URL(request.url);
    const body = await request.text();
    calls.push({url, body, credentials: request.credentials, headers: Object.fromEntries(request.headers)});
    if (url.searchParams.get('TYPE') === 'terminate') return new Response('');
    if (url.searchParams.get('RID') === 'rpc' || url.searchParams.get('SID') === 'null') {
      const stream = new ReadableStream({
        start(controller) { backController = controller; },
        cancel() { backCancelled = true; },
      });
      return new Response(stream, {headers: url.searchParams.get('SID') === 'null'
        ? {'X-HTTP-Initial-Response': JSON.stringify([[0, ['c', 'SID', '', 8]]])} : {}});
    }
    if (!url.searchParams.has('SID')) {
      return new Response(chunk([[0, ['c', 'SID', '', 8]]]), {headers: {'X-Client-Wire-Protocol': 'h2'}});
    }
    return new Response(chunk([1, 1, 0]));
  };
  const h = harness(legacy, {fetch});
  const c = h.channel({xmlHttpFactory: undefined, useFetchStreams: true, ...options});
  return {...h, ...c, calls,
    push(bytes) { assert.ok(backController); backController.enqueue(bytes); },
    end() { backController.close(); },
    get backCancelled() { return backCancelled; },
  };
}

test('Fetch streaming preserves split UTF-8 and wire behavior from the legacy bundle', async () => {
  async function run(legacy) {
    const h = fetchHarness({supportsCrossDomainXhr: true}, legacy);
    h.channel.open(); await flush(); await flush();
    assert.equal(h.events[0].type, 'OPEN');
    const bytes = new TextEncoder().encode(chunk([[1, ['雪😀']]]));
    for (const byte of bytes) { h.push(new Uint8Array([byte])); await flush(); }
    assert.deepEqual(h.events[1], {type: 'MESSAGE', data: ['雪😀']});
    h.channel.send({outgoing: 'yes'}); await flush(); await flush();
    h.channel.close(); await flush();
    const calls = h.calls.map(call => {
      call.url.searchParams.delete('zx'); call.url.searchParams.sort();
      return {...call, url: call.url.toString()};
    });
    return {calls, events: h.events};
  }
  assert.deepEqual(await run(false), await run(true));
});

test('Fetch fast handshake opens from headers and uses that stream for messages', async () => {
  const h = fetchHarness({fastHandshake: true}); h.channel.open(); await flush(); await flush();
  assert.deepEqual(h.events.map(e => e.type), ['OPEN']);
  assert.equal(h.calls.length, 1);
  h.push(new TextEncoder().encode(chunk([[1, ['hello']]]))); await flush();
  assert.deepEqual(h.events[1].data, ['hello']);
  h.channel.close(); await flush();
  assert.ok(h.backCancelled); assert.equal(h.clock.timers.size, 0);
});

test('Fetch close cancels a pending reader even when the transport ignores AbortSignal', async () => {
  const h = fetchHarness(); h.channel.open(); await flush(); await flush();
  h.channel.close(); await flush();
  assert.ok(h.backCancelled); assert.equal(h.clock.timers.size, 0);
  assert.deepEqual(h.events.map(e => e.type), ['OPEN', 'CLOSE']);
});

test('Fetch EOF with an incomplete chunk retries the backchannel without duplicate events', async () => {
  const h = fetchHarness(); h.channel.open(); await flush(); await flush();
  h.push(new TextEncoder().encode('20\nshort')); h.end(); await flush(); await flush();
  h.clock.tick(0); await flush(); await flush();
  assert.equal(h.calls[2].url.searchParams.get('t'), '2');
  assert.deepEqual(h.events.map(e => e.type), ['OPEN']);
  h.channel.close(); await flush(); assert.equal(h.clock.timers.size, 0);
});

test('Fetch rejection after close is ignored and cannot reopen the channel', async () => {
  let reject;
  const h = harness(false, {fetch: () => new Promise((_, no) => { reject = no; })});
  const {channel, events} = h.channel({xmlHttpFactory: undefined, useFetchStreams: true});
  channel.open(); channel.send('pending'); await flush(); channel.close();
  reject(new Error('aborted')); await flush();
  assert.deepEqual(events.map(e => e.type), ['CLOSE']);
  assert.deepEqual(json(channel.getRuntimeProperties().getNonAckedMessages()), ['pending']);
  assert.equal(h.clock.timers.size, 0);
});
