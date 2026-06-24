#import "WCDefaultJSONDecoder.h"

@implementation WCDefaultJSONDecoder

- (NSArray *)decodeData:(NSString *)data maxDepth:(int)maxDepth {
  // TODO(eryu): Refactor to avoid inefficient NSData->NSString->NSData conversion.
  // WCChannelRequest converts network response from NSData to NSString before
  // calling its delegate's -didReceiveInput:withRequest: method. The input
  // eventually reaches this method as NSString, which is converted back to
  // NSData because the underlying JSON parser (NSJSONSerialization) requires
  // NSData. This data path should be optimized to pass NSData directly to
  // eliminate the redundant conversions.
  NSData *encodingData = [data dataUsingEncoding:NSUTF8StringEncoding];
  NSArray<id> *JSONArray = [NSJSONSerialization JSONObjectWithData:encodingData options:0 error:nil];
  return JSONArray;
}

@end
