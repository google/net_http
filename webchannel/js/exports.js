/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

// Closure build entry point. Preserves the original bundle's public API;
// it does not reproduce its compiler/library versions or its output bytes.
goog.require('goog.net.createWebChannelTransport');
goog.require('goog.labs.net.webChannel.WebChannelBaseTransport');
goog.require('goog.labs.net.webChannel.requestStats');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.net.WebChannel');
goog.require('goog.events.EventTarget');
goog.require('goog.Disposable');

// Public method names must survive ADVANCED property renaming.
goog.exportProperty(goog.labs.net.webChannel.WebChannelBaseTransport.prototype, 'createWebChannel', goog.labs.net.webChannel.WebChannelBaseTransport.prototype.createWebChannel);
goog.exportProperty(goog.labs.net.webChannel.WebChannelBaseTransport.Channel.prototype, 'open', goog.labs.net.webChannel.WebChannelBaseTransport.Channel.prototype.open);
goog.exportProperty(goog.labs.net.webChannel.WebChannelBaseTransport.Channel.prototype, 'send', goog.labs.net.webChannel.WebChannelBaseTransport.Channel.prototype.send);
goog.exportProperty(goog.labs.net.webChannel.WebChannelBaseTransport.Channel.prototype, 'close', goog.labs.net.webChannel.WebChannelBaseTransport.Channel.prototype.close);
goog.exportProperty(goog.events.EventTarget.prototype, 'listen', goog.events.EventTarget.prototype.listen);
goog.exportProperty(goog.Disposable.prototype, 'dispose', goog.Disposable.prototype.dispose);
goog.exportProperty(goog.Disposable.prototype, 'isDisposed', goog.Disposable.prototype.isDisposed);
// The 2023 public Closure dependency predates the reference bundle's disposal protocol.
if (typeof Symbol['dispose'] !== 'symbol') {
  Object.defineProperty(Symbol, 'dispose', {value: Symbol('Symbol.dispose'), configurable: true, writable: true});
}
goog.Disposable.prototype[Symbol['dispose']] = function() { this['dispose'](); };

goog.exportProperty(goog.net.WebChannel, 'EventType', {
  'OPEN': goog.net.WebChannel.EventType.OPEN,
  'CLOSE': goog.net.WebChannel.EventType.CLOSE,
  'ERROR': goog.net.WebChannel.EventType.ERROR,
  'MESSAGE': goog.net.WebChannel.EventType.MESSAGE
});
goog.exportProperty(goog.net.WebChannel, 'ErrorStatus', {
  'OK': goog.net.WebChannel.ErrorStatus.OK,
  'NETWORK_ERROR': goog.net.WebChannel.ErrorStatus.NETWORK_ERROR,
  'SERVER_ERROR': goog.net.WebChannel.ErrorStatus.SERVER_ERROR
});

