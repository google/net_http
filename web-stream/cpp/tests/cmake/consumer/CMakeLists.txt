cmake_minimum_required(VERSION 3.24)
project(web_stream_consumer_test LANGUAGES C CXX)

# Exercise embedding with conflicting dependency options and an older parent
# language standard. Neither cache entries nor normal variables may be changed.
option(BUILD_SHARED_LIBS "Build the consumer as a shared library" ON)
option(BUILD_TESTING "Enable parent tests" ON)
option(ENABLE_DOC "Enable parent documentation" ON)
option(WITH_LIBXML2 "Enable parent XML support" ON)
set(CMAKE_CXX_STANDARD 11)
set(checked_variables BUILD_SHARED_LIBS BUILD_TESTING ENABLE_DOC WITH_LIBXML2
    CMAKE_CXX_STANDARD CMAKE_BUILD_TYPE CMAKE_INSTALL_PREFIX
    CMAKE_POLICY_VERSION_MINIMUM CMAKE_POSITION_INDEPENDENT_CODE)
foreach(variable IN LISTS checked_variables)
    set(before_${variable} "${${variable}}")
    get_property(before_cache_${variable} CACHE "${variable}" PROPERTY VALUE)
    get_property(before_type_${variable} CACHE "${variable}" PROPERTY TYPE)
endforeach()

get_filename_component(web_stream_source "${CMAKE_CURRENT_LIST_DIR}/../../.." ABSOLUTE)
add_subdirectory("${web_stream_source}" web_stream_cpp)

foreach(variable IN LISTS checked_variables)
    get_property(after_cache CACHE "${variable}" PROPERTY VALUE)
    get_property(after_type CACHE "${variable}" PROPERTY TYPE)
    if(NOT "${${variable}}" STREQUAL "${before_${variable}}" OR
       NOT "${after_cache}" STREQUAL "${before_cache_${variable}}" OR
       NOT "${after_type}" STREQUAL "${before_type_${variable}}")
        message(FATAL_ERROR
            "web-stream changed the parent's ${variable}: "
            "value '${before_${variable}}' -> '${${variable}}', "
            "cache '${before_cache_${variable}}' -> '${after_cache}', "
            "type '${before_type_${variable}}' -> '${after_type}'")
    endif()
endforeach()

add_library(consumer consumer.cc)
target_link_libraries(consumer PRIVATE web_stream::web_stream)
get_target_property(consumer_type consumer TYPE)
if(BUILD_SHARED_LIBS AND NOT consumer_type STREQUAL "SHARED_LIBRARY")
    message(FATAL_ERROR "The parent consumer must remain a shared library")
endif()
add_executable(consumer_smoke main.cc)
target_link_libraries(consumer_smoke PRIVATE consumer)
enable_testing()
add_test(NAME consumer_smoke COMMAND consumer_smoke)
