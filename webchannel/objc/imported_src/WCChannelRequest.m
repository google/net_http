#import "WCChannelRequest.h"

#import "WCHTTPRequest.h"
#import "WCLogger.h"
#import "WCSupport.h"
#import "WCTimer.h"
#import "WCWebChannelClientInternal.h"
#import "WCWireV8Binary.h"

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
static NSString *const kHeaderBinaryContentTypeValue = @"application/octet-stream";
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
  NSUInteger _chunkStart;
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

  if (!_successful) {
    NSString *responseText = [[NSString alloc] initWithData:_responseData
                                                   encoding:NSUTF8StringEncoding];
    [self handleReadyStateChangedFailureStatusCode:statusCode responseText:responseText];
    return;
  }

  if ([self shouldCheckInitialResponse] && ![self checkInitialResponse]) {
    return;
  }

  if (_chunkDecoded) {
    [self decodeNextChunks:_responseData state:readyState];
  } else {
    [_support.logger logHTTPChannelResponseText:WCDataToLogString(_responseData)
                                             ID:_requestID
                                           desc:nil];
    [self didReceiveRequestData:_responseData isBinary:NO];
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
  NSData *initialResponseData = [initialResponse dataUsingEncoding:NSUTF8StringEncoding];
  [self didReceiveRequestData:initialResponseData isBinary:NO];
  return YES;
}

- (void)didReceiveRequestData:(NSData *)data isBinary:(BOOL)isBinary {
  [_delegate didReceiveInput:data isBinary:isBinary withRequest:self];

  [_support notifyServerReachabilityEvent:WCServerReachabilityBackChannelActivity];
}

- (NSString *)getInitialResponse {
  return [_request responseHeaderForName:kWCXHTTPInitialResponse];
}

static NSString *WCDataToLogString(NSData *data) {
  if (!data) {
    return @"";
  }
  return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding] ?: data.description;
}

/**
 * Calculates the number of UTF-8 encoded bytes in @c data starting from @c offset
 * that correspond to @c utf16CodeUnitsCount UTF-16 code units.
 *
 * @param data The buffer containing UTF-8 encoded bytes.
 * @param offset The starting index in @c data.
 * @param utf16CodeUnitsCount The target number of UTF-16 code units.
 * @return The byte length of the prefix, or 0 if invalid or incomplete UTF-8.
 */
static NSUInteger WCUTF16PrefixLengthInBytes(NSData *data, NSUInteger offset,
                                             NSUInteger utf16CodeUnitsCount) {
  if (offset >= data.length) return 0;
  const uint8_t *bytes = data.bytes;
  NSUInteger length = data.length;
  NSUInteger utf16Count = 0;
  NSUInteger byteIndex = offset;

  while (byteIndex < length && utf16Count < utf16CodeUnitsCount) {
    uint8_t b = bytes[byteIndex];
    if ((b & 0x80) == 0) {
      utf16Count++;
      byteIndex++;
    } else if ((b & 0xE0) == 0xC0) {
      utf16Count++;
      byteIndex += 2;
    } else if ((b & 0xF0) == 0xE0) {
      utf16Count++;
      byteIndex += 3;
    } else if ((b & 0xF8) == 0xF0) {
      utf16Count += 2;
      byteIndex += 4;
    } else {
      return 0;  // Invalid
    }
  }

  if (utf16Count == utf16CodeUnitsCount && byteIndex <= length) {
    return byteIndex - offset;
  }
  return 0;  // Incomplete
}

