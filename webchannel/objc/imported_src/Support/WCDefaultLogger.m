#import "WCDefaultLogger.h"
#import "WCHTTPRequest.h"

#if WC_VERBOSE_LOGGING
BOOL gWCVerboseLoggingEnabled = YES;
#else
BOOL gWCVerboseLoggingEnabled = NO;
#endif  // WC_VERBOSE_LOGGING

@implementation WCDefaultLogger

- (void)logInfo:(NSString *)message {
  WCDefaultLoggerInfo(@"%@", message);
}

- (void)logDebug:(NSString *)message {
  WCDefaultLoggerDebug(@"%@", message);
}

- (void)logWarning:(NSString *)message {
  WCDefaultLoggerInfo(@"Warning: %@", message);
}

- (void)dumpException:(NSException *)e withMessage:(NSString *)message {
  WCDefaultLoggerError(@"Exception:%@: %@", e.name, message);
}

- (void)logError:(NSString *)message {
  WCDefaultLoggerError(@"%@", message);
}

- (void)logHTTPRequest:(NSString *)verb
                   URL:(NSURL *)URL
                    ID:(NSString *)ID
               attempt:(int64_t)attempt
              postData:(NSString *)postData {
  NSString *text = [NSString stringWithFormat:@"XMLHTTP REQ (%@) [attempt %lld ]: %@ \n %@ \n %@", ID,
                                              attempt, verb, URL.absoluteString, postData];
  [self logDebug:text];
}

- (void)logHTTPChannelResponseMetaData:(NSString *)verb
                                   URL:(NSURL *)URL
                                    ID:(NSString *)ID
                               attempt:(int64_t)attempt
                                 state:(WCRequestReadyState)state
                            statusCode:(int32_t)code {
  NSString *text =
      [NSString stringWithFormat:@"XMLHTTP RESP (%@) [attempt %lld ]: %@ \n %@ \n %@ %d", ID,
                                 attempt, verb, URL.absoluteString,
                                 [self formatRequestReadyStateToString:state], code];
  [self logDebug:text];
}

- (NSString*)formatRequestReadyStateToString:(WCRequestReadyState)state {
    NSString *result = nil;
    switch(state) {
        case WCRequestReadyStateUninitialized:
            result = @"RequestReadyState Uninitialized";
            break;
        case WCRequestReadyStateLoaded:
            result = @"WCRequestReadyState Loaded";
            break;
        case WCRequestReadyStateInteractive:
            result = @"WCRequestReadyState Interactive";
            break;
        case WCRequestReadyStateComplete:
            result = @"RequestReadyState Complete";
            break;
        default:
            result = @"Unexpected state";
    }
    return result;
}

- (void)logHTTPChannelResponseText:(NSString *)responseText
                                ID:(NSString *)ID
                              desc:(NSString *)desc {
  NSString *text = [NSString stringWithFormat:@"XMLHTTP RESP (%@): %@ %@", ID, responseText, desc];
  [self logDebug:text];
}

@end
