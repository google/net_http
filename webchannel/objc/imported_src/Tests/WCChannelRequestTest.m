#import "../Support/WCHTTPRequest.h"
#import "../WCChannelRequest.h"

#import <XCTest/XCTest.h>

#import "../WCSupport.h"
#import "../WCTimer.h"
#import "../WCWebChannelClientInternal.h"
#import <GTMSessionFetcher/GTMSessionFetcherService.h>
#import <OCMock/OCMock.h>

static const long kChannelRequestDefaultTimeout = 45;
static NSString *const kFakePOSTResponse = @"7\n[0,0,7]";
static NSString *const kFakeGETResponse = @"14\n[[1,[\"noop\"]]]14\n[[2,[\"noop\"]]]";

@interface WCChannelRequestTest : XCTestCase
@end

@implementation WCChannelRequestTest {
  WCChannelRequest *_request;
  id<WCSupport> _mockSupport;
  id<WCWebChannelInternalHTTPHandler> _mockHTTPInternalHandler;
  id<WCHTTPRequest> _mockHttpRequest;
}
- (void)setUp {
  [super setUp];

  _mockSupport = OCMProtocolMock(@protocol(WCSupport));
  _mockHTTPInternalHandler = OCMProtocolMock(@protocol(WCWebChannelInternalHTTPHandler));
  _mockHttpRequest = OCMProtocolMock(@protocol(WCHTTPRequest));
  OCMStub([_mockSupport HTTPRequest:[OCMArg any]]).andReturn(_mockHttpRequest);
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

  _request = [[WCChannelRequest alloc] initWithSessionID:@"sessionID"
                                               requestID:@"requestID"
                                                 support:_mockSupport
                                                delegate:_mockHTTPInternalHandler];
}

- (void)testSendPOSTSuccess {
  NSURLComponents *URLComponent = [NSURLComponents componentsWithString:@"url"];
  NSData *data = [@"data" dataUsingEncoding:NSUTF8StringEncoding];
  OCMExpect([_mockHttpRequest sendPOST:URLComponent.URL
                              withData:data
                           withHeaders:@{@"Content-Type" : @"application/x-www-form-urlencoded"}
                               timeout:kChannelRequestDefaultTimeout])
      .ignoringNonObjectArgs;

  [_request sendPOST:URLComponent withData:@"data" chunkDecoded:YES];

  XCTAssertTrue(_request.POST);
  XCTAssertEqualObjects(_request.POSTData, data);
}

- (void)testSendPOSTBinarySuccess {
  NSURLComponents *URLComponent = [NSURLComponents componentsWithString:@"url"];
  NSData *data = [@"binaryData" dataUsingEncoding:NSUTF8StringEncoding];
  _request.isBinaryMessage = YES;

  OCMExpect([_mockHttpRequest
                   sendPOST:URLComponent.URL
                   withData:data
                withHeaders:@{@"Content-Type" : @"application/vnd.google.octet-stream-compressible"}
                    timeout:kChannelRequestDefaultTimeout])
      .ignoringNonObjectArgs;

  [_request sendPOST:URLComponent withPostData:data chunkDecoded:YES];

  XCTAssertTrue(_request.POST);
  XCTAssertEqualObjects(_request.POSTData, data);
  XCTAssertTrue(_request.isBinaryMessage);
  OCMVerifyAll((id)_mockHttpRequest);
}

- (void)testSendGETSuccess {
  NSURLComponents *URLComponent = [NSURLComponents componentsWithString:@"url"];
  OCMExpect([_mockHttpRequest sendGET:URLComponent.URL
                          withHeaders:@{}
                              timeout:kChannelRequestDefaultTimeout])
      .ignoringNonObjectArgs;

  [_request sendGET:URLComponent chunkDecoded:YES];
  XCTAssertFalse(_request.POST);
}

- (void)testDecodePOSTResponseChunkSuccess {
  OCMExpect([_mockHTTPInternalHandler didReceivedFirstByteOfRequest:_request
                                                       responseText:kFakePOSTResponse]);
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:@"[0,0,7]" withRequest:_request]);
  [_request decodeNextChunks:kFakePOSTResponse state:WCRequestReadyStateComplete];
}

- (void)testDecodeGETResponseChunkSuccess {
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:@"[[1,[\"noop\"]]]" withRequest:_request]);
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:@"[[2,[\"noop\"]]]" withRequest:_request]);
  OCMExpect([_mockHTTPInternalHandler didReceivedFirstByteOfRequest:_request
                                                       responseText:kFakeGETResponse]);

  [_request decodeNextChunks:kFakeGETResponse state:WCRequestReadyStateComplete];
}

- (void)testDecodeInvalidChunks {
  [_request decodeNextChunks:@"" state:WCRequestReadyStateComplete];
  XCTAssertFalse(_request.isSuccessful);
}

- (void)testDecodeInvalidChunksWithNegativeSize {
  // A corrupted stream where a wrong chunk size (10 instead of 5)
  // causes the parser to land on the negative number in the next JSON payload,
  // parsing it as a negative chunk size (but fails format validation).
  NSString *corruptedResponse = @"10\n12345\n12\n[-5,\"data\"]\n";
  [_request decodeNextChunks:corruptedResponse state:WCRequestReadyStateInteractive];
  XCTAssertFalse(_request.isSuccessful);
}

- (void)testDecodeNegativeChunkSize {
  // Directly tests the negative chunk size safety check.
  NSString *negativeSizeResponse = @"-5\n";
  [_request decodeNextChunks:negativeSizeResponse state:WCRequestReadyStateInteractive];
  XCTAssertFalse(_request.isSuccessful);
}
@end
