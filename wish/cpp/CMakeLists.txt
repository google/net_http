cmake_minimum_required(VERSION 3.14)
project(wish_cpp)

option(WISH_BUILD_TESTS "Build wish unit tests" ON)
option(WISH_BUILD_BENCHMARKS "Build wish benchmarks" ON)
option(WISH_BUILD_EXAMPLES "Build wish examples" ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

set(ABSL_ENABLE_INSTALL OFF CACHE BOOL "" FORCE)
set(ABSL_PROPAGATE_CXX_STD ON)
FetchContent_Declare(
    abseil
    GIT_REPOSITORY https://github.com/abseil/abseil-cpp.git
    GIT_TAG        20260107.1
)

set(WSLAY_TESTS OFF CACHE BOOL "" FORCE)
set(WSLAY_EXAMPLES OFF CACHE BOOL "" FORCE)
FetchContent_Declare(
    wslay
    GIT_REPOSITORY https://github.com/tatsuhiro-t/wslay.git
    GIT_TAG        master
    PATCH_COMMAND  git apply --reverse --check ${CMAKE_CURRENT_SOURCE_DIR}/patches/wslay-disable-mask.patch || git apply ${CMAKE_CURRENT_SOURCE_DIR}/patches/wslay-disable-mask.patch
)

# Disable OpenSSL and Mbed TLS. We use BoringSSL instead.
set(EVENT__DISABLE_OPENSSL ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_MBEDTLS ON CACHE BOOL "" FORCE)

set(EVENT__DISABLE_BENCHMARKS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_TESTS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_REGRESS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_SAMPLES ON CACHE BOOL "" FORCE)

FetchContent_Declare(
    libevent
    GIT_REPOSITORY https://github.com/libevent/libevent.git
    GIT_TAG        master
)

FetchContent_Declare(
    boringssl
    GIT_REPOSITORY https://boringssl.googlesource.com/boringssl
    GIT_TAG        0.20260211.0
)

if(WISH_BUILD_BENCHMARKS)
    set(BENCHMARK_ENABLE_TESTING OFF CACHE BOOL "" FORCE)
    set(BENCHMARK_ENABLE_GTEST_TESTS OFF CACHE BOOL "" FORCE)
    set(BENCHMARK_ENABLE_INSTALL OFF CACHE BOOL "" FORCE)
    set(BENCHMARK_INSTALL_DOCS OFF CACHE BOOL "" FORCE)
    set(BENCHMARK_DOWNLOAD_DEPENDENCIES OFF CACHE BOOL "" FORCE)
    FetchContent_Declare(
        googlebenchmark
        GIT_REPOSITORY https://github.com/google/benchmark.git
        GIT_TAG        main
    )
endif()

# Exclude tests, benchmarks, sample files, etc. from dependencies.
set(BUILD_TESTING OFF CACHE BOOL "" FORCE)

if(WISH_BUILD_TESTS)
    FetchContent_Declare(
        googletest
        GIT_REPOSITORY https://github.com/google/googletest.git
        GIT_TAG        v1.17.0
    )
endif()

FetchContent_MakeAvailable(wslay libevent boringssl abseil)

if(WISH_BUILD_BENCHMARKS)
    FetchContent_MakeAvailable(googlebenchmark)
endif()

if(WISH_BUILD_TESTS)
    FetchContent_MakeAvailable(googletest)
endif()

include_directories(${wslay_SOURCE_DIR}/lib/includes)
include_directories(${libevent_SOURCE_DIR}/include)
include_directories(${libevent_BINARY_DIR}/include)
include_directories(${boringssl_SOURCE_DIR}/include)
include_directories(src)

# We will compile libevent's bufferevent_openssl.c inside our library
# since we disabled it in libevent's own build.
add_library(wish_handler
    src/wish_handler.cc
    src/wish_handler.h
    ${libevent_SOURCE_DIR}/bufferevent_openssl.c
    ${libevent_SOURCE_DIR}/bufferevent_ssl.c
    src/tls_context.cc
    src/tls_context.h
    src/tls_server.cc
    src/tls_server.h
    src/tls_client.cc
    src/tls_client.h
    src/plain_client.cc
    src/plain_client.h
)
# BoringSSL targets: ssl and crypto
target_link_libraries(wish_handler wslay event ssl crypto)

if(WISH_BUILD_EXAMPLES)
    add_subdirectory(examples)
endif()

if(WISH_BUILD_BENCHMARKS)
    add_subdirectory(benchmark)
endif()

if(WISH_BUILD_TESTS)
    enable_testing()
    add_executable(wish_handler_test src/wish_handler_test.cc)
    target_link_libraries(wish_handler_test wish_handler gtest_main gtest event wslay)
    add_test(NAME wish_handler_test COMMAND wish_handler_test)
endif()
