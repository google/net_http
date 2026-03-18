cmake_minimum_required(VERSION 3.15)
project(http2_benchmark)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_BUILD_TYPE Release)

include(FetchContent)

set(FETCHCONTENT_QUIET OFF)

set(ABSL_ENABLE_INSTALL OFF CACHE BOOL "" FORCE)
set(ABSL_PROPAGATE_CXX_STD ON)
FetchContent_Declare(
  abseil
  GIT_REPOSITORY https://github.com/abseil/abseil-cpp.git
  GIT_TAG        20260107.1
)
FetchContent_MakeAvailable(abseil)

set(BENCHMARK_ENABLE_TESTING OFF CACHE BOOL "Disable benchmark tests" FORCE)
set(BENCHMARK_INSTALL OFF CACHE BOOL "Disable benchmark install" FORCE)
set(BENCHMARK_INSTALL_DOCS OFF CACHE BOOL "Disable benchmark install docs" FORCE)
set(BENCHMARK_INSTALL_TOOLS OFF CACHE BOOL "Disable benchmark install tools" FORCE)
FetchContent_Declare(
  googlebenchmark
  GIT_REPOSITORY https://github.com/google/benchmark
  GIT_TAG        v1.9.5
  GIT_SHALLOW    TRUE
)
FetchContent_MakeAvailable(googlebenchmark)

find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBEVENT REQUIRED IMPORTED_TARGET libevent)
pkg_check_modules(LIBNGHTTP2 REQUIRED IMPORTED_TARGET libnghttp2)

include_directories(
    ${LIBEVENT_INCLUDE_DIRS}
    ${LIBNGHTTP2_INCLUDE_DIRS}
    ${CMAKE_CURRENT_BINARY_DIR}
)

link_directories(
    ${LIBEVENT_LIBRARY_DIRS}
    ${LIBNGHTTP2_LIBRARY_DIRS}
)

add_executable(h2_echo_server server.cc)
target_link_libraries(h2_echo_server
    PkgConfig::LIBEVENT
    PkgConfig::LIBNGHTTP2
    absl::log
    absl::log_initialize
    absl::flags
    absl::flags_parse
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>")

add_executable(h2_bench_client client.cc)
target_link_libraries(h2_bench_client
    PkgConfig::LIBEVENT
    PkgConfig::LIBNGHTTP2
    absl::log
    absl::log_initialize
    absl::flags
    absl::flags_parse
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
    benchmark::benchmark)
