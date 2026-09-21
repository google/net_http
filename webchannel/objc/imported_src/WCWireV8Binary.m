#import "WCWireV8Binary.h"

#import "WCQueuedMap.h"

@implementation WCWireV8Binary

+ (void)encodeMessage:(WCQueuedMap *)message
        relativeMapID:(int64_t)relativeMapID
               toData:(NSMutableData *)buffer {
  NSString *header =
      [NSString stringWithFormat:@"id=%lld&size=%d\r\n", relativeMapID, message.rawDataSize];
  [buffer appendData:[header dataUsingEncoding:NSUTF8StringEncoding]];
  id data = message.map[@"__data__"];
  if ([data isKindOfClass:[NSString class]]) {
    [buffer appendData:[(NSString *)data dataUsingEncoding:NSUTF8StringEncoding]];
  } else if ([data isKindOfClass:[NSData class]]) {
    [buffer appendData:(NSData *)data];
  }
}

+ (NSData *)encodeMessageQueue:(NSArray<WCQueuedMap *> *)messageQueue numOfMessages:(int)count {
  int64_t offset = -1;
  while (YES) {
    NSMutableData *buffer = [NSMutableData data];
    NSString *countStr = [NSString stringWithFormat:@"count=%d&", count];
    [buffer appendData:[countStr dataUsingEncoding:NSUTF8StringEncoding]];
    if (offset == -1) {
      if (count > 0) {
        offset = messageQueue[0].mapID;
        NSString *ofsStr = [NSString stringWithFormat:@"ofs=%lld", offset];
        [buffer appendData:[ofsStr dataUsingEncoding:NSUTF8StringEncoding]];
      } else {
        offset = 0;
      }
    } else {
      NSString *ofsStr = [NSString stringWithFormat:@"ofs=%lld", offset];
      [buffer appendData:[ofsStr dataUsingEncoding:NSUTF8StringEncoding]];
    }
    [buffer appendData:[@"\r\n" dataUsingEncoding:NSUTF8StringEncoding]];

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

+ (nullable NSArray<NSArray<id> *> *)decodeBinaryChunk:(NSData *)chunkData {
  if (!chunkData) {
    return nil;
  }
  NSMutableArray<NSArray<id> *> *envelopes = [NSMutableArray array];
  NSUInteger offset = 0;
  NSData *crlf = [NSData dataWithBytes:"\r\n" length:2];
  NSString *idPrefix = @"id=";
  NSString *sizePrefix = @"&size=";

  while (offset < chunkData.length) {
    NSRange crlfRange = [chunkData rangeOfData:crlf
                                       options:0
                                         range:NSMakeRange(offset, chunkData.length - offset)];
    if (crlfRange.location == NSNotFound) {
      return nil;
    }

    NSRange headerRange = NSMakeRange(offset, crlfRange.location - offset);
    NSData *headerData = [chunkData subdataWithRange:headerRange];
    NSString *headerString = [[NSString alloc] initWithData:headerData
                                                   encoding:NSUTF8StringEncoding];
    if (!headerString || ![headerString hasPrefix:idPrefix]) {
      return nil;
    }

    NSRange sizePrefixRange = [headerString rangeOfString:sizePrefix];
    if (sizePrefixRange.location == NSNotFound) {
      return nil;
    }

    NSString *idString =
        [headerString substringWithRange:NSMakeRange(idPrefix.length,
                                                     sizePrefixRange.location - idPrefix.length)];
    NSString *sizeString =
        [headerString substringFromIndex:sizePrefixRange.location + sizePrefixRange.length];

    NSScanner *idScanner = [NSScanner scannerWithString:idString];
    long long scannedMapID = 0;
    if (![idScanner scanLongLong:&scannedMapID] || ![idScanner isAtEnd]) {
      return nil;
    }
    int64_t mapID = (int64_t)scannedMapID;

    NSScanner *sizeScanner = [NSScanner scannerWithString:sizeString];
    long long scannedSize = 0;
    if (![sizeScanner scanLongLong:&scannedSize] || ![sizeScanner isAtEnd] || scannedSize < 0) {
      return nil;
    }
    int64_t size = (int64_t)scannedSize;

    offset = crlfRange.location + crlfRange.length;

    if (chunkData.length - offset < (NSUInteger)size) {
      return nil;
    }

    NSData *payloadData = [chunkData subdataWithRange:NSMakeRange(offset, (NSUInteger)size)];
    [envelopes addObject:@[ @(mapID), payloadData ]];

    offset += (NSUInteger)size;
  }

  return envelopes;
}

+ (BOOL)isBinaryChunk:(NSString *)chunkHeader sizePart:(NSString *_Nullable *_Nullable)sizePart {
  NSString *header = chunkHeader;
  if ([header hasSuffix:@"\r"]) {
    header = [header substringToIndex:header.length - 1];
  }
  NSRange semiRange = [header rangeOfString:@";"];
  if (semiRange.location == NSNotFound) {
    if (sizePart) {
      *sizePart = header;
    }
    return NO;
  }
  if (sizePart) {
    NSString *rawSizePart = [header substringToIndex:semiRange.location];
    if ([rawSizePart hasSuffix:@"\r"]) {
      rawSizePart = [rawSizePart substringToIndex:rawSizePart.length - 1];
    }
    *sizePart = rawSizePart;
  }
  NSString *extensionPart = [header substringFromIndex:semiRange.location + 1];
  return [extensionPart isEqualToString:@"data=binary"];
}

@end
