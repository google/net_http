package com.google.net.webchannel.client;

import java.util.Map;
import org.jspecify.annotations.Nullable;

/** The channel abstraction. See closure API spec. */
public interface AsyncWebChannel {

  /**
   * Events are fired in the order as they are generated, e.g. from the communication with the
   * network or server.
   */
  abstract class EventHandler {
    public void onOpen() {}

    public void onClose() {}

    public void onError(ErrorStatus error) {}

    /**
     * Messages are to be delivered in order. The callback should be a non-blocking operation. New
     * messages will not be delivered before the current callback returns.
     *
     * @param message The message decoded from the wire.
     * @param <T>
     */
    public <T> void onMessage(T message) {}

    /**
     * Similar to {@code #onMessage()}, but with metadata as HTTP status code and headers.
     *
     * @param statusCode Metadata as HTTP status code.
     * @param headers Metadata as HTTP headers.
     */
    public void onHeaders(int statusCode, Map<String, String> headers) {}

    /**
     * Similar to {@code #onMessage()}, but with metadata.
     *
     * @param key Metadata key.
     * @param metadata Metadata value, usually a JSON object depending on the runtime (support).
     */
    public void onMetadata(String key, Object metadata) {}
  }

  /**
   * To be set to the channel before open() is called.
   *
   * @param eventHandler
   */
  void setChannelHandler(@Nullable EventHandler eventHandler);

  /**
   * Opens the channel against the URL specified when the channel is created.
   *
   * @see WebChannelTransport
   */
  void open();

  /** Closes the channel. */
  void close();

  /**
   * Sends a message to the server. This is a non-blocking operation.
   *
   * <p>=== Non Web ===
   *
   * <p>Binary encoded messages are supported for non-web clients.
   *
   * @see WebChannelOptions#getEnableBinaryEncoding
   * @param message The message to send
   * @throws IllegalArgumentException if the implementation does not support the message type
   */
  <T> void send(T message) throws IllegalArgumentException;

  /** Returns a reference to the (mutable) runtime properties of the channel object. */
  WebChannelRuntimeProperties getRuntimeProperties();
}
