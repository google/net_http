cmake_minimum_required(VERSION 3.14)
project(wish_cpp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

FetchContent_Declare(
    wslay
    GIT_REPOSITORY https://github.com/tatsuhiro-t/wslay.git
    GIT_TAG        master
)

FetchContent_Declare(
    libevent
    GIT_REPOSITORY https://github.com/libevent/libevent.git
    GIT_TAG        master
)

FetchContent_Declare(
    boringssl
    GIT_REPOSITORY https://boringssl.googlesource.com/boringssl
    GIT_TAG        main
)

# Disable OpenSSL and Mbed TLS. We use BoringSSL instead.
set(EVENT__DISABLE_OPENSSL ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_MBEDTLS ON CACHE BOOL "" FORCE)

# Exclude tests, sample files, etc. that we don't need.
set(EVENT__DISABLE_BENCHMARKS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_TESTS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_REGRESS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_SAMPLES ON CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(wslay libevent boringssl)

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
)
# BoringSSL targets: ssl and crypto
target_link_libraries(wish_handler wslay event ssl crypto)

add_executable(wish-server examples/server.cc)
target_link_libraries(wish-server wish_handler)

add_executable(wish-client examples/client.cc)
target_link_libraries(wish-client wish_handler)
