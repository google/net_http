package com.google.net.webchannel.client.xplat;

import com.google.net.webchannel.client.InternalChannelParams;
import com.google.net.webchannel.client.WebChannelConstants;
import com.google.net.webchannel.client.WebChannelOptions;
import com.google.net.webchannel.client.WebChannelRuntimeProperties.AckCommitCallback;
import com.google.net.webchannel.client.xplat.Support.Debugger;
import com.google.net.webchannel.client.xplat.Support.FailureRecoveryContext;
import com.google.net.webchannel.client.xplat.Support.HttpRequest;
import com.google.net.webchannel.client.xplat.Support.RequestChannelType;
import com.google.net.webchannel.client.xplat.Support.RequestStat;
import com.google.net.webchannel.client.xplat.Support.TimeoutHandler;
import com.google.net.webchannel.client.xplat.Support.UriBuilder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.checkerframework.checker.initialization.qual.Initialized;
import org.jspecify.annotations.Nullable;

class WebChannelBase implements Channel, NetUtils.TestNetworkCallback {
  // no sub-domains
  // no streaming throttling
  // no batch delivery
  // no port-override or relative data path
  // no logsaver

  private final Support support;

  private int clientVersion;
  private int serverVersion;

  private List<Wire.QueuedMap> outgoingMaps;
  private Debugger channelDebug;
  private ConnectionState connState;
  private @Nullable Map<String, String> extraHeaders;
  private @Nullable Map<String, String> initHeaders;
  private @Nullable Map<String, String> extraParams;
  private @Nullable String httpSessionIdParam;
  private @Nullable String httpSessionId;
  private @Nullable ChannelRequest backChannelRequest;
  private @Nullable String path;
  private @Nullable UriBuilder forwardChannelUri;
  private @Nullable UriBuilder backChannelUri;
  private @Nullable UriBuilder networkTestUri;
  private long nextRid;
  private long nextMapId;
  private boolean failFast;
  private @Nullable Handler handler;
  private @Nullable Object forwardChannelTimer;
  private @Nullable Object backChannelTimer;
  private @Nullable Object deadBackChannelTimer;
  private boolean enableStreaming;
  private boolean allowStreamingMode;
  private boolean detectBufferingProxy;

  private @Nullable AckCommitCallback forwardChannelFlushedCallback;

  private long handshakeRttMs;
  private boolean bpDetectionDone;
  private @Nullable Object bpDetectionTimer;

  private long lastArrayId;
  private long lastPostResponseArrayId;
  private int lastStatusCode;
  private int forwardChannelRetryCount;
  private int backChannelRetryCount;
  private long backChannelAttemptId;
  private long baseRetryDelayMs;
  private long retryDelaySeedMs;
  private int forwardChannelMaxRetries;
  private long forwardChannelRequestTimeoutMs;
  private long backChannelRequestTimeoutMs;
  private String sid;
  private ForwardChannelRequestPool forwardChannelRequestPool;
  private WireV8 wireCodec;
  private @Nullable ArrayList<Wire.QueuedMap> nonAckedMapsAtChannelClose;
  private NetUtils netUtils;
  private boolean fastHandshake;
  private boolean blockingHandshake;
  private boolean encodeInitMessageHeaders;

  private int channelVersion;
  private State state;

  public WebChannelBase(
      Support support,
      WebChannelOptions options,
      int clientVersion,
      @Nullable ConnectionState conn) {
    final InternalChannelParams internalChannelParams = options.getInternalChannelParams();
    this.support = support;
    this.clientVersion = clientVersion;
    this.serverVersion = 0;
    this.outgoingMaps = new ArrayList<>();
    this.channelDebug = support.getDebugger();
    this.connState = conn == null ? new ConnectionState() : conn;
    this.extraHeaders = null;
    this.initHeaders = null;
    this.extraParams = null;
    this.httpSessionIdParam = null;
    this.httpSessionId = null;
    this.backChannelRequest = null;
    this.path = null;
    this.forwardChannelUri = null;
    this.backChannelUri = null;
    this.nextRid = 0;
    this.nextMapId = 0;
    this.failFast = internalChannelParams.getFailFast();
    this.handler = null;
    this.forwardChannelTimer = null;
    this.backChannelTimer = null;
    this.deadBackChannelTimer = null;
    this.enableStreaming = true; // default changed
    this.allowStreamingMode = true;
    this.forwardChannelFlushedCallback = null;
    this.lastArrayId = -1;
    this.lastPostResponseArrayId = -1;
    this.lastStatusCode = -1;
    this.forwardChannelRetryCount = 0;
    this.backChannelRetryCount = 0;
    this.backChannelAttemptId = 0;
    this.baseRetryDelayMs = internalChannelParams.getBaseRetryDelayMs();
    this.retryDelaySeedMs = internalChannelParams.getRetryDelaySeedMs();
    this.forwardChannelMaxRetries = internalChannelParams.getForwardChannelMaxRetries();
    this.forwardChannelRequestTimeoutMs = internalChannelParams.getForwardChannelRequestTimeoutMs();
    this.backChannelRequestTimeoutMs = 0;
    this.sid = "";
    this.forwardChannelRequestPool =
        new ForwardChannelRequestPool(options.getConcurrentRequestLimit());
    this.wireCodec = new WireV8(this.support);
    this.nonAckedMapsAtChannelClose = null;
    String networkTestUrl = options.getNetworkTestUrl();
    this.networkTestUri = networkTestUrl != null ? support.newUriBuilder(networkTestUrl) : null;

    this.fastHandshake = options.getFastHandshake();

    this.encodeInitMessageHeaders = options.getEncodeInitMessageHeaders();
    if (this.fastHandshake && this.encodeInitMessageHeaders) {
      this.channelDebug.warning("Ignore encodeInitMessageHeaders because fastHandshake is set.");
      this.encodeInitMessageHeaders = false;
    }

    this.blockingHandshake = options.getBlockingHandshake();

    if (options.getDisableRedact()) {
      this.channelDebug.disableRedact();
    }

    if (options.getForceLongPolling()) {
      this.allowStreamingMode = false;
    }

    if (!this.fastHandshake && this.allowStreamingMode && options.getDetectBufferingProxy()) {
      this.detectBufferingProxy = true;
    }

    this.handshakeRttMs = 0;
    this.bpDetectionDone = false;
    this.bpDetectionTimer = null;

    this.channelVersion = Wire.LATEST_CHANNEL_VERSION;
    this.state = State.INIT;

    @SuppressWarnings("nullness:assignment")
    @Initialized
    WebChannelBase initializedThis = this;
    this.netUtils = new NetUtils(initializedThis, support);
  }

