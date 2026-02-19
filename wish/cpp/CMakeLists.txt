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
# Disable OpenSSL and other heavy features for libevent to keep build fast/simple if possible
set(EVENT__DISABLE_OPENSSL ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_MBEDTLS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_TESTS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_REGRESS ON CACHE BOOL "" FORCE)
set(EVENT__DISABLE_SAMPLES ON CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(wslay libevent)

include_directories(${wslay_SOURCE_DIR}/lib/includes)
include_directories(${libevent_SOURCE_DIR}/include)
include_directories(${libevent_BINARY_DIR}/include)
include_directories(src)

add_library(wish_handler
    src/wish_handler.cc
    src/wish_handler.h
)
target_link_libraries(wish_handler wslay event)

add_executable(wish-server examples/server.cc)
target_link_libraries(wish-server wish_handler)

add_executable(wish-client examples/client.cc)
target_link_libraries(wish-client wish_handler)
