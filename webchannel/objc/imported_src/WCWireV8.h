#import <Foundation/Foundation.h>

@class WCQueuedMap;
@protocol WCSupport;

/**
 * A stream of JSON chunks, each chunk representing a message (envelope) from the
 * server. Messages to the client are sent down in a client-chunked style. This class will handle
 * chunk encoding and decoding.
 */
@interface WCWireV8 : NSObject

- (instancetype)initWithSupport:(id<WCSupport>)support;

- (NSString *)encodeMessageQueue:(NSMutableArray<WCQueuedMap *> *)outgoingMaps numOfMessages:(int)count;

/**
 * Decode message from NSData to NSArray.
 *
 * @param message Data to be decoded.
 * @param level The level of decoding of the nested array.
 */
- (NSArray *)decodeMessage:(NSData *)message level:(int)level;

@end
