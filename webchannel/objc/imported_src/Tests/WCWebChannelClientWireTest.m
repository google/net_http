#import "WCDefaultJSONDecoder.h"
#import "WCDefaultURLEncoder.h"
#import "WCHTTPRequest.h"
#import "WCInternalChannelParams.h"
#import "WCOptions.h"
#import "WCSupport.h"
#import "WCTimer.h"
#import "WCWebChannelClient.h"
#import "WCWebChannelClientInternal.h"

#import <XCTest/XCTest.h>

static NSString *const kBaseURL = @"https://example.com/channel";
static NSString *const kHandshakeResponse = @"[[0,[\"c\",\"S\",\"\",8]]]";
static NSString *const kFormContentType = @"Content-Type: application/x-www-form-urlencoded";
static NSString *const kMixedValue = @"a&b=c d,\u00e9+%/~!*()'";
static NSString *const kMixedSessionID = @"a+b/c=d,e:f;g@h$i?j'k!(*)~";
static NSString *const kEncodedMixedSessionID = @"a%2Bb%2Fc%3Dd%2Ce%3Af%3Bg%40h%24i%3Fj%27k!(*)~";

static NSString *WCRawQueryValue(NSString *URLString, NSString *name) {
  NSString *query = [NSURLComponents componentsWithString:URLString].percentEncodedQuery;
  for (NSString *pair in [query componentsSeparatedByString:@"&"]) {
    NSRange separator = [pair rangeOfString:@"="];
    if (separator.location != NSNotFound &&
        [[pair substringToIndex:separator.location] isEqualToString:name]) {
      return [pair substringFromIndex:NSMaxRange(separator)];
    }
  }
  return nil;
}

/** Returns @c payload as one chunk of a response. */
static NSString *WCChunk(NSString *payload) {
  return [NSString stringWithFormat:@"%lu\n%@", (unsigned long)payload.length, payload];
}

/** Returns @c payload as one chunk of a response, sized in bytes like C++ @c Chunk(). */
static NSData *WCChunkData(NSData *payload) {
  NSMutableData *chunk = [[[NSString stringWithFormat:@"%lu\n", (unsigned long)payload.length]
      dataUsingEncoding:NSUTF8StringEncoding] mutableCopy];
  [chunk appendData:payload];
  return chunk;
}

/** Returns a handshake response that opens the session @c sessionID. */
static NSString *WCHandshakeResponse(NSString *sessionID) {
  NSData *data = [NSJSONSerialization dataWithJSONObject:@[ @[ @0, @[ @"c", sessionID, @"", @8 ] ] ]
                                                 options:0
                                                   error:nil];
  return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
}

/** A timer that runs only when the test fires it. */
@interface WCRecordedTimer : NSObject <WCTimer>
@property(nonatomic, readonly) NSTimeInterval timeout;
@property(nonatomic, readonly, getter=isPending) BOOL pending;
- (instancetype)initWithTimeout:(NSTimeInterval)timeout
                          block:(void (^)())block
                        context:(WCFailureRecoveryContext *)context;
- (void)fire;
@end

@implementation WCRecordedTimer {
  void (^_block)();
  BOOL _fired;
  BOOL _cleared;
}

@synthesize context = _context;

- (instancetype)initWithTimeout:(NSTimeInterval)timeout
                          block:(void (^)())block
                        context:(WCFailureRecoveryContext *)context {
  self = [super init];
  if (self) {
    _timeout = timeout;
    _block = [block copy];
    _context = context;
  }
  return self;
}

- (BOOL)isPending {
  return !_fired && !_cleared;
}

- (void)cancel {
  _cleared = YES;
  _block = nil;
}

- (void)fire {
  _fired = YES;
  void (^block)() = _block;
  _block = nil;
  if (block) {
    block();
  }
}

@end

/** Records each request as @[ method, URL, headers sorted by name, body ] and lets the test
 * complete it. */
@interface WCRecordingHTTPRequest : NSObject <WCHTTPRequest>
@property(nonatomic, readonly) NSInteger sentIndex;
@property(nonatomic, readonly, getter=isAborted) BOOL aborted;
- (instancetype)initWithHandler:(id<WCRequestStateChangedHandler>)handler
                           sent:(NSMutableArray<NSArray<NSString *> *> *)sent;
- (void)respondWithStatus:(int)status
                     text:(NSString *)text
                  headers:(NSDictionary<NSString *, NSString *> *)headers;
- (void)respondWithStatus:(int)status
                     data:(NSData *)data
                  headers:(NSDictionary<NSString *, NSString *> *)headers;
/** Delivers @c data as the next part of the response, and leaves the request open. */
- (void)deliverWithStatus:(int)status
                     data:(NSData *)data
                  headers:(NSDictionary<NSString *, NSString *> *)headers;
@end

@implementation WCRecordingHTTPRequest {
  NSMutableArray<NSArray<NSString *> *> *_sent;
  int _status;
  NSDictionary<NSString *, NSString *> *_responseHeaders;
}

@synthesize requestReadyStateChangeHandler = _requestReadyStateChangeHandler;
@synthesize requestReadyState = _requestReadyState;
@synthesize requestErrorCode = _requestErrorCode;

- (instancetype)initWithHandler:(id<WCRequestStateChangedHandler>)handler
                           sent:(NSMutableArray<NSArray<NSString *> *> *)sent {
  self = [super init];
  if (self) {
    _requestReadyStateChangeHandler = handler;
    _sent = sent;
    _sentIndex = -1;
  }
  return self;
}

- (NSString *)responseHeaderForName:(NSString *)name {
  return _responseHeaders[name];
}

- (NSDictionary<NSString *, NSString *> *)allResponseHeaders {
  return _responseHeaders ?: @{};
}

- (int)status {
  return _status;
}

- (void)sendPOST:(NSURL *)URL
        withData:(NSData *)postData
     withHeaders:(NSDictionary<NSString *, NSString *> *)headers
         timeout:(NSTimeInterval)timeout {
  [self recordMethod:@"POST" URL:URL headers:headers body:postData];
}

- (void)sendGET:(NSURL *)URL
    withHeaders:(NSDictionary<NSString *, NSString *> *)headers
        timeout:(NSTimeInterval)timeout {
  [self recordMethod:@"GET" URL:URL headers:headers body:nil];
}

- (void)abort {
  _aborted = YES;
}

- (void)respondWithStatus:(int)status
                     text:(NSString *)text
                  headers:(NSDictionary<NSString *, NSString *> *)headers {
  [self respondWithStatus:status
                     data:[text dataUsingEncoding:NSUTF8StringEncoding]
                  headers:headers];
}

- (void)respondWithStatus:(int)status
                     data:(NSData *)data
                  headers:(NSDictionary<NSString *, NSString *> *)headers {
  _status = status;
  _responseHeaders = [headers copy];
  _requestReadyState = WCRequestReadyStateComplete;
  [_requestReadyStateChangeHandler stateChangedForRequest:self responseData:data];
}

- (void)deliverWithStatus:(int)status
                     data:(NSData *)data
                  headers:(NSDictionary<NSString *, NSString *> *)headers {
  _status = status;
  _responseHeaders = [headers copy];
  _requestReadyState = WCRequestReadyStateInteractive;
  [_requestReadyStateChangeHandler stateChangedForRequest:self responseData:data];
}

