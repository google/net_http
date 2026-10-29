# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

cmake_minimum_required(VERSION 3.24)
project(wish_cpp LANGUAGES C CXX)


option(WISH_BUILD_TESTS "Build wish unit tests" ${PROJECT_IS_TOP_LEVEL})
option(WISH_BUILD_BENCHMARKS "Build wish benchmarks" ${PROJECT_IS_TOP_LEVEL})
option(WISH_BUILD_EXAMPLES "Build wish examples" ${PROJECT_IS_TOP_LEVEL})
option(WISH_BUILD_ECHO_SERVERS "Build echo servers for integration tests" OFF)


if(PROJECT_IS_TOP_LEVEL)
    set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
endif()
# Internal static libraries must be usable by a parent's shared-library build.
if(BUILD_SHARED_LIBS AND NOT DEFINED CMAKE_POSITION_INDEPENDENT_CODE)
    set(CMAKE_POSITION_INDEPENDENT_CODE ON)
endif()

include(cmake/Dependencies.cmake)
wish_fetch_dependencies()
FetchContent_GetProperties(libevent)
FetchContent_GetProperties(picohttpparser)

add_library(http1_handshake STATIC
    src/handshake.h
    src/handshake.cc
    ${picohttpparser_SOURCE_DIR}/picohttpparser.c
    ${picohttpparser_SOURCE_DIR}/picohttpparser.h
)
target_compile_features(http1_handshake PUBLIC cxx_std_17)
target_include_directories(http1_handshake
    PUBLIC "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/src>"
           "$<BUILD_INTERFACE:${libevent_SOURCE_DIR}/include>"
           "$<BUILD_INTERFACE:${libevent_BINARY_DIR}/include>"
    PRIVATE "${picohttpparser_SOURCE_DIR}")
target_link_libraries(http1_handshake PUBLIC event PRIVATE absl::strings absl::log)

# We will compile libevent's bufferevent_openssl.c inside our library
# since we disabled it in libevent's own build.
# PIC follows the embedding project, including Python extension builds.
add_library(web_stream_core STATIC
    src/web_stream.h
    src/buffer_event_web_stream.cc
    src/buffer_event_web_stream.h
    ${libevent_SOURCE_DIR}/bufferevent_openssl.c
    ${libevent_SOURCE_DIR}/bufferevent_ssl.c
    src/tls_context.cc
    src/tls_context.h
    src/nghttp2_web_stream.cc
    src/nghttp2_web_stream.h
)
target_link_libraries(web_stream_core
    PUBLIC http1_handshake ssl crypto nghttp2_static
    PRIVATE wslay absl::strings absl::log)
target_compile_definitions(web_stream_core PUBLIC EVENT__HAVE_OPENSSL=1)

add_library(web_stream_client STATIC
    src/plain_client.cc
    src/plain_client.h
    src/tls_client.cc
    src/tls_client.h
    src/h2_client.cc
    src/h2_client.h
    src/h2_tls_client.cc
    src/h2_tls_client.h
)
target_link_libraries(web_stream_client PUBLIC web_stream_core PRIVATE absl::strings absl::log)

add_library(web_stream_server STATIC
    src/plain_server.cc
    src/plain_server.h
    src/tls_server.cc
    src/tls_server.h
    src/h2_server.cc
    src/h2_server.h
    src/h2_tls_server.cc
    src/h2_tls_server.h
)
target_link_libraries(web_stream_server PUBLIC web_stream_core PRIVATE absl::log)

add_library(web_stream INTERFACE)
add_library(web_stream::web_stream ALIAS web_stream)
target_link_libraries(web_stream INTERFACE web_stream_client web_stream_server)


if(WISH_BUILD_EXAMPLES OR WISH_BUILD_ECHO_SERVERS)
    add_subdirectory(examples)
endif()

if(WISH_BUILD_BENCHMARKS)
    add_subdirectory(benchmark)
endif()

if(WISH_BUILD_TESTS)
    enable_testing()

    add_executable(buffer_event_web_stream_test src/buffer_event_web_stream_test.cc)
    target_link_libraries(buffer_event_web_stream_test PRIVATE web_stream gtest_main gtest)
    add_test(NAME buffer_event_web_stream_test COMMAND buffer_event_web_stream_test)

    add_executable(nghttp2_web_stream_test src/nghttp2_web_stream_test.cc)
    target_link_libraries(nghttp2_web_stream_test PRIVATE web_stream gtest_main gtest)
    add_test(NAME nghttp2_web_stream_test COMMAND nghttp2_web_stream_test)

    add_executable(handshake_test src/handshake_test.cc)
    target_link_libraries(handshake_test PRIVATE http1_handshake gtest_main gtest event)
    add_test(NAME handshake_test COMMAND handshake_test)

    add_executable(h2_server_test src/h2_server_test.cc)
    target_link_libraries(h2_server_test PRIVATE web_stream gtest_main gtest event)
    add_test(NAME h2_server_test COMMAND h2_server_test)
endif()
