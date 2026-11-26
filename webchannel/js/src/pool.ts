/** Copyright The Closure Library Authors. SPDX-License-Identifier: Apache-2.0 */
import type {ChannelRequest} from './request.js';

/** Starts conservatively on HTTP/1 and upgrades after the server handshake. */
export class ForwardChannelRequestPool {
  readonly requests = new Set<ChannelRequest>();
  private limit = 1;
  constructor(private readonly configuredLimit = 10) {
    const navigation = globalThis.performance?.getEntriesByType?.('navigation')[0];
    if (navigation && 'nextHopProtocol' in navigation &&
        /^(h2|h3|hq)$/.test(String(navigation.nextHopProtocol))) {
      this.limit = configuredLimit;
    }
  }
  applyClientProtocol(protocol: string): void {
    if (/spdy|quic|h2|h3/i.test(protocol)) this.limit = this.configuredLimit;
  }
  getMaxSize(): number { return this.limit; }
  isFull(): boolean { return this.requests.size >= this.limit; }
}
