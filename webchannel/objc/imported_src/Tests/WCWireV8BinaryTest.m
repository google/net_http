#import <XCTest/XCTest.h>
#import "WCQueuedMap.h"
#import "WCWireV8Binary.h"

@interface WCWireV8BinaryTest : XCTestCase
@end

@implementation WCWireV8BinaryTest

- (void)testEncodeEmptyMessageQueue {
  NSArray<WCQueuedMap *> *messages = @[];
  NSData *encoded = [WCWireV8Binary encodeMessageQueue:messages numOfMessages:0];
  NSString *encodedString = [[NSString alloc] initWithData:encoded encoding:NSUTF8StringEncoding];
  XCTAssertEqualObjects(encodedString, @"count=0&\r\n");
}

- (void)testEncodeSingleMessage {
  NSDictionary<NSString *, NSString *> *map1 = @{@"__data__" : @"message1"};
  WCQueuedMap *qMap1 = [[WCQueuedMap alloc] initWithMapID:101 map:map1 context:nil];
  NSArray<WCQueuedMap *> *messages = @[ qMap1 ];

  NSData *encoded = [WCWireV8Binary encodeMessageQueue:messages numOfMessages:1];
  NSString *encodedString = [[NSString alloc] initWithData:encoded encoding:NSUTF8StringEncoding];

  NSString *expected = @"count=1&ofs=101\r\nid=0&size=8\r\nmessage1";
  XCTAssertEqualObjects(encodedString, expected);
}

- (void)testEncodeMultipleMessages {
  NSDictionary<NSString *, NSString *> *map1 = @{@"__data__" : @"message1"};
  WCQueuedMap *qMap1 = [[WCQueuedMap alloc] initWithMapID:101 map:map1 context:nil];

  NSDictionary<NSString *, NSString *> *map2 = @{@"__data__" : @"msg2"};
  WCQueuedMap *qMap2 = [[WCQueuedMap alloc] initWithMapID:102 map:map2 context:nil];

  NSArray<WCQueuedMap *> *messages = @[ qMap1, qMap2 ];

  NSData *encoded = [WCWireV8Binary encodeMessageQueue:messages numOfMessages:2];
  NSString *encodedString = [[NSString alloc] initWithData:encoded encoding:NSUTF8StringEncoding];

  NSString *expected = @"count=2&ofs=101\r\nid=0&size=8\r\nmessage1id=1&size=4\r\nmsg2";
  XCTAssertEqualObjects(encodedString, expected);
}

