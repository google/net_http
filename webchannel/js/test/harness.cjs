const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Keep the fake host synchronous and isolated. Package tests execute the actual
// ESM through Node's loaders; these VM scenarios adapt it to CommonJS in memory.
const vmSources = new Map();

class Clock {
  now = 1_000_000;
  nextId = 1;
  timers = new Map();
  setTimeout = (fn, ms = 0) => {
    const id = this.nextId++;
    this.timers.set(id, {at: this.now + Number(ms), fn});
    return id;
  };
  clearTimeout = id => this.timers.delete(id);
  tick(ms) {
    const end = this.now + ms;
    for (let n = 0; n < 1000; n++) {
      const next = [...this.timers].filter(([, t]) => t.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) { this.now = end; return; }
      this.now = next[1].at;
      this.timers.delete(next[0]);
      next[1].fn();
    }
    throw new Error('Timer loop');
  }
}
class FakeXhr {
  readyState = 0;
  status = 0;
  statusText = '';
  responseText = '';
  response = '';
  responseType = '';
  withCredentials = false;
  onreadystatechange = null;
  onerror = null;
  ontimeout = null;
  onabort = null;
  requestHeaders = {};
  responseHeaders = {};
  aborted = false;
  open(method, url) {
    this.method = method; this.url = String(url); this.readyState = 1;
    this.onreadystatechange?.({target: this});
  }
  setRequestHeader(name, value) { this.requestHeaders[name.toLowerCase()] = String(value); }
  send(body = null) { this.body = body; this.sent = true; }
  getResponseHeader(name) { return this.responseHeaders[name.toLowerCase()] ?? null; }
  getAllResponseHeaders() {
    return Object.entries(this.responseHeaders).map(([k, v]) => `${k}: ${v}\r\n`).join('');
  }
  headers(status = 200, headers = {}) {
    this.status = status;
    this.responseHeaders = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), String(v)]));
    this.readyState = 2; this.onreadystatechange?.({target: this});
  }
  chunk(text) {
    this.responseText += text; this.response = this.responseText;
    this.readyState = 3; this.onreadystatechange?.({target: this});
  }
  finish(text = '') {
    this.responseText += text; this.response = this.responseText;
    this.readyState = 4; this.onreadystatechange?.({target: this});
  }
  respond(text, status = 200, headers = {}) {
    this.headers(status, headers); this.finish(text);
  }
  abort() {
    this.aborted = true; this.readyState = 0;
    this.onreadystatechange?.({target: this}); this.onabort?.({target: this});
  }
  networkError() {
    this.status = 0; this.readyState = 4;
    this.onreadystatechange?.({target: this}); this.onerror?.({target: this});
  }
}
const flush = () => new Promise(resolve => setImmediate(resolve));
const chunk = data => { const text = typeof data === 'string' ? data : JSON.stringify(data); return text.length + '\n' + text; };
const json = value => JSON.parse(JSON.stringify(value));

function harness(legacy = false, extraGlobals = {}) {
  const clock = new Clock();
  const requests = [];
  const factory = {createInstance() { const xhr = new FakeXhr(); requests.push(xhr); return xhr; }};
  const math = Object.create(Math); math.random = () => 0.25;
  const context = vm.createContext({
    console, URL, URLSearchParams, Map, Set, Promise, TextDecoder, TextEncoder, AbortController,
    ReadableStream, Request, Response, Headers, Uint8Array, queueMicrotask,
    Date: class extends Date { static now() { return clock.now; } }, Math: math,
    setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout,
    location: {href: 'https://example.test/demo/index.html', protocol: 'https:', hostname: 'example.test', port: ''},
    ...extraGlobals,
  });
  vm.runInContext('globalThis.global = globalThis', context);
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = {exports: {}}; cache.set(filename, module);
    let source = fs.readFileSync(filename, 'utf8');
    if (!legacy) {
      if (!vmSources.has(filename)) {
        vmSources.set(filename, ts.transpileModule(source, {
          compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS},
        }).outputText);
      }
      source = vmSources.get(filename);
    }
    const wrapped = vm.runInContext('(function(require,module,exports){' + source + '\n})', context, {filename});
    wrapped(name => load(path.resolve(path.dirname(filename), name)), module, module.exports);
    return module.exports;
  }
  const reference = process.env.WEBCHANNEL_REFERENCE_BUNDLE;
  const lib = load(legacy && reference ? path.resolve(reference) :
    path.resolve(__dirname, legacy ? './fixtures/webchannel_blob_original.js' : '../lib/index.js'));
  function channel(options = {}) {
    const instance = lib.createWebChannelTransport().createWebChannel('https://example.test/channel', {xmlHttpFactory: factory, ...options});
    const events = [];
    for (const [name, type] of Object.entries(lib.WebChannel.EventType)) {
      instance.listen(type, e => {
        const item = {type: name};
        for (const key of ['data', 'errorCode', 'status', 'headers', 'statusCode', 'metadataKey']) {
          if (e[key] !== undefined) item[key] = json(e[key]);
        }
        events.push(item);
      });
    }
    return {channel: instance, events};
  }
  return {clock, requests, factory, context, lib, channel, flush,
    handshake(xhr = requests[0], headers = {}, data = ['c', 'SID', '', 8, 'server', 30_000]) {
      xhr.respond(chunk([[0, data]]), 200, headers);
    },
  };
}
function transcript(requests) {
  return requests.filter(r => r.sent).map(r => {
    const uri = new URL(r.url);
    uri.searchParams.delete('zx');
    uri.searchParams.sort();
    return {method: r.method, url: uri.toString(), headers: r.requestHeaders, body: r.method === 'GET' ? null : r.body, credentials: r.withCredentials};
  });
}
module.exports = {harness, Clock, FakeXhr, flush, chunk, json, transcript};