- (void)recordMethod:(NSString *)method
                 URL:(NSURL *)URL
             headers:(NSDictionary<NSString *, NSString *> *)headers
                body:(NSData *)body {
  NSArray<NSString *> *names = [headers.allKeys
      sortedArrayUsingComparator:^NSComparisonResult(NSString *lhs, NSString *rhs) {
        return [lhs compare:rhs options:NSLiteralSearch];
      }];
  NSMutableArray<NSString *> *headerLines = [NSMutableArray array];
  for (NSString *name in names) {
    [headerLines addObject:[NSString stringWithFormat:@"%@: %@", name, headers[name]]];
  }
  NSString *bodyString = [[NSString alloc] initWithData:body ?: [NSData data]
                                               encoding:NSUTF8StringEncoding];
  _sentIndex = (NSInteger)_sent.count;
  [_sent addObject:@[
    method, URL.absoluteString ?: @"", [headerLines componentsJoinedByString:@" | "],
    bodyString ?: @""
  ]];
}

@end

/**
 * Builds URLs with the production encoders, and records requests, timers, and stats. Like C++
 * @c RecordingSupport, it does not own the requests: a request is open only while its owner keeps
 * it.
 */
@interface WCRecordingSupport : NSObject <WCSupport>
@property(nonatomic, readonly) NSMutableArray<NSArray<NSString *> *> *sent;
@property(nonatomic, readonly) NSHashTable<WCRecordingHTTPRequest *> *requests;
@property(nonatomic, readonly) NSMutableArray<WCRecordedTimer *> *timers;
/** The reported stats, as WCRequestStat values. */
@property(nonatomic, readonly) NSMutableArray<NSNumber *> *stats;
@end

@implementation WCRecordingSupport

@synthesize URLEncoder = _URLEncoder;
@synthesize logger = _logger;
@synthesize JSONDecoder = _JSONDecoder;
@synthesize dispatchQueue = _dispatchQueue;

- (instancetype)init {
  self = [super init];
  if (self) {
    _URLEncoder = [[WCDefaultURLEncoder alloc] init];
    _JSONDecoder = [[WCDefaultJSONDecoder alloc] init];
    _dispatchQueue = dispatch_get_main_queue();
    _sent = [NSMutableArray array];
    _requests = [NSHashTable weakObjectsHashTable];
    _timers = [NSMutableArray array];
    _stats = [NSMutableArray array];
  }
  return self;
}

- (id<WCHTTPRequest>)HTTPRequest:(id<WCRequestStateChangedHandler>)handler {
  WCRecordingHTTPRequest *request = [[WCRecordingHTTPRequest alloc] initWithHandler:handler
                                                                               sent:_sent];
  [_requests addObject:request];
  return request;
}

- (void)notifyStatEvent:(WCRequestStat)event {
  [_stats addObject:@(event)];
}

- (void)notifyServerReachabilityEvent:(WCServerReachability)event {
}

- (void)notifyTimingEventWithSize:(int)size withRTT:(NSTimeInterval)RTT withRetries:(int)retries {
}

- (void)notifyHandshakeTimingEventWithRtt:(NSTimeInterval)rtt {
}

- (void)notifyHandshakeResponseHeaders:(NSDictionary<NSString *, NSString *> *)headers {
}

- (id<WCTimer>)setTimeout:(NSTimeInterval)timeout block:(void (^)())block {
  return [self recordTimerWithTimeout:timeout block:block context:nil];
}

- (id<WCTimer>)setTimeout:(NSTimeInterval)timeout
                    block:(void (^)())block
                  context:(nonnull WCFailureRecoveryContext *)context {
  return [self recordTimerWithTimeout:timeout block:block context:context];
}

- (void)clearTimeout:(id<WCTimer>)timer {
  [timer cancel];
}

- (WCRecordedTimer *)recordTimerWithTimeout:(NSTimeInterval)timeout
                                      block:(void (^)())block
                                    context:(WCFailureRecoveryContext *)context {
  WCRecordedTimer *timer = [[WCRecordedTimer alloc] initWithTimeout:timeout
                                                              block:block
                                                            context:context];
  [_timers addObject:timer];
  return timer;
}

@end

/** Records what the channel reports to its delegate. */
@interface WCRecordingDelegate : NSObject <WCWebChannelClientHandlerDelegate>
@property(nonatomic, readonly) BOOL closed;
@property(nonatomic, readonly) NSMutableArray<NSNumber *> *errors;
/** The messages delivered, in JSON. */
@property(nonatomic, readonly) NSMutableArray<NSString *> *messages;
@end

@implementation WCRecordingDelegate

- (instancetype)init {
  self = [super init];
  if (self) {
    _errors = [NSMutableArray array];
    _messages = [NSMutableArray array];
  }
  return self;
}

- (void)webChannelOpened:(id<WCWebChannelClientProtocol>)client {
}

- (void)webChannelClosed:(id<WCWebChannelClientProtocol>)client {
  _closed = YES;
}

- (void)webChannel:(id<WCWebChannelClientProtocol>)client didReceiveMessage:(id)message {
  NSData *data = [NSJSONSerialization dataWithJSONObject:message
                                                 options:NSJSONWritingFragmentsAllowed
                                                   error:nil];
  [_messages addObject:[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]];
}

- (void)webChannel:(id<WCWebChannelClientProtocol>)client
    encounteredError:(WCWebChannelClientError)error {
  [_errors addObject:@(error)];
}

- (void)webChannel:(id<WCWebChannelClientProtocol>)client
    didReceiveHeaders:(NSDictionary<NSString *, NSString *> *)headers
           statusCode:(int)statusCode {
}

- (void)webChannel:(id<WCWebChannelClientProtocol>)client
    didReceiveMetadata:(id)metadata
                   key:(NSString *)key {
}

@end

@interface WCWebChannelClientInternal ()
- (void)sendMap:(NSDictionary<NSString *, NSString *> *)map context:(NSObject *)context;
@end

/**
 * Checks the exact requests sent. Tests with C++ names port the C++ client's
 * webchannel_base_wire_test.cc and other C++ tests; other
 * expected values come from running the C++ WebChannelBase with the same options, calls, and
 * responses. Random request IDs are read back from the handshake.
 */
@interface WCWebChannelClientWireTest : XCTestCase
@end

@implementation WCWebChannelClientWireTest {
  WCRecordingSupport *_support;
  WCRecordingDelegate *_delegate;
  WCOptions *_options;
  WCWebChannelClientInternal *_channel;
}

- (void)setUp {
  [super setUp];
  self.continueAfterFailure = NO;
  _support = [[WCRecordingSupport alloc] init];
  _delegate = [[WCRecordingDelegate alloc] init];
  _options = [[WCOptions alloc] init];
}

- (void)tearDown {
  [self releaseRequests];
  _channel = nil;
  _options = nil;
  _delegate = nil;
  _support = nil;
  [super tearDown];
}