- (void)testEncodeSingleBinaryMessage {
  char bytes[] = {0x00, 0x01, 0xFF, 0xFE};
  NSData *binaryData = [NSData dataWithBytes:bytes length:4];
  NSDictionary<NSString *, NSData *> *map1 = @{@"__data__" : binaryData};
  WCQueuedMap *qMap1 = [[WCQueuedMap alloc] initWithMapID:101 map:map1 context:nil];
  NSArray<WCQueuedMap *> *messages = @[ qMap1 ];

  NSData *encoded = [WCWireV8Binary encodeMessageQueue:messages numOfMessages:1];

  NSMutableData *expected = [NSMutableData data];
  [expected
      appendData:[@"count=1&ofs=101\r\nid=0&size=4\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [expected appendData:binaryData];

  XCTAssertEqualObjects(encoded, expected);
}

- (void)testDecodeEmptyPayload {
  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:[NSData data]];
  XCTAssertNotNil(envelopes);
  XCTAssertEqual(envelopes.count, 0);
}

- (void)testDecodeSingleEnvelope {
  const char rawBytes[] = {'f', 'o', 'o', 0x00, 'b', 'a', 'r', (char)0xFF};
  NSData *payloadBytes = [NSData dataWithBytes:rawBytes length:8];

  NSMutableData *payload = [NSMutableData data];
  [payload appendData:[@"id=42&size=8\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [payload appendData:payloadBytes];

  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:payload];
  XCTAssertNotNil(envelopes);
  XCTAssertEqual(envelopes.count, 1);
  XCTAssertEqualObjects(envelopes[0][0], @(42));
  XCTAssertEqualObjects(envelopes[0][1], payloadBytes);
}

- (void)testDecodeMultipleEnvelopes {
  const char rawBytes1[] = {0x01, 0x02, 0x00};
  NSData *payload1 = [NSData dataWithBytes:rawBytes1 length:3];

  const char rawBytes2[] = {'h', 'e', 'l', 'l', 'o'};
  NSData *payload2 = [NSData dataWithBytes:rawBytes2 length:5];

  NSMutableData *payload = [NSMutableData data];
  [payload appendData:[@"id=1&size=3\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [payload appendData:payload1];
  [payload appendData:[@"id=2&size=5\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [payload appendData:payload2];

  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:payload];
  XCTAssertNotNil(envelopes);
  XCTAssertEqual(envelopes.count, 2);
  XCTAssertEqualObjects(envelopes[0][0], @(1));
  XCTAssertEqualObjects(envelopes[0][1], payload1);
  XCTAssertEqualObjects(envelopes[1][0], @(2));
  XCTAssertEqualObjects(envelopes[1][1], payload2);
}

- (void)testDecodeBinaryChunkBinaryPayload {
  const char rawBytes[] = {0x00, 0x01, 0x02, (char)0xFF, (char)0xAA};
  NSData *payloadBytes = [NSData dataWithBytes:rawBytes length:5];

  NSMutableData *payload = [NSMutableData data];
  [payload appendData:[@"id=501&size=5\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [payload appendData:payloadBytes];

  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:payload];
  XCTAssertNotNil(envelopes);
  XCTAssertEqual(envelopes.count, 1);
  XCTAssertEqualObjects(envelopes[0][0], @(501));
  XCTAssertEqualObjects(envelopes[0][1], payloadBytes);
}

- (void)testDecodeInvalidFormatMissingId {
  NSData *payload = [@"size=4\r\nabcd" dataUsingEncoding:NSUTF8StringEncoding];
  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:payload];
  XCTAssertNil(envelopes);
}

- (void)testDecodeInvalidFormatMissingSize {
  NSData *payload = [@"id=1\r\nabcd" dataUsingEncoding:NSUTF8StringEncoding];
  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:payload];
  XCTAssertNil(envelopes);
}

- (void)testDecodeInvalidFormatNonIntegerId {
  NSData *payload = [@"id=abc&size=4\r\nabcd" dataUsingEncoding:NSUTF8StringEncoding];
  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:payload];
  XCTAssertNil(envelopes);
}

- (void)testDecodeInvalidFormatNegativeSize {
  NSData *payload = [@"id=1&size=-4\r\nabcd" dataUsingEncoding:NSUTF8StringEncoding];
  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:payload];
  XCTAssertNil(envelopes);
}

- (void)testDecodeTruncatedPayload {
  NSData *payload = [@"id=1&size=10\r\nabcd" dataUsingEncoding:NSUTF8StringEncoding];
  NSArray<NSArray<id> *> *envelopes = [WCWireV8Binary decodeBinaryChunk:payload];
  XCTAssertNil(envelopes);
}

- (void)testIsBinaryChunk {
  NSString *sizePart = nil;

  XCTAssertFalse([WCWireV8Binary isBinaryChunk:@"12" sizePart:&sizePart]);
  XCTAssertEqualObjects(sizePart, @"12");

  XCTAssertFalse([WCWireV8Binary isBinaryChunk:@"12\r" sizePart:&sizePart]);
  XCTAssertEqualObjects(sizePart, @"12");

  XCTAssertFalse([WCWireV8Binary isBinaryChunk:@"0" sizePart:&sizePart]);
  XCTAssertEqualObjects(sizePart, @"0");

  XCTAssertTrue([WCWireV8Binary isBinaryChunk:@"24;data=binary" sizePart:&sizePart]);
  XCTAssertEqualObjects(sizePart, @"24");

  XCTAssertTrue([WCWireV8Binary isBinaryChunk:@"24;data=binary\r" sizePart:&sizePart]);
  XCTAssertEqualObjects(sizePart, @"24");

  XCTAssertFalse([WCWireV8Binary isBinaryChunk:@"24;other=extension" sizePart:&sizePart]);
  XCTAssertEqualObjects(sizePart, @"24");

  XCTAssertFalse([WCWireV8Binary isBinaryChunk:@"24;other=extension\r" sizePart:&sizePart]);
  XCTAssertEqualObjects(sizePart, @"24");

  XCTAssertTrue([WCWireV8Binary isBinaryChunk:@"100;data=binary" sizePart:nil]);
  XCTAssertTrue([WCWireV8Binary isBinaryChunk:@"100;data=binary\r" sizePart:nil]);
  XCTAssertFalse([WCWireV8Binary isBinaryChunk:@"100" sizePart:nil]);
  XCTAssertFalse([WCWireV8Binary isBinaryChunk:@"100\r" sizePart:nil]);
}

@end
