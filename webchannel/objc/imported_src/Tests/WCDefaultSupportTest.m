// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#import <XCTest/XCTest.h>

#import "WCDefaultSupport.h"
#import "WCSupport.h"
#import "WCTimer.h"
#import <GTMSessionFetcher/GTMSessionFetcherService.h>

@interface WCDefaultSupportTest : XCTestCase
@end

@implementation WCDefaultSupportTest

- (void)testTimerFiresOnBackgroundGCDQueueWithoutRunLoop {
  dispatch_queue_t backgroundQueue =
      dispatch_queue_create("WCDefaultSupportTestBackground", DISPATCH_QUEUE_SERIAL);
  void *queueKey = &queueKey;
  dispatch_queue_set_specific(backgroundQueue, queueKey, (__bridge void *)backgroundQueue, nil);

  GTMSessionFetcherService *fetcherService =
      [GTMSessionFetcherService mockFetcherServiceWithFakedData:[NSData data] fakedError:nil];
  WCDefaultSupport *support = [[WCDefaultSupport alloc] initWithDispatchQueue:backgroundQueue
                                                               fetcherService:fetcherService];

  XCTestExpectation *expectation =
      [self expectationWithDescription:@"Timer fires on background queue"];

  __block BOOL fired = NO;
  __block BOOL isOnCorrectQueue = NO;

  id<WCTimer> timer = [support setTimeout:0.01
                                    block:^{
                                      fired = YES;
                                      void *specificValue = dispatch_get_specific(queueKey);
                                      if (specificValue == (__bridge void *)backgroundQueue) {
                                        isOnCorrectQueue = YES;
                                      }
                                      [expectation fulfill];
                                    }];
  XCTAssertNotNil(timer);

  [self waitForExpectationsWithTimeout:2.0 handler:nil];

  XCTAssertTrue(fired, @"Timer must fire");
  XCTAssertTrue(isOnCorrectQueue, @"Timer block must execute on designated background queue");
}

- (void)testTimerCanBeCancelled {
  dispatch_queue_t backgroundQueue =
      dispatch_queue_create("WCDefaultSupportTestCancel", DISPATCH_QUEUE_SERIAL);
  GTMSessionFetcherService *fetcherService =
      [GTMSessionFetcherService mockFetcherServiceWithFakedData:[NSData data] fakedError:nil];
  WCDefaultSupport *support = [[WCDefaultSupport alloc] initWithDispatchQueue:backgroundQueue
                                                               fetcherService:fetcherService];

  __block BOOL fired = NO;

  id<WCTimer> timer = [support setTimeout:0.05
                                    block:^{
                                      fired = YES;
                                    }];

  // Cancel the timer immediately using clearTimeout:
  [support clearTimeout:timer];

  // Wait long enough to make sure it would have fired if not cancelled
  XCTestExpectation *waitExpectation =
      [self expectationWithDescription:@"Waiting for cancellation check"];
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), backgroundQueue,
                 ^{
                   [waitExpectation fulfill];
                 });

  [self waitForExpectationsWithTimeout:2.0 handler:nil];

  XCTAssertFalse(fired, @"Timer must not fire after cancellation");
}

@end
