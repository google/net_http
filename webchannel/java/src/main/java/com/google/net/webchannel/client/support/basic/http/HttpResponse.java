package com.google.net.webchannel.client.support.basic.http;

import com.google.common.base.Ascii;
import com.google.common.base.Preconditions;
import com.google.common.flogger.GoogleLogger;
import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPInputStream;

/**
 * HTTP response.
 *
 * <p>Callers should call disconnect() when the HTTP response object is no longer needed. However,
 * disconnect() does not have to be called if the response stream is properly closed.
 *
 * <p>Implementation is not thread-safe.
 */
public final class HttpResponse {
  private static final GoogleLogger logger = GoogleLogger.forEnclosingClass();

  public static final int STATUS_CODE_MOVED_PERMANENTLY = 301;
  public static final int STATUS_CODE_FOUND = 302;
  public static final int STATUS_CODE_SEE_OTHER = 303;
  public static final int STATUS_CODE_TEMPORARY_REDIRECT = 307;

  private final HttpURLConnection connection;

  private final int statusCode;
  private final String statusMessage;
  private final String contentEncoding;
  private final String contentType;

  /** Response headers. */
  private final HttpHeaders headers;

  /** HTTP response content, null before getContent(). */
  private InputStream content;

  /** Indicates if getContent() has been called. It is false by default. */
  private boolean contentRead;

  HttpResponse(HttpURLConnection connection) throws IOException {
    Preconditions.checkNotNull(connection);
    this.connection = connection;

    // Get response properties.
    statusCode = Math.max(0, connection.getResponseCode());
    statusMessage = connection.getResponseMessage();
    contentEncoding = connection.getContentEncoding();
    contentType = connection.getHeaderField(HttpHeaders.CONTENT_TYPE);
    headers = readHeaders(connection);

    // Logging.
    StringBuilder logbuf = new StringBuilder("Response received: \n");
    String field0 = connection.getHeaderField(0);
    if (field0 != null && field0.startsWith("HTTP/1.")) {
      logbuf.append(field0).append("\n");
    }
    logbuf.append("StatusCode: ").append(statusCode).append("\n");
    logbuf.append("StatusMessage: ").append(statusMessage).append("\n");
    logbuf.append("Headers: ").append(headers).append("\n");
    logger.atConfig().log("%s", logbuf);
  }

  /** Closes the content of the HTTP response from getContent(), ignoring any content. */
  public void ignore() throws IOException {
    InputStream content = getContent();
    if (content != null) {
      content.close();
    }
  }

  public void disconnect() throws IOException {
    ignore();
    connection.disconnect();
  }

  public String getContentEncoding() {
    return contentEncoding;
  }

  public String getContentType() {
    return contentType;
  }

  public HttpHeaders getHeaders() {
    return headers;
  }

  public boolean isSuccessStatusCode() {
    return statusCode >= 200 && statusCode < 300;
  }

  public int getStatusCode() {
    return statusCode;
  }

  public String getStatusMessage() {
    return statusMessage;
  }

  public long getContentLength() {
    String string = connection.getHeaderField(HttpHeaders.CONTENT_LENGTH);
    return string == null ? -1 : Long.parseLong(string);
  }

  /**
   * Returns the content of the HTTP response.
   *
   * <p>The result is cached, so subsequent calls will be fast.
   *
   * <p>Callers should call InputStream#close after the returned InputStream is no longer needed.
   */
  public InputStream getContent() throws IOException {
    if (!contentRead) {
      content = getConnectionStream(connection);
      if (content != null) {
        boolean contentProcessed = false;
        try {
          if (contentEncoding != null && Ascii.toLowerCase(contentEncoding).contains("gzip")) {
            content = new GZIPInputStream(content);
          }
          contentProcessed = true;
        } catch (EOFException e) {
          // this may happen for example on a HEAD request since there no actual response data read
          // in GZIPInputStream
          logger.atInfo().withCause(e).log("EOFException decoding gzip stream");
        } finally {
          if (!contentProcessed) {
            content.close();
          }
        }
      }
      contentRead = true;
    }
    return content;
  }

  static InputStream getConnectionStream(HttpURLConnection con) throws IOException {
    InputStream in = null;
    try {
      in = con.getInputStream();
    } catch (IOException ioe) {
      logger.atWarning().withCause(ioe).log(
          "Fail to get HttpUrlConnection InputStream, redirect to ErrorStream.");
      in = con.getErrorStream();
    }
    return in;
  }

  /** Puts all headers of the HttpURLConnection into this HttpHeaders object. */
  private static HttpHeaders readHeaders(HttpURLConnection con) {
    Preconditions.checkNotNull(con);
    HttpHeaders responseHeaders = new HttpHeaders();

    for (Map.Entry<String, List<String>> entry : con.getHeaderFields().entrySet()) {
      String key = entry.getKey();
      if (key != null) {
        ArrayList<String> list = new ArrayList<>();
        for (String value : entry.getValue()) {
          if (value != null) {
            list.add(value);
          }
        }
        responseHeaders.put(key, list);
      }
    }
    return responseHeaders;
  }
}
