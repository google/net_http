#import <Foundation/Foundation.h>

@class WCQueuedMap;

NS_ASSUME_NONNULL_BEGIN

/**
 * Compression is disabled for raw binary messages.
 * Content-Type: application/octet-stream
 */
@interface WCWireV8Binary : NSObject

- (instancetype)init NS_UNAVAILABLE;

/**
 * Wire encoding format for forward-channel POST request body:
 *   count=<count>&ofs=<offset>\r\n          (header line; ofs is optional)
 *   id=<rel_id>&size=<length_in_bytes>\r\n  (message header)
 *   <raw_binary_payload_bytes>              (exact length_in_bytes)
 *   id=<rel_id>&size=<length_in_bytes>\r\n
 *   <raw_binary_payload_bytes>
 *   ...
 * Global message sequence number is computed as (rel_id + ofs).
 *
 * @param messageQueue The queue of messages to encode.
 * @param count The number of messages to encode.
 */
+ (NSData *)encodeMessageQueue:(NSArray<WCQueuedMap *> *)messageQueue numOfMessages:(int)count;

/**
 * Wire encoding format for backchannel binary chunk payload:
 *   id=<id>&size=<length_in_bytes>\r\n
 *   <raw_binary_payload_bytes>
 *   id=<id>&size=<length_in_bytes>\r\n
 *   <raw_binary_payload_bytes>
 *   ...
 *
 * Decodes a backchannel binary chunk payload into an array of envelopes:
 * [[id_0, payload_0], [id_1, payload_1], ...].
 *
 * @param chunkData The binary chunk payload to decode.
 * @return An array of envelopes, or nil if the chunk is malformed.
 */
+ (nullable NSArray<NSArray<id> *> *)decodeBinaryChunk:(NSData *)chunkData;

/**
 * Wire encoding format for backchannel chunk delimiter line:
 *   <chunk-size>[;data=binary][\r]\n
 * Checks if the chunk header indicates a binary chunk (e.g., "12;data=binary").
 * If sizePart is non-null, it is set to the size portion before the ';' delimiter.
 *
 * @param chunkHeader The chunk header line (excluding trailing newline).
 * @param sizePart Optional pointer to receive the size portion before the ';' delimiter.
 * @return YES if the chunk header indicates a binary chunk, NO otherwise.
 */
+ (BOOL)isBinaryChunk:(NSString *)chunkHeader sizePart:(NSString *_Nullable *_Nullable)sizePart;

@end

NS_ASSUME_NONNULL_END
