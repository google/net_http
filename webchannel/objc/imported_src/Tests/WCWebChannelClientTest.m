#import "WCDefaultJSONDecoder.h"
#import "WCFakeHTTPRequest.h"
#import "WCHTTPRequest.h"
#import "WCJSONDecoder.h"
#import "WCChannelRequest.h"
#import "WCForwardChannelRequestPool.h"
#import "WCOptions.h"
#import "WCQueuedMap.h"
#import "WCSupport.h"
#import "WCTimer.h"
#import "WCWebChannelClient.h"
#import "WCWebChannelClientInternal.h"

#import <XCTest/XCTest.h>

#import <GTMSessionFetcher/GTMSessionFetcher.h>
#import <GTMSessionFetcher/GTMSessionFetcherService.h>
#import <OCMock/OCMock.h>

static const int kRealServerVersion = 8;
static const double kRunLoopDelay = 0.1;

@interface WCWebChannelClientInternal () <WCWebChannelInternalHTTPHandler>
- (void)startForwardChannelWithRetryRequest:(WCChannelRequest *)retryRequest;
@end

@interface WCWebChannelClientTest : XCTestCase
@end

@implementation WCWebChannelClientTest {
  WCWebChannelClientInternal *_channel;
  id<WCSupport> _mockSupport;
  id<WCWebChannelClientHandlerDelegate> _mockDelegate;
  GTMSessionFetcherService *_fetcherService;
  WCFakeHTTPRequest *_fakeRequest;
}

- (void)setUp {
  [super setUp];
  _mockSupport = OCMProtocolMock(@protocol(WCSupport));
  _mockDelegate = OCMProtocolMock(@protocol(WCWebChannelClientHandlerDelegate));
  _fetcherService = [GTMSessionFetcherService mockFetcherServiceWithFakedData:[NSData data]
                                                                   fakedError:nil];
  _fakeRequest = [[WCFakeHTTPRequest alloc] init];
  id<WCJSONDecoder> _decoder = [[WCDefaultJSONDecoder alloc] init];
  OCMStub(_mockSupport.JSONDecoder).andReturn(_decoder);
  OCMStub([_mockSupport HTTPRequest:OCMOCK_ANY]).andReturn(_fakeRequest);
  OCMStub(_mockSupport.dispatchQueue).andReturn(dispatch_get_main_queue());

  id<WCTimer> dummyTimer = OCMProtocolMock(@protocol(WCTimer));
  OCMStub([_mockSupport setTimeout:0 block:[OCMArg any]])
      .ignoringNonObjectArgs()
      .andReturn(dummyTimer)
      .andDo(^(NSInvocation *invocation) {
        NSTimeInterval timeout;
        [invocation getArgument:&timeout atIndex:2];
        __unsafe_unretained void (^block)(void);
        [invocation getArgument:&block atIndex:3];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(timeout * NSEC_PER_SEC)),
                       dispatch_get_main_queue(), block);
      });
  OCMStub([_mockSupport setTimeout:0 block:[OCMArg any] context:[OCMArg any]])
      .ignoringNonObjectArgs()
      .andReturn(dummyTimer)
      .andDo(^(NSInvocation *invocation) {
        NSTimeInterval timeout;
        [invocation getArgument:&timeout atIndex:2];
        __unsafe_unretained void (^block)(void);
        [invocation getArgument:&block atIndex:3];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(timeout * NSEC_PER_SEC)),
                       dispatch_get_main_queue(), block);
      });
  OCMStub([_mockSupport clearTimeout:[OCMArg any]]);

  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:nil
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];
}

- (void)testOpen {
  [self open];
  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);
  XCTAssertEqual(kWCLastChannelVersion, _channel.channelVersion);
  XCTAssertNil(_channel.backChannelRequest);
}

- (void)testSend {
  [self open];
  [self send:@"foo" value:@"bar"];
  XCTAssertTrue([_channel.outgoingMaps[0].map[@"__data__"] isEqualToString:@"foo:bar"]);
}

- (void)testSendAndReceive {
  OCMStub([_mockSupport notifyTimingEventWithSize:0 withRTT:0 withRetries:0]).ignoringNonObjectArgs;
  [self open];
  [self send:@"foo" value:@"bar"];
  [self receivedResponse];
  [self receive:@"[\"the server reply\"]"];
  XCTAssertNil(_channel.backChannelRequest);
}

- (void)testReceive {
  [self open];
  [self receive:@"\"[message from server]\""];
  XCTAssertNil(_channel.backChannelRequest);
}

- (void)testReceiveAndSend {
  [self open];
  [self receive:@"[\"the server reply\"]"];
  [self send:@"foo" value:@"bar"];
  [self receivedResponse];
  XCTAssertNil(_channel.backChannelRequest);
}

- (void)testForwardRequestTimeout {
  [self open];
  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  BOOL found = NO;
  const NSTimeInterval kDefaultTimeout = 45.0;
  const NSTimeInterval kMaxExpectedTimeout = 20.0;

  for (WCChannelRequest *req in _channel.forwardChannelRequestPool.requestPool) {
    // Skip the handshake request which uses the default timeout of 45 seconds.
    if (req.timeout != kDefaultTimeout) {
      // With rand() normalized to 0..1, the timeout should be:
      // base (10s) + base (10s) * (0..1) = 10..20 seconds.
      XCTAssertLessThanOrEqual(req.timeout, kMaxExpectedTimeout);
      found = YES;
    }
  }
  XCTAssertTrue(found, @"Should have found a new forward request with non-default timeout");
}

