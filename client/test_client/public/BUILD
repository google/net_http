# Description: APIs for experimental testing of net_http server instances

package(default_visibility = [
    ":http_client_users",
    "//net_http:__subpackages__",
])

package_group(
    name = "http_client_users",
    packages = ["//..."],
)

licenses(["notice"])

cc_library(
    name = "http_client_api",
    srcs = [],
    hdrs = [
        "httpclient_interface.h",
    ],
    deps = [
        "//public:shared_files",
        "//server/public:http_server_api",
    ],
)

cc_library(
    name = "http_client",
    hdrs = [
        "httpclient.h",
    ],
    deps = [
        ":http_client_api",
        "//client/test_client/internal:evhttp_client",
        "@com_google_absl//absl/memory",
    ],
)
