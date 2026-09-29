package com.google.net.webchannel.client.xplat;

import com.google.errorprone.annotations.CanIgnoreReturnValue;
import com.google.errorprone.annotations.Immutable;
import com.google.j2objc.annotations.Weak;
import java.util.List;
import java.util.Map;
import org.jspecify.annotations.NullMarked;
import org.jspecify.annotations.Nullable;

/**
 * This class is used to abstract ALL platform specific dependencies, which for now include: json,
 * base64, url/urilbuilder/urlencoder, http, debug, stats, timer.
 *
 * <p>The use of webchannel xplat needs implement this class and pass it to WebChannelTransports.
 *
 * <p>Threading: Each WebChannel channel owns one instance of {@link Support}. Clients should ensure
 * that the same thread will be used for:
 *
 * <ol>
 *   <li>Opening, reading from and writing to a webchannel.
 *   <li>Calling the onReadyStateChangeEvent() callback when received more HTTP data.
 *   <li>Calling the handler specified in setTimeout().
 * </ol>
 */
@NullMarked
public abstract class Support {

  // redact not supported
  // execution hooks not supported (onstart/onend from timer)

  // ==== to be implemented by the xplat (from apps)

  /** Base class for URI objects. */
  @Immutable
  public abstract static class Uri {
    // immutable
    @Override
    public abstract String toString();
  }

  /** Base class for URI builders. */
  public abstract static class UriBuilder implements Cloneable {
    @CanIgnoreReturnValue
    public abstract UriBuilder addQueryParameter(String name, String value);

    public abstract String getAuthority();

    public abstract Uri getUri();

    @SuppressWarnings("MissingOverride")
    public abstract UriBuilder clone();

    @Override
    public abstract String toString();
  }

  /** Base class for URL encoder implementations. */
  public abstract static class UrlEncoder {
    public abstract String encode(String data);
  }

  /** WebChannel Debugger interface. Redact not supported. */
  public abstract static class Debugger {

    public void disableRedact() {
      // No-op. Redact not supported.
    }

    /**
     * Expects subclasses to overwrite this. Any computed logs should be written only when
     * the debugger is enabled.
     *
     * Not consistent with JS: which accepts goog.log.Loggable (similar to Supplier in JDK-8).
     */
    public boolean isEnabled() {
      return true;
    }

    public abstract void info(String text);

    public void debug(String text) {
      this.info(text);
    }

    public abstract void warning(String text);

    public abstract void dumpException(Exception ex, String msg); // severe

    public abstract void severe(String text);

    /**
     * goog.asserts in JS.
     */
    public abstract void assertCondition(boolean condition, String text);

    public void httpRequest(
        String verb, UriBuilder uri, String id, long attempt, @Nullable String postData) {
      if (!isEnabled()) {
        return;
      }

      // WARNING: Do not use info() log until we strip out the PII.
      debug(
          "HTTP REQ ("
              + id
              + ") [attempt "
              + attempt
              + "]: "
              + verb
              + "\n"
              + uri
              + "\n"
              + postData);
    }

    public void httpChannelResponseMetaData(
        @Nullable String verb,
        @Nullable UriBuilder uri,
        String id,
        long attempt,
        RequestReadyState readyState,
        int statusCode) {
      if (!isEnabled()) {
        return;
      }

      // WARNING: Do not use info() log until we strip out the PII.
      debug(
          "HTTP RESP ("
              + id
              + ") [ attempt "
              + attempt
              + "]: "
              + verb
              + "\n"
              + uri
              + "\n"
              + readyState
              + " "
              + statusCode);
    }

    public void httpChannelResponseText(
        String id, @Nullable StringBuilder responseText, @Nullable String desc) {
      if (!isEnabled()) {
        return;
      }

      // WARNING: Do not use info() log until we strip out the PII.
      debug("HTTP TEXT (" + id + "): " + responseText + desc);
    }
  }

  /**
   * Class that tracks the state of an ongoing HTTP Request.
   *
   * <p>For every HTTP request, WebChannel would create a new HttpRequest instance and then call
   * send() exactly once during the life cycle of this request.
   *
   * <p>See {@link Support} for more info.
   */
  public abstract static class HttpRequest {
    @Weak private @Nullable RequestReadyStateChangeHandler readyStateChangeHandler = null;

    public void setReadyStateChangeHandler(@Nullable RequestReadyStateChangeHandler handler) {
      this.readyStateChangeHandler = handler;
    }

    public @Nullable RequestReadyStateChangeHandler getReadyStateChangeHandler() {
      return this.readyStateChangeHandler;
    }

    public abstract String getResponseHeader(String name);

    // Java only
    public abstract Map<String, String> getAllResponseHeadersForDebugging();