- (void)testBufferingProxyDetectionNoImmediateFallback {
  WCOptions *options = [[WCOptions alloc] init];
  options.detectBufferingProxy = YES;

  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  [self open];

  // Handshake takes ~0.1s in tests, so RTT is ~0.1s.
  // Timeout is 2 * RTT = ~0.2s.
  // Wait 0.1s, the timer should not have fired yet.
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertTrue(_channel.isStreamingEnabled, @"Streaming should still be enabled before timeout");
}

- (void)testOutgoingMapsAwaitResponse {
  [self open];
  XCTAssertEqual(0, _channel.outgoingMaps.count);

  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  [self send:@"foo1" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  XCTAssertEqual(0, _channel.outgoingMaps.count);
  [self send:@"foo2" value:@"bar"];
  XCTAssertEqual(1, _channel.outgoingMaps.count);
  [self send:@"foo3" value:@"bar"];
  XCTAssertEqual(2, _channel.outgoingMaps.count);
  [self send:@"foo4" value:@"bar"];
  XCTAssertEqual(3, _channel.outgoingMaps.count);
  [self receivedResponse];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  XCTAssertEqual(0, _channel.outgoingMaps.count);
}

- (void)testUndeliveredMapsDoesNotNotifyWhenSuccessful {
  OCMStub([_mockDelegate webChannelClosed:nil]);
  [self open];
  [self send:@"foo1" value:@"bar1"];
  [self receivedResponse];
  [self send:@"foo2" value:@"bar2"];
  [self receivedResponse];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  [self close];
}

- (void)testUndeliveredMapsClearsPendingMapsAfterClosing {
  [self open];
  [self send:@"foo1" value:@"bar1"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  [self send:@"foo2" value:@"bar2"];
  [self send:@"foo3" value:@"bar3"];
  XCTAssertEqual(1, _channel.forwardChannelRequestPool.pendingMessages.count);
  XCTAssertEqual(2, _channel.outgoingMaps.count);
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  [self close];
  XCTAssertEqual(0, _channel.forwardChannelRequestPool.pendingMessages.count);
  XCTAssertEqual(0, _channel.outgoingMaps.count);
}

- (void)testResponseWithNoArraySent {
  [self connectForwardChannel];
  [self completeBackChannel];
  [self send:@"foo1" value:@"bar1"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  [self response:[NSNumber numberWithInt:-1] dataSize:[NSNumber numberWithInt:0]];
  XCTAssertEqual(1, _channel.lastResponseCount);
  XCTAssertEqual(-1, _channel.lastPostResponseCount);
}

- (void)testDidReceiveMessageWithMetadataHeaders {
  OCMStub([_mockDelegate webChannel:nil didReceiveHeaders:OCMOCK_ANY statusCode:404]);

  [self open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  NSString *responseString =
      @"[[5,{\"__headers__\":{\"test_header\":\"test_vlaue\",\"x-webchannel-metadata\":"
      @"\"echo the headers/status\"},\"__status__\":404}],[6,{\"message\":\"abc\"}]]";
  [_channel didReceiveInput:[responseString dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:_channel.backChannelRequest];
  [_channel handleCompleteRequest:_channel.backChannelRequest];
  XCTAssertNil(_channel.backChannelRequest);
}

- (void)testDidReceiveMessageWithMetadata {
  NSArray<NSArray<NSDictionary<NSString *, id> *> *> *expectedMetadata = @[ @[ @{
    @"error" : @{
      @"code" : @409,
      @"details" : @[ @{
        @"@type" : @"type.googleapis.com/google.rpc.DebugInfo",
        @"detail" : @"[ORIGINAL ERROR] generic::aborted: Aborted from server side."
      } ],
      @"message" : @"The operation was aborted.",
      @"status" : @"ABORTED",
    }
  } ] ];
  OCMStub([_mockDelegate webChannel:nil didReceiveMetadata:expectedMetadata key:@"status"]);
  OCMStub([_mockDelegate webChannelClosed:nil]);

  [self open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  NSString *response =
      @"["
      @"  [2,"
      @"    {\"__sm__\": {"
      @"      \"status\": [[{"
      @"        \"error\": {"
      @"          \"code\": 409,"
      @"          \"details\": [{"
      @"            \"@type\": \"type.googleapis.com/google.rpc.DebugInfo\","
      @"            \"detail\": \"[ORIGINAL ERROR] generic::aborted: Aborted from server side.\""
      @"          }],"
      @"          \"message\": \"The operation was aborted.\","
      @"          \"status\": \"ABORTED\""
      @"        }"
      @"      }]]"
      @"    }}"
      @"  ],"
      @"  [3,[\"close\"]]"
      @"]";
  [_channel didReceiveInput:[response dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:_channel.backChannelRequest];
  [_channel handleCompleteRequest:_channel.backChannelRequest];
  XCTAssertNil(_channel.backChannelRequest);
}

- (void)testInitialAndMessageHeaders {
  WCOptions *options = [[WCOptions alloc] init];
  options.initialMessageHeaders = @{@"initial_header" : @"initial_value"};
  options.messageHeaders = @{@"test_header" : @"test_value"};
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  // 1. Open channel
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  // Check open channel request headers
  WCChannelRequest *openChannelRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(openChannelRequest.extraHeaders);
  XCTAssertEqualObjects(@"initial_value", openChannelRequest.extraHeaders[@"initial_header"]);
  XCTAssertEqualObjects(@"test_value", openChannelRequest.extraHeaders[@"test_header"]);

  // 2. Complete open channel request to trigger back channel request
  [self completeForwardChannel];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  // Check back channel request headers
  XCTAssertNotNil(_channel.backChannelRequest.extraHeaders);
  XCTAssertEqualObjects(@"test_value", _channel.backChannelRequest.extraHeaders[@"test_header"]);

  // 3. Complete back channel
  [self completeBackChannel];

  // 4. Send message to trigger another forward channel request
  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  WCChannelRequest *forwardRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(forwardRequest.extraHeaders);
  XCTAssertEqualObjects(@"test_value", forwardRequest.extraHeaders[@"test_header"]);
}

- (void)testUnknownSessionIdErrorPropagation {
  OCMStub([_mockDelegate webChannel:nil encounteredError:WCWebChannelClientErrorUnknownSessionID]);

  [self connectForwardChannel];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  // Simulate an Unknown Session ID error on the backchannel request
  WCChannelRequest *request = _channel.backChannelRequest;
  XCTAssertNotNil(request);
  [request setValue:@(WCChannelRequestErrorUnknownSessionId) forKey:@"lastError"];
  id mockRequest = OCMPartialMock(request);
  OCMStub([mockRequest isSuccessful]).andReturn(NO);
  XCTAssertTrue([mockRequest isLastErrorFatal]);
  [_channel setValue:mockRequest forKey:@"backChannelRequest"];

  [_channel handleCompleteRequest:mockRequest];

  OCMVerifyAll((id)_mockDelegate);
}

#pragma Private

- (void)open {
  [self connectForwardChannel];
  [self completeBackChannel];
}

- (void)connectForwardChannel {
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  [self completeForwardChannel];
}

- (void)completeForwardChannel {
  NSString *serverVersionString = [NSString stringWithFormat:@"%d", kRealServerVersion];
  NSString *responseData = [NSString
      stringWithFormat:@"[[0,[\"c\",\"1234567890ABCDEF\",\"null\", %@]]]", serverVersionString];
  WCChannelRequest *forwardRequest = [self getSingleForwardRequest];
  WCChannelRequest *mockForwardRequest = OCMPartialMock(forwardRequest);
  OCMStub([mockForwardRequest isSuccessful]).andReturn(YES);
  [_channel handleCompleteRequest:mockForwardRequest];
  [_channel didReceiveInput:[responseData dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:forwardRequest];
}

- (WCChannelRequest *)getSingleForwardRequest {
  return _channel.forwardChannelRequestPool.requestPool.anyObject;
}

- (WCChannelRequest *)forwardRequestAddedSince:(NSSet<WCChannelRequest *> *)before {
  NSMutableSet<WCChannelRequest *> *added =
      [_channel.forwardChannelRequestPool.requestPool mutableCopy];
  [added minusSet:before];
  XCTAssertEqual(1u, added.count);
  return added.anyObject;
}

- (WCChannelRequest *)sendAndGetNewForwardRequest:(NSString *)key value:(NSString *)value {
  NSSet<WCChannelRequest *> *before = [_channel.forwardChannelRequestPool.requestPool copy];
  [self send:key value:value];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  return [self forwardRequestAddedSince:before];
}

- (void)completeBackChannel {
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  [_channel didReceiveInput:[@"[[1,[\"foo\"]]]" dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:_channel.backChannelRequest];
  [_channel handleCompleteRequest:_channel.backChannelRequest];
}

- (void)send:(NSString *)key value:(NSString *)value {
  [_channel send:[NSString stringWithFormat:@"%@:%@", key, value]];
}

- (void)receive:(NSString *)data {
  NSString *inputStr = [NSString stringWithFormat:@"[[1,%@]]", data];
  [_channel didReceiveInput:[inputStr dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:_channel.backChannelRequest];
  [_channel handleCompleteRequest:_channel.backChannelRequest];
}

- (void)receivedResponse {
  WCChannelRequest *forwardRequest = [self getSingleForwardRequest];
  [_channel didReceiveInput:[@"[1,0,0]" dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:forwardRequest];
  [_channel handleCompleteRequest:forwardRequest];
}

- (void)response:(NSNumber *)lastResponseID dataSize:(NSNumber *)dataSize {
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[ @1, lastResponseID, dataSize ]
                                                     options:NSJSONWritingPrettyPrinted
                                                       error:nil];
  NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  WCChannelRequest *request = [self getSingleForwardRequest];
  [_channel didReceiveInput:[jsonString dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:request];
  [_channel handleCompleteRequest:request];
}

- (void)close {
  [_channel close];
}

- (void)testNonBlockingSendSuccess {
  WCOptions *options = [[WCOptions alloc] init];
  options.nonBlockingSend = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  XCTAssertEqualObjects(@"", _channel.sessionID);

  // 1. Open channel (handshake starts)
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);

  // Handshake request should be in pool
  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  // Session ID should be generated (starts with "c-")
  XCTAssertTrue([_channel.sessionID hasPrefix:@"c-"]);

  // 2. Send message immediately (while still opening)
  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  // There should be 2 requests in the pool (handshake + early send)
  XCTAssertEqual(2, _channel.forwardChannelRequestPool.requestPool.count);

  // Complete handshake
  NSString *serverVersionString = [NSString stringWithFormat:@"%d", kRealServerVersion];
  NSString *responseData = [NSString stringWithFormat:@"[[0,[\"c\",\"%@\",\"null\", %@]]]",
                                                      _channel.sessionID, serverVersionString];

  // Complete the handshake request
  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(YES);

  [_channel didReceiveInput:[responseData dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:handshakeRequest];
  [_channel handleCompleteRequest:handshakeRequest];

  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);
}

- (void)testNonBlockingSendFailureAndRecovery {
  WCOptions *options = [[WCOptions alloc] init];
  options.nonBlockingSend = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  // 1. Open channel (handshake starts)
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  // 2. Send message immediately
  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  // Find the early send request (the one that is NOT the handshake request)
  WCChannelRequest *earlySendRequest = nil;
  for (WCChannelRequest *req in _channel.forwardChannelRequestPool.requestPool) {
    if (![req.requestID isEqualToString:handshakeRequest.requestID]) {
      earlySendRequest = req;
      break;
    }
  }
  XCTAssertNotNil(earlySendRequest);

  // 3. Simulate failure of early send with UnknownSessionId
  [earlySendRequest setValue:@(WCChannelRequestErrorUnknownSessionId) forKey:@"lastError"];
  id mockEarlySendRequest = OCMPartialMock(earlySendRequest);
  OCMStub([mockEarlySendRequest isSuccessful]).andReturn(NO);

  [_channel handleCompleteRequest:earlySendRequest];

  // Channel should STILL be Opening, not Closed
  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);

  // Failed message should be requeued to outgoingMaps
  XCTAssertEqual(1, _channel.outgoingMaps.count);
  XCTAssertTrue([_channel.outgoingMaps[0].map[@"__data__"] isEqualToString:@"foo:bar"]);

  // 4. Complete handshake
  NSString *serverVersionString = [NSString stringWithFormat:@"%d", kRealServerVersion];
  NSString *responseData = [NSString stringWithFormat:@"[[0,[\"c\",\"%@\",\"null\", %@]]]",
                                                      _channel.sessionID, serverVersionString];

  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(YES);

  [_channel didReceiveInput:[responseData dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:handshakeRequest];
  [_channel handleCompleteRequest:handshakeRequest];

  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);

  // Requeued message should be sent again (new request in pool)
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  XCTAssertEqual(1, _channel.forwardChannelRequestPool.requestPool.count);
}

- (void)testNonBlockingSendHandshakeCompletesBeforeFailure {
  WCOptions *options = [[WCOptions alloc] init];
  options.nonBlockingSend = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  // 1. Open channel (handshake starts)
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  // 2. Send message immediately during Opening
  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *earlySendRequest = nil;
  for (WCChannelRequest *req in _channel.forwardChannelRequestPool.requestPool) {
    if (![req.requestID isEqualToString:handshakeRequest.requestID]) {
      earlySendRequest = req;
      break;
    }
  }
  XCTAssertNotNil(earlySendRequest);

  // 3. Handshake completes FIRST -> channel transitions to Opened
  NSString *serverVersionString = [NSString stringWithFormat:@"%d", kRealServerVersion];
  NSString *responseData = [NSString stringWithFormat:@"[[0,[\"c\",\"%@\",\"null\", %@]]]",
                                                      _channel.sessionID, serverVersionString];
  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(YES);

  [_channel didReceiveInput:[responseData dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:handshakeRequest];
  [_channel handleCompleteRequest:handshakeRequest];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);

  // 4. Early send fails with UnknownSessionId AFTER handshake already completed
  [earlySendRequest setValue:@(WCChannelRequestErrorUnknownSessionId) forKey:@"lastError"];
  id mockEarlySendRequest = OCMPartialMock(earlySendRequest);
  OCMStub([mockEarlySendRequest isSuccessful]).andReturn(NO);

  [_channel handleCompleteRequest:earlySendRequest];

  // Channel should STILL be Opened, not Closed
  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);

  // Verify retry is scheduled and the message is resent
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  XCTAssertEqual(1, _channel.forwardChannelRequestPool.requestPool.count);
}

- (void)testNonBlockingSendTimeoutFailureAndRecovery {
  WCOptions *options = [[WCOptions alloc] init];
  options.nonBlockingSend = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  // 1. Open channel (handshake starts)
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  // 2. Send message immediately
  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  // Find the early send request (the one that is NOT the handshake request)
  WCChannelRequest *earlySendRequest = nil;
  for (WCChannelRequest *req in _channel.forwardChannelRequestPool.requestPool) {
    if (![req.requestID isEqualToString:handshakeRequest.requestID]) {
      earlySendRequest = req;
      break;
    }
  }
  XCTAssertNotNil(earlySendRequest);

  // 3. Simulate failure of early send with Timeout (non-fatal)
  [earlySendRequest setValue:@(WCChannelRequestErrorTimeout) forKey:@"lastError"];
  id mockEarlySendRequest = OCMPartialMock(earlySendRequest);
  OCMStub([mockEarlySendRequest isSuccessful]).andReturn(NO);

  [_channel handleCompleteRequest:earlySendRequest];

  // Channel should STILL be Opening, not Closed
  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);

  // Failed message should be requeued to outgoingMaps
  XCTAssertEqual(1, _channel.outgoingMaps.count);
  XCTAssertTrue([_channel.outgoingMaps[0].map[@"__data__"] isEqualToString:@"foo:bar"]);

  // 4. Complete handshake
  NSString *serverVersionString = [NSString stringWithFormat:@"%d", kRealServerVersion];
  NSString *responseData = [NSString stringWithFormat:@"[[0,[\"c\",\"%@\",\"null\", %@]]]",
                                                      _channel.sessionID, serverVersionString];

  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(YES);

  [_channel didReceiveInput:[responseData dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:handshakeRequest];
  [_channel handleCompleteRequest:handshakeRequest];

  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);

  // Requeued message should be sent again (new request in pool)
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  XCTAssertEqual(1, _channel.forwardChannelRequestPool.requestPool.count);
}

- (void)testNonBlockingSendDisabled {
  WCOptions *options = [[WCOptions alloc] init];
  options.nonBlockingSend = NO;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  XCTAssertEqualObjects(@"", _channel.sessionID);

  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);

  // Session ID should NOT be generated (should remain empty)
  XCTAssertEqualObjects(@"", _channel.sessionID);
}
- (void)testHandshakeHeadersPropagation {
  NSDictionary<NSString *, NSString *> *fakeHeaders =
      @{@"Server-Timing" : @"gfet4t7; dur=50", @"Some-Other-Header" : @"value"};

  _fakeRequest.fakeResponseHeaders = fakeHeaders;

  // Expect support to be notified of handshake response headers.
  OCMExpect([_mockSupport notifyHandshakeResponseHeaders:fakeHeaders]);

  // Now open the channel (starts handshake with our mock request)
  [self connectForwardChannel];

  // Verify expect
  OCMVerifyAll((id)_mockSupport);
}

- (void)testReceiveBinaryBackChannelMessage {
  [self connectForwardChannel];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  XCTAssertNotNil(_channel.backChannelRequest);
  XCTAssertFalse(_channel.isBackChannelBinaryEncodingEnabled);
  XCTAssertFalse(_channel.runtimeProperties.isBackChannelBinaryEncodingEnabled);

  const char rawBytes[] = {'f', 'o', 'o', 0x00, 'b', 'a', 'r', (char)0xFF};
  NSData *payloadBytes = [NSData dataWithBytes:rawBytes length:8];

  NSMutableData *binaryPayload = [NSMutableData data];
  [binaryPayload appendData:[@"id=1&size=8\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [binaryPayload appendData:payloadBytes];

  OCMExpect([_mockDelegate webChannel:[OCMArg any] didReceiveMessage:payloadBytes]);

  [_channel didReceiveInput:binaryPayload isBinary:YES withRequest:_channel.backChannelRequest];
  [_channel handleCompleteRequest:_channel.backChannelRequest];

  OCMVerifyAll((id)_mockDelegate);
  XCTAssertTrue(_channel.isBackChannelBinaryEncodingEnabled);
  XCTAssertTrue(_channel.runtimeProperties.isBackChannelBinaryEncodingEnabled);

  [_channel close];
  XCTAssertFalse(_channel.isBackChannelBinaryEncodingEnabled);
  XCTAssertFalse(_channel.runtimeProperties.isBackChannelBinaryEncodingEnabled);
}

- (void)testReceiveInvalidBinaryBackChannelMessage {
  [self connectForwardChannel];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  XCTAssertNotNil(_channel.backChannelRequest);
  XCTAssertFalse(_channel.isBackChannelBinaryEncodingEnabled);

  OCMExpect([_mockDelegate webChannel:[OCMArg any]
                     encounteredError:WCWebChannelClientErrorBadResponse]);

  NSData *badPayload = [@"invalid_binary_data" dataUsingEncoding:NSUTF8StringEncoding];

  [_channel didReceiveInput:badPayload isBinary:YES withRequest:_channel.backChannelRequest];

  OCMVerifyAll((id)_mockDelegate);
  XCTAssertEqual(_channel.state, WCWebChannelClientStateClosed);
  XCTAssertFalse(_channel.isBackChannelBinaryEncodingEnabled);
}

- (void)testDefaultClientVersion {
  XCTAssertEqual(kWCClientVersion, 25);
}

- (void)testFastHandshake2WithBinaryEncoding {
  WCOptions *options = [[WCOptions alloc] init];
  options.fastHandshake2 = YES;
  options.enableBinaryEncoding = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  // 1. Open channel (handshake starts)
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);
  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);
  XCTAssertTrue(handshakeRequest.isBinaryMessage);
  XCTAssertTrue(handshakeRequest.decodeInitialResponse);
  XCTAssertFalse([handshakeRequest isInitialResponseDecoded]);
  XCTAssertFalse(handshakeRequest.POST);
  XCTAssertTrue([handshakeRequest.sessionID hasPrefix:@"c-"]);

  // 2. Early non-blocking send while in Opening state
  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *earlySendRequest = nil;
  for (WCChannelRequest *req in _channel.forwardChannelRequestPool.requestPool) {
    if (![req.requestID isEqualToString:handshakeRequest.requestID]) {
      earlySendRequest = req;
      break;
    }
  }
  XCTAssertNotNil(earlySendRequest);
  XCTAssertTrue(earlySendRequest.isBinaryMessage);
  XCTAssertTrue(earlySendRequest.POST);

  // 3. Complete handshake
  NSString *serverVersionString = [NSString stringWithFormat:@"%d", kRealServerVersion];
  NSString *responseData = [NSString stringWithFormat:@"[[0,[\"c\",\"%@\",\"null\", %@]]]",
                                                      _channel.sessionID, serverVersionString];
  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(YES);
  OCMStub([mockHandshakeRequest isInitialResponseDecoded]).andReturn(YES);

  [_channel didReceiveInput:[responseData dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:handshakeRequest];

  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);
  // Handshake request was upgraded to backChannelRequest
  XCTAssertEqualObjects(_channel.backChannelRequest, handshakeRequest);
  XCTAssertTrue(_channel.backChannelRequest.isBinaryMessage);

  [_channel handleCompleteRequest:handshakeRequest];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);
}

- (void)testFastHandshakeIgnoredWhenBinaryEncodingEnabledWithoutFastHandshake2 {
  WCOptions *options = [[WCOptions alloc] init];
  options.fastHandshake = YES;
  options.fastHandshake2 = NO;
  options.enableBinaryEncoding = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);
  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);
  XCTAssertTrue(handshakeRequest.isBinaryMessage);
  // fastHandshake was ignored, so sent as POST rather than GET
  XCTAssertTrue(handshakeRequest.POST);
  XCTAssertFalse(handshakeRequest.decodeInitialResponse);
  XCTAssertFalse([handshakeRequest isInitialResponseDecoded]);
}

- (void)testFastHandshake2DoesNotEncodeInitialMessagesInGetUri {
  WCOptions *options = [[WCOptions alloc] init];
  options.fastHandshake2 = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);
  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);
  XCTAssertFalse(handshakeRequest.POST);
  XCTAssertEqual(0, handshakeRequest.pendingMessages.count);
  XCTAssertTrue([handshakeRequest.sessionID hasPrefix:@"c-"]);

  // Send early messages while in OPENING state
  [self send:@"k1" value:@"v1"];
  [self send:@"k2" value:@"v2"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  // Handshake GET request should have no pending messages
  XCTAssertEqual(0, handshakeRequest.pendingMessages.count);

  // Early forward POST requests contain the messages
  int totalPostMessages = 0;
  for (WCChannelRequest *req in _channel.forwardChannelRequestPool.requestPool) {
    if (![req.requestID isEqualToString:handshakeRequest.requestID]) {
      totalPostMessages += req.pendingMessages.count;
      XCTAssertTrue([req.sessionID hasPrefix:@"c-"]);
      XCTAssertTrue(req.POST);
    }
  }
  XCTAssertEqual(2, totalPostMessages);
}

- (void)testNonBlockingSendWithFastHandshakeGetsClientSid {
  WCOptions *options = [[WCOptions alloc] init];
  options.fastHandshake2 = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);

  // Retrieve the handshake GET request
  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);
  // Verify that it is using a client-generated SID instead of "null"
  XCTAssertTrue([handshakeRequest.sessionID hasPrefix:@"c-"]);
}

