#import "WCDefaultHTTPRequest.h"

#import "WCHTTPRequest.h"
#import <GTMSessionFetcher/GTMSessionFetcher.h>
#import <GTMSessionFetcher/GTMSessionFetcherService.h>

@implementation WCDefaultHTTPRequest {
  // Internal queue used to handle all Webchannel logic to ensure thread safety.
  dispatch_queue_t _dispatchQueue;
  GTMSessionFetcherService *_fetcherService;

  GTMSessionFetcher *_fetcher;
  NSHTTPURLResponse *_Nullable _response;
}

@synthesize requestReadyStateChangeHandler = _requestReadyStateChangeHandler;
@synthesize requestReadyState = _requestReadyState;
@synthesize requestErrorCode = _requestErrorCode;

- (instancetype)initWithStateChangeHandler:(id<WCRequestStateChangedHandler>)handler
                             dispatchQueue:(dispatch_queue_t)dispatchQueue
                            fetcherService:(nonnull GTMSessionFetcherService *)fetcherService {
  self = [super init];
  if (self) {
    _requestReadyStateChangeHandler = handler;
    _dispatchQueue = dispatchQueue;
    _fetcherService = fetcherService;
    _requestErrorCode = WCRequestErrorCodeNoError;
  }
  return self;
}

- (NSString *)responseHeaderForName:(NSString *)name {
  return [_response valueForHTTPHeaderField:name];
}

- (int)status {
  return (int)_fetcher.statusCode;
}

#pragma mark - WCHTTPRequest

- (void)sendPOST:(NSURL *)URL
        withData:(NSData *)POSTData
     withHeaders:(NSDictionary<NSString *, NSString *> *)headers
         timeout:(NSTimeInterval)timeout {
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:URL];
  request.HTTPMethod = @"POST";
  request.timeoutInterval = timeout;
  request.HTTPBody = POSTData;
  request.allHTTPHeaderFields = headers;

  [self beginFetchWithRequest:request];
}

- (void)sendGET:(NSURL *)URL
    withHeaders:(NSDictionary<NSString *, NSString *> *)headers
        timeout:(NSTimeInterval)timeout {
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:URL];
  request.HTTPMethod = @"GET";
  request.timeoutInterval = timeout;
  request.allHTTPHeaderFields = headers;

  [self beginFetchWithRequest:request];
}

- (void)abort {
  [_fetcher stopFetching];
}

- (void)beginFetchWithRequest:(NSURLRequest *)request {
  _fetcher = [_fetcherService fetcherWithRequest:request];
  _fetcher.callbackQueue = _dispatchQueue;
#if DEBUG
  _fetcher.allowLocalhostRequest = YES;
#endif

  __weak WCDefaultHTTPRequest *weakSelf = self;
  _fetcher.didReceiveResponseBlock =
      ^(NSURLResponse *response,
        GTMSessionFetcherDidReceiveResponseDispositionBlock completionHandler) {
        WCDefaultHTTPRequest *strongSelf = weakSelf;
        if (strongSelf) {
          strongSelf->_response = (NSHTTPURLResponse *)response;
          strongSelf->_requestReadyState = WCRequestReadyStateLoaded;
          [strongSelf->_requestReadyStateChangeHandler stateChangedForRequest:strongSelf
                                                                 responseData:NULL];
        }
        completionHandler(NSURLSessionResponseAllow);
      };

  _fetcher.accumulateDataBlock = ^(NSData *data) {
    WCDefaultHTTPRequest *strongSelf = weakSelf;
    if (strongSelf) {
      strongSelf->_requestReadyState = WCRequestReadyStateInteractive;
      [strongSelf->_requestReadyStateChangeHandler stateChangedForRequest:strongSelf
                                                             responseData:data];
    }
  };

  [_fetcher beginFetchWithCompletionHandler:^(NSData *data, NSError *error) {
    WCDefaultHTTPRequest *strongSelf = weakSelf;
    if (!strongSelf) {
      return;
    }
    if (error) {
      strongSelf->_requestErrorCode = [strongSelf errorCodeForError:error];
    } else {
      if (strongSelf->_fetcher.statusCode != 200) {
        strongSelf->_requestErrorCode = WCRequestErrorCodeHTTPError;
      }
    }
    strongSelf->_requestReadyState = WCRequestReadyStateComplete;
    [strongSelf->_requestReadyStateChangeHandler stateChangedForRequest:strongSelf
                                                           responseData:NULL];
  }];
}

- (WCRequestErrorCode)errorCodeForError:(NSError *)error {
  if ([error.domain isEqual:kGTMSessionFetcherStatusDomain]) {
    return WCRequestErrorCodeHTTPError;
  } else if ([error.domain isEqual:NSURLErrorDomain]) {
    if (error.code == NSURLErrorTimedOut) {
      return WCRequestErrorCodeTimeout;
    } else if (error.code == NSURLErrorCancelled) {
      return WCRequestErrorCodeAbort;
    } else {
      return WCRequestErrorCodeException;
    }
  } else {
    return WCRequestErrorCodeException;
  }
}

@end
