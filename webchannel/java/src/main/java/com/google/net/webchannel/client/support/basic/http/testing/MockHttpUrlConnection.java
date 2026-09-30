package com.google.net.webchannel.client.support.basic.http.testing;

import com.google.errorprone.annotations.CanIgnoreReturnValue;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/** A fake HttpUrlConnection. */
public class MockHttpUrlConnection extends HttpURLConnection {
  private String stringContent;

  public MockHttpUrlConnection(String method) throws MalformedURLException {
    super(new URL("http://www.google.com"));
    this.method = method;
    responseCode = 200;
  }

  @Override
  public InputStream getInputStream() throws IOException {
    if (stringContent != null) {
      return new ByteArrayInputStream(stringContent.getBytes(StandardCharsets.UTF_8));
    }
    return null;
  }

  @CanIgnoreReturnValue
  public MockHttpUrlConnection setResponseCode(int responseCode) {
    this.responseCode = responseCode;
    return this;
  }

  @CanIgnoreReturnValue
  public MockHttpUrlConnection setOutputStringContent(String stringContent) {
    this.stringContent = stringContent;
    return this;
  }

  @Override
  public OutputStream getOutputStream() throws IOException {
    return new ByteArrayOutputStream();
  }

  @Override
  public void connect() throws IOException {
    return;
  }

  @Override
  public void disconnect() {
    return;
  }

  @Override
  public boolean usingProxy() {
    return false;
  }
}
