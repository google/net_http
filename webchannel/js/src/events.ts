/// <reference lib="esnext.disposable" preserve="true" />
/** Copyright The Closure Library Authors. SPDX-License-Identifier: Apache-2.0 */

// Share the disposal key with native and downleveled `using` consumers. This is
// the one targeted polyfill retained from Closure; preserve any existing key.
if (Symbol.dispose === undefined) {
  Object.defineProperty(Symbol, 'dispose', {
    value: Symbol('Symbol.dispose'), configurable: true, writable: true,
  });
}
export class ChannelEvent<T extends string = string> {
  target: unknown = null;
  currentTarget: unknown = null;
  defaultPrevented = false;
  propagationStopped = false;
  constructor(readonly type: T) {}
  preventDefault(): void { this.defaultPrevented = true; }
  stopPropagation(): void { this.propagationStopped = true; }
}

export type Listener<E> = (event: E) => unknown;
type EventFor<E, T> = Extract<E, {type: T}> extends never ? E : Extract<E, {type: T}>;
export interface ListenerKey<E> {
  readonly type: string;
  readonly listener: Listener<E>;
  readonly scope: unknown;
  once: boolean;
  removed: boolean;
}

/** Small local event dispatcher retaining the commonly used Closure listen API. */
export class EventTarget<E extends ChannelEvent = ChannelEvent> implements Disposable {
  private readonly listeners = new Map<string, ListenerKey<E>[]>();
  private disposed = false;

  listen<T extends string | number>(type: T, listener: Listener<EventFor<E, T>>, _capture = false,
         scope?: unknown): ListenerKey<E> {
    return this.add(String(type), listener as Listener<E>, false, scope);
  }
  listenOnce<T extends string | number>(type: T, listener: Listener<EventFor<E, T>>, _capture = false,
             scope?: unknown): ListenerKey<E> {
    return this.add(String(type), listener as Listener<E>, true, scope);
  }
  private add(type: string, listener: Listener<E>, once: boolean,
              scope: unknown): ListenerKey<E> {
    const entries = this.listeners.get(type) ?? [];
    const existing = entries.find(e => e.listener === listener && e.scope === scope);
    if (existing) {
      if (!once) existing.once = false;
      return existing;
    }
    const key = {type, listener, scope, once, removed: this.disposed};
    if (!this.disposed) {
      entries.push(key);
      this.listeners.set(type, entries);
    }
    return key;
  }
  unlisten<T extends string | number>(type: T, listener: Listener<EventFor<E, T>>, _capture = false,
           scope?: unknown): boolean {
    const entry = this.listeners.get(String(type))?.find(
      e => e.listener === listener && e.scope === scope);
    return entry ? this.unlistenByKey(entry) : false;
  }
  unlistenByKey(key: ListenerKey<E>): boolean {
    const entries = this.listeners.get(key.type);
    const index = entries?.indexOf(key) ?? -1;
    if (!entries || index === -1) return false;
    key.removed = true;
    entries.splice(index, 1);
    if (entries.length === 0) this.listeners.delete(key.type);
    return true;
  }
  addEventListener<T extends string>(type: T, listener: Listener<EventFor<E, T>>): void {
    this.listen(type, listener);
  }
  removeEventListener<T extends string>(type: T, listener: Listener<EventFor<E, T>>): void {
    this.unlisten(type, listener);
  }
  removeAllListeners(type?: string): number {
    let count = 0;
    for (const [name, entries] of this.listeners) {
      if (type !== undefined && name !== type) continue;
      for (const entry of entries) entry.removed = true;
      count += entries.length;
      this.listeners.delete(name);
    }
    return count;
  }
  dispatchEvent(event: E): boolean {
    if (this.disposed) return true;
    event.target ??= this;
    event.currentTarget = this;
    let accepted = true;
    for (const entry of [...(this.listeners.get(event.type) ?? [])]) {
      if (entry.removed) continue;
      if (entry.once) this.unlistenByKey(entry);
      if (entry.listener.call(entry.scope ?? this, event) === false) accepted = false;
    }
    return accepted && !event.defaultPrevented;
  }
  isDisposed(): boolean { return this.disposed; }
  [Symbol.dispose](): void {
    // Dispatch virtually so WebChannel also cancels its network requests.
    this.dispose();
  }
  dispose(): void {
    this.disposed = true;
    this.removeAllListeners();
  }
}
