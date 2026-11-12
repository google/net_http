# Periodic-send retry reset audit

The spec expects a send every 5 s to reset the forward retry count, making the
back-channel retry budget bound channel lifetime. Measurements are retained even
when they disagree with that expectation.

In the tested SDK source, `WCWebChannelClientInternal.m`:

- `checkForwardChannelAvailabilityThenStart` returns immediately if the forward
  request pool is full (line 519) or a forward request is already scheduled
  (line 522).
- `_forwardChannelRetryCount = 0` occurs later in that method (line 535).
- `canRetryForwardChannel` also checks scheduled work and the forward retry
  limit (around lines 1023–1037).
- `retryForwardChannel` schedules a retry and increments the count (around
  lines 1042–1063).

Thus a new application send does not unconditionally reset the count. This is
a source-based explanation candidate, not a complete trace of the private
counter: the counter itself was not instrumented. M5 logs include concurrent
POSTs, timeouts, and “Use the retry request that is already scheduled.”

Use `analysis.csv` / `analysis.md` for measured abort times and non-acked counts,
and each M5 trial's raw SDK log for the request timeline. The SDK implementation
was not changed to make the experiment match the expected behavior.
