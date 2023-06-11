# Description: implementations of HTTP Server

package(default_visibility = [
    "//net_http:__subpackages__",
])

licenses(["notice"])

cc_library(
    name = "evhttp_server",
    srcs = [
        "evhttp_request.cc",
        "evhttp_server.cc",
    ],
    hdrs = [
        "evhttp_request.h",
        "evhttp_server.h",
        "server_support.h",
    ],
    deps = [
        "//net_http/compression:gzip_zlib",
        "//net_http/internal:net_logging",
        "//net_http/public:shared_files",
        "//net_http/server/public:http_server_api",
        "@com_github_libevent_libevent//:libevent",
        "@com_google_absl//absl/base",
        "@com_google_absl//absl/base:core_headers",
        "@com_google_absl//absl/memory",
        "@com_google_absl//absl/strings",
        "@com_google_absl//absl/synchronization",
        "@com_google_absl//absl/types:span",
        "@zlib",
    ],
)

cc_test(
    name = "evhttp_server_test",
    size = "medium",
    srcs = ["evhttp_server_test.cc"],
    features = ["-layering_check"],
    deps = [
        ":evhttp_server",
        "//tensorflow_serving/core/test_util:test_main",
        "//net_http/client/test_client/internal:evhttp_client",
        "//net_http/internal:fixed_thread_pool",
        "//net_http/server/public:http_server",
        "//net_http/server/public:http_server_api",
        "@com_google_absl//absl/memory",
        "@com_google_absl//absl/synchronization",
    ],
)

cc_test(
    name = "evhttp_request_test",
    size = "medium",
    srcs = ["evhttp_request_test.cc"],
    features = ["-layering_check"],
    deps = [
        ":evhttp_server",
        "//tensorflow_serving/core/test_util:test_main",
        "//net_http/client/test_client/internal:evhttp_client",
        "//net_http/compression:gzip_zlib",
        "//net_http/internal:fixed_thread_pool",
        "//net_http/server/public:http_server",
        "//net_http/server/public:http_server_api",
        "@com_google_absl//absl/memory",
    ],
)
