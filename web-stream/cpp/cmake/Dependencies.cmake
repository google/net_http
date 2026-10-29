include(FetchContent)

# Normal variables in this function override dependency options without changing
# the caller's cache. Targets and FetchContent properties remain available after
# the function returns; temporary options and policy defaults do not.
function(wish_fetch_dependencies)
    set(CMAKE_POLICY_DEFAULT_CMP0077 NEW)
    set(CMAKE_POLICY_DEFAULT_CMP0126 NEW)
    if(NOT CMAKE_CXX_STANDARD OR CMAKE_CXX_STANDARD LESS 17)
        set(CMAKE_CXX_STANDARD 17)
    endif()
    set(CMAKE_CXX_STANDARD_REQUIRED ON)
    set(BUILD_TESTING OFF)
    set(BUILD_SHARED_LIBS OFF)
    # BoringSSL otherwise changes the caller's default install prefix in CACHE.
    set(CMAKE_INSTALL_PREFIX_INITIALIZED_TO_DEFAULT FALSE)
    # Several dependencies otherwise FORCE a default into the parent's cache.
    if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
        set(CMAKE_BUILD_TYPE Release)
    endif()

    # The pinned wslay declares CMake 2.8 policies. CMake 4 requires a newer
    # compatibility floor; keep this adjustment local to dependency setup.
    if(CMAKE_VERSION VERSION_GREATER_EQUAL 4.0)
        if(NOT DEFINED CMAKE_POLICY_VERSION_MINIMUM OR
           CMAKE_POLICY_VERSION_MINIMUM VERSION_LESS 3.10)
            set(CMAKE_POLICY_VERSION_MINIMUM 3.10)
        endif()
    endif()

    set(ABSL_ENABLE_INSTALL OFF)
    set(ABSL_PROPAGATE_CXX_STD ON)
    FetchContent_Declare(abseil
        GIT_REPOSITORY https://github.com/abseil/abseil-cpp.git
        GIT_TAG 255c84dadd029fd8ad25c5efb5933e47beaa00c7) # 20260107.1
    FetchContent_MakeAvailable(abseil)

    set(ENABLE_FAILMALLOC OFF)
    set(BUILD_STATIC_LIBS ON)
    set(ENABLE_LIB_ONLY ON)
    set(ENABLE_DOC OFF)
    set(WITH_LIBXML2 OFF)
    set(WITH_JEMALLOC OFF)
    set(WITH_MRUBY OFF)
    set(WITH_NEVERBLEED OFF)
    FetchContent_Declare(nghttp2
        GIT_REPOSITORY https://github.com/nghttp2/nghttp2.git
        GIT_TAG 68cb6900fde14c77f0cd7add0e094a862960eb99) # v1.69.0
    # nghttp2 uses cmake_dependent_option(BUILD_TESTING), which writes CACHE
    # even under CMP0077=NEW. Preserve that one entry explicitly; normal
    # function scope handles the other options without touching their caches.
    get_property(had_build_testing CACHE BUILD_TESTING PROPERTY TYPE SET)
    if(had_build_testing)
        get_property(saved_testing CACHE BUILD_TESTING PROPERTY VALUE)
        get_property(saved_testing_type CACHE BUILD_TESTING PROPERTY TYPE)
        get_property(saved_testing_help CACHE BUILD_TESTING PROPERTY HELPSTRING)
    endif()
    FetchContent_MakeAvailable(nghttp2)
    if(had_build_testing)
        set(BUILD_TESTING "${saved_testing}" CACHE "${saved_testing_type}"
            "${saved_testing_help}" FORCE)
    else()
        unset(BUILD_TESTING CACHE)
    endif()

    set(WSLAY_TESTS OFF)
    set(WSLAY_EXAMPLES OFF)
    set(WSLAY_STATIC ON)
    set(WSLAY_SHARED OFF)
    set(WSLAY_CONFIGURE_INSTALL OFF)
    FetchContent_Declare(wslay
        GIT_REPOSITORY https://github.com/tatsuhiro-t/wslay.git
        GIT_TAG 0e7d106ff89ad6638090fd811a9b2e4c5dda8d40
        PATCH_COMMAND "${CMAKE_COMMAND}"
            "-DSOURCE_DIR=<SOURCE_DIR>"
            "-DPATCH_FILE=${CMAKE_CURRENT_FUNCTION_LIST_DIR}/../patches/wslay.patch"
            -P "${CMAKE_CURRENT_FUNCTION_LIST_DIR}/PatchWslay.cmake")

    # Compile libevent's SSL adapter against BoringSSL in web_stream_core.
    set(EVENT__DISABLE_OPENSSL ON)
    set(EVENT__DISABLE_MBEDTLS ON)
    set(EVENT__LIBRARY_TYPE STATIC)
    set(EVENT__DISABLE_BENCHMARKS ON)
    set(EVENT__DISABLE_TESTS ON)
    set(EVENT__DISABLE_REGRESS ON)
    set(EVENT__DISABLE_SAMPLES ON)
    FetchContent_Declare(libevent
        GIT_REPOSITORY https://github.com/libevent/libevent.git
        GIT_TAG 780acfe8b2495949f0dc3ebd6f18eea2dec605a6)

    FetchContent_Declare(boringssl
        GIT_REPOSITORY https://boringssl.googlesource.com/boringssl
        GIT_TAG 0.20260211.0)
    FetchContent_Declare(picohttpparser
        GIT_REPOSITORY https://github.com/h2o/picohttpparser.git
        GIT_TAG 539bb9f510f5aefc8efda53aaf822a21ecae2832) # v1.2
    FetchContent_MakeAvailable(wslay libevent boringssl picohttpparser)

    if(WISH_BUILD_BENCHMARKS)
        set(BENCHMARK_ENABLE_TESTING OFF)
        set(BENCHMARK_ENABLE_GTEST_TESTS OFF)
        set(BENCHMARK_ENABLE_INSTALL OFF)
        set(BENCHMARK_INSTALL_DOCS OFF)
        set(BENCHMARK_DOWNLOAD_DEPENDENCIES OFF)
        FetchContent_Declare(googlebenchmark
            GIT_REPOSITORY https://github.com/google/benchmark.git
            GIT_TAG 192ef10025eb2c4cdd392bc502f0c852196baa48) # v1.9.5
        FetchContent_MakeAvailable(googlebenchmark)
    endif()
    if(WISH_BUILD_TESTS)
        FetchContent_Declare(googletest
            GIT_REPOSITORY https://github.com/google/googletest.git
            GIT_TAG 52eb8108c5bdec04579160ae17225d66034bd723) # v1.17.0
        FetchContent_MakeAvailable(googletest)
    endif()
endfunction()
