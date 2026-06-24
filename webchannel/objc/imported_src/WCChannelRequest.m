#import "WCChannelRequest.h"

#import "WCHTTPRequest.h"
#import "WCLogger.h"
#import "WCSupport.h"
#import "WCTimer.h"
#import "WCWebChannelClientInternal.h"

typedef NS_ENUM(NSInteger, WCChannelRequestType) {
  WCChannelRequestTypeSendRequest,
  WCChannelRequestTypeCloseRequest,
};

typedef NS_ENUM(NSInteger, WCChannelRequestDecodeResult) {
  WCChannelRequestDecodeResultSuccess,
  WCChannelRequestDecodeResultIncomplete,
  WCChannelRequestDecodeResultInvalid,
};

static const long kChannelRequestDefaultTimeout = 45;
static const int kDefaultRetryID = 1;
static const int kStatusCodeOK = 200;
static const int kStatusCodeBadRequest = 400;

static NSString *const kQueryItemNameT = @"t";
static NSString *const kHeaderContentTypeValue = @"application/x-www-form-urlencoded";
static NSString *const kHeaderBinaryContentTypeValue =
    @"application/vnd.google.octet-stream-compressible";
static NSString *const kHeaderContentTypeKey = @"Content-Type";
static NSString *const kHTTPMethodGET = @"GET";
static NSString *const kHTTPMethodPOST = @"POST";
static NSString *const kUnknownSessionID = @"Unknown SID";
static NSString *const kPageIDKey = @"X-Goog-PageId";

@implementation WCChannelRequest {
  id<WCSupport> _support;
  __weak id<WCWebChannelInternalHTTPHandler> _delegate;
  BOOL _decodeInitialResponse;
  BOOL _chunkDecoded;

  // True if request "clean up" has already happened and no more callebacks should be handled.
  BOOL _cleanedUp;

  id<WCTimer> _readyStateTimer;
  int _chunkStart;
  WCChannelRequestType _type;
  NSURLComponents *_baseURLComponent;
}

- (instancetype)initWithSessionID:(NSString *)sessionID
                        requestID:(NSString *)requestID
                          support:(id<WCSupport>)support
                         delegate:(id<WCWebChannelInternalHTTPHandler>)delegate
                          retryID:(int)retryID {
  self = [super init];
  if (self) {
    _sessionID = sessionID;
    _requestID = requestID;
    _retryID = retryID;
    _support = support;
    _delegate = delegate;
    _timeout = kChannelRequestDefaultTimeout;
    _responseData = [[NSMutableData alloc] init];
    _lastStatusCode = -1;
  }
  return self;
}

- (instancetype)initWithSessionID:(NSString *)sessionID
                        requestID:(NSString *)requestID
                          support:(id<WCSupport>)support
                         delegate:(id<WCWebChannelInternalHTTPHandler>)delegate {
  return [self initWithSessionID:sessionID
                       requestID:requestID
                         support:support
                        delegate:delegate
                         retryID:kDefaultRetryID];
}

- (void)sendPOST:(NSURLComponents *)URLComponents
        withData:(NSString *)data
    chunkDecoded:(BOOL)chunkDecoded {
  _type = WCChannelRequestTypeSendRequest;
  _baseURLComponent = URLComponents;
  _POSTData = [data dataUsingEncoding:NSUTF8StringEncoding];
  _chunkDecoded = chunkDecoded;
  _POST = YES;
  [self send];
}

- (void)sendPOST:(NSURLComponents *)URLComponents
    withPostData:(NSData *)postData
    chunkDecoded:(BOOL)chunkDecoded {
  _type = WCChannelRequestTypeSendRequest;
  _baseURLComponent = URLComponents;
  _POSTData = postData;
  _chunkDecoded = chunkDecoded;
  _POST = YES;
  [self send];
}

- (void)sendGET:(NSURLComponents *)URLComponents chunkDecoded:(BOOL)chunkDecoded {
  _type = WCChannelRequestTypeSendRequest;
  _baseURLComponent = URLComponents;
  _chunkDecoded = chunkDecoded;
  _POST = NO;
  [self send];
}

- (void)closeWithURLComponents:(NSURLComponents *)URLComponents {
  _type = WCChannelRequestTypeCloseRequest;
  _baseURLComponent = URLComponents;
  _POST = NO;

  _request = [_support HTTPRequest:self];
  [_request sendGET:_baseURLComponent.URL withHeaders:nil timeout:_timeout];
  _requestStartTime = [NSDate now];
  [self startReadyStateTimer];
}

