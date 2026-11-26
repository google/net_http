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
scope are recorded in [manual browser validation](VALIDATION.md).


Use npm 11.17+ for the shared dependency policy. This project applies a 14-day
release delay, checks every locked dependency before installation, and rejects
unreviewed install scripts. See the [dependency policy](../DEPENDENCY_POLICY.md)
for the audit, the denied optional fsevents hook and update instructions.
