#import <Foundation/Foundation.h>

@protocol WCRequestStateChangedHandler;

/** Types of request ready state enum */
typedef NS_ENUM(NSInteger, WCRequestReadyState) {
  WCRequestReadyStateUninitialized,
  WCRequestReadyStateLoaded,
  WCRequestReadyStateInteractive,
  WCRequestReadyStateComplete,
};

/** Types of request error code enum */
typedef NS_ENUM(NSInteger, WCRequestErrorCode) {
  WCRequestErrorCodeNoError,
  WCRequestErrorCodeAccessDenied,
  WCRequestErrorCodeFileNotFound,
  WCRequestErrorCodeFfSlientError,
  WCRequestErrorCodeCustomError,
  WCRequestErrorCodeException,
  WCRequestErrorCodeHTTPError,
  WCRequestErrorCodeAbort,
  WCRequestErrorCodeTimeout,
  WCRequestErrorCodeOffline,
};

typedef NS_ENUM(NSInteger, WCRequestStat) {
  WCRequestStatConnectAttempt,
  WCRequestStatErrorNetwork,
  WCRequestStatErrorOther,
  WCRequestStatTestStageOneStart,
  WCRequestStatTestStageTwoStart,
  WCRequestStatTestStageTwoDataOne,
  WCRequestStatTestStageTwoDataTwo,
  WCRequestStatTestStageTwoDataBoth,
  WCRequestStatTestStageOneFailed,
  WCRequestStatTestStageTwoFailed,
  WCRequestStatProxy,
  WCRequestStatNoProxy,
  WCRequestStatRequestUnknownSessionId,
  WCRequestStatRequestBadStatus,
  WCRequestStatRequestIncompleteData,
  WCRequestStatRequestBadData,
  WCRequestStatRequestNoData,
  WCRequestStatRequestTimeout,
  WCRequestStatBackChannelMissing,
  WCRequestStatBackChannelDead,
  WCRequestStatBrowserOffline
};

@protocol WCHTTPRequest <NSObject>

@property(nonatomic) id<WCRequestStateChangedHandler> requestReadyStateChangeHandler;
@property(nonatomic, readonly) WCRequestReadyState requestReadyState;
@property(nonatomic, readonly) WCRequestErrorCode requestErrorCode;

/**
 * Get a specific field's value from HTTP response header.
 *
 * @param name The specific field name.
 */
- (NSString *)responseHeaderForName:(NSString *)name;

/** Get HTTP status code. */
- (int)status;

/**
 * Send a POST request.
 *
 * @param URL The request URL.
 * @param postData The request body data.
 * @param headers The request headers.
 * @param timeout The request timeout.
 */
- (void)sendPOST:(NSURL *)URL
        withData:(nullable NSData *)postData
     withHeaders:(nullable NSDictionary<NSString *, NSString *> *)headers
     timeout:(NSTimeInterval)timeout;

/**
 * Send a GET request.
 *
 * @param URL The request URL.
 * @param headers The request headers.
 * @param timeout The request timeout.
 */
- (void)sendGET:(NSURL *)URL
    withHeaders:(nullable NSDictionary<NSString *, NSString *> *)headers
        timeout:(NSTimeInterval)timeout;

/** Cancel the current request. */
- (void)abort;

@end

@protocol WCRequestStateChangedHandler

/**
 * Handle @WCRequestReadyState changes.
 *
 * @param request The request be listened.
 * @param data The response data.
 */
- (void)stateChangedForRequest:(id<WCHTTPRequest>)request responseData:(NSData *)data;
@end