  public enum State {
    CLOSED,
    INIT,
    OPENING,
    OPENED
  }

  public enum ErrorEnum {
    OK,
    REQUEST_FAILED,
    LOGGED_OUT,
    NO_DATA,
    UNKNOWN_SESSION_ID,
    STOP,
    NETWORK,
    BAD_DATA,
    BAD_RESPONSE
  }

  public enum ChannelType {
    FORWARD_CHANNEL,
    BACK_CHANNEL
  }

  public static final long FORWARD_CHANNEL_RETRY_TIMEOUT = 20 * 1000;

  public static final int BACK_CHANNEL_MAX_RETRIES = 3;

  public static final long RTT_ESTIMATE = 3 * 1000;

  public static final int INACTIVE_CHANNEL_RETRY_FACTOR = 2;

  private static final int MAX_MAPS_PER_REQUEST = 1000;

  private static final int MAX_CHARS_PER_GET = 4 * 1024;

  public static final long OUTSTANDING_DATA_BACKCHANNEL_RETRY_CUTOFF = 37500;

  public int getServerVersion() {
    return this.serverVersion;
  }

  public ForwardChannelRequestPool getForwardChannelRequestPool() {
    return this.forwardChannelRequestPool;
  }

  @Override
  public Object getWireCodec() {
    return wireCodec;
  }

  public Debugger getChannelDebug() {
    return this.channelDebug;
  }

  public void setChannelDebug(Debugger channelDebug) {
    this.channelDebug = channelDebug;
  }

  public String getSessionId() {
    return this.sid;
  }

  @Nullable
  public Map<String, String> getExtraHeaders() {
    return this.extraHeaders;
  }

  public void setExtraHeaders(@Nullable Map<String, String> extraHeaders) {
    this.extraHeaders = extraHeaders;
  }

  @Nullable
  public Map<String, String> getInitHeaders() {
    return this.initHeaders;
  }

  public void setInitHeaders(@Nullable Map<String, String> initHeaders) {
    this.initHeaders = initHeaders;
  }

  @Override
  public void setHttpSessionIdParam(String httpSessionIdParam) {
    this.httpSessionIdParam = httpSessionIdParam;
  }

  @Override
  public @Nullable String getHttpSessionIdParam() {
    return this.httpSessionIdParam;
  }

  @Override
  public void setHttpSessionId(String httpSessionId) {
    this.httpSessionId = httpSessionId;
  }

  @Override
  public @Nullable String getHttpSessionId() {
    return this.httpSessionId;
  }

  public @Nullable Handler getHandler() {
    return this.handler;
  }

  public void setHandler(Handler handler) {
    this.handler = handler;
  }

  public boolean isBuffered() {
    return !this.enableStreaming;
  }

  public boolean getAllowChunkedMode() {
    return this.allowStreamingMode;
  }

  public void setAllowChunkedMode(boolean allowChunkedMode) {
    this.allowStreamingMode = allowChunkedMode;
  }

  public int getForwardChannelMaxRetries() {
    return this.failFast ? 0 : this.forwardChannelMaxRetries;
  }

  public void setForwardChannelMaxRetries(int retries) {
    this.forwardChannelMaxRetries = retries;
  }

  public void setForwardChannelRequestTimeout(long timeoutMs) {
    this.forwardChannelRequestTimeoutMs = timeoutMs;
  }

  public int getBackChannelMaxRetries() {
    return BACK_CHANNEL_MAX_RETRIES;
  }

  @Override
  public boolean isClosed() {
    return this.state == State.CLOSED;
  }

  public State getState() {
    return this.state;
  }

  public int getLastStatusCode() {
    return this.lastStatusCode;
  }

  public long getLastArrayId() {
    return this.lastArrayId;
  }

  public boolean hasOutstandingRequests() {
    return this.getOutstandingRequests() != 0;
  }

  public int getOutstandingRequests() {
    int count = 0;
    if (this.backChannelRequest != null) {
      count++;
    }
    count += this.forwardChannelRequestPool.getRequestCount();
    return count;
  }

  public void connect(
      String channelPath,
      @Nullable Map<String, String> extraParams,
      @Nullable String oldSessionId,
      @Nullable String oldArrayId) {
    channelDebug.debug("connect()");

    support.notifyStatEvent(RequestStat.CONNECT_ATTEMPT);

    this.path = channelPath;
    this.extraParams = extraParams != null ? extraParams : new HashMap<String, String>();

    if (oldSessionId != null && oldArrayId != null) {
      this.extraParams.put("OSID", oldSessionId);
      this.extraParams.put("OAID", oldArrayId);
    }

    this.enableStreaming = this.allowStreamingMode;
    this.connectChannel(channelPath);
  }

  public void disconnect() {
    channelDebug.debug("disconnect()");

    this.cancelRequests();

    if (this.state == State.OPENED) {
      long rid = this.nextRid++;
      if (this.forwardChannelUri == null) {
        throw new IllegalStateException("Forward channel URI is null");
      }
      UriBuilder uri = this.forwardChannelUri.clone();
      uri.addQueryParameter("SID", this.sid);
      uri.addQueryParameter("RID", Long.toString(rid));
      uri.addQueryParameter("TYPE", "terminate");

      this.addAdditionalParams(uri);

      ChannelRequest request =
          ChannelRequest.createChannelRequest(support, this, this.sid, Long.toString(rid));
      request.sendCloseRequest(uri);
    }

    this.onClose();
  }

  private void addAdditionalParams(UriBuilder uri) {
    Map<String, String> localExtraParams = this.extraParams;
    if (localExtraParams != null) {
      for (String key : localExtraParams.keySet()) {
        uri.addQueryParameter(key, localExtraParams.get(key));
      }
    }

    if (this.handler != null) {
      Map<String, String> params = this.handler.getAdditionalParams(this);
      if (params != null) {
        for (String key : params.keySet()) {
          uri.addQueryParameter(key, params.get(key));
        }
      }
    }
  }

