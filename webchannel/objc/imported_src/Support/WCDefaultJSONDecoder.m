#import "WCDefaultJSONDecoder.h"

@implementation WCDefaultJSONDecoder

- (nullable NSArray<id> *)decodeData:(NSData *)data maxDepth:(int)maxDepth {
  if (!data) {
    return nil;
  }
  NSData *jsonData = nil;
  if ([data isKindOfClass:[NSData class]]) {
    jsonData = data;
  } else if ([data isKindOfClass:[NSString class]]) {
    jsonData = [(NSString *)data dataUsingEncoding:NSUTF8StringEncoding];
  }
  if (!jsonData) {
    return nil;
  }
  NSArray<id> *JSONArray = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:nil];
  return JSONArray;
}

@end
