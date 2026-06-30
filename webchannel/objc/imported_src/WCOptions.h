#import <Foundation/Foundation.h>

@class WCInternalChannelParams;

/** For configuring the webchannel runtime behavior. */
@interface WCOptions : NSObject

@property(nonatomic, copy) NSDictionary<NSString *, NSString *> *messageHeaders;
@property(nonatomic, copy) NSDictionary<NSString *, NSString *> *initialMessageHeaders;
@property(nonatomic, copy) NSString *messageContentType;
@property(nonatomic, copy) NSDictionary<NSString *, NSString *> *messageURLParams;
@property(nonatomic) BOOL clientProtocolHeaderRequired;
@property(nonatomic) int concurrentRequestLimit;
@property(nonatomic, getter=isSendingRawJSON) BOOL sendingRawJSON;
@property(nonatomic, copy) NSString *HTTPSessionIDParam;
@property(nonatomic, getter=isLongPollingForced) BOOL longPollingForced;
@property(nonatomic, getter=shouldDetectBufferingProxy) BOOL detectBufferingProxy;
@property(nonatomic, getter=isFastHandshake) BOOL fastHandshake;
@property(nonatomic, getter=isBlockingHandshake) BOOL blockingHandshake;
@property(nonatomic) BOOL enableBinaryEncoding;
@property(nonatomic, readonly, getter=isRedactDisabled) BOOL redactDisabled;
@property(nonatomic, copy) NSString *clientProfile;
@property(nonatomic) WCInternalChannelParams *internalChannelParams;

@end
