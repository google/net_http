/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Unit tests for ForwardChannelRequestPool.
 * @suppress {accessControls} Private methods are accessed for test purposes.
 */

goog.module('goog.labs.net.webChannel.ForwardChannelRequestPoolTest');
goog.setTestOnly('goog.labs.net.webChannel.ForwardChannelRequestPoolTest');

const ChannelRequest = goog.require('goog.labs.net.webChannel.ChannelRequest');
const ForwardChannelRequestPool = goog.require('goog.labs.net.webChannel.ForwardChannelRequestPool');
const PropertyReplacer = goog.require('goog.testing.PropertyReplacer');

const propertyReplacer = new PropertyReplacer();
const req = new ChannelRequest(null, null);

describe('goog.labs.net.webChannel.ForwardChannelRequestPoolTest', () => {
  afterEach(() => {
    propertyReplacer.reset();
  });

  it('spdy enabled', () => {
    stubSpdyCheck(true);

    const pool = new ForwardChannelRequestPool();
    expect(pool.isFull()).toBe(false);
    expect(pool.getRequestCount()).toBe(0);
    pool.addRequest(req);
    expect(pool.hasPendingRequest()).toBe(true);
    expect(pool.hasRequest(req)).toBe(true);
    pool.removeRequest(req);
    expect(pool.hasPendingRequest()).toBe(false);

    for (let i = 0; i < pool.getMaxSize(); i++) {
      pool.addRequest(new ChannelRequest(null, null));
    }
    expect(pool.isFull()).toBe(true);

    // do not fail
    pool.addRequest(req);
    expect(pool.isFull()).toBe(true);
  });

  it('spdy not enabled', () => {
    stubSpdyCheck(false);

    const pool = new ForwardChannelRequestPool();
    expect(pool.isFull()).toBe(false);
    expect(pool.getRequestCount()).toBe(0);
    pool.addRequest(req);
    expect(pool.hasPendingRequest()).toBe(true);
    expect(pool.hasRequest(req)).toBe(true);
    expect(pool.isFull()).toBe(true);
    pool.removeRequest(req);
    expect(pool.hasPendingRequest()).toBe(false);

    // do not fail
    pool.addRequest(req);
    expect(pool.isFull()).toBe(true);
  });

  it('apply client protocol', () => {
    stubSpdyCheck(false);

    let pool = new ForwardChannelRequestPool();
    expect(pool.getMaxSize()).toBe(1);
    pool.applyClientProtocol('spdy/3');
    expect(pool.getMaxSize() > 1).toBe(true);
    pool.applyClientProtocol('foo-bar');  // no effect
    expect(pool.getMaxSize() > 1).toBe(true);

    pool = new ForwardChannelRequestPool();
    expect(pool.getMaxSize()).toBe(1);
    pool.applyClientProtocol('quic/x');
    expect(pool.getMaxSize() > 1).toBe(true);

    pool = new ForwardChannelRequestPool();
    expect(pool.getMaxSize()).toBe(1);
    pool.applyClientProtocol('h2');
    expect(pool.getMaxSize() > 1).toBe(true);

    stubSpdyCheck(true);

    pool = new ForwardChannelRequestPool();
    expect(pool.getMaxSize() > 1).toBe(true);
    pool.applyClientProtocol('foo/3');  // no effect
    expect(pool.getMaxSize() > 1).toBe(true);
  });

  it('pending messages with spdy disabled', () => {
    stubSpdyCheck(false);

    const pool = new ForwardChannelRequestPool();
    expect(pool.getMaxSize()).toBe(1);
    expect(pool.getPendingMessages().length).toBe(0);

    let req = new ChannelRequest(null, null);
    pool.addRequest(req);

    expect(pool.getPendingMessages().length).toBe(0);

    req.setPendingMessages([null, null]);  // null represents the message
    expect(pool.getPendingMessages().length).toBe(2);

    req = new ChannelRequest(null, null);
    req.setPendingMessages([null]);
    pool.addRequest(req);
    expect(pool.getPendingMessages().length).toBe(1);

    pool.removeRequest(req);
    expect(pool.getPendingMessages().length).toBe(0);
  });

  it('canel and pending messages with spdy disabled', () => {
    stubSpdyCheck(false);

    const pool = new ForwardChannelRequestPool();

    const req = new ChannelRequest(null, null);
    req.setPendingMessages([null, null]);  // null represents the
                                           // message
    pool.addRequest(req);
    expect(pool.getPendingMessages().length).toBe(2);

    const req1 = new ChannelRequest(null, null);
    pool.addRequest(req1);
    req1.setPendingMessages([null]);
    expect(pool.getPendingMessages().length).toBe(1);

    pool.cancel();
    expect(pool.getRequestCount()).toBe(0);

    expect(pool.getPendingMessages().length).toBe(1);
  });

  it('add pending messages with spdy enabled', () => {
    stubSpdyCheck(false);

    const pool = new ForwardChannelRequestPool();

    pool.addPendingMessages([null, null]);
    expect(pool.getPendingMessages().length).toBe(2);

    const req = new ChannelRequest(null, null);
    req.setPendingMessages([null, null]);  // null represents the
                                           // message
    pool.addRequest(req);

    expect(pool.getPendingMessages().length).toBe(4);

    pool.addPendingMessages([null]);
    expect(pool.getPendingMessages().length).toBe(5);
  });

  it('pending messages with spdy enabled', () => {
    stubSpdyCheck(true);

    const pool = new ForwardChannelRequestPool();
    expect(pool.getMaxSize() > 1).toBe(true);
    expect(pool.getPendingMessages().length).toBe(0);

    const req = new ChannelRequest(null, null);
    pool.addRequest(req);

    expect(pool.getPendingMessages().length).toBe(0);

    req.setPendingMessages([null, null]);  // null represents the message
    expect(pool.getPendingMessages().length).toBe(2);

    const req1 = new ChannelRequest(null, null);
    pool.addRequest(req1);
    expect(pool.getPendingMessages().length).toBe(2);
    req1.setPendingMessages([null]);
    expect(pool.getPendingMessages().length).toBe(3);

    pool.removeRequest(req1);
    expect(pool.getPendingMessages().length).toBe(2);

    pool.removeRequest(req);
    expect(pool.getPendingMessages().length).toBe(0);
  });

  it('canel and pending messages with spdy enabled', () => {
    stubSpdyCheck(true);

    const pool = new ForwardChannelRequestPool();

    const req = new ChannelRequest(null, null);
    req.setPendingMessages([null, null]);  // null represents the
                                           // message
    pool.addRequest(req);

    const req1 = new ChannelRequest(null, null);
    pool.addRequest(req1);
    req1.setPendingMessages([null]);

    expect(pool.getPendingMessages().length).toBe(3);

    pool.cancel();
    expect(pool.getRequestCount()).toBe(0);

    expect(pool.getPendingMessages().length).toBe(3);
  });

  it('add and set pending messages with spdy enabled', () => {
    stubSpdyCheck(true);

    const pool = new ForwardChannelRequestPool();

    pool.addPendingMessages([null, null]);
    expect(pool.getPendingMessages().length).toBe(2);

    const req = new ChannelRequest(null, null);
    req.setPendingMessages([null, null]);  // null represents the
                                           // message
    pool.addRequest(req);

    const req1 = new ChannelRequest(null, null);
    pool.addRequest(req1);
    req1.setPendingMessages([null]);

    expect(pool.getPendingMessages().length).toBe(5);

    pool.addPendingMessages([null, null]);
    expect(pool.getPendingMessages().length).toBe(7);
  });

  it('clear pending messages', () => {
    stubSpdyCheck(true);

    const pool = new ForwardChannelRequestPool();

    pool.addPendingMessages([null, null]);
    expect(pool.getPendingMessages().length).toBe(2);

    pool.clearPendingMessages();
    expect(pool.getPendingMessages().length).toBe(0);
  });
});

/**
 * @param {boolean} spdyEnabled
 */
function stubSpdyCheck(spdyEnabled) {
  propertyReplacer.set(
      ForwardChannelRequestPool, 'isSpdyOrHttp2Enabled_', function() {
        return spdyEnabled;
      });
}
