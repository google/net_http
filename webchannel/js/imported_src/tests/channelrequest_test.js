/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/** @fileoverview Unit tests for ChannelRequest. */

goog.module('goog.labs.net.webChannel.channelRequestTest');
goog.setTestOnly();

const ChannelRequest = goog.require('goog.labs.net.webChannel.ChannelRequest');
const MockClock = goog.require('goog.testing.MockClock');
const PropertyReplacer = goog.require('goog.testing.PropertyReplacer');
const Uri = goog.require('goog.Uri');
const WebChannelDebug = goog.require('goog.labs.net.webChannel.WebChannelDebug');
const XhrIo = goog.require('goog.testing.net.XhrIo');
const functions = goog.require('goog.functions');
const recordFunction = goog.require('goog.testing.recordFunction');
const requestStats = goog.require('goog.labs.net.webChannel.requestStats');

let channelRequest;
let mockChannel;
let mockClock;
let stubs;
let xhrIo;
let reachabilityEvents;

/** Time to wait for a network request to time out, before aborting. */
const WATCHDOG_TIME = 2000;

/** Time to throttle readystatechange events. */
const THROTTLE_TIME = 500;

/** A really long time - used to make sure no more timeouts will fire. */
const ALL_DAY_MS = 1000 * 60 * 60 * 24;

function shouldRunTests() {
  return ChannelRequest.supportsXhrStreaming();
}

/**
 * Constructs a duck-type WebChannelBase that tracks the completed requests.
 * @final
 */
class MockWebChannelBase {
  constructor() {
    this.isClosed = () => false;
    this.isActive = () => true;
    this.usesFetchStreams = () => false;
    this.shouldUseSecondaryDomains = () => false;
    this.completedRequests = [];
    this.onRequestComplete = function(request) {
      this.completedRequests.push(request);
    };
    this.onRequestData = (request, data) => {};
  }
}

/**
 * Creates a real ChannelRequest object, with some modifications for
 * testability:
 * <ul>
 * <li>The channel is a mock channel.
 * <li>The new watchdogTimeoutCallCount property tracks onWatchDogTimeout()
 *     calls.
 * <li>The timeout is set to WATCHDOG_TIME.
 * </ul>
 */
function createChannelRequest() {
  xhrIo = new XhrIo();
  xhrIo.abort = xhrIo.abort || function() { this.active_ = false; };

  // Install mock channel and no-op debug logger.
  mockChannel = new MockWebChannelBase();
  /** @suppress {checkTypes} suppression added to enable type checking */
  channelRequest = new ChannelRequest(mockChannel, new WebChannelDebug());

  // Install test XhrIo.
  /** @suppress {checkTypes} suppression added to enable type checking */
  mockChannel.createXhrIo = () => xhrIo;

  // Install watchdogTimeoutCallCount.
  /** @suppress {checkTypes} suppression added to enable type checking */
  channelRequest.watchdogTimeoutCallCount = 0;
  /**
   * @suppress {checkTypes,visibility} suppression added to enable type
   * checking
   */
  channelRequest.originalOnWatchDogTimeout = channelRequest.onWatchDogTimeout_;
  /**
   * @suppress {visibility,checkTypes,missingProperties} suppression added to
   * enable type checking
   */
  channelRequest.onWatchDogTimeout_ = function() {
    channelRequest.watchdogTimeoutCallCount++;
    return channelRequest.originalOnWatchDogTimeout();
  };

  channelRequest.setTimeout(WATCHDOG_TIME);
}

function checkReachabilityEvents(reqMade, reqSucceeded, reqFail, backChannel) {
  expect(reachabilityEvents[requestStats.ServerReachability.REQUEST_MADE] || 0)
      .toBe(reqMade);
  expect(
      reachabilityEvents[requestStats.ServerReachability.REQUEST_SUCCEEDED] ||
      0)
      .toBe(reqSucceeded);
  expect(
      reachabilityEvents[requestStats.ServerReachability.REQUEST_FAILED] || 0)
      .toBe(reqFail);
  expect(
      reachabilityEvents[requestStats.ServerReachability
                             .BACK_CHANNEL_ACTIVITY] ||
      0)
      .toBe(backChannel);
}

