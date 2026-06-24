#import <Foundation/Foundation.h>

@class WCFailureRecoveryContext;

NS_ASSUME_NONNULL_BEGIN

/**
 * Protocol representing an opaque token for a scheduled timer.
 * Handled entirely by the WCSupport library implementation.
 */
@protocol WCTimer <NSObject>

/** Cancels the scheduled timer. */
- (void)cancel;

/** The failure recovery context if this is a retry/recovery timer. */
@property(nonatomic, readonly, nullable) WCFailureRecoveryContext *context;

@end

NS_ASSUME_NONNULL_END
