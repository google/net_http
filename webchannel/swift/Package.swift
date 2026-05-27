// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "WebChannel",
    platforms: [
        .macOS(.v10_15),
        .iOS(.v13),
        .tvOS(.v13),
        .watchOS(.v6)
    ],
    products: [
        .library(
            name: "WebChannel",
            targets: ["WebChannel"]
        ),
    ],
    targets: [
        .target(
            name: "WebChannel",
            dependencies: []
        ),
        .testTarget(
            name: "WebChannelTests",
            dependencies: ["WebChannel"]
        ),
    ]
)