- (void)decodeNextChunks:(NSData *)responseData state:(WCRequestReadyState)readyState {
  BOOL decodeNextChunksSuccessful = YES;
  while (!_cancelled && _chunkStart < responseData.length) {
    WCChannelRequestDecodeResult result;
    BOOL isBinary = NO;
    NSData *chunkData = [self nextChunkFromResponseData:responseData
                                                 result:&result
                                               isBinary:&isBinary];
    if (result == WCChannelRequestDecodeResultIncomplete) {
      if (readyState == WCRequestReadyStateComplete) {
        _lastError = WCChannelRequestErrorBadData;
        [_support notifyStatEvent:WCRequestStatRequestIncompleteData];
        decodeNextChunksSuccessful = NO;
      }
      [_support.logger logHTTPChannelResponseText:WCDataToLogString(responseData)
                                               ID:_requestID
                                             desc:@"[Incomplete Response]"];
      break;
    } else if (result == WCChannelRequestDecodeResultInvalid) {
      _lastError = WCChannelRequestErrorBadData;
      [_support notifyStatEvent:WCRequestStatRequestBadData];
      [_support.logger logHTTPChannelResponseText:WCDataToLogString(responseData)
                                               ID:_requestID
                                             desc:@"[Invalid Chunk]"];
      decodeNextChunksSuccessful = NO;
      break;
    } else {
      NSString *chunkLogText = isBinary ? chunkData.description : WCDataToLogString(chunkData);
      [_support.logger logHTTPChannelResponseText:chunkLogText ID:_requestID desc:nil];
      [self didReceiveRequestData:chunkData isBinary:isBinary];
    }
  }
  if (readyState == WCRequestReadyStateComplete && responseData.length == 0) {
    _lastError = WCChannelRequestErrorNoData;
    [_support notifyStatEvent:WCRequestStatRequestNoData];
    decodeNextChunksSuccessful = NO;
  }
  _successful = _successful && decodeNextChunksSuccessful;
  if (!decodeNextChunksSuccessful) {
    [_support.logger logHTTPChannelResponseText:WCDataToLogString(responseData)
                                             ID:_requestID
                                           desc:@"[Invalid Chunk]"];
    [self cleanup];
    [self dispatchFailure];
  } else {
    if (responseData.length > 0 && !_firstByteReceived) {
      _firstByteReceived = YES;
      NSString *responseText = [[NSString alloc] initWithData:responseData
                                                     encoding:NSUTF8StringEncoding];
      [_delegate didReceivedFirstByteOfRequest:self responseText:responseText ?: @""];
    }
  }
}

- (NSData *)nextChunkFromResponseData:(NSData *)responseData
                               result:(WCChannelRequestDecodeResult *)result
                             isBinary:(BOOL *)isBinaryChunk {
  if (isBinaryChunk) {
    *isBinaryChunk = NO;
  }
  NSUInteger sizeStartIndex = _chunkStart;
  NSData *newlineData = [NSData dataWithBytes:"\n" length:1];
  NSRange newlineRange =
      [responseData rangeOfData:newlineData
                        options:0
                          range:NSMakeRange(sizeStartIndex, responseData.length - sizeStartIndex)];
  if (newlineRange.location == NSNotFound) {
    if (result) {
      *result = WCChannelRequestDecodeResultIncomplete;
    }
    return nil;
  }

  NSData *headerData = [responseData
      subdataWithRange:NSMakeRange(sizeStartIndex, newlineRange.location - sizeStartIndex)];
  NSString *sizeAsString = [[NSString alloc] initWithData:headerData encoding:NSUTF8StringEncoding];
  if (!sizeAsString) {
    if (result) {
      *result = WCChannelRequestDecodeResultInvalid;
    }
    return nil;
  }

  NSString *sizePart = nil;
  BOOL isBinary = [WCWireV8Binary isBinaryChunk:sizeAsString sizePart:&sizePart];
  if (isBinaryChunk) {
    *isBinaryChunk = isBinary;
  }

  NSScanner *scanner = [NSScanner scannerWithString:sizePart];
  int size = 0;
  if (![scanner scanInt:&size] || ![scanner isAtEnd] || size < 0) {
    if (result) {
      *result = WCChannelRequestDecodeResultInvalid;
    }
    return nil;
  }

  NSUInteger chunkStartIndex = newlineRange.location + 1;
  NSUInteger chunkByteLength = 0;

  if (isBinary) {
    // In binary mode, size is measured in exact bytes.
    if (responseData.length - chunkStartIndex < (NSUInteger)size) {
      if (result) {
        *result = WCChannelRequestDecodeResultIncomplete;
      }
      return nil;
    }
    chunkByteLength = (NSUInteger)size;
  } else {
    // In text mode, size is in UTF-16 code units, not bytes.
    NSUInteger byteLength =
        WCUTF16PrefixLengthInBytes(responseData, chunkStartIndex, (NSUInteger)size);
    if (byteLength == 0 && size > 0) {
      if (result) {
        *result = WCChannelRequestDecodeResultIncomplete;
      }
      return nil;
    }
    chunkByteLength = byteLength;
  }

  if (chunkStartIndex + chunkByteLength > responseData.length) {
    if (result) {
      *result = WCChannelRequestDecodeResultIncomplete;
    }
    return nil;
  }

  NSData *chunkData = [responseData subdataWithRange:NSMakeRange(chunkStartIndex, chunkByteLength)];
  _chunkStart = chunkStartIndex + chunkByteLength;

  if (result) {
    *result = WCChannelRequestDecodeResultSuccess;
  }
  return chunkData;
}

@end
