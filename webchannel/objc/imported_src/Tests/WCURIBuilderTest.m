#import "WCURIBuilder.h"

#import <XCTest/XCTest.h>

static NSString *const kURL = @"https://example.com/channel";
static NSString *const kUriBuilderTestURL = @"https://www.example.com:123/9891877956096339";
static NSString *const kMixedValue = @"a&b=c d,\u00e9+%/~!*()'";

static NSString *WCStringWithCharactersInRange(unichar first, unichar last) {
  NSMutableString *string = [NSMutableString string];
  for (unichar c = first; c <= last; c++) {
    [string appendFormat:@"%C", c];
  }
  return string;
}

static NSString *WCURLStringAddingQueryParameter(NSString *URLString, NSString *name,
                                                 NSString *value) {
  NSURLComponents *components = [NSURLComponents componentsWithString:URLString];
  WCAddQueryParameter(components, name, value);
  return components.URL.absoluteString;
}

/** Expected values come from the C++ client's URI builder tests or a C++ run. */
@interface WCURIBuilderTest : XCTestCase
@end

@implementation WCURIBuilderTest

#pragma mark - WCEncodeURIComponent

- (void)testEncodeURIComponentPrintableASCII {
  XCTAssertEqualObjects(WCEncodeURIComponent(WCStringWithCharactersInRange(0x20, 0x7E)),
                        @"%20!%22%23%24%25%26%27()*%2B%2C-.%2F0123456789%3A%3B%3C%3D%3E%3F%40"
                        @"ABCDEFGHIJKLMNOPQRSTUVWXYZ%5B%5C%5D%5E_%60abcdefghijklmnopqrstuvwxyz"
                        @"%7B%7C%7D~");
}

- (void)testEncodeURIComponentControlCharacters {
  NSString *controls = [WCStringWithCharactersInRange(0x01, 0x1F)
      stringByAppendingString:WCStringWithCharactersInRange(0x7F, 0x7F)];
  XCTAssertEqualObjects(WCEncodeURIComponent(controls),
                        @"%01%02%03%04%05%06%07%08%09%0A%0B%0C%0D%0E%0F%10%11%12%13%14%15%16%17%18"
                        @"%19%1A%1B%1C%1D%1E%1F%7F");
}

- (void)testEncodeURIComponentNUL {
  unichar characters[] = {'a', 0, 'b'};
  XCTAssertEqualObjects(WCEncodeURIComponent([NSString stringWithCharacters:characters length:3]),
                        @"a%00b");
}

- (void)testEncodeURIComponentNonASCII {
  XCTAssertEqualObjects(WCEncodeURIComponent(@"\u00e9\u20ac\U0001F600\u4e2d"),
                        @"%C3%A9%E2%82%AC%F0%9F%98%80%E4%B8%AD");
}

- (void)testEncodeURIComponentMixed {
  XCTAssertEqualObjects(WCEncodeURIComponent(kMixedValue),
                        @"a%26b%3Dc%20d%2C%C3%A9%2B%25%2F~!*()%27");
}

- (void)testEncodeURIComponentEncodeOk {
  XCTAssertEqualObjects(WCEncodeURIComponent(@"test:$#@=?%^Q^$"),
                        @"test%3A%24%23%40%3D%3F%25%5EQ%5E%24");
}

- (void)testEncodeURIComponentEmpty {
  XCTAssertEqualObjects(WCEncodeURIComponent(@""), @"");
}

- (void)testEncodeURIComponentReplacesUnpairedSurrogates {
  unichar characters[] = {'a', 0xD83D, 'b', 0xDE00, 0xD83D, 0xDE00, 0xD83D};
  XCTAssertEqualObjects(WCEncodeURIComponent([NSString stringWithCharacters:characters length:7]),
                        @"a%EF%BF%BDb%EF%BF%BD%F0%9F%98%80%EF%BF%BD");
}

#pragma mark - WCAddQueryParameter

- (void)testAddQueryParameter {
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"query", @"param"),
                        [kUriBuilderTestURL stringByAppendingString:@"?query=param"]);
}

- (void)testAddMultipleQueryParameters {
  NSString *URLString = [kUriBuilderTestURL stringByAppendingString:@"?query=param"];
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(URLString, @"query2", @"param2"),
                        [kUriBuilderTestURL stringByAppendingString:@"?query=param&query2=param2"]);
}

