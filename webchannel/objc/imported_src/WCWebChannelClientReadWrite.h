#import <Foundation/Foundation.h>

@class WCRuntimeProperties;

typedef NS_ENUM(NSInteger, WCWebChannelClientState);

/** Public accessible properties of the dispatchable WebChannel client. */
@protocol WCWebChannelClientReadWrite <NSObject>

/**
 * This value will also be modified internally, so when users use it they have to read the params,
 * aka making a copy before writing it.
 */
@property(copy) NSDictionary<NSString *, NSString *> *messageUrlParams;
@property(readonly) WCRuntimeProperties *runtimeProperties;

@end
