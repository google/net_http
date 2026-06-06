/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Implementation of a WebChannel transport using WebChannelBase.
 *
 * When WebChannelBase is used as the underlying transport, the capabilities
 * of the WebChannel are limited to what's supported by the implementation.
 * Particularly, multiplexing is not possible, and only strings are
 * supported as message types.
 */

goog.module('goog.labs.net.webChannel.WebChannelBaseTransport');
goog.module.declareLegacyNamespace();

const ChannelRequest = goog.require('goog.labs.net.webChannel.ChannelRequest');
const GoogEventTarget = goog.require('goog.events.EventTarget');
const WebChannel = goog.require('goog.net.WebChannel');
const WebChannelBase = goog.require('goog.labs.net.webChannel.WebChannelBase');
const WebChannelTransport = goog.require('goog.net.WebChannelTransport');
const Wire = goog.require('goog.labs.net.webChannel.Wire');
const asserts = goog.require('goog.asserts');
const googJson = goog.require('goog.json');
const googObject = goog.require('goog.object');
const googString = goog.require('goog.string');
const log = goog.require('goog.log');
const maps = goog.require('goog.collections.maps');

/**
 * Implementation of {@link WebChannelTransport} with
 * {@link WebChannelBase} as the underlying channel
 * implementation.
 *
 * @constructor
 * @struct
 * @implements {WebChannelTransport}
 * @final
 */
function WebChannelBaseTransport() {
  if (!ChannelRequest.supportsXhrStreaming()) {
    throw new Error('Environmental error: no available transport.');
  }
}

/**
 * @override
 */
WebChannelBaseTransport.prototype.createWebChannel = function(
    url, opt_options) {
  return new WebChannelBaseTransport.Channel(url, opt_options);
};

/**
 * Implementation of the {@link WebChannel} interface.
 *
 * @param {string} url The URL path for the new WebChannel instance.
 * @param {!WebChannel.Options=} opt_options Configuration for the
 *     new WebChannel instance.
 *
 * @constructor
 * @implements {WebChannel}
 * @extends {GoogEventTarget}
 * @final
 */
