package com.google.net.webchannel.client.support.basic;

import com.google.net.webchannel.client.xplat.Support;
import java.net.URI;
import java.util.Objects;

/**
 * Implementation of WebChannel Uri interface backed by {@link java.net.URI}.
 */
public class BasicWebChannelSupportUri extends Support.Uri {
  private final URI uri;

  public BasicWebChannelSupportUri(URI uri) {
    this.uri = Objects.requireNonNull(uri);
  }

  public BasicWebChannelSupportUri(String uriString) {
    this.uri = URI.create(uriString);
  }

  public URI getJavaNetUri() {
    return uri;
  }

  @Override
  public String toString() {
    return uri.toString();
  }
}
