#import <Foundation/Foundation.h>

#import "Support/WCHTTPRequest.h"

@protocol WCWebChannelInternalHTTPHandler;
@protocol WCHTTPRequest;
@protocol WCSupport;
@class WCQueuedMap;
@class GTMSessionFetcherService;

typedef NS_ENUM(NSInteger, WCChannelRequestError) {
  WCChannelRequestErrorUnknown,
  WCChannelRequestErrorStatus,
  WCChannelRequestErrorNoData,
  WCChannelRequestErrorTimeout,
  WCChannelRequestErrorUnknownSessionId,
  WCChannelRequestErrorBadData,
  WCChannelRequestErrorHandlerException,
  WCChannelRequestErrorBrowserOffline
};

/**
 * A request object that holds params for a request, provide functions of sending GET/POST requests,
 * and handle events.
 */
@interface WCChannelRequest : NSObject <WCRequestStateChangedHandler>

@property(nonatomic, readonly) NSString *sessionID;
@property(nonatomic, readonly) NSString *requestID;
@property(nonatomic, readonly) int retryID;
@property(nonatomic) NSMutableDictionary<NSString *, NSString *> *extraHeaders;
@property(nonatomic) NSMutableArray<WCQueuedMap *> *pendingMessages;
@property(nonatomic, readonly) id<WCHTTPRequest> request;
@property(nonatomic) NSTimeInterval timeout;
@property(nonatomic, readonly) int lastStatusCode;
@property(nonatomic, readonly, getter=isSuccessful) BOOL successful;
@property(nonatomic, readonly) BOOL firstByteReceived;
@property(nonatomic, readonly) BOOL cancelled;
@property(nonatomic, readonly, getter=isPOST) BOOL POST;
@property(nonatomic, readonly) NSData *POSTData;
@property(nonatomic, readonly) NSDate *requestStartTime;
@property(nonatomic, readonly) NSMutableData *responseData;
@property(nonatomic, readonly) WCChannelRequestError lastError;
@property(nonatomic, readonly, getter=isLastErrorFatal) BOOL lastErrorFatal;
@property(nonatomic, getter=isInitialResponseDecoded) BOOL initialResponseDecoded;
@property(nonatomic) BOOL isBinaryMessage;

/**
 * @param sessionID The ID of current webChannel session.
 * @param requestID The ID of this request, starting from a random value and incrementing.
 * @param support The Support instance provides all the utils.
 * @param delegate The @WCWebChannelInternalHTTPHandler handle inputs, completion, and error for the
 *     channel.
 * @param retryID The ID of retry.
 */
- (instancetype)initWithSessionID:(NSString *)sessionID
                        requestID:(NSString *)requestID
                          support:(id<WCSupport>)support
                         delegate:(id<WCWebChannelInternalHTTPHandler>)delegate
                          retryID:(int)retryID;

/**
 * @param sessionID The ID of current webChannel session.
 * @param requestID The ID of this request, starting from a random value and incrementing.
 * @param support The Support instance provides all the utils.
 * @param delegate The @WCWebChannelInternalHTTPHandler handle inputs, completion, and error for the
 *     channel.
 */
- (instancetype)initWithSessionID:(NSString *)sessionID
                        requestID:(NSString *)requestID
                          support:(id<WCSupport>)support
                         delegate:(id<WCWebChannelInternalHTTPHandler>)delegate;

/**
 * Send POST request.
 *
 * @param URLComponents The request URL in components, including baseURL, queryParams, etc.
 * @param postData The data sending out.
 * @param chunkDecoded Indicate whether chunk should be decoded.
 */
- (void)sendPOST:(NSURLComponents *)URLComponents
        withData:(NSString *)postData
    chunkDecoded:(BOOL)chunkDecoded;

/**
 * Send POST request with binary data.
 *
 * @param URLComponents The request URL in components, including baseURL, queryParams, etc.
 * @param postData The data sending out.
 * @param chunkDecoded Indicate whether chunk should be decoded.
 */
- (void)sendPOST:(NSURLComponents *)URLComponents
    withPostData:(NSData *)postData
    chunkDecoded:(BOOL)chunkDecoded;

/**
 * Send GET request.
 *
 * @param URLComponents The request URL in components, including baseURL, queryParams, etc.
 * @param chunkDecoded Indicate whether chunk should be decoded.
 */
- (void)sendGET:(NSURLComponents *)URLComponents chunkDecoded:(BOOL)chunkDecoded;

/**
 * Send a GET request with type=close.
 *
 * @param URLComponents The request URL in components, including baseURL, queryParams, etc.
 */
- (void)closeWithURLComponents:(NSURLComponents *)URLComponents;

/** Cancel current request. */
- (void)cancel;

/**
 * Format @WCChannelRequestError enum to string for log convenience.
 *
 * @param error The @WCChannelRequestError to be formatted.
 */
- (NSString *)formatErrorToString:(WCChannelRequestError)error;

/**
 * Decode chunks of responses. Exposed for testing.
 *
 * @param responseText The responses sent back from server.
 * @param readyState The enum indicate if the request is complete.
 */
- (void)decodeNextChunks:(NSString *)responseText state:(WCRequestReadyState)readyState;

@end
