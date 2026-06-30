#import <Foundation/Foundation.h>

#import "WCSupport.h"

@class GTMSessionFetcherService;

@interface WCDefaultSupport : NSObject <WCSupport>

- (instancetype)init;

/**
 * @param fetcherService The fetcher service to use for network requests.
 */
- (instancetype)initWithFetcherService:(nonnull GTMSessionFetcherService *)fetcherService;

/**
 * @param dispatchQueue A dedicated dispatch queue where webchannel logic is run on.
 * @param fetcherService The fetcher service to use for network requests.
 */
- (instancetype)initWithDispatchQueue:(dispatch_queue_t)dispatchQueue
                       fetcherService:(nonnull GTMSessionFetcherService *)fetcherService
    NS_DESIGNATED_INITIALIZER;

@end
