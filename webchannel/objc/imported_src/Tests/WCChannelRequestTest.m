#import "WCHTTPRequest.h"
#import "WCChannelRequest.h"

#import <XCTest/XCTest.h>

#import "WCSupport.h"
#import "WCTimer.h"
#import "WCWebChannelClientInternal.h"
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

  OCMExpect([_mockHttpRequest sendPOST:URLComponent.URL
                              withData:data
                           withHeaders:@{@"Content-Type" : @"application/octet-stream"}
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
  NSData *expectedInput = [@"[0,0,7]" dataUsingEncoding:NSUTF8StringEncoding];
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:expectedInput
                                             isBinary:NO
                                          withRequest:_request]);
  [_request decodeNextChunks:[kFakePOSTResponse dataUsingEncoding:NSUTF8StringEncoding]
                       state:WCRequestReadyStateComplete];
}

- (void)testDecodeGETResponseChunkSuccess {
  NSData *expectedInput1 = [@"[[1,[\"noop\"]]]" dataUsingEncoding:NSUTF8StringEncoding];
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:expectedInput1
                                             isBinary:NO
                                          withRequest:_request]);
  NSData *expectedInput2 = [@"[[2,[\"noop\"]]]" dataUsingEncoding:NSUTF8StringEncoding];
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:expectedInput2
                                             isBinary:NO
                                          withRequest:_request]);
  OCMExpect([_mockHTTPInternalHandler didReceivedFirstByteOfRequest:_request
                                                       responseText:kFakeGETResponse]);

  [_request decodeNextChunks:[kFakeGETResponse dataUsingEncoding:NSUTF8StringEncoding]
                       state:WCRequestReadyStateComplete];
}

- (void)testDecodeInvalidChunks {
  [_request decodeNextChunks:[NSData data] state:WCRequestReadyStateComplete];
  XCTAssertFalse(_request.isSuccessful);
}

- (void)testDecodeInvalidChunksWithNegativeSize {
  // A corrupted stream where a wrong chunk size (10 instead of 5)
  // causes the parser to land on the negative number in the next JSON payload,
  // parsing it as a negative chunk size (but fails format validation).
  NSString *corruptedResponse = @"10\n12345\n12\n[-5,\"data\"]\n";
  [_request decodeNextChunks:[corruptedResponse dataUsingEncoding:NSUTF8StringEncoding]
                       state:WCRequestReadyStateInteractive];
  XCTAssertFalse(_request.isSuccessful);
}

- (void)testDecodeNegativeChunkSize {
  // Directly tests the negative chunk size safety check.
  NSString *negativeSizeResponse = @"-5\n";
  [_request decodeNextChunks:[negativeSizeResponse dataUsingEncoding:NSUTF8StringEncoding]
                       state:WCRequestReadyStateInteractive];
  XCTAssertFalse(_request.isSuccessful);
}

- (void)testDecodeIncompleteChunkWithMissingNewlineDoesNotCrash {
  // Regression test: a streamed response where a valid chunk is
  // followed by a trailing size-prefix line that has no terminating '\n' yet.
  // rangeOfString: returns NSNotFound (NSUIntegerMax) for the missing newline;
  // truncating that value into an `int` used to defeat the `== NSNotFound` guard,
  // producing an out-of-bounds substringWithRange: and an NSRangeException.
  // With NSUInteger indices the guard holds and the parser reports Incomplete.
  NSData *expectedInput = [@"[0,0,7]" dataUsingEncoding:NSUTF8StringEncoding];
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:expectedInput
                                             isBinary:NO
                                          withRequest:_request]);
  NSString *incompleteResponse = @"7\n[0,0,7]5";
  XCTAssertNoThrow([_request
      decodeNextChunks:[incompleteResponse dataUsingEncoding:NSUTF8StringEncoding]
                 state:WCRequestReadyStateInteractive]);
  // The complete leading chunk is still delivered; the dangling size prefix is
  // treated as incomplete data and simply skipped (no NSRangeException).
  OCMVerifyAll((id)_mockHTTPInternalHandler);
}

// Verify UTF-16 chunk length framing with Unicode surrogate pair characters (e.g. 4 bytes in UTF-8
// but 2 UTF-16 code units).
- (void)testDecodeChunkWithUnicode {
  NSString *response = @"4\n😀ok";
  OCMExpect([_mockHTTPInternalHandler didReceivedFirstByteOfRequest:_request
                                                       responseText:response]);
  NSData *expectedInput = [@"😀ok" dataUsingEncoding:NSUTF8StringEncoding];
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:expectedInput
                                             isBinary:NO
                                          withRequest:_request]);

  [_request decodeNextChunks:[response dataUsingEncoding:NSUTF8StringEncoding]
                       state:WCRequestReadyStateComplete];
  OCMVerifyAll((id)_mockHTTPInternalHandler);
}

