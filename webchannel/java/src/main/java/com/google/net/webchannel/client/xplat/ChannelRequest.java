package com.google.net.webchannel.client.xplat;

import com.google.j2objc.annotations.Weak;
import com.google.net.webchannel.client.WebChannelConstants;
import com.google.net.webchannel.client.xplat.Support.Debugger;
import com.google.net.webchannel.client.xplat.Support.HttpRequest;
import com.google.net.webchannel.client.xplat.Support.RequestErrorCode;
import com.google.net.webchannel.client.xplat.Support.RequestReadyState;
import com.google.net.webchannel.client.xplat.Support.RequestStat;
import com.google.net.webchannel.client.xplat.Support.ServerReachability;
import com.google.net.webchannel.client.xplat.Support.Uri;
import com.google.net.webchannel.client.xplat.Support.UriBuilder;
import com.google.net.webchannel.client.xplat.Wire.QueuedMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jspecify.annotations.Nullable;

class ChannelRequest implements Support.RequestReadyStateChangeHandler, Support.TimeoutHandler {

  private static final long TIMEOUT_MS = 45 * 1000;

  // polling support not needed
  // unique uri not needed

  // streaming throttling not implemented
  // observer (event handler) not implemented (or needed)

  @Weak private final Channel channel;
  private final Debugger channelDebug;
  private final Support support;
  private final StringBuilder responseText;

  private final long retryId;
  private final String rid;
  private final String sid;

  private @Nullable Map<String, String> extraHeaders = null;
  private boolean successful = false;

  private long timeout;
  private @Nullable Object watchDogTimer;
  private long watchDogTimeoutTime;
  private long requestStartTime;
  private @Nullable Type type;
  private @Nullable Uri baseUri;
  private @Nullable UriBuilder requestUri;
  private @Nullable String postData;

  private List<QueuedMap> pendingMessages;

  private @Nullable HttpRequest httpRequest;

  private int chunkStart;
  private @Nullable String verb;
  private @Nullable ChannelError lastError;
  private int lastStatusCode;
  private boolean cancelled;
  private boolean decodeChunks;

  private boolean decodeInitialResponse;
  private boolean initialResponseDecoded;

  private boolean firstByteReceived;

  private enum Type {
    HTTP_REQUEST,
    CLOSE_REQUEST
  }

  public ChannelRequest(Support support, Channel channel, String sessionId, String requestId) {
    this(support, channel, sessionId, requestId, 1);
  }

  public ChannelRequest(
      Support support, Channel channel, String sessionId, String requestId, long retryId) {
    this.support = support;
    this.channel = channel;
    this.channelDebug = support.getDebugger();
    this.sid = sessionId;
    this.rid = requestId;
    this.retryId = retryId;
    this.timeout = TIMEOUT_MS;

    this.extraHeaders = null;
    this.successful = false;

    this.watchDogTimer = null;
    this.watchDogTimeoutTime = 0;
    this.requestStartTime = 0;
    this.type = null;
    this.baseUri = null;
    this.requestUri = null;
    this.postData = null;

    this.pendingMessages = new ArrayList<>();

    this.httpRequest = null;
    this.responseText = new StringBuilder();

    this.chunkStart = 0;
    this.verb = null;

    this.lastError = null;
    this.lastStatusCode = -1;

    this.cancelled = false;
    this.decodeChunks = false;

    this.decodeInitialResponse = false;
    this.initialResponseDecoded = false;

    this.firstByteReceived = false;
  }

  public static ChannelRequest createChannelRequest(
      Support support, Channel channel, String sessionId, String requestId, long retryId) {
    return new ChannelRequest(support, channel, sessionId, requestId, retryId);
  }

  public static ChannelRequest createChannelRequest(
      Support support, Channel channel, String sessionId, String requestId) {
    return new ChannelRequest(support, channel, sessionId, requestId);
  }

  public static boolean supportsHttpStreaming() {
    return true;
  }

  public void setExtraHeaders(@Nullable Map<String, String> extraHeaders) {
    this.extraHeaders = extraHeaders;
  }

