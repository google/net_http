#import "WCDispatcher.h"

#import "WCLogger.h"

#include <objc/runtime.h>

@implementation WCDispatcher {
  id _target;
  Protocol *_protocol;
  dispatch_queue_t _dispatchQueue;
}

+ (id)strongDispatcherWithTarget:(id)target
                        protocol:(Protocol *)protocol
                   dispatchQueue:(dispatch_queue_t)dispatchQueue {
  return [[WCDispatcher alloc] initWithTarget:target protocol:protocol dispatchQueue:dispatchQueue];
}

- (instancetype)initWithTarget:(id)target
                      protocol:(Protocol *)protocol
                 dispatchQueue:(dispatch_queue_t)dispatchQueue {
  if (![target conformsToProtocol:protocol]) {
    WCDevAssert(NO, @"target object must conforms to protocol.");
    return nil;
  }
  _protocol = protocol;
  _dispatchQueue = dispatchQueue;
  _target = target;
  return self;
}

#pragma mark - NSProxy

- (void)forwardInvocation:(NSInvocation *)invocation {
  [invocation retainArguments];
  dispatch_async(_dispatchQueue, ^{
    [invocation invokeWithTarget:_target];
  });
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)selector {
  struct objc_method_description methodDescription =
      protocol_getMethodDescription(_protocol, selector, YES, YES);
  if (methodDescription.name == NULL) {
    methodDescription = protocol_getMethodDescription(_protocol, selector, NO, YES);
    if (methodDescription.name == NULL) {
      return nil;
    }
  }
  return [NSMethodSignature signatureWithObjCTypes:methodDescription.types];
}

#pragma mark - NSObject

- (BOOL)conformsToProtocol:(Protocol *)protocol {
  return protocol_conformsToProtocol(_protocol, protocol);
}

- (BOOL)respondsToSelector:(SEL)selector {
  return [self methodSignatureForSelector:selector] != nil;
}

@end