  private boolean okToMakeRequest() {
    if (this.handler != null) {
      ErrorEnum result = this.handler.okToMakeRequest(this);
      if (result != WebChannelBase.ErrorEnum.OK) {
        channelDebug.debug("Handler returned error code from okToMakeRequest");
        this.signalError(result);
        return false;
      }
    }
    return true;
  }

  private void signalError(ErrorEnum error) {
    channelDebug.info("Error code " + error);
    if (error == WebChannelBase.ErrorEnum.REQUEST_FAILED) {
      // Create a separate Internet connection to check
      // if it's a server error or user's network error.
      this.netUtils.testNetwork(getNetworkTestUri());
    } else {
      support.notifyStatEvent(RequestStat.ERROR_OTHER);
    }
    this.onError(error);
  }

  @Override
  public void onTestNetworkResult(boolean networkUp) {
    if (networkUp) {
      channelDebug.info("Successfully pinged google.com");
      support.notifyStatEvent(RequestStat.ERROR_OTHER);
    } else {
      channelDebug.info("Failed to ping google.com");
      support.notifyStatEvent(RequestStat.ERROR_NETWORK);
    }
  }

  private void onSuccess(ChannelRequest request) {
    if (this.handler != null) {
      this.handler.channelSuccess(this, request);
    }
  }

  private void onError(ErrorEnum error) {
    channelDebug.debug("HttpChannel: error - " + error);
    this.state = State.CLOSED;
    if (this.handler != null) {
      this.handler.channelError(this, error);
    }
    this.onClose();
    this.cancelRequests();
  }

  private void onClose() {
    this.state = WebChannelBase.State.CLOSED;
    ArrayList<Wire.QueuedMap> newNonAckedMapsAtChannelClose = new ArrayList<>();
    Handler localHandler = this.handler;
    if (localHandler != null) {
      List<Wire.QueuedMap> pendingMessages = this.forwardChannelRequestPool.getPendingMessages();
      if (pendingMessages.isEmpty() && this.outgoingMaps.isEmpty()) {
        localHandler.channelClosed(this, null, null);
      } else {
        if (channelDebug.isEnabled()) {
          channelDebug.debug(
              "Number of undelivered maps"
                  + ", pending: "
                  + pendingMessages.size()
                  + ", outgoing: "
                  + this.outgoingMaps.size());
        }

        newNonAckedMapsAtChannelClose.addAll(pendingMessages);
        newNonAckedMapsAtChannelClose.addAll(this.outgoingMaps);

        this.forwardChannelRequestPool.clearPendingMessages();

        List<Wire.QueuedMap> copyOfUndeliveredMaps = new ArrayList<>(outgoingMaps);
        this.outgoingMaps.clear();

        localHandler.channelClosed(this, pendingMessages, copyOfUndeliveredMaps);
      }
    }
    this.nonAckedMapsAtChannelClose = newNonAckedMapsAtChannelClose;
  }

  private void cancelBackChannelRequest() {
    ChannelRequest localBackChannelRequest = this.backChannelRequest;
    if (localBackChannelRequest != null) {
      this.clearBpDetectionTimer();
      localBackChannelRequest.cancel();
      this.backChannelRequest = null;
    }
  }

  private void cancelRequests() {
    this.cancelBackChannelRequest();

    if (this.backChannelTimer != null) {
      support.clearTimeout(this.backChannelTimer);
      this.backChannelTimer = null;
    }

    this.clearDeadBackchannelTimer();

    this.forwardChannelRequestPool.cancel();

    if (this.forwardChannelTimer != null) {
      support.clearTimeout(this.forwardChannelTimer);
      this.forwardChannelTimer = null;
    }
  }

  private void clearDeadBackchannelTimer() {
    if (deadBackChannelTimer != null) {
      support.clearTimeout(this.deadBackChannelTimer);
      this.deadBackChannelTimer = null;
    }
  }

  private void connectChannel(String channelPath) {
    channelDebug.debug("connectChannel(path:) for path: " + channelPath);
    this.ensureInState(State.INIT, State.CLOSED);
    this.forwardChannelUri = this.getForwardChannelUri(channelPath);
    this.ensureForwardChannel();
  }

  private void ensureInState(State... states) {
    for (State state : states) {
      if (this.state == state) {
        return;
      }
    }
    channelDebug.assertCondition(false, "Unexpected channel state: " + this.state);
  }

  private void ensureForwardChannel() {
    if (this.forwardChannelRequestPool.isFull()) {
      return;
    }

    if (this.forwardChannelTimer != null) {
      return;
    }

    this.forwardChannelTimer =
        support.setTimeout(
            new TimeoutHandler() {
              @Override
              public void onTimeout() {
                WebChannelBase.this.onStartForwardChannelTimer(null);
              }
            },
            0);
    this.forwardChannelRetryCount = 0;
  }

  private void onStartForwardChannelTimer(@Nullable ChannelRequest retryRequest) {
    this.forwardChannelTimer = null;
    this.startForwardChannel(retryRequest);
  }

  private void startForwardChannel(@Nullable ChannelRequest retryRequest) {
    channelDebug.debug("startForwardChannel");
    if (!this.okToMakeRequest()) {
      return; // channel is cancelled
    } else if (this.state == State.INIT) {
      if (retryRequest != null) {
        channelDebug.severe("Not supposed to retry the open");
        return;
      }
      this.open();
      this.state = State.OPENING;
    } else if (this.state == State.OPENED) {
      if (retryRequest != null) {
        this.makeForwardChannelRequest(retryRequest);
        return;
      }

      if (this.outgoingMaps.isEmpty()) {
        channelDebug.debug("startForwardChannel_ returned: " + "nothing to send");
        return;
      }

      if (this.forwardChannelRequestPool.isFull()) {
        channelDebug.severe("startForwardChannel_ returned: " + "connection already in progress");
        return;
      }

      this.makeForwardChannelRequest(null);
      channelDebug.debug("startForwardChannel_ finished, sent request");
    }
  }

