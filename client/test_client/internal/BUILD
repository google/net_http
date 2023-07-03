# Description: a lightweight http client

package(default_visibility = [
    "//net_http:__subpackages__",
])

licenses(["notice"])

cc_library(
    name = "evhttp_client",
    srcs = [
        "evhttp_connection.cc",
    ],
    hdrs = [
        "evhttp_connection.h",
    ],
    deps = [
        "//client/test_client/public:http_client_api",
        "//internal:net_logging",
        "//public:shared_files",
        "//server/public:http_server_api",
        "@com_github_libevent_libevent//:libevent",
        "@com_google_absl//absl/strings",
        "@com_google_absl//absl/synchronization",
    ],
)