  public void setVerb(String verb) {
    this.verb = verb;
  }

  public void setTimeout(long timeout) {
    this.timeout = timeout;
  }

  public void cancel() {
    this.cancelled = true;
    this.cleanup();
  }

  public void resetTimeout(long timeout) {
    if (timeout > 0) {
      this.setTimeout(timeout);
    }
    if (this.watchDogTimer != null) {
      this.cancelWatchDogTimer();
      this.ensureWatchDogTimer();
    }
  }

  public boolean isClosed() {
    return false;
  }

  public int getLastStatusCode() {
    return this.lastStatusCode;
  }

  public boolean getSuccess() {
    return this.successful;
  }

  public @Nullable ChannelError getLastError() {
    return this.lastError;
  }

  public String getSessionId() {
    return this.sid;
  }

  public String getRequestId() {
    return this.rid;
  }

  public @Nullable HttpRequest getHttpRequest() {
    return this.httpRequest;
  }

  public @Nullable String getPostData() {
    return postData;
  }

  public long getRequestStartTime() {
    return this.requestStartTime;
  }

  public StringBuilder getResponseText() {
    return this.responseText;
  }

  public static String errorStringFromCode(@Nullable ChannelError errorCode, int statusCode) {
    if (errorCode == null) {
      throw new IllegalStateException("errorCode is null");
    }
    switch (errorCode) {
      case STATUS:
        return "Non-200 return code (" + statusCode + ")";
      case NO_DATA:
        return "HTTP failure (no data)";
      case TIMEOUT:
        return "HttpConnection timeout";
      default:
        return "Unknown error";
    }
  }

  private static final String INVALID_CHUNK = new String();

  private static final String INCOMPLETE_CHUNK_ = new String();

  public void setPendingMessages(List<Wire.QueuedMap> messages) {
    this.pendingMessages = messages;
  }

  public List<Wire.QueuedMap> getPendingMessages() {
    return this.pendingMessages;
  }

  public void httpPost(Uri uri, @Nullable String postData, boolean decodeChunks) {
    this.type = Type.HTTP_REQUEST;
    this.baseUri = uri;
    this.postData = postData;
    this.decodeChunks = decodeChunks;

    sendHttp();
  }

  public void httpGet(Uri uri, boolean decodeChunks) {
    this.type = Type.HTTP_REQUEST;
    this.baseUri = uri;
    this.postData = null;
    this.decodeChunks = decodeChunks;

    sendHttp();
  }

  private void sendHttp() {
    this.requestStartTime = System.currentTimeMillis();
    ensureWatchDogTimer();

    Uri localBaseUri = this.baseUri;
    if (localBaseUri == null) {
      throw new IllegalStateException("baseUri is null");
    }

    this.requestUri =
        support.newUriBuilder(localBaseUri).addQueryParameter("t", Long.toString(this.retryId));
    Support.UriBuilder localRequestUri = this.requestUri;
    if (localRequestUri == null) {
      throw new IllegalStateException("requestUri is null");
    }

    this.chunkStart = 0;

    this.httpRequest = this.channel.createHttpRequest();
    Support.HttpRequest localHttpRequest = this.httpRequest;
    if (localHttpRequest == null) {
      throw new IllegalStateException("httpRequest is null");
    }

    localHttpRequest.setReadyStateChangeHandler(this);

    Map<String, String> headers = new HashMap<>();
    if (this.extraHeaders != null) {
      headers.putAll(this.extraHeaders);
    }

    String localVerb = this.verb;
    if (this.postData != null) {
      if (localVerb == null) {
        localVerb = "POST";
      }
      headers.put("Content-Type", "application/x-www-form-urlencoded");
      localHttpRequest.send(localRequestUri, localVerb, this.postData, headers);
    } else {
      localVerb = "GET";
      localHttpRequest.send(localRequestUri, localVerb, null, headers);
    }
    this.verb = localVerb;

    support.notifyServerReachabilityEvent(Support.ServerReachability.REQUEST_MADE);
    channelDebug.httpRequest(localVerb, localRequestUri, this.rid, this.retryId, this.postData);
  }

