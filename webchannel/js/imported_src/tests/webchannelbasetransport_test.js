/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Unit tests for WebChannelBase.@suppress {accessControls}
 * Private methods are accessed for test purposes.
 */

goog.module('goog.labs.net.webChannel.webChannelBaseTransportTest');
goog.setTestOnly();

const ChannelRequest = goog.require('goog.labs.net.webChannel.ChannelRequest');
const PropertyReplacer = goog.require('goog.testing.PropertyReplacer');
const Timer = goog.require('goog.Timer');
const WebChannel = goog.require('goog.net.WebChannel');
const WebChannelBase = goog.require('goog.labs.net.webChannel.WebChannelBase');
const WebChannelBaseTransport = goog.require('goog.labs.net.webChannel.WebChannelBaseTransport');
const Wire = goog.require('goog.labs.net.webChannel.Wire');
const XhrIo = goog.require('goog.net.XhrIo');
const dispose = goog.require('goog.dispose');
const events = goog.require('goog.events');
const functions = goog.require('goog.functions');
const googJson = goog.require('goog.json');
const {AnythingMatcher} = goog.require('goog.labs.testing');
const {ArgumentMatcher} = goog.require('goog.testing.mockmatchers');
const {atMost, times} = goog.require('goog.labs.mock.verification');
const {mock, mockFunction, verify} = goog.require('goog.labs.mock');
/**
 * Custom Jasmine matcher to check if a value is null or undefined.
 * @return {!jasmine.CustomMatcher}
 */
const toBeNullish = function() {
  return {
    compare: function(actual) {
      const pass = actual === null || actual === undefined;
      return {
        pass: pass,
        message: 'Expected ' + actual + (pass ? ' not' : '') + ' to be nullish'
      };
    }
  };
};

let webChannel;
const channelUrl = 'http://127.0.0.1:8080/channel';

const stubs = new PropertyReplacer();

/** Stubs ChannelRequest. */
function stubChannelRequest() {
  stubs.set(ChannelRequest, 'supportsXhrStreaming', functions.FALSE);
}

/**
 * Simulates the WebChannelBase firing the open event for the given channel.
 * @param {!WebChannelBase} channel The WebChannelBase.
 */
function simulateOpenEvent(channel) {
  expect(channel.getHandler()).not.toBeNull();
  channel.getHandler().channelOpened(channel);
}

/**
 * Simulates the WebChannelBase firing the close event for the given channel.
 * @param {!WebChannelBase} channel The WebChannelBase.
 */
function simulateCloseEvent(channel) {
  expect(channel.getHandler()).not.toBeNull();
  channel.getHandler().channelClosed(channel);
}

/**
 * Simulates the WebChannelBase firing the error event for the given channel.
 * @param {!WebChannelBase} channel The WebChannelBase.
 * @param {!WebChannelBase.Error} error
 */
function simulateErrorEvent(channel, error) {
  expect(channel.getHandler()).not.toBeNull();
  channel.getHandler().channelError(channel, error);
}

/**
 * Simulates the WebChannelBase firing the message event for the given channel.
 * @param {!WebChannelBase} channel The WebChannelBase.
 * @param {!Object} data The message data array.
 */
function simulateMessageEvent(channel, data) {
  expect(channel.getHandler()).not.toBeNull();
  channel.getHandler().channelHandleArray(channel, data);
}

