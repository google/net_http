package com.google.net.webchannel.client;

import com.google.errorprone.annotations.CanIgnoreReturnValue;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.concurrent.ThreadSafe;
import org.jspecify.annotations.Nullable;

/**
 * For configuring the webchannel runtime behavior.
 *
 * <p>See the WebChannel JS API spec.
 *
 * @see WebChannelTransport#createWebChannel(String, WebChannelOptions)
 */
@ThreadSafe
public final class WebChannelOptions {
  private @Nullable Map<String, String> messageHeaders;
  private @Nullable Map<String, String> initMessageHeaders;
  private boolean encodeInitMessageHeaders = false;
  private @Nullable String messageContentType;
  private @Nullable Map<String, String> messageUrlParams;
  private boolean clientProtocolHeaderRequired = false;
  private int concurrentRequestLimit = 0; // default per implementation
  private boolean sendRawJson = false;
  private @Nullable String httpSessionIdParam;
  private boolean forceLongPolling = false;
  private boolean detectBufferingProxy = false;
  private boolean fastHandshake = false;
  private boolean blockingHandshake = false;
  private boolean disableRedact = false;
  private @Nullable String clientProfile;
  private @Nullable String networkTestUrl;
  private InternalChannelParams internalChannelParams = InternalChannelParams.getDefault();
  private boolean enableBinaryEncoding = false;

  private WebChannelOptions() {}

  public @Nullable Map<String, String> getMessageHeaders() {
    return this.messageHeaders;
  }

  public @Nullable Map<String, String> getInitMessageHeaders() {
    return this.initMessageHeaders;
  }

  public boolean getEncodeInitMessageHeaders() {
    return this.encodeInitMessageHeaders;
  }

  public @Nullable String getMessageContentType() {
    return this.messageContentType;
  }

  public @Nullable Map<String, String> getMessageUrlParams() {
    return this.messageUrlParams;
  }

  public boolean getClientProtocolHeaderRequired() {
    return this.clientProtocolHeaderRequired;
  }

  public int getConcurrentRequestLimit() {
    return this.concurrentRequestLimit;
  }

  public boolean getSendRawJson() {
    return this.sendRawJson;
  }

  public @Nullable String getHttpSessionIdParam() {
    return this.httpSessionIdParam;
  }

  public boolean getForceLongPolling() {
    return this.forceLongPolling;
  }

  public boolean getDetectBufferingProxy() {
    return this.detectBufferingProxy;
  }

  public boolean getFastHandshake() {
    return this.fastHandshake;
  }

  public boolean getBlockingHandshake() {
    return this.blockingHandshake;
  }

  public boolean getDisableRedact() {
    return this.disableRedact;
  }

  public @Nullable String getClientProfile() {
    return this.clientProfile;
  }

  public @Nullable String getNetworkTestUrl() {
    return this.networkTestUrl;
  }

  public InternalChannelParams getInternalChannelParams() {
    return this.internalChannelParams;
  }

  public boolean getEnableBinaryEncoding() {
    return this.enableBinaryEncoding;
  }

  /** The builder class. */
  public static class Builder {
    private WebChannelOptions options = new WebChannelOptions();

    public Builder() {}

    // TODO(wenboz): match JS in mutability
    @CanIgnoreReturnValue
    public Builder messageHeaders(Map<String, String> val) {
      if (val != null) {
        options.messageHeaders = new HashMap<>(val);
      }
      return this;
    }

    @CanIgnoreReturnValue
    public Builder initMessageHeaders(Map<String, String> val) {
      if (val != null) {
        options.initMessageHeaders = new HashMap<>(val);
      }
      return this;
    }

    @CanIgnoreReturnValue
    public Builder encodeInitMessageHeaders(boolean val) {
      options.encodeInitMessageHeaders = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder messageContentType(String val) {
      if (val != null) {
        options.messageContentType = val;
      }
      return this;
    }

    @CanIgnoreReturnValue
    public Builder messageUrlParams(Map<String, String> val) {
      if (val != null) {
        options.messageUrlParams = new HashMap<>(val);
      }
      return this;
    }

    @CanIgnoreReturnValue
    public Builder clientProtocolHeaderRequired(boolean val) {
      options.clientProtocolHeaderRequired = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder concurrentRequestLimit(int val) {
      options.concurrentRequestLimit = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder sendRawJson(boolean val) {
      options.sendRawJson = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder httpSessionIdParam(String val) {
      options.httpSessionIdParam = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder forceLongPolling(boolean val) {
      options.forceLongPolling = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder detectBufferingProxy(boolean val) {
      options.detectBufferingProxy = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder fastHandshake(boolean val) {
      options.fastHandshake = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder blockingHandshake(boolean val) {
      options.blockingHandshake = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder disableRedact(boolean val) {
      options.disableRedact = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder clientProfile(String val) {
      options.clientProfile = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder internalChannelParams(InternalChannelParams val) {
      options.internalChannelParams = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder networkTestUrl(String val) {
      options.networkTestUrl = val;
      return this;
    }

    @CanIgnoreReturnValue
    public Builder enableBinaryEncoding(boolean val) {
      options.enableBinaryEncoding = val;
      return this;
    }

    public WebChannelOptions build() {
      return options;
    }
  }
}