- (void)testDecodeIncompleteUnicodeChunk {
  // UTF-16 count of 2 code units for 😀 (4 bytes in UTF-8: F0 9F 98 80).
  // Provide only first 3 bytes so the character is truncated at buffer boundary.
  const uint8_t rawBytes[] = {'2', '\n', 0xF0, 0x9F, 0x98};
  NSData *incompleteData = [NSData dataWithBytes:rawBytes length:5];

  [_request decodeNextChunks:incompleteData state:WCRequestReadyStateInteractive];
  // Since chunk is incomplete, didReceiveInput should not be called yet.
  OCMVerifyAll((id)_mockHTTPInternalHandler);
}

- (void)testDecodeBinaryChunk {
  const char rawPayload[] = {'f', 'o',        'o',  0x00, 'b',  'a',
                             'r', (char)0xFF, 0x01, 0x02, 0x03, 0x04};
  NSData *payloadData = [NSData dataWithBytes:rawPayload length:12];

  NSMutableData *responseData = [NSMutableData data];
  [responseData appendData:[@"12;data=binary\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [responseData appendData:payloadData];

  OCMExpect([_mockHTTPInternalHandler didReceiveInput:payloadData
                                             isBinary:YES
                                          withRequest:_request]);
  [_request decodeNextChunks:responseData state:WCRequestReadyStateComplete];
  OCMVerifyAll((id)_mockHTTPInternalHandler);
}

- (void)testDecodeBinaryChunkWithCRLF {
  const char rawPayload[] = {0x00, 0x01, 0x02, 0x03};
  NSData *payloadData = [NSData dataWithBytes:rawPayload length:4];

  NSMutableData *responseData = [NSMutableData data];
  [responseData appendData:[@"4;data=binary\r\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [responseData appendData:payloadData];

  OCMExpect([_mockHTTPInternalHandler didReceiveInput:payloadData
                                             isBinary:YES
                                          withRequest:_request]);
  [_request decodeNextChunks:responseData state:WCRequestReadyStateComplete];
  OCMVerifyAll((id)_mockHTTPInternalHandler);
}

- (void)testDecodeInterleavedTextAndBinaryChunks {
  NSData *textPayload = [@"{\"msg\":\"text\"}" dataUsingEncoding:NSUTF8StringEncoding];
  const char rawBinary[] = {0x00, (char)0xFF, 0x7F};
  NSData *binaryPayload = [NSData dataWithBytes:rawBinary length:3];

  NSMutableData *responseData = [NSMutableData data];
  [responseData appendData:[[NSString stringWithFormat:@"%lu\n", (unsigned long)textPayload.length]
                               dataUsingEncoding:NSUTF8StringEncoding]];
  [responseData appendData:textPayload];
  [responseData appendData:[@"3;data=binary\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [responseData appendData:binaryPayload];

  OCMExpect([_mockHTTPInternalHandler didReceiveInput:textPayload
                                             isBinary:NO
                                          withRequest:_request]);
  OCMExpect([_mockHTTPInternalHandler didReceiveInput:binaryPayload
                                             isBinary:YES
                                          withRequest:_request]);

  [_request decodeNextChunks:responseData state:WCRequestReadyStateComplete];
  OCMVerifyAll((id)_mockHTTPInternalHandler);
}

- (void)testDecodeIncompleteBinaryChunk {
  const char rawPayload[] = {0x01, 0x02};
  NSData *partialData = [NSData dataWithBytes:rawPayload length:2];

  NSMutableData *responseData = [NSMutableData data];
  [responseData appendData:[@"10;data=binary\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [responseData appendData:partialData];

  [_request decodeNextChunks:responseData state:WCRequestReadyStateInteractive];
  // Since chunk is incomplete, didReceiveInput should not be called yet.
  OCMVerifyAll((id)_mockHTTPInternalHandler);
}

- (void)testDecodeTextChunkWithNonBinaryExtension {
  NSData *textPayload = [@"test" dataUsingEncoding:NSUTF8StringEncoding];

  NSMutableData *responseData = [NSMutableData data];
  [responseData appendData:[@"4;other=extension\n" dataUsingEncoding:NSUTF8StringEncoding]];
  [responseData appendData:textPayload];

  OCMExpect([_mockHTTPInternalHandler didReceiveInput:textPayload
                                             isBinary:NO
                                          withRequest:_request]);

  [_request decodeNextChunks:responseData state:WCRequestReadyStateComplete];
  OCMVerifyAll((id)_mockHTTPInternalHandler);
}

@end
