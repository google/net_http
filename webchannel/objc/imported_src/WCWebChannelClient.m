#import "WCWebChannelClient.h"

#import "WCConnectionState.h"
#import "WCDefaultSupport.h"
#import "WCDispatcher.h"
#import "WCWebChannelClientInternal.h"
#import "WCWebChannelClientProtocol.h"

@interface WCWebChannelClient () <WCWebChannelClientHandlerDelegate>
@end

@implementation WCWebChannelClient {
  WCWebChannelClientInternal *_client;
  id<WCWebChannelClientProtocol> _dispatchableClient;
}

- (instancetype)initWithURL:(NSURL *)baseURL
                    options:(WCOptions *)options
                   delegate:(id<WCWebChannelClientHandlerDelegate>)delegate {
  id<WCSupport> support = [[WCDefaultSupport alloc] init];
  return [self initWithURL:baseURL options:options delegate:delegate support:support];
}

- (instancetype)initWithURL:(NSURL *)baseURL
                    options:(WCOptions *)options
                   delegate:(id<WCWebChannelClientHandlerDelegate>)delegate
                    support:(id<WCSupport>)support {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _client = [[WCWebChannelClientInternal alloc] initWithURL:baseURL.absoluteString
                                                      options:options
                                              connectionState:[[WCConnectionState alloc] init]
                                                clientVersion:0
                                                     delegate:self
                                                      support:support];
    _dispatchableClient =
        [WCDispatcher strongDispatcherWithTarget:_client
                                        protocol:@protocol(WCWebChannelClientProtocol)
                                   dispatchQueue:support.dispatchQueue];
  }
  return self;
}

- (void)open {
  [_dispatchableClient open];
}

- (void)close {
  [_dispatchableClient close];
}

- (void)send:(NSString *)message {
  [_dispatchableClient send:message];
}

- (void)sendData:(NSData *)data {
  [_dispatchableClient sendData:data];
}

- (NSDictionary<NSString *, NSString *> *)messageUrlParams {
  return _client.extraParams;
}

- (void)setMessageUrlParams:(NSMutableDictionary<NSString *, NSString *> *)messageUrlParams {
  _client.extraParams = messageUrlParams;
}

- (WCRuntimeProperties *)runtimeProperties {
  return _client.runtimeProperties;
}

#pragma WCWebChannelClientHandlerDelegate

- (void)webChannelOpened:(__unused id<WCWebChannelClientProtocol>)client {
  [self.delegate webChannelOpened:self];
}

- (void)webChannelClosed:(__unused id<WCWebChannelClientProtocol>)client {
  [self.delegate webChannelClosed:self];
}

- (void)webChannel:(__unused id<WCWebChannelClientProtocol>)client didReceiveMessage:(id)message {
  [self.delegate webChannel:self didReceiveMessage:message];
}

- (void)webChannel:(__unused id<WCWebChannelClientProtocol>)client
    encounteredError:(WCWebChannelClientError)error {
  [self.delegate webChannel:self encounteredError:error];
}

- (void)webChannel:(__unused id<WCWebChannelClientProtocol>)client
    didReceiveHeaders:(NSDictionary<NSString *, NSString *> *)headers
           statusCode:(int)statusCode {
  [self.delegate webChannel:self didReceiveHeaders:headers statusCode:statusCode];
}

- (void)webChannel:(__unused id<WCWebChannelClientProtocol>)client
    didReceiveMetadata:(id)metadata
                   key:(NSString *)key {
  [self.delegate webChannel:self didReceiveMetadata:metadata key:key];
}

@end
