#import "WCQueuedMap.h"

@implementation WCQueuedMap

- (instancetype)initWithMapID:(int)ID
                          map:(NSDictionary<NSString *, id> *)map
                      context:(NSObject *)context {
  self = [super init];
  if (self) {
    _mapID = ID;
    _map = map;
    _context = context;
    id data = map[@"__data__"];
    if ([data isKindOfClass:[NSString class]]) {
      _rawDataSize = (int)[(NSString *)data lengthOfBytesUsingEncoding:NSUTF8StringEncoding];
    } else if ([data isKindOfClass:[NSData class]]) {
      _rawDataSize = (int)[(NSData *)data length];
    } else {
      _rawDataSize = 0;
    }
  }
  return self;
}

@end
