#import "WCChannelRequest.h"
#import "WCForwardChannelRequestPool.h"
#import "WCQueuedMap.h"

#import <XCTest/XCTest.h>

@interface WCForwardChannelRequestPoolTest : XCTestCase
@end

@implementation WCForwardChannelRequestPoolTest

- (void)testPoolOfSizeOneIsFullWithOneRequest {
  WCForwardChannelRequestPool *pool = [[WCForwardChannelRequestPool alloc] initWithMaxPoolSize:1];
  XCTAssertFalse(pool.full);

  [pool addRequest:[self requestWithID:@"1" mapID:1]];

  XCTAssertTrue(pool.full);
  XCTAssertEqual(1, pool.requestCount);
}

- (void)testCancelCancelsAndRemovesRequests {
  WCForwardChannelRequestPool *pool = [[WCForwardChannelRequestPool alloc] initWithMaxPoolSize:0];
  WCChannelRequest *request = [self requestWithID:@"1" mapID:1];
  [pool addRequest:request];

  [pool cancel];

  XCTAssertTrue(request.cancelled);
  XCTAssertEqual(0, pool.requestCount);
  XCTAssertFalse([pool hasRequest:request]);
}

- (void)testCancelPreservesPendingMessagesOfInFlightRequests {
  WCForwardChannelRequestPool *pool = [[WCForwardChannelRequestPool alloc] initWithMaxPoolSize:0];
  [pool addPendingMessages:[@[ [[WCQueuedMap alloc] initWithMapID:0 map:@{}
                                                          context:nil] ] mutableCopy]];
  [pool addRequest:[self requestWithID:@"1" mapID:1]];
  [pool addRequest:[self requestWithID:@"2" mapID:2]];

  [pool cancel];

  NSMutableArray<WCQueuedMap *> *pendingMessages = pool.pendingMessages;
  XCTAssertEqual(3, pendingMessages.count);
  XCTAssertEqual(0, pendingMessages[0].mapID);
  NSSet<NSNumber *> *mapIDs = [NSSet setWithArray:[pendingMessages valueForKey:@"mapID"]];
  XCTAssertEqualObjects((@[ @0, @1, @2 ]),
                        [[mapIDs allObjects] sortedArrayUsingSelector:@selector(compare:)]);
}

- (void)testClearPendingMessagesAfterCancel {
  WCForwardChannelRequestPool *pool = [[WCForwardChannelRequestPool alloc] initWithMaxPoolSize:0];
  [pool addRequest:[self requestWithID:@"1" mapID:1]];
  [pool cancel];

  [pool clearPendingMessages];

  XCTAssertEqual(0, pool.pendingMessages.count);
}

#pragma mark - Private

- (WCChannelRequest *)requestWithID:(NSString *)requestID mapID:(int)mapID {
  WCChannelRequest *request = [[WCChannelRequest alloc] initWithSessionID:@"sid"
                                                                requestID:requestID
                                                                  support:nil
                                                                 delegate:nil];
  request.pendingMessages = [@[ [[WCQueuedMap alloc] initWithMapID:mapID map:@{}
                                                           context:nil] ] mutableCopy];
  return request;
}

@end