  public void makeForwardChannelRequest(@Nullable ChannelRequest retryRequest) {
    String rid;
    if (retryRequest != null) {
      rid = retryRequest.getRequestId();
    } else {
      rid = Long.toString(this.nextRid++);
    }

    if (this.forwardChannelUri == null) {
      throw new IllegalStateException("Forward channel URI is null");
    }
    UriBuilder uri = this.forwardChannelUri.clone();
    uri.addQueryParameter("SID", this.sid);
    uri.addQueryParameter("RID", rid);
    uri.addQueryParameter("AID", Long.toString(this.lastArrayId));

    this.addAdditionalParams(uri);

    ChannelRequest request =
        ChannelRequest.createChannelRequest(
            support, this, this.sid, rid, this.forwardChannelRetryCount + 1);
    request.setExtraHeaders(this.extraHeaders);

    String requestText;
    if (retryRequest != null) {
      requeuePendingMaps(retryRequest);
    }
    requestText = dequeueOutgoingMaps(request, MAX_MAPS_PER_REQUEST);

    request.setTimeout(
        Math.round(this.forwardChannelRequestTimeoutMs * 0.50)
            + Math.round(this.forwardChannelRequestTimeoutMs * 0.50 * Math.random()));
    this.forwardChannelRequestPool.addRequest(request);
    request.httpPost(uri.getUri(), requestText, true);
  }

  private void open() {
    this.channelDebug.debug("open_()");
    this.nextRid = (long) Math.floor(Math.random() * 100000); // FIXME

    long rid = this.nextRid++;
    ChannelRequest request =
        ChannelRequest.createChannelRequest(support, this, "", Long.toString(rid));

    // mix the init headers
    Map<String, String> extraHeaders = this.extraHeaders;
    if (this.initHeaders != null && !this.initHeaders.isEmpty()) {
      if (extraHeaders != null && !extraHeaders.isEmpty()) {
        extraHeaders = new HashMap<>(extraHeaders);
        extraHeaders.putAll(this.initHeaders);
      } else {
        extraHeaders = this.initHeaders;
      }
    }

    if (!this.encodeInitMessageHeaders) {
      request.setExtraHeaders(extraHeaders);
    }

    String requestText =
        this.dequeueOutgoingMaps(
            request, fastHandshake ? getMaxNumMessagesForFastHandshake() : MAX_MAPS_PER_REQUEST);

    if (this.forwardChannelUri == null) {
      throw new IllegalStateException("Forward channel URI is null");
    }
    UriBuilder uri = this.forwardChannelUri.clone();
    uri.addQueryParameter("RID", Long.toString(rid));
    if (this.clientVersion > 0) {
      uri.addQueryParameter("CVER", Integer.toString(this.clientVersion));
    }

    String localHttpSessionIdParam = this.getHttpSessionIdParam();
    if (localHttpSessionIdParam != null) {
      uri.addQueryParameter(WebChannelConstants.X_HTTP_SESSION_ID, localHttpSessionIdParam);
    }

    this.addAdditionalParams(uri);

    if (extraHeaders != null && !extraHeaders.isEmpty() && this.encodeInitMessageHeaders) {
      StringBuilder encodedHeaders = new StringBuilder();
      for (Map.Entry<String, String> header : extraHeaders.entrySet()) {
        encodedHeaders.append(header.getKey());
        encodedHeaders.append(":");
        encodedHeaders.append(header.getValue());
        encodedHeaders.append("\r\n");
      }
      requestText = "headers=" + encodedHeaders + '&' + requestText;
    }

    this.forwardChannelRequestPool.addRequest(request);

    if (this.blockingHandshake) {
      uri.addQueryParameter("TYPE", "init");
    }

    if (this.fastHandshake) {
      uri.addQueryParameter("$req", requestText);

      uri.addQueryParameter("SID", "null");
      request.setDecodeInitialResponse();

      request.httpPost(uri.getUri(), null, true);
    } else {
      request.httpPost(uri.getUri(), requestText, true);
    }
  }

  private int getMaxNumMessagesForFastHandshake() {
    int total = 0;
    for (int i = 0; i < this.outgoingMaps.size(); i++) {
      Wire.QueuedMap map = this.outgoingMaps.get(i);
      int size = map.getRawDataSize();
      if (size <= 0) {
        break;
      }
      total += size;

      if (total > MAX_CHARS_PER_GET) {
        return i;
      }

      if (total == MAX_CHARS_PER_GET || i == this.outgoingMaps.size() - 1) {
        return i + 1;
      }
    }

    return MAX_MAPS_PER_REQUEST;
  }

  private void requeuePendingMaps(ChannelRequest retryRequest) {
    this.outgoingMaps.addAll(0, retryRequest.getPendingMessages());
  }

  private String dequeueOutgoingMaps(ChannelRequest request, int maxNum) {
    int count = Math.min(this.outgoingMaps.size(), maxNum);
    String result =
        this.wireCodec.encodeMessageQueue(
            this.outgoingMaps,
            count,
            new Wire.BadMessageHandler() {
              @Override
              public void onBadMessage(Object message) {
                if (WebChannelBase.this.handler != null) {
                  WebChannelBase.this.handler.badMapError(WebChannelBase.this, message);
                }
              }
            });

    request.setPendingMessages(new ArrayList<>(this.outgoingMaps.subList(0, count)));
    this.outgoingMaps.subList(0, count).clear();

    return result;
  }

  public void sendMap(Map<String, String> map, @Nullable Object context) {
    channelDebug.assertCondition(
        this.state != State.CLOSED, "Invalid operation: sending map when state is closed");

    if (this.outgoingMaps.size() == MAX_MAPS_PER_REQUEST && channelDebug.isEnabled()) {
      this.channelDebug.severe(
          "Already have "
              + MAX_MAPS_PER_REQUEST
              + " queued maps upon queueing "
              + map.toString()); // FIXME: string
    }

    this.outgoingMaps.add(new Wire.QueuedMap(this.nextMapId++, map, context));
    if (this.state == State.OPENED) {
      this.ensureForwardChannel();
    }
  }

  public void setFailFast(boolean failFast) {
    this.failFast = failFast;
    channelDebug.info("setFailFast: " + failFast);
    if ((this.forwardChannelRequestPool.hasPendingRequest() || this.forwardChannelTimer != null)
        && this.forwardChannelRetryCount > this.getForwardChannelMaxRetries()) {
      if (channelDebug.isEnabled()) {
        channelDebug.info(
            "Retry count "
                + this.forwardChannelRetryCount
                + " > new maxRetries "
                + this.getForwardChannelMaxRetries()
                + ". Fail immediately!");
      }

      if (!this.forwardChannelRequestPool.forceComplete(
          new ForwardChannelRequestPool.CompletionCallback() {
            @Override
            public void onComplete(ChannelRequest request) {
              WebChannelBase.this.onRequestComplete(request);
            }
          })) {
        if (this.forwardChannelTimer == null) {
          throw new IllegalStateException("Forward channel timer is null");
        } else {
          support.clearTimeout(this.forwardChannelTimer);
        }
        this.forwardChannelTimer = null;
        this.signalError(WebChannelBase.ErrorEnum.REQUEST_FAILED);
      }
    }
  }

