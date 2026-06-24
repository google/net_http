#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * WCDispatcher is an object wrapper forwarding all method invocations to a target object on the
 * specified queue via dispatch_async. This has two benefits:
 *    1. Creates a layer of abstraction for hiding the underlying async dispatch details and
 *       object's interface identity.
 *    2. Ensures all method calls to an object occurs on a specific queue.
 */
@interface WCDispatcher : NSProxy

/**
 * Convenient function to create an instance of WCDispatcher that strongly retain the given
 * target.
 *
 * @param target Target object that the dispatcher will forward method invocation to. Strongly
 *    held by the dispatcher.
 * @param protocol Protocol to which the target object conforms.
 * @param dispatchQueue Dispatch queue where all method invocations will be dispatched onto.
 * @return An instance of WCDispatcher conforming to the specified protocol.
 */
+ (id)strongDispatcherWithTarget:(id)target
                        protocol:(Protocol *)protocol
                   dispatchQueue:(dispatch_queue_t)dispatchQueue;

- (instancetype)init NS_UNAVAILABLE;

/**
 * Creates and returns an instance of WCDispatcher.
 *
 * @param target Target object that the dispatcher will forward method invocation to.
 * @param protocol Protocol to which the target object conforms.
 * @param dispatchQueue Dispatch queue where all method invocations will be dispatched onto.
 * @return An instance of WCDispatcher conforming to the specified protocol.
 */
- (instancetype)initWithTarget:(id)target
                      protocol:(Protocol *)protocol
                 dispatchQueue:(dispatch_queue_t)dispatchQueue;

@end

NS_ASSUME_NONNULL_END
