#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** Name of the NSNotification posted when WebChannel lifecycle events occur. */
FOUNDATION_EXTERN NSNotificationName const kWCEventNotificationName;

/** Key in userInfo dictionary containing the handshake RTT as an NSNumber (NSTimeInterval). */
FOUNDATION_EXTERN NSString *const kWCEventNotificationHandshakeRttKey;

/** Name of the NSNotification posted for request and retry diagnostics. */
FOUNDATION_EXTERN NSNotificationName const kWCDiagnosticNotificationName;

FOUNDATION_EXTERN NSString *const kWCDiagnosticEventKey;
FOUNDATION_EXTERN NSString *const kWCDiagnosticChannelKey;
FOUNDATION_EXTERN NSString *const kWCDiagnosticMethodKey;
FOUNDATION_EXTERN NSString *const kWCDiagnosticRequestIDKey;
FOUNDATION_EXTERN NSString *const kWCDiagnosticAttemptKey;
FOUNDATION_EXTERN NSString *const kWCDiagnosticTimeoutKey;
FOUNDATION_EXTERN NSString *const kWCDiagnosticDelayKey;
FOUNDATION_EXTERN NSString *const kWCDiagnosticErrorKey;
FOUNDATION_EXTERN NSString *const kWCDiagnosticStatusCodeKey;

NS_ASSUME_NONNULL_END
