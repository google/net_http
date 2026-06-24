#import <Foundation/Foundation.h>

@class WCChannelRequest;
@class WCQueuedMap;

/** A pool streaming all pending forward channel requests. */
@interface WCForwardChannelRequestPool : NSObject

@property(nonatomic, readonly) int maxSize;
@property(nonatomic, readonly, getter=isFull) BOOL full;
@property(nonatomic, readonly) int requestCount;
@property(nonatomic, readonly) NSMutableArray<WCQueuedMap *> *pendingMessages;
@property(nonatomic, readonly) NSMutableSet<WCChannelRequest *> *requestPool;

/**
 * @param size The max number of requests the pool can have.
 */
- (instancetype)initWithMaxPoolSize:(int)size;

/*
 * Add a request to the pool.
 *
 * @param request The request to be added.
 */
- (void)addRequest:(WCChannelRequest *)request;

/*
 * Check if a request exist in the pool.
 *
 * @param request The request to be checked.
 */
- (BOOL)hasRequest:(WCChannelRequest *)request;

/**
 * Remove a request from the pool.
 *
 * @param request The request to be removed.
 */
- (BOOL)removeRequest:(WCChannelRequest *)request;

/**
 * Add more pending messages to the pool's pending messages.
 *
 * @param pendingMessages The messages to be added.
 */
- (void)addPendingMessages:(NSMutableArray<WCQueuedMap *> *)pendingMessages;

/** Clear all the pending messages in the pool. */
- (void)clearPendingMessages;

/**
 * Once we know the client protocol (from the handshake), check if we need
 * enable the request pool accordingly. This is more robust than using
 * browser-internal APIs (specific to Chrome).
 *
 * @param clientProtocol The client protocol.
 */
- (void)applyClientProtocol:(NSString *)clientProtocol;

/** Clears the pool and cancel all the pending requests. */
- (void)cancel;

@end
