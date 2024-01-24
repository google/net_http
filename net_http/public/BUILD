# Description: shared files

package(default_visibility = ["//visibility:public",])

package_group(
    name = "http_server_clients",
    packages = ["//..."],
)

licenses(["notice"])

# C++ lib based on zlib for gzip support
cc_library(
    name = "shared_files",
    srcs = [
        "header_names.cc",
    ],
    hdrs = [
        "header_names.h",
        "response_code_enum.h",
    ],
)
