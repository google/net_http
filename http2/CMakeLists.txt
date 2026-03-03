cmake_minimum_required(VERSION 3.10)
project(http2_echo_server C)

set(CMAKE_C_STANDARD 11)

find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBEVENT REQUIRED libevent)
pkg_check_modules(LIBNGHTTP2 REQUIRED libnghttp2)

include_directories(
    ${LIBEVENT_INCLUDE_DIRS}
    ${LIBNGHTTP2_INCLUDE_DIRS}
)

link_directories(
    ${LIBEVENT_LIBRARY_DIRS}
    ${LIBNGHTTP2_LIBRARY_DIRS}
)

add_executable(h2_echo_server server.c)
target_link_libraries(h2_echo_server ${LIBEVENT_LIBRARIES} ${LIBNGHTTP2_LIBRARIES})

add_executable(h2_bench_client client.c)
target_link_libraries(h2_bench_client ${LIBEVENT_LIBRARIES} ${LIBNGHTTP2_LIBRARIES})
