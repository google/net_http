#import <Foundation/Foundation.h>

@class WCQueuedMap;
@protocol WCSupport;

/**
 * A stream of binary chunks, each chunk representing a message (envelope) from the
 * server. Messages to the client are sent down in a client-chunked style. This class will handle
 * chunk encoding and decoding.
 */
@interface WCWireV8Binary : NSObject

- (instancetype)initWithSupport:(id<WCSupport>)support;

/**
 * Encode a queue of messages into a binary blob.
 *
 * @param messageQueue The queue of messages to be encoded.
 * @param count The number of messages to encode.
 */
- (NSData *)encodeMessageQueue:(NSArray<WCQueuedMap *> *)messageQueue numOfMessages:(int)count;

@end
