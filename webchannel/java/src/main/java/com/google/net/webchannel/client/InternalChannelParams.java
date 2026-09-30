package com.google.net.webchannel.client;

import com.google.errorprone.annotations.CanIgnoreReturnValue;
import javax.annotation.concurrent.ThreadSafe;

/**
 * For configuring the webchannel parameters.
 *
 * <p>See the WebChannel JS API spec.
 */
@ThreadSafe
public final class InternalChannelParams {
  private static final boolean DEFAULT_FAIL_FAST = false;
  private static final int DEFAULT_BASE_RETRY_DELAY_MS = 5 * 1000;
  private static final int DEFAULT_RETRY_DELAY_SEED_MS = 10 * 1000;
  private static final int DEFAULT_FORWARD_CHANNEL_MAX_RETRIES = 2;
  private static final int DEFAULT_FORWARD_CHANNEL_REQUEST_TIMEOUT_MS = 20 * 1000;
  private static final InternalChannelParams DEFAULT_CHANNEL_PARAMS = new InternalChannelParams();

  private boolean failFast = DEFAULT_FAIL_FAST;
  private int baseRetryDelayMs = DEFAULT_BASE_RETRY_DELAY_MS;
  private int retryDelaySeedMs = DEFAULT_RETRY_DELAY_SEED_MS;
  private int forwardChannelMaxRetries = DEFAULT_FORWARD_CHANNEL_MAX_RETRIES;
  private int forwardChannelRequestTimeoutMs = DEFAULT_FORWARD_CHANNEL_REQUEST_TIMEOUT_MS;

  public InternalChannelParams() {}

  public boolean getFailFast() {
    return this.failFast;
  }

  @SuppressWarnings("GoodTime") // should return a java.time.Duration
  public int getBaseRetryDelayMs() {
    return this.baseRetryDelayMs;
  }

  @SuppressWarnings("GoodTime") // should return a java.time.Duration
  public int getRetryDelaySeedMs() {
    return this.retryDelaySeedMs;
  }

  public int getForwardChannelMaxRetries() {
    return this.forwardChannelMaxRetries;
  }

  @SuppressWarnings("GoodTime") // should return a java.time.Duration
  public int getForwardChannelRequestTimeoutMs() {
    return this.forwardChannelRequestTimeoutMs;
  }

  public static InternalChannelParams getDefault() {
    return DEFAULT_CHANNEL_PARAMS;
  }

  /** The builder class. */
  public static class Builder {
    private final InternalChannelParams channelParams = new InternalChannelParams();

    public Builder() {}

    @CanIgnoreReturnValue
    public Builder failFast(boolean val) {
      channelParams.failFast = val;
      return this;
    }

    @CanIgnoreReturnValue
    @SuppressWarnings("GoodTime") // Should accept java.time.Duration
    public Builder baseRetryDelayMs(int delayMs) {
      channelParams.baseRetryDelayMs = delayMs;
      return this;
    }

    @CanIgnoreReturnValue
    @SuppressWarnings("GoodTime") // Should accept java.time.Duration
    public Builder retryDelaySeedMs(int delayMs) {
      channelParams.retryDelaySeedMs = delayMs;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder forwardChannelMaxRetries(int val) {
      channelParams.forwardChannelMaxRetries = val;
      return this;
    }

    @CanIgnoreReturnValue
    @SuppressWarnings("GoodTime") // Should accept java.time.Duration
    public Builder forwardChannelRequestTimeoutMs(int timeoutMs) {
      channelParams.forwardChannelRequestTimeoutMs = timeoutMs;
      return this;
    }

    public InternalChannelParams build() {
      return channelParams;
    }
  }
}
