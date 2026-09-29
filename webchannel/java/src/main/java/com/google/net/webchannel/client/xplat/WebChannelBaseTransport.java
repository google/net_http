package com.google.net.webchannel.client.xplat;

import com.google.net.webchannel.client.AsyncWebChannel;
import com.google.net.webchannel.client.ErrorStatus;
import com.google.net.webchannel.client.WebChannel;
import com.google.net.webchannel.client.WebChannelConstants;
import com.google.net.webchannel.client.WebChannelOptions;
import com.google.net.webchannel.client.WebChannelRuntimeProperties;
import com.google.net.webchannel.client.WebChannelTransport;
import com.google.net.webchannel.client.xplat.Support.Debugger;
import com.google.net.webchannel.client.xplat.Support.JsonDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jspecify.annotations.Nullable;

// no disposeInternal (eventHandler, so not needed)
// sendrawjson automatically
class WebChannelBaseTransport extends WebChannelTransport {
  private Support support;

  public WebChannelBaseTransport(Support support) {
    this.support = support;
  }

  @Override
  public WebChannel createWebChannel(String urlPath, WebChannelOptions options) {
    throw new UnsupportedOperationException(
        "The xplat implementation only " + "supports the async webchannel client API.");
  }

  @Override
  public AsyncWebChannel createAsyncWebChannel(String urlPath, WebChannelOptions options) {
    return new InternalChannel(support, urlPath, options);
  }
}

class InternalChannel implements AsyncWebChannel {
  private WebChannelBase channel;
  private RuntimePropertiesInternal runtimeProperties;

  private String url;
  private final Debugger channelDebug;
  private final JsonDecoder jsonDecoder;
  private final @Nullable Map<String, String> messageUrlParams;

  @SuppressWarnings("UnusedVariable")
  private boolean sendRawJson;

  private Handler channelHandler;

  public InternalChannel(Support support, String url, WebChannelOptions options) {
    this.channel = new WebChannelBase(support, options, WebChannelTransport.CLIENT_VERSION, null);

    this.url = url;

    this.channelDebug = channel.getChannelDebug();
    this.jsonDecoder = support.getJsonDecoder();

    this.runtimeProperties = new RuntimePropertiesInternal(channel, channelDebug);

    if (options != null && options.getMessageUrlParams() != null) {
      this.messageUrlParams = options.getMessageUrlParams();
    } else {
      this.messageUrlParams = null;
    }

    // FIXME (js)
    Map<String, String> messageHeaders = null;
    if (options != null && options.getMessageHeaders() != null) {
      messageHeaders = options.getMessageHeaders();
    }
    if (options != null && options.getClientProtocolHeaderRequired()) {
      if (messageHeaders == null) {
        messageHeaders = new HashMap<>();
      }
      messageHeaders.put(
          WebChannelConstants.X_CLIENT_PROTOCOL, WebChannelConstants.X_CLIENT_PROTOCOL_WEB_CHANNEL);
    }
    this.channel.setExtraHeaders(messageHeaders);

    Map<String, String> initHeaders = null;
    if (options != null && options.getInitMessageHeaders() != null) {
      initHeaders = options.getInitMessageHeaders();
    }

    String messageContentType = options != null ? options.getMessageContentType() : null;
    if (messageContentType != null) {
      if (initHeaders == null) {
        initHeaders = new HashMap<>();
      }
      initHeaders.put(WebChannelConstants.X_WEBCHANNEL_CONTENT_TYPE, messageContentType);
    }

    String clientProfile = options != null ? options.getClientProfile() : null;
    if (clientProfile != null) {
      if (initHeaders == null) {
        initHeaders = new HashMap<>();
      }
      initHeaders.put(WebChannelConstants.X_WEBCHANNEL_CLIENT_PROFILE, clientProfile);
    }

    this.channel.setInitHeaders(initHeaders);

    this.sendRawJson = options != null && options.getSendRawJson();

    String httpSessionIdParam = options != null ? options.getHttpSessionIdParam() : null;
    if (httpSessionIdParam != null) {
      String trimmedHttpSessionIdParam = httpSessionIdParam.trim();
      if (!trimmedHttpSessionIdParam.isEmpty()) {
        this.channel.setHttpSessionIdParam(trimmedHttpSessionIdParam);
        if (this.messageUrlParams != null
            && this.messageUrlParams.containsKey(trimmedHttpSessionIdParam)) {
          this.messageUrlParams.remove(trimmedHttpSessionIdParam);
          this.channelDebug.warning(
              "Ignore httpSessionIdParam also specified with messageUrlParams: "
                  + trimmedHttpSessionIdParam);
        }
      }
    }

    this.channelHandler = new Handler(url, channelDebug, jsonDecoder);
  }

  @Override
  public void setChannelHandler(@Nullable EventHandler eventHandler) {
    this.channelHandler.eventHandler = eventHandler;
  }

  @Override
  public void open() {
    this.channel.setHandler(this.channelHandler);
    this.channel.connect(this.url, this.messageUrlParams, null, null);
  }

  @Override
  public void close() {
    this.channel.disconnect();
  }

  @Override
  public <T> void send(T message) throws IllegalArgumentException {
    if (!(message instanceof String)) {
      String errorMessage = "Serialized JSON string only. " + message.getClass();
      IllegalArgumentException argumentException = new IllegalArgumentException(errorMessage);
      channelDebug.dumpException(argumentException, errorMessage);
      throw argumentException;
    }

    String json = (String) message;
    Map<String, String> rawJson = new HashMap<>();
    rawJson.put(Wire.RAW_DATA_KEY, json);
    this.channel.sendMap(rawJson, null);
  }

