/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview This class manages the network connectivity state.
 *
 */


goog.module('goog.labs.net.webChannel.ConnectionState');

goog.module.declareLegacyNamespace();

/**
 * The connectivity state of the channel.
 *
 * To be used for the new buffering-proxy detection algorithm.
 *
 * @constructor
 * @struct
 */
function ConnectionState() {
  /**
   * Handshake result.
   * @type {?Array<string>}
   */
  this.handshakeResult = null;

  /**
   * The result of checking if there is a buffering proxy in the network.
   * True means the connection is buffered, False means unbuffered,
   * null means that the result is not available.
   * @type {?boolean}
   */
  this.bufferingProxyResult = null;
}

// MOE:begin_strip
// Ensure ES2021 inputs. go/transpile-js
null?.(6_6);
// MOE:end_strip

exports = ConnectionState;