WebChannelBaseTransport.Channel = function(url, opt_options) {
  WebChannelBaseTransport.Channel.base(this, 'constructor');

  /**
   * @private {!WebChannelBase} The underlying channel object.
   */
  this.channel_ =
      new WebChannelBase(opt_options, WebChannelTransport.CLIENT_VERSION);

  /**
   * @private {string} The URL of the target server end-point.
   */
  this.url_ = url;

  /**
   * @private {log.Logger} The logger for this class.
   */
  this.logger_ =
      log.getLogger('goog.labs.net.webChannel.WebChannelBaseTransport');

  /**
   * @private {Object<string, string>} Extra URL parameters
   * to be added to each HTTP request.
   */
  this.messageUrlParams_ =
      (opt_options && opt_options.messageUrlParams) || null;

  let messageHeaders = (opt_options && opt_options.messageHeaders) || null;

  // default is false
  if (opt_options && opt_options.clientProtocolHeaderRequired) {
    if (messageHeaders) {
      googObject.set(
          messageHeaders, WebChannel.X_CLIENT_PROTOCOL,
          WebChannel.X_CLIENT_PROTOCOL_WEB_CHANNEL);
    } else {
      messageHeaders = googObject.create(
          WebChannel.X_CLIENT_PROTOCOL,
          WebChannel.X_CLIENT_PROTOCOL_WEB_CHANNEL);
    }
  }

  this.channel_.setExtraHeaders(messageHeaders);

  let initHeaders = (opt_options && opt_options.initMessageHeaders) || null;

  if (opt_options && opt_options.messageContentType) {
    if (initHeaders) {
      googObject.set(
          initHeaders, WebChannel.X_WEBCHANNEL_CONTENT_TYPE,
          opt_options.messageContentType);
    } else {
      initHeaders = googObject.create(
          WebChannel.X_WEBCHANNEL_CONTENT_TYPE, opt_options.messageContentType);
    }
  }

  if (opt_options && opt_options.clientProfile) {
    if (initHeaders) {
      googObject.set(
          initHeaders, WebChannel.X_WEBCHANNEL_CLIENT_PROFILE,
          opt_options.clientProfile);
    } else {
      initHeaders = googObject.create(
          WebChannel.X_WEBCHANNEL_CLIENT_PROFILE, opt_options.clientProfile);
    }
  }

  this.channel_.setInitHeaders(initHeaders);

  const httpHeadersOverwriteParam =
      opt_options && opt_options.httpHeadersOverwriteParam;
  if (httpHeadersOverwriteParam &&
      !googString.isEmptyOrWhitespace(httpHeadersOverwriteParam)) {
    this.channel_.setHttpHeadersOverwriteParam(httpHeadersOverwriteParam);
  }

  /**
   * @private {boolean} Whether to enable CORS.
   */
  this.supportsCrossDomainXhr_ =
      (opt_options && opt_options.supportsCrossDomainXhr) || false;

  /**
   * @private {boolean} Whether to send raw Json and bypass v8 wire format.
   */
  this.sendRawJson_ = (opt_options && opt_options.sendRawJson) || false;

  // Note that httpSessionIdParam will be ignored if the same parameter name
  // has already been specified with messageUrlParams
  const httpSessionIdParam = opt_options && opt_options.httpSessionIdParam;
  if (httpSessionIdParam &&
      !googString.isEmptyOrWhitespace(httpSessionIdParam)) {
    this.channel_.setHttpSessionIdParam(httpSessionIdParam);
    if (googObject.containsKey(this.messageUrlParams_, httpSessionIdParam)) {
      googObject.remove(this.messageUrlParams_, httpSessionIdParam);
      log.warning(
          this.logger_,
          'Ignore httpSessionIdParam also specified with messageUrlParams: ' +
              httpSessionIdParam);
    }
  }

  /**
   * The channel handler.
   *
   * @private {!WebChannelBaseTransport.Channel.Handler_}
   */
  this.channelHandler_ = new WebChannelBaseTransport.Channel.Handler_(this);
};
goog.inherits(WebChannelBaseTransport.Channel, GoogEventTarget);

/**
 * @override
 */
WebChannelBaseTransport.Channel.prototype.open = function() {
  this.channel_.setHandler(this.channelHandler_);
  if (this.supportsCrossDomainXhr_) {
    this.channel_.setSupportsCrossDomainXhrs(true);
  }
  this.channel_.connect(this.url_, (this.messageUrlParams_ || undefined));
};

/**
 * @override
 */
WebChannelBaseTransport.Channel.prototype.close = function() {
  this.channel_.disconnect();
};

/**
 * @override
 */
WebChannelBaseTransport.Channel.prototype.halfClose = function() {
  // to be implemented
  throw new Error('Not implemented');
};

/**
 * The WebChannelBase only supports object types.
 *
 * @param {!WebChannel.MessageData} message The message to send.
 *
 * @override
 */
WebChannelBaseTransport.Channel.prototype.send = function(message) {
  this.channel_.sendMap(this.messageToMapObject_(message));
};

/**
 * Converts a message to the map used by the underlying channel.
 *
 * @param {!WebChannel.MessageData} message
 * @return {!Object|!maps.MapLike}
 */
WebChannelBaseTransport.Channel.prototype.messageToMapObject_ = function(
    message) {
  asserts.assert(
      goog.isObject(message) || typeof message === 'string',
      'only object type or raw string is supported');

  if (typeof message === 'string') {
    const rawJson = {};
    rawJson[Wire.RAW_DATA_KEY] = message;
    return rawJson;
  }

  if (this.sendRawJson_) {
    const rawJson = {};
    rawJson[Wire.RAW_DATA_KEY] = googJson.serialize(message);
    return rawJson;
  }

  return message;
};

