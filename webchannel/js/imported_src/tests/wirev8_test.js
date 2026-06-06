/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/** @fileoverview Unit tests for WireV8. */

goog.module('goog.labs.net.webChannel.WireV8Test');
goog.setTestOnly();

const WireV8 = goog.require('goog.labs.net.webChannel.WireV8');

let wireCodec;

describe('goog.labs.net.webChannel.WireV8Test', () => {
  beforeEach(() => {
    wireCodec = new WireV8();
  });

  afterEach(() => {});

  it('encode simple message', () => {
    // scalar types only
    const message = {a: 'a', b: 'b'};
    const buff = [];
    wireCodec.encodeMessage(message, buff, 'prefix_');
    expect(buff.length).toBe(2);
    expect(buff[0]).toBe('prefix_a=a');
    expect(buff[1]).toBe('prefix_b=b');
  });

  it('encode complex message', () => {
    const message = {a: 'a', b: {x: 1, y: 2}};
    const buff = [];
    wireCodec.encodeMessage(message, buff, 'prefix_');
    expect(buff.length).toBe(2);
    expect(buff[0]).toBe('prefix_a=a');
    // a round-trip URI codec
    expect(decodeURIComponent(buff[1])).toBe('prefix_b={\"x\":1,\"y\":2}');
  });

  it('encode message queue', () => {
    const message1 = {a: 'a'};
    const queuedMessage1 = {map: message1, mapId: 3};
    const message2 = {b: 'b'};
    const queuedMessage2 = {map: message2, mapId: 4};
    const queue = [queuedMessage1, queuedMessage2];
    const result = wireCodec.encodeMessageQueue(queue, 2, null);
    expect(result).toBe('count=2&ofs=3&req0_a=a&req1_b=b');
  });

  it('decode message', () => {
    const message = wireCodec.decodeMessage('[{"a":"a", "x":1}, {"b":"b"}]');
    expect(Array.isArray(message)).toBe(true);
    expect(message.length).toBe(2);
    expect(message[0].a).toBe('a');
    expect(message[0].x).toBe(1);
    expect(message[1].b).toBe('b');
  });
});
