const {test} = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {createWebChannelTransport, WebChannel} = require('../lib/index.js');
const {chunk} = require('./harness.cjs');

/** Local v8 peer: verifies real fetch streaming, POSTs, routing and termination. */
async function fixture(t) {
  const requests = [], sessions = new Map(); let nextId = 0;
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let body = ''; for await (const part of req) body += part;
    requests.push({url, method: req.method, body, headers: req.headers});
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const sid = url.searchParams.get('SID');
    if (url.searchParams.get('TYPE') === 'terminate') {
      sessions.get(sid)?.back?.end(); res.end(); return;
    }
    let session = sessions.get(sid);
    const initial = !sid || sid === 'null';
    if (initial) {
      const id = 'SID' + nextId++;
      session = {id, arrayId: 0, queue: [], back: null, long: false}; sessions.set(id, session);
      res.setHeader('X-HTTP-Session-Id', 'sticky'); res.setHeader('X-Client-Wire-Protocol', 'h2');
      const handshake = [[0, ['c', id, '', 8, 'fixture', 30_000]]];
      if (sid === 'null') {
        res.setHeader('X-HTTP-Initial-Response', JSON.stringify(handshake));
        session.back = res;
        res.flushHeaders();
      } else res.write(chunk(handshake));
    }
    if (!session) { res.statusCode = 400; res.end('Unknown SID'); return; }
    if (!initial && url.searchParams.get('RID') === 'rpc') {
      assert.equal(url.searchParams.get('gsessionid'), 'sticky');
      session.back = res; session.long = url.searchParams.get('CI') === '1';
      res.flushHeaders();
    }
    const payload = new URLSearchParams(url.searchParams.get('$req') ?? body);
    for (let i = 0; i < Number(payload.get('count') ?? 0); i++) {
      const value = payload.get('req' + i + '___data__');
      if (value !== null) session.queue.push([++session.arrayId, [JSON.parse(value)]]);
    }
    if (session.back && session.queue.length) {
      const text = chunk(session.queue.splice(0));
      const bytes = Buffer.from(text);
      // Write bytes individually to exercise the UTF-8 decoder across socket reads.
      for (const byte of bytes) session.back.write(Buffer.from([byte]));
      if (session.long) { session.back.end(); session.back = null; }
    }
    if (initial && sid !== 'null') res.end();
    else if (!initial && url.searchParams.get('RID') !== 'rpc') res.end(chunk([1, session.arrayId, 0]));
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject); server.listen(0, '127.0.0.1', resolve);
  });
  t.after(async () => {
    server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  });
  return {url: `http://127.0.0.1:${server.address().port}/channel`, requests};
}
function nextEvent(channel, type) {
  return new Promise((resolve, reject) => {
    channel.listenOnce(type, resolve);
    channel.listenOnce(WebChannel.EventType.ERROR, e => reject(new Error('Channel error: ' + e.errorCode)));
  });
}
for (const [name, options] of [
  ['streaming', {}], ['long polling', {forceLongPolling: true}], ['fast handshake', {fastHandshake: true}],
]) {
  test('real HTTP echo: ' + name, {timeout: 10_000}, async t => {
    const peer = await fixture(t);
    const channel = createWebChannelTransport().createWebChannel(peer.url, {
      useFetchStreams: true, sendRawJson: true, httpSessionIdParam: 'gsessionid',
      messageHeaders: {'X-Test': 'native'}, ...options,
    });
    t.after(() => channel.dispose());
    const open = nextEvent(channel, WebChannel.EventType.OPEN);
    const firstMessage = nextEvent(channel, WebChannel.EventType.MESSAGE);
    channel.open(); channel.send({message: 'initial 雪😀'});
    await open;
    assert.deepEqual((await firstMessage).data, [{message: 'initial 雪😀'}]);
    const secondMessage = nextEvent(channel, WebChannel.EventType.MESSAGE);
    const committed = new Promise(resolve => channel.getRuntimeProperties().commit(resolve));
    channel.send({message: 'second 雪😀'});
    assert.deepEqual((await secondMessage).data, [{message: 'second 雪😀'}]);
    await committed;
    assert.equal(channel.getRuntimeProperties().getHttpSessionId(), 'sticky');
    assert.ok(peer.requests.every(r => r.url.searchParams.get('TYPE') === 'terminate' || r.headers['x-test'] === 'native'));
    const close = nextEvent(channel, WebChannel.EventType.CLOSE);
    channel.close(); await close;
  });
}
