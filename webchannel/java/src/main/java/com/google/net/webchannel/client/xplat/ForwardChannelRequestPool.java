package com.google.net.webchannel.client.xplat;

import com.google.net.webchannel.client.xplat.Wire.QueuedMap;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.jspecify.annotations.Nullable;

class ForwardChannelRequestPool {

  // spdy always enabled for mobile

  private static final int MAX_POOL_SIZE = 10;

  private int maxPoolSizeConfigured;
  private int maxSize;
  private @Nullable Set<ChannelRequest> requestPool = null;
  private @Nullable ChannelRequest request = null;

  private List<QueuedMap> pendingMessages;

  public ForwardChannelRequestPool(int maxPoolSize) {
    if (maxPoolSize <= 0) {
      maxPoolSizeConfigured = MAX_POOL_SIZE;
    } else {
      maxPoolSizeConfigured = maxPoolSize;
    }

    this.maxSize = maxPoolSizeConfigured;

    this.requestPool = null;

    if (this.maxSize > 1) {
      this.requestPool = new HashSet<>();
    }

    this.request = null;

    this.pendingMessages = new ArrayList<>();
  }

  public void applyClientProtocol(String clientProtocol) {
    // no-op
  }

  public boolean isFull() {
    if (this.request != null) {
      return true;
    }

    if (this.requestPool != null) {
      return this.requestPool.size() >= this.maxSize;
    }

    return false;
  }

  public int getMaxSize() {
    return this.maxSize;
  }

  public int getRequestCount() {
    if (this.request != null) {
      return 1;
    }

    if (this.requestPool != null) {
      return this.requestPool.size();
    }

    return 0;
  }

  public boolean hasRequest(ChannelRequest req) {
    if (this.request != null) {
      return this.request == req;
    }

    if (this.requestPool != null) {
      return this.requestPool.contains(req);
    }

    return false;
  }

  public void addRequest(ChannelRequest req) {
    if (this.requestPool != null) {
      this.requestPool.add(req);
    } else {
      this.request = req;
    }
  }

  public boolean removeRequest(ChannelRequest req) {
    if (this.request != null && this.request == req) {
      this.request = null;
      return true;
    }

    if (this.requestPool != null && this.requestPool.contains(req)) {
      this.requestPool.remove(req);
      return true;
    }

    return false;
  }

  public void cancel() {
    this.pendingMessages = this.getPendingMessages();

    if (this.request != null) {
      this.request.cancel();
      this.request = null;
      return;
    }

    Set<ChannelRequest> localRequestPool = this.requestPool;
    if (localRequestPool != null && !localRequestPool.isEmpty()) {
      for (ChannelRequest req : localRequestPool) {
        req.cancel();
      }
      localRequestPool.clear();
    }
  }

  public boolean hasPendingRequest() {
    return (this.request != null) || (this.requestPool != null && !this.requestPool.isEmpty());
  }

  public List<Wire.QueuedMap> getPendingMessages() {
    List<Wire.QueuedMap> result = new ArrayList<>();
    result.addAll(this.pendingMessages);

    if (this.request != null) {
      result.addAll(this.request.getPendingMessages());
      return result;
    }

    if (this.requestPool != null && !this.requestPool.isEmpty()) {
      for (ChannelRequest req : this.requestPool) {
        result.addAll(req.getPendingMessages());
      }
      return result;
    }

    return result;
  }

  public void addPendingMessages(List<Wire.QueuedMap> messages) {
    this.pendingMessages.addAll(messages);
  }

  public void clearPendingMessages() {
    this.pendingMessages.clear();
  }

  public boolean forceComplete(CompletionCallback callback) {
    if (this.request != null) {
      this.request.cancel();
      callback.onComplete(this.request);
      return true;
    }

    if (this.requestPool != null && !this.requestPool.isEmpty()) {
      for (ChannelRequest req : this.requestPool) {
        req.cancel();
        callback.onComplete(req);
      }
      return true;
    }

    return false;
  }

  public interface CompletionCallback {
    void onComplete(ChannelRequest request);
  }
}
