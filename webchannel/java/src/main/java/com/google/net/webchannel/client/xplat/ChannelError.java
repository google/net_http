package com.google.net.webchannel.client.xplat;

/** Errors that can occur on a channel request. */
public enum ChannelError {
  STATUS,
  NO_DATA,
  TIMEOUT,
  UNKNOWN_SESSION_ID,
  BAD_DATA,
  HANDLER_EXCEPTION,
  BROWSER_OFFLINE
}