describe('goog.labs.net.webChannel.webChannelBaseTransportTest', () => {
  beforeAll(() => {
    jasmine.addMatchers({
      'toBeNullish': toBeNullish,
    });
  });

  afterEach(() => {
    dispose(webChannel);
    stubs.reset();
  });

  it('unsupported transports', () => {
    stubChannelRequest();

    expect(() => {
      new WebChannelBaseTransport();
    }).toThrowError(/error/);
  });

  it('open with url', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);

    let eventFired = false;
    events.listen(webChannel, WebChannel.EventType.OPEN, (e) => {
      eventFired = true;
    });

    webChannel.open();
    expect(eventFired).toBe(false);

    /** @suppress {strictMissingProperties} Accessing private property. */
    const channel = webChannel.channel_;
    expect(channel).not.toBeNull();

    simulateOpenEvent(channel);
    expect(eventFired).toBe(true);
  });

  it('open with custom headers', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'messageHeaders': {'foo-key': 'foo-value'}};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const extraHeaders_ = webChannel.channel_.extraHeaders_;
    expect(extraHeaders_).not.toBeNullish();
    expect(extraHeaders_['foo-key']).toBe('foo-value');
    expect(extraHeaders_['X-Client-Protocol']).toBe(undefined);
  });

  it('open with init headers', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'initMessageHeaders': {'foo-key': 'foo-value'}};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const initHeaders_ = webChannel.channel_.initHeaders_;
    expect(initHeaders_).not.toBeNullish();
    expect(initHeaders_['foo-key']).toBe('foo-value');
  });

  it('open with message content type', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'messageContentType': 'application/protobuf+json'};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const initHeaders_ = webChannel.channel_.initHeaders_;
    expect(initHeaders_).not.toBeNullish();
    expect(initHeaders_['X-WebChannel-Content-Type'])
        .toBe('application/protobuf+json');
  });

  it('open with message content type and init headers', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {
      'messageContentType': 'application/protobuf+json',
      'initMessageHeaders': {'foo-key': 'foo-value'},
    };
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const initHeaders_ = webChannel.channel_.initHeaders_;
    expect(initHeaders_).not.toBeNullish();
    expect(initHeaders_['X-WebChannel-Content-Type'])
        .toBe('application/protobuf+json');
    expect(initHeaders_['foo-key']).toBe('foo-value');
  });

  it('client protocol header required', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'clientProtocolHeaderRequired': true};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const extraHeaders_ = webChannel.channel_.extraHeaders_;
    expect(extraHeaders_).not.toBeNullish();
    expect(extraHeaders_['X-Client-Protocol']).toBe('webchannel');
  });

  it('client protocol header not required by default', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const extraHeaders_ = webChannel.channel_.extraHeaders_;
    expect(extraHeaders_).toBeNull();
  });

  it('client protocol header required with custom header', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {
      'clientProtocolHeaderRequired': true,
      'messageHeaders': {'foo-key': 'foo-value'},
    };
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const extraHeaders_ = webChannel.channel_.extraHeaders_;
    expect(extraHeaders_).not.toBeNullish();
    expect(extraHeaders_['foo-key']).toBe('foo-value');
    expect(extraHeaders_['X-Client-Protocol']).toBe('webchannel');
  });

  it('open with custom params', async () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'messageUrlParams': {'foo-key': 'foo-value'}};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    /** @suppress {strictMissingProperties} Accessing private property. */
    const channel = webChannel.channel_;
    expect(channel).not.toBeNull();

    const mockXhrIo = mock(XhrIo);
    stubs.set(channel, 'createXhrIo', () => {
      return mockXhrIo;
    });

    webChannel.open();
    await Timer.promise(0);

    verify(mockXhrIo, times(1))
        .send(
            new ArgumentMatcher((uri) => {
              return uri.getParameterValue('foo-key') == 'foo-value';
            }),
            AnythingMatcher.anything(), AnythingMatcher.anything(),
            AnythingMatcher.anything());
  });

  it('open with http session id param', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'httpSessionIdParam': 'xsessionid'};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const httpSessionIdParam = webChannel.channel_.getHttpSessionIdParam();
    expect(httpSessionIdParam).toBe('xsessionid');
  });

  it('open with duplicated http session id param', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {
      'messageUrlParams': {'xsessionid': 'abcd1234'},
      'httpSessionIdParam': 'xsessionid',
    };
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    const httpSessionIdParam = webChannel.channel_.getHttpSessionIdParam();
    expect(httpSessionIdParam).toBe('xsessionid');

    /** @suppress {strictMissingProperties} Accessing private property. */
    const extraParams = webChannel.channel_.extraParams_;
    expect(extraParams['xsessionid']).toBeUndefined();
  });

  /** @suppress {strictMissingProperties} Accessing private property. */
  it('open with cors enabled', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'supportsCrossDomainXhr': true};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    expect(webChannel.channel_.supportsCrossDomainXhrs_).toBe(true);
  });

  it('send raw json default value', () => {
    let channelMsg;
    stubs.set(WebChannelBase.prototype, 'sendMap', (message) => {
      channelMsg = message;
    });

    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);
    webChannel.open();

    webChannel.send({foo: 'bar'});
    expect(channelMsg.foo).toBe('bar');
  });

  it('send raw json undefined value', () => {
    let channelMsg;
    stubs.set(WebChannelBase.prototype, 'sendMap', (message) => {
      channelMsg = message;
    });

    const webChannelTransport = new WebChannelBaseTransport();
    const options = {};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    webChannel.send({foo: 'bar'});
    expect(channelMsg.foo).toBe('bar');
  });

  /**
     @suppress {strictMissingProperties} suppression added to enable type
     checking
   */
  it('send raw json explicit true value', () => {
    let channelMsg;
    stubs.set(WebChannelBase.prototype, 'sendMap', (message) => {
      channelMsg = message;
    });
    stubs.set(WebChannelBase.prototype, 'getServerVersion', () => 12);

    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'sendRawJson': true};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    webChannel.send({foo: 'bar'});

    const receivedMsg = googJson.parse(channelMsg[Wire.RAW_DATA_KEY]);
    expect(receivedMsg.foo).toBe('bar');
  });

  it('send raw json explicit false value', () => {
    let channelMsg;
    stubs.set(WebChannelBase.prototype, 'sendMap', (message) => {
      channelMsg = message;
    });
    stubs.set(WebChannelBase.prototype, 'getServerVersion', () => 12);

    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'sendRawJson': false};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    webChannel.send({foo: 'bar'});
    expect(channelMsg.foo).toBe('bar');
  });

  it('open then close channel', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);

    let eventFired = false;
    events.listen(webChannel, WebChannel.EventType.CLOSE, (e) => {
      eventFired = true;
    });

    webChannel.open();
    expect(eventFired).toBe(false);

    /** @suppress {strictMissingProperties} Accessing private property. */
    const channel = webChannel.channel_;
    expect(channel).not.toBeNull();

    simulateCloseEvent(channel);
    expect(eventFired).toBe(true);
  });

  it('open then close channel with updated custom params', async () => {
    const webChannelTransport = new WebChannelBaseTransport();
    let messageUrlParams = {'foo-key': 'foo-value'};
    const options = {'messageUrlParams': messageUrlParams};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    /** @suppress {strictMissingProperties} Accessing private property. */
    const channel = webChannel.channel_;
    expect(channel).not.toBeNull();

    const mockXhrIo = mock(XhrIo);
    stubs.set(channel, 'createXhrIo', () => {
      return mockXhrIo;
    });

    webChannel.open();
    await Timer.promise(0);

    verify(mockXhrIo, atMost(1))
        .send(
            AnythingMatcher.anything(), AnythingMatcher.anything(),
            AnythingMatcher.anything(), AnythingMatcher.anything());

    // Update internal webchannel state to OPENED so that the close request can
    // be sent.
    channel.state_ = WebChannelBase.State.OPENED;

    // Set a new custom url param to be sent with the close request.
    messageUrlParams['close-key'] = 'close-value';

    const sendBeaconMock = mockFunction();
    if (goog.global.navigator.sendBeacon) {
      stubs.replace(goog.global.navigator, 'sendBeacon', sendBeaconMock);
    } else {
      // IE doesn't support sendBeacon() so we'll set it directly.
      goog.global.navigator.sendBeacon = sendBeaconMock;
    }

    webChannel.close();
    await Timer.promise(0);

    verify(sendBeaconMock, times(1))(
        new ArgumentMatcher((uriStr) => {
          return uriStr.includes('close-key=close-value');
        }),
        AnythingMatcher.anything());
  });

  it('channel error', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);

    const error = WebChannelBase.Error.NETWORK;
    let eventFired = false;
    events.listen(webChannel, WebChannel.EventType.ERROR, (e) => {
      eventFired = true;
      expect(e.status).toBe(WebChannel.ErrorStatus.NETWORK_ERROR);
    });

    webChannel.open();
    expect(eventFired).toBe(false);

    /** @suppress {strictMissingProperties} Accessing private property. */
    const channel = webChannel.channel_;
    expect(channel).not.toBeNull();

    simulateErrorEvent(channel, error);
    expect(eventFired).toBe(true);
  });

  it('channel message', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);

    let eventFired = false;
    const data = {message: 'foo'};
    events.listen(webChannel, WebChannel.EventType.MESSAGE, (e) => {
      eventFired = true;
      expect(e.data).toBe(data);
    });

    webChannel.open();
    expect(eventFired).toBe(false);

    /** @suppress {strictMissingProperties} Accessing private property. */
    const channel = webChannel.channel_;
    expect(channel).not.toBeNull();

    simulateMessageEvent(channel, data);
    expect(eventFired).toBe(true);
  });

  /**
   * @suppress {checkTypes} Allow sending a string as data, although not
   * supported by the method API, since it is done by clients.
   */
  it('channel message, string data supported', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);

    let eventFired = false;
    const data = 'foo';
    events.listen(webChannel, WebChannel.EventType.MESSAGE, (e) => {
      eventFired = true;
      expect(e.data).toBe(data);
    });

    webChannel.open();
    expect(eventFired).toBe(false);

    /** @suppress {strictMissingProperties} Accessing private property. */
    const channel = webChannel.channel_;
    expect(channel).not.toBeNull();

    simulateMessageEvent(channel, data);
    expect(eventFired).toBe(true);
  });

  it('channel message,  with metadata', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);

    let eventFired = false;
    const headers = {'header': 'value'};
    const statusCode = 200;
    const data = {'__headers__': {'header': 'value'}, '__status__': statusCode};
    events.listen(webChannel, WebChannel.EventType.MESSAGE, (e) => {
      eventFired = true;
      expect(e.data).toEqual({});
      expect(e.headers).toEqual(headers);
      expect(e.statusCode).toBe(statusCode);
    });

    webChannel.open();
    expect(eventFired).toBe(false);

    /** @suppress {strictMissingProperties} Accessing private property. */
    const channel = webChannel.channel_;
    expect(channel).not.toBeNull();

    simulateMessageEvent(channel, data);
    expect(eventFired).toBe(true);
  });

  // ALLOW_ORIGIN_TRIAL_FEATURES = false
  it('enable origin trials', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    let options = {
      'enableOriginTrials': true,
    };
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    let enabled = webChannel.channel_.enableOriginTrials_;
    expect(enabled).toBe(false);

    options = {
      'enableOriginTrials': false,
    };
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    enabled = webChannel.channel_.enableOriginTrials_;
    expect(enabled).toBe(false);

    options = {};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    enabled = webChannel.channel_.enableOriginTrials_;
    expect(enabled).toBe(false);

    options = undefined;
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    webChannel.open();

    /** @suppress {strictMissingProperties} Accessing private property. */
    enabled = webChannel.channel_.enableOriginTrials_;
    expect(enabled).toBe(false);
  });

  it('get non acked messages, with js object returns exact message', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);
    const messageToSend = {foo: 'bar'};
    const messageToSend2 = {foo2: 'bar2'};

    webChannel.open();
    webChannel.send(messageToSend);
    webChannel.send(messageToSend2);

    expect(webChannel.getRuntimeProperties().getNonAckedMessages()).toEqual([
      messageToSend, messageToSend2
    ]);
  });

  it('get non acked messages, with string returns exact message', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);
    const messageToSend = 'foo';
    const messageToSend2 = 'foo2';

    webChannel.open();
    webChannel.send(messageToSend);
    webChannel.send(messageToSend2);

    expect(webChannel.getRuntimeProperties().getNonAckedMessages()).toEqual([
      messageToSend, messageToSend2
    ]);
  });

  it('get non acked messages, with raw json returns equal object', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    const options = {'sendRawJson': true};
    webChannel = webChannelTransport.createWebChannel(channelUrl, options);
    const messageToSend = {foo: 'bar'};

    webChannel.open();
    webChannel.send(messageToSend);

    const nonAckedMessages =
        webChannel.getRuntimeProperties().getNonAckedMessages();
    expect(nonAckedMessages.length).toBe(1);
    // JSON objects went through serialization and deserialization so an equal
    // (but not the same) object is returned.
    expect(nonAckedMessages[0]).toEqual(messageToSend);
  });

  it('get non acked messages after channel close', () => {
    const webChannelTransport = new WebChannelBaseTransport();
    webChannel = webChannelTransport.createWebChannel(channelUrl);
    const messageToSend = {foo: 'bar'};
    const messageToSend2 = {foo2: 'bar2'};

    webChannel.open();
    webChannel.send(messageToSend);
    webChannel.send(messageToSend2);
    webChannel.close();

    expect(webChannel.getRuntimeProperties().getNonAckedMessages()).toEqual([
      messageToSend, messageToSend2
    ]);
  });
});