    /**
     * Appends any new response text to the provided buffer, and resets the
     * response body owned by this object.
     *
     * @param buffer The buffer to copy the response text to. If null, just
     *               reset the response body.
     */
    public void drainResponseText(StringBuilder buffer) {
      // TODO(wenboz): make this an abstract method after dynamite is fixed
    }

    public abstract RequestReadyState getReadyState();

    public abstract RequestErrorCode getLastErrorCode();

    public abstract int getStatus(); // HTTP status code

    /**
     * Sends an HTTP request.
     *
     * @param verb The HTTP method, supported values are "GET" and "POST".
     * @param postData Optional data to POST.
     * @param headers Optional header map.
     */
    public abstract void send(
        UriBuilder uri,
        String verb,
        @Nullable String postData,
        @Nullable Map<String, String> headers);

    public abstract void abort();
  }

  /** Callback for when the ready state of an HTTP request changes. */
  public interface RequestReadyStateChangeHandler {
    void onReadyStateChangeEvent(HttpRequest request);
  }

  /** Ready state of an HTTP request. */
  public enum RequestReadyState {
    UNINITIALIZED,
    LOADING,
    LOADED, // whenever response headers are received
    INTERACTIVE, // whenever _new_ response data arrives (under 200)
    COMPLETE // whenever the response is finished (or aborted), EOF
  }

  /**
   * Error codes.
   *
   * TODO(eryu): Consolidate with future xplat error codes.
   */
  public enum RequestErrorCode {
    /**
     * There is no error condition.
     */
    NO_ERROR,

    /**
     * The most common error from iframeio, unfortunately, is that the browser
     * responded with an error page that is classed as a different domain. The
     * situations, are when a browser error page  is shown -- 404, access denied,
     * DNS failure, connection reset etc.)
     */
    ACCESS_DENIED,

    /**
     * Currently the only case where file not found will be caused is when the
     * code is running on the local file system and a non-IE browser makes a
     * request to a file that doesn't exist.
     */
    FILE_NOT_FOUND,

    /**
     * If Firefox shows a browser error page, such as a connection reset by
     * server or access denied, then it will fail silently without the error or
     * load handlers firing.
     */
    FF_SILENT_ERROR,

    /**
     * Custom error provided by the client through the error check hook.
     */
    CUSTOM_ERROR,

    /**
     * Exception was thrown while processing the request.
     */
    EXCEPTION,

    /**
     * The Http response returned a non-successful http status code.
     */
    HTTP_ERROR,

    /**
     * The request was aborted.
     */
    ABORT,

    /**
     * The request timed out.
     */
    TIMEOUT,

    /**
     * The resource is not available offline.
     */
    OFFLINE,
  }

  /**
   * Stat events for WebChannel requests.
   */
  public enum RequestStat {
    CONNECT_ATTEMPT(0),
    ERROR_NETWORK(1),
    ERROR_OTHER(2),
    TEST_STAGE_ONE_START(3),
    TEST_STAGE_TWO_START(4),
    TEST_STAGE_TWO_DATA_ONE(5),
    TEST_STAGE_TWO_DATA_TWO(6),
    TEST_STAGE_TWO_DATA_BOTH(7),
    TEST_STAGE_ONE_FAILED(8),
    TEST_STAGE_TWO_FAILED(9),
    PROXY(10),
    NOPROXY(11),
    REQUEST_UNKNOWN_SESSION_ID(12),
    REQUEST_BAD_STATUS(13),
    REQUEST_INCOMPLETE_DATA(14),
    REQUEST_BAD_DATA(15),
    REQUEST_NO_DATA(16),
    REQUEST_TIMEOUT(17),
    BACKCHANNEL_MISSING(18),
    BACKCHANNEL_DEAD(19),
    BROWSER_OFFLINE(20);

    private final int value;
    RequestStat(int value) {
      this.value = value;
    }
    public int getValue() {
      return value;
    }
  }

  /**
   * Server reachability status events for WebChannel requests.
   */
  public enum ServerReachability {
    REQUEST_MADE(1),
    REQUEST_SUCCEEDED(2),
    REQUEST_FAILED(3),
    BACK_CHANNEL_ACTIVITY(4);

    private final int value;
    ServerReachability(int value) {
      this.value = value;
    }
    public int getValue() {
      return value;
    }
  }

  // stats

  public void notifyStatEvent(RequestStat event) {
    // optional
  }

  public void notifyServerReachabilityEvent(ServerReachability event) {
    // optional
  }

  public void notifyTimingEvent(int size, long rtt, int retries) {
    // optional
  }

  public void onStartExecution() {
    // not needed
  }

  public void onEndExecution() {
    // not needed now
  }

  // timer (future) support

  /** Callback for when a timeout occurs. */
  public interface TimeoutHandler {
    void onTimeout();
  }

