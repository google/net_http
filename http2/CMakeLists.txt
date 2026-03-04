cmake_minimum_required(VERSION 3.15)
project(http2_echo_server)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

set(FETCHCONTENT_QUIET OFF)

# Abseil
set(ABSL_ENABLE_INSTALL OFF CACHE BOOL "" FORCE)
set(ABSL_PROPAGATE_CXX_STD ON)

# Protobuf
set(protobuf_INSTALL OFF CACHE BOOL "" FORCE)
set(protobuf_BUILD_TESTS OFF CACHE BOOL "Disable protobuf tests" FORCE)
set(protobuf_WITH_ZLIB OFF CACHE BOOL "Disable protobuf zlib" FORCE)

# gRPC
set(gRPC_ABSL_PROVIDER "module" CACHE STRING "" FORCE)
set(gRPC_CARES_PROVIDER "module" CACHE STRING "" FORCE)
set(gRPC_PROTOBUF_PROVIDER "module" CACHE STRING "" FORCE)
set(gRPC_RE2_PROVIDER "module" CACHE STRING "" FORCE)
set(gRPC_SSL_PROVIDER "module" CACHE STRING "" FORCE)
set(gRPC_ZLIB_PROVIDER "module" CACHE STRING "" FORCE)
set(gRPC_BUILD_HAS_SYSTEMD OFF)

# To avoid issues with conflicts, we will use Abseil and protobuf from gRPC.
FetchContent_Declare(
  grpc
  GIT_REPOSITORY https://github.com/grpc/grpc.git
  GIT_TAG        v1.78.1
  GIT_SHALLOW    TRUE
)

FetchContent_MakeAvailable(grpc)

# To use the `protobuf_generate` function.
include(${protobuf_SOURCE_DIR}/cmake/protobuf-generate.cmake)

find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBEVENT REQUIRED libevent)
pkg_check_modules(LIBNGHTTP2 REQUIRED libnghttp2)

include_directories(
    ${LIBEVENT_INCLUDE_DIRS}
    ${LIBNGHTTP2_INCLUDE_DIRS}
    ${CMAKE_CURRENT_BINARY_DIR}
)

link_directories(
    ${LIBEVENT_LIBRARY_DIRS}
    ${LIBNGHTTP2_LIBRARY_DIRS}
)

# Protobuf/gRPC generation

add_library(echo_proto_lib OBJECT "${CMAKE_CURRENT_LIST_DIR}/proto/echo.proto")

set(PROTO_BINARY_DIR "${CMAKE_CURRENT_BINARY_DIR}/generated")
set(PROTO_IMPORT_DIRS "${CMAKE_CURRENT_LIST_DIR}/proto")

protobuf_generate(
    TARGET echo_proto_lib
    IMPORT_DIRS ${PROTO_IMPORT_DIRS}
    PROTOC_OUT_DIR ${PROTO_BINARY_DIR})

protobuf_generate(
    TARGET echo_proto_lib
    LANGUAGE grpc
    GENERATE_EXTENSIONS .grpc.pb.h .grpc.pb.cc
    PLUGIN "protoc-gen-grpc=\$<TARGET_FILE:grpc_cpp_plugin>"
    IMPORT_DIRS ${PROTO_IMPORT_DIRS}
    PROTOC_OUT_DIR ${PROTO_BINARY_DIR})

target_include_directories(echo_proto_lib PUBLIC "$<BUILD_INTERFACE:${PROTO_BINARY_DIR}>")
target_link_libraries(echo_proto_lib PUBLIC grpc++ libprotobuf)

# HTTP/2 Benchmarks
add_executable(h2_echo_server server.cc)
target_link_libraries(h2_echo_server ${LIBEVENT_LIBRARIES} ${LIBNGHTTP2_LIBRARIES} absl::log absl::log_initialize absl::flags absl::flags_parse "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>")

add_executable(h2_bench_client client.cc)
target_link_libraries(h2_bench_client ${LIBEVENT_LIBRARIES} ${LIBNGHTTP2_LIBRARIES} absl::log absl::log_initialize absl::flags absl::flags_parse "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>")

# gRPC Benchmarks
add_executable(grpc_echo_server grpc_server.cc)
target_link_libraries(grpc_echo_server echo_proto_lib absl::log absl::log_initialize absl::flags absl::flags_parse "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>")

add_executable(grpc_bench_client grpc_client.cc)
target_link_libraries(grpc_bench_client echo_proto_lib absl::log absl::log_initialize absl::flags absl::flags_parse "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>")
