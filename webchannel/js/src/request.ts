/**
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 * Native HTTP and framing replacement for imported_src/channelrequest.js.
 */
import type {Headers, WebChannelOptions} from './types.js';
import {ChunkDecoder, type QueuedMap} from './wire.js';
import {notifyServerReachabilityEvent as reach, notifyStatEvent, ServerReachability, Stat} from './stats.js';

export enum RequestError {
  STATUS = 0, NO_DATA = 1, TIMEOUT = 2, UNKNOWN_SESSION_ID = 3, BAD_DATA = 4,
}
export interface RequestObserver {
  onHeaders(request: ChannelRequest): void;
  onChunk(request: ChannelRequest, chunk: string): void;
  onFirstByte(request: ChannelRequest): void;
  onComplete(request: ChannelRequest): void;
}

export class ChannelRequest {
  readonly startTime = Date.now();
  readonly messages: QueuedMap[];
  status = -1;
  error: RequestError | null = null;
  successful = false;
  initialResponseDecoded = false;
  responseHeaders: Record<string, string> = {};
  private readonly decoder = new ChunkDecoder();
  private xhr?: XMLHttpRequest;
  private controller?: AbortController;
  private reader?: ReadableStreamDefaultReader<Uint8Array>;
  private timer?: ReturnType<typeof setTimeout>;
  private timeoutMs: number;
  private stopped = false;
  private headersReceived = false;
  private firstByte = false;

  constructor(
    readonly id: string | number,
    readonly attempt: number,
    readonly body: string | null,
    messages: QueuedMap[],
    private readonly observer: RequestObserver,
    private readonly options: WebChannelOptions,
    timeoutMs = 45_000,
  ) {
    this.messages = messages;
    this.timeoutMs = timeoutMs;
  }

