#import <Foundation/Foundation.h>

#import "WCRuntimeProperties.h"

@class WCWebChannelClientInternal;

@interface WCRuntimeProperties (Private)

/**
 * @param channel The channel client.
 */
- (instancetype)initWithChannel:(WCWebChannelClientInternal *)channel;

@end