- (void)testAddMultipleQueryTrailingQuestionMark {
  NSString *URLString = [kUriBuilderTestURL stringByAppendingString:@"?"];
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(URLString, @"query", @"param"),
                        [kUriBuilderTestURL stringByAppendingString:@"?query=param"]);
}

- (void)testAddQueryParameterEscapesSpecialCharacters {
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"k", @"a=1&b=2 foo"),
                        [kUriBuilderTestURL stringByAppendingString:@"?k=a%3D1%26b%3D2%20foo"]);
}

- (void)testAddQueryParameterValues {
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kURL, @"a", @""),
                        @"https://example.com/channel?a=");
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kURL, @"a", kMixedValue),
                        @"https://example.com/channel?a=a%26b%3Dc%20d%2C%C3%A9%2B%25%2F~!*()%27");
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kURL, @"a", @"\t\n\r"),
                        @"https://example.com/channel?a=%09%0A%0D");
}

- (void)testAddQueryParameterEscapesName {
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"$req", @"v"),
                        [kUriBuilderTestURL stringByAppendingString:@"?%24req=v"]);
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"a&b", @"v"),
                        [kUriBuilderTestURL stringByAppendingString:@"?a%26b=v"]);
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"a=b", @"v"),
                        [kUriBuilderTestURL stringByAppendingString:@"?a%3Db=v"]);
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"a+b", @"v"),
                        [kUriBuilderTestURL stringByAppendingString:@"?a%2Bb=v"]);
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"a%41", @"v"),
                        [kUriBuilderTestURL stringByAppendingString:@"?a%2541=v"]);
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"a#b", @"v"),
                        [kUriBuilderTestURL stringByAppendingString:@"?a%23b=v"]);
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(kUriBuilderTestURL, @"a\t\n\rb", @"v"),
                        [kUriBuilderTestURL stringByAppendingString:@"?a%09%0A%0Db=v"]);
}

- (void)testAddQueryParameterReplacesExistingName {
  NSString *URLString = [kUriBuilderTestURL stringByAppendingString:@"?a=1&b=2&a=3"];
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(URLString, @"a", @"4"),
                        [kUriBuilderTestURL stringByAppendingString:@"?a=4&b=2"]);
}

- (void)testAddQueryParameterTwiceKeepsFirstPosition {
  NSURLComponents *components = [NSURLComponents componentsWithString:kUriBuilderTestURL];
  WCAddQueryParameter(components, @"a", @"1");
  WCAddQueryParameter(components, @"b", @"2");
  WCAddQueryParameter(components, @"a", @"3");
  XCTAssertEqualObjects(components.URL.absoluteString,
                        [kUriBuilderTestURL stringByAppendingString:@"?a=3&b=2"]);
}

- (void)testAddQueryParameterComparesEncodedNames {
  NSString *URLString = [kUriBuilderTestURL stringByAppendingString:@"?%24req=old&x=1"];
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(URLString, @"$req", @"new"),
                        [kUriBuilderTestURL stringByAppendingString:@"?%24req=new&x=1"]);
}

- (void)testAddQueryParameterKeepsFragmentLast {
  NSString *fragmentOnly = [kUriBuilderTestURL stringByAppendingString:@"#frag"];
  NSString *queryAndFragment = [kUriBuilderTestURL stringByAppendingString:@"?x=1#frag"];
  NSString *emptyQueryAndFragment = [kUriBuilderTestURL stringByAppendingString:@"?#frag"];
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(fragmentOnly, @"VER", @"8"),
                        [kUriBuilderTestURL stringByAppendingString:@"?VER=8#frag"]);
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(queryAndFragment, @"VER", @"8"),
                        [kUriBuilderTestURL stringByAppendingString:@"?x=1&VER=8#frag"]);
  XCTAssertEqualObjects(WCURLStringAddingQueryParameter(emptyQueryAndFragment, @"VER", @"8"),
                        [kUriBuilderTestURL stringByAppendingString:@"?VER=8#frag"]);
}

- (void)testAddQueryParameterTwiceKeepsFragmentLast {
  NSURLComponents *components =
      [NSURLComponents componentsWithString:[kUriBuilderTestURL stringByAppendingString:@"#frag"]];
  WCAddQueryParameter(components, @"VER", @"8");
  WCAddQueryParameter(components, @"RID", @"1");
  XCTAssertEqualObjects(components.URL.absoluteString,
                        [kUriBuilderTestURL stringByAppendingString:@"?VER=8&RID=1#frag"]);
}

@end