- (void)testFastHandshakeSetsDecodeInitialResponse {
  WCOptions *options = [[WCOptions alloc] init];
  options.fastHandshake = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);
  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);
  XCTAssertFalse(handshakeRequest.POST);
  XCTAssertTrue(handshakeRequest.decodeInitialResponse);
  XCTAssertFalse([handshakeRequest isInitialResponseDecoded]);
}

- (void)testNonBlockingSendEarlySendFailsWithUnknownSidRequeuesAndRecovers {
  WCOptions *options = [[WCOptions alloc] init];
  options.fastHandshake2 = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  // 1. Open channel (handshake starts)
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  // 2. Send message immediately
  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *earlySendRequest = nil;
  for (WCChannelRequest *req in _channel.forwardChannelRequestPool.requestPool) {
    if (![req.requestID isEqualToString:handshakeRequest.requestID]) {
      earlySendRequest = req;
      break;
    }
  }
  XCTAssertNotNil(earlySendRequest);

  // 3. The server rejects the early POST with "Unknown SID" because the handshake has not
  // registered the client SID yet. Drive the real classification path: WCChannelRequest maps
  // 400 + "Unknown SID" to UnknownSessionId, exactly as the C++ client does.
  id mockHTTPRequest = OCMPartialMock(_fakeRequest);
  OCMStub([mockHTTPRequest requestReadyState]).andReturn(WCRequestReadyStateComplete);
  OCMStub([mockHTTPRequest status]).andReturn(400);
  NSData *errorBody =
      [@"<HTML><BODY>Unknown SID</BODY></HTML>" dataUsingEncoding:NSUTF8StringEncoding];
  [earlySendRequest stateChangedForRequest:_fakeRequest responseData:errorBody];

  XCTAssertEqual(WCChannelRequestErrorUnknownSessionId, earlySendRequest.lastError);

  // Channel should STILL be Opening, not Closed
  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);

  // Failed message should be requeued to outgoingMaps
  XCTAssertEqual(1, _channel.outgoingMaps.count);
  XCTAssertTrue([_channel.outgoingMaps[0].map[@"__data__"] isEqualToString:@"foo:bar"]);

  // 4. Complete handshake
  NSString *serverVersionString = [NSString stringWithFormat:@"%d", kRealServerVersion];
  NSString *responseData = [NSString stringWithFormat:@"[[0,[\"c\",\"%@\",\"null\", %@]]]",
                                                      _channel.sessionID, serverVersionString];

  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(YES);

  [_channel didReceiveInput:[responseData dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:handshakeRequest];
  [_channel handleCompleteRequest:handshakeRequest];

  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);

  // Requeued message should be sent again (new request in pool)
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  XCTAssertEqual(1, _channel.forwardChannelRequestPool.requestPool.count);
}

