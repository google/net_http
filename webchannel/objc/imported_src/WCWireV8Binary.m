#import "WCWireV8Binary.h"

#import "WCQueuedMap.h"
#import "WCSupport.h"

@implementation WCWireV8Binary {
  id<WCSupport> _support;
}

- (instancetype)initWithSupport:(id<WCSupport>)support {
  self = [super init];
  if (self) {
    _support = support;
  }
  return self;
}

- (NSData *)encodeMessageQueue:(NSArray<WCQueuedMap *> *)messageQueue numOfMessages:(int)count {
  int64_t offset = -1;
  while (YES) {
    NSMutableData *buffer = [NSMutableData data];
    [self appendString:[NSString stringWithFormat:@"count=%d&", count] toData:buffer];
    if (offset == -1) {
      if (count > 0) {
        offset = messageQueue[0].mapID;
        [self appendString:[NSString stringWithFormat:@"ofs=%lld", offset] toData:buffer];
      } else {
        offset = 0;
      }
    } else {
      [self appendString:[NSString stringWithFormat:@"ofs=%lld", offset] toData:buffer];
    }
    [self appendString:@"\r\n" toData:buffer];

    BOOL done = YES;
    for (int i = 0; i < count; i++) {
      int64_t mapID = messageQueue[i].mapID;
      mapID -= offset;
      if (mapID < 0) {
        offset = MAX(0, messageQueue[i].mapID - 100);
        done = NO;
        continue;
      }
      [self encodeMessage:messageQueue[i] relativeMapID:mapID toData:buffer];
    }

    if (done) {
      return buffer;
    }
  }
}

- (void)encodeMessage:(WCQueuedMap *)message
        relativeMapID:(int64_t)relativeMapID
               toData:(NSMutableData *)buffer {
  [self appendString:[NSString stringWithFormat:@"id=%lld&size=%d\r\n", relativeMapID,
                                                message.rawDataSize]
              toData:buffer];
  id data = message.map[@"__data__"];
  if ([data isKindOfClass:[NSString class]]) {
    [self appendString:(NSString *)data toData:buffer];
  } else if ([data isKindOfClass:[NSData class]]) {
    [buffer appendData:(NSData *)data];
  }
}

- (void)appendString:(NSString *)string toData:(NSMutableData *)data {
  [data appendData:[string dataUsingEncoding:NSUTF8StringEncoding]];
}

@end
