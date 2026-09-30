package com.google.net.webchannel.client.support.basic;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableList;
import com.google.common.flogger.GoogleLogger;
import com.google.common.io.Closeables;
import com.google.errorprone.annotations.concurrent.GuardedBy;
import com.google.net.webchannel.client.support.basic.http.HttpHeaders;
import com.google.net.webchannel.client.support.basic.http.HttpRequest;
import com.google.net.webchannel.client.support.basic.http.HttpResponse;
import com.google.net.webchannel.client.support.basic.http.HttpTransport;
import com.google.net.webchannel.client.xplat.Support.RequestErrorCode;
import com.google.net.webchannel.client.xplat.Support.RequestReadyState;
import com.google.net.webchannel.client.xplat.Support.RequestReadyStateChangeHandler;
import com.google.net.webchannel.client.xplat.Support.UriBuilder;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import javax.annotation.Nullable;
import javax.annotation.concurrent.NotThreadSafe;

/**
 * Implementation of WebChannel HttpRequest interface using {@link NetHttpTransport}.
 *
 * <p>All the incoming calls have to be done in the single thread of {@code apiThreadExecutor}. The
 * class then executes all the (blocking) network handling code in the given {@code networkExecutor}
 * and any callbacks are done in {@code apiThreadExecutor}.
 *
 * <p>TODO: Should portability become an issue, consider OkHttpClient as an alternative to {@link
 * NetHttpTransport}.
 */