  @Override
  public WebChannelRuntimeProperties getRuntimeProperties() {
    return this.runtimeProperties;
  }

  // Static class to avoid retain cycle on iOS with InternalChannel.
  private static class RuntimePropertiesInternal extends WebChannelRuntimeProperties {
    private final WebChannelBase channel;
    private final Debugger channelDebug;

    public RuntimePropertiesInternal(WebChannelBase channel, Debugger channelDebug) {
      this.channel = channel;
      this.channelDebug = channelDebug;
    }

    @Override
    public int getConcurrentRequestLimit() {
      return channel.getForwardChannelRequestPool().getMaxSize();
    }

    @Override
    public int getLastStatusCode() {
      return channel.getLastStatusCode();
    }

    @Override
    public @Nullable String getHttpSessionId() {
      return channel.getHttpSessionId();
    }

    @Override
    public <T> List<T> getNonAckedMessages() {
      ArrayList<T> list = new ArrayList<>();
      for (Wire.QueuedMap queuedMap : channel.getNonAckedMaps()) {
        Map<String, String> messageMap = queuedMap.map;
        channelDebug.assertCondition(
            messageMap.containsKey(Wire.RAW_DATA_KEY),
            "Serialized JSON messages only. Map = " + messageMap);
        Object nullableMessage = messageMap.get(Wire.RAW_DATA_KEY);
        if (nullableMessage == null) {
          throw new IllegalStateException("value from messageMap is null");
        }
        @SuppressWarnings("unchecked") // Currently only serialized JSON messages are supported.
        T message = (T) nullableMessage;
        list.add(message);
      }
      return list;
    }

    @Override
    public void commit(AckCommitCallback callback) {
      channel.setForwardChannelFlushedCallback(callback);
    }
  }

  // Static class to avoid retain cycle on iOS with InternalChannel.
  private static class Handler extends WebChannelBase.Handler {
    private final String url;
    private final Debugger channelDebug;
    private final JsonDecoder jsonDecoder;
    private @Nullable EventHandler eventHandler;

    private Handler(String url, Debugger channelDebug, JsonDecoder jsonDecoder) {
      this.url = url;
      this.channelDebug = channelDebug;
      this.jsonDecoder = jsonDecoder;
    }

    @Override
    public void channelOpened(WebChannelBase channel) {
      channelDebug.info("WebChannel opened on " + url);
      EventHandler localEventHandler = this.eventHandler;
      if (localEventHandler == null) {
        channelDebug.dumpException(
            new IllegalStateException("eventHandler is null"), "null eventHandler exception");
        return;
      }
      try {
        localEventHandler.onOpen();
      } catch (Exception ex) {
        channelDebug.dumpException(ex, "event handler onOpen() exception");
      }
    }

    @Override
    public void channelClosed(
        WebChannelBase channel,
        @Nullable List<Wire.QueuedMap> pendingData,
        @Nullable List<Wire.QueuedMap> undeliveredData) {
      channelDebug.info("WebChannel closed on " + url);
      EventHandler localEventHandler = this.eventHandler;
      if (localEventHandler == null) {
        channelDebug.dumpException(
            new IllegalStateException("eventHandler is null"), "null eventHandler exception");
        return;
      }
      try {
        localEventHandler.onClose();
      } catch (Exception ex) {
        channelDebug.dumpException(ex, "event handler onClose() exception");
      }
    }

    @Override
    public void channelError(WebChannelBase channel, WebChannelBase.ErrorEnum error) {
      channelDebug.info("WebChannel aborted on " + url + " due to channel error: " + error);
      EventHandler localEventHandler = this.eventHandler;
      if (localEventHandler == null) {
        channelDebug.dumpException(
            new IllegalStateException("eventHandler is null"), "null eventHandler exception");
        return;
      }
      try {
        localEventHandler.onError(new ErrorStatus(ErrorStatus.StatusEnum.NETWORK_ERROR, error));
      } catch (Exception ex) {
        channelDebug.dumpException(ex, "event handler onError() exception");
      }
    }

    @Override
    public void channelHandleArray(
        WebChannelBase channel, Object data, String responseTextForDebugging) {
      EventHandler localEventHandler = this.eventHandler;
      if (localEventHandler == null) {
        channelDebug.dumpException(
            new IllegalStateException("eventHandler is null"), "null eventHandler exception");
        return;
      }
      try {
        if (jsonDecoder.isJsonObjectAndHasKey(data, "__headers__")) {
          localEventHandler.onHeaders(
              jsonDecoder.getIntFromJsonObject(data, "__status__"),
              jsonDecoder.getStringMapFromJsonObject(data, "__headers__"));
          return; // Assuming headers are exclusive on the wire.
        }

        if (jsonDecoder.isJsonObjectAndHasKey(data, "__sm__")) {
          Object metadataObject = jsonDecoder.getJsonObjectFromJsonObject(data, "__sm__");
          String metadataKey = jsonDecoder.getAnyKey(metadataObject);
          if (metadataKey != null) {
            localEventHandler.onMetadata(metadataKey, jsonDecoder.get(metadataObject, metadataKey));
          } else {
            localEventHandler.onMetadata("", ""); // Empty metadata
          }
        } else {
          localEventHandler.onMessage(data);
        }
      } catch (Exception ex) {
        channelDebug.dumpException(
            ex, "event handler onMessage() exception! Payload: " + responseTextForDebugging);
      }
    }
  }
}
