#import <Foundation/Foundation.h>

#import "WCLogger.h"

extern BOOL gWCVerboseLoggingEnabled;

/** Convenience macro of Debug. */
#ifndef WCDefaultLoggerDebug

#define WCDefaultLoggerDebug(...) \
  if (gWCVerboseLoggingEnabled) { \
    NSLog(__VA_ARGS__);           \
  }

#ifndef DEBUG
#undef WCDefaultLoggerDebug
#define WCDefaultLoggerDebug(...) \
  do {                            \
  } while (0)
#endif

#endif

/** Convenience macro of Info. */
#ifndef WCDefaultLoggerInfo

#define WCDefaultLoggerInfo(...) NSLog(__VA_ARGS__);

#endif

/** Convenience macro of Error. */
#ifndef WCDefaultLoggerError

#define WCDefaultLoggerError(...) \
  if (gWCVerboseLoggingEnabled) { \
    NSLog(__VA_ARGS__);           \
  }

#endif

@interface WCDefaultLogger : NSObject <WCLogger>
@end