- (void)testPlainFlow {
  [self createChannel];
  [_channel send:kMixedValue];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0 status:200 text:WCChunk(WCHandshakeResponse(kMixedSessionID))];
  [self runZeroDelayTimers];
  [_channel send:@"x"];
  [self runZeroDelayTimers];
  [_channel close];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  int RID = [self handshakeRID];
  XCTAssertEqualObjects(
      sent[0], (@[
        @"POST", [NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&t=1", kBaseURL, RID],
        kFormContentType, @"count=1&ofs=0&req0___data__=a%26b%3Dc%20d%2C%C3%A9%2B%25%2F~!*()%27"
      ]));
  XCTAssertEqualObjects(
      sent[1], (@[
        @"GET",
        [NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=%@&CI=0&AID=0&TYPE=xmlhttp&t=1", kBaseURL,
                                   kEncodedMixedSessionID],
        @"", @""
      ]));
  XCTAssertEqualObjects(sent[2], (@[
                          @"POST",
                          [NSString stringWithFormat:@"%@?VER=8&SID=%@&RID=%d&AID=0&t=1", kBaseURL,
                                                     kEncodedMixedSessionID, RID + 1],
                          kFormContentType, @"count=1&ofs=1&req0___data__=x"
                        ]));
  XCTAssertEqualObjects(sent[3], (@[
                          @"GET",
                          [NSString stringWithFormat:@"%@?VER=8&SID=%@&RID=%d&TYPE=terminate",
                                                     kBaseURL, kEncodedMixedSessionID, RID + 2],
                          @"", @""
                        ]));
}

- (void)testFastHandshakeReq {
  _options.fastHandshake = YES;
  [self createChannel];
  [_channel send:kMixedValue];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0], (@[
        @"GET",
        [NSString
            stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&%@&SID=null&t=1", kBaseURL,
                             [self handshakeRID],
                             @"%24req=count%3D1%26ofs%3D0%26req0___data__%3Da%2526b%253Dc%2520d"
                             @"%252C%25C3%25A9%252B%2525%252F~!*()%2527"],
        @"", @""
      ]));
}

- (void)testFastHandshakeReqWithoutMessages {
  _options.fastHandshake = YES;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][1], ([NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&%@&SID=null&t=1", kBaseURL,
                                              [self handshakeRID], @"%24req=count%3D0"]));
}

- (void)testHTTPSessionID {
  _options.HTTPSessionIDParam = @"gsessionid";
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0
                  status:200
                    text:WCChunk(WCHandshakeResponse(@"SID1"))
                 headers:@{kWCXHTTPSessionID : @"a+b/c=d"}];
  [self runZeroDelayTimers];
  [_channel send:@"x"];
  [self runZeroDelayTimers];
  [_channel close];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  int RID = [self handshakeRID];
  XCTAssertEqualObjects(
      sent[0], (@[
        @"POST",
        [NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&X-HTTP-Session-Id=gsessionid&t=1",
                                   kBaseURL, RID],
        kFormContentType, @"count=0"
      ]));
  XCTAssertEqualObjects(
      sent[1], (@[
        @"GET",
        [NSString
            stringWithFormat:@"%@?gsessionid=%@&VER=8&RID=rpc&SID=SID1&CI=0&AID=0&TYPE=xmlhttp&t=1",
                             kBaseURL, @"a%2Bb%2Fc%3Dd"],
        @"", @""
      ]));
  XCTAssertEqualObjects(
      sent[2], (@[
        @"POST",
        [NSString stringWithFormat:@"%@?VER=8&gsessionid=%@&SID=SID1&RID=%d&AID=0&t=1", kBaseURL,
                                   @"a%2Bb%2Fc%3Dd", RID + 1],
        kFormContentType, @"count=1&ofs=0&req0___data__=x"
      ]));
  XCTAssertEqualObjects(
      sent[3], (@[
        @"GET",
        [NSString stringWithFormat:@"%@?VER=8&gsessionid=%@&SID=SID1&RID=%d&TYPE=terminate",
                                   kBaseURL, @"a%2Bb%2Fc%3Dd", RID + 2],
        @"", @""
      ]));
}

- (void)testMessageURLParam {
  [self assertHandshakeWithMessageURLParams:@{@"x" : @"a,b&c=d+e f\u00e9"}
                                 sendsParam:@"x=a%2Cb%26c%3Dd%2Be%20f%C3%A9"];
}

- (void)testMessageURLParamNameWithComma {
  [self assertHandshakeWithMessageURLParams:@{@"k,1" : @"a,b"} sendsParam:@"k%2C1=a%2Cb"];
}

- (void)testSendsEachExtraParamOnce {
  [self runPlainFlowWithExtraParams:@{@"x" : @"1"}];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  int RID = [self handshakeRID];
  XCTAssertEqualObjects(sent[0][0], @"POST");
  XCTAssertEqualObjects(
      sent[0][1], ([NSString stringWithFormat:@"%@?VER=8&x=1&RID=%d&CVER=1&t=1", kBaseURL, RID]));
  XCTAssertEqualObjects(sent[0][3], @"count=1&ofs=0&req0___data__=m");
  XCTAssertEqualObjects(sent[1][0], @"GET");
  XCTAssertEqualObjects(
      sent[1][1],
      ([NSString
          stringWithFormat:@"%@?VER=8&x=1&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1", kBaseURL]));
  XCTAssertEqualObjects(sent[2][0], @"POST");
  XCTAssertEqualObjects(
      sent[2][1],
      ([NSString stringWithFormat:@"%@?VER=8&x=1&SID=S&RID=%d&AID=0&t=1", kBaseURL, RID + 1]));
  XCTAssertEqualObjects(sent[2][3], @"count=1&ofs=1&req0___data__=n");
  XCTAssertEqualObjects(sent[3][0], @"GET");
  XCTAssertEqualObjects(
      sent[3][1],
      ([NSString stringWithFormat:@"%@?VER=8&x=1&SID=S&RID=%d&TYPE=terminate", kBaseURL, RID + 2]));
}

- (void)testExtraParamReplacesLibraryParam {
  [self runPlainFlowWithExtraParams:@{@"VER" : @"9"}];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  int RID = [self handshakeRID];
  XCTAssertEqualObjects(sent[0][1],
                        ([NSString stringWithFormat:@"%@?VER=9&RID=%d&CVER=1&t=1", kBaseURL, RID]));
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=9&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
  XCTAssertEqualObjects(sent[2][1], ([NSString stringWithFormat:@"%@?VER=9&SID=S&RID=%d&AID=0&t=1",
                                                                kBaseURL, RID + 1]));
  XCTAssertEqualObjects(
      sent[3][1],
      ([NSString stringWithFormat:@"%@?VER=9&SID=S&RID=%d&TYPE=terminate", kBaseURL, RID + 2]));
}

- (void)testExtraParamReplacesPerRequestParam {
  [self runPlainFlowWithExtraParams:@{@"RID" : @"z"}];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  XCTAssertEqualObjects(sent[0][1],
                        ([NSString stringWithFormat:@"%@?VER=8&RID=z&CVER=1&t=1", kBaseURL]));
  XCTAssertEqualObjects(sent[0][3], @"count=1&ofs=0&req0___data__=m");
  XCTAssertEqualObjects(
      sent[1][1],
      ([NSString stringWithFormat:@"%@?VER=8&RID=z&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1", kBaseURL]));
  XCTAssertEqualObjects(sent[2][1],
                        ([NSString stringWithFormat:@"%@?VER=8&RID=z&SID=S&AID=0&t=1", kBaseURL]));
  XCTAssertEqualObjects(sent[2][3], @"count=1&ofs=1&req0___data__=n");
  XCTAssertEqualObjects(
      sent[3][1], ([NSString stringWithFormat:@"%@?VER=8&RID=z&SID=S&TYPE=terminate", kBaseURL]));
}

