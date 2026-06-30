#import <Foundation/Foundation.h>

/** For configuring the webchannel parameters. */
@interface WCInternalChannelParams : NSObject

@property(nonatomic, getter=shouldFailFast) BOOL failFast;
@property(nonatomic) NSTimeInterval baseRetryDelay;
@property(nonatomic) NSTimeInterval retryDelaySeed;
@property(nonatomic) int forwardChannelMaxRetries;
@property(nonatomic) NSTimeInterval forwardChannelRequestTimeout;

@end
