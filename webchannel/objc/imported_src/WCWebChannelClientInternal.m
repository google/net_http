#import "WCWebChannelClientInternal.h"
#import "WCTimer.h"

#import "WCHTTPRequest.h"
#import "WCLogger.h"
#import "WCURIBuilder.h"
#import "WCChannelRequest.h"
#import "WCFailureRecoveryContext.h"
#import "WCForwardChannelRequestPool.h"
#import "WCInternalChannelParams.h"
#import "WCNetUtils.h"
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
static const double kBackChannelRequestTimeoutMultiplier = 1.5;
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
static NSString *const kNetworkTestPath = @"/test";
static NSString *const kQueryItemNameMode = @"MODE";
static NSString *const kQueryItemValueNetwork = @"network";

static BOOL WCIsASCIIWhitespaceOnly(NSData *data) {
  const uint8_t *bytes = data.bytes;
  for (NSUInteger i = 0; i < data.length; i++) {
    switch (bytes[i]) {
      case ' ':
      case '\t':
      case '\n':
      case '\v':
      case '\f':
      case '\r':
        continue;
      default:
        return NO;
    }
  }
  return YES;
}

/**
 * Returns whether @c value is a JSON number, like nlohmann::json::is_number(). NSJSONSerialization
 * decodes true and false as NSNumber too, so booleans are excluded.
 */
static BOOL WCIsJSONNumber(id value) {
  return [value isKindOfClass:[NSNumber class]] &&
         CFGetTypeID((__bridge CFTypeRef)value) != CFBooleanGetTypeID();
}

static double WCUniformRandom() { return (double)arc4random() / ((double)UINT32_MAX + 1); }

static NSComparisonResult WCCompareUTF8Bytes(NSString *lhs, NSString *rhs) {
  NSData *lhsData = [lhs dataUsingEncoding:NSUTF8StringEncoding] ?: [NSData data];
  NSData *rhsData = [rhs dataUsingEncoding:NSUTF8StringEncoding] ?: [NSData data];
  NSUInteger length = MIN(lhsData.length, rhsData.length);
  int result = length > 0 ? memcmp(lhsData.bytes, rhsData.bytes, length) : 0;
  if (result != 0) {
    return result < 0 ? NSOrderedAscending : NSOrderedDescending;
  }
  if (lhsData.length == rhsData.length) {
    return NSOrderedSame;
  }
  return lhsData.length < rhsData.length ? NSOrderedAscending : NSOrderedDescending;
}

@interface WCWebChannelClientInternal () <WCWebChannelInternalHTTPHandler, WCTestNetworkCallback>
@end