// A 400 that is not an "Unknown SID" rejection is fatal, matching the C++ client, which only
// downgrades UNKNOWN_SESSION_ID for non-blocking send.
- (void)testNonBlockingSendEarlySendFailsWithBareStatus400IsFatal {
  WCOptions *options = [[WCOptions alloc] init];
  options.fastHandshake2 = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  [self send:@"foo" value:@"bar"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *earlySendRequest = nil;
  for (WCChannelRequest *req in _channel.forwardChannelRequestPool.requestPool) {
    if (![req.requestID isEqualToString:handshakeRequest.requestID]) {
      earlySendRequest = req;
      break;
    }
  }
  XCTAssertNotNil(earlySendRequest);

  [earlySendRequest setValue:@(WCChannelRequestErrorStatus) forKey:@"lastError"];
  [earlySendRequest setValue:@(400) forKey:@"lastStatusCode"];
  id mockEarlySendRequest = OCMPartialMock(earlySendRequest);
  OCMStub([mockEarlySendRequest isSuccessful]).andReturn(NO);

  OCMExpect([_mockDelegate webChannel:[OCMArg any]
                     encounteredError:WCWebChannelClientErrorRequestFailed]);

  [_channel handleCompleteRequest:earlySendRequest];

  OCMVerifyAll((id)_mockDelegate);
  XCTAssertEqual(WCWebChannelClientStateClosed, _channel.state);
}

- (void)testNonBlockingSendHandshakeFailureSignalsError {
  WCOptions *options = [[WCOptions alloc] init];
  options.nonBlockingSend = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  // 1. Open channel (handshake starts)
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);

  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  // 2. Send an early map while still in Opening state
  [self send:@"k1" value:@"v1"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  // 3. Simulate a network failure on the handshake request (status code 0 / Status error)
  [handshakeRequest setValue:@(WCChannelRequestErrorStatus) forKey:@"lastError"];
  [handshakeRequest setValue:@(0) forKey:@"lastStatusCode"];
  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(NO);

  OCMExpect([_mockDelegate webChannel:[OCMArg any]
                     encounteredError:WCWebChannelClientErrorRequestFailed]);

  [_channel handleCompleteRequest:handshakeRequest];

  // Channel should fail fast and transition to Closed, not hang in Opening.
  OCMVerifyAll((id)_mockDelegate);
  XCTAssertEqual(WCWebChannelClientStateClosed, _channel.state);
}

- (void)testFastHandshake2HandshakeFailureSignalsError {
  WCOptions *options = [[WCOptions alloc] init];
  options.fastHandshake2 = YES;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];

  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  XCTAssertEqual(WCWebChannelClientStateOpening, _channel.state);

  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  // Send an early map while still in Opening state
  [self send:@"k1" value:@"v1"];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  [handshakeRequest setValue:@(WCChannelRequestErrorStatus) forKey:@"lastError"];
  [handshakeRequest setValue:@(0) forKey:@"lastStatusCode"];
  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(NO);

  OCMExpect([_mockDelegate webChannel:[OCMArg any]
                     encounteredError:WCWebChannelClientErrorRequestFailed]);

  [_channel handleCompleteRequest:handshakeRequest];

  OCMVerifyAll((id)_mockDelegate);
  XCTAssertEqual(WCWebChannelClientStateClosed, _channel.state);
}

