package com.google.net.webchannel.client;

import java.util.List;
import org.jspecify.annotations.Nullable;

/**
 * The runtime properties of a channel.
 *
 * <p>This is a mutable object associated with the state of the underlying channel object.
 */
public abstract class WebChannelRuntimeProperties {

  public WebChannelRuntimeProperties() {}

  public abstract int getConcurrentRequestLimit();

  /** Returns true by default for native clients. */
  public boolean isSpdyEnabled() {
    return true;
  }

  public interface AckCommitCallback {
    void ackCommit();
  }

  public abstract void commit(AckCommitCallback callback);

  public abstract <T> List<T> getNonAckedMessages();

  public interface NotifyNonAckedMessageCountCallback {
    void notifyNonAckedMessageCount();
  }

  public void notifyNonAckedMessageCount(long count, NotifyNonAckedMessageCountCallback callback) {
    throw new UnsupportedOperationException();
  }

  public interface OnCommitCallback {
    void onCommit(Object commitId);
  }

  public void onCommit(OnCommitCallback callback) {
    throw new UnsupportedOperationException();
  }

  public void ackCommit(Object commitId) {
    throw new UnsupportedOperationException();
  }

  public abstract int getLastStatusCode();

  public abstract @Nullable String getHttpSessionId();

  @Override
  public String toString() {
    return "WebChannelRuntimeProperties{"
        + "concurrentRequestLimit="
        + getConcurrentRequestLimit()
        + ", spdyEnabled="
        + isSpdyEnabled()
        + ", nonAckedMessages="
        + getNonAckedMessages()
        + ", lastStatusCode="
        + getLastStatusCode()
        + ", httpSessionId="
        + getHttpSessionId()
        + '}';
  }
}
