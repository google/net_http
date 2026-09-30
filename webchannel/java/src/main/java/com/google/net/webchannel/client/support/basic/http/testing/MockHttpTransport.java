package com.google.net.webchannel.client.support.basic.http.testing;

import com.google.errorprone.annotations.CanIgnoreReturnValue;
import com.google.net.webchannel.client.support.basic.http.HttpRequest;
import com.google.net.webchannel.client.support.basic.http.HttpTransport;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

/** Note that unlike the original class, this mock class is not thread-safe. */
public final class MockHttpTransport extends HttpTransport {

  private MockHttpUrlConnection connection;
  private HttpRequest cachedRequest;

  public MockHttpTransport() {
    super(null);
  }

  @CanIgnoreReturnValue
  public MockHttpTransport setMockHttpUrlConnection(MockHttpUrlConnection connection) {
    this.connection = connection;
    return this;
  }

  @CanIgnoreReturnValue
  public MockHttpTransport setConnection(MockHttpUrlConnection connection) {
    this.connection = connection;
    return this;
  }

  /** Get the last request that was created. */
  public HttpRequest getRequest() {
    return cachedRequest;
  }

  @Override
  public HttpRequest createRequest(String method) {
    cachedRequest = new HttpRequest(this, method);
    return cachedRequest;
  }

  @Override
  protected HttpURLConnection buildConnection(String method, URL connUrl) throws IOException {
    if (connection != null) {
      return connection;
    }
    return new MockHttpUrlConnection(method);
  }
}