- (void)testUnknownRequestErrorSignalsRequestFailed {
  [_channel open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];

  WCChannelRequest *handshakeRequest = [self getSingleForwardRequest];
  XCTAssertNotNil(handshakeRequest);

  [handshakeRequest setValue:@(WCChannelRequestErrorUnknown) forKey:@"lastError"];
  id mockHandshakeRequest = OCMPartialMock(handshakeRequest);
  OCMStub([mockHandshakeRequest isSuccessful]).andReturn(NO);

  OCMExpect([_mockDelegate webChannel:[OCMArg any]
                     encounteredError:WCWebChannelClientErrorRequestFailed]);

  [_channel handleCompleteRequest:handshakeRequest];

  OCMVerifyAll((id)_mockDelegate);
  XCTAssertEqual(WCWebChannelClientStateClosed, _channel.state);
}

- (void)testStartForwardChannelDoesNotExceedConcurrentRequestLimit {
  WCOptions *options = [[WCOptions alloc] init];
  options.concurrentRequestLimit = 2;
  _channel = [[WCWebChannelClientInternal alloc] initWithURL:@""
                                                     options:options
                                             connectionState:nil
                                               clientVersion:1
                                                    delegate:_mockDelegate
                                                     support:_mockSupport];
  [self open];
  WCForwardChannelRequestPool *pool = _channel.forwardChannelRequestPool;
  XCTAssertEqual(2, pool.maxSize);
  int requestID = 100;
  while (!pool.full) {
    [pool addRequest:[[WCChannelRequest alloc]
                         initWithSessionID:@"sid"
                                 requestID:[NSString stringWithFormat:@"%d", requestID++]
                                   support:_mockSupport
                                  delegate:_channel]];
  }
  XCTAssertEqual(pool.maxSize, pool.requestCount);
  [self send:@"foo" value:@"bar"];
  XCTAssertEqual(1, _channel.outgoingMaps.count);

  [_channel startForwardChannelWithRetryRequest:nil];

  XCTAssertEqual(pool.maxSize, pool.requestCount);
  XCTAssertEqual(1, _channel.outgoingMaps.count);
}

