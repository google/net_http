package com.google.net.webchannel.client.xplat;

import java.util.List;
import org.jspecify.annotations.Nullable;

class ConnectionState {

  private @Nullable List<String> handshakeResult = null;

  private @Nullable Boolean bufferingProxyResult = null;

  public @Nullable List<String> getHandshakeResult() {
    return handshakeResult;
  }

  public void setHandshakeResult(List<String> handshakeResult) {
    this.handshakeResult = handshakeResult;
  }

  public @Nullable Boolean getBufferingProxyResult() {
    return bufferingProxyResult;
  }

  public void setBufferingProxyResult(Boolean bufferingProxyResult) {
    this.bufferingProxyResult = bufferingProxyResult;
  }

  public ConnectionState() {}
}
