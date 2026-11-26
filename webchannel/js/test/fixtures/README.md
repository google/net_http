# Historical Closure references

## Original standalone library

`webchannel_blob_original.js` is the unchanged bundle originally checked in as
`webchannel/js/dist/webchannel_blob_es2022.js` by commit
`5d0557ab21fb37bc88ddb8f8a1d516d499e216a4` (PR #72). It is retained as the
independent comparison baseline for the TypeScript port and maintained Closure
build. Do not regenerate it with `compile.js`.

Size: 485,922 bytes. SHA-256:
`144ec39824deaff05576bc489c646fa2fba9a3a3637152736f9ef2ddd4974528`.

The maintained Closure output lives in `dist/`; the normal package build emits
the TypeScript implementation to `lib/`.

## Original browser demo

[`legacy-demo/demo.js`](legacy-demo/demo.js) preserves the old ignored
`demo/dist/demo.js` unchanged, including its embedded Closure implementation
and browser UI. It is a historical reference, not an active test input or a
current build. Its [README](legacy-demo/README.md) records its source labels,
original path, size/hash, and relationship to the current Vite demo.