// Retain the public namespace surface, including its nested enum keys.
goog.exportProperty(goog.net.WebChannel, 'FailureRecovery', goog.net.WebChannel.FailureRecovery);
goog.exportProperty(goog.net.WebChannel.FailureRecovery, 'State', {
  'INIT': goog.net.WebChannel.FailureRecovery.State.INIT,
  'FAILED': goog.net.WebChannel.FailureRecovery.State.FAILED,
  'RECOVERING': goog.net.WebChannel.FailureRecovery.State.RECOVERING,
  'CLOSED': goog.net.WebChannel.FailureRecovery.State.CLOSED
});
goog.exportProperty(goog.net.WebChannel.FailureRecovery, 'FailureCondition', {
  'HTTP_ERROR': goog.net.WebChannel.FailureRecovery.FailureCondition.HTTP_ERROR,
  'ABORT': goog.net.WebChannel.FailureRecovery.FailureCondition.ABORT,
  'TIMEOUT': goog.net.WebChannel.FailureRecovery.FailureCondition.TIMEOUT,
  'EXCEPTION': goog.net.WebChannel.FailureRecovery.FailureCondition.EXCEPTION
});
goog.exportProperty(goog.net.WebChannel, 'MessageEvent', goog.net.WebChannel.MessageEvent);
goog.exportProperty(goog.net.WebChannel, 'ErrorEvent', goog.net.WebChannel.ErrorEvent);
goog.exportProperty(goog.net.WebChannel, 'X_CLIENT_PROTOCOL', goog.net.WebChannel.X_CLIENT_PROTOCOL);
goog.exportProperty(goog.net.WebChannel, 'X_CLIENT_PROTOCOL_WEB_CHANNEL', goog.net.WebChannel.X_CLIENT_PROTOCOL_WEB_CHANNEL);
goog.exportProperty(goog.net.WebChannel, 'X_CLIENT_WIRE_PROTOCOL', goog.net.WebChannel.X_CLIENT_WIRE_PROTOCOL);
goog.exportProperty(goog.net.WebChannel, 'X_HTTP_SESSION_ID', goog.net.WebChannel.X_HTTP_SESSION_ID);
goog.exportProperty(goog.net.WebChannel, 'X_HTTP_INITIAL_RESPONSE', goog.net.WebChannel.X_HTTP_INITIAL_RESPONSE);
goog.exportProperty(goog.net.WebChannel, 'X_WEBCHANNEL_CONTENT_TYPE', goog.net.WebChannel.X_WEBCHANNEL_CONTENT_TYPE);
goog.exportProperty(goog.net.WebChannel, 'X_WEBCHANNEL_CLIENT_PROFILE', goog.net.WebChannel.X_WEBCHANNEL_CLIENT_PROFILE);

