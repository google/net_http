cmake_minimum_required(VERSION 3.14)
project(wish_python)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

find_package(Python 3.9 COMPONENTS Interpreter Development.Module REQUIRED)
find_package(nanobind CONFIG REQUIRED)

# Force static libevent for the Python extension
set(EVENT__LIBRARY_TYPE STATIC CACHE STRING "" FORCE)

# Exclude examples and tests from cpp/CMakeLists.txt
set(BUILD_TESTING OFF CACHE BOOL "" FORCE)
set(WISH_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(WISH_BUILD_BENCHMARKS OFF CACHE BOOL "" FORCE)
set(WISH_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
add_subdirectory(../cpp wish_cpp_build)

nanobind_add_module(wish_ext src/wish_ext.cc)

# Provide the include directory so wish_ext.cc can find tls_client.h etc.
target_include_directories(wish_ext PRIVATE ../cpp/src)
target_link_libraries(wish_ext PRIVATE wish_handler event_pthreads)

install(TARGETS wish_ext DESTINATION wish)
