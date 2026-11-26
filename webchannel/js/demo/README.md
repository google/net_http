# WebChannel demo

This Vite application uses the Closure-independent TypeScript client in
`../src/`. It connects directly to the selected generator, echo or custom
WebChannel endpoint. No local application backend is needed.

```sh
cd webchannel/js/demo
npm run deps:install
npm run dev
```

Open `http://localhost:9000/`. `npm start` is an alias for the Vite development
server. Changes to the demo and client source are rebuilt during development.

To generate the static site:

```sh
npm run build
npm run preview
```

The complete deployable site is **the contents of `dist/`**:

```text
dist/
  index.html
  assets/
    index-<hash>.js
```

Copy that directory's contents to any static HTTP(S) hosting service. Asset
references are relative, so the same output works at `/` or under a path such
as `/webchannel/message_generator/`. Retain the `assets/` layout. Deploy the
built `dist/index.html`, which references the generated assets; the source
`index.html` is Vite's build input and references TypeScript. Preview is only a
local check of the built site, not a production server or a `file://` workflow.
The selected WebChannel server must allow browser access from the site's origin.

The output is generated locally and ignored by version control. A clean build
replaces stale output. The repository's GitHub Pages workflow builds this site
and places its contents under `/webchannel/message_generator/`.

The old `dist/demo.js` is preserved unchanged as
[`../test/fixtures/legacy-demo/demo.js`](../test/fixtures/legacy-demo/demo.js).
It combines the historical Closure library with an earlier browser demo; its
source labels name `../dist/webchannel_blob_es2022.js` and `demo.ts`. It was an
ignored leftover: even before the TypeScript migration, the checked-in HTML
and build command already used `dist/message_generator.js` instead.
That later esbuild output was also superseded by Vite. The archive is outside
the build output, so future builds preserve it. Its
[reference README](../test/fixtures/legacy-demo/README.md) records provenance,
size/hash and limitations; use the current `dist/` site for deployment.

The browser target remains Chrome/Edge 111+, Firefox 114+ and Safari/iOS 16.4+.
Vite is installed only in this demo package. Library distribution uses tsdown
from the parent directory and emits ESM and declarations into `../lib/`.

The demo's Connect → Send Message → five replies flow was manually confirmed
by the user on Chrome 158.0.8127.37 / Windows 11. The exact environment and
scope are recorded in [browser validation](VALIDATION.md). Six additional
Playwright/Chromium scenarios passed, including long polling, map messages,
disconnect/reconnect, Echo and the built static demo.

## Optional browser smoke test

[`browser-smoke.mjs`](browser-smoke.mjs) reruns those six scenarios using
headless Chromium. It starts and stops Vite on free loopback ports and rebuilds
`dist/` to test the static site. It contacts the public Google sandbox, so it
requires network access and the service to be available. It is opt-in and is
not part of the library's `npm test` or CI.

Install Playwright separately, outside this checkout. Version 1.65.0 was used
for the original checks and met the 14-day release delay. With npm 11.17+:

```sh
PLAYWRIGHT_TOOLS=/absolute/path/to/playwright-tools
npm install --prefix "$PLAYWRIGHT_TOOLS" --save-exact --min-release-age=14 --ignore-scripts playwright@1.65.0
npm audit --prefix "$PLAYWRIGHT_TOOLS"
npm audit signatures --prefix "$PLAYWRIGHT_TOOLS"
node "$PLAYWRIGHT_TOOLS/node_modules/playwright/cli.js" install chromium --only-shell
```

Use a fresh tooling directory for this setup; an existing lockfile can bypass
npm's release delay. Review audit/signature failures before running the tool.
The browser also needs Playwright's platform-specific Chromium system libraries.
Playwright remains outside the library/demo dependency trees.

After installing the demo's dependencies with `npm run deps:install`, run from
this directory:

```sh
npm run test:browser -- --playwright "$PLAYWRIGHT_TOOLS/node_modules/playwright/index.mjs"
```

`--playwright` accepts an absolute or working-directory-relative module path;
it can be omitted if Node can already resolve `playwright`. Standard Playwright
settings such as `PLAYWRIGHT_BROWSERS_PATH` apply. Each scenario rejects console
and page errors. Results and failure diagnostics go to the terminal, with a
nonzero exit status on failure; no screenshots, traces or result files are
written. Browser coverage remains Chromium only, with the limits described in
[browser validation](VALIDATION.md).


Use npm 11.17+ for the shared dependency policy. This project applies a 14-day
release delay, checks every locked dependency before installation, and rejects
unreviewed install scripts. See the [dependency policy](../DEPENDENCY_POLICY.md)
for the audit, the denied optional fsevents hook and update instructions.
