#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** Name of the NSNotification posted when WebChannel lifecycle events occur. */
FOUNDATION_EXTERN NSNotificationName const kWCEventNotificationName;

/** Key in userInfo dictionary containing the handshake RTT as an NSNumber (NSTimeInterval). */
FOUNDATION_EXTERN NSString *const kWCEventNotificationHandshakeRttKey;

/**
 * Key in userInfo dictionary containing the handshake HTTP response headers as an
 * NSDictionary<NSString *, NSString *>.
 */
FOUNDATION_EXTERN NSString *const kWCEventNotificationHandshakeHeadersKey;

NS_ASSUME_NONNULL_END
