#import "WCNetUtils.h"

#import "WCHTTPRequest.h"
#import "WCLogger.h"
#import "WCSupport.h"
#import "WCTimer.h"

/** How long the network test waits for its request, in seconds. */
static const NSTimeInterval kNetworkTimeout = 10;

@implementation WCNetUtils {
  __weak id<WCTestNetworkCallback> _callback;
  id<WCSupport> _support;
  /**
   * Kept until a result comes in, so that the response can be read. The request keeps this object
   * as its handler, so it is released then to break the cycle.
   */
  id<WCHTTPRequest> _request;
  id<WCTimer> _watchdogTimer;
  BOOL _testNetworkResultCalled;
}

- (instancetype)initWithCallback:(id<WCTestNetworkCallback>)callback
                         support:(id<WCSupport>)support {
  self = [super init];
  if (self) {
    _callback = callback;
    _support = support;
  }
  return self;
}

- (void)testNetwork:(NSURL *)URL {
  _request = [_support HTTPRequest:self];

  __weak __typeof__(self) weakSelf = self;
  _watchdogTimer = [_support setTimeout:kNetworkTimeout
                                  block:^{
                                    [weakSelf onTimeout];
                                  }];

  [_request sendGET:URL withHeaders:nil timeout:kNetworkTimeout];
}

#pragma mark - WCRequestStateChangedHandler

- (void)stateChangedForRequest:(id<WCHTTPRequest>)request responseData:(NSData *)data {
  WCRequestReadyState readyState = request.requestReadyState;
  WCRequestErrorCode errorCode = request.requestErrorCode;

  if (readyState != WCRequestReadyStateComplete) {
    return;
  }

  if (errorCode == WCRequestErrorCodeTimeout) {
    [self onTestNetworkResultWithDebugMessage:@"TestPingServer: timeout" result:NO];
    return;
  }

  int statusCode = request.status;
  if (statusCode >= 200 && statusCode < 300) {
    [self onTestNetworkResultWithDebugMessage:@"TestPingServer: ok" result:YES];
  } else {
    [self onTestNetworkResultWithDebugMessage:
              [NSString stringWithFormat:@"TestPingServer: server error (%d)", statusCode]
                                       result:NO];
  }
}

#pragma mark - Private

- (void)onTimeout {
  [self onTestNetworkResultWithDebugMessage:@"TestPingServer: timeout (timer)" result:NO];
}

- (void)onTestNetworkResultWithDebugMessage:(NSString *)debugMessage result:(BOOL)result {
  _request = nil;
  if (_testNetworkResultCalled) {
    return;
  }
  _testNetworkResultCalled = YES;

  [_support.logger logInfo:debugMessage];
  [_callback onTestNetworkResult:result];
}

@end