/**
 * Converts the map used by the underlying channel to a message.
 *
 * NOTE: In the case of the message being JS Object or string, the exact same
 * object passed during `messageToMapObject_()` is returned. In the case of raw
 * JSON, an equal (but not the same) object is returned (due to serialization).
 *
 * @param {!Object|!maps.MapLike} map
 * @return {!WebChannel.MessageData}
 */
WebChannelBaseTransport.Channel.prototype.mapObjectToMessage_ = function(map) {
  if (Wire.RAW_DATA_KEY in map) {
    const rawMessage = map[Wire.RAW_DATA_KEY];

    if (this.sendRawJson_) {
      return /** @type {!WebChannel.MessageData} */ (
          googJson.parse(rawMessage));
    } else {  // string message
      return rawMessage;
    }
  }

  return map;
};

/**
 * @override
 */
WebChannelBaseTransport.Channel.prototype.disposeInternal = function() {
  this.channel_.setHandler(null);
  delete this.channelHandler_;
  this.channel_.disconnect();
  delete this.channel_;

  WebChannelBaseTransport.Channel.base(this, 'disposeInternal');
};

/**
 * The message event.
 *
 * @param {!Array<?>|!Object} array The data array from the underlying channel.
 * @constructor
 * @extends {WebChannel.MessageEvent}
 * @final
 */
WebChannelBaseTransport.Channel.MessageEvent = function(array) {
  WebChannelBaseTransport.Channel.MessageEvent.base(this, 'constructor');

  // Metadata as HTTP headers and status code (always come in a pair).
  if (array['__headers__']) {
    this.headers = array['__headers__'];
    this.statusCode = array['__status__'];
    delete array['__headers__'];
    delete array['__status__'];
  }

  // single-metadata only
  const metadata = array['__sm__'];
  if (metadata) {
    this.metadataKey = googObject.getAnyKey(metadata);
    if (this.metadataKey) {
      this.data = googObject.get(metadata, this.metadataKey);
    } else {
      this.data = metadata;  // empty
    }
  } else {
    this.data = array;
  }
};
goog.inherits(
    WebChannelBaseTransport.Channel.MessageEvent, WebChannel.MessageEvent);

/**
 * The error event.
 *
 * @param {WebChannelBase.Error} error The error code.
 * @constructor
 * @extends {WebChannel.ErrorEvent}
 * @final
 */
WebChannelBaseTransport.Channel.ErrorEvent = function(error) {
  WebChannelBaseTransport.Channel.ErrorEvent.base(this, 'constructor');

  /**
   * High-level status code.
   */
  this.status = WebChannel.ErrorStatus.NETWORK_ERROR;

  /**
   * @const {WebChannelBase.Error} Internal error code, for debugging use only.
   */
  this.errorCode = error;
};
goog.inherits(
    WebChannelBaseTransport.Channel.ErrorEvent, WebChannel.ErrorEvent);

/**
 * Implementation of {@link WebChannelBase.Handler} interface.
 *
 * @param {!WebChannelBaseTransport.Channel} channel The enclosing WebChannel.
 *
 * @constructor
 * @extends {WebChannelBase.Handler}
 * @private
 */
WebChannelBaseTransport.Channel.Handler_ = function(channel) {
  WebChannelBaseTransport.Channel.Handler_.base(this, 'constructor');

  /**
   * @type {!WebChannelBaseTransport.Channel}
   * @private
   */
  this.channel_ = channel;
};
goog.inherits(WebChannelBaseTransport.Channel.Handler_, WebChannelBase.Handler);

/**
 * @override
 */
WebChannelBaseTransport.Channel.Handler_.prototype.channelOpened = function(
    channel) {
  log.info(this.channel_.logger_, 'WebChannel opened on ' + this.channel_.url_);
  this.channel_.dispatchEvent(WebChannel.EventType.OPEN);
};

/**
 * @override
 */
WebChannelBaseTransport.Channel.Handler_.prototype.channelHandleArray =
    function(channel, array) {
  asserts.assert(array, 'array expected to be defined');
  this.channel_.dispatchEvent(
      new WebChannelBaseTransport.Channel.MessageEvent(array));
};

/**
 * @override
 */
