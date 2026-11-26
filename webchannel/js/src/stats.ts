/** Copyright The Closure Library Authors. SPDX-License-Identifier: Apache-2.0 */
import {ChannelEvent, EventTarget} from './events.js';

export const Event = {
  SERVER_REACHABILITY_EVENT: 'serverreachability', STAT_EVENT: 'statevent', TIMING_EVENT: 'timingevent',
} as const;
export const ServerReachability = {
  REQUEST_MADE: 1, REQUEST_SUCCEEDED: 2, REQUEST_FAILED: 3, BACK_CHANNEL_ACTIVITY: 4,
} as const;
export const Stat = {
  CONNECT_ATTEMPT: 0, ERROR_NETWORK: 1, ERROR_OTHER: 2,
  TEST_STAGE_ONE_START: 3, TEST_STAGE_TWO_START: 4, TEST_STAGE_TWO_DATA_ONE: 5,
  TEST_STAGE_TWO_DATA_TWO: 6, TEST_STAGE_TWO_DATA_BOTH: 7,
  TEST_STAGE_ONE_FAILED: 8, TEST_STAGE_TWO_FAILED: 9,
  PROXY: 10, NOPROXY: 11, REQUEST_UNKNOWN_SESSION_ID: 12, REQUEST_BAD_STATUS: 13,
  REQUEST_INCOMPLETE_DATA: 14, REQUEST_BAD_DATA: 15, REQUEST_NO_DATA: 16,
  REQUEST_TIMEOUT: 17, BACKCHANNEL_MISSING: 18, BACKCHANNEL_DEAD: 19, BROWSER_OFFLINE: 20,
} as const;
export class StatEvent extends ChannelEvent<'statevent'> {
  constructor(readonly stat: number) { super(Event.STAT_EVENT); }
}
export class TimingEvent extends ChannelEvent<'timingevent'> {
  constructor(readonly size: number, readonly rtt: number, readonly retries: number) {
    super(Event.TIMING_EVENT);
  }
}
export class ServerReachabilityEvent extends ChannelEvent<'serverreachability'> {
  constructor(readonly reachabilityType: number) { super(Event.SERVER_REACHABILITY_EVENT); }
}
const target = new EventTarget<StatEvent | TimingEvent | ServerReachabilityEvent>();
export function getStatEventTarget(): typeof target { return target; }
function dispatch(event: StatEvent | TimingEvent | ServerReachabilityEvent): void {
  // Telemetry subscribers must not prevent request cleanup or channel progress.
  try { target.dispatchEvent(event); } catch { /* isolate application callbacks */ }
}
export function notifyStatEvent(stat: number): void { dispatch(new StatEvent(stat)); }
export function notifyTimingEvent(size: number, rtt: number, retries: number): void {
  dispatch(new TimingEvent(size, rtt, retries));
}
export function notifyServerReachabilityEvent(reachability: number): void {
  dispatch(new ServerReachabilityEvent(reachability));
}
