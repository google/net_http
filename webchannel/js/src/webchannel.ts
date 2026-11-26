/**
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 * Adapted from imported_src/webchannelbase.js and webchannelbasetransport.js.
 */
import {ChannelEvent, EventTarget} from './events.js';
import type {Headers, MessageData, MessageMap, RuntimeProperties, WebChannelOptions} from './types.js';
import {CHANNEL_VERSION, QueuedMap, RAW_DATA_KEY, WireV8} from './wire.js';
import {ChannelRequest, RequestError, sendTerminate, type RequestObserver} from './request.js';
import {ForwardChannelRequestPool} from './pool.js';
import {notifyStatEvent, notifyTimingEvent, Stat} from './stats.js';
import {testNetwork} from './network.js';

export const ChannelError = {
  OK: 0, REQUEST_FAILED: 2, LOGGED_OUT: 4, NO_DATA: 5, UNKNOWN_SESSION_ID: 6,
  STOP: 7, NETWORK: 8, BAD_DATA: 10, BAD_RESPONSE: 11,
} as const;
const ChannelEventType = {OPEN: 'a', CLOSE: 'b', ERROR: 'c', MESSAGE: 'd'} as const;
const ErrorStatus = {OK: 0, NETWORK_ERROR: 1, SERVER_ERROR: 2} as const;

export class OpenEvent extends ChannelEvent<'a'> { constructor() { super(ChannelEventType.OPEN); } }
export class CloseEvent extends ChannelEvent<'b'> { constructor() { super(ChannelEventType.CLOSE); } }
export class MessageEvent extends ChannelEvent<'d'> {
  data: unknown;
  headers?: Headers;
  statusCode?: number;
  metadataKey?: string;
  constructor(value: unknown) {
    super(ChannelEventType.MESSAGE);
    if (value !== null && typeof value === 'object') {
      const data = value as Record<string, unknown>;
      if (data.__headers__) {
        this.headers = data.__headers__ as Headers;
        this.statusCode = data.__status__ as number;
        delete data.__headers__;
        delete data.__status__;
      }
      if (data.__sm__ && typeof data.__sm__ === 'object') {
        const metadata = data.__sm__ as Record<string, unknown>;
        this.metadataKey = Object.keys(metadata)[0];
        this.data = this.metadataKey ? metadata[this.metadataKey] : metadata;
        return;
      }
    }
    this.data = value;
  }
}
export class ErrorEvent extends ChannelEvent<'c'> {
  readonly status = ErrorStatus.NETWORK_ERROR;
  constructor(readonly errorCode: number) { super(ChannelEventType.ERROR); }
}
export type WebChannelEvent = OpenEvent | CloseEvent | MessageEvent | ErrorEvent;

type Task = {cancelled: boolean; timer?: ReturnType<typeof setTimeout>};
function cancelTask(task: Task | undefined): void {
  if (task) { task.cancelled = true; clearTimeout(task.timer); }
}
function schedule(callback: () => void, delay?: number): Task {
  const task: Task = {cancelled: false};
  const run = (): void => { if (!task.cancelled) callback(); };
  if (delay === undefined) queueMicrotask(run);
  else task.timer = setTimeout(run, delay);
  return task;
}
function validatePositiveInteger(value: number | undefined, name: string): void {
  if (value !== undefined && (!Number.isSafeInteger(value) || value < 1)) {
    throw new RangeError(name + ' must be a positive integer');
  }
}
function headerText(headers: Headers): string {
  return Object.entries(headers).map(([name, value]) => `${name}:${value}\r\n`).join('');
}

/** One logical channel, backed by a forward POST pool and one receiving GET. */
export class WebChannel extends EventTarget<WebChannelEvent> implements RequestObserver {
  static readonly EventType = ChannelEventType;
  static readonly ErrorStatus = ErrorStatus;
  static readonly MessageEvent = MessageEvent;
  static readonly ErrorEvent = ErrorEvent;
  static readonly X_CLIENT_PROTOCOL = 'X-Client-Protocol';
  static readonly X_CLIENT_PROTOCOL_WEB_CHANNEL = 'webchannel';
  static readonly X_CLIENT_WIRE_PROTOCOL = 'X-Client-Wire-Protocol';
  static readonly X_HTTP_SESSION_ID = 'X-HTTP-Session-Id';
  static readonly X_HTTP_INITIAL_RESPONSE = 'X-HTTP-Initial-Response';
  static readonly X_WEBCHANNEL_CONTENT_TYPE = 'X-WebChannel-Content-Type';
  static readonly X_WEBCHANNEL_CLIENT_PROFILE = 'X-WebChannel-Client-Profile';

