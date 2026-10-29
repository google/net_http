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

# Standalone development builds include tests; wheel builds only need bindings.
if(SKBUILD)
  set(_python_tests_default OFF)
else()
  set(_python_tests_default ON)
endif()
option(WISH_PYTHON_BUILD_TESTS "Build prerequisites and register Python tests"
       ${_python_tests_default})

# Build only the C++ components needed by bindings and optional Python tests.
set(WISH_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(WISH_BUILD_BENCHMARKS OFF CACHE BOOL "" FORCE)
set(WISH_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(WISH_BUILD_ECHO_SERVERS ${WISH_PYTHON_BUILD_TESTS} CACHE BOOL "" FORCE)
add_subdirectory(../cpp web_stream_cpp_build)


nanobind_add_module(web_stream_ext src/web_stream_ext.cc src/runtime.cc)

# Provide the include directory so web_stream_ext.cc can find tls_client.h etc.
target_include_directories(web_stream_ext PRIVATE ../cpp/src)
target_link_libraries(web_stream_ext PRIVATE web_stream event_pthreads)

install(TARGETS web_stream_ext DESTINATION web_stream)

if(WISH_PYTHON_BUILD_TESTS)
  enable_testing()
  function(add_python_check suite)
    set(command "${Python_EXECUTABLE}" "${CMAKE_CURRENT_SOURCE_DIR}/tests/run_tests.py"
        --suite "${suite}" --extension "$<TARGET_FILE:web_stream_ext>")
    set(prerequisites web_stream_ext)
    if(suite STREQUAL "all" OR suite STREQUAL "core")
      list(APPEND command
          --plain-echo-server "$<TARGET_FILE:plain_echo_server>"
          --tls-echo-server "$<TARGET_FILE:tls_echo_server>")
      list(APPEND prerequisites plain_echo_server tls_echo_server)
    endif()
    if(suite STREQUAL "all")
      set(target check-python)
    else()
      set(target check-python-${suite})
      add_test(NAME python_${suite}_tests COMMAND ${command})
      set_tests_properties(python_${suite}_tests PROPERTIES LABELS "python;${suite}")
    endif()
    add_custom_target(${target}
        COMMAND ${command} DEPENDS ${prerequisites}
        USES_TERMINAL VERBATIM)
  endfunction()
  foreach(suite all core asgi fastapi)
    add_python_check(${suite})
  endforeach()
endif()