- (void)testSendsExtraParamsInKeyOrder {
  _options.messageURLParams = @{@"e" : @"5", @"b" : @"2", @"d" : @"4", @"a" : @"1", @"c" : @"3"};
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][1], ([NSString stringWithFormat:@"%@?VER=8&a=1&b=2&c=3&d=4&e=5&RID=%d&CVER=1&t=1",
                                              kBaseURL, [self handshakeRID]]));
}

- (void)testSendsExtraParamsInUTF8ByteOrder {
  // A dictionary literal with these keys fails some lookups, so build the dictionary at run time.
  NSMutableDictionary<NSString *, NSString *> *params = [NSMutableDictionary dictionary];
  params[@"\U0001F600"] = @"6";
  params[@"a"] = @"2";
  params[@"\u00E9"] = @"4";
  params[@"\uFF01"] = @"5";
  params[@"f"] = @"3";
  params[@"B"] = @"1";
  _options.messageURLParams = params;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][1],
      ([NSString stringWithFormat:@"%@?VER=8&B=1&a=2&f=3&%@=4&%@=5&%@=6&RID=%d&CVER=1&t=1",
                                  kBaseURL, @"%C3%A9", @"%EF%BC%81", @"%F0%9F%98%80",
                                  [self handshakeRID]]));
}

- (void)testFastHandshakeSendsParamsInJsAndJavaOrder {
  _options.fastHandshake = YES;
  _options.HTTPSessionIDParam = @"gsessionid";
  _options.messageURLParams = @{@"x" : @"1"};
  [self createChannel];
  [_channel send:@"m"];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(sent[0][0], @"GET");
  XCTAssertEqualObjects(
      sent[0][1],
      ([NSString stringWithFormat:
                     @"%@?VER=8&x=1&RID=%d&CVER=1&X-HTTP-Session-Id=gsessionid&%@&SID=null&t=1",
                     kBaseURL, [self handshakeRID],
                     @"%24req=count%3D1%26ofs%3D0%26req0___data__%3Dm"]));
  XCTAssertEqualObjects(sent[0][3], @"");
}

- (void)testFastHandshake2SendsSidOnceAfterReq {
  _options.fastHandshake2 = YES;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  NSString *SID = WCRawQueryValue(sent[0][1], @"SID");
  XCTAssertTrue([SID hasPrefix:@"c-"]);
  XCTAssertEqualObjects(
      sent[0][1], ([NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&%@&SID=%@&t=1", kBaseURL,
                                              [self handshakeRID], @"%24req=count%3D0", SID]));
}

- (void)testFastHandshakeCountsEmptyMessageAsZeroChars {
  _options.fastHandshake = YES;
  [self createChannel];
  [_channel send:@""];
  [_channel send:@"x"];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][1], ([NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&%@&SID=null&t=1", kBaseURL,
                                              [self handshakeRID],
                                              @"%24req=count%3D2%26ofs%3D0%26req0___data__%3D"
                                              @"%26req1___data__%3Dx"]));
}

- (void)testFastHandshakeKeepsCharLimitAfterEmptyMessage {
  _options.fastHandshake = YES;
  [self createChannel];
  [_channel send:@""];
  [_channel send:[@"" stringByPaddingToLength:4097 withString:@"y" startingAtIndex:0]];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][1], ([NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&%@&SID=null&t=1", kBaseURL,
                                              [self handshakeRID],
                                              @"%24req=count%3D1%26ofs%3D0%26req0___data__%3D"]));
}

- (void)testFastHandshakeStopsCountingAtUnknownSize {
  _options.fastHandshake = YES;
  [self createChannel];
  [_channel sendMap:@{@"k" : @"v"} context:nil];
  [_channel send:@"x"];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][1], ([NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&%@&SID=null&t=1", kBaseURL,
                                              [self handshakeRID],
                                              @"%24req=count%3D2%26ofs%3D0%26req0_k%3Dv"
                                              @"%26req1___data__%3Dx"]));
}

/**
 * An empty X-HTTP-Initial-Response fails the handshake, as a missing one does, even if the body has
 * the handshake array.
 */
- (void)testFastHandshakeFailsOnEmptyInitialResponse {
  _options.fastHandshake = YES;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0
                  status:200
                    text:WCChunk(kHandshakeResponse)
                 headers:@{kWCXHTTPInitialResponse : @""}];
  [self runZeroDelayTimers];

  XCTAssertEqual(_support.sent.count, 1u);
  XCTAssertEqualObjects(_delegate.errors, @[ @(WCWebChannelClientErrorUnknownSessionID) ]);
}

- (void)testForwardRequestSendsAttemptNumber {
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  // A network error is retried, and the first retry has no delay.
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];
  [self respondToRequest:3 status:200 text:WCChunk(@"[1,0,0]")];
  [self runZeroDelayTimers];
  [_channel send:@"o"];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 5u);
  int RID = [self handshakeRID];
  XCTAssertEqualObjects(sent[2][1], ([NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&AID=0&t=1",
                                                                kBaseURL, RID + 1]));
  XCTAssertEqualObjects(sent[2][3], @"count=1&ofs=0&req0___data__=n");
  XCTAssertEqualObjects(sent[3][1], ([NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&AID=0&t=2",
                                                                kBaseURL, RID + 1]));
  XCTAssertEqualObjects(sent[3][3], @"count=1&ofs=0&req0___data__=n");
  XCTAssertEqualObjects(sent[4][1], ([NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&AID=0&t=1",
                                                                kBaseURL, RID + 2]));
  XCTAssertEqualObjects(sent[4][3], @"count=1&ofs=1&req0___data__=o");
}

- (void)testBackChannelSendsAttemptNumber {
  [self openChannel];
  [self respondToRequest:1 status:0 text:@""];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:200 text:WCChunk(@"[[1,[\"noop\"]]]")];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
  XCTAssertEqualObjects(
      sent[2][1], ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=2",
                                              kBaseURL]));
  XCTAssertEqualObjects(
      sent[3][1], ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=1&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
}

/** Array IDs are 64-bit: 4294967297 is 2^32 + 1. */
- (void)testBackChannelSendsArrayIdBeyondInt32 {
  [self openChannel];
  [self respondToRequest:1 status:200 text:WCChunk(@"[[4294967297,[\"a\"]]]")];
  [self runZeroDelayTimers];
  [_channel send:@"n"];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  XCTAssertEqualObjects(
      sent[2][1],
      ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=4294967297&TYPE=xmlhttp&t=1",
                                  kBaseURL]));
  XCTAssertEqualObjects(
      sent[3][1], ([NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&AID=4294967297&t=1", kBaseURL,
                                              [self handshakeRID] + 1]));
}

