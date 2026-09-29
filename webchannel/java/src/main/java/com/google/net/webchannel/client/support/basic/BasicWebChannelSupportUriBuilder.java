package com.google.net.webchannel.client.support.basic;

import static java.nio.charset.StandardCharsets.UTF_8;

import com.google.errorprone.annotations.CanIgnoreReturnValue;
import com.google.net.webchannel.client.xplat.Support;
import java.net.URI;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Implementation of WebChannel UriBuilder interface backed by {@link java.net.URI}.
 */
public class BasicWebChannelSupportUriBuilder extends Support.UriBuilder {
  private final URI baseUri;
  private final List<QueryParam> queryParams;

  private static class QueryParam {
    final String name;
    final String value;

    QueryParam(String name, String value) {
      this.name = name;
      this.value = value;
    }
  }

  public static BasicWebChannelSupportUriBuilder parse(String url) {
    URI uri = URI.create(url);
    List<QueryParam> existingParams = new ArrayList<>();
    String query = uri.getRawQuery();
    if (query != null && !query.isEmpty()) {
      for (String pair : query.split("&")) {
        int idx = pair.indexOf('=');
        if (idx > 0) {
          existingParams.add(new QueryParam(pair.substring(0, idx), pair.substring(idx + 1)));
        } else if (!pair.isEmpty()) {
          existingParams.add(new QueryParam(pair, ""));
        }
      }
    }

    try {
      URI strippedUri =
          new URI(
              uri.getScheme(),
              uri.getRawAuthority(),
              uri.getRawPath(),
              null,
              uri.getRawFragment());
      return new BasicWebChannelSupportUriBuilder(strippedUri, existingParams);
    } catch (Exception e) {
      return new BasicWebChannelSupportUriBuilder(uri, existingParams);
    }
  }

  private BasicWebChannelSupportUriBuilder(URI baseUri, List<QueryParam> queryParams) {
    this.baseUri = Objects.requireNonNull(baseUri);
    this.queryParams = new ArrayList<>(queryParams);
  }

  @CanIgnoreReturnValue
  @Override
  public BasicWebChannelSupportUriBuilder addQueryParameter(String name, String value) {
    queryParams.add(new QueryParam(name, value));
    return this;
  }

  @Override
  public String getAuthority() {
    return baseUri.getAuthority();
  }

  @Override
  public BasicWebChannelSupportUri getUri() {
    return new BasicWebChannelSupportUri(toString());
  }

  @Override
  public BasicWebChannelSupportUriBuilder clone() {
    return new BasicWebChannelSupportUriBuilder(baseUri, queryParams);
  }

  @Override
  public String toString() {
    if (queryParams.isEmpty()) {
      return baseUri.toString();
    }
    StringBuilder sb = new StringBuilder();
    sb.append(baseUri.toString());
    sb.append('?');
    for (int i = 0; i < queryParams.size(); i++) {
      if (i > 0) {
        sb.append('&');
      }
      QueryParam qp = queryParams.get(i);
      sb.append(URLEncoder.encode(qp.name, UTF_8));
      sb.append('=');
      sb.append(URLEncoder.encode(qp.value != null ? qp.value : "", UTF_8));
    }
    return sb.toString();
  }
}
