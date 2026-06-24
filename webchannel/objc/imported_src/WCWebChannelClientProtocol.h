#import <Foundation/Foundation.h>

@protocol GTMFetcherAuthorizationProtocol;

/** APIs and factory methods of the dispatchable WebChannel client. */
@protocol WCWebChannelClientProtocol <NSObject>

/** Opens a WebChannel connection. */
- (void)open;

/** Disconnects WebChannel. */
- (void)close;

/**
 * Sends message using forward channel.
 *
 * @param message The string to be sent.
 */
- (void)send:(NSString *)message;

/**
 * Sends data using forward channel.
 *
 * @param data The data to be sent.
 */
- (void)sendData:(NSData *)data;

@end