  @Override
  public void onRequestComplete(ChannelRequest request) {
    channelDebug.debug("Request complete");
    ChannelType type;
    List<Wire.QueuedMap> pendingMessages = null;
    if (this.backChannelRequest == request) {
      this.clearDeadBackchannelTimer();
      this.clearBpDetectionTimer();
      this.backChannelRequest = null;
      type = ChannelType.BACK_CHANNEL;
    } else if (this.forwardChannelRequestPool.hasRequest(request)) {
      pendingMessages = request.getPendingMessages();
      this.forwardChannelRequestPool.removeRequest(request);
      type = ChannelType.FORWARD_CHANNEL;
    } else {
      return;
    }

    if (this.state == State.CLOSED) {
      return;
    }

    this.lastStatusCode = request.getLastStatusCode();

    if (request.getSuccess()) {
      if (type == ChannelType.FORWARD_CHANNEL) {
        String postData = request.getPostData();
        int size = postData != null ? postData.length() : 0;
        support.notifyTimingEvent(
            size,
            System.currentTimeMillis() - request.getRequestStartTime(),
            this.forwardChannelRetryCount);
        this.ensureForwardChannel();
        this.onSuccess(request);
      } else {
        this.ensureBackChannel();
      }
      return;
    }
    // Else unsuccessful. Fall through.

    ChannelError lastError = request.getLastError();
    if (!WebChannelBase.isFatalError(lastError, this.lastStatusCode)) {
      // Maybe retry.
      if (channelDebug.isEnabled()) {
        channelDebug.debug(
            "Maybe retrying, last error: "
                + ChannelRequest.errorStringFromCode(lastError, this.lastStatusCode));
      }
      if (type == ChannelType.FORWARD_CHANNEL) {
        if (this.maybeRetryForwardChannel(request)) {
          return;
        }
      }
      if (type == ChannelType.BACK_CHANNEL) {
        if (this.maybeRetryBackChannel(lastError)) {
          return;
        }
      }
      channelDebug.debug("Exceeded max number of retries");
    } else {
      channelDebug.debug("Not retrying due to error type");
    }

    if (pendingMessages != null && !pendingMessages.isEmpty()) {
      this.forwardChannelRequestPool.addPendingMessages(pendingMessages);
    }

    channelDebug.debug("Error: HTTP request failed");
    if (lastError == null) {
      throw new IllegalStateException("lastError is null");
    }
    switch (lastError) {
      case NO_DATA:
        this.signalError(WebChannelBase.ErrorEnum.NO_DATA);
        break;
      case BAD_DATA:
        this.signalError(WebChannelBase.ErrorEnum.BAD_DATA);
        break;
      case UNKNOWN_SESSION_ID:
        this.signalError(WebChannelBase.ErrorEnum.UNKNOWN_SESSION_ID);
        break;
      default:
        this.signalError(WebChannelBase.ErrorEnum.REQUEST_FAILED);
        break;
    }
  }

  private void ensureBackChannel() {
    if (this.backChannelRequest != null) {
      return;
    }

    if (this.backChannelTimer != null) {
      return;
    }

    this.backChannelAttemptId = 1;
    this.backChannelTimer =
        support.setTimeout(
            new TimeoutHandler() {
              @Override
              public void onTimeout() {
                WebChannelBase.this.onStartBackChannelTimer();
              }
            },
            0);
    this.backChannelRetryCount = 0;
  }

  private void onStartBackChannelTimer() {
    this.backChannelTimer = null;
    this.startBackChannel();

    if (!this.detectBufferingProxy) {
      return;
    }

    if (this.bpDetectionDone) {
      return;
    }

    if (this.backChannelRequest == null || this.handshakeRttMs <= 0) {
      this.channelDebug.warning(
          "Skip bpDetectionTimerId_ " + this.backChannelRequest + " " + this.handshakeRttMs);
      return;
    }

    long bpDetectionTimeout = 4 * this.handshakeRttMs;
    this.channelDebug.info("BP detection timer enabled: " + bpDetectionTimeout);

    this.bpDetectionTimer =
        support.setTimeout(
            new TimeoutHandler() {
              @Override
              public void onTimeout() {
                WebChannelBase.this.onBpDetectionTimer();
              }
            },
            bpDetectionTimeout);
  }

  private void onBpDetectionTimer() {
    if (this.bpDetectionTimer == null) {
      this.channelDebug.warning("Invalid operation.");
      return;
    }

    this.bpDetectionTimer = null;
    this.channelDebug.info("BP detection timeout reached.");

    ChannelRequest localBackChannelRequest = this.backChannelRequest;
    channelDebug.assertCondition(
        localBackChannelRequest != null, "Invalid state: no backchannel request");

    if (localBackChannelRequest != null && localBackChannelRequest.getHttpRequest() != null) {
      StringBuilder responseData = localBackChannelRequest.getResponseText();
      if (responseData.length() > 0) {
        this.channelDebug.warning("Timer should have been cancelled : " + responseData);
      }
    }

    this.channelDebug.info("Buffering proxy detected and switch to long-polling!");
    this.enableStreaming = false;

    this.bpDetectionDone = true;
    support.notifyStatEvent(RequestStat.PROXY);

    this.cancelBackChannelRequest();
    this.startBackChannel();
  }

  private void clearBpDetectionTimer() {
    Object localBpDetectionTimer = this.bpDetectionTimer;
    if (localBpDetectionTimer != null) {
      this.channelDebug.debug("Cancel the BP detection timer.");
      support.clearTimeout(localBpDetectionTimer);
      this.bpDetectionTimer = null;
    }
  }

