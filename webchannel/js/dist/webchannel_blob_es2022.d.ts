/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/* tslint:disable */

export const EventType: {COMPLETE: string;};

export namespace WebChannel {
  export const EventType:
      {OPEN: string; CLOSE: string; ERROR: string; MESSAGE: string;};
}

export const Event: {STAT_EVENT: string;};

export const Stat: {PROXY: number; NOPROXY: number;};

export const ErrorCode: {NO_ERROR: number; HTTP_ERROR: number; TIMEOUT: number;};

export interface Headers {
  [name: string]: string|number;
}

export interface WebChannelError {
  error?: {status: string; message: string};
}



export interface WebChannelOptions {
  messageHeaders?: {
    [k: string]: never;
  };
  initMessageHeaders?: {
    [k: string]: never;
  };
  messageContentType?: string;
  messageUrlParams?: {database?: string;};
  clientProtocolHeaderRequired?: boolean;
  concurrentRequestLimit?: number;
  supportsCrossDomainXhr?: boolean;
  sendRawJson?: boolean;
  httpSessionIdParam?: string;
  encodeInitMessageHeaders?: boolean;
  forceLongPolling?: boolean;
  detectBufferingProxy?: boolean;
  longPollingTimeout?: number;
  fastHandshake?: boolean;
  disableRedac?: boolean;
  clientProfile?: string;
  internalChannelParams?: {forwardChannelRequestTimeoutMs?: number;};
  useFetchStreams?: boolean;
  xmlHttpFactory?: unknown;
  requestRefreshThresholds?: {[key: string]: number};
}

export interface EventTarget {
  listen(type: string|number, cb: (param: unknown) => void): void;
}

export interface WebChannel extends EventTarget {
  open(): void;
  close(): void;
  send(msg: unknown): void;
}

export interface StatEvent {
  stat: number;
}

export interface WebChannelTransport {
  createWebChannel(url: string, options: WebChannelOptions): WebChannel;
}

export function createWebChannelTransport(): WebChannelTransport;

export function getStatEventTarget(): EventTarget;
