#import <Foundation/Foundation.h>

#import "WCHTTPRequest.h"

@interface WCFakeHTTPRequest : NSObject <WCHTTPRequest>

@property(nonatomic, copy, nullable) NSDictionary<NSString *, NSString *> *fakeResponseHeaders;

@end
