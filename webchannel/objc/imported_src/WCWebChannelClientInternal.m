#import "WCWebChannelClientInternal.h"
#import "WCTimer.h"
#import "WCHTTPRequest.h"
#import "WCLogger.h"
#import "WCChannelRequest.h"
#import "WCFailureRecoveryContext.h"
#import "WCForwardChannelRequestPool.h"
#import "WCInternalChannelParams.h"
#import "WCOptions.h"
#import "WCQueuedMap.h"
#import "WCRuntimeProperties+Private.h"
#import "WCRuntimeProperties.h"
#import "WCSupport.h"
#import "WCWebChannelClient.h"
#import "WCWebChannelClientReadWrite.h"
#import "WCWireV8.h"
#import "WCWireV8Binary.h"
#import <GTMSessionFetcher/GTMSessionFetcherService.h>

static const int kDecodeLevelOne = 1;
static const int kResponseArrayCountThree = 3;
static const int kDecodeLevelThree = 3;
static const int kPostResponseCountIndex = 1;
static const int kBackChannelIDIndex = 0;
static const double kBackChannelRequestTimeoutMultiplier = 2.1;
static const int kResponseOpen = 0;

static NSString *const kQueryItemNameRID = @"RID";
static NSString *const kQueryItemNameCVER = @"CVER";
static NSString *const kQueryItemNameVER = @"VER";
static NSString *const kQueryItemNameType = @"TYPE";
static NSString *const kQueryItemValueTerminate = @"terminate";
static NSString *const kQueryItemValueXMLHTTP = @"xmlhttp";
static NSString *const kQueryItemValueInit = @"init";
static NSString *const kQueryItemNameRequest = @"$req";
static NSString *const kGETRequestID = @"rpc";
static NSString *const kQueryItemNameFastHandshakeSID = @"sid";
static NSString *const kQueryItemNameSID = @"SID";
static NSString *const kQueryItemNameAID = @"AID";
static NSString *const kQueryItemValueNull = @"null";
static NSString *const kQueryItemNameOSID = @"OSID";
static NSString *const kQueryItemNameOAID = @"OAID";
static NSString *const kQueryItemCI = @"CI";
static NSString *const kNumberZero = @"0";
static NSString *const kNumberOne = @"1";
static NSString *const kResponseStop = @"stop";
static NSString *const kResponseClose = @"close";
static NSString *const kResponseNoop = @"noop";
static NSString *const kBackChannelMissing = @"0";
static NSString *const kQueryParamCharacterComma = @",";
static NSString *const kQueryParamCharacterEncodedComma = @"%2C";

@interface WCWebChannelClientInternal () <WCWebChannelInternalHTTPHandler>
@end

@implementation WCWebChannelClientInternal {
  WCConnectionState *_connectionState;
  int _serverVersion;
  int _clientVersion;
  NSString *_path;

  id<WCTimer> _forwardChannelDelayTimer;
  id<WCTimer> _backChannelDelayTimer;
  id<WCTimer> _deadBackChannelTimer;
  id<WCTimer> _bufferProxyDetectionTimer;
  NSTimeInterval _handshakeRTT;
  NSTimeInterval _baseRetryDelay;
  NSTimeInterval _retryDelaySeed;
  NSTimeInterval _backChannelRequestTimeout;

  int _nextRequestID;
  int _nextMapID;
  int _forwardChannelRetryCount;
  int _backChannelAttemptID;
  BOOL _failFast;
  BOOL _detectBufferingProxy;
  BOOL _fastHandshake;
  BOOL _blockingHandshake;
  BOOL _enableBinaryEncoding;
  BOOL _bufferProxyDetectionDone;
  BOOL _sendRawJSON;
  BOOL _forwardRetryPendingMessagesScheduled;
  BOOL _forwardChannelRequestInProgress;
  BOOL _backChannelRequestInProgress;

  id<WCSupport> _support;

  NSMutableArray<WCQueuedMap *> *_nonAckedMapsWithClosedChannel;

  dispatch_queue_t _dispatchQueue;
}

- (instancetype)initWithURL:(NSString *)baseURL
                    options:(WCOptions *)options
            connectionState:(WCConnectionState *)connectionState
              clientVersion:(int)clientVersion
                   delegate:(id<WCWebChannelClientHandlerDelegate>)delegate
                    support:(id<WCSupport>)support {
  self = [super init];
  if (self) {
    WCInternalChannelParams *internalChannelParams =
        options.internalChannelParams ?: [[WCInternalChannelParams alloc] init];
    _path = [baseURL copy];
    _extraParams = @{};
    _delegate = delegate;
    _connectionState = connectionState;
    _clientVersion = clientVersion > 0 ? clientVersion : kWCClientVersion;
    _support = support;
    _runtimeProperties = [[WCRuntimeProperties alloc] initWithChannel:self];

    _outgoingMaps = [@[] mutableCopy];
    _wireCodec = [[WCWireV8 alloc] initWithSupport:_support];
    _wireCodecBinary = [[WCWireV8Binary alloc] initWithSupport:_support];
    _failFast = internalChannelParams.failFast;
    if (options.fastHandshake && options.enableBinaryEncoding) {
      [_support.logger logWarning:@"Ignore fastHandshake because binary encoding is set."];
      // It's not safe to overwrite enable_binary_encoding to false
      _fastHandshake = NO;
    } else {
      _fastHandshake = options.fastHandshake;
    }
    _enableBinaryEncoding = options.enableBinaryEncoding;
    _streamingEnabled = YES;
    _lastResponseCount = -1;
    _lastPostResponseCount = -1;
    _lastStatusCode = -1;
    _baseRetryDelay = internalChannelParams.baseRetryDelay;
    _retryDelaySeed = internalChannelParams.retryDelaySeed;
    _forwardChannelMaxRetries = internalChannelParams.forwardChannelMaxRetries;
    _backChannelMaxRetries = kWCDefaultBackChannelMaxRetries;
    _forwardChannelRequestTimeout = internalChannelParams.forwardChannelRequestTimeout;
    _sessionID = @"";
    _forwardChannelRequestPool = [[WCForwardChannelRequestPool alloc]
        initWithMaxPoolSize:options.concurrentRequestLimit ?: 0];

    [self configureByOptions:options];
    _channelVersion = kWCLastChannelVersion;
    _state = WCWebChannelClientStateInit;
    _dispatchQueue = support.dispatchQueue;
  }
  return self;
}

