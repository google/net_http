#import <Foundation/Foundation.h>

#import "WCHTTPRequest.h"

@class GTMSessionFetcherService;

@interface WCDefaultHTTPRequest : NSObject <WCHTTPRequest>

- (instancetype)initWithStateChangeHandler:(id<WCRequestStateChangedHandler>)handler
                             dispatchQueue:(dispatch_queue_t)dispatchQueue
                            fetcherService:(nonnull GTMSessionFetcherService *)fetcherService;

@end