- (void)testSendsHttpSessionIdFromHandshakeResponse {
  _options.HTTPSessionIDParam = @"gsessionid";
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0
                  status:200
                    text:WCChunk(kHandshakeResponse)
                 headers:@{kWCXHTTPSessionID : @"abc"}];
  [self runZeroDelayTimers];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [_channel close];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  int RID = [self handshakeRID];
  XCTAssertEqualObjects(
      sent[0][1],
      ([NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&X-HTTP-Session-Id=gsessionid&t=1",
                                  kBaseURL, RID]));
  XCTAssertEqualObjects(
      sent[1][1],
      ([NSString
          stringWithFormat:@"%@?gsessionid=abc&VER=8&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1",
                           kBaseURL]));
  XCTAssertEqualObjects(
      sent[2][1], ([NSString stringWithFormat:@"%@?VER=8&gsessionid=abc&SID=S&RID=%d&AID=0&t=1",
                                              kBaseURL, RID + 1]));
  XCTAssertEqualObjects(
      sent[3][1],
      ([NSString stringWithFormat:@"%@?VER=8&gsessionid=abc&SID=S&RID=%d&TYPE=terminate", kBaseURL,
                                  RID + 2]));
}

- (void)testIgnoresEmptyHttpSessionId {
  _options.HTTPSessionIDParam = @"gsessionid";
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0
                  status:200
                    text:WCChunk(kHandshakeResponse)
                 headers:@{kWCXHTTPSessionID : @""}];
  [self runZeroDelayTimers];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [_channel close];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  int RID = [self handshakeRID];
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
  XCTAssertEqualObjects(sent[2][1], ([NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&AID=0&t=1",
                                                                kBaseURL, RID + 1]));
  XCTAssertEqualObjects(
      sent[3][1],
      ([NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&TYPE=terminate", kBaseURL, RID + 2]));
}

- (void)testInitHeaderOverridesMessageHeaderInHandshake {
  _options.messageHeaders = @{@"X-A" : @"message", @"X-B" : @"message"};
  _options.initialMessageHeaders = @{@"X-A" : @"init", @"X-C" : @"init"};
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0 status:200 text:WCChunk(kHandshakeResponse)];
  [self runZeroDelayTimers];
  [_channel send:@"n"];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 3u);
  XCTAssertEqualObjects(
      sent[0][2],
      ([NSString stringWithFormat:@"%@ | X-A: init | X-B: message | X-C: init", kFormContentType]));
  XCTAssertEqualObjects(sent[1][2], @"X-A: message | X-B: message");
  XCTAssertEqualObjects(sent[2][2], ([NSString stringWithFormat:@"%@ | X-A: message | X-B: message",
                                                                kFormContentType]));
}

- (void)testBinaryFastHandshake2SendsCodecOutputForNoMessages {
  _options.fastHandshake2 = YES;
  _options.enableBinaryEncoding = YES;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  NSString *SID = WCRawQueryValue(sent[0][1], @"SID");
  XCTAssertTrue([SID hasPrefix:@"c-"]);
  XCTAssertEqualObjects(sent[0][0], @"GET");
  XCTAssertEqualObjects(
      sent[0][1],
      ([NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&%@&SID=%@&t=1", kBaseURL,
                                  [self handshakeRID], @"%24req=count%3D0%26%0D%0A", SID]));
  XCTAssertEqualObjects(sent[0][2], @"Accept: application/octet-stream");
}

/**
 * With binary encoding, the handshake and forward requests send binary bodies, and the back channel
 * and terminate requests send no headers.
 */
- (void)testBinaryPlainFlow {
  _options.enableBinaryEncoding = YES;
  [self runPlainFlowWithExtraParams:@{}];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  int RID = [self handshakeRID];
  XCTAssertEqualObjects(
      sent[0], (@[
        @"POST", [NSString stringWithFormat:@"%@?VER=8&RID=%d&CVER=1&t=1", kBaseURL, RID],
        @"Content-Type: application/octet-stream", @"count=1&ofs=0\r\nid=0&size=1\r\nm"
      ]));
  XCTAssertEqualObjects(
      sent[1], (@[
        @"GET",
        [NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1", kBaseURL],
        @"", @""
      ]));
  XCTAssertEqualObjects(
      sent[2], (@[
        @"POST", [NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&AID=0&t=1", kBaseURL, RID + 1],
        @"Content-Type: application/octet-stream", @"count=1&ofs=1\r\nid=0&size=1\r\nn"
      ]));
  XCTAssertEqualObjects(
      sent[3], (@[
        @"GET",
        [NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&TYPE=terminate", kBaseURL, RID + 2], @"",
        @""
      ]));
}

/**
 * The channel copies the payload; changing the caller's data after the send does not change the
 * request.
 */
- (void)testBinarySendCopiesPayload {
  _options.enableBinaryEncoding = YES;
  [self openChannel];
  NSMutableData *payload = [[@"ab" dataUsingEncoding:NSUTF8StringEncoding] mutableCopy];
  [_channel sendData:payload];
  [payload appendData:[@"c" dataUsingEncoding:NSUTF8StringEncoding]];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 3u);
  XCTAssertEqualObjects(sent[2][3], @"count=1&ofs=0\r\nid=0&size=2\r\nab");
}

- (void)testRetryDelayHasContinuousJitter {
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];
  [self respondToRequest:3 status:0 text:@""];

  // The second retry waits base + uniform(0, 1) * seed, with the default 5 s base and 10 s seed.
  // A whole number of seconds has probability ~0.
  WCRecordedTimer *retry = [self lastPendingTimer];
  XCTAssertNotNil(retry);
  XCTAssertGreaterThanOrEqual(retry.timeout, 5);
  XCTAssertLessThanOrEqual(retry.timeout, 15);
  XCTAssertNotEqual(fmod(retry.timeout, 1), 0);
}

- (void)testForwardRequestTimeoutHasContinuousJitter {
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];

  // The POST times out after T/2 + uniform(0, 1) * T/2, with the default T = 20 s. A whole number
  // of seconds has probability ~0.
  WCRecordedTimer *timeout = [self lastPendingTimer];
  XCTAssertNotNil(timeout);
  XCTAssertGreaterThanOrEqual(timeout.timeout, 10);
  XCTAssertLessThanOrEqual(timeout.timeout, 20);
  XCTAssertNotEqual(fmod(timeout.timeout, 1), 0);
}

- (void)testBackChannelTimeoutIsOneAndAHalfServerKeepalives {
  [self openChannelWithHandshakeResponse:@"[[0,[\"c\",\"S\",\"\",8,0,10001]]]"];

  XCTAssertEqual(_support.sent.count, 2u);
  WCRecordedTimer *timeout = [self lastPendingTimer];
  XCTAssertNotNil(timeout);
  XCTAssertEqual(timeout.timeout, 15.002);
}

- (void)testBackChannelTimeoutIsExactForLargeServerKeepalive {
  // 2^24 + 1 ms, the smallest keepalive that a float cannot hold.
  [self openChannelWithHandshakeResponse:@"[[0,[\"c\",\"S\",\"\",8,0,16777217]]]"];

  XCTAssertEqual(_support.sent.count, 2u);
  WCRecordedTimer *timeout = [self lastPendingTimer];
  XCTAssertNotNil(timeout);
  XCTAssertEqual(timeout.timeout, 25165.826);
}

/**
 * The fast handshake request continues as the back channel. Without a server keepalive, it keeps
 * the default 45 s request timeout.
 */
