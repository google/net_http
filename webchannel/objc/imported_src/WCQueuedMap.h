#import <Foundation/Foundation.h>

typedef void (^WCQueuedMapBadMessageHandler)(NSDictionary<NSString *, NSString *> *);

/** The data structure for holding all out going messages. */
@interface WCQueuedMap : NSObject

@property(nonatomic, readonly) int rawDataSize;
@property(nonatomic, readonly) int mapID;
@property(nonatomic, readonly) NSDictionary<NSString *, id> *map;
@property(nonatomic, readonly) NSObject *context;

- (instancetype)initWithMapID:(int)ID
                          map:(NSDictionary<NSString *, id> *)map
                      context:(NSObject *)context;

@end
