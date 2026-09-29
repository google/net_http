package com.google.net.webchannel.client.xplat;

import com.google.net.webchannel.client.xplat.Support.HttpRequest;
import com.google.net.webchannel.client.xplat.Support.UriBuilder;
import org.jspecify.annotations.Nullable;

interface Channel {

  HttpRequest createHttpRequest();

  void onRequestComplete(ChannelRequest request);

  boolean isClosed();

  void onRequestData(ChannelRequest request, String responseText);

  void onFirstByteReceived(ChannelRequest request, StringBuilder responseText);

  boolean isActive();

  UriBuilder getForwardChannelUri(String path);

  UriBuilder getBackChannelUri(String path);

  UriBuilder createDataUri(String path, @Nullable Integer overridePort);

  ConnectionState getConnectionState();

  void setHttpSessionIdParam(String httpSessionIdParam);

  @Nullable String getHttpSessionIdParam();

  void setHttpSessionId(String httpSessionId);

  @Nullable String getHttpSessionId();

  Object getWireCodec();       // extra for Java
}