- (void)testUpgradedHandshakeKeepsDefaultTimeoutWithoutKeepalive {
  _options.fastHandshake = YES;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self deliverToRequest:0
                  status:200
                    text:WCChunk(@"[[1,[\"noop\"]]]")
                 headers:@{kWCXHTTPInitialResponse : kHandshakeResponse}];
  [self runZeroDelayTimers];

  XCTAssertEqual(_support.sent.count, 1u);
  WCRecordedTimer *timeout = [self lastPendingTimer];
  XCTAssertNotNil(timeout);
  XCTAssertEqual(timeout.timeout, 45);
}

/**
 * With a server keepalive, the upgraded request times out after 1.5 times the keepalive, in ms,
 * like a back channel request.
 */
- (void)testUpgradedHandshakeUsesServerKeepaliveTimeout {
  _options.fastHandshake = YES;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self deliverToRequest:0
                  status:200
                    text:WCChunk(@"[[1,[\"noop\"]]]")
                 headers:@{kWCXHTTPInitialResponse : @"[[0,[\"c\",\"S\",\"\",8,0,10001]]]"}];
  [self runZeroDelayTimers];

  XCTAssertEqual(_support.sent.count, 1u);
  WCRecordedTimer *timeout = [self lastPendingTimer];
  XCTAssertNotNil(timeout);
  XCTAssertEqual(timeout.timeout, 15.002);
}

- (void)testUsesVersionsFromHandshakeResponse {
  [self openChannelWithHandshakeResponse:@"[[0,[\"c\",\"S\",\"\",9,13]]]"];

  XCTAssertEqual(_channel.serverVersion, 13);
  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 2u);
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=9&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
}

/**
 * A handshake field that is not a number keeps its default: VER 8, server version 0, and the 45 s
 * request timeout for the back channel.
 */
- (void)testIgnoresHandshakeFieldsThatAreStrings {
  [self openChannelWithHandshakeResponse:@"[[0,[\"c\",\"S\",\"\",\"9\",\"13\",\"10001\"]]]"];

  XCTAssertEqual(_channel.serverVersion, 0);
  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 2u);
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
  WCRecordedTimer *timeout = [self lastPendingTimer];
  XCTAssertNotNil(timeout);
  XCTAssertEqual(timeout.timeout, 45);
}

- (void)testIgnoresHandshakeFieldsThatAreBooleans {
  [self openChannelWithHandshakeResponse:@"[[0,[\"c\",\"S\",\"\",true,true,true]]]"];

  XCTAssertEqual(_channel.serverVersion, 0);
  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 2u);
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
  WCRecordedTimer *timeout = [self lastPendingTimer];
  XCTAssertNotNil(timeout);
  XCTAssertEqual(timeout.timeout, 45);
}

- (void)testIgnoresHandshakeFieldsThatAreNullOrContainers {
  [self openChannelWithHandshakeResponse:@"[[0,[\"c\",\"S\",\"\",null,[13],{\"ms\":10001}]]]"];

  XCTAssertEqual(_channel.serverVersion, 0);
  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 2u);
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=0&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
  WCRecordedTimer *timeout = [self lastPendingTimer];
  XCTAssertNotNil(timeout);
  XCTAssertEqual(timeout.timeout, 45);
}

- (void)testFailFastDoesNotRetryForwardRequest {
  WCInternalChannelParams *internalChannelParams = [[WCInternalChannelParams alloc] init];
  internalChannelParams.failFast = YES;
  _options.internalChannelParams = internalChannelParams;
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];

  XCTAssertEqual([self countPosts], 2u);
  XCTAssertEqualObjects(_delegate.errors, @[ @(WCWebChannelClientErrorRequestFailed) ]);
}

- (void)testRequestFailedSendsNetworkTest {
  WCInternalChannelParams *internalChannelParams = [[WCInternalChannelParams alloc] init];
  internalChannelParams.failFast = YES;
  _options.internalChannelParams = internalChannelParams;
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  XCTAssertEqualObjects(
      sent[3],
      (@[ @"GET", [NSString stringWithFormat:@"%@/test?MODE=network", kBaseURL], @"", @"" ]));
  // The network test gives up after 10 s.
  WCRecordedTimer *watchdog = [self lastPendingTimer];
  XCTAssertNotNil(watchdog);
  XCTAssertEqual(watchdog.timeout, 10);
}

- (void)testNetworkTestUsesNetworkTestUrl {
  WCInternalChannelParams *internalChannelParams = [[WCInternalChannelParams alloc] init];
  internalChannelParams.failFast = YES;
  _options.internalChannelParams = internalChannelParams;
  _options.networkTestURL = @"https://test.example.com/ping?a=1";
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 4u);
  XCTAssertEqualObjects(sent[3][0], @"GET");
  XCTAssertEqualObjects(sent[3][1], @"https://test.example.com/ping?a=1");
}

- (void)testSuccessfulNetworkTestReportsErrorOther {
  WCInternalChannelParams *internalChannelParams = [[WCInternalChannelParams alloc] init];
  internalChannelParams.failFast = YES;
  _options.internalChannelParams = internalChannelParams;
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];
  WCRecordedTimer *watchdog = [self lastPendingTimer];
  XCTAssertNotNil(watchdog);
  [_support.stats removeAllObjects];

  [self respondToRequest:3 status:204 text:@""];
  XCTAssertEqualObjects(_support.stats, @[ @(WCRequestStatErrorOther) ]);
  // The watchdog does not report a second result.
  [watchdog fire];
  XCTAssertEqualObjects(_support.stats, @[ @(WCRequestStatErrorOther) ]);
}

- (void)testNetworkTestTimeoutReportsErrorNetwork {
  WCInternalChannelParams *internalChannelParams = [[WCInternalChannelParams alloc] init];
  internalChannelParams.failFast = YES;
  _options.internalChannelParams = internalChannelParams;
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];
  WCRecordedTimer *watchdog = [self lastPendingTimer];
  XCTAssertNotNil(watchdog);
  [_support.stats removeAllObjects];

  [watchdog fire];
  XCTAssertEqualObjects(_support.stats, @[ @(WCRequestStatErrorNetwork) ]);
}

/**
 * The network test releases its request after the result: the request keeps its handler, so
 * keeping the request would leak both. C++ keeps the request until NetUtils is destroyed.
 */
- (void)testNetworkTestReleasesRequestAfterResult {
  WCInternalChannelParams *internalChannelParams = [[WCInternalChannelParams alloc] init];
  internalChannelParams.failFast = YES;
  _options.internalChannelParams = internalChannelParams;
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];
  __weak WCRecordingHTTPRequest *request;
  @autoreleasepool {
    request = [self openRequest:3];
  }

  [self respondToRequest:3 status:204 text:@""];
  XCTAssertNil(request);
}

- (void)testHandlesArraysAfterHandshakeInSameResponse {
  [self openChannelWithHandshakeResponse:@"[[0,[\"c\",\"S\",\"\",8]],[1,[\"a\"]],[2,[\"b\"]]]"];

  XCTAssertEqualObjects(_delegate.messages, (@[ @"[\"a\"]", @"[\"b\"]" ]));
  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 2u);
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=8&RID=rpc&SID=S&CI=0&AID=2&TYPE=xmlhttp&t=1",
                                              kBaseURL]));
}

