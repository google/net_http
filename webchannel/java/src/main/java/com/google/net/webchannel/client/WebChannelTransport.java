package com.google.net.webchannel.client;

/**
 * A factory class for creating WebChannel instances. Default implementation
 * offers no physical "sharing" of the underlying transport.
 */
public abstract class WebChannelTransport {

  public static final int CLIENT_VERSION = 22;

  protected WebChannelTransport() {
  }

  public abstract WebChannel createWebChannel(String urlPath,
      WebChannelOptions options);

  public abstract AsyncWebChannel createAsyncWebChannel(String urlPath,
      WebChannelOptions options);

  public static WebChannelTransport createTransport() {
    return new DefaultWebChannelTransport();
  }

  private static class DefaultWebChannelTransport
      extends WebChannelTransport {
    public DefaultWebChannelTransport() {
    }

    @Override
    public WebChannel createWebChannel(String urlPath,
        WebChannelOptions options) {
      throw new UnsupportedOperationException("to be implemented.");
    }

    @Override
    public AsyncWebChannel createAsyncWebChannel(String urlPath,
        WebChannelOptions options) {
      throw new UnsupportedOperationException("to be implemented.");
    }
  }
}
