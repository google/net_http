#import "WCLogger.h"

#if WC_DEV_ASSERT
BOOL gWCDevAssertEnabled = YES;
#else
BOOL gWCDevAssertEnabled = NO;
#endif  // WC_DEV_ASSERT
