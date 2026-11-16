// Experimental, Xcode-version-specific helper. No third-party runtime dependencies.
#import <Foundation/Foundation.h>
#import <dlfcn.h>
#import <signal.h>
#import <time.h>

// Declarations for private selectors observed in the installed Xcode runtime.
@interface NSObject (XcodeConditionSPI)
+ (void)initializeApplicationDirectoryName:(NSString *)name;
+ (BOOL)loadAllPlatformsReturningError:(NSError **)error;
+ (id)defaultPlugInManager;
- (BOOL)scanForPlugIns:(NSError **)error;
+ (id)defaultDeviceManager;
- (BOOL)startLocatingWithError:(NSError **)error;
- (NSSet *)availableDevices;
- (void)createDTXChannelWithIdentifier:(NSString *)identifier completion:(void (^)(id, NSError *))completion;
+ (id)messageWithSelector:(SEL)selector objectArguments:(id)first, ...;
- (void)sendControlAsync:(id)message replyHandler:(void (^)(id))handler;
- (id)object;
- (NSError *)error;
- (void)cancel;
@end

static volatile sig_atomic_t interrupted = 0;
static void onSignal(int value) { interrupted = value; }
static double mono(void) { struct timespec t; clock_gettime(CLOCK_MONOTONIC, &t); return t.tv_sec + t.tv_nsec / 1e9; }
static void pump(void) { [[NSRunLoop currentRunLoop] runUntilDate:[NSDate dateWithTimeIntervalSinceNow:0.01]]; }
static void fail(NSString *message) { @throw [NSException exceptionWithName:@"ConditionHelperError" reason:message userInfo:nil]; }
static void event(NSString *name, NSDictionary *fields) {
    NSMutableDictionary *record = [fields mutableCopy] ?: [NSMutableDictionary dictionary];
    record[@"event"] = name;
    record[@"monotonic_seconds"] = @(mono());
    NSISO8601DateFormatter *fmt = [NSISO8601DateFormatter new];
    fmt.formatOptions = NSISO8601DateFormatWithInternetDateTime | NSISO8601DateFormatWithFractionalSeconds;
    record[@"mac_utc"] = [fmt stringFromDate:[NSDate date]];
    NSError *error = nil;
    NSData *json = [NSJSONSerialization dataWithJSONObject:record options:NSJSONWritingSortedKeys error:&error];
    if (!json) fail(error.description);
    fwrite(json.bytes, 1, json.length, stdout); fputc('\n', stdout); fflush(stdout);
}
static void loadBundle(NSString *path) {
    NSError *error = nil;
    if (![[NSBundle bundleWithPath:path] loadAndReturnError:&error]) fail([NSString stringWithFormat:@"Loading %@: %@",path,error]);
}
static void initializeXcode(NSString *xcode) {
    for (NSString *name in @[@"DVTFoundation", @"DTDeviceKitBase", @"DTDeviceKit", @"DVTCoreDeviceCore", @"DVTInstrumentsFoundation"]) {
        NSString *path = [NSString stringWithFormat:@"%@/Contents/SharedFrameworks/%@.framework/%@",xcode,name,name];
        if (!dlopen(path.UTF8String, RTLD_NOW | RTLD_GLOBAL)) fail(@(dlerror()));
    }
    loadBundle([xcode stringByAppendingString:@"/Contents/PlugIns/IDEiOSSupportCore.framework"]);
    loadBundle([xcode stringByAppendingString:@"/Contents/Developer/Platforms/iPhoneOS.platform/Developer/Library/Xcode/PrivatePlugIns/IDEiOSPlatformSupportCore.framework"]);
    [NSClassFromString(@"DVTDeveloperPaths") initializeApplicationDirectoryName:@"NetHTTPConditions"];
    NSError *error = nil;
    if (![NSClassFromString(@"DVTPlatform") loadAllPlatformsReturningError:&error]) fail(error.description);
    if (![[NSClassFromString(@"DVTPlugInManager") defaultPlugInManager] scanForPlugIns:&error]) fail(error.description);
}
static id findDevice(NSString *identifier) {
    id manager = [NSClassFromString(@"DVTDeviceManager") defaultDeviceManager];
    NSError *error = nil;
    if (![manager startLocatingWithError:&error]) fail(error.description);
    double deadline = mono() + 20;
    while (mono() < deadline && !interrupted) {
        for (id device in [manager availableDevices]) {
            if ([[device valueForKey:@"identifier"] isEqual:identifier]) return device;
        }
        pump();
    }
    fail(@"Device not found within 20 seconds (use its hardware UDID)."); return nil;
}
static id openChannel(id device) {
    __block BOOL done = NO; __block id channel = nil; __block NSError *error = nil;
    [device createDTXChannelWithIdentifier:@"com.apple.instruments.server.services.ConditionInducer" completion:^(id result, NSError *failure) {
        dispatch_async(dispatch_get_main_queue(), ^{ channel=result; error=failure; done=YES; });
    }];
    double deadline=mono()+20;
    while (!done && mono()<deadline && !interrupted) pump();
    if (!done || !channel) fail([NSString stringWithFormat:@"Opening condition channel: %@",error ?: @"timeout/interrupted"]);
    return channel;
}
static id invoke(id channel, NSString *selector, NSArray *arguments, BOOL replyExpected) {
    id message;
    if (arguments.count == 0) message = [NSClassFromString(@"DTXMessage") messageWithSelector:NSSelectorFromString(selector) objectArguments:nil];
    else if (arguments.count == 2) message = [NSClassFromString(@"DTXMessage") messageWithSelector:NSSelectorFromString(selector) objectArguments:arguments[0], arguments[1], nil];
    else { fail(@"Unsupported argument count."); return nil; }
    if (!replyExpected) { [channel sendControlAsync:message replyHandler:nil]; return nil; }
    __block BOOL done=NO; __block id result=nil; __block NSError *error=nil;
    [channel sendControlAsync:message replyHandler:^(id reply) {
        id value=[reply object]; NSError *failure=[reply error];
        dispatch_async(dispatch_get_main_queue(), ^{ result=value; error=failure; done=YES; });
    }];
    double deadline=mono()+10;
    // Ignore interruption here so cleanup/readback can finish after SIGINT/SIGTERM.
    while (!done && mono()<deadline) pump();
    if (!done || error) fail([NSString stringWithFormat:@"%@: %@",selector,error ?: @"timeout"]);
    return result;
}
static NSArray *list(id channel) {
    id value=invoke(channel,@"availableConditionInducers",nil,YES);
    if (![value isKindOfClass:NSArray.class]) fail(@"Unexpected profile-list response.");
    return value;
}
static BOOL anyActive(NSArray *groups) {
    for (NSDictionary *group in groups) if ([group[@"isActive"] boolValue]) return YES;
    return NO;
}
static NSDictionary *networkGroup(NSArray *groups) {
    for (NSDictionary *group in groups) if ([group[@"identifier"] isEqual:@"SlowNetworkCondition"]) return group;
    fail(@"Network Link condition not advertised by device."); return nil;
}
static void clearAndVerify(id channel) {
    event(@"disable_request",nil);
    invoke(channel,@"disableActiveCondition",nil,NO);
    // A following request checks state; the disable message itself has no reply.
    double deadline=mono()+5;
    do {
        NSArray *groups=list(channel);
        if (!anyActive(groups)) { event(@"inactive_verified",@{@"groups":groups}); return; }
        pump();
    } while (mono()<deadline);
    fail(@"Condition still active after disable; stop it in Xcode immediately.");
}
int main(int argc, const char **argv) { @autoreleasepool {
    // list UDID | run UDID SECONDS | clear UDID. Optional XCODE_APP env override.
    if (argc<3 || ![@[@"list",@"run",@"clear"] containsObject:@(argv[1])] ||
        (strcmp(argv[1],"run")==0 && argc!=4) || (strcmp(argv[1],"run")!=0 && argc!=3)) {
        fprintf(stderr,"Usage: %s list|clear UDID\n       %s run UDID SECONDS\n",argv[0],argv[0]); return 2;
    }
    NSString *command=@(argv[1]); double duration=0;
    if ([command isEqual:@"run"]) {
        char *end=NULL; duration=strtod(argv[3],&end);
        if (!end || *end || !isfinite(duration) || duration<=0 || duration>3600) { fprintf(stderr,"SECONDS must be finite, >0 and <=3600\n"); return 2; }
    }
    signal(SIGINT,onSignal); signal(SIGTERM,onSignal); setbuf(stdout,NULL);
    id channel=nil; BOOL attemptedActivation=NO; int status=0;
    @try {
        NSString *xcode=NSProcessInfo.processInfo.environment[@"XCODE_APP"] ?: @"/Applications/Xcode.app";
        initializeXcode(xcode);
        id device=findDevice(@(argv[2])); channel=openChannel(device);
        NSArray *groups=list(channel); event(@"initial_state",@{@"device":@(argv[2]),@"groups":groups});
        if ([command isEqual:@"clear"]) { clearAndVerify(channel); }
        else if ([command isEqual:@"run"]) {
            if (anyActive(groups)) fail(@"An existing condition is active; refusing to replace it.");
            NSDictionary *group=networkGroup(groups); NSDictionary *profile=nil;
            for (NSDictionary *p in group[@"profiles"]) if ([p[@"identifier"] isEqual:@"SlowNetwork100PctLoss"]) profile=p;
            if (!profile) fail(@"100% loss profile not advertised.");
            if (interrupted) fail(@"Interrupted before activation.");
            event(@"enable_request",@{@"condition":group[@"identifier"],@"profile":profile[@"identifier"],@"target_seconds":@(duration)});
            double requestedAt=mono(); attemptedActivation=YES;
            invoke(channel,@"enableConditionWithIdentifier:profileIdentifier:",@[group[@"identifier"],profile[@"identifier"]],YES);
            double acknowledgedAt=mono();
            event(@"enable_ack",@{@"request_round_trip_seconds":@(acknowledgedAt-requestedAt)});
            NSDictionary *active=networkGroup(list(channel));
            if (![active[@"isActive"] boolValue] || ![active[@"activeProfile"] isEqual:profile[@"identifier"]]) fail(@"Active-state verification failed.");
            event(@"active_verified",@{@"state":active});
            while (mono()<acknowledgedAt+duration && !interrupted) pump();
            event(@"hold_finished",@{@"elapsed_since_enable_ack":@(mono()-acknowledgedAt),@"signal":@(interrupted)});
        }
    } @catch (NSException *exception) { event(@"error",@{@"message":exception.reason ?: exception.name}); status=1; }
    @finally {
        if (attemptedActivation && channel) {
            @try { clearAndVerify(channel); }
            @catch(NSException *exception) { event(@"cleanup_failed",@{@"message":exception.reason ?: exception.name}); status=1; }
        }
        if (channel) [channel cancel];
    }
    if (interrupted && status==0) status=128+interrupted;
    return status;
} }
