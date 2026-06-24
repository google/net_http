#import "WCFakeHTTPRequest.h"

#import "WCHTTPRequest.h"

@implementation WCFakeHTTPRequest

@synthesize requestReadyStateChangeHandler = _requestReadyStateChangeHandler;
@synthesize requestReadyState = _requestReadyState;
@synthesize requestErrorCode = _requestErrorCode;

- (NSString *)responseHeaderForName:(NSString *)name {
  return @"";
}

- (int)status {
  return 200;
}

- (void)sendPOST:(NSURL *)URL
        withData:(nullable NSData *)postData
     withHeaders:(nullable NSDictionary<NSString *, NSString *> *)headers
         timeout:(NSTimeInterval)timeout{
  [_requestReadyStateChangeHandler stateChangedForRequest:self responseData:nil];
}

- (void)sendGET:(NSURL *)URL withHeaders:(nullable NSDictionary<NSString *, NSString *> *)headers timeout:(NSTimeInterval)timeout {
  [_requestReadyStateChangeHandler stateChangedForRequest:self responseData:nil];
}

- (void)abort {
}

@end
