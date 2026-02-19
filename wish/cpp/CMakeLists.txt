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
FetchContent_MakeAvailable(wslay)

include_directories(${wslay_SOURCE_DIR}/lib/includes)
include_directories(src)

add_library(socket_utils
    src/socket_utils.cc
    src/socket_utils.hpp
)

add_library(wish_handler
    src/wish_handler.cc
    src/wish_handler.hpp
)
target_link_libraries(wish_handler wslay socket_utils)

add_executable(wish-server examples/server.cc)
target_link_libraries(wish-server wish_handler)

add_executable(wish-client examples/client.cc)
target_link_libraries(wish-client wish_handler)
