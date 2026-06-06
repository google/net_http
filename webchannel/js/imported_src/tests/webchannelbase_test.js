/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Unit tests for WebChannelBase.@suppress {accessControls}
 * Private methods are accessed for test purposes.
 */

goog.module('goog.labs.net.webChannel.webChannelBaseTest');
goog.setTestOnly();

const ChannelRequest = goog.require('goog.labs.net.webChannel.ChannelRequest');
const ForwardChannelRequestPool = goog.require('goog.labs.net.webChannel.ForwardChannelRequestPool');
const MockClock = goog.require('goog.testing.MockClock');
const PropertyReplacer = goog.require('goog.testing.PropertyReplacer');
const StructsMap = goog.require('goog.structs.Map');
const Timer = goog.require('goog.Timer');
const Uri = goog.requireType('goog.Uri');
const WebChannelBase = goog.require('goog.labs.net.webChannel.WebChannelBase');
const WebChannelBaseTransport = goog.require('goog.labs.net.webChannel.WebChannelBaseTransport');
const WebChannelDebug = goog.require('goog.labs.net.webChannel.WebChannelDebug');
const Wire = goog.require('goog.labs.net.webChannel.Wire');
const XhrIo = goog.requireType('goog.net.XhrIo');
const dom = goog.require('goog.dom');
const functions = goog.require('goog.functions');
const googArray = goog.require('goog.array');
const googJson = goog.require('goog.json');
const netUtils = goog.require('goog.labs.net.webChannel.netUtils');
const requestStats = goog.require('goog.labs.net.webChannel.requestStats');

/** Delay between a network failure and the next network request. */
const RETRY_TIME = 1000;

/** A really long time - used to make sure no more timeouts will fire. */
const ALL_DAY_MS = 1000 * 60 * 60 * 24;

const DEFAULT_ERROR_HTTP_STATUS_CODE = 503;

const stubs = new PropertyReplacer();

let channel;
let deliveredMaps;
let handledMessages;
let handler;
let mockClock;
let gotError;
let numStatEvents;
let lastStatEvent;
let numTimingEvents;
let lastPostSize;
let lastPostRtt;
let lastPostRetryCount;

// Set to true to see the channel debug output in the browser window.
const debug = false;
// Debug message to print out when debug is true.
let debugMessage = '';

function debugToWindow(message) {
  if (debug) {
    debugMessage += `${message}<br>`;
    dom.getElement('debug').innerHTML = debugMessage;
  }
}

/**
 * Stubs netUtils to always time out. It maintains the
 * contract given by netUtils.testNetwork, but always
 * times out (calling callback(false)).
 * stubNetUtils should be called in tests that require it before
 * a call to testNetwork happens. It is reset at tearDown.
 */
function stubNetUtils() {
  stubs.set(netUtils, 'testLoadImage', (url, timeout, callback) => {
    Timer.callOnce(goog.partial(callback, false), timeout);
  });
}

/**
 * Stubs
 * ForwardChannelRequestPool.isSpdyOrHttp2Enabled_ to
 * manage the max pool size for the forward channel.
 * @param {boolean} spdyEnabled Whether SPDY is enabled for the test.
 */
function stubSpdyCheck(spdyEnabled) {
  stubs.set(
      ForwardChannelRequestPool, 'isSpdyOrHttp2Enabled_', () => spdyEnabled);
}

/**
 * Mock ChannelRequest.
 * @final
 */
class MockChannelRequest {
  constructor(
      channel, channelDebug, sessionId = undefined, requestId = undefined,
      retryId = undefined) {
    this.channel_ = channel;
    this.channelDebug_ = channelDebug;
    this.sessionId_ = sessionId;
    this.requestId_ = requestId;
    this.successful_ = true;
    this.lastError_ = null;
    this.lastStatusCode_ = 200;
    this.errorResponseHeaders_ = undefined;

    // For debugging, keep track of whether this is a back or forward channel.
    this.isBack = !!(requestId == 'rpc');
    this.isForward = !this.isBack;

    this.pendingMessages_ = [];

    this.postData_ = null;
    this.requestStartTime_ = null;
  }

  /** @param {?Object} extraHeaders The HTTP headers. */
  setExtraHeaders(extraHeaders) {}

  /** @param {number} timeout The timeout in MS for when we fail the request. */
  setTimeout(timeout) {}

  /**
   * @param {number} throttle The throttle in ms. A value of zero indicates no
   *     throttle.
   */
  setReadyStateChangeThrottle(throttle) {}

  /**
   * @param {?Uri} uri The uri of the request.
   * @param {?string} postData The data for the post body.
   * @param {boolean} decodeChunks Whether to the result is expected to be
   *     encoded for chunking and thus requires decoding.
   */
  xmlHttpPost(uri, postData, decodeChunks) {
    this.channelDebug_.debug(`---> POST: ${uri}, ${postData}, ${decodeChunks}`);
    this.postData_ = postData;
    this.requestStartTime_ = Date.now();
  }

  /**
   * @param {?Uri} uri The uri of the request.
   * @param {boolean} decodeChunks Whether to the result is expected to be
   *     encoded for chunking and thus requires decoding.
   * @param {?string} hostPrefix The host prefix, if we might be using a
   *     secondary domain. Note that it should also be in the URL, adding this
   *     won't cause it to be added to the URL.
   */
  xmlHttpGet(uri, decodeChunks, hostPrefix) {
    this.channelDebug_.debug(
        `<--- GET: ${uri}, ${decodeChunks}, ${hostPrefix}`);
    this.requestStartTime_ = Date.now();
  }

  /** @param {?Uri} uri The uri to send a request to. */
  sendCloseRequest(uri) {
    this.requestStartTime_ = Date.now();
  }

  /** Cancel. */
  cancel() {
    this.successful_ = false;
  }

  /** @return {boolean} */
  getSuccess() {
    return this.successful_;
  }

  /** @return {?ChannelRequest.Error} The last error. */
  getLastError() {
    return this.lastError_;
  }

  /** @return {!Object<string, string>|undefined} Error response headers. */
  getErrorResponseHeaders() {
    return this.errorResponseHeaders_;
  }

  /** @return {number} The status code of the last request. */
  getLastStatusCode() {
    return this.lastStatusCode_;
  }

