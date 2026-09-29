package com.google.net.webchannel.client.support.basic.http;

import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableList;
import com.google.common.flogger.GoogleLogger;
import com.google.errorprone.annotations.CanIgnoreReturnValue;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

/**
 * HTTP request.
 *
 * <p>Implementation is not thread-safe.
 */
public final class HttpRequest {

  private static final GoogleLogger logger = GoogleLogger.forEnclosingClass();

  private static final int NUMBER_OF_RETRIES = 10;
  private static final int CONNECT_TIMEOUT = 20 * 1000;
  private static final int READ_TIMEOUT = 0;

  private final HttpTransport transport;

  private HttpHeaders headers = new HttpHeaders();
  private String content;

  private String requestMethod;
  private URL url;

  public HttpRequest(HttpTransport transport, String requestMethod) {
    this.transport = Preconditions.checkNotNull(transport);
    setRequestMethod(requestMethod);
  }

  public HttpTransport getTransport() {
    return transport;
  }

  public String getRequestMethod() {
    return requestMethod;
  }

  @CanIgnoreReturnValue
  public HttpRequest setRequestMethod(String requestMethod) {
    this.requestMethod = Preconditions.checkNotNull(requestMethod);
    return this;
  }

  public URL getUrl() {
    return url;
  }

  @CanIgnoreReturnValue
  @SuppressWarnings("LogAndThrow")
  public HttpRequest setUrl(String encodedURL) {
    Preconditions.checkNotNull(encodedURL);
    try {
      url = new URL(encodedURL);
    } catch (MalformedURLException e) {
      logger.atWarning().withCause(e).log("Invalid string url %s.", encodedURL);
      throw new IllegalArgumentException(e);
    }
    return this;
  }

  @CanIgnoreReturnValue
  public HttpRequest setUrl(URL url) {
    this.url = Preconditions.checkNotNull(url);
    return this;
  }

  public String getContent() {
    return content;
  }

  /** HttpHeaders must be initialized before setContent, and "Content-Type" should not be null. */
  @CanIgnoreReturnValue
  public HttpRequest setContent(String content) {
    if (content != null) {
      Preconditions.checkNotNull(
          headers.get(HttpHeaders.CONTENT_TYPE),
          "Content-Type must be specified in headers when content is not null");
    }
    this.content = content;
    return this;
  }

  public HttpHeaders getHeaders() {
    return headers;
  }

  @CanIgnoreReturnValue
  public HttpRequest setHeaders(HttpHeaders headers) {
    this.headers = Preconditions.checkNotNull(headers);
    return this;
  }

  /**
   * Execute the HTTP request and returns the HTTP response.
   *
   * <p>Note that regardless of the returned status code, the HTTP response content has not been
   * parsed yet, and must be parsed by the calling code.
   *
   * @return HTTP response for an HTTP success response or HTTP error response
   */
  public HttpResponse execute() throws IOException {
    Preconditions.checkNotNull(requestMethod);
    Preconditions.checkNotNull(url);

    boolean retryRequest = false;
    int retriesRemaining = NUMBER_OF_RETRIES;
    HttpResponse response = null;

    do {
      // Create the HttpURLConnection.
      HttpURLConnection connection = transport.buildConnection(requestMethod, url);

      // Set up request properties and log them.
      StringBuilder logbuf =
          new StringBuilder(requestMethod).append(" Request: ").append(url).append("\n");

      writeHeaders(headers, logbuf, connection);
      writeContent(content, logbuf, connection);

      logger.atConfig().log("Request: \n%s", logbuf);
      connection.setReadTimeout(READ_TIMEOUT);
      connection.setConnectTimeout(CONNECT_TIMEOUT);

      // Connect to the server and wrap the connection response as HttpResponse.
      boolean responseConstructed = false;
      try {
        connection.connect();
        response = new HttpResponse(connection);
        responseConstructed = true;
      } finally {
        // Will need to close the connection and inputstream if fail to construct the HttpResponse.
        if (!responseConstructed) {
          InputStream lowLevelContent = HttpResponse.getConnectionStream(connection);
          if (lowLevelContent != null) {
            lowLevelContent.close();
          }
          connection.disconnect();
        }
      }

      boolean responseProcessed = false;
      retryRequest = retriesRemaining > 0;
      try {
        if (!response.isSuccessStatusCode()) {
          // It is a redirect request.
          retryRequest &= handleRedirect(response.getStatusCode(), response.getHeaders());
        } else {
          retryRequest = false;
        }
        retriesRemaining--;
        responseProcessed = true;
      } finally {
        if (!responseProcessed || retryRequest) {
          response.disconnect();
        }
      }
    } while (retryRequest);

    return response;
  }

