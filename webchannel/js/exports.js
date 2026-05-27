/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Entry point for compiling the WebChannel client library.
 * It imports the necessary Closure Library namespaces and exports them to module.exports.
 */

goog.require('goog.net.createWebChannelTransport');
goog.require('goog.labs.net.webChannel.requestStats');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.net.WebChannel');

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    'createWebChannelTransport': goog.net.createWebChannelTransport,
    'getStatEventTarget': goog.labs.net.webChannel.requestStats.getStatEventTarget,
    'Event': goog.labs.net.webChannel.requestStats.Event,
    'Stat': goog.labs.net.webChannel.requestStats.Stat,
    'ErrorCode': goog.net.ErrorCode,
    'EventType': goog.net.EventType,
    'WebChannel': goog.net.WebChannel
  };
}
