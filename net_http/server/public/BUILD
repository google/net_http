# Description: a lightweight http server and related utils to support Web clients

package(default_visibility = ["//visibility:public",])

licenses(["notice"])

cc_library(
    name = "http_server_api",
    hdrs = [
        "httpserver_interface.h",
        "server_request_interface.h",
    ],
    deps = [
        "//net_http/public:shared_files",
        "@com_google_absl//absl/strings",
        "@com_google_absl//absl/time",
    ],
)

cc_library(
    name = "http_server",
    hdrs = [
        "httpserver.h",
    ],
    deps = [
        ":http_server_api",
        "//net_http/server/internal:evhttp_server",
        "@com_google_absl//absl/memory",
    ],
)
