package com.google.net.webchannel.client.support.basic;

import com.google.common.base.Preconditions;
import com.google.common.flogger.GoogleLogger;
import com.google.net.webchannel.client.xplat.Support.Debugger;

/**
 * Implementation of WebChannel Debugger interface.
 *
 * <p>Light wrapper around GoogleLogger to match the WebChannel Support API.
 */
public class BasicWebChannelSupportDebugger extends Debugger {
  static final GoogleLogger logger = GoogleLogger.forEnclosingClass();

  @Override
  public void debug(String text) {
    logger.atFine().log("%s", text);
  }

  @Override
  public void info(String text) {
    logger.atInfo().log("%s", text);
  }

  @Override
  public void warning(String text) {
    logger.atWarning().log("%s", text);
  }

  @Override
  public void dumpException(Exception ex, String msg) {
    logger.atSevere().withCause(ex).log("Exception with message: %s", msg);
  }

  @Override
  public void severe(String text) {
    logger.atSevere().log("%s", text);
  }

  @Override
  public void assertCondition(boolean condition, String text) {
    Preconditions.checkState(condition, text);
  }
}
