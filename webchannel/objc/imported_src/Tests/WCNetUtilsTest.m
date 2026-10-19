#import "WCHTTPRequest.h"
#import "WCNetUtils.h"
#import "WCSupport.h"

#import <XCTest/XCTest.h>

#import <OCMock/OCMock.h>

/** Ports the C++ client's net_utils_test.cc. */
@interface WCNetUtilsTest : XCTestCase
@end

@implementation WCNetUtilsTest {
  id _mockSupport;
  id _mockTestNetworkCallback;
  WCNetUtils *_netUtils;
}

- (void)setUp {
  [super setUp];
  _mockSupport = OCMProtocolMock(@protocol(WCSupport));
  _mockTestNetworkCallback = OCMStrictProtocolMock(@protocol(WCTestNetworkCallback));
  _netUtils = [[WCNetUtils alloc] initWithCallback:_mockTestNetworkCallback support:_mockSupport];
}

- (void)testTestNetwork {
  id mockHTTPRequest = OCMProtocolMock(@protocol(WCHTTPRequest));
  OCMExpect([mockHTTPRequest sendGET:OCMOCK_ANY withHeaders:OCMOCK_ANY timeout:0])
      .ignoringNonObjectArgs();
  OCMExpect([_mockSupport HTTPRequest:OCMOCK_ANY]).andReturn(mockHTTPRequest);

  [_netUtils testNetwork:nil];

  OCMVerifyAll(mockHTTPRequest);
  OCMVerifyAll(_mockSupport);
}

- (void)testOnReadyStateChangeEventSuccess {
  id mockHTTPRequest = OCMProtocolMock(@protocol(WCHTTPRequest));
  OCMStub([mockHTTPRequest requestReadyState]).andReturn(WCRequestReadyStateComplete);
  OCMStub([mockHTTPRequest requestErrorCode]).andReturn(WCRequestErrorCodeNoError);
  OCMStub([mockHTTPRequest status]).andReturn(200);
  OCMExpect([_mockTestNetworkCallback onTestNetworkResult:YES]);

  [_netUtils stateChangedForRequest:mockHTTPRequest responseData:nil];

  OCMVerifyAll(_mockTestNetworkCallback);
}

- (void)testOnReadyStateChangeEventError {
  id mockHTTPRequest = OCMProtocolMock(@protocol(WCHTTPRequest));
  OCMStub([mockHTTPRequest requestReadyState]).andReturn(WCRequestReadyStateComplete);
  OCMStub([mockHTTPRequest requestErrorCode]).andReturn(WCRequestErrorCodeHTTPError);
  OCMStub([mockHTTPRequest status]).andReturn(500);
  OCMExpect([_mockTestNetworkCallback onTestNetworkResult:NO]);

  [_netUtils stateChangedForRequest:mockHTTPRequest responseData:nil];

  OCMVerifyAll(_mockTestNetworkCallback);
}

@end
