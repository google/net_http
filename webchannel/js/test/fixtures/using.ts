import {EventTarget, WebChannel} from '../../lib/index.js';

// Compile against the published declarations with only ES2022 + DOM libraries.
export function asDisposable(target: EventTarget): Disposable {
  return target;
}

export function scoped(channel: WebChannel, fail = false): void {
  using resource = channel;
  resource.send({message: 'scoped'});
  if (fail) throw new Error('scope failed');
}
