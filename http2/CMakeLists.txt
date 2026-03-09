cmake_minimum_required(VERSION 3.15)
project(http2_benchmark)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

set(FETCHCONTENT_QUIET OFF)

# Abseil
set(ABSL_ENABLE_INSTALL OFF CACHE BOOL "" FORCE)
set(ABSL_PROPAGATE_CXX_STD ON)

FetchContent_Declare(
  abseil
  GIT_REPOSITORY https://github.com/abseil/abseil-cpp.git
  GIT_TAG        20260107.1
)

FetchContent_MakeAvailable(abseil)

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

add_executable(h2_echo_server server.cc)
target_link_libraries(h2_echo_server ${LIBEVENT_LIBRARIES} ${LIBNGHTTP2_LIBRARIES} absl::log absl::log_initialize absl::flags absl::flags_parse "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>")

add_executable(h2_bench_client client.cc)
target_link_libraries(h2_bench_client ${LIBEVENT_LIBRARIES} ${LIBNGHTTP2_LIBRARIES} absl::log absl::log_initialize absl::flags absl::flags_parse "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>")