  /** Serializes headers to an HttpURLConnection RequestProperty. */
  private static void writeHeaders(
      HttpHeaders headers, StringBuilder logbuf, HttpURLConnection connection) throws IOException {
    Preconditions.checkNotNull(connection);
    Preconditions.checkNotNull(logbuf);

    for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
      String name = entry.getKey();
      List<String> value = entry.getValue();
      if (value != null) {
        for (String repeatedValue : value) {
          if (repeatedValue != null) {
            logbuf.append(name).append(": ").append(repeatedValue).append("\n");
            connection.addRequestProperty(name, repeatedValue);
          }
        }
      }
    }
  }

  /** Write the request content to the connection outputstream and log the content . */
  @SuppressWarnings("Finally")
  private static void writeContent(
      String stringContent, StringBuilder logbuf, HttpURLConnection connection) throws IOException {
    if (stringContent == null) {
      return;
    }
    Preconditions.checkNotNull(connection, "Connection is null.");
    Preconditions.checkNotNull(logbuf);

    byte[] bytes = stringContent.getBytes(StandardCharsets.UTF_8);
    int contentLength = bytes.length;
    connection.setRequestProperty(HttpHeaders.CONTENT_LENGTH, Integer.toString(contentLength));

    logbuf.append("Content: ").append(stringContent).append("\n");
    logbuf.append("Content-Length: ").append(contentLength).append("\n");

    String requestMethod = connection.getRequestMethod();
    if ("POST".equals(requestMethod) || "PUT".equals(requestMethod)) {
      connection.setDoOutput(true);

      // If Content-length can't be calculated, may use connection.setChunkedStreamingMode(0).
      connection.setFixedLengthStreamingMode(contentLength);

      try (OutputStream out = connection.getOutputStream()) {
        out.write(bytes);
      }

    } else {
      // cannot call setDoOutput(true) because it would change a GET method to POST
      // for HEAD, OPTIONS, DELETE, or TRACE it would throw an exceptions
      Preconditions.checkArgument(
          contentLength == 0, "%s with non-zero content length is not supported", requestMethod);
    }
  }

  /**
   * Sets up this request object to handle the necessary redirect, it is a redirect status code and
   * the header has a location.
   */
  @SuppressWarnings("LogAndThrow")
  private boolean handleRedirect(int statusCode, HttpHeaders responseHeaders) {
    String redirectLocation = responseHeaders.getFirstHeaderValue("Location");
    List<Integer> redirectCodes =
        ImmutableList.of(
            HttpResponse.STATUS_CODE_MOVED_PERMANENTLY,
            HttpResponse.STATUS_CODE_FOUND,
            HttpResponse.STATUS_CODE_SEE_OTHER,
            HttpResponse.STATUS_CODE_TEMPORARY_REDIRECT);
    if (redirectCodes.contains(statusCode) && redirectLocation != null) {
      try {
        setUrl(new URL(url, redirectLocation));
      } catch (MalformedURLException e) {
        logger.atWarning().withCause(e).log(
            "Redirect connection failed with wrong relative url: %s.", redirectLocation);
        throw new IllegalArgumentException(e);
      }

      // On 303 change method to GET.
      if (statusCode == HttpResponse.STATUS_CODE_SEE_OTHER) {
        setRequestMethod("GET");
        // GET requests do not support non-zero content length.
        setContent(null);
        headers.remove(HttpHeaders.CONTENT_TYPE);
        headers.remove(HttpHeaders.CONTENT_LENGTH);
      }

      // remove Authorization and If-* headers
      headers.remove(HttpHeaders.AUTHORIZATION);
      headers.remove(HttpHeaders.IF_MATCH);
      headers.remove(HttpHeaders.IF_NONE_MATCH);
      headers.remove(HttpHeaders.IF_MODIFIED_SINCE);
      headers.remove(HttpHeaders.IF_UNMODIFIED_SINCE);
      headers.remove(HttpHeaders.IF_RANGE);
      return true;
    }
    return false;
  }
}