@implementation WCWebChannelClientInternal {
  WCConnectionState *_connectionState;
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
  BOOL _fastHandshake2;
  BOOL _blockingHandshake;
  BOOL _enableBinaryEncoding;
  BOOL _bufferProxyDetectionDone;
  BOOL _sendRawJSON;
  BOOL _forwardRetryPendingMessagesScheduled;
  BOOL _forwardChannelRequestInProgress;
  BOOL _backChannelRequestInProgress;

  WCWireV8 *_wireCodec;
  id<WCSupport> _support;
  WCNetUtils *_netUtils;
  /** The URL of the network test request, from the options or built on the first test. */
  NSURL *_networkTestURL;

  NSMutableArray<WCQueuedMap *> *_nonAckedMapsWithClosedChannel;

  dispatch_queue_t _dispatchQueue;

  BOOL _nonBlockingSendEnabled;
  BOOL _nonBlockingSendFailed;
  NSString *_handshakeRequestID;
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
    _failFast = internalChannelParams.failFast;
    _fastHandshake2 = options.fastHandshake2;
    _fastHandshake = options.fastHandshake || _fastHandshake2;
    if (!_fastHandshake2 && _fastHandshake && options.enableBinaryEncoding) {
      [_support.logger logWarning:@"Ignore fastHandshake because binary encoding is set."];
      // It's not safe to overwrite enable_binary_encoding to false
      _fastHandshake = NO;
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
    _netUtils = [[WCNetUtils alloc] initWithCallback:self support:_support];

    _networkTestURL = options.networkTestURL.length > 0
                          ? [NSURLComponents componentsWithString:options.networkTestURL].URL
                          : nil;

    _nonBlockingSendEnabled = options.nonBlockingSend || _fastHandshake2;
    if (!_fastHandshake2 && _nonBlockingSendEnabled && _fastHandshake) {
      [_support.logger logWarning:@"nonBlockingSend is ignored because fastHandshake is set."];
      _nonBlockingSendEnabled = NO;
    }
    _nonBlockingSendFailed = NO;
    _handshakeRequestID = nil;

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
  rawJSON[kRawDataKey] = [message copy];
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
  rawJSON[kRawDataKey] = [data copy];
  [self sendMap:rawJSON context:nil];
}

#pragma mark - WCWebChannelInternalHTTPHandler

- (void)didReceiveInput:(NSData *)response
               isBinary:(BOOL)isBinary
            withRequest:(WCChannelRequest *)request {
  WCWebChannelClientState currentState = self.state;
  if (currentState == WCWebChannelClientStateClosed ||
      !([_backChannelRequest isEqual:request] || [_forwardChannelRequestPool hasRequest:request])) {
    return;
  }

  if (response == nil) {
    return;
  }

  BOOL isHandshake = [self isHandshakeRequest:request];

  if (!request.initialResponseDecoded && [_forwardChannelRequestPool hasRequest:request] &&
      (currentState == WCWebChannelClientStateOpened ||
       (currentState == WCWebChannelClientStateOpening && !isHandshake))) {
    NSArray<id> *responseArray = [_wireCodec decodeMessage:response level:kDecodeLevelOne];
    if (responseArray.count == kResponseArrayCountThree) {
      if (currentState == WCWebChannelClientStateOpened) {
        [self handlePOSTResponse:responseArray request:request];
      }
      [self checkForwardChannelFlush];
    } else {
      [_support.logger logDebug:@"Bad POST response returned."];
      [self signalError:WCWebChannelClientErrorBadResponse];
    }
  } else {
    if (request.initialResponseDecoded || [_backChannelRequest isEqual:request]) {
      [self clearDeadBackchannelTimer];
    }

    if (response.length == 0) {
      return;
    }

    if (isBinary) {
      NSArray<NSArray<id> *> *decodedResponse = [WCWireV8Binary decodeBinaryChunk:response];
      if (decodedResponse == nil) {
        [_support.logger logDebug:@"Bad binary response returned."];
        [self signalError:WCWebChannelClientErrorBadResponse];
        return;
      }
      _backChannelBinaryEncodingEnabled = YES;
      [self processInput:decodedResponse request:request];
    } else if (!WCIsASCIIWhitespaceOnly(response)) {
      NSArray<NSArray<id> *> *decodedResponse = [_wireCodec decodeMessage:response
                                                                    level:kDecodeLevelThree];
      if (decodedResponse == nil) {
        [_support.logger logDebug:@"Bad response returned."];
        [self signalError:WCWebChannelClientErrorBadResponse];
        return;
      }
      [self processInput:decodedResponse request:request];
    }
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

- (NSString *)generateClientSID {
  static NSString *const kAlphaNum =
      @"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  NSMutableString *sid = [NSMutableString stringWithString:@"c-"];
  for (int i = 0; i < 22; ++i) {
    uint32_t index = arc4random_uniform((uint32_t)kAlphaNum.length);
    unichar c = [kAlphaNum characterAtIndex:index];
    [sid appendFormat:@"%C", c];
  }
  return [sid copy];
}

- (void)configureByOptions:(WCOptions *)options {
  if (!options) {
    return;
  }
  NSMutableDictionary<NSString *, NSString *> *localMessageUrlParams =
      [self.extraParams mutableCopy];
  [localMessageUrlParams addEntriesFromDictionary:options.messageURLParams];
  NSMutableDictionary<NSString *, NSString *> *messageHeaders = [@{} mutableCopy];
  if (options.messageHeaders) {
    [messageHeaders addEntriesFromDictionary:options.messageHeaders];
  }
  if (options.clientProtocolHeaderRequired) {
    messageHeaders[kWCXClientProtocol] = kWCXClientProtocolWebChannel;
  }
  [self setExtraHeaders:messageHeaders];
  NSMutableDictionary<NSString *, NSString *> *initHeader =
      [options.initialMessageHeaders mutableCopy] ?: [@{} mutableCopy];
  if (options.messageContentType.length > 0) {
    initHeader[kWCXWebChannelContentType] = options.messageContentType;
  }
  if (options.clientProfile.length > 0) {
    initHeader[kWCXWebChannelClientProfile] = options.clientProfile;
  }
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
  if (currentState == WCWebChannelClientStateOpened ||
      (_nonBlockingSendEnabled && currentState == WCWebChannelClientStateOpening &&
       !_nonBlockingSendFailed)) {
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
    _backChannelBinaryEncodingEnabled = NO;
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
    typeof(self) strongSelf = weakSelf;
    if (!strongSelf) {
      return;
    }
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
  _backChannelAttemptID = 1;
  _backChannelRequestInProgress = YES;
  _backChannelRetryCount = 0;
  __weak typeof(self) weakSelf = self;
  dispatch_async(_dispatchQueue, ^{
    typeof(self) strongSelf = weakSelf;
    if (!strongSelf) {
      return;
    }
    if (!strongSelf->_backChannelRequestInProgress) {
      return;
    }
    [strongSelf onStartBackChannelTimer];
  });
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
  if (currentState == WCWebChannelClientStateOpening) {
    if (_nonBlockingSendEnabled && !_nonBlockingSendFailed) {
      if (retryRequest != nil) {
        // Retry requests are deferred until state becomes OPENED.
        return;
      }
      if (_outgoingMaps.count == 0 || _forwardChannelRequestPool.full) {
        return;
      }
      [self makeForwardChannelRequest:nil];
    }
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
      return;
    }
    [self makeForwardChannelRequest:nil];
  }
}

- (void)openForwardChannel {
  [_support.logger logDebug:@"Opening Forward Channel."];
  _nextRequestID = arc4random_uniform(100000);
  NSString *requestID = [NSString stringWithFormat:@"%d", _nextRequestID++];
  _handshakeRequestID = requestID;
  _nonBlockingSendFailed = NO;

  if (_nonBlockingSendEnabled) {
    _sessionID = [self generateClientSID];
  }

  WCChannelRequest *request =
      [[WCChannelRequest alloc] initWithSessionID:_nonBlockingSendEnabled ? _sessionID : @""
                                        requestID:requestID
                                          support:_support
                                         delegate:self];
  NSMutableDictionary<NSString *, NSString *> *extraHeaders = [_extraHeaders mutableCopy];
  [extraHeaders addEntriesFromDictionary:_initialHeaders];
  request.extraHeaders = extraHeaders;

  int max = _fastHandshake2
                ? 0
                : (_fastHandshake ? [self maxNumMessageForFastHandshake] : kWCMaxMapsPerRequest);
  NSMutableData *requestData = nil;
  NSMutableString *requestText = nil;
  if (_enableBinaryEncoding) {
    requestData = [NSMutableData data];
    request.pendingMessages = [self pendingMessagesWithMaxBinary:max requestData:requestData];
    request.isBinaryMessage = YES;
  } else {
    requestText = [@"" mutableCopy];
    request.pendingMessages = [self pendingMessagesWithMax:max requestText:requestText];
  }

  NSURLComponents *components = [NSURLComponents componentsWithURL:_forwardChannelURL
                                           resolvingAgainstBaseURL:NO];
  [self addQueryParameterToURLComponents:components name:kQueryItemNameRID value:requestID];
  if (_nonBlockingSendEnabled && !_fastHandshake) {
    [self addQueryParameterToURLComponents:components name:kQueryItemNameSID value:_sessionID];
  }
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
  [self addAdditionalParams:components];
  if (_blockingHandshake) {
    [self addQueryParameterToURLComponents:components
                                      name:kQueryItemNameType
                                     value:kQueryItemValueInit];
  }

  [_forwardChannelRequestPool addRequest:request];
  if (_fastHandshake) {
    NSString *encodedRequest =
        requestText ?: [[NSString alloc] initWithData:requestData encoding:NSUTF8StringEncoding];
    [self addQueryParameterToURLComponents:components
                                      name:kQueryItemNameRequest
                                     value:encodedRequest];
    [self addQueryParameterToURLComponents:components
                                      name:kQueryItemNameSID
                                     value:_nonBlockingSendEnabled ? _sessionID
                                                                   : kQueryItemValueNull];
    request.decodeInitialResponse = YES;
    [request sendGET:components chunkDecoded:YES];
  } else if (_enableBinaryEncoding) {
    [request sendPOST:components withPostData:requestData chunkDecoded:YES];
  } else {
    [request sendPOST:components withData:requestText chunkDecoded:YES];
  }
  // Make sure we send the request out, then flip the state.
  _state = WCWebChannelClientStateOpening;
  if (_nonBlockingSendEnabled && _outgoingMaps.count > 0) {
    [self checkForwardChannelAvailabilityThenStart];
  }
}

- (NSURL *)networkTestURL {
  if (_networkTestURL == nil) {
    NSURLComponents *components =
        [NSURLComponents componentsWithString:[_path stringByAppendingString:kNetworkTestPath]];
    if (components != nil) {
      WCAddQueryParameter(components, kQueryItemNameMode, kQueryItemValueNetwork);
    }
    _networkTestURL = components.URL;
  }
  return _networkTestURL;
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
  NSDictionary<NSString *, NSString *> *extraParams = self.extraParams;
  NSArray<NSString *> *keys = [extraParams.allKeys
      sortedArrayUsingComparator:^NSComparisonResult(NSString *lhs, NSString *rhs) {
        return WCCompareUTF8Bytes(lhs, rhs);
      }];
  for (NSString *key in keys) {
    [self addQueryParameterToURLComponents:components name:key value:extraParams[key]];
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

  NSURLComponents *components = [[NSURLComponents alloc] initWithURL:_backChannelURL
                                             resolvingAgainstBaseURL:NO];
  [self addQueryParameterToURLComponents:components name:kQueryItemNameRID value:kGETRequestID];
  [self addQueryParameterToURLComponents:components name:kQueryItemNameSID value:_sessionID];
  [self addQueryParameterToURLComponents:components
                                    name:kQueryItemCI
                                   value:_streamingEnabled ? kNumberZero : kNumberOne];
  [self addQueryParameterToURLComponents:components
                                    name:kQueryItemNameAID
                                   value:[NSString stringWithFormat:@"%lld", _lastResponseCount]];
  [self addQueryParameterToURLComponents:components
                                    name:kQueryItemNameType
                                   value:kQueryItemValueXMLHTTP];
  [self addAdditionalParams:components];

  if (_backChannelRequestTimeout > 0) {
    _backChannelRequest.timeout = _backChannelRequestTimeout;
  }
  [_backChannelRequest sendGET:components chunkDecoded:YES];
}

- (void)addQueryParameterToURLComponents:(NSURLComponents *)components
                                    name:(NSString *)name
                                   value:(NSString *)value {
  WCAddQueryParameter(components, name, value);
}

- (void)requeuePendingMaps:(WCChannelRequest *)retryRequest {
  if (retryRequest && retryRequest.pendingMessages.count > 0) {
    NSIndexSet *indexes =
        [NSIndexSet indexSetWithIndexesInRange:NSMakeRange(0, retryRequest.pendingMessages.count)];
    [_outgoingMaps insertObjects:retryRequest.pendingMessages atIndexes:indexes];
  }
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
  [result appendData:[WCWireV8Binary encodeMessageQueue:_outgoingMaps numOfMessages:count]];
  NSMutableArray<WCQueuedMap *> *pendingMessages =
      [[_outgoingMaps subarrayWithRange:NSMakeRange(0, count)] mutableCopy];
  [_outgoingMaps removeObjectsInRange:NSMakeRange(0, count)];
  return pendingMessages;
}

- (int)maxNumMessageForFastHandshake {
  int total = 0;
  for (int i = 0; i < _outgoingMaps.count; i++) {
    WCQueuedMap *map = _outgoingMaps[i];
    if (map.map[kRawDataKey] == nil) {
      break;
    }
    total += map.rawDataSize;
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
                                   value:[NSString stringWithFormat:@"%lld", _lastResponseCount]];
  [self addAdditionalParams:components];

  WCChannelRequest *request =
      [[WCChannelRequest alloc] initWithSessionID:_sessionID
                                        requestID:requestID
                                          support:_support
                                         delegate:self
                                          retryID:_forwardChannelRetryCount + 1];
  request.extraHeaders = _extraHeaders;

  if (retryRequest != nil) {
    [self requeuePendingMaps:retryRequest];
  }
  request.timeout =
      _forwardChannelRequestTimeout * 0.5 + _forwardChannelRequestTimeout * 0.5 * WCUniformRandom();
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
  if (error == WCWebChannelClientErrorRequestFailed) {
    // Create a separate Internet connection to check if it's a server error or user's network
    // error.
    [_netUtils testNetwork:[self networkTestURL]];
  } else {
    [_support notifyStatEvent:WCRequestStatErrorOther];
  }
  [self handleError:error];
}

- (void)onTestNetworkResult:(BOOL)networkUp {
  if (networkUp) {
    [_support.logger logInfo:@"Successfully pinged google.com"];
    [_support notifyStatEvent:WCRequestStatErrorOther];
  } else {
    [_support.logger logInfo:@"Failed to ping google.com"];
    [_support notifyStatEvent:WCRequestStatErrorNetwork];
  }
}

- (void)handleError:(WCWebChannelClientError)error {
  [_support.logger logDebug:[NSString stringWithFormat:@"HttpChannel: error - %ld", (long)error]];
  _state = WCWebChannelClientStateClosed;
  [self triggerEncounteredError:error];

  [self cancelRequests];
  [self onClose];
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

- (BOOL)isHandshakeRequest:(WCChannelRequest *)request {
  return _handshakeRequestID.length > 0 && [request.requestID isEqualToString:_handshakeRequestID];
}

- (void)attemptRetryForFailedRequest:(WCChannelRequest *)request
                         channelType:(WCChannelType)type
                     pendingMessages:(NSMutableArray<WCQueuedMap *> *)pendingMessages {
  WCChannelRequestError lastError = request.lastError;
  _forwardRetryPendingMessagesScheduled = NO;
  BOOL isFatal = request.lastErrorFatal;
  BOOL isHandshake = [self isHandshakeRequest:request];
  if (isFatal && !isHandshake) {
    if (_nonBlockingSendEnabled &&
        (self.state == WCWebChannelClientStateOpening ||
         self.state == WCWebChannelClientStateOpened) &&
        type == WCChannelTypeForwardChannel && lastError == WCChannelRequestErrorUnknownSessionId) {
      isFatal = NO;
    }
  }

  if (!isFatal) {
    [_support.logger logDebug:[NSString stringWithFormat:@"Maybe retrying, last error: %@",
                                                         [request formatErrorToString:lastError]]];
    if (type == WCChannelTypeForwardChannel) {
      if ([self shouldRetryForwardChannel:request]) {
        if (!_forwardRetryPendingMessagesScheduled) {
          [self retryForwardChannel:request];
        }
        return;
      }
      if (_forwardRetryPendingMessagesScheduled) {
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
  BOOL isHandshake = [self isHandshakeRequest:request];
  if (_nonBlockingSendEnabled && !isHandshake && currentState == WCWebChannelClientStateOpening) {
    _nonBlockingSendFailed = YES;
    [self requeuePendingMaps:request];
    _forwardRetryPendingMessagesScheduled = YES;
    return NO;
  }
  if (_forwardChannelRequestPool.requestCount >=
      _forwardChannelRequestPool.maxSize - (_forwardChannelRequestInProgress ? 1 : 0)) {
    [_support.logger logError:@"Unexpected retry request is scheduled."];
    return NO;
  }
  if (_forwardChannelRequestInProgress) {
    [self requeuePendingMaps:request];
    [_support.logger logDebug:@"Use the retry request that is already scheduled."];
    _forwardRetryPendingMessagesScheduled = YES;
    return NO;
  }
  if (currentState == WCWebChannelClientStateInit ||
      currentState == WCWebChannelClientStateOpening ||
      _forwardChannelRetryCount >= self.forwardChannelMaxRetries) {
    return NO;
  }
  return YES;
}

- (void)retryForwardChannel:(WCChannelRequest *)request {
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
  NSTimeInterval retryTime = _baseRetryDelay + WCUniformRandom() * _retryDelaySeed;
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
  _handshakeRequestID = nil;
  _nonBlockingSendFailed = NO;
  _backChannelBinaryEncodingEnabled = NO;
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
  NSMutableArray<NSArray<id> *> *batch = nil;
  for (NSArray<id> *nextBatch in pendingBatchedResponses) {
    _lastResponseCount = [(NSNumber *)nextBatch[0] longLongValue];
    id nextResponseObject = nextBatch[1];
    WCWebChannelClientState currentState = self.state;
    if (currentState == WCWebChannelClientStateOpening) {
      if (![self parseResponseObjectAtOpening:nextResponseObject request:request]) {
        return;
      }
    } else if (currentState == WCWebChannelClientStateOpened) {
      if (![self parseResponseObjectAtOpened:nextResponseObject
                                   nextBatch:nextBatch
                                 bufferBatch:batch]) {
        return;
      }
    }
  }
  if (batch != nil && batch.count > 0) {
    [self triggerDidReceiveMultipleArrays:batch];
  }
}

- (BOOL)parseResponseObjectAtOpening:(id)nextResponseObject request:(WCChannelRequest *)request {
  NSArray<id> *responsesAtOpening = nextResponseObject;
  if ([responsesAtOpening[kResponseOpen] isEqual:@"c"]) {
    _sessionID = responsesAtOpening[1];
    if (responsesAtOpening.count >= 4 && WCIsJSONNumber(responsesAtOpening[3])) {
      _channelVersion = [responsesAtOpening[3] intValue];
    }
    if (responsesAtOpening.count >= 5 && WCIsJSONNumber(responsesAtOpening[4])) {
      _serverVersion = [responsesAtOpening[4] intValue];
    }
    if (responsesAtOpening.count >= 6 && WCIsJSONNumber(responsesAtOpening[5])) {
      int serverKeepAliveMS = [responsesAtOpening[5] intValue];
      if (serverKeepAliveMS > 0) {
        _backChannelRequestTimeout =
            round(kBackChannelRequestTimeoutMultiplier * serverKeepAliveMS) / 1000.0;
      }
    }
    [self applyControlHeaders:request];

    _state = WCWebChannelClientStateOpened;
    _handshakeRequestID = nil;
    [self triggerOpened];
    if (_detectBufferingProxy) {
      _handshakeRTT = [[NSDate date] timeIntervalSinceDate:request.requestStartTime];
    }
    [_support
        notifyHandshakeTimingEventWithRtt:[[NSDate now]
                                              timeIntervalSinceDate:request.requestStartTime]];
    [_support notifyHandshakeResponseHeaders:[request.request allResponseHeaders]];
    [self startBackChannelAfterHandshake:request];
    if (_outgoingMaps.count != 0) {
      [self checkForwardChannelAvailabilityThenStart];
    }
  } else if ([responsesAtOpening[0] isEqual:kResponseStop] ||
             [responsesAtOpening[0] isEqual:kResponseClose]) {
    [self signalError:WCWebChannelClientErrorStop];
    return NO;
  }
  return YES;
}
- (BOOL)parseResponseObjectAtOpened:(id)nextResponseObject
                          nextBatch:(NSArray<id> *)nextBatch
                        bufferBatch:(NSMutableArray<NSArray<id> *> *)batch {
  BOOL isNonEmptyArray = [nextResponseObject isKindOfClass:[NSArray class]] &&
                         ((NSArray *)nextResponseObject).count > 0;
  NSArray<id> *responsesAtOpened = nextBatch;
  if (isNonEmptyArray) {
    responsesAtOpened = (NSArray *)nextResponseObject;
  }
  if (isNonEmptyArray && ([nextResponseObject[0] isEqual:kResponseStop] ||
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
    return NO;
  } else if (isNonEmptyArray && [nextResponseObject[0] isEqual:kResponseNoop]) {
    // ignore - noop to keep connection happy
  } else {
    if (batch != nil) {
      [batch addObjectsFromArray:responsesAtOpened];
    } else {
      [self triggerDidReceiveMessage:nextResponseObject];
    }
  }
  _backChannelRetryCount = 0;
  return YES;
}
- (void)startBackChannelAfterHandshake:(WCChannelRequest *)request {
  _backChannelURL = [self createDataURL:_path];
  if (request.initialResponseDecoded) {
    [_support.logger logDebug:@"Upgrade the handshake request to a backchannel."];
    [_forwardChannelRequestPool removeRequest:request];
    [request resetTimeout:_backChannelRequestTimeout];
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

- (void)handlePOSTResponse:(NSArray<id> *)responseArray request:(WCChannelRequest *)forwardRequest {
  id backChannelID = responseArray[kBackChannelIDIndex];
  if ([backChannelID isKindOfClass:[NSNumber class]] && [backChannelID integerValue] == 0) {
    [self handleBackChannelMissingWithLastRequestStartTime:forwardRequest.requestStartTime];
    return;
  }
  _lastPostResponseCount = [responseArray[kPostResponseCountIndex] longLongValue];
  int64_t numOutstandingArrays = _lastPostResponseCount - _lastResponseCount;
  if (numOutstandingArrays > 0) {
    int64_t numOutstandingBackChannelBytes = [responseArray[2] longLongValue];
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

- (BOOL)shouldRetryBackChannelWithinLimit:(int64_t)outstandingBytes {
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
  } else if ([[_backChannelRequest.requestStartTime dateByAddingTimeInterval:kWCRTTEstimate]
                 compare:forwardRequestStartTime] == NSOrderedAscending) {
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
