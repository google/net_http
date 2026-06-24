#import "WCForwardChannelRequestPool.h"

#import "WCChannelRequest.h"
#import "WCQueuedMap.h"

static const int kWCMaxPoolSize = 10;

@implementation WCForwardChannelRequestPool

@synthesize pendingMessages = _pendingMessages;

- (instancetype)initWithMaxPoolSize:(int)size {
  self = [super init];
  if (self) {
    _maxSize = (size > 0) ? size : kWCMaxPoolSize;
    _requestPool = [NSMutableSet set];
    _pendingMessages = [NSMutableArray array];
  }
  return self;
}

- (BOOL)isFull {
  if (_requestPool != nil) {
    return _requestPool.count >= _maxSize;
  }
  return NO;
}

- (void)addRequest:(WCChannelRequest *)request {
  if (_requestPool != nil) {
    [_requestPool addObject:request];
  }
}

- (BOOL)hasRequest:(WCChannelRequest *)request {
  if (_requestPool != nil) {
    return [_requestPool containsObject:request];
  }
  return NO;
}

- (BOOL)removeRequest:(WCChannelRequest *)request {
  if ([_requestPool containsObject:request]) {
    [_requestPool removeObject:request];
    return YES;
  }
  return NO;
}

- (void)addPendingMessages:(NSMutableArray<WCQueuedMap *> *)pendingMessages {
  [_pendingMessages addObjectsFromArray:pendingMessages];
}

- (NSMutableArray<WCQueuedMap *> *)pendingMessages {
  NSMutableArray<WCQueuedMap *> *result = [NSMutableArray arrayWithArray:_pendingMessages];
    for (WCChannelRequest *request in _requestPool) {
      [result addObjectsFromArray:request.pendingMessages];
    }
  return result;
}

- (void)clearPendingMessages {
  [_pendingMessages removeAllObjects];
}

- (int)requestCount {
  if (_requestPool != nil) {
    return _requestPool.count;
  }
  return 0;
}

- (void)applyClientProtocol:(NSString *)clientProtocol {
  // no-op
}

- (void)cancel {
    for (WCChannelRequest *request in _requestPool) {
      [request cancel];
    }
    [_requestPool removeAllObjects];
}

@end
