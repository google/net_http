/** Copyright The Closure Library Authors. SPDX-License-Identifier: Apache-2.0 */
export {WebChannel, createWebChannelTransport, ChannelError, OpenEvent, CloseEvent,
  MessageEvent, ErrorEvent} from './webchannel.js';
export type {WebChannelEvent, WebChannelTransport} from './webchannel.js';
export {Event, Stat, ServerReachability, StatEvent, TimingEvent, ServerReachabilityEvent,
  getStatEventTarget} from './stats.js';
export {EventTarget, ChannelEvent} from './events.js';
export type {Headers, MessageData, MessageMap, XmlHttpFactory, WebChannelOptions,
  RuntimeProperties, WebChannelError} from './types.js';

// Retained numeric values for consumers of the historical bundle's exports.
export const ErrorCode = {
  NO_ERROR: 0, ACCESS_DENIED: 1, FILE_NOT_FOUND: 2, FF_SILENT_ERROR: 3, CUSTOM_ERROR: 4,
  EXCEPTION: 5, HTTP_ERROR: 6, ABORT: 7, TIMEOUT: 8, OFFLINE: 9,
  getDebugMessage(code: number): string {
    const messages: Record<number, string> = {
      0: 'No Error', 1: 'Access denied to content document', 2: 'File not found',
      3: 'Firefox silently errored', 4: 'Application custom error', 5: 'An exception occurred',
      6: 'Http response at 400 or 500 level', 7: 'Request was aborted',
      8: 'Request timed out', 9: 'The resource is not available offline',
    };
    return messages[code] ?? 'Unrecognized error code';
  },
} as const;
export const EventType = {
  COMPLETE: 'complete', SUCCESS: 'success', ERROR: 'error', ABORT: 'abort', READY: 'ready',
  READY_STATE_CHANGE: 'readystatechange', TIMEOUT: 'timeout', INCREMENTAL_DATA: 'incrementaldata',
  PROGRESS: 'progress', DOWNLOAD_PROGRESS: 'downloadprogress', UPLOAD_PROGRESS: 'uploadprogress',
} as const;
