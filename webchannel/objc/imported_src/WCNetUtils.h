#import <Foundation/Foundation.h>

#import "WCHTTPRequest.h"

@protocol WCSupport;

NS_ASSUME_NONNULL_BEGIN

/** Receives the result of -[WCNetUtils testNetwork:]. */
@protocol WCTestNetworkCallback <NSObject>

/**
 * @param result YES if the network test request completed with a 2xx status, NO if it failed or
 *     timed out.
 */
- (void)onTestNetworkResult:(BOOL)result;

@end

/**
 * Sends a network test request to tell whether a failed request is a server error or a network
 * error. Ports the C++ client's NetUtils (net_utils.h).
 *
 * Not thread-safe. Each instance can perform only one test.
 */
@interface WCNetUtils : NSObject <WCRequestStateChangedHandler>

/**
 * @param callback Receives the result. Not retained.
 * @param support Creates the request and the timer.
 */
- (instancetype)initWithCallback:(id<WCTestNetworkCallback>)callback
                         support:(id<WCSupport>)support NS_DESIGNATED_INITIALIZER;

- (instancetype)init NS_UNAVAILABLE;

/**
 * Sends a GET request to @c URL, and reports YES to the callback if it completes with a 2xx status
 * within 10 seconds, or NO otherwise. May be called only once per instance.
 */
- (void)testNetwork:(nullable NSURL *)URL;

@end

NS_ASSUME_NONNULL_END