  /** @return {string|undefined} The session ID. */
  getSessionId() {
    return this.sessionId_;
  }

  /** @return {string|number|undefined} The request ID. */
  getRequestId() {
    return this.requestId_;
  }

  /** @return {?string} The POST data provided by the request initiator. */
  getPostData() {
    return this.postData_;
  }

  /**
   * @return {?number} The time the request started, as returned by Date.now().
   */
  getRequestStartTime() {
    return this.requestStartTime_;
  }

  /** @return {?XhrIo} Any XhrIo request created for this object. */
  getXhr() {
    return null;
  }

  /**
   * @param {!Array<?Wire.QueuedMap>} messages The pending messages for this
   *     request.
   */
  setPendingMessages(messages) {
    this.pendingMessages_ = messages;
  }

  /**
   * @return {!Array<?Wire.QueuedMap>} The pending messages for this request.
   */
  getPendingMessages() {
    return this.pendingMessages_;
  }

  /** @return {boolean} true if X_HTTP_INITIAL_RESPONSE has been handled. */
  isInitialResponseDecoded() {
    return false;
  }

  /** Decodes X_HTTP_INITIAL_RESPONSE if present. */
  setDecodeInitialResponse() {}
}

function getSingleForwardRequest() {
  /** @suppress {visibility} Accessing private properties. */
  const pool = channel.forwardChannelRequestPool_;
  if (!pool.hasPendingRequest()) {
    return null;
  }
  return pool.request_ || pool.requestPool_.getValues()[0];
}

/**
 * Helper function to return a formatted string representing an array of maps.
 */
function formatArrayOfMaps(arrayOfMaps) {
  const result = [];
  for (let i = 0; i < arrayOfMaps.length; i++) {
    const map = arrayOfMaps[i];

    if (Object.getPrototypeOf(map.map) === Object.prototype) {  // Object map
      for (const key in map.map) {
        const tmp =
            key + ':' + map.map[key] + (map.context ? ':' + map.context : '');
        result.push(tmp);
      }
    } else if (
        typeof map.map.keys === 'function' &&
        typeof map.map.get === 'function') {  // MapLike
      for (const key of map.map.keys()) {
        const tmp = key + ':' + map.map.get(key) +
            (map.context ? ':' + map.context : '');
        result.push(tmp);
      }
    } else {
      throw new Error('Unknown input type for map: ' + String(map));
    }
  }
  return result.join(', ');
}

/**
 * @param {number=} serverVersion
 * @param {string=} hostPrefix
 * @param {string=} opt_uriPrefix
 * @param {boolean=} spdyEnabled
 */
function connectForwardChannel(
    serverVersion = undefined, hostPrefix = undefined, opt_uriPrefix,
    spdyEnabled = undefined) {
  stubSpdyCheck(!!spdyEnabled);
  const uriPrefix = opt_uriPrefix || '';
  channel.connect(`${uriPrefix}/bind`, null);
  mockClock.tick(0);
  completeForwardChannel(serverVersion, hostPrefix);
}

/**
 * @param {number=} serverVersion
 * @param {string=} hostPrefix
 * @param {string=} uriPrefix
 * @param {boolean=} spdyEnabled
 */
function connect(
    serverVersion = undefined, hostPrefix = undefined, uriPrefix = undefined,
    spdyEnabled = undefined) {
  connectForwardChannel(serverVersion, hostPrefix, uriPrefix, spdyEnabled);
  completeBackChannel();
}

function disconnect() {
  channel.disconnect();
  mockClock.tick(0);
}

/**
 * @param {number=} serverVersion
 * @param {string=} hostPrefix
 */
function completeForwardChannel(
    serverVersion = undefined, hostPrefix = undefined) {
  const responseData = '[[0,["c","1234567890ABCDEF",' +
      (hostPrefix ? `"${hostPrefix}"` : 'null') +
      (serverVersion ? `,${serverVersion}` : '') + ']]]';
  channel.onRequestData(getSingleForwardRequest(), responseData);
  channel.onRequestComplete(getSingleForwardRequest());
  mockClock.tick(0);
}

/** @suppress {visibility} Accessing private properties. */
function completeBackChannel() {
  channel.onRequestData(channel.backChannelRequest_, '[[1,["foo"]]]');
  channel.onRequestComplete(channel.backChannelRequest_);
  mockClock.tick(0);
}

function responseDone() {
  channel.onRequestData(getSingleForwardRequest(), '[1,0,0]');  // mock data
  channel.onRequestComplete(getSingleForwardRequest());
  mockClock.tick(0);
}

/**
 * @param {number=} lastArrayIdSentFromServer
 * @param {number=} outstandingDataSize
 */
function responseNoBackchannel(
    lastArrayIdSentFromServer = undefined, outstandingDataSize = undefined) {
  const responseData =
      googJson.serialize([0, lastArrayIdSentFromServer, outstandingDataSize]);
  channel.onRequestData(getSingleForwardRequest(), responseData);
  channel.onRequestComplete(getSingleForwardRequest());
  mockClock.tick(0);
}

function response(lastArrayIdSentFromServer, outstandingDataSize) {
  const responseData =
      googJson.serialize([1, lastArrayIdSentFromServer, outstandingDataSize]);
  channel.onRequestData(getSingleForwardRequest(), responseData);
  channel.onRequestComplete(getSingleForwardRequest());
  mockClock.tick(0);
}

/** @suppress {visibility} Accessing private properties. */
function receive(data) {
  channel.onRequestData(channel.backChannelRequest_, `[[1,${data}]]`);
  channel.onRequestComplete(channel.backChannelRequest_);
  mockClock.tick(0);
}

/** @suppress {visibility} Accessing private properties. */
function receiveData(data) {
  channel.onRequestData(channel.backChannelRequest_, data);
  channel.onRequestComplete(channel.backChannelRequest_);
  mockClock.tick(0);
}

function responseTimeout() {
  getSingleForwardRequest().lastError_ = ChannelRequest.Error.TIMEOUT;
  getSingleForwardRequest().successful_ = false;
  channel.onRequestComplete(getSingleForwardRequest());
  mockClock.tick(0);
}