- (void)cancel {
  _cancelled = YES;
  [self cleanup];
}

- (BOOL)isLastErrorFatal {
  return _lastError == WCChannelRequestErrorUnknownSessionId ||
         (_lastError == WCChannelRequestErrorStatus && _lastStatusCode > 0);
}

- (NSString *)formatErrorToString:(WCChannelRequestError)error {
  NSString *result = nil;
  switch (error) {
    case WCChannelRequestErrorStatus:
      result = @"WCChannelRequestError Status";
      break;
    case WCChannelRequestErrorNoData:
      result = @"WCChannelRequestError NoData";
      break;
    case WCChannelRequestErrorTimeout:
      result = @"WCChannelRequestError Timeout";
      break;
    case WCChannelRequestErrorUnknownSessionId:
      result = @"WCChannelRequestErrorUnknown SessionId";
      break;
    case WCChannelRequestErrorBadData:
      result = @"WCChannelRequestError BadData";
      break;
    case WCChannelRequestErrorHandlerException:
      result = @"WCChannelRequestError HandlerException";
      break;
    default:
      result = @"WCChannelRequestError BrowserOffline";
  }
  return result;
}

#pragma mark - WCRequestStateChangedHandler

- (void)stateChangedForRequest:(id<WCHTTPRequest>)request responseData:(NSData *)data {
  if (_cleanedUp) {
    // Stop handling new state changes when request has been cleaned up.
    return;
  }

  if (![request isEqual:_request]) {
    [_support.logger logWarning:[NSString stringWithFormat:@"Called back with an unexpected http request%@, %@", request, _request]];
    return;
  }
  [_responseData appendData:data];
  [self handleReadyStateChange];
}

#pragma mark - Private

- (void)send {
  _requestStartTime = [NSDate date];
  [self startReadyStateTimer];

  NSURLQueryItem *queryItem =
      [NSURLQueryItem queryItemWithName:kQueryItemNameT value:[NSString stringWithFormat:@"%d", _retryID]];
  NSMutableArray<NSURLQueryItem *> *queryItems = [_baseURLComponent.queryItems mutableCopy];
  [queryItems addObject:queryItem];
  [_baseURLComponent setQueryItems:queryItems];
  _chunkStart = 0;

  _request = [_support HTTPRequest:self];

  NSMutableDictionary<NSString *, NSString *> *headers = [NSMutableDictionary dictionary];
  if (_extraHeaders != nil) {
    [headers addEntriesFromDictionary:_extraHeaders];
  }
  if (_POST) {
    if (_isBinaryMessage) {
      [headers setObject:kHeaderBinaryContentTypeValue forKey:kHeaderContentTypeKey];
    } else {
      [headers setObject:kHeaderContentTypeValue forKey:kHeaderContentTypeKey];
    }
    [_request sendPOST:_baseURLComponent.URL withData:_POSTData withHeaders:headers timeout:_timeout];
  } else {
    [_request sendGET:_baseURLComponent.URL withHeaders:headers timeout:_timeout];
  }
  [_support notifyServerReachabilityEvent:WCServerReachabilityRequestMade];
  [_support.logger logHTTPRequest:_POST ? kHTTPMethodPOST : kHTTPMethodGET
                              URL:_baseURLComponent.URL
                               ID:_requestID
                          attempt:_retryID
                         postData:_POSTData.description];
}

- (void)cleanup {
  [self cancelReadyStateTimer];
  if (_request) {
    [_request abort];
    _request = nil;

    // Setting `_request.requestReadyStateChangeHandler` => `nil` will cause the retain count of
    // this request object to go to 0 and cause it to be immediately dealloc'ed, causing crashes.
    // Instead, a "clean up" bit is used to indicate that no further request callbacks will be
    // handled.
    //
    // This request object will dealloc'ed when dealloc of the underlying `_request` happens (there
    // won't be a retain cycle since `request` is set to `nil` above).
    _cleanedUp = YES;
  }
}

- (void)cancelReadyStateTimer {
  [_support clearTimeout:_readyStateTimer];
  _readyStateTimer = nil;
}

- (void)startReadyStateTimer {
  __weak __typeof__(self) weakSelf = self;
  _readyStateTimer = [_support setTimeout:_timeout
                                    block:^{
                                      __typeof__(self) strongSelf = weakSelf;
                                      if (strongSelf) {
                                        [strongSelf handleTimeout];
                                      }
                                    }];
}

