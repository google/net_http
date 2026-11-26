/** Copyright The Closure Library Authors. SPDX-License-Identifier: Apache-2.0 */
import {notifyStatEvent, Stat} from './stats.js';

/** Diagnostics only: a failed channel is closed before this probe completes. */
export function testNetwork(url?: string): void {
  if (url) {
    const controller = new AbortController();
    let completed = false;
    const finish = (up: boolean): void => {
      if (completed) return;
      completed = true;
      clearTimeout(timer);
      notifyStatEvent(up ? Stat.ERROR_OTHER : Stat.ERROR_NETWORK);
    };
    const timer = setTimeout(() => {
      controller.abort();
      finish(false);
    }, 10_000);
    void fetch(url, {signal: controller.signal}).then(response => {
      void response.body?.cancel();
      finish(response.ok);
    }, () => finish(false));
  } else if (typeof Image !== 'undefined') {
    const image = new Image();
    const finish = (up: boolean): void => {
      image.onload = image.onerror = image.onabort = null;
      clearTimeout(timer);
      notifyStatEvent(up ? Stat.ERROR_OTHER : Stat.ERROR_NETWORK);
    };
    const timer = setTimeout(() => finish(false), 10_000);
    image.onload = () => finish(true);
    image.onerror = image.onabort = () => finish(false);
    image.src = 'https://www.google.com/images/cleardot.gif?zx=' + Math.random().toString(36).slice(2);
  } else {
    notifyStatEvent(Stat.ERROR_NETWORK);
  }
}
