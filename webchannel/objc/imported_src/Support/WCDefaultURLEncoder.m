#import "WCDefaultURLEncoder.h"

#import "WCURIBuilder.h"

@implementation WCDefaultURLEncoder

- (NSString *)encode:(NSString *)data {
  return WCEncodeURIComponent(data);
}

@end