  private void startBackChannel() {
    if (!this.okToMakeRequest()) {
      // channel is cancelled
      return;
    }

    channelDebug.debug("Creating new HttpRequest");
    this.backChannelRequest =
        ChannelRequest.createChannelRequest(
            support, this, this.sid, "rpc", this.backChannelAttemptId);
    ChannelRequest localBackChannelRequest = this.backChannelRequest;
    localBackChannelRequest.setExtraHeaders(this.extraHeaders);

    if (this.backChannelUri == null) {
      throw new IllegalStateException("backChannelUri is null");
    }
    UriBuilder uri = this.backChannelUri.clone();
    uri.addQueryParameter("RID", "rpc");
    uri.addQueryParameter("SID", this.sid);
    uri.addQueryParameter("CI", this.enableStreaming ? "0" : "1");
    uri.addQueryParameter("AID", Long.toString(this.lastArrayId));
    uri.addQueryParameter("TYPE", "xmlhttp");

    this.addAdditionalParams(uri);

    if (this.backChannelRequestTimeoutMs > 0) {
      localBackChannelRequest.setTimeout(this.backChannelRequestTimeoutMs);
    }
    localBackChannelRequest.httpGet(uri.getUri(), true);

    channelDebug.debug("New Request created");
  }

  private boolean maybeRetryForwardChannel(final ChannelRequest request) {
    if (this.forwardChannelRequestPool.getRequestCount()
        >= this.forwardChannelRequestPool.getMaxSize()
            - (this.forwardChannelTimer != null ? 1 : 0)) {
      this.channelDebug.severe("Unexpected retry request is scheduled.");
      return false;
    }

    if (this.forwardChannelTimer != null) {
      this.channelDebug.debug("Use the retry request that is already scheduled.");
      this.outgoingMaps.addAll(0, request.getPendingMessages());
      return true;
    }

    if (this.state == State.INIT
        || this.state == State.OPENING
        || (this.forwardChannelRetryCount >= this.getForwardChannelMaxRetries())) {
      return false;
    }

    channelDebug.debug("Going to retry POST");

    Support.FailureRecoveryContext context = new FailureRecoveryContext();
    context.setError(request.getLastError());
    context.setNumAttempts(this.forwardChannelRetryCount + 1);
    context.setRequestChannelType(RequestChannelType.FORWARD_CHANNEL);

    this.forwardChannelTimer =
        support.setTimeout(
            new TimeoutHandler() {
              @Override
              public void onTimeout() {
                WebChannelBase.this.onStartForwardChannelTimer(request);
              }
            },
            this.getRetryTime(this.forwardChannelRetryCount),
            context);

    this.forwardChannelRetryCount++;
    return true;
  }

  private long getRetryTime(int retryCount) {
    long retryTime =
        this.baseRetryDelayMs + (long) Math.floor(Math.random() * this.retryDelaySeedMs);
    if (!this.isActive()) {
      channelDebug.debug("Inactive channel");
      retryTime = retryTime * INACTIVE_CHANNEL_RETRY_FACTOR;
    }
    // Backoff for subsequent retries
    retryTime *= retryCount;
    return retryTime;
  }

  public void setRetryDelay(long baseDelayMs, long delaySeedMs) {
    this.baseRetryDelayMs = baseDelayMs;
    this.retryDelaySeedMs = delaySeedMs;
  }

  private boolean maybeRetryBackChannel(@Nullable ChannelError requestError) {
    if (this.backChannelRequest != null || this.backChannelTimer != null) {
      channelDebug.severe("Request already in progress");
      return false;
    }

    if (this.backChannelRetryCount >= this.getBackChannelMaxRetries()) {
      return false;
    }

    channelDebug.debug("Going to retry GET");

    this.backChannelAttemptId++;

    // Only enable faster recovery on request errors
    if (requestError != null) {
      Support.FailureRecoveryContext context = new FailureRecoveryContext();
      context.setError(requestError);
      context.setNumAttempts(this.backChannelAttemptId);
      context.setRequestChannelType(RequestChannelType.BACK_CHANNEL);

      this.backChannelTimer =
          support.setTimeout(
              new TimeoutHandler() {
                @Override
                public void onTimeout() {
                  WebChannelBase.this.onStartBackChannelTimer();
                }
              },
              this.getRetryTime(this.backChannelRetryCount),
              context);
    } else {
      this.backChannelTimer =
          support.setTimeout(
              new TimeoutHandler() {
                @Override
                public void onTimeout() {
                  WebChannelBase.this.onStartBackChannelTimer();
                }
              },
              this.getRetryTime(this.backChannelRetryCount));
    }

    this.backChannelRetryCount++;
    return true;
  }

  private static boolean isFatalError(@Nullable ChannelError error, int statusCode) {
    return error == ChannelError.UNKNOWN_SESSION_ID
        || (error == ChannelError.STATUS && statusCode > 0);
  }

  @Override
  public void onFirstByteReceived(ChannelRequest request, StringBuilder responseText) {
    if (this.backChannelRequest == request && this.detectBufferingProxy) {
      if (!this.bpDetectionDone) {
        this.channelDebug.info(
            "Great, no buffering proxy detected. Bytes received: " + responseText.length());
        this.channelDebug.assertCondition(
            this.bpDetectionTimer != null, "Timer should not have been cancelled.");
        this.clearBpDetectionTimer();
        this.bpDetectionDone = true;
        support.notifyStatEvent(RequestStat.NOPROXY);
      }
    }
  }

  @Override
  public void onRequestData(ChannelRequest request, String responseText) {
    if (this.state == State.CLOSED
        || (this.backChannelRequest != request
            && !this.forwardChannelRequestPool.hasRequest(request))) {
      return;
    }
    this.lastStatusCode = request.getLastStatusCode();

    if (!request.isInitialResponseDecoded()
        && this.forwardChannelRequestPool.hasRequest(request)
        && this.state == State.OPENED) {
      List<?> response;
      try {
        response = this.wireCodec.decodeMessage(responseText, 1);
      } catch (Exception ex) {
        channelDebug.dumpException(ex, "Failed to decode " + responseText);
        response = null;
      }
      if (response != null && response.size() == 3) {
        this.handlePostResponse(response, request);
        onForwardChannelFlushed();
      } else {
        channelDebug.debug("Bad POST response data returned");
        this.signalError(ErrorEnum.BAD_RESPONSE);
      }
    } else {
      if (request.isInitialResponseDecoded() || this.backChannelRequest == request) {
        this.clearDeadBackchannelTimer();
      }

      if (responseText != null) {
        responseText = responseText.trim();
        if (!responseText.isEmpty()) {
          try {
            List<?> decodedResponse = this.wireCodec.decodeMessage(responseText, 3);
            this.onInput(decodedResponse, responseText, request);
          } catch (Exception ex) {
            channelDebug.dumpException(ex, "Failed to decode " + responseText);
            this.signalError(ErrorEnum.BAD_RESPONSE);
          }
        }
      }
    }
  }

