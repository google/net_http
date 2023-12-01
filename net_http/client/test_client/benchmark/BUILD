# Description: net_http/client/test_client/testing

package(default_visibility = ["//visibility:private"])

licenses(["notice"])

cc_binary(
    name = "evhttp_echo_client",
    srcs = ["evhttp_echo_client.cc"],
    deps = [
        "//net_http/client/test_client/internal:evhttp_client",
    ],
)
cc_binary(
    name = "my_benchmark",
    srcs = ["evhttp_echo_client_benchmark.cc"],  # Replace with your benchmark source file
    deps = [
        "@com_github_google_benchmark//:benchmark",
        # Add other dependencies your benchmark might have
    ],
    copts = ["-Iexternal/com_github_google_benchmark/include"],
)
