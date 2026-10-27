#import "WCDefaultJSONDecoder.h"

#import <XCTest/XCTest.h>

/** Ports the C++ client's json_decoder_test.cc. */
@interface WCDefaultJSONDecoderTest : XCTestCase
@end

@implementation WCDefaultJSONDecoderTest {
  WCDefaultJSONDecoder *_decoder;
}

- (void)setUp {
  [super setUp];
  _decoder = [[WCDefaultJSONDecoder alloc] init];
}

- (void)testDecodeArray {
  XCTAssertEqualObjects([self decode:@"[1, 2, 3, 4, 5]"], (@[ @1, @2, @3, @4, @5 ]));
}

- (void)testDecodeArrayRejectsMalformedInput {
  XCTAssertNil([self decode:@"[1, 2, 3"]);
  XCTAssertNil([self decode:@"not json at all"]);
  XCTAssertNil([self decode:@""]);
}

- (void)testDecodeArrayRejectsNonArray {
  XCTAssertNil([self decode:@"{\"key\":\"value\"}"]);
  XCTAssertNil([self decode:@"42"]);
}

#pragma mark - Private

- (NSArray<id> *)decode:(NSString *)JSON {
  return [_decoder decodeData:[JSON dataUsingEncoding:NSUTF8StringEncoding] maxDepth:1];
}

@end
