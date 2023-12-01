workspace(name="net_http")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "new_git_repository")

# ===== Abseil dependency =====
http_archive(
    name = "com_google_absl",
    sha256 = "8eeec9382fc0338ef5c60053f3a4b0e0708361375fe51c9e65d0ce46ccfe55a7",
    urls = ["https://github.com/abseil/abseil-cpp/archive/b971ac5250ea8de900eae9f95e06548d14cd95fe.tar.gz"],
    strip_prefix = "abseil-cpp-b971ac5250ea8de900eae9f95e06548d14cd95fe",
)

# ===== Google Test dependency =====
http_archive(
    name = "com_google_googletest",
    sha256 = "1f357c27ca988c3f7c6b4bf68a9395005ac6761f034046e9dde0896e3aba00e4",
    urls = ["https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip"],
    strip_prefix = "googletest-1.14.0",
)
# ===== Bazel skylib dependency =====
http_archive(
    name = "bazel_skylib",
    sha256 = "74d544d96f4a5bb630d465ca8bbcfe231e3594e5aae57e1edbf17a6eb3ca2506",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.3.0/bazel-skylib-1.3.0.tar.gz",
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.3.0/bazel-skylib-1.3.0.tar.gz",
    ],
)

# ===== Bazel package rules dependency =====
http_archive(
    name = "rules_pkg",
    sha256 = "451e08a4d78988c06fa3f9306ec813b836b1d076d0f055595444ba4ff22b867f",
    url = "https://github.com/bazelbuild/rules_pkg/releases/download/0.7.1/rules_pkg-0.7.1.tar.gz",
)

# ===== libevent (libevent.org) dependency =====
http_archive(
    name = "com_github_libevent_libevent",
    url = "https://github.com/libevent/libevent/archive/refs/tags/release-2.2.1-alpha.zip",
    strip_prefix = "libevent-release-2.2.1-alpha",
    patches = ["@//third_party/libevent:buf_event.patch"],
    patch_args = ["-p1"],
    build_file = "@//third_party/libevent:BUILD",
)


http_archive(
    name = "com_google_protobuf",
    sha256 = "a79d19dcdf9139fa4b81206e318e33d245c4c9da1ffed21c87288ed4380426f9",
    strip_prefix = "protobuf-3.11.4",
    # latest, as of 2020-02-21
    urls = [
        "https://mirror.bazel.build/github.com/protocolbuffers/protobuf/archive/v3.11.4.tar.gz",
        "https://github.com/protocolbuffers/protobuf/archive/v3.11.4.tar.gz",
    ],
)

http_archive(
    name = "zlib",
    build_file = "@com_google_protobuf//:third_party/zlib.BUILD",
    sha256 = "c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1",
    strip_prefix = "zlib-1.2.11",
    urls = [
        "https://mirror.bazel.build/zlib.net/zlib-1.2.11.tar.gz",
        "https://zlib.net/zlib-1.2.11.tar.gz",
    ],
)

http_archive(
    name = "com_github_google_benchmark",
    strip_prefix = "benchmark-1.6.0",
    sha256 = "1f71c72ce08d2c1310011ea6436b31e39ccab8c2db94186d26657d41747c85d6",
    url = "https://github.com/google/benchmark/archive/v1.6.0.tar.gz"
)

