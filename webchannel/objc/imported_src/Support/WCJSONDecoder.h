#import <Foundation/Foundation.h>

@protocol WCJSONDecoder <NSObject>

/**
 * Decode an array up to the specified maxDepth (maximum being 3).
 *
 * @param data Data input.
 * @param maxDepth The level to flatten the nested data.
 */
- (NSArray *)decodeData:(NSData *)data maxDepth:(int)maxDepth;

@end