  start(url: URL, headers: Headers): void {
    const uri = new URL(url);
    uri.searchParams.set('zx', Math.random().toString(36).slice(2) + Date.now().toString(36));
    uri.searchParams.set('t', String(this.attempt));
    const requestHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) requestHeaders[key] = String(value);
    if (this.body !== null) requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
    this.armTimeout();
    reach(ServerReachability.REQUEST_MADE);
    try {
      if (this.options.useFetchStreams && !this.options.xmlHttpFactory) {
        void this.sendFetch(uri, requestHeaders);
      } else {
        this.sendXhr(uri, requestHeaders);
      }
    } catch {
      this.fail(RequestError.STATUS);
    }
  }

  getHeader(name: string): string | null {
    return this.responseHeaders[name.toLowerCase()] ?? null;
  }
  resetTimeout(timeoutMs?: number): void {
    if (timeoutMs !== undefined) this.timeoutMs = timeoutMs;
    this.armTimeout();
  }
  cancel(): void {
    if (this.stopped) return;
    this.stopped = true;
    this.cleanup();
  }
  private armTimeout(): void {
    clearTimeout(this.timer);
    if (this.stopped) return;
    this.timer = setTimeout(() => {
      notifyStatEvent(Stat.REQUEST_TIMEOUT);
      this.fail(RequestError.TIMEOUT);
    }, this.timeoutMs);
  }
  private headersReady(): void {
    if (this.headersReceived || this.stopped) return;
    this.headersReceived = true;
    this.observer.onHeaders(this);
  }
  private receive(text: string): void {
    if (this.stopped || text.length === 0) return;
    this.armTimeout();
    if (!this.firstByte) {
      this.firstByte = true;
      this.observer.onFirstByte(this);
    }
    try {
      this.decoder.push(text, chunk => {
        this.observer.onChunk(this, chunk);
        reach(ServerReachability.BACK_CHANNEL_ACTIVITY);
      }, () => !this.stopped);
    } catch {
      this.fail(RequestError.BAD_DATA);
    }
  }
  private finish(): void {
    if (this.stopped) return;
    const result = this.decoder.finish();
    if (result !== 'ok') {
      this.fail(result === 'empty' ? RequestError.NO_DATA : RequestError.BAD_DATA,
                result === 'empty' ? Stat.REQUEST_NO_DATA : Stat.REQUEST_INCOMPLETE_DATA);
      return;
    }
    this.successful = true;
    this.stopped = true;
    reach(ServerReachability.REQUEST_SUCCEEDED);
    this.cleanup();
    this.observer.onComplete(this);
  }
  fail(error: RequestError, stat?: number): void {
    if (this.stopped) return;
    this.error = error;
    this.stopped = true;
    const event = stat ?? (error === RequestError.UNKNOWN_SESSION_ID ? Stat.REQUEST_UNKNOWN_SESSION_ID
      : error === RequestError.BAD_DATA ? Stat.REQUEST_BAD_DATA
      : error === RequestError.STATUS ? Stat.REQUEST_BAD_STATUS : undefined);
    if (event !== undefined) notifyStatEvent(event);
    reach(this.status > 0 ? ServerReachability.REQUEST_SUCCEEDED : ServerReachability.REQUEST_FAILED);
    this.cleanup();
    this.observer.onComplete(this);
  }
  private rejectStatus(text: string): void {
    this.fail(this.status === 400 && text.includes('Unknown SID')
      ? RequestError.UNKNOWN_SESSION_ID : RequestError.STATUS);
  }
  private cleanup(): void {
    clearTimeout(this.timer);
    this.timer = undefined;
    if (this.xhr) {
      const xhr = this.xhr;
      this.xhr = undefined;
      xhr.onreadystatechange = xhr.onerror = xhr.ontimeout = xhr.onabort = null;
      xhr.abort();
    }
    void this.reader?.cancel().catch(() => {});
    this.reader = undefined;
    this.controller?.abort();
    this.controller = undefined;
  }
  private sendXhr(url: URL, headers: Record<string, string>): void {
    const xhr = this.options.xmlHttpFactory?.createInstance() ?? new XMLHttpRequest();
    this.xhr = xhr;
    let offset = 0;
    xhr.onreadystatechange = () => {
      if (this.stopped || xhr.readyState < 2) return;
      this.status = xhr.status;
      if (this.status === 200) {
        if (!this.headersReceived) {
          this.readXhrHeaders(xhr);
          this.headersReady();
        }
        if (this.stopped) return;
        if (xhr.readyState >= 3) {
          const text = xhr.responseText;
          this.receive(text.slice(offset));
          offset = text.length;
        }
        if (xhr.readyState === 4) this.finish();
      } else if (xhr.readyState === 4) {
        this.readXhrHeaders(xhr);
        this.rejectStatus(xhr.responseText);
      }
    };
    xhr.onerror = () => this.fail(RequestError.STATUS);
    xhr.ontimeout = () => this.fail(RequestError.TIMEOUT);
    xhr.onabort = () => this.fail(RequestError.STATUS);
    xhr.open(this.body === null ? 'GET' : 'POST', url.toString(), true);
    xhr.withCredentials = !!this.options.supportsCrossDomainXhr;
    for (const [key, value] of Object.entries(headers)) xhr.setRequestHeader(key, value);
    xhr.send(this.body);
  }
  private readXhrHeaders(xhr: XMLHttpRequest): void {
    // Real XHR lists exactly the headers visible under CORS. Probing omitted
    // names individually emits "Refused to get unsafe header" in Chromium.
    if (typeof xhr.getAllResponseHeaders !== 'function') {
      // Keep the fallback for injected implementations without enumeration.
      for (const name of ['X-Client-Wire-Protocol', 'X-HTTP-Session-Id', 'X-HTTP-Initial-Response']) {
        const value = xhr.getResponseHeader(name);
        if (value !== null) this.responseHeaders[name.toLowerCase()] = value;
      }
      return;
    }
    for (const line of xhr.getAllResponseHeaders().split(/\r?\n/)) {
      const colon = line.indexOf(':');
      if (colon > 0) {
        this.responseHeaders[line.slice(0, colon).trim().toLowerCase()] = line.slice(colon + 1).trim();
      }
    }
  }
  private async sendFetch(url: URL, headers: Record<string, string>): Promise<void> {
    this.controller = new AbortController();
    try {
      const response = await fetch(url, {
        method: this.body === null ? 'GET' : 'POST', body: this.body, headers,
        credentials: this.options.supportsCrossDomainXhr ? 'include' : 'same-origin',
        signal: this.controller.signal,
      });
      if (this.stopped) return;
      this.status = response.status;
      this.responseHeaders = Object.fromEntries(response.headers.entries());
      if (response.status !== 200) {
        this.rejectStatus(await response.text());
        return;
      }
      this.headersReady();
      if (this.stopped) return;
      if (response.body) {
        const reader = response.body.getReader();
        this.reader = reader;
        try {
          const decoder = new TextDecoder();
          while (!this.stopped) {
            const {value, done} = await reader.read();
            if (this.stopped) return;
            if (done) {
              this.receive(decoder.decode());
              break;
            }
            this.receive(decoder.decode(value, {stream: true}));
          }
        } finally {
          // Release a mocked or buffered stream as well as a real fetch body.
          if (this.stopped) await reader.cancel().catch(() => {});
          reader.releaseLock();
          if (this.reader === reader) this.reader = undefined;
        }
      }
      this.finish();
    } catch {
      if (!this.stopped) this.fail(RequestError.STATUS);
    }
  }
}

/** Termination is best effort and must not keep a channel's timers alive. */
export function sendTerminate(url: URL, options: WebChannelOptions): void {
  url.searchParams.set('zx', Math.random().toString(36).slice(2));
  try {
    if (globalThis.navigator?.sendBeacon?.(url.toString(), '')) return;
  } catch { /* fall through to the next transport */ }
  if (typeof Image !== 'undefined') {
    const image = new Image();
    image.src = url.toString();
  } else if (options.xmlHttpFactory || (!options.useFetchStreams && typeof XMLHttpRequest !== 'undefined')) {
    try {
      const xhr = options.xmlHttpFactory?.createInstance() ?? new XMLHttpRequest();
      xhr.open('GET', url.toString(), true);
      xhr.send();
    } catch { /* closing must still complete locally */ }
  } else if (typeof fetch !== 'undefined') {
    void fetch(url, {keepalive: true,
      credentials: options.supportsCrossDomainXhr ? 'include' : 'same-origin'}).catch(() => {});
  }
}
