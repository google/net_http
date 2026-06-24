#import "../Support/WCDefaultJSONDecoder.h"
#import "../Support/WCFakeHTTPRequest.h"
#import "../Support/WCHTTPRequest.h"
#import "../Support/WCJSONDecoder.h"
#import "../WCChannelRequest.h"
#import "../WCForwardChannelRequestPool.h"
#import "../WCOptions.h"
#import "../WCQueuedMap.h"
#import "../WCSupport.h"
#import "../WCTimer.h"
#import "../WCWebChannelClient.h"
#import "../WCWebChannelClientInternal.h"

#import <XCTest/XCTest.h>

#import <GTMSessionFetcher/GTMSessionFetcher.h>
#import <GTMSessionFetcher/GTMSessionFetcherService.h>
#import <OCMock/OCMock.h>

static const int kRealServerVersion = 8;
static const double kRunLoopDelay = 0.1;

@interface WCWebChannelClientInternal () <WCWebChannelInternalHTTPHandler>
@end

@interface WCWebChannelClientTest : XCTestCase
@end

@implementation WCWebChannelClientTest {
  WCWebChannelClientInternal *_channel;
  id<WCSupport> _mockSupport;
  id<WCWebChannelClientHandlerDelegate> _mockDelegate;
  GTMSessionFetcherService *_fetcherService;
}

- (void)setUp {
  [super setUp];
  _mockSupport = OCMProtocolMock(@protocol(WCSupport));
  _mockDelegate = OCMProtocolMock(@protocol(WCWebChannelClientHandlerDelegate));
  _fetcherService = [GTMSessionFetcherService mockFetcherServiceWithFakedData:[NSData data]
                                                                   fakedError:nil];
  id<WCHTTPRequest> _fakeRequest = [[WCFakeHTTPRequest alloc] init];
  id<WCJSONDecoder> _decoder = [[WCDefaultJSONDecoder alloc] init];
  OCMStub(_mockSupport.JSONDecoder).andReturn(_decoder);
  OCMStub([_mockSupport HTTPRequest:OCMOCK_ANY]).andReturn(_fakeRequest);
  OCMStub(_mockSupport.dispatchQueue).andReturn(dispatch_get_main_queue());

  id<WCTimer> dummyTimer = OCMProtocolMock(@protocol(WCTimer));
  OCMStub([_mockSupport setTimeout:0 block:[OCMArg any]])
      .ignoringNonObjectArgs()
      .andReturn(dummyTimer)
      .andDo(^id<WCTimer>(id<WCSupport> localSelf, NSTimeInterval timeout, void (^block)()) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(timeout * NSEC_PER_SEC)),
                       dispatch_get_main_queue(), block);
        return dummyTimer;
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
  [_channel didReceiveInput:responseString withRequest:_channel.backChannelRequest];
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
  // See go/webchannel-oneplatform#message-formats
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
  [_channel didReceiveInput:response withRequest:_channel.backChannelRequest];
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
  [_channel didReceiveInput:responseData withRequest:forwardRequest];
}

- (WCChannelRequest *)getSingleForwardRequest {
  return _channel.forwardChannelRequestPool.requestPool.anyObject;
}

- (void)completeBackChannel {
  [[NSRunLoop mainRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:kRunLoopDelay]];
  [_channel didReceiveInput:@"[[1,[\"foo\"]]]" withRequest:_channel.backChannelRequest];
  [_channel handleCompleteRequest:_channel.backChannelRequest];
}

- (void)send:(NSString *)key value:(NSString *)value {
  [_channel send:[NSString stringWithFormat:@"%@:%@", key, value]];
}

- (void)receive:(NSString *)data {
  [_channel didReceiveInput:[NSString stringWithFormat:@"[[1,%@]]", data]
                withRequest:_channel.backChannelRequest];
  [_channel handleCompleteRequest:_channel.backChannelRequest];
}

- (void)receivedResponse {
  WCChannelRequest *forwardRequest = [self getSingleForwardRequest];
  [_channel didReceiveInput:@"[1,0,0]" withRequest:forwardRequest];
  [_channel handleCompleteRequest:forwardRequest];
}

- (void)response:(NSNumber *)lastResponseID dataSize:(NSNumber *)dataSize {
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[ @1, lastResponseID, dataSize ]
                                                     options:NSJSONWritingPrettyPrinted
                                                       error:nil];
  NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  WCChannelRequest *request = [self getSingleForwardRequest];
  [_channel didReceiveInput:jsonString withRequest:request];
  [_channel handleCompleteRequest:request];
}

- (void)close {
  [_channel close];
}
@end
