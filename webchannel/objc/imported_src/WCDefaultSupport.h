#import <Foundation/Foundation.h>

#import "WCSupport.h"

@class GTMSessionFetcherService;

@interface WCDefaultSupport : NSObject <WCSupport>

/** Transport metrics for requests created by this support instance. */
@property(nonatomic, copy, nullable) void (^taskMetricsHandler)(NSURLSessionTaskMetrics *metrics);

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
