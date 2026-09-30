package com.google.net.webchannel.client.support.basic;

import static com.google.common.truth.Truth.assertThat;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.net.webchannel.client.support.basic.http.testing.MockHttpTransport;
import com.google.net.webchannel.client.support.basic.http.testing.MockHttpUrlConnection;
import com.google.net.webchannel.client.xplat.Support;
import java.io.IOException;
import java.io.InterruptedIOException;
import java.net.MalformedURLException;
import java.util.Arrays;
import java.util.Collection;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public final class BasicWebChannelSupportHttpRequestTest {
  private static final String TEST_URL = "http://test.url";

  /** Test all for both POST and GET HTTP methods. */
  @Parameters
  public static Collection<Object[]> data() {
    return Arrays.asList(new Object[][] {{"POST"}, {"GET"}});
  }

  private final ExecutorService perChannelExecutor = Executors.newSingleThreadExecutor();
  private final ExecutorService networkExecutor = Executors.newSingleThreadExecutor();
  private final String httpMethod;

  private BasicWebChannelSupportHttpRequest webChannelRequest;
  private MockHttpTransport transport;

  /** To signal WebChannel request completion. */
  private final CountDownLatch webChannelRequestCompleted = new CountDownLatch(1);
  /** To signal WebChannel request failure. */
  private final CountDownLatch webChannelRequestFailed = new CountDownLatch(1);

  private final Support.RequestReadyStateChangeHandler mockHandler = new MockStateChangeHandler();

  public BasicWebChannelSupportHttpRequestTest(String httpMethod) {
    this.httpMethod = httpMethod;
  }

  @Before
  public void setUp() throws Exception {
    transport = new MockHttpTransport();
    webChannelRequest =
        new BasicWebChannelSupportHttpRequest(perChannelExecutor, networkExecutor, transport);
    webChannelRequest.setReadyStateChangeHandler(mockHandler);
  }

  @Test
  public void responseOkWithContent() throws Exception {

    // when
    String stringContent = "GET".equals(httpMethod) ? null : "dummy body";
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL),
        httpMethod,
        stringContent,
        ImmutableMap.of("Content-Type", "text/html"));
    boolean completedInTime = webChannelRequestCompleted.await(10, TimeUnit.SECONDS);

    //then
    assertThat(completedInTime).isTrue();
    assertThat(webChannelRequest.getLastErrorCode()).isEqualTo(Support.RequestErrorCode.NO_ERROR);
    assertThat(webChannelRequest.getStatus()).isEqualTo(200);
    assertThat(transport.getRequest().getContent()).isEqualTo(stringContent);
  }

  @Test
  public void responseOkNoResponse() throws Exception {
    // when
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL), httpMethod, null, null);
    boolean completedInTime = webChannelRequestCompleted.await(10, TimeUnit.SECONDS);

    // then
    assertThat(completedInTime).isTrue();

    assertThat(webChannelRequest.getLastErrorCode()).isEqualTo(Support.RequestErrorCode.NO_ERROR);
    assertThat(webChannelRequest.getStatus()).isEqualTo(200);
    assertThat(getResponseString(webChannelRequest)).isEmpty();
  }

  @Test
  public void responseOkWithHeaders() throws Exception {
    // when
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL),
        httpMethod,
        null,
        ImmutableMap.of("test_header", "test value"));
    boolean completedInTime = webChannelRequestCompleted.await(10, TimeUnit.SECONDS);

    // then
    assertThat(completedInTime).isTrue();

    assertThat(webChannelRequest.getLastErrorCode()).isEqualTo(Support.RequestErrorCode.NO_ERROR);
    assertThat(webChannelRequest.getStatus()).isEqualTo(200);
    assertThat(transport.getRequest().getHeaders())
        .containsEntry("test_header", ImmutableList.of("test value"));
  }

  @Test
  public void responseOkWithResponse() throws Exception {
    // given
    String stringContent = "dummy body";
    transport.setMockHttpUrlConnection(
        new MockHttpUrlConnection(httpMethod).setOutputStringContent(stringContent));

    // when
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL), httpMethod, null, null);
    boolean completedInTime = webChannelRequestCompleted.await(10, TimeUnit.SECONDS);

    // then
    assertThat(completedInTime).isTrue();

    assertThat(webChannelRequest.getLastErrorCode()).isEqualTo(Support.RequestErrorCode.NO_ERROR);
    assertThat(webChannelRequest.getStatus()).isEqualTo(200);
    assertThat(getResponseString(webChannelRequest)).isEqualTo(stringContent);
  }

  @Test
  public void responseOkWithVeryLongResponse() throws Exception {
    // given
    String longMessage = "message".repeat(10000);
    transport.setMockHttpUrlConnection(
        new MockHttpUrlConnection(httpMethod).setOutputStringContent(longMessage));

    // when
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL), httpMethod, null, null);
    boolean completedInTime = webChannelRequestCompleted.await(10, TimeUnit.SECONDS);

    // then
    assertThat(completedInTime).isTrue();

    assertThat(webChannelRequest.getLastErrorCode()).isEqualTo(Support.RequestErrorCode.NO_ERROR);
    assertThat(webChannelRequest.getStatus()).isEqualTo(200);
    assertThat(getResponseString(webChannelRequest)).isEqualTo(longMessage);
  }

  @Test
  public void responseHttpFailure() throws Exception {
    // given
    transport.setMockHttpUrlConnection(new MockHttpUrlConnection(httpMethod).setResponseCode(501));

    // when
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL), httpMethod, null, null);
    boolean completedInTime = webChannelRequestCompleted.await(10, TimeUnit.SECONDS);

    // then
    assertThat(completedInTime).isTrue();

    assertThat(webChannelRequest.getLastErrorCode()).isEqualTo(Support.RequestErrorCode.HTTP_ERROR);
    assertThat(webChannelRequest.getStatus()).isEqualTo(501);
  }

  @Test
  public void responseAuthorizationFailure() throws Exception {
    // given
    transport.setMockHttpUrlConnection(new MockHttpUrlConnection(httpMethod).setResponseCode(401));

    // when
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL), httpMethod, null, null);
    boolean failedInTime = webChannelRequestFailed.await(10, TimeUnit.SECONDS);

    // then
    assertThat(failedInTime).isTrue();
    assertThat(webChannelRequest.getLastErrorCode())
        .isEqualTo(Support.RequestErrorCode.ACCESS_DENIED);
    assertThat(webChannelRequest.getStatus()).isEqualTo(401);
  }

  @Test
  public void requestException() throws Exception {
    // given
    transport.setMockHttpUrlConnection(new MockHttpUrlConnectionWithException(httpMethod));

    // when
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL), httpMethod, null, null);
    boolean failedInTime = webChannelRequestFailed.await(10, TimeUnit.SECONDS);

    // then
    assertThat(failedInTime).isTrue();

    assertThat(webChannelRequest.getLastErrorCode()).isEqualTo(Support.RequestErrorCode.EXCEPTION);
  }

  @Test
  public void requestTimeout() throws Exception {
    // given
    transport.setMockHttpUrlConnection(new MockHttpUrlConnectionWithTimeout(httpMethod));

    // when
    webChannelRequest.send(
        BasicWebChannelSupportUriBuilder.parse(TEST_URL), httpMethod, null, null);
    boolean completedInTime = webChannelRequestCompleted.await(1, TimeUnit.SECONDS);
    webChannelRequest.abort();
    boolean abortedInTime = webChannelRequestFailed.await(10, TimeUnit.SECONDS);

    // then
    assertThat(completedInTime).isFalse();
    assertThat(abortedInTime).isTrue();
    assertThat(webChannelRequest.getLastErrorCode()).isEqualTo(Support.RequestErrorCode.ABORT);
  }

  private static String getResponseString(Support.HttpRequest request) {
    StringBuilder builder = new StringBuilder();
    request.drainResponseText(builder);
    return builder.toString();
  }

  /** Mock state change handler that signals completion and failure events to the tests bodies. */
  private class MockStateChangeHandler implements Support.RequestReadyStateChangeHandler {
    @Override
    public void onReadyStateChangeEvent(Support.HttpRequest request) {
      if (request.getReadyState() == Support.RequestReadyState.COMPLETE) {
        webChannelRequestCompleted.countDown();
      }
      if (request.getLastErrorCode() != Support.RequestErrorCode.NO_ERROR) {
        webChannelRequestFailed.countDown();
      }
    }
  }

  /** Mock connection that, when executed, fails with an {@link IOException}. */
  private static class MockHttpUrlConnectionWithException extends MockHttpUrlConnection {

    public MockHttpUrlConnectionWithException(String method) throws MalformedURLException {
      super(method);
    }

    @Override
    public void connect() throws IOException {
      throw new IOException("Expected MockHttpUrlConnectionWithException failure");
    }
  }

  /** Mock connection that, when executed, blocks until interrupted. */
  private static class MockHttpUrlConnectionWithTimeout extends MockHttpUrlConnection {

    public MockHttpUrlConnectionWithTimeout(String method) throws MalformedURLException {
      super(method);
    }

    @Override
    public void connect() throws IOException {
      try {
        // Sleep forever.
        Thread.sleep(Long.MAX_VALUE);
      } catch (InterruptedException ignored) {
        Thread.currentThread().interrupt();
        throw new InterruptedIOException("MockLowLevelHttpRequestWithTimeout interrupted");
      }
      throw new AssertionError();
    }
  }
}
