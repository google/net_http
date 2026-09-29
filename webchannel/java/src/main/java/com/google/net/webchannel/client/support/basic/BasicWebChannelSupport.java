package com.google.net.webchannel.client.support.basic;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.common.base.Preconditions;
import com.google.net.webchannel.client.xplat.Support;
import java.net.URLEncoder;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/**
 * Native Java WebChannel Support layer implementation.
 *
 * <p>The given {@code apiThreadExecutor} must be single-threaded.
 */
class BasicWebChannelSupport extends Support {

  /** For handling all the WebChannel client calls and callbacks, including the timers. */
  private final ScheduledExecutorService apiThreadExecutor;
  /** For handling any (potentially blocking) network traffic. */
  private final ExecutorService networkExecutor;

  /** The given {@code apiThreadExecutor} must be single-threaded. */
  public BasicWebChannelSupport(
      ScheduledExecutorService apiThreadExecutor, ExecutorService networkExecutor) {
    Preconditions.checkNotNull(apiThreadExecutor);
    Preconditions.checkNotNull(networkExecutor);
    this.apiThreadExecutor = apiThreadExecutor;
    this.networkExecutor = networkExecutor;
  }

  @Override
  public void notifyStatEvent(RequestStat event) {
    // optional for now.
  }

  @Override
  public void notifyServerReachabilityEvent(ServerReachability event) {
    // optional for now.
  }

  @Override
  public void notifyTimingEvent(int size, long rtt, int retries) {
    // optional for now.
  }

  @SuppressWarnings("FutureReturnValueIgnored")
  @Override
  public Object setTimeout(final TimeoutHandler handler, long timeout) {
    Preconditions.checkNotNull(handler);
    return apiThreadExecutor.schedule(() -> handler.onTimeout(), timeout, TimeUnit.MILLISECONDS);
  }

  @Override
  public void clearTimeout(Object timer) {
    Preconditions.checkArgument(timer instanceof ScheduledFuture);
    ((ScheduledFuture) timer).cancel(false);
  }

  @Override
  public UriBuilder newUriBuilder(Uri uri) {
    return BasicWebChannelSupportUriBuilder.parse(uri.toString());
  }

  @Override
  public UriBuilder newUriBuilder(String uri) {
    return BasicWebChannelSupportUriBuilder.parse(uri);
  }

  @Override
  public Debugger getDebugger() {
    return new BasicWebChannelSupportDebugger();
  }

  @Override
  public UrlEncoder getUrlEncoder() {
    return new UrlEncoder() {
      @Override
      public String encode(String data) {
        return URLEncoder.encode(data, UTF_8);
      }
    };
  }

  @Override
  public JsonDecoder getJsonDecoder() {
    return new BasicWebChannelSupportJsonDecoder();
  }

  @Override
  public Base64Encoder getBase64Encoder() {
    // optional for now.
    throw new UnsupportedOperationException("Not implemented");
  }

  @Override
  public Base64Decoder getBase64Decoder() {
    // optional for now.
    throw new UnsupportedOperationException("Not implemented");
  }

  @Override
  public HttpRequest newHttpRequest() {
    return new BasicWebChannelSupportHttpRequest(apiThreadExecutor, networkExecutor);
  }
}
