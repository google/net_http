package com.google.net.webchannel.client;

/**
 * The error status of a channel. This class matches the closure goog.net.WebChannel JS API spec.
 */
public class ErrorStatus {

  /**
   * Status enum, exposed as part of the public API.
   */
  public enum StatusEnum {
    /** No error has occurred. */
    OK,

    /** Communication to the server has failed. */
    NETWORK_ERROR,

    /** The server fails to accept the WebChannel. */
    SERVER_ERROR
  }

  private final StatusEnum statusEnum;
  private final Object detail;

  /**
   * @param statusEnum The status enum
   * @param detail Debugging info specific to wire protocol version, e.g. detailed v8 error code.
   */
  public ErrorStatus(StatusEnum statusEnum, Object detail) {
    this.statusEnum = statusEnum;
    this.detail = detail;
  }

  public StatusEnum getStatusEnum() {
    return statusEnum;
  }

  @Override
  public String toString() {
    return statusEnum + " (" + detail + ')';
  }
}