  private void onForwardChannelFlushed() {
    if (this.forwardChannelRequestPool.getRequestCount() <= 1) {
      if (this.forwardChannelFlushedCallback != null) {
        try {
          this.forwardChannelFlushedCallback.ackCommit();
        } catch (Exception ex) {
          channelDebug.dumpException(ex, "Exception from forwardChannelFlushedCallback");
        }
        this.forwardChannelFlushedCallback = null;
      }
    }
  }

  private void applyControlHeaders(ChannelRequest request) {
    HttpRequest req = request.getHttpRequest();
    if (req != null) {
      String clientProtocol = req.getResponseHeader(WebChannelConstants.X_CLIENT_WIRE_PROTOCOL);
      if (clientProtocol != null) {
        this.forwardChannelRequestPool.applyClientProtocol(clientProtocol);
      }

      if (this.getHttpSessionIdParam() != null) {
        String httpSessionIdHeader = req.getResponseHeader(WebChannelConstants.X_HTTP_SESSION_ID);
        if (httpSessionIdHeader != null) {
          this.setHttpSessionId(httpSessionIdHeader);
          String httpSessionIdParam = this.getHttpSessionIdParam();
          if (this.forwardChannelUri == null || httpSessionIdParam == null) {
            throw new IllegalStateException("forwardChannelUri or httpSessionIdParam is null");
          } else {
            this.forwardChannelUri.addQueryParameter(httpSessionIdParam, httpSessionIdHeader);
          }
        } else {
          this.channelDebug.warning("Missing X_HTTP_SESSION_ID in the handshake response");
        }
      }
    }
  }

  @SuppressWarnings("unchecked")
  private void onInput(
      List<?> responseJsonArray, String responseTextForDebugging, ChannelRequest request) {
    // channelHandleMultipleArrays ignored

    List<Object> batch = null;

    for (int i = 0; i < responseJsonArray.size(); i++) {
      List<Object> nextArray = (List<Object>) responseJsonArray.get(i);
      if (nextArray == null) {
        throw new IllegalStateException("nextArray is null");
      }
      // TODO(eryu): To be future proof, make xplat JSON parser return Long whenever possible.
      this.lastArrayId = ((Number) nextArray.get(0)).longValue();
      Object nextArrayObject = nextArray.get(1);
      if (this.state == WebChannelBase.State.OPENING) {
        nextArray = (List<Object>) nextArrayObject;
        if (nextArray.get(0).equals("c")) {
          this.sid = (String) nextArray.get(1);
          // this.hostPrefix_ = this.correctHostPrefix(nextArray[2]);

          if (nextArray.size() >= 4) {
            Number negotiatedVersion = (Number) nextArray.get(3);
            if (negotiatedVersion != null) {
              this.channelVersion = negotiatedVersion.intValue();
              channelDebug.debug("VER=" + this.channelVersion);
            }
          }
          if (nextArray.size() >= 5) {
            Number negotiatedServerVersion = (Number) nextArray.get(4);
            if (negotiatedServerVersion != null) {
              this.serverVersion = negotiatedServerVersion.intValue();
              channelDebug.debug("SVER=" + this.serverVersion);
            }
          }

          if (nextArray.size() >= 6) {
            Number serverKeepaliveMs = (Number) nextArray.get(5);
            if (serverKeepaliveMs != null && serverKeepaliveMs.longValue() > 0) {
              long timeout = Math.round(1.5 * serverKeepaliveMs.longValue());
              this.backChannelRequestTimeoutMs = timeout;
              channelDebug.debug("backChannelRequestTimeoutMs=" + timeout);
            }
          }

          this.applyControlHeaders(request);

          this.state = State.OPENED;
          if (this.handler != null) {
            this.handler.channelOpened(this);
          }

          if (this.detectBufferingProxy) {
            this.handshakeRttMs = System.currentTimeMillis() - request.getRequestStartTime();
            channelDebug.info("Handshake RTT:" + handshakeRttMs + "ms");
          }

          this.startBackchannelAfterHandshake(request);

          if (!this.outgoingMaps.isEmpty()) {
            this.ensureForwardChannel();
          }
        } else if (nextArray.get(0).equals("stop") || nextArray.get(0).equals("close")) {
          this.signalError(ErrorEnum.STOP);
        }
      } else if (this.state == State.OPENED) {
        if (nextArrayObject instanceof List) {
          nextArray = (List<Object>) nextArrayObject;
        }
        if (nextArrayObject instanceof List
            && (nextArray.get(0).equals("stop") || nextArray.get(0).equals("close"))) {
          if (this.handler != null && batch != null && !batch.isEmpty()) {
            this.handler.channelHandleMultipleArrays(this, batch);
            batch.clear();
          }
          if (nextArray.get(0).equals("stop")) {
            this.signalError(ErrorEnum.STOP);
          } else {
            this.disconnect();
          }
        } else if (nextArrayObject instanceof List && nextArray.get(0).equals("noop")) {
          // ignore - noop to keep connection happy
        } else {
          if (batch != null) {
            batch.add(nextArray);
          } else if (this.handler != null) {
            this.handler.channelHandleArray(this, nextArrayObject, responseTextForDebugging);
          }
        }
        this.backChannelRetryCount = 0;
      }
    }
    if (this.handler != null && batch != null && !batch.isEmpty()) {
      this.handler.channelHandleMultipleArrays(this, batch);
    }
  }

  private void startBackchannelAfterHandshake(ChannelRequest request) {
    String localPath = this.path;
    if (localPath == null) {
      throw new IllegalStateException("path is null");
    }
    this.backChannelUri = this.getBackChannelUri(localPath);

    if (request.isInitialResponseDecoded()) {
      this.channelDebug.debug("Upgrade the handshake request to a backchannel.");
      this.forwardChannelRequestPool.removeRequest(request);
      request.resetTimeout(this.backChannelRequestTimeoutMs);
      this.backChannelRequest = request;
    } else {
      this.ensureBackChannel();
    }
  }

