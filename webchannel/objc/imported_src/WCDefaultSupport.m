#import "WCDefaultSupport.h"

#import "Support/WCDefaultHTTPRequest.h"
#import "Support/WCDefaultJSONDecoder.h"
#import "Support/WCDefaultLogger.h"
#import "Support/WCDefaultURLEncoder.h"
#import "Support/WCHTTPRequest.h"
#import "WCEventNotification.h"
#import "WCFailureRecoveryContext.h"
#import "WCSupport.h"
#import "WCTimer.h"
#import <GTMSessionFetcher/GTMSessionFetcherService.h>

/** Internal timer token implementation. */
@interface WCDefaultTimer : NSObject <WCTimer> {
 @public
  dispatch_source_t _timerSource;
}

/** The failure recovery context, if any. */
@property(nonatomic, strong, nullable) WCFailureRecoveryContext *context;

- (void)startWithQueue:(dispatch_queue_t)queue
               timeout:(NSTimeInterval)timeout
                 block:(void (^)(void))block;
@end

@implementation WCDefaultTimer
- (void)startWithQueue:(dispatch_queue_t)queue
               timeout:(NSTimeInterval)timeout
                 block:(void (^)(void))block {
  _timerSource = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, queue);
  if (_timerSource) {
    dispatch_source_set_timer(
        _timerSource,
        dispatch_time(DISPATCH_TIME_NOW, (int64_t)(timeout * NSEC_PER_SEC)),
        DISPATCH_TIME_FOREVER,
        0);
    __weak typeof(self) weakSelf = self;
    dispatch_source_set_event_handler(_timerSource, ^{
      block();
      __strong typeof(self) strongSelf = weakSelf;
      if (strongSelf) {
        [strongSelf cancel];
      }
    });
    dispatch_resume(_timerSource);
  }
}

- (void)cancel {
  if (_timerSource) {
    dispatch_source_cancel(_timerSource);
    _timerSource = nil;
  }
}

- (void)dealloc {
  [self cancel];
}
@end

@implementation WCDefaultSupport {
  dispatch_queue_t _dispatchQueue;
  GTMSessionFetcherService *_fetcherService;
}

@synthesize URLEncoder = _URLEncoder;
@synthesize JSONDecoder = _JSONDecoder;
@synthesize logger = _logger;
@synthesize dispatchQueue = _dispatchQueue;

static dispatch_queue_t CreateDefaultQueue() {
  return dispatch_queue_create("WebChannelClient", DISPATCH_QUEUE_SERIAL);
}

- (instancetype)init {
  GTMSessionFetcherService *fetcherService = [[GTMSessionFetcherService alloc] init];
  fetcherService.cookieStorage = [[GTMSessionCookieStorage alloc] init];
  return [self initWithDispatchQueue:CreateDefaultQueue() fetcherService:fetcherService];
}

- (instancetype)initWithFetcherService:(nonnull GTMSessionFetcherService *)fetcherService {
  return [self initWithDispatchQueue:CreateDefaultQueue() fetcherService:fetcherService];
}

- (instancetype)initWithDispatchQueue:(dispatch_queue_t)dispatchQueue
                       fetcherService:(nonnull GTMSessionFetcherService *)fetcherService {
  self = [super init];
  if (self) {
    _URLEncoder = [[WCDefaultURLEncoder alloc] init];
    _JSONDecoder = [[WCDefaultJSONDecoder alloc] init];
    _logger = [[WCDefaultLogger alloc] init];
    _dispatchQueue = dispatchQueue;
    _fetcherService = fetcherService;
  }
  return self;
}

- (id<WCHTTPRequest>)HTTPRequest:(id<WCRequestStateChangedHandler>)handler {
  return [[WCDefaultHTTPRequest alloc] initWithStateChangeHandler:handler
                                                    dispatchQueue:_dispatchQueue
                                                   fetcherService:_fetcherService];
}

- (void)notifyStatEvent:(WCRequestStat)event {
  // optional
}

- (void)notifyServerReachabilityEvent:(WCServerReachability)event {
  // optional
}

- (void)notifyTimingEventWithSize:(int)size withRTT:(NSTimeInterval)RTT withRetries:(int)retries {
  // optional
}

- (void)notifyHandshakeTimingEventWithRtt:(NSTimeInterval)rtt {
  [[NSNotificationCenter defaultCenter]
      postNotificationName:kWCEventNotificationName
                    object:self
                  userInfo:@{kWCEventNotificationHandshakeRttKey : @(rtt)}];
}

- (id<WCTimer>)setTimeout:(NSTimeInterval)timeout block:(void (^)(void))block {
  WCDefaultTimer *timerToken = [[WCDefaultTimer alloc] init];
  [timerToken startWithQueue:_dispatchQueue timeout:timeout block:block];
  return timerToken;
}

- (id<WCTimer>)setTimeout:(NSTimeInterval)timeout
                    block:(void (^)(void))block
                  context:(nonnull WCFailureRecoveryContext *)context {
  WCDefaultTimer *timerToken = [[WCDefaultTimer alloc] init];
  [timerToken startWithQueue:_dispatchQueue timeout:timeout block:block];
  timerToken.context = context;
  return timerToken;
}

- (void)clearTimeout:(id<WCTimer>)timer {
  [timer cancel];
}

@end
