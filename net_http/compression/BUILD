# Description: compression support libraries

package(default_visibility = [
    "//net_http:__subpackages__",
])

licenses(["notice"])

# C++ lib based on zlib for gzip support
cc_library(
    name = "gzip_zlib",
    srcs = [
        "gzip_zlib.cc",
    ],
    hdrs = [
        "gzip_zlib.h",
    ],
    deps = [
        "//net_http/internal:net_logging",
        "@com_google_absl//absl/base",
        "@com_google_absl//absl/base:core_headers",
        "@com_google_absl//absl/strings",
        "@zlib",
    ],
)

cc_test(
    name = "gzip_zlib_test",
    size = "large",
    srcs = ["gzip_zlib_test.cc"],
    deps = [
        ":gzip_zlib",
        # "//core/test_util:test_main",
        "@com_google_googletest//:gtest_main",
        "@com_google_absl//absl/strings",
        # "@com_google_googletest//:gtest",
    ],
)