- (void)testForwardChannelFailureWhileStartIsPendingRequeuesMessages {
  [self open];
  WCChannelRequest *failedRequest = [self sendAndGetNewForwardRequest:@"foo1" value:@"bar1"];
  XCTAssertEqual(1, failedRequest.pendingMessages.count);

  [self send:@"foo2" value:@"bar2"];
  [failedRequest setValue:@(WCChannelRequestErrorTimeout) forKey:@"lastError"];
  id mockFailedRequest = OCMPartialMock(failedRequest);
  OCMStub([mockFailedRequest isSuccessful]).andReturn(NO);
  [_channel handleCompleteRequest:failedRequest];

  XCTAssertEqual(2, _channel.outgoingMaps.count);
  XCTAssertEqualObjects(@"foo1:bar1", _channel.outgoingMaps[0].map[@"__data__"]);

  NSSet<WCChannelRequest *> *before = [_channel.forwardChannelRequestPool.requestPool copy];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  WCChannelRequest *nextRequest = [self forwardRequestAddedSince:before];
  XCTAssertNotEqual(failedRequest, nextRequest);
  XCTAssertEqual(2, nextRequest.pendingMessages.count);
  XCTAssertEqualObjects(@"foo1:bar1", nextRequest.pendingMessages[0].map[@"__data__"]);
  XCTAssertEqualObjects(@"foo2:bar2", nextRequest.pendingMessages[1].map[@"__data__"]);
  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);
}