#pragma mark - public APIs

- (void)open {
  [self connectWithSessionID:nil responseID:nil];
}

- (void)close {
  [self disconnect];
}

- (void)send:(NSString *)message {
  if (_enableBinaryEncoding && _serverVersion > 0 && _serverVersion < 13) {
    [_support.logger
        logError:[NSString
                     stringWithFormat:@"Binary encoding is not supported by server version %d.",
                                      _serverVersion]];
    return;
  }
  NSMutableDictionary<NSString *, NSString *> *rawJSON = [NSMutableDictionary dictionary];
  rawJSON[kRawDataKey] = message;
  [self sendMap:rawJSON context:nil];
}

- (void)sendData:(NSData *)data {
  if (!_enableBinaryEncoding) {
    [_support.logger logError:@"Binary encoding is not enabled."];
    return;
  }
  if (_serverVersion > 0 && _serverVersion < 13) {
    [_support.logger
        logError:[NSString
                     stringWithFormat:@"Binary encoding is not supported by server version %d.",
                                      _serverVersion]];
    return;
  }
  NSMutableDictionary<NSString *, id> *rawJSON = [NSMutableDictionary dictionary];
  rawJSON[kRawDataKey] = data;
  [self sendMap:rawJSON context:nil];
}


#pragma mark - WCWebChannelInternalHTTPHandler

- (void)didReceiveInput:(NSData *)response withRequest:(WCChannelRequest *)request {
  WCWebChannelClientState currentState = self.state;
  if (currentState == WCWebChannelClientStateClosed ||
      !([_backChannelRequest isEqual:request] || [_forwardChannelRequestPool hasRequest:request])) {
    return;
  }

  if (response == nil) {
    return;
  }

  if (!request.initialResponseDecoded && [_forwardChannelRequestPool hasRequest:request] &&
      currentState == WCWebChannelClientStateOpened) {
    NSArray<id> *responseArray = [_wireCodec decodeMessage:response level:kDecodeLevelOne];
    if (responseArray.count == kResponseArrayCountThree) {
      [self handlePOSTResponse:responseArray request:request];
      [self checkForwardChannelFlush];
    } else {
      [_support.logger logDebug:@"Bad POST response returned."];
      [self signalError:WCWebChannelClientErrorBadResponse];
    }
  } else {
    if (request.initialResponseDecoded || [_backChannelRequest isEqual:request]) {
      [self clearDeadBackchannelTimer];
    }
    NSArray<id> *decodedResponse = [_wireCodec decodeMessage:response level:kDecodeLevelThree];
    [self processInput:decodedResponse request:request];
  }
}

- (void)handleCompleteRequest:(WCChannelRequest *)request {
  [_support.logger logDebug:@"Request Complete."];
  WCChannelType type;
  NSMutableArray<WCQueuedMap *> *pendingMessages = nil;
  if ([_backChannelRequest isEqual:request]) {
    [self clearDeadBackchannelTimer];
    [self clearBufferProxyDetectionTimer];
    _backChannelRequest = nil;
    type = WCChannelTypeBackChannel;
  } else if ([_forwardChannelRequestPool hasRequest:request]) {
    pendingMessages = request.pendingMessages;
    [_forwardChannelRequestPool removeRequest:request];
    type = WCChannelTypeForwardChannel;
  } else {
    return;
  }
  if (self.state == WCWebChannelClientStateClosed) {
    return;
  }
  _lastStatusCode = request.lastStatusCode;

  if (request.successful) {
    if (type == WCChannelTypeForwardChannel) {
      int size = request.POSTData.length;
      [_support
          notifyTimingEventWithSize:size
                            withRTT:[[NSDate date] timeIntervalSinceDate:request.requestStartTime]
                        withRetries:_forwardChannelRetryCount];
      [self checkForwardChannelAvailabilityThenStart];
      [self triggerSuccessRequest:request];
    } else {
      [self checkBackChannelAvailabilityThenStart];
    }
    return;
  }
  [self attemptRetryForFailedRequest:request channelType:type pendingMessages:pendingMessages];
}

- (void)didReceivedFirstByteOfRequest:(WCChannelRequest *)request
                         responseText:(NSString *)responseText {
  if ([_backChannelRequest isEqual:request] && !_bufferProxyDetectionDone &&
      _detectBufferingProxy) {
    [self clearBufferProxyDetectionTimer];
    _bufferProxyDetectionDone = YES;
    [_support notifyStatEvent:WCRequestStatNoProxy];
  }
}

#pragma mark - WebChannel client states internal handlers

- (void)triggerOpened {
  [_support.logger logInfo:[NSString stringWithFormat:@"WebChannel opened on %@", _path]];
  [self.delegate webChannelOpened:nil];
}

- (void)triggerClosedWithPendingData:(NSArray<WCQueuedMap *> *)pendingData
                     undeliveredData:(NSArray<WCQueuedMap *> *)undeliveredData {
  [_support.logger
      logInfo:[NSString
                  stringWithFormat:
                      @"WebChannel closed on %@ with pending data: %@ and undelivered data: %@",
                      _path, pendingData.description, undeliveredData.description]];

  [self.delegate webChannelClosed:nil];
}

- (void)triggerSuccessRequest:(WCChannelRequest *)request {
  // NO-OP
}

- (void)triggerDidReceiveMessage:(id)message {
  id<WCWebChannelClientHandlerDelegate> localDelegate = self.delegate;
  if (localDelegate == nil) {
    return;
  }
  if ([message respondsToSelector:@selector(allKeys)] && message[kMetadataHeadersKey] != nil) {
    NSDictionary<NSString *, NSString *> *headers = message[kMetadataHeadersKey];
    NSString *statusCodeValue = message[kMetadataStatusKey];
    int statusCode = statusCodeValue.intValue;
    [localDelegate webChannel:nil didReceiveHeaders:headers statusCode:statusCode];
    return;
  }

  if ([message respondsToSelector:@selector(allKeys)] && message[kMetadataKey] != nil) {
    id metadataJSON = message[kMetadataKey];
    if ([metadataJSON respondsToSelector:@selector(allKeys)]) {
      NSString *metadataKey = [[metadataJSON allKeys] firstObject];
      if (metadataKey != nil) {
        [localDelegate webChannel:nil didReceiveMetadata:metadataJSON[metadataKey] key:metadataKey];
      } else {
        [localDelegate webChannel:nil didReceiveMetadata:@"" key:@""];
      }
    }
  } else {
    [localDelegate webChannel:nil didReceiveMessage:message];
  }
}