  private void handlePostResponse(List<?> responseValues, ChannelRequest forwardReq) {
    // The first response value is set to 0 if server is missing backchannel.
    if (responseValues.get(0) != null && responseValues.get(0).equals(0)) {
      this.handleBackchannelMissing(forwardReq);
      return;
    }
    Number secondResponseValue = (Number) responseValues.get(1);
    if (secondResponseValue == null) {
      throw new IllegalStateException("Second response value is null");
    }
    this.lastPostResponseArrayId = secondResponseValue.longValue();
    long outstandingArrays = this.lastPostResponseArrayId - this.lastArrayId;
    if (0 < outstandingArrays) {
      Number thirdResponseValue = (Number) responseValues.get(2);
      if (thirdResponseValue == null) {
        throw new IllegalStateException("Third response value is null");
      }
      long numOutstandingBackchannelBytes = thirdResponseValue.longValue();
      channelDebug.debug(
          numOutstandingBackchannelBytes
              + " bytes (in "
              + outstandingArrays
              + " arrays) are outstanding on the BackChannel");
      if (!this.shouldRetryBackChannel(numOutstandingBackchannelBytes)) {
        return;
      }
      if (this.deadBackChannelTimer == null) {
        this.deadBackChannelTimer =
            support.setTimeout(
                new TimeoutHandler() {
                  @Override
                  public void onTimeout() {
                    WebChannelBase.this.onBackChannelDead();
                  }
                },
                2 * WebChannelBase.RTT_ESTIMATE);
      }
    }
  }

  private void handleBackchannelMissing(ChannelRequest forwardReq) {
    channelDebug.debug("Server claims our backchannel is missing.");
    if (this.backChannelTimer != null) {
      channelDebug.debug("But we are currently starting the request.");
      return;
    } else if (this.backChannelRequest == null) {
      channelDebug.warning("We do not have a BackChannel established");
    } else if (this.backChannelRequest.getRequestStartTime() + WebChannelBase.RTT_ESTIMATE
        < forwardReq.getRequestStartTime()) {
      this.clearDeadBackchannelTimer();
      this.cancelBackChannelRequest();
    } else {
      return;
    }
    this.maybeRetryBackChannel(null);
    support.notifyStatEvent(RequestStat.BACKCHANNEL_MISSING);
  }

  private boolean shouldRetryBackChannel(long outstandingBytes) {
    return outstandingBytes < OUTSTANDING_DATA_BACKCHANNEL_RETRY_CUTOFF
        && !this.isBuffered()
        && this.backChannelRetryCount == 0;
  }

  private void onBackChannelDead() {
    if (this.deadBackChannelTimer != null) {
      this.deadBackChannelTimer = null;
      this.cancelBackChannelRequest();
      this.maybeRetryBackChannel(null);
      support.notifyStatEvent(RequestStat.BACKCHANNEL_DEAD);
    }
  }

  @Override
  public UriBuilder getForwardChannelUri(String path) {
    UriBuilder uri = this.createDataUri(path, null);
    channelDebug.debug("GetForwardChannelUri: " + uri);
    return uri;
  }

  private UriBuilder getNetworkTestUri() {
    if (this.networkTestUri == null) {
      this.networkTestUri =
          support.newUriBuilder(this.path + "/test").addQueryParameter("MODE", "network");
    }
    return this.networkTestUri;
  }

  @Override
  public ConnectionState getConnectionState() {
    return this.connState;
  }

  @Override
  public UriBuilder createDataUri(String path, @Nullable Integer overridePort) {
    UriBuilder uri = support.newUriBuilder(path);
    channelDebug.assertCondition(uri.getAuthority() != null, "No relative path.");

    String httpSessionIdParam = this.getHttpSessionIdParam();
    String httpSessionId = this.getHttpSessionId();
    if (httpSessionIdParam != null && httpSessionId != null) {
      uri.addQueryParameter(httpSessionIdParam, httpSessionId);
    }

    uri.addQueryParameter("VER", Integer.toString(this.channelVersion));

    this.addAdditionalParams(uri);

    return uri;
  }

  @Override
  public UriBuilder getBackChannelUri(String path) {
    UriBuilder uri = this.createDataUri(path, null);
    channelDebug.debug("GetBackChannelUri: " + uri);
    return uri;
  }

  @Override
  public HttpRequest createHttpRequest() {
    return support.newHttpRequest();
  }

  @Override
  public boolean isActive() {
    return this.handler != null && this.handler.isActive(this);
  }

  public List<Wire.QueuedMap> getNonAckedMaps() {
    if (this.state == State.CLOSED) {
      channelDebug.assertCondition(
          this.nonAckedMapsAtChannelClose != null,
          "nonAckedMapsAtChannelClose is not set after channel close.");
      return this.nonAckedMapsAtChannelClose != null
          ? this.nonAckedMapsAtChannelClose
          : new ArrayList<>();
    }

    ArrayList<Wire.QueuedMap> unackedMaps = new ArrayList<>();
    unackedMaps.addAll(this.forwardChannelRequestPool.getPendingMessages());
    unackedMaps.addAll(this.outgoingMaps);
    return unackedMaps;
  }

  public void setForwardChannelFlushedCallback(AckCommitCallback callback) {
    this.forwardChannelFlushedCallback = callback;
  }

  public abstract static class Handler {

    public void channelHandleMultipleArrays(WebChannelBase channel, List<Object> data) {
      // ignored
    }

    public ErrorEnum okToMakeRequest(WebChannelBase channel) {
      return WebChannelBase.ErrorEnum.OK;
    }

    public void channelOpened(WebChannelBase channel) {}

    public void channelHandleArray(
        WebChannelBase channel, Object data, String responseTextForDebugging) {}

    public void channelSuccess(WebChannelBase channel, ChannelRequest request) {}

    public void channelError(WebChannelBase channel, ErrorEnum error) {}

    public void channelClosed(
        WebChannelBase channel,
        @Nullable List<Wire.QueuedMap> pendingData,
        @Nullable List<Wire.QueuedMap> undeliveredData) {}

    @Nullable
    public Map<String, String> getAdditionalParams(WebChannelBase channel) {
      return null;
    }

    public boolean isActive(WebChannelBase channel) {
      return true;
    }

    public void badMapError(WebChannelBase channel, Object data) {}
  }
}
