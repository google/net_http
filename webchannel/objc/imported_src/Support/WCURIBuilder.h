#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Percent-encodes @c value as C++ @c url::EncodeURIComponent does: each UTF-8 byte other than
 * @c A-Z, @c a-z, @c 0-9, and @c !()*-._~ becomes @c %XX with uppercase hex digits. An unpaired
 * UTF-16 surrogate is encoded as U+FFFD.
 */
FOUNDATION_EXTERN NSString *WCEncodeURIComponent(NSString *value);

/**
 * Adds @c name=value to the query of @c components, encoding @c name and @c value with
 * WCEncodeURIComponent(). If the query already has parameters with the encoded name, the new value
 * replaces the first of them and the others are removed; otherwise the parameter is appended.
 */
FOUNDATION_EXTERN void WCAddQueryParameter(NSURLComponents *components, NSString *name,
                                           NSString *value);

NS_ASSUME_NONNULL_END