describe('goog.labs.net.webChannel.channelRequestTest', () => {
  beforeEach(() => {
    mockClock = new MockClock();
    mockClock.install();
    reachabilityEvents = {};
    stubs = new PropertyReplacer();

    // Mock out the stat notification code.
    const notifyServerReachabilityEvent = (reachabilityType) => {
      if (!reachabilityEvents[reachabilityType]) {
        reachabilityEvents[reachabilityType] = 0;
      }
      reachabilityEvents[reachabilityType]++;
    };
    stubs.set(
        requestStats, 'notifyServerReachabilityEvent',
        notifyServerReachabilityEvent);
  });

  afterEach(() => {
    stubs.reset();
    mockClock.uninstall();
  });

  /**
   * Run through the lifecycle of a long lived request, checking that the right
   * network events are reported.
   */
  it('network events', () => {
    createChannelRequest();

    channelRequest.xmlHttpPost(new Uri('some_uri'), 'some_postdata', true);
    checkReachabilityEvents(1, 0, 0, 0);
    if (ChannelRequest.supportsXhrStreaming()) {
      xhrIo.simulatePartialResponse('17\nI am a BC Message');
      checkReachabilityEvents(1, 0, 0, 1);
      xhrIo.simulatePartialResponse('23\nI am another BC Message');
      checkReachabilityEvents(1, 0, 0, 2);
      xhrIo.simulateResponse(200, '16Final BC Message');
      checkReachabilityEvents(1, 1, 0, 2);
    } else {
      xhrIo.simulateResponse(200, '16Final BC Message');
      checkReachabilityEvents(1, 1, 0, 0);
    }
  });

  /** Test throttling of readystatechange events. */
  it('network events, throttle ready state change', () => {
    createChannelRequest();
    channelRequest.setReadyStateChangeThrottle(THROTTLE_TIME);

    /** @suppress {visibility} suppression added to enable type checking */
    const recordedHandler = recordFunction(channelRequest.xmlHttpHandler_);
    stubs.set(channelRequest, 'xmlHttpHandler_', recordedHandler);

    channelRequest.xmlHttpPost(new Uri('some_uri'), 'some_postdata', true);
    expect(recordedHandler.getCallCount()).toBe(1);

    checkReachabilityEvents(1, 0, 0, 0);
    if (ChannelRequest.supportsXhrStreaming()) {
      xhrIo.simulatePartialResponse('17\nI am a BC Message');
      checkReachabilityEvents(1, 0, 0, 1);
      expect(recordedHandler.getCallCount()).toBe(3);

      // Second event should be throttled
      xhrIo.simulatePartialResponse('23\nI am another BC Message');
      expect(recordedHandler.getCallCount()).toBe(3);

      xhrIo.simulatePartialResponse('27\nI am yet another BC Message');
      expect(recordedHandler.getCallCount()).toBe(3);
      mockClock.tick(THROTTLE_TIME);

      checkReachabilityEvents(1, 0, 0, 3);
      // Only one more call because of throttling.
      expect(recordedHandler.getCallCount()).toBe(4);

      xhrIo.simulateResponse(200, '16Final BC Message');
      checkReachabilityEvents(1, 1, 0, 3);
      expect(recordedHandler.getCallCount()).toBe(5);
    } else {
      xhrIo.simulateResponse(200, '16Final BC Message');
      checkReachabilityEvents(1, 1, 0, 0);
    }
  });

  /**
   * Make sure that the request "completes" with an error when the timeout
   * expires.
   * @suppress {missingProperties,visibility} suppression added to enable type
   * checking
   */
  it('request timeout', () => {
    createChannelRequest();

    channelRequest.xmlHttpPost(new Uri('some_uri'), 'some_postdata', true);
    expect(channelRequest.watchdogTimeoutCallCount).toBe(0);
    expect(channelRequest.channel_.completedRequests.length).toBe(0);

    // Watchdog timeout.
    mockClock.tick(WATCHDOG_TIME);
    expect(channelRequest.watchdogTimeoutCallCount).toBe(1);
    expect(channelRequest.channel_.completedRequests.length).toBe(1);
    expect(channelRequest.getSuccess()).toBe(false);

    // Make sure no more timers are firing.
    mockClock.tick(ALL_DAY_MS);
    expect(channelRequest.watchdogTimeoutCallCount).toBe(1);
    expect(channelRequest.channel_.completedRequests.length).toBe(1);

    checkReachabilityEvents(1, 0, 1, 0);
  });

  /**
     @suppress {missingProperties,visibility} suppression added to enable type
     checking
   */
  it('request timeout with unexpected exception', () => {
    createChannelRequest();
    /** @suppress {visibility} suppression added to enable type checking */
    channelRequest.channel_.createXhrIo = functions.error('Weird error');

    try {
      channelRequest.xmlHttpGet(new Uri('some_uri'), true, null);
      fail('Expected error');
    } catch (e) {
      expect(e.message).toBe('Weird error');
    }

    expect(channelRequest.watchdogTimeoutCallCount).toBe(0);
    expect(channelRequest.channel_.completedRequests.length).toBe(0);

    // Watchdog timeout.
    mockClock.tick(WATCHDOG_TIME);
    expect(channelRequest.watchdogTimeoutCallCount).toBe(1);
    expect(channelRequest.channel_.completedRequests.length).toBe(1);
    expect(channelRequest.getSuccess()).toBe(false);

    // Make sure no more timers are firing.
    mockClock.tick(ALL_DAY_MS);
    expect(channelRequest.watchdogTimeoutCallCount).toBe(1);
    expect(channelRequest.channel_.completedRequests.length).toBe(1);

    checkReachabilityEvents(0, 0, 1, 0);
  });
});
