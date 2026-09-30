package com.google.net.webchannel.client.xplat;

import com.google.j2objc.annotations.Weak;
import com.google.net.webchannel.client.xplat.Support.HttpRequest;
import com.google.net.webchannel.client.xplat.Support.RequestErrorCode;
import com.google.net.webchannel.client.xplat.Support.RequestReadyState;
import com.google.net.webchannel.client.xplat.Support.UriBuilder;
import org.jspecify.annotations.Nullable;

/**
 * Pings the network to check if an error is a server error or user's network error.
 *
 * <p>NOTE: Designed to be called only once during the lifetime of a WebChannel instance.
 */
class NetUtils implements Support.RequestReadyStateChangeHandler, Support.TimeoutHandler {
  public static final long NETWORK_TIMEOUT_MS = 10 * 1000;

  @Weak private final TestNetworkCallback callback;
  private final Support support;

  @SuppressWarnings("unused") // No need to cancel the timer.
  private @Nullable Object watchDogTimer;

  // Result of the test network request will only be sent once.
  private boolean isTestNetworkResultCalled = false;

  public NetUtils(TestNetworkCallback callback, Support support) {
    this.callback = callback;
    this.support = support;
  }

  public interface TestNetworkCallback {
    void onTestNetworkResult(boolean result);
  }

  public void testNetwork(UriBuilder uri) {
    HttpRequest request = support.newHttpRequest();
    request.setReadyStateChangeHandler(this);

    watchDogTimer = support.setTimeout(this, NETWORK_TIMEOUT_MS);
    request.send(uri, "GET", null, null);
  }

  @Override
  public void onReadyStateChangeEvent(HttpRequest request) {
    RequestReadyState readyState = request.getReadyState();
    RequestErrorCode errorCode = request.getLastErrorCode();

    if (readyState != RequestReadyState.COMPLETE) {
      return;
    }

    if (errorCode == RequestErrorCode.TIMEOUT) {
      onTestNetworkResult("TestPingServer: timeout", false);
      return;
    }

    int statusCode = request.getStatus();
    if (statusCode >= 200 && statusCode < 300) {
      // Typical status code from `/test?MODE=network` is 204 (No Content).
      onTestNetworkResult("TestPingServer: ok", true);
    } else {
      onTestNetworkResult("TestPingServer: server error (" + statusCode + ")", false);
    }
  }

  @Override
  public void onTimeout() {
    onTestNetworkResult("TestPingServer: timeout (timer)", false);
  }

  private void onTestNetworkResult(String debugMessage, boolean result) {
    if (isTestNetworkResultCalled) {
      return;
    }
    isTestNetworkResultCalled = true;

    support.getDebugger().info(debugMessage);
    callback.onTestNetworkResult(result);
  }
}
