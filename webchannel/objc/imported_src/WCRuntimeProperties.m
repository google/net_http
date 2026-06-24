#import "WCRuntimeProperties.h"

#import "WCQueuedMap.h"
#import "WCWebChannelClientInternal.h"

@interface WCRuntimeProperties ()
@end

@implementation WCRuntimeProperties {
  __weak WCWebChannelClientInternal *_channel;
}

- (instancetype)initWithChannel:(WCWebChannelClientInternal *)channel {
  self = [super init];
  if (self) {
    _channel = channel;
  }
  return self;
}

- (int)lastStatusCode {
  return _channel.lastStatusCode;
}

- (NSArray<NSString *> *)nonAckedMessages {
  NSMutableArray<NSString*> *nonAckedMessages = [@[] mutableCopy];
  for (WCQueuedMap *nonAckedMap in _channel.nonAckedMaps) {
    NSDictionary<NSString *, NSString *> *messageMap = nonAckedMap.map;
    [nonAckedMessages addObject:messageMap[kRawDataKey]];
  }
  return nonAckedMessages;
}

- (void)commit:(WCAckCommitCallbackBlock)ackCommitCallbackBlock {
  _channel.forwardChannelFlushedCallback = ackCommitCallbackBlock;
}


@end
