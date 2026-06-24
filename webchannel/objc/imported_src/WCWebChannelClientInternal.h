#import <Foundation/Foundation.h>

#import "WCRuntimeProperties.h"
#import "WCWebChannelClient.h"
#import "WCWebChannelClientProtocol.h"
#import "WCWebChannelClientReadWrite.h"

@class GTMSessionFetcherService;
@class WCForwardChannelRequestPool;
@class WCWireV8;
@class WCWireV8Binary;
@class WCChannelRequest;
@class WCQueuedMap;
@class WCInternalChannelParams;
@class WCOptions;
@class WCConnectionState;
@class WCRuntimeProperties;
@protocol WCWebChannelInternalHTTPHandler;
@protocol WCSupport;

static const int kWCLastChannelVersion = 8;
static const int kWCClientVersion = 23;
static const NSTimeInterval kWCDefaultBaseRetryDelay = 5;
static const NSTimeInterval kWCDefaultRetryDelaySeed = 10;
static const int kWCDefaultForwardChannelMaxRetries = 2;
static const int kWCDefaultBackChannelMaxRetries = 3;
static const NSTimeInterval kWCDefaultForwardChannelRequestTimeout = 20;
static const int kWCMaxMapsPerRequest = 1000;
static const int kWCMaxCharPerGET = 4096;  // 4 * 1024
static const NSTimeInterval kWCRTTEstimate = 3;
static const int kWCOutstandingDataBackChannelRetryCutoff = 37500;

static NSString *const kWCXClientProtocol = @"X-Client-Protocol";
static NSString *const kWCXClientWireProtocol = @"X-Client-Wire-Protocol";
static NSString *const kWCXClientProtocolWebChannel = @"webchannel";
static NSString *const kWCXWebChannelContentType = @"X-WebChannel-Content-Type";
static NSString *const kWCXWebChannelClientProfile = @"X-WebChannel-Client-Profile";
static NSString *const kWCXHTTPSessionID = @"X-HTTP-Session-Id";
static NSString *const kWCXHTTPInitialResponse = @"X-HTTP-Initial-Response";
static NSString *const kRawDataKey = @"__data__";
static NSString *const kMetadataHeadersKey = @"__headers__";
static NSString *const kMetadataStatusKey = @"__status__";
static NSString *const kMetadataKey = @"__sm__";

@protocol WCWebChannelInternalHTTPHandler
/**
 * This function parses response text during initial handshake; otherwise when connection is OPENED,
 * it handles messages by calling WCWebChannelClientDelegate:didReceiveMessage.
 *
 * @param input The response data passed from @c NSURLSessionDataTask.
 * @param request The request triggering response data.
 */
- (void)didReceiveInput:(NSString *)input withRequest:(WCChannelRequest *)request;

/**
 * This function handles success connection by calling WCWebChannelClientDelegate:webChannelOpened.
 *
 * @param request The completing request.
 */
- (void)handleCompleteRequest:(WCChannelRequest *)request;

/**
 * This function handles when first byte of data is received.
 *
 * @param request The resquest that got this first byte of data.
 * @param responseText The text string received in response.
 */
- (void)didReceivedFirstByteOfRequest:(WCChannelRequest *)request
                         responseText:(NSString *)responseText;

@end

/** The concrete WebChannel client. */
@interface WCWebChannelClientInternal : NSObject <WCWebChannelClientProtocol>

/** The delegate for handling actions on the WebChannel. */
@property(weak, nullable) id<WCWebChannelClientHandlerDelegate> delegate;
@property(readonly) WCWebChannelClientState state;
@property NSDictionary<NSString *, NSString *> *extraParams;
@property(readonly) WCRuntimeProperties *runtimeProperties;
@property(nonatomic) NSString *HTTPSessionIDParam;
@property(nonatomic) NSString *HTTPSessionID;
@property(nonatomic, readonly) NSURL *forwardChannelURL;
@property(nonatomic, readonly) NSURL *backChannelURL;
@property(nonatomic, readonly) WCForwardChannelRequestPool *forwardChannelRequestPool;
@property(nonatomic, readonly) WCWireV8 *wireCodec;
@property(nonatomic, readonly) WCWireV8Binary *wireCodecBinary;
@property(nonatomic, readonly) NSString *sessionID;
@property(nonatomic) NSMutableDictionary<NSString *, NSString *> *extraHeaders;
@property(nonatomic) NSMutableDictionary<NSString *, NSString *> *initialHeaders;
@property(nonatomic, readonly, getter=isStreamingEnabled) BOOL streamingEnabled;
@property(nonatomic) int forwardChannelMaxRetries;
@property(nonatomic) NSTimeInterval forwardChannelRequestTimeout;
@property(nonatomic, readonly) int backChannelMaxRetries;
@property(nonatomic, readonly) int lastStatusCode;
@property(nonatomic, readonly) int lastResponseCount;
@property(nonatomic, readonly) int lastPostResponseCount;
@property(nonatomic) WCWebChannelClientError error;
@property(nonatomic, readonly) int channelVersion;
@property(nonatomic, readonly) WCChannelRequest *backChannelRequest;
@property(nonatomic, readonly) NSMutableArray<WCQueuedMap *> *outgoingMaps;
@property(nonatomic, readonly) NSMutableArray<WCQueuedMap *> *nonAckedMaps;
@property(nonatomic, readonly) int backChannelRetryCount;
@property(nonatomic) WCAckCommitCallbackBlock forwardChannelFlushedCallback;

/**
 * @param URL The base URL of the channel.
 * @param options Configuration input of WebChannel runtime options.
 * @param connectionState The connection state of WebChannel client.
 * @param clientVersion The clientVersion, default to be 0.
 * @param delegate The implementation of protocol for processing messages the
 *     WebChannel client receives from the server.
 * @param support The implementation of protocol for the support.
 * @param fetcherService The fetcher service used for requests.
 * @param dispatchQueue A dedicated dispatch queue where webchannel logic is run on.
 */
- (instancetype)initWithURL:(NSString *)baseURL
                    options:(WCOptions *)options
            connectionState:(WCConnectionState *)connectionState
              clientVersion:(int)clientVersion
                   delegate:(id<WCWebChannelClientHandlerDelegate>)delegate
                    support:(id<WCSupport>)support;
@end
