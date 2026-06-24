#import <Foundation/Foundation.h>

#import "WCChannelRequest.h"
#import "WCSupport.h"

@interface WCFailureRecoveryContext : NSObject

@property(nonatomic) WCChannelRequestError error;
@property(nonatomic) int64_t attempt;
@property(nonatomic) WCChannelType channelType;

@end
