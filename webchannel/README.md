# WebChannel

WebChannel is a bidirectional communication protocol designed to provide reliable, full-duplex communication channels over HTTP.

This directory is the multi-language home for WebChannel client implementations.

## Directory Structure

- [java/](java/) - Java client implementation.
- [js/](js/) - Closure-independent TypeScript client implementation.
  - [imported_src/](js/imported_src/) - Imported source files from Closure Library.
  - [demo/](js/demo/) - WebChannel demo web application.
- [objc/](objc/) - Objective-C client implementation.
  - [imported_src/](objc/imported_src/) - Objective-C source files.
  - [demo/WebChanneliOSDemo/](objc/demo/WebChanneliOSDemo/) - SwiftUI iOS demo app for physical devices and simulators.
- [swift/](swift/) - Swift client implementation and CLI demo.

## Java Client (`webchannel/java`)

The Java implementation provides `WebChannelBase` and pluggable transport support via `BasicWebChannelSupport`.

## JavaScript Client (`webchannel/js`)

The active client is a Closure-independent TypeScript implementation in
`js/src/`, with native XHR and Fetch streaming support. The package distributes
ESM; both `import` and CommonJS `require()` use the same implementation on
Node 22.13+ (22.x) or 24+. See the [package README](js/README.md).
Build its distribution with tsdown using `npm run deps:install`
and `npm run build` in `js/`; `npm test` runs protocol comparisons against the
original bundle and local HTTP integration tests. The Vite demo builds a
complete static site into `js/demo/dist/`; see its [README](js/demo/README.md).

The Closure sources (`js/imported_src/`) also have a maintained, separate build:
`npm run deps:install --prefix legacy && npm run build:legacy` regenerates `js/dist/`. The
original bundle is archived under `js/test/fixtures/` for regression comparisons. See the
[JavaScript code map](js/CODE_MAP.md) for architecture, migration, build commands
and validation limits.

## Objective-C Client & iOS Demo (`webchannel/objc`)

The Objective-C implementation provides `WCWebChannelClient` for macOS and iOS.
An interactive SwiftUI iOS demo app is located in `objc/demo/WebChanneliOSDemo/`.
See the [2026-10-07 Lens benchmark run](benchmark/lens/2026-10-07_00-37-42_JST/report.md)
for the latest physical-device measurements and raw CSV files. [Earlier results](LENS_BENCHMARK_RESULTS.md)
remain available separately.

## Swift Client (`webchannel/swift`)

The Swift implementation provides `WebChannelClient` and a CLI demo in `swift/Sources/WebChannelDemo/`.
