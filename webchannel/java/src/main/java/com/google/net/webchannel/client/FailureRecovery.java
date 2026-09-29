package com.google.net.webchannel.client;

import java.io.Closeable;

/**
 * This interface defines a pluggable API to allow WebChannel runtime to support
 * customized algorithms in order to recover from transient failures such as
 * those failures caused by network or proxies (intermediaries).
 *
 * See the JS API for the full spec.
 *
 * Implementations need follow the general contract for Support interfaces: purely async;
 * single-threaded execution for a given channel instance.
 */
public interface FailureRecovery extends Closeable {

  /**
   * Enum to indicate the current recovery state.
   */
  enum State {
    INIT,
    FAILED,
    RECOVERING,
    CLOSED
  }

  /**
   * Enum to indicate different failure conditions as detected by the webchannel runtime.
   */
  enum FailureCondition {
    /**
     * The HTTP response returned a non-successful http status code.
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
     * Exception was thrown while processing the request/response.
     */
    EXCEPTION

    // more to be added
  }

  /**
   * Callback to the runtime to issue a recovery operation, e.g. a new request.
   */
  interface RecoveryOperation {

    /**
     * Signals to the WebChannel runtime to issue a recovery operation.
     */
    void recover();
  }

  /**
   * @return the current state
   */
  State getState();

  /**
   * @return the updated state
   */
  State setFailure(FailureCondition failure, RecoveryOperation operation);

  /**
   * Once the instance is closed, any access to the instance will be a no-op (without IOE).
   *
   * @override
   */
  @Override
  void close();
}
