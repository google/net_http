#import "WCDefaultURLEncoder.h"

@implementation WCDefaultURLEncoder

- (NSString *)encode:(NSString *)data {
  return [data
      stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet alphanumericCharacterSet]];
}

@end
