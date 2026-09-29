package com.google.net.webchannel.client.xplat;

import static com.google.common.truth.Truth.assertThat;

import com.google.net.webchannel.client.WebChannelOptions;
import com.google.net.webchannel.client.xplat.Support.Debugger;
import com.google.net.webchannel.client.xplat.Support.HttpRequest;
import com.google.net.webchannel.client.xplat.Support.JsonDecoder;
import com.google.net.webchannel.client.xplat.Support.RequestStat;
import com.google.net.webchannel.client.xplat.Support.Uri;
import com.google.net.webchannel.client.xplat.Support.UriBuilder;
import com.google.net.webchannel.client.xplat.Support.UrlEncoder;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class WebChannelBaseTest {

  private static final class FakeUri extends Uri {
    @Override
    public String toString() {
      return "http://test.fake.uri";
    }
  }

  private static final class FakeUriBuilder extends UriBuilder {
    @Override
    public UriBuilder addQueryParameter(String name, String value) {
      return this;
    }

    @Override
    public String getAuthority() {
      return "";
    }

    @Override
    public Uri getUri() {
      return new FakeUri();
    }

    @Override
    public UriBuilder clone() {
      return this;
    }

    @Override
    public String toString() {
      return "";
    }
  }

  private static final class FakeDebugger extends Debugger {
    @Override
    public void info(String text) {}

    @Override
    public void warning(String text) {}

    @Override
    public void dumpException(Exception ex, String msg) {}

    @Override
    public void severe(String text) {}

    @Override
    public void assertCondition(boolean condition, String text) {}
  }

  private static final class FakeSupport extends Support {
    final List<RequestStat> notifiedStats = new ArrayList<>();

    @Override
    public void notifyStatEvent(RequestStat event) {
      notifiedStats.add(event);
    }

    @Override
    public Object setTimeout(TimeoutHandler handler, long timeout) {
      return new Object();
    }

    @Override
    public void clearTimeout(Object timer) {}

    @Override
    public UriBuilder newUriBuilder(Uri uri) {
      return new FakeUriBuilder();
    }

    @Override
    public UriBuilder newUriBuilder(String uri) {
      return new FakeUriBuilder();
    }

    @Override
    public Debugger getDebugger() {
      return new FakeDebugger();
    }

    @Override
    public HttpRequest newHttpRequest() {
      return new HttpRequest() {
        @Override
        public String getResponseHeader(String name) {
          return null;
        }

        @Override
        public java.util.Map<String, String> getAllResponseHeadersForDebugging() {
          return new java.util.HashMap<>();
        }

        @Override
        public RequestReadyState getReadyState() {
          return RequestReadyState.UNINITIALIZED;
        }

        @Override
        public RequestErrorCode getLastErrorCode() {
          return RequestErrorCode.NO_ERROR;
        }

        @Override
        public int getStatus() {
          return 200;
        }

        @Override
        public void send(
            UriBuilder uri,
            String verb,
            String postData,
            java.util.Map<String, String> headers) {}

        @Override
        public void abort() {}
      };
    }

    @Override
    public UrlEncoder getUrlEncoder() {
      return null;
    }

    @Override
    public JsonDecoder getJsonDecoder() {
      return null;
    }

    @Override
    public Base64Encoder getBase64Encoder() {
      return null;
    }

    @Override
    public Base64Decoder getBase64Decoder() {
      return null;
    }
  }

  @Test
  public void onBpDetectionTimer_notifiesProxyStat() throws Exception {
    FakeSupport support = new FakeSupport();
    WebChannelOptions options = new WebChannelOptions.Builder().detectBufferingProxy(true).build();
    WebChannelBase webChannelBase = new WebChannelBase(support, options, 1, null);

    // Set bpDetectionTimer and backChannelUri so timeout handler proceeds cleanly
    Field timerField = WebChannelBase.class.getDeclaredField("bpDetectionTimer");
    timerField.setAccessible(true);
    timerField.set(webChannelBase, new Object());

    Field uriField = WebChannelBase.class.getDeclaredField("backChannelUri");
    uriField.setAccessible(true);
    uriField.set(webChannelBase, new FakeUriBuilder());

    // Trigger BP detection timer
    Method method = WebChannelBase.class.getDeclaredMethod("onBpDetectionTimer");
    method.setAccessible(true);
    method.invoke(webChannelBase);

    assertThat(support.notifiedStats).contains(RequestStat.PROXY);
  }

  @Test
  public void onFirstByteReceived_notifiesNoProxyStat() throws Exception {
    FakeSupport support = new FakeSupport();
    WebChannelOptions options = new WebChannelOptions.Builder().detectBufferingProxy(true).build();
    WebChannelBase webChannelBase = new WebChannelBase(support, options, 1, null);

    // Set backChannelRequest
    ChannelRequest request =
        new ChannelRequest(support, webChannelBase, "test-session", "test-request");
    Field field = WebChannelBase.class.getDeclaredField("backChannelRequest");
    field.setAccessible(true);
    field.set(webChannelBase, request);

    // Set bpDetectionTimer so assertCondition passes
    Field timerField = WebChannelBase.class.getDeclaredField("bpDetectionTimer");
    timerField.setAccessible(true);
    timerField.set(webChannelBase, new Object());

    webChannelBase.onFirstByteReceived(request, new StringBuilder());

    assertThat(support.notifiedStats).contains(RequestStat.NOPROXY);
  }
}