- (void)testCloseReportsInFlightMessagesAsNonAcked {
  [self open];
  WCChannelRequest *inFlightRequest = [self sendAndGetNewForwardRequest:@"foo1" value:@"bar1"];
  XCTAssertEqual(1, inFlightRequest.pendingMessages.count);
  XCTAssertEqual(0, _channel.outgoingMaps.count);

  [self close];

  XCTAssertEqual(WCWebChannelClientStateClosed, _channel.state);
  XCTAssertEqual(1, _channel.nonAckedMaps.count);
  XCTAssertEqualObjects(@"foo1:bar1", _channel.nonAckedMaps[0].map[@"__data__"]);
  XCTAssertEqual(0, _channel.forwardChannelRequestPool.pendingMessages.count);
}

- (void)testChannelErrorLeavesNoPendingMessagesInPool {
  [self open];
  int baselineRequestCount = _channel.forwardChannelRequestPool.requestCount;
  WCChannelRequest *failedRequest = [self sendAndGetNewForwardRequest:@"foo1" value:@"bar1"];
  [self sendAndGetNewForwardRequest:@"foo2" value:@"bar2"];
  XCTAssertEqual(baselineRequestCount + 2, _channel.forwardChannelRequestPool.requestCount);

  [failedRequest setValue:@(WCChannelRequestErrorUnknownSessionId) forKey:@"lastError"];
  id mockFailedRequest = OCMPartialMock(failedRequest);
  OCMStub([mockFailedRequest isSuccessful]).andReturn(NO);
  OCMExpect([_mockDelegate webChannel:[OCMArg any]
                     encounteredError:WCWebChannelClientErrorUnknownSessionID]);
  [_channel handleCompleteRequest:failedRequest];

  OCMVerifyAll((id)_mockDelegate);
  XCTAssertEqual(WCWebChannelClientStateClosed, _channel.state);
  XCTAssertEqual(2, _channel.nonAckedMaps.count);
  XCTAssertEqual(0, _channel.forwardChannelRequestPool.pendingMessages.count);
}