/** Fails the first forward request. */
function responseRequestFailed() {
  getSingleForwardRequest().lastError_ = ChannelRequest.Error.STATUS;
  getSingleForwardRequest().lastStatusCode_ = DEFAULT_ERROR_HTTP_STATUS_CODE;
  getSingleForwardRequest().successful_ = false;
  channel.onRequestComplete(getSingleForwardRequest());
  mockClock.tick(0);
}

function responseUnknownSessionId() {
  getSingleForwardRequest().lastError_ =
      ChannelRequest.Error.UNKNOWN_SESSION_ID;
  getSingleForwardRequest().successful_ = false;
  channel.onRequestComplete(getSingleForwardRequest());
  mockClock.tick(0);
}

/**
 * Enum for map types to test.
 * @enum {number}
 */
const MapTypes = {
  OBJECT_MAP: 0,
  STRUCTS_MAP: 1,
  ES6_MAP: 2,
};

/**
 * @param {string} key
 * @param {string} value
 * @param {string=} context
 * @param {!MapTypes=} mapType
 */
function sendMap(
    key, value, context = undefined, mapType = MapTypes.OBJECT_MAP) {
  let map;
  if (mapType == MapTypes.OBJECT_MAP) {
    map = {};
    map[key] = value;
  } else if (mapType == MapTypes.STRUCTS_MAP) {
    map = new StructsMap();
    map.set(key, value);
  } else if (mapType == MapTypes.ES6_MAP) {
    map = new Map();
    map.set(key, value);
  } else {
    throw new Error('Unsupported map type :)');
  }

  channel.sendMap(map, context);
  mockClock.tick(0);
}

function hasForwardChannel() {
  return !!getSingleForwardRequest();
}

/** @suppress {visibility} Accessing private properties. */
function hasBackChannel() {
  return !!channel.backChannelRequest_;
}

/** @suppress {visibility} Accessing private properties. */
function hasDeadBackChannelTimer() {
  return channel.deadBackChannelTimerId_ != null;
}

function assertHasForwardChannel() {
  expect(hasForwardChannel())
      .withContext('Forward channel missing.')
      .toBe(true);
}

function assertHasBackChannel() {
  expect(hasBackChannel()).withContext('Back channel missing.').toBe(true);
}

/**
 * @param {!MapTypes=} mapType
 */
function sendMapOnce(mapType = MapTypes.OBJECT_MAP) {
  expect(numTimingEvents).toBe(1);
  sendMap('foo', 'bar', /* context= */ undefined, mapType);
  responseDone();
  expect(numTimingEvents).toBe(2);
  expect(formatArrayOfMaps(deliveredMaps)).toBe('foo:bar');
}

function sendMapTwice() {
  sendMap('foo1', 'bar1');
  responseDone();
  expect(formatArrayOfMaps(deliveredMaps)).toBe('foo1:bar1');
  sendMap('foo2', 'bar2');
  responseDone();
  expect(formatArrayOfMaps(deliveredMaps)).toBe('foo2:bar2');
}

/** @suppress {visibility} Accessing private properties. */
function setFailFastWhileWaitingForRetry() {
  expect(numTimingEvents).toBe(1);

  sendMap('foo', 'bar');
  expect(channel.forwardChannelTimerId_).toBeNull();
  expect(getSingleForwardRequest()).not.toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(0);

  // Watchdog timeout.
  responseTimeout();
  expect(channel.forwardChannelTimerId_).not.toBeNull();
  expect(getSingleForwardRequest()).toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(1);

  // Almost finish the between-retry timeout.
  mockClock.tick(RETRY_TIME - 1);
  expect(channel.forwardChannelTimerId_).not.toBeNull();
  expect(getSingleForwardRequest()).toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(1);

  // Setting max retries to 0 should cancel the timer and raise an error.
  channel.setFailFast(true);
  expect(channel.forwardChannelTimerId_).toBeNull();
  expect(getSingleForwardRequest()).toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(1);

  // We get the error immediately before starting to ping google.com.
  expect(gotError).toBe(true);
  expect(deliveredMaps.length).toBe(0);

  // Simulate that timing out. We should not get another error.
  gotError = false;
  mockClock.tick(netUtils.NETWORK_TIMEOUT);
  expect(gotError)
      .withContext('Extra error after network ping timed out.')
      .toBe(false);

  // Make sure no more retry timers are firing.
  mockClock.tick(ALL_DAY_MS);
  expect(channel.forwardChannelTimerId_).toBeNull();
  expect(getSingleForwardRequest()).toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(1);
  expect(numTimingEvents).toBe(1);
}

/** @suppress {visibility} Accessing private properties. */
function setFailFastWhileRetryXhrIsInFlight() {
  expect(numTimingEvents).toBe(1);

  sendMap('foo', 'bar');
  expect(channel.forwardChannelTimerId_).toBeNull();
  expect(getSingleForwardRequest()).not.toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(0);

  // Watchdog timeout.
  responseTimeout();
  expect(channel.forwardChannelTimerId_).not.toBeNull();
  expect(getSingleForwardRequest()).toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(1);

  // Wait for the between-retry timeout.
  mockClock.tick(RETRY_TIME);
  expect(channel.forwardChannelTimerId_).toBeNull();
  expect(getSingleForwardRequest()).not.toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(1);

  // Simulate a second watchdog timeout.
  responseTimeout();
  expect(channel.forwardChannelTimerId_).not.toBeNull();
  expect(getSingleForwardRequest()).toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(2);

  // Wait for another between-retry timeout.
  mockClock.tick(RETRY_TIME);
  // Now the third req is in flight.
  expect(channel.forwardChannelTimerId_).toBeNull();
  expect(getSingleForwardRequest()).not.toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(2);

  // Set fail fast, killing the request
  channel.setFailFast(true);
  expect(channel.forwardChannelTimerId_).toBeNull();
  expect(getSingleForwardRequest()).toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(2);

  // We get the error immediately before starting to ping google.com.
  expect(gotError).toBe(true);

  // Simulate that timing out. We should not get another error.
  gotError = false;
  mockClock.tick(netUtils.NETWORK_TIMEOUT);
  expect(gotError)
      .withContext('Extra error after network ping timed out.')
      .toBe(false);

  // Make sure no more retry timers are firing.
  mockClock.tick(ALL_DAY_MS);
  expect(channel.forwardChannelTimerId_).toBeNull();
  expect(getSingleForwardRequest()).toBeNull();
  expect(channel.forwardChannelRetryCount_).toBe(2);
  expect(numTimingEvents).toBe(1);
}

