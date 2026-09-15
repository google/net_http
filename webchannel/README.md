# WebChannel

WebChannel is a bidirectional communication protocol designed to provide reliable, full-duplex communication channels over HTTP.

This directory is the multi-language home for WebChannel client implementations.

## Directory Structure

- [js/](js/) - JavaScript client implementation (based on Closure Library).
  - [imported_src/](js/imported_src/) - Imported source files from Closure Library.
  - [demo/](js/demo/) - WebChannel demo web application.
- [objc/](objc/) - Objective-C client implementation.
  - [imported_src/](objc/imported_src/) - Objective-C source files.
  - [demo/WebChanneliOSDemo/](objc/demo/WebChanneliOSDemo/) - SwiftUI iOS demo app for physical devices and simulators.
- [swift/](swift/) - Swift client implementation and CLI demo.

## JavaScript Client (`webchannel/js`)

The JavaScript implementation of the WebChannel client is based on the Google Closure Library.

The raw imported source files are located in `js/imported_src/`.

## Objective-C Client & iOS Demo (`webchannel/objc`)

The Objective-C implementation provides `WCWebChannelClient` for macOS and iOS.
An interactive SwiftUI iOS demo app is located in `objc/demo/WebChanneliOSDemo/`.
Its [network failure testing guide](objc/demo/WebChanneliOSDemo/README.md#network-failure-testing)
documents reproducible on-device checks for loss of connectivity, network handoffs, and silent
packet drops, together with the current client timeout and retry baseline.

## Swift Client (`webchannel/swift`)

The Swift implementation provides `WebChannelClient` and a CLI demo in `swift/Sources/WebChannelDemo/`.
