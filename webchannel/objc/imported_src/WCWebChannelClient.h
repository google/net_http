#import <Foundation/Foundation.h>

#import "WCWebChannelClientProtocol.h"
#import "WCWebChannelClientReadWrite.h"

@class WCOptions;
@protocol WCWebChannelClientHandlerDelegate;
@protocol WCSupport;

/** Types of WebChannel client state enum */
typedef NS_ENUM(NSInteger, WCWebChannelClientState) {
  WCWebChannelClientStateClosed,
  WCWebChannelClientStateInit,
  WCWebChannelClientStateOpening,
  WCWebChannelClientStateOpened
};

/** Types of error enum */
typedef NS_ENUM(NSInteger, WCWebChannelClientError) {
  WCWebChannelClientErrorNone,
  WCWebChannelClientErrorRequestFailed,
  WCWebChannelClientErrorLoggedOut,
  WCWebChannelClientErrorNoData,
  WCWebChannelClientErrorUnknownSessionID,
  WCWebChannelClientErrorStop,
  WCWebChannelClientErrorNetwork,
  WCWebChannelClientErrorBadData,
  WCWebChannelClientErrorBadResponse,
};

@interface WCWebChannelClient : NSObject <WCWebChannelClientProtocol, WCWebChannelClientReadWrite>

/** The delegate for handling actions on the WebChannel. */
@property(nonatomic, weak, nullable) id<WCWebChannelClientHandlerDelegate> delegate;

/**
 * @param baseURL The base URL of the channel.
 * @param options Configuration input of WebChannel runtime options.
 * @param delegate The implementation of protocol for processing messages the
 *     WebChannel client receives from the server.
 */
- (instancetype)initWithURL:(NSURL *)baseURL
                    options:(WCOptions *)options
                   delegate:(id<WCWebChannelClientHandlerDelegate>)delegate;

/**
 * @param baseURL The base URL of the channel.
 * @param options Configuration input of WebChannel runtime options.
 * @param delegate The implementation of protocol for processing messages the
 *     WebChannel client receives from the server.
 * @param support The support object that encapsulates platform-specific utilities and networking.
 */
- (instancetype)initWithURL:(NSURL *)baseURL
                    options:(WCOptions *)options
                   delegate:(id<WCWebChannelClientHandlerDelegate>)delegate
                    support:(id<WCSupport>)support NS_DESIGNATED_INITIALIZER;

- (instancetype)init NS_UNAVAILABLE;

@end

/**
 * Protocol for processing messages the WebChannelClient receives from the server on the back
 * channel. These delegate methods mirror Java API's AsyncWebChannel.EventHandler.
 */
@protocol WCWebChannelClientHandlerDelegate <NSObject>

/**
 * Invoke when @c WCWebChannelClient is opened.
 *
 * @param client The opened WebChannelClient.
 */
- (void)webChannelOpened:(id<WCWebChannelClientProtocol>)client;

/**
 * Invoke when @C WCWebChannelClient is closed, and send undeliverred data to server if any.
 *
 * @param client The closed WebChanelClient.
 */
- (void)webChannelClosed:(id<WCWebChannelClientProtocol>)client;

/**
 * Invoke when @c WCWebChannelClient receives messages from back channel.
 *
 * @param client The WebChanelClient that receiving messages.
 * @param message The JSON message received.
 */
- (void)webChannel:(id<WCWebChannelClientProtocol>)client didReceiveMessage:(id)message;

/**
 * Invoke when error occurs on @c WCWebChannelClient.
 *
 * @param client The failed WebChanelClient.
 * @param error The error occurs.
 */
- (void)webChannel:(id<WCWebChannelClientProtocol>)client
    encounteredError:(WCWebChannelClientError)error;

/**
 * Invoke when @c WCWebChannelClient receives metadata encoded as HTTP status code and headers.
 *
 * @param client The @c WCWebChannelClient with the metadata.
 * @param statusCode Metadata as HTTP status code.
 * @param headers Metadata as HTTP headers.
 */
- (void)webChannel:(id<WCWebChannelClientProtocol>)client
    didReceiveHeaders:(NSDictionary<NSString *, NSString *> *)headers
           statusCode:(int)statusCode;
/**
 * Invoke when @c WCWebChannelClient receives metadata.
 *
 * @param metadata Metadata value, as an object parsed by NSJSONSerialization (NSArray or
 * NSDictionary). Typically, ESF server would return metadata as NSArray, as per
 * go/webchannel-oneplatform#message-formats.
 * @param key Metadata key.
 */
- (void)webChannel:(id<WCWebChannelClientProtocol>)client
    didReceiveMetadata:(id)metadata
                   key:(NSString *)key;
@end