function requestFailedClosesChannel() {
  expect(numTimingEvents).toBe(1);

  sendMap('foo', 'bar');
  responseRequestFailed();

  expect(channel.getState())
      .withContext('Should be closed immediately after request failed.')
      .toBe(WebChannelBase.State.CLOSED);

  mockClock.tick(netUtils.NETWORK_TIMEOUT);

  expect(channel.getState())
      .withContext('Should remain closed after the ping timeout.')
      .toBe(WebChannelBase.State.CLOSED);
  expect(numTimingEvents).toBe(1);
  expect(channel.getLastStatusCode()).toBe(DEFAULT_ERROR_HTTP_STATUS_CODE);
}

/** @suppress {visibility} Accessing private properties. */
function outgoingMapsAwaitsResponse() {
  expect(channel.outgoingMaps_.length).toBe(0);

  sendMap('foo1', 'bar');
  expect(channel.outgoingMaps_.length).toBe(0);
  sendMap('foo2', 'bar');
  expect(channel.outgoingMaps_.length).toBe(1);
  sendMap('foo3', 'bar');
  expect(channel.outgoingMaps_.length).toBe(2);
  sendMap('foo4', 'bar');
  expect(channel.outgoingMaps_.length).toBe(3);

  responseDone();
  // Now the forward channel request is completed and a new started, so all maps
  // are dequeued from the array of outgoing maps into this new forward request.
  expect(channel.outgoingMaps_.length).toBe(0);
}