- (void)handleTimeout {
  if (_successful) {
    [_support.logger logError:@"Received readyStateTimer timeout even though request loaded successfully"];
  }
  [_support.logger
      logInfo:[NSString stringWithFormat:@"TIMEOUT: %@", _baseURLComponent.URL.absoluteString]];

  if (_type != WCChannelRequestTypeCloseRequest) {
    [_support notifyServerReachabilityEvent:WCServerReachabilityFailed];
    [_support notifyStatEvent:WCRequestStatRequestTimeout];
  }

  [self cleanup];
  _lastError = WCChannelRequestErrorTimeout;
  [self dispatchFailure];
}

- (void)dispatchFailure {
  if (_cancelled) {
    return;
  }
  [_delegate handleCompleteRequest:self];
}

- (void)handleReadyStateChange {
  WCRequestReadyState readyState = _request.requestReadyState;
  WCRequestErrorCode errorCode = _request.requestErrorCode;
  int statusCode = _request.status;
  if (readyState < WCRequestReadyStateInteractive ||
      (readyState == WCRequestReadyStateInteractive && _responseData.length == 0)) {
    return;
  }

  [self notifyServerReachabilityOnReadyState:readyState errorCode:errorCode statusCode:statusCode];

  [self cancelReadyStateTimer];

  _lastStatusCode = statusCode;
  if (_responseData.length == 0) {
    [_support.logger logDebug:[NSString stringWithFormat:@"No response text for uri %@ status %d.",
                                                         _baseURLComponent.string, statusCode]];
  }
  _successful = statusCode == kStatusCodeOK;

  [_support.logger logHTTPChannelResponseMetaData:_POST ? kHTTPMethodPOST : kHTTPMethodGET
                                              URL:_baseURLComponent.URL
                                               ID:_requestID
                                          attempt:_retryID
                                            state:readyState
                                       statusCode:statusCode];

  NSString *responseText = [[NSString alloc] initWithData:_responseData
                                                 encoding:NSUTF8StringEncoding];
  if (!_successful) {
    [self handleReadyStateChangedFailureStatusCode:statusCode responseText:responseText];
    return;
  }

  if ([self shouldCheckInitialResponse] && ![self checkInitialResponse]) {
    return;
  }

  if (_chunkDecoded) {
    [self decodeNextChunks:responseText state:readyState];
  } else {
    [_support.logger logHTTPChannelResponseText:_responseData.description ID:_requestID desc:nil];
    [self didReceiveRequestData:responseText];
  }

  if (readyState == WCRequestReadyStateComplete) {
    [self cleanup];
  }

  if (!_successful) {
    return;
  }

  if (!_cancelled) {
    [self handleReadyStateChangeNotCancelled:readyState];
  }
}

- (void)handleReadyStateChangeNotCancelled:(WCRequestReadyState)readyState {
  if (readyState == WCRequestReadyStateComplete) {
    [_delegate handleCompleteRequest:self];
  } else {
    _successful = NO;
    [self startReadyStateTimer];
  }
}

- (void)handleReadyStateChangedFailureStatusCode:(int)statusCode
                                    responseText:(NSString *)responseText {
  if (statusCode == kStatusCodeBadRequest &&
      [responseText rangeOfString:kUnknownSessionID].location != NSNotFound) {
    _lastError = WCChannelRequestErrorUnknownSessionId;
    [_support notifyStatEvent:WCRequestStatRequestUnknownSessionId];
  } else {
    _lastError = WCChannelRequestErrorStatus;
    [_support notifyStatEvent:WCRequestStatRequestBadStatus];
  }
  [self cleanup];
  [self dispatchFailure];
}

- (void)notifyServerReachabilityOnReadyState:(WCRequestReadyState)readyState
                                   errorCode:(WCRequestErrorCode)errorCode
                                  statusCode:(int)statusCode {
  if (!_cancelled && readyState == WCRequestReadyStateComplete &&
      errorCode != WCRequestErrorCodeAbort) {
    if (errorCode == WCRequestErrorCodeTimeout || statusCode <= 0) {
      [_support notifyServerReachabilityEvent:WCServerReachabilityFailed];
    } else {
      [_support notifyServerReachabilityEvent:WCServerReachabilitySucceed];
    }
  }
}

- (BOOL)shouldCheckInitialResponse {
  return _decodeInitialResponse && !_initialResponseDecoded;
}