  private state: 'init' | 'opening' | 'open' | 'closed' = 'init';
  private opened = false;
  private readonly codec = new WireV8();
  private readonly pool: ForwardChannelRequestPool;
  private readonly maxBatch: number;
  private readonly options: WebChannelOptions;
  private readonly params: Record<string, string | number>;
  private readonly headers: Headers;
  private readonly initHeaders: Headers;
  private readonly overwriteParam: string | undefined;
  private readonly sessionParam: string | undefined;
  private readonly detectBuffering: boolean;
  private readonly encodeInitHeaders: boolean;
  private streaming: boolean;
  private nextMapId = 0;
  private nextRid = Math.floor(Math.random() * 100_000);
  private queue: QueuedMap[] = [];
  private closedMessages: QueuedMap[] = [];
  private sid = '';
  private hostPrefix: string | null = null;
  private httpSessionId: string | null = null;
  private version: number = CHANNEL_VERSION;
  private lastArrayId = -1;
  private lastStatus = -1;
  private lastHeaders?: Record<string, string>;
  private forwardTask?: Task;
  private backTask?: Task;
  private deadBackTask?: Task;
  private bufferingTask?: Task;
  private back?: ChannelRequest;
  private forwardRetries = 0;
  private backRetries = 0;
  private backAttempt = 1;
  private backTimeout = 45_000;
  private handshakeRtt = 0;
  private bufferingDone = false;
  private flushCallback?: () => void;

  constructor(private readonly url: string, options: WebChannelOptions = {}) {
    super();
    validatePositiveInteger(options.concurrentRequestLimit, 'concurrentRequestLimit');
    validatePositiveInteger(options.maxMessagesPerRequest, 'maxMessagesPerRequest');
    this.options = {...options, internalChannelParams: {...options.internalChannelParams}};
    this.params = options.messageUrlParams ?? {};
    this.headers = options.messageHeaders ?? {};
    this.initHeaders = options.initMessageHeaders ?? {};
    this.overwriteParam = options.httpHeadersOverwriteParam?.trim() || undefined;
    this.sessionParam = options.httpSessionIdParam?.trim() || undefined;
    this.streaming = !options.forceLongPolling;
    this.detectBuffering = !!options.detectBufferingProxy && this.streaming && !options.fastHandshake;
    this.encodeInitHeaders = !!options.encodeInitMessageHeaders && !options.fastHandshake;
    this.pool = new ForwardChannelRequestPool(options.concurrentRequestLimit ?? 10);
    this.maxBatch = Math.min(options.maxMessagesPerRequest ?? 1000, 1000);
  }