- (void)triggerDidReceiveMultipleArrays:(NSArray<id> *)messages {
  // NO-OP
}

- (void)triggerEncounteredError:(WCWebChannelClientError)error {
  [_support.logger
      logInfo:[NSString stringWithFormat:@"WebChannel aborted on %@ due to channel error %ld",
                                         _path, (long)error]];
  [self.delegate webChannel:nil encounteredError:error];
}

#pragma mark - Private

- (void)configureByOptions:(WCOptions *)options {
  if (!options) {
    return;
  }
  NSMutableDictionary<NSString *, NSString *> *localMessageUrlParams =
      [self.extraParams mutableCopy];
  [localMessageUrlParams addEntriesFromDictionary:options.messageURLParams];
  NSMutableDictionary<NSString *, NSString *> *messageHeaders = [@{} mutableCopy];
  if (options.clientProtocolHeaderRequired) {
    messageHeaders[kWCXClientProtocol] = kWCXClientProtocolWebChannel;
  }
  if (options.messageHeaders) {
    [messageHeaders addEntriesFromDictionary:options.messageHeaders];
  }
  [self setExtraHeaders:messageHeaders];
  NSMutableDictionary<NSString *, NSString *> *initHeader =
      [options.initialMessageHeaders mutableCopy] ?: [@{} mutableCopy];
  initHeader[kWCXWebChannelContentType] = options.messageContentType;
  initHeader[kWCXWebChannelClientProfile] = options.clientProfile;
  self.initialHeaders = initHeader;
  _sendRawJSON = options.sendingRawJSON;
  if (options.HTTPSessionIDParam != nil) {
    NSString *HTTPSessionIDParam = [options.HTTPSessionIDParam
        stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
    if (HTTPSessionIDParam.length != 0) {
      self.HTTPSessionIDParam = HTTPSessionIDParam;
      [localMessageUrlParams removeObjectForKey:HTTPSessionIDParam];
    }
  }
  if (options.redactDisabled) {
    // debug info
  }
  _streamingEnabled = !options.longPollingForced;
  _detectBufferingProxy = !_fastHandshake && _streamingEnabled && options.detectBufferingProxy;
  _blockingHandshake = options.blockingHandshake;
  self.extraParams = [localMessageUrlParams copy];
}

- (void)sendMap:(NSDictionary<NSString *, NSString *> *)map context:(NSObject *)context {
  WCWebChannelClientState currentState = self.state;
  if (currentState == WCWebChannelClientStateClosed) {
    [_support.logger logWarning:@"Invalid operation: sending map when state is closed."];
  }
  if (_outgoingMaps.count == kWCMaxMapsPerRequest) {
    [_support.logger
        logError:[NSString stringWithFormat:@"Already have %d queued maps upon queueing %@.",
                                            kWCMaxMapsPerRequest, map.description]];
  }
  [_outgoingMaps addObject:[[WCQueuedMap alloc] initWithMapID:_nextMapID++
                                                          map:map
                                                      context:context]];
  if (currentState == WCWebChannelClientStateOpened) {
    [self checkForwardChannelAvailabilityThenStart];
  }
}

- (int)forwardChannelMaxRetries {
  return _failFast ? 0 : _forwardChannelMaxRetries;
}

- (void)connectWithSessionID:(NSString *)sessionID responseID:(NSString *)responseID {
  [_support notifyStatEvent:WCRequestStatConnectAttempt];
  WCWebChannelClientState currentState = self.state;
  NSMutableDictionary<NSString *, NSString *> *localMessageUrlParams =
      [self.extraParams mutableCopy];
  if (sessionID != nil && responseID != nil) {
    localMessageUrlParams[kQueryItemNameOSID] = sessionID;
    localMessageUrlParams[kQueryItemNameOAID] = responseID;
  }
  self.extraParams = [localMessageUrlParams copy];
  if (currentState == WCWebChannelClientStateInit ||
      currentState == WCWebChannelClientStateClosed) {
    _forwardChannelURL = [self createDataURL:_path];
    [self checkForwardChannelAvailabilityThenStart];
  }
}

- (void)checkForwardChannelAvailabilityThenStart {
  if (_forwardChannelRequestPool.full) {
    return;
  }
  if (_forwardChannelRequestInProgress) {
    return;
  }
  __weak typeof(self) weakSelf = self;
  dispatch_async(_dispatchQueue, ^{
    __strong typeof(self) strongSelf = weakSelf;
    if (!strongSelf) return;
    strongSelf->_forwardChannelRequestInProgress = NO;
    [strongSelf startForwardChannelWithRetryRequest:nil];
  });
  _forwardChannelRequestInProgress = YES;
  _forwardChannelRetryCount = 0;
}

- (void)checkBackChannelAvailabilityThenStart {
  if (_backChannelRequest != nil) {
    return;
  }
  if (_backChannelRequestInProgress) {
    return;
  }
  __weak typeof(self) weakSelf = self;
  dispatch_async(_dispatchQueue, ^{
    __strong typeof(self) strongSelf = weakSelf;
    if (!strongSelf) return;
    [strongSelf onStartBackChannelTimer];
  });
  _backChannelRequestInProgress = YES;
  _backChannelRetryCount = 0;
}

- (void)startForwardChannelWithRetryRequest:(WCChannelRequest *)retryRequest {
  WCWebChannelClientState currentState = self.state;
  _forwardChannelRequestInProgress = NO;
  if (![self shouldMakeRequest]) {
    return;
  }
  if (currentState == WCWebChannelClientStateInit) {
    if (retryRequest != nil) {
      return;
    }
    [self openForwardChannel];
  }
  if (currentState == WCWebChannelClientStateOpened) {
    if (retryRequest != nil) {
      [self makeForwardChannelRequest:retryRequest];
      return;
    }
    if (_outgoingMaps.count == 0) {
      [_support.logger logDebug:@"Nothing to send."];
      return;
    }
    if (_forwardChannelRequestPool.full) {
      [_support.logger logDebug:@"Connection already in progress."];
    }
    [self makeForwardChannelRequest:nil];
  }
}

- (void)openForwardChannel {
  [_support.logger logDebug:@"Opening Forward Channel."];
  _nextRequestID = arc4random_uniform(100000);
  NSString *requestID = [NSString stringWithFormat:@"%d", _nextRequestID++];
  WCChannelRequest *request = [[WCChannelRequest alloc] initWithSessionID:@""
                                                                requestID:requestID
                                                                  support:_support
                                                                 delegate:self];
  NSMutableDictionary<NSString *, NSString *> *extraHeaders = [_extraHeaders mutableCopy];
  [extraHeaders addEntriesFromDictionary:_initialHeaders];
  request.extraHeaders = extraHeaders;

  int max = _fastHandshake ? [self maxNumMessageForFastHandshake] : kWCMaxMapsPerRequest;
  NSURLComponents *components = [NSURLComponents componentsWithURL:_forwardChannelURL
                                           resolvingAgainstBaseURL:NO];
  [self addQueryParameterToURLComponents:components name:kQueryItemNameRID value:requestID];
  if (_clientVersion > 0) {
    [self addQueryParameterToURLComponents:components
                                      name:kQueryItemNameCVER
                                     value:[NSString stringWithFormat:@"%d", _clientVersion]];
  }
  if (_HTTPSessionIDParam.length > 0) {
    [self addQueryParameterToURLComponents:components
                                      name:kWCXHTTPSessionID
                                     value:_HTTPSessionIDParam];
  }
  if (_blockingHandshake) {
    [self addQueryParameterToURLComponents:components
                                      name:kQueryItemNameType
                                     value:kQueryItemValueInit];
  }

  if (_enableBinaryEncoding) {
    NSMutableData *requestData = [NSMutableData data];
    request.pendingMessages = [self pendingMessagesWithMaxBinary:max requestData:requestData];
    request.isBinaryMessage = YES;
    [_forwardChannelRequestPool addRequest:request];
    [request sendPOST:components withPostData:requestData chunkDecoded:YES];
  } else {
    NSMutableString *requestText = [@"" mutableCopy];
    request.pendingMessages = [self pendingMessagesWithMax:max requestText:requestText];
    [_forwardChannelRequestPool addRequest:request];

    if (_fastHandshake) {
      [self addQueryParameterToURLComponents:components
                                        name:kQueryItemNameRequest
                                       value:requestText];
      [self addQueryParameterToURLComponents:components
                                        name:kQueryItemNameFastHandshakeSID
                                       value:kQueryItemValueNull];
      request.initialResponseDecoded = YES;
      [request sendPOST:components withData:nil chunkDecoded:YES];
    } else {
      [request sendPOST:components withData:requestText chunkDecoded:YES];
    }
  }
  // Make sure we send the POST request out, then flip the state.
  _state = WCWebChannelClientStateOpening;
}

- (NSURL *)createDataURL:(NSString *)path {
  NSURLComponents *components = [NSURLComponents componentsWithString:path];
  if (_HTTPSessionIDParam && _HTTPSessionIDParam.length > 0 && _HTTPSessionID &&
      _HTTPSessionID.length > 0) {
    [self addQueryParameterToURLComponents:components
                                      name:_HTTPSessionIDParam
                                     value:_HTTPSessionID];
  }
  [self addQueryParameterToURLComponents:components
                                    name:kQueryItemNameVER
                                   value:[NSString stringWithFormat:@"%d", _channelVersion]];
  [self addAdditionalParams:components];
  return components.URL;
}

- (void)addAdditionalParams:(NSURLComponents *)components {
  if (self.extraParams != nil) {
    for (NSString *key in self.extraParams.allKeys) {
      [self addQueryParameterToURLComponents:components name:key value:self.extraParams[key]];
    }
  }
}

- (void)onStartBackChannelTimer {
  [self clearBackChannelDelayTimer];
  _backChannelRequestInProgress = NO;
  [self startBackChannel];
  if (!_detectBufferingProxy || _bufferProxyDetectionDone || _backChannelRequest == nil ||
      _handshakeRTT <= 0) {
    return;
  }
  NSTimeInterval bufferProxyDetectionTimeout = 4 * _handshakeRTT;
  __weak __typeof__(self) weakSelf = self;
  _bufferProxyDetectionTimer = [_support setTimeout:bufferProxyDetectionTimeout
                                              block:^{
                                                __typeof__(self) strongSelf = weakSelf;
                                                if (strongSelf) {
                                                  [strongSelf startBufferProxyDetection];
                                                }
                                              }];
}

- (void)startBufferProxyDetection {
  [self clearBufferProxyDetectionTimer];
  if (_backChannelRequest.request != nil) {
    NSData *responseData = _backChannelRequest.responseData;
    if (responseData.length > 0) {
      [_support.logger
          logWarning:[NSString
                         stringWithFormat:@"Timer should have been cancelled: %@", responseData]];
    }
  }
  _streamingEnabled = NO;
  _bufferProxyDetectionDone = YES;
  [_support notifyStatEvent:WCRequestStatProxy];
  [self cancelBackChannelRequest];
  [self startBackChannel];
}

- (void)startBackChannel {
  if (![self shouldMakeRequest]) {
    return;
  }
  _backChannelRequest = [[WCChannelRequest alloc] initWithSessionID:_sessionID
                                                          requestID:kGETRequestID
                                                            support:_support
                                                           delegate:self
                                                            retryID:_backChannelAttemptID];
  _backChannelRequest.extraHeaders = _extraHeaders;

  NSURLComponents *components = [[NSURLComponents alloc] initWithURL:_forwardChannelURL
                                             resolvingAgainstBaseURL:NO];
  [self addQueryParameterToURLComponents:components name:kQueryItemNameRID value:kGETRequestID];
  [self addQueryParameterToURLComponents:components name:kQueryItemNameSID value:_sessionID];
  [self addQueryParameterToURLComponents:components
                                    name:kQueryItemCI
                                   value:_streamingEnabled ? kNumberZero : kNumberOne];
  [self addQueryParameterToURLComponents:components
                                    name:kQueryItemNameAID
                                   value:[NSString stringWithFormat:@"%d", _lastResponseCount]];
  [self addQueryParameterToURLComponents:components
                                    name:kQueryItemNameType
                                   value:kQueryItemValueXMLHTTP];

  if (_backChannelRequestTimeout > 0) {
    _backChannelRequest.timeout = _backChannelRequestTimeout;
  }
  [_backChannelRequest sendGET:components chunkDecoded:YES];
}

- (void)addQueryParameterToURLComponents:(NSURLComponents *)components
                                    name:(NSString *)name
                                   value:(NSString *)value {
  NSURLQueryItem *item = [NSURLQueryItem queryItemWithName:name value:value];
  item = [self encodeCommaInQueryItem:item];
  NSMutableArray<NSURLQueryItem *> *queryItems =
      [NSMutableArray arrayWithArray:components.queryItems];
  [queryItems addObject:item];
  [components setQueryItems:queryItems];
}

- (NSURLQueryItem *)encodeCommaInQueryItem:(NSURLQueryItem *)item {
  // Manually encode comma. According to the docs
  // (https://developer.apple.com/documentation/foundation/nsurlcomponents?language=objc) it
  // utilizes RFC3986 (http://www.ietf.org/rfc/rfc3986.txt) and comma is legal in query parameters
  // per that RFC.
  NSString *commaEncodedName =
      [item.name stringByReplacingOccurrencesOfString:kQueryParamCharacterComma
                                           withString:kQueryParamCharacterEncodedComma];
  NSString *commaEncodedValue =
      [item.value stringByReplacingOccurrencesOfString:kQueryParamCharacterComma
                                            withString:kQueryParamCharacterEncodedComma];
  return [NSURLQueryItem queryItemWithName:commaEncodedName value:commaEncodedValue];
}

- (void)requeuePendingMaps:(WCChannelRequest *)retryRequest {
  NSIndexSet *indexes =
      [NSIndexSet indexSetWithIndexesInRange:NSMakeRange(0, retryRequest.pendingMessages.count)];
  [_outgoingMaps insertObjects:retryRequest.pendingMessages atIndexes:indexes];
}

- (NSMutableArray<WCQueuedMap *> *)pendingMessagesWithMax:(int)maxNum
                                              requestText:(NSMutableString *)result {
  int count = MIN(_outgoingMaps.count, maxNum);
  [result appendString:[_wireCodec encodeMessageQueue:_outgoingMaps numOfMessages:count]];
  NSMutableArray<WCQueuedMap *> *pendingMessages =
      [[_outgoingMaps subarrayWithRange:NSMakeRange(0, count)] mutableCopy];
  [_outgoingMaps removeObjectsInRange:NSMakeRange(0, count)];
  return pendingMessages;
}

- (NSMutableArray<WCQueuedMap *> *)pendingMessagesWithMaxBinary:(int)maxNum
                                                    requestData:(NSMutableData *)result {
  int count = MIN(_outgoingMaps.count, maxNum);
  [result appendData:[_wireCodecBinary encodeMessageQueue:_outgoingMaps numOfMessages:count]];
  NSMutableArray<WCQueuedMap *> *pendingMessages =
      [[_outgoingMaps subarrayWithRange:NSMakeRange(0, count)] mutableCopy];
  [_outgoingMaps removeObjectsInRange:NSMakeRange(0, count)];
  return pendingMessages;
}

- (int)maxNumMessageForFastHandshake {
  int total = 0;
  for (int i = 0; i < _outgoingMaps.count; i++) {
    WCQueuedMap *map = _outgoingMaps[i];
    int size = map.rawDataSize;
    if (size <= 0) {
      break;
    }
    total += size;
    if (total > kWCMaxCharPerGET) {
      return i;
    }
    if (total == kWCMaxCharPerGET || i == _outgoingMaps.count - 1) {
      return i + 1;
    }
  }
  return kWCMaxMapsPerRequest;
}

- (void)makeForwardChannelRequest:(WCChannelRequest *)retryRequest {
  NSString *requestID = nil;
  if (retryRequest != nil) {
    requestID = retryRequest.requestID;
  } else {
    requestID = [NSString stringWithFormat:@"%d", _nextRequestID++];
  }
  NSURLComponents *components = [[NSURLComponents alloc] initWithURL:_forwardChannelURL
                                             resolvingAgainstBaseURL:NO];
  [self addQueryParameterToURLComponents:components name:kQueryItemNameSID value:_sessionID];
  [self addQueryParameterToURLComponents:components name:kQueryItemNameRID value:requestID];
  [self addQueryParameterToURLComponents:components
                                    name:kQueryItemNameAID
                                   value:[NSString stringWithFormat:@"%d", _lastResponseCount]];

  WCChannelRequest *request = [[WCChannelRequest alloc] initWithSessionID:_sessionID
                                                                requestID:requestID
                                                                  support:_support
                                                                 delegate:self];
  request.extraHeaders = _extraHeaders;

  if (retryRequest != nil) {
    [self requeuePendingMaps:retryRequest];
  }
  request.timeout = round(_forwardChannelRequestTimeout * 0.5) +
                    round(_forwardChannelRequestTimeout * 0.5 * ((double)rand() / RAND_MAX));
  if (_enableBinaryEncoding) {
    NSMutableData *requestData = [NSMutableData data];
    request.pendingMessages = [self pendingMessagesWithMaxBinary:kWCMaxMapsPerRequest
                                                     requestData:requestData];
    request.isBinaryMessage = YES;
    [_forwardChannelRequestPool addRequest:request];
    [request sendPOST:components withPostData:requestData chunkDecoded:YES];
  } else {
    NSMutableString *requestText = [@"" mutableCopy];
    request.pendingMessages = [self pendingMessagesWithMax:kWCMaxMapsPerRequest
                                               requestText:requestText];
    [_forwardChannelRequestPool addRequest:request];
    [request sendPOST:components withData:requestText chunkDecoded:YES];
  }
}

- (BOOL)shouldMakeRequest {
  if (_error != WCWebChannelClientErrorNone) {
    [self signalError:_error];
    return NO;
  }
  return YES;
}

- (void)signalError:(WCWebChannelClientError)error {
  [_support.logger logError:[NSString stringWithFormat:@"Error code: %ld", (long)error]];
  WCRequestStat requestStateError = error == WCWebChannelClientErrorRequestFailed
                                        ? WCRequestStatErrorNetwork
                                        : WCRequestStatErrorOther;
  [_support notifyStatEvent:requestStateError];
  [self handleError:error];
}

- (void)handleError:(WCWebChannelClientError)error {
  [_support.logger logDebug:[NSString stringWithFormat:@"HttpChannel: error - %ld", (long)error]];
  _state = WCWebChannelClientStateClosed;
  [self triggerEncounteredError:error];

  [self onClose];
  [self cancelRequests];
}

- (void)clearDeadBackchannelTimer {
  [_support clearTimeout:_deadBackChannelTimer];
  _deadBackChannelTimer = nil;
}

- (void)clearBufferProxyDetectionTimer {
  [_support clearTimeout:_bufferProxyDetectionTimer];
  _bufferProxyDetectionTimer = nil;
}

- (void)clearForwardChannelDelayTimer {
  [_support clearTimeout:_forwardChannelDelayTimer];
  _forwardChannelDelayTimer = nil;
}

- (void)clearBackChannelDelayTimer {
  [_support clearTimeout:_backChannelDelayTimer];
  _backChannelDelayTimer = nil;
}

- (void)attemptRetryForFailedRequest:(WCChannelRequest *)request
                         channelType:(WCChannelType)type
                     pendingMessages:(NSMutableArray<WCQueuedMap *> *)pendingMessages {
  WCChannelRequestError lastError = request.lastError;
  _forwardRetryPendingMessagesScheduled = NO;
  if (!request.lastErrorFatal) {
    [_support.logger logDebug:[NSString stringWithFormat:@"Maybe retrying, last error: %@",
                                                         [request formatErrorToString:lastError]]];
    if (type == WCChannelTypeForwardChannel) {
      if ([self shouldRetryForwardChannel:request]) {
        if (!_forwardRetryPendingMessagesScheduled) {
          [self retryForwardChannel:request];
        }
        return;
      }
    } else {
      if ([self shouldRetryBackChannel:request.lastError]) {
        [self retryBackChannel:request.lastError];
        return;
      }
    }
  } else {
    [_support.logger logDebug:@"Not retrying due to error type."];
  }

  if (pendingMessages.count > 0) {
    [_forwardChannelRequestPool addPendingMessages:pendingMessages];
  }

  [_support.logger logDebug:@"Error: HTTP request failed."];
  switch (lastError) {
    case WCChannelRequestErrorNoData:
      [self signalError:WCWebChannelClientErrorNoData];
      break;
    case WCChannelRequestErrorBadData:
      [self signalError:WCWebChannelClientErrorBadData];
      break;
    case WCChannelRequestErrorUnknownSessionId:
      [self signalError:WCWebChannelClientErrorUnknownSessionID];
      break;
    case WCChannelRequestErrorUnknown:
      break;
    case WCChannelRequestErrorStatus:
    case WCChannelRequestErrorTimeout:
    case WCChannelRequestErrorHandlerException:
    case WCChannelRequestErrorBrowserOffline:
      [self signalError:WCWebChannelClientErrorRequestFailed];
      break;
  }
}

- (BOOL)shouldRetryForwardChannel:(WCChannelRequest *)request {
  WCWebChannelClientState currentState = self.state;
  if (_forwardChannelRequestPool.requestCount >=
      _forwardChannelRequestPool.maxSize - (_forwardChannelRequestInProgress ? 1 : 0)) {
    [_support.logger logError:@"Unexpected retry request is scheduled."];
    return NO;
  }
  if (_forwardChannelDelayTimer != nil) {
    [_outgoingMaps
        insertObjects:request.pendingMessages
            atIndexes:[NSIndexSet
                          indexSetWithIndexesInRange:NSMakeRange(0,
                                                                 request.pendingMessages.count)]];
    [_support.logger logDebug:@"Use the retry request that is already scheduled."];
    _forwardRetryPendingMessagesScheduled = YES;
    return NO;
  }
  if (currentState == WCWebChannelClientStateInit ||
      currentState == WCWebChannelClientStateOpening ||
      _forwardChannelRetryCount >= _forwardChannelMaxRetries) {
    return NO;
  }
  return YES;
}

- (void)retryForwardChannel:(WCChannelRequest *)request {
  if (_forwardChannelRequestInProgress) {
    return;
  }
  [_support.logger logDebug:@"Going to retry POST."];
  WCFailureRecoveryContext *context = [[WCFailureRecoveryContext alloc] init];
  context.error = request.lastError;
  context.attempt = _forwardChannelRetryCount + 1;
  context.channelType = WCChannelTypeForwardChannel;

  NSTimeInterval delay = [self getRetryTime:_forwardChannelRetryCount];
  __weak __typeof__(self) weakSelf = self;
  _forwardChannelDelayTimer =
      [_support setTimeout:delay
                     block:^{
                       __typeof__(self) strongSelf = weakSelf;
                       if (strongSelf) {
                         [strongSelf clearForwardChannelDelayTimer];
                         strongSelf->_forwardChannelRequestInProgress = NO;
                         [strongSelf startForwardChannelWithRetryRequest:request];
                       }
                     }
                   context:context];
  _forwardChannelRequestInProgress = YES;
  _forwardChannelRetryCount++;
}

- (NSTimeInterval)getRetryTime:(int)retryCount {
  NSTimeInterval retryTime = _baseRetryDelay + floor(((double)rand() / RAND_MAX) * _retryDelaySeed);
  retryTime *= retryCount;
  return retryTime;
}

- (BOOL)shouldRetryBackChannel:(WCChannelRequestError)error {
  if (_backChannelRequest != nil || _backChannelRequestInProgress) {
    [_support.logger logError:@"Request already in progress."];
    return NO;
  }
  if (_backChannelRetryCount >= _backChannelMaxRetries) {
    return NO;
  }
  return YES;
}

- (void)retryBackChannel:(WCChannelRequestError)error {
  [_support.logger logDebug:@"Going to retry GET."];
  _backChannelAttemptID++;
  WCFailureRecoveryContext *context = nil;
  if (error > 0) {
    context = [[WCFailureRecoveryContext alloc] init];
    context.error = error;
    context.attempt = _backChannelAttemptID;
    context.channelType = WCChannelTypeBackChannel;
  }

  NSTimeInterval delay = [self getRetryTime:_backChannelRetryCount];
  __weak __typeof__(self) weakSelf = self;
  _backChannelDelayTimer = [_support setTimeout:delay
                                          block:^{
                                            __typeof__(self) strongSelf = weakSelf;
                                            if (strongSelf) {
                                              [strongSelf onStartBackChannelTimer];
                                            }
                                          }
                                        context:context];
  _backChannelRequestInProgress = YES;
  _backChannelRetryCount++;
}

- (void)onClose {
  _state = WCWebChannelClientStateClosed;
  _nonAckedMapsWithClosedChannel = [@[] mutableCopy];
  NSArray<WCQueuedMap *> *copyOfpendingMessages = [_forwardChannelRequestPool.pendingMessages copy];
  NSArray<WCQueuedMap *> *copyOfUndeliveredMaps = [_outgoingMaps copy];
  if (copyOfpendingMessages.count > 0 || _outgoingMaps.count > 0) {
    [_support.logger
        logDebug:[NSString
                     stringWithFormat:@"Number of undelivered maps pending: %lu, outgoing: %lu",
                                      (unsigned long)copyOfpendingMessages.count,
                                      (unsigned long)_outgoingMaps.count]];
    [_nonAckedMapsWithClosedChannel addObjectsFromArray:copyOfpendingMessages];
    [_nonAckedMapsWithClosedChannel addObjectsFromArray:copyOfUndeliveredMaps];
    [_forwardChannelRequestPool clearPendingMessages];
    [_outgoingMaps removeAllObjects];
  }
  [self triggerClosedWithPendingData:copyOfpendingMessages undeliveredData:copyOfUndeliveredMaps];
}

- (void)processInput:(NSArray<NSArray<id> *> *)pendingBatchedResponses
             request:(WCChannelRequest *)request {
  WCWebChannelClientState currentState = self.state;
  NSMutableArray<NSArray<id> *> *batch = nil;
  for (NSArray<id> *nextBatch in pendingBatchedResponses) {
    _lastResponseCount = [(NSNumber *)nextBatch[0] integerValue];
    id nextResponseObject = nextBatch[1];
    if (currentState == WCWebChannelClientStateOpening) {
      [self parseResponseObjectAtOpening:nextResponseObject request:request];
    } else if (currentState == WCWebChannelClientStateOpened) {
      [self parseResponseObjectAtOpened:nextResponseObject nextBatch:nextBatch bufferBatch:batch];
    }
  }
  if (batch != nil && batch.count > 0) {
    [self triggerDidReceiveMultipleArrays:batch];
  }
}

- (void)parseResponseObjectAtOpening:(id)nextResponseObject request:(WCChannelRequest *)request {
  NSArray<NSString *> *responsesAtOpening = nextResponseObject;
  if ([responsesAtOpening[kResponseOpen] isEqual:@"c"]) {
    _sessionID = responsesAtOpening[1];
    if (responsesAtOpening.count >= 4) {
      _channelVersion = responsesAtOpening[3].integerValue;
    }
    if (responsesAtOpening.count >= 5) {
      _serverVersion = responsesAtOpening[4].integerValue;
    }
    if (responsesAtOpening.count >= 6) {
      NSInteger serverKeepAliveMS = responsesAtOpening[5].floatValue;
      if (serverKeepAliveMS > 0) {
        _backChannelRequestTimeout =
            round(kBackChannelRequestTimeoutMultiplier * serverKeepAliveMS / 1000.0);
      }
    }
    [self applyControlHeaders:request];

    _state = WCWebChannelClientStateOpened;
    [self triggerOpened];
    if (_detectBufferingProxy) {
      _handshakeRTT = [[NSDate date] timeIntervalSinceDate:request.requestStartTime];
    }
    [_support
        notifyHandshakeTimingEventWithRtt:[[NSDate now]
                                              timeIntervalSinceDate:request.requestStartTime]];
    [self startBackChannelAfterHandshake:request];
    if (_outgoingMaps.count != 0) {
      [self checkForwardChannelAvailabilityThenStart];
    }
  } else if ([nextResponseObject[0] isEqual:kResponseStop] ||
             [nextResponseObject[0] isEqual:kResponseClose]) {
    [self signalError:WCWebChannelClientErrorStop];
  }
}
- (void)parseResponseObjectAtOpened:(id)nextResponseObject
                          nextBatch:(NSArray<id> *)nextBatch
                        bufferBatch:(NSMutableArray<NSArray<id> *> *)batch {
  NSArray<id> *responsesAtOpened = nextBatch;
  if ([nextResponseObject isKindOfClass:[NSArray class]]) {
    responsesAtOpened = (NSArray *)nextResponseObject;
  }
  if ([nextResponseObject isKindOfClass:[NSArray class]] &&
      ([nextResponseObject[0] isEqual:kResponseStop] ||
       [nextResponseObject[0] isEqual:kResponseClose])) {
    if (batch.count > 0) {
      [self triggerDidReceiveMultipleArrays:batch];
      batch = [NSMutableArray array];
    }
    if ([responsesAtOpened[0] isEqual:kResponseStop]) {
      [self signalError:WCWebChannelClientErrorStop];
    } else {
      [self disconnect];
    }
  } else if ([nextResponseObject isKindOfClass:[NSArray class]] &&
             [nextResponseObject[0] isEqual:kResponseNoop]) {
    // ignore - noop to keep connection happy
  } else {
    if (batch != nil) {
      [batch addObjectsFromArray:responsesAtOpened];
    } else {
      [self triggerDidReceiveMessage:nextResponseObject];
    }
  }
  _backChannelRetryCount = 0;
}
- (void)startBackChannelAfterHandshake:(WCChannelRequest *)request {
  _backChannelURL = [self createDataURL:_path];
  if (request.initialResponseDecoded) {
    [_support.logger logDebug:@"Upgrade the handshake request to a backchannel."];
    [_forwardChannelRequestPool removeRequest:request];
    request.timeout = _backChannelRequestTimeout;
    _backChannelRequest = request;
  } else {
    [self checkBackChannelAvailabilityThenStart];
  }
}

- (void)applyControlHeaders:(WCChannelRequest *)request {
  id<WCHTTPRequest> req = request.request;
  if (req == nil) {
    return;
  }
  NSString *clientProtocol = [req responseHeaderForName:kWCXClientWireProtocol];
  if (clientProtocol != nil) {
    [_forwardChannelRequestPool applyClientProtocol:clientProtocol];
  }
  if (_HTTPSessionIDParam.length > 0) {
    NSString *HTTPSessionIDHeader = [req responseHeaderForName:kWCXHTTPSessionID];
    if (HTTPSessionIDHeader.length > 0) {
      _HTTPSessionID = HTTPSessionIDHeader;
      NSURLComponents *component = [NSURLComponents componentsWithURL:_forwardChannelURL
                                              resolvingAgainstBaseURL:YES];
      [self addQueryParameterToURLComponents:component
                                        name:_HTTPSessionIDParam
                                       value:HTTPSessionIDHeader];
      _forwardChannelURL = component.URL;
    } else {
      [_support.logger logDebug:@"Missing iOS_HTTP_SESSION_ID in the handshake response."];
    }
  }
}

- (void)cancelRequests {
  [self cancelBackChannelRequest];
  [self clearBufferProxyDetectionTimer];
  if (_backChannelRequestInProgress) {
    [self clearBackChannelDelayTimer];
    _backChannelRequestInProgress = NO;
  }
  [self clearDeadBackchannelTimer];
  [_forwardChannelRequestPool cancel];
  if (_forwardChannelRequestInProgress) {
    [self clearForwardChannelDelayTimer];
    _forwardChannelRequestInProgress = NO;
  }
}

- (void)disconnect {
  [self cancelRequests];
  if (self.state == WCWebChannelClientStateOpened) {
    long rid = _nextRequestID++;
    NSURLComponents *components = [NSURLComponents componentsWithURL:_forwardChannelURL
                                             resolvingAgainstBaseURL:NO];
    [self addQueryParameterToURLComponents:components name:kQueryItemNameSID value:_sessionID];
    [self addQueryParameterToURLComponents:components
                                      name:kQueryItemNameRID
                                     value:[NSString stringWithFormat:@"%ld", rid]];
    [self addQueryParameterToURLComponents:components
                                      name:kQueryItemNameType
                                     value:kQueryItemValueTerminate];
    [self addAdditionalParams:components];

    WCChannelRequest *request =
        [[WCChannelRequest alloc] initWithSessionID:_sessionID
                                          requestID:[NSString stringWithFormat:@"%ld", rid]
                                            support:_support
                                           delegate:self];
    [request closeWithURLComponents:components];
  }
  [self onClose];
}

- (void)cancelBackChannelRequest {
  if (_backChannelRequest != nil) {
    [self clearBufferProxyDetectionTimer];
    [_backChannelRequest cancel];
    _backChannelRequest = nil;
  }
}

- (void)handlePOSTResponse:(NSArray<NSString *> *)responseArray
                   request:(WCChannelRequest *)forwardRequest {
  if (responseArray[kBackChannelIDIndex] == kBackChannelMissing) {
    [self handleBackChannelMissingWithLastRequestStartTime:forwardRequest.requestStartTime];
    return;
  }
  _lastPostResponseCount = responseArray[kPostResponseCountIndex].integerValue;
  int numOutstandingArrays = _lastPostResponseCount - _lastResponseCount;
  if (numOutstandingArrays > 0) {
    int numOutstandingBackChannelBytes = responseArray[2].integerValue;
    if (![self shouldRetryBackChannelWithinLimit:numOutstandingBackChannelBytes]) {
      return;
    }
    if (_deadBackChannelTimer == nil) {
      __weak __typeof__(self) weakSelf = self;
      _deadBackChannelTimer = [_support setTimeout:2 * kWCRTTEstimate
                                             block:^{
                                               __typeof__(self) strongSelf = weakSelf;
                                               if (strongSelf) {
                                                 [strongSelf onBackChannelDead];
                                               }
                                             }];
    }
  }
}

- (BOOL)shouldRetryBackChannelWithinLimit:(int)outstandingBytes {
  return outstandingBytes < kWCOutstandingDataBackChannelRetryCutoff && _streamingEnabled &&
         _backChannelRetryCount == 0;
}

- (void)onBackChannelDead {
  if (_deadBackChannelTimer != nil) {
    [self clearDeadBackchannelTimer];
    [self cancelBackChannelRequest];
    if ([self shouldRetryBackChannel:WCChannelRequestErrorNoData]) {
      [self retryBackChannel:WCChannelRequestErrorNoData];
    }
    [_support notifyStatEvent:WCRequestStatBackChannelDead];
  }
}

- (void)handleBackChannelMissingWithLastRequestStartTime:(NSDate *)forwardRequestStartTime {
  [_support.logger logDebug:@"Server claims our backchannel is missing."];
  if (_backChannelRequestInProgress) {
    [_support.logger logDebug:@"But we are currently starting the request."];
    return;
  }
  if (_backChannelRequest == nil) {
    [_support.logger logWarning:@"We don not have a backchannel established."];
  } else if ([_backChannelRequest.requestStartTime addTimeInterval:kWCRTTEstimate] <
             forwardRequestStartTime) {
    [self clearDeadBackchannelTimer];
    [self cancelBackChannelRequest];
  } else {
    return;
  }
  if ([self shouldRetryBackChannel:WCChannelRequestErrorUnknown]) {
    [self retryBackChannel:WCChannelRequestErrorUnknown];
  }
  [_support notifyStatEvent:WCRequestStatBackChannelMissing];
}

- (void)checkForwardChannelFlush {
  if (_forwardChannelRequestPool.requestCount <= 1) {
    if (_forwardChannelFlushedCallback != nil) {
      _forwardChannelFlushedCallback();
    }
    _forwardChannelFlushedCallback = nil;
  }
}

- (NSMutableArray<WCQueuedMap *> *)nonAckedMaps {
  if (self.state == WCWebChannelClientStateClosed) {
    return _nonAckedMapsWithClosedChannel;
  }

  NSMutableArray<WCQueuedMap *> *nonAckedMaps = [@[] mutableCopy];
  [nonAckedMaps addObjectsFromArray:_forwardChannelRequestPool.pendingMessages];
  [nonAckedMaps addObjectsFromArray:_outgoingMaps];
  return nonAckedMaps;
}

@end