- (BOOL)checkInitialResponse {
  NSString *initialResponse = [self getInitialResponse];
  if (initialResponse == nil) {
    _successful = NO;
    _lastError = WCChannelRequestErrorUnknownSessionId;
    [_support notifyStatEvent:WCRequestStatRequestUnknownSessionId];
    [self cleanup];
    [self dispatchFailure];
    return NO;
  }
  [_support.logger
      logHTTPChannelResponseText:initialResponse
                              ID:_requestID
                            desc:[NSString stringWithFormat:@"Initial handshake response via %@.",
                                                            kWCXHTTPInitialResponse]];

  _initialResponseDecoded = YES;
  [self didReceiveRequestData:initialResponse];
  return YES;
}

- (void)didReceiveRequestData:(NSString *)data {
  [_delegate didReceiveInput:data withRequest:self];

  [_support notifyServerReachabilityEvent:WCServerReachabilityBackChannelActivity];
}

- (NSString *)getInitialResponse {
  return [_request responseHeaderForName:kWCXHTTPInitialResponse];
}

- (void)decodeNextChunks:(NSString *)responseText state:(WCRequestReadyState)readyState {
  BOOL decodeNextChunksSuccessful = YES;
  while (!_cancelled && _chunkStart < responseText.length) {
    WCChannelRequestDecodeResult result;
    NSString *chunkText = [self nextChunkFromResponseText:responseText result:&result];
    if (result == WCChannelRequestDecodeResultIncomplete) {
      if (readyState == WCRequestReadyStateComplete) {
        _lastError = WCChannelRequestErrorBadData;
        [_support notifyStatEvent:WCRequestStatRequestIncompleteData];
        decodeNextChunksSuccessful = NO;
      }
      [_support.logger logHTTPChannelResponseText:responseText
                                               ID:_requestID
                                             desc:@"[Incomplete Response]"];
      break;
    } else if (result == WCChannelRequestDecodeResultInvalid) {
      _lastError = WCChannelRequestErrorBadData;
      [_support notifyStatEvent:WCRequestStatRequestBadData];
      [_support.logger logHTTPChannelResponseText:responseText
                                               ID:_requestID
                                             desc:@"[Invalid Chunk]"];
      decodeNextChunksSuccessful = NO;
      break;
    } else {
      NSString *chunkTextBuffer = [chunkText mutableCopy];
      [_support.logger logHTTPChannelResponseText:chunkTextBuffer ID:_requestID desc:nil];
      [self didReceiveRequestData:chunkTextBuffer];
    }
  }
  if (readyState == WCRequestReadyStateComplete && responseText.length == 0) {
    _lastError = WCChannelRequestErrorNoData;
    [_support notifyStatEvent:WCRequestStatRequestNoData];
    decodeNextChunksSuccessful = NO;
  }
  _successful = _successful && decodeNextChunksSuccessful;
  if (!decodeNextChunksSuccessful) {
    [_support.logger logHTTPChannelResponseText:responseText ID:_requestID desc:@"[Invalid Chunk]"];
    [self cleanup];
    [self dispatchFailure];
  } else {
    if (responseText.length > 0 && !_firstByteReceived) {
      _firstByteReceived = YES;
      [_delegate didReceivedFirstByteOfRequest:self responseText:responseText];
    }
  }
}

- (NSString *)nextChunkFromResponseText:(NSString *)responseText
                                 result:(WCChannelRequestDecodeResult *)result {
  int sizeStartIndex = _chunkStart;
  int sizeEndIndex =
      [responseText rangeOfString:@"\n"
                          options:0
                            range:NSMakeRange(sizeStartIndex, responseText.length - sizeStartIndex)]
          .location;
  if (sizeEndIndex == NSNotFound) {
    if (result) {
      *result = WCChannelRequestDecodeResultIncomplete;
    }
    return nil;
  }

  NSString *sizeAsString =
      [responseText substringWithRange:NSMakeRange(sizeStartIndex, sizeEndIndex - sizeStartIndex)];
  NSScanner *scanner = [NSScanner scannerWithString:sizeAsString];
  int size = 0;
  if (![scanner scanInt:&size] || ![scanner isAtEnd]) {
    if (result) {
      *result = WCChannelRequestDecodeResultInvalid;
    }
    return nil;
  }

  if (size < 0) {
    if (result) {
      *result = WCChannelRequestDecodeResultInvalid;
    }
    return nil;
  }

  int chunkStartIndex = sizeEndIndex + 1;
  if (chunkStartIndex + size > responseText.length) {
    if (result) {
      *result = WCChannelRequestDecodeResultIncomplete;
    }
    return nil;
  }

  NSString *chunkText = [responseText substringWithRange:NSMakeRange(chunkStartIndex, size)];
  _chunkStart = chunkStartIndex + size;
  if (result) {
    *result = WCChannelRequestDecodeResultSuccess;
  }
  return chunkText;
}

@end
