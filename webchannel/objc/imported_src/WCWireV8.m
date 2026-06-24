#import "WCWireV8.h"

#import "WCJSONDecoder.h"
#import "WCURLEncoder.h"
#import "WCQueuedMap.h"
#import "WCSupport.h"

@implementation WCWireV8 {
  id<WCSupport> _support;
}

- (instancetype)initWithSupport:(id<WCSupport>)support {
  self = [super init];
  if (self) {
    _support = support;
  }
  return self;
}

- (void)encodeMessage:(NSDictionary<NSString *, NSString *> *)message
               buffer:(NSMutableArray<NSString *> *)buffer
               prefix:(NSString *)prefix {
  NSString *prefixField = prefix ?: @"";
  for (NSString *key in message.allKeys) {
    [buffer addObject:[NSString stringWithFormat:@"%@%@=%@", prefixField, key,
                                                 [_support.URLEncoder encode:message[key]]]];
  }
}

- (NSString *)encodeMessageQueue:(NSMutableArray<WCQueuedMap *> *)messageQueue numOfMessages:(int)count {
  long offset = -1;
  while (YES) {
    NSMutableArray<NSString *> *buffer = [NSMutableArray array];
    [buffer addObject:[NSString stringWithFormat:@"count=%d", count]];
    if (offset == -1) {
      if (count > 0) {
        offset = messageQueue[0].mapID;
        [self addOffsetToBuffer:buffer offset:offset];
      } else {
        offset = 0;
      }
    } else {
      [self addOffsetToBuffer:buffer offset:offset];
    }

    BOOL done = YES;
    for (int i = 0; i < count; i++) {
      long mapID = messageQueue[i].mapID - offset;
      NSDictionary<NSString *, NSString *> *map = messageQueue[i].map;
      if (mapID < 0) {
        // redo the encoding in case of retry/reordering and add extra space.
        // This MAX is critical to make sure exit while(YES) loop.
        offset = MAX(0, messageQueue[i].mapID - 100);
        done = NO;
        continue;
      }
      [self encodeMessage:map buffer:buffer prefix:[NSString stringWithFormat:@"req%ld_", mapID]];
    }

    if (done) {
      return [buffer componentsJoinedByString:@"&"];
    }
  }
}

- (NSArray *)decodeMessage:(NSData *)message level:(int)level {
  return [_support.JSONDecoder decodeData:message maxDepth:level];
}

- (void)addOffsetToBuffer:(NSMutableArray<NSString *> *)buffer offset:(long)offset {
  [buffer addObject:[NSString stringWithFormat:@"ofs=%ld", offset]];
}

@end
