/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Codec functions of the v8 wire protocol. Eventually we'd want
 * to support pluggable wire-format to improve wire efficiency and to enable
 * binary encoding. Such support will require an interface class, which
 * will be added later.
 *
 */

goog.module('goog.labs.net.webChannel.WireV8');
goog.module.declareLegacyNamespace();

const NativeJsonProcessor = goog.require('goog.json.NativeJsonProcessor');
const Parser = goog.requireType('goog.string.Parser');
const Wire = goog.require('goog.labs.net.webChannel.Wire');
const asserts = goog.require('goog.asserts');
const googJson = goog.require('goog.json');
const maps = goog.require('goog.collections.maps');

/**
 * The v8 codec class.
 *
 * @constructor
 * @struct
 */
function WireV8() {
  /**
   * Parser for a response payload. The parser should return an array.
   * @private {!Parser}
   */
  this.parser_ = new NativeJsonProcessor();
}

/**
 * Encodes a standalone message into the wire format.
 *
 * May throw exception if the message object contains any invalid elements.
 *
 * @param {!Object|!maps.MapLike} message The message data.
 *     V8 only support JS objects (or Map).
 * @param {!Array<string>} buffer The text buffer to write the message to.
 * @param {string=} opt_prefix The prefix for each field of the object.
 */
WireV8.prototype.encodeMessage = function(message, buffer, opt_prefix) {
  const prefix = opt_prefix || '';
  try {
    const collection =
        message instanceof Map ? message : Object.entries(message);
    for (const [key, value] of collection) {
      let encodedValue = value;
      if (goog.isObject(value)) {
        encodedValue = googJson.serialize(value);
      }  // keep the fast-path for primitive types
      buffer.push(prefix + key + '=' + encodeURIComponent(encodedValue));
    }
  } catch (ex) {
    // We send a map here because lots of the retry logic relies on map IDs,
    // so we have to send something (possibly redundant).
    buffer.push(
        prefix + 'type' +
        '=' + encodeURIComponent('_badmap'));
    throw ex;
  }
};

/**
 * Encodes all the buffered messages of the forward channel.
 *
 * @param {!Array<Wire.QueuedMap>} messageQueue The message data.
 *     V8 only support JS objects.
 * @param {number} count The number of messages to be encoded.
 * @param {?function(!Object)} badMapHandler Callback for bad messages.
 * @return {string} the encoded messages
 */
WireV8.prototype.encodeMessageQueue = function(
    messageQueue, count, badMapHandler) {
  let offset = -1;
  while (true) {
    const sb = ['count=' + count];
    // To save a bit of bandwidth, specify the base mapId and the rest as
    // offsets from it.
    if (offset == -1) {
      if (count > 0) {
        offset = messageQueue[0].mapId;
        sb.push('ofs=' + offset);
      } else {
        offset = 0;
      }
    } else {
      sb.push('ofs=' + offset);
    }
    let done = true;
    for (let i = 0; i < count; i++) {
      let mapId = messageQueue[i].mapId;
      const map = messageQueue[i].map;
      mapId -= offset;
      if (mapId < 0) {
        // redo the encoding in case of retry/reordering, plus extra space
        offset = Math.max(0, messageQueue[i].mapId - 100);
        done = false;
        continue;
      }
      try {
        this.encodeMessage(map, sb, 'req' + mapId + '_');
      } catch (ex) {
        if (badMapHandler) {
          badMapHandler(map);
        }
      }
    }
    if (done) {
      return sb.join('&');
    }
  }
};

/**
 * Decodes a standalone message received from the wire. May throw exception
 * if text is ill-formatted.
 *
 * Must be valid JSON as it is insecure to use eval() to decode JS literals;
 * and eval() is disallowed in Chrome apps too.
 *
 * Invalid JS literals include null array elements, quotas etc.
 *
 * @param {string} messageText The string content as received from the wire.
 * @return {*} The decoded message object.
 */
WireV8.prototype.decodeMessage = function(messageText) {
  const response = this.parser_.parse(messageText);
  asserts.assert(Array.isArray(response));  // throw exception
  return response;
};

exports = WireV8;