- (void)testIgnoresArraysAfterStop {
  [self openChannel];
  [self respondToRequest:1 status:200 text:WCChunk(@"[[1,[\"stop\"]],[2,[\"x\"]]]")];
  [self runZeroDelayTimers];

  XCTAssertEqualObjects(_delegate.messages, @[]);
  XCTAssertEqualObjects(_delegate.errors, @[ @(WCWebChannelClientErrorStop) ]);
  XCTAssertTrue(_delegate.closed);
  XCTAssertEqual(_support.sent.count, 2u);
}

- (void)testIgnoresArraysAfterClose {
  [self openChannel];
  [self respondToRequest:1 status:200 text:WCChunk(@"[[1,[\"close\"]],[2,[\"x\"]]]")];
  [self runZeroDelayTimers];

  XCTAssertEqualObjects(_delegate.messages, @[]);
  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 3u);
  XCTAssertEqualObjects(
      sent[2][1], ([NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&TYPE=terminate", kBaseURL,
                                              [self handshakeRID] + 1]));
}

- (void)testDeliversEmptyArray {
  [self openChannel];
  [self respondToRequest:1 status:200 text:WCChunk(@"[[1,[]]]")];
  [self runZeroDelayTimers];

  XCTAssertEqualObjects(_delegate.messages, @[ @"[]" ]);
  XCTAssertEqualObjects(_delegate.errors, @[]);
}

/**
 * 0x80 is not a valid UTF-8 lead byte. It counts as one UTF-16 code unit, as on the server, so the
 * chunk ends where its size says, and fails to parse.
 */
- (void)testInvalidUtf8InTextChunkSignalsBadResponse {
  [self openChannel];
  const char invalidArray[] = "[[1,[\"\x80\"]]]";
  NSMutableData *response = [WCChunkData([NSData dataWithBytes:invalidArray
                                                        length:strlen(invalidArray)]) mutableCopy];
  [response appendData:WCChunkData([@"[[2,[\"b\"]]]" dataUsingEncoding:NSUTF8StringEncoding])];
  [self respondToRequest:1 status:200 data:response headers:@{}];
  [self runZeroDelayTimers];

  XCTAssertEqualObjects(_delegate.messages, @[]);
  XCTAssertEqualObjects(_delegate.errors, @[ @(WCWebChannelClientErrorBadResponse) ]);
  XCTAssertEqual(_support.sent.count, 2u);
}

/**
 * A non-200 status is handled at the first INTERACTIVE event with body bytes, before the request
 * completes. On the back channel, it fails the channel.
 */
- (void)testBadStatusIsHandledAtFirstInteractiveWithBody {
  [self openChannel];
  [self deliverToRequest:1 status:503 text:@"" headers:@{}];
  [self runZeroDelayTimers];
  XCTAssertEqual(_support.sent.count, 2u);
  XCTAssertEqualObjects(_delegate.errors, @[]);

  [self deliverToRequest:1 status:503 text:@"x" headers:@{}];
  [self runZeroDelayTimers];

  XCTAssertEqualObjects(_delegate.errors, @[ @(WCWebChannelClientErrorRequestFailed) ]);
  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 3u);
  XCTAssertEqualObjects(sent[2][1],
                        ([NSString stringWithFormat:@"%@/test?MODE=network", kBaseURL]));
}

- (void)testDisconnectCancelsPendingBackChannel {
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0 status:200 text:WCChunk(kHandshakeResponse)];
  [_channel close];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 2u);
  XCTAssertEqualObjects(
      sent[1][1], ([NSString stringWithFormat:@"%@?VER=8&SID=S&RID=%d&TYPE=terminate", kBaseURL,
                                              [self handshakeRID] + 1]));
}

/** Ports WebChannelHandshakeTest.FastHandshake2StartsBackChannelOnlyAfterHandshake. */
- (void)testFastHandshake2StartsBackChannelOnlyAfterHandshake {
  _options.fastHandshake2 = YES;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [_channel sendMap:@{@"k1" : @"v1"} context:nil];
  [self runZeroDelayTimers];
  [self respondToRequest:1 status:200 text:WCChunk(@"[0,0,7]")];
  [self runZeroDelayTimers];

  XCTAssertEqual(_channel.state, WCWebChannelClientStateOpening);
  XCTAssertEqual(_support.sent.count, 2u);

  [self respondToRequest:0
                  status:200
                    text:@""
                 headers:@{kWCXHTTPInitialResponse : kHandshakeResponse}];

  XCTAssertEqual(_channel.state, WCWebChannelClientStateOpened);
}

/** Ports WebChannelBaseTransportTest.OpenWithMessageContentType. */
- (void)testOpenWithMessageContentType {
  _options.messageContentType = @"application/protobuf+json";
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][2],
      ([NSString stringWithFormat:@"%@ | X-WebChannel-Content-Type: application/protobuf+json",
                                  kFormContentType]));
}

/** Ports WebChannelBaseTransportTest.OpenWithClientProfile. */
- (void)testOpenWithClientProfile {
  _options.clientProfile = @"test-profile";
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][2], ([NSString stringWithFormat:@"%@ | X-WebChannel-Client-Profile: test-profile",
                                              kFormContentType]));
}

/** Ports WebChannelBaseTransportTest.ContentTypeAndClientProfileOverrideInitHeaders. */
- (void)testContentTypeAndClientProfileOverrideInitHeaders {
  _options.initialMessageHeaders =
      @{kWCXWebChannelContentType : @"init-type", kWCXWebChannelClientProfile : @"init-profile"};
  _options.messageContentType = @"application/protobuf+json";
  _options.clientProfile = @"test-profile";
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][2],
      ([NSString stringWithFormat:@"%@ | X-WebChannel-Client-Profile: test-profile | "
                                  @"X-WebChannel-Content-Type: application/protobuf+json",
                                  kFormContentType]));
}

/**
 * Ports WebChannelBaseTransportTest.EmptyContentTypeAndClientProfileKeepInitHeaders. The C++ test
 * sets both options to empty strings. An Objective-C option is empty when it is @"" or nil, the
 * default, so this test uses one of each.
 */
- (void)testEmptyContentTypeAndClientProfileKeepInitHeaders {
  _options.initialMessageHeaders =
      @{kWCXWebChannelContentType : @"init-type", kWCXWebChannelClientProfile : @"init-profile"};
  _options.messageContentType = @"";
  _options.clientProfile = nil;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][2], ([NSString stringWithFormat:@"%@ | X-WebChannel-Client-Profile: init-profile | "
                                              @"X-WebChannel-Content-Type: init-type",
                                              kFormContentType]));
}

/** Ports WebChannelBaseTransportTest.ClientProtocolHeaderOverridesMessageHeader. */
- (void)testClientProtocolHeaderOverridesMessageHeader {
  _options.clientProtocolHeaderRequired = YES;
  _options.messageHeaders = @{kWCXClientProtocol : @"other"};
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(
      sent[0][2],
      ([NSString stringWithFormat:@"%@ | X-Client-Protocol: webchannel", kFormContentType]));
}

- (void)testForwardRequestTimeoutDoesNotDependOnRandSeed {
  XCTAssertNotEqual([self forwardRequestTimeoutAfterSeedingRand],
                    [self forwardRequestTimeoutAfterSeedingRand]);
}

- (void)testRetryDelayDoesNotDependOnRandSeed {
  XCTAssertNotEqual([self retryDelayAfterSeedingRand], [self retryDelayAfterSeedingRand]);
}