if (typeof module !== 'undefined' && module.exports) {
  module.exports['createWebChannelTransport'] = function() {
    const transport = goog.net.createWebChannelTransport();
    const create = transport.createWebChannel;
    transport['createWebChannel'] = function(url, options) {
      // Newer XhrIo accepts createInstance-only factories; Closure 2023 also
      // expects getOptions(). Adapt without mutating the caller's factory.
      if (options && options.xmlHttpFactory && typeof options.xmlHttpFactory.getOptions !== 'function') {
        const factory = options.xmlHttpFactory;
        options = Object.assign({}, options, {
          xmlHttpFactory: {
            createInstance: function() { return factory.createInstance(); },
            getOptions: function() { return {}; }
          }
        });
      }
      return create.call(transport, url, options);
    };
    return transport;
  };
  module.exports['getStatEventTarget'] = goog.labs.net.webChannel.requestStats.getStatEventTarget;
  module.exports['Event'] = {
    'STAT_EVENT': goog.labs.net.webChannel.requestStats.Event.STAT_EVENT,
    'SERVER_REACHABILITY_EVENT': goog.labs.net.webChannel.requestStats.Event.SERVER_REACHABILITY_EVENT,
    'TIMING_EVENT': goog.labs.net.webChannel.requestStats.Event.TIMING_EVENT
  };
  module.exports['Stat'] = {
    'CONNECT_ATTEMPT': goog.labs.net.webChannel.requestStats.Stat.CONNECT_ATTEMPT,
    'ERROR_NETWORK': goog.labs.net.webChannel.requestStats.Stat.ERROR_NETWORK,
    'ERROR_OTHER': goog.labs.net.webChannel.requestStats.Stat.ERROR_OTHER,
    'TEST_STAGE_ONE_START': goog.labs.net.webChannel.requestStats.Stat.TEST_STAGE_ONE_START,
    'TEST_STAGE_TWO_START': goog.labs.net.webChannel.requestStats.Stat.TEST_STAGE_TWO_START,
    'TEST_STAGE_TWO_DATA_ONE': goog.labs.net.webChannel.requestStats.Stat.TEST_STAGE_TWO_DATA_ONE,
    'TEST_STAGE_TWO_DATA_TWO': goog.labs.net.webChannel.requestStats.Stat.TEST_STAGE_TWO_DATA_TWO,
    'TEST_STAGE_TWO_DATA_BOTH': goog.labs.net.webChannel.requestStats.Stat.TEST_STAGE_TWO_DATA_BOTH,
    'TEST_STAGE_ONE_FAILED': goog.labs.net.webChannel.requestStats.Stat.TEST_STAGE_ONE_FAILED,
    'TEST_STAGE_TWO_FAILED': goog.labs.net.webChannel.requestStats.Stat.TEST_STAGE_TWO_FAILED,
    'PROXY': goog.labs.net.webChannel.requestStats.Stat.PROXY,
    'NOPROXY': goog.labs.net.webChannel.requestStats.Stat.NOPROXY,
    'REQUEST_UNKNOWN_SESSION_ID': goog.labs.net.webChannel.requestStats.Stat.REQUEST_UNKNOWN_SESSION_ID,
    'REQUEST_BAD_STATUS': goog.labs.net.webChannel.requestStats.Stat.REQUEST_BAD_STATUS,
    'REQUEST_INCOMPLETE_DATA': goog.labs.net.webChannel.requestStats.Stat.REQUEST_INCOMPLETE_DATA,
    'REQUEST_BAD_DATA': goog.labs.net.webChannel.requestStats.Stat.REQUEST_BAD_DATA,
    'REQUEST_NO_DATA': goog.labs.net.webChannel.requestStats.Stat.REQUEST_NO_DATA,
    'REQUEST_TIMEOUT': goog.labs.net.webChannel.requestStats.Stat.REQUEST_TIMEOUT,
    'BACKCHANNEL_MISSING': goog.labs.net.webChannel.requestStats.Stat.BACKCHANNEL_MISSING,
    'BACKCHANNEL_DEAD': goog.labs.net.webChannel.requestStats.Stat.BACKCHANNEL_DEAD,
    'BROWSER_OFFLINE': goog.labs.net.webChannel.requestStats.Stat.BROWSER_OFFLINE
  };
  module.exports['ErrorCode'] = {
    'NO_ERROR': goog.net.ErrorCode.NO_ERROR,
    'ACCESS_DENIED': goog.net.ErrorCode.ACCESS_DENIED,
    'FILE_NOT_FOUND': goog.net.ErrorCode.FILE_NOT_FOUND,
    'FF_SILENT_ERROR': goog.net.ErrorCode.FF_SILENT_ERROR,
    'CUSTOM_ERROR': goog.net.ErrorCode.CUSTOM_ERROR,
    'EXCEPTION': goog.net.ErrorCode.EXCEPTION,
    'HTTP_ERROR': goog.net.ErrorCode.HTTP_ERROR,
    'ABORT': goog.net.ErrorCode.ABORT,
    'TIMEOUT': goog.net.ErrorCode.TIMEOUT,
    'OFFLINE': goog.net.ErrorCode.OFFLINE,
    'getDebugMessage': goog.net.ErrorCode.getDebugMessage
  };
  module.exports['EventType'] = {
    'COMPLETE': goog.net.EventType.COMPLETE,
    'SUCCESS': goog.net.EventType.SUCCESS,
    'ERROR': goog.net.EventType.ERROR,
    'ABORT': goog.net.EventType.ABORT,
    'READY': goog.net.EventType.READY,
    'READY_STATE_CHANGE': goog.net.EventType.READY_STATE_CHANGE,
    'TIMEOUT': goog.net.EventType.TIMEOUT,
    'INCREMENTAL_DATA': goog.net.EventType.INCREMENTAL_DATA,
    'PROGRESS': goog.net.EventType.PROGRESS,
    'DOWNLOAD_PROGRESS': goog.net.EventType.DOWNLOAD_PROGRESS,
    'UPLOAD_PROGRESS': goog.net.EventType.UPLOAD_PROGRESS
  };
  module.exports['WebChannel'] = goog.net.WebChannel;
}
