#import <Foundation/Foundation.h>


typedef void (^WCAckCommitCallbackBlock)(void);

/** The runtime properties of the WebChannel instance. */
@interface WCRuntimeProperties : NSObject

/** The last HTTP status code received by the channel. */
@property(nonatomic, readonly) int lastStatusCode;

/**
 * The list of messages that have not received commit-ack from the server;
 * or if no commit has been issued, the list of messages that have not been
 * delivered to the server application.
 */
@property(nonatomic, readonly) NSArray<NSString *> *nonAckedMessages;

/**
 * Generates an in-band commit request to the server.
 *
 * @param ackCommitCallbackBlock The callback will be invoked once an acknowledgement
 *     has been received for the current commit or any newly issued commit.
 * @see http://shortn/_AW5F0PZ789
 */
- (void)commit:(WCAckCommitCallbackBlock)ackCommitCallbackBlock;

@end
