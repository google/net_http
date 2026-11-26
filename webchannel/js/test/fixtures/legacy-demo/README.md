# Historical Closure-based browser demo

`demo.js` is an unchanged copy of the ignored file originally found at
`webchannel/js/demo/dist/demo.js` in this checkout. It was saved before Vite
cleaned that output directory on 2026-11-26, and is now retained here as a
historical reference. Do not regenerate or overwrite this snapshot.

Size: **553,444 bytes**. SHA-256:
`2071c4340dfa816f565358bd56c45ed0066450b6e3b78569fcef10252392733a`.

## What it contains

This is an esbuild-style browser IIFE, combining two pieces:

- A bundled Closure WebChannel implementation. The embedded-module comment
  names `../dist/webchannel_blob_es2022.js`, and a CommonJS adapter loads it
  into the browser bundle. This is the old Closure implementation, including
  its compiler helpers, not the Closure-independent TypeScript port.
- A demo application whose source-section comment is `demo.ts`. It connects
  the endpoint/options controls, connection status, send/clear buttons and
  logs to that implementation. DOM lookups include `endpoint`, `connect`,
  `send`, `log` and `status-badge`.

It is a complete browser application script with its client embedded, not the
standalone library, a source module or the current package's distribution.
The wrapper and source labels identify its contents; the exact esbuild version,
invocation and originating source commit are not established. There is no
source map in this snapshot. Its original filesystem modification time was
2026-08-20 UTC, which is metadata rather than proof of its build date.

## Relationship to the other artifacts

| Artifact | Purpose |
| --- | --- |
| `../webchannel_blob_original.js` | Original standalone Closure library, used by compatibility tests |
| `demo.js` here | Old browser demo with that generation of Closure implementation embedded; historical reference only |
| `../../../demo/message_generator.ts` | Maintained demo source, importing the new TypeScript client |
| `../../../demo/dist/` | Current Vite-built deployable static site: HTML and hashed assets |
| `../../../lib/` | Current tsdown-built ESM library distribution |

At the start of the TypeScript migration, the checked-in demo package and HTML
already built/referenced `dist/message_generator.js`, not `dist/demo.js`.
The latter was therefore a leftover from an earlier build in this checkout.
The more recent `message_generator.js` was also superseded when the demo moved
to Vite.

This archive is outside all generated output directories and is excluded from
the npm package by its `files` allowlist. No active HTML, workflow or test
imports it. The protocol comparison tests use the standalone library snapshot
instead. The archived script expects browser DOM elements, and matching
historical HTML was not recovered or reconstructed; it is not a runnable
standalone site or a deploy target. Use the current demo's Vite build to deploy.