  open(): void {
    if (this.opened || this.state === 'closed' || this.isDisposed()) throw new Error('WebChannel can only be opened once');
    this.opened = true;
    notifyStatEvent(Stat.CONNECT_ATTEMPT);
    // Resolve synchronously so invalid URLs do not fail later in a microtask.
    this.makeUrl();
    this.ensureForward();
  }
  close(): void {
    if (this.state === 'closed') return;
    const terminate = this.state === 'open' ? this.makeUrl() : undefined;
    if (terminate) {
      terminate.searchParams.set('SID', this.sid);
      terminate.searchParams.set('RID', String(this.nextRid++));
      terminate.searchParams.set('TYPE', 'terminate');
    }
    this.shutdown();
    if (terminate) sendTerminate(terminate, this.options);
    this.emit(new CloseEvent());
  }
  halfClose(): never { throw new Error('Not implemented'); }
  send(message: MessageData): void {
    if (this.state === 'closed' || this.isDisposed()) throw new Error('Cannot send on a closed WebChannel');
    if (message === null || (typeof message !== 'string' && typeof message !== 'object')) {
      throw new TypeError('Only object or string messages are supported');
    }
    const map = typeof message === 'string' ? {[RAW_DATA_KEY]: message}
      : this.options.sendRawJson ? {[RAW_DATA_KEY]: JSON.stringify(message)} : message as MessageMap;
    this.queue.push(new QueuedMap(this.nextMapId++, map, typeof message === 'string' ? message : undefined));
    if (this.state === 'open') this.ensureForward();
  }
  override dispose(): void {
    if (this.isDisposed()) return;
    // Like the original wrapper, dispose does not dispatch CLOSE.
    this.removeAllListeners();
    this.close();
    super.dispose();
  }
  getRuntimeProperties(): RuntimeProperties {
    return {
      getConcurrentRequestLimit: () => this.pool.getMaxSize(),
      isSpdyEnabled: () => this.pool.getMaxSize() > 1,
      getPendingRequestCount: () => this.pool.requests.size,
      getNonAckedMessages: () => this.nonAcked().map(item => item.rawString ?? this.toMessage(item.map)),
      getNonAckedMessageGap: () => {
        const pending = this.nonAcked();
        return pending.length ? this.nextMapId - pending.reduce((min, item) => Math.min(min, item.mapId), Infinity) : 0;
      },
      getHttpSessionId: () => this.httpSessionId,
      getLastStatusCode: () => this.lastStatus,
      getLastResponseHeaders: () => this.lastHeaders,
      commit: callback => { this.flushCallback = callback; },
    };
  }
  private isClosed(): boolean { return this.state === 'closed'; }
  private toMessage(map: MessageMap): MessageData {
    const value = map instanceof Map ? map.get(RAW_DATA_KEY) : map[RAW_DATA_KEY];
    if (typeof value === 'string') return this.options.sendRawJson ? JSON.parse(value) as MessageData : value;
    return map;
  }
  private nonAcked(): QueuedMap[] {
    if (this.state === 'closed') return this.closedMessages;
    return [...this.pool.requests].flatMap(request => request.messages).concat(this.queue);
  }
  private emit(event: WebChannelEvent): void {
    // The old transport isolates application listener exceptions from HTTP processing.
    try { this.dispatchEvent(event); } catch { /* the protocol must still make progress */ }
  }
  private makeUrl(back = false): URL {
    const uri = new URL(this.url, globalThis.location?.href);
    uri.hash = '';
    if (back && this.hostPrefix && this.options.supportsCrossDomainXhr) {
      uri.hostname = this.hostPrefix + '.' + uri.hostname;
    }
    uri.searchParams.set('VER', String(this.version));
    for (const [key, value] of Object.entries(this.params)) {
      if (key !== this.sessionParam) uri.searchParams.set(key, String(value));
    }
    if (this.sessionParam && this.httpSessionId) uri.searchParams.set(this.sessionParam, this.httpSessionId);
    return uri;
  }
  private requestHeaders(initial: boolean): Headers {
    const headers = {...this.headers};
    if (this.options.clientProtocolHeaderRequired) headers[WebChannel.X_CLIENT_PROTOCOL] = 'webchannel';
    if (initial) {
      Object.assign(headers, this.initHeaders);
      if (this.options.messageContentType) headers[WebChannel.X_WEBCHANNEL_CONTENT_TYPE] = this.options.messageContentType;
      if (this.options.clientProfile) headers[WebChannel.X_WEBCHANNEL_CLIENT_PROFILE] = this.options.clientProfile;
    }
    return headers;
  }
  private ensureForward(): void {
    if (this.state === 'closed' || this.pool.isFull() || this.forwardTask) return;
    this.forwardRetries = 0;
    this.forwardTask = schedule(() => {
      this.forwardTask = undefined;
      this.startForward();
    });
  }
  private fastHandshakeCount(): number {
    let total = 0;
    const count = Math.min(this.queue.length, this.maxBatch);
    for (let i = 0; i < count; i++) {
      const size = this.queue[i].getRawDataSize();
      if (size === undefined) return this.maxBatch;
      total += size;
      if (total > 4096) return i;
    }
    return count;
  }
  private startForward(retry?: ChannelRequest): void {
    if (this.state === 'closed' || this.pool.isFull()) return;
    const initial = this.state === 'init';
    if (!initial && (this.state !== 'open' || this.queue.length === 0)) return;
    if (initial) this.state = 'opening';
    const id = retry?.id ?? this.nextRid++;
    const uri = this.makeUrl();
    uri.searchParams.set('RID', String(id));
    if (initial) {
      uri.searchParams.set('CVER', '22');
      if (this.sessionParam) uri.searchParams.set(WebChannel.X_HTTP_SESSION_ID, this.sessionParam);
      if (this.options.blockingHandshake) uri.searchParams.set('TYPE', 'init');
    } else {
      uri.searchParams.set('SID', this.sid);
      uri.searchParams.set('AID', String(this.lastArrayId));
    }
    const count = Math.min(this.queue.length,
      initial && this.options.fastHandshake ? this.fastHandshakeCount() : this.maxBatch);
    let body: string | null = this.codec.encodeMessageQueue(this.queue, count);
    const messages = this.queue.splice(0, count);
    let headers = this.requestHeaders(initial);
    if (initial && this.encodeInitHeaders) {
      body = 'headers=' + encodeURIComponent(headerText(headers)) + '&' + body;
      headers = {};
    } else if (this.overwriteParam) {
      if (Object.keys(headers).length) uri.searchParams.set(this.overwriteParam, headerText(headers));
      headers = {};
    }
    if (initial && this.options.fastHandshake) {
      uri.searchParams.set('$req', body);
      uri.searchParams.set('SID', 'null');
      body = null;
    }
    const timeout = initial ? 45_000
      : Math.round((this.options.internalChannelParams?.forwardChannelRequestTimeoutMs ?? 20_000) * (0.5 + 0.5 * Math.random()));
    const request = new ChannelRequest(id, retry ? this.forwardRetries + 1 : 1,
      body, messages, this, this.options, timeout);
    this.pool.requests.add(request);
    request.start(uri, headers);
  }
  private ensureBack(): void {
    if (this.state !== 'open' || this.back || this.backTask) return;
    this.backAttempt = 1;
    this.backRetries = 0;
    this.backTask = schedule(() => { this.backTask = undefined; this.startBack(); });
  }
  private startBack(): void {
    if (this.state !== 'open' || this.back) return;
    const uri = this.makeUrl(true);
    uri.searchParams.set('RID', 'rpc');
    uri.searchParams.set('SID', this.sid);
    uri.searchParams.set('AID', String(this.lastArrayId));
    uri.searchParams.set('CI', this.streaming ? '0' : '1');
    uri.searchParams.set('TYPE', 'xmlhttp');
    if (!this.streaming && (this.options.longPollingTimeout ?? 0) > 0) {
      uri.searchParams.set('TO', String(this.options.longPollingTimeout));
    }
    let headers = this.requestHeaders(false);
    if (this.overwriteParam) {
      if (Object.keys(headers).length) uri.searchParams.set(this.overwriteParam, headerText(headers));
      headers = {};
    }
    const request = new ChannelRequest('rpc', this.backAttempt, null, [], this, this.options, this.backTimeout);
    this.back = request;
    if (this.detectBuffering && !this.bufferingDone && this.handshakeRtt > 0) {
      this.bufferingTask = schedule(() => {
        this.bufferingTask = undefined;
        this.streaming = false;
        this.bufferingDone = true;
        notifyStatEvent(Stat.PROXY);
        this.cancelBack();
        this.startBack();
      }, 4 * this.handshakeRtt);
    }
    request.start(uri, headers);
  }
  onHeaders(request: ChannelRequest): void {
    if (!this.pool.requests.has(request) || this.state !== 'opening' || !this.options.fastHandshake) return;
    const response = request.getHeader(WebChannel.X_HTTP_INITIAL_RESPONSE);
    if (!response?.trim()) {
      request.fail(RequestError.UNKNOWN_SESSION_ID);
      return;
    }
    request.initialResponseDecoded = true;
    this.onChunk(request, response);
  }
  onFirstByte(request: ChannelRequest): void {
    if (request === this.back && this.detectBuffering && !this.bufferingDone) {
      cancelTask(this.bufferingTask);
      this.bufferingTask = undefined;
      this.bufferingDone = true;
      notifyStatEvent(Stat.NOPROXY);
    }
  }
  onChunk(request: ChannelRequest, text: string): void {
    if (this.state === 'closed' || (request !== this.back && !this.pool.requests.has(request))) return;
    const forwardAck = this.state === 'open' && this.pool.requests.has(request) && !request.initialResponseDecoded;
    let response: unknown[];
    try { response = this.codec.decodeMessage(text); }
    catch { this.fail(forwardAck ? ChannelError.BAD_RESPONSE : ChannelError.BAD_DATA); return; }
    if (forwardAck) {
      if (response.length !== 3 || !response.every(value => typeof value === 'number' && Number.isFinite(value))) {
        this.fail(ChannelError.BAD_RESPONSE);
        return;
      }
      this.handleAck(response as number[], request);
      if (!this.isClosed() && this.pool.requests.size <= 1 && this.flushCallback) {
        const callback = this.flushCallback;
        this.flushCallback = undefined;
        try { callback(); } catch { /* callbacks cannot interrupt receive processing */ }
      }
      return;
    }
    cancelTask(this.deadBackTask);
    this.deadBackTask = undefined;
    for (const entry of response) {
      if (this.isClosed()) break;
      if (!Array.isArray(entry) || entry.length !== 2 || !Number.isSafeInteger(entry[0]) || entry[0] < 0) {
        this.fail(ChannelError.BAD_DATA);
        break;
      }
      const [arrayId, data] = entry as [number, unknown];
      if (arrayId <= this.lastArrayId) continue;
      this.lastArrayId = arrayId;
      const command = Array.isArray(data) ? data[0] : undefined;
      if (this.state === 'opening') {
        if (command === 'c') this.acceptHandshake(data as unknown[], request);
        else if (command === 'stop' || command === 'close') this.fail(ChannelError.STOP);
        else this.fail(ChannelError.BAD_RESPONSE);
      } else if (this.state === 'open') {
        this.backRetries = 0;
        if (command === 'stop') this.fail(ChannelError.STOP);
        else if (command === 'close') this.close();
        else if (command !== 'noop') this.emit(new MessageEvent(data));
      }
    }
  }
  private acceptHandshake(data: unknown[], request: ChannelRequest): void {
    if (typeof data[1] !== 'string' || !data[1] || (data[2] != null && typeof data[2] !== 'string') ||
        (data[3] != null && data[3] !== CHANNEL_VERSION)) {
      this.fail(ChannelError.BAD_RESPONSE);
      return;
    }
    this.sid = data[1];
    this.hostPrefix = data[2] as string | null;
    this.version = typeof data[3] === 'number' ? data[3] : CHANNEL_VERSION;
    if (typeof data[5] === 'number' && data[5] > 0) this.backTimeout = 1.5 * data[5];
    const protocol = request.getHeader(WebChannel.X_CLIENT_WIRE_PROTOCOL);
    if (protocol) this.pool.applyClientProtocol(protocol);
    if (this.sessionParam) this.httpSessionId = request.getHeader(WebChannel.X_HTTP_SESSION_ID);
    this.handshakeRtt = Date.now() - request.startTime;
    this.state = 'open';
    this.emit(new OpenEvent());
    if (this.state !== 'open') return; // close()/dispose() from the OPEN listener
    if (request.initialResponseDecoded) {
      this.pool.requests.delete(request);
      this.back = request;
      request.resetTimeout(this.backTimeout);
    } else {
      this.ensureBack();
    }
    if (this.queue.length) this.ensureForward();
  }
  private handleAck(values: number[], forward: ChannelRequest): void {
    if (values[0] === 0) {
      if (this.backTask) return;
      if (this.back && this.back.startTime + 3000 >= forward.startTime) return;
      this.cancelBack();
      this.retryBack();
      notifyStatEvent(Stat.BACKCHANNEL_MISSING);
    } else if (values[1] > this.lastArrayId && values[2] < 37_500 && this.streaming && this.backRetries === 0) {
      if (!this.deadBackTask) this.deadBackTask = schedule(() => {
        this.deadBackTask = undefined;
        this.cancelBack();
        this.retryBack();
        notifyStatEvent(Stat.BACKCHANNEL_DEAD);
      }, 6000);
    }
  }
  onComplete(request: ChannelRequest): void {
    const isBack = this.back === request;
    if (isBack) {
      this.back = undefined;
      cancelTask(this.deadBackTask);
      cancelTask(this.bufferingTask);
      this.deadBackTask = this.bufferingTask = undefined;
    } else if (!this.pool.requests.delete(request)) return;
    if (this.state === 'closed') return;
    if (request.successful) {
      if (isBack) this.ensureBack();
      else {
        if (this.state === 'opening') {
          this.queue.unshift(...request.messages);
          this.fail(ChannelError.BAD_RESPONSE);
          return;
        }
        notifyTimingEvent(request.body?.length ?? 0, Date.now() - request.startTime, this.forwardRetries);
        this.ensureForward();
      }
      return;
    }
    const fatal = request.error === RequestError.UNKNOWN_SESSION_ID ||
      (request.error === RequestError.STATUS && request.status > 0);
    if (!isBack) this.queue.unshift(...request.messages);
    if (!fatal && (isBack ? this.retryBack() : this.retryForward(request))) return;
    if (request.status > 200) {
      this.lastStatus = request.status;
      this.lastHeaders = {...request.responseHeaders};
    }
    this.fail(request.error === RequestError.NO_DATA ? ChannelError.NO_DATA
      : request.error === RequestError.BAD_DATA ? ChannelError.BAD_DATA
      : request.error === RequestError.UNKNOWN_SESSION_ID ? ChannelError.UNKNOWN_SESSION_ID
      : ChannelError.REQUEST_FAILED);
  }
  private retryDelay(retries: number): number {
    const params = this.options.internalChannelParams;
    return ((params?.baseRetryDelayMs ?? 5000) + Math.floor(Math.random() * (params?.retryDelaySeedMs ?? 10_000))) * retries;
  }
  private retryForward(request: ChannelRequest): boolean {
    if (this.state !== 'open') return false;
    if (this.forwardTask) return true;
    const max = this.options.internalChannelParams?.failFast ? 0
      : this.options.internalChannelParams?.forwardChannelMaxRetries ?? 2;
    if (this.forwardRetries >= max) return false;
    const delay = this.retryDelay(this.forwardRetries++);
    this.forwardTask = schedule(() => {
      this.forwardTask = undefined;
      this.startForward(request);
    }, delay);
    return true;
  }
  private retryBack(): boolean {
    if (this.state !== 'open' || this.back || this.backTask || this.backRetries >= 3) return false;
    this.backAttempt++;
    const delay = this.retryDelay(this.backRetries++);
    this.backTask = schedule(() => { this.backTask = undefined; this.startBack(); }, delay);
    return true;
  }
  private cancelBack(): void {
    cancelTask(this.bufferingTask);
    cancelTask(this.deadBackTask);
    this.bufferingTask = this.deadBackTask = undefined;
    this.back?.cancel();
    this.back = undefined;
  }
  private fail(error: number): void {
    if (this.state === 'closed') return;
    this.shutdown();
    this.emit(new ErrorEvent(error));
    this.emit(new CloseEvent());
    if (error === ChannelError.REQUEST_FAILED) testNetwork(this.options.networkTestUrl);
    else notifyStatEvent(Stat.ERROR_OTHER);
  }
  private shutdown(): void {
    this.closedMessages = this.nonAcked();
    this.state = 'closed';
    cancelTask(this.forwardTask);
    cancelTask(this.backTask);
    this.forwardTask = this.backTask = undefined;
    this.cancelBack();
    for (const request of this.pool.requests) request.cancel();
    this.pool.requests.clear();
    this.queue = [];
    this.flushCallback = undefined;
  }
}

export interface WebChannelTransport {
  createWebChannel(url: string, options?: WebChannelOptions): WebChannel;
}
export function createWebChannelTransport(): WebChannelTransport {
  return {createWebChannel: (url, options) => new WebChannel(url, options)};
}
