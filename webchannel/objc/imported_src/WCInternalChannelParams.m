#import "WCInternalChannelParams.h"

#import "WCWebChannelClientInternal.h"

@implementation WCInternalChannelParams
- (instancetype)init {
  self = [super init];
  if (self) {
    _failFast = NO;
    _baseRetryDelay = kWCDefaultBaseRetryDelay;
    _retryDelaySeed = kWCDefaultRetryDelaySeed;
    _forwardChannelMaxRetries = kWCDefaultForwardChannelMaxRetries;
    _forwardChannelRequestTimeout = kWCDefaultForwardChannelRequestTimeout;
  }
  return self;
}

@end