#pragma mark - Private

- (void)createChannel {
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:kBaseURL
                                                     options:_options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_delegate
                                                     support:_support];
}

/** Runs the dispatched blocks and the zero-delay timers, including the ones they set, in order. */
- (void)runZeroDelayTimers {
  while (YES) {
    [self runDispatchedBlocks];
    WCRecordedTimer *timer = nil;
    for (WCRecordedTimer *candidate in _support.timers) {
      if (candidate.pending && candidate.timeout == 0) {
        timer = candidate;
        break;
      }
    }
    if (timer == nil) {
      return;
    }
    [timer fire];
  }
}

/**
 * Runs the blocks dispatched to the main queue, in rounds that each end with a marker block. A
 * block dispatched by another runs in the next round. The channel sends a request or sets a timer
 * before it dispatches again, so the rounds stop at one that does neither.
 */
- (void)runDispatchedBlocks {
  NSUInteger progress;
  do {
    progress = _support.sent.count + _support.timers.count;
    __block BOOL markerRan = NO;
    dispatch_async(dispatch_get_main_queue(), ^{
      markerRan = YES;
    });
    NSDate *deadline = [NSDate dateWithTimeIntervalSinceNow:10];
    while (!markerRan && deadline.timeIntervalSinceNow > 0) {
      CFRunLoopRunInMode(kCFRunLoopDefaultMode, 1, true);
    }
    XCTAssertTrue(markerRan, @"The main queue did not run");
  } while (_support.sent.count + _support.timers.count != progress);
}

/**
 * Returns the open request that was sent @c index th, or nil. Uses an autorelease pool so that the
 * lookup does not keep other requests alive.
 */
- (WCRecordingHTTPRequest *)openRequest:(NSUInteger)index {
  WCRecordingHTTPRequest *request = nil;
  @autoreleasepool {
    for (WCRecordingHTTPRequest *candidate in _support.requests.allObjects) {
      if (candidate.sentIndex == (NSInteger)index && !candidate.aborted) {
        request = candidate;
        break;
      }
    }
  }
  return request;
}

/**
 * Completes the open request that was sent @c index th. Objects autoreleased meanwhile are released
 * before it returns, so that a request that no one keeps is no longer open.
 */
- (void)respondToRequest:(NSUInteger)index
                  status:(int)status
                    data:(NSData *)data
                 headers:(NSDictionary<NSString *, NSString *> *)headers {
  @autoreleasepool {
    WCRecordingHTTPRequest *request = [self openRequest:index];
    XCTAssertNotNil(request, @"Request %lu is not open", (unsigned long)index);
    [request respondWithStatus:status data:data headers:headers];
  }
}

- (void)respondToRequest:(NSUInteger)index
                  status:(int)status
                    text:(NSString *)text
                 headers:(NSDictionary<NSString *, NSString *> *)headers {
  [self respondToRequest:index
                  status:status
                    data:[text dataUsingEncoding:NSUTF8StringEncoding]
                 headers:headers];
}

- (void)respondToRequest:(NSUInteger)index status:(int)status text:(NSString *)text {
  [self respondToRequest:index status:status text:text headers:@{}];
}

/**
 * Delivers part of the response to the open request that was sent @c index th, and leaves it open.
 * Objects autoreleased meanwhile are released before it returns.
 */
- (void)deliverToRequest:(NSUInteger)index
                  status:(int)status
                    text:(NSString *)text
                 headers:(NSDictionary<NSString *, NSString *> *)headers {
  @autoreleasepool {
    WCRecordingHTTPRequest *request = [self openRequest:index];
    XCTAssertNotNil(request, @"Request %lu is not open", (unsigned long)index);
    [request deliverWithStatus:status
                          data:[text dataUsingEncoding:NSUTF8StringEncoding]
                       headers:headers];
  }
}

/**
 * Opens the channel and completes the plain handshake with @c handshakeResponse. Requests 0 and 1
 * are the handshake and the first back channel.
 */
- (void)openChannelWithHandshakeResponse:(NSString *)handshakeResponse {
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0 status:200 text:WCChunk(handshakeResponse)];
  [self runZeroDelayTimers];
}

- (void)openChannel {
  [self openChannelWithHandshakeResponse:kHandshakeResponse];
}

/** Sends @c m in the handshake, opens the channel, sends @c n, and closes the channel. */
- (void)runPlainFlowWithExtraParams:(NSDictionary<NSString *, NSString *> *)extraParams {
  _options.messageURLParams = extraParams;
  [self createChannel];
  [_channel send:@"m"];
  [_channel open];
  [self runZeroDelayTimers];
  [self respondToRequest:0 status:200 text:WCChunk(kHandshakeResponse)];
  [self runZeroDelayTimers];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [_channel close];
}

- (void)assertHandshakeWithMessageURLParams:(NSDictionary<NSString *, NSString *> *)params
                                 sendsParam:(NSString *)expectedParam {
  _options.messageURLParams = params;
  [self createChannel];
  [_channel open];
  [self runZeroDelayTimers];

  NSArray<NSArray<NSString *> *> *sent = _support.sent;
  XCTAssertEqual(sent.count, 1u);
  XCTAssertEqualObjects(sent[0], (@[
                          @"POST",
                          [NSString stringWithFormat:@"%@?VER=8&%@&RID=%d&CVER=1&t=1", kBaseURL,
                                                     expectedParam, [self handshakeRID]],
                          kFormContentType, @"count=0"
                        ]));
}

- (int)handshakeRID {
  int RID = WCRawQueryValue(_support.sent[0][1], @"RID").intValue;
  XCTAssertGreaterThanOrEqual(RID, 0);
  XCTAssertLessThan(RID, 100000);
  return RID;
}

- (NSUInteger)countPosts {
  NSUInteger count = 0;
  for (NSArray<NSString *> *request in _support.sent) {
    if ([request[0] isEqualToString:@"POST"]) {
      count++;
    }
  }
  return count;
}

/** Returns the most recently set timer that has neither fired nor been cleared. */
- (WCRecordedTimer *)lastPendingTimer {
  for (WCRecordedTimer *timer in _support.timers.reverseObjectEnumerator) {
    if (timer.pending) {
      return timer;
    }
  }
  return nil;
}

- (NSTimeInterval)forwardRequestTimeoutAfterSeedingRand {
  [self releaseRequests];
  _support = [[WCRecordingSupport alloc] init];
  [self openChannel];
  [_channel send:@"n"];
  srand(1);
  [self runZeroDelayTimers];
  return [self lastPendingTimer].timeout;
}

- (NSTimeInterval)retryDelayAfterSeedingRand {
  [self releaseRequests];
  _support = [[WCRecordingSupport alloc] init];
  [self openChannel];
  [_channel send:@"n"];
  [self runZeroDelayTimers];
  [self respondToRequest:2 status:0 text:@""];
  [self runZeroDelayTimers];
  srand(1);
  [self respondToRequest:3 status:0 text:@""];
  return [self lastPendingTimer].timeout;
}

/** Breaks the cycles between the requests and their handlers. */
- (void)releaseRequests {
  for (WCRecordingHTTPRequest *request in _support.requests.allObjects) {
    request.requestReadyStateChangeHandler = nil;
  }
}

@end