@NotThreadSafe
final class BasicWebChannelSupportHttpRequest
    extends com.google.net.webchannel.client.xplat.Support.HttpRequest {
  private static final GoogleLogger logger = GoogleLogger.forEnclosingClass();

  private static final int READ_CHUNK_SIZE_BYTES = 1024;

  private final ExecutorService apiThreadExecutor;
  private final ExecutorService networkExecutor;

  private final HttpTransport transport;

  @Nullable private Future<?> responseFuture = null;

  /**
   * Lock to protect all objects shared between the network handling threads {@code networkExecutor}
   * and the single WebChannel thread in {@code apiThreadExecutor}.
   */
  private final Object lock = new Object();

  @GuardedBy("lock")
  private HttpHeaders responseHeaders = new HttpHeaders();

  @GuardedBy("lock")
  private int status = 0;

  @GuardedBy("lock")
  private RequestReadyState readyState = RequestReadyState.UNINITIALIZED;

  @GuardedBy("lock")
  private RequestErrorCode lastErrorCode = RequestErrorCode.NO_ERROR;

  @GuardedBy("lock")
  private boolean aborted = false;

  @GuardedBy("lock")
  private final StringBuilder responseTextBuilder = new StringBuilder();

  public BasicWebChannelSupportHttpRequest(
      ExecutorService apiThreadExecutor, ExecutorService networkExecutor) {
    this(apiThreadExecutor, networkExecutor, HttpTransport.createTransport());
  }

  public BasicWebChannelSupportHttpRequest(
      ExecutorService apiThreadExecutor, ExecutorService networkExecutor, HttpTransport transport) {
    this.apiThreadExecutor = apiThreadExecutor;
    this.networkExecutor = networkExecutor;
    this.transport = transport;
  }

  // incompatible types in return.
  @SuppressWarnings("nullness:return")
  @Override
  public String getResponseHeader(String name) {
    synchronized (lock) {
      return responseHeaders.getFirstHeaderValue(name);
    }
  }

  @Override
  public Map<String, String> getAllResponseHeadersForDebugging() {
    logger.atWarning().log(
        "Unsupported method call: getAllResponseHeadersForDebugging()");
    return new HashMap<>();
  }

  @Override
  public void drainResponseText(StringBuilder buffer) {
    synchronized (lock) {
      if (responseTextBuilder.length() == 0) {
        return;
      }

      buffer.append(responseTextBuilder);
      responseTextBuilder.setLength(0);
    }
  }

  @Override
  public RequestReadyState getReadyState() {
    synchronized (lock) {
      return readyState;
    }
  }

  @Override
  public RequestErrorCode getLastErrorCode() {
    synchronized (lock) {
      return lastErrorCode;
    }
  }

  @Override
  public int getStatus() {
    synchronized (lock) {
      return status;
    }
  }

  @Override
  public void send(
      UriBuilder uri,
      String verb,
      @Nullable String postData,
      @Nullable Map<String, String> headers) {
    Preconditions.checkState(
        responseFuture == null, "Send() was called twice on the same HttpRequest");
    this.responseFuture =
        networkExecutor.submit(() -> sendSynchronously(uri, verb, postData, headers));
  }

  /** Sends the HTTP channel request synchronously, blocking until a reply comes. */
  @SuppressWarnings("nullness:argument") // HttpHeaders.setAcceptEncoding(null)
  private void sendSynchronously(
      UriBuilder uri,
      String verb,
      @Nullable String postData,
      @Nullable Map<String, String> headers) {
    try {
      logger.atFine().log(
          "Sending HTTP %s request: %s to url: %s with headers: %s (%s)",
          verb, postData, uri, headers, this);

      HttpRequest request = transport.createRequest(verb);
      request.setUrl(uri.getUri().toString());
      if (headers != null) {
        HttpHeaders resquestHeaders = request.getHeaders();
        for (Map.Entry<String, String> header : headers.entrySet()) {
          resquestHeaders.put(header.getKey(), ImmutableList.of(header.getValue()));
        }
      }
      request.setContent(postData);

      HttpResponse response = request.execute();
      readHttpResponse(response);
    } catch (IOException e) {
      processRequestError(e);
    }
  }

  /**
   * Reads the HTTP response for the channel request and updates the channel state accordingly.
   *
   * <p>This method blocks waiting on the response content arriving over the pending Http request.
   *
   * <p>To be called from {@code networkExecutor}.
   */
  private void readHttpResponse(HttpResponse response) throws IOException {
    Preconditions.checkArgument(response != null);
    readResponseHeaders(response);
    readResponseBody(response);
    finishReadingResponse();
  }

  /**
   * Changes the state to INTERACTIVE as currently reading the response.
   *
   * <p>Also exports all the other metadata about the response, e.g., headers and possible errors.
   *
   * <p>To be called from {@code networkExecutor}.
   */
  private void readResponseHeaders(HttpResponse response) {
    synchronized (lock) {
      readyState = RequestReadyState.INTERACTIVE;
      responseHeaders = response.getHeaders();
      status = response.getStatusCode();
      if (response.isSuccessStatusCode()) {
        lastErrorCode = RequestErrorCode.NO_ERROR;
      } else {
        // TODO(seryondr): Make sure this mapping covers the error space actually used in WebChannel
        // communication and that the default HTTP_ERROR does not hide any important case that has
        // to be distinguished. Currently, this mapping copies the one from the xplat support.
        //
        // Error codes yet unmapped:
        // - FILE_NOT_FOUND;
        // - FF_SILENT_ERROR,
        // - CUSTOM_ERROR,
        // - ABORT,
        // - TIMEOUT,
        // - OFFLINE
        switch (status) {
          case 401: // Unauthorized
          case 403: // Forbidden
          case 404: // Not Found
            lastErrorCode = RequestErrorCode.ACCESS_DENIED;
            break;
          default:
            lastErrorCode = RequestErrorCode.HTTP_ERROR;
            break;
        }
        logger.atWarning().log("HTTP channel request failed with status: %d", status);
      }
    }
  }

  /**
   * Parses the contents of the HTTP response if any.
   *
   * <p>To be called from {@code networkExecutor}.
   */
  private void readResponseBody(HttpResponse response) throws IOException {
    InputStream content = response.getContent();
    if (content == null) {
      logger.atFine().log("No content in channel response");
      return;
    }

    String readChunkWait =
        System.getProperty("com.google.webchannel.client.support.read_interval_ms");
    Integer readIntervalMs = 0;
    if (readChunkWait != null) {
      readIntervalMs = Integer.parseInt(readChunkWait);
    }

    byte[] buffer = new byte[READ_CHUNK_SIZE_BYTES];
    int length;
    try (ByteArrayOutputStream result = new ByteArrayOutputStream()) {
      while ((length = content.read(buffer)) != -1) {
        if (readIntervalMs > 0) {
          // Injected I/O slow-down to trigger flow-control for testing
          logger.atFine().log("Response read chunk sleep for %s second", readChunkWait);
          try {
            TimeUnit.MILLISECONDS.sleep(readIntervalMs);
          } catch (Exception e) {
            logger.atWarning().log("Exception during adding sleep for reading each response chunk");
          }
        }
        result.write(buffer, 0, length);
        // ByteArrayOutputStream.toString(Charset) requires API level 33
        processChunk(result.toString(UTF_8.name()));
        result.reset();
      }
    } finally {
      Closeables.closeQuietly(content);
    }
  }

  /**
   * Process new chunk read from the response body.
   *
   * <p>To be called from {@code networkExecutor}.
   */
  private void processChunk(String chunk) {
    logger.atFine().log("Read %d chars from the channel: \"%s\"", chunk.length(), chunk);
    synchronized (lock) {
      responseTextBuilder.append(chunk);
    }
    apiThreadExecutor.execute(() -> notifyReadyStateChange());
  }

  /**
   * Sets the state as completed as the response has been fully read now.
   *
   * <p>To be called from {@code networkExecutor}.
   */
  private void finishReadingResponse() {
    logger.atFine().log("Finished reading channel response");
    synchronized (lock) {
      readyState = RequestReadyState.COMPLETE;
    }
    apiThreadExecutor.execute(() -> notifyReadyStateChange());
  }

  /**
   * Handles the case when the HTTP request failed with an exception.
   *
   * <p>To be called from {@code networkExecutor}.
   */
  private void processRequestError(IOException exception) {
    logger.atWarning().withCause(exception).log("HTTP channel request failed");
    synchronized (lock) {
      if (aborted) {
        lastErrorCode = RequestErrorCode.ABORT;
      } else {
        lastErrorCode = RequestErrorCode.EXCEPTION;
      }
      readyState = RequestReadyState.COMPLETE;
    }
    apiThreadExecutor.execute(() -> notifyReadyStateChange());
  }

  /**
   * Notifies the channel handler (if any) about a state change.
   *
   * <p>To be called from {@code apiThreadExecutor}.
   */
  private void notifyReadyStateChange() {
    RequestReadyStateChangeHandler readyStateChangeHandler = getReadyStateChangeHandler();
    if (readyStateChangeHandler != null) {
      readyStateChangeHandler.onReadyStateChangeEvent(this);
    }
  }

  @Override
  public void abort() {
    synchronized (lock) {
      Preconditions.checkState(!aborted, "Duplicit abort call");
      Preconditions.checkNotNull(responseFuture, "Unexpected abort call before any send call");
      aborted = true;
      responseFuture.cancel(true);
    }
  }
}
