package com.google.net.webchannel.client.xplat;

import com.google.net.webchannel.client.WebChannelTransport;

public class WebChannelTransports {

  public static WebChannelTransport createTransport(Support support) {
    return new WebChannelBaseTransport(support);
  }
}
