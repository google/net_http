#import <Foundation/Foundation.h>

#import "Support/WCHTTPRequest.h"
#import "WCTimer.h"

@protocol WCURLEncoder;
@protocol WCLogger;
@protocol WCHTTPRequest;
@protocol WCJSONDecoder;
@protocol WCRequestStateChangedHandler;
@class GTMSessionFetcherService;
@class WCFailureRecoveryContext;

typedef NS_ENUM(NSInteger, WCChannelType) { WCChannelTypeForwardChannel, WCChannelTypeBackChannel };

typedef NS_ENUM(NSInteger, WCServerReachability) {
  WCServerReachabilityRequestMade,
  WCServerReachabilitySucceed,
  WCServerReachabilityFailed,
  WCServerReachabilityBackChannelActivity
};

/** The protocol for HTTPRequest, Debugger, Encoder/decoder, etc. */
@protocol WCSupport

@property(nonatomic, readonly) id<WCURLEncoder> URLEncoder;
@property(nonatomic, readonly) id<WCLogger> logger;
@property(nonatomic, readonly) id<WCJSONDecoder> JSONDecoder;
@property(nonatomic, readonly) dispatch_queue_t dispatchQueue;

- (id<WCHTTPRequest>)HTTPRequest:(id<WCRequestStateChangedHandler>)handler;

- (void)notifyStatEvent:(WCRequestStat)event;

- (void)notifyServerReachabilityEvent:(WCServerReachability)event;

- (void)notifyTimingEventWithSize:(int)size withRTT:(NSTimeInterval)RTT withRetries:(int)retries;

/** Reports the round trip time of the handshake request to establish the channel. */
- (void)notifyHandshakeTimingEventWithRtt:(NSTimeInterval)rtt;

- (id<WCTimer>)setTimeout:(NSTimeInterval)timeout block:(void (^)())block;

/**
 * Schedules a block to be executed after a specified timeout, passing failure recovery context.
 *
 * @param timeout The timeout duration in seconds.
 * @param block The block to execute when the timer fires.
 * @param context Context information for failure recovery (aligned with Java).
 * @return An opaque token representing the scheduled timer.
 */
- (id<WCTimer>)setTimeout:(NSTimeInterval)timeout
                    block:(void (^)())block
                  context:(nonnull WCFailureRecoveryContext *)context;

/**
 * Clears/cancels a scheduled timer.
 *
 * @param timer The timer token returned by setTimeout:block: to clear.
 */
- (void)clearTimeout:(id<WCTimer>)timer;

@end
