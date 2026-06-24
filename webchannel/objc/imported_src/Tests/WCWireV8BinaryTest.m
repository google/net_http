#import <XCTest/XCTest.h>
#import "../WCQueuedMap.h"
#import "../WCSupport.h"
#import "../WCWireV8Binary.h"
#import <OCMock/OCMock.h>

@interface WCWireV8BinaryTest : XCTestCase
@end

@implementation WCWireV8BinaryTest {
  WCWireV8Binary *_wire;
  id _mockSupport;
}

- (void)setUp {
  [super setUp];
  _mockSupport = OCMProtocolMock(@protocol(WCSupport));
  _wire = [[WCWireV8Binary alloc] initWithSupport:_mockSupport];
}

- (void)testEncodeEmptyMessageQueue {
  NSArray<WCQueuedMap *> *messages = @[];
  NSData *encoded = [_wire encodeMessageQueue:messages numOfMessages:0];
  NSString *encodedString = [[NSString alloc] initWithData:encoded encoding:NSUTF8StringEncoding];
  XCTAssertEqualObjects(encodedString, @"count=0&\r\n");
}

- (void)testEncodeSingleMessage {
  NSDictionary<NSString *, NSString *> *map1 = @{@"__data__" : @"message1"};
  WCQueuedMap *qMap1 = [[WCQueuedMap alloc] initWithMapID:101 map:map1 context:nil];
  NSArray<WCQueuedMap *> *messages = @[ qMap1 ];

  NSData *encoded = [_wire encodeMessageQueue:messages numOfMessages:1];
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

  NSData *encoded = [_wire encodeMessageQueue:messages numOfMessages:2];
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

  NSData *encoded = [_wire encodeMessageQueue:messages numOfMessages:1];

  NSMutableData *expected = [NSMutableData data];
  [expected
      appendData:[@"count=1&ofs=101\r\nid=0&size=4\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [expected appendData:binaryData];

  XCTAssertEqualObjects(encoded, expected);
}

@end