  @Override
  public void onReadyStateChangeEvent(HttpRequest request) {
    support.onStartExecution();

    try {
      if (request == this.httpRequest) {
        this.httpRequest.drainResponseText(this.responseText);
        this.onReadyStateChanged();
      } else {
        channelDebug.warning("Called back with an unexpected http request");
      }
    } catch (Exception ex) {
      channelDebug.debug("Failed call to onReadyStateChangeEvent.");
      if (this.responseText.length() > 0) {
        if (channelDebug.isEnabled()) {
          channelDebug.dumpException(ex, "ResponseText: " + this.responseText);
        }
      } else {
        channelDebug.dumpException(ex, "No response text");
      }
    } finally {
      support.onEndExecution();
    }
  }

  private void onReadyStateChanged() {
    Support.HttpRequest localHttpRequest = this.httpRequest;
    if (localHttpRequest == null) {
      throw new IllegalStateException("httpRequest is null");
    }

    RequestReadyState readyState = localHttpRequest.getReadyState();
    RequestErrorCode errorCode = localHttpRequest.getLastErrorCode();
    int statusCode = localHttpRequest.getStatus();

    if (readyState != RequestReadyState.COMPLETE
        && (readyState == RequestReadyState.INTERACTIVE
            && this.responseText.length() == 0)) {
      return;
    }

    if (!this.cancelled
        && readyState == RequestReadyState.COMPLETE
        && errorCode != RequestErrorCode.ABORT) {
      if (errorCode == RequestErrorCode.TIMEOUT || statusCode <= 0) {
        support.notifyServerReachabilityEvent(ServerReachability.REQUEST_FAILED);
      } else {
        support.notifyServerReachabilityEvent(ServerReachability.REQUEST_SUCCEEDED);
      }
    }

    cancelWatchDogTimer();

    int status = localHttpRequest.getStatus();
    this.lastStatusCode = status;
    if (responseText.length() == 0) {
      if (channelDebug.isEnabled()) {
        channelDebug.debug(
            "No response text for uri " + this.requestUri + " status " + status);
      }
    }
    this.successful = (status == 200);

    channelDebug.httpChannelResponseMetaData(
        this.verb, this.requestUri, this.rid, this.retryId, readyState, status);

    if (!this.successful) {
      if (status == 400 && responseText.indexOf("Unknown SID") > 0) {
        this.lastError = ChannelError.UNKNOWN_SESSION_ID;
        support.notifyStatEvent(RequestStat.REQUEST_UNKNOWN_SESSION_ID);
        channelDebug.warning("XMLHTTP Unknown SID (" + this.rid + ")");
      } else {
        this.lastError = ChannelError.STATUS;
        support.notifyStatEvent(RequestStat.REQUEST_BAD_STATUS);
        channelDebug.warning("XMLHTTP Bad status " + status + " (" + this.rid + ")");
      }
      this.cleanup();
      this.dispatchFailure();
      return;
    }

    if (this.shouldCheckInitialResponse()) {
      StringBuilder initialResponse = this.getInitialResponse();
      if (initialResponse != null) {
        channelDebug.httpChannelResponseText(
            this.rid, initialResponse,
            "Initial handshake response via "
                + WebChannelConstants.X_HTTP_INITIAL_RESPONSE);
        this.initialResponseDecoded = true;
        this.safeOnRequestData(initialResponse);
      } else {
        this.successful = false;
        this.lastError = ChannelError.UNKNOWN_SESSION_ID;
        support.notifyStatEvent(RequestStat.REQUEST_UNKNOWN_SESSION_ID);
        channelDebug.severe("XMLHTTP Missing X_HTTP_INITIAL_RESPONSE (" + this.rid + ")");
        this.cleanup();
        this.dispatchFailure();
        return;
      }
    }

    if (this.decodeChunks) {
      this.decodeNextChunks(readyState, responseText);
    } else {
      channelDebug.httpChannelResponseText(this.rid, responseText, null);
      this.safeOnRequestData(responseText);
    }

    if (readyState == RequestReadyState.COMPLETE) {
      this.cleanup();
    }

    if (!this.successful) {
      return;
    }

    if (!this.cancelled) {
      if (readyState == RequestReadyState.COMPLETE) {
        this.channel.onRequestComplete(this);
      } else {
        this.successful = false;
        this.ensureWatchDogTimer();
      }
    }
  }