- (void)testUndecodableTextResponseSignalsBadResponse {
  [self open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  WCChannelRequest *backChannelRequest = _channel.backChannelRequest;
  XCTAssertNotNil(backChannelRequest);
  OCMExpect([_mockDelegate webChannel:[OCMArg any]
                     encounteredError:WCWebChannelClientErrorBadResponse]);

  [_channel didReceiveInput:[@"not json" dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:backChannelRequest];

  OCMVerifyAll((id)_mockDelegate);
  XCTAssertEqual(WCWebChannelClientStateClosed, _channel.state);
}

- (void)testWhitespaceOnlyTextResponseIsIgnored {
  [self open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  WCChannelRequest *backChannelRequest = _channel.backChannelRequest;
  XCTAssertNotNil(backChannelRequest);
  OCMReject([_mockDelegate webChannel:[OCMArg any] encounteredError:0]).ignoringNonObjectArgs();

  [_channel didReceiveInput:[@" \r\n\t" dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:backChannelRequest];

  XCTAssertEqual(WCWebChannelClientStateOpened, _channel.state);
  XCTAssertEqual(backChannelRequest, _channel.backChannelRequest);
}

- (void)testPostResponseWithMissingBackChannelRestartsStaleBackChannel {
  [self open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  WCChannelRequest *staleBackChannelRequest = _channel.backChannelRequest;
  XCTAssertNotNil(staleBackChannelRequest);
  int baselineRetryCount = _channel.backChannelRetryCount;
  WCChannelRequest *forwardRequest = [self sendAndGetNewForwardRequest:@"foo" value:@"bar"];
  [staleBackChannelRequest
      setValue:[forwardRequest.requestStartTime dateByAddingTimeInterval:-2 * kWCRTTEstimate]
        forKey:@"requestStartTime"];

  [_channel didReceiveInput:[@"[0,0,0]" dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:forwardRequest];

  XCTAssertTrue(staleBackChannelRequest.cancelled);
  XCTAssertNil(_channel.backChannelRequest);
  XCTAssertEqual(baselineRetryCount + 1, _channel.backChannelRetryCount);
  OCMVerify([_mockSupport notifyStatEvent:WCRequestStatBackChannelMissing]);
}

- (void)testPostResponseWithMissingBackChannelKeepsRecentBackChannel {
  [self open];
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  WCChannelRequest *backChannelRequest = _channel.backChannelRequest;
  XCTAssertNotNil(backChannelRequest);
  int baselineRetryCount = _channel.backChannelRetryCount;
  WCChannelRequest *forwardRequest = [self sendAndGetNewForwardRequest:@"foo" value:@"bar"];
  [backChannelRequest setValue:forwardRequest.requestStartTime forKey:@"requestStartTime"];

  [_channel didReceiveInput:[@"[0,0,0]" dataUsingEncoding:NSUTF8StringEncoding]
                   isBinary:NO
                withRequest:forwardRequest];

  XCTAssertFalse(backChannelRequest.cancelled);
  XCTAssertEqual(backChannelRequest, _channel.backChannelRequest);
  XCTAssertEqual(baselineRetryCount, _channel.backChannelRetryCount);
}

@end
