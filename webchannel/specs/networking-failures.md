**Failure detection and recovery for iOS client and beyond**

**Objective**: describe the design principles on optimal transport (webchannel and below) behaviors on iOS and how they should match the corresponding application behaviors.

**Failure detection**

1. Deterministic networking conditions (e.g. network off/on) should be detected immediately
    1. Applications should be notified of the networking state
1. Transient networking failures, e.g. networking handoff, backhole, including those not distinguishable from server or proxy failures, will rely on adhoc methods for failure detection, e.g. timeout/retry
    1. QoS failures, e.g. partial packet loss, are considered a performance issue.
    1. Client and server, and their different stack layers may employ different timeouts
    1. Algorithm parameters used by the client and server-side detection may or may not be coordinated
1. The client-side and server-side failure detection may be asymmetric wrt determinism or failfast behaviors.
    1. The client and server may not be directly connected, e.g. L4/L7 proxies between the client-GFE

**Failure recovery**

1. Deterministic networking on/off transitions should be handled directly by the transport and application layers
    1.  Leave any e2e decisions to the application, i.e. when to abort when the network stays off for a sustained period
    1. Leave the immediate recovery to the transport-layer (which monitors the same networking state), assuming fail-fast is disabled
1. Clients may detect failures and initiate retries before the server detects any failures
    1. Server-side stacks, at the application-level or transport-level, should be able to leverage in-memory session states to resume the underlying transport or application-level session without incurring a full teardown or restart
    1. Similar to 4.b, applications should leave enough time for the transport recovery to complete first, as a form of optimization.

Recovery windows

1. Deterministic failure recovery window: 2s ?
    1.  i.e. how long the app may wait for the transport to recover first
1. Transient failure recovery window
    1. the maximum transport recovery window should be significantly (?) smaller than the e2e client-side or server-side deadline (e.g. rpc deadline 360s)
    1. for the transport layer or for the application layer, client-side windows should be smaller than the server-side windows: +5s ?
