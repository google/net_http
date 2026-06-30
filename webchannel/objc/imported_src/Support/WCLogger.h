#import <Foundation/Foundation.h>

#import "WCHTTPRequest.h"

/**
 *      To enable assert for WC in your DEBUG build, either build the project with the
 *      @c WC_DEV_ASSERT preprocessor symbol defined or set the @c gWCDevAssertEnabled global to
 *      YES.
 *
 *      Example of YouTube Usage:
 *      @code
 *        googlemac/iPhone/YouTube/Tools/Bazel/GenerateMyProject.py \
 *            --project=YouTube \
 *            --objccopt=WC_DEV_ASSERT=1
 *      @endcode
 */
extern BOOL gWCDevAssertEnabled;

/** The convenience macros are only defined if they haven't already been defined. */
#ifndef WCDevAssert

/** Convenience macro that calls the NSAssert if |MDXDevAssertEnabled| is YES. */
#define WCDevAssert(condition, ...)   \
  if (gWCDevAssertEnabled) {          \
    NSAssert(condition, __VA_ARGS__); \
  }

/**
 * If we're not in a debug build, remove the WCDevAssert statements. This makes calls to
 * WCDevAssert "compile out" of Release builds.
 */
#ifndef DEBUG
#undef WCDevAssert
#define WCDevAssert(...) \
  do {                   \
  } while (0)
#endif

#endif  // !defined(WCDevAssert)

@protocol WCLogger <NSObject>

- (void)logInfo:(NSString *)message;

- (void)logDebug:(NSString *)message;

- (void)logWarning:(NSString *)message;

- (void)dumpException:(NSException *)e withMessage:(NSString *)message;

- (void)logError:(NSString *)message;

- (void)logHTTPRequest:(NSString *)verb
                   URL:(NSURL *)URL
                    ID:(NSString *)ID
               attempt:(int64_t)attempt
              postData:(NSString *)postData;

- (void)logHTTPChannelResponseMetaData:(NSString *)verb
                                   URL:(NSURL *)URL
                                    ID:(NSString *)ID
                               attempt:(int64_t)attempt
                                 state:(WCRequestReadyState)state
                            statusCode:(int32_t)code;

- (void)logHTTPChannelResponseText:(NSString *)text ID:(NSString *)ID desc:(NSString *)desc;

@end