  private boolean shouldCheckInitialResponse() {
    return this.decodeInitialResponse && !this.initialResponseDecoded;
  }

  private @Nullable StringBuilder getInitialResponse() {
    Support.HttpRequest localHttpRequest = this.httpRequest;
    if (localHttpRequest != null) {
      String value =
          localHttpRequest.getResponseHeader(WebChannelConstants.X_HTTP_INITIAL_RESPONSE);
      if (value != null && !value.isEmpty()) {
        return new StringBuilder(value);
      } else {
        // Java only
        channelDebug.severe("Error debugging: Error fetching X_HTTP_INITIAL_RESPONSE header.");
        channelDebug.severe("Error debugging: HTTP request URI: " + this.requestUri);
        channelDebug.severe(
            "Error debugging: HTTP response headers: "
                + localHttpRequest.getAllResponseHeadersForDebugging());
      }
    }

    return null;
  }

  public boolean isInitialResponseDecoded() {
    return this.initialResponseDecoded;
  }

  public void setDecodeInitialResponse() {
    this.decodeInitialResponse = true;
  }

  @SuppressWarnings("ReferenceEquality")
  private void decodeNextChunks(RequestReadyState readyState, StringBuilder responseText) {
    boolean decodeNextChunksSuccessful = true;
    while (!this.cancelled && this.chunkStart < responseText.length()) {
      String chunkText = this.getNextChunk(responseText);
      if (chunkText == ChannelRequest.INCOMPLETE_CHUNK_) {
        if (readyState == RequestReadyState.COMPLETE) {
          this.lastError = ChannelError.BAD_DATA;
          support.notifyStatEvent(RequestStat.REQUEST_INCOMPLETE_DATA);
          decodeNextChunksSuccessful = false;
        }
        channelDebug.httpChannelResponseText(this.rid, null, "[Incomplete Response]");
        break;
      } else if (chunkText == ChannelRequest.INVALID_CHUNK) {
        this.lastError = ChannelError.BAD_DATA;
        support.notifyStatEvent(RequestStat.REQUEST_BAD_DATA);
        channelDebug.httpChannelResponseText(this.rid, responseText, "[Invalid Chunk]");
        decodeNextChunksSuccessful = false;
        break;
      } else {
        StringBuilder chunkTextBuffer = new StringBuilder(chunkText);
        channelDebug.httpChannelResponseText(this.rid, chunkTextBuffer, null);
        this.safeOnRequestData(chunkTextBuffer);
      }
    }
    if (readyState == RequestReadyState.COMPLETE && responseText.length() == 0) {
      this.lastError = ChannelError.NO_DATA;
      support.notifyStatEvent(RequestStat.REQUEST_NO_DATA);
      decodeNextChunksSuccessful = false;
    }
    this.successful = this.successful && decodeNextChunksSuccessful;
    if (!decodeNextChunksSuccessful) {
      channelDebug.httpChannelResponseText(
          this.rid, responseText, "[Invalid Chunked Response]");
      this.cleanup();
      this.dispatchFailure();
    } else {
      if (responseText.length() > 0 && !this.firstByteReceived) {
        this.firstByteReceived = true;
        this.channel.onFirstByteReceived(this, responseText);
      }
    }
  }

