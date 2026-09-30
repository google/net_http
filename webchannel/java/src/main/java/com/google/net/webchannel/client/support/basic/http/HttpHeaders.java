package com.google.net.webchannel.client.support.basic.http;

import com.google.common.collect.Lists;
import com.google.errorprone.annotations.CanIgnoreReturnValue;
import java.util.AbstractMap;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import javax.annotation.Nullable;

/**
 * Stores HTTP headers used in an HTTP request or response.
 *
 * <p>{@code null} is not allowed as a name or value of a header.
 *
 * <p>Names are case-insensitive.
 *
 * <p>Implementation is not thread-safe.
 */
public final class HttpHeaders extends AbstractMap<String, List<String>> {

  /** Constants for http header field names. */
  public static final String AUTHORIZATION = "Authorization";

  public static final String ACCEPT_ENCODING = "Accept-Encoding";

  public static final String CONTENT_LENGTH = "Content-Length";
  public static final String CONTENT_TYPE = "Content-Type";

  public static final String IF_MATCH = "If-Match";
  public static final String IF_NONE_MATCH = "If-None-Match";
  public static final String IF_MODIFIED_SINCE = "If-Modified-Since";
  public static final String IF_UNMODIFIED_SINCE = "If-Unmodified-Since";
  public static final String IF_RANGE = "If-Range";

  /** Map of header fields with lowercase keys. */
  private final Map<String, List<String>> headerFields = new HashMap<>();

  /** The dictionary to fix capitalization. */
  private final Map<String, String> displayName = new HashMap<>();

  /** Initialize some of the header fields. */
  public HttpHeaders() {
    set(ACCEPT_ENCODING, "gzip");
  }

  @Nullable
  @Override
  public List<String> get(Object key) {
    if (!(key instanceof String)) {
      return null;
    }
    String name = ((String) key).toLowerCase(Locale.US);
    return headerFields.get(name);
  }

  @Override
  public Set<Map.Entry<String, List<String>>> entrySet() {
    Map<String, List<String>> res = new HashMap<>();
    for (Map.Entry<String, List<String>> entry : headerFields.entrySet()) {
      res.put(displayName.get(entry.getKey()), entry.getValue());
    }
    return res.entrySet();
  }

  /** Add the <lowercase key, value> pair to the headers, meanwhile store the 'display' name. */
  @CanIgnoreReturnValue
  @SuppressWarnings("ReturnMissingNullable") // unusual Map implementation
  @Override
  public List<String> put(String name, List<String> value) {
    String keyName = name.toLowerCase(Locale.US);
    if (!displayName.containsKey(keyName)) {
      displayName.put(keyName, name);
    }
    headerFields.put(keyName, value);
    return value;
  }

  @CanIgnoreReturnValue
  @Nullable
  @Override
  public List<String> remove(Object key) {
    if (!(key instanceof String)) {
      return null;
    }
    String name = ((String) key).toLowerCase(Locale.US);
    displayName.remove(name);
    return headerFields.remove(name);
  }

  @Override
  public void clear() {
    headerFields.clear();
    displayName.clear();
  }

  /** Returns the first header string value for the given header name. */
  @Nullable
  public String getFirstHeaderValue(String name) {
    List<String> value = get(name);
    if (value == null || value.isEmpty()) {
      return null;
    }
    return value.get(0);
  }

  public void set(String name, String value) {
    if (value == null) {
      put(name, null);
    } else {
      put(name, Lists.newArrayList(value));
    }
  }

  public void set(String name, List<String> value) {
    put(name, value);
  }
}
