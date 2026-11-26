/**
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 *
 * Adapted from imported_src and goog.net.WebChannel.
 */
export type Headers = Record<string, string | number>;
export type MessageMap = Record<string, unknown> | Map<string, unknown>;
export type MessageData = string | object;

/** A structural replacement for Closure's XmlHttpFactory. */
export interface XmlHttpFactory {
  createInstance(): XMLHttpRequest;
}

export interface WebChannelOptions {
  /** These objects remain mutable for changing headers/params after open(). */
  messageHeaders?: Headers;
  initMessageHeaders?: Headers;
  messageContentType?: string;
  messageUrlParams?: Record<string, string | number>;
  clientProtocolHeaderRequired?: boolean;
  concurrentRequestLimit?: number;
  maxMessagesPerRequest?: number;
  supportsCrossDomainXhr?: boolean;
  sendRawJson?: boolean;
  httpSessionIdParam?: string;
  httpHeadersOverwriteParam?: string;
  encodeInitMessageHeaders?: boolean;
  forceLongPolling?: boolean;
  detectBufferingProxy?: boolean;
  longPollingTimeout?: number;
  fastHandshake?: boolean;
  blockingHandshake?: boolean;
  clientProfile?: string;
  internalChannelParams?: {
    failFast?: boolean;
    baseRetryDelayMs?: number;
    retryDelaySeedMs?: number;
    forwardChannelMaxRetries?: number;
    forwardChannelRequestTimeoutMs?: number;
  };
  useFetchStreams?: boolean;
  xmlHttpFactory?: XmlHttpFactory;
  networkTestUrl?: string;
  /** Accepted for source compatibility; this implementation emits no payload logs. */
  disableRedact?: boolean;
  /** @deprecated Misspelling in the historical .d.ts; use disableRedact. */
  disableRedac?: boolean;
  /** Reserved in imported_src too: no request refresh algorithm is implemented. */
  requestRefreshThresholds?: Record<string, number>;
  /** Historical origin trials are disabled, as in the imported build. */
  enableOriginTrials?: boolean;
}

export interface RuntimeProperties {
  getConcurrentRequestLimit(): number;
  isSpdyEnabled(): boolean;
  getPendingRequestCount(): number;
  getNonAckedMessages(): MessageData[];
  getNonAckedMessageGap(): number;
  getHttpSessionId(): string | null;
  getLastResponseHeaders(): Record<string, string> | undefined;
  getLastStatusCode(): number;
  /** Called on a forward-channel acknowledgement when the pool is drained. */
  commit(callback: () => void): void;
}

export interface WebChannelError {
  error?: {status: string; message: string};
}