WebChannelBaseTransport.Channel.Handler_.prototype.channelError = function(
    channel, error) {
  log.info(
      this.channel_.logger_,
      'WebChannel aborted on ' + this.channel_.url_ +
          ' due to channel error: ' + error);
  this.channel_.dispatchEvent(
      new WebChannelBaseTransport.Channel.ErrorEvent(error));
};

/**
 * @override
 */
WebChannelBaseTransport.Channel.Handler_.prototype.channelClosed = function(
    channel, opt_pendingMaps, opt_undeliveredMaps) {
  log.info(this.channel_.logger_, 'WebChannel closed on ' + this.channel_.url_);
  this.channel_.dispatchEvent(WebChannel.EventType.CLOSE);
};

/**
 * @override
 */
WebChannelBaseTransport.Channel.prototype.getRuntimeProperties = function() {
  return new WebChannelBaseTransport.ChannelProperties(this, this.channel_);
};

/**
 * Implementation of the {@link WebChannel.RuntimeProperties}.
 *
 * @param {!WebChannelBaseTransport.Channel} transportChannel The transport
 *     channel object.
 * @param {!WebChannelBase} channel The underlying channel object.
 *
 * @constructor
 * @implements {WebChannel.RuntimeProperties}
 * @final
 */
WebChannelBaseTransport.ChannelProperties = function(
    transportChannel, channel) {
  /**
   * The transport channel object.
   *
   * @private @const {!WebChannelBaseTransport.Channel}
   */
  this.transportChannel_ = transportChannel;

  /**
   * The underlying channel object.
   *
   * @private @const {!WebChannelBase}
   */
  this.channel_ = channel;
};

/**
 * @override
 */
WebChannelBaseTransport.ChannelProperties.prototype.getConcurrentRequestLimit =
    function() {
  return this.channel_.getForwardChannelRequestPool().getMaxSize();
};

/**
 * @override
 */
WebChannelBaseTransport.ChannelProperties.prototype.isSpdyEnabled = function() {
  return this.getConcurrentRequestLimit() > 1;
};

/**
 * @override
 */
WebChannelBaseTransport.ChannelProperties.prototype.getPendingRequestCount =
    function() {
  return this.channel_.getForwardChannelRequestPool().getRequestCount();
};

/**
 * @override
 * @return {!Array<!WebChannel.MessageData>}
 */
WebChannelBaseTransport.ChannelProperties.prototype.getNonAckedMessages =
    function() {
  return this.channel_.getNonAckedMaps().map(
      queued_map => this.transportChannel_.mapObjectToMessage_(queued_map.map));
};

/**
 * @override
 */
WebChannelBaseTransport.ChannelProperties.prototype.getHttpSessionId =
    function() {
  return this.channel_.getHttpSessionId();
};

/**
 * @override
 */
WebChannelBaseTransport.ChannelProperties.prototype.commit = function(
    callback) {
  this.channel_.setForwardChannelFlushCallback(callback);
};

/**
 * @override
 * @return {number}
 */
WebChannelBaseTransport.ChannelProperties.prototype.getNonAckedMessageGap =
    function() {
  return this.channel_.getNonAckedMessageGap();
};

/**
 * @override
 */
WebChannelBaseTransport.ChannelProperties.prototype.notifyNonAckedMessageCount =
    goog.abstractMethod;

/**
 * @override
 */
WebChannelBaseTransport.ChannelProperties.prototype.onCommit =
    goog.abstractMethod;

/**
 * @override
 */
WebChannelBaseTransport.ChannelProperties.prototype.ackCommit =
    goog.abstractMethod;

/**
 * @override
 * @return {!Object<string, string>|undefined}
 */
WebChannelBaseTransport.ChannelProperties.prototype.getLastResponseHeaders =
    function() {
  return this.channel_.getLastResponseHeaders();
};

/** @override */
WebChannelBaseTransport.ChannelProperties.prototype.getLastStatusCode =
    function() {
  return this.channel_.getLastStatusCode();
};

exports = WebChannelBaseTransport;
