#import "WCEventNotification.h"

NSNotificationName const kWCEventNotificationName = @"com.google.webchannel.EventNotification";
NSString *const kWCEventNotificationHandshakeRttKey = @"WCEventNotificationHandshakeRttKey";
NSNotificationName const kWCDiagnosticNotificationName = @"com.google.webchannel.DiagnosticNotification";
NSString *const kWCDiagnosticEventKey = @"event";
NSString *const kWCDiagnosticChannelKey = @"channel";
NSString *const kWCDiagnosticMethodKey = @"method";
NSString *const kWCDiagnosticRequestIDKey = @"requestID";
NSString *const kWCDiagnosticAttemptKey = @"attempt";
NSString *const kWCDiagnosticTimeoutKey = @"timeout";
NSString *const kWCDiagnosticDelayKey = @"delay";
NSString *const kWCDiagnosticErrorKey = @"error";
NSString *const kWCDiagnosticStatusCodeKey = @"statusCode";
