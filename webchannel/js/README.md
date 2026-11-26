# WebChannel JavaScript / TypeScript client

A Closure-independent WebChannel v8 client with native XMLHttpRequest and Fetch
streaming transports, generated TypeScript declarations and no runtime npm
dependencies.

The package distributes ES modules only. ESM `import` and CommonJS `require()`
resolve to the same implementation, classes and shared statistics event target.
CommonJS use relies on Node's synchronous ESM loading; supported Node versions
are 22.13+ on the 22.x line and 24+. No separate CommonJS bundle is shipped.

```js
// ESM
import {createWebChannelTransport, WebChannel} from 'webchannel-js';
```

```js
// CommonJS on a supported Node version
const {createWebChannelTransport, WebChannel} = require('webchannel-js');
```

```js
const channel = createWebChannelTransport().createWebChannel('/channel', {
  sendRawJson: true,
});
channel.listen(WebChannel.EventType.MESSAGE, event => console.log(event.data));
channel.open();
channel.send({message: 'hello'});
// Call channel.close() or channel.dispose() when finished.
```

The default transport uses the browser's XMLHttpRequest. In Node, use an
absolute endpoint URL and set `useFetchStreams: true` to use native Fetch.
The browser support target is Chrome/Edge 111+, Firefox 114+ and Safari/iOS
16.4+. The JavaScript syntax target is ES2022. These are support targets, not
certification of every minimum-version browser engine.

The package preserves an existing `Symbol.dispose` and installs that symbol
when absent, so channels also support TypeScript's `using` cleanup protocol.
No general-purpose polyfills are included. TypeScript consumers can use
`module: "nodenext"` or `"node20"` for Node, or a bundler configuration for
browser applications. Older Node-oriented TypeScript module modes may reject
CommonJS imports of ESM even when the installed Node can load them.

In the repository, use Node `^22.18.0 || ^24.11.0 || >=26.0.0` for the build
tools (a stronger requirement than the generated package runtime) and npm
11.17+. Run `npm run deps:install`,
`npm run build`, `npm run typecheck` and `npm test`. The build uses tsdown,
while type checking runs separately with tsc. `npm pack` rebuilds the package
before producing its archive.
`lib/` contains ESM modules, declarations and source/declaration maps; `src/` is
included for source navigation. Only the package root and `package.json` are
public package exports.

The separate Closure build writes `dist/`. The original Closure bundle is
preserved unchanged in `test/fixtures/webchannel_blob_original.js` as a
historical reference for regression comparisons. Neither Closure bundle is
part of this package's published files. See [CODE_MAP.md](CODE_MAP.md) in the
repository for the implementation map and validation limits.

The browser demo uses Vite. Run `npm run deps:install` in `demo/`, then
`npm run dev` for
development or `npm run build` for a complete static site in `demo/dist/`.
Copy that directory's contents to static hosting; its HTML references relative
hashed assets and can be deployed under a subdirectory. See the
[demo README](demo/README.md) in the repository.


Development dependencies have a 14-day release-age delay and strict
install-script review. `npm run deps:install` checks the complete lockfile before
installation; `npm run deps:check` runs that check alone. Bare `npm ci` does not
retroactively enforce release age on already locked versions. See the
[dependency policy and audit](DEPENDENCY_POLICY.md) in the repository.