  private String getNextChunk(StringBuilder responseText) {
    int sizeStartIndex = this.chunkStart;
    int sizeEndIndex = responseText.indexOf("\n", sizeStartIndex);
    if (sizeEndIndex == -1) {
      return INCOMPLETE_CHUNK_;
    }

    String sizeAsString = responseText.substring(sizeStartIndex, sizeEndIndex);
    int size;
    try {
      size = Integer.parseInt(sizeAsString);
    } catch (Exception ex) {
      // Log invalid chunk parsing failures for debugging.
      channelDebug.severe(
          "INVALID_CHUNK: responseText: "
              + responseText
              + "%s, index: "
              + sizeStartIndex
              + "-"
              + sizeEndIndex
              + " Exception: "
              + ex.getMessage());
      return INVALID_CHUNK;
    }

    int chunkStartIndex = sizeEndIndex + 1;
    if (chunkStartIndex + size > responseText.length()) {
      return INCOMPLETE_CHUNK_;
    }

    // TODO(wenboz): Do not buffer the response body when it's no longer necessary.
    String chunkText = responseText.substring(chunkStartIndex, chunkStartIndex + size);
    this.chunkStart = chunkStartIndex + size;
    return chunkText;
  }

  private void safeOnRequestData(StringBuilder data) {
    try {
      this.channel.onRequestData(this, data.toString());
      support.notifyServerReachabilityEvent(ServerReachability.BACK_CHANNEL_ACTIVITY);
    } catch (Exception ex) {
      channelDebug.dumpException(ex, "Error in httprequest callback");
    }
  }

  private void dispatchFailure() {
    if (this.channel.isClosed() || this.cancelled) {
      return;
    }

    this.channel.onRequestComplete(this);
  }

  private void cleanup() {
    cancelWatchDogTimer();

    if (this.httpRequest != null) {
      this.httpRequest.setReadyStateChangeHandler(null);

      HttpRequest request = this.httpRequest;
      this.httpRequest = null;
      request.abort();
    }
  }

  private void ensureWatchDogTimer() {
    this.watchDogTimeoutTime = System.currentTimeMillis() + this.timeout;

    if (this.watchDogTimer != null) {
      throw new IllegalStateException("WatchDog timer not null");
    }

    this.watchDogTimer = support.setTimeout(this, this.timeout);
  }

  private void cancelWatchDogTimer() {
    if (this.watchDogTimer != null) {
      support.clearTimeout(this.watchDogTimer);
      this.watchDogTimer = null;
    }
  }

  public void sendCloseRequest(UriBuilder uri) {
    this.type = Type.CLOSE_REQUEST;
    this.baseUri = uri.getUri();
    this.requestUri = uri;
    this.verb = "GET";

    this.httpRequest = this.channel.createHttpRequest();

    Support.UriBuilder localRequestUri = this.requestUri;
    String localVerb = this.verb;
    if (localRequestUri == null || localVerb == null) {
      throw new IllegalStateException("requestUri or verb is null");
    }
    this.httpRequest.send(localRequestUri, localVerb, null, null);

    this.requestStartTime = System.currentTimeMillis();
    this.ensureWatchDogTimer();
  }

  @Override
  public void onTimeout() {
    this.watchDogTimer = null;
    long now = System.currentTimeMillis();
    if (now - this.watchDogTimeoutTime >= 0) {
      this.handleTimeout();
    } else {
      channelDebug.warning("WatchDog timer called too early");
      this.startWatchDogTimer(this.watchDogTimeoutTime - now);
    }
  }

  private void startWatchDogTimer(long timeMs) {
    if (this.watchDogTimer != null) {
      throw new IllegalStateException("WatchDog timer not null");
    }
    this.watchDogTimer = support.setTimeout(this, timeMs);
  }

  private void handleTimeout() {
    if (this.successful) {
      this.channelDebug.severe("Received watchdog timeout even though request loaded successfully");
    }

    Support.UriBuilder localRequestUri = this.requestUri;
    channelDebug.warning("TIMEOUT: " + localRequestUri);

    if (this.type != ChannelRequest.Type.CLOSE_REQUEST) {
      support.notifyServerReachabilityEvent(ServerReachability.REQUEST_FAILED);
      support.notifyStatEvent(RequestStat.REQUEST_TIMEOUT);
    }

    this.cleanup();

    this.lastError = ChannelError.TIMEOUT;
    this.dispatchFailure();
  }
}
