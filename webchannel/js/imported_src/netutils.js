/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utility functions for managing networking, such as
 * testing network connectivity.
 *
 */

goog.module('goog.labs.net.webChannel.netUtils');
goog.module.declareLegacyNamespace();

const Uri = goog.require('goog.Uri');
const WebChannelDebug = goog.require('goog.labs.net.webChannel.WebChannelDebug');

/**
 * Default timeout to allow for URI pings.
 * @type {number}
 */
const NETWORK_TIMEOUT = 10000;

/**
 * Pings the network to check if an error is a server error or user's network
 * error.
 *
 * @param {function(boolean)} callback The function to call back with results.
 * @param {string=} opt_baseUrl The base URI to use for the network test.
 */
function testNetwork(callback, opt_baseUrl) {
  // default google.com image
  let baseUrl = opt_baseUrl || '//www.google.com/images/cleardot.gif';
  const useImageLoader = !opt_baseUrl;

  let uri = new Uri(baseUrl);

  if (!(goog.global.location && goog.global.location.protocol == 'http')) {
    uri.setScheme('https');  // e.g. chrome-extension
  }
  uri.makeUnique();

  if (useImageLoader) {
    testLoadImage(uri.toString(), NETWORK_TIMEOUT, callback);
  } else {
    testPingServer(uri.toString(), NETWORK_TIMEOUT, callback);
  }
}

/**
 * Test loading the given image.
 * @param {string} url URL to the image.
 * @param {number} timeout Milliseconds before giving up.
 * @param {function(boolean)} callback Function to call with results.
 * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
 */
function testLoadImage(url, timeout, callback) {
  const channelDebug = new WebChannelDebug();
  channelDebug.debug('TestLoadImage: loading ' + url);
  if (goog.global.Image) {
    const img = new Image();
    img.onload = goog.partial(
        networkTestCallback, channelDebug, 'TestLoadImage: loaded', true,
        callback, img);
    img.onerror = goog.partial(
        networkTestCallback, channelDebug, 'TestLoadImage: error', false,
        callback, img);
    img.onabort = goog.partial(
        networkTestCallback, channelDebug, 'TestLoadImage: abort', false,
        callback, img);
    img.ontimeout = goog.partial(
        networkTestCallback, channelDebug, 'TestLoadImage: timeout', false,
        callback, img);

    goog.global.setTimeout(function() {
      if (img.ontimeout) {
        img.ontimeout();
      }
    }, timeout);
    img.src = url;
  } else {
    // log ERROR_OTHER from environements where Image is not supported
    callback(false);
  }
}

/**
 * Pings the given server URL to test network availability.
 * @param {string} url URL to the server endpoint.
 * @param {number} timeout Milliseconds before giving up.
 * @param {function(boolean)} callback Function to call with results.
 */
function testPingServer(url, timeout, callback) {
  const channelDebug = new WebChannelDebug();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    networkTestCallback(
        channelDebug, 'TestPingServer: timeout', false, callback);
  }, timeout);

  fetch(url, {signal: controller.signal})
      .then((response) => {
        clearTimeout(timeoutId);
        if (response.ok) {
          networkTestCallback(
              channelDebug, 'TestPingServer: ok', true, callback);
        } else {
          networkTestCallback(
              channelDebug, 'TestPingServer: server error', false, callback);
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        networkTestCallback(
            channelDebug, 'TestPingServer: error', false, callback);
      });
}

/**
 * Wraps the network test callback with debug and cleanup logic.
 * @param {!WebChannelDebug} channelDebug The WebChannelDebug object.
 * @param {string} debugText The debug text.
 * @param {boolean} result The result of image loading.
 * @param {function(boolean)} callback Function to call with results.
 * @param {!Image=} opt_img The image element.
 */
function networkTestCallback(
    channelDebug, debugText, result, callback, opt_img) {
  try {
    channelDebug.debug(debugText);
    if (opt_img) {
      clearImageCallbacks(opt_img);
    }
    callback(result);
  } catch (e) {
    channelDebug.dumpException(e);
  }
}

/**
 * Clears handlers to avoid memory leaks.
 * @param {Image} img The image to clear handlers from.
 * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
 */
function clearImageCallbacks(img) {
  img.onload = null;
  img.onerror = null;
  img.onabort = null;
  img.ontimeout = null;
}

exports = {
  NETWORK_TIMEOUT,
  testLoadImage,
  testNetwork,
  testPingServer,
};
