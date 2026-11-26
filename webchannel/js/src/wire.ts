/**
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 * Adapted from imported_src/wire.js and wirev8.js.
 */
import type {MessageMap} from './types.js';

export const CHANNEL_VERSION = 8;
export const RAW_DATA_KEY = '__data__';

export class QueuedMap {
  constructor(readonly mapId: number, readonly map: MessageMap, readonly rawString?: string) {}
  getRawDataSize(): number | undefined {
    const value = this.map instanceof Map ? this.map.get(RAW_DATA_KEY) : this.map[RAW_DATA_KEY];
    return typeof value === 'string' ? value.length : undefined;
  }
}

export class WireV8 {
  encodeMessage(message: MessageMap, buffer: string[], prefix = ''): void {
    try {
      for (const [key, value] of message instanceof Map ? message : Object.entries(message)) {
        const encoded = value !== null && (typeof value === 'object' || typeof value === 'function')
          ? JSON.stringify(value) : value;
        // Keys are protocol field names: the original codec only escapes values.
        buffer.push(prefix + key + '=' + encodeURIComponent(String(encoded)));
      }
    } catch (error) {
      buffer.push(prefix + 'type=_badmap');
      throw error;
    }
  }
  encodeMessageQueue(queue: readonly QueuedMap[], count: number,
                     badMapHandler?: (map: MessageMap) => void): string {
    let offset = count > 0 ? queue[0].mapId : 0;
    for (;;) {
      const buffer = ['count=' + count];
      if (count > 0) buffer.push('ofs=' + offset);
      let done = true;
      for (let i = 0; i < count; i++) {
        const item = queue[i];
        if (item.mapId < offset) {
          offset = Math.max(0, item.mapId - 100);
          done = false;
          continue;
        }
        try { this.encodeMessage(item.map, buffer, 'req' + (item.mapId - offset) + '_'); }
        catch { badMapHandler?.(item.map); }
      }
      if (done) return buffer.join('&');
    }
  }
  decodeMessage(text: string): unknown[] {
    const value: unknown = JSON.parse(text);
    if (!Array.isArray(value)) throw new Error('Expected an array in WebChannel response');
    return value;
  }
}

/** Chunk lengths count JavaScript UTF-16 code units, not UTF-8 bytes. */
export class ChunkDecoder {
  private buffer = '';
  private received = false;
  push(text: string, onChunk: (chunk: string) => void, isActive = () => true): void {
    this.received ||= text.length > 0;
    this.buffer += text;
    while (isActive() && this.buffer.length > 0) {
      const newline = this.buffer.indexOf('\n');
      if (newline === -1) return;
      const header = this.buffer.slice(0, newline);
      // Reject negative/fractional/infinite sizes instead of looping or slicing backwards.
      if (!/^\d+$/.test(header)) throw new Error('Invalid WebChannel chunk length');
      const size = Number(header);
      if (!Number.isSafeInteger(size)) throw new Error('Invalid WebChannel chunk length');
      const end = newline + 1 + size;
      if (end > this.buffer.length) return;
      const chunk = this.buffer.slice(newline + 1, end);
      this.buffer = this.buffer.slice(end);
      onChunk(chunk);
    }
  }
  finish(): 'ok' | 'empty' | 'incomplete' {
    return this.buffer.length ? 'incomplete' : this.received ? 'ok' : 'empty';
  }
}
