package com.google.net.webchannel.client.support.basic;

import com.google.common.base.Preconditions;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import com.google.errorprone.annotations.concurrent.GuardedBy;
import com.google.net.webchannel.client.AsyncWebChannel;
import com.google.net.webchannel.client.WebChannel;
import com.google.net.webchannel.client.WebChannelOptions;
import com.google.net.webchannel.client.WebChannelRuntimeProperties;
import com.google.net.webchannel.client.WebChannelTransport;
import com.google.net.webchannel.client.xplat.WebChannelTransports;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import javax.annotation.Nonnull;
import javax.annotation.concurrent.ThreadSafe;
import org.jspecify.annotations.Nullable;

/**
 * WebChannel Transport for creating native thread-safe Java WebChannels.
 *
 * <p>WebChannels created by the same transport instance use two shared executors. One single
 * threaded {@code apiThreadExecutor} for asynchronous API calls, handler, and internal callback
 * calls. The other unbounded cached {@code networkExecutor} for handling blocking network traffic.
 * As a result, clients are likely to get <i>O(n)</i> threads for <i>n</i> active channels. The
 * inactive threads are evicted when unused for some time. You can explicitly force freeing any
 * resources (i.e., all the threads from the executors) by calling the shutdown method. Note however
 * that any active channels created by the shut down Transport would be broken.
 *
 * <p>To ensure isolation of WebChannels, you can use one transport per channel or group of channels
 * that need to be isolated.
 *
 * <p>Use the following code to open a thread-safe {@link AsyncWebChannel} instance:
 *
 * <pre>
 * WebChannelTransport transport = WebChannelTransport.createBasicWebChannelTransport();
 * AsyncWebChannel channel =
 *     transport.createAsyncWebChannel(
 *         "http://my.service.google.com/channel", new WebChannelOptions.Builder().build());
 * channel.setChannelHandler(myHandler);
 * channel.open();
 * </pre>
 *
 * <p>Note that the resulting AsyncWebChannel enforces method call sequencing, i.e., the channel
 * handler can only be set before the channel open() call and the open() call must be made before
 * send() and close() calls. Violation results in a runtime exception.
 *
 * <p>Only Asynchronous WebChannels are supported by this transport.
 */
@ThreadSafe
public final class BasicWebChannelTransport extends WebChannelTransport {
  private static final AtomicLong instanceCounter = new AtomicLong();

  /** For handling asynchronous API calls, handler, and internal callback calls, e.g., timers. */
  private final ScheduledExecutorService apiThreadExecutor;

  /** For handling any (potentially blocking) network traffic. */
  private final ExecutorService networkExecutor;

  /** Flags a transport that has been shut down to free resources and cannot create new channels. */
  private final AtomicBoolean shutdown = new AtomicBoolean(false);

  private BasicWebChannelTransport() {
    long index = instanceCounter.getAndIncrement();
    // TODO(seryondr): If we end up creating many short-lived Transports and thus many of these
    // executors, we may consider reusing them in some way. Similarly, there is a risk of reusing
    // the same single-thread apiThreadExecutor for all the channels. One option would be to keep
    // track of the channels created by the transport and return the executor to a pool when all its
    // channels are closed. However, this sounds like a lot of complication for an uncertain
    // benefit. Let's not optimize too heavily at this point though.
    apiThreadExecutor =
        Executors.newScheduledThreadPool(
            1,
            new ThreadFactoryBuilder()
                .setNameFormat(
                    String.format(Locale.US, "webchannel-transport-%d-api-thread", index))
                .build());
    networkExecutor =
        Executors.newCachedThreadPool(
            new ThreadFactoryBuilder()
                .setNameFormat(
                    String.format(Locale.US, "webchannel-transport-%d-network-%%d", index))
                .build());
  }

  /**
   * Factory method to be used for creating instances of BasicWebChannelTransport.
   *
   * @return Reusable transport, i.e., a factory for creating {@link AsyncWebChannel} instances.
   */
  public static BasicWebChannelTransport createTransport() {
    return new BasicWebChannelTransport();
  }

  @Override
  public WebChannel createWebChannel(String urlPath, WebChannelOptions options) {
    throw new UnsupportedOperationException(
        "The basic implementation only supports the async webchannel client API.");
  }

  @Override
  public AsyncWebChannel createAsyncWebChannel(String urlPath, WebChannelOptions options) {
    Preconditions.checkNotNull(urlPath);
    Preconditions.checkNotNull(options);
    Preconditions.checkState(!shutdown.get(), "Cannot create channels from a shut down Transport");
    BasicWebChannelSupport support = new BasicWebChannelSupport(apiThreadExecutor, networkExecutor);
    WebChannelTransport transport = WebChannelTransports.createTransport(support);
    return new ThreadSafeWebChannelWrapper(transport.createAsyncWebChannel(urlPath, options));
  }

  /**
   * Free all transport's resources.
   *
   * <p>Calling this method is optional and is only meant as an optimization for apps that create a
   * lot of short-lived transports and suffer from having too many threads until they are eventually
   * garbage collected.
   *
   * <p>Be careful when calling this method. No new channels can be created by the transport after
   * it has been shut down and any still active channels created by it will be broken.
   */
  public void shutdown() {
    Preconditions.checkState(!shutdown.getAndSet(true), "Duplicit Transport shutdown");
    apiThreadExecutor.shutdown();
    networkExecutor.shutdown();
  }

  /**
   * Wraps an AsyncWebChannel implementation of WebChannelBaseTransport so that it runs all the code
   * in the given {@code apiThreadExecutor}.
   */
  @ThreadSafe
  private class ThreadSafeWebChannelWrapper implements AsyncWebChannel {
    private final AsyncWebChannel delegate;
    private final Object lock = new Object();

    @GuardedBy("lock")
    private boolean openned = false;

    @GuardedBy("lock")
    private boolean closed = false;

    private ThreadSafeWebChannelWrapper(AsyncWebChannel delegate) {
      Preconditions.checkNotNull(delegate);
      this.delegate = delegate;
    }

    @Override
    public void open() {
      synchronized (lock) {
        Preconditions.checkState(!openned, "Channel open() called twice");
        openned = true;
        apiThreadExecutor.execute(() -> delegate.open());
      }
    }

    // Incompatible parameter type.
    @SuppressWarnings("nullness:override.param")
    @Override
    public <T> void send(@Nonnull T message) throws IllegalArgumentException {
      Preconditions.checkNotNull(message);
      synchronized (lock) {
        Preconditions.checkState(openned && !closed, "Channel send() called before open()");
        apiThreadExecutor.execute(() -> delegate.send(message));
      }
    }

    @Override
    public void close() {
      synchronized (lock) {
        Preconditions.checkState(openned && !closed, "Channel close() called before open()");
        closed = true;
        apiThreadExecutor.execute(() -> delegate.close());
      }
    }

    @Override
    public WebChannelRuntimeProperties getRuntimeProperties() {
      synchronized (lock) {
        return delegate.getRuntimeProperties();
      }
    }

    @Override
    public void setChannelHandler(@Nullable EventHandler eventHandler) {
      Preconditions.checkNotNull(eventHandler);
      synchronized (lock) {
        Preconditions.checkState(!openned, "Channel handler modified after calling open()");
        delegate.setChannelHandler(eventHandler);
      }
    }
  }
}
