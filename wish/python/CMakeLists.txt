cmake_minimum_required(VERSION 3.14)
project(web_stream_python)


set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)


if (CMAKE_VERSION VERSION_LESS 3.18)
  set(DEV_MODULE Development)
else()
  set(DEV_MODULE Development.Module)
endif()

find_package(Python 3.9 COMPONENTS Interpreter ${DEV_MODULE} REQUIRED)

if (NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
  set(CMAKE_BUILD_TYPE Release CACHE STRING "Choose the type of build." FORCE)
  set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()

# Detect the installed nanobind package and import it into CMake
execute_process(
  COMMAND "${Python_EXECUTABLE}" -m nanobind --cmake_dir
  OUTPUT_STRIP_TRAILING_WHITESPACE OUTPUT_VARIABLE nanobind_ROOT)
find_package(nanobind CONFIG REQUIRED)


# Exclude examples and tests from cpp/CMakeLists.txt
set(WISH_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(WISH_BUILD_BENCHMARKS OFF CACHE BOOL "" FORCE)
set(WISH_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
add_subdirectory(../cpp web_stream_cpp_build)


nanobind_add_module(web_stream_ext src/web_stream_ext.cc)

# Provide the include directory so web_stream_ext.cc can find tls_client.h etc.
target_include_directories(web_stream_ext PRIVATE ../cpp/src)
target_link_libraries(web_stream_ext PRIVATE web_stream event_pthreads)

install(TARGETS web_stream_ext DESTINATION web_stream)
