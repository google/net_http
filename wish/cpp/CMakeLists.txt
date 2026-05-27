cmake_minimum_required(VERSION 3.14)
project(wish_cpp)


option(WISH_BUILD_TESTS "Build wish unit tests" ON)
option(WISH_BUILD_BENCHMARKS "Build wish benchmarks" ON)
option(WISH_BUILD_EXAMPLES "Build wish examples" ON)


set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

# Exclude tests, benchmarks, sample files, etc. from dependencies.
# Set before any MakeAvailable so no dep accidentally enables testing.
set(BUILD_TESTING OFF CACHE BOOL "" FORCE)


set(ABSL_ENABLE_INSTALL OFF CACHE BOOL "" FORCE)
set(ABSL_PROPAGATE_CXX_STD ON)

# Static-build abseil in order to use WHOLE_ARCHIVE to force linking of log_flags static initializer
set(BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)

FetchContent_Declare(
    abseil
    GIT_REPOSITORY https://github.com/abseil/abseil-cpp.git
    GIT_TAG        20260107.1
)
FetchContent_MakeAvailable(abseil)

unset(BUILD_SHARED_LIBS CACHE)


set(WSLAY_TESTS OFF CACHE BOOL "" FORCE)
set(WSLAY_EXAMPLES OFF CACHE BOOL "" FORCE)

FetchContent_Declare(
    wslay
    GIT_REPOSITORY https://github.com/tatsuhiro-t/wslay.git
    GIT_TAG        0e7d106ff89ad6638090fd811a9b2e4c5dda8d40
    PATCH_COMMAND  git apply --reverse --check ${CMAKE_CURRENT_SOURCE_DIR}/patches/wslay-disable-mask.patch || git apply ${CMAKE_CURRENT_SOURCE_DIR}/patches/wslay-disable-mask.patch
)


# Disable OpenSSL and Mbed TLS. We use BoringSSL instead.
set(EVENT__DISABLE_OPENSSL ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_MBEDTLS ON CACHE BOOL "" FORCE)

# Build libevent as a static library so executables are self-contained.
set(EVENT__LIBRARY_TYPE STATIC CACHE STRING "" FORCE)

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


# These variables are unprefixed, so MakeAvailable is called immediately and
# they are unset afterwards to avoid leaking into other dependencies.

# nghttp2: build only the core library (no TLS apps, no examples).
set(ENABLE_LIB_ONLY         ON  CACHE BOOL "" FORCE)
set(ENABLE_APP              OFF CACHE BOOL "" FORCE)
set(ENABLE_HPACK_TOOLS      OFF CACHE BOOL "" FORCE)
set(ENABLE_DOC              OFF CACHE BOOL "" FORCE)
set(ENABLE_PYTHON_BINDINGS  OFF CACHE BOOL "" FORCE)
set(ENABLE_EXAMPLES         OFF CACHE BOOL "" FORCE)
set(ENABLE_FAILMALLOC       OFF CACHE BOOL "" FORCE)
set(WITH_JEMALLOC           OFF CACHE BOOL "" FORCE)
set(WITH_LIBEVENT_OPENSSL   OFF CACHE BOOL "" FORCE)
set(WITH_OPENSSL            OFF CACHE BOOL "" FORCE)
set(WITH_LIBXML2            OFF CACHE BOOL "" FORCE)
set(WITH_SYSTEMD            OFF CACHE BOOL "" FORCE)
set(WITH_MRUBY              OFF CACHE BOOL "" FORCE)
set(WITH_NEVERBLEED         OFF CACHE BOOL "" FORCE)

# Since BUILD_SHARED_LIBS=OFF, we need to explicitly enable the static target (nghttp2_static)
set(BUILD_SHARED_LIBS       OFF CACHE BOOL "" FORCE)
set(BUILD_STATIC_LIBS       ON  CACHE BOOL "" FORCE)

FetchContent_Declare(
    nghttp2
    GIT_REPOSITORY https://github.com/nghttp2/nghttp2.git
    GIT_TAG        v1.65.0
)
FetchContent_MakeAvailable(nghttp2)

# Reset the cached variables to avoid affecting other dependencies. They are not prefixed.
foreach(_var IN ITEMS
        ENABLE_LIB_ONLY ENABLE_APP ENABLE_HPACK_TOOLS ENABLE_DOC
        ENABLE_PYTHON_BINDINGS ENABLE_EXAMPLES ENABLE_FAILMALLOC
        WITH_JEMALLOC WITH_LIBEVENT_OPENSSL WITH_OPENSSL WITH_LIBXML2
        WITH_SYSTEMD WITH_MRUBY WITH_NEVERBLEED BUILD_STATIC_LIBS BUILD_SHARED_LIBS)
    unset(${_var} CACHE)
endforeach()


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
    FetchContent_MakeAvailable(googlebenchmark)
endif()

if(WISH_BUILD_TESTS)
    FetchContent_Declare(
        googletest
        GIT_REPOSITORY https://github.com/google/googletest.git
        GIT_TAG        v1.17.0
    )
    FetchContent_MakeAvailable(googletest)
endif()


FetchContent_MakeAvailable(wslay libevent boringssl)


include_directories(${wslay_SOURCE_DIR}/lib/includes)
include_directories(${libevent_SOURCE_DIR}/include)
include_directories(${libevent_BINARY_DIR}/include)
include_directories(${boringssl_SOURCE_DIR}/include)
include_directories(${nghttp2_SOURCE_DIR}/lib/includes)
include_directories(${nghttp2_BINARY_DIR}/lib/includes)
include_directories(src)

# We will compile libevent's bufferevent_openssl.c inside our library
# since we disabled it in libevent's own build.
# Build as a static library: libevent is also static and was not compiled with
# -fPIC, so it cannot be linked into a shared object.
add_library(wish_handler STATIC
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
    src/h2_wish_stream.cc
    src/h2_wish_stream.h
    src/h2_server.cc
    src/h2_server.h
    src/h2_tls_server.cc
    src/h2_tls_server.h
    src/h2_client.cc
    src/h2_client.h
    src/h2_tls_client.cc
    src/h2_tls_client.h
)
# BoringSSL targets: ssl and crypto.  nghttp2 for HTTP/2 framing.
target_link_libraries(wish_handler wslay event ssl crypto nghttp2::nghttp2)

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

    add_executable(h2_wish_stream_test src/h2_wish_stream_test.cc)
    target_link_libraries(h2_wish_stream_test wish_handler gtest_main gtest nghttp2::nghttp2 wslay)
    add_test(NAME h2_wish_stream_test COMMAND h2_wish_stream_test)
endif()