  /**
   * Sets a timer to invoke the given handler after the given timeout.
   *
   * @param handler The event handler of the timeout event
   * @param timeout The timeout from present. This can be zero too.
   * @return The timer object to hold
   */
  @SuppressWarnings("GoodTime") // should accept a java.time.Duration
  public abstract Object setTimeout(TimeoutHandler handler, long timeout);

  /**
   * Java only.
   *
   * <p>To be overridden by the subclass, which must follow the same contract as <code>
   * #setTimeout(Timeout, long)</code>.
   *
   * @param handler The event handler of the timeout event
   * @param timeout The timeout from present. This can be zero too.
   * @param context The failure recovery context if the timer is set for a recovery operation, e.g.
   *     issuing a new request when the previous request has timed out. The Support layer may choose
   *     to fire the timeout event earlier e.g. using platform provided signals such as wireless
   *     status change.
   * @return The timer object to hold
   */
  @SuppressWarnings("GoodTime") // should accept a java.time.Duration
  public Object setTimeout(TimeoutHandler handler, long timeout, FailureRecoveryContext context) {
    return setTimeout(handler, timeout);
  }

  /**
   * Clears the given timer.
   *
   * @param timer The timer object to clear.
   */
  public abstract void clearTimeout(Object timer);

  // ==== Failure recovery context

  /**
   * The type of channel involved.
   */
  public enum RequestChannelType {
    FORWARD_CHANNEL,
    BACK_CHANNEL
  }

  /**
   * Context information for managing failure recovery.
   *
   * @see #setTimeout(TimeoutHandler, long, FailureRecoveryContext)
   */
  public static class FailureRecoveryContext {
    private @Nullable ChannelError error;
    private long numAttempts;  // 1: first attempt to recover
    private @Nullable RequestChannelType channelType;

    @Nullable ChannelError getError() {
      return error;
    }

    void setError(@Nullable ChannelError error) {
      this.error = error;
    }

    public long getNumAttempts() {
      return numAttempts;
    }

    public void setNumAttempts(long numAttempts) {
      this.numAttempts = numAttempts;
    }

    public @Nullable RequestChannelType getRequestChannelType() {
      return channelType;
    }

    public void setRequestChannelType(
        RequestChannelType channelType) {
      this.channelType = channelType;
    }
  }

  // ==== to be implemented by the apps (e.g. dynamite)

  /** Base class for JSON encoders. */
  public abstract static class JsonEncoder {
    // to be defined
  }

  /**
   * The decoded value needs be a canned type. All primitive types need be Java boxed typed.
   * Everything else will be opaque objects to the WebChannel code, i.e. the consumer of the decoder
   * (as supplied by the application). Numeric values need be of the Long type.
   *
   * <p>However, for efficiency, decoded user messages (again, as Objects) will be passed back to
   * the application directly,
   */
  public abstract static class JsonDecoder {
    /**
     * Decode an array up to the specified maxDepth (maximum being 3).
     * All primitive types are boxed types.
     * Messages are Objects.
     * Arrays are of List type.
     */
    public abstract List<?> decodeArray(String data, int maxDepth);

    /** Returns true if the given object a JSON object and it has the given key. */
    public abstract boolean isJsonObjectAndHasKey(Object jsonObject, String key);

    /** Returns the value associated with the given key in a JSON object. */
    public abstract Object get(Object jsonObject, String key);

    /** Returns one key from the given JSON object, if any exists. */
    public abstract @Nullable String getAnyKey(Object jsonObject);

    /** Returns the value associated with the given key in a JSON object as JSON object. */
    public abstract Object getJsonObjectFromJsonObject(Object jsonObject, String key);

    /** Returns the value associated with the given key in a JSON object as integer. */
    public abstract int getIntFromJsonObject(Object jsonObject, String key);

    /** Returns the value associated with the given key in a JSON object as string -> string map. */
    public abstract Map<String, String> getStringMapFromJsonObject(Object jsonObject, String key);
  }

  // not used yet

  /** Base class for Base64 encoding. */
  public abstract static class Base64Encoder {
    public abstract String encode(byte[] data);
  }

  /** Base class for Base64 decoding. */
  public abstract static class Base64Decoder {
    public abstract byte[] decode(String data);
  }

  // ===== factory methods

  public abstract UriBuilder newUriBuilder(Uri uri);

  public abstract UriBuilder newUriBuilder(String uri); // parse()

  public abstract Debugger getDebugger();

  public abstract HttpRequest newHttpRequest();

  public abstract UrlEncoder getUrlEncoder();

  public JsonEncoder getJsonEncoder() {
    throw new UnsupportedOperationException("not needed for now.");
  }

  public abstract JsonDecoder getJsonDecoder();

  public abstract Base64Encoder getBase64Encoder();

  public abstract Base64Decoder getBase64Decoder();
}