describe('goog.labs.net.webChannel.webChannelBaseTest', () => {
  /**
   * @suppress {invalidCasts} The cast from MockChannelRequest to
   * ChannelRequest is invalid and will not compile.
   */
  beforeAll(() => {
    // Use our MockChannelRequests instead of the real ones.
    ChannelRequest.createChannelRequest =
        (channel, channelDebug, opt_sessionId, opt_requestId, opt_retryId) => {
          return /** @type {!ChannelRequest} */ (new MockChannelRequest(
              channel, channelDebug, opt_sessionId, opt_requestId,
              opt_retryId));
        };

    // Mock out the stat notification code.
    requestStats.notifyStatEvent = (stat) => {
      numStatEvents++;
      lastStatEvent = stat;
    };

    requestStats.notifyTimingEvent = (size, rtt, retries) => {
      numTimingEvents++;
      lastPostSize = size;
      lastPostRtt = rtt;
      lastPostRetryCount = retries;
    };
  });

  beforeEach(() => {
    numTimingEvents = 0;
    lastPostSize = null;
    lastPostRtt = null;
    lastPostRetryCount = null;

    mockClock = new MockClock(true);
    /** @suppress {checkTypes} suppression added to enable type checking */
    channel = new WebChannelBase('1');

    gotError = false;

    handler = new WebChannelBase.Handler();
    handler.channelOpened = () => {};
    handler.channelError = (channel, error) => {
      gotError = true;
    };
    handler.channelSuccess = (channel, request) => {
      deliveredMaps = googArray.clone(request.getPendingMessages());
    };
    /**
     * @suppress {checkTypes} The callback function type declaration is
     * skipped.
     */
    handler.channelClosed = (channel, opt_pendingMaps, opt_undeliveredMaps) => {
      // Mock out the handler, and let it set a formatted user readable string
      // of the undelivered maps which we can use when verifying our assertions.
      if (opt_pendingMaps) {
        handler.pendingMapsString = formatArrayOfMaps(opt_pendingMaps);
      }
      if (opt_undeliveredMaps) {
        handler.undeliveredMapsString = formatArrayOfMaps(opt_undeliveredMaps);
      }
    };
    handler.channelHandleMultipleArrays = (_, data) => {
      handledMessages = googArray.clone(data);
    };
    handler.channelHandleArray = () => {};

    channel.setHandler(handler);

    // Provide a predictable retry time for testing.
    /** @suppress {visibility} Accessing private properties. */
    channel.getRetryTime_ = (retryCount) => RETRY_TIME;

    const channelDebug = new WebChannelDebug();
    channelDebug.debug = (message) => {
      debugToWindow(message);
    };
    channel.setChannelDebug(channelDebug);

    numStatEvents = 0;
    lastStatEvent = null;
  });

  afterEach(() => {
    mockClock.dispose();
    stubs.reset();
    debugToWindow('<hr>');
  });

  it('format array of maps', () => {
    // This function is used in a non-trivial test, so let's verify that it
    // works.
    const map1 = new Map();
    map1.set('k1', 'v1');
    map1.set('k2', 'v2');
    const map2 = new Map();
    map2.set('k3', 'v3');
    const map3 = new Map();
    map3.set('k4', 'v4');
    map3.set('k5', 'v5');
    map3.set('k6', 'v6');

    // One map.
    const a = [];
    a.push(new Wire.QueuedMap(0, map1));
    expect(formatArrayOfMaps(a)).toBe('k1:v1, k2:v2');

    // Many maps.
    const b = [];
    b.push(new Wire.QueuedMap(0, map1));
    b.push(new Wire.QueuedMap(0, map2));
    b.push(new Wire.QueuedMap(0, map3));
    expect(formatArrayOfMaps(b))
        .toBe('k1:v1, k2:v2, k3:v3, k4:v4, k5:v5, k6:v6');

    // One map with a context.
    const c = [];
    c.push(new Wire.QueuedMap(0, map1, new String('c1')));
    expect(formatArrayOfMaps(c)).toBe('k1:v1:c1, k2:v2:c1');
  });

  /** @suppress {visibility} Accessing private properties. */
  it('connect', () => {
    connect();
    expect(channel.getState()).toBe(WebChannelBase.State.OPENED);
    // If the server specifies no version, the client assumes the latest version
    expect(channel.channelVersion_).toBe(Wire.LATEST_CHANNEL_VERSION);
    expect(channel.isBuffered()).toBe(false);
  });

  it('connect, back channel established', () => {
    connect();
    assertHasBackChannel();
  });

  /** @suppress {visibility} Accessing private properties. */
  it('connect, with server host prefix', () => {
    connect(undefined, 'serverHostPrefix');
    expect(channel.hostPrefix_).toBe('serverHostPrefix');
  });

  /** @suppress {visibility} Accessing private properties. */
  it('connect, with client host prefix', () => {
    handler.correctHostPrefix = (hostPrefix) => 'clientHostPrefix';
    connect();
    expect(channel.hostPrefix_).toBe('clientHostPrefix');
  });

  /** @suppress {visibility} Accessing private properties. */
  it('connect, override server host prefix', () => {
    handler.correctHostPrefix = (hostPrefix) => 'clientHostPrefix';
    connect(undefined, 'serverHostPrefix');
    expect(channel.hostPrefix_).toBe('clientHostPrefix');
  });

  /** @suppress {visibility} Accessing private properties. */
  it('connect, with server version', () => {
    connect(8);
    expect(channel.channelVersion_).toBe(8);
  });

  it('connect, not ok to make request for test', () => {
    handler.okToMakeRequest = functions.constant(WebChannelBase.Error.NETWORK);
    channel.connect('/bind', null);
    mockClock.tick(0);
    expect(channel.getState()).toBe(WebChannelBase.State.CLOSED);
  });

  it('connect, not ok to make request for bind', () => {
    channel.connect('/bind', null);
    mockClock.tick(0);
    handler.okToMakeRequest = functions.constant(WebChannelBase.Error.NETWORK);
    completeForwardChannel();
    expect(channel.getState()).toBe(WebChannelBase.State.CLOSED);
  });

  it('send map, with object map', () => {
    connect();
    sendMapOnce(MapTypes.OBJECT_MAP);
  });

  it('send map, with structs map', () => {
    connect();
    sendMapOnce(MapTypes.STRUCTS_MAP);
  });

  it('send map, with es6 map', () => {
    connect();
    sendMapOnce(MapTypes.ES6_MAP);
  });

  it('send map with spdy enabled', () => {
    connect(undefined, undefined, undefined, true);
    sendMapOnce();
  });

  it('send map, twice', () => {
    connect();
    sendMapTwice();
  });

  it('send map, twice with spdy enabled', () => {
    connect(undefined, undefined, undefined, true);
    sendMapTwice();
  });

  it('send map, and receive', () => {
    connect();
    sendMap('foo', 'bar');
    responseDone();
    receive('["the server reply"]');
  });

  it('receive', () => {
    connect();
    receive('["message from server"]');
    assertHasBackChannel();
  });

  it('receive, twice', () => {
    connect();
    receive('["message one from server"]');
    receive('["message two from server"]');
    assertHasBackChannel();
  });

  it('receive, and send map', () => {
    connect();
    receive('["the server reply"]');
    sendMap('foo', 'bar');
    responseDone();
    assertHasBackChannel();
  });

  it('back channel remains established, after single send map', () => {
    connect();

    sendMap('foo', 'bar');
    responseDone();
    receive('["ack"]');

    assertHasBackChannel();
  });

  it('back channel remains established, after double send map', () => {
    connect();

    sendMap('foo1', 'bar1');
    sendMap('foo2', 'bar2');
    responseDone();
    receive('["ack"]');

    // This assertion would fail prior to CL 13302660.
    assertHasBackChannel();
  });

  it('timing event', () => {
    connect();
    expect(numTimingEvents).toBe(1);
    sendMap('', '');
    expect(numTimingEvents).toBe(1);
    mockClock.tick(20);
    let expSize = getSingleForwardRequest().getPostData().length;
    responseDone();

    expect(numTimingEvents).toBe(2);
    expect(lastPostSize).toBe(expSize);
    expect(lastPostRtt).toBe(20);
    expect(lastPostRetryCount).toBe(0);

    sendMap('abcdefg', '123456');
    expSize = getSingleForwardRequest().getPostData().length;
    responseTimeout();
    expect(numTimingEvents).toBe(2);
    mockClock.tick(RETRY_TIME + 1);
    responseDone();
    expect(numTimingEvents).toBe(3);
    expect(lastPostSize).toBe(expSize);
    expect(lastPostRetryCount).toBe(1);
    expect(lastPostRtt).toBe(1);
  });

  /**
   * Make sure that dropping the forward channel retry limit below the retry
   * count reports an error, and prevents another request from firing.
   */
  it('set fail fast while waiting for retry', () => {
    stubNetUtils();

    connect();
    setFailFastWhileWaitingForRetry();
  });

  it('set fail fast while waiting for retry with spdy enabled', () => {
    stubNetUtils();

    connect(undefined, undefined, undefined, true);
    setFailFastWhileWaitingForRetry();
  });

  /**
   * Make sure that dropping the forward channel retry limit below the retry
   * count reports an error, and prevents another request from firing.
   */
  it('set fail fast while retry xhr is in flight', () => {
    stubNetUtils();

    connect();
    setFailFastWhileRetryXhrIsInFlight();
  });

  it('set fail fast while retry xhr is in flight with spdy enabled', () => {
    stubNetUtils();

    connect(undefined, undefined, undefined, true);
    setFailFastWhileRetryXhrIsInFlight();
  });

  /**
   * Makes sure that setting fail fast while not retrying doesn't cause a
   *      failure.
   * @suppress {visibility} Accessing private properties.
   */
  it('set fail fast at retry count', () => {
    stubNetUtils();

    connect();
    expect(numTimingEvents).toBe(1);

    sendMap('foo', 'bar');
    expect(channel.forwardChannelTimerId_).toBeNull();
    expect(getSingleForwardRequest()).not.toBeNull();
    expect(channel.forwardChannelRetryCount_).toBe(0);

    // Set fail fast.
    channel.setFailFast(true);
    // Request should still be alive.
    expect(channel.forwardChannelTimerId_).toBeNull();
    expect(getSingleForwardRequest()).not.toBeNull();
    expect(channel.forwardChannelRetryCount_).toBe(0);

    // Watchdog timeout. Now we should get an error.
    responseTimeout();
    expect(channel.forwardChannelTimerId_).toBeNull();
    expect(getSingleForwardRequest()).toBeNull();
    expect(channel.forwardChannelRetryCount_).toBe(0);

    // We get the error immediately before starting to ping google.com.
    expect(gotError).toBe(true);
    // We get the error immediately before starting to ping google.com.
    // Simulate that timing out. We should not get another error in addition
    // to the initial failure.
    gotError = false;
    mockClock.tick(netUtils.NETWORK_TIMEOUT);
    expect(gotError)
        .withContext('Extra error after network ping timed out.')
        .toBe(false);

    // Make sure no more retry timers are firing.
    mockClock.tick(ALL_DAY_MS);
    expect(channel.forwardChannelTimerId_).toBeNull();
    expect(getSingleForwardRequest()).toBeNull();
    expect(channel.forwardChannelRetryCount_).toBe(0);
    expect(numTimingEvents).toBe(1);
  });

  it('request failed closes channel', () => {
    stubNetUtils();

    connect();
    requestFailedClosesChannel();
  });

  it('request failed closes channel with spdy enabled', () => {
    stubNetUtils();

    connect(undefined, undefined, undefined, true);
    requestFailedClosesChannel();
  });

  it('stat event reported only once', () => {
    stubNetUtils();

    connect();
    sendMap('foo', 'bar');
    numStatEvents = 0;
    lastStatEvent = null;
    responseUnknownSessionId();

    expect(numStatEvents).toBe(1);
    expect(lastStatEvent).toBe(requestStats.Stat.ERROR_OTHER);

    numStatEvents = 0;
    mockClock.tick(netUtils.NETWORK_TIMEOUT);
    expect(numStatEvents)
        .withContext('No new stat events should be reported.')
        .toBe(0);
  });

  it('stat event reported only once, on network up', () => {
    stubNetUtils();

    connect();
    sendMap('foo', 'bar');
    numStatEvents = 0;
    lastStatEvent = null;
    responseRequestFailed();

    expect(numStatEvents)
        .withContext(
            'No stat event should be reported before we know the reason.')
        .toBe(0);

    // Let the ping time out.
    mockClock.tick(netUtils.NETWORK_TIMEOUT);

    // Assert we report the correct stat event.
    expect(numStatEvents).toBe(1);
    expect(lastStatEvent).toBe(requestStats.Stat.ERROR_NETWORK);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('stat event reported only once, on network down', () => {
    stubNetUtils();

    connect();
    sendMap('foo', 'bar');
    numStatEvents = 0;
    lastStatEvent = null;
    responseRequestFailed();

    expect(numStatEvents)
        .withContext(
            'No stat event should be reported before we know the reason.')
        .toBe(0);

    // Wait half the ping timeout period, and then fake the network being up.
    mockClock.tick(netUtils.NETWORK_TIMEOUT / 2);
    channel.testNetworkCallback_(true);

    // Assert we report the correct stat event.
    expect(numStatEvents).toBe(1);
    expect(lastStatEvent).toBe(requestStats.Stat.ERROR_OTHER);
  });

  it('outgoing maps awaits response', () => {
    connect();
    outgoingMapsAwaitsResponse();
  });

  it('outgoing maps awaits response with spdy enabled', () => {
    connect(undefined, undefined, undefined, true);
    outgoingMapsAwaitsResponse();
  });

  it('undelivered maps, does not notify when successful', () => {
    /**
     * @suppress {checkTypes} The callback function type declaration is
     * skipped.
     */
    handler.channelClosed = (channel, opt_pendingMaps, opt_undeliveredMaps) => {
      if (opt_pendingMaps || opt_undeliveredMaps) {
        fail('No pending or undelivered maps should be reported.');
      }
    };

    connect();
    sendMap('foo1', 'bar1');
    responseDone();
    sendMap('foo2', 'bar2');
    responseDone();
    disconnect();
  });

  it('undelivered maps, does not notify if nothing was sent', () => {
    /**
     * @suppress {checkTypes} The callback function type declaration is
     * skipped.
     */
    handler.channelClosed = (channel, opt_pendingMaps, opt_undeliveredMaps) => {
      if (opt_pendingMaps || opt_undeliveredMaps) {
        fail('No pending or undelivered maps should be reported.');
      }
    };

    connect();
    mockClock.tick(ALL_DAY_MS);
    disconnect();
  });

  // NOTE: The current setup for ALL existing testUndeliveredMaps_* tests rely
  // heavily on the non-HTTP2-or-SPDY behavior (i.e. one message can be sent at
  // any given time).
  /** @suppress {visibility} Accessing private properties. */
  it('undelivered maps, clears pending maps after notifying', () => {
    connect();
    sendMap('foo1', 'bar1');
    sendMap('foo2', 'bar2');
    sendMap('foo3', 'bar3');

    expect(channel.forwardChannelRequestPool_.getPendingMessages().length)
        .toBe(1);
    expect(channel.outgoingMaps_.length).toBe(2);

    disconnect();

    expect(channel.forwardChannelRequestPool_.getPendingMessages().length)
        .toBe(0);
    expect(channel.outgoingMaps_.length).toBe(0);
  });

  /** @suppress {missingProperties} suppression added to enable type checking */
  it('undelivered maps, notifies with context', () => {
    connect();

    // First send two messages that succeed.
    sendMap('foo1', 'bar1', 'context1');
    responseDone();
    sendMap('foo2', 'bar2', 'context2');
    responseDone();

    // Pretend the server hangs and no longer responds.
    sendMap('foo3', 'bar3', 'context3');
    sendMap('foo4', 'bar4', 'context4');
    sendMap('foo5', 'bar5', 'context5');

    // Give up.
    disconnect();

    // Assert that we are informed of any undelivered messages; both about
    // #3 that was sent but which we don't know if the server received, and
    // #4 and #5 which remain in the outgoing maps and have not yet been sent.
    expect(handler.pendingMapsString).toBe('foo3:bar3:context3');
    expect(handler.undeliveredMapsString)
        .toBe('foo4:bar4:context4, foo5:bar5:context5');
  });

  /** @suppress {missingProperties} suppression added to enable type checking */
  it('undelivered maps, service unavailable', () => {
    // Send a few maps, and let one fail.
    connect();
    sendMap('foo1', 'bar1');
    responseDone();
    sendMap('foo2', 'bar2');
    responseRequestFailed();

    // After a failure, the channel should be closed.
    disconnect();

    expect(handler.pendingMapsString).toBe('foo2:bar2');
    expect(handler.undeliveredMapsString).toBe('');
  });

  /** @suppress {missingProperties} suppression added to enable type checking */
  it('undelivered maps, on ping timeout', () => {
    stubNetUtils();

    connect();

    // Send a message.
    sendMap('foo1', 'bar1');

    // Fake REQUEST_FAILED, triggering a ping to check the network.
    responseRequestFailed();

    // Let the ping time out, unsuccessfully.
    mockClock.tick(netUtils.NETWORK_TIMEOUT);

    // Assert channel is closed.
    expect(channel.getState()).toBe(WebChannelBase.State.CLOSED);

    // Assert that the handler is notified about the undelivered messages.
    expect(handler.pendingMapsString).toBe('foo1:bar1');
    expect(handler.undeliveredMapsString).toBe('');
  });

  /** @suppress {visibility} Accessing private properties. */
  it('get non acked maps before channel close, returns union of pending and unsent maps',
     () => {
       connect();

       // First send one message and respond with server ack.
       sendMap('foo1', 'bar1');
       responseDone();

       // Send 3 more messages which are non-acked.
       sendMap('foo2', 'bar2');
       sendMap('foo3', 'bar3');
       sendMap('foo4', 'bar4');

       // Verifies that we're indeed covering the case where 1 message is
       // pending server ack and 2 message has not been sent to the network.
       expect(channel.forwardChannelRequestPool_.getPendingMessages().length)
           .toBe(1);
       expect(channel.outgoingMaps_.length).toBe(2);

       expect(channel.getNonAckedMaps().map(queuedMap => queuedMap.map))
           .toEqual([{foo2: 'bar2'}, {foo3: 'bar3'}, {foo4: 'bar4'}]);
     });

  /** @suppress {visibility} Accessing private properties. */
  it('get non acked maps after channel close, returns union of pending and unsent maps',
     () => {
       connect();

       // First send one message and respond with server ack.
       sendMap('foo1', 'bar1');
       responseDone();

       // Send 3 more messages which are non-acked.
       sendMap('foo2', 'bar2');
       sendMap('foo3', 'bar3');
       sendMap('foo4', 'bar4');

       // Verifies that we're indeed covering the case where 1 message is
       // pending server ack and 2 message has not been sent to the network.
       expect(channel.forwardChannelRequestPool_.getPendingMessages().length)
           .toBe(1);
       expect(channel.outgoingMaps_.length).toBe(2);

       disconnect();

       expect(channel.getNonAckedMaps().map(queuedMap => queuedMap.map))
           .toEqual([{foo2: 'bar2'}, {foo3: 'bar3'}, {foo4: 'bar4'}]);
     });

  /** @suppress {visibility} Accessing private properties. */
  it('response no backchannel post not before backchannel', () => {
    connect(8);
    sendMap('foo1', 'bar1');

    mockClock.tick(10);
    expect(
        channel.backChannelRequest_.getRequestStartTime() <
        getSingleForwardRequest().getRequestStartTime())
        .toBe(false);
    responseNoBackchannel();
    expect(lastStatEvent).not.toBe(requestStats.Stat.BACKCHANNEL_MISSING);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('response no backchannel', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    response(-1, 0);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE + 1);
    sendMap('foo2', 'bar2');
    expect(
        channel.backChannelRequest_.getRequestStartTime() +
            WebChannelBase.RTT_ESTIMATE <
        getSingleForwardRequest().getRequestStartTime())
        .toBe(true);
    responseNoBackchannel();
    expect(lastStatEvent).toBe(requestStats.Stat.BACKCHANNEL_MISSING);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('response no backchannel with no backchannel', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    expect(channel.backChannelTimerId_).toBeNull();
    channel.backChannelRequest_.cancel();
    /** @suppress {visibility} Accessing private properties. */
    channel.backChannelRequest_ = null;
    responseNoBackchannel();
    expect(lastStatEvent).toBe(requestStats.Stat.BACKCHANNEL_MISSING);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('response no backchannel with start timer', () => {
    connect(8);
    sendMap('foo1', 'bar1');

    channel.backChannelRequest_.cancel();
    /** @suppress {visibility} Accessing private properties. */
    channel.backChannelRequest_ = null;
    /** @suppress {visibility} Accessing private properties. */
    channel.backChannelTimerId_ = 123;
    responseNoBackchannel();
    expect(lastStatEvent).not.toBe(requestStats.Stat.BACKCHANNEL_MISSING);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('response with no array sent', () => {
    connect(8);
    sendMap('foo1', 'bar1');

    // Send a response as if the server hasn't sent down an array.
    response(-1, 0);

    // POST response with an array ID lower than our last received is OK.
    expect(channel.lastArrayId_).toBe(1);
    expect(channel.lastPostResponseArrayId_).toBe(-1);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('response with arrays missing', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    expect(channel.lastPostResponseArrayId_).toBe(-1);

    // Send a response as if the server has sent down seven arrays.
    response(7, 111);

    expect(channel.lastArrayId_).toBe(1);
    expect(channel.lastPostResponseArrayId_).toBe(7);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE * 2);
    expect(lastStatEvent).toBe(requestStats.Stat.BACKCHANNEL_DEAD);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('multiple responses with arrays missing', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    expect(channel.lastPostResponseArrayId_).toBe(-1);

    // Send a response as if the server has sent down seven arrays.
    response(7, 111);

    expect(channel.lastArrayId_).toBe(1);
    expect(channel.lastPostResponseArrayId_).toBe(7);
    sendMap('foo2', 'bar2');
    mockClock.tick(WebChannelBase.RTT_ESTIMATE);
    response(8, 119);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE);
    // The original timer should still fire.
    expect(lastStatEvent).toBe(requestStats.Stat.BACKCHANNEL_DEAD);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('duplicate response', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    expect(channel.lastPostResponseArrayId_).toBe(-1);

    response(4, 111);
    receiveData(`[[2,["foo2"]],[3,["foo3"]],[4,["foo4"]]]`);

    expect(channel.lastArrayId_).toBe(4);
    expect(handledMessages).toEqual([['foo2'], ['foo3'], ['foo4']]);

    response(6, 0);
    receiveData(
        `[[2,["foo2"]],[3,["foo3"]],[4,["foo4"]],[5,["foo5"]],[6,["foo6"]]]`);

    expect(channel.lastArrayId_).toBe(6);
    expect(handledMessages).toEqual([['foo5'], ['foo6']]);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('only retry once based on response', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    expect(channel.lastPostResponseArrayId_).toBe(-1);

    // Send a response as if the server has sent down seven arrays.
    response(7, 111);

    expect(channel.lastArrayId_).toBe(1);
    expect(channel.lastPostResponseArrayId_).toBe(7);
    expect(hasDeadBackChannelTimer()).toBe(true);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE * 2);
    expect(lastStatEvent).toBe(requestStats.Stat.BACKCHANNEL_DEAD);
    expect(channel.backChannelRetryCount_).toBe(1);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE);
    sendMap('foo2', 'bar2');
    expect(hasDeadBackChannelTimer()).toBe(false);
    response(8, 119);
    expect(hasDeadBackChannelTimer()).toBe(false);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('response with arrays missing and live channel', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    expect(channel.lastPostResponseArrayId_).toBe(-1);

    // Send a response as if the server has sent down seven arrays.
    response(7, 111);

    expect(channel.lastArrayId_).toBe(1);
    expect(channel.lastPostResponseArrayId_).toBe(7);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE);
    expect(hasDeadBackChannelTimer()).toBe(true);
    receive('["ack"]');
    expect(hasDeadBackChannelTimer()).toBe(false);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE);
    expect(lastStatEvent).not.toBe(requestStats.Stat.BACKCHANNEL_DEAD);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('response with big outstanding data', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    expect(channel.lastPostResponseArrayId_).toBe(-1);

    // Send a response as if the server has sent down seven arrays and 50kbytes.
    response(7, 50000);

    expect(channel.lastArrayId_).toBe(1);
    expect(channel.lastPostResponseArrayId_).toBe(7);
    expect(hasDeadBackChannelTimer()).toBe(false);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE * 2);
    expect(lastStatEvent).not.toBe(requestStats.Stat.BACKCHANNEL_DEAD);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('response in buffered mode', () => {
    connect(8);
    /** @suppress {visibility} Accessing private properties. */
    channel.enableStreaming_ = false;
    sendMap('foo1', 'bar1');
    expect(channel.lastPostResponseArrayId_).toBe(-1);
    response(7, 111);

    expect(channel.lastArrayId_).toBe(1);
    expect(channel.lastPostResponseArrayId_).toBe(7);
    expect(hasDeadBackChannelTimer()).toBe(false);
    mockClock.tick(WebChannelBase.RTT_ESTIMATE * 2);
    expect(lastStatEvent).not.toBe(requestStats.Stat.BACKCHANNEL_DEAD);
  });

  it('response with garbage', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    channel.onRequestData(getSingleForwardRequest(), 'garbage');
    expect(channel.getState()).toBe(WebChannelBase.State.CLOSED);
  });

  it('response with garbage in array', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    channel.onRequestData(getSingleForwardRequest(), '["garbage"]');
    expect(channel.getState()).toBe(WebChannelBase.State.CLOSED);
  });

  it('response with evil data', () => {
    connect(8);
    sendMap('foo1', 'bar1');
    channel.onRequestData(
        getSingleForwardRequest(),
        'foo=<script>evil()<\/script>&' +
            'bar=<script>moreEvil()<\/script>');
    expect(channel.getState()).toBe(WebChannelBase.State.CLOSED);
  });

  /** @suppress {visibility} Accessing private properties. */
  it('path absolute', () => {
    connect(8, undefined, '/talkgadget');
    expect(window.location.hostname).toBe(channel.backChannelUri_.getDomain());
    expect(window.location.hostname)
        .toBe(channel.forwardChannelUri_.getDomain());
  });

  /** @suppress {visibility} Accessing private properties. */
  it('path relative', () => {
    connect(8, undefined, 'talkgadget');
    expect(window.location.hostname).toBe(channel.backChannelUri_.getDomain());
    expect(window.location.hostname)
        .toBe(channel.forwardChannelUri_.getDomain());
  });

  /** @suppress {visibility} Accessing private properties. */
  it('path with host', () => {
    connect(8, undefined, 'https://example.com');
    expect(channel.backChannelUri_.getScheme()).toBe('https');
    expect(channel.backChannelUri_.getDomain()).toBe('example.com');
    expect(channel.forwardChannelUri_.getScheme()).toBe('https');
    expect(channel.forwardChannelUri_.getDomain()).toBe('example.com');
  });

  it('create xhr io', () => {
    let xhr = channel.createXhrIo(null);
    expect(xhr.getWithCredentials()).toBe(false);

    expect(goog.bind(channel.createXhrIo, channel, 'some_host'))
        .withContext('Error connection to different host without CORS')
        .toThrow();

    channel.setSupportsCrossDomainXhrs(true);

    xhr = channel.createXhrIo(null);
    expect(xhr.getWithCredentials()).toBe(true);

    xhr = channel.createXhrIo('some_host');
    expect(xhr.getWithCredentials()).toBe(true);
  });

  it('spdy limit option', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    stubSpdyCheck(true);
    const webChannelDefault = webChannelTransport.createWebChannel('/foo');
    expect(webChannelDefault.getRuntimeProperties().getConcurrentRequestLimit())
        .toBe(10);
    expect(webChannelDefault.getRuntimeProperties().isSpdyEnabled()).toBe(true);

    const options = {'concurrentRequestLimit': 100};

    stubSpdyCheck(false);
    const webChannelDisabled =
        webChannelTransport.createWebChannel('/foo', options);
    expect(
        webChannelDisabled.getRuntimeProperties().getConcurrentRequestLimit())
        .toBe(1);
    expect(webChannelDisabled.getRuntimeProperties().isSpdyEnabled())
        .toBe(false);

    stubSpdyCheck(true);
    const webChannelEnabled =
        webChannelTransport.createWebChannel('/foo', options);
    expect(webChannelEnabled.getRuntimeProperties().getConcurrentRequestLimit())
        .toBe(100);
    expect(webChannelEnabled.getRuntimeProperties().isSpdyEnabled()).toBe(true);
  });
});
