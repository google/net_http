#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Converts @c string to an integer as C++ @c absl::SimpleAtoi does: decimal digits with an
 * optional sign, optionally surrounded by ASCII whitespace. Returns NO for any other string and for
 * a number outside the @c int64_t range.
 */
FOUNDATION_EXTERN BOOL WCSimpleAtoi64(NSString *string, int64_t *value);

/** Like WCSimpleAtoi64(), but returns NO for a number outside the @c int32_t range. */
FOUNDATION_EXTERN BOOL WCSimpleAtoi32(NSString *string, int32_t *value);

NS_ASSUME_NONNULL_END
