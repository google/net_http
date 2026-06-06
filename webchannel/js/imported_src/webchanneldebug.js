/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Provides a utility for tracing and debugging WebChannel
 *     requests.
 *
 */

goog.module('goog.labs.net.webChannel.WebChannelDebug');
goog.module.declareLegacyNamespace();

const Uri = goog.requireType('goog.Uri');
const XmlHttp = goog.requireType('goog.net.XmlHttp');
const googJson = goog.require('goog.json');
const log = goog.require('goog.log');

/**
 * Logs and keeps a buffer of debugging info for the Channel.
 *
 * @constructor
 * @struct
 * @final
 */
function WebChannelDebug() {
  /**
   * The logger instance.
   * @const
   * @private {?log.Logger}
   */
  this.logger_ = log.getLogger('goog.labs.net.webChannel.WebChannelDebug');

  /**
   * Whether to enable redact. Defaults to true.
   * @private {boolean}
   */
  this.redactEnabled_ = true;
}

/**
 * Turns off redact.
 */
WebChannelDebug.prototype.disableRedact = function() {
  this.redactEnabled_ = false;
};

/**
 * Logs that the browser went offline during the lifetime of a request.
 * @param {Uri} url The URL being requested.
 */
WebChannelDebug.prototype.browserOfflineResponse = function(url) {
  this.info(function() {
    return 'BROWSER_OFFLINE: ' + url;
  });
};

/**
 * Logs an XmlHttp request..
 * @param {string} verb The request type (GET/POST).
 * @param {Uri} uri The request destination.
 * @param {string|number|undefined} id The request id.
 * @param {number} attempt Which attempt # the request was.
 * @param {?string} postData The data posted in the request.
 */
WebChannelDebug.prototype.xmlHttpChannelRequest = function(
    verb, uri, id, attempt, postData) {
  const self = this;
  this.info(function() {
    return 'XMLHTTP REQ (' + id + ') [attempt ' + attempt + ']: ' + verb +
        '\n' + uri + '\n' + self.maybeRedactPostData_(postData);
  });
};

/**
 * Logs the meta data received from an XmlHttp request.
 * @param {string} verb The request type (GET/POST).
 * @param {Uri} uri The request destination.
 * @param {string|number|undefined} id The request id.
 * @param {number} attempt Which attempt # the request was.
 * @param {XmlHttp.ReadyState} readyState The ready state.
 * @param {number} statusCode The HTTP status code.
 */
WebChannelDebug.prototype.xmlHttpChannelResponseMetaData = function(
    verb, uri, id, attempt, readyState, statusCode) {
  this.info(function() {
    return 'XMLHTTP RESP (' + id + ') [ attempt ' + attempt + ']: ' + verb +
        '\n' + uri + '\n' + readyState + ' ' + statusCode;
  });
};

/**
 * Logs the response data received from an XmlHttp request.
 * @param {string|number|undefined} id The request id.
 * @param {?string} responseText The response text.
 * @param {?string=} opt_desc Optional request description.
 */
WebChannelDebug.prototype.xmlHttpChannelResponseText = function(
    id, responseText, opt_desc) {
  const self = this;
  this.info(function() {
    return 'XMLHTTP TEXT (' + id + '): ' + self.redactResponse_(responseText) +
        (opt_desc ? ' ' + opt_desc : '');
  });
};

/**
 * Logs a request timeout.
 * @param {Uri} uri The uri that timed out.
 */
WebChannelDebug.prototype.timeoutResponse = function(uri) {
  this.info(function() {
    return 'TIMEOUT: ' + uri;
  });
};

/**
 * Logs a debug message.
 * @param {!log.Loggable} text The message.
 */
WebChannelDebug.prototype.debug = function(text) {
  log.fine(this.logger_, text);
};

/**
 * Logs an exception
 * @param {Error} e The error or error event.
 * @param {log.Loggable=} opt_msg The optional message,
 *     defaults to 'Exception'.
 */
WebChannelDebug.prototype.dumpException = function(e, opt_msg) {
  log.error(this.logger_, opt_msg || 'Exception', e);
};

/**
 * Logs an info message.
 * @param {!log.Loggable} text The message.
 */
WebChannelDebug.prototype.info = function(text) {
  log.info(this.logger_, text);
};

/**
 * Logs a warning message.
 * @param {!log.Loggable} text The message.
 */
WebChannelDebug.prototype.warning = function(text) {
  log.warning(this.logger_, text);
};

/**
 * Logs a severe message.
 * @param {!log.Loggable} text The message.
 */
WebChannelDebug.prototype.severe = function(text) {
  log.error(this.logger_, text);
};

/**
 * Removes potentially private data from a response so that we don't
 * accidentally save private and personal data to the server logs.
 * @param {?string} responseText A JSON response to clean.
 * @return {?string} The cleaned response.
 * @private
 * @suppress {strictMissingProperties} Added to tighten compiler checks
 */
WebChannelDebug.prototype.redactResponse_ = function(responseText) {
  if (!this.redactEnabled_) {
    return responseText;
  }

  if (!responseText) {
    return null;
  }

  try {
    const responseArray = JSON.parse(responseText);
    if (responseArray) {
      for (let i = 0; i < responseArray.length; i++) {
        if (Array.isArray(responseArray[i])) {
          this.maybeRedactArray_(responseArray[i]);
        }
      }
    }

    return googJson.serialize(responseArray);
  } catch (e) {
    this.debug('Exception parsing expected JS array - probably was not JS');
    return responseText;
  }
};

/**
 * Removes data from a response array that may be sensitive.
 * @param {!Array<?>} array The array to clean.
 * @private
 */
WebChannelDebug.prototype.maybeRedactArray_ = function(array) {
  if (array.length < 2) {
    return;
  }
  const dataPart = array[1];
  if (!Array.isArray(dataPart)) {
    return;
  }
  if (dataPart.length < 1) {
    return;
  }

  const type = dataPart[0];
  if (type != 'noop' && type != 'stop' && type != 'close') {
    // redact all fields in the array
    for (let i = 1; i < dataPart.length; i++) {
      dataPart[i] = '';
    }
  }
};

/**
 * Removes potentially private data from a request POST body so that we don't
 * accidentally save private and personal data to the server logs.
 * @param {?string} data The data string to clean.
 * @return {?string} The data string with sensitive data replaced by 'redacted'.
 * @private
 */
WebChannelDebug.prototype.maybeRedactPostData_ = function(data) {
  if (!this.redactEnabled_) {
    return data;
  }

  if (!data) {
    return null;
  }
  let out = '';
  const params = data.split('&');
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const keyValue = param.split('=');
    if (keyValue.length > 1) {
      const key = keyValue[0];
      const value = keyValue[1];

      const keyParts = key.split('_');
      if (keyParts.length >= 2 && keyParts[1] == 'type') {
        out += key + '=' + value + '&';
      } else {
        out += key + '=' +
            'redacted' +
            '&';
      }
    }
  }
  return out;
};

exports = WebChannelDebug;
