# Description: shared code for net_http

package(default_visibility = [
    "//net_http:__subpackages__",
])

licenses(["notice"])

cc_library(
    name = "fixed_thread_pool",
    testonly = 1,
    hdrs = ["fixed_thread_pool.h"],
    deps = [
        "@com_google_absl//absl/base:core_headers",
        "@com_google_absl//absl/synchronization",
    ],
)

cc_library(
    name = "net_logging",
    srcs = ["net_logging.cc"],
    hdrs = ["net_logging.h"],
    deps = [
        "@com_google_absl//absl/base:config",
        "@com_google_absl//absl/base:core_headers",
        "@com_google_absl//absl/base:log_severity",
    ],
)
